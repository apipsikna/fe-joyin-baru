// src/components/dashboard/ProfileDropdown.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { resolveAvatarUrl } from "../../utils/avatar";

export function ProfileDropdown({
  showDropdown,
  setShowDropdown,
  onShowProfile,
  onGoSettings, // tetap ada
  onLogout, // opsional
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = user?.avatar ? resolveAvatarUrl(user.avatar) : null;
  console.log("[ProfileDropdown] user.avatar =", user?.avatar, "=>", avatarUrl);

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setShowDropdown(false);
      if (typeof onLogout === "function") {
        onLogout();
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className="relative">
      {/* Tombol profile */}
      <div
        className="cursor-pointer bg-white rounded-full flex items-center gap-3 px-3 py-2 shadow"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-2xl">
            <FaUser />
          </span>
        )}
        {/* Panah kecil */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            showDropdown ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu dengan animasi */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl py-3 w-56 z-50"
          >
            <DropdownItem
              icon={<FaUser />}
              label="Profile"
              onClick={() => {
                onShowProfile?.();
                setShowDropdown(false);
              }}
            />
            <DropdownItem
              icon={<FaCog />}
              label="Pengaturan"
              onClick={() => {
                onGoSettings?.();
                setShowDropdown(false);
              }}
            />
            <DropdownItem
              icon={<FaSignOutAlt />}
              label="Logout"
              isLogout
              onClick={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({ icon, label, isLogout, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition hover:bg-gray-100 ${
        isLogout ? "text-red-500 font-semibold" : "text-gray-700"
      }`}
    >
      <span className={`text-lg ${isLogout ? "text-red-500" : "text-gray-500"}`}>
        {icon}
      </span>
      <span className="text-base">{label}</span>
    </div>
  );
}
