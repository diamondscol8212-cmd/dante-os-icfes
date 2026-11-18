/**
 * Auditoría post-export del banco + muestra de claves conocidas.
 * Uso: node scripts/auditarBancoCompleto.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pistaEsDebil, temaEsDebil, esJustifDebil } from '../src/services/bank/enriquecerAyudas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bank = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'bancoPreguntas.json'), 'utf8'));
const cat = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'temasRefuerzo.json'), 'utf8'));

const issues = {
  emptyEnun: 0, optsBad: 0, correctaBad: 0, pistaDebil: 0, explCorta: 0,
  justifFalta: 0, justifDebil: 0, temaDebil: 0, visualRealFalta: 0, genTemaCartilla: 0
};

const hechos = [
  { id: 'item_ap_soc_013', mustInclude: /magdalena/i },
  { id: 'item_ap_soc_002', mustInclude: /caribe/i },
  { id: 'item_ap_soc_019', mustInclude: /orinoco/i }
];

for (const p of bank) {
  const enun = String(p.pregunta_texto || '').trim();
  if (!enun) issues.emptyEnun++;
  const ops = p.opciones_respuesta || [];
  if (!Array.isArray(ops) || ops.length !== 4) issues.optsBad++;
  const c = String(p.correcta || '').toUpperCase().slice(0, 1);
  if (!/[ABCD]/.test(c)) issues.correctaBad++;
  if (pistaEsDebil(p.pista)) issues.pistaDebil++;
  if (String(p.explicacion_correcta || '').trim().length < 40) issues.explCorta++;
  const wrong = 'ABCD'.replace(c, '');
  for (const L of wrong) {
    const r = p.justificacion_opciones && p.justificacion_opciones[L];
    if (!r) issues.justifFalta++;
    else if (esJustifDebil(r)) issues.justifDebil++;
  }
  if (temaEsDebil(p.tema_a_estudiar || p.repaso)) issues.temaDebil++;
  if (/escala\s*1\s*:|climograma|rosa de los vientos|diagrama de caja|box plot/i.test(enun)
      && !p.recurso_visual && !p.imagen_url) {
    issues.visualRealFalta++;
  }
}

for (const t of cat.temas || []) {
  if (/Domínalo identificando|trucos de opción|agrupa preguntas de/.test(t.explicacion?.intro || '')) {
    issues.genTemaCartilla++;
  }
}

const claves = [];
for (const h of hechos) {
  const p = bank.find((x) => x.id === h.id);
  const ops = p?.opciones_respuesta || [];
  const idx = 'ABCD'.indexOf(String(p?.correcta || '').toUpperCase());
  const txt = String(ops[idx] || '');
  claves.push({
    id: h.id,
    ok: h.mustInclude.test(txt),
    correcta: p?.correcta,
    texto: txt,
    tema: p?.tema_a_estudiar,
    ref: p?.tema_refuerzo_id
  });
}

console.log(JSON.stringify({ total: bank.length, temas: (cat.temas || []).length, issues, claves }, null, 2));
