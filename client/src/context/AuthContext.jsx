import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken as saveToken } from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load current user if token exists
  useEffect(() => {
    async function loadUser() {
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
    }

    loadUser();
  }, []);

  // LOGIN — update localStorage + state
  const login = (t) => {
    saveToken(t);
    setToken(t);
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
