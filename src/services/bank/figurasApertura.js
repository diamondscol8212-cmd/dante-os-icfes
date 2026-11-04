function papel(contenido) {
  return `<div class="fig-examen" style="background:#faf8f5;color:#1c1917;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.4;padding:8px 10px;border-radius:8px;">${contenido}</div>`;
}

function tabla(encabezados, filas) {
  const celda = 'border:1px solid #44403c;padding:7px 10px;text-align:left;';
  const cabeza = encabezados.map((h) => `<th style="${celda}background:#e7e5e4;">${h}</th>`).join('');
  const cuerpo = filas.map((fila) => `<tr>${fila.map((c) => `<td style="${celda}">${c}</td>`).join('')}</tr>`).join('');
  return papel(`<table style="width:100%;border-collapse:collapse;"><thead><tr>${cabeza}</tr></thead><tbody>${cuerpo}</tbody></table>`);
}

function aviso(titulo, lineas) {
  const cuerpo = lineas.map((linea) => `<p style="margin:6px 0;">${linea}</p>`).join('');
  return papel(`<p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${titulo}</p>${cuerpo}`);
}

function svg(cuerpo, ancho = 420, alto = 230) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" role="img">${cuerpo}</svg>`;
}

function barras(pares) {
  const maximo = Math.max(...pares.map((par) => par[1]), 1);
  const base = 176;
  const altoMax = 128;
  const ancho = 54;
  let cuerpo = `<line x1="28" y1="18" x2="28" y2="${base}" stroke="#1c1917" stroke-width="2"/><line x1="28" y1="${base}" x2="400" y2="${base}" stroke="#1c1917" stroke-width="2"/>`;
  pares.forEach((par, i) => {
    const alto = (par[1] / maximo) * altoMax;
    const x = 48 + i * (ancho + 18);
    const y = base - alto;
    cuerpo += `<rect x="${x}" y="${y}" width="${ancho}" height="${alto}" fill="#b45309"/>`;
    cuerpo += `<text x="${x + ancho / 2}" y="${y - 6}" text-anchor="middle" font-size="13" fill="#1c1917">${par[1]}</text>`;
    cuerpo += `<text x="${x + ancho / 2}" y="${base + 18}" text-anchor="middle" font-size="12" fill="#1c1917">${par[0]}</text>`;
  });
  return svg(cuerpo);
}

function linea(pares) {
  const maximo = Math.max(...pares.map((par) => par[1]), 1);
  const base = 176;
  const altoMax = 128;
  const paso = 70;
  const puntos = pares.map((par, i) => {
    const x = 50 + i * paso;
    const y = base - (par[1] / maximo) * altoMax;
    return { x, y, nombre: par[0], valor: par[1] };
  });
  const trazo = puntos.map((p) => `${p.x},${p.y}`).join(' ');
  let cuerpo = `<line x1="30" y1="16" x2="30" y2="${base}" stroke="#1c1917" stroke-width="2"/><line x1="30" y1="${base}" x2="390" y2="${base}" stroke="#1c1917" stroke-width="2"/><polyline points="${trazo}" fill="none" stroke="#0f766e" stroke-width="3"/>`;
  puntos.forEach((p) => {
    cuerpo += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#0f766e"/>`;
    cuerpo += `<text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="12" fill="#1c1917">${p.valor}</text>`;
    cuerpo += `<text x="${p.x}" y="${base + 18}" text-anchor="middle" font-size="12" fill="#1c1917">${p.nombre}</text>`;
  });
  return svg(cuerpo);
}

function dispersion() {
  const puntos = [[40, 160], [80, 142], [120, 128], [160, 110], [210, 96], [250, 78], [300, 64], [340, 50]];
  let cuerpo = `<line x1="30" y1="20" x2="30" y2="180" stroke="#1c1917" stroke-width="2"/><line x1="30" y1="180" x2="380" y2="180" stroke="#1c1917" stroke-width="2"/><text x="12" y="16" font-size="13" fill="#1c1917">y</text><text x="370" y="198" font-size="13" fill="#1c1917">x</text>`;
  puntos.forEach(([x, y]) => {
    cuerpo += `<circle cx="${x}" cy="${y}" r="5" fill="#0f766e"/>`;
  });
  return svg(cuerpo, 420, 214);
}

