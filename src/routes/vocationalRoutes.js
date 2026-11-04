// Ruta vocacional guardada en progreso_estudiantes, materia ruta_vocacional.
import express from 'express';
import crypto from 'crypto';
import { VocationalService } from '../services/vocationalService.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();
const MATERIA_RUTA = 'ruta_vocacional';

function alumnoDe(raw) {
  return String(raw || '').toLowerCase().trim().split('@')[0];
}

function puntajeReal(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

function letrasRuta(lista, tope) {
  return (Array.isArray(lista) ? lista : [])
    .map((letra) => String(letra || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1))
    .filter(Boolean)
    .slice(-(tope || 24));
}

function informeLocal(datos) {
  const nombres = { R: 'realista', I: 'investigativa', A: 'artística', S: 'social', E: 'emprendedora', C: 'convencional' };
  const cuentas = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  letrasRuta(datos.dilemas, 6).concat(letrasRuta(datos.cierres, 24)).forEach((letra) => {
    if (cuentas[letra] != null) cuentas[letra] += 1;
  });
  const orden = Object.keys(cuentas).sort((a, b) => cuentas[b] - cuentas[a] || a.localeCompare(b));
  const fuerte = cuentas[orden[0]] ? nombres[orden[0]] : '';
  const segundo = cuentas[orden[1]] ? nombres[orden[1]] : '';
  const codigo = String(datos.hollandCode || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
  const palabras = datos.palabras || codigo.split('').map((l) => ({
    R: 'Realista', I: 'Investigativo', A: 'Artístico', S: 'Social', E: 'Emprendedor', C: 'Convencional'
  }[l])).filter(Boolean).join(' · ');
  const carrera = datos.carrera || '';
  const otras = (Array.isArray(datos.carreras) ? datos.carreras : []).filter((nombre) => nombre && nombre !== carrera);
  const nCierres = letrasRuta(datos.cierres, 24).length;
  const rasgo = fuerte
    ? 'La elección que más se repite es la ' + fuerte + (segundo ? ', y después la ' + segundo : '') + '.'
    : 'Todavía hay pocas elecciones para leer un rasgo.';
  const bloques = nCierres
    ? ' Al cerrar los bloques quedaron ' + nCierres + (nCierres === 1 ? ' elección' : ' elecciones') + ' más. Esas también entran.'
    : ' Cuando cierres un bloque, esas dos elecciones también entran.';
  return 'Tu perfil se lee como ' + (palabras || 'tu perfil') + '. ' + rasgo + bloques
    + (carrera ? ' Quieres explorar ' + carrera + '.' : '')
    + (otras.length ? ' También se parecen ' + otras.join(' y ') + '.' : '')
    + ' Este informe no usa el puntaje del examen. Sale de cómo eliges actuar.';
}

function textoInformeUtil(texto) {
  const limpio = String(texto || '').replace(/\s+/g, ' ').trim();
  if (limpio.length < 40 || limpio.length > 900) return '';
  if (/\d{3}|%|UNAL|UdeA|percentil|puntaje|theta/i.test(limpio)) return '';
  return limpio;
}

async function informeConIa(datos, local) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { texto: local, origen: 'elecciones' };
  const nombre = String(datos.nombre || 'estudiante').replace(/[^\p{L}\s]/gu, '').trim().slice(0, 40) || 'estudiante';
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const prompt = `Escribe el informe vocacional de un estudiante de colegio, en español, en segunda persona, en dos párrafos cortos.
Usa solo estos datos. No inventes puntajes, porcentajes, universidades, cortes ni carreras que no estén en la lista.
No uses lenguaje médico. No menciones el examen ni un número.
Nombre: ${nombre}
Perfil en palabras: ${datos.palabras || 'sin perfil'}
Letras de los seis dilemas de la ruta: ${(datos.dilemas || []).join(', ') || 'ninguna'}
Letras elegidas al cerrar los bloques de preguntas: ${(datos.cierres || []).join(', ') || 'ninguna'}
Carrera que quiere explorar: ${datos.carrera || 'ninguna'}
Otras carreras que se parecen: ${(datos.carreras || []).filter((n) => n && n !== datos.carrera).join(', ') || 'ninguna'}
Devuelve solo el texto del informe.`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    clearTimeout(timer);
    if (!response.ok) return { texto: local, origen: 'elecciones' };
    const data = await response.json();
    const crudo = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
      ? data.candidates[0].content.parts.map((p) => p.text || '').join(' ')
      : '';
    const util = textoInformeUtil(crudo);
    return util ? { texto: util, origen: 'ia' } : { texto: local, origen: 'elecciones' };
  } catch (e) {
    return { texto: local, origen: 'elecciones' };
  }
}

