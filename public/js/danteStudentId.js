/**
 * Identidad canónica del estudiante en cliente (misma huella que el servidor).
 * Preferir estudiante/email local-part; nunca inventar UUID de sesión como alias.
 */
(function (global) {
  'use strict';

  function aliasEstudiante(raw) {
    const texto = String(raw || '').trim().toLowerCase();
    if (!texto) return '';
    return texto.split('@')[0].replace(/[^a-z0-9._-]/g, '').slice(0, 80);
  }

  function idAlumno() {
    try {
      const directos = [
        localStorage.getItem('dante_student_id'),
        localStorage.getItem('dante_active_student')
      ];
      for (let i = 0; i < directos.length; i++) {
        const limpio = aliasEstudiante(directos[i]);
        if (limpio && limpio !== 'estudiante' && limpio !== 'student_demo_01' && limpio !== 'anon') {
          return limpio;
        }
      }
      const usuario = JSON.parse(localStorage.getItem('dante_user') || 'null');
      if (usuario) {
        const raw = usuario.estudiante || usuario.email || usuario.username || '';
        const limpio = aliasEstudiante(raw);
        if (limpio && limpio !== 'estudiante') return limpio;
      }
    } catch (_) { /* ignore */ }
    return '';
  }

  /** Clave estable para bóvedas Hackea / localStorage namespaced. */
  function studentKey() {
    return idAlumno() || 'anon';
  }

  function authHeaders(extra) {
    const h = Object.assign({ 'Content-Type': 'application/json' }, extra || {});
    try {
      const t = localStorage.getItem('dante_token') || localStorage.getItem('token') || localStorage.getItem('dante_jwt');
      if (t) h.Authorization = 'Bearer ' + t;
      const sk = studentKey();
      if (sk && sk !== 'anon') h['x-student-id'] = sk;
    } catch (_) { /* ignore */ }
    return h;
  }

  /**
   * Claves de progreso no namespaced que no deben sobrevivir un cambio de cuenta.
   */
  const PROGRESS_KEYS = [
    'dante_exam_progress',
    'dante_sesion_pausada',
    'dante_fallidas_ledger_v2',
    'dante_simulacro_largo',
    'dante_history_cache',
    'dante_respuestas_irt',
    'dante_pendiente_nube',
    'dante_area_conteo',
    'dante_respaldo_n',
    'dante_theta_estimado',
    'dante_sem_estimado',
    'dante_score_proyectado',
    'dante_diagnostico_completado',
    'dante_diagnostico_hecho',
    'dante_is_diagnostic',
    'dante_diag_done',
    'dante_mision_activa',
    'dante_guardado_estado'
  ];

  function purgeProgressKeys() {
    try {
      PROGRESS_KEYS.forEach((k) => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      // Colas / scores / diag con sufijos
      const doomed = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (
          k.indexOf('dante_pendiente_nube:') === 0 ||
          k.indexOf('dante_temas_refuerzo_v1:') === 0 ||
          k.indexOf('dante_score_') === 0 ||
          k.indexOf('dante_diagnostico_') === 0 ||
          k === 'dante_is_diagnostic'
        ) doomed.push(k);
      }
      doomed.forEach((k) => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      try { sessionStorage.removeItem('dante_exam_progress'); } catch (_) {}
      try { sessionStorage.removeItem('dante_is_diagnostic'); } catch (_) {}
    } catch (_) { /* ignore */ }
  }

  /** Si el alumno cambia, limpia progreso local para no mezclar cuentas. */
  function ensureIsolatedSession(nextStudentId) {
    const next = aliasEstudiante(nextStudentId);
    if (!next || next === 'estudiante') return;
    let prev = '';
    try {
      prev = aliasEstudiante(
        localStorage.getItem('dante_student_id') ||
        localStorage.getItem('dante_active_student') ||
        ''
      );
    } catch (_) { prev = ''; }
    if (prev && prev !== next) purgeProgressKeys();
  }

  global.DanteStudentId = {
    aliasEstudiante,
    idAlumno,
    studentKey,
    authHeaders,
    purgeProgressKeys,
    ensureIsolatedSession,
    PROGRESS_KEYS
  };
})(window);
