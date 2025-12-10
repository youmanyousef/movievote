/**
 * vote routes
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	console.log('hi');
    res.render('vote/home');
});

router.get('/create', (req, res) => {
    res.render('vote/create');
});

router.get('/join', (req, res) => {
    res.render('vote/join');
});

router.get('/lobby', (req, res) => {
    res.render('vote/lobby');
});

router.get('/vote', (req, res) => {
    res.render('vote/vote');
});

router.get('/results', (req, res) => {
    res.render('vote/results');
});

router.get('/choices', (req, res) => {
    res.render('vote/choices');
});

router.get('/wait', (req, res) => {
    res.render('vote/wait');
}); 

module.exports = router;