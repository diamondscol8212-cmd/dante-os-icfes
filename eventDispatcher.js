import { supabase } from './supabaseClient.js';
/**
 * Despacha el micro-evento crudo de comportamiento hacia Supabase de forma asíncrona.
 * @param {Object} datosInterfaz - Datos recolectados por el chasis v1.6/2.0
 */
export const registrarEventoConductual = async (datosInterfaz) => {
  try {
    // El chasis genera un UUID local para el evento o deja que Postgres lo maneje
    const { data, error } = await supabase
      .from('registro_eventos')
      .insert([
        {
          id: crypto.randomUUID(), // Genera un identificador único en el dispositivo
          student_id: datosInterfaz.studentId, // Identificador de la sesión del usuario
          item_id: datosInterfaz.itemId,       // ID del reactivo contestado
          skill: datosInterfaz.skill,         // Competencia (ej: 'algebra_calculo')
          is_correct: datosInterfaz.isCorrect, // true / false
          response_time: datosInterfaz.responseTimeSeconds,   // Segundos en el reactivo
          session_duration: datosInterfaz.sessionDurationMinutes, // Minutos totales acumulados
          declared_confidence: datosInterfaz.declaredConfidence, // 'alta', 'media', 'baja'
          selection_vector: datosInterfaz.selectionVector     // Array con el historial de clics
        }
      ]);

    if (error) throw error;
    
    console.log('📡 [Telemetría v2.0]: Evento crudo inyectado con éxito en el servidor.');
  } catch (error) {
    // Falla silenciosa en producción: si el internet del usuario falla, 
    // la app no se rompe ni se traba; el examen continúa de forma segura.
    console.warn('⚠️ [Falla de Red]: No se pudo registrar la telemetría, el chasis continúa protegido:', error.message);
  }
};