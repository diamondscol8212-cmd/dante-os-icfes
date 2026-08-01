import { supabase } from './supabaseClient.js';
import { redis } from './redisClient.js';

export const registrarEventoConductual = async (datosInterfaz) => {
  try {
    if (datosInterfaz.responseTimeSeconds > 45 || (datosInterfaz.declaredConfidence === 'alta' && !datosInterfaz.isCorrect)) {
      await redis.set(`dante:flag:${datosInterfaz.studentId}`, JSON.stringify({ necesitaIntervencion: true, motivo: 'FATIGA_O_PUNTO_CIEGO' })).catch(() => {});
    }

    const { data, error } = await supabase
      .from('registro_eventos')
      .insert([
        {
          id: crypto.randomUUID(),
          student_id: datosInterfaz.studentId,
          item_id: datosInterfaz.itemId,
          skill: datosInterfaz.skill,
          is_correct: datosInterfaz.isCorrect,
          response_time: datosInterfaz.responseTimeSeconds,
          session_duration: datosInterfaz.sessionDurationMinutes,
          declared_confidence: datosInterfaz.declaredConfidence,
          selection_vector: datosInterfaz.selectionVector
        }
      ]);

    if (error) throw error;
    console.log('📡 [Telemetría v2.0]: Evento crudo inyectado con éxito en el servidor.');
  } catch (error) {
    console.warn('⚠️ [Falla de Red]: No se pudo registrar la telemetría, el chasis continúa protegido:', error.message);
  }
};
