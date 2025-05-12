// src/api/authApi.js
import axios from "axios";

// ← your new ngrok URL here:
const API_URL = "http://localhost:8000/auth";

export const registerUser = async (credentials) => {
  try {
    await axios.post(`${API_URL}/register`, credentials);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    localStorage.setItem("token", res.data.access_token);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
