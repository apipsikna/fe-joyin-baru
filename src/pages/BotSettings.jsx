// src/pages/MyPackages.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PaketSaya from "../assets/PaketSaya.png";

/* =======================
   ✅ SETTING DALAM FILE
   ======================= */
const PAKET_SAYA_CFG = {
  scale: 1.45,
  x: 0,
  y: 0,
  maxW: 900,

  // ✅ Teks judul di atas gambar (bisa digeser & di-scale)
  title: {
    text: "Pengaturan Bot",

    // posisi (px) relatif terhadap posisi default (center)
    x: 0, // + ke kanan, - ke kiri
    y: -50, // + ke bawah, - ke atas

    // jarak default dari teks ke gambar (px)
    mb: 14,

    // ukuran & skala
    size: 28, // px (base size)
    scale: 1, // 1 = normal, 1.1 lebih besar, dst
  },

  btn: {
    bottomPct: 20,
    w: 260,
    h: 58,
    radius: 12,
    scale: 0.8,
  },
};

export default function MyPackages() {
  const navigate = useNavigate();

  const goChoosePlan = () => {
    navigate("/checkout");
  };

  const cfg = PAKET_SAYA_CFG;

  return (
    <div className="w-full min-h-full flex flex-col px-4 md:px-8 pt-6 pb-0 overflow-hidden font-poppins">
      <div className="mt-auto w-full max-w-7xl mx-auto flex items-end justify-center">
        <div className="relative w-full flex justify-center">
          <div
            className="relative flex flex-col items-center"
            style={{
              transform: `translate(${cfg.x}px, ${cfg.y}px) scale(${cfg.scale})`,
              transformOrigin: "center bottom",
              willChange: "transform",
            }}
          >
            {/* ✅ Teks di atas gambar (bisa digeser & di-scale) */}
            <h1
              className="text-white font-bold select-none"
              style={{
                marginBottom: `${cfg.title.mb}px`,
                fontSize: `${cfg.title.size}px`,
                transform: `translate(${cfg.title.x}px, ${cfg.title.y}px) scale(${cfg.title.scale})`,
                transformOrigin: "center",
                willChange: "transform",
              }}
            >
              {cfg.title.text}
            </h1>

            <img
              src={PaketSaya}
              alt="Paket Saya"
              className="w-full h-auto select-none"
              style={{ maxWidth: `${cfg.maxW}px` }}
              draggable={false}
              loading="lazy"
            />

            {/* ✅ Tombol bisa di-scale */}
            <button
              onClick={goChoosePlan}
              aria-label="Pilih Paket"
              className="
                absolute left-1/2 -translate-x-1/2
                cursor-pointer text-white font-semibold
                focus:outline-none focus:ring-2 focus:ring-[#5FCAAC]/70
                hover:opacity-95 active:opacity-90 transition
              "
              style={{
                bottom: `${cfg.btn.bottomPct}%`,
                width: `${cfg.btn.w}px`,
                height: `${cfg.btn.h}px`,
                borderRadius: `${cfg.btn.radius}px`,
                backgroundColor: "#5FCAAC",
                transform: `translateX(-50%) scale(${cfg.btn.scale})`,
                transformOrigin: "center",
              }}
            >
              Pilih Paket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
