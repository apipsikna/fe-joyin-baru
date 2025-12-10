import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Eye, Check, X, Search, FileText, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileModal from "../components/profile/ProfileModal";

// Services
import { getPendingOrders, approveOrder, rejectOrder } from "../services/admin.service";

// Shared Components
import Sidebar from "../components/dashboard/Sidebar";
import TopRightProfile from "../components/dashboard/TopRightProfile";

const MENU = {
    ORDERS: "orders",
};

export default function AdminDashboard() {
    const { t, i18n } = useTranslation();
    const { fetchMe, ready, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [activeMenu, setActiveMenu] = useState(MENU.ORDERS);

    // Profile state
    const [profile, setProfile] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Data Orders State
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // ID order yg sedang diproses
    const [alert, setAlert] = useState(null); // { type: 'success'|'error', message: '' }
    const [selectedProof, setSelectedProof] = useState(null); // URL gambar bukti

    const dropdownRef = useRef();

    // 1. Fetch Profile
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!ready) return;

            if (!isAuthenticated) {
                if (!cancelled) {
                    setProfile({});
                    setLoadingProfile(false);
                }
                return;
            }

            try {
                const res = await fetchMe();
                const user = res?.data?.user ?? res?.data ?? res;
                if (!cancelled) setProfile(user || {});
            } catch (err) {
                console.error("Failed fetch profile", err);
            } finally {
                if (!cancelled) setLoadingProfile(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [ready, isAuthenticated, fetchMe]);

    // 2. Fetch Pending Orders
    const fetchOrders = async () => {
        if (!isAuthenticated) return;
        setLoadingOrders(true);
        try {
            const res = await getPendingOrders();
            // Backend return: { status: true, message: "...", data: [...] }
            setOrders(res.data || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            // Sembunyikan error visual jika kosong, atau setAlert jika perlu
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (ready && isAuthenticated) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, isAuthenticated]);


    // Action Handlers
    const handleApprove = async (orderId) => {
        if (!window.confirm("Yakin ingin menyetujui pesanan ini?")) return;

        setActionLoading(orderId);
        try {
            await approveOrder(orderId);
            setAlert({ type: "success", message: "Pesanan berhasil disetujui!" });
            // Refresh data
            fetchOrders();
        } catch (err) {
            setAlert({ type: "error", message: err.message || "Gagal menyetujui pesanan" });
        } finally {
            setActionLoading(null);
            setTimeout(() => setAlert(null), 3000);
        }
    };

    const handleReject = async (orderId) => {
        const reason = window.prompt("Masukkan alasan penolakan (opsional):");
        if (reason === null) return; // Cancel

        setActionLoading(orderId);
        try {
            await rejectOrder(orderId, reason);
            setAlert({ type: "success", message: "Pesanan berhasil ditolak!" });
            fetchOrders();
        } catch (err) {
            setAlert({ type: "error", message: err.message || "Gagal menolak pesanan" });
        } finally {
            setActionLoading(null);
            setTimeout(() => setAlert(null), 3000);
        }
    };

    // Close Dropdown logic
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        function handleEsc(e) {
            if (e.key === "Escape") setShowDropdown(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const firstName = useMemo(
        () => (profile?.name || "Admin").split(" ")[0],
        [profile?.name]
    );

    // Filter Logic (Search by Name or Email)
    const filteredOrders = orders.filter((order) => {
        const query = searchTerm.toLowerCase();
        const userName = order.user?.name?.toLowerCase() || "";
        const userEmail = order.user?.email?.toLowerCase() || "";
        return userName.includes(query) || userEmail.includes(query);
    });

    if (loadingProfile) return <LoadingSpinner />;

    // Admin Menu Items
    const adminMenuItems = [
        { key: MENU.ORDERS, label: "Kelola Pesanan", icon: FileText }
    ];

    return (
        <div className="flex font-poppins h-screen w-screen overflow-hidden">
            {/* SIDEBAR */}
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                t={t}
                onGoLanding={() => navigate("/")}
                menuItems={adminMenuItems}
                title="Dashboard Admin"
                showBackToLanding={false}
            />

            {/* MAIN CONTENT */}
            <div
                className="flex-1 relative overflow-auto overflow-x-hidden"
                style={{ background: "linear-gradient(to right, #5CC9AF, #D7E96F)" }}
            >
                {/* Alert Toast */}
                {alert && (
                    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg font-medium animate-in fade-in slide-in-from-top-2 ${alert.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {alert.message}
                    </div>
                )}

                {/* Top Right Profile */}
                <div className="fixed top-2.5 right-6 md:right-8 z-50" ref={dropdownRef}>
                    <TopRightProfile
                        t={t}
                        profile={profile}
                        firstName={firstName}
                        language={i18n.language}
                        open={showDropdown}
                        onToggle={() => setShowDropdown((s) => !s)}
                        onShowProfile={() => {
                            setShowProfileModal(true);
                            setShowDropdown(false);
                        }}
                        showSettings={false}
                        onChangeLanguage={(lng) => {
                            i18n.changeLanguage(lng);
                        }}
                        onLogout={async () => {
                            try {
                                await logout();
                            } finally {
                                setShowDropdown(false);
                            }
                        }}
                    />
                </div>

                {/* --- PAGE CONTENT (ORDERS) --- */}
                {activeMenu === MENU.ORDERS && (
                    <div className="min-h-screen pt-20 px-8 pb-12">
                        {/* Title Section */}
                        <div className="mb-8 text-white">
                            <h1 className="text-3xl font-bold tracking-wide drop-shadow-sm">Kelola Pesanan</h1>
                            <p className="opacity-90 mt-1">Pantau dan kelola pesanan masuk.</p>
                        </div>

                        {/* White Card */}
                        <div className="bg-white rounded-[24px] shadow-lg p-6 min-h-[600px]">
                            {/* Header: Search + Refresh */}
                            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Cari pesanan (Nama/Email)..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5FCAAC]/30 transition-all text-gray-700 placeholder-gray-400 text-sm"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search size={18} />
                                    </div>
                                </div>
                                <button
                                    onClick={fetchOrders}
                                    className="text-sm text-[#5CC9AF] font-semibold hover:underline"
                                    disabled={loadingOrders}
                                >
                                    {loadingOrders ? "Memuat..." : "Muat Ulang"}
                                </button>
                            </div>

                            {/* TABLE */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#5FCAAC] text-white text-sm">
                                            <th className="py-3 px-4 text-center rounded-l-[12px] font-medium w-[60px]">No</th>
                                            <th className="py-3 px-4 text-left font-medium">Nama Pemesan</th>
                                            <th className="py-3 px-4 text-center font-medium">Status</th>
                                            <th className="py-3 px-4 text-center font-medium">Waktu</th>
                                            <th className="py-3 px-4 text-center font-medium">Bukti</th>
                                            <th className="py-3 px-4 text-center rounded-r-[12px] font-medium min-w-[180px]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {loadingOrders ? (
                                            <tr>
                                                <td colSpan="6" className="py-12 text-center text-gray-400">
                                                    Memuat data pesanan...
                                                </td>
                                            </tr>
                                        ) : filteredOrders.length > 0 ? (
                                            filteredOrders.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-4 text-center text-gray-600 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-4 px-4 text-left text-gray-800">
                                                        <div className="font-semibold">{item.user?.name || "Tanpa Nama"}</div>
                                                        <div className="text-xs text-gray-400">{item.user?.email}</div>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <StatusBadge status={item.status} />
                                                    </td>
                                                    <td className="py-4 px-4 text-center text-gray-500 text-xs">
                                                        {item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : "-"}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        {/* Bukti Transfer Button Updated */}
                                                        <PaymentProofButton
                                                            proofUrl={item.paymentProof?.imageUrl}
                                                            onView={(url) => setSelectedProof(url)}
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {item.status === "WAITING_CONFIRMATION" ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApprove(item.id)}
                                                                        disabled={actionLoading === item.id}
                                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#5FCAAC] text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${actionLoading === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                        <Check size={14} strokeWidth={3} />
                                                                        {actionLoading === item.id ? "..." : "Terima"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(item.id)}
                                                                        disabled={actionLoading === item.id}
                                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EF4444] text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${actionLoading === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                        <X size={14} strokeWidth={3} />
                                                                        {actionLoading === item.id ? "..." : "Tolak"}
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs italic">Selesai</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-12 text-center text-gray-400">
                                                    Tidak ada pesanan ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Profile */}
                {showProfileModal && (
                    <ProfileModal
                        profile={profile}
                        setProfile={setProfile}
                        onClose={() => setShowProfileModal(false)}
                    />
                )}

                {/* Modal Bukti Transfer */}
                {selectedProof && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedProof(null)}>
                        <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <X size={32} />
                            </button>
                            <img
                                src={selectedProof}
                                alt="Bukti Transfer"
                                className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain bg-white"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    alert("Gagal memuat gambar.");
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-components
function StatusBadge({ status }) {
    if (status === "PAID" || status === "Telah dikonfirmasi") {
        return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#D1FAE5] text-[#10B981]">Lunas</span>;
    }
    if (status === "WAITING_CONFIRMATION" || status === "Menunggu konfirmasi") {
        return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFEDD5] text-[#F97316]">Menunggu</span>;
    }
    if (status === "REJECTED") {
        return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Ditolak</span>;
    }
    return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{status}</span>;
}

function PaymentProofButton({ proofUrl, onView }) {
    if (!proofUrl) return <span className="text-gray-300 text-xs">-</span>;

    // Resolve absolute URL
    // Jika proofUrl sudah absolute, pakai langsung.
    // Jika tidak, gunakan VITE_API_BASE_URL. Tapi hati-hati:
    // Jika VITE_API_BASE_URL="/api", maka jadi "/api/uploads/..." -> Salah jika static file di root.
    // Kita asumsikan backend ada di localhost:3000 jika dev.

    let baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    // Hack: jika baseUrl adalah "/api" (dari default axios), kita ganti ke root localhost:3000
    if (baseUrl === "/api") {
        baseUrl = "http://localhost:3000";
    }

    // Normalisasi: Hapus trailing slash di baseUrl jika ada
    if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

    // CRITICAL FIX: Hapus suffix '/api' karena folder uploads ada di root server, bukan di dalam /api
    // Contoh: http://localhost:3000/api -> http://localhost:3000
    if (baseUrl.endsWith("/api")) {
        baseUrl = baseUrl.slice(0, -4);
    }

    // Normalisasi: Ganti backslash Windows (\) jadi forward slash (/)
    const rawPath = proofUrl.replace(/\\/g, "/");

    // Normalisasi: Ambil path relatif mulai dari 'uploads/'
    // Ini menangani kasus jika backend menyimpan absolute path (C:/Users/.../uploads/file.png)
    let cleanPath = rawPath;
    if (cleanPath.includes("uploads/")) {
        cleanPath = "/uploads/" + cleanPath.split("uploads/").pop();
    } else if (!cleanPath.startsWith("/")) {
        // Jika cuma filename, asumsikan ada di folder uploads
        cleanPath = "/uploads/" + cleanPath;
    }

    // Pastikan tidak double slash di awal
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

    const fullUrl = cleanPath.startsWith("http")
        ? cleanPath
        : `${baseUrl}${cleanPath}`;

    return (
        <button
            onClick={() => onView && onView(fullUrl)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 hover:text-[#5FCAAC] hover:border-[#5FCAAC] transition-all"
        >
            <Eye size={12} className="opacity-70" />
            Lihat
        </button>
    );
}
