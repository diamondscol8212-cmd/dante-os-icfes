// Recorrido de la sala: medalla, espera y tarea. Vive en progreso_estudiantes, materia recorrido_sala.
import express from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();
const MATERIA = 'recorrido_sala';
const AREAS = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'];

function alumnoDe(raw) {
  return String(raw || '').toLowerCase().trim().split('@')[0];
}

function vacio() {
  return {
    nivel: 1,
    puntos: 0,
    medallas: 0,
    esperaHasta: null,
    dia: null,
    bloquesHoy: 0,
    refuerzosHoy: 0,
    tarea: null
  };
}

function sanear(raw) {
  const base = vacio();
  const src = raw && typeof raw === 'object' ? raw : {};
  const nivel = Math.round(Number(src.nivel));
  const puntos = Math.round(Number(src.puntos));
  const medallas = Math.round(Number(src.medallas));
  base.nivel = Number.isFinite(nivel) ? Math.min(24, Math.max(1, nivel)) : 1;
  base.puntos = Number.isFinite(puntos) ? Math.min(99, Math.max(0, puntos)) : 0;
  base.medallas = Number.isFinite(medallas) ? Math.min(23, Math.max(0, medallas)) : 0;
  base.dia = typeof src.dia === 'string' ? src.dia.slice(0, 10) : null;
  base.bloquesHoy = Math.min(2, Math.max(0, Math.round(Number(src.bloquesHoy) || 0)));
  base.refuerzosHoy = Math.min(2, Math.max(0, Math.round(Number(src.refuerzosHoy) || 0)));
  const espera = Date.parse(src.esperaHasta);
  base.esperaHasta = Number.isFinite(espera) ? new Date(espera).toISOString() : null;
  const tarea = src.tarea;
  if (tarea && typeof tarea === 'object' && AREAS.includes(String(tarea.area || ''))) {
    base.tarea = {
      area: String(tarea.area),
      nombre: String(tarea.nombre || tarea.area).slice(0, 40),
      hecha: false
    };
  }
  return base;
}

async function leer(alumno) {
  const { data, error } = await supabase
    .from('progreso_estudiantes')
    .select('id,items_respondidos')
    .eq('estudiante', alumno)
    .eq('materia', MATERIA)
    .limit(1);
  if (error) return { error, row: null };
  return { error: null, row: (data && data[0]) || null };
}

router.get('/recorrido', async (req, res) => {
  const alumno = alumnoDe(req.query.studentId || req.headers['x-student-id']);
  if (!alumno) return res.status(400).json({ ok: false, error: 'Falta el estudiante.' });
  const previa = await leer(alumno);
  if (previa.error) return res.status(500).json({ ok: false, error: previa.error.message });
  const guardado = previa.row && previa.row.items_respondidos;
  return res.json({ ok: true, estado: sanear(guardado) });
});

router.post('/recorrido', async (req, res) => {
  const alumno = alumnoDe(req.body?.studentId || req.headers['x-student-id']);
  if (!alumno) return res.status(400).json({ ok: false, error: 'Falta el estudiante.' });
  const estado = sanear(req.body?.estado);
  const previa = await leer(alumno);
  if (previa.error) return res.status(500).json({ ok: false, error: previa.error.message });
  const cuerpo = {
    estudiante: alumno,
    materia: MATERIA,
    theta_global: estado.nivel,
    preguntas_respondidas: estado.medallas,
    baseline_proyeccion: estado.puntos,
    items_respondidos: estado,
    ultima_actualizacion: new Date().toISOString(),
    institution_id: 'colegio_sandbox_default'
  };
  const guardado = previa.row && previa.row.id
    ? await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', previa.row.id)
    : await supabase.from('progreso_estudiantes').insert({ ...cuerpo, id: crypto.randomUUID() });
  if (guardado.error) return res.status(500).json({ ok: false, error: guardado.error.message });
  return res.json({ ok: true, estado });
});

export default router;
