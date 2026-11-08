/**
 * Un solo recorrido: anclado abajo → sube suave hasta arriba.
 * Sala, perfil y boletín. Sin reinicios ni “varios movimientos”.
 */
(function (global) {
  'use strict';

  var _timer = 0;
  var _retryTimer = 0;
  var _animRaf = 0;
  var _gen = 0;
  var _active = false; // true mientras hay un reveal en curso

  function elOf(ref) {
    if (!ref) return null;
    if (typeof ref === 'string') return document.querySelector(ref);
    return ref.nodeType === 1 ? ref : null;
  }

  function isWindowScroller(scroller) {
    return !scroller || scroller === document.documentElement || scroller === document.body;
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

  /** Curva suave (un solo gesto, sin “pasos”). */
  function easeInOutQuint(t) {
    return t < 0.5
      ? 16 * t * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 5) / 32;
  }

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
      setScrollTop(scroller, from + dist * easeInOutQuint(t));
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

  function pinBottom(preferred) {
    var scroller = resolveScroller(preferred);
    if (!scroller) return null;
    var max = maxScroll(scroller);
    if (max <= 0) {
      if (!isWindowScroller(scroller)) scroller.scrollTop = scroller.scrollHeight;
      else window.scrollTo(0, document.documentElement.scrollHeight);
      return scroller;
    }
    setScrollTop(scroller, max);
    return scroller;
  }

  function finishActive() {
    _active = false;
  }

  /**
   * Un único movimiento: fondo → arriba (o ancla).
   * Si ya hay uno en curso, no reinicia.
   */
  function revealFromBottom(opts) {
    opts = opts || {};
    if (_active && !opts.restart) return false;

    if (_timer) clearTimeout(_timer);
    if (_animRaf) cancelAnimationFrame(_animRaf);

    var preferred = elOf(opts.scroller) || document.documentElement;
    var scroller = resolveScroller(preferred);
    if (!canScroll(scroller)) return false;

    var holdMs = opts.holdMs != null ? opts.holdMs : 240;
    var durationMs = opts.durationMs != null ? opts.durationMs : 1700;
    var toTop = opts.toTop === true || (!opts.target && opts.toTop !== false);
    var target = toTop ? null : elOf(opts.target);

    _active = true;
    setScrollTop(scroller, maxScroll(scroller));

    _timer = setTimeout(function () {
      _timer = 0;
      scroller = resolveScroller(preferred);
      if (!canScroll(scroller)) {
        finishActive();
        return;
      }
      // Re-pin por si el layout creció durante el hold (sin reiniciar curva).
      var from = maxScroll(scroller);
      setScrollTop(scroller, from);
      var to = toTop || !target ? 0 : targetTop(scroller, target, opts.offset != null ? opts.offset : 8);
      animateScroll(scroller, from, to, durationMs, finishActive);
    }, holdMs);

    return true;
  }

  function revealWithRetry(preferred, revealOpts, maxAttempts) {
    if (_active) {
      pinBottom(preferred);
      return;
    }
    var gen = ++_gen;
    if (_retryTimer) clearTimeout(_retryTimer);
    pinBottom(preferred);

    var attempts = 0;
    var limit = maxAttempts != null ? maxAttempts : 14;

    function tryOnce() {
      if (gen !== _gen) return;
      if (_active) return;
      pinBottom(preferred);
      var ok = revealFromBottom(Object.assign({}, revealOpts, {
        scroller: preferred,
        toTop: true,
        restart: false
      }));
      if (ok) return;
      attempts += 1;
      if (attempts >= limit) return;
      _retryTimer = setTimeout(tryOnce, 100 + attempts * 30);
    }
    tryOnce();
  }

  function revealSala(opts) {
    opts = opts || {};
    var gw = document.getElementById('viewGateway');
    if (!gw) return;
    if (!gw.classList.contains('active') && gw.style.display === 'none') return;
    try { gw.scrollTop = gw.scrollHeight; } catch (_) {}
    revealWithRetry(gw, {
      holdMs: 260,
      durationMs: 1750
    }, opts.retries != null ? opts.retries : 14);
  }

  function revealPerfil(opts) {
    opts = opts || {};
    // Perfil scrollea la ventana.
    pinBottom(document.documentElement);
    revealWithRetry(document.documentElement, {
      holdMs: 260,
      durationMs: 1750
    }, opts.retries != null ? opts.retries : 14);
  }

  function revealBoletin(scrollerRef, targetRef) {
    if (_active) return;
    var scroller = elOf(scrollerRef) || document.documentElement;
    pinBottom(scroller);
    revealFromBottom({
      scroller: scroller,
      target: targetRef || null,
      toTop: !targetRef,
      holdMs: 260,
      durationMs: 1650,
      restart: false
    });
  }

  global.DanteRevealScroll = {
    revealFromBottom: revealFromBottom,
    revealSala: revealSala,
    revealPerfil: revealPerfil,
    revealBoletin: revealBoletin,
    pinBottom: pinBottom,
    canScroll: canScroll,
    resolveScroller: resolveScroller,
    isActive: function () { return _active; }
  };
})(window);
