import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLoyalty } from "../../hooks/useLoyalty";
import {
    HiOutlineSparkles,
    HiOutlineTicket,
    HiOutlineTrophy,
    HiOutlineBolt,
} from "react-icons/hi2";

// === CONSTANTS & LEVELS ===
const LEVELS = [
    { name: "Newbie", minXP: 0, multiplier: 1, color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-300" },
    { name: "Expert", minXP: 50, multiplier: 2, color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-300" },
    { name: "Master", minXP: 100, multiplier: 3, color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-300" },
    { name: "Legend", minXP: 200, multiplier: 4, color: "text-yellow-500", bg: "bg-yellow-100", border: "border-yellow-300" },
];

const PACKAGES = [
    { id: "basic", name: "Paket Basic", points: 25, price: "Rp 25.000", desc: "Akses fitur dasar selama 1 bulan." },
    { id: "pro", name: "Paket Pro", points: 65, price: "Rp 65.000", desc: "Fitur lengkap untuk profesional." },
    { id: "business", name: "Paket Business", points: 125, price: "Rp 125.000", desc: "Solusi bisnis skala menengah." },
    { id: "enterprise", name: "Paket Enterprise", points: 200, price: "Rp 200.000", desc: "Full akses skala besar." },
];

export default function RewardsDashboard({ profile }) {
    const { t } = useTranslation();

    // ✅ Ambil data real dari API via Hook
    const { pointBalance, lifetimePoints, loading } = useLoyalty();

    // Fallback ke prop profile atau 0, jika API masih loading/kosong
    // Prioritas: API > Profile > Mock/0
    const currentPoints = (pointBalance !== undefined ? pointBalance : profile?.pointBalance) || 0;
    const currentXP = (lifetimePoints !== undefined ? lifetimePoints : profile?.lifetimePoints) || 0;

    // Hitung Level
    const currentLevel = useMemo(() => {
        return [...LEVELS].reverse().find((l) => currentXP >= l.minXP) || LEVELS[0];
    }, [currentXP]);

    const nextLevel = useMemo(() => {
        return LEVELS.find((l) => l.minXP > currentXP);
    }, [currentXP]);

    const progressToNext = useMemo(() => {
        if (!nextLevel) return 100;
        const prevXP = currentLevel.minXP;
        const targetXP = nextLevel.minXP;
        const progress = ((currentXP - prevXP) / (targetXP - prevXP)) * 100;
        return Math.min(100, Math.max(0, progress));
    }, [currentXP, currentLevel, nextLevel]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto font-poppins text-gray-800">
            {/* HEADER: Title & Welcome */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                    Rewards & Loyalty
                </h1>
                <p className="text-gray-500 mt-1">
                    Kumpulkan CSAI Points dan tukarkan dengan paket paket langganan gratis!
                </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Card 1: Poin Dompet */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-100">
                            <HiOutlineSparkles size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">CSAI Points</p>
                            <h2 className="text-3xl font-black text-gray-900">
                                {loading ? "..." : currentPoints}
                            </h2>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Gunakan poin ini untuk menukar paket langganan. 1 Poin ≈ Rp 1.000.
                    </p>
                </div>

                {/* Card 2: Level Status */}
                <div className={`rounded-3xl p-6 shadow-sm border relative overflow-hidden group ${currentLevel.bg} ${currentLevel.border}`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center backdrop-blur-sm ${currentLevel.color}`}>
                                <HiOutlineTrophy size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Current Tier</p>
                                <h2 className={`text-3xl font-black ${currentLevel.color}`}>{currentLevel.name}</h2>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-bold text-gray-700">{currentLevel.multiplier}x Multiplier</p>
                            <p className="text-xs text-gray-500">Bonus poin tiap transaksi</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                            <span>XP: {loading ? "..." : currentXP}</span>
                            <span>{nextLevel ? `Next: ${nextLevel.name} (${nextLevel.minXP} XP)` : "Max Level!"}</span>
                        </div>
                        <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${currentLevel.bg.replace('100', '500')}`}
                                style={{ backgroundColor: 'currentColor' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST REDEEM */}
            <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <HiOutlineTicket className="text-emerald-500" />
                    Redeem Catalog
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PACKAGES.map((pkg) => {
                        const canRedeem = currentPoints >= pkg.points;
                        return (
                            <div key={pkg.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                        {pkg.name}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-2xl font-extrabold text-gray-900">{pkg.points}</span>
                                    <span className="text-xs font-semibold text-gray-500">Poin</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4 flex-1">
                                    {pkg.desc} (Senilai {pkg.price})
                                </p>

                                <button
                                    disabled={!canRedeem}
                                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                      ${canRedeem
                                            ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                                >
                                    {canRedeem ? (
                                        <>
                                            <span>Tukar Sekarang</span>
                                            <HiOutlineBolt />
                                        </>
                                    ) : (
                                        <span>Poin Kurang</span>
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* FAQ / INFO */}
            <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">Cara Kerja Level & Poin</h3>
                <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                    <li><strong>Self-Reward:</strong> Beli paket buat diri sendiri dapat cashback poin.</li>
                    <li><strong>Referral Reward:</strong> Ajak teman beli paket, kamu juga dapat poin.</li>
                    <li><strong>Multiplier:</strong> Semakin tinggi level (XP), semakin banyak poin yang didapat per transaksi (up to 4x).</li>
                    <li><strong>Syarat Naik Level:</strong> Akumulasi total belanja/referral (XP) seumur hidup (tidak reset).</li>
                </ul>
            </div>

        </div>
    );
}
