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

const keunggulan = [
  {
    icon: <FiZap className="text-4xl text-[#5CC9AF]" />,
    title: "Respons Kilat",
    desc: "Jawaban langsung keluar dalam hitungan detik. Gak pake tunggu-tungguan.",
  },
  {
    icon: <FiClock className="text-4xl text-[#5CC9AF]" />,
    title: "Aktif 24/7",
    desc: "Chatbot ini gak kenal kata libur. Mau nanya tengah malam pun tetap dilayani — kapan aja, selalu siap!",
  },
  {
    icon: <FaRobot className="text-4xl text-[#5CC9AF]" />,
    title: "Multitasking",
    desc: "Bisa bantu banyak orang sekaligus tanpa kewalahan. Gak ada antri panjang, semua dilayani barengan!",
  },
  {
    icon: <FiSmile className="text-4xl text-[#5CC9AF]" />,
    title: "Ramah & Sabar",
    desc: "Bisa diajak ngobrol santai tanpa takut di-judge. Mau tanya berulang kali juga tetap dijawab, gak bosenan.",
  },
  {
    icon: <FiDollarSign className="text-4xl text-[#5CC9AF]" />,
    title: "Hemat Biaya",
    desc: "Gak perlu banyak tim CS. Chatbot bantu handle pertanyaan umum secara otomatis — efisien dan praktis.",
  },
  {
    icon: <FiCheckCircle className="text-4xl text-[#5CC9AF]" />,
    title: "Jawaban Akurat",
    desc: "Dibekali AI yang pintar, jadi jawaban gak asal. Informasi yang keluar tetap konsisten, meski ditanya 100 kali.",
  },
  {
    icon: <LuPuzzle className="text-4xl text-[#5CC9AF]" />,
    title: "Bisa Disesuaikan",
    desc: "Mau gaya formal, sopan, atau receh? Semua bisa diatur biar sesuai dengan identitas usahamu!",
  },
  {
    icon: <FiLink className="text-4xl text-[#5CC9AF]" />,
    title: "Mudah Terintegrasi",
    desc: "Full Power di WhatsApp Joyin khusus buat WhatsApp, jadi performanya optimal untuk balasin chat pelanggan tanpa delay.",
  },
];

export default function Keunggulan() {
  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
        Kenapa harus pakai chatbot ini?
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
