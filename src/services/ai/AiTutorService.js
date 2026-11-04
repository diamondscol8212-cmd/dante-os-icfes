// 🪐 AiTutorService.js - Motor Pedagógico Conversacional Socrático (Gemini 3.8 Flash + Perfil Conductual)
// Dante OS v23.0.0 Enterprise Edition // Bogotá, Colombia
// Basado en Teoría de Carga Cognitiva (Sweller) & Zona de Desarrollo Próximo (Vygotsky)

import { GoogleGenAI } from '@google/genai';

/**
 * Genera una retroalimentación socrática adaptativa hiper-personalizada utilizando Gemini 3.8 Flash.
 * Aplica los 4 Guardarraíles Pedagógicos Innegociables y soporte para andamiaje progresivo (Nivel 1 o Nivel 2).
 * 
 * @param {Object} params
 * @param {Object} params.item - Objeto reactivo (id, pregunta_texto, opciones_respuesta, correcta, b, sub_competencia)
 * @param {string} params.opcionSeleccionada - Opción elegida por el alumno (ej. "C" o texto)
 * @param {number} params.tiempoRespuestaSec - Tiempo en segundos dedicado al reactivo
 * @param {Object} [params.perfilConductual] - Métricas de conducta (impulsivo, bloqueado, excesoConfianza)
 * @param {string} [params.targetExam] - Nombre del examen ('SABER_11', 'UNAL_GENERAL', etc.)
 * @param {number} [params.nivelSolicitado] - Nivel progresivo (1: Premisa orientadora, 2: Anatomía distractor, 3: Completo)
 * @returns {Promise<{ explicacion: string, esFallback: boolean, duracionMs: number }>}
 */
