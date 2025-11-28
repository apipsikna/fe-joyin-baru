// src/pages/Checkout.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

/* ====================== Referral Config ====================== */
const REFERRAL_STORAGE_KEY = "signup_referral_code";
const REFERRAL_DISCOUNT_RATE = 0.06; // 6%
const RECEIPT_STORAGE_KEY = "last_receipt";

/* ====================== TAX (PPN) ====================== */
const TAX_RATE = 0.11; // 11%

/* ====================== Data ====================== */
const PLANS = [
  {
    id: "basic",
    name: "Paket Basic",
    price: 49000,
    benefits: [
      "300 percakapan/bulan",
      "Balasan otomatis 24/7",
      "Integrasi WhatsApp mudah",
      "Template balasan standar",
      "Statistik bulanan sederhana",
      "FAQ dasar bawaan",
    ],
  },
  {
    id: "pro",
    name: "Paket Pro",
    price: 99000,
    benefits: [
      "1.000 percakapan/bulan",
      "Balasan otomatis 24/7",
      "Template balasan costum",
      "Auto-update FAQ produk",
      "Statistik & insight pelanggan",
      "Notifikasi chat masuk",
      "Pesan sambutan personal",
    ],
  },
  {
    id: "business",
    name: "Paket Bisnis",
    price: 199000,
    benefits: [
      "5.000 percakapan/bulan",
      "Multi-admin WhatsApp",
      "Balasan otomatis 24/7",
      "Template balasan premium",
      "FAQ otomatis & terjadwal",
      "Pesan terjadwal promosi",
      "Laporan mingguan lengkap",
      "Prioritas dukungan teknis",
    ],
  },
  {
    id: "enterprise",
    name: "Paket Enterprise",
    price: 499000,
    benefits: [
      "Chat tanpa batas",
      "Integrasi WhatsApp API penuh",
      "Balasan otomatis 24/7",
      "Statistik real-time & export data",
      "Multi-admin + manajemen tim",
      "Laporan custom & konsultasi setup",
      "Prioritas dukungan & SLA support",
      "Integrasi sistem internal (CRM/API)",
    ],
  },
];

const METHODS = [
  { id: "card", label: "Kartu Kredit" },
  { id: "bank", label: "Transfer Bank" },
  { id: "ewallet", label: "E–Wallet" },
  { id: "qris", label: "QRIS" },
];

const BANKS = [
  {
    id: "bni",
    name: "BNI",
    logos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg/200px-Bank_Negara_Indonesia_logo_%282004%29.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Bank_Negara_Indonesia_logo.svg",
    ],
  },
  {
    id: "bca",
    name: "BCA",
    logos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/250px-Bank_Central_Asia.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/BCA_logo_%282020%29.svg",
    ],
  },
  {
    id: "bri",
    name: "BRI",
    logos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/250px-BRI_2020.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Logo_BRI.svg",
    ],
  },
  {
    id: "mandiri",
    name: "Mandiri",
    logos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/250px-Bank_Mandiri_logo_2016.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Bank_Mandiri_logo_2016.svg",
    ],
  },
];

const EWALLETS = [
  {
    id: "gopay",
    name: "gopay",
    logos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/250px-Gopay_logo.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/7/73/GoPay_Logo.svg",
    ],
  },
  {
    id: "dana",
    name: "DANA",
    logos: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/250px-Logo_dana_blue.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/DANA_logo.svg",
    ],
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    logos: [
      "https://fintech.id/_next/image?url=https%3A%2F%2Ffintechid-bucket.s3.ap-southeast-3.amazonaws.com%2Faftech%2Fassets%2Ffiles%2Fshares%2Flogo%2Flogofi2%2FShopeePay.png&w=640&q=75",
      "https://upload.wikimedia.org/wikipedia/commons/7/73/ShopeePay_logo_%282020%29.svg",
    ],
  },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}
function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

const MIDTRANS_CLIENT_KEY =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_MIDTRANS_CLIENT_KEY) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_MIDTRANS_CLIENT_KEY) ||
  "SB-Mid-client-xxxxxxxx";

const MIDTRANS_ENV =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_MIDTRANS_ENV) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_MIDTRANS_ENV) ||
  "sandbox";

