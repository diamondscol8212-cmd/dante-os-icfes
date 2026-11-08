/**
 * Bóveda Primer pulso — dante_mind_train_v1
 * Local + sync por pregunta a Supabase (vía /mind/pulso/trial).
 * Aislada de umbral, racha, simulacro y progreso ICFES.
 */
(function (global) {
  'use strict';

  const SCHEMA = 1;
  const PREFIX = 'dante_mind_train_v1:';
  const API_SEAL = '/api/v1/dante/mind/pulso/seal';
  const API_TRIAL = '/api/v1/dante/mind/pulso/trial';

  function studentKey() {
    if (global.DanteStudentId && typeof global.DanteStudentId.studentKey === 'function') {
      return global.DanteStudentId.studentKey();
    }
    try {
      const u = JSON.parse(localStorage.getItem('dante_user') || '{}');
      const id = u.estudiante || u.email || localStorage.getItem('dante_active_student');
      return String(id || 'anon').split('@')[0].toLowerCase();
    } catch (_) {
      return 'anon';
    }
  }

  function uuid() {
    if (global.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  function storageKey(sk) {
    return PREFIX + String(sk || studentKey());
  }

  function read(sk) {
    try {
      const raw = localStorage.getItem(storageKey(sk));
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.schema !== SCHEMA) return null;
      return data;
    } catch (_) {
      return null;
    }
  }

  function write(doc, sk) {
    try {
      localStorage.setItem(storageKey(sk), JSON.stringify(doc));
      return true;
    } catch (e) {
      console.warn('[PulsoVault] persist failed', e);
      return false;
    }
  }

  function authHeaders() {
    if (global.DanteStudentId && typeof global.DanteStudentId.authHeaders === 'function') {
      return global.DanteStudentId.authHeaders();
    }
    const h = { 'Content-Type': 'application/json' };
    try {
      const t = localStorage.getItem('dante_token') || localStorage.getItem('token');
      if (t) h.Authorization = 'Bearer ' + t;
    } catch (_) { /* ignore */ }
    return h;
  }

  const PulsoVault = {
    SCHEMA,
    studentKey,

    beginSession: function (meta, sk) {
      const key = sk || studentKey();
      const doc = {
        schema: SCHEMA,
        student_key: key,
        session_id: uuid(),
        umbral_session_id: (meta && meta.umbral_session_id) || null,
        campaign_day: (meta && meta.campaign_day) || null,
        block_index: (meta && meta.block_index) || null,
        started_at: new Date().toISOString(),
        sealed_at: null,
        trials: [],
        modes: [],
        derived: null,
        seal: null
      };
      write(doc, key);
      return doc;
    },

    getSession: function (sk) {
      return read(sk || studentKey());
    },

    appendTrial: function (trial, sk) {
      const key = sk || studentKey();
      let doc = read(key);
      if (!doc || !doc.session_id) doc = this.beginSession({}, key);
      const packed = Object.assign({ ts: new Date().toISOString() }, trial || {});
      doc.trials.push(packed);
      if (trial && trial.mode && doc.modes.indexOf(trial.mode) === -1) {
        doc.modes.push(trial.mode);
      }
      if (trial && trial.campaign_day != null) doc.campaign_day = trial.campaign_day;
      write(doc, key);
      this._syncTrial(doc, packed, doc.trials.length - 1);
      return doc;
    },

    sealSession: function (payload, sk) {
      const key = sk || studentKey();
      let doc = read(key);
      if (!doc) doc = this.beginSession({}, key);
      doc.sealed_at = new Date().toISOString();
      doc.derived = (payload && payload.derived) || doc.derived;
      doc.seal = (payload && payload.seal) || doc.seal;
      if (payload && payload.derived && payload.derived.campaign_day != null) {
        doc.campaign_day = payload.derived.campaign_day;
      }
      if (payload && payload.seal && payload.seal.block_index != null) {
        doc.block_index = payload.seal.block_index;
      }
      write(doc, key);
      this._syncSeal(doc);
      return doc;
    },

    _syncTrial: function (doc, trial, trialIndex) {
      try {
        fetch(API_TRIAL, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            student_key: doc.student_key,
            session_id: doc.session_id,
            umbral_session_id: doc.umbral_session_id,
            started_at: doc.started_at,
            campaign_day: doc.campaign_day || (trial && trial.campaign_day) || null,
            block_index: doc.block_index || null,
            trial_index: trialIndex,
            trial: trial,
            trials: doc.trials || [],
            modes: doc.modes || []
          }),
          keepalive: true
        }).then(function (r) {
          if (r.status === 409) {
            console.warn('[PulsoVault] day already completed — stop further writes');
            try {
              doc._dayBlocked = true;
              write(doc, doc.student_key);
            } catch (_) { /* ignore */ }
          } else if (!r.ok) {
            console.warn('[PulsoVault] trial sync HTTP', r.status);
          }
        }).catch(function () { /* offline — local vault holds */ });
      } catch (_) { /* ignore */ }
    },

    _syncSeal: function (doc) {
      try {
        fetch(API_SEAL, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            student_key: doc.student_key,
            session_id: doc.session_id,
            umbral_session_id: doc.umbral_session_id,
            started_at: doc.started_at,
            sealed_at: doc.sealed_at,
            campaign_day: doc.campaign_day || (doc.derived && doc.derived.campaign_day) || null,
            block_index: doc.block_index || (doc.seal && doc.seal.block_index) || null,
            n_trials: (doc.trials || []).length,
            modes: doc.modes || [],
            trials: doc.trials || [],
            derived: doc.derived,
            seal: doc.seal
          }),
          keepalive: true
        }).then(function (r) {
          if (!r.ok) console.warn('[PulsoVault] seal sync HTTP', r.status);
        }).catch(function () { /* offline ok — local vault holds */ });
      } catch (_) { /* ignore */ }
    },

    _syncRemote: function (doc) {
      this._syncSeal(doc);
    }
  };

  global.PulsoVault = PulsoVault;
})(window);
