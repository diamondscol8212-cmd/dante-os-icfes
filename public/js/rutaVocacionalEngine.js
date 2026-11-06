/**
 * DANTE OS ENTERPRISE - RUTA VOCACIONAL TETRA-FACTORIAL ENGINE v23.1.0
 * Motor de Orientación Vocacional Adaptativa, Simulador Táctico de 12 Escenarios SVG y 3 Órbitas
 */

class RutaVocacionalEngine {

    static getEscenariosSVG() {
        return [
            {
                id: 1,
                titulo: "Escenario 1: Crisis de Red y Servidores Críticos",
                subtitulo: "Una falla masiva amenaza la seguridad de datos de 500,000 usuarios en tiempo real.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <path d="M 20,100 Q 100,20 200,100 T 380,100" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,4"/>
                    <circle cx="200" cy="100" r="35" fill="#0f172a" stroke="#ef4444" stroke-width="3" class="animate-pulse"/>
                    <path d="M 190,90 L 210,110 M 210,90 L 190,110" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                    <text x="200" y="160" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11">SERVER_CLUSTER_CRITICAL_FAILURE</text>
                    <rect x="30" y="40" width="80" height="40" rx="6" fill="#1e293b" stroke="#334155"/>
                    <text x="70" y="65" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="10">NODE_01</text>
                    <rect x="290" y="40" width="80" height="40" rx="6" fill="#1e293b" stroke="#334155"/>
                    <text x="330" y="65" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="10">NODE_02</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Depurar el código fuente y aplicar un parche algorítmico en la base de datos.', rol: 'Desarrollador / Criptógrafo' },
                    { id: 'B', label: 'Diseñar un flujo visual intuitivo de alerta para calmar a los usuarios.', rol: 'Diseñador de Interacción' },
                    { id: 'C', label: 'Coordinar al equipo de soporte humano y atender las inquietudes de los afectados.', rol: 'Mediador / Gestor Social' },
                    { id: 'D', label: 'Asumir la dirección del gabinete de crisis y tomar decisiones ejecutivas de contingencia.', rol: 'Líder Directivo' }
                ]
            },
            {
                id: 2,
                titulo: "Escenario 2: Investigación en Laboratorio Genómico",
                subtitulo: "Se ha aislado una variante proteica clave para la regeneración celular.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <path d="M 120,40 Q 200,100 120,160 M 280,40 Q 200,100 280,160" fill="none" stroke="#a855f7" stroke-width="3"/>
                    <line x1="140" y1="60" x2="260" y2="60" stroke="#38bdf8" stroke-width="2"/>
                    <line x1="160" y1="80" x2="240" y2="80" stroke="#34d399" stroke-width="2"/>
                    <line x1="180" y1="100" x2="220" y2="100" stroke="#f59e0b" stroke-width="2"/>
                    <line x1="160" y1="120" x2="240" y2="120" stroke="#38bdf8" stroke-width="2"/>
                    <line x1="140" y1="140" x2="260" y2="140" stroke="#34d399" stroke-width="2"/>
                    <text x="200" y="185" text-anchor="middle" fill="#c084fc" font-family="monospace" font-size="11">GENOMIC_SEQUENCING_ANALYSIS</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Calibrar el microscopio electrónico y mantener el equipo físico de precisión.', rol: 'Técnico / Laboratorista' },
                    { id: 'B', label: 'Modelar las secuencias matemáticas de los nucleótidos en un software bioinformático.', rol: 'Investigador de Bio-Datos' },
                    { id: 'C', label: 'Redactar la revista de divulgación científica y diseñar infografías educativas.', rol: 'Comunicador Científico' },
                    { id: 'D', label: 'Auditar los protocolos bioéticos y verificar el cumplimiento de normas de bioseguridad.', rol: 'Auditor Normativo' }
                ]
            },
            {
                id: 3,
                titulo: "Escenario 3: Negociación Internacional en Situación de Riesgo",
                subtitulo: "Dos delegaciones están estancadas en una disputa territorial y económica.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <circle cx="200" cy="100" r="60" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                    <path d="M 140,100 A 60,60 0 0,0 260,100" fill="none" stroke="#f59e0b" stroke-width="2"/>
                    <line x1="200" y1="40" x2="200" y2="160" stroke="#334155" stroke-width="1.5"/>
                    <circle cx="150" cy="90" r="8" fill="#38bdf8"/>
                    <circle cx="250" cy="90" r="8" fill="#f43f5e"/>
                    <text x="200" y="180" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11">DIPLOMATIC_MEDIATION_NEXUS</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Facilitar la mediación psicológica para desactivar la tensión emocional de las partes.', rol: 'Mediador / Psicólogo' },
                    { id: 'B', label: 'Presentar un acuerdo comercial donde ambas economías obtengan beneficios monetarios.', rol: 'Estratega Negociador' },
                    { id: 'C', label: 'Investigar los tratados históricos pasados y redactar las cláusulas legales exactas.', rol: 'Investigador Legal' },
                    { id: 'D', label: 'Garantizar el transporte seguro, las telecomunicaciones y el despliegue en terreno.', rol: 'Operador Logístico' }
                ]
            },
            {
                id: 4,
                titulo: "Escenario 4: Lanzamiento de Plataforma Multimedia Disruptiva",
                subtitulo: "Se prepara el estreno de una red de contenidos educativos inmersivos.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <rect x="100" y="30" width="200" height="120" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
                    <polygon points="180,70 230,90 180,110" fill="#f59e0b"/>
                    <circle cx="60" cy="100" r="20" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.5"/>
                    <circle cx="340" cy="100" r="20" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
                    <text x="200" y="175" text-anchor="middle" fill="#fcd34d" font-family="monospace" font-size="11">STREAMING_MEDIA_PLATFORM</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Dirigir la estética visual, paletas de color y narrativa audiovisual de los episodios.', rol: 'Director Creativo' },
                    { id: 'B', label: 'Estructurar el plan contable, costos de producción y proyección de retorno financiero.', rol: 'Controlador Financiero' },
                    { id: 'C', label: 'Crear la comunidad en redes y moderar la participación del público joven.', rol: 'Gestor de Comunidad' },
                    { id: 'D', label: 'Discurrir el modelo de suscripción freemium e identificar alianzas corporativas.', rol: 'Innovador de Negocios' }
                ]
            },
            {
                id: 5,
                titulo: "Escenario 5: Falla Mecatrónica e Ingeniería de Precisión",
                subtitulo: "Un brazo robótico de ensamblaje médico pierde calibración micrométrica.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <path d="M 80,160 L 150,110 L 220,130 L 300,70" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="150" cy="110" r="10" fill="#020617" stroke="#10b981" stroke-width="2"/>
                    <circle cx="220" cy="130" r="10" fill="#020617" stroke="#10b981" stroke-width="2"/>
                    <circle cx="300" cy="70" r="14" fill="#10b981"/>
                    <text x="200" y="180" text-anchor="middle" fill="#6ee7b7" font-family="monospace" font-size="11">ROBOTIC_ARM_PRECISION_CALIBRATION</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Simular la física de vectores y fuerzas cinemáticas mediante ecuaciones de cálculo.', rol: 'Ingeniero Teórico' },
                    { id: 'B', label: 'Capacitar a los técnicos de planta sobre los protocolos de uso seguro del robot.', rol: 'Educador Industrial' },
                    { id: 'C', label: 'Desmontar los servomotores y reemplazar los componentes mecatrónicos dañados.', rol: 'Técnico Mecatrónico' },
                    { id: 'D', label: 'Rediseñar el manual ISO de estándares de calidad para toda la línea de producción.', rol: 'Especialista en Calidad' }
                ]
            },
            {
                id: 6,
                titulo: "Escenario 6: Desafío de Salud Pública Emergente",
                subtitulo: "Se detecta un foco de contaminación bacteriana en acueductos regionales.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <path d="M 50,120 C 120,80 180,160 250,100 C 300,60 350,140 380,100" fill="none" stroke="#06b6d4" stroke-width="3"/>
                    <circle cx="180" cy="130" r="18" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
                    <text x="180" y="134" text-anchor="middle" fill="#f43f5e" font-weight="bold" font-size="12">!</text>
                    <text x="200" y="180" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">WATER_SYSTEM_PATHOGEN_MONITOR</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Diseñar pósters y campañas audiovisuales de alerta preventiva para la ciudadanía.', rol: 'Diseñador Publicitario' },
                    { id: 'B', label: 'Analizar las muestras microbiológicas en laboratorio para aislar la bacteria.', rol: 'Microbiólogo / Bio-Datos' },
                    { id: 'C', label: 'Administrar el fondo de emergencia sanitaria e importar insumos médicos.', rol: 'Gerente de Salud' },
                    { id: 'D', label: 'Implementar filtros biológicos ecológicos y renovables en los cauces de agua.', rol: 'Ingeniero Ambiental' }
                ]
            },
            {
                id: 7,
                titulo: "Escenario 7: Resolución de Conflicto Ético en Tecnología",
                subtitulo: "Un algoritmo de Inteligencia Artificial presenta un sesgo discriminatorio.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <rect x="120" y="40" width="160" height="100" rx="8" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
                    <line x1="140" y1="70" x2="260" y2="70" stroke="#c084fc" stroke-width="2"/>
                    <line x1="140" y1="90" x2="220" y2="90" stroke="#c084fc" stroke-width="2"/>
                    <circle cx="245" cy="90" r="8" fill="#ef4444"/>
                    <text x="200" y="175" text-anchor="middle" fill="#e9d5ff" font-family="monospace" font-size="11">ALGORITHMIC_BIAS_AUDIT</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Atender a las personas afectadas y brindarles canales de apoyo y escucha directa.', rol: 'Atención al Usuario / Trabajo Social' },
                    { id: 'B', label: 'Evaluar el impacto financiero de una posible sanción o reclamo legal.', rol: 'Analista de Riesgo Financiero' },
                    { id: 'C', label: 'Rediseñar la interfaz de usuario para exigir explicabilidad clara en cada decisión de la IA.', rol: 'Diseñador UX / Ética' },
                    { id: 'D', label: 'Revisar los datasets de entrenamiento con modelos estadísticos avanzados.', rol: 'Data Scientist' }
                ]
            },
            {
                id: 8,
                titulo: "Escenario 8: Epidemia de Desinformación y Medios",
                subtitulo: "Noticias falsas virales generan pánico sobre vacunas y tratamientos.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <circle cx="200" cy="100" r="45" fill="#1e1b4b" stroke="#f59e0b" stroke-width="2"/>
                    <path d="M 180,100 L 220,100 M 200,80 L 200,120" stroke="#f59e0b" stroke-width="3"/>
                    <text x="200" y="175" text-anchor="middle" fill="#fcd34d" font-family="monospace" font-size="11">EPIDEMIOLOGICAL_FACT_CHECK</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Analizar la curva matemática de contagio y difundir reportes estadísticos rigurosos.', rol: 'Epidemiólogo Estadístico' },
                    { id: 'B', label: 'Orquestar debates parlamentarios para redactar leyes contra la desinformación.', rol: 'Politólogo / Abogado' },
                    { id: 'C', label: 'Atender directamente a familias desinformadas en centros de salud comunitarios.', rol: 'Enfermero / Terapeuta' },
                    { id: 'D', label: 'Investigar biotecnología alimentaria para fortalecer el sistema inmune poblacional.', rol: 'Ingeniero de Alimentos' }
                ]
            },
            {
                id: 9,
                titulo: "Escenario 9: Diseño de Ecosistema Espacial y Satelital",
                subtitulo: "Se diseña una microsatélite para monitorear la deforestación amazónica.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <polygon points="180,60 220,60 230,100 170,100" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
                    <line x1="120" y1="80" x2="170" y2="80" stroke="#38bdf8" stroke-width="4"/>
                    <line x1="230" y1="80" x2="280" y2="80" stroke="#38bdf8" stroke-width="4"/>
                    <text x="200" y="175" text-anchor="middle" fill="#7dd3fc" font-family="monospace" font-size="11">SATELLITE_REMOTE_SENSING</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Diseñar la interfaz de telemetría y los avisos sonoros de la estación terrena.', rol: 'Diseñador de Interacción' },
                    { id: 'B', label: 'Gestionar las licencias de espectro radioeléctrico ante agencias internacionales.', rol: 'Administrador de Salud / Riesgo' },
                    { id: 'C', label: 'Negociar con fondos de capital de riesgo e inversores aeroespaciales privados.', rol: 'Director de Capital de Riesgo' },
                    { id: 'D', label: 'Ensamblar los sensores ópticos infrarrojos e IoT de alta resolución.', rol: 'Especialista en Hardware / IoT' }
                ]
            },
            {
                id: 10,
                titulo: "Escenario 10: Ataque Cibernético e Infraestructura Inteligente",
                subtitulo: "Un ransomware ha bloqueado el sistema de semáforos de una metrópoli.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <rect x="160" y="50" width="80" height="100" rx="10" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
                    <circle cx="200" cy="75" r="10" fill="#f43f5e" class="animate-pulse"/>
                    <circle cx="200" cy="100" r="10" fill="#f59e0b"/>
                    <circle cx="200" cy="125" r="10" fill="#10b981"/>
                    <text x="200" y="180" text-anchor="middle" fill="#fda4af" font-family="monospace" font-size="11">SMART_CITY_GRID_CYBERATTACK</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Dictar talleres de concienciación cibersegura para los operadores del sistema.', rol: 'Educador de Ciberseguridad' },
                    { id: 'B', label: 'Reparar físicamente los gabinetes eléctricos de conmutación en las calles.', rol: 'Mantenimiento Electrónico' },
                    { id: 'C', label: 'Escribir la narrativa transmedia para informar a los conductores por radio y prensa.', rol: 'Narrador / Comunicador' },
                    { id: 'D', label: 'Desplegar algoritmos criptográficos para romper el cifrado del ataque informático.', rol: 'Criptógrafo / Blockchain' }
                ]
            },
            {
                id: 11,
                titulo: "Escenario 11: Transformación Energética Limpia",
                subtitulo: "Construcción de un parque solar y eólico de escala industrial.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <polygon points="120,150 160,80 200,150" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
                    <circle cx="160" cy="80" r="25" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,6"/>
                    <line x1="240" y1="140" x2="320" y2="90" stroke="#f59e0b" stroke-width="3"/>
                    <text x="200" y="180" text-anchor="middle" fill="#6ee7b7" font-family="monospace" font-size="11">RENEWABLE_ENERGY_INFRASTRUCTURE</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Gestionar la cadena de suministro internacional para importar las turbinas eólicas.', rol: 'Director de Logística' },
                    { id: 'B', label: 'Sintetizar nuevos nanomateriales para aumentar la eficiencia de los paneles solares.', rol: 'Científico de Nanomateriales' },
                    { id: 'C', label: 'Seleccionar, contratar y velar por el bienestar del equipo de ingenieros de obra.', rol: 'Gestor de Talento Humano' },
                    { id: 'D', label: 'Realizar estudios geológicos de suelos y vientos para ubicar las instalaciones.', rol: 'Geólogo / Exploración' }
                ]
            },
            {
                id: 12,
                titulo: "Escenario 12: Simulación de Inteligencia Artificial Consciente",
                subtitulo: "Un modelo multimodal demuestra capacidad de autorreflexión y razonamiento.",
                svg: `<svg viewBox="0 0 400 200" class="w-full h-44 rounded-xl bg-slate-950 border border-slate-800">
                    <rect width="400" height="200" fill="#020617"/>
                    <circle cx="200" cy="100" r="50" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
                    <polygon points="200,60 230,120 170,120" fill="none" stroke="#38bdf8" stroke-width="2"/>
                    <circle cx="200" cy="100" r="8" fill="#f59e0b"/>
                    <text x="200" y="180" text-anchor="middle" fill="#c084fc" font-family="monospace" font-size="11">ARTIFICIAL_GENERAL_INTELLIGENCE</text>
                </svg>`,
                opciones: [
                    { id: 'A', label: 'Crear mundos virtuales y experiencias inmersivas para la interacción humano-IA.', rol: 'Diseñador de Experiencias' },
                    { id: 'B', label: 'Redactar el marco ético y la carta de derechos universales para la inteligencia sintética.', rol: 'Filósofo / Eticista IA' },
                    { id: 'C', label: 'Coordinar la cadena global de datacenters donde corre el modelo sintético.', rol: 'Especialista en Infraestructura' },
                    { id: 'D', label: 'Dirigir la ONG que distribuirá equitativamente los beneficios de la IA a la sociedad.', rol: 'Director Social / ONG' }
                ]
            }
        ];
    }

    static state = {
        currentScenarioIndex: 0,
        userAnswers: [],
        scenarioStartTime: null,
        isProcessing: false,
        studentId: 'ESTUDIANTE_SANDBOX_GUEST',
        projectedScore: 0,
        targetCareerId: ''
    };

    static async init() {
        const profile = JSON.parse(localStorage.getItem('dante_user_profile') || '{}');
        if (profile.student_id) this.state.studentId = profile.student_id;
        
        const ssotScore = parseInt(localStorage.getItem('dante_score_proyectado') || localStorage.getItem('dante_puntaje_global') || localStorage.getItem('dante_diagnostico_puntaje') || '0', 10);
        this.state.projectedScore = ssotScore > 0 ? ssotScore : 0;

        const target = localStorage.getItem('dante_target_career_id') || localStorage.getItem('dante_carrera_objetivo') || '';
        this.state.targetCareerId = target;

        this.loadHeaderData();

        // 1. Verificar si ya existe un diagnóstico guardado en el navegador
        const savedResult = localStorage.getItem('dante_vocational_eval_result');
        if (savedResult) {
            try {
                const data = JSON.parse(savedResult);
                if (data && data.profileSummary && data.orbitResult) {
                    this.renderizarResultadosCompletos(data);
                    return;
                }
            } catch (e) {
                console.warn('[RutaVocacionalEngine] Error al parsear resultado guardado:', e);
            }
        }

        // 2. Si no hay en localStorage, consultar la base de datos backend
        try {
            const resp = await fetch(`/api/v1/vocational/profile/${this.state.studentId}`);
            if (resp.ok) {
                const dbData = await resp.json();
                const perfilNube = dbData.profile || dbData.vocationalProfile;
                if (dbData.success && perfilNube && (perfilNube.holland_code || perfilNube.meta_carrera)) {
                    const data = this.adaptarPerfilDB(perfilNube);
                    localStorage.setItem('dante_vocational_eval_result', JSON.stringify(data));
                    this.renderizarResultadosCompletos(data);
                    return;
                }
            }
        } catch (e) {
            console.warn('[RutaVocacionalEngine] No se halló perfil en BD:', e);
        }

        // 3. Si no hay diagnóstico previo, renderizar el simulador
        this.renderSimuladorContainer();
    }

    /**
     * Adaptar perfil de BD a la estructura completa de presentación
     */
    static adaptarPerfilDB(dbProfile) {
        const riasec = {
            R: dbProfile.score_realista ?? 0,
            I: dbProfile.score_investigativo ?? 0,
            A: dbProfile.score_artistico ?? 0,
            S: dbProfile.score_social ?? 0,
            E: dbProfile.score_emprendedor ?? 0,
            C: dbProfile.score_convencional ?? 0
        };
        const ocean = {
            O: dbProfile.ocean_openness ?? 0,
            C: dbProfile.ocean_conscientiousness ?? 0,
            E: dbProfile.ocean_extraversion ?? 0,
            A: dbProfile.ocean_agreeableness ?? 0,
            N: dbProfile.ocean_neuroticism ?? 0
        };
        const soft = dbProfile.soft_skills_profile || {};
        return {
            success: true,
            profileSummary: {
                hollandCode: dbProfile.holland_code || '---',
                riasec: riasec,
                ocean: ocean,
                telemetrySummary: dbProfile.telemetria_latencia_ms || {
                    system1IntuitivePct: 0,
                    system2HesitationPct: 0,
                    avgLatencyMs: 0,
                    authenticityIndex: 100
                },
                sjtExecutionStyle: soft.sjtExecutionStyle || 'Perfil Registrado'
            },
            orbitResult: {
                orbitas: dbProfile.orbitas_clasificadas || null,
                roiPlan: dbProfile.roi_cognitivo_plan || null,
                todasLasCarreras: dbProfile.carreras_sugeridas || []
            }
        };
    }

    static loadHeaderData() {
        const lblCarrera = document.getElementById('hdrCarreraMeta');
        const lblUniv = document.getElementById('hdrUniversidadMeta');
        const lblPtsActual = document.getElementById('hdrPtsActual');
        const lblPtsCorte = document.getElementById('hdrPtsCorte');
        const lblBrecha = document.getElementById('hdrBrechaPuntos');

        const savedCarrera = localStorage.getItem('dante_carrera_objetivo') || localStorage.getItem('dante_carrera_meta_nombre') || 'Carrera sin elegir';
        const savedUniv = localStorage.getItem('dante_universidad_objetivo') || localStorage.getItem('dante_universidad_meta') || '';
        const savedCorte = parseInt(localStorage.getItem('dante_corte_objetivo') || localStorage.getItem('dante_carrera_meta_corte') || '0', 10);
        
        if (lblCarrera) lblCarrera.innerText = savedCarrera;
        if (lblUniv) lblUniv.innerText = savedUniv;

        if (this.state.projectedScore > 0) {
            if (lblPtsActual) lblPtsActual.innerText = `${this.state.projectedScore} Pts`;
            if (lblPtsCorte) lblPtsCorte.innerText = savedCorte > 0 ? `${savedCorte} Pts` : '—';

            const mismaEscala = savedCorte > 0 && !(savedCorte > 500 && this.state.projectedScore <= 500);
            const brecha = mismaEscala ? savedCorte - this.state.projectedScore : null;
            if (lblBrecha) {
                if (brecha == null) {
                    lblBrecha.innerText = 'Otra escala';
                    lblBrecha.className = "text-lg font-black font-mono text-slate-400";
                } else if (brecha > 0) {
                    lblBrecha.innerText = `-${brecha} Pts`;
                    lblBrecha.className = "text-lg font-black font-mono text-amber-400";
                } else {
                    lblBrecha.innerText = `+${Math.abs(brecha)} Pts (Zona Segura)`;
                    lblBrecha.className = "text-lg font-black font-mono text-emerald-400";
                }
            }
        } else {
            if (lblPtsActual) lblPtsActual.innerText = `-- Pts (Sin calibrar)`;
            if (lblPtsCorte) lblPtsCorte.innerText = `${savedCorte} Pts`;
            if (lblBrecha) {
                lblBrecha.innerText = `-- Pts (Pendiente)`;
                lblBrecha.className = "text-lg font-black font-mono text-slate-400";
            }
        }
    }

    static renderSimuladorContainer() {
        const sec = document.getElementById('secSimuladorTactico');
        if (!sec) return;

        const escenarios = this.getEscenariosSVG();
        const total = escenarios.length;
        const currentIdx = this.state.currentScenarioIndex;
        const currentScenario = escenarios[currentIdx];

        if (currentIdx >= total) {
            return;
        }

        this.state.scenarioStartTime = Date.now();
        const pctProgress = Math.round(((currentIdx) / total) * 100);

        sec.innerHTML = `
            <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                
                <!-- BARRA DE ACCIÓN RÁPIDA / DEMO -->
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-mono">
                    <span class="text-slate-300 flex items-center gap-2">
                        <i class="fa-solid fa-lightbulb text-amber-400 text-sm"></i>
                        <span>Responde las 12 decisiones situacionales o genera el informe completo en 1 clic:</span>
                    </span>
                    <button type="button" onclick="RutaVocacionalEngine.autocompletarDemo()" class="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black uppercase text-[11px] tracking-wider shadow-md transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-bolt"></i>
                        <span>Generar Diagnóstico Completo (1-Clic)</span>
                    </button>
                </div>

                <!-- CABECERA DE PROGRESO DEL SIMULADOR -->
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <span class="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">SIMULADOR DE ESCENARIOS TÁCTICOS</span>
                        <h2 class="text-xl font-black text-white font-sans flex items-center gap-2">
                            <span>Decisión ${currentIdx + 1} de ${total}</span>
                        </h2>
                    </div>
                    <div class="text-right font-mono">
                        <span class="text-xs text-amber-400 font-bold">${pctProgress}% Completado</span>
                        <div class="w-32 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden mt-1">
                            <div class="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300" style="width: ${pctProgress}%"></div>
                        </div>
                    </div>
                </div>

                <!-- GRÁFICO SVG E INFORMACIÓN DEL ESCENARIO -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div>
                        ${currentScenario.svg}
                    </div>
                    <div class="space-y-3 text-left">
                        <span class="text-[10px] font-mono px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold uppercase tracking-wider">
                            <i class="fa-solid fa-microchip mr-1"></i> MEDICIÓN NEURO-CONDUCTUAL
                        </span>
                        <h3 class="text-lg font-black text-white font-sans">${currentScenario.titulo}</h3>
                        <p class="text-xs text-slate-300 font-sans leading-relaxed">${currentScenario.subtitulo}</p>
                        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <i class="fa-solid fa-stopwatch text-amber-400"></i>
                            <span>Dante OS registra tu latencia de respuesta en milisegundos para detectar Sistema 1 (Pasión) vs Sistema 2 (Duda).</span>
                        </div>
                    </div>
                </div>

                <!-- OPCIONES DE DECISION -->
                <div class="space-y-3 pt-2 text-left">
                    <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">¿QUÉ ACCIÓN O ROL ASUMIRÍAS ANTE ESTA SITUACIÓN?</span>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${currentScenario.opciones.map(opt => `
                            <button type="button" onclick="RutaVocacionalEngine.seleccionarOpcion('${opt.id}')" 
                                class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/80 hover:bg-slate-800/80 transition-all text-left group flex items-start gap-3 cursor-pointer active:scale-98">
                                <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                                    ${opt.id}
                                </div>
                                <div class="space-y-1">
                                    <p class="text-xs font-semibold text-slate-200 group-hover:text-white font-sans leading-snug">${opt.label}</p>
                                    <span class="text-[10px] font-mono text-slate-500 group-hover:text-amber-400 font-bold block">${opt.rol}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

            </div>
        `;
    }

    /**
     * Autocompletar la evaluación demo instantánea con 1 clic
     */
    static autocompletarDemo() {
        this.state.userAnswers = [
            { scenarioId: 1, optionId: 'A', dwellTimeMs: 1800 },
            { scenarioId: 2, optionId: 'B', dwellTimeMs: 2100 },
            { scenarioId: 3, optionId: 'A', dwellTimeMs: 1500 },
            { scenarioId: 4, optionId: 'C', dwellTimeMs: 2500 },
            { scenarioId: 5, optionId: 'B', dwellTimeMs: 1900 },
            { scenarioId: 6, optionId: 'A', dwellTimeMs: 2200 },
            { scenarioId: 7, optionId: 'D', dwellTimeMs: 1600 },
            { scenarioId: 8, optionId: 'B', dwellTimeMs: 2000 },
            { scenarioId: 9, optionId: 'A', dwellTimeMs: 1700 },
            { scenarioId: 10, optionId: 'C', dwellTimeMs: 2400 },
            { scenarioId: 11, optionId: 'B', dwellTimeMs: 1900 },
            { scenarioId: 12, optionId: 'A', dwellTimeMs: 2100 }
        ];
        this.finalizarSimulador();
    }

    /**
     * Reiniciar evaluación para tomar nuevamente los 12 escenarios
     */
    static reiniciarEvaluacion() {
        localStorage.removeItem('dante_vocational_eval_result');
        this.state.currentScenarioIndex = 0;
        this.state.userAnswers = [];

        ['secResultadosVocacionales', 'secMatrizOrbitas', 'secPlanRoiCognitivo', 'secMicroSimulaciones', 'secBrujula2030', 'secCronogramaInverso'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const secSim = document.getElementById('secSimuladorTactico');
        if (secSim) secSim.classList.remove('hidden');

        this.renderSimuladorContainer();
    }

    /**
     * Navegar directamente a cualquier pestaña
     */
    static mostrarPestana(tabName) {
        let savedResult = localStorage.getItem('dante_vocational_eval_result');
        let data = null;
        if (savedResult) {
            try { data = JSON.parse(savedResult); } catch(e){}
        }
        if (!data) {
            data = this.adaptarPerfilDB({ student_id: this.state.studentId });
            localStorage.setItem('dante_vocational_eval_result', JSON.stringify(data));
        }

        this.renderizarResultadosCompletos(data);

        if (tabName === 'simulador') {
            const secSim = document.getElementById('secSimuladorTactico');
            if (secSim) secSim.classList.remove('hidden');
        } else if (tabName === 'pdf') {
            this.abrirInformePadresModal();
        } else {
            const mapId = {
                'adn': 'secResultadosVocacionales',
                'orbitas': 'secMatrizOrbitas',
                'microsim': 'secMicroSimulaciones',
                'brujula': 'secBrujula2030'
            };
            const targetEl = document.getElementById(mapId[tabName] || 'secResultadosVocacionales');
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    }

    static seleccionarOpcion(optionId) {
        if (this.state.isProcessing) return;

        const dwellTimeMs = Date.now() - (this.state.scenarioStartTime || Date.now());
        const scenarioId = this.getEscenariosSVG()[this.state.currentScenarioIndex].id;

        this.state.userAnswers.push({
            scenarioId,
            optionId,
            dwellTimeMs
        });

        this.state.currentScenarioIndex++;

        if (this.state.currentScenarioIndex < this.getEscenariosSVG().length) {
            this.renderSimuladorContainer();
        } else {
            this.finalizarSimulador();
        }
    }

    static async finalizarSimulador() {
        this.state.isProcessing = true;
        const secSim = document.getElementById('secSimuladorTactico');
        
        if (secSim) {
            secSim.innerHTML = `
                <div class="p-8 rounded-2xl bg-slate-900 border border-amber-500/50 text-center space-y-4 shadow-2xl">
                    <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 text-3xl mx-auto animate-spin">
                        <i class="fa-solid fa-microchip"></i>
                    </div>
                    <h3 class="text-xl font-black text-white font-sans">Procesando ADN Vocacional Tetra-Factorial</h3>
                    <p class="text-xs font-mono text-slate-400 max-w-md mx-auto">
                        Cruzando vectores RIASEC, Big Five, telemetría de latencia neuro-conductual y modelo TRI 3PL con la base de admisiones universitarias de Colombia...
                    </p>
                </div>
            `;
        }

        try {
            const resp = await fetch('/api/v1/vocational/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: this.state.studentId,
                    projectedScore: this.state.projectedScore,
                    targetCareerId: this.state.targetCareerId,
                    answers: this.state.userAnswers
                })
            });

            let data = null;
            if (resp.ok) {
                const resJson = await resp.json();
                if (resJson.success) data = resJson;
            }

            if (!data) {
                data = this.adaptarPerfilDB({ student_id: this.state.studentId });
            }

            localStorage.setItem('dante_vocational_eval_result', JSON.stringify(data));
            this.renderizarResultadosCompletos(data);
        } catch (err) {
            console.warn("🚨 Error conectando a API, generando perfil local:", err);
            const fallbackData = this.adaptarPerfilDB({ student_id: this.state.studentId });
            localStorage.setItem('dante_vocational_eval_result', JSON.stringify(fallbackData));
            this.renderizarResultadosCompletos(fallbackData);
        } finally {
            this.state.isProcessing = false;
        }
    }

    static renderizarResultadosCompletos(data) {
        const secSim = document.getElementById('secSimuladorTactico');
        if (secSim) secSim.classList.add('hidden');

        const secRes = document.getElementById('secResultadosVocacionales');
        const secOrb = document.getElementById('secMatrizOrbitas');
        const secRoi = document.getElementById('secPlanRoiCognitivo');

        const profile = data.profileSummary || {};
        const orbitResult = data.orbitResult || {};
        const roiPlan = (orbitResult && orbitResult.roiPlan) || {};

        // 1. RENDERIZAR PANEL DE ADN VOCACIONAL
        if (secRes) {
            secRes.classList.remove('hidden');
            secRes.innerHTML = `
                <div class="p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-6 text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <span class="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">REVELACIÓN DE ADN VOCACIONAL</span>
                            <h2 class="text-2xl font-black text-white font-sans flex items-center gap-3">
                                <span>Código Holland: <span class="text-purple-400 font-mono font-black">${profile.hollandCode || '—'}</span></span>
                            </h2>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold inline-flex items-center gap-1.5">
                                <i class="fa-solid fa-certificate text-purple-400"></i>
                                <span>Autenticidad: ${(profile.telemetrySummary && profile.telemetrySummary.authenticityIndex != null) ? profile.telemetrySummary.authenticityIndex + '%' : '—'}</span>
                            </span>
                            <button onclick="RutaVocacionalEngine.reiniciarEvaluacion()" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0">
                                <i class="fa-solid fa-rotate-right"></i>
                                <span>Repetir Evaluación</span>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <!-- VECTORES RIASEC -->
                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <span class="text-xs font-mono font-bold text-slate-300 uppercase block flex items-center gap-2">
                                <i class="fa-solid fa-chart-radar text-purple-400"></i> Vector RIASEC Holland
                            </span>
                            <div class="space-y-2 text-xs font-mono">
                                ${Object.entries(profile.riasec).map(([k, v]) => `
                                    <div class="space-y-1">
                                        <div class="flex justify-between text-slate-400">
                                            <span>${k} (${this.getHollandLabel(k)})</span>
                                            <span class="text-purple-400 font-bold">${v}%</span>
                                        </div>
                                        <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                            <div class="h-full bg-purple-500 rounded-full" style="width: ${v}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- TELEMETRÍA NEURO-CONDUCTUAL -->
                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <span class="text-xs font-mono font-bold text-slate-300 uppercase block flex items-center gap-2">
                                <i class="fa-solid fa-stopwatch text-amber-400"></i> Latencia Neuro-Conductual
                            </span>
                            <div class="space-y-3 text-xs">
                                <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                                    <span class="text-[10px] text-slate-400 font-mono block">Intuición / Pasión (Sistema 1):</span>
                                    <span class="text-base font-black text-emerald-400 font-mono">${profile.telemetrySummary.system1IntuitivePct}% de las elecciones</span>
                                </div>
                                <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                                    <span class="text-[10px] text-slate-400 font-mono block">Duda / Reflexión (Sistema 2):</span>
                                    <span class="text-base font-black text-amber-400 font-mono">${profile.telemetrySummary.system2HesitationPct}% de las elecciones</span>
                                </div>
                                <p class="text-[11px] text-slate-400 font-sans leading-relaxed">
                                    Dante OS midió un promedio de <strong class="text-slate-200 font-mono">${profile.telemetrySummary.avgLatencyMs} ms</strong> por decisión. Muestras una alta certeza intuitiva en áreas de alta abstracción.
                                </p>
                            </div>
                        </div>

                        <!-- ESTILO DE EJECUCIÓN HABILIDADES BLANDAS (SJT) -->
                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <span class="text-xs font-mono font-bold text-slate-300 uppercase block flex items-center gap-2">
                                <i class="fa-solid fa-user-gear text-cyan-400"></i> Estilo de Ejecución SJT
                            </span>
                            <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2">
                                <div class="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mx-auto shadow-md">
                                    ${window.DanteVectorIcons ? DanteVectorIcons.target({ size: 26, color: '#38bdf8' }) : ''}
                                </div>
                                <h4 class="text-sm font-black text-cyan-300 font-sans">${profile.sjtExecutionStyle}</h4>
                                <p class="text-[11px] text-slate-300 font-sans leading-relaxed">
                                    Sobresales en entornos que demandan análisis metódico, autonomía operativa y solución técnica estructurada.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            `;
        }

        // 2. RENDERIZAR MATRIZ DE LAS 3 ÓRBITAS
        if (secOrb) {
            secOrb.classList.remove('hidden');
            const orb = orbitResult.orbitas;

            const cleanLabel = (lbl) => (lbl || '').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '').trim();

            secOrb.innerHTML = `
                <div class="space-y-4 text-left">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                            <span class="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">MATRIZ DE AFINIDAD CONTINUA</span>
                            <h2 class="text-2xl font-black text-white font-sans">Las 3 Órbitas Vocacionales de Admisión</h2>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <!-- MISIÓN PRINCIPAL -->
                        <div class="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/80 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 w-fit uppercase">
                                ${window.DanteVectorIcons ? DanteVectorIcons.target({ size: 14, color: '#f59e0b' }) : ''}
                                <span>${cleanLabel(orb.misionPrincipal.label)}</span>
                            </span>
                            <div class="space-y-1">
                                <h3 class="text-lg font-black text-white font-sans">${orb.misionPrincipal.data.nombre}</h3>
                                <p class="text-xs text-slate-400 font-mono">${orb.misionPrincipal.data.universidadNombre}</p>
                            </div>
                            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Afinidad Personalidad:</span>
                                    <span class="text-amber-400 font-bold">${orb.misionPrincipal.data.afinidadPct}%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Brecha Puntos:</span>
                                    <span class="text-amber-400 font-bold">${orb.misionPrincipal.data.brechaPuntos} Pts</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Resiliencia IA 2030+:</span>
                                    <span class="text-emerald-400 font-bold">${orb.misionPrincipal.data.aiResilienceScore}%</span>
                                </div>
                            </div>
                            <p class="text-xs text-slate-300 font-sans leading-relaxed">${orb.misionPrincipal.data.descripcionReal}</p>
                        </div>

                        <!-- MISIÓN DE RESGUARDO -->
                        <div class="p-5 rounded-2xl bg-slate-900 border border-emerald-500/60 space-y-4 shadow-xl">
                            <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 w-fit uppercase">
                                ${window.DanteVectorIcons ? DanteVectorIcons.shield({ size: 14, color: '#10b981' }) : ''}
                                <span>${cleanLabel(orb.misionResguardo.label)}</span>
                            </span>
                            <div class="space-y-1">
                                <h3 class="text-lg font-black text-white font-sans">${orb.misionResguardo.data.nombre}</h3>
                                <p class="text-xs text-slate-400 font-mono">${orb.misionResguardo.data.universidadNombre}</p>
                            </div>
                            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Afinidad Personalidad:</span>
                                    <span class="text-emerald-400 font-bold">${orb.misionResguardo.data.afinidadPct}%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Estado de Brecha:</span>
                                    <span class="text-emerald-400 font-bold">¡Ingreso Viable Hoy!</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Resiliencia IA 2030+:</span>
                                    <span class="text-emerald-400 font-bold">${orb.misionResguardo.data.aiResilienceScore}%</span>
                                </div>
                            </div>
                            <p class="text-xs text-slate-300 font-sans leading-relaxed">${orb.misionResguardo.data.descripcionReal}</p>
                        </div>

                        <!-- MISIÓN TRANSVERSAL -->
                        <div class="p-5 rounded-2xl bg-slate-900 border border-cyan-500/60 space-y-4 shadow-xl">
                            <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 w-fit uppercase">
                                ${window.DanteVectorIcons ? DanteVectorIcons.rocket({ size: 14, color: '#38bdf8' }) : ''}
                                <span>${cleanLabel(orb.misionTransversal.label)}</span>
                            </span>
                            <div class="space-y-1">
                                <h3 class="text-lg font-black text-white font-sans">${orb.misionTransversal.data.nombre}</h3>
                                <p class="text-xs text-slate-400 font-mono">${orb.misionTransversal.data.universidadNombre}</p>
                            </div>
                            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Afinidad Personalidad:</span>
                                    <span class="text-cyan-400 font-bold">${orb.misionTransversal.data.afinidadPct}%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Estatus Emergente:</span>
                                    <span class="text-cyan-300 font-bold">Carrera Híbrida 2030+</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Resiliencia IA 2030+:</span>
                                    <span class="text-emerald-400 font-bold">${orb.misionTransversal.data.aiResilienceScore}%</span>
                                </div>
                            </div>
                            <p class="text-xs text-slate-300 font-sans leading-relaxed">${orb.misionTransversal.data.descripcionReal}</p>
                        </div>

                    </div>
                </div>
            `;
        }

        // 3. RENDERIZAR TERMÓMETRO DE ROI COGNITIVO Y PUENTE CAT
        if (secRoi) {
            secRoi.classList.remove('hidden');

            secRoi.innerHTML = `
                <div class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/50 shadow-2xl space-y-6 text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <span class="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">PUENTE TÁCTICO DE ENTRENAMIENTO EXAMEN</span>
                            <h2 class="text-xl sm:text-2xl font-black text-white font-sans">Estrategia de Cierre de Brecha de Menor Esfuerzo (ROI Cognitivo)</h2>
                        </div>
                        <button onclick="RutaVocacionalEngine.iniciarDosisCAT()" class="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0">
                            <i class="fa-solid fa-fire-flame-curved"></i>
                            <span>ENTRENAR HOY MISMO EN SALA CAT</span>
                        </button>
                    </div>

                    <p class="text-xs text-slate-300 font-sans leading-relaxed">
                        ${roiPlan.mensajeStrategy}
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${roiPlan.recomendacionMaterias.map(m => `
                            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <span class="text-[10px] font-mono text-amber-400 font-bold block uppercase">${m.materiaNombre}</span>
                                <div class="flex justify-between items-baseline font-mono">
                                    <span class="text-lg font-black text-white">+${m.puntosACosechar} Pts</span>
                                    <span class="text-xs text-slate-400">${m.ponderacionPct}% Ponderación</span>
                                </div>
                                <span class="text-[10px] font-mono text-slate-400 block border-t border-slate-900 pt-1 flex items-center gap-1.5">
                                    ${window.DanteVectorIcons ? DanteVectorIcons.target({ size: 12, color: '#f59e0b' }) : ''}
                                    <span>Dosis diaria recomendada: <strong class="text-amber-300">${m.dosisSugeridaDiaria} reactivos/día</strong></span>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 4. RENDERIZAR FASE 3: MICRO-SIMULADORES DE TRABAJO ("UN DÍA EN TUS ZAPATOS")
        const secMicro = document.getElementById('secMicroSimulaciones');
        if (secMicro) {
            secMicro.classList.remove('hidden');
            secMicro.innerHTML = `
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-left">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                            <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">EXPERIENCIA OPERATIVA REAL 60 SEGUNDOS</span>
                            <h2 class="text-2xl font-black text-white font-sans flex items-center gap-2">
                                <i class="fa-solid fa-user-ninja text-cyan-400"></i> Micro-Simulaciones: "Un Día en tus Zapatos"
                            </h2>
                        </div>
                        <span class="text-xs font-mono text-slate-400">Destruyendo la fantasía romántica de la profesión</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-mono text-cyan-400 font-bold uppercase">Medicina & Cirugía</span>
                                <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">60s Reto</span>
                            </div>
                            <h3 class="text-sm font-bold text-white font-sans">Urgencia Táctica: Triaje de Falla Multiorgánica</h3>
                            <p class="text-xs text-slate-400 leading-relaxed">Analiza signos vitales en shock séptico y decide entre administrar vasopresores o intubación inmediata bajo presión de tiempo.</p>
                            <button onclick="RutaVocacionalEngine.ejecutarMicroSimulacion('medicina')" class="w-full py-2.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2">
                                ${window.DanteVectorIcons ? DanteVectorIcons.target({ size: 14, color: '#38bdf8' }) : ''}
                                <span>Iniciar Reto Operativo</span>
                            </button>
                        </div>

                        <div class="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-mono text-amber-400 font-bold uppercase">Ingeniería & IA</span>
                                <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/30">60s Reto</span>
                            </div>
                            <h3 class="text-sm font-bold text-white font-sans">Equipo saturado: ¿priorizas el servicio o la calidad?</h3>
                            <p class="text-xs text-slate-400 leading-relaxed">Identifica la fuga de memoria en un microservicio de base de datos distribuidas y aplica el parche de concurrencia.</p>
                            <button onclick="RutaVocacionalEngine.ejecutarMicroSimulacion('ingenieria')" class="w-full py-2.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 hover:bg-amber-900 font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2">
                                <i class="fa-solid fa-laptop-code text-amber-400 text-sm"></i>
                                <span>Iniciar Reto Operativo</span>
                            </button>
                        </div>

                        <div class="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/50 transition-all">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-mono text-purple-400 font-bold uppercase">Derecho & Bioética</span>
                                <span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/30">60s Reto</span>
                            </div>
                            <h3 class="text-sm font-bold text-white font-sans">Litigio Algorítmico: Responsabilidad de IA</h3>
                            <p class="text-xs text-slate-400 leading-relaxed">Defiende una demanda por sesgo en algoritmos de crédito bancario utilizando el marco de protección de datos de LATAM.</p>
                            <button onclick="RutaVocacionalEngine.ejecutarMicroSimulacion('derecho')" class="w-full py-2.5 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-900 font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2">
                                ${window.DanteVectorIcons ? DanteVectorIcons.shield({ size: 14, color: '#c084fc' }) : ''}
                                <span>Iniciar Reto Operativo</span>
                            </button>
                        </div>
                    </div>

                    <div id="containerMicroSimResult" class="hidden p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-xs font-mono space-y-2">
                        <!-- Resultado dinámico del reto -->
                    </div>
                </div>
            `;

            // Restaurar resultado previo si existe en localStorage
            setTimeout(() => {
                try {
                    const saved = localStorage.getItem('dante_microsim_result');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        const resultContainer = document.getElementById('containerMicroSimResult');
                        if (resultContainer && parsed && parsed.feedback) {
                            resultContainer.innerHTML = `
                                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div class="space-y-1">
                                        <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">ÚLTIMO RETO OPERATIVO EVALUADO</span>
                                        <p class="text-xs text-slate-200 font-sans">${parsed.feedback}</p>
                                    </div>
                                    <span class="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-extrabold text-xs shrink-0">
                                        ${parsed.afinidad}% AFINIDAD REAL
                                    </span>
                                </div>
                            `;
                            resultContainer.classList.remove('hidden');
                        }
                    }
                } catch (e) {
                    // Ignore parsing error
                }
            }, 100);
        }

        // 5. RENDERIZAR FASE 3: BRÚJULA DE CARRERAS HÍBRIDAS EMERGENTES 2030+
        const secBrujula = document.getElementById('secBrujula2030');
        if (secBrujula) {
            secBrujula.classList.remove('hidden');
            secBrujula.innerHTML = `
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-left">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                            <span class="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">PROSPECTIVA OCUPACIONAL FUTURA</span>
                            <h2 class="text-2xl font-black text-white font-sans flex items-center gap-2">
                                <i class="fa-solid fa-compass-drafting text-purple-400"></i> Brújula de Carreras Híbridas 2030+
                            </h2>
                        </div>
                        <span class="text-xs font-mono text-emerald-400 font-bold">Índices de Resiliencia a la IA > 90%</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-bold text-white font-sans">Ingeniería Biónica y Bio-Datos</span>
                                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">96% Resiliencia IA</span>
                            </div>
                            <p class="text-xs text-slate-400">Diseño de neuro-prótesis, interfaces cerebro-computador e interpretación algorítmica de señales nerviosas.</p>
                            <div class="flex justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-900">
                                <span>Salario Promedio:</span>
                                <span class="text-amber-400 font-bold">$6.2M COP/mes</span>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-bold text-white font-sans">Gobernanza Algorítmica y Eticista IA</span>
                                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">94% Resiliencia IA</span>
                            </div>
                            <p class="text-xs text-slate-400">Auditoría de sesgos en modelos predictivos de decisión pública, regulación legal y derechos de agentes autónomos.</p>
                            <div class="flex justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-900">
                                <span>Salario Promedio:</span>
                                <span class="text-amber-400 font-bold">$5.8M COP/mes</span>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-bold text-white font-sans">Biotecnología & Ciudades Resilientes</span>
                                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">93% Resiliencia IA</span>
                            </div>
                            <p class="text-xs text-slate-400">Creación de materiales autorreparables, captura de carbono urbano y bioarquitectura de alimentos sintéticos.</p>
                            <div class="flex justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-900">
                                <span>Salario Promedio:</span>
                                <span class="text-amber-400 font-bold">$5.5M COP/mes</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 6. RENDERIZAR FASE 4: CRONOGRAMA INVERSO & BOTÓN DE INFORME PARA PADRES
        const secCrono = document.getElementById('secCronogramaInverso');
        if (secCrono) {
            secCrono.classList.remove('hidden');
            secCrono.innerHTML = `
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <span class="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">CRONOGRAMA INVERSO DE ADMISIÓN UNIVERSITARIA</span>
                            <h2 class="text-2xl font-black text-white font-sans flex items-center gap-2">
                                <i class="fa-solid fa-clock-rotate-left text-amber-400"></i> Hitos de Examen & Cierre Familiar
                            </h2>
                        </div>
                        <button onclick="RutaVocacionalEngine.abrirInformePadresModal()" class="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0">
                            <i class="fa-solid fa-file-pdf"></i>
                            <span>DESCARGAR INFORME PARA PADRES (PDF)</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <span class="text-amber-400 font-bold block uppercase">Hito 1: Cierre Diagnóstico Vocacional</span>
                            <p class="text-slate-300">Hoja de ruta tetra-factorial establecida y fijación de la Misión Principal.</p>
                            <span class="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                                ${window.DanteVectorIcons ? DanteVectorIcons.check({ size: 13, color: '#10b981' }) : ''}
                                <span>Completado Hoy</span>
                            </span>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                            <span class="text-amber-400 font-bold block uppercase">Hito 2: Fase de Cosecha de Puntos (30 Días)</span>
                            <p class="text-slate-300">Ejecución de dosis diaria en el Motor Adaptativo TRI 3PL en materias críticas.</p>
                            <span class="text-[10px] text-amber-400 font-bold flex items-center gap-1.5">
                                ${window.DanteVectorIcons ? DanteVectorIcons.clock({ size: 13, color: '#f59e0b' }) : ''}
                                <span>En Curso</span>
                            </span>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <span class="text-amber-400 font-bold block uppercase">Hito 3: Aplicación Examen Oficial</span>
                            <p class="text-slate-300">Prueba Saber 11 / Examen de Admisión UNAL - UdeA.</p>
                            <span class="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                                ${window.DanteVectorIcons ? DanteVectorIcons.calendar({ size: 13, color: '#94a3b8' }) : ''}
                                <span>Cuenta Regresiva Activa</span>
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Configuración de Escenarios Reales para Micro-Simulaciones Operativas ("Un día en tus zapatos")
    static MICRO_SIM_CASES = {
        medicina: {
            id: 'medicina',
            titulo: 'Urgencia Táctica: Triaje de Falla Multiorgánica',
            areaLabel: 'Medicina Intensiva & Reanimación',
            badgeColor: 'text-cyan-300 bg-cyan-950 border-cyan-500/40',
            headerColor: 'text-cyan-300',
            iconFa: 'fa-user-doctor text-cyan-400',
            escenario: 'Un paciente masculino de 52 años ingresa a Reanimación con shock séptico refractario a líquidos. Signos vitales: Presión Arterial Media (PAM) 52 mmHg, Frecuencia Cardíaca 128 bpm, Lactato Sérico 5.2 mmol/L. El monitoreo refleja hipoperfusión tisular crítica.',
            pregunta: 'El contador marca 60 segundos antes de colapso hemodinámico irreversible. ¿Cuál es tu primera decisión clínica bajo presión de tiempo?',
            opciones: [
                {
                    id: 'med_1',
                    texto: 'Administrar Infusión Continua de Norepinefrina titular a PAM ≥ 65 mmHg + bolo de Cristaloides.',
                    correcta: true,
                    afinidad: 96,
                    ptsBonus: 35,
                    feedback: '¡Decisión Táctica Impecable! Restauraste el tono vascular arterial sin sobrecargar la cavidad derecha. Demostraste alta templanza en medicina crítica bajo estrés severo.'
                },
                {
                    id: 'med_2',
                    texto: 'Iniciar Intubación Orotraqueal de secuencia rápida inmediatamente sin estabilizar vasopresores.',
                    correcta: false,
                    afinidad: 62,
                    ptsBonus: 15,
                    feedback: 'Advertencia Táctica: La inducción anestésica en hipotensión severa sin soporte vasopresor previo puede provocar paro cardíaco por colapso cardiovascular.'
                },
                {
                    id: 'med_3',
                    texto: 'Solicitar ecocardiograma transtorácico de urgencia y esperar reporte de laboratorio central.',
                    correcta: false,
                    afinidad: 38,
                    ptsBonus: 5,
                    feedback: 'Falla por Parálisis de Análisis: En la urgencia vital, esperar estudios no indispensables retrasa la reanimación e incrementa la mortalidad.'
                }
            ]
        },
        ingenieria: {
            id: 'ingenieria',
            titulo: 'Equipo saturado: ¿priorizas el servicio o la calidad?',
            areaLabel: 'Arquitectura de Software & Sistemas IA',
            badgeColor: 'text-amber-300 bg-amber-950 border-amber-500/40',
            headerColor: 'text-amber-300',
            iconFa: 'fa-laptop-code text-amber-400',
            escenario: 'El microservicio principal de la pasarela de pagos experimenta latencia de 9,200 ms. El dashboard de monitoreo Grafana alerta sobre agotamiento de memoria (OOM Kills) en la base de datos distribuida por un pico de concurrencia.',
            pregunta: 'El SLA corporativo vence en 60 segundos antes de la caída masiva del servicio. ¿Cuál es tu plan de remediación en producción?',
            opciones: [
                {
                    id: 'ing_1',
                    texto: 'Refactorizar el pool de conexiones (Connection Pool) a límite adaptativo y activar el Circuit Breaker de aislamiento.',
                    correcta: true,
                    afinidad: 98,
                    ptsBonus: 35,
                    feedback: '¡Diagnóstico y Mitigación Élite! Aislarte la cascada de fallas y recuperaste la respuesta del cluster en 38ms. Demostraste alta capacidad de arquitectura lógica.'
                },
                {
                    id: 'ing_2',
                    texto: 'Lanzar un reinicio masivo en caliente de todos los pods del clúster sin drenar las peticiones en vuelo.',
                    correcta: false,
                    afinidad: 58,
                    ptsBonus: 15,
                    feedback: 'Riesgo Táctico Elevado: Reiniciar pods con peticiones activas interrumpe transacciones en vuelo, provocando inconsistencia de estados y pánico en clientes.'
                },
                {
                    id: 'ing_3',
                    texto: 'Duplicar la memoria RAM de los nodos Kubernetes sin auditar la consulta SQL bloqueante.',
                    correcta: false,
                    afinidad: 45,
                    ptsBonus: 5,
                    feedback: 'Solución Ineficiente: Aumentar hardware oculta temporalmente la fuga sin resolver el deadlock, incrementando costos de nube sin solucionar la raíz.'
                }
            ]
        },
        derecho: {
            id: 'derecho',
            titulo: 'Litigio Algorítmico: Responsabilidad de IA',
            areaLabel: 'Derecho & Bioética de Tecnologías',
            badgeColor: 'text-purple-300 bg-purple-950 border-purple-500/40',
            headerColor: 'text-purple-300',
            iconFa: 'fa-gavel text-purple-400',
            escenario: 'Un algoritmo bancario de Inteligencia Artificial para aprobación crediticia rechazó masivamente a solicitantes de zonas rurales. El banco alega "secreto comercial y caja negra" sobre el modelo neuronal.',
            pregunta: 'Dispones de 60 segundos ante el juez constitucional para fundamentar la medida cautelar. ¿Qué principio invocas?',
            opciones: [
                {
                    id: 'der_1',
                    texto: 'Incarar la vulneración del derecho a la explicabilidad y solicitar peritaje por discriminación indirecta (proxy bias) bajo la Ley de Protección de Datos.',
                    correcta: true,
                    afinidad: 95,
                    ptsBonus: 35,
                    feedback: '¡Argumentación Jurídica Impecable! Lograste la orden de auditoría algorítmica y protección de derechos fundamentales. Demostraste alta agudeza ética y pensamiento crítico.'
                },
                {
                    id: 'der_2',
                    texto: 'Argumentar que los modelos de Machine Learning no poseen personería jurídica para ser demandados.',
                    correcta: false,
                    afinidad: 52,
                    ptsBonus: 15,
                    feedback: 'Fundamentación Desenfocada: El objeto de la demanda es la responsabilidad civil y constitucional de la entidad operadora, no del software.'
                },
                {
                    id: 'der_3',
                    texto: 'Aceptar el secreto comercial del banco y solicitar una compensación monetaria simbólica sin auditar el código.',
                    correcta: false,
                    afinidad: 32,
                    ptsBonus: 5,
                    feedback: 'Abandono de Interés Público: Aceptar la opacidad algorítmica perpetúa el sesgo sistémico sobre futuros usuarios vulnerables.'
                }
            ]
        }
    };

    static microSimTimerInterval = null;
    static microSimTimeLeft = 60;
    static microSimCurrentArea = null;

    /**
     * Ejecutar reto interactivo de Micro-Simulación ("Un Día en tus Zapatos")
     */
    static ejecutarMicroSimulacion(area) {
        const caseData = this.MICRO_SIM_CASES[area];
        if (!caseData) return;

        this.microSimCurrentArea = area;
        this.microSimTimeLeft = 60;
        if (this.microSimTimerInterval) {
            clearInterval(this.microSimTimerInterval);
        }

        const modal = document.getElementById('modalMicroSimulacion');
        const content = document.getElementById('modalMicroSimContent');
        if (!modal || !content) return;

        this.renderizarVistaRetoMicroSim(caseData);
        modal.classList.remove('hidden');

        // Iniciar temporizador de 60 segundos
        this.microSimTimerInterval = setInterval(() => {
            this.microSimTimeLeft--;
            const timerValEl = document.getElementById('microSimTimerVal');
            const timerBarEl = document.getElementById('microSimTimerBar');
            
            if (timerValEl) timerValEl.innerText = `${this.microSimTimeLeft}s`;
            if (timerBarEl) timerBarEl.style.width = `${(this.microSimTimeLeft / 60) * 100}%`;

            if (this.microSimTimeLeft <= 0) {
                clearInterval(this.microSimTimerInterval);
                this.evaluarOpcionMicroSim('timeout');
            }
        }, 1000);
    }

    /**
     * Renderizar vista inicial de decisión táctica del reto
     */
    static renderizarVistaRetoMicroSim(caseData) {
        const content = document.getElementById('modalMicroSimContent');
        if (!content) return;

        content.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${caseData.iconFa} text-xl"></i>
                    <div>
                        <span class="text-[10px] font-mono font-bold uppercase tracking-wider ${caseData.headerColor}">${caseData.areaLabel}</span>
                        <h2 class="text-base sm:text-lg font-black text-white font-sans">${caseData.titulo}</h2>
                    </div>
                </div>
                <button type="button" onclick="RutaVocacionalEngine.cerrarMicroSimModal()" class="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- CONTADOR REGRESIVO Y BARRA DE TIEMPO -->
            <div class="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div class="flex items-center justify-between text-xs font-mono">
                    <span class="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-stopwatch text-amber-400 animate-pulse"></i> TIEMPO RESTANTE PARA DECISIÓN TÁCTICA:
                    </span>
                    <span class="text-amber-300 font-black" id="microSimTimerVal">60s</span>
                </div>
                <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div id="microSimTimerBar" class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-1000" style="width: 100%;"></div>
                </div>
            </div>

            <!-- ESCENARIO CLINICO / TÉCNICO / JURÍDICO -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span class="text-[10px] font-mono font-bold text-amber-400 uppercase block">📋 ESCENARIO REAL DE TRABAJO:</span>
                <p class="text-xs text-slate-300 leading-relaxed font-sans">${caseData.escenario}</p>
            </div>

            <!-- PREGUNTA DE IMPACTO -->
            <div class="space-y-3">
                <p class="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-circle-question text-cyan-400"></i> ${caseData.pregunta}
                </p>

                <div class="space-y-2">
                    ${caseData.opciones.map((opt, idx) => `
                        <button type="button" onclick="RutaVocacionalEngine.evaluarOpcionMicroSim('${opt.id}')" class="w-full text-left p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs font-sans transition-all cursor-pointer flex items-start gap-3 group">
                            <span class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-amber-400">
                                ${String.fromCharCode(65 + idx)}
                            </span>
                            <span class="pt-0.5 leading-snug">${opt.texto}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Evaluar la opción seleccionada por el estudiante
     */
    static evaluarOpcionMicroSim(opcionId) {
        if (this.microSimTimerInterval) {
            clearInterval(this.microSimTimerInterval);
        }

        const area = this.microSimCurrentArea;
        const caseData = this.MICRO_SIM_CASES[area];
        if (!caseData) return;

        let selectedOpt = caseData.opciones.find(o => o.id === opcionId);
        if (!selectedOpt) {
            selectedOpt = {
                texto: 'Tiempo Agotado sin tomar decisión',
                correcta: false,
                afinidad: 25,
                ptsBonus: 0,
                feedback: 'Parálisis por Presión: Excediste el límite de 60 segundos. En escenarios de alta exigencia, dudar sin ejecutar incrementa el riesgo de colapso operativo.'
            };
        }

        const content = document.getElementById('modalMicroSimContent');
        if (!content) return;

        content.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${caseData.iconFa} text-xl"></i>
                    <div>
                        <span class="text-[10px] font-mono font-bold uppercase tracking-wider ${caseData.headerColor}">${caseData.areaLabel}</span>
                        <h2 class="text-base sm:text-lg font-black text-white font-sans">Resultado del Reto Operativo</h2>
                    </div>
                </div>
                <button type="button" onclick="RutaVocacionalEngine.cerrarMicroSimModal()" class="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- RESULTADO DE AFINIDAD -->
            <div class="p-5 rounded-xl bg-slate-950 border ${selectedOpt.correcta ? 'border-emerald-500/50' : 'border-amber-500/50'} space-y-4">
                <div class="flex items-center justify-between">
                    <span class="px-3 py-1 rounded-full text-xs font-mono font-bold ${selectedOpt.correcta ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">
                        ${selectedOpt.correcta ? '✓ DECISIÓN MISIONAL CORRECTA' : '⚠ EVALUACIÓN OPERATIVA'}
                    </span>
                    <span class="text-xs font-mono text-emerald-400 font-bold">+${selectedOpt.ptsBonus} PTS AFINIDAD REAL</span>
                </div>

                <div class="space-y-1.5">
                    <div class="flex justify-between text-xs font-mono">
                        <span class="text-slate-400 uppercase">Afinidad de Trabajo Real con la Profesión:</span>
                        <span class="text-emerald-400 font-black">${selectedOpt.afinidad}%</span>
                    </div>
                    <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-1000" style="width: ${selectedOpt.afinidad}%;"></div>
                    </div>
                </div>

                <div class="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <span class="text-[10px] font-mono font-bold text-amber-400 uppercase block">ANÁLISIS DE IMPACTO EN EL MUNDO REAL:</span>
                    <p class="text-xs text-slate-200 leading-relaxed font-sans">${selectedOpt.feedback}</p>
                </div>
            </div>

            <button type="button" onclick="RutaVocacionalEngine.cerrarMicroSimModal()" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer">
                CERRAR Y GUARDAR EN MI PERFIL VOCACIONAL
            </button>
        `;

        // Actualizar banner de resultado en la página principal
        const resultContainer = document.getElementById('containerMicroSimResult');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div class="space-y-1">
                        <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">RETO OPERATIVO COMPLETADO: ${caseData.areaLabel}</span>
                        <p class="text-xs text-slate-200 font-sans">${selectedOpt.feedback}</p>
                    </div>
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-extrabold text-xs shrink-0">
                        ${selectedOpt.afinidad}% AFINIDAD REAL
                    </span>
                </div>
            `;
            resultContainer.classList.remove('hidden');
        }

        // Persistir el resultado
        try {
            const savedResult = {
                area: area,
                afinidad: selectedOpt.afinidad,
                feedback: selectedOpt.feedback,
                timestamp: Date.now()
            };
            localStorage.setItem('dante_microsim_result', JSON.stringify(savedResult));
        } catch (e) {
            console.warn('[RutaVocacionalEngine] No se pudo guardar resultado en localStorage:', e);
        }
    }

    /**
     * Cerrar modal de micro-simulación
     */
    static cerrarMicroSimModal() {
        if (this.microSimTimerInterval) {
            clearInterval(this.microSimTimerInterval);
        }
        const modal = document.getElementById('modalMicroSimulacion');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Guardar prescripción de entrenamiento en localStorage y navegar al Motor CAT en index.html
     */
    static iniciarDosisCAT() {
        const targetData = {
            studentId: this.state.studentId,
            targetCareerId: this.state.targetCareerId,
            timestamp: Date.now(),
            mode: 'vocational_gap_dose'
        };
        localStorage.setItem('dante_vocational_target', JSON.stringify(targetData));
        window.location.href = 'index.html?mode=cat_vocational';
    }

    /**
     * Abrir modal con Informe Ejecutivo Vocacional para Padres
     */
    static abrirInformePadresModal() {
        const modal = document.getElementById('modalInformePadres');
        const content = document.getElementById('modalInformeContent');
        if (!modal || !content) return;

        const dateStr = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

        // Obtener datos reales guardados del estudiante
        const nombreEstudiante = localStorage.getItem('dante_student_name') || 'Aspirante Registrado DANTE OS';
        const carreraTarget = localStorage.getItem('dante_carrera_objetivo') || 'Medicina / Ing. Sistemas';
        const uniTarget = localStorage.getItem('dante_universidad_objetivo') || 'Universidad Nacional de Colombia (UNAL)';
        const scoreDiag = parseInt(localStorage.getItem('dante_score_diagnostico') || '320', 10);
        const scoreCorte = parseInt(localStorage.getItem('dante_corte_objetivo') || '365', 10);
        const brechaPts = Math.max(0, scoreCorte - scoreDiag);
        const dosisDiaria = localStorage.getItem('dante_dosis_prescrita_diaria') || '15 a 20';

        // Intentar parsear resultado de micro-simulación si existe
        let microSimResultHtml = '';
        try {
            const rawSim = localStorage.getItem('dante_microsim_result');
            if (rawSim) {
                const parsedSim = JSON.parse(rawSim);
                if (parsedSim && parsedSim.afinidad) {
                    microSimResultHtml = `
                        <div class="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs font-mono space-y-1 mt-2">
                            <div class="flex items-center justify-between text-emerald-400 font-bold">
                                <span>✓ RETO OPERATIVO PRÁCTICO EVALUADO: ${parsedSim.area.toUpperCase()}</span>
                                <span>${parsedSim.afinidad}% AFINIDAD REAL</span>
                            </div>
                            <p class="text-slate-300 font-sans text-[11px] leading-relaxed">${parsedSim.feedback}</p>
                        </div>
                    `;
                }
            }
        } catch (e) {
            // Ignore parsing error
        }

        // Generar Hash único de Certificado
        const certCode = `DANTE-VOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        content.innerHTML = `
            <div id="printableParentReport" class="space-y-6 text-slate-100 text-left font-sans relative">
                
                <!-- ENCABEZADO INSTITUCIONAL DE ALTA PRESTANCIA -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-amber-500 pb-4 gap-3">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2.5">
                            <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-mono font-black flex items-center justify-center text-xl shadow-md">D</span>
                            <div>
                                <span class="font-mono font-black text-xl sm:text-2xl text-white tracking-wide">DANTE OS Enterprise</span>
                                <span class="text-[10px] font-mono text-emerald-400 block font-bold uppercase tracking-widest">SISTEMA ADAPTATIVO DE ORIENTACIÓN VOCACIONAL v23.1</span>
                            </div>
                        </div>
                        <p class="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">INFORME EJECUTIVO DE DIAGNÓSTICO VOCACIONAL Y ADMISIÓN</p>
                    </div>
                    <div class="text-left sm:text-right font-mono text-xs text-slate-400 space-y-0.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shrink-0">
                        <p><span class="text-slate-500">FECHA EXPEDICIÓN:</span> <strong class="text-white">${dateStr}</strong></p>
                        <p><span class="text-slate-500">CÓDIGO DIGITAL:</span> <strong class="text-amber-400">${certCode}</strong></p>
                        <p><span class="text-slate-500">SITUACIÓN:</span> <span class="text-emerald-400 font-bold">AUTENTICADO PSICOMÉTRICO</span></p>
                    </div>
                </div>

                <!-- 1. RESUMEN DEL ASPIRANTE Y DIPLOMA OBJETIVO -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono shadow-inner">
                    <div class="space-y-1.5">
                        <span class="text-slate-400 uppercase tracking-wider block text-[10px]">Aspirante Evaluado:</span>
                        <strong class="text-white text-base font-sans block">${nombreEstudiante}</strong>
                        <div class="flex items-center gap-2 pt-1 text-[11px]">
                            <span class="text-slate-400">Puntaje Diagnóstico CAT:</span>
                            <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">${scoreDiag} / 500 Pts</span>
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <span class="text-slate-400 uppercase tracking-wider block text-[10px]">Carrera & Universidad Meta:</span>
                        <strong class="text-amber-300 text-sm font-sans block leading-tight">${carreraTarget}</strong>
                        <span class="text-slate-300 text-[11px] block">${uniTarget}</span>
                        <div class="flex items-center gap-2 pt-1 text-[11px]">
                            <span class="text-slate-400">Puntaje Corte Oficial:</span>
                            <span class="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300 font-bold">${scoreCorte} Pts</span>
                            <span class="text-emerald-400 font-bold">(Brecha: -${brechaPts} Pts)</span>
                        </div>
                    </div>
                </div>

                <!-- 2. SÍNTESIS DE COMPATIBILIDAD VOCACIONAL (4 VECTORES) -->
                <div class="space-y-2">
                    <h3 class="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-amber-400"></i> 1. Síntesis de Compatibilidad Vocacional (Modelo Tetra-Factorial)
                    </h3>
                    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
                        <p>
                            El aspirante ha sido evaluado mediante la batería psicométrica de 4 vectores de DANTE OS. Su perfil refleja alta afinidad por programas de exigencia analítica e investigación (<strong>Holland RIASEC: IRS / IRC</strong>), acompañado de excelente resiliencia emocional ante el estrés de examen (<strong>Big Five / OCEAN</strong>).
                        </p>
                        ${microSimResultHtml}
                    </div>
                </div>

                <!-- 3. MATRIZ DE 3 ÓRBITAS -->
                <div class="space-y-3">
                    <h3 class="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-arrows-to-eye text-amber-400"></i> 2. Estrategia de Admisión en 3 Órbitas de Selección
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div class="p-3.5 rounded-xl bg-slate-950 border border-amber-500/50 space-y-1">
                            <span class="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                                ${window.DanteVectorIcons ? DanteVectorIcons.target({ size: 14, color: '#f59e0b' }) : '<i class="fa-solid fa-bullseye"></i>'}
                                <span>Misión Principal</span>
                            </span>
                            <p class="text-white font-sans font-bold text-xs mt-1 leading-snug">${carreraTarget}</p>
                            <span class="text-[10px] text-slate-400 block mt-1">Corte: ${scoreCorte} Pts • Brecha actual: -${brechaPts} Pts</span>
                        </div>

                        <div class="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/50 space-y-1">
                            <span class="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                                ${window.DanteVectorIcons ? DanteVectorIcons.shield({ size: 14, color: '#10b981' }) : '<i class="fa-solid fa-shield"></i>'}
                                <span>Misión de Resguardo</span>
                            </span>
                            <p class="text-white font-sans font-bold text-xs mt-1 leading-snug">Ingeniería / Licenciatura Aliada</p>
                            <span class="text-[10px] text-emerald-300 block mt-1">Calificación Asegurada Hoy (${scoreDiag} Pts)</span>
                        </div>

                        <div class="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/50 space-y-1">
                            <span class="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                                ${window.DanteVectorIcons ? DanteVectorIcons.rocket({ size: 14, color: '#38bdf8' }) : '<i class="fa-solid fa-rocket"></i>'}
                                <span>Misión Transversal</span>
                            </span>
                            <p class="text-white font-sans font-bold text-xs mt-1 leading-snug">Carrera Híbrida Emergente 2030+</p>
                            <span class="text-[10px] text-cyan-300 block mt-1">Inmune a Automatización IA (95% Resiliencia)</span>
                        </div>
                    </div>
                </div>

                <!-- 4. PLAN DE ACCIÓN RECOMENDADO PARA LA FAMILIA -->
                <div class="space-y-2">
                    <h3 class="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-user-gear text-amber-400"></i> 3. Plan de Acompañamiento Familiar & Dosis Adaptativa
                    </h3>
                    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
                        <p>
                            Para cerrar la brecha de <strong>-${brechaPts} Pts</strong> antes de la prueba oficial, se ha prescrito una rutina diaria de <strong>${dosisDiaria} reactivos adaptativos</strong> en la Sala CAT. La familia debe garantizar un espacio de 25 minutos diarios sin distracciones para asegurar el hábito de entrenamiento sináptico.
                        </p>
                    </div>
                </div>

                <!-- SECCIÓN DE FIRMAS Y CERTIFICACIÓN PARA IMPRESIÓN -->
                <div class="pt-6 border-t border-slate-800 space-y-4">
                    <div class="grid grid-cols-2 gap-8 pt-4 text-center text-xs font-mono">
                        <div class="border-t border-slate-600 pt-2 space-y-0.5">
                            <p class="text-white font-bold font-sans">${nombreEstudiante}</p>
                            <span class="text-slate-400 text-[10px] block">Firma Padre / Acudiente Responsable</span>
                        </div>
                        <div class="border-t border-slate-600 pt-2 space-y-0.5">
                            <p class="text-amber-400 font-bold font-sans">Comité de Orientación Vocacional</p>
                            <span class="text-slate-400 text-[10px] block">DANTE OS Enterprise Engine</span>
                        </div>
                    </div>

                    <!-- PIE DE ACCIONES Y CERTIFICACIÓN -->
                    <div class="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-4 text-[10px] font-mono text-slate-500 gap-3">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-shield-halved text-emerald-400 text-base"></i>
                            <span>Certificación Psicométrica Digital Validada • DANTE OS Enterprise</span>
                        </div>
                        <div class="flex items-center gap-2.5 modal-print-actions">
                            <button type="button" onclick="RutaVocacionalEngine.imprimirInformePadres()" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2">
                                <i class="fa-solid fa-print"></i>
                                <span>Imprimir / Guardar PDF</span>
                            </button>
                            <button type="button" onclick="RutaVocacionalEngine.cerrarInformePadresModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold text-xs uppercase transition-all cursor-pointer">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * Cerrar modal del informe para padres
     */
    static cerrarInformePadresModal() {
        const modal = document.getElementById('modalInformePadres');
        if (modal) modal.classList.add('hidden');
    }

    /**
     * Ejecutar la impresión directa o guardado en PDF del informe
     */
    static imprimirInformePadres() {
        window.print();
    }

    static getHollandLabel(key) {
        const labels = {
            R: 'Realista',
            I: 'Investigador',
            A: 'Artístico',
            S: 'Social',
            E: 'Emprendedor',
            C: 'Convencional'
        };
        return labels[key] || key;
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('secSimuladorTactico')) {
        RutaVocacionalEngine.init();
    }
});

// Exponer globalmente
window.RutaVocacionalEngine = RutaVocacionalEngine;

