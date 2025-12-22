import "dotenv/config";
import midtransClient from "midtrans-client";
import prisma from "../config/prisma.js";

import {
    resolveIsProduction,
    isValidMidtransSignature,
    buildChargeParams,
} from "../utils/midtrans.js";
import { generateOrderCode } from "../utils/ordercodegenerator.js";

// ================== KONFIGURASI GAMIFIKASI & EKONOMI ==================

// 1. REWARD (Pemasukan Poin) - Base Reward
// Sekitar 10% dari harga paket
const BASE_REWARD_POINTS = {
    BASIC: 4,       // 4 Poin (Match Frontend)
    PRO: 9,         // 9 Poin
    BUSINESS: 19,   // 19 Poin
    ENTERPRISE: 49  // 49 Poin
};

// 2. REDEEM (Pengeluaran Poin) - Harga Tukar
// Markup ~25% (Ratio Beli 12 : Gratis 1 untuk Newbie)
const POINT_EXCHANGE_PRICE = {
    BASIC: 25,
    PRO: 65,
    BUSINESS: 125,
    ENTERPRISE: 200
};

// Harga Paket Rupiah (Tetap)
const PLAN_PRICES = {
    BASIC: 49000,
    PRO: 99000,
    BUSINESS: 199000,
    ENTERPRISE: 499000,
};

const TAX_RATE = 0.11; // 11% PPN

// ================== HELPER INTERNAL ==================

async function getPriceAndDiscount(userId, planId) {
    let amount = PLAN_PRICES[planId];
    if (!amount) {
        const error = new Error("Invalid plan ID"); error.statusCode = 400; throw error;
    }
    const uid = Number(userId);
    if (!uid || Number.isNaN(uid)) {
        const error = new Error("Invalid user id"); error.statusCode = 400; throw error;
    }
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
        const error = new Error("User not found"); error.statusCode = 404; throw error;
    }

    // Diskon Uang (6%) jika pakai referral
    let isReferralDiscount = false;
    if (user.referredById && !user.isFirstPaymentDone) {
        amount = Math.round(amount * 0.94);
        isReferralDiscount = true;
    }
    return { amount, isReferralDiscount, user };
}

/**
 * LOGIKA INTI: Menghitung Multiplier Tier & Membagikan Poin
 * @param {number} userId - Penerima Poin
 * @param {string} planId - Paket yang dibeli
 * @param {string} source - Sumber ('SELF_CASHBACK' | 'REFERRAL_COMMISSION')
 * @param {object} prismaTx - Instance prisma transaction
 */
async function distributeRewardPoints(userId, planId, source, prismaTx, months = 1) {
    const db = prismaTx || prisma;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // 1. Ambil Base Reward
    const safePlanId = (planId || "").toUpperCase();
    const basePoint = BASE_REWARD_POINTS[safePlanId] || 0;

    console.log(`[DEBUG_POINTS] Plan: ${planId} -> Safe: ${safePlanId} | Base: ${basePoint} | Months: ${months}`);

    if (basePoint === 0) {
        console.warn(`[DEBUG_POINTS] ABORT: Base point is 0 for PlanID ${safePlanId}`);
        return;
    }

    // 2. Cek Tier Multiplier Berdasarkan Lifetime Points (XP)
    let multiplier = 1;
    const xp = user.lifetimePoints || 0;

    if (xp >= 200) multiplier = 4;       // LEGEND (4x)
    else if (xp >= 100) multiplier = 3;  // MASTER (3x)
    else if (xp >= 50) multiplier = 2;   // EXPERT (2x)
    else multiplier = 1;                 // NEWBIE (1x)

    console.log(`[DEBUG_POINTS] UserXP: ${xp} | Multiplier: ${multiplier}x | Duration: ${months} Bulan`);

    // 3. Hitung Total Poin (Base * Tier * Duration)
    const pointsEarned = basePoint * multiplier * months;

    // 4. Update Database
    await db.user.update({
        where: { id: userId },
        data: {
            pointBalance: { increment: pointsEarned },   // Dompet Belanja
            lifetimePoints: { increment: pointsEarned }, // XP Level
        }
    });

    console.log(`[GAMIFICATION] User ${userId} (${source}) | Tier ${multiplier}x | Duration ${months}mo | +${pointsEarned} Poin.`);
}

/* ===========================================================
 * BAGIAN 1: LOGIKA MIDTRANS SNAP
 * =========================================================== */

