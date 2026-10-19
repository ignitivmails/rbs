/**
 * Demo content for local testing.
 *
 *   npm run seed         → seeds only if the database has no pages yet
 *   npm run seed:fresh   → wipes catalogue/pages/media and seeds again (keeps admin users)
 *
 * All copy, numbers, press names and addresses below are PLACEHOLDERS — edit them in the admin.
 */
import { getPayload, type Payload } from 'payload'

import { DEFAULT_THEME } from '../lib/theme'
import config from '../payload.config'
import { sceneSvg, squareSvg, toJpeg, type ArtKind, type PaletteName } from './art'

type Id = number | string

// Always pass a COPY ({ ...ctx }): Payload uses it as req.context, and plugins mutate it
// (cloud storage sets skipCloudStorage after an upload, which would skip every later upload).
const ctx = { disableRevalidate: true }
const FRESH = process.env.SEED_FRESH === 'true'
const log = (msg: string) => console.log(`  › ${msg}`)

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const textNode = (t: string) => ({ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }
type RichItem = string | { h: string } | { ul: string[] }

const rich = (...items: RichItem[]) => ({
  root: {
    type: 'root',
    ...base,
    children: items.map((item) => {
      if (typeof item === 'string') return { type: 'paragraph', ...base, textFormat: 0, textStyle: '', children: [textNode(item)] }
      if ('h' in item) return { type: 'heading', tag: 'h2', ...base, children: [textNode(item.h)] }
      return {
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        ...base,
        children: item.ul.map((t, i) => ({ type: 'listitem', value: i + 1, ...base, children: [textNode(t)] })),
      }
    }),
  },
})

const url = (href: string, label?: string, newTab = false) => ({ type: 'custom', url: href, label, newTab })
const ref = (relationTo: 'pages' | 'products' | 'categories', value: Id, label?: string) => ({
  type: 'reference',
  reference: { relationTo, value },
  label,
})

async function upload(payload: Payload, filename: string, alt: string, svg: string): Promise<Id> {
  const data = await toJpeg(svg)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: `${filename}.jpg`, size: data.length },
    context: { ...ctx },
  })
  return doc.id as Id
}

/** Loosely typed wrapper — seed data is validated by Payload at runtime. */
async function updateGlobal(payload: Payload, args: { slug: string; data: Record<string, unknown>; context?: unknown }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.updateGlobal({ slug: args.slug as any, data: args.data as any, context: { ...ctx } })
}

async function create(payload: Payload, collection: string, data: Record<string, unknown>): Promise<Id> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = await payload.create({ collection: collection as any, data: data as any, context: { ...ctx } })
  return doc.id as Id
}

/* ------------------------------------------------------------------ */
/* Catalogue data                                                     */
/* ------------------------------------------------------------------ */

const CATEGORIES: Array<{ slug: string; name: string; description: string; art: [ArtKind, PaletteName] }> = [
  { slug: 'rosogolla-rasmalai', name: 'Rosogolla & Rasmalai', description: 'Spongy chhena sweets in syrup, made fresh every morning. Delivered in Pune.', art: ['balls', 'cream'] },
  { slug: 'sandesh', name: 'Sandesh', description: 'Delicate chhena fudge, from winter nolen gur to summer mango.', art: ['discs', 'gur'] },
  { slug: 'mishti-doi-desserts', name: 'Mishti Doi & Desserts', description: 'Caramelised sweet curd set in clay pots, and other chilled treats.', art: ['pot', 'terracotta'] },
  { slug: 'dry-mithai', name: 'Dry Mithai', description: 'Kaju katli and assorted boxes that travel well across India.', art: ['diamonds', 'silver'] },
  { slug: 'chocolate', name: 'Chocolate Mishti', description: 'Where Kolkata sweet-shop classics meet fine chocolate.', art: ['truffles', 'choco'] },
  { slug: 'namkeen', name: 'Namkeen', description: 'Crunchy Bengali snacks for tea-time adda.', art: ['mix', 'namkeen'] },
  { slug: 'hampers', name: 'Gift Hampers', description: 'Curated boxes for Bijoya, Diwali and every celebration in between.', art: ['box', 'maroon'] },
  { slug: 'sugar-free', name: 'No Added Sugar', description: 'Sweetened only with dates, figs and nuts.', art: ['discs', 'date'] },
]

type ProductSeed = {
  key: string
  name: string
  cats: string[]
  art: [ArtKind, PaletteName]
  short: string
  variants: Array<[label: string, price: number, mrp: number, grams: number]>
  local?: boolean
  badges?: string[]
  tags?: string[]
  featured?: boolean
  shelfLife: string
  storage: string
  ingredients: string
  allergens?: string
}

