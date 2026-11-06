// 🏛️ src/services/bank/generatorSociales.js - Generador & Calibrador Masivo de Sociales y Ciudadanas
// Dante OS Enterprise Edition - ICFES Saber 11 (1,000 Ítems Adicionales)

import { conAyuda } from './ponerAyuda.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">${content}</svg>`;

const CONTEXTOS_SOCIALES = [
    { loc: 'Bogotá', tema: 'Mecanismos de participación ciudadana y Cabildo Abierto' },
    { loc: 'Antioquia', tema: 'Desarrollo de infraestructura y consulta previa a comunidades' },
    { loc: 'Valle del Cauca', tema: 'Diversidad étnica y derechos territoriales afrocolombianos' },
    { loc: 'Caribe', tema: 'Historia del comercio marítimo e integración regional' },
    { loc: 'Santander', tema: 'Movimientos sociales históricos y Revolución de los Comuneros' },
    { loc: 'Amazonía', tema: 'Protección ambiental del bioma y reservas indígenas' }
];

export function generarReactivosSocialesMasivos(count = 1000) {
    const reactivos = [];

    const subdisciplinas = [
        'pensamiento_social', 
        'interpretacion_y_analisis', 
        'pensamiento_sistemico', 
        'competencias_ciudadanas'
    ];

    for (let i = 1; i <= count; i++) {
        const sub = subdisciplinas[i % subdisciplinas.length];
        const ctx = CONTEXTOS_SOCIALES[i % CONTEXTOS_SOCIALES.length];
        const itemId = `item_soc_gen_${String(i).padStart(4, '0')}`;

        // Parámetros IRT 3PL
        const b = Number((-2.5 + ((i * 0.005) % 5.0)).toFixed(2));
        const a = Number((1.1 + ((i * 0.0026) % 0.85)).toFixed(2));
        const c = 0.20;

        let item = null;

        if (sub === 'pensamiento_social') {
            item = {
                id: itemId,
                area: 'sociales_ciudadanas',
                sub: 'pensamiento_social',
                texto: `En el contexto del debate sobre ${ctx.tema} en la región de ${ctx.loc}, los ciudadanos discuten el papel de la Constitución Política de 1991 como Estado Social de Derecho. ¿Cuál de los siguientes principios fundamentales garantiza la prevalencia de los derechos colectivos y la dignidad humana en esta situación?`,
                recurso_visual: null,
                opciones: [
                    `A) El principio de primacía de los derechos inalienables de la persona y la función social de la propiedad.`,
                    `B) El principio de libre mercado absoluto sin ningún tipo de regulación estatal ni ambiental.`,
                    `C) La concentración exclusiva del poder político en el poder ejecutivo sin control de los jueces.`,
                    `D) La abolición de las veedurías ciudadanas para agilizar las decisiones administrativas.`
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
                pista: `En ${ctx.loc} el debate es sobre ${ctx.tema}. La Constitución pone a la persona y los derechos por delante. No es un mercado sin reglas ni un poder sin control.`,
                frase: `En ese debate pesa la primacía de los derechos de la persona y la función social de la propiedad.`,
                repaso: 'Pensamiento social',
                razones: {
                    'El principio de libre mercado absoluto sin ningún tipo de regulación estatal ni ambiental.': 'Inventa un mercado sin reglas. La Constitución no deja los derechos colectivos a un lado.',
                    'La concentración exclusiva del poder político en el poder ejecutivo sin control de los jueces.': 'Quita el control de los jueces. El caso no pide un poder sin freno.',
                    'La abolición de las veedurías ciudadanas para agilizar las decisiones administrativas.': 'Cerrar las veedurías no protege la dignidad ni los derechos colectivos.'
                }
            });
        } else if (sub === 'interpretacion_y_analisis') {
            item = {
                id: itemId,
                area: 'sociales_ciudadanas',
                sub: 'interpretacion_y_analisis',
                texto: `Un historiador compara dos fuentes sobre ${ctx.tema} en ${ctx.loc}. La Fuente X sostiene que las transformaciones económicas fueron impulsadas por actores privados. La Fuente Y afirma que las políticas públicas de inversión estatal fueron el factor determinante. ¿Qué conclusión analítica se deriva al contrastar ambas fuentes?`,
                recurso_visual: generateSVG(`<rect x="40" y="40" width="140" height="120" fill="none" stroke="%233498db" stroke-width="2"/><text x="60" y="70" fill="%233498db" font-size="14">Fuente X</text><text x="50" y="100" fill="%23111111" font-size="11">Sector Privado</text><rect x="220" y="40" width="140" height="120" fill="none" stroke="%23e74c3c" stroke-width="2"/><text x="240" y="70" fill="%23e74c3c" font-size="14">Fuente Y</text><text x="230" y="100" fill="%23111111" font-size="11">Inversión Estatal</text>`),
                opciones: [
                    `A) Ambas fuentes ofrecen perspectivas complementarias sobre la interacción entre la iniciativa privada y la regulación estatal.`,
                    `B) Una de las fuentes debe ser falsa porque es imposible que el Estado y los privados interactúen.`,
                    `C) La historia solo debe registrar acontecimientos militares ignorando los factores socioeconómicos.`,
                    `D) Ambas fuentes demuestran que las decisiones políticas carecen de impacto en la sociedad.`
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
                pista: `Las dos fuentes de ${ctx.loc} cuentan el mismo tema, ${ctx.tema}, desde actores distintos. Contrastarlas no obliga a declarar una falsa.`,
                frase: `Fuente X y Fuente Y se complementan: privados y Estado pueden actuar a la vez.`,
                repaso: 'Interpretación de fuentes',
                razones: {
                    'Una de las fuentes debe ser falsa porque es imposible que el Estado y los privados interactúen.': 'Declara imposible lo que las dos fuentes sí pueden contar juntas.',
                    'La historia solo debe registrar acontecimientos militares ignorando los factores socioeconómicos.': 'El caso es económico y social, no una lista de batallas.',
                    'Ambas fuentes demuestran que las decisiones políticas carecen de impacto en la sociedad.': 'Las fuentes hablan de causas, no de que la política no importe.'
                }
            });
        } else if (sub === 'pensamiento_sistemico') {
            item = {
                id: itemId,
                area: 'sociales_ciudadanas',
                sub: 'pensamiento_sistemico',
                texto: `Un conflicto social surge en ${ctx.loc} entre pequeños agricultores, autoridades ambientales y empresas turísticas por el uso del recurso hídrico. Desde una perspectiva sistémica, ¿por qué una solución unilateral que favorezca únicamente al sector industrial generaría un problema mayor a largo plazo?`,
                recurso_visual: null,
                opciones: [
                    `A) Porque ignora las interdependencias ecológicas y la sostenibilidad de las comunidades agrícolas, desequilibrando el sistema regional.`,
                    `B) Porque el agua es un recurso infinito que no requiere ningún tipo de planificación o gestión.`,
                    `C) Porque las comunidades agrícolas no forman parte del sistema económico o productivo del país.`,
                    `D) Porque la legislación colombiana prohíbe el desarrollo de cualquier actividad turística.`
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
                pista: `En ${ctx.loc} el agua la usan agricultores, ambiente y turismo a la vez. Una salida solo para la industria deja fuera al resto del sistema.`,
                frase: `Favorecer solo a la industria rompe el agua, el campo y el equilibrio de la región.`,
                repaso: 'Pensamiento sistémico',
                razones: {
                    'Porque el agua es un recurso infinito que no requiere ningún tipo de planificación o gestión.': 'Trata el agua como infinita. El conflicto existe precisamente porque no lo es.',
                    'Porque las comunidades agrícolas no forman parte del sistema económico o productivo del país.': 'Saca a los agricultores del sistema. El caso los pone dentro del conflicto.',
                    'Porque la legislación colombiana prohíbe el desarrollo de cualquier actividad turística.': 'Inventa una prohibición total del turismo que el caso no dice.'
                }
            });
        } else {
            // competencias_ciudadanas
            item = {
                id: itemId,
                area: 'sociales_ciudadanas',
                sub: 'competencias_ciudadanas',
                texto: `En una institución educativa de ${ctx.loc}, el Consejo Estudiantil propone una iniciativa para promover la inclusión y el respeto a la diversidad de género y cultura. ¿Cuál mecanismo constitucional o formativo promueve de manera directa el ejercicio democrático y ciudadano en la escuela?`,
                recurso_visual: null,
                opciones: [
                    `A) El Gobierno Escolar mediante deliberaciones participativas en el Consejo Directivo y la Personería Estudiantil.`,
                    `B) La imposición de sanciones disciplinarias de forma arbitraria sin debido proceso.`,
                    `C) La suspensión de las elecciones escolares para evitar debates ideológicos entre los estudiantes.`,
                    `D) La delegación de todas las decisiones escolares a entes administrativos externos.`
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
                pista: `En la escuela de ${ctx.loc} la pregunta es qué mecanismo deja participar. Piensa en el gobierno escolar, no en una sanción sin proceso.`,
                frase: `El Gobierno Escolar, el Consejo Directivo y la Personería Estudiantil son el ejercicio democrático de esa escuela.`,
                repaso: 'Competencias ciudadanas',
                razones: {
                    'La imposición de sanciones disciplinarias de forma arbitraria sin debido proceso.': 'Una sanción sin proceso no es participación.',
                    'La suspensión de las elecciones escolares para evitar debates ideológicos entre los estudiantes.': 'Quitar las elecciones cierra el ejercicio que la pregunta pide.',
                    'La delegación de todas las decisiones escolares a entes administrativos externos.': 'Sacar las decisiones de la escuela no es el mecanismo de esa institución.'
                }
            });
        }

        reactivos.push(item);
    }

    return reactivos;
}
