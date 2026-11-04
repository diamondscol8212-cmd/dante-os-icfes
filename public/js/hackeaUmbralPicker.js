/**
 * Picker instrumentado del Umbral — proceso + choice.
 * Reutilizable en Sin red / Tormenta / Eco.
 */
(function (global) {
  'use strict';

  let audioCtx = null;

  function ensureAudio() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (_) {
      return null;
    }
  }

  /** Onset multimodal único (~100 ms): tono + pulso. */
  function playQuietOnset() {
    const ctx = ensureAudio();
    if (ctx) {
      try {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(64, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.16);
      } catch (_) { /* ignore */ }
    }
    if (navigator.vibrate) {
      try { navigator.vibrate(18); } catch (_) { /* ignore */ }
    }
  }

  /**
   * @param {HTMLElement} box
   * @param {string} selector
   * @param {function} onCommit  (payload)
   * @returns {{ destroy: function }}
   */
  function attachInstrumentedPicker(box, selector, onCommit) {
    if (!box) return { destroy: function () {} };

    const t0 = performance.now();
    const tsStart = new Date().toISOString();
    const keys = [...box.querySelectorAll(selector)].map((el) => el.dataset.v || el.dataset.canal || '');
    const dwell = {};
    const enterCount = {};
    keys.forEach((k) => {
      if (!k) return;
      dwell[k] = 0;
      enterCount[k] = 0;
    });

    let choiceFirst = null;
    let choicePath = [];
    let switchCount = 0;
    let lastChoice = null;
    let armed = null;
    let armThenCancel = 0;
    let tFirstPointer = null;
    let tFirstSelect = null;
    let confirmStartedAt = null;
    let hoverUnique = new Set();
    let currentHover = null;
    let hoverEnterAt = null;
    let flipCount = 0;
    let lastDX = 0;
    let lastX = null;
    let lastY = null;
    let pointerType = 'unknown';
    let blurMs = 0;
    let blurStarted = null;
    let destroyed = false;
    let moveSampleN = 0;

    function keyOf(el) {
      if (!el) return null;
      return el.dataset.v || el.dataset.canal || null;
    }

    function onVisibility() {
      if (document.hidden) {
        blurStarted = performance.now();
      } else if (blurStarted != null) {
        blurMs += performance.now() - blurStarted;
        blurStarted = null;
      }
    }

    function endHover() {
      if (currentHover && hoverEnterAt != null) {
        dwell[currentHover] = (dwell[currentHover] || 0) + (performance.now() - hoverEnterAt);
      }
      currentHover = null;
      hoverEnterAt = null;
    }

    function beginHover(k, pointerTypeHint) {
      if (!k) return;
      if (tFirstPointer == null) tFirstPointer = performance.now() - t0;
      if (pointerTypeHint) pointerType = pointerTypeHint;
      if (currentHover === k) return;
      endHover();
      currentHover = k;
      hoverEnterAt = performance.now();
      enterCount[k] = (enterCount[k] || 0) + 1;
      hoverUnique.add(k);
    }

    function onPointerOver(e) {
      const btn = e.target.closest(selector);
      if (!btn || !box.contains(btn)) return;
      beginHover(keyOf(btn), e.pointerType);
    }

    function onPointerOut(e) {
      const btn = e.target.closest(selector);
      if (!btn) return;
      const related = e.relatedTarget && e.relatedTarget.closest
        ? e.relatedTarget.closest(selector)
        : null;
      const k = keyOf(btn);
      if (related && keyOf(related) === k) return;
      if (k && k === currentHover) endHover();
    }

    function onPointerMove(e) {
      const over = e.target.closest && e.target.closest(selector);
      if (!over || !box.contains(over)) return;
      if (tFirstPointer == null) tFirstPointer = performance.now() - t0;
      if (e.pointerType) pointerType = e.pointerType;
      beginHover(keyOf(over), e.pointerType);
      moveSampleN++;
      if (moveSampleN % 2 === 1) return;
      const x = e.clientX;
      const y = e.clientY;
      if (lastX != null) {
        const dx = x - lastX;
        if (lastDX !== 0 && dx !== 0 && Math.sign(dx) !== Math.sign(lastDX)) flipCount++;
        if (dx !== 0) lastDX = dx;
      }
      lastX = x;
      lastY = y;
    }

    function buildPayload(choice) {
      endHover();
      if (document.hidden && blurStarted != null) {
        blurMs += performance.now() - blurStarted;
        blurStarted = null;
      }
      const tCommit = performance.now() - t0;
      const confirmLatency = confirmStartedAt != null
        ? Math.max(0, performance.now() - confirmStartedAt)
        : 0;
      const tRead = tFirstPointer != null ? tFirstPointer : tCommit;
      return {
        choice,
        choice_first: choiceFirst,
        choice_path: choicePath.slice(),
        switch_count: switchCount,
        t_read: Math.round(tRead),
        t_first_select: tFirstSelect != null ? Math.round(tFirstSelect) : Math.round(tCommit),
        t_commit: Math.round(tCommit),
        confirm_latency: Math.round(confirmLatency),
        dwell: Object.assign({}, dwell),
        enter_count: Object.assign({}, enterCount),
        hover_unique: hoverUnique.size,
        arm_then_cancel: armThenCancel,
        flip_count: flipCount,
        pointer_type: pointerType,
        visibility_blur_ms: Math.round(blurMs),
        move_sample_n: moveSampleN,
        ts_start: tsStart,
        ts_end: new Date().toISOString(),
        // compat legado ritual
        v: choice,
        ms: Math.round(tCommit),
        mutations: switchCount
      };
    }

    function onClick(e) {
      if (destroyed) return;
      const btn = e.target.closest(selector);
      if (!btn || !box.contains(btn)) return;
      e.preventDefault();
      const v = keyOf(btn);
      if (!v) return;
      if (e.pointerType) pointerType = e.pointerType;
      if (tFirstPointer == null) tFirstPointer = performance.now() - t0;

      if (choiceFirst == null) choiceFirst = v;
      if (lastChoice && lastChoice !== v) switchCount++;
      if (!choicePath.length || choicePath[choicePath.length - 1] !== v) {
        choicePath.push(v);
      }
      if (tFirstSelect == null) tFirstSelect = performance.now() - t0;

      if (armed && armed !== v) armThenCancel++;

      box.querySelectorAll(selector).forEach((b) => {
        b.classList.remove('is-selected', 'is-armed');
        b.dataset.armed = '';
      });
      btn.classList.add('is-selected');

      if (armed !== v) {
        armed = v;
        btn.dataset.armed = '1';
        btn.classList.add('is-armed');
        confirmStartedAt = performance.now();
        lastChoice = v;
        return;
      }

      // segundo toque = commit
      lastChoice = v;
      const payload = buildPayload(v);
      destroy();
      if (typeof onCommit === 'function') onCommit(payload);
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      endHover();
      box.removeEventListener('click', onClick);
      box.removeEventListener('pointerover', onPointerOver);
      box.removeEventListener('pointerout', onPointerOut);
      box.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    }

    box.addEventListener('click', onClick);
    box.addEventListener('pointerover', onPointerOver);
    box.addEventListener('pointerout', onPointerOut);
    box.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return { destroy, t0 };
  }

  /** Clima Tormenta: onset agudo + rajaduras irregulares + stop limpio. */
  let stormTimer = null;
  let stormNodes = [];

  function stopStormClimate() {
    if (stormTimer) {
      clearInterval(stormTimer);
      stormTimer = null;
    }
    stormNodes.forEach((n) => {
      try {
        if (n.osc) n.osc.stop();
        if (n.osc) n.osc.disconnect();
        if (n.gain) n.gain.disconnect();
        if (n.noise) n.noise.stop();
        if (n.noise) n.noise.disconnect();
      } catch (_) { /* ignore */ }
    });
    stormNodes = [];
  }

  function burstNoise(ctx, dur, vol) {
    try {
      const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400 + Math.random() * 900;
      filter.Q.value = 0.8;
      src.buffer = buf;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      src.connect(filter);
      filter.connect(g);
      g.connect(ctx.destination);
      src.start();
      src.stop(ctx.currentTime + dur + 0.02);
      stormNodes.push({ noise: src, gain: g });
    } catch (_) { /* ignore */ }
  }

  function playStormOnset() {
    stopStormClimate();
    const ctx = ensureAudio();
    if (ctx) {
      try {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(220, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.22);
        stormNodes.push({ osc: o, gain: g });
        burstNoise(ctx, 0.12, 0.028);
      } catch (_) { /* ignore */ }
    }
    if (navigator.vibrate) {
      try { navigator.vibrate([22, 40, 16]); } catch (_) { /* ignore */ }
    }
  }

  function startStormClimate() {
    const ctx = ensureAudio();
    playStormOnset();
    let ticks = 0;
    stormTimer = setInterval(() => {
      ticks++;
      if (!ctx) return;
      burstNoise(ctx, 0.08 + Math.random() * 0.06, 0.012 + Math.random() * 0.014);
      if (navigator.vibrate && (ticks === 2 || ticks === 5 || ticks === 8)) {
        try { navigator.vibrate(10); } catch (_) { /* ignore */ }
      }
    }, 2800 + Math.floor(Math.random() * 900));
  }

  /** Eco: onset limpio (después de la tormenta), un solo evento. */
  function playEcoOnset() {
    stopStormClimate();
    const ctx = ensureAudio();
    if (ctx) {
      try {
        const now = ctx.currentTime;
        [392, 523.25].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(0.04 - i * 0.012, now + 0.04 + i * 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + i * 0.1);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + i * 0.06);
          o.stop(now + 0.7 + i * 0.1);
        });
      } catch (_) { /* ignore */ }
    }
    if (navigator.vibrate) {
      try { navigator.vibrate([12, 30, 12]); } catch (_) { /* ignore */ }
    }
  }

  global.UmbralOnset = {
    play: playQuietOnset,
    playStorm: playStormOnset,
    startStorm: startStormClimate,
    stopStorm: stopStormClimate,
    playEco: playEcoOnset
  };
  global.attachInstrumentedPicker = attachInstrumentedPicker;
})(window);
