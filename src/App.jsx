// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

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

// ✅ FIX: sesuaikan dengan nama file aslinya (Checkout.jsx)
import Checkout from "./pages/checkout";

import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";
import TentangKami from "./landingpage/TentangKami";
import Referral from "./landingpage/Referral";
import BuktiPembayaran from "./pages/BuktiPembayaran";

// ✅ import halaman tutorial
import Tutorial from "./pages/Tutorial";

// ✅ Paket Dashboard Routes
import Basic from "./PaketDashboard/Basic";
import Pro from "./PaketDashboard/Pro";
import Bisnis from "./PaketDashboard/Bisnis";
import Enterprise from "./PaketDashboard/Enterprise";
import ScrollToTop from "./components/ScrollToTop";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

/* ================== FORCE LIGHT THEME (tetap putih walau Chrome/System Dark) ================== */
function ForceLightTheme() {
  useEffect(() => {
    // 1) Paksa color-scheme browser ke light
    document.documentElement.style.colorScheme = "light";
    document.body.style.colorScheme = "light";

    // 2) Pastikan background & text default tetap light
    document.documentElement.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#111827";

    // 3) Pastikan tidak ada class dark (buat Tailwind darkMode: "class")
    document.documentElement.classList.remove("dark");

    // 4) Tambah meta agar browser tahu ini website light
    const ensureMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Safari/iOS & browser modern
    ensureMeta("color-scheme", "light");
    ensureMeta("supported-color-schemes", "light");

    // Warna address bar (mobile Chrome)
    ensureMeta("theme-color", "#ffffff");
  }, []);

  return (
    <style>{`
      :root { color-scheme: light; }
      html, body { background: #fff !important; color: #111827 !important; }

      /* Tetap light meskipun user device/Chrome prefer dark */
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
        <ScrollToTop />
        <Routes>
          {/* Public Layout wraps these pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tentang" element={<TentangKami />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Route>

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

          {/* Bukti Pembayaran */}
          <Route path="/bukti-pembayaran" element={<BuktiPembayaran />} />

          {/* ✅ PRIVATE: Paket Dashboard per paket */}
          <Route
            path="/paket-dashboard/basic"
            element={
              <RequireAuth>
                <Basic />
              </RequireAuth>
            }
          />
          <Route
            path="/paket-dashboard/pro"
            element={
              <RequireAuth>
                <Pro />
              </RequireAuth>
            }
          />
          <Route
            path="/paket-dashboard/bisnis"
            element={
              <RequireAuth>
                <Bisnis />
              </RequireAuth>
            }
          />
          <Route
            path="/paket-dashboard/enterprise"
            element={
              <RequireAuth>
                <Enterprise />
              </RequireAuth>
            }
          />

          {/* ✅ TAMBAHAN (ALIAS) - route baru tanpa mengganti route lama */}
          <Route
            path="/dashboard/basic"
            element={
              <RequireAuth>
                <Basic />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/pro"
            element={
              <RequireAuth>
                <Pro />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/bisnis"
            element={
              <RequireAuth>
                <Bisnis />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/enterprise"
            element={
              <RequireAuth>
                <Enterprise />
              </RequireAuth>
            }
          />

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
