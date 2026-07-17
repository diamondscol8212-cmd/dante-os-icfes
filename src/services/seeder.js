// 🪐 seeder.js - Inyector Psicométrico & Perimetral B2B Saneado (Dante OS v20.6.3)
import crypto from 'crypto';
import { supabase } from '../../supabaseClient.js';

const AREA_EXAMEN = 'matematicas';
const TOTAL_ITEMS_PRODUCCION = 100;
const OPCIONES_ESTANDAR = ["A", "B", "C", "D"];
const INSTITUTION_ID = 'colegio_sandbox_default';

// ====================================================================
// 🧠 MOTOR CRIPTOGRÁFICO ADAPTATIVO COMPATIBLE CON AUTHROUTES
// ====================================================================
function generarHashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

const ENUNCIADOS_ALGEBRA = [
    { txt: "Si 2x + 5 = 15, ¿cuál es el valor de x?", ok: "A", opciones: ["5", "10", "15", "20"], q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 } },
    { txt: "Simplifica la expresión distributiva clásica: 3(x - 4) + 2x.", ok: "B", opciones: ["5x - 4", "5x - 12", "x - 12", "5x + 12"], q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 } },
    { txt: "Un tanque contiene 120 litros. Si se extrae 1/4 de su capacidad, ¿cuántos litros quedan?", ok: "C", opciones: ["30 litros", "60 litros", "90 litros", "120 litros"], q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 0 } },
    { txt: "¿Cuál es el conjunto solución para la inecuación lineal: -3x + 9 < 0?", ok: "B", opciones: ["x < 3", "x > 3", "x < -3", "x > -3"], q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 } },
    { txt: "Encuentra las raíces de la ecuación cuadrática factorizable: x^2 - 5x + 6 = 0.", ok: "A", opciones: ["x = 2, x = 3", "x = -2, x = -3", "x = 1, x = 6", "x = 5, x = 6"], q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 0 } },
    { txt: "Determina el valor de y en el sistema lineal simétrico: x + y = 10 ; x - y = 4.", ok: "D", opciones: ["x = 7, y = 3", "x = 6, y = 4", "x = 3, y = 7", "x = 7, y = 7"], q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 1, attr_omision_conversion: 0, attr_error_geometrico: 0 } }
];

const ENUNCIADOS_GEOMETRIA = [
    { txt: "Calcula el perímetro de un rectángulo cuyo ancho es 5 cm y su largo es el doble.", ok: "D", opciones: ["15 cm", "20 cm", "25 cm", "30 cm"], q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 } },
    { txt: "Si el área de un cuadrado es 64 cm², ¿cuál es el perímetro de dicha figura?", ok: "C", opciones: ["8 cm", "16 cm", "32 cm", "64 cm"], q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 } },
    { txt: "El radio de una circunferencia se duplica de R a 2R. ¿En qué proporción incrementa el área de su superficie?", ok: "C", opciones: ["Se duplica (2x)", "Se triplica (3x)", "Se cuadruplica (4x)", "Permanece igual"], q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 1 } },
    { txt: "En un triángulo rectángulo de catetos 3cm y 4cm, calcula el valor de la hipotenusa.", ok: "B", opciones: ["4cm", "5cm", "6cm", "7cm"], q: { attr_heuristica_lineal: 0, attr_inversion_operacional: 0, attr_omision_conversion: 0, attr_error_geometrico: 1 } },
    { txt: "Determina el volumen de un cubo si el perímetro de una de sus caras cuadradas mide 16 cm.", ok: "A", opciones: ["64 cm³", "16 cm³", "32 cm³", "128 cm³"], q: { attr_heuristica_lineal: 1, attr_inversion_operacional: 0, attr_omision_conversion: 1, attr_error_geometrico: 1 } }
];

const BANCO_PRODUCTION = [];

for (let i = 0; i < TOTAL_ITEMS_PRODUCCION; i++) {
    const esAlgebra = i % 2 === 0;
    const pool = esAlgebra ? ENUNCIADOS_ALGEBRA : ENUNCIADOS_GEOMETRIA;
    const base = pool[Math.floor(Math.random() * pool.length)];

    const logitFrac = i / (TOTAL_ITEMS_PRODUCCION - 1);
    const bCalculado = parseFloat((-2.2 + logitFrac * 4.4).toFixed(3));
    const aCalculado = parseFloat((1.2 + (logitFrac * 0.8) + (Math.random() * 0.2)).toFixed(2));

    const opcionesMapeadas = base.opciones.map((texto, idx) => `${OPCIONES_ESTANDAR[idx]}) ${texto}`);

    BANCO_PRODUCTION.push({
        id: crypto.randomUUID(),
        comp: esAlgebra ? "algebra" : "geometria",
        txt: `${base.txt} (Variación Adaptativa Calibrada Mód-#${i + 1})`,
        ok: base.ok,
        a: aCalculado,
        b: bCalculado,
        c: 0.25,
        opciones: opcionesMapeadas,
        q: { ...base.q }
    });
}

