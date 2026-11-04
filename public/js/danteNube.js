(function () {
  // Persistencia solo por API del servidor. No crear cliente Supabase en el navegador.
  async function cliente() {
    return null;
  }

  function idAlumno(id) {
    return String(id || '').toLowerCase().trim().split('@')[0];
  }

  async function leerExpediente(studentId) {
    const id = idAlumno(studentId);
    if (!id) return null;
    try {
      const q = new URLSearchParams({ estudiante: id });
      const resp = await fetch('/api/dante/expediente?' + q.toString(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      if (!json || !json.ok) return null;
      return {
        progreso: Array.isArray(json.progreso) ? json.progreso : [],
        eventos: Array.isArray(json.eventos) ? json.eventos : []
      };
    } catch (e) {
      return null;
    }
  }

  window.DanteNube = { cliente: cliente, leerExpediente: leerExpediente };
})();