function mapaCarreraId(nombreOId) {
  const t = String(nombreOId || '').toLowerCase().trim();
  if (!t) return null;
  if (t.includes('unal_') || t.includes('udea_')) return t;
  if (t.includes('medicina')) return 'unal_medicina_bogota';
  if (t.includes('sistemas') || t.includes('comput')) return 'unal_ing_sistemas_bogota';
  return null;
}

async function leerRuta(alumno) {
  const { data, error } = await supabase
    .from('progreso_estudiantes')
    .select('*')
    .eq('estudiante', alumno)
    .eq('materia', MATERIA_RUTA)
    .maybeSingle();
  if (error) return { error, row: null };
  return { error: null, row: data };
}

async function guardarRuta(alumno, payload) {
  const previa = await leerRuta(alumno);
  const cuerpo = {
    estudiante: alumno,
    materia: MATERIA_RUTA,
    arquetipo: payload.holland_code || null,
    baseline_proyeccion: payload.projectedScore,
    theta_global: payload.projectedScore != null
      ? Number(((payload.projectedScore - 250) / 70).toFixed(3))
      : null,
    preguntas_respondidas: Array.isArray(payload.answers) && payload.answers.length
      ? payload.answers.length
      : (Array.isArray(payload.cierres) ? payload.cierres.length : (Array.isArray(payload.dilemas) ? payload.dilemas.length : 0)),
    items_respondidos: payload,
    ultima_actualizacion: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    institution_id: 'colegio_sandbox_default'
  };
  if (previa.row && previa.row.id) {
    return supabase.from('progreso_estudiantes').update(cuerpo).eq('id', previa.row.id).select('*').maybeSingle();
  }
  return supabase
    .from('progreso_estudiantes')
    .insert({ ...cuerpo, id: crypto.randomUUID() })
    .select('*')
    .maybeSingle();
}

function perfilDesdeFila(row) {
  const pack = row && row.items_respondidos && typeof row.items_respondidos === 'object'
    ? row.items_respondidos
    : {};
  return {
    student_id: row.estudiante,
    holland_code: pack.holland_code || row.arquetipo || null,
    score_realista: pack.riasec ? pack.riasec.R : null,
    score_investigativo: pack.riasec ? pack.riasec.I : null,
    score_artistico: pack.riasec ? pack.riasec.A : null,
    score_social: pack.riasec ? pack.riasec.S : null,
    score_emprendedor: pack.riasec ? pack.riasec.E : null,
    score_convencional: pack.riasec ? pack.riasec.C : null,
    ocean_openness: pack.ocean ? pack.ocean.O : null,
    ocean_conscientiousness: pack.ocean ? pack.ocean.C : null,
    ocean_extraversion: pack.ocean ? pack.ocean.E : null,
    ocean_agreeableness: pack.ocean ? pack.ocean.A : null,
    ocean_neuroticism: pack.ocean ? pack.ocean.N : null,
    soft_skills_profile: pack.soft_skills_profile || {},
    telemetria_latencia_ms: pack.telemetrySummary || {},
    carreras_sugeridas: pack.carreras_sugeridas || [],
    orbitas_clasificadas: pack.orbitas || null,
    roi_cognitivo_plan: pack.roiPlan || null,
    meta_carrera: pack.carrera || null,
    carrera_marcada: pack.carrera || null,
    carreras_afines: Array.isArray(pack.carreras_afines) ? pack.carreras_afines : [],
    dilemas: Array.isArray(pack.dilemas) ? pack.dilemas : [],
    dia_ruta: pack.dia || null,
    cierres: Array.isArray(pack.cierres) ? pack.cierres : [],
    informe: pack.informe && pack.informe.texto ? pack.informe : null,
    en_curso: pack.tipo === 'ruta_en_curso',
    meta_universidad: pack.universidad || null,
    meta_carrera_id: pack.targetCareerId || null,
    meta_corte: pack.corte || null,
    projected_score: pack.projectedScore || null,
    brecha_puntaje_calculada: pack.brecha != null ? pack.brecha : null,
    updated_at: row.ultima_actualizacion || row.updated_at
  };
}

