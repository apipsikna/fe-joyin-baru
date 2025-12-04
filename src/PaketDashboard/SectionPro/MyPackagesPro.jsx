// src/PaketDashboard/SectionPro/MyPackagesPro.jsx
import React, { useState } from "react";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineDevicePhoneMobile,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { motion, useReducedMotion } from "framer-motion";

import SectionPutih from "../../assets/SectionPutih.png";

// ✅ Gradasi background baru
const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

const PAGE_CFG = {
  maxW: 3000,
  pxMobile: 20,
  pxDesktop: 32,
  pt: 48,
  pb: 100,
};

/* =======================
   ✅ SETTING CARD STAT (Durasi / Masa Aktif / Jatuh Tempo)
   - dibuat SERAGAM: lebar & tinggi 3 card sama persis
   ======================= */
const STAT_CARD_CFG = {
  maxW: 380, // lebar maksimum tiap card (semua sama)
  radius: 22,

  // tinggi card dibuat sama persis
  minHMobile: 132,
  minHDesktop: 140,

  // padding card
  padXMobile: 28,
  padYMobile: 22,
  padXDesktop: 30,
  padYDesktop: 26,

  // ukuran font
  titleMobilePx: 16,
  titleDesktopPx: 18,
  valueMobilePx: 28,
  valueDesktopPx: 30,

  // ruang (slot) untuk progress / area bawah (biar card lain tetap sama tinggi)
  childrenSlotMobile: 16,
  childrenSlotDesktop: 18,
};

/* =======================
   ✅ SETTING WADAH MANFAAT (Section Putih)
   ======================= */
const SECTION_PUTIH_CFG = {
  maxW: 2000,

  padMobileX: 18,
  padMobileTop: 40,
  padMobileBottom: 28,

  padDesktopX: 110,
  padDesktopTop: 300,
  padDesktopBottom: 60,
};

/* =======================
   ✅ SETTING POSISI & BESAR GAMBAR SectionPutih
   ======================= */
const SECTION_PUTIH_IMG_CTRL = {
  translateXMobile: 0,
  translateYMobile: 0,
  scaleMobile: 1,

  translateXDesktop: 0,
  translateYDesktop: 72,
  scaleDesktop: 1.09,
};

/* =======================
   ✅ TURUNKAN KONTEN "Fitur yang Didapatkan" + 6 kartu
   ======================= */
const SECTION_PUTIH_CONTENT_CTRL = {
  yMobile: 45,
  yDesktop: 75,
};

/* =======================
   ✅ TURUNKAN 3 TOMBOL ACTION
   ======================= */
const ACTIONS_CTRL = {
  yMobile: 18,
  yDesktop: 26,
};

/* =======================
   ✅ SAMAKAN UKURAN 6 KOTAK FITUR
   ======================= */
const FEATURE_CARD_CTRL = {
  hMobile: 132,
  hDesktop: 142,
  descLines: 2,
};

/* =======================
   ✅ NEW: SESUAIKAN UKURAN TEKS DI 6 FITUR
   ======================= */
const FEATURE_TEXT_CTRL = {
  titleMobilePx: 16,
  titleDesktopPx: 18,
  descMobilePx: 13,
  descDesktopPx: 14,
  titleLineHeight: 1.25,
  descLineHeight: 1.4,
};

function StatCard({ title, value, children }) {
  return (
    <div className="_statCard w-full bg-white/25 backdrop-blur-md border border-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col">
      {/* bagian atas (judul + value) */}
      <div>
        <div className="_statTitle text-white/90 font-semibold">{title}</div>
        <div className="_statValue mt-1 text-white font-extrabold tracking-tight">
          {value}
        </div>
      </div>

      {/* slot bawah (biar 3 card tinggi sama persis) */}
      <div className="_statSlot mt-4">{children ? children : null}</div>
    </div>
  );
}

