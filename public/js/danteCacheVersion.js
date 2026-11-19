/** Versión de caché visible en sala / perfil. Subir en cada ship visible. */
window.DANTE_CACHE_VERSION = 'c-1.3.143';
(function () {
  function pintar() {
    var ver = window.DANTE_CACHE_VERSION || '';
    var nodos = document.querySelectorAll('#badgeDanteVersion, #danteCacheBadge, [data-dante-cache]');
    for (var i = 0; i < nodos.length; i++) nodos[i].textContent = ver;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pintar);
  } else {
    pintar();
  }
})();
