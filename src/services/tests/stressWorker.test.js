// tests/stressWorker.test.js - Prueba de Estrés y Concurrencia Paralela con Worker Threads (Dante OS v23.0.0-SCALE)
// Bogotá, Colombia
import assert from 'assert';
import { estimarHabilidad, cerrarWorkerPool } from '../src/services/cat/ScoringService.js';

console.log("🔥 INICIANDO SUITE DE PRUEBAS DE ESTRÉS Y CÁLCULO PARALELO (1.000 EVALUACIONES EAP)...\n");

const TOTAL_PETICIONES_SIMULTANEAS = 1000;

// Generar historial de ítems simulados para 1.000 estudiantes
function generarHistorialSimulado(id) {
    const numItems = 5 + (id % 10);
    const historial = [];
    for (let i = 0; i < numItems; i++) {
        historial.push({
            a: 1.0 + ((id + i) % 15) * 0.1,
            b: -2.0 + ((id * 3 + i) % 40) * 0.1,
            c: 0.2,
            correcto: (id + i) % 2 === 0
        });
    }
    return historial;
}

const solicitudes = Array.from({ length: TOTAL_PETICIONES_SIMULTANEAS }, (_, idx) => ({
    id: idx + 1,
    historial: generarHistorialSimulado(idx + 1)
}));

// Monitoreo de latencia del Event Loop durante el estrés
let maxEventLoopLagMs = 0;
let lastCheck = Date.now();
const intervalId = setInterval(() => {
    const now = Date.now();
    const lag = now - lastCheck - 10;
    if (lag > maxEventLoopLagMs) {
        maxEventLoopLagMs = lag;
    }
    lastCheck = now;
}, 10);

const memInicio = process.memoryUsage().heapUsed;
const startTime = Date.now();

console.log(`⚡ Despachando ráfaga de ${TOTAL_PETICIONES_SIMULTANEAS} peticiones EAP al Pool de Worker Threads...`);

try {
    const resultados = await Promise.all(
        solicitudes.map(sol => estimarHabilidad(sol.historial))
    );

    const endTime = Date.now();
    const duracionTotalMs = endTime - startTime;
    clearInterval(intervalId);

    const memFin = process.memoryUsage().heapUsed;
    const deltaMemMb = ((memFin - memInicio) / (1024 * 1024)).toFixed(2);
    const throughputOpsSec = ((TOTAL_PETICIONES_SIMULTANEAS / duracionTotalMs) * 1000).toFixed(2);
    const latenciaPromedioMs = (duracionTotalMs / TOTAL_PETICIONES_SIMULTANEAS).toFixed(3);

    // Verificaciones de integridad en los 1.000 resultados
    assert.strictEqual(resultados.length, TOTAL_PETICIONES_SIMULTANEAS, "Debe procesar exactamente 1.000 resultados");

    let validCount = 0;
    for (const res of resultados) {
        if (res && typeof res.theta === 'number' && typeof res.bayesianSEM === 'number' && typeof res.probMaestria === 'number') {
            validCount++;
        }
    }

    assert.strictEqual(validCount, TOTAL_PETICIONES_SIMULTANEAS, "Todos los 1.000 resultados deben ser numéricamente válidos");

    console.log("\n📊 RESULTADOS Y MÉTRICAS DE PRUEBA DE ESTRÉS:");
    console.log(`   - Peticiones Procesadas: ${resultados.length} / ${TOTAL_PETICIONES_SIMULTANEAS}`);
    console.log(`   - Tiempo Total Lote: ${duracionTotalMs} ms`);
    console.log(`   - Latencia Promedio por Evaluación: ${latenciaPromedioMs} ms`);
    console.log(`   - Rendimiento (Throughput): ${throughputOpsSec} ops/segundo`);
    console.log(`   - Event Loop Lag Máximo Registrado: ${maxEventLoopLagMs} ms`);
    console.log(`   - Variación de Memoria Heap: ${deltaMemMb} MB`);

    assert.ok(duracionTotalMs < 10000, "El tiempo total para 1.000 peticiones debe ser inferior a 10.000ms");
    assert.ok(maxEventLoopLagMs < 100, `El Event Loop no debe bloquearse (lag registrado: ${maxEventLoopLagMs}ms)`);

    console.log("\n🎉 LA PRUEBA DE ESTRÉS CON WORKER THREADS FINALIZÓ EXITOSAMENTE SINO BLOQUEAR EL EVENT LOOP.");

} catch (err) {
    clearInterval(intervalId);
    console.error("🚨 CRASH EN PRUEBA DE ESTRÉS:", err);
    process.exit(1);
} finally {
    cerrarWorkerPool();
}

process.exit(0);
