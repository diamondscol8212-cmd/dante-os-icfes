/**
 * Validador AAA de cartillas / correcciones del banco actual.
 *
 * Uso:
 *   node scripts/validarCartillasAAA.mjs
 *   node scripts/validarCartillasAAA.mjs --json
 *
 * Estados:
 *   AAA        → cumple los 8 elementos con calidad mínima
 *   Incompleto → falta uno o más elementos estructurales
 *   Revisar    → tiene estructura pero contenido genérico/débil
 *
 * No modifica la app ni datos de usuario: solo valida y reporta.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const bankPath = path.join(root, 'public', 'bancoPreguntas.json');
const catalogPath = path.join(root, 'public', 'temasRefuerzo.json');
const reportPath = path.join(root, 'scripts', 'reporteValidacionAAA.json');

const GENERIC_RE = /lee (el |la |este )?enunciado|contr[aá]stalo con el enunciado|f[ií]jate en:|punto clave es:|error t[ií]pico:|no resuelve (lo que pide )?este enunciado|elige una opci[oó]n|sin verificar el sentido completo|opci[oó]n incorrecta\.?$/i;

function limpio(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function corta(s, n) {
  const t = limpio(s);
  return t.length <= n ? t : t.slice(0, n - 1) + '…';
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
    return { letra: L, texto: body };
  }).filter((o) => o.texto);
}

function correctaDe(p) {
  return String(p.correcta || p.ok || '').toUpperCase().slice(0, 1);
}

function cartillaIdDe(itemId) {
  const s = String(itemId || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 96);
  return s ? ('q_' + s) : '';
}

function esGenerico(txt) {
  const t = limpio(txt);
  if (!t) return true;
  if (t.length < 24) return true;
  return GENERIC_RE.test(t);
}

/**
 * Extrae los 8 bloques AAA desde cartilla + ítem del banco.
 */
export function extraerBloquesAAA(item, cartilla) {
  const ops = opcionesDe(item || {});
  const correcta = correctaDe(item || {});
  const malas = ops.filter((o) => o.letra !== correcta);
  const ex = (cartilla && cartilla.explicacion) || {};
  const concepto = (cartilla && cartilla.conceptoPrincipal) || ex.concepto || {};
  const ejemplo = ex.ejemplo_resuelto || cartilla?.ejemplo_resuelto || null;
  const terminos = ex.terminos || cartilla?.terminos || [];
  const practica = Array.isArray(cartilla?.practica) ? cartilla.practica : [];
  const justBank = (item && item.justificacion_opciones && typeof item.justificacion_opciones === 'object')
    ? item.justificacion_opciones
    : {};

  const definicion = limpio(concepto.definicion || '')
    || limpio((terminos[0] && terminos[0].definicion) || '');

  const porqueCorrecta = limpio(ex.porqueCorrecta || cartilla?.porqueCorrecta || '')
    || limpio(item?.explicacion_correcta || '')
    || limpio(ex.intro || '').split(/(?=[A-D]\))/)[0];

  const distractores = [];
  const listaDist = Array.isArray(ex.distractores) ? ex.distractores : [];
  if (listaDist.length) {
    listaDist.forEach((d) => {
      distractores.push({
        letra: d.letra,
        texto: d.texto || '',
        atrae: limpio(d.atrae || ''),
        falla: limpio(d.falla || d.explicacion || '')
      });
    });
  } else {
    const errores = Array.isArray(ex.errores) ? ex.errores : [];
    malas.forEach((o, i) => {
      const fromErr = limpio(errores[i] || '');
      const fromBank = limpio(justBank[o.letra] || '');
      distractores.push({
        letra: o.letra,
        texto: o.texto,
        atrae: '',
        falla: fromErr || fromBank
      });
    });
  }

  const errorTipico = limpio(ex.errorTipico || cartilla?.errorTipico || '')
    || limpio((Array.isArray(ex.errores) && ex.errores[0]) || '');

  const contraste = (ejemplo && ejemplo.contraste) || ex.contraste || cartilla?.contraste || null;
  const pasosEjemplo = (ejemplo && Array.isArray(ejemplo.pasos)) ? ejemplo.pasos : [];

  return {
    definicion,
    porqueCorrecta,
    distractores,
    ejemploPasos: pasosEjemplo,
    ejemploEnunciado: limpio((ejemplo && ejemplo.enunciado) || ''),
    ejemploRespuesta: limpio((ejemplo && ejemplo.respuesta) || ''),
    errorTipico,
    contraste,
    terminos,
    practica,
    pista: limpio(item?.pista || ''),
    intro: limpio(ex.intro || '')
  };
}

