/**
 * Enriquecimiento de pistas y explicaciones del banco.
 * Sustituye plantillas del tipo «Fíjate en: [enunciado]» por análisis útil
 * y garantiza campos para el boletín: explicacion_incorrecta / correcta / tema_a_estudiar.
 */

const PISTA_DEBIL = /F[ií]jate en:|Lee qu[eé] pide la pregunta|contr[aá]stalo con el enunciado|Arma la relaci[oó]n con los datos y las unidades\. Un n[uú]mero que solo suma|Una norma se puede exigir|Separa premisa y conclusi[oó]n|no se sostiene en el texto|nombra otro hecho, lugar o norma/i;

const TEMA_SUB = {
  probabilidad: 'Probabilidad y conteo de casos',
  estadistica: 'Estadística descriptiva (media, mediana, moda, rango)',
  algebra: 'Álgebra: ecuaciones y despeje',
  geometria: 'Geometría: figuras, áreas y medidas',
  funciones: 'Funciones y representación',
  proporcionalidad: 'Proporcionalidad directa e inversa',
  aritmetica: 'Aritmética y orden de operaciones',
  fracciones: 'Fracciones: equivalencia, suma y comparación',
  trigonometria: 'Trigonometría básica (seno, coseno, tangente)',
  dos_textos: 'Lectura crítica: comparar dos textos',
  textos_discontinuos: 'Lectura de tablas, avisos y gráficas',
  argumentacion: 'Lectura crítica: argumentos y conclusiones',
  inferencia: 'Lectura crítica: inferencias válidas',
  filosofia: 'Lectura: ideas éticas y filosóficas',
  pragmatica: 'Lectura: intención comunicativa',
  semantica: 'Lectura: significado en contexto',
  literatura: 'Lectura: recursos literarios',
  comprension_literal: 'Lectura: comprensión literal',
  indagacion: 'Ciencias: indagación científica',
  fisica: 'Física: magnitudes y relaciones',
  quimica: 'Química: cambios y reacciones',
  biologia: 'Biología: estructuras y procesos',
  geografia: 'Geografía de Colombia',
  constitucion: 'Constitución Política y organización del Estado',
  historia: 'Historia de Colombia',
  pensamiento_critico: 'Sociales: fuentes y evidencias',
  interpretacion: 'Sociales: lectura de gráficos y mapas',
  participacion: 'Ciudadanía: mecanismos de participación',
  pensamiento_social: 'Sociales: normas y convivencia',
  dialogo: 'Inglés: comprensión de diálogos',
  aviso: 'Inglés: avisos e instrucciones',
  cloze: 'Inglés: gramática en contexto',
  vocabulario: 'Inglés: vocabulario en contexto',
  lectura: 'Inglés: comprensión de lectura',
  grammar: 'Inglés: gramática'
};

function limpio(t) {
  return String(t || '').replace(/\s+/g, ' ').trim();
}

function corta(t, n) {
  const s = limpio(t);
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trim() + '…';
}

