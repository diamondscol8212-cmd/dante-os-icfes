// SessionService.js - Gestión de Sesiones, Redlock, Caché RAM y Repositorios (Dante OS v22.2.0)
// Bogotá, Colombia
import crypto from 'crypto';
import { supabase } from '../../../supabaseClient.js';
import { redis } from '../../../redisClient.js';
import { LRUCache, acquireRedlock, releaseRedlock } from './CatRepository.js';
import { BANCO_COMPLETO } from '../bank/index.js';
import { calcularIndiceIRI, calcularIndiceICC } from './MetacognitionEngine.js';

export const REDIS_TTL_SECONDS = 86400;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LETRAS_MAP = ["A", "B", "C", "D"];

// 🧹 CACHÉ CON LÍMITE LRU EN RAM
export const CACHE_BANCO_ITEMS = new LRUCache(500);
export const CACHE_BUCKETS_DIFICULTAD = new LRUCache(100);
export const CACHE_MAPA_TRAMPAS = new LRUCache(1000);
export const CACHE_TIMESTAMPS = new LRUCache(100);
export const ESTADO_CARGA_AREAS = new LRUCache(100);
export const CACHE_ESQUEMA_ATRIBUTOS = new LRUCache(100);

export function sanitizarAreaMateria(rawArea) {
    if (!rawArea) return 'matematicas';
    const s = String(rawArea).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (s.includes('lectura') || s.includes('lenguaje') || s.includes('critica') || s.includes('espanol') || s.includes('literatura')) {
        return 'lectura_critica';
    }
    if (s.includes('social') || s.includes('ciudadan') || s.includes('historia') || s.includes('democracia') || s.includes('politica')) {
        return 'sociales_ciudadanas';
    }
    if (s.includes('mate') || s.includes('razonamiento') || s.includes('algebra') || s.includes('calculo') || s.includes('geometria')) {
        return 'matematicas';
    }
    if (s.includes('ciencia') || s.includes('natural') || s.includes('fisica') || s.includes('quimica') || s.includes('biologia')) {
        return 'ciencias_naturales';
    }
    if (s.includes('ingl') || s.includes('english')) {
        return 'ingles';
    }
    return s;
}

export function obtenerIndexBucket(dificultad) {
    const bFloat = parseFloat(dificultad || 0);
    const bAcotado = Math.max(-4.0, Math.min(4.0, bFloat));
    return Math.round((bAcotado + 4.0) / 0.5);
}

