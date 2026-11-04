// ScoringService.js - Servicio de Dominio para Estimaciones IRT, MIRT, Escalonamiento y Metacognición (Dante OS v23.0.0-SCALE)
// Bogotá, Colombia
import { Worker } from 'worker_threads';
import os from 'os';
import { estimarHabilidadEAP, calcularInformacionFisher, calcularProbabilidad3PL, calcularICI, calcularCRI } from '../engine3PL.js';
import { actualizarVectorThetaMIRT, calcularSiguienteEstadoInmutable, mapearPuntajeEstandarizado } from './CatDomainService.js';
import { calcularIndiceIRI, calcularIndiceICC, obtenerExplicabilidadMetacognitiva, METACONTROL_THRESHOLDS } from './MetacognitionEngine.js';

let workersPool = [];
let nextWorkerIndex = 0;
let taskIdCounter = 0;
const pendingTasks = new Map();
const WORKER_TIMEOUT_MS = 200;
let isWorkerPoolInitialized = false;
let workerPoolFailed = false;

/**
 * ⚡ Inicializador perezoso del Pool de Worker Threads para cálculo paralelo EAP.
 */
function initWorkerPool() {
    if (isWorkerPoolInitialized || workerPoolFailed) return;
    try {
        const poolSize = Math.max(2, Math.min(8, os.cpus()?.length || 4));
        const workerUrl = new URL('../../workers/scoringWorker.js', import.meta.url);

        for (let i = 0; i < poolSize; i++) {
            const worker = new Worker(workerUrl);

            worker.on('message', (msg) => {
                const { id, success, result } = msg || {};
                if (pendingTasks.has(id)) {
                    const task = pendingTasks.get(id);
                    clearTimeout(task.timeoutId);
                    pendingTasks.delete(id);
                    if (success && result) {
                        task.resolve(result);
                    } else {
                        // Degradación elegante (Fallback síncrono)
                        task.resolve(estimarHabilidadEAP(task.historialItems));
                    }
                }
            });

            worker.on('error', (err) => {
                console.warn('⚠️ [WORKER THREAD WARN]: Excepción en worker hilo:', err.message);
            });

            workersPool.push(worker);
        }
        isWorkerPoolInitialized = true;
    } catch (err) {
        console.warn('⚠️ [WORKER POOL INIT WARN]: Fallo al inicializar Worker Threads. Activando fallback síncrono.', err.message);
        workerPoolFailed = true;
    }
}

/**
 * 🧵 Estimación paralela de habilidad Bayesiana EAP mediante Worker Threads.
 */
export async function estimarHabilidadParalela(historialItems) {
    if (!historialItems || historialItems.length === 0) {
        return estimarHabilidadEAP(historialItems);
    }

    initWorkerPool();

    if (workerPoolFailed || workersPool.length === 0) {
        return estimarHabilidadEAP(historialItems);
    }

    return new Promise((resolve) => {
        const taskId = ++taskIdCounter;
        const worker = workersPool[nextWorkerIndex];
        nextWorkerIndex = (nextWorkerIndex + 1) % workersPool.length;

        const timeoutId = setTimeout(() => {
            if (pendingTasks.has(taskId)) {
                pendingTasks.delete(taskId);
                // Fallback por tiempo excedido (>50ms)
                resolve(estimarHabilidadEAP(historialItems));
            }
        }, WORKER_TIMEOUT_MS);

        pendingTasks.set(taskId, {
            resolve,
            historialItems,
            timeoutId
        });

        worker.postMessage({
            id: taskId,
            historialItems
        });
    });
}

/**
 * 🧹 Limpieza y cierre del pool de trabajadores para pruebas o apagado del servidor.
 */
export function cerrarWorkerPool() {
    for (const worker of workersPool) {
        worker.terminate().catch(() => {});
    }
    workersPool = [];
    isWorkerPoolInitialized = false;
    workerPoolFailed = false;
    pendingTasks.clear();
}

