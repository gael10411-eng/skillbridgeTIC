const express = require('express');
const router = express.Router();

const {
  getCertifications,
  getCertificationById,
  getUserEarnedCertifications,
  createEarnedCertification,
  deleteEarnedCertification
} = require('../controllers/certificationsController');

// GET endpoints
router.get('/', getCertifications);
router.get('/:id', getCertificationById);
router.get('/user/:userId', getUserEarnedCertifications);

// POST endpoint (crear certificación obtenida)
router.post('/earned', createEarnedCertification);

// DELETE endpoint
router.delete('/earned/:id', deleteEarnedCertification);

module.exports = router;
