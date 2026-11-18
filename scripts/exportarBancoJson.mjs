/**
 * Regenera public/bancoPreguntas.json desde BANCO_COMPLETO (JS).
 * Uso: node scripts/exportarBancoJson.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BANCO_COMPLETO } from '../src/services/bank/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'public', 'bancoPreguntas.json');

const limpio = (BANCO_COMPLETO || []).map((item) => ({
  id: item.id,
  area: item.area || item.materia || null,
  materia: item.materia || item.area || null,
  pregunta_texto: item.pregunta_texto || item.enunciado || '',
  opciones_respuesta: item.opciones_respuesta || item.opciones || [],
  correcta: item.correcta || item.respuesta_correcta || null,
  a: item.a,
  b: item.b,
  c: item.c,
  pista: item.pista || null,
  frase_acierto: item.frase_acierto || null,
  repaso: item.tema_a_estudiar || item.repaso || null,
  tema_a_estudiar: item.tema_a_estudiar || item.repaso || null,
  explicacion_correcta: item.explicacion_correcta || null,
  justificacion_opciones: item.justificacion_opciones || null,
  razonesPorTexto: item.razonesPorTexto || null,
  recurso_visual: item.recurso_visual || item.imagen_url || null,
  imagen_url: item.imagen_url || null,
  sub_competencia: item.sub_competencia || item.sub || null,
  sub: item.sub || item.sub_competencia || null,
  tema_refuerzo_id: item.tema_refuerzo_id || item.temaRefuerzoId || item.sub_competencia || item.sub || null,
  es_escrito: Boolean(item.esEscrito || item.es_escrito),
  source: String(item.id || '').includes('_gen_') ? 'gen' : 'escrito'
}));

const destinos = [
  out,
  path.join(__dirname, '..', 'dante-os-icfes', 'public', 'bancoPreguntas.json')
];
for (const destino of destinos) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, JSON.stringify(limpio));
  console.log(`OK ${limpio.length} ítems → ${destino}`);
}
console.log(`escritos=${limpio.filter((x) => x.source === 'escrito').length} gen=${limpio.filter((x) => x.source === 'gen').length}`);