/* ===== Collapsible ===== */
function Collapsible({ open, children, duration = 320 }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const next = open ? el.scrollHeight : 0;
    setHeight(next);
  }, [open, children]);

  return (
    <div
      className={classNames(
        "overflow-hidden",
        open ? "border-t border-gray-200" : "border-t border-transparent"
      )}
      style={{
        height,
        transition: `height ${duration}ms cubic-bezier(0.2,0,0,1)`,
      }}
      aria-hidden={!open}
    >
      <div
        ref={ref}
        className={classNames(
          "px-5 py-4 transition duration-300 ease-out",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ====================== Page ====================== */
export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  // ===== Page animation variants =====
  const pageV = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : 16 },
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
      exit: {
        opacity: 0,
        y: reduce ? 0 : -10,
        transition: { duration: reduce ? 0.01 : 0.22 },
      },
    }),
    [reduce]
  );

  const itemV = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : 12, filter: "blur(4px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: reduce ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] },
      },
    }),
    [reduce]
  );

  const [planId, setPlanId] = useState("basic");
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [months, setMonths] = useState(0);
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", name: "", cvv: "" });

  const [bank, setBank] = useState(null);
  const [ewallet, setEwallet] = useState(null);

  // ===== Referral state (ambil dari localStorage) =====
  const purchaseKey = useMemo(() => {
    const who = user?.id ?? user?.email ?? "unknown";
    return `first_purchase_done:${who}`;
  }, [user?.id, user?.email]);

  const [referralCode, setReferralCode] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    try {
      const code = (localStorage.getItem(REFERRAL_STORAGE_KEY) || "")
        .trim()
        .toUpperCase();
      setReferralCode(code);
    } catch {
      setReferralCode("");
    }

    try {
      setHasPurchased(localStorage.getItem(purchaseKey) === "1");
    } catch {
      setHasPurchased(false);
    }
  }, [purchaseKey]);

  const [payInfo, setPayInfo] = useState({
    open: false,
    type: null,
    orderId: null,
    va: null,
    bank: null,
    deeplink: null,
    qrUrl: null,
    qrString: null,
    additional: null,
  });

  const pollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.id === planId),
    [planId]
  );

  // ===== Harga dasar (belum diskon, belum pajak) =====
  const subtotal = useMemo(
    () => (selectedPlan?.price || 0) * months,
    [selectedPlan, months]
  );

  const discountEligible = useMemo(() => {
    return Boolean(referralCode) && !hasPurchased && months >= 1;
  }, [referralCode, hasPurchased, months]);

  const discountAmount = useMemo(() => {
    if (!discountEligible) return 0;
    return Math.floor(subtotal * REFERRAL_DISCOUNT_RATE);
  }, [subtotal, discountEligible]);

  // ===== DPP (setelah diskon) =====
  const dpp = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  // ===== PPN 11% =====
  const tax = useMemo(() => {
    return Math.round(dpp * TAX_RATE);
  }, [dpp]);

  // ===== Total bayar (DPP + PPN) =====
  const total = useMemo(() => {
    return Math.max(0, dpp + tax);
  }, [dpp, tax]);

  const markFirstPurchaseDone = async (orderId) => {
    try {
      localStorage.setItem(purchaseKey, "1");
    } catch {}
    setHasPurchased(true);

    try {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch {}
    setReferralCode("");

    if (referralCode) {
      try {
        await api.post("/referrals/complete-first-purchase", {
          orderId,
          referralCode,
        });
      } catch {
        // ignore untuk FE-only
      }
    }
  };

  const paymentTypeToLabel = (pt, fallbackMethod) => {
    const x = String(pt || "").toLowerCase();
    if (!x) {
      const y = String(fallbackMethod || "").toLowerCase();
      if (y === "bank") return "Transfer Bank";
      if (y === "card") return "Kartu Kredit";
      if (y === "ewallet") return "E–Wallet";
      if (y === "qris") return "QRIS";
      return "-";
    }
    if (x.includes("credit_card")) return "Kartu Kredit";
    if (x.includes("bank_transfer")) return "Transfer Bank";
    if (x.includes("qris")) return "QRIS";
    return x.toUpperCase();
  };

  const gotoReceipt = ({ orderId, amount, paymentType }) => {
    const paidAmount =
      Number.isFinite(Number(amount)) && Number(amount) > 0
        ? Math.round(Number(amount))
        : total;

    const payload = {
      orderId,
      amount: paidAmount,
      paymentType,
      methodLabel: paymentTypeToLabel(paymentType, method),
      planName: selectedPlan?.name || "-",
      months,

      // Rincian
      subtotal, // harga normal (sebelum diskon & pajak)
      discountAmount,
      dpp, // setelah diskon (sebelum pajak)
      taxAmount: tax,
      total: paidAmount, // total akhir (dpp + ppn)

      transactionTime: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      statusLabel: "Berhasil",
    };

    try {
      localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(payload));
    } catch {}

    navigate("/bukti-pembayaran", { state: payload, replace: true });
  };

  const pollStatus = (orderId) => {
    if (!orderId) return;
    if (pollRef.current) clearInterval(pollRef.current);

    let tries = 0;

    const checkOnce = async () => {
      tries++;
      try {
        const res = await api.get(`/payments/core/status/${orderId}`);
        const json = res.data;

        if (json?.ok) {
          const st = json.status?.transaction_status;
          const pt = json.status?.payment_type;
          const amt = Number(json.status?.gross_amount || 0);

          if (st === "capture" || st === "settlement") {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;

            setPayInfo((s) => ({ ...s, open: false }));
            await markFirstPurchaseDone(orderId);

            gotoReceipt({ orderId, amount: amt, paymentType: pt });
            return;
          }

          if (st === "deny" || st === "cancel" || st === "expire") {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            alert(`Pembayaran gagal: ${st}`);
            return;
          }
        }
      } catch (err) {
        console.warn(
          "Gagal cek status pembayaran:",
          err.response?.status,
          err.response?.data || err.message
        );
      }

      if (tries >= 60) {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    checkOnce();
    pollRef.current = setInterval(checkOnce, 3000);
  };

  // ===== Load Midtrans 3DS script (sandbox / production) + ready flag =====
  const [ccReady, setCcReady] = useState(
    Boolean(window?.MidtransNew3ds?.getCardToken)
  );

  useEffect(() => {
    if (window?.MidtransNew3ds?.getCardToken) {
      setCcReady(true);
      return;
    }

    const existing = document.querySelector('script[data-midtrans="new3ds"]');
    if (existing) {
      const t = setInterval(() => {
        if (window?.MidtransNew3ds?.getCardToken) {
          setCcReady(true);
          clearInterval(t);
        }
      }, 200);
      return () => clearInterval(t);
    }

    const s = document.createElement("script");
    const envLower =
      String(MIDTRANS_ENV).toLowerCase() === "production"
        ? "production"
        : "sandbox";
    const base =
      envLower === "production"
        ? "https://api.midtrans.com"
        : "https://api.sandbox.midtrans.com";

    s.src = `${base}/v2/assets/js/midtrans-new-3ds.min.js`;
    s.async = true;
    s.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    s.setAttribute("data-environment", envLower);
    s.setAttribute("data-midtrans", "new3ds");
    s.onload = () => setCcReady(Boolean(window?.MidtransNew3ds?.getCardToken));
    s.onerror = () => setCcReady(false);
    document.body.appendChild(s);
  }, []);

  const cardOk =
    card.number.replace(/\s/g, "").length >= 12 &&
    /\d{2}\/\d{2}/.test(card.expiry) &&
    card.name.trim().length >= 3 &&
    /^\d{3,4}$/.test(card.cvv || "");

  const canPay =
    months >= 1 &&
    !!selectedPlan &&
    (method === "card"
      ? cardOk && ccReady
      : method === "bank"
      ? !!bank
      : method === "ewallet"
      ? !!ewallet
      : true);

  const callCharge = async (payload) => {
    const res = await api.post("/payments/core/charge", payload);
    const json = res.data;
    if (!json?.ok) throw new Error(json?.message || "Charge failed");
    return json;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!canPay) {
      if (months < 1) alert("Pilih durasi minimal 1 bulan dulu ya.");
      else if (method === "card" && !ccReady)
        alert("Midtrans 3DS belum siap. Coba refresh / tunggu sebentar.");
      return;
    }

    const orderIdLocal = `ORDER-${Date.now()}`;
    const grossAmount = total; // ✅ total sudah termasuk PPN

    try {
      if (method === "card") {
        if (!window.MidtransNew3ds?.getCardToken) {
          alert("Midtrans 3DS script belum termuat. Coba refresh.");
          return;
        }

        const [mm, yy] = card.expiry.split("/");
        window.MidtransNew3ds.getCardToken(
          {
            card_number: card.number.replace(/\s/g, ""),
            card_exp_month: (mm || "").trim(),
            card_exp_year: `20${(yy || "").trim()}`,
            card_cvv: (card.cvv || "").trim(),
            gross_amount: grossAmount,
          },
          async (tokenResponse) => {
            try {
              if (
                !tokenResponse ||
                String(tokenResponse.status_code) !== "200"
              ) {
                alert(
                  `Tokenisasi gagal: ${
                    tokenResponse?.status_message || "Unknown error"
                  }`
                );
                return;
              }

              const tokenId = tokenResponse.token_id;

              const { result, order_id } = await callCharge({
                method: "card",
                tokenId,
                amount: grossAmount,
                orderId: orderIdLocal,
                customer: { first_name: card.name },
              });

              const oid = order_id || result?.order_id || orderIdLocal;

              if (result?.redirect_url && window.MidtransNew3ds?.authenticate) {
                window.MidtransNew3ds.authenticate({
                  redirect_url: result.redirect_url,
                  callback: function (authResult) {
                    setPayInfo({
                      open: true,
                      type: "card",
                      orderId: oid,
                      additional: {
                        message:
                          authResult?.redirect_status === "success"
                            ? "Verifikasi 3DS sukses. Kami cek status pembayaran..."
                            : "Verifikasi 3DS gagal/dibatalkan.",
                      },
                    });
                    if (authResult?.redirect_status === "success") {
                      pollStatus(oid);
                    }
                  },
                });
              } else {
                setPayInfo({
                  open: true,
                  type: "card",
                  orderId: oid,
                  additional: {
                    message:
                      "Pembayaran kartu diproses. Kami cek status pembayaran...",
                  },
                });
                pollStatus(oid);
              }
            } catch (err) {
              console.error(err);
              alert(
                err?.response?.data?.message ||
                  err.message ||
                  "Pembayaran kartu gagal."
              );
            }
          }
        );
        return;
      }

      if (method === "bank") {
        const { result, order_id } = await callCharge({
          method: "bank",
          bank,
          amount: grossAmount,
          orderId: orderIdLocal,
        });

        const va =
          (result.va_numbers && result.va_numbers[0]?.va_number) ||
          result.permata_va_number ||
          result.va_number;

        const bankCode =
          (result.va_numbers && result.va_numbers[0]?.bank) ||
          (result.permata_va_number ? "permata" : bank);

        setPayInfo({
          open: true,
          type: "bank",
          orderId: order_id || orderIdLocal,
          va,
          bank: (bankCode || "").toUpperCase(),
          additional: { expire: result.expiry_time || result.expired_time },
        });

        pollStatus(order_id || orderIdLocal);
        return;
      }

      if (method === "ewallet") {
        if (!ewallet) {
          alert("Pilih e-wallet terlebih dahulu");
          return;
        }
        const { result, order_id } = await callCharge({
          method: "ewallet",
          ewallet,
          amount: grossAmount,
          orderId: orderIdLocal,
        });

        const actions = result.actions || [];
        const deeplink = actions.find((a) => a.name === "deeplink-redirect")?.url;
        const qr = actions.find((a) => a.name === "qr")?.url;

        setPayInfo({
          open: true,
          type: "ewallet",
          orderId: order_id || orderIdLocal,
          deeplink: deeplink || null,
          qrUrl: qr || null,
          additional: { provider: ewallet.toUpperCase() },
        });

        pollStatus(order_id || orderIdLocal);
        return;
      }

      if (method === "qris") {
        const { result, order_id } = await callCharge({
          method: "qris",
          amount: grossAmount,
          orderId: orderIdLocal,
        });

        const actions = result.actions || [];
        const qr = actions.find((a) => a.name === "qr")?.url || result.qr_url;
        const qrString = result.qr_string || null;

        setPayInfo({
          open: true,
          type: "qris",
          orderId: order_id || orderIdLocal,
          qrUrl: qr || null,
          qrString,
        });

        pollStatus(order_id || orderIdLocal);
        return;
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || "Pembayaran gagal.");
    }
  };

  const onCardChange = (key) => (e) =>
    setCard((s) => ({ ...s, [key]: e.target.value }));

  return (
    <>
      <motion.div
        className="w-screen min-h-screen bg-[#EFEFEF] px-4 md:px-8 py-6"
        variants={pageV}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <div className="mx-auto">
          <motion.h1
            variants={itemV}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            Checkout
          </motion.h1>

          {/* Banner referral */}
          <AnimatePresence mode="popLayout">
            {referralCode && !hasPurchased && (
              <motion.div
                variants={itemV}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                Kamu pakai referral{" "}
                <span className="font-mono font-semibold">{referralCode}</span> —
                diskon <span className="font-semibold">6%</span> otomatis untuk
                pembelian pertama.
              </motion.div>
            )}

            {hasPurchased && (
              <motion.div
                variants={itemV}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                className="mb-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
              >
                Pembelian pertama sudah pernah dilakukan. Diskon referral tidak
                berlaku lagi.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={itemV}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {/* LEFT */}
            <motion.div
              variants={itemV}
              className="lg:col-span-2 bg-white border border-black/10 rounded-2xl p-4 md:p-6 space-y-6"
            >
              <SectionTitle icon={HiOutlineCube} title="Pilih Paket" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                {PLANS.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: reduce ? 0 : 0.05 + idx * 0.04,
                        duration: reduce ? 0.01 : 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    whileHover={reduce ? undefined : { y: -3 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                  >
                    <PlanCard
                      plan={p}
                      expanded={expandedPlan === p.id}
                      onSelect={() => setPlanId(p.id)}
                      onToggleExpand={() =>
                        setExpandedPlan((cur) => (cur === p.id ? null : p.id))
                      }
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemV}>
                <DurasiBlock
                  months={months}
                  onDec={() => setMonths((m) => Math.max(0, m - 1))}
                  onInc={() => setMonths((m) => Math.min(36, m + 1))}
                />
              </motion.div>

              <motion.div variants={itemV}>
                <SectionTitleCustom />
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                {METHODS.map(({ id, label }, idx) => {
                  const active = method === id;
                  const Icon =
                    id === "card"
                      ? IconCreditCard
                      : id === "bank"
                      ? IconBankTransfer
                      : id === "ewallet"
                      ? IconWallet
                      : IconQris;

                  return (
                    <motion.button
                      key={id}
                      onClick={() => setMethod(id)}
                      className={classNames(
                        "group flex flex-col items-center justify-center gap-3 rounded-[18px] border bg-white px-4 py-5 md:py-6 text-sm shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition",
                        active
                          ? "border-[#5CC9AF] ring-1 ring-[#5CC9AF]"
                          : "border-[#E7E7E7] hover:border-[#5CC9AF]",
                        "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      )}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                      type="button"
                      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: reduce ? 0 : 0.08 + idx * 0.04,
                          duration: reduce ? 0.01 : 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }}
                      whileHover={reduce ? undefined : { y: -2 }}
                      whileTap={reduce ? undefined : { scale: 0.98 }}
                    >
                      <Icon className="h-8 w-14" />
                      <span className="font-medium text-gray-800">{label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                variants={itemV}
                className="rounded-xl border border-gray-200 p-4 md:p-5"
              >
                {method === "card" && (
                  <div className="grid grid-cols-1 gap-3">
                    <LabeledInput
                      label="No. Kartu"
                      placeholder="4811 1111 1111 1114"
                      value={card.number}
                      onChange={onCardChange("number")}
                      inputMode="numeric"
                      maxLength={23}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <LabeledInput
                        label="Tanggal Kedaluwarsa"
                        placeholder="MM/YY (contoh: 12/30)"
                        value={card.expiry}
                        onChange={onCardChange("expiry")}
                        maxLength={5}
                      />
                      <LabeledInput
                        label="CVV"
                        placeholder="123"
                        value={card.cvv}
                        onChange={onCardChange("cvv")}
                        inputMode="numeric"
                        maxLength={4}
                      />
                      <LabeledInput
                        label="Nama di Kartu"
                        placeholder="AFIF TEST"
                        value={card.name}
                        onChange={onCardChange("name")}
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      Midtrans 3DS:{" "}
                      <span
                        className={
                          ccReady
                            ? "text-emerald-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {ccReady ? "Siap" : "Belum siap"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Nomor kartu & CVV tidak dikirim ke server kami. Tokenisasi
                      dilakukan aman langsung ke Midtrans.
                    </p>
                  </div>
                )}

                {method === "bank" && (
                  <BankSelector
                    banks={BANKS}
                    selected={bank}
                    onSelect={setBank}
                  />
                )}

                {method === "ewallet" && (
                  <>
                    <EWalletSelector
                      wallets={EWALLETS}
                      selected={ewallet}
                      onSelect={setEwallet}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Setelah klik bayar, kami tampilkan tautan/deeplink untuk
                      menyelesaikan lewat aplikasi{" "}
                      {ewallet ? ewallet.toUpperCase() : "e-wallet"}.
                    </p>
                  </>
                )}

                {method === "qris" && (
                  <PlaceholderInfo
                    title="QRIS"
                    desc="Setelah klik Bayar, QR akan muncul di layar untuk kamu scan."
                  />
                )}
              </motion.div>

              <motion.button
                onClick={handlePay}
                disabled={!canPay}
                className={classNames(
                  "w-full mt-2 h-12 rounded-xl font-semibold text-white transition",
                  canPay
                    ? "bg-[#5CC9AF] hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                )}
                type="button"
                variants={itemV}
                whileHover={canPay && !reduce ? { y: -1 } : undefined}
                whileTap={canPay && !reduce ? { scale: 0.99 } : undefined}
              >
                Bayar Sekarang - {formatRupiah(total)}
              </motion.button>
            </motion.div>

            {/* RIGHT */}
            <motion.aside
              variants={itemV}
              className="bg-white border border-black/10 rounded-2xl p-4 md:p-6 h-fit"
            >
              <h3 className="text-base font-semibold mb-4">Ringkasan Pembelian</h3>

              <SummaryPlanCard plan={selectedPlan} />

              <dl className="space-y-2 text-sm mt-4">
                <Row label="Durasi :" value={`${months} bulan`} />
                <Row
                  label="Metode Pembayaran :"
                  value={
                    method === "bank"
                      ? `Transfer Bank (${
                          BANKS.find((b) => b.id === bank)?.name || "-"
                        })`
                      : method === "ewallet"
                      ? `E–Wallet (${
                          EWALLETS.find((w) => w.id === ewallet)?.name || "-"
                        })`
                      : METHODS.find((m) => m.id === method)?.label
                  }
                />
                <Row
                  label="Harga / bulan :"
                  value={formatRupiah(selectedPlan?.price || 0)}
                />

                <Row label="Subtotal :" value={formatRupiah(subtotal)} />

                {discountEligible && (
                  <Row
                    label="Diskon Referral (6%) :"
                    value={`- ${formatRupiah(discountAmount)}`}
                  />
                )}

                {discountEligible && (
                  <Row
                    label="Subtotal Setelah Diskon :"
                    value={formatRupiah(dpp)}
                  />
                )}

                {/* ✅ PPN */}
                <Row label="PPN (11%) :" value={formatRupiah(tax)} />

                <div className="h-px bg-gray-200 my-3" />
                <Row bold label="Total :" value={formatRupiah(total)} />
              </dl>
            </motion.aside>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal animasi */}
      <AnimatePresence>
        {payInfo.open && (
          <PayInstructionModal
            info={payInfo}
            onClose={() => setPayInfo((s) => ({ ...s, open: false }))}
            onCheckStatus={() => pollStatus(payInfo.orderId)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ====================== Components ====================== */

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-[#5CC9AF]" />
      <h2 className="text-sm md:text-base font-semibold">{title}</h2>
    </div>
  );
}

function SummaryPlanCard({ plan }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200">
      <div className="relative">
        <div
          className="h-28 w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(92,201,175,1) 0%, rgba(127,219,173,1) 40%, rgba(216,235,120,1) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="text-xl md:text-2xl font-extrabold tracking-tight text-center">
            {plan?.name || "—"}
          </div>
          <div className="mt-1 text-lg md:text-xl font-bold leading-tight text-center">
            {formatRupiah(plan?.price || 0)}{" "}
            <span className="text-white/80 font-medium text-sm">/ Bulan</span>
          </div>
        </div>
      </div>

      <div className="bg-white px-5 py-5 min-h-[260px]">
        {plan?.benefits?.length ? (
          <ul className="space-y-3 text-[13.5px] md:text-sm text-gray-800">
            {plan.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon className="mt-1.5 h-4 w-4 text-[#22c55e]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm">
            Pilih paket untuk melihat benefit.
          </div>
        )}
      </div>
    </div>
  );
}

function DurasiBlock({ months, onDec, onInc }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <DottedClockIcon className="h-5 w-5 text-[#5CC9AF]" />
        <h2 className="text-sm md:text-base font-semibold">Durasi</h2>
      </div>

      <div className="text-base md:text-lg font-medium text-black">Per Bulan</div>

      <div className="flex items-center gap-2 md:gap-3 text-lg font-semibold">
        <CircleBtn ariaLabel="Kurangi durasi" onClick={onDec}>
          <MinusIcon />
        </CircleBtn>

        <div className="w-6 text-center select-none text-lg md:text-xl">
          {months}
        </div>

        <CircleBtn ariaLabel="Tambah durasi" onClick={onInc}>
          <PlusIcon />
        </CircleBtn>

        <span className="ml-1 md:ml-2 text-base md:text-lg font-semibold">
          Bulan
        </span>
      </div>
    </div>
  );
}

function CircleBtn({ children, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="grid h-7 w-7 md:h-8 md:w-8 place-items-center rounded-full bg-[#5CC9AF] text-white leading-none p-0 transition hover:opacity-90 focus:outline-none focus:ring-0 active:scale-95 flex-shrink-0 aspect-square"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {children}
    </button>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="block">
      <path d="M5 10h10" fill="none" strokeLinecap="round" strokeWidth="2.25" stroke="white" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="block">
      <path d="M10 5v10M5 10h10" fill="none" strokeLinecap="round" strokeWidth="2.25" stroke="white" />
    </svg>
  );
}

function DottedClockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 28 28" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2 4" />
      <path d="M14 7.5v6l4.2 2.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SectionTitleCustom() {
  return (
    <div className="flex items-center gap-2">
      <svg width="22" height="22" viewBox="0 0 22 22" className="text-[#5CC9AF]" aria-hidden>
        <rect x="2" y="6" width="18" height="10" rx="2.5" fill="currentColor" opacity="0.15" />
        <rect x="2" y="6" width="18" height="4" rx="2" fill="currentColor" />
        <circle cx="6.5" cy="13" r="1.2" fill="currentColor" />
        <circle cx="10.5" cy="13" r="1.2" fill="currentColor" />
        <path d="M17 4l1.6 1.6M17 4l-1.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <h2 className="text-sm md:text-base font-semibold">Metode Pembayaran</h2>
    </div>
  );
}

function PlanCard({ plan, onSelect, expanded, onToggleExpand }) {
  const priceText = formatRupiah(plan.price);

  return (
    <div className="w-full bg-white rounded-[26px] overflow-hidden border border-[#E6E6E6] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={onSelect}
        className="w-full bg-[#5CC9AF] text-white h-[104px] flex flex-col items-center justify-center px-4 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="text-[15px] font-semibold leading-tight text-center">
          {plan.name}
        </div>
        <div className="mt-2 text-[16px] font-bold leading-tight text-center">
          {priceText}{" "}
          <span className="text-white/80 font-medium text-[12px]">/ Bulan</span>
        </div>
      </button>

      <Collapsible open={expanded}>
        <ul className="space-y-2 text-[13px] text-gray-800">
          {plan.benefits?.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckIcon className="mt-1 h-4 w-4 text-[#22c55e]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </Collapsible>

      <button
        type="button"
        onClick={onToggleExpand}
        className={classNames(
          "w-full h-12 bg-white flex items-center justify-center rounded-b-[26px]",
          expanded ? "border-t border-gray-200" : "",
          "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        )}
        aria-expanded={expanded}
        aria-label={expanded ? "Sembunyikan benefit" : "Tampilkan benefit"}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <ChevronDownMini
          className={classNames(
            "transition-transform duration-300",
            expanded ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
    </div>
  );
}

function IconCreditCard({ className = "w-14 h-8" }) {
  return (
    <svg viewBox="0 0 56 36" className={className} aria-hidden>
      <rect x="2" y="5" width="52" height="26" rx="6" fill="#5CC9AF" />
      <rect x="6" y="10" width="44" height="4" rx="2" fill="white" />
      <rect x="8" y="18" width="9" height="6" rx="1.3" fill="white" opacity="0.85" />
      <rect x="20" y="20" width="22" height="3" rx="1.5" fill="white" opacity="0.85" />
    </svg>
  );
}
function IconBankTransfer({ className = "w-14 h-8" }) {
  return (
    <svg viewBox="0 0 56 36" className={className} aria-hidden>
      <path d="M8 14h40L28 6 8 14Z" fill="#5CC9AF" />
      <rect x="11" y="14" width="34" height="14" rx="3" fill="#5CC9AF" opacity="0.18" />
      <rect x="13" y="16" width="3.5" height="10" rx="1.2" fill="#5CC9AF" />
      <rect x="19" y="16" width="3.5" height="10" rx="1.2" fill="#5CC9AF" />
      <rect x="25" y="16" width="3.5" height="10" rx="1.2" fill="#5CC9AF" />
      <rect x="31" y="16" width="3.5" height="10" rx="1.2" fill="#5CC9AF" />
      <path d="M37 11h7m0 0-2.3-2.3M44 11l-2.3 2.3" stroke="#5CC9AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconWallet({ className = "w-14 h-8" }) {
  return (
    <svg viewBox="0 0 56 36" className={className} aria-hidden>
      <rect x="7" y="10" width="42" height="18" rx="4.5" fill="#5CC9AF" opacity="0.2" />
      <path d="M9 14a4.5 4.5 0 0 1 4.5-4.5H34a3.5 3.5 0  0 1 3.5 3.5V15H9v-1Z" fill="#5CC9AF" />
      <rect x="35" y="16" width="12" height="9" rx="2.2" fill="#5CC9AF" />
      <circle cx="39" cy="20.5" r="1.7" fill="white" />
    </svg>
  );
}
function IconQris({ className = "w-14 h-8" }) {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/250px-Logo_QRIS.svg.png"
      alt="QRIS logo"
      className={className + " object-contain"}
      loading="lazy"
    />
  );
}

function BankSelector({ banks, selected, onSelect }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-3 md:p-4">
      <div className="space-y-3">
        {banks.map((b) => {
          const active = selected === b.id;
          return (
            <button
              type="button"
              key={b.id}
              onClick={() => onSelect(b.id)}
              className={classNames(
                "w-full flex items-center justify-between rounded-xl border bg-white px-4 md:px-5 py-4 md:py-5 transition",
                active
                  ? "border-[#5CC9AF] ring-1 ring-[#5CC9AF] shadow-sm"
                  : "border-[#E7E7E7] hover:border-[#5CC9AF]",
                "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <BrandLogo sources={b.logos} alt={b.name} />
              </div>
              <RadioVisual active={active} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
function EWalletSelector({ wallets, selected, onSelect }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-3 md:p-4">
      <div className="space-y-3">
        {wallets.map((w) => {
          const active = selected === w.id;
          return (
            <button
              type="button"
              key={w.id}
              onClick={() => onSelect(w.id)}
              className={classNames(
                "w-full flex items-center justify-between rounded-xl border bg-white px-4 md:px-5 py-4 md:py-5 transition",
                active
                  ? "border-[#5CC9AF] ring-1 ring-[#5CC9AF] shadow-sm"
                  : "border-[#E7E7E7] hover:border-[#5CC9AF]",
                "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <BrandLogo sources={w.logos} alt={w.name} />
              </div>
              <RadioVisual active={active} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BrandLogo({ sources = [], alt }) {
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='32'>
        <rect width='100%' height='100%' fill='#F3F4F6'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='#9CA3AF'>${alt}</text>
      </svg>`
    );

  const onError = (e) => {
    const el = e.currentTarget;
    const idx = Number(el.dataset.idx || 0);
    const next = sources[idx + 1];
    if (next) {
      el.dataset.idx = String(idx + 1);
      el.src = next;
    } else {
      el.src = placeholder;
    }
  };

  return (
    <img
      src={sources[0] || placeholder}
      alt={alt}
      data-idx="0"
      onError={onError}
      className="h-8 w-auto max-w-[140px] shrink-0 object-contain"
      loading="lazy"
      decoding="async"
    />
  );
}

function RadioVisual({ active }) {
  return (
    <span
      className={classNames(
        "grid place-items-center h-5 w-5 rounded-full border-2",
        active ? "border-[#5CC9AF]" : "border-gray-300"
      )}
      aria-hidden
    >
      <span
        className={classNames(
          "h-2.5 w-2.5 rounded-full",
          active ? "bg-[#5CC9AF]" : "bg-transparent"
        )}
      />
    </span>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-gray-600">{label}</div>
      <input
        {...props}
        className="w-full h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-[#5CC9AF] focus:ring-2 focus:ring-[#5CC9AF33] placeholder:text-gray-400"
      />
    </label>
  );
}

function PlaceholderInfo({ title, desc }) {
  return (
    <div>
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}

function Row({ label, value, bold = false }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className={bold ? "font-semibold" : ""}>{value}</dd>
    </div>
  );
}

function ChevronDownMini({ className = "" }) {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className}>
      <path d="M3 2.5L9 7.5L15 2.5" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M16 5L8.5 12.5L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ====================== Modal (animated) ====================== */
function PayInstructionModal({ info, onClose, onCheckStatus }) {
  const reduce = useReducedMotion();

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Disalin ke clipboard");
    } catch {
      alert("Gagal menyalin");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative bg-white w-[92vw] max-w-md rounded-2xl shadow-xl border border-black/10 overflow-hidden"
        initial={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-[#5CC9AF] text-white px-5 py-4">
          <div className="text-lg font-bold">Instruksi Pembayaran</div>
          <div className="text-xs opacity-90">Order ID: {info.orderId}</div>
        </div>

        <div className="p-5 space-y-4">
          {info.type === "bank" && (
            <>
              <div className="text-sm text-gray-600">Transfer Bank</div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500 mb-1">Bank</div>
                <div className="font-semibold mb-3">{info.bank}</div>
                <div className="text-xs text-gray-500 mb-1">Virtual Account</div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-base tracking-wide">{info.va}</div>
                  <button
                    onClick={() => copy(info.va)}
                    className="ml-auto text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                    type="button"
                  >
                    Salin
                  </button>
                </div>
                {info.additional?.expire && (
                  <p className="mt-3 text-xs text-gray-500">
                    Bayar sebelum: {new Date(info.additional.expire).toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Selesaikan pembayaran via ATM/Mobile Banking sesuai bank di atas.
              </p>
            </>
          )}

          {info.type === "ewallet" && (
            <>
              <div className="text-sm text-gray-600">
                E–Wallet {info.additional?.provider}
              </div>
              {info.deeplink && (
                <a
                  href={info.deeplink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center h-11 rounded-xl bg-[#5CC9AF] text-white font-semibold hover:opacity-90"
                >
                  Buka Aplikasi
                </a>
              )}
              {info.qrUrl && (
                <div className="text-center">
                  <img
                    src={info.qrUrl}
                    alt="QR E-Wallet"
                    className="mx-auto w-40 h-40 object-contain"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Scan dengan aplikasi e-wallet kamu.
                  </p>
                </div>
              )}
            </>
          )}

          {info.type === "qris" && (
            <>
              <div className="text-sm text-gray-600">QRIS</div>
              {info.qrUrl ? (
                <div className="text-center">
                  <img
                    src={info.qrUrl}
                    alt="QRIS"
                    className="mx-auto w-48 h-48 object-contain"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Scan QRIS di atas untuk membayar.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-500">QR tidak tersedia.</div>
              )}
              {info.qrString && (
                <button
                  onClick={() => copy(info.qrString)}
                  className="mt-3 w-full h-10 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm"
                  type="button"
                >
                  Salin QR String
                </button>
              )}
            </>
          )}

          {info.type === "card" && (
            <>
              <div className="text-sm text-gray-600">Kartu Kredit</div>
              <div className="rounded-xl border border-gray-200 p-4 text-sm">
                {info.additional?.message || "Pembayaran kartu diproses."}
              </div>
              <p className="text-xs text-gray-500">
                Jika sudah menyelesaikan 3DS, status akan dicek otomatis (atau klik Cek Status).
              </p>
            </>
          )}

          <div className="pt-2 grid gap-2">
            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl border border-gray-300 hover:bg-gray-50 font-semibold"
              type="button"
            >
              Tutup
            </button>
            {info?.orderId && (
              <button
                onClick={onCheckStatus}
                className="w-full h-11 rounded-xl bg-[#5CC9AF] text-white font-semibold hover:opacity-90"
                type="button"
              >
                Cek Status Pembayaran
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
