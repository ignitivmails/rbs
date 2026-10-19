# Real Bengal Sweets

A sweets storefront inspired by bombaysweetshop.com. **Every section, colour, font, menu and label is editable from the admin panel.**

Built with **Next.js 15 + Payload CMS 3 + Tailwind CSS 4**, running locally on SQLite.

- Plan: [PLAN.md](PLAN.md) · Flows: [FLOW.md](FLOW.md) · Changes: [CHANGE.md](CHANGE.md)

---

## 1. Prerequisites

- **Node.js 20.9+** (22 LTS recommended) from https://nodejs.org. Check with `node -v`.
- npm comes with Node.

## 2. Run it locally

From this folder in a terminal (PowerShell is fine):

```bash
npm install            # install dependencies (first time only)
npm run seed           # create the database and load demo content + admin user
npm run dev            # start the app
```

Then open:

| URL | What |
|---|---|
| http://localhost:3000 | Storefront |
| http://localhost:3000/admin | Admin panel |

**Demo admin login:** `admin@realbengalsweets.local` / `admin12345`. Change it under **Settings → Admin users** after you log in.

> If `npm install` stops with a peer-dependency (ERESOLVE) error, run `npm install --legacy-peer-deps`.
> If the admin panel shows a "component not found" error, run `npm run generate:importmap` and restart `npm run dev`.
> If a command fails with **"index … already exists"** right after an update, just run it again. This is a one-off quirk of the local SQLite schema sync.

### Optional integrations (`.env`)

Everything works locally without these. Each one switches on when its keys are present:

| Feature | Variables | Without them |
|---|---|---|
| Razorpay payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Test-payment simulator |
| Google sign-in | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (redirect URI `http://localhost:3000/api/auth/google/callback`) | Google button hidden |
| Email (Resend) | `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | Emails printed in the terminal |
| SMS (MSG91) | `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`, `MSG91_TEMPLATE_VAR` | SMS/OTPs printed in the terminal (OTP also shown on screen) |
| Shiprocket | `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP` | Test tracking numbers (AWBs) generated |

Restart `npm run dev` after editing `.env`.

### Useful commands

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run seed` | Load demo content (skips if content already exists) |
| `npm run seed:fresh` | **Wipe** products, pages, media and categories, then reload demo content. Admin users are kept. |
| `npm run test:orders` | Check the order engine (quotes, coupons, quantity discounts, boxes, stock, payments, OTP, accounts) against your local database |
| `npm run test:e2e` | Browser tests with Playwright: homepage, mega menu, bulk discount, pincode, COD checkout, build-a-box, login, enquiry, admin. Starts the dev server if needed and removes its test data afterwards. First time only: `npx playwright install chromium` |
| `npm run migrate` / `migrate:create` | Production database migrations (Postgres). See [DEPLOY.md](DEPLOY.md) |
| `npm run generate:types` | Generate TypeScript types from the CMS schema into `src/payload-types.ts` |
| `npm run generate:importmap` | Regenerate the admin component import map |
| `npm run build` / `npm start` | Production build and serve |

Local data lives in `real-bengal-sweets.db` (database) and `media/` (uploads). Delete both to start from scratch.

---

## 3. Customising the site (no code)

Everything is in the admin at `/admin`:

| Want to change… | Go to |
|---|---|
| Colours, fonts, corner radius, button shape, product-card style, custom CSS | **Design → Theme** |
| Logo, menu items, dropdowns and mega menus, top strip, search suggestions | **Design → Header & menu** |
| Rotating offers bar at the very top | **Design → Announcement bar** |
| Footer columns, newsletter text, copyright, FSSAI line | **Design → Footer** |
| Homepage and any other page: add, remove or reorder sections, edit their content and style | **Content → Pages** (the `home` page is the homepage) |
| Products, sizes/prices/MRP, delivery-zone restrictions, badges | **Shop → Products** |
| Categories (tiles, banners, sections under the product grid) | **Shop → Categories** |
| Delivery pincodes, same-day cut-off, shipping fees, COD limits | **Shop → Delivery zones** |
| Orders: change status (customer is notified), add notes, print invoice or packing slip | **Orders → Orders** |
| Discount codes | **Orders → Coupons** |
| “Buy more, save more” tiers on chosen products or categories | **Orders → Quantity discounts** |
| Build-your-own box sizes, sweets, packaging | **Shop → Build-a-box** |
| Stores (address, hours, map) | **Content → Stores** |
| Blog posts and Sweets Library entries | **Content → Blog & Sweets Library** |
| Corporate / wedding leads and follow-ups | **Leads → Enquiries** |
| Shopper accounts, their addresses and order history | **Orders → Customers** |
| Courier box size and auto-shipment toggle | **Settings → Site settings → Shipping** |
| Order emails and SMS/WhatsApp texts, new-order alert email | **Settings → Notifications** |
| Every button label and message (“Add to Cart”, “Place order”…) | **Settings → UI text** and **UI text — Account** |
| Site name, SEO defaults, contact details, socials, WhatsApp button, Bengali toggle | **Settings → Site settings** |

**Live preview:** open any page, product or design global and click **Live Preview**. Edits autosave as drafts and show instantly. Click **Publish** to make them live.

