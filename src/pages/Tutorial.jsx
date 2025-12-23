// src/pages/Tutorial.jsx
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import SectionTutorial from "../assets/SectionTutor.png";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Images
import imgGettingStarted from "../assets/tutorial/getting_started.png";
import imgCreateChatbot from "../assets/tutorial/create_chatbot.png";
import imgConnectWhatsapp from "../assets/tutorial/connect_whatsapp.png";
import imgAutoReply from "../assets/tutorial/auto_reply.png";
import imgImportContacts from "../assets/tutorial/import_contacts.png";
import imgBroadcast from "../assets/tutorial/broadcast.png";
import imgReferral from "../assets/tutorial/referral.png";
import imgAnalytics from "../assets/tutorial/analytics.png";
import imgUpgrade from "../assets/tutorial/upgrade.png";

/* ====================== SectionTutorial Image Config ====================== */
const IMG_DEFAULT = {
  scale: 1.28,
  x: 0,
  y: -30,
};

/* ====================== Search Bar Config (adjustable) ====================== */
const SEARCH_DEFAULT = {
  scale: 0.9, // 1 = normal
  x: 0, // px
  y: -130, // px
  w: 1, // width multiplier (1 = 100% container)
};

/* ====================== Text Config (adjustable) ====================== */
const TEXT_DEFAULT = {
  x: -100,
  y: -180,
};

