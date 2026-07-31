// export_project.js - Exportador Automático del Proyecto Dante OS
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo de salida
const OUTPUT_FILE = path.join(__dirname, 'todo_el_proyecto6.txt');

// Directorios y archivos a ignorar
const IGNORE_DIRS = new Set([
    'node_modules',
    '.git',
    '.venv',
    'dist',
    'build',
    '.vscode',
    'coverage'
]);

const IGNORE_FILES = new Set([
    'package-lock.json',
    'todo_el_proyecto6.txt',
    'export_project.js',
    '.DS_Store'
]);

// Extensiones permitidas (código fuente y vistas)
const ALLOWED_EXTENSIONS = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.md', '.sql', '.env.example'
]);

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!IGNORE_DIRS.has(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            const ext = path.extname(file);
            if (!IGNORE_FILES.has(file) && (ALLOWED_EXTENSIONS.has(ext) || file.startsWith('.env'))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

function exportProject() {
    console.log('🚀 Iniciando escaneo del proyecto...');
    const allFiles = getAllFiles(__dirname);
    let outputContent = `==================================================\n`;
    outputContent += `📦 EXPORTACIÓN COMPLETA DEL PROYECTO DANTE OS\n`;
    outputContent += `📅 FECHA: ${new Date().toLocaleString('es-CO')}\n`;
    outputContent += `📊 TOTAL DE ARCHIVOS INCLUIDOS: ${allFiles.length}\n`;
    outputContent += `==================================================\n\n`;

    allFiles.forEach((filePath) => {
        const relativePath = path.relative(__dirname, filePath);
        console.log(`📄 Procesando: ${relativePath}`);
        
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            outputContent += `\n/**************************************************\n`;
            outputContent += ` * ARCHIVO: ${relativePath}\n`;
            outputContent += ` **************************************************/\n\n`;
            outputContent += fileContent;
            outputContent += `\n\n`;
        } catch (err) {
            console.error(`⚠️ Error al leer ${relativePath}: ${err.message}`);
        }
    });

    fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
    console.log(`\n🎉 [ÉXITO TOTAL] Proyecto exportado correctamente en: ${OUTPUT_FILE}`);
}

exportProject();