let snapInstance = null;
function getSnap() {
    if (snapInstance) return snapInstance;
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const clientKey = process.env.MIDTRANS_CLIENT_KEY?.trim();
    if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY is missing");
    const isProduction = resolveIsProduction(serverKey);
    snapInstance = new midtransClient.Snap({ isProduction, serverKey, clientKey });
    return snapInstance;
}

export const createTransactionService = async ({ userId, planId }) => {
    try {
        const { amount, isReferralDiscount, user } = await getPriceAndDiscount(userId, planId);
        // TODO: Apakah Snap perlu months dan tax? 
        // Saat ini Snap logic diasumsikan default 1 bulan untuk kode lama. 
        // Jika perlu update, harusnya juga menerima parameter months.
        // Namun user spesifik minta untuk 'manual order' popup yang salah harga.
        // Jadi kita fokus ke createManualOrderService.

        // Pajak untuk Snap? 
        // Jika kode lama tidak ada pajak, kita biarkan dulu kecuali user minta.
        // Biasanya Snap juga butuh, tapi kita fokus ke Manual sesuai request.

        const orderId = `CSAI-${planId}-${userId}-${Date.now()}`;
        const parameter = {
            transaction_details: { order_id: orderId, gross_amount: amount },
            item_details: [{
                id: planId,
                price: amount,
                quantity: 1,
                name: `Paket ${planId}${isReferralDiscount ? " (Diskon 6%)" : ""}`,
            }],
            customer_details: {
                first_name: user.name || "User",
                email: user.email || "",
                phone: user.phone || "",
            },
        };
        const snap = getSnap();
        const transaction = await snap.createTransaction(parameter);
        return transaction?.token;
    } catch (error) {
        console.error("Midtrans service error:", error);
        throw error;
    }
};

/**
 * Service khusus untuk Perpanjang Paket
 * Menggunakan plan saat ini milik user
 */
export const extendPackageService = async (userId) => {
    const uid = Number(userId);
    const user = await prisma.user.findUnique({ where: { id: uid } });

    if (!user || !user.plan) {
        const error = new Error("Anda belum berlangganan paket apapun.");
        error.statusCode = 400;
        throw error;
    }

    // Gunakan plan yang sedang aktif
    return await createTransactionService({ userId: uid, planId: user.plan });
};

/**
 * Service khusus untuk Upgrade Paket
 * Validasi bahwa targetPlan lebih mahal dari currentPlan
 */
export const upgradePackageService = async (userId, targetPlanId) => {
    const uid = Number(userId);
    const user = await prisma.user.findUnique({ where: { id: uid } });

    if (!user) {
        const error = new Error("User not found."); error.statusCode = 404; throw error;
    }

    const currentPlan = user.plan;
    const currentPrice = currentPlan ? (PLAN_PRICES[currentPlan] || 0) : 0;
    const targetPrice = PLAN_PRICES[targetPlanId];

    if (!targetPrice) {
        const error = new Error("Paket tujuan tidak valid."); error.statusCode = 400; throw error;
    }

    // Cek apakah ini benar-benar Upgrade (Harga paket tujuan > Harga paket sekarang)
    // Jika user belum punya paket (currentPrice 0), maka ini dianggap Upgrade/Beli Baru valid.
    if (targetPrice <= currentPrice) {
        const error = new Error("Paket tujuan harus lebih tinggi (Upgrade) dari paket saat ini.");
        error.statusCode = 400;
        throw error;
    }

    // Buat transaksi untuk paket baru
    return await createTransactionService({ userId: uid, planId: targetPlanId });
};

