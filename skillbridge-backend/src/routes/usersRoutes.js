const express = require('express');
const router = express.Router();
const {
  usersList,
  getUserProfile,
  updateUserProfile,
  createUser
} = require('../controllers/usersController');

router.get('/', usersList);
router.get('/:id/profile', getUserProfile);
router.patch('/:id', updateUserProfile);
router.post('/', createUser);

module.exports = router;
