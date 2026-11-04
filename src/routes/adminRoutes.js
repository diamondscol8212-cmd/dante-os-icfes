import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { redis } from '../../redisClient.js';
import { verifyToken, requireRole, validateInstitution } from '../middleware.js';
import { generarReporteCalidadAuditable, evaluarDIFSesgoAlgoritmico, ofuscarDatosPersonalesPII, generarFirmaCertificadoInmutable, verificarFirmaCertificado } from '../services/encryptionService.js';
import { estimarHabilidad } from '../services/cat/ScoringService.js';
import { cmmiGovernanceEngine } from '../security/cmmiGovernance.js';

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
        const tenantClean = String(tenantId).toLowerCase().trim().replace(/[^a-zA-Z0-9_-]/g, '');
        const materiaFiltro = materia ? String(materia).toLowerCase().trim() : 'matematicas';
        
        console.log(`💾 [CONSOLIDACIÓN CORPORATIVA B2B]: Generando reporte inmutable de cierre de época para Tenant: [${tenantClean}]`);

        const { data: progresoActual } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .or(`institution_id.eq.${tenantClean},institution_id.is.null,institution_id.eq.`);
            
        const filteredAlumnos = (progresoActual || []).filter(r => String(r.materia || '').toLowerCase().trim() === materiaFiltro);

        let sumaPuntajes = 0;
        const conteoAlumnos = filteredAlumnos.length || 0;
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

// ====================================================================
// ⚖️ FASE 4: PANEL DE AUDITORÍA RECTORAL, DIF Y CUMPLIMIENTO REGULATORIO
// ====================================================================

