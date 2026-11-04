/**
 * Bóveda Primer pulso — dante_mind_train_v1
 * Aislada de umbral, racha, simulacro y progreso ICFES.
 */
(function (global) {
  'use strict';

  const SCHEMA = 1;
  const PREFIX = 'dante_mind_train_v1:';
  const API = '/api/v1/dante/mind/pulso/seal';

  function studentKey() {
    try {
      const u = JSON.parse(localStorage.getItem('dante_user') || '{}');
      const id = u.document_id || u.estudiante || u.email || localStorage.getItem('dante_active_student');
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
      doc.trials.push(Object.assign({ ts: new Date().toISOString() }, trial || {}));
      if (trial && trial.mode && doc.modes.indexOf(trial.mode) === -1) {
        doc.modes.push(trial.mode);
      }
      write(doc, key);
      return doc;
    },

    sealSession: function (payload, sk) {
      const key = sk || studentKey();
      let doc = read(key);
      if (!doc) doc = this.beginSession({}, key);
      doc.sealed_at = new Date().toISOString();
      doc.derived = (payload && payload.derived) || doc.derived;
      doc.seal = (payload && payload.seal) || doc.seal;
      write(doc, key);
      this._syncRemote(doc);
      return doc;
    },

    _syncRemote: function (doc) {
      try {
        fetch(API, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            student_key: doc.student_key,
            session_id: doc.session_id,
            umbral_session_id: doc.umbral_session_id,
            started_at: doc.started_at,
            sealed_at: doc.sealed_at,
            n_trials: (doc.trials || []).length,
            modes: doc.modes || [],
            trials: doc.trials || [],
            derived: doc.derived,
            seal: doc.seal
          }),
          keepalive: true
        }).then(function (r) {
          if (!r.ok) console.warn('[PulsoVault] sync HTTP', r.status);
        }).catch(function () { /* offline ok — local vault holds */ });
      } catch (_) { /* ignore */ }
    }
  };

  global.PulsoVault = PulsoVault;
})(window);
