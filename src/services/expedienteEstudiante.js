// Expediente canónico del estudiante en progreso_estudiantes.
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

export function aliasEstudiante(raw) {
  const texto = String(raw || '').trim().toLowerCase();
  if (!texto) return '';
  return texto.split('@')[0].replace(/[^a-z0-9._-]/g, '').slice(0, 80);
}

export function estudianteDesdeRequest(req, body = {}) {
  const user = req.user || {};
  const crudo = user.estudiante || user.studentId || user.email || user.id
    || body.studentId || body.estudiante || body.email
    || req.headers?.['x-student-id'] || '';
  return aliasEstudiante(crudo);
}

export async function cargarProgresoSaber(alias) {
  if (!alias) return { data: null, error: null };
  return supabase
    .from('progreso_estudiantes')
    .select('id, estudiante, mision_activa, baseline_proyeccion, preguntas_respondidas, items_respondidos, historial_theta, historial_sesiones, simulacro_oficial, historial_simulacros, theta_global, sem_global, racha_dias, onboarding_completed, arquetipo, email, nombre, plan, updated_at, institution_id')
    .eq('estudiante', alias)
    .eq('materia', 'saber_11')
    .maybeSingle();
}

/**
 * Anota diagnóstico, entrenamiento o refuerzo en el expediente canónico (saber_11).
 */
export async function registrarSesionExpediente(alias, payload = {}) {
  const estudiante = aliasEstudiante(alias);
  if (!estudiante) return { ok: false, error: 'sin_estudiante' };

  const previo = await cargarProgresoSaber(estudiante);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;

  const respuestas = Array.isArray(payload.respuestas) ? payload.respuestas : [];
  const itemsPrev = Array.isArray(fila && fila.items_respondidos) ? fila.items_respondidos : [];
  const nuevosItems = respuestas.map((r) => ({
    item_original: String(r.itemId || r.id || '').trim(),
    item_id: String(r.itemId || r.id || '').trim(),
    correcta: Boolean(r.esCorrecta || r.correcto),
    area: String(r.area || r.materia || '').toLowerCase(),
    letra: String(r.letra || r.opcionSeleccionada || '').toUpperCase(),
    tipo: payload.tipo || 'MISION_DIARIA',
    timestamp: new Date().toISOString()
  })).filter((r) => r.item_original);

  const vistos = new Set(itemsPrev.map((x) => String((x && (x.item_original || x.item_id || x.id)) || '')));
  const mezclados = itemsPrev.slice();
  nuevosItems.forEach((item) => {
    if (!vistos.has(item.item_original)) {
      vistos.add(item.item_original);
      mezclados.push(item);
    }
  });

  const histTheta = Array.isArray(fila && fila.historial_theta) ? fila.historial_theta.slice(-39) : [];
  if (Number.isFinite(Number(payload.theta))) histTheta.push(Math.round(Number(payload.theta) * 1000) / 1000);

  const sesion = {
    id: String(payload.misionId || `ses_${Date.now()}`).slice(0, 80),
    tipo: payload.tipo || 'MISION_DIARIA',
    created_at: new Date().toISOString(),
    puntaje: payload.puntaje == null ? null : Number(payload.puntaje),
    theta: payload.theta == null ? null : Number(payload.theta),
    sem: payload.sem == null ? null : Number(payload.sem),
    aciertos: Number(payload.aciertos) || 0,
    total: Number(payload.total) || 0,
    precisionPorcentaje: payload.precisionPorcentaje == null ? null : Number(payload.precisionPorcentaje),
    precisionPorArea: payload.precisionPorArea || {}
  };
  const histSesiones = Array.isArray(fila && fila.historial_sesiones) ? fila.historial_sesiones.slice() : [];
  const histSinDup = histSesiones.filter((x) => x && x.id !== sesion.id);
  histSinDup.unshift(sesion);

  const preguntasPrev = Number(fila && fila.preguntas_respondidas) || 0;
  const cuerpo = {
    estudiante,
    estudiante_id: estudiante,
    materia: 'saber_11',
    email: String(payload.email || (fila && fila.email) || `${estudiante}@danteos.edu.co`).trim().toLowerCase(),
    theta_global: Number.isFinite(Number(payload.theta)) ? Number(payload.theta) : (fila && fila.theta_global),
    sem_global: Number.isFinite(Number(payload.sem)) ? Number(payload.sem) : (fila && fila.sem_global),
    baseline_proyeccion: Number.isFinite(Number(payload.puntaje)) ? Math.round(Number(payload.puntaje)) : (fila && fila.baseline_proyeccion),
    preguntas_respondidas: preguntasPrev + nuevosItems.length,
    items_respondidos: mezclados.slice(-4000),
    historial_theta: histTheta,
    historial_sesiones: histSinDup.slice(0, 80),
    racha_dias: Number.isFinite(Number(payload.rachaDias)) ? Number(payload.rachaDias) : (fila && fila.racha_dias) || 0,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
    ultima_actualizacion: new Date().toISOString(),
    institution_id: (fila && fila.institution_id) || 'colegio_sandbox_default'
  };

  if (fila && fila.id) {
    const up = await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', fila.id);
    if (up.error) return { ok: false, error: up.error.message };
    return { ok: true, sesion };
  }

  const ins = await supabase.from('progreso_estudiantes').insert({
    ...cuerpo,
    id: crypto.randomUUID(),
    plan: 'EXPLORADOR',
    simulacro_oficial: null,
    historial_simulacros: []
  });
  if (ins.error) return { ok: false, error: ins.error.message };
  return { ok: true, sesion };
}

