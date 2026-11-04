/**
 * Anuncios de tienda (AdMob / Play · App Store).
 * En nativo muestra interstitial de Google; en web usa el modal de pausa.
 * IDs de prueba oficiales hasta configurar unidades reales en .env / build.
 */
(function () {
  const TEST_APP = 'ca-app-pub-3940256099942544~3347511713';
  const TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';

  let listo = false;
  let iniciando = null;

  function esNativo() {
    try {
      return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
    } catch (e) {
      return false;
    }
  }

  function idInterstitial() {
    return String(window.DANTE_ADMOB_INTERSTITIAL || TEST_INTERSTITIAL);
  }

  function idApp() {
    return String(window.DANTE_ADMOB_APP_ID || TEST_APP);
  }

  async function plugin() {
    try {
      const mod = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob;
      if (mod) return mod;
    } catch (e) {}
    try {
      const m = await import('@capacitor-community/admob');
      return m && (m.AdMob || m.default);
    } catch (e) {
      return null;
    }
  }

  async function inicializar() {
    if (listo) return true;
    if (!esNativo()) return false;
    if (iniciando) return iniciando;
    iniciando = (async () => {
      const admob = await plugin();
      if (!admob || typeof admob.initialize !== 'function') return false;
      await admob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [],
        initializeForTesting: true
      });
      listo = true;
      return true;
    })().catch(() => false);
    return iniciando;
  }

  function modalWeb(seguir, rotulo) {
    const modal = document.getElementById('modalAnuncioEntreTests');
    const btn = document.getElementById('btnCerrarAnuncioEntreTests');
    if (!modal || !btn) {
      if (typeof seguir === 'function') seguir();
      return;
    }
    let cerrado = false;
    const cerrar = () => {
      if (cerrado) return;
      cerrado = true;
      modal.style.display = 'none';
      if (typeof seguir === 'function') seguir();
    };
    btn.disabled = true;
    btn.textContent = 'Cargando anuncio de la tienda…';
    const sub = document.getElementById('txtAnuncioEntreTests');
    if (sub) {
      sub.textContent = 'Entre bloques se muestra publicidad de Play Store / App Store. El plan de pago solo quita estos avisos.';
    }
    modal.style.display = 'flex';
    window.setTimeout(() => {
      btn.disabled = false;
      btn.textContent = rotulo || 'Continuar al bloque';
      btn.onclick = cerrar;
    }, 2500);
  }

  async function mostrarInterstitial(seguir, rotulo) {
    if (typeof seguir !== 'function') return;
    const ok = await inicializar();
    if (!ok) {
      modalWeb(seguir, rotulo);
      return;
    }
    const admob = await plugin();
    try {
      await admob.prepareInterstitial({ adId: idInterstitial(), isTesting: true });
      await admob.showInterstitial();
      seguir();
    } catch (e) {
      modalWeb(seguir, rotulo);
    }
  }

  window.DanteAds = {
    esNativo: esNativo,
    inicializar: inicializar,
    mostrarEntreBloques: mostrarInterstitial,
    appId: idApp,
    interstitialId: idInterstitial
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { inicializar(); });
  } else {
    inicializar();
  }
})();
