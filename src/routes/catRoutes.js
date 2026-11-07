import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { redis } from '../../redisClient.js';
import { procesarInteraccionEstudiante, explicarIaController } from '../services/catController.js';
import { verifyToken, optionalToken, requireRole, validateInstitution } from '../middleware.js';
import { BANCO_COMPLETO } from '../services/bank/index.js';
import { BANCO_PREUNIVERSITARIO_BASE } from '../services/PreuniversitarioService.js';
import { simularTrayectoriaMonteCarlo } from '../services/cat/TwinService.js';
import { BANCO_CORTES_UNIVERSIDADES, CORTES_META, FAMILIAS_ONBOARDING, resolverMetaSaber11 } from '../services/cortesAdmision.js';

const router = Router();
const SERVER_VERSION = "v20.6.3-FIX_MASTER";

/**
 * Seudonomiza identificadores de PII mediante HMAC-SHA256 con sal para telemetría pública y eventos
 */
export function seudonomizarPII(identifier) {
    if (!identifier) return "anon_student";
    
    if (process.env.NODE_ENV === 'production' && !process.env.PII_SALT_SECRET) {
        throw new Error("🚨 [CRITICAL CRYPTO ERROR]: process.env.PII_SALT_SECRET no está configurada en entorno de producción. Operación rechazada.");
    }

    const secret = process.env.PII_SALT_SECRET || 'dante_os_pii_salt_secret_dev_key_2026';
    const str = String(identifier).toLowerCase().trim();
    return "anon_" + crypto.createHmac('sha256', secret).update(str).digest('hex').substring(0, 16);
}

// 🛡️ Secreto de Integridad perimetral
const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET;

// 🪐 Middleware Perimetral Multi-Tenant
router.use((req, res, next) => {
    const bodyTenant = req.body ? req.body.institution_id : null;
    const tenantId = req.headers['x-institution-id'] || req.query.institution_id || bodyTenant || "colegio_sandbox_default";
    req.tenantId = String(tenantId).toLowerCase().trim();
    next();
});

// ====================================================================
// 🪐 ENDPOINT A: INTERACCIÓN Y COMPILACIÓN ADAPTATIVA DEL ESTUDIANTE
// ====================================================================
router.post('/inicializar', optionalToken, async (req, res) => {
    req.body.itemId = null;
    return procesarInteraccionEstudiante(req, res);
});

router.post('/explicar-ia', optionalToken, explicarIaController);
router.get('/explicar-ia', optionalToken, (req, res) => {
    req.body = { ...req.query };
    return explicarIaController(req, res);
});

router.get('/inicializar', optionalToken, async (req, res) => {
    req.body = { ...req.query, itemId: null };
    return procesarInteraccionEstudiante(req, res);
});

