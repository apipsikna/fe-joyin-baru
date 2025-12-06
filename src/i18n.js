// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// kamu bisa pecah file json, ini contoh minimal
const resources = {
  id: {
    translation: {
      common: { back: "Kembali" },
      settings: {
        title: "Pengaturan",
        tabs: { privacy: "Privasi", notif: "Notifikasi", language: "Bahasa & Regional", support: "Bantuan" },
      },
      dashboard: {
        sidebar: { home: "Beranda", chat: "Obrolan", botSettings: "Pengaturan Bot", reports: "Laporan", packages: "Paket Saya", referral: "Referral", backToLanding: "Kembali ke Beranda" },
      },
    },
  },
  en: {
    translation: {
      common: { back: "Back" },
      settings: {
        title: "Settings",
        tabs: { privacy: "Privacy", notif: "Notifications", language: "Language & Region", support: "Support" },
      },
      dashboard: {
        sidebar: { home: "Home", chat: "Chat", botSettings: "Bot Settings", reports: "Reports", packages: "My Packages", referral: "Referral", backToLanding: "Back to Home" },
      },
    },
  },
};

const STORAGE_KEY = "app_lang";

const saved = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
})();

const initialLang = saved || (navigator.language?.startsWith("en") ? "en" : "id");

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "id",
  interpolation: { escapeValue: false },
});

export const setAppLanguage = async (lng) => {
  const normalized = lng?.startsWith("en") ? "en" : "id";
  await i18n.changeLanguage(normalized);
  document.documentElement.lang = normalized;
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch { }
};

export default i18n;
