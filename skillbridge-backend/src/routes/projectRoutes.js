const express = require('express');
const router = express.Router();

const {
  getProjects,
  getProjectById,
  getProjectsByOwner,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// GET endpoints
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.get('/owner/:ownerId', getProjectsByOwner);

// POST endpoint
router.post('/', createProject);

// PUT endpoint
router.put('/:id', updateProject);

// DELETE endpoint
router.delete('/:id', deleteProject);

module.exports = router;