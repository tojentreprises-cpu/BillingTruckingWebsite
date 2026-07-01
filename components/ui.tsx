"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import type { IconKey } from "@/lib/content";

/* ---------- Arrow ---------- */
export function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg className="arrow" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- Service icons ---------- */
const ICON_PATHS: Record<IconKey, string> = {
  snow: "M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3",
  leaf: "M4 20c0-9 6-15 16-15 0 10-6 16-16 15zM4 20c4-6 8-9 12-11",
  temp: "M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z",
  route: "M6 6h8a4 4 0 0 1 0 8H10a4 4 0 0 0 0 8M6 6v0M18 18v0",
  monitor: "M3 5h18v12H3zM7 21h10M12 17v4M7 11l2.5-3 2.5 3 2.5-4L17 11",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4",
};

export function ServiceIcon({ name }: { name: IconKey }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/* ---------- Magnetic (subtle pointer pull on pointer-fine devices) ---------- */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      style={{ display: "inline-flex", transition: "transform .4s cubic-bezier(0.22,1,0.36,1)" }}>
      {children}
    </span>
  );
}

/* ---------- Reveal (scroll-into-view fade-up) ---------- */
export function Reveal({
  children, as = "div", className, delay = 0,
}: { children: ReactNode; as?: "div" | "h2" | "p" | "span"; className?: string; delay?: number }) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
    >
      {children}
    </MotionTag>
  );
}

/* ---------- smooth scroll to an id ---------- */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export { motion, useState };
