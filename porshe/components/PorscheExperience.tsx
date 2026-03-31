"use client";

import { useTransform, MotionValue, motion } from "framer-motion";

interface PorscheExperienceProps {
  scrollYProgress: MotionValue<number>;
  className?: string;
}

function PhaseWrapper({
  children,
  opacity,
}: {
  children: React.ReactNode;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 pointer-events-none"
    >
      {children}
    </motion.div>
  );
}

function RedLine({ width = "50px" }: { width?: string }) {
  return <div className="h-[1px] bg-porsche-red mb-5" style={{ width }} />;
}

function EyebrowLabel({ text }: { text: string }) {
  return (
    <p
      className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-porsche-red mb-3"
      style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 600 }}
    >
      {text}
    </p>
  );
}

// Phase markers extracted as a component so hooks are called at top level
function PhaseMarkers({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const op0 = useTransform(scrollYProgress, [0, 0.16, 0.33], [1, 1, 0.25]);
  const op1 = useTransform(scrollYProgress, [0.28, 0.5, 0.66], [0.25, 1, 0.25]);
  const op2 = useTransform(scrollYProgress, [0.61, 0.83, 1.0], [0.25, 1, 1]);
  const opacities = [op0, op1, op2];

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center">
      {(["01", "02", "03"] as const).map((n, i) => (
        <motion.div
          key={n}
          style={{ opacity: opacities[i] }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className="text-[9px] tracking-[0.2em] text-metal-silver"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {n}
          </div>
          <div className="w-[1px] h-6 bg-metal-silver/30" />
        </motion.div>
      ))}
    </div>
  );
}

export default function PorscheExperience({
  scrollYProgress,
  className = "",
}: PorscheExperienceProps) {
  // Hero: 0 → 0.33
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.25, 0.33],
    [1, 1, 1, 0]
  );
  // Design: 0.33 → 0.66
  const designOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.38, 0.58, 0.66],
    [0, 1, 1, 0]
  );
  // Performance: 0.66 → 1.0
  const perfOpacity = useTransform(
    scrollYProgress,
    [0.61, 0.72, 0.92, 1.0],
    [0, 1, 1, 1]
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 10 }}
    >
      {/* ── PHASE 1: HERO ── */}
      <PhaseWrapper opacity={heroOpacity}>
        <div className="max-w-lg">
          <EyebrowLabel text="Porsche · 2024" />
          <RedLine width="40px" />
          <h1
            className="text-5xl md:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tight mb-5"
            style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900 }}
          >
            911
            <br />
            <span className="text-porsche-red">Turbo S</span>
          </h1>
          <p
            className="text-base md:text-lg text-metal-silver mb-7 leading-relaxed max-w-sm"
            style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 400, letterSpacing: "0.04em" }}
          >
            Timeless Precision.
            <br />
            Relentless Performance.
          </p>
          <div className="flex items-center gap-6 mb-7">
            <div>
              <p
                className="text-[10px] tracking-[0.25em] uppercase text-metal-silver mb-1"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                Starting from
              </p>
              <p
                className="text-xl md:text-2xl font-semibold text-accent-white"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.05em" }}
              >
                ₹3.35 Cr
              </p>
              <p className="text-xs text-metal-silver" style={{ fontFamily: "var(--font-rajdhani)" }}>
                / €220,000
              </p>
            </div>
            <div className="w-[1px] h-12 bg-carbon-gray" />
            <button
              className="pointer-events-auto px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold border border-porsche-red text-white relative overflow-hidden group"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              <span className="absolute inset-0 bg-porsche-red translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Configure Now</span>
            </button>
          </div>
          {/* Scroll indicator */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-8 border border-metal-silver/40 rounded-full flex items-start justify-center p-1">
              <motion.div
                className="w-1 h-2 bg-porsche-red rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-metal-silver/60"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      </PhaseWrapper>

      {/* ── PHASE 2: DESIGN ── */}
      <PhaseWrapper opacity={designOpacity}>
        <div className="max-w-md">
          <EyebrowLabel text="Exterior Design" />
          <RedLine width="50px" />
          <h2
            className="text-4xl md:text-6xl xl:text-7xl font-black uppercase leading-none mb-5"
            style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900 }}
          >
            Design
          </h2>
          <p
            className="text-base md:text-lg text-metal-silver mb-6 leading-relaxed"
            style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 400, letterSpacing: "0.03em" }}
          >
            Iconic silhouette. Wide rear stance.
            <br />
            Active aerodynamics.
          </p>
          <div className="inline-flex items-center gap-3 border border-porsche-red/40 px-4 py-2 bg-porsche-red/5">
            <div className="w-2 h-2 bg-porsche-red rounded-full" />
            <span
              className="text-[11px] tracking-[0.15em] uppercase text-accent-white"
              style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 600 }}
            >
              Carbon Fibre &amp; Aluminium Hybrid Body
            </span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { val: "911", unit: "Iconic", label: "Heritage" },
              { val: "245", unit: "mm", label: "Rear Width" },
              { val: "Active", unit: "", label: "Aero Flap" },
            ].map((item) => (
              <div key={item.label} className="border-l border-porsche-red/30 pl-3">
                <p
                  className="text-lg md:text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {item.val}
                  <span className="text-xs text-metal-silver ml-1">{item.unit}</span>
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] text-metal-silver"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PhaseWrapper>

      {/* ── PHASE 3: PERFORMANCE ── */}
      <PhaseWrapper opacity={perfOpacity}>
        <div className="ml-auto max-w-xs md:max-w-sm text-right">
          <EyebrowLabel text="Engineering" />
          <RedLine width="50px" />
          <h2
            className="text-4xl md:text-6xl xl:text-7xl font-black uppercase leading-none mb-6"
            style={{ fontFamily: "var(--font-orbitron)", fontWeight: 900 }}
          >
            Perfor-
            <br />
            mance
          </h2>
          <div className="space-y-4">
            {[
              { label: "Engine", value: "3.8L Twin‑Turbo Flat‑Six" },
              { label: "Power", value: "640 HP" },
              { label: "0–100 km/h", value: "2.7 s" },
              { label: "Drive", value: "AWD System" },
              { label: "Top Speed", value: "330 km/h" },
            ].map((spec) => (
              <div key={spec.label} className="flex items-center justify-end gap-4">
                <span
                  className="text-[10px] uppercase tracking-[0.2em] text-metal-silver"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {spec.label}
                </span>
                <div className="w-[1px] h-4 bg-porsche-red/40" />
                <span
                  className="text-sm md:text-base font-semibold text-accent-white"
                  style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.05em" }}
                >
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PhaseWrapper>

      {/* ── SCROLL PROGRESS BAR ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <motion.div
          className="h-full bg-porsche-red"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </div>

      {/* ── SIDE PHASE MARKERS ── */}
      <PhaseMarkers scrollYProgress={scrollYProgress} />
    </div>
  );
}
