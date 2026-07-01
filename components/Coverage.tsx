"use client";

import { motion } from "framer-motion";
import { coverageRows } from "@/lib/content";
import { Reveal } from "./ui";

/* Western-U.S. service map built from real lon/lat, projected with an
   equirectangular + latitude correction so CA/OR/NV/AZ sit true. */
const VB_W = 480, VB_H = 600, PAD = 30;
const lonMin = -124.7, lonMax = -108.9, latMin = 31.0, latMax = 46.5;
const latMid = (latMin + latMax) / 2;
const kx = Math.cos((latMid * Math.PI) / 180);
const spanX = (lonMax - lonMin) * kx, spanY = latMax - latMin;
const s = Math.min((VB_W - 2 * PAD) / spanX, (VB_H - 2 * PAD) / spanY);
const offX = PAD + ((VB_W - 2 * PAD) - spanX * s) / 2;
const offY = PAD + ((VB_H - 2 * PAD) - spanY * s) / 2;
const P = (lon: number, lat: number): [number, number] => [
  offX + (lon - lonMin) * kx * s,
  offY + (latMax - lat) * s,
];
const poly = (pts: [number, number][]) =>
  pts.map((p, i) => { const [x, y] = P(p[0], p[1]); return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ") + " Z";

const CA: [number, number][] = [
  [-124.21, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.63, 35.0], [-114.47, 34.72],
  [-114.14, 34.3], [-114.34, 34.03], [-114.5, 33.0], [-114.62, 32.74], [-117.13, 32.53],
  [-117.32, 33.2], [-118.19, 33.74], [-118.94, 34.03], [-120.47, 34.45], [-120.64, 34.9],
  [-121.88, 36.6], [-122.4, 37.0], [-122.51, 37.78], [-123.0, 38.3], [-123.72, 38.91],
  [-124.36, 40.44], [-124.11, 41.0], [-124.21, 42.0],
];
const OR: [number, number][] = [
  [-124.21, 42.0], [-117.03, 42.0], [-117.03, 43.8], [-116.9, 44.3], [-117.23, 44.43],
  [-117.05, 45.0], [-116.92, 45.6], [-117.03, 46.0], [-118.99, 45.93], [-119.62, 45.91],
  [-120.21, 45.73], [-121.18, 45.71], [-122.24, 45.55], [-122.81, 45.66], [-123.21, 46.15],
  [-123.96, 46.26], [-124.07, 45.0], [-124.41, 43.8], [-124.55, 42.84],
];
const NV: [number, number][] = [
  [-120.0, 42.0], [-114.04, 42.0], [-114.04, 37.0], [-114.63, 36.14], [-114.74, 35.12],
  [-114.63, 35.0], [-120.0, 39.0],
];
const AZ: [number, number][] = [
  [-114.63, 35.0], [-114.74, 35.12], [-114.63, 36.14], [-114.04, 36.19], [-114.04, 37.0],
  [-109.05, 37.0], [-109.05, 31.33], [-111.07, 31.33], [-114.81, 32.49], [-114.62, 32.74],
  [-114.5, 33.0], [-114.34, 34.03], [-114.14, 34.3], [-114.47, 34.72],
];
const states = [
  { id: "CA", d: poly(CA) }, { id: "OR", d: poly(OR) },
  { id: "NV", d: poly(NV) }, { id: "AZ", d: poly(AZ) },
];

const [hubX, hubY] = P(-120.85, 37.49);
const dests = [
  { lon: -121.49, lat: 38.58, n: "Sacramento", anchor: "start" as const, dx: 11, dy: 4 },
  { lon: -118.24, lat: 34.05, n: "Los Angeles", anchor: "start" as const, dx: 11, dy: 4 },
  { lon: -112.07, lat: 33.45, n: "Phoenix", anchor: "end" as const, dx: -11, dy: 4 },
  { lon: -115.14, lat: 36.17, n: "Las Vegas", anchor: "start" as const, dx: 11, dy: 4 },
  { lon: -122.68, lat: 45.52, n: "Portland", anchor: "start" as const, dx: 11, dy: 4 },
].map((d) => { const [x, y] = P(d.lon, d.lat); return { ...d, x, y }; });

const lane = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1, bend = len * 0.13;
  const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
  return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
};

export default function Coverage() {
  return (
    <section className="block on-ink" id="coverage">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow"><i className="tick" />Coverage</span>
            <Reveal as="h2" className="sec-title">From Turlock,<br />across the West.</Reveal>
          </div>
          <Reveal className="sec-lead" delay={120}>
            Our home base sits in California&apos;s Central Valley — the produce engine of the country.
            From there, we run cold freight across California, up to Oregon, and out through Nevada and
            Arizona to wherever your load needs to land.
          </Reveal>
        </div>
        <div className="cov">
          <Reveal className="lanes">
            <div className="grid-bg" />
            <svg className="cov-map" viewBox="0 0 480 600"
              aria-label="Coverage map: Turlock hub serving California, Oregon, Nevada and Arizona — Sacramento, Los Angeles, Portland, Las Vegas and Phoenix.">
              <defs>
                <linearGradient id="covFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--maroon-2)" stopOpacity="0.30" />
                  <stop offset="1" stopColor="var(--maroon-ink)" stopOpacity="0.16" />
                </linearGradient>
                <filter id="covGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="var(--maroon-3)" floodOpacity="0.35" />
                </filter>
              </defs>
              <g filter="url(#covGlow)">
                {states.map((st) => <path key={st.id} className="cov-state" d={st.d} fill="url(#covFill)" />)}
              </g>
              {dests.map((d, i) => <path key={"l" + i} className={`lane-line ${i % 2 ? "dim" : ""}`} d={lane({ x: hubX, y: hubY }, d)} />)}
              {dests.map((d, i) => (
                <g key={"d" + i}>
                  <circle className="dest-halo" cx={d.x} cy={d.y} r="9" />
                  <circle className="dest-dot" cx={d.x} cy={d.y} r="4.5" />
                  <text x={d.x + d.dx} y={d.y + d.dy} textAnchor={d.anchor} fill="rgba(255,255,255,.82)"
                    style={{ font: "400 12.5px var(--font-mono)", letterSpacing: ".05em" }}>{d.n}</text>
                </g>
              ))}
              <circle className="lane-pulse" cx={hubX} cy={hubY} r="22">
                <animate attributeName="r" values="14;32;14" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values=".55;0;.55" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle className="hub-dot" cx={hubX} cy={hubY} r="7.5" />
              <text x={hubX + 13} y={hubY - 3} fill="#fff" style={{ font: "800 15px var(--font-display)", textTransform: "uppercase" }}>Turlock</text>
              <text x={hubX + 13} y={hubY + 13} fill="var(--maroon-3)" style={{ font: "400 10.5px var(--font-mono)", letterSpacing: ".14em" }}>HOME BASE</text>
              <text x="30" y="582" fill="rgba(255,255,255,.34)" style={{ font: "400 10px var(--font-mono)", letterSpacing: ".22em" }}>WESTERN U.S. · SERVICE MAP</text>
            </svg>
          </Reveal>
          <div className="cov-list">
            {coverageRows.map((r, i) => (
              <motion.div className="row" key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
                <div className="name">{r[0]}</div>
                <div className="meta">{r[1]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
