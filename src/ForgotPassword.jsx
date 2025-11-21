// src/ForgotPassword.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "./api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', message: string }

  // Prefill email jika dikirim via state/query
  useEffect(() => {
    const stateEmail = location.state?.email || "";
    if (stateEmail) setEmail(stateEmail);
    else {
      const p = new URLSearchParams(location.search);
      const qEmail = p.get("email") || "";
      if (qEmail) setEmail(qEmail);
    }
  }, [location.state, location.search]);

  // Auto-hide alert
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((val || "").trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetEmail = (email || "").trim();

    if (!validateEmail(targetEmail)) {
      setAlert({ type: "error", message: "Masukkan alamat email yang valid." });
      return;
    }

    setSending(true);
    setAlert(null);

    try {
      // Back-end mu: POST /password/forgot
      await api.post("/password/forgot", { email: targetEmail });

      // BE-mu bersifat netral (tidak bocorkan apakah email terdaftar)
      setAlert({
        type: "success",
        message:
          "Jika email terdaftar, tautan reset telah dikirim ke email Anda.",
      });
    } catch (err) {
      // Tetap tampilkan pesan netral agar aman
      const msg =
        err?.response?.data?.message ||
        "Jika email terdaftar, tautan reset telah dikirim ke email Anda.";
      setAlert({ type: "success", message: msg });
    } finally {
      setSending(false);
    }
  };

  const AlertMessage = ({ type, message }) => {
    const isSuccess = type === "success";
    return (
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-3 text-sm shadow-lg ${
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
    <div className="min-h-screen w-screen bg-white font-poppins">
      <AnimatePresence>
        {alert && <AlertMessage type={alert.type} message={alert.message} />}
      </AnimatePresence>

      {/* Card benar-benar di tengah */}
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[560px] bg-white border border-gray-200 rounded-[28px] shadow-sm p-10 text-center"
        >
          {/* Title & description - sesuai mockup */}
          <h1 className="text-[28px] font-bold text-black">Lupa Password?</h1>
          <p className="text-gray-500 mt-3 leading-relaxed max-w-[520px] mx-auto">
            Masukkan email Anda dan kami akan mengirimkan
            <br className="hidden md:block" />
            link untuk mereset password Anda.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
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
              disabled={sending}
              className={`w-full h-12 rounded-lg text-white text-sm font-medium transition ${
                sending
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:from-[#43b79c] hover:to-[#66c97b]"
              }`}
            >
              {sending ? "Mengirim…" : "Kirim Link Pemulihan"}
            </button>

            {/* Link kembali ke login (ikon panah + teks hijau) */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-[#52c8b0] hover:underline text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Kembali ke Halaman Login
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
