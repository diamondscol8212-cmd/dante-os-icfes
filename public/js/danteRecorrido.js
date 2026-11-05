/**
 * Sala: varios bloques, espera de 15 minutos, una tarea de 5 y la medalla.
 * El primer bloque del día llena 10%, el segundo 5%, cada refuerzo 5% hasta dos.
 */
(function () {
  const KEY = 'dante_recorrido';
  const ESPERA_MS = 15 * 60 * 1000;
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

  function segundos() {
    const hasta = Date.parse(leer().esperaHasta || '');
    if (!Number.isFinite(hasta)) return 0;
    return Math.max(0, Math.ceil((hasta - Date.now()) / 1000));
  }

  function bloqueado() {
    return segundos() > 0;
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

  function cerrarBloque(respuestas, misionId) {
    const estado = leer();
    if (misionId && estado.ultimoBloqueId === misionId) return estado;
    estado.ultimoBloqueId = misionId || String(Date.now());
    estado.esperaHasta = new Date(Date.now() + ESPERA_MS).toISOString();
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
    estado.esperaHasta = new Date(Date.now() + ESPERA_MS).toISOString();
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
    let bloqueAMedias = false;
    try {
      const pausa = JSON.parse(localStorage.getItem('dante_sesion_pausada') || 'null');
      bloqueAMedias = Boolean(pausa && pausa.misionData);
    } catch (e) { bloqueAMedias = false; }
    if (!area || !window.DanteHubEngine || bloqueAMedias || abriendoRefuerzo || bloqueado()) return;
    abriendoRefuerzo = true;
    const tarjeta = document.getElementById('tarjetaTareaSala');
    const btn = document.getElementById('btnAbrirRefuerzo');
    if (tarjeta) tarjeta.dataset.firma = 'abriendo';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Abriendo el refuerzo…';
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
    let bloqueAMedias = false;
    try {
      const pausa = JSON.parse(localStorage.getItem('dante_sesion_pausada') || 'null');
      bloqueAMedias = Boolean(pausa && pausa.misionData);
    } catch (e) { bloqueAMedias = false; }
    if (tarjeta) {
      if (estado.tarea && estado.tarea.nombre && !bloqueAMedias) {
        const faltaTarjeta = segundos();
        const firma = estado.tarea.nombre + '|' + (faltaTarjeta > 0 ? 'espera' : 'libre');
        tarjeta.hidden = false;
        if (tarjeta.dataset.firma !== firma && tarjeta.dataset.firma !== 'abriendo') {
          tarjeta.dataset.firma = firma;
          const esperaTxt = faltaTarjeta > 0
            ? '<button type="button" id="btnAbrirRefuerzo" class="sala-refuerzo-btn en-espera mt-0 w-full"><span class="sala-cta-ico" aria-hidden="true"><i class="fa-regular fa-clock"></i></span><span>Refuerzo en espera</span><span class="sala-refuerzo-meta">Abre a las ' + reloj(faltaTarjeta) + '</span></button>'
            : '<button type="button" id="btnAbrirRefuerzo" class="sala-refuerzo-btn mt-0 w-full"><span class="sala-cta-ico" aria-hidden="true"><i class="fa-solid fa-arrow-trend-up"></i></span><span>Refuerzo · 5 preguntas</span></button>';
          tarjeta.innerHTML = '<p class="text-[11px] text-slate-400">Tu refuerzo</p>'
            + '<p class="text-sm text-white font-semibold">' + estado.tarea.nombre + ' · 5 preguntas</p>'
            + esperaTxt;
          const btn = document.getElementById('btnAbrirRefuerzo');
          if (btn) btn.onclick = faltaTarjeta > 0 ? decirEspera : abrirRefuerzo;
        } else if (faltaTarjeta > 0) {
          const btn = document.getElementById('btnAbrirRefuerzo');
          const meta = btn && btn.querySelector('.sala-refuerzo-meta');
          if (meta) meta.textContent = 'Abre a las ' + reloj(faltaTarjeta);
          else if (btn) btn.textContent = 'Abre a las ' + reloj(faltaTarjeta);
        }
      } else {
        tarjeta.hidden = true;
        tarjeta.innerHTML = '';
        tarjeta.dataset.firma = '';
      }
    }

    const falta = segundos();
    const prompt = document.getElementById('txtScanPrompt');
    const sub = document.getElementById('txtScanSubprompt');
    const boton = document.getElementById('btnIniciarMisionUnificado');
    if (falta > 0 && !bloqueAMedias && prompt && sub) {
      prompt.textContent = 'Próximo bloque';
      sub.textContent = 'Abre a las ' + reloj(falta);
      if (boton) boton.classList.add('btn-espera');
    } else if (boton) {
      boton.classList.remove('btn-espera');
    }
    const nota = document.getElementById('notaEspera');
    const relojNota = document.getElementById('txtNotaEsperaReloj');
    if (nota && !nota.hidden) {
      if (falta <= 0) nota.hidden = true;
      else if (relojNota) relojNota.textContent = reloj(falta);
    }
  }

  function decirEspera() {
    if (!bloqueado()) return;
    const nota = document.getElementById('notaEspera');
    const relojNota = document.getElementById('txtNotaEsperaReloj');
    if (!nota) return;
    if (relojNota) relojNota.textContent = reloj(segundos());
    nota.hidden = false;
  }

  function cerrarEspera() {
    const nota = document.getElementById('notaEspera');
    if (nota) nota.hidden = true;
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
      const remotoGana =
        (remoto.medallas || 0) > (local.medallas || 0) ||
        ((remoto.medallas || 0) === (local.medallas || 0) && (remoto.puntos || 0) > (local.puntos || 0));
      if (!remotoGana && !remotoEspera) return;
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
      // Nunca borrar una espera local vigente por un remoto viejo o vacío.
      const tLocal = localEspera ? Date.parse(localEspera) : 0;
      const tRemoto = remotoEspera ? Date.parse(remotoEspera) : 0;
      mezcla.esperaHasta = tLocal >= tRemoto ? (localEspera || remotoEspera) : (remotoEspera || localEspera);
      if (local.ultimoBloqueId) mezcla.ultimoBloqueId = local.ultimoBloqueId;
      try { localStorage.setItem(KEY, JSON.stringify(mezcla)); } catch (e) {}
      pintar();
    }).catch(() => {});
  }

  window.DanteRecorrido = {
    leer: leer,
    bloqueado: bloqueado,
    segundos: segundos,
    cerrarBloque: cerrarBloque,
    cerrarRefuerzo: cerrarRefuerzo,
    abrirRefuerzo: abrirRefuerzo,
    decirEspera: decirEspera,
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
