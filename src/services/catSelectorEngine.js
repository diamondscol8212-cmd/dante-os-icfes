// catSelectorEngine.js - Motor de Selección Adaptativa Óptima (Dante OS v21.0.0 Enterprise)
import { calcularInformacionFisher } from './engine3PL.js';

export const SPECTRUM_CONTROLS = {
    MIN_THETA: -4.0000,
    MAX_THETA: 4.0000,
    RESOLUTION_STEP: 0.50,
    UMBRAL_SEM_CRITICO: 0.28,      // Umbral estándar de precisión psicométrica IRT (SEM <= 0.28)
    MIN_ITEMS_MANDATORIOS: 5,     // Evaluación mínima para reporte válido
    MAX_ITEMS_MANDATORIOS: 15     // Límite superior garantizado de cierre
};

export function validarContratoItem(item) {
    if (!item || !item.id || typeof item.id !== 'string') throw new Error("Contrato Roto: item.id mandatorio string.");
    if (!item.pregunta_texto) throw new Error("Contrato Roto: pregunta_texto mandatoria.");
    if (!Array.isArray(item.opciones_respuesta)) throw new Error("Contrato Roto: opciones_respuesta debe ser Array.");
    if (typeof item.b !== 'number' && isNaN(parseFloat(item.b))) throw new Error("Contrato Roto: Parámetro b psicométrico debe ser numérico.");
}

export function calcularIndiceBucket(theta) {
    const thetaAcotado = Math.max(SPECTRUM_CONTROLS.MIN_THETA, Math.min(SPECTRUM_CONTROLS.MAX_THETA, parseFloat(theta || 0)));
    return Math.round((thetaAcotado + Math.abs(SPECTRUM_CONTROLS.MIN_THETA)) / SPECTRUM_CONTROLS.RESOLUTION_STEP);
}

