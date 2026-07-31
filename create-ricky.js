// create-ricky.js - Inyector de Usuario para Ricky
import 'dotenv/config';
import { supabase } from './supabaseClient.js';
import crypto from 'crypto';

// Función de cifrado oficial de Dante OS
function generarHashPassword(password, saltExistente = null) {
    const salt = saltExistente || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

// 🔐 CREDENCIONALES PARA RICKY
const EMAIL = "ricky@sandbox.edu.co";
const PASSWORD = "dante2026"; // Puedes cambiar esta contraseña si deseas
const INSTITUCION = "colegio_sandbox_default";

async function sembrarRicky() {
    console.log("\n🪐 [DANTE OS]: Generando credenciales para Ricky...");

    const auth = generarHashPassword(PASSWORD);

    const usuarioRicky = {
        email: EMAIL,
        password_hash: auth.hash,
        salt: auth.salt,
        rol: "estudiante",
        institution_id: INSTITUCION,
        created_at: new Date().toISOString()
    };

    // Limpiar previo por si ya existía
    await supabase.from('usuarios').delete().eq('email', EMAIL);

    const { data, error } = await supabase
        .from('usuarios')
        .insert([usuarioRicky])
        .select();

    if (error) {
        console.error("🚨 [ERROR]: No se pudo registrar a Ricky en Supabase.");
        console.error(`   ❌ Detalle: ${error.message}`);
        process.exit(1);
    }

    console.log("\n✅ [USUARIO REGISTRADO EN SUPABASE EXITOSAMENTE]:");
    console.log(`   👤 Nombre / Usuario: Ricky`);
    console.log(`   📧 Correo:            ${EMAIL}`);
    console.log(`   🔑 Contraseña:        ${PASSWORD}`);
    console.log(`   🏛️ Institución:       ${INSTITUCION}`);
    console.log("\n🚀 Ahora puedes ingresar desde /login.html con estas credenciales.\n");
    process.exit(0);
}

sembrarRicky();
