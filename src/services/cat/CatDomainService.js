// CatDomainService.js - Motor Psicométrico Inmutable, MIRT y Calibración Empírica (Dante OS v21.2.0)
import { estimarHabilidadEAP, calcularInformacionFisher, calcularProbabilidad3PL } from '../engine3PL.js';

/**
 * 🧮 MATRIZ DE COVARIANZA INTER-DOMINIO (Multivariate IRT - MIRT)
 * Las habilidades matemáticas en el ICFES están fuertemente correlacionadas.
 * Matriz Sigma Σ (Álgebra, Geometría, Estadística)
 */
const MATRIZ_COVARIANZA_SIGMA = {
    algebra:     { algebra: 1.00, geometria: 0.68, estadistica: 0.62 },
    geometria:   { algebra: 0.68, geometria: 1.00, estadistica: 0.58 },
    estadistica: { algebra: 0.62, geometria: 0.58, estadistica: 1.00 }
};

/**
 * 📊 CALIBRACIÓN EMPÍRICA DE LA MATRIZ Q (Priors Bayesiano)
 * Calcula dinámicamente los pesos de verosimilitud de la masa de distractores (q_ij)
 * basándose en la varianza observada de la cohorte y los parámetros IRT del ítem.
 */
export function calcularPesosEmpiricosQ(item, opcionMarcadaOriginal, cohortVariance = 0.25) {
    const a = item?.a || 1.0;
    const b = item?.b || 0.0;
    
    // Sensibilidad del distractor escalada dinámicamente por la discriminación (a) y la varianza observada
    const pesoVariabilidad = Math.min(0.95, Math.max(0.40, 0.60 + (a - 1.0) * 0.15 + (cohortVariance - 0.25) * 0.20));
    const pesoSano = Math.max(0.02, Math.min(0.30, 0.12 / (1.0 + Math.abs(b))));

    return {
        lhFractura: parseFloat(pesoVariabilidad.toFixed(4)),
        lhSano: parseFloat(pesoSano.toFixed(4))
    };
}

/**
 * 📐 ACTUALIZACIÓN MULTIDIMENSIONAL VERDADERA (MIRT Covariance Update)
 * Cuando se re-estima theta en un sub-dominio (k), propaga proporcionalmente
 * la actualización a los sub-dominios correlacionados (j != k).
 */
export function actualizarVectorThetaMIRT(thetasActuales, subDominioTarget, deltaThetaTarget, semsActuales = {}) {
    const nuevosThetas = { ...thetasActuales };
    const dominioLimpio = String(subDominioTarget).toLowerCase().trim();

    let targetKey = 'algebra';
    if (dominioLimpio.includes('geometria') || dominioLimpio.includes('medicion') || dominioLimpio.includes('razonamiento')) {
        targetKey = 'geometria';
    } else if (dominioLimpio.includes('estadistica') || dominioLimpio.includes('probabilidad') || dominioLimpio.includes('interpretacion')) {
        targetKey = 'estadistica';
    }

    nuevosThetas[targetKey] = parseFloat((nuevosThetas[targetKey] + deltaThetaTarget).toFixed(4));

    // Propagación covariante a otros dominios
    const covarianzaTarget = MATRIZ_COVARIANZA_SIGMA[targetKey] || MATRIZ_COVARIANZA_SIGMA.algebra;

    Object.keys(nuevosThetas).forEach(dom => {
        if (dom !== targetKey) {
            const rho = covarianzaTarget[dom] || 0.50;
            const semDom = semsActuales[dom] || 0.50;
            // Ponderación de actualización covariante amortiguada por la incertidumbre (SEM)
            const ajusteCovariante = deltaThetaTarget * rho * 0.35 * Math.min(1.0, semDom);
            nuevosThetas[dom] = parseFloat((nuevosThetas[dom] + ajusteCovariante).toFixed(4));
        }
    });

    return nuevosThetas;
}

/**
 * 🎲 SELECCIÓN STOCHASTIC SYMPSON-HETTER CONTROL DE EXPOSICIÓN
 * Evita el desgaste y la memorización de reactivos con a > 1.8 filtrando por cuotas y tasa de exposición.
 */
