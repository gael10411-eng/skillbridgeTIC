const express = require('express');
const router = express.Router();

const {
    register,
    login,
    testDB
} = require('../controllers/authController');

router.post('/api/register', register);
router.post('/api/login', login);
router.get('/api/test-db', testDB);

module.exports = router;