import { BANCO_COMPLETO } from './index.js';
import { armarExplicacionUniforme, queMediaDe } from './explicacionUniforme.js';

const mapa = new Map(BANCO_COMPLETO.map((it) => [String(it.id), it]));

function limpio(texto) {
  return String(texto || '')
    .replace(/^[A-Da-d][\)\.\:\-]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function textoDe(item, letra) {
  const opts = item.opciones || item.opciones_respuesta || [];
  const marca = String(letra || '').trim().toUpperCase();
  for (const op of opts) {
    const texto = String(op || '');
    const prefijo = texto.match(/^([A-Da-d])[\)\.\:\-]\s*/);
    if (prefijo && prefijo[1].toUpperCase() === marca) {
      return limpio(texto);
    }
  }
  const idx = 'ABCD'.indexOf(marca);
  if (idx < 0 || !opts[idx]) return '';
  return limpio(opts[idx]);
}

function letraDeTexto(item, texto) {
  const buscado = limpio(texto);
  if (!buscado) return '';
  for (const letra of ['A', 'B', 'C', 'D']) {
    if (textoDe(item, letra) === buscado) return letra;
  }
  return '';
}

/**
 * Califica por el texto que el estudiante vio cuando se puede.
 * La letra sola no basta: el banco local y el del servidor a veces
 * tienen el mismo id con las opciones en distinto orden.
 */
export function juicioDeItem(itemId, letra, textoOpcion) {
  const item = mapa.get(String(itemId || ''));
  if (!item) return null;
  const clave = String(item.correcta || item.ok || '').trim().toUpperCase();
  const elegida = String(letra || '').trim().toUpperCase();
  if (!/^[ABCD]$/.test(clave)) return null;

  const textoClave = textoDe(item, clave);
  const textoPorLetra = /^[ABCD]$/.test(elegida) ? textoDe(item, elegida) : '';
  const textoUsuario = limpio(textoOpcion) || textoPorLetra;
  const letraDelTexto = letraDeTexto(item, textoUsuario);

  const acierto = Boolean(
    (textoClave && textoUsuario && textoUsuario === textoClave)
    || (!limpio(textoOpcion) && elegida === clave)
  );

  const razones = item.justificacion_opciones || {};
  let razon = '';
  if (!acierto) {
    const letraRazon = letraDelTexto || elegida;
    razon = String(razones[letraRazon] || '');
    if (!razon && textoUsuario && textoClave) {
      razon = `«${textoUsuario}» no responde lo pedido. Lo que sí responde es «${textoClave}».`;
    }
  }

  const fraseAcierto = acierto ? String(item.frase_acierto || '') : '';
  const repaso = String(item.repaso || '');
  const queMedia = queMediaDe(item);
  const uniforme = armarExplicacionUniforme({
    acierto,
    letraMarcada: letraDelTexto || elegida,
    letraCorrecta: clave,
    razon,
    fraseAcierto,
    queMedia,
    textoMarcado: textoUsuario,
    textoCorrecto: textoClave,
    repaso
  });

  return {
    esCorrecta: acierto,
    letraCorrecta: clave,
    textoCorrecto: textoClave,
    textoElegido: textoUsuario,
    razon,
    fraseAcierto,
    repaso,
    queMedia,
    explicacion: uniforme.texto,
    sinExplicacion: uniforme.sinExplicacion === true
  };
}
