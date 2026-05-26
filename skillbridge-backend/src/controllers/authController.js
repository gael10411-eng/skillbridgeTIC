const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');


const db = require('../config/db');

// =====================================
// LOGIN
// =====================================

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: 'Faltan datos'
      });

    }

    // Buscar usuario
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    // Usuario no existe
    if (rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });

    }

    const user = rows[0];

    // Comparar contraseña
    // OJO:
    // aquí estás usando contraseña normal
    // luego puedes usar bcrypt

    if (user.password_hash !== password) {

      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });

    }

    // Login correcto
    res.json({
      success: true,
      message: 'Login correcto',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

// =====================================
// REGISTER
// =====================================

const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    // Validaciones
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: 'Faltan datos'
      });

    }

    // Verificar si ya existe
    const [exist] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (exist.length > 0) {

      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });

    }

    // Insertar usuario
    await db.query(
      `INSERT INTO users 
      (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)`,
      [name, email, password, 'cliente']
    );

    res.json({
      success: true,
      message: 'Usuario registrado'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = {
  login,
  register
};e = require('../config/supabaseClient');


// ========================
// REGISTER
// ========================
async function register(req, res) {
  console.log("BODY RECIBIDO:", req.body);

  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Nombre, email y password son obligatorios'
      });
    }

    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      console.error(findError);
      return res.status(500).json({
        error: 'Error verificando usuario'
      });
    }

    if (existingUser) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nombre,
          email,
          password_hash,
          rol: rol || 'estudiante'
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      return res.status(500).json({
        error: error?.message || 'Error creando usuario'
      });
    }

    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        rol: data.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}

// ========================
// LOGIN
// ========================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son obligatorios'
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error buscando usuario'
      });
    }

    if (!user) {
      return res.status(400).json({
        error: 'Usuario no encontrado'
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(400).json({
        error: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
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
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}

module.exports ={
  register,
  login,
};