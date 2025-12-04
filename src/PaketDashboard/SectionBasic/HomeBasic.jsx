// src/PaketDashboard/SectionBasic/HomeBasic.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import karakter from "../../assets/karakter_dashboard.png";
import gelombang from "../../assets/gelombang.png";
import bintang from "../../assets/bintang2.png";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";

/* ==================== LAYOUT CONFIG (untuk developer) ==================== */
const HOME_LAYOUT = {
  mainContainerWidth: "max-w-7xl mx-auto",
};

/* ==================== GELOMBANG CONFIG (bisa digeser/zoom/rotate) ==================== */
const GELOMBANG_CFG = {
  // posisi relatif terhadap center karakter
  x: -70, // + ke kanan, - ke kiri (px)
  y: 120, // + ke bawah, - ke atas (px)

  // ukuran
  w: 520, // px (mobile)
  wMd: 600, // px (md ke atas)

  // rotasi (derajat)
  rot: 30,

  // tampilan
  opacity: 0.95,
};

const px = (n) => `${n}px`;

// ==================== Home Page ====================
export default function HomeBasic({ profile }) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <WelcomeSection
        t={t}
        profileName={profile?.name || t("home.user", { defaultValue: "Pengguna" })}
      />

      {/* MAIN WHITE CONTAINER */}
      <div
        className={`-mt-24 bg-white rounded-t-[40px] shadow-lg w-full min-h-[300px] z-10 relative pt-12 px-6 md:px-10 ${HOME_LAYOUT.mainContainerWidth}`}
      >
        {/* === Kotak Chat Masuk === */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-center mb-6">
            {t("home.incomingChats", { defaultValue: "Chat Masuk" })}
          </h2>
          <div className="flex gap-8 flex-wrap justify-center">
            <InfoBox
              title={t("home.monthlyChats", { defaultValue: "Chat Bulanan" })}
              value="0"
              bg="#CFFCEF"
              text="#5EB7A8"
            />
            <InfoBox
              title={t("home.answeredChats", { defaultValue: "Chat Terjawab" })}
              value="0"
              bg="#E8D7FF"
              text="#9F70FD"
            />
            <InfoBox
              title={t("home.totalChats", { defaultValue: "Total Chat" })}
              value="0"
              bg="#FFE7B2"
              text="#F9A825"
            />
          </div>
        </div>

        {/* Statistik */}
        <StatisticsSection t={t} />

        {/* Kelola Bot */}
        <KelolaBotSection t={t} />

        {/* Container tambahan layanan bot */}
        <BotServicesContainer t={t} />
      </div>
    </div>
  );
}

// ==================== Welcome Section ====================
function WelcomeSection({ profileName, t }) {
  const g = GELOMBANG_CFG;

  return (
    <div className="flex justify-between items-center flex-wrap relative z-0 overflow-visible w-full px-6 md:px-12">
      <motion.img
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1, rotate: 49 }}
        transition={{ duration: 1 }}
        src={bintang}
        alt="bintang-kanan"
        className="absolute top-[30px] right-[290px] w-24 h-24 z-10"
      />
      <motion.img
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1, rotate: 98 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        src={bintang}
        alt="bintang-kiri"
        className="absolute top-[120px] right-[390px] w-10 h-10 z-10"
      />

      <motion.div
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl z-10"
      >
        <h1 className="text-white text-4xl font-bold">
          {t("home.welcome", { defaultValue: "Selamat datang" })},{" "}
          <span style={{ color: "#FFFF00" }}>{profileName}</span>
        </h1>
        <p className="text-white text-2xl font-semibold mt-2">
          {t("home.subtitle", { defaultValue: "Joyin siap nemenin bisnismu." })}
        </p>
      </motion.div>

      {/* ✅ Wrapper karakter + gelombang (gelombang di belakang persis) */}
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1, rotate: -24 }}
        transition={{ duration: 1.2 }}
        className="mt-4 md:mt-0 relative right-[-80px] rotate-[-40deg] scale-[1.4] z-0"
      >
        {/* Gelombang (di belakang karakter) */}
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

        {/* apply md width via extra class (supaya gampang & stabil) */}
        <img
          src={gelombang}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 gelombang-md-width opacity-0"
          style={{}}
        />

        {/* Karakter (di depan gelombang) */}
        <img
          src={karakter}
          alt="karakter"
          className="relative h-[410px] object-contain pointer-events-none select-none z-10"
        />
      </motion.div>
    </div>
  );
}

