// redisClient.js - Instancia de Conexión Resiliente TLS / Fallback In-Memory para Dante OS
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

class ResilientRedisWrapper {
    constructor(realRedis, mockRedis) {
        this.realRedis = realRedis;
        this.mockRedis = mockRedis;
        this.isRealAvailable = false;

        if (this.realRedis) {
            this.realRedis.on('connect', () => {
                this.isRealAvailable = true;
                console.log('🚀 [REDIS CACHE CONNECTED]: Conexión exitosa con el clúster Redis.');
            });
            this.realRedis.on('ready', () => {
                this.isRealAvailable = true;
            });
            this.realRedis.on('error', (err) => {
                this.isRealAvailable = false;
                console.warn('🚨 [REDIS WARN / MÓDULO DEGRADADO]:', err.message);
            });
            this.realRedis.on('end', () => {
                this.isRealAvailable = false;
            });
            this.realRedis.on('close', () => {
                this.isRealAvailable = false;
            });
        }
    }

    async get(key) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.get(key);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.get(key);
    }

    async set(key, val, ...args) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.set(key, val, ...args);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.set(key, val, ...args);
    }

    async setex(key, seconds, val) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.setex(key, seconds, val);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.setex(key, seconds, val);
    }

    async del(...keys) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.del(...keys);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.del(...keys);
    }

    async sadd(key, ...members) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.sadd(key, ...members);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.sadd(key, ...members);
    }

    async smembers(key) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.smembers(key);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.smembers(key);
    }

    async scan(cursor, ...args) {
        if (this.isRealAvailable && this.realRedis) {
            try {
                return await this.realRedis.scan(cursor, ...args);
            } catch (err) {
                this.isRealAvailable = false;
            }
        }
        return await this.mockRedis.scan(cursor, ...args);
    }

    on(event, cb) {
        if (this.realRedis) {
            this.realRedis.on(event, cb);
        } else {
            this.mockRedis.on(event, cb);
        }
        return this;
    }
}

let redisExport;

const mockInstance = new InMemoryRedisMock();

if (redisUrl) {
    try {
        const isTls = redisUrl.startsWith('rediss://');
        const redisOptions = {
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            lazyConnect: true,
            connectTimeout: 5000,
            retryStrategy(times) {
                if (times > 2) {
                    return null;
                }
                return Math.min(times * 100, 500);
            }
        };

        if (isTls) {
            redisOptions.tls = { rejectUnauthorized: false };
        }

        const realRedis = new Redis(redisUrl, redisOptions);

        realRedis.connect().catch((err) => {
            console.warn('⚠️ [REDIS CONNECT WARN]: No se pudo conectar a Redis. Operando con fallback in-memory:', err.message);
        });

        redisExport = new ResilientRedisWrapper(realRedis, mockInstance);
    } catch (e) {
        console.warn('⚠️ [REDIS INIT WARN]: Fallo al instanciar Redis. Usando fallback en memoria:', e.message);
        redisExport = mockInstance;
    }
} else {
    console.warn('ℹ️ [REDIS INFO]: REDIS_URL no está configurada. Usando cliente en memoria local.');
    redisExport = mockInstance;
}

export const redis = redisExport;
