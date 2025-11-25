// src/landingpage/Referral.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer"; // ⬅️ import Footer

import bintang from "../assets/bintang2.png"; // dipakai untuk semua bintang (besar & kecil)
import BgReferral from "../assets/BgReferral.png"; // gambar background referral
import SectionRef1 from "../assets/SectionRef1.png"; // gambar section bawah
import SectionKeunggulaan from "../assets/SectionKeunggulan1.png"; // gambar keunggulan di bawah SectionRef1
import YukGabung from "../assets/YukGabung.png"; // gambar section YukGabung

export default function Referral() {
  // === SETTING OFFSET & UKURAN GAMBAR SectionRef1 (bisa digeser & di-zoom via query param) ===
  let REF_OFFSET = -100;
  let REF_SCALE = 0.9;

  // === SETTING POSISI & SKALA TOMBOL "AYO BERGABUNG!" (section paling bawah) ===
  let BTN_OFFSET_X = -240;
  let BTN_OFFSET_Y = -1970;
  let BTN_SCALE = 1.25;

  // === SETTING POSISI & SKALA SectionKeunggulaan ===
  let KEUNG_OFFSET_X = 0;
  let KEUNG_OFFSET_Y = 0;
  let KEUNG_SCALE = 0.85;

  // === SETTING POSISI YUKGABUNG (hanya atas-bawah) ===
  let YUK_OFFSET_Y = 100;

  // === SETTING POSISI & SKALA BUTTON "BERGABUNG & DAPATKAN HADIAH" DI DALAM YUKGABUNG ===
  let JOIN_BTN_OFFSET_X = 0;
  let JOIN_BTN_OFFSET_Y = -55;
  let JOIN_BTN_SCALE = 1.4;

  if (typeof window !== "undefined") {
    const qp = new URLSearchParams(window.location.search);

    // SectionRef1
    const rawOffset = qp.get("ref_offset");
    if (rawOffset) {
      const parsed = parseInt(rawOffset, 10);
      if (!Number.isNaN(parsed)) {
        REF_OFFSET = parsed;
      }
    }

    const rawScale = qp.get("ref_scale");
    if (rawScale) {
      const parsedScale = parseFloat(rawScale);
      if (!Number.isNaN(parsedScale) && parsedScale > 0) {
        REF_SCALE = parsedScale;
      }
    }

    // Tombol Ayo Bergabung (section paling bawah)
    const rawBtnX = qp.get("btn_x");
    if (rawBtnX) {
      const parsedX = parseInt(rawBtnX, 10);
      if (!Number.isNaN(parsedX)) {
        BTN_OFFSET_X = parsedX;
      }
    }

    const rawBtnY = qp.get("btn_y");
    if (rawBtnY) {
      const parsedY = parseInt(rawBtnY, 10);
      if (!Number.isNaN(parsedY)) {
        BTN_OFFSET_Y = parsedY;
      }
    }

    const rawBtnScale = qp.get("btn_scale");
    if (rawBtnScale) {
      const parsedBtnScale = parseFloat(rawBtnScale);
      if (!Number.isNaN(parsedBtnScale) && parsedBtnScale > 0) {
        BTN_SCALE = parsedBtnScale;
      }
    }

    // SectionKeunggulaan
    const rawKeunggX = qp.get("keungg_x");
    if (rawKeunggX) {
      const parsedKeunggX = parseInt(rawKeunggX, 10);
      if (!Number.isNaN(parsedKeunggX)) {
        KEUNG_OFFSET_X = parsedKeunggX;
      }
    }

    const rawKeunggY = qp.get("keungg_y");
    if (rawKeunggY) {
      const parsedKeunggY = parseInt(rawKeunggY, 10);
      if (!Number.isNaN(parsedKeunggY)) {
        KEUNG_OFFSET_Y = parsedKeunggY;
      }
    }

    const rawKeunggScale = qp.get("keungg_scale");
    if (rawKeunggScale) {
      const parsedKeunggScale = parseFloat(rawKeunggScale);
      if (!Number.isNaN(parsedKeunggScale) && parsedKeunggScale > 0) {
        KEUNG_SCALE = parsedKeunggScale;
      }
    }

    // YukGabung (atas-bawah)
    const rawYukY = qp.get("yuk_y");
    if (rawYukY) {
      const parsedYukY = parseInt(rawYukY, 10);
      if (!Number.isNaN(parsedYukY)) {
        YUK_OFFSET_Y = parsedYukY;
      }
    }

    // Button "Bergabung & Dapatkan Hadiah" di dalam YukGabung
    const rawJoinBtnX = qp.get("join_btn_x");
    if (rawJoinBtnX) {
      const parsedJoinX = parseInt(rawJoinBtnX, 10);
      if (!Number.isNaN(parsedJoinX)) {
        JOIN_BTN_OFFSET_X = parsedJoinX;
      }
    }

    const rawJoinBtnY = qp.get("join_btn_y");
    if (rawJoinBtnY) {
      const parsedJoinY = parseInt(rawJoinBtnY, 10);
      if (!Number.isNaN(parsedJoinY)) {
        JOIN_BTN_OFFSET_Y = parsedJoinY;
      }
    }

    const rawJoinBtnScale = qp.get("join_btn_scale");
    if (rawJoinBtnScale) {
      const parsedJoinScale = parseFloat(rawJoinBtnScale);
      if (!Number.isNaN(parsedJoinScale) && parsedJoinScale > 0) {
        JOIN_BTN_SCALE = parsedJoinScale;
      }
    }
  }

  // === SCROLL KE ATAS SAAT HALAMAN REFERRAL DIBUKA DARI HALAMAN LAIN ===
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0); // langsung ke paling atas
    }
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white overflow-x-hidden font-poppins">
      {/* NAVBAR */}
      <Navbar active="referral" />

      {/* ========= HERO: cinematic fade-up + floating stars ========= */}
      <motion.main
        className="relative w-full flex justify-center bg-white overflow-hidden"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background hero dengan zoom-out lembut */}
        <motion.img
          src={BgReferral}
          alt="Background Referral Joyin"
          className="w-full h-auto block"
          initial={{ opacity: 0, scale: 1.08, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* BINTANG KIRI ATAS (besar) – floating lembut */}
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-10 top-32 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: -20, scale: 0.7 }}
          animate={{
            opacity: 1,
            y: [0, -6, 0],
            scale: 1,
          }}
          transition={{
            duration: 2.1,
            delay: 0.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* BINTANG KIRI BAWAH (kecil) – beda ritme */}
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-32 top-60 md:top-64 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{
            opacity: 1,
            y: [0, 5, 0],
            scale: 1,
          }}
          transition={{
            duration: 2.4,
            delay: 0.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* BINTANG KANAN ATAS (besar) */}
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-10 top-36 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: -20, scale: 0.7 }}
          animate={{
            opacity: 1,
            y: [0, -5, 0],
            scale: 1,
          }}
          transition={{
            duration: 2.2,
            delay: 0.7,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* BINTANG KANAN TENGAH (kecil) */}
        <motion.img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-32 top-64 md:top-72 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none z-10"
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{
            opacity: 1,
            y: [0, 6, 0],
            scale: 1,
          }}
          transition={{
            duration: 2.5,
            delay: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* KONTEN TENGAH HERO */}
        <motion.section
          className="
            absolute inset-x-0 top-0
            max-w-5xl w-full mx-auto text-center 
            px-4 sm:px-6 lg:px-8 
            pt-32 md:pt-40 lg:pt-44
            pb-32 md:pb-40
            z-20
          "
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-white leading-tight drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          >
            Dapatkan Keuntungan dari Referral Joyin!
          </motion.h1>

          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg lg:text-[18px] text-white/95 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          >
            Temanmu dapat diskon spesial, kamu pun dapat hadiah menarik.
            Semakin banyak yang bergabung, semakin banyak untung yang kamu
            dapat!
          </motion.p>

          {/* Tombol hero */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <motion.button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white text-[#2BB673] font-semibold text-sm sm:text-base shadow-[0_14px_34px_rgba(0,0,0,0.2)] border border-white hover:translate-y-[1px] transition-transform duration-150"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: 1 }}
              whileTap={{ scale: 0.96 }}
            >
              Dapatkan Kode Referral
            </motion.button>

            <motion.button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-sm sm:text-base border border-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:bg-white/18 hover:translate-y-[1px] transition-all duration-150"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: 1 }}
              whileTap={{ scale: 0.96 }}
            >
              Pelajari Lebih Lanjut
            </motion.button>
          </div>
        </motion.section>
      </motion.main>

      {/* ========= SECTION 1: SectionRef1 ========= */}
      <motion.section
        className="w-full bg-white"
        initial={{ opacity: 0, y: REF_OFFSET + 90 }}
        whileInView={{ opacity: 1, y: REF_OFFSET }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full overflow-hidden">
          <motion.img
            src={SectionRef1}
            alt="Ilustrasi referral Joyin"
            className="w-full h-auto object-cover block"
            initial={{ opacity: 0, y: 50, scale: REF_SCALE * 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: REF_SCALE }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.section>

      {/* ========= SECTION 2: Keunggulan ========= */}
      <section className="w-full bg-white">
        <motion.div
          className="w-full overflow-hidden"
          style={{ transformOrigin: "center top" }}
          initial={{
            opacity: 0,
            x: KEUNG_OFFSET_X - 90,
            y: KEUNG_OFFSET_Y + 40,
            scale: KEUNG_SCALE * 0.9,
            rotate: -4,
          }}
          whileInView={{
            opacity: 1,
            x: KEUNG_OFFSET_X,
            y: KEUNG_OFFSET_Y,
            scale: KEUNG_SCALE,
            rotate: 0,
          }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.img
            src={SectionKeunggulaan}
            alt="Keunggulan program referral Joyin"
            className="w-full h-auto object-cover block"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.06, ease: "easeOut" }}
          />
        </motion.div>
      </section>

      {/* ========= SECTION 3: Yuk Gabung ========= */}
      <motion.section
        className="w-full bg-white"
        initial={{ opacity: 0, x: 70, y: YUK_OFFSET_Y + 90 }}
        whileInView={{ opacity: 1, x: 0, y: YUK_OFFSET_Y }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="w-full overflow-hidden relative">
          <motion.img
            src={YukGabung}
            alt="Yuk Gabung Joyin Referral"
            className="w-full h-auto object-cover block"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* TOMBOL "Bergabung & Dapatkan Hadiah" */}
          <div className="absolute top-[62%] left-1/2 -translate-x-1/2">
            <motion.div
              initial={{
                opacity: 0,
                x: JOIN_BTN_OFFSET_X + 28,
                y: JOIN_BTN_OFFSET_Y + 40,
                scale: JOIN_BTN_SCALE * 0.85,
              }}
              whileInView={{
                opacity: 1,
                x: JOIN_BTN_OFFSET_X,
                y: JOIN_BTN_OFFSET_Y,
                scale: JOIN_BTN_SCALE,
              }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: 0.1,
              }}
            >
              <motion.button
                type="button"
                className="
                  inline-flex items-center justify-center
                  px-10 sm:px-12 py-3 sm:py-3.5
                  rounded-full
                  bg-white
                  font-semibold
                  text-sm sm:text-base
                  leading-none
                  text-[#A259FF]
                  shadow-[0_14px_30px_rgba(0,0,0,0.25)]
                  outline-none focus:outline-none focus-visible:outline-none
                  ring-0 focus:ring-0 focus-visible:ring-0
                  border-0
                "
                whileHover={{ scale: 1.07, y: 1 }}
                whileTap={{ scale: 0.96 }}
              >
                Bergabung &amp; Dapatkan Hadiah
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ========= SECTION 4: CTA "Ayo Bergabung!" ========= */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            className="inline-block shadow-[0_8px_18px_rgba(0,0,0,0.08)] rounded-full"
            initial={{
              opacity: 0,
              x: BTN_OFFSET_X,
              y: BTN_OFFSET_Y + 90,
              scale: BTN_SCALE * 0.8,
            }}
            whileInView={{
              opacity: 1,
              x: BTN_OFFSET_X,
              y: BTN_OFFSET_Y,
              scale: BTN_SCALE,
            }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
            }}
          >
            <motion.button
              type="button"
              className="
                px-8 sm:px-10 py-2.5 sm:py-3
                rounded-full
                bg-[#FFB400]
                text-white
                font-semibold
                text-sm sm:text-base
                shadow-[0_6px_14px_rgba(0,0,0,0.18)]
                hover:translate-y-[1px]
                transition-transform duration-150
                outline-none focus:outline-none focus-visible:outline-none
                border-0
              "
              whileHover={{ scale: 1.08, y: 1 }}
              whileTap={{ scale: 0.96 }}
            >
              Ayo Bergabung!
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER DI PALING BAWAH */}
      <Footer />
    </div>
  );
}
