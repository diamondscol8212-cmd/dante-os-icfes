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

/** Diagramas SVG concretos por tema (estilo oscuro de la app). */
function diagramaDe(id, area, titulo) {
  const label = String(titulo || id).slice(0, 42);
  const base = (inner, vbH) => {
    const h = vbH || 200;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 ${h}" role="img" aria-label="${label}">`
      + `<rect width="520" height="${h}" rx="14" fill="#0b1220"/>`
      + `<rect x="1" y="1" width="518" height="${h - 2}" rx="13" fill="none" stroke="#1e293b"/>`
      + `<text x="24" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">AYUDA VISUAL</text>`
      + inner
      + `</svg>`;
  };

  if (id === 'geometria') {
    return base(
      `<text x="24" y="52" fill="#cbd5e1" font-size="13">Rectángulo · ancho x · largo 3x</text>`
      + `<rect x="70" y="70" width="220" height="90" rx="4" fill="#111827" stroke="#7eb8c4" stroke-width="2"/>`
      + `<text x="180" y="118" text-anchor="middle" fill="#7eb8c4" font-size="14" font-weight="600">3x</text>`
      + `<text x="55" y="118" text-anchor="middle" fill="#c4a574" font-size="13" transform="rotate(-90 55 118)">x</text>`
      + `<text x="320" y="88" fill="#e2e8f0" font-size="12">P = 2(x+3x) = 8x</text>`
      + `<text x="320" y="112" fill="#94a3b8" font-size="12">A = x·3x = 3x²</text>`
      + `<text x="320" y="140" fill="#64748b" font-size="11">No mezclar perímetro y área</text>`
      + `<text x="24" y="185" fill="#64748b" font-size="11">Contorno = suma de lados · Superficie = producto</text>`
    );
  }
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
  if (id === 'estadistica') {
    return base(
      `<text x="24" y="48" fill="#cbd5e1" font-size="12">Diagrama de caja · cuartiles</text>`
      + `<line x1="60" y1="100" x2="440" y2="100" stroke="#334155"/>`
      + `<line x1="80" y1="85" x2="80" y2="115" stroke="#94a3b8" stroke-width="2"/>`
      + `<rect x="140" y="78" width="160" height="44" fill="#111827" stroke="#7eb8c4" stroke-width="2"/>`
      + `<line x1="220" y1="78" x2="220" y2="122" stroke="#fbbf24" stroke-width="3"/>`
      + `<line x1="300" y1="85" x2="300" y2="115" stroke="#7eb8c4" stroke-width="2"/>`
      + `<line x1="300" y1="100" x2="400" y2="100" stroke="#94a3b8" stroke-width="2"/>`
      + `<line x1="400" y1="85" x2="400" y2="115" stroke="#94a3b8" stroke-width="2"/>`
      + `<line x1="140" y1="100" x2="80" y2="100" stroke="#94a3b8" stroke-width="2"/>`
      + `<text x="80" y="140" text-anchor="middle" fill="#94a3b8" font-size="11">mín</text>`
      + `<text x="140" y="140" text-anchor="middle" fill="#7eb8c4" font-size="11">Q1</text>`
      + `<text x="220" y="140" text-anchor="middle" fill="#fbbf24" font-size="11">Q2</text>`
      + `<text x="300" y="140" text-anchor="middle" fill="#7eb8c4" font-size="11">Q3</text>`
      + `<text x="400" y="140" text-anchor="middle" fill="#94a3b8" font-size="11">máx</text>`
      + `<text x="24" y="170" fill="#e2e8f0" font-size="12">Q2 = mediana · IQR = Q3 − Q1 · ≥ Q2 ≈ 50%</text>`
      + `<text x="24" y="190" fill="#64748b" font-size="11">Ej.: Q1=25, Q2=34, Q3=42</text>`,
      210
    );
  }
  if (id === 'algebra') {
    return base(
      `<text x="24" y="60" fill="#cbd5e1" font-size="14">3x + 1 = 13</text>`
      + `<text x="24" y="95" fill="#94a3b8" font-size="13">−1 a ambos lados → 3x = 12</text>`
      + `<text x="24" y="125" fill="#94a3b8" font-size="13">÷3 a ambos lados → x = 4</text>`
      + `<rect x="300" y="70" width="160" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="380" y="100" text-anchor="middle" fill="#6ee7b7" font-size="14">x = 4</text>`
      + `<text x="380" y="122" text-anchor="middle" fill="#94a3b8" font-size="11">comprueba: 3·4+1=13</text>`
    );
  }
  if (id === 'probabilidad') {
    return base(
      `<rect x="60" y="60" width="70" height="70" rx="8" fill="#111827" stroke="#7eb8c4"/><text x="95" y="100" text-anchor="middle" fill="#7eb8c4" font-size="16">1</text>`
      + `<rect x="145" y="60" width="70" height="70" rx="8" fill="#111827" stroke="#334155"/><text x="180" y="100" text-anchor="middle" fill="#cbd5e1" font-size="16">2</text>`
      + `<rect x="230" y="60" width="70" height="70" rx="8" fill="#111827" stroke="#7eb8c4"/><text x="265" y="100" text-anchor="middle" fill="#7eb8c4" font-size="16">3</text>`
      + `<rect x="315" y="60" width="70" height="70" rx="8" fill="#111827" stroke="#334155"/><text x="350" y="100" text-anchor="middle" fill="#cbd5e1" font-size="16">4</text>`
      + `<rect x="400" y="60" width="70" height="70" rx="8" fill="#111827" stroke="#7eb8c4"/><text x="435" y="100" text-anchor="middle" fill="#7eb8c4" font-size="16">5</text>`
      + `<text x="24" y="160" fill="#e2e8f0" font-size="13">P(impar) = 3/5  ·  P(par) = 2/5  ·  complemento: 1 − P(A)</text>`
      + `<text x="24" y="185" fill="#64748b" font-size="11">Favorables ÷ posibles (casos igualmente probables)</text>`
    );
  }
  if (id === 'trigonometria') {
    return base(
      `<path d="M80 160 L80 60 L220 160 Z" fill="#111827" stroke="#7eb8c4" stroke-width="2"/>`
      + `<path d="M80 145 L95 145 L95 160" fill="none" stroke="#c4a574" stroke-width="2"/>`
      + `<text x="55" y="115" fill="#c4a574" font-size="12">op</text>`
      + `<text x="140" y="175" fill="#94a3b8" font-size="12">adj</text>`
      + `<text x="160" y="100" fill="#7eb8c4" font-size="12">hip</text>`
      + `<text x="280" y="90" fill="#e2e8f0" font-size="13">sen = op/hip</text>`
      + `<text x="280" y="115" fill="#e2e8f0" font-size="13">cos = adj/hip</text>`
      + `<text x="280" y="140" fill="#e2e8f0" font-size="13">tan = op/adj</text>`
    );
  }
  if (id === 'funciones') {
    return base(
      `<line x1="60" y1="160" x2="260" y2="160" stroke="#334155"/><line x1="60" y1="160" x2="60" y2="50" stroke="#334155"/>`
      + `<line x1="70" y1="140" x2="240" y2="60" stroke="#7eb8c4" stroke-width="3"/>`
      + `<circle cx="160" cy="100" r="4" fill="#c4a574"/>`
      + `<text x="280" y="90" fill="#e2e8f0" font-size="13">y = mx + b</text>`
      + `<text x="280" y="115" fill="#7eb8c4" font-size="12">m = pendiente</text>`
      + `<text x="280" y="138" fill="#c4a574" font-size="12">b = corte con y</text>`
      + `<text x="24" y="185" fill="#64748b" font-size="11">Un x → un solo y</text>`
    );
  }
  if (id === 'aritmetica' || id === 'aptitud_numerica_docente') {
    return base(
      `<text x="24" y="70" fill="#cbd5e1" font-size="14">2 + 3 × 4</text>`
      + `<text x="24" y="100" fill="#94a3b8" font-size="13">Primero × → 2 + 12</text>`
      + `<text x="24" y="130" fill="#6ee7b7" font-size="14">= 14</text>`
      + `<rect x="280" y="60" width="200" height="90" rx="10" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="380" y="95" text-anchor="middle" fill="#7eb8c4" font-size="12">() → pot → ×÷ → +−</text>`
      + `<text x="380" y="120" text-anchor="middle" fill="#94a3b8" font-size="11">No de izquierda a ciegas</text>`
    );
  }
  if (id === 'combinatoria') {
    return base(
      `<text x="24" y="60" fill="#cbd5e1" font-size="13">ABC · orden importa → permutación</text>`
      + `<text x="40" y="95" fill="#7eb8c4" font-size="12">ABC  ACB  BAC  BCA  CAB  CBA</text>`
      + `<text x="24" y="130" fill="#cbd5e1" font-size="13">Elegir 2 de 3 · orden no importa → C</text>`
      + `<text x="40" y="160" fill="#c4a574" font-size="12">AB  AC  BC   (no cuentes BA aparte)</text>`
    );
  }
  if (id === 'calculo_limites') {
    return base(
      `<text x="24" y="70" fill="#cbd5e1" font-size="14">lim x→2 (x² − 4)/(x − 2)</text>`
      + `<text x="24" y="100" fill="#c4a574" font-size="12">Forma 0/0 → factoriza</text>`
      + `<text x="24" y="130" fill="#94a3b8" font-size="13">(x−2)(x+2)/(x−2) → x+2</text>`
      + `<text x="24" y="160" fill="#6ee7b7" font-size="14">límite = 4</text>`
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
  if (id === 'hidrografia_colombia') {
    // Esquema geográfico: ríos Magdalena/Cauca y cuencas (no cajas genéricas)
    return base(
      `<text x="24" y="48" fill="#cbd5e1" font-size="12">Mapa esquemático · hidrografía de Colombia</text>`
      + `<path d="M210 55 L250 70 L270 110 L265 160 L240 200 L200 210 L170 180 L160 120 Z" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>`
      + `<text x="70" y="80" fill="#7eb8c4" font-size="11">Caribe</text>`
      + `<path d="M90 88 C140 95, 180 100, 215 95" fill="none" stroke="#38bdf8" stroke-width="2.5"/>`
      + `<text x="95" y="78" fill="#38bdf8" font-size="10">Magdalena →</text>`
      + `<path d="M175 150 C185 130, 195 115, 215 100" fill="none" stroke="#c4a574" stroke-width="2"/>`
      + `<text x="120" y="145" fill="#c4a574" font-size="10">Cauca (afluente)</text>`
      + `<circle cx="200" y="175" r="5" fill="#fbbf24"/><text x="210" y="179" fill="#fbbf24" font-size="10">Macizo</text>`
      + `<text x="300" y="90" fill="#94a3b8" font-size="11">Orinoco → Llanos</text>`
      + `<path d="M280 100 C320 110, 360 120, 400 115" fill="none" stroke="#34d399" stroke-width="2"/>`
      + `<text x="300" y="150" fill="#6ee7b7" font-size="11">Amazonas → suroriente</text>`
      + `<path d="M260 170 C300 185, 340 195, 390 190" fill="none" stroke="#6ee7b7" stroke-width="2"/>`
      + `<text x="300" y="210" fill="#64748b" font-size="10">Cauca aporta al Magdalena; no al Amazonas</text>`,
      230
    );
  }
  if (id === 'geografia') {
    return base(
      `<text x="24" y="48" fill="#cbd5e1" font-size="12">Mapa · regiones naturales de Colombia</text>`
      + `<path d="M200 50 L255 65 L275 115 L260 175 L230 210 L185 215 L155 175 L150 110 Z" fill="#0f172a" stroke="#334155"/>`
      + `<rect x="195" y="55" width="55" height="28" rx="4" fill="#0ea5e933" stroke="#38bdf8"/><text x="222" y="73" text-anchor="middle" fill="#7dd3fc" font-size="9">Caribe</text>`
      + `<rect x="155" y="100" width="40" height="50" rx="4" fill="#c4a57433" stroke="#c4a574"/><text x="175" y="128" text-anchor="middle" fill="#c4a574" font-size="9">Pacíf.</text>`
      + `<rect x="200" y="95" width="50" height="55" rx="4" fill="#7eb8c433" stroke="#7eb8c4"/><text x="225" y="125" text-anchor="middle" fill="#7eb8c4" font-size="9">Andina</text>`
      + `<rect x="255" y="100" width="55" height="45" rx="4" fill="#fbbf2433" stroke="#fbbf24"/><text x="282" y="125" text-anchor="middle" fill="#fbbf24" font-size="9">Orinoq.</text>`
      + `<rect x="210" y="160" width="60" height="40" rx="4" fill="#34d39933" stroke="#34d399"/><text x="240" y="184" text-anchor="middle" fill="#6ee7b7" font-size="9">Amazonía</text>`
      + `<text x="330" y="85" fill="#e2e8f0" font-size="11">Barranquilla → Caribe</text>`
      + `<text x="330" y="110" fill="#e2e8f0" font-size="11">Buenaventura → Pacífico</text>`
      + `<text x="330" y="135" fill="#e2e8f0" font-size="11">Eje cafetero → Andina</text>`
      + `<text x="330" y="160" fill="#e2e8f0" font-size="11">Leticia → Amazonía</text>`
      + `<text x="24" y="215" fill="#64748b" font-size="10">Más altitud (Andina/páramo) → menor temperatura media</text>`,
      235
    );
  }
  if (id === 'constitucion') {
    return base(
      `<rect x="40" y="55" width="440" height="36" rx="8" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="260" y="78" text-anchor="middle" fill="#7eb8c4" font-size="13">Constitución 1991</text>`
      + `<rect x="40" y="110" width="130" height="55" rx="8" fill="#111827" stroke="#334155"/><text x="105" y="135" text-anchor="middle" fill="#cbd5e1" font-size="11">Legislativa</text><text x="105" y="152" text-anchor="middle" fill="#94a3b8" font-size="10">Congreso</text>`
      + `<rect x="195" y="110" width="130" height="55" rx="8" fill="#111827" stroke="#334155"/><text x="260" y="135" text-anchor="middle" fill="#cbd5e1" font-size="11">Ejecutiva</text><text x="260" y="152" text-anchor="middle" fill="#94a3b8" font-size="10">Presidente</text>`
      + `<rect x="350" y="110" width="130" height="55" rx="8" fill="#111827" stroke="#334155"/><text x="415" y="135" text-anchor="middle" fill="#cbd5e1" font-size="11">Judicial</text><text x="415" y="152" text-anchor="middle" fill="#94a3b8" font-size="10">Cortes</text>`
      + `<text x="24" y="185" fill="#64748b" font-size="11">Pesos y contrapesos entre ramas</text>`
    );
  }
  if (id === 'fisica') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="14">F = m · a</text>`
      + `<text x="24" y="95" fill="#94a3b8" font-size="13">Si F fija y m sube → a baja</text>`
      + `<text x="24" y="125" fill="#94a3b8" font-size="13">v = Δx/Δt · a = Δv/Δt</text>`
      + `<rect x="300" y="70" width="180" height="70" rx="10" fill="#111827" stroke="#c4a57455"/>`
      + `<text x="390" y="110" text-anchor="middle" fill="#c4a574" font-size="12">causa → aceleración</text>`
    );
  }
  if (id === 'biologia') {
    return base(
      `<rect x="40" y="55" width="140" height="50" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="110" y="85" text-anchor="middle" fill="#7eb8c4" font-size="12">Luz + H₂O</text>`
      + `<text x="195" y="85" fill="#64748b" font-size="16">→</text>`
      + `<rect x="220" y="55" width="140" height="50" rx="8" fill="#111827" stroke="#c4a57455"/><text x="290" y="85" text-anchor="middle" fill="#c4a574" font-size="12">Tilacoides</text>`
      + `<text x="375" y="85" fill="#64748b" font-size="16">→</text>`
      + `<rect x="400" y="55" width="90" height="50" rx="8" fill="#111827" stroke="#34d39955"/><text x="445" y="85" text-anchor="middle" fill="#6ee7b7" font-size="12">ATP</text>`
      + `<text x="24" y="140" fill="#cbd5e1" font-size="12">Calvin fija CO₂ → glucosa · O₂ se libera</text>`
      + `<text x="24" y="170" fill="#64748b" font-size="11">No confundir fase luminosa con ciclo de Calvin</text>`
    );
  }
  if (id === 'quimica') {
    return base(
      `<text x="24" y="55" fill="#cbd5e1" font-size="13">Reacción balanceada</text>`
      + `<circle cx="70" cy="95" r="14" fill="#7eb8c433" stroke="#7eb8c4"/><text x="70" y="99" text-anchor="middle" fill="#7eb8c4" font-size="10">H₂</text>`
      + `<circle cx="110" cy="95" r="14" fill="#7eb8c433" stroke="#7eb8c4"/><text x="110" y="99" text-anchor="middle" fill="#7eb8c4" font-size="10">H₂</text>`
      + `<text x="140" y="100" fill="#94a3b8" font-size="14">+</text>`
      + `<circle cx="175" cy="95" r="16" fill="#c4a57433" stroke="#c4a574"/><text x="175" y="99" text-anchor="middle" fill="#c4a574" font-size="10">O₂</text>`
      + `<text x="210" y="100" fill="#94a3b8" font-size="14">→</text>`
      + `<circle cx="250" cy="95" r="16" fill="#34d39933" stroke="#34d399"/><text x="250" y="99" text-anchor="middle" fill="#6ee7b7" font-size="9">H₂O</text>`
      + `<circle cx="295" cy="95" r="16" fill="#34d39933" stroke="#34d399"/><text x="295" y="99" text-anchor="middle" fill="#6ee7b7" font-size="9">H₂O</text>`
      + `<text x="24" y="145" fill="#e2e8f0" font-size="12">2 H₂ + O₂ → 2 H₂O · mismos átomos a ambos lados</text>`
      + `<text x="24" y="170" fill="#7eb8c4" font-size="12">Molaridad M = n / V</text>`
    );
  }
  if (id === 'cloze' || id === 'grammar' || id === 'lexical_cloze' || id === 'grammar_reading') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">They _____ soccer every Saturday.</text>`
      + `<text x="24" y="100" fill="#6ee7b7" font-size="14">play  ✓  (presente · they)</text>`
      + `<text x="24" y="130" fill="#f87171" font-size="13">plays ✗  (eso va con he/she/it)</text>`
      + `<text x="24" y="160" fill="#94a3b8" font-size="12">Yesterday → played · Since 2019 → have played</text>`
    );
  }
  if (id === 'cts') {
    return base(
      `<rect x="40" y="55" width="120" height="50" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="100" y="85" text-anchor="middle" fill="#7eb8c4" font-size="12">Ciencia</text>`
      + `<rect x="200" y="55" width="120" height="50" rx="8" fill="#111827" stroke="#c4a57455"/><text x="260" y="85" text-anchor="middle" fill="#c4a574" font-size="12">Tecnología</text>`
      + `<rect x="360" y="55" width="120" height="50" rx="8" fill="#111827" stroke="#34d39955"/><text x="420" y="85" text-anchor="middle" fill="#6ee7b7" font-size="12">Sociedad</text>`
      + `<text x="24" y="140" fill="#e2e8f0" font-size="12">Ej.: presa → energía (+) · ecosistema (−)</text>`
      + `<text x="24" y="168" fill="#94a3b8" font-size="11">Evalúa impacto + riesgo-beneficio con evidencia</text>`
    );
  }
  if (id === 'indagacion') {
    return base(
      `<text x="24" y="60" fill="#cbd5e1" font-size="13">Pregunta → hipótesis → experimento</text>`
      + `<rect x="40" y="80" width="130" height="44" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="105" y="107" text-anchor="middle" fill="#7eb8c4" font-size="11">Indep. (manipulo)</text>`
      + `<text x="185" y="107" fill="#64748b" font-size="16">→</text>`
      + `<rect x="210" y="80" width="130" height="44" rx="8" fill="#111827" stroke="#c4a57455"/><text x="275" y="107" text-anchor="middle" fill="#c4a574" font-size="11">Depend. (mido)</text>`
      + `<text x="355" y="107" fill="#64748b" font-size="16">→</text>`
      + `<rect x="380" y="80" width="100" height="44" rx="8" fill="#111827" stroke="#34d39955"/><text x="430" y="107" text-anchor="middle" fill="#6ee7b7" font-size="11">Control</text>`
      + `<text x="24" y="160" fill="#94a3b8" font-size="12">Misma luz/agua; solo cambia el fertilizante</text>`
      + `<text x="24" y="185" fill="#64748b" font-size="11">La evidencia apoya o refuta la hipótesis</text>`
    );
  }
  if (id === 'dialogo' || id === 'dialogues') {
    return base(
      `<rect x="40" y="55" width="200" height="50" rx="10" fill="#111827" stroke="#7eb8c455"/>`
      + `<text x="56" y="85" fill="#7eb8c4" font-size="12">A: How are you?</text>`
      + `<rect x="280" y="90" width="200" height="50" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="296" y="120" fill="#6ee7b7" font-size="12">B: Fine, thanks.</text>`
      + `<text x="24" y="170" fill="#94a3b8" font-size="12">La respuesta debe coincidir con lo preguntado</text>`
    );
  }
  if (id === 'aviso' || id === 'signs_notices') {
    return base(
      `<rect x="80" y="50" width="360" height="100" rx="12" fill="#111827" stroke="#f87171" stroke-width="2"/>`
      + `<text x="260" y="90" text-anchor="middle" fill="#f87171" font-size="18" font-weight="700">NO SMOKING</text>`
      + `<text x="260" y="120" text-anchor="middle" fill="#94a3b8" font-size="12">Prohibición · destinatario: todos</text>`
      + `<text x="24" y="175" fill="#cbd5e1" font-size="12">Open 9 a.m.–5 p.m. → horario · Staff only → acceso</text>`
    );
  }
  if (id === 'vocabulario' || id === 'vocabulary') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">“She sat by the river bank.”</text>`
      + `<text x="24" y="100" fill="#6ee7b7" font-size="13">bank = orilla  ✓  (contexto: river)</text>`
      + `<text x="24" y="130" fill="#f87171" font-size="13">bank = banco (dinero) ✗ aquí</text>`
      + `<text x="24" y="165" fill="#94a3b8" font-size="12">Usa las palabras alrededor para fijar el sentido</text>`
    );
  }
  if (id === 'lectura' || id === 'reading_comprehension') {
    return base(
      `<rect x="36" y="50" width="220" height="90" rx="10" fill="#111827" stroke="#334155"/>`
      + `<text x="52" y="75" fill="#94a3b8" font-size="11">The museum opens at 9.</text>`
      + `<text x="52" y="98" fill="#94a3b8" font-size="11">Buy tickets online.</text>`
      + `<text x="52" y="121" fill="#64748b" font-size="10">…</text>`
      + `<text x="280" y="70" fill="#7eb8c4" font-size="12">Main idea?</text>`
      + `<text x="280" y="95" fill="#c4a574" font-size="12">Detail / when?</text>`
      + `<text x="280" y="120" fill="#6ee7b7" font-size="12">Purpose?</text>`
      + `<text x="24" y="170" fill="#94a3b8" font-size="11">Responde solo con lo que el texto sostiene</text>`
    );
  }
  if (id === 'literal_reading') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">“Luisa bought two maps.”</text>`
      + `<text x="24" y="100" fill="#e2e8f0" font-size="13">How many maps?</text>`
      + `<text x="24" y="135" fill="#6ee7b7" font-size="14">→ two  (dato literal)</text>`
      + `<text x="24" y="170" fill="#f87171" font-size="12">No inventes “three” ni “a week”</text>`
    );
  }
  if (id === 'inferential_reading') {
    return base(
      `<text x="24" y="60" fill="#cbd5e1" font-size="13">“Tom turned off the light and yawned.”</text>`
      + `<text x="24" y="95" fill="#94a3b8" font-size="12">Pista: yawned</text>`
      + `<text x="24" y="125" fill="#6ee7b7" font-size="13">Inferencia: he is tired / going to sleep</text>`
      + `<text x="24" y="160" fill="#f87171" font-size="12">No digas “he hates books” (no hay pista)</text>`
    );
  }
  if (id === 'historia') {
    return base(
      `<text x="40" y="70" fill="#7eb8c4" font-size="12">1810</text>`
      + `<circle cx="55" cy="95" r="6" fill="#7eb8c4"/>`
      + `<line x1="61" y1="95" x2="200" y2="95" stroke="#475569" stroke-width="2"/>`
      + `<text x="160" y="70" fill="#c4a574" font-size="12">1819</text>`
      + `<circle cx="210" cy="95" r="6" fill="#c4a574"/>`
      + `<line x1="216" y1="95" x2="360" y2="95" stroke="#475569" stroke-width="2"/>`
      + `<text x="340" y="70" fill="#6ee7b7" font-size="12">1903</text>`
      + `<circle cx="370" cy="95" r="6" fill="#6ee7b7"/>`
      + `<text x="40" y="130" fill="#94a3b8" font-size="11">Junta / grito</text>`
      + `<text x="175" y="130" fill="#94a3b8" font-size="11">Boyacá</text>`
      + `<text x="330" y="130" fill="#94a3b8" font-size="11">Panamá se separa</text>`
      + `<text x="24" y="170" fill="#cbd5e1" font-size="12">Independencia = proceso, no un solo día</text>`
    );
  }
  if (id === 'pensamiento_social') {
    return base(
      `<rect x="40" y="55" width="120" height="50" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="100" y="85" text-anchor="middle" fill="#7eb8c4" font-size="12">Actores</text>`
      + `<rect x="200" y="55" width="120" height="50" rx="8" fill="#111827" stroke="#c4a57455"/><text x="260" y="85" text-anchor="middle" fill="#c4a574" font-size="12">Conflicto</text>`
      + `<rect x="360" y="55" width="120" height="50" rx="8" fill="#111827" stroke="#34d39955"/><text x="420" y="85" text-anchor="middle" fill="#6ee7b7" font-size="12">Norma</text>`
      + `<text x="24" y="140" fill="#e2e8f0" font-size="12">¿Quién interviene? ¿Qué chocan? ¿Qué regla aplica?</text>`
      + `<text x="24" y="170" fill="#94a3b8" font-size="11">Ej.: comunidad · empresa · Estado por un río</text>`
    );
  }
  if (id === 'pensamiento_sistemico') {
    return base(
      `<circle cx="120" cy="100" r="40" fill="none" stroke="#7eb8c4" stroke-width="2"/><text x="120" y="104" text-anchor="middle" fill="#7eb8c4" font-size="11">Sequía</text>`
      + `<text x="175" y="104" fill="#64748b" font-size="16">→</text>`
      + `<circle cx="250" cy="100" r="40" fill="none" stroke="#c4a574" stroke-width="2"/><text x="250" y="104" text-anchor="middle" fill="#c4a574" font-size="11">Cosecha↓</text>`
      + `<text x="305" y="104" fill="#64748b" font-size="16">→</text>`
      + `<circle cx="380" cy="100" r="40" fill="none" stroke="#f87171" stroke-width="2"/><text x="380" y="104" text-anchor="middle" fill="#f87171" font-size="11">Precios↑</text>`
      + `<text x="24" y="170" fill="#94a3b8" font-size="12">Efecto cascada · las partes se afectan (interdependencia)</text>`
    );
  }
  if (id === 'pensamiento_critico') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">Afirmación: “Todos los jóvenes…”</text>`
      + `<text x="24" y="100" fill="#c4a574" font-size="12">¿Hay evidencia? ¿Hay supuesto oculto?</text>`
      + `<text x="24" y="130" fill="#6ee7b7" font-size="12">Contraejemplo → la generalización falla</text>`
      + `<text x="24" y="165" fill="#94a3b8" font-size="12">Criterios: claridad · relevancia · fuente</text>`
    );
  }
  if (id === 'interpretacion' || id === 'interpretacion_y_analisis') {
    return base(
      `<rect x="40" y="55" width="140" height="70" rx="8" fill="#111827" stroke="#334155"/><text x="110" y="85" text-anchor="middle" fill="#94a3b8" font-size="11">Dato / norma</text><text x="110" y="105" text-anchor="middle" fill="#64748b" font-size="10">del caso</text>`
      + `<text x="200" y="95" fill="#64748b" font-size="16">→</text>`
      + `<rect x="230" y="55" width="140" height="70" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="300" y="85" text-anchor="middle" fill="#7eb8c4" font-size="11">Contexto</text><text x="300" y="105" text-anchor="middle" fill="#94a3b8" font-size="10">histórico/social</text>`
      + `<text x="390" y="95" fill="#64748b" font-size="16">→</text>`
      + `<rect x="410" y="55" width="80" height="70" rx="8" fill="#111827" stroke="#34d39955"/><text x="450" y="95" text-anchor="middle" fill="#6ee7b7" font-size="11">Sentido</text>`
      + `<text x="24" y="160" fill="#cbd5e1" font-size="12">Interpretar ≠ solo repetir el dato</text>`
    );
  }
  if (id === 'participacion') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">Vías ciudadanas</text>`
      + `<rect x="40" y="85" width="100" height="40" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="90" y="110" text-anchor="middle" fill="#7eb8c4" font-size="11">Voto</text>`
      + `<rect x="160" y="85" width="100" height="40" rx="8" fill="#111827" stroke="#c4a57455"/><text x="210" y="110" text-anchor="middle" fill="#c4a574" font-size="11">Veeduría</text>`
      + `<rect x="280" y="85" width="100" height="40" rx="8" fill="#111827" stroke="#34d39955"/><text x="330" y="110" text-anchor="middle" fill="#6ee7b7" font-size="11">Cabildo</text>`
      + `<rect x="400" y="85" width="90" height="40" rx="8" fill="#111827" stroke="#fbbf2455"/><text x="445" y="110" text-anchor="middle" fill="#fbbf24" font-size="11">Consulta</text>`
      + `<text x="24" y="160" fill="#94a3b8" font-size="12">Participar con respeto a derechos de otros</text>`
    );
  }
  if (id === 'competencias_ciudadanas') {
    return base(
      `<rect x="60" y="55" width="160" height="55" rx="10" fill="#111827" stroke="#7eb8c455"/><text x="140" y="88" text-anchor="middle" fill="#7eb8c4" font-size="13">Derecho</text>`
      + `<rect x="300" y="55" width="160" height="55" rx="10" fill="#111827" stroke="#c4a57455"/><text x="380" y="88" text-anchor="middle" fill="#c4a574" font-size="13">Deber</text>`
      + `<text x="24" y="140" fill="#e2e8f0" font-size="12">Conflicto → diálogo / mediación / justicia</text>`
      + `<text x="24" y="168" fill="#94a3b8" font-size="11">Empatía + pluralismo (diversidad de ideas)</text>`
    );
  }
  if (id === 'aptitud_pedagogica') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">Error del estudiante (ej. fracciones)</text>`
      + `<text x="24" y="100" fill="#f87171" font-size="12">✗ Solo decir “mal” / ridiculizar</text>`
      + `<text x="24" y="130" fill="#6ee7b7" font-size="12">✓ Diagnosticar → mediar → retroalimentar</text>`
      + `<text x="24" y="165" fill="#94a3b8" font-size="12">Andamiaje: apoyo que se retira poco a poco</text>`
    );
  }
  // Lectura crítica: esquemas por subtipo
  if (id === 'comprension_literal') {
    return base(
      `<rect x="40" y="55" width="240" height="70" rx="10" fill="#111827" stroke="#334155"/>`
      + `<text x="56" y="85" fill="#94a3b8" font-size="12">“La reunión es el martes a las 3.”</text>`
      + `<text x="56" y="108" fill="#64748b" font-size="11">¿Cuándo? → martes a las 3</text>`
      + `<text x="310" y="90" fill="#6ee7b7" font-size="13">Dato explícito</text>`
      + `<text x="310" y="115" fill="#f87171" font-size="12">No inventes el día</text>`
    );
  }
  if (id === 'inferencia') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">Texto: apagó la luz y bostezó</text>`
      + `<text x="24" y="100" fill="#94a3b8" font-size="12">Pista → cansancio / ir a dormir</text>`
      + `<text x="24" y="135" fill="#6ee7b7" font-size="13">Inferencia válida (con apoyo)</text>`
      + `<text x="24" y="165" fill="#f87171" font-size="12">Sobrelectura: “odia leer” (sin pista)</text>`
    );
  }
  if (id === 'dos_textos') {
    return base(
      `<rect x="40" y="55" width="180" height="70" rx="10" fill="#111827" stroke="#7eb8c455"/><text x="130" y="85" text-anchor="middle" fill="#7eb8c4" font-size="12">Texto A</text><text x="130" y="105" text-anchor="middle" fill="#94a3b8" font-size="10">informa</text>`
      + `<rect x="300" y="55" width="180" height="70" rx="10" fill="#111827" stroke="#c4a57455"/><text x="390" y="85" text-anchor="middle" fill="#c4a574" font-size="12">Texto B</text><text x="390" y="105" text-anchor="middle" fill="#94a3b8" font-size="10">persuade</text>`
      + `<text x="24" y="160" fill="#e2e8f0" font-size="12">Compara propósito · punto de vista · conclusión</text>`
    );
  }
  if (id === 'textos_discontinuos') {
    return base(
      `<rect x="50" y="120" width="30" height="40" fill="#7eb8c4"/><rect x="95" y="90" width="30" height="70" fill="#c4a574"/><rect x="140" y="70" width="30" height="90" fill="#34d399"/>`
      + `<line x1="40" y1="160" x2="200" y2="160" stroke="#334155"/>`
      + `<text x="65" y="175" text-anchor="middle" fill="#94a3b8" font-size="10">Ene</text>`
      + `<text x="110" y="175" text-anchor="middle" fill="#94a3b8" font-size="10">Feb</text>`
      + `<text x="155" y="175" text-anchor="middle" fill="#94a3b8" font-size="10">Mar</text>`
      + `<text x="240" y="90" fill="#e2e8f0" font-size="12">Lee ejes + leyenda</text>`
      + `<text x="240" y="115" fill="#94a3b8" font-size="12">El dato está en la barra/tabla</text>`
      + `<text x="240" y="140" fill="#64748b" font-size="11">No ignores el pie o la escala</text>`
    );
  }
  if (id === 'articulacion_global') {
    return base(
      `<rect x="40" y="55" width="100" height="40" rx="8" fill="#111827" stroke="#334155"/><text x="90" y="80" text-anchor="middle" fill="#cbd5e1" font-size="11">Intro</text>`
      + `<text x="150" y="80" fill="#64748b" font-size="14">→</text>`
      + `<rect x="175" y="55" width="120" height="40" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="235" y="80" text-anchor="middle" fill="#7eb8c4" font-size="11">Desarrollo</text>`
      + `<text x="305" y="80" fill="#64748b" font-size="14">→</text>`
      + `<rect x="330" y="55" width="100" height="40" rx="8" fill="#111827" stroke="#34d39955"/><text x="380" y="80" text-anchor="middle" fill="#6ee7b7" font-size="11">Cierre</text>`
      + `<text x="24" y="130" fill="#e2e8f0" font-size="12">Cohesión: conectores · pronombres</text>`
      + `<text x="24" y="158" fill="#94a3b8" font-size="12">Coherencia: un mismo hilo conductor</text>`
    );
  }
  if (id === 'evaluacion_critica') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">Tesis del autor</text>`
      + `<text x="24" y="95" fill="#94a3b8" font-size="12">¿Qué evidencia da? ¿Hay sesgo?</text>`
      + `<text x="24" y="125" fill="#c4a574" font-size="12">¿Omite contraargumentos?</text>`
      + `<text x="24" y="160" fill="#6ee7b7" font-size="12">Fiabilidad = fuente + datos + rigor</text>`
    );
  }
  if (id === 'filosofia') {
    return base(
      `<rect x="40" y="55" width="160" height="50" rx="8" fill="#111827" stroke="#334155"/><text x="120" y="85" text-anchor="middle" fill="#cbd5e1" font-size="12">Premisas</text>`
      + `<text x="220" y="85" fill="#64748b" font-size="16">→</text>`
      + `<rect x="250" y="55" width="160" height="50" rx="8" fill="#111827" stroke="#7eb8c455"/><text x="330" y="85" text-anchor="middle" fill="#7eb8c4" font-size="12">Conclusión</text>`
      + `<text x="24" y="140" fill="#e2e8f0" font-size="12">Ética: ¿qué debo hacer? · Conocimiento ≠ opinión</text>`
      + `<text x="24" y="168" fill="#94a3b8" font-size="11">Conceptos: justicia, libertad, verdad</text>`
    );
  }
  if (id === 'pragmatica') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">“¡Fuego!” en teatro ≠ en un incendio</text>`
      + `<text x="24" y="100" fill="#94a3b8" font-size="12">Contexto fija la intención</text>`
      + `<text x="24" y="130" fill="#7eb8c4" font-size="12">Acto de habla: pedir · avisar · ironizar</text>`
      + `<text x="24" y="165" fill="#c4a574" font-size="12">Implicatura: “Hace frío” → cierra la ventana</text>`
    );
  }
  if (id === 'semantica') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="14">banco</text>`
      + `<text x="120" y="65" fill="#7eb8c4" font-size="12">→ asiento</text>`
      + `<text x="120" y="95" fill="#c4a574" font-size="12">→ entidad financiera</text>`
      + `<text x="24" y="135" fill="#94a3b8" font-size="12">Ambigüedad: el contexto elige el sentido</text>`
      + `<text x="24" y="165" fill="#e2e8f0" font-size="12">Sinónimo / antónimo según el uso</text>`
    );
  }
  if (id === 'literatura') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">“Sus ojos eran estrellas”</text>`
      + `<text x="24" y="100" fill="#7eb8c4" font-size="12">Figura: metáfora (no literal)</text>`
      + `<text x="24" y="130" fill="#94a3b8" font-size="12">Narrador · tema · género (lírico/narrativo…)</text>`
      + `<text x="24" y="165" fill="#c4a574" font-size="12">Lee el recurso, no solo la anécdota</text>`
    );
  }
  if (id === 'analisis_textual') {
    return base(
      `<text x="24" y="65" fill="#cbd5e1" font-size="13">Tesis → recursos → tono</text>`
      + `<text x="24" y="100" fill="#94a3b8" font-size="12">Ejemplo / dato / pregunta retórica</text>`
      + `<text x="24" y="130" fill="#7eb8c4" font-size="12">¿Para qué usa cada recurso el autor?</text>`
      + `<text x="24" y="165" fill="#c4a574" font-size="12">Estructura: intro · desarrollo · cierre</text>`
    );
  }
  if (id === 'analisis_imagen') {
    return base(
      `<rect x="50" y="50" width="160" height="100" rx="8" fill="#111827" stroke="#7eb8c4"/>`
      + `<circle cx="130" cy="90" r="22" fill="#1e293b" stroke="#c4a574"/>`
      + `<text x="130" y="95" text-anchor="middle" fill="#c4a574" font-size="10">primer plano</text>`
      + `<text x="240" y="80" fill="#e2e8f0" font-size="12">Composición · símbolo</text>`
      + `<text x="240" y="108" fill="#94a3b8" font-size="12">Pie de foto ancla el sentido</text>`
      + `<text x="240" y="136" fill="#64748b" font-size="11">Balanza → justicia (simbólico)</text>`
    );
  }
  // Último recurso: nunca “Datos→Proceso→Resultado”
  return base(
    `<text x="24" y="70" fill="#cbd5e1" font-size="14">${label}</text>`
    + `<text x="24" y="110" fill="#94a3b8" font-size="13">Aplica la definición al caso del enunciado</text>`
    + `<text x="24" y="145" fill="#7eb8c4" font-size="12">Marca datos → relación del tema → respuesta</text>`
    + `<text x="24" y="175" fill="#64748b" font-size="11">Usa los términos clave de esta cartilla</text>`
  );
}

