const express = require('express');
const router = express.Router();

const {
  getMentors,
  getMentorships,
  createMentorship
} = require('../controllers/mentorshipController');

router.get('/mentors', getMentors);
router.get('/mentorships', getMentorships);
router.post('/mentorships', createMentorship);

module.exports = router;
