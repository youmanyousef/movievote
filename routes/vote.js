/**
 * vote routes
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	console.log('hi');
    res.render('vote/home', { 
		title: 'Home',
		message: 'Welcome to the Authentication Template'
	});
});

router.get('/create', (req, res) => {
    res.render('vote/create', { 
		title: 'Create',
		message: 'Welcome to the Authentication Template'
	});
});

router.get('/join', (req, res) => {
    res.render('vote/join', { 
		title: 'Join',
		message: 'Welcome to the Authentication Template'
	});
});

router.get('/lobby', (req, res) => {
    res.render('vote/lobby', { 
		title: 'Lobby',
		message: 'Welcome to the Authentication Template'
	});
});

router.get('/vote', (req, res) => {
    res.render('vote/vote', { 
		title: 'Vote',
		message: 'Welcome to the Authentication Template'
	});
});

router.get('/result', (req, res) => {
    res.render('vote/result', { 
		title: 'Results',
		message: 'Welcome to the Authentication Template'
	});	
});

router.get('/choices', (req, res) => {
	res.render('vote/choices', { 
		title: 'Choose',
		message: 'Welcome to the Authentication Template'
	});
});

router.get('/wait', (req, res) => {
	res.render('vote/wait', { 
		title: 'Waiting...',
		message: 'Welcome to the Authentication Template'
	});
}); 

module.exports = router;