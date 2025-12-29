import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoyalty } from "../hooks/useLoyalty";
import { motion } from "framer-motion";
import BalonDecoration from "../assets/balon.png";
import BadgeTierIcon from "../assets/loyalty/badge2.png";
import BadgeIcon from "../assets/loyalty/badge.png";
import TrophyIcon from "../assets/loyalty/trophy.png";
import CrownIcon from "../assets/loyalty/crown.png";
// import { ArrowLeft } from "lucide-react"; // Removed as we use SVG directly

// === CONSTANTS & LEVELS (Copy from RewardsDashboard to ensure consistency) ===
const LEVELS = [
    {
        name: "Newbie",
        minXP: 0,
        maxXP: 49,
        multiplier: 1,
        color: "text-gray-800",
        badgeColor: "bg-yellow-100 text-yellow-600",
        iconColor: "bg-emerald-400",
    },
    {
        name: "Expert",
        minXP: 50,
        maxXP: 99,
        multiplier: 2,
        color: "text-gray-800",
        badgeColor: "bg-blue-100 text-blue-600",
        iconColor: "bg-blue-500",
    },
    {
        name: "Master",
        minXP: 100,
        maxXP: 199,
        multiplier: 3,
        color: "text-gray-800",
        badgeColor: "bg-purple-100 text-purple-600",
        iconColor: "bg-purple-500",
    },
    {
        name: "Legend",
        minXP: 200,
        maxXP: 99999, // Unlimited
        multiplier: 4,
        color: "text-gray-800",
        badgeColor: "bg-red-100 text-red-600",
        iconColor: "bg-yellow-500",
    },
];

// ✅ CONFIG: ATUR POSISI & UKURAN BALON DISINI
const DECORATION_CONFIG = {
    show: true,
    width: "1500px",      // Ukuran gambar (bisa px atau %)
    top: "0px",          // Geser vertikal (bisa minus)
    right: "0px",        // Geser horizontal (bisa minus)
    opacity: 0.9,        // Transparansi (0.0 - 1.0)
    rotate: "0deg",      // Rotasi
    scale: 1.0,          // Skala (1.0 = normal)
    zIndex: 0            // Layering
};

const DECORATION_CONFIG_NEWBIE = {
    show: true,
    width: "1140px",      // Ukuran gambar (bisa px atau %)
    top: "-40px",          // Geser vertikal (bisa minus)
    right: "50px",        // Geser horizontal (bisa minus)
    opacity: 0.9,        // Transparansi (0.0 - 1.0)
    rotate: "0deg",      // Rotasi
    scale: 1.1,          // Skala (1.0 = normal)
    zIndex: 0            // Layering
};

const BASE_PACKAGES = [
    { name: "Basic", basePoints: 4 },
    { name: "Pro", basePoints: 9 },
    { name: "Bisnis", basePoints: 19 },
    { name: "Enterprise", basePoints: 49 },
];

// ✅ DATA PERBANDINGAN TIER
const COMPARISON_ROWS = [
    { label: "Multiplier Reward", newbie: "1x", expert: "2x", master: "3x", legend: "4x", isMultiplier: true },
    { label: "Cashback Basic", newbie: "4 Poin", expert: "8 Poin", master: "12 Poin", legend: "16 Poin" },
    { label: "Cashback Pro", newbie: "9 Poin", expert: "18 Poin", master: "27 Poin", legend: "36 Poin" },
    { label: "Cashback Bisnis", newbie: "19 Poin", expert: "38 Poin", master: "57 Poin", legend: "76 Poin" },
    { label: "Cashback Enterprise", newbie: "49 Poin", expert: "98 Poin", master: "147 Poin", legend: "196 Poin" },
];

