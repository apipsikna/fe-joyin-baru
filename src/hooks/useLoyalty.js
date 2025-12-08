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
        if (!isAuthenticated) return; // Token is handled by api instance, but check auth state

        setLoading(true);
        setError(null);
        try {
            // Panggil endpoint existing. Asumsi BE akan menambahkan field points/xp di sini.
            // Jika belum ada, kita fallback ke 0 atau mock logic sementara.
            const res = await api.get("/referrals/me"); // ✅ Use api instance, remove /api prefix if base has it, usually base is http://.../api

            const refData = res.data?.data || res.data;

            // MAPPING DATA
            // Backend mungkin mengirim: { referralCode, referrals: [...], points: ..., xp: ... }
            // Kita siapkan fallback jika field points belum ada di backend.

            const points = refData.points !== undefined ? refData.points : (refData.pointBalance || 0); // Cari field points
            const xp = refData.xp !== undefined ? refData.xp : (refData.lifetimePoints || 0);

            setData({
                pointBalance: points,
                lifetimePoints: xp,
                referralCode: refData.referralCode || refData.myReferralCode || "", // ✅ Added myReferralCode check
                totalReferrals: Array.isArray(refData.referrals) ? refData.referrals.length : (refData.totalReferrals || 0),
                referralList: Array.isArray(refData.referrals) ? refData.referrals : [],
                // Level bisa dihitung di frontend based on XP, atau dari backend
                level: refData.level || "Newbie"
            });

        } catch (err) {
            console.error("Failed to fetch loyalty data:", err);
            // Jika error 404/500, jangan crash page, cukup set error state.
            // Mungkin user belum punya referral data.
            setError(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [token, isAuthenticated]);

    useEffect(() => {
        fetchLoyaltyData();
    }, [fetchLoyaltyData]);

    return { ...data, loading, error, refetch: fetchLoyaltyData };
}
