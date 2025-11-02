import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient";
import { TextField, Button, Box, Typography, Card } from "@mui/material";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await api.post("/api/auth/register", { name, email, password });
      window.location.href = "/login";
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" mb={2}>
          Create Account
        </Typography>

        <form onSubmit={submit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <Typography color="error">{err}</Typography>}

          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            SIGN UP
          </Button>
        </form>

        <Typography mt={2} align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Card>
    </Box>
  );
}
