/**
 * Genera 1 cartilla de Temas de refuerzo por cada pregunta del banco.
 * Contenido anclado al ítem (explicación, distractores, práctica del mismo punto).
 *
 * Uso: node scripts/generarCartillasPorPregunta.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fuentesDe } from './fuentesTemasRefuerzo.mjs';
import {
  conceptoPrincipal,
  diagramaCartilla,
  explicarDistractorEspecifico,
  esJustifGenericaPlantilla,
  detectarPhrasal,
  defPhrasal,
  defVocab
} from './glosarioCartillas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const bankPath = path.join(root, 'public', 'bancoPreguntas.json');
const outPath = path.join(root, 'public', 'temasRefuerzo.json');
const reportPath = path.join(root, 'scripts', 'reporteCartillasPorPregunta.json');

const AREA_NORM = {
  matematicas: 'matematicas',
  mate: 'matematicas',
  lectura_critica: 'lectura_critica',
  lectura: 'lectura_critica',
  ciencias_naturales: 'ciencias_naturales',
  ciencias: 'ciencias_naturales',
  sociales_ciudadanas: 'sociales_ciudadanas',
  sociales: 'sociales_ciudadanas',
  ingles: 'ingles',
  english: 'ingles'
};

const NIVEL = {
  matematicas: 'Media · Matemáticas',
  lectura_critica: 'Media · Lectura crítica',
  ciencias_naturales: 'Media · Ciencias naturales',
  sociales_ciudadanas: 'Media · Sociales y ciudadanas',
  ingles: 'Media · Inglés'
};

function limpio(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function slugId(raw) {
  const s = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 96);
  return s || 'item';
}

function cartillaIdDe(itemId) {
  return 'q_' + slugId(itemId);
}

function areaDe(p) {
  const raw = limpio(p.area || p.materia || p.area_general || '').toLowerCase();
  for (const [k, v] of Object.entries(AREA_NORM)) {
    if (raw.includes(k)) return v;
  }
  const sub = limpio(p.sub_competencia || p.sub || '').toLowerCase();
  if (/dialog|vocab|grammar|cloze|reading|aviso|ingles/.test(sub)) return 'ingles';
  if (/geometr|algebr|estat|probab|aritm|funcion|fracc|proporc|trigo|combin/.test(sub)) return 'matematicas';
  if (/infer|argum|literal|lectura|semant|prag|filos|literat|articul|evalu/.test(sub)) return 'lectura_critica';
  if (/fisic|quim|biol|indag|cts/.test(sub)) return 'ciencias_naturales';
  if (/geograf|histor|constit|ciudad|social|pensamiento/.test(sub)) return 'sociales_ciudadanas';
  return 'matematicas';
}

function opcionesDe(p) {
  const raw = p.opciones_respuesta || p.opciones || [];
  return (Array.isArray(raw) ? raw : []).map((op, i) => {
    const txt = typeof op === 'string' ? op : (op && (op.texto || op.label)) || '';
    let L = limpio(txt).charAt(0).toUpperCase();
    let body = limpio(txt).replace(/^[A-Da-d][\)\.\-\:]\s*/, '');
    if (!'ABCD'.includes(L) || limpio(txt).length < 3) {
      L = 'ABCD'[i] || 'A';
      body = limpio(txt);
    }
    return { letra: L, texto: body, raw: limpio(txt) };
  }).filter((o) => o.texto || o.raw);
}

function textoOpcionLimpio(op) {
  return limpio(String(op || '').replace(/^[A-Da-d][\)\.\-\:]\s*/, ''));
}

function correctaDe(p) {
  return String(p.correcta || p.ok || '').toUpperCase().slice(0, 1);
}

function enunciadoDe(p) {
  return limpio(p.pregunta_texto || p.enunciado || p.texto || '');
}

function blobDe(p, ops) {
  return [
    enunciadoDe(p),
    (ops || []).map((o) => o.texto).join(' '),
    limpio(p.tema_a_estudiar || p.repaso || ''),
    limpio(p.explicacion_correcta || '')
  ].join(' ').toLowerCase();
}

/**
 * Micro-habilidad del ítem (título de cartilla). Prioriza señal del enunciado/opciones.
 */
