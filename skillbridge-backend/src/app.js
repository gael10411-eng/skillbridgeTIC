const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

// Seguridad básica
app.use(helmet());

// Limitar peticiones
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Leer JSON
app.use(express.json());

// Ruta test
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Frontend y backend conectados'
    });
});

// Rutas
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Futuras rutas
// app.use('/api/projects', require('./routes/projectsRoutes'));

module.exports = app;