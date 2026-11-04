/**
 * Dante OS Enterprise - Sistema de Íconos Vectoriales Élite (Dante Cyber-Luxe Icons)
 * SVG estandarizados de alta definición con gradientes, halos de neón y estética militar-tecnológica.
 */

window.DanteVectorIcons = (function() {

    const COLOR_MAPS = {
        cyan: {
            primary: '#06b6d4',
            secondary: '#38bdf8',
            glow: 'rgba(6, 182, 212, 0.4)',
            bg: 'rgba(6, 182, 212, 0.15)',
            border: 'rgba(6, 182, 212, 0.35)'
        },
        amber: {
            primary: '#f59e0b',
            secondary: '#fbbf24',
            glow: 'rgba(245, 158, 11, 0.4)',
            bg: 'rgba(245, 158, 11, 0.15)',
            border: 'rgba(245, 158, 11, 0.35)'
        },
        emerald: {
            primary: '#10b981',
            secondary: '#34d399',
            glow: 'rgba(16, 185, 129, 0.4)',
            bg: 'rgba(16, 185, 129, 0.15)',
            border: 'rgba(16, 185, 129, 0.35)'
        },
        purple: {
            primary: '#a855f7',
            secondary: '#c084fc',
            glow: 'rgba(168, 85, 247, 0.4)',
            bg: 'rgba(168, 85, 247, 0.15)',
            border: 'rgba(168, 85, 247, 0.35)'
        },
        rose: {
            primary: '#f43f5e',
            secondary: '#fb7185',
            glow: 'rgba(244, 63, 94, 0.4)',
            bg: 'rgba(244, 63, 94, 0.15)',
            border: 'rgba(244, 63, 94, 0.35)'
        },
        sky: {
            primary: '#0ea5e9',
            secondary: '#38bdf8',
            glow: 'rgba(14, 165, 233, 0.4)',
            bg: 'rgba(14, 165, 233, 0.15)',
            border: 'rgba(14, 165, 233, 0.35)'
        }
    };

    function wrapSvg(content, size = 20, extraClass = '') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" class="inline-block shrink-0 align-middle ${extraClass}">${content}</svg>`;
    }

    return {
        // 1. CEREBRO NEURO-ICFES
        brain: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#06b6d4';
            return wrapSvg(`
                <path d="M12 4C9.5 4 7.5 5.5 7 7.5C5.5 8 4.5 9.5 4.5 11.5C4.5 13.2 5.5 14.6 7 15.3V17.5C7 18.9 8.1 20 9.5 20H10.5V14H9V12H11V8.5C11 7.1 12.1 6 13.5 6H14.5V4H12Z" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M12 4C14.5 4 16.5 5.5 17 7.5C18.5 8 19.5 9.5 19.5 11.5C19.5 13.2 18.5 14.6 17 15.3V17.5C17 18.9 15.9 20 14.5 20H13.5V14H15V12H13V8.5C13 7.1 11.9 6 10.5 6H9.5" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <circle cx="12" cy="11" r="2" fill="${color}"/>
                <circle cx="8" cy="10" r="1.2" fill="#38bdf8"/>
                <circle cx="16" cy="10" r="1.2" fill="#38bdf8"/>
                <path d="M8 10L12 11L16 10" stroke="${color}" stroke-width="1" stroke-dasharray="1 1"/>
            `, size, opts.class || '');
        },

        // 2. RETÍCULO TÁCTICO / TARGET
        target: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#06b6d4';
            return wrapSvg(`
                <circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="1.5" stroke-dasharray="14 3"/>
                <circle cx="12" cy="12" r="5" stroke="${color}" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="2" fill="${color}"/>
                <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 3. CAPACIDAD COGNITIVA / BATERÍA CIBERNÉTICA
        battery: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#06b6d4';
            return wrapSvg(`
                <rect x="2" y="6" width="17" height="12" rx="3" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6"/>
                <path d="M21 10V14" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                <rect x="5" y="9" width="2.5" height="6" rx="1" fill="${color}"/>
                <rect x="9" y="9" width="2.5" height="6" rx="1" fill="${color}"/>
                <rect x="13" y="9" width="2.5" height="6" rx="1" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 4. LLAMA ETERNA DE RACHA
        flame: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M12 2C10.5 4.5 10 6 10 7.5C10 8.5 10.5 9.5 11 10C8 10 6 12 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 12.2 16 9.8 14 9C14.5 10.5 14.2 12 13 12.5C13.5 11 13 9 12 8C11 7 11.5 5 12 2Z" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M12 12C10.8 12 10 13 10 14.5C10 16.4 11.3 18 12 18C12.7 18 14 16.4 14 14.5C14 13.5 13.2 12.5 12 12Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
            `, size, opts.class || '');
        },

        // 5. RAYO TÁCTICO / ENERGÍA
        lightning: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M13 2L4 13H11L10 22L20 10H12L13 2Z" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 6. CÁMARA HOLO-TARJETA
        camera: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M4 8C4 6.9 4.9 6 6 6H8L9.5 4H14.5L16 6H18C19.1 6 20 6.9 20 8V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V8Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <circle cx="12" cy="12.5" r="3.5" stroke="${color}" stroke-width="1.6"/>
                <circle cx="12" cy="12.5" r="1.5" fill="${color}"/>
                <circle cx="16.5" cy="9" r="0.8" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 7. CORONA ELITE PLAN PRO
        crown: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M3 18L4.5 8L8.5 12L12 5L15.5 12L19.5 8L21 18H3Z" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <line x1="3" y1="20" x2="21" y2="20" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="5" r="1" fill="#ffffff"/>
                <circle cx="4.5" cy="8" r="1" fill="#ffffff"/>
                <circle cx="19.5" cy="8" r="1" fill="#ffffff"/>
            `, size, opts.class || '');
        },

        // 8. CONTRASTE Y LENTE SOLAR
        sun: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <circle cx="12" cy="12" r="4.5" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.6"/>
                <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 9. ENGRANAJE DE PRECISIÓN B2B
        gear: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="${color}" stroke-width="1.6"/>
                <path d="M19.4 15A1.65 1.65 0 0 0 20 13.13V10.87A1.65 1.65 0 0 0 18.3 9.2L17.8 8.8A1.65 1.65 0 0 0 17.3 6.9L18.4 5.2A1.65 1.65 0 0 0 17.8 3.1L15.8 2.2A1.65 1.65 0 0 0 13.9 2.8L12.9 3.5A1.65 1.65 0 0 0 10.9 3.5L9.9 2.8A1.65 1.65 0 0 0 8 2.2L6 3.1A1.65 1.65 0 0 0 5.4 5.2L6.5 6.9A1.65 1.65 0 0 0 6 8.8L5.5 9.2A1.65 1.65 0 0 0 3.8 10.87V13.13A1.65 1.65 0 0 0 5.5 14.8L6 15.2A1.65 1.65 0 0 0 6.5 17.1L5.4 18.8A1.65 1.65 0 0 0 6 20.9L8 21.8A1.65 1.65 0 0 0 9.9 21.2L10.9 20.5A1.65 1.65 0 0 0 12.9 20.5L13.9 21.2A1.65 1.65 0 0 0 15.8 21.8L17.8 20.9A1.65 1.65 0 0 0 18.4 18.8L17.3 17.1A1.65 1.65 0 0 0 17.8 15.2L18.3 14.8Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="1.5" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 10. EXAMEN / SIMULACRO COMPLETO
        clipboard: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#06b6d4';
            return wrapSvg(`
                <rect x="5" y="4" width="14" height="17" rx="2.5" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6"/>
                <path d="M9 3C9 2.4 9.4 2 10 2H14C14.6 2 15 2.4 15 3V5H9V3Z" fill="${color}" stroke="${color}" stroke-width="1"/>
                <path d="M8 10L10.5 12.5L16 7" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="16" x2="16" y2="16" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 11. TUTOR IA GEMINI / ROBOT SOCRÁTICO
        robot: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#a855f7';
            return wrapSvg(`
                <rect x="4" y="8" width="16" height="12" rx="3" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6"/>
                <circle cx="9" cy="13" r="2" fill="#c084fc"/>
                <circle cx="15" cy="13" r="2" fill="#c084fc"/>
                <path d="M10 17H14" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 3V8M8 3H16" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="12" cy="3" r="1.2" fill="${color}"/>
                <path d="M2 12H4M20 12H22" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 12. ANÁLISIS & METRICAS / RADAR IRT
        radar: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#10b981';
            return wrapSvg(`
                <path d="M3 19V5M3 19H19" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M6 15L10 10L14 13L20 6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="6" cy="15" r="1.5" fill="#34d399"/>
                <circle cx="10" cy="10" r="1.5" fill="#34d399"/>
                <circle cx="14" cy="13" r="1.5" fill="#34d399"/>
                <circle cx="20" cy="6" r="2" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 13. MATEMÁTICAS / SIGMA & RAÍZ
        math: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#10b981';
            return wrapSvg(`
                <path d="M4 12L7 11L10 18L15 6H20" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6H12" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="17.5" cy="14" r="2" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 14. LECTURA CRÍTICA / LEXICÓN
        book: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M4 19.5C4 18.1 5.1 17 6.5 17H20V4H6.5C5.1 4 4 5.1 4 6.5V19.5Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M4 19.5C4 20.9 5.1 22 6.5 22H20V17" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <line x1="8" y1="8" x2="16" y2="8" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="8" y1="12" x2="14" y2="12" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 15. CIENCIAS NATURALES / ÁTOMO Y ADN
        atom: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#06b6d4';
            return wrapSvg(`
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" stroke="${color}" stroke-width="1.5"/>
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" stroke="${color}" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="2.5" fill="${color}"/>
                <circle cx="18" cy="8.5" r="1.2" fill="#38bdf8"/>
                <circle cx="6" cy="15.5" r="1.2" fill="#38bdf8"/>
            `, size, opts.class || '');
        },

        // 16. SOCIALES Y CIUDADANAS / PILARES Y CAPITOLIO
        pillar: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#a855f7';
            return wrapSvg(`
                <path d="M3 20H21M4 17H20M12 3L3 8H21L12 3Z" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <line x1="6" y1="8" x2="6" y2="17" stroke="${color}" stroke-width="1.6"/>
                <line x1="10" y1="8" x2="10" y2="17" stroke="${color}" stroke-width="1.6"/>
                <line x1="14" y1="8" x2="14" y2="17" stroke="${color}" stroke-width="1.6"/>
                <line x1="18" y1="8" x2="18" y2="17" stroke="${color}" stroke-width="1.6"/>
            `, size, opts.class || '');
        },

        // 17. INGLÉS / ORBE GLOBAL
        globe: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#0ea5e9';
            return wrapSvg(`
                <circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="1.6"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="${color}" stroke-width="1.5"/>
                <ellipse cx="12" cy="12" rx="4" ry="9" stroke="${color}" stroke-width="1.5"/>
                <path d="M4.5 7.5H19.5M4.5 16.5H19.5" stroke="${color}" stroke-width="1" stroke-dasharray="2 2"/>
            `, size, opts.class || '');
        },

        // 18. TERMÓMETRO COGNITIVO
        thermometer: function(opts = {}) {
            const size = opts.size || 20;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M14 14.7C15.2 13.9 16 12.5 16 11C16 8.8 14.2 7 12 7C9.8 7 8 8.8 8 11C8 12.5 8.8 13.9 10 14.7V5C10 3.9 10.9 3 12 3C13.1 3 14 3.9 14 5V14.7Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <circle cx="12" cy="18" r="3.5" fill="${color}"/>
                <line x1="12" y1="9" x2="12" y2="15" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 19. CANDADO / LOCK SEGURIDAD PRO
        lock: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <rect x="5" y="11" width="14" height="10" rx="2" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6"/>
                <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 20. COHETE TÁCTICO / ROCKET
        rocket: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#06b6d4';
            return wrapSvg(`
                <path d="M4.5 16.5C3.5 13 4 9 7.5 5.5C11 2 17 2 19 2C19 4 19 10 15.5 13.5C12 17 8 17.5 4.5 16.5Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M12 15L9 18M15 12L18 9" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="14" cy="7" r="1.5" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 21. FLECHA DERECHA TÁCTICA
        arrowRight: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#38bdf8';
            return wrapSvg(`
                <path d="M5 12H19M13 5L20 12L13 19" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `, size, opts.class || '');
        },

        // 22. ALTAVOZ / VOZ DE DANTE
        speaker: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#38bdf8';
            return wrapSvg(`
                <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M15.5 8.5C16.8 9.8 16.8 12.2 15.5 13.5M18.5 5.5C21 8 21 14 18.5 16.5" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 23. ADVERTENCIA / ALERTA SOCRÁTICA
        warning: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M12 3L2 20H22L12 3Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="16.5" r="1" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 24. TELÉFONO MÓVIL / PAYMENTS
        phone: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#10b981';
            return wrapSvg(`
                <rect x="6" y="3" width="12" height="18" rx="2.5" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6"/>
                <line x1="10" y1="6" x2="14" y2="6" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="12" cy="18" r="1" fill="${color}"/>
            `, size, opts.class || '');
        },

        // 25. CAPITOLIO / UNIVERSIDAD / BANCO
        building: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#38bdf8';
            return wrapSvg(`
                <path d="M3 21H21M4 18H20M12 3L3 8H21L12 3Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <line x1="6" y1="9" x2="6" y2="17" stroke="${color}" stroke-width="1.6"/>
                <line x1="10" y1="9" x2="10" y2="17" stroke="${color}" stroke-width="1.6"/>
                <line x1="14" y1="9" x2="14" y2="17" stroke="${color}" stroke-width="1.6"/>
                <line x1="18" y1="9" x2="18" y2="17" stroke="${color}" stroke-width="1.6"/>
            `, size, opts.class || '');
        },

        // 26. ESCUDO DE RESGUARDO
        shield: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#10b981';
            return wrapSvg(`
                <path d="M12 3L4 6V11C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11V6L12 3Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M9 12L11 14L15 9" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `, size, opts.class || '');
        },

        // 27. RELOJ / STOPWATCH / RECARGA
        clock: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <circle cx="12" cy="13" r="8" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6"/>
                <path d="M12 9V13L15 15" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M10 3H14M12 3V5" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 28. CHECKMARK VERIFICADO
        check: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#10b981';
            return wrapSvg(`
                <circle cx="12" cy="12" r="9" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6"/>
                <path d="M8 12L11 15L16 9" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `, size, opts.class || '');
        },

        // 29. TROFEO PASE ELITE
        trophy: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f59e0b';
            return wrapSvg(`
                <path d="M6 4H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V4Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6"/>
                <path d="M6 6H3V9C3 10.7 4.3 12 6 12M18 6H21V9C21 10.7 19.7 12 18 12" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 16V19M8 21H16" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 30. CALENDARIO PAGO
        calendar: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#38bdf8';
            return wrapSvg(`
                <rect x="3" y="5" width="18" height="15" rx="2.5" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.6"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="${color}" stroke-width="1.5"/>
                <line x1="8" y1="3" x2="8" y2="6" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="16" y1="3" x2="16" y2="6" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 31. TIJERAS / TACHAR DISTRACTOR
        scissors: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#f43f5e';
            return wrapSvg(`
                <circle cx="6" cy="6" r="3" stroke="${color}" stroke-width="1.5"/>
                <circle cx="6" cy="18" r="3" stroke="${color}" stroke-width="1.5"/>
                <line x1="8.5" y1="8" x2="19" y2="17" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
                <line x1="8.5" y1="16" x2="19" y2="7" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 32. USUARIO / ASPIRANTE AVATAR
        user: function(opts = {}) {
            const size = opts.size || 18;
            const color = opts.color || '#a855f7';
            return wrapSvg(`
                <circle cx="12" cy="8" r="4" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.6"/>
                <path d="M5 20C5 16.1 8.1 13 12 13C15.9 13 19 16.1 19 20" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
            `, size, opts.class || '');
        },

        // 33. LOGO HD OFICIAL SELLO PRE-UNAL (Verde Esmeralda & Oro Imperial) 🏛️
        logoUNAL: function(opts = {}) {
            const size = opts.size || 42;
            const extraClass = opts.class || '';
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="inline-block shrink-0 align-middle ${extraClass}">
                <defs>
                    <linearGradient id="gradUnalGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="50%" stop-color="#eab308"/>
                        <stop offset="100%" stop-color="#ca8a04"/>
                    </linearGradient>
                    <linearGradient id="gradUnalEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#34d399"/>
                        <stop offset="50%" stop-color="#10b981"/>
                        <stop offset="100%" stop-color="#047857"/>
                    </linearGradient>
                    <filter id="glowUnal" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                <!-- Anillo Exterior Dorado de Laurel Imperial -->
                <circle cx="50" cy="50" r="45" fill="#022c22" stroke="url(#gradUnalGold)" stroke-width="3" filter="url(#glowUnal)"/>
                <circle cx="50" cy="50" r="40" fill="url(#gradUnalEmerald)" fill-opacity="0.22" stroke="#059669" stroke-width="1.5" stroke-dasharray="6 3"/>
                <!-- Frontón Capitolio Griego / Templo del Saber -->
                <path d="M50 20L22 34H78L50 20Z" fill="url(#gradUnalGold)"/>
                <path d="M25 34H75V37H25V34Z" fill="#fef08a"/>
                <!-- Columnas Jonicas -->
                <line x1="30" y1="37" x2="30" y2="65" stroke="url(#gradUnalGold)" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="43" y1="37" x2="43" y2="65" stroke="url(#gradUnalGold)" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="57" y1="37" x2="57" y2="65" stroke="url(#gradUnalGold)" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="70" y1="37" x2="70" y2="65" stroke="url(#gradUnalGold)" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Base e Podio -->
                <path d="M22 65H78V70H22V65Z" fill="url(#gradUnalGold)"/>
                <!-- Estrella Radiante del Saber UNAL -->
                <path d="M50 72L52 77L57 77L53 80L55 85L50 82L45 85L47 80L43 77L48 77Z" fill="#fef08a"/>
                <!-- Laurel de la Victoria Estilizado -->
                <path d="M15 50C15 68 28 80 40 83M85 50C85 68 72 80 60 83" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 3"/>
            </svg>`;
        },

        // 34. LOGO HD OFICIAL SELLO PRE-UDEA (Búho Cobalto & Plata) 🦉
        logoUdeA: function(opts = {}) {
            const size = opts.size || 42;
            const extraClass = opts.class || '';
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="inline-block shrink-0 align-middle ${extraClass}">
                <defs>
                    <linearGradient id="gradUdeaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#60a5fa"/>
                        <stop offset="50%" stop-color="#2563eb"/>
                        <stop offset="100%" stop-color="#1e3a8a"/>
                    </linearGradient>
                    <linearGradient id="gradUdeaSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffffff"/>
                        <stop offset="50%" stop-color="#cbd5e1"/>
                        <stop offset="100%" stop-color="#64748b"/>
                    </linearGradient>
                    <filter id="glowUdea" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                <!-- Anillo Exterior Cobalto & Plata -->
                <circle cx="50" cy="50" r="45" fill="#0f172a" stroke="url(#gradUdeaSilver)" stroke-width="3" filter="url(#glowUdea)"/>
                <circle cx="50" cy="50" r="40" fill="url(#gradUdeaBlue)" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>
                <!-- Búho Sabio de Minerva (Vector Escultura UdeA) -->
                <!-- Orejas / Plumaje Superior -->
                <path d="M32 28L42 38H58L68 28L62 44C62 44 72 50 72 65C72 78 62 82 50 82C38 82 28 78 28 65C28 50 38 44 38 44L32 28Z" fill="url(#gradUdeaBlue)" stroke="url(#gradUdeaSilver)" stroke-width="2"/>
                <!-- Ojos Grandes de Búho -->
                <circle cx="41" cy="52" r="9" fill="#0284c7" stroke="url(#gradUdeaSilver)" stroke-width="2"/>
                <circle cx="59" cy="52" r="9" fill="#0284c7" stroke="url(#gradUdeaSilver)" stroke-width="2"/>
                <circle cx="41" cy="52" r="4" fill="#ffffff"/>
                <circle cx="59" cy="52" r="4" fill="#ffffff"/>
                <circle cx="42" cy="51" r="1.5" fill="#0f172a"/>
                <circle cx="60" cy="51" r="1.5" fill="#0f172a"/>
                <!-- Pico Afilado -->
                <path d="M50 56L46 64L50 67L54 64L50 56Z" fill="url(#gradUdeaSilver)"/>
                <!-- Pecho / Plumaje Académico -->
                <path d="M43 70C46 72 54 72 57 70M40 75C46 78 54 78 60 75" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
                <!-- Libro Sagrado bajo las Garras -->
                <path d="M26 84C38 80 50 84 50 84C50 84 62 80 74 84V88C62 84 50 88 50 88C50 88 38 84 26 88V84Z" fill="url(#gradUdeaSilver)"/>
            </svg>`;
        },

        // 35. LOGO HD OFICIAL SELLO ICFES SABER 11° (Azul Rey & Sol Radiante) 🎓
        logoICFES: function(opts = {}) {
            const size = opts.size || 42;
            const extraClass = opts.class || '';
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" class="inline-block shrink-0 align-middle ${extraClass}">
                <defs>
                    <linearGradient id="gradIcfesCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#38bdf8"/>
                        <stop offset="50%" stop-color="#0284c7"/>
                        <stop offset="100%" stop-color="#0369a1"/>
                    </linearGradient>
                    <linearGradient id="gradIcfesAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fef08a"/>
                        <stop offset="50%" stop-color="#f59e0b"/>
                        <stop offset="100%" stop-color="#b45309"/>
                    </linearGradient>
                    <filter id="glowIcfes" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                </defs>
                <!-- Anillo Exterior Azul Rey & Borde Dorado -->
                <circle cx="50" cy="50" r="45" fill="#082f49" stroke="url(#gradIcfesAmber)" stroke-width="3" filter="url(#glowIcfes)"/>
                <circle cx="50" cy="50" r="40" fill="url(#gradIcfesCyan)" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5"/>
                <!-- Sol Radiante de la Sabiduría de 8 Puntas -->
                <path d="M50 15L53 25L63 18L60 28L70 28L63 35L72 40L63 43L70 51L59 49L61 60L52 54L50 65L48 54L39 60L41 49L30 51L37 43L28 40L37 35L30 28L40 28L37 18L47 25Z" fill="url(#gradIcfesAmber)" fill-opacity="0.35"/>
                <!-- Birrete Académico de Graduación Imperial -->
                <path d="M50 28L18 42L50 56L82 42L50 28Z" fill="url(#gradIcfesCyan)" stroke="url(#gradIcfesAmber)" stroke-width="2.5" stroke-linejoin="round"/>
                <path d="M30 50V68C30 74 40 78 50 78C60 78 70 74 70 68V50" fill="url(#gradIcfesCyan)" stroke="#38bdf8" stroke-width="2"/>
                <!-- Borla de Oro -->
                <path d="M74 44L82 58V68" stroke="url(#gradIcfesAmber)" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="82" cy="70" r="3" fill="#fef08a"/>
                <!-- Texto 11° o Laurel -->
                <path d="M42 66V73M50 66V73M58 66V73" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        },

        // 36. LOGO OFICIAL DANTE OS (Torre Tecnológica Neón & Agujas Cuánticas) 🏙️
        logoDante: function(opts = {}) {
            const size = opts.size || 40;
            const extraClass = opts.class || '';
            const uid = 'danteGlow_' + Math.random().toString(36).substring(2, 7);
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 400 400" fill="none" class="inline-block shrink-0 align-middle ${extraClass}">
                <defs>
                    <linearGradient id="${uid}Grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#1D4ED8" />
                        <stop offset="35%" stop-color="#0284C7" />
                        <stop offset="70%" stop-color="#06B6D4" />
                        <stop offset="100%" stop-color="#38BDF8" />
                    </linearGradient>
                    <filter id="${uid}Filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect width="400" height="400" fill="#0B0F17" rx="32"/>
                <g filter="url(#${uid}Filter)" transform="translate(10, 0)">
                    <!-- 1. Aguja de Telecomunicaciones (Izquierda) -->
                    <path d="M 75 320 L 85 240 L 95 320 Z" fill="url(#${uid}Grad)" />
                    <circle cx="85" cy="240" r="14" fill="url(#${uid}Grad)" />
                    <path d="M 81 240 L 83 195 L 87 195 L 89 240 Z" fill="url(#${uid}Grad)" />
                    <circle cx="85" cy="195" r="9" fill="url(#${uid}Grad)" />
                    <path d="M 83 195 L 85 140 L 87 195 Z" fill="url(#${uid}Grad)" />

                    <!-- 2. Aguja Delgada Secundaria -->
                    <path d="M 103 320 L 115 130 L 122 320 Z" fill="url(#${uid}Grad)" opacity="0.95" />

                    <!-- 3. Torre Central de Esferas (Estructura Doble Pilar) -->
                    <rect x="132" y="70" width="7" height="250" rx="3.5" fill="url(#${uid}Grad)" />
                    <rect x="165" y="70" width="7" height="250" rx="3.5" fill="url(#${uid}Grad)" />
                    <circle cx="152" cy="135" r="22" fill="url(#${uid}Grad)" />
                    <circle cx="152" cy="245" r="22" fill="url(#${uid}Grad)" />

                    <!-- 4. El Gran Triángulo Monolítico (Derecha) -->
                    <path d="M 182 85 L 295 320 L 182 320 Z" fill="url(#${uid}Grad)" />

                    <!-- 5. Línea Base Unificada (Suelo de Asentamiento) -->
                    <rect x="65" y="318" width="240" height="4" rx="2" fill="url(#${uid}Grad)" />
                </g>
            </svg>`;
        },

        spiral: function(opts = {}) {
            return this.logoDante(opts);
        },

        // LOGOTIPO COMPLETO OFICIAL: ISOTIPO + TIPOGRAFÍA DANTE OS
        logoCompleto: function(opts = {}) {
            const height = opts.height || 36;
            const extraClass = opts.class || '';
            const uid = 'danteFull_' + Math.random().toString(36).substring(2, 7);
            return `
            <span class="inline-flex items-center gap-2.5 ${extraClass}">
                <svg xmlns="http://www.w3.org/2000/svg" width="${height}" height="${height}" viewBox="0 0 400 400" fill="none" class="shrink-0">
                    <defs>
                        <linearGradient id="${uid}Grad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#1D4ED8" />
                            <stop offset="35%" stop-color="#0284C7" />
                            <stop offset="70%" stop-color="#06B6D4" />
                            <stop offset="100%" stop-color="#38BDF8" />
                        </linearGradient>
                        <filter id="${uid}Filter" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <rect width="400" height="400" fill="#0B0F17" rx="32"/>
                    <g filter="url(#${uid}Filter)" transform="translate(10, 0)">
                        <!-- 1. Aguja de Telecomunicaciones (Izquierda) -->
                        <path d="M 75 320 L 85 240 L 95 320 Z" fill="url(#${uid}Grad)" />
                        <circle cx="85" cy="240" r="14" fill="url(#${uid}Grad)" />
                        <path d="M 81 240 L 83 195 L 87 195 L 89 240 Z" fill="url(#${uid}Grad)" />
                        <circle cx="85" cy="195" r="9" fill="url(#${uid}Grad)" />
                        <path d="M 83 195 L 85 140 L 87 195 Z" fill="url(#${uid}Grad)" />

                        <!-- 2. Aguja Delgada Secundaria -->
                        <path d="M 103 320 L 115 130 L 122 320 Z" fill="url(#${uid}Grad)" opacity="0.95" />

                        <!-- 3. Torre Central de Esferas (Estructura Doble Pilar) -->
                        <rect x="132" y="70" width="7" height="250" rx="3.5" fill="url(#${uid}Grad)" />
                        <rect x="165" y="70" width="7" height="250" rx="3.5" fill="url(#${uid}Grad)" />
                        <circle cx="152" cy="135" r="22" fill="url(#${uid}Grad)" />
                        <circle cx="152" cy="245" r="22" fill="url(#${uid}Grad)" />

                        <!-- 4. El Gran Triángulo Monolítico (Derecha) -->
                        <path d="M 182 85 L 295 320 L 182 320 Z" fill="url(#${uid}Grad)" />

                        <!-- 5. Línea Base Unificada (Suelo de Asentamiento) -->
                        <rect x="65" y="318" width="240" height="4" rx="2" fill="url(#${uid}Grad)" />
                    </g>
                </svg>
                <span class="flex flex-col text-left leading-none">
                    <span class="text-sm font-black tracking-tight text-white font-mono flex items-center gap-1.5">
                        DANTE OS
                        <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
                    </span>
                    <span class="text-[9px] font-mono text-slate-400 tracking-wider">ENTRENAMIENTO PREUNIV</span>
                </span>
            </span>`;
        },

        // Generador dinámico de insignias vectoriales estilizadas con cápsula neón
        badge: function(iconName, label, opts = {}) {
            const colorKey = opts.color || 'cyan';
            const palette = COLOR_MAPS[colorKey] || COLOR_MAPS.cyan;
            const iconFn = this[iconName] || this.brain;
            const iconSvg = iconFn({ size: opts.iconSize || 15, color: palette.primary });

            return `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border transition-all shadow-sm ${opts.class || ''}"
                      style="background-color: ${palette.bg}; border-color: ${palette.border}; color: ${palette.primary}; shadow: 0 0 12px ${palette.glow};">
                    ${iconSvg}
                    <span>${label}</span>
                </span>
            `;
        }
    };
})();
