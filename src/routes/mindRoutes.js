/**
 * Dante Mind — bóvedas umbral / pulso / arco (aisladas del CAT / racha).
 * Escrituras atadas al estudiante autenticado; trials por pregunta.
 */
import { Router } from 'express';
import { optionalToken } from '../middleware.js';
import { supabase } from '../../supabaseClient.js';
import { aliasEstudiante, estudianteDesdeRequest } from '../services/expedienteEstudiante.js';

const router = Router();

/** Prefer JWT alias; body solo si no hay sesión. Evita cruzar cuentas. */
function studentKeyFrom(req, body = {}) {
  try {
    if (req.user) {
      const fromJwt = estudianteDesdeRequest(req, {});
      if (fromJwt) return fromJwt.slice(0, 120);
    }
    const raw =
      body.student_key ||
      body.estudiante ||
      body.email ||
      req.headers?.['x-student-id'] ||
      'anon';
    return aliasEstudiante(raw).slice(0, 120) || 'anon';
  } catch (_) {
    return 'anon';
  }
}

function authHeadersOk(student_key) {
  return student_key && student_key !== 'anon' && student_key !== 'estudiante';
}

/** Upsert live session snapshot (trials acumulados). */
async function upsertPulsoSession(row) {
  return supabase
    .from('dante_mind_pulso_sessions')
    .upsert(row, { onConflict: 'session_id' })
    .select('id, session_id')
    .maybeSingle();
}

