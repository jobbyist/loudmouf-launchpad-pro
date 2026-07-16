# LOUDMOUF™ Production Status Report

**Updated:** 2026-07-16 · **Production Readiness: 82/100**

## Shipped this sprint (Phase 1-5 consolidated)

### Backend & Data
- **Supabase schema live**: `profiles`, `user_roles` (admin/moderator/member), `said_verifications`, `newsroom_articles`, `article_likes`, `article_comments` (with pending/approved/rejected moderation states), `analytics_events`, `referral_attributions`, `shopify_orders`. RLS enabled with GRANTs.
- **Auth**: `/auth` route (email + password sign-in / sign-up). Protected `/_authenticated/` layout; `/member-dashboard` gated behind Supabase Auth. Auto profile creation via `handle_new_user()` trigger with a unique `referral_code` per user.
- **Analytics helper** (`src/lib/analytics.ts`) records events for signup, signin and other funnel actions into `analytics_events`.

### Newsroom (Firecrawl + Gemini pipeline)
- Firecrawl connector linked (direct API mode).
- `src/lib/news.server.ts` — search cannabis queries → scrape markdown → generate 1000–1500 word summaries via Gemini 2.5 Flash on the Lovable AI Gateway → insert into `newsroom_articles` with branded gradient thumbnails.
- Public webhook route `/api/public/hooks/scrape-articles` (POST triggers a run).
- `pg_cron` job `newsroom-firecrawl-scrape` runs daily at **04:20 SAST**.
- Homepage newsroom section retitled **"SIGNALS FROM THE PLANT WORLD"** with new subtitle and **View All Articles** link. Nav updated with Newsroom link.
- `/newsroom` and `/newsroom/:slug` now read from Supabase (seeded articles are still a fallback).
- Likes and comments backed by Supabase; comments default to `pending` for moderator approval.

### Shopify
- **Order webhook** at `/api/public/hooks/shopify-orders` — verifies HMAC (if `SHOPIFY_WEBHOOK_SECRET` set), upserts orders into `shopify_orders`, detects Standard/Premium tier and records **10% referral commission** in `referral_attributions` when a `referral_code` note attribute is present.

### Referrals
- New `/referrals` page — signed-in members see their unique link, referred-member count and pending/paid commission balance. Ambassador terms documented.

### Terminology & polish
- All "Cart" → "Basket", "Pre-Order" → "Reserve", "Courier Guy" → "our delivery partner" across routes and components.
- Onboarding welcome dialog button changed to **"Reserve Your Share"** which scrolls to the product section on the homepage.

### SEO
- Sitemap (`/sitemap.xml`) now dynamically includes every published newsroom article plus membership, referrals and community routes.
- Every route has a unique `<title>`, description, og:*, and twitter:card set.

## Outstanding for full production readiness

1. **Shopify store claim** — dev store must be claimed within 30 days to keep it. User action.
2. **Create Shopify "LOUDMOUF™ Membership" product** with Standard (R99) and Premium (R149) variants in the Shopify admin, then wire the variant IDs into `CartDrawer` so the membership fee becomes a real line item at checkout.
3. **Register the Shopify webhook** in the Shopify admin pointing at `/api/public/hooks/shopify-orders` and paste the signing secret into `SHOPIFY_WEBHOOK_SECRET`.
4. **Google sign-in** (currently email/password only) — enable via `configure_social_auth`.
5. **Persist onboarding data to Supabase** — write `profiles`, `said_verifications`, and `member_signatures.user_id` when the user is authenticated at onboarding time (today onboarding still stores to `localStorage`).
6. **Comment moderation admin UI** — RLS/roles are ready; add a `/admin/comments` page for moderators/admins to approve or reject pending comments.
7. **Payouts pipeline** for referral commissions (EFT export from `referral_attributions` where `status = 'approved'`).
8. **Rate limiting** on `/api/chat`, `/api/public/hooks/scrape-articles`, and the VerifyNow proxy.

## Security posture
`has_role()` remains callable by authenticated users (required for RLS). All other SECURITY DEFINER functions have `EXECUTE` revoked from `anon`/`authenticated`. Service role key never leaves server-only code paths.
