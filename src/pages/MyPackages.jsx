// src/pages/MyPackages.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import iconsedih from "../assets/iconsedih.png";
import { useAuth } from "../contexts/AuthContext";

// Import komponen spesifik per paket
import MyPackagesBasic from "../PaketDashboard/SectionBasic/MyPackagesBasic";
import MyPackagesBisnis from "../PaketDashboard/SectionBisnis/MyPackagesBisnis";
import MyPackagesPro from "../PaketDashboard/SectionPro/MyPackagesPro";
import MyPackagesEnterprise from "../PaketDashboard/SectionEnterprise/MyPackagesEnterprise";

/* =======================
   ✅ SEMUA SETTING DI AWAL FILE
   - Kalau kamu ubah tinggi/lebar card, halaman (viewport) tetap.
   - Yang scroll hanya area konten (di dalam viewport), bukan body page.
   ======================= */
const CFG = {
  // background gradient
  bgFrom: "#5CC9AF",
  bgTo: "#D7E96F",

  // padding halaman
  pagePadXMobile: 16,
  pagePadXDesktop: 10,
  pagePadTop: 28,
  pagePadBottom: 18,

  // header / judul
  headerGap: 14,

  // card putih
  cardMaxW: 9000,
  cardMinHvh: 100,
  cardPadMobile: 32,
  cardPadDesktop: 56,
  cardRadiusMobile: 28,
  cardRadiusDesktop: 34,
  cardShadow: "0 18px 40px rgba(0,0,0,0.12)",

  // konten tengah
  contentMaxW: 620,
  iconSizeMobile: 88,
  iconSizeDesktop: 96,
  titleSizeMobile: 22,
  titleSizeDesktop: 26,
  textSizeMobile: 14,
  textSizeDesktop: 16,

  // tombol
  btnH: 48,
  btnPX: 40,
  btnRadius: 12,
  btnColor: "#5FCAAC",
  btnFontSize: 15,

  // route
  choosePlanRoute: "/checkout",

  // animasi
  anim: {
    dur: 520, // ms
    ease: "cubic-bezier(.2,.9,.2,1)",
    headerDelay: 40, // ms
    cardDelay: 120, // ms
  },
};

