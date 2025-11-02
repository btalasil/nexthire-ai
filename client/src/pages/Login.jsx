import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient.js";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data.token);
      setTimeout(() => navigate("/dashboard"), 150);
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Paper elevation={3} className="p-8 w-full max-w-md">
        <Typography variant="h5" className="mb-6 text-center font-bold">
          CareerPilot Login
        </Typography>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          {err && <p className="text-red-600 text-sm text-center">{err}</p>}

          <Button type="submit" variant="contained" fullWidth>
            LOGIN
          </Button>
        </form>

        <p className="mt-4 text-center">
          New here?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Create account
          </Link>
        </p>
      </Paper>
    </div>
  );
}
