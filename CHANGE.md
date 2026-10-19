# Change Log

Every change to the plan, flows and code for Real Bengal Sweets is recorded here, newest first.

Format per entry: **date · version**, then what was **Added / Changed / Removed / Fixed**, and which files were affected.

---

## 2026-10-20 · v0.7.1 — Vercel + Neon deployment setup

### Decided
- **Hosting:** Vercel, with Neon Postgres (created from Vercel Storage) and Vercel Blob for images. Netlify and MilesWeb were compared and dropped; see the chat comparison and DEPLOY.md §1.

### Added
- **Initial Postgres migration** `src/migrations/20261019_183337_initial` (237 tables), generated from the schema without a database connection.
- `vercel-build` script: Vercel runs `payload migrate` before `next build` on every deploy.
- **Vercel Blob** media storage (`@payloadcms/storage-vercel-blob`), used when `BLOB_READ_WRITE_TOKEN` is set. Falls back to S3/R2, then local disk.
- DEPLOY.md §4A rewritten as a step-by-step Vercel guide.

### Changed
- The database URL is read from `DATABASE_URI`, `DATABASE_URL` or `POSTGRES_URL`; the last two are the names Neon/Vercel set.
- Postgres never auto-changes its schema (`push: false`); production schema changes go only through committed migrations. SQLite keeps auto-sync for local development, with a separate `migrations-sqlite` folder.
- `.gitignore` ignores all `.env.*` files except `.env.example` (e.g. `.env.vercel` from `vercel env pull`).
- Removed the unpushed `netlify.toml` (Netlify dropped).

---

## 2026-10-19 · v0.7 — Phase 7: launch readiness

> **Verified locally:**
> - `tsc` and `next build` are clean.
> - **11/11 Playwright browser tests** pass in Chrome on desktop and mobile:
>   - homepage and mega menu
>   - bulk-discount hints and cart drawer
>   - pincode checker (Pune vs pan-India)
>   - **guest Cash on Delivery checkout with OTP, through to the confirmation page**
>   - build-a-box to cart
>   - phone OTP login
>   - enquiry form
>   - admin login
> - `npm run test:orders` passes 52/52.
> - On the **production server** (`npm start`):
>   - sitemap.xml has 45 URLs; robots.txt is correct
>   - Organization and WebSite structured data present; canonical URLs present
>   - security headers present
>   - CSV export works, and is refused without an admin login
>
> **Not verified:** the Postgres and S3/R2 code paths are wired and type-checked, but no Docker or Postgres was available to run them. Do a staging deploy first (DEPLOY.md).

### Added
- **SEO:**
  - `/sitemap.xml` (pages, products, categories, posts, boxes)
  - `/robots.txt` (blocks admin, cart, checkout, account and order pages)
  - canonical URLs on pages, products, categories and posts
  - Organization and WebSite (with site search) structured data
- **Analytics:** GA4 and Meta Pixel load when their IDs are set in **Site settings → Integrations**. Events: `add_to_cart` (every add path), `begin_checkout` and `purchase` (counted once per order).
- **Security headers:** `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` (keeps live preview working), `Permissions-Policy`.
- **Production database and storage:**
  - A `postgres://` `DATABASE_URI` switches to the Postgres adapter.
  - `S3_*` variables store media on S3 / Cloudflare R2.
  - New scripts: `migrate`, `migrate:create`, `migrate:status`.
- **Orders CSV export:** date range and status filter above the admin orders list. Owner and order-manager roles only. Formula-injection safe; opens correctly in Excel.
- **Playwright E2E** (`npm run test:e2e`):
  - warms the dev server first, waits for hydration, cleans up its test data
  - `playwright.config.ts` and `e2e/`
- **Deployment:** `Dockerfile` (standalone build via `NEXT_OUTPUT=standalone`), `.dockerignore`, and **DEPLOY.md** (hosting comparison, env vars, migrations, Vercel and VPS steps, go-live checklist).

