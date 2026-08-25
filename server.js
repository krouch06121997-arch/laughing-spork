const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// មុខងារអាន Database ពី JSON file
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// មុខងារសរសេរ Database ចូល JSON file
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// កំណត់ Email របស់អ្នកជា Admin
const ADMIN_EMAILS = ["your-email@gmail.com"]; // <-- សូមប្តូរជា Email របស់អ្នក

// យក Posts ទាំងអស់មកបង្ហាញ
app.get('/api/posts', (req, res) => {
    const posts = readDB();
    posts.sort((a, b) => b.id - a.id);
    res.json(posts);
});

// បង្ហោះ Post ថ្មី (សម្រាប់តែ Admin)
app.post('/api/posts', (req, res) => {
    const { title, content, imageUrl, email } = req.body;
    
    if (!ADMIN_EMAILS.includes(email)) {
        return res.status(403).json({ error: "Access Denied: Only Admin can post!" });
    }

    const posts = readDB();
    const newPost = {
        id: Date.now(),
        title,
        content,
        imageUrl: imageUrl || "",
        author: email,
        created_at: new Date().toLocaleString()
    };

    posts.push(newPost);
    writeDB(posts);

    res.json({ success: true, postId: newPost.id });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running and listening on http://localhost:${PORT}`);
});
