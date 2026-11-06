// public/js/streakManager.js - Gestor de Racha de Días Real (Streak Manager)
// Dante OS v23.1.2 Enterprise - Bogotá, Colombia

class StreakManager {
    static STORAGE_KEY = 'dante_streak_data';

    /**
     * Obtiene el estado actual de la racha desde DanteStorage / localStorage
     */
    static getStreakData() {
        const hoy = StreakManager.getFechaActualColombia();
        const defaultData = {
            count: 0,
            lastActiveDate: '',
            maxStreak: 0,
            history: [],
            escudoActivo: false,
            velocidadCalibracion: '—'
        };

        try {
            let data = null;
            if (typeof DanteStorage !== 'undefined' && typeof DanteStorage.get === 'function') {
                data = DanteStorage.get(StreakManager.STORAGE_KEY);
            } else {
                const raw = localStorage.getItem(StreakManager.STORAGE_KEY);
                if (raw) data = JSON.parse(raw);
            }

            if (!data || typeof data !== 'object') {
                data = defaultData;
                StreakManager.saveStreakData(data);
            }

            return data;
        } catch (e) {
            console.warn('[StreakManager] Error leyendo racha:', e);
            return defaultData;
        }
    }

    /**
     * Guarda la estructura de racha en almacenamiento local y sincroniza con sesión
     */
    static saveStreakData(data) {
        try {
            if (typeof DanteStorage !== 'undefined' && typeof DanteStorage.set === 'function') {
                DanteStorage.set(StreakManager.STORAGE_KEY, data);
            } else {
                localStorage.setItem(StreakManager.STORAGE_KEY, JSON.stringify(data));
            }
            // Sincronizar compatibilidad con claves simples de la app
            localStorage.setItem('dante_streak_count', String(data.count || 1));
            localStorage.setItem('dante_last_active_date', data.lastActiveDate || '');
        } catch (e) {
            console.warn('[StreakManager] Error guardando racha:', e);
        }
    }

    /**
     * Retorna la fecha en formato YYYY-MM-DD
     */
    static getFechaActualColombia() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Calcula la fecha de ayer YYYY-MM-DD
     */
    static getFechaAyerColombia() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Evalúa y actualiza la racha según la actividad real del estudiante hoy
     */
    static registrarActividadHoy() {
        const data = StreakManager.getStreakData();
        const hoy = StreakManager.getFechaActualColombia();
        const ayer = StreakManager.getFechaAyerColombia();

        if (data.lastActiveDate === hoy) {
            // Actividad ya registrada hoy. Garantizar mínimo 1 día.
            if (!data.count || data.count < 1) data.count = 1;
        } else if (data.lastActiveDate === ayer) {
            // ¡Día consecutivo logrado!
            data.count = (data.count || 1) + 1;
            data.lastActiveDate = hoy;
            if (data.count > (data.maxStreak || 1)) {
                data.maxStreak = data.count;
            }
            if (!Array.isArray(data.history)) data.history = [];
            if (!data.history.includes(hoy)) data.history.push(hoy);
        } else {
            // Pasó más de un día sin entrar/estudiar
            if (data.escudoActivo && data.lastActiveDate) {
                // El Escudo de Racha protege la racha una vez
                data.escudoActivo = false;
                data.lastActiveDate = hoy;
                if (!Array.isArray(data.history)) data.history = [];
                if (!data.history.includes(hoy)) data.history.push(hoy);
                if (typeof mostrarNotificacionPWA === 'function') {
                    mostrarNotificacionPWA("🛡️ ESCUDO DE RACHA: Tu racha de días ha sido preservada.", "info");
                }
            } else {
                // Reiniciar racha real a 1
                data.count = 1;
                data.lastActiveDate = hoy;
                data.escudoActivo = true; // recargar escudo para nuevo ciclo
                if (!Array.isArray(data.history)) data.history = [];
                if (!data.history.includes(hoy)) data.history.push(hoy);
            }
        }

        StreakManager.saveStreakData(data);
        StreakManager.actualizarUI();
        return data.count;
    }

