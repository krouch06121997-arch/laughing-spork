require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// កំណត់ View Engine ជា EJS សម្រាប់ទំព័រ Login/Signup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

// Routes សម្រាប់ហ្វាល EJS
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

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

// API ទាញយកទំនិញ (Products API)
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

// ==========================================
// API សម្រាប់ Add Product ថ្មី (បន្ថែមថ្មីនៅទីនេះ)
// ==========================================
app.post('/api/products', (req, res) => {
    try {
        const { name, price, imageUrl, stock } = req.body;
        
        // ពិនិត្យទិន្នន័យចាំបាច់
        if (!name || price === undefined) {
            return res.status(400).json({ success: false, error: "សូមបញ្ចូលឈ្មោះ និងតម្លៃផលិតផលឱ្យបានត្រឹមត្រូវ!" });
        }

        let products = readDB(PRODUCTS_FILE);

        const newProduct = {
            id: 'prod_' + Date.now(),
            name: name,
            price: Number(price) || 0,
            stock: Number(stock) || 10,
            imageUrl: imageUrl || "https://i.ibb.co/689W87n/placeholder.jpg"
        };

        products.push(newProduct);
        writeDB(PRODUCTS_FILE, products);

        res.json({ success: true, message: "បានបន្ថែមផលិតផលដោយជោគជ័យ!", product: newProduct });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
