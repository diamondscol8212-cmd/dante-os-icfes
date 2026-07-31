// 🪐 simulate-traffic.js - Inyector de Tráfico Conductual con Persistencia de Flujo Live
// Dante OS v20.6.3 Enterprise Edition // Bogotá, Colombia

const GATEWAY_URL = "http://localhost:3000/api/cat/interactuar";
const INSTITUTION_ID = "colegio_sandbox_default";
const MATERIA = "matematicas";

const PERFILES_ESTUDIANTES = [
    {
        nombre: "elizabeth",
        email: "elizabeth@sandbox.edu.co",
        perfil: "S2_NOMINAL",
        certeza: "alta",
        tiempoBase: 14.5,
        opciones: ["A", "A", "C", "A", "B", "A", "C", "D", "A", "B", "A", "A", "C", "A", "D"]
    },
    {
        nombre: "samantha",
        email: "samantha@sandbox.edu.co",
        perfil: "S1_IMPULSIVO",
        certeza: "baja",
        tiempoBase: 1.8,
        opciones: ["D", "B", "D", "C", "A", "D", "B", "B", "C", "D", "A", "D", "B", "C", "A"]
    }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function ejecutarSimulacionCompleta() {
    console.log(`\n================================================================================`);
    console.log(`🪐 [DANTE OS LONGITUDINAL INJECTION]: Simulacro de Tráfico Continuo Activo...`);
    console.log(`================================================================================`);
    console.log(`📡 TARGET GATEWAY: ${GATEWAY_URL}`);
    console.log(`🔗 TENANT COMPLIANT: T-${INSTITUTION_ID.toUpperCase()}\n`);

    for (const estudiante of PERFILES_ESTUDIANTES) {
        const sessionId = `session_sim_web_${Date.now()}`;
        console.log(`\n🚀 >>> INYECTANDO VECTORES PARA: [${estudiante.nombre.toUpperCase()}] <<< 🚀\n`);

        console.log(`📡 [ARRANQUE EN FRÍO]: Generando Handshake inicial...`);
        try {
            let resCold = await fetch(GATEWAY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: estudiante.email,
                    sessionId: sessionId,
                    areaGeneral: MATERIA,
                    itemId: null,
                    institution_id: INSTITUTION_ID
                })
            });
            let dataCold = await resCold.json();

            for (let paso = 1; paso <= estudiante.opciones.length; paso++) {
                const latenciaSimulada = parseFloat((estudiante.tiempoBase + (Math.random() * 1.5 - 0.75)).toFixed(2));
                const opcionElegida = estudiante.opciones[paso - 1];

                console.log(`\n⏱️ [REACTIVO ${paso}/${estudiante.opciones.length}]: ${estudiante.nombre.toUpperCase()} resolviendo...`);
                
                // Pausa de 3.5 segundos para dar tiempo a que actúe el refresco visual de rector.html
                await delay(3500); 

                let resInteract = await fetch(GATEWAY_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: estudiante.email,
                        sessionId: sessionId,
                        areaGeneral: MATERIA,
                        itemId: dataCold.item?.id || "reactivo_mat_023",
                        responseTime: latenciaSimulada,
                        declaredConfidence: estudiante.certeza,
                        selectionVector: [{ option: opcionElegida, timestamp: new Date().toISOString() }],
                        institution_id: INSTITUTION_ID
                    })
                });

                let dataInteract = await resInteract.json();
                if (dataInteract.success) {
                    console.log(`   ✅ [PROCESADO LIVE]: Habilidad &theta; transmitida con éxito.`);
                }
            }
        } catch (err) {
            console.error(`🚨 [EXCEPCIÓN EN FLUJO]:`, err.message);
        }
    }
    console.log(`\n🪐 [SIMULACIÓN LONGITUDINAL COMPLETADA]: Canal elástico retenido en memoria para auditoría.`);
}

ejecutarSimulacionCompleta();