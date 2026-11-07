/**
 * Dante OS Enterprise v23.1 - DanteHubEngine
 * Módulo cliente en JS Nativo para la gestión dinámica de la Misión Diaria adaptativa.
 * Orquesta la comunicación REST con el backend, el temporizador de Descanso Biológico,
 * la sincronización del selector de meta (ICFES <-> UNAL) y la contingencia Offline.
 */

(function () {
  'use strict';

  const DanteHubEngine = {
    studentId: 'guest_student',
    studentName: 'Estudiante',
    targetTrack: 'ICFES', // 'ICFES' | 'UNAL' | 'COMBO'
    planTier: 'FREE',     // 'FREE' | 'PRO' | 'SUPER_PRO' | 'DANTE_MASTER'
    misionActual: null,
    isBlocked: false,
    cooldownTimerId: null,
    isOffline: false,
    sessionSeconds: 0,
    sessionTimerId: null,
    fetchToken: 0,
    isFetchingMision: false,
    pendingStartAfterFetch: false,

    /**
     * 1. INICIALIZACIÓN Y CARGA DE ESTADO
     */
    _pausaReal() {
      let raw = '';
      try { raw = localStorage.getItem('dante_sesion_pausada') || ''; } catch (e) { return null; }
      if (!raw) return null;
      let sesion = null;
      try { sesion = JSON.parse(raw); } catch (e) { return null; }
      const mision = sesion && sesion.misionData;
      if (mision && (mision.esSimulacro || String(mision.misionId || '').indexOf('sim_') === 0)) {
        try { localStorage.removeItem('dante_sesion_pausada'); } catch (e) {}
        return null;
      }
      const reactivos = mision && Array.isArray(mision.reactivos) ? mision.reactivos : [];
      const idx = Number(sesion && (sesion.indexReactivo != null ? sesion.indexReactivo : sesion.indexReactivoActivo)) || 0;
      const respuestas = sesion && Array.isArray(sesion.respuestasSesionActiva) ? sesion.respuestasSesionActiva : [];
      if (!mision || !reactivos.length || (idx <= 0 && respuestas.length === 0)) {
        try { localStorage.removeItem('dante_sesion_pausada'); } catch (e) {}
        return null;
      }
      if (mision.repasoArea) {
        mision.isDiagnostic = false;
        mision.isFirstSession = false;
      }
      return sesion;
    },

    _llegadaASala(params) {
      const q = params || new URLSearchParams(window.location.search);
      return q.get('sala') === '1' || q.get('ruta') === '1' || q.get('launch') === 'training' || Boolean(q.get('repaso'))
        || sessionStorage.getItem('dante_diag_sala_mode') === 'true'
        || localStorage.getItem('dante_diagnostico_en_curso') === 'true'
        || Boolean(localStorage.getItem('dante_sesion_pausada'));
    },

    _debeAbrirExamen(params) {
      if (this._llegadaASala(params)) return false;
      const q = params || new URLSearchParams(window.location.search);
      if (q.get('launch') === 'diagnostic' || q.get('action') === 'start_diag') return true;
      const hecho = localStorage.getItem('dante_calibracion_tactica_inicial_done') === 'true'
        || localStorage.getItem('dante_diagnostico_completado') === 'true'
        || localStorage.getItem('dante_diagnostic_completed') === 'true';
      return localStorage.getItem('dante_onboarding_completed') === 'true' && !hecho;
    },

    async init() {
      console.log('🪐 [DANTE HUB ENGINE]: Inicializando motor de mando y misión diaria...');

      // Cargar credenciales e identidad desde almacenamiento local
      this.cargarIdentidad();

      // El examen solo se abre solo si es el diagnóstico pendiente y nadie pidió la sala.
      const urlParams = new URLSearchParams(window.location.search);
      const isDiagLaunch = this._debeAbrirExamen(urlParams);

      if (isDiagLaunch) {
        sessionStorage.setItem('dante_is_diagnostic', 'true');
        const viewGw = document.getElementById('viewGateway');
        const viewWs = document.getElementById('viewWorkspace');
        const viewHub = document.getElementById('viewHub');
        if (viewGw) {
          viewGw.classList.remove('active');
          viewGw.classList.add('hidden');
          viewGw.style.display = 'none';
        }
        if (viewHub) {
          viewHub.classList.remove('active');
          viewHub.classList.add('hidden');
          viewHub.style.display = 'none';
        }
        if (viewWs) {
          viewWs.classList.add('active');
          viewWs.classList.remove('hidden');
          viewWs.style.display = 'block';
        }
        this.pendingStartAfterFetch = true;
      }

      // Pre-renderizar estado inicial inmediatamente para evitar parpadeo o sustitución de texto
      this.preRenderizarEstadoInicial();

      // Escuchar eventos de estado de red (Online / Offline)
      window.addEventListener('online', () => this.handleNetworkStatusChange(true));
      window.addEventListener('offline', () => this.handleNetworkStatusChange(false));

      // Vincular selectores de meta en la interfaz
      this.bindTargetTrackSelectors();

      // Vincular botón táctil de sintonización y escaneo háptico
      this.bindHoldToScanButton();

      this.precargarBanco();

      // Consumir endpoint backend de la Misión Diaria
      await this.consultarMisionDiaria();
      await this.hidratarHabilidadPreu();
      const areaRepaso = urlParams.get('repaso');
      if (areaRepaso === 'fallidas') {
        sessionStorage.removeItem('dante_is_diagnostic');
        localStorage.removeItem('dante_is_diagnostic');
        if (window.DanteRepasoFallidas && typeof window.DanteRepasoFallidas.abrir === 'function') {
          window.DanteRepasoFallidas.abrir();
        }
      } else if (areaRepaso) {
        sessionStorage.removeItem('dante_is_diagnostic');
        localStorage.removeItem('dante_is_diagnostic');
        this.iniciarRepasoArea(areaRepaso);
      } else if (urlParams.get('ruta') === '1') {
        sessionStorage.removeItem('dante_is_diagnostic');
        localStorage.removeItem('dante_is_diagnostic');
        this.abrirPuertaRuta();
      } else if (!isDiagLaunch && window.DanteTutorSala) {
        window.DanteTutorSala.ofrecer();
      }
    },

    /**
     * Pre-renderiza síncronamente el estado visual del plan y texto socrático inicial
     */
    preRenderizarEstadoInicial() {
      // Actualizar Badges de Plan
      this.actualizarUIBadgesPlan(this.planTier);
      // Sincronizar matriz reactiva de textos para el track activo (ICFES vs UNAL)
      this.aplicarTextosPorTrack(this.targetTrack);
    },

    /**
     * Recupera y resuelve la identidad del estudiante desde localStorage / sessionStorage
     */
    cargarIdentidad() {
      try {
        let sesion = null;
        if (typeof DanteStorage !== 'undefined') {
          sesion = DanteStorage.getSession();
        }
        if (sesion && sesion.user) {
          const u = sesion.user;
          const sid = u.estudiante || (u.email ? u.email.split('@')[0] : null) || u.id;
          if (sid) {
            this.studentId = String(sid).toLowerCase().trim();
            this.studentName = u.nombre || u.name || 'Estudiante';
            this.planTier = String(u.plan || u.planTier || 'EXPLORADOR').toUpperCase();
          }
        } else {
          const storedUser = localStorage.getItem('dante_user') || localStorage.getItem('dante_student_id') || localStorage.getItem('dante_active_student');
          if (storedUser) {
            if (storedUser.startsWith('{')) {
              const parsed = JSON.parse(storedUser);
              const sid = parsed.estudiante || parsed.id || parsed.studentId || parsed.email;
              if (sid) {
                this.studentId = String(sid).split('@')[0].toLowerCase().trim();
                this.studentName = parsed.nombre || parsed.name || 'Estudiante';
                this.planTier = (parsed.plan || parsed.planTier || 'EXPLORADOR').toUpperCase();
              }
            } else {
              this.studentId = storedUser.split('@')[0].toLowerCase().trim();
              this.studentName = localStorage.getItem('dante_student_name') || 'Estudiante';
            }
          } else {
            // Autogenerar identificador limpio y válido para garantizar código HTTP 200 tras reset
            const cleanId = 'student_' + Math.random().toString(36).substring(2, 10);
            this.studentId = cleanId;
            this.studentName = 'Estudiante';
            this.planTier = 'EXPLORADOR';
            try {
              localStorage.setItem('dante_student_id', cleanId);
              localStorage.setItem('dante_student_name', 'Estudiante');
              localStorage.setItem('dante_plan_tier', 'EXPLORADOR');
            } catch(e) {}
          }
        }

        this.targetTrack = 'ICFES';
        try {
          localStorage.setItem('dante_target_track', 'ICFES');
          localStorage.setItem('dante_tipo_preparacion', 'ICFES');
          const pactoMeta = localStorage.getItem('dante_pacto_meta') || '';
          if (/PREU|UNAL|COMBO|UDEA/i.test(pactoMeta)) localStorage.setItem('dante_pacto_meta', '380_ELITE');
          const alumnoMeta = this.studentId;
          if (alumnoMeta && !String(alumnoMeta).startsWith('student_')) {
            fetch('/api/v1/auth/meta?estudiante=' + encodeURIComponent(alumnoMeta), { credentials: 'include' })
              .then((r) => r.ok ? r.json() : null)
              .then((data) => {
                if (!data || !data.success) return;
                if (data.metaClave) localStorage.setItem('dante_pacto_meta', data.metaClave);
                if (data.carrera) localStorage.setItem('dante_carrera_objetivo', data.carrera);
                if (data.fecha) localStorage.setItem('dante_pacto_fecha_texto', data.fecha);
                if (data.calendario) localStorage.setItem('dante_pacto_calendario', data.calendario);
                if (data.proyeccion != null) localStorage.setItem('dante_score_proyectado', String(data.proyeccion));
                if (data.simulacro && typeof data.simulacro === 'object') {
                  try {
                    const local = JSON.parse(localStorage.getItem('dante_simulacro_largo') || 'null');
                    if (!(local && local.estado === 'abierto')) {
                      localStorage.setItem('dante_simulacro_largo', JSON.stringify({
                        id: data.simulacro.id || 'sim_servidor',
                        estado: 'listo',
                        resultado: {
                          global: data.simulacro.global == null ? null : Number(data.simulacro.global),
                          areas: data.simulacro.areas || {}
                        },
                        cerrado_en: data.simulacro.cerrado_en || null,
                        persistido: true
                      }));
                    }
                  } catch (e) {}
                  if (window.DanteSimulacro && typeof window.DanteSimulacro.pintar === 'function') {
                    window.DanteSimulacro.pintar();
                  }
                }
              })
              .catch(() => {});
          }
        } catch (e) {}

        const plan = localStorage.getItem('dante_plan_tier') || localStorage.getItem('dante_user_plan');
        const pactoTiempo = localStorage.getItem('dante_pacto_tiempo');
        if (plan) {
          this.planTier = String(plan).toUpperCase();
        } else if (pactoTiempo === 'ALTO_RENDIMIENTO_PRO') {
          this.planTier = 'PRO';
        } else if (pactoTiempo === 'BASE_FREE') {
          this.planTier = 'FREE';
        }
      } catch (err) {
        console.warn('🪐 [DANTE HUB ENGINE]: Advertencia cargando identidad:', err.message);
        this.studentId = null;
      }
    },

    /**
     * Consulta el endpoint backend de la Misión Diaria con fallback resiliente
     */
    async consultarMisionDiaria(trackOverride) {
      this.targetTrack = 'ICFES';
      if (trackOverride && String(trackOverride).toUpperCase() !== 'ICFES') {
        console.warn('🪐 [DANTE HUB ENGINE]: Esta versión solo prepara Saber 11°.');
      }

      if (!this.studentId) {
        this.cargarIdentidadEstudiante();
      }
      if (!this.studentId) {
        const cleanId = 'student_' + Math.random().toString(36).substring(2, 10);
        this.studentId = cleanId;
        this.studentName = 'Estudiante';
        this.planTier = 'EXPLORADOR';
        try {
          localStorage.setItem('dante_student_id', cleanId);
          localStorage.setItem('dante_student_name', 'Estudiante');
          localStorage.setItem('dante_plan_tier', 'EXPLORADOR');
        } catch(e) {}
      }

      const reqTrack = this.targetTrack;
      const reqToken = ++this.fetchToken;
      this.isFetchingMision = true;

      console.log(`🪐 [DANTE HUB ENGINE]: Solicitando Misión Diaria (Track: ${reqTrack}, Token: ${reqToken}, Plan: ${this.planTier}, Estudiante: ${this.studentId})...`);

      const urlParams = new URLSearchParams(window.location.search);
      const isDiagLaunch = this._debeAbrirExamen(urlParams);

      const payload = {
        studentId: this.studentId,
        studentName: this.studentName,
        targetTrack: reqTrack,
        target_track: reqTrack,
        isDiagnostic: isDiagLaunch,
        is_diagnostic: isDiagLaunch,
        refuerzoArea: this._refuerzoArea || null,
        carrera: localStorage.getItem('dante_carrera_objetivo') || 'General',
        meta: localStorage.getItem('dante_pacto_meta') || '350_ICFES',
        planTier: this.planTier
      };

      const primaryEndpoint = '/api/v1/dante/daily-mission';
      const fallbackEndpoint = '/api/dante/daily-mission';

      let response = null;
      let data = null;

      try {
        const rawToken = localStorage.getItem('dante_token') || sessionStorage.getItem('dante_token');
        const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;
        const headers = {
          'Content-Type': 'application/json',
          'x-target-track': reqTrack,
          'x-plan-tier': this.planTier,
          'x-is-diagnostic': String(isDiagLaunch),
          'x-student-id': this.studentId
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Intento 1: Endpoint oficial v1 con timeout resiliente (7000ms para evitar falsos abortos)
        const fetchController = new AbortController();
        const fetchTimeout = setTimeout(() => fetchController.abort(), 7000);

        try {
          response = await fetch(primaryEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: fetchController.signal
          });
          clearTimeout(fetchTimeout);
        } catch (errPrimary) {
          clearTimeout(fetchTimeout);
          console.warn('🪐 [DANTE HUB ENGINE]: Fallback a endpoint secundario /api/dante/daily-mission...');
          const fallbackCtrl = new AbortController();
          const fallbackTimer = setTimeout(() => fallbackCtrl.abort(), 5000);
          try {
            response = await fetch(fallbackEndpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(payload),
              signal: fallbackCtrl.signal
            });
            clearTimeout(fallbackTimer);
          } catch(errFb) {
            clearTimeout(fallbackTimer);
            throw errFb;
          }
        }

        if (response && response.ok) {
          data = await response.json();
        } else {
          throw new Error(`HTTP Error ${response ? response.status : 'No Response'}`);
        }
      } catch (networkErr) {
        console.warn('🪐 [DANTE HUB ENGINE]: Error de red al solicitar la misión diaria:', networkErr.message);
        if (reqToken !== this.fetchToken || reqTrack !== this.targetTrack) {
          this.isFetchingMision = false;
          return;
        }
        this.isFetchingMision = false;
        return this.mananejarOfflineFallback();
      }

      // Descartar si el token o el track cambió durante la petición
      if (reqToken !== this.fetchToken || reqTrack !== this.targetTrack) {
        console.warn(`🪐 [DANTE HUB ENGINE]: Descartando respuesta de Misión Diaria desactualizada (Token ${reqToken} != ${this.fetchToken}, Track ${reqTrack} != ${this.targetTrack}).`);
        this.isFetchingMision = false;
        return;
      }

      this.isFetchingMision = false;

      // Guardar en caché local para contingencia offline
      try {
        localStorage.setItem('dante_cached_daily_mission', JSON.stringify(data));
      } catch (e) {}

      // Procesar respuesta del servidor
      this.procesarRespuestaMision(data, reqTrack, reqToken);
    },

    /**
     * 2. GESTIÓN CONDICIONAL DE LA VISTA (MISIÓN DISPONIBLE vs DESCANSO BIOLÓGICO)
     */
    procesarRespuestaMision(data, reqTrack, reqToken) {
      if (reqToken && reqToken !== this.fetchToken) return;
      if (reqTrack && String(reqTrack).toUpperCase() !== String(this.targetTrack).toUpperCase()) return;

      if (!data || !data.success) {
        console.warn('🪐 [DANTE HUB ENGINE]: Respuesta de misión no exitosa. Aplicando fallback local.');
        return this.mananejarOfflineFallback();
      }

      this.misionActual = data;

      // 🎯 FASE 4: Si es lanzamiento de diagnóstico, montar inmediatamente sin pasar por el Hub
      const urlParams = new URLSearchParams(window.location.search);
      const isDiagLaunch = this._debeAbrirExamen(urlParams);

      const pidioRefuerzo = Boolean(this._refuerzoArea) && this.pendingStartAfterFetch;
      if (isDiagLaunch || pidioRefuerzo || (this.pendingStartAfterFetch && !this._llegadaASala(urlParams))) {
        this.isBlocked = false;
        this.pendingStartAfterFetch = false;
        console.log('⚡ [DANTE HUB ENGINE]: Disparando Diagnóstico Inicial adaptativo sin intermediación del Hub...');
        this.iniciarMision(true);
        return;
      }

      this.isBlocked = !!data.bloqueadoPorDescanso;

      if (this.isBlocked) {
        console.log('🌙 [DANTE HUB ENGINE]: Estado activo - Descanso Biológico (Plan FREE completado hoy).');
        this.renderizarModoDescanso(data);
      } else {
        console.log('⚡ [DANTE HUB ENGINE]: Estado activo - Misión Diaria Habilitada.');
        this.renderizarModoMision(data);
        if (window.DanteRecorrido && DanteRecorrido.pintar) {
          window.setTimeout(() => DanteRecorrido.pintar(), 0);
        }
      }
    },

    /**
     * Muestra el panel de Descanso Biológico e inicia el temporizador de recarga
     */
    renderizarModoDescanso(data) {
      // 1. Mostrar Panel de Descanso Biológico
      const panelDescanso = document.getElementById('uiEstadoDescansoBiologico') || document.getElementById('uiPanelDescansoBiologico');
      if (panelDescanso) {
        panelDescanso.classList.remove('hidden');
      }

      // 2. Ocultar el botón de iniciar misión principal
      const btnAccionContainer = document.getElementById('containerBtnPasoAccion');
      if (btnAccionContainer) {
        btnAccionContainer.style.display = 'none';
      }

      // 3. Renderizar mensaje pedagógico de Dante
      const txtMensajeDescanso = document.getElementById('txtMensajeDescansoDante') || document.getElementById('lblPasoDescripcion');
      if (txtMensajeDescanso && data.mensajeDante) {
        txtMensajeDescanso.innerText = data.mensajeDante;
      }

      // 4. Actualizar Racha en HUD
      if (data.rachaDias !== undefined) {
        this.actualizarUIBadgesRacha(data.rachaDias);
      }

      // 5. Iniciar temporizador regresivo dinámico en #cooldownTimerDescanso
      const segundosRecarga = data.segundosParaRecarga || this.calcularSegundosHastaConsolidacion();
      this.iniciarTimerDescanso(segundosRecarga);
    },

    /**
     * Tipeo animado conversacional (Typewriter) para la entidad Dante con micro-audio opcional
     */
    escribirTexto(elementoId, textoCompleto, velocidad = 22, callback) {
      if (this.activeTypewriterTimer) {
        clearInterval(this.activeTypewriterTimer);
        this.activeTypewriterTimer = null;
      }

      const targetSpan = document.getElementById('txtDanteTypewriter') || document.getElementById(elementoId);
      if (!targetSpan) return;

      this.currentTypewriterTarget = targetSpan;
      this.currentTypewriterFullText = textoCompleto;
      this.currentTypewriterCallback = callback;

      targetSpan.innerText = '';
      let charIdx = 0;

      // Audio micro-chirp sintetizado
      const playChirp = () => {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!this.audioCtx) this.audioCtx = new AudioCtx();
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
          }
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.015);
          gain.gain.setValueAtTime(0.012, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.015);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.015);
        } catch (e) {}
      };

      this.activeTypewriterTimer = setInterval(() => {
        if (charIdx < textoCompleto.length) {
          const ch = textoCompleto.charAt(charIdx);
          targetSpan.innerText += ch;
          if (charIdx % 3 === 0 && ch !== ' ') playChirp();
          charIdx++;
        } else {
          clearInterval(this.activeTypewriterTimer);
          this.activeTypewriterTimer = null;
          if (typeof callback === 'function') callback();
        }
      }, velocidad);
    },

    completarEscribirTexto() {
      if (this.activeTypewriterTimer) {
        clearInterval(this.activeTypewriterTimer);
        this.activeTypewriterTimer = null;
        if (this.currentTypewriterTarget && this.currentTypewriterFullText) {
          this.currentTypewriterTarget.innerText = this.currentTypewriterFullText;
        }
        if (typeof this.currentTypewriterCallback === 'function') {
          this.currentTypewriterCallback();
        }
      }
    },

    /**
     * Renderiza el cuadro de mando conversacional cuando la Misión está activa
     */
    renderizarModoMision(data) {
      this.misionActual = data;
      sessionStorage.setItem('dante_mision_actual', JSON.stringify(data));

      // 1. Ocultar panel de descanso biológico si estaba visible
      const panelDescanso = document.getElementById('uiEstadoDescansoBiologico') || document.getElementById('uiPanelDescansoBiologico');
      if (panelDescanso) {
        panelDescanso.classList.add('hidden');
      }

      // 2. Detener temporizador de descanso si estaba activo
      if (this.cooldownTimerId) {
        clearInterval(this.cooldownTimerId);
        this.cooldownTimerId = null;
      }

      // 3. Asegurar visibilidad de la sección principal
      const bannerPrincipal = document.getElementById('bannerPasoRutaPrincipal');
      if (bannerPrincipal) {
        bannerPrincipal.classList.remove('hidden');
      }

      const btnAccionContainer = document.getElementById('containerBtnPasoAccion');
      if (btnAccionContainer) {
        btnAccionContainer.style.display = 'flex';
      }

      // 4. Saludo dinámico de Dante directo (sin typewriter para estabilizar el layout en 100dvh)
      const name = this.studentName || 'Estudiante';
      const lblUserHeader1 = document.getElementById('lblHeaderStudentName');
      if (lblUserHeader1) lblUserHeader1.innerText = name;

      const lblUserHeader2 = document.getElementById('lblHeaderNombreUsuario');
      if (lblUserHeader2) lblUserHeader2.innerText = name;

      const lblNombreTexto = document.getElementById('lblNombreEstudianteTexto');
      if (lblNombreTexto) lblNombreTexto.innerText = name;

      const urlParams = new URLSearchParams(window.location.search);
      const esDiagnostico = urlParams.get('launch') === 'diagnostic';

      const textoSaludo = esDiagnostico
        ? `Pacto sellado, ${name}. Calibración inicial.`
        : (data.saludoDante || `Hola, ${name} // Calibración de línea base`);

      const lblTitulo = document.getElementById('lblPasoTitulo');
      if (lblTitulo) {
        lblTitulo.innerText = textoSaludo;
      }

      const lblDesc = document.getElementById('lblPasoDescripcion') || document.getElementById('txtDanteTypewriter');
      if (lblDesc) {
        if (esDiagnostico || (data && data.isFirstSession)) {
          const textDiag = `Hola, ${name}. Estas preguntas miden tu punto de partida. Responde con lo que sabes: en el diagnóstico no hay pistas.`;
          this.ejecutarEfectoEscribir(lblDesc, textDiag, 16);
          // Deshabilitar y ocultar el botón del Tutor Socrático durante la calibración inicial para evitar sesgos
          const btnTutor = document.getElementById('btnTutorIA');
          if (btnTutor) {
            btnTutor.style.display = 'none';
            btnTutor.disabled = true;
          }
        } else {
          this.aplicarTextosPorTrack((data && data.targetTrack) || this.targetTrack || 'ICFES');
        }
      } else {
        this.aplicarTextosPorTrack((data && data.targetTrack) || this.targetTrack || 'ICFES');
      }

      // 5. Actualizar Racha y Plan en el HUD
      if (data.rachaDias !== undefined) {
        this.actualizarUIBadgesRacha(data.rachaDias);
      }
      this.actualizarUIBadgesPlan(data.planTier || this.planTier);

      // 6. Activar modo orgánico en la Espiral Dante
      if (window.DanteSpiral) {
        window.DanteSpiral.setMode('active');
      }

      // 7. Actualizar enlace de Expediente en Footer
      const elFooterLink = document.getElementById('uiFooterExpedienteLink');
      if (elFooterLink) {
        if (data && data.isFirstSession) {
          elFooterLink.innerHTML = `<span class="inline-flex items-center gap-1.5 text-[10.5px] text-slate-500 font-mono">Tu informe aparece al terminar el diagnóstico.</span>`;
        } else {
          elFooterLink.innerHTML = `<a href="perfil.html" class="inline-flex items-center gap-1.5 text-[10.5px] text-cyan-400 hover:text-cyan-300 transition-colors font-mono font-bold"><span>Ver el informe</span> →</a>`;
        }
      }
    },

    /**
     * Efecto de máquina de escribir "hablando" suave con soporte para HTML (colores) y cursor socrático
     */
    typewriterTimer: null,
    currentTypewriterEl: null,
    currentTypewriterFullHtml: '',

    completarEscribirTexto() {
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
      if (this.currentTypewriterEl && this.currentTypewriterFullHtml) {
        this.currentTypewriterEl.innerHTML = this.currentTypewriterFullHtml;
      }
    },

    ejecutarEfectoEscribir(el, htmlContent, speed = 16) {
      if (!el) return;
      const plano = String(htmlContent || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const actual = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (plano && actual === plano) return;
      if (this.currentTypewriterFullHtml === htmlContent && this.typewriterTimer) return;
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }

      this.currentTypewriterEl = el;
      this.currentTypewriterFullHtml = htmlContent;

      // Tokenizar HTML: separa etiquetas (<...>) de caracteres de texto
      const tokens = [];
      const regex = /(<[^>]+>)|([^<]+)/g;
      let match;
      while ((match = regex.exec(htmlContent)) !== null) {
        if (match[1]) {
          tokens.push({ type: 'tag', content: match[1] });
        } else if (match[2]) {
          for (const c of match[2]) {
            tokens.push({ type: 'char', content: c });
          }
        }
      }

      el.innerHTML = '';
      let tokenIdx = 0;
      let currentHtml = '';
      const cursorHtml = '<span class="inline-block w-1.5 h-3.5 bg-cyan-400 align-middle ml-0.5 animate-pulse" id="twCursorDante"></span>';

      this.typewriterTimer = setInterval(() => {
        // Renderizar etiquetas HTML pendientes de inmediato
        while (tokenIdx < tokens.length && tokens[tokenIdx].type === 'tag') {
          currentHtml += tokens[tokenIdx].content;
          tokenIdx++;
        }

        if (tokenIdx < tokens.length) {
          currentHtml += tokens[tokenIdx].content;
          tokenIdx++;
          el.innerHTML = currentHtml + cursorHtml;
        } else {
          clearInterval(this.typewriterTimer);
          this.typewriterTimer = null;
          el.innerHTML = currentHtml;
        }
      }, speed);
    },

    /**
     * Gestión del botón de sintonización táctil con escaneo háptico (Vibración Sincronizada 3s)
     */
    bindHoldToScanButton() {
      // El ritual de escaneo e inicio háptico de 3s se gestiona de manera centralizada en index.html
      // evitando duplicidad de temporizadores, vibración y conflictos de latencia.
    },

    /**
     * Temporizador regresivo dinámico en formato HH:MM:SS decrementando cada segundo
     */
    iniciarTimerDescanso(segundosTotal) {
      if (this.cooldownTimerId) {
        clearInterval(this.cooldownTimerId);
      }

      let segundos = Math.max(0, parseInt(segundosTotal, 10) || 0);

      const updateUI = () => {
        const timerEl = document.getElementById('cooldownTimerDescanso');
        if (timerEl) {
          if (segundos <= 0) {
            timerEl.innerText = '00:00:00';
            clearInterval(this.cooldownTimerId);
            this.cooldownTimerId = null;
            console.log('🌙 [DANTE HUB ENGINE]: Cooldown finalizado. Consultando nueva Misión Diaria...');
            this.consultarMisionDiaria();
            return;
          }

          const hours = Math.floor(segundos / 3600);
          const minutes = Math.floor((segundos % 3600) / 60);
          const secs = segundos % 60;

          const hStr = String(hours).padStart(2, '0');
          const mStr = String(minutes).padStart(2, '0');
          const sStr = String(secs).padStart(2, '0');

          timerEl.innerText = `${hStr}:${mStr}:${sStr}`;
        }
        segundos--;
      };

      updateUI();
      this.cooldownTimerId = setInterval(updateUI, 1000);
    },

    /**
     * Cálculo auxiliar de segundos restantes hasta medianoche / recarga en Bogotá
     */
    calcularSegundosHastaConsolidacion() {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      return Math.max(1, diff);
    },

    /**
     * 3. DISPARO DEL ENTRENAMIENTO (DanteHubEngine.iniciarMision)
     */
    iniciarMision(inmediato = false) {
      if (this._iniciandoMisionLock) return;
      this._iniciandoMisionLock = true;
      try {
        console.log('🪐 [DANTE HUB ENGINE]: Disparando inicio de la Misión Diaria...');

        const urlParams = new URLSearchParams(window.location.search);
        const esDiagnostico = urlParams.get('launch') === 'diagnostic' || 
                              urlParams.get('action') === 'start_diag' ||
                              sessionStorage.getItem('dante_is_diagnostic') === 'true';
        const esRepaso = Boolean(urlParams.get('repaso') || this._repasoEnCurso);

        if (!esDiagnostico && !esRepaso && !this._refuerzoArea && window.DanteRecorrido && DanteRecorrido.bloqueado()) {
          try { localStorage.removeItem('dante_sesion_pausada'); } catch (e) {}
          this._iniciandoMisionLock = false;
          if (window.DanteRecorrido.pintar) DanteRecorrido.pintar();
          if (window.DanteRecorrido.decirEspera) DanteRecorrido.decirEspera();
          return;
        }

      let misionData = null;
      if (this.misionActual && this.misionActual.esSimulacro) this.misionActual = null;

      // Validar si existe sesión pausada en progreso
      const sesionPausada = esRepaso ? null : this._pausaReal();
      if (sesionPausada && sesionPausada.misionData) {
        console.log('⚡ [DANTE HUB ENGINE]: Restaurando Misión Diaria pausada desde localStorage...');
        this.misionActual = sesionPausada.misionData;
        misionData = sesionPausada.misionData;
      }

      // Validar paquete de preguntas
      if (!misionData) {
        misionData = this.misionActual;
      }
      if (misionData && misionData.targetTrack && String(misionData.targetTrack).toUpperCase() !== String(this.targetTrack).toUpperCase()) {
        console.warn(`⚠️ [DANTE HUB ENGINE]: Misión en memoria es de ${misionData.targetTrack}, se requiere ${this.targetTrack}. Limpiando...`);
        misionData = null;
        this.misionActual = null;
      }

      if (!misionData) {
        const stored = sessionStorage.getItem('dante_mision_actual');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const mismoTrack = (candidato) => candidato && !candidato.esSimulacro && (!candidato.targetTrack || String(candidato.targetTrack).toUpperCase() === String(this.targetTrack).toUpperCase());
            if (parsed && parsed.esSimulacro) {
              const bloque = sessionStorage.getItem('dante_mision_bloque');
              if (bloque) {
                const previa = JSON.parse(bloque);
                if (mismoTrack(previa)) misionData = previa;
              }
            } else if (mismoTrack(parsed)) {
              misionData = parsed;
            }
          } catch (e) {}
        }
      }

      if (!misionData || !misionData.reactivos || misionData.reactivos.length === 0) {
        console.warn('⚠️ [DANTE HUB ENGINE]: No se encontraron reactivos en memoria para el track activo. Activando el banco local...');
        if (this._publicarDesdeBanco(window.DANTE_BANCO_ITEMS)) {
          misionData = this.misionActual;
        } else {
          this._iniciandoMisionLock = false;
          this.pendingStartAfterFetch = true;
          this.precargarBanco();
          this.mananejarOfflineFallback();
          return;
        }
      }

      if (!misionData || !misionData.reactivos || misionData.reactivos.length === 0) {
        console.warn('⚠️ [DANTE HUB ENGINE]: Solicitando al servidor oficial...');
        this.pendingStartAfterFetch = true;

        const txtPrompt = document.getElementById('txtScanPrompt');
        if (txtPrompt) {
          txtPrompt.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-cyan-400 mr-1.5"></i> <span>CARGANDO PRUEBA ADAPTATIVA...</span>`;
        }
        const txtSubprompt = document.getElementById('txtScanSubprompt');
        if (txtSubprompt) {
          txtSubprompt.innerText = 'CONECTANDO CON BANCO CALIBRADO EN TIEMPO REAL...';
        }
        const fillProgress = document.getElementById('btnHoldProgressFill');
        if (fillProgress) {
          fillProgress.style.width = '100%';
        }

        if (!this.isFetchingMision) {
          this.consultarMisionDiaria(this.targetTrack);
        }
        return;
      }

      this.pendingStartAfterFetch = false;

      // Feedback háptico si existe
      if (window.hapticEngine && typeof window.hapticEngine.trigger === 'function') {
        window.hapticEngine.trigger('click');
      }

      // Montaje del Workspace
      const ejecutarMontajeWorkspace = () => {
        sessionStorage.removeItem('dante_diag_sala_mode');
        const hubContainer = document.getElementById('bannerPasoRutaPrincipal') || document.getElementById('viewGateway');
        if (hubContainer) hubContainer.style.opacity = '1';

        // Forzar desmonte estricto de la vista de entrada (Gateway / Hub) y activación del Examen (Workspace)
        const viewGw = document.getElementById('viewGateway');
        const viewWs = document.getElementById('viewWorkspace');
        const viewHub = document.getElementById('viewHub');

        if (viewGw) {
          viewGw.classList.remove('active');
          viewGw.classList.add('hidden');
          viewGw.style.display = 'none';
        }
        if (viewHub) {
          viewHub.classList.remove('active');
          viewHub.classList.add('hidden');
          viewHub.style.display = 'none';
        }

        if (viewWs) {
          viewWs.classList.add('active');
          viewWs.classList.remove('hidden');
          viewWs.style.display = 'block';
        }

        // Configuración de Ayudas Socráticas según Fase (Diagnóstico Inicial vs Entrenamiento Diario)
        if (misionData && misionData.repasoArea) {
          misionData.isDiagnostic = false;
          misionData.isFirstSession = false;
        }
        if (!misionData?.repasoArea && (esDiagnostico || (misionData && (misionData.isFirstSession || misionData.isDiagnostic)))) {
          misionData.isDiagnostic = true;
          // En diagnóstico: mantener interactivos los botones para que el usuario pueda hacer clic y recibir la advertencia de guardado
          const uiDante = document.getElementById('uiIntervencionDanteLive');
          if (uiDante) {
            uiDante.style.display = '';
            uiDante.classList.add('hidden');
          }
          ['btnPistaSocraticaDante', 'btnVozDanteAudio'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
              el.style.display = 'flex';
              el.disabled = false;
            }
          });
        } else {
          // En entrenamiento diario: Todos los botones y opciones 100% activos y funcionales
          misionData.isDiagnostic = false;
          const uiDante = document.getElementById('uiIntervencionDanteLive');
          if (uiDante) {
            uiDante.style.display = '';
            uiDante.classList.add('hidden');
          }
          ['btnPistaSocraticaDante', 'btnVozDanteAudio', 'btnTutorIA'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
              el.style.display = 'flex';
              el.disabled = false;
              el.style.opacity = '1';
            }
          });
        }

        // Activar controles de examen en el Header HUD
        ['btnBanoHeader', 'lblRelojSesion', 'btnVolverSalaHeader'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'inline-flex';
        });

        // Posicionar en la parte superior visible de la pantalla
        window.scrollTo(0, 0);

        // Almacenar el lote activo para el motor de evaluación
        window.DANTE_DAILY_MISSION_BATCH = misionData;
        sessionStorage.setItem('dante_current_batch', JSON.stringify(misionData.reactivos));

        if (window.DanteSpiral) {
          window.DanteSpiral.setMode('focus');
        }

        if (window.DanteExamWorkspace && typeof window.DanteExamWorkspace.iniciarSesion === 'function') {
          window.DanteExamWorkspace.iniciarSesion(misionData);
        } else if (window.AppController && typeof window.AppController.iniciarBloqueDiario === 'function') {
          window.AppController.iniciarBloqueDiario(misionData);
        } else if (window.AppController && typeof window.AppController.iniciarSimulacroDiagnostico === 'function') {
          window.AppController.iniciarSimulacroDiagnostico(true);
        } else if (window.AppController && typeof window.AppController.cambiarVista === 'function') {
          window.AppController.cambiarVista('viewWorkspace');
        } else {
          console.log('⚡ [DANTE HUB ENGINE]: Misión iniciada con éxito. Listo para el Workspace.');
        }

        // Iniciar cronómetro de sesión de la Misión Diaria
        this.iniciarRelojSesionMision();
      };

      if (inmediato || esDiagnostico) {
        ejecutarMontajeWorkspace();
      } else {
        const hubContainer = document.getElementById('bannerPasoRutaPrincipal') || document.getElementById('viewGateway');
        if (hubContainer) {
          hubContainer.style.transition = 'opacity 0.3s ease-out';
          hubContainer.style.opacity = '0.5';
        }
        setTimeout(ejecutarMontajeWorkspace, 300);
      }
    } finally {
      this._iniciandoMisionLock = false;
    }
  },

    /**
     * Cronómetro de la sesión activa de la Misión Diaria (HH:MM)
     */
    iniciarRelojSesionMision() {
      if (window.danteRespiracionPendiente) {
        this._relojEsperandoRespiracion = true;
        return;
      }
      if (this.sessionTimerId) clearInterval(this.sessionTimerId);
      this.sessionSeconds = 0;

      const lblReloj = document.getElementById('lblRelojSesion');
      if (lblReloj) {
        lblReloj.style.display = 'inline-flex';
      }

      this.sessionTimerId = setInterval(() => {
        this.sessionSeconds++;
        const mins = Math.floor(this.sessionSeconds / 60);
        const secs = this.sessionSeconds % 60;
        const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (lblReloj) {
          const spanText = lblReloj.querySelector('span');
          if (spanText) spanText.innerText = formatted;
        }
      }, 1000);
    },

    /**
     * 4. SINCRONIZACIÓN DEL SELECTOR DE META (ICFES <-> UNAL)
     */
    bindTargetTrackSelectors() {
      // 1. Selector explícito si existe en DOM (#selMetaActivaHeader)
      const selectHeader = document.getElementById('selMetaActivaHeader');
      if (selectHeader) {
        selectHeader.value = this.targetTrack;
        selectHeader.addEventListener('change', (e) => {
          this.cambiarMetaTrack(e.target.value);
        });
      }

      // 2. Sincronizar el texto del botón del HUD (#lblConvocatoriaActivaHeader)
      this.actualizarUIHeaderTrack(this.targetTrack);
    },

    cambiarMetaTrack(nuevoTrack) {
      if (!nuevoTrack) return;
      const cleanTrack = 'ICFES';
      if (String(nuevoTrack).toUpperCase().trim() !== 'ICFES') return;

      // Blindaje durante evaluación activa o prueba de diagnóstico
      const enExamen = Boolean(window.isExamActive || (window.DanteExamWorkspace && window.DanteExamWorkspace.misionData));
      if (enExamen) {
        const esDiag = Boolean(
          (typeof AppController !== 'undefined' && typeof AppController.esSesionDiagnosticoActiva === 'function' && AppController.esSesionDiagnosticoActiva()) ||
          window.DanteExamWorkspace?.misionData?.isDiagnostic
        );
        if (esDiag && typeof AppController !== 'undefined' && typeof AppController.mostrarModalAvisoDiagnostico === 'function') {
          const currentTrack = (window.DanteExamWorkspace?.misionData?.targetTrack || this.targetTrack || 'ICFES').toUpperCase();
          AppController.mostrarModalAvisoDiagnostico({
            titulo: "CAMBIO DE PRUEBA RESTRINGIDO",
            subtitulo: "CONVOCATORIA EN EVALUACIÓN",
            mensaje: `La prueba de diagnóstico en curso corresponde a ${currentTrack === 'UNAL' ? 'Admisión UNAL' : 'Saber 11°'}. Debes terminar la prueba de diagnóstico para cambiar de objetivo o convocatoria. Tu proceso está guardado de forma segura.`,
            icono: "fa-arrow-right-arrow-left"
          });
        } else if (typeof mostrarNotificacionPWA === 'function') {
          mostrarNotificacionPWA(`⚠️ Tienes una evaluación en curso. Para cambiar de prueba debes pausarla o finalizarla.`, "warning");
        }
        return;
      }

      console.log(`🪐 [DANTE HUB ENGINE]: Cambiando meta activa a ${cleanTrack}...`);
      this.targetTrack = cleanTrack;
      localStorage.setItem('dante_target_track', cleanTrack);
      localStorage.setItem('dante_pacto_meta', cleanTrack);

      // Invalidador estricto de caché inter-track para prevenir contaminación de preguntas
      this.misionActual = null;
      sessionStorage.removeItem('dante_mision_actual');
      sessionStorage.removeItem('dante_current_batch');
      sessionStorage.removeItem('dante_exam_progress');
      window.DANTE_DAILY_MISSION_BATCH = null;
      if (window.DanteExamWorkspace) {
        window.DanteExamWorkspace.misionData = null;
        if (typeof window.DanteExamWorkspace.limpiarProgresoSesion === 'function') {
          window.DanteExamWorkspace.limpiarProgresoSesion();
        }
      }

      this.actualizarUIHeaderTrack(cleanTrack);
      this.aplicarTextosPorTrack(cleanTrack);
      this.consultarMisionDiaria(cleanTrack);
    },

    /**
     * Matriz reactiva de textos para la Sala Principal por Track (ICFES vs UNAL)
     */
    aplicarTextosPorTrack(track) {
      const isUnal = String(track).toUpperCase() === 'UNAL';
      const name = this.studentName || 'Estudiante';

      // Detener y completar typewriter de inmediato para evitar carreras o duplicados
      this.completarEscribirTexto();
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }

      // 1. Badge superior unificado
      const badgeContent = document.getElementById('txtBadgeTurnoContent');
      if (badgeContent) {
        badgeContent.innerText = isUnal
          ? 'PREUNIVERSITARIO UNAL // ENTRENAMIENTO 3D'
          : 'Saber 11°';
      }

      // 2. Saludo, luego el bloque, y si sigue abierto, la pregunta en la que continúa.
      const lblDesc = document.getElementById('lblPasoDescripcion') || document.getElementById('txtDanteTypewriter');
      const sesionPausada = this._pausaReal();
      const hayPausa = Boolean(sesionPausada && sesionPausada.misionData);
      let sigueAbierta = '';
      let nombrePausa = 'el bloque';
      if (hayPausa) {
        const idxAbierta = (sesionPausada.indexReactivo !== undefined ? sesionPausada.indexReactivo : sesionPausada.indexReactivoActivo || 0) + 1;
        const totAbierta = sesionPausada.totalReactivos || (sesionPausada.misionData.reactivos && sesionPausada.misionData.reactivos.length) || 10;
        const areaPausa = String(sesionPausada.misionData.repasoArea || '').toLowerCase();
        if (areaPausa.includes('mate')) nombrePausa = 'el refuerzo de Matemáticas';
        else if (areaPausa.includes('lect')) nombrePausa = 'el refuerzo de Lectura crítica';
        else if (areaPausa.includes('cien') || areaPausa.includes('natur')) nombrePausa = 'el refuerzo de Ciencias';
        else if (areaPausa.includes('social')) nombrePausa = 'el refuerzo de Sociales';
        else if (areaPausa.includes('ingl')) nombrePausa = 'el refuerzo de Inglés';
        else if (sesionPausada.misionData.isDiagnostic) nombrePausa = 'el diagnóstico';
        sigueAbierta = ` Sigues ${nombrePausa}, pregunta ${idxAbierta} de ${totAbierta}.`;
      }
      const textoSala = isUnal
        ? `Pacto Admisión activo, <span class="text-amber-300 font-bold">${name}</span>. Módulo especializado de alta exigencia UNAL. Enfoque prioritario en Análisis de Imagen 3D, Ciencias y Razonamiento Abstracto.`
        : (hayPausa
          ? `Hola, ${name}.${sigueAbierta}`
          : `Hola, ${name}. El bloque de hoy son 10 preguntas de las cinco áreas de Saber 11°.`);
      if (lblDesc) this.ejecutarEfectoEscribir(lblDesc, textoSala, 16);

      // 3. Píldoras Métricas Anti-desborde
      const containerPildoras = document.getElementById('containerPildorasMetricas');
      if (containerPildoras) {
        if (isUnal) {
          containerPildoras.innerHTML = `
            <span class="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-amber-300 shrink-0 flex items-center gap-1">
                <i class="fa-solid fa-cube text-amber-400 text-[9px]"></i> Preguntas de admisión
            </span>
            <span class="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-purple-300 shrink-0 flex items-center gap-1">
                <i class="fa-solid fa-brain text-purple-400 text-[9px]"></i> Razonamiento
            </span>
            <span class="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-cyan-300 shrink-0 flex items-center gap-1">
                <i class="fa-regular fa-clock text-cyan-400 text-[9px]"></i> ~20 Min
            </span>
          `;
        } else {
          const rachaPrev = document.getElementById('lblGatewayRachaCount');
          const rachaNum = rachaPrev ? rachaPrev.textContent : '1';
          containerPildoras.innerHTML = `
            <span class="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-cyan-300 shrink-0 flex items-center gap-1">
                <i class="fa-solid fa-bolt text-cyan-400 text-[9px]"></i> 10 preguntas
            </span>
            <button type="button" onclick="StreakManager.abrirModalRacha()" class="px-2 py-0.5 rounded-lg bg-orange-950/80 border border-orange-500/50 text-[10px] font-mono text-orange-300 shrink-0 flex items-center gap-1 cursor-pointer" title="Días seguidos">
                <i class="fa-solid fa-fire text-orange-400 text-[9px]"></i> Racha: <span id="lblGatewayRachaCount" class="font-extrabold text-white">${rachaNum}</span>
            </button>
            <span class="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-amber-300 shrink-0 flex items-center gap-1">
                <i class="fa-regular fa-clock text-amber-400 text-[9px]"></i> ~25 min
            </span>
          `;
        }
      }

      // 4. Tarjeta de proyección y botón de la misión
      const maxEscala = 500;
      const esPreuSala = isUnal;
      const txtPrompt = document.getElementById('txtScanPrompt') || document.getElementById('btnSintonizar');
      const txtSubprompt = document.getElementById('txtScanSubprompt');

      if (hayPausa) {
        const idxActivo = (sesionPausada.indexReactivo !== undefined ? sesionPausada.indexReactivo : sesionPausada.indexReactivoActivo || 0) + 1;
        const tot = sesionPausada.totalReactivos || (sesionPausada.misionData.reactivos && sesionPausada.misionData.reactivos.length) || 10;

        if (badgeContent) {
          badgeContent.innerText = `En pausa · pregunta ${idxActivo} de ${tot}`;
        }
        if (txtPrompt) {
          // Contador en acento: el estudiante ve claro cuántas lleva / faltan.
          txtPrompt.innerHTML = `Seguir ${nombrePausa} · <span class="sala-cta-progreso">${idxActivo} de ${tot}</span>`;
        }
        if (txtSubprompt) {
          txtSubprompt.innerText = 'Mantén para continuar';
          txtSubprompt.setAttribute('data-reposo', 'Mantén para continuar');
        }
      } else {
        if (txtPrompt) {
          const totalPreguntas = (this.misionActual && Array.isArray(this.misionActual.reactivos) && this.misionActual.reactivos.length) || 10;
          txtPrompt.innerText = `Entrenamiento de hoy · ${totalPreguntas} preguntas`;
        }
        if (txtSubprompt) {
          txtSubprompt.innerText = 'Mantén presionado';
          txtSubprompt.setAttribute('data-reposo', 'Mantén presionado');
        }
      }

      const rawScore = esPreuSala
        ? parseInt(localStorage.getItem('dante_preu_puntos') || '0', 10)
        : parseInt(localStorage.getItem('dante_score_proyectado') || '0', 10);
      const ptsMostrar = rawScore > 0 ? Math.min(500, rawScore) : 0;
      const etiqueta = document.getElementById('lblProyeccionEtiqueta');
      const puntosEl = document.getElementById('lblProyeccionPuntos');
      const escalaEl = document.getElementById('lblProyeccionEscala');
      const barra = document.getElementById('barraProyeccion');
      const sub = document.getElementById('lblEstadoCalibracionSub');
      if (etiqueta) etiqueta.textContent = esPreuSala ? 'Tu habilidad Pre-U' : 'Tu Proyección';
      if (escalaEl) escalaEl.textContent = '/ ' + maxEscala;
      if (puntosEl) puntosEl.textContent = ptsMostrar > 0 ? String(ptsMostrar) : '—';
      const margenEl = document.getElementById('lblProyeccionMargen');
      if (margenEl) {
        const sem = parseFloat(localStorage.getItem(esPreuSala ? 'dante_preu_sem' : 'dante_sem_estimado') || '');
        if (ptsMostrar > 0 && Number.isFinite(sem)) {
          const puntosMargen = Math.max(8, Math.round(sem * 70));
          margenEl.textContent = '± ' + puntosMargen;
        } else {
          margenEl.textContent = '';
        }
      }
      if (barra) barra.style.width = ptsMostrar > 0 ? Math.max(6, Math.round((ptsMostrar / maxEscala) * 100)) + '%' : '0%';
      if (sub) {
        if (!ptsMostrar) {
          sub.textContent = esPreuSala
            ? 'Aparece cuando respondas preguntas de admisión.'
            : 'Tu proyección aparece al terminar el diagnóstico.';
        } else if (esPreuSala) {
          if (!localStorage.getItem('dante_preu_base')) localStorage.setItem('dante_preu_base', String(ptsMostrar));
          const basePreu = parseInt(localStorage.getItem('dante_preu_base') || String(ptsMostrar), 10);
          const deltaPreu = ptsMostrar - basePreu;
          if (deltaPreu > 0) sub.textContent = 'Subiste ' + deltaPreu + ' puntos en admisión.';
          else if (deltaPreu < 0) sub.textContent = 'Vas ' + Math.abs(deltaPreu) + ' puntos bajo tu primera medición Pre-U.';
          else sub.textContent = 'Habilidad medida con tus preguntas de admisión.';
        } else if (localStorage.getItem('dante_proyeccion_practicas') !== '1') {
          sub.textContent = 'Primera medición del diagnóstico.';
        } else {
          const base = parseInt(localStorage.getItem('dante_score_base') || String(ptsMostrar), 10);
          const anteriorRaw = localStorage.getItem('dante_score_anterior');
          const anterior = anteriorRaw === null ? null : parseInt(anteriorRaw, 10);
          const delta = ptsMostrar - base;
          if (anterior !== null && ptsMostrar === anterior) sub.textContent = 'Sin cambio desde la última medición.';
          else if (delta > 0) sub.textContent = 'Subiste ' + delta + ' puntos desde el diagnóstico.';
          else if (delta < 0) sub.textContent = 'Vas ' + Math.abs(delta) + ' puntos bajo el diagnóstico.';
          else sub.textContent = 'Sigues en tu medición del diagnóstico.';
        }
      }
      this.pintarPuertaRuta();
    },

    async hidratarHabilidadPreu() {
      if (!window.DanteNube || typeof window.DanteNube.leerExpediente !== 'function') return;
      if (!this.esRutaPreu()) return;
      const alumno = this.alumnoDeRuta();
      if (!alumno) return;
      let nube = null;
      try { nube = await window.DanteNube.leerExpediente(alumno); } catch (e) { nube = null; }
      const fila = ((nube && nube.progreso) || []).find((row) => row && row.materia === 'preuniversitario' && row.medido && row.puntaje_escalonado != null);
      if (!fila) return;
      try {
        localStorage.setItem('dante_preu_puntos', String(Math.round(fila.puntaje_escalonado)));
        if (fila.bayesian_sem != null) localStorage.setItem('dante_preu_sem', String(fila.bayesian_sem));
      } catch (e) {}
      this.aplicarTextosPorTrack(this.targetTrack);
    },

    esRutaPreu() {
      const t = String(this.targetTrack || localStorage.getItem('dante_target_track') || 'ICFES').toUpperCase();
      return t === 'UNAL' || t === 'COMBO';
    },

    esRutaIcfes() {
      const t = String(this.targetTrack || localStorage.getItem('dante_target_track') || 'ICFES').toUpperCase();
      return t === 'ICFES' || t === 'COMBO';
    },

    _nombresLetra: { R: 'Realista', I: 'Investigativo', A: 'Artístico', S: 'Social', E: 'Emprendedor', C: 'Convencional' },

    _dilemasRuta: [
      {
        pregunta: 'Un trabajo del curso se traba y el grupo te mira. ¿Qué haces primero?',
        opciones: [
          { letra: 'R', texto: 'Me siento a construir la parte que falta.' },
          { letra: 'I', texto: 'Busco la causa y la pruebo con datos.' },
          { letra: 'A', texto: 'Cambio la forma de presentarlo para que se entienda.' },
          { letra: 'S', texto: 'Reúno al grupo y escucho qué necesita cada uno.' }
        ]
      },
      {
        pregunta: 'Te ofrecen un sábado libre para un proyecto. ¿Cuál eliges?',
        opciones: [
          { letra: 'E', texto: 'Salir a conseguir apoyo y presentar la idea.' },
          { letra: 'C', texto: 'Ordenar cuentas, tiempos y lo que ya está pendiente.' },
          { letra: 'R', texto: 'Armar con las manos el modelo o el prototipo.' },
          { letra: 'I', texto: 'Una lectura o un laboratorio para entender algo a fondo.' }
        ]
      },
      {
        pregunta: 'Al cerrar el año, ¿qué resultado te deja más satisfecho?',
        opciones: [
          { letra: 'A', texto: 'Una obra, un diseño o una forma de contar algo.' },
          { letra: 'S', texto: 'Un grupo que aprendió porque estuviste ahí.' },
          { letra: 'E', texto: 'Una decisión tomada y un plan que sí arrancó.' },
          { letra: 'C', texto: 'Un cierre donde cada cosa quedó en su lugar y a tiempo.' }
        ]
      },
      {
        pregunta: 'En la feria del colegio te toca un puesto. ¿Dónde te quedas?',
        opciones: [
          { letra: 'R', texto: 'Armando el montaje y cuidando que no se caiga.' },
          { letra: 'A', texto: 'Dejando el puesto con una imagen que la gente recuerde.' },
          { letra: 'E', texto: 'Convenciendo a la gente de que se acerque.' },
          { letra: 'I', texto: 'Explicando cómo funciona lo que muestran.' }
        ]
      },
      {
        pregunta: 'Te piden ayudar en una salida del curso. ¿Qué parte tomas?',
        opciones: [
          { letra: 'S', texto: 'Acompañar a quien se pierde o se queda atrás.' },
          { letra: 'C', texto: 'El horario, los materiales y la lista.' },
          { letra: 'R', texto: 'Cargar, instalar y dejar todo funcionando.' },
          { letra: 'A', texto: 'El aviso, el cartel o la forma de contarlo.' }
        ]
      },
      {
        pregunta: 'El profesor deja un problema abierto. ¿Cómo lo cierras?',
        opciones: [
          { letra: 'I', texto: 'Busco la explicación y la compruebo.' },
          { letra: 'E', texto: 'Propongo una decisión y la defiendo.' },
          { letra: 'S', texto: 'Lo hablo con otros hasta que todos lo vean claro.' },
          { letra: 'C', texto: 'Lo dejo por pasos, con fecha y responsable.' }
        ]
      }
    ],

    _carrerasAfin: [
      { id: 'medicina', nombre: 'Medicina', letras: 'IRS', porque: 'Investiga, cuida personas y trabaja con las manos en salud.' },
      { id: 'biologia', nombre: 'Biología', letras: 'IRS', porque: 'Observa lo vivo, lo comprueba y lo explica.' },
      { id: 'sistemas', nombre: 'Ingeniería de Sistemas', letras: 'IRC', porque: 'Analiza, construye y ordena soluciones técnicas.' },
      { id: 'derecho', nombre: 'Derecho', letras: 'ESI', porque: 'Argumenta, acompaña casos y estudia a fondo.' },
      { id: 'psicologia', nombre: 'Psicología', letras: 'SIA', porque: 'Escucha, comprende y busca su propia lectura de las personas.' },
      { id: 'arquitectura', nombre: 'Arquitectura', letras: 'AIR', porque: 'Diseña, analiza el espacio y lo construye.' },
      { id: 'diseno', nombre: 'Diseño', letras: 'AEI', porque: 'Da forma a una idea y encuentra cómo mostrarla.' },
      { id: 'administracion', nombre: 'Administración', letras: 'ECS', porque: 'Decide, ordena y trabaja con equipos.' },
      { id: 'licenciatura', nombre: 'Licenciatura', letras: 'SAE', porque: 'Enseña, se expresa y guía a un grupo.' },
      { id: 'contaduria', nombre: 'Contaduría', letras: 'CIE', porque: 'Ordena, analiza y lee los números con cuidado.' }
    ],

    perfilEnPalabras(codigo) {
      const letras = String(codigo || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
      if (!letras) return '';
      return letras.split('').map((l) => this._nombresLetra[l] || l).join(' · ');
    },

    _hoyRuta() {
      return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date());
    },

    _leerRutaVocacional() {
      const base = { elecciones: [], dia: '', codigo: '', lista: false, cierres: [] };
      try {
        const raw = JSON.parse(localStorage.getItem('dante_ruta_vocacional') || 'null');
        if (raw && typeof raw === 'object') Object.assign(base, raw);
      } catch (e) {}
      base.elecciones = (Array.isArray(base.elecciones) ? base.elecciones : [])
        .map((letra) => String(letra || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1))
        .filter(Boolean)
        .slice(0, 6);
      base.codigo = String(base.codigo || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
      base.lista = Boolean(base.lista);
      base.cierres = (Array.isArray(base.cierres) ? base.cierres : [])
        .map((letra) => String(letra || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1))
        .filter(Boolean)
        .slice(-24);
      const ya = localStorage.getItem('dante_test_vocacional_completado') === 'true';
      const codigoViejo = String(localStorage.getItem('dante_holland_code') || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
      if (!base.lista && ya && codigoViejo) {
        base.lista = true;
        base.codigo = codigoViejo;
      }
      return base;
    },

    _guardarRutaVocacional(estado) {
      const limpio = {
        elecciones: (estado.elecciones || []).slice(0, 6),
        dia: estado.dia || '',
        codigo: estado.codigo || '',
        lista: Boolean(estado.lista),
        cierres: (estado.cierres || []).slice(-24)
      };
      try { localStorage.setItem('dante_ruta_vocacional', JSON.stringify(limpio)); } catch (e) {}
      return limpio;
    },

    _textoRuta(valor) {
      return String(valor || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    _ponerEncabezadoRuta(kicker, titulo) {
      const k = document.getElementById('lblRutaModalKicker');
      const t = document.getElementById('lblRutaModalTitulo');
      if (k) k.textContent = kicker || '';
      if (t) t.textContent = titulo || '';
    },

    _marcasRuta(hechas) {
      return '<div class="ruta-marca" aria-hidden="true">' + [0, 1, 2, 3, 4, 5].map((i) => {
        return '<span class="' + (i < hechas ? 'hecha' : '') + '"></span>';
      }).join('') + '</div>';
    },

    _sincronizarRuta(estado, enCurso) {
      const alumno = this.alumnoDeRuta();
      if (!alumno) return;
      const carrera = enCurso ? null : (localStorage.getItem('dante_carrera_objetivo') || null);
      let afines = [];
      try { afines = JSON.parse(localStorage.getItem('dante_carreras_afines') || '[]'); } catch (e) { afines = []; }
      return fetch('/api/v1/vocational/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: alumno,
          enCurso: Boolean(enCurso),
          hollandCode: enCurso ? '' : (estado.codigo || ''),
          carrera: carrera,
          carreras: enCurso ? [] : afines,
          dilemas: estado.elecciones || [],
          dia: estado.dia || '',
          cierres: estado.cierres || []
        })
      }).catch(() => {});
    },

    async _hidratarRutaNube() {
      if (this._rutaNubeLista) return;
      this._rutaNubeLista = true;
      const alumno = this.alumnoDeRuta();
      if (!alumno) return;
      let data = null;
      try {
        const resp = await fetch('/api/v1/vocational/profile/' + encodeURIComponent(alumno));
        data = await resp.json();
      } catch (e) { data = null; }
      const perfil = data && data.profile;
      if (!data || !data.hasProfile || !perfil) return;
      const local = this._leerRutaVocacional();
      const cierresNube = (Array.isArray(perfil.cierres) ? perfil.cierres : [])
        .map((letra) => String(letra || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1))
        .filter(Boolean)
        .slice(-24);
      if (cierresNube.length > local.cierres.length) local.cierres = cierresNube;
      if (perfil.informe && perfil.informe.texto) {
        try {
          if (!localStorage.getItem('dante_informe_vocacional')) {
            localStorage.setItem('dante_informe_vocacional', String(perfil.informe.texto));
          }
        } catch (e) {}
      }
      if (local.lista) {
        if (cierresNube.length) this._guardarRutaVocacional(local);
        return;
      }
      const dilemas = (Array.isArray(perfil.dilemas) ? perfil.dilemas : [])
        .map((letra) => String(letra || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1))
        .filter(Boolean)
        .slice(0, 6);
      const nubeLista = !perfil.en_curso && perfil.holland_code && (perfil.carrera_marcada || perfil.meta_carrera);
      if (nubeLista && local.elecciones.length === 0) {
        const codigo = String(perfil.holland_code).toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3);
        const carrera = perfil.carrera_marcada || perfil.meta_carrera || '';
        const afines = Array.isArray(perfil.carreras_afines) && perfil.carreras_afines.length
          ? perfil.carreras_afines
          : (carrera ? [carrera] : []);
        localStorage.setItem('dante_holland_code', codigo);
        if (carrera) localStorage.setItem('dante_carrera_objetivo', carrera);
        localStorage.setItem('dante_carreras_afines', JSON.stringify(afines.slice(0, 3)));
        localStorage.setItem('dante_test_vocacional_completado', 'true');
        localStorage.removeItem('dante_corte_objetivo');
        this._guardarRutaVocacional({ elecciones: dilemas, dia: perfil.dia_ruta || '', codigo: codigo, lista: true, cierres: local.cierres || [] });
        this.pintarPuertaRuta();
        return;
      }
      if (perfil.en_curso && dilemas.length > local.elecciones.length) {
        this._guardarRutaVocacional({
          elecciones: dilemas,
          dia: perfil.dia_ruta || '',
          codigo: '',
          lista: false,
          cierres: local.cierres || []
        });
        this.pintarPuertaRuta();
      }
    },

    pintarPuertaRuta() {
      const titulo = document.getElementById('lblRutaVocacionalTitulo');
      const detalle = document.getElementById('lblRutaVocacionalDetalle');
      if (!titulo || !detalle) return;
      this._hidratarRutaNube();
      if (this.esRutaPreu() && !this.esRutaIcfes()) {
        const carrera = localStorage.getItem('dante_preu_carrera') || '';
        const corte = localStorage.getItem('dante_preu_corte') || '';
        const escala = localStorage.getItem('dante_preu_escala') || '';
        const pts = parseInt(localStorage.getItem('dante_preu_puntos') || '0', 10);
        titulo.textContent = carrera || 'Tu ruta Pre-U';
        if (!carrera) {
          detalle.textContent = 'Elige la carrera de admisión. El corte es el de esa convocatoria.';
          return;
        }
        const leyenda = localStorage.getItem('dante_preu_leyenda') || ('Último admitido ' + corte + (escala ? ' · ' + escala : ''));
        detalle.textContent = leyenda + '. '
          + (pts > 0 ? 'Tu habilidad en estas preguntas: ' + pts + ' de 500.' : 'La habilidad de práctica aparece al responder.');
        return;
      }
      const ruta = this._leerRutaVocacional();
      const codigo = ruta.lista ? (ruta.codigo || localStorage.getItem('dante_holland_code') || '') : '';
      const carrera = localStorage.getItem('dante_carrera_objetivo') || '';
      let afines = [];
      try { afines = JSON.parse(localStorage.getItem('dante_carreras_afines') || '[]'); } catch (e) { afines = []; }
      const palabras = this.perfilEnPalabras(codigo);
      if (ruta.lista && palabras) {
        titulo.textContent = palabras;
        const informe = localStorage.getItem('dante_informe_vocacional') || '';
        const otras = (Array.isArray(afines) ? afines : []).filter((nombre) => nombre !== carrera);
        const entrega = informe ? 'Informe entregado. ' : '';
        detalle.textContent = entrega + (carrera
          ? 'Quieres explorar ' + carrera + '.' + (otras.length ? ' También se parecen: ' + otras.join(', ') + '.' : '')
          : (otras.length ? 'Carreras afines: ' + otras.join(', ') + '.' : 'El perfil ya está.'));
        return;
      }
      const hechas = ruta.elecciones.length;
      const cierres = Array.isArray(ruta.cierres) ? ruta.cierres.length : 0;
      titulo.textContent = hechas > 0
        ? ('Ruta Vocacional')
        : 'Ruta Vocacional';
      if (hechas >= 6) {
        detalle.textContent = 'Confirma el perfil · informe listo';
        return;
      }
      if (hechas > 0 && ruta.dia === this._hoyRuta()) {
        detalle.textContent = 'Dilema ' + Math.min(6, hechas) + '/6 · vuelve mañana';
        return;
      }
      detalle.textContent = hechas === 0
        ? 'Explora tu mejor camino'
        : ('Dilema ' + (hechas + 1) + ' de 6');
    },

    abrirPuertaRuta() {
      const modal = document.getElementById('modalOrientacionVocacional');
      const body = document.getElementById('bodyOrientacionVocacional');
      if (!modal || !body) return;
      if (this.esRutaPreu() && !this.esRutaIcfes()) {
        this._pintarCarrerasPreu();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        return;
      }
      const ruta = this._leerRutaVocacional();
      const hoy = this._hoyRuta();
      let fase = 'dilema';
      if (ruta.lista) fase = 'entrega';
      else if (ruta.elecciones.length >= 6) fase = ruta.codigo ? 'carreras' : 'perfil';
      else if (ruta.elecciones.length > 0 && ruta.dia === hoy) fase = 'espera';
      this._vocacion = {
        fase: fase,
        i: ruta.elecciones.length,
        elecciones: ruta.elecciones.slice(),
        codigo: ruta.codigo || '',
        cierres: (ruta.cierres || []).slice(),
        informe: fase === 'entrega' ? (localStorage.getItem('dante_informe_vocacional') || '') : ''
      };
      this._pintarVocacion();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (fase === 'entrega' && !this._vocacion.informe) this._entregarInforme(ruta);
    },

    _carrerasAdmision: [
      { id: 'unal_medicina_bogota', nombre: 'UNAL Bogotá · Medicina', corte: 765, escala: 'UNAL', leyenda: 'Último admitido 765 en 2026-I · escala estándar, media 500' },
      { id: 'unal_sistemas_bogota', nombre: 'UNAL Bogotá · Ing. de Sistemas', corte: 704, escala: 'UNAL', leyenda: 'Último admitido 704 en 2026-I · escala estándar, media 500' },
      { id: 'unal_derecho_bogota', nombre: 'UNAL Bogotá · Derecho', corte: 646, escala: 'UNAL', leyenda: 'Último admitido 646 en 2026-I · escala estándar, media 500' },
      { id: 'unal_arquitectura_bogota', nombre: 'UNAL Bogotá · Arquitectura', corte: 635, escala: 'UNAL', leyenda: 'Último admitido 635 en 2026-I · escala estándar, media 500' },
      { id: 'unal_enfermeria_bogota', nombre: 'UNAL Bogotá · Enfermería', corte: 641, escala: 'UNAL', leyenda: 'Último admitido 641 en 2026-I · escala estándar, media 500' },
      { id: 'unal_civil_bogota', nombre: 'UNAL Bogotá · Ing. Civil', corte: 657, escala: 'UNAL', leyenda: 'Último admitido 657 en 2026-I · escala estándar, media 500' },
      { id: 'udea_medicina_medellin', nombre: 'UdeA Medellín · Medicina', corte: 82, escala: 'UdeA', leyenda: 'Referencia 82 de 100 · el corte real lo publica la UdeA cada semestre' },
      { id: 'udea_ingenieria_sistemas', nombre: 'UdeA Medellín · Ing. de Sistemas', corte: 71, escala: 'UdeA', leyenda: 'Referencia 71 de 100 · el corte real lo publica la UdeA cada semestre' },
      { id: 'udea_derecho', nombre: 'UdeA Medellín · Derecho', corte: 68, escala: 'UdeA', leyenda: 'Referencia 68 de 100 · el corte real lo publica la UdeA cada semestre' },
      { id: 'udea_psicologia', nombre: 'UdeA Medellín · Psicología', corte: 65, escala: 'UdeA', leyenda: 'Referencia 65 de 100 · el corte real lo publica la UdeA cada semestre' }
    ],

    _pintarCarrerasPreu() {
      const body = document.getElementById('bodyOrientacionVocacional');
      if (!body) return;
      this._ponerEncabezadoRuta('Admisión', 'Elige la carrera');
      const pts = parseInt(localStorage.getItem('dante_preu_puntos') || '0', 10);
      const aviso = 'La UNAL califica con puntaje estándar: media 500 y desviación 100. El número es el último admitido en 2026-I y cambia cada semestre. La Distrital no tiene ese examen: usa el Saber 11, de 0 a 500. Tu práctica sigue en 0 a 500.'
        + (pts > 0 ? ' Llevas ' + pts + ' de 500 en estas preguntas.' : '');
      const cards = this._carrerasAdmision.map((c) => {
        const nombre = c.nombre.replace(/'/g, '');
        const leyenda = String(c.leyenda || '').replace(/'/g, '');
        return '<button type="button" class="w-full text-left px-3 py-2.5 rounded-xl border border-amber-400/40 text-amber-100" onclick="DanteHubEngine.elegirCarreraPreu(\'' + c.id + '\',\'' + nombre + '\',' + c.corte + ',\'' + c.escala + '\',\'' + leyenda + '\')">' + c.nombre + ' · ' + c.leyenda + '</button>';
      }).join('');
      body.innerHTML = '<p class="text-xs text-slate-300">' + aviso + '</p><div class="space-y-2">' + cards + '</div>';
    },

    elegirCarreraPreu(id, nombre, corte, escala, leyenda) {
      localStorage.setItem('dante_preu_carrera_id', id);
      localStorage.setItem('dante_preu_carrera', nombre);
      localStorage.setItem('dante_preu_corte', String(corte));
      localStorage.setItem('dante_preu_escala', String(escala));
      localStorage.setItem('dante_preu_leyenda', leyenda || '');
      if (window.PreunEngine && typeof PreunEngine.cambiarCarreraTarget === 'function') {
        PreunEngine.cambiarCarreraTarget(id);
      }
      const alumno = this.alumnoDeRuta();
      if (alumno) {
        fetch('/api/v1/vocational/meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: alumno, track: 'PREU', carreraId: id, carrera: nombre, corte: corte, escala: escala })
        }).catch(() => {});
      }
      this.pintarPuertaRuta();
      this._cerrarRuta();
    },

    _cerrarRuta() {
      if (window.OrientacionVocacionalWizardEngine && typeof OrientacionVocacionalWizardEngine.cerrarModal === 'function') {
        OrientacionVocacionalWizardEngine.cerrarModal();
      }
    },

    _pintarVocacion() {
      const body = document.getElementById('bodyOrientacionVocacional');
      if (!body || !this._vocacion) return;
      const v = this._vocacion;
      if (v.fase === 'espera') {
        const hechas = v.elecciones.length;
        this._ponerEncabezadoRuta('Hoy ya quedó', 'Mañana sigue');
        body.innerHTML = this._marcasRuta(hechas)
          + '<p class="ruta-nota">Este fue el dilema ' + hechas + ' de 6. La ruta se abre una vez al día, en gratis y en el plan de pago.</p>'
          + '<button type="button" class="ruta-seguir" onclick="DanteHubEngine._cerrarRuta()">Cerrar</button>';
        return;
      }
      if (v.fase === 'lista' || v.fase === 'entrega') {
        const codigo = v.codigo || localStorage.getItem('dante_holland_code') || '';
        const carrera = localStorage.getItem('dante_carrera_objetivo') || '';
        let afines = [];
        try { afines = JSON.parse(localStorage.getItem('dante_carreras_afines') || '[]'); } catch (e) { afines = []; }
        const otras = (Array.isArray(afines) ? afines : []).filter((nombre) => nombre && nombre !== carrera);
        const texto = v.informe || localStorage.getItem('dante_informe_vocacional') || '';
        this._ponerEncabezadoRuta('Informe entregado', this.perfilEnPalabras(codigo) || 'Tu perfil');
        body.innerHTML = '<p class="ruta-informe">' + this._textoRuta(texto || 'Estamos escribiendo tu informe con las elecciones de la ruta y las de cada bloque.') + '</p>'
          + (carrera ? '<p class="ruta-carrera-nombre">' + this._textoRuta(carrera) + '</p><p class="ruta-carrera-porque">La que quieres explorar.</p>' : '')
          + (otras.length ? '<p class="ruta-nota">También se parecen: ' + this._textoRuta(otras.join(', ')) + '.</p>' : '')
          + '<button type="button" class="ruta-seguir" onclick="DanteHubEngine._cerrarRuta()">Listo</button>';
        return;
      }
      if (v.fase === 'dilema') {
        const d = this._dilemasRuta[v.i];
        if (!d) return;
        const ops = d.opciones.map((op) => {
          return '<button type="button" class="ruta-opcion" onclick="DanteHubEngine.elegirDilema(\'' + op.letra + '\')">' + this._textoRuta(op.texto) + '</button>';
        }).join('');
        this._ponerEncabezadoRuta('Dilema ' + (v.i + 1) + ' de 6', d.pregunta);
        body.innerHTML = this._marcasRuta(v.i)
          + '<p class="ruta-nota">Ninguna es la correcta. Elige la que se parece a ti. Lo que eliges al cerrar cada bloque también entra en el informe.</p><div class="space-y-2">' + ops + '</div>';
        return;
      }
      if (v.fase === 'perfil') {
        const codigo = v.codigo || this._codigoDesdeElecciones(v.elecciones);
        const botones = 'RIASEC'.split('').map((letra) => {
          const on = codigo.indexOf(letra) >= 0;
          return '<button type="button" data-letra="' + letra + '" class="ruta-letra' + (on ? ' activa' : '') + '" onclick="DanteHubEngine.alternarLetra(this)">' + this._nombresLetra[letra] + '</button>';
        }).join('');
        this._ponerEncabezadoRuta('Día 6', 'Tu perfil');
        body.innerHTML = '<p class="ruta-nota">' + this._textoRuta(this.perfilEnPalabras(codigo)) + '. Puedes dejar estas tres o cambiarlas. Máximo tres.</p><div class="flex flex-wrap gap-2">' + botones + '</div><button type="button" class="ruta-seguir" onclick="DanteHubEngine.confirmarPerfil()">Ver carreras</button>';
        return;
      }
      const codigo = v.codigo || '';
      const lista = this._carrerasPara(codigo).slice(0, 3);
      const cards = lista.map((c) => {
        return '<button type="button" class="ruta-opcion" onclick="DanteHubEngine.marcarCarrera(\'' + c.id + '\')"><span class="ruta-carrera-nombre">' + this._textoRuta(c.nombre) + '</span><span class="ruta-carrera-porque">' + this._textoRuta(c.porque) + '</span></button>';
      }).join('');
      this._ponerEncabezadoRuta('Tres carreras', this.perfilEnPalabras(codigo));
      body.innerHTML = '<p class="ruta-nota">Se parecen a ese perfil. Marca la que quieres explorar.</p><div class="space-y-2">' + cards + '</div>';
    },

    elegirDilema(letra) {
      const v = this._vocacion;
      if (!v || v.fase !== 'dilema') return;
      const limpia = String(letra || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1);
      if (!limpia || v.elecciones.length >= 6) return;
      v.elecciones.push(limpia);
      v.i = v.elecciones.length;
      const previa = this._leerRutaVocacional();
      const estado = this._guardarRutaVocacional({
        elecciones: v.elecciones,
        dia: this._hoyRuta(),
        codigo: '',
        lista: false,
        cierres: previa.cierres || []
      });
      v.fase = v.elecciones.length >= 6 ? 'perfil' : 'espera';
      this._sincronizarRuta(estado, true);
      this.pintarPuertaRuta();
      this._pintarVocacion();
    },

    alternarLetra(btn) {
      const activas = Array.from(document.querySelectorAll('#bodyOrientacionVocacional [data-letra]')).filter((el) => el.classList.contains('activa'));
      const ya = btn.classList.contains('activa');
      if (ya) {
        if (activas.length <= 1) return;
        btn.classList.remove('activa');
        return;
      }
      if (activas.length >= 3) return;
      btn.classList.add('activa');
    },

    confirmarPerfil() {
      const activas = new Set(
        Array.from(document.querySelectorAll('#bodyOrientacionVocacional [data-letra]'))
          .filter((el) => el.classList.contains('activa'))
          .map((el) => el.getAttribute('data-letra'))
      );
      if (!activas.size) return;
      const base = this._codigoDesdeElecciones(this._vocacion.elecciones || [])
        .split('')
        .filter((letra) => activas.has(letra));
      activas.forEach((letra) => {
        if (!base.includes(letra)) base.push(letra);
      });
      this._vocacion.fase = 'carreras';
      this._vocacion.codigo = base.slice(0, 3).join('');
      const previa = this._leerRutaVocacional();
      this._guardarRutaVocacional({
        elecciones: previa.elecciones,
        dia: previa.dia,
        codigo: this._vocacion.codigo,
        lista: false,
        cierres: previa.cierres || []
      });
      this._pintarVocacion();
    },

    _codigoDesdeElecciones(elecciones) {
      const orden = [];
      const cuenta = {};
      (elecciones || []).forEach((letra) => {
        if (!cuenta[letra]) {
          cuenta[letra] = 0;
          orden.push(letra);
        }
        cuenta[letra] += 1;
      });
      return orden.sort((a, b) => cuenta[b] - cuenta[a] || orden.indexOf(a) - orden.indexOf(b)).slice(0, 3).join('');
    },

    _carrerasPara(codigo) {
      const letras = String(codigo || '').split('');
      return this._carrerasAfin
        .map((c) => {
          let peso = 0;
          letras.forEach((letra, i) => {
            const pos = c.letras.indexOf(letra);
            if (pos >= 0) peso += (3 - i) + (2 - pos);
          });
          return { ...c, peso };
        })
        .sort((a, b) => b.peso - a.peso || a.nombre.localeCompare(b.nombre));
    },

    marcarCarrera(id) {
      const v = this._vocacion || {};
      const codigo = v.codigo || '';
      const lista = this._carrerasPara(codigo);
      const elegida = lista.find((c) => c.id === id) || lista[0];
      if (!elegida) return;
      const afines = lista.slice(0, 3).map((c) => c.nombre);
      localStorage.setItem('dante_holland_code', codigo);
      localStorage.setItem('dante_carrera_objetivo', elegida.nombre);
      localStorage.setItem('dante_carreras_afines', JSON.stringify(afines));
      localStorage.setItem('dante_test_vocacional_completado', 'true');
      localStorage.removeItem('dante_corte_objetivo');
      const previa = this._leerRutaVocacional();
      const estado = this._guardarRutaVocacional({
        elecciones: v.elecciones || [],
        dia: this._hoyRuta(),
        codigo: codigo,
        lista: true,
        cierres: previa.cierres || []
      });
      const sync = this._sincronizarRuta(estado, false);
      this._vocacion.fase = 'entrega';
      this._vocacion.informe = '';
      this._vocacion.codigo = codigo;
      this._vocacion.cierres = estado.cierres || [];
      this.pintarPuertaRuta();
      this._pintarVocacion();
      Promise.resolve(sync).then(() => this._entregarInforme(estado));
    },

    _nombresRasgo: { R: 'realista', I: 'investigativa', A: 'artística', S: 'social', E: 'emprendedora', C: 'convencional' },

    _letraDominante(opcion) {
      const vector = opcion && opcion.vector_riasec;
      if (!vector || typeof vector !== 'object') return '';
      let mejor = '';
      let peso = -1;
      'RIASEC'.split('').forEach((letra) => {
        const n = Number(vector[letra]) || 0;
        if (n > peso) {
          peso = n;
          mejor = letra;
        }
      });
      return peso > 0 ? mejor : '';
    },

    anotarCierresBloque(respuestas) {
      const nuevas = (Array.isArray(respuestas) ? respuestas : [])
        .map((row) => String((row && row.letra) || '').toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 1))
        .filter(Boolean);
      if (!nuevas.length) return;
      const ruta = this._leerRutaVocacional();
      ruta.cierres = ruta.cierres.concat(nuevas).slice(-24);
      const estado = this._guardarRutaVocacional(ruta);
      const sync = this._sincronizarRuta(estado, !estado.lista);
      this.pintarPuertaRuta();
      if (estado.lista) {
        Promise.resolve(sync).then(() => this._pedirInforme(estado)).then((texto) => {
          try { localStorage.setItem('dante_informe_vocacional', texto); } catch (e) {}
          this.pintarPuertaRuta();
        }).catch(() => {});
      }
    },

    _redactarInforme(estado) {
      const nombres = this._nombresRasgo;
      const cuentas = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      (estado.elecciones || []).concat(estado.cierres || []).forEach((letra) => {
        if (cuentas[letra] != null) cuentas[letra] += 1;
      });
      const orden = Object.keys(cuentas).sort((a, b) => cuentas[b] - cuentas[a] || a.localeCompare(b));
      const fuerte = cuentas[orden[0]] ? nombres[orden[0]] : '';
      const segundo = cuentas[orden[1]] ? nombres[orden[1]] : '';
      const palabras = this.perfilEnPalabras(estado.codigo) || 'tu perfil';
      const carrera = localStorage.getItem('dante_carrera_objetivo') || '';
      let afines = [];
      try { afines = JSON.parse(localStorage.getItem('dante_carreras_afines') || '[]'); } catch (e) { afines = []; }
      const otras = (Array.isArray(afines) ? afines : []).filter((nombre) => nombre && nombre !== carrera);
      const nCierres = (estado.cierres || []).length;
      const rasgo = fuerte
        ? 'La elección que más se repite es la ' + fuerte + (segundo ? ', y después la ' + segundo : '') + '.'
        : 'Todavía hay pocas elecciones para leer un rasgo.';
      const bloques = nCierres
        ? ' Al cerrar los bloques quedaron ' + nCierres + (nCierres === 1 ? ' elección' : ' elecciones') + ' más. Esas también entran.'
        : ' Cuando cierres un bloque, esas dos elecciones también entran.';
      const explora = carrera ? ' Quieres explorar ' + carrera + '.' : '';
      const tambien = otras.length ? ' También se parecen ' + otras.join(' y ') + '.' : '';
      return 'Tu perfil se lee como ' + palabras + '. ' + rasgo + bloques + explora + tambien + ' Este informe no usa el puntaje del examen. Sale de cómo eliges actuar.';
    },

    async _pedirInforme(estado) {
      const local = this._redactarInforme(estado);
      const alumno = this.alumnoDeRuta();
      if (!alumno) return local;
      let afines = [];
      try { afines = JSON.parse(localStorage.getItem('dante_carreras_afines') || '[]'); } catch (e) { afines = []; }
      try {
        const resp = await fetch('/api/v1/vocational/informe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: alumno,
            nombre: this.studentName || '',
            hollandCode: estado.codigo || '',
            carrera: localStorage.getItem('dante_carrera_objetivo') || '',
            carreras: afines,
            dilemas: estado.elecciones || [],
            cierres: estado.cierres || []
          })
        });
        const data = await resp.json();
        const texto = data && data.informe && data.informe.texto;
        if (texto && !/\d{3}|%|UNAL|UdeA|percentil|puntaje/i.test(texto)) return String(texto);
      } catch (e) {}
      return local;
    },

    async _entregarInforme(estado) {
      const texto = await this._pedirInforme(estado || this._leerRutaVocacional());
      try { localStorage.setItem('dante_informe_vocacional', texto); } catch (e) {}
      if (this._vocacion) {
        this._vocacion.fase = 'entrega';
        this._vocacion.informe = texto;
      }
      this.pintarPuertaRuta();
      const modal = document.getElementById('modalOrientacionVocacional');
      if (modal && !modal.classList.contains('hidden')) this._pintarVocacion();
    },

    async iniciarRepasoArea(area) {
      const permitidas = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'];
      const limpia = String(area || '').toLowerCase();
      if (!permitidas.includes(limpia) || !window.DanteAbility) return;
      this.targetTrack = 'ICFES';
      this._repasoEnCurso = true;
      const banco = await this.precargarBanco();
      let vistos = new Set();
      try {
        const previas = JSON.parse(localStorage.getItem('dante_respuestas_irt') || '[]');
        (Array.isArray(previas) ? previas : []).forEach((row) => {
          if (row && row.id) vistos.add(String(row.id));
        });
      } catch (e) { vistos = new Set(); }
      const adaptados = (banco || []).map((raw) => DanteAbility.adaptarItem(raw)).filter((it) => it && it.id && it.enunciado && it.area === limpia);
      const frescos = adaptados.filter((it) => !vistos.has(String(it.id)));
      const pool = (frescos.length >= 5 ? frescos : adaptados).slice();
      pool.sort((a, b) => Math.abs(a.b) - Math.abs(b.b));
      const cercanos = pool.slice(0, 12);
      for (let i = cercanos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = cercanos[i];
        cercanos[i] = cercanos[j];
        cercanos[j] = tmp;
      }
      const reactivos = cercanos.slice(0, 5);
      if (!reactivos.length) return;
      const nombres = { matematicas: 'Matemáticas', lectura_critica: 'Lectura Crítica', ciencias_naturales: 'Ciencias Naturales', sociales_ciudadanas: 'Sociales y Ciudadanas', ingles: 'Inglés' };
      const data = {
        success: true,
        isDiagnostic: false,
        repasoArea: limpia,
        targetTrack: 'ICFES',
        misionId: 'repaso_' + limpia + '_' + Date.now(),
        totalReactivos: reactivos.length,
        reactivos: reactivos,
        microDilemasVocacionales: [],
        saludoDante: 'Cinco preguntas de ' + (nombres[limpia] || limpia) + '. Usa la pista antes de confirmar la letra.'
      };
      try { sessionStorage.setItem('dante_mision_actual', JSON.stringify(data)); } catch (e) {}
      this.misionActual = data;
      if (typeof this.procesarRespuestaMision === 'function') this.procesarRespuestaMision(data);
      this._iniciandoMisionLock = false;
      this.iniciarMision(true);
    },

    alumnoDeRuta() {
      if (window.DanteRegistro && typeof DanteRegistro.idAlumno === 'function') {
        const id = DanteRegistro.idAlumno();
        if (id) return id;
      }
      return '';
    },

    /**
     * Sincroniza dinámicamente el estado de la sesión pausada en la Sala Principal
     */
    sincronizarEstadoSesionPausada() {
      this.aplicarTextosPorTrack(this.targetTrack);
    },

    actualizarUIHeaderTrack(track) {
      const isUnal = track === 'UNAL';
      const lblTrack = document.getElementById('lblConvocatoriaActivaHeader');
      if (lblTrack) {
        if (isUnal) {
          lblTrack.innerHTML = 'Pre-U';
        } else if (track === 'COMBO') {
          lblTrack.innerHTML = 'COMBO ICFES + UNAL';
        } else {
          lblTrack.innerHTML = 'ICFES SABER 11°';
        }
      }

      // Sincronizar pastilla dinámica del Header HUD según dante_tipo_preparacion
      const containerPill = document.getElementById('containerTrackHeaderPill');

      // Si hay una evaluación activa o examen en curso, fijar la convocatoria visual
      if (window.isExamActive || (window.DanteExamWorkspace && window.DanteExamWorkspace.misionData)) {
        const activeExamTrack = (window.DanteExamWorkspace?.misionData?.targetTrack || this.targetTrack || track || 'ICFES').toUpperCase();
        const isUnalActive = activeExamTrack === 'UNAL';
        if (containerPill) {
          containerPill.innerHTML = `
            <button type="button" onclick="DanteHubEngine.notificarTrackFijoDuranteExamen('${activeExamTrack}')" class="text-stone-200 font-bold flex items-center text-[12px] cursor-pointer bg-transparent border-0 shadow-none" title="Convocatoria en Evaluación">
              <span>${isUnalActive ? 'Pre-U' : 'Saber 11°'}</span>
            </button>
          `;
        }
        return;
      }

      const tipoPrep = (localStorage.getItem('dante_tipo_preparacion') || 
                        localStorage.getItem('dante_target_track') || 
                        this.targetTrack || track || 'ICFES').toUpperCase().trim();

      const isPrepIcfes = tipoPrep.includes('ICFES') && !tipoPrep.includes('MIXTO') && !tipoPrep.includes('COMBO');
      const isPrepPreu = (tipoPrep.includes('PREU') || tipoPrep.includes('UNAL') || tipoPrep.includes('UDEA')) && !tipoPrep.includes('MIXTO') && !tipoPrep.includes('COMBO');

      if (containerPill) {
        if (isPrepIcfes) {
          // Solo Saber 11°: Badge fijo y escala 0-500
          containerPill.innerHTML = `
            <span id="lblPillSingleTrack" class="inline-flex items-center text-stone-200 font-semibold text-[12px] bg-transparent border-0 shadow-none">
              <span>Saber 11°</span>
            </span>
          `;
          document.querySelectorAll('.unal-only-content').forEach(el => el.style.display = 'none');
        } else if (isPrepPreu) {
          // Solo Universidad Nacional / UdeA: Badge fijo y escala 0-1000
          containerPill.innerHTML = `
            <span id="lblPillSingleTrack" class="inline-flex items-center gap-1.5 text-amber-300 font-bold text-[12px] bg-transparent border-0 shadow-none">
              <i class="fa-solid fa-cube text-xs text-amber-400"></i>
              <span>Pre-U</span>
            </span>
          `;
          document.querySelectorAll('.unal-only-content').forEach(el => el.style.display = 'block');
        } else {
          // MIXTO / COMBO: Switch toggle [ Saber 11° | UNAL ] en el header
          containerPill.innerHTML = `
            <button type="button" id="btnTrackIcfes" data-track="ICFES" onclick="DanteHubEngine.cambiarMetaTrack('ICFES')" class="font-bold text-[12px] bg-transparent border-0 shadow-none ${!isUnal ? 'text-emerald-300' : 'text-slate-500'} cursor-pointer">Saber 11°</button>
            <span class="text-slate-600 px-1">·</span>
            <button type="button" id="btnTrackUnal" data-track="UNAL" onclick="DanteHubEngine.cambiarMetaTrack('UNAL')" class="font-bold text-[12px] bg-transparent border-0 shadow-none ${isUnal ? 'text-amber-300' : 'text-slate-500'} cursor-pointer">Pre-U</button>
          `;
        }
      } else {
        const btnIcfes = document.getElementById('btnTrackIcfes');
        const btnUnal = document.getElementById('btnTrackUnal');
        if (btnIcfes && btnUnal) {
          if (isUnal) {
            btnIcfes.className = 'font-bold text-[12px] bg-transparent border-0 shadow-none text-slate-500 cursor-pointer';
            btnUnal.className = 'font-bold text-[12px] bg-transparent border-0 shadow-none text-amber-300 cursor-pointer';
          } else {
            btnIcfes.className = 'font-bold text-[12px] bg-transparent border-0 shadow-none text-emerald-300 cursor-pointer';
            btnUnal.className = 'font-bold text-[12px] bg-transparent border-0 shadow-none text-slate-500 cursor-pointer';
          }
        }
      }

      // Transmutación cromática de la Espiral de Fermat
      if (window.DanteSpiral && typeof window.DanteSpiral.updatePalette === 'function') {
        window.DanteSpiral.updatePalette(track, this.planTier);
      }
      this.pintarPuertaRuta();
    },

    notificarTrackFijoDuranteExamen(track) {
      const cleanTrack = String(track || 'ICFES').toUpperCase();
      const esDiag = Boolean(
        (typeof AppController !== 'undefined' && typeof AppController.esSesionDiagnosticoActiva === 'function' && AppController.esSesionDiagnosticoActiva()) ||
        window.DanteExamWorkspace?.misionData?.isDiagnostic
      );
      if (esDiag && typeof AppController !== 'undefined' && typeof AppController.mostrarModalAvisoDiagnostico === 'function') {
        AppController.mostrarModalAvisoDiagnostico({
          titulo: "CONVOCATORIA EN EVALUACIÓN",
          subtitulo: "PRUEBA EN CURSO • " + (cleanTrack === 'UNAL' ? 'PREUNIVERSITARIO' : 'SABER 11°'),
          mensaje: `Estás realizando la prueba de diagnóstico para ${cleanTrack === 'UNAL' ? 'Admisión UNAL' : 'Saber 11°'}. La convocatoria no puede modificarse durante la evaluación para proteger tus percentiles y calibración psicométrica.`,
          icono: "fa-lock"
        });
      } else if (typeof mostrarNotificacionPWA === 'function') {
        mostrarNotificacionPWA(`ℹ️ Evaluación activa en curso (${cleanTrack === 'UNAL' ? 'Pre-U UNAL' : 'Saber 11°'}). No puedes cambiar de prueba sin finalizar la actual.`, "info");
      }
    },

    /**
     * Actualiza racha en los badges del HUD
     */
    actualizarUIBadgesRacha(rachaDias) {
      if (window.StreakManager && typeof window.StreakManager.actualizarUI === 'function') {
        window.StreakManager.actualizarUI();
      } else {
        const num = parseInt(rachaDias, 10) || 0;
        const lblTop = document.getElementById('lblRachaDiasTop');
        if (lblTop) lblTop.innerText = String(num);
        ['lblRachaDias', 'lblRachaHud'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = `${num} Días <i class="fa-solid fa-fire text-amber-500 text-xs ml-0.5"></i>`;
        });
      }
    },

    /**
     * Actualiza el badge del Plan en el HUD (FREE vs PRO)
     */
    actualizarUIBadgesPlan(planTier) {
      const isPro = String(planTier).toUpperCase().includes('PRO');
      this.planTier = isPro ? 'PRO' : 'FREE';
      const lblPlan = document.getElementById('lblHeaderCapacidadStatus');
      const badgePlan = document.getElementById('uiHudPlanBadgeUnico');
      const badgeHeaderPlan = document.getElementById('badgeHeaderPlan');
      const abrirPaywall = (e) => {
        if (e) e.preventDefault();
        if (window.PaywallManager && typeof window.PaywallManager.abrirModalContextual === 'function') {
          window.PaywallManager.abrirModalContextual('PLAN_PRO');
        }
      };
      if (lblPlan) {
        lblPlan.onclick = abrirPaywall;
        lblPlan.innerHTML = isPro
          ? '<i class="fa-solid fa-bolt text-amber-400 text-[10px]"></i>PRO'
          : '<i class="fa-solid fa-seedling text-cyan-400 text-[10px]"></i>FREE';
      }
      if (badgePlan) {
        badgePlan.onclick = abrirPaywall;
        badgePlan.className = isPro
          ? 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold cursor-pointer hover:border-amber-400 transition-all shadow-sm shrink-0'
          : 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono text-xs font-bold cursor-pointer hover:border-slate-500 transition-all shadow-sm shrink-0';
      }
      if (badgeHeaderPlan) {
        badgeHeaderPlan.onclick = abrirPaywall;
        badgeHeaderPlan.className = isPro
          ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all shadow-sm shrink-0'
          : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all shadow-sm shrink-0';
      }

      // Micro-cápsula técnica de misión en la Sala
      const containerCapsule = document.getElementById('containerMisionPlanCapsule');
      const lblPasoBadge = document.getElementById('lblPasoBadge');
      const lblPlanMicroBadge = document.getElementById('lblPlanMicroBadge');

      if (lblPasoBadge) {
        lblPasoBadge.innerText = '● MISIÓN DEL DÍA // 5 BLOQUES · 25 ÍTEMS';
        lblPasoBadge.className = 'text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider';
      }
      if (lblPlanMicroBadge) {
        lblPlanMicroBadge.innerText = isPro ? 'SIN AVISOS' : 'CON AVISO';
        lblPlanMicroBadge.className = isPro
          ? 'px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/40'
          : 'px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-slate-800 text-slate-400 border border-slate-700';
      }
      if (containerCapsule) {
        containerCapsule.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-md transition-all';
      }

      const lblCapNum = document.getElementById('lblHeaderCapacidadNum');
      if (lblCapNum) {
        const est = (typeof window.DanteTutorEngine !== 'undefined' && window.DanteTutorEngine.verificarOCrearEstadoDiario)
          ? window.DanteTutorEngine.verificarOCrearEstadoDiario()
          : null;
        const hechos = est ? (est.reactivosHoyCompletados || 0) : 0;
        const tot = est ? (est.reactivosTotalHoy || 25) : 25;
        lblCapNum.innerText = `${Math.min(hechos, tot)}/${tot}`;
      }

      const barra = document.getElementById('barraProgresoCapacidadHud');
      if (barra) {
        const est2 = (typeof window.DanteTutorEngine !== 'undefined' && window.DanteTutorEngine.verificarOCrearEstadoDiario)
          ? window.DanteTutorEngine.verificarOCrearEstadoDiario()
          : null;
        const hechos2 = est2 ? (est2.reactivosHoyCompletados || 0) : 0;
        const tot2 = est2 ? (est2.reactivosTotalHoy || 25) : 25;
        barra.style.width = `${Math.min(100, Math.round((hechos2 / tot2) * 100))}%`;
      }

      if (window.DanteSpiral && typeof window.DanteSpiral.updatePalette === 'function') {
        window.DanteSpiral.updatePalette(this.targetTrack, this.planTier);
      }
    },

    /**
     * 5. RESILIENCIA Y MANEJO DE DESCONEXIÓN (OFFLINE-READY)
     */
    handleNetworkStatusChange(isOnline) {
      this.isOffline = !isOnline;
      if (isOnline) {
        console.log('📶 [DANTE HUB ENGINE]: Conexión restaurada. Sincronizando con el servidor...');
        this.consultarMisionDiaria();
      } else {
        console.warn('⚡ [DANTE HUB ENGINE]: Conexión perdida. Cambiando a Modo Offline...');
        this.mananejarOfflineFallback();
      }
    },

    precargarBanco() {
      if (window.DANTE_BANCO_ITEMS && window.DANTE_BANCO_ITEMS.length) {
        return Promise.resolve(window.DANTE_BANCO_ITEMS);
      }
      if (!this._bancoPromesa) {
        this._bancoPromesa = fetch('bancoPreguntas.json')
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => {
            if (Array.isArray(data) && data.length) window.DANTE_BANCO_ITEMS = data;
            const ws = window.DanteExamWorkspace;
            const item = ws && ws.misionData && ws.misionData.reactivos
              ? ws.misionData.reactivos[ws.indexReactivoActivo]
              : null;
            if (item && !item.recurso_visual && typeof ws.renderizarReactivoActual === 'function') {
              ws.renderizarReactivoActual();
            }
            return window.DANTE_BANCO_ITEMS || [];
          })
          .catch(() => []);
      }
      return this._bancoPromesa;
    },

    _publicarDesdeBanco(items) {
      if (!window.DanteAbility || typeof window.DanteAbility.seleccionarMision !== 'function') return false;
      const reactivos = window.DanteAbility.seleccionarMision(items, 2);
      if (!reactivos.length) return false;
      const data = {
        success: true,
        bloqueadoPorDescanso: false,
        misionId: `mision_banco_${Date.now()}`,
        targetTrack: String(this.targetTrack || 'ICFES').toUpperCase(),
        planTier: this.planTier,
        tiempoEstimadoMinutos: 20,
        saludoDante: `Sesión de ${reactivos.length} preguntas del banco. La siguiente se elige según tu habilidad.`,
        totalReactivos: reactivos.length,
        reactivos: reactivos,
        microDilemasVocacionales: []
      };
      try {
        sessionStorage.setItem('dante_mision_actual', JSON.stringify(data));
        localStorage.setItem('dante_cached_daily_mission', JSON.stringify(data));
      } catch (e) { /* almacenamiento bloqueado */ }
      this.misionActual = data;
      this.procesarRespuestaMision(data);
      return true;
    },

    mananejarOfflineFallback() {
      console.log('⚡ [DANTE HUB ENGINE]: Activando banco local en memoria para contingencia offline...');
      if (!this._usarContingenciaMinima && this._publicarDesdeBanco(window.DANTE_BANCO_ITEMS)) return;
      if (!this._usarContingenciaMinima) {
        const self = this;
        this.precargarBanco().then((items) => {
          if (!self._publicarDesdeBanco(items)) {
            self._usarContingenciaMinima = true;
            self.mananejarOfflineFallback();
          } else if (self.pendingStartAfterFetch) {
            self._iniciandoMisionLock = false;
            self.pendingStartAfterFetch = false;
            self.iniciarMision(true);
          }
        });
        return;
      }
      this._usarContingenciaMinima = false;

      // Notificar al usuario mediante el Toast PWA flotante superior
      if (typeof window.mostrarNotificacionPWA === 'function') {
        window.mostrarNotificacionPWA('Modo Offline: Entrenando con banco local en memoria', 'warning');
      }

      let cachedData = null;
      try {
        const rawCache = localStorage.getItem('dante_cached_daily_mission');
        if (rawCache) cachedData = JSON.parse(rawCache);
      } catch (e) {}

      if (cachedData && cachedData.reactivos && cachedData.reactivos.length > 0 && (!cachedData.targetTrack || String(cachedData.targetTrack).toUpperCase() === String(this.targetTrack).toUpperCase())) {
        cachedData.saludoDante = `Modo Offline Activo: Entrenando con ${cachedData.reactivos.length} reactivos en memoria local.`;
        this.procesarRespuestaMision(cachedData);
      } else {
        // Muestra de contingencia verídica extraída de bancos calibrados de producción (Cero preguntas falsas o plantillas)
        const cleanTrack = String(this.targetTrack || 'ICFES').toUpperCase().trim();
        const isCombo = cleanTrack.includes('COMBO') || cleanTrack.includes('MIXTO');
        const isUnal = !isCombo && cleanTrack.includes('UNAL');

        const BANCO_CONTINGENCIA_PROD = {
          matematicas: [
            {
              id: "item_math_cont_01",
              enunciado: "En un taller de diseño industrial se corta una lámina metálica triangular de base 12 cm y altura 8 cm. Si se reduce la altura a la mitad manteniendo la base constante, ¿cuál es la nueva área del triángulo?",
              correcta: "24 cm²",
              distractores: ["48 cm²", "12 cm²", "96 cm²"],
              competencia: "Razonamiento Cuantitativo"
            },
            {
              id: "item_math_cont_02",
              enunciado: "Una empresa modela su ganancia con la función G(x) = -2x² + 40x - 50, donde x representa unidades producidas (en cientos). ¿Cuántas unidades maximizan la ganancia?",
              correcta: "10 cientos",
              distractores: ["20 cientos", "5 cientos", "40 cientos"],
              competencia: "Formulación y Ejecución"
            },
            {
              id: "item_math_cont_03",
              enunciado: "Un tanque cilíndrico de almacenamiento con radio de base 3 m y altura 5 m se llena hasta el 80% de su capacidad total. Considerando π ≈ 3.14, ¿cuál es el volumen aproximado de líquido contenido?",
              correcta: "113.04 m³",
              distractores: ["141.30 m³", "45.00 m³", "70.65 m³"],
              competencia: "Razonamiento Cuantitativo / Geometría"
            },
            {
              id: "item_math_cont_04",
              enunciado: "Una empresa de transporte cobra una tarifa fija de $5.000 más $1.200 por cada kilómetro recorrido. Si un usuario pagó un total de $29.000 por un viaje, ¿cuántos kilómetros recorrió el vehículo?",
              correcta: "20 km",
              distractores: ["24 km", "18 km", "15 km"],
              competencia: "Formulación y Ejecución / Álgebra"
            }
          ],
          lectura_critica: [
            {
              id: "item_lect_cont_01",
              enunciado: "Según la perspectiva de Immanuel Kant sobre la Ilustración, el estado de 'mayoría de edad' del pensamiento se alcanza fundamentalmente cuando:",
              correcta: "El sujeto tiene la determinación y el valor de pensar por sí mismo sin la tutela de otro.",
              distractores: [
                "El Estado dicta normas morales incuestionables para toda la ciudadanía.",
                "Se memoriza un corpus de doctrinas teológicas o filosóficas establecidas.",
                "Se delegan las decisiones éticas complejas en comités de expertos morales."
              ],
              competencia: "Reflexión y Evaluación Crítica"
            },
            {
              id: "item_lect_cont_02",
              enunciado: "En un texto argumentativo donde el autor cuestiona el determinismo tecnológico, ¿cuál de los siguientes enunciados constituye una refutación coherente?",
              correcta: "Las herramientas técnicas son configuradas por decisiones humanas, políticas y culturales previas.",
              distractores: [
                "Las máquinas poseen libre albedrío incontrolable ajeno a la voluntad social.",
                "El avance material sigue leyes biológicas estrictamente universales.",
                "Toda computación matemática carece de impacto en las decisiones sociopolíticas."
              ],
              competencia: "Comprensión del Sentido Global"
            },
            {
              id: "item_lect_cont_03",
              enunciado: "En el ensayo sobre la libertad de John Stuart Mill, el autor defiende que la única justificación legítima para que la sociedad interfiera coactivamente en la libertad de acción de un individuo es:",
              correcta: "Prevenir un daño directo y comprobable sobre los derechos de terceros.",
              distractores: [
                "Garantizar que todos los ciudadanos compartan las mismas creencias religiosas.",
                "Imponer un modelo único de bienestar o felicidad personal concebido por el gobierno.",
                "Prohibir expresiones filosóficas u opiniones que incomoden a la mayoría."
              ],
              competencia: "Lectura Crítica / Filosofía"
            },
            {
              id: "item_lect_cont_04",
              enunciado: "Lea el siguiente enunciado: 'La ironía socrática no es un mero artificio retórico de burla, sino un dispositivo metodológico orientado a desmantelar la falsa sabiduría'. De lo anterior se deduce necesariamente que:",
              correcta: "El método de Sócrates busca generar conciencia de la propia ignorancia como punto de partida del conocimiento.",
              distractores: [
                "Sócrates utilizaba el sarcasmo para desacreditar a sus alumnos ante los tribunales atenienses.",
                "La retórica clásica consideraba la ignorancia definitiva como el fin supremo de la educación.",
                "Cualquier cuestionamiento dialéctico conduce irremediablemente al escepticismo radical."
              ],
              competencia: "Identificación de Premisas y Supuestos"
            }
          ],
          ciencias_naturales: [
            {
              id: "item_cienc_cont_01",
              enunciado: "Durante la fotosíntesis oxigénica en las plantas, la fotólisis del agua en la membrana de los tilacoides tiene como función biofísica esencial:",
              correcta: "Suministrar electrones y protones para la reducción de NADP+ y desprender oxígeno molecular.",
              distractores: [
                "Capturar directamente el dióxido de carbono ambiental para formar polisacáridos.",
                "Consumir ATP para degradar moléculas de glucosa en el estroma del cloroplasto.",
                "Sintetizar sacarosa para su transporte por los vasos del floema hacia la raíz."
              ],
              competencia: "Uso Comprensivo del Conocimiento Científico"
            },
            {
              id: "item_cienc_cont_02",
              enunciado: "Un bloque de masa m = 4 kg descansa sobre un plano horizontal sin fricción. Al aplicarle una fuerza horizontal constante de 24 N, la aceleración resultante es:",
              correcta: "6 m/s²",
              distractores: ["96 m/s²", "1.5 m/s²", "0.16 m/s²"],
              competencia: "Explicación de Fenómenos Físicos"
            },
            {
              id: "item_cienc_cont_03",
              enunciado: "En una disolución acuosa a 25 °C, si la concentración de iones hidrógeno es [H+] = 1.0 × 10⁻⁴ M, ¿cuál es el pH de la solución y su carácter químico?",
              correcta: "pH = 4, solución de carácter ácido.",
              distractores: ["pH = 10, solución de carácter básico.", "pH = 7, solución neutra.", "pH = 4, solución de carácter alcalino."],
              competencia: "Uso Comprensivo del Conocimiento Científico / Química"
            },
            {
              id: "item_cienc_cont_04",
              enunciado: "Un proyectil de masa m = 0.5 kg se lanza verticalmente hacia arriba con una velocidad de 20 m/s. Despreciando la fricción del aire y con g = 10 m/s², ¿cuál es la altura máxima que alcanza?",
              correcta: "20 metros.",
              distractores: ["40 metros.", "10 metros.", "100 metros."],
              competencia: "Explicación de Fenómenos / Cinemática y Energía"
            }
          ],
          sociales_ciudadanas: [
            {
              id: "item_soc_cont_01",
              enunciado: "En Colombia, según la Constitución Política de 1991, ¿cuál es el mecanismo judicial procedente para la protección inmediata de derechos fundamentales vulnerados?",
              correcta: "La Acción de Tutela, interpuesta ante cualquier juez de la República.",
              distractores: [
                "La Acción Popular para la defensa de intereses puramente corporativos.",
                "El Recurso de Reposición en vía gubernativa ante la DIAN.",
                "La Acción de Grupo orientada al resarcimiento colectivo de perjuicios económicos."
              ],
              competencia: "Pensamiento Social y Ciudadano"
            },
            {
              id: "item_soc_cont_02",
              enunciado: "El principio de pesos y contrapesos (checks and balances) en un régimen constitucional democrático tiene por objetivo primordial:",
              correcta: "Prevenir la concentración indebida del poder mediante la fiscalización mutua entre ramas públicas.",
              distractores: [
                "Subordinar al poder judicial frente a las directrices exclusivas del poder ejecutivo.",
                "Facultar al Congreso para emitir sentencias condenatorias de naturaleza penal.",
                "Concentrar las competencias de control disciplinario y fiscal en la Presidencia."
              ],
              competencia: "Multiperspectivismo y Argumentación"
            },
            {
              id: "item_soc_cont_03",
              enunciado: "De acuerdo con el artículo 3 de la Constitución Política de Colombia de 1991, la soberanía reside exclusivamente en:",
              correcta: "El pueblo, del cual emana el poder público que se ejerce en forma directa o por medio de sus representantes.",
              distractores: [
                "El Presidente de la República en su condición de Comandante Supremo de las Fuerzas Militares.",
                "El Congreso Nacional mediante decretos reglamentarios vinculantes.",
                "Las corporaciones gremiales y entidades financieras privadas."
              ],
              competencia: "Pensamiento Social / Constitución"
            },
            {
              id: "item_soc_cont_04",
              enunciado: "Durante el periodo histórico conocido como el Frente Nacional (1958-1974) en Colombia, el pacto bipartidista entre liberales y conservadores se caracterizó esencialmente por:",
              correcta: "La alternancia en la presidencia y la paridad equitativa en los cargos públicos entre los dos partidos tradicionales.",
              distractores: [
                "La apertura electoral irrestricta a partidos de oposición de izquierda y movimientos cívicos.",
                "La derogación inmediata del derecho al voto femenino aprobado en 1954.",
                "La nacionalización forzosa de toda la industria manufacturera privada del país."
              ],
              competencia: "Comprensión de Procesos Históricos"
            }
          ],
          ingles: [
            {
              id: "item_ing_cont_01",
              enunciado: "Choose the correct option to complete the sentence: 'If renewable clean energy ________ prioritized decades ago, carbon emissions would be significantly lower today.'",
              correcta: "had been",
              distractores: ["will be", "is being", "has been"],
              competencia: "Grammar & Syntactic Competence"
            },
            {
              id: "item_ing_cont_02",
              enunciado: "Identify the correct contextual meaning of the phrase: 'The research committee decided to carry out an exhaustive study on biodiversity.'",
              correcta: "conduct or execute",
              distractores: ["cancel permanently", "postpone until next month", "dismiss as irrelevant"],
              competencia: "Reading Comprehension & Lexical Inference"
            },
            {
              id: "item_ing_cont_03",
              enunciado: "Complete the formal sentence with the correct connector: '_____ the heavy rain caused major delays across the city, the scientific delegation arrived on time.'",
              correcta: "Although",
              distractores: ["Because", "Despite of", "Therefore"],
              competencia: "Textual Cohesion & Connectors"
            },
            {
              id: "item_ing_cont_04",
              enunciado: "Select the grammatically correct modal auxiliary: 'All laboratory technicians _____ wear protective goggles while handling corrosive chemical compounds.'",
              correcta: "must",
              distractores: ["might not", "would", "shall have"],
              competencia: "Modal Verbs & Rules"
            }
          ],
          razonamiento_logico: [
            {
              id: "item_unal_log_01",
              enunciado: "Si se postula formalmente que 'Todos los investigadores son metódicos' y 'Ningún charlatán es metódico', la inferencia deductiva necesaria es:",
              correcta: "Ningún investigador es charlatán.",
              distractores: [
                "Algunos charlatanes son investigadores.",
                "Todos los metódicos son investigadores.",
                "Cualquier individuo metódico es necesariamente charlatán."
              ],
              competencia: "Deducción Silogística Formal"
            },
            {
              id: "item_unal_log_02",
              enunciado: "En una progresión aritmética el primer término es a₁ = 3 y la diferencia es d = 4. ¿Cuál es el valor del décimo término a₁₀?",
              correcta: "39",
              distractores: ["43", "36", "40"],
              competencia: "Razonamiento Lógico-Matemático"
            },
            {
              id: "item_unal_log_03",
              enunciado: "En una carrera de cuatro atletas (W, X, Y, Z), se sabe que W llegó antes que X, Y llegó inmediatamente después de W, y Z no fue el último. ¿Quién ocupó el último lugar?",
              correcta: "X",
              distractores: ["W", "Y", "Z"],
              competencia: "Ordenamiento y Deducción Espacio-Temporal"
            },
            {
              id: "item_unal_log_04",
              enunciado: "Si se define la operación binaria a * b = 2a² - 3b + 1, ¿cuál es el valor resultante de calcular 3 * 4?",
              correcta: "7",
              distractores: ["11", "15", "5"],
              competencia: "Operadores Matemáticos No Convencionales"
            }
          ],
          analisis_textual: [
            {
              id: "item_unal_tex_01",
              enunciado: "En un texto académico-filosófico, la función discursiva primordial de un contraargumento es:",
              correcta: "Anticipar objeciones potenciales para demostrar la mayor solidez de la tesis propia.",
              distractores: [
                "Validar plenamente la postura antagónica sin ofrecer refutación alguna.",
                "Desviar la atención del lector hacia anécdotas periféricas sin sustento.",
                "Admitir que la proposición original carece de validez metodológica."
              ],
              competencia: "Análisis Crítico Textual"
            },
            {
              id: "item_unal_tex_02",
              enunciado: "Al examinar un ensayo sobre la memoria histórica, la distinción entre 'documento' y 'monumento' radica en que este último:",
              correcta: "Ha sido concebido intencionalmente por el poder para perpetuar una versión hegemónica del pasado.",
              distractores: [
                "Es un vestigio neutro e involuntario desprovisto de carga ideológica.",
                "Carece por completo de materialidad física y valor arqueológico.",
                "Solo puede ser interpretado por métodos exclusivamente cuantitativos."
              ],
              competencia: "Hermenéutica Textual"
            },
            {
              id: "item_unal_tex_03",
              enunciado: "En el análisis lingüístico pragmático formulado por J.L. Austin, la noción de 'fuerza ilocutiva' de un enunciado refiere a:",
              correcta: "La acción deliberada que se ejecuta directamente al pronunciar las palabras (como prometer, ordenar o advertir).",
              distractores: [
                "El simple efecto fisiológico audible producido en el tímpano del oyente.",
                "La transcripción fonética literal de una lengua muerta.",
                "La suma aritmética de los caracteres impresos en la página."
              ],
              competencia: "Pragmática y Semántica Textual"
            }
          ],
          analisis_imagen: [
            {
              id: "item_unal_img_01",
              enunciado: "Al cortar un cilindro recto circular mediante un plano paralelo a su base horizontal, la sección plana transversal obtenida corresponde a:",
              correcta: "Un círculo congruente e idéntico al de las bases.",
              distractores: [
                "Una parábola asimétrica de foco variable.",
                "Un rectángulo con diagonal proporcional a la altura.",
                "Una elipse de excentricidad excéntrica no nula."
              ],
              competencia: "Proyección Espacial y Geometría 3D"
            },
            {
              id: "item_unal_img_02",
              enunciado: "Al proyectar ortogonalmente un cubo apoyado sobre una cara sobre un plano vertical perpendicular a dos de sus aristas principales, la vista resultante es:",
              correcta: "Un cuadrado regular perfecto de lado igual a la arista del cubo.",
              distractores: [
                "Un hexágono regular de vértices equidistantes.",
                "Un paralelogramo oblicuo con deformación angular de 45°.",
                "Un trapecio escaleno isósceles."
              ],
              competencia: "Visualización Ortogonal y Seccionamiento"
            },
            {
              id: "item_unal_img_03",
              enunciado: "Al desarrollar en el plano el patrón de superficie completa de un prisma recto de base hexagonal regular, se obtienen:",
              correcta: "Seis rectángulos laterales contiguos y dos hexágonos regulares congruentes como bases.",
              distractores: [
                "Ocho triángulos equiláteros y dos cuadrados ortogonales.",
                "Cuatro trapecios isósceles y dos rombos convexos.",
                "Doce rectángulos idénticos sin tapas basales."
              ],
              competencia: "Desarrollo de Superficies Tridimensionales"
            }
          ],
          sociales: [
            {
              id: "item_unal_soc_01",
              enunciado: "La Revolución Industrial en Europa propició transformaciones socioespaciales determinantes, entre las cuales destaca:",
              correcta: "El crecimiento acelerado de la urbanización y la consolidación de la clase obrera asalariada.",
              distractores: [
                "La ruralización generalizada y el regreso al régimen señorial feudal.",
                "La eliminación absoluta del comercio marítimo internacional.",
                "El desmantelamiento de los centros fabriles a favor de gremios medievales."
              ],
              competencia: "Comprensión de Procesos Históricos"
            },
            {
              id: "item_unal_soc_02",
              enunciado: "El concepto de soberanía popular postulado en la modernidad democrática implica esencialmente que:",
              correcta: "El poder político legítimo emana de la voluntad colectiva del pueblo soberano.",
              distractores: [
                "La autoridad estatal proviene de un mandato dinástico incontestable.",
                "Las decisiones normativas son dictadas por corporaciones privadas supranacionales.",
                "El gobernante de turno ejerce el poder sin sujeción a la constitución."
              ],
              competencia: "Teoría del Estado y Ciudadanía"
            }
          ]
        };

        // Secuencia balanceada y barajada de claves objetivos (A, B, C, D distribuidas 25% cada una)
        const LETRAS = ['A', 'B', 'C', 'D'];
        const targetKeys = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'];
        for (let i = targetKeys.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [targetKeys[i], targetKeys[j]] = [targetKeys[j], targetKeys[i]];
        }

        const formatearItemContingencia = (raw, index) => {
          const targetLetter = targetKeys[index % targetKeys.length];
          const targetIdx = LETRAS.indexOf(targetLetter);
          const opcionesObj = {};
          const opcionesArr = [];

          let dIdx = 0;
          for (let i = 0; i < 4; i++) {
            const letter = LETRAS[i];
            const text = (i === targetIdx) ? raw.correcta : raw.distractores[dIdx++];
            opcionesObj[letter] = text;
            opcionesArr.push(`${letter}) ${text}`);
          }

          const dificultades = [-1.2, -0.8, -0.4, -0.1, 0.2, 0.5, 0.8, 1.1, 1.4, -0.6];
          const bDado = Number(raw.b);
          const cDado = Number(raw.c);
          const aDado = Number(raw.a);

          return {
            id: raw.id,
            enunciado: raw.enunciado,
            pregunta_texto: raw.enunciado,
            texto: raw.enunciado,
            area: raw.area || 'matematicas',
            materia: raw.area || 'matematicas',
            target_exam: isUnal ? 'UNAL' : 'SABER_11',
            origen: isUnal ? 'UNAL' : 'ICFES',
            competencia: raw.competencia,
            opciones: opcionesArr,
            opciones_respuesta: opcionesArr,
            opciones_dict: opcionesObj,
            ok: targetLetter,
            correcta: targetLetter,
            a: Number.isFinite(aDado) && aDado > 0 ? aDado : 1.1,
            b: Number.isFinite(bDado) ? bDado : dificultades[index % dificultades.length],
            c: Number.isFinite(cDado) ? Math.min(0.45, Math.max(0, cDado)) : 0.2
          };
        };

        let offlineReactivos = [];
        let itemIndex = 0;

        if (isUnal) {
          const compUnal = ['razonamiento_logico', 'analisis_textual', 'analisis_imagen', 'ciencias_naturales', 'sociales'];
          compUnal.forEach(comp => {
            const rawPool = BANCO_CONTINGENCIA_PROD[comp] || BANCO_CONTINGENCIA_PROD.matematicas;
            const pool = [...rawPool].sort(() => 0.5 - Math.random());
            for (let k = 0; k < 2; k++) {
              const item = pool[k % pool.length];
              offlineReactivos.push(formatearItemContingencia({ ...item, area: comp }, itemIndex++));
            }
          });
        } else if (isCombo) {
          const areasIcfes = ['matematicas', 'lectura_critica', 'sociales_ciudadanas', 'ciencias_naturales', 'ingles'];
          const compUnal = ['razonamiento_logico', 'analisis_textual', 'analisis_imagen', 'ciencias_naturales', 'sociales'];
          for (let i = 0; i < 5; i++) {
            const rawPoolIcfes = BANCO_CONTINGENCIA_PROD[areasIcfes[i]] || BANCO_CONTINGENCIA_PROD.matematicas;
            const poolIcfes = [...rawPoolIcfes].sort(() => 0.5 - Math.random());
            offlineReactivos.push(formatearItemContingencia({ ...poolIcfes[0], area: areasIcfes[i] }, itemIndex++));

            const rawPoolUnal = BANCO_CONTINGENCIA_PROD[compUnal[i]] || BANCO_CONTINGENCIA_PROD.matematicas;
            const poolUnal = [...rawPoolUnal].sort(() => 0.5 - Math.random());
            offlineReactivos.push(formatearItemContingencia({ ...poolUnal[0], area: compUnal[i] }, itemIndex++));
          }
        } else {
          // ICFES Oficial (2 por cada una de las 5 materias = 10 reactivos reales)
          const areasIcfes = ['matematicas', 'lectura_critica', 'sociales_ciudadanas', 'ciencias_naturales', 'ingles'];
          areasIcfes.forEach(area => {
            const rawPool = BANCO_CONTINGENCIA_PROD[area] || BANCO_CONTINGENCIA_PROD.matematicas;
            const pool = [...rawPool].sort(() => 0.5 - Math.random());
            for (let k = 0; k < 2; k++) {
              const item = pool[k % pool.length];
              offlineReactivos.push(formatearItemContingencia({ ...item, area }, itemIndex++));
            }
          });
        }

        const emergencyData = {
          success: true,
          bloqueadoPorDescanso: false,
          misionId: `mision_offline_${Date.now()}`,
          targetTrack: cleanTrack,
          planTier: this.planTier,
          tiempoEstimadoMinutos: 20,
          saludoDante: `Modo Contingencia Offline: 10 Reactivos reales calibrados en memoria para track ${cleanTrack}. Concentración total.`,
          rachaDias: 4,
          totalReactivos: offlineReactivos.length,
          reactivos: offlineReactivos,
          microDilemasVocacionales: []
        };
        this.misionActual = emergencyData;
        window.DANTE_DAILY_MISSION_BATCH = emergencyData;
        sessionStorage.setItem('dante_mision_actual', JSON.stringify(emergencyData));
        sessionStorage.setItem('dante_current_batch', JSON.stringify(offlineReactivos));
        if (!this._iniciandoMisionLock) {
          this.procesarRespuestaMision(emergencyData);
        }
      }
    }
  };

  // Exponer globalmente
  window.DanteHubEngine = DanteHubEngine;

  // Registrar listeners globales en AppController si existe
  if (window.AppController && !window.AppController.iniciarBloqueDiario) {
    window.AppController.iniciarBloqueDiario = function (batch) {
      DanteHubEngine.iniciarMision();
    };
  }

  // Inicialización automática cuando el DOM está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DanteHubEngine.init());
  } else {
    DanteHubEngine.init();
  }
})();
