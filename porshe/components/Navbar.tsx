"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(10,10,10,0.75)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(213,0,28,0.2)" : "none",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Porsche crest mark */}
          <div className="w-7 h-7 relative">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="40" height="40" rx="2" fill="#D5001C" />
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">P</text>
            </svg>
          </div>
          <span
            className="font-orbitron text-sm font-700 tracking-[0.25em] text-white uppercase"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Porsche
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Models", "Design", "Performance", "Technology"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] tracking-[0.2em] uppercase text-metal-silver hover:text-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 500 }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="relative px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-medium border border-porsche-red text-white overflow-hidden group"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          <span className="absolute inset-0 bg-porsche-red translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10">Configure</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}
