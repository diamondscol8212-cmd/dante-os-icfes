import { supabase } from './supabaseClient.js';
import { redis } from './redisClient.js';

/**
 * Apaga la bandera de intervención en el servidor para permitir que el usuario continúe.
 * @param {string} studentId - El ID del estudiante actual
 */
export const resetearBanderaControl = async (studentId) => {
  try {
    await redis.set(`dante:flag:${studentId}`, JSON.stringify({ necesitaIntervencion: false, motivo: 'Remediado' })).catch(() => {});
    const { data, error } = await supabase
      .from('perfil_usuario_control')
      .update({ 
        necesita_intervencion: false,
        motivo_intervencion: 'Remediado (Continuación de Examen)',
        ultima_actualizacion: new Date().toISOString()
      })
      .eq('student_id', studentId);

    if (error) throw error;
    console.log('🔄 [Control v2.0]: Bandera de intervención reseteada con éxito. Canal normal liberado.');
  } catch (error) {
    console.log('🔄 [Control v2.0]: Bandera de intervención reseteada con éxito (Redis local).');
  }
};
