// 🪐 selectorAdaptativo.js - CAT Engine Multidimensional e Inferencia en RAM (Dante OS v21.0 - Core)
// Sincronizado con el motor matemático real engine3PL.js y optimizado síncronamente con catController.js
import { calcularInformacionFisher, estimarHabilidadEAP } from './src/services/engine3PL.js';

/**
 * Motor de Selección Adaptativo Avanzado v21.0 - Grafo de Conocimiento ICFES en RAM
 * @param {string} studentId - Identificador saneado del estudiante
 * @param {string} area - Área de conocimiento evaluada
 * @param {Array} historialMemoria - Historial de respuestas síncronas en memoria RAM
 * @param {Map} mapaParametrosCache - CACHE_BANCO_ITEMS transferido directamente desde catController.js
 * @returns {Promise<Object>} Payload adaptativo con el ítem óptimo o regla de parada
 */
export async function ejecutarCATBayesianoGlobal(studentId, area, historialMemoria = [], mapaParametrosCache) {
    try {
        // 1. CONTROL DE SEGURIDAD CONTRA CACHÉ VACÍA
        // Si por alguna razón la caché en RAM no se ha poblado o falla, usamos Supabase como fallback seguro para mitigar caídas
        let itemsBanco = [];
        if (mapaParametrosCache && mapaParametrosCache.size > 0) {
            itemsBanco = Array.from(mapaParametrosCache.values());
        } else {
            console.warn("⚠️ [DANTE PERFORMANCE WARN]: Selector operando sin caché RAM caliente. Activando fallback a DB.");
            const { supabase } = await import('./supabaseClient.js');
            const { data, error } = await supabase.from('banco_items_irt').select('*').eq('area_general', area);
            if (error || !data || data.length === 0) throw new Error("Colapso del almacén relacional secundario.");
            itemsBanco = data;
        }

        // 2. FILTRADO DE ITEMS VISTOS Y CLASIFICACIÓN EN BUCKETS DESDE MEMORIA
        const poolEventos = Array.isArray(historialMemoria) ? historialMemoria : [];
        const answeredIds = poolEventos.map(ev => ev.itemId || ev.item_id);

        const bucketsHabilidades = {
            'formulacion y ejecucion': [],         
            'razonamiento y argumentacion': [],    
            'interpretacion y representacion': [],  
            'algebra': [],                          
            'geometria': []                         
        };

        // Reconstrucción instantánea de vectores de aciertos/fallos
        poolEventos.forEach(ev => {
            const idItem = ev.itemId || ev.item_id;
            // Buscamos la especificación técnica en el set de datos localizado
            const itemAsociado = mapaParametrosCache ? mapaParametrosCache.get(idItem) : itemsBanco.find(i => i.id === idItem);
            if (!itemAsociado) return;
            
            const sub = String(itemAsociado.sub_competencia || '').toLowerCase().trim();
            const esCorrectoBooleano = (ev.correcto === true || ev.isCorrect === true || ev.is_correct === true);

            const itemFormateado = {
                id: idItem,
                a: parseFloat(itemAsociado.parametro_a_discriminacion || itemAsociado.a || 1.0),
                b: parseFloat(itemAsociado.parametro_b_dificultad || itemAsociado.b || 0.0),
                c: parseFloat(itemAsociado.parametro_c_adivinacion || itemAsociado.c || 0.25),
                sub_competencia: sub,
                correcto: esCorrectoBooleano
            };

            if (sub === 'algebra' || sub === 'formulacion y ejecucion') {
                bucketsHabilidades['formulacion y ejecucion'].push(itemFormateado);
                bucketsHabilidades['algebra'].push(itemFormateado);
            } else if (sub === 'geometria' || sub === 'razonamiento y argumentacion') {
                bucketsHabilidades['razonamiento y argumentacion'].push(itemFormateado);
                bucketsHabilidades['geometria'].push(itemFormateado);
            } else {
                bucketsHabilidades['interpretacion y representacion'].push(itemFormateado);
            }
        });

        // 3. ESTIMACIÓN DE THETAS GRANULARES (EAP - MULTIDIMENSIONAL)
        const resultadoAlgebra = estimarHabilidadEAP(bucketsHabilidades['algebra']);
        const resultadoGeometria = estimarHabilidadEAP(bucketsHabilidades['geometria']);
        const resultadoEstadistica = estimarHabilidadEAP(bucketsHabilidades['interpretacion y representacion']);

        let thetaAlgebra = resultadoAlgebra.theta;
        let thetaGeometria = resultadoGeometria.theta;
        let thetaEstadistica = resultadoEstadistica.theta;

        console.log(`📊 Grafo Cognitivo REAL -> θ Álgebra: ${thetaAlgebra.toFixed(4)} | θ Geometría: ${thetaGeometria.toFixed(4)}`);

        // Exclusión adaptativa estricta en base al pool cargado
        const itemsDisponibles = itemsBanco.filter(item => !answeredIds.includes(item.id));
        const totalRespondidas = answeredIds.length;

        if (itemsDisponibles.length === 0 || totalRespondidas >= 25) {
            console.log("🟢 [STOP RULE]: Horizonte máximo alcanzado o banco de preguntas agotado.");
            return { 
                detenerExamen: true, 
                thetasFinales: { algebra: thetaAlgebra, geometria: thetaGeometria, estadistica: thetaEstadistica } 
            };
        }

        // 4. ESTRATEGIA MULTIOBJETIVO: Atacar el nodo más débil del grafo cognitivo
        let subCompetenciaObjetivo = 'algebra'; 
        let minThetaCalculado = thetaAlgebra;

        if (thetaGeometria < minThetaCalculado) {
            minThetaCalculado = thetaGeometria;
            subCompetenciaObjetivo = 'geometria';
        }
        if (thetaEstadistica < minThetaCalculado) {
            minThetaCalculado = thetaEstadistica;
            subCompetenciaObjetivo = 'interpretacion y representacion';
        }

        let candidatosFiltrados = itemsDisponibles.filter(item => {
            const subItem = String(item.sub_competencia).toLowerCase().trim();
            if (subCompetenciaObjetivo === 'algebra') {
                return subItem === 'algebra' || subItem === 'formulacion y ejecucion';
            }
            if (subCompetenciaObjetivo === 'geometria') {
                return subItem === 'geometria' || subItem === 'razonamiento y argumentacion';
            }
            return subItem === subCompetenciaObjetivo;
        });
        
        if (candidatosFiltrados.length === 0) {
            candidatosFiltrados = itemsDisponibles;
        }

        // 5. MAXIMIZACIÓN DE LA FUNCIÓN DE INFORMACIÓN DE FISHER
        let maxScoreMomento = -Infinity;
        const candidatosPuntuados = candidatosFiltrados.map(item => {
            const subItem = String(item.sub_competencia).toLowerCase().trim();
            const thetaEspecifico = (subItem === 'geometria' || subItem === 'razonamiento y argumentacion') ? thetaGeometria : 
                                   ((subItem === 'interpretacion y representacion') ? thetaEstadistica : thetaAlgebra);

            const paramA = parseFloat(item.parametro_a_discriminacion || item.a || 1.0);
            const paramB = parseFloat(item.parametro_b_dificultad || item.b || 0.0);
            const paramC = parseFloat(item.parametro_c_adivinacion || item.c || 0.25);

            const fisherInfo = calcularInformacionFisher(thetaEspecifico, paramA, paramB, paramC);

            const scoreCompuesto = fisherInfo;
            if (scoreCompuesto > maxScoreMomento) maxScoreMomento = scoreCompuesto;

            return { ...item, fisherInfo, scoreCompuesto };
        });

        // Selección estocástica controlada dentro del bloque de élite del 90% para evitar sobreexposición de ítems
        const UMBRAL_EFICIENCIA = 0.90;
        const bloqueElite = candidatosPuntuados.filter(c => c.scoreCompuesto >= (maxScoreMomento * UMBRAL_EFICIENCIA));
        const itemGanador = bloqueElite[Math.floor(Math.random() * bloqueElite.length)];

        console.log(`🎯 [DANTE SELECTION]: Reforzando sub-área débil: [${subCompetenciaObjetivo.toUpperCase()}]`);
        console.log(`📝 Asignada en RAM: ID [${itemGanador.id}]`);
        console.log("=====================================================================");

        return { 
            detenerExamen: false, 
            item: {
                id: itemGanador.id,
                pregunta_texto: itemGanador.pregunta_texto || itemGanador.enunciado,
                opciones_respuesta: itemGanador.opciones_respuesta || ["A", "B", "C", "D"],
                sub_competencia: itemGanador.sub_competencia
            }, 
            thetasDinamicos: { algebra: thetaAlgebra, geometria: thetaGeometria, estadistica: thetaEstadistica },
            bayesianSEMProgreso: resultadoAlgebra.bayesianSEM
        };

    } catch (error) {
        console.error("🚨 [CRITICAL FAULT SELECTOR ADAPTATIVO]:", error.message);
        return { detenerExamen: true };
    }
}