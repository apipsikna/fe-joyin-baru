// src/PaketDashboard/SectionPro/MyPackagesPro.jsx
import React, { useState } from "react";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineBell,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineSquares2X2,
  HiOutlinePresentationChartLine,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { motion, useReducedMotion } from "framer-motion";

import SectionPutih from "../../assets/SectionPutih.png";

// ✅ Gradasi background
const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

const PAGE_CFG = {
  maxW: 3000,
  pxMobile: 20,
  pxDesktop: 32,
  pt: 48,
  pb: 0,
};

/* =======================
   ✅ STAT CARD
   ======================= */
const STAT_CARD_CFG = {
  maxW: 380,
  radius: 22,

  minHMobile: 132,
  minHDesktop: 140,

  padXMobile: 28,
  padYMobile: 22,
  padXDesktop: 30,
  padYDesktop: 26,

  titleMobilePx: 16,
  titleDesktopPx: 18,
  valueMobilePx: 28,
  valueDesktopPx: 30,

  childrenSlotMobile: 16,
  childrenSlotDesktop: 18,
};

/* =======================
   ✅ WADAH PUTIH (padding konten)
   ======================= */
const SECTION_PUTIH_CFG = {
  maxW: 2000,

  padMobileX: 18,
  padMobileTop: 40,
  padMobileBottom: 90,

  padDesktopX: 110,
  padDesktopTop: 300,
  padDesktopBottom: 180,
};

/* =======================
   ✅ PANJANGKAN CONTAINER PUTIH (min-height)
   ======================= */
const SECTION_PUTIH_WRAP_CTRL = {
  minHMobile: 760,
  minHDesktop: 980,
};

/* =======================
   ✅ POSISI & BESAR “background” SectionPutih
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
   ✅ TURUNKAN KONTEN “Fitur yang Didapatkan”
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
   ✅ FEATURE CARD (hover naik + shadow)
   ======================= */
