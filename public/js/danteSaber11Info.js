/**
 * Información esencial sobre el examen Saber 11° (ICFES).
 * Resumen propio basado en fuentes oficiales del Estado (icfes.gov.co,
 * Guía de orientación Saber 11.º, Resolución 268 de 2020).
 * No reproduce material oficial con fines comerciales.
 */
(function (global) {
  'use strict';

  var MODAL_ID = 'modalInfoSaber11';
  var STYLE_ID = 'styleInfoSaber11';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '#' + MODAL_ID + '{position:fixed;inset:0;z-index:2147483600;display:none;align-items:flex-end;justify-content:center;padding:0;background:rgba(2,6,14,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}',
      '#' + MODAL_ID + '.is-open{display:flex;}',
      '#' + MODAL_ID + ' .s11-panel{width:100%;max-width:560px;max-height:min(94vh,820px);background:#0c1018;border:1px solid rgba(148,163,184,.18);border-radius:22px 22px 0 0;box-shadow:0 -18px 60px rgba(0,0,0,.55);overflow:hidden;display:flex;flex-direction:column;color:#e2e8f0;font-family:ui-sans-serif,system-ui,sans-serif;}',
      '@media (min-width:840px){#' + MODAL_ID + '{align-items:center;padding:1.25rem;}#' + MODAL_ID + ' .s11-panel{border-radius:18px;max-height:min(90vh,760px);}}',
      '#' + MODAL_ID + ' .s11-head{padding:1rem 1.15rem .85rem;border-bottom:1px solid rgba(148,163,184,.14);display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;background:linear-gradient(180deg,#111827 0%,#0c1018 100%);}',
      '#' + MODAL_ID + ' .s11-kicker{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;margin:0 0 .2rem;}',
      '#' + MODAL_ID + ' .s11-title{margin:0;font-size:1.05rem;line-height:1.25;font-weight:650;color:#f8fafc;}',
      '#' + MODAL_ID + ' .s11-close{width:36px;height:36px;border-radius:999px;border:1px solid rgba(148,163,184,.22);background:rgba(255,255,255,.04);color:#cbd5e1;font-size:1.25rem;line-height:1;cursor:pointer;flex-shrink:0;}',
      '#' + MODAL_ID + ' .s11-close:hover{background:rgba(255,255,255,.08);color:#fff;}',
      '#' + MODAL_ID + ' .s11-body{padding:1rem 1.15rem 1.4rem;overflow-y:auto;-webkit-overflow-scrolling:touch;}',
      '#' + MODAL_ID + ' .s11-sec{margin:0 0 1.15rem;}',
      '#' + MODAL_ID + ' .s11-sec h4{margin:0 0 .45rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:#fbbf24;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700;}',
      '#' + MODAL_ID + ' .s11-sec p{margin:0 0 .55rem;font-size:.92rem;line-height:1.55;color:#cbd5e1;}',
      '#' + MODAL_ID + ' .s11-sec ul{margin:.15rem 0 0;padding:0 0 0 1.05rem;color:#cbd5e1;font-size:.9rem;line-height:1.5;}',
      '#' + MODAL_ID + ' .s11-sec li{margin:0 0 .35rem;}',
      '#' + MODAL_ID + ' .s11-note{margin:.65rem 0 0;padding:.7rem .8rem;border-radius:12px;border:1px solid rgba(148,163,184,.16);background:rgba(15,23,42,.65);font-size:.82rem;line-height:1.45;color:#94a3b8;}',
      '#' + MODAL_ID + ' .s11-diagram{margin:.55rem 0 .2rem;padding:.7rem .65rem;border-radius:14px;border:1px solid rgba(148,163,184,.14);background:#080b12;}',
      '#' + MODAL_ID + ' .s11-diagram svg{display:block;width:100%;height:auto;}',
      '#' + MODAL_ID + ' .s11-caption{margin:.35rem 0 0;font-size:.72rem;color:#64748b;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em;}',
      '#' + MODAL_ID + ' .s11-foot{margin-top:1rem;padding-top:.85rem;border-top:1px solid rgba(148,163,184,.12);font-size:.75rem;line-height:1.45;color:#64748b;}',
      '#' + MODAL_ID + ' .s11-foot a{color:#94a3b8;text-decoration:underline;text-underline-offset:2px;}'
    ].join('');
    document.head.appendChild(s);
  }

  function svgAreas() {
    return [
      '<svg viewBox="0 0 520 220" role="img" aria-label="Cinco pruebas del Saber 11">',
      '<rect x="8" y="8" width="504" height="204" rx="14" fill="#0b1220" stroke="#1e293b"/>',
      '<text x="28" y="36" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1.5">CINCO PRUEBAS QUE COMPONEN EL EXAMEN</text>',
      // boxes
      '<rect x="24" y="54" width="90" height="70" rx="10" fill="#111827" stroke="#334155"/>',
      '<text x="69" y="86" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">Lectura</text>',
      '<text x="69" y="104" text-anchor="middle" fill="#94a3b8" font-size="11">Crítica</text>',
      '<rect x="124" y="54" width="90" height="70" rx="10" fill="#111827" stroke="#334155"/>',
      '<text x="169" y="95" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">Matemáticas</text>',
      '<rect x="224" y="54" width="110" height="70" rx="10" fill="#111827" stroke="#334155"/>',
      '<text x="279" y="86" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">Sociales y</text>',
      '<text x="279" y="104" text-anchor="middle" fill="#94a3b8" font-size="11">Ciudadanas</text>',
      '<rect x="344" y="54" width="110" height="70" rx="10" fill="#111827" stroke="#334155"/>',
      '<text x="399" y="86" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">Ciencias</text>',
      '<text x="399" y="104" text-anchor="middle" fill="#94a3b8" font-size="11">Naturales</text>',
      '<rect x="215" y="136" width="90" height="52" rx="10" fill="#111827" stroke="#f59e0b55"/>',
      '<text x="260" y="167" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="600">Inglés</text>',
      '<text x="28" y="198" fill="#64748b" font-size="10" font-family="ui-monospace,monospace">+ cuestionario socioeconómico (no afecta el puntaje)</text>',
      '</svg>'
    ].join('');
  }

  function svgPuntaje() {
    return [
      '<svg viewBox="0 0 520 200" role="img" aria-label="Cómo se calcula el puntaje global">',
      '<rect x="8" y="8" width="504" height="184" rx="14" fill="#0b1220" stroke="#1e293b"/>',
      '<text x="28" y="36" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace" letter-spacing="1.5">DEL ÁREA AL PUNTAJE GLOBAL</text>',
      '<rect x="24" y="52" width="150" height="56" rx="10" fill="#111827" stroke="#334155"/>',
      '<text x="99" y="76" text-anchor="middle" fill="#cbd5e1" font-size="11">Cada prueba</text>',
      '<text x="99" y="94" text-anchor="middle" fill="#f8fafc" font-size="15" font-weight="700">0 — 100</text>',
      '<path d="M184 80 H214" stroke="#475569" stroke-width="2"/>',
      '<polygon points="214,76 224,80 214,84" fill="#475569"/>',
      '<rect x="232" y="52" width="150" height="56" rx="10" fill="#111827" stroke="#334155"/>',
      '<text x="307" y="76" text-anchor="middle" fill="#cbd5e1" font-size="11">Índice global</text>',
      '<text x="307" y="94" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="650">ponderado /13</text>',
      '<path d="M392 80 H422" stroke="#475569" stroke-width="2"/>',
      '<polygon points="422,76 432,80 422,84" fill="#475569"/>',
      '<rect x="440" y="52" width="56" height="56" rx="10" fill="#111827" stroke="#f59e0b66"/>',
      '<text x="468" y="76" text-anchor="middle" fill="#fbbf24" font-size="10">PG</text>',
      '<text x="468" y="94" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="700">×5</text>',
      '<text x="28" y="136" fill="#94a3b8" font-size="11" font-family="ui-monospace,monospace">Peso: LC, MA, CN y SC ×3 · Inglés ×1</text>',
      '<text x="28" y="158" fill="#e2e8f0" font-size="13" font-weight="600">Puntaje global: 0 a 500</text>',
      '<text x="28" y="178" fill="#64748b" font-size="11">Promedio nacional de referencia cercano a ~250</text>',
      '</svg>'
    ].join('');
  }

  function buildHtml() {
    return [
      '<div class="s11-panel" role="dialog" aria-modal="true" aria-labelledby="s11InfoTitle" onclick="event.stopPropagation()">',
      '  <div class="s11-head">',
      '    <div>',
      '      <p class="s11-kicker">Examen de Estado · ICFES</p>',
      '      <h3 class="s11-title" id="s11InfoTitle">Qué es y cómo funciona el Saber 11°</h3>',
      '    </div>',
      '    <button type="button" class="s11-close" aria-label="Cerrar" data-s11-close>&times;</button>',
      '  </div>',
      '  <div class="s11-body">',

      '    <section class="s11-sec">',
      '      <h4>Qué es</h4>',
      '      <p>El <strong>Examen de Estado de la Educación Media, Saber 11°</strong>, es la evaluación estandarizada oficial del ICFES. Mide el nivel de competencias de quienes terminan (o validan) la educación media en Colombia.</p>',
      '    </section>',

      '    <section class="s11-sec">',
      '      <h4>Para qué sirve y qué evalúa</h4>',
      '      <p>No es un examen de memorización aislada: evalúa <strong>competencias</strong> —saber usar lo aprendido en contextos reales—.</p>',
      '      <ul>',
      '        <li>Comprobar el desarrollo de competencias al finalizar undécimo.</li>',
      '        <li>Dar al estudiante un mapa claro para su autoevaluación y proyecto de vida.</li>',
      '        <li>Informar a universidades e instituciones sobre el nivel de ingreso.</li>',
      '        <li>Servir de referencia para monitorear la calidad de la educación media en el país.</li>',
      '      </ul>',
      '    </section>',

      '    <section class="s11-sec">',
      '      <h4>Cómo está estructurado</h4>',
      '      <p>El examen se organiza en <strong>cinco pruebas</strong>. Suele presentarse en <strong>dos sesiones</strong> (cada una de varias horas, según el cuadernillo). También hay un cuestionario socioeconómico: es confidencial y <strong>no cambia el puntaje</strong>.</p>',
      '      <div class="s11-diagram">' + svgAreas() + '<p class="s11-caption">Esquema propio · áreas oficiales del ICFES</p></div>',
      '      <p>Las preguntas son de <strong>selección múltiple con única respuesta</strong>: un enunciado, una tarea y varias opciones; solo una es correcta.</p>',
      '    </section>',

      '    <section class="s11-sec">',
      '      <h4>Cómo se puntúa el resultado</h4>',
      '      <ul>',
      '        <li>Cada prueba entrega un puntaje de <strong>0 a 100</strong> (escala estadística; el promedio de referencia se sitúa cerca de 50).</li>',
      '        <li>El <strong>puntaje global (PG)</strong> va de <strong>0 a 500</strong>. Se obtiene ponderando Lectura Crítica, Matemáticas, Ciencias Naturales y Sociales y Ciudadanas con peso 3, e Inglés con peso 1; luego se multiplica por 5.</li>',
      '        <li>También recibes <strong>percentil</strong> (posición relativa frente a quienes presentaron el examen) y un <strong>nivel de desempeño</strong> por prueba (descripción cualitativa de lo que puedes hacer).</li>',
      '      </ul>',
      '      <div class="s11-diagram">' + svgPuntaje() + '<p class="s11-caption">Esquema propio · metodología oficial de resultados</p></div>',
      '      <div class="s11-note">En Dante OS entrenas esas mismas cinco áreas. El puntaje que ves aquí es una proyección de práctica: el resultado oficial lo publica solo el ICFES después del examen.</div>',
      '    </section>',

      '    <div class="s11-foot">',
      '      Resumen orientativo basado en información pública del ICFES (portal institucional, Guía de orientación Saber 11.º y Resolución 268 de 2020). Detalle oficial y actualizaciones: <a href="https://www.icfes.gov.co/evaluaciones-icfes/saber-11/" target="_blank" rel="noopener noreferrer">icfes.gov.co · Saber 11°</a>.',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function ensureModal() {
    ensureStyles();
    var el = document.getElementById(MODAL_ID);
    if (el) return el;
    el = document.createElement('div');
    el.id = MODAL_ID;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = buildHtml();
    el.addEventListener('click', function (e) {
      if (e.target === el) close();
    });
    var btn = el.querySelector('[data-s11-close]');
    if (btn) btn.addEventListener('click', close);
    document.body.appendChild(el);
    return el;
  }

  function closeDrawerIfOpen() {
    try {
      var drawer = document.getElementById('drawerAjustes');
      if (drawer && drawer.style.display === 'flex') {
        drawer.style.display = 'none';
      }
    } catch (_) {}
    try {
      var menu = document.getElementById('menuHeaderPerfil');
      if (menu) menu.classList.add('hidden');
    } catch (_) {}
  }

  function open() {
    var el = ensureModal();
    closeDrawerIfOpen();
    el.classList.add('is-open');
    el.style.display = 'flex';
    el.setAttribute('aria-hidden', 'false');
    try { document.body.style.overflow = 'hidden'; } catch (_) {}
  }

  function close() {
    var el = document.getElementById(MODAL_ID);
    if (!el) return;
    el.classList.remove('is-open');
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
    try { document.body.style.overflow = ''; } catch (_) {}
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  document.addEventListener('keydown', onKey);

  global.DanteSaber11Info = {
    open: open,
    close: close,
    ensure: ensureModal
  };
  global.abrirInfoSaber11 = open;
  global.cerrarInfoSaber11 = close;
})(window);
