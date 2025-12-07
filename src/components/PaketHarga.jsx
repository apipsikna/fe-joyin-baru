// src/components/PaketHarga.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // axios instance yg sdh terhubung AuthContext
import { useTranslation } from "react-i18next";
import { HiCheckCircle } from "react-icons/hi2";

export default function PaketHarga() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingPlan, setLoadingPlan] = useState(null); // "BASIC" | "PRO" | ...
  const [snapReady, setSnapReady] = useState(false);

  // ===== Konfigurasi Midtrans (env) =====
  const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  const MIDTRANS_ENV = (import.meta.env.VITE_MIDTRANS_ENV || "sandbox").toLowerCase();

  const SNAP_BASE =
    MIDTRANS_ENV === "sandbox"
      ? "https://app.sandbox.midtrans.com/snap/snap.js" // ✅ sandbox
      : "https://app.midtrans.com/snap/snap.js";        // ✅ production


  // ===== Muat script Snap sekali =====
  useEffect(() => {
    if (typeof window !== "undefined" && window.snap) {
      setSnapReady(true);
      return;
    }
    if (!MIDTRANS_CLIENT_KEY) {
      console.error("VITE_MIDTRANS_CLIENT_KEY belum diset di .env");
      return;
    }
    const script = document.createElement("script");
    script.src = SNAP_BASE;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.onload = () => setSnapReady(true);
    script.onerror = () => console.error("Gagal memuat Midtrans snap.js");
    document.body.appendChild(script);

    // optional cleanup
    return () => {
      // jangan di-remove agar tidak reload berulang saat navigasi
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paketList = [
    {
      planId: "BASIC", // <- HARUS sesuai BE
      title: t("paket.plans.0.title", "Paket Basic"),
      price: "Rp 49.000",
      features: t("paket.plans.0.features", { returnObjects: true }) || [],
      button: t("paket.plans.0.button", "Pilih Basic"),
    },
    {
      planId: "PRO",
      title: t("paket.plans.1.title", "Paket Pro"),
      price: "Rp 99.000",
      features: t("paket.plans.1.features", { returnObjects: true }) || [],
      button: t("paket.plans.1.button", "Pilih Pro"),
    },
    {
      planId: "BUSINESS",
      title: t("paket.plans.2.title", "Paket Bisnis"),
      price: "Rp 199.000",
      features: t("paket.plans.2.features", { returnObjects: true }) || [],
      button: t("paket.plans.2.button", "Pilih Bisnis"),
    },
    {
      planId: "ENTERPRISE",
      title: t("paket.plans.3.title", "Paket Enterprise"),
      price: "Rp 499.000",
      features: t("paket.plans.3.features", { returnObjects: true }) || [],
      button: t("paket.plans.3.button", "Pilih Enterprise"),
    },
  ];

  async function handleChoose(planId) {
    try {
      if (!snapReady || !window.snap) {
        alert(t("paket.loading", "Sedang menyiapkan pembayaran, coba lagi sebentar..."));
        return;
      }
      setLoadingPlan(planId);

      // Panggil BE utk buat transaksi & ambil token Snap
      const res = await api.post("/payments", { planId });
      const token =
        res?.data?.data?.transaction_token ||
        res?.data?.transaction_token ||
        res?.data?.token;

      if (!token) {
        throw new Error("Token pembayaran tidak ditemukan.");
      }

      // Buka popup Snap
      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log("Success:", result);
          alert("Pembayaran berhasil! Langganan akan segera aktif.");
          navigate("/dashboard");
        },
        onPending: function (result) {
          console.log("Pending:", result);
          alert("Pembayaran pending. Selesaikan pembayaran Anda.");
        },
        onError: function (error) {
          console.error("Error:", error);
          alert("Terjadi kesalahan saat memproses pembayaran.");
        },
        onClose: function () {
          console.log("Popup ditutup oleh pengguna.");
        },
      });
    } catch (err) {
      console.error(err);
      // Jika belum login -> BE akan balas 401
      if (err?.response?.status === 401) {
        alert("Silakan login untuk melanjutkan pembayaran.");
        navigate("/login");
      } else {
        alert(
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memulai pembayaran."
        );
      }
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6">
        {t("paket.title", "Temukan Paket yang Paling Cocok untukmu")}
      </h2>
      <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
        {t("paket.desc", "Joyin punya pilihan paket yang fleksibel buat segala kebutuhan...")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {paketList.map((paket, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-300 p-6 md:p-8 hover:-translate-y-2"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-2">
                {paket.title}
              </h3>
              <div className="flex items-baseline text-gray-900">
                <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {paket.price}
                </span>
                <span className="ml-2 text-sm font-medium text-gray-400">
                  {t("paket.month", "/ Bulan")}
                </span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {paket.features.map((f, idx) => (
                <li key={idx} className="flex items-start">
                  <HiCheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mr-3" />
                  <span className="text-[15px] font-medium text-gray-600 leading-relaxed">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleChoose(paket.planId)}
              disabled={loadingPlan === paket.planId || !snapReady}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md ${loadingPlan === paket.planId || !snapReady
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg active:scale-95"
                }`}
            >
              {loadingPlan === paket.planId
                ? t("paket.loading", "Memulai...")
                : paket.button}
            </button>
            {!MIDTRANS_CLIENT_KEY && (
              <p className="mt-3 text-[10px] text-center text-red-400 font-mono">
                ! KEY MISSING
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
