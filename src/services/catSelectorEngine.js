// catSelectorEngine.js - Motor de Selección Adaptativa Óptima (Dante OS v21.0.0 Enterprise)
import { calcularInformacionFisher } from './engine3PL.js';
import { sanitizarAreaMateria } from './cat/SessionService.js';

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

    const { theta, sem_bayesian, items_respondidos_count, seen_item_ids, priors_dinamicos, target_exam, carrera_objetivo } = sessionState;
    const { mapaParametros, matrizBucketsDificultad } = cacheInstancia;

    const currentThetaFloat = parseFloat(theta || 0.0);
    const currentSemFloat = parseFloat(sem_bayesian || 1.0);
    const currentCountInt = parseInt(items_respondidos_count || 0, 10);
    const targetExamSaneado = String(target_exam || 'SABER_11').toUpperCase().trim();
    const carreraSaneada = carrera_objetivo ? String(carrera_objetivo).toUpperCase().trim() : null;

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
    
    let poolCandidatosAcotado = [];

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

    // 🎯 FILTRADO DE DOMINIO MULTI-EXAMEN Y MATERIA/ÁREA
    if (poolCandidatosAcotado.length > 0) {
        const targetArea = sanitizarAreaMateria(sessionState.area_general || sessionState.area || sessionState.materia || '');
        if (targetArea) {
            const candidatosAreaTarget = poolCandidatosAcotado.filter(item => {
                const itemArea = sanitizarAreaMateria(item.area || item.area_general || item.materia || '');
                if (!itemArea) return true;
                return itemArea === targetArea;
            });
            if (candidatosAreaTarget.length > 0) {
                poolCandidatosAcotado = candidatosAreaTarget;
            }
        }

        const candidatosExamenTarget = poolCandidatosAcotado.filter(item => {
            if (!item.target_exam) return true;
            const itemTarget = String(item.target_exam).toUpperCase().trim();
            if (itemTarget === 'ALL' || itemTarget === targetExamSaneado) return true;
            if (targetExamSaneado.startsWith('UNAL') && itemTarget.startsWith('UNAL')) return true;
            return false;
        });

        if (candidatosExamenTarget.length > 0) {
            poolCandidatosAcotado = candidatosExamenTarget;
        }

        if (carreraSaneada) {
            const candidatosCarrera = poolCandidatosAcotado.filter(item =>
                item.carrera_objetivo && String(item.carrera_objetivo).toUpperCase().trim() === carreraSaneada
            );
            if (candidatosCarrera.length > 0) {
                poolCandidatosAcotado = candidatosCarrera;
            }
        }
    }

    // Si el banco se agota completamente, detiene el examen y guarda lo acumulado
    if (poolCandidatosAcotado.length === 0) {
        console.warn("⚠️ [HOMEOCONTROL AGOTAMIENTO]: No existen más ítems en RAM. Consolidando examen.");
        return { success: true, detenerExamen: true, codigo_control: 'BANCO_CONSUMIDO_TOTALMENTE' };
    }

    // ====================================================================
    // 🛡️ REGLA DE CONTROL 2: PONDERACIÓN MFI, STA SHADOW ASSEMBLY, SYMPSON-HETTER & SELECCIÓN ESTOCÁSTICA
    // ====================================================================
    const estudiantePriors = priors_dinamicos || {};

    // Mapeo de frecuencias de sub-competencias presentadas para Shadow Test Assembly (STA)
    const conteoSubCompetencias = {};
    if (Array.isArray(sessionState.irt_responses)) {
        sessionState.irt_responses.forEach(r => {
            const sub = String(r.sub_competencia || 'general').toLowerCase().trim();
            conteoSubCompetencias[sub] = (conteoSubCompetencias[sub] || 0) + 1;
        });
    }

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
        
        // Contrapeso de Cobertura Competencial (Shadow Test Assembly - STA)
        const subItem = String(item.sub_competencia || 'general').toLowerCase().trim();
        const vecesPresentadoSub = conteoSubCompetencias[subItem] || 0;
        const bonoCoberturaSTA = 0.20 / (1.0 + vecesPresentadoSub);

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

        const scoreSelector = ((fisherRaw * 0.60) + ((1 / (1 + distanciaAbsoluta)) * 0.10) + (penalizacionO_InyeccionSesgo * 0.15) + (bonoCoberturaSTA * 0.15)) * factorExposureSympsonHetter;
        
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
            sub_competencia: itemGanador.sub_competencia,
            target_exam: itemGanador.target_exam || targetExamSaneado,
            carrera_objetivo: itemGanador.carrera_objetivo || carreraSaneada,
            imagen_url: itemGanador.imagen_url || null
        },
        meta_seleccion: {
            distancia_logit: parseFloat(Math.abs(itemGanador.b - currentThetaFloat).toFixed(4)),
            pool_k_evaluado: reactivosEvaluados.length,
            bucket_origen: targetIndex
        }
    };
}


