import { supabase } from './supabaseClient.js';

/**
 * Apaga la bandera de intervención en el servidor para permitir que el usuario continúe.
 * @param {string} studentId - El ID del estudiante actual
 */
export const resetearBanderaControl = async (studentId) => {
  try {
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
    console.error('⚠️ Error crítico al resetear la bandera:', error.message);
  }
};