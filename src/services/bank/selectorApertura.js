import { esEscrito as esEscritoCalidad, poolElegible } from './calidadBanco.js';

export const AREAS_SABER = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'ingles', 'sociales_ciudadanas'];

export function esEscrito(item) {
  return esEscritoCalidad(item);
}

export function esSaber11(item) {
  const examen = String((item && item.target_exam) || 'SABER_11').toUpperCase();
  return examen === 'SABER_11' || examen === 'ICFES';
}

function mezclar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copia[i];
    copia[i] = copia[j];
    copia[j] = tmp;
  }
  return copia;
}

/** Cache del pool anti-plantilla (se invalida al reiniciar proceso). */
let _poolCache = null;
function bancoFiltrado(banco) {
  if (_poolCache && _poolCache.base === banco) return _poolCache.pool;
  const pool = poolElegible(banco || [], { maxPorPlantilla: 2 });
  _poolCache = { base: banco, pool };
  return pool;
}

/**
 * Cola por área. Prioriza escritos; gen solo piloto deduplicado (sin plantilla basura).
 * Por defecto NO reusa ítems ya vistos. Solo si permitirReuso=true (banco agotado).
 */
export function colaDeArea(items, vistos, opts = {}) {
  const permitirReuso = Boolean(opts && opts.permitirReuso);
  const maxGenRatio = opts && opts.maxGenRatio != null ? Number(opts.maxGenRatio) : 0.35;
  const nuevosEscritos = [];
  const nuevosGen = [];
  const vistosEscritos = [];
  const vistosGen = [];
  (items || []).forEach((it) => {
    if (!it || !esSaber11(it)) return;
    const id = String(it.id || '');
    if (!id) return;
    const visto = vistos.has(id);
    if (esEscrito(it)) {
      if (!visto) nuevosEscritos.push(it);
      else vistosEscritos.push(it);
    } else if (!visto) {
      nuevosGen.push(it);
    } else {
      vistosGen.push(it);
    }
  });
  const escritosMix = mezclar(nuevosEscritos);
  const genMix = mezclar(nuevosGen);
  // Tope de gen en la cola fresca para no inundar el bloque con clones.
  const cupoGen = Math.max(0, Math.floor(escritosMix.length * maxGenRatio / Math.max(0.01, 1 - maxGenRatio)));
  const genCapped = genMix.slice(0, Math.max(cupoGen, escritosMix.length ? 2 : genMix.length));
  let cola = escritosMix.concat(genCapped);
  if (permitirReuso) {
    cola = cola.concat(mezclar(vistosEscritos), mezclar(vistosGen).slice(0, 4));
  }
  return cola;
}

function elegirDesdeColas(colas, areas, cantidad, idsPrevios) {
  const elegidos = [];
  const ids = new Set(idsPrevios || []);
  let turno = 0;
  let guardia = 0;
  while (elegidos.length < cantidad && guardia < cantidad * (areas.length + 2)) {
    const cola = colas.get(areas[turno % areas.length]) || [];
    while (cola.length) {
      const candidato = cola.shift();
      if (candidato && candidato.id && !ids.has(candidato.id)) {
        ids.add(candidato.id);
        elegidos.push(candidato);
        break;
      }
    }
    turno += 1;
    guardia += 1;
    let queda = false;
    colas.forEach((cola) => { if (cola.length) queda = true; });
    if (!queda) break;
  }
  return elegidos;
}

export function seleccionarBloque(banco, opciones) {
  const cantidad = (opciones && opciones.cantidad) || 10;
  const vistos = (opciones && opciones.vistos) || new Set();
  const areas = (opciones && opciones.areas) || AREAS_SABER;
  // Fase 3: trabajar sobre pool elegible (escritos + gen deduplicado), no sobre 5k plantillas.
  const filtrado = bancoFiltrado(banco);
  const porArea = new Map(areas.map((area) => [area, []]));
  (filtrado || []).forEach((it) => {
    const area = String((it && (it.area || it.area_general)) || '').toLowerCase();
    if (porArea.has(area)) porArea.get(area).push(it);
  });

  const colasFrescas = new Map();
  porArea.forEach((lista, area) => colasFrescas.set(area, colaDeArea(lista, vistos, { permitirReuso: false })));
  let elegidos = elegirDesdeColas(colasFrescas, areas, cantidad, []);

  // Solo si no alcanza el cupo con ítems nuevos, permitir reuso (último recurso).
  if (elegidos.length < cantidad) {
    const colasReuso = new Map();
    porArea.forEach((lista, area) => colasReuso.set(area, colaDeArea(lista, vistos, { permitirReuso: true })));
    const idsYa = elegidos.map((it) => it.id);
    const extra = elegirDesdeColas(colasReuso, areas, cantidad - elegidos.length, idsYa);
    elegidos = elegidos.concat(extra);
  }

  // Último recurso: pool completo sin filtro de plantilla (banco muy agotado).
  if (elegidos.length < cantidad) {
    const porAreaFull = new Map(areas.map((area) => [area, []]));
    (banco || []).forEach((it) => {
      const area = String((it && (it.area || it.area_general)) || '').toLowerCase();
      if (porAreaFull.has(area)) porAreaFull.get(area).push(it);
    });
    const colasFull = new Map();
    porAreaFull.forEach((lista, area) => colasFull.set(area, colaDeArea(lista, vistos, { permitirReuso: true, maxGenRatio: 0.8 })));
    const idsYa = elegidos.map((it) => it.id);
    const extra = elegirDesdeColas(colasFull, areas, cantidad - elegidos.length, idsYa);
    elegidos = elegidos.concat(extra);
  }
  return elegidos;
}

export function areaCoincide(item, prefijo) {
  const area = String((item && (item.area || item.area_general)) || '').toLowerCase();
  const p = String(prefijo || '').toLowerCase();
  if (p.startsWith('social')) return area.includes('social');
  if (p.startsWith('cien') || p.startsWith('natur')) return area.includes('cien') || area.includes('natur');
  if (p.startsWith('lect')) return area.includes('lect');
  if (p.startsWith('ing')) return area.includes('ingl');
  if (p.startsWith('mate')) return area.includes('mate');
  return area === p;
}

export function seleccionarRefuerzo(banco, prefijo, vistos, n = 5) {
  const pool = bancoFiltrado(banco).filter((it) => areaCoincide(it, prefijo));
  const setVistos = vistos || new Set();
  let elegidos = colaDeArea(pool, setVistos, { permitirReuso: false }).slice(0, n);
  if (elegidos.length < n) {
    const ids = new Set(elegidos.map((it) => it && it.id).filter(Boolean));
    const reuso = colaDeArea(pool, setVistos, { permitirReuso: true });
    for (const it of reuso) {
      if (!it || !it.id || ids.has(it.id)) continue;
      elegidos.push(it);
      ids.add(it.id);
      if (elegidos.length >= n) break;
    }
  }
  return elegidos;
}
