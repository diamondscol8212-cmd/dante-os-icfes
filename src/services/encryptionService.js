// src/services/encryptionService.js
// Dante OS Enterprise Edition - Módulo Criptográfico de Cifrado en Reposo AES-256-GCM
import crypto from 'crypto';

/*
 * =========================================================================================
 * ⚖️ JUSTIFICACIÓN LEGAL DE DEFENSA: CIFRADO EN REPOSO AES-256-GCM (GDPR ART. 32 & LEY 1581 ART. 6)
 * =========================================================================================
 * 1. PROTECCIÓN DE DATOS SENSIBLES: El Perfil Psicométrico, ADN Cognitivo y métricas de vacilación
 *    constituyen datos sensibles bajo el Art. 6 de la Ley 1581 de 2012 y Art. 9 del GDPR.
 * 2. EXENCIÓN DE NOTIFICACIÓN DE BRECHAS (GDPR ART. 34.3a): En caso de filtración de la base de datos
 *    o acceso no autorizado a los discos de almacenamiento, los datos cifrados con AES-256-GCM
 *    resultan ininteligibles e inútiles para atacantes sin la clave criptográfica maestra, lo cual
 *    exime a Dante OS de sanciones gravosas de la SIC y de la obligación de notificaciones masivas de pánico.
 * 3. INTEGRIDAD Y AUTENTICIDAD CRIPTOGRÁFICA: El modo GCM (Galois/Counter Mode) proporciona un
 *    Tag de Autenticación de 128 bits que garantiza que los registros no hayan sido alterados
 *    ni manipulados maliciosamente en la base de datos.
 * =========================================================================================
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits para AES-GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

// Clave maestra derivada de variable de entorno
const MASTER_SECRET = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;
if (!MASTER_SECRET) {
    throw new Error("🚨 [FAIL-FAST CRITICAL ERROR]: Ni process.env.ENCRYPTION_KEY ni process.env.JWT_SECRET están definidas para el motor de cifrado AES-256-GCM.");
}
const ENCRYPTION_KEY = crypto.createHash('sha256').update(MASTER_SECRET).digest();

/**
 * Cifra un objeto o cadena de datos sensibles (ADN Cognitivo, Respuestas Psicométricas, Perfil)
 * @param {Object|string} data 
 * @returns {string} Cadena en formato hexadecimal: iv:authTag:encryptedData
 */
export function cifrarDatosSensibles(data) {
    if (data === null || data === undefined) return null;
    
    try {
        const textToEncrypt = typeof data === 'object' ? JSON.stringify(data) : String(data);
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        
        let encrypted = cipher.update(textToEncrypt, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        
        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (error) {
        console.error("🚨 [CRYPTO ERROR] Fallo al cifrar datos sensibles en reposo:", error.message);
        throw new Error("Error en el motor criptográfico de protección de datos en reposo.");
    }
}

/**
 * Descifra una cadena de datos sensibles almacenada en la base de datos
 * @param {string} encryptedString Cadena en formato iv:authTag:encryptedData
 * @returns {Object|string} Objeto o cadena original descifrada
 */
export function descifrarDatosSensibles(encryptedString) {
    if (!encryptedString || typeof encryptedString !== 'string') return encryptedString;
    if (!encryptedString.includes(':')) return encryptedString; // Si no está cifrado, retorna sin modificar

    try {
        const parts = encryptedString.split(':');
        if (parts.length !== 3) return encryptedString;

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encryptedText = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch (error) {
        console.warn("⚠️ [CRYPTO WARNING] No se pudo descifrar el registro (posible dato legible legacy o clave alterada):", error.message);
        return encryptedString;
    }
}

export default {
    cifrarDatosSensibles,
    descifrarDatosSensibles
};
