/**
 * Agrega respuestas reales y propone a/b/c sin aplicar a ciegas.
 * Requiere revisión humana (status = pendiente → aprobada).
 */
import { supabase } from '../../../supabaseClient.js';
import { calibrarParametrosItemEmpirico } from '../cat/CatDomainService.js';
import { BANCO_COMPLETO } from './index.js';
import { parametrosDeItem } from '../cat/bancoCalibrado.js';

import { CALIBRACION_MIN_N } from './calidadBanco.js';
import { guardarOverride } from './calibracionOverrides.js';

/** Fase 3: calibración viva exige N≥30 (no recalibrar con muestra chica). */
const MIN_N = CALIBRACION_MIN_N;
const MAX_ITEMS = 80;

function itemOriginalDe(row) {
  const vec = Array.isArray(row.selection_vector) ? row.selection_vector : [];
  const meta = vec.find((x) => x && (x.item_original || x.parametro_b != null));
  return String((meta && meta.item_original) || row.item_id || '').trim();
}

function paramsDeEvento(row) {
  const vec = Array.isArray(row.selection_vector) ? row.selection_vector : [];
  const meta = vec.find((x) => x && (x.parametro_a != null || x.parametro_b != null));
  return {
    a: Number(meta && meta.parametro_a),
    b: Number(meta && meta.parametro_b),
    c: Number(meta && meta.parametro_c)
  };
}

function thetaDeEvento(row) {
  const vec = Array.isArray(row.selection_vector) ? row.selection_vector : [];
  for (let i = 0; i < vec.length; i++) {
    const t = Number(vec[i] && (vec[i].thetaSnapshot || vec[i].theta));
    if (Number.isFinite(t)) return t;
  }
  return 0;
}

export async function generarPropuestasCalibracion({ minN = MIN_N, limite = MAX_ITEMS } = {}) {
  const { data, error } = await supabase
    .from('registro_eventos')
    .select('item_id,is_correct,selection_vector,created_at')
    .order('created_at', { ascending: false })
    .limit(8000);
  if (error) return { ok: false, error: error.message };

  const porItem = new Map();
  (data || []).forEach((row) => {
    const id = itemOriginalDe(row);
    if (!id) return;
    if (!porItem.has(id)) porItem.set(id, []);
    porItem.get(id).push(row);
  });

  const propuestas = [];
  for (const [itemId, filas] of porItem.entries()) {
    if (filas.length < minN) continue;
    const banco = parametrosDeItem(itemId) || BANCO_COMPLETO.find((x) => String(x.id) === itemId);
    const snap = paramsDeEvento(filas[0]);
    const a0 = Number.isFinite(Number(banco && banco.a)) ? Number(banco.a) : (Number.isFinite(snap.a) ? snap.a : 1.2);
    const b0 = Number.isFinite(Number(banco && banco.b)) ? Number(banco.b) : (Number.isFinite(snap.b) ? snap.b : 0);
    const c0 = Number.isFinite(Number(banco && banco.c)) ? Number(banco.c) : (Number.isFinite(snap.c) ? snap.c : 0.25);

    const obs = filas.slice(0, 400).map((r) => ({
      thetaStudent: thetaDeEvento(r),
      correcto: Boolean(r.is_correct)
    }));
    const cal = calibrarParametrosItemEmpirico({ a: a0, b: b0, c: c0 }, obs);
    const aciertos = obs.filter((o) => o.correcto).length;
    const p = aciertos / obs.length;
    if (Math.abs(cal.deltaB) < 0.05) continue;

    propuestas.push({
      item_id: itemId.slice(0, 120),
      n: obs.length,
      p_acierto: Math.round(p * 1000) / 1000,
      a_old: a0,
      b_old: b0,
      c_old: c0,
      a_new: cal.aCalibrado,
      b_new: cal.bCalibrado,
      c_new: cal.cCalibrado,
      delta_b: cal.deltaB,
      status: 'pendiente',
      calibration_version: process.env.IRT_CALIBRATION_VERSION || 'c-1.2.84',
      created_at: new Date().toISOString()
    });
    if (propuestas.length >= limite) break;
  }

  propuestas.sort((x, y) => Math.abs(y.delta_b) - Math.abs(x.delta_b));

  if (!propuestas.length) return { ok: true, propuestas: [], insertadas: 0 };

  const { error: upErr } = await supabase.from('propuesta_calibracion_items').upsert(
    propuestas.map((p) => ({
      ...p,
      id: undefined
    })),
    { onConflict: 'item_id,calibration_version', ignoreDuplicates: false }
  );

  // Si no hay constraint única, insertar una a una sin tumbar el job.
  if (upErr) {
    let insertadas = 0;
    for (const p of propuestas) {
      const ins = await supabase.from('propuesta_calibracion_items').insert(p);
      if (!ins.error) insertadas += 1;
    }
    return { ok: true, propuestas, insertadas, aviso: upErr.message };
  }

  return { ok: true, propuestas, insertadas: propuestas.length };
}

export async function listarPropuestas(status = 'pendiente') {
  let q = supabase
    .from('propuesta_calibracion_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, propuestas: data || [] };
}

/**
 * Aprueba una propuesta y aplica override vivo a/b/c (sin editar el banco JS).
 */
export async function aprobarYAplicarPropuesta(itemId) {
  const id = String(itemId || '').trim();
  if (!id) return { ok: false, error: 'item_id vacío' };

  const { data, error } = await supabase
    .from('propuesta_calibracion_items')
    .select('*')
    .eq('item_id', id)
    .eq('status', 'pendiente')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return { ok: false, error: error.message };
  const prop = (data && data[0]) || null;
  if (!prop) return { ok: false, error: 'No hay propuesta pendiente para ese ítem' };
  if (Number(prop.n) < MIN_N) {
    return { ok: false, error: `N insuficiente (${prop.n} < ${MIN_N})` };
  }

  const saved = guardarOverride(id, {
    a: prop.a_new,
    b: prop.b_new,
    c: prop.c_new,
    n: prop.n
  });
  if (!saved.ok) return saved;

  await supabase
    .from('propuesta_calibracion_items')
    .update({ status: 'aprobada', applied_at: new Date().toISOString() })
    .eq('item_id', id)
    .eq('status', 'pendiente');

  return { ok: true, override: saved.row, persistido: saved.persistido !== false, aviso: saved.aviso || null };
}
