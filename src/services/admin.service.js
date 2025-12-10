import api from "../api/axios";

// Helper untuk menghandle error umum
const handleError = (error, defaultMessage) => {
    throw new Error(
        error.response?.data?.message || error.message || defaultMessage
    );
};

// 1. Ambil semua pesanan pending
export const getPendingOrders = async () => {
    try {
        const response = await api.get("/admin/orders/pending");
        // Asumsi response backend: { status: true, message: "...", data: [...] }
        return response.data;
    } catch (error) {
        handleError(error, "Gagal mengambil data pesanan.");
    }
};

// 2. Approve Pesanan (Manual Transfer)
// Endpoint: POST /payment/manual/approve (sesuai backend user)
// Body: { orderId: 123 }
export const approveOrder = async (orderId) => {
    try {
        // Perhatikan URL prefix '/payment' (asumsi payment.routes.js di-mount di /payment atau /api/payment)
        // Jika nanti 404, coba check apakah mount path-nya '/api/payment'
        const response = await api.post(`/payments/manual/approve`, { orderId });
        return response.data;
    } catch (error) {
        handleError(error, "Gagal menyetujui pesanan.");
    }
};

// 3. Reject Pesanan (Opsional: Butuh alasan?)
export const rejectOrder = async (orderId, reason = "") => {
    try {
        const response = await api.post(`/admin/orders/${orderId}/reject`, { reason });
        return response.data;
    } catch (error) {
        handleError(error, "Gagal menolak pesanan.");
    }
};
