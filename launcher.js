// 🪐 launcher.js - Orquestador Maestro de Despliegue y Homeostasis de Entorno
// Dante OS v20.6.3 Enterprise Edition // Bogotá, Colombia
import 'dotenv/config';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import Redis from 'ioredis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_VERSION = "v20.6.3-FIX_MASTER";

console.log(`\n================================================================================`);
console.log(`🪐 [DANTE OS CORE LAUNCHER]: Inicializando Secuencia de Arranque Maestro...`);
console.log(`================================================================================`);

// ====================================================================
// 🔬 FASE 1: AUDITORÍA DEL ENTORNO FÍSICO (.ENV VECTORS)
// ====================================================================
function auditarEntornoFisico() {
    console.log(`🔍 [AUDITORÍA DE ENTORNO]: Verificando inyección de variables perimetrales...`);
    
    const VARIABLES_MANDATORIAS = [
        'PORT',
        'INTEGRITY_SECRET',
        'SUPABASE_URL',
        'SUPABASE_KEY',
        'REDIS_URL'
    ];

    const faltantes = [];
    VARIABLES_MANDATORIAS.forEach(v => {
        if (!process.env[v]) {
            faltantes.push(v);
        }
    });

    if (faltantes.length > 0) {
        console.error(`\n🚨 [AUDIT CRITICAL CRASH]: Cortocircuito por variables ausentes en el .env:`);
        faltantes.forEach(f => console.error(`   ❌ Falta: [${f}]`));
        console.error(`\n[MANDO CORE]: Secuencia abortada. Repara el archivo .env antes de reintentar.\n`);
        process.exit(1);
    }

    console.log(`✅ [AUDITORÍA EXITOSA]: Todas las variables del clúster están perfectamente inyectadas.`);
}

// ====================================================================
// 🔬 FASE 2: PURGA DE LA MEMORIA RAM RESIDUAL (CACHÉ HIGIÉNICA)
// ====================================================================
async function purgarMemoriaResidual() {
    console.log(`🧹 [MANDO CORE]: Conectando con Upstash Cloud para limpieza higiénica...`);
    
    if (!process.env.REDIS_URL) return;
    
    const redisClient = new Redis(process.env.REDIS_URL);
    
    try {
        // Purgar específicamente la cola de eventos que generaba la advertencia de reintento en segundo plano
        const totalPurgados = await redisClient.del('dante:pipeline:events');
        
        if (totalPurgados > 0) {
            console.log(`🧹 [MANDO CORE]: Cola de eventos atascados ('dante:pipeline:events') purgada con éxito.`);
        } else {
            console.log(`🧹 [MANDO CORE]: La caché temporal ya se encontraba en un estado nominal y libre.`);
        }
    } catch (err) {
        console.warn(`⚠️ [MANDO CORE NON-CRITICAL WARNING]: Ocurrió una anomalía al purgar Redis: ${err.message}`);
    } finally {
        redisClient.disconnect();
    }
}

// ====================================================================
// 🔬 FASE 3: LEVANTAR EL GATEWAY DE UN SOLO DISPARO (EXECUTION)
// ====================================================================
function levantarGatewayCentral() {
    const serverPath = path.join(__dirname, 'server.js');
    console.log(`🚀 [LAUNCHER]: Lanzando proceso hijo inmutable para: [server.js]`);
    
    // Lanzar el servidor en un proceso Fork nativo desacoplado para mantener control de canal
    const child = fork(serverPath, [], {
        env: { ...process.env, LAUNCHED_BY_CORE: "true" }
    });

    child.on('error', (err) => {
        console.error(`🚨 [CHILD PROCESS EXCEPTION]: Cortocircuito en la cabina del servidor:`, err.message);
    });

    child.on('exit', (code) => {
        console.log(`\n🪐 [DANTE OS]: El Gateway Central ha finalizado su ciclo con código de salida: [${code}]`);
    });
}

// Orquestación Secuencial del Launcher Central
(async () => {
    auditarEntornoFisico();
    await purgarMemoriaResidual();
    
    console.log(`\n🪐 [HOMEOSTASIS COMPLETADA]: El entorno está estable y en un estado del 100%.`);
    console.log(`🚀 Desplegando Dante OS Gateway ${SERVER_VERSION} en Bogotá...\n`);
    
    // Breve pausa estética antes del disparo final
    setTimeout(levantarGatewayCentral, 800);
})();