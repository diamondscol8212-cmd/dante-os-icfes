// 📖 src/services/bank/lectura_critica.js - 50 Reactivos Calibrados ICFES Saber 11
import { generarReactivosLecturaMasivos } from './generatorLectura.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="background:%230d0f14;font-family:sans-serif;">${content}</svg>`;

const reactivosSeed = [
    { id: 'item_lect_01', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Lea el siguiente fragmento:\n\n«La ciencia no busca verdades absolutas, sino explicaciones provisionales revisables ante nueva evidencia experimental.»\n\n¿Cuál es la función del término 'provisionales' en el contexto del argumento del autor?",
        recurso_visual: null,
        opciones: [
            "A) Destacar que el conocimiento científico está abierto a revisiones y perfeccionamiento constante.",
            "B) Argumentar que las hipótesis científicas carecen de rigor o utilidad práctica.",
            "C) Demostrar que la evidencia experimental es irrelevante para la formulación de teorías.",
            "D) Sugerir que la ciencia debe ser reemplazada por verdades dogmáticas e inmutables."
        ],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 }
    },
    { id: '22222222-0000-4000-8000-000000000001', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un editorialista escribe: 'Si bien la tecnología fomenta la interconexión global, su uso desmedido en adolescentes erosiona la capacidad de sostener atención prolongada en lecturas complejas'. ¿Cuál de las siguientes afirmaciones sintetiza la tesis central del autor?",
        recurso_visual: null,
        opciones: ["A) La tecnología debe prohibirse en entornos educativos.", "B) La conectividad digital tiene consecuencias negativas en los hábitos cognitivos de lectura.", "C) Los adolescentes leen más libros impresos hoy que en décadas pasadas.", "D) La atención prolongada es una cualidad innata que no se altera con la tecnología."],
        ok: "B", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000002', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el Mito de la Caverna de Platón, los prisioneros confunden las sombras proyectadas en la pared con la realidad verdadera. En el contexto filosófico, las sombras representan:",
        recurso_visual: null,
        opciones: ["A) El conocimiento empírico derivado de las percepciones sensoriales engañosas.", "B) La verdad absoluta alcanzada mediante la razón pura.", "C) Las leyes científicas comprobadas en laboratorios.", "D) Las ideas abstractas e inmutables del mundo inteligible."],
        ok: "A", a: 1.80, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000003', area: 'lectura_critica', sub: 'semantica',
        texto: "En un texto sobre la economía global, el autor afirma que 'el mercado financiero opera bajo una miopía crónica'. La expresión 'miopía crónica' se emplea en el texto como una metáfora para indicar que:",
        recurso_visual: null,
        opciones: ["A) Los inversores padecen problemas oftalmológicos reales por el uso de pantallas.", "B) Las decisiones financieras priorizan el beneficio a corto plazo ignorando riesgos estructurales futuros.", "C) Los gobiernos regulan con deficiencia las bolsas de valores del mundo.", "D) La economía carece de datos estadísticos confiables a largo plazo."],
        ok: "B", a: 1.45, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000004', area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "Examine la siguiente ilustración satírica sobre la infraestructura pública. El propósito comunicativo dominante del caricaturista es:",
        recurso_visual: generateSVG('<rect x="30" y="40" width="160" height="120" fill="%231a1d26" stroke="%2351e2f5" stroke-width="2"/><text x="50" y="80" fill="%23d4af37" font-size="12">BIBLIOTECA PÚBLICA</text><text x="70" y="120" fill="%23e74c3c" font-size="14">[ VACÍA ]</text><rect x="220" y="40" width="150" height="120" fill="%231a1d26" stroke="%232ecc71" stroke-width="2"/><text x="240" y="80" fill="%232ecc71" font-size="12">CASA DE APUESTAS</text><path d="M 230 130 L 260 130 M 270 130 L 300 130 M 310 130 L 340 130" stroke="%23ffffff" stroke-width="4"/><text x="240" y="150" fill="%23ffffff" font-size="10">FILA CIUDADANA</text>'),
        opciones: ["A) Promover la asistencia masiva a las casas de apuestas comerciales.", "B) Criticar la demagogia institucional al inaugurar infraestructura sin dotación real frente a crisis sociales.", "C) Demostrar que las bibliotecas públicas ya no son útiles en la era digital.", "D) Elogiar la rápida gestión de obras públicas del gobierno local."],
        ok: "B", a: 1.35, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000005', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un fragmento científico sostiene: 'Los fósiles hallados en la formación geológica sugieren que el altiplano cundiboyacense estuvo cubierto por un cuerpo de agua somero hace millones de años'. A partir de este enunciado, se puede inferir válidamente que:",
        recurso_visual: null,
        opciones: ["A) Los fósiles encontrados corresponden exclusivamente a mamíferos terrestres modernos.", "B) Las condiciones climáticas y geográficas de la región han experimentado transformaciones drásticas.", "C) El agua del altiplano desapareció por intervención humana directa en la antigüedad.", "D) El relieve actual de la cordillera de los Andes permaneció estático desde el Precámbrico."],
        ok: "B", a: 1.50, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000006', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un defensor del medio ambiente argumenta: 'Debemos prohibir los plásticos de un solo uso porque los océanos están llenos de microplásticos que afectan la fauna marina'. Un opositor responde: 'Si prohibimos el plástico, miles de empleos en la industria manufacturera se perderán inmediatamente'. El argumento del opositor se centra en:",
        recurso_visual: null,
        opciones: ["A) Invalidar la evidencia científica sobre los microplásticos marinos.", "B) Oponer un perjuicio socioeconómico directo para desviar el debate ecológico.", "C) Demostrar que el plástico es un material biodegradable a largo plazo.", "D) Proponer una alternativa tecnológica más limpia para las fábricas."],
        ok: "B", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000007', area: 'lectura_critica', sub: 'semantica',
        texto: "En una novela clásica se lee: 'El silencio de la sala era tan espeso que podía cortarse con un cuchillo'. Esta figura retórica cumple la función de:",
        recurso_visual: null,
        opciones: ["A) Describir un fenómeno físico medible con instrumentos acústicos.", "B) Exagerar mediante una imagen sensorial táctil la absoluta quietud del ambiente.", "C) Demostrar que había un cuchillo escondido en la habitación.", "D) Señalar un conflicto violento entre los personajes presentes."],
        ok: "B", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000008', area: 'lectura_critica', sub: 'filosofia',
        texto: "Para Immanuel Kant, la Ilustración se define como la salida del hombre de su minoría de edad imputable a él mismo. Esta 'minoría de edad' alude específicamente a:",
        recurso_visual: null,
        opciones: ["A) La incapacidad biológica de los niños para firmar contratos legales.", "B) La pereza y cobardía para servirse del propio entendimiento sin la guía de otros.", "C) La prohibición de estudiar en universidades públicas.", "D) La dependencia exclusiva de la tecnología moderna."],
        ok: "B", a: 1.70, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000009', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un informe epidemiológico indica que el consumo de bebidas azucaradas guarda una correlación directa con el incremento de diabetes tipo 2. Un lector concluye de inmediato que 'el azúcar produce diabetes en el 100% de los casos'. Lógicamente, esta conclusión es apresurada porque:",
        recurso_visual: null,
        opciones: ["A) Una correlación estadística no demuestra causalidad absoluta ni opera igual en todos los organismos.", "B) El informe fue financiado por la industria de refrescos.", "C) La diabetes tipo 2 solo se transmite de padres a hijos.", "D) Las bebidas azucaradas no contienen glucosa real."],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000010', area: 'lectura_critica', sub: 'argumentacion',
        texto: "En un ensayo sobre estética, el autor sostiene que 'el arte no debe buscar la belleza complaciente, sino incomodar las certezas del espectador'. De acuerdo con esto, el valor de una obra artística recae en su capacidad para:",
        recurso_visual: null,
        opciones: ["A) Decorar espacios arquitectónicos con armonía visual.", "B) Generar cuestionamientos profundos y sacudir el pensamiento dogmático.", "C) Reproducir fielmente la naturaleza mediante técnicas de pintura realista.", "D) Obtener alta rentabilidad económica en galerías comerciales."],
        ok: "B", a: 1.40, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000011', area: 'lectura_critica', sub: 'filosofia',
        texto: "Lea con atención el siguiente fragmento de Thomas Hobbes: 'En el estado de naturaleza, la vida del hombre es solitaria, pobre, desagradable, brutal y corta'. Para superar esta condición caótica, el filósofo propone que los individuos deben:",
        recurso_visual: null,
        opciones: ["A) Ceder su soberanía individual a un poder absoluto garante del orden (el Leviatán).", "B) Retornar a la vida silvestre sin normas jurídicas ni instituciones.", "C) Abolir la propiedad privada e instaurar el trueque comercial.", "D) Confiar exclusivamente en la bondad innata de los seres humanos."],
        ok: "A", a: 1.75, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000012', area: 'lectura_critica', sub: 'semantica',
        texto: "Considere la oración: 'A pesar de sus esfuerzos infatigables por conciliar a las partes, la brecha ideológica permaneció infranqueable'. El vocablo 'infranqueable' significa en este contexto:",
        recurso_visual: null,
        opciones: ["A) Imposible de superar o atravesar.", "B) Fácilmente negociable con el tiempo.", "C) Relevante únicamente en el ámbito financiero.", "D) Temporal y pasajera."],
        ok: "A", a: 1.30, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000013', area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "Observe la infografía sobre los hábitos de consumo de agua en el hogar. ¿Cuál es el sector de mayor impacto sobre el cual debe centrarse una campaña de ahorro prioritario?",
        recurso_visual: generateSVG('<rect x="50" y="30" width="300" height="30" fill="%23e74c3c"/><text x="60" y="50" fill="%23ffffff" font-size="12">Ducha y Baño (65%)</text><rect x="50" y="70" width="120" height="30" fill="%2351e2f5"/><text x="60" y="90" fill="%23ffffff" font-size="12">Cocina (20%)</text><rect x="50" y="110" width="60" height="30" fill="%232ecc71"/><text x="60" y="130" fill="%23ffffff" font-size="12">Jardín (10%)</text><rect x="50" y="150" width="30" height="30" fill="%23d4af37"/><text x="60" y="170" fill="%23ffffff" font-size="12">Otros (5%)</text>'),
        opciones: ["A) La ducha y los servicios sanitarios domésticos.", "B) El riego de jardines y zonas verdes.", "C) La preparación de alimentos en la cocina.", "D) El lavado de vehículos en garajes."],
        ok: "A", a: 1.20, b: -0.70, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000014', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un autor afirma: 'Invertir en educación básica no es un gasto asistencial, sino la decisión macroeconómica más rentable que un país emergente puede adoptar'. La función del conector 'no... sino' en el texto es:",
        recurso_visual: null,
        opciones: ["A) Oponer y redefinir conceptualmente una idea para fortalecer la tesis.", "B) Listar dos eventos que ocurren simultáneamente en el tiempo.", "C) Expresar una duda irresoluble sobre el presupuesto público.", "D) Concluir un razonamiento matemático mediante inducción."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000015', area: 'lectura_critica', sub: 'inferencia',
        texto: "En un relato de ciencia ficción, los robots realizan todas las tareas laborales mientras los humanos se dedican exclusivamente al ocio contemplativo. Sin embargo, los índices de depresión humana alcanzan niveles récord. Se deduce que el texto sugiere que:",
        recurso_visual: null,
        opciones: ["A) El trabajo y el propósito activo son componentes fundamentales para la salud mental humana.", "B) Los robots deberían ser destruidos para volver a la tecnología primitiva.", "C) El ocio absoluto garantiza la felicidad plena según la ciencia.", "D) La tecnología siempre falla en los cálculos de eficiencia."],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000016', area: 'lectura_critica', sub: 'filosofia',
        texto: "Según el utilitarismo de John Stuart Mill, una acción es moralmente correcta si tiende a promover la mayor felicidad para el mayor número de personas. Frente a un dilema donde debe elegirse entre salvar a una persona o a un grupo de cinco, el utilitarismo prescribe:",
        recurso_visual: null,
        opciones: ["A) Salvar al grupo de cinco personas para maximizar el bienestar colectivo agregativo.", "B) Salvar a la persona individual sin importar el destino de las demás.", "C) Abstenerse de intervenir para no asumir responsabilidad ética.", "D) Decidir mediante un sorteo aleatorio entre ambas opciones."],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000017', area: 'lectura_critica', sub: 'semantica',
        texto: "En la frase 'Su discurso no fue más que un canto de sirena que encandiló a la multitud', la metáfora 'canto de sirena' alude a:",
        recurso_visual: null,
        opciones: ["A) Una propuesta atractiva y seductora pero engañosa y peligrosa.", "B) Una melodía musical de alta calidad interpretada en público.", "C) Un informe técnico respaldado por evidencias científicas irrefutables.", "D) Una crítica destructiva pronunciada con agresividad."],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000018', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un político argumenta: 'Mi opositor propone reformar el sistema de pensiones porque no quiere a los adultos mayores'. Este argumento incurre en la falacia conocida como:",
        recurso_visual: null,
        opciones: ["A) Falacia del hombre de paja (distorsionar la postura del rival para atacarlo fácilmente).", "B) Apelación a la autoridad (Ad Verecundiam).", "C) Generalización apresurada a partir de un solo caso.", "D) Falsa analogía geométrica."],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000019', area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "Examine el siguiente esquema de flujo sobre el proceso de reciclaje de plástico. Si se omite la etapa de clasificación previa, ¿qué consecuencia lógica directa se produce en la cadena?",
        recurso_visual: generateSVG('<rect x="20" y="80" width="80" height="40" fill="%231a1d26" stroke="%2351e2f5"/><text x="30" y="105" fill="%23ffffff" font-size="10">Recolectar</text><line x1="100" y1="100" x2="130" y2="100" stroke="%23ffffff" stroke-width="2"/><rect x="130" y="80" width="80" height="40" fill="%231a1d26" stroke="%23d4af37"/><text x="140" y="105" fill="%23d4af37" font-size="10">Clasificar</text><line x1="210" y1="100" x2="240" y2="100" stroke="%23ffffff" stroke-width="2"/><rect x="240" y="80" width="80" height="40" fill="%231a1d26" stroke="%232ecc71"/><text x="250" y="105" fill="%23ffffff" font-size="10">Triturar</text>'),
        opciones: ["A) La contaminación del polímero resultante al procesar materiales incompatibles.", "B) Un incremento inmediato en la velocidad de recolección en las calles.", "C) La reducción a cero del consumo de energía eléctrica industrial.", "D) El aumento automático del precio de venta de los envases."],
        ok: "A", a: 1.50, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000020', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un historiador escribe: 'Las revoluciones raras veces son provocadas por los extremadamente pobres, sino por las clases medias frustradas cuyas expectativas de ascenso social han sido frenadas repentinamente'. De este análisis se infiere que:",
        recurso_visual: null,
        opciones: ["A) La brecha entre las expectativas sociales y la realidad económica es un detonante clave de inestabilidad política.", "B) Los países con pobreza extrema son inmunes a los movimientos revolucionarios.", "C) La clase media nunca participa en procesos electorales democráticos.", "D) La prosperidad económica garantiza la paz social perpetua."],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000021', area: 'lectura_critica', sub: 'filosofia',
        texto: "En la ética deontológica de Immanuel Kant, el 'imperativo categórico' exige actuar únicamente según aquella máxima que puedas querer al mismo tiempo que se convierta en ley universal. De acuerdo con esto, mentir para evitar un castigo es inaceptable porque:",
        recurso_visual: null,
        opciones: ["A) Si la mentira se universalizara, la confianza humana y la noción misma de verdad colapsarían.", "B) El castigo físico es beneficioso para el desarrollo del carácter individual.", "C) La mentira requiere un esfuerzo memorístico excesivo.", "D) Las leyes civiles prohíben la mentira en todas las circunstancias de la vida."],
        ok: "A", a: 1.80, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000022', area: 'lectura_critica', sub: 'semantica',
        texto: "En un tratado de arquitectura se lee: 'Las ciudades contemporáneas han dejado de ser espacios de cohesión social para convertirse en archipiélagos urbanos incomunicados'. La metáfora 'archipiélagos urbanos' denota:",
        recurso_visual: null,
        opciones: ["A) La fragmentación y aislamiento de los barrios sin conectividad ni integración comunitaria.", "B) Que las ciudades modernas se construyen sobre islas marítimas reales.", "C) Un diseño arquitectónico altamente eficiente basado en canales de agua.", "D) La abundancia de parques y zonas verdes dentro de la metrópoli."],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000023', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un ensayista sostiene que la literatura no debe juzgarse por la corrección política o moral de sus personajes, sino por la profundidad estética y humana de su propuesta. Según el autor, evaluar una obra solo por la conducta moral del protagonista constituye un error de:",
        recurso_visual: null,
        opciones: ["A) Reduccionismo moralista que ignora el valor literario autónomo del texto.", "B) Análisis gramatical defectuoso del lenguaje empleado.", "C) Desconocimiento de la biografía personal del escritor.", "D) Incumplimiento de las normas de derechos de autor."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000024', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un estudio sociológico revela que en los países con jornadas laborales reducidas a 36 horas semanales, los índices de productividad por hora trabajada son superiores a los de países con jornadas de 48 horas. Se infiere lógicamente que:",
        recurso_visual: null,
        opciones: ["A) La fatiga acumulada en jornadas extensas disminuye la eficiencia marginal del trabajador.", "B) Trabajar menos horas siempre garantiza el éxito financiero de cualquier empresa.", "C) Los empleados de jornadas largas no poseen formación profesional adecuada.", "D) Las leyes laborales no tienen impacto en el rendimiento económico."],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000025', area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "Analice el siguiente diagrama sobre la estructura de la verdad en el empirismo inductivo. ¿Qué paso es imprescindible para validar una hipótesis científica antes de elevarla a ley general?",
        recurso_visual: generateSVG('<circle cx="80" cy="100" r="35" fill="%231a1d26" stroke="%2351e2f5" stroke-width="2"/><text x="55" y="105" fill="%23ffffff" font-size="10">Observación</text><line x1="115" y1="100" x2="165" y2="100" stroke="%23ffffff" stroke-width="2"/><circle cx="200" cy="100" r="35" fill="%231a1d26" stroke="%23d4af37" stroke-width="2"/><text x="175" y="105" fill="%23d4af37" font-size="10">Experimento</text><line x1="235" y1="100" x2="285" y2="100" stroke="%23ffffff" stroke-width="2"/><circle cx="320" cy="100" r="35" fill="%231a1d26" stroke="%232ecc71" stroke-width="2"/><text x="295" y="105" fill="%23ffffff" font-size="10">Ley General</text>'),
        opciones: ["A) La contrastación experimental repetible frente a datos empíricos.", "B) La aprobación por aclamación popular en redes sociales.", "C) La publicación inmediata de opiniones personales en prensa.", "D) El respaldo presupuestal del gobierno de turno."],
        ok: "A", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000026', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el existencialismo de Jean-Paul Sartre, la premisa 'la existencia precede a la esencia' significa que el ser humano:",
        recurso_visual: null,
        opciones: ["A) Nace sin una naturaleza predeterminada y se define libremente mediante sus actos y elecciones.", "B) Posee un destino trazado de antemano por fuerzas divinas inmutables.", "C) Es un producto genético condicionado 100% por su biología.", "D) Carece de responsabilidad sobre sus acciones individuales."],
        ok: "A", a: 1.85, b: 0.90, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000027', area: 'lectura_critica', sub: 'semantica',
        texto: "En la expresión 'El juez actuó con ecuanimidad intachable durante todo el juicio', el término 'ecuanimidad' equivale a:",
        recurso_visual: null,
        opciones: ["A) Imparcialidad, neutralidad y serenidad de juicio.", "B) Dureza severa e inflexible hacia el acusado.", "C) Indiferencia absoluta hacia las leyes escritas.", "D) Rapidez para dictar sentencia sin escuchar testimonios."],
        ok: "A", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000028', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un lingüista sostiene que las lenguas originarias indígenas no son 'dialectos primitivos', sino sistemas lingüísticos completos con gramáticas complejas. La intención principal de esta afirmación es:",
        recurso_visual: null,
        opciones: ["A) Refutar un prejuicio eurocéntrico y dignificar el estatus de las lenguas nativas.", "B) Demostrar que el español debe dejar de hablarse en América Latina.", "C) Exigir que todas las universidades dicten sus clases en lenguas indígenas.", "D) Proprobar que los idiomas modernos carecen de reglas gramaticales."],
        ok: "A", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000029', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un análisis literario señala: 'El Realismo Mágico de Gabriel García Márquez no inventa mundos desvinculados de la realidad, sino que poetiza la desmesura cotidiana e historia violenta de América Latina'. Se concluye que:",
        recurso_visual: null,
        opciones: ["A) El Realismo Mágico tiene un anclaje profundo en la memoria sociohistórica del continente.", "B) Cien años de soledad es un libro de historia documental estricta.", "C) La literatura caribeña rechaza cualquier elemento de ficción simbólica.", "D) García Márquez escribió exclusivamente fantasía al estilo europeo."],
        ok: "A", a: 1.60, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000030', area: 'lectura_critica', sub: 'filosofia',
        texto: "Para René Descartes en el Discurso del Método, la duda metódica cumple la función de:",
        recurso_visual: null,
        opciones: ["A) Purgar los conocimientos falsos o heredados hasta hallar una certeza indudable (Pienso, luego existo).", "B) Fomentar el escepticismo radical que niega toda posibilidad de conocimiento.", "C) Demostrar que los sentidos son la fuente más confiable de la ciencia.", "D) Defender los dogmas religiosos sin cuestionamiento rational."],
        ok: "A", a: 1.75, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000031', area: 'lectura_critica', sub: 'semantica',
        texto: "En el párrafo: 'Las reformas institucionales avanzaron a paso de tortuga debido a la burocracia legislativa', la locución 'a paso de tortuga' opera como una figura que connota:",
        recurso_visual: null,
        opciones: ["A) Lentitud extrema e ineficiencia en el ritmo de ejecución.", "B) Sabiduría y prudencia biológica en las decisiones.", "C) Protección absoluta de la fauna silvestre en los debates.", "D) Transparencia y honestidad en el manejo financiero."],
        ok: "A", a: 1.20, b: -0.75, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000032', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un editorial sostiene: 'No podemos esperar que los ciudadanos respeten la ley si las autoridades encargadas de hacerla cumplir son las primeras en violarla impunemente'. La estructura lógica de este argumento se apoya en:",
        recurso_visual: null,
        opciones: ["A) La legitimidad moral como condición previa indispensable para la autoridad jurídica.", "B) La conveniencia de aumentar el sueldo de los funcionarios públicos.", "C) La necesidad de eliminar las leyes escritas en las democracias.", "D) La prohibición absoluta de protestas ciudadanas pacíficas."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000033', area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "En la siguiente caricatura de prensa sobre la adicción a las pantallas móviles, ¿cuál es el sentido implícito de la imagen?",
        recurso_visual: generateSVG('<rect x="150" y="30" width="100" height="150" fill="%231a1d26" stroke="%2351e2f5" stroke-width="3"/><circle cx="200" cy="90" r="30" fill="%23e74c3c"/><line x1="200" y1="120" x2="200" y2="170" stroke="%23ffffff" stroke-width="3"/><text x="160" y="190" fill="%23d4af37" font-size="10">HUMANO ESCLAVIZADO</text>'),
        opciones: ["A) La tecnología ha invertido la relación de dominio, convirtiendo al usuario en siervo del dispositivo.", "B) Los teléfonos inteligentes son herramientas indispensables para el aprendizaje escolar.", "C) Las baterías de los dispositivos electrónicos duran demasiado tiempo.", "D) La industria de telecomunicaciones debe bajar los precios de suscripción."],
        ok: "A", a: 1.40, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000034', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un informe del PNUD indica que el 70% de las tareas de cuidado no remunerado en los hogares latinoamericanos es asumido por mujeres. De esta premisa se infiere que:",
        recurso_visual: null,
        opciones: ["A) Existe una inequidad estructural en la distribución del trabajo doméstico que limita la autonomía económica femenina.", "B) Las mujeres prefieren trabajar exclusivamente en el hogar por vocación natural.", "C) Los hombres realizan todo el trabajo remunerado en el sector bancario.", "D) La economía de un país no depende de las labores del hogar."],
        ok: "A", a: 1.55, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000035', area: 'lectura_critica', sub: 'filosofia',
        texto: "En la filosofía de Friedrich Nietzsche, el concepto de 'Superhombre' (Übermensch) hace referencia al individuo capaz de:",
        recurso_visual: null,
        opciones: ["A) Crear sus propios valores vitales superando la moral dogmática de rebaño.", "B) Poseer fuerza física sobrehumana mediante modificaciones biológicas.", "C) Acatarse ciegamente a los dictámenes morales del Estado absoluto.", "D) Acumular riquezas materiales en el mercado especulativo."],
        ok: "A", a: 1.80, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000036', area: 'lectura_critica', sub: 'semantica',
        texto: "En el fragmento 'La inflación galopante devoró los ahorros de toda una generación', el verbo 'devoró' se utiliza para enfatizar:",
        recurso_visual: null,
        opciones: ["A) La destrucción rápida, voraz e ineludible del poder adquisitivo.", "B) El consumo alimenticio de productos de la canasta familiar.", "C) El crecimiento sostenido de los depósitos bancarios.", "D) La estabilidad de los precios en el comercio informal."],
        ok: "A", a: 1.30, b: -0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000037', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un crítico gastronómico afirma: 'La cocina de autor no busca saciar el hambre biológica, sino despertar emociones estéticas en el comensal'. El argumento contrapone:",
        recurso_visual: null,
        opciones: ["A) La necesidad fisiológica básica frente a la experiencia artística y sensorial.", "B) El precio de los ingredientes importados frente a los productos locales.", "C) La velocidad de servicio en restaurantes rápidos frente a hoteles de lujo.", "D) La nutrición calórica frente a la higiene de los utensilios."],
        ok: "A", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000038', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un análisis pedagógico indica que los niños expuestos a la lectura diaria de cuentos durante su infancia desarrollan un vocabulario 40% más amplio en la adolescencia. Se deduce que:",
        recurso_visual: null,
        opciones: ["A) La estimulación lingüística temprana mediante la lectura fortalece la competencia comunicativa futura.", "B) Leer cuentos infantiles garantiza el ingreso automático a la universidad.", "C) Los adolescentes que no leyeron cuentos son incapaces de aprender a hablar.", "D) El vocabulario solo se adquiere mediante memorización de diccionarios."],
        ok: "A", a: 1.50, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000039', area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "Examine la siguiente tabla comparativa de medios de transporte urbano. ¿Cuál es la alternativa con mayor eficiencia ambiental (menor emisión de CO2 por pasajero)?",
        recurso_visual: generateSVG('<rect x="30" y="30" width="340" height="30" fill="%231a1d26" stroke="%2351e2f5"/><text x="40" y="50" fill="%23ffffff" font-size="11">Bicicleta / Tranvía Eléctrico -> 0g CO2/km</text><rect x="30" y="70" width="340" height="30" fill="%231a1d26" stroke="%23d4af37"/><text x="40" y="90" fill="%23d4af37" font-size="11">Bus Eléctrico -> 15g CO2/km</text><rect x="30" y="110" width="340" height="30" fill="%231a1d26" stroke="%23e74c3c"/><text x="40" y="130" fill="%23e74c3c" font-size="11">Auto Particular Gasolina -> 120g CO2/km</text>'),
        opciones: ["A) La bicicleta y el tranvía eléctrico urbano.", "B) El automóvil particular a gasolina.", "C) El autobús con motor diésel tradicional.", "D) La motocicleta de alta cilindrada."],
        ok: "A", a: 1.25, b: -0.65, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000040', area: 'lectura_critica', sub: 'filosofia',
        texto: "Para Karl Marx en El Capital, el concepto de 'alienación del trabajador' se produce cuando:",
        recurso_visual: null,
        opciones: ["A) El obrero se deshumaniza al perder el control sobre el producto de su trabajo y sobre su propio tiempo.", "B) El trabajador se niega a recibir su salario semanal en moneda oficial.", "C) Las máquinas sufren averías técnicas imprevistas en la línea de montaje.", "D) El empresario comparte las ganancias operativas de la fábrica con sus empleados."],
        ok: "A", a: 1.75, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000041', area: 'lectura_critica', sub: 'semantica',
        texto: "En el enunciado 'El informe técnico expuso de manera difáfana las causas del colapso del puente', el adjetivo 'diáfana' significa:",
        recurso_visual: null,
        opciones: ["A) Clara, transparente y sin ambigüedades.", "B) Oscura, confusa y llena de contradicciones.", "C) Escrita en un idioma extranjero desconocido.", "D) Breve y resumida en una sola página."],
        ok: "A", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000042', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un defensor de la privacidad digital afirma: 'Si permitimos que las empresas recopilen nuestros datos biométricos sin regulación, pronto perderemos nuestra libertad de expresión'. La estructura de este argumento utiliza una estrategia de:",
        recurso_visual: null,
        opciones: ["A) Advertencia sobre un riesgo sistémico proyectado en el tiempo (pendiente resbaladiza legítima).", "B) Elogio desmedido a las empresas tecnológicas de software.", "C) Definición gramatical del concepto de algoritmo.", "D) Demostración empírica mediante fórmulas de la física cuántica."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000043', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un reporte del Ministerio de Salud indica que en las comunidades con acceso a agua potable garantizada, la desnutrición infantil disminuye un 50%. Se deduce directamente que:",
        recurso_visual: null,
        opciones: ["A) El agua potable es una condición sanitaria básica para prevenir enfermedades infecciosas que impiden la absorción de nutrientes.", "B) El agua potable reemplaza por completo la necesidad de consumir alimentos sólidos.", "C) La desnutrición es un problema exclusivo de la falta de dinero en efectivo.", "D) Los niños de zonas rurales no requieren atención médica suplementaria."],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000044', area: 'lectura_critica', sub: 'filosofia',
        texto: "En la filosofía estoica de Epicteto, la regla fundamental para alcanzar la paz mental (ataraxia) consiste en:",
        recurso_visual: null,
        opciones: ["A) Distinguir claramente entre lo que depende de nosotros (nuestros pensamientos y actos) y lo que no depende de nosotros.", "B) Luchar violentamente contra cualquier adversidad externa hasta modificarla.", "C) Buscar el placer físico constante e ininterrumpido.", "D) Ignorar por completo la existencia de la sociedad humana."],
        ok: "A", a: 1.80, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000045', area: 'lectura_critica', sub: 'semantica',
        texto: "En el párrafo: 'El candidato político recurrió a verborrea vacía para evadir la pregunta sobre impuestos', el término 'verborrea' alude a:",
        recurso_visual: null,
        opciones: ["A) Abundancia excesiva de palabras de poco contenido o sustancia real.", "B) Un discurso poético escrito en rima consonante.", "C) Claridad técnica respaldada por números exactos.", "D) Silencio sepulcral guardado ante los periodistas."],
        ok: "A", a: 1.25, b: -0.55, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000046', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un autor concluye: 'Por lo tanto, la libertad de prensa no es un privilegio de los periodistas, sino un derecho colectivo de la sociedad a estar informada'. La frase 'por lo tanto' actúa gramaticalmente como un conector de:",
        recurso_visual: null,
        opciones: ["A) Conclusión o consecuencia lógica derivativa.", "B) Oposición adversativa o concesiva.", "C) Ejemplificación ilustrativa temporal.", "D) Duda hipotética irresoluble."],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000047', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un ensayo sociológico afirma: 'En las sociedades altamente consumistas, la obsolescencia programada de los electrodomésticos no es un fallo técnico, sino un diseño deliberado para acelerar el ciclo de venta'. Se concluye que:",
        recurso_visual: null,
        opciones: ["A) El modelo de negocio prioriza el beneficio corporativo por encima de la durabilidad y sostenibilidad del producto.", "B) Los ingenieros industriales carecen de conocimientos para fabricar productos duraderos.", "C) Los consumidores prefieren comprar electrodomésticos dañados.", "D) El reciclaje de tecnología es imposible según las leyes de la física."],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000048', area: 'lectura_critica', sub: 'filosofia',
        texto: "En la teoría del conocimiento de John Locke (empirismo), la mente humana al nacer es comparada con una 'tabla rasa' (tabula rasa). Esto significa que:",
        recurso_visual: null,
        opciones: ["A) No existen ideas innatas y todo conocimiento proviene exclusivamente de la experiencia sensorial.", "B) La mente nace repleta de verdades matemáticas preconcebidas.", "C) La razón humana es incapaz de aprender durante la vida.", "D) Las emociones son la única fuente válida de la ciencia."],
        ok: "A", a: 1.70, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000049', area: 'lectura_critica', sub: 'semantica',
        texto: "En la oración: 'El proyecto urbanístico fue cancelado porque resultaba numéricamente inviable', la palabra 'inviable' denota:",
        recurso_visual: null,
        opciones: ["A) Que no se puede llevar a cabo o ejecutar por falta de rentabilidad o recursos.", "B) Que es altamente deseable por la comunidad.", "C) Que cumple con todas las normas ecológicas vigentes.", "D) Que su construcción tardará exactamente un siglo."],
        ok: "A", a: 1.20, b: -0.70, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000050', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un ensayo sobre la tecnología concluye: 'La inteligencia artificial no reemplazará el pensamiento crítico humano, pero los humanos que usan IA sí reemplazarán a los que no la usan'. La premisa central se basa en:",
        recurso_visual: null,
        opciones: ["A) La adopción estratégica de herramientas tecnológicas como factor de ventaja competitiva personal.", "B) La destrucción inminente de todos los empleos del mundo por robots.", "C) La superioridad biológica del cerebro humano sobre las computadoras.", "D) La prohibición total del software en las empresas."],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000051', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un estudio sobre lectura digital revela que las personas que leen en pantallas tienden a realizar 'escaneos diagonales' en lugar de lecturas profundas e inferenciales. Se concluye que:",
        recurso_visual: null,
        opciones: ["A) El soporte o formato físico influye en los hábitos neurocognitivos de procesamiento de información.", "B) Las pantallas electrónicas destruyen la visión humana permanentemente.", "C) Los libros impresos desaparecerán completamente en el próximo año.", "D) Nadie comprende lo que lee cuando usa dispositivos móviles."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000052', area: 'lectura_critica', sub: 'filosofia',
        texto: "Para Platón en La República, los gobernantes idealmente deberían ser los filósofos porque:",
        recurso_visual: null,
        opciones: ["A) Han alcanzado la contemplación de la Idea del Bien y la verdad absoluta mediante la razón pura.", "B) Poseen la mayor riqueza económica para financiar las guerras.", "C) Son elegidos por la aclamación de las masas populares en las plazas.", "D) Tienen la mayor fuerza física militar del imperio."],
        ok: "A", a: 1.75, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000053', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Lea el siguiente fragmento: 'No nos engañemos: la censura no destruye las ideas; por el contrario, las rodea de un halo de misterio y resistencia que las vuelve irresistiblemente atractivas para la juventud'. De acuerdo con el texto, la censura produce un efecto contrario al deseado debido a que:",
        recurso_visual: null,
        opciones: ["A) Otorga un prestigio simbólico y una atracción rebelde a los contenidos prohibidos.", "B) Destruye inmediatamente el valor estético de las obras literarias.", "C) Obliga a las editoriales a regalar libros en las calles.", "D) Garantiza que el gobierno compre la totalidad de las ediciones impresas."],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000054', area: 'lectura_critica', sub: 'filosofia',
        texto: "En 'El mito de Sísifo' de Albert Camus, el autor sostiene que el ser humano debe imaginarse a Sísifo dichoso al empujar eternamente una piedra cuesta arriba porque:",
        recurso_visual: null,
        opciones: ["A) Asume de forma consciente y rebelde el absurdo de la existencia sin esperar consuelos metafísicos.", "B) Sabe que al día siguiente la piedra se convertirá mágicamente en oro.", "C) Cumple una orden divina que le garantiza la salvación eterna.", "D) Disfruta del ejercicio físico prolongado como fin supremo."],
        ok: "A", a: 1.85, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000055', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un editorial periodístico señala: 'El aumento acelerado de las tasas de interés por parte del Banco de la República busca frenar el consumo de los hogares para contener la inflación'. ¿Qué premisa económica implícita sostiene este argumento?",
        recurso_visual: null,
        opciones: ["A) Existe una relación directa entre el costo del crédito, la demanda agregada y el nivel general de precios.", "B) Las altas tasas de interés regalan dinero en efectivo a todos los ahorradores.", "C) La inflación es causada exclusivamente por las malas cosechas agrícolas.", "D) El Banco de la República depende del voto directo de los consumidores."],
        ok: "A", a: 1.60, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000056', area: 'lectura_critica', sub: 'semantica',
        texto: "En el fragmento periodístico: 'Las negociaciones llegaron a un punto muerto debido al atrincheramiento dogmático de ambas partes', la expresión 'punto muerto' se utiliza en sentido figurado para significar:",
        recurso_visual: null,
        opciones: ["A) Un estado de estancamiento en el cual no es posible avanzar hacia un acuerdo.", "B) El fallecimiento trágico de los mediadores en la mesa de diálogo.", "C) La firma definitiva y satisfactoria de un tratado de paz.", "D) Un receso programado de cinco minutos durante el debate."],
        ok: "A", a: 1.30, b: -0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000057', area: 'lectura_critica', sub: 'argumentacion',
        texto: "En un debate constitucional, un jurista argumenta: 'Si permitimos que el poder ejecutivo legisle mediante decretos de emergencia sin control parlamentario, habremos demolido el principio de separación de poderes'. La figura argumentativa dominante corresponde a:",
        recurso_visual: null,
        opciones: ["A) Una advertencia lógica basada en las consecuencias institucionales de romper los contrapesos políticos.", "B) Una falacia ad hominem dirigida a atacar la vida personal del presidente.", "C) Una generalización apresurada sobre el clima cambiante del país.", "D) Una petición de principio desprovista de fundamento legal."],
        ok: "A", a: 1.70, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000058', area: 'lectura_critica', sub: 'literatura',
        texto: "En el inicio de Cien años de soledad de Gabriel García Márquez: 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo'. El recurso narrativo utilizado para anticipar el futuro desde el presente se denomina:",
        recurso_visual: null,
        opciones: ["A) Prolepsis (o anticipación temporal narrativa).", "B) Analepsis (o racconto del pasado).", "C) Monólogo interior no estructurado.", "D) Soliloquio teatral."],
        ok: "A", a: 1.55, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000059', area: 'lectura_critica', sub: 'filosofia',
        texto: "Immanuel Kant resume el imperativo categórico ético en la fórmula: 'Obra solo según aquella máxima por la cual puedas querer al mismo tiempo que se convierta en ley universal'. De esto se deriva que:",
        recurso_visual: null,
        opciones: ["A) La moralidad de una acción depende de su capacidad de ser universalizada racionalmente sin contradicción.", "B) Las acciones morales se justifican según el beneficio individual o la conveniencia económica.", "C) Es moral mentir siempre y cuando no descubran al autor de la mentira.", "D) Las leyes civiles dictadas por los reyes están por encima del juicio moral."],
        ok: "A", a: 1.80, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000060', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un ensayo sociológico destaca: 'La segregación espacial urbana en las metrópolis latinoamericanas reproduce barreras invisibles pero infranqueables de clase social'. El adjetivo 'invisibles' denota que:",
        recurso_visual: null,
        opciones: ["A) No existen murallas físicas concretas, pero sí profundas diferencias simbólicas, de infraestructura y de servicios.", "B) Las ciudades fueron construidas por ingenieros transparentes.", "C) Los ciudadanos caminan con los ojos cerrados por las avenidas.", "D) Las fronteras entre barrios están custodiadas por radares de luz infrarroja."],
        ok: "A", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000061', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un filósofo sostiene: 'Las redes sociales no han creado la polarización política; únicamente le han proporcionado un megáfono de alta fidelidad que amplifica los prejuicios preexistentes'. ¿Cuál es el propósito del conector 'únicamente'?",
        recurso_visual: null,
        opciones: ["A) Restringir la causa principal del fenómeno a los prejuicios sociales y acotar el rol de las plataformas a la amplificación.", "B) Demostrar que las redes sociales son completamente inofensivas e irrelevantes.", "C) Afirmar que el megáfono es un instrumento musical de alta fidelidad.", "D) Exigir el cierre definitivo de todos los servidores de internet."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000062', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el diálogo 'Gorgias' de Platón, Sócrates afirma que 'es preferible sufrir una injusticia que cometerla'. La justificación socrática se apoya en que:",
        recurso_visual: null,
        opciones: ["A) Cometer una injusticia corrompe el alma del ejecutor, mientras que sufrirla solo daña el cuerpo o los bienes externos.", "B) Sufrir injusticias otorga recompensas monetarias automáticas en el tribunal de la polis.", "C) Cometer injusticias es un delito castigado con el exilio perpetuo e inmediato.", "D) Las víctimas de injusticias no sienten dolor físico debido a la virtud stoica."],
        ok: "A", a: 1.85, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000063', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un estudio sobre la selva amazónica concluye: 'La deforestación no solo destruye la biodiversidad endémica, sino que altera el ciclo hidrográfico del continente al reducir los ríos voladores de vapor de agua'. De esta afirmación se infiere que:",
        recurso_visual: null,
        opciones: ["A) La conservación de la vegetación amazónica es determinante para regular el régimen de lluvias en regiones distantes.", "B) Los ríos amazónicos son transportados por aviones de carga pesada.", "C) La deforestación favorece el aumento de las cosechas en toda Sudamérica.", "D) El vapor de agua es un contaminante químico industrial generado por los árboles."],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000064', area: 'lectura_critica', sub: 'semantica',
        texto: "En el párrafo: 'El historiador examinó con meticulosidad quirúrgica cada documento del archivo colonial', la metáfora 'meticulosidad quirúrgica' enfatiza:",
        recurso_visual: null,
        opciones: ["A) Un nivel de rigor, precisión extrema y cuidado minucioso en el examen de las fuentes.", "B) Que el historiador es también un médico especialista en cirugía general.", "C) Que las páginas del archivo fueron operadas con bisturí y anestesia.", "D) La prisa e improvisación con la que se realizó la investigación."],
        ok: "A", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000065', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un crítico literario afirma: 'Jong-A-Pin no busca complacer al lector con desenlaces felices; su objetivo es incomodarlo para forzar una reflexión ética sobre la culpa colectiva'. ¿Cuál es la intención del autor del ensayo?",
        recurso_visual: null,
        opciones: ["A) Explicar que la incomodidad estética es una estrategia deliberada para generar conciencia crítica.", "B) Criticar duramente la falta de talento narrativo del escritor.", "C) Exigir que todos los libros tengan finales alegres y optimistas.", "D) Demostrar que los lectores odian las reflexiones éticas."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000066', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el mito de la caverna de Platón, las sombras proyectadas sobre la pared representan:",
        recurso_visual: null,
        opciones: ["A) Las apariencias sensibles engañosas que los hombres atrapados confunden con la realidad objetiva.", "B) Las verdades matemáticas eternas descubiertas por los científicos.", "C) Los espíritus de los antepasados que protegen la ciudad.", "D) Los sueños nocturnos de los filósofos."],
        ok: "A", a: 1.75, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000067', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un estudio sobre educación universitaria concluye: 'El 80% de los graduados en programas con aprendizaje basado en problemas (ABP) resuelve contingencias laborales reales con mayor eficiencia que sus pares educados en esquemas memorísticos tradicionales'. Se deduce que:",
        recurso_visual: null,
        opciones: ["A) La metodología pedagógica activa fomenta el desarrollo de competencias pragmáticas y de resolución de problemas.", "B) La memorización de datos es el único método válido para aprobar exámenes estatales.", "C) Los profesionales formados en esquemas tradicionales carecen de título universitario.", "D) El aprendizaje basado en problemas elimina la necesidad de estudiar teorías."],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000068', area: 'lectura_critica', sub: 'pragmatica',
        texto: "En una caricatura política, un personaje trajeado sostiene un cartel que dice 'Luchamos contra la pobreza' mientras pisa un paquete con ayuda alimentaria. La intención comunicativa del caricaturista es denunciar:",
        recurso_visual: null,
        opciones: ["A) La ironía y contradicción ético-pragmática entre los discursos demagógicos y las acciones reales.", "B) El elevado costo de la pintura en aerosol empleada en el cartel.", "C) La generosidad del personaje al donar bolsas de comida.", "D) La falta de elegancia en la confección de trajes ejecutivos."],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000069', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un ensayista afirma: 'Sostener que el cambio climático es una invención mediática porque ayer hizo frío en mi ciudad equivale a concluir que la esfericidad de la Tierra es falsa porque el piso de mi sala es plano'. El recurso argumentativo utilizado es:",
        recurso_visual: null,
        opciones: ["A) Una analogía por reducción al absurdo para evidenciar la falacia de generalización apresurada.", "B) Una demostración estadística basada en mediciones satelitales.", "C) Un ataque directo ad hominem contra la inteligencia del lector.", "D) Una cita textual tomada de un tratado de geología del siglo XIX."],
        ok: "A", a: 1.80, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000070', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el existencialismo de Jean-Paul Sartre, la célebre premisa 'la existencia precede a la esencia' implica que:",
        recurso_visual: null,
        opciones: ["A) El ser humano primero existe en el mundo y luego se define a sí mismo mediante sus elecciones y actos responsables.", "B) Dios ha diseñado un destino prefijado e inalterable para cada persona antes de nacer.", "C) La naturaleza humana está determinada por las leyes de la genética molecular.", "D) Las cosas inanimadas tienen mayor libertad moral que los seres humanos."],
        ok: "A", a: 1.85, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000071', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un análisis sociolingüístico destaca: 'El desplazamiento de las lenguas nativas indígenas por el idioma mayoritario no obedece a un rechazo cultural espontáneo, sino a presiones de asimilación económica y discriminación institucional histórica'. De este pasaje se deduce que:",
        recurso_visual: null,
        opciones: ["A) La pérdida de diversidad lingüística es consecuencia de factores estructurales de dominación e inclusión social subordinada.", "B) Las lenguas originarias carecen de gramática y estructura sintáctica formal.", "C) Los jóvenes indígenas rechazan voluntariamente sus tradiciones ancestros.", "D) El multilingüismo está prohibido expresamente por la Constitución de Colombia."],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000072', area: 'lectura_critica', sub: 'argumentacion',
        texto: "En un manifiesto sobre biodiversidad se lee: 'Destruir un ecosistema paramuno para extraer oro durante diez años es como quemar una biblioteca renacentista para calentar una habitación durante diez minutos'. La comparación persigue:",
        recurso_visual: null,
        opciones: ["A) Sensibilizar sobre la desproporción irreparable entre una ganancia efímera y una pérdida patrimonial irreversible.", "B) Demostrar que la minería y la lectura son actividades idénticas.", "C) Recomendar la quema de libros antiguos para generar energía limpia.", "D) Exigir que los páramos sean convertidos en bibliotecas públicas."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000073', area: 'lectura_critica', sub: 'literatura',
        texto: "En el inicio de 'Cien años de soledad', Gabriel García Márquez escribe: 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo'. La técnica narrativa utilizada para anticipar un evento futuro antes de retornar al pasado se denomina:",
        recurso_visual: null,
        opciones: ["A) Prolepsis (o analepsis combinada con anticipación narrativa).", "B) Monólogo interior no estructurado.", "C) Caligrama poético vanguardista.", "D) Corriente de la conciencia en tercera persona."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000074', area: 'lectura_critica', sub: 'filosofia',
        texto: "En 'El mito de Sísifo', Albert Camus plantea que la verdadera pregunta filosófica fundamental es el suicidio, concluyendo que 'debemos imaginar a Sísifo feliz' al empujar eternamente su roca. Esta postura defiende que:",
        recurso_visual: null,
        opciones: ["A) El sentido de la vida no es otorgado por el universo, sino creado por el individuo al rebelarse lúcidamente contra el absurdo.", "B) El sufrimiento humano carece de solución y por ende la desesperación es el único camino válido.", "C) La religión institucional es el único marco ético capaz de erradicar la angustia.", "D) Las leyes de la física garantizan el triunfo automático de la razón humana."],
        ok: "A", a: 1.85, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000075', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un columnista sostiene: 'Si permitimos que los estudiantes elijan si llevan o no uniforme escolar, mañana exigirán elegir a sus profesores y pasado mañana decidirán si asisten o no a las evaluaciones obligatorias'. Esta argumentación incurre en la falacia de:",
        recurso_visual: null,
        opciones: ["A) Pendiente resbaladiza.", "B) Ad hominem.", "C) Apelación a la autoridad.", "D) Falsa analogía."],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000076', area: 'lectura_critica', sub: 'inferencia',
        texto: "Lea el siguiente enunciado: 'Aunque los niveles de analfabetismo digital han disminuido, la desinformación en redes se propaga con mayor virulencia que nunca debido a la falta de pensamiento crítico para filtrar sesgos de confirmación'. Del texto se infiere que:",
        recurso_visual: null,
        opciones: ["A) Saber usar herramientas digitales no garantiza la capacidad de evaluar críticamente la veracidad de la información.", "B) El acceso a internet debe ser suspendido en colegios y universidades públicas.", "C) Las redes sociales fueron diseñadas exclusivamente con fines de manipulación política.", "D) La desinformación desaparecerá automáticamente al aumentar la velocidad de conexión."],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000077', area: 'lectura_critica', sub: 'comprension_literal',
        texto: "En una reseña histórica se afirma: 'El Tratado de Versalles de 1919 impuso severas reparaciones económicas a Alemania, desmilitarizó la cuenca del Renania y reconfiguró el mapa de Europa Central'. Según el texto, ¿cuál de las siguientes fue una cláusula del tratado?",
        recurso_visual: null,
        opciones: ["A) La desmilitarización de la cuenca del Renania.", "B) La anexión inmediata de Inglaterra a la República Alemana.", "C) La abolición universal del comercio marítimo transatlántico.", "D) El traslado de la sede de la ONU a Ginebra."],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000078', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el 'Ensayo sobre el entendimiento humano', John Locke sostiene que la mente es una 'tabula rasa' al nacer. Esta idea combate de manera directa la doctrina filosófica de:",
        recurso_visual: null,
        opciones: ["A) Las ideas innatas promovida por el racionalismo cartesiano.", "B) El utilitarismo ético de Bentham y Mill.", "C) El pragmatismo americano de William James.", "D) El materialismo histórico marxista."],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000079', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un científico escribe: 'Los críticos afirman que el proyecto espacial es un derroche de dinero. Sin embargo, ignoran que tecnologías como el GPS, la tomografía médica y los filtros de agua portátiles son derivados directos de la investigación aeroespacial'. El propósito del autor es:",
        recurso_visual: null,
        opciones: ["A) Refutar las críticas demostrando los beneficios indirectos de la exploración espacial en la vida cotidiana.", "B) Exigir el cierre definitivo de los programas de salud pública.", "C) Justificar el aumento ilimitado del gasto militar gubernamental.", "D) Demostrar que la medicina moderna no necesita tecnología digital."],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000080', area: 'lectura_critica', sub: 'inferencia',
        texto: "Lea la frase satírica de Mark Twain: 'Si dices la verdad, no tienes que recordar nada'. La intención fundamental subyacente es:",
        recurso_visual: null,
        opciones: ["A) Subrayar que la mentira exige un esfuerzo constante de coherencia ficticia, mientras que la verdad es auto-sostenible.", "B) Aconsejar a las personas con problemas de memoria que recurran a la fantasía.", "C) Demostrar que decir la verdad produce amnesia retrógrada.", "D) Criticar a los historiadores por memorizar datos antiguos."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000081', area: 'lectura_critica', sub: 'literatura',
        texto: "En la tragedia 'Edipo Rey' de Sófocles, el trágico destino del protagonista se cumple precisamente debido a las acciones que sus padres y él emprenden para evitar la profecía del oráculo. Este recurso dramático se conoce como:",
        recurso_visual: null,
        opciones: ["A) Ironía trágica (o profecía auto-cumplida).", "B) Deus ex machina.", "C) Suspenso policiaco victoriano.", "D) Realismo mágico desmitificador."],
        ok: "A", a: 1.80, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000082', area: 'lectura_critica', sub: 'filosofia',
        texto: "En 'La genealogía de la moral', Friedrich Nietzsche crítica la moral tradicional judeocristiana calificándola de 'moral de esclavos', la cual invierte los valores nobles basándose en:",
        recurso_visual: null,
        opciones: ["A) El resentimiento y la glorificación de la debilidad frente a la afirmación vital de los fuertes.", "B) El cálculo matemático utilitarista de placer y dolor.", "C) El respeto irrestricto a los mandatos científicos del positivismo.", "D) La búsqueda imparcial de la paz democrática entre estados."],
        ok: "A", a: 1.85, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000083', area: 'lectura_critica', sub: 'argumentacion',
        texto: "En un debate sobre políticas públicas de nutrición, un participante afirma: 'No debemos atender la propuesta del doctor Pérez sobre la reducción de azúcares procesados porque él trabaja para un hospital privado y solo busca beneficiar a sus pacientes ricos'. ¿En qué falacia incurre este argumento?",
        recurso_visual: null,
        opciones: ["A) Ad hominem circunstancial.", "B) Apelación a la ignorancia.", "C) Falsa dicotomía.", "D) Petición de principio."],
        ok: "A", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000084', area: 'lectura_critica', sub: 'inferencia',
        texto: "Considere el extracto: 'La automatización de procesos industriales ha incrementado la productividad global a cifras récord, pero simultáneamente ha reducido la oferta de empleos no cualificados en el sector manufacturero'. ¿Qué tensión central evidencia la lectura?",
        recurso_visual: null,
        opciones: ["A) El desajuste entre la eficiencia tecnológica y la absorción de mano de obra no calificada.", "B) La quiebra generalizada de las empresas de desarrollo de software.", "C) El aumento en los salarios de los obreros no cualificados.", "D) La prohibición de las máquinas en países desarrollados."],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000085', area: 'lectura_critica', sub: 'comprension_literal',
        texto: "Un fragmento informativo señala: 'El Telescopio Espacial James Webb opera en el espectro infrarrojo, lo que le permite atravesar densas nubes de polvo estelar y capturar imágenes de las primeras galaxias formadas tras el Big Bang'. ¿En qué longitud de onda observa este instrumento?",
        recurso_visual: null,
        opciones: ["A) En el espectro infrarrojo.", "B) Únicamente en luz ultravioleta.", "C) A través de ondas de radio AM.", "D) Exclusivamente en rayos X."],
        ok: "A", a: 1.35, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000086', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el imperativo categórico kantiano se formula: 'Obra solo según aquella máxima por la cual puedas querer al mismo tiempo que se convierta en ley universal'. Esta regla moral exige:",
        recurso_visual: null,
        opciones: ["A) Evaluar la validez de una acción juzgando si su práctica generalizada mantendría la coherencia racional y el respeto a la dignidad.", "B) Seguir ciegamente las costumbres locales del país en que se reside.", "C) Actuar buscando siempre el máximo beneficio económico individual.", "D) Obedecer únicamente cuando existan castigos penales explícitos."],
        ok: "A", a: 1.80, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000087', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un editorial expresa: 'Pretender erradicar el tráfico de fauna silvestre incrementando únicamente las multas monetarias es insuficiente si no se combaten simultáneamente las redes transnacionales de contrabando y la demanda de mascotas exóticas'. La postura del autor respecto a las multas es:",
        recurso_visual: null,
        opciones: ["A) Son una medida parcial que no ataca las causas integrales del problema.", "B) Constituyen la única solución definitiva para proteger a los animales.", "C) Deben ser eliminadas para fomentar el comercio libre de especies.", "D) Representan un incentivo positivo para los cazadores furtivos."],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000088', area: 'lectura_critica', sub: 'literatura',
        texto: "En '1984' de George Orwell, el lema del Partido es: 'La guerra es la paz. La libertad es la esclavitud. La ignorancia es la fuerza'. El recurso poético y discursivo mediante el cual se presentan contradicciones aparentes para adoctrinar a la población se denomina:",
        recurso_visual: null,
        opciones: ["A) Paradoja (o Doblepensar orwelliano).", "B) Hipérbole hiperbólica.", "C) Onomatopeya bélica.", "D) Metonimia espacial."],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000089', area: 'lectura_critica', sub: 'inferencia',
        texto: "Lea el pasaje: 'Las ciudades con redes de transporte público masivo altamente eficientes registran índices de congestión vehicular notablemente inferiores a aquellas que subsidian de forma prioritaria la infraestructura para automóviles particulares'. Se deduce que:",
        recurso_visual: null,
        opciones: ["A) La política de inversión en transporte masivo desincentiva el uso del vehículo privado y descongestiona las vías.", "B) El automóvil particular es la forma más rápida de movilización en cualquier metrópoli.", "C) Las autopistas urbanas deben ser privatizadas para eliminar el tráfico.", "D) La población urbana prefiere caminar largas distancias antes que abordar buses."],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000090', area: 'lectura_critica', sub: 'filosofia',
        texto: "En el diálogo 'La República' de Platón, la Alegoría de la Caverna ilustra el tránsito desde la 'doxa' (opinión/engaño) hacia la 'episteme' (conocimiento verdadero). Las sombras proyectadas en la pared representan:",
        recurso_visual: null,
        opciones: ["A) Las percepciones sensibles engañosas y las apariencias del mundo material.", "B) Las verdades matemáticas eternas e inmutables.", "C) La justicia divina revelada a los reyes filósofos.", "D) El conocimiento científico empírico riguroso."],
        ok: "A", a: 1.75, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000091', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un comunicado de prensa afirma: 'Nuestros laboratorios garantizan que la crema X rejuvenece la piel en un 90%, según un estudio interno realizado sobre 10 empleados de la propia compañía durante 3 días'. ¿Qué falencia metodológica invalida la fuerza argumentativa del estudio?",
        recurso_visual: null,
        opciones: ["A) Muestra extremadamente reducida, conflicto de interés y sesgo de selección.", "B) El uso de ingredientes botánicos no aprobados por la FDA.", "C) La ausencia de un gráfico en color dentro de la nota periodística.", "D) El alto costo del producto en el mercado minorista."],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000092', area: 'lectura_critica', sub: 'literatura',
        texto: "En el poema 'Noche oscura del alma' de San Juan de la Cruz, el viaje nocturno de la amada para encontrarse en secreto con el amado simboliza:",
        recurso_visual: null,
        opciones: ["A) La unión mística e íntima del alma humana con la Divinidad.", "B) Un escape nocturno de prisioneros políticos durante el Medioevo.", "C) La descripción lírica de una jornada agrícola nocturna.", "D) La navegación comercial por el mar Mediterráneo."],
        ok: "A", a: 1.80, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000093', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un informe económico expresa: 'La transición global hacia fuentes de energía renovable no solo exige inversiones masivas en paneles solares y turbinas eólicas, sino también una profunda reestructuración de las redes eléctricas de distribución urbana'. De este pasaje se deriva que:",
        recurso_visual: null,
        opciones: ["A) Sustituir los combustibles fósiles requiere transformaciones infraestructurales complejas más allá de la mera generación de energía.", "B) Las fuentes eólicas son ineficientes e inviables en climas templados.", "C) Las ciudades deben mantener intactas sus redes eléctricas del siglo XIX.", "D) El consumo de electricidad se reducirá a cero con la energía solar."],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000094', area: 'lectura_critica', sub: 'comprension_literal',
        texto: "Un ensayo histórico señala: 'Durante el periodo conocido como la Hegemonía Conservadora en Colombia (1886-1930), la Constitución de 1886 consolidó un Estado centralista y confesional bajo la influencia tutelar de la Iglesia Católica'. Según el texto, ¿qué característica definió la Constitución de 1886 en este periodo?",
        recurso_visual: null,
        opciones: ["A) Un modelo estatal centralista y confesional.", "B) Un sistema federalista radical con total libertad de cultos.", "C) La abolición de la fuerza pública estatal.", "D) La instauración de una monarquía parlamentaria."],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000095', area: 'lectura_critica', sub: 'filosofia',
        texto: "En 'El contrato social', Jean-Jacques Rousseau proclama: 'El hombre nace libre, pero en todas partes yace encadenado'. La propuesta rousseauniana para conciliar la libertad individual con el orden colectivo se basa en:",
        recurso_visual: null,
        opciones: ["A) La sumisión ética de todos los ciudadanos a la Voluntad General.", "B) La imposición de una dictadura militar ilustrada hereditaria.", "C) La abolición total de las leyes y de la propiedad comunitaria.", "D) El retorno obligatorio al estado de naturaleza primitivo."],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000096', area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un crítico gastronómico escribe: 'Calificar un restaurante de alta cocina como excelente solo porque sus platos son costosos e incluyen vajilla importada es juzgar la envoltura sin haber probado la sustancia del plato'. El argumento resalta:",
        recurso_visual: null,
        opciones: ["A) La falacia de confundir la apariencia o el precio con la calidad real del servicio.", "B) Que todos los restaurantes lujosos sirven alimentos en mal estado.", "C) La necesidad de prohibir el uso de vajillas importadas.", "D) Que la gastronomía no debe ser considerada una disciplina artística."],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000097', area: 'lectura_critica', sub: 'literatura',
        texto: "En 'Ficciones' de Jorge Luis Borges, los cuentos recurren frecuentemente a laberintos, bibliotecas infinitas y espejos. Estos símbolos recurrentes expresan la preocupación borgesiana por:",
        recurso_visual: null,
        opciones: ["A) La perplejidad metafísica ante la infinitud, el tiempo y los límites del conocimiento humano.", "B) La descripción documental de la arquitectura colonial porteña.", "C) La denuncia sociopolítica de las huelgas obreras en Argentina.", "D) El catálogo técnico de encuadernación de libros antiguos."],
        ok: "A", a: 1.80, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000098', area: 'lectura_critica', sub: 'inferencia',
        texto: "Un estudio sobre psicología de la percepción señala: 'Los usuarios tienden a hacer clic con mayor frecuencia en anuncios digitales con tonos rojos deslumbrantes no por interés en el producto, sino por una respuesta fisiológica involuntaria ante estímulos de alerta'. Se infiere que:",
        recurso_visual: null,
        opciones: ["A) Las métricas de interacción digital pueden estar sesgadas por respuestas instintivas más que por elecciones conscientes.", "B) El color rojo aumenta la inteligencia del usuario que navega en internet.", "C) Los anuncios de color azul no generan ningún tipo de venta.", "D) Los consumidores prefieren comprar productos peligrosos."],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '22222222-0000-4000-8000-000000000099', area: 'lectura_critica', sub: 'filosofia',
        texto: "En 'Crítica de la razón pura', Immanuel Kant distingue entre 'fenómeno' (lo que se nos aparece a través de las formas a priori de la sensibilidad) y 'noúmeno' (la cosa en sí). De esta distinción se deriva que:",
        recurso_visual: null,
        opciones: ["A) El conocimiento humano está limitado al ámbito fenoménico y no podemos conocer la cosa en sí directamente.", "B) El ser humano conoce absolutamente toda la realidad objetiva sin ninguna mediación mental.", "C) Los sentidos son completamente inútiles para la investigación científica.", "D) El noúmeno puede ser fotografiado mediante microscopios ópticos avanzados."],
        ok: "A", a: 1.85, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

const reactivosGen = generarReactivosLecturaMasivos(1000);
export const reactivosLecturaCritica = [...reactivosSeed, ...reactivosGen];