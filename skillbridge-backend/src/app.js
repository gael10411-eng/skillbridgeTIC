// ================================
// skillbridge-backend/src/app.js
// ================================

const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando correctamente'
  });
});
  
// Rutas
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes'));
app.use('/api', require('./routes/mentorshipRoutes'));

module.exports = app;
