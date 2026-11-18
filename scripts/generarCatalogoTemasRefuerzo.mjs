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

/** Diagramas SVG propios (estilo oscuro de la app). */
function diagramaDe(id, area, titulo) {
  const label = String(titulo || id).slice(0, 42);
  const base = (inner) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 200" role="img" aria-label="${label}">`
    + `<rect width="520" height="200" rx="14" fill="#0b1220"/>`
    + `<rect x="1" y="1" width="518" height="198" rx="13" fill="none" stroke="#1e293b"/>`
    + `<text x="24" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">AYUDA VISUAL</text>`
    + inner
    + `</svg>`;

  if (id === 'fracciones' || /fraccion/.test(id)) {
    return base(
      `<circle cx="110" cy="110" r="48" fill="none" stroke="#334155" stroke-width="2"/>`
      + `<path d="M110 62 A48 48 0 0 1 158 110 L110 110 Z" fill="#7eb8c4" opacity=".85"/>`
      + `<text x="110" y="175" text-anchor="middle" fill="#cbd5e1" font-size="12">1/2</text>`
      + `<circle cx="260" cy="110" r="48" fill="none" stroke="#334155" stroke-width="2"/>`
      + `<path d="M260 62 A48 48 0 0 1 302 134 L260 110 Z" fill="#c4a574" opacity=".85"/>`
      + `<text x="260" y="175" text-anchor="middle" fill="#cbd5e1" font-size="12">1/3</text>`
      + `<text x="360" y="100" fill="#64748b" font-size="22">→</text>`
      + `<circle cx="440" cy="110" r="48" fill="none" stroke="#334155" stroke-width="2"/>`
      + `<path d="M440 62 A48 48 0 1 1 404 145 L440 110 Z" fill="#34d399" opacity=".8"/>`
      + `<text x="440" y="175" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">5/6</text>`
    );
  }
  if (id === 'proporcionalidad') {
    return base(
      `<text x="24" y="58" fill="#cbd5e1" font-size="13">Directa: más → más</text>`
      + `<line x1="40" y1="150" x2="200" y2="70" stroke="#7eb8c4" stroke-width="3"/>`
      + `<circle cx="80" cy="130" r="4" fill="#7eb8c4"/><circle cx="160" cy="90" r="4" fill="#7eb8c4"/>`
      + `<text x="280" y="58" fill="#cbd5e1" font-size="13">Inversa: más → menos</text>`
      + `<path d="M300 80 Q380 160 460 80" fill="none" stroke="#c4a574" stroke-width="3"/>`
      + `<text x="24" y="185" fill="#64748b" font-size="11" font-family="ui-monospace,monospace">a/b = c/d          a·b = c·d</text>`
    );
  }
  if (id === 'argumentacion') {
    return base(
      `<rect x="40" y="50" width="140" height="50" rx="10" fill="#111827" stroke="#334155"/>`
      + `<text x="110" y="80" text-anchor="middle" fill="#e2e8f0" font-size="13">Premisas</text>`
      + `<path d="M180 75 H230" stroke="#475569" stroke-width="2"/>`
      + `<polygon points="230,71 240,75 230,79" fill="#475569"/>`
      + `<rect x="250" y="50" width="140" height="50" rx="10" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="320" y="80" text-anchor="middle" fill="#7eb8c4" font-size="13">Conclusión</text>`
      + `<rect x="40" y="120" width="350" height="44" rx="10" fill="#111827" stroke="#c4a57455"/>`
      + `<text x="56" y="147" fill="#c4a574" font-size="12">¿Las razones bastan? Si hay salto → falacia</text>`
    );
  }
  if (area === 'matematicas') {
    return base(
      `<text x="24" y="70" fill="#cbd5e1" font-size="14">${label}</text>`
      + `<rect x="40" y="90" width="100" height="56" rx="10" fill="#111827" stroke="#334155"/>`
      + `<text x="90" y="124" text-anchor="middle" fill="#94a3b8" font-size="12">Datos</text>`
      + `<text x="160" y="124" fill="#64748b" font-size="18">→</text>`
      + `<rect x="190" y="90" width="120" height="56" rx="10" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="250" y="124" text-anchor="middle" fill="#7eb8c4" font-size="12">Proceso</text>`
      + `<text x="330" y="124" fill="#64748b" font-size="18">→</text>`
      + `<rect x="360" y="90" width="120" height="56" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="420" y="124" text-anchor="middle" fill="#6ee7b7" font-size="12">Resultado</text>`
      + `<text x="24" y="175" fill="#64748b" font-size="11">Descarta lo que no responde exactamente la pregunta</text>`
    );
  }
  if (area === 'lectura_critica') {
    return base(
      `<rect x="36" y="55" width="200" height="110" rx="10" fill="#111827" stroke="#334155"/>`
      + `<text x="52" y="82" fill="#94a3b8" font-size="11">TEXTO</text>`
      + `<line x1="52" y1="98" x2="210" y2="98" stroke="#334155"/><line x1="52" y1="118" x2="190" y2="118" stroke="#334155"/><line x1="52" y1="138" x2="200" y2="138" stroke="#334155"/>`
      + `<text x="270" y="90" fill="#64748b" font-size="16">→</text>`
      + `<rect x="300" y="70" width="180" height="80" rx="10" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="390" y="105" text-anchor="middle" fill="#7eb8c4" font-size="13">Idea / inferencia</text>`
      + `<text x="390" y="128" text-anchor="middle" fill="#94a3b8" font-size="11">solo con apoyo del texto</text>`
    );
  }
  if (area === 'ciencias_naturales') {
    return base(
      `<circle cx="120" cy="110" r="36" fill="none" stroke="#7eb8c4" stroke-width="2"/>`
      + `<text x="120" y="114" text-anchor="middle" fill="#7eb8c4" font-size="12">causa</text>`
      + `<text x="180" y="114" fill="#64748b" font-size="18">→</text>`
      + `<rect x="210" y="78" width="120" height="64" rx="10" fill="#111827" stroke="#c4a57455"/>`
      + `<text x="270" y="115" text-anchor="middle" fill="#c4a574" font-size="12">proceso</text>`
      + `<text x="350" y="114" fill="#64748b" font-size="18">→</text>`
      + `<circle cx="420" cy="110" r="36" fill="none" stroke="#34d399" stroke-width="2"/>`
      + `<text x="420" y="114" text-anchor="middle" fill="#6ee7b7" font-size="12">efecto</text>`
      + `<text x="24" y="175" fill="#64748b" font-size="11">${label}</text>`
    );
  }
  if (area === 'sociales_ciudadanas') {
    return base(
      `<rect x="60" y="60" width="400" height="40" rx="8" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="260" y="85" text-anchor="middle" fill="#7eb8c4" font-size="13">Norma / Estado</text>`
      + `<line x1="160" y1="100" x2="160" y2="130" stroke="#475569"/><line x1="260" y1="100" x2="260" y2="130" stroke="#475569"/><line x1="360" y1="100" x2="360" y2="130" stroke="#475569"/>`
      + `<rect x="100" y="130" width="120" height="36" rx="8" fill="#111827" stroke="#334155"/><text x="160" y="153" text-anchor="middle" fill="#cbd5e1" font-size="11">Derecho</text>`
      + `<rect x="200" y="130" width="120" height="36" rx="8" fill="#111827" stroke="#334155"/><text x="260" y="153" text-anchor="middle" fill="#cbd5e1" font-size="11">Deber</text>`
      + `<rect x="300" y="130" width="120" height="36" rx="8" fill="#111827" stroke="#334155"/><text x="360" y="153" text-anchor="middle" fill="#cbd5e1" font-size="11">Mecanismo</text>`
    );
  }
  // inglés / default
  return base(
    `<rect x="50" y="70" width="160" height="70" rx="10" fill="#111827" stroke="#334155"/>`
    + `<text x="130" y="110" text-anchor="middle" fill="#94a3b8" font-size="13">Contexto</text>`
    + `<text x="230" y="110" fill="#64748b" font-size="18">→</text>`
    + `<rect x="260" y="70" width="200" height="70" rx="10" fill="#111827" stroke="#7eb8c455"/>`
    + `<text x="360" y="100" text-anchor="middle" fill="#7eb8c4" font-size="13">Forma correcta</text>`
    + `<text x="360" y="122" text-anchor="middle" fill="#94a3b8" font-size="11">tiempo · vocabulario · sentido</text>`
  );
}

function buildTema(id) {
  const canon = ALIAS[id] || id;
  const titulo = TEMA_SUB[id] || TEMA_SUB[canon] || id.replace(/_/g, ' ');
  const area = AREA_DE[id] || AREA_DE[canon] || 'matematicas';
  const rich = CONTENIDO[id] || CONTENIDO[canon];
  const base = rich || plantillaBase(id, titulo, area);
  const diagrama = diagramaDe(id, area, titulo);
  const practica = (base.practica || []).map((p, i) => ({
    ...p,
    // Primera pregunta de práctica referencia el diagrama del tema
    ayuda_visual: i === 0 ? 'Usa el diagrama de la explicación para orientar el procedimiento.' : undefined
  }));
  return {
    id,
    titulo,
    area,
    nivel: NIVEL[area] || 'Media · Saber 11°',
    subs: [id],
    matchTema: [titulo.toLowerCase(), id.replace(/_/g, ' ')],
    estadoContenido: 'completo',
    profundizar: base.profundizar,
    diagrama_svg: diagrama,
    explicacion: {
      intro: base.intro,
      pasos: base.pasos,
      errores: base.errores,
      ejemplo_resuelto: base.ejemplo,
      diagrama_svg: diagrama
    },
    practica
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
