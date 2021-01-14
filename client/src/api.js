const axios = require("axios");

//user
export async function createUser(username, password) {
    const json = JSON.stringify({username: username, password: password});
    return axios.post(`/api/users/create`, json);
}

export async function login(username, password) {
    const json = JSON.stringify({username: username, password: password});
    return axios.post(`/api/users/authenticate`, json);
}

export async function veryifyToken(username, token) {
    return axios.get(`/api/users/check_token?username=${username}&request_token=${token}`);
}