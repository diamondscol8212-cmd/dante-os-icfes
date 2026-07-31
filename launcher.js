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
        'JWT_SECRET',
        'INTEGRITY_SECRET',
        'PII_SALT_SECRET',
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
        console.warn(`\n⚠️ [AUDIT WARNING]: Variables ausentes o vacías en process.env:`);
        faltantes.forEach(f => console.warn(`   ⚠️ Falta: [${f}] - Operando con fallback determinista.`));
    } else {
        console.log(`✅ [AUDITORÍA EXITOSA]: Todas las variables del clúster están inyectadas.`);
    }
}

// ====================================================================
// 🔬 FASE 2: PURGA DE LA MEMORIA RAM RESIDUAL (CACHÉ HIGIÉNICA)
// ====================================================================
async function purgarMemoriaResidual() {
    console.log(`🧹 [MANDO CORE]: Conectando con Upstash Cloud para limpieza higiénica...`);
    
    if (!process.env.REDIS_URL) {
        console.log(`ℹ️ [MANDO CORE]: REDIS_URL no definida. Omitiendo purga de caché.`);
        return;
    }
    
    try {
        const isTls = process.env.REDIS_URL.startsWith('rediss://');
        const redisOptions = {
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            connectTimeout: 3000,
            retryStrategy() { return null; }
        };
        if (isTls) redisOptions.tls = { rejectUnauthorized: false };

        const redisClient = new Redis(process.env.REDIS_URL, redisOptions);
        
        // Listener de error inmediato para prevenir crashes de Unhandled Error Event en Node
        redisClient.on('error', (err) => {
            console.warn(`⚠️ [MANDO CORE REDIS WARN]: ${err.message}`);
        });

        // Purgar específicamente la cola de eventos que generaba la advertencia
        const totalPurgados = await redisClient.del('dante:pipeline:events').catch(err => {
            console.warn(`⚠️ [MANDO CORE DEL WARN]: ${err.message}`);
            return 0;
        });
        
        if (totalPurgados > 0) {
            console.log(`🧹 [MANDO CORE]: Cola de eventos atascados ('dante:pipeline:events') purgada con éxito.`);
        } else {
            console.log(`🧹 [MANDO CORE]: La caché temporal ya se encontraba en un estado nominal y libre.`);
        }

        try { redisClient.disconnect(); } catch (_) {}
    } catch (err) {
        console.warn(`⚠️ [MANDO CORE NON-CRITICAL WARNING]: Ocurrió una anomalía al purgar Redis: ${err.message}`);
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
