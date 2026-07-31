// 📦 src/services/bank/index.js - Consolidador Maestro General
import { reactivosMatematicas } from './matematicas.js';
import { reactivosLecturaCritica } from './lectura_critica.js';
import { reactivosCienciasNaturales } from './ciencias_naturales.js';
import { reactivosIngles } from './ingles.js';
import { reactivosSociales } from './sociales_ciudadanas.js';

export const BANCO_COMPLETO = [
    ...reactivosMatematicas,
    ...reactivosLecturaCritica,
    ...reactivosCienciasNaturales,
    ...reactivosIngles,
    ...reactivosSociales
];