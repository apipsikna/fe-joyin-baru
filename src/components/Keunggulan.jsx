import React from "react";
import { motion } from "framer-motion";
import {
  FiZap,
  FiClock,
  FiSmile,
  FiDollarSign,
  FiCheckCircle,
  FiLink,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { LuPuzzle } from "react-icons/lu";

// Moved inside component


import { useTranslation } from "react-i18next";

export default function Keunggulan() {
  const { t } = useTranslation();

  const keunggulan = [
    {
      icon: <FiZap className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.0.title", "Respons Kilat"),
      desc: t("keunggulan.items.0.desc", "Jawaban langsung keluar..."),
    },
    {
      icon: <FiClock className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.1.title", "Aktif 24/7"),
      desc: t("keunggulan.items.1.desc", "Chatbot ini gak kenal kata libur..."),
    },
    {
      icon: <FaRobot className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.2.title", "Multitasking"),
      desc: t("keunggulan.items.2.desc", "Bisa bantu banyak orang..."),
    },
    {
      icon: <FiSmile className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.3.title", "Ramah & Sabar"),
      desc: t("keunggulan.items.3.desc", "Bisa diajak ngobrol santai..."),
    },
    {
      icon: <FiDollarSign className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.4.title", "Hemat Biaya"),
      desc: t("keunggulan.items.4.desc", "Gak perlu banyak tim CS..."),
    },
    {
      icon: <FiCheckCircle className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.5.title", "Jawaban Akurat"),
      desc: t("keunggulan.items.5.desc", "Dibekali AI yang pintar..."),
    },
    {
      icon: <LuPuzzle className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.6.title", "Bisa Disesuaikan"),
      desc: t("keunggulan.items.6.desc", "Mau gaya formal, sopan..."),
    },
    {
      icon: <FiLink className="text-4xl text-[#5CC9AF]" />,
      title: t("keunggulan.items.7.title", "Mudah Terintegrasi"),
      desc: t("keunggulan.items.7.desc", "Full Power di WhatsApp Joyin..."),
    },
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
        {t("keunggulan.title", "Kenapa harus pakai chatbot ini?")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {keunggulan.map(({ icon, title, desc }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="group rounded-2xl p-6 border border-gray-200 bg-white text-gray-700 shadow-sm cursor-pointer hover:bg-purple-600 hover:text-white hover:shadow-lg transition-colors duration-300"
          >
            <div className="mb-4 transition-colors duration-300 group-hover:text-white">
              {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
