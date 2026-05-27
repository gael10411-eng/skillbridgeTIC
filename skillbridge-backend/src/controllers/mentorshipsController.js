const mentorshipsModel = require('../models/mentorshipsModel');

// ========================
// GET ALL MENTORSHIPS
// ========================
async function getMentorships(req, res) {
  try {
    const mentorships = await mentorshipsModel.getAllMentorships();
    res.json(mentorships);
  } catch (err) {
    console.error('Error fetching mentorships:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET MENTORSHIPS BY STUDENT
// ========================
async function getMentorshipsByStudent(req, res) {
  try {
    const { estudianteId } = req.params;
    const mentorships = await mentorshipsModel.getMentorshipsByStudent(estudianteId);

    res.json(mentorships);
  } catch (err) {
    console.error('Error fetching student mentorships:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET MENTORSHIPS BY MENTOR
// ========================
async function getMentorshipsByMentor(req, res) {
  try {
    const { mentorId } = req.params;
    const mentorships = await mentorshipsModel.getMentorshipsByMentor(mentorId);

    res.json(mentorships);
  } catch (err) {
    console.error('Error fetching mentor mentorships:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET MENTORSHIP BY ID
// ========================
async function getMentorshipById(req, res) {
  try {
    const { id } = req.params;
    const mentorship = await mentorshipsModel.getMentorshipById(id);

    if (!mentorship) {
      return res.status(404).json({ error: 'Mentoría no encontrada' });
    }

    res.json(mentorship);
  } catch (err) {
    console.error('Error fetching mentorship:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// CREATE MENTORSHIP
// ========================
async function createMentorship(req, res) {
  try {
    const { mentor_id, estudiante_id, tema, descripcion, fecha, hora, duracion, tipo } = req.body;

    // Validar campos requeridos
    if (!mentor_id || !estudiante_id || !tema || !fecha || !hora) {
      return res.status(400).json({
        error: 'mentor_id, estudiante_id, tema, fecha y hora son requeridos'
      });
    }

    // Validar tipo
    const validTipos = ['virtual', 'presencial'];
    if (tipo && !validTipos.includes(tipo)) {
      return res.status(400).json({
        error: 'Tipo inválido. Usa: virtual o presencial'
      });
    }

    const mentorship = await mentorshipsModel.createMentorship(
      mentor_id,
      estudiante_id,
      tema,
      descripcion,
      fecha,
      hora,
      duracion,
      tipo
    );

    res.status(201).json({
      success: true,
      message: 'Mentoría creada exitosamente',
      mentorship
    });
  } catch (err) {
    console.error('Error creating mentorship:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// UPDATE MENTORSHIP
// ========================
async function updateMentorship(req, res) {
  try {
    const { id } = req.params;
    const { estado, notas, feedback, rating, tipo, fecha, hora, duracion } = req.body;

    // Verificar que la mentoría existe
    const existingMentorship = await mentorshipsModel.getMentorshipById(id);
    if (!existingMentorship) {
      return res.status(404).json({ error: 'Mentoría no encontrada' });
    }

    // Preparar actualizaciones
    const updates = {};
    if (estado) updates.estado = estado;
    if (notas) updates.notas = notas;
    if (feedback) updates.feedback = feedback;
    if (rating !== undefined) updates.rating = rating;
    if (tipo) updates.tipo = tipo;
    if (fecha) updates.fecha = fecha;
    if (hora) updates.hora = hora;
    if (duracion) updates.duracion = duracion;

    // Validar estado si se proporciona
    if (estado) {
      const validEstados = ['pendiente', 'confirmada', 'completada', 'cancelada'];
      if (!validEstados.includes(estado)) {
        return res.status(400).json({
          error: 'Estado inválido'
        });
      }
    }

    // Validar tipo si se proporciona
    if (tipo) {
      const validTipos = ['virtual', 'presencial'];
      if (!validTipos.includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo inválido'
        });
      }
    }

    const updatedMentorship = await mentorshipsModel.updateMentorship(id, updates);

    res.json({
      success: true,
      message: 'Mentoría actualizada exitosamente',
      mentorship: updatedMentorship
    });
  } catch (err) {
    console.error('Error updating mentorship:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// DELETE MENTORSHIP
// ========================
async function deleteMentorship(req, res) {
  try {
    const { id } = req.params;

    // Verificar que la mentoría existe
    const existingMentorship = await mentorshipsModel.getMentorshipById(id);
    if (!existingMentorship) {
      return res.status(404).json({ error: 'Mentoría no encontrada' });
    }

    const deletedMentorship = await mentorshipsModel.deleteMentorship(id);

    res.json({
      success: true,
      message: 'Mentoría eliminada exitosamente',
      mentorship: deletedMentorship
    });
  } catch (err) {
    console.error('Error deleting mentorship:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMentorships,
  getMentorshipsByStudent,
  getMentorshipsByMentor,
  getMentorshipById,
  createMentorship,
  updateMentorship,
  deleteMentorship
};
