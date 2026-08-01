// 🪐 seeder.js - Inyector Psicométrico Realista con Matriz Q, Mapa de Trampas y Recursos Visuales
// Dante OS Enterprise Edition // Bogotá, Colombia
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';
import { BANCO_COMPLETO } from './bank/index.js';

const INSTITUTION_ID = 'colegio_sandbox_default';
const REACTIVOS_REALES = BANCO_COMPLETO;

async function sembrarBancoSoberano() {
    console.log("🚀 [SIEMBRA DANTE OS]: Limpiando tablas e inyectando banco con matriz Q, metadatos y recurso_visual integrados...");

    try {
        await supabase.from('mapa_trampas_distractores').delete().neq('opcion_marcada', 'CLEAN_ALL');
        await supabase.from('matriz_q_items').delete().neq('attr_heuristica_lineal', -999);
        await supabase.from('banco_items_irt').delete().neq('area_general', 'CLEAN_ALL');

        console.log("🧹 Tablas purgadas con éxito.");

        for (const item of REACTIVOS_REALES) {
            const itemId = crypto.randomUUID();
            const areaNormalized = String(item.area).toLowerCase().trim();
            const arregloOpcionesValido = Array.isArray(item.opciones) ? item.opciones : [item.opciones];

            const { error: errBase } = await supabase.from('banco_items_irt').insert([{
                id: itemId,
                area_general: areaNormalized,
                sub_competencia: item.sub,
                pregunta_texto: item.texto,
                opciones_respuesta: arregloOpcionesValido,
                correcta: item.ok,
                parametro_a_discriminacion: item.a,
                parametro_b_dificultad: item.b,
                parametro_c_adivinacion: item.c,
                matriz_q_items: item.q,
                distractores_metadata: item.trampas,
                recurso_visual: item.recurso_visual || null
            }]);

            if (errBase) throw new Error(`Error en banco_items_irt: ${errBase.message}`);

            if (item.q) {
                await supabase.from('matriz_q_items').insert([{
                    item_id: itemId,
                    attr_heuristica_lineal: item.q.attr_heuristica_lineal || 0,
                    attr_inversion_operacional: item.q.attr_inversion_operacional || 0,
                    attr_omision_conversion: item.q.attr_omision_conversion || 0,
                    attr_error_geometrico: item.q.attr_error_geometrico || 0
                }]).catch(() => {});
            }

            if (Array.isArray(item.trampas)) {
                for (const trampa of item.trampas) {
                    await supabase.from('mapa_trampas_distractores').insert([{
                        item_id: itemId,
                        opcion_marcada: trampa.opcion,
                        vulnera_heuristica_lineal: trampa.vulnera_heuristica_lineal || 0,
                        vulnera_inversion_operacional: trampa.vulnera_inversion_operacional || 0,
                        vulnera_omision_conversion: trampa.vulnera_omision_conversion || 0,
                        vulnera_error_geometrico: trampa.vulnera_error_geometrico || 0
                    }]).catch(() => {});
                }
            }

            console.log(`✅ Ítem sembrado correctamente: [${areaNormalized.toUpperCase()} // ${item.sub.toUpperCase()}] -> UUID: ${itemId}`);
        }

        console.log(`\n🎉 [SIEMBRA COMPLETADA]: ${REACTIVOS_REALES.length} reactivos formateados y sincronizados en Supabase.`);
        process.exit(0);

    } catch (err) {
        console.error("🚨 [CRITICAL SEEDER ERROR]:", err.message);
        process.exit(1);
    }
}

sembrarBancoSoberano();
