import { useState } from "react";
import { api } from "../api/axiosClient";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setMsg("");
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/forgot-password", { email });
      setMsg("Reset link sent. Check your email.");
      setEmail("");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 relative">

      {/* Project Title */}
      <div className="absolute top-10 w-full text-center animate-fade">
        <h1 className="text-3xl font-extrabold text-green-800 dark:text-green-300 tracking-wide">
          NextHire-AI
        </h1>
      </div>

      {/* Forgot Password Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md mt-20 md:mt-16 text-center">

        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Forgot Password
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-green-300 outline-none"
          placeholder="Enter your email"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {msg && <p className="text-green-600 dark:text-green-400 text-sm mt-3">{msg}</p>}
        {error && <p className="text-red-600 dark:text-red-400 text-sm mt-3">{error}</p>}

        <Link
          to="/login"
          className="block mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
