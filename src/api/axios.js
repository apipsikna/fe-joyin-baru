// src/api/axios.js
import axios from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  "/api";

console.log("🚀 Axios baseURL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // kirim cookie HttpOnly (refresh)
});

// aktifkan header ngrok hanya jika baseURL memang ngrok
if (/ngrok-free\.app|ngrok\.io/i.test(API_BASE_URL)) {
  api.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
}

// bootstrap Authorization dari localStorage (agar reload tetap logged-in)
try {
  const boot = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (boot) api.defaults.headers.common.Authorization = `Bearer ${boot}`;
} catch { /* ignore */ }

// ====== Token helpers (di-bind oleh AuthContext) ======
let getAccessToken = () => null;
let _setAccessToken = (_t) => {};

export const bindAccessTokenFns = (getFn, setFn) => {
  getAccessToken = getFn;
  _setAccessToken = setFn;
};

// ====== REQUEST: injeksikan Bearer token (kecuali /auth/refresh) ======
api.interceptors.request.use((config) => {
  const url = (config.url || "").toLowerCase();
  const isRefresh = url.includes("/auth/refresh");
  const token = getAccessToken();
  if (token && !isRefresh) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ====== RESPONSE: auto-refresh token pada 401 (bukan untuk /auth/refresh) ===
let refreshingPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error?.response?.status;
    const url = (original.url || "").toLowerCase();
    const isRefresh = url.includes("/auth/refresh");

    // jangan auto-refresh untuk /auth/refresh, atau kalau sudah retry, atau bukan 401
    if (status !== 401 || isRefresh || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshingPromise) {
        // panggil refresh TANPA Authorization (sudah dicegah di request interceptor)
        refreshingPromise = api
          .post("/auth/refresh")
          .then((r) => r.data?.accessToken)
          .finally(() => {
            refreshingPromise = null;
          });
      }

      const newAccess = await refreshingPromise;
      if (!newAccess) throw new Error("No accessToken from refresh");

      // update token global + header default
      try { _setAccessToken(newAccess); } catch {}
      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

      // ulang request awal
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api.request(original);
    } catch (e) {
      // pastikan token & header dibersihkan ketika refresh gagal
      try { localStorage.removeItem("accessToken"); } catch {}
      try { _setAccessToken(""); } catch {}
      delete api.defaults.headers.common.Authorization;
      return Promise.reject(e);
    }
  }
);

export default api;
