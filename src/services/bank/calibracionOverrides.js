/**
 * Overrides IRT vivos (aprobados tras N≥30). No muta el banco fuente.
 * Persistencia ligera en memoria + archivo JSON local (dev/ops).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVO = path.join(__dirname, 'calibracionOverrides.json');

/** @type {Map<string, {a:number,b:number,c:number,n:number,aprobadoEn:string}>} */
const mapa = new Map();

function cargar() {
  try {
    if (!fs.existsSync(ARCHIVO)) return;
    const raw = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
    const items = (raw && raw.items) || {};
    Object.keys(items).forEach((id) => {
      const row = items[id];
      if (!row) return;
      mapa.set(String(id), {
        a: Number(row.a),
        b: Number(row.b),
        c: Number(row.c),
        n: Number(row.n) || 0,
        aprobadoEn: String(row.aprobadoEn || '')
      });
    });
  } catch (e) {
    console.warn('[calibracionOverrides] no se pudo cargar:', e && e.message);
  }
}

cargar();

export function overrideDeItem(id) {
  return mapa.get(String(id || '')) || null;
}

export function listarOverrides() {
  return Array.from(mapa.entries()).map(([item_id, v]) => ({ item_id, ...v }));
}

export function guardarOverride(itemId, params) {
  const id = String(itemId || '').trim();
  if (!id) return { ok: false, error: 'item_id vacío' };
  const a = Number(params.a);
  const b = Number(params.b);
  const c = Number(params.c);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    return { ok: false, error: 'a/b/c inválidos' };
  }
  const row = {
    a,
    b,
    c,
    n: Number(params.n) || 0,
    aprobadoEn: new Date().toISOString()
  };
  mapa.set(id, row);
  try {
    const items = {};
    mapa.forEach((v, k) => { items[k] = v; });
    fs.writeFileSync(
      ARCHIVO,
      JSON.stringify({ actualizadoEn: new Date().toISOString(), items }, null, 2),
      'utf8'
    );
  } catch (e) {
    return { ok: true, persistido: false, aviso: e && e.message, row };
  }
  return { ok: true, persistido: true, row };
}
