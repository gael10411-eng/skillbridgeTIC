const express = require('express');
const router = express.Router();

const {
  getMentorships,
  getMentorshipsByStudent,
  getMentorshipsByMentor,
  getMentorshipById,
  createMentorship,
  updateMentorship,
  deleteMentorship
} = require('../controllers/mentorshipsController');

// GET endpoints
router.get('/', getMentorships);
router.get('/:id', getMentorshipById);
router.get('/student/:studentId', getMentorshipsByStudent);
router.get('/mentor/:mentorId', getMentorshipsByMentor);

// POST endpoint
router.post('/', createMentorship);

// PUT endpoint
router.put('/:id', updateMentorship);

// DELETE endpoint
router.delete('/:id', deleteMentorship);

module.exports = router;
