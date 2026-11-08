/**
 * Feedback uniforme del boletín / corrección inmediata.
 * Fallo: por qué falló la marcada + por qué es correcta la clave + tema a estudiar.
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
  if (pista) return corta(pista, 180);
  const area = areaDe(item);
  if (area.includes('mate')) return 'Esta pregunta mide si armas la relación correcta con los datos.';
  if (area.includes('lect')) return 'Esta pregunta mide si te quedas con lo que el texto sostiene.';
  if (area.includes('cien') || area.includes('natur')) return 'Esta pregunta mide si nombras el proceso o el dato del caso.';
  if (area.includes('social')) return 'Esta pregunta mide si sitúas el hecho, el lugar o la norma del caso.';
  if (area.includes('ingl')) return 'Esta pregunta mide si respondes con lo que dice el texto en inglés.';
  return 'Esta pregunta mide si respondes exactamente lo que pide el enunciado.';
}

/**
 * @returns {{ texto: string, sinExplicacion: boolean, bloques?: object }}
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
  repaso,
  explicacionCorrecta,
  temaEstudiar
}) {
  const marca = limpio(letraMarcada).toUpperCase();
  const clave = limpio(letraCorrecta).toUpperCase();
  const razonLimpia = limpio(razon);
  const frase = limpio(fraseAcierto);
  const media = limpio(queMedia);
  const explCorrecta = limpio(explicacionCorrecta);
  const tema = limpio(temaEstudiar || repaso);
  const temaSirve = tema
    && !/^(matem[aá]ticas|lectura|ciencias|sociales|ingl[eé]s)$/i.test(tema);

  if (acierto) {
    const partesOk = [];
    if (frase) partesOk.push(`Bien. ${corta(frase, 160)}`);
    else partesOk.push('Bien.');
    if (explCorrecta) partesOk.push(corta(explCorrecta, 200));
    if (temaSirve) partesOk.push(`Para preguntas similares, estudia: ${tema}.`);
    return {
      texto: partesOk.filter(Boolean).join(' '),
      sinExplicacion: !frase && !explCorrecta,
      bloques: {
        acierto: true,
        explicacion_correcta: explCorrecta || frase,
        tema_a_estudiar: temaSirve ? tema : ''
      }
    };
  }

  const porQueFallo = razonLimpia
    || (textoMarcado && textoCorrecto
      ? `«${corta(textoMarcado, 100)}» no responde lo pedido.`
      : (marca ? `La opción ${marca} no es la correcta.` : ''));

  const porQueCorrecta = explCorrecta
    || (clave && textoCorrecto
      ? `La correcta es ${clave}: «${corta(textoCorrecto, 120)}».`
      : (clave ? `La correcta es ${clave}.` : ''))
    || (frase ? corta(frase, 160) : '');

  const partes = [];
  if (media) partes.push(media);
  if (marca && porQueFallo) {
    partes.push(porQueFallo.startsWith('Marcaste') ? porQueFallo : `Marcaste ${marca}. ${porQueFallo}`);
  } else if (porQueFallo) {
    partes.push(porQueFallo);
  }
  if (porQueCorrecta) partes.push(porQueCorrecta);
  if (temaSirve) partes.push(`Estudia este tema: ${tema}.`);

  const sinExplicacion = !razonLimpia && !explCorrecta && !frase;
  if (sinExplicacion) {
    partes.push('Aún no hay explicación guardada para esta opción.');
  }

  return {
    texto: partes.filter(Boolean).join(' '),
    sinExplicacion,
    bloques: {
      acierto: false,
      explicacion_incorrecta: porQueFallo,
      explicacion_correcta: porQueCorrecta,
      tema_a_estudiar: temaSirve ? tema : ''
    }
  };
}