function microDe(p, ops) {
  const blob = blobDe(p, ops);
  const area = areaDe(p);
  const sub = limpio(p.sub_competencia || p.sub || '').toLowerCase();

  if (area === 'ingles') {
    const PHRASALS = 'phase out|keep up|look into|take after|give up|turn down|put off|carry out|run out|break down|come up|fill in|set up|bring about|call off|come across|get over|go through|make up|pick up|put up|turn into|work out';
    const phRas = new RegExp('\\b(' + PHRASALS + ')\\b', 'i');
    const okTxt = limpio((ops.find((o) => o.letra === correctaDe(p)) || {}).texto || '').toLowerCase();
    const hitOk = (okTxt.match(phRas) || [])[1];
    const hitBlob = (blob.match(phRas) || [])[1];
    if (hitOk || hitBlob || /phrasal/.test(blob)) {
      const hit = (hitOk || hitBlob || '').toLowerCase().replace(/\s+/g, ' ');
      const defHit = hit && defPhrasal(hit);
      const terminosBase = [];
      if (hit && defHit) {
        terminosBase.push({
          termino: hit,
          definicion: `${hit.charAt(0).toUpperCase() + hit.slice(1)} significa ${defHit.es}.`,
          ejemplo: defHit.tip
        });
      }
      terminosBase.push(
        { termino: 'phrasal verb', definicion: 'Verbo + partícula (out, up, into…) cuyo sentido no siempre es literal.', ejemplo: hit ? `${hit}` : 'phase out = retirar gradualmente' },
        { termino: 'contexto', definicion: 'El resto de la oración fija qué partícula y qué sentido caben.', ejemplo: 'transition to cloud → eliminar lo viejo' }
      );
      // Añade significados ES de los distractores phrasal presentes
      ops.forEach((o) => {
        const pv = detectarPhrasal(o.texto);
        const d = pv && defPhrasal(pv);
        if (d && pv !== hit) {
          terminosBase.push({ termino: pv, definicion: `${pv} significa ${d.es}.`, ejemplo: d.tip });
        }
      });
      return {
        clave: 'phrasal_verbs',
        titulo: hit ? `Inglés: phrasal verb «${hit}»` : 'Inglés: phrasal verbs en contexto',
        terminosBase: terminosBase.slice(0, 6)
      };
    }
    if (/passive|was written|were (written|built|made|designed)|__________ (by|with)|voz pasiva|past participle/.test(blob)
      || (/___/.test(blob) && /\bby a\b|\bby the\b|\bby local\b|\bby students?\b/.test(blob))) {
      return {
        clave: 'passive_voice',
        titulo: 'Inglés: voz pasiva (be + past participle)',
        terminosBase: [
          { termino: 'voz pasiva', definicion: 'Se forma con be + past participle; el foco está en la acción o el objeto.', ejemplo: 'was written by…' },
          { termino: 'past participle', definicion: 'Forma del verbo en -ed o irregular (written, built, made).', ejemplo: 'written, not wrote' },
          { termino: 'by + agente', definicion: 'Introduce quién realiza la acción cuando importa nombrarlo.', ejemplo: 'by a student' }
        ]
      };
    }
    if (/purpose|what does .+ (want|mean|imply)|why does the (speaker|writer|sign)|intention|objetivo del|propósito/.test(blob)) {
      return {
        clave: 'infer_purpose',
        titulo: 'Inglés: inferir el propósito del texto o diálogo',
        terminosBase: [
          { termino: 'propósito', definicion: 'Para qué se dice o escribe el mensaje (avisar, pedir, rechazar, informar).', ejemplo: 'warn about danger' },
          { termino: 'pista contextual', definicion: 'Palabras del aviso o turno que revelan la intención.', ejemplo: 'NO SWIMMING · HAZARD' },
          { termino: 'inferencia', definicion: 'Conclusión que no está dicha literalmente pero se sigue del texto.', ejemplo: 'el aviso busca prevenir' }
        ]
      };
    }
    if (/dialog|conversation|speaker|a:|b:/.test(blob) || sub === 'dialogo' || sub === 'dialogues') {
      return {
        clave: 'dialog_response',
        titulo: 'Inglés: respuesta coherente en el diálogo',
        terminosBase: [
          { termino: 'turno', definicion: 'Cada intervención responde a la anterior.', ejemplo: 'A pregunta → B responde' },
          { termino: 'coherencia', definicion: 'La respuesta encaja con lo pedido (saludo, petición, rechazo…).', ejemplo: 'Could you…? → Sure / Sorry' },
          { termino: 'función comunicativa', definicion: 'Qué acto de habla realiza el turno.', ejemplo: 'request, offer, refusal' }
        ]
      };
    }
    if (/cloze|grammar|concord|tense|does|don't|subject.?verb/.test(blob + ' ' + sub) || sub.includes('grammar') || sub === 'cloze') {
      return {
        clave: 'grammar_form',
        titulo: 'Inglés: forma gramatical que pide la oración',
        terminosBase: [
          { termino: 'concordancia', definicion: 'El verbo concuerda con el sujeto (he works / they work).', ejemplo: 'She goes' },
          { termino: 'tiempo verbal', definicion: 'La marca temporal (yesterday, since, every day) fija el tiempo.', ejemplo: 'yesterday → past' },
          { termino: 'forma correcta', definicion: 'La opción que respeta sujeto, tiempo y estructura.', ejemplo: 'was written, not wrote' }
        ]
      };
    }
    return {
      clave: 'vocab_context',
      titulo: 'Inglés: vocabulario que encaja en esta oración',
      terminosBase: [
        { termino: 'contexto', definicion: 'El sentido de la oración completa decide la palabra.', ejemplo: limpio((ops.find((o) => o.letra === correctaDe(p)) || {}).texto).slice(0, 40) || 'opción correcta' },
        { termino: 'distractores', definicion: 'Palabras cercanas que no cumplen el sentido o la colocación.', ejemplo: 'keep up ≠ phase out' },
        { termino: 'colocación', definicion: 'Combinación natural en inglés.', ejemplo: 'phase out a system' }
      ]
    };
  }

  // Títulos anclados al tema del ítem (no genéricos vacíos).
  const temaPrev = limpio(p.tema_a_estudiar || p.repaso || '');
  if (temaPrev && temaPrev.length >= 8 && temaPrev.length <= 90 && !/\?/.test(temaPrev)) {
    return {
      clave: sub || 'tema',
      titulo: temaPrev,
      terminosBase: []
    };
  }
  const label = sub ? sub.replace(/_/g, ' ') : 'este ítem';
  return {
    clave: sub || 'item',
    titulo: `${NIVEL[area] ? NIVEL[area].replace(/^Media · /, '') : 'Tema'}: ${label}`,
    terminosBase: []
  };
}

