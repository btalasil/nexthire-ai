import axios from "axios";

// Read token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Save token to localStorage
export function setToken(token) {
  localStorage.setItem("token", token);
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request (if exists)
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
