# Real Bengal Sweets — Project Plan

> A modern sweets e-commerce web app inspired by [bombaysweetshop.com](https://bombaysweetshop.com/), where **every component, section, color, text and menu is editable from an admin panel** — no code changes needed to restyle or restructure the site.

Companion documents: [FLOW.md](FLOW.md) (user, admin, order and rendering flows) · [CHANGE.md](CHANGE.md) (change log).

---

## 1. Goals

| # | Goal | Success criteria |
|---|------|------------------|
| G1 | Feature parity with the reference storefront | Every section listed in §2 exists as a working, data-driven component |
| G2 | **Full customizability** | A non-developer can change theme, layout, section order, copy, images, menus and footer from the admin — and preview before publishing |
| G3 | Sell online in India | Cart, checkout, Razorpay/UPI payments, delivery-zone rules, order tracking |
| G4 | Gifting & B2B | Hampers, custom gift boxes, corporate/bulk enquiry pipeline |
| G5 | Fast & discoverable | Lighthouse ≥ 90 (mobile), SEO metadata per page, structured data for products |

**Out of scope for v1:** native mobile apps, multi-vendor marketplace, POS integration for physical stores.

---

## 2. Reference Site Analysis

What bombaysweetshop.com has, and how we'll map it:

| Reference element | Our equivalent | Customizable as |
|---|---|---|
| Rotating announcement bar (offers, delivery notices) | Announcement Bar | Global setting: list of messages, links, colors, auto-rotate speed, on/off, schedule (start/end date) |
| Top utility strip (WhatsApp no., socials) | Utility Bar | Global setting |
| Logo + mega-menu (Shop All → Mithai / Chocolate / Namkeen / City Exclusives, Hampers, Customised Gifting, Corporate, Track Order, Stores, About, Blog) | Header + Mega Menu | Global: nested menu builder (3 levels), each item can show product thumbnails or a promo image |
| Search with "Popular searches" | Search overlay | Global: popular search terms list |
| Hero banner (seasonal, e.g. Diwali) | Hero block | Page block: slides, image/video, desktop+mobile images, headline, CTA, overlay |
| Category icon tiles (Diwali Specials, Mithai, Chocolate…) | Category Grid block | Page block: pick categories or custom tiles, columns, icon/image style |
| "Featured In" press logo marquee | Logo Marquee block | Page block: logos, speed, grayscale toggle |
| Product grid ("Gifting Favourites") | Product Grid / Carousel block | Page block: source = manual pick / category / tag / bestsellers; count; layout |
| "The Experience" 4 feature tiles | Feature Tiles block | Page block: tiles with image, title, text, link |
| Testimonials (3 cards) | Testimonials block | Page block: pick from Reviews collection |
| "Trusted Across India" stats | Stats Counter block | Page block: number, suffix, label, animate toggle |
| Newsletter signup | Newsletter block | Page block + footer; copy editable |
| Footer (Shop / About / Policies / Contact, FSSAI no.) | Footer | Global: columns builder, contact, legal text, license no. |
| Product card (image, rating, name, "From ₹", MRP strike, % off, Add to Cart, View details) | ProductCard component | Theme-level card settings: show rating? show discount badge? quick-add? image ratio |
| City-exclusive products (Mumbai only) | Delivery zones (e.g. *Pune only*) | Products tagged with allowed zones; pincode checker |

Reference runs on Shopify. We will **build our own stack** (see §4) so that customization is unrestricted and there are no per-theme limits.

---

## 3. What "Fully Customizable" Means

Customization is designed in **four layers**. Nothing a shopper sees is hard-coded in React.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. THEME        colors, fonts, radius, spacing, shadows,    │
│                 button styles, card style  → CSS variables  │
├─────────────────────────────────────────────────────────────┤
│ 2. GLOBALS      header, mega-menu, announcement bar,        │
│                 footer, SEO defaults, contact, socials      │
├─────────────────────────────────────────────────────────────┤
│ 3. PAGES        built from reorderable BLOCKS (page builder)│
│                 each block = content fields + style fields  │
├─────────────────────────────────────────────────────────────┤
│ 4. CONTENT      products, categories, hampers, reviews,     │
│                 stores, blog posts, sweets library          │
└─────────────────────────────────────────────────────────────┘
```

### Rules every component follows
1. **Props come from the CMS.** Components receive a typed config object; no literal copy, colors or URLs inside JSX.
2. **Every block has a shared `style` group:** background (color/image/gradient), text color, padding (top/bottom), container width, visibility (desktop / mobile / both), custom CSS class, anchor ID.
3. **Every block has `enabled` + optional schedule** (`showFrom`, `showUntil`) — e.g. Diwali sections switch on/off automatically.
4. **Theme tokens → CSS variables.** Admin changes `--color-primary` etc.; Tailwind reads the variables, so the whole site restyles instantly.
5. **Variants per block.** e.g. Hero has `layout: full-bleed | split | carousel`; Product Grid has `grid | carousel | list`.
6. **Live preview + drafts.** Edits are saved as drafts, previewed on the real site, then published.
7. **Strings are content.** Button labels ("Add to Cart", "View details"), empty-cart text, form messages live in a `UI Strings` global → also enables Bengali/Hindi translation later.

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router, React 19, TypeScript)** | SSR/ISR for SEO + speed, server components, one codebase for storefront and admin |
| CMS / Admin / Backend | **Payload CMS 3** (runs inside the Next.js app) | Self-hosted, code-defined schemas, built-in **Blocks field** (page builder), drafts, versions, live preview, access control, auth, REST + GraphQL + Local API |
| Database | **SQLite** locally (`@payloadcms/db-sqlite`) → **PostgreSQL** for production | No database install needed to test locally; Payload's adapter swap keeps the schema identical |
| Styling | **Tailwind CSS v4** + CSS variables from Theme global | Tokens editable at runtime |
| UI primitives | Own lightweight components in `src/components` (shadcn/ui optional later) | Fewer dependencies; every component reads theme tokens |
| Animation | CSS keyframes + IntersectionObserver | Marquee, fades and count-up without an animation library |
| Carousels | CSS scroll-snap + small client components | Lightweight, accessible; Embla can be added later if needed |
| State (cart) | Zustand + server cart in DB | Persistent cart across devices for logged-in users |
| Payments | **Razorpay** (UPI, cards, netbanking, wallets) **+ Cash on Delivery** — both enabled | India-first; Razorpay **test mode** keys locally |
| Auth | Payload auth + **Phone OTP** and **Google OAuth** (custom Payload auth strategy) | Shopper picks either; both can be linked to one account |
| Media | Local disk (`/media`) locally → S3-compatible storage (Cloudflare R2) in production + Next/Image | Zero setup locally |
| Email / SMS / WhatsApp | Resend (email), MSG91 or Gupshup (SMS/WhatsApp OTP & order updates) | Locally: OTPs and emails are **printed to the server console** (no paid accounts needed) |
| Shipping | Shiprocket API (pan-India) + own delivery for local zone | Tracking numbers, rate calc |
| Search | Postgres full-text in v1 → Meilisearch later | Start simple |
| Forms | React Hook Form + Zod | Shared validation client/server |
| Testing | Vitest (unit), Playwright (E2E) | |
| Hosting | **Local only for now** (`npm run dev` on Windows) | Production: Postgres (`postgres://` URI) + S3/R2 media + Vercel or Docker — see DEPLOY.md |

---

## 5. High-Level Architecture

```
                 ┌───────────────── Next.js 15 app ─────────────────┐
 Shopper ──────▶ │  (storefront)  /  /shop  /products/[slug] ...    │
                 │      │  Server Components fetch via Payload       │
                 │      ▼  Local API (no HTTP hop)                   │
 Admin  ───────▶ │  (payload)  /rbsadmin ← Payload admin UI          │
                 │      │                                            │
                 │  API routes: /api/checkout, /api/razorpay/webhook │
                 └──────┼────────────────────────────────────────────┘
                        ▼
     SQLite (local) / PostgreSQL ── media ── Razorpay ── Google OAuth ── Shiprocket ── Resend/MSG91
```

- **Rendering:** pages are statically generated with ISR; Payload `afterChange` hooks call `revalidateTag()` so a publish shows up within seconds.
- **Block renderer:** a single `<RenderBlocks blocks={page.layout} />` maps `blockType` → React component (see FLOW.md §7).

---

## 6. Data Model

### 6.1 Globals (singletons)
| Global | Key fields |
|---|---|
| `theme` | colors (primary, secondary, accent, background, surface, text, muted, success, danger), fonts (heading, body — Google Fonts picker), base font size, radius, shadow scale, button style (filled/outline/pill), product card style, dark-mode toggle |
| `header` | logo + logo text/height, sticky, menu items (simple link / dropdown / mega menu → columns → links + product thumbnails + promo tile), **top strip** (message, show phone/WhatsApp/socials, colours), show search / account / cart, **popular searches** |
| `announcement-bar` | enabled, messages[] (text, link), bg/text color, rotate interval, dismissible, schedule (start/end date) |
| `footer` | about text, columns[] (title, links[]), newsletter texts, show contact/socials, copyright (`{year}`), legal line (FSSAI), bottom links, colours |
| `site-settings` | site name, tagline, favicon, SEO defaults, **contact** (phone, WhatsApp, email, address, socials[] — reused by header & footer), floating WhatsApp button, currency, GST-inclusive, Razorpay/COD toggles, min order, Bengali toggle, GA4 / Meta Pixel IDs |
| `ui-strings` | every reusable button/label/message, generated from `src/lib/strings.ts` |

*(The planned separate `utilityBar` and `popularSearches` globals were folded into `header`, with contact details in `site-settings`, so each value is edited in one place.)*

### 6.2 Collections
| Collection | Key fields |
|---|---|
| `pages` | title, slug, **layout (blocks[])**, SEO group, status (draft/published) |
| `products` | name, slug, description (rich text), gallery, **variants[]** (label e.g. "500 g / 9 pcs", SKU, price, MRP, stock, weight), categories, tags, **deliveryZones** (all-India / local-only), shelf life, ingredients, allergens, veg/egg-free flags, rating (computed), badges, related products, SEO |
| `categories` | name, slug, icon, banner, parent, description, sort order |
| `hampers` | extends product: contents (product refs + qty), packaging options, gift message allowed |
| `reviews` | product, author, designation, rating, text, image, approved |
| `customers` | Payload auth: name, phone (verified), email, googleId, auth providers used, addresses[], wishlist |
| `carts` | customer/session, items[], coupon, expires |
| `orders` | number, customer, items (snapshot), address, delivery date/slot, gift message, totals, payment (Razorpay ids), status, shipment (AWB, tracking URL), status history |
| `coupons` | code, type (%, flat, free shipping), min cart, usage limits, validity, eligible products |
| `deliveryZones` | name ("Pune", "Pan-India"), pincodes / pincode ranges, shipping fee rules, same-day cutoff, delivery slots |
| `enquiries` | type (corporate / wedding / custom box / baby announcement), name, company, qty, budget, date, message, status |
| `stores` | name, address, map coordinates, hours, phone, photos |
| `posts` (blog) & `sweetsLibrary` | title, slug, cover, rich text, author, tags |
| `media` | image/video with alt text, focal point, auto-generated sizes |
| `admins` | Payload users with roles: **owner, editor, order-manager** |

---

## 7. Block Library (page builder)

Every block = **content fields + shared `style` group + `enabled` + schedule.**

| Block | Content fields | Layout variants |
|---|---|---|
| `hero` | slides[] (desktop img, mobile img/video, eyebrow, headline, subtext, CTAs[], text alignment, overlay opacity) | full-bleed, split, carousel |
| `categoryGrid` | source (auto/manual), tiles[] (icon/image, label, link), heading | grid (2–6 cols), scroll-row, circles |
| `productCollection` | heading, subheading, source (manual / category / tag / bestsellers / new), limit, "view all" link | grid, carousel, featured+grid |
| `logoMarquee` | heading, logos[] (image, link) | marquee, static row; speed, grayscale |
| `featureTiles` | heading, tiles[] (image, title, text, link) | 2/3/4 cols, image-left/top |
| `testimonials` | heading, reviews (relationship) or manual entries | cards, carousel, single large quote |
| `stats` | heading, items[] (value, prefix, suffix, label) | row, cards; count-up animation |
| `imageWithText` | image, rich text, CTA | image left/right, overlap |
| `bannerStrip` | text, CTA, background image | slim, tall |
| `richText` | rich text | narrow, wide |
| `videoEmbed` | YouTube/MP4, poster | |
| `newsletter` | heading, text, placeholder, button label, success msg, disclaimer ("We don't spam…") | inline, card |
| `faq` | items[] (q, a) | accordion |
| `storeLocator` | stores (relationship), map toggle | list, map+list |
| `enquiryForm` | form type, heading, fields toggles, success message | |
| `instagramFeed` | handle / manual posts | grid, carousel |
| `spacer` / `divider` | height, style | |

Adding a new block = 1 Payload block config + 1 React component + 1 line in the block registry.

---

## 8. Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage (CMS page with slug `home`) |
| `/[slug]` | Any CMS page (About, Corporate Gifting, Wedding Gifting, Policies, FAQs…) |
| `/shop` | All products, filters (category, price, veg, zone), sort |
| `/collections/[slug]` | Category page — banner + optional blocks above/below product grid |
| `/products/[slug]` | PDP: gallery, variants, price/MRP/% off, pincode check, qty, add to cart, gift message, description tabs, reviews, related |
| `/hampers` & `/build-your-box` | Hamper listing; custom box builder (pick N sweets) |
| `/cart` + slide-out cart drawer | Line items, coupon, delivery estimate |
| `/checkout` | Address → delivery date/slot → payment |
| `/order/[id]/confirmation` | Thank-you page |
| `/track-order` | Order no. + phone → status timeline |
| `/account/*` | Login (phone OTP **or** Google), orders, addresses, wishlist |
| `/stores` | Store locator |
| `/blog`, `/blog/[slug]`, `/sweets-library/[slug]` | Content |
| `/search` | Search results |
| `/rbsadmin` | Payload admin |

---

## 9. Commerce Rules

- **Pricing:** prices inclusive of GST; show MRP strike-through and auto-computed `% off`; "From ₹X" when variants differ.
- **Delivery zones:** each product has allowed zones. Pincode check on PDP and at checkout blocks local-only items (e.g. rosogolla in syrup, mishti doi — perishable) for out-of-zone pincodes.
  - **Local zone = Pune** (Pune city + Pimpri-Chinchwad pincodes, seeded as 411001–411062 plus selected 412xxx; the list is editable in admin). Same-day / slot delivery by own riders.
  - **Pan-India zone** = everything else, shelf-stable items only, shipped via Shiprocket.
- **Delivery dates:** zone-based lead time, same-day cutoff time, blackout dates (festivals), slot selection for local delivery.
- **Inventory:** per variant; optional "pre-order" for festive hampers.
- **Coupons & offers:** %, flat, free shipping, bank offers shown as text in the announcement bar.
- **Gifting:** gift message, "hide price on invoice", ship to a different address, multiple recipients (v2).
- **Payments:** both methods offered at checkout.
  - **Razorpay:** order created server-side → client checkout → **webhook is source of truth** for marking paid. Locally: test keys; the webhook is simulated by the verify endpoint (or tunnelled with ngrok if needed).
  - **Cash on Delivery:** phone OTP confirmation before placing; admin can set a max COD order value and restrict COD to certain zones.
- **Notifications:** email + WhatsApp/SMS on placed, packed, shipped, delivered.

---

## 10. Admin Experience

- Payload admin at `/rbsadmin`, role-based (owner / editor / order-manager).
- **Live preview** side-by-side for pages and globals.
- Drafts, version history, restore.
- Dashboard widgets: today's orders, revenue, low stock, new enquiries.
- Order management: status changes, print invoice/packing slip, export CSV.
- Media library with focal-point cropping.
- Theme editor with color pickers and font selectors.

---

## 11. Non-Functional Requirements

- **Performance:** ISR, `next/image` with AVIF/WebP, font subsetting, < 150 KB JS on homepage.
- **SEO:** per-page meta & OG, `Product` + `Organization` + `BreadcrumbList` JSON-LD, sitemap.xml, robots.txt, clean slugs.
- **Accessibility:** WCAG 2.1 AA — keyboard-navigable mega menu, focus states, alt text required on media, reduced-motion respects marquee/carousel.
- **Security:** server-side price recalculation at checkout, Razorpay signature verification, rate-limited OTP & forms, role-based access in Payload.
- **Languages:** **English** is the default and only required locale. **Bengali (`bn`) is optional** — Payload localization is configured for `en` + `bn`; a Site Settings toggle shows the language switcher only when Bengali is enabled. Untranslated fields fall back to English.
- **Analytics:** GA4 e-commerce events, Meta Pixel — IDs set in admin.

---

## 12. Project Structure

```
real_bengal_sweets/
├─ src/
│  ├─ app/
│  │  ├─ (storefront)/           # public site; layout loads globals + theme (globals.css here)
│  │  │  ├─ page.tsx  [slug]/  products/[slug]/  collections/[slug]/
│  │  │  ├─ shop/  search/  cart/  checkout/  account/
│  │  │  └─ next/preview  next/exit-preview   # draft mode for live preview
│  │  └─ (payload)/              # Payload admin + REST/GraphQL API
│  ├─ payload/
│  │  ├─ collections/            # Pages, Products, Categories, Reviews, DeliveryZones, Media, Leads, Users
│  │  ├─ globals/                # Theme, Header, AnnouncementBar, Footer, SiteSettings, UiStrings
│  │  ├─ blocks/                 # Hero, CategoryGrid, ProductCollection, … (schemas)
│  │  ├─ fields/                 # shared: linkGroup, styleGroup/sectionSettings, slug, colour, seo
│  │  ├─ components/             # custom admin fields (ColorField)
│  │  └─ hooks/                  # revalidate
│  ├─ blocks/                    # React component per block + RenderBlocks registry + BlockWrapper
│  ├─ components/                # layout/, product/, cart/, shared UI
│  ├─ lib/                       # data (cached queries), theme, strings, delivery, actions, types
│  ├─ seed/                      # demo content + generated placeholder art
│  └─ payload.config.ts
├─ PLAN.md · FLOW.md · CHANGE.md · README.md
```

---

## 13. Milestones

| Phase | Deliverables | Est. | Status |
|---|---|---|---|
| **0. Setup** | Next.js + Payload + SQLite + Tailwind, `.env.example`, seed script (default theme, Pune zone, sample products) | 2–3 days | ✅ Code written (v0.3) |
| **1. Customization core** | Theme global → CSS vars; Header, Mega Menu, Announcement Bar, Footer globals; shared `style` field; RenderBlocks; live preview | 1 week | ✅ Code written (v0.3) |
| **2. Block library** | Blocks in §7, homepage replicating reference layout with seed content | 1–1.5 weeks | ✅ 13 of 17 blocks (v0.3); `videoEmbed`, `storeLocator`, `enquiryForm`, `instagramFeed` → Phase 6 |
| **3. Catalog** | Products, variants, categories, PDP, collection pages, filters, search | 1 week | ✅ Code written (v0.3), plus cart drawer & pincode check from Phase 4 |
| **4. Cart & checkout** | Delivery dates/slots at checkout, coupons, Razorpay + COD (OTP), webhook, order lifecycle, notifications, invoice/packing slip | 1.5 weeks | ✅ Done & verified (v0.4) |
| **5. Accounts & orders** | Phone OTP + Google login, account pages (order history, addresses), track-order lookup, Shiprocket, email/SMS providers | 1 week | ✅ Done & verified (v0.5) |
| **6. Gifting & B2B** | Build-your-box, enquiry forms + admin pipeline, store locator, blog, sweets library, **tiered quantity discounts** | 1 week | ✅ Done & verified (v0.6) |
| **6b. Messaging** | Firebase phone OTP (replaces our SMS sender for login/COD), WhatsApp Cloud API order updates + opt-in | 2–3 days | ⏸ Decided, waiting on your Firebase project + Meta test number |
| **7. Polish & launch** | SEO (sitemap, robots, canonical, structured data), analytics events, security headers, Postgres + S3/R2 switches + migrations, orders CSV, Playwright E2E, Dockerfile + DEPLOY.md | 1 week | ✅ Launch-ready code (v0.7) — **deploy waits on your hosting choice** |

**Total: ~8–9 weeks** for one full-time developer.

---

## 14. Decisions (confirmed 2026-10-18)

| # | Topic | Decision | Impact |
|---|-------|----------|--------|
| 1 | Hosting | **Local only** for checking/testing | SQLite, local media folder, console-logged OTP/email, Razorpay test mode. Production hosting decided later. |
| 2 | Login | **Phone OTP and Google** — shopper chooses | Guest checkout also kept; accounts can link both methods |
| 3 | Local delivery zone | **Pune** (incl. Pimpri-Chinchwad) | Perishables + same-day delivery in Pune only; rest of India gets shelf-stable items |
| 4 | Payment | **Razorpay + Cash on Delivery** | COD needs phone OTP; COD limits configurable |
| 5 | Languages | **English**, Bengali optional | `en` default, `bn` locale switchable on in admin |
| 6 | Branding | **Default theme** for now | Placeholder text logo + default palette below; everything editable in Theme global |

### Default theme (placeholder until real branding exists)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#8B1E1E` (sindoor red) | Buttons, links, highlights |
| `--color-accent` | `#C9962B` (gold) | Badges, ratings, dividers |
| `--color-background` | `#FFF8EE` (cream) | Page background |
| `--color-surface` | `#FFFFFF` | Cards, drawers |
| `--color-text` | `#2B1B12` | Body text |
| `--color-muted` | `#7A6A5E` | Secondary text |
| `--font-heading` | Fraunces | Headings |
| `--font-body` | Inter | Body, UI |
| `--radius` | `12px` | Cards, inputs, buttons |

Change history is tracked in [CHANGE.md](CHANGE.md).
