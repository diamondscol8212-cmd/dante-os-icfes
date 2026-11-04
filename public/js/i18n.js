// public/js/i18n.js - Internationalization Engine (i18n) for Bilingual Schools & Dante OS
// Supports Spanish (es) & English (en) with live DOM translation & persistence

(function(window) {
    'use strict';

    const STORAGE_KEY = 'dante_lang';

    const DICTIONARY = {
        es: {
            // General HUD & Navbar
            "app.title": "Dante OS v23.1 - Enterprise Edition // Suite de Gobernanza Rectoral",
            "hud.subtitle": "Gobernanza Predictiva & Simulación Estocástica",
            "hud.bilingual_mode": "Colegios Bilingües // Bilingual Mode",
            "hud.live_feed": "TELEMETRÍA EN VIVO",
            "hud.language": "Idioma / Language",

            // Navigation Tabs
            "tab.diagnostico": "DIAGNÓSTICO INSTITUCIONAL",
            "tab.aulas": "SALONES Y GRUPOS",
            "tab.alertas": "ALERTAS DESERCION",
            "tab.docentes": "AUDITORÍA DOCENTE",
            "tab.intervenciones": "⚡ INTERVENCIONES Y TUTORÍAS",
            "tab.saber11": "🏆 SABER 11 & ADMISIÓN UNAL",
            "tab.simulador": "🎰 SIMULADOR MONTE CARLO",
            "tab.dif": "⚖️ AUDITORÍA DIF / PII",
            "tab.estres": "⚡ PRUEBA DE ESTRÉS",
            "tab.certificados": "📜 CERTIFICADOS INMUTABLES",

            // KPIs
            "kpi.puntaje_global": "PUNTAJE GLOBAL PROMEDIO",
            "kpi.desviacion": "DESVIACIÓN ESTÁNDAR (σ)",
            "kpi.prob_unal": "PROBABILIDAD ADMISIÓN UNAL",
            "kpi.brecha_genero": "BRECHA DE GÉNERO (Δ)",
            "kpi.estudiantes_riesgo": "ESTUDIANTES EN RIESGO CRÍTICO",

            // DIF & Quality Audit
            "audit.title": "⚖️ AUDITORÍA DE CALIDAD PSICOMÉTRICA & SESGO ALGORÍTMICO (DIF / PII)",
            "audit.standards": "Estándares AERA / APA / NCME",
            "audit.execute_btn": "🔄 Ejecutar Auditoría",
            "audit.confiabilidad": "Confiabilidad Empírica",
            "audit.sem": "Error Estándar (SEM)",
            "audit.pii": "Auditoría PII & IDOR",
            "audit.dictamen": "Dictamen de Calidad",
            "audit.table_id": "Identificador Ofuscado",
            "audit.table_email": "Email Mascarado",
            "audit.table_theta": "Habilidad Latente θ",
            "audit.table_status": "Estado PII",

            // Stress Test & Benchmark
            "stress.title": "⚡ PRUEBAS DE ESTRÉS, CONCURRENCIA & BENCHMARK E2E (WORKER POOL)",
            "stress.processed": "Peticiones Procesadas",
            "stress.throughput": "Throughput (Ops/Seg)",
            "stress.latency": "Latencia Promedio",
            "stress.ram": "Heap RAM Delta",
            "stress.terminal_placeholder": "▶ Terminal de Benchmark en vivo lista. Seleccione una ráfaga de carga para ejecutar...",

            // Certificates
            "cert.title": "📜 REPORTE RECTORAL INSTITUCIONAL & CERTIFICACIÓN CRIPTOGRÁFICA INMUTABLE",
            "cert.generate_btn": "Generar Certificado Oficial",
            "cert.status_title": "Estado del Último Certificado Generado",
            "cert.verify_title": "Verificador Criptográfico HMAC-SHA256",
            "cert.verify_btn": "🔍 Verificar Integridad Criptográfica",
            "cert.no_cert": "No se ha generado ningún certificado en esta sesión. Haga clic en 'Generar Certificado Oficial'.",
            "cert.placeholder": "Pegue el objeto JSON del certificado para verificar su firma inmutable...",

            // Common UI Controls
            "btn.export_pdf": "📄 EXPORTAR PDF RECTORAL",
            "btn.export_excel": "📊 EXPORTAR EXCEL DE TELEMETRÍA",
            "btn.filter_all": "TODAS LAS JORNADAS",
            "btn.close": "Cerrar",
            "btn.save": "Guardar",
            "btn.apply": "Aplicar",
            "btn.cancel": "Cancelar",

            // Footer & Status
            "footer.version": "Dante OS Enterprise v23.1.0 - Motor Psicométrico Adaptativo Tri-Modelo (IRT/CAT/EAP)",
            "footer.copyright": "© 2026 Dante Systems Colombia. Todos los derechos reservados."
        },
        en: {
            // General HUD & Navbar
            "app.title": "Dante OS v23.1 - Enterprise Edition // Headmaster Governance Suite",
            "hud.subtitle": "Predictive Governance & Stochastic Simulation",
            "hud.bilingual_mode": "Bilingual Schools // English Mode Enabled",
            "hud.live_feed": "LIVE TELEMETRY",
            "hud.language": "Language / Idioma",

            // Navigation Tabs
            "tab.diagnostico": "INSTITUTIONAL DIAGNOSTICS",
            "tab.aulas": "CLASSROOMS & GROUPS",
            "tab.alertas": "DROPOUT ALERTS",
            "tab.docentes": "FACULTY AUDIT",
            "tab.intervenciones": "⚡ INTERVENTIONS & TUTORING",
            "tab.saber11": "🏆 SABER 11 & COLLEGE ADMISSIONS",
            "tab.simulador": "🎰 MONTE CARLO SIMULATOR",
            "tab.dif": "⚖️ DIF / PII QUALITY AUDIT",
            "tab.estres": "⚡ STRESS TEST & BENCHMARK",
            "tab.certificados": "📜 IMMUTABLE CERTIFICATES",

            // KPIs
            "kpi.puntaje_global": "GLOBAL AVERAGE SCORE",
            "kpi.desviacion": "STANDARD DEVIATION (σ)",
            "kpi.prob_unal": "COLLEGE ADMISSION PROBABILITY",
            "kpi.brecha_genero": "GENDER GAP (Δ)",
            "kpi.estudiantes_riesgo": "HIGH-RISK STUDENTS",

            // DIF & Quality Audit
            "audit.title": "⚖️ PSYCHOMETRIC QUALITY & ALGORITHMIC BIAS AUDIT (DIF / PII)",
            "audit.standards": "AERA / APA / NCME Standards",
            "audit.execute_btn": "🔄 Run Audit",
            "audit.confiabilidad": "Empirical Reliability",
            "audit.sem": "Standard Error (SEM)",
            "audit.pii": "PII & IDOR Security Audit",
            "audit.dictamen": "Quality Assessment",
            "audit.table_id": "Obfuscated ID",
            "audit.table_email": "Masked Email",
            "audit.table_theta": "Latent Ability θ",
            "audit.table_status": "PII Status",

            // Stress Test & Benchmark
            "stress.title": "⚡ STRESS TESTING, CONCURRENCY & E2E BENCHMARK (WORKER POOL)",
            "stress.processed": "Processed Requests",
            "stress.throughput": "Throughput (Ops/Sec)",
            "stress.latency": "Average Latency",
            "stress.ram": "Heap RAM Delta",
            "stress.terminal_placeholder": "▶ Live Benchmark Terminal Ready. Select a load burst to run...",

            // Certificates
            "cert.title": "📜 INSTITUTIONAL HEADMASTER REPORT & IMMUTABLE CRYPTOGRAPHIC CERTIFICATION",
            "cert.generate_btn": "Generate Official Certificate",
            "cert.status_title": "Status of Last Issued Certificate",
            "cert.verify_title": "HMAC-SHA256 Cryptographic Verifier",
            "cert.verify_btn": "🔍 Verify Cryptographic Integrity",
            "cert.no_cert": "No certificate generated in this session. Click 'Generate Official Certificate'.",
            "cert.placeholder": "Paste certificate JSON object here to verify its immutable signature...",

            // Common UI Controls
            "btn.export_pdf": "📄 EXPORT HEADMASTER PDF",
            "btn.export_excel": "📊 EXPORT TELEMETRY EXCEL",
            "btn.filter_all": "ALL SHIFTS",
            "btn.close": "Close",
            "btn.save": "Save",
            "btn.apply": "Apply",
            "btn.cancel": "Cancel",

            // Footer & Status
            "footer.version": "Dante OS Enterprise v23.1.0 - Tri-Model Adaptive Psychometric Engine (IRT/CAT/EAP)",
            "footer.copyright": "© 2026 Dante Systems Colombia. All rights reserved."
        }
    };

    class DanteI18n {
        constructor() {
            this.currentLang = this.detectLanguage();
        }

        detectLanguage() {
            try {
                // 1. Query parameter override ?lang=en
                const params = new URLSearchParams(window.location.search);
                if (params.has('lang')) {
                    const langParam = params.get('lang').toLowerCase();
                    if (DICTIONARY[langParam]) return langParam;
                }

                // 2. Local Storage
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored && DICTIONARY[stored]) {
                    return stored;
                }

                // 3. Browser language
                const navLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
                if (DICTIONARY[navLang]) {
                    return navLang;
                }
            } catch (err) {
                console.warn('⚠️ [i18n WARN] Error detecting language:', err);
            }
            return 'es'; // Default
        }

        getLanguage() {
            return this.currentLang;
        }

        setLanguage(lang) {
            if (!DICTIONARY[lang]) {
                console.warn(`⚠️ [i18n WARN] Language '${lang}' not supported. Defaulting to 'es'.`);
                lang = 'es';
            }

            this.currentLang = lang;
            try {
                localStorage.setItem(STORAGE_KEY, lang);
                document.documentElement.setAttribute('lang', lang);
            } catch (e) {
                console.warn('⚠️ [i18n WARN] Could not save language preference:', e);
            }

            this.translateDOM();
            this.updateLanguageControls();

            // Dispatch global event for components
            window.dispatchEvent(new CustomEvent('dante-lang-changed', {
                detail: { lang, dictionary: DICTIONARY[lang] }
            }));

            console.log(`🌐 [DANTE i18n] Language switched to: ${lang.toUpperCase()}`);
        }

        toggleLanguage() {
            const nextLang = this.currentLang === 'es' ? 'en' : 'es';
            this.setLanguage(nextLang);
            return nextLang;
        }

        t(key, fallback = '') {
            const dict = DICTIONARY[this.currentLang] || DICTIONARY['es'];
            if (dict && dict[key] !== undefined) {
                return dict[key];
            }
            const fallbackDict = DICTIONARY['es'];
            return fallbackDict[key] !== undefined ? fallbackDict[key] : (fallback || key);
        }

        translateDOM() {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translated = this.t(key);
                if (translated) {
                    // Preserve icon if present
                    const icon = el.querySelector('i');
                    if (icon) {
                        el.childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node.textContent = ' ' + translated + ' ';
                            }
                        });
                    } else {
                        el.innerText = translated;
                    }
                }
            });

            // Translate placeholders
            const phElements = document.querySelectorAll('[data-i18n-ph]');
            phElements.forEach(el => {
                const key = el.getAttribute('data-i18n-ph');
                const translated = this.t(key);
                if (translated) {
                    el.setAttribute('placeholder', translated);
                }
            });

            // Translate title attributes
            const titleElements = document.querySelectorAll('[data-i18n-title]');
            titleElements.forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                const translated = this.t(key);
                if (translated) {
                    el.setAttribute('title', translated);
                }
            });
        }

        updateLanguageControls() {
            const toggles = document.querySelectorAll('.dante-lang-toggle-btn');
            toggles.forEach(btn => {
                if (this.currentLang === 'en') {
                    btn.innerHTML = `🇺🇸 <span class="font-bold">EN</span> / ES`;
                    btn.setAttribute('title', 'Switch to Spanish / Cambiar a Español');
                } else {
                    btn.innerHTML = `🇪🇸 <span class="font-bold">ES</span> / EN`;
                    btn.setAttribute('title', 'Switch to English / Cambiar a Inglés');
                }
            });
        }

        init() {
            document.addEventListener('DOMContentLoaded', () => {
                this.translateDOM();
                this.updateLanguageControls();
            });
            // Immediate translation if DOM already loaded
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                this.translateDOM();
                this.updateLanguageControls();
            }
        }
    }

    const instance = new DanteI18n();
    instance.init();

    window.DanteI18n = instance;
})(window);
