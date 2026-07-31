// redisClient.js - Instancia de Conexión TLS / Fallback In-Memory para Dante OS
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

class InMemoryRedisMock {
    constructor() {
        this.store = new Map();
        this.sets = new Map();
        console.log('⚡ [REDIS IN-MEMORY FALLBACK]: Activo almacenamiento volátil local.');
    }

    async get(key) {
        return this.store.get(key) ?? null;
    }

    async set(key, val, ...args) {
        this.store.set(key, String(val));
        return 'OK';
    }

    async setex(key, seconds, val) {
        this.store.set(key, String(val));
        return 'OK';
    }

    async del(...keys) {
        const flat = keys.flat();
        let count = 0;
        for (const k of flat) {
            if (this.store.delete(k) || this.sets.delete(k)) {
                count++;
            }
        }
        return count;
    }

    async sadd(key, ...members) {
        if (!this.sets.has(key)) {
            this.sets.set(key, new Set());
        }
        const s = this.sets.get(key);
        let added = 0;
        for (const m of members) {
            if (!s.has(m)) {
                s.add(m);
                added++;
            }
        }
        return added;
    }

    async smembers(key) {
        if (!this.sets.has(key)) return [];
        return Array.from(this.sets.get(key));
    }

    async scan(cursor, ...args) {
        const matchIdx = args.indexOf('MATCH');
        const pattern = matchIdx !== -1 ? args[matchIdx + 1] : null;

        const allKeys = [...this.store.keys(), ...this.sets.keys()];
        let matched = allKeys;

        if (pattern) {
            const regexStr = pattern.replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexStr}$`);
            matched = allKeys.filter(k => regex.test(k));
        }

        return ['0', matched];
    }

    on(event, cb) {
        if (event === 'connect') {
            setTimeout(() => cb(), 10);
        }
        return this;
    }
}

let redisInstance;

if (redisUrl) {
    try {
        redisInstance = new Redis(redisUrl, {
            maxRetriesPerRequest: 2,
            lazyConnect: false,
            tls: {
                rejectUnauthorized: false
            },
            retryStrategy(times) {
                if (times > 3) {
                    return null; // Stop retrying
                }
                return Math.min(times * 100, 1000);
            }
        });

        redisInstance.on('connect', () => {
            console.log('\n🚀 [REDIS CACHE CONNECTED]: Conexión TLS exitosa con el clúster Upstash Cloud.');
        });

        redisInstance.on('error', (err) => {
            console.error('🚨 [REDIS ERROR]:', err.message);
        });
    } catch (e) {
        console.warn('⚠️ [REDIS INIT WARN]: Fallo al instanciar Redis. Usando fallback en memoria.', e.message);
        redisInstance = new InMemoryRedisMock();
    }
} else {
    console.warn('ℹ️ [REDIS INFO]: REDIS_URL no está configurada. Usando cliente en memoria local.');
    redisInstance = new InMemoryRedisMock();
}

export const redis = redisInstance;
