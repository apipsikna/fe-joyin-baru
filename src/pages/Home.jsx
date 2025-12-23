// src/pages/Home.jsx
import React, { useMemo, memo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import karakter from "../assets/karakter_dashboard.png";
import gelombang from "../assets/gelombang.png";
import bintang from "../assets/bintang2.png";

// Recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ==================== LAYOUT CONFIG ==================== */
const HOME_LAYOUT = {
  mainContainerWidth: "max-w-7xl mx-auto",
};

/* ==================== GELOMBANG CONFIG ==================== */
const GELOMBANG_CFG = {
  x: -70,
  y: 120,
  w: 520,
  wMd: 600,
  rot: 30,
  opacity: 0.95,
};

const px = (n) => `${n}px`;

// --- MOCK DATA FOR CHART (STATISTIK PENGIRIMAN PESAN) ---
// Used as fallback or initial structure
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
];

/* ==================== SUB-COMPONENTS (Defined before usage) ==================== */

// 1. Chart Section (Memoized)
const StatisticsSection = memo(function StatisticsSection({ t }) {
  const [year, setYear] = useState("2025");

  // Mock data for different years
  const YEAR_DATA = useMemo(() => ({
    "2025": [500, 1200, 1650, 1100, 1350, 950, 1000, 1650, 1500, 1000, 750, 1400],
    "2024": [800, 950, 1100, 1000, 1200, 1300, 1150, 1400, 1300, 1100, 900, 1250],
    "2023": [400, 600, 800, 750, 900, 850, 950, 1100, 1050, 800, 650, 900],
    "2022": [200, 300, 400, 350, 500, 450, 600, 700, 650, 500, 400, 600],
  }), []);

  const chartData = useMemo(() => {
    const data = YEAR_DATA[year] || YEAR_DATA["2025"];
    return MONTHS.map((m, i) => ({ name: m, value: data[i] }));
  }, [year, YEAR_DATA]);

  return (
    <div className="mb-24">
      <h2 className="text-[20px] font-bold text-gray-900 mb-6">
        {t("home.stats.title", { defaultValue: "Statistik Pengiriman Pesan" })}
      </h2>
      <div className="w-full border border-gray-100 rounded-3xl p-6 relative bg-white shadow-sm flex flex-col items-stretch">
        {/* Dropdown Tahun */}
        <div className="absolute top-6 right-6 z-10">
          <div className="relative inline-block text-left">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Chart Container - Explicit height & width ensure rendering */}
        <div className="w-full h-[350px] min-h-[350px] mt-12 md:mt-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStatsHome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 1800]}
                ticks={[0, 450, 900, 1350, 1800]}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#34D399"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorStatsHome)"
                isAnimationActive={false} /* Disabled animation to prevent blinking/reset issues */
                activeDot={{ r: 6, strokeWidth: 0, fill: "#059669" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

// 2. Welcome Section (Memoized)
const WelcomeSection = memo(function WelcomeSection({ profileName, t }) {
  const g = GELOMBANG_CFG;

  return (
    <div className="flex justify-between items-center flex-wrap relative z-0 overflow-visible w-full px-6 md:px-12">
      <motion.img
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1, rotate: 49 }}
        transition={{ duration: 1 }}
        src={bintang}
        alt="bintang-kanan"
        className="absolute top-[30px] right-[290px] w-24 h-24 z-10 opacity-0 md:opacity-100" // Hide on mobile if too crowded
      />
      <motion.img
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1, rotate: 98 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        src={bintang}
        alt="bintang-kiri"
        className="absolute top-[120px] right-[390px] w-10 h-10 z-10 opacity-0 md:opacity-100"
      />

      <motion.div
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl z-10"
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
          {t("home.welcome", { defaultValue: "Selamat datang" })},{" "}
          <span style={{ color: "#FFFF00" }}>{profileName}</span>
        </h1>
        <p className="text-white text-xl md:text-2xl font-semibold mt-2">
          {t("home.subtitle", { defaultValue: "Joyin siap nemenin bisnismu." })}
        </p>
      </motion.div>

      {/* Wrapper karakter + gelombang */}
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1, rotate: -24 }}
        transition={{ duration: 1.2 }}
        className="mt-4 md:mt-0 relative right-[-20px] md:right-[-80px] rotate-[-40deg] scale-[1.2] md:scale-[1.4] z-0"
      >
        <img
          src={gelombang}
          alt="gelombang"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
          style={{
            width: px(g.w),
            opacity: g.opacity,
            transform: `translate(-50%, -50%) translate(${g.x}px, ${g.y}px) rotate(${g.rot}deg)`,
          }}
        />

        {/* md+ width */}
        <style>{`
          @media (min-width: 768px){
            .gelombang-md-width {
              width: ${px(g.wMd)};
            }
          }
        `}</style>
        <img
          src={gelombang}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 gelombang-md-width opacity-0"
        />

        <img
          src={karakter}
          alt="karakter"
          className="relative h-[300px] md:h-[410px] object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
    </div>
  );
});

