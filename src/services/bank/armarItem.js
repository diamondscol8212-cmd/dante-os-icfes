import { figuraDe } from './figurasApertura.js';
import { redactarAyuda } from './redactarAyudaApertura.js';

export function armarArea(area, filas) {
  return filas.map((fila) => {
    const [id, sub, b, texto, correcta, d1, d2, d3] = fila;
    const figura = figuraDe(id);
    const ayuda = redactarAyuda(area, fila);
    return {
      id,
      area,
      sub,
      texto,
      opciones: [`A) ${correcta}`, `B) ${d1}`, `C) ${d2}`, `D) ${d3}`],
      ok: 'A',
      a: 1.3,
      b: Number(b) || 0,
      c: 0.2,
      target_exam: 'SABER_11',
      recurso_visual: figura || null,
      pista: ayuda.pista,
      frase_acierto: ayuda.frase,
      repaso: ayuda.repaso,
      razonesPorTexto: ayuda.razones
    };
  });
}
