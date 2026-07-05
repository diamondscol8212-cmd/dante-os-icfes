import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import crypto from 'crypto'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './supabaseClient.js';
import { redis } from './redisClient.js'; 
import { procesarInteraccionEstudiante } from './src/services/catController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:3000', 'http://127.0.0.1:5500', 
    'http://localhost:5500', 'https://danteos.com',
    'https://app.danteos.com', 'null', 'file://',
    'https://dante-os-platform.onrender.com'
];

app.use(cors({
    origin(origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        return callback(new Error(`Origin [${origin}] bloqueado por Dante OS Perimeter Firewalls.`));
    }
}));

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
    console.log(`📡 [TRÁFICO EN VIVO MULTI-TENANT] -> ${req.method} desde ${req.url}`);
    next();
});

const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET || 'DANTE_OS_LEGENDBLIND_SECRET_2026';

// ====================================================================
// 🪐 GESTIÓN DE COHORTE EN MEMORIA DINÁMICA
// ====================================================================
async function inicializarCohorteTenantBase(tenantId) {
    const key = `dante:${tenantId}:system:cohorte_global`;
    try {
        const existe = await redis.exists(key);
        if (!existe) {
            await redis.sadd(key, "elizabeth", "samantha");
        }
    } catch (err) {
        console.error(`⚠️ [REDIS COHORTE INIT ERROR T-${tenantId}]:`, err.message);
    }
}
inicializarCohorteTenantBase("colegio_sandbox_default");

