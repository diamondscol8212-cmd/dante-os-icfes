/**
 * ojoBionico3D.js - Motor de Renderizado 3D e Inspección Espacial Vectorial (Dante OS Enterprise v23.1.0)
 * 
 * Permite rotar en 360°, desplegar/plegar de 2D a 3D e iluminar ejes de simetría neón en Canvas.
 */

window.OjoBionico3D = {
    canvas: null,
    ctx: null,
    angleX: 0.5,
    angleY: 0.6,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    foldProgress: 1.0, // 0.0 = 2D Desplegado, 1.0 = 3D Plegado completo
    animatingFold: false,
    showAxes: true,
    highlightFace: true,
    autoRotate: true,
    modelType: 'cubo_patron', // 'cubo_patron', 'bloques_topologicos'

    init: function(canvasId = 'canvasOjoBionico3D') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.setupEvents();
        this.startLoop();
    },

    setupEvents: function() {
        if (!this.canvas) return;

        const onStart = (x, y) => {
            this.isDragging = true;
            this.lastMouseX = x;
            this.lastMouseY = y;
            this.autoRotate = false;
        };

        const onMove = (x, y) => {
            if (!this.isDragging) return;
            const deltaX = x - this.lastMouseX;
            const deltaY = y - this.lastMouseY;

            this.angleY += deltaX * 0.01;
            this.angleX += deltaY * 0.01;

            this.lastMouseX = x;
            this.lastMouseY = y;
        };

        const onEnd = () => {
            this.isDragging = false;
        };

        this.canvas.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onEnd);

        this.canvas.addEventListener('touchstart', e => {
            if (e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchmove', e => {
            if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchend', onEnd);
    },

    toggleFold: function() {
        this.animatingFold = true;
        const target = this.foldProgress > 0.5 ? 0.0 : 1.0;
        
        const step = () => {
            if (Math.abs(this.foldProgress - target) < 0.05) {
                this.foldProgress = target;
                this.animatingFold = false;
            } else {
                this.foldProgress += (target - this.foldProgress) * 0.15;
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    },

    toggleEjes: function() {
        this.showAxes = !this.showAxes;
    },

    toggleHighlight: function() {
        this.highlightFace = !this.highlightFace;
    },

    toggleAutoRotate: function() {
        this.autoRotate = !this.autoRotate;
    },

    startLoop: function() {
        const render = () => {
            if (this.autoRotate && !this.isDragging) {
                this.angleY += 0.008;
            }
            this.draw();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    },

    draw: function() {
        if (!this.canvas || !this.ctx) return;
        const width = this.canvas.width = this.canvas.parentElement.clientWidth || 400;
        const height = this.canvas.height = 320;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, width, height);

        // Fondo HUD Neón
        const bgGrad = ctx.createRadialGradient(width/2, height/2, 20, width/2, height/2, width/1.5);
        bgGrad.addColorStop(0, '#061325');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Rejilla de Fondo 3D Isometric
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 25) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 25) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        const cx = width / 2;
        const cy = height / 2;
        const scale = Math.min(width, height) * 0.22;

        // Proyección 3D -> 2D
        const project = (x, y, z) => {
            // Rotación Y
            let x1 = x * Math.cos(this.angleY) + z * Math.sin(this.angleY);
            let z1 = -x * Math.sin(this.angleY) + z * Math.cos(this.angleY);
            // Rotación X
            let y2 = y * Math.cos(this.angleX) - z1 * Math.sin(this.angleX);
            let z2 = y * Math.sin(this.angleX) + z1 * Math.cos(this.angleX);

            const distance = 4;
            const fov = distance / (distance + z2 * 0.5);
            return {
                x: cx + x1 * scale * fov,
                y: cy - y2 * scale * fov,
                z: z2
            };
        };

        // DIBUJAR EJES NEÓN SI APLICA
        if (this.showAxes) {
            const origin = project(0, 0, 0);
            const axisX = project(1.8, 0, 0);
            const axisY = project(0, 1.8, 0);
            const axisZ = project(0, 0, 1.8);

            // Eje X (Rojo Neón)
            ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(axisX.x, axisX.y); ctx.stroke();
            ctx.fillStyle = '#f43f5e'; ctx.font = '10px monospace'; ctx.fillText('Eje X', axisX.x + 4, axisX.y);

            // Eje Y (Verde Neón)
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(axisY.x, axisY.y); ctx.stroke();
            ctx.fillStyle = '#10b981'; ctx.fillText('Eje Y (Rotación)', axisY.x + 4, axisY.y);

            // Eje Z (Azul Neón)
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(axisZ.x, axisZ.y); ctx.stroke();
            ctx.fillStyle = '#38bdf8'; ctx.fillText('Eje Z (Profundidad)', axisZ.x + 4, axisZ.y);
        }

        // CARAS Y VÉRTICES DEL CUBO PLEGABLE
        const p = this.foldProgress;
        const angleFold = (1 - p) * (Math.PI / 2); // 90 deg si desplegado

        // Caras del Poliedro en 3D
        const faces = [
            // Base (Centro)
            { verts: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], color: 'rgba(16, 185, 129, 0.4)', stroke: '#10b981', label: 'BASE' },
            // Cara Frontal
            { verts: [[-1, 1, 1], [1, 1, 1], [1, 1 + 2*Math.cos(angleFold), 1 - 2*Math.sin(angleFold)], [-1, 1 + 2*Math.cos(angleFold), 1 - 2*Math.sin(angleFold)]], color: 'rgba(245, 158, 11, 0.45)', stroke: '#f59e0b', label: 'FRONTAL' },
            // Cara Trasera
            { verts: [[-1, -1 - 2*Math.cos(angleFold), 1 - 2*Math.sin(angleFold)], [1, -1 - 2*Math.cos(angleFold), 1 - 2*Math.sin(angleFold)], [1, -1, 1], [-1, -1, 1]], color: 'rgba(6, 182, 212, 0.4)', stroke: '#06b6d4', label: 'TRASERA' },
            // Cara Izquierda
            { verts: [[-1 - 2*Math.cos(angleFold), -1, 1 - 2*Math.sin(angleFold)], [-1, -1, 1], [-1, 1, 1], [-1 - 2*Math.cos(angleFold), 1, 1 - 2*Math.sin(angleFold)]], color: 'rgba(168, 85, 247, 0.4)', stroke: '#a855f7', label: 'IZQ' },
            // Cara Derecha
            { verts: [[1, -1, 1], [1 + 2*Math.cos(angleFold), -1, 1 - 2*Math.sin(angleFold)], [1 + 2*Math.cos(angleFold), 1, 1 - 2*Math.sin(angleFold)], [1, 1, 1]], color: 'rgba(236, 72, 153, 0.4)', stroke: '#ec4899', label: 'DER' }
        ];

        // Ordenar caras por profundidad Z (Painter's Algorithm)
        faces.forEach(face => {
            const projectedVerts = face.verts.map(v => project(v[0], v[1], v[2]));
            face.proj = projectedVerts;
            face.avgZ = projectedVerts.reduce((sum, pv) => sum + pv.z, 0) / projectedVerts.length;
        });

        faces.sort((a, b) => b.avgZ - a.avgZ);

        // Renderizar caras
        faces.forEach(face => {
            ctx.beginPath();
            ctx.moveTo(face.proj[0].x, face.proj[0].y);
            for (let i = 1; i < face.proj.length; i++) {
                ctx.lineTo(face.proj[i].x, face.proj[i].y);
            }
            ctx.closePath();

            ctx.fillStyle = face.color;
            ctx.fill();

            ctx.strokeStyle = face.stroke;
            ctx.lineWidth = this.highlightFace && face.label === 'FRONTAL' ? 3.5 : 1.5;
            ctx.stroke();

            // Etiqueta de la Cara
            const centerPt = face.proj.reduce((acc, v) => ({ x: acc.x + v.x/4, y: acc.y + v.y/4 }), { x: 0, y: 0 });
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(face.label, centerPt.x, centerPt.y);
        });
    },

    abrirModal3D: function(modeloPatron = null) {
        if (modeloPatron) this.modelType = modeloPatron;
        const modal = document.getElementById('modalOjoBionico3D');
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => this.init('canvasOjoBionico3D'), 100);
    },

    abrirModal: function(modeloPatron = null) {
        this.abrirModal3D(modeloPatron);
    },

    cerrarModal3D: function() {
        const modal = document.getElementById('modalOjoBionico3D');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};
