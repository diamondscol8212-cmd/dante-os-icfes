/**
 * Repaso · preguntas fallidas
 * Solo ítems que el estudiante respondió y falló en una prueba real.
 * Si en el repaso las acierta, salen del contador al instante.
 */
(function () {
  'use strict';

  const MAX_BLOQUE = 10;
  /** id → ISO de cuándo se superó en repaso (acierto). */
  const CLAVE_SUPERADAS = 'dante_repaso_fallidas_superadas';

  function limpio(t) {
    return String(t || '').replace(/\s+/g, ' ').trim();
  }

  /** IDs sintéticos / basura que no corresponden a ítems reales del banco. */
  function idValido(raw) {
    const id = String(raw || '').trim();
    if (!id) return '';
    if (/^item_\d+$/i.test(id)) return '';
    if (/^preun_/i.test(id)) return '';
    if (id === 'undefined' || id === 'null') return '';
    return id;
  }

  function leerHistorial() {
    try {
      const raw = JSON.parse(localStorage.getItem('dante_history_cache') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function leerSuperadas() {
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_SUPERADAS) || '{}');
      // Formato nuevo: { id: iso }. Acepta array legado.
      if (Array.isArray(raw)) {
        const mapa = {};
        raw.forEach((id) => {
          const limpioId = idValido(id);
          if (limpioId) mapa[limpioId] = '1970-01-01T00:00:00.000Z';
        });
        return mapa;
      }
      if (raw && typeof raw === 'object') {
        const mapa = {};
        Object.keys(raw).forEach((k) => {
          const limpioId = idValido(k);
          if (!limpioId) return;
          mapa[limpioId] = String(raw[k] || '1970-01-01T00:00:00.000Z');
        });
        return mapa;
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  function guardarSuperadas(mapa) {
    try {
      const keys = Object.keys(mapa || {});
      const recorte = {};
      keys.slice(-400).forEach((k) => { recorte[k] = mapa[k]; });
      localStorage.setItem(CLAVE_SUPERADAS, JSON.stringify(recorte));
    } catch (e) {}
  }

  function marcarSuperada(id) {
    const limpioId = idValido(id);
    if (!limpioId) return;
    const mapa = leerSuperadas();
    mapa[limpioId] = new Date().toISOString();
    guardarSuperadas(mapa);
  }

  function quitarSuperada(id) {
    const limpioId = idValido(id);
    if (!limpioId) return;
    const mapa = leerSuperadas();
    if (!mapa[limpioId]) return;
    delete mapa[limpioId];
    guardarSuperadas(mapa);
  }

  function tsSesion(ses) {
    const t = Date.parse((ses && ses.created_at) || '');
    return Number.isFinite(t) ? t : 0;
  }

  /**
   * Solo respuestas reales con correcto === false.
   * No inventa ítems desde listas incompletas ni IDs fantasma.
   */
  function mapaFallos() {
    const out = new Map();
    const ultimo = new Map(); // id → { ok:boolean, ts:number }

    const sesiones = leerHistorial().slice().sort((a, b) => tsSesion(a) - tsSesion(b));

    sesiones.forEach((ses) => {
      if (!ses) return;
      const tipo = String(ses.tipo || '').toUpperCase();
      const ts = tsSesion(ses);
      const items = Array.isArray(ses.items_respondidos) ? ses.items_respondidos : [];

      items.forEach((it) => {
        if (!it || typeof it.correcto !== 'boolean') return;
        // Calificación pendiente no cuenta como fallo real.
        if (it.calificacionPendiente === true) return;
        const id = idValido(it.id || it.itemId || it.item_original || it.item_id);
        if (!id) return;

        const ok = it.correcto === true;
        const prev = ultimo.get(id);
        if (!prev || ts >= prev.ts) {
          ultimo.set(id, { ok: ok, ts: ts });
        }

        if (!ok) {
          out.set(id, {
            id: id,
            materia: limpio(it.materia || it.area || ''),
            enunciado: limpio(it.enunciado || '').slice(0, 320),
            ayuda: limpio(it.ayuda || it.explicacion || it.repaso || '').slice(0, 520),
            tipoSesion: tipo || 'MISION_DIARIA',
            created_at: ses.created_at || null,
            ts: ts
          });
        }
      });

      // Legacy: solo si la sesión no trae items_respondidos, y el fallo es explícito.
      if (!items.length && Array.isArray(ses.preguntas_falladas)) {
        ses.preguntas_falladas.forEach((f) => {
          if (!f) return;
          if (f.calificacionPendiente === true) return;
          // Exige evidencia de respuesta incorrecta (no IDs sueltos).
          const falloExplícito = f.correcto === false
            || (typeof f.correcto !== 'boolean' && (f.opcionSeleccionada || f.letra));
          if (!falloExplícito) return;
          if (f.correcto === true) return;
          const id = idValido(f.id || f.itemId || f.item_original || f.item_id);
          if (!id) return;
          const prev = ultimo.get(id);
          if (!prev || ts >= prev.ts) {
            ultimo.set(id, { ok: false, ts: ts });
          }
          out.set(id, {
            id: id,
            materia: limpio(f.materia || f.area || ''),
            enunciado: limpio(f.enunciado || '').slice(0, 320),
            ayuda: limpio(f.ayuda || f.explicacion || f.repaso || '').slice(0, 520),
            tipoSesion: tipo || 'MISION_DIARIA',
            created_at: ses.created_at || null,
            ts: ts
          });
        });
      }
    });

    // Último resultado gana: si la última vez fue acierto, fuera del pool.
    ultimo.forEach((estado, id) => {
      if (estado && estado.ok) out.delete(id);
    });

    // Acierto en repaso (overlay local): fuera, salvo fallo MÁS NUEVO en historial.
    const superadas = leerSuperadas();
    Object.keys(superadas).forEach((id) => {
      const tsSuper = Date.parse(superadas[id]) || 0;
      const estado = ultimo.get(id);
      if (estado && estado.ok === false && estado.ts > tsSuper) {
        // Volvió a fallar después del repaso → sigue pendiente; limpia overlay.
        quitarSuperada(id);
        return;
      }
      out.delete(id);
    });

    return out;
  }

  function inventario() {
    const mapa = mapaFallos();
    return {
      total: mapa.size,
      pendientes: mapa.size,
      hechasHoy: Object.keys(leerSuperadas()).length
    };
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

  async function abrir() {
    const fallos = mapaFallos();
    if (!fallos.size) {
      nota('Nada pendiente', 'No hay preguntas fallidas por repasar. Cuando falles en un bloque, aparecen aquí.', [
        { texto: 'Entendido', alClick: cerrarNota }
      ]);
      pintarDetalle();
      return;
    }

    const ids = [...fallos.keys()];
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
      if (!item || !item.id || !(item.enunciado || item.pregunta_texto)) continue;
      // Solo el ítem del banco cuyo id coincide con un fallo real.
      if (String(item.id) !== String(id)) continue;
      const meta = fallos.get(id);
      if (meta && meta.ayuda && !item.pista) item.pista = meta.ayuda;
      reactivos.push(item);
    }

    if (!reactivos.length) {
      nota('No pude armar el repaso', 'Tienes fallos guardados, pero esas preguntas ya no están en el banco de este aparato.', [
        { texto: 'Volver', alClick: cerrarNota }
      ]);
      return;
    }

    nota(
      'Repaso · preguntas fallidas',
      'Van ' + reactivos.length + ' de ' + fallos.size + ' pendientes. Si las aciertas, salen de la lista.',
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
              saludoDante: 'Repaso de ' + reactivos.length + ' fallidas. Si aciertas, dejan de contar.'
            };
            entrarWorkspace(mision);
          }
        },
        { texto: 'Cancelar', alClick: cerrarNota }
      ]
    );
  }

  /**
   * Tras cada respuesta: acierto → fuera del contador al instante; fallo → sigue pendiente.
   */
  function registrarRespuesta(fila) {
    if (!fila) return;
    const id = idValido(fila.id || fila.itemId);
    if (!id) return;
    if (fila.calificacionPendiente === true) {
      pintarDetalle();
      return;
    }
    if (fila.correcto === true) marcarSuperada(id);
    else if (fila.correcto === false) quitarSuperada(id);
    pintarDetalle();
  }

  function anotarSesion(respuestas) {
    const lista = Array.isArray(respuestas) ? respuestas : Object.values(respuestas || {});
    lista.forEach((r) => registrarRespuesta(r));
    pintarDetalle();
  }

  window.DanteRepasoFallidas = {
    abrir: abrir,
    inventario: inventario,
    pintar: pintarDetalle,
    anotarSesion: anotarSesion,
    registrarRespuesta: registrarRespuesta,
    mapaFallos: mapaFallos
  };

  document.addEventListener('DOMContentLoaded', pintarDetalle);
  window.addEventListener('focus', pintarDetalle);
})();
