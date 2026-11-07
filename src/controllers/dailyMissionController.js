// 🚀 src/controllers/dailyMissionController.js - Controlador Maestro de Misión Diaria (ESM)
// Dante OS Enterprise Edition v23.1 - Misión Adaptativa de 25 Minutos

import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { BANCO_COMPLETO } from '../services/bank/index.js';
import { PreuniversitarioService, BANCO_PREUNIVERSITARIO_BASE } from '../services/PreuniversitarioService.js';
import { sanitizeItemsCollection } from '../security/sanitizer.js';
import { obtenerDilemasPendientes, calcularScoreVocacionalIncremental } from '../services/bank/vocationalDilemmas.js';
import { estimarHabilidad } from '../services/cat/ScoringService.js';
import { cifrarDatosSensibles } from '../services/encryptionService.js';
import { generarExplicacionSocratica } from '../services/ai/AiTutorService.js';
import { verificarPlanEstudianteSeguro } from '../services/planService.js';
import { generarBateriaDiagnostico } from '../services/bank/diagnosticGenerator.js';
import { seleccionarBloque, seleccionarRefuerzo } from '../services/bank/selectorApertura.js';
import { cargarVistos, recordarVistos } from '../services/bank/vistosSala.js';
import { juicioDeItem } from '../services/bank/calificarItem.js';
import { registrarSesionExpediente } from '../services/expedienteEstudiante.js';

// Cache en memoria RAM para resiliencia de estado de sesión completada hoy y racha (Bogotá)
export const SESIONES_COMPLETADAS_HOY = new Set();
export const RACHAS_ESTUDIANTES = new Map();
export const CACHE_MISION_DIARIA_COMPLETA = new Map(); // Cache ultra-rápida en RAM (TTL 10 min)

// Helper con timeout estricto para evitar bloqueos por latencia de base de datos (Fast-Path < 400ms)
function queryWithTimeout(promise, timeoutMs = 400, fallbackValue = { data: null, error: 'DB_TIMEOUT' }) {
  let timer;
  const timerPromise = new Promise(resolve => {
    timer = setTimeout(() => resolve(fallbackValue), timeoutMs);
    if (timer && typeof timer.unref === 'function') timer.unref();
  });
  return Promise.race([
    promise.then(res => { clearTimeout(timer); return res; }).catch(() => fallbackValue),
    timerPromise
  ]);
}

/**
 * 🪐 CONTROLADOR MAESTRO DE LA MISIÓN DIARIA (25 MINUTOS)
 * 
 * Orquesta la sesión diaria adaptativa del estudiante:
 * 1. Identifica usuario, tenant y plan activo (FREE, PRO, SUPER_PRO, DANTE_MASTER).
 * 2. Aplica regla de gobernanza Free vs. Pro según zona horaria Bogotá.
 * 3. Selecciona 10 reactivos calibrados adaptativos según la ruta académica (ICFES).
 * 4. Aplica sanitización Zero-Trust para remover claves e índices numéricos sensibles.
 * 5. Inyecta 1 dilema vocacional pendiente al cierre del bloque.
 * 6. Construye el saludo motivacional socrático firmado por Dante.
 */