const PRODUCTS: ProductSeed[] = [
  {
    key: 'bijoya-hamper',
    name: 'Bijoya Celebration Hamper',
    cats: ['hampers'],
    art: ['box', 'rose'],
    short: 'Nolen gur truffles, kaju katli, chocolate sandesh and namkeen in a hand-painted keepsake box.',
    variants: [['Standard', 1750, 1970, 900], ['Grand', 2950, 3300, 1600]],
    badges: ['festive'],
    tags: ['festive'],
    featured: true,
    shelfLife: '15 days',
    storage: 'Cool, dry place',
    ingredients: 'Assorted sweets and snacks — see individual items.',
    allergens: 'Contains milk and nuts.',
  },
  {
    key: 'diwali-hamper',
    name: 'Diwali Mishti Hamper',
    cats: ['hampers'],
    art: ['box', 'saffron'],
    short: 'A glowing box of our festive bestsellers with a brass diya.',
    variants: [['Classic', 1300, 1410, 700], ['Deluxe', 2750, 3055, 1500]],
    badges: ['festive'],
    tags: ['festive', 'bestseller'],
    featured: true,
    shelfLife: '15 days',
    storage: 'Cool, dry place',
    ingredients: 'Assorted sweets and snacks — see individual items.',
    allergens: 'Contains milk and nuts.',
  },
  {
    key: 'pujo-box',
    name: 'Pujo Party Treats Box',
    cats: ['hampers'],
    art: ['box', 'pista'],
    short: 'Built for adda: jhal muri mix, nimki, chocolate bark and dry mithai for the whole para.',
    variants: [['Box of 4', 3200, 3655, 1800]],
    badges: ['festive'],
    tags: ['festive'],
    featured: true,
    shelfLife: '20 days',
    storage: 'Cool, dry place',
    ingredients: 'Assorted sweets and snacks — see individual items.',
  },
  {
    key: 'little-joys',
    name: 'Little Joys Gift Box',
    cats: ['hampers'],
    art: ['box', 'sky'],
    short: 'A small thank-you box — perfect for return gifts and desk drops.',
    variants: [['Mini', 990, 1100, 400]],
    tags: ['festive'],
    featured: true,
    shelfLife: '15 days',
    storage: 'Cool, dry place',
    ingredients: 'Kaju katli, chocolate sandesh bites.',
    allergens: 'Contains milk and nuts.',
  },
  {
    key: 'kaju-katli',
    name: 'Saffron Kaju Katli',
    cats: ['dry-mithai'],
    art: ['diamonds', 'silver'],
    short: 'Silky cashew diamonds infused with Kashmiri saffron and finished with edible silver.',
    variants: [['250 g', 420, 460, 250], ['500 g', 820, 900, 500]],
    badges: ['bestseller'],
    tags: ['bestseller', 'festive'],
    featured: true,
    shelfLife: '20 days',
    storage: 'Cool, dry place',
    ingredients: 'Cashew, sugar, saffron, edible silver leaf.',
    allergens: 'Contains nuts.',
  },
  {
    key: 'assorted-box',
    name: 'Assorted Bengali Mithai Box',
    cats: ['dry-mithai', 'hampers'],
    art: ['box', 'maroon'],
    short: 'Our favourite travel-friendly sweets in one box — great for first-timers.',
    variants: [['9 pcs', 650, 720, 350], ['18 pcs', 1200, 1350, 700]],
    badges: ['bestseller'],
    tags: ['bestseller', 'festive'],
    featured: true,
    shelfLife: '10 days',
    storage: 'Cool, dry place',
    ingredients: 'Assorted dry sweets.',
    allergens: 'Contains milk and nuts.',
  },
  {
    key: 'rosogolla',
    name: 'Classic Sponge Rosogolla',
    cats: ['rosogolla-rasmalai'],
    art: ['balls', 'cream'],
    short: 'Soft, spongy chhena balls soaked in light sugar syrup — made fresh every morning in Pune.',
    variants: [['500 g · 8 pcs', 320, 350, 500], ['1 kg · 16 pcs', 600, 680, 1000]],
    local: true,
    badges: ['bestseller', 'pune-exclusive'],
    tags: ['bestseller'],
    shelfLife: '3 days, refrigerated',
    storage: 'Refrigerate below 5°C',
    ingredients: 'Cow milk chhena, sugar, water, cardamom.',
    allergens: 'Contains milk.',
  },
  {
    key: 'rasmalai',
    name: 'Kesar Rasmalai',
    cats: ['rosogolla-rasmalai'],
    art: ['balls', 'saffron'],
    short: 'Flattened chhena discs in thickened saffron milk, topped with pistachio.',
    variants: [['6 pcs', 360, 400, 450], ['12 pcs', 690, 760, 900]],
    local: true,
    badges: ['pune-exclusive'],
    tags: ['bestseller'],
    shelfLife: '2 days, refrigerated',
    storage: 'Refrigerate below 5°C',
    ingredients: 'Milk, chhena, sugar, saffron, pistachio, cardamom.',
    allergens: 'Contains milk and nuts.',
  },
  {
    key: 'nolen-gur-sandesh',
    name: 'Nolen Gur Sandesh',
    cats: ['sandesh'],
    art: ['discs', 'gur'],
    short: 'Winter’s favourite: chhena sandesh sweetened with fresh date-palm jaggery.',
    variants: [['250 g · 10 pcs', 280, 300, 250], ['500 g · 20 pcs', 540, 600, 500]],
    local: true,
    badges: ['limited'],
    tags: ['bestseller', 'seasonal'],
    shelfLife: '4 days, refrigerated',
    storage: 'Refrigerate below 5°C',
    ingredients: 'Chhena, nolen gur (date-palm jaggery).',
    allergens: 'Contains milk.',
  },
  {
    key: 'mango-sandesh',
    name: 'Mango Sandesh',
    cats: ['sandesh'],
    art: ['discs', 'mango'],
    short: 'Alphonso pulp folded into soft chhena — summer in a bite.',
    variants: [['250 g · 10 pcs', 300, 330, 250]],
    local: true,
    tags: ['seasonal'],
    shelfLife: '4 days, refrigerated',
    storage: 'Refrigerate below 5°C',
    ingredients: 'Chhena, Alphonso mango pulp, sugar.',
    allergens: 'Contains milk.',
  },
  {
    key: 'mishti-doi',
    name: 'Mishti Doi (Clay Pot)',
    cats: ['mishti-doi-desserts'],
    art: ['pot', 'terracotta'],
    short: 'Slow-set caramelised sweet curd in a traditional bhaar.',
    variants: [['200 g pot', 90, 100, 300], ['500 g pot', 210, 230, 650]],
    local: true,
    badges: ['bestseller', 'pune-exclusive'],
    tags: ['bestseller'],
    shelfLife: '3 days, refrigerated',
    storage: 'Refrigerate below 5°C',
    ingredients: 'Milk, caramelised sugar, live cultures.',
    allergens: 'Contains milk.',
  },
  {
    key: 'chocolate-sandesh',
    name: 'Chocolate Sandesh Bites',
    cats: ['chocolate', 'sandesh'],
    art: ['truffles', 'choco'],
    short: 'Classic sandesh, enrobed in 54% dark chocolate. Ships anywhere in India.',
    variants: [['12 pcs', 450, 499, 240], ['24 pcs', 850, 960, 480]],
    badges: ['new'],
    tags: ['festive', 'bestseller'],
    shelfLife: '12 days',
    storage: 'Cool, dry place below 25°C',
    ingredients: 'Milk solids, sugar, dark chocolate (cocoa mass, cocoa butter, sugar).',
    allergens: 'Contains milk and soy.',
  },
  {
    key: 'tea-bark',
    name: 'Darjeeling Tea Chocolate Bark',
    cats: ['chocolate'],
    art: ['bark', 'choco'],
    short: 'Dark chocolate infused with first-flush Darjeeling, scattered with rose and pistachio.',
    variants: [['150 g', 390, 425, 150]],
    badges: ['new'],
    tags: ['festive'],
    shelfLife: '60 days',
    storage: 'Cool, dry place below 25°C',
    ingredients: 'Dark chocolate, Darjeeling tea, rose petals, pistachio.',
    allergens: 'Contains nuts, may contain milk.',
  },
  {
    key: 'gur-truffles',
    name: 'Nolen Gur Truffles',
    cats: ['chocolate'],
    art: ['truffles', 'gur'],
    short: 'Silky ganache sweetened with nolen gur, dusted with cocoa.',
    variants: [['9 pcs', 540, 599, 160]],
    badges: ['limited'],
    shelfLife: '20 days',
    storage: 'Cool, dry place below 25°C',
    ingredients: 'Chocolate, cream, nolen gur, cocoa.',
    allergens: 'Contains milk.',
  },
  {
    key: 'jhal-muri',
    name: 'Jhal Muri Mix',
    cats: ['namkeen'],
    art: ['mix', 'namkeen'],
    short: 'Puffed rice, peanuts, chanachur and mustard oil masala — just add onion and lime.',
    variants: [['200 g', 149, 170, 200], ['400 g', 279, 320, 400]],
    tags: ['bestseller'],
    shelfLife: '60 days',
    storage: 'Airtight container',
    ingredients: 'Puffed rice, peanuts, gram flour sev, mustard oil, spices.',
    allergens: 'Contains peanuts.',
  },
  {
    key: 'nimki',
    name: 'Kalonji Nimki',
    cats: ['namkeen'],
    art: ['mix', 'saffron'],
    short: 'Flaky diamond crackers with nigella seeds — the perfect cha companion.',
    variants: [['250 g', 160, 180, 250]],
    shelfLife: '45 days',
    storage: 'Airtight container',
    ingredients: 'Wheat flour, ghee, nigella seeds, salt.',
    allergens: 'Contains gluten and milk.',
  },
  {
    key: 'date-sandesh',
    name: 'Date & Nut Sandesh (No Added Sugar)',
    cats: ['sugar-free', 'sandesh'],
    art: ['discs', 'date'],
    short: 'Chhena, dates and toasted nuts — sweet, with nothing added.',
    variants: [['250 g', 480, 520, 250]],
    badges: ['sugar-free'],
    shelfLife: '10 days',
    storage: 'Cool, dry place',
    ingredients: 'Chhena, dates, figs, almonds, pistachio.',
    allergens: 'Contains milk and nuts.',
  },
]

/* ------------------------------------------------------------------ */
/* Seed steps                                                         */
/* ------------------------------------------------------------------ */

async function wipe(payload: Payload) {
  const collections = ['orders', 'customers', 'coupons', 'quantity-discounts', 'gift-boxes', 'posts', 'stores', 'otp-codes', 'reviews', 'products', 'pages', 'categories', 'delivery-zones', 'media', 'subscribers', 'enquiries']
  for (const collection of collections) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.delete({ collection: collection as any, where: { id: { exists: true } }, context: { ...ctx } })
  }
  log('Cleared existing content')
}