/**
 * Valida un ítem. Retorna { estado, faltantes, debiles, score, detalle }.
 */
export function validarItemAAA(item, cartilla) {
  const bloques = extraerBloquesAAA(item, cartilla);
  const ops = opcionesDe(item || {});
  const correcta = correctaDe(item || {});
  const nDistractores = ops.filter((o) => o.letra !== correcta).length;
  const faltantes = [];
  const debiles = [];

  // 1. Definición
  if (!bloques.definicion || bloques.definicion.length < 28) faltantes.push('definicion');
  else if (esGenerico(bloques.definicion) || /punto clave es:/i.test(bloques.definicion)) debiles.push('definicion');

  // 2. Por qué correcta
  if (!bloques.porqueCorrecta || bloques.porqueCorrecta.length < 28) faltantes.push('porqueCorrecta');
  else if (
    esGenerico(bloques.porqueCorrecta)
    || (/^La respuesta es «/i.test(bloques.porqueCorrecta) && !/porque|significa|encaja|cumple|es la forma|expresa/i.test(bloques.porqueCorrecta))
  ) {
    debiles.push('porqueCorrecta');
  }

  // 3. Distractores específicos (uno por incorrecta)
  if (!bloques.distractores.length || bloques.distractores.length < Math.max(1, nDistractores)) {
    faltantes.push('distractores');
  } else {
    const fallas = bloques.distractores.map((d) => limpio(d.falla));
    const incompletos = bloques.distractores.filter((d) => !d.falla || d.falla.length < 20);
    if (incompletos.length) faltantes.push('distractores');
    else if (fallas.some((f) => esGenerico(f))) debiles.push('distractores');
    else if (new Set(fallas).size < Math.min(2, fallas.length)) debiles.push('distractores_repetidos');
    // AAA estricto: idealmente tiene “atrae”
    const sinAtrae = bloques.distractores.filter((d) => !limpio(d.atrae));
    if (sinAtrae.length === bloques.distractores.length) debiles.push('distractores_sin_atrae');
  }

  // 4. Ejemplo resuelto paso a paso
  if (!bloques.ejemploPasos || bloques.ejemploPasos.length < 3) faltantes.push('ejemplo_resuelto');
  else if (bloques.ejemploPasos.some((p) => esGenerico(p) && /lee el enunciado/i.test(p))) debiles.push('ejemplo_resuelto');

  // 5. Error típico / modelo mental
  if (!bloques.errorTipico || bloques.errorTipico.length < 24) faltantes.push('errorTipico');
  else if (/^Error t[ií]pico:\s*elegiste algo plausible/i.test(bloques.errorTipico)) debiles.push('errorTipico');

  // 6. Contraste rápido
  const ctr = bloques.contraste;
  if (!ctr || !limpio(ctr.valido) || !limpio(ctr.invalido)) faltantes.push('contraste');
  else if (esGenerico(ctr.valido) || esGenerico(ctr.invalido) || /distractor cercano sin verificar/i.test(ctr.invalido || '')) {
    debiles.push('contraste');
  }

  // 7. Términos clave
  const termsOk = (bloques.terminos || []).filter((t) => limpio(t.termino) && limpio(t.definicion) && limpio(t.definicion).length >= 20);
  if (termsOk.length < 2) faltantes.push('terminos');
  else if (termsOk.some((t) => esGenerico(t.definicion))) debiles.push('terminos');

  // 8. Práctica
  if (!bloques.practica || bloques.practica.length < 1) faltantes.push('practica');
  else {
    const q0 = bloques.practica[0];
    if (!limpio(q0.enunciado) || !limpio(q0.correcta)) faltantes.push('practica');
  }

  // Pista del test (calidad auxiliar; no bloquea AAA estructural si cartilla está completa,
  // pero marca Revisar si es genérica).
  if (bloques.pista && esGenerico(bloques.pista)) debiles.push('pista');
  if (!bloques.pista) debiles.push('pista_ausente');

  let estado = 'AAA';
  if (faltantes.length) estado = 'Incompleto';
  else if (debiles.length) estado = 'Revisar';

  const totalChecks = 8;
  const score = Math.max(0, totalChecks - faltantes.length);

  return {
    estado,
    score,
    faltantes,
    debiles,
    detalle: {
      definicion: corta(bloques.definicion, 120),
      nDistractores: bloques.distractores.length,
      nPractica: (bloques.practica || []).length,
      nTerminos: termsOk.length,
      tieneContraste: Boolean(ctr && ctr.valido && ctr.invalido),
      tieneErrorTipico: Boolean(bloques.errorTipico),
      tienePorqueCorrecta: Boolean(bloques.porqueCorrecta)
    }
  };
}

