/**
 * Fase 2 — Catálogo de cortes (servidor). Escala Saber 11° 0–500 + UNAL aparte.
 * Actualizar manualmente cada semestre (fecha/fuente).
 */

export const CORTES_META = {
  actualizadoEn: '2025-11',
  nota: 'Cortes orientativos. No reemplazan la convocatoria oficial de cada universidad.'
};

export const FAMILIAS_ONBOARDING = [
  { id: 'medicina_salud', match: /medicina|salud|enfermer/i, nombre: 'Medicina / Ciencias de la Salud', puntaje: 380, convocatoria: '2025' },
  { id: 'ingenieria_exactas', match: /ingenier|exactas|sistemas|comput/i, nombre: 'Ingeniería / Ciencias Exactas', puntaje: 345, convocatoria: '2025' },
  { id: 'derecho_sociales', match: /derecho|ciencias sociales|pol[ií]tica/i, nombre: 'Derecho / Ciencias Sociales', puntaje: 325, convocatoria: '2025' },
  { id: 'arquitectura_diseno', match: /arquitect|dise[nñ]o|arte/i, nombre: 'Arquitectura / Diseño / Arte', puntaje: 330, convocatoria: '2025' },
  { id: 'admin_economia', match: /administr|econom|contadur|negocio/i, nombre: 'Administración / Economía', puntaje: 310, convocatoria: '2025' },
  { id: 'licenciatura_edu', match: /licenciat|educaci[oó]n|pedagog/i, nombre: 'Licenciatura / Educación', puntaje: 305, convocatoria: '2025' }
];

export const BANCO_CORTES_UNIVERSIDADES = {
  UNAL: {
    id: 'UNAL',
    nombre: 'Universidad Nacional de Colombia (UNAL)',
    escalaMax: 1000,
    convocatoria: '2025',
    fuente: 'Referencia histórica admisión UNAL (escala propia ≈ 1000). No mezclar con Saber 11°/500.',
    actualizadoEn: CORTES_META.actualizadoEn,
    carreras: [
      { id: 'unal_medicina', nombre: 'Medicina', corte: 735, empleabilidadPct: 96, salarioPromedioCop: 4800000, area: 'Salud', materiasClave: ['ciencias_naturales', 'lectura_critica'] },
      { id: 'unal_sistemas', nombre: 'Ingeniería de Sistemas', corte: 685, empleabilidadPct: 94, salarioPromedioCop: 4500000, area: 'Ingeniería', materiasClave: ['matematicas', 'ciencias_naturales'] },
      { id: 'unal_derecho', nombre: 'Derecho', corte: 655, empleabilidadPct: 88, salarioPromedioCop: 3800000, area: 'Sociales', materiasClave: ['sociales_ciudadanas', 'lectura_critica'] },
      { id: 'unal_industrial', nombre: 'Ingeniería Industrial', corte: 645, empleabilidadPct: 91, salarioPromedioCop: 3900000, area: 'Ingeniería', materiasClave: ['matematicas', 'sociales_ciudadanas'] },
      { id: 'unal_psicologia', nombre: 'Psicología', corte: 640, empleabilidadPct: 84, salarioPromedioCop: 3200000, area: 'Sociales', materiasClave: ['sociales_ciudadanas', 'lectura_critica'] },
      { id: 'unal_arquitectura', nombre: 'Arquitectura', corte: 630, empleabilidadPct: 82, salarioPromedioCop: 3100000, area: 'Artes', materiasClave: ['matematicas', 'lectura_critica'] },
      { id: 'unal_contaduria', nombre: 'Contaduría Pública', corte: 610, empleabilidadPct: 89, salarioPromedioCop: 3300000, area: 'Económicas', materiasClave: ['matematicas', 'sociales_ciudadanas'] },
      { id: 'unal_lenguas', nombre: 'Licenciatura en Lenguas', corte: 580, empleabilidadPct: 85, salarioPromedioCop: 2800000, area: 'Idiomas', materiasClave: ['ingles', 'lectura_critica'] }
    ]
  },
  ICFES_REGIONALES: {
    id: 'ICFES_REGIONALES',
    nombre: 'Saber 11° / Universitarias Públicas Regionales',
    escalaMax: 500,
    convocatoria: '2025',
    fuente: 'Referencia pública regional / listas de admisión (escala Saber 11° ≈ 500).',
    actualizadoEn: CORTES_META.actualizadoEn,
    carreras: [
      { id: 'udea_medicina', nombre: 'Universidad de Antioquia (UdeA) - Medicina', corte: 382, empleabilidadPct: 95, salarioPromedioCop: 4600000, area: 'Salud', materiasClave: ['ciencias_naturales', 'lectura_critica'] },
      { id: 'univalle_medicina', nombre: 'Universidad del Valle (Univalle) - Medicina', corte: 385, empleabilidadPct: 95, salarioPromedioCop: 4500000, area: 'Salud', materiasClave: ['ciencias_naturales', 'lectura_critica'] },
      { id: 'udistrital_sistemas', nombre: 'Universidad Distrital - Ingeniería de Sistemas', corte: 345, empleabilidadPct: 93, salarioPromedioCop: 4200000, area: 'Ingeniería', materiasClave: ['matematicas', 'ciencias_naturales'] },
      { id: 'uis_mecanica', nombre: 'Universidad Industrial de Santander (UIS) - Ing. Mecánica', corte: 340, empleabilidadPct: 90, salarioPromedioCop: 3800000, area: 'Ingeniería', materiasClave: ['matematicas', 'ciencias_naturales'] },
      { id: 'udecaldas_enfermeria', nombre: 'Universidad de Caldas - Enfermería', corte: 315, empleabilidadPct: 88, salarioPromedioCop: 3100000, area: 'Salud', materiasClave: ['ciencias_naturales', 'lectura_critica'] },
      { id: 'upn_lic_matematicas', nombre: 'Universidad Pedagógica Nacional (UPN) - Lic. Matemáticas', corte: 305, empleabilidadPct: 86, salarioPromedioCop: 2900000, area: 'Educación', materiasClave: ['matematicas', 'lectura_critica'] },
      { id: 'uniatlantico_derecho', nombre: 'Universidad del Atlántico - Derecho', corte: 325, empleabilidadPct: 85, salarioPromedioCop: 3200000, area: 'Sociales', materiasClave: ['sociales_ciudadanas', 'lectura_critica'] },
      { id: 'unad_psicologia', nombre: 'UNAD - Psicología', corte: 280, empleabilidadPct: 81, salarioPromedioCop: 2600000, area: 'Sociales', materiasClave: ['sociales_ciudadanas', 'lectura_critica'] }
    ]
  }
};

