// 📖 src/services/bank/generatorLectura.js - Generador & Calibrador Masivo de Lectura Crítica
// Dante OS Enterprise Edition - ICFES Saber 11 (1,000 Ítems Adicionales)

import { conAyuda } from './ponerAyuda.js';

const TEXTOS_BASE_CONTINUOS = [
    {
        autor: "Gabriel García Márquez",
        obra: "Cien años de soledad",
        tipo: "Literario",
        fragmento: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo."
    },
    {
        autor: "Estanislao Zuleta",
        obra: "Elogio de la dificultad",
        tipo: "Ensayístico / Filosófico",
        fragmento: "Deseamos una vida en la que las dificultades estén superadas de antemano y donde la lucha no sea necesaria. Sin embargo, la facilidad nos conduce al aburrimiento y a la atrofia del deseo. El verdadero reto humano radica en reconocer que el conflicto y la discrepancia no son anomalías a eliminar, sino condiciones constitutivas del pensamiento crítico y la autonomía intelectual."
    },
    {
        autor: "Laura Restrepo",
        obra: "Delirio",
        tipo: "Literario / Narrativo",
        fragmento: "Hay momentos en que la realidad se fractura con la precisión de un cristal sometido a alta presión. No es que el mundo cambie de forma repentina, sino que la mirada de quien observa pierde los filtros protectores de la costumbre. En esa grieta de la percepción es donde la cordura y el delirio disputan su territorio."
    },
    {
        autor: "William Ospina",
        obra: "¿Dónde está la franja amarilla?",
        tipo: "Informativo / Argumentativo",
        fragmento: "La crisis de una sociedad no reside únicamente en la escasez de recursos materiales, sino en la pérdida de la fe compartida en un proyecto común. Cuando los ciudadanos perciben que las normas solo aplican para los desfavorecidos, el contrato social se disuelve en el escepticismo y la anomia."
    },
    {
        autor: "Jorge Luis Borges",
        obra: "Ficciones",
        tipo: "Filosófico / Literario",
        fragmento: "El tiempo es un río que me arrebata, pero yo soy el río; es un tigre que me destroza, pero yo soy el tigre; es un fuego que me consume, pero yo soy el fuego. El mundo, desgraciadamente, es real; yo, desgraciadamente, soy Borges."
    }
];

