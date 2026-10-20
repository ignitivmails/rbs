# Real Bengal Sweets — Application Flows

Companion to [PLAN.md](PLAN.md). Change history is in [CHANGE.md](CHANGE.md). Diagrams use Mermaid. They render on GitHub, and in VS Code with the *Markdown Preview Mermaid Support* extension.

**Contents**
1. [Site map](#1-site-map)
2. [Shopper journey](#2-shopper-journey)
3. [Add to cart and delivery-zone check](#3-add-to-cart--delivery-zone-check)
4. [Checkout and payment](#4-checkout--payment)
5. [Order lifecycle](#5-order-lifecycle)
6. [Corporate and bulk gifting enquiry](#6-corporate--bulk-gifting-enquiry)
7. [Page rendering (how customization reaches the screen)](#7-page-rendering-how-customization-reaches-the-screen)
8. [Admin: editing content and theme](#8-admin-editing-content--theme)
9. [Authentication](#9-authentication)
10. [Build-your-own box](#10-build-your-own-box)

---

## 1. Site Map

```mermaid
flowchart TD
    Home["/ Home"] --> Shop["/shop"]
    Home --> Coll["/collections/:slug<br/>Mishti · Sandesh · Chocolate · Namkeen · Pune Exclusives"]
    Home --> Hampers["/hampers"]
    Home --> Gifting["Gifting pages<br/>Corporate · Wedding · Celebrations · Baby Announcement"]
    Home --> Track["/track-order"]
    Home --> Stores["/stores"]
    Home --> About["/about"]
    Home --> Blog["/blog · /sweets-library"]
    Home --> Search["/search"]
    Home --> Account["/account"]
    Shop --> PDP["/products/:slug"]
    Coll --> PDP
    Hampers --> PDP
    Hampers --> BYOB["/build-your-box"]
    PDP --> Cart["Cart drawer / /cart"]
    BYOB --> Cart
    Cart --> Checkout["/checkout"]
    Checkout --> Confirm["/order/:id/confirmation"]
    Gifting --> Enquiry["Enquiry form"]
    Account --> Orders["Orders"] & Addr["Addresses"] & Wish["Wishlist"]
```

---

## 2. Shopper Journey

```mermaid
flowchart LR
    A[Lands on site<br/>ad / search / Instagram] --> B{Sees announcement bar<br/>+ hero}
    B --> C[Browse category tiles<br/>or mega menu]
    B --> D[Search]
    B --> E[Featured product grid]
    C & D & E --> F[Product page]
    F --> G{Pincode check}
    G -- deliverable --> H[Select variant + qty<br/>optional gift message]
    G -- not deliverable --> I[Show pan-India alternatives]
    I --> F
    H --> J[Add to cart → drawer opens]
    J --> K{Continue shopping?}
    K -- yes --> C
    K -- no --> L[Checkout]
    L --> M[Pay via Razorpay]
    M --> N[Confirmation + email/WhatsApp]
    N --> O[Track order]
```

---

## 3. Add to Cart and Delivery-Zone Check

Perishable items such as rosogolla in syrup and mishti doi can only be sold in the local zone (**Pune**, including Pimpri-Chinchwad), the same way the reference site has "Mumbai only" items.

```mermaid
flowchart TD
    S[Shopper enters pincode on PDP] --> Q[GET /api/pincode?code=411001]
    Q --> Z{Pincode found in<br/>a delivery zone?}
    Z -- no --> X[Not serviceable message<br/>text from UI Strings]
    Z -- yes --> P{Product allowed<br/>in that zone?}
    P -- no --> Y[Local-only item message<br/>+ suggest alternatives]
    P -- yes --> D[Show earliest delivery date<br/>using lead time, cutoff and blackout dates]
    D --> V{Variant in stock?}
    V -- no --> N[Notify me / pre-order]
    V -- yes --> A[Add to cart]
    A --> C[Cart store: Zustand locally<br/>+ synced to carts collection if logged in]
    C --> R[Pincode saved in cookie<br/>and reused across the site]
```

---

## 4. Checkout and Payment

The server always recalculates prices. The Razorpay **webhook** is the source of truth for whether an order is paid.

```mermaid
sequenceDiagram
    autonumber
    actor U as Shopper
    participant FE as Next.js (client)
    participant API as Next.js API / Payload
    participant DB as PostgreSQL
    participant RP as Razorpay

    U->>FE: Proceed to checkout
    FE->>U: Step 1 – Contact & address (login with phone OTP / Google, or guest)
    FE->>U: Step 2 – Delivery date / slot, gift message
    FE->>U: Step 3 – Review, apply coupon, choose Razorpay or COD
    U->>FE: Pay now (Razorpay path shown below)
    FE->>API: POST /api/checkout {cartId, address, slot, coupon}
    API->>DB: Re-validate stock, zone, prices, coupon
    API->>DB: Create order (status = pending_payment), reserve stock
    API->>RP: Create Razorpay order (amount)
    RP-->>API: razorpay_order_id
    API-->>FE: order id + razorpay_order_id
    FE->>RP: Open Razorpay Checkout (UPI / card / netbanking)
    RP-->>FE: payment success (payment_id, signature)
    FE->>API: POST /api/checkout/verify (signature)
    API-->>FE: OK → redirect to confirmation
    RP->>API: Webhook payment.captured
    API->>API: Verify webhook signature
    API->>DB: Order status = paid, commit stock, clear cart
    API->>U: Email + WhatsApp confirmation
    Note over API,DB: Unpaid orders auto-cancel after 30 min and release stock
```

**COD path** (enabled by default): skip Razorpay, send an OTP to the shopper's phone, and on success set status = `confirmed_cod`. COD is hidden if the order is above the admin-set COD limit or the zone disallows it.

```mermaid
flowchart LR
    A[Choose COD] --> B{Order ≤ COD limit<br/>and zone allows COD?}
    B -- no --> C[COD hidden → Razorpay only]
    B -- yes --> D[Send OTP to phone] --> E{OTP valid?}
    E -- no --> D
    E -- yes --> F[Create order<br/>status = confirmed_cod<br/>reserve stock] --> G[Confirmation + notifications]
```

**Running locally:**
- **Without Razorpay keys**, a labelled **test-payment simulator** replaces the Razorpay window. You can choose a successful or a failed payment.
- **With test keys** (`rzp_test_…` in `.env`), the real Razorpay window opens. The `verifyRazorpayAction` server action marks the order paid after checking the signature, so no public webhook URL is needed.
- To test the real webhook (`/api/razorpay/webhook`), expose it with a tunnel such as ngrok.
- OTPs, emails and SMS are printed to the terminal running `npm run dev`. The OTP is also shown on screen.

---

## 5. Order Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PendingPayment: order created
    PendingPayment --> Paid: webhook payment.captured
    PendingPayment --> Cancelled: timeout / payment failed
    [*] --> ConfirmedCOD: COD + OTP verified
    Paid --> Processing: admin accepts
    ConfirmedCOD --> Processing
    Processing --> Packed
    Packed --> Shipped: Shiprocket AWB created<br/>(pan-India)
    Packed --> OutForDelivery: own rider<br/>(local zone)
    Shipped --> Delivered
    OutForDelivery --> Delivered
    Shipped --> RTO: undelivered
    Delivered --> [*]
    Processing --> Cancelled: admin cancels → refund
    Cancelled --> Refunded: Razorpay refund API
    Refunded --> [*]
    RTO --> Refunded
```

Each transition is written to `order.statusHistory`, fires the matching email/WhatsApp template, and is shown on `/track-order`.

---

## 6. Corporate and Bulk Gifting Enquiry

```mermaid
flowchart LR
    A[Corporate Gifting page<br/>built from CMS blocks] --> B[Enquiry Form block]
    B --> C[POST /api/enquiries<br/>Zod validation + rate limit + captcha]
    C --> D[(enquiries collection<br/>status = new)]
    D --> E[Email alert to sales team]
    D --> F[Auto-reply to customer]
    E --> G[Admin: contacted → quoted → won / lost]
    G -- won --> H[Admin creates bulk order<br/>or sends payment link]
```

---

## 7. Page Rendering (How Customization Reaches the Screen)

This is the core of the "fully customizable" requirement. Every visible piece comes from CMS data.

```mermaid
flowchart TD
    R[Request /some-page] --> L[Storefront layout.tsx]
    L --> G1[Fetch globals: theme, header,<br/>announcementBar, footer, uiStrings<br/>cached with tags]
    G1 --> T[ThemeProvider writes theme to<br/>CSS variables on :root<br/>--color-primary, --font-heading, --radius ...]
    G1 --> HD[Render AnnouncementBar → Header → MegaMenu]
    L --> P[page.tsx: fetch page by slug<br/>draft version if preview mode]
    P --> RB[RenderBlocks layout]
    RB --> F{For each block}
    F --> EN{enabled and<br/>within schedule?}
    EN -- no --> SKIP[skip]
    EN -- yes --> REG[registry blockType → component<br/>hero → Hero, productCollection → ProductCollection ...]
    REG --> W[BlockWrapper applies shared style group:<br/>background, padding, width, visibility, anchor]
    W --> CMP[Component renders the chosen variant<br/>using content fields]
    CMP --> FT[Footer]
```

```tsx
// src/blocks/RenderBlocks.tsx (shape)
const registry = { hero: Hero, categoryGrid: CategoryGrid, productCollection: ProductCollection,
                   logoMarquee: LogoMarquee, featureTiles: FeatureTiles, testimonials: Testimonials,
                   stats: Stats, newsletter: Newsletter, /* ... */ }

export function RenderBlocks({ blocks }) {
  return blocks.filter(isActive).map((b) => {
    const Block = registry[b.blockType]
    return <BlockWrapper key={b.id} style={b.style}><Block {...b} /></BlockWrapper>
  })
}
```

---

## 8. Admin: Editing Content and Theme

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin / Editor
    participant P as Payload Admin (/rbsadmin)
    participant DB as PostgreSQL
    participant N as Next.js storefront

    A->>P: Open Pages → Home
    A->>P: Drag "Stats" block above "Testimonials",<br/>change hero image, toggle Diwali banner off
    P->>DB: Autosave as draft
    P->>N: Live preview iframe (draft mode)
    N-->>A: Sees changes instantly, side by side
    A->>P: Publish
    P->>DB: Save published version (old version kept)
    P->>N: afterChange hook → revalidateTag('page:home')
    N-->>A: Live site updated in seconds
    Note over A,P: Same flow for Theme, Header, Footer and Announcement Bar globals.<br/>Theme publish → revalidateTag('global:theme') → whole site restyles.
```

**What each role can do**

| Action | Owner | Editor | Order manager |
|---|:-:|:-:|:-:|
| Theme, globals, pages, blocks | ✅ | ✅ | ❌ |
| Products, categories, hampers | ✅ | ✅ | view |
| Orders, refunds, enquiries | ✅ | ❌ | ✅ |
| Coupons, delivery zones, site settings | ✅ | ❌ | ❌ |
| Manage admin users | ✅ | ❌ | ❌ |

---

## 9. Authentication

```mermaid
flowchart TD
    A[Login / Checkout] --> B{Method}
    B -- Phone --> C[Enter mobile number] --> D[Send OTP<br/>MSG91 in prod · console locally] --> E[Verify OTP]
    B -- Google --> F[Continue with Google<br/>OAuth consent] --> F2[Callback: verify ID token,<br/>read email + name]
    B -- Guest --> G[Checkout with phone + email only]
    E --> M{Customer with this<br/>phone exists?}
    F2 --> M2{Customer with this<br/>googleId or email exists?}
    M -- no --> N[Create customer]
    M2 -- no --> N
    M & M2 -- yes --> H
    N --> H[customers collection<br/>signed HTTP-only session cookie]
    H --> K{Google user has<br/>no verified phone?}
    K -- yes --> L[Ask for phone + OTP at first checkout<br/>needed for delivery and COD]
    K -- no --> I
    L --> I[Merge guest cart into account cart]
    G --> J[Order linked by phone<br/>→ can claim it later by logging in with same number]
```

From **Account → Login methods**, a shopper can link the other method, so phone and Google both sign in to the same account.

**Running locally:** Google sign-in needs a free OAuth client from Google Cloud Console with redirect URI `http://localhost:3000/api/auth/google/callback`. Until those keys are in `.env`, the Google button is hidden and phone OTP still works.

---

## 10. Build-Your-Own Box

```mermaid
flowchart LR
    A[Choose box size<br/>6 / 9 / 12 / 18 pcs<br/>sizes and prices set in admin] --> B[Pick sweets from<br/>eligible products grid]
    B --> C{Box full?}
    C -- no --> B
    C -- yes --> D[Choose packaging + gift message]
    D --> E[Add to cart as one line item<br/>with selected contents]
```

---

### How these flows map to milestones

| Flow | Milestone (see PLAN.md §13) |
|---|---|
| 7, 8 | Phase 1 – Customization core |
| 1, 2 | Phase 2–3 – Blocks and catalog |
| 3, 4 | Phase 4 – Cart and checkout |
| 5, 9 | Phase 5 – Accounts and orders |
| 6, 10 | Phase 6 – Gifting and B2B |
