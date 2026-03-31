"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import Navbar from "@/components/Navbar";
import PorscheScrollCanvas from "@/components/PorscheScrollCanvas";
import PorscheExperience from "@/components/PorscheExperience";
import SpecsGrid from "@/components/SpecsGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const TOTAL_FRAMES = 240;
// 600vh scroll section — keeps sticky car visible for 600% of screen height
const SECTION_VH = 600;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * useScroll without a `target` tracks the raw window scroll (scrollY / maxScrollY).
   * We then re-map it to ONLY the 600vh section using useTransform, so the phases
   * are always correctly synchronised regardless of how tall the below-fold sections are.
   */
  const { scrollYProgress: rawProgress } = useScroll();

  // We calculate the start/end of our scroll section as fractions of the full page.
  // These are initialised to 0/1 and updated after mount (once DOM dimensions are known).
  const [sectionBounds, setSectionBounds] = useState({ start: 0, end: 1 });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const pageH = document.documentElement.scrollHeight;
      const maxScroll = pageH - window.innerHeight;
      if (maxScroll <= 0) return;
      const el = containerRef.current;
      const start = el.offsetTop / maxScroll;
      const end = (el.offsetTop + el.offsetHeight - window.innerHeight) / maxScroll;
      setSectionBounds({ start, end });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /**
   * Remap rawProgress [sectionStart → sectionEnd] → [0 → 1]
   * so all child components see clean 0–1 progress scoped to the scroll section.
   */
  const scrollYProgress: MotionValue<number> = useTransform(
    rawProgress,
    [sectionBounds.start, sectionBounds.end],
    [0, 1],
    { clamp: true }
  );

  return (
    <main className="bg-porsche-black relative">
      <Navbar />

      {/* ── SCROLL SEQUENCE (600vh) ── */}
      <div
        ref={containerRef}
        style={{ height: `${SECTION_VH}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background canvas — image sequence driven by scroll */}
          <PorscheScrollCanvas
            scrollYProgress={scrollYProgress}
            totalFrames={TOTAL_FRAMES}
            className="z-0"
          />

          {/* Gradient vignette — keeps left-side HUD text legible */}
          <div
            className="absolute inset-0 z-[5]"
            style={{
              background:
                "linear-gradient(to right, rgba(10,10,10,0.55) 30%, rgba(10,10,10,0.10) 55%, transparent 100%), linear-gradient(to top, rgba(10,10,10,0.50) 0%, transparent 45%)",
            }}
          />

          {/* HUD overlay — all three phases */}
          <PorscheExperience scrollYProgress={scrollYProgress} className="z-10" />
        </div>
      </div>

      {/* ── BELOW-FOLD SECTIONS ── */}
      <div className="relative z-20 bg-porsche-black">
        <SpecsGrid />
        <Features />
        <Footer />
      </div>
    </main>
  );
}
