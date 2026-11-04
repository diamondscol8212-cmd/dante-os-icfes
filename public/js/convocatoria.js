// public/js/convocatoria.js - Gestor de Selección Directa de Objetivo / Convocatoria (Dante OS v23.1.0)
class ConvocatoriaManager {
    static init() {
        let storedConv = localStorage.getItem('dante_convocatoria_activa');
        if (!storedConv) {
            // Entrada instantánea sin modal: Asignar Saber 11° por defecto
            storedConv = 'ICFES_SABER_11';
            localStorage.setItem('dante_convocatoria_activa', storedConv);
        }

        // Carga por defecto inmediata: Plan Explorador Gratis (Dosis Diaria de 10 preguntas)
        localStorage.setItem('dante_onboarding_completed', 'true');
        const currentPlan = localStorage.getItem('dante_plan') || localStorage.getItem('dante_user_plan');
        if (!currentPlan || currentPlan === 'GRATIS' || currentPlan === 'EXPLORADOR') {
            localStorage.setItem('dante_plan', 'EXPLORADOR');
            localStorage.setItem('dante_user_plan', 'EXPLORADOR');
        }

        this.aplicarConvocatoriaUI(storedConv);
    }

    static abrirModal() {
        const modal = document.getElementById('modalSeleccionObjetivo');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    static cerrar() {
        const modal = document.getElementById('modalSeleccionObjetivo');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static seleccionar(convocatoriaKey) {
        localStorage.setItem('dante_convocatoria_activa', convocatoriaKey);
        localStorage.setItem('dante_onboarding_completed', 'true');
        
        // Garantizar asignación de Plan Explorador Gratis
        localStorage.setItem('dante_plan', 'EXPLORADOR');
        localStorage.setItem('dante_user_plan', 'EXPLORADOR');

        this.aplicarConvocatoriaUI(convocatoriaKey);
        this.cerrar();

        // Feedback toast / notificación de inicio
        if (typeof AppController !== 'undefined' && AppController.mostrarNotificacion) {
            const nombres = {
                'ICFES_SABER_11': '🎓 ICFES Saber 11° / Preicfes',
                'UNAL_UDEA': '🏛️ Universidad Nacional (UNAL / UdeA)',
                'SABER_PRO': '📊 ICFES Saber Pro / TyT',
                'MAGISTERIO_DOCENTES': '🍎 Magisterio & Concurso Docente (CNSC / MEN)'
            };
            AppController.mostrarNotificacion(`⚡ Sala activada: ${nombres[convocatoriaKey] || convocatoriaKey}. Modo Gratis activo (Dosis Diaria: 10 Reactivos).`, 'success');
        }
    }

    static aplicarConvocatoriaUI(convKey) {
        const lblObjetivo = document.getElementById('lblConvocatoriaActivaHeader');
        const iconContainer = document.getElementById('iconConvocatoriaActivaHeader');
        
        const mapaNombres = {
            'ICFES_SABER_11': '🎓 ICFES SABER 11°',
            'UNAL_UDEA': '🏛️ ADMISIÓN UNAL / UdeA',
            'SABER_PRO': '📊 SABER PRO / TyT',
            'MAGISTERIO_DOCENTES': '🍎 MAGISTERIO & DOCENTES'
        };

        if (lblObjetivo) {
            lblObjetivo.innerText = mapaNombres[convKey] || '🎓 ICFES SABER 11°';
        }

        if (iconContainer && window.DanteVectorIcons) {
            if (convKey === 'UNAL_UDEA') {
                iconContainer.innerHTML = window.DanteVectorIcons.logoUNAL({ size: 22 });
            } else if (convKey === 'ICFES_SABER_11') {
                iconContainer.innerHTML = window.DanteVectorIcons.logoICFES({ size: 22 });
            } else {
                iconContainer.innerHTML = window.DanteVectorIcons.target({ size: 18, color: '#06b6d4' });
            }
        }

        // Emitir evento global de cambio de convocatoria para aislamiento de servicios
        window.dispatchEvent(new CustomEvent('dante:convocatoriaChanged', { detail: { convocatoria: convKey } }));

        // Si la convocatoria es UNAL/UdeA, Saber Pro o Magisterio, sincronizar pestaña de la app si aplica
        const dashApp = window.AppController || window.DanteDashboardApp || window.DashboardApp;
        if (dashApp && dashApp.switchTabModo) {
            if (convKey === 'UNAL_UDEA' || convKey === 'SABER_PRO' || convKey === 'MAGISTERIO_DOCENTES') {
                dashApp.switchTabModo('preuniversitario');
            } else {
                dashApp.switchTabModo('preicfes');
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.ConvocatoriaManager = ConvocatoriaManager;
    document.addEventListener('DOMContentLoaded', () => {
        ConvocatoriaManager.init();
    });
}
