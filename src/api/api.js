// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,// 20s timeout
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("❌ API Error:", error);
    if (error.response) {
      console.error("🔍 Response data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
