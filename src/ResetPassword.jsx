// src/ResetPassword.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: tokenFromParam } = useParams();

  // Dukung 3 cara token: /reset-password/:token | ?token= | #?token=
  const tokenFromQuery = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("token") || "";
  }, [location.search]);

  const tokenFromHash = useMemo(() => {
    const h = location.hash.startsWith("#?") ? location.hash.slice(2) : "";
    return h ? new URLSearchParams(h).get("token") || "" : "";
  }, [location.hash]);

  const token = tokenFromParam || tokenFromQuery || tokenFromHash || "";
  const hasToken = Boolean(token);

  // ===== Form states =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // ===== UI states =====
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // {type:'success'|'error'|'info', message:string}

  // Auto-dismiss alert
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  const AlertMessage = ({ type = "info", message }) => {
    const color =
      type === "success"
        ? "from-[#52c8b0] to-[#78d98d]"
        : type === "error"
        ? "from-[#ef4444] to-[#f87171]"
        : "from-gray-500 to-gray-600";
    return (
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 py-2 text-white text-sm shadow-lg bg-gradient-to-r ${color}`}
      >
        {message}
      </motion.div>
    );
  };

  // ===== Handlers =====
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlert({ type: "error", message: "Email wajib diisi." });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      await api.post("/password/forgot", { email });
      setAlert({
        type: "success",
        message:
          "Jika email terdaftar, link reset telah dikirim. Periksa kotak masuk Anda.",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Gagal mengirim link pemulihan. Coba lagi.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) {
      setAlert({
        type: "error",
        message: "Tautan tidak valid atau sudah kedaluwarsa.",
      });
      return;
    }
    if (!password || password.length < 8) {
      setAlert({
        type: "error",
        message: "Password minimal 8 karakter.",
      });
      return;
    }
    if (password !== confirm) {
      setAlert({
        type: "error",
        message: "Konfirmasi password tidak sama.",
      });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      // Kirim sesuai controller-mu: butuh newPassword & confirmPassword
      await api.post("/password/reset", {
        token,
        newPassword: password,
        confirmPassword: confirm,
      });
      setAlert({
        type: "success",
        message: "Password berhasil direset. Mengarahkan ke login…",
      });
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Gagal mereset password. Tautan mungkin tidak valid / sudah kedaluwarsa.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  // ===== UI =====
  return (
    <div className="min-h-screen w-screen bg-white font-poppins">
      {/* BENAR-BENAR TENGAH */}
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <AnimatePresence>
          {alert && <AlertMessage type={alert.type} message={alert.message} />}
        </AnimatePresence>

        <motion.div
          key={hasToken ? "card-reset" : "card-forgot"}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[560px] bg-white border border-gray-200 rounded-[28px] shadow-sm p-10 text-center mx-auto"
        >
          {/* ========= RESET (sesuai mockup) ========= */}
          {hasToken ? (
            <>
              <h1 className="text-[28px] font-bold text-black">
                Buat Password Baru
              </h1>
              <p className="text-gray-500 mt-3 leading-relaxed max-w-[520px] mx-auto">
                Password baru Anda harus berbeda dari password sebelumnya.
              </p>

              <form
                onSubmit={handleReset}
                className="mt-8 space-y-4 mx-auto w-full max-w-[460px] text-left"
              >
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className="w-full h-12 rounded-full border border-gray-200 px-5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#78d98d] focus:border-[#78d98d]"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Your New Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={8}
                  className="w-full h-12 rounded-full border border-gray-200 px-5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#78d98d] focus:border-[#78d98d]"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 rounded-lg text-white text-sm font-medium transition ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:from-[#43b79c] hover:to-[#66c97b]"
                  }`}
                >
                  {loading ? "Menyimpan..." : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            // ========= FORGOT (fallback bila tak ada token) =========
            <>
              <h1 className="text-[28px] font-bold text-black">Lupa Password?</h1>
              <p className="text-gray-500 mt-3 leading-relaxed max-w-[520px] mx-auto">
                Masukkan email Anda untuk menerima tautan reset password.
              </p>

              <form
                onSubmit={handleForgot}
                className="mt-8 space-y-4 mx-auto w-full max-w-[460px] text-left"
              >
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-full border border-gray-200 px-5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#78d98d] focus:border-[#78d98d]"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 rounded-lg text-white text-sm font-medium transition ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:from-[#43b79c] hover:to-[#66c97b]"
                  }`}
                >
                  {loading ? "Mengirim..." : "Kirim Link Pemulihan"}
                </button>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#52c8b0] hover:underline text-sm"
                  >
                    Kembali ke Halaman Login
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
