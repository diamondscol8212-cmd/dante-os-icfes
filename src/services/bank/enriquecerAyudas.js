/**
 * Enriquecimiento de pistas y explicaciones del banco.
 * Sustituye plantillas del tipo «Fíjate en: [enunciado]» por análisis útil
 * y garantiza campos para el boletín: explicacion_incorrecta / correcta / tema_a_estudiar.
 */

const PISTA_DEBIL = /F[ií]jate en:|Lee qu[eé] pide la pregunta|contr[aá]stalo con el enunciado|Arma la relaci[oó]n con los datos y las unidades\. Un n[uú]mero que solo suma|Una norma se puede exigir|Separa premisa y conclusi[oó]n|no se sostiene en el texto|nombra otro hecho, lugar o norma/i;

/** Títulos canónicos por sub_competencia (id de Temas de refuerzo). */
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
  combinatoria: 'Combinatoria y conteo de arreglos',
  dos_textos: 'Lectura crítica: comparar dos textos',
  textos_discontinuos: 'Lectura de tablas, avisos y gráficas',
  argumentacion: 'Lectura crítica: argumentos y conclusiones',
  inferencia: 'Lectura crítica: inferencias válidas',
  filosofia: 'Lectura: ideas éticas y filosóficas',
  pragmatica: 'Lectura: intención comunicativa',
  semantica: 'Lectura: significado en contexto',
  literatura: 'Lectura: recursos literarios',
  comprension_literal: 'Lectura: comprensión literal',
  articulacion_global: 'Lectura: articulación global del texto',
  evaluacion_critica: 'Lectura: evaluación crítica',
  analisis_textual: 'Lectura: análisis textual',
  analisis_imagen: 'Lectura de imágenes y recursos visuales',
  indagacion: 'Ciencias: indagación científica',
  fisica: 'Física: magnitudes y relaciones',
  quimica: 'Química: cambios y reacciones',
  biologia: 'Biología: estructuras y procesos',
  cts: 'Ciencia, tecnología y sociedad',
  geografia: 'Geografía de Colombia: regiones, relieve y clima',
  hidrografia_colombia: 'Hidrografía de Colombia: ríos, afluentes y cuencas',
  constitucion: 'Constitución Política y organización del Estado',
  historia: 'Historia de Colombia: independencia y siglo XX',
  pensamiento_critico: 'Sociales: fuentes y evidencias',
  interpretacion: 'Sociales: lectura de gráficos y mapas',
  interpretacion_y_analisis: 'Sociales: interpretación y análisis de perspectivas',
  participacion: 'Ciudadanía: mecanismos de participación',
  pensamiento_social: 'Sociales: normas y convivencia',
  pensamiento_sistemico: 'Sociales: pensamiento sistémico',
  competencias_ciudadanas: 'Competencias ciudadanas',
  dialogo: 'Inglés: comprensión de diálogos',
  dialogues: 'Inglés: comprensión de diálogos',
  aviso: 'Inglés: avisos e instrucciones',
  signs_notices: 'Inglés: avisos e instrucciones',
  cloze: 'Inglés: gramática en contexto',
  lexical_cloze: 'Inglés: gramática en contexto',
  vocabulario: 'Inglés: vocabulario en contexto',
  vocabulary: 'Inglés: vocabulario en contexto',
  lectura: 'Inglés: comprensión de lectura',
  reading_comprehension: 'Inglés: comprensión de lectura',
  literal_reading: 'Inglés: lectura literal',
  inferential_reading: 'Inglés: lectura inferencial',
  grammar: 'Inglés: gramática',
  grammar_reading: 'Inglés: gramática y lectura',
  calculo_limites: 'Cálculo: límites y tendencia de funciones',
  aptitud_numerica_docente: 'Aptitud numérica para docentes',
  aptitud_pedagogica: 'Aptitud pedagógica y decisiones de aula'
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
  if (p.length < 48) return true;
  if (PISTA_DEBIL.test(p)) return true;
  if (/^Lee /i.test(p) && p.length < 50) return true;
  return false;
}

