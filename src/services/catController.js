import crypto from 'crypto'; 
import { supabase } from '../../supabaseClient.js'; 
import { redis } from '../../redisClient.js';       
import { estimarHabilidadEAP, calcularInformacionFisher, calcularICI, calcularCRI } from './engine3PL.js'; 
import { actualizarGemeloDigital } from '../../twinService.js'; 
import { obtenerSiguienteItem } from './catSelectorEngine.js'; 

const CALIBRATION_VERSION = process.env.IRT_CALIBRATION_VERSION || 'v20.6_master';
const REDIS_TTL_SECONDS = 86400; 

const OPERATIONAL_CONTROLS = {
    MAX_ITEMS_EXAMEN: 25,      
    MIN_ITEMS_EXAMEN: 12,      
    UMBRAL_SEM_OBJETIVO: 0.22,  
    EPS_CDM: 0.02               
};

const METACONTROL_THRESHOLDS = {
    UMBRAL_RUIDO_AZAR_SEGUNDOS: 10.0,
    UMBRAL_ANALISIS_PROFUNDO_SEGUNDOS: 60.0,
    UMBRAL_BLOQUEO_FATIGA_SEGUNDOS: 180.0
};

const CACHE_BANCO_ITEMS = new Map(); 
const CACHE_BUCKETS_DIFICULTAD = new Map(); 
const CACHE_MAPA_TRAMPAS = new Map(); 
const CACHE_TIMESTAMPS = new Map();
const ESTADO_CARGA_AREAS = new Map(); 
const CACHE_ESQUEMA_ATRIBUTOS = new Map();

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; 

function obtenerIndexBucket(dificultad) {
    const bFloat = parseFloat(dificultad || 0);
    const bAcotado = Math.max(-4.0, Math.min(4.0, bFloat));
    return Math.round((bAcotado + 4.0) / 0.5);
}

