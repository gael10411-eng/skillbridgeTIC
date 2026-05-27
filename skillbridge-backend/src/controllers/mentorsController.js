const mentorsModel = require('../models/mentorsModel');

// ========================
// GET ALL MENTORS
// ========================
async function getMentors(req, res) {
  try {
    const mentors = await mentorsModel.getAllMentors();
    res.json(mentors);
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET MENTOR BY ID
// ========================
async function getMentorById(req, res) {
  try {
    const { id } = req.params;
    const mentor = await mentorsModel.getMentorById(id);

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor no encontrado' });
    }

    res.json(mentor);
  } catch (err) {
    console.error('Error fetching mentor:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// CREATE MENTOR
// ========================
async function createMentor(req, res) {
  try {
    const { user_id, nombre, titulo, bio, avatar } = req.body;

    // Validar campos requeridos
    if (!user_id || !nombre || !titulo) {
      return res.status(400).json({
        error: 'user_id, nombre y título son requeridos'
      });
    }

    const mentor = await mentorsModel.createMentor(
      user_id,
      nombre,
      titulo,
      bio,
      avatar
    );

    res.status(201).json({
      success: true,
      message: 'Mentor creado exitosamente',
      mentor
    });
  } catch (err) {
    console.error('Error creating mentor:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// UPDATE MENTOR
// ========================
async function updateMentor(req, res) {
  try {
    const { id } = req.params;
    const { nombre, titulo, bio, avatar, rating, reviews, availability, sessions } = req.body;

    // Verificar que el mentor existe
    const existingMentor = await mentorsModel.getMentorById(id);
    if (!existingMentor) {
      return res.status(404).json({ error: 'Mentor no encontrado' });
    }

    // Preparar actualizaciones
    const updates = {};
    if (nombre) updates.nombre = nombre;
    if (titulo) updates.titulo = titulo;
    if (bio) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (rating !== undefined) updates.rating = rating;
    if (reviews !== undefined) updates.reviews = reviews;
    if (availability) updates.availability = availability;
    if (sessions !== undefined) updates.sessions = sessions;

    const updatedMentor = await mentorsModel.updateMentor(id, updates);

    res.json({
      success: true,
      message: 'Mentor actualizado exitosamente',
      mentor: updatedMentor
    });
  } catch (err) {
    console.error('Error updating mentor:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// DELETE MENTOR
// ========================
async function deleteMentor(req, res) {
  try {
    const { id } = req.params;

    // Verificar que el mentor existe
    const existingMentor = await mentorsModel.getMentorById(id);
    if (!existingMentor) {
      return res.status(404).json({ error: 'Mentor no encontrado' });
    }

    const deletedMentor = await mentorsModel.deleteMentor(id);

    res.json({
      success: true,
      message: 'Mentor eliminado exitosamente',
      mentor: deletedMentor
    });
  } catch (err) {
    console.error('Error deleting mentor:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor
};
