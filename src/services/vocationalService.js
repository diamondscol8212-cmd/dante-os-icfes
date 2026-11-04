// /src/services/vocationalService.js - Motor de Orientación Vocacional Tetra-Factorial
// Dante OS v23.1.0 Enterprise Gold
import { supabase } from '../../supabaseClient.js';

// Banco de Mapeos de Decisiones Tácticas de los 12 Escenarios SVG
const SCENARIO_VECTOR_MAP = {
    1: {
        A: { riasec: { I: 8, R: 4 }, ocean: { O: 8, C: 6 }, sjt: 'Investigador Especialista', desc: 'Depuración y optimización de algoritmos' },
        B: { riasec: { A: 9, S: 3 }, ocean: { O: 9, A: 6 }, sjt: 'Diseñador de Interacción', desc: 'Creación de experiencia visual e interfaz' },
        C: { riasec: { S: 8, E: 5 }, ocean: { E: 8, A: 8 }, sjt: 'Mediador Operativo', desc: 'Coordinación del equipo humano' },
        D: { riasec: { E: 8, C: 6 }, ocean: { C: 8, E: 7 }, sjt: 'Líder Directivo', desc: 'Estrategia de lanzamiento y negocio' }
    },
    2: {
        A: { riasec: { R: 9, I: 4 }, ocean: { C: 8, N: 2 }, sjt: 'Investigador Especialista', desc: 'Mantenimiento e infraestructura física' },
        B: { riasec: { I: 9, C: 5 }, ocean: { O: 8, C: 8 }, sjt: 'Investigador Especialista', desc: 'Análisis de datos clínicos y genómicos' },
        C: { riasec: { A: 8, E: 4 }, ocean: { O: 9, E: 6 }, sjt: 'Diseñador de Interacción', desc: 'Redacción de contenidos persuasivos' },
        D: { riasec: { C: 9, E: 3 }, ocean: { C: 9, N: 2 }, sjt: 'Mediador Operativo', desc: 'Auditoría de cumplimiento normativo' }
    },
    3: {
        A: { riasec: { S: 9, I: 3 }, ocean: { A: 9, E: 6 }, sjt: 'Mediador Operativo', desc: 'Diagnóstico y acompañamiento emocional' },
        B: { riasec: { E: 9, S: 4 }, ocean: { E: 9, C: 7 }, sjt: 'Líder Directivo', desc: 'Negociación estratégica internacional' },
        C: { riasec: { I: 8, A: 5 }, ocean: { O: 9, C: 6 }, sjt: 'Investigador Especialista', desc: 'Investigación pura y laboratorio' },
        D: { riasec: { R: 8, C: 5 }, ocean: { C: 8, N: 2 }, sjt: 'Mediador Operativo', desc: 'Operación logística de campo' }
    },
    4: {
        A: { riasec: { A: 9, I: 4 }, ocean: { O: 9, A: 5 }, sjt: 'Diseñador de Interacción', desc: 'Composición artística y audiovisual' },
        B: { riasec: { C: 9, R: 3 }, ocean: { C: 9, N: 2 }, sjt: 'Investigador Especialista', desc: 'Gestión presupuestal y control' },
        C: { riasec: { S: 8, R: 5 }, ocean: { A: 8, E: 6 }, sjt: 'Mediador Operativo', desc: 'Trabajo social comunitario' },
        D: { riasec: { E: 8, I: 5 }, ocean: { E: 8, O: 8 }, sjt: 'Líder Directivo', desc: 'Innovación de modelos de negocio' }
    },
    5: {
        A: { riasec: { I: 9, R: 5 }, ocean: { O: 9, C: 8 }, sjt: 'Investigador Especialista', desc: 'Simulación matemática de modelos' },
        B: { riasec: { S: 8, A: 6 }, ocean: { A: 9, E: 7 }, sjt: 'Mediador Operativo', desc: 'Docencia y formación de talento' },
        C: { riasec: { R: 9, E: 4 }, ocean: { C: 8, E: 6 }, sjt: 'Mediador Operativo', desc: 'Montaje de sistemas mecatrónicos' },
        D: { riasec: { C: 8, S: 5 }, ocean: { C: 9, A: 7 }, sjt: 'Mediador Operativo', desc: 'Estandarización de procesos ISO' }
    },
    6: {
        A: { riasec: { A: 8, E: 6 }, ocean: { O: 9, E: 8 }, sjt: 'Diseñador de Interacción', desc: 'Dirección creativa publicitaria' },
        B: { riasec: { I: 9, S: 4 }, ocean: { O: 8, C: 8 }, sjt: 'Investigador Especialista', desc: 'Bioinformática y salud digital' },
        C: { riasec: { E: 9, C: 5 }, ocean: { E: 9, N: 2 }, sjt: 'Líder Directivo', desc: 'Gerencia de proyectos de alto riesgo' },
        D: { riasec: { R: 8, I: 5 }, ocean: { C: 8, O: 7 }, sjt: 'Investigador Especialista', desc: 'Gestión ambiental y energías renovables' }
    },
    7: {
        A: { riasec: { S: 9, E: 4 }, ocean: { A: 9, E: 7 }, sjt: 'Mediador Operativo', desc: 'Atención al usuario y resolución de conflictos' },
        B: { riasec: { C: 9, I: 4 }, ocean: { C: 9, N: 1 }, sjt: 'Investigador Especialista', desc: 'Análisis financiero y riesgo crediticio' },
        C: { riasec: { R: 8, A: 5 }, ocean: { O: 8, C: 7 }, sjt: 'Diseñador de Interacción', desc: 'Modelado 3D y prototipado físico' },
        D: { riasec: { I: 8, E: 6 }, ocean: { O: 9, C: 7 }, sjt: 'Líder Directivo', desc: 'Investigación de mercados con IA' }
    },
    8: {
        A: { riasec: { I: 9, C: 5 }, ocean: { O: 8, C: 9 }, sjt: 'Investigador Especialista', desc: 'Análisis epidemiológico' },
        B: { riasec: { E: 8, A: 6 }, ocean: { E: 8, O: 8 }, sjt: 'Líder Directivo', desc: 'Estrategia de comunicación política' },
        C: { riasec: { S: 8, R: 4 }, ocean: { A: 9, N: 2 }, sjt: 'Mediador Operativo', desc: 'Rehabilitación y terapia física' },
        D: { riasec: { R: 9, I: 4 }, ocean: { C: 8, N: 2 }, sjt: 'Investigador Especialista', desc: 'Ingeniería agrícola y de alimentos' }
    },
    9: {
        A: { riasec: { A: 9, C: 3 }, ocean: { O: 9, C: 6 }, sjt: 'Diseñador de Interacción', desc: 'Diseño sonoro y musical' },
        B: { riasec: { C: 8, S: 6 }, ocean: { C: 9, A: 8 }, sjt: 'Mediador Operativo', desc: 'Administración en salud pública' },
        C: { riasec: { E: 9, I: 4 }, ocean: { E: 9, C: 7 }, sjt: 'Líder Directivo', desc: 'Fondo de capital de riesgo e inversión' },
        D: { riasec: { I: 8, R: 6 }, ocean: { O: 8, C: 8 }, sjt: 'Investigador Especialista', desc: 'Desarrollo de sensores para IoT' }
    },
    10: {
        A: { riasec: { S: 9, I: 4 }, ocean: { A: 9, O: 8 }, sjt: 'Mediador Operativo', desc: 'Orientación educativa y tutoría' },
        B: { riasec: { R: 9, E: 3 }, ocean: { C: 8, N: 2 }, sjt: 'Mediador Operativo', desc: 'Mantenimiento aeronáutico' },
        C: { riasec: { A: 8, S: 5 }, ocean: { O: 9, A: 8 }, sjt: 'Diseñador de Interacción', desc: 'Diseño de modas y vestuario' },
        D: { riasec: { C: 9, I: 4 }, ocean: { C: 9, N: 1 }, sjt: 'Investigador Especialista', desc: 'Criptografía y seguridad blockchain' }
    },
    11: {
        A: { riasec: { E: 9, R: 4 }, ocean: { E: 9, C: 8 }, sjt: 'Líder Directivo', desc: 'Dirección de operaciones logísticas' },
        B: { riasec: { I: 9, A: 4 }, ocean: { O: 9, C: 8 }, sjt: 'Investigador Especialista', desc: 'Nanotecnología y materiales avanzados' },
        C: { riasec: { S: 8, C: 5 }, ocean: { A: 8, C: 8 }, sjt: 'Mediador Operativo', desc: 'Gestión de recursos humanos' },
        D: { riasec: { R: 8, I: 6 }, ocean: { C: 8, O: 7 }, sjt: 'Investigador Especialista', desc: 'Geología y exploración minera' }
    },
    12: {
        A: { riasec: { A: 9, E: 5 }, ocean: { O: 9, E: 8 }, sjt: 'Diseñador de Interacción', desc: 'Diseño de videojuegos y narrativa' },
        B: { riasec: { I: 9, S: 4 }, ocean: { O: 9, A: 8 }, sjt: 'Investigador Especialista', desc: 'Ética de la IA y gobernanza tecnológica' },
        C: { riasec: { C: 8, R: 5 }, ocean: { C: 9, N: 2 }, sjt: 'Mediador Operativo', desc: 'Cadena de suministro internacional' },
        D: { riasec: { E: 8, S: 6 }, ocean: { E: 8, A: 7 }, sjt: 'Líder Directivo', desc: 'Gestión de ONG y proyectos sociales' }
    }
};

