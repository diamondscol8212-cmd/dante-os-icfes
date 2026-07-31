import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            // Excluimos carpetas de sistema y dependencias
            if (!p.includes('node_modules') && !p.includes('.git') && !p.includes('.venv') && !p.includes('__pycache__')) {
                walk(p, fileList);
            }
        } else {
            // Filtramos solo archivos web relevantes (.html, .css, .js principales) y omitimos scripts de empaquetado
            const ext = path.extname(p);
            const fileName = path.basename(p);
            if (
                (ext === '.html' || ext === '.js' || ext === '.css') &&
                !fileName.includes('todo_el_proyecto7') &&
                !fileName.includes('pack') &&
                !fileName.includes('generar_maestro') &&
                !fileName.includes('empaquetador')
            ) {
                fileList.push(p);
            }
        }
    });
    return fileList;
}

let out = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>todo_el_proyecto7</title></head><body style="background:#010103;color:#fff;padding:20px;font-family:sans-serif">';

walk('.').forEach(f => {
    try {
        const contenido = fs.readFileSync(f, 'utf8');
        out += `<div style="border:2px solid #D4AF37;margin:30px 0;padding:20px;background:#0c0e16;border-radius:10px"><h2>MÓDULO: ${f}</h2><xmp>${contenido}</xmp></div>`;
    } catch (e) {}
});

out += '</body></html>';
fs.writeFileSync('todo_el_proyecto7.html', out);
console.log('¡ÉXITO! Archivo optimizado solo con las interfaces y lógica central del proyecto.');