// public/js/store.js - Unified State Management Store (Dante OS v23.1.0-ENTERPRISE)
// Bogotá, Colombia

/**
 * DanteStore - Singleton de Estado Centralizado Unificado para PWA & Capacitor Mobile
 */
class DanteStore {
    constructor() {
        if (DanteStore.instance) {
            return DanteStore.instance;
        }

        this.STORAGE_KEYS = {
            USER: 'dante_user',
            TOKEN: 'dante_session_token',
            PLAN: 'dante_b2c_plan',
            ACTIVE_EXAM: 'dante_active_exam',
            OFFLINE_QUEUE: 'dante_offline_queue'
        };

        this.listeners = new Set();

        this.state = {
            user: null,
            plan: 'PRO',
            sessionToken: null,
            activeExam: null,
            offlineQueue: [],
            isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
        };

        this.isSyncingOffline = false;
        DanteStore.instance = this;
    }

    /**
     * Inicialización del Store y recuperación de persistencia
     */
    init() {
        try {
            // Cargar datos persistidos utilizando DanteStorage de forma defensiva
            if (typeof DanteStorage !== 'undefined') {
                this.state.user = DanteStorage.get(this.STORAGE_KEYS.USER, null);
                this.state.sessionToken = DanteStorage.get(this.STORAGE_KEYS.TOKEN, null);
                this.state.plan = DanteStorage.get(this.STORAGE_KEYS.PLAN, 'PRO');
                this.state.activeExam = DanteStorage.get(this.STORAGE_KEYS.ACTIVE_EXAM, null);
                this.state.offlineQueue = DanteStorage.get(this.STORAGE_KEYS.OFFLINE_QUEUE, []);
            } else {
                const storedUser = localStorage.getItem(this.STORAGE_KEYS.USER);
                const storedToken = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
                const storedPlan = localStorage.getItem(this.STORAGE_KEYS.PLAN);
                const storedExam = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_EXAM);
                const storedQueue = localStorage.getItem(this.STORAGE_KEYS.OFFLINE_QUEUE);

                this.state.user = storedUser ? JSON.parse(storedUser) : null;
                this.state.sessionToken = storedToken || null;
                this.state.plan = storedPlan || 'PRO';
                this.state.activeExam = storedExam ? JSON.parse(storedExam) : null;
                this.state.offlineQueue = storedQueue ? JSON.parse(storedQueue) : [];
            }
            this.state.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

            // Escuchadores de eventos de red para sincronización offline/online
            window.addEventListener('online', () => this.handleNetworkChange(true));
            window.addEventListener('offline', () => this.handleNetworkChange(false));

            // Sincronización nativa con Capacitor si está disponible
            this.syncCapacitor();

            // Intentar vaciar cola offline al iniciar si hay conexión
            if (this.state.isOnline && this.state.offlineQueue.length > 0) {
                this.flushOfflineQueue();
            }

            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.log('✅ [DANTE STORE] Inicializado exitosamente con estado centralizado.');
            }
        } catch (err) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.warn('⚠️ [DANTE STORE WARN] Error al inicializar almacenamiento local:', err);
            }
        }
        return this;
    }

    /**
     * Obtener una copia inmutable del estado actual
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Suscribirse a cambios de estado
     */
    subscribe(listener) {
        if (typeof listener === 'function') {
            this.listeners.add(listener);
            return () => this.listeners.delete(listener);
        }
        return () => {};
    }

    /**
     * Actualizar el estado y notificar a los suscriptores
     */
    setState(partialState) {
        this.state = { ...this.state, ...partialState };

        // Persistir cambios claves utilizando DanteStorage si está disponible
        try {
            if ('user' in partialState) {
                if (typeof DanteStorage !== 'undefined') {
                    if (this.state.user) DanteStorage.set(this.STORAGE_KEYS.USER, this.state.user);
                    else DanteStorage.remove(this.STORAGE_KEYS.USER);
                } else {
                    if (this.state.user) localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(this.state.user));
                    else localStorage.removeItem(this.STORAGE_KEYS.USER);
                }
            }
            if ('sessionToken' in partialState) {
                if (typeof DanteStorage !== 'undefined') {
                    if (this.state.sessionToken) DanteStorage.set(this.STORAGE_KEYS.TOKEN, this.state.sessionToken);
                    else DanteStorage.remove(this.STORAGE_KEYS.TOKEN);
                } else {
                    if (this.state.sessionToken) localStorage.setItem(this.STORAGE_KEYS.TOKEN, this.state.sessionToken);
                    else localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
                }
            }
            if ('plan' in partialState) {
                if (typeof DanteStorage !== 'undefined') DanteStorage.set(this.STORAGE_KEYS.PLAN, this.state.plan);
                else localStorage.setItem(this.STORAGE_KEYS.PLAN, this.state.plan);
            }
            if ('activeExam' in partialState) {
                if (typeof DanteStorage !== 'undefined') {
                    if (this.state.activeExam) DanteStorage.set(this.STORAGE_KEYS.ACTIVE_EXAM, this.state.activeExam);
                    else DanteStorage.remove(this.STORAGE_KEYS.ACTIVE_EXAM);
                } else {
                    if (this.state.activeExam) localStorage.setItem(this.STORAGE_KEYS.ACTIVE_EXAM, JSON.stringify(this.state.activeExam));
                    else localStorage.removeItem(this.STORAGE_KEYS.ACTIVE_EXAM);
                }
            }
            if ('offlineQueue' in partialState) {
                if (typeof DanteStorage !== 'undefined') DanteStorage.set(this.STORAGE_KEYS.OFFLINE_QUEUE, this.state.offlineQueue);
                else localStorage.setItem(this.STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(this.state.offlineQueue));
            }
        } catch (e) {
            if (typeof DanteLogger !== 'undefined') {
                DanteLogger.warn('⚠️ [DANTE STORE WARN] Fallo al escribir en almacenamiento:', e);
            }
        }

        // Notificar a todos los listeners
        this.listeners.forEach(listener => {
            try {
                listener(this.getState());
            } catch (err) {
                console.error('🚨 Error en subscriber listener de DanteStore:', err);
            }
        });
    }

    /**
     * Iniciar sesión y guardar sesión token
     */
    login(userData, token, plan = 'PRO') {
        this.setState({
            user: userData,
            sessionToken: token,
            plan: plan
        });
    }

    /**
     * Cerrar sesión y limpiar credenciales
     */
    logout() {
        this.setState({
            user: null,
            sessionToken: null,
            activeExam: null
        });
    }

    /**
     * Actualizar plan de usuario
     */
    setPlan(plan) {
        this.setState({ plan });
    }

    /**
     * Actualizar examen activo
     */
    setActiveExam(examData) {
        this.setState({ activeExam: examData });
    }

    /**
     * Limpiar examen activo tras completar
     */
    clearActiveExam() {
        this.setState({ activeExam: null });
    }

    /**
     * Encolar una interacción realizada offline para retransmisión
     */
    enqueueOfflineInteraction(interactionData) {
        const queue = [...this.state.offlineQueue, {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            payload: interactionData
        }];
        this.setState({ offlineQueue: queue });

        if (this.state.isOnline) {
            this.flushOfflineQueue();
        }
    }

    /**
     * Sincronizar y transmitir respuestas almacenadas offline al backend
     */
    async flushOfflineQueue() {
        if (this.isSyncingOffline || this.state.offlineQueue.length === 0 || !this.state.isOnline) {
            return;
        }

        this.isSyncingOffline = true;
        console.log(`📡 [DANTE STORE] Sincronizando ${this.state.offlineQueue.length} respuestas offline acumuladas...`);

        const remainingQueue = [...this.state.offlineQueue];
        const processedIds = [];

        for (const item of remainingQueue) {
            try {
                const response = await fetch('/api/v1/cat/interactuar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.state.sessionToken ? `Bearer ${this.state.sessionToken}` : ''
                    },
                    body: JSON.stringify(item.payload)
                });

                if (response.ok || response.status === 400 || response.status === 404) {
                    // Si el servidor procesa o descarta ordenadamente, se elimina de la cola
                    processedIds.push(item.id);
                }
            } catch (err) {
                console.warn('⚠️ [DANTE STORE] Error al sincronizar ítem offline:', err);
                break; // Detener en error de red y reintentar luego
            }
        }

        if (processedIds.length > 0) {
            const newQueue = this.state.offlineQueue.filter(item => !processedIds.includes(item.id));
            this.setState({ offlineQueue: newQueue });
            console.log(`✅ [DANTE STORE] Sincronizadas ${processedIds.length} respuestas offline. Restantes: ${newQueue.length}`);
        }

        this.isSyncingOffline = false;
    }

    /**
     * Manejar cambios de conectividad de red
     */
    handleNetworkChange(isOnline) {
        console.log(`🌐 [DANTE STORE] Cambio de estado de red: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
        this.setState({ isOnline });
        if (isOnline) {
            this.flushOfflineQueue();
        }
    }

    /**
     * Sincronización nativa opcional con Capacitor Preferences / Storage
     */
    async syncCapacitor() {
        if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
            try {
                const { Preferences } = window.Capacitor.Plugins;
                const capToken = await Preferences.get({ key: this.STORAGE_KEYS.TOKEN });
                if (capToken && capToken.value && !this.state.sessionToken) {
                    this.setState({ sessionToken: capToken.value });
                }
            } catch (err) {
                // Silencioso en navegadores estándar
            }
        }
    }
}

// Instancia Singleton Global
const storeInstance = new DanteStore();
if (typeof window !== 'undefined') {
    window.DanteStore = storeInstance;
    document.addEventListener('DOMContentLoaded', () => storeInstance.init());
}

export default storeInstance;
