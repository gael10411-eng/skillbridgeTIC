const express = require('express');
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  uploadProjectFile
} = require('../controllers/projectController');

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.post('/:id/files', uploadProjectFile);

module.exports = router;
