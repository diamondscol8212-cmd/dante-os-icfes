/* Estimación de habilidad 3PL (EAP con cuadratura Gauss-Hermite) y selección por información de Fisher. */
(function () {
  const D = 1.702;
  const NODOS = [-4.4444505893, -3.8118338356, -3.2423759570, -2.7161100344, -2.2198007421, -1.7451996504, -1.2862293414, -0.8380383173, -0.3964547464, 0, 0.3964547464, 0.8380383173, 1.2862293414, 1.7451996504, 2.2198007421, 2.7161100344, 3.2423759570, 3.8118338356, 4.4444505893];
  const PESOS = [1.733979e-09, 3.633454e-07, 2.378036e-05, 5.867160e-04, 6.438416e-03, 3.424933e-02, 1.002476e-01, 1.691717e-01, 2.210452e-01, 2.422491e-01, 2.210452e-01, 1.691717e-01, 1.002476e-01, 3.424933e-02, 6.438416e-03, 5.867160e-04, 2.378036e-05, 3.633454e-07, 1.733979e-09];

  /**
   * Pesos de proyección / brecha (solo si YA había fallado esa pregunta):
   * - primer_intento → 1.0 (aunque esté en un bloque de refuerzo de área)
   * - post_explicacion → 0.35 (acertó tras haber fallado y visto explicación)
   * - post_refuerzo → 0.25 (acertó en bloque Repaso · Fallidas tras haberla fallado)
   * El acierto de recuperación NO voltea el fallo en IRT; solo crédito parcial a la proyección.
   */
  const PESO_ACIERTO_LIMPIO = 1;
  const PESO_ACIERTO_POST_EXPLICACION = 0.35;
  const PESO_ACIERTO_POST_REFUERZO = 0.25;
  /** @deprecated alias de post_explicacion */
  const PESO_ACIERTO_RECUPERACION = PESO_ACIERTO_POST_EXPLICACION;

  function params(item) {
    const a = Number(item && item.a);
    const b = Number(item && item.b);
    const c = Number(item && item.c);
    return {
      a: Number.isFinite(a) && a > 0 ? a : 1,
      b: Number.isFinite(b) ? b : 0,
      c: Number.isFinite(c) ? Math.min(0.45, Math.max(0, c)) : 0.2
    };
  }

  function probabilidad(theta, item) {
    const p = params(item);
    const exponente = -D * p.a * (theta - p.b);
    if (exponente > 30) return p.c;
    if (exponente < -30) return 1;
    return p.c + (1 - p.c) / (1 + Math.exp(exponente));
  }

  function informacion(theta, item) {
    const p = params(item);
    const P = probabilidad(theta, item);
    const Q = 1 - P;
    if (P <= 0 || Q <= 0) return 0;
    const numerador = Math.pow(D * p.a * (P - p.c), 2) * Q;
    const denominador = Math.pow(1 - p.c, 2) * P;
    return denominador > 0 ? numerador / denominador : 0;
  }

  function estimar(historial) {
    const items = Array.isArray(historial) ? historial : [];
    if (!items.length) {
      return { theta: 0, sem: 1, puntos: null };
    }
    const logs = new Array(NODOS.length).fill(0);
    let maxLog = -Infinity;
    for (let i = 0; i < NODOS.length; i++) {
      const thetaNodo = Math.sqrt(2) * NODOS[i];
      let logL = 0;
      items.forEach(function (item) {
        let P = probabilidad(thetaNodo, item);
        P = Math.max(0.0001, Math.min(0.9999, P));
        logL += item && item.correcto ? Math.log(P) : Math.log(1 - P);
      });
      logs[i] = logL;
      if (logL > maxLog) maxLog = logL;
    }
    let num = 0;
    let den = 0;
    const dens = new Array(NODOS.length).fill(0);
    for (let i = 0; i < NODOS.length; i++) {
      const thetaNodo = Math.sqrt(2) * NODOS[i];
      const d = Math.exp(logs[i] - maxLog) * (PESOS[i] / Math.sqrt(Math.PI));
      dens[i] = d;
      num += thetaNodo * d;
      den += d;
    }
    const theta = den > 0 ? num / den : 0;
    let varNum = 0;
    for (let i = 0; i < NODOS.length; i++) {
      const thetaNodo = Math.sqrt(2) * NODOS[i];
      varNum += Math.pow(thetaNodo - theta, 2) * dens[i];
    }
    const sem = den > 0 ? Math.sqrt(varNum / den) : 1;
    return {
      theta: Math.round(theta * 1000) / 1000,
      sem: Math.round(sem * 1000) / 1000,
      puntos: aPuntosSaber(theta)
    };
  }

  function aPuntosSaber(theta) {
    const t = Math.max(-3, Math.min(3, Number(theta) || 0));
    return Math.max(0, Math.min(500, Math.round(250 + t * 70)));
  }

  function leerRespuestas() {
    try {
      const raw = JSON.parse(localStorage.getItem('dante_respuestas_irt') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function esRecuperacionScore(r) {
    if (!r) return false;
    if (r.recuperacion === true || r.excluirDeScore === true || r.excluir_score === true) return true;
    const origen = String(r.origen_acierto || r.origenAcierto || '').toLowerCase();
    if (origen === 'post_explicacion' || origen === 'post_refuerzo') return true;
    const tipo = String(r.tipo || '').toUpperCase();
    return tipo === 'REPASO_FALLIDAS' && r.correcto === true && r.habiaFalladoAntes === true;
  }

  function habiaFalladoItem(id) {
    const key = String(id || '').trim();
    if (!key) return false;
    try {
      if (window.DanteRepasoFallidas && typeof window.DanteRepasoFallidas.estaPendiente === 'function'
          && window.DanteRepasoFallidas.estaPendiente(key)) {
        return true;
      }
    } catch (e) {}
    try {
      const irt = leerRespuestas();
      if (irt.some(function (r) { return r && String(r.id) === key && r.correcto === false; })) return true;
    } catch (e2) {}
    try {
      const raw = JSON.parse(localStorage.getItem('dante_history_cache') || '[]');
      const hist = Array.isArray(raw) ? raw : [];
      for (let i = 0; i < hist.length; i++) {
        const items = (hist[i] && (hist[i].items_respondidos || hist[i].preguntas_falladas)) || [];
        for (let j = 0; j < items.length; j++) {
          const it = items[j];
          if (!it) continue;
          const iid = String(it.id || it.itemId || it.item_original || '');
          if (iid !== key) continue;
          if (it.correcto === false || it.correcta === false || it.is_correct === false) return true;
        }
      }
    } catch (e3) {}
    return false;
  }

  /**
   * Clasifica el origen del acierto y el peso de proyección.
   * Acierto a la primera (aunque sea en refuerzo de área) → 1.0.
   */
  function clasificarOrigenAcierto(opts) {
    const o = opts || {};
    const correcta = o.correcto === true || o.correcta === true;
    if (!correcta) {
      return { origen_acierto: null, peso: 0, esRecuperacion: false, esPrimerIntento: false };
    }
    const prev = String(o.origen_acierto || o.origenAcierto || '').toLowerCase();
    if (prev === 'primer_intento') {
      return { origen_acierto: 'primer_intento', peso: PESO_ACIERTO_LIMPIO, esRecuperacion: false, esPrimerIntento: true };
    }
    if (prev === 'post_refuerzo') {
      return { origen_acierto: 'post_refuerzo', peso: PESO_ACIERTO_POST_REFUERZO, esRecuperacion: true, esPrimerIntento: false };
    }
    if (prev === 'post_explicacion') {
      return { origen_acierto: 'post_explicacion', peso: PESO_ACIERTO_POST_EXPLICACION, esRecuperacion: true, esPrimerIntento: false };
    }
    const habia = o.habiaFalladoAntes === true
      || (o.id ? habiaFalladoItem(o.id) : false);
    const esRepaso = o.esRepasoFallidas === true
      || String(o.tipo || '').toUpperCase() === 'REPASO_FALLIDAS';
    if (!habia) {
      return { origen_acierto: 'primer_intento', peso: PESO_ACIERTO_LIMPIO, esRecuperacion: false, esPrimerIntento: true };
    }
    if (esRepaso) {
      return { origen_acierto: 'post_refuerzo', peso: PESO_ACIERTO_POST_REFUERZO, esRecuperacion: true, esPrimerIntento: false };
    }
    return { origen_acierto: 'post_explicacion', peso: PESO_ACIERTO_POST_EXPLICACION, esRecuperacion: true, esPrimerIntento: false };
  }

  /** Crédito parcial de proyección: base + peso·(pleno − base). */
  function creditoParcialRecuperacion(puntosBase, puntosSiPleno, peso) {
    const base = Number(puntosBase);
    const pleno = Number(puntosSiPleno);
    const w = Number(peso);
    if (!Number.isFinite(base) || !Number.isFinite(pleno)) return Number.isFinite(base) ? base : (Number.isFinite(pleno) ? pleno : null);
    if (pleno <= base) return Math.round(base);
    const factor = Number.isFinite(w) && w > 0 ? Math.min(1, Math.max(0, w)) : PESO_ACIERTO_POST_EXPLICACION;
    return Math.max(0, Math.min(500, Math.round(base + factor * (pleno - base))));
  }

  function acumular(nuevas) {
    const prevItems = leerRespuestas();
    const prevEst = estimar(prevItems);
    const mapa = new Map();
    function meterLimpio(r) {
      if (!r || typeof r.correcto !== 'boolean') return;
      const id = String(r.id || '');
      if (!id) return;
      // Acierto de repaso: no entra al historial IRT ni voltea un fallo previo (acierto limpio ≠ acierto de repaso).
      if (esRecuperacionScore(r)) return;
      const previo = mapa.get(id) || {};
      mapa.set(id, {
        id: id,
        a: r.a,
        b: r.b,
        c: r.c,
        correcto: !!r.correcto,
        ms: Number(r.ms) > 0 ? Number(r.ms) : 0,
        area: r.area || r.materia || previo.area || '',
        letra: r.letra || r.opcionSeleccionada || previo.letra || '',
        peso: PESO_ACIERTO_LIMPIO
      });
    }
    prevItems.forEach(meterLimpio);
    (nuevas || []).forEach(meterLimpio);
    const items = Array.from(mapa.values()).slice(-600);
    try { localStorage.setItem('dante_respuestas_irt', JSON.stringify(items)); } catch (e) {}
    const est = estimar(items);
    est.n = items.length;
    est.pesoLimpio = PESO_ACIERTO_LIMPIO;
    est.pesoRecuperacion = PESO_ACIERTO_POST_EXPLICACION;
    est.pesoPostExplicacion = PESO_ACIERTO_POST_EXPLICACION;
    est.pesoPostRefuerzo = PESO_ACIERTO_POST_REFUERZO;

    // Crédito parcial solo por aciertos de recuperación de ESTE lote (no reescriben el IRT).
    const recupOk = (nuevas || []).filter(function (r) {
      if (!r || r.correcto !== true || !String(r.id || '').trim()) return false;
      const cls = clasificarOrigenAcierto(r);
      return cls.esRecuperacion || esRecuperacionScore(r);
    });
    if (recupOk.length) {
      const simulMap = new Map(items.map(function (x) { return [x.id, Object.assign({}, x)]; }));
      let pesoLote = PESO_ACIERTO_POST_EXPLICACION;
      recupOk.forEach(function (r) {
        const id = String(r.id || '');
        const cls = clasificarOrigenAcierto(r);
        if (cls.peso > 0 && cls.peso < pesoLote) pesoLote = cls.peso;
        if (Number(r.pesoProyeccion) > 0 && Number(r.pesoProyeccion) < pesoLote) pesoLote = Number(r.pesoProyeccion);
        const prev = simulMap.get(id);
        if (prev) {
          prev.correcto = true;
        } else {
          simulMap.set(id, {
            id: id,
            a: r.a,
            b: r.b,
            c: r.c,
            correcto: true,
            ms: Number(r.ms) > 0 ? Number(r.ms) : 0,
            area: r.area || r.materia || '',
            letra: r.letra || r.opcionSeleccionada || ''
          });
        }
      });
      const estPleno = estimar(Array.from(simulMap.values()));
      const basePts = (prevEst && prevEst.puntos != null)
        ? prevEst.puntos
        : (est.puntos != null ? est.puntos : null);
      const ptsParcial = creditoParcialRecuperacion(basePts, estPleno && estPleno.puntos, pesoLote);
      if (ptsParcial != null) {
        est.puntos = ptsParcial;
        est.creditoRecuperacion = true;
        est.pesoRecuperacionAplicado = pesoLote;
        est.puntosSiPleno = estPleno && estPleno.puntos;
        est.puntosBase = basePts;
      }
    }

    // Conserva crédito parcial de repasos previos hasta que el IRT limpio lo alcance (±40 pts).
    if (!recupOk.length && est.puntos != null) {
      try {
        const storedPts = parseInt(localStorage.getItem('dante_score_proyectado') || '', 10);
        if (Number.isFinite(storedPts) && storedPts > est.puntos && storedPts <= est.puntos + 40) {
          est.puntos = storedPts;
          est.conservaCreditoRepaso = true;
        }
      } catch (e) {}
    }

    if (est.puntos != null && (items.length || recupOk.length)) {
      try {
        localStorage.setItem('dante_score_proyectado', String(est.puntos));
        localStorage.setItem('dante_puntaje_global', String(est.puntos));
        localStorage.setItem('dante_theta_estimado', String(est.theta));
        localStorage.setItem('dante_sem_estimado', String(est.sem));
      } catch (e) {}
    }
    return est;
  }

  function percentil(theta) {
    const z = Math.max(-3.5, Math.min(3.5, Number(theta) || 0));
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const densidad = 0.3989422804014327 * Math.exp(-0.5 * z * z);
    const cola = densidad * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    const cdf = z >= 0 ? 1 - cola : cola;
    return Math.max(1, Math.min(99, Math.round(cdf * 100)));
  }

  function areaDe(raw) {
    const texto = String((raw && (raw.area_general || raw.area || raw.materia)) || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/_/g, ' ')
      .trim();
    const mapa = {
      'matematicas': 'matematicas',
      'lectura critica': 'lectura_critica',
      'ciencias naturales': 'ciencias_naturales',
      'sociales ciudadanas': 'sociales_ciudadanas',
      'sociales y ciudadanas': 'sociales_ciudadanas',
      'ingles': 'ingles'
    };
    return mapa[texto] || texto.replace(/\s+/g, '_');
  }

  function adaptarItem(raw) {
    const opciones = (raw && (raw.opciones_respuesta || raw.opciones)) || [];
    const correcta = String((raw && (raw.opcion_correcta || raw.correcta || raw.clave)) || '').trim().toUpperCase();
    const a = Number(raw && (raw.parametro_a_discriminacion != null ? raw.parametro_a_discriminacion : raw.a));
    const b = Number(raw && (raw.parametro_b_dificultad != null ? raw.parametro_b_dificultad : raw.b));
    const c = Number(raw && (raw.parametro_c_adivinacion != null ? raw.parametro_c_adivinacion : raw.c));
    const enunciado = (raw && (raw.pregunta_texto || raw.enunciado || raw.texto)) || '';
    const area = areaDe(raw);
    return {
      id: raw && raw.id,
      enunciado: enunciado,
      pregunta_texto: enunciado,
      texto: enunciado,
      area: area,
      materia: area,
      competencia: (raw && (raw.sub_competencia || raw.competencia)) || '',
      opciones: opciones,
      opciones_respuesta: opciones,
      correcta: correcta,
      ok: correcta,
      recurso_visual: (raw && (raw.recurso_visual || raw.imagen_url || raw.imagen || raw.grafico_url || raw.grafico)) || null,
      a: Number.isFinite(a) && a > 0 ? a : 1,
      b: Number.isFinite(b) ? b : 0,
      c: Number.isFinite(c) ? Math.min(0.45, Math.max(0, c)) : 0.2
    };
  }

  function idsExcluidosLocal() {
    const set = new Set();
    try {
      const hist = JSON.parse(localStorage.getItem('dante_history_cache') || '[]');
      (Array.isArray(hist) ? hist : []).forEach(function (h) {
        const items = (h && (h.items_respondidos || h.preguntas_falladas)) || [];
        if (!Array.isArray(items)) return;
        items.forEach(function (it) {
          const id = it && (it.id || it.itemId || it.item_original);
          if (id) set.add(String(id));
        });
      });
    } catch (e) {}
    try {
      const irt = JSON.parse(localStorage.getItem('dante_respuestas_irt') || '[]');
      (Array.isArray(irt) ? irt : []).forEach(function (r) {
        if (r && r.id) set.add(String(r.id));
      });
    } catch (e) {}
    return set;
  }

  function seleccionarMision(items, nPorArea, excluir) {
    const cupo = nPorArea > 0 ? nPorArea : 2;
    const areas = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'];
    const excluidos = excluir instanceof Set ? excluir : idsExcluidosLocal();
    const porArea = {};
    const porAreaReuso = {};
    (items || []).forEach(function (raw) {
      const item = adaptarItem(raw);
      if (!item.id || !item.enunciado) return;
      const visto = excluidos.has(String(item.id));
      const destino = visto ? porAreaReuso : porArea;
      if (!destino[item.area]) destino[item.area] = [];
      destino[item.area].push(item);
    });
    function tomarDe(mapa) {
      return areas.map(function (area) {
        const pool = (mapa[area] || []).slice();
        pool.sort(function (x, y) { return Math.abs(x.b) - Math.abs(y.b); });
        const cercanos = pool.slice(0, Math.max(cupo * 4, cupo));
        for (let i = cercanos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const tmp = cercanos[i];
          cercanos[i] = cercanos[j];
          cercanos[j] = tmp;
        }
        return cercanos.slice(0, cupo);
      });
    }
    let columnas = tomarDe(porArea);
    const orden = [];
    const usados = new Set();
    for (let k = 0; k < cupo; k++) {
      columnas.forEach(function (col) {
        if (col[k] && !usados.has(col[k].id)) {
          usados.add(col[k].id);
          orden.push(col[k]);
        }
      });
    }
    if (orden.length < cupo * areas.length) {
      columnas = tomarDe(porAreaReuso);
      for (let k = 0; k < cupo && orden.length < cupo * areas.length; k++) {
        columnas.forEach(function (col) {
          if (orden.length >= cupo * areas.length) return;
          if (col[k] && !usados.has(col[k].id)) {
            usados.add(col[k].id);
            orden.push(col[k]);
          }
        });
      }
    }
    return orden;
  }

  window.DanteAbility = {
    params: params,
    probabilidad: probabilidad,
    informacion: informacion,
    estimar: estimar,
    acumular: acumular,
    esRecuperacionScore: esRecuperacionScore,
    habiaFalladoItem: habiaFalladoItem,
    clasificarOrigenAcierto: clasificarOrigenAcierto,
    creditoParcialRecuperacion: creditoParcialRecuperacion,
    PESO_ACIERTO_LIMPIO: PESO_ACIERTO_LIMPIO,
    PESO_ACIERTO_RECUPERACION: PESO_ACIERTO_RECUPERACION,
    PESO_ACIERTO_POST_EXPLICACION: PESO_ACIERTO_POST_EXPLICACION,
    PESO_ACIERTO_POST_REFUERZO: PESO_ACIERTO_POST_REFUERZO,
    leerRespuestas: leerRespuestas,
    aPuntosSaber: aPuntosSaber,
    percentil: percentil,
    adaptarItem: adaptarItem,
    seleccionarMision: seleccionarMision
  };
})();
