// public/js/rutaSimulacroEngine.js - Motor de Ruta de Aprendizaje Progresiva & Simulacros Contrarreloj (Dante OS v22.0.0)
// Bogotá, Colombia

class RutaAprendizajeEngine {
    /**
     * Obtiene el dominio promedio ponderado de las 5 materias
     * @returns {{ totalAvgPct: number, materiasStatus: Object, totalPuntosScore: number }}
     */
    static obtenerProgresoGeneral() {
        const materias = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'];
        const est = (typeof AppState !== 'undefined' && AppState.estudiante) ? AppState.estudiante : (localStorage.getItem('dante_active_student') || 'ESTUDIANTE');
        
        // 🎯 FUENTE ÚNICA DE VERDAD (SSOT)
        const ssotScore = parseInt(localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_puntaje_global') || '0', 10);
        let precPorArea = {};
        try {
            const rawP = localStorage.getItem('dante_precision_por_area');
            if (rawP) precPorArea = JSON.parse(rawP) || {};
        } catch(e) {}

        const defaultMateriaPct = ssotScore > 0 ? Math.round((ssotScore / 500) * 100) : 50;

        let sumPct = 0;
        let materiasStatus = {};

        materias.forEach(key => {
            const isCompleted = localStorage.getItem(`dante_completado_${key}_${est}`) === "true";
            const savedPct = localStorage.getItem(`dante_pct_${key}_${est}`);
            const savedTheta = localStorage.getItem(`dante_theta_${key}_${est}`);
            const savedScore = localStorage.getItem(`dante_score_${key}_${est}`);

            let pct = precPorArea[key] !== undefined ? Number(precPorArea[key]) : defaultMateriaPct;
            if (isCompleted) {
                pct = 100;
            } else if (savedPct !== null) {
                pct = parseInt(savedPct, 10);
            } else if (savedTheta !== null) {
                pct = typeof AppController !== 'undefined' && AppController.calcularPorcentajeTheta 
                    ? AppController.calcularPorcentajeTheta(savedTheta) 
                    : Math.round(50 + parseFloat(savedTheta) * 15);
            } else if (savedScore) {
                pct = Math.min(95, Math.max(15, parseInt(savedScore, 10)));
            }

            pct = Math.max(0, Math.min(100, Math.round(pct)));
            sumPct += pct;
            materiasStatus[key] = { pct, isCompleted };
        });

        const totalAvgPct = ssotScore > 0 ? Math.round((ssotScore / 500) * 100) : Math.round(sumPct / materias.length);
        const totalPuntosScore = ssotScore > 0 ? ssotScore : (window.danteGlobalScoreCalculated || Math.min(500, Math.max(200, sumPct)));

        return { totalAvgPct, materiasStatus, totalPuntosScore };
    }

    /**
     * Renderiza el componente de Ruta de Aprendizaje en un contenedor objetivo
     * @param {string} targetContainerId 
     * @param {string} mode 'dashboard' | 'perfil'
     */
    static renderizarRutaUI(targetContainerId = 'uiContenedorRutaAprendizaje', mode = 'dashboard') {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        const { totalAvgPct, totalPuntosScore } = this.obtenerProgresoGeneral();
        const attemptsLeft = SimulacroEngine.getRemainingAttempts();

        // Determinar Rango Global
        let rangoNombre = "🟢 RANGO 1: RECLUTA";
        let rangoSubt = "Base conceptual en construcción";
        let badgeColor = "text-emerald-400 border-emerald-500/40 bg-emerald-950/60";

        if (totalAvgPct >= 75) {
            rangoNombre = "👑 RANGO 4: MAESTRO UNAL";
            rangoSubt = "Nivel de Máxima Exigencia Universitaria";
            badgeColor = "text-amber-300 border-amber-400/60 bg-amber-950/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
        } else if (totalAvgPct >= 50) {
            rangoNombre = "🟠 RANGO 3: ÉLITE SABER 11";
            rangoSubt = "Competitivo para 380+ Puntos";
            badgeColor = "text-orange-400 border-orange-500/50 bg-orange-950/70";
        } else if (totalAvgPct >= 25) {
            rangoNombre = "🟡 RANGO 2: ESTRATEGA";
            rangoSubt = "Avanzando en trampas e inferencias";
            badgeColor = "text-cyan-300 border-cyan-400/50 bg-cyan-950/70";
        }

        // Definición de Hitos / Milestones
        const hitos = [
            {
                id: 'hito_1',
                nivel: 1,
                minPct: 0,
                titulo: 'Paso 1: Examen Diagnóstico & Calibración Inicial',
                desc: 'Diagnóstico adaptativo IRT para medir tu nivel base en las 5 materias oficiales.',
                icono: `<svg class="w-5 h-5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
                tipo: 'ENTRENAMIENTO',
                actionText: 'Iniciar Diagnóstico',
                actionFn: 'AppController.iniciarSimulacroDiagnostico()'
            },
            {
                id: 'hito_2',
                nivel: 2,
                minPct: 25,
                titulo: 'Paso 2: Entrenamiento Adaptativo por Materias',
                desc: 'Práctica guiada en tus áreas de mayor debilidad (Matemáticas, Lectura, Ciencias, etc.).',
                icono: `<svg class="w-5 h-5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
                tipo: 'ENTRENAMIENTO',
                actionText: 'Practicar Materias',
                actionFn: 'AppController.autoselectSiguienteMateria()'
            },
            {
                id: 'hito_3',
                nivel: 3,
                minPct: 50,
                titulo: 'Paso 3: Simulacros de Control & Manejo del Tiempo',
                desc: '50 y 100 preguntas contrarreloj con distractores para controlar velocidad y ansiedad.',
                icono: `<svg class="w-5 h-5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
                tipo: 'SIMULACRO_MEDIO_1',
                preguntas: 50,
                minutos: 35,
                actionText: 'Iniciar Control (50 Q)',
                actionFn: 'SimulacroEngine.prepararYConfirmar(50, 35, "Simulacro de Control de Tiempo")'
            },
            {
                id: 'hito_4',
                nivel: 4,
                minPct: 75,
                titulo: 'Paso 4: Simulacro Oficial Completo Examen Real (Saber 11)',
                desc: '200 Preguntas Contrarreloj (120 min) con estimación oficial de puntaje, diagnóstico y calibración.',
                icono: `<svg class="w-5 h-5 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
                tipo: 'SIMULACRO_FULL',
                preguntas: 200,
                minutos: 120,
                actionText: 'INICIAR EXAMEN REAL (200 Q)',
                actionFn: 'SimulacroEngine.prepararYConfirmar(200, 120, "Simulacro Oficial Examen Real")'
            }
        ];

        // Datos de Pacto y Diagnóstico
        const nombreEst = localStorage.getItem('dante_student_name') || (typeof AppState !== 'undefined' && AppState.estudiante ? AppState.estudiante : 'Estudiante');
        const pactoMeta = localStorage.getItem('dante_pacto_meta') || '380_ELITE';
        const pactoTiempo = localStorage.getItem('dante_pacto_tiempo') || '15_FREE';

        let targetScore = 380;
        let pactoMetaNombre = "380+ Pts Saber 11° Élite";
        if (pactoMeta === 'PREUNIVESITARIO') {
            targetScore = 420;
            pactoMetaNombre = "Admisión UNAL / UdeA";
        } else if (pactoMeta === '300_BASE') {
            targetScore = 320;
            pactoMetaNombre = "Superar 300 Pts ICFES";
        }

        const scoreGap = Math.max(0, targetScore - totalPuntosScore);
        const dosisTiempoTxt = pactoTiempo === '45_PRO' ? "45 min/día (Súper Pro)" : "15 min/día (Dosis Gratuita)";

        const isStep1Done = (window.DanteDiagnosticGateManager && window.DanteDiagnosticGateManager.isDiagnosticCompleted()) || 
                            localStorage.getItem('dante_diagnostic_completed') === 'true' || 
                            parseInt(localStorage.getItem('dante_score_diagnostico') || '0', 10) > 0 || 
                            localStorage.getItem('dante_calibracion_tactica_inicial_done') === 'true';

        let html = `
        <div class="mb-5 font-mono text-left space-y-3">
            <!-- 📜 TARJETA DE DIAGNÓSTICO & PRESCRIPCIÓN DEL PROFESOR DANTE -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-2 border-cyan-500/40 shadow-xl relative overflow-hidden">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm">
                            <i class="fa-solid fa-brain text-cyan-400 text-lg"></i>
                        </div>
                        <div>
                            <span class="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider block">
                                DIAGNÓSTICO EN VIVO & PRESCRIPCIÓN DANTE OS
                            </span>
                            <h3 class="text-sm font-black text-white font-sans mt-0.5">
                                Aspirante: ${nombreEst} | Meta: <span class="text-amber-400">${pactoMetaNombre}</span>
                            </h3>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase self-start sm:self-center flex items-center gap-1">
                        <svg class="w-3 h-3 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Dosis Prescrita: ${dosisTiempoTxt}
                    </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3 text-xs">
                    <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span class="text-[10px] text-slate-400 block font-bold">PUNTAJE ESTIMADO:</span>
                        <span class="text-base font-black text-amber-400">${totalPuntosScore} / 500 Pts</span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span class="text-[10px] text-slate-400 block font-bold">BRECHA A TU META (${targetScore} PTS):</span>
                        <span class="text-base font-black ${scoreGap > 0 ? 'text-rose-400' : 'text-emerald-400'} flex items-center gap-1">
                            ${scoreGap > 0 ? `Faltan ${scoreGap} Pts` : '<svg class="w-4 h-4 text-emerald-400 shrink-0 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Meta Alcanzada'}
                        </span>
                    </div>

                    <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span class="text-[10px] text-slate-400 block font-bold">RANGO TÁCTICO:</span>
                        <span class="text-xs font-bold text-cyan-300 mt-0.5 block">${rangoNombre}</span>
                    </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-sans space-y-1">
                    <p class="text-slate-200 leading-relaxed italic">
                        "Profesor Dante: ${nombreEst}, ${scoreGap > 0 ? `tienes una brecha de ${scoreGap} puntos respecto a tu meta de ${pactoMetaNombre}. Mantén tu disciplina diaria, cumple tu dosis prescrita y elimina el hábito de adivinar.` : 'has consolidado el rango deseado. Continúa con los simulacros de velocidad para cero margen de error.'}"
                    </p>
                </div>
            </div>

            <!-- 1. FRANJA DE INFORMACIÓN UNIFICADA DE MATERIAS -->
            <div class="hitos-header-bar flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md rounded-2xl text-xs text-slate-300 shadow-lg mb-4">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-[11px] uppercase flex items-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-map-location-dot text-cyan-400"></i> MAPA DE RUTA DE MATERIAS
                    </span>
                    <span class="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono font-bold text-[11px] uppercase flex items-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-crosshairs text-amber-400"></i> ${rangoNombre}
                    </span>
                </div>
                <div class="flex items-center gap-3 flex-wrap text-xs font-mono">
                    <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                        <i class="fa-solid fa-chart-line text-cyan-400"></i>
                        <span class="text-slate-400">Progreso:</span>
                        <strong class="text-cyan-300 font-bold">${totalAvgPct}% (${totalPuntosScore}/500 Pts)</strong>
                    </div>
                    <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                        <i class="fa-solid fa-clipboard-check text-amber-400"></i>
                        <span class="text-slate-400">Simulacros:</span>
                        <strong class="text-amber-300 font-bold">${attemptsLeft}/2 Disponibles</strong>
                    </div>
                </div>
            </div>

            <!-- 2. BARRA DE EVOLUCIÓN COGNITIVA Y RECUENTO REGRESIVO (Progreso Fluido Adaptativo) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/50 shadow-2xl space-y-4 relative overflow-hidden">
                <!-- Encabezado de Progreso y Tiempo -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shrink-0 flex items-center justify-center shadow-sm">
                            <i class="fa-solid fa-chart-line text-cyan-400 text-lg"></i>
                        </div>
                        <div>
                            <span class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">LÍNEA DE EVOLUCIÓN & MATURIDAD COGNITIVA</span>
                            <h4 class="text-sm font-extrabold text-white font-sans mt-0.5 flex items-center gap-2">
                                Nivel de Preparación Actual: <span class="text-emerald-400 font-mono font-black">${totalAvgPct}% Dominado</span>
                            </h4>
                        </div>
                    </div>
                    <!-- Contador inteligente de días para el examen -->
                    <div class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 self-start sm:self-center shadow-md">
                        <svg class="w-4 h-4 text-amber-400 animate-pulse shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>Examen Oficial: <strong class="text-white">${window.AppController && window.AppController.diasRestantesExamen ? window.AppController.diasRestantesExamen : '160'} Días Restantes</strong></span>
                    </div>
                </div>

                <!-- Barra Dinámica de Progreso Fluido -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-mono text-slate-300">
                        <span class="flex items-center gap-1.5 text-slate-200">
                            <span class="w-2.5 h-2.5 rounded-full ${totalAvgPct >= 75 ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : totalAvgPct >= 40 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}"></span>
                            Fase: <strong class="text-cyan-300">${totalAvgPct >= 75 ? '4. Ensayos Oficiales & Velocidad' : totalAvgPct >= 40 ? '3. Dominio de Tiempo & Simulaciones' : totalAvgPct >= 20 ? '2. Entrenamiento Adaptativo por Materias' : '1. Diagnóstico & Calibración Inicial'}</strong>
                        </span>
                        <span class="text-amber-300 font-bold">${totalPuntosScore} / 500 Pts Estimados</span>
                    </div>
                    <!-- Contenedor Visual de la Barra -->
                    <div class="w-full h-4 rounded-full bg-slate-950 p-0.5 border border-slate-800 shadow-inner overflow-hidden relative">
                        <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-700 relative" style="width: ${Math.max(8, totalAvgPct)}%;">
                            <div class="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        container.innerHTML = html;
    }
}

class SimulacroEngine {
    static MAX_ATTEMPTS = 2;
    static currentExamState = null;
    static timerInterval = null;

    /**
     * Obtiene el número de intentos restantes
     */
    static getRemainingAttempts() {
        const est = (typeof AppState !== 'undefined' && AppState.estudiante) ? AppState.estudiante : (localStorage.getItem('dante_active_student') || 'ESTUDIANTE');
        const attemptsUsed = parseInt(localStorage.getItem(`dante_simulacro_attempts_${est}`) || '0', 10);
        return Math.max(0, SimulacroEngine.MAX_ATTEMPTS - attemptsUsed);
    }

    /**
     * Incrementa el contador de intentos
     */
    static registerAttempt() {
        const est = (typeof AppState !== 'undefined' && AppState.estudiante) ? AppState.estudiante : (localStorage.getItem('dante_active_student') || 'ESTUDIANTE');
        const attemptsUsed = parseInt(localStorage.getItem(`dante_simulacro_attempts_${est}`) || '0', 10);
        localStorage.setItem(`dante_simulacro_attempts_${est}`, (attemptsUsed + 1).toString());
    }

    /**
     * Prepara y muestra el modal de confirmación antes de iniciar
     */
    static prepararYConfirmar(numPreguntas, minutos, tituloExamen, forzarDirecto = false) {
        // Misma regla para todos: simulacro abierto; el pago solo quita anuncios.
        const currentStreak = window.StreakManager ? window.StreakManager.evaluarRachaHoy() : parseInt(localStorage.getItem('dante_streak_count') || '1', 10);

        // Orientación (no bloquea): si la racha es corta, el tutor puede recomendar esperar.
        const proInitialDone = localStorage.getItem('dante_pro_initial_simulacro_done') === 'true';
        if (numPreguntas >= 100 && proInitialDone && !forzarDirecto && currentStreak < 7) {
            if (window.SimulacroTutorGuidanceEngine) {
                window.SimulacroTutorGuidanceEngine.abrirModal(() => {
                    this.prepararYConfirmar(numPreguntas, minutos, tituloExamen, true);
                });
                return;
            }
        }

        localStorage.setItem('dante_pro_initial_simulacro_done', 'true');
        localStorage.setItem('dante_simulacro_completo_usado', 'true');

        // Crear Modal dinámico de briefing si no existe
        let modal = document.getElementById('modalBriefingSimulacro');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalBriefingSimulacro';
            modal.className = 'fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-mono';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="max-w-lg w-full bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.3)] space-y-5 relative text-left">
            <button type="button" onclick="document.getElementById('modalBriefingSimulacro').style.display='none'" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg cursor-pointer">&times;</button>
            
            <div class="flex items-center gap-3 border-b border-amber-500/30 pb-3">
                <span class="text-3xl">⏱️</span>
                <div>
                    <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9.5px] font-bold uppercase">
                        PROTOCOLO DE EXAMEN DANTE OS
                    </span>
                    <h3 class="text-base font-black text-white mt-0.5 font-sans" id="lblBriefingTitulo">${tituloExamen}</h3>
                </div>
            </div>

            <div class="space-y-3 text-xs text-slate-300 font-sans">
                <p class="leading-relaxed">
                    Estás a punto de iniciar un examen contrarreloj calibrado bajo los estándares psicométricos de ICFES Saber 11º y Universidad Nacional.
                </p>

                <div class="grid grid-cols-2 gap-2 font-mono text-[11px] p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div class="p-2 rounded bg-slate-900 border border-slate-800">
                        <span class="text-slate-400 block text-[9.5px] font-bold">NÚMERO DE REACTIVOS:</span>
                        <strong class="text-white text-sm">${numPreguntas} Preguntas</strong>
                    </div>
                    <div class="p-2 rounded bg-slate-900 border border-slate-800">
                        <span class="text-slate-400 block text-[9.5px] font-bold">TIEMPO LÍMITE:</span>
                        <strong class="text-amber-400 text-sm">${minutos} Minutos</strong>
                    </div>
                </div>

                <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1 text-[11px] font-mono">
                    <div class="flex justify-between items-center text-amber-300 font-bold">
                        <span>⚠️ INTENTOS DISPONIBLES:</span>
                        <span>${remaining} de ${this.MAX_ATTEMPTS} Máximo</span>
                    </div>
                    <p class="text-[10.5px] text-slate-300 font-sans">
                        Este intento se descontará inmediatamente al iniciar. El cronómetro no se detiene si cierras la pestaña.
                    </p>
                </div>
            </div>

            <div class="flex gap-2 pt-2">
                <button type="button" onclick="SimulacroEngine.iniciarExamenSimulacro(${numPreguntas}, ${minutos}, '${tituloExamen}')" class="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer">
                    ⚡ INICIAR SIMULACRO AHORA
                </button>
                <button type="button" onclick="document.getElementById('modalBriefingSimulacro').style.display='none'" class="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold text-xs cursor-pointer">
                    Cancelar
                </button>
            </div>
        </div>
        `;

        modal.style.display = 'flex';
    }

    /**
     * Inicia la ejecución del simulacro contrarreloj
     */
    static iniciarExamenSimulacro(numPreguntas, minutos, titulo) {
        const modalBrief = document.getElementById('modalBriefingSimulacro');
        if (modalBrief) modalBrief.style.display = 'none';

        // Registrar intento gastado
        this.registerAttempt();

        // Inicializar estado del examen
        this.currentExamState = {
            numPreguntas: numPreguntas,
            minutosTotales: minutos,
            segundosRestantes: minutos * 60,
            preguntaActualIdx: 0,
            respuestasUsuario: new Array(numPreguntas).fill(null),
            titulo: titulo,
            bancoPreguntas: this.generarBancoSimulacro(numPreguntas)
        };

        this.renderizarEntornoSimulacroModal();
        this.iniciarCronometroContrarreloj();
    }

    static _simulacroDesdeBanco(numPreguntas) {
        const fuente = window.DANTE_BANCO_ITEMS;
        if (!Array.isArray(fuente) || !fuente.length || !window.DanteAbility || typeof window.DanteAbility.adaptarItem !== 'function') {
            return [];
        }
        const copia = fuente.slice();
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = copia[i];
            copia[i] = copia[j];
            copia[j] = tmp;
        }
        const letras = ['A', 'B', 'C', 'D'];
        const theta = parseFloat(localStorage.getItem('dante_theta_estimado') || '0') || 0;
        const nombres = {
            matematicas: 'Matemáticas',
            lectura_critica: 'Lectura crítica',
            ciencias_naturales: 'Ciencias naturales',
            sociales_ciudadanas: 'Sociales y ciudadanas',
            ingles: 'Inglés'
        };
        const porArea = {};
        copia.forEach((raw) => {
            const item = window.DanteAbility.adaptarItem(raw);
            if (!item || !item.enunciado || !item.area) return;
            if (!porArea[item.area]) porArea[item.area] = [];
            porArea[item.area].push(item);
        });
        Object.keys(porArea).forEach((area) => {
            porArea[area].sort((a, b) => Math.abs(a.b - theta) - Math.abs(b.b - theta));
        });
        const areas = Object.keys(porArea);
        const elegidos = [];
        let vuelta = 0;
        while (elegidos.length < numPreguntas && areas.length) {
            let avanzo = false;
            areas.forEach((area) => {
                const item = porArea[area][vuelta];
                if (item && elegidos.length < numPreguntas) {
                    elegidos.push(item);
                    avanzo = true;
                }
            });
            if (!avanzo) break;
            vuelta += 1;
        }
        return elegidos.map((item, idx) => {
            const opciones = (item.opciones || []).map((op) => String(op).replace(/^[A-D]\)\s*/, ''));
            const letra = String(item.correcta || 'A').charAt(0);
            return {
                id: item.id,
                num: idx + 1,
                materia: nombres[item.materia] || item.materia,
                pregunta: item.enunciado,
                recursoVisual: item.recurso_visual || '',
                opciones: opciones,
                correctaIdx: Math.max(0, letras.indexOf(letra)),
                a: item.a,
                b: item.b,
                c: item.c
            };
        });
    }

    /**
     * Genera un banco de preguntas dinámico de alta calidad para el simulacro
     */
    static generarBancoSimulacro(numPreguntas) {
        const desdeBanco = this._simulacroDesdeBanco(numPreguntas);
        if (desdeBanco.length) return desdeBanco;

        const materias = ['Matematica', 'Lectura Critica', 'Ciencias Naturales', 'Sociales y Ciudadanas', 'Ingles'];
        const plantillas = [
            {
                m: 'Matematica',
                q: 'En una prueba psicométrica, la distribución de tiempos sigue una función gaussiana con media de 45 segundos. Si un estudiante responde en 15 segundos con certeza alta, ¿cuál es el diagnóstico de impulso?',
                opts: ['Sobreconfianza con posible distractor atractor', 'Precisión óptima de dominio experto', 'Omisión involuntaria del enunciado', 'Rendimiento promedio estándar'],
                ans: 0
            },
            {
                m: 'Lectura Critica',
                q: 'Lea el enunciado: «La ironía socrática no pretende humillar, sino desarticular la falsa certeza para dar paso al verdadero conocimiento». ¿Qué función cumple la estructura gramatical adversativa "sino"?',
                opts: ['Contraste de propósito entre humillación e iluminación conceptual', 'Adición de un argumento secundario irrelevante', 'Demostrar una contradicción insuperable en la filosofía', 'Sugerir que la certeza es superior a la verdad'],
                ans: 0
            },
            {
                m: 'Ciencias Naturales',
                q: 'Un sistema termodinámico cerrado experimenta una expansión adiabática casi-estática. ¿Qué ocurre con la energía interna y la temperatura del gas?',
                opts: ['La energía interna disminuye y la temperatura desciende', 'La energía interna aumenta y la temperatura se eleva', 'La temperatura permanece constante por ser proceso adiabático', 'El trabajo realizado es nulo'],
                ans: 0
            },
            {
                m: 'Sociales y Ciudadanas',
                q: 'Frente a un conflicto entre la libertad de expresión y el derecho al buen nombre en redes sociales, ¿qué principio constitucional aplica la Corte para resolver la tensión?',
                opts: ['Ponderación de derechos y juicio de proporcionalidad', 'Prevalencia absoluta e incondicional de la libertad de prensa', 'Eliminación preventiva de todo contenido digital', 'Derogación de la norma reglamentaria'],
                ans: 0
            },
            {
                m: 'Ingles',
                q: 'Choose the sentence that correctly uses the third conditional to express regret:',
                opts: ['If I had studied harder, I would have passed the exam.', 'If I study harder, I will pass the exam.', 'If I studied harder, I would pass the exam.', 'If I have studied harder, I passed the exam.'],
                ans: 0
            }
        ];

        let banco = [];
        for (let i = 0; i < numPreguntas; i++) {
            const plantilla = plantillas[i % plantillas.length];
            const shift = i % 4;
            const opts = plantilla.opts.slice(shift).concat(plantilla.opts.slice(0, shift));
            banco.push({
                id: `sim_q_${i + 1}`,
                num: i + 1,
                materia: plantilla.m,
                pregunta: `[Pregunta ${i + 1} / ${numPreguntas} - ${plantilla.m}] ${plantilla.q}`,
                opciones: opts,
                correctaIdx: (plantilla.ans - shift + 4) % 4,
                a: 1,
                b: [-0.8, -0.3, 0.2, 0.7, 1.1][i % 5],
                c: 0.2
            });
        }
        return banco;
    }

    /**
     * Renderiza el visor/workspace dinámico del simulacro
     */
    static renderizarEntornoSimulacroModal() {
        let modal = document.getElementById('modalWorkspaceSimulacro');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalWorkspaceSimulacro';
            modal.className = 'fixed inset-0 z-[99999] bg-slate-950 flex flex-col font-mono text-white overflow-hidden';
            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
        this.renderizarPreguntaActualDOM();
    }

    /**
     * Muestra la pregunta actual y actualiza la hoja óptica
     */
    static renderizarPreguntaActualDOM() {
        const modal = document.getElementById('modalWorkspaceSimulacro');
        if (!modal || !this.currentExamState) return;

        const st = this.currentExamState;
        const q = st.bancoPreguntas[st.preguntaActualIdx];
        const respAct = st.respuestasUsuario[st.preguntaActualIdx];

        // Formato MM:SS
        const mins = Math.floor(st.segundosRestantes / 60).toString().padStart(2, '0');
        const secs = (st.segundosRestantes % 60).toString().padStart(2, '0');

        let html = `
        <!-- HEADER HUD SIMULACRO -->
        <header class="p-3 bg-slate-900 border-b border-amber-500/40 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
                <span class="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                    ⏱️ SIMULACRO CONTRARRELOJ
                </span>
                <span class="text-xs font-bold text-slate-300 truncate font-sans">${st.titulo}</span>
            </div>

            <!-- RELOJ DE CONTRARRELOJ -->
            <div id="lblClockSimulacro" class="px-3 py-1 rounded-xl bg-slate-950 border-2 border-amber-400 text-amber-300 text-sm font-black tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                ⏱️ ${mins}:${secs}
            </div>

            <button type="button" onclick="SimulacroEngine.finalizarYMostrarReporte(true)" class="px-3 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 rounded text-xs font-bold uppercase transition cursor-pointer">
                🚨 Finalizar Ahora
            </button>
        </header>

        <!-- CUERPO PRINCIPAL -->
        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
            <!-- PANEL DE PREGUNTA Y OPCIONES -->
            <div class="md:col-span-2 p-4 sm:p-6 overflow-y-auto space-y-5 border-r border-slate-800 text-left">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span class="text-xs font-bold text-cyan-400 uppercase">Reactivo ${st.preguntaActualIdx + 1} de ${st.numPreguntas}</span>
                    <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">${q.materia}</span>
                </div>

                <div class="text-sm sm:text-base font-sans text-slate-100 leading-relaxed p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    ${q.pregunta}
                </div>
                ${(q.recursoVisual && window.DanteExamWorkspace && typeof DanteExamWorkspace._htmlFigura === 'function') ? DanteExamWorkspace._htmlFigura(q.recursoVisual, true) : ''}

                <!-- GRID DE OPCIONES -->
                <div class="space-y-2.5 font-sans">
        `;

        const letras = ['A', 'B', 'C', 'D'];
        q.opciones.forEach((optText, idx) => {
            const isSelected = respAct === idx;
            const styleClass = isSelected
                ? "bg-amber-500/20 border-2 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200";

            html += `
            <div class="p-3.5 rounded-xl ${styleClass} transition-all flex items-center gap-3">
                <button type="button" onclick="SimulacroEngine.marcarRespuesta(${idx})" class="burbuja-grafito w-8 h-8 rounded-full border-2 border-slate-500 text-xs font-mono font-bold flex items-center justify-center shrink-0 ${isSelected ? 'marcada' : 'bg-white text-slate-900'}" aria-label="Marcar ${letras[idx]}">${letras[idx]}</button>
                <span class="text-xs leading-relaxed">${optText}</span>
            </div>
            `;
        });

        html += `
                </div>

                <!-- CONTROLES NAVEGACIÓN PREGUNTA -->
                <div class="flex justify-between items-center pt-4 border-t border-slate-800">
                    <button type="button" onclick="SimulacroEngine.navegarPregunta(-1)" ${st.preguntaActualIdx === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-bold uppercase transition cursor-pointer">
                        ⬅️ Anterior
                    </button>
                    <button type="button" onclick="SimulacroEngine.navegarPregunta(1)" ${st.preguntaActualIdx === st.numPreguntas - 1 ? 'disabled' : ''} class="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 text-xs font-bold uppercase transition cursor-pointer">
                        Siguiente ➡️
                    </button>
                </div>
            </div>

            <!-- HOJA DE RESPUESTAS ÓPTICA DIGITAL -->
            <div class="p-4 bg-slate-950/90 border-t md:border-t-0 md:border-l border-slate-800 overflow-y-auto space-y-3">
                <div class="flex items-center justify-between border-b border-amber-500/30 pb-2">
                    <span class="text-xs font-black text-amber-400 tracking-wider">📝 HOJA ÓPTICA DIGITAL</span>
                    <span class="text-[10px] text-slate-400 font-bold">${st.respuestasUsuario.filter(r => r !== null).length} / ${st.numPreguntas} Marcadas</span>
                </div>

                <div class="grid grid-cols-5 gap-1.5 font-mono text-xs">
        `;

        for (let i = 0; i < st.numPreguntas; i++) {
            const respondida = st.respuestasUsuario[i] !== null;
            const esActual = i === st.preguntaActualIdx;

            let cellClass = "bg-slate-900 border-slate-800 text-slate-500";
            if (respondida) cellClass = "bg-emerald-950 border-emerald-500 text-emerald-300 font-black";
            if (esActual) cellClass += " ring-2 ring-amber-400 font-black text-amber-300";

            html += `
            <button type="button" onclick="SimulacroEngine.irAPregunta(${i})" class="p-2 rounded border ${cellClass} text-[10.5px] font-bold text-center transition cursor-pointer">
                ${i + 1}
            </button>
            `;
        }

        html += `
                </div>
            </div>
        </div>
        `;

        modal.innerHTML = html;
    }

    /**
     * Cronómetro contrarreloj regresivo
     */
    static iniciarCronometroContrarreloj() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            if (!this.currentExamState) return;

            this.currentExamState.segundosRestantes--;

            const elClock = document.getElementById('lblClockSimulacro');
            if (elClock) {
                const mins = Math.floor(this.currentExamState.segundosRestantes / 60).toString().padStart(2, '0');
                const secs = (this.currentExamState.segundosRestantes % 60).toString().padStart(2, '0');
                elClock.innerHTML = `⏱️ ${mins}:${secs}`;

                if (this.currentExamState.segundosRestantes <= 300) { // < 5 mins
                    elClock.className = "px-3 py-1 rounded-xl bg-red-950 border-2 border-red-500 text-red-300 text-sm font-black tracking-widest animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]";
                }
            }

            if (this.currentExamState.segundosRestantes <= 0) {
                clearInterval(this.timerInterval);
                alert("⏰ ¡TIEMPO AGOTADO! El examen se enviará automáticamente para su evaluación psicométrica.");
                this.finalizarYMostrarReporte(false);
            }
        }, 1000);
    }

    /**
     * Marca una opción en la pregunta actual
     */
    static marcarRespuesta(opcionIdx) {
        if (!this.currentExamState) return;
        this.currentExamState.respuestasUsuario[this.currentExamState.preguntaActualIdx] = opcionIdx;
        this.renderizarPreguntaActualDOM();
    }

    static navegarPregunta(dir) {
        if (!this.currentExamState) return;
        const nxt = this.currentExamState.preguntaActualIdx + dir;
        if (nxt >= 0 && nxt < this.currentExamState.numPreguntas) {
            this.currentExamState.preguntaActualIdx = nxt;
            this.renderizarPreguntaActualDOM();
        }
    }

    static irAPregunta(idx) {
        if (!this.currentExamState) return;
        this.currentExamState.preguntaActualIdx = idx;
        this.renderizarPreguntaActualDOM();
    }

    /**
     * Evalúa el examen y despliega el informe final con diagnóstico
     */
    static finalizarYMostrarReporte(confirmarPausa = false) {
        if (confirmarPausa) {
            if (!confirm("⚠️ ¿Deseas finalizar y entregar tu examen de Simulacro Contrarreloj en este momento?")) {
                return;
            }
        }

        if (this.timerInterval) clearInterval(this.timerInterval);

        const st = this.currentExamState;
        let aciertos = 0;
        const desgloseMaterias = {
            'Matematica': { aciertos: 0, total: 0 },
            'Lectura Critica': { aciertos: 0, total: 0 },
            'Ciencias Naturales': { aciertos: 0, total: 0 },
            'Sociales y Ciudadanas': { aciertos: 0, total: 0 },
            'Ingles': { aciertos: 0, total: 0 }
        };

        const historial3pl = [];

        st.bancoPreguntas.forEach((q, idx) => {
            const userAns = st.respuestasUsuario[idx];
            const mat = q.materia || 'Matematica';
            if (!desgloseMaterias[mat]) desgloseMaterias[mat] = { aciertos: 0, total: 0 };
            desgloseMaterias[mat].total++;

            const respondida = userAns !== undefined && userAns !== null && userAns !== '';
            const acierto = respondida && userAns === q.correctaIdx;
            if (acierto) {
                aciertos++;
                desgloseMaterias[mat].aciertos++;
            }
            if (respondida) {
                const p = (window.DanteAbility && typeof window.DanteAbility.params === 'function')
                    ? window.DanteAbility.params(q)
                    : { a: q.a || 1, b: q.b || 0, c: q.c || 0.2 };
                historial3pl.push({ id: q.id || '', area: mat, a: p.a, b: p.b, c: p.c, correcto: acierto, letra: (typeof userAns === 'number' ? ['A','B','C','D'][userAns] : '') });
            }
        });

        const pctAcierto = Math.round((aciertos / st.numPreguntas) * 100);

        const estimacion = (window.DanteAbility && typeof window.DanteAbility.estimar === 'function')
            ? window.DanteAbility.estimar(historial3pl)
            : { theta: 0, sem: 1, puntos: null };
        const puntajeScore = estimacion.puntos != null ? estimacion.puntos : 0;
        if (window.DanteAbility && typeof window.DanteAbility.acumular === 'function') {
            window.DanteAbility.acumular(historial3pl);
        }
        if (window.DanteRegistro && typeof window.DanteRegistro.publicar === 'function') {
            window.DanteRegistro.publicar({
                tipo: 'SIMULACRO',
                theta: Number(localStorage.getItem('dante_theta_estimado')),
                sem: Number(localStorage.getItem('dante_sem_estimado')),
                puntos: Number(localStorage.getItem('dante_score_proyectado')),
                respuestas: historial3pl.map(function (r) { return { id: r.id, area: r.area, a: r.a, b: r.b, c: r.c, correcto: r.correcto, letra: r.letra }; })
            }).catch(function () {});
        }

        // Guardar resultado en LocalStorage
        const est = (typeof AppState !== 'undefined' && AppState.estudiante) ? AppState.estudiante : (localStorage.getItem('dante_active_student') || 'ESTUDIANTE');
        const prevResults = JSON.parse(localStorage.getItem(`dante_simulacro_results_${est}`) || '[]');
        prevResults.push({
            fecha: new Date().toISOString(),
            titulo: st.titulo,
            preguntas: st.numPreguntas,
            aciertos: aciertos,
            pctAcierto: pctAcierto,
            score: puntajeScore,
            desglose: desgloseMaterias
        });
        const margenSim = Math.max(8, Math.round((Number(estimacion.sem) || 1) * 70));
        localStorage.setItem(`dante_simulacro_results_${est}`, JSON.stringify(prevResults));
        try {
            const precision = {};
            Object.entries(desgloseMaterias).forEach(([m, d]) => {
                if (!d || !d.total) return;
                const k = String(m).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
                precision[k] = Math.round((100 * d.aciertos) / d.total);
            });
            let hist = [];
            try { hist = JSON.parse(localStorage.getItem('dante_history_cache') || '[]') || []; } catch (e) { hist = []; }
            if (!Array.isArray(hist)) hist = [];
            hist.unshift({
                id: `eval_SIMULACRO_${Date.now()}`,
                created_at: new Date().toISOString(),
                materia: st.titulo || 'Simulacro Saber 11°',
                tipo: 'SIMULACRO',
                puntaje_escalonado: puntajeScore,
                theta: estimacion.theta,
                sem: estimacion.sem,
                aciertos: aciertos,
                total: st.numPreguntas,
                precisionPorArea: precision
            });
            localStorage.setItem('dante_history_cache', JSON.stringify(hist.slice(0, 80)));
        } catch (e) {}

        // Actualizar UI del Modal
        const modal = document.getElementById('modalWorkspaceSimulacro');
        if (!modal) return;

        const desgloseHTML = Object.keys(desgloseMaterias).map(m => {
            const d = desgloseMaterias[m];
            if (d.total === 0) return '';
            const pct = Math.round((d.aciertos / d.total) * 100);
            return `
                <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                    <span class="text-[9.5px] text-slate-400 font-bold block uppercase truncate" title="${m}">${m}</span>
                    <strong class="${pct >= 70 ? 'text-emerald-400' : 'text-amber-400'} text-sm block">${d.aciertos}/${d.total} (${pct}%)</strong>
                </div>
            `;
        }).join('');

        modal.innerHTML = `
        <div class="max-w-2xl w-full mx-auto my-auto p-6 sm:p-8 bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-[0_0_80px_rgba(245,158,11,0.3)] font-mono text-left space-y-5">
            <div class="text-center space-y-2 border-b border-amber-500/30 pb-4">
                <div class="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    🏆
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
                    ESTIMACIÓN 3PL DE ESTA SESIÓN
                </span>
                <h2 class="text-2xl font-black text-white font-sans mt-1">${st.titulo}</h2>
            </div>

            <!-- SCORE GLOBAL PROYECTADO -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 text-center relative overflow-hidden space-y-1">
                <span class="text-xs text-slate-400 uppercase tracking-widest font-bold block">Estimación de esta sesión</span>
                <div class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 my-1">
                    ${puntajeScore} / 500 <span class="text-lg text-emerald-200">± ${margenSim}</span>
                </div>
                <div class="text-xs font-bold text-emerald-400">
                    Aciertos: ${aciertos} de ${st.numPreguntas} (${pctAcierto}% Eficiencia Global)
                </div>
            </div>

            <!-- DESGLOSE POR MATERIAS -->
            <div class="space-y-2 font-sans">
                <span class="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider block">📊 Desglose de Rendimiento por Área:</span>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
                    ${desgloseHTML}
                </div>
            </div>

            <!-- DIAGNÓSTICO PEDAGÓGICO -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h4 class="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span>💡</span> DIAGNÓSTICO PEDAGÓGICO SOCRÁTICO
                </h4>
                <p class="text-slate-300 font-sans leading-relaxed">
                    ${pctAcierto >= 70 
                        ? '¡Excelente rendimiento! Has demostrado un dominio sólido de la estructura conceptual y la calibración psicométrica. Se ha actualizado tu Puntaje Global Diagnóstico en el sistema.' 
                        : 'Has completado el entrenamiento con éxito. Se recomienda reforzar las áreas críticas observadas en el desglose y continuar la rutina diaria en la Sala CAT adaptativa.'}
                </p>
            </div>

            <button type="button" onclick="SimulacroEngine.cerrarYRefrescarUI()" class="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer">
                🏛️ REGRESAR AL TABLERO PRINCIPAL Y RUTA DE APRENDIZAJE
            </button>
        </div>
        `;
    }

    static cerrarYRefrescarUI() {
        const modal = document.getElementById('modalWorkspaceSimulacro');
        if (modal) modal.style.display = 'none';

        if (typeof RutaAprendizajeEngine !== 'undefined') {
            RutaAprendizajeEngine.renderizarRutaUI('uiContenedorRutaAprendizaje');
            RutaAprendizajeEngine.renderizarRutaUI('uiContenedorRutaAprendizajePerfil');
        }

        if (typeof AppController !== 'undefined' && AppController.renderizarDashboardTacticoMaterias) {
            AppController.renderizarDashboardTacticoMaterias();
        }
    }
}

// Exportación Global Navegador
if (typeof window !== 'undefined') {
    window.RutaAprendizajeEngine = RutaAprendizajeEngine;
    window.SimulacroEngine = SimulacroEngine;
}
