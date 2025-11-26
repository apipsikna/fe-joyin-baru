// src/pages/BuktiPembayaran.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import StrukBg from "../assets/Struk.png"; // src/assets/Struk.png

const TAX_RATE = 0.11;

const STRUK_DEFAULT = {
  scale: 3,
  x: 40,
  y: -150,
  rotate: 0,
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function readNum(qp, key, fallback) {
  const raw = qp.get(key);
  if (raw == null || raw === "") return fallback;
  const v = Number(String(raw).replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

function formatStrukRupiah(n) {
  const num = Number(n);
  const safe = Number.isFinite(num) ? Math.round(num) : 0;
  const formatted = new Intl.NumberFormat("id-ID").format(safe);
  return `RP. ${formatted},-`;
}

function formatWita(dateLike) {
  try {
    const d = dateLike ? new Date(dateLike) : new Date();
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Makassar",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "-";
  }
}

function safeUpper(s) {
  return (s || "-").toString();
}

function CopyIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width="18"
      height="18"
      aria-hidden
      fill="none"
    >
      <path
        d="M9 9h10v12H9V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BuktiPembayaran() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const data = location.state || {};

  const st = useMemo(() => {
    const qp = new URLSearchParams(location.search);

    const scale = clamp(readNum(qp, "st_scale", STRUK_DEFAULT.scale), 0.3, 6);
    const x = clamp(readNum(qp, "st_x", STRUK_DEFAULT.x), -800, 800);
    const y = clamp(readNum(qp, "st_y", STRUK_DEFAULT.y), -800, 800);
    const rotate = clamp(readNum(qp, "st_rot", STRUK_DEFAULT.rotate), -45, 45);

    return { scale, x, y, rotate };
  }, [location.search]);

  const total = useMemo(() => {
    const t = Number(data.total ?? data.amount ?? 0);
    return Number.isFinite(t) ? Math.round(t) : 0;
  }, [data.total, data.amount]);

  const { subtotal, tax } = useMemo(() => {
    if (!total) return { subtotal: 0, tax: 0 };
    const sub = Math.round(total / (1 + TAX_RATE));
    const ppn = Math.max(0, total - sub);
    return { subtotal: sub, tax: ppn };
  }, [total]);

  const transactionId =
    data.transactionId || data.trxId || data.orderId || "TRX-XXXX";
  const transactionTime =
    data.transactionTime || data.time || new Date().toISOString();
  const methodLabel = data.methodLabel || "Transfer Bank BCA";
  const receiver = data.receiver || "PT Joyin ID";
  const paket = data.planName || "Paket Basic";

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("ID Transaksi disalin");
    } catch {
      alert("Gagal menyalin");
    }
  };

  const pageV = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: reduce ? 0 : 0.06,
      },
    },
  };

  const itemV = {
    hidden: { opacity: 0, y: reduce ? 0 : 10, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="w-screen min-h-screen flex items-center justify-center px-4 py-10 font-poppins overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #5FCAAC 0%, #DAEC75 100%)",
      }}
      variants={pageV}
      initial="hidden"
      animate="show"
    >
      <div className="w-full flex justify-center">
        <motion.div
          variants={itemV}
          className="relative w-full max-w-[420px] overflow-visible"
        >
          {/* animasi wrapper (biar transform gambar tetep dari query param) */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={StrukBg}
              alt="Struk"
              draggable={false}
              className="w-full h-auto select-none pointer-events-none relative z-0 block"
              style={{
                transform: `translate3d(${st.x}px, ${st.y}px, 0) scale(${st.scale}) rotate(${st.rotate}deg)`,
                transformOrigin: "center top",
                willChange: "transform",
              }}
            />
          </motion.div>

          <div className="absolute inset-0 z-10 flex flex-col px-8 pt-12 pb-8">
            <motion.div variants={itemV} className="text-center text-[28px] font-extrabold leading-tight text-gray-700">
              Pembayaran
              <br />
              Berhasil
            </motion.div>

            <div className="mt-8 flex-1">
              <motion.div variants={itemV} className="text-center">
                <div className="text-[18px] font-bold text-gray-600">
                  ID Transaksi
                </div>

                <div className="mt-2 inline-flex items-center gap-2">
                  <div className="text-[18px] font-extrabold text-emerald-600 tracking-wide">
                    {safeUpper(transactionId)}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(transactionId)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Salin ID Transaksi"
                    title="Salin"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemV} className="mt-8 space-y-5 text-[16px]">
                <Row
                  label="Tanggal & Waktu"
                  value={`${formatWita(transactionTime)} WITA`}
                />
                <Row label="Metode Pembayaran" value={methodLabel} />
                <Row label="Nama Penerima" value={receiver} />
                <Row label="Paket" value={paket} />

                <div className="mt-6 h-px bg-gray-200" />

                <div className="pt-4 space-y-3">
                  <Row label="Subtotal" value={formatStrukRupiah(subtotal)} />
                  <Row label="PPN (11%)" value={formatStrukRupiah(tax)} />
                </div>

                <div className="pt-2">
                  <div className="flex items-end justify-between">
                    <div className="text-[20px] font-extrabold text-gray-700">
                      Total
                    </div>
                    <div className="text-[22px] font-extrabold text-emerald-600">
                      {formatStrukRupiah(total)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemV} className="mt-6 grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={() => window.print()}
                className="h-12 rounded-2xl bg-emerald-400 text-white font-semibold shadow-sm hover:opacity-90"
                whileHover={reduce ? undefined : { y: -1 }}
                whileTap={reduce ? undefined : { scale: 0.99 }}
              >
                Download Struk
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate("/dashboard", { replace: true })}
                className="h-12 rounded-2xl bg-emerald-400 text-white font-semibold shadow-sm hover:opacity-90"
                whileHover={reduce ? undefined : { y: -1 }}
                whileTap={reduce ? undefined : { scale: 0.99 }}
              >
                Kembali
              </motion.button>
            </motion.div>

            <style>{`
              @media print {
                body { background: white !important; }
              }
            `}</style>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="text-gray-600 font-semibold">{label}</div>
      <div className="text-emerald-600 font-extrabold text-right">{value}</div>
    </div>
  );
}