export function obtenerSiguienteItem(sessionState, cacheInstancia) {
    if (!sessionState || !cacheInstancia) {
        throw new Error("🚨 [SELECTOR CRITICAL]: Parámetros máster ausentes. Abortando selección.");
    }

    const { theta, sem_bayesian, items_respondidos_count, seen_item_ids, priors_dinamicos } = sessionState;
    const { mapaParametros, matrizBucketsDificultad } = cacheInstancia;

    const currentThetaFloat = parseFloat(theta || 0.0);
    const currentSemFloat = parseFloat(sem_bayesian || 1.0);
    const currentCountInt = parseInt(items_respondidos_count || 0, 10);

    // ====================================================================
    // 🛡️ REGLA DE CONTROL 1: EVALUACIÓN Y DETENCIÓN AUTOMÁTICA
    // ====================================================================
    const alcanzominimo = currentCountInt >= SPECTRUM_CONTROLS.MIN_ITEMS_MANDATORIOS;
    const alcanzoPrecision = currentSemFloat <= SPECTRUM_CONTROLS.UMBRAL_SEM_CRITICO;
    const alcanzoMaximo = currentCountInt >= SPECTRUM_CONTROLS.MAX_ITEMS_MANDATORIOS;

    if ((alcanzominimo && alcanzoPrecision) || alcanzoMaximo) {
        console.log(`🏁 [REGLA DE PARADA DETONADA]: Ítems = ${currentCountInt}, SEM = ${currentSemFloat.toFixed(4)}`);
        return { success: true, detenerExamen: true, codigo_control: 'CRITERIO_DE_PARADA_ALCANZADO' };
    }

    const exclusionSet = new Set(seen_item_ids || []);
    const targetIndex = calcularIndiceBucket(currentThetaFloat);
    const maxBucketIdx = Math.max(0, (matrizBucketsDificultad?.length || 17) - 1);
    const ventanaIndices = [targetIndex, Math.max(0, targetIndex - 1), Math.min(maxBucketIdx, targetIndex + 1)];
    
    const poolCandidatosAcotado = [];

    if (matrizBucketsDificultad && matrizBucketsDificultad.length > 0) {
        for (let i = 0; i < ventanaIndices.length; i++) {
            const bucket = matrizBucketsDificultad[ventanaIndices[i]];
            if (!bucket) continue;
            for (let j = 0; j < bucket.length; j++) {
                const item = bucket[j];
                if (!exclusionSet.has(item.id)) {
                    poolCandidatosAcotado.push(item);
                }
            }
        }
    }

    if (poolCandidatosAcotado.length === 0 && mapaParametros && mapaParametros.size > 0) {
        for (const item of mapaParametros.values()) {
            if (!exclusionSet.has(item.id)) {
                poolCandidatosAcotado.push(item);
            }
        }
    }

    // Si el banco se agota completamente, detiene el examen y guarda lo acumulado
    if (poolCandidatosAcotado.length === 0) {
        console.warn("⚠️ [HOMEOCONTROL AGOTAMIENTO]: No existen más ítems en RAM. Consolidando examen.");
        return { success: true, detenerExamen: true, codigo_control: 'BANCO_CONSUMIDO_TOTALMENTE' };
    }

    // ====================================================================
    // 🛡️ REGLA DE CONTROL 2: PONDERACIÓN, EXPOSICIÓN SYMPSON-HETTER Y SELECCIÓN ESTOCÁSTICA
    // ====================================================================
    const estudiantePriors = priors_dinamicos || {};

    const reactivosEvaluados = [];
    for (let i = 0; i < poolCandidatosAcotado.length; i++) {
        const item = poolCandidatosAcotado[i];
        validarContratoItem(item); 
        
        const bNum = Number.isFinite(item.b) ? item.b : (parseFloat(item.b) || 0.0);
        const aNum = Number.isFinite(item.a) ? item.a : (parseFloat(item.a) || 1.0);
        const cNum = Number.isFinite(item.c) ? item.c : (parseFloat(item.c) || 0.25);

        // Control de exposición Sympson-Hetter: Si discriminación a > 1.8, aplicar factor de amortiguación
        let factorExposureSympsonHetter = 1.0;
        if (aNum > 1.8) {
            factorExposureSympsonHetter = 0.75; // Amortiguador estocástico para ítems de alta discriminación
        }

        const distanciaAbsoluta = Math.abs(bNum - currentThetaFloat);
        const fisherRaw = calcularInformacionFisher(currentThetaFloat, aNum, bNum, cNum);
        
        let penalizacionO_InyeccionSesgo = 0.0;
        if (item.matriz_q) {
            const keys = Object.keys(item.matriz_q);
            for (let k = 0; k < keys.length; k++) {
                const attr = keys[k];
                if (item.matriz_q[attr] === 1) {
                    const probabilidadFallaAtributo = parseFloat(estudiantePriors[attr] || 0.5);
                    if (probabilidadFallaAtributo > 0.60) {
                        penalizacionO_InyeccionSesgo += probabilidadFallaAtributo * 1.5;
                    }
                }
            }
        }

        const scoreSelector = ((fisherRaw * 0.70) + ((1 / (1 + distanciaAbsoluta)) * 0.15) + (penalizacionO_InyeccionSesgo * 0.15)) * factorExposureSympsonHetter;
        
        reactivosEvaluados.push({ ...item, a: aNum, b: bNum, c: cNum, scoreSelector });
    }

    reactivosEvaluados.sort((x, y) => y.scoreSelector - x.scoreSelector);

    // Selección estocástica entre los candidatos de mayor puntaje
    const topCandidatos = reactivosEvaluados.slice(0, Math.min(3, reactivosEvaluados.length));
    const itemGanador = topCandidatos[Math.floor(Math.random() * topCandidatos.length)];

    return {
        success: true,
        detenerExamen: false,
        item: {
            id: itemGanador.id,
            pregunta_texto: itemGanador.pregunta_texto,
            opciones_respuesta: itemGanador.opciones_respuesta,
            sub_competencia: itemGanador.sub_competencia
        },
        meta_seleccion: {
            distancia_logit: parseFloat(Math.abs(itemGanador.b - currentThetaFloat).toFixed(4)),
            pool_k_evaluado: reactivosEvaluados.length,
            bucket_origen: targetIndex
        }
    };
}

