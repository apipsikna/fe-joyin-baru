// src/pages/Tutorial.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer";
import SectionTutorial from "../assets/SectionTutorial.png";

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

// ✅ 1 halaman tampilkan 9 kartu (3 baris x 3 kolom)
const PAGE_SIZE = 9;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
function readNum(qp, key, fallback) {
  const raw = qp.get(key);
  if (raw == null || raw === "") return fallback;
  const v = Number(String(raw).replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

/* ====================== Dummy Tutorial Cards (12 items biar pagination kepake) ====================== */
const TUTORIALS = [
  { id: "t1", date: "10 Oktober 2025", title: "Cara Membuat Chatbot\nPertama Kamu" },
  { id: "t2", date: "10 Oktober 2025", title: "Cara Mendapatkan Link\nReferral Joyin" },
  { id: "t3", date: "10 Oktober 2025", title: "Cara Upgrade / Downgrade\nPaket" },
  { id: "t4", date: "10 Oktober 2025", title: "Tips Membuat Chatbot yang\nLebih Personal" },
  { id: "t5", date: "10 Oktober 2025", title: "Cara Menambahkan Balasan\nOtomatis Berbasis Kata Kunci" },
  { id: "t6", date: "10 Oktober 2025", title: "Cara Mengimpor Kontak dari\nFile CSV/Excel" },
  { id: "t7", date: "10 Oktober 2025", title: "Cara Menghubungkan\nWhatsApp ke Joyin" },
  { id: "t8", date: "10 Oktober 2025", title: "Cara Membuat Template\nBalasan Otomatis" },
  { id: "t9", date: "10 Oktober 2025", title: "Cara Melihat Statistik\nChat Bulanan" },
  // ekstra (biar tombol halaman tampil)
  { id: "t10", date: "10 Oktober 2025", title: "Cara Mengatur\nKeyword & Intent" },
  { id: "t11", date: "10 Oktober 2025", title: "Cara Menambahkan\nAdmin Tim" },
  { id: "t12", date: "10 Oktober 2025", title: "Cara Export\nRiwayat Chat" },
];

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

function TutorialCard({ date, title }) {
  return (
    <div className="rounded-[28px] overflow-hidden bg-white border border-gray-100 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
      <div className="h-[160px] md:h-[190px] bg-[#EEEEEE] flex items-center justify-center">
        <ImagePlaceholder />
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
            className="text-emerald-500 font-semibold text-[15px] hover:opacity-80 inline-flex items-center gap-2"
            onClick={() => {}}
          >
            Lihat <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tutorial() {
  const location = useLocation();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // ✅ query param untuk gambar:
  // ?stut_scale=1.2&stut_x=20&stut_y=-30
  const img = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    const scale = clamp(readNum(qp, "stut_scale", IMG_DEFAULT.scale), 0.3, 3.5);
    const x = clamp(readNum(qp, "stut_x", IMG_DEFAULT.x), -800, 800);
    const y = clamp(readNum(qp, "stut_y", IMG_DEFAULT.y), -800, 800);
    return { scale, x, y };
  }, [location.search]);

  // ✅ query param untuk search:
  // ?s_scale=1.05&s_x=0&s_y=10&s_w=1
  const searchCfg = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    const scale = clamp(readNum(qp, "s_scale", SEARCH_DEFAULT.scale), 0.7, 1.6);
    const x = clamp(readNum(qp, "s_x", SEARCH_DEFAULT.x), -800, 800);
    const y = clamp(readNum(qp, "s_y", SEARCH_DEFAULT.y), -800, 800);
    const w = clamp(readNum(qp, "s_w", SEARCH_DEFAULT.w), 0.6, 1.2);
    return { scale, x, y, w };
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

  useEffect(() => {
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
      <Navbar />

      <main className="pt-24 md:pt-28">
        {/* SectionTutorial (adjustable) */}
        <section className="w-full">
          <div className="relative w-full max-w-[1280px] mx-auto px-4 md:px-10">
            <img
              src={SectionTutorial}
              alt="Section Tutorial"
              draggable={false}
              className="w-full h-auto select-none pointer-events-none block"
              style={{
                transform: `translate3d(${img.x}px, ${img.y}px, 0) scale(${img.scale})`,
                transformOrigin: "center top",
                willChange: "transform",
              }}
            />
          </div>
        </section>

        {/* SEARCH BAR (adjustable) */}
        <section className="w-full mt-8 md:mt-10">
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10">
            <div
              className="relative"
              style={{
                transform: `translate3d(${searchCfg.x}px, ${searchCfg.y}px, 0) scale(${searchCfg.scale})`,
                transformOrigin: "center top",
                willChange: "transform",
              }}
            >
              <div className="mx-auto" style={{ width: `${searchCfg.w * 100}%` }}>
                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Cari Tutorial..."
                    className="w-full h-[56px] md:h-[62px] rounded-full bg-white border border-gray-200
                               px-7 pr-16 text-[18px] md:text-[20px] font-semibold text-gray-800
                               placeholder:text-gray-300 outline-none
                               shadow-[0_8px_18px_rgba(0,0,0,0.06)]
                               focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                    <SearchIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRID 3 KOLOM (1 halaman berisi 9 kartu) */}
        <section className="w-full mx-auto px-4 md:px-10 mt-12 md:mt-14 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {pageItems.map((t) => (
              <TutorialCard key={t.id} date={t.date} title={t.title} />
            ))}
          </div>

          {/* ✅ TOMBOL HALAMAN (di bawah kolom paling bawah) */}
          {totalPages > 1 && (
            <div className="mt-16 md:mt-20 flex items-center justify-center gap-6">
              {/* Prev */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`h-11 w-11 rounded-xl grid place-items-center border transition
                  ${
                    page === 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-400 hover:border-emerald-200 hover:text-emerald-500"
                  }`}
                aria-label="Sebelumnya"
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
                      className={`h-11 w-11 rounded-xl border text-[14px] font-semibold transition
                        ${
                          active
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-gray-200 text-gray-300 hover:border-emerald-200 hover:text-emerald-500"
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
                Halaman {page} dari {totalPages}
              </p>

              {/* Next */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`h-11 w-11 rounded-xl grid place-items-center border transition
                  ${
                    page === totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-emerald-300 text-emerald-500 hover:border-emerald-400"
                  }`}
                aria-label="Berikutnya"
              >
                <ArrowIcon dir="right" />
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="md:hidden mt-5 text-center text-gray-300 font-semibold">
              Halaman {page} dari {totalPages}
            </p>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}
