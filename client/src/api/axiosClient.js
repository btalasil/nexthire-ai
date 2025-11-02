import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const storageKey = "cp_token";
export const getToken = () => localStorage.getItem(storageKey);
export const setToken = (t) =>
  t ? localStorage.setItem(storageKey, t) : localStorage.removeItem(storageKey);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