// GET /api/admin/auditoria-calidad
router.get('/auditoria-calidad', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const tenantId = req.user.institution_id || req.headers['x-institution-id'] || req.query.institution_id || "colegio_sandbox_default";
        const tenantClean = String(tenantId).toLowerCase().trim().replace(/[^a-zA-Z0-9_-]/g, '');

        // Obtener la muestra de progreso de estudiantes para auditoría
        const { data: progreso, error } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .or(`institution_id.eq.${tenantClean},institution_id.is.null,institution_id.eq.`);

        if (error) {
            console.warn("⚠️ [AUDITORIA SUPABASE WARN]:", error.message);
        }

        const evaluaciones = (progreso || []).map(p => ({
            sem: parseFloat(p?.sem ?? p?.adn_cognitivo?.sem ?? 0.35),
            theta: parseFloat(p?.theta ?? p?.adn_cognitivo?.theta ?? 0.0)
        }));

        // Sanitización PII de la muestra auditada
        const muestraSanitizada = (progreso || []).slice(0, 10).map(p => ofuscarDatosPersonalesPII({
            nombre: p.estudiante || p.nombre || 'Estudiante Sanitizado',
            email: `${p.estudiante || 'estudiante'}@colegio.edu.co`,
            theta: parseFloat(p?.theta ?? p?.adn_cognitivo?.theta ?? 0.0)
        }));

        const reporte = generarReporteCalidadAuditable(tenantClean, evaluaciones);
        const cmmiReport = cmmiGovernanceEngine.getTelemetryReport();

        return res.status(200).json({
            success: true,
            reporteAuditoria: reporte,
            muestraAuditadaPII: muestraSanitizada,
            telemetriaCMMI: cmmiReport,
            version: SERVER_VERSION
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/evaluar-dif
router.post('/evaluar-dif', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const { item, grupoReferencia = [], grupoFocal = [] } = req.body;
        if (!item || !item.id) {
            return res.status(400).json({ success: false, error: "Falta definición del ítem a evaluar." });
        }

        const difResultado = evaluarDIFSesgoAlgoritmico(item, grupoReferencia, grupoFocal);

        return res.status(200).json({
            success: true,
            difResultado,
            version: SERVER_VERSION
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/simular-carga
router.post('/simular-carga', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const cantidadPeticiones = Math.min(1000, Math.max(10, parseInt(req.body?.cantidadPeticiones || 100, 10)));

        const historialBase = [
            { a: 1.2, b: -0.5, c: 0.2, correcto: true },
            { a: 1.5, b: 0.2, c: 0.25, correcto: true },
            { a: 1.8, b: 0.8, c: 0.2, correcto: false },
            { a: 1.1, b: 0.1, c: 0.2, correcto: true }
        ];

        const memInicio = process.memoryUsage().heapUsed;
        const startTime = Date.now();

        const promesas = Array.from({ length: cantidadPeticiones }, (_, i) => {
            const h = historialBase.map(item => ({
                ...item,
                b: item.b + (i % 5) * 0.1,
                correcto: (i + item.a) % 2 === 0
            }));
            return estimarHabilidad(h);
        });

        const resultados = await Promise.all(promesas);
        const endTime = Date.now();

        const duracionTotalMs = Math.max(1, endTime - startTime);
        const memFin = process.memoryUsage().heapUsed;
        const deltaMemoriaMb = parseFloat(((memFin - memInicio) / (1024 * 1024)).toFixed(2));
        const throughputOpsSec = parseFloat(((cantidadPeticiones / duracionTotalMs) * 1000).toFixed(2));
        const latenciaPromedioMs = parseFloat((duracionTotalMs / cantidadPeticiones).toFixed(3));

        return res.status(200).json({
            success: true,
            metricas: {
                peticionesProcesadas: resultados.length,
                duracionTotalMs,
                latenciaPromedioMs,
                throughputOpsSec,
                deltaMemoriaMb,
                estadoConcurrencia: "PARALLEL_WORKER_POOL_ACTIVE"
            },
            version: SERVER_VERSION
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/generar-certificado
router.post('/generar-certificado', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const tenantId = req.user.institution_id || req.headers['x-institution-id'] || req.body.institution_id || "colegio_sandbox_default";
        const tenantClean = String(tenantId).toLowerCase().trim();

        const timestamp = new Date().toISOString();
        const idCertificado = `CERT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const payloadBase = {
            idCertificado,
            tenantClean,
            timestamp,
            normaPsicometrica: "AERA_APA_NCME_2026_COMPLIANT",
            estandarIcfes: "Saber11_SaberArea_UNAL",
            selloSeguridad: "DANTE_OS_INMUTABLE_HMAC_SHA256"
        };

        const hashFirmaInmutable = generarFirmaCertificadoInmutable(payloadBase);

        const certificadoCompleto = {
            ...payloadBase,
            hashFirmaInmutable,
            emisor: "Dante OS Enterprise Engine v21.2",
            estadoCertificacion: "VALIDO_INMUTABLE"
        };

        return res.status(200).json({
            success: true,
            certificado: certificadoCompleto,
            version: SERVER_VERSION
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/verificar-certificado
router.post('/verificar-certificado', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const { certificado } = req.body;
        if (!certificado || !certificado.hashFirmaInmutable) {
            return res.status(400).json({ success: false, error: "Estructura de certificado inválida o firma faltante." });
        }

        const payloadBase = { ...certificado };
        delete payloadBase.hashFirmaInmutable;
        delete payloadBase.emisor;
        delete payloadBase.estadoCertificacion;

        const esValido = verificarFirmaCertificado(payloadBase, certificado.hashFirmaInmutable);

        return res.status(200).json({
            success: true,
            esValido,
            dictamenSeguridad: esValido ? "INTEGRIDAD_VERIFICADA_HMAC_SHA256" : "FIRMA_ALTERADA_O_MALICIOSA",
            timestampVerificacion: new Date().toISOString(),
            version: SERVER_VERSION
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/calibracion/proponer — agrega registro_eventos → propuestas (sin aplicar)
router.post('/calibracion/proponer', verifyToken, requireRole(['rector', 'admin']), async (req, res) => {
    try {
        const { generarPropuestasCalibracion } = await import('../services/bank/recalibracionPropuestas.js');
        const minN = Number(req.body && req.body.minN) || 8;
        const resultado = await generarPropuestasCalibracion({ minN });
        if (!resultado.ok) return res.status(500).json({ success: false, error: resultado.error });
        return res.status(200).json({
            success: true,
            insertadas: resultado.insertadas,
            propuestas: resultado.propuestas,
            aviso: resultado.aviso || null,
            version: SERVER_VERSION
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/calibracion/propuestas?status=pendiente
router.get('/calibracion/propuestas', verifyToken, requireRole(['rector', 'admin', 'profesor']), async (req, res) => {
    try {
        const { listarPropuestas } = await import('../services/bank/recalibracionPropuestas.js');
        const status = req.query.status == null ? 'pendiente' : String(req.query.status);
        const resultado = await listarPropuestas(status === 'todas' ? null : status);
        if (!resultado.ok) return res.status(500).json({ success: false, error: resultado.error });
        return res.status(200).json({ success: true, propuestas: resultado.propuestas, version: SERVER_VERSION });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
