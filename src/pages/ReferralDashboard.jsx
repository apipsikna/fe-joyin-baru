// src/pages/ReferralDashboard.jsx
// src/pages/ReferralDashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { motion, useReducedMotion } from "framer-motion";
import EightBintang from "../assets/8bintang.png";

const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

const REF_LAYOUT = {
  sidePadMobile: 14,
  sidePadDesktop: 10,

  topPad: 26,
  gapTitleToCard: 22,

  // ✅ BIKIN LEBIH SEMPIT BAGIAN "Kode Referral Anda :"
  // turunin ini biar card-nya makin sempit
  codeCardMaxW: 820, // sebelumnya 1040

  whiteTopRadius: 46,
  whiteCardMaxW: 9999,

  whitePadXMobile: 18,
  whitePadXDesktop: 38,
  whitePadTop: 26,
  whitePadBottom: 26,

  heroMinH: 345,
};

/**
 * ✅ SETTING GAMBAR 8 BINTANG (geser + zoom)
 * Override via query param:
 *  ?starx=40&stary=-10&stars=1.15
 */
const STAR8_CTRL = {
  x: 0,
  y: 6,
  scale: 0.8,
};

const SAMPLE_ROWS = [];

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const readNum = (qp, key, fallback) => {
  const raw = qp.get(key);
  if (raw == null || raw === "") return fallback;
  const v = Number(raw);
  return Number.isFinite(v) ? v : fallback;
};

import { useLoyalty } from "../hooks/useLoyalty";