router.post('/evaluate', async (req, res) => {
  try {
    const body = req.body || {};
    const student = alumnoDe(body.studentId || req.headers['x-student-id']);
    const pts = puntajeReal(body.projectedScore);
    const lista = Array.isArray(body.answers) ? body.answers : [];
    if (!student) return res.status(400).json({ success: false, error: 'Falta el estudiante.' });
    if (!lista.length) {
      return res.status(400).json({ success: false, error: 'Faltan las respuestas de la ruta.' });
    }

    const usaEscenarios = lista.some((a) => a && (a.scenarioId || a.scenario_id));
    const profileSummary = usaEscenarios
      ? VocationalService.processScenarioChoices(lista)
      : VocationalService.processHollandSelections(lista);
    const careerId = mapaCarreraId(body.targetCareerId || body.carrera);
    const orbitResult = await VocationalService.classifyThreeOrbits(profileSummary, pts || 0, careerId);
    const principal = orbitResult.orbitas && orbitResult.orbitas.misionPrincipal
      ? orbitResult.orbitas.misionPrincipal.data
      : null;
    const corteMeta = Number(body.corte) || (principal && principal.puntajeCorte) || null;
    const pack = {
      tipo: usaEscenarios ? 'simulador' : 'asistente',
      holland_code: profileSummary.hollandCode,
      riasec: profileSummary.riasec,
      ocean: profileSummary.ocean,
      soft_skills_profile: { sjtExecutionStyle: profileSummary.sjtExecutionStyle },
      telemetrySummary: profileSummary.telemetrySummary,
      answers: lista,
      projectedScore: pts,
      targetCareerId: careerId,
      carrera: body.carrera || (principal && principal.nombre) || null,
      universidad: body.universidad || (principal && principal.universidadNombre) || null,
      corte: corteMeta,
      brecha: pts != null && corteMeta != null && !(corteMeta > 500 && pts <= 500)
        ? Math.max(0, Math.round(corteMeta - pts))
        : (principal && principal.brechaPuntos != null ? principal.brechaPuntos : null),
      orbitas: orbitResult.orbitas,
      roiPlan: orbitResult.roiPlan,
      carreras_sugeridas: orbitResult.todasLasCarreras,
      updated_at: new Date().toISOString()
    };
    const saved = await guardarRuta(student, pack);
    return res.status(200).json({
      success: true,
      studentId: student,
      persisted: !(saved.error),
      profileSummary,
      orbitResult,
      profile: saved.data ? perfilDesdeFila(saved.data) : pack
    });
  } catch (err) {
    console.error('[Vocational Evaluate Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/careers', async (req, res) => {
  try {
    const seed = await VocationalService.classifyThreeOrbits(
      { riasec: null, hollandCode: null },
      0
    );
    return res.status(200).json({
      success: true,
      source: 'BANCO_LOCAL',
      carreras: seed.todasLasCarreras
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/profile/:studentId', async (req, res) => {
  try {
    const student = alumnoDe(req.params.studentId);
    if (!student) return res.status(200).json({ success: true, hasProfile: false });
    const { row, error } = await leerRuta(student);
    if (error || !row) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        message: 'Aún no hay ruta vocacional.'
      });
    }
    const profile = perfilDesdeFila(row);
    return res.status(200).json({
      success: true,
      hasProfile: true,
      profile,
      vocationalProfile: profile
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/target', async (req, res) => {
  try {
    const body = req.body || {};
    const student = alumnoDe(body.studentId);
    const pts = puntajeReal(body.projectedScore);
    if (!student) return res.status(400).json({ success: false, error: 'Falta el estudiante.' });
    const previa = await leerRuta(student);
    const packPrev = (previa.row && previa.row.items_respondidos) || {};
    const profileSummary = {
      riasec: body.riasec || packPrev.riasec || null,
      hollandCode: body.hollandCode || packPrev.holland_code || (previa.row && previa.row.arquetipo) || null,
      ocean: packPrev.ocean || null,
      sjtExecutionStyle: packPrev.soft_skills_profile && packPrev.soft_skills_profile.sjtExecutionStyle,
      telemetrySummary: packPrev.telemetrySummary || null
    };
    const careerId = mapaCarreraId(body.targetCareerId || body.carrera);
    const orbitResult = await VocationalService.classifyThreeOrbits(profileSummary, pts || 0, careerId);
    const principal = orbitResult.orbitas.misionPrincipal.data;
    const pack = {
      ...packPrev,
      tipo: packPrev.tipo || 'meta',
      holland_code: profileSummary.hollandCode,
      riasec: profileSummary.riasec,
      ocean: profileSummary.ocean,
      projectedScore: pts,
      targetCareerId: careerId,
      carrera: body.carrera || principal.nombre,
      universidad: body.universidad || principal.universidadNombre,
      corte: Number(body.corte) || principal.puntajeCorte,
      brecha: principal.brechaPuntos,
      orbitas: orbitResult.orbitas,
      roiPlan: orbitResult.roiPlan,
      carreras_sugeridas: orbitResult.todasLasCarreras,
      updated_at: new Date().toISOString()
    };
    const saved = await guardarRuta(student, pack);
    return res.status(200).json({
      success: true,
      studentId: student,
      persisted: !(saved.error),
      targetCareerId: careerId,
      orbitResult
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/perfil', async (req, res) => {
  try {
    const body = req.body || {};
    const student = alumnoDe(body.studentId || body.estudiante);
    if (!student) return res.status(400).json({ success: false, error: 'sin_alumno' });
    const codigo = String(body.hollandCode || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
    const carreras = Array.isArray(body.carreras) ? body.carreras.map((n) => String(n)).slice(0, 3) : [];
    const enCurso = body.enCurso === true;
    const previa = await leerRuta(student);
    const prevPack = (previa.row && previa.row.items_respondidos) || {};
    const cierres = letrasRuta(body.cierres, 24).length ? letrasRuta(body.cierres, 24) : letrasRuta(prevPack.cierres, 24);
    if (enCurso && prevPack.tipo === 'perfil_vocacional' && prevPack.holland_code) {
      if (cierres.length) {
        prevPack.cierres = cierres;
        const kept = await guardarRuta(student, prevPack);
        if (kept.error) return res.status(500).json({ success: false, error: kept.error.message });
      }
      return res.json({ success: true, persisted: true, kept: true });
    }
    const pack = {
      tipo: enCurso ? 'ruta_en_curso' : 'perfil_vocacional',
      holland_code: enCurso ? null : (codigo || null),
      carrera: enCurso ? null : (body.carrera || null),
      carreras_afines: enCurso ? [] : carreras,
      dilemas: Array.isArray(body.dilemas) ? body.dilemas.slice(0, 6) : [],
      dia: body.dia || null,
      cierres,
      informe: prevPack.informe || null,
      projectedScore: null,
      corte: null,
      brecha: null
    };
    const saved = await guardarRuta(student, pack);
    if (saved.error) return res.status(500).json({ success: false, error: saved.error.message });
    return res.json({ success: true, persisted: true, hollandCode: codigo, carrera: pack.carrera });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/meta', async (req, res) => {
  try {
    const body = req.body || {};
    const student = alumnoDe(body.studentId || body.estudiante);
    if (!student) return res.status(400).json({ success: false, error: 'sin_alumno' });
    const track = String(body.track || 'ICFES').toUpperCase();
    if (track === 'PREU') {
      const corte = Number(body.corte);
      const escala = Number(body.escala);
      if (!body.carrera || !Number.isFinite(corte) || !Number.isFinite(escala)) {
        return res.status(400).json({ success: false, error: 'carrera_invalida' });
      }
      const previa = await supabase
        .from('progreso_estudiantes')
        .select('id')
        .eq('estudiante', student)
        .eq('materia', 'ruta_preu')
        .limit(1);
      const pack = {
        tipo: 'ruta_preu',
        carreraId: body.carreraId || null,
        carrera: body.carrera,
        corte,
        escala,
        universidad: escala > 500 ? 'UNAL' : 'UdeA'
      };
      const cuerpo = {
        estudiante: student,
        materia: 'ruta_preu',
        baseline_proyeccion: null,
        preguntas_respondidas: 0,
        items_respondidos: pack,
        ultima_actualizacion: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        institution_id: 'colegio_sandbox_default'
      };
      const anterior = previa.data && previa.data[0];
      const saved = anterior && anterior.id
        ? await supabase.from('progreso_estudiantes').update(cuerpo).eq('id', anterior.id)
        : await supabase.from('progreso_estudiantes').insert({ ...cuerpo, id: crypto.randomUUID() });
      if (saved.error) return res.status(500).json({ success: false, error: saved.error.message });
      return res.json({ success: true, persisted: true, track: 'PREU' });
    }
    const meta = puntajeReal(body.meta);
    if (!meta || meta > 500) return res.status(400).json({ success: false, error: 'meta_invalida' });
    const porId = await supabase.from('usuarios').select('id').eq('id', student).maybeSingle();
    let userId = porId.data && porId.data.id;
    if (!userId) {
      const porCorreo = await supabase.from('usuarios').select('id,email').ilike('email', student + '@%').limit(8);
      const hallado = (porCorreo.data || []).find((row) => String(row.email || '').toLowerCase().split('@')[0] === student);
      userId = hallado && hallado.id;
    }
    if (userId) {
      const upUser = await supabase.from('usuarios').update({ meta_puntaje: meta + '_ICFES' }).eq('id', userId);
      if (upUser.error) return res.status(500).json({ success: false, error: upUser.error.message });
    }
    const previa = await supabase
      .from('progreso_estudiantes')
      .select('id,mision_activa')
      .eq('estudiante', student)
      .eq('materia', 'saber_11')
      .limit(1);
    const fila = previa.data && previa.data[0];
    const mision = fila && fila.mision_activa && typeof fila.mision_activa === 'object'
      ? { ...fila.mision_activa, meta: meta + '_ICFES', track: 'ICFES' }
      : { meta: meta + '_ICFES', track: 'ICFES' };
    if (fila && fila.id) {
      const up = await supabase.from('progreso_estudiantes').update({
        mision_activa: mision,
        updated_at: new Date().toISOString()
      }).eq('id', fila.id);
      if (up.error) return res.status(500).json({ success: false, error: up.error.message });
    }
    return res.json({ success: true, persisted: true, track: 'ICFES', meta });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/informe', async (req, res) => {
  try {
    const body = req.body || {};
    const student = alumnoDe(body.studentId || body.estudiante);
    if (!student) return res.status(400).json({ success: false, error: 'sin_alumno' });
    const previa = await leerRuta(student);
    const prevPack = (previa.row && previa.row.items_respondidos) || {};
    const codigo = String(body.hollandCode || prevPack.holland_code || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
    const carrera = body.carrera || prevPack.carrera || '';
    const carreras = Array.isArray(body.carreras) && body.carreras.length
      ? body.carreras.map((n) => String(n)).slice(0, 3)
      : (Array.isArray(prevPack.carreras_afines) ? prevPack.carreras_afines : []);
    const datos = {
      nombre: body.nombre || '',
      hollandCode: codigo,
      carrera,
      carreras,
      dilemas: letrasRuta(body.dilemas || prevPack.dilemas, 6),
      cierres: letrasRuta(body.cierres || prevPack.cierres, 24)
    };
    const local = informeLocal(datos);
    const escrito = await informeConIa(datos, local);
    const pack = {
      ...prevPack,
      tipo: prevPack.tipo || 'perfil_vocacional',
      holland_code: codigo || prevPack.holland_code || null,
      carrera: carrera || prevPack.carrera || null,
      carreras_afines: carreras,
      dilemas: datos.dilemas,
      cierres: datos.cierres,
      informe: { texto: escrito.texto, origen: escrito.origen, fecha: new Date().toISOString() }
    };
    const saved = await guardarRuta(student, pack);
    if (saved.error) return res.status(500).json({ success: false, error: saved.error.message });
    return res.json({ success: true, informe: pack.informe });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
