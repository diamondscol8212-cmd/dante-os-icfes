// 🚀 src/routes/dailyRoutes.js - Enrutador Oficial de Misión Diaria (ESM)
// Dante OS Enterprise Edition v23.1

import { Router } from 'express';
import { optionalToken, verifyToken } from '../middleware.js';
import { obtenerMisionDiaria, completarMisionDiaria, obtenerPistaTutorSocratico } from '../controllers/dailyMissionController.js';
import { guardarRespuestas, calificarRespuesta } from '../controllers/danteRespuestaController.js';
import { calificarSimulacro, armarCuadernillo } from '../services/cat/puntajeOficial.js';
import { sanitizeItemsCollection } from '../security/sanitizer.js';
import {
  estudianteDesdeRequest,
  cargarProgresoSaber,
  guardarSimulacroOficial
} from '../services/expedienteEstudiante.js';
import { supabase } from '../../supabaseClient.js';

const router = Router();

/**
 * 🪐 RUTAS OFICIALES DE LA MISIÓN DIARIA (25 MINUTOS)
 */

// Obtener la misión diaria adaptativa (10 reactivos + 1 dilema vocacional)
router.get('/daily-mission', optionalToken, obtenerMisionDiaria);
router.post('/daily-mission', optionalToken, obtenerMisionDiaria);
router.get('/mision-diaria', optionalToken, obtenerMisionDiaria);
router.post('/mision-diaria', optionalToken, obtenerMisionDiaria);

// Completar, calificar y registrar el avance de la misión diaria
router.post('/complete-mission', optionalToken, completarMisionDiaria);
router.post('/completar-mision', optionalToken, completarMisionDiaria);

// Solicitud de pista / retroalimentación socrática adaptativa (Gemini Flash)
router.post('/tutor-hint', optionalToken, obtenerPistaTutorSocratico);
router.post('/pista-socratica', optionalToken, obtenerPistaTutorSocratico);

router.post('/calificar', optionalToken, calificarRespuesta);

router.get('/simulacro', optionalToken, (req, res) => {
  const semilla = Number(req.query && req.query.semilla) || 0xD4E705;
  const reactivos = armarCuadernillo(semilla);
  if (!reactivos) return res.status(409).json({ ok: false });
  return res.json({
    ok: true,
    ids: reactivos.map((item) => item.id),
    reactivos: sanitizeItemsCollection(reactivos)
  });
});

router.post('/simulacro/puntaje', optionalToken, async (req, res) => {
  try {
    const cuerpo = req.body || {};
    const respuestas = Array.isArray(cuerpo.respuestas) ? cuerpo.respuestas.slice(0, 254) : [];
    const limpias = [];
    respuestas.forEach((fila) => {
      if (!fila || typeof fila.correcto !== 'boolean') return;
      const id = String(fila.id || '').slice(0, 80);
      if (!id) return;
      limpias.push({ id, correcto: fila.correcto });
    });
    const resultado = calificarSimulacro(limpias);
    const alias = estudianteDesdeRequest(req, cuerpo);
    const porTiempo = Boolean(cuerpo.porTiempo || cuerpo.por_tiempo);
    const completo = resultado && resultado.global != null && !porTiempo;
    let guardado = null;
    if (alias) {
      const persistido = await guardarSimulacroOficial(alias, {
        id: cuerpo.simulacroId || cuerpo.id || `sim_${Date.now()}`,
        email: cuerpo.email || null,
        global: resultado.global,
        areas: resultado.areas,
        completo,
        por_tiempo: porTiempo,
        respuestas_n: limpias.length
      });
      if (persistido.ok) guardado = persistido.simulacro;
      else console.warn('[simulacro/puntaje] no se pudo persistir:', persistido.error);
    }
    return res.json({
      ...resultado,
      completo,
      por_tiempo: porTiempo,
      persistido: Boolean(guardado),
      expediente: guardado
    });
  } catch (err) {
    console.error('[simulacro/puntaje]', err);
    return res.status(500).json({ ok: false, error: err.message || 'error' });
  }
});

router.get('/simulacro/ultimo', optionalToken, async (req, res) => {
  try {
    const alias = estudianteDesdeRequest(req, {
      studentId: req.query.estudiante || req.query.studentId,
      email: req.query.email
    });
    if (!alias) return res.status(400).json({ ok: false, error: 'Falta el estudiante.' });
    const { data, error } = await cargarProgresoSaber(alias);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.json({
      ok: true,
      simulacro: (data && data.simulacro_oficial) || null,
      historial: Array.isArray(data && data.historial_simulacros) ? data.historial_simulacros : []
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'error' });
  }
});

// Expediente de progreso vía API (el navegador ya no habla con Supabase directo).
router.get('/expediente', optionalToken, async (req, res) => {
  try {
    const alias = estudianteDesdeRequest(req, {
      studentId: req.query.estudiante || req.query.studentId,
      email: req.query.email
    });
    if (!alias) return res.status(400).json({ ok: false, error: 'Falta el estudiante.' });

    const { data, error } = await supabase
      .from('progreso_estudiantes')
      .select('estudiante,materia,theta_global,sem_global,baseline_proyeccion,preguntas_respondidas,items_respondidos,ultima_actualizacion,historial_theta,historial_sesiones,simulacro_oficial,historial_simulacros,racha_dias')
      .eq('estudiante', alias)
      .limit(40);
    if (error) return res.status(500).json({ ok: false, error: error.message });

    const { data: eventosRaw, error: errEv } = await supabase
      .from('registro_eventos')
      .select('skill,is_correct,created_at,item_id,opcion_marcada')
      .eq('student_id', alias)
      .order('created_at', { ascending: false })
      .limit(300);

    const progreso = (data || []).map((row) => {
      const medidas = Number(row && row.preguntas_respondidas) > 0;
      const pts = Number(row && row.baseline_proyeccion);
      return {
        estudiante: row.estudiante,
        materia: row.materia,
        theta: row.theta_global,
        bayesian_sem: row.sem_global,
        ultima_actualizacion: row.ultima_actualizacion,
        preguntas_respondidas: row.preguntas_respondidas,
        items_respondidos: row.items_respondidos,
        historial_sesiones: row.historial_sesiones,
        simulacro_oficial: row.simulacro_oficial,
        historial_simulacros: row.historial_simulacros,
        racha_dias: row.racha_dias,
        puntaje_escalonado: medidas && Number.isFinite(pts) ? pts : null,
        medido: medidas
      };
    });
    const eventos = (!errEv && Array.isArray(eventosRaw) ? eventosRaw : []).map((row) => ({
      area_general: row.skill,
      is_correct: row.is_correct,
      created_at: row.created_at,
      item_id: row.item_id,
      opcion_marcada: row.opcion_marcada
    }));

    return res.json({ ok: true, progreso, eventos });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'error' });
  }
});

router.post('/respuesta', optionalToken, guardarRespuestas);

export default router;
