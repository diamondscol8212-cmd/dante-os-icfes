import { supabase } from './supabaseClient.js';
import { redis } from './redisClient.js';

export const registrarEventoConductual = async (datosInterfaz) => {
  try {
    if (datosInterfaz.responseTimeSeconds > 45 || (datosInterfaz.declaredConfidence === 'alta' && !datosInterfaz.isCorrect)) {
      const motivo = 'Fatiga + Sobreconfianza';
      
      try {
        await redis.set(`dante:flag:${datosInterfaz.studentId}`, JSON.stringify({ necesitaIntervencion: true, motivo }));
      } catch (e) {
        // Redis fallback safe
      }

      try {
        await supabase
          .from('perfil_usuario_control')
          .upsert({
            student_id: datosInterfaz.studentId,
            necesita_intervencion: true,
            motivo_intervencion: motivo,
            ultima_actualizacion: new Date().toISOString()
          });
      } catch (e) {
        // Supabase fallback safe
      }
    }

    const { error } = await supabase
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

    if (error) {
      console.warn('⚠️ [Telemetría Warning]:', error.message);
    } else {
      console.log('📡 [Telemetría v2.0]: Evento crudo inyectado con éxito en el servidor.');
    }
  } catch (error) {
    console.warn('⚠️ [Falla de Red]: No se pudo registrar la telemetría, el chasis continúa protegido:', error.message);
  }
};
