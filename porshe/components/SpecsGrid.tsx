"use client";

import { motion } from "framer-motion";
import { fullSpecs } from "@/data/carData";

export default function SpecsGrid() {
  return (
    <section className="py-24 px-6 md:px-16 border-t border-carbon-gray">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p
            className="text-[10px] tracking-[0.35em] uppercase text-porsche-red mb-3"
            style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 600 }}
          >
            Technical Data
          </p>
          <div className="h-[1px] w-12 bg-porsche-red mb-5" />
          <h2
            className="text-3xl md:text-5xl font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Specifications
          </h2>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
          {fullSpecs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="border border-carbon-gray p-6 group hover:border-porsche-red/40 transition-colors duration-300"
            >
              <p
                className="text-[10px] tracking-[0.25em] uppercase text-metal-silver mb-2"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {spec.label}
              </p>
              <p
                className="text-xl md:text-2xl font-bold text-white group-hover:text-porsche-red transition-colors duration-300"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.02em" }}
              >
                {spec.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
