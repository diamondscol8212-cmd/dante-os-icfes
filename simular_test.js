// 🤖 simular_test.js - Bot de Automatización para Pruebas Gratuitas (Free Tier Rate-Limit Safe)
// Dante OS v21.0.0 Enterprise Edition // Bogotá, Colombia
// Ejecutar en una terminal paralela: node simular_test.js

const BASE_URL = 'http://localhost:3000/api/cat/interactuar';
const STUDENT_ID = 'elizabeth';
const SESSION_ID = `bot_clean_sim_${Date.now()}`;
const AREA = 'matematicas';

const OPCIONES = ['A', 'B', 'C', 'D'];
const CERTEZAS = ['alta', 'media', 'baja'];

async function correrSimulacionAutomatica() {
    console.log(`🚀 [DANTE OS BOT]: Iniciando simulación automática nativa para: [${STUDENT_ID}]`);
    console.log(`⚠️  [RATE-LIMIT CONTROL]: Retraso de 4s activo para proteger la cuota gratuita de Gemini API.`);
    
    let finalizar = false;
    let itemActualId = null; 
    let contadorPasos = 1;

    while (!finalizar) {
        console.log(`\n⚡ [REACTIVO #${contadorPasos}]: Disparando interacción...`);
        
        const tiempoRespuestaAleatorio = parseFloat((Math.random() * (25 - 2) + 2).toFixed(1));
        const opcionAleatoria = OPCIONES[Math.floor(Math.random() * OPCIONES.length)];
        const certezaAleatoria = CERTEZAS[Math.floor(Math.random() * CERTEZAS.length)];

        const payload = {
            studentId: STUDENT_ID,
            sessionId: SESSION_ID,
            areaGeneral: AREA,
            itemId: itemActualId,
            responseTime: tiempoRespuestaAleatorio,
            declaredConfidence: certezaAleatoria,
            selectionVector: [{ option: opcionAleatoria, timestamp: new Date().toISOString() }],
            institution_id: 'colegio_sandbox_default'
        };

        try {
            const response = await globalThis.fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!data.success) {
                // Control de espera si la base de datos se está precalentando en el servidor
                if (data.error && data.error.includes("Códice en proceso")) {
                    console.log("⏳ [BOT INFO]: El servidor está indexando el banco en RAM... Esperando 2s para reintentar.");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }
                console.error(`❌ [BOT ERROR]:`, data.error);
                break;
            }

            // 🛑 SEGURIDAD: Si el servidor dice detener examen o manda el reporte final, cerramos físicamente el bot
            if (data.detenerExamen || data.reporteFinal) {
                console.log(`\n🏁 🏁 [SIMULACIÓN TERMINADA POR LA FUERZA] 🏁 🏁`);
                console.log(`📊 Habilidad Final calculada (Theta):`, data.thetaProgreso);
                console.log(`🎯 Reporte Clínico unificado y plan de 10 días inyectado con éxito.`);
                finalizar = true;
                process.exit(0); // Detiene el proceso de Node inmediatamente
            } else {
                itemActualId = data.item?.id;
                console.log(`📥 Ítem recibido: [${itemActualId}] -> Competencia: ${data.item?.sub_competencia}`);
                console.log(`🎯 ¿Fue correcto?: ${data.interaccionCorrecta ? '✅ SÍ' : '❌ NO'}`);
                contadorPasos++;
                
                // ⏱️ Espera de 4 segundos para no exceder las 15 peticiones por minuto (RPM) de la Free Tier de Google
                await new Promise(resolve => setTimeout(resolve, 4000));
            }

        } catch (error) {
            console.error(`🚨 [FALLO DE CONEXIÓN WITH SERVER.JS]:`, error.message);
            break;
        }
    }
}

correrSimulacionAutomatica();