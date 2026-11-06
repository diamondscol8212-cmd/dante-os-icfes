// 🧪 src/services/bank/generatorCiencias.js - Generador & Calibrador Masivo de Ciencias Naturales
// Dante OS Enterprise Edition - ICFES Saber 11 (1,000 Ítems Adicionales)

import { conAyuda } from './ponerAyuda.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">${content}</svg>`;

const CONTEXTOS_CIENCIAS = [
    { loc: 'Parque Nacional Natural Tayrona', tema: 'ecosistema marino y barreras de coral' },
    { loc: 'Páramo de Sumapaz', tema: 'retención hídrica y conservación de frailejones' },
    { loc: 'Río Magdalena', tema: 'dinámica de sedimentos y bioacumulación de metales' },
    { loc: 'Santuario de Flora Malpelo', tema: 'cadenas tróficas marinas e impacto ambiental' },
    { loc: 'Desierto de la Tatacoa', tema: 'adaptación morfológica de especies a altas temperaturas' },
    { loc: 'Zona Cafetera', tema: 'química de suelos y fijación biológica de nitrógeno' }
];

export function generarReactivosCienciasMasivos(count = 1000) {
    const reactivos = [];

    const subdisciplinas = ['biologia', 'quimica', 'fisica', 'cts'];

    for (let i = 1; i <= count; i++) {
        const sub = subdisciplinas[i % subdisciplinas.length];
        const ctx = CONTEXTOS_CIENCIAS[i % CONTEXTOS_CIENCIAS.length];
        const itemId = `item_sci_gen_${String(i).padStart(4, '0')}`;

        // Parámetros IRT 3PL
        const b = Number((-2.5 + ((i * 0.005) % 5.0)).toFixed(2));
        const a = Number((1.05 + ((i * 0.0028) % 0.95)).toFixed(2));
        const c = 0.20;

        let item = null;

        if (sub === 'biologia') {
            const nivel = 10 + (i % 40);
            item = {
                id: itemId,
                area: 'ciencias_naturales',
                sub: 'biologia',
                texto: `Un estudio ambiental en el ${ctx.loc} analizó la dinámica poblacional del ${ctx.tema}. Se observó que al introducir una especie competidora por el mismo nicho ecológico, la densidad poblacional inicial de ${nivel} individuos/m² disminuyó en un 40%. ¿Cuál es el impacto biológico directo demostrado en este experimento?`,
                recurso_visual: generateSVG(`<circle cx="100" cy="100" r="40" fill="%232ecc71" opacity="0.6"/><circle cx="200" cy="100" r="25" fill="%23e74c3c" opacity="0.8"/><text x="70" y="105" fill="%23111111" font-size="12">Población A</text><text x="175" y="105" fill="%23111111" font-size="12">Población B</text><text x="80" y="170" fill="%23d4af37" font-size="14">Exclusión Competitiva</text>`),
                opciones: [
                    `A) Ocurre un proceso de exclusión competitiva donde la presencia del competidor reduce la disponibilidad de recursos limitantes para la especie residente.`,
                    `B) La especie introducida estimula simbióticamente el crecimiento asexual de la especie residente.`,
                    `C) La densidad disminuye porque los individuos mutaron genéticamente de forma espontánea a autótrofos.`,
                    `D) El nicho ecológico se expande infinitamente eliminando toda depredación.`
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
                pista: `En ${ctx.loc} la densidad era ${nivel} y bajó al entrar un competidor. Mira qué pasa con los recursos. No inventes simbiosis ni una mutación.`,
                frase: `La baja se explica porque el competidor deja menos recursos a la especie que ya estaba.`,
                repaso: 'Biología',
                razones: {
                    'La especie introducida estimula simbióticamente el crecimiento asexual de la especie residente.': 'Habla de simbiosis y de crecimiento. El dato es una baja de densidad.',
                    'La densidad disminuye porque los individuos mutaron genéticamente de forma espontánea a autótrofos.': 'Inventa una mutación. El estudio muestra un competidor, no un cambio genético.',
                    'El nicho ecológico se expande infinitamente eliminando toda depredación.': 'Un nicho infinito no explica que la densidad haya bajado.'
                }
            });
        } else if (sub === 'quimica') {
            const sol = 10 + (i % 20);
            const vol = 100 + (i % 400);
            const conc = ((sol / vol) * 1000).toFixed(1);

            item = {
                id: itemId,
                area: 'ciencias_naturales',
                sub: 'quimica',
                texto: `En un análisis hidroquímico de muestras del ${ctx.loc}, un químico disuelve ${sol} gramos de un soluto iónico en suficiente agua para preparar ${vol} mL de solución acuosa. ¿Cuál es la concentración de la solución expresada en g/L?`,
                recurso_visual: generateSVG(`<rect x="150" y="50" width="100" height="110" rx="10" fill="none" stroke="%233498db" stroke-width="3"/><rect x="152" y="90" width="96" height="68" fill="%233498db" opacity="0.4"/><text x="170" y="120" fill="%23111111" font-size="14">${sol}g / ${vol}mL</text>`),
                opciones: [
                    `A) ${conc} g/L`,
                    `B) ${(Number(conc) / 10).toFixed(1)} g/L`,
                    `C) ${(sol * vol).toLocaleString('es-CO')} g/L`,
                    `D) ${(vol / sol).toFixed(1)} g/L`
                ],
                ok: "A", a, b, c,
                q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
                trampas: [
                    { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
                    { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
                    { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
                ]
            };
            item = conAyuda(item, {
                pista: `Pasa los ${vol} mL a litros y divide los ${sol} gramos entre esos litros. No multipliques los dos números ni los inviertas.`,
                frase: `${sol} g en ${vol} mL equivalen a ${conc} g/L.`,
                repaso: 'Química',
                razones: {
                    [`${(Number(conc) / 10).toFixed(1)} g/L`]: 'Divide la concentración por 10 y la solución queda diez veces más diluida.',
                    [`${(sol * vol).toLocaleString('es-CO')} g/L`]: 'Multiplica gramos por mililitros. La concentración es una división, con los mL pasados a litros.',
                    [`${(vol / sol).toFixed(1)} g/L`]: 'Pone el volumen sobre los gramos, al revés de g/L.'
                }
            });
        } else if (sub === 'fisica') {
            const m = 2 + (i % 10);
            const a_val = 3 + (i % 5);
            const f = m * a_val;

            item = {
                id: itemId,
                area: 'ciencias_naturales',
                sub: 'fisica',
                texto: `Durante una prueba de resistencia de materiales cerca del ${ctx.loc}, un objeto con masa de ${m} kg es sometido a una fuerza neta constante alcanzando una aceleración de ${a_val} m/s². De acuerdo con la Segunda Ley de Newton (F = m · a), ¿cuál es la magnitud de la fuerza aplicada?`,
                recurso_visual: generateSVG(`<rect x="140" y="80" width="80" height="60" fill="%23e74c3c"/><line x1="220" y1="110" x2="300" y2="110" stroke="%23f1c40f" stroke-width="4" marker-end="url(#arrow)"/><text x="160" y="115" fill="%23111111" font-size="14">${m} kg</text><text x="240" y="100" fill="%23f1c40f" font-size="14">F = ?</text>`),
                opciones: [
                    `A) ${f} Newtons`,
                    `B) ${(f + 10)} Newtons`,
                    `C) ${(m / a_val).toFixed(2)} Newtons`,
                    `D) ${(a_val / m).toFixed(2)} Newtons`
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
                pista: `La fuerza es la masa por la aceleración: ${m} kg por ${a_val} m/s². No sumes 10 ni dividas.`,
                frase: `${m} por ${a_val} son ${f} newtons.`,
                repaso: 'Física',
                razones: {
                    [`${(f + 10)} Newtons`]: 'Suma 10 newtons que la masa y la aceleración no dan.',
                    [`${(m / a_val).toFixed(2)} Newtons`]: 'Divide la masa entre la aceleración. La ley pide multiplicar.',
                    [`${(a_val / m).toFixed(2)} Newtons`]: 'Divide la aceleración entre la masa, al revés de F = m · a.'
                }
            });
        } else {
            item = {
                id: itemId,
                area: 'ciencias_naturales',
                sub: 'cts',
                texto: `En la región aledaña al ${ctx.loc}, se evalúa implementar paneles solares para mitigar el impacto ambiental del ${ctx.tema}. ¿Cuál es la principal ventaja tecnológica y ecológica del aprovechamiento de la energía fotovoltaica en esta zona?`,
                recurso_visual: null,
                opciones: [
                    `A) Permite la generación de energía eléctrica renovable sin emisiones directas de gases de efecto invernadero durante su operación.`,
                    `B) Incrementa permanentemente la extracción de hidrocarburos pesados del suelo.`,
                    `C) Modifica el ciclo hidrológico destruyendo los acuíferos subterráneos.`,
                    `D) Garantiza la absorción del 100% de los residuos plásticos de la región.`
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
                pista: `En ${ctx.loc} la ventaja es generar electricidad sin humo de chimenea mientras el panel funciona. No es sacar más petróleo ni absorber plásticos.`,
                frase: `El panel produce electricidad renovable y, al funcionar, no suelta gases de invernadero.`,
                repaso: 'Ciencia, tecnología y sociedad',
                razones: {
                    'Incrementa permanentemente la extracción de hidrocarburos pesados del suelo.': 'Habla de sacar más petróleo. El panel no hace eso.',
                    'Modifica el ciclo hidrológico destruyendo los acuíferos subterráneos.': 'Inventa un daño a los acuíferos que la pregunta no muestra.',
                    'Garantiza la absorción del 100% de los residuos plásticos de la región.': 'Un panel no absorbe todo el plástico de la región.'
                }
            });
        }

        reactivos.push(item);
    }

    return reactivos;
}
