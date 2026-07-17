// seed_banco.js - Script de Inicialización de Contenido Psicométrico (Dante OS v17.5)
import { supabase } from './supabaseClient.js'; //  Sincronización correcta

const REACTIVOS_SEMILLA = [
    {
        area_general: "matematicas",
        sub_competencia: "algebra",
        pregunta_texto: "Un tanque de almacenamiento de combustible se llena a una tasa constante de 25 litros por minuto. Si inicialmente contenía 150 litros, ¿cuál de las siguientes ecuaciones lineales modela el volumen V en función del tiempo t en minutos?",
        // 🌟 REINGENIERÍA v17.0: Distractores reales inyectados como arreglo JSON directo
        opciones_respuesta: [
            "A) V = 150t + 25",
            "B) V = 25t + 150",
            "C) V = 25t - 150",
            "D) V = 175t"
        ],
        correcta: "B",
        // Parámetros psicométricos semilla estimadas por expertos (IRT)
        parametro_a_discriminacion: 1.45,  // Muy discriminativa (detecta rápido la habilidad)
        parametro_b_dificultad: -0.25,      // Dificultad media-baja (logit cercano a la media)
        parametro_c_adivinacion: 0.20,      // 4 opciones = probabilidad de adivinación teórica del 25%, penalizada a 20%
        // Matriz Q explícita para la capa de diagnóstico cognitivo (CDM)
        matriz_q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        // Mapa forense de trampas por distractor incorrecto
        trampas: [
            { opcion: "A", vulnera: "attr_inversion_operacional" }, // Invirtió variables de estado
            { opcion: "C", vulnera: "attr_heuristica_lineal" },     // Operación inversa por System 1
            { opcion: "D", vulnera: "attr_heuristica_lineal" }      // Suma lineal ingenua de constantes
        ]
    },
    {
        area_general: "matematicas",
        sub_competencia: "geometria",
        pregunta_texto: "Se requiere diseñar una zona rectangular de distribución en Bogotá que tenga exactamente 48 metros cuadrados de área. Si el largo de la zona debe ser tres veces el ancho, ¿cuál es el perímetro total de la estructura en metros?",
        opciones_respuesta: [
            "A) 32 metros",
            "B) 16 metros",
            "C) 24 metros",
            "D) 40 metros"
        ],
        correcta: "A",
        parametro_a_discriminacion: 1.85,  // Excelente discriminación estructural
        parametro_b_dificultad: 0.65,       // Dificultad media-alta (Logit positivo)
        parametro_c_adivinacion: 0.22,
        matriz_q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera: "attr_error_geometrico" },      // Calculó solo la mitad del perímetro
            { opcion: "C", vulnera: "attr_inversion_operacional" }, // Confundió factores algebraicos de escala
            { opcion: "D", vulnera: "attr_error_geometrico" }       // Error de cálculo perimetral plano
        ]
    }
];

async function sembrarEcosistema() {
    console.log("🚀 [SEEDER]: Iniciando siembra transaccional en Supabase...");

    for (const reactivo of REACTIVOS_SEMILLA) {
        try {
            // 1. Insertar el ítem psicométrico principal en banco_items_irt
            const { data: itemInsertado, error: errItem } = await supabase
                .from('banco_items_irt')
                .insert([{
                    area_general: reactivo.area_general,
                    sub_competencia: reactivo.sub_competencia,
                    pregunta_texto: reactivo.pregunta_texto,
                    opciones_respuesta: reactivo.opciones_respuesta,
                    correcta: reactivo.correcta,
                    parametro_a_discriminacion: reactivo.parametro_a_discriminacion,
                    parametro_b_dificultad: reactivo.parametro_b_dificultad,
                    parametro_c_adivinacion: reactivo.parametro_c_adivinacion
                }])
                .select('id')
                .single();

            if (errItem) throw errItem;
            const itemId = itemInsertado.id;
            console.log(`✅ Ítem inyectado de forma segura: ID [${itemId}]`);

            // 2. Insertar la Matriz Q asociada ligada por la FK item_id
            const { error: errQ } = await supabase
                .from('matriz_q_items')
                .insert([{
                    item_id: itemId,
                    attr_heuristica_lineal: reactivo.matriz_q.attr_heuristica_lineal,
                    attr_inversion_operacional: reactivo.matriz_q.attr_inversion_operacional,
                    attr_omision_conversion: reactivo.matriz_q.attr_omision_conversion,
                    attr_error_geometrico: reactivo.matriz_q.attr_error_geometrico
                }]);

            if (errQ) throw errQ;

            // 3. Insertar el mapa de trampas forenses de distractores
            for (const trampa of reactivo.trampas) {
                const { error: errTrampa } = await supabase
                    .from('mapa_trampas_distractores')
                    .insert([{
                        item_id: itemId,
                        opcion_marcada: trampa.opcion,
                        vulnera_heuristica_lineal: trampa.vulnera === 'attr_heuristica_lineal' ? 1 : 0,
                        vulnera_inversion_operacional: trampa.vulnera === 'attr_inversion_operacional' ? 1 : 0,
                        vulnera_omision_conversion: trampa.vulnera === 'attr_omision_conversion' ? 1 : 0,
                        vulnera_error_geometrico: trampa.vulnera === 'attr_error_geometrico' ? 1 : 0
                    }]);
                if (errTrampa) throw errTrampa;
            }
            console.log(`🎯 Matriz Q y Mapa de Trampas sincronizados para el Ítem [${itemId}]`);

        } catch (error) {
            console.error("🚨 [FALLO CRÍTICO DE SIEMBRA]:", error);
        }
    }
    console.log("🏁 [SEEDER]: Proceso de siembra finalizado con éxito militar.");
}

sembrarEcosistema();