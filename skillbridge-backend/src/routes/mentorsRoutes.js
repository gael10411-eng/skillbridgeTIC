const express = require('express');
const router = express.Router();

const {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor
} = require('../controllers/mentorsController');

// GET endpoints
router.get('/', getMentors);
router.get('/:id', getMentorById);

// POST endpoint
router.post('/', createMentor);

// PUT endpoint
router.put('/:id', updateMentor);

// DELETE endpoint
router.delete('/:id', deleteMentor);

module.exports = router;
