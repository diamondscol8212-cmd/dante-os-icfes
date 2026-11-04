import { BANCO_COMPLETO } from '../bank/index.js';

const mapa = new Map();

function meter(item) {
  if (!item || item.id == null) return;
  const a = Number(item.a != null ? item.a : item.parametro_a_discriminacion);
  const b = Number(item.b != null ? item.b : item.parametro_b_dificultad);
  const c = Number(item.c != null ? item.c : item.parametro_c_adivinacion);
  const area = String(item.area || item.area_general || '').toLowerCase().replace(/\s+/g, '_');
  if (!Number.isFinite(a) || !Number.isFinite(b)) return;
  mapa.set(String(item.id), {
    a: a > 0 ? a : 1,
    b,
    c: Number.isFinite(c) ? Math.min(0.45, Math.max(0, c)) : 0.2,
    area
  });
}

BANCO_COMPLETO.forEach(meter);

export function parametrosDeItem(id) {
  return mapa.get(String(id || '')) || null;
}
