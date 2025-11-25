// src/landingpage/Referral.jsx
import React from "react";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer"; // ⬅️ import Footer

import bintang from "../assets/bintang2.png"; // dipakai untuk semua bintang (besar & kecil)
import BgReferral from "../assets/BgReferral.png"; // gambar background referral
import SectionRef1 from "../assets/SectionRef1.png"; // gambar section bawah
import SectionKeunggulaan from "../assets/SectionKeunggulan1.png"; // gambar keunggulan di bawah SectionRef1
import YukGabung from "../assets/YukGabung.png"; // gambar section YukGabung

export default function Referral() {
  // === SETTING OFFSET & UKURAN GAMBAR SectionRef1 (bisa digeser & di-zoom via query param) ===
  // Contoh:
  //   ?ref_offset=-40   → geser SectionRef1 agak naik
  //   ?ref_offset=60    → geser SectionRef1 agak turun
  //   ?ref_scale=1.2    → SectionRef1 sedikit lebih besar (zoom in)
  //   ?ref_scale=0.9    → SectionRef1 sedikit lebih kecil (zoom out)
  let REF_OFFSET = -100;
  let REF_SCALE = 0.9;

  // === SETTING POSISI & SKALA TOMBOL "AYO BERGABUNG!" ===
  // Contoh:
  //   ?btn_x=40      → geser tombol ke kanan 40px
  //   ?btn_x=-30     → geser tombol ke kiri 30px
  //   ?btn_y=50      → geser tombol ke bawah 50px
  //   ?btn_y=-20     → geser tombol ke atas 20px
  //   ?btn_scale=1.2 → tombol sedikit lebih besar
  //   ?btn_scale=0.8 → tombol sedikit lebih kecil
  let BTN_OFFSET_X = -275;
  let BTN_OFFSET_Y = -1750;
  let BTN_SCALE = 1.25;

  // === SETTING POSISI & SKALA SectionKeunggulaan ===
  // Contoh:
  //   ?keungg_x=40      → geser SectionKeunggulaan ke kanan 40px
  //   ?keungg_x=-30     → geser SectionKeunggulaan ke kiri 30px
  //   ?keungg_y=50      → geser SectionKeunggulaan ke bawah 50px
  //   ?keungg_y=-20     → geser SectionKeunggulaan ke atas 20px
  //   ?keungg_scale=1.2 → SectionKeunggulaan sedikit lebih besar
  //   ?keungg_scale=0.8 → SectionKeunggulaan sedikit lebih kecil
  let KEUNG_OFFSET_X = 0;
  let KEUNG_OFFSET_Y = 0;
  let KEUNG_SCALE = 0.85;

  // === SETTING POSISI YUKGABUNG (hanya atas-bawah) ===
  // Contoh:
  //   ?yuk_y=40   → geser gambar YukGabung ke bawah 40px
  //   ?yuk_y=-30  → geser gambar YukGabung ke atas 30px
  let YUK_OFFSET_Y = 100;

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

    // Tombol Ayo Bergabung
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
  }

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white overflow-x-hidden font-poppins">
      {/* NAVBAR */}
      <Navbar active="referral" />

      {/* HERO REFERRAL dengan BgReferral sebagai IMG (full, nggak terpotong) */}
      <main className="relative w-full flex justify-center bg-white overflow-hidden">
        {/* Gambar BgReferral - selalu tampil penuh dari kiri ke kanan */}
        <img
          src={BgReferral}
          alt="Background Referral Joyin"
          className="w-full h-auto block"
        />

        {/* BINTANG KIRI ATAS (besar) */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-10 top-32 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none z-10"
        />

        {/* BINTANG KIRI BAWAH (kecil) */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-32 top-60 md:top-64 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none z-10"
        />

        {/* BINTANG KANAN ATAS (besar) */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-10 top-36 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none z-10"
        />

        {/* BINTANG KANAN TENGAH (kecil) */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-32 top-64 md:top-72 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none z-10"
        />

        {/* KONTEN TENGAH (overlay di atas BgReferral) */}
        <section
          className="
            absolute inset-x-0 top-0
            max-w-5xl w-full mx-auto text-center 
            px-4 sm:px-6 lg:px-8 
            pt-32 md:pt-40 lg:pt-44
            pb-32 md:pb-40
            z-20
          "
        >
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-white leading-tight drop-shadow-sm">
            Dapatkan Keuntungan dari Referral Joyin!
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg lg:text-[18px] text-white/95 leading-relaxed max-w-3xl mx-auto">
            Temanmu dapat diskon spesial, kamu pun dapat hadiah menarik.
            Semakin banyak yang bergabung, semakin banyak untung yang kamu
            dapat!
          </p>

          {/* TOMBOL AKSI HERO */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* PRIMARY BUTTON */}
            <button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white text-[#2BB673] font-semibold text-sm sm:text-base shadow-[0_14px_34px_rgba(0,0,0,0.2)] border border-white hover:translate-y-[1px] transition-transform duration-150"
            >
              Dapatkan Kode Referral
            </button>

            {/* SECONDARY BUTTON */}
            <button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-sm sm:text-base border border-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:bg-white/18 hover:translate-y-[1px] transition-all duration-150"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </section>
      </main>

      {/* SECTION PUTIH DENGAN GAMBAR SectionRef1 FULL WIDTH + SETTING UKURAN */}
      <section
        className="w-full bg-white"
        style={{
          transform: `translateY(${REF_OFFSET}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <div className="w-full overflow-hidden">
          <img
            src={SectionRef1}
            alt="Ilustrasi referral Joyin"
            className="w-full h-auto object-cover block"
            style={{
              transform: `scale(${REF_SCALE})`,
              transformOrigin: "center top",
              transition: "transform 0.25s ease-out",
            }}
          />
        </div>
      </section>

      {/* GAMBAR SectionKeunggulaan DI BAWAH SectionRef1 + SETTING POSISI & SKALA */}
      <section className="w-full bg-white">
        <div
          className="w-full overflow-hidden"
          style={{
            transform: `translate(${KEUNG_OFFSET_X}px, ${KEUNG_OFFSET_Y}px) scale(${KEUNG_SCALE})`,
            transformOrigin: "center top",
            transition: "transform 0.25s ease-out",
          }}
        >
          <img
            src={SectionKeunggulaan}
            alt="Keunggulan program referral Joyin"
            className="w-full h-auto object-cover block"
          />
        </div>
      </section>

      {/* SECTION GAMBAR YUK GABUNG DI BAWAH SectionKeunggulaan + SETTING ATAS-BAWAH */}
      <section
        className="w-full bg-white"
        style={{
          transform: `translateY(${YUK_OFFSET_Y}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        <div className="w-full overflow-hidden">
          <img
            src={YukGabung}
            alt="Yuk Gabung Joyin Referral"
            className="w-full h-auto object-cover block"
          />
        </div>
      </section>

      {/* SECTION TOMBOL "AYO BERGABUNG!" SAJA DENGAN SETTING POSISI & SKALA */}
      <section className="w-full bg-white py-12 md:py-16">
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6"
          style={{
            transform: `translate(${BTN_OFFSET_X}px, ${BTN_OFFSET_Y}px) scale(${BTN_SCALE})`,
            transformOrigin: "left top",
            transition: "transform 0.25s ease-out",
          }}
        >
          <div className="inline-block shadow-[0_8px_18px_rgba(0,0,0,0.08)] rounded-full">
            <button
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
                focus:outline-none
              "
            >
              Ayo Bergabung!
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER DI PALING BAWAH */}
      <Footer />
    </div>
  );
}