### Fixed
- `robots.ts` must sit in the root `app/` folder; inside the storefront route group, `/robots.txt` returned an error page.
- Browser tests found that typing before React finished hydrating could be lost in dev mode. The storefront now sets a hydration marker the tests wait for. No change for shoppers.

### Decision needed
- **Hosting:** Vercel + Neon + R2 (recommended to start) or VPS + Docker. See DEPLOY.md §1. Deployment waits on this.

---

## 2026-10-19 · v0.6 — Phase 6: quantity discounts, build-a-box, enquiries, stores, blog

> **Verified locally:**
> - `tsc` and `next build` are clean.
> - `npm run test:orders` passes 52/52, including 15 new checks for quantity discounts and build-a-box.
> - An end-to-end run through the real server actions passes 8/8:
>   - enquiry validation and the spam trap
>   - a lead stored with its pipeline fields
>   - an order mixing a box and a bulk-discounted product, placed with COD
>   - the order page showing the discount and box contents
> - All new pages render the expected content.
>
> Not yet clicked through in a browser: the box builder, the enquiry form and the store map.

### Added
- **Quantity discounts** (admin → Orders → Quantity discounts):
  - Tiered "buy more, save more" rules for chosen products and/or categories.
  - Tiers can be **% off** or **₹ off each item**.
  - Counted **per product** or **mix & match** across all qualifying items, with start/end dates.
  - Recalculated on the server at checkout; a line gets the best matching rule.
  - The coupon applies **after** the bulk discount.
  - Storefront: a "Buy more, save more" tier table on product pages, live savings for the chosen quantity, a **Bulk offer** badge on product cards, and "Add N more to get X% off" hints in the cart drawer, cart page and checkout.
  - New **Quantity discount** line on the order, order page, invoice and per order item.
  - Demo rules: *Mithai bulk saver* (3+ = 5%, 6+ = 10% on kaju katli, the assorted box and chocolate sandesh) and *Namkeen mix & match* (any 3+ namkeen = 10%).
- **Build-your-own box** (admin → Shop → Build-a-box; `/build-your-box`):
  - Admin sets sizes (pieces, price, MRP), pickable sweets (image, extra price, per-box maximum, availability), packaging options, a message card toggle and delivery zones.
  - Customers pick a size, fill the slots with a live visual box, choose packaging, add a message, and add it to the cart as one line.
  - At checkout the server re-prices and validates the box: exact piece count, availability, per-sweet maximum, zone. Orders store the box contents.
  - Demo: *Build-your-own Mishti Box* (6/9/12 pieces, Pune only).
- **Enquiry form** page section:
  - Occasion fixed or chosen by the customer, optional company/quantity/budget/date fields, custom success text.
  - Honeypot spam trap and rate limit.
  - Alerts the team (Notifications → alert email) and acknowledges the customer by email/SMS.
  - **Lead pipeline** fields on Enquiries: assigned to, follow-up date, quoted value, source page.
  - Added to the Corporate Gifting page.
- **Store locator** (admin → Content → Stores; page section):
  - Store cards with address, hours, services, call and WhatsApp.
  - Embedded Google Map (no API key) and "Get directions".
  - Replaces the text on Our Stores.
- **Blog & Sweets Library** (admin → Content → Blog & Sweets Library):
  - One collection with two sections, drafts and live preview.
  - Pages `/blog`, `/blog/[slug]`, `/sweets-library`, `/sweets-library/[slug]` with reading time, tags and "Shop the story" products.
  - **Latest posts** page section, added to the homepage as "From the Sweets Library".
- **UI text — Gifting & content** (a third UI-text global): 40 new editable labels.
- Menu: **Build a Box**. Footer: **Blog** and **Sweets Library**.
- `/next/revalidate` (secret-protected): `npm run seed` now refreshes a running site's cache, so seeded content shows immediately instead of after up to 5 minutes.

### Fixed
- The seed's `updateGlobal` helper called itself (an infinite loop from a Phase 4 find-and-replace). It surfaced as "Maximum call stack size exceeded" the first time the seed updated a global on an existing database.
- `test:orders` now handles real Razorpay test keys: refunds of a fake payment can't succeed against the real API, so that check is mode-aware.