export function barajarOpcionesItem(itemOriginal) {
    if (!itemOriginal) {
        return {
            itemBarajado: itemOriginal,
            nuevaLetraCorrecta: "B",
            mapaLetrasOrig: { A: "A", B: "B", C: "C", D: "D" }
        };
    }

    const opcionesRaw = (Array.isArray(itemOriginal.opciones_respuesta) && itemOriginal.opciones_respuesta.length > 0)
        ? itemOriginal.opciones_respuesta
        : (Array.isArray(itemOriginal.opciones) ? itemOriginal.opciones : []);

    if (!Array.isArray(opcionesRaw) || opcionesRaw.length === 0) {
        const rawFallback = String(itemOriginal?.correcta || itemOriginal?.ok || itemOriginal?.correcta_db || itemOriginal?.respuestaCorrecta || "A").toUpperCase().trim();
        const matchFallback = rawFallback.match(/[A-D]/);
        return {
            itemBarajado: itemOriginal,
            nuevaLetraCorrecta: matchFallback ? matchFallback[0] : "A",
            mapaLetrasOrig: { A: "A", B: "B", C: "C", D: "D" }
        };
    }

    const rawCorrecta = String(itemOriginal.correcta || itemOriginal.ok || itemOriginal.correcta_db || itemOriginal.respuestaCorrecta || "A").toUpperCase().trim();
    const matchCorrecta = rawCorrecta.match(/[A-D]/);
    const correctaOriginal = matchCorrecta ? matchCorrecta[0] : "A";
    
    let indexCorrectaOrig = LETRAS_MAP.indexOf(correctaOriginal);
    if (indexCorrectaOrig === -1) indexCorrectaOrig = 0;

    const opcionesEstructuradas = opcionesRaw.map((opt, idx) => {
        let textStr = "";
        if (typeof opt === 'object' && opt !== null) {
            textStr = opt.texto || opt.opcion || opt.descripcion || opt.label || JSON.stringify(opt);
        } else {
            textStr = String(opt || '');
        }
        
        const textLimpio = textStr.replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
        const letraOrig = LETRAS_MAP[idx] || "A";
        const textoFinal = (textLimpio && !/^[A-Da-d]$/i.test(textLimpio)) ? textLimpio : textStr;

        return {
            texto: textoFinal,
            letraOrig: letraOrig,
            esCorrecta: idx === indexCorrectaOrig
        };
    });

    for (let i = opcionesEstructuradas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesEstructuradas[i], opcionesEstructuradas[j]] = [opcionesEstructuradas[j], opcionesEstructuradas[i]];
    }

    let nuevaLetraCorrecta = "B";
    const mapaLetrasOrig = {};

    const nuevasOpciones = opcionesEstructuradas.map((obj, newIdx) => {
        const nuevaLetra = LETRAS_MAP[newIdx] || "A";
        if (obj.esCorrecta) {
            nuevaLetraCorrecta = nuevaLetra;
        }
        mapaLetrasOrig[nuevaLetra] = obj.letraOrig;
        return {
            letra: nuevaLetra,
            texto: obj.texto
        };
    });

    const itemBarajado = {
        ...itemOriginal,
        pregunta_texto: itemOriginal.pregunta_texto || itemOriginal.texto || itemOriginal.enunciado,
        opciones_respuesta: nuevasOpciones,
        correcta: nuevaLetraCorrecta,
        correcta_db: nuevaLetraCorrecta
    };

    return { itemBarajado, nuevaLetraCorrecta, mapaLetrasOrig };
}