function justMap(p) {
  return (p.justificacion_opciones && typeof p.justificacion_opciones === 'object')
    ? p.justificacion_opciones
    : {};
}

function justifDeOpcion(p, o, ops, correcta) {
  const ok = ops.find((x) => x.letra === correcta) || {};
  const bank = limpio(justMap(p)[o.letra] || '');
  if (bank && !esJustifGenericaPlantilla(bank) && bank.length >= 40) {
    // Si la del banco es específica pero no trae definición ES de phrasal, refuerza.
    const pv = detectarPhrasal(o.texto);
    const def = pv && defPhrasal(pv);
    if (def && !bank.toLowerCase().includes(def.es.slice(0, 18).toLowerCase())) {
      return `«${o.texto}» significa ${def.es}. ${bank}`;
    }
    return bank;
  }
  return explicarDistractorEspecifico({
    mala: o.texto,
    bien: ok.texto || '',
    enunciado: enunciadoDe(p),
    area: areaDe(p)
  });
}

function buildIntro(p, ops, micro, concepto) {
  const correcta = correctaDe(p);
  const ok = ops.find((o) => o.letra === correcta);
  const partes = [];
  // 1) Definición obligatoria del concepto principal en español
  if (concepto && concepto.definicion) {
    partes.push(concepto.definicion);
    if (concepto.ejemplo) partes.push(`Úsalo así: ${concepto.ejemplo}.`);
  }
  // 2) Por qué la correcta
  if (ok) {
    const pv = detectarPhrasal(ok.texto) || detectarPhrasal(enunciadoDe(p));
    const def = pv && defPhrasal(pv);
    const v = defVocab(ok.texto);
    if (def) {
      partes.push(`La opción ${correcta} («${ok.texto}») es correcta porque significa ${def.es} y encaja con el contexto del enunciado.`);
    } else if (v) {
      partes.push(`La opción ${correcta} («${ok.texto}») es correcta: significa ${v}.`);
    } else {
      const expl = limpio(p.explicacion_correcta || '');
      if (expl && !/^La respuesta es/i.test(expl)) partes.push(expl);
      else partes.push(`La opción ${correcta} («${ok.texto}») responde exactamente lo que pide el enunciado.`);
    }
  }
  // 3) Distractores específicos
  ops.forEach((o) => {
    if (o.letra === correcta) return;
    partes.push(`Opción ${o.letra}: ${justifDeOpcion(p, o, ops, correcta)}`);
  });
  if (micro && micro.titulo) {
    partes.push(`Esta cartilla refuerza exactamente: ${micro.titulo}.`);
  }
  return partes.join(' ');
}

