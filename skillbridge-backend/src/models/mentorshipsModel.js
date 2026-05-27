const supabase = require('../config/supabaseClient');

// ========================
// GET ALL MENTORSHIPS
// ========================
async function getAllMentorships() {
  const { data, error } = await supabase
    .from('mentorships')
    .select(`
      id,
      mentor_id,
      estudiante_id,
      tema,
      descripcion,
      fecha,
      hora,
      duracion,
      estado,
      tipo,
      notas,
      feedback,
      rating,
      fecha_creacion,
      mentors:mentor_id (id, titulo, bio, availability)
    `)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// GET MENTORSHIPS BY STUDENT
// ========================
async function getMentorshipsByStudent(estudianteId) {
  const { data, error } = await supabase
    .from('mentorships')
    .select(`
      id,
      mentor_id,
      estudiante_id,
      tema,
      descripcion,
      fecha,
      hora,
      duracion,
      estado,
      tipo,
      notas,
      feedback,
      rating,
      fecha_creacion,
      mentors:mentor_id (id, titulo, bio, availability)
    `)
    .eq('estudiante_id', estudianteId)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// GET MENTORSHIPS BY MENTOR
// ========================
async function getMentorshipsByMentor(mentorId) {
  const { data, error } = await supabase
    .from('mentorships')
    .select(`
      id,
      mentor_id,
      estudiante_id,
      tema,
      descripcion,
      fecha,
      hora,
      duracion,
      estado,
      tipo,
      notas,
      feedback,
      rating,
      fecha_creacion
    `)
    .eq('mentor_id', mentorId)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// GET MENTORSHIP BY ID
// ========================
async function getMentorshipById(mentorshipId) {
  const { data, error } = await supabase
    .from('mentorships')
    .select(`
      id,
      mentor_id,
      estudiante_id,
      tema,
      descripcion,
      fecha,
      hora,
      duracion,
      estado,
      tipo,
      notas,
      feedback,
      rating,
      fecha_creacion,
      mentors:mentor_id (id, titulo, bio, availability)
    `)
    .eq('id', mentorshipId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// ========================
// CREATE MENTORSHIP
// ========================
async function createMentorship(mentor_id, estudiante_id, tema, descripcion, fecha, hora, duracion, tipo) {
  const { data, error } = await supabase
    .from('mentorships')
    .insert([
      {
        mentor_id,
        estudiante_id,
        tema,
        descripcion: descripcion || '',
        fecha,
        hora,
        duracion: duracion || '60',
        tipo: tipo || 'virtual',
        estado: 'pendiente',
        notas: null,
        feedback: null,
        rating: null,
        fecha_creacion: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// UPDATE MENTORSHIP
// ========================
async function updateMentorship(mentorshipId, updates) {
  const { data, error } = await supabase
    .from('mentorships')
    .update(updates)
    .eq('id', mentorshipId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// DELETE MENTORSHIP
// ========================
async function deleteMentorship(mentorshipId) {
  const { data, error } = await supabase
    .from('mentorships')
    .delete()
    .eq('id', mentorshipId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllMentorships,
  getMentorshipsByStudent,
  getMentorshipsByMentor,
  getMentorshipById,
  createMentorship,
  updateMentorship,
  deleteMentorship
};
