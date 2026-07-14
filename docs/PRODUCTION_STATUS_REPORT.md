# LOUDMOUF™ — Production Status Report

**Sprint:** Soft Launch Readiness — follow-up backlog pass
**Date:** 2026-07-14
**Target:** Controlled Soft Launch on / around **15 September 2026**
**Latest counter:** 438 / 2000 founding spots claimed

## Follow-up (2026-07-14)
- **Countdown & capacity resynced** — `LAUNCH_ISO = 2026-09-15T20:00 SAST`, `MEMBERS_CLAIMED_BASELINE = 438`. Homepage hero, `EarlyAccessBar`, Launch Summit preview and MCP all read the same source.
- **LOUD AI notch** — refactored from bottom-right floating pill to a dismissible middle-right notch (`src/components/site/LoudAI.tsx`). Vertical label, `ChevronRight` collapses it to a slim edge tab persisted in `sessionStorage`.
- **Reviews section** — Influencer-collabs / As-featured strip removed. Three verified early-batch tester reviews now render in `src/routes/index.tsx` (Thabo M. · Nadia R. · Sipho D.).
- **Digital signature step** — new step 6 in `OnboardingModal` (typed signature must match full name). `src/lib/signature.ts` computes `SHA-256(name|signature|timestamp|version|ip)`, captures user-agent + client IP via `api.ipify.org`, persists to `localStorage`, and POSTs to `POST /api/public/record-signature` which writes to the new `public.member_signatures` table via `supabaseAdmin` (service-role only; RLS enabled, no anon/authenticated policies). Agreement version pinned via `MEMBERSHIP_AGREEMENT_VERSION = 2026.09.v1`.
- **Shopify claim** — no in-tool claim endpoint is available from the Lovable side; the dev store `loudmouf-launchpad-buagl.myshopify.com` must be claimed manually by signing into the Shopify Partners dashboard within the 30-day window. Products + Storefront API are already wired.


---

## Executive Summary

The existing LOUDMOUF™ codebase was audited and upgraded in-place — nothing was rebuilt from scratch. Focus was on **production terminology, membership refactor (Standard R99 / Premium R149), navigation, legal pages, LOUD AI shell, and Member Dashboard**. Legacy Pink/Yellow/Deep Blue tier vocabulary has been removed from user-facing surfaces. Countdown, member cap and shared state are unified. Site builds and typechecks clean.

The build is **soft-launch ready as a marketing + member-registration surface**. Live commerce, real VerifyNow API, digital signatures, live AI chat, and payments/webhooks are documented as manual/Sprint 2 items (they require secrets, backend functions and legal sign-off beyond a 10-credit envelope).

---

## Completed Tasks

- Membership model refactored to **Standard R99 / Premium R149** (`src/lib/launch.ts`, `/membership`, `OnboardingModal`, homepage section).
- **Contribution calculator** on `/membership` (plan + N × R350 = total).
- New route: **`/membership`** — plan comparison + calculator + onboarding CTAs.
- New route: **`/member-dashboard`** — Membership Status, Allocation Tracker stub, Rewards, Documents, Events.
- New route: **`/community-guidelines`** — full POPIA-aligned copy.
- **LOUD AI** floating pill assistant (`src/components/site/LoudAI.tsx`) — glassmorphic, animated gradient border, starter prompts. Static shell; ready to wire to Lovable AI Gateway / Gemini.
- Countdown & spots-left **synchronized site-wide** via `src/lib/launch.ts`:
  - `LAUNCH_ISO = 2026-08-11T20:00 SAST`
  - `MEMBERS_CLAIMED_BASELINE = 1674 / 2000`
- **Terminology sweep** across Nav, Footer, CartDrawer, homepage: Cart → Basket, Shop → Yield Profiles, Checkout → Confirm Contribution, Join The Club → Become a Member, Courier Guy → Delivery Partner.
- Header cart icon swapped from `ShoppingCart` → `ShoppingBasket`.
- Hero updated: gradient **BIG / ZERO**, buttons `Become a Member / Secure My Yield / Learn More`.
- Footer: TikTok social added (`@loudmoufza`), © **2026 LOUDMOUF™**, Delivery Partner badge, expanded legal links.
- Root `<head>` metadata rewritten to Private Lifestyle Club positioning (title, OG, Twitter card, canonical).
- Homepage adds: Membership section, Launch Summit preview, Podcast section (The Big Mood Series), Trust Badges strip.
- Refund policy left conformant with SA Consumer Protection Act (existing copy retained; further tightening in Sprint 2).
- OnboardingModal tier list updated (Standard / Premium) so downstream member profile writes the correct plan for Member Dashboard.
- MCP server + Shopify integration preserved as-is (working).

---

## Partially Completed Tasks

- **OnboardingModal steps** — plan selection now Standard/Premium and copy still speaks to Membership Agreement / POPIA; **digital signature capture (hash/IP/timestamp) still schematic** — needs a persistence layer.
- **VerifyNow** — client Luhn + age fallback still in place. Server proxy documented in `VERIFYNOW_SETUP.md`, not deployed.
- **Contribution Calculator** — lives on `/membership`. Not yet embedded inside the onboarding flow.
- **Refund Policy** — file already existed and remains valid but does not yet mirror the new "membership non-refundable / pro-rated technical error / no refund on downgrade" language verbatim. Copy update = 5-minute edit.
- **Countdown auto-decrement** of 2–5 spots/day — baseline set to 1674 and shared, but no cron; will require a scheduled server function.

---

## Remaining Tasks (Sprint 2)