### Still pending (testing / decisions from you)
- **Phone SMS OTP via Firebase** (decided; not built yet).
- **WhatsApp Cloud API** for order updates (decided; not built yet; Meta test number needed).
- **Razorpay UPI / card payment testing** in the payment window.

---

## 2026-10-19 · v0.5.1 — UPI first in Razorpay checkout

### Added
- **Site settings → Commerce → "Show UPI first in the payment window"** (on by default). Razorpay Checkout opens with a **"Pay using UPI"** section on top (UPI ID / QR / apps), followed by the account's other enabled methods.
  *Files:* `src/payload/globals/SiteSettings.ts`, `src/lib/checkout-actions.ts`, `src/components/checkout/payment.tsx`, `src/lib/types.ts`
- UPI must also be **enabled on the Razorpay account** (Dashboard → Payment methods, in Test and Live mode). Code can't switch on a method the account doesn't allow.

---

## 2026-10-18 · v0.5 — Phase 5: customer accounts, order tracking, Shiprocket, providers

> **Verified locally:**
> - `tsc` and `next build` are clean.
> - `npm run test:orders` passes 37/37 checks.
> - An end-to-end run through the real server actions with cookies passes 20/20:
>   - a guest order is claimed after a later phone login
>   - wrong OTP rejected; the login cookie is set
>   - profile and addresses saved
>   - logged-in COD order with no OTP needed; new address saved to the account
>   - cart synced to the account
>   - order tracking: lookup succeeds with the right phone and is refused with the wrong one
>   - a tampered cookie is ignored; logout works
>
> **Not testable here:**
> - Real Google sign-in, Resend, MSG91 and Shiprocket all need your credentials. All four fall back safely without them.
> - The account and checkout screens haven't been clicked through in a browser.

### Added
- **Customers collection** (admin → Orders → Customers):
  - Name, phone (verified flag), email, Google id, sign-in methods.
  - Address book (up to 10 addresses, with a default).
  - Saved cart.
  - An **Orders tab** listing the customer's orders (join field).
- **Phone OTP login / sign-up**:
  - Sign-up and login are one flow.
  - Earlier **guest orders with the same phone are claimed** into the account automatically.
