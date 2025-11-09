const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL
)`);

// Handle form submission
app.post('/login', (req, res) => {
  const { name, email } = req.body;
  if (name && email.endsWith('@gmail.com')) {
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], (err) => {
      if (err) return res.send('Database error');
      res.redirect('/hello.html');
    });
  } else {
    res.send('Invalid input. Please enter a valid name and Gmail.');
  }
});

// View stored users
app.get('/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.send('Error fetching users');
    res.json(rows);
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
