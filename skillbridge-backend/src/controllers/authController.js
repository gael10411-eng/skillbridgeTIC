const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

// ========================
// REGISTER
// ========================
async function register(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;

    // 1. Verificar si existe usuario
    const { data: existingUsers, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUsers) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    // (Supabase devuelve error cuando no encuentra registro, lo ignoramos)
    if (findError && findError.code !== 'PGRST116') {
      console.error(findError);
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insertar usuario
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nombre,
          email,
          password_hash: hashedPassword,
          rol: rol || 'estudiante'
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 4. Crear token
    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        rol: data.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. RESPUESTA
    res.status(201).json({
      message: 'Usuario registrado',
      token,
      user: {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// ========================
// LOGIN
// ========================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({
        error: 'Usuario no encontrado'
      });
    }

    // 2. Verificar password
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(400).json({
        error: 'Contraseña incorrecta'
      });
    }

    // 3. Crear token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. RESPUESTA
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
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login
};