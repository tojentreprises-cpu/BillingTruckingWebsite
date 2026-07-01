"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion,
  animate, useMotionValue,
} from "framer-motion";
import {
  services, numbers, process as steps, lanes, panelLabels,
} from "@/lib/content";
import { Arrow, Magnetic, ServiceIcon, scrollToId } from "./ui";

const PANELS = 6;

export default function HorizontalShowcase() {
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Track horizontal translate: 0 → -(PANELS-1)*100vw across the scroll range.
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(PANELS - 1) * 100}vw`]);
  // Progress bar fill (eased position).
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Drive per-panel active / parallax CSS vars + the scroll-cue fade imperatively.
  // useMotionValueEvent fires on Framer's rAF-batched updates only — no busy loop.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const track = trackRef.current;
    if (!track) return;
    const panels = track.children;
    const pos = p * (PANELS - 1); // 0..PANELS-1, the centred panel index (fractional)
    for (let i = 0; i < panels.length; i++) {
      const el = panels[i] as HTMLElement;
      const n = Math.max(-1.3, Math.min(1.3, i - pos)); // distance from centre, -1..1
      const vis = Math.max(0, 1 - Math.abs(n));
      el.style.setProperty("--n", n.toFixed(3));
      el.style.setProperty("--vis", vis.toFixed(3));
      const act = Math.abs(n) < 0.42;
      if (act) el.setAttribute("data-active", "");
      else el.removeAttribute("data-active");
    }
    if (cueRef.current) cueRef.current.style.opacity = String(Math.max(0, 1 - p * 5));
  });

  // On mobile / reduced-motion the track stacks vertically (CSS), so every panel is "active".
  useEffect(() => {
    const mark = () => {
      const stacked = reduce || window.matchMedia("(max-width:720px)").matches;
      const track = trackRef.current;
      if (!track || !stacked) return;
      Array.from(track.children).forEach((el) => (el as HTMLElement).setAttribute("data-active", ""));
    };
    mark();
    window.addEventListener("resize", mark);
    return () => window.removeEventListener("resize", mark);
  }, [reduce]);

  return (
    <section className="hzx" ref={outerRef} id="story"
      style={{ height: reduce ? "auto" : `calc(${PANELS} * 100vh)` }}>
      <div className="hzx-sticky">
        <motion.div className="hzx-track" ref={trackRef} style={{ x }}>

          {/* 0 — INTRO */}
          <Panel i={0} kind="intro" stop={0}>
            <div className="layer-back hzx-watermark">B</div>
            <div className="intro-mid layer-mid">
              <span className="hzx-eyebrow"><i />The Billing Trucking Story · Scroll to travel</span>
              <h2 className="hzx-h1">Cold freight,<br /><em>start to finish.</em></h2>
              <p className="hzx-lead">A journey through how a family-run reefer fleet out of Turlock moves the West&apos;s perishable freight — capability by capability, mile by mile.</p>
              <div className="hzx-scrollhint layer-fore"><span className="ln" />Keep Scrolling<Arrow /></div>
            </div>
          </Panel>

          {/* 1 — SERVICES */}
          <Panel i={1} kind="services" stop={1}>
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i />Capabilities</span>
              <h2 className="hzx-h2">What we haul,<br />and how.</h2>
              <p className="hzx-sub">Refrigerated freight is all we do — so we do it with the focus a perishable load deserves.</p>
            </div>
            <div className="svc-row layer-fore">
              {services.map((s, k) => (
                <div className="hzx-svc" key={k} style={{ "--d": k } as React.CSSProperties}>
                  <div className="ico"><ServiceIcon name={s.ic} /></div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <span className="tag">{s.tag}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* 2 — BY THE NUMBERS */}
          <Panel i={2} kind="numbers" stop={2}>
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i />By The Numbers</span>
              <h2 className="hzx-h2">Built on cold loads,<br />delivered on time.</h2>
            </div>
            <div className="num-row layer-fore">
              {numbers.map((s, k) => (
                <div className="hzx-num" key={k}>
                  <div className="big"><CountUp value={s.n} dec={s.dec} /><span className="u">{s.suf}</span></div>
                  <div className="lbl">{s.lbl}</div>
                  <div className="note">{s.note}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* 3 — OUR STORY */}
          <Panel i={3} kind="story" stop={3}
            bg={
              <div className="story-vid">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="story-photo" src="assets/our-story.jpg" alt="Billing Trucking fleet and crew" loading="lazy" decoding="async" />
                <div className="imgtag"><b>USDOT 2207928</b> · MC 766110</div>
              </div>
            }>
            <div className="story-body layer-fore">
              <span className="hzx-eyebrow"><i />Our Story</span>
              <h2 className="hzx-h2">A Central Valley<br />fleet, run like family.</h2>
              <p className="hzx-sub">Founded in <b>2003</b> in Turlock, California, we started with one promise: keep the cold chain intact and the freight on schedule. We&apos;ve kept it ever since.</p>
              <p className="hzx-quote">&ldquo;The temperature holds. <em>So does our word.</em>&rdquo;</p>
              <div className="story-facts">
                <div><span className="k">Founded</span><span className="v">2003</span></div>
                <div><span className="k">Home Base</span><span className="v">Turlock</span></div>
                <div><span className="k">Specialty</span><span className="v">Reefer</span></div>
              </div>
            </div>
          </Panel>

          {/* 4 — PROCESS */}
          <Panel i={4} kind="process" stop={4}>
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i />How It Moves</span>
              <h2 className="hzx-h2">From quote<br />to cold delivery.</h2>
              <p className="hzx-sub">Five disciplined steps — the same on every load, whether it&apos;s a single pallet or a full reefer.</p>
            </div>
            <div className="proc-row layer-fore">
              {steps.map((s, k) => (
                <div className="hzx-step" key={k}>
                  <span className="k">{s.k}</span>
                  <span className="dot" />
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* 5 — SIGNATURE LANES */}
          <Panel i={5} kind="lanes" stop={5}>
            <div className="hzx-colhead layer-mid">
              <span className="hzx-eyebrow"><i />Signature Lanes</span>
              <h2 className="hzx-h2">Freight we run,<br />week in, week out.</h2>
              <p className="hzx-sub">Representative reefer lanes out of the Central Valley — the kind of dedicated, repeatable capacity we&apos;re built for.</p>
            </div>
            <div className="lane-row layer-fore">
              {lanes.map((l, k) => (
                <div className="hzx-lane" key={k}>
                  <div className="lane-top"><span className="mi">{l.mi}</span><span className="com">{l.com}</span></div>
                  <h3>{l.route}</h3>
                  <p>{l.note}</p>
                  <div className="lane-foot"><span /></div>
                </div>
              ))}
              <div className="hzx-lane lane-cta">
                <h3>Have a lane of your own?</h3>
                <p>Tell us your commodity and route — we&apos;ll come back with capacity and a rate.</p>
                <Magnetic><button className="btn btn-primary" onClick={() => scrollToId("contact")}>Request a Quote <Arrow /></button></Magnetic>
              </div>
            </div>
          </Panel>

        </motion.div>

        <TelematicsHud />
        <div className="hzx-progress" aria-hidden="true">
          <div className="hzx-prog-track"><motion.span style={{ scaleX: barScale }} /></div>
          <div className="hzx-prog-labels">
            {panelLabels.map((t, i) => <span key={i} className="lab">{t}</span>)}
          </div>
        </div>
        <div className="hzx-cue" ref={cueRef} aria-hidden="true"><span>Scroll to travel</span><i /></div>
      </div>
    </section>
  );
}

/* ---------- Panel shell ---------- */
const STOPS = [
  "oklch(0.315 0.108 27)", "oklch(0.235 0.090 27)", "oklch(0.150 0.052 28)",
  "oklch(0.205 0.078 26)", "oklch(0.140 0.048 29)", "oklch(0.260 0.098 27)",
  "oklch(0.120 0.040 29)",
];

function Panel({
  i, kind, stop, bg, children,
}: { i: number; kind: string; stop: number; bg?: ReactNode; children: ReactNode }) {
  const background = `linear-gradient(100deg, ${STOPS[stop]} 0%, ${STOPS[stop + 1]} 100%)`;
  return (
    <article className={`hzx-panel hzx-${kind}`} style={{ background }}>
      {bg}
      <div className="hzx-grain" />
      <div className="panel-inner">{children}</div>
      <div className="hzx-index"><span>{String(i + 1).padStart(2, "0")}</span> / {String(PANELS).padStart(2, "0")}</div>
    </article>
  );
}

/* ---------- Count-up that fires when its panel scrolls into view ---------- */
function CountUp({ value, dec }: { value: number; dec: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const [shown, setShown] = useState("0");
  const reduce = useReducedMotion();

  useEffect(() => {
    const fmt = (v: number) =>
      v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduce) { setShown(fmt(value)); return; }
    const unsub = mv.on("change", (v) => setShown(fmt(v)));
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animate(mv, value, { duration: 1.6, ease: [0, 0, 0.2, 1] });
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { unsub(); io.disconnect(); };
  }, [value, dec, reduce, mv]);

  return <span ref={ref}>{shown}</span>;
}

/* ---------- Live reefer set-point readout (bespoke detail) ---------- */
function TelematicsHud() {
  const [temp, setTemp] = useState("34.0");
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setTemp("34.0"); return; }
    let id: ReturnType<typeof setTimeout>;
    const drift = () => {
      setTemp((34 + (Math.random() * 0.4 - 0.2)).toFixed(1));
      id = setTimeout(drift, 1100 + Math.random() * 1000);
    };
    drift();
    return () => clearTimeout(id);
  }, [reduce]);
  return (
    <div className="hzx-hud" aria-hidden="true">
      <span className="hzx-hud-dot" />
      <span className="hzx-hud-k">Reefer</span>
      <span className="hzx-hud-v"><b>{temp}</b>°F</span>
    </div>
  );
}
