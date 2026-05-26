const supabase = require('../config/supabaseClient');

// ========================
// GET ALL USERS
// ========================
async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;

  return data;
}

// ========================
// CREATE USER
// ========================
async function createUser(nombre, email, password_hash, rol) {
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

  if (error) throw error;

  return data.id;
}

// ========================
// GET USER BY EMAIL (ÚTIL PARA AUTH)
// ========================
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

module.exports = {
  getAllUsers,
  createUser,
  getUserByEmail
};