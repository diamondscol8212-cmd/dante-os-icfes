/**
 * Reescribe justificaciones contaminadas (p. ej. tips de matemáticas en inglés/lectura)
 * y regenera cartillas 1:1.
 *
 * Uso: node scripts/repararJustificacionesCruzadas.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enriquecerAyudaItem } from '../src/services/bank/enriquecerAyudas.js';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const bankPath = path.join(root, 'public', 'bancoPreguntas.json');

const MATH_CONTAM_RE = /proporci[oó]n\s*[“"']?a\s*ojo|sumaste o restaste cantidades|dividiste cuando tocaba multiplicar|olvidaste convertir \(minutos|Mezclaste per[ií]metro, [aá]rea o volumen|porcentaje como cantidad fija|favorables\/posibles|al despejar sumaste|convertir el tiempo o la magnitud|duplicaste o partiste a la mitad|omitiste un paso, una conversi[oó]n/i;
const EN_GENERIC_RE = /suena familiar, pero no encaja con el tiempo|forma gramatical o el vocabulario/i;
const EN_FINE_RE = /phase out|keep up|look into|take after|passive|was written|were |by a |by the |purpose of|warning|phrasal/i;

function areaOf(p) {
  return String(p.area || p.materia || '').toLowerCase();
}

function blobJust(p) {
  return JSON.stringify(p.justificacion_opciones || {}) + ' ' + JSON.stringify(p.razonesPorTexto || {});
}

function main() {
  const raw = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  const arr = Array.isArray(raw) ? raw : (raw.preguntas || []);
  let cruzadas = 0;
  let reescritas = 0;
  const ejemplos = [];

  for (const p of arr) {
    if (!p) continue;
    const area = areaOf(p);
    const before = blobJust(p);
    const enunciadoBlob = String(p.pregunta_texto || p.enunciado || '') + JSON.stringify(p.opciones_respuesta || p.opciones || []);
    const estabaCruzada = !area.includes('mate') && MATH_CONTAM_RE.test(before);
    const inglesMejorable = (area.includes('ingl') || /grammar|vocab|dialog|cloze|reading/.test(String(p.sub || p.sub_competencia || '')))
      && EN_GENERIC_RE.test(before)
      && EN_FINE_RE.test(enunciadoBlob);
    if (estabaCruzada) cruzadas += 1;

    // Fuerza reescritura: limpia justifs cruzadas / genéricas de inglés antes de enriquecer.
    if (estabaCruzada || inglesMejorable) {
      p.justificacion_opciones = {};
      p.razonesPorTexto = {};
    }
    const enriched = enriquecerAyudaItem(p);
    Object.assign(p, {
      pista: enriched.pista,
      frase_acierto: enriched.frase_acierto,
      repaso: enriched.repaso,
      tema_a_estudiar: enriched.tema_a_estudiar,
      tema_refuerzo_id: enriched.tema_refuerzo_id,
      explicacion_correcta: enriched.explicacion_correcta,
      justificacion_opciones: enriched.justificacion_opciones,
      razonesPorTexto: enriched.razonesPorTexto
    });

    const after = blobJust(p);
    if (estabaCruzada || before !== after) {
      reescritas += 1;
      if (ejemplos.length < 6 && estabaCruzada) {
        ejemplos.push({
          id: p.id,
          area,
          tema: p.tema_a_estudiar,
          before: before.slice(0, 180),
          after: after.slice(0, 180)
        });
      }
    }
  }

  // Verificación final
  let quedan = 0;
  for (const p of arr) {
    if (!areaOf(p).includes('mate') && MATH_CONTAM_RE.test(blobJust(p))) quedan += 1;
  }

  if (Array.isArray(raw)) fs.writeFileSync(bankPath, JSON.stringify(arr));
  else {
    raw.preguntas = arr;
    fs.writeFileSync(bankPath, JSON.stringify(raw));
  }
  const nested = path.join(root, 'dante-os-icfes', 'public', 'bancoPreguntas.json');
  fs.writeFileSync(nested, fs.readFileSync(bankPath));

  const report = {
    total: arr.length,
    cruzadasDetectadas: cruzadas,
    itemsReescritos: reescritas,
    cruzadasRestantes: quedan,
    ejemplos
  };
  fs.writeFileSync(path.join(__dirname, 'reporteReparacionCruzadas.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (quedan > 0) {
    console.error('FAIL: aún hay justificaciones cruzadas');
    process.exitCode = 1;
    return;
  }

  console.log('Regenerando cartillas por pregunta…');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'generarCartillasPorPregunta.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env
  });
  if (r.status !== 0) {
    process.exitCode = r.status || 1;
    return;
  }

  // Re-merge legacy themes so old pendientes no rompen
  console.log('Fusionando legacy + q_*…');
  const perItem = JSON.parse(fs.readFileSync(path.join(root, 'public', 'temasRefuerzo.json'), 'utf8'));
  const legacyRun = spawnSync(process.execPath, [path.join(__dirname, 'generarCatalogoTemasRefuerzo.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env
  });
  if (legacyRun.status !== 0) {
    console.warn('Legacy generator falló; se dejan solo cartillas q_*');
    return;
  }
  const legacy = JSON.parse(fs.readFileSync(path.join(root, 'public', 'temasRefuerzo.json'), 'utf8'));
  const byId = new Map();
  for (const t of (legacy.temas || [])) {
    if (t && t.id && !String(t.id).startsWith('q_')) byId.set(t.id, t);
  }
  for (const t of (perItem.temas || [])) {
    if (t && t.id) byId.set(t.id, t);
  }
  const merged = {
    version: 4,
    nota: 'Cartillas q_* por pregunta (justificaciones por área) + legacy de respaldo.',
    generatedAt: new Date().toISOString(),
    total: byId.size,
    temas: [...byId.values()]
  };
  fs.writeFileSync(path.join(root, 'public', 'temasRefuerzo.json'), JSON.stringify(merged));
  fs.writeFileSync(path.join(root, 'dante-os-icfes', 'public', 'temasRefuerzo.json'), JSON.stringify(merged));
  if (fs.existsSync(path.join(root, 'dante-os-icfes', 'public', 'data'))) {
    fs.writeFileSync(path.join(root, 'dante-os-icfes', 'public', 'data', 'temasRefuerzo.json'), JSON.stringify(merged));
  }
  console.log(JSON.stringify({ mergedTemas: merged.temas.length, q: merged.temas.filter((t) => String(t.id).startsWith('q_')).length }, null, 2));
}

main();
