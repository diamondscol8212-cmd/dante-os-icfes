/**
 * Banco curado · Modo Dante (campaña 15 días).
 * Distractores plausibles. Correcta en fuente; al render se barajan letras.
 * Evita repetir ítems ya vistos en la campaña (localStorage).
 */
(function (global) {
  'use strict';

  const USED_PREFIX = 'dante_mind_pulso_campaign_used_v1:';

  /** @type {Array} */
  const ITEMS_B1 = [
    // —— Lectura ——
    {
      id: 'item_ap_lec_001', area: 'lectura', sub: 'dos_textos', b: 0.2, blocks: [1],
      texto: 'Texto 1: «El parque se cierra a las seis para cuidar las plantas.» Texto 2: «Cerrar el parque temprano deja sin espacio a quien sale del colegio.» ¿En qué coinciden los dos textos?',
      correcta: 'Hablan del horario de cierre del parque',
      distractores: [
        'Ambos juzgan si el cierre es bueno o malo',
        'Ambos proponen sembrar más árboles',
        'Ambos describen un partido en el parque'
      ]
    },
    {
      id: 'item_ap_lec_004', area: 'lectura', sub: 'dos_textos', b: 0.5, blocks: [1, 2],
      texto: 'Texto 1: «Una noticia debe separar los hechos de la opinión.» Texto 2: «El columnista puede defender una postura, siempre que la marque como propia.» De los dos textos se concluye que',
      correcta: 'no todo texto periodístico tiene la misma obligación de neutralidad',
      distractores: [
        'la opinión está prohibida en cualquier escrito',
        'noticias y columnas exigen exactamente el mismo tono',
        'el columnista no puede dar su punto de vista'
      ]
    },
    {
      id: 'item_ap_lec_010', area: 'lectura', sub: 'dos_textos', b: 0.7, blocks: [1, 2],
      texto: 'Texto 1: «La frase “esto es un desastre” expresa valoración.» Texto 2: «La frase “cayeron 20 mm de lluvia” informa un dato.» La distinción que proponen es entre',
      correcta: 'opinión y hecho',
      distractores: ['pasado y futuro', 'verso y prosa', 'pregunta y respuesta']
    },
    {
      id: 'item_ap_lec_037', area: 'lectura', sub: 'argumentacion', b: 0.2, blocks: [1, 2],
      texto: '«Como el bus llegó tarde tres días, el sistema completo es inútil.» Esa conclusión es débil porque',
      correcta: 'generaliza a partir de tres casos',
      distractores: [
        'cita un horario completo del sistema',
        'distingue hechos y opiniones con claridad',
        'limita la afirmación solo a esos tres días'
      ]
    },
    {
      id: 'item_ap_lec_041', area: 'lectura', sub: 'argumentacion', b: 0.1, blocks: [1],
      texto: '¿Cuál enunciado es una opinión?',
      correcta: 'El mejor descanso es caminar',
      distractores: [
        'La clase dura 50 minutos',
        'Hay 30 estudiantes en la lista',
        'El salón queda en el segundo piso'
      ]
    },
    {
      id: 'item_ap_lec_047', area: 'lectura', sub: 'inferencia', b: -0.1, blocks: [1, 2],
      texto: '«Guardó el paraguas mojado en la bolsa.» Se infiere que',
      correcta: 'había llovido o el paraguas estaba húmedo',
      distractores: [
        'el día estuvo seco todo el tiempo',
        'guardó el paraguas sin haberlo usado',
        'va a comprar un paraguas nuevo'
      ]
    },
    {
      id: 'item_ap_lec_016', area: 'lectura', sub: 'dos_textos', b: 0.8, blocks: [2, 3],
      texto: 'Texto 1 concluye que «la app ahorra tiempo». Texto 2 muestra que tres usuarios tardaron más que con el cuaderno. El texto 2',
      correcta: 'debilita la conclusión del texto 1',
      distractores: [
        'prueba que la app siempre es más rápida',
        'no aporta información útil',
        'copia el texto 1 sin aportar datos'
      ]
    },
    {
      id: 'item_ap_lec_050', area: 'lectura', sub: 'argumentacion', b: 0.3, blocks: [1, 2],
      texto: '«Nadie de mi calle separa la basura; luego en la ciudad nadie lo hace.» El fallo está en',
      correcta: 'pasar de un caso local a toda la ciudad sin prueba',
      distractores: [
        'usar un ejemplo concreto',
        'hablar de un tema ambiental',
        'mencionar la basura'
      ]
    },
    {
      id: 'item_ap_lec_101', area: 'lectura', sub: 'proposito', b: 0.15, blocks: [1, 2, 3],
      texto: 'Un cartel en la biblioteca dice: «Silencio: otros están estudiando.» El propósito principal del cartel es',
      correcta: 'pedir una conducta para no molestar',
      distractores: [
        'anunciar un horario de cierre',
        'vender libros usados',
        'contar la historia de la biblioteca'
      ]
    },
    {
      id: 'item_ap_lec_102', area: 'lectura', sub: 'inferencia', b: 0.25, blocks: [1, 2, 3],
      texto: '«Sofía apagó el celular y lo guardó en la mochila antes de entrar al salón.» Lo más razonable es inferir que',
      correcta: 'quiere cumplir una norma o evitar distracciones en clase',
      distractores: [
        'el celular está dañado sin duda',
        'Sofía no sabe usar el celular',
        'en el salón está prohibido llevar mochila'
      ]
    },
    {
      id: 'item_ap_lec_103', area: 'lectura', sub: 'dos_textos', b: 0.45, blocks: [1, 2, 3],
      texto: 'Texto 1: «El recreo debe alargarse para que los estudiantes descansen.» Texto 2: «Alargar el recreo reduce minutos de clase y baja el avance del plan.» Ambos textos',
      correcta: 'hablan del tiempo del recreo, pero con valoraciones distintas',
      distractores: [
        'niegan que exista recreo en el colegio',
        'proponen el mismo horario sin discusión',
        'solo hablan de alimentación escolar'
      ]
    },
    {
      id: 'item_ap_lec_104', area: 'lectura', sub: 'cohesion', b: 0.35, blocks: [2, 3],
      texto: '«Diego estudió toda la noche. Por eso llegó cansado al examen.» La expresión “Por eso” indica',
      correcta: 'una consecuencia de lo dicho antes',
      distractores: [
        'una pregunta al lector',
        'una contradicción total',
        'un cambio de tema sin relación'
      ]
    },
    {
      id: 'item_ap_lec_105', area: 'lectura', sub: 'argumentacion', b: 0.55, blocks: [2, 3],
      texto: 'Un texto afirma: «Debemos prohibir todas las redes porque un joven perdió una hora.» La debilidad principal es que',
      correcta: 'usa un solo caso para justificar una prohibición total',
      distractores: [
        'habla de jóvenes',
        'menciona las redes sociales',
        'usa un ejemplo concreto'
      ]
    },
    {
      id: 'item_ap_lec_106', area: 'lectura', sub: 'inferencia', b: 0.2, blocks: [1, 2, 3],
      texto: 'En una receta: «Si la masa se pega, agrega un poco de harina.» Se entiende que',
      correcta: 'agregar harina es un ajuste cuando hay un problema',
      distractores: [
        'siempre hay que agregar harina al final',
        'la masa nunca debe tocarse',
        'la receta prohíbe usar harina'
      ]
    },
    {
      id: 'item_ap_lec_107', area: 'lectura', sub: 'proposito', b: 0.4, blocks: [2, 3],
      texto: 'Un artículo termina: «Antes de compartir una noticia, verifica la fuente.» El autor busca principalmente',
      correcta: 'orientar al lector a un hábito responsable',
      distractores: [
        'insultar a quienes usan redes',
        'anunciar una app de cocina',
        'narrar un cuento de ficción'
      ]
    },
    {
      id: 'item_ap_lec_108', area: 'lectura', sub: 'dos_textos', b: 0.6, blocks: [2, 3],
      texto: 'Texto 1: «El uniforme reduce la competencia por ropa.» Texto 2: «El uniforme limita la expresión personal.» Una síntesis justa sería que',
      correcta: 'el uniforme tiene efectos que unos valoran y otros critican',
      distractores: [
        'ambos niegan que exista uniforme',
        'ambos dicen exactamente lo mismo',
        'ninguno habla de estudiantes'
      ]
    },

    // —— Matemáticas ——
    {
      id: 'item_ap_mat_001', area: 'matematicas', sub: 'probabilidad', b: -0.4, blocks: [1, 2],
      texto: 'En una bolsa hay 5 fichas rojas y 3 verdes. Se saca una al azar. ¿Cuál es la probabilidad de sacar una verde?',
      correcta: '3/8',
      distractores: ['5/8', '3/5', '1/3']
    },
    {
      id: 'item_ap_mat_002', area: 'matematicas', sub: 'probabilidad', b: -0.2, blocks: [1, 2],
      texto: 'Se lanza un dado justo de seis caras. ¿Cuál es la probabilidad de obtener un número mayor que 4?',
      correcta: '1/3',
      distractores: ['1/6', '2/3', '1/2']
    },
    {
      id: 'item_ap_mat_005', area: 'matematicas', sub: 'probabilidad', b: -0.5, blocks: [1],
      texto: 'La probabilidad de que llueva mañana es 0,2. ¿Cuál es la probabilidad de que no llueva?',
      correcta: '0,8',
      distractores: ['0,2', '0,5', '1,2']
    },
    {
      id: 'item_ap_mat_008', area: 'matematicas', sub: 'probabilidad', b: -0.6, blocks: [1, 2],
      texto: 'Un estudiante tiene 3 camisas y 4 pantalones. ¿Cuántas combinaciones de una camisa y un pantalón puede formar?',
      correcta: '12',
      distractores: ['7', '34', '43']
    },
    {
      id: 'item_ap_mat_012', area: 'matematicas', sub: 'probabilidad', b: 0.0, blocks: [2, 3],
      texto: 'Se lanza una moneda justa dos veces. ¿Cuál es la probabilidad de obtener exactamente una cara?',
      correcta: '1/2',
      distractores: ['1/4', '3/4', '1']
    },
    {
      id: 'item_ap_mat_101', area: 'matematicas', sub: 'proporcionalidad', b: -0.2, blocks: [1, 2, 3],
      texto: 'Si 4 cuadernos cuestan $12.000, ¿cuánto cuestan 7 cuadernos al mismo precio unitario?',
      correcta: '$21.000',
      distractores: ['$19.000', '$24.000', '$16.000']
    },
    {
      id: 'item_ap_mat_102', area: 'matematicas', sub: 'porcentaje', b: 0.1, blocks: [1, 2, 3],
      texto: 'Un precio de $40.000 baja 25%. ¿Cuál es el nuevo precio?',
      correcta: '$30.000',
      distractores: ['$10.000', '$35.000', '$25.000']
    },
    {
      id: 'item_ap_mat_103', area: 'matematicas', sub: 'media', b: 0.0, blocks: [1, 2, 3],
      texto: 'Las notas de un estudiante son 3,0 · 4,0 · 5,0. ¿Cuál es el promedio?',
      correcta: '4,0',
      distractores: ['3,0', '4,5', '12,0']
    },
    {
      id: 'item_ap_mat_104', area: 'matematicas', sub: 'razonamiento', b: 0.25, blocks: [2, 3],
      texto: 'Una secuencia: 2, 5, 8, 11, … ¿Cuál es el siguiente término si el patrón se mantiene?',
      correcta: '14',
      distractores: ['12', '13', '15']
    },
    {
      id: 'item_ap_mat_105', area: 'matematicas', sub: 'geometria', b: 0.15, blocks: [1, 2, 3],
      texto: 'Un rectángulo mide 8 m de largo y 3 m de ancho. ¿Cuál es su área?',
      correcta: '24 m²',
      distractores: ['11 m²', '22 m²', '48 m²']
    },
    {
      id: 'item_ap_mat_106', area: 'matematicas', sub: 'fracciones', b: 0.2, blocks: [2, 3],
      texto: '¿Cuál fracción es equivalente a 2/4?',
      correcta: '1/2',
      distractores: ['2/8', '3/4', '4/2']
    },
    {
      id: 'item_ap_mat_107', area: 'matematicas', sub: 'probabilidad', b: 0.3, blocks: [2, 3],
      texto: 'En una urna hay 2 bolas azules y 2 rojas. Se saca una al azar. Probabilidad de azul:',
      correcta: '1/2',
      distractores: ['1/4', '2/2', '1/3']
    },
    {
      id: 'item_ap_mat_108', area: 'matematicas', sub: 'razonamiento', b: 0.35, blocks: [2, 3],
      texto: 'Un taxi cobra $4.000 de base y $800 por kilómetro. ¿Cuánto cuesta un viaje de 5 km?',
      correcta: '$8.000',
      distractores: ['$4.800', '$9.000', '$6.000']
    },

    // —— Ciencias ——
    {
      id: 'item_ap_cie_001', area: 'ciencias', sub: 'indagacion', b: 0.1, blocks: [1, 2],
      texto: 'Un grupo riega una planta con agua y otra, igual, no recibe agua. La planta sin agua es',
      correcta: 'el control de la variable agua',
      distractores: ['la variable dependiente', 'un resultado numérico', 'la hipótesis del grupo']
    },
    {
      id: 'item_ap_cie_002', area: 'ciencias', sub: 'indagacion', b: 0.2, blocks: [1, 2],
      texto: 'Quieren saber si la luz cambia el crecimiento. Mantienen agua, suelo y especie iguales, y solo varían la luz. La variable independiente es',
      correcta: 'la luz',
      distractores: ['la especie', 'el suelo', 'el nombre del grupo']
    },
    {
      id: 'item_ap_cie_004', area: 'ciencias', sub: 'indagacion', b: 0.4, blocks: [1, 2],
      texto: 'Una hipótesis útil para un experimento debe',
      correcta: 'poder contrastarse con observaciones',
      distractores: [
        'incluir la opinión del grupo sin datos',
        'nombrar al profesor como prueba',
        'evitar cualquier predicción'
      ]
    },
    {
      id: 'item_ap_cie_008', area: 'ciencias', sub: 'indagacion', b: 0.35, blocks: [2, 3],
      texto: 'Si los datos no apoyan la hipótesis, lo coherente es',
      correcta: 'revisar el diseño o reformular la hipótesis',
      distractores: [
        'inventar datos que sí la apoyen',
        'ignorar el experimento',
        'cambiar el tema sin mirar los datos'
      ]
    },
    {
      id: 'item_ap_cie_101', area: 'ciencias', sub: 'ecologia', b: 0.1, blocks: [1, 2, 3],
      texto: 'En una cadena alimenticia, las plantas suelen ocupar el rol de',
      correcta: 'productores',
      distractores: ['depredadores tope', 'descomponedores exclusivos', 'parásitos del suelo']
    },
    {
      id: 'item_ap_cie_102', area: 'ciencias', sub: 'fisica', b: 0.2, blocks: [1, 2, 3],
      texto: 'Un objeto en reposo sobre una mesa horizontal, sin moverse, tiene velocidad',
      correcta: 'cero',
      distractores: ['igual a la de la luz', 'siempre creciente', 'imposible de medir']
    },
    {
      id: 'item_ap_cie_103', area: 'ciencias', sub: 'quimica', b: 0.25, blocks: [2, 3],
      texto: 'El agua (H₂O) es un ejemplo de',
      correcta: 'compuesto formado por más de un elemento',
      distractores: [
        'elemento químico puro',
        'mezcla de metales',
        'partícula indivisible sin átomos'
      ]
    },
    {
      id: 'item_ap_cie_104', area: 'ciencias', sub: 'indagacion', b: 0.3, blocks: [1, 2, 3],
      texto: 'Para comparar dos fertilizantes en el mismo tipo de planta, lo más correcto es',
      correcta: 'cambiar solo el fertilizante y mantener iguales las demás condiciones',
      distractores: [
        'cambiar luz, agua y fertilizante a la vez',
        'usar plantas de especies distintas sin control',
        'medir sin anotar nada'
      ]
    },
    {
      id: 'item_ap_cie_105', area: 'ciencias', sub: 'salud', b: 0.15, blocks: [1, 2, 3],
      texto: 'Lavarse las manos antes de comer ayuda principalmente a',
      correcta: 'reducir el paso de microorganismos a la boca',
      distractores: [
        'aumentar la temperatura corporal',
        'reemplazar por completo las vacunas',
        'eliminar la necesidad de agua potable'
      ]
    },
    {
      id: 'item_ap_cie_106', area: 'ciencias', sub: 'tierra', b: 0.35, blocks: [2, 3],
      texto: 'El día y la noche en la Tierra se explican principalmente por',
      correcta: 'la rotación de la Tierra sobre su eje',
      distractores: [
        'la Luna apagando el Sol',
        'nubes que cubren siempre el planeta',
        'el cambio de estaciones únicamente'
      ]
    },

    // —— Sociales ——
    {
      id: 'item_ap_soc_001', area: 'sociales', sub: 'geografia', b: -0.3, blocks: [1, 2],
      texto: 'La cordillera de los Andes recorre a Colombia de sur a norte. Las ciudades altas como Bogotá se ubican, sobre todo, en la región',
      correcta: 'Andina',
      distractores: ['Caribe insular', 'Amazónica baja', 'de la costa Pacífica plana']
    },
    {
      id: 'item_ap_soc_002', area: 'sociales', sub: 'geografia', b: -0.2, blocks: [1, 2],
      texto: 'El río Magdalena nace en el macizo colombiano y desemboca en',
      correcta: 'el mar Caribe',
      distractores: ['el océano Pacífico', 'el Amazonas en Brasil', 'el lago de Tota']
    },
    {
      id: 'item_ap_soc_003', area: 'sociales', sub: 'geografia', b: -0.1, blocks: [1, 2],
      texto: 'Barranquilla, Cartagena y Santa Marta son puertos o ciudades de la región',
      correcta: 'Caribe',
      distractores: ['Andina central', 'Orinoquía seca', 'Amazonia profunda']
    },
    {
      id: 'item_ap_soc_010', area: 'sociales', sub: 'cartografia', b: 0.3, blocks: [2, 3],
      texto: 'Un mapa con escala 1:50.000 representa el terreno',
      correcta: '50.000 veces más pequeño que en la realidad',
      distractores: [
        'a tamaño real',
        '50 veces más grande',
        'sin relación de distancia'
      ]
    },
    {
      id: 'item_ap_soc_101', area: 'sociales', sub: 'civica', b: 0.1, blocks: [1, 2, 3],
      texto: 'En una democracia, el voto secreto busca principalmente',
      correcta: 'proteger la libertad de elegir sin presión',
      distractores: [
        'alargar las filas en las urnas',
        'eliminar por completo los partidos',
        'obligar a votar en voz alta'
      ]
    },
    {
      id: 'item_ap_soc_102', area: 'sociales', sub: 'historia', b: 0.25, blocks: [1, 2, 3],
      texto: 'La Independencia de Colombia se asocia históricamente con el siglo',
      correcta: 'XIX',
      distractores: ['XVI únicamente', 'XXI', 'XII']
    },
    {
      id: 'item_ap_soc_103', area: 'sociales', sub: 'economia', b: 0.2, blocks: [2, 3],
      texto: 'Si el precio de un producto sube mucho y la gente compra menos, eso ilustra',
      correcta: 'una relación entre precio y cantidad demandada',
      distractores: [
        'que el producto desapareció del planeta',
        'que nadie usa dinero',
        'que la oferta es siempre cero'
      ]
    },
    {
      id: 'item_ap_soc_104', area: 'sociales', sub: 'geografia', b: 0.15, blocks: [1, 2, 3],
      texto: 'Leticia se asocia principalmente con la región',
      correcta: 'Amazónica',
      distractores: ['Andina cundiboyacense', 'Caribe seca', 'Pacífica del Chocó únicamente como capital']
    },
    {
      id: 'item_ap_soc_105', area: 'sociales', sub: 'civica', b: 0.3, blocks: [2, 3],
      texto: 'La Constitución de 1991 en Colombia es importante porque',
      correcta: 'es la norma fundamental que organiza el Estado y derechos',
      distractores: [
        'solo regula el fútbol profesional',
        'reemplaza todas las leyes municipales cada semana',
        'prohíbe tener colegios'
      ]
    },
    {
      id: 'item_ap_soc_106', area: 'sociales', sub: 'conflicto', b: 0.4, blocks: [2, 3],
      texto: 'Un conflicto entre vecinos por el ruido se resuelve mejor, en principio, con',
      correcta: 'diálogo y acuerdos o mediación',
      distractores: [
        'ignorar por completo las normas de convivencia',
        'destruir la propiedad del otro',
        'prohibir que existan vecinos'
      ]
    },

    // —— Inglés ——
    {
      id: 'item_ap_ing_001', area: 'ingles', sub: 'dialogo', b: -0.2, blocks: [1, 2],
      texto: 'Ana: What time does the library close? Leo: At 6 p.m. Ana: Thanks. I will return the book before that. What does Ana need to know?',
      correcta: 'the closing time of the library',
      distractores: ['Leo’s favorite book', 'the price of a coffee', 'the weather tomorrow']
    },
    {
      id: 'item_ap_ing_002', area: 'ingles', sub: 'dialogo', b: -0.1, blocks: [1, 2],
      texto: 'Camila: Are you free on Saturday? Mateo: I have a match in the morning, but the afternoon is fine. When can they meet?',
      correcta: 'on Saturday afternoon',
      distractores: ['on Saturday morning', 'on Sunday only', 'never this weekend']
    },
    {
      id: 'item_ap_ing_004', area: 'ingles', sub: 'dialogo', b: 0.0, blocks: [1, 2],
      texto: 'Clerk: The blue shirt is $40. The red one is $25. Nati: I’ll take the cheaper one. Nati buys',
      correcta: 'the red shirt',
      distractores: ['the blue shirt', 'both shirts', 'no shirt']
    },
    {
      id: 'item_ap_ing_009', area: 'ingles', sub: 'dialogo', b: 0.4, blocks: [2, 3],
      texto: 'Eva: If we leave now, we will catch the 4 o’clock bus. Julián: Then let’s go. They decide to leave in order to',
      correcta: 'catch that bus',
      distractores: ['miss the bus', 'walk all night', 'buy a car']
    },
    {
      id: 'item_ap_ing_101', area: 'ingles', sub: 'vocabulario', b: 0.1, blocks: [1, 2, 3],
      texto: '“I’m thirsty.” The person wants',
      correcta: 'something to drink',
      distractores: ['a jacket', 'a pillow', 'a ticket to a movie']
    },
    {
      id: 'item_ap_ing_102', area: 'ingles', sub: 'dialogo', b: 0.2, blocks: [1, 2, 3],
      texto: 'Teacher: Please open your books to page 12. Student: Sure. The student will',
      correcta: 'open the book at page 12',
      distractores: ['close the school', 'leave the classroom', 'ignore the teacher']
    },
    {
      id: 'item_ap_ing_103', area: 'ingles', sub: 'lectura', b: 0.3, blocks: [2, 3],
      texto: 'Notice: “Museum closed on Mondays.” You can visit the museum',
      correcta: 'on days that are not Monday',
      distractores: ['only on Mondays', 'never', 'only at midnight on Monday']
    },
    {
      id: 'item_ap_ing_104', area: 'ingles', sub: 'dialogo', b: 0.25, blocks: [1, 2, 3],
      texto: 'Sam: How was the movie? Lia: It was boring. Lia thought the movie was',
      correcta: 'not interesting',
      distractores: ['excellent', 'too short to watch', 'free for everyone']
    },
    {
      id: 'item_ap_ing_105', area: 'ingles', sub: 'gramatica', b: 0.35, blocks: [2, 3],
      texto: 'Choose the correct option: “She ___ to school every day.”',
      correcta: 'goes',
      distractores: ['go', 'going', 'gone']
    },
    {
      id: 'item_ap_ing_106', area: 'ingles', sub: 'dialogo', b: 0.15, blocks: [1, 2, 3],
      texto: 'Host: Would you like some water? Guest: Yes, please. The guest',
      correcta: 'accepts the water',
      distractores: ['refuses everything', 'asks for the bill only', 'leaves immediately']
    }
  ];

  /** Dilemas de proceso / aprendizaje (campaña). */
  const DILEMMAS_B2 = [
    {
      id: 'dil_b2_01', tags: ['pressure'],
      prompt: 'Quedan dos minutos. Dos opciones te parecen posibles. ¿Qué haces?',
      options: [
        { v: 'anchor', text: 'Vuelvo al enunciado y descarto una' },
        { v: 'rush', text: 'Elijo la que me sonó primero' },
        { v: 'freeze', text: 'Me quedo comparando hasta que se acabe' }
      ]
    },
    {
      id: 'dil_b2_02', tags: ['metacog'],
      prompt: 'Acabas de cambiar de letra dos veces. El tiempo sigue. ¿Qué haces?',
      options: [
        { v: 'commit', text: 'Confirmo la última con una razón' },
        { v: 'reset', text: 'Leo otra vez desde cero' },
        { v: 'guess', text: 'Elijo cualquiera para seguir' }
      ]
    },
    {
      id: 'dil_learn_01', tags: ['learning'],
      prompt: 'Cuando una explicación te abre la cabeza, ¿qué te funciona más?',
      options: [
        { v: 'anchor', text: 'Pasos claros: qué pide → qué dato → qué descarta' },
        { v: 'scene', text: 'Imaginar la escena hasta que la opción no quepa' },
        { v: 'evidence', text: 'Contrastar dos frases del texto lado a lado' }
      ]
    },
    {
      id: 'dil_learn_02', tags: ['evidence'],
      prompt: 'Una opción “suena” bien, pero el texto no la dice. ¿Qué haces?',
      options: [
        { v: 'evidence', text: 'La descarto: sin evidencia no entra' },
        { v: 'intuition', text: 'La dejo: suele ser la del ICFES' },
        { v: 'commit', text: 'Busco una sola palabra del enunciado que la mate o la salve' }
      ]
    },
    {
      id: 'dil_tempo_01', tags: ['pressure', 'tempo'],
      prompt: 'Sientes prisa y apenas leíste la mitad del enunciado. ¿Qué haces?',
      options: [
        { v: 'anchor', text: 'Termino de leer lo que pide la pregunta' },
        { v: 'rush', text: 'Toco ya una letra para no “perder tiempo”' },
        { v: 'freeze', text: 'Me bloqueo y no elijo' }
      ]
    },
    {
      id: 'dil_seal_15', tags: ['seal'],
      prompt: 'Tras estos días, ¿qué quieres que Dante priorice en ti?',
      options: [
        { v: 'anchor', text: 'Frenar la respuesta impulsiva (no tocar letra al azar)' },
        { v: 'commit', text: 'Confirmar con más seguridad cuando sí sé' },
        { v: 'evidence', text: 'Atar cada opción a una evidencia del texto' }
      ]
    }
  ];

  const LETTERS4 = ['A', 'B', 'C', 'D'];
  const LETTERS2 = ['A', 'B'];

  function studentKey() {
    try {
      const u = JSON.parse(localStorage.getItem('dante_user') || '{}');
      const id = u.document_id || u.estudiante || u.email || localStorage.getItem('dante_active_student');
      return String(id || 'anon').split('@')[0].toLowerCase();
    } catch (_) {
      return 'anon';
    }
  }

  function usedStorageKey(sk) {
    return USED_PREFIX + String(sk || studentKey());
  }

  function loadCampaignUsed(sk) {
    try {
      const raw = localStorage.getItem(usedStorageKey(sk));
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCampaignUsed(ids, sk) {
    try {
      const uniq = [...new Set((ids || []).map(String))];
      localStorage.setItem(usedStorageKey(sk), JSON.stringify(uniq.slice(-200)));
    } catch (_) { /* ignore */ }
  }

  function rememberUsed(id, sk) {
    if (!id) return;
    const list = loadCampaignUsed(sk);
    if (list.indexOf(String(id)) === -1) list.push(String(id));
    saveCampaignUsed(list, sk);
  }

  function clearCampaignUsed(sk) {
    try { localStorage.removeItem(usedStorageKey(sk)); } catch (_) { /* ignore */ }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function presentItem(item, mode) {
    const duelo = mode === 'duelo2';
    const texts = duelo
      ? [item.correcta, item.distractores[0]]
      : [item.correcta].concat(item.distractores.slice(0, 3));
    const letters = duelo ? LETTERS2 : LETTERS4;
    const paired = texts.map((text, i) => ({ text, isCorrect: i === 0 }));
    const mixed = shuffle(paired);
    const options = mixed.map((o, i) => ({
      letter: letters[i],
      text: o.text,
      isCorrect: o.isCorrect
    }));
    const ok = options.find((o) => o.isCorrect);
    return { letters, options, okLetter: ok ? ok.letter : 'A' };
  }

  function poolForBlock(blockIndex) {
    const bi = Math.max(1, Number(blockIndex) || 1);
    return ITEMS_B1.filter((x) => {
      const bs = x.blocks || [1];
      if (bi <= 1) return bs.indexOf(1) !== -1 || bs.indexOf(2) !== -1 || bs.indexOf(3) !== -1;
      return true;
    });
  }

  /**
   * Elige ítem no visto en la sesión ni (preferible) en la campaña.
   * Si el banco de campaña se agota, reinicia el historial de campaña.
   */
  function pickUnused(usedIds, preferArea, blockIndex) {
    const sessionUsed = new Set((usedIds || []).map(String));
    let campaignUsed = new Set(loadCampaignUsed());
    const pool = poolForBlock(blockIndex);

    function bagFrom(excludeSet) {
      const free = pool.filter((x) => !excludeSet.has(String(x.id)));
      const prefer = free.filter((x) => x.area === preferArea);
      return prefer.length ? prefer : free;
    }

    let bag = bagFrom(new Set([...sessionUsed, ...campaignUsed]));
    if (!bag.length) {
      // Agotó campaña: reinicia historial largo, mantiene no-repetir en esta sesión
      clearCampaignUsed();
      campaignUsed = new Set();
      bag = bagFrom(sessionUsed);
    }
    if (!bag.length) {
      bag = pool.length ? pool : ITEMS_B1;
    }
    const item = bag[Math.floor(Math.random() * bag.length)];
    rememberUsed(item.id);
    return item;
  }

  function pickDilemma(blockIndex, probe) {
    let pool = DILEMMAS_B2;
    if (probe === 'learning') pool = DILEMMAS_B2.filter((d) => (d.tags || []).indexOf('learning') !== -1);
    else if (probe === 'evidence' || probe === 'metacog' || probe === 'tempo') {
      pool = DILEMMAS_B2.filter((d) => {
        const t = d.tags || [];
        return t.indexOf('evidence') !== -1 || t.indexOf('metacog') !== -1 || t.indexOf('pressure') !== -1 || t.indexOf('tempo') !== -1;
      });
    } else if (probe === 'seal') pool = DILEMMAS_B2.filter((d) => (d.tags || []).indexOf('seal') !== -1);
    else if ((blockIndex || 1) < 2 && !probe) return null;
    if (!pool.length) pool = DILEMMAS_B2;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  global.HackeaPulsoBank = {
    ITEMS: ITEMS_B1,
    DILEMMAS_B2,
    presentItem,
    pickUnused,
    pickDilemma,
    poolForBlock,
    loadCampaignUsed,
    clearCampaignUsed,
    rememberUsed,
    totalItems: ITEMS_B1.length
  };
})(window);
