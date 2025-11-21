// src/pages/Setting.jsx
import React, { useEffect, useRef, useState } from "react";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "joyin.settings.v1";

function safeLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Setting({ onBack }) {
  const { t, i18n } = useTranslation();

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
    { id: "privacy", label: t("settings.tabs.privacy") },
    { id: "notif", label: t("settings.tabs.notif") },
    { id: "language", label: t("settings.tabs.language") },
    { id: "support", label: t("settings.tabs.support") },
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

  // ===== LOAD dari localStorage saat mount + sinkron bahasa awal =====
  useEffect(() => {
    const saved = safeLoad();

    if (saved) {
      if (typeof saved.allowData === "boolean") setAllowData(saved.allowData);
      if (typeof saved.emailNotif === "boolean") setEmailNotif(saved.emailNotif);
      if (typeof saved.pushNotif === "boolean") setPushNotif(saved.pushNotif);
      if (typeof saved.smsNotif === "boolean") setSmsNotif(saved.smsNotif);
      if (typeof saved.freq === "string") setFreq(saved.freq);

      if (typeof saved.displayLang === "string") setDisplayLang(saved.displayLang);
      if (typeof saved.timezone === "string") setTimezone(saved.timezone);
      if (typeof saved.timeFormat === "string") setTimeFormat(saved.timeFormat);
      if (typeof saved.dateFormat === "string") setDateFormat(saved.dateFormat);
    } else {
      const cur = i18n.language?.startsWith("en") ? "en" : "id";
      setDisplayLang(cur);
    }

    const langFromStorage =
      saved?.displayLang || localStorage.getItem("app_lang") || i18n.language;
    const normalized = langFromStorage?.startsWith("en") ? "en" : "id";
    try {
      i18n.changeLanguage(normalized);
    } catch {}
    document.documentElement.lang = normalized;
    localStorage.setItem("app_lang", normalized);

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

  // ===== PERSIST =====
  useEffect(() => {
    const payload = {
      allowData,
      emailNotif,
      pushNotif,
      smsNotif,
      freq,
      displayLang,
      timezone,
      timeFormat,
      dateFormat,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [allowData, emailNotif, pushNotif, smsNotif, freq, displayLang, timezone, timeFormat, dateFormat]);

  // ===== Ganti bahasa global =====
  function handleLangChange(next) {
    setDisplayLang(next);
    const normalized = next?.startsWith("en") ? "en" : "id";
    try {
      i18n.changeLanguage(normalized);
    } catch {}
    document.documentElement.lang = normalized;
    localStorage.setItem("app_lang", normalized);
  }

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-6 md:px-10 pt-8">
        <div className="flex items-center gap-3 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              aria-label={t("common.back")}
            >
              <IoChevronBack size={20} />
            </button>
          )}
          <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        </div>

        {/* Tabs */}
        <div className="relative w-full border-b border-black/10">
          <div ref={tabsWrapRef} className="flex gap-8 text-base md:text-lg font-semibold">
            {tabs.map((tItem) => (
              <button
                key={tItem.id}
                ref={(el) => (tabRefs.current[tItem.id] = el)}
                onClick={() => setActiveTab(tItem.id)}
                className={`py-3 transition-colors bg-transparent border-0 outline-none focus:outline-none ${
                  activeTab === tItem.id ? "text-[#36A58C]" : "text-black/70 hover:text-black"
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
              title={t("settings.privacy.blocked")}
              desc={t("settings.privacy.blockedDesc")}
              action={<LinkGhost text={t("settings.privacy.viewList")} onClick={() => {}} />}
            />
            <Row
              title={t("settings.privacy.data")}
              desc={t("settings.privacy.dataDesc")}
              action={<Toggle checked={allowData} onChange={setAllowData} />}
            />
            <Row
              title={t("settings.privacy.sessions")}
              desc={t("settings.privacy.sessionsDesc")}
              action={
                <LinkGhost
                  text={t("settings.privacy.viewList")}
                  onClick={() => setShowSessions(true)}
                />
              }
            />
            <Row
              title={t("settings.privacy.password")}
              desc={t("settings.privacy.passwordDesc")}
              action={
                <button
                  className="px-5 py-2 rounded-xl bg-[#5CC9AF] text-white font-semibold hover:opacity-90"
                  onClick={() => setShowChangePass(true)}
                >
                  {t("settings.privacy.change")}
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
            setDisplayLang={handleLangChange}
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
          onLogout={(id) => {
            console.log("Logout session", id);
          }}
          onLogoutAll={() => {
            console.log("Logout all sessions");
          }}
        />
      )}

      {/* ====== Modal Ubah Kata Sandi ====== */}
      {showChangePass && (
        <ChangePasswordModal
          t={t}
          onClose={() => setShowChangePass(false)}
          onSubmit={(oldPass, newPass) => {
            // TODO: sambungkan ke endpoint backend Anda di sini.
            console.log("Change password:", { oldPass, newPass });
            setShowChangePass(false);
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
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        checked ? "bg-[#36A58C]" : "bg-gray-300"
      }`}
    >
      {/* BULAT PUTIH */}
      <span
        className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
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
        title={t("settings.notif.email")}
        desc={t("settings.notif.emailDesc")}
        checked={emailNotif}
        onChange={setEmailNotif}
      />
      <NotifRow
        title={t("settings.notif.push")}
        desc={t("settings.notif.pushDesc")}
        checked={pushNotif}
        onChange={setPushNotif}
      />
      <NotifRow
        title={t("settings.notif.sms")}
        desc={t("settings.notif.smsDesc")}
        checked={smsNotif}
        onChange={setSmsNotif}
      />

      <div className="pt-2">
        <div className="text-lg md:text-xl font-extrabold mb-3">
          {t("settings.notif.freq")}
        </div>
        <div className="max-w-md">
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 pr-10 text-gray-800 focus:outline-none"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
            >
              <option value="real-time">{t("settings.notif.rt")}</option>
              <option value="15m">{t("settings.notif.m15")}</option>
              <option value="hourly">{t("settings.notif.hourly")}</option>
              <option value="daily">{t("settings.notif.daily")}</option>
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
      {/* grid 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* KIRI: Bahasa & Zona Waktu */}
        <div className="space-y-10">
          <FieldBlock title={t("settings.lang.display")} helper={t("settings.lang.displayHelp")}>
            <Select value={displayLang} onChange={setDisplayLang}>
              <option value="id">{t("settings.lang.opt.id")}</option>
              <option value="en">{t("settings.lang.opt.enUS")}</option>
              <option value="en-GB">{t("settings.lang.opt.enGB")}</option>
            </Select>
          </FieldBlock>

          <FieldBlock title={t("settings.lang.timezone")} helper={t("settings.lang.timezoneHelp")}>
            <Select value={timezone} onChange={setTimezone}>
              <option value="tzJakarta">{t("settings.lang.opt.tzJakarta")}</option>
              <option value="tzMakassar">{t("settings.lang.opt.tzMakassar")}</option>
              <option value="tzTokyo">{t("settings.lang.opt.tzTokyo")}</option>
              <option value="tzSydney">{t("settings.lang.opt.tzSydney")}</option>
              <option value="tzLondon">{t("settings.lang.opt.tzLondon")}</option>
              <option value="tzNY">{t("settings.lang.opt.tzNY")}</option>
            </Select>
          </FieldBlock>
        </div>

        {/* KANAN: Format Waktu & Format Tanggal */}
        <div className="space-y-10">
          <FieldBlock title={t("settings.lang.timeFormat")} helper={t("settings.lang.timeFormatHelp")}>
            <div className="flex items-center gap-8 mt-1">
              <Radio
                label={t("settings.lang.f12")}
                checked={timeFormat === "12h"}
                onChange={() => setTimeFormat("12h")}
              />
              <Radio
                label={t("settings.lang.f24")}
                checked={timeFormat === "24h"}
                onChange={() => setTimeFormat("24h")}
              />
            </div>
          </FieldBlock>

          <FieldBlock title={t("settings.lang.dateFormat")} helper={t("settings.lang.dateFormatHelp")}>
            <Select value={dateFormat} onChange={setDateFormat}>
              <option value="mmdd">{t("settings.lang.opt.dateMMDD")}</option>
              <option value="ddmm">{t("settings.lang.opt.dateDDMM")}</option>
              <option value="iso">{t("settings.lang.opt.dateISO")}</option>
            </Select>
          </FieldBlock>
        </div>
      </div>
    </div>
  );
}

/* ====== Reusable UI for Language & Regional ====== */
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
        className={`inline-flex h-4 w-4 rounded-full border ${
          checked ? "border-[#36A58C]" : "border-gray-400"
        } items-center justify-center`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${checked ? "bg-[#36A58C]" : "bg-transparent"}`}
        />
      </span>
      <span className="text-gray-800">{label}</span>
    </button>
  );
}

function PlaceholderBox({ t, activeTab }) {
  const label =
    activeTab === "notif"
      ? t("settings.placeholder.notif")
      : activeTab === "language"
      ? t("settings.placeholder.language")
      : t("settings.placeholder.support");
  return (
    <div className="w-full mt-6 text-gray-600">
      <div className="text-xl font-semibold mb-2">{label}</div>
      <p>{t("settings.placeholder.missing")}</p>
    </div>
  );
}

/* ======= Modal: Sesi Aktif ======= */
function SessionModal({ t, sessions, onClose, onLogout, onLogoutAll }) {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      {/* modal card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-3xl">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-black/10">
          {/* close */}
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

          {/* list sessions */}
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

                <button
                  onClick={() => onLogout?.(s.id)}
                  className="text-red-500 font-semibold hover:underline"
                >
                  {t("settings.sessions.logout", { defaultValue: "Logout" })}
                </button>
              </div>
            ))}
          </div>

          {/* footer */}
          <div className="mt-8 text-center">
            <button onClick={onLogoutAll} className="text-red-500 font-semibold hover:underline">
              {t("settings.sessions.logoutAll", {
                defaultValue: "Logout Semua Perangkat",
              })}
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
  const canSave = oldPass.length >= 1 && newPass.length >= 1;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      {/* modal card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl">
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-black/10">
          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 text-[#7CC9B7]"
          >
            <IoClose size={22} />
          </button>

          <h3 className="text-3xl font-extrabold mb-2">
            {t("settings.password.title", { defaultValue: "Ubah Kata Sandi" })}
          </h3>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {t("settings.password.subtitle", {
              defaultValue:
                "Silakan masukkan kata sandi lama Anda, lalu buat kata sandi baru yang lebih kuat. Pastikan Anda mengingat kata sandi baru ini untuk keamanan akun.",
            })}
          </p>

          <div className="space-y-6">
            <input
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full max-w-xl rounded-xl border border-black/10 px-4 py-3 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36A58C]/40"
            />
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter Your New Password"
              className="w-full max-w-xl rounded-xl border border-black/10 px-4 py-3 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36A58C]/40"
            />
          </div>

          <div className="mt-10 flex justify-end">
            <button
              disabled={!canSave}
              onClick={() => canSave && onSubmit?.(oldPass, newPass)}
              className={`h-10 px-6 rounded-lg font-semibold transition ${
                canSave
                  ? "bg-[#5CC9AF] text-white hover:opacity-90"
                  : "bg-gray-300 text-white cursor-not-allowed"
              }`}
            >
              {t("settings.password.save", { defaultValue: "Simpan" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