async function ensureAdmin(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return
  await payload.create({
    collection: 'users',
    data: { email: 'admin@realbengalsweets.local', password: 'admin12345', name: 'Store Owner', role: 'owner' },
    context: { ...ctx },
  })
  log('Created admin user  →  admin@realbengalsweets.local / admin12345  (change it after first login!)')
}

const TRACK_ORDER_BLOCK = {
  blockType: 'trackOrder',
  heading: 'Track your order',
  text: 'Enter your order number (from your confirmation email or SMS) and the mobile number used at checkout.',
  buttonLabel: 'Track order',
  style: { paddingTop: 'xl', paddingBottom: 'md' },
}

/** Databases seeded before Phase 5: put the tracking form on the Track Order page. */
async function ensureTrackOrderForm(payload: Payload) {
  const res = await payload.find({ collection: 'pages', where: { slug: { equals: 'track-order' } }, limit: 1, depth: 0 })
  const doc = res.docs[0] as { id: Id; layout?: Array<{ blockType: string }> } | undefined
  if (!doc || doc.layout?.some((b) => b.blockType === 'trackOrder')) return
  const layout = (doc.layout ?? []).filter((b) => b.blockType !== 'richText')
  await payload.update({ collection: 'pages', id: doc.id, data: { layout: [TRACK_ORDER_BLOCK, ...layout], _status: 'published' } as never, context: { ...ctx } })
  log('Track Order page: added the order tracking form')
}

/* ------------------------------------------------------------------ */
/* Phase 6 demo content — each part is added only if missing          */
/* ------------------------------------------------------------------ */

const idBy = async (payload: Payload, collection: string, field: string, value: string): Promise<Id | undefined> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = await payload.find({ collection: collection as any, where: { [field]: { equals: value } }, limit: 1, depth: 0 })
  return (r.docs[0] as { id: Id } | undefined)?.id
}
const mediaId = (payload: Payload, name: string) => idBy(payload, 'media', 'filename', `${name}.jpg`)
const countOf = async (payload: Payload, collection: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await payload.count({ collection: collection as any })).totalDocs

