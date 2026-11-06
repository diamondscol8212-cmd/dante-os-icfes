(function () {
  // Persistencia solo por API del servidor. No crear cliente Supabase en el navegador.
  async function cliente() {
    return null;
  }

  function idAlumno(id) {
    if (id) return String(id || '').toLowerCase().trim().split('@')[0];
    if (window.DanteRegistro && typeof window.DanteRegistro.idAlumno === 'function') {
      return window.DanteRegistro.idAlumno() || '';
    }
    const directos = [
      localStorage.getItem('dante_student_id'),
      localStorage.getItem('dante_active_student')
    ];
    for (let i = 0; i < directos.length; i++) {
      const limpio = String(directos[i] || '').toLowerCase().trim().split('@')[0];
      if (limpio && limpio !== 'estudiante' && limpio !== 'student_demo_01') return limpio;
    }
    try {
      const usuario = JSON.parse(localStorage.getItem('dante_user') || 'null');
      const raw = usuario && (usuario.estudiante || usuario.email || usuario.id || usuario.username);
      const limpio = String(raw || '').toLowerCase().trim().split('@')[0];
      if (limpio && limpio !== 'estudiante') return limpio;
    } catch (e) {}
    return '';
  }

  function leerJson(clave, fallback) {
    try {
      const raw = localStorage.getItem(clave);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function numLocal(clave, min, max) {
    const n = Number(localStorage.getItem(clave));
    if (!Number.isFinite(n)) return null;
    if (min != null && n < min) return null;
    if (max != null && n > max) return null;
    return n;
  }

  function recolectarSnapshot() {
    const history = leerJson('dante_history_cache', []);
    const areaConteo = leerJson('dante_area_conteo', {});
    const calendario = localStorage.getItem('dante_pacto_calendario') || '';
    const modoLibre = localStorage.getItem('dante_modo_libre') === 'true' || calendario === 'LIBRE';
    const respuestasN = (() => {
      try {
        const items = JSON.parse(localStorage.getItem('dante_respuestas_irt') || '[]');
        return Array.isArray(items) ? items.length : 0;
      } catch (e) {
        return 0;
      }
    })();
    const score = numLocal('dante_score_proyectado', 0, 500);
    const scoreAlt = numLocal('dante_puntaje_global', 0, 500);
    const racha = Math.max(
      0,
      Math.round(numLocal('dante_racha_dias', 0, 3650) || 0),
      Math.round(numLocal('dante_streak_count', 0, 3650) || 0)
    );

    return {
      v: 1,
      updatedAt: new Date().toISOString(),
      score: score != null ? score : scoreAlt,
      racha: racha,
      meta: localStorage.getItem('dante_pacto_meta') || '',
      calendario: calendario,
      modoLibre: modoLibre,
      fechaTexto: localStorage.getItem('dante_pacto_fecha_texto') || '',
      theta: numLocal('dante_theta_estimado', -6, 6),
      sem: numLocal('dante_sem_estimado', 0, 10),
      preguntasLocal: respuestasN,
      areaConteo: areaConteo && typeof areaConteo === 'object' ? areaConteo : {},
      history: Array.isArray(history) ? history.slice(0, 40) : []
    };
  }

  function aplicarSnapshot(snap, opts) {
    if (!snap || typeof snap !== 'object') return false;
    const soloVacios = !(opts && opts.forzar);
    let cambiado = false;
    const setSi = function (clave, valor) {
      if (valor == null || valor === '') return;
      const actual = localStorage.getItem(clave);
      if (soloVacios && actual != null && actual !== '' && actual !== '0') return;
      if (String(actual) === String(valor)) return;
      localStorage.setItem(clave, String(valor));
      cambiado = true;
    };

    if (snap.score != null && Number.isFinite(Number(snap.score))) {
      const localScore = Number(localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_puntaje_global') || 0);
      if (!Number.isFinite(localScore) || localScore <= 0 || Number(snap.score) >= localScore) {
        localStorage.setItem('dante_score_proyectado', String(Math.round(Number(snap.score))));
        localStorage.setItem('dante_puntaje_global', String(Math.round(Number(snap.score))));
        cambiado = true;
      }
    }
    if (snap.racha != null) {
      const localRacha = Math.max(
        0,
        Number(localStorage.getItem('dante_racha_dias') || 0) || 0,
        Number(localStorage.getItem('dante_streak_count') || 0) || 0
      );
      const nubeRacha = Math.max(0, Math.round(Number(snap.racha) || 0));
      if (nubeRacha > localRacha) {
        localStorage.setItem('dante_racha_dias', String(nubeRacha));
        localStorage.setItem('dante_streak_count', String(nubeRacha));
        cambiado = true;
      }
    }
    setSi('dante_pacto_meta', snap.meta || '');
    setSi('dante_pacto_calendario', snap.calendario || '');
    setSi('dante_pacto_fecha_texto', snap.fechaTexto || '');
    if (snap.modoLibre || snap.calendario === 'LIBRE') {
      if (localStorage.getItem('dante_modo_libre') !== 'true') {
        localStorage.setItem('dante_modo_libre', 'true');
        cambiado = true;
      }
    }
    if (snap.theta != null) setSi('dante_theta_estimado', snap.theta);
    if (snap.sem != null) setSi('dante_sem_estimado', snap.sem);

    if (snap.areaConteo && typeof snap.areaConteo === 'object') {
      const local = leerJson('dante_area_conteo', {});
      const localN = Object.values(local).reduce(function (s, v) {
        return s + (v && v.total ? Number(v.total) : 0);
      }, 0);
      const nubeN = Object.values(snap.areaConteo).reduce(function (s, v) {
        return s + (v && v.total ? Number(v.total) : 0);
      }, 0);
      if (nubeN > localN) {
        localStorage.setItem('dante_area_conteo', JSON.stringify(snap.areaConteo));
        cambiado = true;
      }
    }

    if (Array.isArray(snap.history) && snap.history.length) {
      const local = leerJson('dante_history_cache', []);
      const ids = new Set((Array.isArray(local) ? local : []).map(function (x) { return x && x.id; }).filter(Boolean));
      const merged = Array.isArray(local) ? local.slice() : [];
      snap.history.forEach(function (h) {
        if (!h || !h.id || ids.has(h.id)) return;
        merged.push(h);
        ids.add(h.id);
      });
      if (merged.length !== (local && local.length)) {
        merged.sort(function (a, b) {
          return String((b && b.created_at) || '').localeCompare(String((a && a.created_at) || ''));
        });
        localStorage.setItem('dante_history_cache', JSON.stringify(merged.slice(0, 80)));
        cambiado = true;
      }
    }
    return cambiado;
  }

  async function leerExpediente(studentId) {
    const id = idAlumno(studentId);
    if (!id) return null;
    try {
      const q = new URLSearchParams({ estudiante: id });
      const resp = await fetch('/api/dante/expediente?' + q.toString(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      if (!json || !json.ok) return null;
      return {
        progreso: Array.isArray(json.progreso) ? json.progreso : [],
        eventos: Array.isArray(json.eventos) ? json.eventos : [],
        snapshot: json.snapshot || null
      };
    } catch (e) {
      return null;
    }
  }

  let _pushTimer = null;
  let _pushing = false;

  async function subirProgreso(studentId) {
    const id = idAlumno(studentId);
    if (!id || _pushing) return { ok: false, motivo: 'busy_or_no_id' };
    const snapshot = recolectarSnapshot();
    const tieneAlgo = (snapshot.score != null && snapshot.score > 0)
      || snapshot.racha > 0
      || (snapshot.history && snapshot.history.length)
      || snapshot.meta
      || snapshot.preguntasLocal > 0
      || Object.keys(snapshot.areaConteo || {}).length;
    if (!tieneAlgo) return { ok: true, skipped: true };
    _pushing = true;
    try {
      const resp = await fetch('/api/dante/progreso/sync', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ estudiante: id, studentId: id, snapshot: snapshot })
      });
      const json = await resp.json().catch(function () { return {}; });
      if (!resp.ok || !json.ok) return { ok: false, motivo: (json && json.error) || 'sync_fail' };
      return { ok: true, skipped: Boolean(json.skipped), snapshot: json.snapshot || null };
    } catch (e) {
      return { ok: false, motivo: 'sin_red' };
    } finally {
      _pushing = false;
    }
  }

  function subirProgresoDebounced(ms) {
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(function () {
      subirProgreso().catch(function () {});
    }, typeof ms === 'number' ? ms : 1200);
  }

  async function reconciliarProgreso(studentId) {
    const id = idAlumno(studentId);
    if (!id) return { ok: false, motivo: 'sin_alumno' };
    let nube = null;
    try { nube = await leerExpediente(id); } catch (e) { nube = null; }
    if (nube && nube.snapshot) {
      try { aplicarSnapshot(nube.snapshot, { forzar: false }); } catch (e) {}
    } else if (nube && Array.isArray(nube.progreso)) {
      const saber = nube.progreso.find(function (r) {
        return r && r.materia === 'saber_11' && r.medido && r.puntaje_escalonado != null;
      });
      if (saber) {
        try {
          aplicarSnapshot({
            score: saber.puntaje_escalonado,
            racha: saber.racha_dias || 0,
            theta: saber.theta,
            sem: saber.bayesian_sem,
            preguntasLocal: saber.preguntas_respondidas || 0,
            history: Array.isArray(saber.historial_sesiones) ? saber.historial_sesiones : [],
            updatedAt: saber.ultima_actualizacion || new Date().toISOString()
          }, { forzar: false });
        } catch (e) {}
      }
    }
    const push = await subirProgreso(id);
    return { ok: true, nube: Boolean(nube), push: push };
  }

  window.DanteNube = {
    cliente: cliente,
    leerExpediente: leerExpediente,
    recolectarSnapshot: recolectarSnapshot,
    subirProgreso: subirProgreso,
    subirProgresoDebounced: subirProgresoDebounced,
    reconciliarProgreso: reconciliarProgreso
  };

  function arrancar() {
    const id = idAlumno();
    if (!id) return;
    reconciliarProgreso(id).catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(arrancar, 900);
    });
  } else {
    setTimeout(arrancar, 900);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') subirProgresoDebounced(200);
  });
})();
