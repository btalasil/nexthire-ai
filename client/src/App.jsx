import { useEffect, useState, useMemo } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import Resume from "./pages/Resume.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import MyProfile from "./pages/MyProfile.jsx";

import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { token, user, logout } = useAuth();
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");
  const [anchor, setAnchor] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  // DARK MODE REAL FIX
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  const Authed = ({ children }) =>
    token ? children : <Navigate to="/login" />;

  const Unauthed = ({ children }) =>
    !token ? children : <Navigate to="/dashboard" />;

  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all">
        {/* NAVBAR */}
        {!hideNavbar && (
          <header className="flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-bold">CareerPilot</h2>

            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/resume">Resume</Link>

              <button
                className="px-3 py-1 border rounded text-sm dark:border-gray-600"
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
              >
                {mode === "light" ? "Dark" : "Light"}
              </button>

              {token && (
                <>
                  <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {(user?.email?.[0] || "U").toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchor}
                    open={!!anchor}
                    onClose={() => setAnchor(null)}
                  >
                    <MenuItem disabled>{user?.email}</MenuItem>

                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                        setAnchor(null);
                      }}
                    >
                      My Profile
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        logout();
                        navigate("/login");
                        setAnchor(null);
                      }}
                      sx={{ color: "red" }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </nav>
          </header>
        )}

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/login"
            element={
              <Unauthed>
                <Login />
              </Unauthed>
            }
          />

          <Route
            path="/register"
            element={
              <Unauthed>
                <Register />
              </Unauthed>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Authed>
                <Dashboard mode={mode} />
              </Authed>
            }
          />

          <Route
            path="/jobs"
            element={
              <Authed>
                <Jobs mode={mode} />
              </Authed>
            }
          />

          <Route
            path="/resume"
            element={
              <Authed>
                <Resume mode={mode} />
              </Authed>
            }
          />

          <Route
            path="/profile"
            element={
              <Authed>
                <MyProfile />
              </Authed>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}
