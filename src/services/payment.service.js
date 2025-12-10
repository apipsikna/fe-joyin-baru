import api from "../api/axios";

const handleError = (error, defaultMessage) => {
    throw new Error(
        error.response?.data?.message || error.message || defaultMessage
    );
};

// 1. Buat Manual Order
export const createManualOrder = async ({ planId }) => {
    try {
        const response = await api.post("/payments/manual/create-order", { planId });
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
