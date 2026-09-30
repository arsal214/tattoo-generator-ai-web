# TattooGenerator.com

US-focused AI tattoo design and planning platform: AI tattoo generator (Gemini), lettering/font tools, names, dates, symbols, size / placement / stencil planning tools, blog, credits and payments.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · MongoDB + Mongoose · Gemini API · Stripe Checkout (behind a provider interface).

## Quick start (local)

```bash
npm install
cp .env.example .env.local        # fill in values (see below)
npm run dev:db                    # optional: throwaway local MongoDB replica set, prints a MONGODB_URI
npm run seed                      # plans + 18 blog articles + indexes
npm run dev                       # http://localhost:3000
```

Without `GEMINI_API_KEY` everything works except image generation, which fails safely and refunds the credit.
`npx tsx --env-file-if-exists=.env scripts/dev-fake-generation.ts you@example.com 4` inserts sample designs so you can explore the dashboard without a key.

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Development / production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | 33 tests on an in-memory MongoDB (standalone, no transactions) |
| `npm run test:rs` | Same tests on a replica set (transactions on) |
| `npm run seed` | Upsert plans, blog posts, indexes (`-- --reset-plans` to overwrite plans from config) |

## Environment variables

See `.env.example`. Required: `MONGODB_URI`, `AUTH_SECRET` (32+ chars), `NEXT_PUBLIC_APP_URL`. Then:

| Feature | Variables |
|---|---|
| Gemini | `GEMINI_API_KEY`, `GEMINI_IMAGE_MODEL` (default `gemini-2.5-flash-image`) |
| Payments (Stripe) | `PAYMENT_SECRET` (secret key), `PAYMENT_WEBHOOK_SECRET` (`whsec_…`) |
| Image storage | `LOCAL_STORAGE_DIR` (default `public/generated`) |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` (password reset + contact form; logged to console in dev if unset) |

## Setup guides

**MongoDB** – Create an Atlas cluster (recommended: it is a replica set, so credit mutations also run inside transactions), allow your host's IPs, put the connection string in `MONGODB_URI`, then `npm run seed`. Standalone MongoDB also works: every credit path is idempotent and atomic without transactions (unique-key gates + conditional `$inc`).

**Gemini** – Create a key at <https://aistudio.google.com/apikey>, set `GEMINI_API_KEY`. The key is used only in `src/lib/ai/gemini.ts` on the server. Any image-capable Gemini model works via `GEMINI_IMAGE_MODEL`.

**Payments** – In Stripe: copy the secret key into `PAYMENT_SECRET`; add a webhook endpoint `https://YOUR_DOMAIN/api/payments/webhook` listening to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`; put its signing secret in `PAYMENT_WEBHOOK_SECRET`. Locally: `stripe listen --forward-to localhost:3000/api/payments/webhook`. Credits are granted **only** from the verified webhook (signature + amount + currency + session id must match the server-created Payment). To use another processor, implement `PaymentProvider` (`src/lib/payments/provider.ts`) and return it from `getProvider()`.

**Storage** – Generated images are written to `public/generated/` on local disk and served through `/api/files/*` (a route is used instead of direct `/generated/…` URLs because `next start` does not pick up files added to `public/` after startup). The host needs a persistent disk; back up that folder. Storage sits behind the `ImageStorage` interface in `src/lib/storage`, so another provider can be added later.

## Deployment

Any Node 20+ host. Set env vars, build once, run:

```bash
npm ci && npm run build && npm run seed && npm start   # PORT=3000
```
- **VPS/Docker** (required with local image storage): run behind nginx/Caddy (TLS), keep `X-Forwarded-For` trustworthy (used for rate limiting), and mount a persistent volume at `public/generated`. Serverless hosts such as Vercel have no persistent disk, so they would lose images.
- After deploy: submit `https://YOUR_DOMAIN/sitemap.xml` to Search Console.

## Architecture

```
src/
  app/
    (site)/        public pages: home, [tool] (27 tool pages), blog, pricing, about, contact, legal
    (auth)/        login, signup, forgot/reset password (noindex)
    dashboard/     overview, generate, designs(+[id]), history, credits, pricing, settings (noindex, auth-gated)
    api/           route handlers (all wrapped by lib/api.ts)
    sitemap.ts robots.ts opengraph-image.tsx not-found.tsx error.tsx
  components/      ui by area: generator, tools (13 widgets), dashboard, marketing, pricing, layout, seo, blog, auth
  lib/
    config/        styles, placements, sizes, colors, plans, blog categories (single source of truth)
    tools/         registry + per-category content (27 ToolDefs), data (quotes, placements), pure helpers
    blog/          seed posts (18 articles), queries
    db/            connect, transaction helper, 12 Mongoose models
    services/      credits (ledger), generation, payments, auth, plans, email, analytics
    ai/            prompt engine, Gemini provider
    payments/      provider interface + Stripe
    storage/       image storage abstraction (local disk)
    auth/session   JWT cookie sessions (jose) + bcrypt
    api.ts rate-limit.ts errors.ts seo.ts og.tsx env.ts
scripts/           seed.ts, dev-db.ts, dev-fake-generation.ts
tests/             backend (credits, generation, payments), roman, size
```

