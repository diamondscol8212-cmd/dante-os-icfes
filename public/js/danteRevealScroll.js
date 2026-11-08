/**
 * Entrada visual: salta al fondo del scroller y sube suave hasta un ancla.
 * Sin textos ni ayudas — solo movimiento. Si no hay overflow, no hace nada.
 */
(function (global) {
  'use strict';

  var _lockUntil = 0;
  var _raf = 0;
  var _timer = 0;

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
   * @param {{ scroller?: Element|string, target?: Element|string, offset?: number, holdMs?: number, durationHintMs?: number }} opts
   */
  function revealFromBottom(opts) {
    opts = opts || {};
    var now = Date.now();
    if (now < _lockUntil) return;
    _lockUntil = now + 700;

    if (_raf) cancelAnimationFrame(_raf);
    if (_timer) clearTimeout(_timer);

    var scroller = elOf(opts.scroller) || document.documentElement;
    var target = elOf(opts.target);
    var holdMs = opts.holdMs != null ? opts.holdMs : 90;
    var offset = opts.offset != null ? opts.offset : 10;

    var pass = 0;
    function tick() {
      pass += 1;
      if (pass < 2) {
        _raf = requestAnimationFrame(tick);
        return;
      }
      _raf = 0;
      if (!canScroll(scroller)) return;

      setScrollTop(scroller, maxScroll(scroller));

      _timer = setTimeout(function () {
        _timer = 0;
        if (!canScroll(scroller)) return;
        var top = target ? targetTop(scroller, target, offset) : 0;
        smoothTo(scroller, top);
      }, holdMs);
    }
    _raf = requestAnimationFrame(tick);
  }

  /** Atajo sala Dante: #viewGateway → espiral. */
  function revealSala() {
    var gw = document.getElementById('viewGateway');
    if (!gw || !gw.classList.contains('active')) return;
    revealFromBottom({
      scroller: gw,
      target: document.getElementById('contenedorOrbeDante'),
      offset: 8,
      holdMs: 100
    });
  }

  /** Atajo boletín / informe: scroller → marca/título. */
  function revealBoletin(scrollerRef, targetRef) {
    revealFromBottom({
      scroller: scrollerRef || document.documentElement,
      target: targetRef || null,
      offset: 12,
      holdMs: 110
    });
  }

  global.DanteRevealScroll = {
    revealFromBottom: revealFromBottom,
    revealSala: revealSala,
    revealBoletin: revealBoletin,
    canScroll: canScroll
  };
})(window);
