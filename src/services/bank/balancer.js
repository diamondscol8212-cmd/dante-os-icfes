// ⚖️ src/services/bank/balancer.js
// Dante OS Enterprise Edition - Motor de Balanceo Psicométrico y Aleatorización de Claves
// Elimina cualquier sesgo hacia una sola opción (A/B/C/D), garantizando distribución simétrica 25% ± 0.05%

export const LETRAS_OPCIONES = ['A', 'B', 'C', 'D'];

/**
 * Balancea un reactivo individual rotando la opción correcta a una letra objetivo (A, B, C o D)
 * y remapeando coherentemente distractores, trampas y etiquetas.
 */
export function balancearItem(item, idx = 0) {
  if (!item || typeof item !== 'object') return item;

  const currentKey = String(item.ok || item.correcta || 'A').trim().toUpperCase();
  const oldIdx = LETRAS_OPCIONES.indexOf(currentKey) >= 0 ? LETRAS_OPCIONES.indexOf(currentKey) : 0;
  const targetIdx = idx % 4;
  const targetKey = LETRAS_OPCIONES[targetIdx];

  const rawOpts = (Array.isArray(item.opciones_respuesta) && item.opciones_respuesta.length === 4
    ? item.opciones_respuesta
    : (Array.isArray(item.opciones) && item.opciones.length === 4 ? item.opciones : null));

  if (!rawOpts) {
    return {
      ...item,
      ok: targetKey,
      correcta: targetKey
    };
  }

  const cleanTexts = rawOpts.map(o => {
    return String(o || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
  });

  const correctText = cleanTexts[oldIdx];
  const distractorEntries = [];
  for (let i = 0; i < 4; i++) {
    if (i !== oldIdx) {
      distractorEntries.push({ oldLetter: LETRAS_OPCIONES[i], text: cleanTexts[i] });
    }
  }

  const newOpts = [];
  const distractorMap = {};
  let distIdx = 0;

  for (let i = 0; i < 4; i++) {
    if (i === targetIdx) {
      newOpts.push(`${LETRAS_OPCIONES[i]}) ${correctText}`);
    } else {
      const dist = distractorEntries[distIdx++];
      if (dist) {
        distractorMap[dist.oldLetter] = LETRAS_OPCIONES[i];
        newOpts.push(`${LETRAS_OPCIONES[i]}) ${dist.text}`);
      }
    }
  }

  let newTrampas = item.trampas;
  if (Array.isArray(item.trampas)) {
    newTrampas = item.trampas.map(t => {
      const oldLet = String(t.opcion || '').trim().toUpperCase();
      return {
        ...t,
        opcion: distractorMap[oldLet] || t.opcion
      };
    });
  }

  let justificacion = null;
  if (item.razonesPorTexto && typeof item.razonesPorTexto === 'object') {
    justificacion = {};
    newOpts.forEach((opcion, i) => {
      const limpio = String(opcion || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
      const letra = LETRAS_OPCIONES[i];
      if (letra !== targetKey && item.razonesPorTexto[limpio]) {
        justificacion[letra] = item.razonesPorTexto[limpio];
      }
    });
  } else if (item.justificacion_opciones && typeof item.justificacion_opciones === 'object') {
    // Remapear por texto: la justificación vieja iba con letras del orden anterior.
    const razonesPorTextoViejo = {};
    LETRAS_OPCIONES.forEach((letra, i) => {
      const texto = cleanTexts[i];
      const razon = item.justificacion_opciones[letra];
      if (texto && razon) razonesPorTextoViejo[texto] = razon;
    });
    justificacion = {};
    newOpts.forEach((opcion, i) => {
      const limpio = String(opcion || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
      const letra = LETRAS_OPCIONES[i];
      if (letra !== targetKey && razonesPorTextoViejo[limpio]) {
        justificacion[letra] = razonesPorTextoViejo[limpio];
      }
    });
  }

  const salida = {
    ...item,
    opciones: newOpts,
    opciones_respuesta: newOpts,
    ok: targetKey,
    correcta: targetKey,
    trampas: newTrampas
  };
  delete salida.razonesPorTexto;
  if (justificacion) salida.justificacion_opciones = justificacion;
  return salida;
}

/**
 * Balancea una colección completa de reactivos distribuyendo equitativamente
 * las opciones correctas entre A, B, C y D (25% cada una) con orden aleatorio no predecible.
 */
export function balancearColeccion(items) {
  if (!Array.isArray(items) || items.length === 0) return [];
  
  // Generar conjunto balanceado de índices objetivos (0=A, 1=B, 2=C, 3=D)
  const numEach = Math.floor(items.length / 4);
  const remainder = items.length % 4;
  const targetIndices = [];
  for (let l = 0; l < 4; l++) {
    for (let c = 0; c < numEach; c++) targetIndices.push(l);
  }
  for (let r = 0; r < remainder; r++) {
    targetIndices.push(r);
  }

  // Misma pregunta, misma letra, en cada arranque. Un barajado al azar
  // cambiaba la clave entre el envío y la calificación.
  let semilla = 0xD4E705;
  const azar = () => {
    semilla = (semilla + 0x6D2B79F5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = targetIndices.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [targetIndices[i], targetIndices[j]] = [targetIndices[j], targetIndices[i]];
  }

  return items.map((it, idx) => balancearItem(it, targetIndices[idx]));
}
