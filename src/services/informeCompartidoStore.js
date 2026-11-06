import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.join(__dirname, '..', '..', 'data', 'informes-compartidos');
const TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 días
const MAX_BODY = 120000;

function asegurarDir() {
    try {
        fs.mkdirSync(STORE_DIR, { recursive: true });
    } catch (e) {}
}

function idSeguro() {
    return crypto.randomBytes(5).toString('base64url').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 8);
}

function rutaArchivo(id) {
    const limpio = String(id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24);
    if (!limpio) return null;
    return path.join(STORE_DIR, limpio + '.json');
}

function limpiarViejos() {
    try {
        asegurarDir();
        const ahora = Date.now();
        const archivos = fs.readdirSync(STORE_DIR);
        archivos.forEach((nombre) => {
            if (!nombre.endsWith('.json')) return;
            const full = path.join(STORE_DIR, nombre);
            try {
                const raw = fs.readFileSync(full, 'utf8');
                const data = JSON.parse(raw);
                const created = Number(data && data.createdAt) || 0;
                if (created && (ahora - created) > TTL_MS) fs.unlinkSync(full);
            } catch (e) {}
        });
    } catch (e) {}
}

export function guardarInformeCompartido(snap) {
    if (!snap || typeof snap !== 'object') {
        const err = new Error('Snapshot inválido');
        err.status = 400;
        throw err;
    }
    const texto = JSON.stringify(snap);
    if (texto.length > MAX_BODY) {
        const err = new Error('Informe demasiado grande');
        err.status = 413;
        throw err;
    }
    asegurarDir();
    limpiarViejos();

    let id = idSeguro();
    let intentos = 0;
    while (intentos < 6) {
        const file = rutaArchivo(id);
        if (file && !fs.existsSync(file)) {
            const payload = {
                id,
                createdAt: Date.now(),
                expiresAt: Date.now() + TTL_MS,
                snap
            };
            fs.writeFileSync(file, JSON.stringify(payload), 'utf8');
            return { id, expiresAt: payload.expiresAt };
        }
        id = idSeguro();
        intentos += 1;
    }
    const err = new Error('No se pudo crear el enlace corto');
    err.status = 500;
    throw err;
}

export function leerInformeCompartido(id) {
    const file = rutaArchivo(id);
    if (!file || !fs.existsSync(file)) return null;
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        const created = Number(data && data.createdAt) || 0;
        const expires = Number(data && data.expiresAt) || (created + TTL_MS);
        if (expires && Date.now() > expires) {
            try { fs.unlinkSync(file); } catch (e) {}
            return null;
        }
        return data && data.snap ? data.snap : null;
    } catch (e) {
        return null;
    }
}
