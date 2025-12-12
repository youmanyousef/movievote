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


module.exports = { 
    exists, 
    create, 
    get 
};