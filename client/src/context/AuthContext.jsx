import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken as saveToken } from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔥 Make loadUser reusable so login() can call it too
  const loadUser = async () => {
    const t = getToken();
    if (!t) {
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

  // Load user on first page load
  useEffect(() => {
    loadUser();
  }, []);

  // LOGIN — after saving token load user immediately
  const login = async (t) => {
    saveToken(t);
    setToken(t);

    setLoadingUser(true);  // 🔥 Important: reset loader
    await loadUser();      // 🔥 Now navbar updates instantly
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loadingUser, login, setUser, logout }}>
      {!loadingUser ? children : null}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
