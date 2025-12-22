// Utility untuk menghitung durasi langganan (Native JS, tanpa dependency)
export const formatSubscriptionDuration = (startDate, endDate) => {
    try {
        if (!startDate || !endDate) return "-";

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";
        if (end < start) return "0 Hari";

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        // Adjust negative days
        if (days < 0) {
            months--;
            // Get days in previous month
            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // Adjust negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        const parts = [];
        if (years > 0) parts.push(`${years} Tahun`);
        if (months > 0) parts.push(`${months} Bulan`);

        // Tampilkan hari hanya jika kurang dari 1 bulan dan tidak ada tahun/bulan
        if (years === 0 && months === 0) {
            if (days >= 0) parts.push(`${days} Hari`);
        } else if (days > 0) {
            // Jika sudah ada bulan/tahun, hari ditampilkan opsional (di sini kita tampilkan untuk detail)
            parts.push(`${days} Hari`);
        }

        if (parts.length === 0) return "0 Hari";

        return parts.join(" ");
    } catch (err) {
        console.error("Error formatting duration:", err);
        return "-";
    }
};
