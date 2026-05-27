const supabase = require('../config/supabaseClient');

async function getCertifications(req, res) {
  try {
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
        certification_skills (
          skills (
            id,
            nombre
          )
        )
      `)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const certifications = (data || []).map((certification) => ({
      ...certification,
      skills: (certification.certification_skills || [])
        .map((item) => item.skills?.nombre)
        .filter(Boolean)
    }));

    return res.json(certifications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getEarnedCertifications(req, res) {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('earned_certifications')
      .select(`
        id,
        user_id,
        certification_id,
        fecha_obtenida,
        credential_id,
        verification_url,
        certifications:certification_id (
          id,
          nombre,
          descripcion,
          nivel,
          duracion,
          imagen,
          certification_skills (
            skills (
              id,
              nombre
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('fecha_obtenida', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const earned = (data || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      certification_id: item.certification_id,
      fecha_obtenida: item.fecha_obtenida,
      credential_id: item.credential_id,
      verification_url: item.verification_url,
      certification: {
        ...item.certifications,
        skills: (item.certifications?.certification_skills || [])
          .map((skillItem) => skillItem.skills?.nombre)
          .filter(Boolean)
      }
    }));

    return res.json(earned);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCertifications,
  getEarnedCertifications
};
