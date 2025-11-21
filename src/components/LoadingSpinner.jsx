// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]">
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        {/* Text */}
        <p className="mt-4 text-gray-700 font-medium text-lg">
          Masuk ke akun...
        </p>
      </div>
    </div>
  );
}
