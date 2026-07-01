"use client";

import { useRef, useState } from "react";
import { company, freightTypes } from "@/lib/content";
import { WEB3FORMS_ACCESS_KEY, TURNSTILE_SITE_KEY, FORM_ENDPOINT, MAX_LEN } from "@/lib/config";
import { Arrow, Magnetic, Reveal } from "./ui";
import Turnstile from "./Turnstile";

type Fields = {
  name: string; company: string; email: string; phone: string;
  type: string; pickup: string; delivery: string; details: string;
};
const EMPTY: Fields = { name: "", company: "", email: "", phone: "", type: "", pickup: "", delivery: "", details: "" };
type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errs, setErrs] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Honeypot: bots fill hidden fields; humans never see it. If set → silently drop.
  const honeypot = useRef("");
  // Cloudflare Turnstile token (empty until the invisible check passes).
  const [token, setToken] = useState("");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value.slice(0, MAX_LEN[k] ?? 500) }));

  const validate = () => {
    const er: Partial<Record<keyof Fields, string>> = {};
    if (!f.name.trim()) er.name = "Please enter your name";
    if (!f.email.trim()) er.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = "Enter a valid email";
    if (!f.type) er.type = "Select a freight type";
    setErrs(er);
    return er;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const er = validate();
    if (Object.keys(er).length > 0) {
      const first = (["name", "email", "type"] as const).find((k) => er[k]);
      if (first) document.getElementById("cf-" + first)?.focus();
      return;
    }

    // Honeypot tripped — pretend success, send nothing.
    if (honeypot.current) { setStatus("sent"); return; }

    if (!WEB3FORMS_ACCESS_KEY) {
      setErrorMsg("The form isn't configured yet. Please email or call us directly — details are on the left.");
      setStatus("error");
      return;
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setErrorMsg("Please complete the verification check just above, then submit again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const payload: Record<string, string> = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New quote request — ${f.type || "Freight"} · Billing Trucking website`,
        from_name: "Billing Trucking Website",
        // Visitor's email goes in Reply-To only — never in From/To headers,
        // so header injection is impossible; Web3Forms fixes the destination.
        replyto: f.email,
        name: f.name,
        company: f.company,
        email: f.email,
        phone: f.phone,
        freight_type: f.type,
        pickup: f.pickup,
        delivery: f.delivery,
        details: f.details,
        botcheck: "",
      };
      if (token) payload["cf-turnstile-response"] = token;

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("sent");
      } else {
        setErrorMsg(data?.message || "Something went wrong sending your request. Please try again, or email us directly.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error — please check your connection and try again, or email us directly.");
      setStatus("error");
    }
  };

  const reset = () => { setStatus("idle"); setF(EMPTY); setErrs({}); setErrorMsg(""); setToken(""); };

  return (
    <section className="block" id="contact">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow"><i className="tick" />Get In Touch</span>
            <Reveal as="h2" className="sec-title">Have a cold load<br />that needs moving?</Reveal>
          </div>
          <Reveal className="sec-lead" delay={120}>
            Tell us about your freight and lanes. We&apos;ll get back to you with capacity and a rate — usually same day.
          </Reveal>
        </div>

        <div className="contact">
          <Reveal className="info">
            <div className="line"><div className="k">Phone</div><div className="v"><a href={company.phoneHref}>{company.phone}</a><small>Dispatch &amp; quotes</small></div></div>
            <div className="line"><div className="k">Email</div><div className="v"><a href={`mailto:${company.email}`}>{company.email}</a><small>We reply same business day</small></div></div>
            <div className="line"><div className="k">Based In</div><div className="v">{company.city}<small>Serving the Central Valley &amp; the West</small></div></div>
            <div className="line"><div className="k">Registration</div><div className="v" style={{ fontSize: 18 }}>{company.usdot}<small>{company.mc} · {company.ca}</small></div></div>
            <div className="cal">
              <div className="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4M8 14h3" /></svg></div>
              <div className="t"><b>Prefer to book a call?</b><span>Calendly scheduling — link goes here.</span></div>
            </div>
          </Reveal>

          <Reveal className="form" delay={100}>
            {status === "sent" ? (
              <div className="form-success" role="status">
                <div className="check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg></div>
                <h3>Quote request sent.</h3>
                <p>Thanks, {f.name.split(" ")[0] || "there"}. We&apos;ll be in touch shortly about your {f.type ? f.type.toLowerCase() : "freight"}.</p>
                <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={reset}>Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                {/* Honeypot — visually hidden, off-screen, not tabbable, ignored by humans */}
                <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  onChange={(e) => { honeypot.current = e.target.value; }}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

                <div className="grid2">
                  <div className={`field ${errs.name ? "err" : ""}`}>
                    <label htmlFor="cf-name">Name *</label>
                    <input id="cf-name" name="name" autoComplete="name" maxLength={MAX_LEN.name} value={f.name} onChange={set("name")} placeholder="Jane Doe"
                      aria-invalid={errs.name ? "true" : undefined} aria-describedby={errs.name ? "cf-name-err" : undefined} />
                    {errs.name && <div className="msg" id="cf-name-err" role="alert">{errs.name}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="cf-company">Company</label>
                    <input id="cf-company" name="company" autoComplete="organization" maxLength={MAX_LEN.company} value={f.company} onChange={set("company")} placeholder="Acme Produce Co." />
                  </div>
                </div>
                <div className="grid2">
                  <div className={`field ${errs.email ? "err" : ""}`}>
                    <label htmlFor="cf-email">Email *</label>
                    <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={MAX_LEN.email} value={f.email} onChange={set("email")} placeholder="jane@company.com"
                      aria-invalid={errs.email ? "true" : undefined} aria-describedby={errs.email ? "cf-email-err" : undefined} />
                    {errs.email && <div className="msg" id="cf-email-err" role="alert">{errs.email}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="cf-phone">Phone</label>
                    <input id="cf-phone" name="phone" type="tel" autoComplete="tel" maxLength={MAX_LEN.phone} value={f.phone} onChange={set("phone")} placeholder="(209) 555-0123" />
                  </div>
                </div>
                <div className={`field ${errs.type ? "err" : ""}`}>
                  <label htmlFor="cf-type">Freight Type *</label>
                  <select id="cf-type" name="type" value={f.type} onChange={set("type")}
                    aria-invalid={errs.type ? "true" : undefined} aria-describedby={errs.type ? "cf-type-err" : undefined}>
                    <option value="">Select freight type…</option>
                    {freightTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  {errs.type && <div className="msg" id="cf-type-err" role="alert">{errs.type}</div>}
                </div>
                <div className="grid2">
                  <div className="field"><label htmlFor="cf-pickup">Pickup</label><input id="cf-pickup" name="pickup" autoComplete="address-level2" maxLength={MAX_LEN.pickup} value={f.pickup} onChange={set("pickup")} placeholder="Turlock, CA" /></div>
                  <div className="field"><label htmlFor="cf-delivery">Delivery</label><input id="cf-delivery" name="delivery" maxLength={MAX_LEN.delivery} value={f.delivery} onChange={set("delivery")} placeholder="Seattle, WA" /></div>
                </div>
                <div className="field">
                  <label htmlFor="cf-details">Load Details</label>
                  <textarea id="cf-details" name="details" maxLength={MAX_LEN.details} value={f.details} onChange={set("details")} placeholder="Commodity, set-point temperature, weight, pickup window…" />
                </div>

                <Turnstile onToken={setToken} />

                {status === "error" && (
                  <div className="form-error" role="alert" aria-live="assertive">{errorMsg}</div>
                )}

                <Magnetic strength={0.18}>
                  <button type="submit" className="btn btn-primary submit" disabled={status === "sending"} aria-busy={status === "sending"}>
                    {status === "sending" ? "Sending…" : <>Send Quote Request <Arrow /></>}
                  </button>
                </Magnetic>
                <p className="form-privacy">Protected against spam. We only use your details to reply to this request.</p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
