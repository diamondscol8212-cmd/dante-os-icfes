/**
 * Dante Mind — bóvedas umbral / primer pulso (aisladas del CAT / racha).
 */
import { Router } from 'express';
import { optionalToken } from '../middleware.js';
import { supabase } from '../../supabaseClient.js';

const router = Router();

function studentKeyFrom(req, body) {
  try {
    const u = req.user || {};
    const raw =
      body.student_key ||
      u.document_id ||
      u.estudiante ||
      u.email ||
      body.email ||
      'anon';
    return String(raw).split('@')[0].toLowerCase().slice(0, 120);
  } catch (_) {
    return 'anon';
  }
}

router.post('/mind/pulso/seal', optionalToken, async (req, res) => {
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
    const { data, error } = await supabase
      .from('dante_mind_pulso_sessions')
      .upsert(row, { onConflict: 'session_id' })
      .select('id, session_id')
      .maybeSingle();
    if (error) {
      console.warn('[mind/pulso/seal]', error.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
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
      .select('student_key, next_block')
      .maybeSingle();
    if (error) {
      console.warn('[mind/arc/seal]', error.message);
      return res.status(500).json({ ok: false, error: 'persist_failed' });
    }
    return res.json({ ok: true, student_key: data && data.student_key });
  } catch (e) {
    console.warn('[mind/arc/seal]', e);
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