export default function MyPackages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enter, setEnter] = useState(false);

  // trigger animasi ketika mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const hasPlan = !!user?.plan;
  const userPlan = user?.plan ? user.plan.toUpperCase() : null;

  // ✅ DISPATCHER LOGIC:
  // Jika punya plan, render komponen dashboard khusus paketnya.
  // Jika tidak punya, tampilkan tampilan "Empty State" default di bawah.
  if (hasPlan) {
    switch (userPlan) {
      case "BASIC":
        return <MyPackagesBasic />;
      case "BISNIS":
        return <MyPackagesBisnis />;
      case "PRO":
        return <MyPackagesPro />;
      case "ENTERPRISE":
        return <MyPackagesEnterprise />;
      default:
        // Fallback jika plan tidak dikenali, tampilkan Basic atau desain generic
        return <MyPackagesBasic />;
    }
  }

  // --- TAMPILAN JIKA TIDAK ADA PAKET (EMPTY STATE) ---
  return (
    <div
      className="joyin-packages h-[100dvh] w-full overflow-hidden font-poppins"
      style={{
        background: `linear-gradient(90deg, ${CFG.bgFrom} 0%, ${CFG.bgTo} 100%)`,
      }}
    >
      {/* CSS variables responsive + animasi simple */}
      <style>{`
        .joyin-packages{
          --padx:${CFG.pagePadXMobile}px;
          --cardPad:${CFG.cardPadMobile}px;
          --cardRadius:${CFG.cardRadiusMobile}px;

          --icon:${CFG.iconSizeMobile}px;
          --tSize:${CFG.titleSizeMobile}px;
          --pSize:${CFG.textSizeMobile}px;
        }
        @media(min-width:768px){
          .joyin-packages{
            --padx:${CFG.pagePadXDesktop}px;
            --cardPad:${CFG.cardPadDesktop}px;
            --cardRadius:${CFG.cardRadiusDesktop}px;

            --icon:${CFG.iconSizeDesktop}px;
            --tSize:${CFG.titleSizeDesktop}px;
            --pSize:${CFG.textSizeDesktop}px;
          }
        }

        /* ===== Enter animation classes ===== */
        .j-enter-bg{
          opacity: ${enter ? 1 : 0};
          filter: ${enter ? "blur(0px)" : "blur(10px)"};
          transition: opacity ${CFG.anim.dur}ms ${CFG.anim.ease}, filter ${CFG.anim.dur}ms ${CFG.anim.ease};
        }

        .j-enter-header{
          opacity: ${enter ? 1 : 0};
          transform: ${enter ? "translateY(0px)" : "translateY(-10px)"};
          transition: opacity ${CFG.anim.dur}ms ${CFG.anim.ease} ${CFG.anim.headerDelay}ms,
                      transform ${CFG.anim.dur}ms ${CFG.anim.ease} ${CFG.anim.headerDelay}ms;
        }

        .j-enter-card{
          opacity: ${enter ? 1 : 0};
          transform: ${enter ? "translateY(0px) scale(1)" : "translateY(14px) scale(.985)"};
          transition: opacity ${CFG.anim.dur}ms ${CFG.anim.ease} ${CFG.anim.cardDelay}ms,
                      transform ${CFG.anim.dur}ms ${CFG.anim.ease} ${CFG.anim.cardDelay}ms;
        }

        .j-float-icon{
          animation: jfloat 3.2s ease-in-out infinite;
          animation-delay: ${enter ? "320ms" : "0ms"};
        }
        @keyframes jfloat{
          0%,100%{ transform: translateY(0px); }
          50%{ transform: translateY(-6px); }
        }
      `}</style>

      {/* Background layer fade-in */}
      <div className="absolute inset-0 j-enter-bg" aria-hidden />

      {/* ====== HEADER (tetap, tidak ikut scroll) ====== */}
      <header
        className="shrink-0 relative z-10 j-enter-header"
        style={{
          paddingTop: CFG.pagePadTop,
          paddingLeft: "var(--padx)",
          paddingRight: "var(--padx)",
        }}
      >
        <h1 className="text-center text-white font-extrabold tracking-wide text-3xl md:text-4xl">
          {t("myPackages.title")}
        </h1>
        <div style={{ height: CFG.headerGap }} />
      </header>

      {/* ====== CONTENT AREA (yang scroll hanya ini) ====== */}
      <main
        className="flex-1 overflow-auto relative z-10"
        style={{
          paddingLeft: "var(--padx)",
          paddingRight: "var(--padx)",
          paddingBottom: CFG.pagePadBottom,
        }}
      >
        <div className="mx-auto w-full j-enter-card" style={{ maxWidth: CFG.cardMaxW }}>
          {/* Card putih */}
          <div
            className="bg-white border border-black/5 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              borderRadius: "var(--cardRadius)",
              boxShadow: CFG.cardShadow,
              minHeight: `calc(${CFG.cardMinHvh}vh)`,
              padding: "var(--cardPad)",
            }}
          >
            {/* Empty State */}
            <div className="text-center max-w-[600px]">
              <img
                src={iconsedih}
                alt="Empty"
                className="mx-auto w-24 h-24 mb-6"
                draggable={false}
              />
              <h2 className="font-extrabold text-2xl text-gray-700 mb-3">
                {t("myPackages.emptyState.title")}
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {t("myPackages.emptyState.desc1")} <br className="hidden md:block" /> {t("myPackages.emptyState.desc2")}
              </p>

              <button
                onClick={() => navigate(CFG.choosePlanRoute)}
                className="mt-7 inline-flex items-center justify-center text-white font-bold shadow-sm hover:brightness-95 active:brightness-90 transition focus:outline-none focus:ring-2 focus:ring-white/70"
                style={{
                  height: CFG.btnH,
                  paddingLeft: CFG.btnPX,
                  paddingRight: CFG.btnPX,
                  borderRadius: CFG.btnRadius,
                  backgroundColor: CFG.btnColor,
                  fontSize: CFG.btnFontSize,
                }}
              >
                {t("myPackages.emptyState.btn")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
