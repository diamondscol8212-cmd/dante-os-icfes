/* Cada letra confirmada se guarda al momento. Si no hay red, queda en el celular. */
(function () {
  function limpiarId(id) {
    return String(id || '').toLowerCase().trim().split('@')[0];
  }

  function idAlumno() {
    const directos = [
      localStorage.getItem('dante_student_id'),
      localStorage.getItem('dante_active_student')
    ];
    for (let i = 0; i < directos.length; i++) {
      const limpio = limpiarId(directos[i]);
      if (limpio && limpio !== 'estudiante' && limpio !== 'student_demo_01') return limpio;
    }
    try {
      const usuario = JSON.parse(localStorage.getItem('dante_user') || 'null');
      const raw = usuario && (usuario.estudiante || usuario.email || usuario.id || usuario.username);
      const limpio = limpiarId(raw);
      if (limpio && limpio !== 'estudiante') return limpio;
    } catch (e) {}
    return '';
  }

  function leerCola() {
    try {
      const raw = JSON.parse(localStorage.getItem('dante_pendiente_nube') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCola(cola) {
    try { localStorage.setItem('dante_pendiente_nube', JSON.stringify(cola.slice(-12))); } catch (e) {}
  }

  /** Aviso en pantalla: solo errores de sesión (entrar de nuevo). Cola offline = silenciosa. */
  function avisar(texto, opts) {
    try {
      localStorage.setItem('dante_guardado_estado', texto ? 'pendiente' : 'ok');
    } catch (e) {}
    const previo = document.getElementById('avisoGuardadoNube');
    if (!texto) {
      if (previo) previo.remove();
      document.body.classList.remove('aviso-nube');
      return;
    }
    const visible = opts && opts.visible === true;
    if (!visible) {
      try { console.info('[DanteRegistro]', texto); } catch (e) {}
      return;
    }
    const el = previo || document.createElement('div');
    el.id = 'avisoGuardadoNube';
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;left:50%;top:58px;transform:translateX(-50%);z-index:80;width:min(22rem,calc(100% - 1.5rem));background:#161310;color:#e7d7c3;border:1px solid rgba(231,215,195,0.32);border-radius:16px;font:500 13px/1.4 "Plus Jakarta Sans",system-ui,sans-serif;text-align:center;padding:12px 14px;box-shadow:0 16px 40px rgba(0,0,0,0.45);';
    el.textContent = texto;
    document.body.classList.remove('aviso-nube');
    if (!previo) document.body.appendChild(el);
    clearTimeout(avisar._sale);
    avisar._sale = setTimeout(function () {
      const nota = document.getElementById('avisoGuardadoNube');
      if (nota && nota.textContent === texto) nota.remove();
    }, 4200);
  }

  function encolar(paquete) {
    const cola = leerCola();
    const firma = JSON.stringify((paquete.respuestas || []).map(function (r) { return r && (r.id || r.itemId); }));
    const repetido = cola.some(function (otro) {
      return JSON.stringify((otro.respuestas || []).map(function (r) { return r && (r.id || r.itemId); })) === firma;
    });
    if (!repetido) cola.push(paquete);
    guardarCola(cola);
  }

  function idEstable(raw) {
    const texto = String(raw || '').trim();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(texto)) {
      return texto.toLowerCase();
    }
    if (!texto) return '';
    var h1 = 2166136261;
    var h2 = 2166136261 ^ 0x9e3779b9;
    var serie = 'dante:' + texto;
    for (var i = 0; i < serie.length; i++) {
      h1 ^= serie.charCodeAt(i);
      h1 = Math.imul(h1, 16777619);
      h2 ^= serie.charCodeAt(serie.length - 1 - i);
      h2 = Math.imul(h2, 16777619);
    }
    var hex = [(h1 >>> 0), (h2 >>> 0), ((h1 ^ h2) >>> 0), ((h1 + h2) >>> 0)].map(function (n) {
      return n.toString(16).padStart(8, '0');
    }).join('');
    var chars = hex.split('');
    chars[12] = '5';
    chars[16] = 'a';
    var h = chars.join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20, 32);
  }

  async function publicarDirecto() {
    // Sin cliente Supabase en el navegador: solo /api/dante/respuesta.
    return { ok: false, motivo: 'sin_nube' };
  }

  async function publicar(paquete) {
    if (!paquete || !Array.isArray(paquete.respuestas) || !paquete.respuestas.length) {
      return { ok: false, motivo: 'sin_respuestas' };
    }
    const alumno = idAlumno();
    if (!alumno) {
      avisar('Entra de nuevo con tu correo para poder guardar las respuestas.', { visible: true });
      return { ok: false, motivo: 'sin_alumno' };
    }
    try {
      const resp = await fetch('/api/dante/respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          alumno: alumno,
          tipo: paquete.tipo || 'SESION',
          theta: paquete.theta,
          sem: paquete.sem,
          puntos: paquete.puntos,
          respuestas: paquete.respuestas
        })
      });
      const data = await resp.json().catch(function () { return {}; });
      if (resp.ok && data.ok) {
        if (data.areas) {
          try { localStorage.setItem('dante_area_conteo', JSON.stringify(data.areas)); } catch (e) {}
        }
        const firmaOk = JSON.stringify((paquete.respuestas || []).map(function (r) { return r && (r.id || r.itemId); }));
        guardarCola(leerCola().filter(function (otro) {
          return JSON.stringify((otro.respuestas || []).map(function (r) { return r && (r.id || r.itemId); })) !== firmaOk;
        }));
        avisar('');
        return data;
      }
      const directo = await publicarDirecto(alumno, paquete);
      if (directo.ok) {
        if (directo.areas) {
          try { localStorage.setItem('dante_area_conteo', JSON.stringify(directo.areas)); } catch (e) {}
        }
        avisar('');
        return directo;
      }
      encolar(paquete);
      // Sin toast molesto: queda en cola local y vaciarCola reintenta al abrir la sala.
      avisar('pendiente_local');
      return { ok: false, motivo: (data && data.motivo) || directo.motivo || 'error' };
    } catch (e) {
      const directo = await publicarDirecto(alumno, paquete);
      if (directo.ok) {
        avisar('');
        return directo;
      }
      encolar(paquete);
      avisar('pendiente_local');
      return { ok: false, motivo: 'sin_red' };
    }
  }

  function guardarUna(respuesta, resumen) {
    return publicar({
      tipo: (resumen && resumen.tipo) || 'RESPUESTA',
      theta: resumen && resumen.theta,
      sem: resumen && resumen.sem,
      puntos: resumen && resumen.puntos,
      respuestas: [respuesta]
    });
  }

  function respaldoLocal() {
    try {
      const items = JSON.parse(localStorage.getItem('dante_respuestas_irt') || '[]');
      if (!Array.isArray(items) || !items.length) return null;
      const marca = localStorage.getItem('dante_respaldo_n') || '';
      if (marca === String(items.length)) return null;
      return {
        tipo: 'RESPALDO_LOCAL',
        theta: Number(localStorage.getItem('dante_theta_estimado')),
        sem: Number(localStorage.getItem('dante_sem_estimado')),
        puntos: Number(localStorage.getItem('dante_score_proyectado')),
        respuestas: items.map(function (r) {
          return {
            id: r.id,
            area: r.area || r.materia || '',
            a: r.a,
            b: r.b,
            c: r.c,
            correcto: r.correcto,
            ms: r.ms,
            letra: r.letra || ''
          };
        }),
        n: items.length
      };
    } catch (e) {
      return null;
    }
  }

  async function vaciarCola() {
    const cola = leerCola();
    guardarCola([]);
    for (let i = 0; i < cola.length; i++) {
      const res = await publicar(cola[i]);
      if (!res.ok && res.motivo !== 'sin_respuestas' && res.motivo !== 'sin_alumno') return;
    }
    const respaldo = respaldoLocal();
    if (!respaldo) return;
    const subido = await publicar(respaldo);
    if (subido.ok) {
      try { localStorage.setItem('dante_respaldo_n', String(respaldo.n)); } catch (e) {}
    }
  }

  window.DanteRegistro = {
    publicar: publicar,
    guardarUna: guardarUna,
    vaciarCola: vaciarCola,
    idAlumno: idAlumno
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { vaciarCola(); });
  } else {
    vaciarCola();
  }
})();
