// src/pages/MyPackages.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function MyPackages() {
  const navigate = useNavigate();

  const goChoosePlan = () => {
    // Arahkan ke halaman pembayaran/checkout
    navigate("/checkout");
  };

  return (
    // Bungkus penuh tinggi lalu "tempelkan" kartu ke bawah
    <div className="w-full min-h-full flex flex-col px-4 md:px-8 pt-6 pb-0">
      <div className="mt-auto">
        {/* Kartu putih besar yang nempel di bawah */}
        <div className="bg-white rounded-t-[36px] rounded-b-none border border-black/10 shadow-md w-full min-h-[520px] p-6 md:p-10">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center max-w-[680px] mx-auto">
              <SadFaceIcon className="mx-auto mb-6" />
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                <span className="font-medium">Ups, kamu belum punya paket nih.</span>{" "}
                Yuk pilih paket dulu biar bisa lanjut menikmati semua fitur chatbot
                dan bikin bisnismu makin lancar
              </p>

              <button
                onClick={goChoosePlan}
                className="mt-8 inline-flex items-center justify-center px-8 py-3 rounded-xl text-white font-semibold bg-[#5CC9AF] hover:opacity-90 transition"
              >
                Pilih Paket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SadFaceIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="84"
      height="84"
      viewBox="0 0 84 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lingkaran wajah */}
      <circle cx="42" cy="42" r="28" stroke="#5CC9AF" strokeWidth="4" />
      {/* Mata kiri */}
      <circle cx="33" cy="38" r="3" fill="#5CC9AF" />
      {/* Mata kanan */}
      <circle cx="51" cy="38" r="3" fill="#5CC9AF" />
      {/* Mulut sedih */}
      <path
        d="M54 55c-3-4-7-6-12-6s-9 2-12 6"
        stroke="#5CC9AF"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Air mata kecil di kiri */}
      <path
        d="M28 46c-2.2 2.4-2.2 4.8 0 7.2"
        stroke="#5CC9AF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
