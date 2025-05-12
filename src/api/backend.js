// src/api/backend.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error); // Logs the error for debugging
    const message = error.response?.data?.detail || error.message; // Extracts a user-friendly message
    return Promise.reject(new Error(message)); // Re-throws a standardized error object
  }
);

export default API;
