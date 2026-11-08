import { figuraDe } from './figurasApertura.js';
import { redactarAyuda } from './redactarAyudaApertura.js';
import { pulirEnunciadoYOpciones } from './pulirEnunciados.js';

export function armarArea(area, filas) {
  return filas.map((fila) => {
    const [id, sub, b, textoCrudo, correcta, d1, d2, d3] = fila;
    const figura = figuraDe(id);
    const pulido = pulirEnunciadoYOpciones(textoCrudo, [correcta, d1, d2, d3]);
    const texto = pulido.texto;
    const [okTxt, m1, m2, m3] = pulido.opciones.map((o) =>
      String(o || '').replace(/^[A-Da-d][\)\.\:\-]\s*/, '').trim()
    );
    const filaAyuda = [id, sub, b, texto, okTxt, m1, m2, m3];
    const ayuda = redactarAyuda(area, filaAyuda);
    return {
      id,
      area,
      sub,
      texto,
      pregunta_texto: texto,
      opciones: [`A) ${okTxt}`, `B) ${m1}`, `C) ${m2}`, `D) ${m3}`],
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
