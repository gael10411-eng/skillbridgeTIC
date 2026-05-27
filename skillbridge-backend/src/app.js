// ================================
// skillbridge-backend/src/app.js
// ================================

const express = require('express');
const cors = require('cors');
const { verifyToken, requireRole } = require('./config/authMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba (pública)
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando correctamente'
  });
});

// ========================
// RUTAS PÚBLICAS (sin autenticación)
// ========================
app.use('/api/auth', require('./routes/authRoutes'));

// ========================
// RUTAS PROTEGIDAS (requieren token)
// ========================

// Users
app.use('/api/users', verifyToken, require('./routes/usersRoutes'));

// Projects (requiere token)
app.use('/api/projects', verifyToken, require('./routes/projectRoutes'));

// Mentors (requiere token)
app.use('/api/mentors', verifyToken, require('./routes/mentorsRoutes'));

// Mentorships (requiere token)
app.use('/api/mentorships', verifyToken, require('./routes/mentorshipsRoutes'));

// Teams (requiere token)
app.use('/api/teams', verifyToken, require('./routes/teamsRoutes'));

// Certifications (requiere token)
app.use('/api/certifications', verifyToken, require('./routes/certificationsRoutes'));

module.exports = app;