"use client";

import { useEffect, useRef } from "react";
import { Arrow, Magnetic, scrollToId } from "./ui";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle parallax drift on the hero photo. Coalesced into one write per frame
  // and disabled under prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      if (bgRef.current) bgRef.current.style.transform = `scale(1.08) translateY(${window.pageYOffset * 0.18}px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <section className="hero-still" aria-label="Introduction">
      <div className="bg" ref={bgRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="assets/fleet-wide.jpg" alt="Billing Trucking refrigerated fleet on the road"
          width={6000} height={4000} fetchPriority="high" decoding="async" />
      </div>
      <div className="grad" />
      <div className="grad-b" />
      <div className="still-content">
        <span className="eyebrow hero-text-eyebrow"><i className="tick" />Refrigerated &amp; Produce Freight · Turlock, CA</span>
        <h1>Moving the <span className="em">West&apos;s</span> cold freight.</h1>
        <p className="still-sub">
          Temperature-controlled trucking out of California&apos;s Central Valley. Produce, perishables
          and food-grade loads, hauled with the discipline a cold chain demands.
        </p>
        <div className="still-cta">
          <Magnetic><button className="btn btn-primary" onClick={() => scrollToId("contact")}>Request a Quote <Arrow /></button></Magnetic>
          <Magnetic><button className="btn btn-ghost on-dark" onClick={() => scrollToId("services")}>Our Capabilities</button></Magnetic>
        </div>
      </div>
      <div className="scroll-cue"><div className="mouse" /><div className="t">Scroll</div></div>
    </section>
  );
}
