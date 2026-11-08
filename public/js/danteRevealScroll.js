/**
 * Entrada visual: queda anclado abajo y sube suave hasta arriba del todo.
 * Misma sensación en sala y boletín. Sin textos ni ayudas.
 */
(function (global) {
  'use strict';

  var _lockUntil = 0;
  var _raf = 0;
  var _timer = 0;
  var _retryTimer = 0;
  var _salaGen = 0;
  var _animRaf = 0;

  function elOf(ref) {
    if (!ref) return null;
    if (typeof ref === 'string') return document.querySelector(ref);
    return ref.nodeType === 1 ? ref : null;
  }

  function isWindowScroller(scroller) {
    return scroller === document.documentElement || scroller === document.body;
  }

  function canScroll(scroller) {
    if (!scroller) return false;
    if (isWindowScroller(scroller)) {
      return Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      ) > (window.innerHeight + 12);
    }
    return scroller.scrollHeight > scroller.clientHeight + 12;
  }

  function maxScroll(scroller) {
    if (isWindowScroller(scroller)) {
      var h = Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      );
      return Math.max(0, h - window.innerHeight);
    }
    return Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  }

  function getScrollTop(scroller) {
    if (isWindowScroller(scroller)) {
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    return scroller.scrollTop || 0;
  }

  function setScrollTop(scroller, top) {
    if (isWindowScroller(scroller)) {
      window.scrollTo(0, top);
      return;
    }
    scroller.scrollTop = top;
  }

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
    return node || document.documentElement;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /** Scroll suave propio (más estable que behavior:smooth en overflow internos). */
  function animateScroll(scroller, from, to, durationMs, done) {
    if (_animRaf) cancelAnimationFrame(_animRaf);
    var start = performance.now();
    var dist = to - from;
    if (Math.abs(dist) < 2) {
      setScrollTop(scroller, to);
      if (done) done();
      return;
    }
    setScrollTop(scroller, from);
    function frame(now) {
      var t = Math.min(1, (now - start) / durationMs);
      setScrollTop(scroller, from + dist * easeInOutCubic(t));
      if (t < 1) {
        _animRaf = requestAnimationFrame(frame);
      } else {
        _animRaf = 0;
        setScrollTop(scroller, to);
        if (done) done();
      }
    }
    _animRaf = requestAnimationFrame(frame);
  }

  function targetTop(scroller, target, offset) {
    if (!target) return 0;
    if (isWindowScroller(scroller)) {
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
   * Ancla YA al fondo (sin animación) para no ver el salto arriba→abajo.
   */
  function pinBottom(preferred) {
    var scroller = resolveScroller(preferred);
    if (!scroller) return null;
    var max = maxScroll(scroller);
    if (max <= 0) {
      // Aun sin overflow medido, fuerza al final por si el layout sigue creciendo.
      if (!isWindowScroller(scroller)) scroller.scrollTop = scroller.scrollHeight;
      else window.scrollTo(0, document.documentElement.scrollHeight);
      return scroller;
    }
    setScrollTop(scroller, max);
    return scroller;
  }

  /**
   * @param {{
   *   scroller?: Element|string,
   *   target?: Element|string|null,
   *   toTop?: boolean,
   *   holdMs?: number,
   *   durationMs?: number,
   *   force?: boolean
   * }} opts
   */
  function revealFromBottom(opts) {
    opts = opts || {};
    var now = Date.now();
    if (!opts.force && now < _lockUntil) return false;

    if (_raf) cancelAnimationFrame(_raf);
    if (_timer) clearTimeout(_timer);
    if (_animRaf) cancelAnimationFrame(_animRaf);

    var preferred = elOf(opts.scroller) || document.documentElement;
    var scroller = resolveScroller(preferred);
    if (!canScroll(scroller)) return false;

    var holdMs = opts.holdMs != null ? opts.holdMs : 280;
    var durationMs = opts.durationMs != null ? opts.durationMs : 1200;
    var toTop = opts.toTop !== false && !opts.target;
    var target = opts.toTop === true ? null : elOf(opts.target);

    _lockUntil = now + holdMs + durationMs + 200;

    // 1) Quedar abajo de inmediato (sin pasar por arriba a la vista).
    setScrollTop(scroller, maxScroll(scroller));

    _timer = setTimeout(function () {
      _timer = 0;
      scroller = resolveScroller(preferred);
      if (!canScroll(scroller)) return;
      var from = maxScroll(scroller);
      setScrollTop(scroller, from);
      var to = toTop || !target ? 0 : targetTop(scroller, target, opts.offset != null ? opts.offset : 8);
      // 2) Subir suave desde el fondo hasta arriba (o ancla).
      animateScroll(scroller, from, to, durationMs);
    }, holdMs);

    return true;
  }

  /** Sala: fondo → arriba del todo (ruta vocacional incluida en el recorrido). */
  function revealSala(opts) {
    opts = opts || {};
    var gw = document.getElementById('viewGateway');
    if (!gw) return;
    if (!gw.classList.contains('active') && gw.style.display === 'none') return;

    var gen = ++_salaGen;
    if (_retryTimer) clearTimeout(_retryTimer);

    // Ancla al fondo YA, aunque aún no midamos overflow (evita flash arriba).
    try {
      gw.scrollTop = gw.scrollHeight;
    } catch (_) {}

    var attempts = 0;
    var maxAttempts = opts.retries != null ? opts.retries : 16;

    function tryOnce() {
      if (gen !== _salaGen) return;
      pinBottom(gw);
      var ok = revealFromBottom({
        scroller: gw,
        toTop: true,
        target: null,
        holdMs: 320,
        durationMs: 1350,
        force: true
      });
      if (ok) return;
      attempts += 1;
      if (attempts >= maxAttempts) return;
      _retryTimer = setTimeout(tryOnce, 120 + attempts * 35);
    }

    tryOnce();
  }

  /** Boletín / informe: fondo → marca/título (cerca del tope). */
  function revealBoletin(scrollerRef, targetRef) {
    var scroller = elOf(scrollerRef) || document.documentElement;
    pinBottom(scroller);
    revealFromBottom({
      scroller: scroller,
      target: targetRef || null,
      toTop: !targetRef,
      holdMs: 300,
      durationMs: 1250,
      force: true
    });
  }

  global.DanteRevealScroll = {
    revealFromBottom: revealFromBottom,
    revealSala: revealSala,
    revealBoletin: revealBoletin,
    pinBottom: pinBottom,
    canScroll: canScroll,
    resolveScroller: resolveScroller
  };
})(window);
