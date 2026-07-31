// 🪐 create-students.js - Inyector de Semillas de Estudiantes Perfeccionado para Dante OS
// Dante OS v20.6.3 Enterprise Edition // Bogotá, Colombia
import 'dotenv/config';
import { supabase } from './supabaseClient.js';
import crypto from 'crypto';

// Parámetros criptográficos idénticos a los de authRoutes.js
function generarHashPassword(password, saltExistente = null) {
    const salt = saltExistente || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

const CONTRASEÑA_DESARROLLO = "dante2026"; 

// Generamos los hashes reales con sus respectivos salts para cada estudiante
const authElizabeth = generarHashPassword(CONTRASEÑA_DESARROLLO);
const authSamantha = generarHashPassword(CONTRASEÑA_DESARROLLO);

const ESTUDIANTES_SEMILLA = [
    {
        email: "elizabeth@sandbox.edu.co",
        password_hash: authElizabeth.hash, // 🪐 Corregido: Columna exacta de tu BD
        salt: authElizabeth.salt,           // 🪐 Corregido: Campo not-null obligatorio
        rol: "estudiante",
        institution_id: "colegio_sandbox_default",
        created_at: new Date().toISOString()
    },
    {
        email: "samantha@sandbox.edu.co",
        password_hash: authSamantha.hash, // 🪐 Corregido: Columna exacta de tu BD
        salt: authSamantha.salt,           // 🪐 Corregido: Campo not-null obligatorio
        rol: "estudiante",
        institution_id: "colegio_sandbox_default",
        created_at: new Date().toISOString()
    }
];

async function sembrarEstudiantes() {
    console.log("\n🪐 [DANTE OS SEEDER]: Conectando a Supabase para registrar credenciales...");
    console.log(`📡 TARGET: ${process.env.SUPABASE_URL}\n`);

    // Limpiamos registros previos con el mismo email para evitar colisiones de clave primaria
    await supabase.from('usuarios').delete().in('email', ['elizabeth@sandbox.edu.co', 'samantha@sandbox.edu.co']);

    const { data, error } = await supabase
        .from('usuarios') 
        .insert(ESTUDIANTES_SEMILLA)
        .select();

    if (error) {
        console.error("🚨 [SEEDER ERROR]: No se pudieron sembrar las credenciales.");
        console.error(`   ❌ Detalle: ${error.message}`);
        process.exit(1);
    }

    console.log("✅ [SEMILLA INTEGRADA EXITOSAMENTE DESDE CRYPTO CORE]:");
    console.log(`   👤 Elizabeth: elizabeth@sandbox.edu.co | Llave: ${CONTRASEÑA_DESARROLLO}`);
    console.log(`   👤 Samantha: samantha@sandbox.edu.co   | Llave: ${CONTRASEÑA_DESARROLLO}`);
    console.log("\n🚀 Ahora puedes ir a http://localhost:3000/login.html e iniciar sesión sin restricciones.\n");
    process.exit(0);
}

sembrarEstudiantes();