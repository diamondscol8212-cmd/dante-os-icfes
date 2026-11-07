import crypto from 'crypto';
import { supabase } from '../../../supabaseClient.js';

const MATERIA = 'vistos_sala';
const TOPE = 4000;

function idAlumno(estudiante) {
  return String(estudiante || '').toLowerCase().trim().split('@')[0];
}

export async function cargarVistos(estudiante) {
  const id = idAlumno(estudiante);
  const vacio = new Set();
  if (!id) return vacio;
  let timer;
  try {
    const consulta = supabase
      .from('progreso_estudiantes')
      .select('materia, items_respondidos')
      .eq('estudiante', id)
      .in('materia', [MATERIA, 'saber_11']);
    const res = await Promise.race([
      consulta,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve({ data: null, error: 'timeout' }), 2000);
        if (timer && typeof timer.unref === 'function') timer.unref();
      })
    ]);
    clearTimeout(timer);
    if (!res || res.error || !Array.isArray(res.data)) return vacio;
    const vistos = new Set();
    res.data.forEach((row) => {
      const lista = row && row.items_respondidos;
      if (!Array.isArray(lista)) return;
      if (row.materia === MATERIA) {
        lista.forEach((item) => {
          if (item == null) return;
          // vistos_sala guarda strings (id de banco) o, en legado, UUIDs.
          if (typeof item === 'string' || typeof item === 'number') {
            vistos.add(String(item));
            return;
          }
          if (typeof item === 'object') {
            if (item.item_original) vistos.add(String(item.item_original));
            if (item.item_id) vistos.add(String(item.item_id));
            if (item.id) vistos.add(String(item.id));
          }
        });
        return;
      }
      lista.forEach((item) => {
        if (!item) return;
        if (item.item_original) vistos.add(String(item.item_original));
        // Solo añadir item_id si parece id de banco (no UUID), para no ensuciar el Set.
        const iid = item.item_id != null ? String(item.item_id) : '';
        if (iid && !/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(iid)) vistos.add(iid);
      });
    });
    return vistos;
  } catch (error) {
    clearTimeout(timer);
    return vacio;
  }
}

export async function recordarVistos(estudiante, ids) {
  const id = idAlumno(estudiante);
  const nuevos = (Array.isArray(ids) ? ids : []).map((item) => String(item || '').trim()).filter(Boolean);
  if (!id || !nuevos.length) return;
  try {
    const previo = await supabase
      .from('progreso_estudiantes')
      .select('id, items_respondidos')
      .eq('estudiante', id)
      .eq('materia', MATERIA)
      .limit(1);
    if (previo.error) return;
    const fila = previo.data && previo.data[0];
    const lista = fila && Array.isArray(fila.items_respondidos) ? fila.items_respondidos.map(String) : [];
    const conjunto = new Set(lista);
    nuevos.forEach((item) => conjunto.add(item));
    const compacta = Array.from(conjunto).slice(-TOPE);
    const payload = {
      estudiante: id,
      materia: MATERIA,
      theta_global: 0,
      preguntas_respondidas: compacta.length,
      items_respondidos: compacta,
      institution_id: 'colegio_sandbox_default',
      ultima_actualizacion: new Date().toISOString()
    };
    const guardado = fila && fila.id
      ? await supabase.from('progreso_estudiantes').update(payload).eq('id', fila.id)
      : await supabase.from('progreso_estudiantes').insert({ ...payload, id: crypto.randomUUID() });
    if (guardado.error) return;
  } catch (error) {
    return;
  }
}