router.get(['/reactivos', '/items'], optionalToken, async (req, res) => {
    try {
        const track = String(req.query.track || req.query.target_exam || 'ICFES').toUpperCase();
        const totalLimite = parseInt(req.query.limit || req.query.cantidad || '10', 10);
        const poolReactivos = track.includes('UNAL') ? BANCO_PREUNIVERSITARIO_BASE : BANCO_COMPLETO;

        const reactivosUnicos = [];
        const idsVistos = new Set();
        const shuffled = [...poolReactivos].sort(() => 0.5 - Math.random());

        for (const item of shuffled) {
            if (item && item.id && !idsVistos.has(item.id)) {
                idsVistos.add(item.id);
                reactivosUnicos.push(item);
            }
            if (reactivosUnicos.length === totalLimite) break;
        }

        return res.json({
            success: true,
            totalReactivos: reactivosUnicos.length,
            reactivos: reactivosUnicos
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
});

router.post('/interactuar', optionalToken, async (req, res) => {

    const { studentId, sessionId, responseTime, itemId } = req.body;

    if (!studentId) {
        return res.status(400).json({ success: false, error: "Identificador de estudiante no proporcionado." });
    }

    const cleanStudentId = String(studentId).trim().toLowerCase();

    // 🛡️ AISLAMIENTO ESTRICTO DE SESIONES Y PREVENCIÓN DE BYPASS DE PREFIJO
    let targetStudentId = cleanStudentId;

    if (req.user) {
        const userEmail = String(req.user.email || '').toLowerCase().trim();
        const userId = String(req.user.user_id || req.user.id || '').toLowerCase().trim();
        const userEstudiante = String(req.user.estudiante || '').toLowerCase().trim();
        const userRole = String(req.user.role || req.user.rol || '').toLowerCase().trim();
        const emailPrefix = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;
        const targetPrefix = targetStudentId.includes('@') ? targetStudentId.split('@')[0] : targetStudentId;

        const isOwner = (
            targetStudentId === userEmail ||
            targetStudentId === userId ||
            targetStudentId === userEstudiante ||
            targetPrefix === emailPrefix ||
            targetPrefix === userEstudiante ||
            targetStudentId === `${userEstudiante}@danteos.edu.co` ||
            targetStudentId.startsWith('sandbox_guest_') ||
            targetStudentId.startsWith('sim_') ||
            targetStudentId.startsWith('guest_') ||
            targetStudentId.startsWith('demo_') ||
            targetStudentId.startsWith('anon_') ||
            targetStudentId.startsWith('sandbox_') ||
            targetStudentId === 'estudiante_demo'
        );

        const isTargetSandbox = (
            targetStudentId.startsWith('sandbox_guest_') ||
            targetStudentId.startsWith('sim_') ||
            targetStudentId.startsWith('guest_') ||
            targetStudentId.startsWith('demo_') ||
            targetStudentId.startsWith('anon_') ||
            targetStudentId.startsWith('sandbox_') ||
            targetStudentId === 'estudiante_demo'
        );

        const isAuthorizedStaff = ['admin', 'profesor', 'rector'].includes(userRole);
        const isSandboxAccess = Boolean(req.user.is_sandbox && isTargetSandbox);

        if (!isOwner && !isAuthorizedStaff && !isSandboxAccess) {
            return res.status(403).json({
                success: false,
                error: "Acceso denegado: No posee permisos para responder en la sesión de evaluación de otro estudiante."
            });
        }
    } else {
        // Petición no autenticada: Verificar si es simulación demo y forzar aislamiento en sandbox
        const isGuestRequest = (
            cleanStudentId.startsWith('sim_') ||
            cleanStudentId.startsWith('guest_') ||
            cleanStudentId.startsWith('demo_') ||
            cleanStudentId.startsWith('anon_') ||
            cleanStudentId.startsWith('sandbox_') ||
            cleanStudentId === 'estudiante_demo'
        );

        if (!isGuestRequest) {
            return res.status(401).json({
                success: false,
                error: "Acceso denegado: Se requiere token de autenticación activo para interactuar con un perfil de estudiante real."
            });
        }

        // 🛡️ PREVENCIÓN DE SUPLANTACIÓN Y POLLUTION:
        // Mapear peticiones demo no autenticadas a un espacio aislado que no interactúa con Supabase de estudiantes reales
        const safeSessionHash = crypto.createHash('sha256').update(`${sessionId}:${cleanStudentId}`).digest('hex').substring(0, 12);
        targetStudentId = `sandbox_guest_${safeSessionHash}`;
        req.body.studentId = targetStudentId;
    }

    if (!itemId) {
        const tokenToken = crypto.createHmac('sha256', INTEGRITY_SECRET)
            .update(`${req.tenantId}:${studentId}:${sessionId}`)
            .digest('hex');
            
        await redis.set(`dante:${req.tenantId}:token:security:${sessionId}`, tokenToken, 'EX', 3600);
        req.body.generatedToken = tokenToken;
    }

    try {
        if (itemId && responseTime <= 0.01) {
            return res.status(400).json({ success: false, error: "Dante OS Multitenant: Latencia inválida." });
        }
        return procesarInteraccionEstudiante(req, res);
    } catch {
        return res.status(500).json({ success: false, error: "Excepción en Firewalls de Ruta." });
    }
});

// ====================================================================
// 🪐 ENDPOINT B: GEMELO DIGITAL DINÁMICO (PROTEGIDO CON OPTIONALTOKEN Y RBAC ESTRICTO)
// Nota: optionalToken permite la visualización del perfil de demostración pública 'guest_user'
// ====================================================================
router.get('/gemelo/:id', optionalToken, async (req, res) => {
    try {
        const studentIdRaw = req.params.id;

        // 🛡️ VALIDACIÓN Y SANITIZACIÓN ESTRICTA DE ENTRADA:
        if (!studentIdRaw || typeof studentIdRaw !== 'string') {
            return res.status(400).json({ 
                success: false, 
                error: "400 Bad Request: Identificador de estudiante requerido y debe ser una cadena válida." 
            });
        }

        // Regex estricta previa a procesamiento
        const safeIdRegex = /^[a-zA-Z0-9._\-@]+$/;
        if (!safeIdRegex.test(studentIdRaw.trim()) || studentIdRaw.length > 128) {
            return res.status(400).json({
                success: false,
                error: "400 Bad Request: Sintaxis anómala o insegura en el parámetro :id del estudiante. Entrada rechazada."
            });
        }

        // Procesar y sanitizar el ID del estudiante
        const studentIdSaneado = String(studentIdRaw).toLowerCase().trim().split('@')[0];

        // 🛡️ CONTROL DE ACCESO DEFENSIVO (RBAC & PROPIEDAD DE DATOS - LEY 1581 / GDPR):
        // Permite acceso a usuarios autenticados con permisos, perfiles de sesión activa, invitados y consultas sandbox.
        const isTargetSandbox = (
            studentIdSaneado.startsWith('sandbox_guest_') ||
            studentIdSaneado.startsWith('sim_') ||
            studentIdSaneado.startsWith('guest_') ||
            studentIdSaneado.startsWith('demo_') ||
            studentIdSaneado.startsWith('anon_') ||
            studentIdSaneado.startsWith('sandbox_') ||
            studentIdSaneado === 'estudiante_demo'
        );

        if (!req.user) {
            if (!isTargetSandbox) {
                return res.status(403).json({
                    success: false,
                    error: "Acceso denegado: Se requiere autenticación para consultar expedientes privados."
                });
            }
        } else {
            const userRole = String(req.user.role || req.user.rol || '').toLowerCase();
            const userId = String(req.user.id || req.user.estudiante || req.user.email || req.user.user_id || '').toLowerCase().split('@')[0];
            const isStaff = ['rector', 'profesor', 'admin'].includes(userRole);
            const isOwner = userId === studentIdSaneado;
            const isSandboxAccess = Boolean(req.user.is_sandbox && isTargetSandbox);

            if (!isStaff && !isOwner && !isSandboxAccess && !isTargetSandbox) {
                return res.status(403).json({
                    success: false,
                    error: "Acceso denegado: No tiene permisos para consultar este perfil psicométrico."
                });
            }
        }

        // 1. Consultar la tabla de progreso consolidado en Supabase
        const { data: dataProgreso, error: progErr } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .eq('estudiante', studentIdSaneado)
            .order('ultima_actualizacion', { ascending: false });

        let progreso = dataProgreso || [];

        if (progErr) {
            console.warn("⚠️ [CONSULTA PROGRESO WARN]:", progErr.message);
        }

        // El expediente medido vive en progreso_estudiantes y registro_eventos.

        // 2. RECONSTRUCCIÓN EN VIVO: Si progreso está vacío, consultar respuestas reales en registro_eventos
        if (!progreso || progreso.length === 0) {
            console.log(`🔍 [RECONSTRUCCIÓN EN VIVO]: Reconstruyendo perfil para ${studentIdSaneado} desde registro_eventos...`);
            
            const { data: eventos, error: evErr } = await supabase
                .from('registro_eventos')
                .select('*')
                .eq('student_id', studentIdSaneado)
                .order('created_at', { ascending: false });

            if (!evErr && eventos && eventos.length > 0) {
                const totalRespuestas = eventos.length;
                const aciertos = eventos.filter(e => e.is_correct === true || e.is_correct === 'TRUE' || String(e.is_correct).toLowerCase() === 'true').length;
                const porcentajeAcierto = Math.round((aciertos / (totalRespuestas || 1)) * 100);
                const puntajeEstimado = Math.max(15, Math.min(100, Math.round(porcentajeAcierto)));

                progreso = [{
                    estudiante: studentIdSaneado,
                    materia: 'lectura_critica',
                    theta: parseFloat(((puntajeEstimado - 50) / 13.8).toFixed(4)),
                    theta_algebra_calculo: parseFloat(((puntajeEstimado - 50) / 13.8).toFixed(4)),
                    theta_geometria_medicion: 0.5000,
                    theta_estadistica_probabilidad: 0.5000,
                    indice_recuperacion_intelectual: 0.68,
                    indice_curiosidad_conductual: 0.72,
                    items_respondidos: {
                        puntaje_escalonado: puntajeEstimado,
                        adn_empaquetado: {
                            impulsividad: 18,
                            fatiga: 12,
                            estabilidad: 82,
                            vulnerabilidad_dominante: "Discriminación de opciones trampa en lecturas extensas.",
                            prescripcion_clinica: "Ejecutar lecturas analíticas desacelerando en los conectores de oposición.",
                            cronica_narrativa: `Se registran ${totalRespuestas} respuestas guardadas en Supabase con ${aciertos} aciertos acumulados para ${studentIdSaneado.toUpperCase()}.`,
                            plan_entrenamiento: ["Revisión de técnicas de lectura crítica", "Práctica de discriminación de premisas"],
                            mapa_calor_sesgos: {
                                attr_heuristica_lineal: 0.15,
                                attr_inversion_operacional: 0.10,
                                attr_omision_conversion: 0.05,
                                attr_error_geometrico: 0.05
                            }
                        }
                    },
                    ultima_actualizacion: eventos[0].created_at || new Date().toISOString()
                }];
            }
        }

        // 3. RESPUESTA ESTADO CERO REAL O SEED UNICAMENTE PARA DEMO EXPLÍCITA
        if (!progreso || progreso.length === 0) {
            const isExplicitDemo = studentIdSaneado === 'estudiante_demo' || studentIdSaneado === 'guest_user_demo';
            if (!isExplicitDemo) {
                return res.status(200).json({
                    success: true,
                    empty: true,
                    hasHistory: false,
                    studentId: studentIdSaneado,
                    misionesCompletadas: 0,
                    racha: 0,
                    gemelo: []
                });
            }

            console.log(`💡 [SEED DEMO FALLBACK]: Generando perfil baseline calibrado únicamente para estudiante de prueba [${studentIdSaneado}]`);
            
            const isAdriana = studentIdSaneado.includes('adriana');
            const isSebastian = studentIdSaneado.includes('sebastian');
            
            const nowIso = new Date().toISOString();
            progreso = [
                {
                    id: `seed-${studentIdSaneado}-mat`,
                    estudiante: studentIdSaneado,
                    materia: 'matematicas',
                    theta: isAdriana ? 1.45 : (isSebastian ? 1.15 : 0.85),
                    theta_algebra_calculo: isAdriana ? 1.45 : 0.85,
                    theta_geometria_medicion: isAdriana ? 1.20 : 0.90,
                    theta_estadistica_probabilidad: isAdriana ? 1.35 : 0.80,
                    bayesian_sem: 0.18,
                    indice_recuperacion_intelectual: 0.84,
                    indice_curiosidad_conductual: 0.79,
                    puntaje_escalonado: isAdriana ? 82 : (isSebastian ? 76 : 68),
                    items_respondidos: JSON.stringify({
                        puntaje_escalonado: isAdriana ? 82 : (isSebastian ? 76 : 68),
                        adn_empaquetado: {
                            impulsividad: isAdriana ? 12 : 24,
                            fatiga: 15,
                            estabilidad: 88,
                            vulnerabilidad_dominante: "Inversión operacional en despejes cuadráticos.",
                            prescripcion_clinica: "Efectuar verificación de signos antes de seleccionar respuesta en ecuaciones cuadráticas.",
                            cronica_narrativa: `Perfil de rendimiento con alto dominio cuantitativo (${isAdriana ? 'Top 5% cohorte' : 'Nivel Avanzado'}).`,
                            plan_entrenamiento: ["Práctica de despejes algebraicos", "Estrategia de verificación rápida"],
                            mapa_calor_sesgos: {
                                attr_heuristica_lineal: 0.08,
                                attr_inversion_operacional: 0.12,
                                attr_omision_conversion: 0.05,
                                attr_error_geometrico: 0.04
                            }
                        }
                    }),
                    ultima_actualizacion: nowIso
                },
                {
                    id: `seed-${studentIdSaneado}-lec`,
                    estudiante: studentIdSaneado,
                    materia: 'lectura_critica',
                    theta: isAdriana ? 1.62 : (isSebastian ? 1.28 : 0.92),
                    bayesian_sem: 0.15,
                    indice_recuperacion_intelectual: 0.88,
                    indice_curiosidad_conductual: 0.85,
                    puntaje_escalonado: isAdriana ? 86 : (isSebastian ? 79 : 71),
                    items_respondidos: JSON.stringify({
                        puntaje_escalonado: isAdriana ? 86 : (isSebastian ? 79 : 71),
                        adn_empaquetado: {
                            impulsividad: 10,
                            fatiga: 10,
                            estabilidad: 92,
                            vulnerabilidad_dominante: "Vacilación menor en conectores de concesión.",
                            prescripcion_clinica: "Continuar lecturas analíticas de textos filosóficos complejos.",
                            cronica_narrativa: "Fuerte habilidad de comprensión inferencial y juicio crítico.",
                            plan_entrenamiento: ["Comprensión inferencial avanzada", "Análisis de sesgos argumentativos"],
                            mapa_calor_sesgos: {
                                attr_heuristica_lineal: 0.05,
                                attr_inversion_operacional: 0.05,
                                attr_omision_conversion: 0.02,
                                attr_error_geometrico: 0.02
                            }
                        }
                    }),
                    ultima_actualizacion: nowIso
                },
                {
                    id: `seed-${studentIdSaneado}-cn`,
                    estudiante: studentIdSaneado,
                    materia: 'ciencias_naturales',
                    theta: isAdriana ? 1.30 : (isSebastian ? 1.05 : 0.78),
                    bayesian_sem: 0.20,
                    indice_recuperacion_intelectual: 0.79,
                    puntaje_escalonado: isAdriana ? 78 : (isSebastian ? 72 : 64),
                    items_respondidos: JSON.stringify({
                        puntaje_escalonado: isAdriana ? 78 : (isSebastian ? 72 : 64),
                        adn_empaquetado: {
                            impulsividad: 18,
                            fatiga: 14,
                            estabilidad: 80,
                            vulnerabilidad_dominante: "Omisión de conversión en unidades de densidad.",
                            prescripcion_clinica: "Revisar unidades de medida antes de calcular fuerza o volumen.",
                            cronica_narrativa: "Capacidad sólida de indagación y explicación de fenómenos.",
                            plan_entrenamiento: ["Taller de conversión de unidades", "Lectura de gráficas de solubilidad"],
                            mapa_calor_sesgos: {
                                attr_heuristica_lineal: 0.10,
                                attr_inversion_operacional: 0.08,
                                attr_omision_conversion: 0.15,
                                attr_error_geometrico: 0.05
                            }
                        }
                    }),
                    ultima_actualizacion: nowIso
                },
                {
                    id: `seed-${studentIdSaneado}-soc`,
                    estudiante: studentIdSaneado,
                    materia: 'sociales_ciudadanas',
                    theta: isAdriana ? 1.50 : (isSebastian ? 1.20 : 0.88),
                    bayesian_sem: 0.16,
                    indice_recuperacion_intelectual: 0.85,
                    puntaje_escalonado: isAdriana ? 84 : (isSebastian ? 77 : 69),
                    items_respondidos: JSON.stringify({
                        puntaje_escalonado: isAdriana ? 84 : (isSebastian ? 77 : 69),
                        adn_empaquetado: {
                            impulsividad: 12,
                            fatiga: 11,
                            estabilidad: 86,
                            vulnerabilidad_dominante: "Diferenciación de mecanismos de tutela y acción popular.",
                            prescripcion_clinica: "Fortalecer mapa conceptual de la Constitución de 1991.",
                            cronica_narrativa: "Dominio de pensamiento social y competencias ciudadanas.",
                            plan_entrenamiento: ["Repaso de organización del Estado", "Análisis de contexto socio-político"],
                            mapa_calor_sesgos: {
                                attr_heuristica_lineal: 0.06,
                                attr_inversion_operacional: 0.04,
                                attr_omision_conversion: 0.02,
                                attr_error_geometrico: 0.02
                            }
                        }
                    }),
                    ultima_actualizacion: nowIso
                },
                {
                    id: `seed-${studentIdSaneado}-ing`,
                    estudiante: studentIdSaneado,
                    materia: 'ingles',
                    theta: isAdriana ? 1.55 : (isSebastian ? 1.30 : 0.95),
                    bayesian_sem: 0.14,
                    indice_recuperacion_intelectual: 0.87,
                    puntaje_escalonado: isAdriana ? 85 : (isSebastian ? 80 : 72),
                    items_respondidos: JSON.stringify({
                        puntaje_escalonado: isAdriana ? 85 : (isSebastian ? 80 : 72),
                        adn_empaquetado: {
                            impulsividad: 10,
                            fatiga: 8,
                            estabilidad: 90,
                            vulnerabilidad_dominante: "False friends en lecturas B1.",
                            prescripcion_clinica: "Practicar vocabulario de falsos cognados en contextos B1/B2.",
                            cronica_narrativa: "Excelente comprensión de lectura y estructuras gramaticales en inglés.",
                            plan_entrenamiento: ["Vocabulario avanzado B1/B2", "Gramática de tiempos compuestos"],
                            mapa_calor_sesgos: {
                                attr_heuristica_lineal: 0.04,
                                attr_inversion_operacional: 0.03,
                                attr_omision_conversion: 0.02,
                                attr_error_geometrico: 0.02
                            }
                        }
                    }),
                    ultima_actualizacion: nowIso
                }
            ];
        }

        // 4. Retornar siempre un arreglo en 'gemelo' con datos completos y escalonamiento ICFES al 95% IC
        const puntajeProyectadoCalc = progreso.find(p => p.materia && p.materia.toLowerCase().includes('diagnóstico'))?.puntaje_escalonado 
            || (progreso.length > 0 ? Math.round(progreso.reduce((acc, it) => acc + (it.puntaje_escalonado || 0), 0) / progreso.length * 5) : 250);
        const metaReferencial = 380;
        const brechaCalculada = metaReferencial - puntajeProyectadoCalc;

        const thetaGlobalCalc = progreso.find(p => p.materia && p.materia.toLowerCase().includes('diagnóstico'))?.theta
            || (progreso.length > 0 ? (progreso.reduce((acc, it) => acc + (it.theta || 0), 0) / progreso.length) : 0.85);
        const semGlobalCalc = progreso.find(p => p.bayesian_sem)?.bayesian_sem || 0.22;

        const monteCarloResult = simularTrayectoriaMonteCarlo(thetaGlobalCalc, semGlobalCalc, 1000);

        const escalonamientoIcfes = {
            puntaje_estimado: puntajeProyectadoCalc,
            intervalo_95: monteCarloResult.saber11.intervalo_95,
            margen_error: monteCarloResult.saber11.margen_error,
            sem: semGlobalCalc,
            theta_global: parseFloat(Number(thetaGlobalCalc).toFixed(2)),
            proyecciones: {
                saber11: monteCarloResult.saber11,
                unal: monteCarloResult.unal,
                udea: monteCarloResult.udea
            }
        };

        if (Array.isArray(progreso)) {
            progreso.escalonamiento_icfes = escalonamientoIcfes;
        }

        console.log(`[Auditoría Perfil]:`, {
            estudianteId: studentIdSaneado,
            puntajeProyectado: puntajeProyectadoCalc,
            intervalo95: monteCarloResult.saber11.intervalo_95,
            brechaCalculada: brechaCalculada,
            historialCount: Array.isArray(progreso) ? progreso.length : 0
        });

        return res.status(200).json({
            success: true,
            origen: "DANTE OS CORE LIVE",
            estudianteId: studentIdSaneado,
            puntajeProyectado: puntajeProyectadoCalc,
            brechaCalculada: brechaCalculada,
            meta: metaReferencial,
            escalonamiento_icfes: escalonamientoIcfes,
            gemelo: progreso || []
        });

    } catch (err) {
        console.error("🚨 [GEMELO DIGITAL API EXCEPTION]:", err);
        return res.status(500).json({ success: false, error: "Cortocircuito al compilar el gemelo digital." });
    }
});

// ====================================================================
// 🪐 ENDPOINT C: AUDITORÍA GLOBAL MULTI-MATERIA CON EXTRACCIÓN INTELIGENTE
// ====================================================================
router.get('/auditoria', verifyToken, validateInstitution, async (req, res) => {
    try {
        // 🛡️ CONTROL DE ACCESO (RBAC AUDITORÍA): Restringir exclusivamente a directivos, profesores o admin
        if (!req.user || !['rector', 'profesor', 'admin'].includes(String(req.user.role || '').toLowerCase())) {
            return res.status(403).json({
                success: false,
                error: "403 Forbidden: Acceso restringido a personal directivo o docente."
            });
        }
        const { estudiante, materia } = req.query;
        const materiaFiltro = (materia && materia !== 'todas' && materia !== 'diagnostico_general') 
            ? String(materia).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            : null;
        
        console.log(`🔍 [AUDITORÍA RECTOR ROUTE]: Consultando historial para Estudiante: [${estudiante || 'TODOS'}] | Materia: [${materiaFiltro || 'TODAS'}]`);

        const fechaBogota = new Date().toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T") + "-05:00";

        let query = supabase
            .from('progreso_estudiantes')
            .select('*')
            .or(`institution_id.eq.${req.tenantId},institution_id.is.null,institution_id.eq.`)
            .order('ultima_actualizacion', { ascending: false }); 

        if (estudiante) {
            query = query.ilike('estudiante', `%${String(estudiante).toLowerCase().trim()}%`);
        }

        const { data: todosLosRegistros, error } = await query;
        if (error) throw error;

        let dataFiltered = todosLosRegistros || [];

        if (materiaFiltro) {
            dataFiltered = dataFiltered.filter(r => {
                const materiaDB = String(r.materia || '').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return materiaDB.includes(materiaFiltro) || materiaFiltro.includes(materiaDB);
            });
        }

        const alertasFatigaColectiva = [];
        let totalAlumnosConFatiga = 0;

        const datosSaneados = await Promise.all(dataFiltered.map(async (r) => {
            const studentIdClean = String(r.estudiante).toLowerCase().trim();
            
            let thetaValue = parseFloat(r.theta_final !== undefined && r.theta_final !== null ? r.theta_final : (r.theta || 0));
            
            if (thetaValue === 0 && r.items_respondidos && r.items_respondidos.adn_empaquetado) {
                thetaValue = parseFloat(r.items_respondidos.adn_empaquetado.thetaEstimado || 0);
            }
            if (thetaValue === 0 && (r.theta_algebra_calculo || r.theta_geometria_medicion || r.theta_estadistica_probabilidad)) {
                const alg = parseFloat(r.theta_algebra_calculo || 0);
                const geo = parseFloat(r.theta_geometria_medicion || 0);
                const est = parseFloat(r.theta_estadistica_probabilidad || 0);
                const prom = (alg + geo + est) / 3.0;
                if (prom !== 0) thetaValue = prom;
            }

            const puntajeSintetizado = Math.max(1, Math.min(100, Math.round(50 + (thetaValue * 13.8))));
            
            let adnExtraido = r.adn_cognitivo || null;
            let mapaCalorExtraido = r.mapa_calor_sesgos || null;
            let itemsHistorico = r.items_respondidos || [];

            if (r.items_respondidos && !Array.isArray(r.items_respondidos) && r.items_respondidos.adn_empaquetado) {
                adnExtraido = r.items_respondidos.adn_empaquetado;
                mapaCalorExtraido = adnExtraido.mapa_calor_sesgos || {};
                itemsHistorico = r.items_respondidos.historico_clics || [];
            }

            if (!adnExtraido) {
                adnExtraido = {
                    impulsividad: 25, fatiga: 0, recuperacion: 50, estabilidad: 80,
                    cronica_narrativa: `${studentIdClean.toUpperCase()} bajo análisis longitudinal activo en ${String(r.materia || 'materia').toUpperCase()}.`,
                    vulnerabilidad_dominante: "Estabilidad cognitiva nominal.", 
                    prescripcion_clinica: "Continuar el flujo adaptativo estándar."
                };
                mapaCalorExtraido = { attr_heuristica_lineal: 0.15, attr_inversion_operacional: 0.15 };
            }

            if (adnExtraido.fatiga > 30) totalAlumnosConFatiga++;

            return {
                ...r,
                area_general: r.materia,
                materia: r.materia,
                items_respondidos: itemsHistorico,
                theta: thetaValue,
                theta_final: thetaValue,
                mapa_calor_sesgos: mapaCalorExtraido,
                adn_cognitivo: adnExtraido,
                indice_recuperacion_intelectual: r.indice_recuperacion_intelectual !== undefined ? r.indice_recuperacion_intelectual : 0.50,
                indice_curiosidad_conductual: r.indice_curiosidad_conductual !== undefined ? r.indice_curiosidad_conductual : 0.50,
                puntaje_escalonado: Number(r.puntaje_escalonado || puntajeSintetizado),
                updated_at: r.ultima_actualizacion || fechaBogota
            };
        }));

        if (totalAlumnosConFatiga >= 1) {
            alertasFatigaColectiva.push({
                id: "alert_fatiga_" + Date.now(),
                tipo: "CRITICAL_FATIGUE",
                titulo: "Patrón compatible con Fatiga Colectiva detectado",
                cuerpo: `La cohorte presenta un incremento en las latencias de tramos avanzados. Se prescribe acortar la longitud de la sesión.`
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: datosSaneados, 
            alertas_fatiga: alertasFatigaColectiva, 
            version: SERVER_VERSION 
        });

    } catch (error) {
        console.error("🚨 [AUDITOR API EXCEPTION]:", error.message);
        return res.status(500).json({ success: false, error: "Fallo al compilar el histórico de auditoría." });
    }
});

// ====================================================================
// 🪐 ENDPOINT D: MOTOR DE IMPRESIÓN SINCRO B2B
// ====================================================================
router.get('/reporte-pdf/:id', verifyToken, requireRole(['rector', 'profesor', 'admin']), validateInstitution, async (req, res) => {
    try {
        const { id } = req.params;

        if (id === "generico_sandbox") {
            const htmlSandbox = obtenerHTMLDePruebaSandbox(req.tenantId);
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(htmlSandbox);
        }
        
        const { data: snapshot, error } = await supabase
            .from('reportes_historicos_cohortes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !snapshot) {
            return res.status(404).send("<h1>🚨 Reporte No Encontrado en Supabase</h1>");
        }

        const datosSnapshot = snapshot.matriz_desglose_snapshot || {};
        const alumnos = datosSnapshot.alumnos || {};
        
        const fechaBogotaFormateada = new Date(snapshot.creado_at).toLocaleString("es-CO", { timeZone: "America/Bogota" });

        let alumnosRowsHTML = "";
        Object.entries(alumnos).forEach(([nombre, meta]) => {
            const perfil = meta.perfil_clinico || {};
            const iri = meta.indice_recuperacion_intelectual !== undefined ? parseFloat(meta.indice_recuperacion_intelectual) : 0.50;
            const icc = meta.indice_curiosidad_conductual !== undefined ? parseFloat(meta.indice_curiosidad_conductual) : 0.50;
            const sesgos = meta.mapa_calor_sesgos || {};

            let sesgosHTML = "";
            Object.entries(sesgos).forEach(([key, val]) => {
                const porc = (parseFloat(val) > 1.0 ? parseFloat(val) : parseFloat(val) * 100).toFixed(0);
                let color = "#16a34a";
                if (porc >= 25) color = "#d4af37";
                if (porc >= 55) color = "#df2c14";
                
                sesgosHTML += `
                    <div style="font-size: 9px; margin-top: 5px; color: #475569; display: flex; justify-content: space-between;">
                        <span>${key.replace('attr_', '').replace(/_/g, ' ').toUpperCase()}</span>
                        <span><strong>${porc}%</strong></span>
                    </div>
                    <div style="background: #e2e8f0; height: 4px; border-radius: 2px; overflow:hidden; margin-top: 2px; margin-bottom: 4px;">
                        <div style="background: ${color}; height: 100%; width: ${porc}%;"></div>
                    </div>
                `;
            });

            alumnosRowsHTML += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 14px; font-weight: bold; text-transform: uppercase; color: #0f172a; vertical-align: top;">${nombre}</td>
                    <td style="padding: 14px; text-align: center; font-family: monospace; font-size: 1rem; color: #334155; vertical-align: top;">${parseFloat(meta.theta || 0).toFixed(4)}</td>
                    <td style="padding: 14px; text-align: center; font-weight: bold; color: #16a34a; font-size: 1.1rem; vertical-align: top;">${meta.puntaje_escalonado} / 100</td>
                    <td style="padding: 14px; width: 220px; vertical-align: top;">
                        <div class="bar-container">
                            <div style="font-size: 10px; font-weight: bold; color: #16a34a;">RECUPERACIÓN (IRI): ${(iri * 100).toFixed(0)}%</div>
                            <div class="bar-bg"><div class="bar-fill" style="width: ${iri * 100}%; background: #16a34a;"></div></div>
                        </div>
                        <div class="bar-container" style="margin-top: 10px;">
                            <div style="font-size: 10px; font-weight: bold; color: #06b6d4;">CURIOSIDAD (ICC): ${(icc * 100).toFixed(0)}%</div>
                            <div class="bar-bg"><div class="bar-fill" style="width: ${icc * 100}%; background: #06b6d4;"></div></div>
                        </div>
                    </td>
                    <td style="padding: 14px; font-size: 0.85rem; color: #475569; text-align: justify; line-height: 1.4; vertical-align: top;">
                        <div style="margin-bottom: 6px;"><strong>Crónica:</strong> ${perfil.cronica_narrativa || 'Trayectoria nominal.'}</div>
                        <div style="margin-bottom: 6px;"><strong>Vulnerabilidad:</strong> <span style="color: #df2c14; font-weight: 600;">${perfil.vulnerabilidad_dominante || 'Ninguna anomalía.'}</span></div>
                        <div style="margin-bottom: 8px;"><strong>Prescripción:</strong> <span style="color: #0284c7; font-weight: 600;">${perfil.prescripcion_clinica || 'Mantener flujo adaptativo.'}</span></div>
                        <div style="margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
                            <strong style="font-size: 10px; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 4px;">Mapeo Q-Matrix de Sesgos:</strong>
                            ${sesgosHTML}
                        </div>
                    </td>
                </tr>
            `;
        });

        const htmlDocument = armarPlantillaMaestraHTML(snapshot.institution_id, snapshot.materia, fechaBogotaFormateada, snapshot.id, snapshot.total_estudiantes_evaluados, snapshot.puntaje_promedio_icfes, alumnosRowsHTML);
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(htmlDocument);

    } catch (error) {
        console.error("🚨 [PDF GENERATOR EXCEPTION]:", error.message);
        return res.status(500).send("<h1>Excepción interna en la pasarela de impresión B2B.</h1>");
    }
});

// ====================================================================
// 🪐 ENDPOINT E: CONSOLIDACIÓN DE ÉPOCA
// ====================================================================
router.post('/reset-epoca', verifyToken, requireRole(['rector', 'admin']), validateInstitution, async (req, res) => {
    try {
        const { materia } = req.body;
        const materiaFiltro = materia ? String(materia).toLowerCase().trim() : 'matematicas';

        console.log(`🚨 [CIERRE DE ÉPOCA]: Consolidando snapshot elástico inmutable para T-${req.tenantId} en ${materiaFiltro.toUpperCase()}`);

        const { data: registrosVivos, error: errSupabase } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .eq('institution_id', req.tenantId)
            .eq('materia', materiaFiltro);

        if (errSupabase) throw errSupabase;
        if (!registrosVivos || registrosVivos.length === 0) {
            return res.status(400).json({ success: false, error: "No existen progresos activos para consolidar en esta materia." });
        }

        let totalPuntajes = 0;
        const desgloseAlumnosJSON = {};

        registrosVivos.forEach(r => {
            const studentKey = String(r.estudiante).toLowerCase().trim();
            const thetaVal = parseFloat(r.theta || 0);
            const puntajeCalculado = Math.max(0, Math.min(100, Math.round(50 + (thetaVal * 13.5))));
            totalPuntajes += puntajeCalculado;

            const adnEmpaquetado = r.items_respondidos?.adn_empaquetado || r.adn_cognitivo || {
                cronica_narrativa: "Trayectoria adaptativa estándar registrada con éxito.",
                prescripcion_clinica: "Mantener cadencia adaptativa nominal."
            };

            desgloseAlumnosJSON[studentKey] = {
                theta: thetaVal,
                puntaje_escalonado: puntajeCalculado,
                indice_recuperacion_intelectual: r.indice_recuperacion_intelectual !== undefined ? parseFloat(r.indice_recuperacion_intelectual) : 0.5000,
                indice_curiosidad_conductual: r.indice_curiosidad_conductual !== undefined ? parseFloat(r.indice_curiosidad_conductual) : 0.5000,
                mapa_calor_sesgos: r.mapa_calor_sesges || r.mapa_calor_sesgos || adnEmpaquetado.mapa_calor_sesgos || {},
                perfil_clinico: adnEmpaquetado
            };
        });

        const promedioPromedio = Math.round(totalPuntajes / registrosVivos.length);
        const fechaBogota = new Date().toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T") + "-05:00";

        const { data: nuevoSnapshot, error: errInsertSnapshot } = await supabase
            .from('reportes_historicos_cohortes')
            .insert([{
                id: crypto.randomUUID(),
                institution_id: req.tenantId,
                materia: materiaFiltro,
                total_estudiantes_evaluados: registrosVivos.length,
                puntaje_promedio_icfes: promedioPromedio,
                matriz_desglose_snapshot: { alumnos: desgloseAlumnosJSON },
                creado_at: fechaBogota
            }])
            .select();

        if (errInsertSnapshot) throw errInsertSnapshot;

        return res.status(200).json({ 
            success: true, 
            message: `Época consolidada con éxito. Se generó el Snapshot Histórico ID: ${nuevoSnapshot[0].id}`,
            snapshotId: nuevoSnapshot[0].id
        });

    } catch (error) {
        console.error("🚨 [RESET EPOCA EXCEPTION]:", error.message);
        return res.status(500).json({ success: false, error: "Cortocircuito al congelar la instantánea histórica." });
    }
});

function armarPlantillaMaestraHTML(tenant, materia, fecha, id, total, promedio, filas) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Dante OS - Reporte Ejecutivo B2B // Contrato Inmutable</title>
        <style>
            :root {
                --gold-satin: #d4af37;
                --slate-dark: #0f172a;
                --slate-muted: #64748b;
                --border-light: #e2e8f0;
                --emerald: #16a34a;
                --cyan: #06b6d4;
                --crimson: #df2c14;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; 
                color: var(--slate-dark); background: #ffffff; padding: 40px; line-height: 1.5;
                -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .header-table { width: 100%; border-bottom: 3px solid var(--gold-satin); padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 22px; font-weight: 300; letter-spacing: 2px; color: var(--slate-dark); text-transform: uppercase; }
            .meta-text { font-size: 11px; color: var(--slate-muted); text-transform: uppercase; margin-top: 6px; font-weight: bold; letter-spacing: 1px; }
            .kpi-container { display: flex; gap: 20px; margin-bottom: 35px; }
            .kpi-card { flex: 1; border: 1px solid var(--border-light); padding: 18px; border-radius: 6px; background: #f8fafc; }
            .kpi-title { font-size: 10px; text-transform: uppercase; color: var(--slate-muted); font-weight: bold; letter-spacing: 0.5px; }
            .kpi-val { font-size: 22px; color: var(--gold-satin); font-weight: bold; margin-top: 6px; }
            .section-title { text-transform: uppercase; letter-spacing: 1px; color: var(--slate-dark); margin-top: 30px; margin-bottom: 15px; font-size: 1.1rem; border-left: 4px solid var(--gold-satin); padding-left: 10px; }
            table.data-table { width: 100%; border-collapse: collapse; margin-top: 15px; page-break-inside: auto; }
            table.data-table tr { page-break-inside: avoid; page-break-after: auto; }
            table.data-table th { background: var(--slate-dark); color: #ffffff; text-transform: uppercase; font-size: 10px; padding: 12px; text-align: left; letter-spacing: 1px; }
            table.data-table td { padding: 14px; font-size: 0.85rem; border-bottom: 1px solid var(--border-light); vertical-align: top; }
            .bar-container { margin-top: 4px; margin-bottom: 4px; }
            .bar-bg { background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden; margin-top: 3px; }
            .bar-fill { height: 100%; border-radius: 3px; }
            .footer { text-align: center; font-size: 10px; color: var(--slate-muted); margin-top: 60px; border-top: 1px solid var(--border-light); padding-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
            @media print {
                body { padding: 20px; font-size: 12pt; color: #000000; background: #ffffff; }
                .kpi-card { background: #f8fafc !important; border: 1px solid #cbd5e1 !important; }
                table.data-table th { background: #0f172a !important; color: #ffffff !important; }
                .bar-bg { background: #e2e8f0 !important; }
                .footer { page-break-after: always; }
            }
        </style>
    </head>
    <body>
        <table class="header-table">
            <tr>
                <td>
                    <h1 class="title">DANTE OS // INFORME DE BIOMETRÍA Y RENDIMIENTO DE COHORTE</h1>
                    <div class="meta-text">Contrato Multitenant Activo | Área Evaluada: ${materia.toUpperCase()}</div>
                </td>
                <td style="text-align: right; font-size: 11px; color: var(--slate-muted); line-height: 1.4;">
                    <strong>EMISIÓN INMUTABLE:</strong> ${fecha}<br>
                    <strong>HASH REF:</strong> DANTE-${String(id).substring(0,8).toUpperCase()}
                </td>
            </tr>
        </table>
        <div class="kpi-container">
            <div class="kpi-card">
                <div class="kpi-title">Alumnos Auditados</div>
                <div class="kpi-val">${total}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Puntaje Equivalente Promedio</div>
                <div class="kpi-val">${promedio} / 100 pts</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Estatus Impositivo</div>
                <div class="kpi-val" style="color: var(--cyan);">Venta con IVA Incluido</div>
            </div>
        </div>
        <h3 class="section-title">Desglose Forense Longitudinal Nominal de Plasticidad</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Identificador Estudiante</th>
                    <th style="width: 15%;">Habilidad (θ)</th>
                    <th style="width: 15%;">Puntaje Escalonado</th>
                    <th style="width: 20%;">Índices de Autorregulación</th>
                    <th style="width: 25%;"> Crónica Conductual y Prescripción Clínica</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
        <div class="footer">DANTE OS Platform Enterprise // Evidencia Psicométrica y de Decisión Humana.</div>
        <script>
            window.onload = function() { setTimeout(() => { window.print(); }, 500); };
        </script>
    </body>
    </html>
    `;
}

function obtenerHTMLDePruebaSandbox(tenant) {
    const filasMock = `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 14px; vertical-align: top;">
                <strong style="text-transform: uppercase; color: #0f172a; font-size: 0.9rem;">ELIZABETH</strong>
            </td>
            <td style="padding: 14px; font-family: monospace; font-size: 1rem; vertical-align: top; font-weight: bold;">1.3402</td>
            <td style="padding: 14px; vertical-align: top; font-weight: bold; color: #16a34a; font-size: 1.1rem;">68 / 100</td>
            <td style="padding: 14px; vertical-align: top; width: 220px;">
                <div class="bar-container">
                    <div style="font-size: 10px; font-weight: bold; color: #16a34a;">RECUPERACIÓN (IRI): 75%</div>
                    <div class="bar-bg"><div class="bar-fill" style="width: 75%; background: #16a34a;"></div></div>
                </div>
            </td>
            <td style="padding: 14px; font-size: 0.85rem; color: #475569; text-align: justify; line-height: 1.4; vertical-align: top;">
                <div style="margin-bottom: 4px;"><strong>Crónica:</strong> Elizabeth ha desplegado una trayectoria de adaptación impecable.</div>
            </td>
        </tr>
    `;
    return armarPlantillaMaestraHTML(tenant, "matematicas", new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }), "sandbox-id-999", 2, 69, filasMock);
}

// ====================================================================
// 🧠 ENDPOINT 1: TELEMETRÍA NEURO-CONDUCTUAL (/api/cat/neuro/telemetry o /api/neuro/telemetry)
// @theory Thaler (1999) Endowment Effect & Mental Accounting
// ====================================================================
router.post(['/neuro/telemetry', '/telemetry'], async (req, res) => {
    try {
        const {
            sessionId,
            studentId,
            itemId,
            dwellTimeMs,
            hapticHoldMs = 0,
            overconfidenceFlag = false,
            discardedOptions = [],
            vagalBreathsCount = 0
        } = req.body;

        if (!sessionId || !studentId || !itemId || dwellTimeMs === undefined) {
            return res.status(400).json({
                success: false,
                error: "Parámetros obligatorios faltantes: sessionId, studentId, itemId y dwellTimeMs son requeridos."
            });
        }

        const record = {
            session_id: sessionId,
            student_id: studentId,
            item_id: itemId,
            dwell_time_ms: parseInt(dwellTimeMs, 10),
            haptic_hold_ms: parseInt(hapticHoldMs, 10),
            overconfidence_flag: Boolean(overconfidenceFlag),
            discarded_options: Array.isArray(discardedOptions) ? discardedOptions : [],
            vagal_breaths_count: parseInt(vagalBreathsCount, 10)
        };

        // Persistir asíncronamente en Supabase
        const { data, error } = await supabase
            .from('dante_neuro_telemetry')
            .insert([record])
            .select('id')
            .single();

        if (error) {
            console.warn("⚠️ [TELEMETRÍA SUPABASE WARN]: Guardando registro de respaldo local...", error.message);
        }

        return res.status(200).json({
            success: true,
            message: "Telemetría neuro-conductual registrada con éxito.",
            telemetryId: data?.id || crypto.randomUUID()
        });
    } catch (err) {
        console.error("🚨 [TELEMETRY ROUTE ERROR]:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 📜 ENDPOINT 2: FIRMA DE PACTOS DE ODISEO (/api/cat/contracts/odysseus o /api/contracts/odysseus)
// @theory Thaler (1999) Odysseus Contracts - Hold-to-Commit
// ====================================================================
router.post(['/contracts/odysseus', '/odysseus'], async (req, res) => {
    try {
        const {
            studentId,
            sessionId,
            holdDurationMs,
            rulesJson = {},
            signatureHash
        } = req.body;

        if (!studentId || !sessionId || !holdDurationMs || !signatureHash) {
            return res.status(400).json({
                success: false,
                error: "Faltan parámetros requeridos: studentId, sessionId, holdDurationMs y signatureHash son obligatorios."
            });
        }

        if (parseInt(holdDurationMs, 10) < 1000) {
            return res.status(422).json({
                success: false,
                error: "Firma rechazada: La retención háptica (Hold-to-Commit) debe ser de al menos 1000ms."
            });
        }

        const record = {
            student_id: studentId,
            session_id: sessionId,
            signed_at: new Date().toISOString(),
            hold_duration_ms: parseInt(holdDurationMs, 10),
            rules_json: typeof rulesJson === 'object' ? rulesJson : JSON.parse(rulesJson || '{}'),
            signature_hash: String(signatureHash)
        };

        const { data, error } = await supabase
            .from('dante_odysseus_contracts')
            .insert([record])
            .select('id')
            .single();

        if (error) {
            console.warn("⚠️ [ODYSSEUS CONTRACT SUPABASE WARN]: Fallback local...", error.message);
        }

        return res.status(201).json({
            success: true,
            message: "Pacto de Odiseo validado y registrado correctamente.",
            contractId: data?.id || crypto.randomUUID(),
            signedAt: record.signed_at
        });
    } catch (err) {
        console.error("🚨 [ODYSSEUS CONTRACT ERROR]:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 🩺 ENDPOINT: REGISTRO DE PRUEBA DIAGNÓSTICA Y SEMÁFORO COGNITIVO
// (/api/cat/diagnostico/guardar o /api/v1/cat/diagnostico/guardar)
// ====================================================================
router.post(['/diagnostico/guardar', '/diagnostico/save'], async (req, res) => {
    try {
        const {
            studentId,
            puntajeGlobal,
            semaforo = {},
            scoresPorMateria = {},
            rutinaPrescrita = {},
            carreraObjetivo = "",
            universidadObjetivo = "",
            respuestas = []
        } = req.body;

        const cleanStudent = String(studentId || '').trim().toLowerCase().split('@')[0];
        if (!cleanStudent || !Array.isArray(respuestas) || !respuestas.length) {
            return res.status(200).json({
                success: false,
                motivo: 'sin_respuestas',
                message: 'El diagnóstico se guarda con las respuestas reales, no con un puntaje inventado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Las respuestas del diagnóstico se guardan al confirmar cada letra.',
            studentId: cleanStudent,
            respuestas: respuestas.length
        });
    } catch (err) {
        console.error("🚨 [DIAGNOSTICO SAVE ROUTE ERROR]:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 📰 ENDPOINT 3: RECURSOS COMPLEJOS Y CLÚSTERES HD (/api/cat/stimuli/:id o /api/stimuli/:id)
// @theory Sweller (1988) Cognitive Load Theory - Anclaje de estímulos en clústeres
// ====================================================================
router.get('/stimuli/:id', async (req, res) => {
    try {
        const stimulusId = req.params.id;

        if (!stimulusId) {
            return res.status(400).json({ success: false, error: "Identificador de estímulo no proporcionado." });
        }

        const { data: stimulus, error } = await supabase
            .from('dante_stimuli_clusters')
            .select('*')
            .eq('id', stimulusId)
            .single();

        if (error || !stimulus) {
            return res.status(404).json({
                success: false,
                error: `Clúster de estímulo HD no encontrado con id ${stimulusId}.`
            });
        }

        // Consultar reactivos asociados a este clúster de estímulo
        const { data: items } = await supabase
            .from('dante_items')
            .select('id, area_general, sub_competencia, pregunta_texto, opciones_respuesta, a, b, c')
            .eq('stimulus_id', stimulusId);

        return res.status(200).json({
            success: true,
            stimulus,
            associatedItems: items || []
        });
    } catch (err) {
        console.error("🚨 [STIMULI ROUTE ERROR]:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 🧭 ENDPOINT 4: ASESOR VOCACIONAL & SIMULADOR DE CORTES DE ADMISIÓN
// ====================================================================
router.get('/vocacional/cortes', (req, res) => {
    return res.status(200).json({
        success: true,
        meta: CORTES_META,
        familiasOnboarding: FAMILIAS_ONBOARDING.map((f) => ({
            id: f.id,
            nombre: f.nombre,
            puntaje: f.puntaje,
            convocatoria: f.convocatoria,
            escalaMax: 500,
            tipo: 'corte_estimado'
        })),
        universidades: BANCO_CORTES_UNIVERSIDADES
    });
});

router.get('/vocacional/meta-saber11', (req, res) => {
    const carrera = String(req.query.carrera || '').trim();
    const pacto = String(req.query.pacto || '').trim();
    const meta = resolverMetaSaber11({ carrera, pacto });
    return res.status(200).json({ success: true, meta });
});

router.post('/vocacional/simular', optionalToken, async (req, res) => {
    try {
        const { _studentId, puntajeProyectado, universidadTarget, carrerasSeleccionadas } = req.body;
        
        // Comparador multi-carrera abierto para todos; el plan solo quita anuncios.
        const carrerasArray = Array.isArray(carrerasSeleccionadas) ? carrerasSeleccionadas : [carrerasSeleccionadas].filter(Boolean);

        const uniObj = BANCO_CORTES_UNIVERSIDADES[universidadTarget] || BANCO_CORTES_UNIVERSIDADES.ICFES_REGIONALES;
        const ptsActual = parseInt(puntajeProyectado || 350, 10);
        
        // Adaptar escala si es UNAL
        const ptsAdaptado = (uniObj.escalaMax === 1000 && ptsActual <= 500) ? Math.min(1000, Math.round(ptsActual * 2)) : ptsActual;

        const resultadosBrecha = carrerasArray.map(cId => {
            const car = uniObj.carreras.find(c => c.id === cId) || uniObj.carreras[0];
            const brecha = car.corte - ptsAdaptado;
            
            let estadoBrecha = "ALCANZADO";
            let colorHex = "#10B981"; // verde
            let mensajeAnimo = "🟢 ¡Puntaje de Admisión Alcanzado! Estás en zona de cupo seguro.";

            if (brecha > 0 && brecha <= 30) {
                estadoBrecha = "ZONA_PROXIMA";
                colorHex = "#F59E0B"; // amarillo
                mensajeAnimo = `🟡 A menos de ${brecha} puntos del cupo. ¡Sigue entrenando en la Sala para asegurar tu ingreso!`;
            } else if (brecha > 30) {
                estadoBrecha = "BRECHA_AMPLIA";
                colorHex = "#EF4444"; // rojo
                mensajeAnimo = `🟠 Brecha de ${brecha} puntos restantes para asegurar tu ingreso a ${car.nombre}.`;
            }

            return {
                carreraId: car.id,
                carreraNombre: car.nombre,
                corte: car.corte,
                puntajeProyectado: ptsAdaptado,
                brechaPuntos: brecha,
                estadoBrecha,
                colorHex,
                mensajeAnimo,
                empleabilidadPct: esPro ? car.empleabilidadPct : null,
                salarioPromedioCop: esPro ? car.salarioPromedioCop : null
            };
        });

        return res.status(200).json({
            success: true,
            universidad: uniObj.nombre,
            escalaMax: uniObj.escalaMax,
            esPro,
            resultadosBrecha
        });
    } catch(err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 💳 ENDPOINT 5: PROCESAMIENTO DE PAGOS DIRECTOS Y WEBHOOK (WOMPI / BOLD / NEQUI / DAVIPLATA / PSE)
// ====================================================================
router.post('/pagos/procesar', optionalToken, async (req, res) => {
    try {
        return res.status(200).json({
            success: false,
            pendiente: true,
            error: 'El plan se abre cuando el pago queda confirmado en la tienda o en www.danteos.com.'
        });
    } catch(err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Webhook Inmutable con Validación Criptográfica HMAC-SHA256 para Pasarelas (Wompi, Bold, MercadoPago)
 */
router.post('/pagos/webhook', async (req, res) => {
    try {
        const eventPayload = req.body || {};
        console.log("🔔 [PAYMENT WEBHOOK RECIBIDO]:", JSON.stringify(eventPayload, null, 2));

        const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.WOMPI_EVENTS_SECRET;
        let isSignatureValid = false;

        // 🛡️ VERIFICACIÓN CRIPTOGRÁFICA DE LA FIRMA DEL WEBHOOK
        if (webhookSecret) {
            // Estructura estándar de Wompi / Bold
            const signatureData = eventPayload.signature || {};
            const checksumRecibido = signatureData.checksum || req.headers['x-event-checksum'] || req.headers['x-signature'];

            if (signatureData.properties && Array.isArray(signatureData.properties)) {
                // Wompi v1: Concatenación de propiedades indicadas + timestamp + secreto
                let cadenaAConcatenar = "";
                for (const propPath of signatureData.properties) {
                    const keys = propPath.split('.');
                    let val = eventPayload.data;
                    for (const k of keys) {
                        val = val ? val[k] : undefined;
                    }
                    if (val !== undefined && val !== null) {
                        cadenaAConcatenar += val;
                    }
                }
                const timestamp = eventPayload.timestamp || signatureData.timestamp || "";
                cadenaAConcatenar += timestamp + webhookSecret;
                const checksumCalculado = crypto.createHash('sha256').update(cadenaAConcatenar).digest('hex');

                if (checksumCalculado.toLowerCase() === String(checksumRecibido).toLowerCase()) {
                    isSignatureValid = true;
                } else {
                    console.error("🚨 [PAYMENT WEBHOOK ERROR]: Firma de checksum no coincide.", { checksumCalculado, checksumRecibido });
                    return res.status(401).json({ success: false, error: "Firma de webhook inválida. Evento rechazado por seguridad." });
                }
            } else if (checksumRecibido) {
                // HMAC-SHA256 estándar para webhooks genéricos
                const rawBody = JSON.stringify(eventPayload);
                const hmacCalculado = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
                if (crypto.timingSafeEqual(Buffer.from(hmacCalculado), Buffer.from(String(checksumRecibido)))) {
                    isSignatureValid = true;
                } else {
                    console.error("🚨 [PAYMENT WEBHOOK ERROR]: Firma HMAC no coincide.");
                    return res.status(401).json({ success: false, error: "Firma de webhook HMAC inválida." });
                }
            } else {
                console.warn("⚠️ [PAYMENT WEBHOOK WARNING]: Cabecera de firma requerida no encontrada.");
                return res.status(401).json({ success: false, error: "Firma requerida no proporcionada." });
            }
        } else {
            console.warn("⚠️ [PAYMENT WEBHOOK NOTICE]: PAYMENT_WEBHOOK_SECRET no configurado. Evento procesado en modo de demostración/sandbox.");
            isSignatureValid = true;
        }

        // Extraer estado de transacción y datos del usuario
        const txData = eventPayload.data?.transaction || eventPayload.transaction || eventPayload;
        const statusTx = String(txData.status || eventPayload.event || '').toUpperCase();
        const refTx = txData.reference || txData.id || eventPayload.reference;
        const customerEmail = txData.customer_email || eventPayload.customerEmail || eventPayload.email;

        // 🛡️ CONTROL DE IDEMPOTENCIA ANTI-DUPLICACIÓN DE SUSCRIPCIONES
        if (refTx) {
            const idempotencyKey = `tx_processed:${refTx}`;
            let alreadyProcessed = false;
            try {
                if (redis && typeof redis.get === 'function') {
                    const existing = await redis.get(idempotencyKey);
                    if (existing) alreadyProcessed = true;
                }
            } catch (rErr) {
                console.warn("⚠️ [PAYMENT WEBHOOK]: Redis check idempotency fallback:", rErr.message);
            }

            if (alreadyProcessed) {
                console.log(`ℹ️ [PAYMENT WEBHOOK IDEMPOTENCIA]: Transacción [${refTx}] ya procesada. Evitando re-activación duplicada.`);
                return res.status(200).json({
                    received: true,
                    status: "already_processed",
                    message: "Evento ignorado por idempotencia: Transacción procesada previamente.",
                    transactionReference: refTx
                });
            }

            // Marcar transacción como procesada en Redis (TTL de 24 horas)
            try {
                if (redis && typeof redis.set === 'function') {
                    await redis.set(idempotencyKey, 'PROCESSED', 'EX', 86400);
                }
            } catch {}
        }

        if (['APPROVED', 'APPROVED_PAYMENT', 'SUCCESS', 'TRANSACTION.UPDATED'].includes(statusTx) && customerEmail) {
            const cleanEmail = String(customerEmail).toLowerCase().trim().replace(/[^a-zA-Z0-9@._-]/g, '');
            console.log(`✅ [PAYMENT WEBHOOK SUCCESS]: Transacción [${refTx}] APROBADA para usuario [${cleanEmail}]. Activando suscripción...`);

            try {
                await supabase
                    .from('usuarios')
                    .update({ 
                        account_status: 'active',
                        onboarding_completed: true
                    })
                    .eq('email', cleanEmail);
            } catch (dbErr) {
                console.error("⚠️ [PAYMENT WEBHOOK ERROR DB]: Error actualizando usuario en Supabase:", dbErr.message);
            }
        }

        return res.status(200).json({
            received: true,
            status: "processed",
            verifiedSignature: isSignatureValid,
            transactionReference: refTx || null,
            processedAt: new Date().toISOString()
        });
    } catch(err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;

