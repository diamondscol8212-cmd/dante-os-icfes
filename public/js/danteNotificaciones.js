/**
 * Recordatorios del estudiante: entrenamiento diario + pendientes (fallidas / temas).
 * Web: Notification API (+ service worker para click).
 * Capacitor: LocalNotifications del plugin si existe; si no, Notification API.
 */
(function (global) {
  'use strict';

  var PREFS_PREFIX = 'dante_notif_prefs_v1:';
  var DONE_DAY_KEY = 'dante_entrenamiento_completado_dia';
  var LAST_DAILY_KEY = 'dante_notif_daily_sent_dia';
  var LAST_PEND_KEY = 'dante_notif_pend_sent_ts';
  var SW_PATH = 'dante-sw.js';
  var HORA_MIN = 15;
  var HORA_MAX = 19;
  var HORA_IDEAL = 16;
  var PEND_COOLDOWN_MS = 36 * 60 * 60 * 1000;
  var _timer = null;
  var _started = false;

  function studentKey() {
    try {
      if (global.DanteStudentId && typeof global.DanteStudentId.studentKey === 'function') {
        return global.DanteStudentId.studentKey() || 'anon';
      }
    } catch (_) {}
    return 'anon';
  }

  function prefsKey() {
    return PREFS_PREFIX + studentKey();
  }

  function hoyLocal() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function leerPrefs() {
    var out = {
      enabled: false,
      permisoPedido: false,
      denied: false,
      updatedAt: ''
    };
    try {
      var raw = localStorage.getItem(prefsKey());
      if (raw) {
        var p = JSON.parse(raw);
        if (p && typeof p === 'object') {
          out.enabled = !!p.enabled;
          out.permisoPedido = !!p.permisoPedido;
          out.denied = !!p.denied;
          out.updatedAt = p.updatedAt || '';
        }
      } else if (localStorage.getItem('dante_recordatorio_dosis_activo') === 'true') {
        // Migración suave del recordatorio legacy.
        out.enabled = true;
      }
    } catch (_) {}
    return out;
  }

  function guardarPrefs(p) {
    try {
      p = p || leerPrefs();
      p.updatedAt = new Date().toISOString();
      localStorage.setItem(prefsKey(), JSON.stringify(p));
      // Compat con UI legacy de “dosis”.
      localStorage.setItem('dante_recordatorio_dosis_activo', p.enabled ? 'true' : 'false');
    } catch (_) {}
    try {
      if (global.DanteNube && typeof global.DanteNube.subirProgresoDebounced === 'function') {
        global.DanteNube.subirProgresoDebounced(1200);
      }
    } catch (_) {}
    syncUi();
  }

  function esNativo() {
    try {
      return !!(global.Capacitor && typeof global.Capacitor.isNativePlatform === 'function'
        && global.Capacitor.isNativePlatform());
    } catch (_) {
      return false;
    }
  }

  function pluginLocal() {
    try {
      var plugins = global.Capacitor && global.Capacitor.Plugins;
      return (plugins && plugins.LocalNotifications) || null;
    } catch (_) {
      return null;
    }
  }

  function permisoNotification() {
    if (!('Notification' in global)) return 'unsupported';
    return Notification.permission;
  }

  function marcarEntrenamientoHechoHoy() {
    try { localStorage.setItem(DONE_DAY_KEY, hoyLocal()); } catch (_) {}
  }

  function entrenamientoHechoHoy() {
    try {
      if (localStorage.getItem(DONE_DAY_KEY) === hoyLocal()) return true;
    } catch (_) {}
    try {
      var raw = localStorage.getItem('dante_history_cache');
      var hist = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(hist)) return false;
      var hoy = hoyLocal();
      for (var i = 0; i < hist.length; i++) {
        var r = hist[i];
        if (!r) continue;
        var tipo = String(r.tipo || '').toUpperCase();
        if (tipo !== 'MISION_DIARIA') continue;
        var ts = String(r.created_at || r.ts || '');
        if (!ts) continue;
        var d = new Date(ts);
        if (Number.isNaN(d.getTime())) continue;
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        var local = d.getFullYear() + '-' + m + '-' + day;
        if (local === hoy) return true;
      }
    } catch (_) {}
    return false;
  }

  function contarFallidas() {
    try {
      if (global.DanteRepasoFallidas && typeof global.DanteRepasoFallidas.inventario === 'function') {
        var inv = global.DanteRepasoFallidas.inventario();
        if (inv && typeof inv.pendientes === 'number') return inv.pendientes;
        if (inv && typeof inv.total === 'number') return inv.total;
      }
    } catch (_) {}
    try {
      var raw = JSON.parse(localStorage.getItem('dante_fallidas_ledger_v2') || '[]');
      return Array.isArray(raw) ? raw.length : 0;
    } catch (_) {
      return 0;
    }
  }

  function contarTemasPendientes() {
    try {
      if (global.DanteTemasRefuerzo && typeof global.DanteTemasRefuerzo.contarPendientes === 'function') {
        return Number(global.DanteTemasRefuerzo.contarPendientes()) || 0;
      }
      if (global.DanteTemasRefuerzo && typeof global.DanteTemasRefuerzo.leerEstado === 'function') {
        var est = global.DanteTemasRefuerzo.leerEstado();
        if (est && Array.isArray(est.pendientes)) return est.pendientes.length;
      }
    } catch (_) {}
    try {
      var key = 'dante_temas_refuerzo_v1:' + studentKey();
      var raw = JSON.parse(localStorage.getItem(key) || 'null');
      if (raw && Array.isArray(raw.pendientes)) return raw.pendientes.length;
    } catch (_) {}
    return 0;
  }

  function enVentanaTarde() {
    var h = new Date().getHours();
    return h >= HORA_MIN && h < HORA_MAX;
  }

  function yaEnvioDiarioHoy() {
    try { return localStorage.getItem(LAST_DAILY_KEY) === hoyLocal(); } catch (_) { return false; }
  }

  function marcarDiarioEnviado() {
    try { localStorage.setItem(LAST_DAILY_KEY, hoyLocal()); } catch (_) {}
  }

  function puedeEnviarPendientes() {
    try {
      var ts = Number(localStorage.getItem(LAST_PEND_KEY) || 0);
      if (!ts) return true;
      return (Date.now() - ts) >= PEND_COOLDOWN_MS;
    } catch (_) {
      return true;
    }
  }

  function marcarPendientesEnviado() {
    try { localStorage.setItem(LAST_PEND_KEY, String(Date.now())); } catch (_) {}
  }

  function registrarSW() {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register(SW_PATH + '?v=' + encodeURIComponent(global.DANTE_CACHE_VERSION || '1'))
      .then(function (reg) { return reg; })
      .catch(function () { return null; });
  }

  function mostrarViaCapacitor(title, body, data) {
    var LN = pluginLocal();
    if (!LN || typeof LN.schedule !== 'function') return Promise.resolve(false);
    var id = Math.floor(Date.now() % 100000) + 1;
    return Promise.resolve(LN.schedule({
      notifications: [{
        id: id,
        title: title,
        body: body,
        schedule: { at: new Date(Date.now() + 800) },
        extra: data || {}
      }]
    })).then(function () { return true; }).catch(function () { return false; });
  }

  function mostrarViaBrowser(title, body, data) {
    if (!('Notification' in global) || Notification.permission !== 'granted') {
      return Promise.resolve(false);
    }
    var opts = {
      body: body,
      icon: 'assets/icons/dante-logo-icon.svg',
      badge: 'assets/icons/dante-logo-icon.svg',
      tag: (data && data.tag) || 'dante-reminder',
      renotify: false,
      data: data || {}
    };
    return registrarSW().then(function (reg) {
      if (reg && reg.showNotification) {
        return reg.showNotification(title, opts).then(function () { return true; });
      }
      try {
        // eslint-disable-next-line no-new
        new Notification(title, opts);
        return true;
      } catch (_) {
        return false;
      }
    });
  }

  function mostrar(title, body, data) {
    if (esNativo()) {
      return mostrarViaCapacitor(title, body, data).then(function (ok) {
        if (ok) return true;
        return mostrarViaBrowser(title, body, data);
      });
    }
    return mostrarViaBrowser(title, body, data);
  }

  function pedirPermiso() {
    var prefs = leerPrefs();
    if (prefs.denied) return Promise.resolve('denied');

    var LN = pluginLocal();
    if (esNativo() && LN && typeof LN.requestPermissions === 'function') {
      prefs.permisoPedido = true;
      return LN.requestPermissions().then(function (res) {
        var display = (res && (res.display || res.granted)) || '';
        var ok = display === 'granted' || display === true || (res && res.receive === 'granted');
        prefs.denied = !ok;
        guardarPrefs(prefs);
        return ok ? 'granted' : 'denied';
      }).catch(function () {
        prefs.denied = true;
        guardarPrefs(prefs);
        return 'denied';
      });
    }

    if (!('Notification' in global)) {
      prefs.denied = true;
      guardarPrefs(prefs);
      return Promise.resolve('unsupported');
    }
    if (Notification.permission === 'granted') {
      prefs.permisoPedido = true;
      prefs.denied = false;
      guardarPrefs(prefs);
      return Promise.resolve('granted');
    }
    if (Notification.permission === 'denied') {
      prefs.permisoPedido = true;
      prefs.denied = true;
      guardarPrefs(prefs);
      return Promise.resolve('denied');
    }
    prefs.permisoPedido = true;
    guardarPrefs(prefs);
    return Notification.requestPermission().then(function (perm) {
      prefs.denied = perm !== 'granted';
      guardarPrefs(prefs);
      return perm;
    });
  }

  function evaluarYEnviar() {
    var prefs = leerPrefs();
    if (!prefs.enabled || prefs.denied) return Promise.resolve({ sent: false, reason: 'off' });
    if (permisoNotification() === 'denied') {
      prefs.denied = true;
      guardarPrefs(prefs);
      return Promise.resolve({ sent: false, reason: 'denied' });
    }
    if (permisoNotification() !== 'granted' && !(esNativo() && pluginLocal())) {
      return Promise.resolve({ sent: false, reason: 'no-permission' });
    }

    var chain = Promise.resolve({ sent: false });

    // 1) Entrenamiento diario (una vez al día, solo en ventana tarde, si no lo hizo).
    if (enVentanaTarde() && !entrenamientoHechoHoy() && !yaEnvioDiarioHoy()) {
      chain = chain.then(function () {
        return mostrar(
          'Dante OS',
          'Tu entrenamiento de hoy está listo',
          { tag: 'dante-daily', tipo: 'entrenamiento', url: 'index.html' }
        ).then(function (ok) {
          if (ok) marcarDiarioEnviado();
          return { sent: ok, tipo: 'entrenamiento' };
        });
      });
    }

    // 2) Pendientes (máx. cada 36 h).
    chain = chain.then(function (prev) {
      if (!puedeEnviarPendientes()) return prev;
      var nFall = contarFallidas();
      var nTemas = contarTemasPendientes();
      if (!nFall && !nTemas) return prev;
      var body = nFall > 0
        ? 'Tienes preguntas fallidas por repasar'
        : 'Tienes temas de refuerzo pendientes';
      var url = nFall > 0 ? 'index.html?repaso=fallidas' : 'temas-refuerzo.html';
      return mostrar('Dante OS', body, {
        tag: 'dante-pendientes',
        tipo: nFall > 0 ? 'fallidas' : 'temas',
        url: url
      }).then(function (ok) {
        if (ok) marcarPendientesEnviado();
        return ok ? { sent: true, tipo: nFall > 0 ? 'fallidas' : 'temas' } : prev;
      });
    });

    return chain;
  }

  function msHastaProximaRevision() {
    var now = new Date();
    var h = now.getHours();
    // Si aún no llega la ventana, apuntar a las 16:00 de hoy.
    if (h < HORA_MIN) {
      var t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), HORA_IDEAL, 0, 0, 0);
      return Math.max(30 * 1000, t.getTime() - now.getTime());
    }
    // Dentro o después: revisar cada ~15 min (y en resume).
    return 15 * 60 * 1000;
  }

  function programarTick() {
    if (_timer) {
      clearTimeout(_timer);
      _timer = null;
    }
    var prefs = leerPrefs();
    if (!prefs.enabled || prefs.denied) return;
    _timer = setTimeout(function () {
      evaluarYEnviar().finally(function () {
        programarTick();
      });
    }, msHastaProximaRevision());
  }

  function setEnabled(on) {
    var prefs = leerPrefs();
    if (!on) {
      prefs.enabled = false;
      guardarPrefs(prefs);
      if (_timer) { clearTimeout(_timer); _timer = null; }
      return Promise.resolve(prefs);
    }
    return pedirPermiso().then(function (perm) {
      prefs = leerPrefs();
      if (perm === 'granted') {
        prefs.enabled = true;
        prefs.denied = false;
      } else if (perm === 'denied') {
        prefs.enabled = false;
        prefs.denied = true;
      } else {
        // unsupported: guardar intención pero no insistir
        prefs.enabled = false;
        prefs.denied = true;
      }
      guardarPrefs(prefs);
      if (prefs.enabled) {
        registrarSW();
        programarTick();
        // Si ya estamos en ventana tarde, evaluar ya.
        evaluarYEnviar();
      }
      return prefs;
    });
  }

  function toggle() {
    var prefs = leerPrefs();
    return setEnabled(!prefs.enabled);
  }

  function syncUi() {
    var prefs = leerPrefs();
    var on = !!prefs.enabled && !prefs.denied;
    var nodes = document.querySelectorAll('[data-dante-notif-toggle]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.tagName === 'INPUT' && el.type === 'checkbox') {
        el.checked = on;
        el.disabled = !!prefs.denied && permisoNotification() === 'denied';
      }
    }
    var labels = document.querySelectorAll('[data-dante-notif-label]');
    for (var j = 0; j < labels.length; j++) {
      var lab = labels[j];
      if (prefs.denied && permisoNotification() === 'denied') {
        lab.textContent = 'Permiso denegado en el dispositivo. Actívalo en ajustes del sistema si quieres recordatorios.';
      } else if (on) {
        lab.textContent = 'Activadas · entrenamiento ~4:00 p. m. y pendientes cada 1–2 días';
      } else {
        lab.textContent = 'Desactivadas. Puedes activarlas cuando quieras.';
      }
    }
    try {
      var legacy = document.getElementById('lblRecordatorioDosisSinVidas');
      if (legacy) {
        legacy.textContent = on
          ? 'Recordatorio activado (~4:00 p. m.)'
          : 'Activar recordatorio de entrenamiento';
      }
    } catch (_) {}
  }

  function init() {
    if (_started) {
      syncUi();
      return;
    }
    _started = true;
    syncUi();
    var prefs = leerPrefs();
    if (prefs.enabled && !prefs.denied) {
      registrarSW();
      programarTick();
      // Evaluación suave al abrir (respeta ventana / cooldown).
      setTimeout(function () { evaluarYEnviar(); }, 2500);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        syncUi();
        var p = leerPrefs();
        if (p.enabled && !p.denied) evaluarYEnviar();
      }
    });
  }

  global.DanteNotificaciones = {
    init: init,
    toggle: toggle,
    setEnabled: setEnabled,
    leerPrefs: leerPrefs,
    pedirPermiso: pedirPermiso,
    evaluarYEnviar: evaluarYEnviar,
    marcarEntrenamientoHechoHoy: marcarEntrenamientoHechoHoy,
    entrenamientoHechoHoy: entrenamientoHechoHoy,
    syncUi: syncUi,
    contarFallidas: contarFallidas,
    contarTemasPendientes: contarTemasPendientes
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
})(typeof window !== 'undefined' ? window : this);
