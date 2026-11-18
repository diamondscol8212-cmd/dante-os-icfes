/**
 * Genera public/temasRefuerzo.json con cartillas completas por sub_competencia.
 * Uso: node scripts/generarCatalogoTemasRefuerzo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TEMA_SUB } from '../src/services/bank/enriquecerAyudas.js';
import { CONTENIDO_TEMAS } from './contenidoTemasRefuerzo.mjs';

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
  geografia: 'sociales_ciudadanas', hidrografia_colombia: 'sociales_ciudadanas',
  constitucion: 'sociales_ciudadanas', historia: 'sociales_ciudadanas',
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

/** Contenido real por tema (hechos/conceptos). Fuente: contenidoTemasRefuerzo.mjs */
const CONTENIDO = { ...CONTENIDO_TEMAS };

function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta) {
  return { id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta };
}

/** Fallback solo si falta entrada en CONTENIDO_TEMAS: sigue siendo contenido, no tips de examen. */
function plantillaBase(id, titulo, area) {
  const intro = `«${titulo}» es un núcleo de ${area.replace(/_/g, ' ')}: domina definiciones, relaciones y ejemplos del tema (no solo trucos de opción múltiple).`;
  const pasos = [
    `Recuerda la definición o relación central de «${titulo}».`,
    'Aplícala al caso concreto del enunciado.',
    'Explica por qué las otras opciones fallan en el concepto.'
  ];
  const errores = [
    'Confundir este concepto con uno vecino del área.',
    'Aplicar una fórmula o definición incompleta.',
    'Elegir un ejemplo que no corresponde al mismo fenómeno.'
  ];
  const ejemplo = {
    titulo: 'Ejemplo resuelto',
    enunciado: `Caso de «${titulo}»: identifica el concepto y aplícalo.`,
    pasos: [
      '1) Nombra el concepto del tema.',
      '2) Conéctalo con los datos del caso.',
      '3) Elige la opción que expresa esa relación.',
      '4) Las demás fallan por un error conceptual típico.'
    ],
    respuesta: 'La opción alineada con el concepto del tema',
    contraste: null
  };
  const practica = [
    q(`${id}_p1`, `El núcleo de «${titulo}» es:`,
      ['A) La definición/relación propia del tema', 'B) Solo adivinar la letra', 'C) Ignorar el caso', 'D) Cambiar de materia'],
      'A',
      { B: 'Sin concepto no hay transferencia.', C: 'El caso aporta los datos.', D: 'Hay que quedarse en el tema.' },
      'Primero el concepto.'),
    q(`${id}_p2`, `Una respuesta correcta debe:`,
      ['A) Aplicar el concepto al caso', 'B) Contradecir el concepto', 'C) Hablar de otro tema', 'D) Ser la más larga'],
      'A',
      { B: 'Contradicción falla.', C: 'Fuera de foco.', D: 'Longitud ≠ acierto.' },
      'Concepto + caso.'),
    q(`${id}_p3`, `Error típico en este tema:`,
      ['A) Usar bien la definición', 'B) Mezclarlo con un subtema cercano', 'C) Verificar con un ejemplo', 'D) Repasar la relación clave'],
      'B',
      { A: 'Eso es acierto.', C: 'Eso ayuda.', D: 'Eso ayuda.' },
      'Confusión entre subtemas.'),
    q(`${id}_p4`, `Para consolidar conviene:`,
      ['A) Practicar ítems nuevos del mismo concepto', 'B) Evitar ejemplos', 'C) Solo memorizar una clave', 'D) Borrar la definición'],
      'A',
      { B: 'Sin práctica no fija.', C: 'No transfiere.', D: 'Pierdes el ancla.' },
      'Práctica del mismo esquema.')
  ];
  return {
    intro,
    pasos,
    errores,
    ejemplo,
    profundizar: `Profundiza en «${titulo}» con apuntes y ejemplos del área.`,
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
  if (id === 'hidrografia_colombia' || id === 'geografia') {
    return base(
      `<text x="24" y="58" fill="#cbd5e1" font-size="13">Cuencas de Colombia</text>`
      + `<rect x="40" y="72" width="130" height="70" rx="10" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="105" y="100" text-anchor="middle" fill="#7eb8c4" font-size="12">Magdalena</text>`
      + `<text x="105" y="120" text-anchor="middle" fill="#94a3b8" font-size="11">→ Caribe</text>`
      + `<rect x="190" y="72" width="130" height="70" rx="10" fill="#111827" stroke="#c4a57455"/>`
      + `<text x="255" y="100" text-anchor="middle" fill="#c4a574" font-size="12">Cauca</text>`
      + `<text x="255" y="120" text-anchor="middle" fill="#94a3b8" font-size="11">afluente</text>`
      + `<rect x="340" y="72" width="140" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="410" y="100" text-anchor="middle" fill="#6ee7b7" font-size="12">Orinoco / Amazonas</text>`
      + `<text x="410" y="120" text-anchor="middle" fill="#94a3b8" font-size="11">Llanos / suroriente</text>`
      + `<text x="24" y="175" fill="#64748b" font-size="11">Macizo colombiano: nacen Magdalena y Cauca</text>`
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
    matchTema: id === 'hidrografia_colombia'
      ? [titulo.toLowerCase(), 'hidrografía', 'hidrografia', 'afluente', 'río cauca', 'rio cauca', 'río magdalena', 'cuenca del orinoco', 'macizo colombiano']
      : [titulo.toLowerCase(), id.replace(/_/g, ' ')],
    estadoContenido: 'completo',
    profundizar: base.profundizar,
    diagrama_svg: diagrama,
    explicacion: {
      intro: base.intro,
      pasos: base.pasos,
      errores: base.errores,
      ejemplo_resuelto: base.ejemplo,
      contraste: (base.ejemplo && base.ejemplo.contraste) || base.contraste || null,
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
