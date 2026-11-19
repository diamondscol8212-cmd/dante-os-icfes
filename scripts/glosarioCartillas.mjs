/**
 * Definiciones en español y ayudas para cartillas 1:1.
 * Usado por generarCartillasPorPregunta.mjs y enriquecerAyudas (vía copia ligera).
 */

export function limpio(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

/** Phrasal verbs frecuentes en el banco ICFES. */
export const PHRASAL_ES = {
  'phase out': {
    es: 'retirar o eliminar algo de forma gradual',
    tip: 'encaja cuando se reemplaza un sistema viejo por uno nuevo'
  },
  'keep up': {
    es: 'mantenerse al día o continuar al mismo ritmo',
    tip: 'no significa eliminar ni retirar'
  },
  'look into': {
    es: 'investigar o examinar un asunto',
    tip: 'es indagar, no retirar'
  },
  'take after': {
    es: 'parecerse a alguien (familia/rasgos)',
    tip: 'habla de similitud personal, no de sistemas'
  },
  'put off': {
    es: 'posponer o aplazar algo',
    tip: 'retrasa en el tiempo; no cancela ni acelera'
  },
  'give up': {
    es: 'rendirse o dejar de intentar',
    tip: 'abandono, no aplazamiento'
  },
  'turn down': {
    es: 'rechazar una oferta o bajar el volumen',
    tip: 'no significa posponer'
  },
  'carry out': {
    es: 'llevar a cabo o ejecutar un plan',
    tip: 'ejecuta; no cancela'
  },
  'run out': {
    es: 'agotarse (quedarse sin algo)',
    tip: 'falta de recurso, no eliminación planificada'
  },
  'break down': {
    es: 'averiarse o desglosar en partes',
    tip: 'falla mecánica o análisis, no retiro gradual'
  },
  'come up': {
    es: 'surgir / aparecer (un tema o problema)',
    tip: 'aparición, no eliminación'
  },
  'fill in': {
    es: 'completar un formulario o sustituir temporalmente',
    tip: 'rellenar, no retirar'
  },
  'set up': {
    es: 'montar, configurar o fundar algo',
    tip: 'crear/instalar, lo opuesto a retirar'
  },
  'bring about': {
    es: 'provocar o causar un cambio',
    tip: 'causa un resultado; no es «retirar»'
  },
  'call off': {
    es: 'cancelar un evento o plan',
    tip: 'cancelación total, distinta de posponer'
  },
  'come across': {
    es: 'encontrarse con algo por casualidad',
    tip: 'hallazgo fortuito'
  },
  'get over': {
    es: 'superar (una enfermedad o dificultad)',
    tip: 'recuperarse, no eliminar un sistema'
  },
  'go through': {
    es: 'atravesar una experiencia o revisar con detalle',
    tip: 'proceso/revisión, no retiro'
  },
  'make up': {
    es: 'inventar; reconciliarse; o compensar',
    tip: 'varios sentidos; ninguno es «retirar gradualmente»'
  },
  'pick up': {
    es: 'recoger; mejorar; o aprender con la práctica',
    tip: 'no significa eliminar'
  },
  'put up': {
    es: 'alojar; o levantar/montar',
    tip: 'no es retirar'
  },
  'turn into': {
    es: 'convertirse en',
    tip: 'transformación, no eliminación gradual'
  },
  'work out': {
    es: 'resolver; o ejercitarse',
    tip: 'solución/ejercicio, no retiro'
  },
  'give in': {
    es: 'ceder o rendirse ante una presión',
    tip: 'cesión, no aplazamiento'
  },
  'look after': {
    es: 'cuidar de alguien o algo',
    tip: 'cuidado, no investigación (look into)'
  },
  'look for': {
    es: 'buscar',
    tip: 'búsqueda, no investigación profunda'
  },
  'take off': {
    es: 'despegar; o quitarse (ropa)',
    tip: 'no es posponer'
  },
  'take up': {
    es: 'empezar un hobby o ocupar espacio/tiempo',
    tip: 'inicio, no cancelación'
  }
};

/** Vocabulario EN frecuente → definición ES. */
export const VOCAB_ES = {
  postpone: 'posponer / aplazar',
  accelerate: 'acelerar',
  inspect: 'inspeccionar / revisar',
  cancel: 'cancelar',
  pivotal: 'central / decisivo',
  superficial: 'superficial / poco profundo',
  redundant: 'redundante / innecesario',
  negligent: 'negligente / descuidado',
  whose: 'cuyo/cuya (posesión)',
  whom: 'a quien (objeto de persona)',
  which: 'que/cual (cosas)',
  "who's": 'who is / who has (contracción)'
};

const PHRASAL_RE = new RegExp(
  '\\b(' + Object.keys(PHRASAL_ES).sort((a, b) => b.length - a.length).join('|').replace(/\s+/g, '\\s+') + ')\\b',
  'i'
);

export function detectarPhrasal(texto) {
  const m = limpio(texto).match(PHRASAL_RE);
  return m ? limpio(m[1]).toLowerCase().replace(/\s+/g, ' ') : '';
}

export function defPhrasal(pv) {
  const key = limpio(pv).toLowerCase().replace(/\s+/g, ' ');
  return PHRASAL_ES[key] || null;
}

export function defVocab(palabra) {
  const key = limpio(palabra).toLowerCase().replace(/[«»"']/g, '');
  if (VOCAB_ES[key]) return VOCAB_ES[key];
  const bare = key.replace(/[^a-z'\-]/gi, '');
  return VOCAB_ES[bare] || null;
}

function cortaTxt(s, n) {
  const t = limpio(s);
  if (t.length <= n) return t;
  return t.slice(0, n - 1).trim() + '…';
}

/**
 * Explicación corta y específica de un distractor (sin repetir la definición de la correcta).
 * Formato objetivo: «opción»: significado. Por qué no encaja.
 */
export function explicarDistractorEspecifico({ mala, bien, enunciado, area }) {
  const m = limpio(mala);
  const b = limpio(bien);
  const enun = limpio(enunciado);
  const a = String(area || '').toLowerCase();
  const etiqueta = cortaTxt(m, 52);

  const pvM = detectarPhrasal(m);
  const pvB = detectarPhrasal(b) || detectarPhrasal(enun);
  const defM = pvM ? defPhrasal(pvM) : null;
  const defB = pvB ? defPhrasal(pvB) : null;

  if (defM) {
    // Corto: significado + por qué no sirve (sin re-decir toda la def. de la correcta).
    return `«${etiqueta}»: ${defM.es}. ${defM.tip.charAt(0).toUpperCase() + defM.tip.slice(1)}.`;
  }
  if (pvB || defB) {
    const v = defVocab(m);
    if (v) return `«${etiqueta}»: ${v}. No expresa el cambio que pide la oración.`;
    return `«${etiqueta}» no tiene el sentido del phrasal que pide el contexto.`;
  }

  // Vocabulario EN (sin phrasal)
  if (a.includes('ingl')) {
    const vm = defVocab(m);
    if (vm) return `«${etiqueta}»: ${vm}. No es el sentido que pide el contexto.`;
    if (/passive|was |were |been |by a |by the |written|built/.test((enun + ' ' + b + ' ' + m).toLowerCase())) {
      return `«${etiqueta}» no es be + past participle (forma pasiva válida).`;
    }
    if (/purpose|warning|sign|notice|what does/.test(enun.toLowerCase())) {
      return `«${etiqueta}» describe otra intención (no la del aviso/mensaje).`;
    }
    if (/dialog|conversation|a:|b:|speaker|could you/.test(enun.toLowerCase())) {
      return `«${etiqueta}» no responde de forma coherente al turno anterior.`;
    }
    return `«${etiqueta}» no encaja con el tiempo, la colocación o el sentido de la oración.`;
  }

  // Hidrografía / geografía Colombia
  if (/afluente|cuenca|desemboca|macizo|r[ií]o (cauca|magdalena)|orinoco|amazonas|caribe|pac[ií]fico|regi[oó]n (andina|caribe|pac[ií]fica|orinoqu|amazon)/i.test(enun + ' ' + m + ' ' + b)) {
    if (/amazonas/i.test(m) && /cauca|magdalena|afluente/i.test(enun + b)) {
      return `«${etiqueta}»: otra cuenca (suroriente). El Cauca aporta al Magdalena (Caribe).`;
    }
    if (/orinoco/i.test(m) && /cauca|magdalena/i.test(enun + b)) {
      return `«${etiqueta}»: drena los Llanos; no es el sistema Magdalena-Cauca.`;
    }
    if (/pac[ií]fico/i.test(m) && /caribe|magdalena|desemboca/i.test(enun + b)) {
      return `«${etiqueta}»: vertiente oeste. El Magdalena desemboca en el Caribe.`;
    }
    if (/andina|caribe|pac[ií]fica|orinoqu|amazon/i.test(m + b + enun)) {
      return `«${etiqueta}» ubica mal la región o el rasgo del enunciado.`;
    }
    return `«${etiqueta}» confunde afluente, cuenca o desembocadura.`;
  }

  if (/rama|poder (ejecutivo|legislativo|judicial)|corte constitucional|congreso|presidente/i.test(enun)) {
    return `«${etiqueta}» asigna la función a otra rama o institución.`;
  }

  if (a.includes('cien') || a.includes('natur')) {
    return `«${etiqueta}» mezcla un concepto cercano (causa/efecto, proceso o magnitud distinta).`;
  }

  if (a.includes('lect')) {
    return `«${etiqueta}» no está afirmado ni se puede inferir con seguridad del texto.`;
  }

  if (a.includes('mate')) {
    const nm = parseFloat(String(m).replace(',', '.').replace(/[^\d.-]/g, ''));
    const nb = parseFloat(String(b).replace(',', '.').replace(/[^\d.-]/g, ''));
    if (Number.isFinite(nm) && Number.isFinite(nb) && nb !== 0) {
      if (Math.abs(nm - nb * 2) < 0.05) return `«${etiqueta}»: duplicaste el valor correcto.`;
      if (Math.abs(nm - nb / 2) < 0.05) return `«${etiqueta}»: partiste a la mitad el valor correcto.`;
      if (Math.abs(nm + nb - 1) < 0.05 || (nb <= 1 && Math.abs(nm - (1 - nb)) < 0.05)) {
        return `«${etiqueta}»: confundiste con el complemento (1 − resultado).`;
      }
    }
    return `«${etiqueta}» no es el resultado del procedimiento que pide el enunciado.`;
  }

  if (a.includes('social')) {
    return `«${etiqueta}» confunde el hecho, la norma, la región o el mecanismo del caso.`;
  }

  return `«${etiqueta}» no cumple lo que pide el enunciado.`;
}

/**
 * Concepto principal en español (obligatorio al inicio de la cartilla).
 */
export function conceptoPrincipal({ titulo, microClave, ops, correcta, enunciado, area }) {
  const enun = limpio(enunciado);
  const ok = (ops || []).find((o) => o.letra === correcta) || {};
  const okTxt = limpio(ok.texto || '');

  const pv = detectarPhrasal(okTxt) || detectarPhrasal(enun) || detectarPhrasal(titulo || '');
  if (pv) {
    const d = defPhrasal(pv);
    if (d) {
      return {
        termino: pv,
        definicion: `${pv.charAt(0).toUpperCase() + pv.slice(1)} significa ${d.es}.`,
        ejemplo: d.tip
      };
    }
  }

  if (microClave === 'passive_voice') {
    return {
      termino: 'voz pasiva',
      definicion: 'La voz pasiva se forma con be (am/is/are/was/were) + past participle; el foco está en la acción o el objeto.',
      ejemplo: okTxt || 'was written by…'
    };
  }

  if (microClave === 'infer_purpose') {
    return {
      termino: 'propósito',
      definicion: 'El propósito es la intención del mensaje: para qué se dice o escribe (avisar, pedir, informar, rechazar…).',
      ejemplo: okTxt.slice(0, 60) || 'advertir / prevenir'
    };
  }

  const areaSocial = String(area || '').includes('social') || String(area || '').includes('geograf');
  const geoCol = areaSocial && /magdalena|cauca|orinoco|amazonas|macizo colombiano|buenaventura|barranquilla|leticia|orinoqu|afluente|desemboca|cuenca del|hidrograf/i.test(enun + ' ' + okTxt + ' ' + (titulo || ''));
  const preguntaDeRegion = areaSocial && (
    /regi[oó]n (andina|caribe|pac[ií]fica|orinoqu|amazon)/i.test(enun)
    || /^(Andina|Caribe|Pac[ií]fica|Orinoqu[ií]a|Amazon[ií]a)\b/i.test(okTxt)
    || /regiones naturales|geograf[ií]a de Colombia/i.test(titulo || '')
  );
  if (geoCol && /afluente/i.test(enun + ' ' + okTxt)) {
    return {
      termino: 'afluente',
      definicion: 'Un afluente es un río que desemboca en otro río (aporta agua), no directamente en el mar.',
      ejemplo: 'El Cauca es afluente del Magdalena.'
    };
  }
  if (geoCol && /desemboca/i.test(enun) && /magdalena|cauca|r[ií]o/i.test(enun)) {
    return {
      termino: 'desembocadura',
      definicion: 'La desembocadura es el lugar donde un río entrega sus aguas al mar u otro cuerpo de agua.',
      ejemplo: 'El Magdalena desemboca en el Caribe.'
    };
  }
  if (geoCol && /cuenca/i.test(enun)) {
    return {
      termino: 'cuenca',
      definicion: 'Una cuenca es el territorio cuyas aguas drenan hacia un mismo río o mar.',
      ejemplo: 'Cuenca del Magdalena-Cauca.'
    };
  }
  if (preguntaDeRegion) {
    return {
      termino: 'regiones naturales',
      definicion: 'Colombia se organiza en regiones naturales (Andina, Caribe, Pacífica, Orinoquía, Amazonía) con relieve y clima propios.',
      ejemplo: okTxt || 'Caribe / Andina / …'
    };
  }

  if (microClave === 'vocab_context' || String(area || '').includes('ingl')) {
    const v = defVocab(okTxt);
    if (v) {
      return {
        termino: okTxt,
        definicion: `«${okTxt}» significa ${v}.`,
        ejemplo: 'Ese sentido es el que pide la oración.'
      };
    }
  }

  if (microClave && DEF_MICRO[microClave]) {
    return {
      termino: limpio(titulo || microClave).slice(0, 48) || microClave,
      definicion: DEF_MICRO[microClave],
      ejemplo: okTxt ? `Respuesta ancla: «${cortaTxt(okTxt, 70)}»` : ''
    };
  }

  const tituloL = limpio(titulo || 'este punto');
  // Intenta mapear por palabras del título a DEF_MICRO
  const keyHit = Object.keys(DEF_MICRO).find((k) => tituloL.toLowerCase().includes(k.replace(/_/g, ' '))
    || (k === 'hidrografia_colombia' && /hidrograf|afluente|cuenca/i.test(tituloL))
    || (k === 'geografia' && /geograf|regi[oó]n/i.test(tituloL)));
  if (keyHit) {
    return {
      termino: tituloL.length <= 48 ? tituloL : keyHit,
      definicion: DEF_MICRO[keyHit],
      ejemplo: okTxt ? `Respuesta ancla: «${cortaTxt(okTxt, 70)}»` : ''
    };
  }

  const areaDef = {
    matematicas: 'Matemáticas: identifica qué pide el enunciado y aplica el procedimiento o relación correcta.',
    lectura_critica: 'Lectura crítica: responde solo con lo que el texto afirma o permite inferir con seguridad.',
    ciencias_naturales: 'Ciencias: relaciona el proceso, la magnitud o la evidencia del caso sin mezclar conceptos vecinos.',
    sociales_ciudadanas: 'Sociales: ubica el hecho, la norma, la región o el mecanismo institucional del enunciado.',
    ingles: 'Inglés: elige la forma o el vocabulario que encaja con el sentido completo de la oración.'
  };
  const a = String(area || '').toLowerCase();
  const defArea = areaDef[a] || areaDef.matematicas;
  return {
    termino: tituloL.length <= 48 ? tituloL : 'concepto del ítem',
    definicion: defArea + (tituloL ? ` Punto de esta cartilla: ${cortaTxt(tituloL, 70)}.` : ''),
    ejemplo: okTxt ? `Respuesta ancla: «${cortaTxt(okTxt, 70)}»` : ''
  };
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function svgShell(aria, inner, h = 200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 ${h}" role="img" aria-label="${esc(aria)}"><rect width="560" height="${h}" rx="14" fill="#0b1220"/><rect x="1" y="1" width="558" height="${h - 2}" rx="13" fill="none" stroke="#1e293b"/>${inner}</svg>`;
}

/** Ayuda visual real según el punto (mapa, esquema, contraste de significados). */
export function diagramaCartilla({ microClave, titulo, enunciado, ops, correcta, area, concepto }) {
  const enun = limpio(enunciado);
  const ok = (ops || []).find((o) => o.letra === correcta);
  const malas = (ops || []).filter((o) => o.letra !== correcta).slice(0, 3);

  // Phrasal / vocab: contraste de significados
  if (microClave === 'phrasal_verbs' || detectarPhrasal(enun + ' ' + (ok && ok.texto))) {
    const pv = detectarPhrasal((ok && ok.texto) || '') || detectarPhrasal(enun);
    const def = defPhrasal(pv) || { es: limpio(concepto && concepto.definicion), tip: '' };
    const rows = [];
    rows.push({ t: pv || (ok && ok.texto) || 'correcta', d: def.es || 'sentido correcto', ok: true });
    malas.forEach((m) => {
      const p = detectarPhrasal(m.texto);
      const dd = p ? defPhrasal(p) : null;
      const v = dd ? dd.es : (defVocab(m.texto) || 'otro sentido');
      rows.push({ t: p || m.texto, d: v, ok: false });
    });
    const blocks = rows.slice(0, 4).map((r, i) => {
      const x = 16 + (i % 2) * 270;
      const y = 44 + Math.floor(i / 2) * 72;
      const fill = r.ok ? '#064e3b' : '#1e293b';
      const stroke = r.ok ? '#34d399' : '#475569';
      return `<rect x="${x}" y="${y}" width="258" height="64" rx="10" fill="${fill}" stroke="${stroke}"/><text x="${x + 12}" y="${y + 24}" fill="#e2e8f0" font-size="13" font-weight="700">${esc(String(r.t).slice(0, 28))}</text><text x="${x + 12}" y="${y + 46}" fill="#94a3b8" font-size="11">${esc(String(r.d).slice(0, 36))}</text>`;
    }).join('');
    return svgShell('Contraste de significados', `<text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">SIGNIFICADOS EN ESPAÑOL</text>${blocks}`, 200);
  }

  // Hidrografía / mapa mental de cuencas (solo Colombia / sociales)
  if (/magdalena|cauca|orinoco|amazonas|macizo colombiano|hidrograf|afluente del/i.test(enun + ' ' + (titulo || ''))
      && !/renania|rhineland|europa|alemania/i.test(enun)) {
    return svgShell('Cuencas de Colombia', `
      <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">MAPA MENTAL · CUENCAS</text>
      <path d="M280 36 L300 70 L295 130 L270 170 L240 150 L230 90 Z" fill="#14532d" stroke="#4ade80" stroke-width="2"/>
      <text x="248" y="100" fill="#bbf7d0" font-size="11">Andina</text>
      <circle cx="270" cy="150" r="5" fill="#38bdf8"/><text x="160" y="168" fill="#7dd3fc" font-size="12">Magdalena → Caribe</text>
      <path d="M270 120 Q240 140 220 155" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <text x="150" y="130" fill="#a5f3fc" font-size="11">Cauca (afluente)</text>
      <path d="M270 120 Q250 110 200 100" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3"/>
      <rect x="360" y="48" width="170" height="44" rx="8" fill="#1e293b" stroke="#64748b"/><text x="372" y="68" fill="#e2e8f0" font-size="12">Llanos → Orinoco</text><text x="372" y="84" fill="#94a3b8" font-size="11">otra cuenca</text>
      <rect x="360" y="110" width="170" height="44" rx="8" fill="#1e293b" stroke="#64748b"/><text x="372" y="130" fill="#e2e8f0" font-size="12">Suroriente → Amazonas</text><text x="372" y="146" fill="#94a3b8" font-size="11">otra cuenca</text>
      <text x="20" y="188" fill="#94a3b8" font-size="11">Cauca aporta al Magdalena; no al Amazonas ni al Orinoco</text>
    `, 210);
  }

  // Regiones naturales (sociales / geografía)
  if ((String(area || '').includes('social') || /geograf/i.test(titulo || ''))
      && /regi[oó]n (andina|caribe|pac[ií]fica|orinoqu|amazon)|buenaventura|barranquilla|leticia|regiones naturales/i.test(enun + ' ' + (titulo || ''))) {
    const regs = [
      { n: 'Caribe', c: '#0ea5e9', x: 200, y: 50 },
      { n: 'Pacífica', c: '#22c55e', x: 70, y: 100 },
      { n: 'Andina', c: '#eab308', x: 200, y: 110 },
      { n: 'Orinoquía', c: '#f97316', x: 340, y: 90 },
      { n: 'Amazonía', c: '#84cc16', x: 280, y: 160 }
    ];
    const dots = regs.map((r) => `<circle cx="${r.x}" cy="${r.y}" r="28" fill="${r.c}" opacity="0.85"/><text x="${r.x}" y="${r.y + 4}" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="700">${r.n}</text>`).join('');
    return svgShell('Regiones naturales de Colombia', `
      <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">REGIONES NATURALES</text>
      ${dots}
      <text x="20" y="198" fill="#94a3b8" font-size="11">Ubica ciudad/río/puerto en su región · no mezcles costas</text>
    `, 220);
  }

  // Voz pasiva
  if (microClave === 'passive_voice') {
    return svgShell('Estructura de la voz pasiva', `
      <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">VOZ PASIVA</text>
      <rect x="24" y="50" width="120" height="56" rx="10" fill="#1e3a5f" stroke="#38bdf8"/><text x="84" y="75" text-anchor="middle" fill="#e2e8f0" font-size="13">objeto</text><text x="84" y="92" text-anchor="middle" fill="#7dd3fc" font-size="11">sujeto pasivo</text>
      <text x="155" y="82" fill="#94a3b8" font-size="18">→</text>
      <rect x="180" y="50" width="100" height="56" rx="10" fill="#064e3b" stroke="#34d399"/><text x="230" y="75" text-anchor="middle" fill="#e2e8f0" font-size="13">be</text><text x="230" y="92" text-anchor="middle" fill="#6ee7b7" font-size="11">was/were…</text>
      <text x="290" y="82" fill="#94a3b8" font-size="18">+</text>
      <rect x="310" y="50" width="120" height="56" rx="10" fill="#064e3b" stroke="#34d399"/><text x="370" y="75" text-anchor="middle" fill="#e2e8f0" font-size="13">V3</text><text x="370" y="92" text-anchor="middle" fill="#6ee7b7" font-size="11">written/built</text>
      <text x="440" y="82" fill="#94a3b8" font-size="18">+</text>
      <rect x="460" y="50" width="80" height="56" rx="10" fill="#1e293b" stroke="#64748b"/><text x="500" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">by…</text>
      <text x="24" y="140" fill="#e2e8f0" font-size="13">Correcta: ${esc((ok && ok.texto) || 'be + past participle')}</text>
      <text x="24" y="168" fill="#94a3b8" font-size="12">Activa (wrote) ≠ pasiva (was written)</text>
    `, 190);
  }

  // Propósito / aviso
  if (microClave === 'infer_purpose') {
    return svgShell('Inferir el propósito', `
      <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">PROPÓSITO DEL MENSAJE</text>
      <rect x="40" y="50" width="140" height="70" rx="10" fill="#1e293b" stroke="#64748b"/><text x="110" y="90" text-anchor="middle" fill="#e2e8f0" font-size="13">Texto / aviso</text>
      <text x="200" y="90" fill="#94a3b8" font-size="22">→</text>
      <rect x="230" y="50" width="140" height="70" rx="10" fill="#1e3a5f" stroke="#38bdf8"/><text x="300" y="82" text-anchor="middle" fill="#e2e8f0" font-size="13">¿Para qué?</text><text x="300" y="100" text-anchor="middle" fill="#7dd3fc" font-size="11">avisar · pedir · informar</text>
      <text x="390" y="90" fill="#94a3b8" font-size="22">→</text>
      <rect x="420" y="50" width="120" height="70" rx="10" fill="#064e3b" stroke="#34d399"/><text x="480" y="90" text-anchor="middle" fill="#bbf7d0" font-size="12">${esc(String((ok && ok.texto) || 'propósito').slice(0, 16))}</text>
      <text x="40" y="160" fill="#94a3b8" font-size="12">No elijas saludo/venta si el texto advierte o pide algo</text>
    `, 180);
  }

  // Ramas del poder
  if (/ejecutivo|legislativo|judicial|rama del poder|corte constitucional|congreso/i.test(enun)) {
    return svgShell('Ramas del poder público', `
      <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">PODER PÚBLICO · COLOMBIA</text>
      <rect x="30" y="55" width="150" height="80" rx="10" fill="#1e3a5f" stroke="#38bdf8"/><text x="105" y="90" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="700">Legislativo</text><text x="105" y="112" text-anchor="middle" fill="#7dd3fc" font-size="11">Congreso · leyes</text>
      <rect x="205" y="55" width="150" height="80" rx="10" fill="#064e3b" stroke="#34d399"/><text x="280" y="90" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="700">Ejecutivo</text><text x="280" y="112" text-anchor="middle" fill="#6ee7b7" font-size="11">Presidente · gobierno</text>
      <rect x="380" y="55" width="150" height="80" rx="10" fill="#4c1d95" stroke="#c4b5fd"/><text x="455" y="90" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="700">Judicial</text><text x="455" y="112" text-anchor="middle" fill="#ddd6fe" font-size="11">Cortes · justicia</text>
      <text x="30" y="170" fill="#94a3b8" font-size="12">Cada rama tiene funciones propias · no las intercambies</text>
    `, 190);
  }

  // Proceso genérico ciencias / pasos
  if (String(area || '').includes('cien') || /proceso|fase|ciclo|reacci[oó]n|fotos[ií]ntesis|indagaci[oó]n/i.test(enun + ' ' + (titulo || ''))) {
    return svgShell('Esquema del proceso', `
      <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">PROCESO · NO MEZCLES ETAPAS</text>
      <rect x="30" y="60" width="120" height="50" rx="10" fill="#1e3a5f"/><text x="90" y="90" text-anchor="middle" fill="#e2e8f0" font-size="13">1. Datos</text>
      <text x="160" y="90" fill="#94a3b8" font-size="18">→</text>
      <rect x="185" y="60" width="120" height="50" rx="10" fill="#1e3a5f"/><text x="245" y="90" text-anchor="middle" fill="#e2e8f0" font-size="13">2. Relación</text>
      <text x="315" y="90" fill="#94a3b8" font-size="18">→</text>
      <rect x="340" y="60" width="180" height="50" rx="10" fill="#064e3b" stroke="#34d399"/><text x="430" y="90" text-anchor="middle" fill="#bbf7d0" font-size="12">${esc(String((ok && ok.texto) || 'resultado').slice(0, 22))}</text>
      <text x="30" y="150" fill="#94a3b8" font-size="12">${esc(String(titulo || 'Mismo proceso del enunciado').slice(0, 70))}</text>
    `, 170);
  }

  // Default: flujo del ítem con definición
  const def = limpio((concepto && concepto.definicion) || titulo || 'Concepto del ítem');
  return svgShell(titulo || 'Ayuda visual', `
    <text x="20" y="28" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1">CONCEPTO · ESTE ÍTEM</text>
    <text x="24" y="64" fill="#e2e8f0" font-size="14">${esc(def.slice(0, 72))}</text>
    <text x="24" y="88" fill="#94a3b8" font-size="12">${esc(def.slice(72, 140))}</text>
    <rect x="24" y="110" width="160" height="44" rx="10" fill="#1e293b" stroke="#64748b"/><text x="104" y="137" text-anchor="middle" fill="#cbd5e1" font-size="12">Enunciado</text>
    <text x="200" y="137" fill="#94a3b8" font-size="18">→</text>
    <rect x="230" y="110" width="160" height="44" rx="10" fill="#1e293b" stroke="#64748b"/><text x="310" y="137" text-anchor="middle" fill="#cbd5e1" font-size="12">Descarta</text>
    <text x="406" y="137" fill="#94a3b8" font-size="18">→</text>
    <rect x="430" y="110" width="110" height="44" rx="10" fill="#064e3b" stroke="#34d399"/><text x="485" y="137" text-anchor="middle" fill="#bbf7d0" font-size="12">${esc(String(correcta || 'OK'))}</text>
  `, 170);
}

export function esJustifGenericaPlantilla(txt) {
  const r = limpio(txt);
  if (!r) return true;
  if (/Error t[ií]pico/i.test(r)) return true;
  if (/No expresa lo mismo que/i.test(r)) return true;
  if (/es un distractor\./i.test(r) && /La opci[oó]n que s[ií] responde/i.test(r)) return true;
  if (/Error t[ií]pico de phrasal verb: la part[ií]cula cambia el sentido/i.test(r)) return true;
  if (/suena familiar, pero no encaja con el tiempo/i.test(r)) return true;
  if (/forma gramatical o el vocabulario/i.test(r) && r.length < 160) return true;
  if (/no resuelve (lo que pide )?este enunciado\.?$/i.test(r)) return true;
  if (/elegir un distractor cercano sin verificar/i.test(r)) return true;
  if (/elegiste algo plausible, pero que el texto no afirma/i.test(r)) return true;
  if (/mezclaste conceptos cercanos \(causa\/efecto/i.test(r)) return true;
  return false;
}

/** Definiciones canónicas cortas por micro-habilidad / subtema. */
export const DEF_MICRO = {
  phrasal_verbs: 'Un phrasal verb es verbo + partícula; su sentido se aprende en bloque (no palabra por palabra).',
  passive_voice: 'La voz pasiva se forma con be + past participle; el foco está en la acción o el objeto.',
  infer_purpose: 'El propósito es la intención del mensaje: para qué se dice o escribe.',
  dialog_response: 'En un diálogo, cada turno debe responder de forma coherente a lo que acaba de pedirse o decirse.',
  grammar_form: 'La forma gramatical correcta respeta sujeto, tiempo verbal y estructura de la oración.',
  vocab_context: 'El vocabulario correcto es el que encaja con el sentido completo de la oración (colocación).',
  algebra: 'En álgebra se despeja la incógnita con operaciones inversas a ambos lados de la igualdad.',
  geometria: 'Geometría: identifica qué pide (perímetro, área, volumen o ángulo) y usa la fórmula correcta.',
  fracciones: 'Fracción = parte/todo. Para sumar o comparar, iguala denominadores.',
  proporcionalidad: 'Proporción: si una magnitud cambia, la otra lo hace en la misma razón (directa) o al revés (inversa).',
  estadistica: 'Estadística descriptiva: media (promedio), mediana (centro), moda (más frecuente).',
  probabilidad: 'Probabilidad = casos favorables ÷ casos posibles (entre 0 y 1).',
  funciones: 'Una función asigna a cada x un único y; en y = mx + b, m es pendiente y b intercepto.',
  aritmetica: 'Aritmética: respeta el orden de operaciones y convierte unidades antes de calcular.',
  trigonometria: 'Trigonometría: seno = op/hip, coseno = adj/hip, tangente = op/adj.',
  combinatoria: 'Combinatoria: si el orden importa usa permutación; si no, combinación.',
  argumentacion: 'Un argumento une premisas con una conclusión; detecta falacias o saltos lógicos.',
  inferencia: 'Una inferencia válida se sigue del texto sin inventar datos que no están.',
  comprension_literal: 'Comprensión literal: responde solo lo que el texto dice de forma explícita.',
  evaluacion_critica: 'Evaluación crítica: juzga la tesis, el sesgo o la evidencia del autor.',
  semantica: 'Semántica: el significado depende del contexto de la palabra o expresión.',
  pragmatica: 'Pragmática: qué acto de habla realiza el enunciado (pedir, avisar, ironizar…).',
  fisica: 'Física: relaciona magnitudes (fuerza, masa, aceleración, energía) con la fórmula del caso.',
  quimica: 'Química: identifica el cambio (reacción, oxidación, equilibrio) y lo que se conserva.',
  biologia: 'Biología: ubica el proceso o estructura (célula, fotosíntesis, ecosistema) del caso.',
  indagacion: 'Indagación: distingue variable independiente, dependiente y controlada.',
  geografia: 'Geografía de Colombia: ubica el rasgo en su región natural o vertiente correcta.',
  hidrografia_colombia: 'Afluente = río que aporta a otro río. Cuenca = territorio que drena a un mismo sistema.',
  constitucion: 'La Constitución organiza el Estado en ramas (legislativa, ejecutiva, judicial) con funciones propias.',
  historia: 'Historia: sitúa el hecho en su fecha, causa y consecuencia sin confundir periodos.'
};