function caja() {
  return svg(`
    <line x1="40" y1="110" x2="380" y2="110" stroke="#1c1917" stroke-width="2"/>
    <line x1="40" y1="96" x2="40" y2="124" stroke="#1c1917" stroke-width="2"/>
    <line x1="380" y1="96" x2="380" y2="124" stroke="#1c1917" stroke-width="2"/>
    <rect x="130" y="78" width="160" height="64" fill="#fef3c7" stroke="#1c1917" stroke-width="2"/>
    <line x1="210" y1="78" x2="210" y2="142" stroke="#9a3412" stroke-width="3"/>
    <text x="40" y="156" text-anchor="middle" font-size="13" fill="#1c1917">2</text>
    <text x="130" y="156" text-anchor="middle" font-size="13" fill="#1c1917">Q1 = 5</text>
    <text x="210" y="68" text-anchor="middle" font-size="13" fill="#9a3412">8</text>
    <text x="290" y="156" text-anchor="middle" font-size="13" fill="#1c1917">Q3 = 11</text>
    <text x="380" y="156" text-anchor="middle" font-size="13" fill="#1c1917">14</text>
  `, 420, 180);
}

function triangulo(base, altura, hipotenusa, angulo) {
  return svg(`
    <polygon points="70,180 280,180 280,70" fill="none" stroke="#1c1917" stroke-width="2.5"/>
    <path d="M264 180 L264 166 L280 166" fill="none" stroke="#1c1917" stroke-width="1.5"/>
    <text x="170" y="204" text-anchor="middle" font-size="16" fill="#1c1917">${base}</text>
    <text x="296" y="130" font-size="16" fill="#1c1917">${altura}</text>
    <text x="150" y="112" font-size="16" fill="#0f766e">${hipotenusa}</text>
    <text x="96" y="168" font-size="16" fill="#9a3412">${angulo}</text>
  `, 420, 220);
}

function circunferencia(radio, pide) {
  return svg(`
    <circle cx="210" cy="110" r="70" fill="none" stroke="#1c1917" stroke-width="2.5"/>
    <line x1="210" y1="110" x2="280" y2="110" stroke="#9a3412" stroke-width="2"/>
    <text x="232" y="102" font-size="16" fill="#9a3412">${radio}</text>
    <text x="210" y="210" text-anchor="middle" font-size="14" fill="#44403c">${pide}</text>
  `, 420, 226);
}

function rectangulo() {
  return svg(`
    <rect x="70" y="50" width="250" height="110" fill="none" stroke="#1c1917" stroke-width="2.5"/>
    <line x1="70" y1="160" x2="320" y2="50" stroke="#0f766e" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="190" y="184" text-anchor="middle" font-size="16" fill="#1c1917">12 cm</text>
    <text x="338" y="110" font-size="16" fill="#1c1917">5 cm</text>
    <text x="168" y="100" font-size="14" fill="#0f766e">diagonal</text>
  `, 420, 210);
}

function prisma() {
  return svg(`
    <polygon points="80,80 230,80 280,50 130,50" fill="#fef3c7" stroke="#1c1917" stroke-width="2"/>
    <polygon points="80,80 80,170 230,170 230,80" fill="#fff7ed" stroke="#1c1917" stroke-width="2"/>
    <polygon points="230,80 280,50 280,140 230,170" fill="#e7e5e4" stroke="#1c1917" stroke-width="2"/>
    <text x="140" y="190" text-anchor="middle" font-size="15" fill="#1c1917">largo 3 cm</text>
    <text x="292" y="100" font-size="15" fill="#1c1917">ancho 4 cm</text>
    <text x="48" y="130" font-size="15" fill="#1c1917">alto 5 cm</text>
  `, 420, 214);
}

