/**
 * Lobby model
 * Create base functions for how the lobbies operate. 
 */

const lobbies = new Map();

/**
 * Check if lobby exists
 * @param {string} code - lobby code
 * @returns {Promise<Object>} true if the lobby exists.
 */
async function exists(code) {
    return lobbies.has(code);
}

/**
 * Create lobby
 * @param {string} code - lobby code
 * @param {Object} lobbyData - lobby data structure - expecting at least "user" field
 * @returns {Promise<Object>} Lobby object
 */
async function create(code, lobbyData) {
    const lobby = { users: [], ...lobbyData}
    lobbies.set(code, lobby);
    return lobby;
}

/**
 * Get lobby object.
 * @param {string} code - lobby code
 * @returns {Promise<Object>} Lobby object, null if it doesn't exist
 */
async function get(code) {
    return lobbies.get(code) || null;
}

/**
 * Remove given user from lobby
 * @param {string} code - lobby code
 * @param {number} userID - user ID in lobby.
 * @returns {Promise<Object>} true if successful
 */
async function userLeave(code, userID) {
	let lobby = lobbies.get(code);
	let users = await lobby.users;
	let user = undefined;
	for (const uid of users) {
		if (userID === uid.id) {
			user = uid; 
			return true;
		}
	}
	if (!user) {
		return false;
	} 
	users = users.filter(item => item !== user)
	lobby.users = users;

	
	lobbies.set(code, lobby);
}

/**
 * Cull lobby from memory
 * @param {string} code - lobby code
 * @returns {Promise<Object>} true if the deletion was sucessful
 */
async function destroy(code) {
	return lobbies.delete(code);
}


module.exports = { 
    exists, 
    create, 
    get,
	userLeave,
	destroy
};