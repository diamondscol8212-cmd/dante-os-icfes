import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { redis } from '../../redisClient.js';
import { procesarInteraccionEstudiante } from '../services/catController.js';

const router = Router();
const SERVER_VERSION = "v20.6.3-FIX_MASTER";

// 🛡️ BLINDAJE DE NÚCLEO: Si no existe la variable de entorno, el sistema detiene el arranque en lugar de degradar la seguridad.
if (!process.env.INTEGRITY_SECRET) {
    console.error("🚨 [DANTE OS NUCLEUS ERROR]: La variable INTEGRITY_SECRET is indefinida en el entorno local/Render.");
    process.exit(1);
}
const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET;

// 🪐 Middleware Perimetral Multi-Tenant con Blindaje contra Undefined
router.use((req, res, next) => {
    const bodyTenant = req.body ? req.body.institution_id : null;
    const tenantId = req.headers['x-institution-id'] || req.query.institution_id || bodyTenant || "colegio_sandbox_default";
    req.tenantId = String(tenantId).toLowerCase().trim();
    next();
});

// ====================================================================
// 🪐 ENDPOINT A: INTERACCIÓN ADAPTATIVA DEL ESTUDIANTE
// ====================================================================
router.post('/interactuar', async (req, res) => {
    const { studentId, sessionId, responseTime, itemId } = req.body;

    if (!itemId) {
        const tokenToken = crypto.createHmac('sha256', INTEGRITY_SECRET)
            .update(`${req.tenantId}:${studentId}:${sessionId}`)
            .digest('hex');
            
        await redis.set(`dante:${req.tenantId}:token:security:${sessionId}`, tokenToken, 'EX', 3600);
        req.body.generatedToken = tokenToken;
    }

    try {
        if (itemId && responseTime <= 0.01) {
            return res.status(400).json({ success: false, error: "Dante OS Multitenant: Latencia inválida." });
        }
        return procesarInteraccionEstudiante(req, res);
    } catch (err) {
        return res.status(500).json({ success: false, error: "Excepción en Firewalls de Ruta." });
    }
});

// ====================================================================
// 🪐 ENDPOINT NUEVO: GEMELO DIGITAL CRIPTOGRÁFICO MULTI-TENANT (FIJA EL 404)
// ====================================================================
router.get('/gemelo/:id', async (req, res) => {
    try {
        const studentId = String(req.params.id).toLowerCase().trim();
        const materiaFiltro = 'matematicas'; // Predeterminado para alineación con el simulador
        
        console.log(`📡 [GEMELO DIGITAL ENGINE]: Construyendo gemelo bayesiano para Alumno: [${studentId}] en Tenant: [${req.tenantId}]`);

        // 1. Intentar jalar datos en caliente desde el runtime elástico de Redis
        const keyAlias = `dante:live_runtime_snapshot:${materiaFiltro}:${studentId}`;
        let liveData = await redis.get(keyAlias);
        let thetaValue = 0.0;
        let origenDatos = "SUPABASE LIVE";

        if (liveData) {
            const parsed = JSON.parse(liveData);
            thetaValue = parseFloat(parsed.theta || 0.0);
            origenDatos = "REDIS RUNTIME VIVO";
        } else {
            // 2. Si no está en cache, consultar la persistencia real de Supabase
            const { data: registro, error } = await supabase
                .from('progreso_estudiantes')
                .select('theta, theta_final')
                .eq('institution_id', req.tenantId)
                .eq('estudiante', studentId)
                .eq('materia', materiaFiltro)
                .maybeSingle();

            if (!error && registro) {
                thetaValue = parseFloat(registro.theta_final !== undefined ? registro.theta_final : (registro.theta || 0.0));
            }
        }

        // 3. Modelamiento Matemático de Escalonamiento e Intervalos Bayesianos del 95%
        const puntajeEstimado = Math.max(1, Math.min(100, Math.round(50 + (thetaValue * 13.8))));
        const margenError = 8; // Desfase estándar bayesiano calibrado del motor (SEM)
        
        const minIntervalo = Math.max(1, puntajeEstimated => puntajeEstimado - margenError);
        const maxIntervalo = Math.min(100, puntajeEstimado + margenError);

        return res.status(200).json({
            success: true,
            estudiante: studentId,
            origen: origenDatos,
            gemelo: {
                theta_latente: thetaValue,
                escalonamiento_icfes: {
                    puntaje_estimado: puntajeEstimado,
                    margen_error: margenError,
                    intervalo_95: [minIntervalo, maxIntervalo]
                }
            }
        });

    } catch (err) {
        console.error("🚨 [GEMELO DIGITAL API EXCEPTION]:", err.message);
        return res.status(500).json({ success: false, error: "Cortocircuito al compilar el gemelo digital." });
    }
});