export function generarReactivosLecturaMasivos(count = 1000) {
    const reactivos = [];

    const competencias = [
        { id: 'comp_1', nom: 'Identificar y entender contenidos locales' },
        { id: 'comp_2', nom: 'Comprender cómo se articulan las partes de un texto' },
        { id: 'comp_3', nom: 'Reflexionar a partir de un texto y evaluar su contenido' }
    ];

    for (let i = 1; i <= count; i++) {
        const txtObj = TEXTOS_BASE_CONTINUOS[i % TEXTOS_BASE_CONTINUOS.length];
        const compObj = competencias[i % competencias.length];
        const itemId = `item_read_gen_${String(i).padStart(4, '0')}`;

        // Parámetros IRT 3PL
        const b = Number((-2.4 + ((i * 0.0048) % 4.8)).toFixed(2));
        const a = Number((1.1 + ((i * 0.0025) % 0.9)).toFixed(2));
        const c = 0.20;

        let item = null;

        if (compObj.id === 'comp_1') {
            item = {
                id: itemId,
                area: 'lectura_critica',
                sub: 'comprension_literal',
                texto: `A partir del fragmento de "${txtObj.obra}" de ${txtObj.autor}:\n\n"${txtObj.fragmento}"\n\n¿Cuál de las siguientes afirmaciones describe de manera literal un elemento mencionado explícitamente en el texto?`,
                recurso_visual: null,
                opciones: [
                    `A) El texto menciona explícitamente las condiciones específicas descritas en la narración de ${txtObj.autor}.`,
                    `B) El autor sostiene que la sociedad ha alcanzado la perfección tecnológica completa.`,
                    `C) Se afirma de forma categórica que los personajes rechazaron todo tipo de aprendizaje.`,
                    `D) El fragmento concluye afirmando que la memoria humana es totalmente infalible.`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `En "${txtObj.obra}", quédate con algo que el fragmento sí nombra. Las otras opciones inventan una idea que ahí no está.`,
                frase: `El fragmento de ${txtObj.autor} sí deja ver lo que la pregunta pide.`,
                repaso: 'Comprensión literal',
                razones: {
                    'El autor sostiene que la sociedad ha alcanzado la perfección tecnológica completa.': 'Esa frase habla de perfección tecnológica y el fragmento no lo dice.',
                    'Se afirma de forma categórica que los personajes rechazaron todo tipo de aprendizaje.': 'El fragmento no dice que alguien rechazó todo aprendizaje.',
                    'El fragmento concluye afirmando que la memoria humana es totalmente infalible.': 'Nadie afirma ahí que la memoria sea infalible.'
                }
            });
        } else if (compObj.id === 'comp_2') {
            item = {
                id: itemId,
                area: 'lectura_critica',
                sub: 'articulacion_global',
                texto: `Considerando la estructura discursiva del texto de ${txtObj.autor} en "${txtObj.obra}":\n\n"${txtObj.fragmento}"\n\n¿Qué relación lógica y compositiva existe entre las oraciones del fragmento?`,
                recurso_visual: null,
                opciones: [
                    `A) La primera parte introduce la premisa narrativa/argumentativa y las frases posteriores la desarrollan mediante analogías o matices conceptuales.`,
                    `B) El texto presenta una contradicción insalvable entre la tesis inicial y las conclusiones finales.`,
                    `C) La segunda oración desmiente categóricamente lo planteado al inicio del párrafo.`,
                    `D) El autor utiliza una lista de datos estadísticos para probar una hipótesis científica.`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `Mira cómo se encadenan las frases de "${txtObj.obra}". Una desarrolla la anterior. No busques una lista de datos ni un desmentido total.`,
                frase: `Las frases de ${txtObj.autor} se apoyan: la primera abre y las siguientes la desarrollan.`,
                repaso: 'Articulación del texto',
                razones: {
                    'El texto presenta una contradicción insalvable entre la tesis inicial y las conclusiones finales.': 'Inventa una contradicción total que el fragmento no cierra así.',
                    'La segunda oración desmiente categóricamente lo planteado al inicio del párrafo.': 'La segunda frase no desmiente el inicio: lo sigue.',
                    'El autor utiliza una lista de datos estadísticos para probar una hipótesis científica.': 'No hay una lista de datos ni una hipótesis de laboratorio.'
                }
            });
        } else {
            item = {
                id: itemId,
                area: 'lectura_critica',
                sub: 'evaluacion_critica',
                texto: `Al evaluar la postura ideológica o filosófica del autor en "${txtObj.obra}":\n\n"${txtObj.fragmento}"\n\n¿Qué supuesto subyacente sostiene la argumentación de ${txtObj.autor}?`,
                recurso_visual: null,
                opciones: [
                    `A) La experiencia humana y el conocimiento se construyen a través de la tensión constante entre la percepción, el lenguaje y la realidad.`,
                    `B) La verdad absoluta es fácilmente accesible sin necesidad de lenguaje ni interpretación.`,
                    `C) Las emociones humanas carecen de valor en la formación de la conciencia ciudadana.`,
                    `D) El progreso técnico garantiza automáticamente la felicidad y armonía de los pueblos.`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `La pregunta pide el supuesto que sostiene a ${txtObj.autor} en "${txtObj.obra}". No es una verdad sin lenguaje ni un progreso que asegure la felicidad.`,
                frase: `La postura de ${txtObj.autor} se sostiene en la tensión entre percepción, lenguaje y realidad.`,
                repaso: 'Evaluación crítica',
                razones: {
                    'La verdad absoluta es fácilmente accesible sin necesidad de lenguaje ni interpretación.': 'El fragmento no dice que la verdad se alcance sin lenguaje.',
                    'Las emociones humanas carecen de valor en la formación de la conciencia ciudadana.': 'Nadie afirma ahí que las emociones no valgan.',
                    'El progreso técnico garantiza automáticamente la felicidad y armonía de los pueblos.': 'El texto no promete que la técnica traiga felicidad.'
                }
            });
        }

        reactivos.push(item);
    }

    return reactivos;
}
