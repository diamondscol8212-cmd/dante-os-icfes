#!/usr/bin/env node
/**
 * Auditoría: toda ruta /assets referenciada por el banco debe existir en public/.
 * Exit 1 si falta algún archivo.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');

const { BANCO_COMPLETO } = await import(pathToFileURL(path.join(root, 'src/services/bank/index.js')).href);

function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc;
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(js|mjs|json)$/i.test(n)) acc.push(p);
  }
  return acc;
}

function tieneGrafica(item) {
  const r = item && (item.recurso_visual || item.imagen_url || item.imagen || item.grafico_url || item.grafico);
  return Boolean(r && String(r).trim());
}

const rutas = new Set();
let conGrafica = 0;
let conInline = 0;
let corregiblesEmbebidos = 0;

for (const item of BANCO_COMPLETO || []) {
  if (!tieneGrafica(item)) continue;
  conGrafica += 1;
  const rec = String(item.recurso_visual || '');
  if (rec.includes('<svg') || rec.startsWith('data:image')) {
    conInline += 1;
    corregiblesEmbebidos += 1;
  }
  const url = item.imagen_url || item.grafico_url || item.imagen || '';
  if (typeof url === 'string' && /\/?assets\//i.test(url)) {
    rutas.add(url.startsWith('/') ? url : `/${url}`);
  }
}

const scanFiles = walk(path.join(root, 'src/services/bank'))
  .concat([
    path.join(root, 'src/services/PreuniversitarioService.js'),
    path.join(root, 'public/js/danteExamWorkspace.js')
  ].filter((f) => fs.existsSync(f)));

const re = /["'`](\/?assets\/[^"'`\s)]+\.(?:svg|png|jpg|jpeg|webp|gif))["'`]/g;
for (const file of scanFiles) {
  const txt = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = re.exec(txt))) {
    const u = m[1].startsWith('/') ? m[1] : `/${m[1]}`;
    // Ignorar iconos de UI no-pregunta salvo unal/
    if (/\/assets\/icons\//i.test(u) && !/unal/i.test(u)) continue;
    rutas.add(u);
  }
}

const ok = [];
const missing = [];
for (const u of [...rutas].sort()) {
  const full = path.join(publicRoot, u.replace(/^\//, '').replace(/\//g, path.sep));
  if (fs.existsSync(full)) ok.push(u);
  else missing.push(u);
}

console.log('=== Auditoría gráficas Dante OS ===');
console.log(`Ítems BANCO_COMPLETO con gráfica: ${conGrafica}`);
console.log(`  con recurso embebido (SVG/data): ${conInline}`);
console.log(`Rutas /assets de preguntas referenciadas: ${rutas.size}`);
console.log(`  OK en disco: ${ok.length}`);
ok.forEach((u) => console.log(`   ✓ ${u}`));
console.log(`  FALTANTES: ${missing.length}`);
missing.forEach((u) => console.log(`   ✗ ${u}`));

if (missing.length) {
  console.error('\nFAIL: hay gráficas referenciadas sin archivo en public/.');
  process.exit(1);
}
console.log('\nOK: todas las rutas de gráfica de preguntas existen.');
process.exit(0);