const FEATURE_CARD_CTRL = {
  radius: 18,
  borderPx: 1.5,

  hMobile: 112,
  hDesktop: 120,

  padXMobile: 22,
  padYMobile: 18,

  padXDesktop: 26,
  padYDesktop: 20,

  gapMobile: 14,
  gapDesktop: 16,

  iconMobile: 22,
  iconDesktop: 24,

  descLines: 2,

  hoverLiftPx: 6,
  shadowBase: "0 10px 24px rgba(0,0,0,0.08)",
  shadowHover: "0 20px 48px rgba(0,0,0,0.16)",
};

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
      <div>
        <div className="_statTitle text-white/90 font-semibold">{title}</div>
        <div className="_statValue mt-1 text-white font-extrabold tracking-tight">
          {value}
        </div>
      </div>

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
    <div className="_featureOuter w-full">
      <div className="_featureInner">
        <div className="_featureRow">
          <div className="_featureIconWrap">
            <Icon className="_featureIcon" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="_featureTitle">{title}</div>
            <div className="_featureDesc">{desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export default function MyPackagesPro() {
  const [progressPct] = useState(78);

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

  const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(7px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.6, ease: EASE },
    },
  };

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
      // ✅ scroll tetap bisa, tapi scrollbar DISAMARKAN (yang kanan itu)
      className="w-full overflow-x-hidden font-poppins _vh _noScrollbar"
      style={{
        background: `linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
        overflowY: "auto",
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
          /* ✅ Viewport height stabil + scroll container */
          ._vh{ height: 100vh; height: 100dvh; }

          /* ✅ Hilangkan scrollbar (WAJIB: di container scroll + juga html/body) */
          html, body{
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar{
            width: 0 !important;
            height: 0 !important;
            display: none !important;
          }

          ._noScrollbar{
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          ._noScrollbar::-webkit-scrollbar{
            width: 0 !important;
            height: 0 !important;
            display: none !important;
          }

          /* ✅ Matikan outline bawaan tombol */
          .joyin-btn { outline: none; }
          .joyin-btn:focus, .joyin-btn:focus-visible, .joyin-btn:active { outline: none; }
          .joyin-btn::-moz-focus-inner { border: 0; }

          .joyin-btn--glow:hover {
            box-shadow:
              0 0 28px rgba(255, 255, 255, 0.98),
              0 20px 55px rgba(0, 0, 0, 0.30);
          }

          /* =======================
             ✅ STAT CARD
             ======================= */
          ._statCard{
            max-width: ${STAT_CARD_CFG.maxW}px;
            border-radius: ${STAT_CARD_CFG.radius}px;
            min-height: ${STAT_CARD_CFG.minHMobile}px;
            padding: ${STAT_CARD_CFG.padYMobile}px ${STAT_CARD_CFG.padXMobile}px;
          }
          ._statTitle{ font-size: ${STAT_CARD_CFG.titleMobilePx}px; }
          ._statValue{
            font-size: ${STAT_CARD_CFG.valueMobilePx}px;
            line-height: 1.1;
          }
          ._statSlot{ min-height: ${STAT_CARD_CFG.childrenSlotMobile}px; }

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

          /* =======================
             ✅ PANJANGKAN SECTION PUTIH (min-height)
             ======================= */
          ._spWrap{
            min-height: ${SECTION_PUTIH_WRAP_CTRL.minHMobile}px;
          }
          @media (min-width: 768px){
            ._spWrap{
              min-height: ${SECTION_PUTIH_WRAP_CTRL.minHDesktop}px;
            }
          }

          /* =======================
             ✅ BACKGROUND SectionPutih (stretch)
             ======================= */
          ._spBg{
            background-image: url("${SectionPutih}");
            background-repeat: no-repeat;
            background-position: center top;
            background-size: 100% 100%;
          }

          /* =======================
             ✅ FEATURE CARD + HOVER (naik + shadow)
             ======================= */
          ._featureOuter{
            height: ${FEATURE_CARD_CTRL.hMobile}px;
            border-radius: ${FEATURE_CARD_CTRL.radius}px;
            padding: ${FEATURE_CARD_CTRL.borderPx}px;
            background: linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%);
            box-shadow: ${FEATURE_CARD_CTRL.shadowBase};
            transform: translateY(0);
            transition: transform 180ms ease-out, box-shadow 200ms ease-out;
            will-change: transform, box-shadow;
          }
          ._featureOuter:hover{
            transform: translateY(-${FEATURE_CARD_CTRL.hoverLiftPx}px);
            box-shadow: ${FEATURE_CARD_CTRL.shadowHover};
          }
          ._featureOuter:active{
            transform: translateY(-2px);
          }
          @media (prefers-reduced-motion: reduce){
            ._featureOuter{ transition: none !important; }
          }

          ._featureInner{
            height: 100%;
            width: 100%;
            background: #fff;
            border-radius: ${FEATURE_CARD_CTRL.radius - 3}px;
            padding: ${FEATURE_CARD_CTRL.padYMobile}px ${FEATURE_CARD_CTRL.padXMobile}px;
          }
          ._featureRow{
            height: 100%;
            display: flex;
            gap: ${FEATURE_CARD_CTRL.gapMobile}px;
            align-items: flex-start;
          }
          ._featureIconWrap{ margin-top: 2px; flex: 0 0 auto; color: #111827; }
          ._featureIcon{ font-size: ${FEATURE_CARD_CTRL.iconMobile}px; }

          ._featureTitle{
            font-size: ${FEATURE_TEXT_CTRL.titleMobilePx}px;
            line-height: ${FEATURE_TEXT_CTRL.titleLineHeight};
            font-weight: 700;
            color: #111827;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          ._featureDesc{
            margin-top: 6px;
            font-size: ${FEATURE_TEXT_CTRL.descMobilePx}px;
            line-height: ${FEATURE_TEXT_CTRL.descLineHeight};
            color: rgba(107,114,128,1);
            display: -webkit-box;
            -webkit-line-clamp: ${FEATURE_CARD_CTRL.descLines};
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          @media (min-width: 768px){
            ._featureOuter{ height: ${FEATURE_CARD_CTRL.hDesktop}px; }
            ._featureInner{
              padding: ${FEATURE_CARD_CTRL.padYDesktop}px ${FEATURE_CARD_CTRL.padXDesktop}px;
            }
            ._featureRow{ gap: ${FEATURE_CARD_CTRL.gapDesktop}px; }
            ._featureIcon{ font-size: ${FEATURE_CARD_CTRL.iconDesktop}px; }
            ._featureTitle{ font-size: ${FEATURE_TEXT_CTRL.titleDesktopPx}px; }
            ._featureDesc{ font-size: ${FEATURE_TEXT_CTRL.descDesktopPx}px; }
          }

          /* ✅ Transform background SectionPutih */
          ._spImg {
            transform:
              translate(${SECTION_PUTIH_IMG_CTRL.translateXMobile}px,
                        ${SECTION_PUTIH_IMG_CTRL.translateYMobile}px)
              scale(${SECTION_PUTIH_IMG_CTRL.scaleMobile});
            transform-origin: center center;
          }

          ._spContent { transform: translateY(${SECTION_PUTIH_CONTENT_CTRL.yMobile}px); }
          ._actionsShift { transform: translateY(${ACTIONS_CTRL.yMobile}px); }

          @media (min-width: 768px) {
            ._spPad {
              padding-left: ${SECTION_PUTIH_CFG.padDesktopX}px;
              padding-right: ${SECTION_PUTIH_CFG.padDesktopX}px;
              padding-top: ${SECTION_PUTIH_CFG.padDesktopTop}px;
              padding-bottom: ${SECTION_PUTIH_CFG.padDesktopBottom}px;
            }

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

          {/* Actions */}
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

          {/* ✅ MANFAAT (dipanjangin sampai bawah) */}
          <div className="mt-10 flex justify-center">
            <div
              className="relative w-full _spWrap"
              style={{ maxWidth: SECTION_PUTIH_CFG.maxW }}
            >
              {/* Background image stretch */}
              <motion.div
                variants={fadeOnly}
                initial="hidden"
                animate="show"
                className="absolute inset-0 _spBg _spImg"
                aria-hidden="true"
              />

              {/* Konten */}
              <motion.div
                variants={fadeOnly}
                initial="hidden"
                animate="show"
                className="absolute inset-0 z-10"
              >
                <div
                  className="_spPad _spContent h-full"
                  style={{
                    paddingLeft: SECTION_PUTIH_CFG.padMobileX,
                    paddingRight: SECTION_PUTIH_CFG.padMobileX,
                    paddingTop: SECTION_PUTIH_CFG.padMobileTop,
                    paddingBottom: SECTION_PUTIH_CFG.padMobileBottom,
                  }}
                >
                  <h2 className="text-[24px] md:text-[28px] font-extrabold text-gray-900">
                    Fitur yang Didapatkan
                  </h2>

                  <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {[
                      {
                        icon: HiOutlineChatBubbleLeftRight,
                        title: "1000 percakapan/bulan",
                        desc: "Bisa melayani hingga 1000 interaksi pelanggan setiap bulannya.",
                      },
                      {
                        icon: HiOutlinePresentationChartLine,
                        title: "Statistik & insight pelanggan",
                        desc: "Lihat performa chat dan perilaku pelanggan untuk memahami kebutuhan mereka.",
                      },
                      {
                        icon: HiOutlineClock,
                        title: "Balasan otomatis 24/7",
                        desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja.",
                      },
                      {
                        icon: HiOutlineSquares2X2,
                        title: "Template balasan Custom",
                        desc: "Buat dan atur template balasan sesuai gaya bisnis kamu.",
                      },
                      {
                        icon: HiOutlineBell,
                        title: "Notifikasi chat masuk",
                        desc: "Dapatkan pemberitahuan instan tiap ada pelanggan yang mengirim pesan.",
                      },
                      {
                        icon: HiOutlineArrowPath,
                        title: "Auto-update FAQ produk",
                        desc: "FAQ langsung diperbarui otomatis setiap kali kamu ubah data produk.",
                      },
                      {
                        icon: HiOutlineChatBubbleBottomCenterText,
                        title: "Pesan sambutan personal",
                        desc: "Chatbot menyapa pelanggan dengan salam pembuka yang kamu tentukan sendiri.",
                      },
                    ].map((it, i) => (
                      <motion.div
                        key={it.title}
                        variants={featureIn}
                        custom={i}
                        initial="hidden"
                        animate="show"
                      >
                        <FeatureCard icon={it.icon} title={it.title} desc={it.desc} />
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
