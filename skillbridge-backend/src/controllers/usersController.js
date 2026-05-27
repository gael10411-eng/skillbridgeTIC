const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

// LISTAR USUARIOS
async function usersList(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, nombre, email, rol, estado, avatar, fecha_creacion');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserProfile(req, res) {
  try {
    const { id } = req.params;

    const [
      userResult,
      statsResult,
      projectsResult,
      mentorshipsResult,
      earnedResult,
      mentorResult
    ] = await Promise.all([
      supabase
        .from('users')
        .select('id, nombre, email, rol, estado, avatar, fecha_creacion')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('user_stats')
        .select('proyectos_activos, mentorias, certificaciones, progreso_global, ultima_actualizacion')
        .eq('user_id', id)
        .maybeSingle(),
      supabase
        .from('projects')
        .select('id, titulo, descripcion, visibilidad, estado, imagen, fecha_creacion')
        .eq('owner_id', id)
        .order('fecha_creacion', { ascending: false })
        .limit(6),
      supabase
        .from('mentorships')
        .select('id, mentor_id, estudiante_id, tema, fecha, hora, estado, tipo, duracion, notas')
        .or(`estudiante_id.eq.${id},mentor_id.eq.${id}`)
        .order('fecha_creacion', { ascending: false })
        .limit(6),
      supabase
        .from('earned_certifications')
        .select(`
          id,
          fecha_obtenida,
          credential_id,
          verification_url,
          certifications:certification_id (
            id,
            nombre,
            nivel,
            imagen
          )
        `)
        .eq('user_id', id)
        .order('fecha_obtenida', { ascending: false })
        .limit(6),
      supabase
        .from('mentors')
        .select('id, titulo, bio, rating, reviews, availability, sessions')
        .eq('user_id', id)
        .maybeSingle()
    ]);

    if (userResult.error) {
      return res.status(500).json({ error: userResult.error.message });
    }

    if (!userResult.data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const warnings = [
      statsResult.error && `user_stats: ${statsResult.error.message}`,
      projectsResult.error && `projects: ${projectsResult.error.message}`,
      mentorshipsResult.error && `mentorships: ${mentorshipsResult.error.message}`,
      earnedResult.error && `earned_certifications: ${earnedResult.error.message}`,
      mentorResult.error && `mentors: ${mentorResult.error.message}`
    ].filter(Boolean);

    const projects = projectsResult.error ? [] : projectsResult.data || [];
    const mentorships = mentorshipsResult.error ? [] : mentorshipsResult.data || [];
    const certifications = earnedResult.error ? [] : earnedResult.data || [];

    return res.json({
      user: userResult.data,
      stats: statsResult.error || !statsResult.data ? {
        proyectos_activos: projects.filter((project) => project.estado === 'activo').length,
        mentorias: mentorships.length,
        certificaciones: certifications.length,
        progreso_global: 0,
        ultima_actualizacion: null
      } : statsResult.data,
      projects,
      mentorships,
      certifications,
      mentorProfile: mentorResult.error ? null : mentorResult.data || null,
      warnings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const { id } = req.params;
    const { nombre, avatar } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        nombre,
        avatar: avatar || null
      })
      .eq('id', id)
      .select('id, nombre, email, rol, estado, avatar, fecha_creacion')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// CREAR USUARIO (REGISTRO)
async function createUser(req, res) {
    console.log("BODY RECIBIDO:", req.body);

  try {
    const { nombre, email, password, rol } = req.body;
    const allowedRoles = ['estudiante', 'empresa', 'institucion', 'admin'];
    const safeRole = allowedRoles.includes(rol) ? rol : 'estudiante';

    if (!password) {
      return res.status(400).json({ error: 'Password es requerido' });
    }

    // HASH HASH DE PASSWORD
    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nombre,
          email,
          password_hash,
          rol: safeRole
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

module.exports = {
  usersList,
  getUserProfile,
  updateUserProfile,
  createUser
};