    /**
     * Actualiza todos los componentes de la interfaz de usuario con la racha real
     */
    static actualizarUI() {
        const data = StreakManager.getStreakData();
        const count = data.count || 1;

        // 1. Badge del Header Principal (#lblHeaderRachaCount)
        const lblHeaderRacha = document.getElementById('lblHeaderRachaCount');
        if (lblHeaderRacha) {
            lblHeaderRacha.innerText = count;
        }

        // 2. Pill de la Sala Gateway (#lblGatewayRachaCount)
        const lblGatewayRacha = document.getElementById('lblGatewayRachaCount');
        if (lblGatewayRacha) {
            lblGatewayRacha.innerText = count;
        }

        // 3. Modal de Racha (#lblStreakModalCount, #lblStreakVelocidad, #lblStreakEscudoStatus)
        const lblStreakModalCount = document.getElementById('lblStreakModalCount');
        if (lblStreakModalCount) {
            lblStreakModalCount.innerText = `${count} ${count === 1 ? 'Día Consecutivo' : 'Días Consecutivos'}`;
        }

        const lblStreakEscudoStatus = document.getElementById('lblStreakEscudoStatus');
        if (lblStreakEscudoStatus) {
            if (data.escudoActivo) {
                lblStreakEscudoStatus.className = 'text-emerald-400 font-mono';
                lblStreakEscudoStatus.innerText = 'ACTIVADO (Protección 24h)';
            } else {
                lblStreakEscudoStatus.className = 'text-amber-400 font-mono';
                lblStreakEscudoStatus.innerText = 'UTILIZADO (Se recarga en 7 días)';
            }
        }

        // 4. Actualizar Insignias (1 Día, 3 Días, 7 Días)
        const b1 = document.getElementById('badgeInsignia1');
        const b3 = document.getElementById('badgeInsignia3');
        const b7 = document.getElementById('badgeInsignia7');

        if (b1) {
            if (count >= 1) {
                b1.className = 'p-1.5 rounded-lg bg-orange-950/80 border-2 border-orange-500 text-orange-300 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.4)]';
            } else {
                b1.className = 'p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 flex flex-col items-center justify-center opacity-60';
            }
        }

        if (b3) {
            if (count >= 3) {
                b3.className = 'p-1.5 rounded-lg bg-amber-950/80 border-2 border-amber-500 text-amber-300 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.4)]';
            } else {
                b3.className = 'p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 flex flex-col items-center justify-center opacity-60';
            }
        }

        if (b7) {
            if (count >= 7) {
                b7.className = 'p-1.5 rounded-lg bg-purple-950/80 border-2 border-purple-500 text-purple-300 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]';
            } else {
                b7.className = 'p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 flex flex-col items-center justify-center opacity-60';
            }
        }

        // 5. Elementos de compatibilidad retenidos (#lblRachaDias, #lblRachaDiasTop, #lblRachaHud)
        const txtLabel = `${count} ${count === 1 ? 'Día' : 'Días'}`;
        ['lblRachaDias', 'lblRachaDiasTop', 'lblRachaHud'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.children && el.children.length > 0) {
                    const icon = el.querySelector('i');
                    el.childNodes[0].nodeValue = `${count} Días `;
                } else {
                    el.innerText = txtLabel;
                }
            }
        });
    }

    /**
     * Abre el modal de detalle de racha y sincroniza UI
     */
    static abrirModalRacha() {
        StreakManager.registrarActividadHoy();
        const modal = document.getElementById('modalStreakDetail');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    /**
     * Cierra el modal de detalle de racha
     */
    static cerrarModalRacha() {
        const modal = document.getElementById('modalStreakDetail');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }
}

/**
 * Gestor unificado de racha diaria persistente
 */
function registrarActividadRacha() {
    const hoy = new Date().toISOString().slice(0, 10);
    const streakData = JSON.parse(localStorage.getItem('dante_streak_data') || '{"count": 0, "lastDate": null}');

    if (streakData.lastDate === hoy) {
        StreakManager.actualizarUI();
        return streakData.count;
    }

    const ayer = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    if (streakData.lastDate === ayer) {
        streakData.count += 1;
    } else if (!streakData.lastDate) {
        streakData.count = 1;
    } else {
        streakData.count = 1; // Racha reiniciada si pasó más de un día
    }

    streakData.lastDate = hoy;
    streakData.lastActiveDate = hoy;
    localStorage.setItem('dante_streak_data', JSON.stringify(streakData));
    localStorage.setItem('dante_racha_dias', streakData.count.toString());
    localStorage.setItem('dante_streak_count', streakData.count.toString());
    
    StreakManager.actualizarUI();
    return streakData.count;
}

// Exportación global e inicialización automática
if (typeof window !== 'undefined') {
    window.StreakManager = StreakManager;
    window.registrarActividadRacha = registrarActividadRacha;
    document.addEventListener('DOMContentLoaded', () => {
        StreakManager.actualizarUI();
    });
}
