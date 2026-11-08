/**
 * Enriquecimiento de pistas y explicaciones del banco.
 * Sustituye plantillas del tipo «Fíjate en: [enunciado]» por análisis útil
 * y garantiza campos para el boletín: explicacion_incorrecta / correcta / tema_a_estudiar.
 */

const PISTA_DEBIL = /F[ií]jate en:|Lee qu[eé] pide la pregunta|contr[aá]stalo con el enunciado|Arma la relaci[oó]n con los datos y las unidades\. Un n[uú]mero que solo suma/i;

const METODO_SUB = {
  probabilidad: 'Identifica el espacio muestral y cuenta solo los casos favorables que pide la pregunta.',
  estadistica: 'Elige el resumen correcto (media, mediana, moda, rango o percentil) y aplica su definición, no otra.',
  algebra: 'Plantea la ecuación o la relación con la incógnita y despeja paso a paso; no mezcles operaciones.',
  geometria: 'Identifica la figura y la medida pedida (lado, área, perímetro, volumen o ángulo) antes de usar la fórmula.',
  funciones: 'Lee la regla o la tabla: qué entra (x) y qué sale (y). Sustituye sin cambiar la operación.',
  proporcionalidad: 'Decide si la razón es directa o inversa y arma la proporción con las mismas unidades.',
  aritmetica: 'Respeta el orden de operaciones y convierte unidades antes de calcular.',
  trigonometria: 'Separa cateto opuesto, adyacente e hipotenusa según el ángulo que nombra la pregunta.',
  dos_textos: 'Lee cada texto por separado; la respuesta une lo que ambos sostienen, sin inventar un hecho nuevo.',
  textos_discontinuos: 'Saca el dato de la tabla, el aviso o la gráfica. Si no está escrito, no lo completes.',
  argumentacion: 'Separa premisa y conclusión. Descarta la opción que salta más allá de lo que permiten los datos.',
  inferencia: 'Quédate solo con lo que se puede sostener; no agregues un hecho que el texto no dice.',
  filosofia: 'Nombra la idea ética o el principio que el caso está usando, no un lema genérico.',
  pragmatica: 'Pregúntate para qué se dice esa frase en esa situación concreta.',
  semantica: 'Elige el sentido que pide el contexto, no otro significado de la misma palabra.',
  literatura: 'Reconoce el recurso o la parte del relato; no lo leas como un dato literal del mundo.',
  comprension_literal: 'La respuesta está dicha en el texto. Búscala; no la calcules ni la interpretes de más.',
  indagacion: 'Separa pregunta, hipótesis, variable y conclusión: cada una tiene su lugar.',
  fisica: 'Identifica la magnitud y la relación (fuerza, energía, movimiento). Una cuenta distinta da otro número.',
  quimica: 'Distingue mezcla, cambio físico y reacción. El nombre tiene que coincidir con el caso.',
  biologia: 'Ubica la estructura o el proceso en el ser vivo del enunciado.',
  geografia: 'Sitúa el lugar o el fenómeno en el mapa de Colombia antes de marcar.',
  constitucion: 'La pregunta pide la rama, el derecho o el mecanismo concreto. No lo cambies por uno parecido.',
  historia: 'Ata el hecho a su fecha y a su proceso. Otro hito no lo reemplaza.',
  pensamiento_critico: 'Una prueba tiene que poder verificarse. Un salto a «todos» o «siempre» queda corto.',
  interpretacion: 'Lee la leyenda, los ejes y la escala. La figura no dice más de lo que muestra.',
  participacion: 'El mecanismo de participación tiene un alcance. No lo vuelvas un poder que no tiene.',
  pensamiento_social: 'Una norma se puede exigir; una costumbre, no siempre.',
  dialogo: 'Responde con lo que los hablantes acaban de decir en el diálogo.',
  aviso: 'Copia la condición del aviso (hora, lugar, requisito). Otra no está escrita.',
  cloze: 'Mira el sujeto, el tiempo verbal y la palabra justo antes del hueco.',
  vocabulario: 'Elige el sentido de esa palabra en esta frase, no uno cercano.',
  lectura: 'La respuesta tiene que salir de la frase leída, no de otra idea.',
  grammar: 'Ajusta la forma verbal o la preposición al sujeto y al tiempo de la oración.'
};

