import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    HiOutlineChatAlt2,
    HiOutlineTemplate,
    HiOutlineClock,
    HiOutlineChartBar,
    HiOutlinePhone,
    HiOutlineQuestionMarkCircle,
    HiOutlineBell,
    HiOutlineRefresh,
    HiArrowLeft,
    HiOutlineUserGroup,
    HiOutlineCalendar,
    HiOutlineSparkles,
    HiOutlineLink,
    HiOutlineSupport,
    HiOutlineDocumentText,
} from "react-icons/hi";

// Data Detail Paket (Static for demo purposes, matching the image content)
const PACKAGE_DETAILS = [
    {
        id: "basic",
        name: "Paket Basic",
        benefits: [
            {
                icon: HiOutlineChatAlt2,
                title: "300 percakapan/bulan",
                desc: "Bisa melayani hingga 300 interaksi pelanggan setiap bulannya.",
            },
            {
                icon: HiOutlineTemplate,
                title: "Template balasan standar",
                desc: "Tersedia kumpulan template siap pakai untuk mempercepat balasan.",
            },
            {
                icon: HiOutlineClock,
                title: "Balasan otomatis 24/7",
                desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja.",
            },
            {
                icon: HiOutlineChartBar,
                title: "Statistik bulanan sederhana",
                desc: "Lihat ringkasan performa chatbot secara jelas setiap bulan.",
            },
            {
                icon: HiOutlinePhone,
                title: "Integrasi WhatsApp mudah",
                desc: "Cukup beberapa langkah untuk langsung terhubung ke WhatsApp Anda.",
            },
            {
                icon: HiOutlineQuestionMarkCircle,
                title: "FAQ dasar bawaan",
                desc: "Sudah dilengkapi jawaban FAQ umum agar chatbot bisa langsung bekerja.",
            },
        ],
    },
    {
        id: "pro",
        name: "Paket Pro",
        benefits: [
            {
                icon: HiOutlineChatAlt2,
                title: "1000 percakapan/bulan",
                desc: "Bisa melayani hingga 1000 interaksi pelanggan setiap bulannya.",
            },
            {
                icon: HiOutlineChartBar,
                title: "Statistik & insight pelanggan",
                desc: "Lihat performa chat dan perilaku pelanggan untuk memahami kebutuhan mereka.",
            },
            {
                icon: HiOutlineClock,
                title: "Balasan otomatis 24/7",
                desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja.",
            },
            {
                icon: HiOutlineTemplate,
                title: "Template balasan Custom",
                desc: "Buat dan atur template balasan sesuai gaya bisnis kamu.",
            },
            {
                icon: HiOutlineBell,
                title: "Notifikasi chat masuk",
                desc: "Dapatkan pemberitahuan instan tiap ada pelanggan yang mengirim pesan.",
            },
            {
                icon: HiOutlineRefresh, // Using Refresh for Auto-update
                title: "Auto-update FAQ produk",
                desc: "FAQ langsung diperbarui otomatis setiap kali kamu ubah data produk.",
            },
            {
                icon: HiOutlineChatAlt2,
                title: "Pesan sambutan personal",
                desc: "Chatbot menyapa pelanggan dengan salam pembuka yang kamu tentukan sendiri.",
            },
        ],
    },
    {
        id: "business",
        name: "Paket Bisnis",
        benefits: [
            {
                icon: HiOutlineChatAlt2,
                title: "5.000 percakapan/bulan",
                desc: "Bisa melayani hingga 5000 interaksi pelanggan setiap bulannya.",
            },
            {
                icon: HiOutlineChartBar,
                title: "Laporan mingguan lengkap",
                desc: "Dapatkan ringkasan performa chat setiap minggu untuk memantau perkembangan.",
            },
            {
                icon: HiOutlineClock,
                title: "Balasan otomatis 24/7",
                desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja.",
            },
            {
                icon: HiOutlineTemplate,
                title: "Template balasan premium",
                desc: "Format jawaban siap pakai yang lebih rapi, profesional, dan bisa diatur bebas.",
            },
            {
                icon: HiOutlineUserGroup,
                title: "Multi-admin WhatsApp",
                desc: "Beberapa admin bisa membalas chat pelanggan secara bersamaan.",
            },
            {
                icon: HiOutlineQuestionMarkCircle,
                title: "FAQ otomatis & terjadwal",
                desc: "Jawaban umum langsung muncul otomatis, bisa dijadwalkan sesuai kebutuhan.",
            },
            {
                icon: HiOutlineSparkles,
                title: "Prioritas dukungan teknis",
                desc: "Tim support lebih cepat merespons dan membantu pengaturan bisnis Anda.",
            },
            {
                icon: HiOutlineCalendar,
                title: "Pesan terjadwal promosi",
                desc: "Kirim broadcast promo atau pengingat ke pelanggan secara otomatis.",
            },
        ],
    },
    {
        id: "enterprise",
        name: "Paket Enterprise",
        benefits: [
            {
                icon: HiOutlineChatAlt2,
                title: "Chat tanpa batas",
                desc: "Layani pelanggan tanpa khawatir batas jumlah percakapan.",
            },
            {
                icon: HiOutlineChartBar,
                title: "Statistik real-time & export data",
                desc: "Pantau performa secara langsung dan unduh data untuk analisis lanjutan.",
            },
            {
                icon: HiOutlineClock,
                title: "Balasan otomatis 24/7",
                desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja.",
            },
            {
                icon: HiOutlineDocumentText,
                title: "Laporan custom & konsultasi setup",
                desc: "Dapatkan laporan khusus sesuai kebutuhan bisnis + bantuan setup dari tim ahli.",
            },
            {
                icon: HiOutlinePhone, // Or WhatsApp icon if available, but Phone is standard here
                title: "Integrasi WhatsApp API penuh",
                desc: "Akses penuh API resmi untuk performa lebih stabil dan profesional.",
            },
            {
                icon: HiOutlineSupport,
                title: "Prioritas dukungan & SLA support",
                desc: "Akses jalur dukungan prioritas dengan standar layanan yang terjamin.",
            },
            {
                icon: HiOutlineUserGroup,
                title: "Multi-admin + manajemen tim",
                desc: "Tambahkan banyak admin dan kelola peran atau tugas tim dengan mudah.",
            },
            {
                icon: HiOutlineLink,
                title: "Integrasi sistem internal (CRM/API)",
                desc: "Hubungkan chatbot ke CRM, sistem internal, atau API kustom perusahaan.",
            },
        ],
    },
];