function ActionButton({ children, onClick, variant = "primary" }) {
  const base =
    "joyin-btn joyin-btn--glow " +
    "relative inline-flex items-center justify-center " +
    "h-[42px] px-7 rounded-xl font-semibold border border-white/60 " +
    "bg-white text-[#5FCAAC] " +
    "shadow-[0_8px_18px_rgba(0,0,0,0.10)] " +
    "transition-all duration-200 ease-out transform " +
    "hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] " +
    "outline-none hover:outline-none focus:outline-none focus-visible:outline-none " +
    "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ";

  const cls = variant === "danger" ? base : base;

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div
      className={[
        "_featureCard",
        "w-full",
        "rounded-2xl p-[1px]",
        "bg-gradient-to-r from-[#5FCAAC] to-[#DAEC75]",
        "shadow-[0_14px_32px_rgba(0,0,0,0.10)]",
        "transition-all duration-200 ease-out transform",
        "hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(0,0,0,0.18)]",
      ].join(" ")}
    >
      <div className="h-full w-full rounded-[1rem] bg-white px-6 py-5">
        <div className="h-full flex items-start gap-3">
          <div className="mt-[2px] shrink-0 text-black">
            <Icon className="_featureIcon" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="_featureTitle font-extrabold text-gray-900">
              {title}
            </div>
            <div className="_featureDesc mt-1 text-gray-500">{desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export default function MyPackagesPro() {
  const [progressPct] = useState(78);

  // ===== Animasi (aman: tidak mengganggu transform CSS yang sudah ada) =====
  const reduceMotion = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1];

  const page = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.2,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: reduceMotion ? 0 : 0.07,
      },
    },
  };

  // fade+up (pakai transform) -> aman diaplikasikan ke wrapper yang tidak punya transform CSS
  const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(7px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.6, ease: EASE },
    },
  };

  // fade-only -> aman untuk elemen yang sudah punya transform CSS (_spImg/_spContent/_actionsShift)
  const fadeOnly = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  const statCardIn = {
    hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: EASE,
        delay: reduceMotion ? 0 : 0.04 + i * 0.08,
      },
    }),
  };

  const featureIn = {
    hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: "easeOut",
        delay: reduceMotion ? 0 : 0.08 + i * 0.05,
      },
    }),
  };

  return (
    <motion.div
      className="w-full overflow-x-hidden font-poppins"
      style={{
        background: `linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
      }}
      variants={page}
      initial="hidden"
      animate="show"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: PAGE_CFG.maxW,
          paddingLeft: PAGE_CFG.pxMobile,
          paddingRight: PAGE_CFG.pxMobile,
          paddingTop: PAGE_CFG.pt,
          paddingBottom: PAGE_CFG.pb,
        }}
      >
        <style>{`
          /* ✅ Sembunyikan scrollbar di seluruh halaman (tetap bisa scroll) */
          body { -ms-overflow-style: none; scrollbar-width: none; }
          body::-webkit-scrollbar { display: none; }

          /* ✅ Matikan outline bawaan Chrome/Browser untuk tombol joyin */
          .joyin-btn { outline: none; }
          .joyin-btn:focus, .joyin-btn:focus-visible, .joyin-btn:active { outline: none; }
          .joyin-btn::-moz-focus-inner { border: 0; }

          /* ✅ Glow effect putih untuk tombol paket saat hover */
          .joyin-btn--glow:hover {
            box-shadow:
              0 0 28px rgba(255, 255, 255, 0.98),
              0 20px 55px rgba(0, 0, 0, 0.30);
          }

          /* =======================
             ✅ STAT CARD: 3 card SAMA PERSIS (lebar + tinggi)
             ======================= */
          ._statCard{
            max-width: ${STAT_CARD_CFG.maxW}px;
            border-radius: ${STAT_CARD_CFG.radius}px;
            min-height: ${STAT_CARD_CFG.minHMobile}px;
            padding: ${STAT_CARD_CFG.padYMobile}px ${STAT_CARD_CFG.padXMobile}px;
          }
          ._statTitle{
            font-size: ${STAT_CARD_CFG.titleMobilePx}px;
          }
          ._statValue{
            font-size: ${STAT_CARD_CFG.valueMobilePx}px;
            line-height: 1.1;
          }
          /* slot bawah disamakan walau tidak ada children */
          ._statSlot{
            min-height: ${STAT_CARD_CFG.childrenSlotMobile}px;
          }

          @media (min-width: 768px){
            ._pagePad{
              padding-left: ${PAGE_CFG.pxDesktop}px;
              padding-right: ${PAGE_CFG.pxDesktop}px;
            }
            ._statCard{
              min-height: ${STAT_CARD_CFG.minHDesktop}px;
              padding: ${STAT_CARD_CFG.padYDesktop}px ${STAT_CARD_CFG.padXDesktop}px;
            }
            ._statTitle{ font-size: ${STAT_CARD_CFG.titleDesktopPx}px; }
            ._statValue{ font-size: ${STAT_CARD_CFG.valueDesktopPx}px; }
            ._statSlot{ min-height: ${STAT_CARD_CFG.childrenSlotDesktop}px; }
          }

          /* ✅ Samakan tinggi 6 feature card */
          ._featureCard { height: ${FEATURE_CARD_CTRL.hMobile}px; }
          @media (min-width: 768px) { ._featureCard { height: ${FEATURE_CARD_CTRL.hDesktop}px; } }

          /* ✅ Ukuran teks feature */
          ._featureTitle{
            font-size: ${FEATURE_TEXT_CTRL.titleMobilePx}px;
            line-height: ${FEATURE_TEXT_CTRL.titleLineHeight};
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          ._featureDesc{
            font-size: ${FEATURE_TEXT_CTRL.descMobilePx}px;
            line-height: ${FEATURE_TEXT_CTRL.descLineHeight};
            display: -webkit-box;
            -webkit-line-clamp: ${FEATURE_CARD_CTRL.descLines};
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          ._featureIcon{ font-size: 22px; }
          @media (min-width: 768px) {
            ._featureTitle{ font-size: ${FEATURE_TEXT_CTRL.titleDesktopPx}px; }
            ._featureDesc{ font-size: ${FEATURE_TEXT_CTRL.descDesktopPx}px; }
            ._featureIcon{ font-size: 26px; }
          }

          /* ✅ Transform gambar SectionPutih (mobile) */
          ._spImg {
            transform:
              translate(${SECTION_PUTIH_IMG_CTRL.translateXMobile}px,
                        ${SECTION_PUTIH_IMG_CTRL.translateYMobile}px)
              scale(${SECTION_PUTIH_IMG_CTRL.scaleMobile});
            transform-origin: center center;
          }

          /* ✅ Turunkan konten di dalam SectionPutih (mobile) */
          ._spContent { transform: translateY(${SECTION_PUTIH_CONTENT_CTRL.yMobile}px); }

          /* ✅ Turunkan 3 tombol action (mobile) */
          ._actionsShift { transform: translateY(${ACTIONS_CTRL.yMobile}px); }

          @media (min-width: 768px) {
            ._spPad {
              padding-left: ${SECTION_PUTIH_CFG.padDesktopX}px;
              padding-right: ${SECTION_PUTIH_CFG.padDesktopX}px;
              padding-top: ${SECTION_PUTIH_CFG.padDesktopTop}px;
              padding-bottom: ${SECTION_PUTIH_CFG.padDesktopBottom}px;
            }

            /* ✅ Transform gambar SectionPutih (desktop) */
            ._spImg {
              transform:
                translate(${SECTION_PUTIH_IMG_CTRL.translateXDesktop}px,
                          ${SECTION_PUTIH_IMG_CTRL.translateYDesktop}px)
                scale(${SECTION_PUTIH_IMG_CTRL.scaleDesktop});
            }

            ._spContent { transform: translateY(${SECTION_PUTIH_CONTENT_CTRL.yDesktop}px); }
            ._actionsShift { transform: translateY(${ACTIONS_CTRL.yDesktop}px); }
          }
        `}</style>

        <div className="_pagePad">
          {/* Title */}
          <motion.div variants={fadeUp} className="text-center">
            <h1 className="text-white font-extrabold text-[34px] md:text-[44px] leading-tight">
              Paket Pro
            </h1>
            <p className="mt-2 text-white/85 text-[14px] md:text-[15px]">
              Atur dan cek status paket langganan Anda
            </p>
          </motion.div>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 justify-items-center items-stretch">
            <motion.div
              variants={statCardIn}
              custom={0}
              initial="hidden"
              animate="show"
              className="w-full flex justify-center"
            >
              <StatCard title="Durasi Langganan" value="3 Bulan" />
            </motion.div>

            <motion.div
              variants={statCardIn}
              custom={1}
              initial="hidden"
              animate="show"
              className="w-full flex justify-center"
            >
              <StatCard
                title="Masa Aktif"
                value="15 Hari Lagi"
                children={
                  <div className="w-full">
                    <div className="h-[6px] w-full rounded-full bg-white/35 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white/85"
                        style={{ width: `${clamp(progressPct, 0, 100)}%` }}
                      />
                    </div>
                  </div>
                }
              />
            </motion.div>

            <motion.div
              variants={statCardIn}
              custom={2}
              initial="hidden"
              animate="show"
              className="w-full flex justify-center"
            >
              <StatCard title="Jatuh Tempo" value="1 Januari 2026" />
            </motion.div>
          </div>

          {/* Actions (⚠️ _actionsShift pakai transform, jadi animasinya fade-only) */}
          <motion.div
            variants={fadeOnly}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center justify-center gap-4 _actionsShift"
          >
            <ActionButton onClick={() => {}}>Perpanjang Paket</ActionButton>
            <ActionButton onClick={() => {}}>Upgrade Paket</ActionButton>
            <ActionButton variant="danger" onClick={() => {}}>
              Batalkan Paket
            </ActionButton>
          </motion.div>

          {/* ✅ MANFAAT DI DALAM GAMBAR SectionPutih */}
          <div className="mt-10 flex justify-center">
            <div
              className="relative w-full"
              style={{ maxWidth: SECTION_PUTIH_CFG.maxW }}
            >
              {/* ⚠️ _spImg pakai transform, jadi animasinya opacity/blur saja */}
              <motion.img
                variants={fadeOnly}
                initial="hidden"
                animate="show"
                src={SectionPutih}
                alt="SectionPutih"
                className="w-full h-auto select-none _spImg"
                draggable="false"
              />

              {/* Overlay konten: wrapper animasi fade-only (biar _spContent tetap jalan) */}
              <motion.div
                variants={fadeOnly}
                initial="hidden"
                animate="show"
                className="absolute inset-0 z-10"
              >
                <div
                  className="_spPad _spContent"
                  style={{
                    paddingLeft: SECTION_PUTIH_CFG.padMobileX,
                    paddingRight: SECTION_PUTIH_CFG.padMobileX,
                    paddingTop: SECTION_PUTIH_CFG.padMobileTop,
                    paddingBottom: SECTION_PUTIH_CFG.padMobileBottom,
                  }}
                >
                  <h2 className="text-[22px] md:text-[26px] font-extrabold text-gray-900">
                    Fitur yang Didapatkan
                  </h2>

                  <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {[
                      {
                        icon: HiOutlineChatBubbleLeftRight,
                        title: "300 percakapan/bulan",
                        desc: "Bisa melayani hingga 300 interaksi pelanggan setiap bulannya.",
                      },
                      {
                        icon: HiOutlineSquares2X2,
                        title: "Template balasan standar",
                        desc: "Tersedia kumpulan template siap pakai untuk mempercepat balasan.",
                      },
                      {
                        icon: HiOutlineClock,
                        title: "Balasan otomatis 24/7",
                        desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja.",
                      },
                      {
                        icon: HiOutlineChartBar,
                        title: "Statistik bulanan sederhana",
                        desc: "Lihat ringkasan performa chatbot secara jelas setiap bulan.",
                      },
                      {
                        icon: HiOutlineDevicePhoneMobile,
                        title: "Integrasi WhatsApp mudah",
                        desc: "Cukup beberapa langkah untuk langsung terhubung ke WhatsApp Anda.",
                      },
                      {
                        icon: HiOutlineQuestionMarkCircle,
                        title: "FAQ dasar bawaan",
                        desc: "Sudah dilengkapi jawaban FAQ umum agar chatbot bisa langsung bekerja.",
                      },
                    ].map((it, i) => (
                      <motion.div
                        key={it.title}
                        variants={featureIn}
                        custom={i}
                        initial="hidden"
                        animate="show"
                      >
                        <FeatureCard
                          icon={it.icon}
                          title={it.title}
                          desc={it.desc}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          {/* /manfaat */}
        </div>
      </div>
    </motion.div>
  );
}
