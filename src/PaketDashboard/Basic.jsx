// src/PaketDashboard/Basic.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineCog6Tooth,
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowRightOnRectangle,
  HiOutlineGlobeAlt,
  HiOutlineShare,
  HiOutlineGift, // ✅ Added for Rewards
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileModal from "../components/profile/ProfileModal";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { resolveAvatarUrl } from "../utils/avatar";

// Pages
import Home from "../pages/Home";
import Setting from "../pages/Setting";
import MyPackagesBasic from "./SectionBasic/MyPackagesBasic";
import BotSettingsBasic from "./SectionBasic/BotSettingsBasic";
import ObrolanBasic from "./SectionBasic/ObrolanBasic";
import ReportBasic from "./SectionBasic/ReportBasic";

// ✅ NEW: Referral Basic page
import ReferralBasic from "./SectionBasic/ReferralBasic";
// ✅ NEW: Rewards import
import RewardsDashboard from "./SectionReward/RewardsDashboard";

// ===== Menu keys
const MENU = {
  HOME: "home",
  CHAT: "chat",
  BOT_SETTINGS: "bot_settings",
  REPORTS: "reports",
  PACKAGES: "packages",
  REFERRAL: "referral",
  REWARDS: "rewards", // ✅ NEW
  SETTINGS: "settings",
};

