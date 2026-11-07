// Expediente canónico del estudiante en progreso_estudiantes.
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

export function aliasEstudiante(raw) {
  const texto = String(raw || '').trim().toLowerCase();
  if (!texto) return '';
  return texto.split('@')[0].replace(/[^a-z0-9._-]/g, '').slice(0, 80);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Misma huella que danteRespuestaController.idEstable (sin import circular). */
function idEstableLocal(raw) {
  const texto = String(raw || '').trim();
  if (UUID_RE.test(texto)) return texto.toLowerCase();
  if (!texto) return '';
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

/** Evita dos cierres del mismo bloque (cliente eval_* + servidor mision_daily_*) en <2 min. */
function esSesionCasiIgual(a, b) {
  if (!a || !b) return false;
  if (a.id && b.id && String(a.id) === String(b.id)) return true;
  const ta = Date.parse(a.created_at || '') || 0;
  const tb = Date.parse(b.created_at || '') || 0;
  if (!ta || !tb) return false;
  if (Math.abs(ta - tb) > 120000) return false;
  if (String(a.tipo || '') !== String(b.tipo || '')) return false;
  const pa = Number(a.puntaje);
  const pb = Number(b.puntaje);
  if (Number.isFinite(pa) && Number.isFinite(pb) && Math.abs(pa - pb) <= 20) return true;
  const totA = Number(a.total) || 0;
  const totB = Number(b.total) || 0;
  return totA > 0 && totA === totB && Number(a.aciertos) === Number(b.aciertos);
}

function fusionarHistorialSesiones(previas, nuevas) {
  const out = [];
  const cola = [...(Array.isArray(nuevas) ? nuevas : []), ...(Array.isArray(previas) ? previas : [])];
  cola.forEach((ses) => {
    if (!ses) return;
    if (out.some((x) => esSesionCasiIgual(x, ses))) return;
    out.push(ses);
  });
  return out
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    .slice(0, 80);
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
    .select('id, estudiante, mision_activa, baseline_proyeccion, preguntas_respondidas, items_respondidos, historial_theta, historial_sesiones, simulacro_oficial, historial_simulacros, theta_global, sem_global, racha_dias, onboarding_completed, arquetipo, email, nombre, plan, updated_at, institution_id, percepcion_preparacion, area_mas_segura, tiempo_estudio_semanal, perfil_diagnostico_at, historico_onboarding')
    .eq('estudiante', alias)
    .eq('materia', 'saber_11')
    .maybeSingle();
}

const PERFIL_PREP = {
  A: 'muy_preparado',
  B: 'algo_preparado',
  C: 'poco_preparado',
  D: 'no_preparado'
};
const PERFIL_AREA = {
  A: 'matematicas',
  B: 'lectura_critica',
  C: 'ciencias_naturales',
  D: 'sociales_ingles'
};
const PERFIL_TIEMPO = {
  A: 'menos_1h',
  B: '1_a_3h',
  C: '3_a_5h',
  D: 'mas_5h'
};

/**
 * Guarda el cuadernillo fijo de perfil del diagnóstico inicial (no calificado).
 */
export async function guardarPerfilDiagnostico(alias, payload = {}) {
  const estudiante = aliasEstudiante(alias);
  if (!estudiante) return { ok: false, error: 'sin_estudiante' };

  const letraPrep = String(payload.percepcion || payload.percepcion_preparacion || payload.q1 || '').toUpperCase().slice(0, 1);
  const letraArea = String(payload.area || payload.area_mas_segura || payload.q2 || '').toUpperCase().slice(0, 1);
  const letraTiempo = String(payload.tiempo || payload.tiempo_estudio_semanal || payload.q3 || '').toUpperCase().slice(0, 1);
  if (!PERFIL_PREP[letraPrep] || !PERFIL_AREA[letraArea] || !PERFIL_TIEMPO[letraTiempo]) {
    return { ok: false, error: 'respuestas_incompletas' };
  }

  const percepcion = PERFIL_PREP[letraPrep];
  const area = PERFIL_AREA[letraArea];
  const tiempo = PERFIL_TIEMPO[letraTiempo];
  const ahora = new Date().toISOString();

  const previo = await cargarProgresoSaber(estudiante);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;
  const misionPrev = fila && fila.mision_activa && typeof fila.mision_activa === 'object' ? fila.mision_activa : {};
  const histPrev = fila && fila.historico_onboarding && typeof fila.historico_onboarding === 'object'
    ? fila.historico_onboarding
    : {};

  const perfil = {
    percepcion_preparacion: percepcion,
    area_mas_segura: area,
    tiempo_estudio_semanal: tiempo,
    letras: { q1: letraPrep, q2: letraArea, q3: letraTiempo },
    updatedAt: ahora
  };

  const cuerpo = {
    estudiante,
    estudiante_id: estudiante,
    materia: 'saber_11',
    email: String(payload.email || (fila && fila.email) || `${estudiante}@danteos.edu.co`).trim().toLowerCase(),
    percepcion_preparacion: percepcion,
    area_mas_segura: area,
    tiempo_estudio_semanal: tiempo,
    perfil_diagnostico_at: ahora,
    mision_activa: {
      ...misionPrev,
      perfil_diagnostico: perfil,
      dante_cliente: {
        ...((misionPrev.dante_cliente && typeof misionPrev.dante_cliente === 'object') ? misionPrev.dante_cliente : {}),
        perfilDiagnostico: perfil,
        updatedAt: ahora
      }
    },
    historico_onboarding: {
      ...histPrev,
      perfil_diagnostico: perfil
    },
    updated_at: ahora,
    ultima_actualizacion: ahora,
    institution_id: (fila && fila.institution_id) || 'colegio_sandbox_default',
    onboarding_completed: true
  };

  if (fila && fila.id) {
    const up = await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', fila.id);
    if (up.error) return { ok: false, error: up.error.message };
  } else {
    const ins = await supabase.from('progreso_estudiantes').insert({
      ...cuerpo,
      id: crypto.randomUUID(),
      preguntas_respondidas: 0,
      plan: 'EXPLORADOR',
      items_respondidos: [],
      historial_theta: [],
      historial_sesiones: [],
      simulacro_oficial: null,
      historial_simulacros: []
    });
    if (ins.error) return { ok: false, error: ins.error.message };
  }

  return {
    ok: true,
    perfil: {
      percepcion_preparacion: percepcion,
      area_mas_segura: area,
      tiempo_estudio_semanal: tiempo,
      letras: perfil.letras,
      perfil_diagnostico_at: ahora
    }
  };
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
  const nuevosItems = respuestas.map((r) => {
    const original = String(r.itemId || r.id || '').trim();
    return {
      item_original: original,
      item_id: idEstableLocal(original) || original,
      correcta: Boolean(r.esCorrecta || r.correcto),
      area: String(r.area || r.materia || '').toLowerCase(),
      letra: String(r.letra || r.opcionSeleccionada || '').toUpperCase(),
      tipo: payload.tipo || 'MISION_DIARIA',
      timestamp: new Date().toISOString()
    };
  }).filter((r) => r.item_original && !/^item_\d+$/i.test(r.item_original) && !/^preun_/i.test(r.item_original));

  // Última respuesta gana. Clave = item_original (nunca UUID solo).
  const mapaItems = new Map();
  itemsPrev.forEach((x) => {
    const id = String((x && (x.item_original || x.item_id || x.id)) || '').trim();
    if (id) mapaItems.set(id, x);
  });
  nuevosItems.forEach((item) => mapaItems.set(item.item_original, item));
  const mezclados = Array.from(mapaItems.values());

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
  const histSinDup = fusionarHistorialSesiones(histSesiones, [sesion]);

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
    historial_sesiones: histSinDup,
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

  // Persistir cada respuesta del simulacro en items_respondidos (fuente de Repaso · Fallidas).
  const mapaItems = new Map();
  const prevItems = Array.isArray(fila && fila.items_respondidos) ? fila.items_respondidos : [];
  prevItems.forEach((x) => {
    const id = String((x && (x.item_id || x.item_original || x.id)) || '').trim();
    if (id) mapaItems.set(id, x);
  });
  (Array.isArray(payload.respuestas) ? payload.respuestas : []).forEach((r) => {
    const id = String((r && (r.id || r.itemId || r.item_id)) || '').trim();
    if (!id || /^item_\d+$/i.test(id) || /^preun_/i.test(id)) return;
    if (typeof r.correcto !== 'boolean' && typeof r.correcta !== 'boolean') return;
    mapaItems.set(id, {
      item_original: id,
      item_id: id,
      correcta: r.correcto === true || r.correcta === true,
      area: String((r && (r.area || r.materia)) || '').toLowerCase(),
      letra: String((r && (r.letra || r.opcionSeleccionada)) || '').toUpperCase().slice(0, 1),
      tipo: 'SIMULACRO_COMPLETO',
      timestamp: new Date().toISOString()
    });
  });
  const itemsFusion = Array.from(mapaItems.values()).slice(-4000);

  const cuerpo = {
    estudiante: alias,
    estudiante_id: alias,
    materia: 'saber_11',
    email: correo,
    simulacro_oficial: registro,
    historial_simulacros: historial,
    items_respondidos: itemsFusion,
    preguntas_respondidas: Math.max(Number(fila && fila.preguntas_respondidas) || 0, itemsFusion.length),
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

/**
 * Fase 4 — Checkpoint de simulacro abierto (pausa / sync).
 * No pisa el último simulacro_oficial cerrado; vive en mision_activa.simulacro_abierto.
 */
export async function guardarCheckpointSimulacro(alias, payload) {
  if (!alias || !payload) return { ok: false, error: 'sin_estudiante' };
  const correo = String(payload.email || `${alias}@danteos.edu.co`).trim().toLowerCase();
  const checkpoint = {
    id: String(payload.id || `sim_${Date.now()}`).slice(0, 80),
    estado: 'abierto',
    sesion: Number(payload.sesion) === 2 ? 2 : 1,
    indice: Math.max(0, Math.min(253, Number(payload.indice) || 0)),
    restanteMs: Math.max(0, Number(payload.restanteMs) || 0),
    respuestas_n: Array.isArray(payload.respuestas) ? payload.respuestas.length : (Number(payload.respuestas_n) || 0),
    respuestas: Array.isArray(payload.respuestas)
      ? payload.respuestas.slice(0, 254).map((r) => ({
        id: String((r && r.id) || '').slice(0, 80),
        correcto: Boolean(r && r.correcto),
        materia: String((r && r.materia) || '').slice(0, 40)
      })).filter((r) => r.id)
      : [],
    ids: Array.isArray(payload.ids) ? payload.ids.slice(0, 254).map((id) => String(id).slice(0, 80)) : [],
    actualizado_en: new Date().toISOString()
  };

  const previo = await cargarProgresoSaber(alias);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;
  const misionPrev = fila && fila.mision_activa && typeof fila.mision_activa === 'object' ? fila.mision_activa : {};
  const cuerpo = {
    estudiante: alias,
    estudiante_id: alias,
    materia: 'saber_11',
    email: correo,
    mision_activa: {
      ...misionPrev,
      simulacro_abierto: checkpoint
    },
    updated_at: new Date().toISOString(),
    ultima_actualizacion: new Date().toISOString(),
    institution_id: (fila && fila.institution_id) || 'colegio_sandbox_default'
  };

  if (fila && fila.id) {
    const up = await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', fila.id);
    if (up.error) return { ok: false, error: up.error.message };
    return { ok: true, checkpoint };
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
    onboarding_completed: true,
    simulacro_oficial: null,
    historial_simulacros: []
  });
  if (ins.error) return { ok: false, error: ins.error.message };
  return { ok: true, checkpoint };
}

export async function limpiarCheckpointSimulacro(alias) {
  if (!alias) return { ok: false, error: 'sin_estudiante' };
  const previo = await cargarProgresoSaber(alias);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;
  if (!fila || !fila.id) return { ok: true };
  const misionPrev = fila.mision_activa && typeof fila.mision_activa === 'object' ? fila.mision_activa : {};
  if (!misionPrev.simulacro_abierto) return { ok: true };
  const mision = { ...misionPrev };
  delete mision.simulacro_abierto;
  const up = await supabase.from('progreso_estudiantes').update({
    mision_activa: mision,
    updated_at: new Date().toISOString()
  }).eq('id', fila.id);
  if (up.error) return { ok: false, error: up.error.message };
  return { ok: true };
}

function numONulo(v, min, max) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (min != null && n < min) return null;
  if (max != null && n > max) return null;
  return n;
}

function limpiarSnapshotCliente(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const history = Array.isArray(s.history) ? s.history.slice(0, 40).map((h) => {
    if (!h || typeof h !== 'object') return null;
    return {
      id: String(h.id || '').slice(0, 80),
      created_at: String(h.created_at || h.createdAt || '').slice(0, 40),
      tipo: String(h.tipo || '').slice(0, 40),
      materia: String(h.materia || '').slice(0, 80),
      puntaje_escalonado: numONulo(h.puntaje_escalonado ?? h.puntaje, 0, 500),
      theta: numONulo(h.theta, -6, 6),
      sem: numONulo(h.sem, 0, 10),
      aciertos: numONulo(h.aciertos, 0, 500),
      total: numONulo(h.total, 0, 500),
      precision: numONulo(h.precision, 0, 100),
      precisionPorArea: h.precisionPorArea && typeof h.precisionPorArea === 'object' ? h.precisionPorArea : undefined
    };
  }).filter((h) => h && h.id) : [];

  const areaConteo = {};
  if (s.areaConteo && typeof s.areaConteo === 'object') {
    Object.entries(s.areaConteo).slice(0, 40).forEach(([k, v]) => {
      const key = String(k || '').toLowerCase().replace(/\s+/g, '_').slice(0, 60);
      if (!key || !v || typeof v !== 'object') return;
      const total = Math.max(0, Math.round(Number(v.total) || 0));
      const aciertos = Math.max(0, Math.round(Number(v.aciertos) || 0));
      if (!total) return;
      areaConteo[key] = { total, aciertos: Math.min(aciertos, total) };
    });
  }

  const calendario = ['CAL_A', 'CAL_B', 'CUSTOM', 'LIBRE'].includes(String(s.calendario || ''))
    ? String(s.calendario)
    : '';

  return {
    v: 1,
    updatedAt: String(s.updatedAt || new Date().toISOString()).slice(0, 40),
    score: numONulo(s.score, 0, 500),
    racha: Math.max(0, Math.round(numONulo(s.racha, 0, 3650) || 0)),
    meta: String(s.meta || '').slice(0, 40),
    calendario,
    modoLibre: Boolean(s.modoLibre) || calendario === 'LIBRE',
    fechaTexto: String(s.fechaTexto || '').slice(0, 80),
    theta: numONulo(s.theta, -6, 6),
    sem: numONulo(s.sem, 0, 10),
    preguntasLocal: Math.max(0, Math.round(numONulo(s.preguntasLocal, 0, 20000) || 0)),
    areaConteo,
    history
  };
}

export function snapshotDesdeFila(fila) {
  if (!fila) return null;
  const mision = fila.mision_activa && typeof fila.mision_activa === 'object' ? fila.mision_activa : {};
  const guardado = mision.dante_cliente && typeof mision.dante_cliente === 'object'
    ? limpiarSnapshotCliente(mision.dante_cliente)
    : null;
  const scoreDb = numONulo(fila.baseline_proyeccion, 0, 500);
  const rachaDb = Math.max(0, Math.round(numONulo(fila.racha_dias, 0, 3650) || 0));
  const historyDb = Array.isArray(fila.historial_sesiones)
    ? fila.historial_sesiones.slice(0, 40).map((ses) => ({
      id: String((ses && ses.id) || '').slice(0, 80),
      created_at: String((ses && ses.created_at) || '').slice(0, 40),
      tipo: String((ses && ses.tipo) || '').slice(0, 40),
      materia: String((ses && ses.tipo) || 'SESION').slice(0, 80),
      puntaje_escalonado: numONulo(ses && ses.puntaje, 0, 500),
      theta: numONulo(ses && ses.theta, -6, 6),
      sem: numONulo(ses && ses.sem, 0, 10),
      aciertos: numONulo(ses && ses.aciertos, 0, 500),
      total: numONulo(ses && ses.total, 0, 500),
      precision: numONulo(ses && ses.precisionPorcentaje, 0, 100),
      precisionPorArea: ses && ses.precisionPorArea
    })).filter((h) => h.id)
    : [];

  const base = guardado || {
    v: 1,
    updatedAt: String(fila.updated_at || fila.ultima_actualizacion || new Date().toISOString()).slice(0, 40),
    score: null,
    racha: 0,
    meta: String(mision.meta || '').slice(0, 40),
    calendario: ['CAL_A', 'CAL_B', 'CUSTOM', 'LIBRE'].includes(String(mision.calendario || ''))
      ? String(mision.calendario)
      : '',
    modoLibre: String(mision.calendario || '') === 'LIBRE',
    fechaTexto: String(mision.fecha || '').slice(0, 80),
    theta: numONulo(fila.theta_global, -6, 6),
    sem: numONulo(fila.sem_global, 0, 10),
    preguntasLocal: Math.max(0, Math.round(numONulo(fila.preguntas_respondidas, 0, 20000) || 0)),
    areaConteo: {},
    history: []
  };

  const histMap = new Map();
  [...historyDb, ...(base.history || [])].forEach((h) => {
    if (!h || !h.id) return;
    if (!histMap.has(h.id)) histMap.set(h.id, h);
  });

  return {
    ...base,
    score: base.score != null ? base.score : scoreDb,
    racha: Math.max(base.racha || 0, rachaDb),
    theta: base.theta != null ? base.theta : numONulo(fila.theta_global, -6, 6),
    sem: base.sem != null ? base.sem : numONulo(fila.sem_global, 0, 10),
    preguntasLocal: Math.max(base.preguntasLocal || 0, Math.round(numONulo(fila.preguntas_respondidas, 0, 20000) || 0)),
    history: Array.from(histMap.values()).slice(0, 40),
    updatedAt: base.updatedAt || String(fila.updated_at || new Date().toISOString()).slice(0, 40)
  };
}

/**
 * Dual-write del snapshot de cliente (localStorage) sin pisar misión ni borrar progreso.
 */
export async function guardarSnapshotCliente(alias, snapshotRaw = {}) {
  const estudiante = aliasEstudiante(alias);
  if (!estudiante) return { ok: false, error: 'sin_estudiante' };

  const snap = limpiarSnapshotCliente(snapshotRaw);
  const previo = await cargarProgresoSaber(estudiante);
  if (previo.error) return { ok: false, error: previo.error.message };
  const fila = previo.data;
  const misionPrev = fila && fila.mision_activa && typeof fila.mision_activa === 'object'
    ? fila.mision_activa
    : {};
  const prevCliente = misionPrev.dante_cliente && typeof misionPrev.dante_cliente === 'object'
    ? limpiarSnapshotCliente(misionPrev.dante_cliente)
    : null;

  const prevTs = Date.parse((prevCliente && prevCliente.updatedAt) || '') || 0;
  const newTs = Date.parse(snap.updatedAt) || Date.now();
  // Si el servidor tiene un snapshot más nuevo con más evidencias, no lo pisamos.
  if (prevCliente && prevTs > newTs + 2000) {
    const prevN = (prevCliente.preguntasLocal || 0) + ((prevCliente.history && prevCliente.history.length) || 0);
    const newN = (snap.preguntasLocal || 0) + ((snap.history && snap.history.length) || 0);
    if (prevN >= newN) {
      return { ok: true, skipped: true, snapshot: snapshotDesdeFila(fila) };
    }
  }

  const histPrev = Array.isArray(fila && fila.historial_sesiones) ? fila.historial_sesiones : [];
  const histDesdeSnap = (snap.history || []).map((h) => ({
    id: h.id,
    tipo: h.tipo || 'SESION',
    created_at: h.created_at || snap.updatedAt,
    puntaje: h.puntaje_escalonado,
    theta: h.theta,
    sem: h.sem,
    aciertos: h.aciertos || 0,
    total: h.total || 0,
    precisionPorcentaje: h.precision,
    precisionPorArea: h.precisionPorArea || {}
  })).filter((h) => h && h.id);
  const histSesiones = fusionarHistorialSesiones(histPrev, histDesdeSnap);

  const scoreDb = numONulo(fila && fila.baseline_proyeccion, 0, 500);
  let baseline = scoreDb;
  if (snap.score != null) {
    if (scoreDb == null) baseline = Math.round(snap.score);
    else if (newTs >= prevTs) baseline = Math.round(snap.score);
  }

  const rachaDb = Math.max(0, Math.round(numONulo(fila && fila.racha_dias, 0, 3650) || 0));
  const racha = Math.max(rachaDb, snap.racha || 0);

  const mision = { ...misionPrev };
  if (snap.meta && !mision.meta) mision.meta = snap.meta;
  if (snap.calendario && !mision.calendario) mision.calendario = snap.calendario;
  if (snap.fechaTexto && !mision.fecha) mision.fecha = snap.fechaTexto;
  if (snap.modoLibre && !mision.calendario) mision.calendario = 'LIBRE';

  const histMerged = [];
  const seenH = new Set();
  [...(snap.history || []), ...((prevCliente && prevCliente.history) || [])].forEach((h) => {
    if (!h || !h.id || seenH.has(h.id)) return;
    seenH.add(h.id);
    histMerged.push(h);
  });

  const areaMerged = { ...((prevCliente && prevCliente.areaConteo) || {}) };
  Object.entries(snap.areaConteo || {}).forEach(([k, v]) => {
    const prev = areaMerged[k];
    if (!prev || (v.total || 0) >= (prev.total || 0)) areaMerged[k] = v;
  });

  mision.dante_cliente = {
    ...snap,
    score: snap.score != null ? snap.score : (prevCliente && prevCliente.score),
    racha,
    areaConteo: areaMerged,
    history: histMerged.slice(0, 40),
    updatedAt: new Date(Math.max(newTs, prevTs, Date.now())).toISOString()
  };

  const cuerpo = {
    estudiante,
    estudiante_id: estudiante,
    materia: 'saber_11',
    email: String((fila && fila.email) || `${estudiante}@danteos.edu.co`).trim().toLowerCase(),
    mision_activa: mision,
    baseline_proyeccion: baseline,
    racha_dias: racha,
    historial_sesiones: histSesiones,
    theta_global: snap.theta != null ? snap.theta : (fila && fila.theta_global),
    sem_global: snap.sem != null ? snap.sem : (fila && fila.sem_global),
    updated_at: new Date().toISOString(),
    ultima_actualizacion: new Date().toISOString(),
    institution_id: (fila && fila.institution_id) || 'colegio_sandbox_default',
    onboarding_completed: true
  };

  if (fila && fila.id) {
    const up = await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', fila.id);
    if (up.error) return { ok: false, error: up.error.message };
  } else {
    const ins = await supabase.from('progreso_estudiantes').insert({
      ...cuerpo,
      id: crypto.randomUUID(),
      preguntas_respondidas: snap.preguntasLocal || 0,
      plan: 'EXPLORADOR',
      items_respondidos: [],
      historial_theta: [],
      simulacro_oficial: null,
      historial_simulacros: []
    });
    if (ins.error) return { ok: false, error: ins.error.message };
  }

  const fresco = await cargarProgresoSaber(estudiante);
  return { ok: true, snapshot: snapshotDesdeFila(fresco.data) };
}
