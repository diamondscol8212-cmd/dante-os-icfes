/**
 * Hackea Sincronía — intro científico entre la espiral y el umbral.
 * Orientación → gating → task-set → onset limpio.
 */
(function (global) {
  'use strict';

  const FULL_MS = 9200;
  const SHORT_MS = 2600;
  const DAY_MS = 5400;

  let root = null;
  let canvas = null;
  let ctx = null;
  let raf = 0;
  let timers = [];
  let audioCtx = null;
  let running = false;
  let particles = [];
  let startAt = 0;
  let duration = FULL_MS;
  let phase = 'void';
  let onDone = null;
  let dpr = 1;
  let w = 0;
  let h = 0;
  let dayCopy = null;

  function el(id) {
    return document.getElementById(id);
  }

  function ensureDom() {
    root = el('hackeaSyncIntro');
    canvas = el('hackeaSyncCanvas');
    if (!root || !canvas) return false;
    ctx = canvas.getContext('2d', { alpha: true });
    return !!ctx;
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedParticles() {
    particles = [];
    const n = 56;
    for (let i = 0; i < n; i++) {
      particles.push({
        a: Math.random() * Math.PI * 2,
        r: 40 + Math.random() * 160,
        s: 0.12 + Math.random() * 0.35,
        size: 0.6 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 0.015
      });
    }
  }

  function ensureAudio() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (_) { /* ignore */ }
  }

  function tone(freq, dur, type, vol, slideTo) {
    if (!audioCtx) return;
    try {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (slideTo) {
        o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), audioCtx.currentTime + dur);
      }
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, audioCtx.currentTime + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur + 0.02);
    } catch (_) { /* ignore */ }
  }

  function later(ms, fn) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function setCopy(line, hint, kicker) {
    const lineEl = el('hackeaSyncLine');
    const hintEl = el('hackeaSyncHint');
    const kickEl = el('hackeaSyncKicker');
    if (kickEl && kicker != null) kickEl.textContent = kicker;
    if (lineEl) {
      lineEl.textContent = line || '';
      lineEl.classList.toggle('is-on', !!line);
    }
    if (hintEl) {
      hintEl.textContent = hint || '';
      hintEl.classList.toggle('is-on', !!hint);
    }
  }

  function progress() {
    return Math.min(1, (performance.now() - startAt) / duration);
  }

  function ringBreath(tAbs, short) {
    // Una sola respiración suave (seno), pico ~ mitad de la fase anillo
    if (short || dayCopy) {
      const span = dayCopy ? Math.max(1.2, duration / 1000 * 0.45) : 1.4;
      const u = Math.min(1, tAbs / span);
      return Math.sin(u * Math.PI);
    }
    const local = Math.max(0, Math.min(1, (tAbs - 0.7) / 2.0));
    return Math.sin(local * Math.PI);
  }

  function drawFrame() {
    if (!ctx || !running) return;
    const t = (performance.now() - startAt) / 1000;
    const p = progress();
    const short = !dayCopy && duration <= SHORT_MS + 50;
    const cx = w / 2;
    const cy = h * 0.46;

    ctx.clearRect(0, 0, w, h);

    // Vacío cálido-negro (sala Dante, no cian flat)
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
    bg.addColorStop(0, 'rgba(18, 16, 14, 0.55)');
    bg.addColorStop(0.45, 'rgba(6, 5, 4, 0.92)');
    bg.addColorStop(1, '#030201');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const breath = ringBreath(t, short);
    const gate = short ? Math.min(1, t / 0.35) : Math.min(1, Math.max(0, (t - 0.25) / 0.7));
    const fadeOut = p > 0.88 ? (1 - (p - 0.88) / 0.12) : 1;
    const alpha = gate * fadeOut;

    // Partículas en órbita lenta
    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      pt.a += pt.drift;
      const rr = pt.r * (0.85 + breath * 0.35);
      const x = cx + Math.cos(pt.a) * rr * (0.9 + pt.s * 0.2);
      const y = cy + Math.sin(pt.a) * rr * 0.72;
      const a = alpha * (0.15 + breath * 0.35) * pt.s;
      ctx.beginPath();
      ctx.fillStyle = i % 3 === 0
        ? `rgba(231, 215, 195, ${a})`
        : `rgba(0, 210, 220, ${a * 0.7})`;
      ctx.arc(x, y, pt.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Anillo principal — eco de la espiral, no ojo
    const baseR = Math.min(w, h) * 0.14;
    const r = baseR * (0.72 + breath * 0.55);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = alpha;

    const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.8);
    glow.addColorStop(0, `rgba(255, 248, 240, ${0.18 + breath * 0.22})`);
    glow.addColorStop(0.35, `rgba(231, 215, 195, ${0.12 + breath * 0.18})`);
    glow.addColorStop(0.7, `rgba(0, 200, 210, ${0.06 + breath * 0.08})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(231, 215, 195, ${0.35 + breath * 0.45})`;
    ctx.lineWidth = 1.25 + breath * 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.92, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(0, 220, 230, ${0.12 + breath * 0.28})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.18, r * 1.08, Math.PI / 7, 0, Math.PI * 2);
    ctx.stroke();

    // Núcleo
    const core = 3 + breath * 10;
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, core * 2.4);
    coreGrad.addColorStop(0, `rgba(255, 252, 245, ${0.55 + breath * 0.35})`);
    coreGrad.addColorStop(0.45, `rgba(231, 215, 195, ${0.25 + breath * 0.2})`);
    coreGrad.addColorStop(1, 'rgba(231, 215, 195, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, core * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Viñeta
    const vig = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.25, cx, cy, Math.max(w, h) * 0.7);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${0.55 * alpha})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    raf = requestAnimationFrame(drawFrame);
  }

  function finish() {
    if (!running) return;
    running = false;
    clearTimers();
    tone(1600, 0.07, 'triangle', 0.07);
    if (navigator.vibrate) {
      try { navigator.vibrate(18); } catch (_) {}
    }
    // Abrir umbral debajo del negro; luego revelar (sin flash de sala)
    const cb = onDone;
    onDone = null;
    if (typeof cb === 'function') cb();
    if (root) {
      root.classList.add('is-exit');
      root.classList.remove('phase-ring', 'phase-copy', 'phase-silence');
    }
    later(480, () => {
      if (root) {
        root.classList.remove('is-on', 'is-exit', 'is-short');
        root.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('hackea-sync-active');
      setCopy('', '', 'SINCRONÍA');
    });
  }

  function runFull() {
    phase = 'void';
    setCopy('', '', 'SINCRONÍA');
    later(200, () => {
      ensureAudio();
      tone(52, 2.4, 'sine', 0.055, 78);
    });
    later(700, () => {
      phase = 'ring';
      if (root) root.classList.add('phase-ring');
      if (navigator.vibrate) {
        try { navigator.vibrate([12, 60, 18]); } catch (_) {}
      }
    });
    later(2800, () => {
      phase = 'copy';
      if (root) {
        root.classList.remove('phase-ring');
        root.classList.add('phase-copy');
      }
      setCopy('Alinea el pulso.', 'Inhala una vez', 'SINCRONÍA');
      tone(110, 1.6, 'sine', 0.035, 90);
    });
    later(5200, () => {
      phase = 'silence';
      if (root) {
        root.classList.remove('phase-copy');
        root.classList.add('phase-silence');
      }
      setCopy('', '', 'SINCRONÍA');
    });
    later(FULL_MS - 80, finish);
  }

  function runShort() {
    phase = 'ring';
    if (root) root.classList.add('phase-ring', 'is-short');
    setCopy('', '', 'SINCRONÍA');
    later(80, () => {
      ensureAudio();
      tone(60, 1.1, 'sine', 0.04, 95);
    });
    later(700, () => {
      setCopy('De nuevo.', '', 'SINCRONÍA');
      if (root) root.classList.add('phase-copy');
    });
    later(SHORT_MS - 80, finish);
  }

  /** Intro de campaña: task-set pedagógico del día (antes del pulso). */
  function runDayIntro() {
    const copy = dayCopy || {};
    const ms = duration;
    phase = 'ring';
    if (root) root.classList.add('phase-ring', 'is-day');
    setCopy('', '', copy.kicker || 'DÍA');
    later(100, () => {
      ensureAudio();
      tone(55, 1.4, 'sine', 0.045, 88);
    });
    later(550, () => {
      if (navigator.vibrate) {
        try { navigator.vibrate([10, 40, 14]); } catch (_) {}
      }
    });
    later(900, () => {
      phase = 'copy';
      if (root) {
        root.classList.remove('phase-ring');
        root.classList.add('phase-copy');
      }
      setCopy(copy.line || '', copy.hint || '', copy.kicker || 'DÍA');
      tone(100, 1.2, 'sine', 0.03, 78);
    });
    later(Math.max(2200, ms - 900), () => {
      phase = 'silence';
      if (root) {
        root.classList.remove('phase-copy');
        root.classList.add('phase-silence');
      }
      setCopy('', '', copy.kicker || 'DÍA');
    });
    later(ms - 80, finish);
  }

  const HackeaSyncIntro = {
    play: function (opts, done) {
      if (!ensureDom()) {
        if (typeof done === 'function') done();
        return;
      }
      if (running) this.cancel();

      onDone = done;
      running = true;
      startAt = performance.now();
      dayCopy = null;
      if (opts && opts.dayIntro) {
        dayCopy = {
          kicker: opts.kicker || 'DÍA',
          line: opts.line || '',
          hint: opts.hint || ''
        };
        duration = Math.max(3600, Math.min(9000, Number(opts.ms) || DAY_MS));
      } else if (opts && opts.short) {
        duration = SHORT_MS;
      } else {
        duration = FULL_MS;
      }
      clearTimers();
      resize();
      seedParticles();
      window.addEventListener('resize', resize);

      document.body.classList.add('hackea-sync-active');
      root.setAttribute('aria-hidden', 'false');
      root.classList.remove('is-exit', 'phase-ring', 'phase-copy', 'phase-silence', 'is-short', 'is-day');
      root.classList.add('is-on');
      setCopy('', '', dayCopy ? dayCopy.kicker : 'SINCRONÍA');

      raf = requestAnimationFrame(drawFrame);
      if (dayCopy) runDayIntro();
      else if (opts && opts.short) runShort();
      else runFull();
    },

    cancel: function () {
      running = false;
      clearTimers();
      dayCopy = null;
      window.removeEventListener('resize', resize);
      document.body.classList.remove('hackea-sync-active');
      if (root) {
        root.classList.remove('is-on', 'is-exit', 'phase-ring', 'phase-copy', 'phase-silence', 'is-short', 'is-day');
        root.setAttribute('aria-hidden', 'true');
      }
      setCopy('', '', 'SINCRONÍA');
      onDone = null;
    },

    isRunning: function () {
      return running;
    }
  };

  global.HackeaSyncIntro = HackeaSyncIntro;
})(window);
