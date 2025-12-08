const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Setting up all the ejs files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// All the routes for the EJS files
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/join', (req, res) => {
    res.render('join');
});

app.get('/lobby', (req, res) => {
    res.render('lobby');
});

app.get('/vote', (req, res) => {
    res.render('vote');
});

app.get('/results', (req, res) => {
    res.render('results');
});

app.get('/choices', (req, res) => {
    res.render('choices');
});

app.get('/wait', (req, res) => {
    res.render('wait');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


