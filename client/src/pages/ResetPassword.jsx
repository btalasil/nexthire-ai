import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setMsg("");
    setError("");

    if (!password || !confirm) {
      return setError("Please fill both fields.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      await api.post(`/api/auth/reset-password/${token}`, {
        newPassword: password,
      });

      setMsg("Password updated! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Reset Your Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 border rounded-lg mb-4 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full p-3 border rounded-lg mb-4 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-600"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {msg && <p className="text-green-600 text-center text-sm mt-3">{msg}</p>}
        {error && <p className="text-red-600 text-center text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
