const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

// ========================
// REGISTER
// ========================
const register = async (req, res) => {

  console.log("BODY RECIBIDO:", req.body);

  try {

    const { nombre, email, password, rol } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {

      return res.status(400).json({
        success: false,
        error: 'Nombre, email y password son obligatorios'
      });

    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (findError) {

      console.error(findError);

      return res.status(500).json({
        success: false,
        error: 'Error verificando usuario'
      });

    }

    // Usuario existente
    if (existingUser) {

      return res.status(400).json({
        success: false,
        error: 'El correo ya está registrado'
      });

    }

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar usuario
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
        success: false,
        error: error?.message || 'Error creando usuario'
      });

    }

    // Crear token
    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        rol: data.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // Respuesta
    return res.status(201).json({
      success: true,
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
      success: false,
      error: error.message
    });

  }

};

// ========================
// LOGIN
// ========================
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        error: 'Email y password son obligatorios'
      });

    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        error: 'Error buscando usuario'
      });

    }

    // Usuario no encontrado
    if (!user) {

      return res.status(400).json({
        success: false,
        error: 'Usuario no encontrado'
      });

    }

    // Comparar contraseña
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {

      return res.status(400).json({
        success: false,
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

    // Respuesta
    return res.json({
      success: true,
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
      success: false,
      error: error.message
    });

  }

};

// ========================
// EXPORTS
// ========================
module.exports = {
  register,
  login
};