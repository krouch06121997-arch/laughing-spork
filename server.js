const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// URL របស់ Google Apps Script ដែលអ្នកបានប្រើប្រាស់ស្រាប់
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxifQAVyX7Zi_ipMf6wKPsJAq0V50O6tgmTfJqTcrySfDisVCOo9ujqP0M6V6TXJy4/exec";

// API សម្រាប់ទាញយកទំនិញពី Google Sheets (Proxy ដើម្បីជៀសវាង CORS issues ប្រសិនបើចាំបាច់)
app.get('/api/products', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await `${APPS_SCRIPT_URL}?action=product`;
        const data = await (await fetch(response)).json();
        res.json(data);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// API សម្រាប់បញ្ជូន Order ឬ Review ទៅកាន់ Google Apps Script
app.post('/api/submit', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(req.body)
        });
        res.json({ success: true, message: "Submitted successfully" });
    } catch (err) {
        console.error("Error submitting to apps script:", err);
        res.status(500).json({ error: "Failed to submit data" });
    }
});

// ដំណើរការ Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