async function ejecutarCompilacionFriaDB(area) {
    if (ESTADO_CARGA_AREAS.get(area) === 'PENDING') return;
    ESTADO_CARGA_AREAS.set(area, 'PENDING');

    try {
        console.log(`📡 [B2B COGNITIVE COMPILE v20.6.0]: Descargando e indexando el códice para: [${area}]...`);
        
        let resItems;
        const esMateriaEstructuraTexto = (area === 'lectura_critica' || area === 'ingles' || area === 'ciencias_naturales');

        if (esMateriaEstructuraTexto) {
            resItems = await supabase.from('banco_reactivos').select('*').eq('materia', area);
        } else {
            resItems = await supabase.from('banco_items_irt').select(`
                id, pregunta_texto, opciones_respuesta, parametro_a_discriminacion, parametro_b_dificultad, parametro_c_adivinacion, sub_competencia, correcta,
                matriz_q_items!inner (*)
            `).eq('area_general', area);
        }

        if (resItems.error) throw resItems.error;
        if (!resItems.data || resItems.data.length === 0) {
            throw new Error(`El repositorio para '${area}' no contiene registros válidos en Supabase.`);
        }

        let llavesAtributosDinamicos = [];
        if (area === 'lectura_critica') {
            llavesAtributosDinamicos = ['attr_fuga_distractor_literal', 'attr_sesgo_confirmacion', 'attr_fallo_integracion_intertextual'];
        } else if (area === 'ciencias_naturales') {
            llavesAtributosDinamicos = ['attr_fuga_grafica_compleja', 'attr_sesgo_causal_lineal', 'attr_omision_conversion'];
        } else if (area === 'ingles') {
            llavesAtributosDinamicos = ['attr_traduccion_literal_fuga', 'attr_sobregeneralizacion_regla', 'attr_fallo_contextual'];
        } else {
            const primerRegistroQ = resItems.data[0].matriz_q_items || {};
            llavesAtributosDinamicos = Object.keys(primerRegistroQ).filter(key => 
                key !== 'item_id' && key !== 'id' && key !== 'created_at' && key !== 'updated_at'
            );
        }

        CACHE_ESQUEMA_ATRIBUTOS.set(area, llavesAtributosDinamicos);

        const mapaItems = new Map();
        const matrizBuckets = Array.from({ length: 17 }, () => []);
        const mapaTrampas = new Map();

        resItems.data.forEach(item => {
            let estructuraQ = {};
            let metadatosEstructurados = {};

            if (esMateriaEstructuraTexto) {
                const opciones = item.opciones_reactivo || {};
                const correctaObj = opciones.opcion_correcta || {};
                const distractores = opciones.distractores_sesgos || [];

                llavesAtributosDinamicos.forEach(attr => { estructuraQ[attr] = 0; });

                distractores.forEach(dist => {
                    const letraMarcada = String(dist.letra || "").toUpperCase().trim();
                    const llaveCompuesta = `${item.id}_${letraMarcada}`;
                    const estructuraTrampaQ = {};
                    
                    llavesAtributosDinamicos.forEach(attr => {
                        estructuraTrampaQ[attr] = (dist.sesgo_asociado === attr) ? 1 : 0;
                    });
                    mapaTrampas.set(llaveCompuesta, estructuraTrampaQ);
                });

                metadatosEstructurados = {
                    id: item.id,
                    pregunta_texto: item.texto_estimulo ? `${item.texto_estimulo}\n\n${item.enunciado}` : item.pregunta_texto || item.enunciado,
                    opciones_respuesta: ["A", "B", "C", "D"],
                    a: parseFloat(item.parametro_a_discriminacion || 1.25), 
                    b: parseFloat(item.dificultad_teorica_b_bayes || item.parametro_b_dificultad || 0.0),
                    c: parseFloat(item.parametro_c_adivinacion || 0.20), 
                    sub_competencia: String(item.area_general || item.sub_competencia || 'indeterminado').toLowerCase().trim(),
                    correcta_db: String(correctaObj.letra || item.correcta || 'A').toUpperCase().trim(),
                    matriz_q: estructuraQ
                };

            } else {
                llavesAtributosDinamicos.forEach(attr => {
                    estructuraQ[attr] = item.matriz_q_items?.[attr] || 0;
                });

                metadatosEstructurados = {
                    id: item.id,
                    pregunta_texto: item.pregunta_texto,
                    opciones_respuesta: item.opciones_respuesta || ["A", "B", "C", "D"],
                    a: parseFloat(item.parametro_a_discriminacion || 1.0),
                    b: parseFloat(item.parametro_b_dificultad || 0.0),
                    c: parseFloat(item.parametro_c_adivinacion || 0.2),
                    sub_competencia: String(item.sub_competencia || 'general').toLowerCase().trim(),
                    correcta_db: String(item.correcta || 'B').toUpperCase().trim(),
                    matriz_q: estructuraQ
                };
            }

            mapaItems.set(item.id, metadatosEstructurados);
            const indexBucket = obtenerIndexBucket(metadatosEstructurados.b);
            matrizBuckets[indexBucket].push(metadatosEstructurados);
        });

        if (!esMateriaEstructuraTexto) {
            const resTrampas = await supabase.from('mapa_trampas_distractores').select('*');
            if (!resTrampas.error && resTrampas.data) {
                resTrampas.data.forEach(t => {
                    const yMarcada = String(t.opcion_marcada || "").toUpperCase().trim();
                    const llaveCompuesta = `${t.item_id}_${yMarcada}`;
                    const estructuraTrampaQ = {};
                    llavesAtributosDinamicos.forEach(attr => {
                        if (t[attr] !== undefined) {
                            estructuraTrampaQ[attr] = t[attr];
                        } else {
                            const fallbackKey = attr.replace('attr_', 'vulnera_');
                            estructuraTrampaQ[attr] = t[fallbackKey] || 0;
                        }
                    });
                    mapaTrampas.set(llaveCompuesta, estructuraTrampaQ);
                });
            }
        }

        CACHE_BANCO_ITEMS.set(area, mapaItems);
        CACHE_BUCKETS_DIFICULTAD.set(area, matrizBuckets);
        CACHE_MAPA_TRAMPAS.set(area, mapaTrampas);
        CACHE_TIMESTAMPS.set(area, Date.now());
        ESTADO_CARGA_AREAS.set(area, 'READY');

    } catch (err) {
        ESTADO_CARGA_AREAS.set(area, 'ERROR');
        console.error(`🚨 [MULTI-MATERIA COMPILATION CRITICAL FAILED]:`, err.message || err);
    }
}

