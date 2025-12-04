// src/PaketDashboard/SectionPro/BotSettingsPro.jsx
import React, { useMemo, useState } from "react";
import {
  HiOutlineArrowPath,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

const TABS = [
  { key: "basic", label: "Pengaturan Dasar" },
  { key: "reply", label: "Pesan & Balasan" },
  { key: "persona", label: "Personality & Training" },
  { key: "faq", label: "FAQ Management" },
];

/**
 * ✅ SETTING LEBAR CONTAINER PUTIH (BENAR-BENAR NGARUH)
 * Ini pakai "bleed ke viewport" (100vw), jadi walaupun komponen ini
 * dibungkus parent yang max-width, container putih tetap bisa melebar.
 *
 * - whitePadL/R: jarak sisi kiri/kanan terhadap viewport (semakin kecil => makin lebar)
 * - whiteMaxW: batas max width (99999 biar hampir full)
 * - whiteTopGap: jarak dari tabs ke container putih
 */
const LAYOUT_CFG = {
  pageSidePadMobile: 16,
  pageSidePadDesktop: 24,

  whitePadLMobile: 10,
  whitePadRMobile: 10,

  whitePadLDesktop: 135,
  whitePadRDesktop: 135,

  whiteMaxW: 9999, // px
  whiteTopGap: 50, // px
};

export default function BotSettingsPro() {
  const reduceMotion = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1];

  // ====== ANIMATION (masuk halaman) ==========================================
  const pageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.22,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };

  const riseSoft = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.55, ease: EASE },
    },
  };

  // ✅ IMPORTANT: animasi dipasang ke panel putih (bukan .joyin-whiteBleed)
  // agar transform translateX milik .joyin-whiteBleed tidak ketimpa.
  const whitePanel = {
    hidden: { opacity: 0, y: 22, scale: 0.992, filter: "blur(7px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.65, ease: EASE },
    },
  };

  const tabContent = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.28, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: "blur(6px)",
      transition: { duration: reduceMotion ? 0 : 0.18, ease: "easeIn" },
    },
  };

  // ====== STATE ===============================================================
  const [tab, setTab] = useState("basic");
  const [useEmoji, setUseEmoji] = useState(false);

  // ====== STATE: BASIC TAB ====================================================
  const [botName, setBotName] = useState("");
  const [desc, setDesc] = useState("");
  const [botLang, setBotLang] = useState("");
  const [speed, setSpeed] = useState("");

  // ====== STATE: PESAN & BALASAN TAB =========================================
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeTiming, setWelcomeTiming] = useState("first"); // "first" | "every"
  const [defaultReply, setDefaultReply] = useState("");
  const [closingMessage, setClosingMessage] = useState("");

  // ====== STATE: PERSONALITY & TRAINING TAB ==================================
  const [personaDescription, setPersonaDescription] = useState("");
  const [personaTone, setPersonaTone] = useState("friendly"); // "friendly" | "formal"
  const [personaExampleReply, setPersonaExampleReply] = useState("");
  const [personaRestrictions, setPersonaRestrictions] = useState("");

  // ====== STATE: FAQ MANAGEMENT TAB ==========================================
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqs, setFaqs] = useState([]); // {id, question, answer, active}
  const [editingFaqId, setEditingFaqId] = useState(null);

  const activeCount = useMemo(
    () => faqs.filter((f) => !!f.active).length,
    [faqs]
  );
  const inactiveCount = useMemo(
    () => faqs.length - activeCount,
    [faqs, activeCount]
  );

  const handleSave = () => {
    console.log("Save pengaturan bot:", {
      tab,
      basic: { botName, desc, botLang, speed, useEmoji },
      reply: { welcomeMessage, welcomeTiming, defaultReply, closingMessage },
      persona: {
        personaDescription,
        personaTone,
        personaExampleReply,
        personaRestrictions,
      },
      faq: faqs,
    });
  };

  const handleReset = () => {
    setBotName("");
    setDesc("");
    setBotLang("");
    setSpeed("");
    setUseEmoji(false);

    setWelcomeMessage("");
    setWelcomeTiming("first");
    setDefaultReply("");
    setClosingMessage("");

    setPersonaDescription("");
    setPersonaTone("friendly");
    setPersonaExampleReply("");
    setPersonaRestrictions("");

    setFaqQuestion("");
    setFaqAnswer("");
    setFaqs([]);
    setEditingFaqId(null);
  };

  const handleAddOrUpdateFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const q = faqQuestion.trim();
    const a = faqAnswer.trim();

    if (editingFaqId) {
      setFaqs((prev) =>
        prev.map((it) =>
          it.id === editingFaqId ? { ...it, question: q, answer: a } : it
        )
      );
      setEditingFaqId(null);
    } else {
      setFaqs((prev) => [
        ...prev,
        { id: Date.now(), question: q, answer: a, active: true },
      ]);
    }

    setFaqQuestion("");
    setFaqAnswer("");
  };

  const handleEditFaq = (item) => {
    setEditingFaqId(item.id);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
  };

  const handleDeleteFaq = (id) => {
    setFaqs((prev) => prev.filter((it) => it.id !== id));
    if (editingFaqId === id) {
      setEditingFaqId(null);
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };

  const handleToggleFaqStatus = (id) => {
    setFaqs((prev) =>
      prev.map((it) => (it.id === id ? { ...it, active: !it.active } : it))
    );
  };

  return (
    <div
      className="w-full min-h-screen font-poppins overflow-x-hidden"
      style={{
        background: `linear-gradient(135deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
        // CSS vars (mobile default)
        "--pagePad": `${LAYOUT_CFG.pageSidePadMobile}px`,
        "--whitePadL": `${LAYOUT_CFG.whitePadLMobile}px`,
        "--whitePadR": `${LAYOUT_CFG.whitePadRMobile}px`,
        "--whiteMaxW": `${LAYOUT_CFG.whiteMaxW}px`,
        "--whiteTopGap": `${LAYOUT_CFG.whiteTopGap}px`,
      }}
    >
      <style>{`
        /* ===== Tabs ===== */
        .joyin-tab {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.50);
          transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
        }
        .joyin-tab--active {
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.95),
            0 0 32px rgba(255,255,255,0.90);
          transform: translateY(-3px);
        }
        .joyin-tab:hover {
          transform: translateY(-3px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.95),
            0 0 26px rgba(255,255,255,0.85);
        }

        /* ===== Inputs ===== */
        .joyin-field {
          transition: box-shadow .18s ease, border-color .18s ease, transform .12s ease;
        }
        .joyin-field:focus {
          outline: none;
          border-color: #D6D6D6;
          box-shadow: 0 0 0 2px rgba(92,201,175,0.22);
          transform: translateY(-1px);
        }

        /* ===== Header padding (judul + tabs) ===== */
        .joyin-pagePad {
          padding-left: var(--pagePad);
          padding-right: var(--pagePad);
        }

        /* ✅ Bleed container putih ke viewport */
        .joyin-whiteBleed {
          position: relative;
          left: 50%;
          width: min(var(--whiteMaxW), calc(100vw - var(--whitePadL) - var(--whitePadR)));
          transform: translateX(calc(-50% + ((var(--whitePadL) - var(--whitePadR)) / 2)));
          margin-top: var(--whiteTopGap);
        }

        /* Desktop override vars */
        @media (min-width: 768px) {
          .joyin-pagePad { padding-left: ${LAYOUT_CFG.pageSidePadDesktop}px; padding-right: ${LAYOUT_CFG.pageSidePadDesktop}px; }
          .joyin-whiteBleed {
            width: min(${LAYOUT_CFG.whiteMaxW}px, calc(100vw - ${LAYOUT_CFG.whitePadLDesktop}px - ${LAYOUT_CFG.whitePadRDesktop}px));
            transform: translateX(calc(-50% + ((${LAYOUT_CFG.whitePadLDesktop}px - ${LAYOUT_CFG.whitePadRDesktop}px) / 2)));
            margin-top: ${LAYOUT_CFG.whiteTopGap}px;
          }
        }
      `}</style>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="w-full min-h-screen flex flex-col pt-6 md:pt-8"
      >
        {/* Header */}
        <motion.div variants={riseSoft} className="joyin-pagePad">
          <div className="mb-6 text-center">
            <h1 className="text-[24px] md:text-[32px] font-semibold text-white tracking-wide">
              Pengaturan Bot
            </h1>
          </div>

          <div className="mt-1 flex flex-wrap justify-center gap-6 md:gap-10 relative z-20">
            {TABS.map((tItem) => {
              const active = tItem.key === tab;
              return (
                <button
                  key={tItem.key}
                  type="button"
                  onClick={() => setTab(tItem.key)}
                  className={[
                    "joyin-tab inline-flex items-center justify-center",
                    "px-10 md:px-14 py-3.5 rounded-[18px] bg-white",
                    "text-[14px] md:text-[15px] font-semibold text-[#28AF87]",
                    active ? "joyin-tab--active" : "opacity-95",
                  ].join(" ")}
                >
                  {tItem.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Body */}
        <div className="relative flex-1 flex flex-col">
          <div className="joyin-whiteBleed flex-1 flex flex-col">
            <motion.div
              variants={whitePanel}
              className="-mt-4 bg-white rounded-t-[36px] md:rounded-t-[44px] rounded-b-none shadow-[0_24px_60px_rgba(0,0,0,0.10)] flex-1 flex flex-col"
            >
              <div className="px-5 py-8 md:px-10 md:py-10 flex-1 flex flex-col">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab}
                    variants={tabContent}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="flex flex-col"
                  >
                    {/* ====================== BASIC TAB ====================== */}
                    {tab === "basic" && (
                      <>
                        <div className="mb-8">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Nama Bot
                          </label>
                          <input
                            value={botName}
                            onChange={(e) => setBotName(e.target.value)}
                            type="text"
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900"
                          />
                          <p className="mt-2 text-[13px] text-gray-500">
                            Nama panggilan yang muncul ketika bot membalas
                          </p>
                        </div>

                        <div className="mb-8">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Deskripsi Singkat
                          </label>
                          <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={4}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                          <p className="mt-2 text-[13px] text-gray-500">
                            Ditampilkan di halaman informasi bot
                          </p>
                        </div>

                        <div className="mb-8">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Bahasa Bot
                          </label>
                          <input
                            value={botLang}
                            onChange={(e) => setBotLang(e.target.value)}
                            type="text"
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900"
                          />
                        </div>

                        <div className="mb-10">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Kecepatan Respon
                          </label>
                          <input
                            value={speed}
                            onChange={(e) => setSpeed(e.target.value)}
                            type="text"
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900"
                          />
                          <p className="mt-2 text-[13px] text-gray-500">
                            Membuat jeda pengetikan agar respon terasa lebih
                            natural.
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                          <div className="min-w-0">
                            <h3 className="text-[18px] font-semibold text-gray-900">
                              Gunakan Emoji
                            </h3>
                            <p className="mt-1 text-[13px] text-gray-500">
                              Buat pesan terasa lebih ekspresif dengan tambahan
                              emoji.
                            </p>
                          </div>

                          <EmojiToggle checked={useEmoji} onChange={setUseEmoji} />
                        </div>
                      </>
                    )}

                    {/* ================= PESAN & BALASAN TAB ================== */}
                    {tab === "reply" && (
                      <>
                        <div className="mb-10">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Pesan Sambutan
                          </label>
                          <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            rows={3}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                        </div>

                        <div className="mb-10">
                          <p className="text-[18px] font-semibold text-gray-900">
                            Waktu Kirim Pesan Sambutan
                          </p>

                          <div className="mt-4 space-y-4">
                            <RadioOption
                              checked={welcomeTiming === "first"}
                              title="Hanya pada chat pertama"
                              description="Pesan sambutan dikirim sekali saat customer pertama kali chat"
                              onClick={() => setWelcomeTiming("first")}
                            />
                            <RadioOption
                              checked={welcomeTiming === "every"}
                              title="Setiap chat baru"
                              description="Pesan sambutan dikirim setiap kali memulai percakapan baru"
                              onClick={() => setWelcomeTiming("every")}
                            />
                          </div>
                        </div>

                        <div className="mb-10">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Balasan Default (Ketika Bot Tidak Paham)
                          </label>
                          <textarea
                            value={defaultReply}
                            onChange={(e) => setDefaultReply(e.target.value)}
                            rows={3}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Pesan Penutup Chat
                          </label>
                          <textarea
                            value={closingMessage}
                            onChange={(e) => setClosingMessage(e.target.value)}
                            rows={3}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                        </div>
                      </>
                    )}

                    {/* ============ PERSONALITY & TRAINING TAB ================= */}
                    {tab === "persona" && (
                      <>
                        <div className="mb-10">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Personality Bot
                          </label>
                          <textarea
                            value={personaDescription}
                            onChange={(e) => setPersonaDescription(e.target.value)}
                            rows={3}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                          <p className="mt-2 text-[13px] text-gray-500">
                            Jelaskan karakter, gaya bicara, cara menyapa, dan
                            peran utama bot.
                          </p>
                        </div>

                        <div className="mb-10">
                          <p className="text-[18px] font-semibold text-gray-900">
                            Gaya Komunikasi
                          </p>

                          <div className="mt-4 space-y-4">
                            <RadioOption
                              checked={personaTone === "friendly"}
                              title="Ramah & Santai"
                              description="Gunakan bahasa sehari-hari, nada hangat, dan boleh memakai emoji seperlunya."
                              onClick={() => setPersonaTone("friendly")}
                            />
                            <RadioOption
                              checked={personaTone === "formal"}
                              title="Formal & Profesional"
                              description="Gunakan bahasa baku & profesional, cocok untuk konteks bisnis dan perusahaan."
                              onClick={() => setPersonaTone("formal")}
                            />
                          </div>
                        </div>

                        <div className="mb-10">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Contoh Balasan Ideal
                          </label>
                          <textarea
                            value={personaExampleReply}
                            onChange={(e) => setPersonaExampleReply(e.target.value)}
                            rows={3}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                          <p className="mt-2 text-[13px] text-gray-500">
                            Berikan 1–2 contoh balasan yang mewakili gaya bahasa
                            bot.
                          </p>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[18px] font-semibold text-gray-900">
                            Hal yang Tidak Boleh Dijawab / Disampaikan
                          </label>
                          <textarea
                            value={personaRestrictions}
                            onChange={(e) => setPersonaRestrictions(e.target.value)}
                            rows={3}
                            className="joyin-field mt-3 w-full rounded-[12px] border border-[#D6D6D6] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                          />
                          <p className="mt-2 text-[13px] text-gray-500">
                            Tuliskan topik yang harus dihindari bot (misalnya:
                            politik, SARA, dsb).
                          </p>
                        </div>
                      </>
                    )}

                    {/* =================== FAQ MANAGEMENT TAB ================== */}
                    {tab === "faq" && (
                      <>
                        <div className="mb-10">
                          <div className="w-full rounded-[32px] md:rounded-[36px] bg-white shadow-[0_26px_60px_rgba(0,0,0,0.12)] border border-[#F3F3F3] px-6 md:px-10 py-7 md:py-9">
                            <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-900">
                              {editingFaqId ? "Edit FAQ" : "Tambah FAQ Baru"}
                            </h2>

                            <div className="mt-6">
                              <label className="block text-[14px] md:text-[15px] font-semibold text-gray-900">
                                Pertanyaan
                              </label>
                              <input
                                type="text"
                                value={faqQuestion}
                                onChange={(e) => setFaqQuestion(e.target.value)}
                                className="joyin-field mt-3 w-full rounded-[12px] border border-[#E1E1E1] bg-white px-4 py-3.5 text-[14px] text-gray-900"
                              />
                            </div>

                            <div className="mt-6">
                              <label className="block text-[14px] md:text-[15px] font-semibold text-gray-900">
                                Jawaban
                              </label>
                              <textarea
                                rows={3}
                                value={faqAnswer}
                                onChange={(e) => setFaqAnswer(e.target.value)}
                                className="joyin-field mt-3 w-full rounded-[12px] border border-[#E1E1E1] bg-white px-4 py-3.5 text-[14px] text-gray-900 resize-none"
                              />
                            </div>

                            <div className="mt-8">
                              <button
                                type="button"
                                onClick={handleAddOrUpdateFaq}
                                className="w-full h-[50px] md:h-[54px] rounded-[12px] bg-[#5FCAAC] text-white text-[14px] md:text-[15px] font-semibold shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,0,0,0.22)] active:translate-y-0"
                              >
                                {editingFaqId ? "Simpan Perubahan" : "Tambah FAQ"}
                              </button>

                              {editingFaqId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingFaqId(null);
                                    setFaqQuestion("");
                                    setFaqAnswer("");
                                  }}
                                  className="mt-3 w-full h-[46px] rounded-[12px] border border-[#E5E7EB] bg-white text-gray-700 text-[14px] font-semibold hover:bg-gray-50"
                                >
                                  Batal
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center justify-between gap-4 mb-5">
                            <h3 className="text-[20px] md:text-[22px] font-semibold text-gray-900">
                              Daftar FAQ
                            </h3>

                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full bg-green-100 text-green-700 text-[13px] font-semibold">
                                Aktif : {activeCount}
                              </span>
                              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full bg-gray-100 text-gray-700 text-[13px] font-semibold">
                                Nonaktif : {inactiveCount}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-7 md:space-y-8">
                            {faqs.length === 0 ? (
                              <div className="w-full rounded-[24px] border border-[#E5E7EB] bg-white px-6 md:px-10 py-8">
                                <p className="text-[14px] text-gray-400">
                                  Belum ada FAQ. Tambahkan pertanyaan baru di
                                  atas.
                                </p>
                              </div>
                            ) : (
                              faqs.map((item) => (
                                <div
                                  key={item.id}
                                  className="w-full rounded-[26px] md:rounded-[30px] border border-[#E5E7EB] bg-white px-6 md:px-10 py-6 md:py-7 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleToggleFaqStatus(item.id)
                                      }
                                      className={[
                                        "inline-flex items-center justify-center px-6 h-9 rounded-full text-[13px] font-semibold",
                                        item.active
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-700",
                                      ].join(" ")}
                                      title="Klik untuk ubah status"
                                    >
                                      {item.active ? "Aktif" : "Nonaktif"}
                                    </button>

                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => handleEditFaq(item)}
                                        className="w-11 h-11 rounded-[10px] bg-indigo-100 text-indigo-600 inline-flex items-center justify-center shadow-[0_10px_22px_rgba(0,0,0,0.06)] hover:brightness-[0.98] active:brightness-95"
                                        aria-label="Edit FAQ"
                                      >
                                        <HiOutlinePencilSquare className="w-5 h-5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteFaq(item.id)
                                        }
                                        className="w-11 h-11 rounded-[10px] bg-red-100 text-red-500 inline-flex items-center justify-center shadow-[0_10px_22px_rgba(0,0,0,0.06)] hover:brightness-[0.98] active:brightness-95"
                                        aria-label="Hapus FAQ"
                                      >
                                        <HiOutlineTrash className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mt-5 space-y-4">
                                    <div className="flex gap-3">
                                      <span className="w-8 shrink-0 text-[16px] md:text-[18px] font-bold text-gray-900">
                                        Q :
                                      </span>
                                      <p className="text-[16px] md:text-[18px] font-semibold text-gray-900 leading-relaxed">
                                        {item.question}
                                      </p>
                                    </div>

                                    <div className="flex gap-3">
                                      <span className="w-8 shrink-0 text-[15px] md:text-[16px] font-bold text-gray-900">
                                        A :
                                      </span>
                                      <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed">
                                        {item.answer}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Buttons */}
                <div className="mt-auto pt-10 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 h-[52px] md:h-[56px] rounded-[12px] bg-[#5FCAAC] text-white text-[14px] md:text-[15px] font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,0,0,0.2)] active:translate-y-0"
                  >
                    Simpan Pengaturan
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-6 h-[52px] md:h-[56px] rounded-[12px] border border-[#E4E4E4] bg-white text-[#28AF87] text-[14px] md:text-[15px] font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.04)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] active:translate-y-0"
                  >
                    <HiOutlineArrowPath className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* Toggle mirip foto: track abu + knob bulat, saat ON jadi hijau */
function EmojiToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="relative shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5FCAAC]"
      style={{ width: 60, height: 32 }}
    >
      <span
        className="absolute inset-0 rounded-full transition-colors duration-150 ease-out"
        style={{ backgroundColor: checked ? "#5FCAAC" : "#E3E3E3" }}
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-150 ease-out"
        style={{
          width: 28,
          height: 28,
          left: checked ? 30 : 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}

/* Komponen opsi radio custom (dipakai di Reply & Persona) */
function RadioOption({ checked, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 text-left"
    >
      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center">
        <span
          className="h-5 w-5 rounded-full border"
          style={{
            borderColor: checked ? "#5FCAAC" : "#CFCFCF",
            backgroundColor: checked ? "rgba(95,202,172,0.12)" : "#FFFFFF",
          }}
        >
          {checked && (
            <span className="block m-[3px] h-3 w-3 rounded-full bg-[#5FCAAC]" />
          )}
        </span>
      </span>

      <span>
        <p className="text-[15px] font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-[13px] text-gray-500">{description}</p>
      </span>
    </button>
  );
}
