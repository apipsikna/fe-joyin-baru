// src/landingpage/TentangKami.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer";

import bintang from "../assets/bintang2.png";
import bintangkecil from "../assets/bintangkecil.png";
import maskot from "../assets/bintangKiri.png";
import JoyCemerlang from "../assets/JoyCemerlang.png";

// ===== SETTING UKURAN MASING-MASING BINTANG =====
// Ubah angka di sini kalau mau ganti ukuran per bintang (dalam px)
const STAR_SIZE = {
  h1: 56,
  h2: 56,
  h3: 40,
  h4: 44,
  b1: 32,
  b2: 56,
  b3: 32,
};

export default function TentangKami() {
  // ===== Konfigurasi default maskot =====
  const DEFAULT_MASCOT = {
    side: "left",
    width: 400,
    outside: 5000,
    translateY: 24,
    rotate: 34,
    flip: true,
    showOnMobile: true,
    peek: -247,
  };

  // ===== Override via query params (opsional) =====
  const qp = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const M = {
    side:
      qp.get("m_side") === "right"
        ? "right"
        : qp.get("m_side") === "left"
        ? "left"
        : DEFAULT_MASCOT.side,
    width: Number(qp.get("m_w") || DEFAULT_MASCOT.width),
    outside: Number(qp.get("m_out") || DEFAULT_MASCOT.outside),
    translateY: Number(qp.get("m_y") || DEFAULT_MASCOT.translateY),
    rotate: Number(qp.get("m_rot") || DEFAULT_MASCOT.rotate),
    flip:
      qp.get("m_flip") === "1"
        ? true
        : qp.get("m_flip") === "0"
        ? false
        : DEFAULT_MASCOT.flip,
    showOnMobile:
      qp.get("m_mobile") === "1" ? true : DEFAULT_MASCOT.showOnMobile,
    peek: Number(qp.get("m_peek") || DEFAULT_MASCOT.peek),
  };

  // ====== UTIL ======
  const num = (key, fallback) => {
    const v = qp.get(key);
    return v !== null ? Number(v) : fallback;
  };
  const bool = (key, fallback = true) => {
    const v = qp.get(key);
    if (v === null) return fallback;
    return v === "1" || v === "true";
  };

  // ===== Hitung posisi maskot =====
  const maxOutside = Math.max(0, M.width - M.peek);
  const safeOutside = Math.min(M.outside, maxOutside);
  const sidePos =
    M.side === "left"
      ? { left: `-${safeOutside}px` }
      : { right: `-${safeOutside}px` };

  const transformOrigin = !M.flip
    ? M.side === "left"
      ? "bottom left"
      : "bottom right"
    : M.side === "left"
    ? "bottom right"
    : "bottom left";

  const mascotStyle = {
    position: "absolute",
    bottom: 0,
    ...sidePos,
    width: `${M.width}px`,
    transform: `translateY(${M.translateY}px) rotate(${M.rotate}deg) ${
      M.flip ? "scaleX(-1)" : ""
    }`,
    transformOrigin,
    zIndex: 10,
  };

  // ====== BINTANG: default + override via query params ======
  const STAR_DEFAULTS = {
    // ⭐ HERO: 4 bintang (2 kiri, 2 kanan) — posisi & rotasi
    hero: [
      // Kiri atas
      { id: "h1", left: 40, top: 70, rotate: -10 },
      // Kiri agak tengah
      { id: "h4", left: 130, top: 170, rotate: 8 },
      // Kanan atas (agak tengah)
      { id: "h2", right: 70, top: 80, rotate: 6 },
      // Kanan bawah
      { id: "h3", right: 90, top: 190, rotate: -4 },
    ],
    // ⭐ BODY: posisi section bawah
    body: [
      { id: "b1", left: 64, top: 16, rotate: 0 },
      { id: "b2", left: 48, top: 160, rotate: 0 },
      { id: "b3", left: 192, top: 240, rotate: 0 },
    ],
  };

  const overrideStar = (d) => ({
    id: d.id,
    left:
      qp.get(`${d.id}_l`) !== null
        ? num(`${d.id}_l`, d.left ?? null)
        : d.left ?? null,
    right:
      qp.get(`${d.id}_r`) !== null
        ? num(`${d.id}_r`, d.right ?? null)
        : d.right ?? null,
    top: num(`${d.id}_t`, d.top ?? 0),
    // kalau ada query param {id}_w pakai itu, kalau tidak pakai STAR_SIZE
    w: num(`${d.id}_w`, STAR_SIZE[d.id] ?? 28),
    rotate: num(`${d.id}_rot`, d.rotate ?? 0),
    show: bool(`${d.id}_show`, true),
  });

  const STAR_HERO = STAR_DEFAULTS.hero.map(overrideStar);
  const STAR_BODY = STAR_DEFAULTS.body.map(overrideStar);

  const starStyle = (s) => {
    const width = s.w ?? 28;
    const st = {
      position: "absolute",
      top: `${s.top}px`,
      width: `${width}px`,
      transform: s.rotate ? `rotate(${s.rotate}deg)` : undefined,
      zIndex: 6,
    };
    if (s.right !== null && s.right !== undefined) st.right = `${s.right}px`;
    else st.left = `${s.left}px`;
    return st;
  };

  // ===== Offset hero agar tepat di bawah navbar =====
  const navWrapRef = useRef(null);
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    const wrap = navWrapRef.current;
    if (!wrap) return;
    const navEl = wrap.querySelector("nav") || wrap.firstElementChild || wrap;
    if (!navEl) return;

    const compute = () => {
      const style = window.getComputedStyle(navEl);
      const pos = style.position;
      const h = Math.round(navEl.getBoundingClientRect().height || 0);
      setHeroOffset(pos === "fixed" || pos === "sticky" ? h : 0);
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(navEl);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="w-screen min-h-screen font-poppins overflow-x-hidden bg-white">
      {/* Bungkus Navbar agar bisa diukur */}
      <div ref={navWrapRef}>
        <Navbar />
      </div>

      {/* ==== HERO TENTANG JOYIN ==== */}
      <section
        className="relative w-full pt-8 pb-36 min-h-[560px]"
        style={{
          marginTop: heroOffset ? `${heroOffset}px` : undefined,
          background:
            "linear-gradient(180deg, \
#56C8AD 0%, \
#8BD4B7 18%, \
#BDE7A6 38%, \
#DAE88E 62%, \
#E6F0A9 78%, \
#EFF5C7 88%, \
#F7FAE6 96%, \
#FFFFFF 100%)",
        }}
      >
        {/* Bintang dekor (HERO) */}
        {STAR_HERO.map(
          (s) =>
            s.show && (
              <img
                key={s.id}
                src={bintang}
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none"
                style={starStyle(s)}
              />
            )
        )}

        {/* Maskot fleksibel */}
        <img
          src={maskot}
          alt="Maskot Joyin"
          style={mascotStyle}
          className={[
            "pointer-events-none select-none",
            M.showOnMobile ? "block" : "hidden sm:block",
          ].join(" ")}
        />

        {/* Teks tengah */}
        <div className="max-w-4xl mx-auto px-6 text-center mt-8 md:mt-12 lg:mt-16">
          <h1 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl">
            Kenalan Yuk dengan Joyin!
          </h1>
          <p className="mt-6 md:mt-8 lg:mt-10 text-white/95 text-base md:text-lg leading-relaxed md:leading-8">
            Selamat datang di Joyin, sahabat bisnis kamu dalam urusan ngobrol
            sama pelanggan. Kami percaya komunikasi cepat dan hangat bikin
            pelanggan makin nyaman. Joyin hadir untuk bantu kamu merespons
            otomatis 24 jam nonstop, jadi bisnis tetap jalan walau kamu lagi
            santai.
          </p>
        </div>
      </section>

      {/* ==== SECTION TEKS DI BAWAH MASKOT ==== */}
      <section
        className="relative w-full bg-white overflow-hidden
                   pt-20 md:pt-24 pb-24 md:pb-32 min-h-[600px]"
      >
        {/* Glow lembut kanan-bawah */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-24 w-[520px] h-[520px] opacity-70"
          style={{
            background:
              "radial-gradient(54% 54% at 50% 50%, rgba(255, 240, 190, 0.75) 0%, rgba(255,255,255,0) 65%)",
          }}
        />

        {/* Bintang kiri (BODY) */}
        {STAR_BODY.map(
          (s) =>
            s.show && (
              <img
                key={s.id}
                src={bintang}
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none"
                style={starStyle(s)}
              />
            )
        )}

        {/* Paragraf (offset kiri/kanan sesuai foto) */}
        <div className="max-w-5xl mx-auto px-6 md:pl-24 lg:pl-32 mt-8 md:mt-10 space-y-10 md:space-y-12">
          {/* Geser sedikit ke kiri mulai md */}
          <p className="text-lg md:text-xl lg:text-[26px] leading-relaxed md:leading-[1.8] font-semibold text-black md:-ml-6 lg:-ml-12">
            Kami ingin bikin pengalaman pelanggan terasa lebih ringan, ramah,
            dan menyenangkan. Setiap interaksi dengan pelanggan jadi lebih
            cepat, praktis, dan bikin mereka merasa diperhatikan.
          </p>

          {/* Geser sedikit ke kanan mulai md */}
          <p className="text-lg md:text-xl lg:text-[26px] leading-relaxed md:leading-[1.8] font-semibold text-black md:ml-10 lg:ml-16">
            Nggak perlu lagi balas chat satu per satu atau begadang demi respon
            cepat. Joyin siap bantu kamu memberikan jawaban otomatis dengan
            sentuhan personal, sehingga pelanggan tetap merasa dekat dengan
            bisnismu.
          </p>
        </div>
      </section>

      {/* ==== SECTION JOYCEMERLANG ==== */}
      <section
        className="relative w-full overflow-hidden mt-8 md:mt-10 pt-24 md:pt-28 pb-20 md:pb-24"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, #E7B8FF 0%, #B55CFF 40%, #8E3BFF 100%)",
        }}
      >
        {/* Strip ungu di bawah */}
        <div className="absolute left-0 right-0 bottom-0 h-12 md:h-16 bg-[#9B3AF3] rounded-t-[32px] z-20" />

        {/* Dekor play & dots kiri-atas */}
        <div className="absolute left-8 md:left-14 top-10 md:top-14 flex items-center gap-3 z-10">
          <div
            aria-hidden="true"
            style={{
              width: 0,
              height: 0,
              borderTop: "16px solid transparent",
              borderBottom: "16px solid transparent",
              borderLeft: "28px solid #FFD54F",
              filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.18))",
            }}
          />
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#FFD54F" }}
          />
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#FFD54F" }}
          />
        </div>

        {/* Dekor play & dots kanan-bawah */}
        <div className="absolute right-8 md:right-16 bottom-16 flex items-center gap-3 z-10">
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#FFD54F" }}
          />
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#FFD54F" }}
          />
          <div
            aria-hidden="true"
            style={{
              width: 0,
              height: 0,
              borderTop: "16px solid transparent",
              borderBottom: "16px solid transparent",
              borderRight: "28px solid #FFD54F",
              filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.18))",
            }}
          />
        </div>

        {/* Bintang kecil dekor (JoyCemerlang section) */}
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-20 left-1/2 -translate-x-10 w-6 md:w-7"
          style={{ zIndex: 5 }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-24 left-1/2 -translate-x-0 w-7 md:w-8"
          style={{ zIndex: 5 }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-20 left-1/5 w-7 md:w-8"
          style={{ zIndex: 5 }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-16 left-1/4 w-5 md:w-6"
          style={{ zIndex: 5 }}
        />

        {/* Konten utama JoyCemerlang */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-center text-white font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight">
            Buat Chat Lebih Hidup Tanpa Ribet
          </h2>

          <div className="mt-14 md:mt-16 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-14">
            {/* Teks kiri */}
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md text-left">
              Nggak perlu lagi begadang atau terus mantengin layar hanya demi
              respon cepat. Joyin siap bantu kamu tetap terhubung kapan pun, di
              mana pun, tanpa kehilangan rasa hangat dalam percakapan.
            </p>

            {/* JoyCemerlang */}
            <div className="shrink-0 relative flex items-end justify-center h-[280px] md:h-[340px] lg:h-[420px] translate-y-12 md:translate-y-16 lg:translate-y-20">
              <div
                aria-hidden="true"
                className="absolute inset-x-[-40px] bottom-[-16px] rounded-[999px]"
                style={{
                  height: "260px",
                  background:
                    "radial-gradient(55% 55% at 50% 35%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 75%)",
                  filter: "blur(4px)",
                  zIndex: 0,
                }}
              />
              <img
                src={JoyCemerlang}
                alt="JoyCemerlang, maskot Joyin yang ceria"
                className="relative w-[320px] md:w-[380px] lg:w-[430px]"
                style={{ zIndex: 10 }}
              />
            </div>

            {/* Teks kanan */}
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md text-left lg:text-right">
              Dengan Joyin, cukup atur sekali dan biarkan chatbot kami bekerja
              untukmu — menjawab otomatis dengan gaya ramah dan natural,
              membuat pelanggan tetap dekat, dan bisnismu makin berkembang tanpa
              ribet.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