// BANCO EN MEMORIA DE CORTES Y CARRERAS UNIVERSITARIAS EN COLOMBIA
const BANCO_CORTES_FALLBACK = [
    {
        id: 'unal_medicina_bogota',
        carrera_nombre: 'Medicina (Bogotá)',
        universidad_id: 'unal',
        universidad_nombre: 'Universidad Nacional de Colombia',
        area_conocimiento: 'Salud',
        puntaje_corte: 785.50,
        escala_maxima: 1000,
        ponderaciones: { ciencias: 0.35, lectura: 0.30, matematicas: 0.20, sociales: 0.15 },
        holland_ideal: 'IRS',
        ocean_ideal: { O: 85, C: 90, E: 60, A: 85, N: 20 },
        descripcion_real: 'Atención hospitalaria de alta complejidad, diagnóstico clínico y rotaciones quirúrgicas intensivas.',
        salario_promedio_cop: 5200000,
        empleabilidad_pct: 96.5,
        ai_resilience_score: 88.0,
        carrera_hibrida_emergente: false
    },
    {
        id: 'unal_ing_sistemas_bogota',
        carrera_nombre: 'Ingeniería de Sistemas',
        universidad_id: 'unal',
        universidad_nombre: 'Universidad Nacional de Colombia',
        area_conocimiento: 'Ingeniería',
        puntaje_corte: 710.20,
        escala_maxima: 1000,
        ponderaciones: { matematicas: 0.40, ciencias: 0.25, lectura: 0.20, sociales: 0.15 },
        holland_ideal: 'IRC',
        ocean_ideal: { O: 90, C: 85, E: 45, A: 50, N: 25 },
        descripcion_real: 'Arquitectura de software, diseño de algoritmos, ciberseguridad y bases de datos masivas.',
        salario_promedio_cop: 5800000,
        empleabilidad_pct: 97.2,
        ai_resilience_score: 92.5,
        carrera_hibrida_emergente: false
    },
    {
        id: 'udea_medicina_medellin',
        carrera_nombre: 'Medicina (Medellín)',
        universidad_id: 'udea',
        universidad_nombre: 'Universidad de Antioquia',
        area_conocimiento: 'Salud',
        puntaje_corte: 382.00,
        escala_maxima: 500,
        ponderaciones: { ciencias: 0.40, lectura: 0.30, matematicas: 0.15, sociales: 0.15 },
        holland_ideal: 'IRS',
        ocean_ideal: { O: 80, C: 92, E: 65, A: 80, N: 18 },
        descripcion_real: 'Formación médica en redes hospitalarias públicas, investigación clínica y salud comunitaria.',
        salario_promedio_cop: 4800000,
        empleabilidad_pct: 95.0,
        ai_resilience_score: 87.0,
        carrera_hibrida_emergente: false
    },
    {
        id: 'icfes_ing_bionica_bogota',
        carrera_nombre: 'Ingeniería Biónica y Bio-Datos',
        universidad_id: 'icfes_nacional',
        universidad_nombre: 'Universidad Nacional / Pública Aliada',
        area_conocimiento: 'Ingeniería',
        puntaje_corte: 365.00,
        escala_maxima: 500,
        ponderaciones: { matematicas: 0.35, ciencias: 0.35, lectura: 0.20, sociales: 0.10 },
        holland_ideal: 'RIE',
        ocean_ideal: { O: 95, C: 85, E: 55, A: 60, N: 25 },
        descripcion_real: 'Diseño de prótesis inteligentes, robótica médica y análisis algorítmico de señales biológicas.',
        salario_promedio_cop: 6200000,
        empleabilidad_pct: 94.0,
        ai_resilience_score: 96.0,
        carrera_hibrida_emergente: true
    },
    {
        id: 'icfes_derecho_udea',
        carrera_nombre: 'Derecho y Gobernanza de Datos',
        universidad_id: 'udea',
        universidad_nombre: 'Universidad de Antioquia',
        area_conocimiento: 'Sociales',
        puntaje_corte: 335.00,
        escala_maxima: 500,
        ponderaciones: { lectura: 0.40, sociales: 0.35, matematicas: 0.15, ciencias: 0.10 },
        holland_ideal: 'SAE',
        ocean_ideal: { O: 75, C: 85, E: 75, A: 70, N: 30 },
        descripcion_real: 'Litigio constitucional, regulación de propiedad intelectual en IA y defensa de derechos digitales.',
        salario_promedio_cop: 3900000,
        empleabilidad_pct: 88.0,
        ai_resilience_score: 82.0,
        carrera_hibrida_emergente: true
    },
    {
        id: 'icfes_diseno_ux_icfes',
        carrera_nombre: 'Diseño de Interacción & UX Research',
        universidad_id: 'icfes_nacional',
        universidad_nombre: 'Universidad Nacional / Distrital',
        area_conocimiento: 'Arte & Diseño',
        puntaje_corte: 310.00,
        escala_maxima: 500,
        ponderaciones: { lectura: 0.35, sociales: 0.25, matematicas: 0.20, ciencias: 0.20 },
        holland_ideal: 'ASI',
        ocean_ideal: { O: 95, C: 75, E: 60, A: 75, N: 35 },
        descripcion_real: 'Investigación de usuarios, prototipado de interfaces digitales y diseño de experiencias humanas.',
        salario_promedio_cop: 4100000,
        empleabilidad_pct: 91.5,
        ai_resilience_score: 90.0,
        carrera_hibrida_emergente: true
    },
    {
        id: 'icfes_enfermeria_unal',
        carrera_nombre: 'Enfermería',
        universidad_id: 'unal',
        universidad_nombre: 'Universidad Nacional de Colombia',
        area_conocimiento: 'Salud',
        puntaje_corte: 620.00,
        escala_maxima: 1000,
        ponderaciones: { ciencias: 0.35, lectura: 0.30, sociales: 0.20, matematicas: 0.15 },
        holland_ideal: 'SRE',
        ocean_ideal: { O: 70, C: 88, E: 70, A: 90, N: 20 },
        descripcion_real: 'Cuidado intrahospitalario, gestión de pacientes en urgencias y salud pública.',
        salario_promedio_cop: 3200000,
        empleabilidad_pct: 92.0,
        ai_resilience_score: 89.0,
        carrera_hibrida_emergente: false
    }
];

