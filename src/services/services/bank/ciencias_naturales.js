// 🧪 src/services/bank/ciencias_naturales.js - 50 Reactivos Calibrados ICFES Saber 11
const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="background:%230d0f14;font-family:sans-serif;">${content}</svg>`;

export const reactivosCienciasNaturales = [
    {
        area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un vehículo reduce su velocidad uniformemente de 24 m/s a 0 m/s en un intervalo de 6 segundos al aproximarse a un semáforo. La magnitud de su desaceleración constante es de:",
        recurso_visual: generateSVG('<line x1="30" y1="160" x2="370" y2="160" stroke="%23ffffff" stroke-width="2"/><rect x="50" y="110" width="80" height="40" rx="5" fill="%2351e2f5"/><text x="60" y="135" fill="%23000000" font-weight="bold" font-size="12">V1 = 24m/s</text><rect x="270" y="110" width="80" height="40" rx="5" fill="%23e74c3c"/><text x="280" y="135" fill="%23ffffff" font-weight="bold" font-size="12">V2 = 0m/s</text><text x="170" y="90" fill="%23d4af37" font-size="14">t = 6s</text>'),
        opciones: ["A) 4 m/s²", "B) 8 m/s²", "C) 144 m/s²", "D) 24 m/s²"],
        ok: "A", a: 1.40, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
        texto: "Dos bloques de masas m1 = 2 kg y m2 = 6 kg se encuentran sobre una superficie horizontal lisa sin fricción. Si se les aplica una fuerza neta idéntica de 12 N a ambos cuerpos de manera independiente, la relación entre sus aceleraciones (a1 / a2) es:",
        recurso_visual: generateSVG('<rect x="50" y="100" width="50" height="50" fill="%2351e2f5"/><text x="65" y="130" fill="%2300" font-size="12">2kg</text><rect x="220" y="70" width="80" height="80" fill="%232ecc71"/><text x="245" y="115" fill="%2300" font-size="12">6kg</text><line x1="20" y1="150" x2="380" y2="150" stroke="%23ffffff" stroke-width="2"/>'),
        opciones: ["A) 1 : 3", "B) 3 : 1", "C) 1 : 1", "D) 4 : 1"],
        ok: "B", a: 1.60, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
        texto: "Una resistencia eléctrica de 10 ohmios se conecta a una fuente de corriente continua de 20 voltios. La potencia disipada en forma de calor por efecto Joule en la resistencia es de:",
        recurso_visual: generateSVG('<rect x="100" y="50" width="200" height="100" fill="none" stroke="%2351e2f5" stroke-width="3"/><rect x="180" y="40" width="40" height="20" fill="%23d4af37"/><text x="185" y="35" fill="%23ffffff" font-size="10">R = 10 Ω</text><text x="50" y="105" fill="%232ecc71" font-size="12">V = 20V</text>'),
        opciones: ["A) 2 vatios", "B) 40 vatios", "C) 200 vatios", "D) 10 vatios"],
        ok: "B", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un fluido incompresible circula a través de una tubería horizontal que reduce su diámetro a la mitad. De acuerdo con la ecuación de continuidad y el principio de Bernoulli, al reducirse la sección transversal de la tubería:",
        recurso_visual: generateSVG('<path d="M 30 60 L 200 60 L 200 80 L 370 80 L 370 120 L 200 120 L 200 140 L 30 140 Z" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="80" y="105" fill="%23ffffff" font-size="12">V1 (Lento)</text><text x="250" y="105" fill="%23d4af37" font-size="12">V2 (Rápido)</text>'),
        opciones: ["A) La velocidad del fluido aumenta y la presión estática disminuye.", "B) La velocidad del fluido disminuye y la presión estática aumenta.", "C) La velocidad y la presión aumentan simultáneamente.", "D) La velocidad y la presión permanecen constantes."],
        ok: "A", a: 1.85, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
        texto: "Un rayo de luz blanca atraviesa un prisma de cristal transparente y se descompone en un abanico de colores del espectro visible (rojo, naranja, amarillo, verde, azul y violeta). Este fenómeno se conoce como:",
        recurso_visual: generateSVG('<polygon points="100,160 200,40 300,160" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="30" y1="120" x2="150" y2="100" stroke="%23ffffff" stroke-width="3"/><path d="M 250 100 L 370 60 M 250 100 L 370 80 M 250 100 L 370 100 M 250 100 L 370 120" stroke="%23e74c3c" stroke-width="2"/>'),
        opciones: ["A) Dispersión refractiva de la luz", "B) Polarización magnética", "C) Difracción por rendija estrecha", "D) Reflexión total interna"],
        ok: "A", a: 1.40, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    {
        area: 'ciencias_naturales', sub: 'fisica',
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
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
    {
        area: 'ciencias_naturales', sub: 'biologia',
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
    }
];