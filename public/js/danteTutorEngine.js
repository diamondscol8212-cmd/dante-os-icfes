// public/js/danteTutorEngine.js - Sistema de Tutoría de Élite, Prescripción Diaria y Consolidación Sináptica (Dante OS v23.1.0-ENTERPRISE)
// Bogotá, Colombia

class DanteTutorEngine {
    static INTERVALO_CONSOLIDACION_MS = 6 * 60 * 60 * 1000; // 6 horas de consolidación en memoria a largo plazo

    static _storageGet(key, defaultVal) {
        if (typeof DanteStorage !== 'undefined') {
            return DanteStorage.get(key, defaultVal);
        }
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : defaultVal;
        } catch(e) {
            return defaultVal;
        }
    }

    static _storageSet(key, value) {
        if (typeof DanteStorage !== 'undefined') {
            return DanteStorage.set(key, value);
        }
        try {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } catch(e) {}
    }

    /**
     * Inicializa el estado del Tutor y la dosis del día
     */
    static init() {
        this.verificarOCrearEstadoDiario();
        this.iniciarRelojConsolidacionUI();
    }

    /**
     * Verifica la fecha actual y resetea o recupera el progreso de la dosis diaria
     */
    static verificarOCrearEstadoDiario() {
        const hoyStr = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
        let estado = this._storageGet('dante_tutor_diario_v2', null);

        // Misma dosis diaria para todos (pago solo quita anuncios).
        let reactivosTotalHoy = 25;
        let reactivosPorBloque = 5;
        const totalBloquesDiarios = 5;
        const isProUser = typeof VidasManager !== 'undefined' && VidasManager.isPro();

        if (!estado || estado.fecha !== hoyStr) {
            // Nuevo día de entrenamiento
            estado = {
                fecha: hoyStr,
                bloqueActual: 1,
                totalBloquesDiarios: totalBloquesDiarios,
                reactivosPorBloque: reactivosPorBloque,
                reactivosTotalHoy: reactivosTotalHoy,
                reactivosHoyCompletados: 0,
                bloquesCompletados: 0,
                ultimaSesionTimestamp: null,
                proximoBloqueTimestamp: null,
                modoMaratonActivo: false
            };
            this._storageSet('dante_tutor_diario_v2', estado);
        } else {
            // Asegurar que si cambió la membresía en la sesión, se actualicen los objetivos
            estado.reactivosTotalHoy = reactivosTotalHoy;
            estado.reactivosPorBloque = reactivosPorBloque;
            estado.totalBloquesDiarios = totalBloquesDiarios;
            this._storageSet('dante_tutor_diario_v2', estado);
        }

        return estado;
    }

    /**
     * Registra un reactivo resuelto en la dosis del día actual
     * @param {boolean} esCorrecto 
     */
    static registrarReactivoResuelto(esCorrecto = true) {
        if (localStorage.getItem('dante_modo_refuerzo_active') === 'true') {
            // Módulo de Refuerzo Autónomo: No gasta ni avanza los bloques prescriptivos del día
            return this.verificarOCrearEstadoDiario();
        }

        let estado = this.verificarOCrearEstadoDiario();
        estado.reactivosHoyCompletados += 1;

        // Comprobar si se completó el bloque actual
        const reactivosEnBloqueActual = estado.reactivosHoyCompletados % estado.reactivosPorBloque;
        if (reactivosEnBloqueActual === 0 && estado.reactivosHoyCompletados > 0) {
            // Completó un bloque
            estado.bloquesCompletados += 1;
            estado.ultimaSesionTimestamp = Date.now();
            estado.proximoBloqueTimestamp = Date.now() + this.INTERVALO_CONSOLIDACION_MS;
            
            if (estado.bloqueActual < estado.totalBloquesDiarios) {
                estado.bloqueActual += 1;
            }
        }

        this._storageSet('dante_tutor_diario_v2', estado);
        this.actualizarUIPorTodasPartes();
        return estado;
    }

    /**
     * Calcula el tiempo restante para el siguiente bloque de consolidación
     */
    static obtenerTiempoConsolidacionRestante() {
        const estado = this.verificarOCrearEstadoDiario();
        if (!estado.proximoBloqueTimestamp) return { horas: 0, minutos: 0, segundos: 0, listo: true, msRestantes: 0 };

        const diff = estado.proximoBloqueTimestamp - Date.now();
        if (diff <= 0) {
            return { horas: 0, minutos: 0, segundos: 0, listo: true, msRestantes: 0 };
        }

        const totalSegs = Math.floor(diff / 1000);
        const horas = Math.floor(totalSegs / 3600);
        const mins = Math.floor((totalSegs % 3600) / 60);
        const segs = totalSegs % 60;

        return {
            horas,
            minutos: mins,
            segundos: segs,
            listo: false,
            msRestantes: diff
        };
    }

    /**
     * Inicia un temporizador dinamico que refresca la UI de consolidacion cada segundo
     */
    static iniciarRelojConsolidacionUI() {
        if (window._danteRelojConsolidacionTimer) {
            clearInterval(window._danteRelojConsolidacionTimer);
        }

        this.renderizarTarjetaTutoriaDashboard();

        window._danteRelojConsolidacionTimer = setInterval(() => {
            this.renderizarTarjetaTutoriaDashboard();
        }, 1000);
    }

    /**
     * Renderiza la tarjeta principal de Tutoría y Consolidación Sináptica en index.html
     */
    static renderizarTarjetaTutoriaDashboard() {
        const container = document.getElementById('uiModuloTutoriaDanteDashboard');
        if (!container) return;

        const estado = this.verificarOCrearEstadoDiario();
        const tiempoRest = this.obtenerTiempoConsolidacionRestante();

        const nombreEstudiante = localStorage.getItem('dante_student_name') || 'Estudiante';
        const pactoMeta = localStorage.getItem('dante_pacto_meta') || '380_ELITE';
        const modoLibre = localStorage.getItem('dante_modo_libre') === 'true'
            || localStorage.getItem('dante_pacto_calendario') === 'LIBRE';
        const fechaTexto = modoLibre
            ? 'Entrenamiento libre'
            : (localStorage.getItem('dante_pacto_fecha_texto') || 'Agosto 2026');
        const diasRestantes = modoLibre
            ? ''
            : (localStorage.getItem('dante_pacto_dias_restantes') || '160');
        const pactoTiempo = localStorage.getItem('dante_pacto_tiempo') || '15_FREE';

        let metaTxt = "380+ Pts Saber 11°";
        if (pactoMeta === 'PREUNIVESITARIO') metaTxt = "Admisión UNAL / UdeA";
        else if (pactoMeta === '300_BASE') metaTxt = "300+ Pts ICFES Base";

        const totalHoy = estado.reactivosTotalHoy;
        const hechosHoy = estado.reactivosHoyCompletados;
        const pctProgresoHoy = Math.min(100, Math.round((hechosHoy / totalHoy) * 100));

        let htmlTimer = "";
        let mensajeDante = "";
        let badgeEstado = "";

        if (hechosHoy >= totalHoy) {
            // Dosis completa del día cumplida
            badgeEstado = `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold text-[10px] uppercase">🟢 DOSIS CUMPLIDA HOY</span>`;
            mensajeDante = `"¡Excelente trabajo, ${nombreEstudiante}! Has resuelto los <strong>${totalHoy} reactivos adaptativos</strong> previstos para hoy. Tu cerebro ha consolidado la información. Si deseas continuar practicando, puedes activar el <strong>Modo Maratón Extra</strong>."`;
            htmlTimer = `
                <div class="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                    <span class="text-[10px] font-mono text-emerald-300 uppercase font-bold block">🎉 DOSIS DIARIA COMPLETA (100%)</span>
                    <span class="text-sm font-black text-emerald-200 font-mono">Mañana tendrás nuevos reactivos calibrados</span>
                </div>
            `;
        } else if (estado.bloquesCompletados > 0 && !tiempoRest.listo) {
            // En periodo de consolidación sináptica de 6 horas entre bloques
            const hStr = String(tiempoRest.horas).padStart(2, '0');
            const mStr = String(tiempoRest.minutos).padStart(2, '0');
            const sStr = String(tiempoRest.segundos).padStart(2, '0');

            const proximaHora = new Date(estado.proximoBloqueTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            badgeEstado = `<span class="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-[10px] uppercase">⏳ CONSOLIDACIÓN SINÁPTICA (${hStr}:${mStr}:${sStr})</span>`;
            mensajeDante = `"${nombreEstudiante}: Has resuelto el Bloque ${estado.bloquesCompletados} de hoy. Tu corteza cerebral necesita 6 horas para consolidar las redes neuronales sin sobrecargar la memoria de trabajo. <strong>Hora recomendada de regreso: ${proximaHora}</strong>. Si prefieres continuar ahora, puedes adelantar el Bloque ${estado.bloqueActual}."`;

            htmlTimer = `
                <div class="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-center space-y-1">
                    <span class="text-[10px] font-mono text-amber-300 uppercase font-bold block">⏱️ TIEMPO RESTANTE PARA BLOQUE ${estado.bloqueActual} DE HOY:</span>
                    <span class="text-2xl font-black text-amber-200 font-mono tracking-wider">${hStr}h ${mStr}m ${sStr}s</span>
                    <span class="text-[10px] text-slate-300 block font-sans">Consolidación en proceso • Próxima cita ideal: ${proximaHora}</span>
                </div>
            `;
        } else {
            // Listo para el bloque actual
            badgeEstado = `<span class="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-[10px] uppercase">⚡ LISTO PARA BLOQUE ${estado.bloqueActual} OFICIAL</span>`;
            mensajeDante = `"${nombreEstudiante}: Tu cerebro está fresco y listo para el <strong>Bloque ${estado.bloqueActual} de hoy</strong> (${estado.reactivosPorBloque} reactivos). Mantén cero adivinación y lee cuidadosamente el enunciado."`;

            htmlTimer = `
                <div class="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-center space-y-1">
                    <span class="text-[10px] font-mono text-cyan-300 uppercase font-bold block">🟢 VENTANA DE ENTRENAMIENTO ABIERTA:</span>
                    <span class="text-lg font-black text-cyan-200 font-mono">Bloque ${estado.bloqueActual} de ${estado.totalBloquesDiarios} (${estado.reactivosPorBloque} Reactivos Calibrados)</span>
                </div>
            `;
        }

        // Generación dinámica de la grilla de Bloques Diarios (Bloques 1 al 5)
        const isProUser = typeof VidasManager !== 'undefined' && VidasManager.isPro();
        let htmlBloquesGrid = `
            <div class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                    <span class="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> PLAN DE ENTRENAMIENTO DIARIO
                    </span>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-[11px]">Progreso: ${hechosHoy}/${totalHoy} Ítems</span>
                        <button type="button" onclick="window.togglePlanModoSimulador()" class="px-2 py-0.5 rounded-lg bg-slate-950 border border-amber-500/50 hover:bg-slate-900 text-amber-300 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm" title="Alternar entre Plan Gratis y Plan PRO para probar la vista">
                            <span><i class="fa-solid fa-arrows-rotate text-amber-400"></i> Probando: ${isProUser ? '<i class="fa-solid fa-crown text-amber-300"></i> Plan PRO' : '<i class="fa-solid fa-gem text-cyan-300"></i> Plan Gratis'}</span>
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
        `;

        for (let b = 1; b <= 5; b++) {
            const itemsFinBloque = b * estado.reactivosPorBloque;
            const esCompletado = hechosHoy >= itemsFinBloque;
            const esActual = (estado.bloqueActual === b) && !esCompletado && (hechosHoy < totalHoy);
            
            let cardStyle = "p-3 rounded-2xl text-center flex flex-col justify-between h-full relative overflow-hidden transition-all duration-200 gap-2 ";
            let badgeTxt = "";
            let actionBtn = "";

            if (esCompletado) {
                cardStyle += "bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400/60";
                badgeTxt = `<span class="text-[9.5px] font-mono font-bold text-emerald-400 block flex items-center justify-center gap-1 py-0.5"><i class="fa-solid fa-check text-emerald-400 text-[9px]"></i> COMPLETADO</span>`;
                actionBtn = `<button type="button" onclick="AppController.iniciarBloqueDiario(${b})" class="w-full py-2 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold transition-all cursor-pointer border border-emerald-500/30 flex items-center justify-center gap-1.5"><i class="fa-solid fa-rotate-right text-emerald-300 text-[9px]"></i> Repasar</button>`;
            } else if (esActual) {
                cardStyle += "bg-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.4)]";
                badgeTxt = `<span class="text-[9.5px] font-mono font-extrabold text-cyan-300 block animate-pulse flex items-center justify-center gap-1 py-0.5"><i class="fa-solid fa-bolt text-amber-400 text-[9px]"></i> BLOQUE ACTIVO</span>`;
                actionBtn = `<button type="button" onclick="AppController.iniciarBloqueDiario(${b})" class="w-full py-2 px-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-[10.5px] font-mono font-black uppercase shadow-md transition-all cursor-pointer border border-cyan-200 flex items-center justify-center gap-1.5"><i class="fa-solid fa-play text-slate-950 text-[9px]"></i> INICIAR</button>`;
            } else {
                cardStyle += "bg-slate-900/90 border border-slate-700/80 hover:border-slate-600";
                badgeTxt = `<span class="text-[9.5px] font-mono text-cyan-400/90 block flex items-center justify-center gap-1 py-0.5"><i class="fa-solid fa-lock-open text-cyan-400 text-[9px]"></i> DISPONIBLE</span>`;
                actionBtn = `<button type="button" onclick="AppController.iniciarBloqueDiario(${b})" class="w-full py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono font-bold transition-all cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"><i class="fa-solid fa-play text-cyan-400 text-[9px]"></i> Iniciar</button>`;
            }

            const labelBloque = `Bloque ${b}`;
            const subLabel = "5 Ítems";

            htmlBloquesGrid += `
                <div class="${cardStyle}">
                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-200 gap-1">
                        <span class="font-mono">${labelBloque}</span>
                        <span class="text-[9.5px] font-mono text-slate-400">${subLabel}</span>
                    </div>
                    ${badgeTxt}
                    ${actionBtn}
                </div>
            `;
        }
        htmlBloquesGrid += `</div></div>`;

        // Examen Semanal y Simulacro General Countdown Widget
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        let daysUntilSat = 6 - dayOfWeek;
        if (daysUntilSat < 0) daysUntilSat += 7;

        const isProUserWidget = typeof VidasManager !== 'undefined' && VidasManager.isPro();
        const simGeneralUsed = localStorage.getItem('dante_simulacro_general_free_used') === 'true';

        const htmlExamenSemanalWidget = `
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-950 to-amber-950/80 border-2 border-purple-500/40 text-left space-y-4 relative overflow-hidden font-mono shadow-2xl">
                <div class="flex items-center justify-between border-b border-purple-500/30 pb-2.5">
                    <h4 class="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-trophy text-amber-400 text-sm sm:text-base"></i> CENTRO DE EVALUACIÓN OFICIAL Y CERTIFICACIÓN
                    </h4>
                    <span class="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1.5">
                        ${isProUserWidget ? '<i class="fa-solid fa-ban text-amber-300"></i> SIN ANUNCIOS' : '<i class="fa-solid fa-layer-group text-cyan-400"></i> GRATIS (CON AVISO)'}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <!-- 1. GRAN EXAMEN SEMANAL DE CERTIFICACIÓN -->
                    <div class="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2.5 flex flex-col justify-between hover:border-purple-500/60 transition-all">
                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                    <i class="fa-solid fa-award text-amber-400"></i> GRAN EXAMEN SEMANAL
                                </span>
                                <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">Gratis & PRO</span>
                            </div>
                            <p class="text-[11px] text-slate-300 font-sans leading-tight">Mide tu retención acumulada de la semana y descubre tu proyección de corte universitario.</p>
                        </div>
                        <div>
                            ${isWeekend ? `
                                <button type="button" onclick="AppController.iniciarSimulacroSemanal()" class="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-breathe">
                                    <i class="fa-solid fa-fire text-slate-950"></i> RENDIR EXAMEN SEMANAL AHORA
                                </button>
                            ` : `
                                <button type="button" onclick="AppController.iniciarSimulacroSemanal()" class="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5">
                                    <i class="fa-solid fa-clock text-amber-400"></i> Disponible Fin de Semana (${daysUntilSat}d)
                                </button>
                            `}
                        </div>
                    </div>

                    <!-- 2. SIMULACRO GENERAL COMPLETO (200 PREGUNTAS / 4.5 HORAS) -->
                    <div class="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2.5 flex flex-col justify-between hover:border-amber-500/60 transition-all">
                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                    <i class="fa-solid fa-graduation-cap text-cyan-400"></i> SIMULACRO GENERAL COMPLETO
                                </span>
                                <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                                    Para todos
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-300 font-sans leading-tight">Simulacro largo Saber 11° (254 preguntas, 2 sesiones). Igual para todos; el plan solo quita anuncios.</p>
                        </div>
                        <div>
                            <button type="button" onclick="if(window.DanteSimulacro){DanteSimulacro.abrir();}else if(window.SimulacroEngine){SimulacroEngine.prepararYConfirmar(254,120,'Simulacro Oficial');}" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5">
                                <i class="fa-solid fa-bolt text-slate-950"></i> Abrir simulacro (254 Q)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Obtener variables de personalización del estudiante
        const arquetipoActual = localStorage.getItem("dante_user_arquetipo") || "Estratega Reflexivo S2";
        const estadoCognitivoHoy = (localStorage.getItem("dante_estado_cognitivo_hoy") || "NORMAL").toUpperCase();
        const thetaActual = (typeof AppState !== 'undefined' && AppState.theta !== undefined) ? AppState.theta.toFixed(2) : "0.00";

        container.innerHTML = `
            <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-cyan-950/40 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] text-left space-y-4 font-mono relative overflow-hidden">
                <!-- Header del Organizador -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cyan-500/30 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl shadow-md font-bold shrink-0">
                            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-xs sm:text-sm font-extrabold text-cyan-300 uppercase tracking-wider">ORGANIZADOR DE TUTORÍA Y DOSIS DIARIA</h3>
                            </div>
                            <span class="text-[11px] text-slate-400 font-sans">Profesor Dante OS • Prescripción Basada en Curva del Olvido</span>
                        </div>
                    </div>
                    <div>
                        ${badgeEstado}
                    </div>
                </div>

                <!-- Info de Calendario & Días Restantes -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-200">
                    <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span class="text-[10px] text-slate-400 block uppercase flex items-center gap-1"><svg class="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${modoLibre ? 'Modo de estudio:' : 'Ventana de Examen:'}</span>
                        <strong class="text-teal-300 text-xs font-bold block truncate mt-0.5">${fechaTexto}</strong>
                        <span class="text-[10px] text-cyan-400 font-bold block mt-0.5 flex items-center gap-1"><svg class="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${modoLibre ? 'Sin fecha · avanza a tu meta' : ((diasRestantes || '—') + ' Días Restantes')}</span>
                    </div>

                    <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span class="text-[10px] text-slate-400 block uppercase flex items-center gap-1"><svg class="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> Meta Seleccionada:</span>
                        <strong class="text-amber-300 text-xs font-bold block truncate mt-0.5">${metaTxt}</strong>
                        <span class="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1"><svg class="w-3 h-3 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg> ${pactoTiempo === '45_PRO' ? '45 Min/día (Maratón)' : (pactoTiempo === '30_PRO' ? '30 Min/día (Intensivo)' : '15 Min/día (Normal)')}</span>
                    </div>

                    <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span class="text-[10px] text-slate-400 block uppercase flex items-center gap-1"><svg class="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Dosis Diaria de Hoy:</span>
                        <strong class="text-cyan-300 text-xs font-bold block mt-0.5">${hechosHoy} / ${totalHoy} Reactivos (${pctProgresoHoy}%)</strong>
                        <div class="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden mt-1.5 border border-slate-800">
                            <div class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style="width: ${pctProgresoHoy}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Banner del Reloj o Estado -->
                ${htmlTimer}

                <!-- Seleccionar Bloque Diario (Bloques 1 al 5) -->
                ${htmlBloquesGrid}

                <!-- Widget de Examen Semanal de Certificación -->
                ${htmlExamenSemanalWidget}

                <!-- EXPLICACIÓN DEL CÁLCULO NEURO-ADAPTATIVO -->
                <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2.5 font-sans">
                    <div class="flex items-center justify-between text-cyan-300 font-mono font-bold text-[11px] border-b border-slate-800 pb-2">
                        <span class="flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                            CÁLCULO Y CALIBRACIÓN DEL ENTRENAMIENTO PARA TU PERFIL
                        </span>
                        <span class="text-amber-400 text-[10px]">Algoritmo IRT + Neuro-Psicometría</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                        <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                            <span class="text-slate-400 block text-[9.5px] font-mono font-bold">1. TARGET ICFES:</span>
                            <span class="text-slate-200 font-bold block mt-0.5 truncate">${metaTxt}</span>
                            <p class="text-slate-400 text-[9.5px] mt-0.5">Priorización de la brecha de puntaje más alta.</p>
                        </div>

                        <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                            <span class="text-slate-400 block text-[9.5px] font-mono font-bold">2. HABILIDAD IRT (θ):</span>
                            <span class="text-cyan-300 font-bold block mt-0.5">Nivel ${thetaActual}</span>
                            <p class="text-slate-400 text-[9.5px] mt-0.5">Dificultad adaptativa calibrada reactivo a reactivo.</p>
                        </div>

                        <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                            <span class="text-slate-400 block text-[9.5px] font-mono font-bold">3. ENFOQUE HOY:</span>
                            <span class="text-amber-300 font-bold mt-0.5 flex items-center gap-1"><svg class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/></svg> ${estadoCognitivoHoy}</span>
                            <p class="text-slate-400 text-[9.5px] mt-0.5">Ajuste de estrés mental, tiempo y pistas guiadas.</p>
                        </div>

                        <div class="p-2 rounded-xl bg-slate-950 border border-slate-800">
                            <span class="text-slate-400 block text-[9.5px] font-mono font-bold">4. ARQUETIPO TÁCTICO:</span>
                            <span class="text-purple-300 font-bold block mt-0.5 truncate">${arquetipoActual}</span>
                            <p class="text-slate-400 text-[9.5px] mt-0.5">Estrategia pedagógica personalizada.</p>
                        </div>
                    </div>
                </div>

                <!-- Mensaje Directo del Tutor Dante -->
                <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-xs font-sans text-slate-200 leading-relaxed italic flex items-start gap-2.5">
                    <svg class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>
                    <p class="mt-0.5">${mensajeDante}</p>
                </div>

                <!-- Botones de Acción -->
                <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
                    ${hechosHoy >= totalHoy ? `
                        <button type="button" onclick="AppController.iniciarBloqueDiario(${estado.bloqueActual})" class="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-200">
                            <svg class="w-4 h-4 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>DOSIS DIARIA CUMPLIDA (${hechosHoy}/${totalHoy} ÍTEMS) — REPASAR BLOQUE ${estado.bloqueActual}</span>
                        </button>
                    ` : `
                        <button type="button" onclick="AppController.iniciarBloqueDiario(${estado.bloqueActual})" class="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-amber-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span>INICIAR BLOQUE ${estado.bloqueActual} DE HOY (${estado.reactivosPorBloque} REACTIVOS)</span>
                        </button>
                    `}

                    <button type="button" onclick="AppController.abrirModalTutorIAGemini()" class="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-mono font-bold text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <svg class="w-4 h-4 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                        <span>CONSULTAR AL TUTOR DANTE 24/7</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Sincroniza la UI en todas las vistas cuando cambia el estado
     */
    static actualizarUIPorTodasPartes() {
        this.renderizarTarjetaTutoriaDashboard();

        // Actualizar HUD superior en index.html si existe
        const estado = this.verificarOCrearEstadoDiario();
        const lblHud = document.getElementById('lblPreguntasDiariasHud');
        const barHud = document.getElementById('barProgresoPreguntasDiarias');

        if (lblHud) {
            lblHud.innerText = `${estado.reactivosHoyCompletados} / ${estado.reactivosTotalHoy}`;
        }
        if (barHud) {
            const pct = Math.min(100, Math.round((estado.reactivosHoyCompletados / estado.reactivosTotalHoy) * 100));
            barHud.style.width = `${pct}%`;
        }
    }
}

