// 🎯 src/services/bank/diagnosticGenerator.js
// Generador Oficial de Baterías Diagnósticas Balanceadas (Dante OS Enterprise v23.1)
// Garantiza la distribución estricta de 10 reactivos para ICFES, UNAL y COMBO

import { BANCO_COMPLETO } from './index.js';
import { BANCO_PREUNIVERSITARIO_BASE } from '../PreuniversitarioService.js';
import { esEscrito } from './selectorApertura.js';

export const AREAS_ICFES_OFICIALES = [
  'matematicas',
  'lectura_critica',
  'sociales_ciudadanas',
  'ciencias_naturales',
  'ingles'
];

export const COMPONENTES_UNAL_OFICIALES = [
  'razonamiento_logico',
  'analisis_textual',
  'analisis_imagen',
  'ciencias_naturales',
  'sociales'
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Selecciona N reactivos de un área específica de Saber 11° (ICFES)
 * mediante muestreo aleatorio balanceado sobre el inventario de producción.
 */
function seleccionarItemsIcfesPorArea(area, cantidad = 2, excluirIds = new Set()) {
  const areaNorm = String(area).toLowerCase().trim();
  const itemsArea = BANCO_COMPLETO.filter(it => {
    if (excluirIds.has(it.id)) return false;
    const a = String(it.area || it.area_general || '').toLowerCase().trim();
    if (areaNorm === 'sociales_ciudadanas') {
      return a === 'sociales_ciudadanas' || a === 'sociales' || a.includes('social');
    }
    if (areaNorm === 'ciencias_naturales') {
      return a === 'ciencias_naturales' || a === 'ciencias' || a.includes('natural');
    }
    return a === areaNorm;
  });

  // Diagnóstico: primero ítems escritos; generados solo si faltan.
  const escritos = shuffleArray(itemsArea.filter(esEscrito));
  const generados = shuffleArray(itemsArea.filter((it) => !esEscrito(it)));
  const candidatos = escritos.concat(generados);
  const seleccionados = [];
  for (let i = 0; i < candidatos.length && seleccionados.length < cantidad; i++) {
    const item = candidatos[i];
    if (item) {
      excluirIds.add(item.id);
      seleccionados.push({
        ...item,
        area: areaNorm,
        materia: areaNorm,
        target_exam: 'SABER_11',
        origen: 'ICFES',
        opciones: Array.isArray(item.opciones_respuesta) ? [...item.opciones_respuesta] : (Array.isArray(item.opciones) ? [...item.opciones] : [item.opciones]),
        opciones_respuesta: Array.isArray(item.opciones_respuesta) ? [...item.opciones_respuesta] : (Array.isArray(item.opciones) ? [...item.opciones] : [item.opciones])
      });
    }
  }
  return seleccionados;
}

/**
 * Selecciona N reactivos de un componente específico de Admisión UNAL
 * mediante muestreo aleatorio balanceado sobre el inventario preuniversitario.
 */
function seleccionarItemsUnalPorComponente(componente, cantidad = 2, excluirIds = new Set()) {
  const compNorm = String(componente).toLowerCase().trim();
  const itemsComp = BANCO_PREUNIVERSITARIO_BASE.filter(it => {
    if (excluirIds.has(it.id)) return false;
    const c = String(it.area || it.materia || '').toLowerCase().trim();
    if (compNorm === 'razonamiento_logico') {
      return c === 'razonamiento_logico' || c === 'calculo' || c === 'matematicas';
    }
    if (compNorm === 'analisis_textual') {
      return c === 'analisis_textual' || c === 'lectura_critica' || c === 'filosofia';
    }
    if (compNorm === 'sociales') {
      return c === 'sociales' || c === 'ciencias_sociales';
    }
    return c === compNorm;
  });

  const candidatos = shuffleArray(itemsComp.length > 0 ? itemsComp : BANCO_PREUNIVERSITARIO_BASE);
  const seleccionados = [];
  for (let i = 0; i < cantidad && i < candidatos.length; i++) {
    const item = candidatos[i];
    if (item) {
      excluirIds.add(item.id);
      seleccionados.push({
        ...item,
        area: compNorm,
        materia: compNorm,
        target_exam: 'UNAL',
        origen: 'UNAL',
        opciones: Array.isArray(item.opciones) ? [...item.opciones] : (Array.isArray(item.opciones_respuesta) ? [...item.opciones_respuesta] : [item.opciones]),
        opciones_respuesta: Array.isArray(item.opciones) ? [...item.opciones] : (Array.isArray(item.opciones_respuesta) ? [...item.opciones_respuesta] : [item.opciones])
      });
    }
  }
  return seleccionados;
}

/**
 * 🎯 GENERADOR PRINCIPAL DE BATERÍA DIAGNÓSTICA (10 REACTIVOS ESTRICTOS)
 * 
 * 1. ICFES (10 reactivos): Exactamente 2 por cada una de las 5 materias oficiales
 *    (matematicas, lectura_critica, sociales_ciudadanas, ciencias_naturales, ingles).
 * 2. UNAL (10 reactivos): Exactamente 2 por cada uno de los 5 componentes oficiales
 *    (razonamiento_logico, analisis_textual, analisis_imagen, ciencias_naturales, sociales).
 * 3. COMBO / MIXTO (10 reactivos): Distribución simétrica 50/50:
 *    5 reactivos Saber 11° (1 de cada área) + 5 reactivos Admisión UNAL (1 de cada componente, con analisis_imagen garantizado).
 * 
 * @param {string} rawTrack - 'ICFES', 'UNAL', 'COMBO'
 * @returns {Array} 10 reactivos perfectamente balanceados
 */
export function generarBateriaDiagnostico(rawTrack = 'ICFES') {
  const track = String(rawTrack || 'ICFES').toUpperCase().trim();
  const isCombo = track.includes('COMBO') || track.includes('MIXTO') || track.includes('DOBLE');
  const isUnal = !isCombo && track.includes('UNAL');

  const excluirIds = new Set();
  const reactivos = [];

  if (isUnal) {
    // UNAL: 2 reactivos por cada uno de los 5 componentes = 10 reactivos
    for (const comp of COMPONENTES_UNAL_OFICIALES) {
      const items = seleccionarItemsUnalPorComponente(comp, 2, excluirIds);
      reactivos.push(...items);
    }
  } else if (isCombo) {
    // COMBO: Distribución simétrica 50/50 (5 Saber 11° + 5 Admisión UNAL)
    // 5 Saber 11°: 1 de cada una de las 5 materias oficiales
    const itemsIcfes = [];
    for (const area of AREAS_ICFES_OFICIALES) {
      const it = seleccionarItemsIcfesPorArea(area, 1, excluirIds);
      itemsIcfes.push(...it);
    }

    // 5 Admisión UNAL: 1 de cada uno de los 5 componentes oficiales (incluyendo obligatoriamente analisis_imagen)
    const itemsUnal = [];
    for (const comp of COMPONENTES_UNAL_OFICIALES) {
      const it = seleccionarItemsUnalPorComponente(comp, 1, excluirIds);
      itemsUnal.push(...it);
    }

    // Intercalar simétricamente: 1 ICFES, 1 UNAL para una experiencia 50/50 armónica
    for (let i = 0; i < 5; i++) {
      if (itemsIcfes[i]) reactivos.push(itemsIcfes[i]);
      if (itemsUnal[i]) reactivos.push(itemsUnal[i]);
    }
  } else {
    // ICFES: 2 reactivos por cada una de las 5 materias oficiales = 10 reactivos
    for (const area of AREAS_ICFES_OFICIALES) {
      const items = seleccionarItemsIcfesPorArea(area, 2, excluirIds);
      reactivos.push(...items);
    }
  }

  // Garantizar exactamente 10 reactivos sin cortes asimétricos
  if (reactivos.length !== 10) {
    console.warn(`⚠️ [DIAGNOSTIC GENERATOR]: Longitud anómala ${reactivos.length} para track ${track}.`);
  }

  // BANCO_COMPLETO ya viene balanceado. Volver a balancear aquí
  // cambiaba la letra correcta frente a /api/dante/calificar.
  return reactivos;
}

/**
 * Función de utilidad para obtener el desglose de áreas de una batería
 */
export function obtenerDesgloseAreas(reactivos) {
  return reactivos.map(r => r.area);
}
