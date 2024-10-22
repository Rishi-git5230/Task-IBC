// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username', // replace with your MySQL username
  password: 'your_password', // replace with your MySQL password
  database: 'user_management',
});

// Connect to the database
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// REST API Endpoints

// Get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users WHERE is_deleted = FALSE', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get deleted users
app.get('/api/deleted-users', (req, res) => {
  db.query('SELECT * FROM users WHERE is_deleted = TRUE', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ id: results.insertId, name, email });
  });
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ id, name, email });
  });
});

// Delete a user (soft delete)
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE users SET is_deleted = TRUE WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User deleted' });
  });
});

// Enable a deleted user
app.patch('/api/users/enable/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE users SET is_deleted = FALSE WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User enabled' });
  });
});

// Bulk delete
app.delete('/api/users/bulk-delete', (req, res) => {
  const { ids } = req.body; // Expecting an array of ids
  db.query('UPDATE users SET is_deleted = TRUE WHERE id IN (?)', [ids], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Users deleted' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