function cilindro() {
  return svg(`
    <ellipse cx="180" cy="48" rx="70" ry="18" fill="none" stroke="#1c1917" stroke-width="2"/>
    <ellipse cx="180" cy="168" rx="70" ry="18" fill="#fef3c7" stroke="#1c1917" stroke-width="2"/>
    <line x1="110" y1="48" x2="110" y2="168" stroke="#1c1917" stroke-width="2"/>
    <line x1="250" y1="48" x2="250" y2="168" stroke="#1c1917" stroke-width="2"/>
    <line x1="180" y1="168" x2="250" y2="168" stroke="#9a3412" stroke-width="2"/>
    <text x="200" y="160" font-size="14" fill="#9a3412">r = 2 cm</text>
    <text x="262" y="112" font-size="14" fill="#1c1917">h = 5 cm</text>
  `, 420, 210);
}

function angulosTriangulo() {
  return svg(`
    <polygon points="60,180 250,180 150,50" fill="none" stroke="#1c1917" stroke-width="2.5"/>
    <text x="78" y="168" font-size="16" fill="#9a3412">50°</text>
    <text x="214" y="168" font-size="16" fill="#9a3412">60°</text>
    <text x="142" y="78" font-size="16" fill="#0f766e">?</text>
  `, 420, 210);
}

function escala() {
  return papel(`
    <p style="margin:0 0 8px;">Plano del muro</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 90" style="width:100%;height:auto;">
      <rect x="20" y="20" width="90" height="16" fill="none" stroke="#1c1917" stroke-width="2"/>
      <text x="30" y="58" font-size="14" fill="#1c1917">3 cm en el plano</text>
      <text x="150" y="40" font-size="16" fill="#1c1917">Escala 1 : 100</text>
    </svg>
  `);
}

function tablaFuncion() {
  return tabla(['x', 'y'], [['1', '3'], ['2', '5'], ['3', '7'], ['4', '?']]);
}

function planoSalon() {
  return svg(`
    <rect x="40" y="30" width="320" height="160" fill="#fff7ed" stroke="#1c1917" stroke-width="2"/>
    <rect x="150" y="36" width="90" height="22" fill="#bae6fd" stroke="#1c1917"/>
    <text x="195" y="52" text-anchor="middle" font-size="12" fill="#1c1917">ventana norte</text>
    <text x="168" y="78" text-anchor="middle" font-size="13" fill="#9a3412">salida</text>
    <rect x="250" y="130" width="90" height="40" fill="#fde68a" stroke="#1c1917"/>
    <text x="295" y="154" text-anchor="middle" font-size="12" fill="#1c1917">biblioteca</text>
  `, 420, 214);
}

function mapaConceptual() {
  return svg(`
    <rect x="145" y="20" width="130" height="36" rx="6" fill="#fef3c7" stroke="#1c1917"/>
    <text x="210" y="43" text-anchor="middle" font-size="14" fill="#1c1917">fotosíntesis</text>
    <line x1="170" y1="56" x2="80" y2="110" stroke="#1c1917" stroke-width="2"/>
    <line x1="250" y1="56" x2="330" y2="110" stroke="#1c1917" stroke-width="2"/>
    <rect x="30" y="110" width="100" height="34" rx="6" fill="#fff7ed" stroke="#1c1917"/>
    <text x="80" y="132" text-anchor="middle" font-size="14" fill="#1c1917">luz</text>
    <rect x="280" y="110" width="110" height="34" rx="6" fill="#fff7ed" stroke="#1c1917"/>
    <text x="335" y="132" text-anchor="middle" font-size="14" fill="#1c1917">glucosa</text>
  `, 420, 180);
}

function leyenda(lineas) {
  const filas = lineas.map(([muestra, nombre]) => `<tr><td style="border:1px solid #44403c;padding:7px 10px;">${muestra}</td><td style="border:1px solid #44403c;padding:7px 10px;">${nombre}</td></tr>`).join('');
  return papel(`<p style="margin:0 0 8px;">Leyenda</p><table style="width:100%;border-collapse:collapse;">${filas}</table>`);
}

