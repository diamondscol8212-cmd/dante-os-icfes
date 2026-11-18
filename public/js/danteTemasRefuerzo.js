/**
 * Temas de refuerzo: lista personal por estudiante + catálogo de estudio.
 * Al fallar una pregunta se agrega el subtema (sin duplicados).
 */
(function (global) {
  'use strict';

  var CATALOGO_URL = 'temasRefuerzo.json';
  var STORE_PREFIX = 'dante_temas_refuerzo_v1:';
  /**
   * Tras abrir la cartilla se puede ir de inmediato a Repaso · Fallidas (sin espera forzada).
   * El tema SOLO sale de pendientes con marcarHecho (práctica de la cartilla + «lo entendí»).
   * Acertar la fallida original NO limpia el tema de refuerzo.
   */
  var COOLDOWN_FALLIDAS_MS = 0;
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
      if (!data || typeof data !== 'object') data = { pendientes: [], hechos: {}, vistos: {}, updatedAt: '' };
      if (!Array.isArray(data.pendientes)) data.pendientes = [];
      if (!data.hechos || typeof data.hechos !== 'object') data.hechos = {};
      if (!data.vistos || typeof data.vistos !== 'object') data.vistos = {};
      return data;
    } catch (_) {
      return { pendientes: [], hechos: {}, vistos: {}, updatedAt: '' };
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
    var refuerzo = String(meta.tema_refuerzo_id || meta.temaRefuerzoId || '').toLowerCase().trim();
    var temaTxt = String(
      meta.tema_a_estudiar || meta.tema || meta.repaso || meta.enunciado || ''
    ).toLowerCase();
    var enunciado = String(meta.enunciado || '').toLowerCase();
    var cat = (_catalogo && _catalogo.temas) || [];

    function enCatalogo(id) {
      if (!id) return '';
      for (var i = 0; i < cat.length; i++) {
        var t = cat[i];
        if (!t) continue;
        if (t.id === id) return t.id;
        if (Array.isArray(t.subs) && t.subs.indexOf(id) >= 0) return t.id;
      }
      return '';
    }

    // 0) Id explícito de cartilla de contenido (puede ser más fino que sub_competencia).
    var hitRef = enCatalogo(refuerzo);
    if (hitRef) return hitRef;

    // 1) Fracciones por enunciado/tema (antes de caer en aritmética genérica).
    if (/numerador|denominador/.test(temaTxt + ' ' + enunciado)
        || (/\bfracci[oó]n(es)?\b/.test(temaTxt + ' ' + enunciado)
          && !/fraccionar|fraccionamiento|petr[oó]leo/.test(temaTxt + ' ' + enunciado))) {
      return 'fracciones';
    }

    // 1b) Hidrografía por enunciado (ríos/afluentes/cuencas) aunque el sub sea geografia.
    if (/afluente|cuenca del|macizo colombiano|desemboca|el r[ií]o (cauca|magdalena)|r[ií]o cauca|r[ií]o magdalena/.test(enunciado)
        && /magdalena|cauca|orinoco|amazonas|r[ií]o/.test(enunciado + ' ' + temaTxt)) {
      if (enCatalogo('hidrografia_colombia')) return 'hidrografia_colombia';
    }

    // 2) sub_competencia exacta del banco (= id del catálogo).
    var hitSub = enCatalogo(sub);
    if (hitSub) return hitSub;

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

  /** True si el texto parece enunciado/fragmento de pregunta (no un nombre de tema). */
  function pareceFragmentoPregunta(txt) {
    var s = String(txt || '').replace(/\s+/g, ' ').trim();
    if (!s) return true;
    if (s.length > 72) return true;
    if (/\?/.test(s)) return true;
    if (/^(seg[uú]n|de acuerdo|lea|lee |observe|observa|cuál|cual |qué |que |en la figura|el texto|a continuation|choose|according)/i.test(s)) return true;
    if ((s.match(/\b(el|la|los|las|de|en|un|una|que|del|al)\b/gi) || []).length >= 5) return true;
    return false;
  }

  function humanizarIdTema(temaId) {
    return String(temaId || '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); })
      .replace(/\bIngles\b/i, 'Inglés')
      .replace(/\bQuimica\b/i, 'Química')
      .replace(/\bMatematicas\b/i, 'Matemáticas')
      .replace(/\bBiologia\b/i, 'Biología')
      .replace(/\bFisica\b/i, 'Física')
      .trim();
  }

  /**
   * Nombre limpio del tema para UI/modales.
   * Nunca devuelve fragmentos de la pregunta fallida.
   */
  function tituloDe(temaId, meta) {
    var id = String(temaId || '').trim();
    var t = temaPorId(id);
    if (t && t.titulo) return String(t.titulo).trim();
    var candidatos = [
      meta && meta.tema_a_estudiar,
      meta && meta.tema,
      meta && meta.repaso
    ];
    for (var i = 0; i < candidatos.length; i++) {
      var c = String(candidatos[i] || '').replace(/\s+/g, ' ').trim();
      if (!c || pareceFragmentoPregunta(c)) continue;
      // Evita IDs crudos demasiado técnicos si ya hay algo legible corto
      if (c.length <= 72) return c;
    }
    return humanizarIdTema(id || 'tema');
  }

  function areaDe(temaId, meta) {
    var t = temaPorId(temaId);
    if (t && t.area) return t.area;
    return String((meta && (meta.area || meta.materia)) || '').toLowerCase();
  }

  function snapshotFalloDe(meta) {
    meta = meta || {};
    var itemId = String(meta.itemId || meta.id || '').trim();
    var enunciado = String(meta.enunciado || meta.pregunta_texto || meta.texto || '').replace(/\s+/g, ' ').trim();
    var opciones = Array.isArray(meta.opciones) ? meta.opciones.map(function (o) {
      return typeof o === 'string' ? o : String((o && (o.texto || o.label)) || o || '');
    }) : [];
    var elegida = String(meta.elegida || meta.opcionSeleccionada || meta.letra || '').toUpperCase().replace(/[^A-D]/g, '').slice(0, 1);
    var correcta = String(meta.correcta || meta.ok || '').toUpperCase().replace(/[^A-D]/g, '').slice(0, 1);
    if (!itemId && !enunciado) return null;
    return {
      itemId: itemId,
      enunciado: enunciado.slice(0, 1200),
      opciones: opciones.slice(0, 4),
      elegida: elegida,
      correcta: correcta,
      textoElegida: String(meta.textoElegida || meta.textoOpcion || '').slice(0, 240),
      textoCorrecta: String(meta.textoCorrecta || '').slice(0, 240),
      ts: Date.now()
    };
  }

  function adjuntarFallo(pendiente, snap) {
    if (!pendiente || !snap) return;
    if (!Array.isArray(pendiente.fallos)) pendiente.fallos = [];
    // Evita duplicar el mismo ítem: actualiza o inserta al frente.
    pendiente.fallos = pendiente.fallos.filter(function (f) {
      return !(f && snap.itemId && f.itemId === snap.itemId);
    });
    pendiente.fallos.unshift(snap);
    if (pendiente.fallos.length > 8) pendiente.fallos = pendiente.fallos.slice(0, 8);
    pendiente.itemId = snap.itemId || pendiente.itemId || '';
    pendiente.ultimoFallo = snap;
  }

  /**
   * Registra un fallo → agrega tema a pendientes (sin duplicar).
   * meta: { sub, sub_competencia, tema_a_estudiar, tema, repaso, area, itemId,
   *         enunciado, opciones, elegida, correcta, textoElegida, textoCorrecta }
   */
  function registrarFallo(meta) {
    meta = meta || {};
    return cargarCatalogo().then(function () {
      var temaId = resolverTemaId(meta);
      if (!temaId) return null;
      var estado = leerEstado();
      var snap = snapshotFalloDe(meta);
      // Regla: si el estudiante ya marcó el tema como superado, NO vuelve a pendientes
      // aunque falle otra pregunta del mismo subtema. Queda solo en historial (hechos).
      if (estado.hechos && estado.hechos[temaId]) {
        return temaId;
      }
      var existe = estado.pendientes.some(function (p) { return p && p.id === temaId; });
      if (!existe) {
        var catTema = temaPorId(temaId);
        var nuevo = {
          id: temaId,
          titulo: tituloDe(temaId, meta),
          area: areaDe(temaId, meta),
          nivel: (catTema && catTema.nivel) || '',
          itemId: meta.itemId || meta.id || '',
          fallos: [],
          ts: Date.now()
        };
        adjuntarFallo(nuevo, snap);
        estado.pendientes.unshift(nuevo);
        if (estado.pendientes.length > 80) estado.pendientes = estado.pendientes.slice(0, 80);
        guardarEstado(estado);
      } else {
        estado.pendientes.forEach(function (p) {
          if (p && p.id === temaId) {
            p.titulo = tituloDe(temaId, meta);
            p.ts = Date.now();
            adjuntarFallo(p, snap);
          }
        });
        guardarEstado(estado);
      }
      return temaId;
    });
  }

  /** Fallos guardados para un tema (más reciente primero). */
  function fallosDeTema(temaId) {
    var id = String(temaId || '');
    var estado = leerEstado();
    var pend = (estado.pendientes || []).find(function (p) { return p && p.id === id; });
    if (pend && Array.isArray(pend.fallos) && pend.fallos.length) return pend.fallos.slice();
    if (pend && pend.ultimoFallo) return [pend.ultimoFallo];
    if (pend && pend.itemId) {
      return [{ itemId: pend.itemId, enunciado: '', opciones: [], elegida: '', correcta: '', ts: pend.ts || 0 }];
    }
    return [];
  }

  /**
   * ÚNICA vía para sacar un tema de «pendientes»:
   * el estudiante responde la práctica de la cartilla y marca «superado».
   * Acertar en Repaso · Fallidas NO debe llamar esto.
   */
  function marcarHecho(temaId, detalle) {
    var id = String(temaId || '');
    if (!id) return;
    var estado = leerEstado();
    estado.pendientes = estado.pendientes.filter(function (p) { return !p || p.id !== id; });
    estado.hechos[id] = {
      ts: Date.now(),
      aciertos: detalle && detalle.aciertos,
      total: detalle && detalle.total,
      via: 'cartilla_practica'
    };
    if (!estado.vistos) estado.vistos = {};
    if (!estado.vistos[id] || !estado.vistos[id].ts) {
      estado.vistos[id] = { ts: Date.now() };
    }
    guardarEstado(estado);
  }

  /**
   * Marca la cartilla como abierta/estudiada.
   * Habilita Repaso · Fallidas de inmediato (sin espera).
   * No quita el tema de pendientes.
   */
  function marcarVisto(temaId) {
    var id = String(temaId || '');
    if (!id) return;
    var estado = leerEstado();
    if (!estado.vistos) estado.vistos = {};
    if (estado.vistos[id] && estado.vistos[id].ts) return;
    estado.vistos[id] = { ts: Date.now() };
    guardarEstado(estado);
  }

  /** Estudió la cartilla (la abrió) o ya la superó. */
  function fueEstudiado(temaId) {
    var id = String(temaId || '');
    if (!id) return false;
    var estado = leerEstado();
    if (estado.hechos && estado.hechos[id]) return true;
    if (estado.vistos && estado.vistos[id]) return true;
    return false;
  }

  function tsEstudioDe(temaId) {
    var id = String(temaId || '');
    if (!id) return 0;
    var estado = leerEstado();
    if (estado.vistos && estado.vistos[id] && estado.vistos[id].ts) {
      return Number(estado.vistos[id].ts) || 0;
    }
    if (estado.hechos && estado.hechos[id] && estado.hechos[id].ts) {
      return Number(estado.hechos[id].ts) || 0;
    }
    return 0;
  }

  /**
   * Minutos de espera antes de Repaso · Fallidas.
   * Con cooldown 0: null = aún no estudió; 0 = ya puede (tras abrir cartilla).
   */
  function minutosRestantesCooldown(temaId) {
    if (!fueEstudiado(temaId)) return null;
    if (!COOLDOWN_FALLIDAS_MS) return 0;
    var ts = tsEstudioDe(temaId);
    if (!ts) return null;
    var left = COOLDOWN_FALLIDAS_MS - (Date.now() - ts);
    if (left <= 0) return 0;
    return Math.max(1, Math.ceil(left / 60000));
  }

  /** Puede abrir Repaso · Fallidas del tema: basta haber abierto la cartilla (sin espera). */
  function puedeRepasarFallidas(temaId) {
    return fueEstudiado(temaId);
  }

  /** Pendientes activos: nunca incluye temas ya marcados como superados. */
  function listarPendientes() {
    var estado = leerEstado();
    var hechos = estado.hechos || {};
    var dirty = false;
    var limpios = (estado.pendientes || []).filter(function (p) {
      return p && p.id && !hechos[p.id];
    }).map(function (p) {
      var limpio = tituloDe(p.id, p);
      if (p.titulo !== limpio) {
        p.titulo = limpio;
        dirty = true;
      }
      return p;
    });
    if (dirty || limpios.length !== (estado.pendientes || []).length) {
      estado.pendientes = limpios;
      guardarEstado(estado);
    }
    return limpios.slice();
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
    }).sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
  }

  function exportarParaSnapshot() {
    return leerEstado();
  }

  function importarDesdeSnapshot(snapTemas) {
    if (!snapTemas || typeof snapTemas !== 'object') return;
    var local = leerEstado();
    var remotePend = Array.isArray(snapTemas.pendientes) ? snapTemas.pendientes : [];
    var remoteHechos = snapTemas.hechos && typeof snapTemas.hechos === 'object' ? snapTemas.hechos : {};
    var hechos = Object.assign({}, remoteHechos, local.hechos);
    var remoteVistos = snapTemas.vistos && typeof snapTemas.vistos === 'object' ? snapTemas.vistos : {};
    var vistos = Object.assign({}, remoteVistos, local.vistos || {});
    var map = {};
    local.pendientes.forEach(function (p) { if (p && p.id) map[p.id] = p; });
    remotePend.forEach(function (p) {
      if (!p || !p.id) return;
      if (!map[p.id] || (p.ts || 0) > (map[p.id].ts || 0)) map[p.id] = p;
    });
    // Superado gana: no puede quedar a la vez en pendientes y en hechos.
    Object.keys(hechos).forEach(function (id) { delete map[id]; });
    guardarEstado({
      pendientes: Object.keys(map).map(function (k) { return map[k]; }),
      hechos: hechos,
      vistos: vistos,
      updatedAt: new Date().toISOString()
    });
  }

  function contarPendientes() {
    return listarPendientes().length;
  }

  /**
   * Diccionario para detectar términos de la pregunta fallida (todas las áreas).
   * pattern: regex sobre enunciado+opciones; prioriza estos en el glosario.
   */
  var GLOSARIO_MATCH = [
    { pattern: /cuartil|q\s*[123]|boxplot|caja y bigotes|rango intercuart|iqr/i, termino: 'cuartil', definicion: 'Valor que divide los datos ordenados en cuatro partes iguales (25% cada una).', ejemplo: 'Q2 (cuartil 2) = mediana.' },
    { pattern: /\bmediana\b|q\s*2\b/i, termino: 'mediana', definicion: 'Valor central al ordenar los datos; es el cuartil 2 (Q2).', ejemplo: 'En 1,3,8 la mediana es 3.' },
    { pattern: /\bmedia\b|promedio/i, termino: 'media', definicion: 'Promedio: suma de datos ÷ cantidad de datos.', ejemplo: 'Media de 2,4,6 = 4.' },
    { pattern: /\bmoda\b/i, termino: 'moda', definicion: 'Valor que más se repite en el conjunto.', ejemplo: 'En 2,2,5 la moda es 2.' },
    { pattern: /intercuart|iqr|q\s*3\s*[-−]\s*q\s*1/i, termino: 'rango intercuartílico', definicion: 'IQR = Q3 − Q1; dispersión del 50% central.', ejemplo: 'Q1=25, Q3=65 → IQR=40.' },
    { pattern: /per[ií]metro/i, termino: 'perímetro', definicion: 'Medida del contorno de una figura (suma de lados).', ejemplo: 'Rectángulo: P = 2×(largo+ancho).' },
    { pattern: /\b[aá]rea\b/i, termino: 'área', definicion: 'Medida de la superficie interior de una figura plana.', ejemplo: 'Rectángulo: A = largo × ancho.' },
    { pattern: /pit[aá]goras|hipotenusa|cateto/i, termino: 'hipotenusa', definicion: 'Lado opuesto al ángulo recto; el más largo del triángulo rectángulo.', ejemplo: 'a² + b² = c².' },
    { pattern: /afluente/i, termino: 'afluente', definicion: 'Río que desemboca en otro río (no directamente en el mar).', ejemplo: 'El Cauca es afluente del Magdalena.' },
    { pattern: /cuenca/i, termino: 'cuenca', definicion: 'Territorio cuyas aguas drenan hacia un mismo río o mar.', ejemplo: 'Cuenca del Magdalena-Cauca.' },
    { pattern: /desemboca/i, termino: 'desembocadura', definicion: 'Lugar donde un río entrega sus aguas al mar u otro cuerpo.', ejemplo: 'El Magdalena desemboca en el Caribe.' },
    { pattern: /macizo colombiano/i, termino: 'macizo colombiano', definicion: 'Nudo montañoso del sur donde nacen grandes ríos.', ejemplo: 'Allí nacen Magdalena y Cauca.' },
    { pattern: /oxidaci[oó]n|se oxida|pierde electrones/i, termino: 'oxidación', definicion: 'Pérdida de electrones; el número de oxidación del elemento aumenta.', ejemplo: 'Sulfito → sulfato: el S se oxida.' },
    { pattern: /estado de oxidaci[oó]n|n[uú]mero de oxidaci[oó]n/i, termino: 'estado de oxidación', definicion: 'Carga formal del átomo si los enlaces fueran iónicos.', ejemplo: 'En SO₄²⁻ el azufre tiene +6.' },
    { pattern: /sulfito|SO_?3\^?\{?2-?\}?/i, termino: 'sulfito', definicion: 'Ion SO₃²⁻; el azufre suele estar en +4.', ejemplo: 'Semirreacción: SO₃²⁻ → SO₄²⁻.' },
    { pattern: /sulfato|SO_?4\^?\{?2-?\}?/i, termino: 'sulfato', definicion: 'Ion SO₄²⁻; el azufre suele estar en +6.', ejemplo: 'Producto de oxidar el sulfito.' },
    { pattern: /molaridad|\bM\s*=\s*n\s*\/\s*V/i, termino: 'molaridad', definicion: 'Concentración: moles de soluto por litro de solución (M = n/V).', ejemplo: '2 mol en 1 L → M = 2.' },
    { pattern: /\bmol\b|estequiometr/i, termino: 'mol', definicion: 'Cantidad de sustancia: 6,022×10²³ entidades.', ejemplo: '1 mol de H₂O ≈ 18 g.' },
    { pattern: /fotos[ií]ntesis|tilacoide|calvin/i, termino: 'fotosíntesis', definicion: 'Proceso que convierte luz, CO₂ y agua en glucosa y O₂.', ejemplo: 'Fase luminosa en tilacoides; Calvin fija CO₂.' },
    { pattern: /falacia|ad hominem|premisa/i, termino: 'falacia', definicion: 'Razonamiento inválido que parece convincente.', ejemplo: 'Atacar a la persona (ad hominem).' },
    { pattern: /inferencia|impl[ií]cito|se deduce/i, termino: 'inferencia', definicion: 'Conclusión apoyada por pistas del texto, no dicha literalmente.', ejemplo: 'Bostezó → probablemente está cansado.' },
    { pattern: /concordancia|present (simple|perfect)|past simple|does he|they ____/i, termino: 'concordancia', definicion: 'El verbo debe coincidir con el sujeto (número/persona).', ejemplo: 'He plays / They play.' },
    { pattern: /main idea|idea principal/i, termino: 'main idea', definicion: 'Idea principal: lo central que el texto comunica.', ejemplo: 'What the text is mostly about.' },
    { pattern: /constituci[oó]n|rama (legislativa|ejecutiva|judicial)/i, termino: 'Constitución', definicion: 'Norma Suprema que organiza el Estado y los derechos.', ejemplo: 'Constitución Política de 1991.' },
    { pattern: /fracci[oó]n|numerador|denominador/i, termino: 'fracción', definicion: 'Número que expresa partes de un todo (a/b).', ejemplo: '3/4: numerador 3, denominador 4.' },
    { pattern: /pendiente|y\s*=\s*mx/i, termino: 'pendiente', definicion: 'Cambio de y por cada unidad de x (m en y=mx+b).', ejemplo: 'En y=2x+1, m=2.' },
    { pattern: /probabilidad|espacio muestral/i, termino: 'probabilidad', definicion: 'Casos favorables ÷ casos posibles (entre 0 y 1).', ejemplo: 'P(cara)=1/2 en moneda justa.' },
    { pattern: /regi[oó]n (natural|andina|caribe|pac[ií]fica|amazon)/i, termino: 'región natural', definicion: 'Zona con rasgos comunes de relieve, clima y bioma.', ejemplo: 'Andina, Caribe, Pacífica, Orinoquía, Amazonía.' },
    { pattern: /\bp[aá]ramo\b/i, termino: 'páramo', definicion: 'Ecosistema de alta montaña tropical, frío y húmedo.', ejemplo: 'Frailejones y retención de agua.' },
    { pattern: /fuerza|f\s*=\s*m\s*[·\*]\s*a|\bnewton/i, termino: 'fuerza', definicion: 'Empuje o atracción que puede cambiar el movimiento: F = m·a.', ejemplo: 'Si m sube y F es fija, a baja.' },
    { pattern: /hip[oó]tesis|variable independiente|variable dependiente/i, termino: 'hipótesis', definicion: 'Afirmación comprobable que se pone a prueba en un experimento.', ejemplo: '“Si añado sal, el punto de ebullición sube.”' },
    { pattern: /no smoking|do not enter|staff only|prohibici[oó]n/i, termino: 'aviso', definicion: 'Texto breve que informa o prohíbe (imperativo / No + -ing).', ejemplo: 'No smoking = no fumar.' },
    { pattern: /vocabulary|vocabulario|synonym|antonym|means the same|closest in meaning/i, termino: 'vocabulario', definicion: 'Palabra o expresión cuyo sentido se deduce del contexto.', ejemplo: 'Elige el sinónimo que encaja en la oración.' },
    { pattern: /dialogue|di[aá]logo|speaker|conversation/i, termino: 'diálogo', definicion: 'Intercambio oral; identifica quién habla y qué pide o responde.', ejemplo: 'What does the woman want?' },
    { pattern: /cloze|fill in the blank|complete the sentence|conjug/i, termino: 'cloze', definicion: 'Completar huecos con la forma gramatical correcta.', ejemplo: 'She ____ to school every day → goes.' },
    { pattern: /argumento|tesis|conclusi[oó]n del autor/i, termino: 'argumento', definicion: 'Conjunto de premisas que sustentan una conclusión.', ejemplo: 'Premisas → conclusión.' },
    { pattern: /redox|semirreacci[oó]n|p[eé]rdida de electrones|ganancia de electrones/i, termino: 'redox', definicion: 'Reacción con transferencia de electrones (oxidación + reducción).', ejemplo: 'Si el S pasa de +4 a +6, se oxida.' },
    { pattern: /proporci[oó]n|regla de tres|raz[oó]n/i, termino: 'proporción', definicion: 'Igualdad de dos razones; sirve para hallar un valor desconocido.', ejemplo: '2/5 = x/20 → x = 8.' },
    { pattern: /independencia|boyac[aá]|20 de julio|criollos/i, termino: 'Independencia', definicion: 'Proceso que llevó a Colombia a separarse de España (s. XIX).', ejemplo: '20 de julio de 1810; Boyacá 1819.' }
  ];

  function textoDeFallos(temaId) {
    var parts = [];
    try {
      (fallosDeTema(temaId) || []).forEach(function (f) {
        if (!f) return;
        if (f.enunciado) parts.push(f.enunciado);
        if (Array.isArray(f.opciones)) parts.push(f.opciones.join(' '));
        if (f.textoElegida) parts.push(f.textoElegida);
        if (f.textoCorrecta) parts.push(f.textoCorrecta);
      });
    } catch (_) {}
    return parts.join(' \n ');
  }

  /** Une términos detectados en la pregunta fallida (prioridad) + términos del tema. */
  function glosarioParaTema(temaId, terminosBase) {
    var base = Array.isArray(terminosBase) ? terminosBase.slice() : [];
    var texto = textoDeFallos(temaId);
    var priorizados = [];
    var vistos = {};
    function keyOf(tm) {
      return String((tm && tm.termino) || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    if (texto) {
      GLOSARIO_MATCH.forEach(function (g) {
        if (!g.pattern.test(texto)) return;
        var k = keyOf(g);
        if (vistos[k]) return;
        vistos[k] = true;
        priorizados.push({
          termino: g.termino,
          definicion: g.definicion,
          ejemplo: g.ejemplo || '',
          desdePregunta: true
        });
      });
    }
    base.forEach(function (tm) {
      if (!tm || !tm.termino) return;
      var k = keyOf(tm);
      if (vistos[k]) return;
      vistos[k] = true;
      priorizados.push(tm);
    });
    return priorizados.slice(0, 8);
  }

  /** Actualiza la tarjeta de la sala (index). */
  function pintarSala() {
    var el = document.getElementById('lblTemasRefuerzoDetalle');
    var puerta = document.getElementById('puertaTemasRefuerzo');
    if (!el && !puerta) return;
    var n = contarPendientes();
    if (el) {
      el.textContent = n > 0
        ? (n + (n === 1 ? ' tema pendiente' : ' temas pendientes') + ' · Estudia lo que fallaste')
        : 'Disponible · Estudia lo que fallaste';
    }
    if (puerta) {
      puerta.classList.toggle('sala-card-has-pending', n > 0);
      puerta.setAttribute('data-pendientes', String(n));
    }
  }

  function arranqueSala() {
    try { pintarSala(); } catch (_) {}
  }

  global.DanteTemasRefuerzo = {
    cargarCatalogo: cargarCatalogo,
    temaPorId: temaPorId,
    resolverTemaId: resolverTemaId,
    registrarFallo: registrarFallo,
    marcarHecho: marcarHecho,
    marcarVisto: marcarVisto,
    fueEstudiado: fueEstudiado,
    minutosRestantesCooldown: minutosRestantesCooldown,
    puedeRepasarFallidas: puedeRepasarFallidas,
    cooldownMs: COOLDOWN_FALLIDAS_MS,
    tituloDe: tituloDe,
    fallosDeTema: fallosDeTema,
    glosarioParaTema: glosarioParaTema,
    textoDeFallos: textoDeFallos,
    listarPendientes: listarPendientes,
    listarHechos: listarHechos,
    contarPendientes: contarPendientes,
    pintarSala: pintarSala,
    exportarParaSnapshot: exportarParaSnapshot,
    importarDesdeSnapshot: importarDesdeSnapshot,
    leerEstado: leerEstado
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arranqueSala);
  } else {
    arranqueSala();
  }
})(window);
