// pages/api/auth/error.js
export default function handler(req, res) {
    console.error('Error de autenticación:', req.body); // Puede que necesites ajustar `req.body` dependiendo de dónde se encuentra la información del error en tu solicitud.
    res.status(400).json({ error: 'Error de autenticación' });
  }
  