// src/PaketDashboard/RewardsDashboard.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useLoyalty } from "../../hooks/useLoyalty";
import BintangReward from "../../assets/bintangreward.png";
import { useNavigate } from "react-router-dom";

// === CONSTANTS & LEVELS ===
const LEVELS = [
  {
    name: "Newbie",
    minXP: 0,
    multiplier: 1,
    color: "text-gray-800",
    badgeColor: "bg-yellow-100 text-yellow-600",
    iconColor: "bg-emerald-400",
  },
  {
    name: "Expert",
    minXP: 50,
    multiplier: 2,
    color: "text-gray-800",
    badgeColor: "bg-blue-100 text-blue-600",
    iconColor: "bg-blue-500",
  },
  {
    name: "Master",
    minXP: 100,
    multiplier: 3,
    color: "text-gray-800",
    badgeColor: "bg-purple-100 text-purple-600",
    iconColor: "bg-purple-500",
  },
  {
    name: "Legend",
    minXP: 200,
    multiplier: 4,
    color: "text-gray-800",
    badgeColor: "bg-red-100 text-red-600",
    iconColor: "bg-yellow-500",
  },
];

// Paket disesuaikan dengan desain "Paket Langganan"
const PACKAGES = [
  {
    id: "basic",
    name: "Paket Basic",
    points: 25,
    price: "Rp. 49.000,-",
    duration: "Durasi 1 Bulan",
    cashbackPercent: 10,
    cashbackPoints: 4,
  },
  {
    id: "pro",
    name: "Paket Pro",
    points: 65,
    price: "Rp. 99.000,-",
    duration: "Durasi 1 Bulan",
    cashbackPercent: 10,
    cashbackPoints: 9,
  },
  {
    id: "business",
    name: "Paket Bisnis",
    points: 125,
    price: "Rp. 199.000,-",
    duration: "Durasi 1 Bulan",
    cashbackPercent: 10,
    cashbackPoints: 19,
  },
  {
    id: "enterprise",
    name: "Paket Enterprise",
    points: 200,
    price: "Rp. 499.000,-",
    duration: "Durasi 1 Bulan",
    cashbackPercent: 10,
    cashbackPoints: 49,
  },
];

// ✅ CONFIGURATION: ATUR TAMPILAN DISINI
const STYLE_CONFIG = {
  // 1. Kartu putih utama (membungkus "Dompet Bintang Anda" + kartu tier)
  mainCard: {
    // seberapa lebar ekstra ke kiri-kanan (px per sisi)
    extendX: 90,
    marginTop: 0,
    marginBottom: 40,
    // Tambahan padding ekstra di dalam kartu (px)
    extraPaddingX: 8,
  },

  // 2. Kontainer "Paket Langganan" (kartu putih besar yang berisi 4 paket)
  subscriptionCard: {
    extendX: 90, // px per sisi
    marginTop: 0,
    marginBottom: 0,
    extraPaddingX: 8,
  },

  // 3. Gambar Bintang Reward BESAR (satu saja, bisa di-geser & di-scale)
  heroStar: {
    show: true,
    // ukuran (lebar) => ubah ini untuk memperbesar / memperkecil
    width: "1200px",

    // posisi dasar (bisa px atau %)
    // silakan adjust: top/left/right/bottom
    top: "10px",
    left: "0%",
    right: "auto",
    bottom: "auto",

    // offset tambahan via translate (untuk geser halus)
    // -50% di X artinya center di horizontal
    translateX: "-50%",
    translateY: "0",

    // rotasi opsional
    rotate: "0deg",
  },
};

