import { useEffect, useState, useMemo } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline, IconButton, Avatar, Menu, MenuItem } from "@mui/material";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import Resume from "./pages/Resume.jsx";

import { getToken } from "./api/axiosClient.js";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { token, user, logout } = useAuth();
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");
  const [anchor, setAnchor] = useState(null);
  const navigate = useNavigate();

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const Authed = ({ children }) => (token ? children : <Navigate to="/login" />);
  const Unauthed = ({ children }) => (!token ? children : <Navigate to="/dashboard" />);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* NAVBAR */}
      <header
        className={`flex justify-between p-4 px-6 shadow ${
          mode === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
        }`}
      >
        <h2 className="text-xl font-bold">CareerPilot</h2>

        <nav className="flex items-center gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/resume">Resume</Link>

          {/* Dark/Light Toggle */}
          <button
            className="px-2 py-1 border rounded text-sm"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {mode === "light" ? "Dark" : "Light"}
          </button>

          {!token ? (
            <Link to="/login">Login</Link>
          ) : (
            <>
              <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {(user?.email?.[0] || "U").toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                open={!!anchor}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
              >
                <MenuItem disabled>{user?.email}</MenuItem>
                <MenuItem onClick={() => {navigate("/dashboard"); setAnchor(null);}}>Dashboard</MenuItem>
                <MenuItem onClick={() => {navigate("/jobs"); setAnchor(null);}}>Jobs</MenuItem>
                <MenuItem onClick={() => {navigate("/resume"); setAnchor(null);}}>Resume</MenuItem>
                <MenuItem onClick={() => {logout(); navigate("/login"); setAnchor(null);}}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </nav>
      </header>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Unauthed><Login /></Unauthed>} />
        <Route path="/register" element={<Unauthed><Register /></Unauthed>} />
        <Route path="/dashboard" element={<Authed><Dashboard /></Authed>} />
        <Route path="/jobs" element={<Authed><Jobs /></Authed>} />
        <Route path="/resume" element={<Authed><Resume /></Authed>} />
      </Routes>
    </ThemeProvider>
  );
}
