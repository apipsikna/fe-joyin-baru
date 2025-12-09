// src/landingpage/Referral.jsx
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

import bintang from "../assets/bintang2.png";
import BgReferral from "../assets/BgReferral.png";
import JoyKado from "../assets/JoyKado.png";
import logo from "../assets/logo.png";
import YukGabung from "../assets/YukGabung2.png";

// ✅ gambar 3 kartu (container + angka + icon) => overlay teks saja
import section123 from "../assets/section123.png";

function buildApiUrl(base, path) {
  const cleanBase = String(base || "").replace(/\/+$/, "");
  if (cleanBase.endsWith("/api")) return `${cleanBase}${path}`;
  return `${cleanBase}/api${path}`;
}

import { useTranslation } from "react-i18next";

export default function Referral() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { ready, isAuthenticated } = useAuth();

  // === (tetap) SETTING & QUERY PARAMS buat section lain ===
  let REF_OFFSET = -100;
  let REF_SCALE = 1;

  let BTN_OFFSET_X = -220;
  let BTN_OFFSET_Y = -2020;
  let BTN_SCALE = 1.25;

  let YUK_OFFSET_Y = 100;

  let JOIN_BTN_OFFSET_X = 0;
  let JOIN_BTN_OFFSET_Y = -55;
  let JOIN_BTN_SCALE = 1.4;

  // ✅ overlay teks section123
  let S123_TEXT_X = 0;
  let S123_TEXT_Y = 0;
  let S123_TEXT_SCALE = 1.1;

  // ✅ kontrol gambar section123 (scale + geser)
  let S123_IMG_X = 0; // px
  let S123_IMG_Y = 0; // px
  let S123_IMG_SCALE = 0.9; // multiplier
  let S123_IMG_W = 1; // 1 = 100vw, 1.05 = 105vw, dst

  // ✅✅ BARU: sempitkan kotak teks + benar-benar center di kontainer card
  // (biar teks nggak melebar keluar card + posisi lebih pas di tengah)
  let S123_BOX_W = 0.42; // LEBIH SEMPIT LAGI (was 0.50)
  let S123_BOX_MAXW = 260; // (was 280)
  let S123_BOX_TOP = 0.62; // (tetap, atau sesuaikan jika perlu)

  if (typeof window !== "undefined") {
    const qp = new URLSearchParams(window.location.search);

    const rawOffset = qp.get("ref_offset");
    if (rawOffset) {
      const parsed = parseInt(rawOffset, 10);
      if (!Number.isNaN(parsed)) REF_OFFSET = parsed;
    }

    const rawScale = qp.get("ref_scale");
    if (rawScale) {
      const parsedScale = parseFloat(rawScale);
      if (!Number.isNaN(parsedScale) && parsedScale > 0) REF_SCALE = parsedScale;
    }

    const rawBtnX = qp.get("btn_x");
    if (rawBtnX) {
      const parsedX = parseInt(rawBtnX, 10);
      if (!Number.isNaN(parsedX)) BTN_OFFSET_X = parsedX;
    }
    const rawBtnY = qp.get("btn_y");
    if (rawBtnY) {
      const parsedY = parseInt(rawBtnY, 10);
      if (!Number.isNaN(parsedY)) BTN_OFFSET_Y = parsedY;
    }
    const rawBtnScale = qp.get("btn_scale");
    if (rawBtnScale) {
      const parsedBtnScale = parseFloat(rawBtnScale);
      if (!Number.isNaN(parsedBtnScale) && parsedBtnScale > 0) BTN_SCALE = parsedBtnScale;
    }

    const rawYukY = qp.get("yuk_y");
    if (rawYukY) {
      const parsedYukY = parseInt(rawYukY, 10);
      if (!Number.isNaN(parsedYukY)) YUK_OFFSET_Y = parsedYukY;
    }

    const rawJoinBtnX = qp.get("join_btn_x");
    if (rawJoinBtnX) {
      const parsedJoinX = parseInt(rawJoinBtnX, 10);
      if (!Number.isNaN(parsedJoinX)) JOIN_BTN_OFFSET_X = parsedJoinX;
    }
    const rawJoinBtnY = qp.get("join_btn_y");
    if (rawJoinBtnY) {
      const parsedJoinY = parseInt(rawJoinBtnY, 10);
      if (!Number.isNaN(parsedJoinY)) JOIN_BTN_OFFSET_Y = parsedJoinY;
    }
    const rawJoinBtnScale = qp.get("join_btn_scale");
    if (rawJoinBtnScale) {
      const parsedJoinScale = parseFloat(rawJoinBtnScale);
      if (!Number.isNaN(parsedJoinScale) && parsedJoinScale > 0) JOIN_BTN_SCALE = parsedJoinScale;
    }

    // ✅ overlay teks section123 (geser/scale)
    const rawS123X = qp.get("s123_x");
    if (rawS123X) {
      const parsed = parseInt(rawS123X, 10);
      if (!Number.isNaN(parsed)) S123_TEXT_X = parsed;
    }
    const rawS123Y = qp.get("s123_y");
    if (rawS123Y) {
      const parsed = parseInt(rawS123Y, 10);
      if (!Number.isNaN(parsed)) S123_TEXT_Y = parsed;
    }
    const rawS123S = qp.get("s123_s");
    if (rawS123S) {
      const parsed = parseFloat(rawS123S);
      if (!Number.isNaN(parsed) && parsed > 0) S123_TEXT_SCALE = parsed;
    }

    // ✅ kontrol gambar section123 (scale + geser + lebar vw)
    const rawImgX = qp.get("s123_img_x");
    if (rawImgX) {
      const parsed = parseInt(rawImgX, 10);
      if (!Number.isNaN(parsed)) S123_IMG_X = parsed;
    }
    const rawImgY = qp.get("s123_img_y");
    if (rawImgY) {
      const parsed = parseInt(rawImgY, 10);
      if (!Number.isNaN(parsed)) S123_IMG_Y = parsed;
    }
    const rawImgS = qp.get("s123_img_s");
    if (rawImgS) {
      const parsed = parseFloat(rawImgS);
      if (!Number.isNaN(parsed) && parsed > 0) S123_IMG_SCALE = parsed;
    }
    const rawImgW = qp.get("s123_img_w");
    if (rawImgW) {
      const parsed = parseFloat(rawImgW);
      if (!Number.isNaN(parsed) && parsed > 0) S123_IMG_W = parsed;
    }

    // ✅✅ kotak teks: lebar + maxW + posisi top (biar gampang dipaskan)
    const rawBoxW = qp.get("s123_box_w");
    if (rawBoxW) {
      const parsed = parseFloat(rawBoxW);
      if (!Number.isNaN(parsed) && parsed > 0.1 && parsed <= 1.0) S123_BOX_W = parsed;
    }
    const rawBoxMaxW = qp.get("s123_box_maxw");
    if (rawBoxMaxW) {
      const parsed = parseInt(rawBoxMaxW, 10);
      if (!Number.isNaN(parsed) && parsed >= 100) S123_BOX_MAXW = parsed;
    }
    const rawBoxTop = qp.get("s123_box_top");
    if (rawBoxTop) {
      const parsed = parseFloat(rawBoxTop);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed < 1) S123_BOX_TOP = parsed;
    }
  }

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* =========================
     Referral Modal + API
  ========================== */
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const REFERRAL_ME_URL = useMemo(() => buildApiUrl(API_BASE, "/referrals/me"), [API_BASE]);

  const [showRefModal, setShowRefModal] = useState(false);
  const [refLoading, setRefLoading] = useState(false);
  const [refError, setRefError] = useState("");
  const [refData, setRefData] = useState({ myReferralCode: "", totalReferred: 0 });
  const [copied, setCopied] = useState("");

  const referralLink = useMemo(() => {
    const code = refData?.myReferralCode || "";
    if (typeof window === "undefined" || !code) return "";
    return `${window.location.origin}/signup?ref=${encodeURIComponent(code)}`;
  }, [refData?.myReferralCode]);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const fetchReferralDetails = async () => {
    setRefError("");
    setRefLoading(true);

    try {
      const res = await fetch(REFERRAL_ME_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
      });

      const json = await safeJson(res);

      if (res.status === 401) {
        throw new Error(t("referral.errors.sessionExpired", "Sesi kamu habis / belum login. Silakan login lagi."));
      }

      if (!res.ok) {
        const msg = json?.message || json?.error || t("referral.errors.fetchFailed", "Gagal mengambil data referral");
        throw new Error(msg);
      }

      const data = json?.data || {};
      const myReferralCode = String(data?.myReferralCode || "");
      const totalReferred = Number(data?.totalReferred || 0);

      if (!myReferralCode) {
        throw new Error(
          "Referral code kosong dari server. Pastikan endpoint /api/referrals/me melakukan get-or-create referralCode."
        );
      }

      setRefData({ myReferralCode, totalReferred });
    } catch (e) {
      const msg = e?.message || t("referral.errors.general", "Terjadi kesalahan saat mengambil referral code.");
      setRefError(msg);

      if (/login|sesi|401/i.test(msg)) {
        setTimeout(() => {
          setShowRefModal(false);
          navigate("/login");
        }, 500);
      }
    } finally {
      setRefLoading(false);
    }
  };

  const handleGetReferral = async () => {
    if (!ready) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowRefModal(true);
    await fetchReferralDetails();
  };

  const copyText = async (text, label) => {
    const successLabel = label || t("referral.copySuccess", "Berhasil disalin!");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(successLabel);
      setTimeout(() => setCopied(""), 1400);
    } catch {
      window.prompt("Copy manual:", text);
    }
  };

  const TARGET = 20;
  const progressPct = useMemo(() => {
    const v = Number(refData?.totalReferred || 0);
    return Math.max(0, Math.min(100, Math.round((v / TARGET) * 100)));
  }, [refData?.totalReferred]);

  const waShareLink = useMemo(() => {
    const code = refData?.myReferralCode || "";
    if (!code || !referralLink) return "";
    const text =
      `Pakai kode referral JOYIN-ku: ${code}\n` +
      `Daftar lewat link ini: ${referralLink}\n` +
      `Kamu dapat diskon 6% saat beli paket!`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [refData?.myReferralCode, referralLink]);

  // ✅ teks overlay untuk 3 card
  const STEP_TEXT = useMemo(
    () => [
      {
        title: t("referral.how.steps.0.title", "Dapatkan Kode Unik"),
        desc: t("referral.how.steps.0.desc", "Hanya tiga langkah mudah..."),
      },
      {
        title: t("referral.how.steps.1.title", "Bagikan ke Teman"),
        desc: t("referral.how.steps.1.desc", "Share kode Anda melalui WhatsApp..."),
      },
      {
        title: t("referral.how.steps.2.title", "Dapatkan Bonus"),
        desc: t("referral.how.steps.2.desc", "Ketika teman Anda membeli paket..."),
      },
    ],
    [t]
  );

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white overflow-x-hidden font-poppins">

      {/* ========= HERO ========= */}
      <motion.main
        className="relative w-full flex justify-center bg-white overflow-hidden"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={BgReferral}
          alt="Background Referral Joyin"
          className="w-full h-auto block"
          initial={{ opacity: 0, scale: 1.08, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* stars */}
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-10 top-32 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: -20, scale: 0.7 }}
          animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{ duration: 2.1, delay: 0.4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-32 top-60 md:top-64 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{ opacity: 1, y: [0, 5, 0], scale: 1 }}
          transition={{ duration: 2.4, delay: 0.6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-10 top-36 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: -20, scale: 0.7 }}
          animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
          transition={{ duration: 2.2, delay: 0.7, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-32 top-64 md:top-72 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{ opacity: 1, y: [0, 6, 0], scale: 1 }}
          transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />

        {/* konten hero */}
        <motion.section
          className="
            absolute inset-x-0 top-0
            max-w-5xl w-full mx-auto text-center
            px-4 sm:px-6 lg:px-8
            pt-32 md:pt-40 lg:pt-44
            pb-32 md:pb-40
            z-20
          "
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-white leading-tight drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          >
            {t("referral.hero.title", "Dapatkan Keuntungan dari Referral Joyin!")}
          </motion.h1>

          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg lg:text-[18px] text-white/95 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          >
            {t("referral.hero.desc", "Temanmu dapat diskon spesial...")}
          </motion.p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <motion.button
              type="button"
              onClick={handleGetReferral}
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white text-[#2BB673] font-semibold text-sm sm:text-base shadow-[0_14px_34px_rgba(0,0,0,0.2)] border border-white hover:translate-y-[1px] transition-transform duration-150"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: 1 }}
              whileTap={{ scale: 0.96 }}
            >
              {t("referral.hero.btnCode", "Dapatkan Kode Referral")}
            </motion.button>

            <motion.button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-sm sm:text-base border border-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:bg-white/18 hover:translate-y-[1px] transition-all duration-150"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const el = document.getElementById("ref-info");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {t("referral.hero.btnLearn", "Pelajari Lebih Lanjut")}
            </motion.button>
          </div>
        </motion.section>
      </motion.main>

      {/* ========= SECTION 1 ========= */}
      <motion.section
        id="ref-info"
        className="w-full bg-white pb-10 md:pb-16 lg:pb-20"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: REF_OFFSET }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-center">
            <motion.div
              className="px-5 sm:px-8 md:pl-14 lg:pl-20 xl:pl-24 md:pr-10 lg:pr-12 py-14 md:py-20"
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full">
                <h2 className="text-[40px] sm:text-[52px] md:text-[60px] font-extrabold text-gray-800 leading-[1.06]">
                  <span>{t("referral.why.title1", "Kenapa Harus Ikut")}</span>
                  <br />
                  <span className="inline-flex flex-wrap items-baseline gap-3">
                    <span>{t("referral.why.title2", "Program Referral")}</span>
                    <img
                      src={logo}
                      alt="Joyin"
                      className="inline-block h-[34px] sm:h-[44px] md:h-[50px] translate-y-[3px]"
                      draggable={false}
                    />
                    <span>?</span>
                  </span>
                </h2>

                <div className="mt-8 space-y-6 text-gray-600 text-[18px] sm:text-[20px] md:text-[22px] leading-relaxed">
                  <p>
                    {t("referral.why.desc1", "Di Joyin, kami percaya hal baik pantas dibagikan! Ajak temanmu untuk bergabung, dan kalian berdua bisa dapetin hadiah spesial dari Joyin 🎉")}
                  </p>
                  <p>
                    {t("referral.why.desc2", "Setiap teman yang membeli paket membuat Anda semakin dekat ke hadiah utama! Yuk, mulai bagikan link referral-mu sekarang!")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full overflow-hidden"
              initial={{ opacity: 0, x: 22, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.img
                src={JoyKado}
                alt="JoyKado"
                className="w-full max-w-none h-auto md:h-[620px] object-contain select-none"
                draggable={false}
                style={{ transform: `scale(${REF_SCALE})` }}
                initial={{ y: 10 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ========= SECTION 2 (section123) ========= */}
      <motion.section
        className="w-full bg-white py-16 md:py-20"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full text-center px-4 sm:px-6">
          <h2 className="text-[30px] sm:text-[34px] md:text-[40px] font-extrabold text-gray-700">
            {t("referral.section2.title", "Cara Kerjanya Sangat Mudah!")}
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base">
            {t("referral.section2.desc", "Hanya tiga langkah mudah buat nikmatin keseruan program referral Joyin")}
          </p>
        </div>

        {/* gambar: FULL kanan-kiri + bisa di-scale & digeser */}
        <div className="mt-10 md:mt-12 w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
          <div
            className="relative"
            style={{
              width: `${Math.round(S123_IMG_W * 100)}vw`,
              left: "50%",
              transform: `translateX(-50%) translate3d(${S123_IMG_X}px, ${S123_IMG_Y}px, 0) scale(${S123_IMG_SCALE})`,
              transformOrigin: "center top",
            }}
          >
            <img
              src={section123}
              alt="Cara kerja program referral Joyin"
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
            />

            {/* overlay teks (dipusatkan + kotak dipersempit supaya fit card) */}
            <div
              className="absolute inset-0 pointer-events-none select-none"
              style={{
                transform: `translate3d(${S123_TEXT_X}px, ${S123_TEXT_Y}px, 0) scale(${S123_TEXT_SCALE})`,
                transformOrigin: "center center",
              }}
            >
              <div className="grid grid-cols-3 h-full">
                {STEP_TEXT.map((s, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center justify-center"
                      style={{
                        top: `${Math.round(S123_BOX_TOP * 100)}%`,
                        width: `${Math.round(S123_BOX_W * 100)}%`,
                        maxWidth: S123_BOX_MAXW, // px
                      }}
                    >
                      <div className="px-1">
                        <div className="text-white font-extrabold text-[24px] sm:text-[26px] md:text-[30px] leading-snug drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
                          {s.title}
                        </div>
                        <div className="mt-2 text-white/95 text-[14px] sm:text-[15px] md:text-[17px] leading-relaxed break-words drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* (opsional) kalau teks masih kepanjangan, kamu bisa kecilin via ?s123_s=1.05 atau kecilin box via ?s123_box_w=0.54 */}
          </div>

          <div className="h-10 md:h-14" />
        </div>
      </motion.section>

      {/* ========= SECTION 3 ========= */}
      <motion.section
        className="w-full bg-white"
        initial={{ opacity: 0, x: 70, y: YUK_OFFSET_Y + 90 }}
        whileInView={{ opacity: 1, x: 0, y: YUK_OFFSET_Y }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full overflow-hidden relative">
          <motion.img
            src={YukGabung}
            alt="Yuk Gabung Joyin Referral"
            className="w-full h-auto object-cover block"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Overlay Text & Button */}
          <div className="absolute inset-x-0 bottom-[26%] md:bottom-[32%] flex flex-col items-center justify-end text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-6xl mx-auto mb-16 md:mb-20"
            >
              <h2 className="text-white text-[26px] sm:text-[34px] md:text-[40px] lg:text-[46px] font-bold drop-shadow-md mb-4 md:mb-6">
                {t("referral.join.title", "Yuk Gabung & Dapatkan Referral dari Joyin!")}
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-white text-[15px] sm:text-[17px] md:text-[19px] leading-relaxed drop-shadow-sm px-2 md:px-10">
                  {t("referral.join.desc", "Mulai perjalananmu bareng Joyin sekarang...")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                scale: JOIN_BTN_SCALE * 0.85,
              }}
              whileInView={{
                opacity: 1,
                scale: JOIN_BTN_SCALE,
              }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
            >
              <motion.button
                type="button"
                className="
                  inline-flex items-center justify-center
                  px-10 sm:px-14 py-3 sm:py-4
                  rounded-full
                  bg-white
                  font-semibold
                  text-sm sm:text-base
                  leading-none
                  text-[#A259FF]
                  shadow-[0_14px_30px_rgba(0,0,0,0.25)]
                  outline-none focus:outline-none focus-visible:outline-none
                  ring-0 focus:ring-0 focus-visible:ring-0
                  border-0
                "
                whileHover={{ scale: 1.07, y: 1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/signup")}
              >
                {t("referral.join.btn", "Bergabung & Dapatkan Hadiah")}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ========= SECTION 4 ========= */}
      <section className="w-full bg-white pt-12 md:pt-16 pb-10 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            className="inline-block shadow-[0_8px_18px_rgba(0,0,0,0.08)] rounded-full"
            initial={{ opacity: 0, x: BTN_OFFSET_X, y: BTN_OFFSET_Y + 90, scale: BTN_SCALE * 0.8 }}
            whileInView={{ opacity: 1, x: BTN_OFFSET_X, y: BTN_OFFSET_Y, scale: BTN_SCALE }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <motion.button
              type="button"
              className="
                px-8 sm:px-10 py-2.5 sm:py-3
                rounded-full
                bg-[#FFB400]
                text-white
                font-semibold
                text-sm sm:text-base
                shadow-[0_6px_14px_rgba(0,0,0,0.18)]
                hover:translate-y-[1px]
                transition-transform duration-150
                outline-none focus:outline-none focus-visible:outline-none
                border-0
              "
              whileHover={{ scale: 1.08, y: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/signup")}
            >
              {t("referral.bottomCta", "Ayo Bergabung!")}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="min-h-[120px] md:min-h-[180px]" />
      </section>

      <Footer />

      {/* ===================== MODAL: Referral Code ===================== */}
      <AnimatePresence>
        {showRefModal && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setShowRefModal(false)} />

            <motion.div
              className="relative w-full max-w-[520px] rounded-2xl bg-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] overflow-hidden"
              initial={{ y: 18, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 14, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              <div className="p-5 sm:p-6 border-b border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 font-black">%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-extrabold text-gray-900">{t("referral.modal.title", "Kode Referral Kamu")}</h3>
                    <p className="text-[12px] text-gray-500">{t("referral.modal.desc", "Bagikan kode ini ke temanmu. Temanmu dapat diskon 6% saat beli paket.")}</p>
                  </div>
                  <button
                    onClick={() => setShowRefModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {refLoading ? (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-600">
                      <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                      {t("referral.modal.loading", "Mengambil kode referral...")}
                    </div>
                  </div>
                ) : refError ? (
                  <div className="py-4">
                    <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-red-700 text-sm">{refError}</div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={fetchReferralDetails}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:brightness-110"
                      >
                        {t("referral.modal.retry", "Coba Lagi")}
                      </button>
                      <button
                        onClick={() => setShowRefModal(false)}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200"
                      >
                        {t("referral.modal.close", "Tutup")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                      <div className="text-[11px] font-semibold text-emerald-700 mb-2">{t("referral.modal.codeLabel", "KODE")}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-black tracking-[0.25em] text-[20px] text-gray-900 truncate">
                            {refData.myReferralCode}
                          </div>
                          <div className="mt-2 text-[12px] text-gray-500">
                            {t("referral.modal.codeNote", "1 orang hanya bisa pakai 1x kode referral saat registrasi.")}
                          </div>
                        </div>
                        <button
                          onClick={() => copyText(refData.myReferralCode, t("referral.copySuccessShort", "Kode tersalin!"))}
                          className="shrink-0 px-4 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-50"
                        >
                          {t("referral.modal.copy", "Copy")}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-bold text-gray-900">{t("referral.modal.progressTitle", "Progress hadiah paket Pro 1 bulan")}</p>
                        <p className="text-[12px] font-extrabold text-emerald-700">
                          {refData.totalReferred}/{TARGET}
                        </p>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
                      </div>
                      <p className="mt-2 text-[11px] text-gray-500">{t("referral.modal.progressNote", "Ajak {{target}} orang menggunakan kode referralmu untuk dapat hadiah.", { target: TARGET })}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => copyText(referralLink, "Link tersalin!")}
                        disabled={!referralLink}
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 disabled:opacity-50"
                      >
                        Copy Link
                      </button>
                      <a
                        href={waShareLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-4 py-2 rounded-xl font-semibold text-sm text-center ${waShareLink
                          ? "bg-emerald-600 text-white hover:brightness-110"
                          : "bg-gray-100 text-gray-400 pointer-events-none"
                          }`}
                      >
                        Share WA
                      </a>
                      <button
                        onClick={() => setShowRefModal(false)}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-50"
                      >
                        Selesai
                      </button>
                    </div>

                    <AnimatePresence>
                      {!!copied && (
                        <motion.div
                          className="mt-3 text-center text-[12px] font-semibold text-emerald-700"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                        >
                          {copied}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
🔧 Setting URL yang kepakai:
- gambar section123:
  ?s123_img_s=0.95&s123_img_x=0&s123_img_y=-10&s123_img_w=1.05
- overlay teks:
  ?s123_x=0&s123_y=0&s123_s=1.1
- kotak teks (INI yang kamu minta):
  ?s123_box_w=0.56&s123_box_maxw=300&s123_box_top=0.64

Contoh:
  /referral?s123_img_s=0.92&s123_img_w=1.05&s123_img_y=-10&s123_box_w=0.56&s123_box_maxw=300&s123_box_top=0.64
*/
