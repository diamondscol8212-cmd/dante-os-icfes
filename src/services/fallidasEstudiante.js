/**
 * Fallidas reales del alumno desde progreso_estudiantes.items_respondidos.
 * Solo ítems con registro de respuesta incorrecta (última versión por item_id).
 */
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { aliasEstudiante, cargarProgresoSaber } from './expedienteEstudiante.js';

const TIPOS_VALIDOS = new Set([
  'MISION_DIARIA',
  'REFUERZO',
  'REPASO_FALLIDAS',
  'SIMULACRO',
  'SIMULACRO_COMPLETO',
  'DIAGNOSTICO_INICIAL',
  'DIAGNOSTICO',
  'RESPUESTA',
  'SESION',
  'RESPALDO_LOCAL',
  'ENTRENAMIENTO'
]);

function idItem(raw) {
  const id = String((raw && (raw.item_id || raw.item_original || raw.id || raw.itemId)) || '').trim();
  if (!id) return '';
  if (/^item_\d+$/i.test(id)) return '';
  if (/^preun_/i.test(id)) return '';
  if (id === 'undefined' || id === 'null') return '';
  return id.slice(0, 80);
}

function esCorrecta(row) {
  if (!row) return null;
  if (typeof row.correcta === 'boolean') return row.correcta;
  if (typeof row.correcto === 'boolean') return row.correcto;
  if (typeof row.is_correct === 'boolean') return row.is_correct;
  if (row.correcta === 'true' || row.correcta === true) return true;
  if (row.correcta === 'false' || row.correcta === false) return false;
  return null;
}

function tipoOk(tipo) {
  const t = String(tipo || '').toUpperCase().trim();
  if (!t) return true; // sin tipo: se acepta si hay evidencia de fallo
  return TIPOS_VALIDOS.has(t);
}

/**
 * Último estado por ítem. Pendiente = última respuesta fue incorrecta.
 */
export function pendientesDesdeItems(lista) {
  const mapa = new Map();
  (Array.isArray(lista) ? lista : []).forEach((row) => {
    const id = idItem(row);
    if (!id) return;
    if (!tipoOk(row && row.tipo)) return;
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
      ts
    });
  });

  const pendientes = [];
  mapa.forEach((fila) => {
    if (fila.correcta === false) {
      pendientes.push({
        id: fila.id,
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
  let pendientes = pendientesDesdeItems(items);

  // Complemento: eventos recientes del alumno (si progreso está vacío o desfasado).
  // Solo se usan si el ítem no está ya resuelto (correcta=true) en items_respondidos.
  try {
    const { data: eventos, error: errEv } = await supabase
      .from('registro_eventos')
      .select('item_id,is_correct,created_at,skill,opcion_marcada')
      .eq('student_id', alias)
      .order('created_at', { ascending: true })
      .limit(800);
    if (!errEv && Array.isArray(eventos) && eventos.length) {
      const comoItems = eventos.map((ev) => ({
        item_id: ev.item_id,
        item_original: ev.item_id,
        correcta: ev.is_correct === true,
        area: ev.skill || '',
        letra: ev.opcion_marcada || '',
        tipo: 'RESPUESTA',
        timestamp: ev.created_at
      }));
      // Fusionar: items_respondidos gana si tiene el id; si no, eventos aportan.
      const idsEnProgreso = new Set(
        items.map((r) => idItem(r)).filter(Boolean)
      );
      const soloNuevosDeEventos = comoItems.filter((r) => !idsEnProgreso.has(idItem(r)));
      pendientes = pendientesDesdeItems([...items, ...soloNuevosDeEventos]);
    }
  } catch (e) {
    // Sin eventos: nos quedamos con progreso.
  }

  return {
    ok: true,
    estudiante: alias,
    pendientes,
    total: pendientes.length,
    ids: pendientes.map((p) => p.id)
  };
}

/**
 * Upsert de respuestas del alumno en progreso_estudiantes (última gana).
 * Usado por repaso de fallidas y por simulacro al cerrar.
 */
export async function upsertRespuestasAlumno(aliasRaw, respuestas, meta = {}) {
  const alias = aliasEstudiante(aliasRaw);
  if (!alias) return { ok: false, error: 'sin_estudiante' };

  const tipo = String(meta.tipo || 'MISION_DIARIA').toUpperCase().slice(0, 40);
  const nuevas = (Array.isArray(respuestas) ? respuestas : [])
    .map((r) => {
      const id = idItem(r);
      if (!id) return null;
      const ok = typeof r.correcto === 'boolean'
        ? r.correcto
        : (typeof r.correcta === 'boolean' ? r.correcta : null);
      if (ok === null) return null;
      if (r.calificacionPendiente === true) return null;
      return {
        item_original: id,
        item_id: id,
        correcta: ok === true,
        area: String(r.area || r.materia || '').toLowerCase().slice(0, 40),
        letra: String(r.letra || r.opcionSeleccionada || '').toUpperCase().slice(0, 1),
        tipo,
        a: Number(r.a) || null,
        b: Number(r.b) || null,
        c: Number(r.c) || null,
        tiempo: Number(r.ms || r.tiempo || r.latenciaMs) || 0,
        timestamp: new Date().toISOString()
      };
    })
    .filter(Boolean);

  if (!nuevas.length) return { ok: true, actualizados: 0, pendientes: [], total: 0 };

  const previo = await cargarProgresoSaber(alias);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;

  const mapa = new Map();
  const listaPrev = fila && Array.isArray(fila.items_respondidos) ? fila.items_respondidos : [];
  listaPrev.forEach((row) => {
    const id = idItem(row);
    if (id) mapa.set(id, row);
  });
  nuevas.forEach((row) => mapa.set(row.item_id, row));
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

  // Eventos: insertar reintentos (no bloquear si el id ya existía).
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
    if (eventos.length) {
      await supabase.from('registro_eventos').insert(eventos);
    }
  } catch (eEv) {
    // El progreso ya quedó; eventos son complemento.
  }

  const pendientes = pendientesDesdeItems(items);
  return {
    ok: true,
    actualizados: nuevas.length,
    pendientes,
    total: pendientes.length,
    ids: pendientes.map((p) => p.id)
  };
}