export const activateSubscriptionService = async (notification) => {
    try {
        const { order_id, transaction_status, fraud_status } = notification;

        if (!isValidMidtransSignature(notification)) {
            const error = new Error("Invalid signature"); error.statusCode = 403; throw error;
        }

        if ((transaction_status == "capture" && fraud_status == "accept") || transaction_status == "settlement") {

            const parts = String(order_id).split("-");
            const planId = parts[1];
            const uid = parseInt(parts[2], 10);
            if (!planId || !uid) throw new Error("Invalid orderId format");

            const userBeforeUpdate = await prisma.user.findUnique({ where: { id: uid } });
            if (!userBeforeUpdate) throw new Error("User not found");

            // Perpanjang / Aktifkan Paket
            let expiresAt = new Date();
            if (userBeforeUpdate.planExpiresAt && userBeforeUpdate.planExpiresAt > new Date()) {
                expiresAt = new Date(userBeforeUpdate.planExpiresAt);
            }
            expiresAt.setDate(expiresAt.getDate() + 30);

            const newPaidUser = await prisma.user.update({
                where: { id: uid },
                data: {
                    plan: planId,
                    planExpiresAt: expiresAt,
                    isFirstPaymentDone: true,
                },
            });
            console.log(`✅ Paket ${planId} aktif untuk User ${uid}`);

            // --- DISTRIBUSI POIN & REWARD ---
            // 1. Cashback ke Diri Sendiri
            await distributeRewardPoints(uid, planId, 'SELF_CASHBACK', prisma);

            // 2. Komisi ke Referrer (Jika ada)
            if (newPaidUser.referredById) {
                await distributeRewardPoints(newPaidUser.referredById, planId, 'REFERRAL_COMMISSION', prisma);
            }
        }
    } catch (error) {
        console.error("Failed to activate subscription:", error);
        throw error;
    }
};

/* ===========================================================
 * BAGIAN 2: LOGIKA MIDTRANS CORE API
 * =========================================================== */
let coreApiInstance = null;
function getCoreApi() {
    if (coreApiInstance) return coreApiInstance;
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const isProduction = resolveIsProduction(serverKey);
    coreApiInstance = new midtransClient.CoreApi({ isProduction, serverKey });
    return coreApiInstance;
}
export const chargeCoreApiService = async (body) => {
    const params = buildChargeParams(body);
    const coreApi = getCoreApi();
    const result = await coreApi.charge(params);
    return { order_id: params.transaction_details.order_id, ...result };
};
export const checkCoreApiStatusService = async (orderId) => {
    const coreApi = getCoreApi();
    return await coreApi.transaction.status(orderId);
};
export const handleCoreApiWebhookService = async (notification) => {
    if (!isValidMidtransSignature(notification)) throw new Error("Invalid signature");
    const coreApi = getCoreApi();
    await coreApi.transaction.status(notification.order_id);
    return true;
};

/* ===========================================================
 * BAGIAN 3: MANUAL TRANSFER
 * =========================================================== */

export const createManualOrderService = async ({ userId, planId, months = 1 }) => {
    try {
        // 1. Dapatkan harga dasar (sudah termasuk diskon referral jika ada)
        const { amount: unitPrice, isReferralDiscount, user } = await getPriceAndDiscount(userId, planId);

        // 2. Hitung harga total berdasarkan durasi (bulan)
        const subtotal = unitPrice * months;

        // 3. Tambahkan Pajak (11%)
        const tax = Math.round(subtotal * TAX_RATE);

        // 4. Hitung Total Amount (Subtotal + Tax)
        const totalAmount = subtotal + tax;

        // 5. Generate Kode Unik
        const orderCode = await generateOrderCode(planId);
        const paymentUniqueCode = Math.floor(100 + Math.random() * 900);

        // 6. Final Amount (Total + Unique Code)
        const finalAmount = totalAmount + paymentUniqueCode;

        if (!["BASIC", "PRO", "BUSINESS", "ENTERPRISE"].includes(planId)) {
            const error = new Error("Invalid Plan ID"); error.statusCode = 400; throw error;
        }

        const newOrder = await prisma.order.create({
            data: {
                orderCode,
                userId: user.id,
                planId,
                status: "PENDING",
                totalAmount: totalAmount, // Simpan total yang sudah kena pajak
                uniqueCode: paymentUniqueCode,
                finalAmount,
                isReferralUsed: isReferralDiscount,
                // TODO: Simpan 'months' jika ada kolomnya di DB, 
                // tapi user tidak minta ubah schema prisma, jadi kita biarkan.
            },
            select: { id: true, orderCode: true, finalAmount: true },
        });

        return {
            orderId: newOrder.id,
            orderCode: newOrder.orderCode,
            finalAmount: newOrder.finalAmount,
            bankDetails: {
                bankName: "Bank Kaltimtara",
                accountNumber: "2187000222",
                accountName: "PT. CS AI INDONESIA",
            },
            message: `Order ${orderCode} created. Please pay exactly ${finalAmount}.`,
        };
    } catch (error) {
        console.error("Failed to create manual order:", error); throw error;
    }
};

