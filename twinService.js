// twinService.js - Conector del Sistema de Control Adaptativo Cognitivo
import { supabase } from './supabaseClient.js';

export async function actualizarGemeloDigital(payloadInput) {
    try {
        if (!payloadInput || typeof payloadInput !== 'object') {
            return null;
        }

        const { 
            studentId, 
            areaGeneral, 
            respuestaCorrecta, 
            responseTime, 
            tiempo, 
            declaredConfidence, 
            certeza 
        } = payloadInput;

        const studentIdSanitizado = String(studentId || '').trim();
        const areaGeneralSanitizada = String(areaGeneral || '').toLowerCase().trim();

        if (!studentIdSanitizado || !areaGeneralSanitizada) {
            return null;
        }

        const rawTime = parseFloat(responseTime || tiempo || 0);
        const tiempoFinalMs = rawTime > 100 ? Math.round(rawTime) : Math.round(rawTime * 1000);

        const payloadTransaccional = {
            p_student_id: studentIdSanitizado,
            p_area_general: areaGeneralSanitizada,
            p_is_correct: Boolean(respuestaCorrecta),
            p_response_time_ms: tiempoFinalMs, 
            p_declared_confidence: normalizarConfianzaMetacognitiva(declaredConfidence || certeza)
        };

        const { data: estadoActualizado, error } = await supabase.rpc('actualizar_estado_gemelo_accs', payloadTransaccional);

        if (error) throw error;
        return estadoActualizado;

    } catch (error) {
        console.error("🚨 [ACCS TWIN SERVICE CRITICAL FAILURE]:", error.message || error);
        return null;
    }
}

function normalizarConfianzaMetacognitiva(confianzaInput) {
    if (typeof confianzaInput === 'number') {
        return Math.max(0.0000, Math.min(1.0000, confianzaInput));
    }
    
    const normalizado = String(confianzaInput || '').toLowerCase().trim();
    if (normalizado === 'alta' || normalizado === 'high')   return 0.9000;
    if (normalizado === 'media' || normalizado === 'medium') return 0.5000;
    if (normalizado === 'baja' || normalizado === 'low')    return 0.1000;
    
    return 0.5000;
}
