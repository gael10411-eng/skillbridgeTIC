const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

// LISTAR USUARIOS
async function usersList(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// CREAR USUARIO (REGISTRO)
async function createUser(req, res) {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password es requerido' });
    }

    // 🔐 HASH DE PASSWORD
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

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { usersList, createUser };