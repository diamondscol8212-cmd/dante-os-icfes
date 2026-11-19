/**
 * Anuncios de tienda (AdMob / Play · App Store).
 * En nativo muestra interstitial de Google; en web usa el modal de pausa.
 *
 * ─── PUBLICACIÓN EN TIENDAS ───────────────────────────────────────────
 * 1) Crear app + unidad Interstitial en AdMob (Android e iOS).
 * 2) Sustituir REAL_APP_ID / REAL_INTERSTITIAL_ID abajo (o inyectar
 *    window.DANTE_ADMOB_APP_ID y window.DANTE_ADMOB_INTERSTITIAL antes
 *    de cargar este script).
 * 3) En capacitor.config.json → plugins.AdMob: mismos appId y
 *    initializeForTesting: false.
 * 4) En android/.../AndroidManifest.xml → meta-data APPLICATION_ID
 *    con el App ID real de AdMob.
 * Mientras los IDs sigan siendo los de prueba de Google, initializeForTesting
 * y isTesting quedan en true automáticamente.
 * El plan de pago (DantePlanSala.esPago) omite por completo estos avisos.
 * ──────────────────────────────────────────────────────────────────────
 */
(function () {
  // IDs de prueba oficiales de Google (NO publicar así).
  const TEST_APP = 'ca-app-pub-3940256099942544~3347511713';
  const TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';

  // >>> REEMPLAZAR por los IDs reales de AdMob antes de publicar <<<
  const REAL_APP_ID = ''; // ej. 'ca-app-pub-XXXXXXXX~YYYYYYYYYY'
  const REAL_INTERSTITIAL_ID = ''; // ej. 'ca-app-pub-XXXXXXXX/ZZZZZZZZZZ'

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
    return String(
      window.DANTE_ADMOB_INTERSTITIAL
      || REAL_INTERSTITIAL_ID
      || TEST_INTERSTITIAL
    );
  }

  function idApp() {
    return String(
      window.DANTE_ADMOB_APP_ID
      || REAL_APP_ID
      || TEST_APP
    );
  }

  function usandoPrueba() {
    const app = idApp();
    const interstitial = idInterstitial();
    return !app || !interstitial
      || app === TEST_APP
      || interstitial === TEST_INTERSTITIAL
      || app.indexOf('3940256099942544') >= 0
      || interstitial.indexOf('3940256099942544') >= 0;
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
      // Con IDs reales: initializeForTesting pasa a false solo.
      await admob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [],
        initializeForTesting: usandoPrueba()
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
      sub.textContent = 'Entre bloques aparece un aviso breve de la tienda. El plan de pago solo quita estos avisos.';
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
    // Plan de pago: nunca mostrar anuncio (doble seguro; DantePlanSala también omite).
    try {
      if (window.DantePlanSala && typeof window.DantePlanSala.esPago === 'function' && window.DantePlanSala.esPago()) {
        seguir();
        return;
      }
    } catch (e) {}
    const ok = await inicializar();
    if (!ok) {
      modalWeb(seguir, rotulo);
      return;
    }
    const admob = await plugin();
    try {
      await admob.prepareInterstitial({
        adId: idInterstitial(),
        isTesting: usandoPrueba()
      });
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
    interstitialId: idInterstitial,
    usandoIdsDePrueba: usandoPrueba
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { inicializar(); });
  } else {
    inicializar();
  }
})();
