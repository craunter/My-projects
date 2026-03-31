"use client";

import { useEffect, useRef, useCallback } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface PorscheScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  className?: string;
}

export default function PorscheScrollCanvas({
  scrollYProgress,
  totalFrames,
  className = "",
}: PorscheScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  // Store physical pixel dims; never modified by ctx.scale
  const physRef = useRef({ w: 0, h: 0 });

  const getFramePath = (index: number) => {
    const n = String(index + 1).padStart(3, "0");
    return `/frames/ezgif-frame-${n}.jpg`;
  };

  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w: cw, h: ch } = physRef.current;
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;

    // object-fit: cover — fills entire canvas, no letterbox bars
    const scale = Math.max(cw / iw, ch / ih);
    const drawW = iw * scale;
    const drawH = ih * scale;
    const dx = (cw - drawW) / 2;
    const dy = (ch - drawH) / 2;

    // Fill with black first to avoid canvas transparency flash
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }, []);

  const scheduleFrame = useCallback(
    (index: number) => {
      const imgs = imagesRef.current;
      if (!imgs[index]?.complete) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(imgs[index]);
        rafRef.current = null;
      });
    },
    [drawFrame]
  );

  // Resize: set physical buffer = CSS × DPR; do NOT call ctx.scale (avoids accumulation)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    physRef.current = { w, h };
    scheduleFrame(currentFrameRef.current);
  }, [scheduleFrame]);

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    imagesRef.current = imgs;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (i === 0) scheduleFrame(0);
      };
      imgs.push(img);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [totalFrames, resizeCanvas, scheduleFrame]);

  // Scroll → frame
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const frameIndex = Math.round(progress * (totalFrames - 1));
    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      scheduleFrame(frameIndex);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
