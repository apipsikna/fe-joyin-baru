// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "id",
    interpolation: { escapeValue: false },
    detection: {
      // kita sinkronkan dengan localStorage di Setting.jsx juga
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    resources: {
      id: {
        translation: {
          common: {
            back: "Kembali",
          },
          settings: {
            title: "Pengaturan",
            tabs: {
              privacy: "Privasi & Keamanan",
              notif: "Notifikasi",
              language: "Bahasa & Regional",
              support: "Bantuan & Dukungan",
            },
            privacy: {
              blocked: "Nomor yang Diblokir",
              blockedDesc: "Kelola daftar nomor yang anda blokir",
              data: "Izin Data",
              dataDesc: "Izinkan Chatbot menyimpan riwayat chat",
              sessions: "Sesi Aktif",
              sessionsDesc: "Lihat dan kelola perangkat yang sedang login",
              password: "Ubah Kata Sandi",
              passwordDesc:
                "Untuk alasan keamanan, Anda dapat mengubah kata sandi akun Anda, terutama jika Anda melupakannya.",
              viewList: "Lihat Daftar",
              change: "Ubah",
            },
            notif: {
              email: "Notifikasi Email",
              emailDesc: "Terima notifikasi melalui email",
              push: "Push Notifications",
              pushDesc:
                "Terima pemberitahuan langsung dari website, meskipun Anda tidak sedang membukanya",
              sms: "SMS Notifications",
              smsDesc: "Terima notifikasi penting via SMS",
              freq: "Frekuensi Notifikasi",
              rt: "Real-time",
              m15: "Setiap 15 menit",
              hourly: "Setiap Jam",
              daily: "Harian (Ringkasan)",
            },
            lang: {
              display: "Bahasa Tampilan",
              displayHelp: "Pilih bahasa yang ingin digunakan",
              timezone: "Zona Waktu",
              timezoneHelp:
                "Waktu dan jadwal akan mengikuti zona waktu ini.",
              timeFormat: "Format Waktu",
              timeFormatHelp:
                "Pilih gaya penulisan jam yang Anda inginkan.",
              f12: "12 Jam (AM/PM)",
              f24: "24 Jam",
              dateFormat: "Format Tanggal",
              dateFormatHelp:
                "Tentukan urutan hari, bulan, dan tahun.",
              opt: {
                id: "Bahasa Indonesia",
                enUS: "English (US)",
                enGB: "English (UK)",
                tzJakarta: "GMT+7 - Asia/Jakarta",
                tzMakassar: "GMT+8 - Asia/Makassar",
                tzTokyo: "GMT+9 - Asia/Tokyo",
                tzSydney: "GMT+10 - Australia/Sydney",
                tzLondon: "GMT+0 - Europe/London",
                tzNY: "GMT-5 - America/New York",
                dateMMDD: "MM/DD/YYYY",
                dateDDMM: "DD/MM/YYYY",
                dateISO: "YYYY-MM-DD",
              },
            },
            placeholder: {
              notif: "Pengaturan Notifikasi",
              language: "Bahasa & Regional",
              support: "Bantuan & Dukungan",
              missing:
                "Konten untuk tab ini belum dibuat. Silakan tambahkan sesuai kebutuhan.",
            },
          },
        },
      },
      en: {
        translation: {
          common: {
            back: "Back",
          },
          settings: {
            title: "Settings",
            tabs: {
              privacy: "Privacy & Security",
              notif: "Notifications",
              language: "Language & Regional",
              support: "Help & Support",
            },
            privacy: {
              blocked: "Blocked Numbers",
              blockedDesc: "Manage the numbers you have blocked",
              data: "Data Permission",
              dataDesc: "Allow Chatbot to save chat history",
              sessions: "Active Sessions",
              sessionsDesc:
                "View and manage devices that are currently logged in",
              password: "Change Password",
              passwordDesc:
                "For security, you can change your account password, especially if you've forgotten it.",
              viewList: "View List",
              change: "Change",
            },
            notif: {
              email: "Email Notifications",
              emailDesc: "Receive notifications via email",
              push: "Push Notifications",
              pushDesc:
                "Get notifications directly from the website, even when you're not viewing it",
              sms: "SMS Notifications",
              smsDesc: "Receive important notifications via SMS",
              freq: "Notification Frequency",
              rt: "Real-time",
              m15: "Every 15 minutes",
              hourly: "Hourly",
              daily: "Daily (Digest)",
            },
            lang: {
              display: "Display Language",
              displayHelp: "Choose the language to use",
              timezone: "Time Zone",
              timezoneHelp:
                "Times and schedules will follow this time zone.",
              timeFormat: "Time Format",
              timeFormatHelp: "Choose your preferred time style.",
              f12: "12-Hour (AM/PM)",
              f24: "24-Hour",
              dateFormat: "Date Format",
              dateFormatHelp:
                "Choose the order of day, month, and year.",
              opt: {
                id: "Indonesian",
                enUS: "English (US)",
                enGB: "English (UK)",
                tzJakarta: "GMT+7 - Asia/Jakarta",
                tzMakassar: "GMT+8 - Asia/Makassar",
                tzTokyo: "GMT+9 - Asia/Tokyo",
                tzSydney: "GMT+10 - Australia/Sydney",
                tzLondon: "GMT+0 - Europe/London",
                tzNY: "GMT-5 - America/New York",
                dateMMDD: "MM/DD/YYYY",
                dateDDMM: "DD/MM/YYYY",
                dateISO: "YYYY-MM-DD",
              },
            },
            placeholder: {
              notif: "Notification Settings",
              language: "Language & Regional",
              support: "Help & Support",
              missing:
                "Content for this tab has not been created yet. Please add as needed.",
            },
          },
        },
      },
    },
  });

export default i18n;