function curvasNivel() {
  return svg(`
    <path d="M40 150 Q120 40 220 150" fill="none" stroke="#1c1917" stroke-width="1.5"/>
    <path d="M70 150 Q130 70 200 150" fill="none" stroke="#1c1917" stroke-width="1.5"/>
    <path d="M100 150 Q140 100 180 150" fill="none" stroke="#1c1917" stroke-width="1.5"/>
    <rect x="250" y="70" width="120" height="70" fill="none" stroke="#9a3412" stroke-width="2" stroke-dasharray="5 3"/>
    <path d="M270 120 Q300 78 340 120" fill="none" stroke="#1c1917"/>
    <path d="M286 120 Q300 96 322 120" fill="none" stroke="#1c1917"/>
    <text x="310" y="160" text-anchor="middle" font-size="13" fill="#9a3412">zona marcada</text>
  `, 420, 190);
}

function climograma() {
  const lluvias = [180, 190, 210, 200, 220, 230, 210, 200, 190, 200, 210, 220];
  let cuerpo = `<line x1="36" y1="20" x2="36" y2="160" stroke="#1c1917"/><line x1="36" y1="160" x2="400" y2="160" stroke="#1c1917"/>`;
  lluvias.forEach((valor, i) => {
    const alto = valor / 2.2;
    const x = 48 + i * 28;
    cuerpo += `<rect x="${x}" y="${160 - alto}" width="16" height="${alto}" fill="#0369a1"/>`;
  });
  cuerpo += `<polyline points="56,78 84,76 112,74 140,75 168,73 196,72 224,74 252,75 280,76 308,75 336,74 364,73" fill="none" stroke="#9a3412" stroke-width="2"/>`;
  cuerpo += `<text x="20" y="78" font-size="11" fill="#9a3412">26 °C</text>`;
  cuerpo += `<text x="48" y="186" font-size="12" fill="#0369a1">lluvia, ene a dic</text>`;
  cuerpo += `<text x="230" y="186" font-size="12" fill="#9a3412">temperatura</text>`;
  return svg(cuerpo, 420, 206);
}

function circular() {
  return svg(`
    <circle cx="160" cy="110" r="70" fill="#e7e5e4" stroke="#1c1917" stroke-width="2"/>
    <path d="M160 110 L160 40 A70 70 0 0 1 201 167 Z" fill="#b45309" stroke="#1c1917"/>
    <text x="214" y="90" font-size="15" fill="#1c1917">40%</text>
  `, 420, 210);
}

function piramide() {
  const grupos = [['0-14', 46], ['15-29', 36], ['30-44', 26], ['45-59', 16], ['60+', 8]];
  let cuerpo = '';
  grupos.forEach((grupo, i) => {
    const y = 24 + i * 32;
    const ancho = grupo[1] * 3;
    cuerpo += `<text x="200" y="${y + 16}" text-anchor="middle" font-size="12" fill="#1c1917">${grupo[0]}</text>`;
    cuerpo += `<rect x="${200 - ancho}" y="${y}" width="${ancho}" height="22" fill="#0369a1"/>`;
    cuerpo += `<rect x="200" y="${y}" width="${ancho}" height="22" fill="#b45309"/>`;
  });
  cuerpo += `<text x="70" y="200" font-size="12" fill="#0369a1">hombres</text><text x="280" y="200" font-size="12" fill="#b45309">mujeres</text>`;
  return svg(cuerpo, 420, 214);
}

function migracion() {
  return svg(`
    <rect x="30" y="70" width="120" height="50" rx="6" fill="#fff7ed" stroke="#1c1917"/>
    <text x="90" y="100" text-anchor="middle" font-size="16" fill="#1c1917">Campo</text>
    <rect x="270" y="70" width="120" height="50" rx="6" fill="#fef3c7" stroke="#1c1917"/>
    <text x="330" y="100" text-anchor="middle" font-size="16" fill="#1c1917">Ciudad</text>
    <line x1="155" y1="95" x2="255" y2="95" stroke="#9a3412" stroke-width="3"/>
    <polygon points="255,95 242,88 242,102" fill="#9a3412"/>
  `, 420, 180);
}