export default function PackageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to specific package on mount
    React.useEffect(() => {
        if (id) {
            const element = document.getElementById(id);
            if (element) {
                // Beri sedikit delay agar rendering selesai
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 300);
            }
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-[#F0FDF4] text-gray-800 font-poppins relative">
            {/* Header Navigation */}
            <div className="flex items-center p-6 md:p-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-6 md:left-8 p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                    <HiArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="w-full text-center text-xl md:text-2xl font-bold text-gray-700">
                    Detail Paket
                </h1>
            </div>

            {/* Main Content Card */}
            <div className="max-w-7xl mx-auto px-4 pb-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-t-[40px] rounded-b-none shadow-2xl p-6 md:p-10 border border-emerald-50 space-y-24 min-h-screen"
                >
                    {PACKAGE_DETAILS.map((pkg) => (
                        <div
                            key={pkg.id}
                            id={pkg.id}
                            className="border-2 border-[#5FCAAC] rounded-[32px] p-6 md:p-10 scroll-mt-32"
                        >
                            {/* Package Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-10 text-lef">
                                {pkg.name}
                            </h2>

                            {/* Grid Layout Benefits */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {pkg.benefits.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                        className="border border-emerald-200 rounded-3xl p-5 md:p-6 flex flex-col items-start hover:border-emerald-400 transition-colors bg-white"
                                    >
                                        <div className="mb-4">
                                            <item.icon className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
