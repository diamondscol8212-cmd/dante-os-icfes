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
    // 📐 MATEMÁTICAS (10 Reactivos)
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
    {
        area: 'matematicas', sub: 'proporcionalidad',
        texto: "En una fábrica de confecciones en Medellín, 6 operarios confeccionan 120 camisas en un turno de 8 horas. Si la demanda aumenta y se requiere producir 300 camisas bajo las mismas condiciones de rendimiento, ¿cuántas horas deberá laborar el equipo completo?",
        opciones: ["A) 12 horas", "B) 16 horas", "C) 20 horas", "D) 24 horas"],
        ok: "C", a: 1.35, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'aritmetica',
        texto: "Un artículo cuyo precio de lista es $200.000 COP tiene un descuento del 20% por temporada. Al momento de pagar en caja, se aplica un impuesto al valor agregado (IVA) del 19% sobre el valor ya rebajado. ¿Cuál es el precio final que paga el consumidor?",
        opciones: ["A) $190.400 COP", "B) $198.000 COP", "C) $200.000 COP", "D) $180.000 COP"],
        ok: "A", a: 1.50, b: 0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'funciones',
        texto: "Dada la función cuadrática f(x) = -x² + 6x - 8, las coordenadas exactas donde la parábola corta al eje horizontal de las abscisas (f(x) = 0) corresponden a:",
        opciones: ["A) (2, 0) y (4, 0)", "B) (-2, 0) y (-4, 0)", "C) (1, 0) y (8, 0)", "D) (0, -8)"],
        ok: "A", a: 1.75, b: 0.50, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'geometria',
        texto: "Una piscina olímpica tiene forma rectangular con 50 metros de largo, 25 metros de ancho y una profundidad uniforme de 2 metros. Si se llena hasta el 90% de su capacidad total, ¿cuántos metros cúbicos de agua contiene?",
        opciones: ["A) 2.500 m³", "B) 2.250 m³", "C) 2.000 m³", "D) 2.750 m³"],
        ok: "B", a: 1.45, b: 0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 1 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 1, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'matematicas', sub: 'estadistica',
        texto: "Las calificaciones obtenidas por un estudiante en 5 exámenes de matemáticas fueron: 3.5, 4.0, 3.0, 4.5 y 3.8. Si el profesor decide eliminar la nota más baja y reemplazarla por un promedio ponderado, ¿cómo se afecta la mediana del conjunto original de datos?",
        opciones: ["A) Aumenta significativamente", "B) Disminuye por el peso estadístico", "C) Permanece inalterada en 3.8", "D) Se desplaza al extremo superior"],
        ok: "C", a: 1.30, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "B", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // ----------------------------------------------------------------
    // 📖 LECTURA CRÍTICA (10 Reactivos) -> Etiquetado exacto: lectura_critica
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
    {
        area: 'lectura_critica', sub: 'semantica',
        texto: "En un texto sobre la economía global, el autor afirma que 'el mercado financiero opera bajo una miopía crónica'. La expresión 'miopía crónica' se emplea en el texto como una metáfora para indicar que:",
        opciones: ["A) Los inversores padecen problemas oftalmológicos reales por el uso de pantallas.", "B) Las decisiones financieras priorizan el beneficio a corto plazo ignorando riesgos estructurales futuros.", "C) Los gobiernos regulan con deficiencia las bolsas de valores del mundo.", "D) La economía carece de datos estadísticos confiables a largo plazo."],
        ok: "B", a: 1.45, b: 0.05, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'textos_discontinuos',
        texto: "Una caricatura política muestra a un político cortando la cinta inaugural de una biblioteca pública vacía de libros, mientras de fondo los ciudadanos hacen fila en una tienda de apuestas. El propósito principal del caricaturista es:",
        opciones: ["A) Promover la asistencia masiva a las casas de apuestas comerciales.", "B) Criticar la demagogia institucional al inaugurar infraestructura sin dotación real frente a crisis sociales.", "C) Demostrar que las bibliotecas públicas ya no son útiles en la era digital.", "D) Elogiar la rápida gestión de obras públicas del gobierno local."],
        ok: "B", a: 1.35, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'inferencia',
        texto: "Un fragmento científico sostiene: 'Los fósiles hallados en la formación geológica sugieren que el altiplano cundiboyacense estuvo cubierto por un cuerpo de agua somero hace millones de años'. A partir de este enunciado, se puede inferir válidamente que:",
        opciones: ["A) Los fósiles encontrados corresponden exclusivamente a mamíferos terrestres modernos.", "B) Las condiciones climáticas y geográficas de la región han experimentado transformaciones drásticas.", "C) El agua del altiplano desapareció por intervención humana directa en la antigüedad.", "D) El relieve actual de la cordillera de los Andes permaneció estático desde el Precámbrico."],
        ok: "B", a: 1.50, b: 0.15, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'argumentacion',
        texto: "Un defensor del medio ambiente argumenta: 'Debemos prohibir los plásticos de un solo uso porque los océanos están llenos de microplásticos que afectan la fauna marina'. Un opositor responde: 'Si prohibimos el plástico, miles de empleos en la industria manufacturera se perderán inmediatamente'. El argumento del opositor se centra en:",
        opciones: ["A) Invalidar la evidencia científica sobre los microplásticos marinos.", "B) Oponer un perjuicio socioeconómico directo para desviar el debate ecológico.", "C) Demostrar que el plástico es un material biodegradable a largo plazo.", "D) Proponer una alternativa tecnológica más limpia para las fábricas."],
        ok: "B", a: 1.65, b: 0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'semantica',
        texto: "En una novela clásica se lee: 'El silencio de la sala era tan espeso que podía cortarse con un cuchillo'. Esta figura retórica cumple la función de:",
        opciones: ["A) Describir un fenómeno físico medible con instrumentos acústicos.", "B) Exagerar mediante una imagen sensorial táctil la absoluta quietud del ambiente.", "C) Demostrar que había un cuchillo escondido en la habitación.", "D) Señalar un conflicto violento entre los personajes presentes."],
        ok: "B", a: 1.25, b: -0.60, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'filosofia',
        texto: "Para Immanuel Kant, la Ilustración se define como la salida del hombre de su minoría de edad imputable a él mismo. Esta 'minoría de edad' alude específicamente a:",
        opciones: ["A) La incapacidad biológica de los niños para firmar contratos legales.", "B) La pereza y cobardía para servirse del propio entendimiento sin la guía de otros.", "C) La prohibición de estudiar en universidades públicas.", "D) La dependencia exclusiva de la tecnología moderna."],
        ok: "B", a: 1.70, b: 0.60, c: 0.25,
        q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'inferencia',
        texto: "Un informe epidemiológico indica que el consumo de bebidas azucaradas guarda una correlación directa con el incremento de diabetes tipo 2. Un lector concluye de inmediato que 'el azúcar produce diabetes en el 100% de los casos'. Lógicamente, esta conclusión es apresurada porque:",
        opciones: ["A) Una correlación estadística no demuestra causalidad absoluta ni opera igual en todos los organismos.", "B) El informe fue financiado por la industria de refrescos.", "C) La diabetes tipo 2 solo se transmite de padres a hijos.", "D) Las bebidas azucaradas no contienen glucosa real."],
        ok: "A", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'lectura_critica', sub: 'argumentacion',
        texto: "En un ensayo sobre estética, el autor sostiene que 'el arte no debe buscar la belleza complaciente, sino incomodar las certezas del espectador'. De acuerdo con esto, el valor de una obra artística recae en su capacidad para:",
        opciones: ["A) Decorar espacios arquitectónicos con armonía visual.", "B) Generar cuestionamientos profundos y sacudir el pensamiento dogmático.", "C) Reproducir fielmente la naturaleza mediante técnicas de pintura realista.", "D) Obtener alta rentabilidad económica en galerías comerciales."],
        ok: "B", a: 1.40, b: -0.15, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // ----------------------------------------------------------------
    // 🧪 CIENCIAS NATURALES (10 Reactivos) -> Etiquetado exacto: ciencias_naturales
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
    {
        area: 'ciencias_naturales', sub: 'quimica',
        texto: "En un recipiente cerrado se mezclan 2 moles de gas hidrógeno (H₂) y 1 mol de gas oxígeno (O₂) a temperatura constante. Al reaccionar completamente para formar agua (H₂O), considerando la ley de conservación de la masa, se producen exactamente:",
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
        opciones: ["A) 2 vatios", "B) 40 vatios", "C) 200 vatios", "D) 10 vatios"],
        ok: "B", a: 1.50, b: 0.00, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },

    // ----------------------------------------------------------------
    // 🇬🇧 INGLÉS (10 Reactivos) -> Etiquetado exacto: ingles
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
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "Choose the option that best replaces the underlined phrasal verb in context: 'The local government decided to <u>put off</u> the construction of the new public library until next year.'",
        opciones: ["A) accelerate", "B) postpone", "C) cancel permanently", "D) inspect"],
        ok: "B", a: 1.30, b: -0.30, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Select the correct passive voice transformation for the sentence: 'Scientists discovered a new renewable energy source last month.'",
        opciones: ["A) A new renewable energy source is discovered by scientists last month.", "B) A new renewable energy source was discovered by scientists last month.", "C) Scientists were discovered by a new renewable energy source.", "D) A new renewable energy source has been discovering."],
        ok: "B", a: 1.60, b: 0.25, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the public sign: 'AUTHORIZED PERSONNEL ONLY BEYOND THIS POINT'. What does this notice mean?",
        opciones: ["A) Everyone is welcome to enter this area freely.", "B) Only workers with official permission are allowed to pass.", "C) This area is closed permanently for remodeling.", "D) Visitors must buy a ticket before entering."],
        ok: "B", a: 1.15, b: -0.90, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct modal verb to express strong obligation: 'Visitors __________ turn off their mobile phones during the museum exhibition.'",
        opciones: ["A) might", "B) must", "C) could", "D) would"],
        ok: "B", a: 1.25, b: -0.50, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "What is the antonym of the adjective 'ancient' in historical contexts?",
        opciones: ["A) Modern", "B) Huge", "C) Ancient", "D) Expensive"],
        ok: "A", a: 1.20, b: -0.80, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Complete with the correct comparative form: 'Bogotá is generally __________ than Cartagena during the rainy season.'",
        opciones: ["A) more cold", "B) colder", "C) coldest", "D) as cold as"],
        ok: "B", a: 1.35, b: -0.40, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'reading_comprehension',
        texto: "Read the short text: 'Despite the heavy rain, the marathon runners completed the 42-kilometer course with excellent times.' What does 'Despite' mean in this context?",
        opciones: ["A) Because of", "B) In spite of / Even with", "C) Before", "D) Instead of"],
        ok: "B", a: 1.45, b: -0.10, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'grammar_reading',
        texto: "Choose the correct relative pronoun for the sentence: 'The scientist __________ discovered the new vaccine received an international award.'",
        opciones: ["A) which", "B) who", "C) where", "D) whose"],
        ok: "B", a: 1.40, b: -0.20, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "A", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    },
    {
        area: 'ingles', sub: 'vocabulary',
        texto: "What is the primary synonym for the word 'accurate' in technical and scientific reports?",
        opciones: ["A) Precise / Correct", "B) Approximate", "C) Complex", "D) Brief"],
        ok: "A", a: 1.30, b: -0.45, c: 0.25,
        q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 },
        trampas: [
            { opcion: "B", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "C", vulnera_heuristica_lineal: 0, vulnera_inversion_operacional: 1, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 },
            { opcion: "D", vulnera_heuristica_lineal: 1, vulnera_inversion_operacional: 0, vulnera_omision_conversion: 0, vulnera_error_geometrico: 0 }
        ]
    }
];

