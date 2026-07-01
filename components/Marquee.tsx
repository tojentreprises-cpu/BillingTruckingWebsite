import { marqueeItems } from "@/lib/content";

export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee on-dark" aria-hidden="true">
      <span className="track">
        {items.map((t, i) => (
          <span className="item" key={i}>{t}<span className="dot" /></span>
        ))}
      </span>
    </div>
  );
}
