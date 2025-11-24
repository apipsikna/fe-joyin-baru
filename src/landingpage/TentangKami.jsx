// src/landingpage/TentangKami.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer";

import bintang from "../assets/bintang2.png";
import bintangkecil from "../assets/bintangkecil.png";
import maskot from "../assets/bintangKiri.png";
import JoyCemerlang from "../assets/JoyCemerlang.png";
import JoyNgintip2 from "../assets/JoyNgintip2.png"; // JoyNgintip2
import BgSection from "../assets/BgSection.png"; // background section CTA
import PlayDot from "../assets/PlayDot.png"; // 🔹 gambar baru pengganti Play & Dot

/* ================== BINTANG & MASKOT CONFIG ================== */

// ===== SETTING UKURAN MASING-MASING BINTANG (UMUM) =====
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
const BODY_STAR_SETTINGS = {
  b1: { size: 58, shiftX: 0, shiftY: 90, rot: 35 }, // bintang kecil atas
  b2: { size: 90, shiftX: 70, shiftY: 130, rot: 3 }, // bintang besar tengah
  b3: { size: 58, shiftX: 150, shiftY: 160, rot: 30 }, // bintang kecil bawah
};

// ===== SETTING PERGESERAN MASKOT HIJAU (VERTIKAL) =====
const MASCOT_SHIFT = {
  offsetY: -75,
};

// ===== SETTING PERGESERAN MASKOT JOYCEMERLANG (GAMBAR SAJA) =====
const JOYC_IMAGE_SHIFT = {
  offsetY: 17,
};

// ===== SETTING MASKOT HIJAU KIRI LAYAR =====
const LEFT_MASCOT_SETTINGS = {
  offsetX: 5,
  width: 410,
  rotate: 38,
};

// ===== SETTING JOY NGINTIP (UKURAN & POSISI DEFAULT) =====
const JOYNGINTIP_SHIFT_DEFAULT = {
  shiftX: -480,
  shiftY: 75,
  scale: 5.5,
};

// ===== SETTING POSISI 3 LAYER UNGU (NAIK / TURUN GLOBAL) =====
const PURPLE_LAYER_SHIFT = {
  offsetY: -96, // default marginTop section 3 layer ungu
};

// ===== SETTING BESAR TEKS DI SAMPING JOYCEMERLANG =====
const JOYC_TEXT_DEFAULT = {
  left: 22,
  right: 22,
};

// ===== SETTING LEBAR BOX TEKS DI SAMPING JOYCEMERLANG =====
const JOYC_TEXT_WIDTH_DEFAULT = {
  left: 900,
  right: 900,
};

// ===== SETTING PERGESERAN POSISI TEKS JOYCEMERLANG (X/Y) =====
const JOYC_TEXT_SHIFT_DEFAULT = {
  left: { x: -110, y: -50 },
  right: { x: 110, y: -50 },
};

/* ===== SETTING TEKS “Selalu Ada Ruang untuk Berkembang” ===== */
const GROWTH_TEXT_CONFIG_DEFAULT = {
  titleSize: 45, // px
  bodySize: 21, // px
  shiftX: 0, // px (kiri/kanan)
  shiftY: -20, // px (atas/bawah)
};

/* ===== SETTING GESER, SCALE & ROTATE 4 BINTANG KECIL DI CONTAINER UNGU =====
   ps1 = bintang atas kanan (right-[18%])
   ps2 = bintang lebih kecil di kanan atas
   ps3 = bintang kiri bawah
   ps4 = bintang kecil kiri bawah
*/
const PURPLE_TINY_STARS_SHIFT_DEFAULT = {
  ps1: { x: 0, y: 0, scale: 1.2, rot: 0 },
  ps2: { x: -170, y: 0, scale: 0.7, rot: -30 },
  ps3: { x: 160, y: -40, scale: 1.3, rot: 10 },
  ps4: { x: 200, y: -30, scale: 0.8, rot: -16 },
};

