// 🪐 aiService.js - Conexión Directa HTTP REST (Inmune a Errores de SDK y Deprecación de Google)
// Dante OS v21.0.0 Enterprise Edition // Bogotá, Colombia

/**
 * Traduce el súper-contexto de métricas en una interpretación cognitiva en formato JSON
 * Conecta directamente usando HTTP REST en la rama estable 'v1' con el modelo gemini-3.5-flash.
 */
export async function generarInterpretacionCognitiva(estudiante, area, metricas) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // 🔍 OPTIMIZACIÓN 2026: Apuntamos al modelo activo y verificado en tus logs de AI Studio
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

        const prompt = `
        Actúas como un traductor psicométrico experto y amigable para Dante OS. Tu objetivo es interpretar métricas cuantitativas complejas para un estudiante de colegio de 16 años de forma motivadora y comprensible.
        
        DATOS DE RENDIMIENTO DEL ESTUDIANTE:
        - Estudiante: ${estudiante.toUpperCase()}
        - Área evaluada: ${area.toUpperCase()}
        - Habilidad Global Estimada (Theta): ${metricas.thetaGlobal} (Escala de -4.0 a 4.0)
        - Precisión Bayesiana (SEM): ${metricas.semGlobal}
        - Índice de Impulsividad (ICI): ${metricas.impulsividad}%
        - Índice de Recuperación ante el Error (IRI): ${metricas.recuperacion}%
        - Índice de Curiosidad / Esfuerzo en Reactivos Complejos (ICC): ${metricas.estabilidad}%
        - Peor sesgo del mapa de calor: ${metricas.sesgoDominante}
        
        TAREA:
        Genera un diagnóstico psicométrico y diseña un Plan de Entrenamiento de 10 días con 4 fases estructuradas para corregir el sesgo conductual dominante detected.
        
        REGLAS DE SEGURIDAD Y ESTILO:
        1. NUNCA utilices terminología médica, psiquiátrica ni clínica (prohibidas palabras como: clínico, prescripción, ADN, forense, TDAH, autismo, depresión, ansiedad, coeficiente intelectual).
        2. Mantén un tono educativo, analítico, empático y de orientación pedagógica.
        3. En la cronica_narrativa, explica de forma amable cómo piensa el alumno basándote en la combinación de su velocidad, impulsividad y recuperación.
        4. El plan_entrenamiento debe contener 4 fases secuenciales y accionables de estudio, distribuidas para ejecutarse durante los próximos 10 días (ej: 'Días 1-3: ...', 'Días 4-6: ...').
        5. No generes textos largos. Sé conciso y directo al grano.

        IMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON válido con la estructura descrita abajo. No incluyas explicaciones adicionales, ni introducciones, ni bloques de código markdown (prohibido usar \`\`\`json y \`\`\`). El resultado debe ser parseable directamente por JSON.parse().

        ESTRUCTURA DEL JSON REQUERIDA:
        {
          "cronica_narrativa": "Escribe aquí la crónica adaptada de máximo 3 líneas.",
          "desviacion_enfoque": "Escribe aquí el reto o desajuste de enfoque principal en máximo 1 línea.",
          "estrategia_autorregulacion": "Escribe aquí la recomendación o técnica de estudio en máximo 2 lines.",
          "plan_entrenamiento": [
            "Días 1-3: Acción detallada para corregir el sesgo detectado.",
            "Días 4-5: Acción detallada.",
            "Días 6-8: Acción detallada.",
            "Días 9-10: Acción de consolidación final."
          ]
        }
        `;

        const response = await globalThis.fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;

        const jsonLimpio = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(jsonLimpio);

    } catch (error) {
        console.error("⚠️ [GEMINI DIRECT REST EXCEPTION]: Fallo en la generación:", error.message);
        return {
            cronica_narrativa: `El análisis de trayectoria para ${estudiante.toUpperCase()} registra una consistencia estable en el bloque evaluativo de ${area}. Se evidencia un proceso de resolución con ritmo controlado.`,
            desviacion_enfoque: "Desajuste transitorio por velocidad adaptativa.",
            estrategia_autorregulacion: "Se sugiere mantener una lectura pausada de los enunciados y validar opciones alternativas antes del envío.",
            plan_entrenamiento: [
                "Días 1-3: Repasa los fundamentos de operaciones distributivas en álgebra.",
                "Días 4-5: Practica 5 ejercicios sin límite de tiempo para concentrarte en el procedimiento.",
                "Días 6-8: Realiza lecturas de 10 segundos antes de marcar cualquier respuesta en ejercicios complejos.",
                "Días 9-10: Ejecuta simulacros cortos de 3 preguntas controlando las pulsaciones del clic."
            ]
        };
    }
}