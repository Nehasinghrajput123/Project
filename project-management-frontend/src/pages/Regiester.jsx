import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill in all fields.");
    }

    try {
      setLoading(true);

      // API Call for Registration
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success(response.data.message || "Registration Successful!");
      
      // Successfully register hone ke baad user ko login page par bhej rahe hain
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#2E75B6] flex items-center justify-center text-3xl text-white">
            📋
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Register Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create your Project Management account
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2E75B6] focus:border-[#2E75B6] text-gray-800 placeholder:text-gray-400"
              />
              <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2E75B6] focus:border-[#2E75B6] text-gray-800 placeholder:text-gray-400"
              />
              <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2E75B6] focus:border-[#2E75B6] text-gray-800 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E75B6] transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#2E75B6] hover:bg-[#1C5B8B] text-white font-semibold transition-all duration-300 shadow-sm"
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </div>
        </form>

        {/* Toggle Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#2E75B6] font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;