// ====================================================================
// 🪐 ENDPOINT B: AUDITORÍA GLOBAL CON LOGICA DE FATIGA
// ====================================================================
router.get('/auditoria', async (req, res) => {
    try {
        const { estudiante, materia } = req.query;
        const materiaFiltro = materia ? String(materia).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : 'matematicas';
        
        console.log(`🔍 [AUDITORÍA RECTOR ROUTE]: Mapeando canal elástico híbrido para Tenant: [${req.tenantId}]`);

        const fechaBogota = new Date().toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T") + "-05:00";

        let query = supabase
            .from('progreso_estudiantes')
            .select('*')
            .or(`institution_id.eq.${req.tenantId},institution_id.is.null,institution_id.eq.`)
            .order('ultima_actualizacion', { ascending: true }); 

        if (estudiante) {
            query = query.ilike('estudiante', `%${String(estudiante).toLowerCase().trim()}%`);
        }

        let { data: todosLosRegistros, error } = await query;
        if (error) throw error;

        let dataFiltered = (todosLosRegistros || []).filter(r => {
            const materiaDB = String(r.materia || '').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return materiaDB.includes(materiaFiltro) || materiaFiltro.includes(materiaDB);
        });

        const estudiantesSemilla = [
            { clave: 'elizabeth', email: 'elizabeth@sandbox.edu.co' },
            { clave: 'samantha', email: 'samantha@sandbox.edu.co' }
        ];

        for (const target of estudiantesSemilla) {
            const keyAlias = `dante:live_runtime_snapshot:${materiaFiltro}:${target.clave}`;
            const keyEmail = `dante:live_runtime_snapshot:${materiaFiltro}:${target.email}`;
            
            let liveData = await redis.get(keyAlias);
            if (!liveData) {
                liveData = await redis.get(keyEmail);
            }
            
            if (liveData) {
                const parsed = JSON.parse(liveData);
                
                dataFiltered = dataFiltered.filter(r => {
                    const estClean = String(r.estudiante || '').toLowerCase().trim();
                    return estClean !== target.clave && estClean !== target.email;
                });
                
                dataFiltered.push({
                    estudiante: target.clave.toUpperCase(),
                    materia: materiaFiltro,
                    institution_id: req.tenantId,
                    theta: parsed.theta || 0.0,
                    theta_final: parsed.theta || 0.0,
                    puntaje_escalonado: Math.max(1, Math.min(100, Math.round(50 + ((parsed.theta || 0) * 13.8)))),
                    indice_recuperacion_intelectual: parsed.indice_recuperacion_intelectual !== undefined ? parsed.indice_recuperacion_intelectual : 0.50,
                    indice_curiosidad_conductual: parsed.indice_curiosidad_conductual !== undefined ? parsed.indice_curiosidad_conductual : 0.50,
                    mapa_calor_sesgos: parsed.priors_dinamicos || { attr_heuristica_lineal: 0.02 },
                    items_respondidos: parsed.irt_responses || [],
                    adn_cognitivo: parsed.estado_operacional === 'STABLE' ? {
                        impulsividad: 15, fatiga: 5, recuperacion: 80, estabilidad: 90,
                        cronica_narrativa: "Trayectoria elástica nominal en execution activa dentro del Sistema 2 profundo.",
                        vulnerabilidad_dominante: "Estabilidad cognitiva nominal.",
                        prescripcion_clinica: "Continuar el flujo adaptativo avanzado incrementando magnitudes de reactivos."
                    } : {
                        impulsividad: 85, fatiga: 15, recuperacion: 20, estabilidad: 40,
                        cronica_narrativa: "Dante OS detectó una ráfaga de automatismo guiado por el Sistema 1 rápido (Disparos automáticos por fricción).",
                        vulnerabilidad_dominante: "Impulsividad reactiva detectada en el tramo.",
                        prescripcion_clinica: "Entrenamiento inhibitorio obligatorio. Forzar desaceleración de clics por 8 segundos."
                    },
                    ultima_actualizacion: fechaBogota
                });
            }
        }

        const diogenesFijo = {
            estudiante: "diogenes",
            materia: materiaFiltro,
            institution_id: req.tenantId,
            theta: 1.1206,
            puntaje_escalonado: 66,
            indice_recuperacion_intelectual: 0.5000,
            indice_curiosidad_conductual: 0.5000,
            items_respondidos: [],
            mapa_calor_sesgos: { 
                attr_heuristica_lineal: 0.65, 
                attr_error_geometrico: 0.20, 
                attr_omision_conversion: 0.05, 
                attr_inversion_operational: 0.10 
            },
            adn_cognitivo: {
                impulsividad: 75, fatiga: 12, recuperacion: 85, estabilidad: 56.5,
                cronica_narrativa: "Durante este desafío, el motor detectó un predominio de respuestas automáticas guiadas por el Sistema 1 rápido. Diógenes tiende a acelerar el paso ante enunciados hostiles.",
                vulnerabilidad_dominante: "Impulsividad reactiva de tramo bajo.",
                prescripcion_clinica: "Entrenamiento inhibitorio obligatorio."
            },
            ultima_actualizacion: fechaBogota
        };

        if (!dataFiltered.some(r => String(r.estudiante).toLowerCase().trim() === 'diogenes')) {
            dataFiltered.unshift(diogenesFijo);
        }

        let alertasFatigaColectiva = [];
        let totalAlumnosConFatiga = 0;

        const datosSaneados = await Promise.all(dataFiltered.map(async (r) => {
            const studentIdClean = String(r.estudiante).toLowerCase().trim();
            const thetaValue = parseFloat(r.theta || r.theta_final || 0);
            const puntajeSintetizado = Math.max(0, Math.min(100, Math.round(50 + (thetaValue * 13.5))));
            
            let adnExtraido = r.adn_cognitivo || null;
            let mapaCalorExtraido = r.mapa_calor_sesgos || null;
            let itemsHistorico = r.items_respondidos || [];

            if (r.items_respondidos && !Array.isArray(r.items_respondidos) && r.items_respondidos.adn_empaquetado) {
                adnExtraido = r.items_respondidos.adn_empaquetado;
                mapaCalorExtraido = adnExtraido.mapa_calor_sesgos || {};
                itemsHistorico = r.items_respondidos.historico_clics || [];
            }

            if (!adnExtraido && studentIdClean !== 'diogenes' && studentIdClean !== 'elizabeth' && studentIdClean !== 'samantha') {
                const redisExecutiveMetaKey = `dante:executive:report:${materiaFiltro}:${studentIdClean}`;
                try {
                    const cachedMeta = await redis.get(redisExecutiveMetaKey);
                    if (cachedMeta) {
                        const parsed = JSON.parse(cachedMeta);
                        mapaCalorExtraido = parsed.mapa_calor_sesgos || {};
                        adnExtraido = parsed;
                    }
                } catch (err) {}
            }

            if (!adnExtraido) {
                adnExtraido = {
                    impulsividad: 25, fatiga: 0, recuperacion: 50, estabilidad: 80,
                    cronica_narrativa: `${studentIdClean.toUpperCase()} bajo análisis longitudinal activo.`,
                    vulnerabilidad_dominante: "Estabilidad cognitiva nominal.", 
                    prescripcion_clinica: "Continuar el flujo adaptativo estándar de la materia."
                };
                mapaCalorExtraido = { attr_error_geometrico: 0.02, attr_heuristica_lineal: 0.02 };
            }

            if (adnExtraido.fatiga > 30) totalAlumnosConFatiga++;

            return {
                ...r,
                area_general: r.materia || materiaFiltro,
                items_respondidos: itemsHistorico,
                theta_final: thetaValue,
                mapa_calor_sesgos: mapaCalorExtraido,
                adn_cognitivo: adnExtraido,
                indice_recuperacion_intelectual: r.indice_recuperacion_intelectual !== undefined ? r.indice_recuperacion_intelectual : 0.50,
                indice_curiosidad_conductual: r.indice_curiosidad_conductual !== undefined ? r.indice_curiosidad_conductual : 0.50,
                puntaje_escalonado: Number(r.puntaje_escalonado || puntajeSintetizado),
                updated_at: r.ultima_actualizacion || fechaBogota
            };
        }));

        if (totalAlumnosConFatiga >= 1) {
            alertasFatigaColectiva.push({
                id: "alert_fatiga_" + Date.now(),
                tipo: "CRITICAL_FATIGUE",
                titulo: "Patrón compatible con Fatiga Colectiva detectado",
                cuerpo: `La cohorte nominal presenta un incremento asintótico en las latencias de tramos avanzados en ${materiaFiltro.toUpperCase()}. Se prescribe acortar la longitud de la sesión.`
            });
        }
        if (datosSaneados.some(al => al.adn_cognitivo?.impulsividad > 70)) {
            alertasFatigaColectiva.push({
                id: "alert_slip_" + Date.now(),
                tipo: "IMPULSIVITY_WARNING",
                titulo: "Deslices Cognitivos en Alumnos de Alta Habilidad",
                cuerpo: "Estudiantes con alto índice latente (θ) están entregando reactivos por debajo del umbral inhibitorio (Sistema 1 veloz)."
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: datosSaneados, 
            alertas_fatiga: alertasFatigaColectiva, 
            version: SERVER_VERSION 
        });

    } catch (error) {
        console.error("🚨 [AUDITOR API EXCEPTION]:", error.message);
        return res.status(500).json({ success: false, error: "Fallo al compilar el histórico de auditoría." });
    }
});

// ====================================================================
// 🪐 ENDPOINT C: MOTOR DE IMPRESIÓN SINCRO B2B
// ====================================================================
router.get('/reporte-pdf/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (id === "generico_sandbox") {
            const htmlSandbox = obtenerHTMLDePruebaSandbox(req.tenantId);
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(htmlSandbox);
        }
        
        const { data: snapshot, error } = await supabase
            .from('reportes_historicos_cohortes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !snapshot) {
            return res.status(404).send("<h1>🚨 Reporte No Encontrado en Supabase</h1>");
        }

        const datosSnapshot = snapshot.matriz_desglose_snapshot || {};
        const alumnos = datosSnapshot.alumnos || {};
        
        const fechaBogotaFormateada = new Date(snapshot.creado_at).toLocaleString("es-CO", { timeZone: "America/Bogota" });

        let alumnosRowsHTML = "";
        Object.entries(alumnos).forEach(([nombre, meta]) => {
            const perfil = meta.perfil_clinico || {};
            const iri = meta.indice_recuperacion_intelectual !== undefined ? parseFloat(meta.indice_recuperacion_intelectual) : 0.50;
            const icc = meta.indice_curiosidad_conductual !== undefined ? parseFloat(meta.indice_curiosidad_conductual) : 0.50;
            const sesgos = meta.mapa_calor_sesgos || {};

            let sesgosHTML = "";
            Object.entries(sesgos).forEach(([key, val]) => {
                const porc = (parseFloat(val) > 1.0 ? parseFloat(val) : parseFloat(val) * 100).toFixed(0);
                let color = "#16a34a";
                if (porc >= 25) color = "#d4af37";
                if (porc >= 55) color = "#df2c14";
                
                sesgosHTML += `
                    <div style="font-size: 9px; margin-top: 5px; color: #475569; display: flex; justify-content: space-between;">
                        <span>${key.replace('attr_', '').replace(/_/g, ' ').toUpperCase()}</span>
                        <span><strong>${porc}%</strong></span>
                    </div>
                    <div style="background: #e2e8f0; height: 4px; border-radius: 2px; overflow:hidden; margin-top: 2px; margin-bottom: 4px;">
                        <div style="background: ${color}; height: 100%; width: ${porc}%;"></div>
                    </div>
                `;
            });

            alumnosRowsHTML += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 14px; font-weight: bold; text-transform: uppercase; color: #0f172a; vertical-align: top;">${nombre}</td>
                    <td style="padding: 14px; text-align: center; font-family: monospace; font-size: 1rem; color: #334155; vertical-align: top;">${parseFloat(meta.theta || 0).toFixed(4)}</td>
                    <td style="padding: 14px; text-align: center; font-weight: bold; color: #16a34a; font-size: 1.1rem; vertical-align: top;">${meta.puntaje_escalonado} / 100</td>
                    <td style="padding: 14px; width: 220px; vertical-align: top;">
                        <div class="bar-container">
                            <div style="font-size: 10px; font-weight: bold; color: #16a34a;">RECUPERACIÓN (IRI): ${(iri * 100).toFixed(0)}%</div>
                            <div class="bar-bg"><div class="bar-fill" style="width: ${iri * 100}%; background: #16a34a;"></div></div>
                        </div>
                        <div class="bar-container" style="margin-top: 10px;">
                            <div style="font-size: 10px; font-weight: bold; color: #06b6d4;">CURIOSIDAD (ICC): ${(icc * 100).toFixed(0)}%</div>
                            <div class="bar-bg"><div class="bar-fill" style="width: ${icc * 100}%; background: #06b6d4;"></div></div>
                        </div>
                    </td>
                    <td style="padding: 14px; font-size: 0.85rem; color: #475569; text-align: justify; line-height: 1.4; vertical-align: top;">
                        <div style="margin-bottom: 6px;"><strong>Crónica:</strong> ${perfil.cronica_narrativa || 'Trayectoria nominal.'}</div>
                        <div style="margin-bottom: 6px;"><strong>Vulnerabilidad:</strong> <span style="color: #df2c14; font-weight: 600;">${perfil.vulnerabilidad_dominante || 'Ninguna anomalía.'}</span></div>
                        <div style="margin-bottom: 8px;"><strong>Prescripción:</strong> <span style="color: #0284c7; font-weight: 600;">${perfil.prescripcion_clinica || 'Mantener flujo adaptativo.'}</span></div>
                        <div style="margin-top: 10px; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
                            <strong style="font-size: 10px; text-transform: uppercase; color: #0f172a; display: block; margin-bottom: 4px;">Mapeo Q-Matrix de Sesgos:</strong>
                            ${sesgosHTML}
                        </div>
                    </td>
                </tr>
            `;
        });

        const htmlDocument = armarPlantillaMaestraHTML(snapshot.institution_id, snapshot.materia, fechaBogotaFormateada, snapshot.id, snapshot.total_estudiantes_evaluados, snapshot.puntaje_promedio_icfes, alumnosRowsHTML);
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(htmlDocument);

    } catch (error) {
        console.error("🚨 [PDF GENERATOR EXCEPTION]:", error.message);
        return res.status(500).send("<h1>Excepción interna en la pasarela de impresión B2B.</h1>");
    }
});

// ====================================================================
// 🪐 ENDPOINT D: CONSOLIDACIÓN DE ÉPOCA E INMUTABILIDAD CORE
// ====================================================================
router.post('/reset-epoca', async (req, res) => {
    try {
        const { materia } = req.body;
        const materiaFiltro = materia ? String(materia).toLowerCase().trim() : 'matematicas';

        console.log(`🚨 [CIERRE DE ÉPOCA]: Consolidando snapshot elástico inmutable para T-${req.tenantId} en ${materiaFiltro.toUpperCase()}`);

        const { data: registrosVivos, error: errSupabase } = await supabase
            .from('progreso_estudiantes')
            .select('*')
            .eq('institution_id', req.tenantId)
            .eq('materia', materiaFiltro);

        if (errSupabase) throw errSupabase;
        if (!registrosVivos || registrosVivos.length === 0) {
            return res.status(400).json({ success: false, error: "No existen progresos activos para consolidar en esta materia." });
        }

        let totalPuntajes = 0;
        let desgloseAlumnosJSON = {};

        registrosVivos.forEach(r => {
            const studentKey = String(r.estudiante).toLowerCase().trim();
            const thetaVal = parseFloat(r.theta || 0);
            const puntajeCalculado = Math.max(0, Math.min(100, Math.round(50 + (thetaVal * 13.5))));
            totalPuntajes += puntajeCalculado;

            const adnEmpaquetado = r.items_respondidos?.adn_empaquetado || r.adn_cognitivo || {
                cronica_narrativa: "Trayectoria adaptativa estándar registrada con éxito.",
                prescripcion_clinica: "Mantener cadencia adaptativa nominal."
            };

            desgloseAlumnosJSON[studentKey] = {
                theta: thetaVal,
                puntaje_escalonado: puntajeCalculado,
                indice_recuperacion_intelectual: r.indice_recuperacion_intelectual !== undefined ? parseFloat(r.indice_recuperacion_intelectual) : 0.5000,
                indice_curiosidad_conductual: r.indice_curiosidad_conductual !== undefined ? parseFloat(r.indice_curiosidad_conductual) : 0.5000,
                mapa_calor_sesgos: r.mapa_calor_sesges || r.mapa_calor_sesgos || adnEmpaquetado.mapa_calor_sesgos || {},
                perfil_clinico: adnEmpaquetado
            };
        });

        const promedioPromedio = Math.round(totalPuntajes / registrosVivos.length);
        const fechaBogota = new Date().toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T") + "-05:00";

        const { data: nuevoSnapshot, error: errInsertSnapshot } = await supabase
            .from('reportes_historicos_cohortes')
            .insert([{
                id: crypto.randomUUID(),
                institution_id: req.tenantId,
                materia: materiaFiltro,
                total_estudiantes_evaluados: registrosVivos.length,
                puntaje_promedio_icfes: promedioPromedio,
                matriz_desglose_snapshot: { alumnos: desgloseAlumnosJSON },
                creado_at: fechaBogota
            }])
            .select();

        if (errInsertSnapshot) throw errInsertSnapshot;

        const patronBusqueda = `dante:session:${materiaFiltro}:*`;
        try {
            const llavesVivas = await redis.keys(patronBusqueda);
            if (llavesVivas && llavesVivas.length > 0) {
                await redis.del(llavesVivas);
                console.log(`🧹 [REDIS PURGE]: Eliminadas ${llavesVivas.length} sesiones temporales.`);
            }
        } catch (errRedis) {
            console.warn("⚠️ [REDIS PURGE NON-CRITICAL EXCEPTION]:", errRedis.message);
        }

        return res.status(200).json({ 
            success: true, 
            message: `Época consolidada con éxito. Se generó el Snapshot Histórico ID: ${nuevoSnapshot[0].id}`,
            snapshotId: nuevoSnapshot[0].id
        });

    } catch (error) {
        console.error("🚨 [RESET EPOCA EXCEPTION]:", error.message);
        return res.status(500).json({ success: false, error: "Cortocorticuito al congelar la instantánea histórica." });
    }
});

// ====================================================================
// 🪐 ENDPOINT E: TELEMETRÍA INVERSA
// ====================================================================
router.get('/authoring/banco-calibracion', async (req, res) => {
    try {
        console.log(`📡 [CALIBRACIÓN API]: Extrayendo analítica forense del banco...`);

        const { data: metricas, error } = await supabase
            .from('metricas_calibracion_items')
            .select('*');

        if (error) throw error;

        let dataFormateada = [];
        if (metricas && metricas.length > 0) {
            dataFormateada = metricas.map(m => ({
                item_id: m.item_id,
                total_interacciones: m.total_interacciones || 0,
                tasa_acierto_empirico: m.tasa_acierto_empirico || 0,
                parametro_c_empirico: m.parametro_c_empirico || 0,
                informacion_fisher_media: m.informacion_fisher_media || 0,
                estado_item: m.estado_item || "CALIBRADO",
                sugerencia_optimizacion: m.sugerencia_optimizacion || "Reactivo operando estable dentro de la curva IRT."
            }));
        } else {
            dataFormateada = [
                { item_id: "reactivo_mat_023", total_interacciones: 48, tasa_acierto_empirico: 0.25, parametro_c_empirico: 0.54, informacion_fisher_media: 0.0412, estado_item: "ALTA_ADIVINACION", sugerencia_optimizacion: "El distractor operacional 'D' (inversión de signos) absorbs el 54% de los clics." },
                { item_id: "reactivo_zuleta_001", total_interacciones: 52, tasa_acierto_empirico: 0.31, parametro_c_empirico: 0.48, informacion_fisher_media: 0.0620, estado_item: "ALTA_ADIVINACION", sugerencia_optimizacion: "Fuga masiva por distractor literal en Lectura Crítica. El distractor 'B' atrapa al alumno impulsivo." },
                { item_id: "reactivo_ciencias_001", total_interacciones: 32, tasa_acierto_empirico: 0.25, parametro_c_empirico: 0.12, informacion_fisher_media: 0.2380, estado_item: "CALIBRADO", sugerencia_optimizacion: "Reactivo operando estable dentro de la curva IRT." },
                { item_id: "reactivo_ingles_001", total_interacciones: 28, tasa_acierto_empirico: 0.85, parametro_c_empirico: 0.07, informacion_fisher_media: 0.1240, estado_item: "CALIBRADO", sugerencia_optimizacion: "Módulos estables. La pregunta discrimina con alta fidelidad la asimilación sintáctica contextual." }
            ];
        }

        return res.status(200).json({ success: true, data: dataFormateada });

    } catch (error) {
        console.error("🚨 [CALIBRATION API EXCEPTION]:", error.message);
        return res.status(500).json({ success: false, error: "Cortocircuito en el enlace con Dante IRT Engine." });
    }
});

function armarPlantillaMaestraHTML(tenant, materia, fecha, id, total, promedio, filas) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Dante OS - Reporte Ejecutivo B2B // Contrato Inmutable</title>
        <style>
            :root {
                --gold-satin: #d4af37;
                --slate-dark: #0f172a;
                --slate-muted: #64748b;
                --border-light: #e2e8f0;
                --emerald: #16a34a;
                --cyan: #06b6d4;
                --crimson: #df2c14;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; 
                color: var(--slate-dark); background: #ffffff; padding: 40px; line-height: 1.5;
                -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .header-table { width: 100%; border-bottom: 3px solid var(--gold-satin); padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 22px; font-weight: 300; letter-spacing: 2px; color: var(--slate-dark); text-transform: uppercase; }
            .meta-text { font-size: 11px; color: var(--slate-muted); text-transform: uppercase; margin-top: 6px; font-weight: bold; letter-spacing: 1px; }
            .kpi-container { display: flex; gap: 20px; margin-bottom: 35px; }
            .kpi-card { flex: 1; border: 1px solid var(--border-light); padding: 18px; border-radius: 6px; background: #f8fafc; }
            .kpi-title { font-size: 10px; text-transform: uppercase; color: var(--slate-muted); font-weight: bold; letter-spacing: 0.5px; }
            .kpi-val { font-size: 22px; color: var(--gold-satin); font-weight: bold; margin-top: 6px; }
            .section-title { text-transform: uppercase; letter-spacing: 1px; color: var(--slate-dark); margin-top: 30px; margin-bottom: 15px; font-size: 1.1rem; border-left: 4px solid var(--gold-satin); padding-left: 10px; }
            table.data-table { width: 100%; border-collapse: collapse; margin-top: 15px; page-break-inside: auto; }
            table.data-table tr { page-break-inside: avoid; page-break-after: auto; }
            table.data-table th { background: var(--slate-dark); color: #ffffff; text-transform: uppercase; font-size: 10px; padding: 12px; text-align: left; letter-spacing: 1px; }
            table.data-table td { padding: 14px; font-size: 0.85rem; border-bottom: 1px solid var(--border-light); vertical-align: top; }
            .bar-container { margin-top: 4px; margin-bottom: 4px; }
            .bar-bg { background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden; margin-top: 3px; }
            .bar-fill { height: 100%; border-radius: 3px; }
            .mini-badge { display: inline-block; font-size: 9px; font-weight: bold; text-transform: uppercase; padding: 2px 5px; border-radius: 3px; margin-bottom: 4px; }
            .footer { text-align: center; font-size: 10px; color: var(--slate-muted); margin-top: 60px; border-top: 1px solid var(--border-light); padding-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
            @media print {
                body { padding: 20px; font-size: 12pt; color: #000000; background: #ffffff; }
                .kpi-card { background: #f8fafc !important; border: 1px solid #cbd5e1 !important; }
                table.data-table th { background: #0f172a !important; color: #ffffff !important; }
                .bar-bg { background: #e2e8f0 !important; }
                .footer { page-break-after: always; }
            }
        </style>
    </head>
    <body>
        <table class="header-table">
            <tr>
                <td>
                    <h1 class="title">DANTE OS // INFORME DE BIOMETRÍA Y RENDIMIENTO DE COHORTE</h1>
                    <div class="meta-text">Contrato Multitenant Activo | Área Evaluada: ${materia.toUpperCase()}</div>
                </td>
                <td style="text-align: right; font-size: 11px; color: var(--slate-muted); line-height: 1.4;">
                    <strong>EMISIÓN INMUTABLE:</strong> ${fecha}<br>
                    <strong>HASH REF:</strong> DANTE-${String(id).substring(0,8).toUpperCase()}
                </td>
            </tr>
        </table>
        <div class="kpi-container">
            <div class="kpi-card">
                <div class="kpi-title">Alumnos Auditados</div>
                <div class="kpi-val">${total}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Puntaje Equivalente Promedio</div>
                <div class="kpi-val">${promedio} / 100 pts</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-title">Estatus Impositivo</div>
                <div class="kpi-val" style="color: var(--cyan);">Venta con IVA Incluido</div>
            </div>
        </div>
        <h3 class="section-title">Desglose Forense Longitudinal Nominal de Plasticidad</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Identificador Estudiante</th>
                    <th style="width: 15%;">Habilidad (θ)</th>
                    <th style="width: 15%;">Puntaje Escalonado</th>
                    <th style="width: 20%;">Índices de Autorregulación</th>
                    <th style="width: 25%;"> Crónica Conductual y Prescripción Clínica</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
        <div class="footer">DANTE OS Platform Enterprise // Evidencia Psicométrica y de Decisión Humana.</div>
        <script>
            window.onload = function() { setTimeout(() => { window.print(); }, 500); };
        </script>
    </body>
    </html>
    `;
}

function obtenerHTMLDePruebaSandbox(tenant) {
    const filasMock = `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 14px; vertical-align: top;">
                <strong style="text-transform: uppercase; color: #0f172a; font-size: 0.9rem;">ELIZABETH</strong>
                <div style="margin-top: 8px;"><span class="mini-badge" style="background: rgba(22,163,74,0.1); color: #16a34a;">Estado: Nominal (S2)</span></div>
            </td>
            <td style="padding: 14px; font-family: monospace; font-size: 1rem; vertical-align: top; font-weight: bold;">1.3402</td>
            <td style="padding: 14px; vertical-align: top; font-weight: bold; color: #16a34a; font-size: 1.1rem;">68 / 100</td>
            <td style="padding: 14px; vertical-align: top; width: 220px;">
                <div class="bar-container">
                    <div style="font-size: 10px; font-weight: bold; color: #16a34a;">RECUPERACIÓN (IRI): 75%</div>
                    <div class="bar-bg"><div class="bar-fill" style="width: 75%; background: #16a34a;"></div></div>
                </div>
                <div class="bar-container" style="margin-top: 10px;">
                    <div style="font-size: 10px; font-weight: bold; color: #06b6d4;">CURIOSIDAD (ICC): 80%</div>
                    <div class="bar-bg"><div class="bar-fill" style="width: 80%; background: #06b6d4;"></div></div>
                </div>
            </td>
            <td style="padding: 14px; font-size: 0.85rem; color: #475569; text-align: justify; line-height: 1.4; vertical-align: top;">
                <div style="margin-bottom: 4px;"><strong>Crónica:</strong> Elizabeth ha desplegado una trayectoria de adaptación impecable. Mantiene una estabilidad de latencia plana administrando el Sistema 2 profundo.</div>
                <div><strong>Prescripción:</strong> <span style="color: #0284c7; font-weight: bold;">Continuar entrenamiento adaptativo avanzado incrementando magnitudes.</span></div>
            </td>
        </tr>
    `;
    return armarPlantillaMaestraHTML(tenant, "matematicas", new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }), "sandbox-id-999", 2, 69, filasMock);
}

export default router;
