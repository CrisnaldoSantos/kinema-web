import axios from "axios";

//const api = axios.create({baseURL: 'http://127.0.0.1:3333'});
const api = axios.create({baseURL: 'https://kinema-api.herokuapp.com'});

export default api;