export const AREAS_SABER = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'ingles', 'sociales_ciudadanas'];

export function esEscrito(item) {
  return !/_gen_/.test(String((item && item.id) || ''));
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

/**
 * Cola por área. Por defecto NO reusa ítems ya vistos (diagnóstico/bloques previos).
 * Solo si permitirReuso=true (banco agotado) vuelve a ofrecer vistos.
 */
export function colaDeArea(items, vistos, opts = {}) {
  const permitirReuso = Boolean(opts && opts.permitirReuso);
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
  let cola = mezclar(nuevosEscritos).concat(mezclar(nuevosGen));
  if (permitirReuso) {
    cola = cola.concat(mezclar(vistosEscritos), mezclar(vistosGen));
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
  const porArea = new Map(areas.map((area) => [area, []]));
  (banco || []).forEach((it) => {
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
  const pool = (banco || []).filter((it) => areaCoincide(it, prefijo));
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
