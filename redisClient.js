// redisClient.js - Instancia de Conexión Resiliente TLS / Fallback In-Memory para Dante OS
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

class InMemoryRedisMock {
    constructor() {
        this.store = new Map();
        this.sets = new Map();
        this.lists = new Map();
        this.hashes = new Map();
        console.log('⚡ [REDIS IN-MEMORY FALLBACK]: Activo almacenamiento volátil local.');
    }

    async get(key) {
        return this.store.get(key) ?? null;
    }

    async set(key, val, ..._args) {
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
            if (this.store.delete(k) || this.sets.delete(k) || this.lists.delete(k) || this.hashes.delete(k)) {
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

        const allKeys = [...this.store.keys(), ...this.sets.keys(), ...this.lists.keys(), ...this.hashes.keys()];
        let matched = allKeys;

        if (pattern) {
            const regexStr = pattern.replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexStr}$`);
            matched = allKeys.filter(k => regex.test(k));
        }

        return ['0', matched];
    }

    async lindex(key, index) {
        const list = this.lists.get(key);
        if (!list || list.length === 0) return null;
        const idx = index >= 0 ? index : list.length + index;
        return list[idx] ?? null;
    }

    async lpop(key) {
        const list = this.lists.get(key);
        if (!list || list.length === 0) return null;
        return list.shift() ?? null;
    }

    async rpop(key) {
        const list = this.lists.get(key);
        if (!list || list.length === 0) return null;
        return list.pop() ?? null;
    }

    async lpush(key, ...values) {
        if (!this.lists.has(key)) {
            this.lists.set(key, []);
        }
        const list = this.lists.get(key);
        for (const val of values) {
            list.unshift(String(val));
        }
        return list.length;
    }

    async rpush(key, ...values) {
        if (!this.lists.has(key)) {
            this.lists.set(key, []);
        }
        const list = this.lists.get(key);
        for (const val of values) {
            list.push(String(val));
        }
        return list.length;
    }

    async llen(key) {
        const list = this.lists.get(key);
        return list ? list.length : 0;
    }

    async lrange(key, start, stop) {
        const list = this.lists.get(key);
        if (!list) return [];
        const len = list.length;
        const s = start < 0 ? Math.max(0, len + start) : start;
        const e = stop < 0 ? Math.max(0, len + stop) : stop;
        if (s >= len) return [];
        return list.slice(s, e + 1);
    }

    async hget(key, field) {
        const h = this.hashes.get(key);
        if (!h) return null;
        return h.get(field) ?? null;
    }

    async hset(key, field, val) {
        if (!this.hashes.has(key)) {
            this.hashes.set(key, new Map());
        }
        const h = this.hashes.get(key);
        const isNew = !h.has(field);
        h.set(field, String(val));
        return isNew ? 1 : 0;
    }

    async hgetall(key) {
        const h = this.hashes.get(key);
        if (!h) return {};
        const obj = {};
        for (const [k, v] of h.entries()) {
            obj[k] = v;
        }
        return obj;
    }

    async hdel(key, ...fields) {
        const h = this.hashes.get(key);
        if (!h) return 0;
        let count = 0;
        for (const f of fields) {
            if (h.delete(f)) count++;
        }
        return count;
    }

    async exists(key) {
        return (this.store.has(key) || this.sets.has(key) || this.lists.has(key) || this.hashes.has(key)) ? 1 : 0;
    }

    async expire(_key, _seconds) {
        return 1;
    }

    async ttl(_key) {
        return -1;
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
        this.errorCount = 0;
        this.maxAllowedErrors = 3;
        this.isDisconnected = false;

        if (this.realRedis) {
            this.realRedis.on('connect', () => {
                this.isRealAvailable = true;
                this.errorCount = 0;
                console.log('🚀 [REDIS CACHE CONNECTED]: Conexión exitosa con el clúster Redis.');
            });
            this.realRedis.on('ready', () => {
                this.isRealAvailable = true;
                this.errorCount = 0;
            });
            this.realRedis.on('error', (err) => {
                this.isRealAvailable = false;
                this.errorCount++;
                const errMsg = String(err?.message || '').toUpperCase();

                console.warn(`🚨 [REDIS WARN / MÓDULO DEGRADADO] (Fallo ${this.errorCount}/${this.maxAllowedErrors}):`, err.message);

                // 🧹 DETECCIÓN DE ERRORES CRÍTICOS O LÍMITE DE REINTENTOS: Desconexión explícita para liberar Event Loop y RAM
                const isAuthError = errMsg.includes('WRONGPASS') || errMsg.includes('NOAUTH') || errMsg.includes('NOPERM') || errMsg.includes('AUTH');
                const isLimitReached = this.errorCount >= this.maxAllowedErrors;

                if ((isAuthError || isLimitReached) && !this.isDisconnected) {
                    this.isDisconnected = true;
                    console.warn('⚡ [REDIS FORCE DISCONNECT]: Cierre explícito de sockets para liberar el Event Loop de Node.js. Activando In-Memory Fallback.');
                    try {
                        this.realRedis.disconnect();
                    } catch {}
                }
            });
            this.realRedis.on('end', () => {
                this.isRealAvailable = false;
            });
            this.realRedis.on('close', () => {
                this.isRealAvailable = false;
            });
        }

        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target) {
                    const value = Reflect.get(target, prop, receiver);
                    if (typeof value === 'function') {
                        return value.bind(target);
                    }
                    return value;
                }

                return async (...args) => {
                    if (target.isRealAvailable && target.realRedis && typeof target.realRedis[prop] === 'function') {
                        try {
                            return await target.realRedis[prop](...args);
                        } catch (err) {
                            target.isRealAvailable = false;
                            console.warn(`🚨 [REDIS METHOD WARN]: Falló redis.${String(prop)}, utilizando fallback en memoria:`, err.message);
                        }
                    }

                    if (target.mockRedis && typeof target.mockRedis[prop] === 'function') {
                        return await target.mockRedis[prop](...args);
                    }

                    return null;
                };
            }
        });
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
                    console.warn('⚡ [REDIS RETRY STRATEGY]: Se alcanzó el límite máximo de reintentos (2). Suspendiendo reconexión.');
                    return null;
                }
                return Math.min(times * 100, 500);
            }
        };

        if (isTls) {
            const rejectUnauthorized = process.env.REDIS_REJECT_UNAUTHORIZED === 'false' ? false : (process.env.NODE_ENV === 'production');
            redisOptions.tls = { rejectUnauthorized };
        }

        const realRedis = new Redis(redisUrl, redisOptions);

        // 🚨 PREVENCIÓN CRÍTICA DE CRASH EN NODE: Registrar listener 'error' inmediatamente tras crear la instancia
        realRedis.on('error', (err) => {
            console.warn('⚠️ [REDIS WARN / EVENTO DE ERROR CAPTURADO]:', err.message);
        });

        realRedis.connect().catch((err) => {
            console.warn('⚠️ [REDIS CONNECT WARN]: No se pudo conectar a Redis. Operando con fallback in-memory:', err.message);
            try { realRedis.disconnect(); } catch {}
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
export default redisExport;