export function temaEsDebil(tema) {
  const s = limpio(tema);
  if (!s) return true;
  // Títulos canónicos del catálogo no son débiles aunque sean cortos.
  const canon = Object.values(TEMA_SUB).some((t) => limpio(t).toLowerCase() === s.toLowerCase());
  if (canon) return false;
  if (s.length < 22) return true;
  if (/^(f[ií]sica|biolog[ií]a|qu[ií]mica|probabilidad|gram[aá]tica|aritm[eé]tica|geometr[ií]a|[aá]lgebra|estad[ií]stica|historia|geograf[ií]a|vocabulario|lectura|ingl[eé]s)$/i.test(s)) {
    return true;
  }
  if (/el caso o la norma|la estructura o el vocabulario de esta pregunta|el procedimiento que pide|el tipo de lectura|el proceso del caso|el tema concreto/i.test(s)) {
    return true;
  }
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
  if (r.length < 55) return true;
  if (/no cumple la condici[oó]n o el c[aá]lculo del enunciado/i.test(r)) return true;
  if (/responde (a )?otra pregunta|usa solo una parte de la informaci[oó]n|lo que se ped[ií]a es/i.test(r)
      && !/cuenca|afluente|desemboc|macizo|complemento|numerador|pendiente|falacia|gradiente/i.test(r)) {
    return true;
  }
  if (/no (responde|cierra|es (lo|la)|sirve)|no es (correcta|v[aá]lida)|opci[oó]n incorrecta/i.test(r) && r.length < 110) {
    return true;
  }
  if (/^«[^»]{1,90}» no (responde|es lo que pide)/i.test(r)
      && !/porque|error|olvid|sumaste|restaste|confund|mezcl|omit|invert|producto|uni[oó]n|complemento|cuenca|afluente|desemboc/i.test(r)) {
    return true;
  }
  return false;
}

function trampaDeOpcion(item, letra) {
  const lista = Array.isArray(item && item.trampas) ? item.trampas : [];
  const L = String(letra || '').toUpperCase();
  return lista.find((t) => String((t && (t.opcion || t.letra)) || '').toUpperCase() === L) || null;
}

function errorTipicoPorTrampa(trampa) {
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
  return '';
}

function numLike(s) {
  return /^-?\d+([.,]\d+)?%?$|^\$?\d/.test(limpio(s).replace(/\s/g, ''));
}