**Section settings:** every page section has a collapsible *Section settings* panel. Use it to:
- show or hide the section, or schedule it with start and end dates (e.g. Diwali banners)
- change its background (colour, gradient or image), spacing and width
- show it on desktop only or mobile only
- give it an anchor ID or a custom CSS class

### Available page sections

Hero banner (carousel, full-bleed or split) · Category tiles · Product collection (grid or carousel; manual, by category, tag, featured, newest or discount) · Logo strip (“Featured in”) · Feature tiles · Testimonials · Stats / numbers · Image with text · Banner strip · Text · Newsletter signup · FAQ · Spacer.

---

## 4. What works in this build

- Fully CMS-driven theme, header (mega menu), announcement bar, footer and page builder, with live preview and drafts
- Homepage modelled on the reference layout, with demo content
- Product pages:
  - gallery and size variants
  - price, MRP and % off
  - **pincode check**: Pune same-day delivery vs. pan-India; fresh items are restricted to Pune
  - reviews and related products
- Category pages, shop with filters and sorting, search
- Cart drawer and cart page (saved on the device)
- **Checkout:**
  - address, Pune delivery date and slot, gift message, coupons
  - online payment (Razorpay) or Cash on Delivery with phone OTP
  - all prices recalculated on the server
- **Orders:**
  - stock reserved, and released on cancel
  - unpaid orders auto-cancel
  - status history, automatic customer notifications, refunds
  - printable invoice and packing slip
- **Customer accounts** (`/account`):
  - log in with phone OTP or Google; link both to one account
  - order history, address book, profile
  - cart synced across devices
  - earlier guest orders claimed automatically
- **Order tracking** form on the Track Order page (order number + phone)
- **Quantity discounts:** "buy more, save more" tiers with live hints in the cart (try 3 or 6 × Saffron Kaju Katli)
- **Build-your-own box** at `/build-your-box`
- **Enquiry form** (Corporate Gifting page) feeding the Leads pipeline
- **Store locator** with maps (Our Stores page)
- **Blog** and **Sweets Library**
- **Shiprocket:** pan-India orders get a tracking number when marked *Packed*
- Newsletter signups (stored under **Leads → Newsletter subscribers**)
- Optional Bengali locale (turn it on in **Site settings → Language**)

### Testing accounts locally

1. Open **/account** and enter any 10-digit mobile number starting with 6–9. The OTP appears under the box and in the terminal.
2. Add an address, then go to checkout. Your details and address are prefilled, and Cash on Delivery skips the OTP because your phone is verified.
3. Find your order under **My orders**, or use **Track Order** in the menu with the order number and phone.
4. In **Admin → Orders**, set a pan-India order to *Packed*. A test tracking number and tracking link appear in the order's **Shipment** tab and on the customer's order page.

### Testing checkout locally

1. Add something to the cart and go to **Checkout**. Use a Pune pincode such as `411001` to get date and slot choices, or `110001` for pan-India.
2. **Coupons:** `WELCOME10` (10% off up to ₹200), `FREEDELIVERY` (free delivery above ₹499), `BIJOYA250` (₹250 off above ₹1,500).
3. **Online payment:** with no Razorpay keys, a *test-payment simulator* opens where you choose success or failure. For real Razorpay test mode, put your `rzp_test_…` keys in `.env` as `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` and restart.
4. **Cash on Delivery:** click *Send OTP*. Locally the code is shown under the box and printed in the terminal.
5. After ordering, open **Admin → Orders**:
   - Change the status (e.g. *Shipped*); the customer email/SMS appears in the terminal.
   - Use the sidebar links to print the invoice or packing slip.

- **SEO:** `/sitemap.xml`, `/robots.txt`, canonical URLs, Product / FAQ / Organization / WebSite (search) structured data
- **Analytics:** GA4 and Meta Pixel (set the IDs in **Site settings → Integrations**) with add-to-cart, begin-checkout and purchase events
- **Orders CSV export:** button above the orders list in the admin (date range + status)

**Going live:** see **[DEPLOY.md](DEPLOY.md)** for hosting options, environment variables, Postgres migrations and the go-live checklist.

**Pending:** Firebase SMS login codes and WhatsApp order updates (waiting on your Firebase project and Meta test number).

## 5. Project structure

```
src/
├─ app/
│  ├─ (storefront)/     public site: layout, pages, product/collection/shop/search/cart routes
│  └─ (payload)/        admin panel + REST/GraphQL API (Payload)
├─ payload/
│  ├─ collections/      Pages, Products, Categories, Reviews, DeliveryZones, Media, Leads, Users
│  ├─ globals/          Theme, Header, AnnouncementBar, Footer, SiteSettings, UiStrings
│  ├─ blocks/           page-builder block schemas
│  ├─ fields/           shared fields: link, section style, slug, colour, SEO
│  └─ hooks/            cache revalidation
├─ blocks/              React components for each block + RenderBlocks registry
├─ components/          layout (header, footer…), product, cart, shared UI
├─ lib/                 data fetching, theme, UI strings, delivery logic, server actions
├─ seed/                demo content + generated placeholder artwork
└─ payload.config.ts
```

**Adding a new section type:**
1. Create a schema in `src/payload/blocks/`.
2. Add it to `pageBlocks` in `src/payload/blocks/index.ts`.
3. Create its React component in `src/blocks/`.
4. Register it in `src/blocks/RenderBlocks.tsx`.
