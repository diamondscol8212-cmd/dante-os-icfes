/**
 * Banco curado · Modo Dante (Bloque 1 y 2+).
 * Distractores plausibles. Correcta en fuente; al render se barajan letras.
 */
(function (global) {
  'use strict';

  /** @type {Array} */
  const ITEMS_B1 = [
    {
      id: 'item_ap_lec_001', area: 'lectura', sub: 'dos_textos', b: 0.2, blocks: [1, 2],
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
      id: 'item_ap_soc_001', area: 'sociales', sub: 'geografia', b: -0.3, blocks: [1, 2],
      texto: 'La cordillera de los Andes recorre a Colombia de sur a norte. Las ciudades altas como Bogotá se ubican, sobre todo, en la región',
      correcta: 'Andina',
      distractores: ['Caribe insular', 'Amazónica baja', 'de la costa Pacífica plana']
    },
    {
      id: 'item_ap_soc_002', area: 'sociales', sub: 'geografia', b: -0.2, blocks: [1, 2],
      texto: 'El río Magdalena nace en el macizo colombiano y desemboca en',
      correcta: 'el mar Caribe',
      distractores: ['el océano Pacífico', 'el río Amazonas', 'el lago Titicaca']
    },
    {
      id: 'item_ap_soc_005', area: 'sociales', sub: 'geografia', b: -0.4, blocks: [1],
      texto: 'Barranquilla, Cartagena y Santa Marta son puertos o ciudades de la región',
      correcta: 'Caribe',
      distractores: ['Andina central', 'Amazónica', 'de la Orinoquía']
    },
    {
      id: 'item_ap_ing_001', area: 'ingles', sub: 'dialogo', b: -0.4, blocks: [1, 2],
      texto: 'Ana: What time does the library close? Leo: At 6 p.m. Ana: Thanks. I will return the book before that. What does Ana need to know?',
      correcta: 'The closing time',
      distractores: ['The price of a book', "Leo's address", 'The name of a movie']
    },
    {
      id: 'item_ap_ing_002', area: 'ingles', sub: 'dialogo', b: -0.2, blocks: [1, 2],
      texto: 'Camila: Are you free on Saturday? Mateo: I have a match in the morning, but the afternoon is fine. When can they meet?',
      correcta: 'On Saturday afternoon',
      distractores: ['On Saturday morning', 'They cannot meet', 'On Friday night']
    },
    {
      id: 'item_ap_ing_006', area: 'ingles', sub: 'dialogo', b: 0.2, blocks: [1, 2],
      texto: 'Clerk: The blue shirt is $40. The red one is $25. Nati: I’ll take the cheaper one. Nati buys',
      correcta: 'the red shirt',
      distractores: ['the blue shirt', 'both shirts', 'nothing']
    },
    // —— Bloque 2+ (más exigentes / otro flanco) ——
    {
      id: 'item_ap_lec_016', area: 'lectura', sub: 'dos_textos', b: 0.8, blocks: [2, 3],
      texto: 'Texto 1 concluye que «la app ahorra tiempo». Texto 2 muestra que tres usuarios tardaron más que con el cuaderno. El texto 2',
      correcta: 'debilita la conclusión del texto 1',
      distractores: [
        'confirma la conclusión con los tres casos',
        'no tiene relación con el ahorro de tiempo',
        'copia el texto 1 sin aportar datos'
      ]
    },
    {
      id: 'item_ap_lec_042', area: 'lectura', sub: 'argumentacion', b: 0.4, blocks: [2, 3],
      texto: '«Nadie de mi calle separa la basura; luego en la ciudad nadie lo hace.» El fallo está en',
      correcta: 'tomar la calle como si fuera toda la ciudad',
      distractores: [
        'contar las casas de la calle',
        'definir qué es reciclar',
        'citar una norma municipal'
      ]
    },
    {
      id: 'item_ap_mat_003', area: 'matematicas', sub: 'probabilidad', b: 0.1, blocks: [2, 3],
      texto: 'Se lanza una moneda justa dos veces. ¿Cuál es la probabilidad de obtener exactamente una cara?',
      correcta: '1/2',
      distractores: ['1/4', '1/3', '3/4']
    },
    {
      id: 'item_ap_cie_006', area: 'ciencias', sub: 'indagacion', b: 0.5, blocks: [2, 3],
      texto: 'Si los datos no apoyan la hipótesis, lo coherente es',
      correcta: 'revisar la hipótesis o el procedimiento',
      distractores: [
        'cambiar los datos para que coincidan',
        'borrar la pregunta del cuaderno',
        'afirmar que el experimento no existió'
      ]
    },
    {
      id: 'item_ap_soc_010', area: 'sociales', sub: 'geografia', b: 0.4, blocks: [2, 3],
      texto: 'Un mapa con escala 1:50.000 representa el terreno',
      correcta: '50.000 veces más pequeño en el papel, en esa proporción',
      distractores: [
        'a tamaño real',
        '50 veces más grande',
        'sin relación de distancia'
      ]
    },
    {
      id: 'item_ap_ing_009', area: 'ingles', sub: 'dialogo', b: 0.4, blocks: [2, 3],
      texto: 'Eva: If we leave now, we will catch the 4 o’clock bus. Julián: Then let’s go. They decide to leave in order to',
      correcta: 'catch that bus',
      distractores: ['miss the bus', 'walk all night', 'buy a car']
    }
  ];

  /** Dilemas de proceso / aprendizaje (campaña). */
  const DILEMMAS_B2 = [
    {
      id: 'dil_b2_01', tags: ['pressure'],
      prompt: 'Quedan dos minutos. Dos opciones te parecen posibles. ¿Qué haces?',
      options: [
        { v: 'anchor', text: 'Vuelvo al enunciado y descarto una' },
        { v: 'rush', text: 'Marco la que me sonó primero' },
        { v: 'freeze', text: 'Me quedo comparando hasta que se acabe' }
      ]
    },
    {
      id: 'dil_b2_02', tags: ['metacog'],
      prompt: 'Acabas de cambiar de letra dos veces. El reloj sigue. ¿Qué haces?',
      options: [
        { v: 'commit', text: 'Confirmo la última con una razón' },
        { v: 'reset', text: 'Leo otra vez desde cero' },
        { v: 'guess', text: 'Marco cualquiera para seguir' }
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
    const bi = Math.max(1, blockIndex || 1);
    return ITEMS_B1.filter((x) => {
      const bs = x.blocks || [1];
      if (bi <= 1) return bs.indexOf(1) !== -1;
      return bs.indexOf(2) !== -1 || bs.indexOf(3) !== -1 || bs.indexOf(bi) !== -1;
    });
  }

  function pickUnused(usedIds, preferArea, blockIndex) {
    const used = new Set(usedIds || []);
    const pool = poolForBlock(blockIndex).filter((x) => !used.has(x.id));
    const prefer = pool.filter((x) => x.area === preferArea);
    const bag = prefer.length ? prefer : pool;
    if (!bag.length) {
      const rest = ITEMS_B1.filter((x) => !used.has(x.id));
      return rest[Math.floor(Math.random() * Math.max(1, rest.length))] || ITEMS_B1[0];
    }
    return bag[Math.floor(Math.random() * bag.length)];
  }

  function pickDilemma(blockIndex, probe) {
    let pool = DILEMMAS_B2;
    if (probe === 'learning') pool = DILEMMAS_B2.filter((d) => (d.tags || []).indexOf('learning') !== -1);
    else if (probe === 'evidence' || probe === 'metacog' || probe === 'tempo') {
      pool = DILEMMAS_B2.filter((d) => {
        const t = d.tags || [];
        return t.indexOf('evidence') !== -1 || t.indexOf('metacog') !== -1 || t.indexOf('pressure') !== -1;
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
    poolForBlock
  };
})(window);
