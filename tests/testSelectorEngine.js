// testSelectorEngine.js - Suite Máster de Validación de Rendimiento (Dante OS v20.0)
import assert from 'assert';
import { obtenerSiguienteItem } from '../src/services/catSelectorEngine.js';

// Mock de simulación de Información de Fisher Clásica
function calcularInformacionFisher(theta, a, b, c) {
    return (a * a) * (1 - c) / (1 + Math.exp(a * (b - theta)));
}

console.clear();
console.log("🚀 INICIANDO TEST SUITE ENTERPRISE - CAT SELECTOR ENGINE v20.0");
console.log("=================================================================");

// =========================================================================
// 🏗️ CONSTRUCCIÓN DEL DATASET MOCK INDEXADO EN RAM (ECOSISTEMA v19.5)
// =========================================================================
const MockMapaParametros = new Map();
const MockMatrizBuckets = Array.from({ length: 17 }, () => []);

// Sembramos 100 ítems simulados distribuidos a lo largo del espectro logit
for (let i = 1; i <= 100; i++) {
    const dificultadCalculada = -4.0 + (i * 0.08); // Escala progresiva de -4.0 a +4.0
    const itemMock = {
        id: `uuid_mock_item_${i}`,
        pregunta_texto: `¿Reactivo adaptativo experimental número ${i}?`,
        opciones_respuesta: ["A", "B", "C", "D"],
        a: 1.5000,
        b: dificultadCalculada,
        c: 0.2000,
        sub_competencia: i % 2 === 0 ? "geometria" : "algebra"
    };

    MockMapaParametros.set(itemMock.id, itemMock);
    
    // Mapeo al índice entero de RAM correspondientes
    const idxBucket = Math.round((dificultadCalculada + 4.0) / 0.5);
    if (MockMatrizBuckets[idxBucket]) {
        MockMatrizBuckets[idxBucket].push(itemMock);
    }
}

const CacheRAMInstanciaMock = {
    mapaParametros: MockMapaParametros,
    matrizBucketsDificultad: MockMatrizBuckets
};

// =========================================================================
// 🧪 EJECUCIÓN DE CASOS DE PRUEBA EXTREMA
// =========================================================================

(async function ejecutarPruebas() {
    try {
        // -----------------------------------------------------------------
        // CASO 1: Selección óptima Near-O(1) bajo habilidad media (theta = 0.0)
        // -----------------------------------------------------------------
        console.log("\n[TEST 1] 🎯 Evaluando selección óptima de ítem bajo habilidad equilibrada...");
        const sessionStateNormal = {
            theta: 0.0000,
            sem_bayesian: 0.4500,
            items_respondidos_count: 5,
            seen_item_ids: ['uuid_mock_item_50'] // Ya vio el ítem 50
        };

        const tiempoInicio = performance.now();
        const resultadoTest1 = obtenerSiguienteItem(sessionStateNormal, CacheRAMInstanciaMock);
        const latenciaTest1 = performance.now() - tiempoInicio;

        assert.strictEqual(resultadoTest1.detenerExamen, false, "Falla: El examen no debería detenerse.");
        assert.ok(resultadoTest1.item.id, "Falla: No se despachó un ID de reactivo válido.");
        assert.ok(resultadoTest1.meta_seleccion.pool_k_evaluado < 100, "Falla: El motor barrió todo el banco. El aislamiento por buckets falló.");
        assert.ok(resultadoTest1.item.id !== 'uuid_mock_item_50', "Falla: Se violó la ventana de exclusión perimetral.");
        
        console.log(`🟢 [PASÓ TEST 1]: Latencia de selección: ${latenciaTest1.toFixed(4)}ms | Pool k acotado a: ${resultadoTest1.meta_seleccion.pool_k_evaluado} reactivos.`);

        // -----------------------------------------------------------------
        // CASO 2: Activación del Criterio de Parada Bayesiano
        // -----------------------------------------------------------------
        console.log("\n[TEST 2] 🛑 Evaluando interceptación por Criterio de Parada (SEM Objetivo)...");
        const sessionStateParada = {
            theta: 1.2500,
            sem_bayesian: 0.1800, // Por debajo del umbral crítico de 0.22
            items_respondidos_count: 14,
            seen_item_ids: []
        };

        const resultadoTest2 = obtenerSiguienteItem(sessionStateParada, CacheRAMInstanciaMock);
        assert.strictEqual(resultadoTest2.detenerExamen, true, "Falla: El motor debió frenar el examen.");
        assert.strictEqual(resultadoTest2.codigo_control, 'CRITERIO_DE_PARADA_ALCANZADO', "Falla: Código de control incorrecto.");
        
        console.log("🟢 [PASÓ TEST 2]: Interceptación atómica por precisión psicométrica confirmada.");

        // -----------------------------------------------------------------
        // CASO 3: Robustez ante Agotamiento Extremo del Banco Libre
        // -----------------------------------------------------------------
        console.log("\n[TEST 3] 🏁 Evaluando escudo de homeostasis ante consumo absoluto del banco...");
        const todosLosIds = Array.from(MockMapaParametros.keys());
        const sessionStateAgotado = {
            theta: -0.5000,
            sem_bayesian: 0.3500,
            items_respondidos_count: 10,
            seen_item_ids: todosLosIds // Todos los reactivos del pool ya fueron presentados
        };

        const resultadoTest3 = obtenerSiguienteItem(sessionStateAgotado, CacheRAMInstanciaMock);
        assert.strictEqual(resultadoTest3.detenerExamen, true, "Falla: El motor debió forzar el cierre seguro.");
        assert.strictEqual(resultadoTest3.codigo_control, 'BANCO_CONSUMIDO_TOTALMENTE', "Falla: Código de control erróneo.");

        console.log("🟢 [PASÓ TEST 3]: Rescate homeostático verificado ante vaciado de RAM.");
        
        console.log("\n=================================================================");
        console.log("🎉 ¡SUITE DE PRUEBAS FINALIZADA CON ÉXITO: NÚCLEO v20.0 CERTIFICADO!");
        console.log("=================================================================");

    } catch (error) {
        console.error("\n🚨 [TEST EXCEPCIÓN CRÍTICA]:", error.message);
        process.exit(1);
    }
})();