// ✅ 1 halaman tampilkan 9 kartu (3 baris x 3 kolom)
const PAGE_SIZE = 9;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
function readNum(qp, key, fallback) {
  const raw = qp.get(key);
  if (raw == null || raw === "") return fallback;
  const v = Number(String(raw).replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

/* ====================== Real Tutorial Cards ====================== */
const TUTORIALS = [
  { id: "t1", date: "10 Oktober 2025", title: "Cara Memulai dengan\nJoyin Dashboard", image: imgGettingStarted },
  { id: "t2", date: "12 Oktober 2025", title: "Cara Membuat Chatbot\nPertama Kamu", image: imgCreateChatbot },
  { id: "t3", date: "14 Oktober 2025", title: "Cara Menghubungkan\nWhatsApp ke Joyin", image: imgConnectWhatsapp },
  { id: "t4", date: "15 Oktober 2025", title: "Cara Membuat Template\nBalasan Otomatis", image: imgAutoReply },
  { id: "t5", date: "16 Oktober 2025", title: "Cara Mengimpor Kontak\ndari File CSV", image: imgImportContacts },
  { id: "t6", date: "18 Oktober 2025", title: "Cara Mengirim Broadcast\nke Banyak Kontak", image: imgBroadcast },
  { id: "t7", date: "20 Oktober 2025", title: "Cara Mendapatkan Link\nReferral Joyin", image: imgReferral },
  { id: "t8", date: "22 Oktober 2025", title: "Cara Melihat Statistik\nChat Bulanan", image: imgAnalytics },
  { id: "t9", date: "25 Oktober 2025", title: "Cara Upgrade Paket\nJoyin ke Pro", image: imgUpgrade },
];

/* ====================== Icons ====================== */
function CalendarIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" className={className} aria-hidden fill="none">
      <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" className={className} aria-hidden fill="none">
      <path
        d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.7 16.7 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ dir = "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none">
      {dir === "left" ? (
        <path
          d="M15 5 8 12l7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function ImagePlaceholder() {
  return (
    <div className="grid place-items-center">
      <div className="w-[92px] h-[92px] rounded-2xl border-[3px] border-white/70 grid place-items-center">
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden fill="none">
          <path
            d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v11A2.5 2.5 0 0 1 16.5 20h-9A2.5 2.5 0 0 1 5 17.5v-11Z"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M7.5 16l3.2-3.2 2.2 2.1 1.5-1.4L18 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ====================== ELEGANT & SIMPLE ANIMATION VARIANTS ====================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Relaxed stagger
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// "Soft Zoom" - Clean & Elegant
const heroImageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
};

// "Clean Slide Up"
const heroTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

/* ====================== Component ====================== */
function TutorialCard({ date, title, image }) {
  const { t } = useTranslation();
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -5,
        boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-[0_18px_40px_rgba(0,0,0,0.06)] cursor-pointer"
    >
      <div className="h-[160px] md:h-[190px] bg-[#EEEEEE] flex items-center justify-center relative overflow-hidden group">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <ImagePlaceholder />
        )}
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shine_1s_ease-in-out_infinite]" />
      </div>

      <div className="bg-white px-8 pt-6 pb-7">
        <div className="flex items-center gap-2 text-[13px] text-gray-300 font-semibold">
          <CalendarIcon className="text-gray-300" />
          <span>{date}</span>
        </div>

        <h3 className="mt-3 text-[20px] md:text-[22px] leading-snug font-extrabold text-gray-900 whitespace-pre-line">
          {title}
        </h3>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            className="text-emerald-500 font-semibold text-[15px] hover:opacity-80 inline-flex items-center gap-2 group"
          >
            {t("tutorial.view", "Lihat")}
            <motion.span
              animate={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Tutorial() {
  const location = useLocation();
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // ✅ query param untuk gambar
  const img = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    const scale = clamp(readNum(qp, "stut_scale", IMG_DEFAULT.scale), 0.3, 3.5);
    const x = clamp(readNum(qp, "stut_x", IMG_DEFAULT.x), -800, 800);
    const y = clamp(readNum(qp, "stut_y", IMG_DEFAULT.y), -800, 800);
    return { scale, x, y };
  }, [location.search]);

  // ✅ query param untuk search
  const searchCfg = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    const scale = clamp(readNum(qp, "s_scale", SEARCH_DEFAULT.scale), 0.7, 1.6);
    const x = clamp(readNum(qp, "s_x", SEARCH_DEFAULT.x), -800, 800);
    const y = clamp(readNum(qp, "s_y", SEARCH_DEFAULT.y), -800, 800);
    const w = clamp(readNum(qp, "s_w", SEARCH_DEFAULT.w), 0.6, 1.2);
    return { scale, x, y, w };
  }, [location.search]);

  // ✅ query param untuk text
  const textCfg = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    const x = clamp(readNum(qp, "txt_x", TEXT_DEFAULT.x), -800, 800);
    const y = clamp(readNum(qp, "txt_y", TEXT_DEFAULT.y), -800, 800);
    return { x, y };
  }, [location.search]);

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return TUTORIALS;
    return TUTORIALS.filter((t) =>
      String(t.title).replace(/\n/g, " ").toLowerCase().includes(key)
    );
  }, [q]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length]
  );

  useLayoutEffect(() => {
    setPage((p) => clamp(p, 1, totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pagesArr = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className="w-screen min-h-screen font-poppins overflow-x-hidden bg-white text-black">

      <main className="pt-24 md:pt-28">
        {/* SectionTutorial (Floating Hero) */}
        <section className="w-full">
          <div className="relative w-full max-w-[1280px] mx-auto px-4 md:px-10">
            {/* Animated Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={heroImageVariants}
              className="relative z-0"
              style={{
                translateX: img.x,
                translateY: img.y,
              }}
            >
              <motion.img
                src={SectionTutorial}
                alt="Section Tutorial"
                draggable={false}
                className="w-full h-auto select-none pointer-events-none block"
                animate={{
                  // Subtle bobbing (reduced intensity)
                  y: [0, -8, 0],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  scale: img.scale,
                  originX: 0.5,
                  originY: 0,
                }}
              />
            </motion.div>

            {/* Overlay Text */}
            <div
              className="absolute inset-x-0 top-1/2 px-6 md:px-12 lg:px-16 flex items-center z-10"
              style={{
                transform: `translate3d(${textCfg.x}px, calc(-50% + ${textCfg.y}px), 0)`,
              }}
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={heroTextVariants}
                className="max-w-2xl text-left"
              >
                <h1 className="text-white text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-4 md:mb-6 leading-tight drop-shadow-md">
                  {t("tutorial.headerTitle", "Pusat Tutorial Joyin")}
                </h1>
                <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed drop-shadow-sm max-w-xl">
                  {t("tutorial.headerDesc", "Di sini kamu bisa belajar cara menggunakan chatbot, cara mengintegrasikan ke berbagai platform, dan cara membuat ucapan yang menarik. Semua panduan dibuat simpel supaya kamu bisa langsung praktik.")}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEARCH BAR */}
        <section className="w-full mt-8 md:mt-10 relative z-20">
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: searchCfg.scale, y: searchCfg.y }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="relative origin-top"
              style={{
                translateX: searchCfg.x,
              }}
            >
              <div className="mx-auto" style={{ width: `${searchCfg.w * 100}%` }}>
                <div className="relative group">
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder={t("tutorial.search", "Cari Tutorial...")}
                    className="w-full h-[56px] md:h-[62px] rounded-full bg-white border border-gray-200
                               px-7 pr-16 text-[18px] md:text-[20px] font-semibold text-gray-800
                               placeholder:text-gray-300 outline-none
                               shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                               transition-all duration-300
                               focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:shadow-lg"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors duration-300">
                    <SearchIcon />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* GRID 3 KOLOM */}
        <section className="w-full mx-auto px-4 md:px-10 mt-12 md:mt-14 pb-6 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page + q} // Re-trigger animation on page change or search change
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
            >
              {pageItems.map((t) => (
                <TutorialCard
                  key={t.id}
                  date={t.date}
                  title={t.title}
                  image={t.image}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ease: "easeOut" }}
              className="mt-16 md:mt-20 flex items-center justify-center gap-6"
            >
              {/* Prev */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`h-11 w-11 rounded-xl grid place-items-center border transition-all duration-300
                  ${page === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-400 hover:border-emerald-200 hover:text-emerald-500 hover:scale-105 active:scale-95"
                  }`}
                aria-label={t("tutorial.prev", "Sebelumnya")}
              >
                <ArrowIcon dir="left" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-3">
                {pagesArr.map((p) => {
                  const active = p === page;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`h-11 w-11 rounded-xl border text-[14px] font-semibold transition-all duration-300
                        ${active
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_10px_26px_rgba(16,185,129,0.45)] scale-110"
                          : "bg-white border-gray-200 text-gray-300 hover:border-emerald-200 hover:text-emerald-500 hover:scale-105"
                        }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Info */}
              <p className="hidden md:block text-gray-300 font-semibold">
                {t("tutorial.page", { current: page, total: totalPages, defaultValue: `Halaman ${page} dari ${totalPages}` })}
              </p>

              {/* Next */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`h-11 w-11 rounded-xl grid place-items-center border transition-all duration-300
                  ${page === totalPages
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-emerald-300 text-emerald-500 hover:border-emerald-400 hover:scale-105 active:scale-95"
                  }`}
                aria-label={t("tutorial.next", "Berikutnya")}
              >
                <ArrowIcon dir="right" />
              </button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <p className="md:hidden mt-5 text-center text-gray-300 font-semibold">
              {t("tutorial.page", { current: page, total: totalPages, defaultValue: `Halaman ${page} dari ${totalPages}` })}
            </p>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}
