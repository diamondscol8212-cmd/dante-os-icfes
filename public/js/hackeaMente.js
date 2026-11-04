/**
 * Hackea tu mente — perfil oculto + ritual + política pedagógica (c-1.2.86+)
 * Entrada: espiral de la sala. El alumno no ve tipología; el estudio sí cambia.
 */
(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'dante_mind_profile_';
  const DEFAULT_LATENTS = {
    umbralCerteza: 0.5,
    estabilidadRuido: 0.5,
    sesgoCierre: 0.5,
    sensibilidadEstatus: 0.5,
    canalReentrada: 0.5,
    toleranciaVacio: 0.5,
    reservaCognitiva: 0.5
  };

  function clamp01(n) {
    return Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0.5));
  }

  function blend(prev, next, weight) {
    const w = clamp01(weight);
    return clamp01(prev * (1 - w) + next * w);
  }

  function studentKey() {
    try {
      const u = JSON.parse(localStorage.getItem('dante_user') || '{}');
      const id = u.document_id || u.estudiante || u.email || localStorage.getItem('dante_active_student');
      return String(id || 'anon').split('@')[0].toLowerCase();
    } catch (_) {
      return 'anon';
    }
  }

  class MindProfileEngine {
    constructor() {
      this.studentId = null;
      this.profile = null;
    }

    bindStudent(studentId) {
      this.studentId = String(studentId || studentKey());
      this.profile = this._load() || this._fresh();
      this._persist();
      this._syncPortalUi();
      return this.profile;
    }

    ensure() {
      if (!this.profile) this.bindStudent(studentKey());
      return this.profile;
    }

    _storageKey() {
      return STORAGE_PREFIX + (this.studentId || 'anon');
    }

    _fresh() {
      return {
        v: 1,
        latents: { ...DEFAULT_LATENTS },
        confidence: 0.15,
        calibratedAt: null,
        sessions: 0,
        lastCanal: 'structural',
        updatedAt: new Date().toISOString()
      };
    }

    _load() {
      try {
        const raw = localStorage.getItem(this._storageKey());
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.latents) return null;
        parsed.latents = { ...DEFAULT_LATENTS, ...parsed.latents };
        return parsed;
      } catch (_) {
        return null;
      }
    }

    _persist() {
      if (!this.profile) return;
      this.profile.updatedAt = new Date().toISOString();
      try {
        localStorage.setItem(this._storageKey(), JSON.stringify(this.profile));
      } catch (_) { /* quota */ }
    }

    isCalibrated() {
      return !!(this.profile && this.profile.calibratedAt);
    }

    getLatents() {
      this.ensure();
      return { ...(this.profile.latents || DEFAULT_LATENTS) };
    }

    getPolicy() {
      this.ensure();
      const L = this.getLatents();
      const conf = this.profile.confidence ?? 0.15;
      const weak = conf < 0.35;

      const holdMs = weak
        ? 2500
        : Math.round(1800 + L.sesgoCierre * 2200 - L.umbralCerteza * 400);

      const overconfidenceSec = weak
        ? 4.0
        : Math.max(2.2, 5.2 - L.sesgoCierre * 1.8 - (1 - L.toleranciaVacio) * 0.8);

      const lockMs = weak
        ? 3000
        : Math.round(2200 + (1 - L.estabilidadRuido) * 2800);

      const frenoSec = weak
        ? 10
        : Math.round(6 + (1 - L.reservaCognitiva) * 8 + (1 - L.estabilidadRuido) * 4);

      let scaffoldingMode = 'structural';
      if (L.canalReentrada >= 0.66) scaffoldingMode = 'narrative';
      else if (L.canalReentrada >= 0.33) scaffoldingMode = 'contrast';

      let modeHint = null;
      if (conf >= 0.55) {
        if (L.sesgoCierre > 0.7) {
          modeHint = 'Hoy te conviene decidir antes: dudar mucho casi no cambia la letra que eliges.';
        } else if (L.umbralCerteza > 0.7) {
          modeHint = 'Lee el enunciado un segundo antes de tocar una opción; te estabiliza más que saltar de letra en letra.';
        } else if (L.reservaCognitiva < 0.35) {
          modeHint = 'Bloques más cortos te rinden más hoy.';
        }
      }

      // Estilo de pistas que ya entiende Tutor (SOCRATICO / etc.)
      let estiloPistas = 'SOCRATICO';
      if (scaffoldingMode === 'narrative') estiloPistas = 'NARRATIVO';
      else if (scaffoldingMode === 'contrast') estiloPistas = 'CONTRASTE';

      return {
        holdMs: Math.max(1400, Math.min(4200, holdMs)),
        overconfidenceSec: Number(overconfidenceSec.toFixed(2)),
        lockMs: Math.max(1800, Math.min(6000, lockMs)),
        frenoSec: Math.max(5, Math.min(18, frenoSec)),
        scaffoldingMode,
        estiloPistas,
        modeHint,
        confidence: conf,
        calibrated: this.isCalibrated(),
        muteSocial: L.sensibilidadEstatus > 0.62
      };
    }

    shapeScaffolding(baseText) {
      const text = String(baseText || '').trim();
      if (!text) return text;
      if (!this.isCalibrated()) return text;
      const { scaffoldingMode, modeHint, confidence } = this.getPolicy();
      let shaped = text;

      if (scaffoldingMode === 'narrative') {
        shaped = `Imagina la escena del enunciado. ${text}`;
      } else if (scaffoldingMode === 'contrast') {
        shaped = `Compara lo que pide el texto con lo que afirma tu opción. ${text}`;
      } else {
        shaped = `Ancla: qué pide · qué dato usas · qué descarta la opción que vas a elegir. ${text}`;
      }

      if (modeHint && confidence >= 0.6 && Math.random() < 0.32) {
        shaped += ` — ${modeHint}`;
      }
      return shaped;
    }

    /** Reentrada post-fallo en workspace: misma puerta Eco, sin tipología. */
    shapeReentryFeedback(frase, esCorrecta) {
      const text = String(frase || '').trim();
      if (!text || esCorrecta || !this.isCalibrated()) return text;
      return this.shapeScaffolding(text);
    }

    /** Aplica estilo al storage que ya lee Tutor, sin revelar tipología. */
    syncTutorStyle() {
      try {
        const p = this.getPolicy();
        if (p.calibrated && p.confidence >= 0.4) {
          // Mapear canal Eco → valores que el tutor ya entiende + flags Dante
          const map = {
            NARRATIVO: 'ANALOGIAS',
            CONTRASTE: 'SOCRATICO',
            SOCRATICO: 'SOCRATICO'
          };
          localStorage.setItem('dante_estilo_pistas', map[p.estiloPistas] || 'SOCRATICO');
          localStorage.setItem('dante_mind_canal', p.scaffoldingMode || 'structural');
          localStorage.setItem('dante_mind_active', '1');
        }
      } catch (_) { /* ignore */ }
    }

    sealCalibration(extra = {}) {
      this.ensure();
      if (extra.latents) {
        Object.keys(extra.latents).forEach((k) => {
          if (k in this.profile.latents) {
            this.profile.latents[k] = clamp01(extra.latents[k]);
          }
        });
      }
      if (extra.lastCanal) this.profile.lastCanal = extra.lastCanal;
      this.profile.calibratedAt = new Date().toISOString();
      this.profile.sessions = (this.profile.sessions || 0) + 1;
      this.profile.confidence = Math.max(this.profile.confidence, 0.55);
      this._persist();
      this.syncTutorStyle();
      this._syncPortalUi();
      return this.getPolicy();
    }

    /** Primer pulso: mezcla latentes y sube confianza sin revelar tipología. */
    absorbPulse(summary = {}) {
      this.ensure();
      const L = summary.latents || {};
      Object.keys(L).forEach((k) => {
        if (k in this.profile.latents) {
          this.profile.latents[k] = blend(this.profile.latents[k], clamp01(L[k]), 0.45);
        }
      });
      const trials = summary.trials || 0;
      const bump = trials >= 4 ? 0.22 : 0.14;
      this.profile.confidence = Math.min(0.92, Math.max(this.profile.confidence, 0.55) + bump);
      this.profile.pulseAt = new Date().toISOString();
      this.profile.pulseTrials = trials;
      if (summary.blockIndex) this.profile.lastHackBlock = summary.blockIndex;
      this._persist();
      this.syncTutorStyle();
      this._syncPortalUi();
      return this.getPolicy();
    }

    /** Perfil intelectual interno (nunca tipología al alumno). */
    absorbIntellect(intel) {
      this.ensure();
      if (!intel) return;
      this.profile.intellect = Object.assign({}, this.profile.intellect || {}, intel);
      this._persist();
    }

    _syncPortalUi() {
      const orb = document.getElementById('contenedorOrbeDante');
      const cap = document.getElementById('hackeaPortalCaption');
      const on = this.isCalibrated();
      const pulsed = !!(this.profile && this.profile.pulseAt);
      document.body.classList.toggle('dante-mind-active', on);
      if (orb) {
        orb.classList.toggle('hackea-calibrada', on);
        orb.classList.toggle('hackea-pulsado', pulsed);
        orb.setAttribute('aria-label', on
          ? (pulsed ? 'Modo Dante activo — mantener para recalibrar' : 'Hackea tu mente — volver a calibrar')
          : 'Hackea tu mente — entrar al ritual');
      }
      if (cap && !cap.classList.contains('hackea-breach-cap')) {
        if (global.HackeaArc && typeof global.HackeaArc.syncPortal === 'function' && on && pulsed) {
          global.HackeaArc.syncPortal();
        } else if (on && pulsed) {
          cap.innerHTML = 'Modo Dante';
        } else if (on) {
          cap.innerHTML = 'Hackea · eco';
        } else {
          cap.innerHTML = 'Hackea tu mente';
        }
      }
      if (window.DanteSpiral && typeof window.DanteSpiral.setMode === 'function') {
        window.DanteSpiral.setMode(on ? 'focus' : 'idle');
        if (on) {
          setTimeout(() => {
            try { window.DanteSpiral.setMode('idle'); } catch (_) {}
          }, 1800);
        }
      }
    }
  }

  class HackeaRitualController {
    constructor(mind) {
      this.mind = mind;
      this.actIndex = 0;
      this.telemetry = { act1: null, act2: null, act3: null };
      this._timer = null;
      this._timers = [];
      this._picker = null;
      this._umbralSessionId = null;
    }

    open() {
      this.actIndex = 0;
      this.telemetry = { act1: null, act2: null, act3: null };
      this.mind.bindStudent(studentKey());
      if (global.UmbralVault) {
        const ses = global.UmbralVault.beginSession(studentKey());
        this._umbralSessionId = ses && ses.session_id;
      }
      document.body.classList.add('hackea-ritual-active');
      document.getElementById('viewHackeaMente')?.classList.remove(
        'hackea-en-llegada', 'hackea-en-sinred', 'hackea-en-tormenta', 'hackea-en-eco',
        'hackea-en-cierre', 'hackea-en-activacion', 'hackea-en-pulso'
      );
      this._showView(true);
      this._renderAct();
      if (window.DanteSpiral) window.DanteSpiral.setMode('focus');
    }

    closeToSala() {
      this._clearStorm();
      if (global.HackeaSyncIntro) global.HackeaSyncIntro.cancel();
      document.body.classList.remove('hackea-ritual-active', 'hackea-sync-active');
      document.getElementById('viewHackeaMente')?.classList.remove(
        'hackea-en-llegada', 'hackea-en-sinred', 'hackea-en-tormenta', 'hackea-en-eco',
        'hackea-en-cierre', 'hackea-en-activacion', 'hackea-en-pulso'
      );
      this._showView(false);
      this.mind._syncPortalUi();
      if (window.DanteSpiral) window.DanteSpiral.setMode('idle');
    }

    _showView(on) {
      const hackea = document.getElementById('viewHackeaMente');
      const gateway = document.getElementById('viewGateway');
      if (typeof AppController !== 'undefined' && AppController.cambiarVista) {
        AppController.cambiarVista(on ? 'viewHackeaMente' : 'viewGateway');
      } else {
        document.querySelectorAll('.app-view').forEach((v) => {
          v.classList.remove('active');
          v.style.display = 'none';
          v.hidden = true;
        });
        if (on && hackea) {
          hackea.classList.add('active');
          hackea.hidden = false;
          hackea.style.display = 'flex';
        } else if (gateway) {
          gateway.classList.add('active');
          gateway.hidden = false;
          gateway.style.display = '';
        }
      }
      // Cierre hermético: nunca dejar el umbral filtrando altura en la sala
      if (hackea) {
        if (on) {
          hackea.hidden = false;
          hackea.classList.add('active');
          hackea.style.display = 'flex';
        } else {
          hackea.hidden = true;
          hackea.classList.remove('active');
          hackea.style.display = 'none';
          const stage = document.getElementById('hackeaRitualStage');
          if (stage) stage.innerHTML = '';
        }
      }
    }

    _stage() {
      return document.getElementById('hackeaRitualStage');
    }

    _shell(stage, { label, title, body, note }) {
      stage.innerHTML = `
        <div class="hackea-act-shell">
          <div class="hackea-act-label">${label}</div>
          <h2 class="hackea-act-title">${title}</h2>
          <div class="hackea-act-body">${body}</div>
          ${note ? `<p class="hackea-act-note">${note}</p>` : ''}
        </div>`;
    }

    _renderAct() {
      const stage = this._stage();
      if (!stage) return;
      this._clearStorm();
      if (this.actIndex === 0) this._llegada(stage);
      else if (this.actIndex === 1) this._act1(stage);
      else if (this.actIndex === 2) this._act2(stage);
      else if (this.actIndex === 3) this._act3(stage);
      else this._cierre(stage);
    }

    /**
     * Llegada: contrato + mecanismo (sin promesa de puntaje).
     * Sincronía = cuerpo → Llegada = para qué → Umbral = mide.
     */
    _llegada(stage) {
      const view = document.getElementById('viewHackeaMente');
      if (view) view.classList.add('hackea-en-llegada');

      stage.innerHTML = `
        <div class="hackea-llegada" id="hackeaLlegada">
          <div class="hackea-llegada-glow" aria-hidden="true"></div>
          <p class="hl-kicker">HACKEA TU MENTE</p>
          <p class="hl-line" data-step="0">Pocas decisiones. Sin nota.</p>
          <p class="hl-line" data-step="1">Así Dante aprende cómo guiarte.</p>
          <p class="hl-line hl-line-impact" data-step="2">Para que el entrenamiento deje de ser genérico.</p>
          <button type="button" class="hl-cta" id="hackeaBtnEntrarUmbral" disabled>Empezar</button>
        </div>`;

      const root = stage.querySelector('#hackeaLlegada');
      const cta = stage.querySelector('#hackeaBtnEntrarUmbral');
      const lines = [...stage.querySelectorAll('.hl-line')];
      // 0.4 · 1.8 · 3.2 · CTA 4.6
      const delays = [400, 1800, 3200, 4600];

      this._clearTimers();
      lines.forEach((line) => line.classList.remove('is-on'));
      delays.slice(0, 3).forEach((ms, i) => {
        this._timers.push(setTimeout(() => {
          lines[i]?.classList.add('is-on');
          if (i === 2) root?.classList.add('is-impact');
        }, ms));
      });
      this._timers.push(setTimeout(() => {
        if (cta) {
          cta.disabled = false;
          cta.classList.add('is-on');
        }
      }, delays[3]));

      cta?.addEventListener('click', () => {
        if (cta.disabled) return;
        this._clearTimers();
        if (view) view.classList.remove('hackea-en-llegada');
        this.actIndex = 1;
        this._renderAct();
      });
    }

    _pickOnce(box, selector, onCommit) {
      // Legado Tormenta/Eco hasta instrumentarlos; Sin red usa attachInstrumentedPicker.
      let last = null;
      let mutations = 0;
      box.addEventListener('click', (e) => {
        const btn = e.target.closest(selector);
        if (!btn) return;
        const v = btn.dataset.v || btn.dataset.canal;
        if (last && last !== v) mutations++;
        last = v;
        box.querySelectorAll(selector).forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        if (!btn.dataset.armed) {
          box.querySelectorAll(selector).forEach((b) => { b.dataset.armed = ''; });
          btn.dataset.armed = '1';
          return;
        }
        onCommit(btn, mutations);
      });
    }

    /** Sin red — cuarto quieto + onset + picker instrumentado + bóveda. */
    _act1(stage) {
      const view = document.getElementById('viewHackeaMente');
      if (view) {
        view.classList.remove('hackea-en-llegada');
        view.classList.add('hackea-en-sinred');
      }

      stage.innerHTML = `
        <div class="hackea-sinred" id="hackeaSinRed">
          <div class="hackea-act-shell hackea-sinred-sheet">
            <div class="hackea-act-label">UMBRAL</div>
            <h2 class="hackea-act-title">Sin red</h2>
            <div class="hackea-act-body">
              <p class="hackea-prompt">Un compañero pide la respuesta de un ensayo que aún no entregas. Si la das, él sube; si no, queda atrás. Nadie se entera.</p>
              <div class="hackea-choices" id="hackeaAct1">
                <button type="button" class="hackea-choice" data-v="share">Se la paso</button>
                <button type="button" class="hackea-choice" data-v="hint">Solo una pista</button>
                <button type="button" class="hackea-choice" data-v="refuse">No comparto</button>
                <button type="button" class="hackea-choice" data-v="delay">Digo que después</button>
              </div>
            </div>
            <p class="hackea-act-note">Aquí no hay nota. Solo tu movimiento.</p>
          </div>
        </div>`;

      const root = stage.querySelector('#hackeaSinRed');
      const sheet = stage.querySelector('.hackea-sinred-sheet');
      const box = stage.querySelector('#hackeaAct1');

      // Entrada coreografiada: label → título → dilema → opciones juntas
      this._clearTimers();
      this._timers.push(setTimeout(() => root?.classList.add('is-in'), 30));
      this._timers.push(setTimeout(() => sheet?.classList.add('show-label'), 220));
      this._timers.push(setTimeout(() => sheet?.classList.add('show-title'), 420));
      this._timers.push(setTimeout(() => {
        sheet?.classList.add('show-prompt');
        if (global.UmbralOnset) global.UmbralOnset.play();
      }, 680));
      this._timers.push(setTimeout(() => sheet?.classList.add('show-choices'), 1020));

      const finish = (proc) => {
        if (view) view.classList.remove('hackea-en-sinred');
        const v = proc.choice || proc.v;
        const ms = proc.t_commit || proc.ms || 0;
        const mutations = proc.switch_count || proc.mutations || 0;

        // Semántica acto 1 + proceso completo
        this.telemetry.act1 = Object.assign({}, proc, {
          v,
          ms,
          mutations,
          cierre: (v === 'share' || v === 'refuse') ? 0.72 : 0.35,
          vacio: v === 'delay' ? 0.75 : (v === 'hint' ? 0.55 : 0.3),
          certeza: this._certezaFromProcess(proc)
        });

        if (global.UmbralVault) {
          global.UmbralVault.appendEvent(Object.assign({
            act_key: 'sin_red',
            session_id: this._umbralSessionId || null
          }, proc), studentKey());
        }

        this.actIndex = 2;
        this._renderAct();
      };

      if (global.attachInstrumentedPicker && box) {
        this._picker = global.attachInstrumentedPicker(box, '.hackea-choice', finish);
      } else {
        this._pickOnce(box, '.hackea-choice', (btn, mutations) => {
          finish({
            choice: btn.dataset.v,
            v: btn.dataset.v,
            ms: 0,
            mutations,
            switch_count: mutations,
            t_commit: 0,
            choice_first: btn.dataset.v,
            choice_path: [btn.dataset.v]
          });
        });
      }
    }

    _certezaFromProcess(proc) {
      const switches = proc.switch_count || 0;
      const flips = proc.flip_count || 0;
      const armCancel = proc.arm_then_cancel || 0;
      const tCommit = proc.t_commit || proc.ms || 0;
      let c = 0.55;
      if (tCommit < 2200) c -= 0.2;
      if (tCommit > 9000) c += 0.12;
      if (switches >= 2) c -= 0.15;
      if (armCancel >= 1) c -= 0.1;
      if (flips >= 6) c -= 0.08;
      if (switches === 0 && armCancel === 0 && tCommit > 3500 && tCommit < 12000) c += 0.1;
      return clamp01(c);
    }

    /** Tormenta — mismo juicio, otro aire: presión visible, sin auto-submit. */
    _act2(stage) {
      const PRESSURE_MS = 15000;
      const view = document.getElementById('viewHackeaMente');
      if (view) {
        view.classList.remove('hackea-en-sinred', 'hackea-en-llegada');
        view.classList.add('hackea-en-tormenta');
      }
      document.body.classList.add('hackea-interference');

      stage.innerHTML = `
        <div class="hackea-tormenta" id="hackeaTormenta">
          <div class="hackea-tormenta-veil" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-tormenta-sheet">
            <div class="hackea-tormenta-top">
              <div class="hackea-act-label">TORMENTA</div>
              <div class="hackea-pressure" aria-hidden="true">
                <div class="hackea-pressure-fill" id="hackeaPressureFill"></div>
              </div>
            </div>
            <h2 class="hackea-act-title">Mismo juicio · otro aire</h2>
            <div class="hackea-act-body">
              <p class="hackea-prompt hackea-prompt-storm">Quedan segundos del bloque. La última pregunta es larga. Si eliges ya una opción, cierras; si lees entero, el ritmo del grupo puede caer.</p>
              <div class="hackea-choices" id="hackeaAct2">
                <button type="button" class="hackea-choice" data-v="rush">Marco con lo que alcanzó</button>
                <button type="button" class="hackea-choice" data-v="read">Leo completo aunque se cierre</button>
                <button type="button" class="hackea-choice" data-v="skip">Salto y vuelvo si hay tiempo</button>
              </div>
            </div>
            <p class="hackea-act-note">El entorno empuja. Tú decides.</p>
          </div>
        </div>`;

      const root = stage.querySelector('#hackeaTormenta');
      const sheet = stage.querySelector('.hackea-tormenta-sheet');
      const fill = stage.querySelector('#hackeaPressureFill');
      const box = stage.querySelector('#hackeaAct2');
      const pressureStartedAt = performance.now();
      let pressureRaf = 0;
      let interferencePeak = false;

      this._clearTimers();
      this._timers.push(setTimeout(() => root?.classList.add('is-in'), 20));
      this._timers.push(setTimeout(() => {
        sheet?.classList.add('show-all');
        if (global.UmbralOnset && global.UmbralOnset.startStorm) {
          global.UmbralOnset.startStorm();
        } else if (global.UmbralOnset) {
          global.UmbralOnset.playStorm && global.UmbralOnset.playStorm();
        }
      }, 180));
      this._timers.push(setTimeout(() => {
        root?.classList.add('is-focus-shift');
        stage.classList.add('hackea-focus-shift');
        interferencePeak = true;
      }, 1600));

      const tickPressure = () => {
        const elapsed = performance.now() - pressureStartedAt;
        const p = Math.min(1, elapsed / PRESSURE_MS);
        if (fill) fill.style.transform = 'scaleX(' + (1 - p).toFixed(4) + ')';
        if (p >= 1) {
          root?.classList.add('is-pressure-empty');
          pressureRaf = 0;
          return;
        }
        pressureRaf = requestAnimationFrame(tickPressure);
      };
      pressureRaf = requestAnimationFrame(tickPressure);
      this._stormPressureRaf = () => {
        if (pressureRaf) cancelAnimationFrame(pressureRaf);
        pressureRaf = 0;
      };

      const finish = (proc) => {
        if (view) view.classList.remove('hackea-en-tormenta');
        if (this._stormPressureRaf) this._stormPressureRaf();
        if (global.UmbralOnset && global.UmbralOnset.stopStorm) global.UmbralOnset.stopStorm();

        const v = proc.choice || proc.v;
        const tCommit = proc.t_commit || proc.ms || 0;
        const underPressure = tCommit <= PRESSURE_MS;
        const commitVsPressure = PRESSURE_MS > 0 ? tCommit / PRESSURE_MS : 0;

        this.telemetry.act2 = Object.assign({}, proc, {
          v,
          ms: tCommit,
          mutations: proc.switch_count || proc.mutations || 0,
          estabilidad: v === 'read' ? 0.75 : (v === 'rush' ? 0.28 : 0.5),
          estatus: v === 'rush' ? 0.7 : 0.35,
          reserva: tCommit > 10000 ? 0.55 : (v === 'rush' ? 0.3 : 0.6),
          pressure_window_ms: PRESSURE_MS,
          commit_vs_pressure: Number(commitVsPressure.toFixed(3)),
          under_pressure: underPressure,
          interference_peak: interferencePeak,
          closure_under_noise: underPressure && (proc.switch_count || 0) <= 1 && v === 'rush'
        });

        if (global.UmbralVault) {
          global.UmbralVault.appendEvent(Object.assign({
            act_key: 'tormenta',
            session_id: this._umbralSessionId || null,
            pressure_window_ms: PRESSURE_MS,
            commit_vs_pressure: Number(commitVsPressure.toFixed(3)),
            under_pressure: underPressure,
            interference_peak: interferencePeak
          }, proc), studentKey());
        }

        this._clearStorm();
        this.actIndex = 3;
        this._renderAct();
      };

      if (global.attachInstrumentedPicker && box) {
        this._picker = global.attachInstrumentedPicker(box, '.hackea-choice', finish);
      } else {
        this._pickOnce(box, '.hackea-choice', (btn, mutations) => {
          finish({
            choice: btn.dataset.v,
            v: btn.dataset.v,
            ms: Math.round(performance.now() - pressureStartedAt),
            t_commit: Math.round(performance.now() - pressureStartedAt),
            mutations,
            switch_count: mutations,
            choice_first: btn.dataset.v,
            choice_path: [btn.dataset.v]
          });
        });
      }
    }

    /** Eco — tres puertas de reentrada; clima limpio tras la tormenta. */
    _act3(stage) {
      const view = document.getElementById('viewHackeaMente');
      if (view) {
        view.classList.remove('hackea-en-sinred', 'hackea-en-tormenta', 'hackea-en-llegada');
        view.classList.add('hackea-en-eco');
      }
      document.body.classList.remove('hackea-interference');
      if (global.UmbralOnset && global.UmbralOnset.stopStorm) global.UmbralOnset.stopStorm();

      stage.innerHTML = `
        <div class="hackea-eco" id="hackeaEco">
          <div class="hackea-eco-glow" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-eco-sheet">
            <div class="hackea-act-label">ECO</div>
            <h2 class="hackea-act-title">Cómo te vuelve la idea</h2>
            <div class="hackea-act-body">
              <p class="hackea-prompt">Fallaste un ítem de lectura. Dante puede devolverte el camino de tres formas. ¿Cuál te abre más?</p>
              <div class="hackea-channels" id="hackeaAct3">
                <button type="button" class="hackea-channel" data-v="structural" data-canal="structural" data-val="0.15">
                  <span class="ch-kicker">ESTRUCTURA</span>
                  <span class="ch-body">Premisa → puente → conclusión. Dónde se rompe tu opción.</span>
                </button>
                <button type="button" class="hackea-channel" data-v="contrast" data-canal="contrast" data-val="0.5">
                  <span class="ch-kicker">CONTRASTE</span>
                  <span class="ch-body">Lo que exige el texto frente a lo que afirma la opción que elegiste.</span>
                </button>
                <button type="button" class="hackea-channel" data-v="narrative" data-canal="narrative" data-val="0.85">
                  <span class="ch-kicker">ESCENA</span>
                  <span class="ch-body">Reconstruye la escena; si la opción no cabe, cae.</span>
                </button>
              </div>
            </div>
            <p class="hackea-act-note">Elige la puerta. Después el estudio hablará así.</p>
          </div>
        </div>`;

      const root = stage.querySelector('#hackeaEco');
      const sheet = stage.querySelector('.hackea-eco-sheet');
      const box = stage.querySelector('#hackeaAct3');

      this._clearTimers();
      this._timers.push(setTimeout(() => root?.classList.add('is-in'), 20));
      this._timers.push(setTimeout(() => {
        sheet?.classList.add('show-head');
        if (global.UmbralOnset && global.UmbralOnset.playEco) global.UmbralOnset.playEco();
      }, 200));
      this._timers.push(setTimeout(() => sheet?.classList.add('show-prompt'), 520));
      this._timers.push(setTimeout(() => sheet?.classList.add('show-doors'), 880));

      const finish = (proc) => {
        if (view) view.classList.remove('hackea-en-eco');
        const canal = proc.choice || proc.v || 'structural';
        const btn = box && box.querySelector('[data-canal="' + canal + '"]');
        const val = btn ? parseFloat(btn.dataset.val) : (canal === 'narrative' ? 0.85 : (canal === 'contrast' ? 0.5 : 0.15));

        this.telemetry.act3 = Object.assign({}, proc, {
          canal,
          val,
          v: canal,
          ms: proc.t_commit || proc.ms || 0,
          mutations: proc.switch_count || proc.mutations || 0
        });

        if (global.UmbralVault) {
          global.UmbralVault.appendEvent(Object.assign({
            act_key: 'eco',
            session_id: this._umbralSessionId || null,
            canal,
            canal_val: val
          }, proc), studentKey());
        }

        this._sellar();
      };

      if (global.attachInstrumentedPicker && box) {
        this._picker = global.attachInstrumentedPicker(box, '.hackea-channel', finish);
      } else {
        box?.addEventListener('click', (e) => {
          const btn = e.target.closest('.hackea-channel');
          if (!btn) return;
          finish({
            choice: btn.dataset.canal,
            v: btn.dataset.canal,
            canal: btn.dataset.canal,
            ms: 0,
            t_commit: 0,
            switch_count: 0,
            choice_first: btn.dataset.canal,
            choice_path: [btn.dataset.canal]
          });
        });
      }
    }

    _sellar() {
      const a1 = this.telemetry.act1 || {};
      const a2 = this.telemetry.act2 || {};
      const a3 = this.telemetry.act3 || {};
      const latents = {
        umbralCerteza: a1.certeza ?? 0.5,
        sesgoCierre: blend(a1.cierre ?? 0.5, a2.v === 'rush' ? 0.8 : 0.4, 0.4),
        toleranciaVacio: a1.vacio ?? 0.5,
        estabilidadRuido: a2.estabilidad ?? 0.5,
        sensibilidadEstatus: a2.estatus ?? 0.5,
        reservaCognitiva: a2.reserva ?? 0.5,
        canalReentrada: a3.val ?? 0.5
      };
      if ((a1.mutations || a1.switch_count || 0) + (a2.mutations || a2.switch_count || 0) >= 2) {
        latents.sesgoCierre = clamp01(latents.sesgoCierre - 0.15);
        latents.umbralCerteza = clamp01(latents.umbralCerteza + 0.1);
      }
      if (a2.under_pressure && (a2.switch_count || 0) >= 2) {
        latents.estabilidadRuido = clamp01((latents.estabilidadRuido ?? 0.5) - 0.12);
      }
      // Si dudó mucho en Sin red y eligió estructura → refuerzo de canal
      if ((a1.switch_count || 0) >= 2 && a3.canal === 'structural') {
        latents.canalReentrada = clamp01((latents.canalReentrada ?? 0.5) * 0.7 + 0.15 * 0.3);
      }
      const lastCanal = a3.canal || 'structural';
      this.mind.sealCalibration({ latents, lastCanal });
      if (global.UmbralVault) {
        global.UmbralVault.sealSession({
          derived: {
            vacilation_1: a1.switch_count || a1.mutations || 0,
            certeza_1: a1.certeza,
            conflict_pair: a1.choice_first && a1.choice && a1.choice_first !== a1.choice
              ? [a1.choice_first, a1.choice]
              : null,
            closure_under_noise: !!a2.closure_under_noise,
            under_pressure_2: !!a2.under_pressure,
            commit_vs_pressure_2: a2.commit_vs_pressure ?? null,
            estabilidad_2: a2.estabilidad ?? null,
            channel_pref: lastCanal,
            channel_val: a3.val ?? null,
            reentry_fit: {
              vacilation_1: a1.switch_count || 0,
              canal: lastCanal
            }
          },
          seal: { latents, last_canal: lastCanal }
        }, studentKey());
      }
      const view = document.getElementById('viewHackeaMente');
      if (view) view.classList.remove('hackea-en-eco');
      this.actIndex = 4;
      this._cierre(this._stage());
    }

    /** Activación (ex-cierre): el umbral selló; ahora empieza el Primer pulso. */
    _cierre(stage) {
      if (!stage) return;
      const view = document.getElementById('viewHackeaMente');
      if (view) {
        view.classList.remove('hackea-en-sinred', 'hackea-en-tormenta', 'hackea-en-eco', 'hackea-en-llegada', 'hackea-en-pulso');
        view.classList.add('hackea-en-activacion');
      }
      stage.innerHTML = `
        <div class="hackea-cierre hackea-activacion" id="hackeaActivacion">
          <div class="hackea-cierre-glow" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-cierre-sheet">
            <div class="hackea-act-label">MODO DANTE</div>
            <h2 class="hackea-act-title">Ya te escucha</h2>
            <p class="hackea-prompt hackea-cierre-copy">Primer pulso: preguntas reales. Sin ayudas. Sin pausa. Cómo eliges tu respuesta (A, B, C o D) cuenta.</p>
            <p class="hackea-cierre-sub">Tres a cinco ensayos. El formato cambia según cómo respondes.</p>
            <button type="button" class="hl-cta hackea-pulso-cta" id="hackeaBtnPulso">Empezar el pulso</button>
          </div>
        </div>`;
      this._clearTimers();
      this._timers.push(setTimeout(() => stage.querySelector('#hackeaActivacion')?.classList.add('is-in'), 20));
      stage.querySelector('#hackeaBtnPulso')?.addEventListener('click', () => {
        const startDay1 = () => {
          view?.classList.remove('hackea-en-activacion');
          if (global.HackeaPulso && typeof global.HackeaPulso.start === 'function') {
            global.HackeaPulso.start(this.mind, this, { blockIndex: 1, campaignDay: 1 });
          } else {
            this.closeToSala();
          }
        };
        // Intro de task-set del día 1 antes del primer ensayo
        if (global.HackeaCampaign && typeof global.HackeaCampaign.playDayIntro === 'function') {
          global.HackeaCampaign.playDayIntro(1, startDay1);
        } else {
          startDay1();
        }
      });
    }

    /** Día 2–15: intro pedagógica del día → puerta → pulso. */
    openNextPulso() {
      this.mind.bindStudent(studentKey());
      document.body.classList.add('hackea-ritual-active');
      this._showView(true);
      const st = global.HackeaArc ? global.HackeaArc.status() : { next_block: 2, next_campaign_day: 2 };
      const day = st.next_campaign_day || st.next_block || 2;
      const spec = global.HackeaCampaign ? global.HackeaCampaign.getDay(day) : null;
      const stage = this._stage();
      if (!stage) return;
      const view = document.getElementById('viewHackeaMente');
      if (view) view.classList.add('hackea-en-activacion');

      const showGate = () => {
        stage.innerHTML = `
          <div class="hackea-cierre hackea-activacion" id="hackeaActivacionB2">
            <div class="hackea-cierre-glow" aria-hidden="true"></div>
            <div class="hackea-act-shell hackea-cierre-sheet">
              <div class="hackea-act-label">${escHtml((spec && spec.kicker) || ('DÍA ' + day + ' DE 15'))}</div>
              <h2 class="hackea-act-title">${escHtml((spec && spec.title) || ('Pulso ' + (st.next_block || 2)))}</h2>
              <p class="hackea-prompt hackea-cierre-copy">${escHtml((spec && spec.teach) || 'Mismo estudio. Otro aire.')}</p>
              <p class="hackea-cierre-sub">Sin ayudas. La forma de la pregunta ya es tuya.</p>
              <button type="button" class="hl-cta hackea-pulso-cta" id="hackeaBtnPulso2">Entrar</button>
            </div>
          </div>`;
        this._clearTimers();
        this._timers.push(setTimeout(() => stage.querySelector('#hackeaActivacionB2')?.classList.add('is-in'), 20));
        stage.querySelector('#hackeaBtnPulso2')?.addEventListener('click', () => {
          view?.classList.remove('hackea-en-activacion');
          if (global.HackeaPulso) {
            global.HackeaPulso.start(this.mind, this, {
              blockIndex: st.next_block || day,
              campaignDay: day,
              focusArea: st.focus_area,
              focusMode: st.focus_mode
            });
          }
        });
      };

      // Intro del día = task-set (qué practicar hoy) antes de la puerta
      if (global.HackeaCampaign && typeof global.HackeaCampaign.playDayIntro === 'function') {
        stage.innerHTML = '';
        global.HackeaCampaign.playDayIntro(day, showGate);
      } else {
        showGate();
      }
    }

    /** Cooldown Hack visible (reloj propio). */
    showHackCooldown(st) {
      this.mind.bindStudent(studentKey());
      document.body.classList.add('hackea-ritual-active');
      this._showView(true);
      const stage = this._stage();
      if (!stage) return;
      stage.innerHTML = `
        <div class="hackea-cierre hackea-cooldown is-in" id="hackeaCooldown">
          <div class="hackea-cierre-glow" aria-hidden="true"></div>
          <div class="hackea-act-shell hackea-cierre-sheet">
            <div class="hackea-act-label">DESCANSO HACK</div>
            <h2 class="hackea-act-title">${escHtml(st.remaining_label || '…')}</h2>
            <p class="hackea-prompt hackea-cierre-copy">Este reloj no es el de la sala. Se abrió a tu capacidad tras el último pulso.</p>
            <p class="hackea-cierre-sub">Cuando llegue a cero, el siguiente pulso te espera en la espiral.</p>
            <button type="button" class="hackea-exit-btn" id="hackeaBtnCooldownSalir">Volver a la sala</button>
          </div>
        </div>`;
      stage.querySelector('#hackeaBtnCooldownSalir')?.addEventListener('click', () => this.closeToSala());
    }

    _clearTimers() {
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
      (this._timers || []).forEach(clearTimeout);
      this._timers = [];
    }

    _clearStorm() {
      document.body.classList.remove('hackea-interference');
      document.getElementById('viewHackeaMente')?.classList.remove('hackea-en-tormenta');
      this._stage()?.classList.remove('hackea-focus-shift');
      this._clearTimers();
      if (this._stormPressureRaf) {
        this._stormPressureRaf();
        this._stormPressureRaf = null;
      }
      if (global.UmbralOnset && global.UmbralOnset.stopStorm) {
        global.UmbralOnset.stopStorm();
      }
      if (this._picker && typeof this._picker.destroy === 'function') {
        this._picker.destroy();
        this._picker = null;
      }
    }
  }

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const mindProfile = new MindProfileEngine();
  const hackeaRitual = new HackeaRitualController(mindProfile);

  function danteMindPolicy() {
    mindProfile.ensure();
    return mindProfile.getPolicy();
  }

  const PORTAL_HOLD_MS = 3400;
  let portalHold = {
    active: false,
    completed: false,
    pointerId: null,
    start: 0,
    raf: 0,
    reverseRaf: 0,
    progress: 0
  };

  function dismissPortalOverlays() {
    try {
      localStorage.setItem('dante_pacto_accepted', localStorage.getItem('dante_pacto_accepted') || 'transient');
      const pacto = document.getElementById('modalPactoDante');
      if (pacto) {
        pacto.classList.add('hidden');
        pacto.style.setProperty('display', 'none', 'important');
        pacto.style.setProperty('visibility', 'hidden', 'important');
        pacto.style.setProperty('pointer-events', 'none', 'important');
        pacto.setAttribute('aria-hidden', 'true');
      }
      ['modalGuardarAvance', 'modalRegistro', 'modalCheckInEmocional', 'modalCalibracionBienvenida'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add('hidden');
          el.style.setProperty('display', 'none', 'important');
        }
      });
    } catch (_) { /* ignore */ }

    document.body.classList.remove('exam-mode');
    const hdr = document.getElementById('hdrExamenPrincipal');
    if (hdr) hdr.classList.remove('modo-examen');
  }

  function salaListaParaPortal() {
    const gw = document.getElementById('viewGateway');
    const ws = document.getElementById('viewWorkspace');
    const enExamen = !!(ws && ws.classList.contains('active') && getComputedStyle(ws).display !== 'none' && getComputedStyle(ws).visibility !== 'hidden');
    if (enExamen) return false;
    if (gw && !gw.classList.contains('active')) {
      gw.classList.add('active');
      gw.style.display = 'flex';
    }
    return true;
  }

  function syncPortalShell(t) {
    const orb = document.getElementById('contenedorOrbeDante');
    const cap = document.getElementById('hackeaPortalCaption');
    if (!orb) return;
    const bloom = Math.sin(Math.PI * Math.min(1, Math.max(0, t) / 0.72));
    const fold = Math.max(0, (t - 0.58) / 0.42);
    const scale = (1 + bloom * 0.2) * (1 - fold * 0.88);
    orb.style.transform = 'scale(' + Math.max(0.06, scale).toFixed(4) + ')';

    const stops = [
      [0, 242, 254],
      [231, 215, 195],
      [251, 191, 36],
      [251, 146, 160],
      [255, 248, 240]
    ];
    const pos = Math.min(1, Math.max(0, t)) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(pos));
    const u = pos - i;
    const r = Math.round(stops[i][0] + (stops[i + 1][0] - stops[i][0]) * u);
    const g = Math.round(stops[i][1] + (stops[i + 1][1] - stops[i][1]) * u);
    const b = Math.round(stops[i][2] + (stops[i + 1][2] - stops[i][2]) * u);
    const glow = (0.28 + bloom * 0.22 * (1 - fold)).toFixed(3);
    orb.style.filter = 'drop-shadow(0 0 ' + Math.round(10 + bloom * 16) + 'px rgba(' + r + ',' + g + ',' + b + ',' + glow + '))';

    if (cap) {
      if (t <= 0.02) {
        cap.innerHTML = 'Hackea tu mente<span class="hackea-hold-hint">Presiona la espiral</span>';
      } else if (t < 1) {
        cap.textContent = t < 0.55 ? 'Abriendo…' : 'Entra…';
        cap.style.color = 'rgba(' + r + ',' + g + ',' + b + ',0.9)';
        cap.style.letterSpacing = (0.2 + t * 0.28).toFixed(3) + 'em';
      }
    }
  }

  function clearPortalShell() {
    const orb = document.getElementById('contenedorOrbeDante');
    const cap = document.getElementById('hackeaPortalCaption');
    if (orb) {
      orb.classList.remove('hackea-breach', 'hackea-holding');
      orb.style.transform = '';
      orb.style.filter = '';
    }
    if (cap) {
      cap.classList.remove('hackea-breach-cap');
      cap.style.color = '';
      cap.style.letterSpacing = '';
      cap.innerHTML = 'Hackea tu mente<span class="hackea-hold-hint">Presiona la espiral</span>';
    }
  }

  function applyBreachProgress(t) {
    portalHold.progress = Math.max(0, Math.min(1, t));
    if (window.DanteSpiral && typeof window.DanteSpiral.setBreachProgress === 'function') {
      window.DanteSpiral.setBreachProgress(portalHold.progress);
    }
    syncPortalShell(portalHold.progress);
  }

  function openPortalAfterBreach() {
    clearPortalShell();
    portalHold.active = false;
    portalHold.completed = false;
    portalHold.pointerId = null;
    if (window.DanteSpiral) window.DanteSpiral.cancelPortalBreach();

    const calibrated = !!(mindProfile && typeof mindProfile.isCalibrated === 'function' && mindProfile.isCalibrated());
    const arcSt = global.HackeaArc ? global.HackeaArc.status() : { phase: 'none' };

    // Tras Bloque 1: cooldown propio o siguiente día de campaña (sin repetir umbral)
    if (calibrated && arcSt.last_block >= 1) {
      if (!arcSt.ready) {
        hackeaRitual.showHackCooldown(arcSt);
        return;
      }
      if ((arcSt.campaign_day || 0) >= 15) {
        hackeaRitual.showHackCooldown({
          remaining_label: 'Campaña completa',
          ready: true
        });
        return;
      }
      // La intro del día (task-set) vive en openNextPulso — no duplicar Sincronía corta
      hackeaRitual.openNextPulso();
      return;
    }

    const goUmbral = () => hackeaRitual.open();
    if (global.HackeaSyncIntro && typeof global.HackeaSyncIntro.play === 'function') {
      global.HackeaSyncIntro.play({ short: calibrated }, goUmbral);
    } else {
      goUmbral();
    }
  }

  function reversePortalHold() {
    if (portalHold.raf) cancelAnimationFrame(portalHold.raf);
    portalHold.raf = 0;
    portalHold.active = false;
    const from = portalHold.progress;
    const start = performance.now();
    const dur = 420 + from * 280;
    const step = (now) => {
      const u = Math.min(1, (now - start) / dur);
      applyBreachProgress(from * (1 - u));
      if (u >= 1) {
        portalHold.reverseRaf = 0;
        clearPortalShell();
        if (window.DanteSpiral) window.DanteSpiral.cancelPortalBreach();
        return;
      }
      portalHold.reverseRaf = requestAnimationFrame(step);
    };
    portalHold.reverseRaf = requestAnimationFrame(step);
  }

  function tickPortalHold(now) {
    if (!portalHold.active) return;
    const t = Math.min(1, (now - portalHold.start) / PORTAL_HOLD_MS);
    applyBreachProgress(t);
    if (t >= 1) {
      portalHold.active = false;
      portalHold.completed = true;
      portalHold.raf = 0;
      if (navigator.vibrate) {
        try { navigator.vibrate([30, 40, 70]); } catch (_) {}
      }
      openPortalAfterBreach();
      return;
    }
    portalHold.raf = requestAnimationFrame(tickPortalHold);
  }

  function startPortalHold(ev) {
    if (portalHold.active || portalHold.completed) return;
    if (document.body.classList.contains('hackea-ritual-active')) return;
    dismissPortalOverlays();
    if (!salaListaParaPortal()) return;

    if (portalHold.reverseRaf) {
      cancelAnimationFrame(portalHold.reverseRaf);
      portalHold.reverseRaf = 0;
    }

    const orb = document.getElementById('contenedorOrbeDante');
    const cap = document.getElementById('hackeaPortalCaption');
    if (orb) {
      orb.classList.add('hackea-breach', 'hackea-holding');
      try {
        if (ev && ev.pointerId != null) orb.setPointerCapture(ev.pointerId);
      } catch (_) { /* ignore */ }
    }
    if (cap) cap.classList.add('hackea-breach-cap');

    portalHold.active = true;
    portalHold.completed = false;
    portalHold.pointerId = ev && ev.pointerId != null ? ev.pointerId : null;
    portalHold.start = performance.now();
    portalHold.progress = 0;

    if (window.DanteSpiral && typeof window.DanteSpiral.beginPortalBreach === 'function') {
      window.DanteSpiral.beginPortalBreach();
    } else if (window.DanteSpiral) {
      window.DanteSpiral.setMode('breach');
    }

    if (navigator.vibrate) {
      try { navigator.vibrate(12); } catch (_) {}
    }

    applyBreachProgress(0);
    portalHold.raf = requestAnimationFrame(tickPortalHold);
  }

  function endPortalHold(ev) {
    if (!portalHold.active) return;
    if (ev && portalHold.pointerId != null && ev.pointerId != null && ev.pointerId !== portalHold.pointerId) return;
    if (portalHold.progress >= 0.97) {
      // casi completo: deja terminar
      return;
    }
    reversePortalHold();
  }

  /** Entrada programática (?hackea=1) o atajo: corre la explosión sola. */
  function enterHackeaFromPortal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (portalHold.active || document.body.classList.contains('hackea-ritual-active')) return;
    dismissPortalOverlays();
    if (!salaListaParaPortal()) return;

    const orb = document.getElementById('contenedorOrbeDante');
    const cap = document.getElementById('hackeaPortalCaption');
    if (orb) orb.classList.add('hackea-breach', 'hackea-holding');
    if (cap) cap.classList.add('hackea-breach-cap');
    portalHold.completed = true;

    const finish = () => {
      portalHold.completed = false;
      openPortalAfterBreach();
    };

    if (window.DanteSpiral && typeof window.DanteSpiral.playPortalBreach === 'function') {
      const start = performance.now();
      const dur = PORTAL_HOLD_MS;
      window.DanteSpiral.playPortalBreach(finish, dur);
      const mirror = (now) => {
        if (!portalHold.completed) return;
        const t = Math.min(1, (now - start) / dur);
        syncPortalShell(t);
        if (t < 1) requestAnimationFrame(mirror);
      };
      requestAnimationFrame(mirror);
    } else {
      setTimeout(finish, PORTAL_HOLD_MS);
    }
  }

  function onSpiralKeyDown(ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    if (ev.repeat) return;
    ev.preventDefault();
    startPortalHold(ev);
  }

  function onSpiralKeyUp(ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    endPortalHold(ev);
  }

  function onSpiralPointerDown(ev) {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    startPortalHold(ev);
  }

  function onSpiralPointerUp(ev) {
    endPortalHold(ev);
  }

  function onSpiralClick(ev) {
    // Solo presión mantenida abre; el click corto no dispara
    ev.preventDefault();
    ev.stopPropagation();
  }

  function bindSpiralDoor() {
    const orb = document.getElementById('contenedorOrbeDante');
    if (!orb) return;
    orb.removeEventListener('click', onSpiralClick);
    orb.removeEventListener('pointerdown', onSpiralPointerDown);
    orb.removeEventListener('pointerup', onSpiralPointerUp);
    orb.removeEventListener('pointercancel', onSpiralPointerUp);
    orb.removeEventListener('keydown', onSpiralKeyDown);
    orb.removeEventListener('keyup', onSpiralKeyUp);
    orb.dataset.hackeaBound = '1';
    orb.setAttribute('role', 'button');
    orb.setAttribute('aria-label', 'Hackea tu mente — mantén presionada la espiral');
    orb.title = 'Mantén presionada la espiral unos segundos';
    orb.removeAttribute('onclick');
    orb.tabIndex = 0;
    orb.style.pointerEvents = 'auto';
    orb.style.cursor = 'pointer';
    orb.style.touchAction = 'none';
    orb.addEventListener('click', onSpiralClick);
    orb.addEventListener('pointerdown', onSpiralPointerDown);
    orb.addEventListener('pointerup', onSpiralPointerUp);
    orb.addEventListener('pointercancel', onSpiralPointerUp);
    orb.addEventListener('lostpointercapture', onSpiralPointerUp);
    orb.addEventListener('keydown', onSpiralKeyDown);
    orb.addEventListener('keyup', onSpiralKeyUp);
    clearPortalShell();
    mindProfile.bindStudent(studentKey());
  }

  function bootHackeaDoor() {
    bindSpiralDoor();
    try {
      if (global.HackeaArc) global.HackeaArc.syncPortal();
      const q = new URLSearchParams(location.search);
      if (q.get('hackea') === '1') {
        setTimeout(() => enterHackeaFromPortal(), 400);
      }
    } catch (_) { /* ignore */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHackeaDoor);
  } else {
    bootHackeaDoor();
  }
  window.addEventListener('load', bindSpiralDoor);

  global.MindProfileEngine = MindProfileEngine;
  global.mindProfile = mindProfile;
  global.hackeaRitual = hackeaRitual;
  global.danteMindPolicy = danteMindPolicy;
  global.enterHackeaFromPortal = enterHackeaFromPortal;
})(window);
