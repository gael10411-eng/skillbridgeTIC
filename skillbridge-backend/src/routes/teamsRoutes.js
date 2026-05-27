const express = require('express');
const router = express.Router();

const {
  getTeams,
  getTeamById,
  getTeamsByProject,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateTeamMemberRole,
  removeTeamMember
} = require('../controllers/teamsController');

// GET endpoints
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.get('/project/:projectId', getTeamsByProject);

// POST endpoint (crear equipo)
router.post('/', createTeam);

// POST endpoint (agregar miembro)
router.post('/:id/members', addTeamMember);

// PUT endpoint (actualizar equipo)
router.put('/:id', updateTeam);

// PUT endpoint (actualizar rol de miembro)
router.put('/:id/members/:memberId', updateTeamMemberRole);

// DELETE endpoint (eliminar equipo)
router.delete('/:id', deleteTeam);

// DELETE endpoint (remover miembro)
router.delete('/:id/members/:memberId', removeTeamMember);

module.exports = router;
