// 🪐 seeder.js - Inyector Psicométrico Realista con Matriz Q y Mapa de Trampas
// Dante OS Enterprise Edition // Bogotá, Colombia
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

const INSTITUTION_ID = 'colegio_sandbox_default';

// ====================================================================
// 🧠 BANCO MAESTRO DE REACTIVOS CONTEXTUALIZADOS ESTILO ICFES (SABER 11)
// ====================================================================
const REACTIVOS_REALES = [
    // ----------------------------------------------------------------
    // 📐 MATEMÁTICAS (Álgebra, Geometría y Estadística)
    // ----------------------------------------------------------------
    {
        area: 'matematicas', sub: 'algebra',
        texto: "Una empresa de transporte masivo en Bogotá cobra una tarifa base de $3.000 COP por pasaje, más un recargo de $150 COP por kilómetro recorrido en rutas zonales. Si un usuario tiene un saldo disponible de $50.000 COP en su tarjeta, ¿cuál de las siguientes ecuaciones modela el saldo remanente S en función de los kilómetros k recorridos?",
        opciones: ["A) S = 50.000 - 3.150k", "B) S = 50.000 - (3.000 + 150k)", "C) S = 3.000k + 150 - 50.000", "D) S = 47.000 - 150k"],
        ok: "B", a: 1.45, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'algebra',
        texto: "Un tanque de reserva de agua potable en un colegio contiene 1.200 litros. Debido a un mantenimiento, se abre una válvula de desagüe que libera agua a una tasa constante de 40 litros por minuto. ¿En cuánto tiempo el tanque conservará exactamente un tercio de su capacidad inicial?",
        opciones: ["A) 10 minutos", "B) 20 minutos", "C) 30 minutos", "D) 40 minutos"],
        ok: "B", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'geometria',
        texto: "El Ministerio de Vivienda proyecta un terreno rectangular para una cancha comunitaria con un área total de 108 m². Por especificaciones del diseño, el largo del lote debe ser el triple de su ancho. Si se va a instalar un cerramiento con malla metálica en todo el borde exterior, ¿cuántos metros de malla se deben comprar?",
        opciones: ["A) 12 metros", "B) 24 metros", "C) 48 metros", "D) 72 metros"],
        ok: "C", a: 1.85, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    {
        area: 'matematicas', sub: 'geometria',
        texto: "Un diseñador industrial duplica la longitud del radio de una tubería cilíndrica de sección circular. Al comparar la nueva área transversal con la original, la superficie de corte disponible:",
        opciones: ["A) Se duplica exactamente (factor 2x)", "B) Se triplica (factor 3x)", "C) Se cuadruplica (factor 4x)", "D) Permanece inalterada"],
        ok: "C", a: 1.50, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'estadistica',
        texto: "Un estudio del DANE señala que el 30% de los jóvenes en la región Andina consulta noticias a través de aplicaciones móviles. Si se encuesta al azar y de forma independiente a dos estudiantes de un colegio, ¿cuál es la probabilidad porcentual de que ambos prefieran este medio digital?",
        opciones: ["A) 9%", "B) 15%", "C) 30%", "D) 60%"],
        ok: "A", a: 1.70, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // ----------------------------------------------------------------
    // 📖 LECTURA CRÍTICA (Filosofía, Textos Argumentativos y Sintaxis)
    // ----------------------------------------------------------------
    {
        area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un editorialista escribe: 'Si bien la tecnología fomenta la interconexión global, su uso desmedido en adolescentes erosiona la capacidad de sostener atención prolongada en lecturas complejas'. ¿Cuál de las siguientes afirmaciones sintetiza la tesis central del autor?",
        opciones: ["A) La tecnología debe prohibirse en entornos educativos.", "B) La conectividad digital tiene consecuencias negativas en los hábitos cognitivos de lectura.", "C) Los adolescentes leen más libros impresos hoy que en décadas pasadas.", "D) La atención prolongada es una cualidad innata que no se altera con la tecnología."],
        ok: "B", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'filosofia',
        texto: "En el Mito de la Caverna de Platón, los prisioneros confunden las sombras proyectadas en la pared con la realidad verdadera. En el contexto filosófico, las sombras representan:",
        opciones: ["A) El conocimiento empírico derivado de las percepciones sensoriales engañosas.", "B) La verdad absoluta alcanzada mediante la razón pura.", "C) Las leyes científicas comprobadas en laboratorios.", "D) Las ideas abstractas e inmutables del mundo inteligible."],
        ok: "A", a: 1.80, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // ----------------------------------------------------------------
    // 🧪 CIENCIAS NATURALES (Física, Química y Biología)
    // ----------------------------------------------------------------
    {
        area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un vehículo reduce su velocidad uniformemente de 24 m/s a 0 m/s en un intervalo de 6 segundos al aproximarse a un semáforo. La magnitud de su desaceleración constante es de:",
        opciones: ["A) 4 m/s²", "B) 8 m/s²", "C) 144 m/s²", "D) 24 m/s²"],
        ok: "A", a: 1.40, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // ----------------------------------------------------------------
    // 🇬🇧 INGLÉS (Vocabulario y Comprensión)
    // ----------------------------------------------------------------
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete the sentence with the correct grammatical option: 'If students __________ more attention during classes, they would pass the national exams with higher scores.'",
        opciones: ["A) pay", "B) paid", "C) will pay", "D) have paid"],
        ok: "B", a: 1.50, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

async function sembrarBancoSoberano() {
    console.log("🚀 [SIEMBRA DANTE OS]: Limpiando tablas e inyectando reactivos contextualizados...");

    try {
        // 1. Limpieza de tablas dependientes
        await supabase.from('mapa_trampas_distractores').delete().neq('opcion_marcada', 'CLEAN_ALL');
        await supabase.from('matriz_q_items').delete().neq('attr_heuristica_lineal', -999);
        await supabase.from('banco_items_irt').delete().neq('area_general', 'CLEAN_ALL');

        console.log("🧹 Tablas purgadas con éxito.");

        // 2. Inserción transaccional de ítems reales
        for (const item of REACTIVOS_REALES) {
            const itemId = crypto.randomUUID();

            // Insertar en banco_items_irt
            const { error: errBase } = await supabase.from('banco_items_irt').insert([{
                id: itemId,
                area_general: item.area,
                sub_competencia: item.sub,
                pregunta_texto: item.texto,
                opciones_respuesta: item.opciones,
                correcta: item.ok,
                parametro_a_discriminacion: item.a,
                parametro_b_dificultad: item.b,
                parametro_c_adivinacion: item.c
            }]);

            if (errBase) throw new Error(`Error en banco_items_irt: ${errBase.message}`);

            // Insertar en matriz_q_items
            const { error: errQ } = await supabase.from('matriz_q_items').insert([{
                item_id: itemId,
                attr_heuristica_lineal: item.q.attr_heuristica_lineal,
                attr_inversion_operacional: item.q.attr_inversion_operacional,
                attr_omision_conversion: item.q.attr_omision_conversion,
                attr_error_geometrico: item.q.attr_error_geometrico
            }]);

            if (errQ) throw new Error(`Error en matriz_q_items: ${errQ.message}`);

            // Insertar mapa de trampas
            for (const trampa of item.trampas) {
                const { error: errTrampa } = await supabase.from('mapa_trampas_distractores').insert([{
                    item_id: itemId,
                    opcion_marcada: trampa.opcion,
                    vulnera_heuristica_lineal: trampa.vulnera_heuristica_lineal,
                    vulnera_inversion_operacional: trampa.vulnera_inversion_operacional,
                    vulnera_omision_conversion: trampa.vulnera_omision_conversion,
                    vulnera_error_geometrico: trampa.vulnera_error_geometrico
                }]);

                if (errTrampa) throw new Error(`Error en mapa_trampas: ${errTrampa.message}`);
            }

            console.log(`✅ Ítem sembrado de forma íntegra: [${item.area.toUpperCase()} // ${item.sub.toUpperCase()}] -> UUID: ${itemId}`);
        }

        console.log("\n🎉 [SIEMBRA COMPLETADA]: Banco de preguntas real indexado en Supabase con éxito.");
        process.exit(0);

    } catch (err) {
        console.error("🚨 [CRITICAL SEEDER ERROR]:", err.message);
        process.exit(1);
    }
}

sembrarBancoSoberano();
