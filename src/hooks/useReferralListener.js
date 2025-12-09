import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REFERRAL_STORAGE_KEY = "signup_referral_code";

export function useReferralListener() {
    const location = useLocation();

    useEffect(() => {
        // Cek apakah ada query param ?ref=...
        const qp = new URLSearchParams(location.search);
        const ref = qp.get("ref");

        if (ref) {
            const cleanRef = ref.trim().toUpperCase().replace(/\s+/g, "");
            if (cleanRef) {
                // Simpan ke localStorage agar bisa diambil oleh SignUp.jsx nanti
                localStorage.setItem(REFERRAL_STORAGE_KEY, cleanRef);
            }
        }
    }, [location.search]);
}
