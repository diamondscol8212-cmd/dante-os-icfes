/**
 * Fase 1 — Plantilla uniforme de feedback (voz Profesor Dante).
 * Acierto: una frase corta.
 * Fallo: qué miraba + por qué no sirve lo marcado + cuál era la correcta.
 */

function limpio(texto) {
  return String(texto || '').replace(/\s+/g, ' ').trim();
}

function corta(texto, tope) {
  const t = limpio(texto);
  if (t.length <= tope) return t;
  return t.slice(0, tope - 1).trim() + '…';
}

function areaDe(item) {
  return String((item && (item.area || item.area_general || item.materia)) || '').toLowerCase();
}

export function queMediaDe(item) {
  const pista = limpio(item && item.pista);
  if (pista) return corta(pista, 160);
  const area = areaDe(item);
  if (area.includes('mate')) return 'Esta pregunta mide si armas la relación con los datos y las unidades.';
  if (area.includes('lect')) return 'Esta pregunta mide si te quedas con lo que el texto sostiene.';
  if (area.includes('cien') || area.includes('natur')) return 'Esta pregunta mide si nombras el proceso o el dato que pide el caso.';
  if (area.includes('social')) return 'Esta pregunta mide si sitúas el hecho, el lugar o la norma del caso.';
  if (area.includes('ingl')) return 'Esta pregunta mide si respondes con lo que dice el texto en inglés.';
  return 'Esta pregunta mide si respondes exactamente lo que pide el enunciado.';
}

/**
 * Arma el texto de feedback uniforme.
 * @returns {{ texto: string, sinExplicacion: boolean }}
 */
export function armarExplicacionUniforme({
  acierto,
  letraMarcada,
  letraCorrecta,
  razon,
  fraseAcierto,
  queMedia,
  textoMarcado,
  textoCorrecto,
  repaso
}) {
  const marca = limpio(letraMarcada).toUpperCase();
  const clave = limpio(letraCorrecta).toUpperCase();
  const razonLimpia = limpio(razon);
  const frase = limpio(fraseAcierto);
  const media = limpio(queMedia);
  const repasoLimpio = limpio(repaso);
  const repasoSirve = repasoLimpio
    && !/^(matem[aá]ticas|lectura|ciencias|sociales|ingl[eé]s)/i.test(repasoLimpio);

  if (acierto) {
    const cortaFrase = frase ? corta(frase, 140) : 'Bien.';
    return {
      texto: frase ? `Bien. ${cortaFrase}` : 'Bien.',
      sinExplicacion: !frase
    };
  }

  const partes = [];
  if (media) partes.push(media);
  if (marca) {
    if (razonLimpia) {
      partes.push(`Marcaste ${marca}. ${razonLimpia}`);
    } else if (textoMarcado && textoCorrecto) {
      partes.push(`Marcaste ${marca}. «${corta(textoMarcado, 90)}» no responde lo pedido.`);
    } else if (marca) {
      partes.push(`Marcaste ${marca}.`);
    }
  } else if (razonLimpia) {
    partes.push(razonLimpia);
  }

  if (clave) {
    partes.push(`La correcta es ${clave}.`);
  }

  if (!razonLimpia && !frase) {
    partes.push('Aún no hay explicación guardada para esta opción.');
    if (repasoSirve) partes.push(`Repasa: ${repasoLimpio}.`);
    return { texto: partes.filter(Boolean).join(' '), sinExplicacion: true };
  }

  if (repasoSirve) partes.push(`Repasa: ${repasoLimpio}.`);
  return { texto: partes.filter(Boolean).join(' '), sinExplicacion: false };
}
