// 📐 src/services/bank/matematicas.js - 1,100 Reactivos Calibrados ICFES Saber 11
import { generarReactivosMatematicasMasivos } from './generatorMath.js';

const generateSVG = (content) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="background:%230d0f14;font-family:sans-serif;">${content}</svg>`;

const reactivosSeed = [
    { id: 'item_math_01', area: 'matematicas', sub: 'algebra',
        texto: "En una maratón escolar, Carlos corre a una velocidad constante de 5 m/s durante 2 minutos. ¿Qué distancia total recorre en ese intervalo?",
        recurso_visual: null,
        opciones: ["A) 600 metros", "B) 100 metros", "C) 300 metros", "D) 1200 metros"],
        ok: "A", a: 1.45, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000001', area: 'matematicas', sub: 'algebra',
        texto: "Una empresa de transporte masivo en Bogotá cobra una tarifa base de 3.000 COP por pasaje, más un recargo de 150 COP por kilómetro recorrido en rutas zonales. Si un usuario tiene un saldo disponible de 50.000 COP en su tarjeta, ¿cuál de las siguientes ecuaciones modela el saldo remanente S en función de los kilómetros k recorridos?",
        recurso_visual: null,
        opciones: ["A) S = 50.000 - 3.150k", "B) S = 50.000 - (3.000 + 150k)", "C) S = 3.000k + 150 - 50.000", "D) S = 47.000 - 150k"],
        ok: "B", a: 1.45, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000002', area: 'matematicas', sub: 'algebra',
        texto: "Un tanque de reserva de agua potable en un colegio contiene 1.200 litros. Debido a un mantenimiento, se abre una válvula de desagüe que libera agua a una tasa constante de 40 litros por minuto. ¿En cuánto tiempo el tanque conservará exactamente un tercio de su capacidad inicial?",
        recurso_visual: null,
        opciones: ["A) 10 minutos", "B) 20 minutos", "C) 30 minutos", "D) 40 minutos"],
        ok: "B", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000003', area: 'matematicas', sub: 'geometria',
        texto: "El Ministerio de Vivienda proyecta un terreno rectangular para una cancha comunitaria con un área total de 108 m². Por especificaciones del diseño, el largo del lote debe ser el triple de su ancho. Si se va a instalar un cerramiento con malla metálica en todo el borde exterior, ¿cuántos metros de malla se deben comprar?",
        recurso_visual: generateSVG('<rect x="50" y="50" width="300" height="100" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="180" y="40" fill="%23d4af37" font-size="14">Largo = 3x</text><text x="360" y="105" fill="%23d4af37" font-size="14">x</text><text x="170" y="110" fill="%23ffffff" font-size="16">Área = 108 m²</text>'),
        opciones: ["A) 12 metros", "B) 24 metros", "C) 48 metros", "D) 72 metros"],
        ok: "C", a: 1.85, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000004', area: 'matematicas', sub: 'geometria',
        texto: "Un diseñador industrial duplica la longitud del radio de una tubería cilíndrica de sección circular. Al comparar la nueva área transversal con la original, la superficie de corte disponible:",
        recurso_visual: generateSVG('<circle cx="120" cy="100" r="40" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="120" y1="100" x2="160" y2="100" stroke="%23d4af37" stroke-width="2"/><text x="135" y="95" fill="%23d4af37" font-size="12">r</text><circle cx="280" cy="100" r="80" fill="none" stroke="%232ecc71" stroke-width="3"/><line x1="280" y1="100" x2="360" y2="100" stroke="%23d4af37" stroke-width="2"/><text x="310" y="95" fill="%23d4af37" font-size="12">2r</text>'),
        opciones: ["A) Se duplica exactamente (factor 2x)", "B) Se triplica (factor 3x)", "C) Se cuadruplica (factor 4x)", "D) Permanece inalterada"],
        ok: "C", a: 1.50, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000005', area: 'matematicas', sub: 'estadistica',
        texto: "Un estudio del DANE señala que el 30% de los jóvenes en la región Andina consulta noticias a través de aplicaciones móviles. Si se encuesta al azar y de forma independiente a dos estudiantes de un colegio, ¿cuál es la probabilidad porcentual de que ambos prefieran este medio digital?",
        recurso_visual: null,
        opciones: ["A) 9%", "B) 15%", "C) 30%", "D) 60%"],
        ok: "A", a: 1.70, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000006', area: 'matematicas', sub: 'proporcionalidad',
        texto: "En una fábrica de confecciones en Medellín, 6 operarios confeccionan 120 camisas en un turno de 8 horas. Si la demanda aumenta y se requiere producir 300 camisas bajo las mismas condiciones de rendimiento, ¿cuántas horas deberá laborar el equipo completo?",
        recurso_visual: null,
        opciones: ["A) 12 horas", "B) 16 horas", "C) 20 horas", "D) 24 horas"],
        ok: "C", a: 1.35, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000007', area: 'matematicas', sub: 'aritmetica',
        texto: "Un artículo cuyo precio de lista es 200.000 COP tiene un descuento del 20% por temporada. Al momento de pagar en caja, se aplica un impuesto al valor agregado (IVA) del 19% sobre el valor ya rebajado. ¿Cuál es el precio final que paga el consumidor?",
        recurso_visual: null,
        opciones: ["A) 190.400 COP", "B) 198.000 COP", "C) 200.000 COP", "D) 180.000 COP"],
        ok: "A", a: 1.50, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000008', area: 'matematicas', sub: 'funciones',
        texto: "Dada la función cuadrática f(x) = -x² + 6x - 8, las coordenadas exactas donde la parábola corta al eje horizontal de las abscisas (f(x) = 0) corresponden a:",
        recurso_visual: generateSVG('<line x1="20" y1="150" x2="380" y2="150" stroke="%239499a7" stroke-width="2"/><line x1="100" y1="20" x2="100" y2="190" stroke="%239499a7" stroke-width="2"/><path d="M 120 180 Q 200 40 280 180" fill="none" stroke="%2351e2f5" stroke-width="3"/><circle cx="160" cy="150" r="5" fill="%23d4af37"/><circle cx="240" cy="150" r="5" fill="%23d4af37"/><text x="155" y="170" fill="%23ffffff" font-size="12">x1</text><text x="235" y="170" fill="%23ffffff" font-size="12">x2</text>'),
        opciones: ["A) (2, 0) y (4, 0)", "B) (-2, 0) y (-4, 0)", "C) (1, 0) y (8, 0)", "D) (0, -8)"],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000009', area: 'matematicas', sub: 'geometria',
        texto: "Una piscina olímpica tiene forma rectangular con 50 metros de largo, 25 metros de ancho y una profundidad uniforme de 2 metros. Si se llena hasta el 90% de su capacidad total, ¿cuántos metros cúbicos de agua contiene?",
        recurso_visual: null,
        opciones: ["A) 2.500 m³", "B) 2.250 m³", "C) 2.000 m³", "D) 2.750 m³"],
        ok: "B", a: 1.45, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000010', area: 'matematicas', sub: 'estadistica',
        texto: "Las calificaciones de un estudiante en 5 exámenes fueron 3,0; 3,5; 3,8; 4,0 y 4,5. ¿Cuál es la mediana de ese conjunto?",
        recurso_visual: null,
        opciones: ["A) 3,5", "B) 3,76", "C) 3,8", "D) 4,0"],
        ok: "C", a: 1.30, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000011', area: 'matematicas', sub: 'geometria',
        texto: "En el siguiente triángulo rectángulo ABC, el cateto adyacente al ángulo θ mide 8 cm y la hipotenusa mide 10 cm. Determine el valor de la función trigonométrica Seno(θ):",
        recurso_visual: generateSVG('<polygon points="50,160 250,160 250,40" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="140" y="180" fill="%23d4af37" font-size="14">8 cm</text><text x="130" y="90" fill="%23d4af37" font-size="14">10 cm</text><text x="260" y="100" fill="%232ecc71" font-size="14">Cateto Opuesto</text><path d="M 80,160 A 30,30 0 0,0 73,145" fill="none" stroke="%23a855f7" stroke-width="2"/><text x="90" y="150" fill="%23a855f7" font-size="14">θ</text>'),
        opciones: ["A) 0,60", "B) 0,80", "C) 0,75", "D) 1,25"],
        ok: "A", a: 1.65, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000012', area: 'matematicas', sub: 'estadistica',
        texto: "La siguiente gráfica de barras muestra las ventas trimestrales (en millones de pesos) de un almacén de calzado en Cali durante el año pasado. ¿En qué porcentaje incrementaron las ventas del Trimestre 2 con respecto al Trimestre 1?",
        recurso_visual: generateSVG('<rect x="50" y="100" width="40" height="70" fill="%2351e2f5"/><rect x="130" y="40" width="40" height="130" fill="%232ecc71"/><rect x="210" y="70" width="40" height="100" fill="%23a855f7"/><rect x="290" y="20" width="40" height="150" fill="%23d4af37"/><line x1="30" y1="170" x2="350" y2="170" stroke="%23ffffff"/><text x="50" y="190" fill="%23ffffff" font-size="12">T1 ($50M)</text><text x="130" y="190" fill="%23ffffff" font-size="12">T2 ($80M)</text>'),
        opciones: ["A) 30%", "B) 60%", "C) 37,5%", "D) 160%"],
        ok: "B", a: 1.55, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000013', area: 'matematicas', sub: 'algebra',
        texto: "Resuelva el siguiente sistema de ecuaciones lineales 2x2: \n\n1) 2x + 3y = 20\n2) x - y = 5\n\nEl valor equivalente para la variable y corresponde a:",
        recurso_visual: null,
        opciones: ["A) y = 2", "B) y = 7", "C) y = 4", "D) y = 5"],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000014', area: 'matematicas', sub: 'aritmetica',
        texto: "Un microempresario reparte 12.000.000 COP entre tres socios de forma inversamente proporcional a las ausencias registradas durante el año (2, 3 y 6 ausencias respectivamente). ¿Cuánto dinero le corresponde al socio con menor número de ausencias (2 ausencias)?",
        recurso_visual: null,
        opciones: ["A) 6.000.000 COP", "B) 4.000.000 COP", "C) 2.000.000 COP", "D) 5.000.000 COP"],
        ok: "A", a: 1.80, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000015', area: 'matematicas', sub: 'funciones',
        texto: "Observe la gráfica de la función f(x) = 2^x representada a continuación. Si la gráfica se desplaza 3 unidades verticalmente hacia abajo, la nueva asíntota horizontal de la función evaluada será:",
        recurso_visual: generateSVG('<line x1="20" y1="120" x2="380" y2="120" stroke="%239499a7"/><line x1="80" y1="20" x2="80" y2="180" stroke="%239499a7"/><path d="M 20 118 Q 120 115 300 20" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="20" y1="170" x2="380" y2="170" stroke="%23e74c3c" stroke-dasharray="5,5"/><text x="200" y="160" fill="%23e74c3c" font-size="12">Desplazamiento y = -3</text>'),
        opciones: ["A) y = 0", "B) y = -3", "C) y = 3", "D) x = -3"],
        ok: "B", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000016', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un mapa de Colombia está diseñado a una escala de 1 : 500.000. Si la distancia lineal medida en el mapa entre dos municipios de Cundinamarca es de 8 cm, ¿cuál es la distancia real en terreno medida en kilómetros?",
        recurso_visual: null,
        opciones: ["A) 4 km", "B) 40 km", "C) 400 km", "D) 4.000 km"],
        ok: "B", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000017', area: 'matematicas', sub: 'geometria',
        texto: "Un cono recto de helado tiene un radio base r = 3 cm y una altura h = 4 cm. Calcule el área total de la superficie exterior lateral (sin incluir la tapa circular superior), sabiendo que la generatriz g = 5 cm:",
        recurso_visual: generateSVG('<path d="M 200 30 L 120 160 A 80 20 0 0 0 280 160 Z" fill="none" stroke="%23d4af37" stroke-width="3"/><ellipse cx="200" cy="160" rx="80" ry="20" fill="none" stroke="%2351e2f5" stroke-dasharray="4,4"/><line x1="200" y1="30" x2="200" y2="160" stroke="%23ffffff" stroke-dasharray="2,2"/><text x="205" y="100" fill="%23ffffff" font-size="12">h = 4 cm</text><text x="240" y="80" fill="%23d4af37" font-size="12">g = 5 cm</text><text x="220" y="175" fill="%2351e2f5" font-size="12">r = 3 cm</text>'),
        opciones: ["A) 12π cm²", "B) 15π cm²", "C) 24π cm²", "D) 36π cm²"],
        ok: "B", a: 1.70, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000018', area: 'matematicas', sub: 'estadistica',
        texto: "En una bolsa opaca hay 5 bolas rojas, 3 bolas azules y 2 bolas verdes. Si se extraen 2 bolas consecutivas sin reemplazo, ¿cuál es la probabilidad exacta de que la primera sea roja y la segunda sea verde?",
        recurso_visual: null,
        opciones: ["A) 1/9", "B) 1/10", "C) 1/5", "D) 7/10"],
        ok: "A", a: 1.85, b: 0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000019', area: 'matematicas', sub: 'algebra',
        texto: "Dada la expresión algebraica P(x) = (2x + 3)^2 - (2x - 3)^2, al simplificarla completamente se obtiene:",
        recurso_visual: null,
        opciones: ["A) 24x", "B) 8x² + 18", "C) 12x", "D) 0"],
        ok: "A", a: 1.60, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000020', area: 'matematicas', sub: 'aritmetica',
        texto: "Un banco ofrece un CDT con una tasa de interés simple del 12% anual. Si un cliente invierte un capital inicial de 10.000.000 COP durante un periodo de 6 meses, ¿cuánto dinero total retirará al finalizar el plazo?",
        recurso_visual: null,
        opciones: ["A) 10.600.000 COP", "B) 11.200.000 COP", "C) 10.120.000 COP", "D) 12.000.000 COP"],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000021', area: 'matematicas', sub: 'funciones',
        texto: "El costo de producción C(x) en miles de pesos para x unidades de un producto tecnológico está modelado por C(x) = x² - 20x + 500. ¿Cuántas unidades deben producirse para minimizar el costo total de fabricación?",
        recurso_visual: null,
        opciones: ["A) 10 unidades", "B) 20 unidades", "C) 400 unidades", "D) 500 unidades"],
        ok: "A", a: 1.75, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000022', area: 'matematicas', sub: 'geometria',
        texto: "Calcule el perímetro total de la siguiente figura sombreada formada por la unión de un cuadrado de lado 6 cm y un triángulo equilátero exterior apoyado sobre uno de sus lados:",
        recurso_visual: generateSVG('<rect x="100" y="80" width="100" height="100" fill="%231a1d26" stroke="%2351e2f5" stroke-width="3"/><polygon points="100,80 200,80 150,10" fill="%231a1d26" stroke="%232ecc71" stroke-width="3"/><text x="140" y="130" fill="%23ffffff" font-size="14">6 cm</text>'),
        opciones: ["A) 30 cm", "B) 36 cm", "C) 24 cm", "D) 42 cm"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000023', area: 'matematicas', sub: 'estadistica',
        texto: "En un grupo de 40 estudiantes, el promedio de edad es de 16 años. Si se retiran 5 estudiantes cuya edad promedio era de 18 años, el nuevo promedio de edad del grupo remanente es:",
        recurso_visual: null,
        opciones: ["A) 15,71 años", "B) 15,50 años", "C) 16,00 años", "D) 14,80 años"],
        ok: "A", a: 1.80, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000024', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Para construir una barda en 12 días se contrataron 8 obreros. Si antes de iniciar la obra se enferman 2 obreros y la obra debe entregarse en las mismas condiciones, ¿cuántos días tardarán los obreros restantes?",
        recurso_visual: null,
        opciones: ["A) 16 días", "B) 14 días", "C) 9 días", "D) 18 días"],
        ok: "A", a: 1.50, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000025', area: 'matematicas', sub: 'algebra',
        texto: "Un dron vuela describiendo una trayectoria cuadrática h(t) = -5t² + 20t + 15, donde h es la altura en metros y t el tiempo en segundos. ¿Cuál es la altura máxima alcanzada por el dispositivo?",
        recurso_visual: null,
        opciones: ["A) 35 metros", "B) 20 metros", "C) 15 metros", "D) 25 metros"],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000026', area: 'matematicas', sub: 'geometria',
        texto: "Un sector circular tiene un ángulo central de 60° y un radio de 12 cm. El área exacta de esta región sombreada equivale a:",
        recurso_visual: generateSVG('<path d="M 200 160 L 300 160 A 100 100 0 0 0 250 73 Z" fill="%23d4af37" opacity="0.8" stroke="%2351e2f5" stroke-width="2"/><text x="210" y="145" fill="%23ffffff" font-size="12">60°</text><text x="240" y="175" fill="%23ffffff" font-size="12">r = 12 cm</text>'),
        opciones: ["A) 24π cm²", "B) 144π cm²", "C) 12π cm²", "D) 72π cm²"],
        ok: "A", a: 1.60, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000027', area: 'matematicas', sub: 'aritmetica',
        texto: "Una sustancia radiactiva se desintegra perdiendo la mitad de su masa cada 4 horas. Si inicialmente se tienen 800 gramos, ¿cuántos gramos quedarán al cabo de 16 horas?",
        recurso_visual: null,
        opciones: ["A) 50 gramos", "B) 100 gramos", "C) 200 gramos", "D) 25 gramos"],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000028', area: 'matematicas', sub: 'estadistica',
        texto: "En el lanzamiento de dos dados corrientes de 6 caras numeradas del 1 al 6, ¿cuál es la probabilidad porcentual de obtener una suma de puntos igual a 7?",
        recurso_visual: null,
        opciones: ["A) 16,66%", "B) 14,28%", "C) 12,50%", "D) 20,00%"],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000029', area: 'matematicas', sub: 'funciones',
        texto: "Considere la función f(x) = (x - 2) / (x + 4). El dominio real de esta función corresponde a:",
        recurso_visual: null,
        opciones: ["A) Todos los reales excepto x = -4", "B) Todos los reales excepto x = 2", "C) Todos los reales positivos", "D) Todos los reales excepto x = 0"],
        ok: "A", a: 1.45, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000030', area: 'matematicas', sub: 'geometria',
        texto: "Un prisma recto de base hexagonal regular tiene un volumen de 300 cm³. Si se triplica su altura manteniendo la base inalterada, su nuevo volumen será:",
        recurso_visual: null,
        opciones: ["A) 900 cm³", "B) 600 cm³", "C) 2.700 cm³", "D) 300 cm³"],
        ok: "A", a: 1.50, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000031', area: 'matematicas', sub: 'algebra',
        texto: "Si Log10(x) = 3, ¿cuál es el valor exacto de x^2?",
        recurso_visual: null,
        opciones: ["A) 1.000.000", "B) 10.000", "C) 9", "D) 100.000"],
        ok: "A", a: 1.80, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000032', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un mapa topográfico utiliza la escala 1:20.000. Una parcela tiene en el mapa un área rectangular de 3 cm x 4 cm = 12 cm². ¿Cuál es el área real en hectáreas (1 ha = 10.000 m²)?",
        recurso_visual: null,
        opciones: ["A) 48 hectáreas", "B) 24 hectáreas", "C) 4,8 hectáreas", "D) 480 hectáreas"],
        ok: "A", a: 1.85, b: 0.95, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 1, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000033', area: 'matematicas', sub: 'aritmetica',
        texto: "En una tienda de tecnología se aplica un descuento en cascada: primero un 10% de descuento y, sobre el precio ya rebajado, un 10% adicional. El descuento único equivalente sobre la prenda original es:",
        recurso_visual: null,
        opciones: ["A) 19%", "B) 20%", "C) 18%", "D) 21%"],
        ok: "A", a: 1.60, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000034', area: 'matematicas', sub: 'geometria',
        texto: "Si las diagonales de un rombo miden d1 = 12 cm y d2 = 16 cm, el perímetro exterior del rombo es:",
        recurso_visual: generateSVG('<polygon points="200,20 280,100 200,180 120,100" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="200" y1="20" x2="200" y2="180" stroke="%23d4af37" stroke-dasharray="3,3"/><line x1="120" y1="100" x2="280" y2="100" stroke="%23d4af37" stroke-dasharray="3,3"/><text x="205" y="60" fill="%23d4af37" font-size="12">d1=16</text><text x="140" y="95" fill="%23d4af37" font-size="12">d2=12</text>'),
        opciones: ["A) 40 cm", "B) 56 cm", "C) 20 cm", "D) 48 cm"],
        ok: "A", a: 1.70, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000035', area: 'matematicas', sub: 'estadistica',
        texto: "Un diagrama de caja y bigotes (Boxplot) para las edades de los empleados de una firma muestra que Q1 = 25 años, Mediana (Q2) = 34 años y Q3 = 42 años. ¿Qué porcentaje exacto de empleados tiene 34 años o más?",
        recurso_visual: generateSVG('<line x1="50" y1="100" x2="100" y2="100" stroke="%23ffffff" stroke-width="2"/><rect x="100" y="60" width="180" height="80" fill="%231a1d26" stroke="%2351e2f5" stroke-width="3"/><line x1="180" y1="60" x2="180" y2="140" stroke="%23d4af37" stroke-width="4"/><line x1="280" y1="100" x2="350" y2="100" stroke="%23ffffff" stroke-width="2"/><text x="95" y="160" fill="%23ffffff" font-size="12">Q1=25</text><text x="170" y="160" fill="%23d4af37" font-size="12">Q2=34</text><text x="270" y="160" fill="%23ffffff" font-size="12">Q3=42</text>'),
        opciones: ["A) 50%", "B) 25%", "C) 75%", "D) 34%"],
        ok: "A", a: 1.40, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000036', area: 'matematicas', sub: 'algebra',
        texto: "Simplifique la siguiente fracción algebraica de exponentes enteros: (x^-3 * y^2)^-2",
        recurso_visual: null,
        opciones: ["A) x^6 / y^4", "B) x^-5 / y^0", "C) y^4 / x^6", "D) x^6 * y^4"],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000037', area: 'matematicas', sub: 'funciones',
        texto: "Dada la función $f(x) = 3x - 5$, encuentre la expresión analítica correspondiente a su función inversa $f^{-1}(x)$:",
        recurso_visual: null,
        opciones: ["A) \\frac{x + 5}{3}", "B) \\frac{x - 5}{3}", "C) 3x + 5", "D) \\frac{1}{3x - 5}"],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000038', area: 'matematicas', sub: 'geometria',
        texto: "Un faro proyecta una sombra de 15 metros sobre el piso cuando el ángulo de elevación del sol respecto al horizonte es de 45°. ¿Cuál es la altura real del faro?",
        recurso_visual: generateSVG('<line x1="50" y1="160" x2="300" y2="160" stroke="%23ffffff" stroke-width="2"/><line x1="300" y1="160" x2="300" y2="40" stroke="%2351e2f5" stroke-width="4"/><line x1="50" y1="160" x2="300" y2="40" stroke="%23d4af37" stroke-dasharray="4,4"/><text x="160" y="180" fill="%23ffffff" font-size="12">Sombra = 15 m</text><text x="310" y="100" fill="%2351e2f5" font-size="12">h = ?</text><text x="80" y="150" fill="%23d4af37" font-size="12">45°</text>'),
        opciones: ["A) 15 metros", "B) 30 metros", "C) 15√2 metros", "D) 10 metros"],
        ok: "A", a: 1.45, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000039', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Tres grifos idénticos llenan un tanque en 6 horas. Si se abren 2 grifos adicionales de las mismas características, el tiempo total de llenado del tanque disminuye a:",
        recurso_visual: null,
        opciones: ["A) 3,6 horas", "B) 4,0 horas", "C) 2,5 horas", "D) 10,0 horas"],
        ok: "A", a: 1.65, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000040', area: 'matematicas', sub: 'aritmetica',
        texto: "Un atleta entrena corriendo 3/4 de kilómetro el lunes y 5/6 de kilómetro el martes. ¿Cuántos kilómetros corrió en total en los dos días?",
        recurso_visual: null,
        opciones: ["A) 19/12 km", "B) 8/10 km", "C) 15/12 km", "D) 2 km"],
        ok: "A", a: 1.35, b: -0.55, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000041', area: 'matematicas', sub: 'estadistica',
        texto: "Un alumno obtiene en 4 pruebas parciales las notas: 60, 70, 80 y 90. ¿Qué nota necesita sacar en la quinta prueba para que su promedio final sea exactamente 80?",
        recurso_visual: null,
        opciones: ["A) 100", "B) 90", "C) 85", "D) 95"],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000042', area: 'matematicas', sub: 'geometria',
        texto: "Considere la ecuación general de la circunferencia en el plano cartesiano: x² + y² - 6x + 8y = 0. Las coordenadas del centro (h, k) y el radio R corresponden a:",
        recurso_visual: null,
        opciones: ["A) Centro (3, -4) y R = 5", "B) Centro (-3, 4) y R = 25", "C) Centro (6, -8) y R = 5", "D) Centro (0, 0) y R = 10"],
        ok: "A", a: 1.85, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000043', area: 'matematicas', sub: 'algebra',
        texto: "La solución de la inecuación lineal |2x - 4| < 6 se expresa mediante el intervalo abierto:",
        recurso_visual: null,
        opciones: ["A) (-1, 5)", "B) (1, 5)", "C) (-5, 1)", "D) (-Infinity, 5)"],
        ok: "A", a: 1.75, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000044', area: 'matematicas', sub: 'funciones',
        texto: "En un experimento de física, la temperatura T de un metal se modela mediante T(t) = 100 * e^(-0,05t). Al cabo de cuánto tiempo t la temperatura descenderá exactamente a la mitad de su valor inicial T(0):",
        recurso_visual: null,
        opciones: ["A) ln(2) / 0,05", "B) 100 / 0,05", "C) e^2 / 0,05", "D) 20 segundos"],
        ok: "A", a: 1.90, b: 1.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000045', area: 'matematicas', sub: 'aritmetica',
        texto: "¿Cuál es el mínimo común múltiplo (MCM) de los números 12, 18 y 30?",
        recurso_visual: null,
        opciones: ["A) 180", "B) 360", "C) 6", "D) 90"],
        ok: "A", a: 1.30, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000046', area: 'matematicas', sub: 'geometria',
        texto: "Un trapecio isósceles posee bases paralelas b1 = 10 cm, b2 = 18 cm y lados no paralelos m = 5 cm. ¿Cuál es el área interior del trapecio?",
        recurso_visual: generateSVG('<polygon points="100,60 220,60 280,160 40,160" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="100" y1="60" x2="100" y2="160" stroke="%23e74c3c" stroke-dasharray="3,3"/><text x="150" y="50" fill="%23ffffff" font-size="12">b1 = 10 cm</text><text x="150" y="180" fill="%23ffffff" font-size="12">b2 = 18 cm</text><text x="105" y="110" fill="%23e74c3c" font-size="12">h = 3 cm</text>'),
        opciones: ["A) 42 cm²", "B) 56 cm²", "C) 84 cm²", "D) 28 cm²"],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000047', area: 'matematicas', sub: 'estadistica',
        texto: "Un histograma de frecuencias relativas acumuladas muestra que el 80% de los datos es menor o igual a 50 unidades. Esto implica que el percentil 80 (P80) es:",
        recurso_visual: null,
        opciones: ["A) 50", "B) 80", "C) 40", "D) 0,80"],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000048', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un capital depositado rinde un interés del 5% semestral. ¿A qué tasa de interés simple nominal anual equivale dicha rentabilidad?",
        recurso_visual: null,
        opciones: ["A) 10% anual", "B) 2,5% anual", "C) 15% anual", "D) 20% anual"],
        ok: "A", a: 1.25, b: -0.70, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000049', area: 'matematicas', sub: 'algebra',
        texto: "¿Cuál de las siguientes expresiones representa el cociente de la división de polinomios (x³ - 8) ÷ (x - 2)?",
        recurso_visual: null,
        opciones: ["A) x² + 2x + 4", "B) x² - 2x + 4", "C) x² + 4", "D) x² - 4"],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000050', area: 'matematicas', sub: 'funciones',
        texto: "Dada la función periódica trigonométrica f(x) = 4 * Seno(3x), la amplitud A y el periodo P de la onda corresponden a:",
        recurso_visual: generateSVG('<path d="M 20 100 Q 60 20 100 100 T 180 100 T 260 100 T 340 100" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="20" y1="100" x2="380" y2="100" stroke="%239499a7"/><text x="60" y="15" fill="%23d4af37" font-size="12">Amplitud = 4</text>'),
        opciones: ["A) Amplitud = 4, Periodo = 2π / 3", "B) Amplitud = 3, Periodo = 2π / 4", "C) Amplitud = 4, Periodo = 3π", "D) Amplitud = 1, Periodo = 2π"],
        ok: "A", a: 1.80, b: 0.70, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000051', area: 'matematicas', sub: 'geometria',
        texto: "Un cilindro metálico de radio r = 5 cm y altura h = 10 cm se funde completamente para fabricar esferas sólidas de radio R = 1 cm. Suponiendo que no hay pérdida de material, ¿cuántas esferas completas se pueden moldear?",
        recurso_visual: null,
        opciones: ["A) 187 esferas", "B) 250 esferas", "C) 125 esferas", "D) 75 esferas"],
        ok: "A", a: 1.85, b: 0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000052', area: 'matematicas', sub: 'aritmetica',
        texto: "Un tanque con capacidad de 1.000 litros se llena con dos mangueras. La primera aporta 25 L/min y la segunda 15 L/min. Simultáneamente, una fuga inferior pierde 10 L/min. ¿En cuántos minutos se llenará el tanque partiendo desde vacío?",
        recurso_visual: null,
        opciones: ["A) 33,3 minutos", "B) 25,0 minutos", "C) 50,0 minutos", "D) 40,0 minutos"],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000053', area: 'matematicas', sub: 'estadistica',
        texto: "En una muestra de datos con varianza S² = 16, la desviación estándar S y el coeficiente de variación CV para una media M = 20 son respectivamente:",
        recurso_visual: null,
        opciones: ["A) S = 4 y CV = 20%", "B) S = 16 y CV = 80%", "C) S = 2 y CV = 10%", "D) S = 8 y CV = 40%"],
        ok: "A", a: 1.60, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000054', area: 'matematicas', sub: 'algebra',
        texto: "Determine la pendiente m de la recta que pasa por los puntos P1(-2, 5) y P2(4, -7) en el plano cartesiano:",
        recurso_visual: generateSVG('<line x1="20" y1="100" x2="380" y2="100" stroke="%239499a7"/><line x1="200" y1="20" x2="200" y2="180" stroke="%239499a7"/><line x1="100" y1="30" x2="300" y2="170" stroke="%23e74c3c" stroke-width="3"/><circle cx="100" cy="30" r="5" fill="%23d4af37"/><circle cx="300" cy="170" r="5" fill="%23d4af37"/><text x="50" y="25" fill="%23ffffff" font-size="12">P1(-2, 5)</text><text x="310" y="175" fill="%23ffffff" font-size="12">P2(4, -7)</text>'),
        opciones: ["A) m = -2", "B) m = 2", "C) m = -1/2", "D) m = -12"],
        ok: "A", a: 1.45, b: -0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000055', area: 'matematicas', sub: 'geometria',
        texto: "Un terreno con forma de paralelogramo tiene lados de 10 m y 15 m con un ángulo comprendido de 30°. ¿Cuál es su área exacta?",
        recurso_visual: null,
        opciones: ["A) 75 m²", "B) 150 m²", "C) 75√3 m²", "D) 37,5 m²"],
        ok: "A", a: 1.75, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000056', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un motor consume 4,5 litros de combustible en 3 horas de operación continua. ¿Cuántos litros de combustible consumirá en un turno completo de 8 horas?",
        recurso_visual: null,
        opciones: ["A) 12,0 litros", "B) 10,5 litros", "C) 13,5 litros", "D) 15,0 litros"],
        ok: "A", a: 1.30, b: -0.65, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000057', area: 'matematicas', sub: 'algebra',
        texto: "Resuelva la siguiente ecuación logarítmica: Log2(x) + Log2(x - 2) = 3",
        recurso_visual: null,
        opciones: ["A) x = 4", "B) x = 2", "C) x = 8", "D) x = 6"],
        ok: "A", a: 1.85, b: 0.85, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000058', area: 'matematicas', sub: 'funciones',
        texto: "La función $f(x) = |x - 3| + 2$ alcanza su punto mínimo global en las coordenadas:",
        recurso_visual: generateSVG('<path d="M 50 40 L 180 150 L 310 40" fill="none" stroke="%2351e2f5" stroke-width="3"/><circle cx="180" cy="150" r="6" fill="%23d4af37"/><text x="195" y="155" fill="%23ffffff" font-size="12">Vértice Mínimo</text>'),
        opciones: ["A) (3, 2)", "B) (-3, 2)", "C) (2, 3)", "D) (0, 5)"],
        ok: "A", a: 1.55, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000059', area: 'matematicas', sub: 'funciones',
        texto: "Una población de bacterias crece exponencialmente según la ley $N(t) = 500 \\cdot 2^{t/4}$, donde $t$ es el tiempo en horas. ¿Cuántas bacterias habrá presentes al cabo de 12 horas?",
        recurso_visual: null,
        opciones: ["A) 4.000 bacterias", "B) 3.000 bacterias", "C) 1.500 bacterias", "D) 8.000 bacterias"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000060', area: 'matematicas', sub: 'geometria',
        texto: "Un faro marítimo proyecta un haz de luz desde una altura de $40\\text{ m}$ sobre el nivel del mar. El ángulo de depresión hacia una embarcación es de $30^\\circ$. Determine la distancia horizontal $d$ desde la base del faro hasta el barco:",
        recurso_visual: generateSVG('<polygon points="50,40 50,160 280,160" fill="none" stroke="%2351e2f5" stroke-width="3"/><line x1="50" y1="40" x2="150" y2="40" stroke="%239499a7" stroke-dasharray="4"/><text x="15" y="100" fill="%23d4af37" font-size="12">40 m</text><text x="150" y="180" fill="%232ecc71" font-size="12">distancia d</text><text x="80" y="35" fill="%23a855f7" font-size="12">30°</text>'),
        opciones: ["A) $40\\sqrt{3}\\text{ m}$", "B) $\\frac{40}{\\sqrt{3}}\\text{ m}$", "C) $80\\text{ m}$", "D) $20\\sqrt{3}\\text{ m}$"],
        ok: "A", a: 1.70, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000061', area: 'matematicas', sub: 'estadistica',
        texto: "Un estudio sociodemográfico analiza los salarios mensuales de 100 empleados en una entidad pública. La media aritmética es de $\\$3.500.000\\text{ COP}$ y la mediana es de $\\$2.200.000\\text{ COP}$. ¿Qué conclusión estadística es analíticamente válida sobre la distribución salarial?",
        recurso_visual: null,
        opciones: ["A) La distribución presenta asimetría positiva debido a salarios atípicamente altos en la parte superior", "B) El 50% de los empleados devenga un salario exactamente igual a la media de $3.500.000 COP", "C) La distribución es perfectamente simétrica y uniforme", "D) La desviación estándar es igual a cero"],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000062', area: 'matematicas', sub: 'combinatoria',
        texto: "Un comité de personería estudiantil debe conformarse eligiendo a 3 representantes de un grupo total de 8 candidatos preseleccionados. ¿De cuántas formas distintas se puede integrar dicho comité?",
        recurso_visual: null,
        opciones: ["A) 56 formas", "B) 336 formas", "C) 24 formas", "D) 120 formas"],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000063', area: 'matematicas', sub: 'geometria',
        texto: "Calcule el volumen total de un cilindro recto que almacena combustible, cuyo radio de la base es $r = 3\\text{ m}$ y la altura es $h = 10\\text{ m}$ (considere $\\pi \\approx 3,14$):",
        recurso_visual: generateSVG('<ellipse cx="200" cy="50" rx="80" ry="25" fill="none" stroke="%2351e2f5" stroke-width="2"/><line x1="120" y1="50" x2="120" y2="150" stroke="%2351e2f5" stroke-width="2"/><line x1="280" y1="50" x2="280" y2="150" stroke="%2351e2f5" stroke-width="2"/><ellipse cx="200" cy="150" rx="80" ry="25" fill="none" stroke="%2351e2f5" stroke-width="2"/><line x1="200" y1="50" x2="280" y2="50" stroke="%23d4af37" stroke-width="2"/><text x="230" y="45" fill="%23d4af37" font-size="12">r=3m</text><text x="290" y="105" fill="%232ecc71" font-size="12">h=10m</text>'),
        opciones: ["A) $282,6\\text{ m}^3$", "B) $94,2\\text{ m}^3$", "C) $188,4\\text{ m}^3$", "D) $565,2\\text{ m}^3$"],
        ok: "A", a: 1.40, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000064', area: 'matematicas', sub: 'algebra',
        texto: "El discriminante de la ecuación cuadrática $2x^2 - 5x + 3 = 0$ determina la naturaleza de sus raíces. Calcule su valor exacto y determine el tipo de soluciones:",
        recurso_visual: null,
        opciones: ["A) $\\Delta = 1$, dos raíces reales distintas", "B) $\\Delta = -1$, dos raíces complejas conjugadas", "C) $\\Delta = 0$, una raíz real doble", "D) $\\Delta = 49$, dos raíces reales enteras"],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000065', area: 'matematicas', sub: 'algebra',
        texto: "Halle la suma de los primeros 10 términos de la progresión aritmética $a_n = 3n + 2$:",
        recurso_visual: null,
        opciones: ["A) 185", "B) 320", "C) 150", "D) 210"],
        ok: "A", a: 1.65, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000066', area: 'matematicas', sub: 'estadistica',
        texto: "En una muestra epidemiológica de 200 pacientes, el 60% padece hipertensión, el 40% padece diabetes y el 25% padece ambas patologías. ¿Cuál es la probabilidad de seleccionar al azar un paciente que padezca al menos una de las dos condiciones?",
        recurso_visual: generateSVG('<circle cx="160" cy="100" r="60" fill="rgba(81,226,245,0.3)" stroke="%2351e2f5" stroke-width="2"/><circle cx="240" cy="100" r="60" fill="rgba(168,85,247,0.3)" stroke="%23a855f7" stroke-width="2"/><text x="130" y="105" fill="%23ffffff" font-size="12">60%</text><text x="250" y="105" fill="%23ffffff" font-size="12">40%</text><text x="190" y="105" fill="%23d4af37" font-size="12">25%</text>'),
        opciones: ["A) 75%", "B) 100%", "C) 85%", "D) 65%"],
        ok: "A", a: 1.70, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000067', area: 'matematicas', sub: 'geometria',
        texto: "La ecuación general de una circunferencia es $x^2 + y^2 - 6x + 8y = 0$. Determine las coordenadas de su centro $C(h, k)$ y la longitud de su radio $r$:",
        recurso_visual: null,
        opciones: ["A) Centro $C(3, -4)$ y radio $r = 5$", "B) Centro $C(-3, 4)$ y radio $r = 25$", "C) Centro $C(6, -8)$ y radio $r = 10$", "D) Centro $C(-6, 8)$ y radio $r = 5$"],
        ok: "A", a: 1.80, b: 0.75, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000068', area: 'matematicas', sub: 'algebra',
        texto: "Considere el vector $\\vec{u} = (3, -4)$ en el plano cartesiano. ¿Cuál es el módulo (magnitud) de $\\vec{u}$ y su vector unitario $\\hat{u}$?",
        recurso_visual: generateSVG('<line x1="50" y1="150" x2="350" y2="150" stroke="%239499a7"/><line x1="100" y1="20" x2="100" y2="180" stroke="%239499a7"/><line x1="100" y1="150" x2="250" y2="50" stroke="%232ecc71" stroke-width="3"/><polygon points="250,50 240,58 245,68" fill="%232ecc71"/><text x="180" y="80" fill="%23d4af37" font-size="12">u = (3, -4)</text>'),
        opciones: ["A) Módulo $5$ y vector unitario $\\left(\\frac{3}{5}, -\\frac{4}{5}\\right)$", "B) Módulo $7$ y vector unitario $(3, -4)$", "C) Módulo $1$ y vector unitario $\\left(\\frac{4}{5}, -\\frac{3}{5}\\right)$", "D) Módulo $25$ y vector unitario $(0,6, -0,8)$"],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000069', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un mapa topográfico del Instituto Geográfico Agustín Codazzi (IGAC) está dibujado a una escala de $1:50.000$. Si dos municipios están separados por $8\\text{ cm}$ en el mapa, ¿cuál es la distancia real en kilómetros entre ambas poblaciones?",
        recurso_visual: null,
        opciones: ["A) $4\\text{ km}$", "B) $40\\text{ km}$", "C) $0,4\\text{ km}$", "D) $400\\text{ km}$"],
        ok: "A", a: 1.45, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000070', area: 'matematicas', sub: 'algebra',
        texto: "Resuelva la inecuación lineal doble $-3 < 2x - 1 \\le 5$. El conjunto solución correspondiente expresado en notación de intervalo es:",
        recurso_visual: null,
        opciones: ["A) $(-1, 3]$", "B) $[-1, 3)$", "C) $(-2, 3]$", "D) $(0, 3)$"],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000071', area: 'matematicas', sub: 'geometria',
        texto: "Un sector circular de radio $R = 6\\text{ cm}$ tiene un ángulo central de $\\theta = 60^\\circ$. Calcule el área exacta de la región sombreada del sector:",
        recurso_visual: generateSVG('<path d="M 200 150 L 280 150 A 80 80 0 0 0 240 80 Z" fill="rgba(81,226,245,0.4)" stroke="%2351e2f5" stroke-width="2"/><text x="210" y="140" fill="%23ffffff" font-size="12">60°</text><text x="235" y="165" fill="%23d4af37" font-size="12">R = 6 cm</text>'),
        opciones: ["A) $6\\pi\\text{ cm}^2$", "B) $12\\pi\\text{ cm}^2$", "C) $36\\pi\\text{ cm}^2$", "D) $3\\pi\\text{ cm}^2$"],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000072', area: 'matematicas', sub: 'funciones',
        texto: "Dada la función racional $f(x) = \\frac{2x + 1}{x - 3}$, determine la ecuación de su asíntota vertical y la de su asíntota horizontal:",
        recurso_visual: null,
        opciones: ["A) Asíntota Vertical $x = 3$; Asíntota Horizontal $y = 2$", "B) Asíntota Vertical $x = -3$; Asíntota Horizontal $y = 1/2$", "C) Asíntota Vertical $x = 2$; Asíntota Horizontal $y = 3$", "D) Asíntota Vertical $x = 0$; Asíntota Horizontal $y = 0$"],
        ok: "A", a: 1.75, b: 0.45, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000073', area: 'matematicas', sub: 'estadistica',
        texto: "En un experimento aleatorio se lanzan dos dados honestos de 6 caras. ¿Cuál es la probabilidad de que la suma de los puntos obtenidos sea un número mayor o igual a 10?",
        recurso_visual: null,
        opciones: ["A) $\\frac{6}{36} = \\frac{1}{6}$", "B) $\\frac{3}{36} = \\frac{1}{12}$", "C) $\\frac{10}{36} = \\frac{5}{18}$", "D) $\\frac{4}{36} = \\frac{1}{9}$"],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000074', area: 'matematicas', sub: 'algebra',
        texto: "Simplifique la expresión algebraica racional $\\frac{x^2 - 9}{x^2 + 5x + 6}$ para todo $x \\neq -3, x \\neq -2$:",
        recurso_visual: null,
        opciones: ["A) $\\frac{x - 3}{x + 2}$", "B) $\\frac{x + 3}{x - 2}$", "C) $\\frac{-9}{5x + 6}$", "D) $\\frac{x - 3}{x + 3}$"],
        ok: "A", a: 1.70, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000075', area: 'matematicas', sub: 'geometria',
        texto: "Un prisma triangular recto tiene una base triangular con área de $12\\text{ cm}^2$ y una altura de $15\\text{ cm}$. Si se aplica una escala de homotecia con factor $k = 2$ a todas sus dimensiones lineales, ¿cuál será el nuevo volumen del prisma expandido?",
        recurso_visual: null,
        opciones: ["A) $1.440\\text{ cm}^3$", "B) $360\\text{ cm}^3$", "C) $720\\text{ cm}^3$", "D) $2.880\\text{ cm}^3$"],
        ok: "A", a: 1.85, b: 0.80, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000076', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un grifo A llena un tanque de agua en 4 horas y un desagüe B lo vacía por completo en 6 horas. Si ambos funcionan simultáneamente con el tanque inicialmente vacío, ¿en cuántas horas se llenará por completo?",
        recurso_visual: null,
        opciones: ["A) 12 horas", "B) 10 horas", "C) 5 horas", "D) 8 horas"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000077', area: 'matematicas', sub: 'funciones',
        texto: "El costo total de producción de $x$ unidades de un bien en una pequeña empresa viene dado por $C(x) = 100x + 5.100$ y el ingreso por ventas es $I(x) = 250x$. ¿En cuántas unidades vendidas la empresa alcanza el punto de equilibrio ($I(x) = C(x)$)?",
        recurso_visual: null,
        opciones: ["A) 34 unidades", "B) 50 unidades", "C) 20 unidades", "D) 100 unidades"],
        ok: "A", a: 1.40, b: -0.35, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000078', area: 'matematicas', sub: 'geometria',
        texto: "En un triángulo cualquiera $ABC$, se conocen dos lados $a = 7\\text{ cm}$, $b = 10\\text{ cm}$ y el ángulo comprendido entre ellos $C = 60^\\circ$. Calcule la longitud del lado $c$ aplicando el Teorema del Coseno ($c^2 = a^2 + b^2 - 2ab \\cos C$):",
        recurso_visual: generateSVG('<polygon points="50,150 250,150 150,50" fill="none" stroke="%2351e2f5" stroke-width="3"/><text x="100" y="90" fill="%23d4af37" font-size="12">a = 7 cm</text><text x="210" y="90" fill="%23d4af37" font-size="12">b = 10 cm</text><text x="145" y="140" fill="%23a855f7" font-size="12">60°</text>'),
        opciones: ["A) $\\sqrt{79}\\text{ cm}$", "B) $\\sqrt{149}\\text{ cm}$", "C) $9\\text{ cm}$", "D) $\\sqrt{119}\\text{ cm}$"],
        ok: "A", a: 1.80, b: 0.65, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000079', area: 'matematicas', sub: 'algebra',
        texto: "Determine el valor de $x$ que satisface la ecuación exponencial $2^{x+1} + 2^x = 48$:",
        recurso_visual: null,
        opciones: ["A) $x = 4$", "B) $x = 5$", "C) $x = 3$", "D) $x = 16$"],
        ok: "A", a: 1.65, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000080', area: 'matematicas', sub: 'estadistica',
        texto: "En un examen estandarizado, el Curso A obtuvo una media de 70 puntos con desviación estándar $\\sigma = 4$, mientras que el Curso B obtuvo una media de 70 puntos con $\\sigma = 12$. ¿Qué conclusión estadística es objetivamente correcta?",
        recurso_visual: null,
        opciones: ["A) El Curso A presenta menor dispersión en las notas y mayor homogeneidad en su rendimiento.", "B) El Curso B tiene notas más altas en promedio que el Curso A.", "C) Todos los estudiantes del Curso A sacaron exactamente 70 puntos.", "D) El Curso A y el Curso B presentan idéntica variabilidad en los resultados."],
        ok: "A", a: 1.50, b: -0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000081', area: 'matematicas', sub: 'geometria',
        texto: "Un contenedor cilíndrico recto tiene radio $r = 3\\text{ m}$ y altura $h = 10\\text{ m}$. ¿Cuál es el volumen total de agua en metros cúbicos que puede almacenar a su máxima capacidad?",
        recurso_visual: generateSVG('<ellipse cx="200" cy="60" rx="60" ry="20" fill="none" stroke="%2351e2f5" stroke-width="2"/><line x1="140" y1="60" x2="140" y2="180" stroke="%2351e2f5" stroke-width="2"/><line x1="260" y1="60" x2="260" y2="180" stroke="%2351e2f5" stroke-width="2"/><ellipse cx="200" cy="180" rx="60" ry="20" fill="none" stroke="%2351e2f5" stroke-width="2"/><text x="200" y="55" fill="%23d4af37" font-size="12">r = 3m</text><text x="270" y="120" fill="%23a855f7" font-size="12">h = 10m</text>'),
        opciones: ["A) $90\\pi\\text{ m}^3$", "B) $30\\pi\\text{ m}^3$", "C) $60\\pi\\text{ m}^3$", "D) $180\\pi\\text{ m}^3$"],
        ok: "A", a: 1.60, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000082', area: 'matematicas', sub: 'funciones',
        texto: "Un vehículo nuevo cuesta 50.000.000 COP. Su valor comercial se deprecia un $20\\%$ anual, modelado por $V(t) = 50.000.000 \\times (0,8)^t$, donde $t$ es el tiempo en años. ¿Cuál será el valor del vehículo transcurridos 2 años?",
        recurso_visual: null,
        opciones: ["A) 32.000.000 COP", "B) 40.000.000 COP", "C) 30.000.000 COP", "D) 20.000.000 COP"],
        ok: "A", a: 1.55, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000083', area: 'matematicas', sub: 'estadistica',
        texto: "Sean $A$ y $B$ dos eventos independientes en un espacio muestral, tales que $P(A) = 0,4$ y $P(B) = 0,5$. Calcule la probabilidad del evento unión $P(A \\cup B)$:",
        recurso_visual: null,
        opciones: ["A) $0,70$", "B) $0,90$", "C) $0,20$", "D) $0,50$"],
        ok: "A", a: 1.70, b: 0.35, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000084', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Seis obreros trabajando a ritmo constante construyen 100 metros de muro en 10 días. ¿Cuántos metros de muro construirán 9 obreros trabajando al mismo ritmo durante 8 días?",
        recurso_visual: null,
        opciones: ["A) 120 metros", "B) 150 metros", "C) 100 metros", "D) 80 metros"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000085', area: 'matematicas', sub: 'geometria',
        texto: "Un paralelepípedo rectangular tiene dimensiones $3\\text{ cm} \\times 4\\text{ cm} \\times 12\\text{ cm}$. Calcule la longitud de su diagonal principal tridimensional:",
        recurso_visual: null,
        opciones: ["A) $13\\text{ cm}$", "B) $19\\text{ cm}$", "C) $15\\text{ cm}$", "D) $\\sqrt{160}\\text{ cm}$"],
        ok: "A", a: 1.75, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000086', area: 'matematicas', sub: 'algebra',
        texto: "En la ecuación cuadrática $x^2 - kx + 9 = 0$, halle el valor positivo de $k$ para el cual la ecuación tiene exactamente una solución real única (raíz doble):",
        recurso_visual: null,
        opciones: ["A) $k = 6$", "B) $k = 9$", "C) $k = 3$", "D) $k = 18$"],
        ok: "A", a: 1.80, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000087', area: 'matematicas', sub: 'estadistica',
        texto: "Los salarios mensuales (en millones de COP) de 7 empleados de una PYME son: $1,5$; $1,8$; $2,0$; $2,2$; $2,5$; $4,0$; $12,0$. Calcule la mediana de estos salarios:",
        recurso_visual: null,
        opciones: ["A) $2,2$ millones", "B) $3,7$ millones", "C) $2,5$ millones", "D) $2,0$ millones"],
        ok: "A", a: 1.45, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000088', area: 'matematicas', sub: 'funciones',
        texto: "El pH de una solución acuosa está dado por la fórmula $pH = -\\log_{10}[H^+]$, donde $[H^+]$ es la concentración de hidronios en moles/litro. Si una solución tiene $[H^+] = 10^{-4}\\text{ M}$, ¿cuál es su valor de pH?",
        recurso_visual: null,
        opciones: ["A) $pH = 4$", "B) $pH = -4$", "C) $pH = 10$", "D) $pH = 1$"],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000089', area: 'matematicas', sub: 'trigonometria',
        texto: "Simplifique la expresión trigonométrica $\\frac{\\sin^2 x + \\cos^2 x}{\\sec x}$ para todo $x$ donde $\\cos x \\neq 0$:",
        recurso_visual: null,
        opciones: ["A) $\\cos x$", "B) $\\sin x$", "C) $\\tan x$", "D) $1$"],
        ok: "A", a: 1.70, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000090', area: 'matematicas', sub: 'estadistica',
        texto: "Un comité de 3 personas va a ser seleccionado entre un grupo de 8 candidatos sin importar el orden. ¿De cuántas maneras diferentes se puede formar el comité?",
        recurso_visual: null,
        opciones: ["A) 56 maneras", "B) 336 maneras", "C) 24 maneras", "D) 120 maneras"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000091', area: 'matematicas', sub: 'geometria',
        texto: "Un poste vertical de 4 metros de altura proyecta una sombra de 6 metros sobre el suelo. A la misma hora, un edificio cercano proyecta una sombra de 45 metros. Calcule la altura del edificio:",
        recurso_visual: null,
        opciones: ["A) 30 metros", "B) 67,5 metros", "C) 36 metros", "D) 24 metros"],
        ok: "A", a: 1.55, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000092', area: 'matematicas', sub: 'algebra',
        texto: "Por 3 kg de manzanas y 2 kg de peras se pagan $16.000. Por 2 kg de manzanas y 4 kg de peras se pagan $20.000. ¿Cuál es el precio por kilogramo de manzana?",
        recurso_visual: null,
        opciones: ["A) $3.000 COP", "B) $3.500 COP", "C) $4.000 COP", "D) $2.500 COP"],
        ok: "A", a: 1.60, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000093', area: 'matematicas', sub: 'funciones',
        texto: "La trayectoria parabólica de un proyectil está definida por la función $h(t) = -5t^2 + 20t + 2$, donde $h$ es la altura en metros y $t$ el tiempo en segundos. Determine la altura máxima alcanzada por el proyectil:",
        recurso_visual: null,
        opciones: ["A) 22 metros", "B) 20 metros", "C) 18 metros", "D) 25 metros"],
        ok: "A", a: 1.75, b: 0.40, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000094', area: 'matematicas', sub: 'estadistica',
        texto: "En un diagrama de caja y bigotes (box plot), el primer cuartil es $Q_1 = 25$ y el tercer cuartil es $Q_3 = 65$. Calcule el Rango Intercuartílico (IQR):",
        recurso_visual: null,
        opciones: ["A) $40$", "B) $90$", "C) $45$", "D) $20$"],
        ok: "A", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000095', area: 'matematicas', sub: 'geometria',
        texto: "Una ventana está formada por un rectángulo de base $8\\text{ cm}$ y altura $10\\text{ cm}$, rematado en la parte superior por un semicírculo cuyo diámetro coincide con la base del rectángulo. Calcule el área total exacta de la ventana:",
        recurso_visual: null,
        opciones: ["A) $80 + 8\\pi\\text{ cm}^2$", "B) $80 + 16\\pi\\text{ cm}^2$", "C) $80 + 32\\pi\\text{ cm}^2$", "D) $160 + 8\\pi\\text{ cm}^2$"],
        ok: "A", a: 1.80, b: 0.55, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 1 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000096', area: 'matematicas', sub: 'proporcionalidad',
        texto: "Un capital inicial de 10.000.000 COP se invierte a una tasa de interés compuesto del $10\\%$ anual capitalizable anualmente durante 2 años. ¿Cuál es el monto final acumulado?",
        recurso_visual: null,
        opciones: ["A) 12.100.000 COP", "B) 12.000.000 COP", "C) 11.000.000 COP", "D) 13.000.000 COP"],
        ok: "A", a: 1.55, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000097', area: 'matematicas', sub: 'algebra',
        texto: "Dada la progresión aritmética cuyo primer término es $a_1 = 3$ y su diferencia común es $d = 4$, calcule la suma de los primeros 10 términos ($S_{10}$):",
        recurso_visual: null,
        opciones: ["A) $210$", "B) $190$", "C) $390$", "D) $230$"],
        ok: "A", a: 1.70, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000098', area: 'matematicas', sub: 'funciones',
        texto: "Determine el dominio de la función real $f(x) = \\sqrt{2x - 8}$ en el conjunto de los números reales:",
        recurso_visual: null,
        opciones: ["A) $[4, +\\infty)$", "B) $(4, +\\infty)$", "C) $(-\\infty, 4]$", "D) $[8, +\\infty)$"],
        ok: "A", a: 1.50, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    { id: '11111111-0000-4000-8000-000000000099', area: 'matematicas', sub: 'estadistica',
        texto: "En una encuesta aplicada a 100 estudiantes, 60 practican fútbol, 40 practican baloncesto y 15 practican ambos deportes. Si se selecciona un estudiante al azar, ¿cuál es la probabilidad de que practique al menos uno de los dos deportes?",
        recurso_visual: null,
        opciones: ["A) $0,85$", "B) $1,00$", "C) $0,75$", "D) $0,60$"],
        ok: "A", a: 1.65, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

const reactivosGen = generarReactivosMatematicasMasivos(1000);
export const reactivosMatematicas = [...reactivosSeed, ...reactivosGen];