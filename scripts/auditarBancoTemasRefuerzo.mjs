/**
 * Audita bancoPreguntas.json + temasRefuerzo.json para Temas de refuerzo.
 * Uso: node scripts/auditarBancoTemasRefuerzo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function pareceFragmento(txt) {
  const s = String(txt || '').replace(/\s+/g, ' ').trim();
  if (!s) return true;
  if (s.length > 72) return true;
  if (/\?/.test(s)) return true;
  if (/^(seg[uú]n|de acuerdo|lea |lee |observe|cuál|cual |qué |en la figura)/i.test(s)) return true;
  return false;
}

function justifOk(p) {
  const j = p.justificacion_opciones || {};
  const correcta = String(p.correcta || p.ok || '').toUpperCase().slice(0, 1);
  return ['A', 'B', 'C', 'D'].filter((L) => {
    if (L === correcta) return false;
    return String(j[L] || '').trim().length >= 12;
  }).length >= 3;
}

function temaCompleto(t) {
  const miss = [];
  const terms = t.terminos || [];
  const prac = t.practica || [];
  const ej = (t.explicacion && t.explicacion.ejemplo_resuelto) || null;
  const fuentes = t.fuentes || (t.explicacion && t.explicacion.fuentes) || [];
  const pasos = (t.explicacion && t.explicacion.pasos) || [];
  const diag = t.diagrama_svg || '';
  if (terms.length < 3) miss.push('terminos');
  else if (terms.some((x) => !x.definicion || String(x.definicion).length < 20)) miss.push('termino_corto');
  if (prac.length < 2) miss.push('practica');
  else {
    const debil = prac.some((q) => {
      const j = q.justificacion_incorrectas || {};
      return Object.values(j).some((v) => {
        const s = String(v || '').trim();
        return s.length < 12 || /^(mal|no|falso)\.?$/i.test(s);
      });
    });
    if (debil) miss.push('practica_justif_debil');
  }
  if (!ej || !ej.enunciado || !(ej.pasos && ej.pasos.length)) miss.push('ejemplo');
  if (!fuentes.length) miss.push('fuentes');
  if (!pasos || pasos.length < 2) miss.push('pasos');
  const needsDiag = /geometr|fisica|quimica|estad|probabil|hidrograf|geografia|funciones|trigono|fraccion/i
    .test(String(t.id) + ' ' + String(t.titulo || ''));
  if (needsDiag && String(diag).length < 80) miss.push('diagrama');
  return miss;
}

const bank = JSON.parse(fs.readFileSync(path.join(root, 'public', 'bancoPreguntas.json'), 'utf8'));
const arr = Array.isArray(bank) ? bank : (bank.preguntas || []);
const cat = JSON.parse(fs.readFileSync(path.join(root, 'public', 'temasRefuerzo.json'), 'utf8'));
const temas = cat.temas || [];
const byId = new Map(temas.map((t) => [t.id, t]));

const qFail = [];
for (const p of arr) {
  if (!p) continue;
  const miss = [];
  const tema = String(p.tema_a_estudiar || p.tema || p.repaso || '').trim();
  const tid = String(p.tema_refuerzo_id || p.sub_competencia || p.sub || '').trim();
  const expl = String(p.explicacion_correcta || p.explicacion || '').trim();
  if (!tema) miss.push('sin_tema');
  else if (pareceFragmento(tema)) miss.push('tema_crudo');
  if (!tid) miss.push('sin_tema_id');
  else if (!byId.has(tid)) miss.push('tema_huerfano');
  if (expl.length < 20) miss.push('sin_explicacion_correcta');
  if (!justifOk(p)) miss.push('justificacion_incompleta');
  if (tid && byId.has(tid)) {
    const tm = temaCompleto(byId.get(tid));
    if (tm.length) miss.push('cartilla:' + tm.join('+'));
  }
  if (miss.length) qFail.push({ id: p.id, tema, tid, miss });
}

const temaFail = [];
for (const t of temas) {
  const miss = temaCompleto(t);
  if (miss.length) temaFail.push({ id: t.id, titulo: t.titulo, miss });
}

const used = new Set(arr.map((p) => String(p.tema_refuerzo_id || p.sub_competencia || p.sub || '')));
const unusedThemes = temas.filter((t) => !used.has(t.id)).map((t) => t.id);

const report = {
  generatedAt: new Date().toISOString(),
  totalPreguntas: arr.length,
  preguntasCompletas: arr.length - qFail.length,
  preguntasIncompletas: qFail.length,
  totalTemasCatalogo: temas.length,
  temasCompletos: temas.length - temaFail.length,
  temasIncompletos: temaFail.length,
  temasSinPreguntasEnBanco: unusedThemes,
  incompletasPorMotivo: qFail.reduce((acc, row) => {
    row.miss.forEach((m) => {
      const key = m.startsWith('cartilla:') ? 'cartilla_tema' : m;
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {}),
  temasIncompletosDetalle: temaFail,
  preguntasIncompletasMuestra: qFail.slice(0, 30)
};

const outDir = path.join(root, 'data');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'auditoria-temas-refuerzo.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify({
  totalPreguntas: report.totalPreguntas,
  preguntasCompletas: report.preguntasCompletas,
  preguntasIncompletas: report.preguntasIncompletas,
  totalTemasCatalogo: report.totalTemasCatalogo,
  temasCompletos: report.temasCompletos,
  temasIncompletos: report.temasIncompletos,
  temasSinPreguntasEnBanco: report.temasSinPreguntasEnBanco,
  incompletasPorMotivo: report.incompletasPorMotivo,
  reporte: outPath
}, null, 2));
