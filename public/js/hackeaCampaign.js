/**
 * Campaña Hackea · 15 días
 * Cada día = intro de task-set + presentación + foco pedagógico + sonda intelectual.
 * El alumno no ve arquetipos; ve una forma distinta de habitar la pregunta.
 */
(function (global) {
  'use strict';

  /**
   * intro → Sincronía day-mode (gating cognitivo antes del pulso)
   * present.skin → clase CSS `hackea-skin-*`
   */
  const DAYS = [
    {
      day: 1,
      phase: 'calibrate',
      kicker: 'DÍA 1 · PRIMERA LECTURA',
      title: 'Cómo marcas cuando nadie empuja',
      teach: 'Hoy solo miramos. Sin prisa inventada.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 1 · PRIMERA LECTURA',
        line: 'Hoy no hay prisa. Solo vemos cómo marcas.',
        hint: 'Sin cronómetro · Sin ruido'
      },
      nMin: 3, nMax: 5,
      preferModes: ['estandar4', 'ancla'],
      dilemma: false,
      intellectProbe: 'tempo',
      present: {
        skin: 'quiet', letterSize: 'md', stemSize: 'md',
        motion: 'none', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 2,
      phase: 'read',
      kicker: 'DÍA 2 · EL ENUNCIADO MANDA',
      title: 'Primero el texto, después la letra',
      teach: 'El ICFES premia quien ancla el enunciado antes de enamorar una opción.',
      intro: {
        ms: 5800,
        kicker: 'DÍA 2 · EL ENUNCIADO MANDA',
        line: 'Antes de la letra: el texto. Ancla ahí.',
        hint: 'Lee · Luego marca'
      },
      nMin: 3, nMax: 5,
      preferModes: ['ancla', 'estandar4'],
      dilemma: false,
      intellectProbe: 'verbal',
      present: {
        skin: 'stem-hero', letterSize: 'md', stemSize: 'xl',
        motion: 'breathe', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 3,
      phase: 'read',
      kicker: 'DÍA 3 · LETRA MAYÚSCULA',
      title: 'La marca es un acto, no un vistazo',
      teach: 'Agrandamos la letra para que sientas el peso de elegir.',
      intro: {
        ms: 5400,
        kicker: 'DÍA 3 · LETRA MAYÚSCULA',
        line: 'Hoy la letra pesa. Elegir es un acto.',
        hint: 'Toca · Confirma'
      },
      nMin: 3, nMax: 5,
      preferModes: ['estandar4', 'sello'],
      dilemma: true,
      intellectProbe: 'metacog',
      present: {
        skin: 'giant', letterSize: 'xxl', stemSize: 'md',
        motion: 'none', timer: false, layout: 'stack', giantLetters: true
      }
    },
    {
      day: 4,
      phase: 'read',
      kicker: 'DÍA 4 · AIRE INESTABLE',
      title: 'Misma pregunta, otro cuerpo',
      teach: 'En el examen el salón no está quieto. Aquí ensayamos micro-ruido.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 4 · AIRE INESTABLE',
        line: 'El salón se mueve. Tú no sueltas el enunciado.',
        hint: 'Misma pregunta · Otro cuerpo'
      },
      nMin: 3, nMax: 5,
      preferModes: ['estandar4', 'duelo2'],
      dilemma: false,
      intellectProbe: 'tempo',
      present: {
        skin: 'drift', letterSize: 'lg', stemSize: 'md',
        motion: 'drift', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 5,
      phase: 'attack',
      kicker: 'DÍA 5 · VENTANA',
      title: 'Decidir con el aire corto',
      teach: 'No es cronómetro de examen: es pulso. Aprendes a no congelarte.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 5 · VENTANA',
        line: 'El aire se acorta. Decides sin congelarte.',
        hint: 'Pulso · No pánico'
      },
      nMin: 4, nMax: 6,
      preferModes: ['ventana', 'duelo2'],
      dilemma: true,
      intellectProbe: 'evidence',
      present: {
        skin: 'ventana', letterSize: 'lg', stemSize: 'md',
        motion: 'breathe', timer: 16000, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 6,
      phase: 'attack',
      kicker: 'DÍA 6 · DUELO',
      title: 'Dos caminos. Uno sostiene el texto',
      teach: 'Cuando solo quedan dos, aparece tu conflicto real.',
      intro: {
        ms: 5400,
        kicker: 'DÍA 6 · DUELO',
        line: 'Dos caminos. Uno sostiene el texto.',
        hint: 'Descarta · Sostén'
      },
      nMin: 4, nMax: 6,
      preferModes: ['duelo2', 'sello'],
      dilemma: false,
      intellectProbe: 'analytic',
      present: {
        skin: 'duelo', letterSize: 'xl', stemSize: 'md',
        motion: 'none', timer: false, layout: 'duelo', giantLetters: true
      }
    },
    {
      day: 7,
      phase: 'attack',
      kicker: 'DÍA 7 · SELLO',
      title: '¿La sostienes?',
      teach: 'La metacognición se entrena: confirmar o cambiar con razón.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 7 · SELLO',
        line: 'Marcas. Luego te preguntas: ¿la sostengo?',
        hint: 'Confirmar · O cambiar con razón'
      },
      nMin: 4, nMax: 6,
      preferModes: ['sello', 'ancla'],
      dilemma: true,
      intellectProbe: 'metacog',
      present: {
        skin: 'sello', letterSize: 'xl', stemSize: 'md',
        motion: 'none', timer: false, layout: 'stack', giantLetters: true
      }
    },
    {
      day: 8,
      phase: 'attack',
      kicker: 'DÍA 8 · FLANCO',
      title: 'Donde más te cuesta, ahí vamos',
      teach: 'El estudio ya apunta al área que dejó huella.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 8 · FLANCO',
        line: 'Hoy vamos al flanco que ya dejó huella.',
        hint: 'Tu zona débil · Con método'
      },
      nMin: 4, nMax: 6,
      preferModes: ['ancla', 'duelo2', 'ventana'],
      dilemma: false,
      intellectProbe: 'domain',
      present: {
        skin: 'flanco', letterSize: 'lg', stemSize: 'lg',
        motion: 'breathe', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 9,
      phase: 'transfer',
      kicker: 'DÍA 9 · COMPETENCIA',
      title: 'Qué mide la pregunta (sin regalar la clave)',
      teach: 'Empiezas a ver el ICFES como habilidad, no como azar.',
      intro: {
        ms: 5800,
        kicker: 'DÍA 9 · COMPETENCIA',
        line: 'La pregunta mide una habilidad. No es azar.',
        hint: 'Qué pide · Qué mides'
      },
      nMin: 4, nMax: 6,
      preferModes: ['estandar4', 'sello'],
      dilemma: false,
      intellectProbe: 'abstraction',
      present: {
        skin: 'academia', letterSize: 'md', stemSize: 'lg',
        motion: 'none', timer: false, layout: 'stack', giantLetters: false,
        showCompetencia: true
      }
    },
    {
      day: 10,
      phase: 'transfer',
      kicker: 'DÍA 10 · CÓMO APRENDES',
      title: 'Tu forma de entender',
      teach: 'Un dilema intelectual: no hay nota, hay mapa.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 10 · CÓMO APRENDES',
        line: 'Hoy no hay nota. Hay mapa de cómo entiendes.',
        hint: 'Estructura · O escena'
      },
      nMin: 3, nMax: 5,
      preferModes: ['estandar4', 'duelo2'],
      dilemma: true,
      intellectProbe: 'learning',
      present: {
        skin: 'mente', letterSize: 'lg', stemSize: 'md',
        motion: 'breathe', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 11,
      phase: 'transfer',
      kicker: 'DÍA 11 · PRESIÓN FINA',
      title: 'Ruido + tiempo + elección',
      teach: 'Combinamos lo que ya sabes hacer bajo aire difícil.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 11 · PRESIÓN FINA',
        line: 'Ruido, tiempo y elección a la vez. Tú ya sabes.',
        hint: 'Combina · No te pierdas'
      },
      nMin: 4, nMax: 7,
      preferModes: ['ventana', 'ancla', 'duelo2'],
      dilemma: false,
      intellectProbe: 'tempo',
      present: {
        skin: 'tormenta-lite', letterSize: 'lg', stemSize: 'md',
        motion: 'shake-soft', timer: 14000, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 12,
      phase: 'transfer',
      kicker: 'DÍA 12 · CUADERNILLO',
      title: 'Cara de examen, alma de Hack',
      teach: 'Tipografía limpia. Sin ayudas. Como el día real, pero corto.',
      intro: {
        ms: 5400,
        kicker: 'DÍA 12 · CUADERNILLO',
        line: 'Cara de cuadernillo. Sin ayudas. Corto y limpio.',
        hint: 'Como el día real'
      },
      nMin: 5, nMax: 7,
      preferModes: ['estandar4', 'sello'],
      dilemma: false,
      intellectProbe: 'domain',
      present: {
        skin: 'examen', letterSize: 'md', stemSize: 'md',
        motion: 'none', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 13,
      phase: 'seal',
      kicker: 'DÍA 13 · PREDICCIÓN',
      title: 'El estudio ya anticipa tu flanco',
      teach: 'Hoy el formato nace de tu historial. Eso es leerte.',
      intro: {
        ms: 5800,
        kicker: 'DÍA 13 · PREDICCIÓN',
        line: 'Hoy el formato nace de ti. El estudio ya te lee.',
        hint: 'Tu historial · Tu flanco'
      },
      nMin: 4, nMax: 6,
      preferModes: null,
      dilemma: true,
      intellectProbe: 'predictive',
      present: {
        skin: 'predictivo', letterSize: 'xl', stemSize: 'lg',
        motion: 'breathe', timer: false, layout: 'stack', giantLetters: true
      }
    },
    {
      day: 14,
      phase: 'seal',
      kicker: 'DÍA 14 · SÍNTESIS',
      title: 'Todo lo que aprendiste a marcar',
      teach: 'Mezcla de modos. Tu perfil intelectual se compacta.',
      intro: {
        ms: 5600,
        kicker: 'DÍA 14 · SÍNTESIS',
        line: 'Mezcla de modos. Compactamos lo que ya sabes marcar.',
        hint: 'Duelo · Sello · Ventana · Ancla'
      },
      nMin: 5, nMax: 7,
      preferModes: ['duelo2', 'sello', 'ventana', 'ancla'],
      dilemma: false,
      intellectProbe: 'synthesis',
      present: {
        skin: 'sintesis', letterSize: 'lg', stemSize: 'md',
        motion: 'none', timer: false, layout: 'stack', giantLetters: false
      }
    },
    {
      day: 15,
      phase: 'seal',
      kicker: 'DÍA 15 · SELLO DE CAMPAÑA',
      title: 'Quince días. Ya hay mapa',
      teach: 'Cierre. El siguiente ciclo hackea a favor del ICFES con este mapa.',
      intro: {
        ms: 6200,
        kicker: 'DÍA 15 · SELLO',
        line: 'Quince días. Ya hay mapa. Cierra con claridad.',
        hint: 'Sello de campaña'
      },
      nMin: 5, nMax: 7,
      preferModes: ['estandar4', 'sello', 'duelo2'],
      dilemma: true,
      intellectProbe: 'seal',
      present: {
        skin: 'campana', letterSize: 'xl', stemSize: 'lg',
        motion: 'breathe', timer: false, layout: 'stack', giantLetters: true
      }
    }
  ];

  const INTELLECT_DEFAULT = {
    verbal: 0.5,
    quantitative: 0.5,
    scientific: 0.5,
    civic: 0.5,
    tempo: 0.5,
    abstraction: 0.5,
    metacog: 0.5,
    evidence: 0.5,
    learning: 0.5
  };

  function clamp01(n) {
    return Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0.5));
  }

  function blend(a, b, w) {
    return clamp01(a * (1 - w) + b * w);
  }

  function getDay(n) {
    const d = Math.max(1, Math.min(15, Number(n) || 1));
    return DAYS[d - 1];
  }

  /** Reproduce la intro de task-set del día (Sincronía en modo campaña). */
  function playDayIntro(dayNum, done) {
    const spec = getDay(dayNum);
    const intro = (spec && spec.intro) || {};
    if (global.HackeaSyncIntro && typeof global.HackeaSyncIntro.play === 'function') {
      global.HackeaSyncIntro.play({
        dayIntro: true,
        ms: intro.ms || 5400,
        kicker: intro.kicker || (spec && spec.kicker) || ('DÍA ' + dayNum),
        line: intro.line || (spec && spec.title) || '',
        hint: intro.hint || (spec && spec.teach) || ''
      }, typeof done === 'function' ? done : function () {});
      return;
    }
    if (typeof done === 'function') done();
  }

  function updateIntellect(prev, trials, dilemmaChoice, daySpec) {
    const intel = Object.assign({}, INTELLECT_DEFAULT, prev || {});
    const list = (trials || []).filter((t) => !t.dilemma);
    const n = Math.max(1, list.length);
    const byArea = { lectura: [], matematicas: [], ciencias: [], sociales: [], ingles: [] };
    list.forEach((t) => {
      if (byArea[t.area]) byArea[t.area].push(t);
    });
    function areaAcc(a) {
      const xs = byArea[a];
      if (!xs || !xs.length) return null;
      return xs.filter((t) => t.correct).length / xs.length;
    }
    [['verbal', 'lectura'], ['verbal', 'ingles'], ['quantitative', 'matematicas'],
      ['scientific', 'ciencias'], ['civic', 'sociales']].forEach(([key, area]) => {
      const acc = areaAcc(area);
      if (acc != null) intel[key] = blend(intel[key], acc, 0.35);
    });

    const avgMs = list.reduce((s, t) => s + (t.latency_ms || 0), 0) / n;
    const avgFlip = list.reduce((s, t) => s + (t.switch_count || 0), 0) / n;
    const tempoSignal = clamp01((avgMs - 5000) / 25000) * 0.7 + clamp01(1 - Math.abs(avgFlip - 1) / 3) * 0.3;
    intel.tempo = blend(intel.tempo, tempoSignal, 0.3);

    const seals = list.filter((t) => t.mode === 'sello' || t.changed_on_seal != null);
    if (seals.length) {
      let meta = 0.5;
      seals.forEach((t) => {
        if (t.changed_on_seal && !t.correct) meta += 0.15;
        if (!t.changed_on_seal && t.correct) meta += 0.12;
        if (t.changed_on_seal && t.correct) meta -= 0.08;
        if (!t.changed_on_seal && !t.correct) meta -= 0.1;
      });
      intel.metacog = blend(intel.metacog, clamp01(meta), 0.4);
    }

    const hard = list.filter((t) => (t.b != null ? t.b : 0) >= 0.4);
    if (hard.length) {
      intel.abstraction = blend(
        intel.abstraction,
        hard.filter((t) => t.correct).length / hard.length,
        0.35
      );
    }

    const v = dilemmaChoice;
    if (v === 'anchor' || v === 'commit' || v === 'evidence') {
      intel.evidence = blend(intel.evidence, 0.75, 0.4);
      intel.learning = blend(intel.learning, 0.7, 0.35);
    } else if (v === 'rush' || v === 'guess' || v === 'intuition') {
      intel.evidence = blend(intel.evidence, 0.25, 0.4);
      intel.tempo = blend(intel.tempo, 0.25, 0.35);
    } else if (v === 'scene' || v === 'narrative') {
      intel.learning = blend(intel.learning, 0.25, 0.4);
      intel.verbal = blend(intel.verbal, 0.7, 0.25);
    } else if (v === 'freeze' || v === 'reset') {
      intel.tempo = blend(intel.tempo, 0.85, 0.35);
      intel.metacog = blend(intel.metacog, 0.4, 0.25);
    }

    if (daySpec && daySpec.intellectProbe === 'seal') {
      Object.keys(intel).forEach((k) => {
        intel[k] = blend(intel[k], 0.5, 0.08);
      });
    }

    intel.updated_at = new Date().toISOString();
    intel.day = daySpec ? daySpec.day : null;
    return intel;
  }

  function intellectLabel(intel) {
    const i = intel || INTELLECT_DEFAULT;
    const parts = [];
    if (i.tempo < 0.38) parts.push('rapido');
    else if (i.tempo > 0.65) parts.push('deliberado');
    if (i.metacog >= 0.6) parts.push('calibrado');
    else if (i.metacog < 0.4) parts.push('descalibrado');
    if (i.evidence >= 0.6) parts.push('evidencial');
    else parts.push('intuitivo');
    if (i.learning >= 0.6) parts.push('estructural');
    else parts.push('narrativo');
    const dom = [
      ['verbal', i.verbal], ['quantitative', i.quantitative],
      ['scientific', i.scientific], ['civic', i.civic]
    ].sort((a, b) => b[1] - a[1])[0];
    parts.push('dom_' + dom[0]);
    return parts.join('|');
  }

  global.HackeaCampaign = {
    DAYS,
    INTELLECT_DEFAULT,
    getDay,
    playDayIntro,
    updateIntellect,
    intellectLabel,
    totalDays: 15
  };
})(window);
