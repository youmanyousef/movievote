// This is all the js for the voting search page
let searchTimeout = null;
const MAX_CHOICES = Number(document.querySelector('[data-choices-per-user]')?.dataset.choicesPerUser) || 5;
const searchInput = document.getElementById('movie-search');
const searchResults = document.getElementById('search-results');
const selectedMovies = document.getElementById('selected-movies');
let selected = []; // this will be a [5] of movie array

// searching as user types
searchInput?.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();

    if (!query) {
        searchResults.innerHTML = '';
        return;
    }
    searchTimeout = setTimeout(() => {
        searchMovies(query);
    }, 500); // wait for 500ms after user stops typing
});

// Searching movies via the Backend API
async function searchMovies(query) {
    try {
        const response = await fetch(`/vote/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displaySearchResults(data.results);
    }

    catch (error) {
        console.error('Search Error', error);
        searchResults.innerHTML = '<p class="error">Error fetching search results.</p>';
    }
}

// Displaying search results
function displaySearchResults(movies) {
    if (movies.length === 0) {
        searchResults.innerHTML = '<p>No results found.</p>';
        return;
    }

    searchResults.innerHTML = movies.slice(0, 10).map(movie => `
         <div class="movie-card" onclick="addMovie(${movie.id}, '${escapeHtml(movie.title)}', '${movie.poster_url}')">
              <img src="${movie.poster_url}" alt="${escapeHtml(movie.title)}" loading="lazy">
              <div class="movie-info">
                  <h4>${escapeHtml(movie.title)}</h4>
                  <p>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
              </div>
          </div>
      `).join('');
}

// Adding movie to selected list
function addMovie(id, title, posterUrl) {

    // to not add duplicates for the movie
    if (selected.find(m => m.id === id)) {
        alert('Movie already selected.');
        return;
    }

    // checking if more than 5 movies are selected; to not add more
    if (selected.length >= MAX_CHOICES) {
        alert(`You can only select up to ${MAX_CHOICES} movies.`);
        return;
    }
    
    selected.push({ id, title, posterUrl });
    displaySelectedMovies();
    searchInput.value = '';
    searchResults.innerHTML = '';
}

// Displaying selected movies
function displaySelectedMovies() {
    selectedMovies.innerHTML = selected.map((movie, index) =>
        `
          <div class="selected-movie">
              <img src="${movie.posterUrl}" alt="${escapeHtml(movie.title)}">
              <p>${escapeHtml(movie.title)}</p>
              <button onclick="removeMovie(${index})" class="btn-remove">✕</button>
          </div>
      `).join('');

      // Update counter
      const counter = document.getElementById('count');
      if (counter) {
          counter.textContent = selected.length;
      }

      // Update selection message
      const message = document.getElementById('selection-message');
      const remaining = MAX_CHOICES - selected.length;
      if (message) {
          if (remaining === 0) {
              message.textContent = 'Ready to start voting!';
              message.style.color = '#4ade80';
          } else if (remaining === 1) {
              message.textContent = 'Select 1 more movie';
              message.style.color = '#fbbf24';
          } else {
              message.textContent = `Select ${remaining} more movies`;
              message.style.color = '#a0a0a0';
          }
      }

      // Enable/disable button
      const startBtn = document.getElementById('start-voting-btn');
	  const userChoices = document.getElementById('userChoices');
      if (startBtn) {
		  if (userChoices) {
            userChoices.value = selected.map(m => m.id).join('|');
          }
          startBtn.disabled = selected.length !== MAX_CHOICES;

		
      }
}

// Removing movie from selected list
function removeMovie(index) {
    selected.splice(index, 1);
    displaySelectedMovies();
}

// Excape HTML 
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function submitVote() {
    if (selected.length !== MAX_CHOICES) {
        alert(`Please select exactly ${MAX_CHOICES} movies before starting the vote.`);
        return;
    }
    const code = new URLSearchParams(window.location.search).get('code');

    try {
          const response = await fetch('/vote/api/add-movies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code, movies: selected })
          });

          if (response.ok) {
              window.location.href = `/vote/voting?code=${code}`;
          } else {
              alert('Failed to start voting');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Failed to start voting');
      }
}