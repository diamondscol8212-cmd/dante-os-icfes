/**
 * Audita que cada cartilla q_* sea congruente con su pregunta del banco.
 * Uso: node scripts/auditarCongruenciaCartillas.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'public', 'bancoPreguntas.json'), 'utf8'));
const arr = Array.isArray(bank) ? bank : (bank.preguntas || []);
const cat = JSON.parse(fs.readFileSync(path.join(root, 'public', 'temasRefuerzo.json'), 'utf8'));
const temas = cat.temas || [];
const byId = new Map(temas.map((t) => [t.id, t]));

function limpio(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function opsTxt(p) {
  const ops = p.opciones_respuesta || p.opciones || [];
  return (Array.isArray(ops) ? ops : []).map((o) => limpio(typeof o === 'string' ? o : (o && o.texto) || '')).join(' ');
}

const fails = [];
let ok = 0;
for (const p of arr) {
  if (!p || !p.id) continue;
  const tid = limpio(p.tema_refuerzo_id || '');
  const t = byId.get(p.tema_refuerzo_id) || byId.get(tid);
  const miss = [];
  if (!t) miss.push('sin_cartilla');
  else {
    if (String(t.itemId) !== String(p.id)) miss.push('itemId_mismatch');
    const intro = limpio(t.explicacion && t.explicacion.intro);
    const expl = limpio(p.explicacion_correcta || '');
    if (expl && expl.length > 30 && !intro.includes(expl.slice(0, 40))) {
      // allow if correct option text is in intro
      const correcta = String(p.correcta || '').toUpperCase().slice(0, 1);
      const ops = p.opciones_respuesta || p.opciones || [];
      const idx = 'ABCD'.indexOf(correcta);
      const okTxt = limpio(typeof ops[idx] === 'string' ? ops[idx] : (ops[idx] && ops[idx].texto) || '')
        .replace(/^[a-d][\)\.\-:]\s*/, '');
      if (okTxt && !intro.includes(okTxt.slice(0, Math.min(24, okTxt.length)))) {
        miss.push('intro_no_ancla_item');
      }
    }
    const prac = t.practica || [];
    if (prac.length < 2) miss.push('practica_corta');
    // Detect classic generic mismatches
    const blobPrac = limpio(JSON.stringify(prac));
    const blobItem = limpio((p.pregunta_texto || '') + ' ' + opsTxt(p));
    if (/phase out/.test(blobItem) && /she _____ the bus|take the bus/.test(blobPrac) && !/phase out/.test(blobPrac)) {
      miss.push('phase_out_vs_bus');
    }
    if (/was written|passive voice/.test(blobItem) && /soccer every saturday|my brother _____ english/.test(blobPrac) && !/passive|was written|past participle/.test(blobPrac + limpio(t.titulo))) {
      miss.push('passive_vs_tenses');
    }
    if (/purpose of this warning|what is the purpose/.test(blobItem) && /how are you|saludo/.test(blobPrac) && !/purpose|warn|propósito/.test(blobPrac + limpio(t.titulo))) {
      miss.push('purpose_vs_greetings');
    }
    if ((t.terminos || []).length < 3) miss.push('terminos');
    if (!(t.explicacion && t.explicacion.ejemplo_resuelto && t.explicacion.ejemplo_resuelto.enunciado)) miss.push('ejemplo');
  }
  if (!String(p.tema_refuerzo_id || '').startsWith('q_')) miss.push('tid_no_por_item');
  if (miss.length) fails.push({ id: p.id, tid: p.tema_refuerzo_id, titulo: t && t.titulo, miss });
  else ok++;
}

const report = {
  generatedAt: new Date().toISOString(),
  totalPreguntas: arr.length,
  totalCartillas: temas.length,
  congruentes: ok,
  desalineadas: fails.length,
  muestraFallos: fails.slice(0, 25)
};
fs.writeFileSync(path.join(root, 'scripts', 'reporteCongruenciaCartillas.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
