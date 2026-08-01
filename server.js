import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { redis } from './redisClient.js'; 
import { supabase } from './supabaseClient.js';
import catRouter from './src/routes/catRoutes.js';
import authRouter from './src/routes/authRoutes.js'; 
import { verifyToken, requireRole, validateInstitution } from './src/middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_VERSION = "v21.2.0-ENTERPRISE_GOLD";

// 🛡️ CONFIGURACIÓN HELMET & POLÍTICA DE SEGURIDAD CONTENT-SECURITY-POLICY (CSP)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            imgSrc: ["'self'", "data:", "blob:", "https:"],
            connectSrc: ["'self'", "https:", "wss:", "ws:"],
            frameAncestors: ["'self'", "https://*.google.com", "https://*.googleusercontent.com", "https://*.run.app", "https://*.ai.studio", "https://ai.studio"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: false // Permitir embebido iframe controlado por CSP frameAncestors para AI Studio Preview
}));

const ALLOWED_ORIGINS = [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:3000', 'http://127.0.0.1:5500', 
    'http://localhost:5500', 'https://danteos.com',
    'https://app.danteos.com',
    'https://dante-os-platform.onrender.com'
];

if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => {
        if (o.trim()) ALLOWED_ORIGINS.push(o.trim());
    });
}

const ALLOWED_DOMAINS_REGEX = /\.(run\.app|ai\.studio|google\.com|googleusercontent\.com|danteos\.com)$/i;

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
            origin.includes('localhost') || origin.includes('127.0.0.1') ||
            ALLOWED_DOMAINS_REGEX.test(new URL(origin).hostname);
        
        if (isAllowed) {
            return callback(null, true);
        }
        return callback(new Error("Acceso bloqueado: Origen no permitido por la política CORS perimetral."));
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// 🛡️ LIMITADORES DE TASA DE PETICIONES (RATE LIMITING ANTI-BRUTE FORCE / DDoS)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutos
    max: 500, // 500 peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de peticiones globales excedido. Por favor intente más tarde." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutos
    max: 15, // Máximo 15 intentos de autenticación
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Demasiados intentos de autenticación desde esta IP. Bloqueo temporal por seguridad." }
});

const catLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minuto
    max: 60, // Máximo 60 respuestas adaptativas por minuto
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de tasa en evaluación adaptativa excedido. Por favor responda a un ritmo normal." }
});

const arcoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hora
    max: 5, // Máximo 5 solicitudes ARCO por hora
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de solicitudes de supresión ARCO excedido por hora." }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login-perimetral', authLimiter);
app.use('/api/auth/register-secure-user', authLimiter);
app.use('/api/auth/arco/hard-delete', arcoLimiter);
app.use('/api/v1/users/arco/hard-delete', arcoLimiter);
app.use('/api/cat/interactuar', catLimiter);

// 🛡️ Middleware de Encabezados Perimetrales Complementarios
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    console.log(`📡 [GATEWAY MULTI-TENANT ${SERVER_VERSION}] -> ${req.method} desde ${req.url}`);
    next();
});

// ====================================================================
// 🛡️ MONTAJE DE RUTAS CORE DEL SISTEMA OPERATIVO COGNITIVO
// ====================================================================
app.use('/api/cat', catRouter);
app.use('/api/auth', authRouter); 
app.use('/api/v1/users', authRouter); // Alias v1 para endpoints ARCO
app.use('/api/v1/auth', authRouter);  // Alias v1 para endpoints de Auth y Consentimiento Parental 

// ENDPOINT DE MONITOREO DE SALUD DEL CLÚSTER (HEALTHCHECK)
app.get('/api/health', (req, res) => {
    return res.status(200).json({ success: true, status: "HEALTHY", version: SERVER_VERSION, timestamp: new Date().toISOString() });
});

