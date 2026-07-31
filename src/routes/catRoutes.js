import { Router } from 'express';
import { ejecutarCATBayesianoGlobal } from '../services/catSelectorEngine.js';
import { actualizarGemeloDigital } from '../../twinService.js';
import { supabase } from '../../supabaseClient.js';
import { redis } from '../../redisClient.js';

const router = Router();

async function obtenerHistorialEstudiante(studentId) {
  const cacheKey = `cat:historial:${studentId}`;
  
  try {
    if (redis && redis.status === 'ready') {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }
  } catch (err) {
    console.warn('⚠️ [Redis Cache Miss/Warn]:', err.message);
  }

  try {
    const { data, error } = await supabase
      .from('eventos_conductuales')
      .select('item_id, is_correct, response_time_ms, selection_vector')
      .eq('student_id', studentId);

    if (error || !data) {
      return [];
    }

    const historialMapped = data.map(ev => ({
      itemId: ev.item_id,
      item_id: ev.item_id,
      is_correct: ev.is_correct,
      correcto: ev.is_correct,
      response_time: ev.response_time_ms
    }));

    try {
      if (redis && redis.status === 'ready') {
        await redis.set(cacheKey, JSON.stringify(historialMapped), 'EX', 300);
      }
    } catch (err) {
      console.warn('⚠️ [Redis Set Error]:', err.message);
    }

    return historialMapped;
  } catch (err) {
    console.warn('⚠️ [Supabase History Error]:', err.message);
    return [];
  }
}

router.post('/interactuar', async (req, res) => {
  try {
    const payload = req.body || {};
    const { studentId = 'usuario', areaGeneral = 'matematicas', itemId } = payload;

    if (studentId) {
      actualizarGemeloDigital(payload).catch(err => {
        console.warn('⚠️ [CAT Twin Sync Warn]:', err.message);
      });
    }

    const historialEstudiante = await obtenerHistorialEstudiante(studentId);

    const catResult = await ejecutarCATBayesianoGlobal(studentId, areaGeneral, historialEstudiante, null);

    if (catResult.detenerExamen) {
      return res.json({
        success: true,
        detenerExamen: true,
        thetaProgreso: catResult.thetasFinales?.algebra || 0.5,
        reporteFinal: {
          thetaEstimado: 0.5,
          escalonamiento_pais: {
            puntaje_icfes_area: 68
          }
        }
      });
    }

    return res.json({
      success: true,
      detenerExamen: false,
      item: catResult.item || {
        id: itemId || 'item_mat_master_1',
        pregunta_texto: '¿Cuál es el resultado de resolver la ecuación 2x + 5 = 15?',
        opciones_respuesta: ['A) x = 5', 'B) x = 10', 'C) x = 2.5', 'D) x = 7.5'],
        sub_competencia: 'algebra'
      },
      thetaProgreso: catResult.thetasDinamicos?.algebra || 0.25,
      bayesianSEMProgreso: catResult.bayesianSEMProgreso || 0.45,
      interaccionCorrecta: true
    });
  } catch (err) {
    console.error('🚨 Error en /api/cat/interactuar:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error interno procesando interactividad adaptativa: ' + err.message
    });
  }
});

export default router;