function buildPasos(p, ops, micro) {
  const correcta = correctaDe(p);
  const ok = ops.find((o) => o.letra === correcta);
  const clave = micro.clave;
  if (clave === 'phrasal_verbs') {
    const pv = detectarPhrasal((ok && ok.texto) || '') || detectarPhrasal(enunciadoDe(p));
    const def = pv && defPhrasal(pv);
    return [
      def
        ? `Recuerda: «${pv}» significa ${def.es}.`
        : 'Lee la oración completa y qué cambio describe (eliminar, investigar, parecerse…).',
      'Traduce mentalmente cada opción al español y mírala contra el contexto.',
      `Quédate con la opción ${correcta}${ok ? ` («${ok.texto}»)` : ''} cuyo significado sí encaja.`,
      'Descarta las que significan otra cosa (p. ej. keep up ≠ phase out).'
    ];
  }
  if (clave === 'passive_voice') {
    return [
      'Identifica si el foco está en el objeto/acción (pasiva) o en quién hace (activa).',
      'Arma be (am/is/are/was/were) + past participle.',
      'Si aparece «by…», comprueba que el agente encaje.',
      `Elige ${correcta}${ok ? ` («${ok.texto}»)` : ''} solo si la forma pasiva es correcta.`
    ];
  }
  if (clave === 'infer_purpose') {
    return [
      'Subraya palabras de intención (aviso, pedido, rechazo, invitación…).',
      'Pregúntate: ¿para qué se dice/escribe esto?',
      'Descarta literales que solo repiten una palabra sin el propósito.',
      `La opción ${correcta} expresa esa intención.`
    ];
  }
  return [
    'Lee qué pide exactamente el enunciado (dato, relación, definición o forma).',
    'Descarta opciones que responden otra pregunta o cambian el caso.',
    `Conserva la opción ${correcta}${ok ? ` («${ok.texto}»)` : ''} y explica por qué las otras fallan.`,
    'Comprueba con la definición o relación del mismo punto (no de un tema vecino).'
  ];
}

function buildErrores(p, ops) {
  const correcta = correctaDe(p);
  const out = [];
  ops.forEach((o) => {
    if (o.letra === correcta) return;
    const j = justifDeOpcion(p, o, ops, correcta);
    out.push(j.length > 180 ? j.slice(0, 177) + '…' : j);
  });
  if (!out.length) {
    out.push('Confundir este ítem con un tema genérico cercano.');
    out.push('Elegir una opción por una sola palabra suelta del enunciado.');
  }
  return out.slice(0, 4);
}

