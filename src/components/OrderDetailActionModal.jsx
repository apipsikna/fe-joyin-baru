import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const formatMoney = (n) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);

// Helper untuk format tanggal/status jika perlu
// ...

export default function OrderDetailActionModal({ isOpen, order, onClose, onCancelConfirmation }) {
    const reduce = useReducedMotion();

    if (!isOpen || !order) return null;

    // Extract data safe
    const user = order.user || {};
    const details = order.details || {}; // Jika ada details tambahan

    // Resolve Image URL logic
    const rawProofUrl = order.paymentProof?.imageUrl;
    const resolveImageUrl = (url) => {
        if (!url) return null;
        let baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        // Handle common proxy/path issues
        if (baseUrl === "/api") baseUrl = "http://localhost:3000";
        if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
        if (baseUrl.endsWith("/api")) baseUrl = baseUrl.slice(0, -4); // remove /api suffix if present

        const rawPath = url.replace(/\\/g, "/");
        let cleanPath = rawPath;
        if (cleanPath.includes("uploads/")) {
            cleanPath = "/uploads/" + cleanPath.split("uploads/").pop();
        } else if (!cleanPath.startsWith("/")) {
            cleanPath = "/uploads/" + cleanPath;
        }
        if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

        return cleanPath.startsWith("http") ? cleanPath : `${baseUrl}${cleanPath}`;
    };

    const proofUrl = resolveImageUrl(rawProofUrl);

    // Hitung/Ambil data
    const finalAmount = order.finalAmount || order.totalAmount || 0;
    const planName = order.planId || "Paket Basic"; // Fallback text
    const statusText = order.status === "PAID" ? "Lunas" : order.status;

    // Asumsi no WA ada di user.phoneNumber atau kita mock
    const phoneNumber = user.phoneNumber || "0812-3456-7890"; // Mock/Fallback

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[120] grid place-items-center font-poppins"
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
                        className="relative bg-white w-[90vw] max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        initial={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.95 }}
                        transition={{ duration: reduce ? 0.01 : 0.3, type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="pt-6 pb-2 text-center relative">
                            <h2 className="text-lg font-bold text-gray-800">Pemesanan</h2>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="px-6 py-2 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Nama Pemesan</span>
                                    <span className="text-gray-800 font-semibold text-right">{user.name || "Tanpa Nama"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">No. WhatsApp</span>
                                    <span className="text-gray-800 font-semibold text-right">{phoneNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Paket</span>
                                    <span className="text-gray-800 font-semibold text-right">{planName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Jumlah Pembayaran</span>
                                    <span className="text-gray-800 font-semibold text-right">{formatMoney(finalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Status Pembayaran</span>
                                    <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs text-right">{statusText}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="text-sm font-medium text-gray-500 mb-2">Bukti Transfer</div>
                                <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 min-h-[150px] relative flex items-center justify-center">
                                    {proofUrl ? (
                                        <img
                                            src={proofUrl} // Akan di-resolve di parent/utils atau kirim full URL
                                            alt="Bukti Transfer"
                                            className="w-full h-auto object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-xs">Tidak ada bukti gambar</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 pt-4 bg-white border-t border-gray-50">
                            <button
                                onClick={() => onCancelConfirmation(order)}
                                className="w-full h-11 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all transform active:scale-95 text-sm"
                            >
                                Batalkan Konfirmasi
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
