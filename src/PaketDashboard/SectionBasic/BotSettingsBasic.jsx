// src/PaketDashboard/SectionBasic/BotSettingsBasic.jsx
import React, { useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";

const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

const TABS = [
  { key: "basic", label: "Pengaturan Dasar" },
  { key: "reply", label: "Pesan & Balasan" },
  { key: "persona", label: "Personality & Training" },
  { key: "faq", label: "FAQ Management" },
];

export default function BotSettingsBasic() {
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
  const [faqs, setFaqs] = useState([]);

  const handleSave = () => {
    console.log("Save pengaturan bot:", {
      tab,
      basic: { botName, desc, botLang, speed, useEmoji },
      reply: {
        welcomeMessage,
        welcomeTiming,
        defaultReply,
        closingMessage,
      },
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
    // BASIC
    setBotName("");
    setDesc("");
    setBotLang("");
    setSpeed("");
    setUseEmoji(false);

    // REPLY
    setWelcomeMessage("");
    setWelcomeTiming("first");
    setDefaultReply("");
    setClosingMessage("");

    // PERSONA
    setPersonaDescription("");
    setPersonaTone("friendly");
    setPersonaExampleReply("");
    setPersonaRestrictions("");

    // FAQ
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqs([]);
  };

  const handleAddFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    setFaqs((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
      },
    ]);

    setFaqQuestion("");
    setFaqAnswer("");
  };

  return (
    <div
      className="w-full min-h-full font-poppins overflow-x-hidden"
      style={{
        background: `linear-gradient(135deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
      }}
    >
      {/* styles kecil biar mirip figma */}
      <style>{`
        .joyin-tab {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.50);
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            opacity .18s ease;
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

        .joyin-field {
          transition: box-shadow .18s ease, border-color .18s ease, transform .12s ease;
        }
        .joyin-field:focus {
          outline: none;
          border-color: #D6D6D6;
          box-shadow: 0 0 0 2px rgba(92,201,175,0.22);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Top area (mepet kanan-kiri konten dashboard) */}
      <div className="w-full pt-6 md:pt-8 px-4 md:px-6">
        {/* Judul Pengaturan Bot (tengah seperti di gambar) */}
        <div className="mb-6 text-center">
          <h1 className="text-[24px] md:text-[32px] font-semibold text-white tracking-wide">
            Pengaturan Bot
          </h1>
        </div>

        {/* Tabs */}
        <div className="mt-1 flex flex-wrap justify-center gap-6 md:gap-10 relative z-20">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={[
                  "joyin-tab relative inline-flex items-center justify-center",
                  "px-10 md:px-14 py-3.5 rounded-[18px] bg-white",
                  "text-[14px] md:text-[15px] font-semibold",
                  "text-[#28AF87]",
                  active ? "joyin-tab--active" : "opacity-95",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Card putih BESAR (dibuat mepet sidebar: tidak ada mx-auto / maxW) */}
        <div className="relative mt-7">
          {/* card naik sedikit biar tabs berasa “nempel” */}
          <div className="-mt-4 bg-white rounded-[36px] md:rounded-[44px] shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
            {/* padding dalam card */}
            <div className="px-5 py-8 md:px-10 md:py-10">
              {/* ====================== BASIC TAB ====================== */}
              {tab === "basic" && (
                <>
                  {/* Nama Bot */}
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

                  {/* Deskripsi Singkat */}
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

                  {/* Bahasa Bot */}
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

                  {/* Kecepatan Respon */}
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
                      Membuat jeda pengetikan agar respon terasa lebih natural.
                    </p>
                  </div>

                  {/* Gunakan Emoji + toggle mirip foto */}
                  <div className="flex items-center justify-between gap-6">
                    <div className="min-w-0">
                      <h3 className="text-[18px] font-semibold text-gray-900">
                        Gunakan Emoji
                      </h3>
                      <p className="mt-1 text-[13px] text-gray-500">
                        Buat pesan terasa lebih ekspresif dengan tambahan emoji.
                      </p>
                    </div>

                    <EmojiToggle
                      checked={useEmoji}
                      onChange={(v) => setUseEmoji(v)}
                    />
                  </div>
                </>
              )}

              {/* ================= PESAN & BALASAN TAB ================== */}
              {tab === "reply" && (
                <>
                  {/* Pesan Sambutan */}
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

                  {/* Waktu Kirim Pesan Sambutan */}
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

                  {/* Balasan Default */}
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

                  {/* Pesan Penutup Chat */}
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
                  {/* Personality Bot */}
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
                      Jelaskan karakter, gaya bicara, cara menyapa, dan peran
                      utama bot.
                    </p>
                  </div>

                  {/* Gaya Komunikasi */}
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

                  {/* Contoh Balasan Ideal */}
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
                      Berikan 1–2 contoh balasan yang mewakili gaya bahasa bot.
                    </p>
                  </div>

                  {/* Hal yang Tidak Boleh Dijawab */}
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
                  {/* KARTU: Tambah FAQ Baru */}
                  <div className="mb-10">
                    <div className="w-full rounded-[32px] md:rounded-[36px] bg-white shadow-[0_26px_60px_rgba(0,0,0,0.12)] border border-[#F3F3F3] px-6 md:px-10 py-7 md:py-9">
                      <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-900">
                        Tambah FAQ Baru
                      </h2>

                      {/* Pertanyaan */}
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

                      {/* Jawaban */}
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

                      {/* Tombol Tambah FAQ */}
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="w-full h-[50px] md:h-[54px] rounded-[12px] bg-[#5FCAAC] text-white text-[14px] md:text-[15px] font-semibold shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,0,0,0.22)] active:translate-y-0"
                        >
                          Tambah FAQ
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DAFTAR FAQ */}
                  <div className="mt-4">
                    <h3 className="text-[18px] font-semibold text-gray-900 mb-4">
                      Daftar FAQ
                    </h3>

                    <div className="w-full rounded-[22px] border border-[#D6D6D6] bg-white min-h-[120px] px-5 py-4">
                      {faqs.length === 0 ? (
                        <p className="text-[13px] text-gray-400">
                          Belum ada FAQ. Tambahkan pertanyaan baru di atas.
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {faqs.map((item) => (
                            <li key={item.id}>
                              <p className="text-[14px] font-semibold text-gray-900">
                                {item.question}
                              </p>
                              <p className="mt-1 text-[13px] text-gray-600">
                                {item.answer}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ======= TOMBOL SIMPAN & RESET (SEMUA TAB) =============== */}
              <div className="mt-10 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                {/* Simpan Pengaturan - full width hijau */}
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 h-[52px] md:h-[56px] rounded-[12px] bg-[#5FCAAC] text-white text-[14px] md:text-[15px] font-semibold shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out transform hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,0,0,0.2)] active:translate-y-0"
                >
                  Simpan Pengaturan
                </button>

                {/* Reset - outlined putih dengan icon */}
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
          </div>
        </div>

        {/* spacer bawah biar lega */}
        <div className="h-10" />
      </div>
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
      {/* Track */}
      <span
        className="absolute inset-0 rounded-full transition-colors duration-150 ease-out"
        style={{
          backgroundColor: checked ? "#5FCAAC" : "#E3E3E3",
        }}
      />

      {/* Knob bulat */}
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
      {/* lingkaran radio */}
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

      {/* teks */}
      <span>
        <p className="text-[15px] font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-[13px] text-gray-500">{description}</p>
      </span>
    </button>
  );
}
