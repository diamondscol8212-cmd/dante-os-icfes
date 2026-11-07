/**
 * Fase 4 — Smoke del simulacro (armar + calificar + tiempos).
 * Uso: node scripts/smoke-simulacro.mjs
 */
import { armarCuadernillo, calificarSimulacro, PLAN_CUADERNO, CUADERNO } from '../src/services/cat/puntajeOficial.js';

const TOTAL = PLAN_CUADERNO.reduce((s, p) => s + p.n, 0);
const TIEMPO_MS = (4 * 60 + 30) * 60 * 1000;
const fallos = [];

const cuaderno = armarCuadernillo(0xC0FFEE);
if (!cuaderno || cuaderno.length !== TOTAL) {
  fallos.push(`armarCuadernillo: esperado ${TOTAL}, got ${cuaderno ? cuaderno.length : 0}`);
} else {
  const areas = {};
  cuaderno.forEach((it) => {
    const a = String(it.area || it.area_general || '').toLowerCase();
    areas[a] = (areas[a] || 0) + 1;
  });
  Object.entries(CUADERNO).forEach(([area, n]) => {
    if ((areas[area] || 0) !== n) fallos.push(`cupo ${area}: ${areas[area] || 0} ≠ ${n}`);
  });
}

const ids = (cuaderno || []).map((it) => it.id);
const respuestasFull = ids.map((id, i) => ({ id, correcto: i % 3 !== 0 }));
const r1 = calificarSimulacro(respuestasFull);
if (!r1 || r1.global == null) fallos.push('calificarSimulacro full: global null');
Object.keys(CUADERNO).forEach((area) => {
  if (r1.areas[area] == null) fallos.push(`calificar área ${area} null con cupo completo`);
});

const r2 = calificarSimulacro(respuestasFull.slice(0, 20));
if (r2.global != null) fallos.push('calificar parcial corto no debe dar global');

if (!(TIEMPO_MS === 16200000)) fallos.push(`tiempo sesión esperado 16200000 ms, got ${TIEMPO_MS}`);
if (TOTAL !== 254) fallos.push(`TOTAL esperado 254, got ${TOTAL}`);

const out = {
  ok: fallos.length === 0,
  total: TOTAL,
  tiempoMsSesion: TIEMPO_MS,
  globalSmoke: r1 && r1.global,
  areasSmoke: r1 && r1.areas,
  fallos
};

console.log(JSON.stringify(out, null, 2));
if (fallos.length) process.exit(1);
console.log('OK smoke simulacro fase 4');
