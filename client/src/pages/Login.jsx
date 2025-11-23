import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();   // ✅ use AuthContext login()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/api/auth/login", { email, password });

      // ✅ Do NOT manually set localStorage token
      await login(res.data.token);

      navigate("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f3f3f3] px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2f4f2f]">
          Login
        </h2>

        {err && <p className="text-red-500 text-center mb-3 text-sm">{err}</p>}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Email *</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring focus:ring-green-300 outline-none bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium">Password *</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 rounded-lg border pr-12 bg-gray-50 focus:ring focus:ring-green-300 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="absolute right-4 top-11 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-sm text-green-700 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#315c41] hover:bg-[#264a33] text-white font-semibold rounded-lg"
          >
            LOGIN
          </button>
        </form>

        <p className="text-center text-sm mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
