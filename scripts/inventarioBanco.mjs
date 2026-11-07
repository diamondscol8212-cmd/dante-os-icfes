/**
 * Fase 3 — Inventario del banco (escritos vs _gen_, metas, pool elegible).
 * Uso: node scripts/inventarioBanco.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BANCO_COMPLETO } from '../src/services/bank/index.js';
import { inventariarBanco, META_LISTOS_POR_AREA, CALIBRACION_MIN_N } from '../src/services/bank/calidadBanco.js';
import { seleccionarBloque } from '../src/services/bank/selectorApertura.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inventario = inventariarBanco(BANCO_COMPLETO);

const bloque = seleccionarBloque(BANCO_COMPLETO, { cantidad: 10, vistos: new Set() });
const genEnBloque = bloque.filter((it) => /_gen_/.test(String(it.id || ''))).length;

const reporte = {
  ...inventario,
  meta_listos_por_area: META_LISTOS_POR_AREA,
  calibracion_min_n: CALIBRACION_MIN_N,
  smoke_bloque_10: {
    ids: bloque.map((it) => it.id),
    gen: genEnBloque,
    escritos: bloque.length - genEnBloque
  }
};

const outJson = path.join(__dirname, 'inventario-banco-fase3.json');
const outTxt = path.join(__dirname, 'inventario-banco-fase3.txt');
fs.writeFileSync(outJson, JSON.stringify(reporte, null, 2), 'utf8');

const lineas = [];
lineas.push('Fase 3 — Inventario banco Dante OS');
lineas.push(`actualizado: ${reporte.actualizadoEn}`);
lineas.push(`total=${reporte.total} escritos=${reporte.escritos} gen=${reporte.gen}`);
lineas.push(`listos=${reporte.listos} plantilla_gen=${reporte.plantilla_gen} pool_elegible=${reporte.pool_elegible}`);
lineas.push(`huellas_gen_unicas=${reporte.huellas_gen_unicas} calibracion_min_n=${CALIBRACION_MIN_N}`);
lineas.push('');
lineas.push('Por área (listos / meta / brecha):');
Object.entries(reporte.por_area || {}).forEach(([area, row]) => {
  lineas.push(
    `  ${area}: listos=${row.listos} meta=${row.meta_listos} brecha=${row.brecha_meta} ` +
      `(escritos=${row.escritos} gen=${row.gen} plantilla=${row.plantilla_gen})`
  );
});
lineas.push('');
lineas.push(`Smoke bloque 10: escritos=${reporte.smoke_bloque_10.escritos} gen=${reporte.smoke_bloque_10.gen}`);
lineas.push(reporte.nota);
fs.writeFileSync(outTxt, lineas.join('\n') + '\n', 'utf8');

console.log(lineas.join('\n'));
console.log(`\nOK → ${outTxt}`);
