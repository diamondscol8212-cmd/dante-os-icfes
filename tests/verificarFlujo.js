// verificarFlujo.js - Auxiliar de verificación de banderas conductuales para testSuite.js
import { redis } from '../redisClient.js';
import { supabase } from '../supabaseClient.js';

export async function verificarBanderaIntervencion(studentId) {
    try {
        const key = `dante:flag:${studentId}`;
        const flagCache = await redis.get(key);
        if (flagCache) {
            const parsed = JSON.parse(flagCache);
            return { 
                necesitaIntervencion: Boolean(parsed.necesitaIntervencion), 
                motivo: parsed.motivo || "Fatiga + Sobreconfianza" 
            };
        }

        const { data: perfilData } = await supabase
            .from('perfil_usuario_control')
            .select('*')
            .eq('student_id', studentId)
            .maybeSingle();

        if (perfilData) {
            return { 
                necesitaIntervencion: Boolean(perfilData.necesita_intervencion), 
                motivo: perfilData.motivo_intervencion || "Fatiga + Sobreconfianza" 
            };
        }
    } catch (e) {
        // Fallback
    }
    return { necesitaIntervencion: false, motivo: "Sin anomalías" };
}
