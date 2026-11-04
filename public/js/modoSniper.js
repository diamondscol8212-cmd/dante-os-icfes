/**
 * modoSniper.js - Entrenador Gamificado de Descarte Táctico < 10s (Dante OS Enterprise v23.1.0)
 * 
 * Micro-entrenamiento del Sistema 1 para descartar distractores absurdos a alta velocidad.
 */

window.ModoSniper = {
    roundActual: 0,
    totalRounds: 5,
    puntosSniper: 0,
    tiempoRestanteSeg: 10,
    timerInterval: null,
    distractoresEliminadosRound: 0,
    tiempoTotalUsadoSeg: 0,

    itemsSniperBase: [
        {
            id: "sniper_01",
            enunciado: "🎯 MODO SNIPER: Elimina los 2 distractores IMPOSIBLES por simetría sobre el eje Y.",
            opciones: [
                { id: "A", texto: "Opción A) Figura con triángulo en cuadrante superior izquierdo", esDistractorImposible: true, razon: "Violación de simetría axial sobre el eje Y." },
                { id: "B", texto: "Opción B) Figura con rotación de 90° en cuadrante inferior", esDistractorImposible: false, razon: "Opción plausible." },
                { id: "C", texto: "Opción C) Figura con sombra invertida y trazo doble", esDistractorImposible: true, razon: "Inversión de sombra no permitida por la matriz." },
                { id: "D", texto: "Opción D) Figura simétrica con coincidencia de bordes", esDistractorImposible: false, razon: "Opción correcta final." }
            ]
        },
        {
            id: "sniper_02",
            enunciado: "🎯 MODO SNIPER: Elimina las 2 opciones IMPOSIBLES por límite de función $f(x) = \sqrt{2x-1}$.",
            opciones: [
                { id: "A", texto: "Opción A) Dominio $(-\infty, 1/2]$", esDistractorImposible: true, razon: "Radicando no puede ser negativo." },
                { id: "B", texto: "Opción B) Dominio $[1/2, +\infty)$", esDistractorImposible: false, razon: "Opción correcta." },
                { id: "C", texto: "Opción C) Dominio de todos los Reales excepto $x=0$", esDistractorImposible: true, razon: "Ignora la restricción de raíz cuadrada." },
                { id: "D", texto: "Opción D) Dominio $[0, +\infty)$", esDistractorImposible: false, razon: "Plausible pero imprecisa." }
            ]
        },
        {
            id: "sniper_03",
            enunciado: "🎯 MODO SNIPER: En este silogismo, elimina las 2 conclusiones FALACES o falacias lógicas.",
            opciones: [
                { id: "A", texto: "Opción A) Todos los A son C (Afirmación del consecuente)", esDistractorImposible: true, razon: "Falacia formal de afirmación del consecuente." },
                { id: "B", texto: "Opción B) Ningún A es B por exclusión", esDistractorImposible: false, razon: "Opción plausible." },
                { id: "C", texto: "Opción C) Algunos C no son A por premisa menor", esDistractorImposible: false, razon: "Deducción válida." },
                { id: "D", texto: "Opción D) Por lo tanto A es B e igual a la nada", esDistractorImposible: true, razon: "Sintagma ilógico y falaz." }
            ]
        }
    ],

    init: function() {
        // Inicializado al abrir modal
    },

    abrirModalSniper: function() {
        const modal = document.getElementById('modalModoSniper');
        if (!modal) return;

        this.roundActual = 0;
        this.puntosSniper = 0;
        this.tiempoTotalUsadoSeg = 0;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        this.iniciarRound();
    },

    cerrarModalSniper: function() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        const modal = document.getElementById('modalModoSniper');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },

    iniciarRound: function() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const currentItem = this.itemsSniperBase[this.roundActual % this.itemsSniperBase.length];
        this.distractoresEliminadosRound = 0;
        this.tiempoRestanteSeg = 10;

        // Renderizar enunciado y contador
        const lblEnunciado = document.getElementById('sniperLblEnunciado');
        const containerOpciones = document.getElementById('sniperContainerOpciones');
        const barTimer = document.getElementById('sniperBarTimer');
        const lblRound = document.getElementById('sniperLblRound');

        if (lblEnunciado) lblEnunciado.innerText = currentItem.enunciado;
        if (lblRound) lblRound.innerText = `ROUND ${this.roundActual + 1} DE ${this.totalRounds}`;

        if (containerOpciones) {
            containerOpciones.innerHTML = currentItem.opciones.map(op => `
                <button type="button" onclick="ModoSniper.seleccionarOpcionSniper('${op.id}', ${op.esDistractorImposible}, '${op.razon}', this)" class="w-full p-3 rounded-xl bg-slate-900 border-2 border-slate-700 hover:border-red-500 hover:bg-red-950/30 text-left font-mono text-xs text-white transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">
                    <span class="font-bold">${op.texto}</span>
                    <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] uppercase group-hover:inline-block font-mono">
                        🎯 DESCARTE SNIPER
                    </span>
                </button>
            `).join('');
        }

        // Iniciar temporizador táctico de 10 segundos
        this.timerInterval = setInterval(() => {
            this.tiempoRestanteSeg--;
            this.tiempoTotalUsadoSeg++;

            const pct = (this.tiempoRestanteSeg / 10) * 100;
            if (barTimer) {
                barTimer.style.width = `${pct}%`;
                if (pct > 50) barTimer.className = "h-full bg-emerald-500 transition-all duration-300";
                else if (pct > 25) barTimer.className = "h-full bg-amber-500 transition-all duration-300";
                else barTimer.className = "h-full bg-rose-500 transition-all duration-300";
            }

            if (this.tiempoRestanteSeg <= 0) {
                clearInterval(this.timerInterval);
                this.avanzarRound();
            }
        }, 1000);
    },

    seleccionarOpcionSniper: function(opId, esDistractor, razon, btnElem) {
        if (!btnElem) return;

        if (esDistractor) {
            this.puntosSniper += 100;
            this.distractoresEliminadosRound++;
            
            // Animación de mirilla láser de eliminación
            btnElem.className = "w-full p-3 rounded-xl bg-red-950/80 border-2 border-red-500 text-left font-mono text-xs text-red-300 pointer-events-none line-through opacity-70 relative shadow-[0_0_20px_rgba(239,68,68,0.4)]";
            btnElem.innerHTML += `<span class="absolute right-3 top-3 text-[10px] text-red-400 font-bold uppercase">💥 DESCARTADO (-40s examen)</span>`;

            if (this.distractoresEliminadosRound >= 2) {
                if (this.timerInterval) clearInterval(this.timerInterval);
                setTimeout(() => this.avanzarRound(), 600);
            }
        } else {
            // Error en el descarte
            btnElem.className = "w-full p-3 rounded-xl bg-amber-950/80 border-2 border-amber-500 text-left font-mono text-xs text-amber-300 pointer-events-none opacity-80";
            btnElem.innerHTML += `<span class="absolute right-3 top-3 text-[10px] text-amber-400 font-bold">⚠️ OPCIÓN PLAUSIBLE</span>`;
        }
    },

    avanzarRound: function() {
        this.roundActual++;
        if (this.roundActual < this.totalRounds) {
            this.iniciarRound();
        } else {
            this.finalizarSesionSniper();
        }
    },

    finalizarSesionSniper: function() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const containerOpciones = document.getElementById('sniperContainerOpciones');
        const lblEnunciado = document.getElementById('sniperLblEnunciado');
        const lblRound = document.getElementById('sniperLblRound');

        if (lblRound) lblRound.innerText = "🎯 REPORTE FINAL DE RENDIMIENTO SNIPER";
        if (lblEnunciado) lblEnunciado.innerText = "¡Soberbio! Has completado el entrenamiento táctico de descarte a alta velocidad.";

        const tiempoPromedio = (this.tiempoTotalUsadoSeg / this.totalRounds).toFixed(1);
        const minutosGanadosExamen = ((this.puntosSniper / 100) * 2.5).toFixed(1);

        if (containerOpciones) {
            containerOpciones.innerHTML = `
                <div class="p-4 bg-slate-900 border-2 border-amber-500/80 rounded-2xl space-y-4 text-center font-mono">
                    <div class="text-3xl font-black text-amber-400">${this.puntosSniper} PTS SNIPER</div>
                    
                    <div class="grid grid-cols-2 gap-3 text-left">
                        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <span class="text-[10px] text-slate-400 block font-bold uppercase">TIEMPO PROMEDIO DESCARTE</span>
                            <span class="text-xl font-bold text-cyan-400">${tiempoPromedio}s / reactivo</span>
                        </div>
                        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <span class="text-[10px] text-slate-400 block font-bold uppercase">MINUTOS GANADOS UNAL</span>
                            <span class="text-xl font-bold text-emerald-400">+${minutosGanadosExamen} MIN</span>
                        </div>
                    </div>

                    <p class="text-xs text-slate-300 font-sans leading-relaxed">
                        Entrenaste tu <strong>Sistema 1 de intuición rápida</strong>. En el examen real de la UNAL, este descarte de 8 segundos te dará tiempo suficiente para responder la Lectura Filosófica y Matemáticas complejas.
                    </p>

                    <button type="button" onclick="ModoSniper.cerrarModalSniper()" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl uppercase tracking-wider cursor-pointer transition">
                        VOLVER A CABINA DANTE OS
                    </button>
                </div>
            `;
        }
    }
};