function circuito() {
  return svg(`
    <rect x="70" y="50" width="260" height="120" fill="none" stroke="#1c1917" stroke-width="2.5"/>
    <line x1="150" y1="50" x2="170" y2="50" stroke="#faf8f5" stroke-width="6"/>
    <line x1="148" y1="40" x2="168" y2="60" stroke="#9a3412" stroke-width="2"/>
    <text x="130" y="36" font-size="13" fill="#9a3412">interruptor abierto</text>
    <circle cx="300" cy="110" r="16" fill="none" stroke="#1c1917" stroke-width="2"/>
    <text x="300" y="150" text-anchor="middle" font-size="13" fill="#1c1917">bombilla</text>
    <line x1="70" y1="140" x2="90" y2="140" stroke="#1c1917" stroke-width="4"/>
    <line x1="96" y1="140" x2="112" y2="140" stroke="#1c1917" stroke-width="2"/>
    <text x="70" y="162" font-size="13" fill="#1c1917">pila</text>
  `, 420, 190);
}

function reaccion() {
  return barras([['20 °C', 40], ['30 °C', 25]]).replace('</svg>', '<text x="210" y="222" text-anchor="middle" font-size="13" fill="#1c1917">tiempo de reacción (s)</text></svg>');
}

function poste() {
  return svg(`
    <line x1="60" y1="170" x2="300" y2="170" stroke="#1c1917" stroke-width="2"/>
    <line x1="300" y1="170" x2="300" y2="50" stroke="#1c1917" stroke-width="3"/>
    <line x1="60" y1="170" x2="300" y2="50" stroke="#0f766e" stroke-width="2"/>
    <text x="160" y="192" text-anchor="middle" font-size="15" fill="#1c1917">10 m</text>
    <text x="312" y="114" font-size="15" fill="#1c1917">10 m</text>
    <text x="84" y="158" font-size="16" fill="#9a3412">θ</text>
  `, 420, 214);
}

function escalera() {
  return svg(`
    <line x1="50" y1="180" x2="250" y2="180" stroke="#1c1917" stroke-width="2"/>
    <line x1="250" y1="180" x2="250" y2="60" stroke="#1c1917" stroke-width="3"/>
    <line x1="50" y1="180" x2="250" y2="60" stroke="#9a3412" stroke-width="3"/>
    <text x="140" y="202" text-anchor="middle" font-size="15" fill="#1c1917">6 m</text>
    <text x="262" y="124" font-size="15" fill="#1c1917">8 m</text>
    <text x="120" y="112" font-size="15" fill="#9a3412">escalera</text>
  `, 420, 220);
}

function pasos() {
  return papel(`
    <p style="margin:0 0 6px;"><strong>1.</strong> Lee.</p>
    <p style="margin:0 0 6px;"><strong>2.</strong> Subraya la pregunta.</p>
    <p style="margin:0;"><strong>3.</strong> Elimina opciones imposibles.</p>
  `);
}

