import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";
import { loginSuccess } from "../redux/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter email and password.");
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);

      dispatch(
        loginSuccess({
          token,
          user,
        })
      );

      toast.success(response.data.message || "Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
        {/* Top Accent Bar */}
        <div className="h-2 bg-[#2E75B6]"></div>

        <div className="p-10 md:p-14">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-2xl bg-[#D6E6F2] flex items-center justify-center border-2 border-[#2E75B6] relative z-10">
                <span className="text-5xl text-[#2E75B6]">📋</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#F5FBFF] rounded-full border border-gray-100 z-0"></div>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 mt-3 font-medium">
              Sign in to your Project Management account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="email"
                className="absolute -top-3 left-6 bg-white px-2 text-sm font-semibold text-[#2E75B6]"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-gray-200 px-6 pt-3 focus:outline-none focus:ring-2 focus:ring-[#2E75B6] focus:border-[#2E75B6] text-gray-800 placeholder:text-gray-400"
                />
                <FaEnvelope className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 text-xl" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-3 left-6 bg-white px-2 text-sm font-semibold text-[#2E75B6]"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-gray-200 px-6 pt-3 pr-16 focus:outline-none focus:ring-2 focus:ring-[#2E75B6] focus:border-[#2E75B6] text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2E75B6] transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={22} />
                  ) : (
                    <FaEye size={22} />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-[#2E75B6] hover:bg-[#1C5B8B] text-white text-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? "Signing In..." : "LOGIN"}
              </button>
            </div>
          </form>

          {/* Toggle Route Link */}
          <p className="text-center text-sm text-gray-600 mt-6 relative z-10">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#2E75B6] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#D6E6F2] rounded-full opacity-60"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 border-2 border-gray-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;