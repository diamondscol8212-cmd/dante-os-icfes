/**
 * Enunciados incompletos → estilo ICFES legible.
 * - Cloze abrupto («El texto 2»): pregunta explícita.
 * - Cloze con preposición («desemboca en»): cierra con «:» y capitaliza opciones.
 */

function limpio(t) {
  return String(t || '').replace(/\s+/g, ' ').trim();
}

function crudoOpcion(op) {
  return String(op || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim();
}

function capitalizarOpcion(texto) {
  const s = limpio(texto);
  if (!s) return s;
  if (/^[\d$€«"'¿\(\[]/.test(s)) return s;
  if (/^[A-ZÁÉÍÓÚÑ]/.test(s)) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Casos donde el enunciado corta el sujeto y obliga a adivinar la pregunta. */
const A_PREGUNTA = [
  [/ Los dos textos\s*$/i, ' ¿Qué se puede afirmar de los dos textos?'],
  [/ Los textos\s*$/i, ' ¿Qué relación hay entre los dos textos?'],
  [/ Los dos\s*$/i, ' ¿Qué se puede afirmar de los dos textos?'],
  [/ El texto 2 sirve para\s*$/i, ' ¿Para qué sirve el texto 2?'],
  [/ El texto 2 funciona como\s*$/i, ' ¿Cómo funciona el texto 2 respecto del texto 1?'],
  [/ El texto 2 es más\s*$/i, ' ¿Cómo es el texto 2 en comparación con el texto 1?'],
  [/ El texto 2\s*$/i, ' ¿Qué hace el texto 2 respecto del texto 1?'],
  [/ El texto 1 valora\s*$/i, ' ¿Qué valora el texto 1?'],
  [/ El texto 1\s*$/i, ' ¿Qué destaca el texto 1?'],
  [/ La diferencia principal es que\s*$/i, ' ¿Cuál es la diferencia principal entre los dos textos?'],
  [/ De los dos textos se concluye que\s*$/i, ' ¿Qué se concluye a partir de los dos textos?'],
  [/ El desacuerdo está en\s*$/i, ' ¿En qué consiste el desacuerdo entre los dos textos?'],
  [/ La distinción que proponen es entre\s*$/i, ' ¿Qué distinción proponen los dos textos?'],
  [/ Esa diferencia de tiempo sugiere que\s*$/i, ' ¿Qué sugiere esa diferencia de tiempo?'],
  [/ Quien lee los dos sabe que\s*$/i, ' ¿Qué sabe quien lee los dos textos?'],
  [/ No se contradicen del todo porque\s*$/i, ' ¿Por qué no se contradicen del todo?'],
  [/ Una persona que llega a las 5\s*$/i, ' ¿Qué ocurre si una persona llega a las 5?'],
  [/ La expresión «aun así» indica\s*$/i, ' ¿Qué indica la expresión «aun así»?'],
  [/ La palabra\s*$/i, ' ¿Qué ocurre con esa palabra según cada texto?'],
  [/ Se concluye que\s*$/i, ' ¿Qué se concluye?'],
  [/ El fallo está en\s*$/i, ' ¿En qué está el fallo del argumento?'],
  [/ La lluvia se presenta como\s*$/i, ' ¿Cómo se presenta la lluvia en esa frase?'],
  [/ Se infiere que\s*$/i, ' ¿Qué se puede inferir?'],
  [/ Lo más razonable es que\s*$/i, ' ¿Qué es lo más razonable inferir?'],
  [/ Las marcas sugieren que\s*$/i, ' ¿Qué sugieren las marcas?'],
  [/ esa persona\s*$/i, ' ¿Qué se puede decir de esa persona?'],
  [/ De esa frase no se puede afirmar que\s*$/i, ' ¿Qué no se puede afirmar a partir de esa frase?'],
  [/ El lector\s*$/i, ' ¿Qué ocurre con el lector?'],
  [/ Se puede inferir que\s*$/i, ' ¿Qué se puede inferir?'],
  [/ En ese momento la promesa\s*$/i, ' ¿Qué ocurre con la promesa en ese momento?'],
  [/ Esa conclusión es débil porque\s*$/i, ' ¿Por qué esa conclusión es débil?'],
  [/ Esa repetición sirve para\s*$/i, ' ¿Para qué sirve esa repetición?'],
  [/ Una conclusión prudente es que\s*$/i, ' ¿Cuál es una conclusión prudente?'],
  [/ Lo que muestra es que\s*$/i, ' ¿Qué muestra esa gráfica?'],
  [/ Entre marzo y abril la cantidad\s*$/i, ' ¿Qué ocurre con la cantidad entre marzo y abril?'],
  [/ Abrir la puerta durante el horneado\s*$/i, ' ¿Qué implica abrir la puerta durante el horneado?'],
  [/ El rojo indica\s*$/i, ' ¿Qué indica el color rojo en ese póster?'],
  [/ la luz y la glucosa\s*$/i, ' Según el mapa conceptual, ¿qué ocurre con la luz y la glucosa?'],
  [/ El teléfono es\s*$/i, ' En ese formulario, ¿qué es el teléfono?'],
  [/ El acontecimiento más antiguo de esa línea es\s*$/i, ' ¿Cuál es el acontecimiento más antiguo de esa línea?'],
  [/ no permite decir, sin más datos, que\s*$/i, ' ¿Qué no permite afirmar, sin más datos?'],
  [/ La causa de sentarse atrás es que\s*$/i, ' ¿Cuál es la causa de sentarse atrás?'],
  [/ Esa relación se describe como\s*$/i, ' ¿Cómo se describe esa relación?'],
  [/ Esa forma se llama\s*$/i, ' ¿Cómo se llama esa forma argumentativa?'],
  [/ Un contraargumento de «hay que cerrar el patio» sería\s*$/i, ' ¿Cuál sería un contraargumento de «hay que cerrar el patio»?'],
  [/ el dato más útil entre estos es\s*$/i, ' ¿Cuál es el dato más útil entre estos?'],
  [/ significa que debe llevar\s*$/i, ' ¿Qué debe llevar?'],
  [/ La expresión «por eso» introduce\s*$/i, ' ¿Qué introduce la expresión «por eso»?'],
  [/ Quien lo escanea busca\s*$/i, ' ¿Qué busca quien escanea el código?'],
  [/ El propósito de apagarlo fue\s*$/i, ' ¿Cuál fue el propósito de apagar el teléfono?'],
  [/ Para que un ejemplo sirva de prueba, debe\s*$/i, ' Para que un ejemplo sirva de prueba, ¿qué debe cumplir?']
];

const TERMINA_CLOZE = /\b(el|la|los|las|un|una|que|de|del|en|con|por|para|sobre|entre|sin|como|si|cuando|donde|cual|cuál)\s*$/i;

function enunciadoIncompleto(q) {
  const t = limpio(q);
  if (!t) return true;
  if (/[¿?]$/.test(t)) return false;
  if (/:$/.test(t)) return false;
  if (/[.!…]$/.test(t) && !/\b(el texto \d|los textos|esa persona|el lector|los dos)\s*$/i.test(t)) {
    return false;
  }
  if (/\b(el texto \d|los textos|los dos textos|los dos|esa persona|el lector|la promesa|el tel[eé]fono|el rojo|la palabra)\s*$/i.test(t)) {
    return true;
  }
  if (TERMINA_CLOZE.test(t)) return true;
  if (/^Texto\s*\d/i.test(t) && !/[¿?]/.test(t) && !/[.!:]$/.test(t)) return true;
  return false;
}

function aplicarPregunta(q) {
  let out = limpio(q);
  for (const [re, rep] of A_PREGUNTA) {
    if (re.test(out)) return limpio(out.replace(re, rep));
  }
  return null;
}

function cerrarComoCloze(q) {
  let out = limpio(q).replace(/[.:]\s*$/, '');
  return `${out}:`;
}

/**
 * @returns {{ texto: string, opciones: string[], cambiado: boolean }}
 */
export function pulirEnunciadoYOpciones(texto, opciones) {
  const optsIn = Array.isArray(opciones) ? opciones : [];
  const q0 = limpio(texto);
  let q1 = q0;

  if (enunciadoIncompleto(q0)) {
    const comoPregunta = aplicarPregunta(q0);
    if (comoPregunta) {
      q1 = comoPregunta;
    } else if (TERMINA_CLOZE.test(q0) || /^Texto\s*\d/i.test(q0)) {
      // Cloze ICFES: cierra con dos puntos (no deja el enunciado a medias).
      q1 = cerrarComoCloze(q0);
    } else {
      q1 = `${q0.replace(/[.:]\s*$/, '')}. ¿Cuál de las siguientes opciones es la correcta?`;
    }
  }

  // Limpieza de pegados raros si algún reemplazo falló
  q1 = limpio(q1)
    .replace(/\s+y\s+¿/gi, '. ¿')
    .replace(/\s{2,}/g, ' ');

  const optsOut = optsIn.map((op, i) => {
    const letra = 'ABCD'[i] || String(op).match(/^([A-D])/i)?.[1]?.toUpperCase() || '';
    const cuerpo = capitalizarOpcion(crudoOpcion(op));
    if (letra && /^[A-D]$/.test(letra)) return `${letra}) ${cuerpo}`;
    return cuerpo;
  });

  const cambiado = q1 !== q0 || optsOut.some((o, i) => limpio(o) !== limpio(optsIn[i]));
  return { texto: q1, opciones: optsOut, cambiado };
}

export function pulirItemEnunciado(item) {
  if (!item || typeof item !== 'object') return item;
  const opts = item.opciones_respuesta || item.opciones || [];
  const { texto, opciones, cambiado } = pulirEnunciadoYOpciones(
    item.pregunta_texto || item.texto || item.enunciado || '',
    opts
  );
  if (!cambiado) return item;
  return {
    ...item,
    texto,
    pregunta_texto: texto,
    enunciado: texto,
    opciones,
    opciones_respuesta: opciones
  };
}

export { enunciadoIncompleto, capitalizarOpcion };
