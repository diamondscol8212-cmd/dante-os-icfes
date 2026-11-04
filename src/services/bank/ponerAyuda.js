export function conAyuda(item, ayuda) {
  return {
    ...item,
    pista: ayuda.pista,
    frase_acierto: ayuda.frase,
    repaso: ayuda.repaso,
    razonesPorTexto: ayuda.razones
  };
}
