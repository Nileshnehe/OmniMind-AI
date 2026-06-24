import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  timeout: 15000, // 15 seconds — enough for any REST call
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});




API.interceptors.request.use(
  (config) => {
    const savedToken = localStorage.getItem('omnimind_token');
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;