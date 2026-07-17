// 🪐 simulacro-bot.js - Motor de Simulación y Pruebas de Carga Definitivo
const BACKEND_URL = 'http://localhost:3000/api/cat/interactuar';
const STUDENT_ID = 'elizabeth'; 
const INSTITUTION_ID = 'colegio_sandbox_default';
const SESSION_ID = `session_bot_auto_${Date.now()}`;
const MATERIA = 'matematicas';

async function correrSimulacroAutomatizado() {
    console.log("🚀 [DANTE OS BOT-TEST]: Iniciando simulacro automatizado desde VS Code...");
    console.log(`🤖 Alumno Simulado: [${STUDENT_ID}] | Sesión única: [${SESSION_ID}]\n`);

    let nextItemId = null; // En la primera pregunta va null para inicializar la sesión
    let terminado = false;
    let contadorPreguntas = 0;
    let tokenIntegridad = "jwt_bot_bypass_master_" + Date.now();
    let itemHash = "";

    // Pool de contención por si el backend no expone el ID nativo en el objeto item
    const fallbackIdsSupabase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    while (!terminado && contadorPreguntas < 30) {
        contadorPreguntas++;
        console.log(`----------------------------------------------------------------`);
        console.log(`Docs 📝 [REACTIVO #${contadorPreguntas}]: Sincronizando con el Gateway...`);

        // Estructuramos el payload enviando siempre la opción correcta simulada para estresar el motor 3PL
        const payload = {
            studentId: STUDENT_ID,
            sessionId: SESSION_ID,
            areaGeneral: MATERIA,
            itemId: nextItemId,
            responseTime: 15.0, // Forzamos un tiempo de S2 nominal estable
            declaredConfidence: 'alta',
            selectionVector: [{ option: 'A', timestamp: new Date().toISOString() }],
            integrityToken: tokenIntegridad,
            itemHash: itemHash,
            institution_id: INSTITUTION_ID
        };

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!data.success) {
                console.error(`🚨 [FALLO TRANSACCIONAL]: ${data.error}`);
                break;
            }

            if (data.detenerExamen) {
                console.log(`\n================================================================`);
                console.log(`🎯 [CRITERIO DE PARADA DETECTADO EXITOSAMENTE]`);
                console.log(`✅ El motor IRT ordenó detener el examen de forma limpia.`);
                console.log(`📊 Reporte Final de Trayectoria:`);
                console.log(`   Habilidad Final Estándar (θ): ${data.reporteFinal?.thetaEstimado?.toFixed(4)}`);
                console.log(`   Equivalencia Escala País:     ${data.reporteFinal?.escalonamiento_pais?.puntaje_icfes_area} / 100 pts`);
                console.log(`================================================================\n`);
                terminado = true;
                break;
            }

            if (data.item) {
                const idRecibido = data.item.id;
                
                // DETECCIÓN INTELIGENTE: Si el ID viene enmascarado, usamos nuestro pool secuencial
                if (idRecibido === 'item_mat_master_0' || idRecibido.includes('master')) {
                    nextItemId = fallbackIdsSupabase[(contadorPreguntas - 1) % fallbackIdsSupabase.length];
                } else {
                    nextItemId = idRecibido;
                }

                itemHash = data.itemHash || "";
                console.log(`📥 [ITEM ENTREGADO]: ID de Transmisión Real -> ${nextItemId}`);
                console.log(`❓ Contexto: "${data.item.pregunta_texto.substring(0, 52)}..."`);
                console.log(`📈 Progreso de Habilidad (θ): ${data.thetaProgreso?.toFixed(4)}`);
                console.log(`📉 Margen de Precisión (SEM): ${data.bayesianSEMProgreso?.toFixed(4)}`);
            }

        } catch (error) {
            console.error(`🚨 Cortocircuito de red HTTP: ${error.message}`);
            break;
        }

        // Delay estratégico de 800ms para observar la cascada de datos con claridad
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

correrSimulacroAutomatizado();