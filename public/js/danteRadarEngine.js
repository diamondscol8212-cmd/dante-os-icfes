/**
 * DANTE RADAR ENGINE
 * Motor gráfico y psicométrico para renderizado del Polígono de Habilidad IRT 3PL
 * y calibración adaptativa sobre Canvas HTML5.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.DanteRadarEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    class DanteRadarEngine {
        /**
         * Renderiza el radar en un elemento Canvas HTML5 de forma determinista y reactiva.
         * @param {HTMLCanvasElement|string} target - Elemento canvas o id
         * @param {Object} options - Parámetros de configuración
         */
        static render(target, options = {}) {
            const canvas = typeof target === 'string' ? document.getElementById(target) : target;
            if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
                return false;
            }

            // Verificar visibilidad del canvas o su contenedor padre
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(parent).display === 'none') {
                    // Contenedor oculto o colapsado temporalmente: reintentar en siguiente frame
                    requestAnimationFrame(() => {
                        this.render(canvas, options);
                    });
                    return false;
                }
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) return false;

            // Dimensiones físicas explícitas
            const width = options.width || 320;
            const height = options.height || 280;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            // Datos y etiquetas
            const labels = options.labels || ['Matemáticas', 'Lectura Crítica', 'Ciencias Nat.', 'Sociales', 'Inglés'];
            const values = options.values || [50, 50, 50, 50, 50]; // 0 - 100
            const maxVal = options.max || 100;
            const numPoints = labels.length;

            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(centerX, centerY) - 38;

            ctx.clearRect(0, 0, width, height);

            // 1. Dibujar círculos concéntricos de referencia (Grid)
            const levels = 4;
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = 1;

            for (let l = 1; l <= levels; l++) {
                const r = (radius / levels) * l;
                ctx.beginPath();
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i * 2 * Math.PI / numPoints) - (Math.PI / 2);
                    const x = centerX + r * Math.cos(angle);
                    const y = centerY + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }

            // 2. Dibujar radios / ejes desde el centro
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            for (let i = 0; i < numPoints; i++) {
                const angle = (i * 2 * Math.PI / numPoints) - (Math.PI / 2);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Etiquetas de las materias
                const labelDist = radius + 22;
                const lx = centerX + labelDist * Math.cos(angle);
                const ly = centerY + labelDist * Math.sin(angle) + 4;

                ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
                ctx.fillStyle = '#38BDF8';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(labels[i], lx, ly);
            }
            ctx.restore();

            // 3. Dibujar el polígono de habilidad IRT con trazo cian translúcido y relleno suave
            ctx.save();
            ctx.strokeStyle = options.strokeColor || 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = options.strokeWidth || 2;
            ctx.fillStyle = options.fillColor || 'rgba(56, 189, 248, 0.15)';

            ctx.beginPath();
            const coords = [];
            for (let i = 0; i < numPoints; i++) {
                const val = Math.max(0, Math.min(maxVal, Number(values[i]) || 0));
                const currentRadius = (radius * (val / maxVal));
                const angle = (i * 2 * Math.PI / numPoints) - (Math.PI / 2);
                const x = centerX + currentRadius * Math.cos(angle);
                const y = centerY + currentRadius * Math.sin(angle);
                coords.push({ x, y, val });

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 4. Dibujar los vértices / puntos en cada eje
            coords.forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#F59E0B'; // Vértice ámbar
                ctx.fill();
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });

            ctx.restore();
            return true;
        }
    }

    return DanteRadarEngine;
}));
