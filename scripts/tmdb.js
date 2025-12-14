/**
 * TMDB (The Movie Database) API Service
 */

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * Search for movies by title
 * @param {string} query - Movie title to search for
 * @param {number} page - Page number (default 1)
 * @returns {Promise<Object>} Search results with movies array
 */
async function searchMovies(query, page = 1) {
    if (!query || !query.trim()) {
        return { results: [], total_results: 0 };
    }

    const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${TMDB_API_KEY}`
            }
        });

        if (!response.ok) {
            console.error('TMDB API error:', response.status, response.statusText);
            return { results: [], total_results: 0 };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching movies:', error);
        return { results: [], total_results: 0 };
    }
}

/**
 * Get movie details by ID
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object>} Movie details
 */
async function getMovieDetails(movieId) {
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${TMDB_API_KEY}`
            }
        });

        if (!response.ok) {
            console.error('TMDB API error:', response.status, response.statusText);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting movie details:', error);
        return null;
    }
}

/**
 * Get full poster URL
 * @param {string} posterPath - Poster path from TMDB (e.g., "/abc123.jpg")
 * @param {string} size - Image size (w92, w154, w185, w342, w500, w780, original)
 * @returns {string} Full poster URL
 */
function getPosterUrl(posterPath, size = 'w500') {
    if (!posterPath) {
        return '/images/no-poster.png'; // Fallback image
    }
    return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

module.exports = {
    searchMovies,
    getMovieDetails,
    getPosterUrl
};
