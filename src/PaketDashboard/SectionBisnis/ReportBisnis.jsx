import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const GRADIENT_FROM = "#5FCAAC";
const GRADIENT_TO = "#DAEC75";

/**
 * ✅ SETTING LAYOUT LAPORAN (biar gampang atur lebar kiri/kanan)
 * - sidePadMobile/Desktop : jarak kiri/kanan halaman (semakin kecil = semakin lebar)
 * - topPad               : jarak atas judul
 * - gapTitleToCard       : jarak judul ke container putih
 * - cardRadiusTop        : radius atas container putih
 * - cardMaxW             : batas max width card (9999 biar hampir full)
 */
const REPORT_LAYOUT = {
  sidePadMobile: 11,
  sidePadDesktop: 9,
  topPad: 22,
  gapTitleToCard: 30,
  cardRadiusTop: 46,
  cardMaxW: 9999,
};

export default function ReportBisnis() {
  const reduceMotion = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1];

  const page = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.2,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const headerIn = {
    hidden: { opacity: 0, y: 12, filter: "blur(7px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.55, ease: EASE },
    },
  };

  const cardIn = {
    hidden: { opacity: 0, y: 18, scale: 0.995, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0 : 0.65, ease: EASE },
    },
  };

  return (
    <motion.div
      className="w-full min-h-screen font-poppins overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(90deg, ${GRADIENT_FROM} 0%, ${GRADIENT_TO} 100%)`,
        "--spM": `${REPORT_LAYOUT.sidePadMobile}px`,
        "--spD": `${REPORT_LAYOUT.sidePadDesktop}px`,
        "--topPad": `${REPORT_LAYOUT.topPad}px`,
        "--gap": `${REPORT_LAYOUT.gapTitleToCard}px`,
        "--radTop": `${REPORT_LAYOUT.cardRadiusTop}px`,
        "--cardMaxW": `${REPORT_LAYOUT.cardMaxW}px`,
      }}
      variants={page}
      initial="hidden"
      animate="show"
    >
      <style>{`
        body { -ms-overflow-style: none; scrollbar-width: none; }
        body::-webkit-scrollbar { display: none; }

        .rp-pad{
          padding-left: var(--spM);
          padding-right: var(--spM);
        }
        @media (min-width: 768px){
          .rp-pad{
            padding-left: var(--spD);
            padding-right: var(--spD);
          }
        }
        .rp-cardMax{
          max-width: var(--cardMaxW);
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }
      `}</style>

      {/* HEADER */}
      <motion.div
        variants={headerIn}
        className="rp-pad shrink-0"
        style={{ paddingTop: "var(--topPad)" }}
      >
        <h1 className="text-center text-white font-extrabold tracking-wide text-[36px] md:text-[44px] leading-none">
          Laporan
        </h1>
      </motion.div>

      {/* WHITE CONTAINER BESAR (✅ bawah siku) */}
      <div
        className="rp-pad flex-1 min-h-0 flex flex-col"
        style={{ paddingTop: "var(--gap)", paddingBottom: 0 }}
      >
        <motion.div
          variants={cardIn}
          className="rp-cardMax flex-1 min-h-0 bg-white shadow-[0_26px_80px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{
            borderTopLeftRadius: "var(--radTop)",
            borderTopRightRadius: "var(--radTop)",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          {/* isi laporan nanti taruh di sini */}
          <div className="w-full h-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