export async function obtenerMisionDiaria(req, res) {
  try {
    // 1. Extracción y Validación de Identidad (Prioriza Claims de JWT Autenticado)
    const reqUser = req.user || {};
    let rawStudentId;
    if (req.user && (reqUser.user_id || reqUser.id || reqUser.studentId || reqUser.estudiante || reqUser.email)) {
      rawStudentId = reqUser.user_id || reqUser.id || reqUser.studentId || reqUser.estudiante || reqUser.email;
    } else {
      rawStudentId = req.body?.studentId || req.body?.student_id || req.headers?.['x-student-id'] || req.query?.studentId || ("student_guest_" + crypto.randomBytes(4).toString('hex'));
    }
    const cleanStudentId = String(rawStudentId).toLowerCase().trim().split('@')[0];

    const isDiagnostic = Boolean(
      req.body?.isDiagnostic === true || 
      req.body?.is_diagnostic === true || 
      req.body?.isDiagnostic === 'true' || 
      req.body?.is_diagnostic === 'true' || 
      req.query?.isDiagnostic === 'true' || 
      req.query?.is_diagnostic === 'true' ||
      req.headers?.['x-is-diagnostic'] === 'true'
    );
    const refuerzoArea = String(req.body?.refuerzoArea || req.query?.refuerzoArea || '').toLowerCase().trim();

    const studentName = reqUser.nombre || reqUser.name || req.body?.studentName || req.body?.nombre || "Estudiante";
    const institutionId = req.tenantId || reqUser.institution_id || req.body?.institution_id || req.headers?.['x-institution-id'] || "dante_enterprise";

    const targetTrack = 'ICFES';

    // 2. Gobernanza de Plan y Zona Horaria Bogotá (America/Bogota)
    const hoyBogota = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date());
    const keySesionHoy = `${cleanStudentId}_${hoyBogota}`;
    // Espera de 15 min entre bloques (misma regla que la sala). Diagnóstico y refuerzo no esperan.
    if (!isDiagnostic && !refuerzoArea) {
      try {
        const recorrido = await queryWithTimeout(
          supabase
            .from('progreso_estudiantes')
            .select('items_respondidos')
            .eq('estudiante', cleanStudentId)
            .eq('materia', 'recorrido_sala')
            .maybeSingle(),
          600,
          { data: null }
        );
        const esperaHasta = recorrido && recorrido.data && recorrido.data.items_respondidos
          ? Date.parse(recorrido.data.items_respondidos.esperaHasta || '')
          : NaN;
        if (Number.isFinite(esperaHasta) && esperaHasta > Date.now()) {
          const segundos = Math.max(1, Math.ceil((esperaHasta - Date.now()) / 1000));
          return res.status(200).json({
            success: true,
            bloqueadoPorDescanso: true,
            segundosParaSiguienteMision: segundos,
            planTier: 'FREE',
            saludoDante: `Descansa un momento. El próximo bloque abre en ${Math.ceil(segundos / 60)} min.`,
            reactivos: [],
            microDilemasVocacionales: []
          });
        }
      } catch (eEspera) {}
    }

    const vistos = isDiagnostic ? new Set() : await cargarVistos(cleanStudentId);
    const cacheKey = `${cleanStudentId}_${hoyBogota}_${targetTrack}_${isDiagnostic ? 'diag' : 'daily'}_${refuerzoArea || 'bloque'}_${vistos.size}`;

    // ⚡ Fast-Path: Retornar misión desde RAM si ya fue calculada en los últimos 10 minutos
    const cachedEntry = CACHE_MISION_DIARIA_COMPLETA.get(cacheKey);
    if (!refuerzoArea && cachedEntry && (Date.now() - cachedEntry.timestamp < 10 * 60 * 1000)) {
      return res.status(200).json(cachedEntry.payload);
    }

    // Cálculo de segundos restantes hasta el restablecimiento nocturno en Bogotá
    const bogotaNowStr = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
    const bogotaNow = new Date(bogotaNowStr);
    const bogotaEnd = new Date(bogotaNow);
    bogotaEnd.setHours(23, 59, 59, 999);
    const segundosParaRecarga = Math.max(1, Math.floor((bogotaEnd.getTime() - bogotaNow.getTime()) / 1000));

    let yaCompletadoHoy = SESIONES_COMPLETADAS_HOY.has(keySesionHoy);
    const isDemoAccount = cleanStudentId === 'estudiante_demo' || cleanStudentId === 'student_demo_01';
    let rachaDias = isDemoAccount ? 4 : 0; // Estado Cero Real por defecto para nuevos usuarios (0 Días)

    // Consulta Ultra-Rápida y Paralela de plan, telemetría e histórico en Supabase (Con Timeout de 400ms)
    let planTier = 'FREE';
    try {
      const pPlan = verificarPlanEstudianteSeguro(req, cleanStudentId);

      const pTelem = Promise.resolve({ data: null });

      const pProg = RACHAS_ESTUDIANTES.has(cleanStudentId)
        ? Promise.resolve({ data: null })
        : queryWithTimeout(
            supabase
              .from('progreso_estudiantes')
              .select('racha_dias')
              .eq('estudiante', cleanStudentId)
              .eq('materia', 'saber_11')
              .maybeSingle(),
            400,
            { data: null }
          );

      const [planEstado, resTelem, resProg] = await Promise.all([pPlan, pTelem, pProg]);

      if (planEstado && planEstado.esPro) {
        planTier = planEstado.plan;
      }

      if (resTelem && resTelem.data && Array.isArray(resTelem.data) && resTelem.data.length > 0) {
        yaCompletadoHoy = resTelem.data.some(t => {
          const mat = String(t.materia || '').toLowerCase();
          const isDiag = mat.includes('diagnostico') || mat.includes('diagnostic') || t.is_diagnostic === true;
          if (isDiag) return false;
          return mat.includes('mision_diaria') || 
                 mat.includes('daily_mission') || 
                 t.es_mision_diaria === true;
        });
      }

      if (RACHAS_ESTUDIANTES.has(cleanStudentId)) {
        rachaDias = RACHAS_ESTUDIANTES.get(cleanStudentId);
      } else if (resProg && resProg.data) {
        const progData = resProg.data;
        rachaDias = Number(progData.racha_dias || 0);
        RACHAS_ESTUDIANTES.set(cleanStudentId, rachaDias);
      }
    } catch (errDb) {
      console.warn("⚠️ [DAILY MISSION DB WARN]: Fallback a simulación local sin interrumpir flujo:", errDb.message);
    }

    // Varios bloques el mismo día. La espera de 15 minutos la lleva la sala, no este cierre.

    // Determinar Bloque Actual (Plan PRO permite bloque 2 de alta resistencia)
    const bloqueActual = (planTier !== 'FREE' && yaCompletadoHoy) ? 2 : 1;

    // 3. Selección Adaptativa de Reactivos (10 en Diagnóstico y Misión Diaria; 5 en refuerzo)
    let rawItems = [];
    let esRefuerzo = false;

    if (!isDiagnostic && refuerzoArea) {
      esRefuerzo = true;
      rawItems = seleccionarRefuerzo(BANCO_COMPLETO, refuerzoArea, vistos, 5);
    } else if (isDiagnostic) {
      console.log(`🎯 [DAILY MISSION CONTROLLER]: Generando Batería Diagnóstica de 10 reactivos calibrados para Track ${targetTrack}...`);
      rawItems = generarBateriaDiagnostico(targetTrack);
    } else {
      rawItems = seleccionarBloque(BANCO_COMPLETO, { cantidad: 10, vistos });
    }

    // Erradicación de Reactivos Duplicados por Set de identificadores únicos (item.id)
    const totalLimite = esRefuerzo ? Math.min(5, rawItems.length || 5) : 10;
    const reactivosUnicos = [];
    const idsVistos = new Set();
    for (const item of rawItems) {
      if (item && item.id && !idsVistos.has(item.id)) {
        idsVistos.add(item.id);
        reactivosUnicos.push(item);
      }
      if (reactivosUnicos.length === totalLimite) break;
    }

    // Rellenar hasta totalLimite: primero sin repetir vistos del alumno; solo al final permitir reuso.
    if (!esRefuerzo && reactivosUnicos.length < totalLimite) {
      const poolParaRellenar = BANCO_COMPLETO || [];
      for (const item of poolParaRellenar) {
        const id = item && item.id ? String(item.id) : '';
        if (!id || idsVistos.has(id) || vistos.has(id)) continue;
        idsVistos.add(id);
        reactivosUnicos.push(item);
        if (reactivosUnicos.length === totalLimite) break;
      }
      if (reactivosUnicos.length < totalLimite) {
        for (const item of poolParaRellenar) {
          const id = item && item.id ? String(item.id) : '';
          if (!id || idsVistos.has(id)) continue;
          idsVistos.add(id);
          reactivosUnicos.push(item);
          if (reactivosUnicos.length === totalLimite) break;
        }
      }
    }
    rawItems = reactivosUnicos;

    // 4. Sanitización Obligatoria Zero-Trust
    const reactivosSanitizados = sanitizeItemsCollection(rawItems);

    // 5. Inyección del Micro-Goteo Vocacional
    let prevDilemaIds = [];
    try {
      const resVoc = await queryWithTimeout(
        supabase
          .from('evaluacion_vocacional_riasec')
          .select('dilema_id, dilemaId')
          .eq('estudiante_id', cleanStudentId),
        800,
        { data: null }
      );

      if (resVoc && resVoc.data && resVoc.data.length > 0) {
        prevDilemaIds = resVoc.data.map(v => v.dilema_id || v.dilemaId).filter(Boolean);
      }
    } catch (errVoc) {
      console.warn("⚠️ [DAILY MISSION VOCATIONAL WARN]: Excepción al consultar dilemas anteriores:", errVoc.message);
    }

    // Un solo dilema al cierre: menos fatiga; alimenta la ruta vocacional.
    const microDilemasVocacionales = obtenerDilemasPendientes(prevDilemaIds, 1);

    // 6. Construcción del Diálogo de Apertura de Dante
    let areasDescripcion = "Pensamiento Cuantitativo y Lectura Crítica";
    if (targetTrack === 'UNAL') {
      areasDescripcion = "Análisis de Imagen 3D, Cálculo, Física Mecánica y Lectura Avanzada";
    } else if (targetTrack === 'COMBO') {
      areasDescripcion = "Saber 11° e Inmersión Preuniversitaria UNAL";
    }

    let saludoDante = esRefuerzo
      ? `Hola ${studentName}. Refuerzo de 5 preguntas en tu área débil. Sin dilema vocacional.`
      : `Hola ${studentName}. Hoy son ${reactivosSanitizados.length} preguntas de ${areasDescripcion} y 1 dilema vocacional al cierre.`;
    if (isDiagnostic) {
      saludoDante = `Bienvenido ${studentName}. Diagnóstico de 10 preguntas calibradas. Sin pistas y sin dilema vocacional.`;
    }

    const randomSuffix = crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).substring(2, 10);
    const misionId = isDiagnostic ? `mision_diag_${Date.now()}_${randomSuffix}` : `mision_daily_${Date.now()}_${randomSuffix}`;

    // 7. Retorno del Payload Exitoso y Caching en RAM
    const payloadRespuesta = {
      success: true,
      bloqueadoPorDescanso: false,
      misionId,
      targetTrack,
      isDiagnostic,
      planTier,
      bloqueActual,
      tiempoEstimadoMinutos: isDiagnostic ? 20 : 25,
      saludoDante,
      rachaDias,
      totalReactivos: reactivosSanitizados.length,
      reactivos: reactivosSanitizados,
      esRefuerzo,
      refuerzoArea: esRefuerzo ? refuerzoArea : null,
      microDilemasVocacionales: (isDiagnostic || esRefuerzo || targetTrack === 'UNAL') ? [] : microDilemasVocacionales
    };

    try {
      if (!esRefuerzo) CACHE_MISION_DIARIA_COMPLETA.set(cacheKey, { timestamp: Date.now(), payload: payloadRespuesta });
    } catch (e) {}

    return res.status(200).json(payloadRespuesta);

  } catch (err) {
    console.error("🚨 [DAILY MISSION ERROR]:", err.message);

    // Fallback Resiliente en memoria RAM
    try {
      const fallbackReactivos = sanitizeItemsCollection(BANCO_COMPLETO.slice(0, 10));
      const fallbackDilemas = obtenerDilemasPendientes([], 1);

      return res.status(200).json({
        success: true,
        bloqueadoPorDescanso: false,
        misionId: `mision_daily_fallback_${Date.now()}`,
        targetTrack: "ICFES",
        planTier: "FREE",
        bloqueActual: 1,
        tiempoEstimadoMinutos: 25,
        saludoDante: "Hola. Sesión de contingencia: 10 preguntas y 1 dilema vocacional al cierre.",
        rachaDias: 1,
        totalReactivos: fallbackReactivos.length,
        reactivos: fallbackReactivos,
        microDilemasVocacionales: fallbackDilemas
      });
    } catch (criticalErr) {
      return res.status(500).json({
        success: false,
        error: "Fallo crítico en el motor de compilación de Misión Diaria."
      });
    }
  }
}

