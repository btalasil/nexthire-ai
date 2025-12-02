import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axiosClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { timeout: 60000 } // 60 seconds for Render wake-up
      );

      await login(res.data.token);
      navigate("/dashboard");
    } catch (e) {
      if (e.code === "ECONNABORTED") {
        setErr("Server is waking up… Try again in a moment.");
      } else {
        setErr(e.response?.data?.message || "Login failed");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 relative">

      {/* Project Title */}
      <div className="absolute top-10 w-full text-center animate-fade">
        <h1 className="text-3xl font-extrabold text-green-800 dark:text-green-300 tracking-wide">
          NextHire-AI
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mt-20 md:mt-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2f4f2f] dark:text-green-200">
          Login
        </h2>

        {err && (
          <p className="text-red-500 text-center mb-3 text-sm animate-pulse">
            {err}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-medium dark:text-gray-200">Email *</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full mt-1 px-4 py-3 rounded-lg border dark:border-gray-700 focus:ring focus:ring-green-300 outline-none bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium dark:text-gray-200">Password *</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 rounded-lg border dark:border-gray-700 pr-12 bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-green-300 outline-none dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="absolute right-4 top-11 cursor-pointer text-gray-600 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-sm text-green-700 dark:text-green-300 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 flex items-center justify-center font-semibold rounded-lg transition text-white 
              ${loading ? "bg-green-900 cursor-not-allowed" : "bg-[#315c41] hover:bg-[#264a33]"}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in…
              </span>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-5 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-700 dark:text-green-300 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