- **Google sign-in** (OAuth code flow, state checked via a signed cookie, ID token validated by Google):
  - Hidden until `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set.
  - **Account linking** in both directions (Google ↔ phone), with clear errors when a phone or Google account already belongs to someone else.
- **Sessions:** a signed (HMAC), HTTP-only, 30-day cookie (`rbs_session`), separate from admin auth.
- **Account page** (`/account`):
  - Login panel for guests; dashboard with order history and status badges.
  - Profile, sign-in methods (link Google / add phone).
  - Address book: add, edit, delete, make default.
  - Logout.
  - The header shows the shopper's first name when logged in.
- **Cart sync:** on login, the device cart and the account cart are merged; later changes are saved to the account.
- **Checkout for logged-in shoppers:**
  - Contact details and default address prefilled; saved-address picker; "Save this address to my account".
  - **COD skips the OTP** when the phone was already verified at login.
  - Orders are linked to the account, and missing profile details are filled in.
  - Guests see a "Log in for faster checkout" link.
- **Order tracking section** (new page builder block "Order tracking form"): order number + phone → order page, with basic brute-force throttling. Added to the existing Track Order page by `npm run seed`.
- **Shiprocket:**
  - Pan-India orders get a courier shipment (AWB tracking number, tracking link) automatically when marked **Packed**.
  - Uses package size and packaging weight from **Site settings → Shipping**, plus variant weights.
  - Without credentials, a test AWB is generated. Pune orders use your own riders, so no AWB.
- **Providers:**
  - **Resend** email adapter (`RESEND_API_KEY`).
  - **MSG91** SMS via the Flow API (`MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`).
  - Both fall back to the terminal.
- **UI text:** 36 new labels in a new global **"UI text — Account"**.
- `.env` / `.env.example`: Google, Resend, MSG91 and Shiprocket variables.

### Changed
- **UI text split across two globals** ("UI text" and "UI text — Account"). SQLite allows at most 127 arguments per function, and Payload reads all of a global's translatable fields in one call; the single global hit that limit.
- The OTP 30-second resend gap now applies per purpose, so a COD code no longer blocks a login code. The hourly cap still covers all codes.
- Removed redundant `index: true` from `unique` fields (slug, order number, customer phone). They caused "index already exists" errors when the dev database schema synced.
- `seed:fresh` now also clears customers.

### Known notes
- The local SQLite schema sync can fail **once** right after a schema change with "index … already exists"; running the command again works. Production should use Payload migrations with Postgres (Phase 7).

---

## 2026-10-18 · v0.4 — Phase 4: checkout, orders, payments, coupons

> **Verified locally:**
> - `tsc` and `next build` are clean.
> - `npm run test:orders` passes 26/26 checks of the order engine.
> - An end-to-end run through the real checkout server actions passes 18/18:
>   - quote with coupon
>   - validation errors
>   - Cash on Delivery with OTP (wrong code rejected)
>   - online payment through the simulator, including blocking double payment and resuming a payment later
>   - stock reserved and released
> - Over HTTP: the order page, token protection, invoice and packing slip, and webhook signature check behave correctly.
>
> Not yet clicked through in a browser: the checkout form UI itself, and the real Razorpay popup, which needs your test keys.

### Added
- **Checkout** (`/checkout`), four steps:
  1. Contact
  2. Delivery address (36 states and union territories)
  3. Delivery date & time slot for Pune; estimated date for pan-India
  4. Payment: online or Cash on Delivery

  Also: gift message, "hide prices", order notes and coupon code. A live order summary shows totals recalculated on the server, a free-delivery hint and line-item problems with a remove link. Contact details are remembered on the device.
- **Server-side pricing** (`src/lib/checkout.ts`): prices, stock, zone restrictions (e.g. rosogolla only in Pune), coupons, shipping fee and free-delivery threshold, minimum order, and Cash on Delivery limits are all recomputed from the database.
- **Orders collection** (admin → Orders):
  - Statuses from FLOW.md §5.
  - Every status change is logged with who, when and a note.
  - Stock is reserved on order and released on cancel, refund or return.
  - Coupon use is counted when an order is confirmed.
  - Refunds are issued automatically when an order is set to "refunded".
  - Customers are notified automatically.
  - Sidebar shows the total, plus links to the **printable invoice**, **packing slip** and the customer's order page.
- **Coupons** (admin → Orders → Coupons): % off with a cap, flat amount, or free delivery; minimum cart value, start/end dates, usage limits. Demo codes: `WELCOME10`, `FREEDELIVERY`, `BIJOYA250`.
- **Payments:**
  - **Razorpay** via the REST API, with signature verification and a webhook at `/api/razorpay/webhook`.
  - Without keys, a labelled **test-payment simulator** runs locally. Add `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (test keys) to `.env` to use real Razorpay test mode.
- **Cash on Delivery** with **phone OTP**:
  - Only a hash of each code is stored.
  - Codes expire in 10 minutes and are single-use, with 5 attempts per code, a 30-second resend gap and 5 requests per hour.
  - Locally the code is shown on screen and printed in the terminal.
- **Order page** `/order/[number]?t=token`:
  - Confirmed, pending or cancelled state.
  - Progress timeline, items, totals, delivery and gift details.
  - "Complete payment" retry while an order is unpaid.
  - The cart is cleared once the order is confirmed.
- **Auto-cancel** of unpaid online orders after the payment window (default 30 minutes); stock is returned.
- **Notifications global** (admin → Settings → Notifications):
  - Editable email subject, email body and SMS/WhatsApp text for: confirmed, shipped, out for delivery, delivered, cancelled, refunded.
  - New-order alert email for the shop team.
  - Written to the terminal locally.