export const confirmManualPaymentUploadService = async ({
    orderId, userId, senderBankName, senderAccountName, imageUrl,
}) => {
    const oid = Number(orderId);
    const uid = Number(userId);

    const order = await prisma.order.findUnique({ where: { id: oid } });
    if (!order) { const error = new Error("Order not found."); error.statusCode = 404; throw error; }
    if (order.userId !== uid) { const error = new Error("Unauthorized."); error.statusCode = 403; throw error; }
    if (order.status !== "PENDING") { const error = new Error("Order not pending."); error.statusCode = 400; throw error; }

    await prisma.$transaction(async (tx) => {
        await tx.paymentProof.create({
            data: { orderId: oid, imageUrl, senderBankName: senderBankName || "N/A", senderAccountName: senderAccountName || "N/A" },
        });
        await tx.order.update({
            where: { id: oid }, data: { status: "WAITING_CONFIRMATION" },
        });
    });
    return true;
};

/* ===========================================================
 * BAGIAN 4: ADMIN APPROVAL (FITUR BARU)
 * =========================================================== */

/**
 * Admin Menyetujui Order Manual (Status -> PAID & Kirim Poin)
 */
export const approveManualOrderService = async (orderId) => {
    console.log("[PAYMENT] approveManualOrderService executing (Updated Logic)...");
    const oid = Number(orderId);

    // 1. Cek Order
    const order = await prisma.order.findUnique({ where: { id: oid } });
    if (!order) throw new Error("Order tidak ditemukan.");

    if (order.status === "PAID") throw new Error("Order ini sudah lunas (PAID).");
    if (order.status === "CANCELLED") throw new Error("Order ini sudah dibatalkan.");

    // 2. Eksekusi: Update Order, User, dan Bagi Poin
    await prisma.$transaction(async (tx) => {
        // A. Update Status Order jadi PAID
        await tx.order.update({
            where: { id: oid },
            data: { status: "PAID" }
        });

        // B. Aktifkan Paket User
        const user = await tx.user.findUnique({ where: { id: order.userId } });

        let newExpiry = new Date();
        if (user.planExpiresAt && user.planExpiresAt > new Date()) {
            newExpiry = new Date(user.planExpiresAt);
        }
        // --- LOGIKA BARU: HITUNG DURASI BERDASARKAN TOTAL BAYAR ---
        // Rumus: Total = (HargaBasis * Bulan) + PPN 11%
        // Maka:  Bulan = Total / (HargaBasis * 1.11)

        let monthDuration = 1; // Default

        // 1. Ambil harga dasar paket (Safety: Force Uppercase)
        const planKey = (order.planId || "").toUpperCase();
        let basePrice = PLAN_PRICES[planKey];

        // [DEBUG LOG START]
        console.log("=== DEBUG APPROVE ORDER ===");
        console.log("Order ID:", order.id);
        console.log("Plan Key:", planKey);
        console.log("Base Price:", basePrice);
        console.log("Total Amount (DB):", order.totalAmount);
        console.log("Final Amount (DB):", order.finalAmount);
        // [DEBUG LOG END]

        if (basePrice) {
            // 2. Cek apakah kena diskon referral (6%)
            if (order.isReferralUsed) {
                basePrice = Math.round(basePrice * 0.94);
            }

            // 3. Hitung estimasi bulan menggunakan TotalAmount atau FinalAmount
            let amountForCalc = Number(order.totalAmount);
            if (!amountForCalc && order.finalAmount) {
                amountForCalc = Number(order.finalAmount);
            }

            if (amountForCalc) {
                // --- LOGIKA BUCKET MATCHING (LEBIH AMAN) ---
                // Cek apakah amount mendekati harga 12, 6, 3, atau 1 bulan
                const possibleMonths = [12, 6, 3, 1];
                let bestMatch = 1;
                let minDiff = Infinity;

                for (const m of possibleMonths) {
                    const subtotal = basePrice * m;
                    const tax = Math.round(subtotal * TAX_RATE);
                    const expectedTotal = subtotal + tax;

                    // Kita bandingkan selisih absolut
                    // Toleransi 2000 rupiah (untuk cover unique code 0-999 dan sedikit noise)
                    const diff = Math.abs(amountForCalc - expectedTotal);

                    console.log(`[DEBUG MATCH] Month: ${m} | Base: ${basePrice} | Tax: ${tax} | ExpTotal: ${expectedTotal} | Act: ${amountForCalc} | Diff: ${diff}`);

                    if (diff < 2000 && diff < minDiff) {
                        minDiff = diff;
                        bestMatch = m;
                        console.log(`[DEBUG MATCH] Found closer match: ${m} Months (Diff: ${diff})`);
                    }
                }

                // Fallback jika tidak ada yang match (sangat aneh), gunakan rumus lama atau default 1
                if (minDiff === Infinity) {
                    console.warn(`[APPROVE] No bucket match found for amount ${amountForCalc}. Fallback to division.`);
                    const divisor = basePrice * (1 + TAX_RATE);
                    const rawMonths = amountForCalc / divisor;
                    bestMatch = Math.round(rawMonths) || 1;
                }

                monthDuration = bestMatch;
                console.log(`[APPROVE] Plan: ${planKey} | Total: ${amountForCalc} | Matched Duration: ${monthDuration} Bulan`);

            } else {
                console.log(`[APPROVE] Order ${order.orderCode} | No Amount Found | Defaulting to 1 Month`);
            }
        } else {
            console.error(`[APPROVE] Plan ID '${order.planId}' (Key: ${planKey}) NOT FOUND in prices. Defaulting to 1 month.`);
        }

        // Tambah durasi sesuai bulan yang dibayar (30 hari per bulan)
        newExpiry.setDate(newExpiry.getDate() + (monthDuration * 30));

        const updatedUser = await tx.user.update({
            where: { id: order.userId },
            data: {
                plan: order.planId,
                planExpiresAt: newExpiry,
                isFirstPaymentDone: true
            }
        });

        // C. === BAGI-BAGI POIN (GAMIFIKASI) ===
        // C. === BAGI-BAGI POIN (GAMIFIKASI) ===
        // 1. Poin Cashback Diri Sendiri (Dikali Durasi)
        await distributeRewardPoints(order.userId, order.planId, 'SELF_CASHBACK', tx, monthDuration);

        // 2. Poin Referral (Dikali Durasi juga biar fair)
        if (updatedUser.referredById) {
            await distributeRewardPoints(updatedUser.referredById, order.planId, 'REFERRAL_COMMISSION', tx, monthDuration);
        }
    });

    return { message: "Order disetujui. Status PAID. Poin telah dikirim." };
};

