const lobbies = new Map();

async function exists(code) {
    return lobbies.has(code);
}

async function create(code, lobbyData) {
    const lobby = { users: [], ...lobbyData}
    lobbies.set(code, lobby);
    return lobby;
}

async function get(code) {
    return lobbies.get(code) || null;
}

async function userLeave(code, userID) {
	let lobby = lobbies.get(code);
	let users = await lobby.users;
	let user = undefined;
	for (const uid of users) {
		if (userID === uid.id) {
			user = uid; 
			break;
		}
	}
	if (!user) {
		return -1;
	} 
	users = users.filter(item => item !== user)
	lobby.users = users;

	
	lobbies.set(code, lobby);
}

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