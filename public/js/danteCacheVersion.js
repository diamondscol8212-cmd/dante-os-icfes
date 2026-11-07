/* Versión única de cache-bust y badge. Bump aquí y en el title/badge al publicar. */
window.DANTE_CACHE_VERSION = 'c-1.3.61';
document.addEventListener('DOMContentLoaded', function () {
  const badge = document.getElementById('badgeDanteVersion');
  if (badge) badge.textContent = window.DANTE_CACHE_VERSION;
});
