"use client";

import { company } from "@/lib/content";
import { scrollToId } from "./ui";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div className="fbrand">
            <div className="mark">Billing<br /><b>Trucking Inc.</b></div>
            <p className="tl">
              Temperature-controlled freight out of {company.city}. Produce, perishables and
              food-grade loads — hauled with the discipline a cold chain demands.
            </p>
          </div>
          <div className="reg">
            <div className="col">
              <h4>Sections</h4>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollToId("services"); }}>Capabilities</a>
              <a href="#story" onClick={(e) => { e.preventDefault(); scrollToId("story"); }}>Our Story</a>
              <a href="#coverage" onClick={(e) => { e.preventDefault(); scrollToId("coverage"); }}>Coverage</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>Request a Quote</a>
            </div>
            <div className="col">
              <h4>Contact</h4>
              <a href={company.phoneHref}>{company.phone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <p>{company.city}</p>
            </div>
            <div className="col">
              <h4>Registration</h4>
              <p>{company.usdot}</p>
              <p>{company.mc}</p>
              <p>{company.ca}</p>
            </div>
          </div>
        </div>
        <div className="bottom">
          <span>© {year} {company.name} · All rights reserved</span>
          <span>Turlock, CA · Refrigerated Freight · Est. {company.established}</span>
        </div>
      </div>
    </footer>
  );
}
