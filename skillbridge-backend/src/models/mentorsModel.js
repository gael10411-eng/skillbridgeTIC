const supabase = require('../config/supabaseClient');

// ========================
// GET ALL MENTORS
// ========================
async function getAllMentors() {
  const { data, error } = await supabase
    .from('mentors')
    .select(`
      id,
      nombre,
      titulo,
      bio,
      avatar,
      rating,
      reviews,
      availability,
      sessions,
      user_id
    `)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// GET MENTOR BY ID
// ========================
async function getMentorById(mentorId) {
  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .eq('id', mentorId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// ========================
// CREATE MENTOR
// ========================
async function createMentor(user_id, nombre, titulo, bio, avatar) {
  const { data, error } = await supabase
    .from('mentors')
    .insert([
      {
        user_id,
        nombre,
        titulo,
        bio: bio || '',
        avatar: avatar || null,
        rating: 0,
        reviews: 0,
        availability: 'disponible',
        sessions: 0,
        fecha_creacion: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// UPDATE MENTOR
// ========================
async function updateMentor(mentorId, updates) {
  const { data, error } = await supabase
    .from('mentors')
    .update({
      ...updates,
      fecha_actualizacion: new Date().toISOString()
    })
    .eq('id', mentorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// DELETE MENTOR
// ========================
async function deleteMentor(mentorId) {
  const { data, error } = await supabase
    .from('mentors')
    .delete()
    .eq('id', mentorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor
};
