const supabase = require('../config/supabaseClient');

async function getMentors(req, res) {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select(`
        id,
        user_id,
        titulo,
        bio,
        rating,
        reviews,
        availability,
        sessions,
        users:user_id (
          id,
          nombre,
          email,
          avatar
        )
      `)
      .order('rating', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const mentors = (data || []).map((mentor) => ({
      id: mentor.user_id,
      mentorProfileId: mentor.id,
      nombre: mentor.users?.nombre || 'Mentor',
      email: mentor.users?.email || '',
      avatar: mentor.users?.avatar || '',
      titulo: mentor.titulo || 'Mentor TIC',
      bio: mentor.bio || '',
      rating: Number(mentor.rating || 5),
      reviews: mentor.reviews || 0,
      availability: mentor.availability || 'Disponible',
      sessions: mentor.sessions || 0
    }));

    return res.json(mentors);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getMentorships(req, res) {
  try {
    const { user_id } = req.query;

    let query = supabase
      .from('mentorships')
      .select(`
        id,
        mentor_id,
        estudiante_id,
        tema,
        descripcion,
        fecha,
        hora,
        tipo,
        estado,
        duracion,
        notas,
        feedback,
        rating,
        fecha_creacion,
        mentor:mentor_id (
          id,
          nombre,
          email,
          avatar
        ),
        estudiante:estudiante_id (
          id,
          nombre,
          email,
          avatar
        )
      `)
      .order('fecha_creacion', { ascending: false });

    if (user_id) {
      query = query.or(`estudiante_id.eq.${user_id},mentor_id.eq.${user_id}`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function createMentorship(req, res) {
  try {
    const {
      mentor_id,
      estudiante_id,
      tema,
      descripcion,
      fecha,
      hora,
      duracion,
      tipo
    } = req.body;

    if (!mentor_id || !estudiante_id || !tema || !fecha) {
      return res.status(400).json({
        success: false,
        error: 'Mentor, estudiante, tema y fecha son obligatorios'
      });
    }

    const { data, error } = await supabase
      .from('mentorships')
      .insert([
        {
          mentor_id,
          estudiante_id,
          tema,
          descripcion: descripcion || null,
          fecha,
          hora: hora || null,
          duracion: duracion || '60',
          tipo: tipo || 'video',
          estado: 'pendiente',
          notas: 'Solicitud enviada. El mentor confirmara la disponibilidad.'
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      success: true,
      mentorship: data
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMentors,
  getMentorships,
  createMentorship
};