export async function generarExplicacionSocratica({ 
    item, 
    opcionSeleccionada = 'A', 
    tiempoRespuestaSec = 15, 
    perfilConductual = {}, 
    targetExam = 'SABER_11', 
    numeroIntento = 1, 
    esReintento = false,
    nivelSolicitado = 1
}) {
    const inicioTs = Date.now();
    const esSegundoIntento = esReintento || (Number(numeroIntento) > 1);
    const nivelTarget = Number(nivelSolicitado) || (esSegundoIntento ? 2 : 1);

    // 1. Evaluación de Perfil Conductual del Gemelo Digital
    const tiempo = Number(tiempoRespuestaSec) || 15;
    const dificultadB = Number(item?.b || item?.parametro_b_dificultad || 0.0);
    
    const esImpulsivo = perfilConductual.impulsivo ?? (tiempo < 10);
    const esBloqueado = perfilConductual.bloqueado ?? (tiempo > 120);
    const esExcesoConfianza = perfilConductual.excesoConfianza ?? (dificultadB < -0.5);

    // 2. Construcción de Instrucciones de Conducta para el Prompt
    let guiaConductual = "";
    if (esSegundoIntento) {
        guiaConductual += "\n- 🔄 ADAPTACIÓN REINTENTO GUIADO (SEGUNDO INTENTO): Es el segundo fallo del alumno en esta pregunta. Proporciona un andamiaje más directo sin revelar la respuesta. Aplica técnica de descarte binario (50/50).";
    }
    if (esImpulsivo) {
        guiaConductual += "\n- ⚠️ ADAPTACIÓN GEMELO DIGITAL (IMPULSIVIDAD): El estudiante respondió demasiado rápido (<10s). Recomienda amablemente una pausa de lectura consciente antes de decidir.";
    } else if (esBloqueado) {
        guiaConductual += "\n- ⚠️ ADAPTACIÓN GEMELO DIGITAL (PARÁLISIS POR ANÁLISIS / BLOQUEO): El estudiante demoró bastante (>120s). Usa un tono empático y descompone el problema en un primer paso sencillo.";
    }
    if (esExcesoConfianza) {
        guiaConductual += "\n- ⚠️ ADAPTACIÓN GEMELO DIGITAL (EXCESO DE CONFIANZA): El estudiante falló un reactivo de dificultad accesible. Evidencia constructivamente la trampa lógica de la opción que eligió.";
    }

    // 3. Prompt de Sistema Progresivo según el Nivel Solicitado
    let systemInstruction = "";

    if (nivelTarget === 1) {
        systemInstruction = `
Eres el Tutor Socrático de Dante OS especializado en evaluaciones de ingreso a educación superior (${targetExam}).
Tu misión es formular ÚNICAMENTE una PREGUNTA REFLEXIVA ORIENTADORA (Nivel 1: Premisa Central) basada estrictamente en el texto, datos, tabla, ecuación o gráfico que el alumno tiene en pantalla.

OBJETIVO PEDAGÓGICO:
Desbloquear el pensamiento crítico del estudiante orientándolo hacia la condición clave, variable constante o tesis del enunciado SIN resolver el ejercicio y SIN analizar distractores aún.

FORMATO OBLIGATORIO (Máximo 65 palabras, en español formal colombiano):
🔍 **Pista Socrática (Premisa Central):** [Tu pregunta orientadora y reflexión socrática contextualizada al problema exacto].

GUARDARRAÍLES INNEGOCIABLES:
1. Jamás menciones la letra o texto de la respuesta correcta ni de las opciones.
2. NO vuelques Nivel 2 ni Nivel 3. Responde estrictamente con la pista reflexiva del Nivel 1.
3. Prohibido usar terminología médica o clínica.
4. Totalmente prohibido responder en inglés o usar plantillas genéricas. Responde 100% en español formal de Colombia refiriéndote a los datos precisos del reactivo en pantalla.
`;
    } else if (nivelTarget === 2) {
        systemInstruction = `
Eres el Tutor Socrático y Analista de Distractores de Dante OS para ${targetExam}.
El estudiante ha seleccionado preliminarmente la opción '${opcionSeleccionada}' y solicita profundizar en el razonamiento de esta alternativa con andamiaje progresivo de Nivel 2.

OBJETIVO PEDAGÓGICO:
Proporcionar andamiaje progresivo que mantenga la premisa central (Nivel 1) y explique con precisión psicométrica por qué la opción '${opcionSeleccionada}' puede ser una trampa clásica de distractor en el examen (Nivel 2: sesgo de extrapolación, lectura literal, inversión operacional, confusión de unidades o causa-efecto).

FORMATO OBLIGATORIO (Máximo 95 palabras, en español formal colombiano):
🔍 **Pista Socrática (Premisa Central):** [Tu premisa reflexiva orientadora contextualizada].
🎯 **Anatomía de la Opción '${opcionSeleccionada}':** [Explicación del sesgo o trampa cognitiva de esta opción y pregunta de verificación frente al enunciado].

GUARDARRAÍLES INNEGOCIABLES:
1. Jamás digas cuál es la respuesta correcta ni reveles la clave.
2. Mantén el andamiaje progresivo reflexivo (Premisa Central + Anatomía de la opción '${opcionSeleccionada}'). NO reveles la solución completa ni Nivel 3.
3. Prohibido usar terminología médica o clínica.
4. Totalmente prohibido responder en inglés o usar textos genéricos desfasados. Responde 100% en español formal colombiano analizando el distractor frente a este reactivo.
`;
    } else {
        systemInstruction = `
Eres el Tutor Socrático y Analista Metacognitivo de Dante OS para ${targetExam}.
Proporciona la retroalimentación formativa estructurada en 3 niveles (Máximo 150 palabras):
🔍 **Nivel 1 (Premisa Central):** Condición clave o premisa esencial del reactivo.
🎯 **Nivel 2 (Anatomía del Distractor '${opcionSeleccionada}'):** Trampa cognitiva o error de interpretación de la opción seleccionada.
🧠 **Nivel 3 (Concepto Profundo & Descarte):** Principio teórico y estrategia para descartar las alternativas incompatibles.

GUARDARRAÍLES:
1. Jamás menciones la respuesta correcta en la primera línea.
2. Brevedad cognitiva máxima 150 palabras.
3. Cero terminología médica o clínica.
`;
    }

    const opcionesTexto = Array.isArray(item?.opciones_respuesta || item?.opciones)
        ? JSON.stringify(item?.opciones_respuesta || item?.opciones)
        : JSON.stringify(item?.opciones || {});

    const promptUsuario = `
DATOS DEL REACTIVO EXACTO EN PANTALLA:
- Enunciado / Contexto: "${item?.pregunta_texto || item?.enunciado || item?.texto || item?.pregunta || 'Pregunta de evaluación'}"
- Área / Competencia: "${item?.area_general || item?.area || item?.materia || 'Razonamiento Cuantitativo'}" - "${item?.sub_competencia || item?.competencia || 'Competencia Adaptativa'}"
- Opciones Disponibles: ${opcionesTexto}
- Opción Seleccionada por Alumno: "${opcionSeleccionada}"
- Nivel Solicitado: Nivel ${nivelTarget}
- Tiempo de lectura: ${tiempo} segundos
${guiaConductual}

Genera la respuesta socrática correspondiente estrictamente al Nivel ${nivelTarget}.
`;

    // 4. Invocación con Gemini API con Promise.race y timeout estricto de SLA
    let timerId = null;
    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) {
            console.log("ℹ️ [AI TUTOR]: Sin GEMINI_API_KEY configurada. Activando fallback socrático determinístico instantáneo.");
            return generarFallbackSocratico(item, opcionSeleccionada, { esImpulsivo, esBloqueado, esExcesoConfianza }, inicioTs, esSegundoIntento, nivelTarget);
        }

        const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build'
                }
            }
        });

        const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

        const geminiPromise = ai.models.generateContent({
            model: modelName,
            contents: promptUsuario,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 0.95
            }
        });

        const timeoutPromise = new Promise((_, reject) => {
            timerId = setTimeout(() => reject(new Error("Timeout Exceeded (>2800ms SLA)")), 2800);
        });

        const response = await Promise.race([geminiPromise, timeoutPromise]);
        if (timerId) clearTimeout(timerId);

        const textoGenerado = response?.text?.trim();

        if (textoGenerado && textoGenerado.length > 15) {
            return {
                explicacion: textoGenerado,
                esFallback: false,
                duracionMs: Date.now() - inicioTs
            };
        } else {
            throw new Error("Respuesta de Gemini vacía o inválida");
        }

    } catch (err) {
        if (timerId) clearTimeout(timerId);
        console.warn(`⚠️ [AI TUTOR FALLBACK TRIGGERED] (${err.message}): Generando respuesta determinística resguardada en <3s.`);
        return generarFallbackSocratico(item, opcionSeleccionada, { esImpulsivo, esBloqueado, esExcesoConfianza }, inicioTs, esSegundoIntento, nivelTarget);
    }
}

