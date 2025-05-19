// src/api/authApi.js
import api from "./api";

// базовый путь для всех auth-запросов
const AUTH_PREFIX = "/auth";

export const registerUser = async (credentials) => {
  // у interceptor’а нет токена, он его и не вставит
  return api.post(`${AUTH_PREFIX}/register`, credentials);
};

export const loginUser = async (credentials) => {
  const res = await api.post(`${AUTH_PREFIX}/login`, credentials);
  localStorage.setItem("token", res.data.access_token);
  return res;
};
