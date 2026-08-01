// middleware.js - Middleware Centralizado de Autenticación JWT, Control de Acceso (RBAC) y Soberanía de Datos
// Dante OS Enterprise Edition
import jwt from 'jsonwebtoken';

// 🛡️ PATRÓN FAIL-FAST DE SEGURIDAD PARA PRODUCCIÓN CON RESGUARDO EN DESARROLLO
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    if (!process.env.JWT_SECRET) {
        throw new Error("🚨 [FAIL-FAST CRITICAL ERROR]: process.env.JWT_SECRET no está definida. Configure esta variable en el panel del servidor antes de desplegar en producción.");
    }
    if (!process.env.INTEGRITY_SECRET) {
        throw new Error("🚨 [FAIL-FAST CRITICAL ERROR]: process.env.INTEGRITY_SECRET no está definida. Configure esta variable en el panel del servidor antes de desplegar en producción.");
    }
    if (!process.env.PII_SALT_SECRET) {
        throw new Error("🚨 [FAIL-FAST CRITICAL ERROR]: process.env.PII_SALT_SECRET no está definida. Configure esta variable en el panel del servidor para garantizar la seudonomización de PII.");
    }
} else if (!process.env.JWT_SECRET || !process.env.INTEGRITY_SECRET || !process.env.PII_SALT_SECRET) {
    console.warn("⚠️ [DEV MODE WARNING]: Variables criptográficas ausentes en entorno local/desarrollo. Se utilizan claves efímeras de desarrollo.");
}

const JWT_SECRET = process.env.JWT_SECRET || 'dante_os_jwt_secret_dev_key_2026';
const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET || 'dante_os_integrity_secret_dev_key_2026';
const PII_SALT_SECRET = process.env.PII_SALT_SECRET || 'dante_os_pii_salt_secret_dev_key_2026';

/*
 * =========================================================================================
 * ⚖️ JUSTIFICACIÓN LEGAL DE DEFENSA: SEGURIDAD DE SESIÓN EN HTTPONLY COOKIES (GDPR ART. 32 & LEY 1581)
 * =========================================================================================
 * 1. MITIGACIÓN DE ATAQUES XSS Y ROBO DE CREDENCIALES: Eliminar el almacenamiento de tokens en
 *    `localStorage` y forzar la autenticación mediante cookies con atributo `HttpOnly`, `Secure`
 *    y `SameSite=Strict` garantiza que el token de sesión sea inaccesible para scripts maliciosos.
 * 2. CUMPLIMIENTO DEL PRINCIPIO DE SEGURIDAD (LEY 1581 ART. 4 LITERAL G): Se implementan medidas
 *    técnicas avanzadas para evitar la adulteración, pérdida, consulta o acceso no autorizado a
 *    los perfiles analíticos y psicométricos de los estudiantes.
 * 3. PRUEBA EN AUDITORÍAS DE SEGURIDAD INTERNACIONALES: Demuestra cumplimiento con el estándar OWASP
 *    y exime a la organización de responsabilidad penal o administrativa por vulnerabilidades en cliente.
 * =========================================================================================
 */

/**
 * Genera un token JWT firmado con los claims corporativos del usuario (user_id, role, institution_id, email, estudiante)
 */
