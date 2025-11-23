import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken as saveToken } from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Reusable loader
  const loadUser = async () => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("FAILED /me:", err);
      logout();
    }

    setLoadingUser(false);
  };

  // Load user when app opens
  useEffect(() => {
    loadUser();
  }, []);

  // LOGIN → store token & load user instantly
  const login = async (t) => {
    saveToken(t);
    setToken(t);

    setLoadingUser(true);   // Fix: Don't show UI flicker
    await loadUser();
  };

  // LOGOUT → clear everything
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loadingUser, login, logout, setUser }}
    >
      {loadingUser ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
