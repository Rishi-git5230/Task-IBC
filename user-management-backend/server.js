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
  user: 'root', // replace with your MySQL username
  password: 'MYSQL', // replace with your MySQL password
  database: 'user_data',
});

// Connect to the database
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// REST API Endpoints

// Get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users WHERE user_status != "Deleted"', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/api/users', (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM users WHERE user_status != "Deleted"';
  const params = [];

  if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR id = ?)';
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, search);
  }

  db.query(query, params, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
  });
});

// Get deleted users
app.get('/api/deleted-users', (req, res) => {
  db.query('SELECT * FROM users WHERE user_status = "Deleted"', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { first_name, last_name, dob, gender, email, full_address, mobile } = req.body;
  db.query(
    'INSERT INTO users (first_name, last_name, dob, gender, email, full_address, mobile, user_status) VALUES (?, ?, ?, ?, ?, ?, ?, "Active")',
    [first_name, last_name, dob, gender, email, full_address, mobile],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ id: results.insertId, first_name, last_name, dob, gender, email, full_address, mobile, user_status: "Active" });
    }
  );
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, dob, gender, email, full_address, mobile, user_status } = req.body;
  db.query(
    'UPDATE users SET first_name = ?, last_name = ?, dob = ?, gender = ?, email = ?, full_address = ?, mobile = ?, user_status = ? WHERE id = ?',
    [first_name, last_name, dob, gender, email, full_address, mobile, user_status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ id, first_name, last_name, dob, gender, email, full_address, mobile, user_status });
    }
  );
});

// Delete a user (soft delete)
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE users SET user_status = "Deleted" WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User deleted' });
  });
});

// Enable a deleted user
app.patch('/api/users/enable/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE users SET user_status = "Active" WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User enabled' });
  });
});

// Bulk delete
app.delete('/api/users/bulk-delete', (req, res) => {
  const { ids } = req.body; // Expecting an array of ids
  db.query('UPDATE users SET user_status = "Deleted" WHERE id IN (?)', [ids], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Users deleted' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
