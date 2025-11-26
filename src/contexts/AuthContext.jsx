// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api, { bindAccessTokenFns } from "../api/axios";
import axios from "axios";

const USE_LOCAL_STORAGE =
  (import.meta.env.VITE_USE_LOCAL_STORAGE ?? "true") === "true";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ====== State & Refs =======================================================
  const tokenRef = useRef(
    USE_LOCAL_STORAGE ? localStorage.getItem("accessToken") || "" : ""
  );
  const [accessToken, _setAccessTokenState] = useState(tokenRef.current);
  const [user, setUser] = useState(() => {
    if (!USE_LOCAL_STORAGE) return null;
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(false);

  const isAuthenticated = !!accessToken;

  // ====== Helpers ============================================================
  const unwrap = (data) => (data?.data ?? data ?? {});
  const extractToken = (data) => {
    const root = unwrap(data);
    return (
      root.accessToken ||
      root.token ||
      root.access_token ||
      data?.accessToken ||
      data?.token ||
      data?.access_token ||
      null
    );
  };

  // tetap aman walau bentuk response beda-beda
  const extractProfile = (data) => {
    const root = unwrap(data);
    const u = root.user || root?.data?.user || root;
    return {
      id: u?.id ?? null,
      email: u?.email ?? null,
      name: u?.name ?? null,
      phone: u?.phone ?? null,
      avatar: u?.avatar ?? null,
      // birthDate dihapus karena BE tidak punya field ini
    };
  };

  const setAccessToken = (t) => {
    const val = t || "";
    tokenRef.current = val;
    _setAccessTokenState(val);

    if (USE_LOCAL_STORAGE) {
      try {
        if (val) localStorage.setItem("accessToken", val);
        else localStorage.removeItem("accessToken");
      } catch {}
    }

    // sinkron default header axios
    try {
      if (val) api.defaults.headers.common.Authorization = `Bearer ${val}`;
      else delete api.defaults.headers.common.Authorization;
    } catch {}
  };

  const saveAuth = ({ token, profile }) => {
    if (token) setAccessToken(token);

    // simpan user jika ada
    if (profile?.email) {
      setUser(profile);
      if (USE_LOCAL_STORAGE) {
        try {
          localStorage.setItem("user", JSON.stringify(profile));
        } catch {}
      }
    }
  };

  // ====== Bind axios token getter/setter (sekali) ============================
  useEffect(() => {
    bindAccessTokenFns(
      () => tokenRef.current, // selalu terbaru
      (t) => setAccessToken(t)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== Refresh "silent" (menelan 401) =====================================
  const silentRefresh = async () => {
    try {
      const res = await api.post("/auth/refresh", {}, { withCredentials: true });
      const token = extractToken(res.data);
      const profile = extractProfile(res.data);
      if (token) saveAuth({ token, profile });
      return Boolean(token);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) return false;
      console.warn("[refresh] unexpected:", err?.message || err);
      return false;
    }
  };

  // ====== Bootstrap sekali (hindari double efek StrictMode) ==================
  const bootOnce = useRef(false);

  useEffect(() => {
    if (bootOnce.current) return;
    bootOnce.current = true;

    (async () => {
      try {
        if (!tokenRef.current) {
          await silentRefresh();
        } else {
          try {
            const me = await api.get("/profile", { withCredentials: true });
            const p = extractProfile(me.data);
            if (p?.email) setUser(p);
          } catch {
            const ok = await silentRefresh();
            if (!ok) {
              setAccessToken("");
              setUser(null);
              if (USE_LOCAL_STORAGE) {
                try {
                  localStorage.removeItem("user");
                } catch {}
              }
            }
          }
        }
      } finally {
        setReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== Actions ============================================================
  const login = async (email, password) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    const token = extractToken(res.data);
    const profile = extractProfile(res.data);
    saveAuth({ token, profile });
    return res.data;
  };

  /**
   * ✅ SIGNUP (SUPPORT referralCode OPTIONAL)
   * - referralCode dikirim kalau user isi
   * - kalau kosong, tidak dikirim sama sekali (biar BE gak salah parsing)
   */
  const signup = async ({ name, email, password, phone, referralCode }) => {
    const payload = {
      name,
      email,
      password,
      phone,
      ...(referralCode?.trim() ? { referralCode: referralCode.trim() } : {}),
    };

    const res = await api.post("/auth/register", payload, {
      withCredentials: true,
    });

    // biasanya register belum login (OTP flow), jadi tidak saveAuth di sini.
    // tapi kalau BE kamu ternyata mengembalikan token juga, ini aman:
    const token = extractToken(res.data);
    const profile = extractProfile(res.data);
    if (token) saveAuth({ token, profile });

    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post(
      "/otp/verify",
      { email, otp },
      { withCredentials: true }
    );
    const token = extractToken(res.data);
    const profile = extractProfile(res.data);
    saveAuth({ token, profile });
    return res.data;
  };

  const resendOtp = async (email) => {
    const res = await api.post(
      "/auth/resend",
      { email },
      { withCredentials: true }
    );
    return res.data;
  };

  const fetchMe = async () => {
    try {
      const res = await api.get("/profile", { withCredentials: true });
      const u = extractProfile(res.data);
      if (u?.email) {
        setUser(u);
        if (USE_LOCAL_STORAGE) {
          try {
            localStorage.setItem("user", JSON.stringify(u));
          } catch {}
        }
      }
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        return null;
      }
      console.warn("[fetchMe] unexpected:", err?.message || err);
      return null;
    }
  };

  const updateProfile = async (profileUpdates) => {
    const res = await api.put("/profile", profileUpdates, {
      withCredentials: true,
    });
    const updated = extractProfile(res.data);
    if (updated?.email) {
      setUser(updated);
      if (USE_LOCAL_STORAGE) {
        try {
          localStorage.setItem("user", JSON.stringify(updated));
        } catch {}
      }
    }
    return res.data;
  };

  // 🔹 Upload avatar ke BE + update user di context
  const uploadAvatar = async (file) => {
    console.log("[uploadAvatar] start, file =", file);
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.put("/profile/avatar", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const avatar = res.data?.data?.avatar; // contoh: "/uploads/avatar-3-xxx.jpg"
    console.log("[uploadAvatar] response avatar =", avatar);

    if (avatar) {
      setUser((prev) => {
        const newUser = {
          ...(prev || {}),
          avatar,
        };
        if (USE_LOCAL_STORAGE) {
          try {
            localStorage.setItem("user", JSON.stringify(newUser));
          } catch {}
        }
        return newUser;
      });
    }

    return avatar;
  };

  const logout = async (redirectTo = "/") => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("⚠️ Logout error (ignored):", e?.message || e);
    }

    setAccessToken("");
    setUser(null);
    if (USE_LOCAL_STORAGE) {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
      } catch {}
    }

    if (redirectTo) window.location.replace(redirectTo);
  };

  const value = useMemo(
    () => ({
      // state
      user,
      isAuthenticated,
      accessToken,
      ready,
      // setters
      setUser,
      setAccessToken,
      // actions
      login,
      signup,
      verifyOtp,
      resendOtp,
      logout,
      fetchMe,
      updateProfile,
      uploadAvatar,
    }),
    [user, isAuthenticated, accessToken, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
