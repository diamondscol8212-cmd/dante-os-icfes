// CatDomainService.js - Motor Psicométrico Inmutable, MIRT, Calibración Empírica y Selección por Clúster (Dante OS v21.2.4)
// Bogotá, Colombia
import { estimarHabilidadEAP, calcularInformacionFisher } from '../engine3PL.js';

/**
 * @theory Sweller (1988) Cognitive Load Theory - Anclaje de estímulos en clústeres.
 * Regla 70/30: Alternancia estocástica entre reactivos adaptativos individuales (70%) 
 * y clústeres de reactivos anclados a fuentes complejas HD (prensa, infografía, gráficos, mapas) (30%).
 */
export const CLUSTER_SELECTION_CONFIG = {
    PROBABILIDAD_SELECCION_CLUSTER: 0.30, // 30% de las selecciones eligen un clúster si está disponible
    MIN_ITEMS_PER_CLUSTER: 2,
    MAX_ITEMS_PER_CLUSTER: 4
};

/**
 * 🧮 MATRIZ DE COVARIANZA INTER-DOMINIO (Multivariate IRT - MIRT)
 * Las habilidades matemáticas y competencias analíticas en el ICFES están fuertemente correlacionadas.
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
 * 🔬 CALIBRACIÓN ON-THE-FLY DE DIFICULTAD (a, b, c) CON MÁXIMA VEROSIMILITUD (MLE / Newton-Raphson)
 * Re-calibra los parámetros del ítem en tiempo de ejecución basándose en las respuestas observadas de la cohorte.
 * 
 * @param {Object} item - Objeto del ítem con {a, b, c}.
 * @param {Array} respuestasObs - Respuestas históricas del ítem [{thetaStudent, correcto}].
 * @returns {Object} { aCalibrado, bCalibrado, cCalibrado, deltaB }
 */
