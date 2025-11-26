// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./i18n";
import { useTranslation } from "react-i18next";

import Dashboard from "./Dashboard";
import Login from "./Login";
import GoogleCallback from "./GoogleCallback";
import Navbar from "./components/Navbar1"; // ⬅️ pakai Navbar1
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
import Referral from "./landingpage/Referral"; // ⬅️ halaman referral
import BuktiPembayaran from "./pages/BuktiPembayaran";

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
    <div className="w-screen min-h-screen font-poppins overflow-x-hidden">
      <Navbar />

      <section id="beranda" className="scroll-mt-24">
        <HeroSection />
      </section>

      <section id="referral" className="scroll-mt-24">
        <Keunggulan />
      </section>

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
    document.documentElement.lang = i18n.language?.startsWith("en")
      ? "en"
      : "id";
  }, [i18n.language]);
  return null;
}

/* ================= Route Guards ================= */
// Privat: butuh login. Jika belum login → arahkan ke /login (bukan ke beranda).
function RequireAuth({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Publik-umum: redirect jika SUDAH login & user lengkap (tetap dipakai untuk callback)
function PublicOnly({ children }) {
  const { isAuthenticated, ready, user } = useAuth();
  if (!ready) return null;
  const ok = isAuthenticated && !!user?.email;
  return ok ? <Navigate to="/dashboard" replace /> : children;
}

// Publik-khusus LOGIN
function PublicOnlyLogin({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppInner() {
  return (
    <>
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
          <Route path="/referral" element={<Referral />} /> {/* ⬅️ route baru */}

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
          <Route path="/bukti-pembayaran" element={<BuktiPembayaran />} />
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
