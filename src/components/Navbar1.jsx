// src/components/Navbar1.jsx
import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineArrowRightOnRectangle,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { resolveAvatarUrl } from "../utils/avatar";

// ====== Menu config ======
const NAV_ITEMS = [
  { id: "referral", label: "Referral", kind: "route", target: "/referral" },
  { id: "paket", label: "Paket", kind: "hash", target: "#paket" },
  { id: "beranda", label: "Beranda", kind: "hash", target: "#beranda" },

  // ✅ Tutorial sekarang langsung ke halaman tutorial
  { id: "tutorial", label: "Tutorial", kind: "route", target: "/tutorial" },

  { id: "tentang", label: "Tentang Kami", kind: "route", target: "/tentang" },
];

// ====== Tentukan active berdasarkan URL sekarang ======
const deriveActiveFromLocation = (loc) => {
  const { pathname, hash } = loc;

  if (pathname === "/tentang") return "tentang";
  if (pathname === "/referral") return "referral";
  if (pathname === "/tutorial") return "tutorial";

  if (pathname === "/") {
    const map = {
      "#referral": "referral",
      "#paket": "paket",
      "#beranda": "beranda",
      "#tutorial": "tutorial", // masih aman kalau kamu tetap pakai anchor di beranda
    };
    return map[hash] || "beranda";
  }
  return "beranda";
};

