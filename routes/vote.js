/**
 * vote routes
 */
const express = require('express');
const router = express.Router();
const Lobby = require('../models/lobby');
const tmbd = require('../services/tmbd');

/// ---- This Route is for the TMBD API ---- ///
router.get('/api/search', async (req, res) => {
	const query = (req.query.q || '').trim();

	// if no results is found, return empty array
	if (!query.trim()){
		return res.json({ results: [], total_results: 0 });
	}
	
	try {
		const data = await tmbd.searchMovies(query);

		// Formating response array
		const results = data.results.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              poster_url: tmdb.getPosterUrl(movie.poster_path),
              release_date: movie.release_date,
              overview: movie.overview
          }));

		return res.json({ results, total_results: data.total_results } );
	}

	// does for any errors
	catch (error) {
          console.error('Search error:', error);
          res.status(500).json({ error: 'Search failed' });
      }
  });
	
/// --------------------------------------- ///



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

	if (!req.session.user) return res.redirect('/auth/login');

		const userId = req.session.user.id;
  		const username = req.session.user.username;

		if (!Array.isArray(lobby.users)) lobby.users = [];

  		if (!lobby.users.some(u => u.id === userId)) {
  			lobby.users.push({ id: userId, username, ready: false });
		}

		const isHost = lobby.createdBy === userId;
		const everyoneReady = lobby.users.length > 0 && lobby.users.every(u => u.ready);

    return res.render('vote/lobby', { 
		title: 'Lobby',
		code,
		lobby,
		isHost,
		everyoneReady,
		currentUserId: userId
	
	});
});

router.get('/lobby/status', async (req, res) => {
  	const code = (req.query.code || '').trim().toUpperCase();
  	const lobby = await Lobby.get(code);

  	if (!lobby) return res.status(404).json({ ok: false });

  	const everyoneReady =
    	(lobby.users || []).length > 0 &&
    	lobby.users.every(u => u.ready);

  	return res.json({ ok: true, everyoneReady });
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

router.get('/choices', async (req, res) => {
	const code = (req.query.code || '').trim().toUpperCase();
  	const lobby = await Lobby.get(code);

	if (!lobby) return res.redirect('/vote/join');

	const everyoneReady = (lobby.users || []).length > 0 && lobby.users.every(u => u.ready);

	if (!everyoneReady) {
		return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
	}

	res.render('vote/choices', { 
		title: 'Choose',
		code,
		lobby
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

router.post('/lobby/ready', async (req, res) => {
	const code = (req.body.code || '').trim().toUpperCase();
  	if (!code) return res.redirect('/vote/join');

	const lobby = await Lobby.get(code);
	if (!lobby || !req.session.user) return res.redirect('/vote/join');

	const userId = req.session.user.id;

	const me = (lobby.users || []).find(u => u.id === userId);
	if (me) me.ready = !me.ready;

	return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
});

router.post('/lobby/start', async (req, res) => {
  	const code = (req.body.code || '').trim().toUpperCase();
  	if (!code) return res.redirect('/vote/join');

  	const lobby = await Lobby.get(code);
  	if (!lobby || !req.session.user) return res.redirect('/vote/join');

  	const userId = req.session.user.id;
  	const isHost = lobby.createdBy === userId;
  	const everyoneReady = (lobby.users || []).length > 0 && lobby.users.every(u => u.ready);

  	if (!isHost || !everyoneReady) {
    	return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
  	}

  	return res.redirect(`/vote/choices?code=${encodeURIComponent(code)}`);
});


module.exports = router;