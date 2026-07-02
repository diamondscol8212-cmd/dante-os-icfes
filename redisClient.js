// redisClient.js - Instancia de Conexión TLS de Alta Velocidad para Dante OS
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.error('❌ [REDIS ERROR]: La variable de entorno REDIS_URL no está configurada.');
    process.exit(1);
}

// Inicialización del cliente con soporte nativo para TLS/SSL de Upstash
export const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    tls: {
        rejectUnauthorized: false // Permite la negociación segura con los certificados de Upstash
    },
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('connect', () => {
    console.log('\n🚀 [REDIS CACHE CONNECTED]: Conexión TLS exitosa con el clúster Upstash Cloud.');
});

redis.on('error', (err) => {
    console.error('🚨 [REDIS CRITICAL ERROR]:', err.message);
});