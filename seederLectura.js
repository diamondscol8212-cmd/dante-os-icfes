import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 🛡️ LECTOR NATIVO INFALIBLE DE ARCHIVO .ENV
try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remover comillas si existen
                if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value.trim();
            }
        });
    }
} catch (envError) {
    console.warn("⚠️ No se pudo parsear el archivo .env de forma nativa, intentando con variables del sistema.");
}

// Inicialización limpia con las variables extraídas a la fuerza
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const reactivosLecturaCritica = [
    {
        materia: "lectura_critica",
        area_general: "comprension_textual",
        tipo_estimulo: "continuo_filosofico",
        texto_estimulo: "Considere el siguiente fragmento de Estanislao Zuleta: 'Elogio de la dificultad'. La democratización de la pereza intelectual es el síntoma definitivo de una sociedad que prefiere la comodidad del dogma sobre el esfuerzo de la crítica. Desear un mundo sin contradicciones, donde las respuestas precedan a las preguntas, es desear la muerte del pensamiento propio.",
        enunciado: "De acuerdo con el planteamiento de Zuleta, la existencia de un mundo sin contradicciones implicaría fundamentalmente:",
        dificultad_teorica_b_bayes: 0.75,
        opciones_reactivo: {
            opcion_correcta: {
                letra: "A",
                texto: "La anulación de la capacidad crítica y del desarrollo del pensamiento autónomo."
            },
            distractores_sesgos: [
                {
                    letra: "B",
                    texto: "La democratización de la pereza intelectual en toda la estructura social.",
                    sesgo_asociado: "attr_fuga_distractor_literal",
                    explicacion: "El alumno asume validez porque lee palabras textuales del estímulo sin procesar el núcleo ideológico."
                },
                {
                    letra: "C",
                    texto: "El advenimiento de una sociedad ideal libre de conflictos políticos dañinos.",
                    sesgo_asociado: "attr_sesgo_confirmacion",
                    explicacion: "El alumno superpone su deseo moral o ideológico personal por encima del nihilismo crítico del autor."
                },
                {
                    letra: "D",
                    texto: "El aislamiento absoluto de las preguntas respecto a las respuestas dogmáticas.",
                    sesgo_asociado: "attr_fallo_integracion_intertextual",
                    explicacion: "El estudiante invierte la relación causa-efecto planteada en la lógica secuencial del texto."
                }
            ]
        }
    },
    {
        materia: "lectura_critica",
        area_general: "comprension_textual",
        tipo_estimulo: "discontinuo_infografia",
        texto_estimulo: "[INFOGRAFÍA METRICAS DE CONSUMO DIGITAL BOGOTÁ 2026]: El 72% de la cohorte juvenil encuestada afirma que su principal fuente de noticias son videos de menos de 30 segundos en redes sociales. El estudio correlativo muestra una caída del 45% en la retención cronológica de lectura lineal a mediano plazo.",
        enunciado: "A partir de los datos presentados en la infografía, una conclusión coherente respecto al consumo de información actual es:",
        dificultad_teorica_b_bayes: 0.32,
        opciones_reactivo: {
            opcion_correcta: {
                letra: "C",
                texto: "La preferencia por formatos de consumo rápido correlaciona con la reducción de ciertas habilidades cognitivas de persistencia visual."
            },
            distractores_sesgos: [
                {
                    letra: "A",
                    texto: "El 72% de la cohorte juvenil encuestada afirma que su principal fuente de noticias son videos cortos.",
                    sesgo_asociado: "attr_fuga_distractor_literal",
                    explicacion: "Copia textual de un dato analítico sin elaborar la conclusión global solicitada por el enunciado."
                },
                {
                    letra: "B",
                    texto: "Las redes sociales destruyen activamente la mente de las nuevas generaciones en Bogotá.",
                    sesgo_asociado: "attr_sesgo_confirmacion",
                    explicacion: "Adopción de un juicio de valor generalizado o sesgo anti-redes no sustentado por la neutralidad del indicador."
                },
                {
                    letra: "D",
                    texto: "La retención cronológica lineal es la causa directa del auge de formatos multimedia de 30 segundos.",
                    sesgo_asociado: "attr_fallo_integracion_intertextual",
                    explicacion: "Incapacidad para interpretar la dirección de la correlación estadística entre las variables expuestas."
                }
            ]
        }
    }
];

async function sembrarBancoLecturaCritica() {
    console.log("🌱 [DANTE SEEDER]: Inicializando siembra en Supabase para el foso de Lectura Crítica...");
    
    const { data, error } = await supabase
        .from('banco_reactivos') 
        .insert(reactivosLecturaCritica);

    if (error) {
        console.error("🚨 [SEEDER ERROR]: Fallo al inyectar reactivos adaptativos:", error.message);
    } else {
        console.log("✅ [SEEDER SUCCESS]: Banco de Lectura Crítica inyectado con éxito. Datos comprometidos.");
    }
}

sembrarBancoLecturaCritica();