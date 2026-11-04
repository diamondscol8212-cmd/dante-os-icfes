// 🛡️ src/security/danteSecurityGuard.js - Guardián Perimetral ES Module (Safe Mode)
/* global document, window */

export function initAntiDebugging() {
    if (typeof window === 'undefined') return;
    const isIframe = window.self !== window.top;
    const isLocalOrPreview = window.location.hostname.includes('localhost') || 
                             window.location.hostname.includes('127.0.0.1') || 
                             window.location.hostname.includes('run.app') ||
                             isIframe;

    if (!isLocalOrPreview) {
        const noop = () => {};
        window.console.log = noop;
        window.console.warn = noop;
        window.console.debug = noop;
        window.console.info = noop;
    }
}

export function initDOMHardening() {
    // Modo pasivo seguro
}

export function injectWatermark(userEmail = 'estudiante@danteos.edu.co', userId = 'USR-ENTERPRISE') {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    if (document.getElementById('dante-forensic-watermark')) return;

    const watermarkText = `DANTE OS | ${userEmail} | ID: ${userId} | ${new Date().toISOString().slice(0, 10)}`;
    
    const canvas = document.createElement('canvas');
    canvas.width = 350;
    canvas.height = 180;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.rotate((-20 * Math.PI) / 180);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
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
