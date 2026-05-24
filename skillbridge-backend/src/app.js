const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba conexión frontend-backend
app.get('/api/test', (req, res) => {

    res.json({
        message: 'Frontend y backend conectados'
    });

});

// Rutas
app.use('/users', require('./routes/usersRoutes'));

// Futuras rutas
// app.use('/projects', require('./routes/projectsRoutes'));
// app.use('/teams', require('./routes/teamsRoutes'));

module.exports = app;