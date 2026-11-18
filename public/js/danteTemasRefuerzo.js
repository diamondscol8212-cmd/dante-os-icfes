/**
 * Temas de refuerzo: lista personal por estudiante + catálogo de estudio.
 * Al fallar una pregunta se agrega el subtema (sin duplicados).
 */
(function (global) {
  'use strict';

  var CATALOGO_URL = 'temasRefuerzo.json';
  var STORE_PREFIX = 'dante_temas_refuerzo_v1:';
  var _catalogo = null;
  var _catalogoPromise = null;

  function alumno() {
    try {
      if (global.DanteStudentId && typeof global.DanteStudentId.studentKey === 'function') {
        return global.DanteStudentId.studentKey();
      }
    } catch (_) {}
    return 'anon';
  }

  function storeKey() {
    return STORE_PREFIX + alumno();
  }

  function leerEstado() {
    try {
      var raw = localStorage.getItem(storeKey());
      var data = raw ? JSON.parse(raw) : null;
      if (!data || typeof data !== 'object') data = { pendientes: [], hechos: {}, updatedAt: '' };
      if (!Array.isArray(data.pendientes)) data.pendientes = [];
      if (!data.hechos || typeof data.hechos !== 'object') data.hechos = {};
      return data;
    } catch (_) {
      return { pendientes: [], hechos: {}, updatedAt: '' };
    }
  }

  function guardarEstado(data) {
    try {
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(storeKey(), JSON.stringify(data));
      try {
        if (global.DanteNube && typeof global.DanteNube.subirProgresoDebounced === 'function') {
          global.DanteNube.subirProgresoDebounced(900);
        } else if (global.DanteNube && typeof global.DanteNube.subirProgreso === 'function') {
          global.DanteNube.subirProgreso();
        }
      } catch (_) {}
    } catch (_) {}
  }

  function slugify(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 60);
  }

  function cargarCatalogo() {
    if (_catalogo) return Promise.resolve(_catalogo);
    if (_catalogoPromise) return _catalogoPromise;
    _catalogoPromise = fetch(CATALOGO_URL + '?v=' + encodeURIComponent(
      (global.DANTE_CACHE_VERSION || '') + ''
    ), { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : { temas: [] }; })
      .then(function (json) {
        _catalogo = json && Array.isArray(json.temas) ? json : { temas: [] };
        return _catalogo;
      })
      .catch(function () {
        _catalogo = { temas: [] };
        return _catalogo;
      });
    return _catalogoPromise;
  }

  function temaPorId(id) {
    var cat = _catalogo && _catalogo.temas ? _catalogo.temas : [];
    return cat.find(function (t) { return t && t.id === id; }) || null;
  }

  function resolverTemaId(meta) {
    meta = meta || {};
    var sub = String(meta.sub || meta.sub_competencia || '').toLowerCase().trim();
    var temaTxt = String(
      meta.tema_a_estudiar || meta.tema || meta.repaso || meta.enunciado || ''
    ).toLowerCase();
    var cat = (_catalogo && _catalogo.temas) || [];

    // 1) Fracciones por enunciado/tema (antes de caer en aritmética genérica).
    if (/fraccion|numerador|denominador/.test(temaTxt)) return 'fracciones';

    // 2) sub_competencia exacta del banco (= id del catálogo).
    if (sub) {
      for (var i = 0; i < cat.length; i++) {
        var t = cat[i];
        if (!t) continue;
        if (t.id === sub) return t.id;
        if (Array.isArray(t.subs) && t.subs.indexOf(sub) >= 0) return t.id;
      }
    }

    // 3) match por texto de tema_a_estudiar.
    for (var j = 0; j < cat.length; j++) {
      var tm = cat[j];
      if (!tm || !Array.isArray(tm.matchTema)) continue;
      for (var k = 0; k < tm.matchTema.length; k++) {
        var needle = String(tm.matchTema[k]).toLowerCase();
        if (needle && temaTxt.indexOf(needle) >= 0) return tm.id;
      }
    }

    if (sub) return sub;
    if (temaTxt) return slugify(temaTxt);
    return '';
  }

  function tituloDe(temaId, meta) {
    var t = temaPorId(temaId);
    if (t && t.titulo) return t.titulo;
    if (meta && (meta.tema_a_estudiar || meta.tema || meta.repaso)) {
      return String(meta.tema_a_estudiar || meta.tema || meta.repaso);
    }
    return temaId.replace(/_/g, ' ');
  }

  function areaDe(temaId, meta) {
    var t = temaPorId(temaId);
    if (t && t.area) return t.area;
    return String((meta && (meta.area || meta.materia)) || '').toLowerCase();
  }

  /**
   * Registra un fallo → agrega tema a pendientes (sin duplicar).
   * meta: { sub, sub_competencia, tema_a_estudiar, tema, repaso, area, itemId }
   */
  function registrarFallo(meta) {
    meta = meta || {};
    return cargarCatalogo().then(function () {
      var temaId = resolverTemaId(meta);
      if (!temaId) return null;
      var estado = leerEstado();
      if (estado.hechos[temaId]) {
        // Si ya estaba "hecho" y vuelve a fallar, reabre como pendiente.
        delete estado.hechos[temaId];
      }
      var existe = estado.pendientes.some(function (p) { return p && p.id === temaId; });
      if (!existe) {
        var catTema = temaPorId(temaId);
        estado.pendientes.unshift({
          id: temaId,
          titulo: tituloDe(temaId, meta),
          area: areaDe(temaId, meta),
          nivel: (catTema && catTema.nivel) || '',
          itemId: meta.itemId || meta.id || '',
          ts: Date.now()
        });
        if (estado.pendientes.length > 80) estado.pendientes = estado.pendientes.slice(0, 80);
        guardarEstado(estado);
      } else {
        // Actualiza título si el catálogo ya cargó uno mejor
        estado.pendientes.forEach(function (p) {
          if (p && p.id === temaId) {
            p.titulo = tituloDe(temaId, meta);
            p.ts = Date.now();
          }
        });
        guardarEstado(estado);
      }
      return temaId;
    });
  }

  function marcarHecho(temaId, detalle) {
    var id = String(temaId || '');
    if (!id) return;
    var estado = leerEstado();
    estado.pendientes = estado.pendientes.filter(function (p) { return !p || p.id !== id; });
    estado.hechos[id] = {
      ts: Date.now(),
      aciertos: detalle && detalle.aciertos,
      total: detalle && detalle.total
    };
    guardarEstado(estado);
  }

  function listarPendientes() {
    return leerEstado().pendientes.slice();
  }

  function listarHechos() {
    var estado = leerEstado();
    return Object.keys(estado.hechos || {}).map(function (id) {
      return {
        id: id,
        titulo: tituloDe(id, null),
        ts: estado.hechos[id] && estado.hechos[id].ts,
        detalle: estado.hechos[id]
      };
    });
  }

  function exportarParaSnapshot() {
    return leerEstado();
  }

  function importarDesdeSnapshot(snapTemas) {
    if (!snapTemas || typeof snapTemas !== 'object') return;
    var local = leerEstado();
    var remotePend = Array.isArray(snapTemas.pendientes) ? snapTemas.pendientes : [];
    var remoteHechos = snapTemas.hechos && typeof snapTemas.hechos === 'object' ? snapTemas.hechos : {};
    var map = {};
    local.pendientes.forEach(function (p) { if (p && p.id) map[p.id] = p; });
    remotePend.forEach(function (p) {
      if (!p || !p.id) return;
      if (!map[p.id] || (p.ts || 0) > (map[p.id].ts || 0)) map[p.id] = p;
    });
    var hechos = Object.assign({}, remoteHechos, local.hechos);
    // Si está en pendientes, no lo dejes como hecho
    Object.keys(map).forEach(function (id) { delete hechos[id]; });
    guardarEstado({
      pendientes: Object.keys(map).map(function (k) { return map[k]; }),
      hechos: hechos,
      updatedAt: new Date().toISOString()
    });
  }

  function contarPendientes() {
    return leerEstado().pendientes.length;
  }

  global.DanteTemasRefuerzo = {
    cargarCatalogo: cargarCatalogo,
    temaPorId: temaPorId,
    resolverTemaId: resolverTemaId,
    registrarFallo: registrarFallo,
    marcarHecho: marcarHecho,
    listarPendientes: listarPendientes,
    listarHechos: listarHechos,
    contarPendientes: contarPendientes,
    exportarParaSnapshot: exportarParaSnapshot,
    importarDesdeSnapshot: importarDesdeSnapshot,
    leerEstado: leerEstado
  };
})(window);