// ===== Util kecil
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { fetchMe, ready, isAuthenticated, logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState(MENU.HOME);

  const dropdownRef = useRef();

  // Fetch profil — menunggu ready && isAuthenticated
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ready) return;

      if (!isAuthenticated) {
        if (!cancelled) {
          setProfile({});
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetchMe();
        const user = res?.data?.user ?? res?.data ?? res;
        if (!cancelled) setProfile(user || {});
      } catch (err) {
        if (!cancelled)
          setError(
            err?.message ||
            t("dashboard.errorLoadProfile", {
              defaultValue: "Failed to load profile",
            })
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, fetchMe, t]);

  // Tutup dropdown saat klik di luar / tekan Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const firstName = useMemo(
    () => (profile?.name || "Pengguna").split(" ")[0],
    [profile?.name]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="flex font-poppins h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        t={t}
        onGoLanding={() => navigate("/")} // ✅ FIX
      />

      {/* Main Content */}
      <div
        className="flex-1 relative overflow-auto overflow-x-hidden"
        style={{ background: "linear-gradient(to right, #5CC9AF, #D7E96F)" }}
      >
        {/* Profile Top Right */}
        <div
          className="fixed top-2.5 right-6 md:right-8 z-50"
          ref={dropdownRef}
        >
          <TopRightProfile
            profile={profile}
            firstName={firstName}
            language={i18n.language}
            open={showDropdown}
            onToggle={() => setShowDropdown((s) => !s)}
            onShowProfile={() => {
              setShowProfileModal(true);
              setShowDropdown(false);
            }}
            onGoSettings={() => {
              setActiveMenu(MENU.SETTINGS);
              setShowDropdown(false);
            }}
            onChangeLanguage={(lng) => {
              i18n.changeLanguage(lng);
            }}
            onLogout={async () => {
              try {
                await logout();
              } finally {
                setShowDropdown(false);
              }
            }}
          />
        </div>

        {/* Render Page */}
        {activeMenu === MENU.HOME && <Home profile={profile} />}
        {activeMenu === MENU.CHAT && <ObrolanBasic profile={profile} />}
        {activeMenu === MENU.BOT_SETTINGS && (
          <BotSettingsBasic profile={profile} />
        )}
        {activeMenu === MENU.REPORTS && <ReportBasic profile={profile} />}
        {activeMenu === MENU.PACKAGES && <MyPackagesBasic />}
        {/* ✅ Referral sekarang mengarah ke: src/PaketDashboard/SectionBasic/ReferralBasic.jsx */}
        {activeMenu === MENU.REFERRAL && <ReferralBasic profile={profile} />}
        {activeMenu === MENU.REWARDS && <RewardsDashboard profile={profile} />}
        {activeMenu === MENU.SETTINGS && (
          <Setting onBack={() => setActiveMenu(MENU.HOME)} />
        )}

        {/* Modal Profile */}
        {showProfileModal && (
          <ProfileModal
            profile={profile}
            setProfile={setProfile}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ================= Sidebar ================= */
function Sidebar({ activeMenu, setActiveMenu, t, onGoLanding }) {
  return (
    <aside className="w-[240px] bg-white p-4 shadow-lg border-r flex flex-col items-center">
      <img src={logo} alt="logo" className="w-24 mb-6 mt-2" />

      <SidebarButton
        icon={HiOutlineHome}
        text={t("dashboard.sidebar.home", { defaultValue: "Beranda" })}
        active={activeMenu === MENU.HOME}
        onClick={() => setActiveMenu(MENU.HOME)}
      />
      <SidebarButton
        icon={HiOutlineChatBubbleLeftRight}
        text={t("dashboard.sidebar.chat", { defaultValue: "Obrolan" })}
        active={activeMenu === MENU.CHAT}
        onClick={() => setActiveMenu(MENU.CHAT)}
      />
      <SidebarButton
        icon={HiOutlineCog6Tooth}
        text={t("dashboard.sidebar.botSettings", {
          defaultValue: "Pengaturan Bot",
        })}
        active={activeMenu === MENU.BOT_SETTINGS}
        onClick={() => setActiveMenu(MENU.BOT_SETTINGS)}
      />
      <SidebarButton
        icon={HiOutlineDocumentText}
        text={t("dashboard.sidebar.reports", { defaultValue: "Laporan" })}
        active={activeMenu === MENU.REPORTS}
        onClick={() => setActiveMenu(MENU.REPORTS)}
      />
      <SidebarButton
        icon={HiOutlineCube}
        text={t("dashboard.sidebar.packages", { defaultValue: "Paket Saya" })}
        active={activeMenu === MENU.PACKAGES}
        onClick={() => setActiveMenu(MENU.PACKAGES)}
      />

      <SidebarButton
        icon={HiOutlineGift}
        text="Rewards"
        active={activeMenu === MENU.REWARDS}
        onClick={() => setActiveMenu(MENU.REWARDS)}
      />

      {/* ✅ Ini tombol Referral (mengarah ke ReferralBasic via activeMenu) */}
      <SidebarButton
        icon={HiOutlineShare}
        text={t("dashboard.sidebar.referral", { defaultValue: "Referral" })}
        active={activeMenu === MENU.REFERRAL}
        onClick={() => setActiveMenu(MENU.REFERRAL)}
      />

      <div className="mt-auto w-full pt-3">
        <div className="h-px bg-gray-100 mb-3" />
        <SidebarButton
          icon={HiOutlineHome}
          text={t("dashboard.sidebar.backToLanding", {
            defaultValue: "Kembali ke Beranda",
          })}
          active={false}
          onClick={onGoLanding}
          landing
        />
      </div>
    </aside>
  );
}

function SidebarButton({ icon: Icon, text, active, onClick, landing }) {
  return (
    <button
      onClick={onClick}
      className={[
        "group w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition mb-2",
        active
          ? "bg-[#5CC9AF] text-white shadow-sm"
          : landing
            ? "text-emerald-700 hover:bg-emerald-50 border border-emerald-100"
            : "text-gray-600 hover:bg-gray-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
      ].join(" ")}
    >
      <span
        className={[
          "w-9 h-9 rounded-xl flex items-center justify-center border transition shrink-0",
          active
            ? "bg-white/20 border-white/20"
            : landing
              ? "bg-emerald-50 border-emerald-100"
              : "bg-gray-50 border-gray-100 group-hover:bg-gray-100",
        ].join(" ")}
      >
        <Icon
          size={18}
          className={
            active ? "text-white" : landing ? "text-emerald-700" : "text-gray-600"
          }
        />
      </span>

      <span className="tracking-wide">{text}</span>
    </button>
  );
}

/* ================= TopRightProfile ================= */
/* ================= TopRightProfile (Redesigned: Simple & Premium) ================= */
import { HiChevronDown } from "react-icons/hi2";

function TopRightProfile({
  profile,
  firstName,
  language,
  open,
  onToggle,
  onShowProfile,
  onGoSettings,
  onChangeLanguage,
  onLogout,
}) {
  const plan =
    profile?.planName || profile?.package || profile?.subscription || "Gratis";

  const rawAvatar =
    profile?.avatar ||
    profile?.photo ||
    profile?.avatarUrl ||
    profile?.image ||
    null;

  const avatarUrl = rawAvatar ? resolveAvatarUrl(rawAvatar) : null;
  const dropdownId = "profile-dropdown";

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={dropdownId}
        className="group flex items-center gap-2 p-1 pr-2.5 rounded-full
                   bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100
                   hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
        whileTap={{ scale: 0.96 }}
      >
        {/* Avatar Circle */}
        <div className="relative w-8 h-8 rounded-full bg-gray-50 p-[2px] ring-1 ring-gray-100 group-hover:ring-emerald-200 transition-all">
          <div className="w-full h-full rounded-full bg-white overflow-hidden">
            {rawAvatar ? (
              <img
                src={avatarUrl}
                alt={firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-emerald-600 font-bold text-[10px]">
                {getInitials(profile?.name)}
              </div>
            )}
          </div>
        </div>

        {/* Simple Chevron */}
        <HiChevronDown
          className={`w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={dropdownId}
            role="menu"
            className="absolute right-0 mt-3 w-[240px] rounded-2xl border border-white/40
                       bg-white/80 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden origin-top-right z-50"
            initial={{ opacity: 0, y: -10, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.96, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header Dropdown */}
            <div className="p-4 flex items-center gap-3 bg-white/50 border-b border-white/40">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shadow-sm shrink-0">
                {rawAvatar ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xs">
                    {getInitials(profile?.name)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-800 truncate leading-tight">
                  {profile?.name || "Pengguna"}
                </p>
                <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
                  {profile?.email || "No Email"}
                </p>
              </div>
            </div>

            <div className="p-2 space-y-1">
              <DropdownItem
                icon={<HiOutlineChatBubbleLeftRight size={16} />}
                label="Profil Saya"
                onClick={onShowProfile}
              />

              <DropdownItem
                icon={<HiOutlineCog6Tooth size={16} />}
                label="Pengaturan"
                onClick={onGoSettings}
              />

              <div className="px-2 py-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Bahasa</p>
                <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-100">
                  {['id', 'en'].map((code) => (
                    <button
                      key={code}
                      onClick={() => onChangeLanguage(code)}
                      className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all ${language?.startsWith(code)
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 my-1 mx-2" />

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
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 overflow-hidden group
      ${danger
          ? "hover:bg-red-50 text-red-600"
          : "hover:bg-black/5 text-gray-700 hover:text-gray-900"
        }`}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
        ${danger
            ? "bg-red-100 text-red-500 group-hover:bg-red-200"
            : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-emerald-500 group-hover:shadow-sm"}`}
      >
        {icon}
      </div>
      <div className="text-left">
        <p className="text-[13px] font-bold leading-none mb-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 font-medium group-hover:text-gray-500">{sub}</p>}
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
              ${current?.startsWith(l.code)
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
