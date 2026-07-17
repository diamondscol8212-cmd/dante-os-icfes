// 🪐 stress-test.js - Simulador de Carga Concurrente e Inyección de Tráfico para Dante OS
// Dante OS v20.6.3 Enterprise Edition // Bogotá, Colombia

const TARGET_ENDPOINT = "http://localhost:3000/api/cat/interactuar";
const INSTITUTION_ID = "colegio_sandbox_default";
const MATERIA = "matematicas";

// Perfiles nominales para simular comportamientos reales (Sistema 1 vs Sistema 2)
const ESTUDIANTES_SIMULADOS = [
    { id: "elizabeth_stress", certeza: "alta", tiempo: 15.5, option: "A" },
    { id: "samantha_stress", certeza: "media", tiempo: 8.2, option: "B" },
    { id: "rector_stress", certeza: "baja", tiempo: 3.1, option: "C" } // Fuerza perfil impulsivo S1
];

async function ejecutarRafagaPrueba() {
    console.log(`🚀 [DANTE OS STRESS INJECTION]: Iniciando ráfaga de eventos concurrentes...`);
    
    for (const alumno of ESTUDIANTES_SIMULADOS) {
        const sessionId = `stress_session_${Date.now()}`;
        
        try {
            // 1. Simular arranque de examen en frío (!itemId) para disparar la Capa de Historias
            console.log(`📡 [ARRANQUE EN FRÍO]: Sincronizando entorno adaptativo para [${alumno.id.toUpperCase()}]...`);
            let res = await fetch(TARGET_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: alumno.id,
                    sessionId: sessionId,
                    areaGeneral: MATERIA,
                    itemId: null,
                    institution_id: INSTITUTION_ID
                })
            });
            let json = await res.json();
            
            if (json.success && json.item) {
                const nextItemId = json.item.id;
                console.log(`📖 [CRÓNICA RECIBIDA]: "${json.cronicaBienvenida}"`);
                console.log(`🎯 [SIGUIENTE ITEM ASIGNADO]: ID: ${nextItemId}`);

                // 2. Simular respuesta inmediata enviando el vector de selección y la latencia
                console.log(`⚡ [DESPACHANDO CLIC]: Enviando respuesta de ${alumno.id} en ${alumno.tiempo}s...`);
                let resInteract = await fetch(TARGET_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: alumno.id,
                        sessionId: sessionId,
                        areaGeneral: MATERIA,
                        itemId: nextItemId,
                        responseTime: alumno.tiempo,
                        declaredConfidence: alumno.certeza,
                        selectionVector: [{ option: alumno.option, timestamp: new Date().toISOString() }],
                        institution_id: INSTITUTION_ID
                    })
                });
                let jsonInteract = await resInteract.json();
                console.log(`✅ [PIPELINE RESPONSE]: Interacción procesada. Correcta: ${jsonInteract.interaccionCorrecta}. Estado Motor: ${jsonInteract.accs_telemetria?.estado_operacional}`);
            }
        } catch (err) {
            console.error(`🚨 [STRESS CORTOCIRCUITO]: Error en el flujo de ${alumno.id}:`, err.message);
        }
    }
    console.log(`\n🪐 [CERTIFICACIÓN COMPLETADA]: Ráfaga finalizada. Monitorea la consola principal de node server.js.`);
}

ejecutarRafagaPrueba();