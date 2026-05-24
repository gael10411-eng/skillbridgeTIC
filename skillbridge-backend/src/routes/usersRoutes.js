const express = require('express');
const router = express.Router();
const { usersList, createUser } = require('../controllers/usersController');

router.get('/', usersList);
router.post('/', createUser);

module.exports = router;