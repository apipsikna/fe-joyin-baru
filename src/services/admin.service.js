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

// 1b. Ambil SEMUA pesanan (pending & paid)
export const getAllOrders = async () => {
    try {
        // Coba endpoint ini, jika 404 kita akan tangani nanti
        const response = await api.get("/admin/orders");
        return response.data;
    } catch (error) {
        handleError(error, "Gagal mengambil semua data pesanan.");
    }
};

// 2. Approve Pesanan (Manual Transfer)
// Endpoint: POST /admin/orders/:orderId/approve
export const approveOrder = async (orderId) => {
    try {
        const response = await api.post(`/admin/orders/${orderId}/approve`, {});
        return response.data;
    } catch (error) {
        handleError(error, "Gagal menyetujui pesanan.");
    }
};

// 3. Reject Pesanan (Opsional: Butuh alasan?)
// Endpoint: POST /admin/orders/:orderId/reject
export const rejectOrder = async (orderId, reason = "") => {
    try {
        const response = await api.post(`/admin/orders/${orderId}/reject`, { reason });
        return response.data;
    } catch (error) {
        handleError(error, "Gagal menolak pesanan.");
    }
};