function crudo(op) {
  return String(op || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
}

function areaDe(item) {
  return String((item && (item.area || item.area_general || item.materia)) || '').toLowerCase();
}

function subDe(item) {
  return String((item && (item.sub || item.sub_competencia)) || '').toLowerCase().trim();
}

export function pistaEsDebil(pista) {
  const p = limpio(pista);
  if (!p) return true;
  if (PISTA_DEBIL.test(p)) return true;
  if (/^Lee /i.test(p) && p.length < 50) return true;
  return false;
}

function pideElEnunciado(item) {
  const t = limpio(item.pregunta_texto || item.texto || item.enunciado);
  if (!t) return '';
  const marca = t.match(/¿[^?]{8,180}\?/);
  if (marca) return marca[0];
  return corta(t, 160);
}

function metodoDe(item) {
  const pide = pideElEnunciado(item);
  if (pide) return `La pregunta dice: ${pide}`;
  return 'Responde exactamente lo que pide este enunciado.';
}

function tipDescarte() {
  return 'Si la opción habla de otro caso, otra cifra u otra norma, no es la respuesta.';
}

function esJustifDebil(razon) {
  const r = limpio(razon);
  if (!r) return true;
  if (r.length < 48) return true;
  if (/no (responde|cierra|es (lo|la)|sirve)|no es (correcta|válida)|opción incorrecta/i.test(r) && r.length < 90) {
    return true;
  }
  if (/^«[^»]{1,80}» no (responde|es lo que pide)/i.test(r) && !/porque|error|olvid|sumaste|restaste|confund|mezcl|omit|invert/i.test(r)) {
    return true;
  }
  return false;
}

function trampaDeOpcion(item, letra) {
  const lista = Array.isArray(item && item.trampas) ? item.trampas : [];
  const L = String(letra || '').toUpperCase();
  return lista.find((t) => String((t && (t.opcion || t.letra)) || '').toUpperCase() === L) || null;
}

function errorTipicoPorTrampa(trampa, sub) {
  if (!trampa || typeof trampa !== 'object') return '';
  if (trampa.vulnera_omision_conversion) {
    return 'Es un error típico de unidades: olvidaste convertir (minutos↔segundos, horas↔minutos, cm↔m, %↔decimal) antes de operar.';
  }
  if (trampa.vulnera_inversion_operacional) {
    return 'Invertiste la operación o la razón (dividiste cuando tocaba multiplicar, o al revés).';
  }
  if (trampa.vulnera_heuristica_lineal) {
    return 'Caíste en una proporción “a ojo”: sumaste o restaste cantidades en vez de usar la razón o el porcentaje correcto.';
  }
  if (trampa.vulnera_error_geometrico) {
    return 'Mezclaste perímetro, área o volumen, o usaste una medida que no pide el enunciado.';
  }
  if (/fraccion|proporcional|aritmet/i.test(sub)) {
    return 'Es un error de procedimiento aritmético: revisa denominadores, conversiones y el orden de las operaciones.';
  }
  return '';
}

function errorTipicoPorTexto(mala, bien, sub, area) {
  const m = limpio(mala).toLowerCase();
  const b = limpio(bien).toLowerCase();
  if (/\/\d|\d\/\d|fracción|fraccion/.test(m + b) || /fraccion/.test(sub)) {
    if (/\+/.test(m) || /sum/.test(m)) {
      return 'Error típico: sumaste numeradores y denominadores por separado, en vez de llevar ambas fracciones al mismo denominador.';
    }
    return 'Error típico con fracciones: no igualaste denominadores o confundiste la fracción con el entero que aparece en el enunciado.';
  }
  if (/%|por\s*cien|iva|descuento/.test(m + b) || /aritmet|proporcional/.test(sub)) {
    if (/sum|resta|\+|-/.test(m) && /%/.test(b + m)) {
      return 'Error típico: trataste el porcentaje como si fuera una cantidad fija (sumaste o restaste el número del %) en vez de calcularlo sobre la base.';
    }
    return 'Error típico de porcentaje: no convertiste el % a decimal o lo aplicaste sobre la base equivocada.';
  }
  if (/hora|minuto|segundo|km\/h|m\/s/.test(m + b)) {
    return 'Error típico de unidades: olvidaste convertir el tiempo o la magnitud a la misma unidad antes de calcular.';
  }
  if (/pendiente|resbaladiz|ad\s*hominem|autoridad|analog/.test(m) || /argument/.test(sub)) {
    return 'Error típico de lectura: confundiste el tipo de falacia o la conclusión con una premisa que el texto no sostiene.';
  }
  if (/inferen|implica|sugiere/.test(sub) || area.includes('lect')) {
    return 'Error típico: elegiste algo plausible, pero que el texto no afirma ni permite inferir con seguridad.';
  }
  if (area.includes('cien')) {
    return 'Error típico: mezclaste conceptos cercanos (causa/efecto, proceso/resultado o unidades del fenómeno).';
  }
  if (area.includes('social')) {
    return 'Error típico: confundiste la norma, la competencia o el mecanismo con otro parecido del enunciado.';
  }
  if (area.includes('ingl')) {
    return 'Error típico: la forma gramatical o el vocabulario suena familiar, pero no encaja con el tiempo o la estructura que pide la oración.';
  }
  return '';
}

function porqueIncorrecta(mala, bien, ctx) {
  const izq = corta(crudo(mala), 90);
  const der = corta(crudo(bien), 90);
  const item = (ctx && ctx.item) || {};
  const letra = (ctx && ctx.letra) || '';
  const sub = subDe(item);
  const area = areaDe(item);
  const tipTrampa = errorTipicoPorTrampa(trampaDeOpcion(item, letra), sub);
  const tipTexto = tipTrampa || errorTipicoPorTexto(izq, der, sub, area);
  if (tipTexto) {
    return `«${izq}» es un distractor. ${tipTexto} La opción que sí responde es «${der}».`;
  }
  return `«${izq}» no responde lo pedido porque no cumple la condición o el cálculo del enunciado. La opción correcta es «${der}».`;
}

function temaDe(item) {
  const sub = subDe(item);
  if (item.tema_a_estudiar) return limpio(item.tema_a_estudiar);
  if (TEMA_SUB[sub]) return TEMA_SUB[sub];
  const repaso = limpio(item.repaso);
  if (repaso && !/^(matem[aá]ticas|lectura|ciencias|sociales|ingl[eé]s)$/i.test(repaso)) return repaso;
  const area = areaDe(item);
  if (area.includes('mate')) return 'Matemáticas: el procedimiento que pide esta pregunta';
  if (area.includes('lect')) return 'Lectura crítica: el tipo de lectura que pide esta pregunta';
  if (area.includes('cien') || area.includes('natur')) return 'Ciencias naturales: el proceso del caso';
  if (area.includes('social')) return 'Sociales y ciudadanas: el caso o la norma del enunciado';
  if (area.includes('ingl')) return 'Inglés: la estructura o el vocabulario de esta pregunta';
  return 'El tema concreto de esta pregunta';
}

function letraCorrecta(item) {
  return String(item.correcta || item.ok || '').trim().toUpperCase().slice(0, 1);
}

function opcionesDe(item) {
  const opts = item.opciones_respuesta || item.opciones || [];
  return Array.isArray(opts) ? opts : [];
}

function textoOpcion(opts, letra) {
  const idx = 'ABCD'.indexOf(String(letra || '').toUpperCase());
  if (idx < 0 || !opts[idx]) return '';
  return crudo(opts[idx]);
}

function mapaRazones(item) {
  const out = {};
  const opts = opcionesDe(item);
  const clave = letraCorrecta(item);
  const bien = textoOpcion(opts, clave) || crudo(item.correcta);
  const prevTexto = item.razonesPorTexto && typeof item.razonesPorTexto === 'object' ? item.razonesPorTexto : {};
  const prevLetra = item.justificacion_opciones && typeof item.justificacion_opciones === 'object'
    ? item.justificacion_opciones
    : {};

  opts.forEach((op, i) => {
    const letra = 'ABCD'[i];
    if (!letra || letra === clave) return;
    const texto = crudo(op);
    let razon = limpio(prevLetra[letra]) || limpio(prevTexto[texto]) || limpio(prevTexto[op]);
    if (esJustifDebil(razon) || pistaEsDebil(razon)) {
      razon = porqueIncorrecta(texto, bien, { item, letra });
    }
    out[letra] = razon;
    if (texto) out[texto] = razon;
  });
  return out;
}

export function generarAyudaAnalitica(item) {
  const opts = opcionesDe(item);
  const clave = letraCorrecta(item);
  const bien = textoOpcion(opts, clave);
  const metodo = metodoDe(item);
  const tip = tipDescarte(item);
  const pista = `${metodo} ${tip}`.replace(/\s+/g, ' ').trim();
  const frase = bien
    ? `Correcto: «${corta(bien, 120)}» responde exactamente lo que pide el enunciado.`
    : 'Correcto: esa opción responde lo que pide el enunciado.';
  const explicacion_correcta = bien
    ? `La respuesta es «${corta(bien, 140)}». ${metodo}`
    : `La respuesta correcta es ${clave || 'la opción válida'}. ${metodo}`;
  const tema = temaDe(item);
  const razonesMap = mapaRazones(item);
  const razonesPorTexto = {};
  opts.forEach((op, i) => {
    const letra = 'ABCD'[i];
    if (letra === clave) return;
    const texto = crudo(op);
    const razon = razonesMap[letra] || razonesMap[texto];
    if (texto && razon) razonesPorTexto[texto] = razon;
  });
  const justificacion_opciones = {};
  'ABCD'.split('').forEach((L) => {
    if (L === clave) return;
    if (razonesMap[L]) justificacion_opciones[L] = razonesMap[L];
  });
  return {
    pista,
    frase_acierto: frase,
    repaso: tema,
    tema_a_estudiar: tema,
    explicacion_correcta,
    razonesPorTexto,
    justificacion_opciones
  };
}

/**
 * Enriquece un ítem: reemplaza pista débil y completa campos de boletín.
 */
function alinearExplicacionCorrecta(item, ayuda) {
  const clave = letraCorrecta(item);
  const existente = limpio(item.explicacion_correcta) || limpio(item.explicacion_detallada);
  if (!existente) return ayuda.explicacion_correcta;
  if (PISTA_DEBIL.test(existente)) return ayuda.explicacion_correcta;
  const marca = existente.match(/respuesta correcta es\s*([A-D])/i);
  if (marca && marca[1].toUpperCase() !== clave) return ayuda.explicacion_correcta;
  return existente;
}

export function enriquecerAyudaItem(item) {
  if (!item || typeof item !== 'object') return item;
  const ayuda = generarAyudaAnalitica(item);
  const pistaActual = limpio(item.pista);
  const necesitaPista = pistaEsDebil(pistaActual);
  const razones = (item.razonesPorTexto && Object.keys(item.razonesPorTexto).length)
    ? item.razonesPorTexto
    : ayuda.razonesPorTexto;
  const justif = (item.justificacion_opciones && Object.keys(item.justificacion_opciones).length)
    ? item.justificacion_opciones
    : ayuda.justificacion_opciones;

  // Prioridad: justificación específica del ítem si es fuerte; si es débil, la analítica.
  const justifFinal = {};
  const razonesFinal = { ...ayuda.razonesPorTexto };
  'ABCD'.split('').forEach((L) => {
    if (L === letraCorrecta(item)) return;
    const prev = limpio(justif && justif[L]);
    const gen = limpio(ayuda.justificacion_opciones && ayuda.justificacion_opciones[L]);
    justifFinal[L] = esJustifDebil(prev) ? (gen || prev) : prev;
  });
  Object.keys(razones).forEach((k) => {
    const prev = limpio(razones[k]);
    if (!esJustifDebil(prev)) razonesFinal[k] = prev;
  });
  Object.keys(justifFinal).forEach((L) => {
    const texto = textoOpcion(opcionesDe(item), L);
    if (texto && justifFinal[L]) razonesFinal[texto] = justifFinal[L];
  });
  const tema = limpio(item.tema_a_estudiar) || limpio(item.repaso) || ayuda.tema_a_estudiar;

  return {
    ...item,
    pista: necesitaPista ? ayuda.pista : pistaActual,
    frase_acierto: limpio(item.frase_acierto) || ayuda.frase_acierto,
    repaso: tema,
    tema_a_estudiar: tema,
    explicacion_correcta: alinearExplicacionCorrecta(item, ayuda),
    explicacion_incorrecta: limpio(item.explicacion_incorrecta) || '',
    razonesPorTexto: razonesFinal,
    justificacion_opciones: justifFinal
  };
}

export { TEMA_SUB, esJustifDebil };
