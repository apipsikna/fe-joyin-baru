import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ✅ THEME STYLES
const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

// ✅ PRICING CONFIG (Matches checkout.jsx)
const TAX_RATE = 0.11;
const PLAN_PRICES = {
    BASIC: 49000,
    PRO: 99000,
    BUSINESS: 199000,
    ENTERPRISE: 499000
};

const planOptions = [
    { id: 'PRO', label: 'Pro Plan', price: 'Rp 99.000 / bln' },
    { id: 'BUSINESS', label: 'Business Plan', price: 'Rp 199.000 / bln' },
    { id: 'ENTERPRISE', label: 'Enterprise Plan', price: 'Rp 499.000 / bln' },
];

const durationOptions = [
    { id: '1', label: '1 Bulan' },
    { id: '3', label: '3 Bulan' },
    { id: '6', label: '6 Bulan' },
    { id: '12', label: '12 Bulan' },
];

const formatMoney = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function SubscriptionActionModal({ isOpen, onClose, mode, onConfirm, currentPlan = "BASIC" }) {
    const reduce = useReducedMotion();
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");

    // Identify active plan for calculation
    const activePlanId = (mode === 'UPGRADE' ? selectedPlan : currentPlan).toUpperCase();

    // Calculate Totals
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    if (activePlanId && selectedDuration && PLAN_PRICES[activePlanId]) {
        const basePrice = PLAN_PRICES[activePlanId];
        const months = parseInt(selectedDuration);
        subtotal = basePrice * months;
        tax = subtotal * TAX_RATE;
        total = subtotal + tax;
    }

    // Reset state when opening
    React.useEffect(() => {
        if (isOpen) {
            setStep(mode === 'UPGRADE' ? 1 : 2); // Step 1 is Plan, Step 2 is Duration
            setSelectedPlan("");
            setSelectedDuration("");
        }
    }, [isOpen, mode]);

    if (!isOpen || !mode) return null;

    const handleNext = () => {
        setStep(2);
    };

    const handleConfirm = () => {
        onConfirm({
            plan: mode === 'UPGRADE' ? selectedPlan : null,
            months: parseInt(selectedDuration)
        });
        onClose();
    };

    const isStep1Valid = mode === 'UPGRADE' && selectedPlan;
    const isStep2Valid = selectedDuration;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 grid place-items-center font-poppins"
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
                        className="relative bg-white w-[92vw] max-w-md rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.95 }}
                        transition={{ duration: reduce ? 0.01 : 0.3, type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header Gradient */}
                        <div
                            className="px-6 py-5 text-white relative overflow-hidden"
                            style={{ background: `linear-gradient(90deg, ${GRADIENT_FROM}, ${GRADIENT_TO})` }}
                        >
                            <div className="relative z-10">
                                <h2 className="text-xl font-extrabold tracking-tight">
                                    {mode === 'UPGRADE' ? (step === 1 ? "Pilih Paket Baru" : "Pilih Durasi") : "Perpanjang Paket"}
                                </h2>
                                <p className="text-xs font-medium text-white/90 mt-1 uppercase tracking-wide opacity-80">
                                    {mode === 'UPGRADE' ? "Tingkatkan layanan Anda" : "Lanjutkan layanan terbaik"}
                                </p>
                            </div>
                            {/* Decorative graphics */}
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                        </div>

                        <div className="p-6">
                            {step === 1 && mode === 'UPGRADE' && (
                                <div className="space-y-3">
                                    {planOptions.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPlan(p.id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedPlan === p.id
                                                ? "border-[#5FCAAC] bg-[#5FCAAC]/5 shadow-md"
                                                : "border-gray-100 hover:border-[#5FCAAC]/50 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="font-bold text-gray-800">{p.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{p.price}</div>
                                        </button>
                                    ))}

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 rounded-xl h-12 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!isStep1Valid}
                                            className="flex-[2] rounded-xl h-12 font-bold text-white shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
                                            style={isStep1Valid ? { background: `linear-gradient(90deg, ${GRADIENT_FROM}, ${GRADIENT_TO})` } : { background: '#d1d5db' }}
                                        >
                                            Lanjut
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {durationOptions.map(d => (
                                            <button
                                                key={d.id}
                                                onClick={() => setSelectedDuration(d.id)}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center h-24 ${selectedDuration === d.id
                                                    ? "border-[#5FCAAC] bg-[#5FCAAC]/5 shadow-md"
                                                    : "border-gray-100 hover:border-[#5FCAAC]/50 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="text-2xl font-bold text-gray-800">{d.id}</span>
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bulan</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Price Summary */}
                                    {total > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm space-y-1">
                                            <div className="flex justify-between text-gray-500">
                                                <span>Subtotal</span>
                                                <span>{formatMoney(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-500">
                                                <span>PPN (11%)</span>
                                                <span>{formatMoney(tax)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200 mt-2">
                                                <span>Total Bayar</span>
                                                <span className="text-[#5FCAAC] text-lg">{formatMoney(total)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={mode === 'UPGRADE' ? () => setStep(1) : onClose}
                                            className="flex-1 rounded-xl h-12 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            {mode === 'UPGRADE' ? "Kembali" : "Batal"}
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={!isStep2Valid}
                                            className="flex-[2] rounded-xl h-12 font-bold text-white shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                            style={isStep2Valid ? { background: `linear-gradient(90deg, ${GRADIENT_FROM}, ${GRADIENT_TO})` } : { background: '#d1d5db' }}
                                        >
                                            {mode === 'UPGRADE' ? "Buat Pesanan" : "Bayar Sekarang"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