const FIGURAS = {
  item_ap_mat_022: tabla(['Valor', 'Frecuencia'], [['1', '2'], ['2', '3'], ['3', '5']]),
  item_ap_mat_023: barras([['Lunes', 10], ['Martes', 15]]),
  item_ap_mat_027: caja(),
  item_ap_mat_028: dispersion(),
  item_ap_mat_041: triangulo('6 cm', '8 cm', '', ''),
  item_ap_mat_042: triangulo('base 10 cm', 'altura 4 cm', '', ''),
  item_ap_mat_043: circunferencia('r = 5 cm', 'longitud de la circunferencia'),
  item_ap_mat_044: circunferencia('r = 3 cm', 'área del círculo'),
  item_ap_mat_045: angulosTriangulo(),
  item_ap_mat_046: rectangulo(),
  item_ap_mat_047: prisma(),
  item_ap_mat_048: cilindro(),
  item_ap_mat_050: escala(),
  item_ap_mat_057: tablaFuncion(),
  item_ap_mat_075: triangulo('4', '3', '5', 'θ'),
  item_ap_mat_076: triangulo('4', '3', '5', 'θ'),
  item_ap_mat_077: triangulo('4', '3', '5', 'θ'),
  item_ap_mat_078: poste(),
  item_ap_mat_079: escalera(),
  item_ap_lec_021: aviso('Biblioteca', ['Préstamo: 2 libros.', 'Entrega: 8 días.', 'Mora: $500 por día.']),
  item_ap_lec_022: tabla(['Día', 'Préstamos'], [['Lunes', '4'], ['Martes', '6'], ['Miércoles', '6'], ['Jueves', '2']]),
  item_ap_lec_023: tabla(['Clase', 'Hora'], [['Matemáticas', '7:00 – 7:50'], ['Lengua', '7:55 – 8:45']]),
  item_ap_lec_024: aviso('Etiqueta', ['Contenido neto: 250 ml.', 'Porción: 125 ml.', 'Porciones por envase: 2.']),
  item_ap_lec_025: planoSalon(),
  item_ap_lec_026: pasos(),
  item_ap_lec_028: linea([['Ene', 2], ['Feb', 4], ['Mar', 6], ['Abr', 3]]),
  item_ap_lec_030: tabla(['Capítulo', 'Página'], [['1. El río', '4'], ['2. La montaña', '11'], ['3. El puerto', '18']]),
  item_ap_lec_031: tabla(['', 'Costo', 'Tiempo'], [['Bus', '$2.500', '25 min'], ['Bici', '$0', '35 min']]),
  item_ap_lec_033: tabla(['Concepto', 'Valor'], [['Arriendo', '$400.000'], ['Energía', '$50.000'], ['Agua', '$30.000']]),
  item_ap_lec_034: mapaConceptual(),
  item_ap_lec_078: leyenda([['línea punteada', 'sendero'], ['línea continua', 'vía pavimentada']]),
  item_ap_soc_016: curvasNivel(),
  item_ap_soc_020: climograma(),
  item_ap_soc_023: barras([['Caribe', 20], ['Pacífica', 12], ['Andina', 48], ['Orinoquía', 8], ['Amazonía', 10]]),
  item_ap_soc_050: tabla(['Año', 'Habitantes'], [['2010', '120'], ['2015', '150'], ['2020', '170']]),
  item_ap_soc_051: leyenda([['verde', 'bosque'], ['azul', 'agua']]),
  item_ap_soc_052: circular(),
  item_ap_soc_068: piramide(),
  item_ap_soc_075: migracion(),
  item_ap_soc_054: svg(`
    <line x1="50" y1="30" x2="50" y2="170" stroke="#1c1917" stroke-width="2"/>
    <line x1="50" y1="170" x2="300" y2="170" stroke="#1c1917" stroke-width="2"/>
    <text x="28" y="40" font-size="13" fill="#1c1917">50</text>
    <text x="28" y="174" font-size="13" fill="#1c1917">40</text>
    <rect x="90" y="146" width="60" height="24" fill="#b45309"/>
    <rect x="180" y="54" width="60" height="116" fill="#0f766e"/>
    <text x="120" y="192" text-anchor="middle" font-size="13" fill="#1c1917">A 42</text>
    <text x="210" y="192" text-anchor="middle" font-size="13" fill="#1c1917">B 48</text>
  `, 420, 214),
  item_ap_cie_010: circuito(),
  item_ap_cie_036: reaccion(),
  item_ap_ing_021: aviso('Pool', ['Closed on Mondays for cleaning.', 'Open Tuesday to Sunday, 9 a.m. to 5 p.m.']),
  item_ap_ing_024: aviso('Label', ['Shake well.', 'Take one spoon after meals.', 'Do not exceed three spoons a day.']),
  item_ap_ing_025: aviso('Ticket', ['Seat 12B.', 'Gate 4.', 'Boarding starts at 10:20.']),
  item_ap_ing_031: aviso('Warning', ['Wet floor.']),
  item_ap_ing_074: leyenda([['dotted line', 'trail'], ['solid line', 'road']]),
  item_ap_ing_076: aviso('Sale', ['Buy two notebooks and get the third free.'])
};

export function figuraDe(id) {
  return FIGURAS[id] || '';
}
