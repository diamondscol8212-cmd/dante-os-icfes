import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { parametrosDeItem } from '../services/cat/bancoCalibrado.js';
import { estimarHistorial } from '../services/cat/estimarEap.js';
import { recordarVistos } from '../services/bank/vistosSala.js';
import { juicioDeItem } from '../services/bank/calificarItem.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function idEstable(raw) {
  const texto = String(raw || '').trim();
  if (UUID.test(texto)) return texto.toLowerCase();
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

function alumnoDe(body) {
  return String((body && (body.alumno || body.studentId)) || '')
    .toLowerCase()
    .trim()
    .split('@')[0];
}

function normalizar(respuestas, tipo) {
  const vistas = new Set();
  const nuevas = [];
  (Array.isArray(respuestas) ? respuestas : []).forEach((r) => {
    const original = String((r && (r.id || r.itemId)) || '').trim();
    const itemId = idEstable(original);
    if (!itemId || vistas.has(itemId) || typeof r.correcto !== 'boolean') return;
    vistas.add(itemId);
    const area = String(r.area || r.materia || '').toLowerCase().replace(/\s+/g, '_');
    const ms = Number(r.ms) || 0;
      nuevas.push({
      item_id: itemId,
      item_original: original,
      correcta: r.correcto,
      area: area,
      a: r.a,
      b: r.b,
      c: r.c,
      tiempo: ms,
      letra: String(r.letra || r.opcionSeleccionada || '').toUpperCase(),
      timestamp: new Date().toISOString(),
      tipo: tipo
    });
  });
  return nuevas;
}

function conBanco(row) {
  const real = parametrosDeItem(row.item_original) || parametrosDeItem(row.item_id);
  if (!real) return row;
  return {
    ...row,
    a: real.a,
    b: real.b,
    c: real.c,
    area: real.area || row.area
  };
}

export function calificarRespuesta(req, res) {
  const body = req.body || {};
  const itemId = body.itemId || body.id;
  const letra = body.letra || body.opcionSeleccionada;
  const textoOpcion = body.textoOpcion || body.texto || body.opcionTexto || '';
  const juicio = juicioDeItem(itemId, letra, textoOpcion);
  if (!juicio) return res.status(404).json({ ok: false, motivo: 'sin_item' });
  return res.json({
    ok: true,
    esCorrecta: juicio.esCorrecta === true,
    letraCorrecta: juicio.letraCorrecta,
    textoCorrecto: juicio.textoCorrecto || '',
    textoElegido: juicio.textoElegido || '',
    razon: juicio.razon || '',
    fraseAcierto: juicio.fraseAcierto || '',
    repaso: juicio.repaso || '',
    queMedia: juicio.queMedia || '',
    explicacion: juicio.explicacion || '',
    sinExplicacion: juicio.sinExplicacion === true
  });
}

