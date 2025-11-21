// src/landingpage/TentangKami.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer";

import bintang from "../assets/bintang2.png";
import bintangkecil from "../assets/bintangkecil.png";
import maskot from "../assets/bintangKiri.png";
import JoyCemerlang from "../assets/JoyCemerlang.png";
import JoyNgintip from "../assets/JoyNgintip.png"; // ⬅️ tambahkan ini

// ===== SETTING UKURAN MASING-MASING BINTANG (UMUM) =====
// Dipakai untuk semua bintang sebagai default width (px)
const STAR_SIZE = {
  h1: 80,
  h2: 80,
  h3: 60,
  h4: 60,
  b1: 32,
  b2: 56,
  b3: 32,
};

// ===== SETTING KHUSUS 3 BINTANG KIRI BAWAH TEKS =====
// Geser kanan-kiri (shiftX), atas-bawah (shiftY), ukuran (size), dan rotasi (rot)
const BODY_STAR_SETTINGS = {
  b1: { size: 58, shiftX: 0, shiftY: 0, rot: 35 }, // bintang kecil atas
  b2: { size: 90, shiftX: 70, shiftY: 40, rot: 3 }, // bintang besar tengah
  b3: { size: 58, shiftX: 150, shiftY: 70, rot: 30 }, // bintang kecil bawah
};

// ===== SETTING PERGESERAN MASKOT HIJAU (VERTIKAL) =====
// offsetY dalam px: negatif = ke atas, positif = ke bawah
const MASCOT_SHIFT = {
  offsetY: -75, // naikkan sedikit maskot hijau
};

// ===== SETTING PERGESERAN MASKOT JOYCEMERLANG (GAMBAR SAJA) =====
// offsetY dalam px: negatif = ke atas, positif = ke bawah
const JOYC_IMAGE_SHIFT = {
  offsetY: 0, // ubah ini untuk naik/turunkan gambar JoyCemerlang saja
};

