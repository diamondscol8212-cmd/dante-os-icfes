const PROHIBIDO = /anatom[ií]a del error|distract|\btrampas?\b/i;

const REPASA = {
  algebra: 'Álgebra',
  geometria: 'Geometría',
  estadistica: 'Estadística',
  probabilidad: 'Probabilidad',
  proporcionalidad: 'Proporcionalidad',
  aritmetica: 'Aritmética',
  funciones: 'Funciones',
  trigonometria: 'Trigonometría',
  argumentacion: 'Lectura: argumentos',
  filosofia: 'Lectura: ideas',
  pragmatica: 'Lectura: intención',
  semantica: 'Lectura: significado',
  literatura: 'Lectura: el relato',
  inferencia: 'Lectura: inferencia',
  comprension_literal: 'Lectura: dato explícito',
  dos_textos: 'Lectura: comparar textos',
  textos_discontinuos: 'Lectura: tablas y avisos',
  biologia: 'Biología',
  fisica: 'Física',
  quimica: 'Química',
  indagacion: 'Ciencias: indagación',
  cts: 'Ciencias: el caso',
  geografia: 'Geografía de Colombia',
  constitucion: 'Constitución',
  historia: 'Historia de Colombia',
  pensamiento_critico: 'Sociales: fuentes',
  participacion: 'Sociales: participación',
  competencias_ciudadanas: 'Sociales: el caso',
  dialogo: 'Inglés: diálogo',
  aviso: 'Inglés: avisos',
  cloze: 'Inglés: gramática',
  vocabulario: 'Inglés: vocabulario',
  lectura: 'Inglés: lectura',
  grammar: 'Inglés: gramática'
};

function areaDe(item) {
  return String((item && (item.area || item.area_general)) || '').toLowerCase();
}

export function esSemillaEscrita(item) {
  const id = String((item && item.id) || '');
  if (!id || /_gen_/.test(id) || id.startsWith('item_ap_')) return false;
  const examen = String((item && item.target_exam) || 'SABER_11').toUpperCase();
  if (examen.includes('UNAL') || examen.includes('PRO') || examen.includes('DOCENTE')) return false;
  return /mate|lect|cien|natur|ingl|social/.test(areaDe(item));
}

function crudo(opcion) {
  return String(opcion || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
}

function bonito(opcion) {
  return crudo(opcion)
    .replace(/\$/g, '')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}^_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function corta(texto, tope) {
  const limpio = String(texto || '').replace(/\s+/g, ' ').trim();
  if (limpio.length <= tope) return limpio;
  return limpio.slice(0, tope - 1).trim() + '…';
}

function sinProhibido(texto) {
  return String(texto || '').replace(PROHIBIDO, ' ').replace(/\s+/g, ' ').trim();
}

function quitar(base, pieza) {
  const limpia = String(pieza || '').replace(/\s+/g, ' ').trim();
  if (limpia.length < 4) return base;
  const patron = limpia.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return base.replace(new RegExp(patron, 'gi'), ' ');
}

function senalDe(texto, correcta) {
  let base = String(texto || '').replace(/\s+/g, ' ').trim();
  base = quitar(base, crudo(correcta));
  base = quitar(base, bonito(correcta));
  base = sinProhibido(base);
  if (base.length < 24) return corta(sinProhibido(String(texto || '')), 120);
  return corta(base, 140);
}

function metodoDe(area) {
  if (area.includes('mate')) return 'Arma la relación con los datos y las unidades. Un número que solo suma, o que olvida convertir, no cierra.';
  if (area.includes('lect')) return 'Quédate con lo que el texto sostiene. Una opción puede sonar bien y decir otra cosa.';
  if (area.includes('cien') || area.includes('natur')) return 'Nombra el proceso o el dato que la pregunta pide. No cambies la variable ni el resultado.';
  if (area.includes('social')) return 'Sitúa el lugar, la fecha o la norma del caso. Otro parecido no lo reemplaza.';
  if (area.includes('ingl')) return 'Responde con lo que dice el texto en inglés. Otra hora, otra palabra o otro sentido no está escrito.';
  return 'Lee qué pide la pregunta y contrástalo con el enunciado.';
}

function porque(area, mala, bien) {
  const izquierda = corta(bonito(mala), 110);
  const derecha = corta(bonito(bien), 110);
  if (area.includes('mate')) {
    return `«${izquierda}» no cierra la relación con los datos. La cuenta que sí cuadra es «${derecha}».`;
  }
  if (area.includes('lect')) {
    return `«${izquierda}» no se sostiene en el texto. Lo que el texto sí sostiene es «${derecha}».`;
  }
  if (area.includes('cien') || area.includes('natur')) {
    return `«${izquierda}» cambia el proceso o el dato del caso. Lo que corresponde es «${derecha}».`;
  }
  if (area.includes('social')) {
    return `«${izquierda}» nombra otro hecho, lugar o norma. En este caso corresponde «${derecha}».`;
  }
  if (area.includes('ingl')) {
    return `«${izquierda}» no es lo que dice el texto. El texto dice «${derecha}».`;
  }
  return `«${izquierda}» no responde lo pedido. Lo que sí responde es «${derecha}».`;
}

function repasoDe(item, area) {
  const sub = String(item.sub || item.sub_competencia || '').toLowerCase();
  if (REPASA[sub]) return REPASA[sub];
  if (area.includes('mate')) return 'Matemáticas';
  if (area.includes('lect')) return 'Lectura crítica';
  if (area.includes('cien') || area.includes('natur')) return 'Ciencias naturales';
  if (area.includes('social')) return 'Sociales y ciudadanas';
  if (area.includes('ingl')) return 'Inglés';
  return 'esta área';
}

export function ayudaDeSemilla(item) {
  if (!esSemillaEscrita(item)) return null;
  const area = areaDe(item);
  const opciones = item.opciones || item.opciones_respuesta || [];
  if (!Array.isArray(opciones) || opciones.length < 4) return null;
  const letra = String(item.ok || item.correcta || '').trim().toUpperCase();
  const idx = 'ABCD'.indexOf(letra);
  if (idx < 0 || !opciones[idx]) return null;
  const bien = crudo(opciones[idx]);
  if (!bien) return null;
  const razones = {};
  opciones.forEach((opcion, i) => {
    if (i === idx) return;
    const clave = crudo(opcion);
    if (!clave || razones[clave]) return;
    razones[clave] = sinProhibido(porque(area, clave, bien));
  });
  if (Object.keys(razones).length !== 3) return null;
  const pista = sinProhibido(`${metodoDe(area)} Fíjate en: ${senalDe(item.texto || item.pregunta_texto, bien)}`);
  const frase = sinProhibido(`Lo que pedía la pregunta queda en «${corta(bonito(bien), 110)}».`);
  const repaso = repasoDe(item, area);
  if (!pista || !frase || PROHIBIDO.test(pista) || PROHIBIDO.test(frase) || PROHIBIDO.test(repaso)) return null;
  return { pista, frase, repaso, razones };
}
