import axios from 'axios';

// Default api service to create axios call
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
});

export default api;