export function validarBancoAAA({ bank, catalog } = {}) {
  const rawBank = bank || JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  const items = Array.isArray(rawBank) ? rawBank : (rawBank.preguntas || []);
  const rawCat = catalog || JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const byId = new Map();
  (rawCat.temas || []).forEach((t) => {
    if (!t) return;
    if (t.id) byId.set(String(t.id), t);
    if (t.itemId) byId.set(cartillaIdDe(t.itemId), t);
  });

  const resultados = [];
  for (const item of items) {
    if (!item || item.id == null) continue;
    const cid = limpio(item.tema_refuerzo_id) || cartillaIdDe(item.id);
    const cart = byId.get(cid) || byId.get(cartillaIdDe(item.id)) || null;
    const v = validarItemAAA(item, cart);
    resultados.push({
      id: String(item.id),
      cartillaId: cid,
      area: limpio(item.area || item.materia || ''),
      titulo: limpio((cart && cart.titulo) || item.tema_a_estudiar || ''),
      tieneCartilla: Boolean(cart),
      ...v
    });
  }

  const resumen = {
    generatedAt: new Date().toISOString(),
    total: resultados.length,
    AAA: resultados.filter((r) => r.estado === 'AAA').length,
    Incompleto: resultados.filter((r) => r.estado === 'Incompleto').length,
    Revisar: resultados.filter((r) => r.estado === 'Revisar').length,
    pctAAA: 0,
    faltantesMasComunes: {},
    debilesMasComunes: {}
  };
  resumen.pctAAA = resumen.total ? Number(((100 * resumen.AAA) / resumen.total).toFixed(1)) : 0;

  resultados.forEach((r) => {
    (r.faltantes || []).forEach((f) => {
      resumen.faltantesMasComunes[f] = (resumen.faltantesMasComunes[f] || 0) + 1;
    });
    (r.debiles || []).forEach((d) => {
      resumen.debilesMasComunes[d] = (resumen.debilesMasComunes[d] || 0) + 1;
    });
  });

  return {
    resumen,
    incompletos: resultados.filter((r) => r.estado === 'Incompleto').map((r) => ({
      id: r.id, area: r.area, faltantes: r.faltantes, titulo: r.titulo
    })),
    revisar: resultados.filter((r) => r.estado === 'Revisar').map((r) => ({
      id: r.id, area: r.area, debiles: r.debiles, titulo: r.titulo
    })),
    resultados
  };
}

function main() {
  const report = validarBancoAAA();
  const out = {
    resumen: report.resumen,
    incompletos: report.incompletos,
    revisar: report.revisar.slice(0, 200),
    muestras: {
      AAA: report.resultados.filter((r) => r.estado === 'AAA').slice(0, 3),
      Incompleto: report.incompletos.slice(0, 8),
      Revisar: report.revisar.slice(0, 8)
    }
  };
  fs.writeFileSync(reportPath, JSON.stringify(out, null, 2), 'utf8');
  const asJson = process.argv.includes('--json');
  if (asJson) {
    console.log(JSON.stringify(out.resumen, null, 2));
  } else {
    console.log('=== Validación AAA Temas de refuerzo ===');
    console.log(`Total: ${out.resumen.total}`);
    console.log(`AAA: ${out.resumen.AAA} (${out.resumen.pctAAA}%)`);
    console.log(`Incompleto: ${out.resumen.Incompleto}`);
    console.log(`Revisar: ${out.resumen.Revisar}`);
    console.log('Faltantes más comunes:', out.resumen.faltantesMasComunes);
    console.log('Débiles más comunes:', out.resumen.debilesMasComunes);
    console.log(`Reporte: ${reportPath}`);
  }
  // Exit code 0 siempre (herramienta de diagnóstico); CI puede leer el JSON.
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
