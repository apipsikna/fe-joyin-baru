// src/utils/avatar.js

// Biasanya: "http://localhost:3000/api"
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// BASE untuk file statis (tanpa /api di belakang)
// "http://localhost:3000/api" -> "http://localhost:3000"
export const FILE_BASE =
  (API_BASE && API_BASE.replace(/\/api\/?$/, "")) || API_BASE || "";

// Pastikan ada file ini di public/default-avatar.png
export const DEFAULT_AVATAR = "/default-avatar.png";

export const resolveAvatarUrl = (avatar) => {
  // Kalau belum ada avatar → pakai default
  if (!avatar || typeof avatar !== "string") return DEFAULT_AVATAR;

  // Kalau sudah full URL (Cloudinary, dsb)
  if (avatar.startsWith("http")) return avatar;

  // Kalau BE simpan "/uploads/xxx.jpg"
  if (avatar.startsWith("/uploads")) {
    return `${FILE_BASE}${avatar}`; // -> http://localhost:3000/uploads/xxx.jpg
  }

  // Kalau cuma nama file
  return `${FILE_BASE}/uploads/${avatar}`;
};
