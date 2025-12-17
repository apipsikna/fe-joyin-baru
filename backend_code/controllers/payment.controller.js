import {
    createTransactionService,
    activateSubscriptionService,
    // --- LAYANAN CORE API ---
    chargeCoreApiService,
    checkCoreApiStatusService,
    handleCoreApiWebhookService,

    // --- LAYANAN UNTUK MANUAL ---
    createManualOrderService,
    confirmManualPaymentUploadService,
    approveManualOrderService, // ✅ BARU: Import service approval

    // --- LAYANAN SUBSCRIPTION & LOYALTY ---
    stopSubscriptionService,
    redeemPointService,       // Layanan Tukar Poin

    // --- LAYANAN BARU (PERPANJANG & UPGRADE) ---
    extendPackageService,
    upgradePackageService,

} from "../services/payment.service.js";

/* ===========================================================
 * KONTROLER UNTUK MIDTRANS SNAP
 * =========================================================== */

export const createSnapPayment = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { planId } = req.body;

        if (!planId) {
            return res.status(400).json({
                status: false,
                message: "planId is required",
            });
        }

        const token = await createTransactionService({ userId, planId });

        res.status(201).json({
            status: true,
            message: "Transaction created successfully",
            data: {
                transaction_token: token,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

export const handleSnapNotification = async (req, res) => {
    try {
        const notification = req.body;
        await activateSubscriptionService(notification);
        res.status(200).json({ status: "ok" });
    } catch (error) {
        console.error("Error handling Midtrans notification:", error);
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
};


/* ===========================================================
 * KONTROLER UNTUK MIDTRANS CORE API
 * =========================================================== */

export const handleCoreApiCharge = async (req, res) => {
    try {
        const result = await chargeCoreApiService(req.body);
        res.status(201).json({
            ok: true,
            message: "Charge request successful",
            result
        });
    } catch (err) {
        console.error("[Controller /core/charge] Error:", err.message);
        res.status(err.statusCode || 400).json({
            ok: false,
            message: err.message || "Charge error"
        });
    }
};

export const handleCoreApiStatusCheck = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ ok: false, message: "orderId is required" });
        }
        const status = await checkCoreApiStatusService(orderId);
        res.status(200).json({ ok: true, status });
    } catch (err) {
        console.error("[Controller /core/status] Error:", err.message);
        res.status(err.statusCode || 400).json({
            ok: false,
            message: err.message || "Status error"
        });
    }
};

export const handleCoreApiWebhook = async (req, res) => {
    try {
        const notification = req.body;
        await handleCoreApiWebhookService(notification);
        res.status(200).json({ ok: true, received: true });
    } catch (err) {
        console.error("[Controller /core/webhook] Error:", err.message);
        res.status(err.statusCode || 500).json({
            ok: false,
            message: err.message || "Webhook error"
        });
    }
};


/* ===========================================================
 * KONTROLER UNTUK TRANSFER MANUAL
 * =========================================================== */

/**
 * Membuat pesanan manual baru
 */
export const createManualOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { planId, months } = req.body; // ✅ Added months

        if (!planId) {
            return res.status(400).json({
                status: false,
                message: "planId is required",
            });
        }

        // Pass months to service (default to 1 if not present)
        const orderDetails = await createManualOrderService({
            userId,
            planId,
            months: months ? Number(months) : 1
        });

        res.status(201).json({
            status: true,
            message: "Manual order created successfully. Waiting for payment.",
            data: orderDetails,
        });

    } catch (error) {
        console.error("[Controller /manual/create-order] Error:", error);
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

/**
 * Menangani upload bukti transfer manual
 */
export const confirmManualPaymentUpload = async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        const userId = req.user?.id;

        const { senderBankName, senderAccountName } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Bukti transfer (gambar) wajib diunggah.",
            });
        }

        const imageUrl = req.file.path.replace(/\\/g, "/");

        await confirmManualPaymentUploadService({
            orderId,
            userId,
            senderBankName,
            senderAccountName,
            imageUrl,
        });

        res.status(201).json({
            status: true,
            message: "Payment proof uploaded. Waiting for admin verification.",
        });

    } catch (error) {
        console.error("[Controller /manual/confirm-upload] Error:", error);
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

/**
 * ADMIN APPROVE (Manual Transfer)
 * Mengubah status jadi PAID dan mengirimkan POIN
 */
export const approveManualOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ status: false, message: "Order ID wajib diisi." });
        }

        const result = await approveManualOrderService(orderId);

        return res.status(200).json({
            status: true,
            message: result.message
        });
    } catch (error) {
        console.error("[Controller] Approve Order Error:", error.message);
        return res.status(error.statusCode || 500).json({ status: false, message: error.message });
    }
};


/* ===========================================================
 * KONTROLER BARU: SUBSCRIPTION & LOYALTY
 * =========================================================== */

/**
 * Berhenti Langganan (POST)
 * Body: {} (Kosong)
 */
export const stopSubscription = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await stopSubscriptionService(userId);
        return res.status(200).json({ status: true, message: result.message });
    } catch (error) {
        console.error("[Controller] Stop Subscription Error:", error.message);
        return res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

/**
 * Tukar Poin dengan Paket (POST)
 * Body: { "planId": "BASIC" }
 */
export const redeemPoints = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { planId } = req.body;

        if (!planId) {
            return res.status(400).json({
                status: false,
                message: "Plan ID wajib diisi untuk penukaran poin.",
            });
        }

        const result = await redeemPointService({ userId, planId });

        return res.status(200).json({
            status: true,
            message: result.message,
            data: result
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

/**
 * Perpanjang Paket (POST)
 * Menggunakan plan saat ini
 */
export const extendPackage = async (req, res) => {
    try {
        const userId = req.user?.id;
        const token = await extendPackageService(userId);

        res.status(200).json({
            status: true,
            message: "Transaksi perpanjangan paket berhasil dibuat",
            data: { transaction_token: token }
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

/**
 * Upgrade Paket (POST)
 * Body: { "targetPlanId": "PRO" }
 */
export const upgradePackage = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { targetPlanId } = req.body;

        if (!targetPlanId) {
            return res.status(400).json({ status: false, message: "Target Plan ID required" });
        }

        const token = await upgradePackageService(userId, targetPlanId);

        res.status(200).json({
            status: true,
            message: "Transaksi upgrade paket berhasil dibuat",
            data: { transaction_token: token }
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};

/**
 * Batalkan Paket (POST)
 * Alias untuk stopSubscriptionService tapi dengan pesan 'Dibatalkan'
 */
export const cancelPackage = async (req, res) => {
    try {
        const userId = req.user?.id;
        await stopSubscriptionService(userId);

        res.status(200).json({
            status: true,
            message: "Paket berhasil dibatalkan (Auto-renew dimatikan)."
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Internal server error",
        });
    }
};
