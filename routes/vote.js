/**
 * vote routes
 */
const express = require('express');
const router = express.Router();
const Lobby = require('../models/lobby');

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

router.get('/lobby', async (req, res) => {
	const code = (req.query.code || '').trim().toUpperCase();
	if (!code) return res.redirect('/vote/join');

	const lobby = await Lobby.get(code);
	if (!lobby) {
		return res.status(404).render('vote/join', {
			title: 'Join',
			message: 'Lobby code not found. Create one first.'
		});
	}

	if (req.session.user) {
  		const username = req.session.user.username;

		if (!Array.isArray(lobby.users)) lobby.users = [];

  		if (!lobby.users.includes(username)) {
    		lobby.users.push(username);
 		}
	}

    return res.render('vote/lobby', { 
		title: 'Lobby',
		code,
		lobby
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

router.post('/create', async (req, res) => {
  	const code = (req.body.code || '').trim().toUpperCase();

  	if (!/^[A-Z0-9]{3,12}$/.test(code)) {
    	return res.status(400).render('vote/create', {
      	title: 'Create',
      	message: 'Code must be 3–12 characters (letters/numbers only).'
    });
  }

  	if (await Lobby.exists(code)) {
    	return res.status(400).render('vote/create', {
     	title: 'Create',
      	message: 'That lobby code is already taken. Pick another.'
    });
  }

  	await Lobby.create(code, {
    	createdBy: req.session.user?.id || null,
    	enableShows: !!req.body.enableShows,
    	enableMovies: !!req.body.enableMovies,
    	setTimer: !!req.body.setTimer,
    	choicesPerUser: Number(req.body.choicesPerUser || 0)
  });

  return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
  
});


module.exports = router;