export {
    estimarHabilidadEAP,
    calcularInformacionFisher,
    calcularProbabilidad3PL,
    actualizarVectorThetaMIRT,
    mapearPuntajeEstandarizado,
    calcularIndiceIRI,
    calcularIndiceICC,
    calcularICI,
    calcularCRI,
    METACONTROL_THRESHOLDS
};

/**
 * 🧮 Estimación de habilidad EAP Bayesiana sobre historial de ítems.
 */
export async function estimarHabilidad(historialItems) {
    return await estimarHabilidadParalela(historialItems);
}

/**
 * 📊 Cálculo unificado de índices metacognitivos (ICI, CRI, IRI, ICC).
 */
export function calcularIndicesMetacognitivos({
    certeza,
    interaccionCorrecta,
    responseTime,
    difficulty,
    arrayHistoricoRespuestas = [],
    mapaParametros = new Map()
}) {
    const ici = calcularICI(certeza, interaccionCorrecta, responseTime, difficulty);
    const cri = calcularCRI(arrayHistoricoRespuestas);
    const iri = calcularIndiceIRI(arrayHistoricoRespuestas, mapaParametros);
    const icc = calcularIndiceICC(arrayHistoricoRespuestas, mapaParametros);

    return { ici, cri, iri, icc };
}

/**
 * 🛡️ Evaluación de intervenciones metacognitivas ante impulsividad o fatiga.
 */
export function evaluarIntervencionMetacognitiva({
    responseTime,
    interaccionCorrecta,
    metadatosItem,
    opcionMarcadaOriginal,
    mapaTrampasGlobal = new Map()
}) {
    const cronometriaSegundos = parseFloat(responseTime || 15.0);
    const esDisparoAlAzar = (cronometriaSegundos < METACONTROL_THRESHOLDS.UMBRAL_IMPULSIVIDAD_CRITICA_SEGUNDOS);
    const esBloqueoCognitivo = (cronometriaSegundos > METACONTROL_THRESHOLDS.UMBRAL_BLOQUEO_FATIGA_SEGUNDOS);

    let flagIntervencionActiva = "NONE";
    let errorDetonadoMsg = "Ninguno";
    let remediacionSugeridaMsg = "Se prescribe continuar el flujo adaptativo estándar.";

    if (metadatosItem && opcionMarcadaOriginal && !interaccionCorrecta) {
        const llaveBusqueda = `${metadatosItem.id}_${opcionMarcadaOriginal}`;
        const tieneTrampaMapeada = mapaTrampasGlobal.has(llaveBusqueda);

        if (tieneTrampaMapeada) {
            const datosTrampa = mapaTrampasGlobal.get(llaveBusqueda);
            const sesgoActivo = Object.keys(datosTrampa).find(attr => datosTrampa[attr] === 1);
            errorDetonadoMsg = sesgoActivo ? sesgoActivo.replace('attr_', '').replace(/_/g, ' ').toUpperCase() : "Desviación de Enfoque Procedimental";
            remediacionSugeridaMsg = "Has caído en un distractor diseñado para evaluar desajustes procedimentales.";
        } else {
            errorDetonadoMsg = "Desviación de Enfoque Procedimental";
            remediacionSugeridaMsg = "Lee con calma el enunciado del problema e identifica la pregunta central.";
        }
    }

    if (esDisparoAlAzar) {
        flagIntervencionActiva = "IMPULSIVITY_BLOCK";
        errorDetonadoMsg = "RUIDO POR IMPULSIVIDAD CRÍTICA";
        remediacionSugeridaMsg = "Has respondido en menos de 4 segundos. Se prescribe frenar el impulso y releer el estímulo.";
    } else if (esBloqueoCognitivo) {
        flagIntervencionActiva = "FATIGUED_LOCK";
        errorDetonadoMsg = "SATURACIÓN COGNITIVA / BLOQUEO";
        remediacionSugeridaMsg = "Has excedido los 3 minutos en este reactivo sin consolidar una resolución.";
    }

    return {
        flagIntervencionActiva,
        errorDetonadoMsg,
        remediacionSugeridaMsg,
        esDisparoAlAzar,
        esBloqueoCognitivo
    };
}

/**
 * 🔄 Procesar transición de estado inmutable de la sesión.
 */
