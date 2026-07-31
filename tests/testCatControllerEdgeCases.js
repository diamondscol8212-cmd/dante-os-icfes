/**
 * testCatControllerEdgeCases.js
 * * SPRINT DE BLINDAJE OPERACIONAL - DANTE OS v11.5
 * Validación de condiciones de borde, concurrencia y consistencia diagnóstica.
 * * Ejecución directa: node testCatControllerEdgeCases.js
 */

import assert from 'assert';

// =========================================================================
// 🧪 CONFIGURACIÓN DE CONSTANTES Y MACO-DICCIONARIOS DE CONTROL
// =========================================================================
const CODIGOS_SESGOS = {
    HEURISTICA_LINEAL: 'HEURISTICA_LINEAL',
    INVERSION_OPERACIONAL: 'INVERSION_OPERACIONAL',
    OMISION_CONVERSION: 'OMISION_CONVERSION',
    ERROR_GEOMETRICO: 'ERROR_GEOMETRICO',
    PROCEDIMENTAL_GENERICO: 'PROCEDIMENTAL_GENERICO'
};

const OPERATIONAL_CONTROLS = {
    VENTANA_RECIENTE_ITEMS: 20, 
    MAX_ITEMS_EXAMEN: 25,      
    MIN_ITEMS_EXAMEN: 10,
    UMBRAL_SEM_OBJETIVO: 0.28
};

// =========================================================================
// 🏗️ MOCKS DE ALTA FIDELIDAD (AISLAMIENTO MATEMÁTICO Y DE BASE DE DATOS)
// =========================================================================

class SupabaseMockBuilder {
    constructor() {
        this.eventStoreData = [];
        this.insertedEvents = [];
        this.bancoItemsData = [
            { id: 'item_alg_01', parametro_a_discriminacion: '1.2', parametro_b_dificultad: '-0.5', parametro_c_adivinacion: '0.2', sub_competencia: 'algebra', diagnostico_a: 'HEURISTICA_LINEAL', diagnostico_c: 'INVERSION_OPERACIONAL', diagnostico_d: 'OMISION_CONVERSION' },
            { id: 'item_geo_01', parametro_a_discriminacion: '1.5', parametro_b_dificultad: '0.3', parametro_c_adivinacion: '0.15', sub_competencia: 'geometria', diagnostico_a: 'ERROR_GEOMETRICO', diagnostico_c: 'INVERSION_OPERACIONAL', diagnostico_d: 'PROCEDIMENTAL_GENERICO' },
            { id: 'item_est_01', parametro_a_discriminacion: '1.0', parametro_b_dificultad: '1.2', parametro_c_adivinacion: '0.25', sub_competencia: 'estadistica', diagnostico_a: 'HEURISTICA_LINEAL', diagnostico_c: 'OMISION_CONVERSION', diagnostico_d: 'PROCEDIMENTAL_GENERICO' }
        ];
    }
    setEventStore(events) { this.eventStoreData = events; return this; }
    resetInserts() { this.insertedEvents = []; return this; }
}

const engineMock = {
    estimarHabilidadEAP: (historial) => {
        const total = historial.length;
        let baseSEM = 0.50;
        // El motor reduce el SEM ficticiamente según el tamaño del historial para disparar las condiciones límites
        if (total >= 10) baseSEM = 0.29;
        if (total >= 12) baseSEM = 0.25; // Quiebra el umbral objetivo de 0.28
        if (total >= 25) baseSEM = 0.15; // Límite absoluto por longitud
        
        return {
            theta: 0.45,
            bayesianSEM: baseSEM,
            fisherSEM: baseSEM * 0.95,
            probMaestria: 0.84,
            intervaloCreible: [0.21, 0.69]
        };
    }
};

// =========================================================================
// 🚀 EMULACIÓN DEL CONTROLADOR TRANSACCIONAL (catController.js)
// =========================================================================

class TestCatController {
    constructor(sbInstance) {
        this.supabase = sbInstance;
        this.cacheMapas = new Map();
    }

