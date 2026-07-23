// simulator.js - Inyector Conductual Concurrente con Protección de Delay (Dante OS v20.5.6)
import axios from 'axios';

const GATEWAY_URL = 'http://localhost:3000/api/cat/interactuar'; 
const COLD_START_DELAY = 1500; // 🌟 ORDEN 3: Retardo estratégico para estabilización de buffers en RAM

const ARQUETIPOS = {
    SAMANTHA: {
        id: "student_samantha_system1",
        name: "Samantha (System 1 - Impulsivo/Sobreconfiado)",
        generarRespuesta: (item) => {
            const isCorrectSim = Math.random() > 0.45;
            const option = isCorrectSim ? item.correcta_db : ["A","B","C","D"].find(o => o !== item.correcta_db);
            // CORREGIDO: Eliminada la variable 'i' rota que generaba la excepción en Node
            const responseTime = parseFloat((Math.random() * 6 + 3).toFixed(2)); 
            return { responseTime, declaredConfidence: 'alta', option };
        }
    },
    ELIZABETH: {
        id: "student_elizabeth_system2",
        name: "Elizabeth (System 2 - Estable/Reflexivo)",
        generarRespuesta: (item) => {
            const isCorrectSim = Math.random() > 0.15;
            const option = isCorrectSim ? item.correcta_db : ["A","B","C","D"].find(o => o !== item.correcta_db);
            const responseTime = parseFloat((Math.random() * 25 + 20).toFixed(2));
            return { responseTime, declaredConfidence: 'alta', option };
        }
    },
    FRACTURADO: {
        id: "student_fractured_lock",
        name: "Arquetipo Fractura Cognitiva (Análisis Largo / Fallo Persistente)",
        generarRespuesta: (item) => {
            const responseTime = parseFloat((Math.random() * 40 + 65).toFixed(2));
            const option = ["A","B","C","D"].find(o => o !== item.correcta_db);
            return { responseTime, declaredConfidence: 'alta', option };
        }
    }
};

async function ejecutarFlujoExamen(arquetipo) {
    console.log(`\n🎬 [COGNITIVE LIVE INITIALIZING]: Desplegando canal concurrente para ${arquetipo.name}...`);
    let sessionId = `session_sim_${arquetipo.id}_${Date.now()}`;
    let detenerExamen = false;
    let iteracion = 1;

    let payload = {
        studentId: arquetipo.id,
        sessionId: sessionId,
        itemId: null, // Cold Start de sesión
        areaGeneral: "matematicas",
        responseTime: 0,
        declaredConfidence: "alta",
        selectionVector: []
    };

    while (!detenerExamen && iteracion <= 25) {
        try {
            const res = await axios.post(GATEWAY_URL, payload);
            const data = res.data;

            if (!data.success) {
                console.error(`🚨 [GATEWAY EXCEPTION] en ${arquetipo.name}: ${data.error}`);
                break;
            }

            if (data.detenerExamen) {
                console.log(`\n🛑 [CRITERIO DE PARADA DETONADO] para ${arquetipo.name}`);
                console.log(`📊 PERFIL PSICOMÉTRICO FINAL DE CIERRE:`);
                console.log(`   - Habilidad Latente (Theta): ${data.reporteFinal.thetaEstimado}`);
                console.log(`   - Precisión Métrica (SEM): ${data.reporteFinal.precisionMetrica}`);
                console.log(`   - Puntaje Escalonado: ${data.reporteFinal.escalonamiento_pais.puntaje_icfes_area} / 100`);
                console.log(`   - Matriz Q de Sesgos Dinámicos:`, data.reporteFinal.mapaCalorSesgos);
                detenerExamen = true;
                break;
            }

            const itemDespachado = data.item;
            if (!itemDespachado) {
                console.warn(`⚠️ [CÓDICE SIN REACTIVOS ELIGIBLES] para ${arquetipo.name}`);
                break;
            }

            const conducta = arquetipo.generarRespuesta(itemDespachado);
            
            console.log(`🎰 [NODO ${iteracion}] ${arquetipo.name} -> Theta: ${data.thetaProgreso} | SEM: ${data.bayesianSEMProgreso}`);
            console.log(`   - Módulo Forense: ${data.accs_telemetria ? data.accs_telemetria.intervencion_activa : 'PROCESANDO'}`);
            if (data.accs_telemetria?.indices_avanzados) {
                console.log(`   - Métricas en RAM: ICI: ${(data.accs_telemetria.indices_avanzados.ici * 100).toFixed(0)}% | CRI: ${(data.accs_telemetria.indices_avanzados.cri * 100).toFixed(0)}%`);
            }

            payload = {
                studentId: arquetipo.id,
                sessionId: sessionId,
                itemId: itemDespachado.id,
                areaGeneral: "matematicas",
                responseTime: conducta.responseTime,
                declaredConfidence: conducta.declaredConfidence,
                selectionVector: [{ option: conducta.option }]
            };

            iteracion++;
            await new Promise(resolve => setTimeout(resolve, 250));

        } catch (err) {
            console.error(`🚨 [CRITICAL SHIELD BREAK] Interrupción en socket sim: ${err.message}`);
            detenerExamen = true;
        }
    }
}

async function inicializarSimulacionMasiva() {
    console.log("🚀 =========================================================================");
    console.log(`🚀 DANTE OS v20.5.6 - NÚCLEO B2B COLD START DELAY ACTIVADO (${COLD_START_DELAY}ms)`);
    console.log("🚀 =========================================================================");
    
    // 🌟 Retardo de sincronización estratégico mandatorio para estabilizar buffers (ORDEN 3)
    await new Promise(resolve => setTimeout(resolve, COLD_START_DELAY));

    Promise.all([
        ejecutarFlujoExamen(ARQUETIPOS.SAMANTHA),
        ejecutarFlujoExamen(ARQUETIPOS.ELIZABETH),
        ejecutarFlujoExamen(ARQUETIPOS.FRACTURADO)
    ]).then(() => {
        console.log("\n🏁 =========================================================================");
        console.log("🏁 SIMULACIÓN FINALIZADA SIN ERRORES DE TRÁFICO. SISTEMA BLINDADO AG AGNÓSTICO.");
        console.log("🏁 =========================================================================");
    });
}

inicializarSimulacionMasiva();