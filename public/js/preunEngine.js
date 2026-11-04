/**
 * 🏛️ preunEngine.js - Engine del Módulo Preuniversitario UNAL / UdeA
 * Dante OS v23.1.0 Enterprise Edition
 */

window.PreunEngine = (function() {
    let carreraActual = 'unal_medicina_bogota';
    let studentId = 'preun_estudiante_v23';
    let itemActivo = null;

    const CORTES_CARRERAS = {
        'unal_medicina_bogota': { nombre: 'UNAL Bogotá - Medicina', corte: 765, maxScore: null },
        'unal_sistemas_bogota': { nombre: 'UNAL Bogotá - Ing. de Sistemas', corte: 704, maxScore: null },
        'unal_derecho_bogota': { nombre: 'UNAL Bogotá - Derecho', corte: 646, maxScore: null },
        'unal_arquitectura_bogota': { nombre: 'UNAL Bogotá - Arquitectura', corte: 635, maxScore: null },
        'udea_medicina_medellin': { nombre: 'UdeA Medellín - Medicina', corte: 82, maxScore: 100 },
        'udea_ingenieria_sistemas': { nombre: 'UdeA Medellín - Ing. de Sistemas', corte: 71, maxScore: 100 }
    };

    function abrirModalROICognitivo() {
        const modal = document.getElementById('modalPreunROICognitivo');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            cargarDiagnosticoROI();
        }
    }

    function cerrarModalROICognitivo() {
        const modal = document.getElementById('modalPreunROICognitivo');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    function cambiarCarreraTarget(carreraId) {
        carreraActual = carreraId;
        // Sincronizar todos los selectores de carrera en pantalla
        const selectors = document.querySelectorAll('.select-carrera-preun');
        selectors.forEach(sel => { sel.value = carreraId; });
        cargarDiagnosticoROI();
    }

    function alumnoReal() {
        if (window.DanteRegistro && typeof DanteRegistro.idAlumno === 'function') {
            const id = DanteRegistro.idAlumno();
            if (id) return id;
        }
        const direct = localStorage.getItem('dante_student_id') || '';
        if (direct && direct !== 'estudiante' && direct !== 'student_demo_01' && direct !== 'preun_estudiante_v23') return direct;
        try {
            const user = JSON.parse(localStorage.getItem('dante_user') || '{}');
            const email = String(user.email || '').toLowerCase();
            if (email.includes('@')) return email.split('@')[0].replace(/[^a-z0-9_]/g, '');
        } catch (e) {}
        return '';
    }

    function getAuthenticatedStudentId() {
        return alumnoReal();
    }

    async function cargarDiagnosticoROI() {
        try {
            const elegida = localStorage.getItem('dante_preu_carrera_id');
            if (elegida) carreraActual = elegida;
            const activeId = getAuthenticatedStudentId();
            if (!activeId) return;
            const token = localStorage.getItem("dante_token") || localStorage.getItem("dante_jwt") || localStorage.getItem("dante_session_token");
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const resp = await fetch(`/api/preun/roi-cognitivo?studentId=${activeId}&carreraId=${carreraActual}`, { headers, credentials: 'include' });
            if (!resp.ok) {
                console.warn("⚠️ [ROI COGNITIVO]: Respuesta no OK del servidor:", resp.status);
                return;
            }
            const contentType = resp.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                console.warn("⚠️ [ROI COGNITIVO]: Content-Type no es JSON:", contentType);
                return;
            }
            const data = await resp.json();

            if (data.success) {
                const escalaCorte = data.escalaCorte || data.maxScore || (data.universidad === 'UdeA' ? 100 : null);

                // Elementos en Modal
                const actualEl = document.getElementById('preunLblPuntajeActual');
                const corteEl = document.getElementById('preunLblCorteSNIES');
                const brechaEl = document.getElementById('preunLblBrecha');
                const badgeEl = document.getElementById('preunBadgeSemaforo');

                // Elementos en Pantalla Principal Preun
                const mainCarreraEl = document.getElementById('lblCarreraPreunMain');
                const mainActualEl = document.getElementById('lblPuntajePreunMain');
                const mainCorteEl = document.getElementById('lblCortePreunMain');
                const mainBrechaEl = document.getElementById('lblBrechaPreunMain');
                const mainBadgeEl = document.getElementById('badgeSemaforoPreunMain');

                if (mainCarreraEl) mainCarreraEl.textContent = data.carreraNombre;

                const tieneCal = data.tieneCalibracion === true && data.puntajeProyectado != null;
                const textoActual = tieneCal ? `${data.puntajeProyectado} de 500` : 'Sin medición Pre-U';
                const textoCorte = (data.universidad === 'UNAL' || escalaCorte == null)
                    ? `último admitido ${data.corteHistorico} · escala estándar, media 500`
                    : `${data.corteHistorico} de ${escalaCorte}`;
                if (tieneCal) localStorage.setItem('dante_preu_puntos', String(data.puntajeProyectado));

                if (actualEl) actualEl.textContent = textoActual;
                if (mainActualEl) mainActualEl.textContent = textoActual;

                if (corteEl) corteEl.textContent = textoCorte;
                if (mainCorteEl) mainCorteEl.textContent = textoCorte;

                const brechaText = 'El corte va en su escala. Tu habilidad Pre-U va de 0 a 500.';
                const brechaClass = "text-amber-200 font-bold text-sm";
                const badgeText = tieneCal ? "HABILIDAD PRE-U MEDIDA" : "SIN RESPUESTAS PRE-U";
                const badgeClass = tieneCal
                    ? "px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold"
                    : "px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-bold";

                if (brechaEl) {
                    brechaEl.textContent = brechaText;
                    brechaEl.className = brechaClass;
                }
                if (mainBrechaEl) {
                    mainBrechaEl.textContent = brechaText;
                    mainBrechaEl.className = brechaClass;
                }

                if (badgeEl) {
                    badgeEl.textContent = badgeText;
                    badgeEl.className = badgeClass;
                }
                if (mainBadgeEl) {
                    mainBadgeEl.textContent = badgeText;
                    mainBadgeEl.className = badgeClass;
                }

                // Renderizar Matriz de ROI Cognitivo en Modal y Main
                const containerROI = document.getElementById('preunContainerMatrizROI');
                const containerROIMain = document.getElementById('containerROIPreunMain');

                if (data.matrizROI) {
                    let htmlROI = '';
                    data.matrizROI.forEach(area => {
                        htmlROI += `
                            <div class="p-2 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                                <div class="flex items-center justify-between text-[11px] font-mono font-bold">
                                    <span class="text-white truncate">${area.area}</span>
                                    <span class="text-emerald-400 shrink-0">+${area.puntosPotencialesPorHora} Pts/h</span>
                                </div>
                                <div class="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-800">
                                    <div class="bg-gradient-to-r from-emerald-500 to-amber-400 h-full" style="width: ${Math.min(100, area.puntosPotencialesPorHora * 3.5)}%;"></div>
                                </div>
                            </div>
                        `;
                    });

                    if (containerROI) containerROI.innerHTML = htmlROI;
                    if (containerROIMain) containerROIMain.innerHTML = htmlROI;
                }

                // Renderizar Plan de Vuelo e Informe de Sala de Mando IA
                if (data.planDeVueloIA) {
                    const diagEl = document.getElementById('preunLblDiagnosticoIA');
                    const diasEl = document.getElementById('preunLblDiasMeta');
                    const accionEl = document.getElementById('preunLblAccionIA');
                    const btnAccion = document.getElementById('btnAccionNodosPreun');

                    if (diagEl) diagEl.textContent = data.planDeVueloIA.diagnostico;
                    if (diasEl) diasEl.textContent = `⏱️ ~${data.planDeVueloIA.diasEstimados} Días (${data.planDeVueloIA.horasPracticaEstimadas} hrs de práctica)`;
                    if (accionEl) accionEl.textContent = data.planDeVueloIA.accionInmediata;
                    if (btnAccion) {
                        btnAccion.setAttribute('onclick', `PreunEngine.abrirBriefingTactico('${data.planDeVueloIA.nodoRecomendado}')`);
                    }
                }

                // Renderizar Tarjetas de Componentes en la Sala de Mando (Luxury Tech)
                const containerCompMain = document.getElementById('containerComponentesPreunMain');
                if (containerCompMain && data.componentes) {
                    let htmlComp = '';
                    const SVG_ICONS = {
                        'calculo': `<svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16"/><path d="M4 5l8 14 8-14"/></svg>`,
                        'fisica': `<svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
                        'quimica': `<svg class="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.75 18.1A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.65-2.9L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/></svg>`,
                        'lectura_critica': `<svg class="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
                        'analisis_imagen': `<svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
                    };

                    data.componentes.forEach(c => {
                        const isOk = c.dominio >= 70;
                        const barColor = isOk ? 'from-emerald-500 via-teal-400 to-emerald-300' : 'from-amber-500 via-rose-500 to-amber-400';
                        const badgeBg = isOk 
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30';
                        const iconSvg = SVG_ICONS[c.id] || `<svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;

                        htmlComp += `
                            <div onclick="PreunEngine.abrirBriefingTactico('${c.id}')" class="p-3 bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/60 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] space-y-2 group shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                                <div class="flex items-center justify-between">
                                    <div class="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        ${iconSvg}
                                    </div>
                                    <span class="px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold flex items-center gap-1 ${badgeBg}">
                                        <span class="w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
                                        <span>${isOk ? 'ADMISIBLE' : 'REFUERZO'}</span>
                                    </span>
                                </div>
                                <div>
                                    <h5 class="text-[11.5px] font-bold text-white font-sans group-hover:text-emerald-300 transition-colors truncate">${c.nombre}</h5>
                                    <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                                        <span>Dominio:</span>
                                        <span class="font-bold text-white">${c.dominio}%</span>
                                    </div>
                                    <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80 mt-1">
                                        <div class="bg-gradient-to-r ${barColor} h-full transition-all duration-500" style="width: ${c.dominio}%;"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    containerCompMain.innerHTML = htmlComp;
                }
            }
        } catch (e) {
            console.error("Error cargando diagnóstico ROI:", e);
        }
    }

    let callbackAccionBriefingConfirmado = null;

    function abrirBriefingTactico(materiaId = 'general', numBloque = null) {
        const modal = document.getElementById('modalBriefingTactico');
        
        const MAPA_BRIEFING = {
            'calculo': { 
                nombre: 'Cálculo Diferencial & Integral', 
                exam: 'UNAL / UdeA', 
                objetivo: 'Entrenamiento en límites, derivadas, optimización y secuencias analíticas.', 
                brecha: 'Impacto directo para facultades de Ingeniería y Ciencias Exactas (+20 Pts en T-Score).', 
                advertencia: '⚠️ Indicación Táctica: Este componente evalúa tu agilidad algebraica. Si estás entre 2 opciones, aplica el descarte socrático y evalúa casos límite (x=0, x=1).'
            },
            'fisica': { 
                nombre: 'Física Mecánica & Vectores', 
                exam: 'UNAL', 
                objetivo: 'Comprensión de cinemática, leyes de Newton, conservación de energía y estática.', 
                brecha: 'Aumento de T-Score en la sección de Ciencias Naturales (+18 Pts).', 
                advertencia: '⚠️ Indicación Táctica: Presta especial atención a las unidades del SI y la dirección de los vectores de fuerza antes de seleccionar la opción.'
            },
            'quimica': { 
                nombre: 'Química General & Soluciones', 
                exam: 'UNAL', 
                objetivo: 'Estequiometría, balance de ecuaciones, soluciones molar/normal y pH.', 
                brecha: 'Cierre de brecha prioritario para carreras de la Salud (Medicina, Enfermería) (+25 Pts).', 
                advertencia: '⚠️ Indicación Táctica: Recuerda la relación masa-moles. Mantén la calma y aplica el descarte de opciones estequiométricas incoherentes.'
            },
            'lectura_critica': { 
                nombre: 'Comprensión Lectora Avanzada UNAL', 
                exam: 'UNAL / UdeA', 
                objetivo: 'Análisis de textos filosóficos, ensayos sociológicos e inferencia discursiva.', 
                brecha: 'Maximización de puntaje en la prueba de mayor peso relativo ponderado (+26 Pts).', 
                advertencia: '⚠️ Indicación Táctica: Utiliza la herramienta de Highlighter Socrático IA para identificar la premisa central del autor antes de leer las opciones.'
            },
            'analisis_imagen': { 
                nombre: 'Imagen 3D & Lógica UdeA', 
                exam: 'UNAL / UdeA', 
                objetivo: 'Rotación espacial de sólidos 3D, vistas ortogonales y deducción lógica.', 
                brecha: 'Entrenamiento con el Inspector Ojo Biónico 3D Vectorial (+22 Pts).', 
                advertencia: '⚠️ Indicación Táctica: Para preguntas 3D, puedes activar el Inspector Biónico Vectorial 360° si necesitas validar la rotación del sólido.'
            },
            'general': { 
                nombre: 'Bloque Adaptativo de Misión Diaria', 
                exam: 'UNAL / UdeA / ICFES', 
                objetivo: 'Entrenamiento integrado de preparación continua.', 
                brecha: 'Cierre de brecha global para acelerar tu meta de admisión (+25 Pts).', 
                advertencia: '⚠️ Indicación Táctica: Responderás un bloque de 5 reactivos seleccionados por la IA. Mide tu tiempo y evita vacilar sin justificación lógica.'
            }
        };

        const info = MAPA_BRIEFING[materiaId] || MAPA_BRIEFING['general'];

        const tituloEl = document.getElementById('lblBriefingTitulo');
        const objEl = document.getElementById('lblBriefingObjetivo');
        const estEl = document.getElementById('lblBriefingEstructura');
        const tiemEl = document.getElementById('lblBriefingTiempo');
        const advEl = document.getElementById('lblBriefingAdvertencia');

        if (tituloEl) tituloEl.textContent = `Briefing: ${info.nombre}`;
        if (objEl) objEl.textContent = `${info.objetivo} ${info.brecha}`;
        if (estEl) estEl.textContent = `5 Reactivos IRT (${info.exam})`;
        if (tiemEl) tiemEl.textContent = `~8 - 10 Minutos`;
        if (advEl) advEl.textContent = info.advertencia;

        callbackAccionBriefingConfirmado = () => {
            cerrarBriefingTactico();
            if (numBloque !== null && window.AppController && window.AppController.ejecutarBloqueDirecto) {
                window.AppController.ejecutarBloqueDirecto(numBloque);
            } else {
                ejecutarCargaDirecta(materiaId);
            }
        };

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        } else {
            // Fallback si no está el modal en el DOM
            ejecutarCargaDirecta(materiaId);
        }
    }

    function cerrarBriefingTactico() {
        const modal = document.getElementById('modalBriefingTactico');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    function ejecutarInspiracionEntrenamiento() {
        if (typeof callbackAccionBriefingConfirmado === 'function') {
            callbackAccionBriefingConfirmado();
        } else {
            cerrarBriefingTactico();
            ejecutarCargaDirecta('calculo');
        }
    }

    async function cargarSiguienteReactivo(area = 'analisis_imagen') {
        await ejecutarCargaDirecta(area);
    }

    async function ejecutarCargaDirecta(area = 'analisis_imagen') {
        if (window.TelemetriaIRD) window.TelemetriaIRD.resetear();
        const alumno = alumnoReal();
        if (!alumno) return;
        studentId = alumno;

        try {
            const resp = await fetch('/api/preun/interactuar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, areaGeneral: area, targetExam: 'UNAL' })
            });
            const data = await resp.json();
            if (data.success && data.item) {
                itemActivo = data.item;
                renderizarReactivoEnPantalla(data.item);
                return;
            }
        } catch (e) {
            console.warn("⚠️ [PREUN ENGINE]: Cargando desde banco local...", e.message);
        }

        // Fallback defensivo a ítem local del banco preuniversitario
        const fallbackItem = {
            id: "preun_unal_img_001",
            target_exam: "UNAL",
            area: area || "analisis_imagen",
            materia: area || "analisis_imagen",
            pregunta_texto: "Al armar la plantilla bidimensional doblándola por sus aristas discontinuas (a 90° hacia adentro), ¿cuál de los cuatro poliedros tridimensionales se obtiene?",
            opciones: [
                "A) Cubo con cara sombreada contigua a la arista superior derecha y diagonal en eje X.",
                "B) Cubo con cara vacía en la base y sombreado en la faceta lateral izquierda.",
                "C) Poliedro con traslape simétrico sobre el eje Z e inversión de sombreado.",
                "D) Cubo con dos caras opuestas completamente sombreadas en paralelo."
            ],
            correcta: "A",
            a: 1.85,
            b: 0.45,
            c: 0.20,
            sub_competencia: "despliegue_3d",
            atajo_tactico: "Analiza únicamente la posición del vértice de contacto: al doblar a 90°, el triángulo sombreado toca la cara diagonal A.",
            tipo_componente: "canvas_vectorial_3d"
        };
        itemActivo = fallbackItem;
        renderizarReactivoEnPantalla(fallbackItem);
    }

    function renderizarReactivoEnPantalla(item) {
        const container = document.getElementById('preunContainerPreguntaActive');
        if (!container) return;

        // Revelar contenedor si estaba oculto
        container.classList.remove('hidden');

        const examBadge = item.target_exam === 'UDEA' ? 'UdeA' : 'UNAL';
        const areaBadge = (item.sub_competencia || item.materia || 'COMPONENTE').toUpperCase().replace(/_/g, ' ');

        let html = `
            <div class="p-5 bg-slate-950 border-2 border-emerald-500/50 rounded-2xl space-y-4 font-mono shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-fade-in">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-bold">${examBadge}</span>
                        <span class="text-xs text-amber-400 font-bold uppercase tracking-wider">${areaBadge}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        ${(item.tipo_componente === 'canvas_vectorial_3d' || item.area === 'analisis_imagen' || item.materia === 'analisis_imagen') ? `
                            <button type="button" onclick="OjoBionico3D.abrirModal3D()" class="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-300 text-[10.5px] font-bold cursor-pointer transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                <svg class="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                <span>INSPECTOR OJO BIÓNICO 3D</span>
                            </button>
                        ` : ''}
                        <button type="button" onclick="HighlighterSocratico.ejecutarHighlighter('${item.pregunta_texto.replace(/'/g, "\\'")}', '', 'txtPreguntaPreun')" class="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-300 text-[10.5px] font-bold cursor-pointer transition flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            <span>HIGHLIGHTER SOCRÁTICO IA</span>
                        </button>
                    </div>
                </div>

                <div id="txtPreguntaPreun" class="text-sm text-slate-100 font-bold leading-relaxed pt-1">
                    ${item.pregunta_texto}
                </div>

                <div class="space-y-2.5 pt-2">
        `;

        const opcionesList = item.opciones_respuesta || item.opciones || [];
        opcionesList.forEach(opc => {
            let opcId = typeof opc === 'object' && opc !== null ? opc.id : (typeof opc === 'string' ? opc.substring(0, 1) : '');
            let opcTexto = typeof opc === 'object' && opc !== null ? opc.texto : (typeof opc === 'string' ? (opc.substring(3) || opc) : '');
            if (!opcId) opcId = 'A';

            html += `
                <button type="button" onclick="PreunEngine.seleccionarOpcion('${opcId}', '${item.id}')" class="w-full text-left p-3.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/60 text-xs text-slate-200 font-bold transition-all cursor-pointer flex items-center justify-between group">
                    <span class="group-hover:text-emerald-300 transition-colors"><strong class="text-emerald-400">${opcId})</strong> ${opcTexto}</span>
                    <span class="text-slate-500 group-hover:text-emerald-400 text-[10px] font-mono uppercase shrink-0 ml-2">SELECCIONAR ➔</span>
                </button>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    let opcionSeleccionadaTemp = null;

    function renderizarReactivoEnPantalla(item) {
        const container = document.getElementById('preunContainerPreguntaActive');
        if (!container) return;

        opcionSeleccionadaTemp = null;

        // Revelar contenedor si estaba oculto
        container.classList.remove('hidden');

        const examBadge = item.target_exam === 'UDEA' ? 'UdeA' : 'UNAL';
        const areaBadge = (item.sub_competencia || item.materia || 'COMPONENTE').toUpperCase().replace(/_/g, ' ');
        const es3D = item.tipo_componente === 'canvas_vectorial_3d' || item.area === 'analisis_imagen' || item.materia === 'analisis_imagen';

        let html = `
            <div class="p-4 sm:p-6 bg-slate-950 border-2 border-emerald-500/50 rounded-2xl space-y-4 font-mono shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-fade-in text-left">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-bold">${examBadge}</span>
                        <span class="text-xs text-amber-400 font-bold uppercase tracking-wider">${areaBadge}</span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        ${es3D ? `
                            <button type="button" onclick="OjoBionico3D.abrirModal3D()" class="px-3 py-1.5 bg-cyan-950/90 hover:bg-cyan-900 border-2 border-cyan-400 rounded-xl text-cyan-200 text-xs font-black cursor-pointer transition flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse">
                                <span class="relative flex h-2.5 w-2.5">
                                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
                                </span>
                                <svg class="w-4 h-4 text-cyan-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                <span>👁️ INSPECTOR OJO BIÓNICO 3D</span>
                            </button>
                        ` : ''}
                        <button type="button" onclick="HighlighterSocratico.ejecutarHighlighter('${(item.pregunta_texto || '').replace(/'/g, "\\'")}', '', 'txtPreguntaPreun')" class="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold cursor-pointer transition flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            <span>HIGHLIGHTER SOCRÁTICO IA</span>
                        </button>
                    </div>
                </div>

                <div id="txtPreguntaPreun" class="text-sm sm:text-base text-slate-100 font-medium leading-relaxed pt-1 font-sans">
                    ${item.pregunta_texto}
                </div>

                <div class="space-y-2.5 pt-2" id="gridOpcionesPreun">
        `;

        const opcionesList = item.opciones_respuesta || item.opciones || [];
        opcionesList.forEach(opc => {
            let opcId = typeof opc === 'object' && opc !== null ? opc.id : (typeof opc === 'string' ? opc.substring(0, 1) : '');
            let opcTexto = typeof opc === 'object' && opc !== null ? opc.texto : (typeof opc === 'string' ? (opc.substring(3) || opc) : '');
            if (!opcId) opcId = 'A';

            html += `
                <button type="button" id="btnOpcionPreun_${opcId}" onclick="PreunEngine.marcarOpcionTemp('${opcId}')" class="btn-opcion-preun w-full text-left p-3.5 sm:p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-800 hover:border-slate-600 text-xs sm:text-sm text-slate-200 font-sans font-semibold transition-all cursor-pointer flex items-center justify-between group">
                    <span class="flex items-center gap-3">
                        <span class="w-7 h-7 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 group-hover:border-emerald-400">${opcId}</span>
                        <span class="opc-texto-content">${opcTexto}</span>
                    </span>
                    <span id="badgeCheck_${opcId}" class="text-slate-500 text-[10.5px] font-mono uppercase shrink-0 ml-2">SELECCIONAR ➔</span>
                </button>
            `;
        });

        html += `
                </div>

                <!-- BOTÓN CONFIRMAR RESPUESTA -->
                <div class="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                    <button type="button" id="btnConfirmarRespuestaPreun" onclick="PreunEngine.confirmarRespuesta()" disabled class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 text-slate-500 font-mono font-black text-xs uppercase tracking-wider transition-all border border-slate-700 cursor-not-allowed flex items-center justify-center gap-2">
                        <span>CONFIRMAR Y ENVIAR RESPUESTA</span>
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Aplicar renderizado KaTeX de fórmulas matemáticas
        aplicarKaTeX(container);

        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function aplicarKaTeX(element) {
        if (!element) return;
        if (typeof renderMathInElement === 'function') {
            try {
                renderMathInElement(element, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            } catch (e) {
                console.warn("Error renderizando KaTeX:", e);
            }
        }
    }

    function marcarOpcionTemp(opcId) {
        opcionSeleccionadaTemp = opcId;

        // Desmarcar todas
        document.querySelectorAll('.btn-opcion-preun').forEach(btn => {
            btn.classList.remove('border-emerald-400', 'bg-emerald-950/60', 'shadow-[0_0_20px_rgba(16,185,129,0.3)]');
            btn.classList.add('border-slate-800', 'bg-slate-900/90');
        });

        // Marcar seleccionada
        const btnSel = document.getElementById(`btnOpcionPreun_${opcId}`);
        if (btnSel) {
            btnSel.classList.remove('border-slate-800', 'bg-slate-900/90');
            btnSel.classList.add('border-emerald-400', 'bg-emerald-950/60', 'shadow-[0_0_20px_rgba(16,185,129,0.3)]');
        }

        // Actualizar badges
        const opcionesList = itemActivo?.opciones_respuesta || itemActivo?.opciones || [];
        opcionesList.forEach(opc => {
            let id = typeof opc === 'object' && opc !== null ? opc.id : (typeof opc === 'string' ? opc.substring(0, 1) : '');
            if (!id) id = 'A';
            const bCheck = document.getElementById(`badgeCheck_${id}`);
            if (bCheck) {
                if (id === opcId) {
                    bCheck.innerHTML = `✓ SELECCIONADA`;
                    bCheck.className = `text-emerald-400 font-bold text-[11px] font-mono uppercase shrink-0 ml-2`;
                } else {
                    bCheck.innerHTML = `SELECCIONAR ➔`;
                    bCheck.className = `text-slate-500 text-[10.5px] font-mono uppercase shrink-0 ml-2`;
                }
            }
        });

        // Habilitar botón de confirmación
        const btnConfirm = document.getElementById('btnConfirmarRespuestaPreun');
        if (btnConfirm) {
            btnConfirm.disabled = false;
            btnConfirm.className = `w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-105 active:scale-95 border border-emerald-200`;
        }

        if (window.TelemetriaIRD) window.TelemetriaIRD.registrarPulsacionOpcion(opcId);
    }

    function confirmarRespuesta() {
        if (!opcionSeleccionadaTemp || !itemActivo) return;
        seleccionarOpcion(opcionSeleccionadaTemp, itemActivo.id);
    }

    async function seleccionarOpcion(opcionId, itemId) {
        try {
            const alumno = alumnoReal();
            if (!alumno) return;
            studentId = alumno;
            const resp = await fetch('/api/preun/responder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: alumno, itemId, opcionSeleccionada: opcionId })
            });
            const data = await resp.json();

            if (data.success) {
                if (data.puntos != null) localStorage.setItem('dante_preu_puntos', String(data.puntos));
                if (window.TelemetriaIRD) {
                    window.TelemetriaIRD.enviarTelemetriaFinal(studentId, data.esCorrecta);
                }

                const container = document.getElementById('preunContainerPreguntaActive');
                if (container && itemActivo) {
                    const isCorrect = data.esCorrecta;
                    const statusClass = isCorrect 
                        ? 'border-emerald-500/80 bg-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.25)]' 
                        : 'border-rose-500/80 bg-slate-950 shadow-[0_0_40px_rgba(244,63,94,0.25)]';
                    const titleText = isCorrect ? '🟢 ¡RESPUESTA CORRECTA!' : `🔴 INCORRECTO (OPCIÓN CORRECTA: ${data.opcionCorrecta})`;
                    const titleClass = isCorrect ? 'text-emerald-400' : 'text-rose-400';

                    let htmlFeedback = `
                        <div class="p-5 sm:p-6 border-2 ${statusClass} rounded-2xl space-y-5 font-mono animate-fade-in text-left">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm sm:text-base font-black uppercase ${titleClass}">${titleText}</span>
                                </div>
                                <span class="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs text-amber-300 font-bold">DELTA THETA: ${data.cambioTheta > 0 ? '+' : ''}${data.cambioTheta}</span>
                            </div>

                            <!-- PREGUNTA ORIGINAL -->
                            <div class="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Premisa Evaluada:</span>
                                <p class="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">${itemActivo.pregunta_texto}</p>
                            </div>

                            <!-- DESGLOSE DE OPCIONES -->
                            <div class="space-y-2">
                                <span class="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider block">Verificación de Opciones:</span>
                    `;

                    const opcionesList = itemActivo.opciones_respuesta || itemActivo.opciones || [];
                    opcionesList.forEach(opc => {
                        let opcId = typeof opc === 'object' && opc !== null ? opc.id : (typeof opc === 'string' ? opc.substring(0, 1) : '');
                        let opcTexto = typeof opc === 'object' && opc !== null ? opc.texto : (typeof opc === 'string' ? (opc.substring(3) || opc) : '');
                        if (!opcId) opcId = 'A';

                        const esTuSeleccion = opcId === opcionId;
                        const esLaCorrecta = opcId === data.opcionCorrecta;

                        let cardStyle = 'border-slate-800 bg-slate-900/60 text-slate-400';
                        let badgeText = '';

                        if (esLaCorrecta) {
                            cardStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-200 font-bold';
                            badgeText = '<span class="text-emerald-400 text-[11px] font-bold">✓ OPCIÓN CORRECTA</span>';
                        } else if (esTuSeleccion && !isCorrect) {
                            cardStyle = 'border-rose-500 bg-rose-950/70 text-rose-200 font-bold';
                            badgeText = '<span class="text-rose-400 text-[11px] font-bold">✗ TU RESPUESTA</span>';
                        }

                        htmlFeedback += `
                            <div class="p-3 rounded-xl border ${cardStyle} text-xs font-sans flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <strong class="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800">${opcId}</strong>
                                    <span>${opcTexto}</span>
                                </div>
                                <div>${badgeText}</div>
                            </div>
                        `;
                    });

                    htmlFeedback += `
                            </div>

                            <!-- EXPLICACIÓN Y ATAJO TÁCTICO SOCRÁTICO -->
                            <div class="p-4 bg-slate-950 border border-amber-500/40 rounded-xl space-y-1.5">
                                <span class="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <svg class="w-4 h-4 text-amber-400 shrink-0 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 
                                    <span>ATAJO TÁCTICO SOCRÁTICO:</span>
                                </span>
                                <div class="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-1">
                                    ${data.atajoTactico || 'Analiza las restricciones de la premisa antes de calcular.'}
                                </div>
                            </div>

                            <!-- BOTÓN CONTINUAR -->
                            <div class="pt-2">
                                <button type="button" onclick="PreunEngine.cargarSiguienteReactivo('${itemActivo?.area || 'analisis_imagen'}')" class="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 border border-emerald-200">
                                    <span>⚡ CONTINUAR AL SIGUIENTE REACTIVO ADAPTATIVO UNAL/UDEA</span>
                                    <span>➔</span>
                                </button>
                            </div>
                        </div>
                    `;

                    container.innerHTML = htmlFeedback;

                    // Aplicar KaTeX a las fórmulas de la solución
                    aplicarKaTeX(container);
                }

                // Actualizar diagnóstico de ROI en vivo
                cargarDiagnosticoROI();
            }
        } catch (e) {
            console.error("Error al responder reactivo preun:", e);
        }
    }

    // Auto-inicializar Sala de Mando al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarDiagnosticoROI);
    } else {
        setTimeout(cargarDiagnosticoROI, 200);
    }

    return {
        abrirModalROICognitivo,
        cerrarModalROICognitivo,
        cambiarCarreraTarget,
        cargarSiguienteReactivo,
        ejecutarCargaDirecta,
        abrirBriefingTactico,
        cerrarBriefingTactico,
        ejecutarInspiracionEntrenamiento,
        marcarOpcionTemp,
        confirmarRespuesta,
        seleccionarOpcion,
        cargarDiagnosticoROI
    };
})();