function buildEjemplo(p, ops, concepto) {
  const correcta = correctaDe(p);
  const ok = ops.find((o) => o.letra === correcta);
  const malas = ops.filter((o) => o.letra !== correcta);
  const pasos = [
    concepto && concepto.definicion
      ? `1) Concepto: ${concepto.definicion}`
      : '1) Lee el enunciado y aísla lo que pide.',
    ...malas.slice(0, 2).map((o, i) => {
      const j = justifDeOpcion(p, o, ops, correcta);
      return `${i + 2}) Descarta ${o.letra} («${o.texto}»): ${j.length > 120 ? j.slice(0, 117) + '…' : j}`;
    }),
    `${Math.min(4, malas.length + 2)}) Conserva ${correcta}${ok ? ` — «${ok.texto}»` : ''} porque sí cumple el sentido del enunciado.`
  ];
  const mala0 = malas[0];
  const j0 = mala0 ? justifDeOpcion(p, mala0, ops, correcta) : '';
  return {
    titulo: 'Ejemplo resuelto · este ítem',
    enunciado: enunciadoDe(p),
    pasos: pasos.slice(0, 4),
    respuesta: ok ? `${correcta}) ${ok.texto}` : correcta,
    contraste: mala0
      ? {
        titulo: 'Contraste rápido',
        invalido: `Incorrecto: «${mala0.texto}» — ${j0.length > 100 ? j0.slice(0, 97) + '…' : j0}`,
        valido: ok
          ? `Correcto: «${ok.texto}»${(detectarPhrasal(ok.texto) && defPhrasal(detectarPhrasal(ok.texto)))
            ? ' — significa ' + defPhrasal(detectarPhrasal(ok.texto)).es
            : ' sí cumple lo pedido.'}`
          : `Correcto: ${correcta}`
      }
      : null
  };
}

function q(id, enunciado, opciones, correcta, justificacion_incorrectas, explicacion_correcta, ayuda_visual) {
  return {
    id,
    enunciado,
    opciones,
    correcta,
    justificacion_incorrectas,
    explicacion_correcta,
    ayuda_visual: ayuda_visual || ''
  };
}