function errorTipicoPorTexto(mala, bien, sub, area, item) {
  const m = limpio(mala).toLowerCase();
  const b = limpio(bien).toLowerCase();
  const enunciado = limpio(item && (item.pregunta_texto || item.texto || item.enunciado)).toLowerCase();

  if (/probabil|azar|dado|carta|moneda|evento/.test(sub + enunciado) || sub === 'probabilidad') {
    if (numLike(mala) && numLike(bien)) {
      const nm = parseFloat(String(mala).replace(',', '.').replace(/[^\d.-]/g, ''));
      const nb = parseFloat(String(bien).replace(',', '.').replace(/[^\d.-]/g, ''));
      if (Number.isFinite(nm) && Number.isFinite(nb)) {
        if (Math.abs(nm + nb - 1) < 0.05) {
          return 'Error típico: confundiste el evento con su complemento (1 − p).';
        }
        if (Math.abs(nm - nb * nb) < 0.05 || Math.abs(nm - nb * 0.5) < 0.05) {
          return 'Error típico: multiplicaste o partiste mal las probabilidades (evento conjunto vs. simple).';
        }
      }
      return 'Error típico de probabilidad: usaste otro conteo de casos favorables/posibles o confundiste unión con intersección.';
    }
    return 'Error típico de probabilidad: no identificaste bien el espacio muestral o la regla (suma/producto) que aplica.';
  }

  if (/\/\d|\d\/\d|fracción|fraccion/.test(m + b + enunciado) || /fraccion/.test(sub)) {
    if (/\+/.test(m) || /sum/.test(m)) {
      return 'Error típico: sumaste numeradores y denominadores por separado, en vez de llevar ambas fracciones al mismo denominador.';
    }
    return 'Error típico con fracciones: no igualaste denominadores o confundiste la fracción con el entero del enunciado.';
  }

  if (/%|por\s*cien|iva|descuento/.test(m + b + enunciado) || /aritmet|proporcional/.test(sub)) {
    if (/sum|resta|\+|−|-/.test(m) && /%/.test(b + m + enunciado)) {
      return 'Error típico: trataste el porcentaje como cantidad fija (sumaste/restaste el número del %) en vez de calcularlo sobre la base.';
    }
    return 'Error típico de porcentaje o razón: no convertiste el % a decimal o lo aplicaste sobre la base equivocada.';
  }

  if (/hora|minuto|segundo|km\/h|m\/s/.test(m + b + enunciado)) {
    return 'Error típico de unidades: olvidaste convertir el tiempo o la magnitud a la misma unidad antes de calcular.';
  }

  if (/media|mediana|moda|rango|desviaci/.test(sub + enunciado) || sub === 'estadistica') {
    return 'Error típico de estadística: confundiste media, mediana o moda, o usaste el total en vez del promedio.';
  }

  if (/pendiente|resbaladiz|ad\s*hominem|autoridad|analog/.test(m) || /argument/.test(sub)) {
    return 'Error típico de lectura: confundiste el tipo de falacia o la conclusión con una premisa que el texto no sostiene.';
  }

  if (/inferen|implica|sugiere|evaluacion_critica|articulacion/.test(sub) || area.includes('lect')) {
    return 'Error típico: elegiste algo plausible, pero que el texto no afirma ni permite inferir con seguridad.';
  }

  if (area.includes('cien') || /fisica|quimica|biologia|indagacion|cts/.test(sub)) {
    return 'Error típico: mezclaste conceptos cercanos (causa/efecto, proceso/resultado, o la magnitud que no pide el caso).';
  }

  if (/afluente|cuenca|macizo colombiano|desemboca|r[ií]o (cauca|magdalena)|hidrograf/.test(enunciado + sub)
      || sub === 'hidrografia_colombia' || sub === 'geografia') {
    if (/amazonas/.test(m) && /cauca|magdalena|afluente/.test(enunciado + b)) {
      return 'Error típico de hidrografía: ubicaste el río en la cuenca del Amazonas; el Cauca aporta al Magdalena (Caribe).';
    }
    if (/orinoco/.test(m) && /cauca|magdalena|afluente/.test(enunciado + b)) {
      return 'Error típico: el Orinoco drena los Llanos; no es la cuenca del sistema Magdalena-Cauca.';
    }
    if (/pac[ií]fico/.test(m) && /caribe|magdalena|desemboca/.test(enunciado + b)) {
      return 'Error típico: el Magdalena desemboca en el Caribe, no en el Pacífico.';
    }
    if (/mediterr|titicaca/.test(m)) {
      return 'Error típico: esa cuenca o cuerpo de agua no pertenece al sistema hidrográfico colombiano del enunciado.';
    }
    if (/afluente|cuenca|desemboca|macizo|r[ií]o/.test(enunciado)) {
      return 'Error típico de hidrografía/geografía: confundiste afluente, cuenca o desembocadura con otro río o vertiente.';
    }
  }

  if (area.includes('social') || /pensamiento_|constitucion|historia|geografia|ciudadan|hidrograf/.test(sub)) {
    return 'Error típico: confundiste la norma, el hecho histórico, la región o el mecanismo institucional con otro parecido del enunciado.';
  }

  if (area.includes('ingl') || /grammar|vocab|dialog|cloze|reading|aviso|sign/.test(sub)) {
    return 'Error típico: la forma gramatical o el vocabulario suena familiar, pero no encaja con el tiempo o la estructura que pide la oración.';
  }

  if (numLike(mala) && numLike(bien)) {
    const nm = parseFloat(String(mala).replace(',', '.').replace(/[^\d.-]/g, ''));
    const nb = parseFloat(String(bien).replace(',', '.').replace(/[^\d.-]/g, ''));
    if (Number.isFinite(nm) && Number.isFinite(nb) && nb !== 0) {
      if (Math.abs(nm - nb * 2) < 0.05 || Math.abs(nm - nb / 2) < 0.05) {
        return 'Error típico de cálculo: duplicaste o partiste a la mitad el valor correcto al operar.';
      }
      if (Math.abs(nm + nb) < 0.05 || Math.abs(Math.abs(nm) - Math.abs(nb)) < 0.05 && nm * nb < 0) {
        return 'Error típico: invertiste el signo o restaste cuando debías sumar (o al revés) al despejar.';
      }
    }
    if (/algebra|despej|ecuaci/.test(sub + enunciado)) {
      return 'Error típico de álgebra: al despejar sumaste, restaste o multiplicaste mal el término con la variable.';
    }
    return 'Error típico de cálculo: operaste con los datos visibles pero omitiste un paso, una conversión o la pregunta exacta.';
  }

  return 'Error típico: elegiste un distractor cercano que no cumple la relación, la definición o el dato que pide el enunciado.';
}