- **Site settings → Commerce:** Cash on Delivery OTP toggle, gift options toggle, order number prefix, payment window.
- **UI text:** 52 new editable labels in the "Checkout" and "Order page" tabs.
- `scripts/check-orders.ts` (`npm run test:orders`), and Razorpay variables in `.env` / `.env.example`.

### Changed
- `npm run seed` adds the demo coupons to existing databases. `seed:fresh` now also clears orders, coupons and OTP codes.
- PLAN.md §13: Phase 4 marked done.

### Not in this phase
- Email and SMS providers (Resend, MSG91) are stubbed to the console; add them before going live.
- Shiprocket shipment creation, customer accounts, order tracking lookup: Phase 5.
- CSV export and admin dashboard widgets: Phase 7.

---

## 2026-10-18 · v0.3 — Phases 0–3 code: customization core, page builder, catalog

> **Verified locally** on Node 24.22 / Windows:
> - `tsc` passes clean.
> - `next build` succeeds; homepage first-load JS is 119 kB.
> - `npm run seed` loads all demo content.
> - Every storefront route returns 200, and unknown URLs return a proper 404.
> - Images are served and optimised.
> - Admin login works; the preview route is blocked for anonymous users; subscriber data isn't public.
> - Pincode zone logic and the IST cut-off pass tests.
> - Editing the Theme in the admin restyles the live site instantly via cache revalidation.
>
> Not yet clicked through in a browser: the pincode checker UI, cart drawer and live-preview panel.

