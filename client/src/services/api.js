import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },


});



// src/services/api.js inside interceptor logic check
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