// ===== SETTING MASKOT HIJAU KIRI LAYAR (HORIZONTAL, UKURAN & ROTASI) =====
// offsetX: + ke kanan (masuk layar), - ke kiri (lebih keluar)
// width: ukuran maskot (px)
// rotate: rotasi akhir maskot (derajat), + searah jarum jam, - berlawanan
const LEFT_MASCOT_SETTINGS = {
  offsetX: 20,
  width: 410,
  rotate: 38, // kemiringan maskot kiri
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

  // util kecil buat ambil angka dari query
  const numFromQp = (key) => {
    const v = qp.get(key);
    return v !== null ? Number(v) : null;
  };

  const M = {
    side:
      qp.get("m_side") === "right"
        ? "right"
        : qp.get("m_side") === "left"
        ? "left"
        : DEFAULT_MASCOT.side,
    // width default ambil dari LEFT_MASCOT_SETTINGS, masih bisa dioverride m_w
    width: Number(
      qp.get("m_w") || LEFT_MASCOT_SETTINGS.width || DEFAULT_MASCOT.width
    ),
    outside: Number(qp.get("m_out") || DEFAULT_MASCOT.outside),
    translateY: Number(qp.get("m_y") || DEFAULT_MASCOT.translateY),
    // Rotasi akhir: pakai LEFT_MASCOT_SETTINGS.rotate, bisa dioverride ?m_rot=
    rotate:
      numFromQp("m_rot") ??
      (LEFT_MASCOT_SETTINGS.rotate ?? DEFAULT_MASCOT.rotate),
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

  // ====== UTIL LAIN ======
  const num = (key, fallback) => {
    const v = qp.get(key);
    return v !== null ? Number(v) : fallback;
  };
  const bool = (key, fallback = true) => {
    const v = qp.get(key);
    if (v === null) return fallback;
    return v === "1" || v === "true";
  };

  // ===== Hitung posisi maskot hijau (hero) =====
  const maxOutside = Math.max(0, M.width - M.peek);
  const safeOutside = Math.min(M.outside, maxOutside);
  const baseOffset = -safeOutside;

  // Tambahkan LEFT_MASCOT_SETTINGS.offsetX ke posisi X
  const sidePos =
    M.side === "left"
      ? { left: `${baseOffset + LEFT_MASCOT_SETTINGS.offsetX}px` }
      : { right: `${baseOffset + LEFT_MASCOT_SETTINGS.offsetX}px` };

  const transformOrigin = !M.flip
    ? M.side === "left"
      ? "bottom left"
      : "bottom right"
    : M.side === "left"
    ? "bottom right"
    : "bottom left";

  const mascotTranslateY = (M.translateY || 0) + MASCOT_SHIFT.offsetY;

  const mascotStyle = {
    position: "absolute",
    bottom: 0,
    ...sidePos,
    width: `${M.width}px`,
    transform: `translateY(${mascotTranslateY}px) rotate(${M.rotate}deg) ${
      M.flip ? "scaleX(-1)" : ""
    }`,
    transformOrigin,
    zIndex: 10,
  };

  // ====== BINTANG: default + override via query params ======
  const STAR_DEFAULTS = {
    // ⭐ HERO: 4 bintang (2 kiri, 2 kanan)
    hero: [
      { id: "h1", left: 100, top: 70, rotate: 30 },
      { id: "h4", left: 60, top: 170, rotate: 30 },
      { id: "h2", right: 55, top: 190, rotate: 6 },
      { id: "h3", right: 90, top: 320, rotate: 29 },
    ],
    // ⭐ BODY: cluster kiri bawah tulisan
    body: [
      { id: "b1", left: 80, top: 260, rotate: -5 },
      { id: "b2", left: 90, top: 320, rotate: 8 },
      { id: "b3", left: 160, top: 340, rotate: -10 },
    ],
  };

  const overrideStar = (d, section) => {
    const cfg = section === "body" ? BODY_STAR_SETTINGS[d.id] || {} : {};

    const baseLeft = d.left ?? null;
    const baseRight = d.right ?? null;
    const baseTop = d.top ?? 0;

    const shiftedLeft =
      baseLeft !== null ? baseLeft + (cfg.shiftX || 0) : baseLeft;
    const shiftedRight =
      baseRight !== null ? baseRight - (cfg.shiftX || 0) : baseRight;
    const shiftedTop = baseTop + (cfg.shiftY || 0);

    const defaultWidth = cfg.size ?? STAR_SIZE[d.id] ?? 28;
    const defaultRotate = cfg.rot ?? d.rotate ?? 0;

    return {
      id: d.id,
      left:
        qp.get(`${d.id}_l`) !== null
          ? num(`${d.id}_l`, shiftedLeft ?? null)
          : shiftedLeft ?? null,
      right:
        qp.get(`${d.id}_r`) !== null
          ? num(`${d.id}_r`, shiftedRight ?? null)
          : shiftedRight ?? null,
      top: num(`${d.id}_t`, shiftedTop),
      w: num(`${d.id}_w`, defaultWidth),
      rotate: num(`${d.id}_rot`, defaultRotate),
      show: bool(`${d.id}_show`, true),
    };
  };

  const STAR_HERO = STAR_DEFAULTS.hero.map((d) => overrideStar(d, "hero"));
  const STAR_BODY = STAR_DEFAULTS.body.map((d) => overrideStar(d, "body"));

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
#DDEEA5 56%, \
#F4F3C0 76%, \
#FCF9E8 92%, \
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

        {/* Maskot fleksibel (hero) */}
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
          <p className="text-lg md:text-xl lg:text-[26px] leading-relaxed md:leading-[1.8] font-semibold text-black md:-ml-6 lg:-ml-12">
            Kami ingin bikin pengalaman pelanggan terasa lebih ringan, ramah,
            dan menyenangkan. Setiap interaksi dengan pelanggan jadi lebih
            cepat, praktis, dan bikin mereka merasa diperhatikan.
          </p>

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
        className="relative w-full overflow-hidden mt-8 md:mt-10 pt-10 md:pt-12 pb-12 md:pb-14"
        style={{
          background:
            "linear-gradient(180deg, #AE6DFC 0%, #C27FFF 45%, #B368FF 100%)",
        }}
      >
        {/* JoyNgintip di pojok kanan atas, ngintip ke bawah */}
        <img
          src={JoyNgintip}
          alt="Joyin mengintip"
          className="pointer-events-none select-none absolute -top-32 right-4 md:right-16 w-[180px] md:w-[230px] lg:w-[260px]"
          style={{ zIndex: 25 }}
        />

        {/* Strip ungu di bawah */}
        <div className="absolute left-0 right-0 bottom-0 h-12 md:h-16 bg-[#A858FF] rounded-t-[32px] z-20" />

        {/* Dekor play & dots kiri-atas */}
        <div className="absolute left-8 md:left-14 top-8 md:top-10 flex items-center gap-3 z-10">
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
        {/* ➜ Dua bintang kanan-atas, mirip referensi */}
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-16 right-[18%] w-7 md:w-8"
          style={{ zIndex: 5 }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-10 right-[10%] w-5 md:w-6"
          style={{ zIndex: 5 }}
        />
        {/* ➜ Dua bintang kiri-bawah, mirip referensi */}
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-16 left-6 md:left-10 w-6 md:w-7"
          style={{ zIndex: 5 }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-10 left-16 md:left-20 w-5 md:w-6"
          style={{ zIndex: 5 }}
        />

        {/* Konten utama JoyCemerlang */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-center text-white font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight">
            Buat Chat Lebih Hidup Tanpa Ribet
          </h2>

          <div className="mt-8 md:mt-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
            {/* Teks kiri */}
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md text-left">
              Nggak perlu lagi begadang atau terus mantengin layar hanya demi
              respon cepat. Joyin siap bantu kamu tetap terhubung kapan pun, di
              mana pun, tanpa kehilangan rasa hangat dalam percakapan.
            </p>

            {/* JoyCemerlang */}
            <div className="shrink-0 relative flex items-end justify-center h-[240px] md:h-[300px] lg:h-[360px] translate-y-6 md:translate-y-8 lg:translate-y-10">
              <div
                aria-hidden="true"
                className="absolute inset-x-[-40px] bottom-[-16px] rounded-[999px]"
                style={{
                  height: "210px",
                  background:
                    "radial-gradient(55% 55% at 50% 35%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 75%)",
                  filter: "blur(4px)",
                  zIndex: 0,
                }}
              />
              <img
                src={JoyCemerlang}
                alt="JoyCemerlang, maskot Joyin yang ceria"
                className="relative w-[280px] md:w-[330px] lg:w-[380px]"
                style={{
                  zIndex: 10,
                  transform: `translateY(${JOYC_IMAGE_SHIFT.offsetY}px)`,
                }}
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