export function precalentarInstOriginal(area) {
    const ahora = Date.now();
    const cacheExpirada = !CACHE_TIMESTAMPS.has(area) || (ahora - CACHE_TIMESTAMPS.get(area)) > CACHE_TTL_MS;

    if (cacheExpirada || ESTADO_CARGA_AREAS.get(area) === 'ERROR') {
        ejecutarCompilacionFriaDB(area);
    }

    if (CACHE_BANCO_ITEMS.has(area) && CACHE_MAPA_TRAMPAS.has(area)) {
        return {
            mapaParametros: CACHE_BANCO_ITEMS.get(area),
            matrizBucketsDificultad: CACHE_BUCKETS_DIFICULTAD.get(area),
            mapaTrampasGlobal: CACHE_MAPA_TRAMPAS.get(area)
        };
    }
    return { mapaParametros: new Map(), matrizBucketsDificultad: Array.from({ length: 17 }, () => []), mapaTrampasGlobal: new Map() };
}

export async function procesarInteraccionEstudiante(req, res) {
    const timestampInicio = Date.now();
    try {
        const { studentId, sessionId, itemId, areaGeneral, responseTime, tiempo, declaredConfidence, certeza, selectionVector } = req.body;

        if (!studentId || !sessionId || !areaGeneral) {
            return res.status(400).json({ success: false, error: "Contrato de mensajería perimetral vulnerado." });
        }

        const areaSaneada = areaGeneral.toLowerCase().trim();
        if (studentId === "warmup_trigger") {
            precalentarInstOriginal(areaSaneada);
            return res.status(200).json({ success: true, message: "Warm-up asimilado con éxito." });
        }

        const cacheInstancia = precalentarInstOriginal(areaSaneada);
        if (ESTADO_CARGA_AREAS.get(areaSaneada) === 'PENDING') {
            return res.status(202).json({ success: false, error: "Códice en proceso de estructuración RAM. Sockets retenidos." });
        }

        const cronometriaSegundos = parseFloat(responseTime || tiempo || 15.0);
        const certezaSaneada = String(declaredConfidence || certeza || 'alta').toLowerCase().trim(); 

        const llavesAtributos = CACHE_ESQUEMA_ATRIBUTOS.get(areaSaneada) || [];
        const cacheKey = `dante:session:${areaSaneada}:${sessionId}`; 
        let sessionState = null;

        if (!itemId) {
            let thetaInicialArranque = 0.0000;
            const profileCacheKey = `dante:profile:${areaSaneada}:${studentId}`;

            try {
                const cachedProfile = await redis.get(profileCacheKey);
                if (cachedProfile) {
                    thetaInicialArranque = parseFloat(JSON.parse(cachedProfile).ultimo_theta || 0.0000);
                } else {
                    const { data: historialProgreso, error: errProgreso } = await supabase
                        .from('progreso_estudiantes')
                        .select('theta') 
                        .eq('estudiante', studentId.toLowerCase().trim())
                        .eq('materia', areaSaneada)
                        .order('id', { ascending: false })
                        .limit(1);

                    if (!errProgreso && historialProgreso && historialProgreso.length > 0) {
                        thetaInicialArranque = parseFloat(historialProgreso[0].theta || 0.0000);
                    }
                    await redis.setex(profileCacheKey, REDIS_TTL_SECONDS, JSON.stringify({ ultimo_theta: thetaInicialArranque }));
                }
            } catch (errProfile) {
                console.error("⚠️ [PROFILE COLD START EXCEPTION]:", errProfile.message);
            }

            const basePriors = {};
            llavesAtributos.forEach(attr => { basePriors[attr] = 0.5000; });

            sessionState = {
                session_id: sessionId, student_id: studentId, area_general: areaSaneada,
                theta: thetaInicialArranque, sem_bayesian: 1.0000, items_respondidos_count: 0,
                priors_dinamicos: basePriors, estado_operacional: 'STABLE', seen_item_ids: [], irt_responses: []
            };
        } else {
            const rawCachedState = await redis.get(cacheKey);
            if (rawCachedState) {
                sessionState = JSON.parse(rawCachedState);
            } else {
                const basePriors = {}; llavesAtributos.forEach(attr => { basePriors[attr] = 0.5000; });
                sessionState = {
                    session_id: sessionId, student_id: studentId, area_general: areaSaneada,
                    theta: 0.0000, sem_bayesian: 1.0000, items_respondidos_count: 0,
                    priors_dinamicos: basePriors, estado_operacional: 'STABLE', seen_item_ids: [], irt_responses: []
                };
            }
        }

        const itemsExcluidosExamen = new Set(sessionState.seen_item_ids || []);
        let arrayHistoricoRespuestas = sessionState.irt_responses || [];

        let opcionMarcada = "";
        if (selectionVector && Array.isArray(selectionVector) && selectionVector.length > 0) {
            opcionMarcada = String(selectionVector[selectionVector.length - 1].option || "").toUpperCase().trim();
        }

        let interaccionCorrecta = false;
        let metadatosItem = null;
        
        if (itemId && !itemsExcluidosExamen.has(itemId)) {
            metadatosItem = cacheInstancia.mapaParametros.get(itemId);
            if (metadatosItem) {
                interaccionCorrecta = (opcionMarcada === metadatosItem.correcta_db);
                itemsExcluidosExamen.add(itemId);

                arrayHistoricoRespuestas.push({
                    itemId: itemId, isCorrect: interaccionCorrecta, selectedOption: opcionMarcada,
                    timestampEpoch: Date.now(), thetaSnapshot: parseFloat(sessionState.theta),
                    responseTime: cronometriaSegundos,
                    irt: { a: metadatosItem.a, b: metadatosItem.b, c: metadatosItem.c, calibrationVersion: CALIBRATION_VERSION }
                });
            }
        } else if (itemId) {
            metadatosItem = cacheInstancia.mapaParametros.get(itemId);
        }

        if (arrayHistoricoRespuestas.length > OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN) {
            arrayHistoricoRespuestas = arrayHistoricoRespuestas.slice(-OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN);
        }

        let vectorVulnerabilidadActual = {};
        llavesAtributos.forEach(attr => { vectorVulnerabilidadActual[attr] = 0; });

        if (itemId && opcionMarcada !== "" && !interaccionCorrecta) {
            const llaveBusqueda = `${itemId}_${opcionMarcada}`;
            if (cacheInstancia.mapaTrampasGlobal.has(llaveBusqueda)) {
                vectorVulnerabilidadActual = cacheInstancia.mapaTrampasGlobal.get(llaveBusqueda);
            }
        }

        const esDisparoAlAzar = (cronometriaSegundos < METACONTROL_THRESHOLDS.UMBRAL_RUIDO_AZAR_SEGUNDOS);
        const esAnalisisProfundo = (cronometriaSegundos >= METACONTROL_THRESHOLDS.UMBRAL_ANALISIS_PROFUNDO_SEGUNDOS);
        const esBloqueoCognitivo = (cronometriaSegundos > METACONTROL_THRESHOLDS.UMBRAL_BLOQUEO_FATIGA_SEGUNDOS);

        let flagIntervencionActiva = "NONE";
        let errorDetonadoMsg = "Ninguno";
        let remediacionSugeridaMsg = "Se prescribe continuar el flujo adaptativo estándar.";

        if (esDisparoAlAzar) {
            flagIntervencionActiva = "IMPULSIVITY_BLOCK";
            errorDetonadoMsg = "RUIDO POR IMPULSIVIDAD CRÍTICA (SISTEMA 1 DETECTADO)";
            remediacionSugeridaMsg = "Has respondido en menos de 10 segundos de forma reactiva. Se prescribe frenar el impulso, respirar profundo y releer el estímulo forzando el Sistema 2 analítico.";
        } else if (esBloqueoCognitivo) {
            flagIntervencionActiva = "FATIGUED_LOCK";
            errorDetonadoMsg = "SATURACIÓN COGNITIVA / BLOQUEO POR FRUSTRACIÓN";
            remediacionSugeridaMsg = "Has excedido los 3 minutos en este reactivo sin consolidar un proceso de resolución. Tu ventana de fatiga está activa. Se prescribe realizar una pausa de control de 30 segundos antes de reanudar.";
        }

        const nuevoConteoItems = arrayHistoricoRespuestas.length;
        const resultadoEAP = estimarHabilidadEAP(arrayHistoricoRespuestas.map(r => ({ a: r.irt.a, b: r.irt.b, c: r.irt.c, correcto: r.isCorrect })));
        
        let thetaActual = nuevoConteoItems === 0 ? sessionState.theta : resultadoEAP.theta;
        let semActual = nuevoConteoItems === 0 ? parseFloat(sessionState.sem_bayesian || 1.0000) : resultadoEAP.bayesianSEM;

        const itemDifficultyDinamica = metadatosItem ? parseFloat(metadatosItem.b) : 0.0;
        const currentICI = calcularICI(certezaSaneada, interaccionCorrecta, cronometriaSegundos, itemDifficultyDinamica);
        const currentCRI = calcularCRI(arrayHistoricoRespuestas);

        const nuevosPriorsAtributos = { ...(sessionState.priors_dinamicos || {}) };
        
        if (itemId && metadatosItem && !esDisparoAlAzar) {
            llavesAtributos.forEach(attr => {
                let pFractura = parseFloat(nuevosPriorsAtributos[attr] !== undefined ? nuevosPriorsAtributos[attr] : 0.5);
                let pSano = 1.0 - pFractura;
                let lhFractura = 1.0; let lhSano = 1.0; let evaluar = false;

                if (interaccionCorrecta) {
                    if (metadatosItem.matriz_q[attr] === 1) { lhFractura = 0.15; lhSano = 0.90; evaluar = true; }
                } else {
                    let factorMeta = certezaSaneada === 'alta' && esAnalisisProfundo ? 1.25 : (certezaSaneada === 'baja' || esBloqueoCognitivo ? 0.70 : 1.0);
                    let factorSano = certezaSaneada === 'alta' && esAnalisisProfundo ? 0.50 : (certezaSaneada === 'baja' || esBloqueoCognitivo ? 1.10 : 1.0);

                    if (vectorVulnerabilidadActual[attr] === 1) {
                        lhFractura = Math.min(0.99, 0.85 * factorMeta); lhSano = Math.max(0.01, 0.12 * factorSano); evaluar = true;
                    } else if (metadatosItem.matriz_q[attr] === 1) {
                        lhFractura = Math.min(0.99, 0.58 * factorMeta); lhSano = Math.max(0.01, 0.12 * factorSano); evaluar = true;
                    }
                }

                if (evaluar) {
                    const marginal = (lhFractura * pFractura) + (lhSano * pSano);
                    nuevosPriorsAtributos[attr] = Math.min(1.0 - OPERATIONAL_CONTROLS.EPS_CDM, Math.max(OPERATIONAL_CONTROLS.EPS_CDM, (lhFractura * pFractura) / (marginal || 1)));
                }
            });
        }

        const estadoOperacional = esBloqueoCognitivo ? 'FATIGUED_LOCK' : (esDisparoAlAzar ? 'IMPULSIVE_SURGE' : 'STABLE');
        
        const localRuntimeState = {
            session_id: sessionId, student_id: studentId, area_general: areaSaneada, 
            theta: thetaActual, sem_bayesian: semActual, items_respondidos_count: nuevoConteoItems,
            priors_dinamicos: nuevosPriorsAtributos, estado_operacional: estadoOperacional, 
            seen_item_ids: Array.from(itemsExcluidosExamen), irt_responses: arrayHistoricoRespuestas
        };

        setImmediate(() => {
            redis.setex(cacheKey, REDIS_TTL_SECONDS, JSON.stringify(localRuntimeState)).catch(() => {});
            
            if (itemId && metadatosItem) {
                const payloadLog = {
                    id: crypto.randomUUID(), student_id: studentId, item_id: itemId, 
                    is_correct: interaccionCorrecta, skill: metadatosItem.sub_competencia || 'general', 
                    response_time: cronometriaSegundos, session_duration: cronometriaSegundos, 
                    declared_confidence: certezaSaneada, selection_vector: selectionVector || [],
                    vector_vulnerabilidad: vectorVulnerabilidadActual, area_general: areaSaneada,
                    metrics_priors: { ici: currentICI, cri: currentCRI }
                };

                redis.rpush('dante:pipeline:events', JSON.stringify({ tipo: 'EVENTO', data: payloadLog })).catch(() => {});
                const payloadTwin = { studentId, areaGeneral: areaSaneada, respuestaCorrecta: interaccionCorrecta, responseTime: cronometriaSegundos, declaredConfidence: certezaSaneada, ici: currentICI, cri: currentCRI };
                redis.rpush('dante:pipeline:events', JSON.stringify({ tipo: 'GEMELO', data: payloadTwin })).catch(() => {});
                
                const payloadAuthoring = { itemId, isCorrect: interaccionCorrecta, thetaEstudiante: thetaActual, responseTime: cronometriaSegundos, adivinacionPosible: esDisparoAlAzar && interaccionCorrecta };
                redis.rpush('dante:pipeline:events', JSON.stringify({ tipo: 'CALIBRACION_ITEM', data: payloadAuthoring })).catch(() => {});
            }
        });

        const resultadoSelector = obtenerSiguienteItem(localRuntimeState, cacheInstancia);
        const alcanzoPrecisionClasica = (nuevoConteoItems >= OPERATIONAL_CONTROLS.MIN_ITEMS_EXAMEN && semActual <= OPERATIONAL_CONTROLS.UMBRAL_SEM_OBJETIVO);
        const forzarDetencionExamen = nuevoConteoItems > 0 && (resultadoSelector.detenerExamen || alcanzoPrecisionClasica || nuevoConteoItems >= OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN);

        if (forzarDetencionExamen) {
            const puntajeIcfesEstandar = resultadoEAP.puntajeIcfesReal || Math.max(1, Math.min(100, Math.round(50 + (thetaActual * 13.8))));
            
            const totalDisparos = arrayHistoricoRespuestas.length || 1;
            const disparosAzar = arrayHistoricoRespuestas.filter(r => r.responseTime < METACONTROL_THRESHOLDS.UMBRAL_RUIDO_AZAR_SEGUNDOS).length;
            const disparosBloqueo = arrayHistoricoRespuestas.filter(r => r.responseTime > METACONTROL_THRESHOLDS.UMBRAL_BLOQUEO_FATIGA_SEGUNDOS).length;
            
            const adnImpulsividad = Math.round((disparosAzar / totalDisparos) * 100);
            const adnFatiga = Math.round((disparosBloqueo / totalDisparos) * 100);
            const adnRecuperacion = Math.round(currentCRI * 100);

            const historialThetaArray = arrayHistoricoRespuestas.map(r => parseFloat((r.thetaSnapshot || 0).toFixed(4)));
            historialThetaArray.push(parseFloat(thetaActual.toFixed(4)));

            const nombreCapitalizado = String(studentId).charAt(0).toUpperCase() + String(studentId).slice(1);
            let cronicaCalculada = ""; let vulnerabilidadCalculada = ""; let prescripcionCalculada = "";

            if (adnImpulsividad > 40) {
                cronicaCalculada = `Durante este desafío, el motor detectó un predominio de respuestas automáticas guiadas por el Sistema 1 rápido. ${nombreCapitalizado} tiende a acelerar el paso ante enunciados hostiles, comprometiendo la precisión en distractores lógicos estructurados.`;
                vulnerabilidadCalculada = "Impulsividad reactiva descontrolada. El estudiante abandona el análisis formal bajo fricción temporal, cayendo de forma sistemática en el distractor de atracción lineal.";
                prescripcionCalculada = "Entrenamiento inhibitorio obligatorio. Se prescribe pausar de manera consciente por 8 segundos antes de efectuar cualquier clic para forzar la inyección de sangre al lóbulo frontal (Sistema 2 lento).";
            } else if (adnFatiga > 35) {
                cronicaCalculada = `La serie temporal evidencia un incremento crítico en las latencias de response a la mitad del examen. ${nombreCapitalizado} experimenta saturación en la memoria de trabajo, lo que reduce la persistencia cognitiva ante estímulos complejos abstractos.`;
                vulnerabilidadCalculada = "Colapso operacional por fatiga mental acumulada y saturación de la memoria operativa a corto plazo.";
                prescripcionCalculada = "Gestión de energía neuro-cognitiva. Se prescribe realizar micro-pausas controladas de respiración diafragmática de 30 segundos entre bloques de 10 reactivos.";
            } else {
                cronicaCalculada = `${nombreCapitalizado} ha desplegado una trayectoria de adaptación impecable. Mantiene una estabilidad de latencia plana, administrando con éxito el Sistema 2 profundo y demostrando una alta resiliencia y recuperación post-error.`;
                vulnerabilidadCalculada = "Estabilidad cognitiva general consolidada. Sin desviaciones críticas registrada en los vectores Q.";
                prescripcionCalculada = "Expansión del límite de asimilación. Continuar el flujo adaptativo incrementando las magnitudes y la complejidad de los reactivos sembrados.";
            }

            // Encapsulamiento atómico híbrido para resolver el fallo de esquema en Supabase
            const payloadPersistenciaBD = {
                estudiante: String(studentId).toLowerCase().trim(),
                materia: String(areaSaneada),
                theta: parseFloat(thetaActual.toFixed(4)), 
                historial_theta: historialThetaArray, 
                items_respondidos: arrayHistoricoRespuestas.map(r => ({
                    itemId: r.itemId,
                    isCorrect: r.isCorrect,
                    selectedOption: r.selectedOption,
                    tiempo: r.responseTime || 15
                })),
                puntaje_escalonado: puntajeIcfesEstandar,
                ultima_actualizacion: new Date().toISOString()
            };

            const redisExecutiveMetaKey = `dante:executive:report:${areaSaneada}:${studentId.toLowerCase().trim()}`;
            const executivePayload = {
                impulsividad: adnImpulsividad,
                fatiga: adnFatiga,
                recuperacion: adnRecuperacion,
                estabilidad: Math.max(0, 100 - (adnImpulsividad + adnFatiga) / 2),
                cronica_narrativa: cronicaCalculada,
                vulnerabilidad_dominante: vulnerabilidadCalculada,
                prescripcion_clinica: prescripcionCalculada,
                mapa_calor_sesgos: nuevosPriorsAtributos
            };

            console.log(`💾 [COMPATIBILITY REWRITER]: Escribiendo en Supabase + Sincronizando Metadata en Redis...`);
            try {
                await redis.setex(redisExecutiveMetaKey, REDIS_TTL_SECONDS * 7, JSON.stringify(executivePayload));
                
                const { error: errUpsert } = await supabase
                    .from('progreso_estudiantes')
                    .upsert(payloadPersistenciaBD, { onConflict: 'estudiante,materia' });

                if (errUpsert) throw errUpsert;
                console.log("✅ [DB SYNC COMPLETED]: Persistencia exitosa libre de pérdidas de esquema.");
            } catch (dbCrash) {
                console.error("🚨 [DB PERSISTENCE CRITICAL LOSS FORCED FALLBACK]:", dbCrash.message);
            }

            const payloadPerfilFinal = { 
                ultimo_theta: thetaActual,
                ultimo_sem: semActual,
                escalonamiento_icfes: { puntaje_estimated: puntajeIcfesEstandar },
                adn_cognitivo: executivePayload,
                mapa_calor_sesgos: nuevosPriorsAtributos
            };
            
            await redis.setex(`dante:profile:${areaSaneada}:${studentId}`, REDIS_TTL_SECONDS, JSON.stringify(payloadPerfilFinal)).catch(() => {});
            await redis.del(cacheKey).catch(() => {});
            
            return res.status(200).json({
                success: true, detenerExamen: true, thetaProgreso: thetaActual, bayesianSEMProgreso: semActual,
                reporteFinal: {
                    thetaEstimado: thetaActual, precisionMetrica: semActual, fisherSEM: resultadoEAP.fisherSEM, probMaestriaAvanzada: resultadoEAP.probMaestriaFormatted,
                    mapaCalorSesgos: nuevosPriorsAtributos, indices_avanzados: { ici: currentICI, cri: currentCRI },
                    adn_cognitivo: executivePayload,
                    escalonamiento_pais: { puntaje_icfes_area: puntajeIcfesEstandar, intervalo_certeza_95: [Math.max(1, puntajeIcfesEstandar - 5), Math.min(100, puntajeIcfesEstandar + 5)] }
                }
            });
        }

        if (!resultadoSelector.item || !resultadoSelector.item.opciones_respuesta) {
            throw new Error("Contrato Roto: opciones_respuesta debe ser un Array estructurado.");
        }

        return res.status(200).json({
            success: true, detenerExamen: false, thetaProgreso: thetaActual, bayesianSEMProgreso: semActual,
            interaccionCorrecta, latencia_computo_ms: Date.now() - timestampInicio,
            accs_telemetria: { 
                estado_operacional: estadoOperacional, 
                intervencion_activa: flagIntervencionActiva, 
                indices_avanzados: { ici: currentICI, cri: currentCRI },
                mapaCalorSesgos: nuevosPriorsAtributos 
            },
            andamiajeForense: { 
                errorDetonado: errorDetonadoMsg, 
                remediacionSugerida: remediacionSugeridaMsg 
            },
            item: {
                id: resultadoSelector.item.id,
                pregunta_texto: resultadoSelector.item.pregunta_texto,
                opciones_respuesta: resultadoSelector.item.opciones_respuesta || ["A", "B", "C", "D"],
                sub_competencia: resultadoSelector.item.sub_competencia
            }
        });

    } catch (error) {
        console.error("🚨 [CONTROL FORENSE EXCEPCIÓN CRÍTICA v20.5.6]:", error.message);
        return res.status(500).json({ success: false, error: "Cortocircuito interno." });
    }
}

