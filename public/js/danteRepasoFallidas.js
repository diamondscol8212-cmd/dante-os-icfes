/**
 * Repaso · preguntas fallidas
 * Fuente de verdad: base de datos (progreso_estudiantes.items_respondidos).
 * Solo ítems que ESTE alumno respondió mal. Nunca completa con banco genérico.
 */
(function () {
  'use strict';

  const MAX_BLOQUE = 10;
  const CLAVE_CACHE = 'dante_repaso_fallidas_db';
  const CLAVE_SUPERADAS = 'dante_repaso_fallidas_superadas';

  let cachePendientes = [];
  let cargando = false;

  function limpio(t) {
    return String(t || '').replace(/\s+/g, ' ').trim();
  }

  function idValido(raw) {
    const id = String(raw || '').trim();
    if (!id) return '';
    if (/^item_\d+$/i.test(id)) return '';
    if (/^preun_/i.test(id)) return '';
    if (id === 'undefined' || id === 'null') return '';
    return id;
  }

  function idAlumno() {
    if (window.DanteRegistro && typeof window.DanteRegistro.idAlumno === 'function') {
      const a = window.DanteRegistro.idAlumno();
      if (a) return a;
    }
    const directos = [
      localStorage.getItem('dante_student_id'),
      localStorage.getItem('dante_active_student')
    ];
    for (let i = 0; i < directos.length; i++) {
      const limpioId = String(directos[i] || '').toLowerCase().trim().split('@')[0];
      if (limpioId && limpioId !== 'estudiante' && limpioId !== 'student_demo_01') return limpioId;
    }
    try {
      const usuario = JSON.parse(localStorage.getItem('dante_user') || 'null');
      const raw = usuario && (usuario.estudiante || usuario.email || usuario.id);
      const limpioId = String(raw || '').toLowerCase().trim().split('@')[0];
      if (limpioId && limpioId !== 'estudiante') return limpioId;
    } catch (e) {}
    return '';
  }

  function leerSuperadas() {
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_SUPERADAS) || '{}');
      if (Array.isArray(raw)) {
        const mapa = {};
        raw.forEach((id) => {
          const limpioId = idValido(id);
          if (limpioId) mapa[limpioId] = Date.now();
        });
        return mapa;
      }
      return raw && typeof raw === 'object' ? raw : {};
    } catch (e) {
      return {};
    }
  }

  function guardarSuperadas(mapa) {
    try {
      localStorage.setItem(CLAVE_SUPERADAS, JSON.stringify(mapa || {}));
    } catch (e) {}
  }

  function marcarSuperadaLocal(id) {
    const limpioId = idValido(id);
    if (!limpioId) return;
    const mapa = leerSuperadas();
    mapa[limpioId] = new Date().toISOString();
    guardarSuperadas(mapa);
  }

  function quitarSuperadaLocal(id) {
    const limpioId = idValido(id);
    if (!limpioId) return;
    const mapa = leerSuperadas();
    if (!mapa[limpioId]) return;
    delete mapa[limpioId];
    guardarSuperadas(mapa);
  }

  function leerCacheLocal() {
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_CACHE) || '[]');
      return Array.isArray(raw) ? raw.filter((p) => p && idValido(p.id)) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCacheLocal(lista) {
    try {
      localStorage.setItem(CLAVE_CACHE, JSON.stringify((lista || []).slice(0, 400)));
    } catch (e) {}
  }

  function aplicarOverlayLocal(lista) {
    const superadas = leerSuperadas();
    return (lista || []).filter((p) => {
      const id = idValido(p && p.id);
      if (!id) return false;
      return !superadas[id];
    });
  }

  function inventario() {
    const lista = aplicarOverlayLocal(cachePendientes.length ? cachePendientes : leerCacheLocal());
    return { total: lista.length, pendientes: lista.length, hechasHoy: Object.keys(leerSuperadas()).length };
  }

  function pintarDetalle() {
    const el = document.getElementById('lblRepasoFallidasDetalle');
    if (!el) return;
    const inv = inventario();
    if (!inv.pendientes) {
      el.textContent = 'Sin fallos pendientes. Bien.';
      return;
    }
    el.textContent = inv.pendientes + (inv.pendientes === 1 ? ' pregunta pendiente' : ' preguntas pendientes');
  }

  function pintarPerfil() {
    const btn = document.getElementById('btnRepasoFallidasPerfil');
    if (!btn) return;
    const inv = inventario();
    const span = btn.querySelector('span') || btn;
    if (!inv.pendientes) {
      span.textContent = 'Repaso · sin fallidas pendientes';
    } else {
      span.textContent = 'Repaso · ' + inv.pendientes + (inv.pendientes === 1 ? ' fallida' : ' fallidas');
    }
  }

  function refrescarUI() {
    pintarDetalle();
    pintarPerfil();
  }

  async function cargarDesdeBase(forzar) {
    if (cargando && !forzar) return cachePendientes;
    const alumno = idAlumno();
    if (!alumno) {
      cachePendientes = [];
      guardarCacheLocal([]);
      refrescarUI();
      return [];
    }
    cargando = true;
    try {
      const q = new URLSearchParams({ estudiante: alumno });
      const resp = await fetch('/api/dante/fallidas?' + q.toString(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!resp.ok) throw new Error('http_' + resp.status);
      const json = await resp.json();
      if (!json || json.ok !== true) throw new Error((json && json.error) || 'fallidas_fail');
      const lista = Array.isArray(json.pendientes) ? json.pendientes : [];
      cachePendientes = lista
        .map((p) => ({
          id: idValido(p.id || p.item_id),
          area: limpio(p.area || ''),
          letra: limpio(p.letra || ''),
          tipo: limpio(p.tipo || ''),
          timestamp: p.timestamp || null
        }))
        .filter((p) => p.id);
      // Si la base confirma acierto, limpia overlay local de esos ids.
      const idsPend = new Set(cachePendientes.map((p) => p.id));
      const superadas = leerSuperadas();
      Object.keys(superadas).forEach((id) => {
        if (!idsPend.has(id)) return; // sigue pendiente en DB → no tocar
        // pendiente en DB y en superadas: la DB manda, quita overlay
        // (si acertó hace un momento, el POST aún no llegó; mantener overlay)
      });
      guardarCacheLocal(cachePendientes);
      refrescarUI();
      return cachePendientes;
    } catch (e) {
      cachePendientes = leerCacheLocal();
      refrescarUI();
      return cachePendientes;
    } finally {
      cargando = false;
    }
  }

  async function sincronizarRespuestas(respuestas, tipo) {
    const alumno = idAlumno();
    const lista = (Array.isArray(respuestas) ? respuestas : Object.values(respuestas || {}))
      .map((r) => {
        if (!r || typeof r.correcto !== 'boolean') return null;
        if (r.calificacionPendiente === true) return null;
        const id = idValido(r.id || r.itemId);
        if (!id) return null;
        return {
          id: id,
          correcto: r.correcto === true,
          area: r.materia || r.area || '',
          letra: r.opcionSeleccionada || r.letra || '',
          a: r.a,
          b: r.b,
          c: r.c,
          ms: r.latenciaMs || r.ms || 0
        };
      })
      .filter(Boolean);

    lista.forEach((r) => {
      if (r.correcto) marcarSuperadaLocal(r.id);
      else quitarSuperadaLocal(r.id);
    });

    // Baja inmediata del contador en sala (antes de la red).
    if (lista.length) {
      const quitados = new Set(lista.filter((r) => r.correcto).map((r) => r.id));
      const reFallados = new Set(lista.filter((r) => !r.correcto).map((r) => r.id));
      cachePendientes = aplicarOverlayLocal(cachePendientes).filter((p) => !quitados.has(p.id));
      // Si falló de nuevo y no estaba, no inventamos: solo vuelve si ya estaba o DB lo trae.
      reFallados.forEach((id) => {
        if (!cachePendientes.some((p) => p.id === id)) {
          // no agregar fantasmas; la DB lo traerá al recargar
        }
      });
      guardarCacheLocal(cachePendientes);
      refrescarUI();
    }

    if (!alumno || !lista.length) return { ok: false };

    try {
      const resp = await fetch('/api/dante/fallidas/actualizar', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          studentId: alumno,
          tipo: tipo || 'REPASO_FALLIDAS',
          respuestas: lista,
          puntos: Number(localStorage.getItem('dante_score_proyectado') || 0) || null,
          theta: Number(localStorage.getItem('dante_theta_estimado')),
          sem: Number(localStorage.getItem('dante_sem_estimado'))
        })
      });
      const json = await resp.json().catch(() => null);
      if (json && json.ok) {
        cachePendientes = Array.isArray(json.pendientes) ? json.pendientes.filter((p) => idValido(p.id)).map((p) => ({
          id: idValido(p.id),
          area: limpio(p.area || ''),
          letra: limpio(p.letra || ''),
          tipo: limpio(p.tipo || ''),
          timestamp: p.timestamp || null
        })) : [];
        // Limpia superadas que ya no están pendientes en DB.
        const idsPend = new Set(cachePendientes.map((p) => p.id));
        const superadas = leerSuperadas();
        Object.keys(superadas).forEach((id) => {
          if (!idsPend.has(id)) delete superadas[id];
        });
        guardarSuperadas(superadas);
        guardarCacheLocal(cachePendientes);
        refrescarUI();
        return { ok: true, total: json.total };
      }
    } catch (e) {}
    return { ok: false };
  }

  async function banco() {
    if (Array.isArray(window.DANTE_BANCO_ITEMS) && window.DANTE_BANCO_ITEMS.length) {
      return window.DANTE_BANCO_ITEMS;
    }
    if (window.DanteHubEngine && typeof window.DanteHubEngine.precargarBanco === 'function') {
      try { return await window.DanteHubEngine.precargarBanco(); } catch (e) {}
    }
    try {
      const resp = await fetch('/bancoPreguntas.json');
      if (!resp.ok) return [];
      const data = await resp.json();
      if (Array.isArray(data)) window.DANTE_BANCO_ITEMS = data;
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function adaptar(raw) {
    if (window.DanteAbility && typeof window.DanteAbility.adaptarItem === 'function') {
      return window.DanteAbility.adaptarItem(raw);
    }
    if (!raw || !raw.id) return null;
    return {
      id: raw.id,
      area: raw.area || raw.area_general || raw.materia,
      materia: raw.area || raw.area_general || raw.materia,
      enunciado: raw.pregunta_texto || raw.texto || raw.enunciado,
      pregunta_texto: raw.pregunta_texto || raw.texto || raw.enunciado,
      opciones: raw.opciones || raw.opciones_respuesta || [],
      opciones_respuesta: raw.opciones_respuesta || raw.opciones || [],
      correcta: raw.correcta || raw.ok,
      a: raw.a,
      b: raw.b,
      c: raw.c,
      pista: raw.pista,
      frase_acierto: raw.frase_acierto,
      repaso: raw.repaso,
      razonesPorTexto: raw.razonesPorTexto
    };
  }

  function nota(titulo, texto, botones) {
    let capa = document.getElementById('notaRepasoFallidas');
    if (!capa) {
      capa = document.createElement('div');
      capa.id = 'notaRepasoFallidas';
      capa.style.cssText = 'position:fixed;inset:0;z-index:230;background:rgba(6,5,4,0.78);display:flex;align-items:center;justify-content:center;padding:1rem;';
      document.body.appendChild(capa);
    }
    const acciones = (botones || []).map((b, i) =>
      '<button type="button" data-rf="' + i + '" style="display:block;width:100%;margin-top:0.7rem;background:#e7d7c3;color:#1c1917;border:0;border-radius:999px;padding:0.75rem 1rem;font-family:Georgia,serif;font-size:1rem;cursor:pointer;">' + b.texto + '</button>'
    ).join('');
    capa.innerHTML = '<div style="width:min(24rem,100%);background:#faf8f5;color:#1c1917;border-radius:22px;padding:1.3rem 1.2rem;"><p style="margin:0;font-family:Georgia,serif;font-size:0.85rem;letter-spacing:0.04em;text-transform:uppercase;">Repaso</p><h2 style="margin:0.4rem 0 0;font-family:Georgia,serif;font-weight:500;font-size:1.35rem;">' + titulo + '</h2><p style="margin:0.8rem 0 0;line-height:1.45;">' + texto + '</p>' + acciones + '</div>';
    capa.querySelectorAll('[data-rf]').forEach((nodo) => {
      nodo.addEventListener('click', () => {
        const b = botones[Number(nodo.getAttribute('data-rf'))];
        if (b && b.alClick) b.alClick();
      });
    });
  }

  function cerrarNota() {
    const capa = document.getElementById('notaRepasoFallidas');
    if (capa) capa.remove();
  }

  function entrarWorkspace(mision) {
    cerrarNota();
    const gw = document.getElementById('viewGateway');
    if (gw) {
      gw.classList.remove('active');
      gw.classList.add('hidden');
      gw.style.display = 'none';
    }
    const ws = document.getElementById('viewWorkspace');
    if (ws) {
      ws.classList.add('active');
      ws.classList.remove('hidden');
      ws.style.display = 'block';
    }
    window.isExamActive = true;
    try { sessionStorage.setItem('dante_mision_actual', JSON.stringify(mision)); } catch (e) {}
    if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.iniciarSesion === 'function') {
      window.DanteExamWorkspace.iniciarSesion(mision);
    } else if (window.DanteHubEngine && typeof window.DanteHubEngine.procesarRespuestaMision === 'function') {
      window.DanteHubEngine.misionActual = mision;
      window.DanteHubEngine.procesarRespuestaMision(mision);
      window.DanteHubEngine.iniciarMision(true);
    }
  }

  async function abrir() {
    const desdeDb = await cargarDesdeBase(true);
    const fallos = aplicarOverlayLocal(desdeDb);
    if (!fallos.length) {
      nota('Nada pendiente', 'No hay preguntas fallidas tuyas en la base. Cuando falles en un entrenamiento, refuerzo o simulacro, aparecen aquí.', [
        { texto: 'Entendido', alClick: cerrarNota }
      ]);
      refrescarUI();
      return;
    }

    const ids = fallos.map((f) => f.id);
    const listaBanco = await banco();
    const porId = new Map();
    (listaBanco || []).forEach((raw) => {
      if (raw && raw.id) porId.set(String(raw.id), raw);
    });

    const reactivos = [];
    for (let i = 0; i < ids.length && reactivos.length < MAX_BLOQUE; i++) {
      const id = ids[i];
      const raw = porId.get(id);
      if (!raw) continue;
      const item = adaptar(raw);
      if (!item || String(item.id) !== String(id)) continue;
      if (!(item.enunciado || item.pregunta_texto)) continue;
      reactivos.push(item);
    }

    if (!reactivos.length) {
      nota(
        'Fallidas en tu expediente',
        'Tienes ' + fallos.length + ' fallidas reales en la base, pero este aparato no tiene esas preguntas del banco para practicarlas ahora.',
        [{ texto: 'Volver', alClick: cerrarNota }]
      );
      return;
    }

    nota(
      'Repaso · preguntas fallidas',
      'Son ' + reactivos.length + ' de tus ' + fallos.length + ' fallidas reales. Si las aciertas, salen de la lista y suman a tu proyección.',
      [
        {
          texto: 'Empezar repaso',
          alClick: () => {
            const mision = {
              success: true,
              misionId: 'repaso_fallidas_' + Date.now(),
              esRepasoFallidas: true,
              esRefuerzo: true,
              repasoArea: 'fallidas',
              isDiagnostic: false,
              isFirstSession: false,
              targetTrack: 'ICFES',
              totalReactivos: reactivos.length,
              reactivos: reactivos,
              microDilemasVocacionales: [],
              saludoDante: 'Repaso de ' + reactivos.length + ' fallidas tuyas. Si aciertas, bajan del contador.'
            };
            entrarWorkspace(mision);
          }
        },
        { texto: 'Cancelar', alClick: cerrarNota }
      ]
    );
  }

  function registrarRespuesta(fila) {
    if (!fila) return;
    const id = idValido(fila.id || fila.itemId);
    if (!id) return;
    if (fila.calificacionPendiente === true) {
      refrescarUI();
      return;
    }
    if (fila.correcto === true) {
      marcarSuperadaLocal(id);
      cachePendientes = cachePendientes.filter((p) => p.id !== id);
      guardarCacheLocal(cachePendientes);
    } else if (fila.correcto === false) {
      quitarSuperadaLocal(id);
    }
    refrescarUI();
    // Persistencia ligera por respuesta (no bloquea la UI).
    sincronizarRespuestas([fila], 'REPASO_FALLIDAS').catch(function () {});
  }

  function anotarSesion(respuestas) {
    sincronizarRespuestas(respuestas, 'REPASO_FALLIDAS').catch(function () {});
  }

  window.DanteRepasoFallidas = {
    abrir: abrir,
    inventario: inventario,
    pintar: refrescarUI,
    anotarSesion: anotarSesion,
    registrarRespuesta: registrarRespuesta,
    cargar: cargarDesdeBase,
    mapaFallos: function () {
      const m = new Map();
      aplicarOverlayLocal(cachePendientes.length ? cachePendientes : leerCacheLocal()).forEach((p) => m.set(p.id, p));
      return m;
    }
  };

  function arranque() {
    cachePendientes = leerCacheLocal();
    refrescarUI();
    cargarDesdeBase(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arranque);
  } else {
    arranque();
  }
  window.addEventListener('focus', function () { cargarDesdeBase(false); });
})();
