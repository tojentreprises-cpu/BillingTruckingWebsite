/* ============================================================
   Billing Trucking Inc. — site content / data
   Single source of truth for copy, contact details and section data.
   Edit here to update the site.
   ============================================================ */

export const company = {
  name: "Billing Trucking Inc.",
  city: "Turlock, California",
  established: "2003",
  phone: "+1 (209) 678-8432",
  phoneHref: "tel:+12096788432",
  email: "billingtrucking@yahoo.com",
  usdot: "USDOT 2207928",
  mc: "MC 766110",
  ca: "CA 561164",
};

export const navLinks: [string, string][] = [
  ["Services", "services"],
  ["Fleet & Story", "story"],
  ["Coverage", "coverage"],
  ["Contact", "contact"],
];

export const marqueeItems = [
  "Refrigerated Freight",
  "Produce & Food-Grade",
  "Temperature-Controlled",
  "Turlock · California",
  "Cold Chain, Handled",
  "Since 2003",
];

export type IconKey =
  | "snow" | "leaf" | "temp" | "route" | "monitor" | "shield";

export const services: { ic: IconKey; t: string; d: string; tag: string }[] = [
  { ic: "snow", t: "Refrigerated Freight", d: "Reefer trailers held at precise set-points — dock to dock, the cold chain never breaks.", tag: "Chilled · Frozen" },
  { ic: "leaf", t: "Produce & Food-Grade", d: "Fresh produce out of the Central Valley with food-safe handling shippers expect.", tag: "Farm to Receiver" },
  { ic: "temp", t: "Multi-Temp & Frozen", d: "Chilled and frozen commodities, equipment dialed in for the exact load you ship.", tag: "Set-Point Control" },
  { ic: "route", t: "Long-Haul & Regional", d: "Lanes out of Turlock across California, the West Coast and over-the-road.", tag: "CA · West · OTR" },
  { ic: "monitor", t: "24/7 Temp Monitoring", d: "Continuous telematics and reefer logging — tracked, recorded, accountable.", tag: "Tracked & Logged" },
  { ic: "shield", t: "Dedicated Lanes", d: "Consistent capacity for repeat freight, scheduled around your needs.", tag: "Repeat Capacity" },
];

export const numbers: { n: number; dec: number; suf: string; lbl: string; note: string }[] = [
  { n: 2.9, dec: 1, suf: "M", lbl: "Miles Since 2003", note: "Nearly three million, across the western U.S." },
  { n: 99, dec: 0, suf: "%", lbl: "On-Time", note: "Appointment-based freight" },
  { n: 100, dec: 0, suf: "%", lbl: "Temp-Monitored", note: "Continuous set-point logging" },
  { n: 23, dec: 0, suf: "", lbl: "Years Family-Run", note: "Turlock, California" },
];

export const process: { k: string; t: string; d: string }[] = [
  { k: "01", t: "Quote", d: "Send your commodity, lanes and pickup window. Most rates come back same day." },
  { k: "02", t: "Dispatch", d: "A reefer is assigned and pre-cooled to your exact set-point before loading." },
  { k: "03", t: "Cold Load", d: "Product loaded fast and sealed — temperature locked from the first mile." },
  { k: "04", t: "Monitored Transit", d: "Live telematics log the set-point continuously, the whole run." },
  { k: "05", t: "On-Time Delivery", d: "Appointment-based delivery with a clean, documented cold chain." },
];

export const lanes: { route: string; mi: string; com: string; note: string }[] = [
  { route: "Central Valley → Pacific NW", mi: "~1,150 mi", com: "Leafy greens & berries", note: "Set-point 34°F · two-day transit held to appointment." },
  { route: "Turlock → Southern California", mi: "~310 mi", com: "Mixed produce", note: "Same-day regional reefer runs, daily capacity." },
  { route: "CA → Mountain West", mi: "~900 mi", com: "Frozen & food-grade", note: "OTR lanes into UT · CO · ID, fully temp-logged." },
];

export const panelLabels = ["Intro", "Capabilities", "Numbers", "Story", "Process", "Lanes"];

export const coverageRows: [string, string][] = [
  ["California", "Sacramento · Los Angeles · Turlock HQ"],
  ["Arizona", "Phoenix"],
  ["Nevada", "Las Vegas"],
  ["Oregon", "Portland"],
];

export const freightTypes = [
  "Refrigerated / Chilled",
  "Frozen",
  "Produce / Food-Grade",
  "Multi-Temp",
  "Other",
];
