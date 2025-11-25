import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await api.post("/api/auth/register", { name, email, password });
      navigate("/login");
    } catch (e) {
      setErr(e.response?.data?.message || "Sign-up failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 relative">

      {/* Project Title */}
      <div className="absolute top-10 w-full text-center animate-fade">
        <h1 className="text-3xl font-extrabold text-green-800 dark:text-green-300 tracking-wide">
          NextHire-AI
        </h1>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-[#D9D9D9] p-6 sm:p-8 mt-20 md:mt-16">

        {/* Heading */}
        <h2 className="text-center text-3xl font-semibold text-[#4B6E48] dark:text-green-200 mb-6">
          Create Account
        </h2>

        {/* Error Message */}
        {err && (
          <p className="text-red-600 text-center mb-3 bg-red-100 dark:bg-red-800 dark:text-red-200 py-2 rounded-xl border border-red-300">
            {err}
          </p>
        )}

        <form onSubmit={submit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="text-[#898989] dark:text-gray-300 text-sm mb-1 block">Full Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full bg-[#F7F7F7] dark:bg-gray-700 dark:text-white border border-[#D9D9D9] dark:border-gray-600 rounded-xl px-4 py-3 outline-none 
              focus:ring-2 focus:ring-[#B2AC88]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[#898989] dark:text-gray-300 text-sm mb-1 block">Email *</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-[#F7F7F7] dark:bg-gray-700 dark:text-white border border-[#D9D9D9] dark:border-gray-600 rounded-xl px-4 py-3 outline-none
              focus:ring-2 focus:ring-[#B2AC88]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[#898989] dark:text-gray-300 text-sm mb-1 block">Password *</label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full bg-[#F7F7F7] dark:bg-gray-700 dark:text-white border border-[#D9D9D9] dark:border-gray-600 rounded-xl px-4 py-3 outline-none
              focus:ring-2 focus:ring-[#B2AC88]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#4B6E48] text-white rounded-xl text-lg font-semibold
            hover:bg-[#3f5c3c] transition-all active:scale-95 shadow-md"
          >
            SIGN UP
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-[#898989] dark:text-gray-300 mt-5 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#4B6E48] dark:text-green-300 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