async function ensurePhase6(payload: Payload) {
  const product = (slug: string) => idBy(payload, 'products', 'slug', slug)
  const puneZone = await idBy(payload, 'delivery-zones', 'kind', 'local')

  // Quantity discounts
  if (!(await countOf(payload, 'quantity-discounts'))) {
    const mithai = (await Promise.all(['saffron-kaju-katli', 'assorted-bengali-mithai-box', 'chocolate-sandesh-bites'].map(product))).filter(Boolean)
    const namkeen = await idBy(payload, 'categories', 'slug', 'namkeen')
    await create(payload, 'quantity-discounts', {
      name: 'Mithai bulk saver',
      description: 'Stocking up for the festive season? The more you buy, the more you save.',
      applyTo: 'eachProduct',
      products: mithai,
      tiers: [
        { minQty: 3, type: 'percent', value: 5 },
        { minQty: 6, type: 'percent', value: 10 },
      ],
      active: true,
    })
    if (namkeen) {
      await create(payload, 'quantity-discounts', {
        name: 'Namkeen mix & match',
        description: 'Mix any namkeen — 3 or more packs get 10% off.',
        applyTo: 'combined',
        categories: [namkeen],
        tiers: [{ minQty: 3, type: 'percent', value: 10 }],
        active: true,
      })
    }
    log('Quantity discounts: “Mithai bulk saver” (3+ 5%, 6+ 10%), “Namkeen mix & match” (3+ 10%)')
  }

  // Build-a-box
  if (!(await countOf(payload, 'gift-boxes'))) {
    const sweets: Array<[string, string, number, number | null]> = [
      ['Classic Rosogolla', 'product-rosogolla', 0, null],
      ['Kesar Rasmalai', 'product-rasmalai', 10, null],
      ['Nolen Gur Sandesh', 'product-nolen-gur-sandesh', 0, null],
      ['Mango Sandesh', 'product-mango-sandesh', 5, null],
      ['Saffron Kaju Katli', 'product-kaju-katli', 10, null],
      ['Chocolate Sandesh', 'product-chocolate-sandesh', 15, null],
      ['Date & Nut Sandesh', 'product-date-sandesh', 15, 4],
    ]
    const items = []
    for (const [name, media, extraPrice, maxPerBox] of sweets) {
      items.push({ name, image: await mediaId(payload, media), extraPrice, maxPerBox: maxPerBox ?? undefined, available: true })
    }
    await create(payload, 'gift-boxes', {
      name: 'Build-your-own Mishti Box',
      slug: 'mishti-box',
      description: 'Choose 6, 9 or 12 pieces of our freshest Bengali sweets and pack them your way. Delivered fresh in Pune.',
      image: await mediaId(payload, 'product-assorted-box'),
      active: true,
      sizes: [
        { label: 'Box of 6', pieces: 6, price: 450, mrp: 500 },
        { label: 'Box of 9', pieces: 9, price: 650, mrp: 720 },
        { label: 'Box of 12', pieces: 12, price: 850, mrp: 950 },
      ],
      items,
      packaging: [
        { label: 'Classic box', price: 0, description: 'Our signature printed box' },
        { label: 'Gift box with ribbon', price: 49, description: 'Satin ribbon & tissue wrap' },
        { label: 'Premium keepsake box', price: 149, description: 'Hand-painted, reusable' },
      ],
      allowMessage: true,
      deliveryZones: puneZone ? [puneZone] : [],
      sortOrder: 0,
    })
    log('Build-a-box: “Build-your-own Mishti Box” (6 / 9 / 12 pieces)')
  }

  // Stores
  if (!(await countOf(payload, 'stores'))) {
    const stores: Array<[string, string, string, string, string]> = [
      ['Koregaon Park', 'Lane 6, Koregaon Park', '411001', 'Lane 6, Koregaon Park, Pune 411001', 'tile-cafe'],
      ['Baner', 'Baner Road, near Balewadi Phata', '411045', 'Baner Road, Baner, Pune 411045', 'tile-mithai'],
      ['Viman Nagar', 'Datta Mandir Chowk, Viman Nagar', '411014', 'Datta Mandir Chowk, Viman Nagar, Pune 411014', 'our-story'],
    ]
    for (const [i, [name, address, pincode, mapQuery, image]] of stores.entries()) {
      await create(payload, 'stores', {
        name: `Real Bengal Sweets — ${name}`,
        address,
        city: 'Pune',
        pincode,
        mapQuery,
        phone: '+91 98765 43210',
        whatsapp: '919876543210',
        hours: [
          { days: 'Mon–Sat', time: '9 AM – 10 PM' },
          { days: 'Sunday', time: '10 AM – 10 PM' },
        ],
        services: i === 0 ? ['fresh', 'cafe', 'pickup', 'seating'] : ['fresh', 'pickup', 'parking'],
        image: await mediaId(payload, image),
        active: true,
        sortOrder: i,
      })
    }
    log('Stores: 3 placeholder Pune stores')
  }

  // Blog & Sweets Library
  if (!(await countOf(payload, 'posts'))) {
    const posts: Array<{ title: string; section: 'blog' | 'library'; excerpt: string; cover: string; body: RichItem[]; related: string[] }> = [
      {
        title: 'How we make rosogolla fresh every morning in Pune',
        section: 'blog',
        excerpt: 'From splitting milk at dawn to the final syrup bath — a peek into our kitchen.',
        cover: 'hero-pune',
        body: [
          'Every batch starts before sunrise with fresh cow milk, split with a little whey to make chhena.',
          { h: 'Kneading is everything' },
          'Our karigars knead the chhena by hand until it turns glossy — that’s what makes a rosogolla spongy rather than rubbery.',
          { h: 'The syrup bath' },
          'The balls cook in a light sugar syrup and finish resting overnight in a thinner one, soaking up just enough sweetness.',
        ],
        related: ['classic-sponge-rosogolla', 'kesar-rasmalai'],
      },
      {
        title: 'A Bijoya gifting guide',
        section: 'blog',
        excerpt: 'What to send, how much to buy and how to keep fresh sweets fresh on the way.',
        cover: 'hero-festive',
        body: [
          'Bijoya Dashami is all about visiting, hugging and — of course — mishti.',
          { ul: ['For family nearby: fresh rosogolla and sandesh (Pune delivery)', 'For friends across India: dry mithai and chocolate sandesh travel well', 'For colleagues: our Little Joys box is the perfect desk gift'] },
        ],
        related: ['bijoya-celebration-hamper', 'little-joys-gift-box'],
      },
      {
        title: 'Five ways to enjoy mishti doi',
        section: 'blog',
        excerpt: 'Straight from the clay pot is classic — but have you tried these?',
        cover: 'tile-cafe',
        body: [{ ul: ['Chilled, straight from the bhaar', 'With a drizzle of nolen gur', 'Layered with fruit and granola', 'As a lassi, blended with a little milk', 'Frozen into kulfi moulds'] }],
        related: ['mishti-doi-clay-pot'],
      },
      {
        title: 'Rosogolla',
        section: 'library',
        excerpt: 'Spongy balls of chhena in light syrup — Bengal’s most famous sweet.',
        cover: 'icon-rosogolla-rasmalai',
        body: ['Made from fresh chhena kneaded until smooth, shaped into balls and cooked in sugar syrup.', { h: 'How to enjoy' }, 'Serve chilled or at room temperature. Squeeze gently — a good rosogolla springs back.'],
        related: ['classic-sponge-rosogolla'],
      },
      {
        title: 'Sandesh',
        section: 'library',
        excerpt: 'Delicate, fudge-like chhena sweets — from nolen gur to mango.',
        cover: 'icon-sandesh',
        body: ['Sandesh is made by cooking chhena with sugar or jaggery until it just holds its shape, then pressing it into moulds.', { h: 'Seasonal favourites' }, 'Nolen gur (date-palm jaggery) sandesh in winter, mango sandesh in summer.'],
        related: ['nolen-gur-sandesh', 'mango-sandesh'],
      },
      {
        title: 'Mishti Doi',
        section: 'library',
        excerpt: 'Caramelised sweet curd, set slowly in earthen pots.',
        cover: 'icon-mishti-doi-desserts',
        body: ['Milk is reduced, sweetened with caramelised sugar or jaggery, and set overnight in clay pots that absorb excess moisture.'],
        related: ['mishti-doi-clay-pot'],
      },
    ]
    for (const p of posts) {
      const related = (await Promise.all(p.related.map(product))).filter(Boolean)
      await create(payload, 'posts', {
        _status: 'published',
        title: p.title,
        section: p.section,
        excerpt: p.excerpt,
        cover: await mediaId(payload, p.cover),
        content: rich(...p.body),
        author: p.section === 'blog' ? 'The Real Bengal Sweets kitchen' : undefined,
        relatedProducts: related,
        publishedAt: new Date().toISOString(),
      })
    }
    log('Posts: 3 blog posts + 3 Sweets Library entries')
  }

  // Page sections
  const pageDoc = async (slug: string) => {
    const r = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    return r.docs[0] as { id: Id; layout?: Array<Record<string, unknown> & { blockType: string }> } | undefined
  }
  const savePage = (id: Id, layout: unknown[]) =>
    payload.update({ collection: 'pages', id, data: { layout, _status: 'published' } as never, context: { ...ctx } })

  const corporate = await pageDoc('corporate-gifting')
  if (corporate && !corporate.layout?.some((b) => b.blockType === 'enquiryForm')) {
    const layout = [...(corporate.layout ?? [])]
    const at = layout.findIndex((b) => b.blockType === 'faq')
    layout.splice(at >= 0 ? at : layout.length, 0, {
      blockType: 'enquiryForm',
      heading: 'Get a gifting proposal',
      text: 'Tell us the occasion, quantity and budget — our team replies within 24 hours.',
      enquiryType: 'any',
      showCompany: true,
      showQuantity: true,
      showBudget: true,
      showDate: true,
      style: { anchor: 'enquire', background: 'secondary', paddingTop: 'lg', paddingBottom: 'lg' },
    })
    await savePage(corporate.id, layout)
    log('Corporate gifting page: added the enquiry form')
  }

  const stores = await pageDoc('our-stores')
  if (stores && !stores.layout?.some((b) => b.blockType === 'storeLocator')) {
    await savePage(stores.id, [
      { blockType: 'storeLocator', heading: 'Visit us in Pune', subheading: 'Fresh sweets, chaat and cha at every store.', source: 'all', showMap: true, style: { paddingTop: 'lg', paddingBottom: 'xl' } },
    ])
    log('Our stores page: replaced text with the store locator')
  }

  const home = await pageDoc('home')
  if (home && !home.layout?.some((b) => b.blockType === 'latestPosts')) {
    const layout = [...(home.layout ?? [])]
    const at = layout.findIndex((b) => b.blockType === 'newsletter')
    layout.splice(at >= 0 ? at : layout.length, 0, {
      blockType: 'latestPosts',
      heading: 'From the Sweets Library',
      subheading: 'Get to know the sweets you love.',
      section: 'library',
      limit: 3,
      viewAll: url('/sweets-library', 'Explore the library'),
      style: { paddingTop: 'lg' },
    })
    await savePage(home.id, layout)
    log('Homepage: added “From the Sweets Library”')
  }

  // Navigation: Build a Box in the menu, Blog + Sweets Library in the footer
  const header = (await payload.findGlobal({ slug: 'header', depth: 0 })) as { navItems?: Array<{ label?: string }> }
  if (header.navItems && !header.navItems.some((n) => /box/i.test(n.label ?? ''))) {
    const nav = [...header.navItems]
    const at = nav.findIndex((n) => /gifting/i.test(n.label ?? ''))
    nav.splice(at >= 0 ? at + 1 : nav.length, 0, { label: 'Build a Box', layout: 'link', link: url('/build-your-box') } as never)
    await updateGlobal(payload, { slug: 'header', data: { navItems: nav, _status: 'published' } })
    log('Header: added “Build a Box” to the menu')
  }
  const footer = (await payload.findGlobal({ slug: 'footer', depth: 0 })) as { columns?: Array<{ title?: string; links?: Array<{ link?: { url?: string } }> }> }
  const about = footer.columns?.find((c) => /about/i.test(c.title ?? ''))
  if (about && !about.links?.some((l) => l.link?.url === '/blog')) {
    about.links = [...(about.links ?? []), { link: url('/blog', 'Blog') }, { link: url('/sweets-library', 'Sweets Library') }] as never
    await updateGlobal(payload, { slug: 'footer', data: { columns: footer.columns, _status: 'published' } })
    log('Footer: added Blog and Sweets Library links')
  }
}

/** Demo coupons — added whenever none exist (also on databases seeded before Phase 4). */
async function ensureCoupons(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'coupons' })
  if (totalDocs > 0) return
  await create(payload, 'coupons', { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 200, description: '10% off your first order (up to ₹200)', active: true })
  await create(payload, 'coupons', { code: 'FREEDELIVERY', type: 'freeShipping', minSubtotal: 499, description: 'Free delivery on orders above ₹499', active: true })
  await create(payload, 'coupons', { code: 'BIJOYA250', type: 'flat', value: 250, minSubtotal: 1500, description: '₹250 off festive orders above ₹1,500', active: true })
  log('Coupons: WELCOME10, FREEDELIVERY, BIJOYA250')
}

