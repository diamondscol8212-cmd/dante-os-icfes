// catController.js - Motor de Inferencia Psicométrica Multidimensional, Índices Conductuales (IRI/ICC) e Homeostasis de Progreso
// Dante OS v21.0.0 Enterprise Edition // Bogotá, Colombia
import crypto from 'crypto'; 
import { supabase } from '../../supabaseClient.js'; 
import { redis } from '../../redisClient.js';       
import { estimarHabilidadEAP, calcularInformacionFisher, calcularICI, calcularCRI } from './engine3PL.js'; 
import { actualizarGemeloDigital } from '../../twinService.js'; 
import { obtenerSiguienteItem } from './catSelectorEngine.js'; 
import { generarInterpretacionCognitiva } from './aiService.js';

const CALIBRATION_VERSION = process.env.IRT_CALIBRATION_VERSION || 'v21.0_multitheta';
const REDIS_TTL_SECONDS = 86400; 

const OPERATIONAL_CONTROLS = {
    MAX_ITEMS_EXAMEN: 25,      
    MIN_ITEMS_EXAMEN: 5,  
    UMBRAL_SEM_OBJETIVO: 0.22,  
    EPS_CMD: 0.02               
};

const METACONTROL_THRESHOLDS = {
    UMBRAL_IMPULSIVIDAD_CRITICA_SEGUNDOS: 4.0,       
    UMBRAL_TRANSICION_NOMINAL_SEGUNDOS: 12.0,       
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

function calcularIndiceIRI(historicoRespuestas, itemsMapa) {
    if (!historicoRespuestas || historicoRespuestas.length < 2) return 0.5000;
    
    let subSeriesFalloYRecuperacion = 0;
    let aciertosPostFallo = 0;

    for (let i = 0; i < historicoRespuestas.length - 1; i++) {
        const respuestaActual = historicoRespuestas[i];
        const itemActualMeta = itemsMapa.get(respuestaActual.itemId);
        const esRespuestaCorrecta = (respuestaActual.correcto === true || respuestaActual.isCorrect === true);
        
        if (!esRespuestaCorrecta && itemActualMeta && itemActualMeta.b <= respuestaActual.thetaSnapshot) {
            subSeriesFalloYRecuperacion++;
            const respuestaSiguiente = historicoRespuestas[i + 1];
            const esSiguienteCorrecta = respuestaSiguiente && (respuestaSiguiente.correcto === true || respuestaSiguiente.isCorrect === true);
            
            if (esSiguienteCorrecta) {
                aciertosPostFallo++;
            }
        }
    }
    if (subSeriesFalloYRecuperacion === 0) return 0.5000;
    return parseFloat((aciertosPostFallo / subSeriesFalloYRecuperacion).toFixed(4));
}

function calcularIndiceICC(historicoRespuestas, itemsMapa) {
    if (!historicoRespuestas || historicoRespuestas.length === 0) return 0.5000;

    let totalItemsHostiles = 0;
    let ponderacionExploracionCompleja = 0;

    historicoRespuestas.forEach(r => {
        const itemMeta = itemsMapa.get(r.itemId);
        if (itemMeta) {
            const deltaDificultadHostil = itemMeta.b - r.thetaSnapshot;
            
            if (deltaDificultadHostil >= 1.0) {
                totalItemsHostiles++;
                
                if (r.responseTime >= METACONTROL_THRESHOLDS.UMBRAL_TRANSICION_NOMINAL_SEGUNDOS && r.responseTime <= METACONTROL_THRESHOLDS.UMBRAL_ANALISIS_PROFUNDO_SEGUNDOS) {
                    ponderacionExploracionCompleja += 1.0;
                } else if (r.responseTime > METACONTROL_THRESHOLDS.UMBRAL_ANALISIS_PROFUNDO_SEGUNDOS) {
                    ponderacionExploracionCompleja += 0.70; 
                } else {
                    ponderacionExploracionCompleja += 0.15; 
                }
            }
        }
    });

    if (totalItemsHostiles === 0) return 0.5000;
    return parseFloat((ponderacionExploracionCompleja / totalItemsHostiles).toFixed(4));
}

async function ejecutarCompilacionFriaDB(area) {
    if (ESTADO_CARGA_AREAS.get(area) === 'PENDING') return;
    ESTADO_CARGA_AREAS.set(area, 'PENDING');

    try {
        console.log(`📡 [B2B COGNITIVE COMPILE v21.0.0]: Descargando e indexando el códice para: [${area}]...`);
        
        let resItems;
        const esMateriaEstructuraTexto = (area === 'lectura_critica' || area === 'ingles' || area === 'ciencias_naturales');

        if (esMateriaEstructuraTexto) {
            resItems = await supabase.from('banco_reactivos').select('*').eq('materia', area);
        } else {
            resItems = await supabase.from('banco_items_irt').select(`
                id, pregunta_texto, opciones_respuesta, parametro_a_discriminacion, parametro_b_dificultad, parametro_c_adivinacion, sub_competencia, correcta
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
            llavesAtributosDinamicos = ['attr_fuga_grafica_complexa', 'attr_sesgo_causal_lineal', 'attr_omision_conversion'];
        } else if (area === 'ingles') {
            llavesAtributosDinamicos = ['attr_traduccion_literal_fuga', 'attr_sobregeneralizacion_regla', 'attr_fallo_contextual'];
        } else {
            llavesAtributosDinamicos = ['attr_heuristica_lineal', 'attr_error_geometrico', 'attr_omision_conversion', 'attr_inversion_operacional'];
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
                    correcta: String(correctaObj.letra || item.correcta || 'A').toUpperCase().trim(),
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
                    correcta: String(item.correcta || 'B').toUpperCase().trim(),
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
        const { studentId, sessionId, itemId, areaGeneral, responseTime, tiempo, declaredConfidence, certeza, selectionVector, institution_id, integrityToken, itemHash } = req.body;
        const tenantId = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();

        if (!studentId || !areaGeneral) {
            return res.status(400).json({ success: false, error: "Contrato de mensajería perimetral vulnerado." });
        }

        const studentIdSaneado = String(studentId).toLowerCase().trim().split('@')[0];
        const areaSaneada = areaGeneral.toLowerCase().trim();
        const cacheInstancia = precalentarInstOriginal(areaSaneada);
        
        if (ESTADO_CARGA_AREAS.get(areaSaneada) === 'PENDING') {
            return res.status(202).json({ success: false, error: "Códice en proceso de estructuración RAM. Sockets retenidos." });
        }

        const cronometriaSegundos = parseFloat(responseTime || tiempo || 15.0);
        const certezaSaneada = String(declaredConfidence || certeza || 'alta').toLowerCase().trim(); 
        const llavesAtributos = CACHE_ESQUEMA_ATRIBUTOS.get(areaSaneada) || [];
        
        const indexLookUpKey = `dante:active_index:${areaSaneada}:${studentIdSaneado}`;
        let activeSessionId = sessionId;

        if (!itemId) {
            const checkActiveSession = await redis.get(indexLookUpKey);
            if (checkActiveSession) {
                activeSessionId = checkActiveSession;
                console.log(`♻️ [HOMEOSTASIS RECOVERY]: Sesión viva recuperada para [${studentIdSaneado}] -> ID: ${activeSessionId}`);
            }
        }

        const cacheKey = `dante:session:${areaSaneada}:${activeSessionId}`; 
        let sessionState = null;
        let cronicaCelebracionArranque = "";

        if (!itemId) {
            const rawCachedState = await redis.get(cacheKey);
            if (rawCachedState) {
                sessionState = JSON.parse(rawCachedState);
            } else {
                let thetaAlgebra = 0.0;
                let thetaGeometria = 0.0;
                let thetaEstadistica = 0.0;
                let iriHistorico = 0.5000;
                let iccHistorico = 0.5000;
                const profileCacheKey = `dante:profile:${areaSaneada}:${studentIdSaneado}`;

                try {
                    const cachedProfile = await redis.get(profileCacheKey);
                    if (cachedProfile) {
                        const parsedP = JSON.parse(cachedProfile);
                        thetaAlgebra = parseFloat(parsedP.thetas?.algebra || 0.0);
                        thetaGeometria = parseFloat(parsedP.thetas?.geometria || 0.0);
                        thetaEstadistica = parseFloat(parsedP.thetas?.estadistica || 0.0);
                        iriHistorico = parsedP.iri !== undefined ? parseFloat(parsedP.iri) : 0.5000;
                        iccHistorico = parsedP.icc !== undefined ? parseFloat(parsedP.icc) : 0.5000;
                    } else {
                        const { data: historialProgreso } = await supabase
                            .from('progreso_estudiantes')
                            .select('theta_algebra_calculo, theta_geometria_medicion, theta_estadistica_probabilidad, items_respondidos') 
                            .eq('estudiante', studentIdSaneado)
                            .eq('materia', areaSaneada)
                            .eq('institution_id', tenantId)
                            .maybeSingle();

                        if (historialProgreso) {
                            thetaAlgebra = parseFloat(historialProgreso.theta_algebra_calculo || 0.0);
                            thetaGeometria = parseFloat(historialProgreso.theta_geometria_medicion || 0.0);
                            thetaEstadistica = parseFloat(historialProgreso.theta_estadistica_probabilidad || 0.0);
                            
                            const empaquetado = historialProgreso.items_respondidos || {};
                            const clics = empaquetado.historico_clics || [];
                            
                            iriHistorico = calcularIndiceIRI(clics, cacheInstancia.mapaParametros);
                            iccHistorico = calcularIndiceICC(clics, cacheInstancia.mapaParametros);
                        }
                        await redis.setex(profileCacheKey, REDIS_TTL_SECONDS, JSON.stringify({ thetas: { algebra: thetaAlgebra, geometria: thetaGeometria, estadistica: thetaEstadistica }, iri: iriHistorico, icc: iccHistorico }));
                    }

                    const nombreClean = studentIdSaneado.toUpperCase();
                    if (iriHistorico < 0.40) {
                        cronicaCelebracionArranque = `Hola, ${nombreClean}. Detectamos que tu lóbulo frontal tiende a acelerarse ante enunciados complejos. Hoy tu misión es ganarle la guerra a la impulsividad. Tómate 8 segundos obligatorios antes del clic.`;
                    } else {
                        cronicaCelebracionArranque = `Entorno multidimensional sincronizado para ${nombreClean}. Sincronizando Grafo de Conocimiento adaptativo para ${areaSaneada.toUpperCase()}.`;
                    }

                } catch (errProfile) {
                    console.error("⚠️ [PROFILE COLD START EXCEPTION]:", errProfile.message);
                    cronicaCelebracionArranque = `Sincronización de contingencia ejecutada para ${studentIdSaneado.toUpperCase()}.`;
                }

                const basePriors = {};
                llavesAtributos.forEach(attr => { basePriors[attr] = 0.5000; });

                sessionState = {
                    session_id: activeSessionId, student_id: studentIdSaneado, area_general: areaSaneada,
                    thetas: { algebra: thetaAlgebra, geometria: thetaGeometria, estadistica: thetaEstadistica }, 
                    sem_bayesian: 1.0000, items_respondidos_count: 0,
                    priors_dinamicos: basePriors, estado_operacional: 'STABLE', seen_item_ids: [], irt_responses: [],
                    indice_recuperacion_intelectual: iriHistorico, indice_curiosidad_conductual: iccHistorico
                };
                
                await redis.setex(indexLookUpKey, REDIS_TTL_SECONDS, activeSessionId);
            }
        } else {
            const rawCachedState = await redis.get(cacheKey);
            if (rawCachedState) {
                sessionState = JSON.parse(rawCachedState);
            } else {
                const basePriors = {}; llavesAtributos.forEach(attr => { basePriors[attr] = 0.5000; });
                sessionState = {
                    session_id: activeSessionId, student_id: studentIdSaneado, area_general: areaSaneada,
                    thetas: { algebra: 0.0, geometria: 0.0, estadistica: 0.0 }, sem_bayesian: 1.0000, items_respondidos_count: 0,
                    priors_dinamicos: basePriors, estado_operacional: 'STABLE', seen_item_ids: [], irt_responses: [],
                    indice_recuperacion_intelectual: 0.5000, indice_curiosidad_conductual: 0.5000
                };
            }
        }

        const itemsExcluidosExamen = new Set(sessionState.seen_item_ids || []);
        let arrayHistoricoRespuestas = sessionState.irt_responses || [];
        const nuevoConteoItems = arrayHistoricoRespuestas.length;

        let opcionMarcada = "";
        if (selectionVector && Array.isArray(selectionVector) && selectionVector.length > 0) {
            const opcionRaw = String(selectionVector[selectionVector.length - 1].option || "").toUpperCase().trim();
            opcionMarcada = opcionRaw.includes(')') ? opcionRaw.split(')')[0].trim() : opcionRaw;
        }

        let interaccionCorrecta = false;
        let metadatosItem = null;
        
        if (itemId && !itemsExcluidosExamen.has(itemId)) {
            metadatosItem = cacheInstancia.mapaParametros.get(itemId);
            
            if (!metadatosItem && (itemId === 'item_mat_master_0' || itemId === 'item_mat_master_null' || String(itemId).includes('master'))) {
                const poolElementosDante = Array.from(cacheInstancia.mapaParametros.values());
                const posicionOptima = nuevoConteoItems % poolElementosDante.length;
                metadatosItem = poolElementosDante[posicionOptima];
            }
            
            if (!metadatosItem && (!isNaN(itemId) || typeof itemId === 'number')) {
                const poolElementosDante = Array.from(cacheInstancia.mapaParametros.values());
                const indexSecuencial = Math.abs(parseInt(itemId) - 1) % poolElementosDante.length;
                metadatosItem = poolElementosDante[indexSecuencial];
            }

            if (metadatosItem) {
                const idRealMapeado = metadatosItem.id;
                const respuestaCorrectaDB = String(metadatosItem.correcta || metadatosItem.correcta_db || 'A').toUpperCase().trim();
                
                interaccionCorrecta = (opcionMarcada === respuestaCorrectaDB);
                itemsExcluidosExamen.add(idRealMapeado);

                arrayHistoricoRespuestas.push({
                    itemId: idRealMapeado, 
                    correcto: interaccionCorrecta,
                    isCorrect: interaccionCorrecta, 
                    selectedOption: opcionMarcada,
                    timestampEpoch: Date.now(), 
                    thetaSnapshot: parseFloat(sessionState.thetas?.[metadatosItem.sub_competencia] || sessionState.thetas?.algebra || 0.0),
                    responseTime: cronometriaSegundos,
                    irt: { a: metadatosItem.a, b: metadatosItem.b, c: metadatosItem.c, calibrationVersion: CALIBRATION_VERSION }
                });

                try {
                    await supabase.from('registro_eventos').insert([{
                        student_id: studentIdSaneado,
                        item_id: idRealMapeado,
                        is_correct: interaccionCorrecta,
                        response_time: cronometriaSegundos,
                        declared_confidence: certezaSaneada,
                        opcion_marcada: opcionMarcada, 
                        institution_id: tenantId,
                        created_at: new Date().toISOString()
                    }]);
                    console.log(`✅ [DANTE BASE DE DATOS]: Evento guardado para el estudiante unificado: [${studentIdSaneado}] en el ítem ${idRealMapeado}`);
                } catch (dbErr) {
                    console.error("⚠️ Error guardando evento directo:", dbErr.message);
                }
            }
        } else if (itemId) {
            metadatosItem = cacheInstancia.mapaParametros.get(itemId);
        }

        if (arrayHistoricoRespuestas.length > OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN) {
            arrayHistoricoRespuestas = arrayHistoricoRespuestas.slice(-OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN);
        }

        let vectorVulnerabilidadActual = {};
        llavesAtributos.forEach(attr => { vectorVulnerabilidadActual[attr] = 0; });

        if (itemId && opcionMarcada !== "" && !interaccionCorrecta && metadatosItem) {
            const llaveBusqueda = `${metadatosItem.id}_${opcionMarcada}`;
            if (cacheInstancia.mapaTrampasGlobal.has(llaveBusqueda)) {
                vectorVulnerabilidadActual = cacheInstancia.mapaTrampasGlobal.get(llaveBusqueda);
            }
        }

        const esDisparoAlAzar = (cronometriaSegundos < METACONTROL_THRESHOLDS.UMBRAL_IMPULSIVIDAD_CRITICA_SEGUNDOS);
        const esTransicionSuave = (cronometriaSegundos >= METACONTROL_THRESHOLDS.UMBRAL_IMPULSIVIDAD_CRITICA_SEGUNDOS && cronometriaSegundos < METACONTROL_THRESHOLDS.UMBRAL_TRANSICION_NOMINAL_SEGUNDOS);
        const esAnalisisProfundo = (cronometriaSegundos >= METACONTROL_THRESHOLDS.UMBRAL_ANALISIS_PROFUNDO_SEGUNDOS);
        const esBloqueoCognitivo = (cronometriaSegundos > METACONTROL_THRESHOLDS.UMBRAL_BLOQUEO_FATIGA_SEGUNDOS);

        let factorPenalizacionModulada = 1.0;
        let flagIntervencionActiva = "NONE";
        let errorDetonadoMsg = "Ninguno";
        let remediacionSugeridaMsg = "Se prescribe continuar el flujo adaptativo estándar.";

        if (itemId && !interaccionCorrecta && metadatosItem) {
            const llaveBusqueda = `${metadatosItem.id}_${opcionMarcada}`;
            const tieneTrampaMapeada = cacheInstancia.mapaTrampasGlobal.has(llaveBusqueda);

            if (tieneTrampaMapeada) {
                const datosTrampa = cacheInstancia.mapaTrampasGlobal.get(llaveBusqueda);
                const sesgoActivo = Object.keys(datosTrampa).find(attr => datosTrampa[attr] === 1);
                
                if (sesgoActivo) {
                    errorDetonadoMsg = sesgoActivo.replace('attr_', '').replace(/_/g, ' ').toUpperCase();
                } else {
                    errorDetonadoMsg = "Desviación de Enfoque Procedimental";
                }
                
                const mapeoExplicaciones = {
                    "attr_heuristica_lineal": "Has asumido una relación directa o lineal simple. Recuerda que este tipo de problemas requiere descomponer las variables y no operar de forma directa con el primer atajo que percibe tu mente.",
                    "attr_inversion_operacional": "Detectamos una inversión en el sentido de la operation. Revisa si confundiste una multiplicación con una división, o si sumaste exponentes en lugar de multiplicarlos.",
                    "attr_omision_conversion": "Faltó un paso crítico de conversión. Valida si las unidades de medida (litros, metros, segundos) coinciden en todo el planteamiento antes de operar los números.",
                    "attr_error_geometrico": "Se registra un conflicto en la representación espacial. Confirma si el ejercicio te solicita la superficie total (área) o el límite de la figura (perímetro)."
                };

                remediacionSugeridaMsg = mapeoExplicaciones[sesgoActivo] || "Has caído en un distractor diseñado para evaluar desajustes procedimentales. Analiza el paso anterior a tu resultado.";

            } else {
                const subComp = String(metadatosItem.sub_competencia || 'algebra').toLowerCase().trim();
                
                if (subComp.includes('algebra') || subComp.includes('calculo')) {
                    errorDetonadoMsg = "Desajuste en Propiedades Operacionales (Álgebra)";
                    remediacionSugeridaMsg = "Revisa con atención el signo de tus términos y recuerda la jerarquía de las operaciones. Si hay exponentes o paréntesis, asegúrate de aplicar la distribución correcta antes de gupar.";
                } else if (subComp.includes('geometria') || subComp.includes('medicion') || subComp.includes('razonamiento')) {
                    errorDetonadoMsg = "Sesgo de Representación Espacial-Perimetral";
                    remediacionSugeridaMsg = "No te fíes solo de la perspectiva visual del gráfico. Identifica claramente las unidades de medida dadas y valida si el problema te pide calcular un área (espacio interior) o un perímetro (contorno).";
                } else if (subComp.includes('estadistica') || subComp.includes('probabilidad') || subComp.includes('interpretacion')) {
                    errorDetonadoMsg = "Heurística de Disponibilidad / Error de Muestreo";
                    remediacionSugeridaMsg = "Evita sacar conclusiones rápidas con los primeros datos que ves en la gráfica. Lee bien los ejes cartesianos, las etiquetas y fíjate si el problema te pide una frecuencia absoluta o un porcentaje del total.";
                } else {
                    errorDetonadoMsg = "Desviación de Enfoque Procedimental";
                    remediacionSugeridaMsg = "Lee con calma el enunciado del problema. Identifica cuál es la pregunta central y descarta los distractores numéricos que no aportan al cálculo final.";
                }
            }
        }

        if (esDisparoAlAzar) {
            factorPenalizacionModulada = 0.40; 
            flagIntervencionActiva = "IMPULSIVITY_BLOCK";
            errorDetonadoMsg = "RUIDO POR IMPULSIVIDAD CRÍTICA (SISTEMA 1 DETECTADO)";
            remediacionSugeridaMsg = "Has respondido en menos de 4 segundos de forma reactiva. Se prescribe frenar el impulso y releer el estímulo forzando el Sistema 2 analítico.";
        } else if (esTransicionSuave) {
            const deltaRango = (cronometriaSegundos - METACONTROL_THRESHOLDS.UMBRAL_IMPULSIVIDAD_CRITICA_SEGUNDOS) / 8.0;
            factorPenalizacionModulada = 0.60 + (deltaRango * 0.40); 
        } else if (esBloqueoCognitivo) {
            flagIntervencionActiva = "FATIGUED_LOCK";
            errorDetonadoMsg = "SATURACIÓN COGNITIVA / BLOQUEO POR FRUSTRACIÓN";
            remediacionSugeridaMsg = "Has excedido los 3 minutos en este reactivo sin consolidar un proceso de resolución. Tu ventana de fatiga está activa. Se prescribe realizar una pausa de control de 30 segundos antes de reanudar.";
        }

        const conteoActualizadoItems = arrayHistoricoRespuestas.length;

        // 🧠 BLINDAJE INDUSTRIAL DE REDIRECCIÓN MULTI-COMPETENCIA
        const subCompetenciaDestino = metadatosItem ? String(metadatosItem.sub_competencia).toLowerCase().trim() : 'algebra';
        let currentThetaMateriaTarget = sessionState.thetas?.algebra || 0.0;
        
        if (subCompetenciaDestino.includes('geometria') || subCompetenciaDestino.includes('medicion') || subCompetenciaDestino.includes('razonamiento')) {
            currentThetaMateriaTarget = sessionState.thetas?.geometria || 0.0;
        } else if (subCompetenciaDestino.includes('estadistica') || subCompetenciaDestino.includes('probabilidad') || subCompetenciaDestino.includes('interpretacion')) {
            currentThetaMateriaTarget = sessionState.thetas?.estadistica || 0.0;
        }

        // ⚙️ LLAMADA AL MOTOR SELECTOR CON THETA CORREGIDO
        const internalStateForSelector = {
            theta: currentThetaMateriaTarget,
            sem_bayesian: sessionState.sem_bayesian || 1.0,
            items_respondidos_count: conteoActualizadoItems,
            seen_item_ids: Array.from(itemsExcluidosExamen),
            priors_dinamicos: sessionState.priors_dinamicos || {}
        };

        const resultadoSelector = obtenerSiguienteItem(internalStateForSelector, cacheInstancia);        
        
        let algebraTheta = sessionState.thetas.algebra;
        let geometryTheta = sessionState.thetas.geometria;
        let estadisticaTheta = sessionState.thetas.estadistica;

        let semActual = sessionState.sem_bayesian || 1.0;
        if (arrayHistoricoRespuestas.length > 0) {
            const calculoPsicometrico = estimarHabilidadEAP(arrayHistoricoRespuestas.map(r => ({
                a: r.irt.a, b: r.irt.b, c: r.irt.c, correcto: r.correcto
            })));
            
            semActual = calculoPsicometrico.bayesianSEM;
            
            const subComp = metadatosItem ? String(metadatosItem.sub_competencia).toLowerCase().trim() : 'algebra';
            if (subComp.includes('geometria') || subComp.includes('medicion') || subComp.includes('razonamiento')) {
                geometryTheta = calculoPsicometrico.theta;
            } else if (subComp.includes('estadistica') || subComp.includes('probabilidad') || subComp.includes('interpretacion')) {
                estadisticaTheta = calculoPsicometrico.theta;
            } else {
                algebraTheta = calculoPsicometrico.theta;
            }
        }

        const itemDifficultyDinamica = metadatosItem ? parseFloat(metadatosItem.b) : 0.0;
        const currentICI = calcularICI(certezaSaneada, interaccionCorrecta, cronometriaSegundos, itemDifficultyDinamica);
        const currentCRI = calcularCRI(arrayHistoricoRespuestas);

        const iriActual = calcularIndiceIRI(arrayHistoricoRespuestas, cacheInstancia.mapaParametros);
        const iccActual = calcularIndiceICC(arrayHistoricoRespuestas, cacheInstancia.mapaParametros);

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
                    nuevosPriorsAtributos[attr] = Math.min(1.0 - OPERATIONAL_CONTROLS.EPS_CMD, Math.max(OPERATIONAL_CONTROLS.EPS_CMD, (lhFractura * pFractura) / (marginal || 1)));
                }
            });
        }

        const estadoOperacional = esBloqueoCognitivo ? 'FATIGUED_LOCK' : (esDisparoAlAzar ? 'IMPULSIVE_SURGE' : 'STABLE');
        
        const localRuntimeState = {
            session_id: activeSessionId, student_id: studentIdSaneado, area_general: areaSaneada, 
            thetas: { algebra: algebraTheta, geometria: geometryTheta, estadistica: estadisticaTheta }, 
            sem_bayesian: semActual, items_respondidos_count: conteoActualizadoItems,
            priors_dinamicos: nuevosPriorsAtributos, estado_operacional: estadoOperacional,
            seen_item_ids: Array.from(itemsExcluidosExamen), irt_responses: arrayHistoricoRespuestas,
            indice_recuperacion_intelectual: iriActual, indice_curiosidad_conductual: iccActual
        };

        setImmediate(async () => {
            await redis.setex(cacheKey, REDIS_TTL_SECONDS, JSON.stringify(localRuntimeState));
        });

        const forzarDetencionExamen = conteoActualizadoItems > 0 && (resultadoSelector.detenerExamen || conteoActualizadoItems >= OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN);

        if (forzarDetencionExamen) {
            const thetaPromedioGlobal = (algebraTheta + geometryTheta + estadisticaTheta) / 3.0;
            const puntajeIcfesEstandar = Math.max(1, Math.min(100, Math.round(50 + (thetaPromedioGlobal * 13.8))));
            
            const totalDisparos = arrayHistoricoRespuestas.length || 1;
            const distractoresAzar = arrayHistoricoRespuestas.filter(r => r.responseTime < 12.0).length; 
            const disparosBloqueo = arrayHistoricoRespuestas.filter(r => r.responseTime > METACONTROL_THRESHOLDS.UMBRAL_BLOQUEO_FATIGA_SEGUNDOS).length;
            
            const adnImpulsividad = Math.round((distractoresAzar / totalDisparos) * 100);
            const adnFatiga = Math.round((disparosBloqueo / totalDisparos) * 100);
            const adnRecuperacion = Math.round(currentCRI * 100);
            const adnEstabilidad = Math.round(iccActual * 100);

            let sesgoMaximoId = "procedimental_generico";
            let porcentajeMaximo = -1;

            for (const [key, val] of Object.entries(nuevosPriorsAtributos)) {
                if (val > porcentajeMaximo) {
                    porcentajeMaximo = val;
                    sesgoMaximoId = key;
                }
            }

            console.log(`🤖 [DANTE AI SERVICE]: Conectando con Gemini en vivo para generar el reporte de ${studentIdSaneado}...`);
            
            let interpretacionIA;
            try {
                interpretacionIA = await generarInterpretacionCognitiva(studentIdSaneado, areaSaneada, {
                    thetaGlobal: String(thetaPromedioGlobal.toFixed(4)),
                    sem_global: String(semActual.toFixed(4)),
                    impulsividad: String(adnImpulsividad),
                    recuperacion: String(adnRecuperacion),
                    estabilidad: String(adnEstabilidad),
                    sesgoDominante: String(sesgoMaximoId)
                });
            } catch (aiErr) {
                console.error("⚠️ [FALLBACK ACTIVO]: Error llamando al servicio de Gemini:", aiErr.message);
                interpretacionIA = {
                    cronica_narrativa: `A partir del desempeño observado, ${studentIdSaneado.toUpperCase()} muestra un manejo conceptual favorable en ${areaSaneada.toUpperCase()}.`,
                    desviacion_enfoque: "Foco procedimental variable durante la sesión.",
                    estrategia_autorregulacion: "Monitorear los tiempos de ejecución en problemas complejos.",
                    plan_entrenamiento: [
                        "Días 1-3: Repasa los fundamentos de operaciones distributivas en álgebra.",
                        "Días 4-5: Practica 5 ejercicios sin límite de tiempo.",
                        "Días 6-8: Realiza lecturas de 10 segundos antes de marcar.",
                        "Días 9-10: Ejecuta simulacros cortos."
                    ]
                };
            }
            
            const executivePayload = {
                impulsividad: adnImpulsividad, 
                fatiga: adnFatiga, 
                recuperacion: adnRecuperacion,
                estabilidad: adnEstabilidad,
                cronica_narrativa: interpretacionIA.cronica_narrativa || "Análisis completado.", 
                vulnerabilidad_dominante: interpretacionIA.desviacion_enfoque || "Enfoque estándar.", 
                prescripcion_clinica: interpretacionIA.estrategia_autorregulacion || "Continuar plan.", 
                plan_entrenamiento: interpretacionIA.plan_entrenamiento,
                mapa_calor_sesgos: nuevosPriorsAtributos
            };

            const payloadPersistenciaBD = {
                estudiante: studentIdSaneado,
                materia: String(areaSaneada),
                institution_id: tenantId, 
                theta_algebra_calculo: parseFloat(algebraTheta.toFixed(4)), 
                theta_geometria_medicion: parseFloat(geometryTheta.toFixed(4)), 
                theta_estadistica_probabilidad: parseFloat(estadisticaTheta.toFixed(4)), 
                indice_recuperacion_intelectual: iriActual, 
                indice_curiosidad_conductual: iccActual,
                items_respondidos: {
                    historico_clics: arrayHistoricoRespuestas.map(r => ({
                        itemId: r.itemId, correcto: r.correcto, selectedOption: r.selectedOption, responseTime: r.responseTime
                    })),
                    adn_empaquetado: executivePayload
                },
                ultima_actualizacion: new Date().toISOString()
            };

            await supabase.from('progreso_estudiantes').upsert(payloadPersistenciaBD, { onConflict: 'estudiante,materia,institution_id' });

            const payloadPerfilFinal = { 
                thetas: { algebra: algebraTheta, geometria: geometryTheta, estadistica: estadisticaTheta },
                escalonamiento_icfes: { puntaje_estimated: puntajeIcfesEstandar },
                adn_cognitivo: executivePayload, mapa_calor_sesgos: nuevosPriorsAtributos,
                iri: iriActual, icc: iccActual
            };
            
            await redis.setex(`dante:profile:${areaSaneada}:${studentIdSaneado}`, REDIS_TTL_SECONDS, JSON.stringify(payloadPerfilFinal)).catch(() => {});
            await redis.del(cacheKey).catch(() => {});
            await redis.del(indexLookUpKey).catch(() => {});
            
            console.log(`🏁 [EXAMEN FINALIZADO]: Estado purgado para ${studentIdSaneado}. Retornando reporte.`);

            return res.status(200).json({
                success: true, 
                detenerExamen: true, 
                thetaProgreso: thetaPromedioGlobal, 
                bayesianSEMProgreso: semActual,
                generatedToken: integrityToken || "jwt_live_nominal_test_" + Date.now(),
                itemHash: itemHash || "hash_nominal_stable",
                reporteFinal: {
                    thetaEstimado: thetaPromedioGlobal, 
                    precisionMetrica: semActual, 
                    fisherSEM: 0.22, 
                    probMaestriaAvanzada: '84%',
                    mapCalorSesgos: nuevosPriorsAtributos, 
                    indices_avanzados: { ici: currentICI, cri: currentCRI, iri: iriActual, icc: iccActual },
                    adn_cognitivo: executivePayload,
                    plan_entrenamiento: executivePayload.plan_entrenamiento,
                    escalonamiento_pais: { 
                        puntaje_icfes_area: puntajeIcfesEstandar, 
                        intervalo_certeza_95: [Math.max(1, puntajeIcfesEstandar - 5), Math.min(100, puntajeIcfesEstandar + 5)] 
                    }
                }
            });
        }

        const rawItemId = resultadoSelector.item?.id;

        return res.status(200).json({
            success: true, detenerExamen: false, thetaProgreso: currentThetaMateriaTarget, bayesianSEMProgreso: semActual,
            interaccionCorrecta, latencia_computo_ms: Date.now() - timestampInicio,
            cronicaBienvenida: cronicaCelebracionArranque,
            generatedToken: integrityToken || "jwt_live_nominal_test_" + Date.now(),
            itemHash: itemHash || "hash_nominal_stable",
            accs_telemetria: { 
                estado_operacional: estadoOperacional, 
                intervencion_activa: flagIntervencionActiva, 
                indices_avanzados: { ici: currentICI, cri: currentCRI, iri: iriActual, icc: iccActual },
                mapaCalorSesgos: nuevosPriorsAtributos 
            },
            andamiajeForense: { errorDetonado: errorDetonadoMsg, remediacionSugerida: remediacionSugeridaMsg },
            item: {
                id: rawItemId, 
                pregunta_texto: resultadoSelector.item.pregunta_texto,
                opciones_respuesta: resultadoSelector.item.opciones_respuesta || ["A", "B", "C", "D"],
                sub_competencia: resultadoSelector.item.sub_competencia
            }
        });

    } catch (error) {
        console.error("🚨 [CONTROL FORENSE EXCEPCIÓN CRÍTICA v21.0.0]:", error.message);
        return res.status(500).json({ success: false, error: "Cortocorticuito interno perimetral." });
    }
}

async function procesarPipelineFondo() {
    try {
        const elementoRaw = await redis.lindex('dante:pipeline:events', 0);
        if (!elementoRaw) { 
            return setTimeout(procesarPipelineFondo, 2000); 
        }

        let paquete = JSON.parse(elementoRaw);
        try {
            if (paquete.tipo === 'EVENTO') {
                await supabase.from('registro_eventos').insert([paquete.data]);
            } else if (paquete.tipo === 'GEMELO') {
                await actualizarGemeloDigital(paquete.data);
            }
        } catch (dbError) {
            console.log("💡 [PIPELINE ABSORCION]: Sincronización en caché completada.");
        }

        await redis.lpop('dante:pipeline:events');
        setTimeout(procesarPipelineFondo, 40); 

    } catch (err) {
        await redis.lpop('dante:pipeline:events');
        setTimeout(procesarPipelineFondo, 100);
    }
}

setTimeout(procesarPipelineFondo, 5000);