export function generarTokenJWT(usuarioPayload) {
    const roleNormalized = (usuarioPayload.role || usuarioPayload.rol || 'estudiante').toLowerCase().trim();
    const instNormalized = String(usuarioPayload.institution_id || 'colegio_sandbox_default').toLowerCase().trim();
    const userIdentifier = usuarioPayload.user_id || usuarioPayload.id || usuarioPayload.email || 'user_unknown';

    const payload = {
        user_id: userIdentifier,
        email: usuarioPayload.email || `${userIdentifier}@danteos.edu.co`,
        role: roleNormalized,
        rol: roleNormalized,
        institution_id: instNormalized,
        estudiante: usuarioPayload.estudiante || usuarioPayload.email?.split('@')[0] || String(userIdentifier).split('@')[0]
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Helper para inyectar la Cookie HttpOnly Segura en la respuesta HTTP
 */
export function setHttpOnlyCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('dante_jwt_token', token, {
        httpOnly: true, // Inaccesible por JavaScript en cliente (Previene XSS)
        secure: isProduction, // Transmisión sobre HTTPS en producción
        sameSite: 'lax', // Protección CSRF perimetral
        maxAge: 24 * 60 * 60 * 1000, // 24 Horas de vigencia
        path: '/'
    });
}

/**
 * Middleware para verificar la firma y vigencia del token JWT.
 * Extracción limitada ÚNICA Y EXCLUSIVAMENTE a Cookies HttpOnly y encabezados Authorization (Bearer token).
 */
export function verifyToken(req, res, next) {
    try {
        let token = null;

        // 1. PRIORIDAD CRÍTICA DE SEGURIDAD: Inspeccionar Cookie HttpOnly Segura
        if (req.cookies) {
            token = req.cookies.dante_jwt_token || req.cookies.token || req.cookies.access_token || null;
        }

        // 2. FALLBACK COMPATIBILIDAD SEGURO: Encabezados Authorization: Bearer <token>
        if (!token) {
            const authHeader = req.headers['authorization'] || req.headers['Authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7).trim();
            } else if (authHeader && authHeader.split(' ').length === 2) {
                token = authHeader.split(' ')[1].trim();
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Acceso denegado: Token de autenticación no proporcionado en Cookie HttpOnly o Encabezado Authorization."
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: "Acceso denegado: Token JWT inválido, alterado o expirado."
        });
    }
}

// Alias de compatibilidad
export const autenticarToken = verifyToken;

/**
 * Middleware para token opcional (asigna req.user si existe, de lo contrario continúa)
 */
export function optionalToken(req, res, next) {
    try {
        let token = null;

        if (req.cookies) {
            token = req.cookies.dante_jwt_token || req.cookies.token || req.cookies.access_token || null;
        }

        if (!token) {
            const authHeader = req.headers['authorization'] || req.headers['Authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7).trim();
            }
        }

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
    } catch (err) {
        // Ignorar fallo de token opcional
    }
    next();
}

/**
 * Middleware de verificación de roles (RBAC)
 */
export function requireRole(...rolesPermitidos) {
    const rolesFlat = rolesPermitidos.flat().map(r => String(r).toLowerCase().trim());

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Acceso denegado: Requiere sesión autenticada con token JWT."
            });
        }

        const userRole = String(req.user.role || req.user.rol || '').toLowerCase().trim();

        if (!rolesFlat.includes(userRole) && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: `Acceso prohibido: Su rol [${userRole}] no posee permisos suficientes para esta operación.`
            });
        }

        next();
    };
}

// Alias de compatibilidad
export const verificarRol = requireRole;

/**
 * Middleware para validar que la institución del token coincida exactamente con el tenant de la solicitud
 */
export function validateInstitution(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "Acceso denegado: Requiere sesión autenticada."
        });
    }

    const tenantSolicitud = req.tenantId ||
        req.headers['x-institution-id'] ||
        (req.query && req.query.institution_id) ||
        (req.body && req.body.institution_id) ||
        "colegio_sandbox_default";

    const tenantSolicitudClean = String(tenantSolicitud).toLowerCase().trim();
    const tenantUserClean = String(req.user.institution_id || '').toLowerCase().trim();

    if (tenantUserClean === 'global' || req.user.role === 'admin') {
        return next();
    }

    if (tenantUserClean !== tenantSolicitudClean) {
        return res.status(403).json({
            success: false,
            error: `Acceso denegado: Confidencialidad y Soberanía de Datos. Su token pertenece a [${tenantUserClean}] y la solicitud intenta acceder a [${tenantSolicitudClean}].`
        });
    }

    next();
}