/* ===========================================================
 * BAGIAN 5: STOP SUBSCRIPTION & REDEEM POINTS
 * =========================================================== */

export const stopSubscriptionService = async (userId) => {
    const uid = Number(userId);
    const user = await prisma.user.findUnique({
        where: { id: uid },
        select: { id: true, plan: true, planExpiresAt: true, autoRenew: true }
    });

    if (!user || !user.plan || !user.planExpiresAt) {
        const error = new Error("Anda tidak memiliki langganan aktif."); error.statusCode = 400; throw error;
    }

    await prisma.user.update({
        where: { id: uid }, data: { autoRenew: false }
    });

    const expiryDate = new Date(user.planExpiresAt).toLocaleDateString("id-ID", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    return { status: true, message: `Auto-renew mati. Paket ${user.plan} aktif hingga ${expiryDate}.` };
};

export const redeemPointService = async ({ userId, planId }) => {
    const uid = Number(userId);
    const pointCost = POINT_EXCHANGE_PRICE[planId];

    // 1. Validasi Paket & Cost
    if (!pointCost) {
        const error = new Error("Paket tidak valid."); error.statusCode = 400; throw error;
    }

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) throw new Error("User not found.");

    // 2. Cek Saldo
    if (user.pointBalance < pointCost) {
        const error = new Error(`Poin tidak cukup. Butuh ${pointCost}, Saldo Anda: ${user.pointBalance}.`);
        error.statusCode = 400; throw error;
    }

    // 3. Eksekusi Transaksi (Atomic)
    await prisma.$transaction(async (tx) => {
        // A. Kurangi Poin
        await tx.user.update({
            where: { id: uid },
            data: { pointBalance: { decrement: pointCost } }
        });

        // B. Aktifkan Paket (30 Hari)
        let newExpiry = new Date();
        if (user.planExpiresAt && user.planExpiresAt > new Date()) {
            newExpiry = new Date(user.planExpiresAt);
        }
        newExpiry.setDate(newExpiry.getDate() + 30);

        // C. Update User
        await tx.user.update({
            where: { id: uid },
            data: {
                plan: planId,
                planExpiresAt: newExpiry,
                isFirstPaymentDone: true,
            }
        });
    });

    return {
        message: `Berhasil menukar ${pointCost} Poin dengan paket ${planId}.`,
        remainingPoints: user.pointBalance - pointCost
    };
};
