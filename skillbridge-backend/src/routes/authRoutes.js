const express = require('express');
const router = express.Router();

const {
    register,
    login,
    testDB
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/test-db', testDB);

module.exports = router;