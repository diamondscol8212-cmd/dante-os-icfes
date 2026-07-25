import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

const router = Router();
const SERVER_VERSION = "v21.0.0-ENTERPRISE_PRODUCTION";

// ====================================================================
// 🧠 MOTOR DE FUNCIONES CRIPTOGRÁFICAS PURAS DE DANTE OS (SHA-512 / 10K ITERACIONES)
// ====================================================================
function generarHashPassword(password, saltExistente = null) {
    const salt = saltExistente ? saltExistente.trim() : crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

// ====================================================================
// 🪐 ENDPOINT 1: REGISTRO DE USUARIOS CORPORATIVOS (SEED SEGURO)
// ====================================================================
router.post('/register-secure-user', async (req, res) => {
    try {
        const { email, password, rol, institution_id } = req.body;
        const tenantClean = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();
        const emailClean = String(email).toLowerCase().trim();

        if (!email || !password || !rol) {
            return res.status(400).json({ success: false, error: "Campos mandatorios ausentes." });
        }

        const { hash, salt } = generarHashPassword(password);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{
                email: emailClean, 
                password_hash: hash, 
                salt: salt,
                rol: rol.toLowerCase().trim(), 
                institution_id: tenantClean
            }]);

        if (error) throw error;

        return res.status(201).json({ success: true, message: `Usuario ${emailClean} registrado en T-${tenantClean} con éxito.` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ====================================================================
// 🪐 ENDPOINT 2: LOGIN DE PORTAL CON CONSULTA DE ARQUETIPO Y DIRECCIONAMIENTO INTELIGENTE
// ====================================================================
router.post('/login-perimetral', async (req, res) => {
    try {
        const { email, password, institution_id, role_target } = req.body;
        const tenantClean = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();
        const emailClean = String(email).toLowerCase().trim();

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Credenciales incompletas." });
        }

        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', emailClean)
            .eq('institution_id', tenantClean)
            .maybeSingle();

        if (error || !usuario) {
            return res.status(401).json({ success: false, error: "Acceso denegado: Credenciales no válidas para esta institución." });
        }

        const saltLimpio = String(usuario.salt || "").trim();
        const hashAlmacenado = String(usuario.password_hash || "").trim();

        const { hash } = generarHashPassword(password, saltLimpio);
        const hashCalculado = hash.trim();

        // 🛡️ PARCHE DE BLINDAJE INDUSTRIAL CONTRA TIMING ATTACKS
        const bufferCalculado = Buffer.from(hashCalculado, 'hex');
        const bufferAlmacenado = Buffer.from(hashAlmacenado, 'hex');

        if (bufferCalculado.length !== bufferAlmacenado.length || !crypto.timingSafeEqual(bufferCalculado, bufferAlmacenado)) {
            console.log("❌ [DANTE SEGURIDAD]: Intento de autenticación denegado por fallo de hash.");
            return res.status(401).json({ success: false, error: "Acceso denegado: Contraseña incorrecta." });
        }

        const userRole = (role_target || usuario.rol || 'estudiante').toLowerCase().trim();
        const sessionToken = crypto.randomBytes(24).toString('hex');

        // 🔍 CONSULTA DE ARQUETIPO INICIAL EN SUPABASE
        let arquetipoRegistrado = null;
        if (userRole === 'estudiante') {
            try {
                const { data: arquetipoData } = await supabase
                    .from('dante_arquetipos_iniciales')
                    .select('arquetipo')
                    .or(`id_sesion.eq.${emailClean},id_sesion.eq.${sessionToken}`)
                    .maybeSingle();

                if (arquetipoData && arquetipoData.arquetipo) {
                    arquetipoRegistrado = arquetipoData.arquetipo;
                }
            } catch (dbErr) {
                console.warn("⚠️ [AUTH] Sin arquetipo registrado previamente:", dbErr.message);
            }
        }

        // 🎯 LÓGICA DE REDIRECCIÓN DINÁMICA
        let rutaRedireccion = '/index.html';
        if (userRole === 'rector') {
            rutaRedireccion = '/rector.html';
        } else if (userRole === 'profesor') {
            rutaRedireccion = '/profesor.html';
        } else if (userRole === 'estudiante' && !arquetipoRegistrado) {
            rutaRedireccion = '/onboarding.html';
        }

        return res.status(200).json({
            success: true,
            message: "Autenticación perimetral exitosa.",
            token_session: sessionToken,
            user: { 
                email: usuario.email, 
                rol: userRole, 
                institution_id: usuario.institution_id,
                arquetipo: arquetipoRegistrado 
            },
            redireccion: rutaRedireccion,
            version: SERVER_VERSION
        });

    } catch (err) {
        console.error("🚨 [CONTROL CRÍTICO DE AUTENTICACIÓN]:", err.message);
        return res.status(500).json({ success: false, error: "Fallo en los firewalls de autenticación analítica." });
    }
});

export default router;