### Added
- **Project setup:** `package.json` (Next.js 15, Payload 3, SQLite adapter, Tailwind 4, zustand), `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `.env` / `.env.example`, `.gitignore`, `README.md`.
- **Payload CMS** (`src/payload.config.ts`): English + optional Bengali localization, SQLite, local media, live-preview breakpoints.
- **Collections:** Pages (drafts + autosave + live preview), Products, Categories, Reviews, Delivery zones, Media, Enquiries, Newsletter subscribers, Admin users (roles: owner / editor / order manager).
  - **Products:** variants, MRP, stock, zone restriction, badges, tags, and auto-computed `priceFrom`, `maxDiscount`, `shipsPanIndia`, `rating`.
  - **Categories:** extra sections below the product grid.
  - **Reviews:** approval, featured flag, and an auto-synced product rating.
  - **Delivery zones:** pincode ranges, same-day cut-off, slots, blackout dates, fees, COD limits.
- **Globals:**
  - Theme: colours with a colour-picker field, Google fonts, sizes, radius, button shape, product-card options, custom CSS.
  - Header & menu: link, dropdown or mega menu with product thumbnails and a promo tile; top strip; popular searches.
  - Announcement bar, Footer.
  - Site settings: contact, socials, WhatsApp, commerce toggles, Bengali toggle, analytics.
  - UI text: every storefront label.
- **Page builder:** 13 blocks:
  - Hero, Category tiles, Product collection, Logo marquee
  - Feature tiles, Testimonials, Stats, Image with text
  - Banner strip, Text, Newsletter, FAQ, Spacer

  Every block has the shared **Section settings**: show/hide, start/end schedule, background, padding, width, desktop/mobile visibility, anchor, CSS class.
- **Storefront** (`src/app/(storefront)`):
  - **Pages:** home and CMS pages, product page (gallery, variants, pincode check, reviews, related products, JSON-LD), category pages, shop (category, Pune-only and pan-India filters, sorting), search, cart page.
  - **Site-wide:** cart drawer, floating WhatsApp button, live-preview listener, draft banner, 404 page.
  - **Placeholders:** checkout and account pages.
- **Delivery logic** (`src/lib/delivery.ts`): pincode → zone matching, IST same-day cut-off, blackout dates, plus the `checkPincodeAction` server action.
- **Caching:** all CMS reads cached under one tag; Payload hooks revalidate it on every change; draft mode bypasses the cache.
- **Seed script** (`npm run seed`, `npm run seed:fresh`):
  - Placeholder artwork generated with sharp, so no stock photos are needed.
  - Catalogue: 8 categories, 17 products, 6 reviews, 2 delivery zones (Pune + Pan-India).
  - 10 pages, including a homepage modelled on the reference.
  - All globals and a demo admin user.

### Changed (vs. plan)
- `utilityBar` and `popularSearches` globals were merged into **Header**. Contact details and socials live once in **Site settings**.
  *Files:* PLAN.md §6.1
- shadcn/ui, Framer Motion and Embla were replaced by small in-house components, CSS animation and scroll-snap, to cut dependencies.
  *Files:* PLAN.md §4
- PLAN.md §12 now shows the actual folder structure, and §13 has a Status column.

### Fixed (during first run)
- Pinned `payload` / `@payloadcms/*` to **3.91.0** and `next` to **~15.4.11**, the versions Payload 3.91 supports.
- Renamed the category `order` field to `sortOrder`, since `order` is a reserved SQL word.
- Admin stylesheet switched from `.scss` to `.css`, removing the `sass` dependency.
- Type-safe casts so the build passes with Payload's generated `src/payload-types.ts`.

### Known gaps / next
- Checkout (address, delivery slot, Razorpay, COD), orders, coupons: Phase 4.
- Phone OTP and Google login, order tracking: Phase 5.
- Enquiry form, store locator, video, Instagram blocks, build-your-own box: Phase 6.
- Storefront types are hand-written in `src/lib/types.ts`. Run `npm run generate:types` for Payload's generated types.

---

## 2026-10-18 · v0.2 — Decisions confirmed

### Changed
- **Hosting:** local-only for checking and testing. The database is now **SQLite** locally, with PostgreSQL kept for production. Media is stored on local disk. OTPs and emails are printed to the console. Razorpay runs in test mode.
  *Files:* PLAN.md §4, §5, §13, §14
- **Login:** **phone OTP and Google**, the shopper chooses (email/password removed). Guest checkout is kept. Both methods can be linked to one account. Google users are asked to verify a phone at first checkout.
  *Files:* PLAN.md §4, §6.2 (`customers` gets `googleId`), §8 · FLOW.md §4, §9
- **Local delivery zone:** **Pune**, including Pimpri-Chinchwad, replaces Kolkata. Seeded pincodes are 411001–411062 plus selected 412xxx, editable in admin. "Kolkata Exclusives" is renamed "Pune Exclusives".
  *Files:* PLAN.md §2, §6.2, §9 · FLOW.md §1, §3
- **Payments:** **Razorpay and Cash on Delivery** both enabled. COD needs a phone OTP and has a configurable order limit and zone restrictions.
  *Files:* PLAN.md §4, §9 · FLOW.md §4 (new COD diagram)
- **Languages:** English by default. **Bengali is an optional locale** with an on/off toggle in Site Settings and fallback to English.
  *Files:* PLAN.md §11
- **Branding:** a default placeholder theme (sindoor red, gold and cream; Fraunces and Inter), fully editable in the Theme global.
  *Files:* PLAN.md §14

### Added
- PLAN.md §14 changed from "Open Decisions" to a **Decisions** table plus a default theme token table.
- FLOW.md "Running locally" notes for checkout, Google OAuth and OTP.
- This file (CHANGE.md).

---

## 2026-10-18 · v0.1 — Initial plan

### Added
- **PLAN.md:** goals, analysis of bombaysweetshop.com, a 4-layer customization model (theme → globals → page blocks → content), tech stack (Next.js 15 + Payload CMS 3), architecture, data model, 17-block page builder library, routes, commerce rules, admin roles, non-functional requirements, folder structure, 8-phase milestones and open decisions.
- **FLOW.md:** 10 Mermaid flows: site map, shopper journey, pincode/zone check, checkout and payment, order lifecycle, corporate enquiry, block rendering pipeline, admin edit/publish, authentication, build-your-own box.

---

<!--
Template for new entries:

## YYYY-MM-DD · vX.Y — Short title

### Added
- ...
### Changed
- ...
### Removed
- ...
### Fixed
- ...
-->