export default function ReferralDashboard({ profile }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1];

  // ✅ Animasi masuk
  const page = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.18,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 12, filter: "blur(7px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.55, ease: EASE },
    },
  };

  const fadeOnly = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.75, ease: EASE },
    },
  };

  const cardIn = {
    hidden: { opacity: 0, y: 16, scale: 0.995, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.6, ease: EASE },
    },
  };

  const rowIn = {
    hidden: { opacity: 0, y: 10, filter: "blur(7px)" },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.35,
        ease: "easeOut",
        delay: reduceMotion ? 0 : 0.08 + i * 0.05,
      },
    }),
  };

  // ✅ Use consolidated loyalty hook
  const {
    referralCode,
    referralList: referrals,
    loading,
    error
  } = useLoyalty();

  // Remove independent state for these since they come from useLoyalty now
  const [copied, setCopied] = useState(false);

  // Note: referrals, loading, error are now derived from the hook
  // We don't need the useEffect manual fetch anymore


  const starCtrl = useMemo(() => {
    if (typeof window === "undefined") return STAR8_CTRL;

    const qp = new URLSearchParams(window.location.search);
    const x = readNum(qp, "starx", STAR8_CTRL.x);
    const y = readNum(qp, "stary", STAR8_CTRL.y);
    const s = readNum(qp, "stars", STAR8_CTRL.scale);

    return {
      x: clamp(x, -600, 600),
      y: clamp(y, -600, 600),
      scale: clamp(s, 0.4, 3),
    };
  }, []);

  const handleCopy = async () => {
    const text = referralCode || "";
    if (!text) return;

    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen font-poppins overflow-x-hidden flex flex-col"
      style={{
        background: `linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
        "--spM": `${REF_LAYOUT.sidePadMobile}px`,
        "--spD": `${REF_LAYOUT.sidePadDesktop}px`,
        "--topPad": `${REF_LAYOUT.topPad}px`,
        "--radTop": `${REF_LAYOUT.whiteTopRadius}px`,
        "--codeMaxW": `${REF_LAYOUT.codeCardMaxW}px`,
        "--whiteMaxW": `${REF_LAYOUT.whiteCardMaxW}px`,
        "--heroMinH": `${REF_LAYOUT.heroMinH}px`,
        "--starX": `${starCtrl.x}px`,
        "--starY": `${starCtrl.y}px`,
        "--starS": `${starCtrl.scale}`,
      }}
      variants={page}
      initial="hidden"
      animate="show"
    >
      <style>{`
        body { -ms-overflow-style: none; scrollbar-width: none; }
        body::-webkit-scrollbar { display: none; }

        .rf-pad{ padding-left: var(--spM); padding-right: var(--spM); }
        @media (min-width: 768px){ .rf-pad{ padding-left: var(--spD); padding-right: var(--spD); } }

        .rf-codeMax{ max-width: var(--codeMaxW); margin-left: auto; margin-right: auto; width: 100%; }
        .rf-whiteMax{ max-width: var(--whiteMaxW); margin-left: auto; margin-right: auto; width: 100%; }
      `}</style>

      {/* ===== HERO ===== */}
      <div
        className="rf-pad relative shrink-0"
        style={{ paddingTop: "var(--topPad)", minHeight: "var(--heroMinH)" }}
      >
        {/* ✅ Layer bintang (animasi aman: opacity/blur, tidak mengganggu transform 8bintang) */}
        <motion.div
          variants={fadeOnly}
          className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
          <img
            src={EightBintang}
            alt="bintang dekorasi"
            draggable="false"
            className="absolute left-1/2 top-1/2 max-w-none w-[120%] h-[120%] object-contain"
            style={{
              transform:
                "translate3d(calc(-50% + var(--starX)), calc(-50% + var(--starY)), 0) scale(var(--starS))",
              transformOrigin: "center",
            }}
          />
        </motion.div>

        <motion.div variants={fadeUp} className="relative z-10">
          <h1 className="text-center text-white font-extrabold tracking-wide text-[32px] md:text-[44px] leading-tight">
            {t("referralDashboard.heroTitle")}
          </h1>

          <p className="mt-3 text-center text-white/90 text-[13px] md:text-[15px] leading-relaxed max-w-3xl mx-auto">
            {t("referralDashboard.heroDesc")}
          </p>

          {/* ✅ Card kode dibuat lebih sempit (max-width dari config) */}
          <motion.div
            variants={cardIn}
            className="rf-codeMax mt-7 md:mt-8 rounded-[18px] md:rounded-[22px] border border-white/30 bg-white/20 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
            style={{ padding: "18px" }}
          >
            <div className="text-white/90 font-semibold text-[16px] md:text-[18px]">
              {t("referralDashboard.yourCode")}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <input
                value={referralCode}
                readOnly
                placeholder="Masukkan kode referral"
                className="w-full h-[56px] rounded-[14px] border border-white/70 bg-white/25 px-5 text-white placeholder:text-white/70 outline-none"
              />

              <button
                type="button"
                onClick={handleCopy}
                className="h-[56px] min-w-[160px] md:min-w-[190px] rounded-[14px] bg-white text-[#5FCAAC] font-bold text-[16px] shadow-[0_10px_26px_rgba(0,0,0,0.12)] inline-flex items-center justify-center gap-2 hover:brightness-[0.98] active:brightness-95"
                title={t("referralDashboard.copy")}
              >
                <HiOutlineDocumentDuplicate className="w-5 h-5" />
                {copied ? t("referralDashboard.copied") : t("referralDashboard.copy")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== WHITE CONTAINER (bawah siku) ===== */}
      <div
        className="rf-pad flex-1 min-h-0 flex flex-col"
        style={{ paddingTop: "18px" }}
      >
        <motion.div
          variants={cardIn}
          className="rf-whiteMax flex-1 min-h-0 bg-white shadow-[0_26px_80px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{
            borderTopLeftRadius: "var(--radTop)",
            borderTopRightRadius: "var(--radTop)",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="w-full h-full"
            style={{
              paddingLeft: REF_LAYOUT.whitePadXMobile,
              paddingRight: REF_LAYOUT.whitePadXMobile,
              paddingTop: REF_LAYOUT.whitePadTop,
              paddingBottom: REF_LAYOUT.whitePadBottom,
            }}
          >
            <div className="mx-auto w-full max-w-6xl">
              <motion.h2
                variants={fadeUp}
                className="text-[26px] md:text-[32px] font-extrabold text-gray-900"
              >
                {t("referralDashboard.listTitle")}
              </motion.h2>

              <motion.div variants={fadeUp} className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                <table className="w-full text-[13px] md:text-[14px]">
                  <thead className="bg-[#5FCAAC] text-white">
                    <tr>
                      <th className="py-4 px-4 text-left font-bold w-[64px]">
                        {t("referralDashboard.table.no")}
                      </th>
                      <th className="py-4 px-4 text-center font-bold">
                        {t("referralDashboard.table.name")}
                      </th>
                      <th className="py-4 px-4 text-center font-bold">
                        {t("referralDashboard.table.email")}
                      </th>
                      <th className="py-4 px-4 text-center font-bold">
                        {t("referralDashboard.table.date")}
                      </th>
                      <th className="py-4 px-4 text-center font-bold w-[120px]">
                        {t("referralDashboard.table.status")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {loading && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {!loading && referrals.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          {t("referralDashboard.empty")}
                        </td>
                      </tr>
                    )}
                    {!loading && referrals.map((r, i) => (
                      <motion.tr
                        key={r.id || r.no || i}
                        className="border-t border-gray-100"
                        variants={rowIn}
                        custom={i}
                        initial="hidden"
                        animate="show"
                      >
                        <td className="py-4 px-4 text-left text-gray-900">
                          {i + 1}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900">
                          {r.name || r.nama || "-"}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900">
                          {r.email || "-"}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900">
                          {r.createdAt || r.waktu || "-"}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-900">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${r.status === "active" || r.status === "Aktif"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {r.status || "-"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              <div className="h-8" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/*
✅ URL override:
?starx=40&stary=-15&stars=1.1
*/
