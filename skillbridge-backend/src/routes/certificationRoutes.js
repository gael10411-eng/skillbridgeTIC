const express = require('express');
const router = express.Router();

const {
  getCertifications,
  getEarnedCertifications
} = require('../controllers/certificationController');

router.get('/', getCertifications);
router.get('/earned/:userId', getEarnedCertifications);

module.exports = router;
