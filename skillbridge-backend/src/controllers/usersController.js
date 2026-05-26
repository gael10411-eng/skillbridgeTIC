const supabase = require('../config/supabaseClient');


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

// CREAR USUARIO (GENÉRICO)

async function createUser(req, res) {
  try {
    const { nombre, email, password_hash, rol } = req.body;

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
      id: data.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { usersList, createUser };