export default function RewardsDashboard({ profile }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ✅ Ambil data real dari API via Hook
  const { pointBalance, lifetimePoints, loading, checkPendingTransaction } =
    useLoyalty();

  const currentPoints =
    (pointBalance !== undefined ? pointBalance : profile?.pointBalance) || 0;
  const currentXP =
    (lifetimePoints !== undefined
      ? lifetimePoints
      : profile?.lifetimePoints) || 0;

  // Hitung Level
  const currentLevel = useMemo(
    () =>
      [...LEVELS].reverse().find((l) => currentXP >= l.minXP) || LEVELS[0],
    [currentXP]
  );

  const nextLevel = useMemo(
    () => LEVELS.find((l) => l.minXP > currentXP),
    [currentXP]
  );

  const progressToNext = useMemo(() => {
    if (!nextLevel) return 100;
    const prevXP = currentLevel.minXP;
    const targetXP = nextLevel.minXP;
    const progress = ((currentXP - prevXP) / (targetXP - prevXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [currentXP, currentLevel, nextLevel]);

  const xpNeeded = nextLevel ? nextLevel.minXP - currentXP : 0;

  // ==== hitung style dynamic untuk main card ====
  const mainExtend = STYLE_CONFIG.mainCard.extendX || 0;
  const mainExtraPad = STYLE_CONFIG.mainCard.extraPaddingX || 0;
  const mainWidth = mainExtend ? `calc(100% + ${mainExtend * 2}px)` : "100%";

  // ==== hitung style dynamic untuk kontainer Paket Langganan ====
  const subExtend = STYLE_CONFIG.subscriptionCard.extendX || 0;
  const subExtraPad = STYLE_CONFIG.subscriptionCard.extraPaddingX || 0;
  const subWidth = subExtend ? `calc(100% + ${subExtend * 2}px)` : "100%";

  // ==== HERO STAR CONFIG ====
  const heroStar = STYLE_CONFIG.heroStar;

  // ==== VARIANTS ANIMASI ====
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // jeda antar anak lebih distinct
        delayChildren: 0.1,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const starVars = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 0 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        y: {
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1,
        },
      },
    },
  };

  return (
    <div className="font-poppins min-h-screen w-full bg-gradient-to-r from-[#5FCAAC] to-[#DAEC75] flex">
      {/* 
          GUNAKAN motion.div PADA CONTAINER UTAMA 
          pastikan initial="hidden" dan animate="visible" ada di sini 
      */}
      <motion.div
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        variants={containerVars}
        initial="hidden"
        animate="visible"
      >
        {/* ===== Dekorasi Bintang (SATU gambar besar) ===== */}
        {heroStar.show && (
          <motion.img
            src={BintangReward}
            alt="reward hero decoration"
            className="hidden sm:block absolute z-10 drop-shadow-lg transition-all duration-300 pointer-events-none select-none"
            variants={starVars}
            style={{
              width: heroStar.width,
              top: heroStar.top,
              left: heroStar.left,
              right: heroStar.right,
              bottom: heroStar.bottom,
              transform: `translate(${heroStar.translateX || "0"}, ${heroStar.translateY || "0"
                }) rotate(${heroStar.rotate || "0deg"})`,
            }}
          />
        )}

        {/* ===== Header: Title (tanpa profile toggle) ===== */}
        <motion.div className="relative mb-6 sm:mb-8 z-20" variants={itemVars}>
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]">
            J-Loyalty Rewards Center
          </h1>
        </motion.div>

        {/* ===== Kartu Putih Besar (isi konten) ===== */}
        <motion.div
          className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_18px_60px_rgba(15,23,42,0.22)] border border-emerald-100 px-5 sm:px-8 md:px-10 py-7 sm:py-9 relative z-20"
          variants={itemVars}
          style={{
            width: mainWidth,
            maxWidth: mainWidth,
            marginTop: STYLE_CONFIG.mainCard.marginTop,
            marginBottom: STYLE_CONFIG.mainCard.marginBottom,
            marginLeft: mainExtend ? -mainExtend : undefined,
            marginRight: mainExtend ? -mainExtend : undefined,
            paddingLeft: mainExtraPad
              ? `calc(1.25rem + ${mainExtraPad}px)`
              : undefined,
            paddingRight: mainExtraPad
              ? `calc(1.25rem + ${mainExtraPad}px)`
              : undefined,
          }}
          whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
        >
          {/* POINTS SECTION */}
          <div className="mb-8 sm:mb-10">
            <p className="text-gray-700 font-semibold mb-3 text-sm sm:text-base">
              Dompet Bintang Anda
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Kotak hijau icon bintang/efek */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-400 rounded-[22px] flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.55)]">
                <span className="text-3xl sm:text-4xl text-white">✨</span>
              </div>

              <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="text-[52px] sm:text-[64px] leading-none font-extrabold text-emerald-500 tracking-tighter">
                  {loading ? "..." : currentPoints}
                </span>
                <span className="text-lg sm:text-xl font-bold text-gray-500 mb-2 sm:mb-3">
                  Bintang
                </span>
              </div>
            </div>
          </div>

          {/* TIER STATUS CARD */}
          <div className="border border-emerald-300 rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 bg-white relative transition-all duration-300">
            {/* Bagian atas: icon tier + nama + badge + tombol */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3 sm:mb-4">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Icon tier (kotak dengan medal) */}
                <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] bg-emerald-300 rounded-3xl flex items-center justify-center shadow-[0_16px_32px_rgba(16,185,129,0.55)]">
                  <div className="w-14 h-14 bg-emerald-400 rounded-2xl flex items-center justify-center border-[6px] border-white shadow-inner">
                    <span className="text-3xl">🏅</span>
                  </div>
                </div>

                <div className="mt-1">
                  <h2 className="text-2xl sm:text-[26px] md:text-[28px] font-black text-gray-900 leading-tight">
                    {currentLevel.name}
                  </h2>
                  <span
                    className={`inline-flex items-center justify-center mt-2 px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-bold ${currentLevel.badgeColor}`}
                  >
                    {currentLevel.multiplier}x Bonus
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard/tier-system")}
                className="self-start mt-1 md:mt-0 px-5 sm:px-6 py-2 rounded-xl text-emerald-500 font-bold text-xs sm:text-sm border border-emerald-200 hover:bg-emerald-50/60 transition-all shadow-sm"
              >
                Lihat Detail
              </motion.button>
            </div>

            {/* Lifetime XP Text */}
            <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 sm:mb-4">
              Lifetime XP: {currentXP}
            </p>

            {/* PROGRESS BAR + ikon target */}
            <div className="relative mt-1 mb-6 sm:mb-7 pr-[4.5rem] sm:pr-[5.5rem]">
              {/* Background bar */}
              <div className="w-full h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#DAEC75] via-[#8FD7A1] to-[#5FCAAC] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </div>

              {/* Ikon target di ujung kanan */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[18%] sm:translate-x-[22%]">
                <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(15,23,42,0.18)] border-4 border-white relative">
                  <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center text-white shadow-inner">
                    <span className="text-2xl">🏅</span>
                  </div>
                  <div className="absolute -bottom-3 bg-white px-2 py-[2px] rounded-lg shadow-sm border border-gray-100 text-[10px] font-bold text-gray-600 min-w-[2.1rem] text-center">
                    {nextLevel?.minXP || "Max"}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Level Caption */}
            <p className="text-xs sm:text-sm font-medium text-gray-800">
              {nextLevel ? (
                <>
                  {xpNeeded} XP lagi untuk{" "}
                  <span className="font-bold">{nextLevel.name}</span>!
                </>
              ) : (
                "Selamat! Anda telah mencapai level tertinggi."
              )}
            </p>
          </div>

          {/* Manual Check Button (pojok kanan bawah kartu besar) */}
          <div className="mt-4 text-right">
            <ManualCheckButton checkFn={checkPendingTransaction} />
          </div>
        </motion.div>

        {/* ===== REDEEM / PAKET LANGGANAN SECTION (sesuai desain foto) ===== */}
        <motion.div className="mb-12" variants={itemVars}>
          <div
            className="bg-white/95 rounded-[32px] sm:rounded-[40px] shadow-[0_18px_60px_rgba(15,23,42,0.20)] border border-white/60 px-5 sm:px-8 md:px-10 py-8 sm:py-10 relative z-20"
            style={{
              width: subWidth,
              maxWidth: subWidth,
              marginTop: STYLE_CONFIG.subscriptionCard.marginTop,
              marginBottom: STYLE_CONFIG.subscriptionCard.marginBottom,
              marginLeft: subExtend ? -subExtend : undefined,
              marginRight: subExtend ? -subExtend : undefined,
              paddingLeft: subExtraPad
                ? `calc(1.25rem + ${subExtraPad}px)`
                : undefined,
              paddingRight: subExtraPad
                ? `calc(1.25rem + ${subExtraPad}px)`
                : undefined,
            }}
          >
            {/* Title & Subtitle seperti gambar */}
            <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                Paket Langganan
              </h2>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Dapatkan Bintang dari setiap transaksi dan referral. Gunakan
                untuk menukar paket langganan.
              </p>
            </div>

            {/* List Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
              variants={containerVars} // Re-use container stagger for children
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {PACKAGES.map((pkg) => {
                const canRedeem = currentPoints >= pkg.points;

                return (
                  <motion.div
                    key={pkg.id}
                    variants={itemVars}
                    whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-[28px] shadow-[0_14px_38px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col"
                  >
                    {/* Header gradient (bagian hijau atas) */}
                    <div className="relative bg-gradient-to-br from-[#5FCAAC] to-[#4ade80] px-5 pt-5 pb-6 text-white">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-2xl sm:text-2xl font-extrabold mb-1">
                        {pkg.price}
                      </p>
                      <p className="text-xs opacity-90">{pkg.duration}</p>

                      {/* Badge poin di pojok kanan atas */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 text-emerald-600 text-[11px] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                          <span className="text-xs">✦</span>
                          <span>{pkg.points}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body putih bawah */}
                    <div className="bg-white px-5 pb-5 pt-4 flex flex-col gap-3 flex-1">
                      {/* Cashback box */}
                      <div className="bg-emerald-50 rounded-2xl px-4 py-3 text-xs flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-emerald-700">
                            Cashback
                          </p>
                          <p className="text-[11px] text-emerald-500">
                            {pkg.cashbackPercent}% dari pembelian
                          </p>
                        </div>
                        <p className="text-emerald-700 font-bold text-xs whitespace-nowrap">
                          +{pkg.cashbackPoints} poin
                        </p>
                      </div>

                      {/* Beli Paket */}
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="w-full py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.55)] hover:bg-emerald-600 transition-all"
                      >
                        Beli Paket
                      </motion.button>

                      {/* Tukar Bintang */}
                      <motion.button
                        type="button"
                        disabled={!canRedeem}
                        whileTap={canRedeem ? { scale: 0.95 } : {}}
                        whileHover={canRedeem ? { scale: 1.02 } : {}}
                        className={`w-full py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border transition-all
                          ${canRedeem
                            ? "border-emerald-400 text-emerald-500 bg-white hover:bg-emerald-50"
                            : "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                          }`}
                      >
                        Tukar Bintang
                      </motion.button>

                      {/* Lihat Detail */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05, x: 3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard/tier-system")}
                        className="mt-1 text-[11px] sm:text-xs font-semibold text-emerald-500 hover:text-emerald-600 inline-flex items-center justify-center gap-1"
                      >
                        <span>Lihat Detail</span>
                        <span className="text-xs">➜</span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ✅ Helper Component untuk manual cek transaksi pending
function ManualCheckButton({ checkFn }) {
  const [status, setStatus] = React.useState("idle");
  const [msg, setMsg] = React.useState("");

  const [hasPending] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("pending_payment_order_id");
  });

  if (!hasPending && status === "idle") return null;

  const nav = () => {
    setStatus("checking");
    checkFn().then(() => {
      setStatus("done");
      setMsg("Selesai");
      setTimeout(() => {
        setMsg("");
        window.location.reload();
      }, 1000);
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      {msg && (
        <span className="text-xs font-semibold text-emerald-600 animate-pulse">
          {msg}
        </span>
      )}
      <button
        onClick={nav}
        disabled={status === "checking"}
        className="text-[10px] text-gray-400 hover:text-emerald-600 underline decoration-dotted transition-colors"
        title="Cek Status Transaksi Pending"
      >
        {status === "checking" ? "Mengecek..." : "Cek Pending Transaksi"}
      </button>
    </div>
  );
}
