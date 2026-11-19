/**
 * 1–2 fuentes concretas por tema para el bloque “Para profundizar”.
 */
const ICFES = {
  matematicas: 'Guía ICFES Saber 11° · Matemáticas (razonamiento cuantitativo)',
  lectura_critica: 'Guía ICFES Saber 11° · Lectura crítica',
  ciencias_naturales: 'Guía ICFES Saber 11° · Ciencias naturales (reacciones y procesos)',
  sociales_ciudadanas: 'Guía ICFES Saber 11° · Sociales y ciudadanas',
  ingles: 'Guía ICFES Saber 11° · Inglés'
};

function f(libro, videoOBusqueda) {
  const out = [];
  if (libro) out.push({ tipo: 'libro', texto: libro });
  if (videoOBusqueda) out.push({ tipo: 'video', texto: videoOBusqueda });
  return out;
}

export const FUENTES_TEMAS = {
  geometria: f('Álgebra y trigonometría de Sullivan (o similar) — perímetro y área', 'Busca: “perímetro vs área rectángulo” (Khan Academy)'),
  fracciones: f('Matemáticas básicas — fracciones equivalentes y operaciones', 'Busca: “sumar fracciones mcm” (Khan Academy)'),
  proporcionalidad: f('Razonamiento cuantitativo — regla de tres y proporciones', 'Busca: “proporción directa e inversa”'),
  algebra: f('Álgebra intermedia — ecuaciones lineales', 'Busca: “despejar variables ecuación” (Khan Academy)'),
  aritmetica: f('Aritmética — orden de operaciones (PEMDAS)', 'Busca: “orden de operaciones”'),
  funciones: f('Precálculo — funciones lineales y = mx + b', 'Busca: “pendiente e intercepto”'),
  estadistica: f('Estadística elemental — medidas de tendencia y cuartiles', 'Busca: “diagrama de caja cuartiles Q1 Q2 Q3”'),
  probabilidad: f('Probabilidad básica — espacio muestral', 'Busca: “probabilidad clásica favorables entre posibles”'),
  trigonometria: f('Trigonometría — razones seno coseno tangente', 'Busca: “SOH CAH TOA”'),
  combinatoria: f('Matemáticas discretas intro — permutaciones y combinaciones', 'Busca: “permutación vs combinación”'),
  calculo_limites: f('Cálculo I — límites e indeterminaciones', 'Busca: “límite 0/0 factorizar”'),
  aptitud_numerica_docente: f(ICFES.matematicas, 'Busca: “porcentajes y promedios en el aula”'),

  quimica: f(
    'Química de Chang — capítulo de oxidación-reducción / estados de oxidación',
    'Busca: “estados de oxidación sulfito sulfato” (YouTube o Khan Academy)'
  ),
  biologia: f('Biología de Campbell (cap. fotosíntesis) o texto escolar equivalente', 'Busca: “fase luminosa tilacoides Calvin”'),
  fisica: f('Física conceptual de Hewitt — fuerza y movimiento', 'Busca: “segunda ley de Newton F=ma”'),
  cts: f(ICFES.ciencias_naturales, 'Busca: “ciencia tecnología y sociedad impacto ambiental”'),
  indagacion: f(ICFES.ciencias_naturales, 'Busca: “variables independiente y dependiente experimento”'),

  hidrografia_colombia: f('Geografía de Colombia (texto escolar) — cuencas hidrográficas', 'Busca: “río Cauca afluente Magdalena mapa”'),
  geografia: f('Geografía de Colombia — regiones naturales', 'Busca: “regiones naturales de Colombia mapa”'),
  historia: f('Historia de Colombia siglo XIX — Independencia', 'Busca: “20 de julio 1810 y Boyacá 1819”'),
  constitucion: f('Constitución Política de Colombia 1991 — ramas del poder', ICFES.sociales_ciudadanas),
  pensamiento_social: f(ICFES.sociales_ciudadanas, 'Busca: “actores sociales y conflicto”'),
  pensamiento_sistemico: f(ICFES.sociales_ciudadanas, 'Busca: “pensamiento sistémico efecto cascada”'),
  pensamiento_critico: f(ICFES.sociales_ciudadanas, 'Busca: “evidencia y contraejemplo”'),
  interpretacion: f(ICFES.sociales_ciudadanas, null),
  interpretacion_y_analisis: f(ICFES.sociales_ciudadanas, null),
  participacion: f('Constitución 1991 — mecanismos de participación', ICFES.sociales_ciudadanas),
  competencias_ciudadanas: f(ICFES.sociales_ciudadanas, 'Busca: “derechos y deberes ciudadanos Colombia”'),
  aptitud_pedagogica: f('Pedagogía básica — andamiaje y retroalimentación', 'Busca: “feedback formativo en el aula”'),

  argumentacion: f('Lectura crítica — argumentos y falacias', 'Busca: “premisas conclusión falacias”'),
  inferencia: f(ICFES.lectura_critica, 'Busca: “inferencias en lectura crítica”'),
  comprension_literal: f(ICFES.lectura_critica, 'Busca: “idea principal y detalle literal”'),
  articulacion_global: f(ICFES.lectura_critica, 'Busca: “cohesión y coherencia textual”'),
  evaluacion_critica: f(ICFES.lectura_critica, 'Busca: “evaluar tesis y sesgo del autor”'),
  dos_textos: f(ICFES.lectura_critica, 'Busca: “comparar y contrastar dos textos”'),
  textos_discontinuos: f(ICFES.lectura_critica, 'Busca: “leer gráficas y tablas ICFES”'),
  filosofia: f('Introducción a la filosofía — argumentos', ICFES.lectura_critica),
  pragmatica: f(ICFES.lectura_critica, 'Busca: “actos de habla e implicatura”'),
  semantica: f(ICFES.lectura_critica, 'Busca: “ambigüedad y contexto semántico”'),
  literatura: f('Literatura — figuras literarias', 'Busca: “metáfora narrador género literario”'),
  analisis_textual: f(ICFES.lectura_critica, null),
  analisis_imagen: f(ICFES.lectura_critica, 'Busca: “análisis de imagen plano composición”'),

  cloze: f(ICFES.ingles, 'Busca: “English subject verb agreement present simple”'),
  grammar: f(ICFES.ingles, 'Busca: “English grammar present past simple”'),
  vocabulario: f(ICFES.ingles, 'Busca: “English vocabulary in context”'),
  dialogo: f(ICFES.ingles, 'Busca: “English dialogues requests greetings”'),
  aviso: f(ICFES.ingles, 'Busca: “English signs and notices Do not”'),
  lectura: f(ICFES.ingles, 'Busca: “English reading main idea detail purpose”'),
  literal_reading: f(ICFES.ingles, 'Busca: “literal reading comprehension English”'),
  inferential_reading: f(ICFES.ingles, 'Busca: “English reading inferences clues”'),
  phrasal_verbs: f(ICFES.ingles, 'Busca: “English phrasal verbs phase out look into keep up”'),
  passive_voice: f(ICFES.ingles, 'Busca: “English passive voice was written were built”'),
  infer_purpose: f(ICFES.ingles, 'Busca: “English reading purpose of the text or sign”'),
  dialog_response: f(ICFES.ingles, 'Busca: “English dialogue appropriate response”'),
  grammar_form: f(ICFES.ingles, 'Busca: “English grammar form in context”'),
  vocab_context: f(ICFES.ingles, 'Busca: “English vocabulary in context collocations”')
};

FUENTES_TEMAS.dialogues = FUENTES_TEMAS.dialogo;
FUENTES_TEMAS.signs_notices = FUENTES_TEMAS.aviso;
FUENTES_TEMAS.lexical_cloze = FUENTES_TEMAS.cloze;
FUENTES_TEMAS.vocabulary = FUENTES_TEMAS.vocabulario;
FUENTES_TEMAS.reading_comprehension = FUENTES_TEMAS.lectura;
FUENTES_TEMAS.grammar_reading = FUENTES_TEMAS.grammar;

export function fuentesDe(id, area) {
  if (FUENTES_TEMAS[id] && FUENTES_TEMAS[id].length) return FUENTES_TEMAS[id];
  const guia = ICFES[area] || ICFES.matematicas;
  return [{ tipo: 'guia', texto: guia }];
}
