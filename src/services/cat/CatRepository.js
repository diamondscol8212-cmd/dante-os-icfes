// CatRepository.js - Capa de Persistencia, Caché LRU, Redlock y Auditoría Inmutable (Dante OS v21.2.0)
import crypto from 'crypto';
import { supabase } from '../../../supabaseClient.js';
import { redis } from '../../../redisClient.js';

/**
 * 🧹 LRUCache: Caché de Memoria RAM con Desalojo por Uso Reciente (LRU) y Límite de Entradas
 * Evita saturación de RAM en servidores mediante un límite máximo de llaves en memoria.
 */
export class LRUCache {
    constructor(maxSize = 1000) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return undefined;
        const value = this.cache.get(key);
        // Refresh position (mark as recently used)
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Evict oldest item (first key in map)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }
}

/**
 * 🔒 ATOMIC REDLOCK: Bloqueo distribuido en Redis para transacciones multiusuario
 */
export async function acquireRedlock(lockKey, ttlMs = 2000) {
    const lockValue = crypto.randomUUID();
    try {
        // SET key lockValue NX PX ttlMs
        const result = await redis.set(`dante:lock:${lockKey}`, lockValue, 'PX', ttlMs, 'NX');
        if (result === 'OK') {
            return lockValue;
        }
    } catch (err) {
        console.warn(`⚠️ [REDLOCK WARN] Error intentando adquirir lock ${lockKey}:`, err.message);
    }
    return null; // Lock no adquirido
}

export async function releaseRedlock(lockKey, lockValue) {
    if (!lockValue) return;
    try {
        const luaScript = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;
        await redis.eval(luaScript, 1, `dante:lock:${lockKey}`, lockValue);
    } catch (err) {
        console.warn(`⚠️ [REDLOCK WARN] Error liberando lock ${lockKey}:`, err.message);
    }
}

/**
 * 📜 AUDITORÍA INMUTABLE LEDGER (APPEND-ONLY): Trazabilidad inviolable con firma HASH SHA-256
 */
export async function registrarSnapshotLedgerInmutable(payload) {
    const { studentId, areaGeneral, stateSnapshot, previousHash = 'GENESIS_BLOCK_0000' } = payload;
    const timestampIso = new Date().toISOString();
    
    const stringParaHash = `${studentId}:${areaGeneral}:${JSON.stringify(stateSnapshot)}:${timestampIso}:${previousHash}`;
    const hashSignature = crypto.createHash('sha256').update(stringParaHash).digest('hex');

    const ledgerEntry = {
        student_id: studentId,
        area_general: areaGeneral,
        state_snapshot: stateSnapshot,
        previous_hash: previousHash,
        hash_signature: hashSignature,
        created_at: timestampIso
    };

    try {
        const { error } = await supabase
            .from('auditoria_psicometrica_ledger')
            .insert([ledgerEntry]);

        if (error) {
            // Fallback resiliente si la tabla no existe o falla red: guardar en Redis append-only
            await redis.rpush(`dante:ledger:${studentId}:${areaGeneral}`, JSON.stringify(ledgerEntry));
        }
    } catch (err) {
        console.warn("⚠️ [LEDGER APPEND WARN]: Guardando entry en cola local de auditoría Redis:", err.message);
        await redis.rpush(`dante:ledger:${studentId}:${areaGeneral}`, JSON.stringify(ledgerEntry)).catch(() => {});
    }

    return hashSignature;
}

/**
 * 🚨 DEAD LETTER QUEUE (DLQ) & RESILIENT PERSISTENCE
 * Si la base de datos principal rechaza el upsert, envía a DLQ para procesamiento asíncrono garantizado.
 */
export async function persistirProgresoResiliente(payloadPersistencia) {
    try {
        const { error: upsertErr } = await supabase
            .from('progreso_estudiantes')
            .upsert(payloadPersistencia, { onConflict: 'estudiante,materia,institution_id' });

        if (upsertErr) {
            console.warn("⚠️ [SUPABASE UPSERT RETRY]: Intentando insert secundario...");
            const { error: insertErr } = await supabase
                .from('progreso_estudiantes')
                .insert([payloadPersistencia]);

            if (insertErr) {
                throw new Error(`Falló persistencia Supabase: ${insertErr.message}`);
            }
        }
        return { success: true, method: 'DIRECT_SUPABASE' };
    } catch (err) {
        console.error("🚨 [DLQ DETONADO] Error guardando progreso en Supabase. Registrando en Dead Letter Queue:", err.message);
        
        const dlqEntry = {
            id: crypto.randomUUID(),
            payload: payloadPersistencia,
            failed_at: new Date().toISOString(),
            error_reason: err.message
        };

        await redis.rpush('dante:dlq:failed_upserts', JSON.stringify(dlqEntry));
        return { success: false, method: 'DLQ_DISPATCHED', dlqId: dlqEntry.id };
    }
}

