// src/components/Footer.jsx
import React from "react";
import logo from "../assets/logo.png";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
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
            <h3 className="font-bold text-[18px] mb-3">{t("footer.links", "Quick Links")}</h3>
            <ul className="space-y-2 text-[16px] font-medium">
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  {t("footer.features", "Fitur")}
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  {t("footer.reseller", "Reseller")}
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  {t("footer.about", "Tentang Kami")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[18px] mb-3">{t("footer.support", "Support")}</h3>
            <ul className="space-y-2 text-[16px] font-medium">
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  {t("footer.faq", "FAQ")}
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  {t("footer.policy", "Kebijakan Privasi")}
                </a>
              </li>
              <li>
                <a href="#" className="text-black font-semibold hover:underline">
                  {t("footer.terms", "Syarat dan Ketentuan")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Kanan - Kontak */}
        <div className="flex-1">
          <h3 className="font-bold text-[18px] mb-3">{t("footer.contact", "Contact Us")}</h3>
          <ul className="space-y-3 text-[16px] font-medium">
            <li className="text-black font-semibold flex items-center gap-2">
              <span>📧</span> <span>joyin.id@gmail.com</span>
            </li>
            <li className="text-black font-semibold flex items-center gap-2">
              <span>📞</span> <span>+62 812-5472-9989</span>
            </li>
            <li className="text-black font-semibold flex items-center gap-2">
              <span>⏰</span>{" "}
              <span>{t("footer.time", "Senin - Jumat, 09:00 - 17:00 WITA")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bawah dengan garis hitam penuh dari ujung kiri ke kanan */}
      <div className="mt-10 -mx-6 lg:-mx-20 border-t border-black/20">
        <div className="text-black pt-6 text-center text-[14px]">
          &copy; {new Date().getFullYear()} {t("footer.copyright", "Joyin.id. All rights reserved.")}
        </div>
      </div>
    </footer>
  );
}
