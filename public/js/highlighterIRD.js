/**
 * 🧠 highlighterIRD.js - Dante OS v23.1.0 Enterprise
 * Módulo de Highlighter Socrático Gemini IA & Telemetría del Índice de Riesgo por Duda (IRD)
 */

window.HighlighterSocratico = (function() {
    let activo = false;

    async function ejecutarHighlighter(texto, pregunta, targetContainerId) {
        const container = document.getElementById(targetContainerId);
        if (!container) return;

        container.insertAdjacentHTML('beforebegin', `
            <div id="highlighterLoader" class="flex items-center gap-2 text-xs text-amber-400 font-mono my-2 animate-pulse">
                <svg class="animate-spin h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                <span>🤖 Gemini IA Socrática: Analizando Skimming & Scanning (Tesis, Distractores y Conclusión)...</span>
            </div>
        `);

        try {
            const resp = await fetch('/api/preun/highlighter-socratico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, pregunta })
            });
            const data = await resp.json();

            const loader = document.getElementById('highlighterLoader');
            if (loader) loader.remove();

            if (data.success && data.highlight) {
                const hl = data.highlight;
                let htmlAnotado = texto;

                // Destacar Tesis/Premisa Clave en Amarillo
                if (hl.tesis_premisa_clave && Array.isArray(hl.tesis_premisa_clave)) {
                    hl.tesis_premisa_clave.forEach(frase => {
                        if (frase && frase.length > 3) {
                            const re = new RegExp(`(${frase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                            htmlAnotado = htmlAnotado.replace(re, `<mark class="bg-amber-500/30 text-amber-200 border-b-2 border-amber-400 px-1 rounded font-bold" title="🟡 Tesis / Premisa Clave">$1</mark>`);
                        }
                    });
                }

                // Destacar Distractor/Falacia en Rojo
                if (hl.distractor_falacia && Array.isArray(hl.distractor_falacia)) {
                    hl.distractor_falacia.forEach(frase => {
                        if (frase && frase.length > 3) {
                            const re = new RegExp(`(${frase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                            htmlAnotado = htmlAnotado.replace(re, `<mark class="bg-rose-500/30 text-rose-200 border-b-2 border-rose-400 px-1 rounded font-bold" title="🔴 Trampa / Distractor Conceptualmente Erróneo">$1</mark>`);
                        }
                    });
                }

                container.innerHTML = htmlAnotado;

                // Insertar banner de Síntesis Socrática Verde
                if (hl.conclusion_socratica) {
                    container.insertAdjacentHTML('afterend', `
                        <div class="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs font-mono text-emerald-300 space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <div class="flex items-center gap-1.5 font-bold uppercase text-[10.5px]">
                                <span>🟢 Síntesis Socrática de Respuesta:</span>
                            </div>
                            <p>${hl.conclusion_socratica}</p>
                        </div>
                    `);
                }
            }
        } catch (e) {
            console.error("🚨 Error ejecutando Highlighter Socrático:", e);
            const loader = document.getElementById('highlighterLoader');
            if (loader) loader.remove();
        }
    }

    return {
        ejecutarHighlighter
    };
})();

window.TelemetriaIRD = (function() {
    let tiempoInicio = Date.now();
    let vacilacionesCount = 0;
    let opcionPrevia = null;
    let cambiosCount = 0;
    let timerFatigaCheck = null;

    function resetear() {
        tiempoInicio = Date.now();
        vacilacionesCount = 0;
        opcionPrevia = null;
        cambiosCount = 0;
        ocultarAlerta();
        ocultarAlertaFatiga();
        iniciarVigilanciaFatiga();
    }

    function iniciarVigilanciaFatiga() {
        if (timerFatigaCheck) clearInterval(timerFatigaCheck);
        timerFatigaCheck = setInterval(() => {
            const segs = Math.floor((Date.now() - tiempoInicio) / 1000);
            if (segs >= 110) {
                mostrarAlertaFatiga(segs);
            }
        }, 5000);
    }

    function registrarPulsacionOpcion(opcion) {
        vacilacionesCount++;
        if (opcionPrevia !== null && opcionPrevia !== opcion) {
            cambiosCount++;
            mostrarAlertaCambio();
        }
        opcionPrevia = opcion;
    }

    function mostrarAlertaCambio() {
        let alertEl = document.getElementById('cardAlertaIRDMetacognitiva');
        if (!alertEl) {
            const container = document.getElementById('preunContainerPreguntaActive') || 
                              document.getElementById('uiPregunta') || 
                              document.body;
            container.insertAdjacentHTML('beforeend', `
                <div id="cardAlertaIRDMetacognitiva" class="mt-3 p-3 bg-amber-950/90 border border-amber-500/60 rounded-xl text-xs font-mono text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-bounce">
                    <div class="flex items-center gap-2 font-bold uppercase text-[11px] text-amber-200">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <span>⚠️ TELEMETRÍA IRD :: CAMBIO DE OPCIÓN DETECTADO</span>
                    </div>
                    <p class="mt-1 text-[11px] text-amber-200/90">
                        Has cambiado de opción <strong class="text-white">${cambiosCount} veces</strong>. En el <strong class="text-emerald-300">78% de los reactivos evaluados</strong>, el primer instinto del estudiante era el correcto. ¡Verifica la premisa antes de dudar!
                    </p>
                </div>
            `);
        }
    }

    function mostrarAlertaFatiga(segs) {
        let alertEl = document.getElementById('cardAlertaIRDFatiga');
        if (!alertEl) {
            const container = document.getElementById('preunContainerPreguntaActive') || 
                              document.getElementById('uiPregunta') || 
                              document.body;
            container.insertAdjacentHTML('beforeend', `
                <div id="cardAlertaIRDFatiga" class="mt-3 p-3 bg-indigo-950/90 border border-cyan-400/50 rounded-xl text-xs font-mono text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <div class="flex items-center gap-2 font-bold uppercase text-[11px] text-cyan-300">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>⏱️ IRD TELEMETRY :: ALERTA DE FATIGA COGNITIVA O BLOQUEO</span>
                    </div>
                    <p class="mt-1 text-[11px] text-slate-300">
                        Llevas <strong class="text-cyan-300">${segs}s</strong> en este reactivo. En las pruebas de admisión, destinar más de 2 minutos sin descartar genera fatiga. Realiza una respiración de 5 segundos, focaliza la pregunta y descarta 2 opciones extremas.
                    </p>
                </div>
            `);
        }
    }

    function mostrarAlertaAdivinacionRapida(segs) {
        let alertEl = document.getElementById('cardAlertaIRDAdivinacion');
        if (!alertEl) {
            const container = document.getElementById('uiPregunta') || document.body;
            container.insertAdjacentHTML('beforeend', `
                <div id="cardAlertaIRDAdivinacion" class="mt-3 p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs font-mono text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                    <div class="flex items-center gap-2 font-bold uppercase text-[11px] text-rose-300">
                        <span>⚡ ADIVINACIÓN RÁPIDA DETECTADA (${segs}s)</span>
                    </div>
                    <p class="mt-1 text-[11px] text-slate-200">
                        Respuesta emitida sin lectura suficiente. En el modelo IRT 3PL, la impulsividad degrada la estimación psicométrica. Tómate al menos 10s para validar.
                    </p>
                </div>
            `);
            setTimeout(() => {
                const el = document.getElementById('cardAlertaIRDAdivinacion');
                if (el) el.remove();
            }, 6000);
        }
    }

    function ocultarAlerta() {
        const alertEl = document.getElementById('cardAlertaIRDMetacognitiva');
        if (alertEl) alertEl.remove();
    }

    function ocultarAlertaFatiga() {
        if (timerFatigaCheck) clearInterval(timerFatigaCheck);
        const alertEl = document.getElementById('cardAlertaIRDFatiga');
        if (alertEl) alertEl.remove();
    }

    function evaluarLatenciaActual() {
        const latenciaMs = Date.now() - tiempoInicio;
        const latenciaSegundos = latenciaMs / 1000;
        if (latenciaSegundos < 3.5) {
            mostrarAlertaAdivinacionRapida(latenciaSegundos.toFixed(1));
            return { esAdivinacionRapida: true, latenciaSegundos };
        }
        return { esAdivinacionRapida: false, latenciaSegundos };
    }

    async function enviarTelemetriaFinal(studentId, esCorrecta) {
        ocultarAlertaFatiga();
        const latenciaMs = Date.now() - tiempoInicio;
        evaluarLatenciaActual();
        try {
            const resp = await fetch('/api/preun/telemetria-ird', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    latenciaMs,
                    vacilaciones: vacilacionesCount,
                    cambioOpciones: cambiosCount,
                    esCorrecta
                })
            });
            const data = await resp.json();
            return data;
        } catch (e) {
            console.error("Error enviando telemetría IRD:", e);
        }
    }

    return {
        resetear,
        registrarPulsacionOpcion,
        evaluarLatenciaActual,
        enviarTelemetriaFinal
    };
})();
