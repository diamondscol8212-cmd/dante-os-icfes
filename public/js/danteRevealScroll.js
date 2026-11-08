/**
 * Entrada visual: salta al fondo del scroller y sube suave hasta un ancla.
 * Sin textos ni ayudas — solo movimiento. Si no hay overflow, no hace nada.
 */
(function (global) {
  'use strict';

  var _lockUntil = 0;
  var _raf = 0;
  var _timer = 0;
  var _retryTimer = 0;
  var _salaGen = 0;

  function elOf(ref) {
    if (!ref) return null;
    if (typeof ref === 'string') return document.querySelector(ref);
    return ref.nodeType === 1 ? ref : null;
  }

  function canScroll(scroller) {
    if (!scroller) return false;
    if (scroller === document.documentElement || scroller === document.body) {
      return Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      ) > (window.innerHeight + 12);
    }
    return scroller.scrollHeight > scroller.clientHeight + 12;
  }

  function maxScroll(scroller) {
    if (scroller === document.documentElement || scroller === document.body) {
      var h = Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      );
      return Math.max(0, h - window.innerHeight);
    }
    return Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  }

  function setScrollTop(scroller, top) {
    if (scroller === document.documentElement || scroller === document.body) {
      window.scrollTo(0, top);
      return;
    }
    scroller.scrollTop = top;
  }

  function smoothTo(scroller, top) {
    if (scroller === document.documentElement || scroller === document.body) {
      window.scrollTo({ top: top, behavior: 'smooth' });
      return;
    }
    try {
      scroller.scrollTo({ top: top, behavior: 'smooth' });
    } catch (_) {
      scroller.scrollTop = top;
    }
  }

  function targetTop(scroller, target, offset) {
    if (!target) return 0;
    if (scroller === document.documentElement || scroller === document.body) {
      var y = 0;
      var node = target;
      while (node) {
        y += node.offsetTop || 0;
        node = node.offsetParent;
      }
      return Math.max(0, y - (offset || 8));
    }
    var sRect = scroller.getBoundingClientRect();
    var tRect = target.getBoundingClientRect();
    return Math.max(0, scroller.scrollTop + (tRect.top - sRect.top) - (offset || 8));
  }

  /**
   * Resuelve el elemento que realmente scrollea (gw, o ancestro, o ventana).
   */
  function resolveScroller(preferred) {
    var node = elOf(preferred);
    if (node && canScroll(node)) return node;
    if (node) {
      var p = node.parentElement;
      while (p && p !== document.body) {
        var st = window.getComputedStyle(p);
        var oy = st && st.overflowY;
        if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && canScroll(p)) return p;
        p = p.parentElement;
      }
    }
    if (canScroll(document.documentElement)) return document.documentElement;
    if (node) return node;
    return document.documentElement;
  }

  /**
   * @param {{ scroller?: Element|string, target?: Element|string, offset?: number, holdMs?: number, force?: boolean }} opts
   * @returns {boolean} true si arrancó la animación
   */
  function revealFromBottom(opts) {
    opts = opts || {};
    var now = Date.now();
    if (!opts.force && now < _lockUntil) return false;

    if (_raf) cancelAnimationFrame(_raf);
    if (_timer) clearTimeout(_timer);

    var preferred = elOf(opts.scroller) || document.documentElement;
    var scroller = resolveScroller(preferred);
    var target = elOf(opts.target);
    var holdMs = opts.holdMs != null ? opts.holdMs : 90;
    var offset = opts.offset != null ? opts.offset : 10;

    if (!canScroll(scroller)) return false;

    // Candado solo cuando sí hay overflow y vamos a animar.
    _lockUntil = now + 1200;

    var pass = 0;
    function tick() {
      pass += 1;
      if (pass < 2) {
        _raf = requestAnimationFrame(tick);
        return;
      }
      _raf = 0;
      scroller = resolveScroller(preferred);
      if (!canScroll(scroller)) return;

      setScrollTop(scroller, maxScroll(scroller));

      _timer = setTimeout(function () {
        _timer = 0;
        scroller = resolveScroller(preferred);
        if (!canScroll(scroller)) return;
        var top = target ? targetTop(scroller, target, offset) : 0;
        smoothTo(scroller, top);
      }, holdMs);
    }
    _raf = requestAnimationFrame(tick);
    return true;
  }

  /**
   * Sala: reintenta hasta que el layout tenga overflow (carga desde perfil, etc.).
   */
  function revealSala(opts) {
    opts = opts || {};
    var gw = document.getElementById('viewGateway');
    if (!gw) return;
    if (!gw.classList.contains('active') && gw.style.display === 'none') return;

    var gen = ++_salaGen;
    if (_retryTimer) clearTimeout(_retryTimer);

    var attempts = 0;
    var maxAttempts = opts.retries != null ? opts.retries : 12;

    function tryOnce() {
      if (gen !== _salaGen) return;
      var orb = document.getElementById('contenedorOrbeDante');
      var ok = revealFromBottom({
        scroller: gw,
        target: orb,
        offset: 8,
        holdMs: 110,
        force: attempts === 0 ? !!opts.force : true
      });
      if (ok) return;
      attempts += 1;
      if (attempts >= maxAttempts) return;
      _retryTimer = setTimeout(tryOnce, 140 + attempts * 40);
    }

    tryOnce();
  }

  /** Atajo boletín / informe: scroller → marca/título. */
  function revealBoletin(scrollerRef, targetRef) {
    revealFromBottom({
      scroller: scrollerRef || document.documentElement,
      target: targetRef || null,
      offset: 12,
      holdMs: 110,
      force: true
    });
  }

  global.DanteRevealScroll = {
    revealFromBottom: revealFromBottom,
    revealSala: revealSala,
    revealBoletin: revealBoletin,
    canScroll: canScroll,
    resolveScroller: resolveScroller
  };
})(window);
