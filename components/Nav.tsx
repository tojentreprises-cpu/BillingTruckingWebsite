"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, company } from "@/lib/content";
import { Arrow, Magnetic, scrollToId } from "./ui";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.pageYOffset > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header className={`nav ${solid ? "solid" : ""}`}>
      <div className="brand" role="button" tabIndex={0} aria-label={`${company.name} — back to top`}
        onClick={toTop}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toTop(); } }}>
        <div className="mark">Billing<br /><b>Trucking</b></div>
        <div className="divider" />
        <div className="sub">TURLOCK, CA<br />EST. {company.established}</div>
      </div>

      <nav className="navlinks" aria-label="Primary">
        {navLinks.map(([t, id]) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }}>{t}</a>
        ))}
      </nav>

      <Magnetic>
        <button className="nav-cta" onClick={() => scrollToId("contact")}>
          Request a Quote <Arrow size={14} />
        </button>
      </Magnetic>

      <button className="nav-burger" onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Primary (mobile)"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, background: "var(--paper)",
              borderTop: "1px solid var(--line)", padding: "12px var(--pad) 24px", display: "flex",
              flexDirection: "column", gap: 4, boxShadow: "0 30px 50px -30px rgba(0,0,0,.4)",
            }}>
            {navLinks.map(([t, id]) => (
              <a key={id} href={`#${id}`}
                onClick={(e) => { e.preventDefault(); scrollToId(id); setOpen(false); }}
                style={{ color: "var(--ink)", padding: "14px 0", fontWeight: 700, borderBottom: "1px solid var(--line)" }}>
                {t}
              </a>
            ))}
            <button className="btn btn-primary" style={{ marginTop: 16, justifyContent: "center" }}
              onClick={() => { scrollToId("contact"); setOpen(false); }}>
              Request a Quote <Arrow />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