export class VocationalService {

    /**
     * Procesar respuestas del Simulador Táctico de Decisiones
     */
    static processHollandSelections(answers = []) {
        const raw = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const orden = [];
        answers.forEach((ans) => {
            const key = String((ans && (ans.dimension || ans.optionId || ans.letra)) || '')
                .toUpperCase()
                .replace(/[^RIASEC]/g, '')
                .slice(0, 1);
            if (raw[key] === undefined) return;
            if (!orden.includes(key)) orden.push(key);
            raw[key] += Number(ans.val || ans.peso || 1);
        });
        const maxRaw = Math.max(...Object.values(raw), 1);
        const riasec = {};
        Object.keys(raw).forEach((k) => {
            riasec[k] = raw[k] > 0 ? Math.round((raw[k] / maxRaw) * 100) : 0;
        });
        const hollandCode = orden
            .filter((k) => riasec[k] > 0)
            .sort((a, b) => riasec[b] - riasec[a] || orden.indexOf(a) - orden.indexOf(b))
            .slice(0, 3)
            .join('');
        return {
            riasec,
            hollandCode: hollandCode || null,
            ocean: null,
            sjtExecutionStyle: null,
            telemetrySummary: null
        };
    }

    static processScenarioChoices(answers = []) {
        const rawScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const oceanScores = { O: 50, C: 50, E: 50, A: 50, N: 30 };
        const sjtCounts = { 'Investigador Especialista': 0, 'Diseñador de Interacción': 0, 'Mediador Operativo': 0, 'Líder Directivo': 0 };

        let totalLatencyMs = 0;
        let system1Count = 0; // < 2500ms
        let system2Count = 0; // > 8000ms

        answers.forEach(ans => {
            const scenario = SCENARIO_VECTOR_MAP[ans.scenarioId];
            if (!scenario) return;
            const choice = scenario[ans.optionId];
            if (!choice) return;

            const dwellMs = parseInt(ans.dwellTimeMs || 3500, 10);
            totalLatencyMs += dwellMs;

            // Ponderación por Latencia Neuro-Conductual
            let latencyMultiplier = 1.0;
            if (dwellMs < 2500) {
                system1Count++;
                latencyMultiplier = 1.30; // Intuición / Pasión Auténtica
            } else if (dwellMs > 8000) {
                system2Count++;
                latencyMultiplier = 0.85; // Duda / Reflexión Calculada
            }

            // Acumular RIASEC
            Object.entries(choice.riasec).forEach(([key, val]) => {
                if (rawScores[key] !== undefined) {
                    rawScores[key] += val * latencyMultiplier;
                }
            });

            // Acumular Big Five
            Object.entries(choice.ocean).forEach(([key, val]) => {
                if (oceanScores[key] !== undefined) {
                    oceanScores[key] = Math.min(100, oceanScores[key] + (val - 5) * 1.5);
                }
            });

            // Acumular SJT
            if (choice.sjt && sjtCounts[choice.sjt] !== undefined) {
                sjtCounts[choice.sjt]++;
            }
        });

        // Normalizar RIASEC a escala 0-100
        const maxRaw = Math.max(...Object.values(rawScores), 1);
        const normalizedRiasec = {};
        Object.keys(rawScores).forEach(k => {
            normalizedRiasec[k] = Math.round((rawScores[k] / maxRaw) * 100);
        });

        // Determinar Código Holland de 3 letras
        const sortedHolland = Object.entries(normalizedRiasec)
            .sort((a, b) => b[1] - a[1])
            .map(e => e[0]);
        const hollandCode = sortedHolland.slice(0, 3).join('');

        // Determinar Estilo de Ejecución SJT Dominante
        const sjtDominant = Object.entries(sjtCounts)
            .sort((a, b) => b[1] - a[1])[0][0];

        // Diagnóstico de Autenticidad Metacognitiva
        const totalAns = Math.max(answers.length, 1);
        const system1Pct = Math.round((system1Count / totalAns) * 100);
        const system2Pct = Math.round((system2Count / totalAns) * 100);
        const authenticityIndex = Math.min(100, Math.max(50, 100 - Math.round(system2Pct * 0.5)));

        return {
            riasec: normalizedRiasec,
            hollandCode,
            ocean: {
                O: Math.round(oceanScores.O),
                C: Math.round(oceanScores.C),
                E: Math.round(oceanScores.E),
                A: Math.round(oceanScores.A),
                N: Math.round(oceanScores.N)
            },
            sjtExecutionStyle: sjtDominant,
            telemetrySummary: {
                totalLatencyMs,
                avgLatencyMs: Math.round(totalLatencyMs / totalAns),
                system1IntuitivePct: system1Pct,
                system2HesitationPct: system2Pct,
                authenticityIndex
            }
        };
    }