/**
 * 🎯 COMPLETAR MISIÓN DIARIA
 * 
 * Recibe y procesa las respuestas a los 10 reactivos y el micro-dilema vocacional.
 * Ejecuta calificación psicométrica IRT 3PL, computa la telemetría IRD de vacilaciones,
 * calcula la actualización incremental RIASEC / Big Five y persiste en Supabase.
 */
export async function completarMisionDiaria(req, res) {
  try {
    const body = req.body || {};
    const reqUser = req.user || {};

    let rawStudentId;
    if (req.user && (reqUser.user_id || reqUser.id || reqUser.studentId || reqUser.estudiante || reqUser.email)) {
      rawStudentId = reqUser.user_id || reqUser.id || reqUser.studentId || reqUser.estudiante || reqUser.email;
    } else {
      rawStudentId = body.studentId || body.student_id || req.headers?.['x-student-id'] || "student_demo_01";
    }
    const studentClean = String(rawStudentId).toLowerCase().trim().split('@')[0];
    const studentName = reqUser.nombre || reqUser.name || body.studentName || body.nombre || "Estudiante";
    const institutionId = req.tenantId || reqUser.institution_id || body.institution_id || req.headers?.['x-institution-id'] || "dante_enterprise";

    const misionId = body.misionId || body.mision_id || `mision_daily_${Date.now()}`;
    const targetTrack = 'ICFES';

    const planEstado = await verificarPlanEstudianteSeguro(req, studentClean);
    const planTier = planEstado.esPro ? planEstado.plan : 'FREE';

    const respuestasReactivos = Array.isArray(body.respuestasReactivos) 
      ? body.respuestasReactivos 
      : (Array.isArray(body.respuestas) ? body.respuestas : []);

    const respuestasVocacionales = Array.isArray(body.respuestasVocacionales) 
      ? body.respuestasVocacionales 
      : (Array.isArray(body.dilemas) ? body.dilemas : []);

    const duracionTotalSesionMs = Number(body.duracionTotalSesionMs || body.duracion_ms || 1200000);

    // 1. CALIFICACIÓN PSICOMÉTRICA & BÚSQUEDA DE ITEMS EN BANCO COMPLETO Y PREUN
    const bancoComb = [...BANCO_COMPLETO, ...BANCO_PREUNIVERSITARIO_BASE];

    let aciertos = 0;
    let fallos = 0;
    const historialItemsIRT = [];
    const respuestasEvaluadas = [];

    for (const resp of respuestasReactivos) {
      const itemId = resp.itemId || resp.id;
      const opcionSel = String(resp.opcionSeleccionada || resp.opcion || '').trim().toUpperCase();
      const tiempoMs = Number(resp.tiempoRespuestaMs || resp.tiempoMs || 15000);
      const vacilaciones = Number(resp.cambioOpcionesCount || resp.vacilaciones || 0);
      const declaracionConfianza = resp.declaracionConfianza || 'alta';

      // Buscar ítem en el banco original (sin sanitizar)
      const originalItem = bancoComb.find(it => String(it.id).toLowerCase() === String(itemId).toLowerCase());

      // Blindaje: si es vocacional o de opinión, no validar esCorrecta ni computar en IRT 3PL
      const esVoc = Boolean(
        resp.esVocacional || 
        resp.es_vocacional || 
        String(resp.area || '').toLowerCase().includes('vocacional') ||
        String(originalItem?.area || '').toLowerCase().includes('vocacional') ||
        originalItem?.esVocacional
      );

      if (esVoc) {
        respuestasEvaluadas.push({
          itemId,
          opcionSeleccionada: opcionSel,
          esVocacional: true,
          area: 'vocacional',
          tiempoRespuestaMs: tiempoMs
        });
        continue;
      }

      if (!originalItem) continue;

      const juicio = juicioDeItem(itemId, opcionSel);
      const opcionCorrecta = juicio
        ? juicio.letraCorrecta
        : String(originalItem.correcta || originalItem.ok || '').trim().toUpperCase();
      if (!/^[ABCD]$/.test(opcionCorrecta)) continue;
      const esCorrecta = juicio ? juicio.esCorrecta === true : (opcionSel !== '' && opcionSel === opcionCorrecta);

      if (esCorrecta) {
        aciertos++;
      } else {
        fallos++;
      }

      // Parámetros IRT 3PL (a, b, c)
      const paramA = Number(originalItem?.a) || 1.5;
      const paramB = Number(originalItem?.b) || 0.0;
      const paramC = Number(originalItem?.c) || 0.20;

      historialItemsIRT.push({
        a: paramA,
        b: paramB,
        c: paramC,
        correcto: esCorrecta,
        isCorrect: esCorrecta
      });

      respuestasEvaluadas.push({
        itemId,
        opcionSeleccionada: opcionSel,
        opcionCorrecta,
        esCorrecta,
        tiempoRespuestaMs: tiempoMs,
        cambioOpcionesCount: vacilaciones,
        declaracionConfianza,
        area: originalItem?.area || originalItem?.materia || 'matematicas',
        a: paramA,
        b: paramB,
        c: paramC
      });

      // Registrar telemetría IRD individual por reactivo
      try {
        await PreuniversitarioService.registrarTelemetriaIRD(
          studentClean,
          tiempoMs,
          vacilaciones,
          vacilaciones,
          esCorrecta
        );
      } catch (errIrd) {
        // Non-blocking
      }
    }

    const totalReactivos = respuestasReactivos.length || 10;
    const precisionPorcentaje = totalReactivos > 0 
      ? parseFloat(((aciertos / totalReactivos) * 100).toFixed(1)) 
      : 0;

    // Vector de Precisión por Área
    const areaStats = {};
    for (const resp of respuestasEvaluadas) {
      const areaKey = String(resp.area || 'generica').toLowerCase();
      if (!areaStats[areaKey]) areaStats[areaKey] = { aciertos: 0, total: 0 };
      areaStats[areaKey].total += 1;
      if (resp.esCorrecta) areaStats[areaKey].aciertos += 1;
    }
    const precisionPorArea = {};
    for (const [aKey, stats] of Object.entries(areaStats)) {
      precisionPorArea[aKey] = parseFloat(((stats.aciertos / stats.total) * 100).toFixed(1));
    }

    // 2. MOTOR IRT 3PL - Delegación a Worker Threads (ScoringService)
    const startTimeEAP = performance.now();
    const resultadoIRT = await estimarHabilidad(historialItemsIRT);
    const duracionEAPMs = parseFloat((performance.now() - startTimeEAP).toFixed(2));

    const thetaEstimado = resultadoIRT.theta !== undefined ? resultadoIRT.theta : (resultadoIRT.thetaEstimado || 0.0);
    const bayesianSEM = resultadoIRT.bayesianSEM !== undefined ? resultadoIRT.bayesianSEM : (resultadoIRT.sem || 0.35);

    // Escalonamiento de puntaje según Target Track
    let puntajeProyectadoEscala = 0;
    if (targetTrack === 'UNAL' || targetTrack === 'UDEA') {
      // Escala Estandarizada Z UNAL: Z = 500 + 100 * theta (acotada entre 350 y 950)
      const baseZ = 500 + (100 * thetaEstimado);
      puntajeProyectadoEscala = Math.max(350, Math.min(950, Math.round(baseZ)));
    } else {
      // Escala Oficial ICFES Saber 11°: 0 a 500 Pts
      // 5 áreas -> 5 * (50 + 13.8 * theta) = 250 + 69 * theta
      const baseIcfes = 250 + (69 * thetaEstimado);
      puntajeProyectadoEscala = Math.max(100, Math.min(500, Math.round(baseIcfes)));
    }

    // 3. TELEMETRÍA CONDUCTUAL E ÍNDICE DE RIESGO POR DUDA (IRD)
    let irdPorcentaje = 15;
    let alertaMetacognitiva = "🟢 Confianza alta: Tus decisiones iniciales son firmes.";
    try {
      const telemetriaIrd = await PreuniversitarioService.obtenerTelemetriaIRD(studentClean);
      if (telemetriaIrd) {
        irdPorcentaje = telemetriaIrd.irdPorcentaje ?? 15;
        alertaMetacognitiva = telemetriaIrd.alertaMetacognitiva || alertaMetacognitiva;
      }
    } catch (e) {}

    // 4. PROCESAMIENTO INCREMENTAL VOCACIONAL (RIASEC / OCEAN)
    const resVocacional = calcularScoreVocacionalIncremental(respuestasVocacionales);

    // 5. CÁLCULO DE RACHA Y SEGUNDOS DE RECARGA (ZONA HORARIA BOGOTÁ)
    const hoyBogota = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date());
    const keySesionHoy = `${studentClean}_${hoyBogota}`;
    SESIONES_COMPLETADAS_HOY.add(keySesionHoy);

    let rachaDias = 0;
    if (RACHAS_ESTUDIANTES.has(studentClean)) {
      rachaDias = RACHAS_ESTUDIANTES.get(studentClean);
    } else {
      try {
        const resProg = await queryWithTimeout(
          supabase
            .from('progreso_estudiantes')
            .select('racha_dias')
            .eq('estudiante', studentClean)
            .maybeSingle(),
          800,
          { data: null }
        );

        if (resProg && resProg.data) {
          const progData = resProg.data;
          rachaDias = Number(progData.racha_dias || 0);
        }
      } catch (errProg) {}
    }

    const rachaDiasActualizada = rachaDias + 1;
    RACHAS_ESTUDIANTES.set(studentClean, rachaDiasActualizada);

    const esDiagnosticoCierre = Boolean(body.isDiagnostic === true || body.isDiagnostic === 'true' || req.headers?.['x-is-diagnostic'] === 'true');
    const esRepasoFallidasCierre = Boolean(
      body.esRepasoFallidas === true
      || String(misionId || '').toLowerCase().startsWith('repaso_fallidas')
      || String(body.refuerzoArea || '').toLowerCase() === 'fallidas'
    );
    const esRefuerzoCierre = Boolean(body.esRefuerzo === true || body.refuerzoArea) && !esRepasoFallidasCierre;
    const tipoSesion = esDiagnosticoCierre
      ? 'DIAGNOSTICO'
      : (esRepasoFallidasCierre ? 'REPASO_FALLIDAS' : (esRefuerzoCierre ? 'REFUERZO' : 'MISION_DIARIA'));
    try {
      await registrarSesionExpediente(studentClean, {
        tipo: tipoSesion,
        misionId,
        theta: thetaEstimado,
        sem: bayesianSEM,
        puntaje: puntajeProyectadoEscala,
        aciertos,
        total: totalReactivos,
        precisionPorcentaje,
        precisionPorArea,
        rachaDias: rachaDiasActualizada,
        email: body.email || null,
        respuestas: respuestasEvaluadas
      });
    } catch (errPersist) {
      console.warn('⚠️ [DAILY MISSION]: El expediente no se pudo anotar.', errPersist && errPersist.message);
    }

    // Espera de 15 minutos entre bloques (misma regla que la sala).
    const segundosParaSiguienteMisionCalculado = 15 * 60;
    const esPro = (planTier === 'PRO' || planTier === 'SUPER_PRO' || planTier === 'DANTE_MASTER');
    const proximoBloqueHabilitado = true;
    const segundosParaSiguiente = segundosParaSiguienteMisionCalculado;

    let feedbackDante = `Bloque listo, ${studentName}. Precisión ${precisionPorcentaje}%. Proyección ${puntajeProyectadoEscala}/500. Descansa 15 minutos antes del siguiente bloque.`;
    if (esDiagnosticoCierre) {
      feedbackDante = `Diagnóstico listo, ${studentName}. Tu punto de partida quedó en ${puntajeProyectadoEscala}/500. Ya puedes entrenar en la sala.`;
    } else if (esRepasoFallidasCierre) {
      feedbackDante = `Repaso de fallidas listo, ${studentName}. Quedó en tu historial con el boletín de esa sesión.`;
    } else if (esRefuerzoCierre) {
      feedbackDante = `Refuerzo listo, ${studentName}. Esas 5 preguntas también quedaron en tu expediente.`;
    } else if (esPro) {
      feedbackDante = `Bloque listo, ${studentName}. Precisión ${precisionPorcentaje}%. Proyección ${puntajeProyectadoEscala}/500. En 15 minutos puedes abrir otro bloque.`;
    }

    // Marcar ítems del diagnóstico y del bloque diario como vistos para no repetirlos.
    try {
      const idsVistos = respuestasReactivos
        .map((resp) => String((resp && (resp.itemId || resp.id)) || '').trim())
        .filter(Boolean);
      if (idsVistos.length) await recordarVistos(studentClean, idsVistos);
      for (const key of CACHE_MISION_DIARIA_COMPLETA.keys()) {
        if (String(key).startsWith(studentClean + '_')) CACHE_MISION_DIARIA_COMPLETA.delete(key);
      }
    } catch (errVistos) {
      console.warn('⚠️ [COMPLETE MISSION]: No se pudieron anotar vistos_sala.', errVistos && errVistos.message);
    }

    // 8. ESTRUCTURA DE RESPUESTA EXITOSA
    const summaryData = {
      totalReactivos,
      aciertos,
      fallos,
      precisionPorcentaje,
      precisionPorArea,
      thetaEstimado,
      puntajeProyectadoEscala,
      scoreFinal: puntajeProyectadoEscala,
      puntaje: puntajeProyectadoEscala,
      sem: bayesianSEM,
      duracionEAPMs: duracionEAPMs,
      irdPorcentaje,
      alertaMetacognitiva,
      rachaDias: rachaDiasActualizada,
      hollandDominante: resVocacional.hollandCode
    };

    return res.status(200).json({
      success: true,
      misionId,
      summary: summaryData,
      resumenSesion: summaryData,
      vocacionalActualizado: {
        hollandCode: resVocacional.hollandCode,
        vectoresRIASEC: resVocacional.riasec,
        vectoresOCEAN: resVocacional.ocean
      },
      progresion: {
        daily_streak: rachaDiasActualizada,
        rachaDias: rachaDiasActualizada,
        esRachaIncrementada: true,
        planTier,
        proximoBloqueHabilitado,
        segundosParaSiguienteMision: segundosParaSiguiente
      },
      feedbackDante
    });

  } catch (err) {
    console.error("🚨 [COMPLETE MISSION ERROR]:", err.message);

    return res.status(500).json({
      success: false,
      motivo: 'no_se_pudo_cerrar',
      message: err.message
    });
  }
}

