/**
 * Modo Dante · Pulsos (Bloque 1, 2+).
 * Sondas de proceso + dilema B2 + cierre con descanso por capacidad.
 */
(function (global) {
  'use strict';

  const MIN_TRIALS = 3;
  const MAX_TRIALS_B1 = 5;
  const MAX_TRIALS_B2 = 7;

  const ECO_LINES = {
    structural: {
      wrong: 'Premisa → puente → dónde se rompe la opción que elegiste.',
      right: 'La estructura sostuvo tu respuesta.'
    },
    contrast: {
      wrong: 'Compara lo que pide el texto con lo que afirma la opción que elegiste.',
      right: 'El contraste sostuvo tu respuesta.'
    },
    narrative: {
      wrong: 'Si la escena no cabe, esa opción cae.',
      right: 'La escena sostuvo tu respuesta.'
    }
  };

  function clamp01(n) {
    return Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0.5));
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  class PulsoController {
    constructor() {
      this.mind = null;
      this.ritual = null;
      this.session = null;
      this.blockIndex = 1;
      this.campaignDay = 1;
      this.daySpec = null;
      this.dilemmaChoice = null;
      this.trials = [];
      this.usedIds = [];
      this.focusArea = 'lectura';
      this.focusMode = null;
      this._picker = null;
      this._timers = [];
      this._anclaUnlocked = false;
      this._pending = null;
      this._t0 = 0;
      this._ventanaTimer = null;
    }

    /**
     * @param {*} mind
     * @param {*} ritual
     * @param {{ blockIndex?: number, campaignDay?: number, focusArea?: string, focusMode?: string }} opts
     */
    start(mind, ritual, opts) {
      opts = opts || {};
      // Respiración obligatoria antes del primer ensayo del pulso
      if (!opts._yaRespiro && window.DanteExamWorkspace && typeof window.DanteExamWorkspace._abrirRespiracionDeEntrada === 'function') {
        const self = this;
        window.DanteExamWorkspace._abrirRespiracionDeEntrada(function () {
          self.start(mind, ritual, Object.assign({}, opts, { _yaRespiro: true }));
        }, false);
        return;
      }
      this.mind = mind;
      this.ritual = ritual;
      this.blockIndex = (opts && opts.blockIndex) || 1;
      this.campaignDay = (opts && opts.campaignDay) || this.blockIndex || 1;
      if (global.HackeaArc) {
        const st = global.HackeaArc.status();
        if (opts && opts.campaignDay) this.campaignDay = opts.campaignDay;
        else if (this.blockIndex === 1) this.campaignDay = 1;
        else if (st.next_campaign_day) this.campaignDay = st.next_campaign_day;
      }
      this.daySpec = global.HackeaCampaign
        ? global.HackeaCampaign.getDay(this.campaignDay)
        : null;
      this.dilemmaChoice = null;
      this.focusArea = (opts && opts.focusArea) || (this.blockIndex === 1 ? 'lectura' : 'lectura');
      this.focusMode = (opts && opts.focusMode) || null;
      this.trials = [];
      this.usedIds = [];
      this._clearTimers();
      this._destroyPicker();
      this._clearVentana();

      if (global.HackeaArc && this.blockIndex >= 2) {
        const st = global.HackeaArc.status();
        if (st.focus_area) this.focusArea = st.focus_area;
        if (st.focus_mode && !this.focusMode) this.focusMode = st.focus_mode;
      }
      if (this.daySpec && this.daySpec.preferModes && this.daySpec.preferModes.length && !this.focusMode) {
        this.focusMode = this.daySpec.preferModes[0];
      }

      const umbralId = ritual && ritual._umbralSessionId
        ? ritual._umbralSessionId
        : (global.UmbralVault && global.UmbralVault.getSession
          ? (global.UmbralVault.getSession() || {}).session_id
          : null);

      if (global.PulsoVault) {
        this.session = global.PulsoVault.beginSession({
          umbral_session_id: umbralId,
          block_index: this.blockIndex
        });
      } else {
        this.session = { session_id: 'local_' + Date.now(), trials: [] };
      }

      const view = document.getElementById('viewHackeaMente');
      if (view) {
        view.classList.remove(
          'hackea-en-cierre', 'hackea-en-eco', 'hackea-en-tormenta',
          'hackea-en-sinred', 'hackea-en-llegada', 'hackea-en-activacion'
        );
        view.classList.add('hackea-en-pulso');
        view.hidden = false;
        view.classList.add('active');
        view.style.display = 'flex';
      }

      if ((this.daySpec && this.daySpec.dilemma) || this.blockIndex >= 2) {
        this._runDilemma();
      } else {
        this._next();
      }
    }

    _stage() {
      return document.getElementById('hackeaRitualStage');
    }

    _canal() {
      const p = this.mind && this.mind.profile;
      return (p && p.lastCanal) || 'structural';
    }

    _policy() {
      if (this.mind && typeof this.mind.getPolicy === 'function') return this.mind.getPolicy();
      return { holdMs: 2200 };
    }

    _maxTrials() {
      if (this.daySpec && this.daySpec.nMax) return this.daySpec.nMax;
      return this.blockIndex >= 2 ? MAX_TRIALS_B2 : MAX_TRIALS_B1;
    }

    _minTrials() {
      if (this.daySpec && this.daySpec.nMin) return this.daySpec.nMin;
      return MIN_TRIALS;
    }

    _umbralFast() {
      try {
        const doc = global.UmbralVault && global.UmbralVault.getSession && global.UmbralVault.getSession();
        const ev = (doc && doc.events) || [];
        const eco = ev.filter((e) => e.act_key === 'eco' || e.act_key === 'sinred').slice(-1)[0];
        const lat = eco && (eco.confirm_latency || eco.t_commit || eco.ms);
        return typeof lat === 'number' && lat > 0 && lat < 900;
      } catch (_) {
        return false;
      }
    }

    _runDilemma() {
      const bank = global.HackeaPulsoBank;
      const probe = this.daySpec && this.daySpec.intellectProbe;
      const dil = bank && bank.pickDilemma(this.blockIndex, probe);
      const stage = this._stage();
      if (!dil || !stage) {
        this._next();
        return;
      }
      const skin = (this.daySpec && this.daySpec.present && this.daySpec.present.skin) || 'mente';
      const kicker = (this.daySpec && this.daySpec.kicker) || ('PULSO ' + this.blockIndex + ' · DILEMA');
      stage.innerHTML = `
        <div class="hackea-pulso hackea-dilemma hackea-skin-${esc(skin)}" id="hackeaDilemma">
          <div class="hackea-pulso-glow" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-pulso-sheet">
            <div class="hackea-pulso-top">
              <div class="hackea-act-label">${esc(kicker)}</div>
            </div>
            ${this.daySpec && this.daySpec.teach ? `<p class="hackea-teach">${esc(this.daySpec.teach)}</p>` : ''}
            <p class="hackea-pulso-stem">${esc(dil.prompt)}</p>
            <div class="hackea-pulso-opts" id="hackeaDilOpts">
              ${dil.options.map((o) => `
                <button type="button" class="hackea-pulso-opt" data-v="${esc(o.v)}">
                  <span class="pulso-main">
                    <span class="pulso-text">${esc(o.text)}</span>
                  </span>
                  <span class="pulso-confirm-hint" aria-hidden="true">Toca otra vez para confirmar</span>
                </button>`).join('')}
            </div>
            <p class="hackea-act-note">No hay nota. Solo eliges cómo responderías.</p>
          </div>
        </div>`;
      const root = stage.querySelector('#hackeaDilemma');
      this._clearTimers();
      this._timers.push(setTimeout(() => root?.classList.add('is-in'), 20));
      const box = stage.querySelector('#hackeaDilOpts');
      const finish = (proc) => {
        const v = proc.choice || proc.v;
        this.dilemmaChoice = v;
        if (global.PulsoVault) {
          global.PulsoVault.appendTrial({
            mode: 'dilemma',
            item_id: dil.id,
            area: 'proceso',
            letter: v,
            correct: true,
            latency_ms: proc.t_commit || proc.ms || 0,
            switch_count: proc.switch_count || 0,
            dilemma: true
          });
        }
        if (v === 'rush' || v === 'guess' || v === 'intuition') this.focusMode = 'ancla';
        else if (v === 'freeze' || v === 'reset') this.focusMode = 'duelo2';
        else if (v === 'commit' || v === 'anchor' || v === 'evidence') this.focusMode = this.focusMode || 'sello';
        else if (v === 'scene') this.focusMode = this.focusMode || 'estandar4';
        this._next();
      };
      if (global.attachInstrumentedPicker && box) {
        this._picker = global.attachInstrumentedPicker(box, '.hackea-pulso-opt', finish);
      } else {
        box?.addEventListener('click', (e) => {
          const btn = e.target.closest('.hackea-pulso-opt');
          if (!btn) return;
          finish({ choice: btn.dataset.v, v: btn.dataset.v, t_commit: 0, switch_count: 0 });
        });
      }
    }

    _pickMode() {
      const n = this.trials.filter((t) => !t.dilemma).length;
      const prefs = this.daySpec && this.daySpec.preferModes;
      if (n === 0) {
        if (this.focusMode) return this.focusMode;
        if (prefs && prefs.length) return prefs[0];
        if (this.blockIndex >= 2) return this.focusMode || 'duelo2';
        return this._umbralFast() ? 'ancla' : 'estandar4';
      }
      if (prefs && prefs.length && n < prefs.length) {
        return prefs[n % prefs.length];
      }
      const prev = this.trials.filter((t) => !t.dilemma).slice(-1)[0];
      if (!prev) return 'estandar4';
      const flips = prev.switch_count || 0;
      const ms = prev.latency_ms || 0;
      const ok = !!prev.correct;
      if (!ok && ms < 4500 && flips === 0) return 'ancla';
      if (flips >= 2 || prev.changed_on_seal) return 'duelo2';
      if (ok && ms < 3500 && flips === 0) return this.blockIndex >= 2 ? 'ventana' : 'sello';
      if (!ok && flips >= 1) return 'duelo2';
      if (n === 1) return 'duelo2';
      if (n >= 2 && ok && this.blockIndex >= 2) return 'ventana';
      if (n >= 2 && ok) return 'sello';
      return 'estandar4';
    }

    _pickArea() {
      const real = this.trials.filter((t) => !t.dilemma);
      const n = real.length;
      if (n === 0) return this.focusArea || 'lectura';
      const prev = real[n - 1];
      if (!prev.correct && prev.area) return prev.area;
      if (this.focusArea && n < 3) return this.focusArea;
      const order = ['matematicas', 'ciencias', 'sociales', 'ingles', 'lectura'];
      return order[n % order.length];
    }

    _shouldStop() {
      const real = this.trials.filter((t) => !t.dilemma);
      const n = real.length;
      const max = this._maxTrials();
      if (n < this._minTrials()) return false;
      if (n >= max) return true;
      const last3 = real.slice(-3);
      const clean = last3.every((t) => t.correct && (t.switch_count || 0) <= 1 && !t.changed_on_seal);
      if (clean && this.blockIndex === 1) return true;
      if (clean && n >= 4) return true;
      return false;
    }

    _next() {
      if (this._shouldStop()) {
        this._finish();
        return;
      }
      const mode = this._pickMode();
      const area = this._pickArea();
      const bank = global.HackeaPulsoBank;
      if (!bank) {
        this._finish();
        return;
      }
      const item = bank.pickUnused(this.usedIds, area, this.blockIndex);
      this.usedIds.push(item.id);
      const presented = bank.presentItem(item, mode);
      this._pending = { mode, item, presented, area: item.area };
      this._renderProbe();
    }

    _modeLabel(mode) {
      if (mode === 'duelo2') return 'DUELO · 2';
      if (mode === 'sello') return 'SELLO DOBLE';
      if (mode === 'ancla') return 'ANCLA';
      if (mode === 'ventana') return 'VENTANA';
      return 'ESTÁNDAR · 4';
    }

    _renderProbe() {
      const stage = this._stage();
      if (!stage || !this._pending) return;
      this._destroyPicker();
      this._clearVentana();
      this._anclaUnlocked = this._pending.mode !== 'ancla';
      const { mode, item, presented } = this._pending;
      const n = this.trials.filter((t) => !t.dilemma).length + 1;
      const holdMs = this._policy().holdMs || 2200;
      const present = (this.daySpec && this.daySpec.present) || {};
      const skin = present.skin || 'quiet';
      const letterSz = present.letterSize || 'md';
      const stemSz = present.stemSize || 'md';
      const motion = present.motion || 'none';
      const layout = present.layout || (mode === 'duelo2' ? 'duelo' : 'stack');
      const kicker = (this.daySpec && this.daySpec.kicker) || ('PULSO ' + this.blockIndex);
      const teach = this.daySpec && this.daySpec.teach;
      const showComp = present.showCompetencia;
      const compLabel = item.sub ? String(item.sub).replace(/_/g, ' ') : '';
      const previewOpen = global.HackeaArc && global.HackeaArc.isPreviewOpen && global.HackeaArc.isPreviewOpen();
      const useTimer = !previewOpen && (mode === 'ventana' || present.timer);
      const timerMs = typeof present.timer === 'number' ? present.timer : 16000;

      const optsHtml = presented.options.map((o) => `
        <button type="button" class="hackea-pulso-opt letter-${letterSz}" data-v="${o.letter}" data-letter="${o.letter}" data-ok="${o.isCorrect ? '1' : '0'}" ${mode === 'ancla' ? 'disabled' : ''}>
          <span class="pulso-main">
            <span class="pulso-letter">${o.letter}</span>
            <span class="pulso-text">${esc(o.text)}</span>
          </span>
          <span class="pulso-confirm-hint" aria-hidden="true">Toca otra vez para confirmar</span>
        </button>`).join('');

      stage.innerHTML = `
        <div class="hackea-pulso hackea-skin-${esc(skin)} motion-${esc(motion)}" id="hackeaPulso" data-mode="${mode}" data-layout="${esc(layout)}">
          <div class="hackea-pulso-glow" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-pulso-sheet">
            <div class="hackea-pulso-top">
              <div class="hackea-act-label">${esc(kicker)} · ${n}</div>
              <div class="hackea-pulso-mode">${this._modeLabel(mode)}</div>
            </div>
            ${teach && n === 1 ? `<p class="hackea-teach">${esc(teach)}</p>` : ''}
            ${showComp && compLabel ? `<p class="hackea-comp">Competencia · ${esc(compLabel)}</p>` : ''}
            ${useTimer ? '<div class="hackea-pulso-ventana"><div class="ventana-fill" id="hackeaVentanaFill"></div></div>' : ''}
            <div class="hackea-pulso-stem stem-${stemSz}" id="hackeaPulsoStem">${esc(item.texto)}</div>
            ${mode === 'ancla' ? `
              <div class="hackea-pulso-ancla" id="hackeaPulsoAncla">
                <button type="button" class="hackea-pulso-ancla-btn" id="hackeaAnclaHold">
                  <span class="ancla-fill" id="hackeaAnclaFill"></span>
                  <span class="ancla-label">Mantén pulsado: lee el enunciado primero</span>
                </button>
              </div>` : ''}
            <div class="hackea-pulso-opts layout-${esc(layout)} ${mode === 'ancla' ? 'is-locked' : ''}" id="hackeaPulsoOpts">
              ${optsHtml}
            </div>
            <p class="hackea-act-note">${
              mode === 'duelo2' ? 'Solo dos opciones. Elige la que sostiene el texto.'
                : mode === 'sello' ? 'Elige una letra. Luego confirmas o cambias.'
                : mode === 'ancla' ? 'Primero lee el enunciado. Después elige A, B, C o D.'
                : mode === 'ventana' || useTimer ? 'El tiempo aprieta. Elige tu respuesta.'
                : 'Toca una letra (A · B · C · D) y confirma.'
            }</p>
          </div>
        </div>`;

      const root = stage.querySelector('#hackeaPulso');
      this._clearTimers();
      this._timers.push(setTimeout(() => root?.classList.add('is-in'), 20));
      this._t0 = performance.now();

      if (useTimer) this._startVentana(timerMs);
      if (mode === 'ancla') this._bindAncla(holdMs);
      else this._bindOptions();
    }

    _startVentana(ms) {
      const fill = document.getElementById('hackeaVentanaFill');
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / ms);
        if (fill) fill.style.transform = 'scaleX(' + (1 - p) + ')';
        if (p >= 1) {
          this._ventanaTimer = null;
          return;
        }
        this._ventanaTimer = requestAnimationFrame(tick);
      };
      this._ventanaTimer = requestAnimationFrame(tick);
    }

    _clearVentana() {
      if (this._ventanaTimer) {
        cancelAnimationFrame(this._ventanaTimer);
        this._ventanaTimer = null;
      }
    }

    _bindAncla(holdMs) {
      const btn = document.getElementById('hackeaAnclaHold');
      const fill = document.getElementById('hackeaAnclaFill');
      if (!btn) return;
      let holding = false;
      let start = 0;
      let raf = 0;
      const stop = () => {
        holding = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (fill) fill.style.transform = 'scaleX(0)';
      };
      const tick = () => {
        if (!holding) return;
        const p = Math.min(1, (performance.now() - start) / holdMs);
        if (fill) fill.style.transform = 'scaleX(' + p + ')';
        if (p >= 1) {
          stop();
          this._unlockAncla();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      const down = (e) => { e.preventDefault(); holding = true; start = performance.now(); tick(); };
      const up = () => stop();
      btn.addEventListener('pointerdown', down);
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointerleave', up);
      btn.addEventListener('pointercancel', up);
    }

    _unlockAncla() {
      this._anclaUnlocked = true;
      const box = document.getElementById('hackeaPulsoOpts');
      const gate = document.getElementById('hackeaPulsoAncla');
      box?.classList.remove('is-locked');
      box?.querySelectorAll('.hackea-pulso-opt').forEach((b) => { b.disabled = false; });
      if (gate) gate.classList.add('is-done');
      this._t0 = performance.now();
      this._bindOptions();
    }

    _bindOptions() {
      const box = document.getElementById('hackeaPulsoOpts');
      if (!box) return;
      const mode = this._pending && this._pending.mode;

      const finishPick = (proc) => {
        const letter = proc.choice || proc.v;
        const btn = box.querySelector('[data-letter="' + letter + '"]');
        if (!btn) return;
        const isOk = btn.dataset.ok === '1';
        const latency = Math.round(performance.now() - this._t0);
        const base = Object.assign({}, proc || {}, {
          letter,
          correct: isOk,
          latency_ms: latency,
          switch_count: proc.switch_count || proc.mutations || 0,
          choice_path: proc.choice_path || [letter],
          confirm_latency: proc.confirm_latency || 0,
          dwell: proc.dwell || null,
          ancla: this._pending.mode === 'ancla',
          changed_on_seal: false,
          under_ventana: this._pending.mode === 'ventana'
        });
        if (mode === 'sello') this._runSello(base);
        else this._commitTrial(base);
      };

      if (global.attachInstrumentedPicker) {
        this._picker = global.attachInstrumentedPicker(box, '.hackea-pulso-opt', finishPick);
      } else {
        box.addEventListener('click', (e) => {
          const btn = e.target.closest('.hackea-pulso-opt');
          if (!btn || btn.disabled) return;
          finishPick({
            choice: btn.dataset.letter,
            v: btn.dataset.letter,
            switch_count: 0,
            choice_path: [btn.dataset.letter],
            confirm_latency: 0
          });
        });
      }
    }

    _runSello(base) {
      this._destroyPicker();
      const stage = this._stage();
      const sheet = stage && stage.querySelector('.hackea-pulso-sheet');
      if (!sheet) {
        this._commitTrial(base);
        return;
      }
      const letter = base.letter;
      const sealT0 = performance.now();
      const overlay = document.createElement('div');
      overlay.className = 'hackea-pulso-seal';
      overlay.innerHTML = `
        <p class="seal-kicker">SELLO</p>
        <p class="seal-q">Elegiste la opción <strong>${esc(letter)}</strong>. ¿Confirmas esa respuesta?</p>
        <div class="seal-actions">
          <button type="button" class="seal-btn seal-keep" data-a="keep">Confirmar respuesta ${esc(letter)}</button>
          <button type="button" class="seal-btn seal-change" data-a="change">Cambiar de opción</button>
        </div>`;
      sheet.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('is-on'));
      overlay.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-a]');
        if (!btn) return;
        const sealMs = Math.round(performance.now() - sealT0);
        if (btn.dataset.a === 'keep') {
          base.seal_ms = sealMs;
          this._commitTrial(base);
          return;
        }
        base.changed_on_seal = true;
        base.seal_ms = sealMs;
        overlay.remove();
        this._t0 = performance.now();
        this._bindOptionsOnceAfterChange(base);
      });
    }

    _bindOptionsOnceAfterChange(prevBase) {
      const box = document.getElementById('hackeaPulsoOpts');
      if (!box) {
        this._commitTrial(prevBase);
        return;
      }
      const finishPick = (proc) => {
        const letter = proc.choice || proc.v;
        const btn = box.querySelector('[data-letter="' + letter + '"]');
        if (!btn) return;
        this._commitTrial(Object.assign({}, proc || {}, prevBase || {}, {
          letter,
          correct: btn.dataset.ok === '1',
          latency_ms: Math.round(performance.now() - this._t0) + (prevBase.latency_ms || 0),
          switch_count: (prevBase.switch_count || 0) + 1 + (proc.switch_count || 0),
          choice_path: (prevBase.choice_path || []).concat(proc.choice_path || [letter]),
          confirm_latency: proc.confirm_latency || 0,
          ancla: false,
          changed_on_seal: true,
          seal_ms: prevBase.seal_ms || 0,
          first_letter: prevBase.letter
        }));
      };
      this._destroyPicker();
      if (global.attachInstrumentedPicker) {
        this._picker = global.attachInstrumentedPicker(box, '.hackea-pulso-opt', finishPick);
      }
    }

    _commitTrial(proc) {
      this._destroyPicker();
      this._clearVentana();
      const p = this._pending;
      if (!p) return;
      const trial = {
        mode: p.mode,
        item_id: p.item.id,
        area: p.item.area,
        sub: p.item.sub || null,
        b: p.item.b != null ? p.item.b : null,
        ok_letter: p.presented.okLetter,
        letter: proc.letter,
        correct: !!proc.correct,
        latency_ms: proc.latency_ms || 0,
        switch_count: proc.switch_count || 0,
        changed_on_seal: !!proc.changed_on_seal,
        seal_ms: proc.seal_ms || null,
        first_letter: proc.first_letter || null,
        ancla: !!proc.ancla,
        under_ventana: !!proc.under_ventana,
        choice_path: proc.choice_path || [],
        choice_first: proc.choice_first || null,
        confirm_latency: proc.confirm_latency || 0,
        dwell: proc.dwell || null,
        enter_count: proc.enter_count || null,
        hover_unique: proc.hover_unique != null ? proc.hover_unique : null,
        arm_then_cancel: proc.arm_then_cancel || 0,
        flip_count: proc.flip_count || 0,
        pointer_type: proc.pointer_type || null,
        t_read: proc.t_read != null ? proc.t_read : null,
        t_first_select: proc.t_first_select != null ? proc.t_first_select : null,
        t_commit: proc.t_commit != null ? proc.t_commit : null,
        campaign_day: this.campaignDay || null
      };
      this.trials.push(trial);
      if (global.PulsoVault) global.PulsoVault.appendTrial(trial);
      this._showFeedback(trial);
    }

    _showFeedback(trial) {
      const stage = this._stage();
      if (!stage) {
        this._next();
        return;
      }
      const canal = this._canal();
      const lines = ECO_LINES[canal] || ECO_LINES.structural;
      const body = trial.correct
        ? lines.right
        : `${lines.wrong}<span class="pulso-clave">Clave: ${esc(trial.ok_letter)}</span>`;

      stage.innerHTML = `
        <div class="hackea-pulso-fb ${trial.correct ? 'is-ok' : 'is-miss'}" id="hackeaPulsoFb">
          <div class="hackea-act-shell hackea-pulso-sheet">
            <div class="hackea-act-label">${trial.correct ? 'QUEDA' : 'ECO'}</div>
            <p class="hackea-prompt pulso-fb-copy">${body}</p>
          </div>
        </div>`;
      const root = stage.querySelector('#hackeaPulsoFb');
      this._clearTimers();
      this._timers.push(setTimeout(() => root?.classList.add('is-in'), 20));
      this._timers.push(setTimeout(() => this._next(), trial.correct ? 1000 : 2000));
    }

    _finish() {
      const real = this.trials.filter((t) => !t.dilemma);
      const n = real.length;
      const correctN = real.filter((t) => t.correct).length;
      const avgFlip = n ? real.reduce((s, t) => s + (t.switch_count || 0), 0) / n : 0;
      const avgMs = n ? real.reduce((s, t) => s + (t.latency_ms || 0), 0) / n : 0;
      const sealsChanged = real.filter((t) => t.changed_on_seal).length;
      const modes = [...new Set(real.map((t) => t.mode))];

      const latentsDelta = {
        sesgoCierre: sealsChanged > 0 || avgFlip > 1.2
          ? clamp01(0.35)
          : (avgMs < 4000 ? clamp01(0.72) : clamp01(0.5)),
        umbralCerteza: avgFlip > 1.5 ? clamp01(0.7) : clamp01(0.45),
        estabilidadRuido: clamp01(0.55 + (correctN / Math.max(1, n)) * 0.25 - avgFlip * 0.05),
        reservaCognitiva: clamp01(avgMs > 25000 ? 0.35 : (avgMs < 4000 ? 0.45 : 0.62))
      };

      if (this.mind && typeof this.mind.absorbPulse === 'function') {
        this.mind.absorbPulse({ latents: latentsDelta, trials: n, correctN, blockIndex: this.blockIndex });
      }

      let arcResult = null;
      if (global.HackeaArc) {
        arcResult = global.HackeaArc.sealBlock({
          block_index: this.blockIndex,
          campaign_day: this.campaignDay,
          trials: real,
          mind: this.mind,
          dilemma_choice: this.dilemmaChoice,
          session_id: this.session && this.session.session_id
        });
      }

      const derived = {
        n_trials: n,
        correct_n: correctN,
        avg_flip: Number(avgFlip.toFixed(2)),
        avg_ms: Math.round(avgMs),
        seals_changed: sealsChanged,
        modes,
        block_index: this.blockIndex,
        rest_ms: arcResult && arcResult.restMs,
        capacity: arcResult && arcResult.capacity
      };

      if (global.PulsoVault) {
        global.PulsoVault.sealSession({
          derived,
          seal: {
            latents: latentsDelta,
            last_canal: this._canal(),
            block_index: this.blockIndex,
            rest_ms: derived.rest_ms,
            capacity: derived.capacity
          }
        });
      }

      this._renderDone(derived, arcResult);
    }

    _renderDone(derived, arcResult) {
      const stage = this._stage();
      const view = document.getElementById('viewHackeaMente');
      if (view) {
        view.classList.remove('hackea-en-pulso');
        view.classList.add('hackea-en-cierre', 'hackea-en-sello-final');
      }
      if (!stage) {
        this.ritual && this.ritual.closeToSala && this.ritual.closeToSala();
        return;
      }

      const previewOpen = global.HackeaArc && global.HackeaArc.isPreviewOpen && global.HackeaArc.isPreviewOpen();
      const restLabel = previewOpen
        ? 'YA'
        : ((arcResult && global.HackeaArc)
          ? global.HackeaArc.formatDuration(arcResult.restMs)
          : 'unas horas');
      const dayN = this.campaignDay || this.blockIndex;
      const nextDay = Math.min(15, dayN + 1);
      const doneCamp = dayN >= 15;
      const teach = this.daySpec && this.daySpec.teach;

      stage.innerHTML = `
        <div class="hackea-sello-final" id="hackeaSelloFinal">
          <div class="sello-ring" aria-hidden="true"></div>
          <div class="sello-ring sello-ring-2" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-cierre-sheet sello-sheet">
            <div class="hackea-act-label">DÍA ${dayN} DE 15</div>
            <h2 class="hackea-act-title">${doneCamp ? 'Campaña sellada' : 'Día ' + dayN + ' sellado'}</h2>
            <p class="hackea-prompt hackea-cierre-copy">
              ${esc(teach || (derived.n_trials + ' ensayos. El mapa intelectual se afila.'))}
            </p>
            <div class="sello-rest">
              <span class="sello-rest-kicker">${previewOpen ? 'Preview abierta' : 'Descanso Hack'}</span>
              <span class="sello-rest-time" id="hackeaRestTime">${esc(restLabel)}</span>
              <span class="sello-rest-sub">${doneCamp
                ? 'El siguiente ciclo usará este mapa a favor del ICFES.'
                : (previewOpen
                  ? 'Sin espera: vuelve a la espiral y sigue al día ' + nextDay + '.'
                  : 'Día ' + nextDay + ' se abre según tu capacidad — no es el reloj de la sala.')}</span>
            </div>
            <p class="sello-cap-hint">Te leemos en cómo eliges tu respuesta. Sin informe. Con efecto.</p>
            <button type="button" class="hackea-exit-btn" id="hackeaBtnSalirPulso">Volver a la sala</button>
          </div>
        </div>`;

      this._clearTimers();
      this._timers.push(setTimeout(() => stage.querySelector('#hackeaSelloFinal')?.classList.add('is-in'), 30));
      stage.querySelector('#hackeaBtnSalirPulso')?.addEventListener('click', () => {
        view?.classList.remove('hackea-en-cierre', 'hackea-en-pulso', 'hackea-en-sello-final');
        if (global.HackeaArc) global.HackeaArc.syncPortal();
        if (this.ritual && this.ritual.closeToSala) this.ritual.closeToSala();
      });
    }

    _destroyPicker() {
      if (this._picker && typeof this._picker.destroy === 'function') {
        this._picker.destroy();
        this._picker = null;
      }
    }

    _clearTimers() {
      (this._timers || []).forEach(clearTimeout);
      this._timers = [];
    }
  }

  global.HackeaPulso = new PulsoController();
})(window);
