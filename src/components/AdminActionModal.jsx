import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ✅ THEME STYLES
const GRADIENT_APPROVE_FROM = "#5FCAAC";
const GRADIENT_APPROVE_TO = "#DAEC75";

const GRADIENT_REJECT_FROM = "#EF4444";
const GRADIENT_REJECT_TO = "#F87171";

export default function AdminActionModal({ isOpen, type, data, onClose, onConfirm }) {
    const reduce = useReducedMotion();
    const [reason, setReason] = useState("");

    // Reset reason when opening
    React.useEffect(() => {
        if (isOpen) setReason("");
    }, [isOpen]);

    if (!isOpen || !type) return null;

    const isApprove = type === 'APPROVE';
    const title = isApprove ? "Setujui Pesanan?" : "Tolak Pesanan?";
    const description = isApprove
        ? "Tindakan ini akan mengaktifkan paket pengguna secara otomatis."
        : "Mohon berikan alasan penolakan agar pengguna tahu.";

    const gradientStyle = {
        background: `linear-gradient(90deg, ${isApprove ? GRADIENT_APPROVE_FROM : GRADIENT_REJECT_FROM}, ${isApprove ? GRADIENT_APPROVE_TO : GRADIENT_REJECT_TO})`
    };

    const handleConfirm = () => {
        if (!isApprove && !reason.trim()) {
            return alert("Alasan penolakan wajib diisi!");
        }
        onConfirm({ orderId: data?.id, reason });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 grid place-items-center font-poppins "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="relative bg-white w-[92vw] max-w-sm rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.95 }}
                        transition={{ duration: reduce ? 0.01 : 0.3, type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header Gradient */}
                        <div
                            className="px-6 py-5 text-white relative overflow-hidden"
                            style={gradientStyle}
                        >
                            <div className="relative z-10">
                                <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
                                <p className="text-xs font-medium text-white/90 mt-1 opacity-90 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                            {/* Decorative graphics */}
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                        </div>

                        <div className="p-6">
                            {/* Content based on type */}
                            {!isApprove && (
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                        Alasan Penolakan
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Misal: Bukti transfer buram, Nominal tidak sesuai..."
                                        className="w-full text-sm border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all placeholder:text-gray-400 min-h-[100px] resize-none"
                                    />
                                </div>
                            )}

                            {isApprove && (
                                <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                        !
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Pastikan bukti transfer sudah dicek dan sesuai dengan nominal tagihan.
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 rounded-xl h-11 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-[1.5] rounded-xl h-11 font-bold text-white text-sm shadow-lg transition-all transform active:scale-95 hover:brightness-110"
                                    style={gradientStyle}
                                >
                                    {isApprove ? "Ya, Setujui" : "Tolak Pesanan"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
