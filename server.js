const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            imageUrl TEXT,
            stock INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            imageUrl TEXT,
            author TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Admin emails list (កំណត់អ៊ីមែលណាខ្លះជា Admin)
const ADMIN_EMAILS = ["pachkrouch912@gmail.com"];

// API: Get Products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Get News Feed Posts
app.get('/api/posts', (req, res) => {
    db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API: Create Post (Admin Only Check)
app.post('/api/posts', (req, res) => {
    const { title, content, imageUrl, email } = req.body;
    
    if (!ADMIN_EMAILS.includes(email)) {
        return res.status(403).json({ error: "Access Denied: Only Admin can post!" });
    }

    const query = `INSERT INTO posts (title, content, imageUrl, author) VALUES (?, ?, ?, ?)`;
    db.run(query, [title, content, imageUrl, email], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, postId: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
