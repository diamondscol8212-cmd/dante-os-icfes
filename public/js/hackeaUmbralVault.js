/**
 * Bóveda Umbral — telemetría aislada del resto de Dante OS / ICFES.
 * No mezclar con racha, simulacro, pacto ni progreso de examen.
 * schema v1 · append-only events
 */
(function (global) {
  'use strict';

  const SCHEMA = 1;
  const PREFIX = 'dante_mind_umbral_v1:';

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
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
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
      console.warn('[UmbralVault] persist failed', e);
      return false;
    }
  }

  const UmbralVault = {
    SCHEMA,

    studentKey,

    /** Abre sesión nueva (cada entrada al ritual). */
    beginSession: function (sk) {
      const key = sk || studentKey();
      const doc = {
        schema: SCHEMA,
        student_key: key,
        session_id: uuid(),
        started_at: new Date().toISOString(),
        sealed_at: null,
        events: [],
        derived: null,
        seal: null
      };
      write(doc, key);
      return doc;
    },

    getSession: function (sk) {
      return read(sk || studentKey());
    },

    /** Append-only: no pisa eventos previos de la sesión. */
    appendEvent: function (event, sk) {
      const key = sk || studentKey();
      let doc = read(key);
      if (!doc || !doc.session_id) doc = this.beginSession(key);
      const safe = Object.assign({
        act_key: 'unknown',
        ts_start: null,
        ts_end: new Date().toISOString()
      }, event || {});
      doc.events.push(safe);
      write(doc, key);
      return doc;
    },

    sealSession: function (payload, sk) {
      const key = sk || studentKey();
      let doc = read(key);
      if (!doc) doc = this.beginSession(key);
      doc.sealed_at = new Date().toISOString();
      doc.derived = (payload && payload.derived) || doc.derived;
      doc.seal = (payload && payload.seal) || doc.seal;
      write(doc, key);
      this._syncRemote(doc);
      return doc;
    },

    _syncRemote: function (doc) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        try {
          const t = localStorage.getItem('dante_token') || localStorage.getItem('token');
          if (t) headers.Authorization = 'Bearer ' + t;
        } catch (_) { /* ignore */ }
        fetch('/api/v1/dante/mind/umbral/seal', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            student_key: doc.student_key,
            session_id: doc.session_id,
            started_at: doc.started_at,
            sealed_at: doc.sealed_at,
            events: doc.events || [],
            derived: doc.derived,
            seal: doc.seal
          }),
          keepalive: true
        }).then(function (r) {
          if (!r.ok) console.warn('[UmbralVault] sync HTTP', r.status);
        }).catch(function () { /* local vault holds */ });
      } catch (_) { /* ignore */ }
    }
  };

  global.UmbralVault = UmbralVault;
})(window);
