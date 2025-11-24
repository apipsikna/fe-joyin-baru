// src/components/Navbar.jsx
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ====== Menu config ======
  const NAV_ITEMS = [
    // ✅ Referral sekarang jadi route, bukan hash
    { id: "referral", label: "Referral", kind: "route", target: "/referral" },
    { id: "paket", label: "Paket", kind: "hash", target: "#paket" },
    { id: "beranda", label: "Beranda", kind: "hash", target: "#beranda" },
    { id: "tutorial", label: "Tutorial", kind: "hash", target: "#tutorial" },
    { id: "tentang", label: "Tentang Kami", kind: "route", target: "/tentang" },
  ];

  // ====== Active state & indicator ======
  const [active, setActive] = useState("beranda"); // default: beranda hijau saat load
  const menuRef = useRef(null);
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  // Tentukan active berdasarkan URL sekarang
  const deriveActiveFromLocation = (loc) => {
    const { pathname, hash } = loc;

    if (pathname === "/tentang") return "tentang";
    if (pathname === "/referral") return "referral"; // ✅ aktifkan Referral saat di /referral
    if (pathname === "/") {
      const map = {
        "#referral": "referral",
        "#paket": "paket",
        "#beranda": "beranda",
        "#tutorial": "tutorial",
      };
      return map[hash] || "beranda";
    }
    return "beranda";
  };

  // Sinkronkan active dari URL (termasuk saat pertama kali mount)
  useLayoutEffect(() => {
    setActive(deriveActiveFromLocation(location));
  }, []); // sekali di awal

  useEffect(() => {
    setActive(deriveActiveFromLocation(location));
  }, [location]);

  // Hitung posisi & lebar indikator (garis bawah)
  const updateIndicator = () => {
    const el = itemRefs.current[active];
    const menu = menuRef.current;
    if (!el || !menu) return;

    const w = Math.max(36, Math.min(64, el.offsetWidth * 0.8)); // 36–64px
    const left = el.offsetLeft + el.offsetWidth / 2 - w / 2;
    setIndicator({ left, width: w, ready: true });
  };

  // Pastikan indikator muncul (dan bergerak) stabil:
  // - setelah mount
  // - saat active berubah
  // - saat resize
  useLayoutEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      updateIndicator();
      const raf2 = requestAnimationFrame(updateIndicator);
      // fonts (jaga-jaga)
      if (document?.fonts?.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(updateIndicator));
      }
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Klik item menu
  const handleClick = (e, item) => {
    e.preventDefault();

    // === Route normal (Referral, Tentang Kami, dll) ===
    if (item.kind === "route") {
      setActive(item.id); // langsung hijau + pindah halaman
      navigate(item.target);
      return;
    }

    // === Hash (anchor di landing) ===
    if (location.pathname !== "/") {
      setActive(item.id); // langsung hijau
      navigate({ pathname: "/", hash: item.target });
      return;
    }

    // sudah di landing → smooth scroll
    const id = item.target.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setActive(item.id);
      window.history.replaceState(null, "", item.target);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-16 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="Logo"
          className="h-12"
          onLoad={() => requestAnimationFrame(updateIndicator)}
        />
      </div>

      {/* Menu */}
      <div
        ref={menuRef}
        className="relative hidden lg:flex items-center gap-8 text-sm"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const href = item.target;

          return (
            <a
              key={item.id}
              href={href}
              ref={(el) => (itemRefs.current[item.id] = el)}
              onClick={(e) => handleClick(e, item)}
              className={`relative inline-block font-bold transition-colors duration-200
                ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-900 hover:text-emerald-600"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </a>
          );
        })}

        {/* Garis bawah meluncur */}
        <span
          className={`pointer-events-none absolute -bottom-1 h-[2px] rounded-full bg-emerald-500
                      transition-[transform,width,opacity] duration-300 ease-out
                      ${indicator.ready ? "opacity-100" : "opacity-0"}`}
          style={{
            width: `${indicator.width}px`,
            transform: `translateX(${indicator.left}px)`,
            willChange: "transform,width",
          }}
        />
      </div>

      {/* Tombol Login */}
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:brightness-110"
        style={{ background: "linear-gradient(to right, #5CC9AF, #5CC9BF)" }}
      >
        Login
      </button>
    </nav>
  );
}
