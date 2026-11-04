// 🛡️ public/js/danteSecurityGuard.js - Guardián Perimetral de Seguridad Frontend
// Dante OS Enterprise Edition - Protección Pasiva No Intrusiva (Safe Mode)

(function () {
    'use strict';

    // Safe Guard: Evitamos bloqueos intrusivos en la interfaz
    function initAntiDebugging() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.hostname.includes('run.app')) {
            const noop = () => {};
            window.console.log = noop;
            window.console.warn = noop;
            window.console.debug = noop;
            window.console.info = noop;
        }
    }

    function injectWatermark(email = 'estudiante@danteos.edu.co', userId = 'USR-ENTERPRISE') {
        if (document.getElementById('dante-forensic-watermark')) return;

        const watermarkText = `DANTE OS | ${email} | ID: ${userId} | ${new Date().toISOString().slice(0, 10)}`;
        
        const canvas = document.createElement('canvas');
        canvas.width = 350;
        canvas.height = 180;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.rotate((-20 * Math.PI) / 180);
            ctx.font = '12px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.015)'; // Discreta y elegante
            ctx.fillText(watermarkText, -20, 120);
        }

        const overlay = document.createElement('div');
        overlay.id = 'dante-forensic-watermark';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '99999';
        overlay.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
        
        document.body.appendChild(overlay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAntiDebugging();
            injectWatermark();
        });
    } else {
        initAntiDebugging();
        injectWatermark();
    }

    window.DanteSecurityGuard = {
        initAntiDebugging,
        injectWatermark
    };
})();
