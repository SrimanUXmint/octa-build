const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');

const app = express();

// ✅ Middleware
app.use(compression()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.urlencoded({ extended: true })); 

// ✅ Memory-based session storage (Sessions will reset when the server restarts)
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1-day session
}));

// ✅ Routes
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/home');
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/home', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'uxmint#2025') {
        req.session.user = username;
        return res.redirect('/home');
    }
    res.send(`<h1> Invalid Credentials</h1><a href="/login">Try Again</a>`);
});

app.get('/home', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

app.use((req, res) => res.redirect('/login'));

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
