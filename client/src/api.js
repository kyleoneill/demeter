const axios = require("axios");

//user
export async function createUser(username, password) {
    return axios.post(`/api/users/create?username=${username}&password=${password}`);
}

export async function login(username, password) {
    return axios.post(`/api/users/login?username=${username}&password=${password}`);
}