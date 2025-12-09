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
  const [alert, setAlert] = useState(null);
  const [seconds, setSeconds] = useState(60);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  // Jika user buka halaman tanpa email, arahkan balik
  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  // Tampilkan flash message dari SignUp
  const flashShown = useRef(false);
  useEffect(() => {
    const flash = location.state?.flash;
    if (flash && !flashShown.current) {
      setAlert({ type: "success", message: flash });
      flashShown.current = true;

      // Clear location state to prevent reappearance on refresh/navigation if possible,
      // though typically this is handled by router not re-pushing state.
      // But purely for local double-check within session:
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  // Auto-dismiss alert
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!email) {
      setAlert({ type: "error", message: "Email hilang. Silakan daftar ulang." });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      await verifyOtp(email, code);
      setAlert({ type: "success", message: "Verifikasi berhasil! Mengalihkan..." });
      setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Kode OTP salah atau kadaluarsa.";
      setAlert({ type: "error", message: msg });
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    if (!email) return;
    setResending(true);
    setAlert(null);
    try {
      await resendOtp(email);
      setAlert({ type: "info", message: "Kode OTP baru dikirim ke email." });
      setSeconds(60);
    } catch (err) {
      setAlert({ type: "error", message: "Gagal kirim ulang. Coba sesaat lagi." });
    } finally {
      setResending(false);
    }
  };

  const AlertMessage = ({ type, message }) => {
    const isSuccess = type === "success";
    const bg = isSuccess ? "bg-emerald-500" : type === "error" ? "bg-rose-500" : "bg-blue-500";
    return (
      <motion.div
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-10 left-1/2 px-6 py-3 rounded-xl shadow-xl z-50 text-white font-medium transform -translate-x-1/2 ${bg}`}
      >
        {message}
      </motion.div>
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-white flex flex-col lg:flex-row font-poppins relative">
      <AnimatePresence>{alert && <AlertMessage type={alert.type} message={alert.message} />}</AnimatePresence>

      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-14 lg:px-24 bg-white relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-800 transition group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold">Kembali ke Login</span>
          </button>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Verifikasi OTP</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Masukkan 6 digit kode yang telah kami kirimkan ke <br className="hidden sm:block" />
            <span className="font-bold text-gray-800">{maskedEmail}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div
              className="grid grid-cols-6 gap-2 sm:gap-3 mb-8"
              onPaste={handlePaste}
            >
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digits[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-full aspect-square bg-gray-50 border border-gray-200 rounded-xl text-center text-xl sm:text-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:bg-white transition-all caret-emerald-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-emerald-200 transition-all transform active:scale-[0.98]
                ${!canSubmit || loading
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] hover:brightness-105"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Verifikasi Sekarang"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Belum terima kode?{" "}
            <button
              onClick={handleResend}
              disabled={seconds > 0 || resending}
              className={`font-bold transition ${seconds > 0 || resending ? "text-gray-400 cursor-not-allowed" : "text-emerald-500 hover:text-emerald-600 underline"
                }`}
            >
              {resending
                ? "Mengirim..."
                : seconds > 0
                  ? `Tunggu ${seconds}s`
                  : "Kirim Ulang"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: IMAGE / DECORATION */}
      <div className="hidden lg:block w-1/2 h-full relative overflow-hidden bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {image ? (
            <img src={image} alt="Verify Illustration" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5FCAAC] to-[#DAEC75]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-12 left-12 right-12 text-white drop-shadow-md"
        >
          <h3 className="text-3xl font-extrabold mb-2">Amankan Akun Anda.</h3>
          <p className="text-lg text-white/90">
            Verifikasi email membantu kami memastikan keamanan dan kenyamanan Anda dalam menggunakan Joyin.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
