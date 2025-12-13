// this is the javascript for the voting page
// {movieId: rating}
const userVotes = {};

// Initializing the voitng page
document.addEventListener('DOMContentLoaded', function() {
    renderMovie();
    updateProgress();
});

//===============================
// RENDER MOVIES ON GRID
//===============================
function renderMovie() {
    const grid = document.getElementById('voting-grid');
    const totalCount = document.getElementById('total-count');

    //===============================
    // FETCH FORM SERVER
    //===============================
    totalCount.textContent = dummyLobby.movies.length;

    grid.innerHTML = dummyLobby.movies.map(movie => `
        <div class="voting-movie-card" id="movie-${movie.id}">
              <img src="${movie.posterUrl}" alt="${escapeHtml(movie.title)}" loading="lazy">
              <div class="movie-voting-info">
                  <h4 class="movie-title">${escapeHtml(movie.title)}</h4>
                  <p class="added-by">Added by ${getUsernameById(movie.addedBy)}</p>
                  <div class="rating-controls">
                      <button class="btn-minus" onclick="changeRating(${movie.id}, -1)">−</button>
                      <span class="rating-display" id="rating-${movie.id}">-</span>
                      <button class="btn-plus" onclick="changeRating(${movie.id}, 1)">+</button>
                  </div>
              </div>
          </div>
      `).join('');
}

//===============================
// CHANAGE RATING
//===============================
function changeRating(movieId, number) {
    const currentRating = userVotes[movieId] || 0;
    let newRating = currentRating + number;

    // keep rating between 1 and 5; no out of bounds
    if (newRating < 1) newRating = 1;
    if (newRating > 5) newRating = 5;

    // if no rating yet, then make it 1 on first plus or minus
    if (currentRating === 0) {
        newRating = number > 0 ? 1 : 1;
    }

    userVotes[movieId] = newRating;
    updateRatingDisplay(movieId);
    updateProgress();
}

//===============================
// CHANAGE RATING
//===============================
function updateRatingDisplay(movieId) {
    const ratingDisplay = document.getElementById(`rating-${movieId}`);
    const rating = userVotes[movieId];
    if(rating){
        ratingDisplay.textContent = rating;
        ratingDisplay.style.color = '#4ade80'; // green color for rated
    } else{
        ratingDisplay.textContent = '-';
        ratingDisplay.style.color = '#6b7280'; // gray color for no rating
    }
}

//===============================
// Progress for voting
//===============================
function updateProgress() {
    const totalMovies = dummyLobby.movies.length;
    const ratedCount = Object.keys(userVotes).length;
    const percentDone = (ratedCount / totalMovies) * 100;

    document.getElementById('rated-count').textContent = ratedCount;
    document.getElementById('progress-fill').style.width = `${percentDone}%`;

    // Enabler for sumbit button
    const submitBtn = document.getElementById('submit-votes-btn');
    submitBtn.disabled = ratedCount !== totalMovies;

    //update of text color to infrom user of completion \
    const progressText = document.getElementById('progress-text');
    if (ratedCount === totalMovies){
        progressText.style.color = '#4ade80'; // green
    } else{
        progressText.style.color = '#a0a0a0'; // gray
    }
}

//===============================
// submit for voting
//===============================

async function submitVotes() {
    const totalMovies = dummyLobby.movies.length;
    const ratedCount = Object.keys(userVotes).length;

    // verify all movies are rated
    if (ratedCount !== totalMovies) {
        alert(`Please rate all ${totalMovies} movies before submitting your votes.`);
        return;
    }

    console.log('Charlie\'s votes:', userVotes);

    // TODO: Send votes to backend
      // const code = new URLSearchParams(window.location.search).get('code');
      // const response = await fetch('/vote/api/submit-votes', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ code, votes: userVotes })
      // });

    // Redirect to results page
    window.location.href = '/vote/result';
}

//===============================
// Other Functions
//===============================

function getUsernameById(userId) {
      const user = dummyLobby.users.find(u => u.id === userId);
      return user ? user.username : 'Unknown';
}

function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
}
