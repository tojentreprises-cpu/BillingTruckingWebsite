/* ============================================================
   Public runtime config (safe to ship to the browser).

   - WEB3FORMS_ACCESS_KEY is a *submit-only* token: it can only deliver
     a message to the inbox you registered at web3forms.com. It cannot
     read submissions or send anywhere else, so it is NOT a secret.
   - TURNSTILE_SITE_KEY is the public half of a Cloudflare Turnstile pair.
     The matching *secret* key lives ONLY in your Web3Forms dashboard and
     is never shipped to the browser.

   Set these in `.env.local` (see .env.local.example). NEXT_PUBLIC_* vars
   are inlined at build time, which is fine because both values are public.
   ============================================================ */

export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const FORM_ENDPOINT = "https://api.web3forms.com/submit";

// Defence-in-depth: cap every field so a bot can't post a huge payload.
export const MAX_LEN: Record<string, number> = {
  name: 80,
  company: 120,
  email: 120,
  phone: 40,
  type: 40,
  pickup: 120,
  delivery: 120,
  details: 2000,
};
