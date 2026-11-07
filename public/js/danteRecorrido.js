/**
 * Sala: bloques de entrenamiento, espera, refuerzo de 5 y medalla.
 * Bloque → espera 15 min. Refuerzo de 5 → espera 13 min (15 − 2).
 */
(function () {
  const KEY = 'dante_recorrido';
  const ESPERA_BLOQUE_MS = 15 * 60 * 1000;
  const ESPERA_REFUERZO_MS = 13 * 60 * 1000; // refuerzo 5 preguntas: 2 min menos
  const NOMBRES = {
    matematicas: 'Matemáticas',
    lectura_critica: 'Lectura crítica',
    ciencias_naturales: 'Ciencias',
    sociales_ciudadanas: 'Sociales',
    ingles: 'Inglés'
  };

  function hoy() {
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date());
  }

  function vacio() {
    return {
      nivel: 1,
      puntos: 0,
      medallas: 0,
      esperaHasta: null,
      esperaRefuerzoHasta: null,
      dia: hoy(),
      bloquesHoy: 0,
      refuerzosHoy: 0,
      tarea: null,
      aviso: ''
    };
  }

  function alumno() {
    return String(
      localStorage.getItem('dante_active_student')
      || localStorage.getItem('dante_student_id')
      || ''
    ).split('@')[0];
  }

  function leer() {
    let estado = vacio();
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object') estado = Object.assign(vacio(), raw);
    } catch (e) {}
    if (estado.dia !== hoy()) {
      estado.dia = hoy();
      estado.bloquesHoy = 0;
      estado.refuerzosHoy = 0;
    }
    // Migración: si solo existe esperaHasta, el refuerzo hereda ese reloj.
    if (!estado.esperaRefuerzoHasta && estado.esperaHasta) {
      estado.esperaRefuerzoHasta = estado.esperaHasta;
    }
    return estado;
  }

  function guardar(estado) {
    try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch (e) {}
    sincronizar(estado);
    pintar();
  }

  function subir(estado, cantidad) {
    estado.puntos += cantidad;
    estado.aviso = '';
    if (estado.puntos >= 100) {
      estado.puntos -= 100;
      estado.medallas += 1;
      estado.nivel = estado.medallas + 1;
      estado.aviso = 'Medalla del nivel ' + estado.medallas;
    }
  }

  function segundosHasta(iso) {
    const hasta = Date.parse(iso || '');
    if (!Number.isFinite(hasta)) return 0;
    return Math.max(0, Math.ceil((hasta - Date.now()) / 1000));
  }

  function segundos() {
    return segundosHasta(leer().esperaHasta);
  }

  function segundosRefuerzo() {
    const e = leer();
    return segundosHasta(e.esperaRefuerzoHasta || e.esperaHasta);
  }

  function bloqueado() {
    return segundos() > 0;
  }

  function bloqueadoRefuerzo() {
    return segundosRefuerzo() > 0;
  }

  function reloj(seg) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return String(m) + ':' + String(s).padStart(2, '0');
  }

  function areaDe(fila) {
    const texto = String((fila && (fila.materia || fila.area)) || '').toLowerCase();
    if (texto.includes('mate')) return 'matematicas';
    if (texto.includes('lect') || texto.includes('crit')) return 'lectura_critica';
    if (texto.includes('soci') || texto.includes('ciudad')) return 'sociales_ciudadanas';
    if (texto.includes('cien') || texto.includes('natur') || texto.includes('bio') || texto.includes('fis') || texto.includes('quim')) return 'ciencias_naturales';
    if (texto.includes('ingl') || texto.includes('english')) return 'ingles';
    return '';
  }

  function tareaDesde(respuestas) {
    const lista = Array.isArray(respuestas) ? respuestas : Object.values(respuestas || {});
    const cuenta = {};
    lista.forEach((fila) => {
      if (!fila || fila.correcto !== false) return;
      const area = areaDe(fila);
      if (!area) return;
      cuenta[area] = (cuenta[area] || 0) + 1;
    });
    let mejor = '';
    let max = 0;
    Object.keys(cuenta).forEach((area) => {
      if (cuenta[area] > max) {
        max = cuenta[area];
        mejor = area;
      }
    });
    if (!mejor) return null;
    return { area: mejor, nombre: NOMBRES[mejor] || mejor, hecha: false };
  }

  function hayBloqueAMedias() {
    try {
      const pausa = JSON.parse(localStorage.getItem('dante_sesion_pausada') || 'null');
      return Boolean(pausa && pausa.misionData);
    } catch (e) {
      return false;
    }
  }

  function cerrarBloque(respuestas, misionId) {
    const estado = leer();
    if (misionId && estado.ultimoBloqueId === misionId) return estado;
    estado.ultimoBloqueId = misionId || String(Date.now());
    const finBloque = new Date(Date.now() + ESPERA_BLOQUE_MS).toISOString();
    const finRefuerzo = new Date(Date.now() + ESPERA_REFUERZO_MS).toISOString();
    estado.esperaHasta = finBloque;
    estado.esperaRefuerzoHasta = finRefuerzo;
    if (estado.bloquesHoy === 0) subir(estado, 10);
    else if (estado.bloquesHoy === 1) subir(estado, 5);
    estado.bloquesHoy = Math.min(2, estado.bloquesHoy + 1);
    const tarea = tareaDesde(respuestas);
    if (tarea) estado.tarea = tarea;
    guardar(estado);
    return estado;
  }

  function cerrarRefuerzo(misionId) {
    const estado = leer();
    if (misionId && estado.ultimoRefuerzoId === misionId) return estado;
    estado.ultimoRefuerzoId = misionId || String(Date.now());
    estado.esperaRefuerzoHasta = new Date(Date.now() + ESPERA_REFUERZO_MS).toISOString();
    if (estado.refuerzosHoy < 2) subir(estado, 5);
    estado.refuerzosHoy = Math.min(2, estado.refuerzosHoy + 1);
    estado.tarea = null;
    guardar(estado);
    if (window.DanteHubEngine) window.DanteHubEngine._refuerzoArea = null;
    return estado;
  }

  let abriendoRefuerzo = false;

  function abrirRefuerzo() {
    const estado = leer();
    const area = estado.tarea && estado.tarea.area;
    const bloqueAMedias = hayBloqueAMedias();
    if (!area) {
      decirSinTarea();
      return;
    }
    if (bloqueAMedias) {
      decirPausaActiva();
      return;
    }
    if (bloqueadoRefuerzo()) {
      decirEsperaRefuerzo();
      return;
    }
    if (!window.DanteHubEngine || abriendoRefuerzo) return;
    abriendoRefuerzo = true;
    const tarjeta = document.getElementById('tarjetaTareaSala');
    const btn = document.getElementById('btnAbrirRefuerzo');
    if (tarjeta) tarjeta.dataset.firma = 'abriendo';
    if (btn) {
      btn.disabled = true;
      const sub = btn.querySelector('#txtRefuerzoSubprompt');
      if (sub) sub.textContent = 'Abriendo…';
    }
    window.setTimeout(() => {
      abriendoRefuerzo = false;
      const caja = document.getElementById('tarjetaTareaSala');
      if (caja && caja.dataset.firma === 'abriendo') caja.dataset.firma = '';
      pintar();
    }, 8000);
    window.DanteHubEngine._refuerzoArea = area;
    window.DanteHubEngine.misionActual = null;
    window.DanteHubEngine.pendingStartAfterFetch = true;
    try { sessionStorage.removeItem('dante_mision_actual'); } catch (e) {}
    window.DanteHubEngine.consultarMisionDiaria();
  }

  function mostrarNotaSala(opts) {
    const nota = document.getElementById('notaEspera');
    if (!nota) return;
    const relojNota = document.getElementById('txtNotaEsperaReloj');
    const kicker = document.getElementById('notaEsperaKicker');
    const titulo = document.getElementById('notaEsperaTitulo');
    const cuerpo = document.getElementById('notaEsperaCuerpo');
    const cajaReloj = document.getElementById('notaEsperaRelojBox');
    if (cajaReloj) cajaReloj.hidden = !opts.mostrarReloj;
    if (relojNota && opts.reloj) relojNota.textContent = opts.reloj;
    if (kicker) kicker.textContent = opts.kicker || '';
    if (titulo) titulo.textContent = opts.titulo || '';
    if (cuerpo) cuerpo.innerHTML = opts.cuerpoHtml || '';
    nota.hidden = false;
  }

  function decirEspera() {
    // Espera del bloque principal (entrenamiento).
    if (!bloqueado()) return;
    const seg = segundos();
    mostrarNotaSala({
      mostrarReloj: true,
      reloj: reloj(seg),
      kicker: 'Descanso del entrenamiento',
      titulo: 'El próximo bloque aún no está listo',
      cuerpoHtml:
        '<p>Entre un entrenamiento y el siguiente hay <strong>15 minutos</strong> de descanso.</p>'
        + '<p>Faltan <strong>' + reloj(seg) + '</strong>. Cuando el reloj llegue a cero, puedes abrir el siguiente bloque.</p>'
    });
  }

  function decirEsperaRefuerzo() {
    const seg = segundosRefuerzo();
    if (seg <= 0) return;
    const estado = leer();
    const area = estado.tarea && estado.tarea.nombre ? (' de ' + estado.tarea.nombre) : '';
    mostrarNotaSala({
      mostrarReloj: true,
      reloj: reloj(seg),
      kicker: 'Refuerzo en pausa',
      titulo: 'El refuerzo de 5 preguntas estará disponible pronto',
      cuerpoHtml:
        '<p>Después de un bloque o de un refuerzo hay un descanso corto.</p>'
        + '<p>Tu refuerzo' + area + ' se abre en <strong>' + reloj(seg) + '</strong>.</p>'
        + '<p>Mientras tanto puedes revisar tu sala o tu proyección.</p>'
    });
  }

  function decirSinTarea() {
    mostrarNotaSala({
      mostrarReloj: false,
      kicker: 'Refuerzo no disponible',
      titulo: 'Todavía no hay un refuerzo para ti',
      cuerpoHtml:
        '<p>El <strong>Refuerzo · 5 preguntas</strong> se arma cuando terminas un entrenamiento y fallas alguna pregunta.</p>'
        + '<p>Haz primero tu bloque de entrenamiento. Si fallas algo, aquí aparecerá el área a reforzar y podrás abrirlo.</p>'
    });
  }

  function decirPausaActiva() {
    mostrarNotaSala({
      mostrarReloj: false,
      kicker: 'Sesión en pausa',
      titulo: 'Primero termina o cierra lo que dejaste a medias',
      cuerpoHtml:
        '<p>Tienes un entrenamiento o una prueba pausada. Termínala o vuelve a ella desde la sala antes de abrir el refuerzo.</p>'
    });
  }

  function cerrarEspera() {
    const nota = document.getElementById('notaEspera');
    if (nota) nota.hidden = true;
  }

  function pintar() {
    const estado = leer();
    const barra = document.getElementById('barraMedallaSala');
    const fill = document.getElementById('fillMedalla');
    const nivel = document.getElementById('lblNivelMedalla');
    const medalla = document.getElementById('medallaFin');
    const aviso = document.getElementById('avisoMedalla');
    if (nivel) nivel.textContent = 'Nivel ' + estado.nivel;
    if (fill) fill.style.width = Math.max(0, Math.min(100, estado.puntos)) + '%';
    if (medalla) medalla.classList.toggle('medalla-lista', estado.puntos >= 90);
    if (aviso) aviso.textContent = estado.aviso || '';
    if (barra) barra.hidden = false;

    const tarjeta = document.getElementById('tarjetaTareaSala');
    const bloqueAMedias = hayBloqueAMedias();
    if (tarjeta) {
      tarjeta.hidden = false;
      const faltaRef = segundosRefuerzo();
      const tieneTarea = Boolean(estado.tarea && estado.tarea.nombre && !bloqueAMedias);
      let modo = 'sin-tarea';
      if (bloqueAMedias) modo = 'pausa';
      else if (tieneTarea && faltaRef > 0) modo = 'espera';
      else if (tieneTarea) modo = 'listo';

      const firma = modo + '|' + (estado.tarea && estado.tarea.nombre || '') + '|' + (modo === 'espera' ? Math.floor(faltaRef / 5) : '0');
      if (tarjeta.dataset.firma !== firma && tarjeta.dataset.firma !== 'abriendo') {
        tarjeta.dataset.firma = firma;
        let sub = '';
        let clases = 'sala-refuerzo-btn mt-0 w-full relative overflow-hidden';
        let dataModo = modo;
        if (modo === 'sin-tarea') {
          clases += ' sin-tarea';
          sub = 'Termina un entrenamiento primero';
        } else if (modo === 'pausa') {
          clases += ' sin-tarea';
          sub = 'Cierra primero la sesión en pausa';
          dataModo = 'pausa';
        } else if (modo === 'espera') {
          clases += ' en-espera btn-espera';
          sub = 'Disponible en ' + reloj(faltaRef);
        } else {
          sub = 'Mantén presionado · ' + (estado.tarea.nombre || '5 preguntas');
        }
        tarjeta.innerHTML = ''
          + '<button type="button" id="btnAbrirRefuerzo" class="' + clases + '" data-refuerzo-modo="' + dataModo + '">'
          + '<div id="btnHoldProgressFillRefuerzo" class="absolute left-0 bottom-0 pointer-events-none" style="width:0%;"></div>'
          + '<span class="relative z-10 flex flex-row items-center justify-between gap-2 w-full">'
          + '<span class="sala-cta-dot" aria-hidden="true"></span>'
          + '<span class="flex flex-col items-start justify-center gap-0.5 min-w-0 flex-1 text-left">'
          + '<span>Refuerzo · 5 preguntas</span>'
          + '<span id="txtRefuerzoSubprompt" class="text-[11px] ' + (modo === 'listo' ? 'sala-refuerzo-hold' : 'sala-refuerzo-meta') + '">' + sub + '</span>'
          + '</span>'
          + '<span class="sala-cta-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>'
          + '</span></button>';
      } else if (modo === 'espera') {
        const meta = document.getElementById('txtRefuerzoSubprompt');
        if (meta) meta.textContent = 'Disponible en ' + reloj(faltaRef);
      }
    }

    const falta = segundos();
    const prompt = document.getElementById('txtScanPrompt');
    const sub = document.getElementById('txtScanSubprompt');
    const boton = document.getElementById('btnIniciarMisionUnificado');
    if (falta > 0 && !bloqueAMedias && prompt && sub) {
      prompt.textContent = 'Próximo bloque';
      sub.textContent = 'Disponible en ' + reloj(falta);
      if (boton) boton.classList.add('btn-espera');
    } else if (boton) {
      boton.classList.remove('btn-espera');
    }

    const nota = document.getElementById('notaEspera');
    const relojNota = document.getElementById('txtNotaEsperaReloj');
    if (nota && !nota.hidden && relojNota && !document.getElementById('notaEsperaRelojBox').hidden) {
      const segNota = bloqueadoRefuerzo() && !bloqueado() ? segundosRefuerzo() : segundos();
      if (segNota <= 0 && !bloqueado() && !bloqueadoRefuerzo()) nota.hidden = true;
      else relojNota.textContent = reloj(Math.max(segundos(), segundosRefuerzo()));
    }
  }

  function sincronizar(estado) {
    const id = alumno();
    if (!id) return;
    const cuerpo = JSON.stringify({ studentId: id, estado: estado });
    fetch('/api/dante/recorrido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-student-id': id },
      body: cuerpo
    }).catch(() => {});
  }

  function esperaVigente(valor) {
    const hasta = Date.parse(valor || '');
    return Number.isFinite(hasta) && hasta > Date.now() ? new Date(hasta).toISOString() : null;
  }

  function traer() {
    const id = alumno();
    if (!id) return;
    fetch('/api/dante/recorrido?studentId=' + encodeURIComponent(id), {
      headers: { 'x-student-id': id }
    }).then((res) => res.json()).then((data) => {
      if (!data || !data.ok || !data.estado) return;
      const local = leer();
      const remoto = data.estado;
      const localEspera = esperaVigente(local.esperaHasta);
      const remotoEspera = esperaVigente(remoto.esperaHasta);
      const localRef = esperaVigente(local.esperaRefuerzoHasta);
      const remotoRef = esperaVigente(remoto.esperaRefuerzoHasta);
      const remotoGana =
        (remoto.medallas || 0) > (local.medallas || 0) ||
        ((remoto.medallas || 0) === (local.medallas || 0) && (remoto.puntos || 0) > (local.puntos || 0));
      if (!remotoGana && !remotoEspera && !remotoRef) return;
      const mezcla = Object.assign(vacio(), remotoGana ? remoto : local);
      mezcla.dia = hoy();
      if (remotoGana && remoto.dia === hoy()) {
        mezcla.bloquesHoy = remoto.bloquesHoy || 0;
        mezcla.refuerzosHoy = remoto.refuerzosHoy || 0;
        mezcla.tarea = remoto.tarea || local.tarea || null;
      } else {
        mezcla.bloquesHoy = local.bloquesHoy || 0;
        mezcla.refuerzosHoy = local.refuerzosHoy || 0;
        mezcla.tarea = local.tarea || remoto.tarea || null;
      }
      const tLocal = localEspera ? Date.parse(localEspera) : 0;
      const tRemoto = remotoEspera ? Date.parse(remotoEspera) : 0;
      mezcla.esperaHasta = tLocal >= tRemoto ? (localEspera || remotoEspera) : (remotoEspera || localEspera);
      const tLocalR = localRef ? Date.parse(localRef) : 0;
      const tRemotoR = remotoRef ? Date.parse(remotoRef) : 0;
      mezcla.esperaRefuerzoHasta = tLocalR >= tRemotoR ? (localRef || remotoRef) : (remotoRef || localRef);
      if (local.ultimoBloqueId) mezcla.ultimoBloqueId = local.ultimoBloqueId;
      try { localStorage.setItem(KEY, JSON.stringify(mezcla)); } catch (e) {}
      pintar();
    }).catch(() => {});
  }

  window.DanteRecorrido = {
    leer: leer,
    bloqueado: bloqueado,
    bloqueadoRefuerzo: bloqueadoRefuerzo,
    segundos: segundos,
    segundosRefuerzo: segundosRefuerzo,
    cerrarBloque: cerrarBloque,
    cerrarRefuerzo: cerrarRefuerzo,
    abrirRefuerzo: abrirRefuerzo,
    decirEspera: decirEspera,
    decirEsperaRefuerzo: decirEsperaRefuerzo,
    decirSinTarea: decirSinTarea,
    decirPausaActiva: decirPausaActiva,
    cerrarEspera: cerrarEspera,
    pintar: pintar
  };

  function arrancar() {
    pintar();
    traer();
    window.setInterval(pintar, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