    /**
     * Calcular Afinidad Psicométrica entre Perfil de Usuario y Vector de Carrera
     */
    static calculateAffinity(userRiasec, userOcean, careerHolland, careerOcean) {
        if (!userRiasec || !careerHolland) return null;

        // Vector Holland
        let riasecMatch = 0;
        const charWeights = [0.50, 0.30, 0.20];
        for (let i = 0; i < careerHolland.length; i++) {
            const char = careerHolland[i];
            const score = userRiasec[char] || 0;
            riasecMatch += (score / 100) * charWeights[i];
        }

        // Vector OCEAN
        let oceanMatch = 0;
        if (userOcean && careerOcean) {
            const keys = ['O', 'C', 'E', 'A', 'N'];
            let diffSum = 0;
            keys.forEach(k => {
                const uVal = userOcean[k] || 50;
                const cVal = careerOcean[k] || 50;
                diffSum += Math.abs(uVal - cVal);
            });
            oceanMatch = Math.max(0, 1 - (diffSum / 500));
        }

        const affinityScore = userOcean && careerOcean
            ? Math.round((riasecMatch * 0.65 + oceanMatch * 0.35) * 100)
            : Math.round(riasecMatch * 100);
        return Math.min(99, Math.max(0, affinityScore));
    }

    /**
     * Clasificar Carreras en las 3 Órbitas (Principal, Resguardo, Transversal)
     */
    static async classifyThreeOrbits(studentProfile, projectedScore = 0, targetCareerId = null) {
        let careerList = BANCO_CORTES_FALLBACK;

        // Intentar consultar base de datos Supabase
        try {
            const { data, error } = await supabase
                .from('cortes_historicos_universidades')
                .select('*');
            if (!error && data && data.length > 0) {
                careerList = data;
            }
        } catch {}

        const userRiasec = studentProfile.riasec || null;
        const userOcean = studentProfile.ocean || null;
        const pts = Number(projectedScore) > 0 ? Number(projectedScore) : null;

        const evaluatedCareers = careerList.map(car => {
            const affinity = this.calculateAffinity(userRiasec, userOcean, car.holland_ideal, car.ocean_ideal);
            const mismaEscala = !(Number(car.escala_maxima) > 500 && pts != null && pts <= 500);
            const brecha = pts != null && mismaEscala
                ? Math.round((car.puntaje_corte - pts) * 10) / 10
                : null;

            return {
                id: car.id,
                nombre: car.carrera_nombre,
                universidadId: car.universidad_id,
                universidadNombre: car.universidad_nombre,
                area: car.area_conocimiento,
                puntajeCorte: car.puntaje_corte,
                escalaMaxima: car.escala_maxima,
                puntajeProyectadoActual: pts,
                mismaEscala,
                brechaPuntos: brecha,
                afinidadPct: affinity,
                hollandIdeal: car.holland_ideal,
                descripcionReal: car.descripcion_real,
                salarioPromedioCop: car.salario_promedio_cop,
                empleabilidadPct: car.empleabilidad_pct,
                aiResilienceScore: car.ai_resilience_score,
                isHibrida: car.carrera_hibrida_emergente,
                ponderaciones: car.ponderaciones
            };
        });

        // Ordenar por Afinidad de Personalidad
        evaluatedCareers.sort((a, b) => b.afinidadPct - a.afinidadPct);

        // 🎯 1. MISIÓN PRINCIPAL (Ideal Goal)
        const misionPrincipal = evaluatedCareers.find(c => c.id === targetCareerId) || evaluatedCareers[0];

        // 🛡️ 2. MISIÓN DE RESGUARDO (Safety Net - Afinidad > 85%, brecha alcanzable)
        const misionResguardo = evaluatedCareers.find(c => 
            c.id !== misionPrincipal.id && 
            c.afinidadPct >= 80 && 
            c.brechaPuntos <= 30
        ) || evaluatedCareers.find(c => c.id !== misionPrincipal.id && c.afinidadPct >= 75) || evaluatedCareers[1];

        // 🚀 3. MISIÓN TRANSVERSAL (Hybrid / Emerging 2030+ with high AI resilience)
        const misionTransversal = evaluatedCareers.find(c => 
            c.id !== misionPrincipal.id && 
            c.id !== misionResguardo.id && 
            (c.isHibrida || c.aiResilienceScore >= 88)
        ) || evaluatedCareers[2];

        // Calcular ROI Cognitivo para Misión Principal
        const roiPlan = this.calculateCognitiveROI(misionPrincipal.ponderaciones, misionPrincipal.brechaPuntos);

        return {
            hollandCode: studentProfile.hollandCode || null,
            sjtExecutionStyle: studentProfile.sjtExecutionStyle || null,
            telemetrySummary: studentProfile.telemetrySummary || {},
            orbitas: {
                misionPrincipal: {
                    type: 'MISION_PRINCIPAL',
                    label: 'Misión Principal (Sueño Ideal)',
                    data: misionPrincipal
                },
                misionResguardo: {
                    type: 'MISION_RESGUARDO',
                    label: 'Misión de Resguardo (Avanzas Hoy Mismo)',
                    data: misionResguardo
                },
                misionTransversal: {
                    type: 'MISION_TRANSVERSAL',
                    label: 'Misión Transversal (Carrera Híbrida 2030+)',
                    data: misionTransversal
                }
            },
            roiPlan,
            todasLasCarreras: evaluatedCareers
        };
    }

