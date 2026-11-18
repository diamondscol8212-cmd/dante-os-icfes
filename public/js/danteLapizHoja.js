/**
 * Recordatorio flotante estilo cartilla ICFES: ten a mano lápiz y hoja.
 * Se muestra al entrar a una sesión nueva. Solo cierra al marcar A.
 * Sin «no volver a mostrar».
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'modalLapizHoja';
  var STYLE_ID = 'danteLapizHojaStyle';
  var _abierto = false;
  var _onListo = null;

  var OPCIONES = [
    { letra: 'A', texto: 'Ya tengo lápiz y hoja', ok: true },
    { letra: 'B', texto: 'Lo haré solo de memoria', ok: false },
    { letra: 'C', texto: 'No necesito escribir nada', ok: false },
    { letra: 'D', texto: 'Paso este aviso', ok: false }
  ];

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = [
      '#' + ROOT_ID + '{position:fixed;inset:0;z-index:10070;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(2,6,23,.55);backdrop-filter:blur(4px);}',
      '#' + ROOT_ID + '.hidden{display:none!important;}',
      '#' + ROOT_ID + ' .lh-card{width:min(22rem,100%);background:#fff;color:#111;border:1px solid #e2e8f0;border-radius:.85rem;box-shadow:0 18px 40px rgba(15,23,42,.28);padding:1rem .95rem 1.05rem;font-family:"Plus Jakarta Sans",system-ui,sans-serif;}',
      '#' + ROOT_ID + ' .lh-kicker{margin:0 0 .35rem;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#64748b;font-family:ui-monospace,monospace;font-weight:700;}',
      '#' + ROOT_ID + ' .lh-enun{margin:0 0 .85rem;font-size:1.02rem;line-height:1.5;font-weight:500;color:#111;}',
      '#' + ROOT_ID + ' .lh-opts{display:flex;flex-direction:column;}',
      '#' + ROOT_ID + ' .lh-opt{display:flex;align-items:center;gap:.7rem;width:100%;text-align:left;margin:0;padding:.85rem .1rem;border:0;border-bottom:1px solid #e0e0e0;border-radius:0;background:transparent;color:#111;font-size:.98rem;cursor:pointer;font-family:inherit;}',
      '#' + ROOT_ID + ' .lh-opt:last-of-type{border-bottom:0;}',
      '#' + ROOT_ID + ' .lh-opt:hover{background:rgba(15,23,42,.03);}',
      '#' + ROOT_ID + ' .lh-badge{box-sizing:border-box;width:1.75rem;height:1.75rem;min-width:1.75rem;border-radius:50%;border:2px solid #555;background:#fff;flex-shrink:0;display:inline-block;}',
      '#' + ROOT_ID + ' .lh-letra{font-weight:700;min-width:1.1rem;flex-shrink:0;color:#111;}',
      '#' + ROOT_ID + ' .lh-txt{flex:1;min-width:0;line-height:1.4;font-weight:500;}',
      '#' + ROOT_ID + ' .lh-opt.sel .lh-badge{background:#111;border-color:#111;}',
      '#' + ROOT_ID + ' .lh-opt.ok{background:rgba(21,128,61,.08);}',
      '#' + ROOT_ID + ' .lh-opt.bad{background:rgba(190,18,60,.08);}',
      '#' + ROOT_ID + ' .lh-hint{margin:.65rem 0 0;font-size:.8rem;line-height:1.4;color:#64748b;min-height:1.2em;}'
    ].join('');
    document.head.appendChild(css);
  }

  function ensureRoot() {
    ensureStyle();
    var root = document.getElementById(ROOT_ID);
    if (root) return root;
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'hidden';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'lhEnunciado');
    root.innerHTML = [
      '<div class="lh-card">',
      '  <p class="lh-kicker">Antes de la pregunta</p>',
      '  <p class="lh-enun" id="lhEnunciado">Para este ejercicio ten a mano lápiz y hoja. Escribe los pasos.</p>',
      '  <div class="lh-opts" id="lhOpts"></div>',
      '  <p class="lh-hint" id="lhHint" aria-live="polite"></p>',
      '</div>'
    ].join('');
    document.body.appendChild(root);

    var box = root.querySelector('#lhOpts');
    OPCIONES.forEach(function (op) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lh-opt';
      btn.dataset.letra = op.letra;
      btn.dataset.ok = op.ok ? '1' : '0';
      btn.innerHTML = '<span class="lh-badge" aria-hidden="true"></span>'
        + '<span class="lh-letra">' + op.letra + '</span>'
        + '<span class="lh-txt">' + op.texto + '</span>';
      btn.addEventListener('click', function () { onElegir(op, btn); });
      box.appendChild(btn);
    });
    return root;
  }

  function resetUi() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var hint = root.querySelector('#lhHint');
    if (hint) hint.textContent = '';
    Array.prototype.forEach.call(root.querySelectorAll('.lh-opt'), function (b) {
      b.classList.remove('sel', 'ok', 'bad');
      b.disabled = false;
    });
  }

  function cerrarYSeguir() {
    var root = document.getElementById(ROOT_ID);
    if (root) {
      root.classList.add('hidden');
      root.style.display = 'none';
    }
    _abierto = false;
    var cb = _onListo;
    _onListo = null;
    if (typeof cb === 'function') {
      try { cb(); } catch (e) {}
    }
  }

  function onElegir(op, btn) {
    if (!_abierto) return;
    var root = document.getElementById(ROOT_ID);
    var hint = root && root.querySelector('#lhHint');
    Array.prototype.forEach.call((root && root.querySelectorAll('.lh-opt')) || [], function (b) {
      b.classList.remove('sel', 'ok', 'bad');
    });
    btn.classList.add('sel');
    if (op.ok) {
      btn.classList.add('ok');
      if (hint) hint.textContent = '';
      Array.prototype.forEach.call((root && root.querySelectorAll('.lh-opt')) || [], function (b) {
        b.disabled = true;
      });
      setTimeout(cerrarYSeguir, 220);
      return;
    }
    btn.classList.add('bad');
    if (hint) hint.textContent = 'Marca la A cuando tengas lápiz y hoja.';
  }

  /**
   * Muestra el recordatorio y llama a onListo al marcar A.
   * Si ya hay uno abierto, solo actualiza el callback.
   */
  function pedir(onListo) {
    _onListo = typeof onListo === 'function' ? onListo : null;
    var root = ensureRoot();
    resetUi();
    _abierto = true;
    root.classList.remove('hidden');
    root.style.display = 'flex';
  }

  function estaAbierto() {
    return _abierto;
  }

  global.DanteLapizHoja = {
    pedir: pedir,
    estaAbierto: estaAbierto
  };
})(typeof window !== 'undefined' ? window : this);