// 3. Info Box
function InfoBox({ title, value, bg, text }) {
  return (
    <div
      className="rounded-[24px] p-8 w-full md:w-[280px] h-[140px] shadow-sm flex flex-col justify-center relative overflow-hidden transition-transform hover:scale-[1.02] duration-300"
      style={{ backgroundColor: bg }}
    >
      <p className="text-lg font-bold opacity-90 z-10" style={{ color: text }}>
        {title}
      </p>
      <p className="text-[42px] font-bold leading-none mt-1 z-10" style={{ color: text }}>
        {value}
      </p>
      {/* Decor Blob */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}

// 4. Kelola Bot
function KelolaBotSection({ t }) {
  return (
    <div className="mt-8 relative mb-12">
      <motion.div
        whileHover={{ x: 10, y: -10 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative bg-white w-full rounded-[28px] shadow-sm border border-gray-200
                   px-6 md:px-10 py-8 flex items-center justify-between overflow-hidden
                   hover:shadow-xl"
      >
        <div
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[78%] w-[6px] rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(46,204,154,0.35) 0%, rgba(46,204,154,0.9) 50%, rgba(46,204,154,0.35) 100%)",
          }}
        />

        <div className="pr-6 md:pr-10">
          <h3 className="text-2xl md:text-[28px] font-bold text-gray-900">
            {t("home.bot.title", { defaultValue: "Customer Service Bot" })}
          </h3>
          <span className="inline-block mt-4 px-4 py-1.5 text-sm font-semibold text-green-800 bg-green-100 rounded-full shadow-sm">
            {t("home.bot.active", { defaultValue: "Aktif" })}
          </span>
          <p className="text-gray-600 mt-5 max-w-3xl leading-relaxed">
            {t("home.bot.desc", {
              defaultValue:
                "Bot layanan pelanggan yang membantu menjawab pertanyaan, memberikan panduan, dan mendukung kebutuhan pelanggan.",
            })}
          </p>
        </div>

        <button
          type="button"
          className="shrink-0 h-12 px-8 rounded-full font-semibold text-white transition
                     bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 shadow"
        >
          {t("home.bot.manage", { defaultValue: "Kelola Bot" })}
        </button>
      </motion.div>
    </div>
  );
}

/* ==================== MAIN COMPONENT ==================== */
export default function Home({ profile }) {
  const { t } = useTranslation();

  return (
    <div className="w-full font-poppins">
      <WelcomeSection
        t={t}
        profileName={profile?.name || t("home.user", { defaultValue: "Pengguna" })}
      />

      {/* MAIN WHITE CONTAINER */}
      <div
        className={`-mt-24 bg-white rounded-t-[40px] shadow-lg w-full min-h-screen pb-24 z-10 relative pt-12 px-6 md:px-10 ${HOME_LAYOUT.mainContainerWidth}`}
      >
        {/* === Kotak Chat Masuk === */}
        <div className="mb-12">
          <h2 className="text-[22px] font-bold text-center mb-8 text-gray-900">
            {t("home.incomingChats", { defaultValue: "Chat Masuk" })}
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <InfoBox
              title={t("home.monthlyChats", { defaultValue: "Chat Bulanan" })}
              value="1.247"
              bg="#A7F3D0" // Greenish
              text="#059669"
            />
            <InfoBox
              title={t("home.answeredChats", { defaultValue: "Chat Terjawab" })}
              value="1.089"
              bg="#E9D5FF" // Purple
              text="#9333EA"
            />
            <InfoBox
              title={t("home.totalChats", { defaultValue: "Total Chat" })}
              value="8.534"
              bg="#FDE68A" // Yellow/Orange
              text="#D97706"
            />
          </div>
        </div>

        {/* Statistik Pengiriman Pesan - Extracted & Memoized */}
        <StatisticsSection t={t} />

        {/* Kelola Bot */}
        <KelolaBotSection t={t} />


      </div>
    </div>
  );
}


