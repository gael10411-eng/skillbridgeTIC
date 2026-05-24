const usersModel = require('../models/usersModel');

async function usersList(req, res) {
  try {
    const users = await usersModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const { nombre, email, password_hash, rol } = req.body;
    const id = await usersModel.createUser(nombre, email, password_hash, rol);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { usersList, createUser };