async function run() {
  const payload = await getPayload({ config })
  console.log('\n🍬 Seeding Real Bengal Sweets demo content…')

  const { totalDocs: existingPages } = await payload.count({ collection: 'pages' })
  if (existingPages > 0 && !FRESH) {
    await ensureCoupons(payload)
    await ensureTrackOrderForm(payload)
    await ensurePhase6(payload)
    console.log('\nThe database already has content — added anything new that was missing. Run `npm run seed:fresh` to wipe and re-seed.\n')
    return
  }
  if (FRESH) await wipe(payload)
  await ensureAdmin(payload)
  await ensureCoupons(payload)

  /* ---------- Delivery zones ---------- */
  const pune = await create(payload, 'delivery-zones', {
    name: 'Pune',
    kind: 'local',
    pincodes: '411001-411062\n412105, 412207, 412307, 412308',
    active: true,
    leadTimeDays: 0,
    sameDayCutoff: '14:00',
    slots: [{ label: '10 AM – 1 PM' }, { label: '1 PM – 5 PM' }, { label: '5 PM – 9 PM' }],
    shippingFee: 49,
    freeShippingAbove: 799,
    codAllowed: true,
    codLimit: 5000,
  })
  await create(payload, 'delivery-zones', {
    name: 'Pan-India',
    kind: 'panIndia',
    isDefault: true,
    active: true,
    leadTimeDays: 3,
    shippingFee: 99,
    freeShippingAbove: 1499,
    codAllowed: true,
    codLimit: 3000,
  })
  log('Delivery zones: Pune (same-day before 2 PM) + Pan-India (default)')

  /* ---------- Artwork ---------- */
  log('Drawing placeholder artwork (takes a few seconds)…')
  const heroFestive = await upload(
    payload,
    'hero-festive',
    'Festive gift hampers with gold ribbons',
    sceneSvg(1920, 900, 'maroon', [
      { kind: 'diamonds', palette: 'silver', x: 1560, y: 290, scale: 0.55 },
      { kind: 'box', palette: 'rose', x: 1230, y: 560, scale: 0.95 },
      { kind: 'box', palette: 'saffron', x: 1600, y: 640, scale: 0.72 },
    ], 11),
  )
  const heroPune = await upload(
    payload,
    'hero-pune',
    'A bowl of fresh rosogolla next to a clay pot of mishti doi',
    sceneSvg(1920, 900, 'forest', [
      { kind: 'balls', palette: 'cream', x: 1330, y: 520, scale: 1.1 },
      { kind: 'pot', palette: 'terracotta', x: 1720, y: 610, scale: 0.62 },
    ], 12),
  )
  const heroCorporate = await upload(
    payload,
    'hero-corporate',
    'Stacks of branded gift boxes',
    sceneSvg(1920, 900, 'night', [
      { kind: 'box', palette: 'sky', x: 1180, y: 580, scale: 0.78 },
      { kind: 'box', palette: 'maroon', x: 1480, y: 600, scale: 0.92 },
      { kind: 'box', palette: 'pista', x: 1770, y: 650, scale: 0.6 },
    ], 13),
  )
  const corporateSplit = await upload(
    payload,
    'corporate-split',
    'Gift boxes ready for corporate delivery',
    sceneSvg(1200, 1000, 'sky', [
      { kind: 'box', palette: 'maroon', x: 600, y: 420, scale: 0.85 },
      { kind: 'box', palette: 'saffron', x: 760, y: 720, scale: 0.6 },
    ], 14),
  )
  const story = await upload(
    payload,
    'our-story',
    'Rosogolla and sandesh on a festive table',
    sceneSvg(1200, 900, 'saffron', [
      { kind: 'balls', palette: 'cream', x: 470, y: 470, scale: 0.85 },
      { kind: 'discs', palette: 'gur', x: 860, y: 600, scale: 0.65 },
    ], 15),
  )
  const tiles = {
    mithai: await upload(payload, 'tile-mithai', 'A plate of sandesh', sceneSvg(1200, 900, 'gur', [{ kind: 'discs', palette: 'cream', x: 600, y: 470, scale: 1.1 }], 21)),
    bulk: await upload(payload, 'tile-bulk', 'Gift boxes for bulk orders', sceneSvg(1200, 900, 'sky', [
      { kind: 'box', palette: 'maroon', x: 430, y: 520, scale: 0.7 },
      { kind: 'box', palette: 'saffron', x: 800, y: 540, scale: 0.7 },
    ], 22)),
    hampers: await upload(payload, 'tile-hampers', 'A curated festive hamper', sceneSvg(1200, 900, 'rose', [{ kind: 'box', palette: 'maroon', x: 600, y: 500, scale: 1 }], 23)),
    cafe: await upload(payload, 'tile-cafe', 'Mishti doi and rosogolla at our café', sceneSvg(1200, 900, 'terracotta', [
      { kind: 'pot', palette: 'terracotta', x: 420, y: 500, scale: 0.7 },
      { kind: 'balls', palette: 'cream', x: 820, y: 520, scale: 0.7 },
    ], 24)),
  }

  const icons: Record<string, Id> = {}
  const banners: Record<string, Id> = {}
  for (const [i, c] of CATEGORIES.entries()) {
    icons[c.slug] = await upload(payload, `icon-${c.slug}`, c.name, squareSvg(c.art[0], c.art[1], 100 + i, 600))
    banners[c.slug] = await upload(
      payload,
      `banner-${c.slug}`,
      `${c.name} banner`,
      sceneSvg(1920, 640, c.art[1], [{ kind: c.art[0], palette: c.art[1], x: 1450, y: 360, scale: 0.72 }], 200 + i),
    )
  }
  icons['shop-pune'] = await upload(payload, 'icon-shop-pune', 'Fresh in Pune', squareSvg('pot', 'pista', 301, 600))
  icons['shop-india'] = await upload(payload, 'icon-shop-india', 'Ships across India', squareSvg('box', 'sky', 302, 600))

  /* ---------- Categories ---------- */
  const cats: Record<string, Id> = {}
  for (const [i, c] of CATEGORIES.entries()) {
    cats[c.slug] = await create(payload, 'categories', {
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: icons[c.slug],
      image: banners[c.slug],
      sortOrder: i,
    })
  }
  log(`Categories: ${CATEGORIES.length}`)

  /* ---------- Products ---------- */
  const products: Record<string, Id> = {}
  for (const [i, p] of PRODUCTS.entries()) {
    const main = await upload(payload, `product-${p.key}`, p.name, squareSvg(p.art[0], p.art[1], 400 + i))
    const alt = await upload(
      payload,
      `product-${p.key}-gift`,
      `${p.name} — gift packaging`,
      squareSvg(p.art[0] === 'box' ? 'truffles' : 'box', p.art[1], 500 + i),
    )
    products[p.key] = await create(payload, 'products', {
      _status: 'published',
      name: p.name,
      shortDescription: p.short,
      description: rich(
        p.short,
        'Made in small batches in our Pune kitchen by karigars trained in Kolkata. Packed in food-grade boxes and sealed fresh on the day of dispatch.',
      ),
      gallery: [main, alt],
      variants: p.variants.map(([label, price, mrp, grams], vi) => ({
        label,
        price,
        mrp,
        weight: grams,
        stock: 100,
        sku: `RBS-${p.key.toUpperCase()}-${vi + 1}`,
      })),
      categories: p.cats.map((slug) => cats[slug]),
      deliveryZones: p.local ? [pune] : [],
      badges: p.badges ?? [],
      tags: p.tags ?? [],
      featured: Boolean(p.featured),
      sortOrder: i * 10,
      isVeg: true,
      eggless: true,
      shelfLife: p.shelfLife,
      storage: p.storage,
      ingredients: p.ingredients,
      allergens: p.allergens,
    })
  }
  log(`Products: ${PRODUCTS.length}`)

  /* ---------- Reviews ---------- */
  const reviews: Array<[string, string, string, number, string, boolean]> = [
    ['bijoya-hamper', 'Ananya Sen', 'HR Director, Pune', 5, 'We sent 400 Bijoya hampers to our team across India — every box arrived perfect, and the nolen gur truffles were the talk of the office.', true],
    ['rosogolla', 'Rohan Kulkarni', 'Baner, Pune', 5, 'Finally, rosogolla in Pune that tastes like College Street. Spongy, light syrup, and delivered the same evening.', true],
    ['mishti-doi', 'Mitali Banerjee', 'Kalyani Nagar, Pune', 5, 'The mishti doi in a real clay pot took me straight back to my grandmother’s kitchen in Kolkata.', true],
    ['kaju-katli', 'Priya Deshpande', 'Mumbai', 5, 'Thin, silky and not too sweet. Our Diwali guests asked where we got it from!', false],
    ['chocolate-sandesh', 'Arjun Das', 'Bengaluru', 4, 'Lovely twist on sandesh. Arrived well-packed in Bengaluru heat.', false],
    ['assorted-box', 'Sneha Iyer', 'Hyderabad', 5, 'Perfect introduction to Bengali sweets for my in-laws. Beautiful box too.', false],
  ]
  for (const [key, author, designation, rating, text, featured] of reviews) {
    await create(payload, 'reviews', { product: products[key], author, designation, rating, text, approved: true, featured })
  }
  log(`Reviews: ${reviews.length}`)

  /* ---------- Pages (non-home first, so home/header can link to them) ---------- */
  const pages: Record<string, Id> = {}
  const page = async (slug: string, title: string, layout: unknown[], description?: string) => {
    pages[slug] = await create(payload, 'pages', { _status: 'published', title, slug, layout, meta: { description } })
  }

  const statsBlock = (heading: string, style?: Record<string, unknown>) => ({
    blockType: 'stats',
    heading,
    variant: 'row',
    animate: true,
    items: [
      { value: 2500, suffix: '+', label: 'Corporate clients' },
      { value: 800, suffix: '+', label: 'Weddings celebrated' },
      { value: 120000, suffix: '+', label: 'Boxes delivered' },
      { value: 19000, suffix: '+', label: 'Pincodes served' },
    ],
    style,
  })

  await page('about-us', 'About us', [
    {
      blockType: 'imageWithText',
      image: story,
      imagePosition: 'right',
      variant: 'default',
      eyebrow: 'Our story',
      heading: 'From a Kolkata para to a Pune kitchen',
      content: rich(
        'Real Bengal Sweets began with a simple homesickness: the rosogolla, sandesh and mishti doi we grew up with were impossible to find fresh in Pune.',
        'So we brought the recipes — and the karigars — with us. Every morning our kitchen turns fresh chhena into the sweets Kolkata is famous for, and our gifting team packs them into boxes that travel the length of India.',
      ),
      style: { paddingTop: 'lg' },
    },
    {
      blockType: 'richText',
      content: rich(
        { h: 'What we believe in' },
        { ul: ['Fresh chhena, made in-house every single day', 'No artificial colours or preservatives in our fresh range', 'Honest pricing — MRP inclusive of all taxes', 'Packaging that’s beautiful, recyclable and keeps sweets safe'] },
      ),
    },
    statsBlock('A few numbers we’re proud of', { background: 'secondary' }),
  ], 'The story behind Real Bengal Sweets — authentic Bengali mishti made fresh in Pune.')

  await page('corporate-gifting', 'Corporate & bulk gifting', [
    {
      blockType: 'hero',
      variant: 'split',
      height: 'md',
      slides: [
        {
          image: corporateSplit,
          eyebrow: 'Bulk & corporate gifting',
          heading: 'Gifts your team will actually look forward to',
          text: 'Custom-branded mishti hampers for Diwali, Bijoya, onboarding and client gifting — delivered to 19,000+ pincodes.',
          align: 'left',
          tone: 'dark',
          ctas: [
            { link: url('https://wa.me/919876543210?text=Hi%2C%20I%27d%20like%20a%20corporate%20gifting%20quote', 'Get a quote on WhatsApp', true), appearance: 'primary' },
            { link: url('/collections/hampers', 'Browse hampers'), appearance: 'outline' },
          ],
        },
      ],
      style: { paddingTop: 'sm' },
    },
    {
      blockType: 'featureTiles',
      heading: 'Gifting for every occasion',
      variant: 'overlay',
      columns: 4,
      tiles: [
        { image: tiles.bulk, title: 'Corporate gifting', text: 'Festive, onboarding and client boxes with your branding.', link: url('#occasions') },
        { image: tiles.hampers, title: 'Weddings', text: 'Tattva trays, shagun boxes and guest favours.', link: url('#occasions') },
        { image: tiles.mithai, title: 'Celebrations', text: 'Birthdays, anniversaries and housewarmings.', link: url('#occasions') },
        { image: tiles.cafe, title: 'Baby announcements', text: 'Share the good news the Bengali way.', link: url('#occasions') },
      ],
      style: { anchor: 'occasions' },
    },
    statsBlock('Trusted by teams across India', { background: 'secondary' }),
    { blockType: 'testimonials', heading: 'What our clients say', source: 'featured', variant: 'cards', limit: 3 },
    {
      blockType: 'faq',
      heading: 'Bulk order FAQs',
      items: [
        { question: 'What is the minimum order quantity?', answer: 'Corporate pricing starts at 25 boxes. For smaller quantities, shop our hampers directly.' },
        { question: 'Can you add our logo or a custom note?', answer: 'Yes — branded sleeves, ribbons and printed cards are available on orders of 50+ boxes.' },
        { question: 'Do you deliver to multiple addresses?', answer: 'Yes. Share a spreadsheet of addresses and we’ll ship to each recipient anywhere in India.' },
        { question: 'Do you provide GST invoices?', answer: 'Yes, every corporate order comes with a GST invoice.' },
      ],
    },
    {
      blockType: 'bannerStrip',
      heading: 'Planning something big?',
      text: 'Tell us your budget, quantity and date — we’ll send a proposal within 24 hours.',
      cta: url('mailto:hello@realbengalsweets.in', 'Email our gifting team'),
      variant: 'slim',
      align: 'center',
      style: { paddingBottom: 'xl' },
    },
  ], 'Custom-branded Bengali sweet hampers for corporate, wedding and festive gifting — pan-India delivery.')

  await page('our-stores', 'Our stores', [
    {
      blockType: 'richText',
      content: rich(
        { h: 'Visit us in Pune' },
        'Koregaon Park — Lane 6, Koregaon Park, Pune 411001 · 9 AM – 10 PM',
        'Baner — Baner Road, near Balewadi Phata, Pune 411045 · 9 AM – 10 PM',
        'Viman Nagar — Datta Mandir Chowk, Pune 411014 · 10 AM – 10 PM',
        'All stores serve fresh rosogolla, mishti doi and our café menu of chaat and Bengali snacks. (Placeholder addresses — update in the admin.)',
      ),
      style: { paddingTop: 'lg', paddingBottom: 'xl' },
    },
  ])

  await page('track-order', 'Track your order', [
    TRACK_ORDER_BLOCK,
    {
      blockType: 'bannerStrip',
      heading: 'Questions about an order?',
      cta: url('https://wa.me/919876543210', 'WhatsApp us', true),
      variant: 'slim',
      style: { paddingBottom: 'xl' },
    },
  ])

  await page('faqs', 'FAQs', [
    {
      blockType: 'faq',
      heading: 'Frequently asked questions',
      items: [
        { question: 'Where do you deliver?', answer: 'Fresh sweets (rosogolla, rasmalai, sandesh, mishti doi) are delivered within Pune. Hampers, dry mithai, chocolate and namkeen ship across India.' },
        { question: 'Do you offer same-day delivery?', answer: 'Yes, in Pune — order before 2 PM for delivery the same day.' },
        { question: 'Is Cash on Delivery available?', answer: 'Yes, for most pincodes. Enter your pincode on any product page to check.' },
        { question: 'How should I store fresh sweets?', answer: 'Refrigerate syrup-based sweets and mishti doi below 5°C and enjoy within 2–3 days.' },
      ],
      style: { paddingTop: 'lg', paddingBottom: 'xl' },
    },
  ])

  const policy = (title: string) => [
    {
      blockType: 'richText',
      content: rich({ h: title }, 'This is placeholder policy text. Replace it with your own terms in the admin panel under Content → Pages.'),
      style: { paddingTop: 'lg', paddingBottom: 'xl' },
    },
  ]
  await page('shipping-policy', 'Shipping policy', policy('Shipping policy'))
  await page('refund-policy', 'Refund policy', policy('Refund policy'))
  await page('privacy-policy', 'Privacy policy', policy('Privacy policy'))
  await page('terms-of-service', 'Terms of service', policy('Terms of service'))

  /* ---------- Homepage ---------- */
  await page('home', 'Home', [
    {
      blockType: 'hero',
      variant: 'carousel',
      height: 'lg',
      autoplaySeconds: 6,
      slides: [
        {
          image: heroFestive,
          eyebrow: 'Bijoya & Diwali 2026',
          heading: 'Reimagining mishti for modern gifting',
          text: 'Hand-painted hampers filled with Kolkata classics — delivered across India.',
          align: 'left',
          tone: 'light',
          overlay: 45,
          ctas: [
            { link: ref('categories', cats['hampers'], 'Shop hampers'), appearance: 'light' },
            { link: ref('pages', pages['corporate-gifting'], 'Bulk orders'), appearance: 'outline' },
          ],
        },
        {
          image: heroPune,
          eyebrow: 'Fresh every morning',
          heading: 'Same-day rosogolla across Pune',
          text: 'Order before 2 PM and get spongy rosogolla and clay-pot mishti doi the same evening.',
          align: 'left',
          tone: 'light',
          overlay: 40,
          ctas: [{ link: url('/shop?zone=local', 'Shop fresh in Pune'), appearance: 'light' }],
        },
        {
          image: heroCorporate,
          eyebrow: 'Corporate gifting',
          heading: 'Gifting at scale, without the stress',
          text: 'Branded boxes for 25 to 25,000 — we handle packing and delivery to every address.',
          align: 'left',
          tone: 'light',
          overlay: 45,
          ctas: [{ link: ref('pages', pages['corporate-gifting'], 'Get a quote'), appearance: 'primary' }],
        },
      ],
      style: { width: 'full', paddingTop: 'none', paddingBottom: 'none' },
    },
    {
      blockType: 'categoryGrid',
      heading: 'Shop by category',
      source: 'custom',
      variant: 'cards',
      columns: 9,
      tiles: [
        { label: 'Festive Specials', image: icons['hampers'], link: ref('categories', cats['hampers']) },
        { label: 'Shop Pune', image: icons['shop-pune'], link: url('/shop?zone=local') },
        { label: 'Shop All-India', image: icons['shop-india'], link: url('/shop?zone=pan-india') },
        { label: 'Rosogolla', image: icons['rosogolla-rasmalai'], link: ref('categories', cats['rosogolla-rasmalai']) },
        { label: 'Sandesh', image: icons['sandesh'], link: ref('categories', cats['sandesh']) },
        { label: 'Mishti Doi', image: icons['mishti-doi-desserts'], link: ref('categories', cats['mishti-doi-desserts']) },
        { label: 'Chocolate', image: icons['chocolate'], link: ref('categories', cats['chocolate']) },
        { label: 'Namkeen', image: icons['namkeen'], link: ref('categories', cats['namkeen']) },
        { label: 'No Added Sugar', image: icons['sugar-free'], link: ref('categories', cats['sugar-free']) },
      ],
      style: { paddingTop: 'lg', paddingBottom: 'md' },
    },
    {
      blockType: 'logoMarquee',
      heading: 'As featured in',
      variant: 'marquee',
      speed: 'normal',
      grayscale: true,
      logos: [
        { name: 'The Mishti Monthly' },
        { name: 'Pune Food Review' },
        { name: 'Sweet Tooth Weekly' },
        { name: 'Bengal Kitchen Diaries' },
        { name: 'The Gifting Edit' },
        { name: 'Deccan Taste' },
      ],
      style: { background: 'surface', width: 'full', paddingTop: 'sm', paddingBottom: 'sm' },
    },
    {
      blockType: 'productCollection',
      heading: 'Our festive gifting favourites',
      subheading: 'Hand-packed hampers for Bijoya, Diwali and every celebration in between.',
      source: 'featured',
      variant: 'grid',
      limit: 6,
      columns: 3,
      viewAll: ref('categories', cats['hampers'], 'View all hampers'),
      style: { paddingTop: 'lg' },
    },
    {
      blockType: 'featureTiles',
      heading: 'The Real Bengal Sweets experience',
      variant: 'overlay',
      columns: 4,
      tiles: [
        { image: tiles.mithai, title: 'Bengali mishti & desserts', text: 'Rosogolla, sandesh and mishti doi, made fresh daily.', link: url('/shop', 'Shop sweets') },
        { image: tiles.bulk, title: 'Bulk gifting', text: 'Branded boxes for teams and clients, delivered anywhere.', link: ref('pages', pages['corporate-gifting'], 'Enquire') },
        { image: tiles.hampers, title: 'Curated hampers', text: 'Festive boxes designed to delight.', link: ref('categories', cats['hampers'], 'Explore') },
        { image: tiles.cafe, title: 'Our cafés', text: 'Chaat, desserts and cha across Pune.', link: ref('pages', pages['our-stores'], 'Visit us') },
      ],
      style: { background: 'secondary', paddingTop: 'lg', paddingBottom: 'lg' },
    },
    {
      blockType: 'productCollection',
      heading: 'Bestsellers',
      subheading: 'The sweets Pune keeps coming back for.',
      source: 'tag',
      tag: 'bestseller',
      variant: 'carousel',
      limit: 8,
      viewAll: url('/shop', 'Shop all sweets'),
      style: { paddingTop: 'lg' },
    },
    {
      blockType: 'imageWithText',
      image: story,
      imagePosition: 'left',
      variant: 'overlap',
      eyebrow: 'Our story',
      heading: 'Kolkata’s sweet-shop tradition, made fresh in Pune',
      content: rich(
        'Our karigars learned their craft in the lanes of north Kolkata. Today they turn fresh chhena into rosogolla, sandesh and mishti doi every morning in our Pune kitchen.',
      ),
      cta: ref('pages', pages['about-us'], 'Read our story'),
    },
    {
      blockType: 'testimonials',
      heading: 'Loved by families and companies alike',
      source: 'featured',
      variant: 'cards',
      limit: 3,
      style: { background: 'surface', paddingTop: 'lg', paddingBottom: 'lg' },
    },
    statsBlock('Trusted across India'),
    {
      blockType: 'newsletter',
      heading: 'Join the mishti club',
      text: 'Festive launches, workshops and members-only offers — straight to your inbox.',
      placeholder: 'Your email address',
      buttonLabel: 'Subscribe',
      disclaimer: 'We don’t spam. It’s a promise.',
      variant: 'card',
      style: { paddingBottom: 'xl' },
    },
  ], 'Authentic Bengali sweets made fresh in Pune — rosogolla, sandesh, mishti doi and festive gift hampers with pan-India delivery.')
  log(`Pages: ${Object.keys(pages).length}`)

  /* ---------- Globals ---------- */
  await updateGlobal(payload, { slug: 'theme', data: { ...DEFAULT_THEME, _status: 'published' }, context: { ...ctx } })

  await updateGlobal(payload, {
    slug: 'header',
    data: {
      _status: 'published',
      logoText: 'Real Bengal Sweets',
      logoHeight: 44,
      sticky: true,
      showSearch: true,
      showAccount: true,
      showCart: true,
      popularSearches: ['Rosogolla', 'Mishti doi', 'Hampers', 'Kaju katli', 'Sandesh', 'Chocolate'],
      utility: {
        enabled: true,
        text: 'Same-day delivery in Pune · Pan-India shipping on hampers & dry sweets',
        showPhone: true,
        showWhatsapp: true,
        showSocials: true,
      },
      navItems: [
        {
          label: 'Shop All',
          layout: 'mega',
          link: url('/shop'),
          columns: [
            {
              heading: 'Fresh in Pune',
              headingLink: url('/shop?zone=local'),
              products: [products['rosogolla'], products['rasmalai'], products['mishti-doi'], products['nolen-gur-sandesh']],
            },
            {
              heading: 'Sandesh & Mithai',
              headingLink: ref('categories', cats['sandesh']),
              products: [products['mango-sandesh'], products['kaju-katli'], products['assorted-box'], products['date-sandesh']],
            },
            {
              heading: 'Chocolate',
              headingLink: ref('categories', cats['chocolate']),
              products: [products['chocolate-sandesh'], products['tea-bark'], products['gur-truffles']],
            },
            {
              heading: 'More to explore',
              items: [
                { link: ref('categories', cats['namkeen'], 'Namkeen') },
                { link: ref('categories', cats['sugar-free'], 'No Added Sugar') },
                { link: ref('categories', cats['dry-mithai'], 'Dry Mithai') },
                { link: url('/shop?zone=pan-india', 'Ships pan-India') },
                { link: url('/shop', 'Shop everything') },
              ],
            },
          ],
          promo: { image: heroFestive, title: 'Bijoya & Diwali hampers', link: ref('categories', cats['hampers']) },
        },
        {
          label: 'Festive Hampers',
          layout: 'dropdown',
          link: ref('categories', cats['hampers']),
          columns: [
            {
              heading: 'Hampers',
              items: ['bijoya-hamper', 'diwali-hamper', 'pujo-box', 'little-joys', 'assorted-box'].map((k) => ({
                link: ref('products', products[k], PRODUCTS.find((p) => p.key === k)?.name),
              })),
            },
          ],
        },
        {
          label: 'Customised Gifting',
          layout: 'dropdown',
          link: ref('pages', pages['corporate-gifting']),
          columns: [
            {
              heading: 'Gifting',
              items: [
                { link: url('/corporate-gifting#occasions', 'Corporate gifting') },
                { link: url('/corporate-gifting#occasions', 'Weddings') },
                { link: url('/corporate-gifting#occasions', 'Celebrations') },
                { link: url('/corporate-gifting#occasions', 'Baby announcements') },
              ],
            },
          ],
        },
        { label: 'Shop Pune', layout: 'link', link: url('/shop?zone=local') },
        { label: 'Track Order', layout: 'link', link: ref('pages', pages['track-order']) },
        { label: 'Our Stores', layout: 'link', link: ref('pages', pages['our-stores']) },
        { label: 'About Us', layout: 'link', link: ref('pages', pages['about-us']) },
      ],
    },
    context: { ...ctx },
  })

  await updateGlobal(payload, {
    slug: 'announcement-bar',
    data: {
      _status: 'published',
      enabled: true,
      rotateSeconds: 5,
      dismissible: false,
      messages: [
        { text: 'Bijoya & Diwali hampers are here — pan-India delivery', link: ref('categories', cats['hampers']) },
        { text: 'Same-day delivery across Pune on orders before 2 PM', link: url('/shop?zone=local') },
        { text: 'Corporate gifting is open for bulk orders', link: ref('pages', pages['corporate-gifting']) },
      ],
    },
    context: { ...ctx },
  })

  await updateGlobal(payload, {
    slug: 'footer',
    data: {
      _status: 'published',
      about: 'Authentic Bengali mishti, made fresh every morning in Pune and gifted across India.',
      columns: [
        {
          title: 'Shop',
          links: [
            { link: url('/shop', 'Shop all') },
            { link: url('/shop?zone=local', 'Fresh in Pune') },
            { link: url('/shop?zone=pan-india', 'Ships pan-India') },
            { link: ref('categories', cats['hampers'], 'Hampers') },
            { link: ref('pages', pages['corporate-gifting'], 'Bulk gifting') },
          ],
        },
        {
          title: 'About',
          links: [
            { link: ref('pages', pages['about-us'], 'Our story') },
            { link: ref('pages', pages['our-stores'], 'Our stores') },
            { link: ref('pages', pages['track-order'], 'Track order') },
            { link: ref('pages', pages['faqs'], 'FAQs') },
          ],
        },
        {
          title: 'Policies',
          links: [
            { link: ref('pages', pages['terms-of-service'], 'Terms of service') },
            { link: ref('pages', pages['privacy-policy'], 'Privacy policy') },
            { link: ref('pages', pages['shipping-policy'], 'Shipping policy') },
            { link: ref('pages', pages['refund-policy'], 'Refund policy') },
          ],
        },
      ],
      showNewsletter: true,
      newsletterHeading: 'Stay in the loop',
      newsletterText: 'Subscribe for festive launches, workshops and members-only offers.',
      newsletterPlaceholder: 'Your email address',
      newsletterButton: 'Subscribe',
      newsletterDisclaimer: 'We don’t spam. It’s a promise.',
      showContact: true,
      showSocials: true,
      copyright: '© {year} Real Bengal Sweets. All rights reserved.',
      legalText: 'FSSAI Lic. No. 00000000000000 (placeholder — update in admin)',
    },
    context: { ...ctx },
  })

  await updateGlobal(payload, {
    slug: 'site-settings',
    data: {
      siteName: 'Real Bengal Sweets',
      tagline: 'Authentic Bengali sweets, made fresh in Pune',
      titleTemplate: '%s | Real Bengal Sweets',
      metaDescription: 'Rosogolla, sandesh, mishti doi and festive gift hampers — made fresh in Pune with pan-India delivery.',
      ogImage: heroFestive,
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      email: 'hello@realbengalsweets.in',
      address: 'Lane 6, Koregaon Park\nPune, Maharashtra 411001',
      socials: [
        { platform: 'instagram', url: 'https://www.instagram.com/' },
        { platform: 'facebook', url: 'https://www.facebook.com/' },
        { platform: 'youtube', url: 'https://www.youtube.com/' },
      ],
      whatsappFloat: true,
      whatsappMessage: 'Hi! I have a question about an order.',
      currency: 'INR',
      pricesIncludeTax: true,
      minOrderValue: 0,
      razorpayEnabled: true,
      codEnabled: true,
      enableBengali: false,
    },
    context: { ...ctx },
  })
  log('Globals: theme, header, announcement bar, footer, site settings')

  await ensurePhase6(payload)

  console.log('\n✅ Done! Start the app with `npm run dev`, then open http://localhost:3000 (admin: /admin)\n')
}

/** Content changed outside Next.js: clear the storefront cache (running server + on-disk cache). */
async function refreshStorefrontCache() {
  try {
    const { createHash } = await import('crypto')
    const token = createHash('sha256').update(`revalidate:${process.env.PAYLOAD_SECRET ?? ''}`).digest('hex')
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/next/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-token': token },
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) log('Refreshed the running site’s cache')
  } catch {
    // No server running — fine.
  }
  try {
    const { rm } = await import('fs/promises')
    await rm('.next/cache/fetch-cache', { recursive: true, force: true })
  } catch {
    /* ignore */
  }
}

try {
  await run()
  await refreshStorefrontCache()
  process.exit(0)
} catch (err) {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
}
