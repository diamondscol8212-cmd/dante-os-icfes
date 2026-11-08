import { enriquecerAyudaItem, generarAyudaAnalitica, pistaEsDebil } from './enriquecerAyudas.js';

const PROHIBIDO = /anatom[ií]a del error|distract|\btrampas?\b/i;

function areaDe(item) {
  return String((item && (item.area || item.area_general)) || '').toLowerCase();
}

export function esSemillaEscrita(item) {
  const id = String((item && item.id) || '');
  if (!id || /_gen_/.test(id) || id.startsWith('item_ap_')) return false;
  const examen = String((item && item.target_exam) || 'SABER_11').toUpperCase();
  if (examen.includes('UNAL') || examen.includes('PRO') || examen.includes('DOCENTE')) return false;
  return /mate|lect|cien|natur|ingl|social/.test(areaDe(item));
}

/**
 * Ayuda analítica para semillas sin pista propia (sustituye la plantilla «Fíjate en: enunciado»).
 */
export function ayudaDeSemilla(item) {
  if (!esSemillaEscrita(item) && !pistaEsDebil(item && item.pista)) return null;
  const ayuda = generarAyudaAnalitica(item || {});
  if (!ayuda || !ayuda.pista) return null;
  if (PROHIBIDO.test(ayuda.pista) || PROHIBIDO.test(ayuda.frase_acierto || '')) return null;
  return {
    pista: ayuda.pista,
    frase: ayuda.frase_acierto,
    repaso: ayuda.tema_a_estudiar || ayuda.repaso,
    razones: ayuda.razonesPorTexto,
    explicacion_correcta: ayuda.explicacion_correcta,
    tema_a_estudiar: ayuda.tema_a_estudiar,
    justificacion_opciones: ayuda.justificacion_opciones
  };
}

export { enriquecerAyudaItem, pistaEsDebil };
