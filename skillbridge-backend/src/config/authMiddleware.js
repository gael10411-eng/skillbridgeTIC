const jwt = require('jsonwebtoken');

// ========================
// VERIFICAR TOKEN JWT
// ========================
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token no proporcionado o formato inválido' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    req.user = decoded;
    next();

  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ 
      error: 'Token inválido o expirado',
      details: err.message
    });
  }
}

// ========================
// VERIFICAR ROL ESPECÍFICO
// ========================
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`,
        userRole: req.user.rol
      });
    }

    next();
  };
}

// ========================
// VERIFICAR OWNERSHIP
// ========================
function requireOwnership(resourceUserId) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (req.user.rol === 'admin') {
      return next();
    }

    if (req.user.id !== resourceUserId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para acceder a este recurso'
      });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
  requireOwnership
};
