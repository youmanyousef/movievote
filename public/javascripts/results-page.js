// ═══════════════════════════════════════════════════════════════
// RESULTS PAGE - DISPLAY WINNER AND ALL RESULTS
// ═══════════════════════════════════════════════════════════════

// Initialize everything on page
document.addEventListener('DOMContentLoaded', async function() {
    const resultsList = document.getElementById('results-list');
    const params = new URLSearchParams(window.location.search);
    const code = (params.get('code') || '').trim().toUpperCase();

    if (!code) {
        resultsList.textContent = 'Missing lobby code.';
        return;
    }

    let data;
    try{
        const res = await fetch(`/vote/api/results?code=${encodeURIComponent(code)}`);
        data = await res.json();
    }catch(error){
        console.error(error);
        resultsList.textContent = 'Failed to load picks.';
        return;
    }
    
    if (!data?.ok || !data?.resultsObject) {
        resultsList.textContent = data?.error || 'No results found.';
        return;
    }

    window.dummyResults = data.resultsObject;
    renderTheWinners();
    renderStats();
    renderAllResults();

});

//===============================
// RENDER THE WINNER MOVIE
//===============================
function renderTheWinners() {
    const winnerSection = document.getElementById('winner-section');

    const isTie = dummyResults.stats.isTie;
    const winners = dummyResults.winners;

    // This is if its a tie or single winner in the vote
    if (isTie) {
        // Multiple winners (TIE)
        winnerSection.innerHTML = `
            <div class="winner-banner tie">
                <h2 class="winner-title">🏆 IT'S A TIE! 🏆</h2>
                <p class="winner-subtitle">${winners.length} movies tied with ${winners[0].totalScore} points</p>
                <div class="winner-movies">
                    ${winners.map(movie => `
                        <div class="winner-movie">
                            <img src="${movie.posterUrl || '/images/placeholder.jpg'}" alt="${escapeHtml(movie.title)}">
                            <h3>${escapeHtml(movie.title)}</h3>
                            <p class="winner-score">${movie.totalScore} points</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        // Single winner
        const winner = winners[0];
        winnerSection.innerHTML = `
            <div class="winner-banner">
                <h2 class="winner-title">🏆 WINNER 🏆</h2>
                <div class="winner-movie single">
                    <img src="${winner.posterUrl || '/images/placeholder.jpg'}" alt="${escapeHtml(winner.title)}">
                    <h3>${escapeHtml(winner.title)}</h3>
                    <p class="winner-score">${winner.totalScore} points</p>
                </div>
            </div>
        `;
    }
}

//===============================
// RENDER VOTING STATS
//===============================
function renderStats() {
    document.getElementById('total-movies').textContent = dummyResults.stats.totalMovies;
    document.getElementById('total-voters').textContent = dummyResults.stats.totalVoters;
    document.getElementById('highest-score').textContent = dummyResults.stats.highestScore;
    document.getElementById('average-score').textContent = dummyResults.stats.averageScore.toFixed(1);
}


//===============================
// RENDER ALL MOVIE RESULTS
//===============================
function renderAllResults() {
    const resultsList = document.getElementById('results-list');

    // Sort results by totalScore (highest first)
    const moviesSorted = [...dummyResults.results].sort((a, b) => b.totalScore - a.totalScore);

    resultsList.innerHTML = moviesSorted.map((movie, index) => {
        const rank = index + 1;
        const isWinner = dummyResults.winners.some(w => w.id === movie.id);

        return `
            <div class="result-item ${isWinner ? 'winner-highlight' : ''}">
                <div class="result-rank">#${rank}</div>
                <div class="result-poster">
                    <img src="${movie.posterUrl}" alt="${escapeHtml(movie.title)}">
                </div>
                <div class="result-info">
                    <h3 class="result-title">
                        ${escapeHtml(movie.title)}
                        ${isWinner ? '<span class="winner-badge">🏆 WINNER</span>' : ''}
                    </h3>
                    <div class="result-scores">
                        <span class="total-score">${movie.totalScore} points</span>
                        <span class="avg-rating">Avg: ${movie.avgRating.toFixed(2)}</span>
                    </div>
                    <div class="vote-breakdown">
                        ${Object.entries(movie.votes).map(([user, rating]) => `
                            <div class="user-vote">
                                <span class="user-name">${user}:</span>
                                <span class="user-rating">${rating} ⭐</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

//===============================
// Other Functions
//===============================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
