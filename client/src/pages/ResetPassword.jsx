import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setMsg("");
    setError("");

    if (!password || !confirm) return setError("Please fill both fields");
    if (password !== confirm) return setError("Passwords do not match");

    try {
      await api.post(`/api/auth/reset-password/${token}`, {
        newPassword: password
      });

      setMsg("Password updated! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired link");
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

      {/* Reset Password Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md mt-20 md:mt-16">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Reset Your Password
        </h2>

        {/* New Password Field */}
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="New password"
            className="w-full p-3 border rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:text-white pr-12 focus:ring-2 focus:ring-green-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-4 top-3.5 cursor-pointer text-gray-600 dark:text-gray-300"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full p-3 border rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:text-white pr-12 focus:ring-2 focus:ring-green-600"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            className="absolute right-4 top-3.5 cursor-pointer text-gray-600 dark:text-gray-300"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Reset Password
        </button>

        {msg && <p className="text-green-600 dark:text-green-400 text-center text-sm mt-3">{msg}</p>}
        {error && <p className="text-red-600 dark:text-red-400 text-center text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
