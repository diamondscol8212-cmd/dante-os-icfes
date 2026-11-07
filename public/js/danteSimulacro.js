(function () {
  'use strict';

  const CLAVE = 'dante_simulacro_largo';
  const CLAVE_INFORME = 'dante_simulacro_informe';
  const TIEMPO_MS = (4 * 60 + 30) * 60 * 1000;
  const PLAN = [
    { sesion: 1, area: 'matematicas', n: 25 },
    { sesion: 1, area: 'lectura_critica', n: 41 },
    { sesion: 1, area: 'sociales_ciudadanas', n: 25 },
    { sesion: 1, area: 'ciencias_naturales', n: 29 },
    { sesion: 2, area: 'matematicas', n: 25 },
    { sesion: 2, area: 'sociales_ciudadanas', n: 25 },
    { sesion: 2, area: 'ciencias_naturales', n: 29 },
    { sesion: 2, area: 'ingles', n: 55 }
  ];
  const TOTAL = PLAN.reduce((suma, paso) => suma + paso.n, 0);
  const CORTE = PLAN.filter((paso) => paso.sesion === 1).reduce((suma, paso) => suma + paso.n, 0);
  const NOMBRES = {
    matematicas: 'Matemáticas',
    lectura_critica: 'Lectura crítica',
    sociales_ciudadanas: 'Sociales',
    ciencias_naturales: 'Ciencias',
    ingles: 'Inglés'
  };

  function tramo(indice) {
    let cursor = 0;
    for (let i = 0; i < PLAN.length; i++) {
      if (indice < cursor + PLAN[i].n) return PLAN[i];
      cursor += PLAN[i].n;
    }
    return PLAN[PLAN.length - 1];
  }

  function etiqueta(indice) {
    const paso = tramo(Math.max(0, Number(indice) || 0));
    return 'Simulacro · Sesión ' + paso.sesion + ' · ' + (NOMBRES[paso.area] || 'Área');
  }

  function mezclar(lista, semilla) {
    const copia = lista.slice();
    let estado = semilla >>> 0;
    const aleatorio = () => {
      estado = (estado + 0x6D2B79F5) >>> 0;
      let t = estado;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(aleatorio() * (i + 1));
      const tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  function areaDe(item) {
    const cruda = String((item && (item.area || item.area_general || item.materia)) || '').toLowerCase();
    if (cruda.includes('mate')) return 'matematicas';
    if (cruda.includes('lect')) return 'lectura_critica';
    if (cruda.includes('cien') || cruda.includes('natur')) return 'ciencias_naturales';
    if (cruda.includes('social')) return 'sociales_ciudadanas';
    if (cruda.includes('ingl')) return 'ingles';
    return '';
  }

  function esSaber(item) {
    const examen = String(item && item.target_exam || 'SABER_11').toUpperCase();
    if (examen.includes('UNAL') || examen.includes('DOCENTE') || examen.includes('PRO')) return false;
    const id = String(item && item.id || '');
    if (/^item_(unal|docente|saberpro)/.test(id)) return false;
    return Boolean(areaDe(item));
  }

  function leer() {
    try {
      const dato = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      return dato && dato.id ? dato : null;
    } catch (e) {
      return null;
    }
  }

  function guardar(dato) {
    try { localStorage.setItem(CLAVE, JSON.stringify(dato)); } catch (e) {}
  }

  function reloj(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    const segundos = total % 60;
    return horas + ':' + String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
  }

  function identidad() {
    let studentId = localStorage.getItem('dante_student_id') || localStorage.getItem('dante_active_student') || '';
    let email = null;
    let token = localStorage.getItem('dante_token') || localStorage.getItem('dante_jwt') || '';
    try {
      const sesion = JSON.parse(localStorage.getItem('dante_session') || '{}');
      if (sesion && sesion.user) {
        email = sesion.user.email || null;
        if (!studentId) studentId = sesion.user.estudiante || sesion.user.nombre || '';
        if (!token && sesion.token) token = sesion.token;
      }
    } catch (e) {}
    return { studentId: studentId || '', email, token };
  }

  function aplicarExpedienteServidor(expediente) {
    if (!expediente || typeof expediente !== 'object') return;
    const dato = leer() || { id: expediente.id || 'sim_servidor', estado: 'listo', respuestas: [], resultado: null };
    if (dato.estado === 'abierto') return;
    dato.estado = 'listo';
    dato.id = expediente.id || dato.id;
    dato.resultado = {
      global: expediente.global == null ? null : Number(expediente.global),
      areas: expediente.areas && typeof expediente.areas === 'object' ? expediente.areas : {}
    };
    dato.cerrado_en = expediente.cerrado_en || null;
    dato.persistido = true;
    guardar(dato);
  }

  async function sincronizarDesdeServidor() {
    const { studentId, email, token } = identidad();
    if (!studentId && !email) return null;
    const q = new URLSearchParams();
    if (studentId) q.set('estudiante', studentId);
    if (email) q.set('email', email);
    try {
      const headers = {};
      if (token) headers.Authorization = 'Bearer ' + token;
      const resp = await fetch('/api/dante/simulacro/ultimo?' + q.toString(), {
        credentials: 'include',
        headers
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      const local = leer();
      // Recuperar checkpoint abierto del servidor si no hay sesión local abierta.
      if (json && json.abierto && json.abierto.id && !(local && local.estado === 'abierto')) {
        await aplicarCheckpointServidor(json.abierto);
      }
      if (json && json.simulacro) {
        aplicarExpedienteServidor(json.simulacro);
        return json.simulacro;
      }
      return json && json.abierto ? json.abierto : null;
    } catch (e) {}
    return null;
  }

  async function aplicarCheckpointServidor(chk) {
    if (!chk || !chk.id) return;
    const lista = await banco();
    const mapa = mapaBanco(lista);
    const ids = Array.isArray(chk.ids) ? chk.ids : [];
    const reactivos = ids.map((id) => mapa.get(String(id))).filter(Boolean);
    if (!ids.length || reactivos.length !== TOTAL) {
      // Sin las 254 preguntas del cuadernillo no reabrimos desde la nube.
      return;
    }
    const dato = {
      id: chk.id,
      estado: 'abierto',
      sesion: chk.sesion === 2 ? 2 : 1,
      restanteMs: Math.max(0, Number(chk.restanteMs) || TIEMPO_MS),
      indice: Math.max(0, Number(chk.indice) || 0),
      ids: ids.length ? ids : reactivos.map((r) => r.id),
      reactivos: reactivos,
      respuestas: Array.isArray(chk.respuestas) ? chk.respuestas : [],
      puenteVisto: chk.sesion === 2,
      resultado: null,
      persistidoCheckpoint: true
    };
    guardar(dato);
  }

  let syncCheckpointEnCurso = false;
  async function enviarCheckpoint(dato) {
    if (!dato || dato.estado !== 'abierto' || syncCheckpointEnCurso) return;
    const { studentId, email, token } = identidad();
    if (!studentId && !email) return;
    syncCheckpointEnCurso = true;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = 'Bearer ' + token;
      if (studentId) headers['x-student-id'] = studentId;
      await fetch('/api/dante/simulacro/checkpoint', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          studentId,
          email,
          simulacroId: dato.id,
          sesion: dato.sesion,
          indice: dato.indice,
          restanteMs: dato.restanteMs,
          respuestas: dato.respuestas || [],
          ids: dato.ids || []
        })
      });
    } catch (e) {}
    syncCheckpointEnCurso = false;
  }

  function nivelArea(puntaje) {
    const n = Number(puntaje);
    if (!Number.isFinite(n)) return '—';
    if (n >= 71) return '4';
    if (n >= 51) return '3';
    if (n >= 36) return '2';
    return '1';
  }

  function percentilDe(global) {
    const g = Number(global);
    if (!Number.isFinite(g)) return null;
    return Math.min(99, Math.max(1, Math.round(g / 5.05)));
  }

  function textoProgresoDialogo(dato) {
    if (!dato) return '';
    if (dato.estado === 'abierto') {
      const hechas = Array.isArray(dato.respuestas) ? dato.respuestas.length : 0;
      const actual = Math.min(TOTAL, (dato.indice || 0) + 1);
      const sesion = dato.sesion === 2 ? 2 : 1;
      const resto = reloj(dato.restanteMs || 0);
      return 'Tu simulacro Saber 11° sigue abierto: sesión ' + sesion + ', pregunta ' + actual + ' de ' + TOTAL + ', ' + hechas + ' marcadas. Reloj en pausa en la sala: ' + resto + '.';
    }
    if (dato.estado === 'listo' && dato.resultado) {
      if (dato.resultado.global != null) {
        return 'Tu último simulacro quedó en ' + dato.resultado.global + ' / 500. El informe estilo ICFES sigue disponible en la puerta del simulacro.';
      }
      return 'Cerraste un simulacro sin puntaje global completo. Puedes ver el desglose o empezar otro desde la puerta.';
    }
    return '';
  }

  function pintarDialogoSala(dato) {
    const linea = textoProgresoDialogo(dato);
    if (!linea) return;
    const caja = document.getElementById('lblPasoDescripcion') || document.getElementById('txtDanteTypewriter');
    if (!caja) return;
    if (caja.dataset && caja.dataset.simEco === linea) return;
    if (caja.dataset) caja.dataset.simEco = linea;
    if (window.DanteHubEngine && typeof DanteHubEngine.ejecutarEfectoEscribir === 'function') {
      DanteHubEngine.ejecutarEfectoEscribir(caja, linea, 12);
    } else {
      caja.textContent = linea;
    }
  }

  function pintar() {
    const detalle = document.getElementById('lblSimulacroDetalle');
    const titulo = document.getElementById('lblSimulacroTitulo');
    const dato = leer();
    const informe = leerInforme();
    if (titulo) {
      if (dato && dato.estado === 'abierto') titulo.textContent = 'Simulacro Completo';
      else if ((dato && dato.estado === 'listo' && dato.resultado) || informe) titulo.textContent = 'Simulacro Completo';
      else titulo.textContent = 'Simulacro Completo';
    }
    if (detalle) {
      if (dato && dato.estado === 'abierto') {
        const actual = Math.min(TOTAL, (dato.indice || 0) + 1);
        const sesion = dato.sesion === 2 ? 2 : 1;
        detalle.textContent = 'Sesión ' + sesion + ' · ' + actual + '/' + TOTAL;
      } else if (dato && dato.estado === 'listo' && dato.resultado) {
        if (dato.resultado.global != null) {
          detalle.textContent = dato.resultado.global + ' / 500';
        } else {
          detalle.textContent = 'Informe listo';
        }
      } else if (informe && informe.resultado) {
        const g = informe.resultado.global;
        detalle.textContent = g != null ? (g + ' / 500') : 'Informe listo';
      } else {
        detalle.textContent = '2 sesiones · 4 h 30';
      }
    }
    if (dato && dato.estado === 'abierto') pintarDialogoSala(dato);
  }

  function copiarItem(item) {
    return {
      id: item.id,
      area: areaDe(item),
      materia: areaDe(item),
      area_general: areaDe(item),
      target_exam: 'SABER_11',
      pregunta_texto: item.pregunta_texto || item.texto || item.enunciado,
      texto: item.pregunta_texto || item.texto || item.enunciado,
      opciones: item.opciones || item.opciones_respuesta || [],
      opciones_respuesta: item.opciones_respuesta || item.opciones || [],
      recurso_visual: item.recurso_visual || null,
      imagen_url: item.imagen_url || null,
      a: item.a,
      b: item.b,
      c: item.c
    };
  }

  function alcanza(lista) {
    const cuentas = {};
    (lista || []).filter(esSaber).forEach((item) => {
      const area = areaDe(item);
      cuentas[area] = (cuentas[area] || 0) + 1;
    });
    const falta = {};
    PLAN.forEach((paso) => { falta[paso.area] = (falta[paso.area] || 0) + paso.n; });
    return Object.entries(falta).every(([area, n]) => (cuentas[area] || 0) >= n);
  }

  async function pedirAlServidor(semilla) {
    try {
      const resp = await fetch('/api/dante/simulacro?semilla=' + encodeURIComponent(semilla), { credentials: 'include' });
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data || !Array.isArray(data.reactivos) || data.reactivos.length !== TOTAL) return null;
      return data.reactivos.map(copiarItem);
    } catch (e) {
      return null;
    }
  }

  function esEscrito(item) {
    return !/_gen_/.test(String((item && item.id) || ''));
  }

  function armar(banco, semilla) {
    const porArea = {};
    banco.filter(esSaber).forEach((item) => {
      const area = areaDe(item);
      if (!porArea[area]) porArea[area] = [];
      porArea[area].push(item);
    });
    const usados = new Set();
    const reactivos = [];
    const ids = [];
    for (const paso of PLAN) {
      const libres = (porArea[paso.area] || []).filter((item) => item && item.id && !usados.has(item.id));
      const bolsa = mezclar(libres.filter(esEscrito), semilla + reactivos.length * 17)
        .concat(mezclar(libres.filter((item) => !esEscrito(item)), semilla + reactivos.length * 31));
      if (bolsa.length < paso.n) return null;
      bolsa.slice(0, paso.n).forEach((item) => {
        usados.add(item.id);
        ids.push(item.id);
        reactivos.push(copiarItem(item));
      });
    }
    return { ids, reactivos };
  }

  async function banco() {
    if (Array.isArray(window.DANTE_BANCO_ITEMS) && window.DANTE_BANCO_ITEMS.length) return window.DANTE_BANCO_ITEMS;
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

  function misionDesde(dato, itemsPorId) {
    const reactivos = (dato.ids || []).map((id) => itemsPorId.get(String(id))).filter(Boolean);
    return {
      misionId: dato.id,
      esSimulacro: true,
      isDiagnostic: false,
      isFirstSession: false,
      targetTrack: 'ICFES',
      totalReactivos: reactivos.length,
      reactivos: reactivos,
      reanudarIndice: dato.indice || 0,
      reanudarRespuestas: dato.respuestas || [],
      microDilemasVocacionales: []
    };
  }

  function mapaBanco(lista) {
    const mapa = new Map();
    lista.forEach((item) => { if (item && item.id) mapa.set(String(item.id), copiarItem(item)); });
    return mapa;
  }

  let temporizador = null;

  function pararReloj() {
    if (temporizador) clearInterval(temporizador);
    temporizador = null;
  }

  function pintarReloj() {
    const dato = leer();
    const etiqueta = document.getElementById('lblRelojSesion');
    const materia = document.getElementById('lblMateriaExamen');
    const sesion = dato && dato.sesion === 2 ? 2 : 1;
    if (materia && window.DanteExamWorkspace && DanteExamWorkspace.misionData && DanteExamWorkspace.misionData.esSimulacro) {
      materia.textContent = 'Simulacro · Sesión ' + sesion;
    }
    if (etiqueta && dato) {
      const span = etiqueta.querySelector('span');
      if (span) span.textContent = reloj(dato.restanteMs || 0);
      else etiqueta.textContent = reloj(dato.restanteMs || 0);
    }
  }

  function arrancarReloj() {
    pararReloj();
    temporizador = setInterval(() => {
      const dato = leer();
      const ws = window.DanteExamWorkspace;
      if (!dato || dato.estado !== 'abierto' || !ws || !ws.misionData || !ws.misionData.esSimulacro) {
        pararReloj();
        return;
      }
      dato.restanteMs = Math.max(0, (dato.restanteMs || 0) - 1000);
      guardar(dato);
      pintarReloj();
      if (dato.restanteMs <= 0) tiempoAgotado();
    }, 1000);
    pintarReloj();
  }

  function guardarParcial(ws) {
    const dato = leer();
    if (!dato || dato.estado !== 'abierto' || !ws || !ws.misionData || !ws.misionData.esSimulacro) return;
    dato.indice = ws.indexReactivoActivo || 0;
    const listaResp = Array.isArray(ws.respuestasSesionActiva)
      ? ws.respuestasSesionActiva
      : Object.values(ws.respuestasSesionActiva || {});
    dato.respuestas = listaResp.filter((fila) => fila && fila.id && typeof fila.correcto === 'boolean').map((fila) => ({
      id: fila.id,
      correcto: fila.correcto,
      materia: fila.materia || fila.area || ''
    }));
    dato.pausado_en = null;
    guardar(dato);
    pintar();
  }

  /** Fase 4 — pausa confiable: frena reloj, guarda y checkpoint en nube. */
  function alPausar(ws) {
    pararReloj();
    const activo = ws || window.DanteExamWorkspace;
    if (activo) guardarParcial(activo);
    const dato = leer();
    if (dato && dato.estado === 'abierto') {
      dato.pausado_en = new Date().toISOString();
      guardar(dato);
      enviarCheckpoint(dato);
    }
    pintar();
  }

  function mostrarNota(titulo, texto, botones) {
    let capa = document.getElementById('notaSimulacro');
    if (!capa) {
      capa = document.createElement('div');
      capa.id = 'notaSimulacro';
      capa.style.cssText = 'position:fixed;inset:0;z-index:220;background:rgba(6,5,4,0.78);display:flex;align-items:center;justify-content:center;padding:1rem;';
      document.body.appendChild(capa);
    }
    const acciones = (botones || []).map((boton, i) => '<button type="button" data-sim-accion="' + i + '" style="display:block;width:100%;margin-top:0.7rem;background:#e7d7c3;color:#1c1917;border:0;border-radius:999px;padding:0.75rem 1rem;font-family:Georgia,serif;font-size:1rem;cursor:pointer;">' + boton.texto + '</button>').join('');
    capa.innerHTML = '<div style="width:min(24rem,100%);background:#faf8f5;color:#1c1917;border-radius:22px;padding:1.3rem 1.2rem;"><p style="margin:0;font-family:Georgia,serif;font-size:0.85rem;letter-spacing:0.04em;text-transform:uppercase;">Simulacro</p><h2 style="margin:0.4rem 0 0;font-family:Georgia,serif;font-weight:500;font-size:1.45rem;">' + titulo + '</h2><p style="margin:0.8rem 0 0;line-height:1.45;">' + texto + '</p>' + acciones + '</div>';
    capa.querySelectorAll('[data-sim-accion]').forEach((nodo) => {
      nodo.addEventListener('click', () => {
        const accion = botones[Number(nodo.getAttribute('data-sim-accion'))];
        if (accion && accion.alClick) accion.alClick();
      });
    });
  }

  function cerrarNota() {
    const capa = document.getElementById('notaSimulacro');
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
    if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.iniciarSesion === 'function') {
      window.DanteExamWorkspace.iniciarSesion(mision);
    }
  }

  function tiempoAgotado() {
    pararReloj();
    const dato = leer();
    const ws = window.DanteExamWorkspace;
    if (ws) guardarParcial(ws);
    if (!dato) return;
    if ((dato.sesion || 1) === 1) {
      mostrarNota('Se acabó la sesión 1', 'Lo que marcaste queda guardado. Las preguntas que no alcanzaste no entran como error. La sesión 2 dura otras 4 horas y 30 minutos.', [
        { texto: 'Empezar la sesión 2', alClick: empezarSesion2 },
        { texto: 'Volver a la sala', alClick: volverSala }
      ]);
      return;
    }
    if (ws) alTerminarPreguntas(ws, true);
  }

  function empezarSesion2() {
    const dato = leer();
    const ws = window.DanteExamWorkspace;
    if (!dato || !ws) return;
    dato.sesion = 2;
    dato.restanteMs = TIEMPO_MS;
    dato.puenteVisto = true;
    if ((ws.indexReactivoActivo || 0) < CORTE) ws.indexReactivoActivo = CORTE;
    dato.indice = ws.indexReactivoActivo;
    guardar(dato);
    cerrarNota();
    arrancarReloj();
    if (typeof ws.renderizarReactivoActual === 'function') ws.renderizarReactivoActual();
  }

  function volverSala() {
    pararReloj();
    cerrarNota();
    if (window.AppController && typeof window.AppController.pausarYVolverASala === 'function') {
      window.AppController.pausarYVolverASala();
      return;
    }
    pintar();
  }

  function antesDePregunta(ws) {
    const dato = leer();
    if (!dato || !ws || !ws.misionData || !ws.misionData.esSimulacro) return false;
    if ((ws.indexReactivoActivo || 0) === CORTE && dato.sesion !== 2) {
      pararReloj();
      mostrarNota('Sesión 1 lista', 'La sesión 2 trae el resto de matemáticas, sociales, ciencias e inglés. Dura 4 horas y 30 minutos.', [
        { texto: 'Empezar la sesión 2', alClick: empezarSesion2 },
        { texto: 'Dejarlo guardado', alClick: volverSala }
      ]);
      return true;
    }
    pintarReloj();
    return false;
  }

  function hoja(resultado, parcial, enSala) {
    const nombres = [
      ['matematicas', 'Matemáticas'],
      ['lectura_critica', 'Lectura crítica'],
      ['ciencias_naturales', 'Ciencias naturales'],
      ['sociales_ciudadanas', 'Sociales y ciudadanas'],
      ['ingles', 'Inglés']
    ];
    const areas = (resultado && resultado.areas) || {};
    const globalNum = resultado && resultado.global != null ? Number(resultado.global) : null;
    const percentil = percentilDe(globalNum);
    const nombre = localStorage.getItem('dante_student_name') || localStorage.getItem('dante_active_student') || 'Estudiante';
    const meta = leerInforme() || leer() || {};
    const snp = 'SIM-' + String(meta.id || Date.now()).replace(/\D/g, '').slice(-8);
    const fecha = meta.cerrado_en
      ? new Date(meta.cerrado_en).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const filas = nombres.map(([clave, nombreArea]) => {
      const valor = areas[clave];
      const texto = valor == null ? '—' : String(valor);
      const nivel = valor == null ? '—' : nivelArea(valor);
      return '<tr>'
        + '<td style="padding:0.55rem 0.4rem;border-bottom:1px solid #e7e2da;">' + nombreArea + '</td>'
        + '<td style="padding:0.55rem 0.4rem;border-bottom:1px solid #e7e2da;text-align:right;font-variant-numeric:tabular-nums;">' + texto + '</td>'
        + '<td style="padding:0.55rem 0.4rem;border-bottom:1px solid #e7e2da;text-align:right;">' + nivel + '</td>'
        + '</tr>';
    }).join('');
    const aviso = parcial
      ? 'Faltaron preguntas en alguna área, así que el puntaje global no se publica. Las pruebas con evidencia sí muestran puntaje de 0 a 100.'
      : 'Hoja de resultados del simulacro Dante OS, armada con la misma escala del Saber 11° (global / 500 y pruebas / 100). No reemplaza el resultado oficial del ICFES.';
    const markup = ''
      + '<div style="max-width:40rem;margin:1rem auto;background:#f7f4ef;color:#1c1917;border:1px solid #d6cfc3;border-radius:8px;padding:1.25rem 1.15rem;font-family:Georgia,\'Times New Roman\',serif;box-shadow:0 18px 40px rgba(0,0,0,0.28);">'
      + '<div style="display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;border-bottom:2px solid #1c1917;padding-bottom:0.85rem;">'
      + '<div><p style="margin:0;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:#57534e;">Instituto Colombiano para la Evaluación de la Educación</p>'
      + '<h2 style="margin:0.25rem 0 0;font-size:1.15rem;font-weight:700;">Resultados del examen Saber 11°</h2>'
      + '<p style="margin:0.35rem 0 0;font-size:0.82rem;color:#44403c;">Simulacro Dante OS · Código ' + snp + '</p></div>'
      + '<div style="text-align:right;font-size:0.78rem;color:#57534e;"><span style="display:block;text-transform:uppercase;letter-spacing:0.06em;">Fecha</span><strong style="color:#1c1917;">' + fecha + '</strong></div>'
      + '</div>'
      + '<div style="margin-top:0.9rem;display:grid;grid-template-columns:1.2fr 1fr;gap:0.75rem;">'
      + '<div style="border:1px solid #d6cfc3;border-radius:6px;padding:0.75rem;"><span style="display:block;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.06em;color:#57534e;">Estudiante</span><strong style="font-size:1rem;">' + nombre + '</strong></div>'
      + '<div style="border:1px solid #d6cfc3;border-radius:6px;padding:0.75rem;background:#fff;"><span style="display:block;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.06em;color:#57534e;">Puntaje global</span>'
      + '<strong style="font-size:1.7rem;line-height:1;">' + (globalNum == null ? '—' : globalNum) + '</strong>'
      + '<span style="color:#78716c;"> / 500</span>'
      + (percentil != null ? '<div style="margin-top:0.25rem;font-size:0.8rem;color:#44403c;">Percentil estimado: ' + percentil + '</div>' : '')
      + '</div></div>'
      + '<p style="margin:0.9rem 0 0.45rem;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em;color:#57534e;">Resultados por prueba</p>'
      + '<table style="width:100%;border-collapse:collapse;font-size:0.92rem;"><thead><tr>'
      + '<th style="text-align:left;padding:0.4rem;border-bottom:2px solid #1c1917;font-weight:600;">Prueba</th>'
      + '<th style="text-align:right;padding:0.4rem;border-bottom:2px solid #1c1917;font-weight:600;">Puntaje</th>'
      + '<th style="text-align:right;padding:0.4rem;border-bottom:2px solid #1c1917;font-weight:600;">Nivel</th>'
      + '</tr></thead><tbody>' + filas + '</tbody></table>'
      + '<p style="margin:0.9rem 0 0;font-size:0.84rem;line-height:1.45;color:#44403c;">' + aviso + '</p>'
      + '<button type="button" id="btnDescargarSemanaSim" style="display:block;width:100%;margin-top:1rem;background:#1c1917;color:#faf8f5;border:0;border-radius:999px;padding:0.75rem 1rem;cursor:pointer;font-family:inherit;">Descargar el informe de la semana</button>'
      + (enSala
        ? '<button type="button" id="btnNuevoDesdeSim" style="display:block;width:100%;margin-top:0.55rem;background:#e7d7c3;color:#1c1917;border:0;border-radius:999px;padding:0.75rem 1rem;cursor:pointer;font-family:inherit;">Empezar otro simulacro</button>'
          + '<button type="button" id="btnSalaDesdeSim" style="display:block;width:100%;margin-top:0.55rem;background:transparent;color:#1c1917;border:1px solid #a8a29e;border-radius:999px;padding:0.7rem 1rem;cursor:pointer;font-family:inherit;">Cerrar</button>'
        : '<button type="button" id="btnSalaDesdeSim" style="display:block;width:100%;margin-top:0.55rem;background:#e7d7c3;color:#1c1917;border:0;border-radius:999px;padding:0.75rem 1rem;cursor:pointer;font-family:inherit;">Volver a la sala</button>')
      + '</div>';

    if (enSala) {
      mostrarNotaHtml(markup);
      const bajar = document.getElementById('btnDescargarSemanaSim');
      if (bajar) bajar.onclick = () => { if (window.DanteSemana) DanteSemana.descargar(); };
      const nuevo = document.getElementById('btnNuevoDesdeSim');
      if (nuevo) nuevo.onclick = () => { cerrarNota(); confirmarNuevoSimulacro(); };
      const sala = document.getElementById('btnSalaDesdeSim');
      if (sala) sala.onclick = () => { cerrarNota(); pintar(); };
      return;
    }

    const caja = document.getElementById('uiPantallaResumenContainer') || document.getElementById('uiReactivoContainer');
    const preguntas = document.getElementById('uiReactivoContainer');
    if (preguntas && caja !== preguntas) preguntas.style.display = 'none';
    if (!caja) return;
    caja.style.display = 'block';
    caja.innerHTML = markup;
    const bajar = document.getElementById('btnDescargarSemanaSim');
    if (bajar) bajar.onclick = () => { if (window.DanteSemana) DanteSemana.descargar(); };
    const sala = document.getElementById('btnSalaDesdeSim');
    if (sala) sala.onclick = () => {
      if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.regresarAlHub === 'function') {
        window.DanteExamWorkspace.regresarAlHub();
      }
      pintar();
    };
  }

  function mostrarNotaHtml(htmlInterior) {
    let capa = document.getElementById('notaSimulacro');
    if (!capa) {
      capa = document.createElement('div');
      capa.id = 'notaSimulacro';
      capa.style.cssText = 'position:fixed;inset:0;z-index:220;background:rgba(6,5,4,0.82);display:flex;align-items:flex-start;justify-content:center;padding:1rem;overflow:auto;';
      document.body.appendChild(capa);
    }
    capa.innerHTML = '<div style="width:min(42rem,100%);margin:1rem auto;">' + htmlInterior + '</div>';
  }

  function leerInforme() {
    const dato = leer();
    if (dato && dato.resultado) {
      return { resultado: dato.resultado, cerrado_en: dato.cerrado_en, id: dato.id };
    }
    try {
      const raw = JSON.parse(localStorage.getItem(CLAVE_INFORME) || 'null');
      if (raw && raw.resultado) return raw;
    } catch (e) {}
    return null;
  }

  function verInforme() {
    const informe = leerInforme();
    if (!informe || !informe.resultado) return;
    const completo = informe.resultado.global != null;
    hoja(informe.resultado, !completo, true);
  }

  function confirmarNuevoSimulacro() {
    mostrarNota('¿Empezar otro simulacro?', 'Tu hoja de resultados anterior queda guardada. Primero te explico cómo funciona el examen y luego pasas por la respiración.', [
      { texto: 'Sí, empezar otro', alClick: () => { cerrarNota(); try { localStorage.removeItem(CLAVE); } catch (e) {} pintar(); mostrarBriefing(); } },
      { texto: 'Cancelar', alClick: () => { cerrarNota(); verInforme(); } }
    ]);
  }

  function mostrarBriefing() {
    const modal = document.getElementById('modalBriefingSimulacro');
    if (!modal) {
      aceptarBriefing();
      return;
    }
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function cerrarBriefing() {
    const modal = document.getElementById('modalBriefingSimulacro');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }

  function aceptarBriefing() {
    cerrarBriefing();
    iniciarNuevoTrasBriefing();
  }

  function menuResultadoListo() {
    const informe = leerInforme();
    const global = informe && informe.resultado && informe.resultado.global != null
      ? (informe.resultado.global + ' / 500')
      : 'sin global completo';
    mostrarNota('Simulacro terminado', 'Tu último resultado quedó en ' + global + '. Puedes abrir la hoja estilo ICFES cuando quieras, o empezar otro cuadernillo.', [
      { texto: 'Ver hoja de resultados', alClick: () => { cerrarNota(); verInforme(); } },
      { texto: 'Empezar otro simulacro', alClick: () => { cerrarNota(); confirmarNuevoSimulacro(); } },
      { texto: 'Seguir en la sala', alClick: cerrarNota }
    ]);
  }

  let cerrandoSimulacro = false;

  async function alTerminarPreguntas(ws, porTiempo) {
    if (cerrandoSimulacro) return;
    cerrandoSimulacro = true;
    pararReloj();
    cerrarNota();
    if (ws) guardarParcial(ws);
    const dato = leer() || { id: 'simulacro', estado: 'abierto', respuestas: [] };
    let resultado = { areas: {}, global: null };
    const { studentId, email, token } = identidad();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = 'Bearer ' + token;
      if (studentId) headers['x-student-id'] = studentId;
      const resp = await fetch('/api/dante/simulacro/puntaje', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          respuestas: dato.respuestas || [],
          studentId,
          email,
          simulacroId: dato.id,
          porTiempo: Boolean(porTiempo)
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        resultado = { areas: json.areas || {}, global: json.global == null ? null : json.global };
        if (json.expediente) aplicarExpedienteServidor(json.expediente);
      }
    } catch (e) {}
    dato.estado = 'listo';
    dato.resultado = resultado;
    dato.cerrado_en = new Date().toISOString();
    guardar(dato);
    try {
      localStorage.setItem(CLAVE_INFORME, JSON.stringify({
        id: dato.id,
        resultado: resultado,
        cerrado_en: dato.cerrado_en
      }));
    } catch (e) {}
    if (window.DanteSemana) DanteSemana.anotarSimulacro(resultado);
    // Parcial solo si falta evidencia de áreas (sin global). Agotar tiempo no oculta el puntaje.
    const parcial = !(resultado && resultado.global != null);
    hoja(resultado, parcial);
    window.isExamActive = false;
    pintar();
    cerrandoSimulacro = false;
  }

  async function montarDesdeDato(dato, lista) {
    const guardados = Array.isArray(dato.reactivos) ? dato.reactivos : [];
    const mapa = guardados.length ? new Map(guardados.map((item) => [String(item.id), item])) : mapaBanco(lista || []);
    const mision = misionDesde(dato, mapa);
    if (!mision.reactivos.length) {
      mostrarNota('No pude abrir el guardado', 'Las preguntas de este simulacro no están en el banco de este aparato.', [
        { texto: 'Volver', alClick: cerrarNota }
      ]);
      return false;
    }
    entrarWorkspace(mision);
    return true;
  }

  async function iniciarNuevoTrasBriefing() {
    const lista = await banco();
    const semilla = (Date.now() ^ 0xD4E705) >>> 0;
    let nuevo = alcanza(lista) ? armar(lista, semilla) : null;
    if (!nuevo) {
      const delServidor = await pedirAlServidor(semilla);
      if (delServidor) nuevo = { ids: delServidor.map((item) => item.id), reactivos: delServidor };
    }
    if (!nuevo) {
      mostrarNota('Todavía no', 'El banco no alcanza para las cinco áreas del cuadernillo. No voy a inventar las que faltan.', [
        { texto: 'Volver', alClick: cerrarNota }
      ]);
      return;
    }
    const anterior = leer();
    const dato = {
      id: 'sim_' + Date.now(),
      estado: 'abierto',
      sesion: 1,
      restanteMs: TIEMPO_MS,
      indice: 0,
      ids: nuevo.ids,
      reactivos: nuevo.reactivos,
      respuestas: [],
      puenteVisto: false,
      resultado: null,
      informeAnterior: anterior && anterior.resultado ? anterior.resultado : null
    };
    guardar(dato);
    entrarWorkspace(misionDesde(dato, new Map(nuevo.reactivos.map((item) => [String(item.id), item]))));
  }

  async function abrir() {
    let dato = leer();
    if (dato && dato.estado === 'abierto') {
      const lista = await banco();
      await montarDesdeDato(dato, lista);
      return;
    }
    if ((dato && dato.estado === 'listo' && dato.resultado) || leerInforme()) {
      menuResultadoListo();
      return;
    }
    mostrarBriefing();
  }

  function alEntrar(ws) {
    const dato = leer();
    if (!dato || !ws) return;
    if (Array.isArray(dato.respuestas) && dato.respuestas.length && (!ws.respuestasSesionActiva || !ws.respuestasSesionActiva.length)) {
      ws.respuestasSesionActiva = dato.respuestas.slice();
    }
    document.documentElement.classList.add('sim-sin-pista');
    document.documentElement.classList.remove('diag-sin-pista');
    if (dato.pausado_en) {
      dato.pausado_en = null;
      guardar(dato);
    }
    arrancarReloj();
    // Checkpoint ligero al entrar (por si el dispositivo se cierra después).
    enviarCheckpoint(dato);
  }

  window.DanteSimulacro = {
    abrir: abrir,
    pintar: pintar,
    guardarParcial: guardarParcial,
    alPausar: alPausar,
    antesDePregunta: antesDePregunta,
    alTerminarPreguntas: alTerminarPreguntas,
    alEntrar: alEntrar,
    etiqueta: etiqueta,
    total: TOTAL,
    tiempoMsSesion: TIEMPO_MS,
    sincronizarDesdeServidor: sincronizarDesdeServidor,
    aceptarBriefing: aceptarBriefing,
    cerrarBriefing: cerrarBriefing,
    verInforme: verInforme
  };

  document.addEventListener('DOMContentLoaded', () => {
    sincronizarDesdeServidor().finally(pintar);
  });

  // Fase 4 — autosave + pausa de reloj al ocultar pestaña; reanuda al volver.
  document.addEventListener('visibilitychange', () => {
    const ws = window.DanteExamWorkspace;
    if (!ws || !ws.misionData || !ws.misionData.esSimulacro) return;
    if (document.visibilityState === 'hidden') {
      pararReloj();
      guardarParcial(ws);
      const dato = leer();
      if (dato && dato.estado === 'abierto') enviarCheckpoint(dato);
    } else if (document.visibilityState === 'visible') {
      const dato = leer();
      if (dato && dato.estado === 'abierto' && window.isExamActive) arrancarReloj();
    }
  });
  window.addEventListener('pagehide', () => {
    const ws = window.DanteExamWorkspace;
    if (ws && ws.misionData && ws.misionData.esSimulacro) {
      pararReloj();
      guardarParcial(ws);
    }
  });
})();