const TEMA_SUB = {
  probabilidad: 'Probabilidad y conteo de casos',
  estadistica: 'Estadística descriptiva (media, mediana, moda, rango)',
  algebra: 'Álgebra: ecuaciones y despeje',
  geometria: 'Geometría: figuras, áreas y medidas',
  funciones: 'Funciones y representación',
  proporcionalidad: 'Proporcionalidad directa e inversa',
  aritmetica: 'Aritmética y orden de operaciones',
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

function metodoDe(item) {
  const sub = subDe(item);
  if (METODO_SUB[sub]) return METODO_SUB[sub];
  const area = areaDe(item);
  if (area.includes('mate')) return 'Identifica qué operación o relación pide el enunciado y usa solo los datos necesarios.';
  if (area.includes('lect')) return 'Quédate con lo que el texto sostiene; descarta lo que suena bien pero no está dicho.';
  if (area.includes('cien') || area.includes('natur')) return 'Nombra el proceso o la magnitud que la pregunta pide; no cambies la variable.';
  if (area.includes('social')) return 'Sitúa el hecho, el lugar o la norma del caso; un parecido no lo reemplaza.';
  if (area.includes('ingl')) return 'Responde con lo que dice el texto en inglés; otra hora, palabra o sentido no está escrito.';
  return 'Identifica qué pide exactamente la pregunta y contrástalo con cada opción.';
}

function tipDescarte(item) {
  const area = areaDe(item);
  if (area.includes('mate')) return 'Descarta el distractor que suma cuando hay que multiplicar, o que olvida una conversión.';
  if (area.includes('lect')) return 'Descarta la opción que generaliza («todos», «siempre») o niega un dato del texto.';
  if (area.includes('cien') || area.includes('natur')) return 'Descarta la opción que cambia la causa, la variable o el resultado del experimento.';
  if (area.includes('social')) return 'Descarta la opción que nombra otra institución, fecha o norma distinta a la del caso.';
  if (area.includes('ingl')) return 'Descarta la forma verbal o la preposición que no concuerda con el sujeto o el tiempo.';
  return 'Descarta la opción que responde otra pregunta o cambia el alcance del caso.';
}

function porqueIncorrecta(mala, bien, area) {
  const izq = corta(crudo(mala), 100);
  const der = corta(crudo(bien), 100);
  const m = izq.toLowerCase();
  if (/siempre|todos|toda|ninguno|nada|imposible/.test(m)) {
    return `«${izq}» generaliza o niega de más. En este caso la respuesta que sí cuadra es «${der}».`;
  }
  if (area.includes('mate')) {
    return `«${izq}» no cierra la relación con los datos del enunciado. La cuenta que sí responde es «${der}».`;
  }
  if (area.includes('lect')) {
    return `«${izq}» no se sostiene en el texto. Lo que el texto sí sostiene es «${der}».`;
  }
  if (area.includes('cien') || area.includes('natur')) {
    return `«${izq}» cambia el proceso o el dato del caso. Lo que corresponde es «${der}».`;
  }
  if (area.includes('social')) {
    return `«${izq}» nombra otro hecho, lugar o norma. En este caso corresponde «${der}».`;
  }
  if (area.includes('ingl')) {
    return `«${izq}» no es lo que dice o pide el texto. La forma correcta es «${der}».`;
  }
  return `«${izq}» no responde lo pedido. La opción adecuada es «${der}».`;
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
  const area = areaDe(item);
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
    if (!razon || pistaEsDebil(razon) || /no responde lo pedido/i.test(razon) && razon.length < 60) {
      razon = porqueIncorrecta(texto, bien, area);
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
  const area = areaDe(item);
  const metodo = metodoDe(item);
  const tip = tipDescarte(item);
  const pista = `${metodo} ${tip}`.replace(/\s+/g, ' ').trim();
  const frase = bien
    ? `Correcto: «${corta(bien, 120)}» responde exactamente lo que pide el enunciado.`
    : 'Correcto: esa opción responde lo que pide el enunciado.';
  const explicacion_correcta = bien
    ? `La respuesta correcta es ${clave || ''}${clave ? ' — ' : ''}«${corta(bien, 140)}». ${metodo}`
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

  // Fusionar razones por letra si faltan (prioridad: específicas del ítem)
  const justifFinal = { ...ayuda.justificacion_opciones, ...justif };
  const razonesFinal = { ...ayuda.razonesPorTexto, ...razones };
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
