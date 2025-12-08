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
        className="group flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1
                   bg-white/80 backdrop-blur border border-emerald-100 shadow
                   hover:shadow-lg transition"
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          className="relative w-8 h-8 rounded-full p-[1.5px]"
          style={{
            background: "linear-gradient(135deg, #5CC9AF 0%, #D7E96F 100%)",
          }}
          animate={open ? { scale: 1.04 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {rawAvatar ? (
              <img
                src={avatarUrl}
                alt={firstName}
                className="w-full h-full object-cover rounded-full"
              />
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
          className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={dropdownId}
            role="menu"
            className="absolute right-0 mt-2 w-[260px] rounded-xl border border-emerald-100
                       bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(92,201,175,.22)] overflow-hidden origin-top-right"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <div className="p-3 flex items-center gap-2.5">
              <motion.div
                className="w-9 h-9 rounded-full ring-1 ring-emerald-200 overflow-hidden bg-white flex items-center justify-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 24,
                  delay: 0.02,
                }}
              >
                {rawAvatar ? (
                  <img
                    src={avatarUrl}
                    alt={firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-emerald-600 text-[11px] font-semibold">
                    {getInitials(profile?.name)}
                  </span>
                )}
              </motion.div>

              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 truncate">
                  {profile?.name || "Pengguna"}
                </p>
                {profile?.email && (
                  <p className="text-[11px] text-gray-500 truncate">
                    {profile.email}
                  </p>
                )}
              </div>

              <button
                onClick={onShowProfile}
                className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full
                           bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
              >
                Profil
              </button>
            </div>

            <div className="h-px bg-emerald-100" />

            <div className="p-2">
              <DropdownItem
                icon={<HiOutlineCog6Tooth size={16} />}
                label="Pengaturan"
                sub="Bahasa & preferensi"
                onClick={onGoSettings}
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
      ${danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-800 hover:bg-emerald-50"
        }`}
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
        <p
          className={`text-[12px] font-semibold ${danger ? "text-red-600" : "text-gray-900"
            }`}
        >
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
