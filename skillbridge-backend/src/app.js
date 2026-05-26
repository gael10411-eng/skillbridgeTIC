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
app.use('/users', require('./routes/usersRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;