/**
 * Repaso · Fallidas
 * Ledger local del alumno + sync a la base.
 * Solo preguntas que ESTE alumno falló en diagnóstico / entrenamiento / refuerzo / simulacro.
 * Acertar en el repaso BAJA el contador al instante. Nunca rellena con banco genérico.
 */
(function () {
  'use strict';

  const MAX_BLOQUE = 10;
  const CLAVE_LEDGER = 'dante_fallidas_ledger_v2';

  /** @type {{ id: string, area: string, tipo: string, ts: string }[]} */
  let ledger = [];
  let syncTimer = null;

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

  function leerLedger() {
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_LEDGER) || '[]');
      if (!Array.isArray(raw)) return [];
      const mapa = new Map();
      raw.forEach((p) => {
        const id = idValido(p && (p.id || p.item_id));
        if (!id) return;
        mapa.set(id, {
          id: id,
          area: limpio(p.area || ''),
          tipo: limpio(p.tipo || 'MISION_DIARIA'),
          ts: p.ts || p.timestamp || new Date().toISOString()
        });
      });
      return Array.from(mapa.values());
    } catch (e) {
      return [];
    }
  }

  function guardarLedger(lista) {
    ledger = Array.isArray(lista) ? lista.slice(0, 400) : [];
    try {
      localStorage.setItem(CLAVE_LEDGER, JSON.stringify(ledger));
    } catch (e) {}
  }

  function inventario() {
    return { total: ledger.length, pendientes: ledger.length, hechasHoy: 0 };
  }

  function pintarDetalle() {
    const el = document.getElementById('lblRepasoFallidasDetalle');
    if (!el) return;
    const n = ledger.length;
    if (!n) {
      el.textContent = 'Sin fallos pendientes. Bien.';
      return;
    }
    el.textContent = n + (n === 1 ? ' pregunta pendiente' : ' preguntas pendientes');
  }

  function pintarPerfil() {
    const btn = document.getElementById('btnRepasoFallidasPerfil');
    if (!btn) return;
    const span = btn.querySelector('span') || btn;
    const n = ledger.length;
    span.textContent = n
      ? ('Repaso · ' + n + (n === 1 ? ' fallida' : ' fallidas'))
      : 'Repaso · sin fallidas pendientes';
  }

  function refrescarUI() {
    pintarDetalle();
    pintarPerfil();
  }

  /**
   * Resultado de una sesión real (o del repaso).
   * correcto=false → entra al ledger; correcto=true → SALE del ledger (baja el número).
   */
  function registrarResultado(fila, tipoSesion) {
    if (!fila || typeof fila.correcto !== 'boolean') return;
    if (fila.calificacionPendiente === true) return;
    const id = idValido(fila.id || fila.itemId || fila.item_id);
    if (!id) return;

    const tipo = String(tipoSesion || fila.tipo || 'MISION_DIARIA').toUpperCase();
    if (fila.correcto === true) {
      const antes = ledger.length;
      ledger = ledger.filter((p) => p.id !== id);
      if (ledger.length !== antes) {
        guardarLedger(ledger);
        refrescarUI();
      } else {
        // Ya no estaba; igual refresca por si acaso.
        refrescarUI();
      }
    } else {
      const area = limpio(fila.materia || fila.area || '');
      const idx = ledger.findIndex((p) => p.id === id);
      const entrada = { id: id, area: area, tipo: tipo, ts: new Date().toISOString() };
      if (idx >= 0) ledger[idx] = entrada;
      else ledger.push(entrada);
      guardarLedger(ledger);
      refrescarUI();
    }

    programarSync(tipo);
  }

  function programarSync(tipo) {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      sincronizarConBase(tipo).catch(function () {});
    }, 350);
  }

  async function sincronizarConBase(tipoPreferido) {
    const alumno = idAlumno();
    if (!alumno) return { ok: false };

    // Empuja el estado actual del ledger: aciertos = no están; para DB mandamos
    // las pendientes como false y, si hay cola de aciertos recientes, se mandan aparte
    // vía anotarSesion / registrarRespuesta.
    try {
      // Solo pedimos el listado canónico (sesiones reales) y alineamos el ledger a eso
      // DESPUÉS de haber empujado cambios locales si los hay.
      const q = new URLSearchParams({ estudiante: alumno });
      const resp = await fetch('/api/dante/fallidas?' + q.toString(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!resp.ok) return { ok: false };
      const json = await resp.json();
      if (!json || json.ok !== true) return { ok: false };

      const remotos = (Array.isArray(json.pendientes) ? json.pendientes : [])
        .map((p) => ({
          id: idValido(p.id || p.item_id || p.item_original),
          area: limpio(p.area || ''),
          tipo: limpio(p.tipo || 'MISION_DIARIA'),
          ts: p.timestamp || new Date().toISOString()
        }))
        .filter((p) => p.id);

      // Unión: lo local que aún no está en remoto se mantiene (offline / sync pendiente).
      // Lo remoto que el ledger ya quitó (acierto local) NO se reintroduce.
      const localesIds = new Set(ledger.map((p) => p.id));
      const quitadosRecientes = leerQuitados();
      const mapa = new Map();
      remotos.forEach((p) => {
        if (quitadosRecientes[p.id]) return; // acertó aquí; no reabrir
        mapa.set(p.id, p);
      });
      ledger.forEach((p) => mapa.set(p.id, p));
      // Si un id está en quitados, fuera.
      Object.keys(quitadosRecientes).forEach((id) => mapa.delete(id));

      // Preferir ledger local como verdad de sala si hay quitados recientes.
      if (Object.keys(quitadosRecientes).length) {
        guardarLedger(Array.from(mapa.values()));
      } else if (!localesIds.size && remotos.length) {
        // Primera carga / ledger vacío: adoptar solo fallidas reales de la base.
        guardarLedger(remotos);
      } else {
        // Mantener ledger; agregar remotos nuevos no quitados.
        guardarLedger(Array.from(mapa.values()));
      }
      refrescarUI();
      return { ok: true, total: ledger.length };
    } catch (e) {
      return { ok: false };
    }
  }

  function leerQuitados() {
    try {
      const raw = JSON.parse(localStorage.getItem('dante_fallidas_quitados') || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch (e) {
      return {};
    }
  }

  function marcarQuitado(id) {
    const limpioId = idValido(id);
    if (!limpioId) return;
    const mapa = leerQuitados();
    mapa[limpioId] = new Date().toISOString();
    // Conserva últimos 400
    const keys = Object.keys(mapa);
    if (keys.length > 400) {
      keys.sort((a, b) => String(mapa[a]).localeCompare(String(mapa[b])));
      keys.slice(0, keys.length - 400).forEach((k) => delete mapa[k]);
    }
    try { localStorage.setItem('dante_fallidas_quitados', JSON.stringify(mapa)); } catch (e) {}
  }

  function quitarMarcaQuitado(id) {
    const limpioId = idValido(id);
    if (!limpioId) return;
    const mapa = leerQuitados();
    if (!mapa[limpioId]) return;
    delete mapa[limpioId];
    try { localStorage.setItem('dante_fallidas_quitados', JSON.stringify(mapa)); } catch (e) {}
  }

  async function empujarRespuestas(respuestas, tipo) {
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

    // Actualiza ledger YA (baja al instante).
    lista.forEach((r) => {
      if (r.correcto) {
        marcarQuitado(r.id);
        ledger = ledger.filter((p) => p.id !== r.id);
      } else {
        quitarMarcaQuitado(r.id);
        if (!ledger.some((p) => p.id === r.id)) {
          ledger.push({
            id: r.id,
            area: limpio(r.area || ''),
            tipo: String(tipo || 'MISION_DIARIA').toUpperCase(),
            ts: new Date().toISOString()
          });
        }
      }
    });
    guardarLedger(ledger);
    refrescarUI();

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
        // Tras confirmar en DB, el ledger local (ya bajado) manda.
        // Solo agrega remotos que sigan pendientes y no hayamos quitado.
        const quitados = leerQuitados();
        const remotos = (Array.isArray(json.pendientes) ? json.pendientes : [])
          .map((p) => idValido(p.id || p.item_id))
          .filter((id) => id && !quitados[id]);
        const mapa = new Map(ledger.map((p) => [p.id, p]));
        remotos.forEach((id) => {
          if (!mapa.has(id)) {
            mapa.set(id, { id: id, area: '', tipo: tipo || 'MISION_DIARIA', ts: new Date().toISOString() });
          }
        });
        // Quitar del ledger lo que la DB ya no tiene pendiente Y está en quitados.
        Array.from(mapa.keys()).forEach((id) => {
          if (quitados[id] && !remotos.includes(id)) mapa.delete(id);
        });
        // Lo quitado localmente nunca vuelve aunque remoto lo traiga viejo.
        Object.keys(quitados).forEach((id) => mapa.delete(id));
        guardarLedger(Array.from(mapa.values()));
        refrescarUI();
        return { ok: true, total: ledger.length };
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
    await sincronizarConBase('REPASO_FALLIDAS');
    const fallos = ledger.slice();
    if (!fallos.length) {
      nota('Nada pendiente', 'No tienes preguntas fallidas pendientes. Cuando falles en diagnóstico, entrenamiento, refuerzo o simulacro, aparecen aquí.', [
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
    const idsUsados = [];
    for (let i = 0; i < ids.length && reactivos.length < MAX_BLOQUE; i++) {
      const id = ids[i];
      const raw = porId.get(id);
      if (!raw) continue;
      const item = adaptar(raw);
      if (!item || String(item.id) !== String(id)) continue;
      if (!(item.enunciado || item.pregunta_texto)) continue;
      reactivos.push(item);
      idsUsados.push(id);
    }

    if (!reactivos.length) {
      nota(
        'Fallidas pendientes',
        'Tienes ' + fallos.length + ' fallidas en tu lista, pero este aparato no tiene esas preguntas del banco ahora.',
        [{ texto: 'Volver', alClick: cerrarNota }]
      );
      return;
    }

    nota(
      'Repaso · preguntas fallidas',
      'Vas a repasar exactamente ' + reactivos.length + ' pregunta' + (reactivos.length === 1 ? '' : 's') + ' que tú fallaste. Si las aciertas, el número en la sala baja.',
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
              saludoDante: 'Repaso de ' + reactivos.length + ' fallidas tuyas. Cada acierto baja el contador.'
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
    if (fila.correcto === true) marcarQuitado(fila.id || fila.itemId);
    else if (fila.correcto === false) quitarMarcaQuitado(fila.id || fila.itemId);
    registrarResultado(fila, 'REPASO_FALLIDAS');
    empujarRespuestas([fila], 'REPASO_FALLIDAS').catch(function () {});
  }

  function anotarSesion(respuestas) {
    return empujarRespuestas(respuestas, 'REPASO_FALLIDAS');
  }

  /** Llamar desde cualquier prueba real (diag / diario / refuerzo / simulacro). */
  function registrarResultadoSesion(fila, tipo) {
    if (!fila || typeof fila.correcto !== 'boolean') return;
    if (fila.calificacionPendiente === true) return;
    if (fila.correcto === true) marcarQuitado(fila.id || fila.itemId);
    else quitarMarcaQuitado(fila.id || fila.itemId);
    registrarResultado(fila, tipo || 'MISION_DIARIA');
    empujarRespuestas([fila], tipo || 'MISION_DIARIA').catch(function () {});
  }

  /**
   * Semilla única desde historial local de sesiones (no RESPALDO).
   * Solo corre si el ledger está vacío.
   */
  function sembrarDesdeHistorialLocal() {
    if (ledger.length) return;
    try {
      const hist = JSON.parse(localStorage.getItem('dante_history_cache') || '[]');
      if (!Array.isArray(hist) || !hist.length) return;
      const ultimo = new Map();
      hist.slice().sort((a, b) => {
        return new Date(a && a.created_at || 0) - new Date(b && b.created_at || 0);
      }).forEach((ses) => {
        const tipo = String((ses && ses.tipo) || '').toUpperCase();
        if (!tipo || tipo === 'RESPALDO_LOCAL') return;
        const items = Array.isArray(ses.items_respondidos) ? ses.items_respondidos : [];
        items.forEach((it) => {
          if (!it || typeof it.correcto !== 'boolean') return;
          if (it.calificacionPendiente === true) return;
          const id = idValido(it.id || it.itemId);
          if (!id) return;
          ultimo.set(id, {
            id: id,
            ok: it.correcto === true,
            area: limpio(it.materia || it.area || ''),
            tipo: tipo,
            ts: ses.created_at || new Date().toISOString()
          });
        });
      });
      const pendientes = [];
      ultimo.forEach((v) => {
        if (!v.ok) pendientes.push({ id: v.id, area: v.area, tipo: v.tipo, ts: v.ts });
      });
      if (pendientes.length) {
        guardarLedger(pendientes);
        refrescarUI();
      }
    } catch (e) {}
  }

  window.DanteRepasoFallidas = {
    abrir: abrir,
    inventario: inventario,
    pintar: refrescarUI,
    anotarSesion: anotarSesion,
    registrarRespuesta: registrarRespuesta,
    registrarResultadoSesion: registrarResultadoSesion,
    cargar: sincronizarConBase,
    mapaFallos: function () {
      const m = new Map();
      ledger.forEach((p) => m.set(p.id, p));
      return m;
    }
  };

  function arranque() {
    ledger = leerLedger();
    if (!ledger.length) sembrarDesdeHistorialLocal();
    refrescarUI();
    sincronizarConBase().catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arranque);
  } else {
    arranque();
  }
})();