export function familiaPorCarrera(carrera) {
  const c = String(carrera || '').trim();
  if (!c) return null;
  return FAMILIAS_ONBOARDING.find((f) => f.match.test(c)) || null;
}

export function resolverMetaSaber11({ carrera = '', pacto = '' } = {}) {
  const fam = familiaPorCarrera(carrera);
  if (fam) {
    return {
      pts: fam.puntaje,
      tipo: 'corte_estimado',
      etiqueta: `Corte estimado ${fam.convocatoria} · familia`,
      fuente: 'Estimación orientativa por familia de carrera (Saber 11°, escala 500).',
      convocatoria: fam.convocatoria,
      actualizadoEn: CORTES_META.actualizadoEn,
      carrera: fam.nombre
    };
  }
  if (pacto === '300_BASE') {
    return {
      pts: 300,
      tipo: 'meta_preparacion',
      etiqueta: 'Meta de preparación',
      fuente: 'Pacto Dante (onboarding)',
      convocatoria: null,
      actualizadoEn: CORTES_META.actualizadoEn,
      carrera: carrera || ''
    };
  }
  if (pacto === '380_ELITE') {
    return {
      pts: 380,
      tipo: 'meta_preparacion',
      etiqueta: 'Meta de preparación',
      fuente: 'Pacto Dante (onboarding)',
      convocatoria: null,
      actualizadoEn: CORTES_META.actualizadoEn,
      carrera: carrera || ''
    };
  }
  const n = parseInt(pacto, 10);
  if (n > 0 && n <= 500) {
    return {
      pts: n,
      tipo: 'meta_preparacion',
      etiqueta: 'Meta de preparación',
      fuente: 'Pacto Dante',
      convocatoria: null,
      actualizadoEn: CORTES_META.actualizadoEn,
      carrera: carrera || ''
    };
  }
  // Sin familia ni pacto: fallback preparación 300 (orientativo).
  return {
    pts: 300,
    tipo: 'meta_preparacion',
    etiqueta: 'Meta de preparación',
    fuente: 'Fallback Dante (sin corte de carrera)',
    convocatoria: null,
    actualizadoEn: CORTES_META.actualizadoEn,
    carrera: carrera || ''
  };
}
