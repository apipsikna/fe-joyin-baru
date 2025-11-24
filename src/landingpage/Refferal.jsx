// src/landingpage/Referral.jsx
import React from "react";
import Navbar from "../components/Navbar1";

import bintang from "../assets/bintang2.png";
import bintangkecil from "../assets/bintangkecil.png";

export default function Referral() {
  const heroBackground = {
    background:
      "radial-gradient(circle at 0% 0%, #7BE6B0 0, #7BE6B0 35%, transparent 60%), radial-gradient(circle at 100% 0%, #FFE97A 0, #FFE97A 35%, transparent 60%), linear-gradient(180deg, #7BDFC5 0%, #F8FFF4 80%)",
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <Navbar active="referral" />

      {/* HERO REFERRAL */}
      <main
        className="flex-1 relative flex items-center justify-center overflow-x-hidden"
        style={heroBackground}
      >
        {/* BINTANG KIRI ATAS */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-8 top-40 w-16 drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
        />

        {/* BINTANG KIRI BAWAH */}
        <img
          src={bintangkecil}
          alt="bintang dekorasi"
          className="absolute left-28 top-64 w-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)]"
        />

        {/* BINTANG KANAN ATAS */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-10 top-44 w-16 drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
        />

        {/* BINTANG KANAN TENGAH */}
        <img
          src={bintangkecil}
          alt="bintang dekorasi"
          className="absolute right-32 top-80 w-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)]"
        />

        {/* KONTEN TENGAH */}
        <section className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-white drop-shadow-sm leading-tight">
            Dapatkan Keuntungan dari Referral Joyin!
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/95 leading-relaxed max-w-3xl mx-auto">
            Temanmu dapat diskon spesial, kamu pun dapat hadiah menarik.
            Semakin banyak yang bergabung, semakin banyak untung yang kamu
            dapat!
          </p>

          {/* TOMBOL AKSI */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* PRIMARY BUTTON */}
            <button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white text-[#2BB673] font-semibold text-sm sm:text-base shadow-[0_12px_30px_rgba(0,0,0,0.18)] border border-white hover:translate-y-[1px] transition-transform duration-150"
            >
              Dapatkan Kode Referral
            </button>

            {/* SECONDARY BUTTON */}
            <button
              type="button"
              className="px-10 sm:px-12 py-3.5 sm:py-4 rounded-full bg-white/80 text-[#4E5F67] font-semibold text-sm sm:text-base border border-white/80 shadow-[0_10px_26px_rgba(0,0,0,0.12)] hover:bg-white hover:translate-y-[1px] transition-all duration-150"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
