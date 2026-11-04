// src/services/planService.js - Centralized Security & Plan Verification Service (Dante OS Enterprise)
import { supabase } from '../../supabaseClient.js';

/**
 * Verfica y retorna el plan validado y seguro del estudiante.
 * Comprueba tanto el token JWT / BD como la fecha de vencimiento.
 * 
 * @param {Object} req - Objeto Express Request
 * @param {string} studentIdClean - Identificador saneado del estudiante
 * @returns {Promise<{ plan: string, esPro: boolean, expirado: boolean, fechaVencimiento: string|null }>}
 */
export async function verificarPlanEstudianteSeguro(req, studentIdClean = null) {
    let planCandidato = 'EXPLORADOR';
    let fechaVencimiento = null;

    // 1. Extraer identificador del estudiante si no viene provisto
    const student = studentIdClean || req.user?.id || req.user?.email || req.body?.studentId || req.body?.student_id || 'estudiante_invitado';
    const cleanId = String(student).toLowerCase().trim().split('@')[0];

    // 2. Si el usuario viene autenticado en JWT req.user
    let planEnJwt = false;
    if (req.user) {
        if (req.user.user_plan || req.user.plan) {
            planCandidato = String(req.user.user_plan || req.user.plan).toUpperCase().trim();
            planEnJwt = true;
        }
        if (req.user.plan_vencimiento) {
            fechaVencimiento = req.user.plan_vencimiento;
        }
    }

    // 3. Consultar la base de datos Supabase si no se determinó en el JWT
    if (!planEnJwt && cleanId !== 'estudiante_invitado' && cleanId !== 'estudiante_demo') {
        try {
            let timer;
            const dbPromise = supabase
                .from('usuarios')
                .select('user_plan, plan_vencimiento, arquetipo')
                .or(`email.eq.${cleanId},document_id.eq.${cleanId}`)
                .maybeSingle();

            const timeoutPromise = new Promise(resolve => {
                timer = setTimeout(() => resolve({ data: null, error: 'DB_TIMEOUT' }), 800);
                if (timer && typeof timer.unref === 'function') timer.unref();
            });

            const { data } = await Promise.race([
                dbPromise.then(res => { clearTimeout(timer); return res; }).catch(() => ({ data: null })),
                timeoutPromise
            ]);

            if (data) {
                if (data.user_plan) {
                    planCandidato = String(data.user_plan).toUpperCase().trim();
                } else if (data.arquetipo && data.arquetipo.startsWith('PLAN_')) {
                    planCandidato = data.arquetipo.includes('SUPER') ? 'SUPER_PRO' : 'PRO';
                }
                if (data.plan_vencimiento) {
                    fechaVencimiento = data.plan_vencimiento;
                }
            }
        } catch (e) {
            console.warn("⚠️ [PLAN SERVICE]: No se pudo consultar plan en DB para:", cleanId, e.message);
        }
    }

    // 4. El plan solo sale de la base. No elevar por headers/body del cliente.

    // 5. Sanitizar candidato
    const candUpper = String(planCandidato).toUpperCase().trim();
    const esProCandidato = candUpper.includes('PRO') || candUpper.includes('SUPER') || candUpper.includes('MASTER');

    if (!esProCandidato) {
        return { plan: 'EXPLORADOR', esPro: false, expirado: false, fechaVencimiento: null };
    }

    // 6. Validar vigencia por fecha de vencimiento si existe
    if (fechaVencimiento) {
        const expTime = new Date(fechaVencimiento).getTime();
        if (!isNaN(expTime) && Date.now() > expTime) {
            // Plan VENCIDO -> Revertir automáticamente a FREE / EXPLORADOR
            return {
                plan: 'EXPLORADOR',
                esPro: false,
                expirado: true,
                fechaVencimiento
            };
        }
    }

    return {
        plan: candUpper.includes('SUPER') ? 'SUPER_PRO' : 'PRO',
        esPro: true,
        expirado: false,
        fechaVencimiento
    };
}
