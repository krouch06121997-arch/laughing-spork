require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// --- [ផ្នែកបន្ថែមថ្មី] កំណត់ View Engine ជា EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // ជំនួយការអានទិន្នន័យពី Form
app.use(express.static(path.join(__dirname, 'public')));

function readDB(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    try { return JSON.parse(data); } catch (e) { return []; }
}

function writeDB(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- [ផ្នែកបន្ថែមថ្មី] Route សម្រាប់ទំព័រ Login និង Signup ---
app.get('/login', (req, res) => {
    res.render('login'); // វានឹងទៅអានហ្វាល views/login.ejs
});

app.get('/signup', (req, res) => {
    res.render('signup'); // វានឹងទៅអានហ្វាល views/signup.ejs
});

// ==========================================
// API ចាស់ៗរបស់អ្នករក្សាទុកនៅដដែល
// ==========================================

// API ផ្ដល់ Firebase Config ឱ្យ Frontend ដោយសុវត្ថិភាព
app.get('/api/config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    });
});

// API ទាញយកទំនិញ
app.get('/api/products', (req, res) => {
    let products = readDB(PRODUCTS_FILE);
    if (products.length === 0) {
        products = [
            { id: "1", name: "Panel PU ថ្មធម្មជាតិបែបបុរាណ", price: 12, stock: 10, imageUrl: "https://i.ibb.co/689W87n/placeholder.jpg" },
            { id: "2", name: "ទឹកថ្នាំការពារសំណើមថ្ម", price: 90, stock: 5, imageUrl: "https://i.ibb.co/689W87n/placeholder.jpg" },
            { id: "3", name: "ប្លុក SKD ថ្មស៊េរីថ្មី", price: 10, stock: 20, imageUrl: "https://i.ibb.co/689W87n/placeholder.jpg" }
        ];
        writeDB(PRODUCTS_FILE, products);
    }
    res.json(products);
});

// API ទាញយក Posts
app.get('/api/posts', (req, res) => {
    const posts = readDB(DB_FILE);
    posts.sort((a, b) => b.id - a.id);
    res.json(posts);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