export default function TierSystem() {
    const navigate = useNavigate();
    const { lifetimePoints, loading } = useLoyalty();

    // Use dummy data if loading or verify data
    const currentXP = lifetimePoints || 0;

    // Hitung Level
    const currentLevel = useMemo(
        () =>
            [...LEVELS].reverse().find((l) => currentXP >= l.minXP) || LEVELS[0],
        [currentXP]
    );

    const nextLevel = useMemo(
        () => LEVELS.find((l) => l.minXP > currentXP),
        [currentXP]
    );

    // Calculate range string
    const rangeString = `${currentLevel.minXP} - ${currentLevel.name === "Legend" ? "∞" : currentLevel.maxXP}`;

    // Progress logic
    const progressToNext = useMemo(() => {
        if (!nextLevel) return 100;
        const prevXP = currentLevel.minXP;
        const targetXP = nextLevel.minXP;
        const progress = ((currentXP - prevXP) / (targetXP - prevXP)) * 100;
        return Math.min(100, Math.max(0, progress));
    }, [currentXP, currentLevel, nextLevel]);

    return (
        <div className="min-h-screen bg-[#F0FFF5] font-poppins flex flex-col items-center py-6 px-4 relative">

            {/* === BACK BUTTON (ABSOLUTE TOP-LEFT) === */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors z-50"
            >
                <svg
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* === HEADER TITLE === */}
            <div className="w-full max-w-[85%] mb-12 flex items-center justify-center">
                <h1 className="text-5xl font-bold text-gray-700">Sistem Tier & Multiplier</h1>
            </div>

            {/* === MAIN CONTAINER (CARD) === */}
            <div className="w-full max-w-[85%] bg-white rounded-[35px] shadow-xl overflow-hidden relative min-h-[850px]">

                {/* 1. GREEN GRADIENT HEADER (Full Width) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-[440px] relative overflow-hidden flex flex-col items-center justify-center text-white rounded-t-[35px]"
                    style={{
                        background: "linear-gradient(135deg, #5FCAAC 0%, #C6E8A0 100%)", // Specific user requested gradient
                    }}
                >
                    {/* --- DECORATION CIRCLES --- */}
                    {/* Bottom-Left Big */}
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

                    {/* Top-Right Big */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                    {/* Middle-Right Small */}
                    <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>

                    {/* BALON DECORATION */}
                    {DECORATION_CONFIG.show && (
                        <img
                            src={BalonDecoration}
                            alt="Balon decoration"
                            className="absolute pointer-events-none"
                            style={{
                                width: DECORATION_CONFIG.width,
                                top: DECORATION_CONFIG.top,
                                right: DECORATION_CONFIG.right,
                                opacity: DECORATION_CONFIG.opacity,
                                transform: `scale(${DECORATION_CONFIG.scale}) rotate(${DECORATION_CONFIG.rotate})`,
                                zIndex: DECORATION_CONFIG.zIndex
                            }}
                        />
                    )}


                    {/* --- CONTENT --- */}

                    {/* Top Info (Lifetime | Range) */}
                    <div className="flex justify-center items-center gap-8 text-lg sm:text-xl font-semibold text-white/90 mb-8 relative z-10">
                        <div className="flex flex-col items-end sm:flex-row sm:items-center gap-2">
                            <span className="opacity-80 font-normal">Lifetime :</span>
                            <span className="font-bold text-white text-3xl">{currentXP} XP</span>
                        </div>
                        <span className="h-8 w-[2px] bg-white/30 hidden sm:block"></span>
                        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
                            <span className="opacity-80 font-normal">Range :</span>
                            <span className="font-bold text-white text-3xl">{rangeString}</span>
                        </div>
                    </div>

                    {/* Center Icon & badge */}
                    <div className="flex flex-col items-center justify-center relative z-10">
                        <div className="relative mb-4">
                            {/* White Outer Ring */}
                            {/* Center Badge Image */}
                            <div className="relative z-10">
                                <img
                                    src={BadgeTierIcon}
                                    alt="Tier Badge"
                                    className="w-56 h-56 object-contain drop-shadow-2xl"
                                />
                            </div>

                            {/* Multiplier Badge */}
                            {/* Multiplier Badge */}
                            <div className="absolute bottom-4 right-0 bg-[#FFF59D] text-[#DFA40A] text-4xl font-extrabold px-6 py-2 rounded-[24px] shadow-lg z-20">
                                {currentLevel.multiplier}x
                            </div>
                        </div>

                        <h2 className="text-5xl font-bold tracking-wide drop-shadow-sm mt-2">
                            {currentLevel.name}
                        </h2>
                    </div>
                </motion.div>

                {/* === MAIN CONTENT SCROLLABLE (Bottom Part) === */}
                <div className="p-6 sm:p-8 pb-20">


                    {/* 2. PROGRESS SECTION (White Card) */}
                    <div className="bg-white rounded-[24px] shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-gray-100 p-8 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3 text-gray-700 font-bold text-2xl">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                                <span>Progress ke {nextLevel ? nextLevel.name : "Max"}</span>
                            </div>
                            <span className="text-emerald-500 font-bold text-3xl">{Math.round(progressToNext)}%</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#DAEC75] to-[#5FCAAC] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>


                    {/* 3. EXPLANATION CARD (Yellow) */}
                    <div className="bg-[#FFF8D6] rounded-[24px] border border-[#FFEBA0] p-8 text-[#856404]">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl">🏆</span>
                            <h3 className="font-bold text-3xl text-yellow-800">Penjelasan Sistem Tier</h3>
                        </div>

                        <p className="text-xl leading-relaxed mb-8 text-yellow-900/80">
                            Tier adalah level loyalitas Anda di Joyin. Semakin tinggi tier Anda, semakin besar multiplier reward yang Anda dapatkan dari setiap transaksi!
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="flex items-center gap-3 font-bold text-2xl text-yellow-800 mb-2">
                                    <span className="bg-orange-400 text-white rounded-lg w-6 h-6 flex items-center justify-center text-sm shadow-sm">✓</span>
                                    Point Balance (Dompet)
                                </h4>
                                <p className="text-lg text-yellow-900/70 pl-9 leading-relaxed">
                                    Saldo poin yang bisa Anda belanjakan. Bertambah saat dapat reward, berkurang saat redeem paket.
                                </p>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-3 font-bold text-2xl text-yellow-800 mb-2">
                                    <span className="bg-orange-400 text-white rounded-lg w-6 h-6 flex items-center justify-center text-sm shadow-sm">★</span>
                                    Lifetime XP (Status)
                                </h4>
                                <p className="text-lg text-yellow-900/70 pl-9 leading-relaxed">
                                    Total akumulasi XP selamanya. Tidak pernah berkurang, menentukan tier Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. REWARD PER TRANSAKSI SECTION */}
                    {/* 4. TIER BENEFIT CARD (STATIC VISUAL ONLY) */}
                    <div className="mt-8 border border-[#E9E9E9] rounded-[30px] overflow-hidden bg-white shadow-md">

                        {/* A. GREEN HEADER SECTION (STATIC NEWBIE) */}
                        <div
                            className="relative h-[220px] w-full flex items-center justify-between px-6 sm:px-12 text-white overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, #5FCAAC 0%, #C6E8A0 100%)",
                            }}
                        >
                            {/* Decorations */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>

                            {/* BALON DECORATION (NEWBIE SPECIFIC) */}
                            {DECORATION_CONFIG_NEWBIE.show && (
                                <img
                                    src={BalonDecoration}
                                    alt="Balon decoration"
                                    className="absolute pointer-events-none"
                                    style={{
                                        width: DECORATION_CONFIG_NEWBIE.width,
                                        top: DECORATION_CONFIG_NEWBIE.top,
                                        right: DECORATION_CONFIG_NEWBIE.right,
                                        opacity: DECORATION_CONFIG_NEWBIE.opacity,
                                        transform: `scale(${DECORATION_CONFIG_NEWBIE.scale}) rotate(${DECORATION_CONFIG_NEWBIE.rotate})`,
                                        zIndex: DECORATION_CONFIG_NEWBIE.zIndex
                                    }}
                                />
                            )}

                            {/* Left: Icon & Info */}
                            <div className="flex items-center gap-5 z-10">
                                {/* Icon Box */}
                                <div className="relative">
                                    <img
                                        src={BadgeIcon}
                                        alt="Newbie Badge"
                                        className="w-20 h-20 object-contain drop-shadow-lg"
                                    />
                                </div>
                                {/* Text */}
                                <div>
                                    <h2 className="text-4xl font-bold tracking-wide mb-1 drop-shadow-sm">Newbie</h2>
                                    <p className="text-lg opacity-90 font-medium">0 - 49 XP</p>
                                </div>
                            </div>

                            {/* Right: Multiplier */}
                            <div className="flex flex-col items-center justify-center z-10">
                                <span className="text-6xl font-bold drop-shadow-sm">1x</span>
                                <span className="text-base opacity-90 font-medium tracking-wide">Multiplier</span>
                            </div>
                        </div>

                        {/* B. REWARD CONTENT SECTION */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-6">Reward per Transaksi</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Static Box 1: Basic */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Basic</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+4</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 2: Pro */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Pro</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+9</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 3: Bisnis */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Bisnis</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+19</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 4: Enterprise */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Enterprise</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+49</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                            </div>

                            {/* Upgrade Footer (Static) */}
                            <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-5 flex items-center justify-start text-[#34D399]">
                                <p className="text-sm sm:text-base">
                                    <span className="font-bold">Upgrade ke Master : </span>
                                    Butuh minimal 100 XP
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5. EXPERT TIER CARD (STATIC) */}
                    <div className="mt-8 border border-[#E9E9E9] rounded-[30px] overflow-hidden bg-white shadow-md">

                        {/* A. GREEN HEADER SECTION (STATIC EXPERT) */}
                        <div
                            className="relative h-[220px] w-full flex items-center justify-between px-6 sm:px-12 text-white overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, #5FCAAC 0%, #C6E8A0 100%)",
                            }}
                        >
                            {/* Decorations */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>

                            {/* BALON DECORATION (SAME AS NEWBIE) */}
                            {DECORATION_CONFIG_NEWBIE.show && (
                                <img
                                    src={BalonDecoration}
                                    alt="Balon decoration"
                                    className="absolute pointer-events-none"
                                    style={{
                                        width: DECORATION_CONFIG_NEWBIE.width,
                                        top: DECORATION_CONFIG_NEWBIE.top,
                                        right: DECORATION_CONFIG_NEWBIE.right,
                                        opacity: DECORATION_CONFIG_NEWBIE.opacity,
                                        transform: `scale(${DECORATION_CONFIG_NEWBIE.scale}) rotate(${DECORATION_CONFIG_NEWBIE.rotate})`,
                                        zIndex: DECORATION_CONFIG_NEWBIE.zIndex
                                    }}
                                />
                            )}

                            {/* Left: Icon & Info */}
                            <div className="flex items-center gap-5 z-10">
                                {/* Icon Box */}
                                <div className="relative">
                                    <img
                                        src={BadgeIcon}
                                        alt="Expert Badge"
                                        className="w-20 h-20 object-contain drop-shadow-lg"
                                    />
                                </div>
                                {/* Text */}
                                <div>
                                    <h2 className="text-4xl font-bold tracking-wide mb-1 drop-shadow-sm">Expert</h2>
                                    <p className="text-lg opacity-90 font-medium">50 - 99 XP</p>
                                </div>
                            </div>

                            {/* Right: Multiplier */}
                            <div className="flex flex-col items-center justify-center z-10">
                                <span className="text-6xl font-bold drop-shadow-sm">2x</span>
                                <span className="text-base opacity-90 font-medium tracking-wide">Multiplier</span>
                            </div>
                        </div>

                        {/* B. REWARD CONTENT SECTION */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-6">Reward per Transaksi</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Static Box 1: Basic */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Basic</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+8</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 2: Pro */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Pro</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+18</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 3: Bisnis */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Bisnis</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+38</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 4: Enterprise */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Enterprise</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+98</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                            </div>

                            {/* Upgrade Footer (Static) */}
                            <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-5 flex items-center justify-start text-[#34D399]">
                                <p className="text-sm sm:text-base">
                                    <span className="font-bold">Upgrade ke Master : </span>
                                    Butuh minimal 100 XP
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 6. MASTER TIER CARD (STATIC) */}
                    <div className="mt-8 border border-[#E9E9E9] rounded-[30px] overflow-hidden bg-white shadow-md">

                        {/* A. GREEN HEADER SECTION (STATIC MASTER) */}
                        <div
                            className="relative h-[220px] w-full flex items-center justify-between px-6 sm:px-12 text-white overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, #5FCAAC 0%, #C6E8A0 100%)",
                            }}
                        >
                            {/* Decorations */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>

                            {/* BALON DECORATION (SAME AS NEWBIE) */}
                            {DECORATION_CONFIG_NEWBIE.show && (
                                <img
                                    src={BalonDecoration}
                                    alt="Balon decoration"
                                    className="absolute pointer-events-none"
                                    style={{
                                        width: DECORATION_CONFIG_NEWBIE.width,
                                        top: DECORATION_CONFIG_NEWBIE.top,
                                        right: DECORATION_CONFIG_NEWBIE.right,
                                        opacity: DECORATION_CONFIG_NEWBIE.opacity,
                                        transform: `scale(${DECORATION_CONFIG_NEWBIE.scale}) rotate(${DECORATION_CONFIG_NEWBIE.rotate})`,
                                        zIndex: DECORATION_CONFIG_NEWBIE.zIndex
                                    }}
                                />
                            )}

                            {/* Left: Icon & Info */}
                            <div className="flex items-center gap-5 z-10">
                                {/* Icon Box */}
                                <div className="relative">
                                    <img
                                        src={TrophyIcon}
                                        alt="Master Badge"
                                        className="w-20 h-20 object-contain drop-shadow-lg"
                                    />
                                </div>
                                {/* Text */}
                                <div>
                                    <h2 className="text-4xl font-bold tracking-wide mb-1 drop-shadow-sm">Master</h2>
                                    <p className="text-lg opacity-90 font-medium">100 - 199 XP</p>
                                </div>
                            </div>

                            {/* Right: Multiplier */}
                            <div className="flex flex-col items-center justify-center z-10">
                                <span className="text-6xl font-bold drop-shadow-sm">3x</span>
                                <span className="text-base opacity-90 font-medium tracking-wide">Multiplier</span>
                            </div>
                        </div>

                        {/* B. REWARD CONTENT SECTION */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-6">Reward per Transaksi</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Static Box 1: Basic */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Basic</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+12</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 2: Pro */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Pro</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+27</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 3: Bisnis */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Bisnis</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+57</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 4: Enterprise */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Enterprise</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+147</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                            </div>

                            {/* Upgrade Footer (Static) */}
                            <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-5 flex items-center justify-start text-[#34D399]">
                                <p className="text-sm sm:text-base">
                                    <span className="font-bold">Upgrade ke Legend : </span>
                                    Butuh minimal 200 XP
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 7. LEGEND TIER CARD (STATIC) */}
                    <div className="mt-8 border border-[#E9E9E9] rounded-[30px] overflow-hidden bg-white shadow-md">

                        {/* A. GREEN HEADER SECTION (STATIC LEGEND) */}
                        <div
                            className="relative h-[220px] w-full flex items-center justify-between px-6 sm:px-12 text-white overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, #5FCAAC 0%, #C6E8A0 100%)",
                            }}
                        >
                            {/* Decorations */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl"></div>

                            {/* BALON DECORATION (SAME AS NEWBIE) */}
                            {DECORATION_CONFIG_NEWBIE.show && (
                                <img
                                    src={BalonDecoration}
                                    alt="Balon decoration"
                                    className="absolute pointer-events-none"
                                    style={{
                                        width: DECORATION_CONFIG_NEWBIE.width,
                                        top: DECORATION_CONFIG_NEWBIE.top,
                                        right: DECORATION_CONFIG_NEWBIE.right,
                                        opacity: DECORATION_CONFIG_NEWBIE.opacity,
                                        transform: `scale(${DECORATION_CONFIG_NEWBIE.scale}) rotate(${DECORATION_CONFIG_NEWBIE.rotate})`,
                                        zIndex: DECORATION_CONFIG_NEWBIE.zIndex
                                    }}
                                />
                            )}

                            {/* Left: Icon & Info */}
                            <div className="flex items-center gap-5 z-10">
                                {/* Icon Box */}
                                <div className="relative">
                                    <img
                                        src={CrownIcon}
                                        alt="Legend Badge"
                                        className="w-20 h-20 object-contain drop-shadow-lg"
                                    />
                                </div>
                                {/* Text */}
                                <div>
                                    <h2 className="text-4xl font-bold tracking-wide mb-1 drop-shadow-sm">Legend</h2>
                                    <p className="text-lg opacity-90 font-medium">200 - ∞ XP</p>
                                </div>
                            </div>

                            {/* Right: Multiplier */}
                            <div className="flex flex-col items-center justify-center z-10">
                                <span className="text-6xl font-bold drop-shadow-sm">4x</span>
                                <span className="text-base opacity-90 font-medium tracking-wide">Multiplier</span>
                            </div>
                        </div>

                        {/* B. REWARD CONTENT SECTION */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-6">Reward per Transaksi</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Static Box 1: Basic */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Basic</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+12</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 2: Pro */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Pro</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+27</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 3: Bisnis */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Bisnis</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+57</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                                {/* Static Box 4: Enterprise */}
                                <div className="border border-[#A7F3D0] bg-[#F0FDF9] rounded-2xl h-32 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                                    <span className="text-gray-500 font-bold text-sm mb-1">Enterprise</span>
                                    <span className="text-[#34D399] text-5xl font-bold mb-1">+147</span>
                                    <span className="text-gray-400 text-xs font-medium">Bintang</span>
                                </div>
                            </div>

                            {/* Upgrade Footer (Static) */}
                        </div>
                    </div>
                </div>

                {/* 8. COMPARISON TABLE SECTION (NEW) */}
                <div className="mt-12 bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 sm:p-10 border border-gray-100">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">
                        Perbandingan Benefit Antar Tier
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-4 px-4 text-gray-500 font-semibold w-1/4">Fitur</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-bold w-[18.75%]">Newbie</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-bold w-[18.75%]">Expert</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-bold w-[18.75%]">Master</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-bold w-[18.75%]">Legend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON_ROWS.map((row, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 px-4 text-gray-700 font-medium">
                                            {row.label}
                                        </td>
                                        <td className={`py-5 px-4 text-center font-bold ${row.isMultiplier ? 'text-emerald-500 text-lg' : 'text-gray-600'}`}>
                                            {row.newbie}
                                        </td>
                                        <td className={`py-5 px-4 text-center font-bold ${row.isMultiplier ? 'text-emerald-500 text-lg' : 'text-gray-600'}`}>
                                            {row.expert}
                                        </td>
                                        <td className={`py-5 px-4 text-center font-bold ${row.isMultiplier ? 'text-emerald-500 text-lg' : 'text-gray-600'}`}>
                                            {row.master}
                                        </td>
                                        <td className={`py-5 px-4 text-center font-bold ${row.isMultiplier ? 'text-emerald-500 text-lg' : 'text-gray-600'}`}>
                                            {row.legend}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