// ============================================================================
// 1. ENGINE DE RECURSIVIDAD Y RECARGA DE DOSIS DIARIA (COOLDOWN TIMER ENGINE)
// ============================================================================
class CooldownTimerEngine {
    static timerInterval = null;

    static init() {
        this.actualizarDisplays();
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                this.actualizarDisplays();
            }, 1000);
        }
        this.revisarEstadoRecordatorio();
    }

    static getTimeUntilMidnight() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const diffMs = tomorrow - now;
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }

    static actualizarDisplays() {
        const timerStr = this.getTimeUntilMidnight();
        
        const elSinVidas = document.getElementById('cooldownTimerModalSinVidas');
        if (elSinVidas) elSinVidas.innerText = timerStr;

        const elPaywall = document.getElementById('cooldownTimerModalPaywall');
        if (elPaywall) elPaywall.innerText = timerStr;

        const elHud = document.getElementById('cooldownTimerHud');
        if (elHud) elHud.innerText = timerStr;
    }

    static toggleRecordatorio() {
        const activo = localStorage.getItem('dante_recordatorio_dosis_activo') === 'true';
        const nuevoEstado = !activo;
        localStorage.setItem('dante_recordatorio_dosis_activo', String(nuevoEstado));

        if (nuevoEstado) {
            if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
            alert("🔔 ¡Recordatorio Activado! Te avisaremos a las 4:00 PM cuando salgas del colegio para que reclames tu dosis diaria y mantengas tu racha de entrenamiento.");
        } else {
            alert("🔕 Recordatorio diario desactivado.");
        }

        this.actualizarBotonRecordatorioUI();
    }

    static actualizarBotonRecordatorioUI() {
        const activo = localStorage.getItem('dante_recordatorio_dosis_activo') === 'true';
        const txtSinVidas = document.getElementById('lblRecordatorioDosisSinVidas');
        if (txtSinVidas) {
            txtSinVidas.innerText = activo 
                ? "🔔 Recordatorio Activado (4:00 PM) - ¡Listo!" 
                : "🔔 Activar Recordatorio Diario a las 4:00 PM";
        }
    }

    static revisarEstadoRecordatorio() {
        this.actualizarBotonRecordatorioUI();
        const now = new Date();
        if (now.getHours() === 16 && now.getMinutes() === 0 && localStorage.getItem('dante_recordatorio_dosis_activo') === 'true') {
            const notifNotified = localStorage.getItem('dante_recordatorio_notificado_hoy');
            const todayStr = now.toISOString().split('T')[0];
            if (notifNotified !== todayStr) {
                localStorage.setItem('dante_recordatorio_notificado_hoy', todayStr);
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("🧠 Dante OS - Tu Dosis Diaria está Lista", {
                        body: "Salida del colegio: Tu dosis de 10 reactivos calibrados de hoy está esperándote. Mantén tu racha activa.",
                        icon: "/assets/icons/brain.png"
                    });
                }
            }
        }
    }
}

// ============================================================================
// 2. GENERADOR DE TARJETA VISUAL DE DESEMPEÑO (SHARE CARD ENGINE)
// ============================================================================
class ShareCardEngine {
    static datosActuales = null;

    static abrirModal(datos = {}) {
        const est = datos.estudiante || localStorage.getItem('dante_student_name') || (window.AppState ? window.AppState.estudiante : 'Estudiante') || 'Estudiante';
        const score = datos.puntajeGlobal || localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_score_global') || '—';
        const percentil = datos.percentil || localStorage.getItem('dante_percentil') || '—';
        const racha = localStorage.getItem('dante_racha_dias') || localStorage.getItem('dante_streak_count') || '0';
        const arquetipo = datos.arquetipo || localStorage.getItem('dante_arquetipo') || 'Sin arquetipo aún';
        const targetExam = (window.AppState ? window.AppState.targetExam : 'ICFES SABER 11°') || 'ICFES SABER 11°';

        this.datosActuales = { est, score, percentil, racha, arquetipo, targetExam };

        const modal = document.getElementById('modalShareCard');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            setTimeout(() => this.renderizarCanvasCard(), 50);
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalShareCard');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    static renderizarCanvasCard() {
        const canvas = document.getElementById('canvasShareCard');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { est, score, percentil, racha, arquetipo, targetExam } = this.datosActuales;

        // Fondo y Gradiente Gold/Dark
        const grad = ctx.createLinearGradient(0, 0, 500, 500);
        grad.addColorStop(0, '#08090c');
        grad.addColorStop(0.5, '#0e121c');
        grad.addColorStop(1, '#1a1408');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 500, 500);

        // Borde dorado elegante
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, 480, 480);

        // Brillo interior
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(18, 18, 464, 464);

        // Header Logos & Branding
        ctx.fillStyle = '#51e2f5';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('🧠 DANTE OS v23', 35, 55);

        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('CERTIFICADO OFICIAL DE RENDIMIENTO COGNITIVO', 35, 75);

        // Línea divisoria
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(35, 90);
        ctx.lineTo(465, 90);
        ctx.stroke();

        // Nombre del Aspirante
        ctx.fillStyle = '#9499a7';
        ctx.font = '12px sans-serif';
        ctx.fillText('ASPIRANTE COGNITIVO:', 35, 120);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(String(est).toUpperCase(), 35, 145);

        // Target Exam Badge
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.fillRect(330, 115, 135, 30);
        ctx.strokeStyle = '#06b6d4';
        ctx.strokeRect(330, 115, 135, 30);
        ctx.fillStyle = '#51e2f5';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(targetExam.toUpperCase().substring(0, 14), 338, 134);

        // Caja de Puntaje Central
        ctx.fillStyle = 'rgba(18, 22, 34, 0.9)';
        ctx.fillRect(35, 170, 430, 120);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 170, 430, 120);

        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('PUNTAJE GLOBAL ESTIMADO', 55, 198);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 54px monospace';
        ctx.fillText(`${score}`, 55, 258);

        ctx.fillStyle = '#9499a7';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('/ 500 Pts', 185, 252);

        // Percentil Badge
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(290, 220, 155, 40);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(290, 220, 155, 40);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Percentil ${percentil}%`, 302, 245);

        // Métricas de Racha y Arquetipo
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`🔥 Racha: ${racha} Días de Entrenamiento`, 35, 325);

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`Arquetipo: ${arquetipo}`, 35, 355);

        // Caja CTA / Reto Viral
        ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.fillRect(35, 385, 430, 65);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.strokeRect(35, 385, 430, 65);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('⚡ ¿Crees que puedes superarme?', 50, 412);

        ctx.fillStyle = '#51e2f5';
        ctx.font = '11px monospace';
        ctx.fillText('Ponte a prueba en: https://dante-os.app', 50, 432);

        // Watermark
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText('Dante OS IRT Adaptive Engine · Verificado', 35, 475);
    }

    static compartirWhatsApp() {
        const { est, score, percentil, racha } = this.datosActuales;
        const texto = encodeURIComponent(`🧠 ¡Mi puntaje en Dante OS es ${score}/500 Pts (Percentil ${percentil}%)! 🔥 Racha de ${racha} días en el Simulador Adaptativo. ¿Aceptas el reto de preparación ICFES / UNAL? Mídete gratis aquí: https://dante-os.app`);
        window.open(`https://wa.me/?text=${texto}`, '_blank');
    }

    static descargarImagen() {
        const canvas = document.getElementById('canvasShareCard');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `tarjeta_dante_os_${this.datosActuales.est}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    static copiarTextoResumen() {
        const { est, score, percentil, racha } = this.datosActuales;
        const texto = `🧠 [DANTE OS] Mi Desempeño: ${score}/500 Pts | Percentil ${percentil}% | 🔥 Racha: ${racha} días. Mídete gratis en https://dante-os.app`;
        navigator.clipboard.writeText(texto).then(() => {
            alert("📋 ¡Resumen copiado al portapapeles!");
        }).catch(() => {
            alert("Resumen: " + texto);
        });
    }
}