// ===== SETTING DEFAULT POSISI MASING-MASING LAYER UNGU (TOP) =====
const PURPLE_LAYER_Y_DEFAULT = {
  l1: 0, // layer 1 (paling atas)
  l2: 50, // layer 2
  l3: 110, // layer 3 (gradient)
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
    width: Number(
      qp.get("m_w") || LEFT_MASCOT_SETTINGS.width || DEFAULT_MASCOT.width
    ),
    outside: Number(qp.get("m_out") || DEFAULT_MASCOT.outside),
    translateY: Number(qp.get("m_y") || DEFAULT_MASCOT.translateY),
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

  const num = (key, fallback) => {
    const v = qp.get(key);
    return v !== null ? Number(v) : fallback;
  };
  const bool = (key, fallback = true) => {
    const v = qp.get(key);
    if (v === null) return fallback;
    return v === "1" || v === "true";
  };

  // ==== SETTING FINAL BESAR TEKS KIRI / KANAN JOYCEMERLANG ====
  const JOYC_TEXT_SIZE = {
    left: num("tL_size", JOYC_TEXT_DEFAULT.left),
    right: num("tR_size", JOYC_TEXT_DEFAULT.right),
  };

  // ==== SETTING FINAL LEBAR BOX TEKS KIRI / KANAN JOYCEMERLANG ====
  const JOYC_TEXT_WIDTH = {
    left: num("tL_w", JOYC_TEXT_WIDTH_DEFAULT.left),
    right: num("tR_w", JOYC_TEXT_WIDTH_DEFAULT.right),
  };

  // ==== SETTING FINAL PERGESERAN POSISI TEKS KIRI / KANAN JOYCEMERLANG ====
  const JOYC_TEXT_SHIFT = {
    left: {
      x: num("tL_x", JOYC_TEXT_SHIFT_DEFAULT.left.x),
      y: num("tL_y", JOYC_TEXT_SHIFT_DEFAULT.left.y),
    },
    right: {
      x: num("tR_x", JOYC_TEXT_SHIFT_DEFAULT.right.x),
      y: num("tR_y", JOYC_TEXT_SHIFT_DEFAULT.right.y),
    },
  };

  // ==== SETTING FINAL POSISI & UKURAN JOYNGINTIP2 ====
  const JOYNGINTIP_SHIFT = {
    shiftX: num("jn_x", JOYNGINTIP_SHIFT_DEFAULT.shiftX),
    shiftY: num("jn_y", JOYNGINTIP_SHIFT_DEFAULT.shiftY),
    scale: num("jn_s", JOYNGINTIP_SHIFT_DEFAULT.scale),
  };

  // ==== SETTING FINAL GESER, SCALE & ROTATE 4 BINTANG KECIL DI CONTAINER UNGU ====
  const PURPLE_TINY_STARS_SHIFT = {
    ps1: {
      x: num("ps1_x", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps1.x),
      y: num("ps1_y", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps1.y),
      scale: num("ps1_s", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps1.scale),
      rot: num("ps1_rot", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps1.rot),
    },
    ps2: {
      x: num("ps2_x", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps2.x),
      y: num("ps2_y", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps2.y),
      scale: num("ps2_s", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps2.scale),
      rot: num("ps2_rot", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps2.rot),
    },
    ps3: {
      x: num("ps3_x", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps3.x),
      y: num("ps3_y", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps3.y),
      scale: num("ps3_s", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps3.scale),
      rot: num("ps3_rot", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps3.rot),
    },
    ps4: {
      x: num("ps4_x", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps4.x),
      y: num("ps4_y", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps4.y),
      scale: num("ps4_s", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps4.scale),
      rot: num("ps4_rot", PURPLE_TINY_STARS_SHIFT_DEFAULT.ps4.rot),
    },
  };

  // ==== SETTING FINAL TEKS “Selalu Ada Ruang untuk Berkembang” ====
  const GROWTH_TITLE_SIZE = num(
    "g_title_size",
    GROWTH_TEXT_CONFIG_DEFAULT.titleSize
  );
  const GROWTH_BODY_SIZE = num(
    "g_body_size",
    GROWTH_TEXT_CONFIG_DEFAULT.bodySize
  );
  const GROWTH_SHIFT = {
    x: num("g_x", GROWTH_TEXT_CONFIG_DEFAULT.shiftX),
    y: num("g_y", GROWTH_TEXT_CONFIG_DEFAULT.shiftY),
  };

  // 🔹 SETTING FINAL POSISI GLOBAL 3 LAYER UNGU (MARGIN SECTION, ?pl_y=..)
  const PURPLE_LAYER_OFFSET_Y = num(
    "pl_y",
    PURPLE_LAYER_SHIFT.offsetY // default -96
  );

  // 🔹 SETTING FINAL POSISI MASING-MASING LAYER (TOP) → ?pl1_y, ?pl2_y, ?pl3_y
  const PURPLE_LAYER_Y = {
    l1: num("pl1_y", PURPLE_LAYER_Y_DEFAULT.l1),
    l2: num("pl2_y", PURPLE_LAYER_Y_DEFAULT.l2),
    l3: num("pl3_y", PURPLE_LAYER_Y_DEFAULT.l3),
  };

  // ===== Hitung posisi maskot hijau (hero) =====
  const maxOutside = Math.max(0, M.width - M.peek);
  const safeOutside = Math.min(M.outside, maxOutside);
  const baseOffset = -safeOutside;

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
    hero: [
      { id: "h1", left: 100, top: 70, rotate: 30 },
      { id: "h4", left: 60, top: 170, rotate: 30 },
      { id: "h2", right: 55, top: 190, rotate: 6 },
      { id: "h3", right: 90, top: 320, rotate: 29 },
    ],
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
    <div className="w-screen min-h-screen font-poppins bg-white overflow-x-hidden">
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
#37B796 0%, \
#56C8AD 12%, \
#8BD4B7 32%, \
#BDE7A6 52%, \
#DDEEA5 70%, \
#F4F3C0 84%, \
#FCF9E8 94%, \
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
        <div className="max-w-4xl mx-auto px-6 text-center mt-12 md:mt-16 lg:mt-20">
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
                   pt-20 md:pt-24 pb-40 md:pb-56 min-h-[750px]"
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

        {/* Paragraf – posisi bawah + paragraf kedua digeser ke kanan */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-14 mt-6 md:mt-10 space-y-10 md:space-y-18">
          <p className="text-base md:text-lg lg:text-[22px] leading-relaxed md:leading-[1.8] font-semibold text-black md:ml-10 lg:ml-6">
            Joyin hadir untuk bantu kamu merespons otomatis selama 24 jam penuh,
            jadi bisnis tetap berjalan walau kamu lagi santai. Dengan sistem
            pintar kami, setiap interaksi terasa lebih personal tanpa perlu
            repot balas satu per satu.
          </p>

          <p className="text-base md:text-lg lg:text-[22px] leading-relaxed md:leading-[1.8] font-semibold text-black md:ml-24 lg:ml-32">
            Kami ingin menciptakan pengalaman pelanggan yang lebih ringan dan
            menyenangkan. Setiap pesan dibalas dengan cepat, namun tetap punya
            manusia yang membuat pelanggan merasa diperhatikan.
          </p>
        </div>
      </section>

      {/* ==== SECTION JOYCEMERLANG ==== */}
      <section
        className="relative w-full overflow-visible pt-10 md:pt-12 pb-16 md:pb-20"
        style={{
          background:
            "linear-gradient(180deg, #a861ffff 0%, #a861ffff 45%, #a861ffff 100%)",
        }}
      >
        {/* JoyNgintip2 di batas putih–ungu */}
        <div
          className="pointer-events-none select-none absolute -top-24 md:-top-28 lg:-top-32 right-4 md:right-16 lg:right-24 z-30"
          style={{
            transform: `translate(${JOYNGINTIP_SHIFT.shiftX}px, ${JOYNGINTIP_SHIFT.shiftY}px) scale(${JOYNGINTIP_SHIFT.scale})`,
            transformOrigin: "bottom center",
          }}
        >
          <img
            src={JoyNgintip2}
            alt="Joyin mengintip"
            className="w-[190px] md:w-[230px] lg:w-[260px]"
          />
        </div>

        {/* Dekor PlayDot kiri-atas */}
        <div className="absolute left-8 md:left-14 top-7 md:top-9 z-10">
          <img
            src={PlayDot}
            alt="dekorasi play"
            className="w-16 md:w-20 lg:w-24 pointer-events-none select-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Dekor PlayDot kanan-bawah (mirror) */}
        <div className="absolute right-8 md:right-16 bottom-24 md:bottom-28 z-10">
          <img
            src={PlayDot}
            alt="dekorasi play"
            className="w-16 md:w-20 lg:w-24 pointer-events-none select-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/* Bintang kecil dekor (4 bintang di container ungu) */}
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-16 right-[18%] w-7 md:w-8"
          style={{
            zIndex: 5,
            transform: `translate(${PURPLE_TINY_STARS_SHIFT.ps1.x}px, ${PURPLE_TINY_STARS_SHIFT.ps1.y}px) scale(${PURPLE_TINY_STARS_SHIFT.ps1.scale}) rotate(${PURPLE_TINY_STARS_SHIFT.ps1.rot}deg)`,
            transformOrigin: "center",
          }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-10 right-[10%] w-5 md:w-6"
          style={{
            zIndex: 5,
            transform: `translate(${PURPLE_TINY_STARS_SHIFT.ps2.x}px, ${PURPLE_TINY_STARS_SHIFT.ps2.y}px) scale(${PURPLE_TINY_STARS_SHIFT.ps2.scale}) rotate(${PURPLE_TINY_STARS_SHIFT.ps2.rot}deg)`,
            transformOrigin: "center",
          }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-28 left-6 md:left-10 w-6 md:w-7"
          style={{
            zIndex: 5,
            transform: `translate(${PURPLE_TINY_STARS_SHIFT.ps3.x}px, ${PURPLE_TINY_STARS_SHIFT.ps3.y}px) scale(${PURPLE_TINY_STARS_SHIFT.ps3.scale}) rotate(${PURPLE_TINY_STARS_SHIFT.ps3.rot}deg)`,
            transformOrigin: "center",
          }}
        />
        <img
          src={bintangkecil}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-24 left-16 md:left-20 w-5 md:w-6"
          style={{
            zIndex: 5,
            transform: `translate(${PURPLE_TINY_STARS_SHIFT.ps4.x}px, ${PURPLE_TINY_STARS_SHIFT.ps4.y}px) scale(${PURPLE_TINY_STARS_SHIFT.ps4.scale}) rotate(${PURPLE_TINY_STARS_SHIFT.ps4.rot}deg)`,
            transformOrigin: "center",
          }}
        />

        {/* Konten utama JoyCemerlang */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-center text-white font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight">
            Buat Chat Lebih Hidup Tanpa Ribet
          </h2>

          <div className="mt-8 md:mt-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
            {/* Teks kiri */}
            <p
              className="text-white leading-relaxed text-left flex-1 w-full"
              style={{
                fontSize: `${JOYC_TEXT_SIZE.left}px`,
                maxWidth: `${JOYC_TEXT_WIDTH.left}px`,
                transform: `translate(${JOYC_TEXT_SHIFT.left.x}px, ${JOYC_TEXT_SHIFT.left.y}px)`,
              }}
            >
              Nggak perlu lagi begadang atau terus mantengin layar hanya demi
              respon cepat. Joyin siap bantu kamu tetap terhubung kapan pun, di
              mana pun, tanpa kehilangan rasa hangat dalam percakapan.
            </p>

            {/* JoyCemerlang */}
            <div className="shrink-0 relative flex items-end justify-center h-[280px] md:h-[340px] lg:h-[420px] translate-y-6 md:translate-y-8 lg:translate-y-10">
              <img
                src={JoyCemerlang}
                alt="JoyCemerlang, maskot Joyin yang ceria"
                className="relative w-[340px] md:w-[420px] lg:w-[500px]"
                style={{
                  zIndex: 10,
                  transform: `translateY(${JOYC_IMAGE_SHIFT.offsetY}px)`,
                  filter:
                    "drop-shadow(0 0 40px rgba(255,255,255,0.98)) " +
                    "drop-shadow(0 0 90px rgba(255,255,255,0.9)) " +
                    "drop-shadow(0 0 160px rgba(255,255,255,0.75))",
                }}
              />
            </div>

            {/* Teks kanan */}
            <p
              className="text-white leading-relaxed text-left lg:text-right flex-1 w-full"
              style={{
                fontSize: `${JOYC_TEXT_SIZE.right}px`,
                maxWidth: `${JOYC_TEXT_WIDTH.right}px`,
                transform: `translate(${JOYC_TEXT_SHIFT.right.x}px, ${JOYC_TEXT_SHIFT.right.y}px)`,
              }}
            >
              Dengan Joyin, cukup atur sekali dan biarkan chatbot kami bekerja
              untukmu — menjawab otomatis dengan gaya ramah dan natural,
              membuat pelanggan tetap dekat, dan bisnismu makin berkembang tanpa
              ribet.
            </p>
          </div>
        </div>
      </section>

      {/* ==== 3 LAYER UNGU + GRADIENT PUTIH ==== */}
      <section
        className="relative w-full h-[260px] md:h-[300px] lg:h-[340px] overflow-hidden bg-transparent"
        style={{
          marginTop: `${PURPLE_LAYER_OFFSET_Y}px`,
        }}
      >
        {/* Container ungu panjang di belakang 3 layer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none select-none"
          style={{
            background: "#A861FF",
          }}
        />

        {/* Stack 3 layer ungu di atas background */}
        <div
          className="pointer-events-none select-none absolute inset-x-0 z-10"
          style={{ top: 0, height: "100%" }}
        >
          {/* Layer 1 */}
          <div
            className="absolute left-0 right-0 h-[80px] md:h-[88px] lg:h-[96px] rounded-t-[32px]"
            style={{
              top: `${PURPLE_LAYER_Y.l1}px`,
              background: "#942fffff",
            }}
          />

          {/* Layer 2 */}
          <div
            className="absolute left-0 right-0 h-[88px] md:h-[96px] lg:h-[104px] rounded-t-[32px]"
            style={{
              top: `${PURPLE_LAYER_Y.l2}px`,
              background: "#a852ffff",
            }}
          />

          {/* Layer 3 */}
          <div
            className="absolute left-0 right-0 bottom-0 rounded-t-[32px]"
            style={{
              top: `${PURPLE_LAYER_Y.l3}px`,
              background:
                "linear-gradient(180deg, #C57DFF 0%, #DFA5FF 28%, #F0E7FF 60%, #FFFFFF 100%)",
            }}
          />
        </div>
      </section>

      {/* ==== SECTION TEKS “Selalu Ada Ruang untuk Berkembang” ==== */}
      <section className="w-full bg-white py-12 md:py-16 mb-24 md:mb-28">
        <div
          className="max-w-5xl mx-auto px-6 text-center"
          style={{
            transform: `translate(${GROWTH_SHIFT.x}px, ${GROWTH_SHIFT.y}px)`,
          }}
        >
          <h2
            className="font-extrabold text-black tracking-tight"
            style={{ fontSize: `${GROWTH_TITLE_SIZE}px` }}
          >
            Selalu Ada Ruang untuk Berkembang
          </h2>
          <p
            className="mt-6 leading-relaxed md:leading-[1.9] text-black"
            style={{ fontSize: `${GROWTH_BODY_SIZE}px` }}
          >
            Kami percaya setiap bisnis punya cara unik buat terhubung dengan
            pelanggan. Karena itu, Joyin terus berkembang biar bisa menyesuaikan
            diri dengan gaya komunikasi bisnismu — dari obrolan santai sampai
            layanan profesional, semua bisa kamu atur dengan mudah.
          </p>
        </div>
      </section>

      {/* ==== SECTION CTA “Yuk, Tumbuh Bareng Joyin!” (BgSection FULL IMG) ==== */}
      <section className="relative z-10 w-full overflow-hidden rounded-t-[40px] md:rounded-t-[48px] mb-24 md:mb-28 lg:mb-32">
        {/* BgSection ditampilkan full sebagai gambar */}
        <img
          src={BgSection}
          alt="Latar belakang Joyin"
          className="w-full h-auto block"
        />

        {/* Konten CTA di atas gambar (tidak memotong gambar) */}
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
          <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
            <h2 className="text-[26px] md:text-[32px] lg:text-[36px] font-extrabold tracking-tight mb-6">
              Yuk, Tumbuh Bareng Joyin!
            </h2>

            <p className="text-sm md:text-base lg:text-[17px] leading-relaxed md:leading-[1.9]">
              Nggak ada kata terlalu cepat buat mulai pakai Joyin. Coba sekarang
              dan rasakan gimana mudahnya ngobrol dengan pelanggan tanpa ribet.
              Yuk, gabung bareng kami dan biarkan Joyin bantu bisnismu tumbuh
              lebih cepat dan lebih dekat!
            </p>

            <p className="mt-8 text-base md:text-lg font-semibold">
              Hubungi Kami
            </p>

            {/* Tombol kontak dengan animasi hover (invert warna + serong) */}
            <div className="mt-6 flex items-center justify-center gap-8 md:gap-10">
              {/* Email */}
              <button
                type="button"
                className="group w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-[#B164FF] shadow-[0_14px_35px_rgba(0,0,0,0.22)] flex items-center justify-center transition-all duration-200 ease-out hover:-translate-y-1 hover:-rotate-3 hover:bg-[#B164FF] hover:text-white"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3"
                >
                  {/* Amplop outline, warna pakai currentColor */}
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    ry="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M4 7.5L12 12.5L20 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                className="group w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-[#25D366] shadow-[0_14px_35px_rgba(0,0,0,0.22)] flex items-center justify-center transition-all duration-200 ease-out hover:-translate-y-1 hover:-rotate-3 hover:bg-[#25D366] hover:text-white"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3"
                >
                  {/* Lingkaran outline WA, warna pakai currentColor */}
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  {/* Icon WA di tengah */}
                  <path
                    d="M9.4 8.2c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-.9.8-.9 2s.9 2.3 1 2.4c.1.2 1.7 2.7 4.2 3.7 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2 0-.1-.1-.2-.3-.3l-1.2-.6c-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9.9-.2.1-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.3-1.6-1.4-1.9-.1-.2 0-.4.1-.5.1-.1.2-.2.3-.4.1-.1.1-.2.2-.4.1-.2 0-.3 0-.4l-.5-1.3Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER: tetap seperti semula */}
      <div className="mt-0 md:mt-2 lg:mt-4 [&>footer]:border-t-0 [&>footer]:border-none">
        <Footer />
      </div>
    </div>
  );
}
