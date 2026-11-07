/**
 * Plan de esta app: solo Saber 11°.
 * Todos tienen las mismas 5 ayudas pedagógicas por bloque de 10.
 * Gratis: anuncio al entrar a cada bloque.
 * Pago (Play / App Store / web): solo quita la publicidad.
 * Entre un bloque de 10 y el siguiente hay 15 minutos. El refuerzo de 5 usa 13 minutos de espera.
 */
(function () {
  const OFERTA_KEY = 'dante_oferta_vista';
  const AYUDA_KEY = 'dante_ayudas_usadas';
  const TOPE_AYUDAS_BLOQUE = 5;

  function hoy() {
    return new Date().toISOString().slice(0, 10);
  }

  function esPago() {
    try {
      if (window.CapacidadDiariaManager && typeof CapacidadDiariaManager.isPro === 'function') {
        return CapacidadDiariaManager.isPro();
      }
    } catch (e) {}
    const plan = String(localStorage.getItem('dante_plan') || localStorage.getItem('dante_user_plan') || '').toUpperCase();
    return plan.includes('PRO') || plan.includes('SUPER') || plan.includes('MASTER') || plan.includes('SIN_ADS') || plan.includes('NO_ADS');
  }

  function quitarPreuniversitario() {
    ['modalPreunROICognitivo', 'optMeta_PREUNIVESITARIO', 'optCal_UNAL_UDEA', 'bannerCrossSellUNAL'].forEach((id) => {
      const nodo = document.getElementById(id);
      if (nodo) nodo.remove();
    });
    document.querySelectorAll('[onclick*="UNAL_UDEA"], [onclick*="PREUNIVESITARIO"], [onclick*="iniciarExamenUnal"]').forEach((nodo) => {
      nodo.remove();
    });
  }

  function marcarOfertaVista() {
    try { localStorage.setItem(OFERTA_KEY, hoy()); } catch (e) {}
  }

  function ofrecerAlEntrar() {
    if (esPago()) return;
    let vista = '';
    try { vista = localStorage.getItem(OFERTA_KEY) || ''; } catch (e) {}
    if (vista === hoy()) return;
    if (!window.PaywallManager || typeof PaywallManager.abrirModalContextual !== 'function') return;
    PaywallManager.abrirModalContextual('ENTRADA_SALA');
    marcarOfertaVista();
  }

  function antesDelBloque(seguir, rotulo) {
    if (typeof seguir !== 'function') return;
    if (esPago()) {
      seguir();
      return;
    }
    // Anuncios de tienda (AdMob Play/App Store). Web: modal de pausa.
    if (window.DanteAds && typeof window.DanteAds.mostrarEntreBloques === 'function') {
      window.DanteAds.mostrarEntreBloques(seguir, rotulo || 'Empezar el bloque');
      return;
    }
    const modal = document.getElementById('modalAnuncioEntreTests');
    const btn = document.getElementById('btnCerrarAnuncioEntreTests');
    if (!modal || !btn) {
      seguir();
      return;
    }
    const etiqueta = rotulo || 'Empezar el bloque';
    let listo = false;
    const cerrar = () => {
      if (listo) return;
      listo = true;
      modal.style.display = 'none';
      seguir();
    };
    btn.disabled = true;
    btn.textContent = 'Cargando anuncio de la tienda…';
    modal.style.display = 'flex';
    window.setTimeout(() => {
      btn.disabled = false;
      btn.textContent = etiqueta;
      btn.onclick = cerrar;
    }, 2500);
  }

  function reiniciarAyudaSesion() {
    try { sessionStorage.setItem(AYUDA_KEY, '0'); } catch (e) {}
  }

  function topeAyuda() {
    return TOPE_AYUDAS_BLOQUE;
  }

  function ayudasUsadas() {
    try { return parseInt(sessionStorage.getItem(AYUDA_KEY) || '0', 10) || 0; } catch (e) { return 0; }
  }

  function ayudaDisponible() {
    return ayudasUsadas() < topeAyuda();
  }

  function marcarAyudaUsada() {
    try { sessionStorage.setItem(AYUDA_KEY, String(ayudasUsadas() + 1)); } catch (e) {}
  }

  function avisoSinAyuda() {
    return 'En este bloque ya usaste las cinco ayudas. Es el tope pedagógico: así no dependes de la pista y entrenas de verdad.';
  }

  function fraseDe(area, tema) {
    const limpio = String(tema || '').replace(/_/g, ' ').trim();
    if (limpio && limpio.length > 3 && !/general|razonamiento/i.test(limpio)) {
      return 'Repasa ' + limpio + '. En el siguiente bloque pueden volver preguntas de ese tema.';
    }
    const clave = String(area || '').toLowerCase();
    if (clave.includes('mate')) return 'Repasa la operación que fallaste: raíz, proporción o el gráfico. En el siguiente bloque pueden volver preguntas de ese tema.';
    if (clave.includes('lect') || clave.includes('crit')) return 'Vuelve a lo que la pregunta pedía, no a la frase que sonaba cierta. Más adelante salen lecturas parecidas.';
    if (clave.includes('social') || clave.includes('ciudad')) return 'Repasa el artículo o el hecho que confundiste. En sociales suelen volver la Constitución y la causa del cambio.';
    if (clave.includes('natur') || clave.includes('cien')) return 'Repasa la variable del experimento y la evidencia que la sostiene. En el siguiente bloque pueden volver preguntas de ese tema.';
    if (clave.includes('ingl')) return 'Repasa el conector y la idea del párrafo. En el siguiente bloque el inglés vuelve a pedir eso.';
    return 'Repasa el tema de la pregunta que fallaste. En el siguiente bloque puede salir otra vez.';
  }

  function tareaDesde(respuestas) {
    const lista = Array.isArray(respuestas) ? respuestas : Object.values(respuestas || {});
    const fallos = lista.filter((r) => r && r.correcto === false);
    if (!fallos.length) {
      return ['Este bloque salió bien. El siguiente sigue en las cinco áreas de Saber 11°.'];
    }
    const vistos = [];
    const frases = [];
    fallos.forEach((r) => {
      const area = String(r.materia || r.area || '');
      const tema = r.tema || r.competencia || r.componente || '';
      const firma = area + '|' + tema;
      if (vistos.indexOf(firma) !== -1) return;
      vistos.push(firma);
      if (frases.length < 2) frases.push(fraseDe(area, tema));
    });
    return frases.length ? frases : ['Repasa el tema de la pregunta que fallaste. En el siguiente bloque puede salir otra vez.'];
  }

  function pintarTarea(contenedor, respuestas) {
    if (!contenedor) return;
    const frases = tareaDesde(respuestas);
    const html = '<section class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-left space-y-1.5">'
      + '<p class="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">Tarea para el siguiente bloque</p>'
      + frases.map((f) => '<p class="text-xs text-slate-100 font-sans leading-relaxed">' + f + '</p>').join('')
      + '</section>';
    const hueco = contenedor.querySelector('#danteTareaEstudioDiag');
    if (hueco) hueco.innerHTML = html;
    else contenedor.insertAdjacentHTML('beforeend', html);
  }

  window.DantePlanSala = {
    esPago: esPago,
    ofrecerAlEntrar: ofrecerAlEntrar,
    antesDelBloque: antesDelBloque,
    reiniciarAyudaSesion: reiniciarAyudaSesion,
    puedePedirAyuda: ayudaDisponible,
    marcarAyudaUsada: marcarAyudaUsada,
    avisoSinAyuda: avisoSinAyuda,
    pintarTarea: pintarTarea,
    quitarPreuniversitario: quitarPreuniversitario,
    topeAyuda: topeAyuda
  };

  function arrancar() {
    quitarPreuniversitario();
    let intentos = 0;
    const reloj = window.setInterval(() => {
      intentos += 1;
      if (window.PaywallManager && typeof PaywallManager.abrirModalContextual === 'function') {
        window.clearInterval(reloj);
        ofrecerAlEntrar();
      } else if (intentos > 80) {
        window.clearInterval(reloj);
      }
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
  window.addEventListener('load', ofrecerAlEntrar);
})();
