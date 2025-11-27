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

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];
  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme", mode);
  }, [mode]);

  const Authed = ({ children }) =>
    token ? children : <Navigate to="/login" />;

  const Unauthed = ({ children }) =>
    !token ? children : <Navigate to="/dashboard" />;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-all">

        {/* NAVBAR */}
        {!hideNavbar && (
          <>
            <header className="px-6 py-4 shadow bg-white dark:bg-gray-800 dark:text-white flex justify-between items-center">

              {/* Logo */}
              <h2 className="text-xl font-bold">NextHire-AI</h2>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-5 text-sm font-medium">

                <Link to="/dashboard" className="nav-link-animate">Dashboard</Link>
                <Link to="/jobs" className="nav-link-animate">Jobs</Link>
                <Link to="/resume" className="nav-link-animate">Resume</Link>

                {/* Theme Toggle */}
                <IconButton
                  onClick={() => setMode(mode === "light" ? "dark" : "light")}
                  sx={{ color: mode === "light" ? "black" : "white" }}
                >
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>

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

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden text-2xl focus:outline-none"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                ☰
              </button>
            </header>

            {/* MOBILE DROPDOWN MENU */}
            {mobileOpen && (
              <div className="md:hidden bg-white dark:bg-gray-800 p-5 shadow space-y-3">

                <Link
                  to="/dashboard"
                  className="block py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/jobs"
                  className="block py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Jobs
                </Link>

                <Link
                  to="/resume"
                  className="block py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Resume
                </Link>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    setMode(mode === "light" ? "dark" : "light");
                    setMobileOpen(false);
                  }}
                  className="block py-2 text-sm"
                >
                  {mode === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                {token && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMobileOpen(false);
                      }}
                      className="block py-2 text-sm"
                    >
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                        setMobileOpen(false);
                      }}
                      className="block py-2 text-sm text-red-500"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </>
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
