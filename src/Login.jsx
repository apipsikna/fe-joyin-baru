// src/Login.jsx
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
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

  const alertProcessed = React.useRef(false);

  // Auto-hide alert
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  // ✅ Handle redirect dari Google OAuth (?token=...&refreshToken=...&user=...)
  useEffect(() => {
    if (alertProcessed.current) return; // Mencegah eksekusi 2x di StrictMode

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const user = params.get("user");

    if (token) {
      alertProcessed.current = true; // Tandai sudah diproses

      // simpan & set default header agar request sesudahnya langsung authorized
      try { localStorage.setItem("accessToken", token); } catch { }
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setAccessToken(token); // informasikan ke context

      let role = "USER";
      if (refreshToken) try { localStorage.setItem("refreshToken", refreshToken); } catch { }
      if (user) {
        try {
          localStorage.setItem("user", user);
          const parsed = JSON.parse(user);
          role = parsed.role || "USER";
        } catch { }
      }

      // Tampilkan alert sukses dulu, baru navigate
      setAlert({ type: "success", message: "Login Google berhasil!" });
      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 1000);
    }
  }, [location, navigate, setAccessToken]);

  // ----- LOGIN -----
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Kita tidak null-kan alert di sini agar tidak 'kedip' jika error sama,
    // tapi nanti akan ditimpa value baru.
    setWrongPw(false);

    try {
      // fungsi login dari context akan memanggil setAccessToken ketika sukses
      const response = await login(email, password);

      // DEBUG: Cek struktur response
      console.log("LOGIN RESPONSE FULL:", response);

      // Cek role dengan case-insensitive
      const rawRole = response?.user?.role || response?.data?.user?.role || response?.data?.role || "USER";
      const role = String(rawRole).toUpperCase();

      // Tampilkan alert sukses dulu, baru navigate
      setAlert({ type: "success", message: "Berhasil masuk ke akun!" });
      setLoading(false);
      setTimeout(() => {
        setLoading(true); // Munculkan loading sesaat sebelum pindah halaman

        if (role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 1500);
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

      setLoading(false);
      // Cek jika alert yg sama sedang tampil, jangan setAlert lagi (biar smooth)
      if (alert?.type === 'error' && alert?.message === msg) return;

      setAlert({ type: "error", message: msg });
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
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-xl shadow-2xl text-center font-medium z-50 transition-all duration-300 ${isSuccess
          ? "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] text-white"
          : "bg-red-500 text-white"
          }`}
      >
        {message}
      </motion.div>
    );
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden relative">
      <AnimatePresence>
        {loading && <LoadingSpinner />}
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
            className="w-full h-full absolute top-0 left-0 z-10"
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
            className="flex flex-col lg:flex-row w-full h-full relative"
          >
            {/* Tombol Panah Kembali ke Beranda */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition z-20"
              aria-label="Kembali ke Beranda"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Kiri - Form Login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-24 bg-white relative z-0">
              <h2 className="text-4xl text-black font-bold mb-4 text-center lg:text-left">LOGIN</h2>
              <p className="text-center lg:text-left text-gray-500 mb-10 text-lg">Enter your email and password to Login</p>

              <motion.form
                onSubmit={handleLogin}
                className="space-y-6 w-full"
                animate={wrongPw ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 border rounded-full outline-none text-base bg-white shadow-sm focus:ring-2 focus:ring-[#52c8b0] transition-all"
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
                    className={`w-full px-6 py-4 border rounded-full outline-none text-base bg-white shadow-sm pr-12 focus:ring-2 focus:ring-[#52c8b0] transition-all ${wrongPw ? "border-red-500 ring-1 ring-red-400" : ""
                      }`}
                    disabled={loading}
                    required
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
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

                <div className="text-right text-base">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password", { state: { email } })}
                    className="text-green-500 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="flex justify-center lg:justify-start">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-3 rounded-full text-lg font-semibold transition shadow-lg ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:from-[#43b79c] hover:to-[#66c97b] transform hover:-translate-y-1"
                      }`}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </div>
              </motion.form>

              {/* OR */}
              <div className="flex items-center gap-4 my-8 w-full">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="text-base text-gray-400 font-medium">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Login Google */}
              <div className="w-full">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full text-black flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-base font-medium transition shadow-sm"
                  disabled={loading}
                >
                  <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
                  Login with Google
                </button>
              </div>

              {/* Sign up */}
              <p className="text-base mt-8 text-center lg:text-left text-gray-600">
                Don't have an account?{" "}
                <span
                  onClick={() => setShowSignUp(true)}
                  className="bg-gradient-to-r from-[#52c8b0] to-[#78d98d] bg-clip-text text-transparent hover:underline cursor-pointer font-semibold"
                >
                  Sign Up
                </span>
              </p>
            </div>

            {/* Kanan - Gambar Full */}
            <div className="hidden lg:block w-1/2 h-full bg-gray-50">
              <img src={image} alt="Illustration" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
