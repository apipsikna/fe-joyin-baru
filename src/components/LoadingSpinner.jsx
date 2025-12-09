import React from "react";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 min-w-[240px] border border-white/50"
      >
        {/* Modern Ring Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#52c8b0] rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-gray-800 font-bold text-lg">Tunggu Sebentar</h3>
          <p className="text-gray-500 text-sm mt-1 animate-pulse">Sedang memproses...</p>
        </div>
      </motion.div>
    </div>
  );
}