// ============================================================================
// 3. RECOMENDADOR & CROSS-SELLING EXAMEN (ICFES -> UNAL)
// ============================================================================
class CrossSellUNALEngine {
    static evaluarYDesplegar(puntajeGlobal, theta) {
        const banner = document.getElementById('bannerCrossSellUNAL');
        if (!banner) return;

        const esPuntajeSuficiente = (puntajeGlobal && parseInt(puntajeGlobal, 10) >= 300) || (theta && parseFloat(theta) >= 0.8);
        
        if (esPuntajeSuficiente) {
            const lblTheta = document.getElementById('lblCrossSellTheta');
            if (lblTheta) {
                lblTheta.innerText = theta ? (parseFloat(theta) > 0 ? `+${parseFloat(theta).toFixed(2)}` : parseFloat(theta).toFixed(2)) : `+1.25`;
            }
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    }

    static iniciarExamenUnal() {
        if (window.PactoDanteManager) {
            PactoDanteManager.seleccionarCalendario('UNAL_UDEA');
        }
        if (window.AppState) {
            window.AppState.targetExam = 'UNAL_GENERAL';
        }
        alert("🏛️ Conmutado a Examen de Admisión Universidad Nacional (UNAL / UdeA). ¡Cargando banco de lógica y análisis de imagen!");
        if (window.AppController && window.AppController.iniciarSimulacroDiagnostico) {
            window.AppController.iniciarSimulacroDiagnostico();
        }
    }
}

// ============================================================================
// 4. SIMULADOR EXPRÉS DE DIAGNÓSTICO EN 5 MINUTOS (RAZONAMIENTO ESPACIAL & AGILIDAD COGNITIVA)
// ============================================================================
class DiagnosticoExpresEngine {
    // Banco rotatorio de reactivos de Razonamiento Espacial & Agilidad Cognitiva (Cartilla Clásica ICFES)
    static bancoRotatorio = {
        cubos_3d: [
            {
                id: 'esp_01',
                materia: 'Razonamiento Espacial',
                areaLabel: '🧊 Razonamiento Espacial / Desarrollo Plano de Cubos',
                enunciado: 'Se presenta el desarrollo plano (plantilla bidimensional) de un cubo de 6 caras. Cada cara tiene un símbolo distintivo: [1] Círculo Azul, [2] Cruz Naranja, [3] Triángulo Verde, [4] Estrella Rosa, [5] Cuadrado Morado, [6] Diagonal Roja. Al plegar la figura hacia el interior para formar el cubo 3D, ¿cuál de las siguientes opciones muestra una combinación de caras visibles espacialmente posible?',
                graficaHtml: `
                    <div class="my-3 p-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-inner">
                        <div class="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono">
                            🧩 Plantilla Desplegada del Cubo (Cartilla Clásica ICFES)
                        </div>
                        <svg viewBox="0 0 300 180" class="w-64 h-40 drop-shadow-md my-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <!-- Desarrollo Plano en Cruz -->
                            <!-- Cara Superior 1: Círculo -->
                            <rect x="110" y="5" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <circle cx="130" cy="25" r="10" fill="#38bdf8"/>
                            <text x="130" y="12" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">1</text>

                            <!-- Fila Central: 2 (Cruz), 3 (Triángulo), 4 (Estrella), 5 (Cuadrado) -->
                            <rect x="65" y="50" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <path d="M 85 60 L 85 80 M 75 70 L 95 70" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
                            <text x="85" y="58" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">2</text>

                            <rect x="110" y="50" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <polygon points="130,58 118,82 142,82" fill="#10b981"/>
                            <text x="130" y="58" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">3</text>

                            <rect x="155" y="50" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <path d="M 175 58 L 178 66 L 186 66 L 180 71 L 182 79 L 175 74 L 168 79 L 170 71 L 164 66 L 172 66 Z" fill="#ec4899"/>
                            <text x="175" y="58" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">4</text>

                            <rect x="200" y="50" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <rect x="210" y="60" width="20" height="20" fill="#a855f7"/>
                            <text x="220" y="58" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">5</text>

                            <!-- Cara Inferior 6: Diagonal -->
                            <rect x="110" y="95" width="40" height="40" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <line x1="115" y1="100" x2="145" y2="130" stroke="#f43f5e" stroke-width="3.5"/>
                            <text x="130" y="103" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">6</text>
                        </svg>
                        <div class="text-[10.5px] text-slate-400 font-mono">
                            Regla: Las caras opuestas (1 y 6, 2 y 4, 3 y 5) jamás se ven juntas en una misma toma.
                        </div>
                    </div>
                `,
                opciones: [
                    'A) Cubo con Círculo (arriba), Cruz (frente) y Triángulo (derecha).',
                    'B) Cubo con Círculo (arriba), Diagonal (frente) y Cruz (derecha).',
                    'C) Cubo con Cruz (arriba), Estrella (frente) y Triángulo (derecha).',
                    'D) Cubo con Triángulo (arriba), Cuadrado (frente) y Estrella (derecha).'
                ],
                correcta: 'A',
                explicacion: 'Las caras 1 (Círculo), 2 (Cruz) y 3 (Triángulo) comparten el mismo vértice en el desarrollo plano. La opción A muestra una combinación adyacente espacialmente válida. Las demás opciones juntan caras que son opuestas en la plantilla.'
            }
        ],
        rotacion_espacial: [
            {
                id: 'esp_02',
                materia: 'Razonamiento Espacial',
                areaLabel: '🔄 Razonamiento Espacial / Rotación 3D de Cuerpos Rígidos',
                enunciado: 'Un cuerpo tridimensional en forma de L asimétrica está formado por cubos unitarios. Si hacemos girar la figura 90° en sentido horario sobre el eje vertical Y y luego observamos la estructura desde el frente, ¿cuál es la configuración espacial resultante?',
                graficaHtml: `
                    <div class="my-3 p-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-inner">
                        <div class="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono">
                            📐 Objeto Rígido Isométrico 3D (Ejes X-Y-Z)
                        </div>
                        <svg viewBox="0 0 280 160" class="w-64 h-36 drop-shadow-md my-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <!-- Ejes Triadicos -->
                            <line x1="140" y1="80" x2="140" y2="15" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2"/>
                            <text x="145" y="20" fill="#f59e0b" font-size="9" font-family="monospace">Eje Y (+90°)</text>
                            <line x1="140" y1="80" x2="220" y2="125" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2,2"/>
                            <text x="225" y="130" fill="#38bdf8" font-size="9" font-family="monospace">Eje X</text>
                            <line x1="140" y1="80" x2="60" y2="125" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="2,2"/>
                            <text x="50" y="130" fill="#ec4899" font-size="9" font-family="monospace">Eje Z</text>

                            <!-- Bloques L 3D -->
                            <path d="M 110 100 L 140 115 L 170 100 L 140 85 Z" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 110 100 L 110 120 L 140 135 L 140 115 Z" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 140 115 L 140 135 L 170 120 L 170 100 Z" fill="#1e40af" stroke="#ffffff" stroke-width="1.5"/>

                            <path d="M 110 80 L 140 95 L 170 80 L 140 65 Z" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 110 80 L 110 100 L 140 115 L 140 95 Z" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>

                            <path d="M 110 60 L 140 75 L 170 60 L 140 45 Z" fill="#60a5fa" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 110 60 L 110 80 L 140 95 L 140 75 Z" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5"/>
                        </svg>
                    </div>
                `,
                opciones: [
                    'A) La barra vertical se traslada al perfil derecho y la saliente apunta hacia el observador.',
                    'B) La estructura queda invertida verticalmente apuntando hacia abajo.',
                    'C) La barra se mantiene igual pero la base desaparece de la perspectiva.',
                    'D) Se genera un plano cuadrado perfecto de 2x2 cubos en X-Z.'
                ],
                correcta: 'A',
                explicacion: 'Una rotación de 90° en sentido horario sobre el eje Y traslada el brazo saliente del eje Z hacia el eje X frontal, posicionando la torre vertical en el flanco derecho.'
            }
        ],
        matrices_visoespaciales: [
            {
                id: 'esp_03',
                materia: 'Razonamiento Espacial',
                areaLabel: '🧩 Razonamiento Espacial / Matriz de Patrones 3x3',
                enunciado: 'Examina la matriz geométrica 3x3. En cada fila, el patrón rota 45° a la derecha y suma un punto interno en cada paso. ¿Qué figura corresponde al cuadrante con el signo [?]? ',
                graficaHtml: `
                    <div class="my-3 p-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-inner">
                        <div class="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono">
                            🧩 Matriz de Transformación Viso-Espacial 3x3
                        </div>
                        <svg viewBox="0 0 240 240" class="w-56 h-56 drop-shadow-md my-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <!-- Cuadrícula 3x3 -->
                            <line x1="80" y1="10" x2="80" y2="230" stroke="#334155" stroke-width="2"/>
                            <line x1="160" y1="10" x2="160" y2="230" stroke="#334155" stroke-width="2"/>
                            <line x1="10" y1="80" x2="230" y2="80" stroke="#334155" stroke-width="2"/>
                            <line x1="10" y1="160" x2="230" y2="160" stroke="#334155" stroke-width="2"/>

                            <!-- Fila 1 -->
                            <path d="M 45 60 L 45 25 L 40 32 M 45 25 L 50 32" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
                            <path d="M 120 60 L 140 30 L 132 32 M 140 30 L 138 38" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
                            <circle cx="125" cy="50" r="3" fill="#f59e0b"/>

                            <path d="M 190 45 L 220 45 L 213 40 M 220 45 L 213 50" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
                            <circle cx="200" cy="45" r="3" fill="#f59e0b"/>
                            <circle cx="210" cy="45" r="3" fill="#f59e0b"/>

                            <!-- Fila 2 -->
                            <polygon points="45,100 30,135 60,135" fill="none" stroke="#10b981" stroke-width="2"/>
                            <polygon points="120,105 140,130 105,135" fill="none" stroke="#10b981" stroke-width="2"/>
                            <circle cx="122" cy="122" r="3" fill="#f59e0b"/>

                            <polygon points="190,120 220,105 220,135" fill="none" stroke="#10b981" stroke-width="2"/>
                            <circle cx="205" cy="115" r="3" fill="#f59e0b"/>
                            <circle cx="205" cy="125" r="3" fill="#f59e0b"/>

                            <!-- Fila 3 -->
                            <polygon points="45,175 60,195 45,215 30,195" fill="none" stroke="#e11d48" stroke-width="2"/>
                            <polygon points="125,175 140,195 125,215 110,195" fill="none" stroke="#e11d48" stroke-width="2"/>
                            <circle cx="125" cy="195" r="3" fill="#f59e0b"/>

                            <!-- Incógnita [?] -->
                            <rect x="170" y="170" width="50" height="50" rx="8" fill="#1e1b4b" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
                            <text x="195" y="202" fill="#f59e0b" font-size="22" font-weight="black" text-anchor="middle" font-family="monospace">?</text>
                        </svg>
                    </div>
                `,
                opciones: [
                    'A) Rombo inclinado con 2 puntos naranjas internos.',
                    'B) Rombo vertical con 3 puntos naranjas internos.',
                    'C) Círculo rojo con 1 punto central.',
                    'D) Cuadrado verde sin puntos internos.'
                ],
                correcta: 'A',
                explicacion: 'La regla horizontal exige: 1) Giro de 45° hacia la derecha en cada paso, 2) Adición de +1 punto interno por casilla. El rombo de la casilla 1 no tiene puntos, la 2 tiene 1 punto, y la casilla 3 debe tener el rombo inclinado con 2 puntos.'
            }
        ],
        vistas_ortogonales: [
            {
                id: 'esp_04',
                materia: 'Razonamiento Espacial',
                areaLabel: '📐 Razonamiento Espacial / Proyección Ortogonal de Planta',
                enunciado: 'Se construyó una estructura con bloques cúbicos sobre una rejilla de 3x3. Observando la vista isométrica, ¿cuál opción representa la vista superior (planta) indicando el número exacto de bloques apilados en cada celda?',
                graficaHtml: `
                    <div class="my-3 p-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-inner">
                        <div class="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono">
                            📐 Estructura Cúbica Apilada (Vista Isométrica)
                        </div>
                        <svg viewBox="0 0 260 170" class="w-64 h-36 drop-shadow-md my-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <!-- Torre Atras Izquierda: Altura 3 -->
                            <path d="M 80 40 L 105 55 L 130 40 L 105 25 Z" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 80 40 L 80 100 L 105 115 L 105 55 Z" fill="#d97706" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 105 55 L 105 115 L 130 100 L 130 40 Z" fill="#b45309" stroke="#ffffff" stroke-width="1.5"/>

                            <!-- Torre Centro: Altura 2 -->
                            <path d="M 130 70 L 155 85 L 180 70 L 155 55 Z" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 130 70 L 130 110 L 155 125 L 155 85 Z" fill="#059669" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 155 85 L 155 125 L 180 110 L 180 70 Z" fill="#047857" stroke="#ffffff" stroke-width="1.5"/>

                            <!-- Bloque Frente: Altura 1 -->
                            <path d="M 105 115 L 130 130 L 155 115 L 130 100 Z" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 105 115 L 105 135 L 130 150 L 130 130 Z" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
                            <path d="M 130 130 L 130 150 L 155 135 L 155 115 Z" fill="#0369a1" stroke="#ffffff" stroke-width="1.5"/>
                        </svg>
                    </div>
                `,
                opciones: [
                    'A) Matriz 3x3 con valores de altura: [3, 0, 0 / 0, 2, 0 / 0, 1, 0].',
                    'B) Matriz 3x3 con valores de altura: [1, 1, 1 / 2, 2, 2 / 3, 3, 3].',
                    'C) Matriz 3x3 con valores de altura: [0, 3, 0 / 0, 0, 0 / 1, 2, 3].',
                    'D) Matriz 3x3 con valores de altura: [2, 2, 0 / 1, 1, 1 / 0, 0, 0].'
                ],
                correcta: 'A',
                explicacion: 'Proyectando desde la vista superior (planta), la columna trasera izquierda cuenta con 3 bloques apilados, la columna central con 2 bloques y la frontal con 1 bloque. La matriz A mapea con precisión estas 3 alturas en la diagonal de la rejilla.'
            }
        ],
        simetria_plegado: [
            {
                id: 'esp_05',
                materia: 'Razonamiento Espacial',
                areaLabel: '✂️ Razonamiento Espacial / Plegado de Papel & Simetría Especular',
                enunciado: 'Un pliego de papel cuadrado se dobla por la mitad de izquierda a derecha, y luego de abajo hacia arriba. En el vértice donde convergen los dobleces centrales (esquina inferior derecha doblada) se realiza una perforación triangular. ¿Cómo se observa la hoja al desplegarla por completo?',
                graficaHtml: `
                    <div class="my-3 p-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-inner">
                        <div class="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono">
                            ✂️ Secuencia de Dobleces y Perforación Simétrica
                        </div>
                        <svg viewBox="0 0 280 110" class="w-64 h-24 drop-shadow-md my-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <!-- Paso 1 -->
                            <rect x="15" y="15" width="50" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <line x1="40" y1="15" x2="40" y2="65" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
                            <text x="40" y="80" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">1. Doblez I</text>

                            <!-- Paso 2 -->
                            <rect x="95" y="15" width="25" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <line x1="95" y1="40" x2="120" y2="40" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
                            <text x="107" y="80" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">2. Doblez II</text>

                            <!-- Paso 3 -->
                            <rect x="150" y="15" width="25" height="25" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                            <polygon points="175,40 165,40 175,30" fill="#f43f5e"/>
                            <text x="162" y="80" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="monospace">3. Corte</text>

                            <!-- Resultado ? -->
                            <rect x="200" y="15" width="50" height="50" fill="#0f172a" stroke="#10b981" stroke-width="2" stroke-dasharray="2,2"/>
                            <text x="225" y="48" fill="#10b981" font-size="16" font-weight="black" text-anchor="middle" font-family="monospace">?</text>
                        </svg>
                    </div>
                `,
                opciones: [
                    'A) Cuatro triángulos reflejados simétricamente en el centro exacto de la hoja formando un rombo.',
                    'B) Un solo triángulo perforado en la esquina inferior derecha.',
                    'C) Dos triángulos en la parte superior y dos en la parte inferior.',
                    'D) Cuatro triángulos orientados todos hacia el mismo sentido (sin reflexión).'
                ],
                correcta: 'A',
                explicacion: 'Al realizar el corte en el punto donde convergen los ejes de doblez horizontal y vertical (el centro de la hoja), la apertura del papel genera una reflexión en cuadrante cuádruple, uniendo los cuatro vértices en un rombo central.'
            }
        ]
    };

    static reactivosSeleccionados = [];
    static pasoActual = 0;
    static respuestasMarcadas = {}; // { 0: 'A', 1: 'B', ... }
    static opcionesTachadas = {};   // { 0: { 'C': true }, ... }
    static tiempoInicioTotal = 0;
    static tiemposPorPaso = {};     // { 0: ms, 1: ms, ... }
    static tiempoInicioPasoActual = 0;
    static evaluado = false;
    static respuestasFinales = [];

    // Genera una batería rotatoria escogiendo 1 reactivo de cada una de las 5 categorías de Razonamiento Espacial
    static seleccionarBateriaRotatoria() {
        const areas = ['cubos_3d', 'rotacion_espacial', 'matrices_visoespaciales', 'vistas_ortogonales', 'simetria_plegado'];
        this.reactivosSeleccionados = areas.map(areaKey => {
            const pool = this.bancoRotatorio[areaKey];
            const randomIndex = Math.floor(Math.random() * pool.length);
            return pool[randomIndex];
        });
        this.pasoActual = 0;
        this.respuestasMarcadas = {};
        this.opcionesTachadas = {};
        this.certezaMetacognitiva = {};
        this.tiemposPorPaso = {};
        this.evaluado = false;
        this.respuestasFinales = [];
        this.tiempoInicioTotal = Date.now();
        this.tiempoInicioPasoActual = Date.now();
    }

    static abrir() {
        this.seleccionarBateriaRotatoria();
        const modal = document.getElementById('modalDiagnosticoExpres');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            this.renderizarPaso();
        }
    }

