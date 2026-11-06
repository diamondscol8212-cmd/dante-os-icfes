// 🧪 src/services/bank/ciencias_naturales.js - 50 Reactivos Calibrados ICFES Saber 11
import { generarReactivosCienciasMasivos } from './generatorCiencias.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" style="background:%23ffffff;font-family:sans-serif;">${content}</svg>`;

const reactivosSeed = [
    { id: 'item_cn_01', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En un experimento sobre fotosíntesis, se mide la tasa de liberación de O2 en plantas sumergidas expuestas a diferentes intensidades de luz. Se observa que la producción de oxígeno se incrementa proporcionalmente hasta alcanzar un valor constante.\n\n¿A qué se debe la estabilización en la tasa de liberación de O2?",
        recurso_visual: null,
        opciones: [
            "A) Otro factor del medio, como la concentración de CO2 o la temperatura, se volvió el factor limitante.",
            "B) La luz destruyó por completo la clorofila de la planta acuática.",
            "C) La planta agotó todas sus reservas de agua y sales minerales.",
            "D) La fase oscura de la fotosíntesis solo se activa en ausencia total de radiación lumínica."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 }
    },
    { id: '33333333-0000-4000-8000-000000000001', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un vehículo reduce su velocidad uniformemente de 24 m/s a 0 m/s en un intervalo de 6 segundos al aproximarse a un semáforo. La magnitud de su desaceleración constante es de:",
        recurso_visual: generateSVG('<line x1="30" y1="160" x2="370" y2="160" stroke="%23444444" stroke-width="2"/><rect x="50" y="110" width="80" height="40" rx="5" fill="%2351e2f5"/><text x="60" y="135" fill="%23000000" font-weight="bold" font-size="12">V1 = 24m/s</text><rect x="270" y="110" width="80" height="40" rx="5" fill="%23e74c3c"/><text x="280" y="135" fill="%23111111" font-weight="bold" font-size="12">V2 = 0m/s</text><text x="170" y="90" fill="%23d4af37" font-size="14">t = 6s</text>'),
        opciones: ["A) 4 m/s²", "B) 8 m/s²", "C) 144 m/s²", "D) 24 m/s²"],
        ok: "A", a: 1.40, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000002', area: 'ciencias_naturales', sub: 'quimica',
        texto: "En un recipiente cerrado se mezclan 2 moles de gas hidrógeno (H₂) y 1 mol de gas oxígeno (O₂) a temperatura constante. Al reaccionar completamente para formar agua (H₂O), considerando la ley de conservación de la masa, se producen exactamente:",
        recurso_visual: generateSVG('<text x="50" y="100" fill="%2351e2f5" font-size="20">2 H₂  +  O₂  →  2 H₂O</text><text x="50" y="140" fill="%23d4af37" font-size="12">(2 moles)  (1 mol)    (? moles)</text>'),
        opciones: ["A) 2 moles de agua", "B) 1 mol de agua", "C) 4 moles de agua", "D) 3 moles de agua"],
        ok: "A", a: 1.55, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000003', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Durante la fotosíntesis en plantas superiores, las reacciones dependientes de la luz (fase luminosa) que ocurren en los tilacoides del cloroplasto generan como productos energéticos esenciales para el ciclo de Calvin:",
        recurso_visual: null,
        opciones: ["A) Glucosa y oxígeno", "B) ATP y NADPH", "C) Dióxido de carbono y agua", "D) Almidón y clorofila"],
        ok: "B", a: 1.70, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000004', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Dos bloques de masas m1 = 2 kg y m2 = 6 kg se encuentran sobre una superficie horizontal lisa sin fricción. Si se les aplica una fuerza neta idéntica de 12 N a ambos cuerpos de manera independiente, la relación entre sus aceleraciones (a1 / a2) es:",
        recurso_visual: generateSVG('<rect x="50" y="100" width="50" height="50" fill="%2351e2f5"/><text x="65" y="130" fill="%2300" font-size="12">2kg</text><rect x="220" y="70" width="80" height="80" fill="%232ecc71"/><text x="245" y="115" fill="%2300" font-size="12">6kg</text><line x1="20" y1="150" x2="380" y2="150" stroke="%23444444" stroke-width="2"/>'),
        opciones: ["A) 1 : 3", "B) 3 : 1", "C) 1 : 1", "D) 4 : 1"],
        ok: "B", a: 1.60, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000005', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Se disuelven 40 gramos de hidróxido de sodio (NaOH) en agua suficiente hasta completar un litro de solución. Sabiendo que los pesos atómicos son Na = 23, O = 16 y H = 1, la concentración molar (molaridad) de la solución resultante es:",
        recurso_visual: null,
        opciones: ["A) 1 M", "B) 2 M", "C) 0.5 M", "D) 4 M"],
        ok: "A", a: 1.50, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000006', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En una población de insectos, un cambio ambiental repentino elimina a todos los individuos que no poseen resistencia a un pesticida. Los sobrevivientes se reproducen, fijando el carácter resistente en las siguientes generaciones. Este fenómeno evolutivo se conoce como:",
        recurso_visual: null,
        opciones: ["A) Deriva génica por efecto fundador", "B) Selección natural direccional", "C) Especiación alopátrica por aislamiento", "D) Mutación puntual espontánea"],
        ok: "B", a: 1.45, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000007', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un rayo de luz monocromática incide desde el aire (n = 1.0) sobre la superficie de un bloque de vidrio transparente con un ángulo de incidencia de 30°. Si el índice de refracción del vidrio es 2, el seno del ángulo de refracción dentro del medio es:",
        recurso_visual: null,
        opciones: ["A) 0.25", "B) 0.50", "C) 1.00", "D) 0.86"],
        ok: "A", a: 1.80, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000008', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Al descender en un grupo de la tabla periódica (por ejemplo, los halógenos del grupo 17), el radio atómico tiende a aumentar debido a:",
        recurso_visual: null,
        opciones: ["A) La adición de nuevos niveles de energía (capas electrónicas principales).", "B) La disminución en el número total de protones nucleares.", "C) La contracción de los electrones de valencia hacia el núcleo.", "D) La pérdida constante de neutrones."],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000009', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Si una célula somática humana con 46 cromosomas sufre un proceso normal de división celular por mitosis, el resultado final esperado es la obtención de:",
        recurso_visual: null,
        opciones: ["A) 4 células hijas haploides con 23 cromosomas cada una.", "B) 2 células hijas genéticamente idénticas con 46 cromosomas cada una.", "C) 2 células hijas con 92 cromosomas.", "D) 1 sola célula gigante multinucleada."],
        ok: "B", a: 1.25, b: -0.70, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000010', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Una resistencia eléctrica de 10 ohmios se conecta a una fuente de corriente continua de 20 voltios. La potencia disipada en forma de calor por efecto Joule en la resistencia es de:",
        recurso_visual: generateSVG('<rect x="100" y="50" width="200" height="100" fill="none" stroke="%2351e2f5" stroke-width="3"/><rect x="180" y="40" width="40" height="20" fill="%23d4af37"/><text x="185" y="35" fill="%23111111" font-size="10">R = 10 Ω</text><text x="50" y="105" fill="%232ecc71" font-size="12">V = 20V</text>'),
        opciones: ["A) 2 vatios", "B) 40 vatios", "C) 200 vatios", "D) 10 vatios"],
        ok: "B", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000011', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un gas ideal ocupa un volumen de 4 litros a una presión de 2 atmósferas. Si la temperatura se mantiene constante y la presión se incrementa al doble (4 atmósferas), el nuevo volumen ocupado por el gas será de:",
        recurso_visual: null,
        opciones: ["A) 2 litros", "B) 8 litros", "C) 1 litro", "D) 4 litros"],
        ok: "A", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000012', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En una cadena trófica marina, el fitoplancton sintetiza materia orgánica, los peces herbívoros se alimentan del fitoplancton y los tiburones cazan a los peces. Si una toxina liposoluble no biodegradable ingresa al agua, el organismo con mayor concentración acumulada por biomagnificación será:",
        recurso_visual: null,
        opciones: ["A) El tiburón (consumidor terciario o tope).", "B) El fitoplancton (productor primario).", "C) Los peces herbívoros (consumidores primarios).", "D) Las bacterias descomponedoras del fondo."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000013', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un objeto se deja caer libremente desde la azotea de un edificio y tarda 3 segundos en impactar contra el suelo. Asumiendo la aceleración de la gravedad g = 10 m/s² y despreciando la resistencia del aire, la altura del edificio es:",
        recurso_visual: null,
        opciones: ["A) 45 metros", "B) 30 metros", "C) 90 metros", "D) 15 metros"],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000014', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un elemento X tiene número atómico Z = 12 y configuración electrónica 1s² 2s² 2p⁶ 3s². De acuerdo con su posición en la tabla periódica, este elemento tiende a:",
        recurso_visual: null,
        opciones: ["A) Ceder 2 electrones de valencia formando un catión X²⁺.", "B) Ganar 2 electrones formando un anión X²⁻.", "C) Compartir 4 electrones en enlaces covalentes triples.", "D) Comportarse como un gas noble inerte."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000015', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En un experimento genético con plantas de arveja, el gen para semilla lisa (L) es dominante sobre el gen para semilla rugosa (l). Si se cruzan dos plantas heterocigotas (Ll x Ll), la proporción fenotípica esperada en la descendencia F1 es:",
        recurso_visual: null,
        opciones: ["A) 75% semillas lisas y 25% semillas rugosas (3 : 1)", "B) 100% semillas lisas", "C) 50% semillas lisas y 50% semillas rugosas", "D) 25% semillas lisas y 75% semillas rugosas"],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000016', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un buzo se sumerge a una profundidad de 20 metros en agua de mar (densidad ρ = 1.000 kg/m³). Sabiendo que la presión atmosférica en la superficie es de 1 atm (~100.000 Pa) y g = 10 m/s², la presión total absoluta que soporta el buzo es:",
        recurso_visual: null,
        opciones: ["A) 300.000 Pa (~3 atm)", "B) 200.000 Pa (~2 atm)", "C) 100.000 Pa (~1 atm)", "D) 400.000 Pa (~4 atm)"],
        ok: "A", a: 1.75, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000017', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Se tiene una solución acuosa con pH = 3. A partir de este dato, se deduce que la concentración de iones hidronio [H⁺] y la naturaleza de la solución son:",
        recurso_visual: null,
        opciones: ["A) [H⁺] = 10⁻³ M y la solución es Ácida.", "B) [H⁺] = 10³ M y la solución es Básica.", "C) [H⁺] = 10⁻¹¹ M y la solución es Neutra.", "D) [H⁺] = 3 M y la solución es Alcalina."],
        ok: "A", a: 1.50, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000018', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La hormona insulina sintetizada por las células beta del páncreas cumple la función fisiológica de:",
        recurso_visual: null,
        opciones: ["A) Disminuir los niveles de glucosa en sangre promoviendo su ingreso a las células.", "B) Elevar la presión arterial durante momentos de estrés agudo.", "C) Estimular la producción de glóbulos rojos en la médula ósea.", "D) Acelerar el ritmo cardíaco en el ejercicio físico."],
        ok: "A", a: 1.30, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000019', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Una onda sonora se propaga en el aire con una frecuencia de 340 Hz. Sabiendo que la velocidad del sonido en el aire es de 340 m/s, la longitud de onda λ equivale a:",
        recurso_visual: generateSVG('<path d="M 30 100 Q 80 20 130 100 T 230 100 T 330 100" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="30" y1="100" x2="370" y2="100" stroke="%239499a7"/><text x="110" y="40" fill="%23d4af37" font-size="12">λ = ?</text>'),
        opciones: ["A) 1,0 metro", "B) 10,0 metros", "C) 0,1 metros", "D) 340,0 metros"],
        ok: "A", a: 1.45, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000020', area: 'ciencias_naturales', sub: 'quimica',
        texto: "En una reacción endotérmica que alcanza el equilibrio químico (A + B + Calor ⇌ C), si se incrementa la temperatura del sistema manteniendo el volumen constante, el equilibrio se desplazará hacia:",
        recurso_visual: null,
        opciones: ["A) La derecha (favoreciendo la formación de productos C).", "B) La izquierda (favoreciendo los reactivos A y B).", "C) Permanecerá inalterado sin variaciones.", "D) La precipitación sólida inmediata del solvente."],
        ok: "A", a: 1.80, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000021', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Los organelos celulares encargados de degradar macromoléculas y material de desecho mediante enzimas digestivas ácidas son los:",
        recurso_visual: null,
        opciones: ["A) Lisosomas", "B) Ribosomas", "C) Mitocondrias", "D) Cloroplastos"],
        ok: "A", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000022', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un motor eléctrico realiza un trabajo útil W = 6.000 Joules en un intervalo t = 10 segundos. La potencia mecánica desarrollada por el motor es:",
        recurso_visual: null,
        opciones: ["A) 600 Vatios", "B) 60.000 Vatios", "C) 60 Vatios", "D) 6.000 Vatios"],
        ok: "A", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000023', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un enlace químico caracterizado por la transferencia completa de electrones de valencia desde un metal alcalino hacia un no metal halógeno se clasifica como:",
        recurso_visual: null,
        opciones: ["A) Enlace Iónico", "B) Enlace Covalente Apolar", "C) Enlace Covalente Polar", "D) Enlace Metálico"],
        ok: "A", a: 1.30, b: -0.55, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000024', area: 'ciencias_naturales', sub: 'biologia',
        texto: "El proceso mediante el cual las bacterias fijadoras de nitrógeno en los nódulos radiculares de las leguminosas convierten el N₂ atmosférico en amonio (NH₄⁺) asimilable para las plantas se denomina:",
        recurso_visual: null,
        opciones: ["A) Fijación biológica del nitrógeno", "B) Desnitrificación anaerobia", "C) Lixiviación por escorrentía", "D) Amonificación fúngica"],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000025', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un transformador eléctrico ideal posee 500 espiras en el devanado primario y 100 espiras en el devanado secundario. Si se le aplica un voltaje alterno de entrada de 120 V en el primario, el voltaje de salida en el secundario será de:",
        recurso_visual: null,
        opciones: ["A) 24 Voltios", "B) 600 Voltios", "C) 120 Voltios", "D) 48 Voltios"],
        ok: "A", a: 1.70, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000026', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un hidrocarburo alifático saturado de cadena abierta que responde a la fórmula molecular general C_n H_(2n+2) pertenece a la familia de los:",
        recurso_visual: null,
        opciones: ["A) Alcanos", "B) Alquenos", "C) Alquinos", "D) Aromáticos"],
        ok: "A", a: 1.25, b: -0.65, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000027', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Durante el proceso de transcripción genética que ocurre en el núcleo de las células eucariotas, la enzima ARN polimerasa sintetiza una molécula de ARN mensajero utilizando como molde una hebra de ADN. Si la hebra molde de ADN tiene la secuencia 3'- TAC-GGC-TTA -5', la secuencia complementaria del ARNm resultante es:",
        recurso_visual: null,
        opciones: ["A) 5'- AUG-CCG-AAU -3'", "B) 5'- ATG-CCG-AAT -3'", "C) 5'- UAC-GGC-UUA -3'", "D) 3'- AUG-CCG-AAU -5'"],
        ok: "A", a: 1.85, b: 0.90, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000028', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un muelle o resorte helicoidal con una constante elástica k = 200 N/m se comprime una distancia x = 0,1 metros. La energía potencial elástica almacenada en el resorte es:",
        recurso_visual: null,
        opciones: ["A) 1,0 Joule", "B) 20,0 Joules", "C) 2,0 Joules", "D) 0,5 Joules"],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000029', area: 'ciencias_naturales', sub: 'quimica',
        texto: "El estado de oxidación del azufre (S) en la molécula de ácido sulfúrico (H₂SO₄) corresponde exactamente a:",
        recurso_visual: null,
        opciones: ["A) +6", "B) +4", "C) +2", "D) -2"],
        ok: "A", a: 1.50, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000030', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En el cuerpo humano, los glóbulos rojos (eritrocitos) maduros carecen de núcleo celular y mitocondrias. Como consecuencia fisiológica directa, el mecanismo metabólico exclusivo mediante el cual obtienen energía ATP es la:",
        recurso_visual: null,
        opciones: ["A) Glucólisis anaerobia (fermentación láctica).", "B) Respiración celular aerobia mitocondrial.", "C) Fotofosforilación acíclica.", "D) Beta-oxidación de ácidos grasos."],
        ok: "A", a: 1.80, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000031', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un fluido incompresible circula a través de una tubería horizontal que reduce su diámetro a la mitad. De acuerdo con la ecuación de continuidad y el principio de Bernoulli, al reducirse la sección transversal de la tubería:",
        recurso_visual: generateSVG('<path d="M 30 60 L 200 60 L 200 80 L 370 80 L 370 120 L 200 120 L 200 140 L 30 140 Z" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="80" y="105" fill="%23111111" font-size="12">V1 (Lento)</text><text x="250" y="105" fill="%23d4af37" font-size="12">V2 (Rápido)</text>'),
        opciones: ["A) La velocidad del fluido aumenta y la presión estática disminuye.", "B) La velocidad del fluido disminuye y la presión estática aumenta.", "C) La velocidad y la presión aumentan simultáneamente.", "D) La velocidad y la presión permanecen constantes."],
        ok: "A", a: 1.85, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000032', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un estudiante mide la temperatura de ebullición del agua pura en Bogotá (2.600 msnm) y obtiene 92 °C, mientras que en Cartagena (0 msnm) registra 100 °C. Esta diferencia ocurre porque:",
        recurso_visual: null,
        opciones: ["A) La presión atmosférica en Bogotá es menor, lo que disminuye la temperatura necesaria para igualar la presión de vapor.", "B) El agua en Bogotá contiene mayor concentración de sal mineral.", "C) La aceleración de la gravedad en Bogotá destruye los puentes de hidrógeno.", "D) El aire en las costas marinas calienta más rápido los recipientes."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000033', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Las bacterias Gram-positivas se diferencian estructuralmente de las Gram-negativas en la prueba de tinción debido a que poseen:",
        recurso_visual: null,
        opciones: ["A) Una pared celular con una capa gruesa de peptidoglicano que retiene el cristal violeta.", "B) Una membrana externa rica en lipopolisacáridos impermeables.", "C) Un núcleo delimitado por una doble membrana lipídica.", "D) Flagelos compuestos por microtúbulos de tubulina."],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000034', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un imán permanente se introduce rápidamente dentro de una bobina de cobre conectada a un galvanómetro. Se observa una deflexión en la aguja indicando corriente eléctrica. Este fenómeno se explica mediante la:",
        recurso_visual: null,
        opciones: ["A) Ley de Inducción Electromagnética de Faraday.", "B) Ley de Gravitación Universal de Newton.", "C) Ley de Coulomb para cargas puntuales.", "D) Ley de Ohm para circuitos de corriente continua."],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000035', area: 'ciencias_naturales', sub: 'quimica',
        texto: "¿Cuántos átomos de oxígeno hay contenidos en 0,5 moles de dióxido de carbono (CO₂)? (Número de Avogadro N_A = 6,022 x 10²³ moléculas/mol):",
        recurso_visual: null,
        opciones: ["A) 6,022 x 10²³ átomos de O", "B) 3,011 x 10²³ átomos de O", "C) 1,204 x 10²⁴ átomos de O", "D) 1,505 x 10²³ átomos de O"],
        ok: "A", a: 1.80, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000036', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La teoría endosimbiótica propuesta por Lynn Margulis explica el origen evolutivo de las células eucariotas postulando que los cloroplastos y las mitocondrias evolucionaron a partir de:",
        recurso_visual: null,
        opciones: ["A) Bacterias procariotas de vida libre fagocitadas por células huésped primitivas.", "B) Modificaciones espontáneas de la membrana plasmática nuclear.", "C) Virus ancestrales que integraron su código genético de forma permanente.", "D) Vesículas del aparato de Golgi que mutaron fotosintéticamente."],
        ok: "A", a: 1.70, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000037', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un proyectil se dispara con un ángulo de 45° respecto a la horizontal. En el punto más alto de su trayectoria parabólica, el valor de la componente vertical de su velocidad (Vy) es:",
        recurso_visual: generateSVG('<path d="M 30 170 Q 200 20 370 170" fill="none" stroke="%2351e2f5" stroke-width="3"/><circle cx="200" cy="57" r="6" fill="%23e74c3c"/><line x1="200" y1="57" x2="250" y2="57" stroke="%232ecc71" stroke-width="3"/><text x="200" y="40" fill="%23e74c3c" font-size="12">V_y = ?</text>'),
        opciones: ["A) 0 m/s", "B) Igual a la velocidad inicial de disparo V0", "C) El doble de la velocidad horizontal Vx", "D) 9,8 m/s"],
        ok: "A", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000038', area: 'ciencias_naturales', sub: 'quimica',
        texto: "De acuerdo con la teoría ácido-base de Brønsted-Lowry, una sustancia química que actúa como 'base' en una solución acuosa se define como aquella capaz de:",
        recurso_visual: null,
        opciones: ["A) Aceptar o captar un protón (H⁺).", "B) Donar un protón (H⁺) al medio solvente.", "C) Liberar electrones de forma radiactiva.", "D) Neutralizar exclusivamente gases nobles."],
        ok: "A", a: 1.30, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000039', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La enzima lactasa descompone la lactosa (azúcar de la leche) en glucosa y galactosa. Si una persona padece intolerancia a la lactosa debido a una deficiencia de esta enzima en las microvellosidades intestinales, el azúcar no digerido pasa al colon donde:",
        recurso_visual: null,
        opciones: ["A) Es fermentado por la microbiota bacteriana produciendo gases y diarrea osmótica.", "B) Se absorbe directamente al torrente sanguíneo elevando la presión arterial.", "C) Se transforma en proteínas estructurales para el músculo esquelético.", "D) Es eliminado en la orina de forma inofensiva."],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000040', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un satélite artificial orbita a una altura fija alrededor de la Tierra en un movimiento circular uniforme (MCU). ¿Cuál de las siguientes afirmaciones describe correctamente las magnitudes físicas de su movimiento?",
        recurso_visual: null,
        opciones: ["A) Su rapidez escalar es constante pero su vector velocidad varía continuamente debido a la aceleración centrípeta.", "B) Su velocidad vectorial y su rapidez son completamente constantes.", "C) La fuerza centrípeta gravitatoria es nula en el espacio exterior.", "D) Su aceleración es cero porque no cambia de módulo su rapidez."],
        ok: "A", a: 1.75, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000041', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Al mezclar 100 mL de solución de HCl a 0.1 M con 100 mL de NaOH a 0.1 M, ocurre una reacción de neutralización completa. El pH final de la mezcla resultante a 25 °C es:",
        recurso_visual: null,
        opciones: ["A) pH = 7,0 (Neutro)", "B) pH = 1,0 (Muy Ácido)", "C) pH = 14,0 (Muy Básico)", "D) pH = 0,0"],
        ok: "A", a: 1.55, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000042', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La función de los estomas ubicados en la epidermis de las hojas de las plantas es regular:",
        recurso_visual: null,
        opciones: ["A) El intercambio gaseoso (O₂ y CO₂) y la transpiración de agua.", "B) La absorción de sales minerales desde el suelo profundo.", "C) La conducción saprófita de glucosa hacia la raíz.", "D) La atracción mecánica de insectos polinizadores."],
        ok: "A", a: 1.35, b: -0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000043', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Dos cargas eléctricas puntuales q1 = +2 μC y q2 = -2 μC están separadas por una distancia d. La fuerza electrostática entre ellas de acuerdo con la Ley de Coulomb es de naturaleza:",
        recurso_visual: null,
        opciones: ["A) Atractiva", "B) Repulsiva", "C) Gravitacional nula", "D) Inductiva magnética"],
        ok: "A", a: 1.20, b: -0.80, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000044', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un proceso de separación físico utilizado en refinerías para fraccionar el petróleo crudo en componentes como gasolina, queroseno y diésel basándose en sus diferentes puntos de ebullición se conoce como:",
        recurso_visual: null,
        opciones: ["A) Destilación fraccionada", "B) Filtración al vacío", "C) Centrifugación diferencial", "D) Cristalización por evaporación"],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000045', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La principal diferencia funcional entre los vasos del xilema y del floema en las plantas vasculares consiste en que:",
        recurso_visual: null,
        opciones: ["A) El xilema transporta agua y minerales (savia bruta) desde las raíces; el floema transporta azúcares (savia elaborada) desde las hojas.", "B) El floema absorbe luz solar y el xilema sintetiza clorofila.", "C) El xilema produce flores y frutos mientras el floema produce madera muerta.", "D) Ambos vasos transportan exclusivamente dióxido de carbono líquido."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000046', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un gas ideal contenido en un cilindro con émbolo móvil se expande adiabaticamente realizando un trabajo W sobre su entorno. Durante un proceso adiabático estricto:",
        recurso_visual: null,
        opciones: ["A) No existe intercambio de calor con el exterior (Q = 0) y su energía interna disminuye.", "B) La temperatura del gas permanece exactamente constante.", "C) La presión permanece constante durante toda la expansión.", "D) El gas absorbe una cantidad infinita de energía térmica."],
        ok: "A", a: 1.85, b: 0.95, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000047', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un catalizador biológico (enzima) acelera la velocidad de una reacción química celular debido a que:",
        recurso_visual: generateSVG('<path d="M 30 150 Q 150 20 250 150" fill="none" stroke="%23e74c3c" stroke-width="3"/><path d="M 30 150 Q 150 80 250 150" fill="none" stroke="%232ecc71" stroke-width="3"/><text x="100" y="40" fill="%23e74c3c" font-size="10">Sin Enzima</text><text x="100" y="100" fill="%232ecc71" font-size="10">Con Enzima</text>'),
        opciones: ["A) Disminuye la energía de activación necesaria para iniciar la reacción.", "B) Aumenta la temperatura interna de la célula hasta hervirla.", "C) Se consume completamente transformándose en producto final.", "D) Modifica la constante de equilibrio Keq de la reacción."],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000048', area: 'ciencias_naturales', sub: 'biologia',
        texto: "El fenómeno de vasoconstricción periférica que experimenta el cuerpo humano cuando se expone a temperaturas ambientales extremadamente frías cumple la función termorreguladora de:",
        recurso_visual: null,
        opciones: ["A) Disminuir el flujo sanguíneo hacia la piel para conservar la temperatura en los órganos vitales internos.", "B) Aumentar la sudoración para enfriar rápidamente los músculos.", "C) Liberar toxinas hepáticas directamente a través de los poros.", "D) Disminuir el ritmo respiratorio pulmonar."],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000049', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un rayo de luz blanca atraviesa un prisma de cristal transparente y se descompone en un abanico de colores del espectro visible (rojo, naranja, amarillo, verde, azul y violeta). Este fenómeno se conoce como:",
        recurso_visual: generateSVG('<polygon points="100,160 200,40 300,160" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="30" y1="120" x2="150" y2="100" stroke="%23444444" stroke-width="3"/><path d="M 250 100 L 370 60 M 250 100 L 370 80 M 250 100 L 370 100 M 250 100 L 370 120" stroke="%23e74c3c" stroke-width="2"/>'),
        opciones: ["A) Dispersión refractiva de la luz", "B) Polarización magnética", "C) Difracción por rendija estrecha", "D) Reflexión total interna"],
        ok: "A", a: 1.40, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000050', area: 'ciencias_naturales', sub: 'quimica',
        texto: "¿Cuál de los siguientes pares de sustancias formará una solución tampón o buffer capaz de resistir cambios drásticos de pH?",
        recurso_visual: null,
        opciones: ["A) Un ácido débil y su sal conjugada (ej. CH₃COOH y CH₃COONa).", "B) Un ácido fuerte y una base fuerte (ej. HCl y NaOH).", "C) Agua destilada con cloruro de sodio.", "D) Aceite vegetal y agua de grifo."],
        ok: "A", a: 1.75, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000051', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La síntesis de ATP en la respiración celular aerobia ocurre principalmente mediante el gradiente quimiosmótico de protones a través de la enzima ATP sintasa en:",
        recurso_visual: null,
        opciones: ["A) La membrana mitocondrial interna.", "B) El estroma del cloroplasto.", "C) El retículo endoplásmico rugoso.", "D) El lisosoma secundario."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000052', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un satélite geostacionario se caracteriza por permanecer fijo sobre el mismo punto del ecuador terrestre debido a que su periodo orbital T es idéntico a:",
        recurso_visual: null,
        opciones: ["A) El periodo de rotación de la Tierra sobre su eje (24 horas).", "B) El periodo de traslación de la Luna alrededor de la Tierra (28 días).", "C) El periodo de traslación de la Tierra alrededor del Sol (365 días).", "D) 12 horas exactas."],
        ok: "A", a: 1.30, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000053', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un isótopo de carbono C-14 difiere de un átomo neutro de carbono C-12 en que posee:",
        recurso_visual: null,
        opciones: ["A) 2 neutrones adicionales en su núcleo atómico.", "B) 2 protones adicionales en su núcleo.", "C) 2 electrones adicionales en su capa de valencia.", "D) Una carga eléctrica neta positiva de +2."],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000054', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En el sistema nervioso humano, la vaina de mielina que recubre los axones neuronales cumple la función de:",
        recurso_visual: null,
        opciones: ["A) Aumentar la velocidad de conducción del impulso nervioso (conducción saltatoria).", "B) Disminuir el consumo de glucosa del cerebro.", "C) Destruir los neurotransmisores en la hendidura sináptica.", "D) Producir líquido cefalorraquídeo en la médula espinal."],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000055', area: 'ciencias_naturales', sub: 'fisica',
        texto: "De acuerdo con el Principio de Bernoulli en mecánica de fluidos, cuando un fluido incompresible fluye a través de un estrechamiento en una tubería horizontal (efecto Venturi):",
        recurso_visual: generateSVG('<path d="M 30 50 L 150 50 L 200 90 L 250 90 L 300 50 L 370 50" fill="none" stroke="%2351e2f5" stroke-width="3"/><path d="M 30 150 L 150 150 L 200 110 L 250 110 L 300 150 L 370 150" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="80" y="100" fill="%23111111" font-size="12">P1, v1</text><text x="215" y="105" fill="%23d4af37" font-size="12">P2, v2</text>'),
        opciones: ["A) La velocidad del fluido aumenta ($v_2 > v_1$) y la presión estática disminuye ($P_2 < P_1$).", "B) La velocidad y la presión aumentan simultáneamente.", "C) La velocidad disminuye y la presión permanece constante.", "D) El fluido se detiene por completo debido a la fricción."],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000056', area: 'ciencias_naturales', sub: 'quimica',
        texto: "En una reacción química representeda por $A + 2B \\rightarrow C$, se mezclan 3 moles del reactivo $A$ con 4 moles del reactivo $B$. ¿Cuál es el reactivo límite y cuántas moles del producto $C$ se pueden formar como máximo?",
        recurso_visual: null,
        opciones: ["A) El reactivo límite es $B$ y se forman máximo 2 moles del producto $C$.", "B) El reactivo límite es $A$ y se forman 3 moles de $C$.", "C) No hay reactivo límite, se consumen en proporción exacta.", "D) El reactivo límite es $C$ y se forman 4 moles de $A$."],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000057', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Si se cruzan dos plantas heterocigotas para el color de la semilla ($Yy$, donde $Y$ es amarillo dominante sobre $y$ verde), de acuerdo con la Primera Ley de Mendel, ¿cuál es la proporción fenotípica esperada en la descendencia?",
        recurso_visual: generateSVG('<rect x="100" y="40" width="160" height="120" fill="none" stroke="%2351e2f5" stroke-width="2"/><line x1="180" y1="40" x2="180" y2="160" stroke="%2351e2f5"/><line x1="100" y1="100" x2="260" y2="100" stroke="%2351e2f5"/><text x="130" y="80" fill="%23d4af37">YY</text><text x="210" y="80" fill="%23d4af37">Yy</text><text x="130" y="140" fill="%23d4af37">Yy</text><text x="210" y="140" fill="%232ecc71">yy</text>'),
        opciones: ["A) 75% semillas amarillas y 25% semillas verdes (3:1).", "B) 50% semillas amarillas y 50% semillas verdes (1:1).", "C) 100% semillas amarillas.", "D) 100% semillas verdes."],
        ok: "A", a: 1.50, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000058', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Tres resistencias idénticas de $R = 6\\ \\Omega$ se conectan en paralelo a una batería de $12\\text{ V}$. ¿Cuál es la resistencia equivalente $R_{eq}$ del circuito y la corriente total producida?",
        recurso_visual: null,
        opciones: ["A) $R_{eq} = 2\\ \\Omega$ y corriente total $I = 6\\text{ A}$.", "B) $R_{eq} = 18\\ \\Omega$ y corriente total $I = 0,66\\text{ A}$.", "C) $R_{eq} = 6\\ \\Omega$ y corriente total $I = 2\\text{ A}$.", "D) $R_{eq} = 3\\ \\Omega$ y corriente total $I = 4\\text{ A}$."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000059', area: 'ciencias_naturales', sub: 'quimica',
        texto: "El grupo funcional orgánico caracterizado por un átomo de carbono unido a un oxígeno mediante un doble enlace y a un grupo hidroxilo mediante un enlace sencillo ($\\text{-COOH}$) corresponde a:",
        recurso_visual: null,
        opciones: ["A) Ácido carboxílico", "B) Aldehído alifático", "C) Éster aromático", "D) Cetona secundaria"],
        ok: "A", a: 1.40, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000060', area: 'ciencias_naturales', sub: 'biologia',
        texto: "El vertimiento no controlado de mercurio (Hg) proveniente de la minería ilegal en un río provoca el fenómeno ecológico de biomagnificación. ¿En qué nivel trófico del ecosistema acuático se registrará la mayor concentración de este metal pesado?",
        recurso_visual: null,
        opciones: ["A) Depredadores tope (ej. peces carnívoros grandes y aves piscívoras).", "B) Fitoplancton autótrofo primario.", "C) Zooplancton herbívoro.", "D) Bacterias descomponedoras de fondo."],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000061', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Una onda sonora se propaga en el aire a una velocidad de $340\\text{ m/s}$ con una frecuencia constante de $170\\text{ Hz}$. Calcule la longitud de onda $\\lambda$ correspondiente:",
        recurso_visual: null,
        opciones: ["A) $\\lambda = 2\\text{ metros}$", "B) $\\lambda = 0,5\\text{ metros}$", "C) $\\lambda = 57.800\\text{ metros}$", "D) $\\lambda = 170\\text{ metros}$"],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000062', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Durante la oxidación del ion sulfito a ion sulfato según la semirreacción $\\text{SO}_3^{2-} + \\text{H}_2\\text{O} \\rightarrow \\text{SO}_4^{2-} + 2\\text{H}^+ + 2e^-$, el estado de oxidación del azufre cambia de:",
        recurso_visual: null,
        opciones: ["A) +4 a +6 (pierde 2 electrones)", "B) +2 a +4 (gana 2 electrones)", "C) -2 a 0 (pierde 1 electrón)", "D) +6 a +4 (gana 2 electrones)"],
        ok: "A", a: 1.80, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000063', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En un ecosistema terrestre, el crecimiento de una población de roedores sigue un modelo sigmoide o logístico. Cuando la población alcanza la capacidad de carga ($K$) del hábitat:",
        recurso_visual: generateSVG('<path d="M 30 170 Q 150 170 180 60 L 370 60" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="30" y1="60" x2="370" y2="60" stroke="%23e74c3c" stroke-dasharray="4"/><text x="280" y="50" fill="%23e74c3c" font-size="12">Capacidad de Carga K</text>'),
        opciones: ["A) La tasa de natalidad iguala a la tasa de mortalidad y la tasa de crecimiento neto se aproxima a cero.", "B) La población se extingue inmediatamente por falta total de oxígeno.", "C) La tasa de natalidad se duplica cada generación indefinidamente.", "D) La competencia intraespecífica desaparece."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000064', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un bloque de hierro de $2\\text{ kg}$ se calienta desde $20^\\circ\\text{C}$ hasta $70^\\circ\\text{C}$. Si el calor específico del hierro es $c = 450\\ \\text{J/(kg}\\cdot^\\circ\\text{C)}$, determine la cantidad de calor $Q$ absorbida por el metal:",
        recurso_visual: null,
        opciones: ["A) $45.000\\text{ Julios}$", "B) $22.500\\text{ Julios}$", "C) $63.000\\text{ Julios}$", "D) $18.000\\text{ Julios}$"],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000065', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Al disolver $58,5\\text{ g}$ de cloruro de sodio (NaCl, masa molar $\\approx 58,5\\text{ g/mol}$) en agua hasta completar $2\\text{ litros}$ de solución acuosa, la concentración molar de la solución obtenida es:",
        recurso_visual: null,
        opciones: ["A) $0,5\\text{ M}$", "B) $1,0\\text{ M}$", "C) $2,0\\text{ M}$", "D) $0,25\\text{ M}$"],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000066', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La fotosíntesis consta de una fase luminosa (dependiente de la luz) y una fase oscura (ciclo de Calvin). ¿Cuál es la función principal de la fase luminosa que ocurre en los tilacoides?",
        recurso_visual: null,
        opciones: ["A) Convertir la energía solar en energía química en forma de ATP y NADPH, liberando $O_2$ por fotólisis del agua.", "B) Fijar directamente las moléculas de $CO_2$ atmosférico para formar glucosa.", "C) Consumir glucosa para generar calor metabólico en la planta.", "D) Absorber sales minerales del suelo por transporte activo."],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000067', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un imán permanente se introduce y extrae repetidamente en el interior de una bobina de cobre conectada a un galvanómetro. Se observa la generación de una corriente eléctrica inducida. Este principio rige el funcionamiento de los generadores y fue descubierto por:",
        recurso_visual: generateSVG('<path d="M 100 100 C 120 40 180 40 200 100 C 220 160 280 160 300 100" fill="none" stroke="%2351e2f5" stroke-width="3"/><rect x="180" y="80" width="80" height="40" fill="%23e74c3c"/><text x="195" y="105" fill="%23111111">N  S</text>'),
        opciones: ["A) Ley de Inducción de Faraday", "B) Ley de Gravitación de Newton", "C) Efecto Fotoeléctrico de Einstein", "D) Ley de Coulomb electrostática"],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000068', area: 'ciencias_naturales', sub: 'quimica',
        texto: "De acuerdo con el principio de Le Chatelier, para el sistema en equilibrio endotérmico $N_2O_4(g) + \\text{calor} \\rightleftharpoons 2NO_2(g)$, un incremento en la temperatura del reactor desplazará el equilibrio hacia:",
        recurso_visual: null,
        opciones: ["A) La derecha (formación de más producto $NO_2$), absorbiendo el exceso de calor.", "B) La izquierda (formación de más reactivo $N_2O_4$).", "C) No genera ningún cambio en las concentraciones.", "D) La precipitación sólida del nitrógeno."],
        ok: "A", a: 1.80, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000069', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En el ciclo celular eucarionte, la duplicación exacta del material genético (replicación del ADN) tiene lugar durante:",
        recurso_visual: null,
        opciones: ["A) La fase S (Síntesis) de la Interfase.", "B) La metafase mitótica.", "C) La citocinesis final.", "D) La profase I meiótica."],
        ok: "A", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000070', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un buzo se sumerge a $20\\text{ metros}$ de profundidad en el mar (densidad del agua de mar $\\rho = 1025\\text{ kg/m}^3$, $g \\approx 10\\text{ m/s}^2$). Si la presión atmosférica en la superficie es $101.300\\text{ Pa}$, la presión total o absoluta que soporta el buzo es aproximadamente:",
        recurso_visual: null,
        opciones: ["A) $306.300\\text{ Pa}$ (aproximadamente $3\\text{ atmósferas}$).", "B) $205.000\\text{ Pa}$.", "C) $101.300\\text{ Pa}$.", "D) $500.000\\text{ Pa}$."],
        ok: "A", a: 1.75, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000071', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un enlace químico covalente no polar se forma cuando dos átomos comparten electrones y:",
        recurso_visual: null,
        opciones: ["A) La diferencia de electronegatividad entre ellos es nula o casi nula ($\\Delta EN \\approx 0$).", "B) Un átomo cede definitivamente sus electrones al otro generando iones.", "C) Existe una gran diferencia de electronegatividad superior a 2,0.", "D) Participan exclusivamente metales de transición."],
        ok: "A", a: 1.45, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000072', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En las comunidades biológicas, la relación simbiótica en la cual una especie se beneficia alimentándose de otra sin causarle la muerte inmediata se denomina:",
        recurso_visual: null,
        opciones: ["A) Parasitismo", "B) Comensalismo", "C) Mutualismo", "D) Competencia interespecífica"],
        ok: "A", a: 1.30, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000073', area: 'ciencias_naturales', sub: 'fisica',
        texto: "La Ley de Conservación de la Energía Mecánica establece que en ausencia de fuerzas disipativas (como el rozamiento):",
        recurso_visual: null,
        opciones: ["A) La suma de la energía cinética y la energía potencial permanece constante ($E_k + E_p = Cte$).", "B) La energía potencial se destruye progresivamente.", "C) La energía cinética se duplica cada segundo de caída.", "D) La masa del objeto se convierte completamente en luz."],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000074', area: 'ciencias_naturales', sub: 'quimica',
        texto: "El pH de una solución acuosa neutra a $25^\\circ\\text{C}$ es igual a 7. Si se mide el pH de un jugo de limón y se obtiene un valor de 2, ¿cuántas veces es mayor la concentración de iones $[H^+]$ en el jugo de limón respecto al agua pura?",
        recurso_visual: null,
        opciones: ["A) $100.000$ veces mayor ($10^5$)", "B) $5$ veces mayor", "C) $50$ veces mayor", "D) $10$ veces mayor"],
        ok: "A", a: 1.85, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000075', area: 'ciencias_naturales', sub: 'biologia',
        texto: "Durante la fotosíntesis en la fase luminosa que ocurre en la membrana de los tilacoides de los cloroplastos, la fotólisis del agua produce oxígeno gaseoso ($O_2$), electrones y protones ($H^+$). El rol biológico principal de estos electrones liberate es:",
        recurso_visual: null,
        opciones: ["A) Reponer los electrones perdidos por el fotosistema II para sostener la cadena transportadora.", "B) Sintetizar directamente moléculas de glucosa en el estroma.", "C) Inhibir la enzima Rubisco para evitar la fotorrespiración.", "D) Neutralizar la acidez del citoplasma celular."],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000076', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un circuito eléctrico en serie consta de una batería de $12\\text{ V}$ y dos resistencias $R_1 = 4\\ \\Omega$ y $R_2 = 2\\ \\Omega$. Calcule la intensidad de corriente eléctrica total ($I$) que circula por el circuito:",
        recurso_visual: generateSVG('<rect x="50" y="50" width="200" height="100" fill="none" stroke="%2351e2f5" stroke-width="2"/><text x="130" y="45" fill="%23d4af37" font-size="12">R1 = 4 ohm</text><text x="130" y="165" fill="%23d4af37" font-size="12">R2 = 2 ohm</text><text x="35" y="105" fill="%23a855f7" font-size="12">V = 12V</text>'),
        opciones: ["A) $2\\text{ Amperios}$", "B) $6\\text{ Amperios}$", "C) $3\\text{ Amperios}$", "D) $1\\text{ Amperio}$"],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000077', area: 'ciencias_naturales', sub: 'quimica',
        texto: "De acuerdo con el Principio de Le Chatelier, en el sistema en equilibrio gaseoso endotérmico $N_2O_4(g) + \\text{calor} \\rightleftharpoons 2NO_2(g)$, un incremento en la temperatura del sistema provocará:",
        recurso_visual: null,
        opciones: ["A) Un desplazamiento del equilibrio hacia la derecha, aumentando la formación de $NO_2(g)$.", "B) Un desplazamiento del equilibrio hacia la izquierda, favoreciendo el $N_2O_4(g)$.", "C) Ningún cambio en las concentraciones de reactivos y productos.", "D) La detención inmediata de las colisiones moleculares."],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000078', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En la herencia mendeliana, el cruzamiento de dos individuos heterocigotos ($Aa \\times Aa$) para un carácter monogénico con dominancia completa genera una proporción fenotípica teórica de:",
        recurso_visual: null,
        opciones: ["A) $3:1$ (75% dominante : 25% recesivo)", "B) $1:2:1$ (25% dominante : 50% heterocigoto : 25% recesivo)", "C) $1:1$ (50% dominante : 50% recesivo)", "D) $100\\%$ fenotipo recesivo"],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000079', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un objeto realiza un Movimiento ARMÓNICO Simple (MAS) atado a un resorte en una superficie horizontal sin rozamiento. En los extremos de la oscilación (máxima amplitud $A$), la energía cinética es cero y:",
        recurso_visual: null,
        opciones: ["A) La energía potencial elástica es máxima ($E_p = \\frac{1}{2}kA^2$).", "B) La aceleración del objeto es exactamente igual a cero.", "C) La velocidad del objeto alcanza su valor máximo absoluto.", "D) La fuerza restauradora del resorte se anula por completo."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000080', area: 'ciencias_naturales', sub: 'quimica',
        texto: "La Ley de Boyle-Mariotte establece que para una masa fija de gas ideal mantenida a temperatura constante ($T = Cte$), la presión ($P$) y el volumen ($V$) cumplen que:",
        recurso_visual: null,
        opciones: ["A) Son inversamente proporcionales ($P_1 V_1 = P_2 V_2$).", "B) Son directamente proporcionales ($P/V = Cte$).", "C) La suma de presión y volumen es siempre $100$.", "D) El volumen se duplica al duplicarse la presión."],
        ok: "A", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000081', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En la teoría neodarwinista de la evolución (Teoría Sintética), la principal fuente originaria de variabilidad genética sobre la que actúa la selección natural es:",
        recurso_visual: null,
        opciones: ["A) Las mutaciones aleatorias en el ADN y la recombinación meiótica.", "B) El uso y desuso continuado de los órganos según Jean-Baptiste Lamarck.", "C) El aislamiento geográfico sin cambios mutacionales.", "D) La transmisión de caracteres adquiridos durante la vida del organismo."],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000082', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un rayo de luz pasa del aire (índice de refracción $n_1 = 1,0$) al agua ($n_2 = 1,33$). Al penetrar en el agua, la velocidad de propagación de la luz disminuye y el rayo:",
        recurso_visual: null,
        opciones: ["A) Se desvía acercándose a la recta normal a la superficie de interfaz.", "B) Se desvía alejándose de la recta normal a la superficie.", "C) Mantiene exactamente su dirección original sin sufrir refracción.", "D) Se refleja completamente formando un ángulo de $90^\\circ$."],
        ok: "A", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000083', area: 'ciencias_naturales', sub: 'quimica',
        texto: "En una reacción de neutralización ácido-base estequiométrica entre ácido clorhídrico ($HCl$) e hidróxido de sodio ($NaOH$), los productos de reacción formados son:",
        recurso_visual: null,
        opciones: ["A) Cloruro de sodio ($NaCl$) y agua ($H_2O$).", "B) Gas cloro ($Cl_2$) y gas hidrógeno ($H_2$).", "C) Óxido de sodio ($Na_2O$) y ácido sulfúrico ($H_2SO_4$).", "D) Bicarbonato de sodio ($NaHCO_3$) y amoníaco."],
        ok: "A", a: 1.35, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000084', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La enzima ADN polimerasa sintetiza una nueva hebra complementaria de ADN exclusivamente en la dirección:",
        recurso_visual: null,
        opciones: ["A) De 5' a 3' agregando nucleótidos al extremo 3'-OH libre.", "B) De 3' a 5' sin requerir cebadores de ARN.", "C) En ambas direcciones $5' \\to 3'$ y $3' \\to 5'$ simultáneamente.", "D) De manera aleatoria según la concentración de ATP."],
        ok: "A", a: 1.75, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000085', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un bloque de $5\\text{ kg}$ de masa es arrastrado sobre una mesa horizontal por una fuerza constante de $20\\text{ N}$. Si la fuerza de fricción opuesta al movimiento es de $5\\text{ N}$, calcule la aceleración neta del bloque:",
        recurso_visual: null,
        opciones: ["A) $3\\text{ m/s}^2$", "B) $4\\text{ m/s}^2$", "C) $5\\text{ m/s}^2$", "D) $15\\text{ m/s}^2$"],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000086', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Se mezclan $100\\text{ mL}$ de una solución de $NaCl\\ 2,0\\text{ M}$ con $100\\text{ mL}$ de agua destilada. ¿Cuál es la concentración molar final de la solución diluida resultante?",
        recurso_visual: null,
        opciones: ["A) $1,0\\text{ M}$", "B) $0,5\\text{ M}$", "C) $4,0\\text{ M}$", "D) $2,0\\text{ M}$"],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000087', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En el ciclo celular, la fase en la cual la célula replica de manera exacta su material genético (ADN) dentro del núcleo se denomina:",
        recurso_visual: null,
        opciones: ["A) Fase S (Síntesis) de la interfase.", "B) Fase G1 previa a la división.", "C) Anafase mitótica.", "D) Citocinesis celular."],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000088', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un gas encerrado a volumen constante se calienta de $300\\text{ K}$ a $600\\text{ K}$. De acuerdo con la Ley de Gay-Lussac ($P/T = Cte$), la presión del gas:",
        recurso_visual: null,
        opciones: ["A) Se duplica respecto a su valor inicial.", "B) Se reduce a la mitad.", "C) Se cuadruplica.", "D) Permanece inalterada."],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000089', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Los hidrocarburos que contienen únicamente enlaces sencillos carbono-carbono ($C-C$) en su estructura molecular pertenecen a la familia orgánica de los:",
        recurso_visual: null,
        opciones: ["A) Alcanos.", "B) Alquenos.", "C) Alquinos.", "D) Ésteres."],
        ok: "A", a: 1.30, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000090', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En la cadena trófica de un ecosistema, la pérdida progresiva de energía aprovechable al pasar de un nivel trófico al siguiente (aproximadamente $90\\%$ de pérdida) se explica por:",
        recurso_visual: null,
        opciones: ["A) La Segunda Ley de la Termodinámica (disipación de calor por respiración celular).", "B) La Ley de Gravitación Universal de Newton.", "C) La ausencia de descomponedores en el suelo.", "D) La acumulación ilimitada de biomasa en carnívoros."],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000091', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Una onda sonora se propaga a través de un medio gaseoso a $340\\text{ m/s}$ con una frecuencia de $170\\text{ Hz}$. Calcule la longitud de onda ($\\lambda$) correspondiente:",
        recurso_visual: null,
        opciones: ["A) $2\\text{ metros}$", "B) $0,5\\text{ metros}$", "C) $57.800\\text{ metros}$", "D) $4\\text{ metros}$"],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000092', area: 'ciencias_naturales', sub: 'quimica',
        texto: "En una pila galvánica (celda electroquímica espontánea), la semirreacción de oxidación donde se pierden electrones ocurre siempre en el electrodo denominado:",
        recurso_visual: null,
        opciones: ["A) Ánodo.", "B) Cátodo.", "C) Puente salino.", "D) Electrolito inerte."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000093', area: 'ciencias_naturales', sub: 'biologia',
        texto: "El fenómeno ecológico mediante el cual una sustancia tóxica liposoluble (como el mercurio o los plaguicidas organoclorados) incrementa su concentración a lo largo de los niveles tróficos sucesivos se denomina:",
        recurso_visual: null,
        opciones: ["A) Bioacumulación o biomagnificación trófica.", "B) Eutrofización acuática.", "C) Sucesión ecológica primaria.", "D) Fitorremediación microbiana."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000094', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un objeto sumergido en un fluido recibe un empuje vertical hacia arriba igual al peso del volumen del fluido desalojado. Este principio físico fue formulado por:",
        recurso_visual: null,
        opciones: ["A) Arquímedes.", "B) Pascal.", "C) Bernoulli.", "D) Torricelli."],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000095', area: 'ciencias_naturales', sub: 'quimica',
        texto: "En la tabla periódica, los elementos pertenecientes al Grupo 18 (VIII A) se caracterizan por presentar su capa de valencia completa (configuración $ns^2 np^6$, salvo el Helio) y por ende exhiben:",
        recurso_visual: null,
        opciones: ["A) Altísima estabilidad química y muy baja reactividad (Gases Nobles).", "B) Alta tendencia a ceder electrones para formar cationes monopositivos.", "C) Electronegatividad máxima dentro de su periodo.", "D) Carácter metálico extremadamente dúcil y maleable."],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000096', area: 'ciencias_naturales', sub: 'biologia',
        texto: "La hormona producida por el páncreas endocrino que promueve la captación de glucosa por parte de las células y disminuye la glucemia en sangre se denomina:",
        recurso_visual: null,
        opciones: ["A) Insulina.", "B) Glucagón.", "C) Adrenalina.", "D) Cortisol."],
        ok: "A", a: 1.40, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000097', area: 'ciencias_naturales', sub: 'fisica',
        texto: "Según la Primera Ley de la Termodinámica ($\\Delta U = Q - W$), si a un gas ideal se le suministran $500\\text{ J}$ de calor ($Q$) y realiza un trabajo de expansión sobre el entorno de $200\\text{ J}$ ($W$), la variación de su energía interna ($\\Delta U$) es:",
        recurso_visual: null,
        opciones: ["A) $+300\\text{ Joules}$", "B) $+700\\text{ Joules}$", "C) $-300\\text{ Joules}$", "D) $+1.000\\text{ Joules}$"],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000098', area: 'ciencias_naturales', sub: 'quimica',
        texto: "Un cambio químico se diferencia de un cambio físico porque en el primero:",
        recurso_visual: null,
        opciones: ["A) Ocurre una reorganización de enlaces atómicos generando nuevas sustancias con propiedades químicas distintas.", "B) La sustancia únicamente cambia de estado de agregación (ej. fusión del hielo).", "C) La masa total del sistema disminuye drásticamente a la mitad.", "D) Los átomos componentes cambian de número atómico en el núcleo."],
        ok: "A", a: 1.35, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '33333333-0000-4000-8000-000000000099', area: 'ciencias_naturales', sub: 'biologia',
        texto: "En los ecosistemas marinos de profundidad donde no llega la luz solar (zonas afóticas), la producción primaria de materia orgánica es llevada a cabo por bacterias chemoautótrofas mediante:",
        recurso_visual: null,
        opciones: ["A) Quimiosíntesis utilizando la oxidación de compuestos inorgánicos como el sulfuro de hidrógeno ($H_2S$).", "B) Fotosíntesis oxigénica nocturna.", "C) Fermentación alcohólica anaerobia obligada.", "D) Descomposición de plástico flotante."],
        ok: "A", a: 1.75, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

const reactivosGen = generarReactivosCienciasMasivos(1000);
export const reactivosCienciasNaturales = [...reactivosSeed, ...reactivosGen];