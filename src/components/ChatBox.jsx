import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { HiPaperAirplane, HiXMark, HiChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";
import { JOYIN_CONTEXT } from "../data/websiteContext"; // ✅ Context Import

export default function ChatBox() {
    const location = useLocation();
    const { ready } = useAuth();

    // Config: Hidden Routes
    const hiddenRoutes = [
        "/login", "/register", "/signup", "/verify-otp",
        "/forgot-password", "/reset-password",
        "/checkout", "/bukti-pembayaran"
    ];
    const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

    // State
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    if (isHidden || !ready) return null;

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        const newMsg = { sender: "user", text: userText };

        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setLoading(true);

        try {
            // ✅ Inject Context + Instruction invisibly
            const finalPrompt = `
${JOYIN_CONTEXT}

User bertanya: "${userText}"
(Jawablah dalam Bahasa Indonesia yang ramah dan membantu, singkat padat jelas).
            `.trim();

            const res = await api.post("/ai", { message: finalPrompt });
            const data = res.data;

            // Parsing Logic
            // Parsing Logic Robust
            const choice = data.choices?.[0]?.message || data.data?.choices?.[0]?.message;
            let raw = choice?.content;

            // Jika content kosong, cek reasoning (model Chutes/Chimera kadang taruh di sini)
            if (!raw && choice?.reasoning) {
                raw = choice.reasoning;
            }

            // Fallback lain
            if (!raw) {
                raw = data.reply || (typeof data.data === 'string' ? data.data : "") || data.message || "";
            }

            if (typeof raw === 'object') raw = JSON.stringify(raw);

            // Cleaning <think> tags if any
            const clean = String(raw || "Maaf, saya tidak mengerti.")
                .replace(/<think>[\s\S]*?<\/think>/gi, "")
                .trim();

            setMessages(prev => [...prev, { sender: "ai", text: clean }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                sender: "ai",
                text: "Maaf, ada gangguan koneksi. Coba lagi nanti.",
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-poppins flex flex-col items-end gap-5">

            {/* CHAT WINDOW */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                        className="w-[360px] md:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden relative"
                    >
                        {/* HEADER - Glassmorphism vibes */}
                        <div className="absolute top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md z-20 flex items-center justify-between px-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                    <HiSparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-[15px]">Joyin Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-gray-400 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex items-center justify-center transition-all"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>

                        {/* MESSAGES */}
                        <div className="flex-1 overflow-y-auto pt-24 pb-4 px-5 space-y-6 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 select-none">
                                    <HiChatBubbleLeftRight className="w-16 h-16 text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-400 font-medium">Tanya apa saja tentang Joyin!</p>
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] px-5 py-3.5 text-[14px] leading-relaxed shadow-sm
                                        ${m.sender === 'user'
                                            ? 'bg-gray-900 text-white rounded-[20px] rounded-br-[4px]'
                                            : m.isError
                                                ? 'bg-red-50 text-red-600 border border-red-100 rounded-[20px] rounded-bl-[4px]'
                                                : 'bg-white text-gray-700 border border-gray-100 rounded-[20px] rounded-bl-[4px]'
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-3 rounded-[20px] rounded-bl-[4px] shadow-sm border border-gray-100 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* FOOTER INPUT */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form
                                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-2 border border-transparent focus-within:border-emerald-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50 transition-all duration-300"
                            >
                                <input
                                    className="flex-1 bg-transparent px-4 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                                    placeholder="Ketik pesan..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform active:scale-90"
                                >
                                    <HiPaperAirplane className="-ml-0.5 mt-0.5 w-4 h-4 rotate-90" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FLOAT BUTTON */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.90 }}
                className="w-16 h-16 rounded-full bg-gray-900 text-white shadow-2xl hover:shadow-gray-400/50 flex items-center justify-center transition-all z-50 group hover:bg-emerald-600"
            >
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <HiXMark className="w-8 h-8" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <HiChatBubbleLeftRight className="w-8 h-8" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notification Dot */}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-gray-900 rounded-full animate-bounce group-hover:border-emerald-600 transition-colors" />
                    )}
                </div>
            </motion.button>

        </div>
    );
}
