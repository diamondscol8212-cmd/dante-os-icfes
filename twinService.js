// twinService.js - Conector del Sistema de Control Adaptativo Cognitivo (ACCS - Dante OS v20.5)
import { supabase } from './supabaseClient.js';

/**
 * Invoca de manera atómica el procedimiento almacenado (RPC) para procesar el sub-gemelo del estudiante.
 * @param {Object} interacción - Payload de la interacción conductual observada.
 * @returns {Promise<Object|null>} El estado proyectado actual del gemelo digital o null.
 */
export async function actualizarGemeloDigital(payloadInput) {
    try {
        if (!payloadInput || typeof payloadInput !== 'object') {
            console.error("⚠️ [ACCS TWIN SERVICE]: Payload de entrada corrupto o inválido.");
            return null;
        }

        // Extracción elástica flexible para acoplar nomenclaturas mixtas del pool de Redis (tiempo / responseTime)
        const { 
            studentId, 
            areaGeneral, 
            respuestaCorrecta, 
            responseTime, 
            tiempo, 
            declaredConfidence, 
            certeza 
        } = payloadInput;

        // 🛡️ Capa de Validación y Sanitización Estricta Perimetral
        const studentIdSanitizado = String(studentId || '').trim();
        const areaGeneralSanitizada = String(areaGeneral || '').toLowerCase().trim();

        if (!studentIdSanitizado || !areaGeneralSanitizada) {
            console.error("⚠️ [ACCS TWIN SERVICE]: Abortado por parámetros de identidad vacíos o nulos.");
            return null;
        }

        // 🌟 SANEAMIENTO ANTIDEPÓSITO v20.5: Forzar el casteo correcto a segundos planos para el cálculo del EMA
        const rawTime = parseFloat(responseTime || tiempo || 0);
        
        // Si el valor ya viene formateado en milisegundos desde el cliente (>100), no lo re-multiplicamos
        const tiempoFinalMs = rawTime > 100 ? Math.round(rawTime) : Math.round(rawTime * 1000);

        // Mapeo limpio hacia los parámetros del Stored Procedure de PostgreSQL
        const payloadTransaccional = {
            p_student_id: studentIdSanitizado,
            p_area_general: areaGeneralSanitizada,
            p_is_correct: Boolean(respuestaCorrecta),
            p_response_time_ms: tiempoFinalMs, 
            p_declared_confidence: normalizarConfianzaMetacognitiva(declaredConfidence || certeza)
        };

        // Ejecución en Base de Datos (Aislado en una única transacción ACID nativa)
        const { data: estadoActualizado, error } = await supabase.rpc('actualizar_estado_gemelo_accs', payloadTransaccional);

        if (error) throw error;

        if (estadoActualizado) {
            console.log(`🧠 [COS TWIN SERVICE]: Sincronización Exitosa -> [${estadoActualizado.student_id || studentIdSanitizado}] | Área: [${estadoActualizado.area_general || areaGeneralSanitizada}] | Estado: ${estadoActualizado.estado_operacional || 'UP-TO-DATE'}`);
        }
        
        return estadoActualizado;

    } catch (error) {
        console.error("🚨 [ACCS TWIN SERVICE CRITICAL FAILURE]: Cortocorticuito en la capa transaccional del servicio:", error.message || error);
        return null;
    }
}

/**
 * Convierte los inputs categóricos o numéricos del frontend a un espacio métrico continuo [0.0, 1.0] para el cálculo del EMA
 */
function normalizarConfianzaMetacognitiva(confianzaInput) {
    if (typeof confianzaInput === 'number') {
        return Math.max(0.0000, Math.min(1.0000, confianzaInput));
    }
    
    const normalizado = String(confianzaInput || '').toLowerCase().trim();
    if (normalizado === 'alta' || normalizado === 'high')   return 0.9000;
    if (normalizado === 'media' || normalizado === 'medium') return 0.5000;
    if (normalizado === 'baja' || normalizado === 'low')    return 0.1000;
    
    return 0.5000; // Línea base defensiva ante payloads mutados o vacíos
}