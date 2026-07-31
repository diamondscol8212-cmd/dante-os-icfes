import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabase } from '../../supabaseClient.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dante_os_jwt_secret_key_2026_production';

function generarHashPassword(password, saltExistente = null) {
  const salt = saltExistente || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email y contraseña requeridos' });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !usuario) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const { hash } = generarHashPassword(password, usuario.salt);
    if (hash !== usuario.password_hash) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const tokenPayload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      institution_id: usuario.institution_id,
      arquetipo: usuario.arquetipo
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.json({
      success: true,
      token,
      usuario: {
        email: usuario.email,
        rol: usuario.rol,
        institution_id: usuario.institution_id,
        arquetipo: usuario.arquetipo
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/complete-onboarding', async (req, res) => {
  try {
    const { studentId, email, arquetipo, datos_onboarding } = req.body || {};
    return res.json({
      success: true,
      message: 'Onboarding completado exitosamente',
      arquetipo
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
