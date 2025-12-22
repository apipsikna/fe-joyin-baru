// src/PaketDashboard/SectionBasic/ReportBasic.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaCalendarAlt, FaDownload } from "react-icons/fa";

const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

/**
 * REPORT_LAYOUT configurations
 */
const REPORT_LAYOUT = {
  sidePadMobile: 10,
  sidePadDesktop: 9,
  topPad: 22,
  gapTitleToCard: 30,
  cardRadiusTop: 46,
  cardMaxW: 2100, // Lebar maksimal container (bisa diubah sesuai kebutuhan)
};

// --- MOCK DATA ---
const STATS_DATA = [
  { label: "Dikirim", value: 898, color: "bg-[#C6FCE5]", text: "text-[#5FCAAC]" }, // Pastel Green
  { label: "Terkirim", value: 511, color: "bg-[#FCE8B3]", text: "text-[#F5B041]" }, // Pastel Yellow-ish
  { label: "Dibaca", value: 350, color: "bg-[#E0D4FC]", text: "text-[#9B59B6]" }, // Pastel Purple
  { label: "Gagal", value: 37, color: "bg-[#FCA3A3]", text: "text-[#E74C3C]" }, // Pastel Red
];

const PIE_DATA = [
  { name: "Terkirim", value: 511, color: "#F5B041" },
  { name: "Dibaca", value: 350, color: "#9B59B6" },
  { name: "Gagal", value: 37, color: "#E74C3C" },
];

const BAR_DATA = [
  { name: "Minggu 1", Dikirim: 200, Dibaca: 120, Terkirim: 150, Gagal: 10 },
  { name: "Minggu 2", Dikirim: 180, Dibaca: 100, Terkirim: 130, Gagal: 15 },
  { name: "Minggu 3", Dikirim: 220, Dibaca: 160, Terkirim: 180, Gagal: 5 },
  { name: "Minggu 4", Dikirim: 250, Dibaca: 190, Terkirim: 210, Gagal: 20 },
];

export default function ReportBasic() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1];

  // State untuk Filter Tanggal (Mock)
  const [startDate, setStartDate] = useState("2025-11-16");
  const [endDate, setEndDate] = useState("2025-12-16");

  const page = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.2,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const headerIn = {
    hidden: { opacity: 0, y: 12, filter: "blur(7px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.55, ease: EASE },
    },
  };

  const cardIn = {
    hidden: { opacity: 0, y: 18, scale: 0.995, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.65, ease: EASE },
    },
  };

  return (
    <motion.div
      className="w-full min-h-screen font-poppins overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
        "--spM": `${REPORT_LAYOUT.sidePadMobile}px`,
        "--spD": `${REPORT_LAYOUT.sidePadDesktop}px`,
        "--topPad": `${REPORT_LAYOUT.topPad}px`,
        "--gap": `${REPORT_LAYOUT.gapTitleToCard}px`,
        "--radTop": `${REPORT_LAYOUT.cardRadiusTop}px`,
        "--cardMaxW": `${REPORT_LAYOUT.cardMaxW}px`,
      }}
      variants={page}
      initial="hidden"
      animate="show"
    >
      <style>{`
        /* Hide scrollbar di body (opsional) */
        body { -ms-overflow-style: none; scrollbar-width: none; }
        body::-webkit-scrollbar { display: none; }

        .rp-pad{
          padding-left: var(--spM);
          padding-right: var(--spM);
        }
        @media (min-width: 768px){
          .rp-pad{
            padding-left: var(--spD);
            padding-right: var(--spD);
          }
        }
        .rp-cardMax{
          max-width: var(--cardMaxW);
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }
        /* Custom Date Picker Styles */
        input[type="date"]::-webkit-calendar-picker-indicator {
            opacity: 0.5;
            cursor: pointer;
        }
      `}</style>

      {/* HEADER */}
      <motion.div
        variants={headerIn}
        className="rp-pad shrink-0"
        style={{ paddingTop: "var(--topPad)" }}
      >
        <h1 className="text-center text-white font-extrabold tracking-wide text-[36px] md:text-[44px] leading-none drop-shadow-md">
          {t("reportBasic.title")}
        </h1>
      </motion.div>

      {/* WHITE CONTAINER BESAR */}
      <div
        className="rp-pad flex-1 min-h-0 flex flex-col"
        style={{ paddingTop: "var(--gap)", paddingBottom: 0 }}
      >
        <motion.div
          variants={cardIn}
          className="rp-cardMax flex-1 min-h-0 bg-[#F9FAFB] shadow-[0_26px_80px_rgba(0,0,0,0.18)] overflow-y-auto"
          style={{
            borderTopLeftRadius: "var(--radTop)",
            borderTopRightRadius: "var(--radTop)",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <div className="p-6 md:p-10 pb-20 flex flex-col gap-8">

            {/* 1. FILTER TANGGAL */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai</label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5FCAAC]"
                  />
                  {/* <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Akhir</label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5FCAAC]"
                  />
                </div>
              </div>
            </div>

            {/* 2. STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {STATS_DATA.map((stat, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 ${stat.color} shadow-sm flex flex-col justify-center items-start min-h-[140px]`}
                >
                  <span className={`text-md font-bold mb-2 ${stat.text} opacity-80`}>
                    {stat.label}
                  </span>
                  <span className={`text-4xl md:text-5xl font-extrabold ${stat.text}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* 3. CHARTS SECTION */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* Pie Chart: Status Pengiriman */}
              <div className="w-full lg:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-w-0">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Status Pengiriman</h3>

                {/* Legend Custom */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {PIE_DATA.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-gray-600 font-medium">{entry.name}</span>
                    </div>
                  ))}
                </div>

                {/* Fixed height container for Pie */}
                <div className="w-full h-[300px] min-w-0">
                  <ResponsiveContainer width="99%" height="100%" debounce={300}>
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={0}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Statistik Mingguan */}
              <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-w-0">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Statistik Mingguan</h3>

                {/* Legend Custom */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {STATS_DATA.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: idx === 0 ? '#64DAB8' : (idx === 1 ? '#F5B041' : (idx === 2 ? '#9B59B6' : '#E74C3C')) }} />
                      <span className="text-gray-600 font-medium">{entry.label}</span>
                    </div>
                  ))}
                </div>

                {/* Fixed height container for Bar to prevent flickering */}
                <div
                  className="w-full h-[350px] min-w-0"
                  style={{ contain: "layout size" }}
                >
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart
                      data={BAR_DATA}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      barGap={6}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dy={10}
                        interval={0}
                        height={60}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                        contentStyle={{ borderRadius: '12px', borderColor: '#E5E7EB' }}
                      />
                      <Bar dataKey="Dikirim" fill="#64DAB8" radius={[4, 4, 4, 4]} barSize={20} isAnimationActive={false} />
                      <Bar dataKey="Terkirim" fill="#F5B041" radius={[4, 4, 4, 4]} barSize={20} isAnimationActive={false} />
                      <Bar dataKey="Dibaca" fill="#9B59B6" radius={[4, 4, 4, 4]} barSize={20} isAnimationActive={false} />
                      <Bar dataKey="Gagal" fill="#E74C3C" radius={[4, 4, 4, 4]} barSize={20} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="flex justify-center mt-4">
              <button className="bg-[#5FCAAC] hover:bg-[#4FB89B] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
                <FaDownload className="text-lg" />
                <span>Download Excel</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
