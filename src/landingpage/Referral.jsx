// src/landingpage/Referral.jsx
import React from "react";
import Navbar from "../components/Navbar1";

import bintang from "../assets/bintang2.png";
import bintangkecil from "../assets/bintangkecil.png";

export default function Referral() {
  // Gradien mendekati desain: hijau → kuning di atas, memudar lembut ke hijau pucat di bawah
  const heroBackground = {
    backgroundImage: [
      // Horizontal: hijau ke kuning
      "linear-gradient(90deg, #61D4AA 0%, #6BD8AE 38%, #BFE7A5 72%, #FFE98A 100%)",
      // Vertikal: hijau ke hijau-putih di bawah
      "linear-gradient(180deg, #72D9B4 0%, #6FD3B0 40%, #BDEFD7 78%, #F4FFF8 100%)",
    ].join(", "),
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundColor: "#72D9B4",
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white overflow-x-hidden font-poppins">
      {/* NAVBAR */}
      <Navbar active="referral" />

      {/* HERO REFERRAL */}
      <main
        className="w-full flex-1 relative flex justify-center"
        style={heroBackground}
      >
        {/* BINTANG KIRI ATAS (besar) */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute left-10 top-32 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none"
        />

        {/* BINTANG KIRI BAWAH (kecil) */}
        <img
          src={bintangkecil}
          alt="bintang dekorasi"
          className="absolute left-32 top-60 md:top-64 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none"
        />

        {/* BINTANG KANAN ATAS (besar) */}
        <img
          src={bintang}
          alt="bintang dekorasi"
          className="absolute right-10 top-36 w-16 md:w-18 drop-shadow-[0_10px_22px_rgba(0,0,0,0.18)] pointer-events-none select-none"
        />

        {/* BINTANG KANAN TENGAH (kecil) */}
        <img
          src={bintangkecil}
          alt="bintang dekorasi"
          className="absolute right-32 top-64 md:top-72 w-10 md:w-11 drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)] pointer-events-none select-none"
        />

        {/* KONTEN TENGAH */}
        <section className="relative max-w-5xl w-full mx-auto text-center px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32 pb-32 md:pb-40">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-white leading-tight drop-shadow-sm">
            Dapatkan Keuntungan dari Referral Joyin!
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg lg:text-[18px] text-white/95 leading-relaxed max-w-3xl mx-auto">
            Temanmu dapat diskon spesial, kamu pun dapat hadiah menarik.
            Semakin banyak yang bergabung, semakin banyak untung yang kamu
            dapat!
          </p>

          {/* TOMBOL AKSI */}
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
    </div>
  );
}