export async function guardarRespuestas(req, res) {
  try {
    const body = req.body || {};
    const alumno = alumnoDe(body);
    if (!alumno || alumno === 'estudiante' || alumno === 'student_demo_01') {
      return res.status(400).json({ ok: false, motivo: 'sin_alumno' });
    }
    const tipo = String(body.tipo || 'SESION').slice(0, 40).toUpperCase();
    const esRespaldo = tipo === 'RESPALDO_LOCAL';
    const TIPOS_SESION_REAL = new Set([
      'MISION_DIARIA', 'REFUERZO', 'REPASO_FALLIDAS', 'SIMULACRO', 'SIMULACRO_COMPLETO',
      'DIAGNOSTICO_INICIAL', 'DIAGNOSTICO', 'ENTRENAMIENTO'
    ]);
    const nuevas = normalizar(body.respuestas, tipo).map(conBanco).map((row) => {
      // No inventar fallo si el banco no califica: respeta el correcto del cliente.
      const juicio = juicioDeItem(row.item_original, row.letra);
      if (juicio) return { ...row, correcta: juicio.esCorrecta === true };
      return row;
    });
    if (!nuevas.length) {
      return res.status(400).json({ ok: false, motivo: 'sin_respuestas' });
    }

    // RESPALDO_LOCAL no escribe eventos ni pisa fallidas/aciertos de sesiones reales.
    let frescas = [];
    if (!esRespaldo) {
      const ya = await supabase
        .from('registro_eventos')
        .select('item_id')
        .eq('student_id', alumno)
        .limit(600);
      if (ya.error) {
        return res.status(500).json({ ok: false, motivo: ya.error.message });
      }
      const puestos = new Set((ya.data || []).map((row) => row.item_id));
      frescas = nuevas.filter((row) => !puestos.has(row.item_id));
      if (frescas.length) {
        const eventos = frescas.map((row) => ({
          id: crypto.randomUUID(),
          student_id: alumno,
          item_id: row.item_id,
          skill: row.area || null,
          is_correct: row.correcta,
          response_time: row.tiempo > 0 ? Math.round(row.tiempo / 1000) : null,
          opcion_marcada: row.letra || null,
          declared_confidence: 'media',
          institution_id: 'colegio_sandbox_default',
          selection_vector: [
            { opcion: row.letra || '', timestamp_relativo: row.tiempo > 0 ? Math.round(row.tiempo / 1000) : 0 },
            { parametro_a: row.a, parametro_b: row.b, parametro_c: row.c, area: row.area, tipo: tipo, item_original: row.item_original }
          ],
          created_at: row.timestamp
        }));
        const ins = await supabase.from('registro_eventos').insert(eventos);
        if (ins.error) {
          return res.status(500).json({ ok: false, motivo: ins.error.message });
        }
      }
    }

    const previo = await supabase
      .from('progreso_estudiantes')
      .select('id,items_respondidos,historial_theta')
      .eq('estudiante', alumno)
      .eq('materia', 'saber_11')
      .limit(1);
    if (previo.error) {
      return res.status(500).json({ ok: false, motivo: previo.error.message });
    }
    const anterior = (previo.data && previo.data[0]) || null;
    // Clave canónica = item_original (id de banco). Evita duplicar el mismo ítem
    // cuando una ruta guarda UUID (idEstable) y otra guarda el id textual.
    const claveItem = (row) => {
      if (!row) return '';
      const original = String(row.item_original || '').trim();
      if (original) return original;
      return String(row.item_id || row.id || '').trim();
    };
    const mapa = new Map();
    const listaPrevia = anterior && Array.isArray(anterior.items_respondidos) ? anterior.items_respondidos : [];
    listaPrevia.forEach((row) => {
      const k = claveItem(row);
      if (k) mapa.set(k, row);
    });
    nuevas.forEach((row) => {
      const k = claveItem(row) || String(row.item_id || '');
      if (!k) return;
      const prev = mapa.get(k);
      if (esRespaldo && prev) {
        const tipoPrev = String(prev.tipo || '').toUpperCase();
        // El respaldo IRT no puede pisar un registro de sesión real (ni bajar un acierto a fallo).
        if (TIPOS_SESION_REAL.has(tipoPrev)) return;
        if (prev.correcta === true && row.correcta === false) return;
      }
      mapa.set(k, {
        ...row,
        item_original: row.item_original || k,
        item_id: row.item_id || idEstable(row.item_original || k)
      });
    });
    const items = Array.from(mapa.values()).slice(-600);
    const areas = {};
    items.forEach((row) => {
      if (!row || !row.area || typeof row.correcta !== 'boolean') return;
      if (!areas[row.area]) areas[row.area] = { total: 0, aciertos: 0 };
      areas[row.area].total += 1;
      if (row.correcta) areas[row.area].aciertos += 1;
    });
    const thetaCliente = Number(body.theta);
    const semCliente = Number(body.sem);
    const puntosCliente = Number(body.puntos);
    const est = estimarHistorial(items.map((row) => ({
      a: row.a,
      b: row.b,
      c: row.c,
      correcto: row.correcta
    })));
    const theta = est.puntos != null ? est.theta : (Number.isFinite(thetaCliente) ? thetaCliente : 0);
    const sem = est.puntos != null ? est.sem : (Number.isFinite(semCliente) ? semCliente : null);
    const puntos = est.puntos != null ? est.puntos : (Number.isFinite(puntosCliente) ? puntosCliente : null);
    const historia = anterior && Array.isArray(anterior.historial_theta) ? anterior.historial_theta.slice(-39) : [];
    if (Number.isFinite(theta)) historia.push(Math.round(theta * 1000) / 1000);
    const payload = {
      estudiante: alumno,
      materia: 'saber_11',
      theta_global: Number.isFinite(theta) ? theta : 0,
      sem_global: sem,
      baseline_proyeccion: puntos,
      preguntas_respondidas: items.length,
      items_respondidos: items,
      historial_theta: historia,
      ultima_actualizacion: new Date().toISOString(),
      onboarding_completed: true,
      institution_id: 'colegio_sandbox_default'
    };
    const guardado = anterior && anterior.id
      ? await supabase.from('progreso_estudiantes').update(payload).eq('id', anterior.id)
      : await supabase.from('progreso_estudiantes').insert({ ...payload, id: crypto.randomUUID() });
    if (guardado.error) {
      return res.status(500).json({ ok: false, motivo: guardado.error.message });
    }
    await recordarVistos(alumno, nuevas.map((row) => row.item_original));
    return res.json({ ok: true, respuestas: items.length, nuevas: frescas.length, areas });
  } catch (error) {
    return res.status(500).json({ ok: false, motivo: error.message || 'error' });
  }
}