export async function ejecutarCompilacionFriaDB(rawArea) {
    const area = sanitizarAreaMateria(rawArea);
    const yaTieneRAM = CACHE_BANCO_ITEMS.has(area) && CACHE_BANCO_ITEMS.get(area)?.size > 0;

    if (ESTADO_CARGA_AREAS.get(area) === 'PENDING') return;
    if (!yaTieneRAM) {
        ESTADO_CARGA_AREAS.set(area, 'PENDING');
    }

    try {
        console.log(`📡 [B2B COGNITIVE COMPILE v22.2.0]: Cargando e indexando área: [${area}]...`);
        
        let itemsRaw = [];
        try {
            const resItems = await supabase.from('banco_items_irt').select(`
                id, pregunta_texto, opciones_respuesta, parametro_a_discriminacion, parametro_b_dificultad, parametro_c_adivinacion, sub_competencia, correcta, matriz_q_items(*)
            `).eq('area_general', area);

            if (!resItems.error && resItems.data && resItems.data.length > 0) {
                itemsRaw = resItems.data;
            }
        } catch (e) {
            console.warn(`⚠️ Supabase offline para '${area}'. Usando banco nativo:`, e.message);
        }

        if (itemsRaw.length === 0) {
            itemsRaw = BANCO_COMPLETO.filter(it => {
                const itemArea = sanitizarAreaMateria(it.area || it.area_general || it.materia);
                return itemArea === area;
            }).map(it => ({
                id: it.id || crypto.randomUUID(),
                pregunta_texto: it.texto || it.pregunta_texto,
                opciones_respuesta: it.opciones || it.opciones_respuesta,
                parametro_a_discriminacion: it.a || it.parametro_a_discriminacion || 1.2,
                parametro_b_dificultad: it.b || it.parametro_b_dificultad || 0.0,
                parametro_c_adivinacion: it.c || it.parametro_c_adivinacion || 0.25,
                sub_competencia: it.sub_competencia || it.sub || 'general',
                target_exam: it.target_exam || 'SABER_11',
                carrera_objetivo: it.carrera_objetivo || null,
                imagen_url: it.imagen_url || null,
                correcta: it.opcion_correcta || it.correcta || it.ok || it.correcta_db || 'A',
                matriz_q_items: it.q || it.matriz_q || {}
            }));
        }

        if (itemsRaw.length === 0) {
            throw new Error(`El repositorio para '${area}' no contiene registros válidos.`);
        }

        const llavesAtributosDinamicos = ['attr_heuristica_lineal', 'attr_inversion_operacional', 'attr_omision_conversion', 'attr_error_geometrico'];
        CACHE_ESQUEMA_ATRIBUTOS.set(area, llavesAtributosDinamicos);

        const mapaItems = new Map();
        const matrizBuckets = Array.from({ length: 17 }, () => []);
        const mapaTrampas = new Map();

        itemsRaw.forEach(item => {
            const estructuraQ = {};
            llavesAtributosDinamicos.forEach(attr => {
                estructuraQ[attr] = item.matriz_q_items?.[attr] || 0;
            });

            let opcionesNormalizadas = [];
            if (Array.isArray(item.opciones_respuesta) && item.opciones_respuesta.length > 0) {
                opcionesNormalizadas = item.opciones_respuesta;
            } else if (Array.isArray(item.opciones) && item.opciones.length > 0) {
                opcionesNormalizadas = item.opciones;
            } else if (typeof item.opciones_respuesta === 'string') {
                try {
                    opcionesNormalizadas = JSON.parse(item.opciones_respuesta);
                } catch {
                    opcionesNormalizadas = [item.opciones_respuesta];
                }
            } else if (typeof item.opciones === 'string') {
                try {
                    opcionesNormalizadas = JSON.parse(item.opciones);
                } catch {
                    opcionesNormalizadas = [item.opciones];
                }
            } else if (item.opciones_respuesta && typeof item.opciones_respuesta === 'object') {
                opcionesNormalizadas = Object.values(item.opciones_respuesta);
            } else if (item.opciones && typeof item.opciones === 'object') {
                opcionesNormalizadas = Object.values(item.opciones);
            }

            const metadatosEstructurados = {
                id: item.id,
                pregunta_texto: item.pregunta_texto || item.texto || item.enunciado || "Pregunta de evaluación adaptativa",
                opciones_respuesta: opcionesNormalizadas,
                a: parseFloat(item.parametro_a_discriminacion || item.a || 1.0),
                b: parseFloat(item.parametro_b_dificultad || item.b || 0.0),
                c: parseFloat(item.parametro_c_adivinacion || item.c || 0.2),
                sub_competencia: String(item.sub_competencia || 'general').toLowerCase().trim(),
                target_exam: String(item.target_exam || 'SABER_11').toUpperCase().trim(),
                carrera_objetivo: item.carrera_objetivo || null,
                imagen_url: item.imagen_url || null,
                correcta: String(item.opcion_correcta || item.correcta || item.ok || item.correcta_db || 'A').toUpperCase().trim(),
                correcta_db: String(item.opcion_correcta || item.correcta || item.ok || item.correcta_db || 'A').toUpperCase().trim(),
                matriz_q: estructuraQ
            };

            mapaItems.set(item.id, metadatosEstructurados);
            const indexBucket = obtenerIndexBucket(metadatosEstructurados.b);
            matrizBuckets[indexBucket].push(metadatosEstructurados);
        });

        try {
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
        } catch (e) {
            console.warn("⚠️ [TRAMPAS DB WARN]: Usando mapa por defecto.", e.message);
        }

        CACHE_BANCO_ITEMS.set(area, mapaItems);
        CACHE_BUCKETS_DIFICULTAD.set(area, matrizBuckets);
        CACHE_MAPA_TRAMPAS.set(area, mapaTrampas);
        CACHE_TIMESTAMPS.set(area, Date.now());
        ESTADO_CARGA_AREAS.set(area, 'READY');

    } catch (err) {
        ESTADO_CARGA_AREAS.set(area, 'ERROR');
        console.error(`🚨 [COMPILATION FAILED]:`, err.message || err);
    }
}