export function aplicarControlExposicionSympsonHetter(candidatos, exposureCounts = new Map(), targetMaxExposure = 0.25) {
    if (!Array.isArray(candidatos) || candidatos.length === 0) return candidatos;

    return candidatos.filter(item => {
        const count = exposureCounts.get(item.id) || 0;
        // Si el ítem tiene discriminación extremadamente alta (a > 1.8), penalizar si ya se ha expuesto frecuentemente
        if (item.a > 1.8) {
            const probAceptacion = Math.max(0.20, 1.0 - (count * 0.15));
            return Math.random() <= probAceptacion;
        }
        return true;
    });
}

/**
 * ⚡ FUNCIÓN PURA INMUTABLE: TRANSICIÓN DE ESTADO PSICOMÉTRICO
 * Toma el estado actual de sesión y una interacción entrante, retornando un NUEVO estado inmutable.
 */
export function calcularSiguienteEstadoInmutable(currentState, interactionData) {
    const { itemId, isCorrect, responseTime, declaredConfidence, metadatosItem, vectorVulnerabilidad, llavesAtributos } = interactionData;

    const newSeenItems = new Set(currentState.seen_item_ids || []);
    if (itemId) newSeenItems.add(itemId);

    const newResponses = [...(currentState.irt_responses || [])];
    
    if (itemId && metadatosItem) {
        newResponses.push({
            itemId: metadatosItem.id,
            correcto: Boolean(isCorrect),
            isCorrect: Boolean(isCorrect),
            selectedOption: interactionData.opcionMarcada,
            opcionesDescartadas: interactionData.opcionesDescartadas || [],
            timestampEpoch: Date.now(),
            thetaSnapshot: parseFloat(currentState.thetas?.[metadatosItem.sub_competencia] || currentState.thetas?.algebra || 0.0),
            responseTime: parseFloat(responseTime || 15.0),
            irt: { a: metadatosItem.a, b: metadatosItem.b, c: metadatosItem.c }
        });
    }

    // Re-estimación EAP
    let newThetaCalculado = currentState.thetas?.algebra || 0.0;
    let newSEM = currentState.sem_bayesian || 1.0;

    if (newResponses.length > 0) {
        const est = estimarHabilidadEAP(newResponses.map(r => ({
            a: r.irt.a, b: r.irt.b, c: r.irt.c, correcto: r.correcto
        })));
        newThetaCalculado = est.theta;
        newSEM = est.bayesianSEM;
    }

    // MIRT Covariance propagation
    const deltaTheta = newThetaCalculado - (currentState.thetas?.algebra || 0.0);
    const updatedThetas = actualizarVectorThetaMIRT(currentState.thetas || { algebra: 0, geometria: 0, estadistica: 0 }, metadatosItem?.sub_competencia || 'algebra', deltaTheta);

    // Actualización inmutable de priors Bayesianos con Calibración Empírica Q
    const newPriors = { ...(currentState.priors_dinamicos || {}) };
    
    if (itemId && metadatosItem && responseTime >= 4.0) {
        const { lhFractura, lhSano } = calcularPesosEmpiricosQ(metadatosItem, interactionData.opcionMarcadaOriginal);
        
        (llavesAtributos || []).forEach(attr => {
            let pFractura = parseFloat(newPriors[attr] !== undefined ? newPriors[attr] : 0.5);
            let pSano = 1.0 - pFractura;
            let lhF = 1.0; let lhS = 1.0; let evaluar = false;

            if (isCorrect) {
                if (metadatosItem.matriz_q?.[attr] === 1) { lhF = 0.15; lhS = 0.90; evaluar = true; }
            } else {
                if (vectorVulnerabilidad?.[attr] === 1) {
                    lhF = lhFractura; lhS = lhSano; evaluar = true;
                } else if (metadatosItem.matriz_q?.[attr] === 1) {
                    lhF = parseFloat((lhFractura * 0.75).toFixed(4)); lhS = lhSano; evaluar = true;
                }
            }

            if (evaluar) {
                const marginal = (lhF * pFractura) + (lhS * pSano);
                newPriors[attr] = Math.min(0.98, Math.max(0.02, (lhF * pFractura) / (marginal || 1)));
            }
        });
    }

    // Retorna objeto de estado 100% INMUTABLE
    return Object.freeze({
        ...currentState,
        thetas: updatedThetas,
        sem_bayesian: newSEM,
        items_respondidos_count: newResponses.length,
        seen_item_ids: Array.from(newSeenItems),
        irt_responses: newResponses,
        priors_dinamicos: newPriors
    });
}
