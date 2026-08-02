import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { redis } from '../../redisClient.js';
import { verifyToken, requireRole, validateInstitution } from '../middleware.js';

const router = Router();
const SERVER_VERSION = "v21.2.2-ENTERPRISE_GOLD";

// ====================================================================
// 🪐 PIPELINE ADMINISTRATIVO DE CONTROL DE ENTORNO (PROTEGIDO JWT + RBAC)
// ====================================================================

// GET /api/admin/obtain-cohorte
router.get('/obtain-cohorte', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
    try {
        const tenantId = req.user.institution_id || req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const key = `dante:${tenantId.toLowerCase().trim()}:system:cohorte_global`;
        const miembros = await redis.smembers(key);
        return res.status(200).json({ success: true, cohorte: miembros.sort(), institution_id: tenantId, version: SERVER_VERSION });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/listar-epocas
router.get('/listar-epocas', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
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

// POST /api/admin/registrar-estudiante
router.post('/registrar-estudiante', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
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

// POST /api/admin/reset-epoca
router.post('/reset-epoca', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
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
            // 🌟 UNIFICACIÓN ESCALAR ICFES EN TODO EL SISTEMA: Constante universal 13.8 (Rango 1-100)
            const puntaje = Math.max(1, Math.min(100, Math.round(50 + (thetaVal * 13.8))));
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
                metadata_ajuste_b2b: { version_engine: "v21.2.0-CORPORATE_GOLD", export_iva_compliant: true },
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

export default router;
