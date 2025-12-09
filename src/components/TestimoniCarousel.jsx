import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiStar } from "react-icons/hi";
import testimoniData from "../data/testimoniData";

export default function TestimoniCarousel() {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextStep();
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimoniData.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimoniData.length) % testimoniData.length);
  };

  // Safe cyclic access
  const getCard = (offset) => {
    const i = (index + offset + testimoniData.length) % testimoniData.length;
    return testimoniData[i];
  };

  // Helper to get content based on language
  const isEn = i18n.language === "en";
  const currentCard = getCard(0);
  const content = isEn ? currentCard.contentEn : currentCard.content;
  const role = isEn ? currentCard.roleEn : currentCard.role;

  // Variants for animation
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
      },
    }),
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden font-poppins">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold tracking-wider mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {t("testimoni.title", "Cerita Sukses Member Joyin")}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">
            {t(
              "testimoni.desc",
              "Dengar langsung pengalaman mereka menggunakan fitur-fitur Joyin untuk mengembangkan bisnis."
            )}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-center min-h-[400px]">

          {/* Active Card with AnimatePresence */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full max-w-2xl px-4"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative">
                {/* Quote Icon */}
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-4 text-9xl text-gray-100 font-serif opacity-50 select-none">
                  "
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 text-yellow-400 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="w-6 h-6" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed italic mb-8 relative z-10">
                  "{content}"
                </p>

                {/* User Info */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-teal-500 mb-3">
                    <img
                      src={currentCard.image}
                      alt={currentCard.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{currentCard.name}</h4>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls - Absolute centered vertically */}
          <button
            onClick={prevStep}
            className="absolute left-0 md:left-10 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 shadow-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all transform hover:scale-110 focus:outline-none"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextStep}
            className="absolute right-0 md:right-10 z-20 w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 shadow-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all transform hover:scale-110 focus:outline-none"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {testimoniData.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-emerald-500" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
