/**
 * Fase 2 — Cortes de admisión con fecha/fuente (escala Saber 11° 0–500).
 * Si no hay corte reciente para la carrera: meta de preparación (300/380 del pacto).
 */
(function () {
  'use strict';

  const ACTUALIZADO = '2025-11';
  const FUENTE_FAMILIAS = 'Estimación orientativa por familia de carrera (Saber 11°, escala 500). Revisar cada semestre.';
  const FUENTE_REGIONAL = 'Referencia pública regional / listas de admisión (escala Saber 11° ≈ 500).';

  /** Cortes orientativos por familia del onboarding (nunca escala UNAL 1000). */
  const FAMILIAS = [
    {
      id: 'medicina_salud',
      match: /medicina|salud|enfermer/i,
      nombre: 'Medicina / Ciencias de la Salud',
      puntaje: 380,
      convocatoria: '2025'
    },
    {
      id: 'ingenieria_exactas',
      match: /ingenier|exactas|sistemas|comput/i,
      nombre: 'Ingeniería / Ciencias Exactas',
      puntaje: 345,
      convocatoria: '2025'
    },
    {
      id: 'derecho_sociales',
      match: /derecho|ciencias sociales|pol[ií]tica/i,
      nombre: 'Derecho / Ciencias Sociales',
      puntaje: 325,
      convocatoria: '2025'
    },
    {
      id: 'arquitectura_diseno',
      match: /arquitect|dise[nñ]o|arte/i,
      nombre: 'Arquitectura / Diseño / Arte',
      puntaje: 330,
      convocatoria: '2025'
    },
    {
      id: 'admin_economia',
      match: /administr|econom|contadur|negocio/i,
      nombre: 'Administración / Economía',
      puntaje: 310,
      convocatoria: '2025'
    },
    {
      id: 'licenciatura_edu',
      match: /licenciat|educaci[oó]n|pedagog/i,
      nombre: 'Licenciatura / Educación',
      puntaje: 305,
      convocatoria: '2025'
    }
  ];

  /** Cortes de referencia en escala 500 (no UNAL). */
  const CORTES_SABER = [
    { id: 'udea_medicina', nombre: 'UdeA — Medicina', puntaje: 382, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'univalle_medicina', nombre: 'Univalle — Medicina', puntaje: 385, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'udistrital_sistemas', nombre: 'Distrital — Ing. Sistemas', puntaje: 345, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'uis_mecanica', nombre: 'UIS — Ing. Mecánica', puntaje: 340, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'udecaldas_enfermeria', nombre: 'U. Caldas — Enfermería', puntaje: 315, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'upn_lic_matematicas', nombre: 'UPN — Lic. Matemáticas', puntaje: 305, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'uniatlantico_derecho', nombre: 'U. Atlántico — Derecho', puntaje: 325, convocatoria: '2025', fuente: FUENTE_REGIONAL },
    { id: 'unad_psicologia', nombre: 'UNAD — Psicología', puntaje: 280, convocatoria: '2025', fuente: FUENTE_REGIONAL }
  ];

  function limpio(texto) {
    return String(texto || '').replace(/\s+/g, ' ').trim();
  }

  function pactoAPts(pacto) {
    const p = limpio(pacto);
    if (p === '300_BASE') return 300;
    if (p === '380_ELITE') return 380;
    const n = parseInt(p, 10);
    if (n > 0 && n <= 500) return n;
    return null;
  }

  function buscarFamilia(carrera) {
    const c = limpio(carrera);
    if (!c) return null;
    return FAMILIAS.find((f) => f.match.test(c)) || null;
  }

  function buscarCorteNombrado(carrera) {
    const c = limpio(carrera).toLowerCase();
    if (!c) return null;
    return CORTES_SABER.find((row) => {
      const n = String(row.nombre || '').toLowerCase();
      const head = c.split('/')[0].trim();
      return n.includes(head) || c.includes(String(row.id || '').replace(/_/g, ' '));
    }) || null;
  }

  /**
   * @returns {{
   *   pts: number,
   *   tipo: 'corte_estimado'|'meta_preparacion',
   *   etiqueta: string,
   *   fuente: string,
   *   convocatoria: string|null,
   *   actualizadoEn: string,
   *   carrera: string
   * }|null}
   */
  function resolverMetaSaber11(opts) {
    const o = opts || {};
    const carrera = limpio(o.carrera || (typeof localStorage !== 'undefined' ? localStorage.getItem('dante_carrera_objetivo') : '') || '');
    const pacto = limpio(o.pacto || (typeof localStorage !== 'undefined' ? localStorage.getItem('dante_pacto_meta') : '') || '');

    const nombrado = buscarCorteNombrado(carrera);
    if (nombrado && nombrado.puntaje > 0 && nombrado.puntaje <= 500) {
      return {
        pts: nombrado.puntaje,
        tipo: 'corte_estimado',
        etiqueta: 'Corte estimado ' + (nombrado.convocatoria || '2025'),
        fuente: nombrado.fuente || FUENTE_REGIONAL,
        convocatoria: nombrado.convocatoria || '2025',
        actualizadoEn: ACTUALIZADO,
        carrera: nombrado.nombre,
        id: nombrado.id
      };
    }

    const familia = buscarFamilia(carrera);
    if (familia && familia.puntaje > 0 && familia.puntaje <= 500) {
      return {
        pts: familia.puntaje,
        tipo: 'corte_estimado',
        etiqueta: 'Corte estimado ' + (familia.convocatoria || '2025') + ' · familia',
        fuente: FUENTE_FAMILIAS,
        convocatoria: familia.convocatoria || '2025',
        actualizadoEn: ACTUALIZADO,
        carrera: familia.nombre,
        id: familia.id
      };
    }

    const pactoPts = pactoAPts(pacto);
    if (pactoPts != null) {
      return {
        pts: pactoPts,
        tipo: 'meta_preparacion',
        etiqueta: 'Meta de preparación',
        fuente: 'Pacto Dante (onboarding)',
        convocatoria: null,
        actualizadoEn: ACTUALIZADO,
        carrera: carrera || '',
        id: pacto === '300_BASE' ? 'pacto_300' : 'pacto_380'
      };
    }

    const corteLs = parseInt(
      (typeof localStorage !== 'undefined' ? localStorage.getItem('dante_corte_objetivo') : '0') || '0',
      10
    );
    if (corteLs > 0 && corteLs <= 500) {
      return {
        pts: corteLs,
        tipo: 'meta_preparacion',
        etiqueta: 'Meta de preparación',
        fuente: 'Registro local',
        convocatoria: null,
        actualizadoEn: ACTUALIZADO,
        carrera: carrera || '',
        id: 'local'
      };
    }
    return null;
  }

  function persistirMeta(meta) {
    if (!meta || !(meta.pts > 0 && meta.pts <= 500)) return;
    try {
      localStorage.setItem('dante_corte_objetivo', String(meta.pts));
      localStorage.setItem('dante_corte_tipo', meta.tipo || '');
      localStorage.setItem('dante_corte_etiqueta', meta.etiqueta || '');
      localStorage.setItem('dante_corte_fuente', meta.fuente || '');
      localStorage.setItem('dante_corte_convocatoria', meta.convocatoria || '');
      localStorage.setItem('dante_corte_actualizado', meta.actualizadoEn || ACTUALIZADO);
    } catch (e) {}
  }

  function etiquetaBrecha(meta) {
    if (!meta) return '';
    if (meta.tipo === 'meta_preparacion') {
      return 'Meta de preparación (' + meta.pts + ' pts)';
    }
    const anio = meta.convocatoria || '2025';
    return 'Corte estimado ' + anio + ' · ' + cortaFuente(meta.fuente);
  }

  function cortaFuente(fuente) {
    const f = limpio(fuente);
    if (!f) return 'fuente local';
    if (/familia/i.test(f)) return 'familia de carrera';
    if (/regional|públic/i.test(f)) return 'listas regionales';
    if (/Pacto/i.test(f)) return 'pacto';
    return f.length > 42 ? (f.slice(0, 40) + '…') : f;
  }

  window.DanteCortes = {
    ACTUALIZADO: ACTUALIZADO,
    FAMILIAS: FAMILIAS,
    CORTES_SABER: CORTES_SABER,
    buscarFamilia: buscarFamilia,
    resolverMetaSaber11: resolverMetaSaber11,
    persistirMeta: persistirMeta,
    etiquetaBrecha: etiquetaBrecha,
    pactoAPts: pactoAPts
  };
})();
