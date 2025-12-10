import { useState, useEffect, useCallback } from "react";
import api from "../api/axios"; // ✅ Use configured API
import { useAuth } from "../contexts/AuthContext";

export function useLoyalty() {
    const { token, isAuthenticated } = useAuth();
    const [data, setData] = useState({
        pointBalance: 0,
        lifetimePoints: 0, // XP
        referralCode: "",
        totalReferrals: 0,
        referralList: [],
        level: "Newbie",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLoyaltyData = useCallback(async () => {
        // If not authenticated, we can't fetch strictly private data, 
        // but we might want to allow it to run and fail gracefully if the token is just missing momentarily
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            // Mengambil data referral & loyalty dari backend
            const res = await api.get("/referrals/me");

            // Flexible handling for response structure (e.g. res.data or res.data.data)
            const refData = res.data?.data || res.data || {};

            // MAPPING DATA
            const points = Number(refData.pointBalance || refData.points || 0);
            const xp = Number(refData.lifetimePoints || refData.xp || 0); // XP usually same as lifetime points

            // Referral Code retrieval
            const myRefCode = refData.referralCode || refData.myReferralCode || refData.code || "";

            // Referral List retrieval
            const rawList = refData.referrals || refData.referralList || [];
            const list = Array.isArray(rawList) ? rawList : [];

            setData({
                pointBalance: points,
                lifetimePoints: xp,
                referralCode: myRefCode,
                totalReferrals: list.length, // Or use refData.totalReferrals if available
                referralList: list,
                level: refData.level || "Newbie" // Backend might calculate level, or we do it in FE
            });

        } catch (err) {
            console.error("Failed to fetch loyalty data:", err);
            // Handle specific errors if needed
            setError(err?.response?.data?.message || "Gagal memuat data loyalty");
        } finally {
            setLoading(false);
        }
    }, [token, isAuthenticated]);

    const checkPendingTransaction = useCallback(async () => {
        if (!isAuthenticated) return;
        const pendingOrder = localStorage.getItem("pending_payment_order_id");
        if (!pendingOrder) return;

        try {
            // Cek status ke backend
            const res = await api.get(`/payments/core/status/${pendingOrder}`);
            const json = res.data;

            if (json?.ok) {
                const st = json.status?.transaction_status;

                // Jika sukses (settlement/capture), trigger bonus
                if (st === "capture" || st === "settlement") {
                    console.log("✅ Recovering pending transaction:", pendingOrder);

                    // Ambil referral code dari storage jika ada (optional)
                    const refCode = localStorage.getItem("signup_referral_code") || "";

                    await api.post("/referrals/complete-first-purchase", {
                        orderId: pendingOrder,
                        referralCode: refCode
                    });

                    // Clear pending
                    localStorage.removeItem("pending_payment_order_id");
                    localStorage.removeItem("signup_referral_code");

                    // Refresh data
                    fetchLoyaltyData();
                }
                // Jika gagal/expire, bersihkan saja
                else if (st === "deny" || st === "cancel" || st === "expire") {
                    localStorage.removeItem("pending_payment_order_id");
                }
            }
        } catch (e) {
            // Suppress 400/404 errors as they are expected for temp/invalid IDs
            if (e.response && (e.response.status === 400 || e.response.status === 404)) {
                return;
            }
            console.warn("Failed to check pending transaction:", e);
        }
    }, [isAuthenticated, fetchLoyaltyData]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchLoyaltyData();
            checkPendingTransaction();
        }
    }, [fetchLoyaltyData, checkPendingTransaction, isAuthenticated]);

    // Expose refetch so components can manually trigger update after an action
    return {
        ...data,
        loading,
        error,
        refetch: fetchLoyaltyData,
        checkPendingTransaction // ✅ Expose for manual trigger
    };
}
