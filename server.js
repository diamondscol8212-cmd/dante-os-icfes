// server.js - Gateway Central Orquestador Multi-Tenant (Dante OS v22.0.0-RC1 Enterprise Gold)
// Bogotá, Colombia
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';
import catRouter from './src/routes/catRoutes.js';
import authRouter from './src/routes/authRoutes.js'; 
import adminRouter from './src/routes/adminRoutes.js';
import vocationalRouter from './src/routes/vocationalRoutes.js';
import recorridoRouter from './src/routes/recorridoRoutes.js';
import dailyRouter from './src/routes/dailyRoutes.js';
import mindRouter from './src/routes/mindRoutes.js';
import { cmmiGovernanceEngine } from './src/security/cmmiGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;
const SERVER_VERSION = "Dante OS v22.0.0-RC1 (Enterprise Gold - Production Ready)";

// 📡 INICIALIZACIÓN SUAVE DE SENTRY OBSERVABILIDAD EN BACKEND CON SCRUBBING PII (LEY 1581)
if (process.env.SENTRY_DSN) {
    try {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'production',
            tracesSampleRate: 0.2,
            beforeSend(event) {
                // Scrubbing de datos personales sensibles (Habeas Data Menores - Ley 1581)
                if (event.request && event.request.headers) {
                    delete event.request.headers['cookie'];
                    delete event.request.headers['authorization'];
                }
                if (event.user) {
                    delete event.user.ip_address;
                    delete event.user.email;
                }
                return event;
            }
        });
        console.log('📡 [SENTRY OBSERVABILITY]: Backend Sentry SDK inicializado con filtro PII.');
    } catch {
        // Fallback silencioso sin advertencias en consola
    }
}

// 🛡️ CONFIGURACIÓN HELMET & POLÍTICA DE SEGURIDAD CONTENT-SECURITY-POLICY (CSP)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdn.tailwindcss.com", "https://browser.sentry-cdn.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
            imgSrc: ["'self'", "data:", "blob:", "https:"],
            connectSrc: ["'self'", "https:", "wss:", "ws:", "https://*.sentry.io"],
            frameAncestors: ["'self'", "https://*.google.com", "https://*.googleusercontent.com", "https://*.run.app", "https://*.ai.studio", "https://ai.studio"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: false,
    dnsPrefetchControl: { allow: true }
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
app.use(cmmiGovernanceEngine.middleware());

// 🛡️ LIMITADORES DE TASA DE PETICIONES (RATE LIMITING ANTI-BRUTE FORCE / DDoS)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutos
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de peticiones globales excedido. Por favor intente más tarde." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutos
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Demasiados intentos de autenticación desde esta IP. Por favor intente en unos minutos." }
});

const catLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minuto
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de tasa en evaluación adaptativa excedido. Por favor responda a un ritmo normal." }
});

const arcoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hora
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Límite de solicitudes de supresión ARCO excedido por hora." }
});

// Aplicación de Limitadores Perimetrales (Incluyendo Aliases v1)
app.use('/api/', globalLimiter);
app.use('/api/auth/login-perimetral', authLimiter);
app.use('/api/v1/auth/login-perimetral', authLimiter);
app.use('/api/auth/register-secure-user', authLimiter);
app.use('/api/v1/auth/register-secure-user', authLimiter);
app.use('/api/auth/arco/hard-delete', arcoLimiter);
app.use('/api/v1/users/arco/hard-delete', arcoLimiter);
app.use('/api/cat/interactuar', catLimiter);
app.use('/api/v1/cat/interactuar', catLimiter);

// 🛡️ Middleware de Encabezados Perimetrales Complementarios Zero-Trust
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    console.log(`📡 [GATEWAY MULTI-TENANT ${SERVER_VERSION}] -> ${req.method} desde ${req.url}`);
    next();
});

// ====================================================================
// 🛡️ MONTAJE DE RUTAS CORE DEL SISTEMA OPERATIVO COGNITIVO (v1 PRIMARIO + LEGACY ALIASES)
// ====================================================================
// 1. Rutas Primarias v1
app.use('/api/v1/cat', catRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', authRouter);
app.use('/api/v1/vocational', vocationalRouter);
app.use('/api/v1/dante', recorridoRouter);
app.use('/api/v1/dante', dailyRouter);
app.use('/api/v1/dante', mindRouter);

// 2. Rutas Heredadas (Backward Compatibility Aliases)
app.use('/api/cat', catRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/vocational', vocationalRouter);
app.use('/api/dante', recorridoRouter);
app.use('/api/dante', dailyRouter);
app.use('/api/dante', mindRouter);
app.use('/api/neuro', catRouter);
app.use('/api/v1/neuro', catRouter);
app.use('/api/contracts', catRouter);
app.use('/api/v1/contracts', catRouter);

app.get(['/api/stimuli/:id', '/api/v1/stimuli/:id'], (req, res, next) => {
    req.url = `/stimuli/${req.params.id}`;
    catRouter(req, res, next);
});

// TELEMETRÍA Y SEGUIMIENTO DE BOLETÍN PARENTAL
app.post(['/api/v1/telemetry/reporte-padres', '/api/telemetry/reporte-padres'], (req, res) => {
    const { event, studentId, timestamp, token, meta, proyectado } = req.body || {};
    console.log(`📡 [BOLETÍN PARENTAL TELEMETRÍA]: Alumno ${studentId || 'anon'} compartió reporte parental. Evento: ${event || 'REPORT_SENT'}`);
    return res.status(200).json({
        success: true,
        message: "Reporte parental registrado exitosamente",
        registroId: `rep_${Date.now()}`,
        timestamp: timestamp || new Date().toISOString()
    });
});

// ENDPOINT DE MONITOREO DE SALUD DEL CLÚSTER (HEALTHCHECK)
app.get(['/api/health', '/api/v1/health'], (req, res) => {
    return res.status(200).json({ success: true, status: "HEALTHY", version: SERVER_VERSION, timestamp: new Date().toISOString() });
});

// ====================================================================
// 🪐 ENTRADA DE INTERFAZ GRÁFICA (Vistas Estáticas)
// ====================================================================
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders(res, filePath) {
        if (filePath.endsWith('.html') || filePath.endsWith('service-worker.js')) {
            res.setHeader('Cache-Control', 'no-store');
        }
    }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/boletin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'boletin.html'));
});

app.get('/reset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset.html'));
});

// ====================================================================
// 🛡️ MIDDLEWARE DE ERRORES GLOBAL Y CONTROL DE RESILIENCIA DEL PROCESO
// ====================================================================
app.use((err, req, res, _next) => {
    console.error('🚨 [EXPRESS UNHANDLED ROUTE ERROR]:', err);
    
    if (process.env.SENTRY_DSN) {
        try {
            Sentry.captureException(err);
        } catch {}
    }

    const responsePayload = {
        success: false,
        error: "Error interno del servidor. Proceso recuperado por middleware de resiliencia."
    };

    if (process.env.NODE_ENV === 'development') {
        responsePayload.details = err.message || "Excepción no controlada";
    }

    res.status(err.status || 500).json(responsePayload);
});

process.on('unhandledRejection', (reason, _promise) => {
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
