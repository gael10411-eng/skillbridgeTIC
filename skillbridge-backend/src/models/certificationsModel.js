const supabase = require('../config/supabaseClient');

// ========================
// GET ALL CERTIFICATIONS
// ========================
async function getAllCertifications() {
  const { data, error } = await supabase
    .from('certifications')
    .select(`
      id,
      nombre,
      descripcion,
      nivel,
      duracion,
      imagen,
      estado,
      progreso,
      fecha_creacion,
      skills:certification_skills(skill:skills(id, nombre))
    `)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// GET CERTIFICATION BY ID
// ========================
async function getCertificationById(certificationId) {
  const { data, error } = await supabase
    .from('certifications')
    .select(`
      id,
      nombre,
      descripcion,
      nivel,
      duracion,
      imagen,
      estado,
      progreso,
      fecha_creacion,
      skills:certification_skills(skill:skills(id, nombre))
    `)
    .eq('id', certificationId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// ========================
// GET USER'S EARNED CERTIFICATIONS
// ========================
async function getUserEarnedCertifications(userId) {
  const { data, error } = await supabase
    .from('earned_certifications')
    .select(`
      id,
      user_id,
      certification_id,
      fecha_obtenida,
      credential_id,
      verification_url,
      certifications:certification_id(
        id,
        nombre,
        descripcion,
        nivel,
        imagen,
        fecha_creacion
      )
    `)
    .eq('user_id', userId)
    .order('fecha_obtenida', { ascending: false });

  if (error) throw error;
  return data;
}

// ========================
// CREATE EARNED CERTIFICATION
// ========================
async function createEarnedCertification(userId, certificationId, credentialId, verificationUrl) {
  const { data, error } = await supabase
    .from('earned_certifications')
    .insert([
      {
        user_id: userId,
        certification_id: certificationId,
        fecha_obtenida: new Date().toISOString().split('T')[0],
        credential_id: credentialId,
        verification_url: verificationUrl
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========================
// DELETE EARNED CERTIFICATION
// ========================
async function deleteEarnedCertification(earnedCertificationId) {
  const { data, error } = await supabase
    .from('earned_certifications')
    .delete()
    .eq('id', earnedCertificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllCertifications,
  getCertificationById,
  getUserEarnedCertifications,
  createEarnedCertification,
  deleteEarnedCertification
};
