// catSelectorEngine.js - Motor de Selección Adaptativa Óptima (Dante OS v20.5.6 Enterprise)
import { calcularInformacionFisher } from './engine3PL.js';

const SPECTRUM_CONTROLS = {
    MIN_THETA: -4.0000,
    MAX_THETA: 4.0000,
    RESOLUTION_STEP: 0.50,
    UMBRAL_SEM_CRITICO: 0.22,
    MIN_ITEMS_MANDATORIOS: 12
};

function validarContratoItem(item) {
    if (!item.id || typeof item.id !== 'string') throw new Error("Contrato Roto: item.id mandatorio string.");
    if (!item.pregunta_texto) throw new Error("Contrato Roto: pregunta_texto mandatoria.");
    if (!Array.isArray(item.opciones_respuesta)) throw new Error("Contrato Roto: opciones_respuesta debe ser Array.");
    if (typeof item.b !== 'number' && isNaN(parseFloat(item.b))) throw new Error("Contrato Roto: Parámetro b psicométrico debe ser numérico.");
}

function calcularIndiceBucket(theta) {
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
    // 🛡️ REGLA DE CONTROL 1: EVALUACIÓN DEL CRITERIO DE PARADA BAYESIANO
    // ====================================================================
    if (currentCountInt >= SPECTRUM_CONTROLS.MIN_ITEMS_MANDATORIOS && currentSemFloat < SPECTRUM_CONTROLS.UMBRAL_SEM_CRITICO) {
        return { success: true, detenerExamen: true, codigo_control: 'CRITERIO_DE_PARADA_ALCANZADO' };
    }

    const exclusionSet = new Set(seen_item_ids || []);
    const targetIndex = calcularIndiceBucket(currentThetaFloat);
    const ventanaIndices = [targetIndex, Math.max(0, targetIndex - 1), Math.min(16, targetIndex + 1)];
    
    let poolCandidatosAcotado = [];

    // Verificación defensiva contra buckets no inicializados en frío
    if (matrizBucketsDificultad && matrizBucketsDificultad.length > 0) {
        ventanaIndices.forEach(idx => {
            const bucket = matrizBucketsDificultad[idx] || [];
            bucket.forEach(item => {
                if (!exclusionSet.has(item.id)) {
                    poolCandidatosAcotado.push(item);
                }
            });
        });
    }

    // Fallback elástico: Si la vecindad inmediata fue consumida, barrer el mapa completo
    if (poolCandidatosAcotado.length === 0 && mapaParametros && mapaParametros.size > 0) {
        mapaParametros.forEach(item => {
            if (!exclusionSet.has(item.id)) poolCandidatosAcotado.push(item);
        });
    }

    // Homeostasis por vaciado absoluto o Cold Start crítico
    if (poolCandidatosAcotado.length === 0) {
        console.warn("⚠️ [HOMEOCONTROL AGOTAMIENTO]: No existen más ítems disponibles libres en RAM.");
        return { success: true, detenerExamen: true, codigo_control: 'BANCO_CONSUMIDO_TOTALMENTE' };
    }

    // ====================================================================
    // 🛡️ REGLA DE CONTROL 3: OPTIMIZACIÓN CON ANDAMIAJE PEDAGÓGICO DIRIGIDO
    // ====================================================================
    const estudiantePriors = priors_dinamicos || {};

    const reactivosEvaluados = poolCandidatosAcotado.map(item => {
        validarContratoItem(item); 
        
        const bNum = parseFloat(item.b);
        const aNum = parseFloat(item.a || 1.0);
        const cNum = parseFloat(item.c || 0.0);

        const distanciaAbsoluta = Math.abs(bNum - currentThetaFloat);
        const fisherRaw = calcularInformacionFisher(currentThetaFloat, aNum, bNum, cNum);
        
        // 🌟 INYECCIÓN DE ANDAMIAJE COGNITIVO: Cruzar priors con la Matriz Q del ítem
        let penalizacionO_InyeccionSesgo = 0.0;
        if (item.matriz_q) {
            Object.keys(item.matriz_q).forEach(attr => {
                if (item.matriz_q[attr] === 1) {
                    const probabilidadFallaAtributo = parseFloat(estudiantePriors[attr] || 0.5);
                    if (probabilidadFallaAtributo > 0.60) {
                        penalizacionO_InyeccionSesgo += probabilidadFallaAtributo * 1.5;
                    }
                }
            });
        }

        // Puntuación balanceada de alta fidelidad (70% Fisher, 15% Logit Proximidad, 15% Foco en Sesgo)
        const scoreSelector = (fisherRaw * 0.70) + ((1 / (1 + distanciaAbsoluta)) * 0.15) + (penalizacionO_InyeccionSesgo * 0.15);
        
        return { ...item, a: aNum, b: bNum, c: cNum, scoreSelector };
    });

    // Ordenación descendente de candidatos según el score acumulado
    reactivosEvaluados.sort((x, y) => y.scoreSelector - x.scoreSelector);

    // Ventana estocástica superior para evitar memorización lineal
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