app.get('/api/admin/obtain-cohorte', async (req, res) => {
    try {
        const tenantId = req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const key = `dante:${tenantId.toLowerCase().trim()}:system:cohorte_global`;
        const miembros = await redis.smembers(key);
        return res.status(200).json({ success: true, cohorte: miembros.sort(), institution_id: tenantId });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/obtener-cohorte', async (req, res) => {
    try {
        const tenantId = req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const key = `dante:${tenantId.toLowerCase().trim()}:system:cohorte_global`;
        const miembros = await redis.smembers(key);
        return res.status(200).json({ success: true, cohorte: miembros.sort(), institution_id: tenantId });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/registrar-estudiante', async (req, res) => {
    try {
        const { nombreEstudiante, institution_id } = req.body;
        const tenantId = institution_id || req.headers['x-institution-id'] || "colegio_sandbox_default";
        if (!nombreEstudiante) return res.status(400).json({ success: false, error: "Falta identificador." });
        
        const cleanName = String(nombreEstudiante).toLowerCase().trim();
        const tenantClean = String(tenantId).toLowerCase().trim();
        const key = `dante:${tenantClean}:system:cohorte_global`;
        
        await redis.sadd(key, cleanName);
        return res.status(200).json({ success: true, message: `Estudiante ${cleanName} matriculado.` });
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
        
        const { data: progresoActual } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .eq('materia', materiaFiltro)
            .eq('institution_id', tenantClean);
            
        let sumaPuntajes = 0;
        let conteoAlumnos = progresoActual?.length || 0;
        const desgloseAlumnos = {};

        if (progresoActual && progresoActual.length > 0) {
            progresoActual.forEach(p => {
                const thetaVal = parseFloat(p.theta || p.theta_final || 0);
                const puntaje = Math.max(0, Math.min(100, Math.round(50 + (thetaVal * 13.5))));
                sumaPuntajes += puntaje;
                desgloseAlumnos[p.estudiante] = { theta: thetaVal, puntaje_escalonado: puntaje };
            });
        }

        const promedioIcfesArea = conteoAlumnos > 0 ? Math.round(sumaPuntajes / conteoAlumnos) : 50;

        const snapshotAtomico = {
            id: crypto.randomUUID(), materia: materiaFiltro, institution_id: tenantClean,
            total_estudiantes_evaluados: conteoAlumnos, puntaje_promedio_icfes: promedioIcfesArea,
            matriz_desglose_snapshot: desgloseAlumnos, creado_at: new Date().toISOString()
        };

        await supabase.from('reportes_historicos_cohortes').insert(snapshotAtomico);

        await supabase
            .from('progreso_estudiantes')
            .delete()
            .eq('materia', materiaFiltro)
            .eq('institution_id', tenantClean);

        const patronSesiones = `dante:${tenantClean}:session:${materiaFiltro}:*`;
        const llaves = await redis.keys(patronSesiones);
        if (llaves.length > 0) { await redis.del(...llaves); }
        
        return res.status(200).json({ success: true, message: `Instantánea Histórica guardada con éxito y época purgada.` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/cat/interactuar', async (req, res, next) => {
    const { studentId, sessionId, responseTime, itemId, institution_id } = req.body;
    const tenantId = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();

    if (!itemId) {
        const tokenToken = crypto.createHmac('sha256', INTEGRITY_SECRET)
            .update(`${tenantId}:${studentId}:${sessionId}`)
            .digest('hex');
            
        await redis.set(`dante:${tenantId}:token:security:${sessionId}`, tokenToken, 'EX', 3600);
        req.body.generatedToken = tokenToken;
        return procesarInteraccionEstudiante(req, res);
    }

    try {
        if (responseTime <= 0.01) {
            return res.status(400).json({ success: false, error: "Dante OS Multitenant: Latencia inválida." });
        }
        return procesarInteraccionEstudiante(req, res);
    } catch (err) {
        return res.status(500).json({ success: false, error: "Excepción en Firewalls." });
    }
});

// ====================================================================
// 🪐 AUDITORÍA NOMINAL ADAPTATIVA - EXTRACCIÓN HÍBRIDA ELÁSTICA
// ====================================================================
app.get('/api/cat/auditoria', async (req, res) => {
    try {
        const { estudiante, materia, institution_id } = req.query;
        const tenantId = String(institution_id || req.headers['x-institution-id'] || "colegio_sandbox_default").toLowerCase().trim();
        
        let query = supabase.from('progreso_estudiantes').select('*').eq('institution_id', tenantId).order('ultima_actualizacion', { ascending: true });
        if (estudiante) query = query.eq('estudiante', String(estudiante).toLowerCase().trim());
        
        const materiaFiltro = materia ? String(materia).toLowerCase().trim() : 'matematicas';
        query = query.eq('materia', materiaFiltro);

        const { data, error } = await query;
        if (error) throw error;

        const datosSaneados = await Promise.all((data || []).map(async (r) => {
            const studentIdClean = String(r.estudiante).toLowerCase().trim();
            const thetaValue = parseFloat(r.theta || r.theta_final || 0);
            const puntajeSintetizado = Math.max(0, Math.min(100, Math.round(50 + (thetaValue * 13.5))));
            
            const redisExecutiveMetaKey = `dante:executive:report:${materiaFiltro}:${studentIdClean}`;
            let adnExtraido = null;
            let mapaCalorExtraido = null;

            try {
                const cachedMeta = await redis.get(redisExecutiveMetaKey);
                if (cachedMeta) {
                    const parsed = JSON.parse(cachedMeta);
                    mapaCalorExtraido = parsed.mapa_calor_sesgos || { attr_error_geometrico: 0.02, attr_heuristica_lineal: 0.02 };
                    adnExtraido = {
                        impulsividad: parsed.impulsividad !== undefined ? parsed.impulsividad : 20,
                        fatiga: parsed.fatiga !== undefined ? parsed.fatiga : 0,
                        recuperacion: parsed.recuperacion !== undefined ? parsed.recuperacion : 50,
                        estabilidad: parsed.estabilidad !== undefined ? parsed.estabilidad : 75,
                        cronica_narrativa: parsed.cronica_narrativa || "Trayectoria longitudinal nominal registrada.",
                        vulnerabilidad_dominante: parsed.vulnerabilidad_dominante || "Sin anomalías críticas registradas.",
                        prescripcion_clinica: parsed.prescripcion_clinica || "Mantener el flujo adaptativo."
                    };
                }
            } catch (err) {}

            if (!adnExtraido) {
                adnExtraido = {
                    impulsividad: 23, fatiga: 0, recuperacion: 50, estabilidad: 88.5,
                    cronica_narrativa: `${studentIdClean.toUpperCase()} opera con estabilidad en el clúster unificado.`,
                    vulnerabilidad_dominante: "Estabilidad cognitiva nominal.", prescripcion_clinica: "Continuar el flujo adaptativo estándar."
                };
                mapaCalorExtraido = { attr_error_geometrico: 0.02, attr_heuristica_lineal: 0.02 };
            }

            return {
                ...r,
                area_general: r.materia || materiaFiltro,
                items_respondidos: Array.isArray(r.items_respondidos) ? r.items_respondidos : [],
                theta_final: thetaValue,
                mapa_calor_sesgos: mapaCalorExtraido,
                adn_cognitivo: adnExtraido,
                puntaje_escalonado: Number(r.puntaje_escalonado || puntajeSintetizado),
                updated_at: r.ultima_actualizacion || new Date().toISOString()
            };
        }));

        return res.status(200).json({ success: true, data: datosSaneados });
    } catch (error) { 
        return res.status(500).json({ success: false }); 
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`\n🚀 [DANTE OS GATEWAY MULTI-TENANT RUNNING]: Servidor activo en http://localhost:${PORT}`));
