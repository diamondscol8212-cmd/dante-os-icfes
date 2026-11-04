// src/workers/scoringWorker.js - Hilo de Trabajo Aislado para Cálculo Psicométrico EAP (Dante OS v23.0.0-SCALE)
// Bogotá, Colombia
import { parentPort, isMainThread } from 'worker_threads';
import { estimarHabilidadEAP } from '../services/engine3PL.js';

if (!isMainThread && parentPort) {
    parentPort.on('message', (taskData) => {
        const { id, historialItems } = taskData || {};
        try {
            const result = estimarHabilidadEAP(historialItems || []);
            parentPort.postMessage({
                id,
                success: true,
                result
            });
        } catch (err) {
            parentPort.postMessage({
                id,
                success: false,
                error: err.message || 'Error en cálculo de estimación EAP worker'
            });
        }
    });
}
