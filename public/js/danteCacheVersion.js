/** Versión de caché visible en sala / perfil. Subir en cada ship visible. */
window.DANTE_CACHE_VERSION = 'c-1.3.139';
(function () {
  var badge = document.getElementById('danteCacheBadge') || document.querySelector('[data-dante-cache]');
  if (badge) badge.textContent = window.DANTE_CACHE_VERSION;
})();
