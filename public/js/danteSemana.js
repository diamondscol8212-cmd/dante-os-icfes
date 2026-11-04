(function () {
  'use strict';

  const CLAVE = 'dante_bitacora';
  const AREAS = [
    ['matematicas', 'Matemáticas'],
    ['lectura_critica', 'Lectura crítica'],
    ['ciencias_naturales', 'Ciencias naturales'],
    ['sociales_ciudadanas', 'Sociales y ciudadanas'],
    ['ingles', 'Inglés']
  ];

  function leer() {
    try {
      const lista = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function guardar(lista) {
    try { localStorage.setItem(CLAVE, JSON.stringify(lista.slice(-80))); } catch (e) {}
  }

  function ymd(ms) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(ms);
  }

  function dia(ms) {
    const nombre = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short' }).format(ms);
    return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[nombre] || 0;
  }

  function lunesDe(ms) {
    const base = ymd(ms);
    const partes = base.split('-').map(Number);
    const ancla = Date.UTC(partes[0], partes[1] - 1, partes[2], 17, 0, 0);
    const delta = (dia(ancla) + 6) % 7;
    return ymd(ancla - delta * 86400000);
  }

  function tituloSemana(lunes) {
    const partes = lunes.split('-').map(Number);
    const inicio = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2], 17, 0, 0));
    const fin = new Date(inicio.getTime() + 6 * 86400000);
    const formato = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'long' });
    return 'Semana del ' + formato.format(inicio) + ' al ' + formato.format(fin);
  }

  function areaDe(texto) {
    const cruda = String(texto || '').toLowerCase();
    if (cruda.includes('mate')) return 'matematicas';
    if (cruda.includes('lect')) return 'lectura_critica';
    if (cruda.includes('cien') || cruda.includes('natur')) return 'ciencias_naturales';
    if (cruda.includes('social')) return 'sociales_ciudadanas';
    if (cruda.includes('ingl')) return 'ingles';
    return '';
  }

  function anotarBloque(respuestas) {
    const areas = {};
    Object.values(respuestas || {}).forEach((fila) => {
      if (!fila || typeof fila.correcto !== 'boolean') return;
      const area = areaDe(fila.materia || fila.area);
      if (!area) return;
      if (!areas[area]) areas[area] = { respuestas: 0, aciertos: 0 };
      areas[area].respuestas += 1;
      if (fila.correcto) areas[area].aciertos += 1;
    });
    if (!Object.keys(areas).length) return;
    const lista = leer();
    lista.push({ en: Date.now(), tipo: 'bloque', areas: areas, global: null });
    guardar(lista);
  }

  function anotarSimulacro(resultado) {
    const lista = leer();
    lista.push({
      en: Date.now(),
      tipo: 'simulacro',
      areas: (resultado && resultado.areas) || {},
      global: resultado && Number.isFinite(resultado.global) ? resultado.global : null
    });
    guardar(lista);
  }

  function deEstaSemana() {
    const lunes = lunesDe(Date.now());
    return leer().filter((fila) => fila && fila.en && lunesDe(fila.en) === lunes);
  }

  function htmlSemana() {
    const lunes = lunesDe(Date.now());
    const filas = deEstaSemana();
    const simulacro = filas.filter((fila) => fila.tipo === 'simulacro').pop() || null;
    const bloques = filas.filter((fila) => fila.tipo === 'bloque');
    const practica = {};
    bloques.forEach((fila) => {
      Object.entries(fila.areas || {}).forEach(([area, cuenta]) => {
        if (!practica[area]) practica[area] = { respuestas: 0, aciertos: 0 };
        practica[area].respuestas += Number(cuenta.respuestas) || 0;
        practica[area].aciertos += Number(cuenta.aciertos) || 0;
      });
    });
    const lineas = AREAS.map(([clave, nombre]) => {
      const oficial = simulacro && simulacro.areas ? simulacro.areas[clave] : null;
      const hecho = practica[clave];
      const puntaje = oficial == null || oficial === '' ? '' : String(oficial);
      const nota = puntaje ? (puntaje + ' / 100') : (hecho ? (hecho.respuestas + ' respuestas en los bloques') : 'Sin evidencia');
      return '<tr><td>' + nombre + '</td><td>' + nota + '</td></tr>';
    }).join('');
    const global = simulacro && simulacro.global != null ? (simulacro.global + ' / 500') : 'Sin simulacro terminado';
    return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Dante OS · ' + tituloSemana(lunes) + '</title>'
      + '<style>body{margin:0;background:#faf8f5;color:#1c1917;font-family:Georgia,serif;}main{max-width:40rem;margin:2rem auto;padding:0 1.2rem;}'
      + 'h1{font-size:1.6rem;font-weight:500;margin:0;}p{line-height:1.5;}table{width:100%;border-collapse:collapse;margin-top:1rem;}'
      + 'td{padding:0.7rem 0;border-bottom:1px solid #e7d7c3;font-size:1rem;}td:last-child{text-align:right;}</style></head><body><main>'
      + '<p>Dante OS</p><h1>' + tituloSemana(lunes) + '</h1>'
      + '<p>El informe de la sala sigue en línea. Esta hoja es la de la semana. Donde no hubo respuestas, queda en blanco. El puntaje de 0 a 500 sale solo si el simulacro de las cinco áreas se terminó.</p>'
      + '<p><strong>Simulacro.</strong> ' + global + '</p>'
      + '<table>' + lineas + '</table>'
      + '<p>Los bloques de 10 cuentan como práctica. No se convierten en un puntaje de área.</p>'
      + '</main></body></html>';
  }

  function descargar() {
    const archivo = new Blob([htmlSemana()], { type: 'text/html;charset=utf-8' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = 'dante-semana-' + ymd(Date.now()) + '.html';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  }

  window.DanteSemana = {
    anotarBloque: anotarBloque,
    anotarSimulacro: anotarSimulacro,
    descargar: descargar,
    titulo: function () { return tituloSemana(lunesDe(Date.now())); }
  };
})();
