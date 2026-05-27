const teamsModel = require('../models/teamsModel');

// ========================
// GET ALL TEAMS
// ========================
async function getTeams(req, res) {
  try {
    const teams = await teamsModel.getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET TEAM BY ID
// ========================
async function getTeamById(req, res) {
  try {
    const { id } = req.params;
    const team = await teamsModel.getTeamById(id);

    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json(team);
  } catch (err) {
    console.error('Error fetching team:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// GET TEAMS BY PROJECT
// ========================
async function getTeamsByProject(req, res) {
  try {
    const { projectId } = req.params;
    const teams = await teamsModel.getTeamsByProject(projectId);

    res.json(teams);
  } catch (err) {
    console.error('Error fetching project teams:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// CREATE TEAM
// ========================
async function createTeam(req, res) {
  try {
    const { project_id, nombre } = req.body;

    // Validar campos requeridos
    if (!project_id || !nombre) {
      return res.status(400).json({
        error: 'project_id y nombre son requeridos'
      });
    }

    const team = await teamsModel.createTeam(project_id, nombre);

    res.status(201).json({
      success: true,
      message: 'Equipo creado exitosamente',
      team
    });
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// UPDATE TEAM
// ========================
async function updateTeam(req, res) {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    // Verificar que existe
    const existingTeam = await teamsModel.getTeamById(id);
    if (!existingTeam) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    const updates = {};
    if (nombre) updates.nombre = nombre;

    const updatedTeam = await teamsModel.updateTeam(id, updates);

    res.json({
      success: true,
      message: 'Equipo actualizado exitosamente',
      team: updatedTeam
    });
  } catch (err) {
    console.error('Error updating team:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// DELETE TEAM
// ========================
async function deleteTeam(req, res) {
  try {
    const { id } = req.params;

    // Verificar que existe
    const existingTeam = await teamsModel.getTeamById(id);
    if (!existingTeam) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    const deletedTeam = await teamsModel.deleteTeam(id);

    res.json({
      success: true,
      message: 'Equipo eliminado exitosamente',
      team: deletedTeam
    });
  } catch (err) {
    console.error('Error deleting team:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// ADD TEAM MEMBER
// ========================
async function addTeamMember(req, res) {
  try {
    const { id } = req.params;
    const { user_id, rol_en_equipo } = req.body;

    // Validar campos requeridos
    if (!user_id) {
      return res.status(400).json({
        error: 'user_id es requerido'
      });
    }

    // Verificar que el equipo existe
    const team = await teamsModel.getTeamById(id);
    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    const member = await teamsModel.addTeamMember(id, user_id, rol_en_equipo);

    res.status(201).json({
      success: true,
      message: 'Miembro agregado al equipo exitosamente',
      member
    });
  } catch (err) {
    console.error('Error adding team member:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// UPDATE TEAM MEMBER ROLE
// ========================
async function updateTeamMemberRole(req, res) {
  try {
    const { id, memberId } = req.params;
    const { rol_en_equipo } = req.body;

    // Validar campos requeridos
    if (!rol_en_equipo) {
      return res.status(400).json({
        error: 'rol_en_equipo es requerido'
      });
    }

    const updatedMember = await teamsModel.updateTeamMemberRole(memberId, rol_en_equipo);

    res.json({
      success: true,
      message: 'Rol del miembro actualizado exitosamente',
      member: updatedMember
    });
  } catch (err) {
    console.error('Error updating team member role:', err);
    res.status(500).json({ error: err.message });
  }
}

// ========================
// REMOVE TEAM MEMBER
// ========================
async function removeTeamMember(req, res) {
  try {
    const { id, memberId } = req.params;

    const removed = await teamsModel.removeTeamMember(memberId);

    res.json({
      success: true,
      message: 'Miembro removido del equipo exitosamente',
      member: removed
    });
  } catch (err) {
    console.error('Error removing team member:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getTeams,
  getTeamById,
  getTeamsByProject,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateTeamMemberRole,
  removeTeamMember
};
