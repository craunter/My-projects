"use client";

import { motion } from "framer-motion";
import { features } from "@/data/carData";

export default function Features() {
  return (
    <section className="py-24 px-6 md:px-16 bg-carbon-gray/30">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p
            className="text-[10px] tracking-[0.35em] uppercase text-porsche-red mb-3"
            style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 600 }}
          >
            Features
          </p>
          <div className="h-[1px] w-12 bg-porsche-red mb-5" />
          <h2
            className="text-3xl md:text-5xl font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Engineering<br />Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-carbon-gray">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-porsche-black p-8 group hover:bg-carbon-gray transition-colors duration-500"
            >
              {/* Icon */}
              <div className="text-3xl mb-5">{feat.icon}</div>
              {/* Title */}
              <h3
                className="text-base md:text-lg font-bold uppercase tracking-widest mb-3 text-accent-white group-hover:text-porsche-red transition-colors duration-300"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.12em" }}
              >
                {feat.title}
              </h3>
              {/* Divider */}
              <div className="h-[1px] w-8 bg-porsche-red mb-4 group-hover:w-16 transition-all duration-500" />
              {/* Description */}
              <p
                className="text-sm text-metal-silver leading-relaxed"
                style={{ fontFamily: "var(--font-rajdhani)", letterSpacing: "0.02em" }}
              >
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
