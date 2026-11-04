// TwinService.js - Conector del Sistema de Control Adaptativo Cognitivo (ACCS - Dante OS v21.2.0 Clean Architecture)
import { supabase } from '../../../supabaseClient.js';

/**
 * Invoca de manera atómica el procedimiento almacenado (RPC) para procesar el sub-gemelo del estudiante.
 * @param {Object} payloadInput - Payload de la interacción conductual observada.
 * @returns {Promise<Object|null>} El estado proyectado actual del gemelo digital o null.
 */
export async function actualizarGemeloDigital(payloadInput) {
    try {
        if (!payloadInput || typeof payloadInput !== 'object') {
            console.error("⚠️ [ACCS TWIN SERVICE]: Payload de entrada corrupto o inválido.");
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
            console.error("⚠️ [ACCS TWIN SERVICE]: Abortado por parámetros de identidad vacíos o nulos.");
            return null;
        }

        const rawTime = parseFloat(responseTime || tiempo || 0);
        const tiempoFinalMs = rawTime > 100 ? Math.round(rawTime) : Math.round(rawTime * 1000);
        
        const networkLatencyMs = Math.max(0, parseFloat(payloadInput.networkLatencyMs || payloadInput.rtt || 0));
        const renderLagMs = Math.max(0, parseFloat(payloadInput.renderLagMs || payloadInput.domPaintTimeMs || 0));
        
        const pureCognitiveLatencyMs = Math.max(500, tiempoFinalMs - networkLatencyMs - renderLagMs);

        const payloadTransaccional = {
            p_student_id: studentIdSanitizado,
            p_area_general: areaGeneralSanitizada,
            p_is_correct: Boolean(respuestaCorrecta),
            p_response_time_ms: pureCognitiveLatencyMs, 
            p_declared_confidence: normalizarConfianzaMetacognitiva(declaredConfidence || certeza)
        };

        const { data: estadoActualizado, error } = await supabase.rpc('actualizar_estado_gemelo_accs', payloadTransaccional);

        if (error) throw error;

        if (estadoActualizado) {
            console.log(`🧠 [COS TWIN SERVICE]: Sincronización Exitosa -> [${estadoActualizado.student_id || studentIdSanitizado}] | Área: [${estadoActualizado.area_general || areaGeneralSanitizada}] | Estado: ${estadoActualizado.estado_operacional || 'UP-TO-DATE'}`);
        }
        
        return estadoActualizado;

    } catch (error) {
        console.error("🚨 [ACCS TWIN SERVICE CRITICAL FAILURE]: Cortocircuito en la capa transaccional del servicio:", error.message || error);
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

export function simularTrayectoriaMonteCarlo(thetaActual = 0.0, semActual = 0.35, nSimulaciones = 1000) {
    const thetaNum = parseFloat(thetaActual || 0.0);
    const semNum = Math.max(0.05, parseFloat(semActual || 0.35));

    const simSaber11 = [];
    const simUNAL = [];
    const simUdeA = [];

    for (let i = 0; i < nSimulaciones; i++) {
        const u1 = Math.max(1e-10, Math.random());
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        const thetaSimulated = thetaNum + z0 * semNum;

        const s11 = Math.max(0, Math.min(500, Math.round(250 + thetaSimulated * 50)));
        const unal = Math.max(0, Math.min(1000, Math.round(500 + thetaSimulated * 100)));
        const udea = Math.max(0, Math.min(100, Math.round(50 + thetaSimulated * 10)));

        simSaber11.push(s11);
        simUNAL.push(unal);
        simUdeA.push(udea);
    }

    simSaber11.sort((a, b) => a - b);
    simUNAL.sort((a, b) => a - b);
    simUdeA.sort((a, b) => a - b);

    const getPercentil = (arr, p) => arr[Math.floor(arr.length * p)];

    // Cálculo estricto del Intervalo de Confianza al 95% (Z = 1.95996)
    const z95 = 1.96;
    const s11_puntaje_estimado = Math.max(0, Math.min(500, Math.round(250 + thetaNum * 50)));
    const s11_margen_error = Math.round(z95 * semNum * 50);
    const s11_ic95_inferior = Math.max(0, Math.min(500, s11_puntaje_estimado - s11_margen_error));
    const s11_ic95_superior = Math.max(0, Math.min(500, s11_puntaje_estimado + s11_margen_error));

    const unal_puntaje_estimado = Math.max(0, Math.min(1000, Math.round(500 + thetaNum * 100)));
    const unal_margen_error = Math.round(z95 * semNum * 100);
    const unal_ic95_inferior = Math.max(0, Math.min(1000, unal_puntaje_estimado - unal_margen_error));
    const unal_ic95_superior = Math.max(0, Math.min(1000, unal_puntaje_estimado + unal_margen_error));

    const udea_puntaje_estimado = Math.max(0, Math.min(100, Math.round(50 + thetaNum * 10)));
    const udea_margen_error = Math.round(z95 * semNum * 10);
    const udea_ic95_inferior = Math.max(0, Math.min(100, udea_puntaje_estimado - udea_margen_error));
    const udea_ic95_superior = Math.max(0, Math.min(100, udea_puntaje_estimado + udea_margen_error));

    return {
        thetaBaseline: thetaNum,
        semBaseline: semNum,
        nSimulaciones,
        saber11: {
            puntaje_estimado: s11_puntaje_estimado,
            intervalo_95: [s11_ic95_inferior, s11_ic95_superior],
            margen_error: s11_margen_error,
            p10: getPercentil(simSaber11, 0.10),
            p50_mediana: getPercentil(simSaber11, 0.50),
            p90: getPercentil(simSaber11, 0.90),
            probabilidadSuperar350: parseFloat((simSaber11.filter(s => s >= 350).length / nSimulaciones).toFixed(4))
        },
        unal: {
            puntaje_estimado: unal_puntaje_estimado,
            intervalo_95: [unal_ic95_inferior, unal_ic95_superior],
            margen_error: unal_margen_error,
            p10: getPercentil(simUNAL, 0.10),
            p50_mediana: getPercentil(simUNAL, 0.50),
            p90: getPercentil(simUNAL, 0.90),
            probabilidadSuperar700: parseFloat((simUNAL.filter(u => u >= 700).length / nSimulaciones).toFixed(4))
        },
        udea: {
            puntaje_estimado: udea_puntaje_estimado,
            intervalo_95: [udea_ic95_inferior, udea_ic95_superior],
            margen_error: udea_margen_error,
            p10: getPercentil(simUdeA, 0.10),
            p50_mediana: getPercentil(simUdeA, 0.50),
            p90: getPercentil(simUdeA, 0.90),
            probabilidadSuperar70: parseFloat((simUdeA.filter(u => u >= 70).length / nSimulaciones).toFixed(4))
        }
    };
}

export function generarPrescripcionMicroDosis(gemeloState = {}, mapaCalorSesgos = {}, cgiResult = {}) {
    const thetaCurrent = parseFloat(gemeloState.theta || gemeloState.thetaEstimado || 0.0);
    const cgiVal = parseFloat(cgiResult.cgi || 0.0);

    const bTarget = parseFloat(Math.min(3.0, Math.max(-3.0, thetaCurrent + 0.25)).toFixed(4));

    let nItemsRecomendado = 10;
    if (cgiVal > 0.15) {
        nItemsRecomendado = 6;
    } else if (cgiVal < -0.15) {
        nItemsRecomendado = 8;
    }

    let sesgoDominante = 'attr_heuristica_lineal';
    let maxValor = -1;
    if (mapaCalorSesgos && typeof mapaCalorSesgos === 'object') {
        Object.entries(mapaCalorSesgos).forEach(([sesgoKey, val]) => {
            const numVal = parseFloat(val || 0);
            if (numVal > maxValor) {
                maxValor = numVal;
                sesgoDominante = sesgoKey;
            }
        });
    }

    const descripcionesSesgos = {
        attr_heuristica_lineal: "Sesgo de Heurística Lineal: Tendencia a asumir proporcionalidad directa en enunciados complejos.",
        attr_inversion_operacional: "Sesgo de Inversión Operacional: Confusión recurrente entre transformaciones inversas.",
        attr_omision_conversion: "Omisión de Conversión de Unidades: Desatención a escalas o dimensiones antes de operar.",
        attr_error_geometrico: "Desatención a Propiedades Métricas Espaciales: Incomprensión de relaciones geométricas no explícitas."
    };

    const mensajeClinico = `Micro-dosis prescrita de ${nItemsRecomendado} ítems a dificultad b=${bTarget}. Foco de remediación: ${descripcionesSesgos[sesgoDominante] || sesgoDominante}`;

    return {
        bTarget,
        nItemsRecomendado,
        sesgoDominanteTarget: sesgoDominante,
        mensajeClinico
    };
}