function porqueIncorrecta(mala, bien, ctx) {
  const izq = corta(crudo(mala), 90);
  const der = corta(crudo(bien), 90);
  const item = (ctx && ctx.item) || {};
  const letra = (ctx && ctx.letra) || '';
  const sub = subDe(item);
  const area = areaDe(item);
  const tipTrampa = errorTipicoPorTrampa(trampaDeOpcion(item, letra));
  const tipTexto = tipTrampa || errorTipicoPorTexto(izq, der, sub, area, item);
  return `«${izq}» es un distractor. ${tipTexto} La opción que sí responde es «${der}».`;
}

/**
 * Id de cartilla de Temas de refuerzo (contenido real del ítem).
 * Puede ser más específico que sub_competencia (p. ej. hidrografía dentro de geografía).
 */
export function temaRefuerzoDe(item) {
  // Cartilla 1:1 por pregunta (generada por scripts/generarCartillasPorPregunta.mjs).
  const itemId = limpio(item && (item.id || item.itemId || item.pregunta_id));
  if (itemId) {
    const qid = ('q_' + itemId.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')).slice(0, 100);
    const prevId = limpio(item.tema_refuerzo_id || item.temaRefuerzoId).toLowerCase();
    if (prevId && prevId === qid) return prevId;
    if (prevId && prevId.startsWith('q_')) return prevId;
    return qid;
  }

  const sub = subDe(item);
  const prevId = limpio(item.tema_refuerzo_id || item.temaRefuerzoId).toLowerCase();
  if (prevId && prevId.startsWith('q_')) return prevId;
  if (prevId && (TEMA_SUB[prevId] || prevId === 'fracciones')) return prevId;

  const texto = [
    item && (item.pregunta_texto || item.texto || item.enunciado),
    Array.isArray(item && (item.opciones_respuesta || item.opciones))
      ? (item.opciones_respuesta || item.opciones).map((o) => (typeof o === 'string' ? o : (o && o.texto) || '')).join(' ')
      : '',
    item && (item.tema_a_estudiar || item.repaso || '')
  ].join(' ').toLowerCase();

  if (sub === 'geografia') {
    if (
      /afluente|cuenca del|macizo colombiano|desemboca|nacen varios r[ií]os|el r[ií]o (cauca|magdalena)|r[ií]o cauca|r[ií]o magdalena/.test(texto)
      && /magdalena|cauca|orinoco|amazonas|r[ií]o/.test(texto)
    ) {
      return 'hidrografia_colombia';
    }
    return 'geografia';
  }

  if (sub === 'fracciones') return 'fracciones';
  if (/numerador|denominador/.test(texto)
      || (/\bfracci[oó]n(es)?\b/.test(texto) && !/fraccionar|fraccionamiento|petr[oó]leo/.test(texto))) {
    return 'fracciones';
  }

  if (TEMA_SUB[sub]) return sub;
  return sub || '';
}

function temaDe(item) {
  const sub = subDe(item);
  const refuerzoId = temaRefuerzoDe(item);
  if (refuerzoId && TEMA_SUB[refuerzoId]) return TEMA_SUB[refuerzoId];
  const prev = limpio(item.tema_a_estudiar) || limpio(item.repaso);
  if (prev && !temaEsDebil(prev)) return prev;
  if (TEMA_SUB[sub]) return TEMA_SUB[sub];
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

  const temaRefuerzoId = temaRefuerzoDe(item);
  const temaPrev = limpio(item.tema_a_estudiar) || limpio(item.repaso);
  // Si hay cartilla específica (p. ej. hidrografía), el título canónico manda.
  const temaCanonico = temaRefuerzoId && TEMA_SUB[temaRefuerzoId] ? TEMA_SUB[temaRefuerzoId] : '';
  const tema = temaCanonico || ((!temaEsDebil(temaPrev) ? temaPrev : null) || ayuda.tema_a_estudiar);

  return {
    ...item,
    pista: necesitaPista ? ayuda.pista : pistaActual,
    frase_acierto: limpio(item.frase_acierto) || ayuda.frase_acierto,
    repaso: tema,
    tema_a_estudiar: tema,
    tema_refuerzo_id: temaRefuerzoId || item.tema_refuerzo_id || subDe(item) || '',
    explicacion_correcta: alinearExplicacionCorrecta(item, ayuda),
    explicacion_incorrecta: limpio(item.explicacion_incorrecta) || '',
    razonesPorTexto: razonesFinal,
    justificacion_opciones: justifFinal
  };
}

export { TEMA_SUB, esJustifDebil };
