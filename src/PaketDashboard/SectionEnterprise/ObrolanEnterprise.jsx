import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

/**
 * ✅ SETTING CONTAINER PUTIH (biar gampang kamu atur)
 * - sidePad: jarak kiri/kanan (semakin kecil = makin lebar)
 * - topPad : jarak dari judul ke container putih
 * - radiusTop: lengkungan bagian atas
 */
const WHITE_CONTAINER_CFG = {
  sidePad: 10,
  topPad: 24,
  radiusTop: 44,
};

function Avatar({ src, alt = "avatar", size = 46 }) {
  if (!src) {
    return (
      <div
        className="grid place-items-center rounded-full bg-gray-200 text-gray-500"
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <svg
          width={Math.floor(size * 0.55)}
          height={Math.floor(size * 0.55)}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-4.42 0-8 2-8 4.5V21h16v-2.5c0-2.5-3.58-4.5-8-4.5"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}

function formatTime(t) {
  return t;
}

function getNowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}.${mm}`;
}

export default function ObrolanEnterprise() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1];

  const page = {
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

  const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.55, ease: EASE },
    },
  };

  const panelIn = {
    hidden: { opacity: 0, y: 20, scale: 0.995, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.65, ease: EASE },
    },
  };

  const convItem = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.35,
        ease: "easeOut",
        delay: reduceMotion ? 0 : 0.06 + i * 0.04,
      },
    }),
  };

  const switchConv = {
    hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.26, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: "blur(6px)",
      transition: { duration: reduceMotion ? 0 : 0.16, ease: "easeIn" },
    },
  };

  const msg = {
    hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.22, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -6,
      filter: "blur(6px)",
      transition: { duration: reduceMotion ? 0 : 0.14, ease: "easeIn" },
    },
  };

  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("c1");
  const [draft, setDraft] = useState("");

  const conversations = useMemo(
    () => [
      {
        id: "c1",
        name: "Ahmad Afif",
        preview: "Apakah ada promo bulan ini?",
        online: true,
        avatar: "",
      },
      {
        id: "c2",
        name: "Achmad Akbar",
        preview: "Apakah ada promo bulan ini?",
        online: false,
        avatar: "",
      },
    ],
    []
  );

  const [threads, setThreads] = useState(() => ({
    c1: [
      {
        id: "m1",
        role: "customer",
        text: "Halo, saya butuh bantuan dengan\nproduk yang saya beli",
        time: "10.50",
      },
      {
        id: "m2",
        role: "agent",
        time: "10.51",
        text:
          "Hai! 👋 Selamat datang di YayaStore. Tentu,\n" +
          "saya akan bantu. Bisa beri tahu jenis\n" +
          "bantuan yang Anda butuhkan?\n" +
          "1. Produk rusak / tidak berfungsi ⚠️\n" +
          "2. Salah produk / tidak sesuai pesanan 📦\n" +
          "3. Tanya garansi atau retur ♻️\n" +
          "4. Lainnya ✍️",
      },
      { id: "m3", role: "customer", text: "1", time: "10.55" },
    ],
    c2: [],
  }));

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) || conversations[0],
    [conversations, activeId]
  );

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.preview || "").toLowerCase().includes(q)
    );
  }, [conversations, search]);

  const messages = threads[activeId] || [];
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [activeId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;

    setThreads((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        { id: `a_${Date.now()}`, role: "agent", text, time: getNowTime() },
      ],
    }));

    setDraft("");
  };

  const sidePad = WHITE_CONTAINER_CFG.sidePad;
  const topPad = WHITE_CONTAINER_CFG.topPad;
  const radiusTop = WHITE_CONTAINER_CFG.radiusTop;

  return (
    <motion.div
      className="w-full min-h-screen h-full overflow-hidden font-poppins flex flex-col"
      style={{
        background: `linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
      }}
      variants={page}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="relative w-full px-6 pt-6 shrink-0">
        <h1 className="text-center text-white font-semibold text-[44px] leading-none tracking-wide">
          {t("obrolanEnterprise.title")}
        </h1>
      </motion.div>

      <div
        className="w-full flex-1 min-h-0 pb-0"
        style={{
          paddingLeft: sidePad,
          paddingRight: sidePad,
          paddingTop: topPad,
        }}
      >
        <motion.div
          variants={panelIn}
          className="w-full h-full bg-white overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
          style={{
            borderTopLeftRadius: radiusTop,
            borderTopRightRadius: radiusTop,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <div className="w-full h-full flex">
            <aside className="w-[360px] shrink-0 border-r border-gray-200">
              <div className="p-6">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder=""
                    className="w-full h-[44px] rounded-full border border-gray-200 px-5 pr-12 text-[14px] text-gray-900 outline-none focus:border-gray-300"
                  />
                  <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="px-4 pb-6 space-y-3">
                {filteredConversations.map((c, idx) => {
                  const active = c.id === activeId;
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={[
                        "w-full flex items-center gap-4 text-left",
                        "px-4 py-4 rounded-2xl",
                        active ? "bg-[#D8FBEF]" : "bg-white",
                        active ? "" : "hover:bg-gray-50",
                        "transition-colors",
                      ].join(" ")}
                      variants={convItem}
                      custom={idx}
                      initial="hidden"
                      animate="show"
                    >
                      <Avatar src={c.avatar} alt={c.name} size={46} />
                      <div className="min-w-0">
                        <p className="text-[16px] font-semibold text-gray-900 leading-tight">
                          {c.name}
                        </p>
                        <p className="mt-1 text-[12px] text-gray-400 truncate max-w-[230px]">
                          {c.preview}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </aside>

            <section className="flex-1 min-w-0 flex flex-col">
              <div className="h-[82px] px-8 flex items-center gap-4 border-b border-gray-200">
                <div className="relative">
                  <Avatar src={activeConv.avatar} alt={activeConv.name} size={50} />
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeId}
                    variants={switchConv}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="leading-tight"
                  >
                    <p className="text-[20px] font-semibold text-gray-900">
                      {activeConv.name}
                    </p>
                    <p className="text-[12px] text-gray-400">
                      {activeConv.online ? t("obrolanEnterprise.online") : t("obrolanEnterprise.offline")}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-10 py-8">
                <div className="h-6" />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`thread_${activeId}`}
                    variants={switchConv}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <AnimatePresence initial={false}>
                      {messages.map((m) => {
                        const isCustomer = m.role === "customer";
                        return (
                          <motion.div
                            key={m.id}
                            variants={msg}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            layout
                            className="mb-10"
                          >
                            {isCustomer ? (
                              <div className="flex items-end gap-4">
                                <Avatar src={activeConv.avatar} alt={activeConv.name} size={44} />
                                <div>
                                  <div className="bg-white rounded-xl px-8 py-6 shadow-[0_6px_14px_rgba(0,0,0,0.12)] border border-gray-100 max-w-[540px]">
                                    <p className="text-[22px] leading-snug text-gray-900 whitespace-pre-line">
                                      {m.text}
                                    </p>
                                  </div>
                                  <p className="mt-1 ml-2 text-[12px] text-gray-400">
                                    {formatTime(m.time)}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="ml-auto max-w-[650px]">
                                <div className="bg-[#CFFBE9] rounded-xl px-10 py-8 shadow-[0_6px_14px_rgba(0,0,0,0.12)] border border-[#BFF2DE]">
                                  <p className="text-[20px] leading-relaxed text-gray-900 whitespace-pre-line">
                                    {m.text}
                                  </p>
                                </div>
                                <p className="mt-2 text-right text-[12px] text-gray-400">
                                  {formatTime(m.time)}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>

                <div className="h-8" />
              </div>

              <div className="px-10 pb-10">
                <div className="flex items-center">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send();
                    }}
                    className="w-full h-[56px] rounded-full border border-gray-200 px-6 text-[14px] outline-none focus:border-gray-300"
                    placeholder=""
                  />
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
