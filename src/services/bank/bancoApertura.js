import { reactivosAperturaMatematicas } from './aperturaMatematicas.js';
import { reactivosAperturaLectura } from './aperturaLectura.js';
import { reactivosAperturaCiencias } from './aperturaCiencias.js';
import { reactivosAperturaSociales } from './aperturaSociales.js';
import { reactivosAperturaIngles } from './aperturaIngles.js';

export const reactivosApertura = [
  ...reactivosAperturaMatematicas,
  ...reactivosAperturaLectura,
  ...reactivosAperturaCiencias,
  ...reactivosAperturaSociales,
  ...reactivosAperturaIngles
];
