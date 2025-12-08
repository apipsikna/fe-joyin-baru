import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Eye, Check, X, Search, FileText } from "lucide-react"; // Using Lucide for clean UI
import Logo from "../assets/logo.png"; // Adjust path if needed

/**
 * MOCK DATA
 */
const MOCK_ORDERS = [
    {
        id: 1,
        name: "Andin Nugraha",
        status: "Menunggu konfirmasi",
        time: "2025-11-25 09:12",
    },
    {
        id: 2,
        name: "Bella Nadhira",
        status: "Telah dikonfirmasi",
        time: "2025-11-25 10:45",
    },
    {
        id: 3,
        name: "Candra Wijaya",
        status: "Telah dikonfirmasi",
        time: "2025-11-25 09:30",
    },
    {
        id: 4,
        name: "Dwi Lestari",
        status: "Telah dikonfirmasi",
        time: "2025-11-25 11:05",
    },
    {
        id: 5,
        name: "Fajar Nugraha",
        status: "Menunggu konfirmasi",
        time: "2025-11-25 12:58",
    },
    {
        id: 6,
        name: "Gita Ramadhani",
        status: "Menunggu konfirmasi",
        time: "2025-11-25 07:50",
    },
    {
        id: 7,
        name: "Hendra Saputra",
        status: "Telah dikonfirmasi",
        time: "2025-11-25 13:27",
    },
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState("");

    // Simple filter
    const filteredData = MOCK_ORDERS.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-poppins">
            {/* SIDEBAR */}
            <aside className="w-[260px] bg-white border-r border-gray-100 flex-shrink-0 flex flex-col fixed h-full z-20">
                {/* Logo Area */}
                <div className="p-6 flex flex-col items-center border-b border-gray-50/50">
                    <img src={Logo} alt="Joyin Logo" className="w-24 mb-2" />
                    <span className="text-xs text-[#5FCAAC] font-medium tracking-wide">
                        Dashboard Admin
                    </span>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#5FCAAC] text-white rounded-[12px] shadow-[0_4px_12px_rgba(95,202,172,0.3)] cursor-pointer transition-all">
                        <FileText size={20} />
                        <span className="font-medium text-[15px]">Kelola Pesanan</span>
                    </div>
                    {/* Add more menu items if needed */}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-[260px] relative">
                {/* HEADER BACKGROUND GRADIENT */}
                <div className="h-[240px] w-full bg-gradient-to-r from-[#5FCAAC] to-[#DDF7A3] relative">
                    {/* Header Content */}
                    <div className="px-8 pt-8 flex justify-between items-start">
                        <div className="flex-1 flex justify-center pt-2">
                            <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-sm">
                                Kelola Pesanan
                            </h1>
                        </div>
                        {/* User Profile Placeholder */}
                        <div className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full flex items-center gap-2 cursor-pointer hover:bg-white/40 transition">
                            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <svg className="w-4 h-4 text-white mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* CARD CONTENT (Floating over header) */}
                <div className="px-8 -mt-24 pb-12 relative z-10">
                    <div className="bg-white rounded-[24px] shadow-lg p-6 min-h-[600px]">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-full">
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-6 pr-12 py-3.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5FCAAC]/30 transition-all text-gray-600 placeholder-gray-400"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={20} />
                                </div>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#5FCAAC] text-white">
                                        <th className="py-4 px-6 text-center rounded-l-[12px] font-medium w-[80px]">No</th>
                                        <th className="py-4 px-6 text-left font-medium">Nama Pemesan</th>
                                        <th className="py-4 px-6 text-center font-medium">Status Pemesan</th>
                                        <th className="py-4 px-6 text-center font-medium">Waktu</th>
                                        <th className="py-4 px-6 text-center font-medium">Bukti Transfer</th>
                                        <th className="py-4 px-6 text-center rounded-r-[12px] font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6 text-center text-gray-700 font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="py-5 px-6 text-left text-gray-800 font-semibold">
                                                {item.name}
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <span
                                                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${item.status === "Telah dikonfirmasi"
                                                            ? "bg-[#D1FAE5] text-[#10B981]" // Greenish
                                                            : "bg-[#FFEDD5] text-[#F97316]" // Orangeish
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 text-center text-gray-600 text-sm">
                                                {item.time}
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <button className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 hover:text-[#5FCAAC] hover:border-[#5FCAAC] transition-all">
                                                    <Copy size={14} className="opacity-70" />
                                                    Lihat Bukti
                                                </button>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {item.status === "Menunggu konfirmasi" ? (
                                                        <>
                                                            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#5FCAAC] text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                                                <Check size={14} strokeWidth={3} />
                                                                Terima
                                                            </button>
                                                            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EF4444] text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                                                <X size={14} strokeWidth={3} />
                                                                Tolak
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-all">
                                                            <Eye size={14} />
                                                            Lihat Detail
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty state if needed */}
                            {filteredData.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    Tidak ada pesanan ditemukan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