    /**
     * Calcular Estrategia de ROI Cognitivo (Cierre de Brecha de Menor Esfuerzo)
     */
    static calculateCognitiveROI(ponderaciones = {}, totalGap = null) {
        if (totalGap == null || !Number.isFinite(Number(totalGap))) {
            return {
                estadoBrecha: 'SIN_PUNTAJE',
                mensajeStrategy: 'La brecha aparece cuando hay una proyección medida y un corte en la misma escala.',
                recomendacionMaterias: []
            };
        }
        if (Number(totalGap) <= 0) {
            return {
                estadoBrecha: 'ALCANZADO',
                mensajeStrategy: '¡Felicidades! Tu puntaje proyectado actual supera el corte histórico. Mantén tu entrenamiento constante en la Sala CAT.',
                recomendacionMaterias: []
            };
        }

        const subjectsMap = {
            ciencias: 'Ciencias Naturales',
            lectura: 'Lectura Crítica',
            matematicas: 'Matemáticas & Razonamiento Quantitative',
            sociales: 'Sociales & Ciudadanas',
            ingles: 'Inglés'
        };

        const sortedWeights = Object.entries(ponderaciones)
            .sort((a, b) => b[1] - a[1]);

        const recomendacionMaterias = sortedWeights.map(([key, weight]) => {
            const puntosContribucion = Math.round(totalGap * weight);
            const materiaNombre = subjectsMap[key] || key;

            return {
                materiaKey: key,
                materiaNombre,
                ponderacionPct: Math.round(weight * 100),
                puntosACosechar: puntosContribucion,
                dosisSugeridaDiaria: Math.max(5, Math.round(puntosContribucion / 2))
            };
        });

        const topMateria = recomendacionMaterias[0] || { materiaNombre: 'Ciencias Naturales', ponderacionPct: 35 };

        return {
            estadoBrecha: 'PENDIENTE',
            gapPuntosTotales: totalGap,
            materiaPrioritaria: topMateria.materiaNombre,
            mensajeStrategy: `Para cerrar tu brecha de ${totalGap} puntos de forma óptima, el $${topMateria.ponderacionPct}\\%$ de tus puntos faltantes se recuperan concentrando tu entrenamiento en ${topMateria.materiaNombre}.`,
            recomendacionMaterias
        };
    }
}
