import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiOutlineCog6Tooth,
    HiOutlineArrowRightOnRectangle,
    HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { resolveAvatarUrl } from "../../utils/avatar";

// ===== Util kecil internal
const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join("") || "U";

export default function TopRightProfile({
    t,
    profile,
    firstName,
    language,
    open,
    onToggle,
    onShowProfile,
    onGoSettings,
    onChangeLanguage,
    onLogout,
    showSettings = true, // New prop
}) {
    // Logic label plan/role
    let planLabel = t("dashboard.profile.planFree", { defaultValue: "Gratis" });

    if (profile?.role === "ADMIN" || profile?.role === "admin") {
        planLabel = "Admin";
    } else {
        planLabel =
            profile?.planName ||
            profile?.package ||
            profile?.subscription ||
            profile?.plan ||
            t("dashboard.profile.planFree", { defaultValue: "Gratis" });
    }

    const rawAvatar =
        profile?.avatar ||
        profile?.photo ||
        profile?.avatarUrl ||
        profile?.image ||
        null;

    const avatarUrl = rawAvatar ? resolveAvatarUrl(rawAvatar) : null;
    const dropdownId = "profile-dropdown";

    // Gunakan nama depan jika firstName belum diproses
    const displayFirstName = firstName || (profile?.name || "User").split(" ")[0];

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
                                alt={displayFirstName}
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
                    <p className="text-[12px] font-semibold text-gray-900">{displayFirstName}</p>
                    <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-[2px] rounded-full
                           bg-emerald-50 text-emerald-700 border border-emerald-100"
                    >
                        {planLabel}
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
                                        alt={displayFirstName}
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
                                    {profile?.name ||
                                        t("dashboard.profile.defaultName", { defaultValue: "Pengguna" })}
                                </p>
                                {profile?.email && (
                                    <p className="text-[11px] text-gray-500 truncate">
                                        {profile.email}
                                    </p>
                                )}
                            </div>

                            {onShowProfile && (
                                <button
                                    onClick={onShowProfile}
                                    className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full
                             bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                                >
                                    {t("dashboard.profile.viewProfile", { defaultValue: "Profil" })}
                                </button>
                            )}
                        </div>

                        <div className="h-px bg-emerald-100" />

                        <div className="p-2">
                            {showSettings && (
                                <DropdownItem
                                    icon={<HiOutlineCog6Tooth size={16} />}
                                    label={t("dashboard.dropdown.settings", {
                                        defaultValue: "Pengaturan",
                                    })}
                                    sub={t("dashboard.dropdown.settingsSub", {
                                        defaultValue: "Bahasa & preferensi",
                                    })}
                                    onClick={onGoSettings}
                                />
                            )}
                            <LanguageSwitcher
                                t={t}
                                current={language}
                                onChange={onChangeLanguage}
                            />
                            <DropdownItem
                                icon={<HiOutlineArrowRightOnRectangle size={16} />}
                                label={t("dashboard.dropdown.logout", { defaultValue: "Keluar" })}
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

function LanguageSwitcher({ t, current, onChange }) {
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
                <p className="text-[12px] font-semibold text-gray-900">
                    {t("dashboard.dropdown.language", { defaultValue: "Bahasa" })}
                </p>
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
