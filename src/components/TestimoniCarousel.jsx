import React, { useEffect } from "react";
import testimoniData from "../data/testimoniData";

export default function TestimoniCarousel() {
  useEffect(() => {
    applyCarouselEffects();
  }, []);

  const handlePrev = () => {
    const container = document.getElementById("carousel-track");
    if (container) {
      const last = container.lastElementChild;
      if (last) {
        container.prepend(last);
        applyCarouselEffects();
      }
    }
  };

  const handleNext = () => {
    const container = document.getElementById("carousel-track");
    if (container) {
      const first = container.firstElementChild;
      if (first) {
        container.appendChild(first);
        applyCarouselEffects();
      }
    }
  };

  return (
    <section className="px-6 lg:px-20 py-20 bg-white overflow-hidden">
      <h2 className="text-2xl lg:text-3xl font-bold text-center mb-4">
        Cerita dari Pengguna Joyin
      </h2>
      <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
        Mereka udah ngerasain gimana Joyin bantuin bisnis sehari-hari. Dari yang baru mulai sampai yang udah jalan lama — semua punya cerita seru bareng Joyin!
      </p>

      <div className="relative w-full max-w-[1100px] mx-auto flex justify-center items-center">
        {/* Tombol Kiri */}
        <button
          onClick={handlePrev}
          className="z-20 w-10 h-10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center bg-white shadow-md absolute -left-8 lg:-left-12"
        >
          &#x276E;
        </button>

        {/* Track Carousel */}
        <div
          id="carousel-track"
          className="flex items-center gap-8 transition-all duration-500 ease-in-out overflow-visible"
          style={{ width: "100%", justifyContent: "center" }}
        >
          {testimoniData.map((t, i) => (
            <div
              key={i}
              className="testimonial-card bg-white w-[540px] rounded-2xl px-6 py-6 border transition-all duration-500 ease-in-out shrink-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{t.content}</p>
            </div>
          ))}
        </div>

        {/* Tombol Kanan */}
        <button
          onClick={handleNext}
          className="z-20 w-10 h-10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center bg-white shadow-md absolute -right-8 lg:-right-12"
        >
          &#x276F;
        </button>
      </div>

      {/* Efek Skala dan Shadow */}
      <style>{`
        .testimonial-card {
          transform: scale(0.92);
          opacity: 0.4;
          z-index: 0;
        }
        .testimonial-card:nth-child(2) {
          transform: scale(1);
          opacity: 1;
          z-index: 10;
          border: 2px solid #10b981;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </section>
  );
}

// Efek untuk memposisikan dan memberi style ke kartu tengah
function applyCarouselEffects() {
  const cards = document.querySelectorAll("#carousel-track .testimonial-card");
  cards.forEach((card, i) => {
    card.style.transform = "scale(0.92)";
    card.style.opacity = "0.4";
    card.style.zIndex = "0";
    card.style.border = "1px solid #e5e7eb";
    card.style.boxShadow = "none";

    if (i === 1) {
      card.style.transform = "scale(1)";
      card.style.opacity = "1";
      card.style.zIndex = "10";
      card.style.border = "2px solid #10b981";
      card.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.08)";
    }
  });
}
