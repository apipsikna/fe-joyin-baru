// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./i18n";
import { useTranslation } from "react-i18next";

import Dashboard from "./Dashboard";
import Login from "./Login";
import GoogleCallback from "./GoogleCallback";
import Navbar from "./components/Navbar1";
import HeroSection from "./components/HeroSection";
import Keunggulan from "./components/Keunggulan";
import FiturJoyin from "./components/FiturJoyin";
import PaketHarga from "./components/PaketHarga";
import TestimoniCarousel from "./components/TestimoniCarousel";
import Footer from "./components/Footer";
import Setting from "./pages/Setting";
import Checkout from "./pages/checkout";
import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";
import TentangKami from "./landingpage/TentangKami";
import Referral from "./landingpage/Referral";
import BuktiPembayaran from "./pages/BuktiPembayaran";

// ✅ import halaman tutorial baru
import Tutorial from "./pages/Tutorial";

/* ================== FORCE LIGHT THEME ================== */
function ForceLightTheme() {
  useEffect(() => {
    document.documentElement.style.colorScheme = "light";
    document.body.style.colorScheme = "light";

    document.documentElement.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#111827";

    document.documentElement.classList.remove("dark");

    const ensureMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta("color-scheme", "light");
    ensureMeta("supported-color-schemes", "light");
  }, []);

  return (
    <style>{`
      :root { color-scheme: light; }
      html, body { background: #fff !important; color: #111827 !important; }

      @media (prefers-color-scheme: dark) {
        :root { color-scheme: light; }
        html, body { background: #fff !important; color: #111827 !important; }
        input, textarea, select, button { color-scheme: light; }
      }
    `}</style>
  );
}

/* ================== Landing Page ================== */
function LandingPage() {
  useEffect(() => {
    const wantHash = "#beranda";
    if (window.location.pathname === "/") {
      if (window.location.hash !== wantHash) {
        window.history.replaceState(null, "", wantHash);
      }
      const el = document.getElementById("beranda");
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  return (
    <div className="w-screen min-h-screen font-poppins overflow-x-hidden bg-white text-black">
      <Navbar />

      <section id="beranda" className="scroll-mt-24">
        <HeroSection />
      </section>

      <section id="referral" className="scroll-mt-24">
        <Keunggulan />
      </section>

      {/* ini boleh tetap ada */}
      <section id="tutorial" className="scroll-mt-24">
        <FiturJoyin />
      </section>

      <section id="paket" className="scroll-mt-24">
        <PaketHarga />
      </section>

      <TestimoniCarousel />

      <section id="tentang" className="scroll-mt-24">
        <Footer />
      </section>
    </div>
  );
}

/* ===== Sinkronkan <html lang="..."> ===== */
function HtmlLangSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language?.startsWith("en") ? "en" : "id";
  }, [i18n.language]);
  return null;
}

/* ================= Route Guards ================= */
function RequireAuth({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { isAuthenticated, ready, user } = useAuth();
  if (!ready) return null;
  const ok = isAuthenticated && !!user?.email;
  return ok ? <Navigate to="/dashboard" replace /> : children;
}

function PublicOnlyLogin({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppInner() {
  return (
    <>
      <ForceLightTheme />
      <HtmlLangSync />

      <Router>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <PublicOnlyLogin>
                <Login />
              </PublicOnlyLogin>
            }
          />

          {/* Google callback */}
          <Route
            path="/google-callback"
            element={
              <PublicOnly>
                <GoogleCallback />
              </PublicOnly>
            }
          />

          {/* Verify / Reset / Forgot */}
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Publik */}
          <Route path="/tentang" element={<TentangKami />} />
          <Route path="/referral" element={<Referral />} />

          {/* ✅ Tutorial page */}
          <Route path="/tutorial" element={<Tutorial />} />

          {/* Bukti Pembayaran */}
          <Route path="/bukti-pembayaran" element={<BuktiPembayaran />} />

          {/* Privat */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Setting />
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <React.Suspense fallback={null}>
        <AppInner />
      </React.Suspense>
    </AuthProvider>
  );
}
