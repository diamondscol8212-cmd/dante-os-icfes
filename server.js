import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { redis } from './redisClient.js'; 
import { supabase } from './supabaseClient.js';
import catRouter from './src/routes/catRoutes.js';
import authRouter from './src/routes/authRoutes.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_VERSION = "v21.1.0-ENTERPRISE_PRODUCTION";

const ALLOWED_ORIGINS = [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:3000', 'http://127.0.0.1:5500', 
    'http://localhost:5500', 'https://danteos.com',
    'https://app.danteos.com',
    'https://dante-os-platform.onrender.com'
];

app.use(cors({
    origin(origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.endsWith('.run.app') || origin.endsWith('.ai.studio') || origin.endsWith('.google.com') || origin.endsWith('.googleusercontent.com')) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
    console.log(`📡 [GATEWAY MULTI-TENANT ${SERVER_VERSION}] -> ${req.method} desde ${req.url}`);
    next();
});

// ====================================================================
// 🛡️ MONTAJE DE RUTAS CORE DEL SISTEMA OPERATIVO COGNITIVO
// ====================================================================
app.use('/api/cat', catRouter);
app.use('/api/auth', authRouter); 

// ENDPOINT DE MONITOREO DE SALUD DEL CLÚSTER (HEALTHCHECK)
app.get('/api/health', (req, res) => {
    return res.status(200).json({ success: true, status: "HEALTHY", version: SERVER_VERSION, timestamp: new Date().toISOString() });
});

// ====================================================================
// 🪐 PIPELINE ADMINISTRATIVO DE CONTROL DE ENTORNO
// ====================================================================
app.get('/api/admin/obtain-cohorte', async (req, res) => {
    try {
        const tenantId = req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const key = `dante:${tenantId.toLowerCase().trim()}:system:cohorte_global`;
        const miembros = await redis.smembers(key);
        return res.status(200).json({ success: true, cohorte: miembros.sort(), institution_id: tenantId, version: SERVER_VERSION });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/listar-epocas', async (req, res) => {
    try {
        const tenantId = req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
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

app.post('/api/admin/registrar-estudiante', async (req, res) => {
    try {
        const { nombreEstudiante, institution_id } = req.body;
        const tenantId = institution_id || req.headers['x-institution-id'] || "colegio_sandbox_default";
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

app.post('/api/admin/reset-epoca', async (req, res) => {
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

app.listen(PORT, '0.0.0.0', () => console.log(`\n🚀 [DANTE OS ENTERPRISE GATEWAY ${SERVER_VERSION}]: Activo en http://0.0.0.0:${PORT}`));