async function procesarPipelineFondo() {
    try {
        const elementoRaw = await redis.lindex('dante:pipeline:events', 0);
        if (!elementoRaw) { return setTimeout(procesarPipelineFondo, 2000); }

        const paquete = JSON.parse(elementoRaw);
        let exito = false;

        if (paquete.tipo === 'EVENTO') {
            const { error } = await supabase.from('registro_eventos').insert([paquete.data]);
            if (!error) exito = true;
        } else if (paquete.tipo === 'GEMELO') {
            const resultado = await actualizarGemeloDigital(paquete.data);
            if (resultado !== null) exito = true;
        } else if (paquete.tipo === 'CALIBRACION_ITEM') {
            const { itemId, isCorrect, thetaEstudiante, responseTime, adivinacionPosible } = paquete.data;
            const { data: itemData } = await supabase.from('metricas_calibracion_items').select('*').eq('item_id', itemId).single();
            
            let totalMuestras = (itemData?.total_interacciones || 0) + 1;
            let aciertosAcumulados = (itemData?.total_aciertos || 0) + (isCorrect ? 1 : 0);
            let totalAdivinaciones = (itemData?.total_adivinaciones || 0) + (adivinacionPosible ? 1 : 0);
            
            let tasaAciertoEmpirico = aciertosAcumulados / totalMuestras;
            let parametroAdivinacionC = totalAdivinaciones / totalMuestras;
            
            let p_theta = parametroAdivinacionC + (1.0 - parametroAdivinacionC) / (1.0 + Math.exp(-1.2 * (thetaEstudiante)));
            let informacionFisherEmpirica = (1.44 * Math.pow(1.2, 2) * (1.0 - p_theta) * (p_theta - parametroAdivinacionC)) / (Math.pow(1.0 - parametroAdivinacionC, 2) * p_theta);

            let estadoCalibracion = "CALIBRADO";
            let alertaOptimizacion = "NINGUNA";

            if (tasaAciertoEmpirico > 0.90 && totalMuestras > 5) {
                estadoCalibracion = "DEFECTO_DIFICULTAD_BAJA";
                alertaOptimizacion = "El reactivo no aporta información discriminatoria. Incremente la abstracción o reduzca distractores literales.";
            } else if (tasaAciertoEmpirico < 0.15 && totalMuestras > 5) {
                estadoCalibracion = "DEFECTO_DIFICULTAD_ALTA";
                alertaOptimizacion = "Posible sesgo cultural o ambigüedad estructural severa. El reactivo induce a bloqueo por fatiga masivo.";
            } else if (parametroAdivinacionC > 0.45 && totalMuestras > 5) {
                estadoCalibracion = "ALTA_ADIVINACION";
                alertaOptimizacion = "Fuga masiva por adivinación. Los distractores son débiles o predecibles por Sistema 1 impulsivo. Reescriba distractores.";
            } else if (informacionFisherEmpirica < 0.10 && totalMuestras > 5) {
                estadoCalibracion = "BAJA_INFORMACION";
                alertaOptimizacion = "Ruido estadístico. La pregunta no discrimina la habilidad latente del estudiante. Modifique el enunciado.";
            }

            const payloadCalibracion = {
                item_id: itemId,
                total_interacciones: totalMuestras,
                total_aciertos: aciertosAcumulados,
                total_adivinaciones: totalAdivinaciones,
                tasa_acierto_empirico: parseFloat(tasaAciertoEmpirico.toFixed(4)),
                parametro_c_empirico: parseFloat(parametroAdivinacionC.toFixed(4)),
                informacion_fisher_media: parseFloat(informacionFisherEmpirica.toFixed(4)),
                estado_item: estadoCalibracion,
                sugerencia_optimizacion: alertaOptimizacion,
                updated_at: new Date().toISOString()
            };

            const { error: errUpsertItem } = await supabase
                .from('metricas_calibracion_items')
                .upsert(payloadCalibracion, { onConflict: 'item_id' });

            if (!errUpsertItem) exito = true;
        }

        if (exito) {
            await redis.lpop('dante:pipeline:events');
            setTimeout(procesarPipelineFondo, 50); 
        } else {
            setTimeout(procesarPipelineFondo, 5000); 
        }
    } catch (err) {
        setTimeout(procesarPipelineFondo, 5000);
    }
}
setTimeout(procesarPipelineFondo, 5000);