async function ejecutarSiembraSoberana() {
    console.log(`🚀 [SEED ENGINE INITIALIZING]: Distribuyendo ${TOTAL_ITEMS_PRODUCCION} nodos adaptativos + Credenciales Perimetrales...`);

    try {
        console.log("🧹 Purgando bases relacionales viejas...");
        await supabase.from('mapa_trampas_distractores').delete().neq('opcion_marcada', 'XYZ_FORCE_CLEAR');
        await supabase.from('matriz_q_items').delete().neq('attr_heuristica_lineal', -999);
        await supabase.from('banco_items_irt').delete().eq('area_general', AREA_EXAMEN);
        await supabase.from('usuarios').delete().neq('email', 'admin_ghost@danteos.com');

        console.log("🌱 Inyectando lote masivo de alta fidelidad psicométrica...");

        for (const item of BANCO_PRODUCTION) {
            const { error: errBase } = await supabase.from('banco_items_irt').insert([{
                id: item.id,
                area_general: AREA_EXAMEN,
                sub_competencia: item.comp,
                pregunta_texto: item.txt,
                opciones_respuesta: item.opciones,
                correcta: item.ok,
                parametro_a_discriminacion: item.a,
                parametro_b_dificultad: item.b,
                parametro_c_adivinacion: item.c
            }]);
            if (errBase) throw new Error(`Fallo Base en ítem: ${errBase.message}`);

            const { error: errQ } = await supabase.from('matriz_q_items').insert([{
                item_id: item.id,
                attr_heuristica_lineal: item.q.attr_heuristica_lineal,
                attr_inversion_operacional: item.q.attr_inversion_operacional,
                attr_omision_conversion: item.q.attr_omision_conversion,
                attr_error_geometrico: item.q.attr_error_geometrico
            }]);
            if (errQ) throw new Error(`Fallo Matriz Q: ${errQ.message}`);

            const incorrectas = OPCIONES_ESTANDAR.filter(o => o !== item.ok);
            for (const opcion of incorrectas) {
                await supabase.from('mapa_trampas_distractores').insert([{
                    item_id: item.id,
                    opcion_marcada: opcion,
                    vulnera_heuristica_lineal: item.q.attr_heuristica_lineal,
                    vulnera_inversion_operacional: item.q.attr_inversion_operacional,
                    vulnera_omision_conversion: item.q.attr_omision_conversion,
                    vulnera_error_geometrico: item.q.attr_error_geometrico
                }]);
            }
        }
        console.log(`✅ Lote Psicométrico sembrado (100 reactivos).`);

        console.log("🔒 Derivando llaves criptográficas PBKDF2 para usuarios semilla...");

        const usuariosSemilla = [
            { email: "rector@sandbox.edu.co", pass: "rector123", rol: "rector" },
            { email: "elizabeth@sandbox.edu.co", pass: "elizabeth123", rol: "estudiante" },
            { email: "samantha@sandbox.edu.co", pass: "samantha123", rol: "estudiante" }
        ];

        // Sintaxis elástica corregida usando upsert para evitar la excepción
        await supabase.from('instituciones').upsert([{ id: INSTITUTION_ID, nombre_institucion: "Colegio Sandbox Capital Base" }], { onConflict: 'id' });

        for (const u of usuariosSemilla) {
            const { hash, salt } = generarHashPassword(u.pass);

            const { error: errUser } = await supabase.from('usuarios').insert([{
                email: u.email,
                password_hash: hash,
                salt: salt,
                rol: u.rol,
                institution_id: INSTITUTION_ID
            }]);

            if (errUser) throw new Error(`Fallo Cripto-Seed para [${u.email}]: ${errUser.message}`);
            console.log(`🔑 Cuenta sembrada -> ${u.email} [Rol: ${u.rol}]`);
        }

        console.log(`\n🪐 [SIEMBRA EXCELSA COMPLETADA]: 100 ítems indexados y credenciales PBKDF2 activas en T-${INSTITUTION_ID}.`);
        process.exit(0);

    } catch (err) {
        console.error("🚨 [SEED ENGINE CRITICAL FAULT]:", err.message);
        process.exit(1);
    }
}

ejecutarSiembraSoberana();