    static cerrar() {
        const modal = document.getElementById('modalDiagnosticoExpres');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    static cambiarPregunta(nuevoIdx) {
        if (nuevoIdx >= 0 && nuevoIdx < this.reactivosSeleccionados.length) {
            // Guardar tiempo transcurrido en el paso anterior
            const deltaMs = Date.now() - this.tiempoInicioPasoActual;
            this.tiemposPorPaso[this.pasoActual] = (this.tiemposPorPaso[this.pasoActual] || 0) + deltaMs;
            
            this.pasoActual = nuevoIdx;
            this.tiempoInicioPasoActual = Date.now();
            this.renderizarPaso();
        }
    }

    static marcarOpcion(pasoIdx, letra) {
        if (this.evaluado) return;
        this.respuestasMarcadas[pasoIdx] = letra;
        
        // Registrar tiempo
        const deltaMs = Date.now() - this.tiempoInicioPasoActual;
        this.tiemposPorPaso[pasoIdx] = (this.tiemposPorPaso[pasoIdx] || 0) + deltaMs;
        this.tiempoInicioPasoActual = Date.now();

        this.renderizarPaso();
    }

    static marcarCertezaMetacognitiva(pasoIdx, nivel) {
        if (this.evaluado) return;
        this.certezaMetacognitiva[pasoIdx] = nivel;
        this.renderizarPaso();
    }

    static tacharDistractor(pasoIdx, letra, e) {
        if (e) e.stopPropagation();
        if (this.evaluado) return;

        if (!this.opcionesTachadas[pasoIdx]) {
            this.opcionesTachadas[pasoIdx] = {};
        }
        this.opcionesTachadas[pasoIdx][letra] = !this.opcionesTachadas[pasoIdx][letra];
        this.renderizarPaso();
    }

    static obtenerHtmlGrafica(item) {
        if (!item) return '';

        // 1. Si el ítem trae graficaHtml directa
        if (item.graficaHtml) {
            return item.graficaHtml;
        }

        // 2. Si trae recurso_visual o imagen_url
        const urlVisual = item.recurso_visual || item.imagen_url;
        if (!urlVisual) return '';

        if (typeof urlVisual === 'string') {
            const esSvg = urlVisual.includes('<svg') || urlVisual.startsWith('data:image/svg+xml') || urlVisual.trim().startsWith('<svg');
            
            if (esSvg) {
                let rawXml = urlVisual.trim();
                if (rawXml.startsWith('data:image/svg+xml;utf8,')) {
                    rawXml = rawXml.substring('data:image/svg+xml;utf8,'.length);
                } else if (rawXml.startsWith('data:image/svg+xml;')) {
                    rawXml = rawXml.substring(rawXml.indexOf(',') + 1);
                }
                try {
                    rawXml = decodeURIComponent(rawXml);
                } catch (e) {
                    // mantener rawXml
                }
                rawXml = rawXml.replace(/%23/g, '#');

                return `
                    <div class="my-3 p-3 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-md overflow-x-auto max-w-full">
                        <div class="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                            📊 Gráfico / Recurso de Apoyo
                        </div>
                        <div class="w-full flex justify-center py-1">
                            ${rawXml}
                        </div>
                    </div>
                `;
            } else if (urlVisual.length > 5) {
                return `
                    <div class="my-3 p-2.5 bg-slate-100 border border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-inner">
                        <img src="${urlVisual}" alt="Recurso visual de la pregunta" class="max-h-64 sm:max-h-80 w-auto max-w-full object-contain rounded-lg border border-slate-300 shadow-sm cursor-pointer hover:opacity-90 transition-opacity" onclick="window.open(this.src, '_blank')" title="Haz clic para abrir imagen completa" />
                        <span class="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                            <span>🔍</span> Haz clic en la imagen para ampliar
                        </span>
                    </div>
                `;
            }
        }

        return '';
    }

    static renderizarPaso() {
        const body = document.getElementById('bodyDiagnosticoExpres');
        if (!body) return;

        if (!this.evaluado) {
            const item = this.reactivosSeleccionados[this.pasoActual];
            const areaAbreviaturas = ['1. CUBOS 3D', '2. ROTACIÓN', '3. MATRICES', '4. VISTAS 3D', '5. SIMETRÍA'];
            const areaIconos = ['🧊', '🔄', '🧩', '📐', '✂️'];
            const marcadasCount = Object.keys(this.respuestasMarcadas).length;

            body.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-left">
                    <!-- COLUMNA IZQUIERDA: PLIEGO DE CUADERNILLO FACSÍMIL SABER 11° / UNAL / UDEA (7 COLS) -->
                    <div class="lg:col-span-7 bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-2xl relative flex flex-col justify-between overflow-hidden">
                        <!-- ENCABEZADO OFICIAL PAPEL -->
                        <div>
                            <div class="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-3">
                                <div>
                                    <div class="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono flex items-center gap-1.5">
                                        <svg class="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                        <span>RETO SEMANAL DE RAZONAMIENTO ESPACIAL</span>
                                    </div>
                                    <div class="text-xs font-black uppercase text-white tracking-wide mt-0.5">EVALUACIÓN DE AGILIDAD VISO-ESPACIAL (5 ÁREAS)</div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                        CÓDIGO: ESP-2026
                                    </span>
                                </div>
                            </div>

                            <!-- PESTAÑAS HOJAS DE EXAMEN -->
                            <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-800">
                                ${this.reactivosSeleccionados.map((it, idx) => {
                                    const esMarcada = !!this.respuestasMarcadas[idx];
                                    const esActiva = (idx === this.pasoActual);
                                    return `
                                        <button type="button" onclick="DiagnosticoExpresEngine.cambiarPregunta(${idx})" class="px-3 py-1.5 rounded-lg text-[10.5px] font-bold font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                                            esActiva 
                                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105' 
                                                : esMarcada 
                                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-bold' 
                                                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                                        }">
                                            <span>${areaAbreviaturas[idx]}</span>
                                            <span>${esMarcada ? '✓' : '○'}</span>
                                        </button>
                                    `;
                                }).join('')}
                            </div>

                            <!-- DETALLE DE LA PREGUNTA ACTUAL -->
                            <div class="space-y-3">
                                <div class="flex items-center justify-between text-xs">
                                    <span class="font-extrabold text-cyan-300 bg-cyan-950 border border-cyan-500/40 px-2.5 py-1 rounded-lg text-[10.5px] uppercase font-mono flex items-center gap-1.5">
                                        <span>${areaIconos[this.pasoActual]}</span>
                                        <span>PREGUNTA N° ${this.pasoActual + 1} DE 5 · ${item.materia.toUpperCase()}</span>
                                    </span>
                                    <span class="text-[10.5px] text-slate-400 font-mono font-bold flex items-center gap-1">
                                        <svg class="w-3.5 h-3.5 text-amber-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Sugerido: 1 min</span>
                                    </span>
                                </div>

                                <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm font-sans text-slate-100 leading-relaxed shadow-inner space-y-2">
                                    <div class="font-bold text-[11px] font-mono text-cyan-400 uppercase tracking-wide">
                                        ${item.areaLabel}
                                    </div>
                                    <div class="text-slate-200">${item.enunciado}</div>
                                    ${this.obtenerHtmlGrafica(item)}
                                </div>

                                <!-- OPCIONES DE RESPUESTA CON BOTÓN PARA TACHAR DISTRACTOR -->
                                <div class="space-y-2 font-sans">
                                    ${item.opciones.map(op => {
                                        const letra = op.substring(0, 1);
                                        const esSeleccionada = (this.respuestasMarcadas[this.pasoActual] === letra);
                                        const esTachada = !!(this.opcionesTachadas[this.pasoActual] && this.opcionesTachadas[this.pasoActual][letra]);

                                        return `
                                            <div class="flex items-center gap-2 group">
                                                <button type="button" onclick="DiagnosticoExpresEngine.marcarOpcion(${this.pasoActual}, '${letra}')" class="flex-1 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                                                    esSeleccionada
                                                        ? 'bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                                        : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                                                } ${esTachada ? 'line-through opacity-40 bg-slate-950 border-rose-950' : ''}">
                                                    <span class="flex items-center gap-2.5">
                                                        <span class="w-6 h-6 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                                                            esSeleccionada ? 'bg-cyan-400 text-slate-950 border-cyan-200' : 'bg-slate-950 text-cyan-400 border-slate-700'
                                                        }">${letra}</span>
                                                        <span class="text-xs text-slate-200">${op.substring(3)}</span>
                                                    </span>
                                                    ${esSeleccionada ? '<span class="font-mono text-[11px] text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40">✓ SELECCIONADA</span>' : ''}
                                                </button>

                                                <button type="button" title="Tachar opción trampa/distractor" onclick="DiagnosticoExpresEngine.tacharDistractor(${this.pasoActual}, '${letra}', event)" class="p-3 rounded-xl bg-slate-950 hover:bg-rose-950 border border-slate-800 hover:border-rose-500/50 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer shrink-0" title="Tachar distractor">
                                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                </button>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>

                                <!-- TRIÁNGULO METACOGNITIVO DE CERTEZA -->
                                <div class="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-2">
                                    <div class="flex items-center justify-between text-[11px]">
                                        <span class="text-amber-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
                                            <svg class="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                            <span>CALIBRACIÓN METACOGNITIVA DE CERTEZA</span>
                                        </span>
                                        <span class="text-[9.5px] text-slate-400">¿Qué tan seguro estás de tu marca?</span>
                                    </div>
                                    <div class="grid grid-cols-3 gap-2">
                                        <button type="button" onclick="DiagnosticoExpresEngine.marcarCertezaMetacognitiva(${this.pasoActual}, 'SEGURO')" class="py-2 px-2 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                                            (this.certezaMetacognitiva[this.pasoActual] || 'SEGURO') === 'SEGURO'
                                                ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-102'
                                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                                        }">
                                            <span>🎯</span> <span>100% SEGURO</span>
                                        </button>
                                        <button type="button" onclick="DiagnosticoExpresEngine.marcarCertezaMetacognitiva(${this.pasoActual}, 'DUDA')" class="py-2 px-2 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                                            this.certezaMetacognitiva[this.pasoActual] === 'DUDA'
                                                ? 'bg-purple-600 text-white border-purple-300 font-black shadow-[0_0_12px_rgba(168,85,247,0.5)] scale-102'
                                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                                        }">
                                            <span>🤔</span> <span>TENGO DUDA</span>
                                        </button>
                                        <button type="button" onclick="DiagnosticoExpresEngine.marcarCertezaMetacognitiva(${this.pasoActual}, 'AZAR')" class="py-2 px-2 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                                            this.certezaMetacognitiva[this.pasoActual] === 'AZAR'
                                                ? 'bg-rose-600 text-white border-rose-300 font-black shadow-[0_0_12px_rgba(244,63,94,0.5)] scale-102'
                                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                                        }">
                                            <span>🎲</span> <span>ADIVINÉ / AZAR</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CONTROLES NAVEGACIÓN CUADERNILLO -->
                        <div class="flex items-center justify-between border-t border-slate-800 pt-3 mt-4 text-xs font-mono">
                            <button type="button" onclick="DiagnosticoExpresEngine.cambiarPregunta(${this.pasoActual - 1})" ${this.pasoActual === 0 ? 'disabled class="opacity-30 cursor-not-allowed text-slate-600"' : 'class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"'}>
                                ◄ Anterior
                            </button>
                            <span class="text-cyan-300 text-[11px] font-bold">Página ${this.pasoActual + 1} / 5</span>
                            <button type="button" onclick="DiagnosticoExpresEngine.cambiarPregunta(${this.pasoActual + 1})" ${this.pasoActual === 4 ? 'disabled class="opacity-30 cursor-not-allowed text-slate-600"' : 'class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer"'}>
                                Siguiente ►
                            </button>
                        </div>
                    </div>

                    <!-- COLUMNA DERECHA: HOJA DE RESPUESTAS ÓPTICA DIGITAL NEÓN (5 COLS) -->
                    <div class="lg:col-span-5 bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between relative overflow-hidden font-mono">
                        <div>
                            <!-- CABECERA HOJA ÓPTICA -->
                            <div class="border-b border-amber-500/30 pb-2.5 mb-3 text-center space-y-1">
                                <div class="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
                                    <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    <span>DANTE OS · MATRIZ ÓPTICA DIGITAL</span>
                                </div>
                                <div class="text-xs font-black uppercase text-white tracking-wider">HOJA DE RESPUESTAS CIBERNÉTICA</div>
                                <div class="text-[10px] font-bold text-amber-300/80">SELECCIONA CADA ÓVALO PARA CONSOLIDAR TU REGISTRO</div>
                            </div>

                            <!-- FILAS DE ÓVALOS 01 A 05 -->
                            <div class="space-y-3 font-mono">
                                ${this.reactivosSeleccionados.map((it, idx) => {
                                    const letraMarcada = this.respuestasMarcadas[idx];
                                    const areaEtiqueta = areaAbreviaturas[idx];
                                    const esActual = (idx === this.pasoActual);

                                    return `
                                        <div class="p-2.5 rounded-xl border transition-all ${
                                            esActual ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-900/80 border-slate-800'
                                        }">
                                            <div class="flex items-center justify-between text-[11px] font-bold mb-2 text-slate-200">
                                                <button type="button" onclick="DiagnosticoExpresEngine.cambiarPregunta(${idx})" class="hover:underline flex items-center gap-1.5 cursor-pointer">
                                                    <span class="text-white">PREGUNTA ${idx + 1}</span>
                                                    <span class="text-[10px] text-cyan-400 font-mono">(${areaEtiqueta.split(' ')[1]})</span>
                                                </button>
                                                <span class="${letraMarcada ? 'text-emerald-400 font-extrabold' : 'text-slate-500'} text-[10px]">
                                                    ${letraMarcada ? '✓ Marcada: ' + letraMarcada : '○ Pendiente'}
                                                </span>
                                            </div>

                                            <div class="flex items-center justify-around gap-1">
                                                ${['A', 'B', 'C', 'D'].map(letra => {
                                                    const esLaMarcada = (letraMarcada === letra);
                                                    return `
                                                        <button type="button" onclick="DiagnosticoExpresEngine.marcarOpcion(${idx}, '${letra}')" class="w-9 h-9 rounded-full font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                                                            esLaMarcada
                                                                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 border-amber-200 font-black shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-110'
                                                                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300'
                                                        }">
                                                            ${letra}
                                                        </button>
                                                    `;
                                                }).join('')}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- BARRAS DE PROGRESO Y ENTREGAR EXAMEN -->
                        <div class="pt-4 mt-4 border-t border-slate-800 space-y-3 font-mono">
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-slate-300">Óvalos diligenciados:</span>
                                <span class="font-black ${marcadasCount === 5 ? 'text-emerald-400 font-extrabold' : 'text-amber-400'}">${marcadasCount} / 5</span>
                            </div>

                            <button type="button" onclick="DiagnosticoExpresEngine.entregarHojaOptica()" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-200">
                                <span>🖊️ ENTREGAR HOJA ÓPTICA & EVALUAR PUNTAJE</span>
                                <svg class="w-4 h-4 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // RENDER RESULTADOS DEL DIAGNÓSTICO EXPRÉS HIPERREALISTA
            const aciertos = this.respuestasFinales.filter(r => r.esCorrecta).length;
            const tiempoTotalSeg = Math.max(15, Math.round((Date.now() - this.tiempoInicioTotal) / 1000));
            const minutos = Math.floor(tiempoTotalSeg / 60);
            const segundos = tiempoTotalSeg % 60;
            const tiempoTexto = `${minutos} min ${segundos < 10 ? '0' : ''}${segundos} s`;
            const latenciaPromedio = Math.round(tiempoTotalSeg / 5);

            // Cálculo Bayesiano de Baseline 0-500 Pts
            let estScore = 250 + (aciertos * 45) + Math.min(25, Math.max(0, 60 - latenciaPromedio));
            estScore = Math.min(480, Math.max(180, estScore));
            let percentilEst = Math.min(98, Math.max(25, Math.round((estScore / 500) * 100)));
            this.ultimoPuntajeEstimado = estScore;

            // Análisis Metacognitivo & Puntos Ciegos (Dunning-Kruger)
            const puntosCiegosDK = this.respuestasFinales.filter(r => !r.esCorrecta && r.certeza === 'SEGURO').length;
            const dominioMaestro = this.respuestasFinales.filter(r => r.esCorrecta && r.certeza === 'SEGURO').length;
            const conocimientoFragil = this.respuestasFinales.filter(r => r.esCorrecta && r.certeza !== 'SEGURO').length;
            const vaciosReconocidos = this.respuestasFinales.filter(r => !r.esCorrecta && r.certeza !== 'SEGURO').length;

            // DIAGNÓSTICO COGNITIVO-CONDUCTUAL DE PATRÓN DE RESPUESTA ("¡Uuy sí, es verdad!")
            let perfilNombre = "";
            let perfilDescripcion = "";
            let diagnosticoTiempo = "";
            let diagnosticoTrampas = "";

            if (latenciaPromedio < 18 && aciertos <= 3) {
                perfilNombre = "Impulsivo por Velocidad (Sensible a Distractores Trampa)";
                perfilDescripcion = "Lees a alta velocidad y eliges la primera opción que parece 'lógica', pero el ICFES diseña distractores plausibles específicamente para capturar respuestas rápidas no auditadas. Tu potencial se elevará significativamente al aplicar el método de descarte sistemático de 5 segundos.";
                diagnosticoTiempo = "Velocidad acelerada (~" + latenciaPromedio + "s/ítem), pero con riesgo de lectura impulsiva.";
                diagnosticoTrampas = "Alta vulnerabilidad a opciones con palabras gancho o absolutos.";
            } else if (latenciaPromedio >= 18 && aciertos >= 4) {
                perfilNombre = "Estratega Analítico de Alto Control Cognitivo";
                perfilDescripcion = "Demuestras excelente autorregulación emocional y capacidad de discriminación conceptual. Usas la lógica deductiva para aislar el núcleo argumentativo antes de marcar en la hoja óptica.";
                diagnosticoTiempo = "Ritmo óptimo de ~" + latenciaPromedio + "s/ítem. Conservas energía para la prueba completa.";
                diagnosticoTrampas = "Filtro efectivo contra distractores tramposos del examen.";
            } else if (latenciaPromedio > 30 && aciertos <= 3) {
                perfilNombre = "Reflexivo en Zona de Dudas Razonables";
                perfilDescripcion = "Inviertes bastante tiempo re-leyendo el texto y dudando entre dos opciones plausibles. Esto genera micro-fatiga acumulativa. Con Dante OS entrenarás la confianza directa en claves discriminatorias sin dudar.";
                diagnosticoTiempo = "Tiempo elevado (~" + latenciaPromedio + "s/ítem). Riesgo de sobre-pensar las preguntas.";
                diagnosticoTrampas = "Dificultad para descartar el segundo distractor más cercano.";
            } else {
                perfilNombre = "Procesador Híbrido en Calibración";
                perfilDescripcion = "Muestras gran intuición en tus áreas de preferencia pero vacilaciones en lectura analítica. Al focalizar tu micro-dosis diaria en tu área más débil, equilibrarás tu varianza global de puntaje.";
                diagnosticoTiempo = "Ritmo equilibrado (~" + latenciaPromedio + "s/ítem). Ideal para entrenamiento adaptativo.";
                diagnosticoTrampas = "Sensibilidad moderada a distractores de generalización.";
            }

            const desempenoEtiqueta = aciertos >= 4 ? 'Alto Rendimiento' : aciertos >= 2 ? 'Zona Media' : 'En Diagnóstico';

            body.innerHTML = `
                <div class="space-y-5 text-left font-mono">
                    <!-- BANNER Y GAUGE CON BARRA LUMINOSA ANIMADA DEL PUNTAJE -->
                    <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-cyan-950/90 border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4 relative overflow-hidden">
                        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div class="flex justify-between items-center border-b border-amber-500/40 pb-2">
                            <span class="text-xs font-black text-amber-300 uppercase tracking-widest block flex items-center gap-2">
                                <span>🎯 RESULTADO DIAGNÓSTICO BASELINE</span>
                                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[10px]">SABER 11°</span>
                            </span>
                            <span class="text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40">⏱️ ${tiempoTexto}</span>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                            <div>
                                <div class="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 my-1 animate-pulse-slow">
                                    ${estScore} <span class="text-xl sm:text-2xl text-slate-400 font-mono font-normal">/ 500 Pts</span>
                                </div>
                                <div class="text-xs text-slate-300 font-sans">Proyección de Puntaje Global Estimado (Modelo Teórico IRT)</div>
                            </div>
                            <div class="text-left sm:text-right">
                                <span class="text-emerald-400 text-lg font-black block">Diagnóstico y Calibración: ${percentilEst}%</span>
                                <span class="text-[11px] text-slate-400 font-sans">Por encima del ${percentilEst}% de evaluados (Percentil)</span>
                            </div>
                        </div>

                        <!-- BARRA LUMÍNICA DE PROMEDIO REAL (METER GLOW ANIMADO) -->
                        <div class="space-y-1.5 pt-2">
                            <div class="flex justify-between text-[11px] font-bold">
                                <span class="text-amber-300">NIVEL DE HABILIDAD PROMEDIO PROYECTADO</span>
                                <span class="text-cyan-300 font-extrabold">${estScore} Pts</span>
                            </div>
                            <div class="w-full h-4 bg-slate-950 rounded-full border border-amber-500/50 p-0.5 overflow-hidden shadow-inner relative">
                                <div class="absolute inset-0 flex text-[9px] font-bold text-slate-600 px-2 items-center justify-between pointer-events-none opacity-40">
                                    <span>200</span>
                                    <span>300</span>
                                    <span>400</span>
                                    <span>500</span>
                                </div>
                                <div id="meterScoreBarGlow" class="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(245,158,11,0.8)]" style="width: 0%;"></div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                            <div class="text-cyan-300 font-bold">✅ Aciertos: ${aciertos} / 5 Áreas</div>
                            <div class="text-amber-300 font-bold">⚡ Latencia: ${latenciaPromedio}s / ítem</div>
                            <div class="text-emerald-300 font-bold col-span-2 sm:col-span-1">📊 Status: ${desempenoEtiqueta}</div>
                        </div>
                    </div>

                    <!-- DIAGNÓSTICO COGNITIVO-CONDUCTUAL Y PERFIL DE RESPUESTA ("¡Uuy sí, es verdad!") -->
                    <div class="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-purple-500/60 shadow-xl space-y-3 font-sans">
                        <div class="font-mono font-black text-purple-300 text-xs uppercase border-b border-purple-500/30 pb-2 flex items-center justify-between">
                            <span class="flex items-center gap-2">🧠 DIAGNÓSTICO COGNITIVO DE PATRÓN DE RESPUESTA</span>
                            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/40 text-[9.5px]">ANÁLISIS CONDUCTUAL</span>
                        </div>

                        <div class="space-y-3 text-xs">
                            <div class="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 space-y-1">
                                <div class="font-mono font-bold text-amber-300 uppercase text-[11px] flex items-center gap-1.5">
                                    <span>🎭 Perfil Detectado:</span>
                                    <span class="text-white bg-purple-900 px-2 py-0.5 rounded border border-purple-400/40">${perfilNombre}</span>
                                </div>
                                <p class="text-slate-200 leading-relaxed text-[11.5px]">
                                    ${perfilDescripcion}
                                </p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                                <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                                    <span class="text-cyan-400 font-bold block mb-0.5">⏱️ Gestión de Tiempo:</span>
                                    <span class="text-slate-300 font-sans">${diagnosticoTiempo}</span>
                                </div>
                                <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                                    <span class="text-emerald-400 font-bold block mb-0.5">🎯 Sensibilidad a Trampas:</span>
                                    <span class="text-slate-300 font-sans">${diagnosticoTrampas}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AUDITORÍA DE PUNTOS CIEGOS & MATRIZ METACOGNITIVA (DUNNING-KRUGER) -->
                    <div class="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/60 shadow-xl space-y-3 font-sans">
                        <div class="font-mono font-black text-amber-300 text-xs uppercase border-b border-amber-500/30 pb-2 flex items-center justify-between">
                            <span class="flex items-center gap-2">👁️ AUDITORÍA DE PUNTOS CIEGOS (EFECTO DUNNING-KRUGER)</span>
                            <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[9.5px]">MIRT + CERTEZA</span>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                            <div class="p-2.5 rounded-xl bg-slate-950 border ${puntosCiegosDK > 0 ? 'border-rose-500/80 bg-rose-950/20' : 'border-slate-800'} text-center space-y-1">
                                <span class="text-[10px] text-slate-400 block font-bold">PUNTOS CIEGOS (D-K)</span>
                                <strong class="${puntosCiegosDK > 0 ? 'text-rose-400' : 'text-slate-300'} text-lg font-black block">${puntosCiegosDK}</strong>
                                <span class="text-[9px] text-slate-400 font-sans block leading-tight">Error + 100% Seguro</span>
                            </div>
                            <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                                <span class="text-[10px] text-slate-400 block font-bold">DOMINIO MAESTRO</span>
                                <strong class="text-emerald-400 text-lg font-black block">${dominioMaestro}</strong>
                                <span class="text-[9px] text-slate-400 font-sans block leading-tight">Acierto + Confianza</span>
                            </div>
                            <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                                <span class="text-[10px] text-slate-400 block font-bold">CONOCIMIENTO FRÁGIL</span>
                                <strong class="text-purple-400 text-lg font-black block">${conocimientoFragil}</strong>
                                <span class="text-[9px] text-slate-400 font-sans block leading-tight">Acierto + Vacilación</span>
                            </div>
                            <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                                <span class="text-[10px] text-slate-400 block font-bold">VACÍOS RECONOCIDOS</span>
                                <strong class="text-amber-400 text-lg font-black block">${vaciosReconocidos}</strong>
                                <span class="text-[9px] text-slate-400 font-sans block leading-tight">Error + Duda Consciente</span>
                            </div>
                        </div>

                        ${puntosCiegosDK > 0 ? `
                            <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-[11px] text-rose-200 leading-relaxed font-sans">
                                🚨 <strong>Alerta de Punto Ciego (Dunning-Kruger):</strong> Tienes <strong>${puntosCiegosDK} respuesta(s)</strong> donde marcaste "100% Seguro" pero caíste en un distractor tramposo del ICFES. Estos son los errores más peligrosos porque generan sobreconfianza falsa antes del examen oficial.
                            </div>
                        ` : `
                            <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-[11px] text-emerald-200 leading-relaxed font-sans">
                                ✨ <strong>Excelente Calibración Metacognitiva:</strong> Tu nivel de certeza coincide de forma precisa con tu dominio real. No presentas puntos ciegos de sobreconfianza en esta batería.
                            </div>
                        `}
                    </div>

                    <!-- DESGLOSE MATERIAS DIAGNOSTICADAS EN HOJA DE RESULTADOS -->
                    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans space-y-2.5">
                        <div class="font-mono font-black text-cyan-300 text-xs uppercase border-b border-slate-800 pb-1.5 flex justify-between">
                            <span>📊 DESGLOSE TÁCTICO POR ÁREA DEL EXAMEN</span>
                            <span class="text-slate-400">1 Ítem / Área</span>
                        </div>
                        <div class="space-y-2 text-xs font-mono">
                            ${this.respuestasFinales.map((r, idx) => {
                                const areaNombres = ['🧊 Desplegado de Cubo 3D', '🔄 Rotación Espacial Tridimensional', '🧩 Matriz Viso-Espacial 3x3', '📐 Vistas Ortogonales (Planta/Superior)', '✂️ Plegado Perforado y Simetría'];
                                return `
                                    <div class="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-200">
                                        <div class="flex items-center gap-2">
                                            <span class="font-bold">${areaNombres[idx]}:</span>
                                            <span class="text-[11px] text-slate-400 font-sans">(Marca: ${r.letra || 'Ninguna'})</span>
                                        </div>
                                        <span class="${r.esCorrecta ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">
                                            ${r.esCorrecta ? '✓ Correcto (Clave ' + r.correcta + ')' : '✗ Incorrecto (Tuya: ' + (r.letra || '-') + ' | Correcta: ' + r.correcta + ')'}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- BOTÓN PRINCIPAL DE CONTINUACIÓN TRANSICIÓN A ORIENTACIÓN VOCACIONAL -->
                    <div class="space-y-2.5 pt-2 font-mono">
                        <button type="button" onclick="DiagnosticoExpresEngine.guardarYRegistrar()" class="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-purple-300">
                            <span>🎯 SIGUIENTE PASO: TEST DE ORIENTACIÓN VOCACIONAL (3 MIN)</span>
                            <i class="fa-solid fa-arrow-right text-amber-300"></i>
                        </button>
                        
                        <button type="button" onclick="ShareCardEngine.abrirModal({ puntajeGlobal: ${estScore}, percentil: ${percentilEst} })" class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-share-nodes text-amber-400"></i>
                            <span>📸 Compartir Tarjeta de Desempeño en WhatsApp</span>
                        </button>
                    </div>
                </div>
            `;

            // Animación de llenado luminoso de la barra de puntaje
            setTimeout(() => {
                const bar = document.getElementById('meterScoreBarGlow');
                if (bar) {
                    bar.style.width = Math.min(100, Math.max(10, Math.round((estScore / 500) * 100))) + '%';
                }
            }, 100);
        }
    }

    static entregarHojaOptica() {
        const marcadasCount = Object.keys(this.respuestasMarcadas).length;
        if (marcadasCount < 5) {
            const confirmar = confirm(`Has respondido ${marcadasCount} de 5 preguntas. ¿Deseas entregar la Hoja Óptica así o prefieres completar los 5 óvalos?`);
            if (!confirmar) return;
        }

        // Evaluar respuestas con Metacognición
        this.respuestasFinales = this.reactivosSeleccionados.map((item, idx) => {
            const letra = this.respuestasMarcadas[idx] || null;
            const esCorrecta = (letra === item.correcta);
            const latenciaMs = this.tiemposPorPaso[idx] || 10000;
            const certeza = this.certezaMetacognitiva[idx] || 'SEGURO';
            return {
                id: item.id,
                materia: item.materia,
                letra,
                correcta: item.correcta,
                esCorrecta,
                certeza,
                latenciaMs
            };
        });

        this.evaluado = true;
        this.renderizarPaso();
    }

    static guardarYRegistrar() {
        if (window.DanteDiagnosticGateManager) {
            if (Number(this.ultimoPuntajeEstimado) > 0) {
                DanteDiagnosticGateManager.markDiagnosticCompleted(this.ultimoPuntajeEstimado);
            } else {
                DanteDiagnosticGateManager.markDiagnosticCompleted();
            }
        }
        this.cerrar();

        // Inmediatamente pasa al Test de Orientación Vocacional
        if (window.DanteHubEngine && typeof DanteHubEngine.abrirPuertaRuta === 'function') {
            DanteHubEngine.abrirPuertaRuta();
        } else if (window.AppController && window.AppController.abrirModalGuardarProgreso) {
            window.AppController.abrirModalGuardarProgreso();
        } else if (window.PactoDanteManager) {
            PactoDanteManager.abrirModal();
        } else {
            location.reload();
        }
    }
}

// ============================================================================
// 4.2 WIZARD DE ORIENTACIÓN VOCACIONAL Y MATRIZ DE BRECHA (BROCHE DE ORO)
// ============================================================================
class OrientacionVocacionalWizardEngine {
    static pasoActual = 1;
    static afiHolland = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    static interesesSeleccionados = [];
    static universidadSeleccionada = "Universidad Nacional de Colombia (UNAL)";
    static carreraSeleccionada = "";
    
    // Catálogo ampliado de cortes de admisión estimados (Puntaje Global ICFES / UNAL)
    static cortesCarrera = {
        "Medicina": 385,
        "Ingeniería de Sistemas / Computación": 350,
        "Derecho & Ciencias Políticas": 335,
        "Enfermería & Fisioterapia": 320,
        "Odontología": 345,
        "Psicología": 325,
        "Administración de Empresas & Negocios": 310,
        "Arquitectura & Diseño Industrial": 330,
        "Licenciatura en Lenguas / Pedagogía": 300,
        "Contaduría Pública & Finanzas": 305,
        "Tecnología en Desarrollo de Software (Vocacional)": 280,
        "Técnico / Tecnólogo en Mecánica & Electrónica": 270,
        "Ciencias Agrónomas & Veterinaria": 315,
        "Biología & Biotecnología": 330
    };

    static abrirModal() {
        if (window.DanteHubEngine && typeof DanteHubEngine.abrirPuertaRuta === 'function') {
            DanteHubEngine.abrirPuertaRuta();
            return;
        }
    }

    static abrirModalPaso3() {
        this.pasoActual = 3;
        const carreraGuardada = localStorage.getItem('dante_carrera_objetivo');
        const uniGuardada = localStorage.getItem('dante_universidad_objetivo');
        if (carreraGuardada) this.carreraSeleccionada = carreraGuardada;
        if (uniGuardada) this.universidadSeleccionada = uniGuardada;

        const modal = document.getElementById('modalOrientacionVocacional');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            this.renderizarPaso();
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalOrientacionVocacional');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    static seleccionarInteres(dim) {
        if (this.interesesSeleccionados.includes(dim)) {
            this.interesesSeleccionados = this.interesesSeleccionados.filter(a => a !== dim);
        } else {
            if (this.interesesSeleccionados.length < 3) {
                this.interesesSeleccionados.push(dim);
            } else {
                this.interesesSeleccionados.shift();
                this.interesesSeleccionados.push(dim);
            }
        }
        this.renderizarPaso();
    }

    static seleccionarCarrera(carrera) {
        this.carreraSeleccionada = carrera;
        this.renderizarPaso();
    }

    static seleccionarUniversidad(uni) {
        this.universidadSeleccionada = uni;
        this.renderizarPaso();
    }

    static avanzarPaso(paso) {
        this.pasoActual = paso;
        this.renderizarPaso();
    }

    static finalizarYGuardarRuta() {
        if (!this.interesesSeleccionados.length || !this.carreraSeleccionada) return;
        const scoreDiag = parseInt(localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_score_diagnostico') || '0', 10);
        const corte = this.cortesCarrera[this.carreraSeleccionada];
        const brecha = scoreDiag > 0 && corte ? Math.max(0, corte - scoreDiag) : null;
        const holland = this.interesesSeleccionados.join('');

        localStorage.setItem('dante_test_vocacional_completado', 'true');
        localStorage.setItem('dante_carrera_objetivo', this.carreraSeleccionada);
        localStorage.setItem('dante_universidad_objetivo', this.universidadSeleccionada);
        localStorage.setItem('dante_holland_code', holland);
        if (corte) {
            localStorage.setItem('dante_corte_objetivo', String(corte));
            localStorage.setItem('dante_pacto_meta', String(corte));
        }

        const alumno = (window.DanteRegistro && DanteRegistro.idAlumno && DanteRegistro.idAlumno())
            || localStorage.getItem('dante_student_id')
            || '';
        if (alumno) {
            fetch('/api/v1/vocational/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: alumno,
                    answers: this.interesesSeleccionados.map((i) => ({ dimension: i, val: 5 })),
                    projectedScore: scoreDiag > 0 ? scoreDiag : null,
                    targetCareerId: this.carreraSeleccionada,
                    carrera: this.carreraSeleccionada,
                    universidad: this.universidadSeleccionada,
                    corte: corte || null
                })
            }).catch(() => {});
        }

        this.cerrarModal();

        if (window.DanteHubEngine && typeof window.DanteHubEngine.pintarPuertaRuta === 'function') {
            window.DanteHubEngine.pintarPuertaRuta();
        }

        if (window.AppController && window.AppController.mostrarNotificacion) {
            const textoBrecha = brecha == null
                ? 'La brecha aparece cuando el diagnóstico tenga puntaje.'
                : `Te faltan ${brecha} puntos frente al corte de ${corte}.`;
            window.AppController.mostrarNotificacion(
                `Ruta guardada: ${this.carreraSeleccionada}. Holland ${holland}. ${textoBrecha}`,
                'success'
            );
        }

        if (window.DanteDiagnosticGateManager) {
            DanteDiagnosticGateManager.removerBannerBloqueo();
            DanteDiagnosticGateManager.mostrarToastDesbloqueo();
        }

        if (window.AppController && window.AppController.regresarASala) {
            window.AppController.regresarASala();
        } else {
            location.reload();
        }
    }

    static renderizarPaso() {
        const body = document.getElementById('bodyOrientacionVocacional');
        if (!body) return;

        const scoreDiag = parseInt(localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_score_diagnostico') || '0', 10);

        if (this.pasoActual === 1) {
            // PASO 1: MODELO HOLLAND (RIASEC) CON MENSAJE EMPÁTICO Y SERIEDAD PEDAGÓGICA
            const dimensionesHolland = [
                { id: 'I', label: 'Investigativo (Analítico & Científico)', desc: 'Resolución de problemas complejos, ciencia, investigación, medicina, análisis de datos.', iconSvg: '<svg class="w-4 h-4 text-purple-300 shrink-0 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
                { id: 'R', label: 'Realista (Práctico & Técnico)', desc: 'Construcción, herramientas, mecánica, tecnología aplicada, trabajo de campo y producción.', iconSvg: '<svg class="w-4 h-4 text-cyan-300 shrink-0 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
                { id: 'A', label: 'Artístico (Creativo & Expresivo)', desc: 'Diseño, música, arquitectura, producción audiovisual, redacción y expresión de ideas.', iconSvg: '<svg class="w-4 h-4 text-amber-300 shrink-0 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.75 1.7-1.7 0-.42-.16-.82-.44-1.12-.27-.3-.42-.71-.42-1.18 0-.93.75-1.7 1.7-1.7h2.46c3.31 0 6-2.69 6-6 0-4.97-4.97-8.4-11-8.4z"/></svg>' },
                { id: 'S', label: 'Social (Orientado a las Personas)', desc: 'Enseñanza, salud, psicología, asistencia humana, desarrollo comunitario y pedagogía.', iconSvg: '<svg class="w-4 h-4 text-emerald-300 shrink-0 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
                { id: 'E', label: 'Emprendedor (Liderazgo & Negocios)', desc: 'Gestión de proyectos, liderazgo, ventas, finanzas, política y toma de decisiones.', iconSvg: '<svg class="w-4 h-4 text-purple-300 shrink-0 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>' },
                { id: 'C', label: 'Convencional (Estructura & Organización)', desc: 'Administración, contabilidad, legislación, logística y gestión de procesos rigurosos.', iconSvg: '<svg class="w-4 h-4 text-blue-300 shrink-0 inline mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' }
            ];

            body.innerHTML = `
                <div class="space-y-4 text-left font-mono">
                    <div class="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs font-sans text-slate-200 leading-relaxed flex items-start gap-3">
                        <svg class="w-5 h-5 text-amber-300 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                        <div>
                            <strong class="text-purple-300 font-mono text-[11px] uppercase block mb-0.5">Compromiso Pedagógico Dante OS:</strong>
                            Nos tomamos muy en serio la educación de Colombia. Requerimos conocer tu perfil de personalidad vocacional (Modelo Psicológico Holland RIASEC) para estructurar el acompañamiento adaptativo que te asegurará un cupo en la carrera que deseas.
                        </div>
                    </div>

                    <div class="flex justify-between items-center text-xs">
                        <span class="text-purple-300 font-bold uppercase tracking-wider">PASO 1 DE 4 · AFINIDAD VOCACIONAL HOLLAND (RIASEC)</span>
                        <span class="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[10.5px]">Selecciona hasta 3 dimensiones</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        ${dimensionesHolland.map(d => {
                            const sel = this.interesesSeleccionados.includes(d.id);
                            return `
                                <button type="button" onclick="OrientacionVocacionalWizardEngine.seleccionarInteres('${d.id}')" class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    sel ? 'bg-purple-950/90 border-2 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-purple-500/40'
                                }">
                                    <div>
                                        <div class="font-bold text-xs font-mono text-purple-200 flex items-center">
                                            ${d.iconSvg}
                                            <span>${d.label}</span>
                                        </div>
                                        <div class="text-[11px] text-slate-400 font-sans mt-1 leading-normal">${d.desc}</div>
                                    </div>
                                    <div class="text-[10px] font-mono font-bold mt-2.5 text-right flex items-center justify-end gap-1 ${sel ? 'text-amber-300' : 'text-slate-500'}">
                                        ${sel ? '<svg class="w-3 h-3 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <span>Prioridad Vocacional</span>' : '<span>+ Seleccionar</span>'}
                                    </div>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <button type="button" onclick="OrientacionVocacionalWizardEngine.avanzarPaso(2)" ${this.interesesSeleccionados.length === 0 ? 'disabled class="w-full py-3.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs uppercase cursor-not-allowed"' : 'class="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"'}>
                        <span>PASO 2: SELECCIONAR INSTITUCIÓN Y PROGRAMA OBJETIVO</span>
                        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            `;
        } else if (this.pasoActual === 2) {
            // PASO 2: SELECCIÓN DE UNIVERSIDAD Y PROGRAMA OBJETIVO (INCLUSIÓN TOTAL)
            const universidades = [
                'Universidad Nacional de Colombia (UNAL)',
                'Universidad de Antioquia (UDEA)',
                'Universidad Industrial de Santander (UIS)',
                'Universidad del Valle (Univalle)',
                'Universidad Tecnológica de Pereira (UTP)',
                'Universidad Pedagógica Nacional (UPN)',
                'SENA / Instituto Técnico Profesional (Vocacional)',
                'Beca ICFES Excelencia / Generación E',
                'Universidad Privada con Beca de Mérito'
            ];

            const carreras = Object.keys(this.cortesCarrera);

            body.innerHTML = `
                <div class="space-y-4 text-left font-mono">
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-purple-300 font-bold uppercase tracking-wider">PASO 2 DE 4 · INSTITUCIÓN Y PROGRAMA OBJETIVO</span>
                        <span class="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[10.5px]">Cortes Oficiales Colombia</span>
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-200">1. Institución o Programa de Elección:</label>
                        <select onchange="OrientacionVocacionalWizardEngine.seleccionarUniversidad(this.value)" class="w-full p-3 bg-slate-900 border border-purple-500/40 rounded-xl text-xs text-purple-200 font-mono focus:outline-none focus:border-purple-400">
                            ${universidades.map(u => `<option value="${u}" ${u === this.universidadSeleccionada ? 'selected' : ''}>${u}</option>`).join('')}
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-200">2. Programa o Carrera de tus Sueños:</label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                            ${carreras.map(c => {
                                const sel = (c === this.carreraSeleccionada);
                                const corte = this.cortesCarrera[c];
                                return `
                                    <button type="button" onclick="OrientacionVocacionalWizardEngine.seleccionarCarrera('${c}')" class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                        sel ? 'bg-purple-950/90 border-2 border-purple-400 text-white shadow-md' : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-purple-500/40'
                                    }">
                                        <div>
                                            <div class="font-bold text-xs font-mono text-white">${c}</div>
                                            <div class="text-[10px] text-amber-300 font-mono">Corte est. ~${corte} Pts</div>
                                        </div>
                                        <div class="text-xs font-bold ${sel ? 'text-purple-300' : 'text-slate-600'}">
                                            ${sel ? '<svg class="w-4 h-4 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '○'}
                                        </div>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="OrientacionVocacionalWizardEngine.avanzarPaso(1)" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            <span>Atrás</span>
                        </button>
                        <button type="button" onclick="OrientacionVocacionalWizardEngine.avanzarPaso(3)" ${this.carreraSeleccionada ? '' : 'disabled'} class="flex-1 py-3.5 rounded-xl ${this.carreraSeleccionada ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} font-mono font-black text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2">
                            <span>PASO 3: CALCULAR MATRIZ DE BRECHA (SCORE GAP)</span>
                            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            `;
        } else if (this.pasoActual === 3) {
            // PASO 3: MATRIZ DE BRECHA (SCORE GAP MATRIX) + MATRIZ MULTI-CARRERA & ARQUETIPOS (FREE vs PRO)
            const corte = this.cortesCarrera[this.carreraSeleccionada] || 0;
            const brecha = scoreDiag > 0 && corte ? Math.max(0, corte - scoreDiag) : null;
            const dosisRecomendada = brecha > 60 ? 15 : brecha > 30 ? 10 : 8;
            const isProUser = typeof VidasManager !== 'undefined' && VidasManager.isPro();

            // Lógica de Opciones de Respaldo según carrera seleccionada
            let opSecundario = "Psicología & Salud Pública";
            let opCobertura = "Tecnología / Licenciatura Aplicada";
            if (this.carreraSeleccionada.includes("Medicina") || this.carreraSeleccionada.includes("Enfermería")) {
                opSecundario = "Biología & Biotecnología (UNAL / UdeA)";
                opCobertura = "Psicología & Salud Comunitario (Univalle)";
            } else if (this.carreraSeleccionada.includes("Ingeniería")) {
                opSecundario = "Tecnología en Desarrollo de Software";
                opCobertura = "Administración & Logística Tecnológica";
            } else if (this.carreraSeleccionada.includes("Derecho")) {
                opSecundario = "Ciencias Políticas & Relaciones Internacionales";
                opCobertura = "Licenciatura en Ciencias Sociales & Pedagogía";
            }

            body.innerHTML = `
                <div class="space-y-4 text-left font-mono">
                    <div class="flex justify-between items-center text-xs border-b border-purple-500/30 pb-2">
                        <span class="text-purple-300 font-bold uppercase tracking-wider">PASO 3 DE 4 · MATRIZ DE BRECHA & PROYECCIÓN MULTI-CARRERA</span>
                        ${isProUser ? `
                            <span class="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10.5px] font-bold">PRO: MATRIZ COMPLETA Y ARQUETIPOS 01-09</span>
                        ` : `
                            <span class="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[10.5px] font-bold">DIAGNÓSTICO BÁSICO</span>
                        `}
                    </div>

                    <!-- RESUMEN DE PUNTOS Y CORTE -->
                    <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-950 border-2 border-purple-400 shadow-2xl space-y-3">
                        <div class="text-xs text-slate-300 font-sans">
                            Resumen de Calibración para tu Proyecto de Vida:
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                <span class="text-[10px] text-slate-400 block font-bold uppercase">PUNTAJE DIAGNÓSTICO</span>
                                <span class="text-2xl font-black text-amber-400">${scoreDiag > 0 ? scoreDiag + ' Pts' : '—'}</span>
                            </div>

                            <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                <span class="text-[10px] text-slate-400 block font-bold uppercase">CORTE REQUERIDO</span>
                                <span class="text-2xl font-black text-cyan-400">${corte} Pts</span>
                            </div>

                            <div class="p-3 rounded-xl bg-slate-900 border border-purple-500/40">
                                <span class="text-[10px] text-slate-400 block font-bold uppercase">BRECHA A SUPERAR</span>
                                <span class="text-2xl font-black ${brecha > 0 ? 'text-purple-300' : 'text-emerald-400'}">
                                    ${brecha == null ? '—' : (brecha > 0 ? '+' + brecha + ' Pts' : '0 Pts (En Meta)')}
                                </span>
                            </div>
                        </div>

                        <div class="p-3.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-xs font-sans text-slate-200 leading-relaxed space-y-1.5">
                            <div class="font-mono font-bold text-amber-300 text-[11px] uppercase flex items-center gap-1.5">
                                <svg class="w-4 h-4 text-amber-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                                <span>Estrategia Prescriptiva Dante OS:</span>
                            </div>
                            <p>
                                Tu proyección ${scoreDiag > 0 ? 'es ' + scoreDiag + ' de 500' : 'aparece al terminar el diagnóstico'}. El corte estimado de <strong>${this.carreraSeleccionada}</strong> es <strong>${corte || '—'}</strong> en la misma escala. ${brecha == null ? 'La brecha se calcula cuando existan los dos números.' : 'Te faltan ' + brecha + ' puntos.'}
                            </p>
                        </div>
                    </div>

                    <!-- MATRIZ MULTI-CARRERA DE RESPALDO (3 OPCIONES) -->
                    <div class="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span class="text-xs font-bold text-white uppercase flex items-center gap-2 font-mono">
                                <svg class="w-4 h-4 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z"/></svg>
                                <span>MATRIZ MULTI-CARRERA DE RESPALDO UNIVERSITARIO</span>
                            </span>
                            <span class="text-[10px] text-purple-300 font-mono">Ponderación RIASEC</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                            <!-- 1. Opción Principal (FREE & PRO) -->
                            <div class="p-3 rounded-xl bg-purple-950/70 border border-purple-400/60 space-y-1">
                                <span class="text-[9px] font-bold text-amber-300 uppercase flex items-center gap-1 font-mono">
                                    <svg class="w-3.5 h-3.5 text-amber-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                                    <span>1. OPCIÓN PRINCIPAL</span>
                                </span>
                                <div class="font-bold text-white">${this.carreraSeleccionada}</div>
                                <div class="text-[10px] text-slate-300 font-sans">${this.universidadSeleccionada}</div>
                                <div class="text-[10px] text-cyan-300 font-mono font-bold pt-1">Corte: ~${corte} Pts</div>
                            </div>

                            <div class="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-1">
                                <span class="text-[9px] font-bold text-cyan-300 uppercase flex items-center gap-1 font-mono">
                                    <svg class="w-3.5 h-3.5 text-cyan-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    <span>2. OPCIÓN SECUNDARIA</span>
                                </span>
                                <div class="font-bold text-white">${opSecundario}</div>
                                <div class="text-[10px] text-emerald-300 font-mono font-bold pt-1">Misma familia de intereses. El corte se confirma al elegirla.</div>
                            </div>

                            <div class="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
                                <span class="text-[9px] font-bold text-emerald-300 uppercase flex items-center gap-1 font-mono">
                                    <svg class="w-3.5 h-3.5 text-emerald-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    <span>3. OPCIÓN DE COBERTURA</span>
                                </span>
                                <div class="font-bold text-white">${opCobertura}</div>
                                <div class="text-[10px] text-emerald-300 font-mono font-bold pt-1">Ruta de respaldo con mayor probabilidad de admisión.</div>
                            </div>
                        </div>
                    </div>

                    <!-- TEST PSICOMÉTRICO DE ARQUETIPOS COGNITIVOS (CICLOS 01 AL 09) -->
                    <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/60 to-slate-950 border border-purple-500/40 space-y-3">
                        <div class="flex items-center justify-between border-b border-purple-500/30 pb-2">
                            <span class="text-xs font-bold text-purple-200 uppercase font-mono flex items-center gap-2">
                                <svg class="w-4 h-4 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
                                <span>ARQUETIPOS COGNITIVOS PSICOMÉTRICOS (CICLOS 01 AL 09)</span>
                            </span>
                            <span class="text-[10px] font-mono text-emerald-300 font-bold">
                                <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/></svg> PARA TODOS</span>
                            </span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-sans">
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-purple-300 font-bold block">CICLO 01: PERSONALIDAD HOLLAND</span>
                                <span class="text-white font-bold">Investigativo / Social (I-S)</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-cyan-300 font-bold block">CICLO 02: RESISTENCIA 4.5H</span>
                                <span class="text-white font-bold">Entrenamiento en bloques diarios</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-amber-300 font-bold block">CICLO 03: VELOCIDAD LECTORA</span>
                                <span class="text-white font-bold">Inferencia rápida por ítem</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-emerald-300 font-bold block">CICLO 04: CONTROL TRAMPAS</span>
                                <span class="text-white font-bold">Filtro de distractores</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-purple-300 font-bold block">CICLO 05: TOLERANCIA FRUSTRACIÓN</span>
                                <span class="text-white font-bold">Análisis socrático calmado</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-cyan-300 font-bold block">CICLO 06: DESCARTE TÁCTICO</span>
                                <span class="text-white font-bold">Eliminación de opciones</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-amber-300 font-bold block">CICLO 07: RETENCIÓN SOCRÁTICA</span>
                                <span class="text-white font-bold">Tutor con tope pedagógico 5/día</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-emerald-300 font-bold block">CICLO 08: ANÁLISIS FATIGA</span>
                                <span class="text-white font-bold">Pausa reguladora entre bloques</span>
                            </div>
                            <div class="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
                                <span class="font-mono text-[9px] text-purple-300 font-bold block">CICLO 09: CALIBRACIÓN OBJETIVO</span>
                                <span class="text-white font-bold">Ajuste a tu meta Saber 11°</span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2 pt-1 font-mono">
                        <button type="button" onclick="OrientacionVocacionalWizardEngine.avanzarPaso(4)" class="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-400 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-purple-300">
                            <span>PASO 4: DIAGNÓSTICO PROFUNDO DE COMPORTAMIENTO & HÁBITOS</span>
                            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            `;
        } else if (this.pasoActual === 4) {
            // PASO 4: PROFUNDIZACIÓN CONDUCTUAL Y ESTILO DE APRENDIZAJE (SIN REPETIR LO BÁSICO)
            const frustracionGuardada = localStorage.getItem('dante_reaccion_frustracion') || 'DESGLOSE';
            const fatigaGuardada = localStorage.getItem('dante_etapa_fatiga') || 'HORA_3';
            const estiloGuardado = localStorage.getItem('dante_estilo_pistas') || 'SOCRATICO';

            body.innerHTML = `
                <div class="space-y-4 text-left font-mono">
                    <div class="flex justify-between items-center text-xs border-b border-cyan-500/30 pb-2">
                        <span class="text-cyan-300 font-bold uppercase tracking-wider">PASO 4 DE 4 · PERFIL CONDUCTUAL & ESTILO COGNITIVO</span>
                        <span class="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10.5px]">CONFIGURACIÓN AVANZADA DANTE OS</span>
                    </div>

                    <div class="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs font-sans text-slate-200 leading-relaxed flex items-start gap-3">
                        <svg class="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        <div>
                            <strong class="text-cyan-300 font-mono text-[11px] uppercase block mb-0.5">Adaptación Psicológica Continua:</strong>
                            Queremos conocer a fondo cómo reaccionas ante la presión y qué tipo de explicación te ayuda a memorizar mejor.
                        </div>
                    </div>

                    <!-- 1. MANEJO DE FRUSTRACIÓN -->
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-200">1. Al fallar una pregunta compleja de alta dificultad, ¿cuál es tu primera reacción?</label>
                        <select id="selReaccionFrustracion" class="w-full p-2.5 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400">
                            <option value="DESGLOSE" ${frustracionGuardada === 'DESGLOSE' ? 'selected' : ''}>Reviso la explicación socrática paso a paso con calma</option>
                            <option value="RAPIDO" ${frustracionGuardada === 'RAPIDO' ? 'selected' : ''}>Me apresuro y paso rápido a la siguiente pregunta</option>
                            <option value="DUDAR" ${frustracionGuardada === 'DUDAR' ? 'selected' : ''}>Siento inseguridad y dudo de mi preparación general</option>
                        </select>
                    </div>

                    <!-- 2. PUNTOS DE FATIGA COGNITIVA -->
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-200">2. En un examen de 4.5 horas (ICFES real), ¿en qué momento sientes mayor cansancio mental?</label>
                        <select id="selEtapaFatiga" class="w-full p-2.5 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400">
                            <option value="HORA_1" ${fatigaGuardada === 'HORA_1' ? 'selected' : ''}>En la primera hora (me cuesta entrar en ritmo de concentración)</option>
                            <option value="HORA_3" ${fatigaGuardada === 'HORA_3' ? 'selected' : ''}>En la tercera hora (se me nubla la vista o pierdo lectura rápida)</option>
                            <option value="LARGOS" ${fatigaGuardada === 'LARGOS' ? 'selected' : ''}>Solo cuando me enfrento a lecturas filosóficas o textos muy extensos</option>
                        </select>
                    </div>

                    <!-- 3. PREFERENCIA DE PISTAS -->
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-200">3. ¿Cómo prefieres que el Tutor IA Dante intervenga cuando estás atascado?</label>
                        <select id="selEstiloPistas" class="w-full p-2.5 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400">
                            <option value="SOCRATICO" ${estiloGuardado === 'SOCRATICO' ? 'selected' : ''}>Con preguntas guía (Pistas Socráticas para deducirlo yo mismo)</option>
                            <option value="PASO_A_PASO" ${estiloGuardado === 'PASO_A_PASO' ? 'selected' : ''}>Con el desglose matemático o analítico completo paso a paso</option>
                            <option value="ANALOGIAS" ${estiloGuardado === 'ANALOGIAS' ? 'selected' : ''}>Con ejemplos prácticos y analogías de la vida cotidiana</option>
                        </select>
                    </div>

                    <div class="flex gap-2 pt-2">
                        <button type="button" onclick="OrientacionVocacionalWizardEngine.avanzarPaso(3)" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer flex items-center gap-1">
                            <svg class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            <span>Atrás</span>
                        </button>
                        <button type="button" onclick="OrientacionVocacionalWizardEngine.guardarConductualYFinalizar()" class="flex-1 py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-200">
                            <svg class="w-4 h-4 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span>GUARDAR AJUSTES DE PERFIL & ACTIVAR DANTE OS</span>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    static guardarConductualYFinalizar() {
        const frustracion = document.getElementById('selReaccionFrustracion')?.value || 'DESGLOSE';
        const fatiga = document.getElementById('selEtapaFatiga')?.value || 'HORA_3';
        const estilo = document.getElementById('selEstiloPistas')?.value || 'SOCRATICO';

        localStorage.setItem('dante_reaccion_frustracion', frustracion);
        localStorage.setItem('dante_etapa_fatiga', fatiga);
        localStorage.setItem('dante_estilo_pistas', estilo);

        this.finalizarYGuardarRuta();
    }
}

// ============================================================================
// 4.6 MOTOR DE CHECK-IN DE ESTADO EMOCIONAL Y COGNITIVO PRE-SESIÓN
// ============================================================================
class CheckInEstadoEngine {
    static onConfirmCallback = null;

    static getEstadoActual() {
        return localStorage.getItem('dante_estado_animo') || 'NORMAL';
    }

    static setEstadoActual(estado, showNotification = true) {
        localStorage.setItem('dante_estado_animo', estado);
        this.actualizarUIHUD();

        if (showNotification && window.AppController && window.AppController.mostrarNotificacion) {
            let msj = "🟢 Modo Desafío Cargado: Preguntas de alta exigencia activadas.";
            if (estado === 'NORMAL') msj = "🟡 Modo Estándar Activado: Balance óptimo de dificultad.";
            else if (estado === 'ANSIOSO') msj = "🟣 Modo Calma Activado: Respiración guiada y regulación vagal.";
            else if (estado === 'CANSADO') msj = "🔴 Modo Ajustado Activado: Mayor acompañamiento socrático y ritmo pausado.";
            window.AppController.mostrarNotificacion(msj, 'success');
        }
    }

    static actualizarUIHUD() {
        const estado = this.getEstadoActual();
        const container = document.getElementById('containerEstadoCognitivoHUD');
        if (!container) return;

        const labelModo = document.getElementById('lblModoActivoHUD');
        if (labelModo) {
            const config = {
                'ENFOCADO': { texto: '🟢 Enfocado (Modo Desafío)', color: 'text-emerald-400' },
                'NORMAL': { texto: '🟡 Normal (Modo Estándar)', color: 'text-amber-400' },
                'ANSIOSO': { texto: '🟣 Ansioso (Modo Calma)', color: 'text-purple-400' },
                'CANSADO': { texto: '🔴 Cansado (Modo Ajustado)', color: 'text-rose-400' }
            };
            const item = config[estado] || config['NORMAL'];
            labelModo.innerText = item.texto;
            labelModo.className = `font-bold ${item.color}`;
        }

        const buttons = container.querySelectorAll('button[data-estado]');
        buttons.forEach(btn => {
            const btnEst = btn.getAttribute('data-estado');
            const oldBadge = btn.querySelector('.badge-activo-hud');
            if (oldBadge) oldBadge.remove();

            if (btnEst === estado) {
                btn.className = "p-2.5 rounded-xl bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer text-center relative scale-[1.02]";
                const badge = document.createElement('span');
                badge.className = "badge-activo-hud absolute -top-2 -right-1 px-1.5 py-0.2 bg-cyan-400 text-slate-950 font-black text-[8.5px] rounded-full border border-cyan-200 uppercase tracking-tight shadow";
                badge.innerText = "✓ ACTIVO";
                btn.appendChild(badge);
            } else {
                btn.className = "p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 transition-all cursor-pointer text-center opacity-75 hover:opacity-100 relative";
            }
        });

        const lblBtnHUD = document.getElementById('lblBtnAccionPrincipalHUD');
        const lblTextoMeta = document.getElementById('lblTextoMetaDia');
        if (window.DanteTutorEngine) {
            const estadoDiario = window.DanteTutorEngine.verificarOCrearEstadoDiario();
            if (estadoDiario) {
                const bAct = estadoDiario.bloqueActual;
                const bTot = estadoDiario.totalBloquesDiarios || 5;
                const rHoy = estadoDiario.reactivosHoyCompletados || 0;
                const rTot = estadoDiario.reactivosTotalHoy || 25;
                const rPorB = estadoDiario.reactivosPorBloque || 5;
                const esCumplido = rHoy >= rTot;

                const totalPasos = 5;
                const numPaso = Math.min(bAct, totalPasos);

                if (lblBtnHUD) {
                    if (esCumplido) {
                        lblBtnHUD.innerText = `MISIÓN CUMPLIDA HOY (${rHoy}/${rTot} ÍTEMS COMPLETADOS)`;
                    } else {
                        let pasoNombre = `BLOQUE ${numPaso}`;
                        if (numPaso === 5) pasoNombre = `EXAMEN FINAL DEL DÍA`;
                        lblBtnHUD.innerText = `INICIAR PASO ${numPaso} DE ${totalPasos}: ${pasoNombre} (${rPorB} ÍTEMS)`;
                    }
                }

                if (lblTextoMeta) {
                    if (esCumplido) {
                        lblTextoMeta.innerText = `Misión Cumplida: ${totalPasos} Pasos Resueltos Hoy (${rHoy}/${rTot} Preguntas)`;
                    } else {
                        lblTextoMeta.innerText = `Misión del Día: Paso ${numPaso} de ${totalPasos} Activo (${rHoy}/${rTot} Preguntas)`;
                    }
                }
            }
        }
    }

    static abrirModal(callback) {
        if (typeof callback === 'function') {
            this.onConfirmCallback = callback;
        }

        // Suprimir Check-in en diagnósticos iniciales (reservado solo para sesiones regulares)
        const urlParams = new URLSearchParams(window.location.search);
        const isDiagnosticLaunch = urlParams.get('launch') === 'diagnostic' || 
                                   urlParams.get('action') === 'start_diag' ||
                                   sessionStorage.getItem('dante_is_diagnostic') === 'true' ||
                                   localStorage.getItem('dante_is_diagnostic') === 'true';

        if (isDiagnosticLaunch) {
            if (typeof this.onConfirmCallback === 'function') {
                const cb = this.onConfirmCallback;
                this.onConfirmCallback = null;
                cb();
            }
            return;
        }

        let modal = document.getElementById('modalCheckInEmocional');
        if (!modal) {
            this.crearModalUI();
            modal = document.getElementById('modalCheckInEmocional');
        }
        if (modal) {
            this.actualizarVisualesModal();
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalCheckInEmocional');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    static crearModalUI() {
        const div = document.createElement('div');
        div.id = 'modalCheckInEmocional';
        div.className = 'fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 font-sans hidden';
        div.onclick = (e) => { if (e.target === div) this.cerrarModal(); };

        const nombre = localStorage.getItem('dante_student_name') || 'Estudiante';

        div.innerHTML = `
            <div class="max-w-md w-full p-5 sm:p-6 bg-slate-900/95 border border-slate-800 backdrop-blur-2xl rounded-3xl relative text-left shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] space-y-4 border-t border-t-slate-700/50">
                <button type="button" onclick="CheckInEstadoEngine.cerrarModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
                
                <div class="flex items-center gap-3 border-b border-slate-800/80 pb-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                        <i class="fa-solid fa-brain text-xl"></i>
                    </div>
                    <div class="space-y-0.5">
                        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                            CHECK-IN PRE-SESIÓN
                        </span>
                        <h3 class="text-base font-extrabold text-white font-sans tracking-tight">
                            Estado de Enfoque Cognitivo
                        </h3>
                    </div>
                </div>

                <div class="space-y-1 text-xs font-sans text-slate-300 leading-relaxed">
                    <p class="font-bold text-white text-sm">
                        ¡Hola, ${nombre}!
                    </p>
                    <p class="text-slate-400">
                        Selecciona tu nivel de energía actual para que el Profesor Dante adapte la curva de dificultad de tu entrenamiento:
                    </p>
                </div>

                <div class="space-y-2.5 font-sans text-xs" id="optionsModalCheckIn">
                    <button type="button" data-estado="ENFOCADO" onclick="CheckInEstadoEngine.seleccionarEstadoModal('ENFOCADO')" class="w-full p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/50 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 relative">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-bolt text-sm"></i>
                            </div>
                            <div>
                                <div class="font-bold text-white group-hover:text-emerald-300 text-xs">Enfocado y con Alta Energía</div>
                                <div class="text-[10.5px] text-slate-400 font-sans mt-0.5">Modo Desafío — Preguntas de mayor complejidad.</div>
                            </div>
                        </div>
                    </button>

                    <button type="button" data-estado="NORMAL" onclick="CheckInEstadoEngine.seleccionarEstadoModal('NORMAL')" class="w-full p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/50 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 relative">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-gauge-high text-sm"></i>
                            </div>
                            <div>
                                <div class="font-bold text-white group-hover:text-cyan-300 text-xs">Normal / Concentración Balanceada</div>
                                <div class="text-[10.5px] text-slate-400 font-sans mt-0.5">Modo Estándar — Ritmo equilibrado media ICFES.</div>
                            </div>
                        </div>
                    </button>

                    <button type="button" data-estado="ANSIOSO" onclick="CheckInEstadoEngine.seleccionarEstadoModal('ANSIOSO')" class="w-full p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-purple-500/50 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 relative">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-spa text-sm"></i>
                            </div>
                            <div>
                                <div class="font-bold text-white group-hover:text-purple-300 text-xs">Ansioso / Inseguro</div>
                                <div class="text-[10.5px] text-slate-400 font-sans mt-0.5">Modo Calma — Pausas guiadas y ritmo adaptativo.</div>
                            </div>
                        </div>
                    </button>

                    <button type="button" data-estado="CANSADO" onclick="CheckInEstadoEngine.seleccionarEstadoModal('CANSADO')" class="w-full p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/50 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 relative">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-battery-quarter text-sm"></i>
                            </div>
                            <div>
                                <div class="font-bold text-white group-hover:text-amber-300 text-xs">Cansado / Agotado</div>
                                <div class="text-[10.5px] text-slate-400 font-sans mt-0.5">Modo Ajustado — Presión reducida y más apoyo socrático.</div>
                            </div>
                        </div>
                    </button>
                </div>

                <div class="pt-1">
                    <button type="button" onclick="CheckInEstadoEngine.confirmarEstadoActual()" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                        <span>CONFIRMAR E INICIAR ENTRENAMIENTO</span>
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
        this.actualizarVisualesModal();
    }

    static actualizarVisualesModal() {
        const estado = this.getEstadoActual();
        const optsContainer = document.getElementById('optionsModalCheckIn');
        if (!optsContainer) return;

        const buttons = optsContainer.querySelectorAll('button[data-estado]');
        buttons.forEach(btn => {
            const btnEst = btn.getAttribute('data-estado');
            const oldBadge = btn.querySelector('.badge-modal-activo');
            if (oldBadge) oldBadge.remove();

            if (btnEst === estado) {
                btn.className = "w-full p-3.5 rounded-2xl bg-slate-800/90 border-2 border-cyan-400 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 relative shadow-[0_0_20px_rgba(6,182,212,0.2)]";

                const badge = document.createElement('span');
                badge.className = "badge-modal-activo px-2.5 py-1 bg-cyan-400 text-slate-950 font-mono font-black text-[9.5px] rounded-lg uppercase tracking-wider shadow shrink-0 flex items-center gap-1";
                badge.innerHTML = `<i class="fa-solid fa-check text-[9px]"></i> SELECCIONADO`;
                btn.appendChild(badge);
            } else {
                btn.className = "w-full p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 relative opacity-85 hover:opacity-100";
            }
        });
    }

    static seleccionarEstadoModal(estado) {
        this.setEstadoActual(estado, false);
        this.actualizarVisualesModal();
    }

    static confirmarEstadoActual() {
        const estado = this.getEstadoActual();
        this.setEstadoActual(estado, true);
        this.cerrarModal();

        if (estado === 'ANSIOSO' && window.VagalRegulationService) {
            window.VagalRegulationService.openModal();
        } else if (estado === 'CANSADO' && window.StressSoundEngine) {
            window.StressSoundEngine.openModal();
        }

        if (typeof this.onConfirmCallback === 'function') {
            const cb = this.onConfirmCallback;
            this.onConfirmCallback = null;
            cb();
        }
    }

    static seleccionarEstado(estado) {
        this.setEstadoActual(estado, true);
        this.cerrarModal();

        if (estado === 'ANSIOSO' && window.VagalRegulationService) {
            window.VagalRegulationService.openModal();
        } else if (estado === 'CANSADO' && window.StressSoundEngine) {
            window.StressSoundEngine.openModal();
        }

        if (typeof this.onConfirmCallback === 'function') {
            const cb = this.onConfirmCallback;
            this.onConfirmCallback = null;
            cb();
        }
    }
}

// ============================================================================
// 4.5 CANDADO DE CONTROL DE ACCESO SALA (PRUEBA DIAGNÓSTICA + VOCACIONAL OBLIGATORIA)
// ============================================================================
class DanteDiagnosticGateManager {
    static isDiagnosticCompleted() {
        try {
            const flag = localStorage.getItem('dante_diagnostic_completed');
            if (flag === 'true') return true;

            const calibDone = localStorage.getItem('dante_calibracion_tactica_inicial_done') === 'true' || localStorage.getItem('dante_diagnostico_completado') === 'true';
            if (calibDone) return true;

            const scoreDiag = localStorage.getItem('dante_score_diagnostico');
            if (scoreDiag && parseInt(scoreDiag, 10) > 0) return true;
        } catch (e) {
            console.warn('[DanteDiagnosticGateManager] Error verificando estado de diagnóstico:', e);
        }
        return false;
    }

    static isVocacionalCompleted() {
        try {
            const flag = localStorage.getItem('dante_test_vocacional_completado');
            if (flag === 'true') return true;

            const carrera = localStorage.getItem('dante_carrera_objetivo');
            if (carrera && carrera.length > 0) return true;
            const meta = parseInt(localStorage.getItem('dante_meta_saber') || '0', 10);
            if (meta > 0) return true;
            const preu = localStorage.getItem('dante_preu_carrera') || '';
            if (preu.length > 0) return true;
        } catch (e) {
            console.warn('[DanteDiagnosticGateManager] Error verificando test vocacional:', e);
        }
        return false;
    }

    static isFullBaselineCompleted() {
        return this.isDiagnosticCompleted() && this.isVocacionalCompleted();
    }

    static markDiagnosticCompleted(score) {
        try {
            localStorage.setItem('dante_diagnostic_completed', 'true');
            localStorage.setItem('dante_calibracion_tactica_inicial_done', 'true');
            if (Number(score) > 0) {
                localStorage.setItem('dante_score_diagnostico', String(score));
                localStorage.setItem('dante_score_proyectado', String(score));
            }
            this.renderizarBannerBloqueoSiAplica();
        } catch (e) {
            console.error('[DanteDiagnosticGateManager] Error guardando estado de diagnóstico:', e);
        }
    }

    static checkOrBlock(actionName = "manipular los módulos de la sala", isDiagnosticAction = false) {
        // 1. Requerir primero la firma del Pacto Socrático
        const pactoAceptado = localStorage.getItem('dante_pacto_accepted') === 'true' || 
                              localStorage.getItem('dante_pacto_accepted') === 'transient' || 
                              localStorage.getItem('dante_onboarding_completed') === 'true';
        if (!pactoAceptado) {
            if (window.PactoDanteManager) {
                window.PactoDanteManager.abrirModal();
            } else if (typeof PactoDanteManager !== 'undefined') {
                PactoDanteManager.abrirModal();
            }
            if (typeof mostrarNotificacionPWA === 'function') {
                mostrarNotificacionPWA("📜 Debes firmar el Pacto del Profesor Dante para continuar.", "warning");
            }
            return false;
        }

        if (isDiagnosticAction) {
            return true;
        }

        // 2. Requerir la prueba diagnóstica inicial obligatoria (Paso 1)
        if (!this.isDiagnosticCompleted()) {
            if (typeof mostrarNotificacionPWA === 'function') {
                mostrarNotificacionPWA("⚡ Paso 1 Obligatorio: Presenta tu Prueba Diagnóstica de Calibración.", "warning");
            } else {
                alert("⚡ PASO 1 OBLIGATORIO: Debes presentar tu Prueba Diagnóstica de Calibración para habilitar los bloques de entrenamiento.");
            }
            if (window.AppController && window.AppController.iniciarSimulacroDiagnostico) {
                window.AppController.iniciarSimulacroDiagnostico(true);
            }
            return false;
        }

        return true;
    }

    static renderizarBannerBloqueoSiAplica() {
        if (/perfil/i.test(location.pathname)) {
            const viejo = document.getElementById('bannerDiagnosticRequirement');
            if (viejo) viejo.remove();
            return;
        }
        let banner = document.getElementById('bannerDiagnosticRequirement');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'bannerDiagnosticRequirement';
            banner.className = 'w-full mb-5 font-mono text-left transition-all';
            
            const targetLocation = document.getElementById('bannerPasoRutaPrincipal');
            if (targetLocation && targetLocation.parentNode) {
                targetLocation.parentNode.insertBefore(banner, targetLocation);
            } else {
                const gatewayContainer = document.getElementById('viewGateway') || document.getElementById('viewDashboard');
                if (gatewayContainer) {
                    const innerCard = gatewayContainer.querySelector('.gateway-card') || gatewayContainer;
                    innerCard.insertBefore(banner, innerCard.firstChild);
                } else {
                    document.body.appendChild(banner);
                }
            }
        }

        if (this.isFullBaselineCompleted()) {
            const carrera = localStorage.getItem('dante_carrera_objetivo') || 'Carrera sin elegir';
            const uni = localStorage.getItem('dante_universidad_objetivo') || '';
            const scoreDiag = parseInt(localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_score_diagnostico') || '0', 10);
            const corte = parseInt(localStorage.getItem('dante_corte_objetivo') || '0', 10);
            const brecha = scoreDiag > 0 && corte > 0 ? Math.max(0, corte - scoreDiag) : null;
            const dosis = localStorage.getItem('dante_dosis_prescrita_diaria') || '';
            const isProUser = typeof VidasManager !== 'undefined' && VidasManager.isPro();

            banner.className = 'w-full mb-5 p-4 bg-gradient-to-r from-slate-950 via-purple-950/90 to-slate-950 border-2 border-purple-500/70 rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.25)] font-mono text-left flex flex-col md:flex-row items-center justify-between gap-4';
            banner.innerHTML = `
                <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/60 flex items-center justify-center text-purple-300 shrink-0 shadow-lg">
                        <svg class="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <div>
                        <div class="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                            <span>RUTA VOCACIONAL CIENTÍFICA ACTIVADA</span>
                            ${isProUser ? `
                                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">👑 PRO: MULTI-CARRERA & ARQUETIPOS 01-09</span>
                            ` : `
                                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">MANDO DESBLOQUEADO (FREE)</span>
                            `}
                        </div>
                        <div class="text-sm font-bold text-white font-sans mt-0.5">
                            ${carrera} <span class="text-xs text-purple-300 font-mono">(${uni})</span>
                        </div>
                        <div class="text-[11px] text-slate-300 font-sans mt-1 flex flex-wrap gap-2">
                            <span>• Diagnóstico: <strong class="text-amber-300">${scoreDiag > 0 ? scoreDiag + ' Pts' : '—'}</strong></span>
                            <span>• Corte: <strong class="text-cyan-300">${corte > 0 ? corte + ' Pts' : '—'}</strong></span>
                            <span>• Brecha: <strong class="text-purple-300">${brecha == null ? '—' : '+' + brecha + ' Pts'}</strong></span>
                            <span>• Holland: <strong class="text-emerald-300">${localStorage.getItem('dante_holland_code') || '—'}</strong></span>
                        </div>
                    </div>
                </div>
                <a href="ruta_vocacional.html" class="shrink-0 py-2.5 px-4 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-400/60 text-purple-200 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-105 active:scale-95">
                    <svg class="w-4 h-4 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    <span>ENTRENAR EN MI RUTA VOCACIONAL</span>
                    <svg class="w-3.5 h-3.5 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            `;
            return;
        }

        banner.className = 'w-full mb-5 p-3.5 bg-gradient-to-r from-amber-950/90 via-slate-900 to-purple-950/90 border-2 border-amber-500/80 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.35)] font-mono text-left flex flex-col md:flex-row items-center justify-between gap-3 transition-all animate-pulse-slow';

        if (!this.isDiagnosticCompleted()) {
            banner.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 shadow-md">
                        <svg class="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div>
                        <div class="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                            <span>PASO 1 DE 2: PRUEBA DIAGNÓSTICA DE 5 ÁREAS</span>
                            <span class="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">OBLIGATORIO</span>
                        </div>
                        <p class="text-[11px] text-slate-300 font-sans mt-0.5 leading-relaxed">
                            La sala se encuentra en <strong>Modo Calibración</strong>. Presenta el cuadernillo facsímil de 5 minutos para conocer tu puntaje estimado baseline.
                        </p>
                    </div>
                </div>
                <button type="button" onclick="if(window.AppController && window.AppController.iniciarSimulacroDiagnostico){ AppController.iniciarSimulacroDiagnostico(true); } else if(window.DiagnosticoExpresEngine){ DiagnosticoExpresEngine.abrir(); }" class="shrink-0 py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-amber-200">
                    <svg class="w-4 h-4 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                    <span>PRESENTAR PRUEBA DIAGNÓSTICA DE CALIBRACIÓN</span>
                    <svg class="w-3.5 h-3.5 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
            `;
        } else if (!this.isVocacionalCompleted()) {
            banner.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shrink-0 shadow-md">
                        <svg class="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div>
                        <div class="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                            <span>PASO 2 DE 2: RUTA VOCACIONAL</span>
                            <span class="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 text-[10px] font-bold">PENDIENTE</span>
                        </div>
                        <p class="text-[11px] text-slate-300 font-sans mt-0.5 leading-relaxed">
                            El diagnóstico ya midió el examen. Esta ruta mira cómo actúas y te muestra carreras que se parecen a ese perfil.
                        </p>
                    </div>
                </div>
                <button type="button" onclick="if(window.DanteHubEngine){DanteHubEngine.abrirPuertaRuta();}" class="shrink-0 py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-400 text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-purple-200">
                    <svg class="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    <span>INICIAR TEST VOCACIONAL (3 MIN)</span>
                    <svg class="w-3.5 h-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
            `;
        }
    }

    static removerBannerBloqueo() {
        const banner = document.getElementById('bannerDiagnosticRequirement');
        if (banner) banner.remove();
    }

    static mostrarAvisoBloqueo(actionName) {
        if (window.AppController && window.AppController.mostrarNotificacion) {
            window.AppController.mostrarNotificacion(`🔒 Requisito: ${actionName}`, 'warning');
        }
    }

    static mostrarToastDesbloqueo() {
        if (window.AppController && window.AppController.mostrarNotificacion) {
            window.AppController.mostrarNotificacion(`🔓 ¡MANIPULACIÓN TOTAL DESBLOQUEADA! Baseline y Meta Vocacional configurados.`, 'success');
        }
    }
}

// ============================================================================
// 5. BLOQUEO PEDAGÓGICO DE RESISTENCIA PARA SIMULACRO COMPLETO (7 DÍAS RACHA)
// ============================================================================
class SimulacroStreakLockEngine {
    static abrirModal(streakActual = 1) {
        let modal = document.getElementById('modalSimulacroStreakLock');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalSimulacroStreakLock';
            modal.className = 'fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-mono';
            document.body.appendChild(modal);
        }

        const streakReq = 7;
        const faltan = Math.max(0, streakReq - streakActual);
        const pct = Math.min(100, Math.round((streakActual / streakReq) * 100));

        modal.innerHTML = `
        <div class="max-w-lg w-full bg-slate-950 border-2 border-amber-500/80 rounded-2xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.35)] space-y-4 relative text-left">
            <button type="button" onclick="SimulacroStreakLockEngine.cerrarModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold cursor-pointer">&times;</button>

            <!-- CABECERA DE BLOQUEO PEDAGÓGICO -->
            <div class="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div class="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                    <svg class="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                    <span class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                        CONDICIÓN PEDAGÓGICA DE RESISTENCIA
                    </span>
                    <h3 class="text-sm font-mono font-black text-white uppercase mt-0.5">
                        SIMULACRO COMPLETO DE 4.5 HORAS
                    </h3>
                </div>
            </div>

            <!-- EXPLICACIÓN PEDAGÓGICA -->
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-sans text-slate-300 leading-relaxed">
                <p class="flex items-center gap-1.5 font-bold text-white">
                    <svg class="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/></svg>
                    <span>¿Por qué se requiere entrenamiento previo de racha?</span>
                </p>
                <p class="text-slate-400">
                    Someterse a una prueba oficial completa de 250+ preguntas (4.5 Horas) sin acondicionar tu atención genera <em>fatiga mental severa</em> y distorsiona la medición de tu puntaje psicométrico real. El Simulacro Completo se habilita automáticamente tras acumular una <strong>Racha de 7 Días Consecutivos</strong> de entrenamiento diario.
                </p>
            </div>

            <!-- BARRA DE PROGRESO DE RACHA -->
            <div class="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
                <div class="flex justify-between items-center text-xs font-mono font-bold">
                    <span class="text-amber-300 flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg> Racha Actual: ${streakActual} / 7 Días Consecutivos
                    </span>
                    <span class="text-slate-400">${pct}% Completo</span>
                </div>

                <div class="w-full h-3 bg-slate-950 rounded-full border border-amber-500/30 overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full transition-all duration-500" style="width: ${pct}%;"></div>
                </div>

                <p class="text-[11px] font-mono text-slate-400 text-center pt-0.5">
                    ${faltan > 0 
                        ? `Te faltan <strong class="text-amber-300">${faltan} ${faltan === 1 ? 'día' : 'días'}</strong> de entrenamiento diario para desbloquear el examen oficial.` 
                        : '🎉 ¡Meta de racha alcanzada! Tu simulacro completo está listo.'}
                </p>
            </div>

            <!-- BENEFICIOS DEL HÁBITO -->
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-sans text-slate-300 space-y-1">
                <div class="flex items-center gap-2 text-emerald-400 font-bold">
                    <i class="fa-solid fa-check-circle"></i>
                    <span>Acondiciona tu capacidad atencional prefrontal para 4.5 horas de enfoque sostenido.</span>
                </div>
                <div class="flex items-center gap-2 text-cyan-300 font-bold">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Garantiza la máxima precisión y validez en la medición de tu puntaje ICFES estimado.</span>
                </div>
            </div>

            <!-- BOTONES DE ACCIÓN -->
            <div class="space-y-2 pt-1 font-mono text-xs">
                <button type="button" onclick="SimulacroStreakLockEngine.irADosisDiaria()" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 animate-breathe">
                    <svg class="w-4 h-4 text-amber-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <span>CONTINUAR MI ENTRENAMIENTO DIARIO (DÍA ${streakActual} DE 7)</span>
                </button>
            </div>
        </div>
        `;

        modal.style.display = 'flex';
    }

    static cerrarModal() {
        const modal = document.getElementById('modalSimulacroStreakLock');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static irADosisDiaria() {
        this.cerrarModal();
        if (window.AppController && window.AppController.autoselectSiguienteMateria) {
            window.AppController.autoselectSiguienteMateria();
        } else if (window.AppController && window.AppController.regresarASala) {
            window.AppController.regresarASala();
        }
    }

    static abrirProPaywall() {
        this.cerrarModal();
        if (window.PaywallManager) {
            window.PaywallManager.abrirModalContextual(
                'SIMULACRO_LOCK',
                'El simulacro largo está disponible para todos. El plan de pago solo quita anuncios entre bloques.'
            );
        } else if (window.location.pathname.includes('paywall.html')) {
            // Already on paywall
        } else {
            window.location.href = 'paywall.html';
        }
    }
}

// ============================================================================
// 6. ENGINE DE ORIENTACIÓN DEL TUTOR IA PARA PLAN PRO (ACCESO ILIMITADO)
// ============================================================================
class SimulacroTutorGuidanceEngine {
    static onStartAnywayFn = null;

    static abrirModal(onStartAnywayFn) {
        this.onStartAnywayFn = onStartAnywayFn;

        let modal = document.getElementById('modalSimulacroTutorGuidance');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalSimulacroTutorGuidance';
            modal.className = 'fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-mono';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="max-w-lg w-full bg-slate-950 border-2 border-cyan-500/80 rounded-2xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.35)] space-y-4 relative text-left">
            <button type="button" onclick="SimulacroTutorGuidanceEngine.cerrarModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold cursor-pointer">&times;</button>

            <!-- CABECERA DE TUTORÍA ADAPTATIVA -->
            <div class="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div class="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-2xl font-black shrink-0 shadow-md">
                    🎯
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                            ORIENTACIÓN TUTOR IA
                        </span>
                        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                            PARA TODOS
                        </span>
                    </div>
                    <h3 class="text-sm font-mono font-black text-white uppercase mt-0.5">
                        PLANIFICACIÓN DE SIMULACRO DE CONTROL
                    </h3>
                </div>
            </div>

            <!-- EXPLICACIÓN Y DIAGNÓSTICO -->
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-sans text-slate-300 leading-relaxed">
                <p>
                    <strong>Estado de tu preparación:</strong>
                </p>
                <p class="text-slate-300">
                    Ya completaste tu <strong>Simulacro Diagnóstico Inicial</strong>. Puedes repetir el simulacro cuando quieras; el plan de pago solo quita anuncios.
                </p>
                <p class="text-cyan-300 font-bold border-l-2 border-cyan-400 pl-2.5 my-1">
                    Recomendación: completa tus módulos en áreas críticas antes de volver a las 4.5 horas de examen.
                </p>
            </div>

            <!-- OPCIONES DUALES -->
            <div class="space-y-2 pt-1 font-mono text-xs">
                <button type="button" onclick="SimulacroTutorGuidanceEngine.ejecutarSimulacro()" class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95">
                    <span>Iniciar simulacro ahora</span>
                </button>

                <button type="button" onclick="SimulacroTutorGuidanceEngine.irARutaModulo()" class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95">
                    <i class="fa-solid fa-route text-amber-400"></i>
                    <span>📚 SEGUIR RUTA RECOMENDADA POR EL TUTOR IA</span>
                </button>
            </div>
        </div>
        `;

        modal.style.display = 'flex';
    }

    static cerrarModal() {
        const modal = document.getElementById('modalSimulacroTutorGuidance');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static ejecutarSimulacro() {
        this.cerrarModal();
        if (typeof this.onStartAnywayFn === 'function') {
            this.onStartAnywayFn();
        }
    }

    static irARutaModulo() {
        this.cerrarModal();
        if (window.AppController && window.AppController.autoselectSiguienteMateria) {
            window.AppController.autoselectSiguienteMateria();
        } else if (window.AppController && window.AppController.regresarASala) {
            window.AppController.regresarASala();
        }
    }
}

window.togglePlanModoSimulador = function() {
    const actualPlan = (localStorage.getItem('dante_plan') || localStorage.getItem('dante_user_plan') || 'EXPLORADOR').toUpperCase();
    const isCurrentlyPro = actualPlan === 'PRO' || actualPlan === 'SUPER_PRO';
    const nuevoPlan = isCurrentlyPro ? 'EXPLORADOR' : 'PRO';
    
    localStorage.setItem('dante_plan', nuevoPlan);
    localStorage.setItem('dante_user_plan', nuevoPlan);
    
    if (typeof CapacidadDiariaManager !== 'undefined') CapacidadDiariaManager.initLimites();
    if (typeof DanteTutorEngine !== 'undefined') DanteTutorEngine.render();
    if (typeof PactoDanteManager !== 'undefined') PactoDanteManager.actualizarHUDHeader();
    
    if (typeof mostrarNotificacionPWA === 'function') {
        mostrarNotificacionPWA(`🔄 Vista activada: ${nuevoPlan === 'PRO' ? 'Plan PRO 👑' : 'Plan Estándar Gratuito 🆓'}`, "info");
    } else {
        alert(`🔄 Vista cambiada a: ${nuevoPlan === 'PRO' ? 'Plan PRO 👑' : 'Plan Estándar Gratuito 🆓'}`);
    }
};

// Global Exports
window.CooldownTimerEngine = CooldownTimerEngine;
window.ShareCardEngine = ShareCardEngine;
window.CrossSellUNALEngine = CrossSellUNALEngine;
window.DiagnosticoExpresEngine = DiagnosticoExpresEngine;
window.OrientacionVocacionalWizardEngine = OrientacionVocacionalWizardEngine;
window.DanteDiagnosticGateManager = DanteDiagnosticGateManager;
window.SimulacroStreakLockEngine = SimulacroStreakLockEngine;
window.SimulacroTutorGuidanceEngine = SimulacroTutorGuidanceEngine;
window.CheckInEstadoEngine = CheckInEstadoEngine;

// Inicialización automática al cargar el script
document.addEventListener('DOMContentLoaded', () => {
    DanteTutorEngine.init();
    CooldownTimerEngine.init();
    DanteDiagnosticGateManager.renderizarBannerBloqueoSiAplica();
    CheckInEstadoEngine.actualizarUIHUD();

    if (window.location.hash === '#simulador-expres') {
        DiagnosticoExpresEngine.abrir();
    }
});
