// src/components/Footer.jsx
import React from "react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-12 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
        {/* Kiri - Logo */}
        <div className="flex-1">
          <img src={logo} alt="Joyin" className="w-32 mb-4" />
        </div>

        {/* Tengah - Navigasi */}
        <div className="flex-1 grid grid-cols-2 gap-12">
          <div>
            <h3 className="font-bold text-[18px] mb-3">Quick Links</h3>
            <ul className="space-y-2 text-[16px] font-medium">
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  Reseller
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[18px] mb-3">Support</h3>
            <ul className="space-y-2 text-[16px] font-medium">
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  Syarat dan Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Kanan - Kontak */}
        <div className="flex-1">
          <h3 className="font-bold text-[18px] mb-3">Contact Us</h3>
          <ul className="space-y-3 text-[16px] font-medium">
            <li className="text-black font-semibold flex items-center gap-2">
              <span>📧</span> <span>joyin.id@gmail.com</span>
            </li>
            <li className="text-black font-semibold flex items-center gap-2">
              <span>📞</span> <span>+62 812-5472-9989</span>
            </li>
            <li className="text-black font-semibold flex items-center gap-2">
              <span>⏰</span>{" "}
              <span>Senin - Jumat, 09:00 - 17:00 WITA</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bawah dengan garis hitam penuh dari ujung kiri ke kanan */}
      <div className="mt-10 -mx-6 lg:-mx-20 border-t border-black/20">
        <div className="text-black pt-6 text-center text-[14px]">
          &copy; {new Date().getFullYear()} Joyin.id. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