export function compilarBancoEnRAM(rawArea) {
    const area = sanitizarAreaMateria(rawArea);
    if (CACHE_BANCO_ITEMS.has(area) && CACHE_BUCKETS_DIFICULTAD.has(area) && CACHE_BANCO_ITEMS.get(area)?.size > 0) {
        return;
    }

    const itemsRaw = BANCO_COMPLETO.filter(it => {
        const itemArea = sanitizarAreaMateria(it.area || it.area_general || it.materia);
        return itemArea === area;
    }).map(it => ({
        id: it.id || crypto.randomUUID(),
        pregunta_texto: it.texto || it.pregunta_texto,
        opciones_respuesta: Array.isArray(it.opciones || it.opciones_respuesta) ? (it.opciones || it.opciones_respuesta) : [it.opciones || it.opciones_respuesta],
        parametro_a_discriminacion: parseFloat(it.a || it.parametro_a_discriminacion || 1.2),
        parametro_b_dificultad: parseFloat(it.b || it.parametro_b_dificultad || 0.0),
        parametro_c_adivinacion: parseFloat(it.c || it.parametro_c_adivinacion || 0.25),
        sub_competencia: String(it.sub_competencia || it.sub || 'general').toLowerCase().trim(),
        target_exam: String(it.target_exam || 'SABER_11').toUpperCase().trim(),
        carrera_objetivo: it.carrera_objetivo || null,
        imagen_url: it.imagen_url || null,
        correcta: String(it.opcion_correcta || it.correcta || it.ok || it.correcta_db || 'A').toUpperCase().trim(),
        matriz_q_items: it.q || it.matriz_q || {}
    }));

    const llavesAtributosDinamicos = ['attr_heuristica_lineal', 'attr_inversion_operacional', 'attr_omision_conversion', 'attr_error_geometrico'];
    CACHE_ESQUEMA_ATRIBUTOS.set(area, llavesAtributosDinamicos);

    const mapaItems = new Map();
    const matrizBuckets = Array.from({ length: 17 }, () => []);
    const mapaTrampas = new Map();

    itemsRaw.forEach(item => {
        const estructuraQ = {};
        llavesAtributosDinamicos.forEach(attr => {
            estructuraQ[attr] = item.matriz_q_items?.[attr] || 0;
        });

        const metadatosEstructurados = {
            id: item.id,
            pregunta_texto: item.pregunta_texto || "Pregunta de evaluación adaptativa",
            opciones_respuesta: item.opciones_respuesta,
            a: item.parametro_a_discriminacion,
            b: item.parametro_b_dificultad,
            c: item.parametro_c_adivinacion,
            sub_competencia: item.sub_competencia,
            target_exam: item.target_exam,
            carrera_objetivo: item.carrera_objetivo,
            imagen_url: item.imagen_url,
            correcta: item.correcta,
            correcta_db: item.correcta,
            matriz_q: estructuraQ
        };

        mapaItems.set(item.id, metadatosEstructurados);
        const indexBucket = obtenerIndexBucket(metadatosEstructurados.b);
        matrizBuckets[indexBucket].push(metadatosEstructurados);
    });

    CACHE_BANCO_ITEMS.set(area, mapaItems);
    CACHE_BUCKETS_DIFICULTAD.set(area, matrizBuckets);
    CACHE_MAPA_TRAMPAS.set(area, mapaTrampas);
    CACHE_TIMESTAMPS.set(area, Date.now());
    ESTADO_CARGA_AREAS.set(area, 'READY');
}

// 🚀 Pre-compilar las 5 áreas principales en RAM al cargar el módulo
['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'].forEach(compilarBancoEnRAM);

