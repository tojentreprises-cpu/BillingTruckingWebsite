# Billing Trucking Inc. — Website (v2)

Temperature-controlled produce & food-grade freight out of Turlock, California.
A rebuild of the original Claude Design handoff prototype into a production
**Next.js 14 + TypeScript + Tailwind + Framer Motion** application.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run lint
```

The app uses `output: 'export'`, so `npm run build` produces a fully static site
in `out/` that can be hosted on GitHub Pages, S3, Netlify, etc.

## Architecture

```
app/
  layout.tsx              fonts (next/font), metadata, skip link
  page.tsx                section assembly
  globals.css             design tokens + base/section/nav/contact/footer styles
  horizontal.css          pinned horizontal storytelling track styles
components/
  Nav.tsx                 sticky nav, mobile menu
  Hero.tsx                full-bleed parallax hero
  Marquee.tsx             brand marquee
  HorizontalShowcase.tsx  scroll-pinned horizontal journey (Framer Motion)
  Coverage.tsx            projected SVG service map of the western U.S.
  Contact.tsx             validated quote-request form
  Footer.tsx              registration + links
  ui.tsx                  Arrow, ServiceIcon, Magnetic, Reveal, scrollToId
lib/
  content.ts              ALL copy / data — edit here to update the site
public/
  assets/                 hero + story photography
```

## Contact form (secure email delivery)

The quote form emails **billingtrucking@yahoo.com** via [Web3Forms](https://web3forms.com)
— a turnkey service, so it works on static hosting (GitHub Pages) with **no server
and no secret in the browser**.

**One-time setup:**

1. Sign up free at web3forms.com using `billingtrucking@yahoo.com` → copy the **Access Key**.
2. (Recommended) Create a free [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
   widget → note the **Site Key** and **Secret Key**. Paste the *Secret* key into the
   Web3Forms dashboard (Settings → Spam protection → Cloudflare Turnstile).
3. `cp .env.local.example .env.local` and fill in:
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-access-key
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key   # optional
   ```
4. Rebuild. Done. (Both keys are public/safe; the Turnstile *secret* lives only in
   the Web3Forms dashboard.)

**Security measures built in:**

- No server secret ever reaches the browser — the Access Key is submit-only and can
  only deliver to your inbox.
- **Cloudflare Turnstile** invisible bot check, verified server-side by Web3Forms.
- **Honeypot** field silently drops bots.
- **Per-field length caps + strict validation** limit abuse payloads.
- Visitor email goes in **Reply-To only** → email-header injection is impossible.
- Loading / error / success states with `aria-live`; `mailto:` + phone fallback always shown.

If keys aren't set, the form degrades gracefully: it shows a message directing
visitors to the phone/email on the left rather than silently failing.

## Editing content

Resume-style edits (phone, email, registration numbers, services, lanes,
numbers, coverage) all live in **`lib/content.ts`** — no component changes needed.

## What changed from the prototype

- Real framework: typed React components, no in-browser Babel transpile.
- `next/font` self-hosts Archivo / Manrope / Space Mono (no render-blocking CDN).
- The horizontal track is driven by Framer Motion `useScroll`/`useTransform`
  instead of a hand-rolled rAF loop.
- Scroll reveals + count-ups use Framer Motion / IntersectionObserver.
- The Story panel uses a self-hosted photo instead of an external Vimeo embed.
- Full `prefers-reduced-motion` and mobile (stacked) fallbacks preserved.

## Brand

Maroon + cream editorial. Tokens (oklch) in `app/globals.css` (`--maroon*`,
`--paper*`, `--ink*`). Fonts: Archivo (display), Manrope (body), Space Mono (mono).
