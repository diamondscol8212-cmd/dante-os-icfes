import { estimarHistorial } from './estimarEap.js';
import { BANCO_COMPLETO } from '../bank/index.js';
import { esEscrito } from '../bank/selectorApertura.js';

export const CUADERNO = {
  matematicas: 50,
  lectura_critica: 41,
  sociales_ciudadanas: 50,
  ciencias_naturales: 58,
  ingles: 55
};

const ORDEN = ['lectura_critica', 'matematicas', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'];

export const PLAN_CUADERNO = [
  { sesion: 1, area: 'matematicas', n: 25 },
  { sesion: 1, area: 'lectura_critica', n: 41 },
  { sesion: 1, area: 'sociales_ciudadanas', n: 25 },
  { sesion: 1, area: 'ciencias_naturales', n: 29 },
  { sesion: 2, area: 'matematicas', n: 25 },
  { sesion: 2, area: 'sociales_ciudadanas', n: 25 },
  { sesion: 2, area: 'ciencias_naturales', n: 29 },
  { sesion: 2, area: 'ingles', n: 55 }
];

function mezclar(lista, semilla) {
  const copia = lista.slice();
  let estado = (Number(semilla) || 1) >>> 0;
  const aleatorio = () => {
    estado = (estado + 0x6D2B79F5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    const tmp = copia[i];
    copia[i] = copia[j];
    copia[j] = tmp;
  }
  return copia;
}

function sirveParaCuaderno(item) {
  const examen = String(item && item.target_exam || 'SABER_11').toUpperCase();
  if (examen.includes('UNAL') || examen.includes('DOCENTE') || examen.includes('PRO')) return false;
  const id = String(item && item.id || '');
  if (/^item_(unal|docente|saberpro)/.test(id)) return false;
  return Boolean(areaDe(item));
}

export function armarCuadernillo(semilla) {
  const porArea = {};
  BANCO_COMPLETO.filter(sirveParaCuaderno).forEach((item) => {
    const area = areaDe(item);
    if (!porArea[area]) porArea[area] = [];
    porArea[area].push(item);
  });
  const usados = new Set();
  const reactivos = [];
  PLAN_CUADERNO.forEach((paso, indice) => {
    const libres = (porArea[paso.area] || []).filter((item) => item && item.id && !usados.has(item.id));
    // Simulacro oficial: prioriza banco escrito; generados solo si no alcanza el cupo del área.
    const bolsa = mezclar(libres.filter(esEscrito), (Number(semilla) || 1) + indice * 17)
      .concat(mezclar(libres.filter((item) => !esEscrito(item)), (Number(semilla) || 1) + indice * 31));
    bolsa.slice(0, paso.n).forEach((item) => {
      usados.add(item.id);
      reactivos.push(item);
    });
  });
  if (reactivos.length !== PLAN_CUADERNO.reduce((suma, paso) => suma + paso.n, 0)) return null;
  return reactivos;
}

export function areaDe(item) {
  const cruda = String((item && (item.area || item.area_general || item.materia)) || '').toLowerCase();
  if (cruda.includes('mate')) return 'matematicas';
  if (cruda.includes('lect')) return 'lectura_critica';
  if (cruda.includes('cien') || cruda.includes('natur')) return 'ciencias_naturales';
  if (cruda.includes('social')) return 'sociales_ciudadanas';
  if (cruda.includes('ingl')) return 'ingles';
  return '';
}

export function puntajeDeArea(items) {
  const lista = Array.isArray(items) ? items.filter((item) => item && typeof item.correcto === 'boolean') : [];
  if (!lista.length) return null;
  const est = estimarHistorial(lista);
  if (!est || est.puntos == null) return null;
  const theta = Math.max(-3, Math.min(3, Number(est.theta) || 0));
  return Math.max(0, Math.min(100, Math.round(50 + theta * 10)));
}

export function puntajeGlobalOficial(areas) {
  const mapa = areas || {};
  if (ORDEN.some((clave) => mapa[clave] == null || Number.isNaN(Number(mapa[clave])))) return null;
  const ig = (
    3 * Number(mapa.lectura_critica)
    + 3 * Number(mapa.matematicas)
    + 3 * Number(mapa.ciencias_naturales)
    + 3 * Number(mapa.sociales_ciudadanas)
    + Number(mapa.ingles)
  ) / 13;
  return Math.max(0, Math.min(500, Math.round(ig * 5)));
}

export function calificarSimulacro(respuestas) {
  const mapa = new Map(BANCO_COMPLETO.map((item) => [String(item.id), item]));
  const grupos = {};
  const vistos = new Set();
  (Array.isArray(respuestas) ? respuestas : []).forEach((fila) => {
    if (!fila || typeof fila.correcto !== 'boolean') return;
    const id = String(fila.id || '');
    if (!id || vistos.has(id)) return;
    const item = mapa.get(id);
    if (!item) return;
    const area = areaDe(item);
    if (!CUADERNO[area]) return;
    vistos.add(id);
    if (!grupos[area]) grupos[area] = [];
    if (grupos[area].length >= CUADERNO[area]) return;
    grupos[area].push({ a: item.a, b: item.b, c: item.c, correcto: fila.correcto === true });
  });
  const areas = {};
  ORDEN.forEach((area) => {
    const lista = grupos[area] || [];
    areas[area] = lista.length >= CUADERNO[area] ? puntajeDeArea(lista) : null;
  });
  return {
    areas,
    global: puntajeGlobalOficial(areas)
  };
}