// ===== Util kecil
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { fetchMe, ready, isAuthenticated, logout } = useAuth();

  // ====== Active state & indicator ======
  const [active, setActive] = useState(() => deriveActiveFromLocation(location));
  const menuRef = useRef(null);
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  // ===== Profile state (untuk tampil di landing) =====
  const [profile, setProfile] = useState({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownWrapRef = useRef(null);

  useEffect(() => {
    setActive(deriveActiveFromLocation(location));
  }, [location]);

  const updateIndicator = () => {
    const menu = menuRef.current;
    const el = itemRefs.current[active];
    if (!el || !menu) return;

    const menuRect = menu.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - menuRect.left,
      width: elRect.width,
      ready: true,
    });
  };

  useLayoutEffect(() => {
    updateIndicator();
    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(updateIndicator));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Klik item menu
  const handleClick = (e, item) => {
    e.preventDefault();

    if (item.kind === "route") {
      setActive(item.id);
      navigate(item.target);
      return;
    }

    // hash navigation
    if (location.pathname !== "/") {
      setActive(item.id);
      navigate({ pathname: "/", hash: item.target });
      return;
    }

    const id = item.target.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setActive(item.id);
      window.history.replaceState(null, "", item.target);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Fetch profil kalau user login
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!ready) return;

      if (!isAuthenticated) {
        if (!cancelled) {
          setProfile({});
          setProfileLoaded(true);
        }
        return;
      }

      try {
        const res = await fetchMe();
        const user = res?.data?.user ?? res?.data ?? res;
        if (!cancelled) setProfile(user || {});
      } catch {
        if (!cancelled) setProfile({});
      } finally {
        if (!cancelled) setProfileLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, fetchMe]);

  // close dropdown on outside click / ESC
  useEffect(() => {
    function onDown(e) {
      if (dropdownWrapRef.current && !dropdownWrapRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpenProfile(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const firstName = useMemo(
    () => (profile?.name || "Pengguna").split(" ")[0],
    [profile?.name]
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-16 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="Logo"
          className="h-12"
          onLoad={() => requestAnimationFrame(updateIndicator)}
        />
      </div>

      {/* Menu */}
      <div ref={menuRef} className="relative hidden lg:flex items-center gap-8 text-sm">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;

          return (
            <a
              key={item.id}
              href={item.target}
              ref={(el) => (itemRefs.current[item.id] = el)}
              onClick={(e) => handleClick(e, item)}
              className={`relative inline-block font-bold transition-colors duration-200 ${
                isActive ? "text-emerald-600" : "text-gray-900 hover:text-emerald-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </a>
          );
        })}

        {/* Garis bawah meluncur */}
        <span
          className={`pointer-events-none absolute -bottom-1 h-[2px] rounded-full bg-emerald-500
                      transition-[left,width,opacity] duration-300 ease-out
                      ${indicator.ready ? "opacity-100" : "opacity-0"}`}
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {/* Right side: Login atau Profile */}
      <div className="flex items-center gap-3" ref={dropdownWrapRef}>
        {ready && isAuthenticated ? (
          <LandingProfile
            profile={profile}
            firstName={firstName}
            open={openProfile}
            onToggle={() => setOpenProfile((v) => !v)}
            language={i18n.language}
            onChangeLanguage={(lng) => i18n.changeLanguage(lng)}
            onGoDashboard={() => {
              setOpenProfile(false);
              navigate("/dashboard");
            }}
            onLogout={async () => {
              try {
                await logout();
              } finally {
                setOpenProfile(false);
                navigate("/");
              }
            }}
            loaded={profileLoaded}
          />
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:brightness-110"
            style={{ background: "linear-gradient(to right, #5CC9AF, #5CC9BF)" }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

/* ================= LandingProfile ================= */
function LandingProfile({
  profile,
  firstName,
  open,
  onToggle,
  language,
  onChangeLanguage,
  onGoDashboard,
  onLogout,
  loaded,
}) {
  const plan = profile?.planName || profile?.package || profile?.subscription || "Gratis";

  const rawAvatar =
    profile?.avatar || profile?.photo || profile?.avatarUrl || profile?.image || null;

  const avatarUrl = rawAvatar ? resolveAvatarUrl(rawAvatar) : null;

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1
                   bg-white border border-emerald-100 shadow
                   hover:shadow-lg transition"
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          className="relative w-9 h-9 rounded-full p-[1.5px]"
          style={{ background: "linear-gradient(135deg, #5CC9AF 0%, #D7E96F 100%)" }}
          animate={open ? { scale: 1.04 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {!loaded ? (
              <span className="text-emerald-600 text-[11px] font-semibold">...</span>
            ) : rawAvatar ? (
              <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-emerald-600 text-[11px] font-semibold">
                {getInitials(profile?.name)}
              </span>
            )}
          </div>
        </motion.div>

        <div className="text-left leading-tight">
          <p className="text-[12px] font-semibold text-gray-900">{firstName}</p>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-[2px] rounded-full
                       bg-emerald-50 text-emerald-700 border border-emerald-100"
          >
            {plan}
          </span>
        </div>

        <motion.span
          className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className="absolute right-0 mt-2 w-[260px] rounded-xl border border-emerald-100
                       bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(92,201,175,.22)] overflow-hidden origin-top-right"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <div className="p-3 flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full ring-1 ring-emerald-200 overflow-hidden bg-white flex items-center justify-center">
                {rawAvatar ? (
                  <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-emerald-600 text-[11px] font-semibold">
                    {getInitials(profile?.name)}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 truncate">
                  {profile?.name || "Pengguna"}
                </p>
                {profile?.email && (
                  <p className="text-[11px] text-gray-500 truncate">{profile.email}</p>
                )}
              </div>

              <button
                onClick={onGoDashboard}
                className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full
                           bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
              >
                Dashboard
              </button>
            </div>

            <div className="h-px bg-emerald-100" />

            <div className="p-2">
              <DropdownItem
                icon={<HiOutlineHome size={16} />}
                label="Dashboard"
                sub="Kembali ke akun"
                onClick={onGoDashboard}
              />
              <LanguageSwitcher current={language} onChange={onChangeLanguage} />
              <DropdownItem
                icon={<HiOutlineArrowRightOnRectangle size={16} />}
                label="Keluar"
                danger
                onClick={onLogout}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({ icon, label, sub, onClick, danger }) {
  return (
    <motion.button
      onClick={onClick}
      role="menuitem"
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition
      ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-800 hover:bg-emerald-50"}`}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center border
        ${danger ? "border-red-100 bg-white" : "border-emerald-100 bg-white"}`}
      >
        {icon}
      </div>
      <div className="text-left leading-tight">
        <p className={`text-[12px] font-semibold ${danger ? "text-red-600" : "text-gray-900"}`}>
          {label}
        </p>
        {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
      </div>
    </motion.button>
  );
}

function LanguageSwitcher({ current, onChange }) {
  const langs = [
    { code: "id", label: "ID" },
    { code: "en", label: "EN" },
  ];
  return (
    <div className="px-2.5 py-2">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-100 bg-white">
          <HiOutlineGlobeAlt size={16} />
        </div>
        <p className="text-[12px] font-semibold text-gray-900">Bahasa</p>
      </div>
      <div className="flex gap-1.5 pl-10">
        {langs.map((l, idx) => (
          <motion.button
            key={l.code}
            onClick={() => onChange(l.code)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition
              ${
                current?.startsWith(l.code)
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-gray-700 border-emerald-200 hover:bg-emerald-50"
              }`}
            initial={{ y: 4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
              delay: 0.03 * idx,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {l.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
