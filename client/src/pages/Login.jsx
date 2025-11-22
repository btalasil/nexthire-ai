import { useState } from "react";
import { api } from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });

      login(res.data.token);

      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-blue-600 via-indigo-700 to-black px-4">

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 
        backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in">

        <h2 className="text-center text-3xl font-bold text-white mb-6">
          CareerPilot Login
        </h2>

        {error && (
          <p className="text-red-300 text-center mb-3 bg-red-900/40 py-2 rounded-xl border border-red-500/30">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-6">

          {/* EMAIL */}
          <div className="relative">
            <label className="text-white text-sm mb-1 block">Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/20 text-white border border-white/30 
               rounded-xl px-4 py-3 pl-11 placeholder-white/60 outline-none 
               focus:ring-2 focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute left-3 top-11 text-white/70 text-lg">
              📧
            </span>
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="text-white text-sm mb-1 block">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-white/20 text-white border border-white/30 
              rounded-xl px-4 py-3 pl-11 pr-12 placeholder-white/60 outline-none 
              focus:ring-2 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-11 text-white/70 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
            <span className="absolute left-3 top-11 text-white/70 text-lg">
              🔒
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl text-lg font-semibold 
            bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
            shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {/* CREATE ACCOUNT LINK */}
        <div className="text-center mt-5 text-white/80">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-300 cursor-pointer hover:underline hover:text-blue-200 transition"
          >
            Create one
          </span>
        </div>

      </div>
    </div>
  );
}
