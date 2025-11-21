// src/VerifyOtp.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import image from "./assets/gambarlogin.png";
import { useAuth } from "./contexts/AuthContext";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();

  // Ambil email dari state atau query param
  const emailFromState = location?.state?.email || "";
  const emailFromQuery = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("email") || "";
  }, [location.search]);
  const email = emailFromState || emailFromQuery || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error'|'info', message: string }
  const [seconds, setSeconds] = useState(60); // countdown untuk resend
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  // Jika user buka halaman tanpa email (misal refresh tab kosong), arahkan balik
  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  // Tampilkan flash message dari SignUp (opsional)
  useEffect(() => {
    const flash = location.state?.flash;
    if (flash) setAlert({ type: "success", message: flash });
  }, [location.state]);

  // Auto-dismiss alert
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 2600);
    return () => clearTimeout(t);
  }, [alert]);

  // Countdown resend
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // Fokus input pertama saat mount
  useEffect(() => {
    inputsRef.current?.[0]?.focus();
  }, []);

  const maskedEmail = useMemo(() => {
    if (!email) return "email kamu";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const left =
      name.length <= 2
        ? name[0] || ""
        : name[0] + "*".repeat(Math.max(1, name.length - 2)) + name[name.length - 1];
    return `${left}@${domain}`;
  }, [email]);

  const code = digits.join("");
  const canSubmit = email && code.length === OTP_LENGTH && digits.every((d) => d !== "");

  const handleChange = (idx, v) => {
    const val = v.replace(/\D/g, "").slice(0, 1); // hanya digit
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (val && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
      inputsRef.current[idx + 1]?.select?.();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setDigits((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
        return;
      }
      if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!text) return;
    const chars = text.slice(0, OTP_LENGTH).split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < OTP_LENGTH; i++) next[i] = chars[i] || "";
      return next;
    });
    const lastFilled = Math.min(chars.length, OTP_LENGTH) - 1;
    if (lastFilled >= 0) inputsRef.current[lastFilled]?.focus();
  };

  // ====> VERIFY via AuthContext
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!email) {
      setAlert({ type: "error", message: "Email tidak ditemukan. Ulangi pendaftaran." });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      await verifyOtp(email, code); // simpan token & user di context/localStorage
      setAlert({ type: "success", message: "OTP benar. Akun aktif!" });
      setTimeout(() => navigate("/dashboard", { replace: true }), 700);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Verifikasi gagal. Coba lagi.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  // ====> RESEND via AuthContext
  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    if (!email) {
      setAlert({ type: "error", message: "Email tidak ditemukan. Ulangi pendaftaran." });
      return;
    }
    setResending(true);
    setAlert(null);
    try {
      await resendOtp(email);
      setAlert({ type: "info", message: "Kode OTP telah dikirim ulang." });
      setSeconds(60);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Gagal mengirim ulang OTP. Pastikan email benar / coba beberapa menit lagi.";
      setAlert({ type: "error", message: msg });
    } finally {
      setResending(false);
    }
  };

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

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center font-poppins relative overflow-y-auto">
      <AnimatePresence>
        {alert && <AlertMessage type={alert.type} message={alert.message} />}
      </AnimatePresence>

      <motion.div
        key="verify-otp"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col lg:flex-row w-full max-w-[1100px] min-h-[72%] bg-white rounded-2xl shadow-md overflow-hidden"
      >
        {/* Kiri - Form OTP */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-12 py-10">
          {/* Tombol kembali */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 w-fit p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Kembali"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-2xl md:text-3xl text-black font-bold mb-2">Verify your email</h2>
          <p className="text-gray-500 mb-6">
            Kami telah mengirim <span className="font-semibold">{OTP_LENGTH}-digit</span> kode ke{" "}
            <span className="text-black font-medium">{maskedEmail}</span>. Masukkan kodenya di bawah.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <label htmlFor="otp-0" className="sr-only">
              Masukkan kode OTP
            </label>

            {/* Kotak OTP */}
            <div
              onPaste={handlePaste}
              className="grid grid-cols-6 gap-3 sm:gap-4 mb-5"
              role="group"
              aria-label="OTP inputs"
            >
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={(el) => (inputsRef.current[i] = el)}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digits[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border rounded-xl bg-white outline-none
                             focus:ring-2 focus:ring-[#78d98d] focus:border-[#78d98d] select-none"
                />
              ))}
            </div>

            {/* Info & Resend */}
            <div className="flex items-center justify-between text-sm mb-6">
              <span className="text-gray-500">Tidak menerima kode?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={seconds > 0 || resending}
                className={`font-medium ${
                  seconds > 0 || resending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#43b79c] hover:underline"
                }`}
              >
                {resending
                  ? "Mengirim..."
                  : seconds > 0
                  ? `Kirim ulang dalam ${seconds}s`
                  : "Kirim ulang"}
              </button>
            </div>

            {/* Tombol Verify */}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`w-full py-3 rounded-full text-white text-sm font-medium transition
                ${
                  !canSubmit || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:from-[#43b79c] hover:to-[#66c97b]"
                }`}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            {/* Link balik */}
            <div className="text-center mt-5 text-sm">
              <button type="button" onClick={() => navigate("/login")} className="text-gray-500 hover:underline">
                Ganti email / kembali ke Login
              </button>
            </div>
          </form>
        </div>

        {/* Kanan - Gambar */}
        <div className="hidden lg:flex items-center justify-center w-1/2 bg-white">
          <div className="rounded-xl p-6 w-[450px] h-[400px] overflow-hidden">
            <img src={image} alt="Verify illustration" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
