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
    'https://app.danteos.com', 'null', 'file://'
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
const REDIS_COHORTE_KEY = "dante:system:cohorte_global";

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
        console.log(`👤 [TENANT COHORTE EXPANSION]: [${tenantClean}] -> Registrado alumno -> [${cleanName}]`);
        return res.status(200).json({ success: true, message: `Estudiante ${cleanName} matriculado.` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 🪐 PERSISTENCIA HISTÓRICA E SNAPSHOTS MULTI-TENANT
// ====================================================================
app.get('/api/admin/obtener-epocas-historicas', async (req, res) => {
    try {
        const tenantId = req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const tenantClean = String(tenantId).toLowerCase().trim();
        const { data, error } = await supabase
            .from('reportes_historicos_cohortes')
            .select('*')
            .eq('institution_id', tenantClean)
            .order('creado_at', { ascending: false });
            
        if (error) throw error;
        return res.status(200).json({ success: true, epocas: data || [] });
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

        const patronSesiones = `dante:${tenantClean}:session:${materiaFiltro}:*`;
        const llaves = await redis.keys(patronSesiones);
        if (llaves.length > 0) {
            await redis.del(...llaves);
        }
        return res.status(200).json({ success: true, message: `Instantánea Histórica guardada con éxito.` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 🪐 GATEWAY INTERCEPTOR CON BYPASS DE COMPATIBILIDAD CON CACHÉ COGNITIVA
// ====================================================================
app.post('/api/cat/interactuar', async (req, res, next) => {
    const { studentId, sessionId, integrityToken, itemHash, responseTime, itemId, institution_id } = req.body;
    const tenantId = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();

    if (!itemId) {
        const tokenToken = crypto.createHmac('sha256', INTEGRITY_SECRET)
            .update(`${tenantId}:${studentId}:${sessionId}`)
            .digest('hex');
            
        await redis.set(`dante:${tenantId}:token:security:${sessionId}`, tokenToken, 'EX', 3600);
        
        // 🪐 BYPASS DE COMPATIBILIDAD: Limpiamos los campos extendidos antes de pasárselos a catController
        req.body.generatedToken = tokenToken;
        return procesarInteraccionEstudiante(req, res);
    }

    try {
        const cachedToken = await redis.get(`dante:${tenantId}:token:security:${sessionId}`);
        if (!cachedToken || cachedToken !== integrityToken) {
            return res.status(403).json({ success: false, error: "Dante OS Multitenant: Violación de token perimetral." });
        }

        if (responseTime <= 0.01) {
            return res.status(400).json({ success: false, error: "Dante OS Multitenant: Latencia inválida." });
        }

        const localItemHash = crypto.createHmac('sha256', INTEGRITY_SECRET).update(itemId).digest('hex');
        if (itemHash !== localItemHash) {
            return res.status(401).json({ success: false, error: "Dante OS Multitenant: Firma corrupta." });
        }

        // 🪐 BYPASS SANITIZATION: Removemos los decoradores extras para que el motor clásico corra limpio
        delete req.body.integrityToken;
        delete req.body.itemHash;
        delete req.body.institution_id;

        return procesarInteraccionEstudiante(req, res);

    } catch (err) {
        return res.status(500).json({ success: false, error: "Excepción en Firewalls." });
    }
});

// ====================================================================
// 🪐 AUDITORÍA NOMINAL ADAPTATIVA
// ====================================================================
app.get('/api/cat/auditoria', async (req, res) => {
    try {
        const { estudiante, materia, institution_id } = req.query;
        const tenantId = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();
        
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
            
            const redisExecutiveMetaKey = `dante:${tenantId}:executive:report:${materiaFiltro}:${studentIdClean}`;
            let adnExtraido = null;
            let mapaCalorExtraido = null;

            try {
                const cachedMeta = await redis.get(redisExecutiveMetaKey);
                if (cachedMeta) {
                    const parsed = JSON.parse(cachedMeta);
                    mapaCalorExtraido = parsed.mapa_calor_sesgos;
                    adnExtraido = {
                        impulsividad: parsed.impulsividad, fatiga: parsed.fatiga, recuperacion: parsed.recuperacion, estabilidad: parsed.estabilidad,
                        cronica_narrativa: parsed.cronica_narrativa, vulnerabilidad_dominante: parsed.vulnerabilidad_dominante, prescripcion_clinica: parsed.prescripcion_clinica
                    };
                }
            } catch (err) {}

            if (!adnExtraido) {
                adnExtraido = {
                    impulsividad: 23, fatiga: 0, recuperacion: 50, estabilidad: 88.5,
                    cronica_narrativa: `${studentIdClean.toUpperCase()} opera con estabilidad en el clúster unificado.`,
                    vulnerabilidad_dominante: "Estabilidad cognitiva nominal.", prescripcion_clinica: "Continuar el flujo adaptativo."
                };
                mapaCalorExtraido = { attr_error_geometrico: 20, attr_heuristica_lineal: 35 };
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

app.get('/api/authoring/banco-calibracion', async (req, res) => {
    try {
        const { data, error } = await supabase.from('metricas_calibracion_items').select('*').order('total_interacciones', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
    } catch (error) { return res.status(500).json({ success: false }); }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`\n🚀 [DANTE OS GATEWAY MULTI-TENANT RUNNING]: Servidor activo en http://localhost:${PORT}`));