/**
 * 🪐 CONTROLADOR DE TUTORÍA SOCRÁTICA EN VIVO
 * Genera retroalimentación metacognitiva en 3 niveles invocando AiTutorService (Gemini Flash / Fallback).
 */
export async function obtenerPistaTutorSocratico(req, res) {
  try {
    const body = req.body || {};
    const itemId = body.itemId || body.id || 'item_default';
    const opcionSeleccionada = body.opcionSeleccionada || body.opcion || 'A';
    const nivelAndamiaje = Number(body.nivelAndamiaje || body.nivelSolicitado || body.nivel || 1);
    const targetTrack = body.targetTrack || body.target_track || 'ICFES';
    const preguntaTexto = body.preguntaTexto || body.enunciado || body.pregunta || body.texto || '';
    const opciones = body.opciones || body.opciones_respuesta || [];
    const tiempoRespuestaSec = Number(body.tiempoRespuestaSec || (body.tiempoRespuestaMs ? body.tiempoRespuestaMs / 1000 : 15));

    // Buscar item en banco si existe para enriquecer metadatos
    const bancoCombined = [...(BANCO_COMPLETO || []), ...(BANCO_PREUNIVERSITARIO_BASE || [])];
    const itemEncontrado = bancoCombined.find(it => String(it.id) === String(itemId)) || {};

    // Priorizar siempre el reactivo exacto enviado desde la pantalla del alumno
    const itemObj = {
      ...itemEncontrado,
      id: itemId,
      pregunta_texto: preguntaTexto || itemEncontrado.pregunta_texto || itemEncontrado.enunciado || 'Reactivo de evaluación',
      opciones_respuesta: (Array.isArray(opciones) && opciones.length > 0) ? opciones : (itemEncontrado.opciones_respuesta || itemEncontrado.opciones || []),
      area_general: body.area || body.materia || itemEncontrado.area_general || itemEncontrado.area || 'Razonamiento',
      sub_competencia: body.competencia || body.sub_competencia || itemEncontrado.sub_competencia || 'Competencia Calibrada 3PL'
    };

    const resultado = await generarExplicacionSocratica({
      item: itemObj,
      opcionSeleccionada: opcionSeleccionada,
      tiempoRespuestaSec: tiempoRespuestaSec,
      perfilConductual: body.perfilConductual || {},
      targetExam: targetTrack,
      numeroIntento: nivelAndamiaje,
      nivelSolicitado: nivelAndamiaje
    });

    return res.status(200).json({
      success: true,
      itemId: itemId,
      opcionSeleccionada: opcionSeleccionada,
      nivelAndamiaje: nivelAndamiaje,
      explicacionSocratica: resultado.explicacion,
      esFallback: resultado.esFallback,
      duracionMs: resultado.duracionMs
    });
  } catch (err) {
    console.error("🚨 [TUTOR HINT ERROR]:", err.message);
    const nivelErr = Number(req.body?.nivelAndamiaje || 1);
    const fallbackMsg = nivelErr === 1
      ? `<i class="fa-solid fa-magnifying-glass text-cyan-400 mr-1.5"></i><strong>Pista Socrática (Premisa Central):</strong> Revisa con atención la premisa central del enunciado y las magnitudes que intervienen antes de descartar.`
      : `<i class="fa-solid fa-crosshairs text-amber-400 mr-1.5"></i><strong>Anatomía del Distractor:</strong> La opción seleccionada suele responder a una trampa de lectura apresurada o extrapolación en el examen.`;

    return res.status(200).json({
      success: true,
      explicacionSocratica: fallbackMsg,
      esFallback: true,
      duracionMs: 5
    });
  }
}

export default {
  obtenerMisionDiaria,
  completarMisionDiaria,
  obtenerPistaTutorSocratico
};
