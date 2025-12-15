import api from "../api/axios";

const handleError = (error, defaultMessage) => {
    throw new Error(
        error.response?.data?.message || error.message || defaultMessage
    );
};

// 1. Buat Manual Order
export const createManualOrder = async ({ planId, months }) => {
    try {
        const response = await api.post("/payments/manual/create-order", { planId, months });
        return response.data;
    } catch (error) {
        handleError(error, "Gagal membuat pesanan manual.");
    }
};

// 2. Upload Bukti Transfer
export const uploadPaymentProof = async (orderId, file, senderInfo = {}) => {
    try {
        const formData = new FormData();
        formData.append("buktiTransfer", file);
        if (senderInfo.senderBankName) formData.append("senderBankName", senderInfo.senderBankName);
        if (senderInfo.senderAccountName) formData.append("senderAccountName", senderInfo.senderAccountName);

        const response = await api.post(
            `/payments/manual/confirm-upload/${orderId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        handleError(error, "Gagal mengunggah bukti transfer.");
    }
};

// 3. Perpanjang Paket
export const extendPackage = async () => {
    try {
        const response = await api.post("/payments/subscription/extend");
        return response.data;
    } catch (error) {
        handleError(error, "Gagal memperpanjang paket.");
    }
};

// 4. Upgrade Paket
export const upgradePackage = async (targetPlanId) => {
    try {
        const response = await api.post("/payments/subscription/upgrade", { targetPlanId });
        return response.data;
    } catch (error) {
        handleError(error, "Gagal upgrade paket.");
    }
};

// 5. Batalkan Paket
export const cancelPackage = async () => {
    try {
        const response = await api.post("/payments/subscription/cancel");
        return response.data;
    } catch (error) {
        handleError(error, "Gagal membatalkan paket.");
    }
};
