import { useState, useEffect, useMemo } from "react";

function buildApiUrl(base, path) {
    const cleanBase = String(base || "").replace(/\/+$/, "");
    if (cleanBase.endsWith("/api")) return `${cleanBase}${path}`;
    return `${cleanBase}/api${path}`;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const REFERRAL_ME_URL = buildApiUrl(API_BASE, "/referrals/me");

export function useReferralCode(profile) {
    const [data, setData] = useState({
        code: "",
        totalReferred: 0,
        loading: false,
        error: null,
    });

    // Ambil dari profile dulu sebagai fallback/initial
    const profileCode = useMemo(() => {
        return profile?.referralCode || profile?.refCode || profile?.referral?.code || "";
    }, [profile]);

    useEffect(() => {
        // Kalau sudah ada di profile, mungkin cukup? 
        // Tapi sebaiknya fetch biar fresh, siapa tahu profile object belum update.

        // Cek auth token
        const token =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("access_token");

        if (!token) return; // Belum login / gak bisa fetch

        const fetchCode = async () => {
            setData((prev) => ({ ...prev, loading: true }));
            try {
                const res = await fetch(REFERRAL_ME_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    // Silent fail atau log error, tapi jangan crash
                    throw new Error("Failed to fetch referral");
                }

                const json = await res.json();
                const serverCode = json?.data?.myReferralCode || "";
                const total = Number(json?.data?.totalReferred || 0);

                setData({
                    code: serverCode,
                    totalReferred: total,
                    loading: false,
                    error: null
                });
            } catch (err) {
                setData((prev) => ({ ...prev, loading: false, error: err.message }));
            }
        };

        fetchCode();
    }, [profileCode]);

    // Prioritas: Data dari server > Data dari profile
    const finalCode = data.code || profileCode;

    return {
        referralCode: finalCode,
        totalReferred: data.totalReferred,
        loading: data.loading,
        error: data.error
    };
}
