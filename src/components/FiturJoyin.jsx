import React from "react";
import { motion } from "framer-motion";
import joyinImage from "../assets/foto3.png";

// Moved inside component or processed with t()


import { useTranslation } from "react-i18next";

export default function FiturJoyin() {
  const { t } = useTranslation();

  const fitur = [
    { title: t("fitur.items.0.title", "Joyin Personality"), desc: t("fitur.items.0.desc", "Atur gaya ngobrol...") },
    { title: t("fitur.items.1.title", "Knowledge Base"), desc: t("fitur.items.1.desc", "Simpan semua info...") },
    { title: t("fitur.items.2.title", "Auto-Ignore List"), desc: t("fitur.items.2.desc", "Mau skip nomor spam...") },
    { title: t("fitur.items.3.title", "Online 24/7"), desc: t("fitur.items.3.desc", "Joyin selalu bisa jawab...") },
  ];

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <motion.h2
        className="text-2xl lg:text-3xl font-bold text-center mb-16"
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {t("fitur.title", "Yang Kamu Dapatkan di Joyin")}
      </motion.h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <motion.img
          src={joyinImage}
          alt="Joyin Fitur"
          className="w-full lg:w-[50%] rounded-3xl shadow-xl"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="w-full lg:w-[45%] space-y-6"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {fitur.map((f, i) => (
            <div key={i}>
              <h2 className="text-xl lg:text-2xl font-semibold text-teal-400">{f.title}</h2>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
