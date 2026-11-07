/**
 * Repaso · preguntas fallidas
 * Arma un bloque solo con ítems que el estudiante ya falló en sus pruebas (historial local).
 */
(function () {
  'use strict';

  const MAX_BLOQUE = 10;
  const CLAVE_HECHAS = 'dante_repaso_fallidas_hechas';

  function limpio(t) {
    return String(t || '').replace(/\s+/g, ' ').trim();
  }

  function leerHistorial() {
    try {
      const raw = JSON.parse(localStorage.getItem('dante_history_cache') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function leerHechasHoy() {
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_HECHAS) || '{}');
      const hoy = new Date().toISOString().slice(0, 10);
      if (!raw || raw.dia !== hoy) return new Set();
      return new Set(Array.isArray(raw.ids) ? raw.ids.map(String) : []);
    } catch (e) {
      return new Set();
    }
  }

  function marcarHecha(id) {
    if (!id) return;
    const hoy = new Date().toISOString().slice(0, 10);
    let raw = { dia: hoy, ids: [] };
    try {
      const prev = JSON.parse(localStorage.getItem(CLAVE_HECHAS) || 'null');
      if (prev && prev.dia === hoy && Array.isArray(prev.ids)) raw = prev;
    } catch (e) {}
    if (!raw.ids.includes(String(id))) raw.ids.push(String(id));
    try { localStorage.setItem(CLAVE_HECHAS, JSON.stringify({ dia: hoy, ids: raw.ids.slice(-200) })); } catch (e) {}
  }

  /**
   * Recolecta fallos con el máximo detalle disponible.
   * @returns {Map<string, object>}
   */
  function mapaFallos() {
    const out = new Map();
    leerHistorial().forEach((ses) => {
      if (!ses) return;
      const tipo = String(ses.tipo || '').toUpperCase();
      // Incluye diagnóstico, entrenamiento, refuerzo, simulacro si trae detalle.
      const listas = [];
      if (Array.isArray(ses.preguntas_falladas)) listas.push(ses.preguntas_falladas);
      if (Array.isArray(ses.items_respondidos)) {
        listas.push(ses.items_respondidos.filter((it) => it && it.correcto === false));
      }
      listas.forEach((lista) => {
        lista.forEach((f) => {
          const id = String((f && (f.id || f.itemId || f.item_original || f.item_id)) || '').trim();
          if (!id || out.has(id)) return;
          out.set(id, {
            id: id,
            materia: limpio(f.materia || f.area || ''),
            enunciado: limpio(f.enunciado || '').slice(0, 320),
            ayuda: limpio(f.ayuda || f.explicacion || f.repaso || '').slice(0, 520),
            tipoSesion: tipo || 'MISION_DIARIA',
            created_at: ses.created_at || null
          });
        });
      });
    });
    return out;
  }

  function inventario() {
    const mapa = mapaFallos();
    const hechas = leerHechasHoy();
    const pendientes = [...mapa.keys()].filter((id) => !hechas.has(id));
    return {
      total: mapa.size,
      pendientes: pendientes.length,
      hechasHoy: hechas.size
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
    if (!inv.total) {
      el.textContent = 'Cuando falles en un bloque, aquí se juntan.';
      return;
    }
    if (!inv.pendientes) {
      el.textContent = inv.total + ' fallidas · hoy ya repasaste las pendientes';
      return;
    }
    el.textContent = inv.pendientes + ' pendientes · de ' + inv.total + ' fallidas guardadas';
  }

  async function abrir() {
    const fallos = mapaFallos();
    if (!fallos.size) {
      nota('Aún no hay fallos guardados', 'Termina un entrenamiento o el diagnóstico. Las preguntas que falles quedan en tu perfil y aquí para repasarlas.', [
        { texto: 'Entendido', alClick: cerrarNota }
      ]);
      return;
    }

    const hechas = leerHechasHoy();
    let ids = [...fallos.keys()].filter((id) => !hechas.has(id));
    if (!ids.length) ids = [...fallos.keys()];

    const listaBanco = await banco();
    const porId = new Map();
    (listaBanco || []).forEach((raw) => {
      if (raw && raw.id) porId.set(String(raw.id), raw);
    });

    const reactivos = [];
    const sinBanco = [];
    for (let i = 0; i < ids.length && reactivos.length < MAX_BLOQUE; i++) {
      const id = ids[i];
      const raw = porId.get(id);
      if (!raw) {
        sinBanco.push(id);
        continue;
      }
      const item = adaptar(raw);
      if (!item || !item.id || !(item.enunciado || item.pregunta_texto)) continue;
      const meta = fallos.get(id);
      if (meta && meta.ayuda && !item.pista) item.pista = meta.ayuda;
      reactivos.push(item);
    }

    if (!reactivos.length) {
      nota('No pude armar el repaso', 'Tienes fallos guardados, pero esas preguntas ya no están en el banco de este aparato (o cambiaron de id). Sigue entrenando: los fallos nuevos sí entrarán.', [
        { texto: 'Volver', alClick: cerrarNota }
      ]);
      return;
    }

    nota(
      'Repaso · preguntas fallidas',
      'Van ' + reactivos.length + ' preguntas que ya fallaste en tus pruebas. Misma forma que el entrenamiento: elige, confirma y mira la explicación.',
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
              saludoDante: 'Repaso de ' + reactivos.length + ' preguntas que fallaste. Usa la pista si la necesitas.'
            };
            entrarWorkspace(mision);
          }
        },
        { texto: 'Cancelar', alClick: cerrarNota }
      ]
    );
  }

  /** Llamar al cerrar sesión de repaso fallidas para no repetir las mismas hoy. */
  function anotarSesion(respuestas) {
    const lista = Array.isArray(respuestas) ? respuestas : Object.values(respuestas || {});
    lista.forEach((r) => {
      if (r && r.id) marcarHecha(String(r.id));
    });
    pintarDetalle();
  }

  window.DanteRepasoFallidas = {
    abrir: abrir,
    inventario: inventario,
    pintar: pintarDetalle,
    anotarSesion: anotarSesion,
    mapaFallos: mapaFallos
  };

  document.addEventListener('DOMContentLoaded', pintarDetalle);
})();
