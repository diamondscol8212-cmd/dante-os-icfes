// public/js/convenio.js - Gestor del Modal de Convenio Colegio (B2B Simplificado)
// Dante OS v23.1.0-ENTERPRISE

class ConvenioManager {
    static abrirModal(tabInicial = 'estudiante') {
        let modal = document.getElementById('modalConvenioColegio');
        if (!modal) {
            this.inyectarmodalHTML();
            modal = document.getElementById('modalConvenioColegio');
        }
        if (modal) {
            modal.style.display = 'flex';
            this.activarPestana(tabInicial);
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalConvenioColegio');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static activarPestana(tab) {
        const btnTabEst = document.getElementById('tabConvenioEstudianteBtn');
        const btnTabDirectivo = document.getElementById('tabConvenioDirectivoBtn');
        const contentEst = document.getElementById('contentConvenioEstudiante');
        const contentDirectivo = document.getElementById('contentConvenioDirectivo');

        if (tab === 'estudiante') {
            if (btnTabEst) btnTabEst.className = "flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow transition-all";
            if (btnTabDirectivo) btnTabDirectivo.className = "flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white transition-all";
            if (contentEst) contentEst.classList.remove('hidden');
            if (contentDirectivo) contentDirectivo.classList.add('hidden');
        } else {
            if (btnTabDirectivo) btnTabDirectivo.className = "flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow transition-all";
            if (btnTabEst) btnTabEst.className = "flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white transition-all";
            if (contentDirectivo) contentDirectivo.classList.remove('hidden');
            if (contentEst) contentEst.classList.add('hidden');
        }
    }

    static procesarAccesoEstudiante(event) {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();

        const docEl = document.getElementById('txtConvenioDoc');
        const codeEl = document.getElementById('txtConvenioCode');
        const msgEl = document.getElementById('uiConvenioEstudianteMsg');

        const docVal = docEl ? docEl.value.trim() : '';
        const codeVal = codeEl ? codeEl.value.trim().toUpperCase() : '';

        if (!docVal || !codeVal) {
            if (msgEl) {
                msgEl.className = "p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold mb-3";
                msgEl.innerText = "⚠️ Por favor ingresa tanto tu Documento como el Código de Colegio.";
                msgEl.classList.remove('hidden');
            }
            return;
        }

        // Asignación del plan B2B_School con Vidas Ilimitadas y Sesión
        const studentClean = docVal.toLowerCase().replace(/[^a-z0-9]/g, '');
        const colegioClean = codeVal.replace(/[^A-Z0-9_-]/g, '');

        const b2bUser = {
            email: `${studentClean}@${colegioClean.toLowerCase()}.edu.co`,
            document_id: docVal,
            institution_id: colegioClean,
            role: 'estudiante',
            estudiante: studentClean,
            plan: 'B2B_School',
            onboarding_completed: true,
            arquetipo: 'Estratega de Convenio B2B'
        };

        if (typeof DanteStorage !== 'undefined') {
            DanteStorage.set('dante_user', b2bUser);
            DanteStorage.set('dante_plan', 'B2B_School');
            DanteStorage.set('dante_user_plan', 'B2B_School');
            DanteStorage.set('dante_pacto_tiempo', '45_PRO');
            DanteStorage.set('dante_active_student', studentClean);
            DanteStorage.set('dante_onboarding_completed', 'true');
        } else {
            localStorage.setItem('dante_user', JSON.stringify(b2bUser));
            localStorage.setItem('dante_plan', 'B2B_School');
            localStorage.setItem('dante_user_plan', 'B2B_School');
            localStorage.setItem('dante_pacto_tiempo', '45_PRO');
            localStorage.setItem('dante_active_student', studentClean);
            localStorage.setItem('dante_onboarding_completed', 'true');
        }

        if (msgEl) {
            msgEl.className = "p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold mb-3";
            msgEl.innerHTML = `✅ ¡Convenio Verificado! Código <strong>${colegioClean}</strong> validado. Redirigiendo...`;
            msgEl.classList.remove('hidden');
        }

        setTimeout(() => {
            window.location.href = '/index.html';
        }, 900);
    }

    static abrirWhatsAppAsesor() {
        const mensaje = encodeURIComponent("Hola, soy directivo docente y quiero información de Dante OS para mi colegio");
        const url = `https://wa.me/573000000000?text=${mensaje}`;
        window.open(url, '_blank');
    }

    static inyectarmodalHTML() {
        if (document.getElementById('modalConvenioColegio')) return;

        const modalDiv = document.createElement('div');
        modalDiv.id = 'modalConvenioColegio';
        modalDiv.className = 'modal-overlay';
        modalDiv.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); z-index: 99999; display: none; align-items: center; justify-content: center; padding: 16px;';

        modalDiv.innerHTML = `
            <div class="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 max-w-lg w-full text-left shadow-2xl shadow-cyan-500/20 relative font-sans">
                <!-- CABECERA DE MODAL -->
                <div class="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                            <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 20H21M4 17H20M12 3L3 8H21L12 3Z"/><line x1="6" y1="8" x2="6" y2="17"/><line x1="10" y1="8" x2="10" y2="17"/><line x1="14" y1="8" x2="14" y2="17"/><line x1="18" y1="8" x2="18" y2="17"/></svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-extrabold text-white uppercase tracking-wider font-mono">Convenio e Impacto Institucional</h3>
                            <p class="text-[11px] text-slate-400 font-sans">Acceso para colegios asociados o solicitud de alianza B2B</p>
                        </div>
                    </div>
                    <button type="button" onclick="ConvenioManager.cerrarModal()" class="text-slate-400 hover:text-white text-xl p-1 font-bold cursor-pointer transition">&times;</button>
                </div>

                <!-- SELECTOR DE PESTAÑAS -->
                <div class="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
                    <button type="button" id="tabConvenioEstudianteBtn" onclick="ConvenioManager.activarPestana('estudiante')" class="flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 transition-all cursor-pointer flex items-center justify-center gap-2">
                        <svg class="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        <span>Estudiante con Convenio</span>
                    </button>
                    <button type="button" id="tabConvenioDirectivoBtn" onclick="ConvenioManager.activarPestana('directivo')" class="flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-bold bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2">
                        <svg class="w-3.5 h-3.5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 20H21M4 17H20M12 3L3 8H21L12 3Z"/><line x1="6" y1="8" x2="6" y2="17"/><line x1="10" y1="8" x2="10" y2="17"/><line x1="14" y1="8" x2="14" y2="17"/><line x1="18" y1="8" x2="18" y2="17"/></svg>
                        <span>Rector / Directivo</span>
                    </button>
                </div>

                <!-- CONTENIDO PESTAÑA A: ESTUDIANTE CON CONVENIO -->
                <div id="contentConvenioEstudiante" class="space-y-4">
                    <div id="uiConvenioEstudianteMsg" class="hidden"></div>

                    <p class="text-xs text-slate-300 leading-relaxed font-sans">
                        Si tu colegio tiene convenio activo con <strong>Dante OS</strong>, ingresa tu documento y código institucional para habilitar tu <strong>Pase B2B Institucional</strong>.
                    </p>

                    <form onsubmit="ConvenioManager.procesarAccesoEstudiante(event)" class="space-y-3.5 font-mono text-xs">
                        <div>
                            <label class="block text-[11px] font-bold text-cyan-300 uppercase mb-1">1. Documento de Identidad (TI / CC)</label>
                            <input type="text" id="txtConvenioDoc" placeholder="Ej. 1018239482" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 transition font-mono">
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold text-cyan-300 uppercase mb-1">2. Código Único de Colegio</label>
                            <input type="text" id="txtConvenioCode" placeholder="Ej. COL-2026-BOG" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 uppercase font-bold focus:outline-none focus:border-amber-400 transition font-mono">
                        </div>

                        <button type="submit" class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg shadow-cyan-500/20 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span>Activar Acceso Convenio Institucional</span>
                        </button>
                    </form>
                </div>

                <!-- CONTENIDO PESTAÑA B: RECTOR / DIRECTIVO / DOCENTE -->
                <div id="contentConvenioDirectivo" class="space-y-4 hidden font-sans">
                    <div class="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                            <h4 class="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">Potencia el rendimiento Saber 11º de tu Colegio</h4>
                        </div>
                        <ul class="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed font-sans">
                            <li><strong>Simulacros Adaptativos 3PL IRT:</strong> Diagnósticos precisos por sub-competencias y componentes ICFES.</li>
                            <li><strong>Consola de Gestión Rectores & Docentes:</strong> Reportes ejecutivos, mapas de calor por grupo y alertas tempranas.</li>
                            <li><strong>Generación de Pruebas Personalizadas:</strong> Banco de reactivos alineado al marco conceptual oficial ICFES.</li>
                        </ul>
                    </div>

                    <button type="button" onclick="ConvenioManager.abrirWhatsAppAsesor()" class="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono font-black text-xs uppercase rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2C6.486 2 2 6.479 2 12.006c0 1.91.535 3.694 1.464 5.215L2 22l4.908-1.428A9.957 9.957 0 0012.012 22c5.525 0 10.012-4.479 10.012-10.006A10.01 10.01 0 0012.012 2zM12.012 20.312c-1.636 0-3.181-.444-4.52-1.222l-.323-.187-2.92.848.86-2.825-.205-.328A8.283 8.283 0 013.688 12.006c0-4.588 3.734-8.32 8.324-8.32 4.589 0 8.324 3.732 8.324 8.32 0 4.589-3.735 8.306-8.324 8.306z"/></svg>
                        <span>Solicitar Demo y Asesor Personalizado</span>
                    </button>
                </div>

                <!-- PIE DE MODAL -->
                <div class="mt-5 pt-3 border-t border-slate-800 text-right">
                    <button type="button" onclick="ConvenioManager.cerrarModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition cursor-pointer">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);
    }
}

// Inicialización global
if (typeof window !== 'undefined') {
    window.ConvenioManager = ConvenioManager;
}
