import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,

    headeres: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,

});



// src/services/api.js inside interceptor logic check
API.interceptors.request.use(
  (config) => {
    const savedToken = localStorage.getItem('omnimind_token');
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`; // Perfect authentication token string pass
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;