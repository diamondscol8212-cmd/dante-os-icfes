// public/js/danteStorage.js - Centralized Defensive Storage & Logger Utility (Dante OS v23.1.0-ENTERPRISE)
// Bogotá, Colombia

class DanteStorage {
    /**
     * Obtiene un valor sanitizado desde localStorage con fallback defensivo
     * @param {string} key 
     * @param {*} defaultValue 
     */
    static get(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null || raw === undefined) return defaultValue;
            try {
                return JSON.parse(raw);
            } catch (e) {
                return raw; // Retorna el string sin procesar si no es JSON válido
            }
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.warn(`[DanteStorage.get] Error al leer la clave "${key}":`, err);
            }
            return defaultValue;
        }
    }

    /**
     * Guarda un valor en localStorage previniendo desbordamiento de cuota o excepciones
     * @param {string} key 
     * @param {*} value 
     */
    static set(key, value) {
        try {
            const stringified = (typeof value === 'object' && value !== null) ? JSON.stringify(value) : String(value);
            localStorage.setItem(key, stringified);
            return true;
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.error(`[DanteStorage.set] Excepción al escribir la clave "${key}":`, err);
            }
            return false;
        }
    }

    /**
     * Elimina de forma segura una clave en localStorage
     * @param {string} key 
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.warn(`[DanteStorage.remove] Error al eliminar clave "${key}":`, err);
            }
            return false;
        }
    }

    /**
     * Limpia el almacenamiento manteniendo copias de respaldo de claves críticas
     * @param {Array<string>} keysToKeep 
     */
    static clearWithBackup(keysToKeep = [
        'dante_session', 'dante_token', 'dante_jwt', 'dante_session_token', 'dante_user', 'dante_plan', 'dante_user_plan', 'dante_vidas',
        'dante_pacto_accepted', 'dante_pacto_meta', 'dante_pacto_tiempo', 'dante_pacto_calendario',
        'dante_pacto_fecha_texto', 'dante_pacto_dias_restantes', 'dante_pacto_viabilidad',
        'dante_pacto_fecha', 'dante_student_name', 'dante_student_id', 'dante_active_student', 'dante_onboarding_completed'
    ]) {
        try {
            const backups = {};
            keysToKeep.forEach(k => {
                const val = localStorage.getItem(k);
                if (val !== null) backups[k] = val;
            });
            localStorage.clear();
            Object.keys(backups).forEach(k => {
                localStorage.setItem(k, backups[k]);
            });
            return true;
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.error('[DanteStorage.clearWithBackup] Fallo al reiniciar almacenamiento con backup:', err);
            }
            return false;
        }
    }

    /**
     * Obtiene el objeto unificado de sesión
     */
    static getSession() {
        try {
            const raw = localStorage.getItem('dante_session');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && (parsed.token || parsed.user?.estudiante || parsed.user?.email)) {
                    return parsed;
                }
            }
            const activeStudent = localStorage.getItem('dante_active_student');
            const jwt = localStorage.getItem('dante_jwt');
            const userRaw = localStorage.getItem('dante_user');
            if (activeStudent || jwt || userRaw) {
                const userObj = userRaw ? JSON.parse(userRaw) : {
                    estudiante: activeStudent,
                    nombre: localStorage.getItem('dante_student_name') || activeStudent,
                    plan: localStorage.getItem('dante_user_plan') || 'EXPLORADOR'
                };
                const pactoAccepted = localStorage.getItem('dante_pacto_accepted') === 'true' || localStorage.getItem('dante_onboarding_completed') === 'true';
                return DanteStorage.setSession({ token: jwt || '', user: userObj, pacto_accepted: pactoAccepted });
            }
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.warn('[DanteStorage.getSession] Error al obtener sesión:', err);
            }
        }
        return null;
    }

    /**
     * Guarda el objeto unificado dante_session y sincroniza claves secundarias
     */
    static setSession(sessionObj) {
        try {
            const user = sessionObj.user || {};
            const finalToken = sessionObj.token || localStorage.getItem('dante_token') || `dante_token_${Date.now()}`;
            const pactoAccepted = Boolean(sessionObj.pacto_accepted || user.onboarding_completed);

            const session = {
                token: finalToken,
                user: user,
                pacto_accepted: pactoAccepted,
                created_at: sessionObj.created_at || new Date().toISOString()
            };

            localStorage.setItem('dante_session', JSON.stringify(session));
            localStorage.setItem('dante_token', finalToken);
            localStorage.setItem('dante_jwt', finalToken);
            localStorage.setItem('dante_session_token', finalToken);

            if (user) {
                const studentId = user.estudiante || user.email?.split('@')[0] || 'estudiante';
                localStorage.setItem('dante_active_student', studentId);
                localStorage.setItem('dante_student_id', studentId);
                localStorage.setItem('dante_student_name', user.nombre || studentId);
                localStorage.setItem('dante_user_plan', user.plan || 'EXPLORADOR');
                localStorage.setItem('dante_user', JSON.stringify(user));
            }
            try {
                const viva = {
                    token: finalToken,
                    user: user || {},
                    pacto: pactoAccepted,
                    creada: Date.now()
                };
                sessionStorage.setItem('dante_sesion_viva', JSON.stringify(viva));
                if (typeof window !== 'undefined') window.__danteSesion = viva;
            } catch (e) {}
            if (pactoAccepted) {
                localStorage.setItem('dante_pacto_accepted', 'true');
                localStorage.setItem('dante_onboarding_completed', 'true');
            }
            return session;
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.error('[DanteStorage.setSession] Error al guardar sesión:', err);
            }
            return null;
        }
    }

    /**
     * Purga higiénica total de memoria residual de cliente para prevenir contaminación entre sesiones
     */
    static purgarMemoriaResidualCliente() {
        try {
            localStorage.clear();
            sessionStorage.clear();
            if (typeof caches !== 'undefined' && caches && caches.keys) {
                caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
            }
            if (typeof window !== 'undefined') {
                if (window.danteHubEngine) {
                    window.danteHubEngine.misionActual = null;
                }
                if (window.AppState) {
                    window.AppState = {};
                }
            }
            return true;
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.warn('[DanteStorage.purgarMemoriaResidualCliente] Error al purgar memoria:', err);
            }
            return false;
        }
    }

    /**
     * Logout explícito y voluntario
     */
    static async recuperarSesion() {
        try {
            const resp = await fetch('/api/auth/sesion', { credentials: 'include' });
            if (!resp.ok) return null;
            const data = await resp.json();
            if (!data || data.ok !== true || !data.user) return null;
            const hecho = localStorage.getItem('dante_onboarding_completed') === 'true';
            data.user.onboarding_completed = hecho;
            return DanteStorage.setSession({
                token: data.token || '',
                user: data.user,
                pacto_accepted: hecho
            });
        } catch (err) {
            return null;
        }
    }

    static logout() {
        try {
            DanteStorage.purgarMemoriaResidualCliente();
            window.location.href = 'login.html';
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.error('[DanteStorage.logout] Error en procedimiento de logout:', err);
            }
        }
    }
}

class DanteLogger {
    static isProd = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production');

    static log(...args) {
        if (!DanteLogger.isProd) {
            console.log('🤖 [DANTE OS]', ...args);
        }
    }

    static info(...args) {
        if (!DanteLogger.isProd) {
            console.info('ℹ️ [DANTE OS]', ...args);
        }
    }

    static warn(...args) {
        console.warn('⚠️ [DANTE OS WARN]', ...args);
    }

    static error(...args) {
        console.error('🚨 [DANTE OS ERROR]', ...args);
    }
}

// Exportación global para entorno navegador
if (typeof window !== 'undefined') {
    window.DanteStorage = DanteStorage;
    window.DanteLogger = DanteLogger;
    window.purgarMemoriaResidualCliente = DanteStorage.purgarMemoriaResidualCliente;
}
