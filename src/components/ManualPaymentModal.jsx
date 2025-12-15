import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { uploadPaymentProof } from "../services/payment.service"; // Adjust path if needed

// Helper icons & format
function CheckIcon({ className = "" }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
            <path d="M16 5L8.5 12.5L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const formatMoney = (n) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);

// The Content Component (Logic for upload & display)
function ManualPaymentContent({ info, onClose }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [senderName, setSenderName] = useState("");
    const [senderBank, setSenderBank] = useState("");
    const [success, setSuccess] = useState(false);

    const details = info.additional?.bankDetails || {};
    const amount = info.additional?.finalAmount || 0;
    // const orderCode = info.additional?.orderCode;

    const handleUpload = async () => {
        if (!file) return alert("Pilih file bukti transfer dulu.");
        setUploading(true);
        try {
            await uploadPaymentProof(info.orderId, file, {
                senderAccountName: senderName,
                senderBankName: senderBank
            });
            setSuccess(true);
        } catch (err) {
            alert(err.message || "Gagal upload");
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Bukti Terkirim!</h3>
                <p className="text-sm text-gray-600 mt-2">
                    Terima kasih. Admin kami akan memverifikasi pembayaran Anda secepatnya (max 24 jam).
                    Status paket akan aktif otomatis setelah di-approve.
                </p>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-[#5CC9AF] text-white rounded-xl h-10 font-semibold text-sm hover:opacity-90"
                >
                    Tutup
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700">Silakan Transfer ke:</div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Bank</span>
                    <span className="font-bold text-gray-800">{details.bankName || "Bank Kaltimtara"}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">No. Rekening</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg text-gray-800">{details.accountNumber || "1234567890"}</span>
                        <button onClick={() => navigator.clipboard.writeText(details.accountNumber)} className="text-[10px] uppercase bg-white border px-1.5 py-0.5 rounded text-gray-500">Salin</button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">A.N.</span>
                    <span className="font-medium text-gray-800">{details.accountName || "PT CS AI INDONESIA"}</span>
                </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <div className="text-xs text-emerald-700 mb-1">Total Yang Harus Dibayar (Unik)</div>
                <div className="text-2xl font-bold text-emerald-800">{formatMoney(amount)}</div>
                <div className="text-[10px] text-emerald-600 mt-1">Mohon transfer nominal TEPAT sampai 3 digit terakhir agar verifikasi otomatis lebih cepat.</div>
            </div>

            {/* Form Upload */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="text-sm font-semibold text-gray-900">Konfirmasi Pembayaran</div>

                <input
                    type="text"
                    placeholder="Nama Pengirim (di Rekening)"
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nama Bank Pengirim (misal: BCA, BRI)"
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500"
                    value={senderBank}
                    onChange={e => setSenderBank(e.target.value)}
                />

                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-xs file:font-semibold
                          file:bg-emerald-50 file:text-emerald-700
                          hover:file:bg-emerald-100
                        "
                    />
                </div>

                <button
                    onClick={handleUpload}
                    disabled={uploading || !file}
                    className="w-full bg-[#5CC9AF] text-white rounded-xl h-10 font-semibold text-sm hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {uploading ? "Mengupload..." : "Kirim Bukti Transfer"}
                </button>
            </div>

            {!success && (
                <button
                    onClick={onClose}
                    className="w-full h-11 rounded-xl border border-gray-300 hover:bg-gray-50 font-semibold mt-2"
                    type="button"
                >
                    Tutup
                </button>
            )}
        </div>
    );
}

// The Modal Wrapper
export default function ManualPaymentModal({ isOpen, onClose, info }) {
    const reduce = useReducedMotion();

    if (!isOpen || !info) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 grid place-items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="relative bg-white w-[92vw] max-w-md rounded-2xl shadow-xl border border-black/10 overflow-hidden"
                        initial={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.98 }}
                        transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="bg-[#5CC9AF] text-white px-5 py-4">
                            <div className="text-lg font-bold">Instruksi Pembayaran Manual</div>
                            <div className="text-xs opacity-90">Order ID: {info.orderId}</div>
                        </div>

                        <div className="p-5">
                            <ManualPaymentContent info={info} onClose={onClose} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