function practicaDe(p, ops, micro, cid, concepto) {
  const correcta = correctaDe(p);
  const ok = ops.find((o) => o.letra === correcta);
  const malas = ops.filter((o) => o.letra !== correcta);
  const lista = [];

  // P1: reconocer la respuesta correcta del mismo punto
  lista.push(q(
    `${cid}_p1`,
    'En el ítem que fallaste, ¿cuál opción sí responde el enunciado?',
    ops.map((o) => `${o.letra}) ${o.texto}`),
    correcta,
    Object.fromEntries(malas.map((o) => [o.letra, justifDeOpcion(p, o, ops, correcta)])),
    (concepto && concepto.definicion ? concepto.definicion + ' ' : '')
      + (limpio(p.explicacion_correcta || '') || `La correcta es ${correcta}${ok ? ` («${ok.texto}»)` : ''}.`),
    'Misma pregunta · mismo punto'
  ));

  // P2: por qué un distractor falla
  if (malas[0]) {
    const m = malas[0];
    const j = justifDeOpcion(p, m, ops, correcta);
    lista.push(q(
      `${cid}_p2`,
      `¿Por qué la opción ${m.letra} («${m.texto}») no es correcta en este ítem?`,
      [
        `A) ${j.length > 110 ? j.slice(0, 107) + '…' : j}`,
        'B) Porque es la más corta',
        'C) Porque siempre se elige la A',
        'D) Porque el enunciado no tiene respuesta'
      ],
      'A',
      {
        B: 'La longitud no decide.',
        C: 'No hay letra privilegiada.',
        D: 'Sí hay una opción que responde.'
      },
      `La ${m.letra} falla por el contenido: ${j}`,
      'Justificación del distractor'
    ));
  }

  // P3: micro-habilidad
  if (micro.clave === 'phrasal_verbs') {
    const pvOk = detectarPhrasal((ok && ok.texto) || '') || detectarPhrasal(enunciadoDe(p)) || 'phase out';
    const defOk = defPhrasal(pvOk);
    lista.push(q(
      `${cid}_p3`,
      `“The company will ______ its old system and move to a new one.” ¿Qué phrasal verb encaja con el mismo sentido que «${pvOk}»?`,
      ['A) phase out', 'B) take after', 'C) look into', 'D) keep up'],
      'A',
      {
        B: 'Take after significa parecerse a alguien. No expresa eliminar un sistema.',
        C: 'Look into significa investigar. No significa retirar gradualmente.',
        D: 'Keep up significa mantenerse al día. No expresa eliminar el sistema.'
      },
      (defOk
        ? `${pvOk} significa ${defOk.es}. `
        : '') + 'Phase out = retirar/eliminar gradualmente (mismo punto).',
      'Mismo phrasal · otro contexto'
    ));
    lista.push(q(
      `${cid}_p4`,
      `«${pvOk}» significa en español:`,
      [
        `A) ${defOk ? defOk.es.charAt(0).toUpperCase() + defOk.es.slice(1) : 'Retirar o eliminar algo de forma gradual'}`,
        'B) Investigar un asunto',
        'C) Parecerse a alguien',
        'D) Mantenerse al día'
      ],
      'A',
      {
        B: 'Eso sería look into.',
        C: 'Eso sería take after.',
        D: 'Eso sería keep up.'
      },
      defOk ? `${pvOk} = ${defOk.es}.` : 'Debes memorizar el significado en español del phrasal.',
      'Definición del phrasal'
    ));
  } else if (micro.clave === 'passive_voice') {
    lista.push(q(
      `${cid}_p3`,
      'Choose the correct passive: “The report ______ by the committee yesterday.”',
      ['A) was written', 'B) wrote', 'C) writing', 'D) is write'],
      'A',
      {
        B: 'wrote is active past, not passive.',
        C: 'writing is not a finite passive form here.',
        D: 'is write is ungrammatical.'
      },
      'Passive = was/were + past participle (written).',
      'Misma estructura pasiva'
    ));
    lista.push(q(
      `${cid}_p4`,
      'En voz pasiva, el orden típico es:',
      ['A) be + past participle (+ by agent)', 'B) sujeto + verbo en pasado simple solo', 'C) to + infinitive obligatorio', 'D) gerundio como único verbo'],
      'A',
      {
        B: 'Eso es activa, no pasiva.',
        C: 'No es el molde de la pasiva.',
        D: 'El gerundio no forma la pasiva básica.'
      },
      'be + past participle es el molde.',
      'Regla de la pasiva'
    ));
  } else if (micro.clave === 'infer_purpose') {
    lista.push(q(
      `${cid}_p3`,
      'A sign says “WET FLOOR — WALK CAREFULLY”. What is the purpose?',
      ['A) To warn people and prevent falls', 'B) To sell cleaning products', 'C) To greet visitors', 'D) To ask for a meeting'],
      'A',
      {
        B: 'No hay venta en el aviso.',
        C: 'No es un saludo.',
        D: 'No pide una reunión.'
      },
      'El propósito es prevenir / advertir, no saludar.',
      'Inferir propósito'
    ));
    lista.push(q(
      `${cid}_p4`,
      'Para inferir el propósito de un diálogo o aviso debes:',
      ['A) Preguntarte para qué se dice el mensaje', 'B) Traducir sola una palabra suelta', 'C) Elegir siempre un saludo', 'D) Ignorar el contexto'],
      'A',
      {
        B: 'Una palabra no basta.',
        C: 'No todo es saludo.',
        D: 'El contexto es la pista.'
      },
      'El propósito sale del mensaje completo.',
      'Método'
    ));
  } else {
    // P3 conceptual genérico pero anclado al texto de la correcta
    const okTxt = ok ? ok.texto : 'la opción correcta';
    lista.push(q(
      `${cid}_p3`,
      `En este refuerzo, una respuesta válida debe:`,
      [
        `A) Alinearse con el mismo punto que «${okTxt.slice(0, 70)}»`,
        'B) Hablar de otro tema del área',
        'C) Elegir por longitud de la opción',
        'D) Ignorar el enunciado'
      ],
      'A',
      {
        B: 'Otro tema no repara este fallo.',
        C: 'Longitud ≠ acierto.',
        D: 'Sin enunciado no hay criterio.'
      },
      'Hay que practicar el mismo punto del ítem fallado.',
      'Mismo punto'
    ));
    if (malas[1]) {
      const m2 = malas[1];
      const j2 = justifDeOpcion(p, m2, ops, correcta);
      lista.push(q(
        `${cid}_p4`,
        `Respecto de la opción ${m2.letra} («${m2.texto}») en tu ítem:`,
        [
          `A) ${j2.length > 100 ? j2.slice(0, 97) + '…' : j2}`,
          'B) Es siempre la correcta',
          'C) Reemplaza al enunciado',
          'D) No hace falta leerla'
        ],
        'A',
        {
          B: 'No: la correcta es otra.',
          C: 'El enunciado manda.',
          D: 'Hay que contrastar todas.'
        },
        j2,
        'Distractores'
      ));
    }
  }

  return lista.slice(0, 4);
}