export async function guardarSimulacroOficial(alias, payload) {
  if (!alias || !payload) return { ok: false, error: 'sin_estudiante' };
  const correo = String(payload.email || `${alias}@danteos.edu.co`).trim().toLowerCase();
  const registro = {
    id: String(payload.id || `sim_${Date.now()}`).slice(0, 80),
    global: payload.global == null ? null : Number(payload.global),
    areas: payload.areas && typeof payload.areas === 'object' ? payload.areas : {},
    completo: Boolean(payload.completo),
    por_tiempo: Boolean(payload.por_tiempo),
    respuestas_n: Number(payload.respuestas_n) || 0,
    cerrado_en: new Date().toISOString()
  };

  const previo = await cargarProgresoSaber(alias);
  if (previo.error) return { ok: false, error: previo.error.message };

  const fila = previo.data;
  const historialPrev = Array.isArray(fila && fila.historial_simulacros) ? fila.historial_simulacros : [];
  const historial = [...historialPrev.filter((x) => x && x.id !== registro.id), registro].slice(-20);
  const cuerpo = {
    estudiante: alias,
    estudiante_id: alias,
    materia: 'saber_11',
    email: correo,
    simulacro_oficial: registro,
    historial_simulacros: historial,
    updated_at: new Date().toISOString(),
    ultima_actualizacion: new Date().toISOString(),
    institution_id: (fila && fila.institution_id) || 'colegio_sandbox_default'
  };

  if (fila && fila.id) {
    const up = await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', fila.id).select('simulacro_oficial').maybeSingle();
    if (up.error) return { ok: false, error: up.error.message };
    return { ok: true, simulacro: up.data && up.data.simulacro_oficial ? up.data.simulacro_oficial : registro };
  }

  const ins = await supabase.from('progreso_estudiantes').insert({
    ...cuerpo,
    id: crypto.randomUUID(),
    theta_global: null,
    sem_global: null,
    baseline_proyeccion: null,
    preguntas_respondidas: 0,
    racha_dias: 0,
    plan: 'EXPLORADOR',
    items_respondidos: [],
    onboarding_completed: true
  }).select('simulacro_oficial').maybeSingle();
  if (ins.error) return { ok: false, error: ins.error.message };
  return { ok: true, simulacro: ins.data && ins.data.simulacro_oficial ? ins.data.simulacro_oficial : registro };
}
