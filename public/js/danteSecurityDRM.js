/**
 * ==========================================================================
 * DANTE OS ENTERPRISE v23.1 - DRIVER DE BLINDAJE IP, ANTI-COPIA & DRM (CAPA 1)
 * Auditoría ISO/IEC 25010 & CMMI Nivel 5 (Optimizing)
 * ==========================================================================
 */

(function () {
    'use strict';

    const DanteSecurityDRM = {
        studentId: 'estudiante_anonimo',
        tenantId: 'colegio_sandbox_default',
        isExamActive: true,
        blurCount: 0,
        watermarkCanvas: null,

        init: function (config = {}) {
            this.studentId = config.studentId || localStorage.getItem('dante_student_name') || AppState?.estudiante || 'estudiante_demo';
            this.tenantId = config.tenantId || 'colegio_sandbox_default';
            
            console.log("🛡️ [DANTE OS DRM]: Inicializando Blindaje Perimetral IP (ISO 25010 / CMMI-5)...");

            this.applyCSSProtection();
            this.setupEventListeners();
            this.renderDynamicWatermark();
            this.setupVisibilityMonitoring();
            this.setupDevToolsTraps();
        },

        // 1. Inyección de Reglas CSS Anti-Selección y Anti-Impresión
        applyCSSProtection: function () {
            document.body.classList.add('dante-secure-exam', 'exam-mode');
            
            const style = document.createElement('style');
            style.id = 'dante-drm-styles';
            style.textContent = `
                .dante-secure-exam, body.exam-mode {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                    -webkit-touch-callout: none !important;
                }
                
                @media print {
                    body.exam-mode, .dante-secure-exam, #app, main, header, div {
                        display: none !important;
                    }
                    body::after {
                        content: "⚠️ CONTENIDO PROTEGIDO POR DANTE OS ENTERPRISE (IP DRM) - IMPRESIÓN BLOQUEADA";
                        display: block !important;
                        font-size: 22pt;
                        font-weight: bold;
                        color: #ef4444;
                        text-align: center;
                        padding: 100px 20px;
                        font-family: sans-serif;
                    }
                }
            `;
            if (!document.getElementById('dante-drm-styles')) {
                document.head.appendChild(style);
            }
        },

        // 2. Bloqueo de Eventos de Copia, Menú Contextual e Inspección
        setupEventListeners: function () {
            // Anti Click Derecho
            document.addEventListener('contextmenu', (e) => {
                const target = e.target;
                const isDiagnosticLaunch = window.location.search.includes('launch=diagnostic') || sessionStorage.getItem('dante_is_diagnostic') === 'true';
                const isHoldButtonOrCanvas = target && target.closest && (
                    target.closest('#btnIniciarMisionUnificado') ||
                    target.closest('#danteSpiralCanvas') ||
                    target.closest('.step-option') ||
                    target.closest('#modalPactoDante') ||
                    target.closest('#btnPactoOdiseoHold') ||
                    target.closest('#btnOdysseusSeal') ||
                    target.closest('#modalOdysseusContract') ||
                    target.closest('.haptic-progress-ring')
                );

                if (isHoldButtonOrCanvas || window._isHoldingPactoButton || isDiagnosticLaunch) {
                    // Pulsación larga en botones de compromiso, modal de odiseo o espiral: prevenir menú nativo en silencio
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                e.preventDefault();
                this.notifySecurityViolation("Menú contextual restringido en modo evaluación.");
                return false;
            }, true);

            // Anti Seleccionar Texto & Drag
            document.addEventListener('selectstart', (e) => {
                if (this.isExamActive) e.preventDefault();
            }, true);

            document.addEventListener('dragstart', (e) => {
                if (this.isExamActive) e.preventDefault();
            }, true);

            // Anti Atajos de Teclado (Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, F12, Ctrl+Shift+I/J/C)
            document.addEventListener('keydown', (e) => {
                const key = e.key ? e.key.toLowerCase() : '';
                const isCtrlOrCmd = e.ctrlKey || e.metaKey;

                if (isCtrlOrCmd && ['c', 'u', 's', 'p', 'a', 'x', 'v'].includes(key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.notifySecurityViolation(`Atajo de teclado restringido [Ctrl+${key.toUpperCase()}].`);
                    return false;
                }

                if (e.key === 'F12' || (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c', 'k', 's'].includes(key))) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.notifySecurityViolation("Acceso a Inspector de Código / DevTools restringido.");
                    return false;
                }
            }, true);

            // Anti Impresión (beforeprint)
            window.addEventListener('beforeprint', () => {
                this.notifySecurityViolation("Intento de impresión de pantalla detectado.");
            });
        },

        // 3. Marca de Agua Esteganográfica Dinámica (Estudiante, IP, Timestamp)
        renderDynamicWatermark: function () {
            if (document.getElementById('dante-watermark-canvas')) return;

            const canvas = document.createElement('canvas');
            canvas.id = 'dante-watermark-canvas';
            canvas.className = 'dante-watermark-overlay';
            
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.opacity = '0.035';

            document.body.appendChild(canvas);
            this.watermarkCanvas = canvas;

            const draw = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '14px JetBrains Mono, sans-serif';
                ctx.fillStyle = '#f59e0b';
                ctx.rotate(-20 * Math.PI / 180);

                const timestamp = new Date().toISOString().substring(0, 16).replace('T', ' ');
                const text = `DANTE OS DRM // ${this.studentId} // ${this.tenantId} // ${timestamp}`;

                const stepX = 350;
                const stepY = 120;

                for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
                    for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
                        ctx.fillText(text, x, y);
                    }
                }
            };

            draw();
            window.addEventListener('resize', draw);
        },

        // 4. Monitoreo de Visibilidad y Cambio de Pestañas
        setupVisibilityMonitoring: function () {
            const handleBlurOrHide = () => {
                if (!this.isExamActive) return;
                this.blurCount++;

                const payload = {
                    studentId: this.studentId,
                    tenantId: this.tenantId,
                    evento: 'PERDIDA_DE_FOCO_EXAMEN',
                    blurCount: this.blurCount,
                    timestamp: new Date().toISOString()
                };

                console.warn(`🚨 [DANTE DRM ALERTA]: Pérdida de foco #${this.blurCount} detectada.`);

                this.notifySecurityViolation(`Pérdida de foco en examen (#${this.blurCount}). Registro de auditoría guardado.`);

                // Reportar a la telemetría del servidor
                try {
                    fetch('/api/cat/neuro/telemetry', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: this.studentId,
                            tipo_evento: 'SOSPECHA_CAMBIO_PESTAÑA',
                            metadatos: payload
                        })
                    }).catch(() => {});
                } catch (e) {}
            };

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) handleBlurOrHide();
            });

            window.addEventListener('blur', () => {
                handleBlurOrHide();
            });
        },

        // 5. Trampas Heurísticas para DevTools / Depuración Externa
        setupDevToolsTraps: function () {
            setInterval(() => {
                const threshold = 160;
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;

                if (widthThreshold || heightThreshold) {
                    this.notifySecurityViolation("Inspección activa de ventana detectada.");
                }
            }, 3000);
        },

        // Notificación flotante de violación de seguridad en cliente (Toast Superior Flotante No Invasivo)
        notifySecurityViolation: function (message) {
            const ahora = Date.now();
            if (this._ultimoAviso && (ahora - this._ultimoAviso) < 20000) return;
            this._ultimoAviso = ahora;
            if (typeof window.mostrarNotificacionPWA === 'function') {
                window.mostrarNotificacionPWA(`🛡️ [SEGURIDAD DANTE OS]: ${message}`, 'warning');
                return;
            }

            let toast = document.getElementById('dante-security-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'dante-security-toast';
                toast.style.position = 'fixed';
                toast.style.top = '20px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
                toast.style.color = '#f59e0b';
                toast.style.padding = '10px 18px';
                toast.style.borderRadius = '12px';
                toast.style.border = '1px solid rgba(245, 158, 11, 0.5)';
                toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                toast.style.fontSize = '12px';
                toast.style.fontWeight = 'bold';
                toast.style.fontFamily = 'monospace';
                toast.style.zIndex = '100000';
                toast.style.transition = 'all 0.3s ease';
                toast.style.pointerEvents = 'none';
                document.body.appendChild(toast);
            }

            toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i> 🛡️ [SEGURIDAD DANTE OS]: ${message}`;
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, 0)';

            clearTimeout(this._toastTimeout);
            this._toastTimeout = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translate(-50%, -10px)';
            }, 3000);
        }
    };

    // Auto-inicialización global
    window.DanteSecurityDRM = DanteSecurityDRM;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DanteSecurityDRM.init());
    } else {
        DanteSecurityDRM.init();
    }
})();
