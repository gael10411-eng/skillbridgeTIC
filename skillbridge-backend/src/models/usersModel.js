const db = require('../config/db');

async function getAllUsers() {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
}

async function createUser(nombre, email, password_hash, rol='estudiante') {
  const [result] = await db.query(
    'INSERT INTO users (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password_hash, rol]
  );
  return result.insertId;
}

module.exports = { getAllUsers, createUser };