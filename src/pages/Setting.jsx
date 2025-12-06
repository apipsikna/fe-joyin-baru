// src/pages/Setting.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { setAppLanguage } from "../i18n"; // ✅ helper global

const STORAGE_KEY = "joyin.settings.v1";
const LANG_KEY = "app_lang";

function safeLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeGetLang() {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}

export default function Setting({ onBack }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState("privacy");

  // ===== STATES =====
  // PRIVACY
  const [allowData, setAllowData] = useState(false);

  // NOTIF
  const [emailNotif, setEmailNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);
  const [freq, setFreq] = useState("real-time");

  // LANGUAGE & REGIONAL
  const [displayLang, setDisplayLang] = useState("id"); // "id" | "en" | "en-GB"
  const [timezone, setTimezone] = useState("tzJakarta");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [dateFormat, setDateFormat] = useState("mmdd");

  // MODALS
  const [showSessions, setShowSessions] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  // UI feedback (simple)
  const [toast, setToast] = useState({ show: false, type: "ok", text: "" });

  const [sessions] = useState([
    {
      id: "now",
      type: "desktop",
      name: "Chrome – Windows 10",
      now: true,
      location: "Balikpapan, Indonesia",
      activity: "Aktif 2 menit lalu",
    },
    {
      id: "iphone14",
      type: "mobile",
      name: "Safari – iPhone 14",
      now: false,
      location: "Bandung, Indonesia",
      activity: "Kemarin, 19:45",
    },
  ]);

  // Ink-bar (garis hijau)
  const tabsWrapRef = useRef(null);
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const tabs = [
    { id: "privacy", label: t("settings.tabs.privacy", { defaultValue: "Privasi" }) },
    { id: "notif", label: t("settings.tabs.notif", { defaultValue: "Notifikasi" }) },
    { id: "language", label: t("settings.tabs.language", { defaultValue: "Bahasa & Regional" }) },
    { id: "support", label: t("settings.tabs.support", { defaultValue: "Bantuan" }) },
  ];

  function measureIndicator(id = activeTab) {
    const wrap = tabsWrapRef.current;
    const el = tabRefs.current[id];
    if (!wrap || !el) return;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - wrapRect.left,
      width: elRect.width,
      ready: true,
    });
  }

  // ===== LOAD dari localStorage saat mount (tanpa paksa changeLanguage di sini) =====
  useEffect(() => {
    const saved = safeLoad();

    if (saved) {
      if (typeof saved.allowData === "boolean") setAllowData(saved.allowData);
      if (typeof saved.emailNotif === "boolean") setEmailNotif(saved.emailNotif);
      if (typeof saved.pushNotif === "boolean") setPushNotif(saved.pushNotif);
      if (typeof saved.smsNotif === "boolean") setSmsNotif(saved.smsNotif);
      if (typeof saved.freq === "string") setFreq(saved.freq);

      if (typeof saved.timezone === "string") setTimezone(saved.timezone);
      if (typeof saved.timeFormat === "string") setTimeFormat(saved.timeFormat);
      if (typeof saved.dateFormat === "string") setDateFormat(saved.dateFormat);
    }

    // ✅ DisplayLang: ambil dari app_lang (sumber utama), fallback ke i18n.language
    const lang = safeGetLang() || i18n.language;
    const normalized = lang?.startsWith("en") ? "en" : "id";
    setDisplayLang(normalized);

    const r = requestAnimationFrame(() => measureIndicator(activeTab));
    return () => cancelAnimationFrame(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    measureIndicator(activeTab);
  }, [activeTab, t]);

  useEffect(() => {
    function onResize() {
      measureIndicator(activeTab);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  // ===== PERSIST SETTINGS (bukan bahasa) =====
  useEffect(() => {
    const payload = {
      allowData,
      emailNotif,
      pushNotif,
      smsNotif,
      freq,
      // displayLang tidak wajib disimpan ke settings, karena sudah disimpan di app_lang
      timezone,
      timeFormat,
      dateFormat,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [allowData, emailNotif, pushNotif, smsNotif, freq, timezone, timeFormat, dateFormat]);

  // ===== Ganti bahasa GLOBAL (mengubah semua halaman) =====
  async function handleLangChange(next) {
    setDisplayLang(next);
    try {
      await setAppLanguage(next); // ✅ ini yang bikin seluruh app re-render
      showToast("ok", next?.startsWith("en") ? "Language changed to English" : "Bahasa diubah ke Indonesia");
    } catch {
      // fallback (kalau helper tidak ada)
      const normalized = next?.startsWith("en") ? "en" : "id";
      try {
        await i18n.changeLanguage(normalized);
      } catch { }
      document.documentElement.lang = normalized;
      try { localStorage.setItem(LANG_KEY, normalized); } catch { }
    }
  }

  function showToast(type, text) {
    setToast({ show: true, type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast((s) => ({ ...s, show: false })), 2600);
  }

  // ======= CONNECT: change password ke BE =======
  async function submitChangePassword(oldPassword, newPassword, confirmPassword) {
    const res = await api.put("/password/change", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return res?.data;
  }

  return (
    <div className="h-full w-full bg-white flex flex-col relative">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-[200]">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold ${toast.type === "err"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full px-6 md:px-10 pt-8">
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              aria-label={t("common.back", { defaultValue: "Kembali" })}
            >
              <IoChevronBack size={20} />
            </button>
          )}
          <h1 className="text-3xl font-bold">{t("settings.title", { defaultValue: "Pengaturan" })}</h1>
        </div>

        {/* Tabs */}
        <div className="relative w-full border-b border-black/10">
          <div ref={tabsWrapRef} className="flex gap-8 text-base md:text-lg font-semibold">
            {tabs.map((tItem) => (
              <button
                key={tItem.id}
                ref={(el) => (tabRefs.current[tItem.id] = el)}
                onClick={() => setActiveTab(tItem.id)}
                className={`py-3 transition-colors bg-transparent border-0 outline-none focus:outline-none ${activeTab === tItem.id ? "text-[#36A58C]" : "text-black/70 hover:text-black"
                  }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>
          <span
            className="absolute bottom-0 h-[3px] bg-[#36A58C] rounded-t-full transition-all duration-300"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.ready ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* Konten */}
      <div className="w-full flex-1 pb-10 px-6 md:px-10">
        {activeTab === "privacy" && (
          <div className="w-full mt-6 flex flex-col gap-8">
            <Row
              title={t("settings.privacy.blocked", { defaultValue: "Akun yang diblokir" })}
              desc={t("settings.privacy.blockedDesc", { defaultValue: "Kelola daftar akun yang diblokir." })}
              action={
                <LinkGhost
                  text={t("settings.privacy.viewList", { defaultValue: "Lihat daftar" })}
                  onClick={() => { }}
                />
              }
            />
            <Row
              title={t("settings.privacy.data", { defaultValue: "Izinkan penggunaan data" })}
              desc={t("settings.privacy.dataDesc", { defaultValue: "Izinkan data digunakan untuk peningkatan layanan." })}
              action={<Toggle checked={allowData} onChange={setAllowData} />}
            />
            <Row
              title={t("settings.privacy.sessions", { defaultValue: "Sesi aktif" })}
              desc={t("settings.privacy.sessionsDesc", { defaultValue: "Lihat perangkat yang sedang login." })}
              action={
                <LinkGhost
                  text={t("settings.privacy.viewList", { defaultValue: "Lihat daftar" })}
                  onClick={() => setShowSessions(true)}
                />
              }
            />
            <Row
              title={t("settings.privacy.password", { defaultValue: "Kata sandi" })}
              desc={t("settings.privacy.passwordDesc", { defaultValue: "Ubah kata sandi untuk keamanan akun." })}
              action={
                <button
                  className="px-5 py-2 rounded-xl bg-[#5CC9AF] text-white font-semibold hover:opacity-90"
                  onClick={() => setShowChangePass(true)}
                >
                  {t("settings.privacy.change", { defaultValue: "Ubah" })}
                </button>
              }
            />
          </div>
        )}

        {activeTab === "notif" && (
          <NotificationSection
            t={t}
            emailNotif={emailNotif}
            setEmailNotif={setEmailNotif}
            pushNotif={pushNotif}
            setPushNotif={setPushNotif}
            smsNotif={smsNotif}
            setSmsNotif={setSmsNotif}
            freq={freq}
            setFreq={setFreq}
          />
        )}

        {activeTab === "language" && (
          <LanguageRegionalSection
            t={t}
            displayLang={displayLang}
            setDisplayLang={handleLangChange} // ✅ global
            timezone={timezone}
            setTimezone={setTimezone}
            timeFormat={timeFormat}
            setTimeFormat={setTimeFormat}
            dateFormat={dateFormat}
            setDateFormat={setDateFormat}
          />
        )}

        {activeTab === "support" && <PlaceholderBox t={t} activeTab={activeTab} />}
      </div>

      {/* ====== Modal Sesi Aktif ====== */}
      {showSessions && (
        <SessionModal
          t={t}
          sessions={sessions}
          onClose={() => setShowSessions(false)}
          onLogout={async (id) => {
            if (id === "now") {
              await logout();
              navigate("/login", { replace: true });
              return;
            }
            showToast("err", t("settings.sessions.notSupported", { defaultValue: "Logout perangkat lain belum tersedia di backend." }));
          }}
          onLogoutAll={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        />
      )}

      {/* ====== Modal Ubah Kata Sandi (connect ke BE) ====== */}
      {showChangePass && (
        <ChangePasswordModal
          t={t}
          onClose={() => setShowChangePass(false)}
          onSubmit={async (oldPass, newPass, confirmPass) => {
            try {
              const data = await submitChangePassword(oldPass, newPass, confirmPass);
              showToast("ok", data?.message || t("settings.password.success", { defaultValue: "Password berhasil diubah." }));
              setShowChangePass(false);

              // opsional: paksa login ulang setelah change password
              await logout();
              navigate("/login", { replace: true });
            } catch (err) {
              const msg = err?.response?.data?.message || err?.message || t("settings.password.failed", { defaultValue: "Gagal mengubah password." });
              showToast("err", msg);
            }
          }}
        />
      )}
    </div>
  );
}

/* ===== Small UI pieces ===== */
function Row({ title, desc, action }) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
      <div className="min-w-0">
        <div className="text-xl font-extrabold">{title}</div>
        {desc && <p className="text-gray-600 mt-1 max-w-4xl">{desc}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function LinkGhost({ text, onClick }) {
  return (
    <button onClick={onClick} className="text-[#36A58C] font-semibold hover:underline">
      {text}
    </button>
  );
}

/** Toggle switch dengan BULAT PUTIH di dalamnya */
function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${checked ? "bg-[#36A58C]" : "bg-gray-300"
        }`}
    >
      <span
        className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );
}

/* ===== Notifikasi Section (tanpa container) ===== */
function NotificationSection({
  t,
  emailNotif,
  setEmailNotif,
  pushNotif,
  setPushNotif,
  smsNotif,
  setSmsNotif,
  freq,
  setFreq,
}) {
  return (
    <div className="w-full mt-6 space-y-8">
      <NotifRow
        title={t("settings.notif.email", { defaultValue: "Email" })}
        desc={t("settings.notif.emailDesc", { defaultValue: "Notifikasi melalui email." })}
        checked={emailNotif}
        onChange={setEmailNotif}
      />
      <NotifRow
        title={t("settings.notif.push", { defaultValue: "Push" })}
        desc={t("settings.notif.pushDesc", { defaultValue: "Notifikasi push di perangkat." })}
        checked={pushNotif}
        onChange={setPushNotif}
      />
      <NotifRow
        title={t("settings.notif.sms", { defaultValue: "SMS" })}
        desc={t("settings.notif.smsDesc", { defaultValue: "Notifikasi melalui SMS." })}
        checked={smsNotif}
        onChange={setSmsNotif}
      />

      <div className="pt-2">
        <div className="text-lg md:text-xl font-extrabold mb-3">
          {t("settings.notif.freq", { defaultValue: "Frekuensi" })}
        </div>
        <div className="max-w-md">
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 pr-10 text-gray-800 focus:outline-none"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
            >
              <option value="real-time">{t("settings.notif.rt", { defaultValue: "Real-time" })}</option>
              <option value="15m">{t("settings.notif.m15", { defaultValue: "Setiap 15 menit" })}</option>
              <option value="hourly">{t("settings.notif.hourly", { defaultValue: "Per jam" })}</option>
              <option value="daily">{t("settings.notif.daily", { defaultValue: "Harian" })}</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifRow({ title, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
      <div className="min-w-0">
        <div className="text-lg md:text-xl font-extrabold">{title}</div>
        <p className="text-gray-600 mt-1 max-w-3xl">{desc}</p>
      </div>
      <div className="shrink-0">
        <Toggle checked={checked} onChange={onChange} ariaLabel={title} />
      </div>
    </div>
  );
}

/* ===== Bahasa & Regional Section (tanpa container) ===== */
function LanguageRegionalSection({
  t,
  displayLang,
  setDisplayLang,
  timezone,
  setTimezone,
  timeFormat,
  setTimeFormat,
  dateFormat,
  setDateFormat,
}) {
  return (
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-10">
          <FieldBlock
            title={t("settings.lang.display", { defaultValue: "Bahasa" })}
            helper={t("settings.lang.displayHelp", { defaultValue: "Pilih bahasa tampilan." })}
          >
            <Select value={displayLang} onChange={setDisplayLang}>
              <option value="id">{t("settings.lang.opt.id", { defaultValue: "Indonesia" })}</option>
              <option value="en">{t("settings.lang.opt.enUS", { defaultValue: "English (US)" })}</option>
              <option value="en-GB">{t("settings.lang.opt.enGB", { defaultValue: "English (UK)" })}</option>
            </Select>
          </FieldBlock>

          <FieldBlock
            title={t("settings.lang.timezone", { defaultValue: "Zona waktu" })}
            helper={t("settings.lang.timezoneHelp", { defaultValue: "Pilih zona waktu." })}
          >
            <Select value={timezone} onChange={setTimezone}>
              <option value="tzJakarta">{t("settings.lang.opt.tzJakarta", { defaultValue: "Jakarta (WIB)" })}</option>
              <option value="tzMakassar">{t("settings.lang.opt.tzMakassar", { defaultValue: "Makassar (WITA)" })}</option>
              <option value="tzTokyo">{t("settings.lang.opt.tzTokyo", { defaultValue: "Tokyo (JST)" })}</option>
              <option value="tzSydney">{t("settings.lang.opt.tzSydney", { defaultValue: "Sydney (AEST)" })}</option>
              <option value="tzLondon">{t("settings.lang.opt.tzLondon", { defaultValue: "London (GMT)" })}</option>
              <option value="tzNY">{t("settings.lang.opt.tzNY", { defaultValue: "New York (ET)" })}</option>
            </Select>
          </FieldBlock>
        </div>

        <div className="space-y-10">
          <FieldBlock
            title={t("settings.lang.timeFormat", { defaultValue: "Format waktu" })}
            helper={t("settings.lang.timeFormatHelp", { defaultValue: "Pilih 12/24 jam." })}
          >
            <div className="flex items-center gap-8 mt-1">
              <Radio
                label={t("settings.lang.f12", { defaultValue: "12 jam" })}
                checked={timeFormat === "12h"}
                onChange={() => setTimeFormat("12h")}
              />
              <Radio
                label={t("settings.lang.f24", { defaultValue: "24 jam" })}
                checked={timeFormat === "24h"}
                onChange={() => setTimeFormat("24h")}
              />
            </div>
          </FieldBlock>

          <FieldBlock
            title={t("settings.lang.dateFormat", { defaultValue: "Format tanggal" })}
            helper={t("settings.lang.dateFormatHelp", { defaultValue: "Pilih format tanggal." })}
          >
            <Select value={dateFormat} onChange={setDateFormat}>
              <option value="mmdd">{t("settings.lang.opt.dateMMDD", { defaultValue: "MM/DD" })}</option>
              <option value="ddmm">{t("settings.lang.opt.dateDDMM", { defaultValue: "DD/MM" })}</option>
              <option value="iso">{t("settings.lang.opt.dateISO", { defaultValue: "YYYY-MM-DD" })}</option>
            </Select>
          </FieldBlock>
        </div>
      </div>
    </div>
  );
}

function FieldBlock({ title, helper, children }) {
  return (
    <div>
      <div className="text-lg md:text-xl font-extrabold">{title}</div>
      {helper && <p className="text-gray-600 mt-1 mb-3">{helper}</p>}
      {children}
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <div className="relative max-w-xl">
      <select
        className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 pr-10 text-gray-800 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        ▾
      </span>
    </div>
  );
}

/* Radio polos, transparan */
function Radio({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-3 select-none bg-transparent p-0 border-0 shadow-none hover:bg-transparent active:bg-transparent focus:outline-none focus:ring-0"
      style={{ WebkitAppearance: "none", appearance: "none" }}
    >
      <span
        className={`inline-flex h-4 w-4 rounded-full border ${checked ? "border-[#36A58C]" : "border-gray-400"
          } items-center justify-center`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${checked ? "bg-[#36A58C]" : "bg-transparent"}`} />
      </span>
      <span className="text-gray-800">{label}</span>
    </button>
  );
}

function PlaceholderBox({ t, activeTab }) {
  const label =
    activeTab === "notif"
      ? t("settings.placeholder.notif", { defaultValue: "Notifikasi" })
      : activeTab === "language"
        ? t("settings.placeholder.language", { defaultValue: "Bahasa" })
        : t("settings.placeholder.support", { defaultValue: "Bantuan" });
  return (
    <div className="w-full mt-6 text-gray-600">
      <div className="text-xl font-semibold mb-2">{label}</div>
      <p>{t("settings.placeholder.missing", { defaultValue: "Konten akan ditambahkan." })}</p>
    </div>
  );
}

/* ======= Modal: Sesi Aktif ======= */
function SessionModal({ t, sessions, onClose, onLogout, onLogoutAll }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-3xl">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-black/10">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-[#36A58C]"
          >
            <IoClose size={22} />
          </button>

          <h3 className="text-3xl font-extrabold mb-2">
            {t("settings.sessions.title", { defaultValue: "Sesi Aktif" })}
          </h3>
          <p className="text-gray-600 mb-6">
            {t("settings.sessions.subtitle", {
              defaultValue:
                "Berikut daftar perangkat yang sedang login. Jika ada yang tidak dikenali, segera keluar untuk menjaga keamanan akun Anda",
            })}
          </p>

          <div className="space-y-6">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-gray-700">
                    {s.type === "desktop" ? <FiMonitor size={22} /> : <FiSmartphone size={22} />}
                  </span>
                  <div>
                    <div className="text-lg font-extrabold">
                      {s.name}{" "}
                      {s.now && (
                        <span className="font-semibold text-gray-400">
                          ({t("settings.sessions.now", { defaultValue: "Sekarang" })})
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">
                      {s.location}
                      <span className="mx-2">•</span>
                      {s.activity}
                    </div>
                  </div>
                </div>

                <button onClick={() => onLogout?.(s.id)} className="text-red-500 font-semibold hover:underline">
                  {t("settings.sessions.logout", { defaultValue: "Logout" })}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button onClick={onLogoutAll} className="text-red-500 font-semibold hover:underline">
              {t("settings.sessions.logoutAll", { defaultValue: "Logout Semua Perangkat" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======= Modal: Ubah Kata Sandi ======= */
function ChangePasswordModal({ t, onClose, onSubmit }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const minOk = newPass.length >= 8;
  const matchOk = newPass === confirmPass;
  const canSave = oldPass.length >= 1 && minOk && matchOk && !loading;

  async function handleSave() {
    if (!canSave) return;
    setLoading(true);
    try {
      await onSubmit?.(oldPass, newPass, confirmPass);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-black/10">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-[#7CC9B7]"
            disabled={loading}
          >
            <IoClose size={22} />
          </button>

          <h3 className="text-3xl font-extrabold mb-2">
            {t("settings.password.title", { defaultValue: "Ubah Kata Sandi" })}
          </h3>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {t("settings.password.subtitle", {
              defaultValue:
                "Silakan masukkan kata sandi lama Anda, lalu buat kata sandi baru yang lebih kuat. Minimal 8 karakter.",
            })}
          </p>

          <div className="space-y-4">
            <input
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder={t("settings.password.old", { defaultValue: "Password lama" })}
              className="w-full max-w-xl rounded-xl border border-black/10 px-4 py-3 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36A58C]/40"
            />

            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder={t("settings.password.new", { defaultValue: "Password baru (min 8)" })}
              className="w-full max-w-xl rounded-xl border border-black/10 px-4 py-3 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36A58C]/40"
            />

            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder={t("settings.password.confirm", { defaultValue: "Konfirmasi password baru" })}
              className="w-full max-w-xl rounded-xl border border-black/10 px-4 py-3 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36A58C]/40"
            />

            {!minOk && newPass.length > 0 && (
              <p className="text-sm text-red-600 font-semibold">
                {t("settings.password.min", { defaultValue: "Password baru minimal 8 karakter." })}
              </p>
            )}
            {minOk && confirmPass.length > 0 && !matchOk && (
              <p className="text-sm text-red-600 font-semibold">
                {t("settings.password.match", { defaultValue: "Konfirmasi password tidak sama." })}
              </p>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              disabled={!canSave}
              onClick={handleSave}
              className={`h-10 px-6 rounded-lg font-semibold transition ${canSave ? "bg-[#5CC9AF] text-white hover:opacity-90" : "bg-gray-300 text-white cursor-not-allowed"
                }`}
            >
              {loading ? t("common.saving", { defaultValue: "Menyimpan..." }) : t("settings.password.save", { defaultValue: "Simpan" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
