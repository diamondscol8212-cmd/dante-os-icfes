// testSuite.js - Sandbox de Integración Extremo a Extremo (Chasis v2.0)
import { registrarEventoConductual } from '../eventDispatcher.js';
import { verificarBanderaIntervencion } from './verificarFlujo.js';
import { resetearBanderaControl } from '../resetter.js';

// ID de usuario único para esta simulación de estrés
const TEST_STUDENT_ID = "sandbox-user-2026";
const METADATA_PREGUNTA = {
  itemId: "c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f",
  skill: "algebra_calculo"
};

/**
 * Función auxiliar para pausar la ejecución en la consola y simular tiempos reales
 */
const esperarSiguientePaso = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function ejecutarPruebaDeFuego() {
  console.clear();
  console.log("🚀 INICIANDO PROTOCOLO DE PRUEBA UNITARIA - MOTOR ADAPTATIVO v2.0");
  console.log("=================================================================");

  // -----------------------------------------------------------------
  // PASO 1: Simular el envío de un reactivo que dispara Fatiga y Sobreconfianza
  // -----------------------------------------------------------------
  console.log("\n[Paso 1] 📱 El usuario responde con alta certeza, pero la respuesta es INCORRECTA.");
  console.log("         Adicionalmente, el cronómetro registra fatiga (65 segundos en el reactivo).");
  
  const payloadSimulado = {
    studentId: TEST_STUDENT_ID,
    itemId: METADATA_PREGUNTA.itemId,
    skill: METADATA_PREGUNTA.skill,
    isCorrect: false, // Falló
    responseTimeSeconds: 65.0, // > 45s (Fatiga)
    sessionDurationMinutes: 45.0, // > 40m (Sesión prolongada)
    declaredConfidence: "alta", // Confianza alta + Incorrecta = Punto Ciego
    selectionVector: [{ opcion: "B", timestamp_relativo: 15.2 }, { opcion: "A", timestamp_relativo: 60.1 }]
  };

  console.log("📡 Despachando micro-evento asíncrono a Supabase...");
  await registrarEventoConductual(payloadSimulado);
  
  // Esperamos 2 segundos para dar tiempo a que el Trigger de PostgreSQL procese en la nube
  await esperarSiguientePaso(2000);

  // -----------------------------------------------------------------
  // PASO 2: Simular la consulta del Chasis antes de pintar la siguiente pregunta
  // -----------------------------------------------------------------
  console.log("\n[Paso 2] 🔍 El chasis solicita el estado del perfil antes de renderizar la siguiente pregunta...");
  const evaluacionBackend = await verificarBanderaIntervencion(TEST_STUDENT_ID);

  console.log(`📥 Respuesta del Servidor -> ¿Necesita Intervención?: ${evaluacionBackend.necesitaIntervencion}`);
  console.log(`📥 Diagnóstico Clínico   -> Motivo: ${evaluacionBackend.motivo}`);

  // -----------------------------------------------------------------
  // PASO 3: Validación de la lógica de Bloqueo / Enrutamiento en el Frontend
  // -----------------------------------------------------------------
  console.log("\n[Paso 3] 🎮 Evaluando reacción del Chasis en la Interfaz:");
  if (evaluacionBackend.necesitaIntervencion === true) {
    console.log("🛑 PANTALLA BLOQUEADA: El Chasis detuvo exitosamente el banco de preguntas normal.");
    console.log(`🎯 INYECTANDO MICROINTERVENCIÓN EN PANTALLA PARA: [${evaluacionBackend.motivo}]`);
    
    // Simulamos que el usuario pasa 3 segundos consumiendo el andamiaje o descansando
    console.log("⏳ El usuario está ejecutando la acción de mitigación en el dispositivo...");
    await esperarSiguientePaso(3000);
    
    // -----------------------------------------------------------------
    // PASO 4: Liberación del flujo tras la remediación
    // -----------------------------------------------------------------
    console.log("\n[Paso 4] 🔄 El usuario hace clic en 'Continuar Examen'. Apagando bandera...");
    await resetearBanderaControl(TEST_STUDENT_ID);
    
    // Esperamos 1.5 segundos para la propagación de la actualización en Supabase
    await esperarSiguientePaso(1500);
    
    console.log("🔍 Re-verificando el chasis por seguridad antes de liberar...");
    const verificacionFinal = await verificarBanderaIntervencion(TEST_STUDENT_ID);
    
    if (verificacionFinal.necesitaIntervencion === false) {
      console.log("🟢 CERTIFICADO: Bandera en FALSE. El canal normal ha sido liberado.");
      console.log("📖 Cargando la siguiente pregunta del banco de ítems. Examen corriendo normal.");
    } else {
      console.error("❌ FALLA: La bandera sigue activa. Riesgo de bucle infinito detectado.");
    }

  } else {
    console.error("❌ FALLA CRÍTICA: El backend no detectó las anomalías conductuales inyectadas.");
  }

  console.log("\n=================================================================");
  console.log("🏁 PROTOCOLO DE SIMULACIÓN FINALIZADO");
}

// Ejecutar la suite de pruebas
ejecutarPruebaDeFuego();