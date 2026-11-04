// ProfileService.js - Servicio de Dominio para Gemelo Digital, Ledger Inmutable y Persistencia (Dante OS v22.2.0)
// Bogotá, Colombia
import { supabase } from '../../../supabaseClient.js';
import { redis } from '../../../redisClient.js';
import { registrarSnapshotLedgerInmutable, persistirProgresoResiliente } from './CatRepository.js';
import { REDIS_TTL_SECONDS } from './SessionService.js';
import { actualizarGemeloDigital } from './TwinService.js';

export {
    registrarSnapshotLedgerInmutable,
    persistirProgresoResiliente,
    actualizarGemeloDigital
};

/**
 * 👤 Guardar perfil de estudiante en caché Redis.
 */
export async function guardarPerfilCache(areaSaneada, studentIdSaneado, profilePayload) {
    const profileCacheKey = `dante:profile:${areaSaneada}:${studentIdSaneado}`;
    await redis.setex(profileCacheKey, REDIS_TTL_SECONDS, JSON.stringify(profilePayload)).catch(() => {});
}

/**
 * 👤 Obtener perfil de estudiante desde caché Redis.
 */
export async function obtenerPerfilCache(areaSaneada, studentIdSaneado) {
    const profileCacheKey = `dante:profile:${areaSaneada}:${studentIdSaneado}`;
    const cachedProfile = await redis.get(profileCacheKey);
    return cachedProfile ? JSON.parse(cachedProfile) : null;
}

/**
 * 💎 Consultar Gemelo Digital de un Estudiante en Supabase con Fallback a Eventos.
 */
export async function obtenerGemeloEstudianteService(studentIdRaw) {
    if (!studentIdRaw) {
        throw new Error("Identificador de estudiante requerido.");
    }

    const studentIdSaneado = String(studentIdRaw).toLowerCase().trim().split('@')[0];

    const { data: progreso, error: progErr } = await supabase
        .from('progreso_estudiantes')
        .select('*')
        .eq('estudiante', studentIdSaneado)
        .order('ultima_actualizacion', { ascending: false });

    if (progErr) {
        console.warn("⚠️ [CONSULTA PROGRESO WARN]:", progErr.message);
    }

    let resultadoGemelo = progreso || [];

    if (!resultadoGemelo || resultadoGemelo.length === 0) {
        const { data: eventos, error: evErr } = await supabase
            .from('registro_eventos')
            .select('*')
            .eq('student_id', studentIdSaneado)
            .order('created_at', { ascending: false });

        if (!evErr && eventos && eventos.length > 0) {
            const totalRespuestas = eventos.length;
            
            const aciertos = eventos.filter(e => {
                if (e.is_correct === true) return true;
                if (typeof e.is_correct === 'string') {
                    const str = e.is_correct.toLowerCase().trim();
                    return str === 'true' || str === 't' || str === '1';
                }
                return false;
            }).length;

            const porcentajeAcierto = Math.round((aciertos / (totalRespuestas || 1)) * 100);
            const puntajeEstimado = Math.max(15, Math.min(100, Math.round(porcentajeAcierto)));

            resultadoGemelo = [{
                estudiante: studentIdSaneado,
                materia: 'lectura_critica',
                theta_algebra_calculo: parseFloat(((puntajeEstimado - 50) / 13.8).toFixed(4)),
                theta_geometria_medicion: 0.5000,
                theta_estadistica_probabilidad: 0.5000,
                indice_recuperacion_intelectual: 0.50,
                indice_curiosidad_conductual: 0.50,
                bayesian_sem: 0.35,
                items_respondidos: {
                    puntaje_escalonado: puntajeEstimado,
                    adn_empaquetado: {
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

    return resultadoGemelo;
}
