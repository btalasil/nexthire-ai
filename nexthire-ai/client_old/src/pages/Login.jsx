import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api/axiosClient.js";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setToken(data.token);
      onAuth?.();
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          CareerPilot Login
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p className="text-red-500 text-center text-sm">{err}</p>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          New here?{" "}
          <Link className="text-blue-500 hover:underline" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
