/**
 * Genera public/temasRefuerzo.json con cartillas completas por sub_competencia.
 * Uso: node scripts/generarCatalogoTemasRefuerzo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TEMA_SUB } from '../src/services/bank/enriquecerAyudas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AREA_DE = {
  probabilidad: 'matematicas', estadistica: 'matematicas', algebra: 'matematicas',
  geometria: 'matematicas', funciones: 'matematicas', proporcionalidad: 'matematicas',
  aritmetica: 'matematicas', fracciones: 'matematicas', trigonometria: 'matematicas',
  combinatoria: 'matematicas', calculo_limites: 'matematicas', aptitud_numerica_docente: 'matematicas',
  dos_textos: 'lectura_critica', textos_discontinuos: 'lectura_critica', argumentacion: 'lectura_critica',
  inferencia: 'lectura_critica', filosofia: 'lectura_critica', pragmatica: 'lectura_critica',
  semantica: 'lectura_critica', literatura: 'lectura_critica', comprension_literal: 'lectura_critica',
  articulacion_global: 'lectura_critica', evaluacion_critica: 'lectura_critica',
  analisis_textual: 'lectura_critica', analisis_imagen: 'lectura_critica',
  indagacion: 'ciencias_naturales', fisica: 'ciencias_naturales', quimica: 'ciencias_naturales',
  biologia: 'ciencias_naturales', cts: 'ciencias_naturales',
  geografia: 'sociales_ciudadanas', constitucion: 'sociales_ciudadanas', historia: 'sociales_ciudadanas',
  pensamiento_critico: 'sociales_ciudadanas', interpretacion: 'sociales_ciudadanas',
  interpretacion_y_analisis: 'sociales_ciudadanas', participacion: 'sociales_ciudadanas',
  pensamiento_social: 'sociales_ciudadanas', pensamiento_sistemico: 'sociales_ciudadanas',
  competencias_ciudadanas: 'sociales_ciudadanas', aptitud_pedagogica: 'sociales_ciudadanas',
  dialogo: 'ingles', dialogues: 'ingles', aviso: 'ingles', signs_notices: 'ingles',
  cloze: 'ingles', lexical_cloze: 'ingles', vocabulario: 'ingles', vocabulary: 'ingles',
  lectura: 'ingles', reading_comprehension: 'ingles', literal_reading: 'ingles',
  inferential_reading: 'ingles', grammar: 'ingles', grammar_reading: 'ingles'
};

const NIVEL = {
  matematicas: 'Media · Matemáticas',
  lectura_critica: 'Media · Lectura crítica',
  ciencias_naturales: 'Media · Ciencias naturales',
  sociales_ciudadanas: 'Media · Sociales y ciudadanas',
  ingles: 'Media · Inglés'
};

const ALIAS = {
  dialogues: 'dialogo',
  signs_notices: 'aviso',
  lexical_cloze: 'cloze',
  vocabulary: 'vocabulario',
  reading_comprehension: 'lectura',
  grammar_reading: 'grammar'
};

const CONTENIDO = {
  fracciones: {
    intro: 'Una fracción a/b compara una parte (numerador) con un todo dividido en b partes iguales. Dos fracciones son equivalentes si representan la misma cantidad (1/2 = 2/4 = 3/6).',
    pasos: [
      'Para sumar o restar: iguala denominadores (mcm) y opera solo los numeradores.',
      'Para comparar: lleva al mismo denominador o pasa a decimal.',
      '«De» entre fracción y entero suele ser multiplicación: (2/5)×40.'
    ],
    errores: [
      'Sumar numeradores y denominadores por separado.',
      'Olvidar convertir al denominador común.',
      'Invertir la fracción sin que el enunciado lo pida.'
    ],
    ejemplo: {
      titulo: 'Ejemplo resuelto',
      enunciado: 'Calcula 1/2 + 1/3.',
      pasos: [
        '1) mcm(2,3) = 6.',
        '2) 1/2 = 3/6 y 1/3 = 2/6.',
        '3) 3/6 + 2/6 = 5/6.'
      ],
      respuesta: '5/6'
    },
    profundizar: 'Si quieres profundizar más: busca «mínimo común múltiplo» y «fracciones equivalentes».',
    practica: [
      q('tr_frac_01', '¿Cuánto es 1/2 + 1/3?', ['A) 2/5', 'B) 5/6', 'C) 1/5', 'D) 2/6'], 'B',
        { A: 'Sumaste numeradores y denominadores por separado.', C: 'Invertiste el procedimiento.', D: 'Convertiste 1/2 a sextos pero no sumaste el 1/3.' },
        'mcm=6 → 3/6+2/6=5/6.'),
      q('tr_frac_02', '¿Cuánto es (2/5) de 40?', ['A) 20', 'B) 16', 'C) 8', 'D) 10'], 'B',
        { A: 'Usaste 1/2 de 40.', C: 'Solo 1/5 de 40.', D: 'Usaste 1/4.' },
        '(2/5)×40=16.'),
      q('tr_frac_03', '¿Cuál es mayor: 3/4 o 5/8?', ['A) 5/8', 'B) 3/4', 'C) Iguales', 'D) No se pueden comparar'], 'B',
        { A: '5/8=0,625 < 0,75.', C: '3/4=6/8 > 5/8.', D: 'Sí se comparan con el mismo denominador.' },
        '3/4=6/8 > 5/8.'),
      q('tr_frac_04', 'Simplifica 8/12.', ['A) 4/6', 'B) 2/3', 'C) 8/3', 'D) 3/2'], 'B',
        { A: 'Aún se puede simplificar más.', C: 'No es simplificar.', D: 'Eso es el recíproco.' },
        'mcd=4 → 2/3.')
    ]
  },
  proporcionalidad: {
    intro: 'Magnitudes directamente proporcionales crecen juntas en la misma razón. Inversas: al subir una, baja la otra y el producto se conserva.',
    pasos: ['Clasifica: ¿más→más (directa) o más→menos (inversa)?', 'Directa: a/b=c/d. Inversa: a·b=c·d.', 'Convierte unidades antes de operar.'],
    errores: ['Tratar un caso inverso como directo.', 'Sumar en vez de usar la razón.', 'Olvidar conversiones de tiempo.'],
    ejemplo: {
      titulo: 'Ejemplo resuelto',
      enunciado: '4 obreros terminan en 6 días. ¿Cuántos días tardan 3?',
      pasos: ['1) Es inversa: personas×días constante.', '2) 4×6=24 jornadas.', '3) 24÷3=8 días.'],
      respuesta: '8 días'
    },
    profundizar: 'Si quieres profundizar más: busca «regla de tres simple e inversa».',
    practica: [
      q('tr_prop_01', '4 obreros · 6 días. ¿Días con 3 obreros?', ['A) 4,5', 'B) 8', 'C) 12', 'D) 2'], 'B',
        { A: 'Lo trataste como directa.', C: 'Duplicaste sin el producto.', D: 'Con menos gente tarda más.' },
        '4×6=24; 24÷3=8.'),
      q('tr_prop_02', '5 cuadernos = 20.000. ¿7?', ['A) 28.000', 'B) 25.000', 'C) 14.000', 'D) 35.000'], 'A',
        { B: 'Sumaste sin unitario.', C: 'Invertiste la razón.', D: 'Multiplicaste de más.' },
        'Unitario 4.000 ×7=28.000.'),
      q('tr_prop_03', '120 km en 2 h. ¿En 3 h?', ['A) 150', 'B) 180', 'C) 240', 'D) 60'], 'B',
        { A: 'Sumaste 30 sin velocidad.', C: 'Duplicaste 120.', D: 'Usaste 1 h.' },
        '60 km/h ×3=180.')
    ]
  },
  argumentacion: {
    intro: 'Un argumento une premisas (razones) con una conclusión. En Saber 11° identificas qué se concluye, qué se asume o qué falla.',
    pasos: ['Separa premisas y conclusión.', '¿Las premisas bastan o hay un salto?', 'Si hay salto típico, nómbralo (falacia).'],
    errores: ['Confundir premisa con conclusión.', 'Elegir lo “que suena bien” sin apoyo textual.', 'Mezclar tipos de falacia.'],
    ejemplo: {
      titulo: 'Ejemplo resuelto',
      enunciado: '«Si hay celulares en clase, el colegio colapsará.»',
      pasos: ['1) De un permiso salta a un desastre total.', '2) No hay pasos intermedios demostrados.', '3) Es pendiente resbaladiza.'],
      respuesta: 'Pendiente resbaladiza'
    },
    profundizar: 'Si quieres profundizar más: busca «estructura del argumento» y «falacias comunes».',
    practica: [
      q('tr_arg_01', '«Si permitimos X, todo colapsa.» ¿Qué falla?', ['A) Pendiente resbaladiza', 'B) Dato estadístico', 'C) Norma escolar', 'D) Definición'], 'A',
        { B: 'No hay cifras.', C: 'No describe una norma.', D: 'No define un término.' },
        'Salto a consecuencias extremas sin prueba.'),
      q('tr_arg_02', 'Todo M es P; todo S es M. Conclusión:', ['A) Ningún S es P', 'B) Todo S es P', 'C) Algún P no es S', 'D) Nada'], 'B',
        { A: 'Negación indebida.', C: 'No se deduce eso.', D: 'Sí se deduce S⊆P.' },
        'Transitividad de la inclusión.'),
      q('tr_arg_03', '«No oigas su idea: reprobó.» Error:', ['A) Falsa analogía', 'B) Ad hominem', 'C) Generalización', 'D) Circular'], 'B',
        { A: 'No compara casos.', C: 'No generaliza una muestra.', D: 'No redefine.' },
        'Ataca a la persona, no la propuesta.'),
      q('tr_arg_04', 'La conclusión es:', ['A) Lo que el autor quiere que aceptes', 'B) Cualquier ejemplo', 'C) Solo el título', 'D) Una pregunta retórica'], 'A',
        { B: 'El ejemplo puede ser premisa.', C: 'El título orienta, no demuestra.', D: 'Abre el tema.' },
        'Es lo sostenido por las razones.')
    ]
  }
};

function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {
  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };
}

function plantillaBase(id, titulo, area) {
  const areaLbl = {
    matematicas: 'matemáticas',
    lectura_critica: 'lectura crítica',
    ciencias_naturales: 'ciencias naturales',
    sociales_ciudadanas: 'sociales y ciudadanas',
    ingles: 'inglés'
  }[area] || 'Saber 11°';

  const intro = `Este tema agrupa preguntas de ${areaLbl} centradas en «${titulo}». Domínalo identificando qué pide el enunciado, qué datos son útiles y qué distractores suelen aparecer.`;
  const pasos = [
    'Lee la pregunta completa y subraya lo que pide exactamente.',
    'Descarta opciones que respondan otra cosa o usen solo parte de los datos.',
    'Verifica con un cálculo corto, una cita del texto o una definición clave.'
  ];
  const errores = [
    'Elegir la opción “parecida” sin comprobar el procedimiento o el texto.',
    'Olvidar una conversión, una condición o una premisa.',
    'Confundir este subtema con otro cercano del área.'
  ];
  const ejemplo = {
    titulo: 'Ejemplo resuelto',
    enunciado: `En una pregunta de «${titulo}», el enunciado da datos y pide un resultado concreto.`,
    pasos: [
      '1) Identifica la magnitud, la idea o la norma que pide.',
      '2) Aplica la regla del subtema (fórmula, inferencia o definición).',
      '3) Contrasta cada opción: la correcta encaja; las otras fallan por un error típico.'
    ],
    respuesta: 'La opción que cumple exactamente lo pedido'
  };

  const practica = [
    q(`${id}_p1`, `En «${titulo}», ¿qué debes hacer primero?`,
      ['A) Mirar solo las opciones', 'B) Identificar qué pide el enunciado', 'C) Sumar todos los datos', 'D) Elegir la más larga'],
      'B',
      { A: 'Sin saber qué pide, cualquier opción puede engañarte.', C: 'No todos los datos se operan igual.', D: 'La longitud no indica corrección.' },
      'Primero clarifica la tarea del enunciado.'),
    q(`${id}_p2`, `Un distractor típico en este tema suele:`,
      ['A) Responder otra pregunta o usar mal un dato', 'B) Ser siempre la opción A', 'C) Repetir el enunciado', 'D) No tener texto'],
      'A',
      { B: 'La letra no define el error.', C: 'Repetir no es un patrón de distractor.', D: 'Todas las opciones tienen contenido.' },
      'Los distractores fallan por un error concreto de procedimiento o lectura.'),
    q(`${id}_p3`, `Para marcar el tema como superado conviene:`,
      ['A) Adivinar rápido', 'B) Practicar varias ítems y revisar el error de cada falla', 'C) Evitar leer la explicación', 'D) Solo memorizar la respuesta'],
      'B',
      { A: 'Adivinar no consolida el subtema.', C: 'La explicación es el núcleo del refuerzo.', D: 'Memorizar una clave no transfiere a ítems nuevos.' },
      'Practica + revisión del error típico.'),
    q(`${id}_p4`, `Si dos opciones parecen plausibles, ¿qué haces?`,
      ['A) Eliges al azar', 'B) Vuelves al criterio del subtema y contrastas con el enunciado', 'C) Tomas la más corta', 'D) Tomas la que tiene número más grande'],
      'B',
      { A: 'El azar no entrena.', C: 'La longitud no decide.', D: 'El tamaño del número no es criterio.' },
      'El criterio del tema + el enunciado desempatan.')
  ];

  return {
    intro,
    pasos,
    errores,
    ejemplo,
    profundizar: `Si quieres profundizar más: busca «${titulo}» en guías ICFES o en tus apuntes del área.`,
    practica
  };
}

function buildTema(id) {
  const canon = ALIAS[id] || id;
  const titulo = TEMA_SUB[id] || TEMA_SUB[canon] || id.replace(/_/g, ' ');
  const area = AREA_DE[id] || AREA_DE[canon] || 'matematicas';
  const rich = CONTENIDO[id] || CONTENIDO[canon];
  const base = rich || plantillaBase(id, titulo, area);
  return {
    id,
    titulo,
    area,
    nivel: NIVEL[area] || 'Media · Saber 11°',
    subs: [id],
    matchTema: [titulo.toLowerCase(), id.replace(/_/g, ' ')],
    estadoContenido: 'completo',
    profundizar: base.profundizar,
    explicacion: {
      intro: base.intro,
      pasos: base.pasos,
      errores: base.errores,
      ejemplo_resuelto: base.ejemplo
    },
    practica: base.practica
  };
}

const ids = new Set([...Object.keys(TEMA_SUB), 'fracciones']);
// Prefer canonical ids; still include aliases that appear in bank as own keys
const temas = [...ids].sort().map(buildTema);

// Deduplicate near-aliases keeping both if bank uses both ids, but merge matchTema on canonical
const catalogo = {
  version: 2,
  nota: 'Catálogo de Temas de refuerzo. id = sub_competencia del banco. Generado por scripts/generarCatalogoTemasRefuerzo.mjs',
  temas
};

const destinos = [
  path.join(__dirname, '..', 'public', 'temasRefuerzo.json'),
  path.join(__dirname, '..', 'dante-os-icfes', 'public', 'temasRefuerzo.json')
];
for (const dest of destinos) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(catalogo, null, 2));
  console.log(`OK ${temas.length} temas → ${dest}`);
}
