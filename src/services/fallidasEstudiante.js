/**
 * Fallidas reales del alumno.
 * Solo cuentan respuestas de sesiones reales (diagnóstico, entrenamiento,
 * refuerzo, simulacro, repaso). Nunca RESPALDO_LOCAL ni rellenos del banco.
 */
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { aliasEstudiante, cargarProgresoSaber } from './expedienteEstudiante.js';

const TIPOS_REALES = new Set([
  'MISION_DIARIA',
  'REFUERZO',
  'REPASO_FALLIDAS',
  'SIMULACRO',
  'SIMULACRO_COMPLETO',
  'DIAGNOSTICO_INICIAL',
  'DIAGNOSTICO',
  'ENTRENAMIENTO'
]);

const TIPOS_IGNORAR = new Set([
  'RESPALDO_LOCAL',
  'RESPUESTA',
  'SESION'
]);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function idEstableFallida(raw) {
  const texto = String(raw || '').trim();
  if (!texto || /^item_\d+$/i.test(texto) || /^preun_/i.test(texto)) return '';
  if (texto === 'undefined' || texto === 'null') return '';
  if (UUID.test(texto)) return texto.toLowerCase();
  let h1 = 2166136261;
  let h2 = 2166136261 ^ 0x9e3779b9;
  const serie = `dante:${texto}`;
  for (let i = 0; i < serie.length; i++) {
    h1 ^= serie.charCodeAt(i);
    h1 = Math.imul(h1, 16777619);
    h2 ^= serie.charCodeAt(serie.length - 1 - i);
    h2 = Math.imul(h2, 16777619);
  }
  const hex = [(h1 >>> 0), (h2 >>> 0), ((h1 ^ h2) >>> 0), ((h1 + h2) >>> 0)]
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('');
  const chars = hex.split('');
  chars[12] = '5';
  chars[16] = 'a';
  const h = chars.join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function idItem(raw) {
  if (raw && typeof raw === 'object') {
    return idEstableFallida(raw.item_original || raw.item_id || raw.id || raw.itemId);
  }
  return idEstableFallida(raw);
}

function esCorrecta(row) {
  if (!row) return null;
  if (typeof row.correcta === 'boolean') return row.correcta;
  if (typeof row.correcto === 'boolean') return row.correcto;
  if (typeof row.is_correct === 'boolean') return row.is_correct;
  if (row.correcta === 'true') return true;
  if (row.correcta === 'false') return false;
  return null;
}

function tipoEsReal(tipo) {
  const t = String(tipo || '').toUpperCase().trim();
  if (!t) return false;
  if (TIPOS_IGNORAR.has(t)) return false;
  return TIPOS_REALES.has(t);
}

/**
 * Último resultado por ítem, solo sesiones reales.
 * Pendiente = última respuesta real fue incorrecta.
 */
export function pendientesDesdeItems(lista) {
  const mapa = new Map();
  (Array.isArray(lista) ? lista : []).forEach((row) => {
    if (!tipoEsReal(row && row.tipo)) return;
    const id = idItem(row);
    if (!id) return;
    const ok = esCorrecta(row);
    if (ok === null) return;
    const ts = Date.parse((row && (row.timestamp || row.created_at)) || '') || 0;
    const prev = mapa.get(id);
    if (prev && prev.ts > ts) return;
    mapa.set(id, {
      id,
      area: String((row && (row.area || row.materia || row.skill)) || '').toLowerCase(),
      correcta: ok,
      letra: String((row && (row.letra || row.opcion_marcada || row.opcionSeleccionada)) || '').toUpperCase().slice(0, 1),
      tipo: String((row && row.tipo) || 'MISION_DIARIA').toUpperCase(),
      timestamp: (row && (row.timestamp || row.created_at)) || null,
      ts,
      item_original: String((row && (row.item_original || row.id)) || id)
    });
  });

  const pendientes = [];
  mapa.forEach((fila) => {
    if (fila.correcta === false) {
      pendientes.push({
        id: fila.item_original || fila.id,
        item_id: fila.id,
        area: fila.area,
        letra: fila.letra,
        tipo: fila.tipo,
        timestamp: fila.timestamp
      });
    }
  });
  pendientes.sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
  return pendientes;
}

export async function listarFallidasAlumno(aliasRaw) {
  const alias = aliasEstudiante(aliasRaw);
  if (!alias) return { ok: false, error: 'sin_estudiante', pendientes: [], total: 0 };

  const { data, error } = await cargarProgresoSaber(alias);
  if (error) return { ok: false, error: error.message, pendientes: [], total: 0 };

  const items = data && Array.isArray(data.items_respondidos) ? data.items_respondidos : [];
  // Solo progreso canónico de sesiones reales. Sin eventos ni RESPALDO_LOCAL.
  const pendientes = pendientesDesdeItems(items);

  return {
    ok: true,
    estudiante: alias,
    pendientes,
    total: pendientes.length,
    ids: pendientes.map((p) => p.id)
  };
}

/**
 * Upsert de respuestas reales. Última gana.
 * No permite que un false pise un true más reciente del mismo ítem.
 */
export async function upsertRespuestasAlumno(aliasRaw, respuestas, meta = {}) {
  const alias = aliasEstudiante(aliasRaw);
  if (!alias) return { ok: false, error: 'sin_estudiante' };

  const tipo = String(meta.tipo || 'MISION_DIARIA').toUpperCase().slice(0, 40);
  if (TIPOS_IGNORAR.has(tipo) || !tipoEsReal(tipo)) {
    // No escribir ruido de respaldo en el ledger de fallidas.
    const { data } = await cargarProgresoSaber(alias);
    const items = data && Array.isArray(data.items_respondidos) ? data.items_respondidos : [];
    const pendientes = pendientesDesdeItems(items);
    return { ok: true, actualizados: 0, pendientes, total: pendientes.length, ids: pendientes.map((p) => p.id) };
  }

  const ahora = Date.now();
  const nuevas = (Array.isArray(respuestas) ? respuestas : [])
    .map((r) => {
      const original = String((r && (r.id || r.itemId || r.item_original || r.item_id)) || '').trim();
      const id = idEstableFallida(original);
      if (!id) return null;
      const ok = typeof r.correcto === 'boolean'
        ? r.correcto
        : (typeof r.correcta === 'boolean' ? r.correcta : null);
      if (ok === null) return null;
      if (r.calificacionPendiente === true) return null;
      return {
        item_original: original || id,
        item_id: id,
        correcta: ok === true,
        area: String(r.area || r.materia || '').toLowerCase().slice(0, 40),
        letra: String(r.letra || r.opcionSeleccionada || '').toUpperCase().slice(0, 1),
        tipo,
        a: Number(r.a) || null,
        b: Number(r.b) || null,
        c: Number(r.c) || null,
        tiempo: Number(r.ms || r.tiempo || r.latenciaMs) || 0,
        timestamp: new Date(ahora).toISOString()
      };
    })
    .filter(Boolean);

  if (!nuevas.length) {
    const { data } = await cargarProgresoSaber(alias);
    const items = data && Array.isArray(data.items_respondidos) ? data.items_respondidos : [];
    const pendientes = pendientesDesdeItems(items);
    return { ok: true, actualizados: 0, pendientes, total: pendientes.length, ids: pendientes.map((p) => p.id) };
  }

  const previo = await cargarProgresoSaber(alias);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;

  const mapa = new Map();
  const listaPrev = fila && Array.isArray(fila.items_respondidos) ? fila.items_respondidos : [];
  listaPrev.forEach((row) => {
    const id = idItem(row);
    if (id) mapa.set(id, row);
  });
  nuevas.forEach((row) => {
    const prev = mapa.get(row.item_id);
    if (prev) {
      const tsPrev = Date.parse(prev.timestamp || prev.created_at || '') || 0;
      const tsNew = Date.parse(row.timestamp) || ahora;
      // Nunca dejar que un fallo viejo pise un acierto más nuevo.
      if (esCorrecta(prev) === true && row.correcta === false && tsPrev > tsNew) return;
    }
    mapa.set(row.item_id, row);
  });
  const items = Array.from(mapa.values()).slice(-4000);

  const cuerpo = {
    estudiante: alias,
    estudiante_id: alias,
    materia: 'saber_11',
    email: String(meta.email || (fila && fila.email) || `${alias}@danteos.edu.co`).trim().toLowerCase(),
    items_respondidos: items,
    preguntas_respondidas: items.length,
    updated_at: new Date().toISOString(),
    ultima_actualizacion: new Date().toISOString(),
    institution_id: (fila && fila.institution_id) || 'colegio_sandbox_default',
    onboarding_completed: true
  };
  if (Number.isFinite(Number(meta.theta))) cuerpo.theta_global = Number(meta.theta);
  if (Number.isFinite(Number(meta.sem))) cuerpo.sem_global = Number(meta.sem);
  if (Number.isFinite(Number(meta.puntaje))) cuerpo.baseline_proyeccion = Math.round(Number(meta.puntaje));

  if (fila && fila.id) {
    const up = await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', fila.id);
    if (up.error) return { ok: false, error: up.error.message };
  } else {
    const ins = await supabase.from('progreso_estudiantes').insert({
      ...cuerpo,
      id: crypto.randomUUID(),
      plan: 'EXPLORADOR',
      racha_dias: 0,
      historial_theta: [],
      historial_sesiones: [],
      simulacro_oficial: null,
      historial_simulacros: []
    });
    if (ins.error) return { ok: false, error: ins.error.message };
  }

  try {
    const eventos = nuevas.map((row) => ({
      id: crypto.randomUUID(),
      student_id: alias,
      item_id: row.item_id,
      skill: row.area || null,
      is_correct: row.correcta === true,
      response_time: row.tiempo > 0 ? Math.round(row.tiempo / 1000) : null,
      opcion_marcada: row.letra || null,
      declared_confidence: 'media',
      institution_id: 'colegio_sandbox_default',
      selection_vector: [
        { opcion: row.letra || '', timestamp_relativo: 0 },
        { area: row.area, tipo, item_original: row.item_original }
      ],
      created_at: row.timestamp
    }));
    if (eventos.length) await supabase.from('registro_eventos').insert(eventos);
  } catch (eEv) {}

  const pendientes = pendientesDesdeItems(items);
  return {
    ok: true,
    actualizados: nuevas.length,
    pendientes,
    total: pendientes.length,
    ids: pendientes.map((p) => p.id)
  };
}
