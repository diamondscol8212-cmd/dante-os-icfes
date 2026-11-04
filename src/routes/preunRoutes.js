/**
 * preunRoutes.js - Rutas API Aisladas para el Módulo Preuniversitario UNAL / UdeA (Dante OS Enterprise v23.1.0)
 * 
 * 🛡️ PRINCIPIO DE AISLAMIENTO:
 * - Endpoints independientes under '/api/preun/*'
 * - Cero interrupción o mezcla con las rutas de ICFES Saber 11° (/api/cat/*)
 */

import { Router } from 'express';
import { optionalToken } from '../middleware.js';
import { PreuniversitarioService } from '../services/PreuniversitarioService.js';

const router = Router();

// 🏛️ ENDPOINT: Obtener Siguiente Reactivo Adaptativo Preuniversitario
router.post('/interactuar', optionalToken, async (req, res) => {
    try {
        const { studentId, areaGeneral, targetExam } = req.body;
        const cleanStudentId = studentId || (req.user ? (req.user.user_id || req.user.email) : 'sandbox_preun_test');
        
        const resultado = await PreuniversitarioService.obtenerSiguienteItemPreun(
            cleanStudentId, 
            areaGeneral || 'analisis_imagen', 
            targetExam || 'UNAL'
        );

        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error en endpoint /api/preun/interactuar:", error);
        return res.status(500).json({ success: false, error: "Error interno en el servidor Preuniversitario." });
    }
});

// 🏛️ ENDPOINT: Responder Pregunta y Recibir Explicación Táctica
router.post('/responder', optionalToken, async (req, res) => {
    try {
        const { studentId, itemId, opcionSeleccionada, tiempoRespuestaMs } = req.body;
        const cleanStudentId = studentId || (req.user ? (req.user.user_id || req.user.email) : 'sandbox_preun_test');

        const resultado = await PreuniversitarioService.procesarRespuestaPreun(
            cleanStudentId,
            itemId,
            opcionSeleccionada,
            tiempoRespuestaMs
        );

        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error en endpoint /api/preun/responder:", error);
        return res.status(500).json({ success: false, error: "Error procesando respuesta preuniversitaria." });
    }
});

// 🧠 ENDPOINT: Highlighter Socrático Gemini IA (Skimming & Scanning Filosófico)
router.post('/highlighter-socratico', optionalToken, async (req, res) => {
    try {
        const { texto, pregunta } = req.body;
        const resultado = await PreuniversitarioService.generarHighlighterSocratico(
            texto || "La libertad no consiste en hacer lo que se quiere, sino en querer lo que se puede.",
            pregunta || "¿En qué radica la paradoja kantiana del deber?"
        );
        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error en endpoint /api/preun/highlighter-socratico:", error);
        return res.status(500).json({ success: false, error: "Error generando resaltado socrático." });
    }
});

// 📊 ENDPOINT: Registrar Telemetría IRD (Índice de Riesgo por Duda)
router.post('/telemetria-ird', optionalToken, async (req, res) => {
    try {
        const { studentId, latenciaMs, vacilaciones, cambioOpciones, esCorrecta } = req.body;
        const cleanStudentId = studentId || (req.user ? (req.user.user_id || req.user.email) : 'sandbox_preun_test');

        const resultado = await PreuniversitarioService.registrarTelemetriaIRD(
            cleanStudentId,
            latenciaMs,
            vacilaciones,
            cambioOpciones,
            esCorrecta
        );
        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error en endpoint /api/preun/telemetria-ird:", error);
        return res.status(500).json({ success: false, error: "Error registrando telemetría IRD." });
    }
});

// 📊 ENDPOINT: Obtener Telemetría IRD del Estudiante
router.get('/telemetria-ird', optionalToken, async (req, res) => {
    try {
        const { studentId } = req.query;
        const cleanStudentId = studentId || (req.user ? (req.user.user_id || req.user.email) : 'sandbox_preun_test');

        const resultado = await PreuniversitarioService.obtenerTelemetriaIRD(cleanStudentId);
        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error consultando telemetría IRD:", error);
        return res.status(500).json({ success: false, error: "Error consultando telemetría IRD." });
    }
});

// 📊 ENDPOINT: Diagnóstico de ROI Cognitivo y Brecha por Carrera
router.get('/roi-cognitivo', optionalToken, async (req, res) => {
    try {
        const { studentId, carreraId } = req.query;
        const cleanStudentId = studentId || (req.user ? (req.user.user_id || req.user.email) : 'sandbox_preun_test');

        const resultado = await PreuniversitarioService.obtenerROICognitivo(cleanStudentId, carreraId);
        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error consultando ROI cognitivo:", error);
        return res.status(500).json({ success: false, error: "Error consultando ROI cognitivo." });
    }
});

// 🤖 ENDPOINT: Sintetizador Continuo de Reactivos IA (Fase 2 Gemini)
router.post('/sintetizar', optionalToken, async (req, res) => {
    try {
        const { area, targetExam, cantidad, nivelDificultad } = req.body;
        const resultado = await PreuniversitarioService.sintetizarReactivosPreunGemini({
            area: area || 'calculo',
            targetExam: targetExam || 'UNAL',
            cantidad: Number(cantidad) || 5,
            nivelDificultad: nivelDificultad || 'alto'
        });
        return res.json(resultado);
    } catch (error) {
        console.error("🚨 Error en endpoint /api/preun/sintetizar:", error);
        return res.status(500).json({ success: false, error: "Error en sintetizador continuo de reactivos." });
    }
});

export default router;
