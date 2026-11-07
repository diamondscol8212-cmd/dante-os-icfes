/**
 * Fase 3 — Calidad del banco: inventario, metas por área, anti-_gen_ plantilla.
 * Preferir ítems escritos listos; el gen solo como piloto / relleno deduplicado.
 */

export const AREAS_SABER = [
  'matematicas',
  'lectura_critica',
  'ciencias_naturales',
  'ingles',
  'sociales_ciudadanas'
];

/** Meta mínima de ítems "listos para producción" (escritos completos) por área. */
export const META_LISTOS_POR_AREA = {
  matematicas: 250,
  lectura_critica: 250,
  ciencias_naturales: 200,
  ingles: 200,
  sociales_ciudadanas: 200
};

export const CALIBRACION_MIN_N = 30;

export function esGen(item) {
  return /_gen_/.test(String((item && item.id) || ''));
}

export function esEscrito(item) {
  return !esGen(item);
}

function textoDe(item) {
  return String((item && (item.pregunta_texto || item.texto || item.enunciado)) || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function opcionesDe(item) {
  const o = (item && (item.opciones_respuesta || item.opciones)) || [];
  return Array.isArray(o) ? o : [];
}

/**
 * Huella de plantilla: ignora números para detectar clones _gen_ del mismo molde.
 */
export function huellaPlantilla(item) {
  const t = textoDe(item)
    .toLowerCase()
    .replace(/\d[\d.,]*/g, '#')
    .replace(/cop\s*#/g, 'cop #')
    .slice(0, 140);
  const area = String((item && (item.area || item.area_general)) || '').toLowerCase();
  const sub = String((item && (item.sub || item.sub_competencia)) || '').toLowerCase();
  return `${area}|${sub}|${t}`;
}

export function esCompleto(item) {
  if (!item || !item.id) return false;
  const texto = textoDe(item);
  const opts = opcionesDe(item);
  const clave = String(item.correcta || item.ok || '').trim();
  const a = Number(item.a);
  const b = Number(item.b);
  const c = Number(item.c);
  const hasIrt = Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c);
  return Boolean(texto && opts.length >= 4 && clave && hasIrt);
}

/**
 * @returns {'listo_prod'|'piloto_gen'|'plantilla_gen'|'incompleto'}
 */
export function clasificarItem(item, conteoHuellas) {
  if (!esCompleto(item)) return 'incompleto';
  if (esEscrito(item)) return 'listo_prod';
  const h = huellaPlantilla(item);
  const n = (conteoHuellas && conteoHuellas.get(h)) || 1;
  // Más de 3 clones del mismo molde → plantilla basura (solo relleno extremo).
  if (n > 3) return 'plantilla_gen';
  return 'piloto_gen';
}

export function estadoCalibracion(item, nObservaciones = 0) {
  if (nObservaciones >= CALIBRACION_MIN_N) return 'estable';
  if (esEscrito(item)) return 'semilla';
  return 'piloto';
}

function construirConteoHuellas(banco) {
  const map = new Map();
  (banco || []).forEach((it) => {
    if (!esGen(it)) return;
    const h = huellaPlantilla(it);
    map.set(h, (map.get(h) || 0) + 1);
  });
  return map;
}

/**
 * Pool elegible para entrenamiento/CAT:
 * - todos los escritos completos
 * - gen: como máximo `maxPorPlantilla` por huella, estratificados por b
 */
export function poolElegible(banco, { maxPorPlantilla = 2, incluirPlantillaExtrema = false } = {}) {
  const conteo = construirConteoHuellas(banco);
  const porHuella = new Map();
  const elegidos = [];

  (banco || []).forEach((it) => {
    if (!esCompleto(it)) return;
    if (esEscrito(it)) {
      elegidos.push({
        ...it,
        fuente: 'escrito',
        calidad: 'listo_prod',
        calibracion_status: estadoCalibracion(it)
      });
      return;
    }
    // Gen: siempre deduplicar por huella (máx. N representantes), aunque sea plantilla.
    const h = huellaPlantilla(it);
    if (!porHuella.has(h)) porHuella.set(h, []);
    porHuella.get(h).push(it);
  });

  porHuella.forEach((lista) => {
    lista.sort((x, y) => Number(x.b) - Number(y.b));
    const paso = Math.max(1, Math.floor(lista.length / maxPorPlantilla));
    const picks = [];
    for (let i = 0; i < lista.length && picks.length < maxPorPlantilla; i += paso) {
      picks.push(lista[i]);
    }
    // Si incluirPlantillaExtrema=false, igual dejamos los N picks (ya no son 120 clones).
    void incluirPlantillaExtrema;
    picks.forEach((it) => {
      const n = conteo.get(huellaPlantilla(it)) || lista.length;
      elegidos.push({
        ...it,
        fuente: 'gen',
        calidad: n > 3 ? 'piloto_gen' : 'piloto_gen',
        calibracion_status: 'piloto'
      });
    });
  });

  return elegidos;
}

export function inventariarBanco(banco) {
  const conteo = construirConteoHuellas(banco);
  const porArea = {};
  AREAS_SABER.forEach((a) => {
    porArea[a] = {
      total: 0,
      escritos: 0,
      gen: 0,
      listos: 0,
      piloto_gen: 0,
      plantilla_gen: 0,
      incompletos: 0,
      meta_listos: META_LISTOS_POR_AREA[a] || 200,
      brecha_meta: 0
    };
  });

  let total = 0;
  let escritos = 0;
  let gen = 0;
  let listos = 0;
  let piloto = 0;
  let plantilla = 0;
  let incompletos = 0;
  const huellasGen = new Set();

  (banco || []).forEach((it) => {
    total += 1;
    const area = String((it && (it.area || it.area_general)) || 'otro').toLowerCase();
    if (!porArea[area]) {
      porArea[area] = {
        total: 0,
        escritos: 0,
        gen: 0,
        listos: 0,
        piloto_gen: 0,
        plantilla_gen: 0,
        incompletos: 0,
        meta_listos: META_LISTOS_POR_AREA[area] || 200,
        brecha_meta: 0
      };
    }
    const row = porArea[area];
    row.total += 1;
    const clase = clasificarItem(it, conteo);
    if (esGen(it)) {
      gen += 1;
      row.gen += 1;
      huellasGen.add(huellaPlantilla(it));
    } else {
      escritos += 1;
      row.escritos += 1;
    }
    if (clase === 'listo_prod') {
      listos += 1;
      row.listos += 1;
    } else if (clase === 'piloto_gen') {
      piloto += 1;
      row.piloto_gen += 1;
    } else if (clase === 'plantilla_gen') {
      plantilla += 1;
      row.plantilla_gen += 1;
    } else {
      incompletos += 1;
      row.incompletos += 1;
    }
  });

  Object.keys(porArea).forEach((a) => {
    const row = porArea[a];
    row.brecha_meta = Math.max(0, (row.meta_listos || 0) - (row.listos || 0));
  });

  const pool = poolElegible(banco, { maxPorPlantilla: 2 });
  const poolPorArea = {};
  pool.forEach((it) => {
    const a = String(it.area || it.area_general || 'otro').toLowerCase();
    poolPorArea[a] = (poolPorArea[a] || 0) + 1;
  });

  return {
    actualizadoEn: '2025-11',
    total,
    escritos,
    gen,
    listos,
    piloto_gen_unicos_aprox: piloto,
    plantilla_gen: plantilla,
    incompletos,
    huellas_gen_unicas: huellasGen.size,
    pool_elegible: pool.length,
    pool_por_area: poolPorArea,
    por_area: porArea,
    nota:
      'Meta = ítems escritos listos (enunciado+4 opciones+clave+IRT). ' +
      'El _gen_ plantilla no cuenta para la meta; solo relleno piloto deduplicado.'
  };
}
