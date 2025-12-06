// src/components/HeroSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import bintangKiri from "../assets/bintangKiri.png";
import bintangKanan from "../assets/bintangKanan.png";

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Offset bintang (px). Nilai + ke bawah/kanan, nilai - ke atas/kiri.
  const [leftOffsetY, setLeftOffsetY] = useState(0);
  const [rightOffsetY, setRightOffsetY] = useState(0);
  const [leftOffsetX, setLeftOffsetX] = useState(30);
  const [rightOffsetX, setRightOffsetX] = useState(-100);

  // Helper geser
  const nudge = (setter, delta) => setter((v) => v + delta);

  return (
    <section
      className="relative flex items-center justify-center px-6 lg:px-20 py-12 lg:py-24 bg-gradient-to-r overflow-hidden h-[600px]"
      style={{ background: "linear-gradient(to right, #5CC9AF, #D7E96F)" }}
    >
      {/* ===== Kontrol posisi bintang (geser atas/bawah/kiri/kanan) ===== */}
      <div className="absolute top-4 left-4 z-30 bg-white/70 backdrop-blur rounded-xl shadow px-3 py-2 flex flex-wrap items-center gap-4">
        {/* Kiri */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Bintang Kiri</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => nudge(setLeftOffsetY, -20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke atas"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => nudge(setLeftOffsetY, +20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke bawah"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => nudge(setLeftOffsetX, -20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke kiri"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => nudge(setLeftOffsetX, +20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke kanan"
            >
              →
            </button>
          </div>
          <span className="text-xs text-gray-600 ml-1">
            (x:{leftOffsetX}px, y:{leftOffsetY}px)
          </span>
        </div>

        <div className="h-5 w-px bg-gray-300" />

        {/* Kanan */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Bintang Kanan</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => nudge(setRightOffsetY, -20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke atas"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => nudge(setRightOffsetY, +20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke bawah"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => nudge(setRightOffsetX, -20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke kiri"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => nudge(setRightOffsetX, +20)}
              className="px-2 py-1 rounded-md border text-sm hover:bg-gray-100"
              title="Geser ke kanan"
            >
              →
            </button>
          </div>
          <span className="text-xs text-gray-600 ml-1">
            (x:{rightOffsetX}px, y:{rightOffsetY}px)
          </span>
        </div>
      </div>

      {/* Bintang kiri — mirror (flip horizontal) + offset dinamis */}
      <motion.img
        initial={{ x: -300, opacity: 0, rotate: -20, y: 0 }}
        animate={{ x: leftOffsetX, opacity: 1, rotate: -20, y: leftOffsetY }}
        transition={{ duration: 1 }}
        src={bintangKiri}
        alt="Bintang Kiri"
        className="absolute bottom-[-60px] left-[-120px] w-[450px] h-auto z-10"
        style={{ scaleX: -1 }}
      />

      {/* Bintang kanan — offset dinamis */}
      <motion.img
        initial={{ x: 300, opacity: 0, rotate: -20, y: 0 }}
        animate={{ x: rightOffsetX, opacity: 1, rotate: -20, y: rightOffsetY }}
        transition={{ duration: 1 }}
        src={bintangKanan}
        alt="Bintang Kanan"
        className="absolute bottom-[-105px] right-[-120px] w-[360px] h-auto z-10"
      />

      {/* Copywriting + CTA */}
      <motion.div
        className="relative z-20 max-w-2xl text-center mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-snug">
          {t("hero.title", { defaultValue: "Chatbot Pintar Joyin, Balesin Chat Otomatis Tanpa Ribet" })}
        </h1>
        <p className="mt-4 text-black/90 text-base lg:text-lg">
          {t("hero.desc", { defaultValue: "Dengan chatbot AI, kamu nggak perlu nunggu lama lagi. Semua jawaban langsung tersedia dalam hitungan detik!" })}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            {t("hero.btnStart", { defaultValue: "Ayo Mulai" })}
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-md transition">
            {t("hero.btnLearn", { defaultValue: "Pelajari Lebih Lanjut" })}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
