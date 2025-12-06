// src/components/PaketHarga.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // axios instance yg sdh terhubung AuthContext
import { useTranslation } from "react-i18next";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paketList.map((paket, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.35 }}
            viewport={{ once: true }}
            className="bg-white border rounded-3xl p-6 hover:shadow-2xl flex flex-col h-full"
          >
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-green-400">
                {paket.title}
              </h3>
              <p className="text-center text-gray-700 font-semibold mt-2">
                {paket.price}{" "}
                <span className="text-sm text-gray-500">{t("paket.month", "/ Bulan")}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {paket.features.map((f, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 text-lg mr-2">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleChoose(paket.planId)}
                disabled={loadingPlan === paket.planId || !snapReady}
                className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-300
                  ${loadingPlan === paket.planId || !snapReady
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-400 hover:bg-yellow-400 hover:text-gray-800"
                  }`}
              >
                {loadingPlan === paket.planId
                  ? t("paket.loading", "Memulai pembayaran...")
                  : paket.button}
              </button>
              {!MIDTRANS_CLIENT_KEY && (
                <p className="mt-2 text-xs text-red-500">
                  VITE_MIDTRANS_CLIENT_KEY belum diset di .env
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