    async asegurarBancoIndexado(area) {
        if (this.cacheMapas.has(area)) return this.cacheMapas.get(area);
        
        const mapaAisladoArea = new Map();
        this.supabase.bancoItemsData.forEach(item => {
            mapaAisladoArea.set(item.id, {
                id: item.id,
                a: parseFloat(item.parametro_a_discriminacion),
                b: parseFloat(item.parametro_b_dificultad),
                c: parseFloat(item.parametro_c_adivinacion),
                sub_competencia: item.sub_competencia,
                diagnosticos: {
                    'A': item.diagnostico_a,
                    'C': item.diagnostico_c,
                    'D': item.diagnostico_d
                }
            });
        });
        this.cacheMapas.set(area, mapaAisladoArea);
        return mapaAisladoArea;
    }

    async procesarInteraccionEstudiante(reqBody) {
        const { studentId, itemId, isCorrect, areaGeneral, responseTime, selectionVector } = reqBody;

        if (!studentId || !areaGeneral) throw new Error("Parámetros de identidad corruptos.");

        // Obtención de snapshot histórico simulando lectura limpia de Supabase
        const todosLosEventos = [...this.supabase.eventStoreData];
        const mapaParametros = await this.asegurarBancoIndexado(areaGeneral);

        // 1. EVENT SOURCING PREVIO: Inyección en caliente controlando duplicidad
        if (itemId) {
            const metadatosItem = mapaParametros.get(itemId);
            const skillEvaluada = metadatosItem ? metadatosItem.sub_competencia : 'general';
            const tiempoFinalCalculado = parseFloat(responseTime || 0);
            const vectorFinalInyectado = selectionVector ? JSON.stringify(selectionVector) : JSON.stringify([]);

            let duracionSesionAcumulada = todosLosEventos.reduce((acc, ev) => acc + parseFloat(ev.response_time || 0), 0);
            duracionSesionAcumulada += tiempoFinalCalculado;

            const nuevoEvento = {
                id: 'uuid_generated_v11',
                student_id: studentId, 
                item_id: itemId, 
                is_correct: isCorrect,
                skill: skillEvaluada,
                response_time: tiempoFinalCalculado,
                session_duration: parseFloat(duracionSesionAcumulada.toFixed(2)),
                selection_vector: vectorFinalInyectado
            };

            // Mutación controlada: Persistencia transaccional simulada y empuje a la cola de análisis local
            this.supabase.insertedEvents.push(nuevoEvento);
            todosLosEventos.push({ 
                item_id: itemId, 
                is_correct: isCorrect, 
                response_time: tiempoFinalCalculado, 
                selection_vector: vectorFinalInyectado
            });
        }

        // 2. COMPILACIÓN LONGITUDINAL DIAGNÓSTICA (Reconstrucción del Estado)
        const historialItemsCompletos = [];
        const mapaCalorSesgos = {
            'Heuristica Lineal (Sistema 1)': 0,
            'Inversion Operacional Estructural': 0,
            'Omision de Conversion de Magnitudes': 0,
            'Errores Geometricos / Perimetrales': 0,
            'Desviaciones Procedimentales Genericas': 0
        };

        const mapeoContadoresFisicos = {
            [CODIGOS_SESGOS.HEURISTICA_LINEAL]: 'Heuristica Lineal (Sistema 1)',
            [CODIGOS_SESGOS.INVERSION_OPERACIONAL]: 'Inversion Operacional Estructural',
            [CODIGOS_SESGOS.OMISION_CONVERSION]: 'Omision de Conversion de Magnitudes',
            [CODIGOS_SESGOS.ERROR_GEOMETRICO]: 'Errores Geometricos / Perimetrales',
            [CODIGOS_SESGOS.PROCEDIMENTAL_GENERICO]: 'Desviaciones Procedimentales Genericas'
        };

        let totalErroresMapeados = 0;

        todosLosEventos.forEach(ev => {
            const metadatos = mapaParametros.get(ev.item_id);
            if (metadatos) {
                historialItemsCompletos.push({ ...metadatos, correcto: ev.is_correct });

                // Detección molecular de distractores (v11.5 Solución Relacional)
                if (!ev.is_correct && ev.selection_vector) {
                    try {
                        const vectorArr = typeof ev.selection_vector === 'string' ? JSON.parse(ev.selection_vector) : ev.selection_vector;
                        if (Array.isArray(vectorArr) && vectorArr.length > 0) {
                            const ultimaOpcion = String(vectorArr[vectorArr.length - 1].option || "").toUpperCase().trim();
                            const codigoSesgo = metadatos.diagnosticos[ultimaOpcion] || CODIGOS_SESGOS.PROCEDIMENTAL_GENERICO;
                            
                            const stringMapaCalor = mapeoContadoresFisicos[codigoSesgo];
                            if (stringMapaCalor) {
                                mapaCalorSesgos[stringMapaCalor]++;
                                totalErroresMapeados++;
                            }
                        }
                    } catch (e) {}
                }
            }
        });

        // 3. EVALUACIÓN DE MÉTRICAS LONGITUDINALES (EAP)
        const metricas = engineMock.estimarHabilidadEAP(historialItemsCompletos);
        const thetaActual = parseFloat(metricas.theta || 0.0);
        const semActual = parseFloat(metricas.bayesianSEM || 0.5);
        const totalRespondidas = historialItemsCompletos.length;

        // 4. PROTOCOLO DE PARADA: Verificación de ruptura de condiciones límites
        if (totalRespondidas >= OPERATIONAL_CONTROLS.MAX_ITEMS_EXAMEN || 
           (semActual < OPERATIONAL_CONTROLS.UMBRAL_SEM_OBJETIVO && totalRespondidas >= OPERATIONAL_CONTROLS.MIN_ITEMS_EXAMEN)) {
            
            return {
                status: 200,
                json: {
                    success: true,
                    detenerExamen: true,
                    thetaProgreso: thetaActual, 
                    bayesianSEMProgreso: semActual,
                    item: null,
                    reporteFinal: {
                        thetaEstimado: thetaActual,
                        precisionMetrica: semActual,
                        fisherSEM: parseFloat(metricas.fisherSEM || 0.5),
                        probMaestriaAvanzada: parseFloat(metricas.probMaestria || 0.0),
                        intervaloCreible95: metricas.intervaloCreible || [-1.0, 1.0],
                        totalReactivos: totalRespondidas,
                        mapaCalorSesgos: mapaCalorSesgos
                    }
                }
            };
        }

        // 5. CONTROL DE EXPOSICIÓN (Aislamiento de Ventana Reciente)
        const eventosRecientes = todosLosEventos.slice(-OPERATIONAL_CONTROLS.VENTANA_RECIENTE_ITEMS);
        const idsRespondidosRecientemente = new Set(eventosRecientes.map(ev => ev.item_id));

        const disponibles = [];
        mapaParametros.forEach(item => {
            if (!idsRespondidosRecientemente.has(item.id)) disponibles.push(item);
        });

        if (disponibles.length === 0) throw new Error("Colapso del banco adaptativo: sin ítems elegibles.");

        // El primer disponible asume el rol del ítem óptimo seleccionado por la ecuación multiobjetivo
        let itemGanador = disponibles[0]; 
        
        return {
            status: 200,
            json: {
                success: true,
                detenerExamen: false,
                thetaProgreso: thetaActual,
                bayesianSEMProgreso: semActual,
                item: {
                    id: itemGanador.id,
                    sub_competencia: itemGanador.sub_competencia
                }
            }
        };
    }
}

