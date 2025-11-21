// src/Login.jsx
import React, { useState, useEffect } from "react";
import SignUp from "./SignUp";
import { AnimatePresence, motion } from "framer-motion";
import image from "./assets/gambarlogin.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import api, { API_BASE_URL } from "./api/axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setAccessToken } = useAuth();

  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [wrongPw, setWrongPw] = useState(false);

  // Auto-hide alert
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  // ✅ Handle redirect dari Google OAuth (?token=...&refreshToken=...&user=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const user = params.get("user");

    if (token) {
      // simpan & set default header agar request sesudahnya langsung authorized
      try { localStorage.setItem("accessToken", token); } catch {}
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setAccessToken(token); // informasikan ke context

      if (refreshToken) try { localStorage.setItem("refreshToken", refreshToken); } catch {}
      if (user) try { localStorage.setItem("user", user); } catch {}

      // Tampilkan alert sukses dulu, baru navigate
      setAlert({ type: "success", message: "Login Google berhasil!" });
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    }
  }, [location, navigate, setAccessToken]);

  // ----- LOGIN -----
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    setWrongPw(false);

    try {
      // fungsi login dari context akan memanggil setAccessToken ketika sukses
      await login(email, password);

      // Tampilkan alert sukses dulu, baru navigate
      setAlert({ type: "success", message: "Login berhasil!" });
      setLoading(false);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message || err?.message || "";
      let msg = "Login gagal";

      if (status === 401 || status === 400 || /invalid|password/i.test(backendMsg)) {
        msg = "Email atau password salah";
        setWrongPw(true);
        setTimeout(() => setWrongPw(false), 600);
      } else if (backendMsg) {
        msg = backendMsg;
      }

      setAlert({ type: "error", message: msg });
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // bangun origin backend dari API_BASE_URL
    const apiOrigin =
      API_BASE_URL.startsWith("http")
        ? API_BASE_URL.replace(/\/api\/?$/, "")
        : ""; // jika pakai Vite proxy, biarkan relative path
    window.location.href = `${apiOrigin}/api/auth/google`;
  };

  const AlertMessage = ({ type, message }) => {
    const isSuccess = type === "success";
    return (
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-sm font-medium z-50 transition-all duration-300 ${
          isSuccess
            ? "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {message}
      </motion.div>
    );
  };

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center font-poppins relative overflow-y-auto">
      <AnimatePresence>
        {alert && <AlertMessage type={alert.type} message={alert.message} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showSignUp ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full absolute top-0 left-0"
          >
            <SignUp onBack={() => setShowSignUp(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row w-full max-w-[1200px] h-[80%] bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Kiri - Form Login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-10">
              <h2 className="text-2xl text-black font-bold mb-2 text-center">LOGIN</h2>
              <p className="text-center text-gray-500 mb-6">Enter your email and password to Login</p>

              <motion.form
                onSubmit={handleLogin}
                className="space-y-4 max-w-md mx-auto w-full"
                animate={wrongPw ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-full outline-none text-sm bg-white"
                  disabled={loading}
                  required
                />

                {/* Password Field with toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-full outline-none text-sm bg-white pr-10 ${
                      wrongPw ? "border-red-500 ring-1 ring-red-400" : ""
                    }`}
                    disabled={loading}
                    required
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.43-3.768M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L3 3m18 18l-3.1-3.1" />
                      </>
                    )}
                  </svg>
                </div>

                <div className="text-right text-sm">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password", { state: { email } })}
                    className="text-green-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-[150px] text-white py-2 rounded-full text-sm transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:from-[#43b79c] hover:to-[#66c97b]"
                    }`}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </div>
              </motion.form>

              {/* OR */}
              <div className="flex items-center gap-2 my-6 max-w-md mx-auto w-full">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Login Google */}
              <div className="max-w-md mx-auto w-full">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full text-black flex items-center justify-center gap-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 text-sm transition"
                  disabled={loading}
                >
                  <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
                  Login with Google
                </button>
              </div>

              {/* Sign up */}
              <p className="text-sm mt-6 text-center text-gray-600">
                Don't have an account?{" "}
                <span
                  onClick={() => setShowSignUp(true)}
                  className="bg-gradient-to-r from-[#52c8b0] to-[#78d98d] bg-clip-text text-transparent hover:underline cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>

            {/* Kanan - Gambar */}
            <div className="hidden lg:flex items-center justify-center w-1/2 bg-white">
              <div className="rounded-xl p-6 w-[450px] h-[400px] overflow-hidden">
                <img src={image} alt="Illustration" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
