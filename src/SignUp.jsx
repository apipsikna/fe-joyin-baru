// src/SignUp.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import image from "./assets/gambarlogin.png";

const REFERRAL_STORAGE_KEY = "signup_referral_code";
const REFERRAL_DISCOUNT_PERCENT = 6;

export default function SignUp({ onBack }) {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const refFromUrl = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    return (qp.get("ref") || "").trim();
  }, [location.search]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    referralCode: "", // opsional
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Prefill referral:
  // 1) dari URL (?ref=XXXX)
  // 2) kalau tidak ada, dari localStorage (jika pernah tersimpan)
  useEffect(() => {
    try {
      const stored = (localStorage.getItem(REFERRAL_STORAGE_KEY) || "").trim();
      setForm((prev) => {
        if (prev.referralCode) return prev;
        if (refFromUrl) return { ...prev, referralCode: refFromUrl.toUpperCase().replace(/\s+/g, "") };
        if (stored) return { ...prev, referralCode: stored.toUpperCase().replace(/\s+/g, "") };
        return prev;
      });
    } catch {
      if (refFromUrl) {
        setForm((prev) =>
          prev.referralCode
            ? prev
            : { ...prev, referralCode: refFromUrl.toUpperCase().replace(/\s+/g, "") }
        );
      }
    }
  }, [refFromUrl]);

  // Auto-hide alert
  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Referral rapih: uppercase + tanpa spasi
    if (name === "referralCode") {
      const v = value.toUpperCase().replace(/\s+/g, "");
      setForm((prev) => ({ ...prev, referralCode: v }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match!" });
      return;
    }
    if (!form.agree) {
      setAlert({
        type: "error",
        message: "You must agree to the terms & policy.",
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // ✅ FE-only dulu: JANGAN kirim referralCode ke backend
      // (Supaya tidak error jika BE belum mendukung field referralCode)
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      await signup(payload);

      // ✅ Simpan referralCode agar Checkout otomatis diskon 6%
      const code = (form.referralCode || "").trim();
      try {
        if (code) localStorage.setItem(REFERRAL_STORAGE_KEY, code);
        else localStorage.removeItem(REFERRAL_STORAGE_KEY);
      } catch {}

      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`, {
        replace: true,
        state: { email: form.email, flash: "OTP telah dikirim ke email kamu." },
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to register";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const AlertMessage = ({ type, message }) => {
    const isSuccess = type === "success";
    return (
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-sm font-medium z-50 transition-all duration-300 ${
          isSuccess
            ? "bg-gradient-to-r from-[#52c8b0] to-[#78d98d] text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {message}
      </motion.div>
    );
  };

  const clearReferral = () => {
    setForm((p) => ({ ...p, referralCode: "" }));
    try {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch {}
  };

  return (
    <AnimatePresence>
      <motion.div
        key="signup"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="w-screen h-screen overflow-y-auto bg-white flex flex-col lg:flex-row font-poppins relative"
      >
        <AnimatePresence>
          {alert && <AlertMessage type={alert.type} message={alert.message} />}
        </AnimatePresence>

        {/* Tombol Panah Kembali */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Kembali"
          type="button"
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
        </motion.button>

        {/* Kiri - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 max-w-md mx-auto w-full"
          >
            <h2 className="text-2xl font-bold text-black text-center">Sign Up</h2>
            <p className="text-center text-gray-500 text-sm mb-2">
              Create your account
            </p>

            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-full text-sm bg-white text-gray-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-full text-sm bg-white text-gray-500"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Enter Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-full text-sm bg-white text-gray-500"
              required
            />

            {/* Referral Code */}
            <div className="space-y-2">
              <input
                type="text"
                name="referralCode"
                placeholder="Referral Code (optional)"
                value={form.referralCode}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-full text-sm bg-white text-gray-500"
                autoComplete="off"
              />
              <div className="flex items-center justify-between px-2">
                <p className="text-[12px] text-gray-400">
                  Isi jika punya kode referral (diskon {REFERRAL_DISCOUNT_PERCENT}% saat beli paket).
                </p>
                {form.referralCode ? (
                  <button
                    type="button"
                    onClick={clearReferral}
                    className="text-[12px] font-semibold text-[#52c8b0] hover:underline"
                  >
                    Hapus
                  </button>
                ) : null}
              </div>
              {refFromUrl ? (
                <div className="px-2 text-[12px] text-emerald-700">
                  Referral terdeteksi dari link: <span className="font-mono font-semibold">{refFromUrl.toUpperCase().replace(/\s+/g, "")}</span>
                </div>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-full text-sm bg-white text-gray-500 pr-10"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                aria-label="Toggle password visibility"
                role="button"
                tabIndex={0}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.43-3.768M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L3 3m18 18l-3.1-3.1" />
                  </svg>
                )}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-full text-sm bg-white text-gray-500 pr-10"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                aria-label="Toggle confirm password visibility"
                role="button"
                tabIndex={0}
              >
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.43-3.768M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L3 3m18 18l-3.1-3.1" />
                  </svg>
                )}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="w-5 h-5 mr-2 accent-[#52c8b0]"
              />
              <span>
                I understand the{" "}
                <a href="#" className="text-[#52c8b0] underline">
                  terms & policy
                </a>
              </span>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-fit px-8 bg-gradient-to-r from-[#52c8b0] to-[#78d98d] text-white py-2 rounded-full hover:from-[#43b79c] hover:to-[#66c97b] transition text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </motion.button>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <button
              type="button"
              disabled={loading}
              className="w-full flex items-center text-black justify-center gap-3 py-2 border rounded-md bg-gray-200 hover:bg-gray-200 text-sm transition font-medium"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
              />
              Sign up with Google
            </button>
          </form>
        </div>

        {/* Kanan - Gambar */}
        <div className="hidden lg:flex items-center justify-center w-1/2 bg-white">
          <div className="rounded-xl p-6 w-[450px] h-[400px] overflow-hidden">
            <img
              src={image}
              alt="Signup Illustration"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