/** Diagrama extra para entender opciones correctas/incorrectas (cuando aporta). */
function diagramaOpcionesDe(id) {
  const wrap = (inner, label, h) => {
    const H = h || 200;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 ${H}" role="img" aria-label="${label}">`
      + `<rect width="520" height="${H}" rx="14" fill="#0b1220"/>`
      + `<rect x="1" y="1" width="518" height="${H - 2}" rx="13" fill="none" stroke="#1e293b"/>`
      + `<text x="24" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">OPCIONES · AYUDA VISUAL</text>`
      + inner
      + `</svg>`;
  };
  if (id === 'estadistica') {
    return wrap(
      `<text x="24" y="55" fill="#cbd5e1" font-size="12">Si preguntan “Q2 o más” / “mediana o más”</text>`
      + `<rect x="60" y="75" width="180" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="150" y="105" text-anchor="middle" fill="#6ee7b7" font-size="13">✓ 50%</text>`
      + `<text x="150" y="128" text-anchor="middle" fill="#94a3b8" font-size="11">mitad desde Q2</text>`
      + `<rect x="280" y="75" width="180" height="70" rx="10" fill="#111827" stroke="#f8717155"/>`
      + `<text x="370" y="105" text-anchor="middle" fill="#f87171" font-size="13">✗ 25% o 75%</text>`
      + `<text x="370" y="128" text-anchor="middle" fill="#94a3b8" font-size="11">confunden Q1 / Q3</text>`
      + `<text x="24" y="175" fill="#64748b" font-size="11">IQR = Q3−Q1 (no es un porcentaje de “≥ Q2”)</text>`,
      'Opciones cuartiles',
      200
    );
  }
  if (id === 'quimica') {
    return wrap(
      `<text x="24" y="52" fill="#cbd5e1" font-size="12">¿Qué opción respeta el balance?</text>`
      + `<rect x="40" y="70" width="210" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="145" y="100" text-anchor="middle" fill="#6ee7b7" font-size="12">✓ 2 H₂ + O₂ → 2 H₂O</text>`
      + `<text x="145" y="122" text-anchor="middle" fill="#94a3b8" font-size="10">4 H y 2 O a cada lado</text>`
      + `<rect x="270" y="70" width="210" height="70" rx="10" fill="#111827" stroke="#f8717155"/>`
      + `<text x="375" y="100" text-anchor="middle" fill="#f87171" font-size="12">✗ H₂ + O₂ → H₂O</text>`
      + `<text x="375" y="122" text-anchor="middle" fill="#94a3b8" font-size="10">átomos no cuadran</text>`
      + `<text x="24" y="170" fill="#64748b" font-size="11">Molaridad: revisa unidades n (mol) y V (L)</text>`,
      'Opciones química',
      200
    );
  }
  if (id === 'geometria') {
    return wrap(
      `<text x="24" y="52" fill="#cbd5e1" font-size="12">Rectángulo x × 3x · ¿qué pide?</text>`
      + `<rect x="40" y="70" width="200" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="140" y="100" text-anchor="middle" fill="#6ee7b7" font-size="12">✓ Perímetro 8x</text>`
      + `<text x="140" y="122" text-anchor="middle" fill="#94a3b8" font-size="10">2(x+3x)</text>`
      + `<rect x="280" y="70" width="200" height="70" rx="10" fill="#111827" stroke="#f8717155"/>`
      + `<text x="380" y="100" text-anchor="middle" fill="#f87171" font-size="12">✗ Área 3x²</text>`
      + `<text x="380" y="122" text-anchor="middle" fill="#94a3b8" font-size="10">si pedían perímetro</text>`
      + `<text x="24" y="170" fill="#64748b" font-size="11">Lee la magnitud antes de elegir la fórmula</text>`,
      'Opciones geometría',
      200
    );
  }
  if (id === 'hidrografia_colombia' || id === 'geografia') {
    return wrap(
      `<text x="24" y="52" fill="#cbd5e1" font-size="12">Afluente del Cauca: ¿cuál río receptor?</text>`
      + `<rect x="40" y="70" width="200" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="140" y="100" text-anchor="middle" fill="#6ee7b7" font-size="12">✓ Magdalena</text>`
      + `<text x="140" y="122" text-anchor="middle" fill="#94a3b8" font-size="10">misma cuenca → Caribe</text>`
      + `<rect x="280" y="70" width="200" height="70" rx="10" fill="#111827" stroke="#f8717155"/>`
      + `<text x="380" y="100" text-anchor="middle" fill="#f87171" font-size="12">✗ Amazonas / Orinoco</text>`
      + `<text x="380" y="122" text-anchor="middle" fill="#94a3b8" font-size="10">otras cuencas</text>`
      + `<text x="24" y="170" fill="#64748b" font-size="11">Ubica la región en el mapa antes de elegir</text>`,
      'Opciones hidrografía',
      200
    );
  }
  if (id === 'cloze' || id === 'grammar' || id === 'lexical_cloze' || id === 'grammar_reading') {
    return wrap(
      `<text x="24" y="55" fill="#cbd5e1" font-size="12">They _____ soccer every Saturday.</text>`
      + `<rect x="40" y="75" width="200" height="60" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="140" y="110" text-anchor="middle" fill="#6ee7b7" font-size="13">✓ play</text>`
      + `<rect x="280" y="75" width="200" height="60" rx="10" fill="#111827" stroke="#f8717155"/>`
      + `<text x="380" y="110" text-anchor="middle" fill="#f87171" font-size="13">✗ plays</text>`
      + `<text x="24" y="165" fill="#94a3b8" font-size="11">they = plural → sin -s · he/she/it → -s</text>`,
      'Opciones gramática',
      190
    );
  }
  if (id === 'argumentacion' || id === 'inferencia') {
    return wrap(
      `<rect x="40" y="55" width="200" height="70" rx="10" fill="#111827" stroke="#34d39955"/>`
      + `<text x="140" y="85" text-anchor="middle" fill="#6ee7b7" font-size="12">✓ Con apoyo del texto</text>`
      + `<text x="140" y="108" text-anchor="middle" fill="#94a3b8" font-size="10">premisa → conclusión</text>`
      + `<rect x="280" y="55" width="200" height="70" rx="10" fill="#111827" stroke="#f8717155"/>`
      + `<text x="380" y="85" text-anchor="middle" fill="#f87171" font-size="12">✗ Salto / falacia</text>`
      + `<text x="380" y="108" text-anchor="middle" fill="#94a3b8" font-size="10">sin evidencia en el texto</text>`
      + `<text x="24" y="155" fill="#64748b" font-size="11">Descarta lo que el texto no sostiene</text>`,
      'Opciones lectura',
      180
    );
  }
  return '';
}