async function sembrarBancoSoberano() {
    console.log("🚀 [SIEMBRA DANTE OS]: Limpiando tablas e inyectando banco completo normalizado...");

    try {
        await supabase.from('mapa_trampas_distractores').delete().neq('opcion_marcada', 'CLEAN_ALL');
        await supabase.from('matriz_q_items').delete().neq('attr_heuristica_lineal', -999);
        await supabase.from('banco_items_irt').delete().neq('area_general', 'CLEAN_ALL');

        console.log("🧹 Tablas purgadas con éxito.");

        for (const item of REACTIVOS_REALES) {
            const itemId = crypto.randomUUID();

            // 🛠️ Normalizar área a minúsculas exactas requeridas por el router
            const areaNormalized = String(item.area).toLowerCase().trim();

            const { error: errBase } = await supabase.from('banco_items_irt').insert([{
                id: itemId,
                area_general: areaNormalized,
                sub_competencia: item.sub,
                pregunta_texto: item.texto,
                opciones_respuesta: item.opciones,
                correcta: item.ok,
                parametro_a_discriminacion: item.a,
                parametro_b_dificultad: item.b,
                parametro_c_adivinacion: item.c
            }]);

            if (errBase) throw new Error(`Error en banco_items_irt: ${errBase.message}`);

            const { error: errQ } = await supabase.from('matriz_q_items').insert([{
                item_id: itemId,
                attr_heuristica_lineal: item.q.attr_heuristica_lineal,
                attr_inversion_operacional: item.q.attr_inversion_operacional,
                attr_omision_conversion: item.q.attr_omision_conversion,
                attr_error_geometrico: item.q.attr_error_geometrico
            }]);

            if (errQ) throw new Error(`Error en matriz_q_items: ${errQ.message}`);

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

            console.log(`✅ Ítem sembrado y normalizado: [${areaNormalized.toUpperCase()} // ${item.sub.toUpperCase()}] -> UUID: ${itemId}`);
        }

        console.log("\n🎉 [SIEMBRA COMPLETADA]: 40 reactivos perfectamente normalizados para Supabase.");
        process.exit(0);

    } catch (err) {
        console.error("🚨 [CRITICAL SEEDER ERROR]:", err.message);
        process.exit(1);
    }
}

sembrarBancoSoberano();
