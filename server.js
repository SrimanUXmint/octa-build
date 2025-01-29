const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Hardcoded credentials (Use a database in production)
const validUsername = 'admin';
const validPassword = 'uxmint#2025';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve static files (CSS, JS, images)

// Session setup
app.use(
    session({
        secret: 'your_secret_key', // Change this to a strong secret
        resave: false,
        saveUninitialized: true
    })
);

// Serve the login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home'); // Redirect if already logged in
    }
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login form submission
app.post('/home', (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        req.session.user = username; // Save session
        return res.redirect('/home');
    } else {
        res.send(`
            <h1>Invalid Credentials</h1>
            <a href="/login">Try Again</a>
        `);
    }
});

// Serve the home page after login
app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login after logout
    });
});

// Catch-all route to prevent unauthorized access
app.use((req, res) => {
    res.redirect('/login');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