export function procesarTransicionEstado(sessionState, estadoEntranteData) {
    return calcularSiguienteEstadoInmutable(sessionState, estadoEntranteData);
}

/**
 * 📈 Consolidado ejecutivo de métricas finales y reporte.
 */
export async function generarConsolidadoRendimiento({
    localRuntimeState,
    targetExamSaneado,
    carreraObjetivoSaneada,
    arrayHistoricoRespuestas,
    currentThetaMateriaTarget,
    semActual,
    currentICI,
    currentCRI,
    iriActual,
    iccActual,
    studentIdSaneado,
    areaSaneada,
    hashAuditSignature
}) {
    const algebraTheta = localRuntimeState.thetas?.algebra || 0.0;
    const geometryTheta = localRuntimeState.thetas?.geometria || 0.0;
    const estadisticaTheta = localRuntimeState.thetas?.estadistica || 0.0;

    const thetaPromedioGlobal = (algebraTheta + geometryTheta + estadisticaTheta) / 3.0;
    const puntajeGlobalEstandarizado = mapearPuntajeEstandarizado(thetaPromedioGlobal, targetExamSaneado, true);
    const puntajeAreaEstandarizado = mapearPuntajeEstandarizado(currentThetaMateriaTarget, targetExamSaneado, false);

    const totalDisparos = arrayHistoricoRespuestas.length || 1;
    const distractoresAzar = arrayHistoricoRespuestas.filter(r => r.responseTime < 12.0).length;
    const disparosBloqueo = arrayHistoricoRespuestas.filter(r => r.responseTime > METACONTROL_THRESHOLDS.UMBRAL_BLOQUEO_FATIGA_SEGUNDOS).length;

    const adnImpulsividad = Math.round((distractoresAzar / totalDisparos) * 100);
    const adnFatiga = Math.round((disparosBloqueo / totalDisparos) * 100);
    const adnRecuperacion = Math.round(currentCRI * 100);
    const adnEstabilidad = Math.round(iccActual * 100);

    let sesgoMaximoId = "procedimental_generico";
    let porcentajeMaximo = -1;

    for (const [key, val] of Object.entries(localRuntimeState.priors_dinamicos || {})) {
        if (val > porcentajeMaximo) {
            porcentajeMaximo = val;
            sesgoMaximoId = key;
        }
    }

    const datosResumen = {
        thetaGlobal: thetaPromedioGlobal.toFixed(4),
        sem_global: semActual.toFixed(4),
        impulsividad: adnImpulsividad,
        recuperacion: adnRecuperacion,
        estabilidad: adnEstabilidad,
        sesgoDominante: sesgoMaximoId
    };

    const interpretacionIA = await obtenerExplicabilidadMetacognitiva(studentIdSaneado, areaSaneada, datosResumen, localRuntimeState.priors_dinamicos);

    const executivePayload = {
        thetaEstimado: thetaPromedioGlobal,
        target_exam: targetExamSaneado,
        carrera_objetivo: carreraObjetivoSaneada,
        impulsividad: adnImpulsividad,
        fatiga: adnFatiga,
        recuperacion: adnRecuperacion,
        estabilidad: adnEstabilidad,
        cronica_narrativa: interpretacionIA.cronica_narrativa || "Análisis completado.",
        vulnerabilidad_dominante: interpretacionIA.desviacion_enfoque || "Enfoque estándar.",
        prescripcion_clinica: interpretacionIA.estrategia_autorregulacion || "Continuar plan.",
        plan_entrenamiento: Array.isArray(interpretacionIA?.plan_entrenamiento) ? interpretacionIA.plan_entrenamiento : [
            "Días 1-3: Repaso conceptual.",
            "Días 4-5: Práctica guiada."
        ],
        mapa_calor_sesgos: localRuntimeState.priors_dinamicos,
        ledger_hash: hashAuditSignature
    };

    return {
        thetaPromedioGlobal,
        puntajeGlobalEstandarizado,
        puntajeAreaEstandarizado,
        executivePayload,
        interpretacionIA,
        currentICI,
        currentCRI,
        iriActual,
        iccActual
    };
}
