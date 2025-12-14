/**
 * vote routes
 */
const express = require('express');
const router = express.Router();
const Lobby = require('../models/lobby');
const tmdb = require('../scripts/tmdb');

/// ---- This Route is for the TMBD API ---- ///
router.get('/api/search', async (req, res) => {
	const query = (req.query.q || '').trim();

	// if no results is found, return empty array
	if (!query.trim()){
		return res.json({ results: [], total_results: 0 });
	}
	
	try {
		const data = await tmdb.searchMovies(query);

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

router.get('/api/results', async (req, res) => {
	const code = (req.query.code || '').trim().toUpperCase();
	if (!code){
		return res.status(400).json({ ok: false, error: 'Missing code' });
	}

	const lobby = await Lobby.get(code);
	if (!lobby || !Array.isArray(lobby.users)) {
		return res.status(404).json({ ok: false, error: 'Lobby not found' });
	}

	try{
		const movieIdSet = new Set();
		for (const u of lobby.users) {
			for (const id of (Array.isArray(u.choices) ? u.choices : [])) {
				const s = String(id).trim();
				if (s) movieIdSet.add(s);
			}
		}
	
		const movieIds = Array.from(movieIdSet);
		if (movieIds.length === 0) {
			return res.json({
				ok: true,
				resultsObject: {
					stats: { isTie: false, totalMovies: 0, totalVoters: lobby.users.length, highestScore: 0, averageScore: 0 },
					winners: [],
					results: []
				}
			});
		}

		const detailsById = new Map();
		for (const idStr of movieIds) {
			const idNum = Number(idStr);
			if (!Number.isFinite(idNum)) continue;

			const details = await tmdb.getMovieDetails(idNum);
			detailsById.set(idStr, {
				id: idNum,
				title: details?.title || details?.name || 'Unknown',
				posterUrl: tmdb.getPosterUrl(details?.poster_path),
			});
		}
		let totalRatingsCount = 0;
		let totalRatingsSum = 0;

		const results = movieIds.map((idStr) => {
			const meta = detailsById.get(idStr) || {
			id: Number(idStr),
			title: 'Unknown',
			posterUrl: '/images/placeholder.jpg'
		};

		const votes = {};
		let sum = 0;
		let count = 0;

		for (const u of lobby.users) {
			const v = u?.votes?.[idStr];
			const rating = Number(v);
			if (Number.isFinite(rating)) {
				votes[u.username || `user_${u.id}`] = rating;
				sum += rating;
				count += 1;
			}
		}

		totalRatingsSum += sum;
		totalRatingsCount += count;

		return {
			id: meta.id,
			title: meta.title,
			posterUrl: meta.posterUrl,
			totalScore: sum,
			avgRating: count ? (sum / count) : 0,
			votes
		};
	});

		const highestScore = results.reduce((mx, m) => Math.max(mx, m.totalScore), 0);
		const winners = results.filter(m => m.totalScore === highestScore);
		const averageScore = totalRatingsCount ? (totalRatingsSum / totalRatingsCount) : 0;
		const resultsObject = {
			stats: {
				isTie: winners.length > 1,
				totalMovies: results.length,
				totalVoters: lobby.users.length,
				highestScore,
				averageScore
			},
			winners,
			results
		}
		return res.json({ ok: true, resultsObject });
	}catch(error){
		console.error(error);
		return res.status(500).json({ ok:false, error:'Results failed' });
	}
});

router.get('/api/choices', async (req, res) => {
	const code = (req.query.code || '').trim().toUpperCase();
	if (!code) return res.status(400).json({ error: 'Missing code' });

	const lobby = await Lobby.get(code);
	if (!lobby) return res.status(404).json({ error: 'Lobby not found' });

	if (!Array.isArray(lobby.users)) lobby.users = [];

	try{
		const movies = [];

		for (const user of lobby.users){
			const choices = Array.isArray(user.choices) ? user.choices : [];

			for (const rawId of choices) {
				const id = Number(rawId);
				if (!Number.isFinite(id)) continue;
				const details = await tmdb.getMovieDetails(id);

				movies.push({
					id,
					title: details?.title || details?.name || 'Unknown',
					posterUrl: tmdb.getPosterUrl(details?.poster_path),
					addedBy: user.username
				})
			}
		}
		return res.json({ ok: true, code, movies });
	}
	catch (error) {
			console.error('Api/choices error:', error);
			res.status(500).json({ error: 'Choices failed' });
		}
  });
	
/// --------------------------------------- ///



router.get('/', (req, res) => {
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
	let allUserIds = [];
	for (user in lobby.users) {
		allUserIds.push(user.id);
	}
	if (lobby.lobbyStatus != "start" && !allUserIds.includes(userId)) {
		return res.status(404).render('vote/join', {
			title: 'Join',
			message: 'Lobby started voting... please wait for them to finish or join another session.'
		});
	}
	

	if (!Array.isArray(lobby.users)) lobby.users = [];

	if (!lobby.users.some(u => u.id === userId)) {
		lobby.users.push({ id: userId, username, ready: false, choices: []});
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
	const code = (req.query.code || '').trim().toUpperCase();

    res.render('vote/vote', { 
		title: 'Vote',
		code,
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
	console.log("ping");
  	if (!code) return res.redirect('/vote/join');

  	const lobby = await Lobby.get(code);
  	if (!lobby || !req.session.user) return res.redirect('/vote/join');
	
	res.render('vote/choices', {
		title: 'Choose',
		code,
		choicesPerUser: lobby.choicesPerUser
	});
});

/* router.post('/wait', async (req, res) => {
	const code = (req.body.code || '').trim().toUpperCase();
  	const lobby = await Lobby.get(code);
	res.render('vote/wait', { 
		title: 'Waiting...',
		code: code,
		act: "
		message: 'Welcome to the Authentication Template'
	});
});  */

router.get('/wait/results', (req, res) => {
	const code = (req.query.code || '').trim().toUpperCase();

	return res.render('vote/wait', {
		title: 'Waiting...',
		code,
		pollUrl: '/vote/wait/votes',
		nextUrl: '/vote/result'
	});
});

router.get('/wait/rank', (req, res) => {
	const code = (req.query.code || '').trim().toUpperCase();

	res.render('vote/wait', { 
		title: 'Waiting...',
		code,
		pollUrl: '/vote/wait/choices',
		nextUrl: '/vote/vote'
	});
}); 

router.post('/api/submit-votes', async (req, res) => {
	const code = ((req.body.code || '').toString() || '').trim().toUpperCase();
	if (!code){
		return res.status(400).json({ok:false, error: 'Missing code' });
	}

	if (!req.session?.user){
		return res.status(401).json({ok:false, error: 'Not logged in' });
	}
	const lobby = await Lobby.get(code);
	if (!lobby || !Array.isArray(lobby.users)) {
		return res.status(404).json({ok:false, error:'Lobby not Found' });
	}

	const me = lobby.users.find(u => u.id === req.session.user.id);
	if (!me){
		return res.status(403).json({ ok:false, error: 'Not in lobby' });
	}

	const votes = req.body.votes;
	if (!votes || typeof votes !== 'object'){
		return res.status(400).json({ok:false, error: 'Missing votes' });
	}

	  
	me.votes = votes;
	return res.json({ ok: true })

});

router.post('/wait/choices', async (req, res) => {
	console.log("ping choices");
	const code = ((req.body.code || '').toString() || '').trim().toUpperCase();
  	const lobby = await Lobby.get(code);
	if (!lobby || !Array.isArray(lobby.users)) {
		return res.status(404).json({ message: false });
	}
	console.log(code);
	console.log(lobby);
	const userCount = lobby.users.length;
	let usersReady = 0;
	for (const user of lobby.users) {
		console.log(user);
		
		if (Array.isArray(user.choices) && user.choices.length === lobby.choicesPerUser) { //hard coded!!
			usersReady += 1;
		}
	}
	
	res.status(200).json({
		message: userCount === usersReady
	});
}); 

router.post('/wait', async (req, res) => {
	const code = (req.body.code || '').trim().toUpperCase();
	console.log("ping")
  	if (!code) return res.redirect('/vote/join');

  	const lobby = await Lobby.get(code);
  	if (!lobby || !req.session.user) return res.redirect('/vote/join');
	
	const act = req.body.act;
	
	const userChoices = req.body.userChoices;
	const userChoicesArr = userChoices.split('|');
	const userId = req.session.user.id;
	const userData = lobby.users.find(u => u.id === userId);
	userData.choices = userChoicesArr;
	console.log(lobby);
	console.log("**")
	console.log(lobby.users.find(u => u.id === userId));
	
	return res.redirect(`/vote/wait/rank?code=${encodeURIComponent(code)}`);
}); 

router.post('/wait/votes', async (req, res) => {
	const code = ((req.body.code || '').toString() || '').trim().toUpperCase();
	const lobby = await Lobby.get(code);

	if (!lobby || !Array.isArray(lobby.users)) {
		return res.status(404).json({ message: false });
	}

	const movieIds = new Set();
	for (const u of lobby.users) {
		for (const id of (Array.isArray(u.choices) ? u.choices : [])) {
			movieIds.add(String(id));
		}
	}
	const needed = movieIds.size;
	const allVoted = lobby.users.length > 0 && lobby.users.every(u => u.votes && Object.keys(u.votes).length === needed);

	return res.json({ message: allVoted });
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
		lobbyStatus: "start",
    	choicesPerUser: Math.max(1, Number(req.body.choicesPerUser) || 5)
  });

  return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
  
});

router.post('/lobby/ready', async (req, res) => {
	
	const code = (req.body.code || '').trim().toUpperCase();
  	if (!code) return res.redirect('/vote/join');
		
	const lobby = await Lobby.get(code);
	console.log(lobby);
	if (!lobby || !req.session.user) return res.redirect('/vote/join');

	const userId = req.session.user.id;

	const me = (lobby.users || []).find(u => u.id === userId);
	if (me) me.ready = !me.ready;

	return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
});

router.post('/lobby/start', async (req, res) => {
	console.log('start')
  	const code = (req.body.code || '').trim().toUpperCase();
  	if (!code) return res.redirect('/vote/join');

  	const lobby = await Lobby.get(code);
  	if (!lobby || !req.session.user) return res.redirect('/vote/join');

  	const userId = req.session.user.id;
  	const isHost = lobby.createdBy === userId;
  	const everyoneReady = (lobby.users || []).length > 0 && lobby.users.every(u => u.ready);

  	/*if (!isHost || !everyoneReady) {
		console.log("--ping");
    	return res.redirect(`/vote/lobby?code=${encodeURIComponent(code)}`);
  	}*/
	// lobby.lobbyStatus = "choosing"; come back to this when i can fix this :(
	console.log(lobby); 
  	res.render('vote/choices', {
		title: 'Choose',
		code: code,
		choicesPerUser: lobby.choicesPerUser
	});
});

router.post('/lobby/leave', async (req, res) => {
	const code = (req.body.code || '').trim().toUpperCase();
  	if (!code) {
		return res.redirect('/vote/join');
	}
	
  	const lobby = await Lobby.get(code);
  	if (!lobby || !req.session.user) return res.redirect('/vote/join');

  	const userId = req.session.user.id;
	const isHost = lobby.createdBy === userId;
	
	// add in edge case for host // const isHost = lobby.createdBy === userId;
	if (isHost) {
		await Lobby.destroy(code);
	} else {
		await Lobby.userLeave(code, userId);
	}
	return res.redirect('/vote');
});

module.exports = router;