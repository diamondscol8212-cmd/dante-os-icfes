import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

const router = Router();
const SERVER_VERSION = "v21.1.0-ENTERPRISE_PRODUCTION";

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
// 🪐 ENDPOINT 2: LOGIN DE PORTAL CON DUAL-IDENTIFIER (EMAIL O DOCUMENTO TI/CC)
// ====================================================================
router.post('/login-perimetral', async (req, res) => {
    try {
        const { email, identity, password, institution_id, role_target } = req.body;
        const tenantClean = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();
        const rawIdentifier = String(identity || email || "").trim();
        const identifierClean = rawIdentifier.toLowerCase();

        if (!identifierClean || !password) {
            return res.status(400).json({ success: false, error: "Credenciales incompletas." });
        }

        let usuario = null;
        let queryError = null;

        // Si contiene '@', buscar directamente por email
        if (identifierClean.includes('@')) {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', identifierClean)
                .eq('institution_id', tenantClean)
                .maybeSingle();
            usuario = data;
            queryError = error;
        } else {
            // Es un número de documento (TI / CC) o alias: buscar por document_id o email
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .or(`document_id.eq.${identifierClean},email.eq.${identifierClean}`)
                .eq('institution_id', tenantClean)
                .maybeSingle();
            usuario = data;
            queryError = error;
        }

        if (queryError || !usuario) {
            return res.status(401).json({ success: false, error: "Acceso denegado: Credenciales no válidas o usuario no registrado para esta institución." });
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
        const studentAlias = usuario.email ? usuario.email.split('@')[0] : (usuario.document_id || identifierClean);

        // 🔍 CONSULTA DEFENSIVA MULTI-TABLA DE ARQUETIPO Y ESTADO DE ONBOARDING EN SUPABASE
        let arquetipoRegistrado = usuario.arquetipo || null;
        let esOnboardingCompletadoEnDB = usuario.onboarding_completed === true || Boolean(usuario.arquetipo);

        if (userRole === 'estudiante' && !esOnboardingCompletadoEnDB) {
            try {
                const searchEmail = usuario.email || `${studentAlias}@danteos.edu.co`;
                const searchDoc = usuario.document_id || studentAlias;

                // 1. Consultar dante_arquetipos_iniciales
                const { data: arquetipoData } = await supabase
                    .from('dante_arquetipos_iniciales')
                    .select('arquetipo')
                    .or(`id_sesion.eq.${searchEmail},id_sesion.eq.${searchDoc}`)
                    .maybeSingle();

                if (arquetipoData && arquetipoData.arquetipo) {
                    arquetipoRegistrado = arquetipoData.arquetipo;
                    esOnboardingCompletadoEnDB = true;
                } else {
                    // 2. Consultar progreso_estudiantes
                    const { data: progData } = await supabase
                        .from('progreso_estudiantes')
                        .select('arquetipo')
                        .or(`estudiante.eq.${studentAlias},estudiante_id.eq.${studentAlias},estudiante.eq.${searchEmail}`)
                        .maybeSingle();

                    if (progData && progData.arquetipo) {
                        arquetipoRegistrado = progData.arquetipo;
                        esOnboardingCompletadoEnDB = true;
                    }
                }

                // Si se confirmó en otra tabla, actualizar defensivamente la fila en usuarios
                if (esOnboardingCompletadoEnDB) {
                    await supabase
                        .from('usuarios')
                        .update({
                            onboarding_completed: true,
                            arquetipo: arquetipoRegistrado
                        })
                        .eq('email', usuario.email);
                }
            } catch (dbErr) {
                console.warn("⚠️ [AUTH] Sin arquetipo registrado previamente:", dbErr.message);
            }
        }

        const onboardingCompletado = esOnboardingCompletadoEnDB;

        // 🎯 LÓGICA DE REDIRECCIÓN DINÁMICA
        let rutaRedireccion = 'index.html';
        if (userRole === 'rector') {
            rutaRedireccion = 'rector.html';
        } else if (userRole === 'profesor') {
            rutaRedireccion = 'profesor.html';
        } else if (userRole === 'estudiante' && !onboardingCompletado) {
            rutaRedireccion = 'onboarding.html';
        }

        return res.status(200).json({
            success: true,
            message: "Autenticación perimetral exitosa.",
            token_session: sessionToken,
            user: { 
                email: usuario.email || `${identifierClean}@danteos.edu.co`, 
                document_id: usuario.document_id || (identifierClean.includes('@') ? null : identifierClean),
                estudiante: studentAlias,
                role: userRole,
                rol: userRole, 
                institution_id: usuario.institution_id,
                arquetipo: arquetipoRegistrado || usuario.arquetipo || null,
                onboarding_completed: onboardingCompletado
            },
            redireccion: rutaRedireccion,
            version: SERVER_VERSION
        });

    } catch (err) {
        console.error("🚨 [CONTROL CRÍTICO DE AUTENTICACIÓN]:", err.message);
        return res.status(500).json({ success: false, error: "Fallo en los firewalls de autenticación analítica." });
    }
});

// ====================================================================
// 🪐 ENDPOINT 3: COMPLETACIÓN DEFINITIVA DE ONBOARDING (REGISTRO EN BD)
// ====================================================================
router.post('/complete-onboarding', async (req, res) => {
    try {
        const { studentId, email, arquetipo, datos_onboarding, institution_id } = req.body;
        const tenantClean = String(institution_id || "colegio_sandbox_default").toLowerCase().trim();
        const rawEmail = email || (studentId && studentId.includes('@') ? studentId : `${studentId || 'estudiante'}@danteos.edu.co`);
        const emailClean = String(rawEmail).toLowerCase().trim();
        const studentAlias = String(studentId || emailClean.split('@')[0]).toLowerCase().trim();
        const arquetipoNombre = arquetipo || "Estratega Reflexivo S2";

        console.log(`📝 [ONBOARDING BACKEND]: Guardando completación para ${studentAlias} (${emailClean})...`);

        // 1. Actualizar usuarios
        try {
            await supabase
                .from('usuarios')
                .update({
                    onboarding_completed: true,
                    arquetipo: arquetipoNombre,
                    datos_onboarding: datos_onboarding || {}
                })
                .or(`email.eq.${emailClean},email.eq.${studentAlias}@danteos.edu.co,document_id.eq.${studentAlias}`);
        } catch (e) {
            console.warn("⚠️ Error actualizando usuarios:", e.message);
        }

        // 2. Upsert en dante_arquetipos_iniciales
        try {
            await supabase
                .from('dante_arquetipos_iniciales')
                .upsert({
                    id_sesion: emailClean,
                    arquetipo: arquetipoNombre,
                    datos_psicometricos: datos_onboarding || {},
                    creado_en: new Date().toISOString()
                }, { onConflict: 'id_sesion' });
        } catch (e) {
            console.warn("⚠️ Error en dante_arquetipos_iniciales:", e.message);
        }

        // 3. Upsert en progreso_estudiantes
        try {
            await supabase
                .from('progreso_estudiantes')
                .upsert({
                    estudiante: studentAlias,
                    estudiante_id: studentAlias,
                    institution_id: tenantClean,
                    arquetipo: arquetipoNombre,
                    materia: 'lectura_critica',
                    ultima_actualizacion: new Date().toISOString()
                }, { onConflict: 'estudiante,materia,institution_id' });
        } catch (e) {
            console.warn("⚠️ Error en progreso_estudiantes:", e.message);
        }

        return res.status(200).json({ 
            success: true, 
            message: "Onboarding guardado exitosamente en la base de datos real." 
        });
    } catch (err) {
        console.error("🚨 Error completando onboarding en backend:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