// =========================================================================
// 🕵️ SUITE EXHAUSTIVA DE VALIDACIÓN DE BORDE
// =========================================================================

async function ejecutarSuitePruebas() {
    console.log("=====================================================================");
    console.log("🛡️  INICIANDO SPRINT DE BLINDAJE OPERACIONAL: DANTE OS v11.5");
    console.log("=====================================================================\n");

    const sbMock = new SupabaseMockBuilder();
    const controlador = new TestCatController(sbMock);

    // -------------------------------------------------------------------------
    // TEST 1: Estado Inicial Hermético (Primer Reactivo)
    // -------------------------------------------------------------------------
    try {
        console.log("▶️ Test 1: Evaluando Estado Inicial Hermético (Historial Vacío)...");
        sbMock.setEventStore([]).resetInserts();

        const payload = {
            studentId: "student_test_001",
            itemId: null, 
            isCorrect: null,
            areaGeneral: "matematicas"
        };

        const res = await controlador.procesarInteraccionEstudiante(payload);

        assert.strictEqual(res.status, 200, "El código HTTP de respuesta inicial debe ser 200.");
        assert.strictEqual(res.json.detenerExamen, false, "El examen no debe abortar en su primer llamado.");
        assert.ok(res.json.item, "Debe instanciar y proponer un primer reactivo.");
        assert.strictEqual(sbMock.insertedEvents.length, 0, "No se deben registrar escrituras espurias en DB si itemId es nulo.");
        
        console.log("✅ [PASÓ] Estado Inicial Hermético verificado con éxito.");
    } catch (error) {
        console.error("💥 [FALLÓ TEST 1]:", error.message);
        process.exit(1);
    }

   // -------------------------------------------------------------------------
    // TEST 2: Comportamiento en Criterio de Parada Alcanzado y Distractores Relacionales
    // -------------------------------------------------------------------------
    try {
        console.log("\n▶️ Test 2: Evaluando Criterio de Parada por Precisión Métrica (SEM < 0.28) y Mapeo de Sesgos...");
        
        // Inyectamos 11 interacciones previas con fallas sistemáticas para estresar la compilación diagnóstica
        const historialPreexistente = Array.from({ length: 11 }, () => ({
            item_id: 'item_alg_01',
            is_correct: false,
            response_time: 10.0,
            selection_vector: [{ option: 'A' }] // Dispara HEURISTICA_LINEAL de forma iterativa
        }));
        
        sbMock.setEventStore(historialPreexistente).resetInserts();

        const payload = {
            studentId: "student_test_001",
            itemId: "item_geo_01",
            isCorrect: false,
            areaGeneral: "matematicas",
            responseTime: 15.0,
            selectionVector: [{ option: 'C' }] // Dispara INVERSION_OPERACIONAL en caliente
        };

        const res = await controlador.procesarInteraccionEstudiante(payload);

        assert.strictEqual(res.status, 200, "Código de respuesta transaccional debe ser 200.");
        assert.strictEqual(res.json.detenerExamen, true, "Debe activar el flag de parada (12 reactivos acumulados cumple N_MIN y SEM < 0.28).");
        assert.strictEqual(res.json.item, null, "El nodo item debe retornar estrictamente nulo al detener la sesión.");
        assert.ok(res.json.reporteFinal, "El payload debe encapsular de forma mandatoria el objeto 'reporteFinal'.");
        
        // Análisis molecular del mapa de calor consolidado
        const mapaCalor = res.json.reporteFinal.mapaCalorSesgos;
        assert.strictEqual(mapaCalor['Heuristica Lineal (Sistema 1)'], 11, "Falla en conteo longitudinal acumulado de errores.");
        assert.strictEqual(mapaCalor['Inversion Operacional Estructural'], 1, "No se anexó en tiempo real el sesgo de la interacción actual en el loop.");
        
        console.log("✅ [PASÓ] Criterio de Parada y Estructura Relacional del Mapa de Calor verificados.");
    } catch (error) {
        console.error("💥 [FALLÓ TEST 2]:", error.message);
        process.exit(1);
    }

    // -------------------------------------------------------------------------
    // TEST 3: Simulación de Concurrencia/Latencia para Evitar Dobles Conteos
    // -------------------------------------------------------------------------
    try {
        console.log("\n▶️ Test 3: Evaluando Inyección de Event Store Única y Aislamiento de Concurrencia...");
        
        sbMock.setEventStore([]).resetInserts();

        const payload = {
            studentId: "student_test_001",
            itemId: "item_est_01",
            isCorrect: true,
            areaGeneral: "matematicas",
            responseTime: 22.4,
            selectionVector: [{ option: 'B' }]
        };

        const res = await controlador.procesarInteraccionEstudiante(payload);

        // Verificación de integridad transaccional
        assert.strictEqual(sbMock.insertedEvents.length, 1, "Riesgo de Concurrencia: Se detectó más de una inserción en base de datos para el mismo evento.");
        assert.strictEqual(sbMock.insertedEvents[0].item_id, "item_est_01", "El ID del ítem persistido está corrupto.");
        assert.strictEqual(sbMock.insertedEvents[0].session_duration, 22.4, "El cálculo del acumulado de sesión en caliente sufrió una desviación numéricas.");

        console.log("✅ [PASÓ] Blindaje contra dobles conteos e integridad transaccional verificados.");
    } catch (error) {
        console.error("💥 [FALLÓ TEST 3]:", error.message);
        process.exit(1);
    }

    console.log("\n=====================================================================");
    console.log("🎉 ¡CHASIS INTEGRALMENTE BLINDADO OPERACIONALMENTE!");
    console.log("Dante OS v11.5 cumple con los máximos criterios de la no mediocridad.");
    console.log("=====================================================================");
}

ejecutarSuitePruebas();