function buildTema(id) {
  const canon = ALIAS[id] || id;
  const titulo = TEMA_SUB[id] || TEMA_SUB[canon] || id.replace(/_/g, ' ');
  const area = AREA_DE[id] || AREA_DE[canon] || 'matematicas';
  const rich = CONTENIDO[id] || CONTENIDO[canon];
  const base = rich || plantillaBase(id, titulo, area);
  const diagrama = (base.diagrama_svg && String(base.diagrama_svg).trim())
    ? base.diagrama_svg
    : diagramaDe(id, area, titulo);
  const diagramaOpciones = diagramaOpcionesDe(canon) || diagramaOpcionesDe(id) || '';
  const terminos = Array.isArray(base.terminos) ? base.terminos.slice(0, 6) : [];
  const practica = (base.practica || []).map((p, i) => ({
    ...p,
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
    diagrama_opciones_svg: diagramaOpciones || undefined,
    terminos,
    explicacion: {
      intro: base.intro,
      pasos: base.pasos,
      errores: base.errores,
      ejemplo_resuelto: base.ejemplo,
      contraste: (base.ejemplo && base.ejemplo.contraste) || base.contraste || null,
      diagrama_svg: diagrama,
      diagrama_opciones_svg: diagramaOpciones || undefined,
      terminos
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