/**
 * Generador determinístico socrático de respaldo progresivo en caso de latencia o falta de API key
 */
function generarFallbackSocratico(item, opcionSeleccionada, { esImpulsivo, esBloqueado, esExcesoConfianza }, inicioTs, esSegundoIntento = false, nivelTarget = 1) {
    const areaGeneral = (item?.area_general || item?.area || item?.materia || '').toLowerCase();

    let prefacioImpulso = "";
    if (esSegundoIntento) {
        prefacioImpulso = "🔄 [Reintento Guiado 50/50] ";
    } else if (esImpulsivo) {
        prefacioImpulso = "⏱️ (Lectura veloz <10s) ";
    } else if (esBloqueado) {
        prefacioImpulso = "⏱️ (Análisis extenso >120s) ";
    } else if (esExcesoConfianza) {
        prefacioImpulso = "⚡ (Alerta de trampa en reactivo directo) ";
    }

    let nivel1 = "";
    let nivel2 = "";
    let nivel3 = "";

    if (areaGeneral.includes('lectura') || areaGeneral.includes('lenguaje') || areaGeneral.includes('textual') || areaGeneral.includes('humanidades') || areaGeneral.includes('espanol') || areaGeneral.includes('español')) {
        nivel1 = `🔍 **Pista Socrática (Premisa Central):** ${prefacioImpulso}¿Cuál es la tesis explícita del autor o la intención comunicativa principal del texto antes de responder? Revisa los conectores lógicos clave del párrafo central.`;
        nivel2 = `🎯 **Anatomía de la Opción '${opcionSeleccionada}':** La opción '${opcionSeleccionada}' es una trampa de extrapolación muy común en el examen. Atrae porque menciona términos del texto pero afirma algo que el autor jamás respaldó.`;
        nivel3 = `🧠 **Nivel 3 (Concepto Profundo & Estrategia de Descarte):** En lectura inferencial, toda conclusión debe basarse en evidencias textuales directas. **Estrategia de descarte:** Elimina de inmediato las opciones que contengan juicios de valor absolutos ('siempre', 'nunca') o suposiciones no presentes en la lectura.`;
    } else if (areaGeneral.includes('mate') || areaGeneral.includes('razonamiento') || areaGeneral.includes('cuantitativo') || areaGeneral.includes('logico') || areaGeneral.includes('calculo') || areaGeneral.includes('geometria')) {
        nivel1 = `🔍 **Pista Socrática (Premisa Central):** ${prefacioImpulso}¿Qué variables o magnitudes cuantitativas se relacionan en el problema y qué unidades de medida exige la solución? Identifica la razón o proporción constante.`;
        nivel2 = `🎯 **Anatomía de la Opción '${opcionSeleccionada}':** La opción '${opcionSeleccionada}' es un distractor operacional típico del examen. Suele aparecer cuando se ejecuta una operación aritmética básica saltándose una conversión intermedia o la inversión de un despeje.`;
        nivel3 = `🧠 **Nivel 3 (Concepto Profundo & Estrategia de Descarte):** Exige verificar la equivalencia algebraica y consistencia de proporciones. **Estrategia de descarte:** Reemplaza valores límite en el modelo numérico para descartar opciones que violen las restricciones de dominio o escala.`;
    } else if (areaGeneral.includes('social') || areaGeneral.includes('ciudadana') || areaGeneral.includes('filosofia') || areaGeneral.includes('historia')) {
        nivel1 = `🔍 **Pista Socrática (Premisa Central):** ${prefacioImpulso}¿Qué marco constitucional, derecho fundamental o perspectiva de los actores involucrados está en juego? Pondera los intereses en conflicto.`;
        nivel2 = `🎯 **Anatomía de la Opción '${opcionSeleccionada}':** La opción '${opcionSeleccionada}' representa un distractor de opinión subjetiva o sesgo ideológico. Evalúa si el estudiante confunde una opinión personal con una solución constitucional válida.`;
        nivel3 = `🧠 **Nivel 3 (Concepto Profundo & Estrategia de Descarte):** En competencias ciudadanas, la solución debe ponderar los derechos sin violar la Constitución de 1991. **Estrategia de descarte:** Elimina soluciones que propongan medidas autoritarias, discriminatorias o ilegales fuera del marco institucional.`;
    } else if (areaGeneral.includes('ciencia') || areaGeneral.includes('natural') || areaGeneral.includes('fisica') || areaGeneral.includes('física') || areaGeneral.includes('quimica') || areaGeneral.includes('química') || areaGeneral.includes('biologia') || areaGeneral.includes('biología')) {
        nivel1 = `🔍 **Pista Socrática (Premisa Central):** ${prefacioImpulso}En la gráfica o experimento presentado, ¿cuál es la variable independiente que se manipula y cuál es la variable dependiente observada?`;
        nivel2 = `🎯 **Anatomía de la Opción '${opcionSeleccionada}':** La opción '${opcionSeleccionada}' refleja una trampa de confusión entre correlación y causalidad. Es una opción común cuando se asume un efecto sin analizar el grupo de control.`;
        nivel3 = `🧠 **Nivel 3 (Concepto Profundo & Estrategia de Descarte):** En el método científico, toda hipótesis debe estar respaldada por las leyes de conservación y comportamiento del fenómeno. **Estrategia de descarte:** Descarta cualquier opción que afirme una tendencia opuesta a la evidencia de los datos experimentales.`;
    } else if (areaGeneral.includes('ingles') || areaGeneral.includes('inglés') || areaGeneral.includes('english')) {
        nivel1 = `🔍 **Pista Socrática (Premisa Central):** ${prefacioImpulso}Identify the communicative context, tone, and grammatical tense of the interaction before selecting an answer. What is the speaker's main intent?`;
        nivel2 = `🎯 **Anatomía de la Opción '${opcionSeleccionada}':** La opción '${opcionSeleccionada}' suele ser un falso cognado o un distractor que confunde tiempos verbales o colocaciones idiomáticas comunes en la prueba.`;
        nivel3 = `🧠 **Nivel 3 (Concepto Profundo & Estrategia de Descarte):** En la sección de inglés, verifica la coherencia pragmática y sintáctica de la conversación completa. **Estrategia de descarte:** Descarta alternativas con incoherencia de concordancia o vocabulario fuera de contexto.`;
    } else {
        // Áreas generales / idiomas / imagen espacial
        nivel1 = `🔍 **Pista Socrática (Premisa Central):** ${prefacioImpulso}¿Cuál es la función sintáctica, el sentido global o la relación de simetría y perspectiva que exige el reactivo? Identifica el patrón invariante antes de elegir.`;
        nivel2 = `🎯 **Anatomía de la Opción '${opcionSeleccionada}':** La opción '${opcionSeleccionada}' actúa como un distractor de similitud superficial o falso patrón. Resulta atractiva visualmente pero quiebra la coherencia de la regla principal.`;
        nivel3 = `🧠 **Nivel 3 (Concepto Profundo & Estrategia de Descarte):** La precisión del razonamiento exige descartar opciones que alteren las relaciones estructurales o agreguen elementos no justificados.`;
    }

    let textoFallback = nivel1;
    if (nivelTarget === 2) {
        textoFallback = `${nivel1}\n\n${nivel2}`;
    } else if (nivelTarget >= 3) {
        const explicacionBase = item?.explicacion_detallada || item?.atajo_tactico || item?.explicacion || '';
        const addendumBase = explicacionBase ? `\n\n📌 **Solución Paso a Paso:** ${explicacionBase}` : '';
        textoFallback = `${nivel1}\n\n${nivel2}\n\n${nivel3}${addendumBase}`;
    }

    return {
        explicacion: textoFallback,
        esFallback: true,
        duracionMs: Date.now() - inicioTs
    };
}