export function precalentarInstOriginal(rawArea) {
    const area = sanitizarAreaMateria(rawArea);
    if (!CACHE_BANCO_ITEMS.has(area) || CACHE_BANCO_ITEMS.get(area)?.size === 0) {
        compilarBancoEnRAM(area);
    }
    const ahora = Date.now();
    const timestampArea = CACHE_TIMESTAMPS.get(area);
    const cacheExpirada = !timestampArea || (ahora - timestampArea) > CACHE_TTL_MS;

    if (cacheExpirada || ESTADO_CARGA_AREAS.get(area) === 'ERROR') {
        ejecutarCompilacionFriaDB(area).catch(() => {});
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

export async function adquirirCandadoSesion(areaSaneada, sessionId, studentIdSaneado, ttlMs = 3000) {
    const lockKey = `session:${areaSaneada}:${sessionId || studentIdSaneado}`;
    const lockValue = await acquireRedlock(lockKey, ttlMs);
    return { lockKey, lockValue };
}

export async function liberarCandadoSesion(lockKey, lockValue) {
    if (lockKey && lockValue) {
        await releaseRedlock(lockKey, lockValue);
    }
}

export async function obtenerOIniciarEstadoSesion({
    studentIdSaneado,
    areaSaneada,
    sessionId,
    itemId,
    targetExamSaneado,
    carreraObjetivoSaneada,
    tenantId,
    cacheInstancia,
    llavesAtributos
}) {
    const indexLookUpKey = `dante:active_index:${areaSaneada}:${studentIdSaneado}`;
    let activeSessionId = sessionId;

    if (!itemId) {
        const checkActiveSession = await redis.get(indexLookUpKey);
        if (checkActiveSession) {
            activeSessionId = checkActiveSession;
        }
    }

    const cacheKey = `dante:session:${areaSaneada}:${activeSessionId}`;
    let sessionState = null;
    let cronicaCelebracionArranque = "";

    if (!itemId) {
        const rawCachedState = await redis.get(cacheKey);
        if (rawCachedState) {
            sessionState = JSON.parse(rawCachedState);
            sessionState.target_exam = sessionState.target_exam || targetExamSaneado;
            sessionState.carrera_objetivo = sessionState.carrera_objetivo || carreraObjetivoSaneada;
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
                        .select('*')
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
                    cronicaCelebracionArranque = `Hola, ${nombreClean}. Tómate 8 segundos obligatorios antes del clic para estabilizar la atención.`;
                } else {
                    cronicaCelebracionArranque = `Entorno multidimensional MIRT sincronizado para ${nombreClean} [Examen: ${targetExamSaneado}]. Sincronizando Grafo Adaptativo para ${areaSaneada.toUpperCase()}.`;
                }

            } catch {
                cronicaCelebracionArranque = `Sincronización de contingencia ejecutada para ${studentIdSaneado.toUpperCase()}.`;
            }

            const basePriors = {};
            llavesAtributos.forEach(attr => { basePriors[attr] = 0.5000; });

            sessionState = {
                session_id: activeSessionId, student_id: studentIdSaneado, area_general: areaSaneada,
                target_exam: targetExamSaneado, carrera_objetivo: carreraObjetivoSaneada,
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
            sessionState.target_exam = sessionState.target_exam || targetExamSaneado;
            sessionState.carrera_objetivo = sessionState.carrera_objetivo || carreraObjetivoSaneada;
        } else {
            const basePriors = {}; llavesAtributos.forEach(attr => { basePriors[attr] = 0.5000; });
            sessionState = {
                session_id: activeSessionId, student_id: studentIdSaneado, area_general: areaSaneada,
                target_exam: targetExamSaneado, carrera_objetivo: carreraObjetivoSaneada,
                thetas: { algebra: 0.0, geometria: 0.0, estadistica: 0.0 }, sem_bayesian: 1.0000, items_respondidos_count: 0,
                priors_dinamicos: basePriors, estado_operacional: 'STABLE', seen_item_ids: [], irt_responses: [],
                indice_recuperacion_intelectual: 0.5000, indice_curiosidad_conductual: 0.5000
            };
        }
    }

    return {
        sessionState,
        activeSessionId,
        cacheKey,
        indexLookUpKey,
        cronicaCelebracionArranque
    };
}

export async function guardarEstadoSesion(cacheKey, state) {
    await redis.setex(cacheKey, REDIS_TTL_SECONDS, JSON.stringify(state));
}

export async function limpiarSesionActiva(cacheKey, indexLookUpKey) {
    await redis.del(cacheKey).catch(() => {});
    await redis.del(indexLookUpKey).catch(() => {});
}
