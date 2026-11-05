/**
 * Dante OS Enterprise v23.1 - Dante Spiral Entity
 * Canvas 2D Fermat Spiral (Proporción Áurea)
 * Estados: idle | charging | active | focus | breach
 */

(function() {
  'use strict';

  const GOLDEN_ANGLE = 137.508 * (Math.PI / 180);
  const SYMBOLS = ['Σ', 'Δ', '∫', 'π', '∞', 'λ', 'Ω', 'Ψ', 'θ', '√', 'α', 'β', 'γ', '0', '1', '4', '7', '8', '9', 'X', 'Y', 'Z', 'ϕ', '∈', '∀', '∃', '∇', '≈', '≠', '≤', '≥'];

  let canvas = null;
  let ctx = null;
  let animFrameId = null;
  let mode = 'idle'; // 'idle', 'charging', 'active', 'focus', 'breach'
  let dpr = 1;
  let width = 0;
  let height = 0;
  let particles = [];
  let numParticles = 450;
  let time = 0;
  let chargeProgress = 0; // 0..1 when charging
  let breachProgress = 0; // 0..1 portal breach
  let audioCtx = null;
  let osc = null;
  let gainNode = null;
  let chargeTimer = null;
  let breachTimer = null;
  let chargeStartTime = 0;
  let currentTrack = 'ICFES'; // 'ICFES' or 'UNAL'
  let currentPlanTier = 'FREE'; // 'FREE' or 'PRO'
  let currentTheme = 'ICFES';
  let lastBreachRgb = '231, 215, 195';

  // Micro-gravity cursor tracking
  let pointerX = null;
  let pointerY = null;
  let targetGravX = 0;
  let targetGravY = 0;
  let currentGravX = 0;
  let currentGravY = 0;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp01(t) {
    return Math.max(0, Math.min(1, t));
  }

  function smootherstep(t) {
    t = clamp01(t);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerpRgb(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  /** Paleta de contraste sobre fondo negro/cálido de la sala. */
  function breachStopsForSala() {
    // Fondo sala ≈ #000 / #010103 · acento marca #e7d7c3
    return [
      [0, 242, 254],
      [120, 226, 232],
      [180, 220, 210],
      [231, 215, 195],
      [251, 191, 36],
      [255, 180, 140],
      [251, 146, 160],
      [255, 248, 240]
    ];
  }

  function sampleBreachRgb(t, ringBias) {
    const stops = breachStopsForSala();
    // Pulso lento (hermoso), sin saltos de color
    const breath = 0.5 + 0.5 * Math.sin(time * 3.2 + ringBias * 2.4);
    const eased = smootherstep(clamp01(t * 0.94 + breath * 0.06));
    const pos = eased * (stops.length - 1) + ringBias * 0.7;
    const i = Math.min(stops.length - 2, Math.max(0, Math.floor(pos)));
    const local = smootherstep(clamp01(pos - i));
    return lerpRgb(stops[i], stops[i + 1], local);
  }

  /** Curvas continuas: sin cortes entre fases (evita “pausas”). */
  function breachMotion(tRaw) {
    const t = clamp01(tRaw);
    const awaken = smootherstep(t / 0.22);                 // 0→1 en el despertar
    const bloom = smootherstep(clamp01((t - 0.14) / 0.36)); // expansión
    const fold = smootherstep(clamp01((t - 0.58) / 0.42));  // implosión
    const crest = Math.sin(Math.PI * clamp01((t - 0.08) / 0.72)); // arco suave

    const breath = 1 + Math.sin(time * 4.2) * 0.028 * (1 - fold);
    const rotationSpeed = lerp(0.16, 0.55, awaken) + crest * 2.85 * (1 - fold * 0.55);
    const baseScale = (1 + bloom * 0.72 * (1 - fold * 0.15) - fold * 0.88) * breath;
    const alphaMultiplier = lerp(1, 0.42, fold * fold);
    const radiusMul = (1 + bloom * 0.42) * Math.pow(1 - fold * 0.9, 1.25);
    return { rotationSpeed, baseScale, alphaMultiplier, radiusMul, fold, bloom };
  }

  function bindPointerEvents() {
    if (!canvas) return;
    
    const updatePointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerX = clientX - rect.left - rect.width / 2;
      pointerY = clientY - rect.top - rect.height / 2;
    };

    const clearPointer = () => {
      pointerX = null;
      pointerY = null;
    };

    canvas.addEventListener('mousemove', updatePointer, { passive: true });
    canvas.addEventListener('mouseleave', clearPointer, { passive: true });
    canvas.addEventListener('touchmove', updatePointer, { passive: true });
    canvas.addEventListener('touchend', clearPointer, { passive: true });
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      const char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      particles.push({
        index: i,
        char: char,
        size: Math.random() * 8 + 10,
        baseAngleOffset: Math.random() * Math.PI * 2,
        speedFactor: 0.8 + Math.random() * 0.4,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = (rect && rect.width > 0) ? rect.width : (canvas.clientWidth || 280);
    height = (rect && rect.height > 0) ? rect.height : (canvas.clientHeight || 280);
    if (width <= 0) width = 280;
    if (height <= 0) height = 280;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }

  function render() {
    if (!ctx || !canvas) return;
    if (width <= 0 || height <= 0) {
      resizeCanvas();
    }
    if (!particles || particles.length === 0) {
      createParticles();
    }

    if (typeof time !== 'number' || isNaN(time)) {
      time = 0;
    }
    time += 0.016;

    try {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.max(10, Math.min(centerX, centerY) * 0.85);

      // Config according to mode
      let rotationSpeed = 0.2;
      let baseScale = 1;
      let alphaMultiplier = 1;

      if (mode === 'idle') {
        rotationSpeed = 0.15;
        baseScale = 1 + Math.sin(time * 1.5) * 0.05;
        alphaMultiplier = 0.85 + Math.sin(time * 2) * 0.15;
      } else if (mode === 'charging') {
        rotationSpeed = 0.8 + chargeProgress * 1.5;
        baseScale = 1 - chargeProgress * 0.35 + Math.sin(time * 12) * 0.03;
        alphaMultiplier = 1;
      let breachFrame = null;
      if (mode === 'breach') {
        breachFrame = breachMotion(breachProgress);
        rotationSpeed = breachFrame.rotationSpeed;
        baseScale = breachFrame.baseScale;
        alphaMultiplier = breachFrame.alphaMultiplier;
      } else if (mode === 'active') {
        rotationSpeed = 0.4;
        baseScale = 1.05 + Math.sin(time * 4) * 0.08;
        alphaMultiplier = 0.95 + Math.sin(time * 3) * 0.05;
      } else if (mode === 'focus') {
        rotationSpeed = 0.05;
        baseScale = 0.75;
        alphaMultiplier = 0.4;
      }

      // Micro-gravity interpolation
      if (pointerX !== null && pointerY !== null) {
        targetGravX = pointerX * 0.12;
        targetGravY = pointerY * 0.12;
      } else {
        targetGravX = 0;
        targetGravY = 0;
      }
      currentGravX += (targetGravX - currentGravX) * 0.08;
      currentGravY += (targetGravY - currentGravY) * 0.08;

      ctx.save();
      ctx.translate(centerX + currentGravX, centerY + currentGravY);
      ctx.rotate(time * rotationSpeed);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const idx = p.index;

        let r = Math.sqrt(idx) * (maxRadius / Math.sqrt(numParticles)) * baseScale;
        let theta = idx * GOLDEN_ANGLE;

        if (mode === 'charging') {
          const implosion = Math.pow(1 - chargeProgress * 0.5, 2);
          r *= implosion;
        } else if (mode === 'breach' && breachFrame) {
          r *= breachFrame.radiusMul;
        }

        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);

        if (pointerX !== null && pointerY !== null) {
          const dx = pointerX - x;
          const dy = pointerY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 10 && dist < 120) {
            const factor = (1 - dist / 120) * 8;
            x += (dx / dist) * factor;
            y += (dy / dist) * factor;
          }
        }

        const ratio = idx / numParticles;
        let alpha = (0.3 + (1 - ratio) * 0.7) * alphaMultiplier;
        if (isNaN(alpha) || alpha < 0) alpha = 0.5;

        let color = `rgba(0, 242, 254, ${alpha})`;

        if (mode === 'charging') {
          const rVal = Math.floor(212 * (1 - chargeProgress) + 0 * chargeProgress);
          const gVal = Math.floor(175 * (1 - chargeProgress) + 255 * chargeProgress);
          const bVal = Math.floor(55 * (1 - chargeProgress) + 204 * chargeProgress);
          color = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
        } else if (mode === 'breach') {
          const rgb = sampleBreachRgb(breachProgress, ratio);
          const pulseBoost = 0.06 + 0.07 * Math.sin(time * 5.5 + idx * 0.05);
          color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.min(1, alpha + pulseBoost)})`;
          if (idx === 0) lastBreachRgb = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
        } else if (mode === 'active') {
          if (currentTrack === 'UNAL') {
            if (currentPlanTier === 'PRO') {
              color = idx % 2 === 0 ? `rgba(168, 85, 247, ${alpha})` : `rgba(192, 132, 252, ${alpha})`;
            } else {
              color = idx % 2 === 0 ? `rgba(16, 185, 129, ${alpha})` : `rgba(0, 242, 254, ${alpha})`;
            }
          } else {
            if (currentPlanTier === 'PRO') {
              color = idx % 2 === 0 ? `rgba(245, 158, 11, ${alpha})` : `rgba(251, 191, 36, ${alpha})`;
            } else {
              color = idx % 2 === 0 ? `rgba(0, 242, 254, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
            }
          }
        } else if (mode === 'focus') {
          color = `rgba(100, 150, 180, ${alpha * 0.5})`;
        } else {
          if (currentTrack === 'UNAL') {
            if (currentPlanTier === 'PRO') {
              color = ratio < 0.5 ? `rgba(168, 85, 247, ${alpha})` : `rgba(192, 132, 252, ${alpha * 0.85})`;
            } else {
              color = `rgba(16, 185, 129, ${alpha * 0.9})`;
            }
          } else {
            // Idle sala: cian a la izquierda / ámbar a la derecha (mock Dante OS)
            const side = (x / Math.max(24, Math.abs(x) + Math.abs(y) * 0.35));
            if (currentPlanTier === 'PRO') {
              color = side < 0
                ? `rgba(0, 242, 254, ${alpha * 0.95})`
                : `rgba(251, 146, 60, ${alpha * 0.92})`;
            } else {
              color = side < 0
                ? `rgba(0, 242, 254, ${alpha * 0.95})`
                : `rgba(245, 158, 11, ${alpha * 0.88})`;
            }
          }
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.15, p.size * 0.16), 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${Math.floor(p.size)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, x, y);
      }

      ctx.restore();

      // Central glowing core node
      ctx.save();
      ctx.translate(centerX, centerY);
      const corePulse = mode === 'charging'
        ? 12 + Math.sin(time * 20) * 4 + chargeProgress * 15
        : mode === 'breach'
          ? 9 + Math.sin(time * 5.8) * 3.5 + Math.sin(Math.PI * breachProgress) * 18
          : 8 + Math.sin(time * 2.5) * 3;
      
      const rInner = Math.max(1, corePulse * 2);
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rInner);
      if (mode === 'breach') {
        const cCore = sampleBreachRgb(breachProgress, 0.12);
        const cMid = sampleBreachRgb(clamp01(breachProgress + 0.1), 0.4);
        const beat = 0.62 + 0.28 * Math.sin(time * 4.8);
        coreGradient.addColorStop(0, `rgba(255, 252, 245, ${0.9 + beat * 0.08})`);
        coreGradient.addColorStop(0.32, `rgba(${cCore[0]}, ${cCore[1]}, ${cCore[2]}, ${0.5 + beat * 0.28})`);
        coreGradient.addColorStop(0.68, `rgba(${cMid[0]}, ${cMid[1]}, ${cMid[2]}, ${0.22 * beat})`);
        coreGradient.addColorStop(1, `rgba(${cMid[0]}, ${cMid[1]}, ${cMid[2]}, 0)`);
        lastBreachRgb = `${cCore[0]}, ${cCore[1]}, ${cCore[2]}`;
      } else if (mode === 'charging') {
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGradient.addColorStop(0.45, 'rgba(0, 255, 204, 0.6)');
        coreGradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
      } else {
        coreGradient.addColorStop(0, 'rgba(212, 175, 55, 0.9)');
        coreGradient.addColorStop(0.5, 'rgba(0, 255, 204, 0.4)');
        coreGradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
      }

      ctx.beginPath();
      ctx.arc(0, 0, rInner, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();
      ctx.restore();
      if (mode === 'breach') {
        syncReflejo(lastBreachRgb);
      } else {
        syncReflejo(mode === 'charging' ? '0, 255, 204' : (currentTrack === 'UNAL' ? '16, 185, 129' : (currentPlanTier === 'PRO' ? '245, 158, 11' : '0, 242, 254')));
      }
    } catch (err) {
      console.error('[DanteSpiral] Render error:', err);
    }

    animFrameId = requestAnimationFrame(render);
  }

  function syncReflejo(rgb) {
    if (window.DanteNucleo && window.DanteNucleo.listo) return;
    const reflejo = document.getElementById('reflejoSala');
    if (!reflejo) return;
    // Fondo más contenido: la espiral manda, el reflejo solo acompaña
    let pulse;
    if (mode === 'breach') {
      pulse = 0.22 + Math.sin(Math.PI * breachProgress) * 0.16 + Math.sin(time * 1.1) * 0.03;
    } else if (mode === 'charging') {
      pulse = 0.38 + chargeProgress * 0.18;
    } else {
      pulse = 0.26 + Math.sin(time * 1.15) * 0.06;
    }
    const core = (pulse * 0.72).toFixed(3);
    const medio = (pulse * 0.28).toFixed(3);
    const lejos = (pulse * 0.09).toFixed(3);
    reflejo.style.background = 'radial-gradient(ellipse at 50% 16%, rgba(' + rgb + ', ' + core + ') 0%, rgba(' + rgb + ', ' + medio + ') 26%, rgba(' + rgb + ', ' + lejos + ') 50%, transparent 74%)';
  }

  // Audio Synth for Touch Scanning Ritual
  function startWebAudioRamp() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      osc = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 2.0);

      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.4);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 2.0);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
    } catch (e) {
      console.warn('[DanteSpiral] WebAudio audio issue:', e);
    }
  }

  function stopWebAudioRamp(smooth = true) {
    if (gainNode && audioCtx && osc) {
      try {
        if (smooth) {
          gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
          setTimeout(() => {
            if (osc) {
              osc.stop();
              osc.disconnect();
              osc = null;
            }
          }, 200);
        } else {
          osc.stop();
          osc.disconnect();
          osc = null;
        }
      } catch (e) {
        osc = null;
      }
    }
  }

  const DanteSpiral = {
    init: function(canvasElementId) {
      canvas = typeof canvasElementId === 'string' ? document.getElementById(canvasElementId) : canvasElementId;
      if (!canvas) {
        console.warn('[DanteSpiral] Canvas element not found:', canvasElementId);
        return;
      }
      ctx = canvas.getContext('2d', { alpha: true });
      canvas.style.background = 'transparent';
      createParticles();
      resizeCanvas();
      bindPointerEvents();
      window.addEventListener('resize', resizeCanvas);
      requestAnimationFrame(resizeCanvas);
      setTimeout(resizeCanvas, 300);
      setTimeout(resizeCanvas, 900);

      if (animFrameId) cancelAnimationFrame(animFrameId);
      render();
    },

    updatePalette: function(track, planTier) {
      if (track) {
        currentTrack = (track.includes('UNAL') || track.includes('UDEA') || track === 'UNAL') ? 'UNAL' : 'ICFES';
      }
      if (planTier) {
        currentPlanTier = (planTier.includes('PRO') || planTier.includes('ELITE') || planTier === 'PRO') ? 'PRO' : 'FREE';
      }
      currentTheme = currentTrack;
    },

    setTheme: function(track) {
      this.updatePalette(track, null);
    },

    setMode: function(newMode) {
      if (['idle', 'charging', 'active', 'focus', 'breach'].includes(newMode)) {
        mode = newMode;
      }
    },

    getMode: function() {
      return mode;
    },

    setChargeProgress: function(prog) {
      chargeProgress = Math.max(0, Math.min(1, prog));
    },

    setBreachProgress: function(prog) {
      breachProgress = clamp01(prog);
      if (mode !== 'breach') mode = 'breach';
    },

    getBreachProgress: function() {
      return breachProgress;
    },

    /** Arranca el modo puerta (el progreso lo marca la presión del usuario). */
    beginPortalBreach: function() {
      if (breachTimer) {
        cancelAnimationFrame(breachTimer);
        breachTimer = null;
      }
      breachProgress = 0;
      this.setMode('breach');
    },

    /** Despertar → florecer → plegar (~3.4s). Auto-play (p. ej. ?hackea=1). */
    playPortalBreach: function(onComplete, durationMs) {
      if (breachTimer) {
        cancelAnimationFrame(breachTimer);
        breachTimer = null;
      }
      this.setMode('breach');
      breachProgress = 0;
      const start = performance.now();
      const dur = typeof durationMs === 'number' ? durationMs : 3400;

      if (navigator.vibrate) {
        try { navigator.vibrate([12, 80, 18, 120, 24, 160, 40]); } catch (_) {}
      }

      const tick = (now) => {
        const linear = clamp01((now - start) / dur);
        breachProgress = linear;
        if (linear >= 1) {
          breachTimer = null;
          DanteSpiral.setMode('idle');
          breachProgress = 0;
          if (typeof onComplete === 'function') onComplete();
          return;
        }
        breachTimer = requestAnimationFrame(tick);
      };
      breachTimer = requestAnimationFrame(tick);
    },

    cancelPortalBreach: function() {
      if (breachTimer) {
        cancelAnimationFrame(breachTimer);
        breachTimer = null;
      }
      breachProgress = 0;
      if (mode === 'breach') this.setMode('idle');
    },

    startScanRitual: function(onProgress, onComplete, onCancel) {
      this.setMode('charging');
      chargeProgress = 0;
      chargeStartTime = Date.now();
      startWebAudioRamp();

      if (chargeTimer) clearInterval(chargeTimer);

      chargeTimer = setInterval(() => {
        const elapsed = (Date.now() - chargeStartTime) / 1000;
        const progress = Math.min(1, elapsed / 2.0);
        chargeProgress = progress;

        if (onProgress) onProgress(Math.floor(progress * 100));

        if (progress >= 1) {
          clearInterval(chargeTimer);
          chargeTimer = null;
          stopWebAudioRamp(false);
          DanteSpiral.setMode('active');

          if (navigator.vibrate) {
            try { navigator.vibrate([50, 50, 150]); } catch (e) {}
          }

          if (onComplete) onComplete();
        }
      }, 30);
    },

    cancelScanRitual: function(onCancel) {
      if (chargeTimer) {
        clearInterval(chargeTimer);
        chargeTimer = null;
      }
      chargeProgress = 0;
      stopWebAudioRamp(true);
      this.setMode('idle');
      if (onCancel) onCancel();
    },

    destroy: function() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (chargeTimer) clearInterval(chargeTimer);
      if (breachTimer) cancelAnimationFrame(breachTimer);
      stopWebAudioRamp(false);
      window.removeEventListener('resize', resizeCanvas);
      canvas = null;
      ctx = null;
    }
  };

  window.DanteSpiral = DanteSpiral;
})();