function terminosDe(p, ops, micro, concepto) {
  const out = [];
  const seen = new Set();
  function add(t, def, ej, desdePregunta) {
    const key = limpio(t).toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push({
      termino: limpio(t),
      definicion: limpio(def) || ('Concepto clave de este ítem: «' + limpio(t) + '».'),
      ejemplo: limpio(ej) || '',
      desdePregunta: Boolean(desdePregunta)
    });
  }

  // Primero: definición obligatoria del concepto principal
  if (concepto && concepto.termino && concepto.definicion) {
    add(concepto.termino, concepto.definicion, concepto.ejemplo || '', true);
  }

  (micro.terminosBase || []).forEach((tm) => add(tm.termino, tm.definicion, tm.ejemplo, false));

  const enun = enunciadoDe(p);
  const ok = ops.find((o) => o.letra === correctaDe(p));
  if (ok && ok.texto && ok.texto.length <= 48) {
    const pv = detectarPhrasal(ok.texto);
    const def = pv && defPhrasal(pv);
    const v = defVocab(ok.texto);
    add(
      ok.texto,
      def ? `${ok.texto} significa ${def.es}.` : (v ? `«${ok.texto}» significa ${v}.` : 'Opción correcta de este ítem.'),
      enun.slice(0, 80),
      true
    );
  }
  // Distractores con definición ES cuando hay glosario
  ops.forEach((o) => {
    if (o.letra === correctaDe(p)) return;
    const pv = detectarPhrasal(o.texto);
    const def = pv && defPhrasal(pv);
    const v = defVocab(o.texto);
    if (def) add(pv, `${pv} significa ${def.es}.`, def.tip, true);
    else if (v) add(o.texto, `«${o.texto}» significa ${v}.`, 'Distractor de este ítem', true);
  });

  const quoted = enun.match(/[«"]([^»"]{3,40})[»"]/g) || [];
  quoted.slice(0, 2).forEach((qraw) => {
    const t = qraw.replace(/[«»"]/g, '');
    add(t, 'Aparece en el enunciado de tu pregunta; úsalo como ancla del concepto.', t, true);
  });

  while (out.length < 3) {
    add('enunciado', 'Lo que la pregunta pide exactamente; toda opción debe medirse contra eso.', enun.slice(0, 60), false);
    add('distractor', 'Opción incorrecta cercana que parece plausible pero no cumple el enunciado.', (ops.find((o) => o.letra !== correctaDe(p)) || {}).texto || '', false);
    add('justificación', 'Razón concreta (con significado) por la que una opción falla.', '', false);
  }
  return out.slice(0, 6);
}

function cartillaDePregunta(p) {
  const ops = opcionesDe(p);
  const micro = microDe(p, ops);
  const cid = cartillaIdDe(p.id);
  const area = areaDe(p);
  const correcta = correctaDe(p);
  const concepto = conceptoPrincipal({
    titulo: micro.titulo,
    microClave: micro.clave,
    ops,
    correcta,
    enunciado: enunciadoDe(p),
    area
  });
  const intro = buildIntro(p, ops, micro, concepto);
  const pasos = buildPasos(p, ops, micro);
  const errores = buildErrores(p, ops);
  const ejemplo = buildEjemplo(p, ops, concepto);
  const practica = practicaDe(p, ops, micro, cid, concepto);
  const terminos = terminosDe(p, ops, micro, concepto);
  const fuentes = fuentesDe(micro.clave, area) || fuentesDe(limpio(p.sub_competencia || p.sub || ''), area) || [
    { tipo: 'guia', texto: `Repasa el mismo punto: ${micro.titulo}` },
    { tipo: 'video', texto: `Busca: “${micro.titulo}” (explicación corta + 3 ejemplos)` }
  ];
  const diagrama = diagramaCartilla({
    microClave: micro.clave,
    titulo: micro.titulo,
    enunciado: enunciadoDe(p),
    ops,
    correcta,
    area,
    concepto
  });

  return {
    id: cid,
    titulo: micro.titulo,
    area,
    nivel: NIVEL[area] || 'Media',
    subs: [limpio(p.sub_competencia || p.sub || ''), cid].filter(Boolean),
    matchTema: [micro.titulo.toLowerCase(), limpio(p.tema_a_estudiar || '').toLowerCase()].filter(Boolean),
    estadoContenido: 'completo',
    itemId: String(p.id),
    microClave: micro.clave,
    conceptoPrincipal: concepto,
    profundizar: `Sigue con 2–3 ítems del mismo punto: «${micro.titulo}».`,
    fuentes: Array.isArray(fuentes) ? fuentes.slice(0, 2) : fuentes,
    diagrama_svg: diagrama,
    terminos,
    explicacion: {
      intro,
      pasos,
      errores,
      ejemplo_resuelto: ejemplo,
      terminos,
      fuentes: Array.isArray(fuentes) ? fuentes.slice(0, 2) : fuentes,
      diagrama_svg: diagrama,
      concepto: concepto
    },
    practica
  };
}

function main() {
  const raw = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  const arr = Array.isArray(raw) ? raw : (raw.preguntas || []);
  const temas = [];
  const byId = new Map();
  let patched = 0;

  for (const p of arr) {
    if (!p || p.id == null) continue;
    const cart = cartillaDePregunta(p);
    if (byId.has(cart.id)) {
      // colisión rara: sufijo
      cart.id = cart.id + '_' + temas.length;
    }
    byId.set(cart.id, cart);
    temas.push(cart);
    const prev = limpio(p.tema_refuerzo_id || '');
    if (prev !== cart.id) {
      p.tema_refuerzo_id = cart.id;
      patched++;
    }
    // Título visible en boletín / lista: siempre el de la cartilla del ítem
    p.tema_a_estudiar = cart.titulo;
    if (p.repaso != null) p.repaso = cart.titulo;
  }

  const catalogo = {
    version: 3,
    nota: 'Una cartilla por pregunta del banco. Contenido anclado al ítem (no tema genérico).',
    generatedAt: new Date().toISOString(),
    total: temas.length,
    temas
  };

  // Compacto: ~1500 cartillas; evita JSON indentado de decenas de MB.
  fs.writeFileSync(outPath, JSON.stringify(catalogo), 'utf8');
  if (Array.isArray(raw)) fs.writeFileSync(bankPath, JSON.stringify(arr), 'utf8');
  else {
    raw.preguntas = arr;
    fs.writeFileSync(bankPath, JSON.stringify(raw), 'utf8');
  }

  // Muestreo de los casos reportados por el usuario
  const samples = [];
  for (const p of arr) {
    const blob = JSON.stringify(p).toLowerCase();
    if (/phase out|was written|purpose of this warning|passive voice/.test(blob)) {
      samples.push({
        id: p.id,
        tema_refuerzo_id: p.tema_refuerzo_id,
        tema_a_estudiar: p.tema_a_estudiar,
        cartilla: byId.get(p.tema_refuerzo_id)
          ? {
            titulo: byId.get(p.tema_refuerzo_id).titulo,
            prac0: byId.get(p.tema_refuerzo_id).practica[0] && byId.get(p.tema_refuerzo_id).practica[0].enunciado,
            intro: String(byId.get(p.tema_refuerzo_id).explicacion.intro || '').slice(0, 220)
          }
          : null
      });
    }
  }

  const report = {
    generatedAt: catalogo.generatedAt,
    totalPreguntas: arr.length,
    totalCartillas: temas.length,
    bancoParcheadoTemaId: patched,
    samples,
    outPath,
    sizeMB: Number((fs.statSync(outPath).size / 1e6).toFixed(2))
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main();
