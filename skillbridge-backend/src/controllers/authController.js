const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function register(req, res) {
    try {

        const {
            nombre,
            email,
            password,
            rol
        } = req.body;

        // Verificar usuario existente
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                error: 'El correo ya está registrado'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario
        const [result] = await db.query(
            'INSERT INTO users (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, rol || 'student']
        );

        // Crear token
        const token = jwt.sign(
            {
                id: result.insertId,
                email,
                rol: rol || 'student'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.status(201).json({
            message: 'Usuario registrado',
            token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
}

async function login(req, res) {

    try {

        const {
            email,
            password
        } = req.body;

        // Buscar usuario
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({
                error: 'Usuario no encontrado'
            });
        }

        const user = users[0];

        // Verificar password
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(400).json({
                error: 'Contraseña incorrecta'
            });
        }

        // Crear token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rol: user.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
}

module.exports = {
    register,
    login
};