### Credit safety
`applyCredits()` in `services/credits.ts` is the only code that changes a balance. It inserts a ledger row first (unique `(type, referenceId)` = idempotency gate), then does one conditional atomic `$inc` (`credits >= amount` in the filter, so no overdraw). Generation: create pending record (unique `(userId, idempotencyKey)`) → reserve 1 credit → Gemini → store image → mark success. Any failure marks the generation failed (atomic gate) and refunds exactly once. A sweeper (`sweepStale`) recovers crashed/timed-out requests. Signup bonus is created with the user document (unique email) plus a unique ledger row. Tests cover concurrent double-spend, duplicate signup, refund, replayed webhooks.

### Security
bcrypt (cost 12) · HttpOnly SameSite=Lax signed JWT cookie with server-side session version (password change/reset signs out all devices) · same-origin check on all state-changing requests + JSON-only bodies · zod validation on every input · ownership enforced inside queries (other users' ids return 404) · Mongo-backed fixed-window rate limits (login, signup, reset, generate, payments, public APIs) · no account enumeration on login/forgot · webhook signature verification with timestamp tolerance · security headers · secrets only in env · errors never leak internals.

## SEO summary
Unique title/description/canonical/OG/Twitter per page via `lib/seo.ts`; JSON-LD: WebSite/Organization/WebApplication (+offers) on home, WebApplication + BreadcrumbList + FAQPage on tool pages (FAQ is visible content), Article + BreadcrumbList on posts, BreadcrumbList on blog/pricing/legal; dynamic `sitemap.xml` (59 URLs: home, 27 tools, pricing, blog, categories, 18 posts, static pages) and `robots.txt` (blocks dashboard, api, auth); branded OG images per tool/post; clean URLs; `next.config.ts` holds the 301 redirect table; topical clusters (tools ↔ articles ↔ related tools) with contextual internal links; 404 page; semantic HTML with one H1 per page; ISR (`revalidate`) for tools/blog/pricing so pages are served statically.

## Routes
Public: `/`, all 27 tools (`/tattoo-generator`, `/tattoo-idea-generator`, `/tattoo-design-generator`, `/tattoo-name-generator`, `/tattoo-quote-generator`, `/couple-tattoo-generator`, `/tattoo-font-generator`, `/tattoo-lettering-generator`, `/cursive-…`, `/script-…`, `/gothic-…`, `/old-english-tattoo-generator`, `/tattoo-symbol-generator`, `/roman-numeral-…`, `/date-…`, `/initial-…`, `/zodiac-…`, `/coordinates-tattoo-generator`, `/tattoo-size-calculator`, `/tattoo-placement-guide`, `/tattoo-placement-visualizer`, `/tattoo-stencil-maker`, `/minimalist-…`, `/fine-line-…`, `/tribal-…`, `/geometric-…`, `/traditional-tattoo-generator`), `/pricing`, `/blog`, `/blog/category/[category]`, `/blog/[slug]`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/cookie-policy`. Private: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/dashboard/*`.

## API
`POST /api/auth/{register,login,logout,forgot-password,reset-password}` · `GET|PATCH /api/user` · `GET /api/credits` · `POST /api/generate` · `GET /api/generations` · `GET|DELETE /api/generations/:id` · `POST /api/generations/:id/favorite` · `GET /api/generations/:id/download` · `GET /api/files/*` (local storage) · `GET /api/plans` · `POST /api/payments/create` · `POST /api/payments/webhook` · `GET /api/blog` · `GET /api/blog/:slug` · `POST /api/analytics` · `POST /api/contact`. Errors: `{ "error": { "code", "message" } }`.

## Testing checklist
- `npm run typecheck && npm test && npm run test:rs && npm run build`
- Signup shows "20 free credits added!" and balance 20; duplicate email rejected
- Generate: −1 credit; provoke a failure (wrong key) → credit refunded, friendly error, history shows failed
- 0 credits → "You're out of credits." + View Plans / Upgrade; Generate disabled
- Gallery: favorite, download, delete, open detail; another user's design id → 404
- Payment: Stripe test checkout → webhook → credits added once (resend event: no change); redirect alone adds nothing
- Password reset end to end; old sessions invalidated
- Each public page: title, description, canonical, single H1, JSON-LD, OG (view-source or a validator)
- Mobile at 375 / 390 / 414 / 768 / 1024 / 1440: no horizontal scroll (verified by script on all 45 content pages)

## Remaining configuration that needs real credentials / decisions
1. `GEMINI_API_KEY` (image generation was verified up to the model call; the failure/refund path is tested, the success path is tested with a stubbed provider — run one real generation after adding the key).
2. Stripe keys + webhook endpoint (webhook logic is tested with signed payloads; run a Stripe test-mode checkout once).
3. A persistent disk (or volume) for `public/generated`.
4. `RESEND_API_KEY` for password-reset and contact emails.
5. Legal pages: replace `[Legal entity name]`, governing-law placeholders, and have counsel review. Confirm whether purchased credits expire (the Terms are silent).
6. Quote generator translations (Latin/Spanish/French/Italian) should get a native-speaker review before launch.
7. Not built (architecture ready): email verification flow, Google sign-in (User model has `providers`), admin UI (User has `role`, `requireAdmin()` exists, models cover users/plans/payments/posts). Analytics is stored in MongoDB (`AnalyticsEvent`); add GA/Plausible in `lib/client/api.ts#track` if desired.