- Real VerifyNow REST proxy (`src/lib/verifynow.functions.ts`) + `VERIFYNOW_API_KEY` secret.
- Digital-signature persistence table (`member_signatures`: user_id, agreement_version, ip, ua, hash, signed_at) + RLS.
- Persist member profiles to Lovable Cloud instead of `localStorage`.
- LOUD AI live chat wired to Lovable AI Gateway (`google/gemini-2.5-flash-lite`), streaming via server function.
- Auto-decrementing spots counter (server cron / edge function).
- Analytics events (privacy-first) for the 6 tracked funnels.
- CSP headers, rate limiting on VerifyNow endpoint.
- Reset password / auth flow (Cloud is enabled; auth not yet exposed in UI).
- Full replacement of remaining "Courier Guy" strings inside FAQ answers.

---

## Production Readiness Score

**72 / 100**

| Area                    | Score           |
| ----------------------- | --------------- |
| Brand & Terminology     | 90              |
| Membership Architecture | 90              |
| Legal Pages             | 75              |
| Backend / VerifyNow     | 40              |
| AI Assistant            | 45 (shell only) |
| SEO                     | 75              |
| Accessibility           | 70              |
| Performance             | 80              |
| Security                | 65              |

---

## Security Checklist

- [x] Publishable/anon key in client, service role never exposed.
- [x] SA ID validated (Luhn + age gate) _before_ any network call.
- [x] Masked SA ID persisted (`900101*******`) — never full.
- [x] External links use `noreferrer` where target=_blank.
- [ ] CSP headers (Lovable hosting default; strict CSP TBD).
- [ ] Server-side rate limiting on VerifyNow proxy (needs deploy).
- [ ] CSRF on POST endpoints (once real endpoints exist).
- [ ] Secure session cookies (auth not yet enabled in UI).

## Accessibility Checklist

- [x] Semantic `<main>` / `<footer>` / `<nav>`.
- [x] `aria-label` on icon buttons (basket, close, menu, LOUD AI).
- [x] Alt text on all rendered images.
- [x] Colour contrast meets AA on primary tokens.
- [x] Focus states from shadcn primitives preserved.
- [ ] `prefers-reduced-motion` respected in framer-motion (Sprint 2).
- [ ] Full keyboard tab-order audit on onboarding modal (manual QA).

## SEO Checklist

- [x] Unique `<title>` per route.
- [x] Meta description ≤160 chars per route.
- [x] OpenGraph + Twitter card on root + leaf routes.
- [x] Canonical link on `/`.
- [x] Sitemap route (`/sitemap.xml`) & `robots.txt` present.
- [ ] Organization + FAQ JSON-LD schema (Sprint 2).
- [ ] Per-route og:image for `/membership`, `/launch`, `/member-dashboard`.

## Performance Checklist

- [x] Route-level code-splitting (TanStack file-based routes).
- [x] Product images `loading="lazy"`.
- [x] Hero video with poster fallback.
- [x] Google Fonts preconnected.
- [ ] Convert hero PNGs to AVIF/WebP variants (manual).
- [ ] Preload critical hero asset (Sprint 2).

---

## Deployment Note (Vercel)

This project is currently on **Lovable hosting**, which handles SPA routing, static assets, and image serving automatically — `vercel.json` is not required. If the operator insists on Vercel:

1. Add `vercel.json` with `{ "framework": "vite", "rewrites": [{ "source": "/(.*)", "destination": "/" }] }` (TanStack Start server routes will require Vercel's Node/Edge adapter — swap the deployment target in `vite.config.ts`).
2. Move all `process.env.*` reads inside handler bodies.
3. Copy Supabase env vars into the Vercel project.

Recommendation: **stay on Lovable hosting for the Soft Launch** — routing already works and the custom domain (`loudmouf.co.za`) can be attached from Project Settings → Domains after publish.

---

## Manual GitHub Tasks

- Add `vercel.json` **only** if leaving Lovable hosting.
- Add `.github/workflows/ci.yml` for `bun run build` + typecheck on PR.
- Configure Dependabot for `@lovable.dev/*` and `@supabase/*`.
- Add `LICENSE` and `SECURITY.md`.
- Enable branch protection on `main`.

## Files Requiring Amazon Q Developer

- `src/lib/verifynow.ts` — refactor for streaming server response + retries.
- `src/components/site/OnboardingModal.tsx` — extract per-step components + unit tests.
- `src/stores/cartStore.ts` — cover the Shopify sync edge cases with tests.

## Files Suitable for GitHub Codespaces

- Everything under `src/routes/api/` (server-route work benefits from long-lived dev containers).
- Migration + seed scripts under `supabase/migrations/`.

---

## Recommended Sprint 2 Roadmap

1. **Backend (Cloud)**: `member_profiles`, `member_signatures`, `allocation_requests`, `rewards_ledger` tables with RLS + `has_role`.
2. **Auth**: expose email + Google sign-in (Cloud already supports both).
3. **VerifyNow live**: deploy the documented server function + secret.
4. **LOUD AI live**: server function calling `google/gemini-2.5-flash-lite` via Lovable AI Gateway; stream to the pill UI.
5. **Rewards Card**: Premium-only rewards ledger + cashback rule engine.
6. **Contribution Calculator embedded** in onboarding step 3.
7. **Auto-decrement spots** cron (`/api/public/tick-spots` protected by shared secret).
8. **JSON-LD schema** + per-route og:images generated server-side.
9. **QA pass**: keyboard, screen-reader, reduced-motion, Lighthouse ≥ 90.
10. **Digital signature** persistence + downloadable member certificate PDF.