router.post('/mind/pulso/trial', optionalToken, async (req, res) => {
  try {
    const body = req.body || {};
    const student_key = studentKeyFrom(req, body);
    const session_id = String(body.session_id || '').slice(0, 80);
    const trial = body.trial && typeof body.trial === 'object' ? body.trial : null;
    const trial_index = Number.isFinite(Number(body.trial_index))
      ? Number(body.trial_index)
      : null;
    if (!session_id || !trial || trial_index == null || trial_index < 0) {
      return res.status(400).json({ ok: false, error: 'trial_required' });
    }
    const campaign_day = body.campaign_day != null ? Number(body.campaign_day) : (trial.campaign_day != null ? Number(trial.campaign_day) : null);
    const block_index = body.block_index != null ? Number(body.block_index) : null;

    // Unicidad de día: si ese día ya está sellado para este alumno, no aceptar más trials.
    if (authHeadersOk(student_key) && campaign_day != null && campaign_day >= 1) {
      const { data: done } = await supabase
        .from('dante_mind_days_completed')
        .select('campaign_day')
        .eq('student_key', student_key)
        .eq('campaign_day', campaign_day)
        .maybeSingle();
      if (done) {
        return res.status(409).json({ ok: false, error: 'day_already_completed', campaign_day });
      }
    }

    const { error: tErr } = await supabase
      .from('dante_mind_pulso_trials')
      .upsert({
        student_key,
        session_id,
        campaign_day,
        block_index,
        trial_index,
        item_id: trial.item_id ? String(trial.item_id).slice(0, 120) : null,
        trial
      }, { onConflict: 'student_key,session_id,trial_index' });
    if (tErr) {
      console.warn('[mind/pulso/trial] trial', tErr.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
    }

    // Snapshot de sesión en vivo (mismo row que el seal final).
    const trials = Array.isArray(body.trials) ? body.trials.slice(0, 24) : null;
    const sessionRow = {
      student_key,
      session_id,
      umbral_session_id: body.umbral_session_id ? String(body.umbral_session_id).slice(0, 80) : null,
      started_at: body.started_at || null,
      sealed_at: null,
      n_trials: trials ? trials.length : (trial_index + 1),
      modes: Array.isArray(body.modes) ? body.modes.slice(0, 12).map((m) => String(m).slice(0, 32)) : [],
      trials: trials || [trial],
      derived: null,
      seal: null,
      updated_at: new Date().toISOString()
    };
    const { error: sErr } = await upsertPulsoSession(sessionRow);
    if (sErr) console.warn('[mind/pulso/trial] session', sErr.message);

    return res.json({ ok: true, session_id, trial_index });
  } catch (e) {
    console.warn('[mind/pulso/trial]', e);
    return res.status(500).json({ ok: false });
  }
});

router.post('/mind/pulso/seal', optionalToken, async (req, res) => {
  try {
    const body = req.body || {};
    const student_key = studentKeyFrom(req, body);
    const session_id = String(body.session_id || '').slice(0, 80);
    if (!session_id) {
      return res.status(400).json({ ok: false, error: 'session_id_required' });
    }
    const campaign_day = body.campaign_day != null
      ? Number(body.campaign_day)
      : (body.derived && body.derived.campaign_day != null ? Number(body.derived.campaign_day) : null);
    const block_index = body.block_index != null
      ? Number(body.block_index)
      : (body.seal && body.seal.block_index != null ? Number(body.seal.block_index) : null);

    if (authHeadersOk(student_key) && campaign_day != null && campaign_day >= 1) {
      const { data: done } = await supabase
        .from('dante_mind_days_completed')
        .select('campaign_day, session_id')
        .eq('student_key', student_key)
        .eq('campaign_day', campaign_day)
        .maybeSingle();
      if (done && done.session_id && done.session_id !== session_id) {
        return res.status(409).json({ ok: false, error: 'day_already_completed', campaign_day });
      }
    }

    const row = {
      student_key,
      session_id,
      umbral_session_id: body.umbral_session_id ? String(body.umbral_session_id).slice(0, 80) : null,
      started_at: body.started_at || null,
      sealed_at: body.sealed_at || new Date().toISOString(),
      n_trials: Number(body.n_trials) || (Array.isArray(body.trials) ? body.trials.length : 0),
      modes: Array.isArray(body.modes) ? body.modes.slice(0, 12).map((m) => String(m).slice(0, 32)) : [],
      trials: Array.isArray(body.trials) ? body.trials.slice(0, 24) : [],
      derived: body.derived || null,
      seal: body.seal || null,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await upsertPulsoSession(row);
    if (error) {
      console.warn('[mind/pulso/seal]', error.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
    }

    if (authHeadersOk(student_key) && campaign_day != null && campaign_day >= 1) {
      const { error: dErr } = await supabase
        .from('dante_mind_days_completed')
        .upsert({
          student_key,
          campaign_day,
          session_id,
          block_index,
          sealed_at: row.sealed_at
        }, { onConflict: 'student_key,campaign_day' });
      if (dErr) console.warn('[mind/pulso/seal] day', dErr.message);
    }

    return res.json({ ok: true, id: data && data.id, session_id });
  } catch (e) {
    console.warn('[mind/pulso/seal]', e);
    return res.status(500).json({ ok: false });
  }
});

router.post('/mind/arc/seal', optionalToken, async (req, res) => {
  try {
    const body = req.body || {};
    const student_key = studentKeyFrom(req, body);
    if (!authHeadersOk(student_key)) {
      return res.status(400).json({ ok: false, error: 'student_required' });
    }

    const incomingDay = body.campaign_day != null ? Number(body.campaign_day) : 0;
    const { data: prev } = await supabase
      .from('dante_mind_arc')
      .select('campaign_day, last_block, blocks')
      .eq('student_key', student_key)
      .maybeSingle();

    // No permitir regresar el arco (evita pisa de otro dispositivo / sesión vieja).
    const prevDay = prev && prev.campaign_day != null ? Number(prev.campaign_day) : 0;
    if (prev && incomingDay > 0 && incomingDay < prevDay) {
      return res.json({
        ok: true,
        student_key,
        skipped: 'stale_arc',
        campaign_day: prevDay
      });
    }

    const row = {
      student_key,
      last_block: Number(body.last_block) || 0,
      next_block: Number(body.next_block) || 1,
      next_available_at: body.next_available_at || null,
      focus_area: body.focus_area ? String(body.focus_area).slice(0, 40) : null,
      focus_mode: body.focus_mode ? String(body.focus_mode).slice(0, 40) : null,
      capacity: body.capacity != null ? Number(body.capacity) : null,
      campaign_day: body.campaign_day != null ? Number(body.campaign_day) : null,
      next_campaign_day: body.next_campaign_day != null ? Number(body.next_campaign_day) : null,
      intellect: body.intellect || null,
      blocks: Array.isArray(body.blocks) ? body.blocks.slice(-16) : [],
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('dante_mind_arc')
      .upsert(row, { onConflict: 'student_key' })
      .select('student_key, next_block, campaign_day')
      .maybeSingle();
    if (error) {
      console.warn('[mind/arc/seal]', error.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
    }

    if (incomingDay >= 1) {
      await supabase.from('dante_mind_days_completed').upsert({
        student_key,
        campaign_day: incomingDay,
        session_id: body.session_id ? String(body.session_id).slice(0, 80) : null,
        block_index: Number(body.last_block) || null,
        sealed_at: new Date().toISOString()
      }, { onConflict: 'student_key,campaign_day' });
    }

    return res.json({ ok: true, student_key: data && data.student_key, campaign_day: data && data.campaign_day });
  } catch (e) {
    console.warn('[mind/arc/seal]', e);
    return res.status(500).json({ ok: false });
  }
});

router.get('/mind/arc', optionalToken, async (req, res) => {
  try {
    const student_key = studentKeyFrom(req, req.query || {});
    if (!authHeadersOk(student_key)) {
      return res.json({ ok: true, arc: null, days_completed: [] });
    }
    const [{ data: arc }, { data: days }] = await Promise.all([
      supabase.from('dante_mind_arc').select('*').eq('student_key', student_key).maybeSingle(),
      supabase
        .from('dante_mind_days_completed')
        .select('campaign_day, session_id, sealed_at')
        .eq('student_key', student_key)
        .order('campaign_day', { ascending: true })
    ]);
    return res.json({
      ok: true,
      student_key,
      arc: arc || null,
      days_completed: (days || []).map((d) => d.campaign_day)
    });
  } catch (e) {
    console.warn('[mind/arc GET]', e);
    return res.status(500).json({ ok: false });
  }
});

router.post('/mind/umbral/event', optionalToken, async (req, res) => {
  try {
    const body = req.body || {};
    const student_key = studentKeyFrom(req, body);
    const session_id = String(body.session_id || '').slice(0, 80);
    if (!session_id) {
      return res.status(400).json({ ok: false, error: 'session_id_required' });
    }
    const row = {
      student_key,
      session_id,
      started_at: body.started_at || null,
      sealed_at: null,
      events: Array.isArray(body.events) ? body.events.slice(0, 40) : [],
      derived: body.derived || null,
      seal: body.seal || null,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('dante_mind_umbral_sessions')
      .upsert(row, { onConflict: 'session_id' })
      .select('id, session_id')
      .maybeSingle();
    if (error) {
      console.warn('[mind/umbral/event]', error.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
    }
    return res.json({ ok: true, id: data && data.id, session_id });
  } catch (e) {
    console.warn('[mind/umbral/event]', e);
    return res.status(500).json({ ok: false });
  }
});

router.post('/mind/umbral/seal', optionalToken, async (req, res) => {
  try {
    const body = req.body || {};
    const student_key = studentKeyFrom(req, body);
    const session_id = String(body.session_id || '').slice(0, 80);
    if (!session_id) {
      return res.status(400).json({ ok: false, error: 'session_id_required' });
    }
    const row = {
      student_key,
      session_id,
      started_at: body.started_at || null,
      sealed_at: body.sealed_at || new Date().toISOString(),
      events: Array.isArray(body.events) ? body.events.slice(0, 40) : [],
      derived: body.derived || null,
      seal: body.seal || null,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('dante_mind_umbral_sessions')
      .upsert(row, { onConflict: 'session_id' })
      .select('id, session_id')
      .maybeSingle();
    if (error) {
      console.warn('[mind/umbral/seal]', error.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
    }
    return res.json({ ok: true, id: data && data.id, session_id });
  } catch (e) {
    console.warn('[mind/umbral/seal]', e);
    return res.status(500).json({ ok: false });
  }
});

export default router;
