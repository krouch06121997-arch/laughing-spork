const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. CONFIGURATIONS & MIDDLEWARE ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// កំណត់ទីតាំងថត (Folder) សម្រាប់ဖိုင် Frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// URL របស់ Google Apps Script សម្រាប់ទាញយក និងបញ្ជូនទិន្នន័យ
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxifQAVyX7Zi_ipMf6wKPsJAq0V50O6tgmTfJqTcrySfDisVCOo9ujqP0M6V6TXJy4/exec";

// --- 2. API ROUTES ---

// Route សម្រាប់ពិនិត្យមើលស្ថានភាព Server (Health Check)
app.get('/api/status', (req, res) => {
    res.json({ status: "Server is running smoothly", timestamp: new Date() });
    });

    // API សម្រាប់ទាញយកទំនិញពី Google Sheets (ຜ່ານ Apps Script)
    app.get('/api/products', async (req, res) => {
        try {
                const fetch = (await import('node-fetch')).default;
                        const response = await fetch(`${APPS_SCRIPT_URL}?action=product`);
                                
                                        if (!response.ok) {
                                                    throw new Error(`External API error: ${response.statusText}`);
                                                            }
                                                                    
                                                                            const data = await response.json();
                                                                                    res.json(data);
                                                                                        } catch (err) {
                                                                                                console.error("❌ Error fetching products:", err.message);
                                                                                                        res.status(500).json({ error: "Failed to fetch products from database" });
                                                                                                            }
                                                                                                            });

                                                                                                            // API សម្រាប់បញ្ជូនទិន្នន័យបញ្ជាទិញ (Order) ឬ Review ទៅកាន់ Google Sheets
                                                                                                            app.post('/api/submit', async (req, res) => {
                                                                                                                try {
                                                                                                                        const fetch = (await import('node-fetch')).default;
                                                                                                                                const response = await fetch(APPS_SCRIPT_URL, {
                                                                                                                                            method: 'POST',
                                                                                                                                                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                                                                                                                                                                    body: JSON.stringify(req.body)
                                                                                                                                                                            });

                                                                                                                                                                                    const result = await response.json();
                                                                                                                                                                                            res.json({ success: true, message: "Data submitted successfully", data: result });
                                                                                                                                                                                                } catch (err) {
                                                                                                                                                                                                        console.error("❌ Error submitting data:", err.message);
                                                                                                                                                                                                                res.status(500).json({ error: "Failed to submit data to server" });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    });

                                                                                                                                                                                                                    // Route ចុងក្រោយសម្រាប់គ្រប់គ្រង SPA (កែពី '*' មកជា '/*' ស្របតាម Express v5)
                                                                                                                                                                                                                    app.get('/*', (req, res) => {
                                                                                                                                                                                                                        res.sendFile(path.join(__dirname, 'public', 'index.html'));
                                                                                                                                                                                                                        });

                                                                                                                                                                                                                        // --- 3. START SERVER ---
                                                                                                                                                                                                                        app.listen(PORT, () => {
                                                                                                                                                                                                                            console.log(`🚀 Server is running and listening on http://localhost:${PORT}`);
                                                                                                                                                                                                                            });
                                                                                                                                                                                                                            