// ==================== Info Box ====================
function InfoBox({ title, value, bg, text }) {
  return (
    <div
      className="rounded-2xl p-8 text-center w-[260px] h-[150px] max-w-full shadow-lg flex flex-col justify-center"
      style={{ backgroundColor: bg }}
    >
      <p className="text-xl font-bold" style={{ color: text }}>
        {title}
      </p>
      <p className="text-5xl font-bold mt-2" style={{ color: text }}>
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ==================== Statistik Section =========================== */
/* ------------------------------------------------------------------ */
function CustomTooltip({ active, payload, label, t }) {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-xl border border-emerald-100 bg-white/90 backdrop-blur px-3 py-2 shadow-md">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-bold text-emerald-600">
        {t("home.stats.messages", { defaultValue: "Pesan" })}: {val}
      </p>
    </div>
  );
}

// 👉 dibungkus React.memo supaya nggak re-render terus
const StatisticsSection = React.memo(function StatisticsSectionInner({ t }) {
  const monthLabels = useMemo(
    () => [
      t("months.janShort", { defaultValue: "Jan" }),
      t("months.febShort", { defaultValue: "Feb" }),
      t("months.marShort", { defaultValue: "Mar" }),
      t("months.aprShort", { defaultValue: "Apr" }),
      t("months.mayShort", { defaultValue: "May" }),
      t("months.junShort", { defaultValue: "Jun" }),
      t("months.julShort", { defaultValue: "Jul" }),
      t("months.augShort", { defaultValue: "Aug" }),
      t("months.sepShort", { defaultValue: "Sep" }),
      t("months.octShort", { defaultValue: "Oct" }),
      t("months.novShort", { defaultValue: "Nov" }),
      t("months.decShort", { defaultValue: "Des" }),
    ],
    [t]
  );

  const YEAR_DATA = useMemo(
    () => ({
      2025: [1, 3, 4, 3, 2, 5, 4, 2, 1, 3, 2, 5],
      2024: [2, 2, 3, 4, 3, 3, 5, 4, 3, 2, 2, 4],
      2023: [1, 1, 2, 2, 3, 3, 2, 1, 2, 2, 3, 3],
      2022: [0, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 2],
    }),
    []
  );

  const [year, setYear] = useState("2025");

  const data = useMemo(() => {
    const arr = YEAR_DATA[year] || [];
    return monthLabels.map((m, i) => ({ name: m, value: arr[i] ?? 0 }));
  }, [monthLabels, YEAR_DATA, year]);

  const avg = useMemo(() => {
    const total = data.reduce((s, d) => s + (d.value || 0), 0);
    return data.length ? Math.round((total / data.length) * 10) / 10 : 0;
  }, [data]);

  const maxValue = useMemo(
    () => data.reduce((max, d) => (d.value > max ? d.value : max), 0),
    [data]
  );

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-lg p-8 w-full">
      <h2 className="text-2xl font-bold text-center mb-8">
        {t("home.stats.title", { defaultValue: "Statistik Pengiriman Pesan" })}
      </h2>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-4 px-1">
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-emerald-600">{avg}</span>{" "}
          {t("home.stats.avgPerMonth", { defaultValue: "rata-rata/bulan" })}
        </div>

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      <div className="w-full rounded-2xl border border-emerald-100 shadow-[0_10px_30px_rgba(92,201,175,.15)] p-3">
        <div className="w-full h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 24, left: 0, bottom: 10 }}
              barCategoryGap={18}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5CC9AF" />
                  <stop offset="100%" stopColor="#D7E96F" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                allowDuplicatedCategory={false}
                tickMargin={8}
                minTickGap={0}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, maxValue + 1]}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<CustomTooltip t={t} />}
                cursor={{ fill: "rgba(16,185,129,0.06)" }}
              />

              <ReferenceLine
                y={avg}
                stroke="#10b981"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
                label={{
                  value: `${t("home.stats.average", {
                    defaultValue: "Rata-rata",
                  })}: ${avg}`,
                  position: "right",
                  fill: "#10b981",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[12, 12, 8, 8]}
                maxBarSize={38}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => `${v}`}
                  style={{
                    fill: "#111827",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  isAnimationActive={false}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {t("home.stats.note", {
          defaultValue:
            "Data di atas merupakan contoh. Integrasikan dengan API analitik Anda untuk angka aktual.",
        })}
      </p>
    </div>
  );
});

// ==================== Kelola Bot ====================
function KelolaBotSection({ t }) {
  return (
    <div className="mt-16 relative">
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

// ==================== Container Tambahan di Bawah ====================
function BotServicesContainer({ t }) {
  return (
    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-inner p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        {t("home.services.title", { defaultValue: "Layanan Bot Tersedia" })}
      </h4>
      <ul className="space-y-3 text-gray-600">
        <li>
          ✅{" "}
          {t("home.services.item1", {
            defaultValue: "Menjawab pertanyaan pelanggan otomatis",
          })}
        </li>
        <li>
          ✅{" "}
          {t("home.services.item2", {
            defaultValue: "Memberikan panduan produk & layanan",
          })}
        </li>
        <li>
          ✅{" "}
          {t("home.services.item3", {
            defaultValue: "Mendukung kebutuhan pelanggan 24/7",
          })}
        </li>
        <li>
          ✅{" "}
          {t("home.services.item4", {
            defaultValue: "Statistik performa bot real-time",
          })}
        </li>
      </ul>
    </div>
  );
}