export function calibrarParametrosItemEmpirico(item, respuestasObs = []) {
    const a = parseFloat(item?.a || 1.0);
    const b = parseFloat(item?.b || 0.0);
    const c = parseFloat(item?.c || 0.25);

    if (!Array.isArray(respuestasObs) || respuestasObs.length < 3) {
        return { aCalibrado: a, bCalibrado: b, cCalibrado: c, deltaB: 0.0 };
    }

    let gradienteNumerator = 0.0;
    let hessianDenominator = 0.0;

    for (let i = 0; i < respuestasObs.length; i++) {
        const resp = respuestasObs[i];
        const thetaStudent = parseFloat(resp.thetaStudent ?? resp.thetaSnapshot ?? 0.0);
        const y = resp.correcto || resp.isCorrect ? 1.0 : 0.0;

        const L = a * (thetaStudent - b);
        const expNegL = Math.exp(-Math.max(-20, Math.min(20, L)));
        const Pstar = 1.0 / (1.0 + expNegL);
        const P = c + (1.0 - c) * Pstar;

        // Derivada con respecto a b
        const dP_db = -a * (1.0 - c) * Pstar * (1.0 - Pstar);
        const W = Math.max(0.001, P * (1.0 - P));

        gradienteNumerator += (y - P) * (dP_db / W);
        hessianDenominator += Math.pow(dP_db, 2) / W;
    }

    let deltaB = 0.0;
    if (hessianDenominator > 0.0001) {
        deltaB = gradienteNumerator / hessianDenominator;
        // Acotar el paso Newton-Raphson para estabilidad numérica
        deltaB = Math.max(-0.35, Math.min(0.35, deltaB));
    }

    const bNuevo = Math.max(-3.5, Math.min(3.5, parseFloat((b + deltaB).toFixed(4))));
    return {
        aCalibrado: a,
        bCalibrado: bNuevo,
        cCalibrado: c,
        deltaB: parseFloat(deltaB.toFixed(4))
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
export function aplicarControlExposicionSympsonHetter(candidatos, exposureCounts = new Map(), _targetMaxExposure = 0.25) {
    if (!Array.isArray(candidatos) || candidatos.length === 0) return candidatos;

    return candidatos.filter(item => {
        const count = exposureCounts.get(item.id) || 0;
        if (item.a > 1.8) {
            const probAceptacion = Math.max(0.20, 1.0 - (count * 0.15));
            return Math.random() <= probAceptacion;
        }
        return true;
    });
}

/**
 * 📰 @theory Sweller (1988) Cognitive Load Theory - SELECCIÓN ADAPTATIVA POR CLÚSTER (REGLA 70/30)
 * Alterna dinámicamente la entrega de reactivos individuales adaptativos (70%) con
 * la inyección de conjuntos de preguntas (2 a 4) ancladas a un mismo estímulo complejo HD (30%).
 * 
 * @param {Array} poolCandidatos - Lista de reactivos disponibles.
 * @param {Object} sessionState - Estado actual de la sesión del estudiante.
 * @returns {Object} { itemSeleccionado, esCluster: boolean, clusterInfo: Object|null }
 */
export function seleccionarItemConReglaCluster(poolCandidatos, sessionState) {
    if (!Array.isArray(poolCandidatos) || poolCandidatos.length === 0) {
        return { itemSeleccionado: null, esCluster: false, clusterInfo: null };
    }

    const seenSet = new Set(sessionState?.seen_item_ids || []);
    const noVistos = poolCandidatos.filter(item => !seenSet.has(item.id));
    
    if (noVistos.length === 0) {
        return { itemSeleccionado: null, esCluster: false, clusterInfo: null };
    }

    // Si la sesión ya se encuentra dentro de un clúster activo, continuar con el siguiente ítem del clúster
    if (sessionState?.active_cluster_id && sessionState?.active_cluster_remaining_items?.length > 0) {
        const nextClusterItemId = sessionState.active_cluster_remaining_items[0];
        const itemEncontrado = noVistos.find(it => it.id === nextClusterItemId);
        if (itemEncontrado) {
            return {
                itemSeleccionado: itemEncontrado,
                esCluster: true,
                clusterInfo: {
                    stimulus_id: sessionState.active_cluster_id,
                    remaining_count: sessionState.active_cluster_remaining_items.length - 1
                }
            };
        }
    }

    // Decisión estocástica: 30% cuota para seleccionar un nuevo clúster de estímulo complejo HD
    const solicitarCluster = Math.random() <= CLUSTER_SELECTION_CONFIG.PROBABILIDAD_SELECCION_CLUSTER;

    if (solicitarCluster) {
        // Agrupar ítems no vistos por stimulus_id
        const gruposCluster = new Map();
        noVistos.forEach(item => {
            if (item.stimulus_id) {
                if (!gruposCluster.has(item.stimulus_id)) {
                    gruposCluster.set(item.stimulus_id, []);
                }
                gruposCluster.get(item.stimulus_id).push(item);
            }
        });

        // Filtrar clústeres válidos con 2 a 4 reactivos
        const clustersValidos = Array.from(gruposCluster.entries()).filter(([_stId, items]) => {
            return items.length >= CLUSTER_SELECTION_CONFIG.MIN_ITEMS_PER_CLUSTER;
        });

        if (clustersValidos.length > 0) {
            // Seleccionar un clúster al azar de los disponibles
            const [selectedStimulusId, clusterItems] = clustersValidos[Math.floor(Math.random() * clustersValidos.length)];
            const primerItem = clusterItems[0];
            
            return {
                itemSeleccionado: primerItem,
                esCluster: true,
                clusterInfo: {
                    stimulus_id: selectedStimulusId,
                    total_items_in_cluster: clusterItems.length,
                    remaining_item_ids: clusterItems.slice(1).map(it => it.id)
                }
            };
        }
    }

    // Selección por defecto (70% o fallback): Ítem adaptativo individual con mayor Información de Fisher
    const thetaActual = sessionState?.theta || 0.0;
    let mejorItem = noVistos[0];
    let maxInfo = -1;

    noVistos.forEach(item => {
        const a = item.a || 1.0;
        const b = item.b || 0.0;
        const c = item.c || 0.25;
        const info = calcularInformacionFisher(thetaActual, a, b, c);
        if (info > maxInfo) {
            maxInfo = info;
            mejorItem = item;
        }
    });

    return {
        itemSeleccionado: mejorItem,
        esCluster: Boolean(mejorItem?.stimulus_id),
        clusterInfo: mejorItem?.stimulus_id ? { stimulus_id: mejorItem.stimulus_id } : null
    };
}

/**
 * ⚡ FUNCIÓN PURA INMUTABLE: TRANSICIÓN DE ESTADO PSICOMÉTRICO
 * Toma el estado actual de sesión y una interacción entrante, retornando un NUEVO estado inmutable.
 */
export function calcularSiguienteEstadoInmutable(currentState, interactionData) {
    const { itemId, isCorrect, responseTime, metadatosItem, vectorVulnerabilidad, llavesAtributos } = interactionData;

    const newSeenItems = new Set(currentState.seen_item_ids || []);
    if (itemId) newSeenItems.add(itemId);

    const newResponses = [...(currentState.irt_responses || [])];
    
    if (itemId && metadatosItem) {
        let cEfectivo = parseFloat(metadatosItem.c || 0.25);
        const listadoDescartadas = Array.isArray(interactionData.opcionesDescartadas) ? interactionData.opcionesDescartadas : [];
        if (listadoDescartadas.length > 0 && listadoDescartadas.length < 4) {
            const opcionesRestantes = Math.max(1, 4 - listadoDescartadas.length);
            cEfectivo = parseFloat((1.0 / opcionesRestantes).toFixed(4));
        }

        newResponses.push({
            itemId: metadatosItem.id,
            correcto: Boolean(isCorrect),
            isCorrect: Boolean(isCorrect),
            selectedOption: interactionData.opcionMarcada,
            opcionesDescartadas: listadoDescartadas,
            timestampEpoch: Date.now(),
            thetaSnapshot: parseFloat(currentState.thetas?.[metadatosItem.sub_competencia] || currentState.thetas?.algebra || 0.0),
            responseTime: parseFloat(responseTime || 15.0),
            irt: { a: metadatosItem.a, b: metadatosItem.b, c: cEfectivo }
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
    
    if (itemId && metadatosItem) {
        if (responseTime < 4.0) {
            const currentImp = parseFloat(newPriors['attr_sesgo_impulsividad'] ?? newPriors['impulsividad'] ?? 0.30);
            newPriors['attr_sesgo_impulsividad'] = Math.min(0.98, parseFloat((currentImp + 0.15).toFixed(4)));
        } else if (responseTime > 180.0) {
            const currentFat = parseFloat(newPriors['attr_bloqueo_fatiga'] ?? newPriors['fatiga'] ?? 0.30);
            newPriors['attr_bloqueo_fatiga'] = Math.min(0.98, parseFloat((currentFat + 0.10).toFixed(4)));
        }

        if (responseTime >= 4.0) {
            const { lhFractura, lhSano } = calcularPesosEmpiricosQ(metadatosItem, interactionData.opcionMarcadaOriginal);
            
            (llavesAtributos || []).forEach(attr => {
                const pFractura = parseFloat(newPriors[attr] !== undefined ? newPriors[attr] : 0.5);
                const pSano = 1.0 - pFractura;
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
    }

    // Manejo inmutable de avance de clústeres
    let remainingClusterItems = currentState.active_cluster_remaining_items || [];
    let activeClusterId = currentState.active_cluster_id || null;

    if (activeClusterId && itemId) {
        remainingClusterItems = remainingClusterItems.filter(id => id !== itemId);
        if (remainingClusterItems.length === 0) {
            activeClusterId = null;
        }
    }

    // Retorna objeto de estado 100% INMUTABLE
    return Object.freeze({
        ...currentState,
        thetas: updatedThetas,
        sem_bayesian: newSEM,
        items_respondidos_count: newResponses.length,
        seen_item_ids: Array.from(newSeenItems),
        irt_responses: newResponses,
        priors_dinamicos: newPriors,
        active_cluster_id: activeClusterId,
        active_cluster_remaining_items: remainingClusterItems
    });
}

/**
 * 🎯 MAPEO Y ESCALONAMIENTO ESTANDARIZADO DE PUNTAJES (IRT 3PL Theta -> Escalas Oficiales)
 * 
 * @param {number} theta - Habilidad estimada Theta (θ ∈ [-3.0, +3.0])
 * @param {string} targetExam - Examen Objetivo ('SABER_11', 'UNAL_GENERAL', 'UNAL_CARRERAS', 'CONCURSO_DOCENTE', 'SABER_PRO')
 * @param {boolean} esPuntajeGlobal - Indica si se calcula el puntaje global o por área
 * @returns {number} Puntaje estandarizado oficial del examen
 */
export function mapearPuntajeEstandarizado(theta, targetExam = 'SABER_11', esPuntajeGlobal = false) {
    const exam = String(targetExam || 'SABER_11').toUpperCase().trim();
    const tVal = Number.isFinite(parseFloat(theta)) ? parseFloat(theta) : 0.0;

    if (exam === 'SABER_11') {
        if (esPuntajeGlobal) {
            // Puntaje Global Saber 11: 0 a 500
            return Math.max(0, Math.min(500, Math.round(250 + (tVal * 83.33))));
        } else {
            // Puntaje por Área Saber 11: 0 a 100
            return Math.max(0, Math.min(100, Math.round(50 + (tVal * 16.66))));
        }
    } else if (exam === 'UNAL_GENERAL' || exam === 'UNAL_CARRERAS') {
        // Puntaje Estandarizado UNAL: 0 a 1000
        return Math.max(0, Math.min(1000, Math.round(500 + (tVal * 100))));
    } else if (exam === 'CONCURSO_DOCENTE' || exam === 'SABER_PRO') {
        // Puntaje Escala 0-100
        return Math.max(0, Math.min(100, Math.round(50 + (tVal * 16.66))));
    }

    return Math.max(0, Math.min(100, Math.round(50 + (tVal * 16.66))));
}

