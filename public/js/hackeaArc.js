/**
 * Arco Hackea — descanso y bloque N por capacidad del estudiante.
 * Reloj independiente de los 15 min de la sala.
 */
(function (global) {
  'use strict';

  /** TEMP preview: sin espera entre días (y sin ventana de presión en pulso). Quitar tras QA. */
  const HACKEA_PREVIEW_OPEN = true;

  const ARC_PREFIX = 'dante_mind_arc_v1:';
  const MS_H = 3600000;
  const MS_M = 60000;

  function clamp01(n) {
    return Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0.5));
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

  function readArc(sk) {
    try {
      const raw = localStorage.getItem(ARC_PREFIX + (sk || studentKey()));
      if (!raw) return null;
      const d = JSON.parse(raw);
      return d && d.schema === 1 ? d : null;
    } catch (_) {
      return null;
    }
  }

  function writeArc(doc, sk) {
    try {
      localStorage.setItem(ARC_PREFIX + (sk || studentKey()), JSON.stringify(doc));
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Capacidad 0–1 tras un pulso: reserva, estabilidad, acierto, carga de proceso.
   * Alta capacidad → descanso más corto y bloque siguiente más exigente.
   * Baja → más consolidación (sacar lo mejor sin quemar).
   */
  function computeCapacity(mind, trials) {
    const L = (mind && typeof mind.getLatents === 'function')
      ? mind.getLatents()
      : {};
    const list = Array.isArray(trials) ? trials : [];
    const n = Math.max(1, list.length);
    const correctN = list.filter((t) => t.correct).length;
    const acc = correctN / n;
    const avgFlip = list.reduce((s, t) => s + (t.switch_count || 0), 0) / n;
    const seals = list.filter((t) => t.changed_on_seal).length;
    const avgMs = list.reduce((s, t) => s + (t.latency_ms || 0), 0) / n;
    const fastWrong = list.filter((t) => !t.correct && (t.latency_ms || 0) < 4500).length;
    const anclaN = list.filter((t) => t.ancla || t.mode === 'ancla').length;

    const reserva = clamp01(L.reservaCognitiva ?? 0.5);
    const estab = clamp01(L.estabilidadRuido ?? 0.5);
    const processLoad = clamp01(avgFlip / 2.5 + seals / n);
    const timeStrain = avgMs > 22000 ? 0.35 : (avgMs < 3500 ? 0.28 : 0.08);
    const errorLoad = 1 - acc;

    const capacity = clamp01(
      0.32 * reserva +
      0.22 * estab +
      0.28 * acc -
      0.22 * processLoad -
      0.14 * errorLoad -
      0.12 * timeStrain
    );

    const weakAreas = {};
    list.forEach((t) => {
      if (!t.correct && t.area) weakAreas[t.area] = (weakAreas[t.area] || 0) + 1;
    });
    const focusArea = Object.keys(weakAreas).sort((a, b) => weakAreas[b] - weakAreas[a])[0] || 'lectura';

    let focusMode = 'estandar4';
    if (fastWrong >= 1 || (avgMs < 4000 && acc < 0.6)) focusMode = 'ancla';
    else if (avgFlip >= 1.4 || seals >= 1) focusMode = 'duelo2';
    else if (seals >= 1 || (acc >= 0.7 && avgFlip < 0.5)) focusMode = 'sello';
    else if (capacity >= 0.62) focusMode = 'ventana';

    return {
      capacity: Number(capacity.toFixed(3)),
      acc: Number(acc.toFixed(3)),
      avg_flip: Number(avgFlip.toFixed(2)),
      avg_ms: Math.round(avgMs),
      seals,
      fast_wrong: fastWrong,
      ancla_n: anclaN,
      focus_area: focusArea,
      focus_mode: focusMode,
      process_load: Number(processLoad.toFixed(3)),
      n_trials: list.length,
      correct_n: correctN
    };
  }

  /** Descanso Hack (ms) según capacidad y bloque. */
  function computeRestMs(cap, blockIndex) {
    const c = cap || {};
    const capacity = clamp01(c.capacity);
    const processLoad = clamp01(c.process_load);
    const errorLoad = 1 - clamp01(c.acc);
    const n = Math.max(3, c.n_trials || 3);
    const bi = Math.max(1, blockIndex || 1);

    // Alta capacidad: vuelve antes a un reto más duro.
    // Baja: consolida más (mejor versión de sí, no burnout).
    let rest = 2.2 * MS_H
      + (1 - capacity) * 12 * MS_H
      + processLoad * 3.5 * MS_H
      + errorLoad * 2.8 * MS_H
      + (n - 3) * 0.6 * MS_H;

    if (c.acc >= 0.8 && processLoad < 0.35 && capacity >= 0.55) {
      rest -= 1.8 * MS_H;
    }
    if (c.fast_wrong >= 2) rest += 2 * MS_H;

    // Ciclos tempranos: techo más alto; luego acelera el ritmo si ya rinde
    const minMs = capacity >= 0.7 ? 75 * MS_M : 90 * MS_M;
    const maxMs = bi <= 1 ? 30 * MS_H : (bi <= 3 ? 20 * MS_H : 14 * MS_H);

    return Math.max(minMs, Math.min(maxMs, Math.round(rest)));
  }

  function formatDuration(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h <= 0) return m <= 1 ? '1 min' : m + ' min';
    if (m === 0) return h === 1 ? '1 h' : h + ' h';
    return h + ' h ' + m + ' min';
  }

  function formatRemaining(untilTs) {
    const left = Math.max(0, (untilTs || 0) - Date.now());
    return formatDuration(left);
  }

  const HackeaArc = {
    studentKey,
    computeCapacity,
    computeRestMs,
    formatDuration,
    formatRemaining,

    get: function (sk) {
      return readArc(sk);
    },

    /** Tras sellar un pulso: agenda siguiente bloque + día de campaña 1–15. */
    sealBlock: function (payload, sk) {
      const key = sk || studentKey();
      const prev = readArc(key) || {
        schema: 1, student_key: key, blocks: [], campaign_day: 0, intellect: null
      };
      const blockIndex = (payload && payload.block_index) || (prev.blocks.length + 1) || 1;
      const campaignDay = Math.min(
        15,
        (payload && payload.campaign_day) || (prev.campaign_day || 0) + 1 || blockIndex
      );
      const trials = (payload && payload.trials) || [];
      const mind = payload && payload.mind;
      const cap = computeCapacity(mind, trials);
      const restMs = HACKEA_PREVIEW_OPEN ? 0 : computeRestMs(cap, blockIndex);
      const now = Date.now();
      const nextAt = now + restMs;

      let intellect = prev.intellect || null;
      if (global.HackeaCampaign && typeof global.HackeaCampaign.updateIntellect === 'function') {
        const daySpec = global.HackeaCampaign.getDay(campaignDay);
        intellect = global.HackeaCampaign.updateIntellect(
          prev.intellect,
          trials,
          payload && payload.dilemma_choice,
          daySpec
        );
      }

      // Routing predictivo: si hay intelecto, afina foco
      let focusMode = cap.focus_mode;
      let focusArea = cap.focus_area;
      if (intellect) {
        if (intellect.tempo < 0.38) focusMode = 'ancla';
        else if (intellect.metacog < 0.42) focusMode = 'sello';
        else if (intellect.evidence < 0.4) focusMode = 'duelo2';
        const dom = [
          ['lectura', intellect.verbal],
          ['matematicas', intellect.quantitative],
          ['ciencias', intellect.scientific],
          ['sociales', intellect.civic]
        ].sort((a, b) => a[1] - b[1])[0];
        if (dom && dom[1] < 0.45) focusArea = dom[0];
      }

      const entry = {
        block_index: blockIndex,
        campaign_day: campaignDay,
        sealed_at: new Date(now).toISOString(),
        session_id: (payload && payload.session_id) || null,
        capacity: cap,
        rest_ms: restMs,
        next_available_at: nextAt,
        focus_area: focusArea,
        focus_mode: focusMode,
        intellect_label: global.HackeaCampaign
          ? global.HackeaCampaign.intellectLabel(intellect)
          : null
      };
      prev.blocks.push(entry);
      prev.last_block = blockIndex;
      prev.next_block = blockIndex + 1;
      prev.campaign_day = campaignDay;
      prev.next_campaign_day = Math.min(15, campaignDay + 1);
      prev.next_available_at = nextAt;
      prev.focus_area = focusArea;
      prev.focus_mode = focusMode;
      prev.capacity = cap.capacity;
      prev.intellect = intellect;
      prev.updated_at = new Date().toISOString();
      writeArc(prev, key);

      if (mind && typeof mind.absorbIntellect === 'function') {
        mind.absorbIntellect(intellect);
      }

      this._syncRemote(prev);
      this.syncPortal();
      return { arc: prev, entry, restMs, capacity: cap, campaignDay, intellect };
    },

    isReady: function (sk) {
      if (HACKEA_PREVIEW_OPEN) {
        const arc = readArc(sk);
        return !!(arc && arc.last_block >= 1);
      }
      const arc = readArc(sk);
      if (!arc || !arc.next_available_at) {
        // Sin arco: si está calibrado, B1 ya pasó o no — ready solo si hay last_block
        return false;
      }
      return Date.now() >= arc.next_available_at;
    },

    hasCompletedBlock1: function (sk) {
      const arc = readArc(sk);
      return !!(arc && arc.last_block >= 1);
    },

    /** Flag preview: sin descanso / sin ventana de presión. */
    isPreviewOpen: function () {
      return HACKEA_PREVIEW_OPEN;
    },

    status: function (sk) {
      const arc = readArc(sk);
      if (!arc || !arc.last_block) {
        return { phase: 'none', ready: false, next_block: 1, campaign_day: 1 };
      }
      const ready = HACKEA_PREVIEW_OPEN || Date.now() >= (arc.next_available_at || 0);
      const nextDay = arc.next_campaign_day || Math.min(15, (arc.campaign_day || 1) + 1);
      return {
        phase: ready ? 'ready' : 'cooldown',
        ready,
        preview_open: HACKEA_PREVIEW_OPEN,
        next_block: arc.next_block || (arc.last_block + 1),
        last_block: arc.last_block,
        campaign_day: arc.campaign_day || arc.last_block,
        next_campaign_day: nextDay,
        remaining_label: ready ? null : formatRemaining(arc.next_available_at),
        remaining_ms: ready ? 0 : Math.max(0, arc.next_available_at - Date.now()),
        focus_area: arc.focus_area,
        focus_mode: arc.focus_mode,
        capacity: arc.capacity,
        intellect: arc.intellect || null
      };
    },

    syncPortal: function () {
      const capEl = document.getElementById('hackeaPortalCaption');
      const orb = document.getElementById('contenedorOrbeDante');
      if (!capEl || capEl.classList.contains('hackea-breach-cap')) return;
      const st = this.status();
      const calibrated = global.mindProfile && global.mindProfile.isCalibrated && global.mindProfile.isCalibrated();
      if (!calibrated) {
        capEl.innerHTML = 'Hackea tu mente';
        orb && orb.classList.remove('hackea-pulso-ready', 'hackea-pulso-wait');
        return;
      }
      if (!st.last_block) {
        capEl.innerHTML = 'Hackea · eco';
        return;
      }
      if (st.campaign_day >= 15 && st.ready) {
        capEl.innerHTML = 'Campaña completa';
        orb && orb.classList.add('hackea-pulso-ready');
        return;
      }
      if (st.ready) {
        capEl.innerHTML = 'Día ' + st.next_campaign_day + ' listo';
        orb && orb.classList.add('hackea-pulso-ready');
        orb && orb.classList.remove('hackea-pulso-wait');
      } else {
        capEl.innerHTML = 'Día ' + st.next_campaign_day + ' · ' + (st.remaining_label || '…');
        orb && orb.classList.add('hackea-pulso-wait');
        orb && orb.classList.remove('hackea-pulso-ready');
      }
    },

    _syncRemote: function (arc) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        try {
          const t = localStorage.getItem('dante_token') || localStorage.getItem('token');
          if (t) headers.Authorization = 'Bearer ' + t;
        } catch (_) { /* ignore */ }
        fetch('/api/v1/dante/mind/arc/seal', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            student_key: arc.student_key,
            last_block: arc.last_block,
            next_block: arc.next_block,
            campaign_day: arc.campaign_day,
            next_campaign_day: arc.next_campaign_day,
            next_available_at: arc.next_available_at
              ? new Date(arc.next_available_at).toISOString()
              : null,
            focus_area: arc.focus_area,
            focus_mode: arc.focus_mode,
            capacity: arc.capacity,
            intellect: arc.intellect,
            blocks: (arc.blocks || []).slice(-16)
          }),
          keepalive: true
        }).then(function (r) {
          if (!r.ok) console.warn('[HackeaArc] sync HTTP', r.status);
        }).catch(function (e) {
          console.warn('[HackeaArc] sync offline', e && e.message);
        });
      } catch (_) { /* ignore */ }
    }
  };

  // Refresco de caption en cooldown
  setInterval(function () {
    try {
      if (document.body.classList.contains('hackea-ritual-active')) return;
      HackeaArc.syncPortal();
    } catch (_) { /* ignore */ }
  }, 30000);

  global.HackeaArc = HackeaArc;
})(window);
