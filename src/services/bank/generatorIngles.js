// 🇬🇧 src/services/bank/generatorIngles.js - Generador & Calibrador Masivo de Inglés
// Dante OS Enterprise Edition - ICFES Saber 11 (1,000 Ítems Adicionales)

import { conAyuda } from './ponerAyuda.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">${content}</svg>`;

const CONTEXTOS_INGLES = [
    { topic: 'Environmental Conservation', location: 'National Park', sign: 'DO NOT FEED THE WILD ANIMALS' },
    { topic: 'Public Transportation', location: 'Train Station', sign: 'STAND BEHIND THE YELLOW LINE' },
    { topic: 'Library Rules', location: 'University Library', sign: 'SILENCE IS REQUIRED AT ALL TIMES' },
    { topic: 'Airport Security', location: 'International Terminal', sign: 'KEEP YOUR LUGGAGE WITH YOU' },
    { topic: 'Health and Wellness', location: 'Fitness Center', sign: 'WIPE DOWN EQUIPMENT AFTER USE' },
    { topic: 'Technology and Innovation', location: 'Co-working Space', sign: 'FREE HIGH-SPEED WI-FI AVAILABLE' }
];

export function generarReactivosInglesMasivos(count = 1000) {
    const reactivos = [];

    const subdisciplinas = [
        'vocabulary', 
        'signs_notices', 
        'dialogues', 
        'literal_reading', 
        'lexical_cloze', 
        'inferential_reading', 
        'grammar_reading'
    ];

    for (let i = 1; i <= count; i++) {
        const sub = subdisciplinas[i % subdisciplinas.length];
        const ctx = CONTEXTOS_INGLES[i % CONTEXTOS_INGLES.length];
        const itemId = `item_ing_gen_${String(i).padStart(4, '0')}`;

        // Parámetros IRT 3PL
        const b = Number((-2.5 + ((i * 0.005) % 5.0)).toFixed(2));
        const a = Number((1.1 + ((i * 0.0025) % 0.85)).toFixed(2));
        const c = 0.20;

        let item = null;

        if (sub === 'signs_notices') {
            item = {
                id: itemId,
                area: 'ingles',
                sub: 'signs_notices',
                texto: `Where can you usually see this notice or sign?\n\n"${ctx.sign}"`,
                recurso_visual: generateSVG(`<rect x="40" y="40" width="320" height="120" fill="%23f1c40f" rx="10"/><text x="50" y="110" fill="%230d0f14" font-size="16" font-weight="bold">${ctx.sign}</text>`),
                opciones: [
                    `A) At a ${ctx.location}.`,
                    `B) Inside a private swimming pool.`,
                    `C) On a cinema ticket stub.`,
                    `D) At a bakery counter.`
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
                pista: 'El aviso nombra una regla de un lugar. No lo pongas en una piscina, un cine o una panadería.',
                frase: `Ese aviso se ve en un ${ctx.location}.`,
                repaso: 'Avisos',
                razones: {
                    'Inside a private swimming pool.': 'Una piscina privada no es el lugar de esa regla.',
                    'On a cinema ticket stub.': 'Un tiquete de cine no lleva ese aviso.',
                    'At a bakery counter.': 'Una panadería no pide esa norma.'
                }
            });
        } else if (sub === 'dialogues') {
            item = {
                id: itemId,
                area: 'ingles',
                sub: 'dialogues',
                texto: `Complete the conversational dialogue naturally:\n\nPerson A: "Excuse me, do you know how often the bus arrives at this stop regarding ${ctx.topic}?"\nPerson B: "____"`,
                recurso_visual: null,
                opciones: [
                    `A) "Yes, it usually passes by every fifteen minutes during peak hours."`,
                    `B) "I prefer eating lunch at two o'clock today."`,
                    `C) "The weather was very cold last night."`,
                    `D) "No, I haven't bought any shoes recently."`
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
                pista: 'La pregunta es cada cuánto pasa el bus. La respuesta tiene que hablar del bus, no del almuerzo, el clima o los zapatos.',
                frase: 'La respuesta que habla del bus dice que pasa cada quince minutos.',
                repaso: 'Diálogos',
                razones: {
                    '"I prefer eating lunch at two o\'clock today."': 'Habla del almuerzo y no responde cada cuánto pasa el bus.',
                    '"The weather was very cold last night."': 'Habla del clima y no del bus.',
                    '"No, I haven\'t bought any shoes recently."': 'Habla de zapatos y no del bus.'
                }
            });
        } else if (sub === 'vocabulary') {
            item = {
                id: itemId,
                area: 'ingles',
                sub: 'vocabulary',
                texto: `Read the definition and choose the matching word:\n\n"A document or digital pass that allows a person to enter a restricted area or attend an event at a ${ctx.location}."`,
                recurso_visual: null,
                opciones: [
                    `A) Ticket / Pass`,
                    `B) Recipe`,
                    `C) Calendar`,
                    `D) Dictionary`
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
                pista: `La definición es un documento para entrar a un lugar. No es de cocina, ni de fechas, ni de significados.`,
                frase: 'Ese documento para entrar es un pase.',
                repaso: 'Vocabulario',
                razones: {
                    'Recipe': 'Una receta es de cocina, no un documento para entrar.',
                    'Calendar': 'Un calendario marca fechas, no deja entrar.',
                    'Dictionary': 'Un diccionario explica palabras, no es un pase.'
                }
            });
        } else if (sub === 'literal_reading' || sub === 'inferential_reading') {
            item = {
                id: itemId,
                area: 'ingles',
                sub: sub,
                texto: `Read the short passage:\n\n"Recent developments in ${ctx.topic} at the local ${ctx.location} have significantly improved overall efficiency. Researchers found that adopting modern technology reduced operational delays by 35% over six months."\n\nWhat is the main finding reported in the passage?`,
                recurso_visual: null,
                opciones: [
                    `A) Modern technology successfully reduced operational delays by 35%.`,
                    `B) Operational costs increased dramatically due to administrative errors.`,
                    `C) All staff members decided to quit their jobs at the facility.`,
                    `D) The facility was permanently closed down after two weeks.`
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
                pista: 'El dato del párrafo es una baja de demoras. Las otras opciones inventan un alza de costos, una renuncia o un cierre.',
                frase: 'El párrafo dice que la tecnología bajó las demoras un 35%.',
                repaso: 'Lectura',
                razones: {
                    'Operational costs increased dramatically due to administrative errors.': 'Inventa un alza de costos. El párrafo habla de menos demoras.',
                    'All staff members decided to quit their jobs at the facility.': 'Inventa una renuncia del personal que el párrafo no dice.',
                    'The facility was permanently closed down after two weeks.': 'Inventa un cierre. El párrafo habla de una mejora.'
                }
            });
        } else {
            // grammar_reading / lexical_cloze
            item = {
                id: itemId,
                area: 'ingles',
                sub: sub,
                texto: `Select the grammatically correct option to complete the text:\n\n"If the team _____ implemented the new safety protocols earlier at the ${ctx.location}, the incident could have been completely avoided."`,
                recurso_visual: null,
                opciones: [
                    `A) had`,
                    `B) has`,
                    `C) will have`,
                    `D) is`
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
                pista: 'could have been pide un pasado anterior al otro pasado. No uses presente ni futuro.',
                frase: 'El hueco pide had: el equipo no lo hizo antes.',
                repaso: 'Gramática',
                razones: {
                    'has': 'has es presente perfecto. La frase mira un pasado que ya no se puede cambiar.',
                    'will have': 'will have es futuro. El incidente ya quedó atrás.',
                    'is': 'is es presente. No encaja con could have been.'
                }
            });
        }

        reactivos.push(item);
    }

    return reactivos;
}