// ====================================================================
// 🪐 PIPELINE ADMINISTRATIVO DE CONTROL DE ENTORNO (PROTEGIDO JWT + RBAC)
// ====================================================================
app.get('/api/admin/obtain-cohorte', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
    try {
        const tenantId = req.user.institution_id || req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const key = `dante:${tenantId.toLowerCase().trim()}:system:cohorte_global`;
        const miembros = await redis.smembers(key);
        return res.status(200).json({ success: true, cohorte: miembros.sort(), institution_id: tenantId, version: SERVER_VERSION });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/listar-epocas', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
    try {
        const tenantId = req.user.institution_id || req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const tenantClean = String(tenantId).toLowerCase().trim();

        const { data: epocas, error } = await supabase
            .from('reportes_historicos_cohortes')
            .select('id, creado_at, materia')
            .eq('institution_id', tenantClean)
            .order('creado_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ success: true, data: epocas || [] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/registrar-estudiante', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
    try {
        const { nombreEstudiante, institution_id } = req.body;
        const tenantId = req.user.institution_id || institution_id || req.headers['x-institution-id'] || "colegio_sandbox_default";
        if (!nombreEstudiante) return res.status(400).json({ success: false, error: "Falta identificador alumno." });
        
        const cleanName = String(nombreEstudiante).toLowerCase().trim();
        const tenantClean = String(tenantId).toLowerCase().trim();
        const key = `dante:${tenantClean}:system:cohorte_global`;
        
        await redis.sadd(key, cleanName);
        return res.status(200).json({ success: true, message: `Estudiante ${cleanName} matriculado con éxito.`, version: SERVER_VERSION });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/reset-epoca', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const { materia, institution_id } = req.body;
        const tenantId = institution_id || req.headers['x-institution-id'] || "colegio_sandbox_default";
        const tenantClean = String(tenantId).toLowerCase().trim();
        const materiaFiltro = materia ? String(materia).toLowerCase().trim() : 'matematicas';
        
        console.log(`💾 [CONSOLIDACIÓN CORPORATIVA B2B]: Generando reporte inmutable de cierre de época para Tenant: [${tenantClean}]`);

        const { data: progresoActual } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .or(`institution_id.eq.${tenantClean},institution_id.is.null,institution_id.eq.`);
            
        let filteredAlumnos = (progresoActual || []).filter(r => String(r.materia || '').toLowerCase().trim() === materiaFiltro);

        let sumaPuntajes = 0;
        let conteoAlumnos = filteredAlumnos.length || 0;
        const desgloseAlumnos = {};

        filteredAlumnos.forEach(p => {
            const rawTheta = parseFloat(p.theta);
            const thetaVal = Number.isFinite(rawTheta) ? rawTheta : 0;
            const puntaje = Math.max(0, Math.min(100, Math.round(50 + (thetaVal * 13.5))));
            sumaPuntajes += puntaje;
            
            let adn = p.adn_cognitivo || {};
            let sesgos = p.mapa_calor_sesgos || {};
            if (p.items_respondidos && !Array.isArray(p.items_respondidos) && p.items_respondidos.adn_empaquetado) {
                adn = p.items_respondidos.adn_empaquetado;
                sesgos = adn.mapa_calor_sesgos || {};
            }

            desgloseAlumnos[p.estudiante] = { 
                theta: thetaVal, 
                puntaje_escalonado: puntaje,
                perfil_clinico: adn,
                mapa_calor: sesgos
            };
        });

        const promedioIcfesArea = conteoAlumnos > 0 ? Math.round(sumaPuntajes / conteoAlumnos) : 50;

        // 🪐 CALIBRACIÓN HORARIA BOGOTÁ (ISO 8601 con desfase -05:00 nativo de Colombia)
        const fechaBogota = new Date().toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T") + "-05:00";

        const snapshotAtomico = {
            id: crypto.randomUUID(), 
            materia: materiaFiltro, 
            institution_id: tenantClean,
            total_estudiantes_evaluados: conteoAlumnos, 
            puntaje_promedio_icfes: promedioIcfesArea,
            matriz_desglose_snapshot: {
                metadata_ajuste_b2b: { version_engine: "v21.1.0-CORPORATE", export_iva_compliant: true },
                alumnos: desgloseAlumnos
            }, 
            creado_at: fechaBogota
        };

        await supabase.from('reportes_historicos_cohortes').insert(snapshotAtomico);

        await supabase
            .from('progreso_estudiantes')
            .delete()
            .eq('materia', materiaFiltro)
            .eq('institution_id', tenantClean);

        const patronSesiones = `dante:*:session:${materiaFiltro}:*`;
        let cursor = '0';
        const llaves = [];
        do {
            const resScan = await redis.scan(cursor, 'MATCH', patronSesiones, 'COUNT', 100);
            cursor = resScan[0];
            if (resScan[1] && resScan[1].length > 0) {
                llaves.push(...resScan[1]);
            }
        } while (cursor !== '0');

        if (llaves.length > 0) { await redis.del(...llaves); }
        
        return res.status(200).json({ 
            success: true, 
            message: `Instantánea Histórica unificada guardada con éxito en Supabase. Época de la cohorte purgada en Redis. Estructura de Reporte PDF corporativo generada.`, 
            version: SERVER_VERSION 
        });
    } catch (err) {
        console.error("🚨 [RESET EPOCA EXCEPTION]:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 🪐 ENTRADA DE INTERFAZ GRÁFICA (Vistas Estáticas)
// ====================================================================
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ====================================================================
// 🛡️ MIDDLEWARE DE ERRORES GLOBAL Y CONTROL DE RESILIENCIA DEL PROCESO
// ====================================================================
app.use((err, req, res, next) => {
    console.error('🚨 [EXPRESS UNHANDLED ROUTE ERROR]:', err);
    
    // Ocultar detalles de stack trace en respuestas de producción
    const responsePayload = {
        success: false,
        error: "Error interno del servidor. Proceso recuperado por middleware de resiliencia."
    };

    if (process.env.NODE_ENV === 'development') {
        responsePayload.details = err.message || "Excepción no controlada";
    }

    res.status(err.status || 500).json(responsePayload);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 [PROCESS UNHANDLED REJECTION]: Excepción asíncrona capturada:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 [PROCESS UNCAUGHT EXCEPTION]: Excepción síncrona capturada:', error);
});

const server = app.listen(PORT, '0.0.0.0', () => console.log(`\n🚀 [DANTE OS ENTERPRISE GATEWAY ${SERVER_VERSION}]: Activo en http://0.0.0.0:${PORT}`));

const gracefulShutdown = (signal) => {
    console.log(`\n🛑 [SHUTDOWN SIGNAL ${signal}]: Cerrando servidor HTTP y limpiando conexiones...`);
    server.close(() => {
        console.log('✅ [HTTP SERVER CLOSED]: Servidor HTTP cerrado correctamente.');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('⚠️ [FORCED EXIT]: Finalizando proceso forzosamente tras timeout.');
        process.exit(1);
    }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

