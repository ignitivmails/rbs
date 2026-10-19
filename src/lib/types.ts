/**
 * Hand-written shapes for CMS data used by the storefront.
 * (Run `npm run generate:types` for Payload's full generated types in src/payload-types.ts.)
 */

export type ID = number | string

export type Relation<T> = T | ID | null | undefined

export type MediaSize = { url?: string | null; width?: number | null; height?: number | null }

export type MediaDoc = {
  id: ID
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  filename?: string | null
  focalX?: number | null
  focalY?: number | null
  sizes?: Record<string, MediaSize | undefined> | null
}

/** Normalised image for components (server or client). */
export type ImageData = {
  src: string
  width?: number
  height?: number
  alt: string
  objectPosition?: string
  svg?: boolean
}

export type LinkData = {
  type?: 'custom' | 'reference' | null
  url?: string | null
  label?: string | null
  newTab?: boolean | null
  reference?: { relationTo: 'pages' | 'products' | 'categories'; value: unknown } | null
}

export type ResolvedLink = { href: string; label: string; newTab: boolean }

export type Meta = { title?: string | null; description?: string | null; image?: Relation<MediaDoc> } | null

export type Variant = {
  id?: string | null
  label: string
  sku?: string | null
  price: number
  mrp?: number | null
  stock?: number | null
  weight?: number | null
}

export type Category = {
  id: ID
  name: string
  slug: string
  description?: string | null
  icon?: Relation<MediaDoc>
  image?: Relation<MediaDoc>
  parent?: Relation<Category>
  sortOrder?: number | null
  layout?: BlockData[] | null
  meta?: Meta
}

export type DeliveryZone = {
  id: ID
  name: string
  kind?: 'local' | 'panIndia' | null
  pincodes?: string | null
  isDefault?: boolean | null
  active?: boolean | null
  leadTimeDays?: number | null
  sameDayCutoff?: string | null
  slots?: { label?: string | null }[] | null
  blackoutDates?: { date?: string | null }[] | null
  shippingFee?: number | null
  freeShippingAbove?: number | null
  codAllowed?: boolean | null
  codLimit?: number | null
}

export type Product = {
  id: ID
  name: string
  slug: string
  shortDescription?: string | null
  description?: unknown
  gallery?: Relation<MediaDoc>[] | null
  variants?: Variant[] | null
  categories?: Relation<Category>[] | null
  deliveryZones?: Relation<DeliveryZone>[] | null
  badges?: string[] | null
  tags?: string[] | null
  featured?: boolean | null
  priceFrom?: number | null
  maxDiscount?: number | null
  inStock?: boolean | null
  shipsPanIndia?: boolean | null
  rating?: number | null
  reviewCount?: number | null
  isVeg?: boolean | null
  eggless?: boolean | null
  shelfLife?: string | null
  storage?: string | null
  ingredients?: string | null
  allergens?: string | null
  relatedProducts?: Relation<Product>[] | null
  meta?: Meta
  _status?: 'draft' | 'published' | null
}

export type Review = {
  id: ID
  author: string
  designation?: string | null
  rating: number
  text: string
  image?: Relation<MediaDoc>
  product?: Relation<Product>
  approved?: boolean | null
  featured?: boolean | null
  createdAt?: string
}

export type SectionStyle = {
  background?: string | null
  customBg?: string | null
  textColor?: string | null
  bgImage?: Relation<MediaDoc>
  paddingTop?: string | null
  paddingBottom?: string | null
  width?: string | null
  visibility?: string | null
  anchor?: string | null
  className?: string | null
}

export type BlockData = {
  id?: string | null
  blockType: string
  blockName?: string | null
  enabled?: boolean | null
  showFrom?: string | null
  showUntil?: string | null
  style?: SectionStyle | null
  // Block-specific fields
  [key: string]: unknown
}

export type Page = {
  id: ID
  title: string
  slug: string
  layout?: BlockData[] | null
  meta?: Meta
}

/* ---------------- Orders ---------------- */

export type OrderItem = {
  id?: string | null
  product?: Relation<Product>
  productName: string
  variantId?: string | null
  variantLabel?: string | null
  sku?: string | null
  unitPrice: number
  mrp?: number | null
  qty: number
  lineTotal: number
  lineDiscount?: number | null
  kind?: 'product' | 'box' | null
  boxContents?: string | null
}

export type Order = {
  id: ID
  orderNumber: string
  status: string
  customer?: Relation<Customer>
  updatedAt?: string
  customerName: string
  phone: string
  email?: string | null
  address?: {
    line1?: string | null
    line2?: string | null
    landmark?: string | null
    city?: string | null
    state?: string | null
    pincode?: string | null
  } | null
  deliveryZone?: Relation<DeliveryZone>
  zoneName?: string | null
  deliveryDate?: string | null
  deliveryLabel?: string | null
  deliverySlot?: string | null
  isGift?: boolean | null
  giftMessage?: string | null
  hidePrices?: boolean | null
  notes?: string | null
  items?: OrderItem[] | null
  subtotal: number
  mrpTotal?: number | null
  quantityDiscount?: number | null
  discount?: number | null
  shipping?: number | null
  total: number
  couponCode?: string | null
  paymentMethod: 'razorpay' | 'cod'
  paymentStatus?: string | null
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  refundId?: string | null
  paidAt?: string | null
  expiresAt?: string | null
  carrier?: string | null
  awb?: string | null
  trackingUrl?: string | null
  statusHistory?: { status?: string | null; note?: string | null; by?: string | null; at?: string | null }[] | null
  stockReserved?: boolean | null
  stockReleased?: boolean | null
  accessToken?: string | null
  internalNotes?: string | null
  createdAt?: string
}

export type Coupon = {
  id: ID
  code: string
  description?: string | null
  type: 'percent' | 'flat' | 'freeShipping'
  value?: number | null
  maxDiscount?: number | null
  minSubtotal?: number | null
  startsAt?: string | null
  endsAt?: string | null
  usageLimit?: number | null
  usageCount?: number | null
  active?: boolean | null
}

/* ---------------- Phase 6 content ---------------- */

export type GiftBox = {
  id: ID
  name: string
  slug: string
  description?: string | null
  image?: Relation<MediaDoc>
  active?: boolean | null
  sizes?: Array<{ id?: string | null; label: string; pieces: number; price: number; mrp?: number | null }> | null
  items?: Array<{
    id?: string | null
    name: string
    image?: Relation<MediaDoc>
    available?: boolean | null
    extraPrice?: number | null
    maxPerBox?: number | null
    description?: string | null
  }> | null
  packaging?: Array<{ id?: string | null; label: string; price?: number | null; description?: string | null }> | null
  allowMessage?: boolean | null
  deliveryZones?: Relation<DeliveryZone>[] | null
  meta?: Meta
}

export type Store = {
  id: ID
  name: string
  city?: string | null
  pincode?: string | null
  address: string
  mapQuery?: string | null
  phone?: string | null
  whatsapp?: string | null
  hours?: Array<{ days: string; time: string }> | null
  services?: string[] | null
  image?: Relation<MediaDoc>
}

export type Post = {
  id: ID
  title: string
  slug: string
  section: 'blog' | 'library'
  excerpt?: string | null
  cover?: Relation<MediaDoc>
  content?: unknown
  author?: string | null
  publishedAt?: string | null
  tags?: string[] | null
  relatedProducts?: Relation<Product>[] | null
  meta?: Meta
  _status?: 'draft' | 'published' | null
}

/* ---------------- Customers ---------------- */

export type CustomerAddress = {
  id?: string | null
  label?: string | null
  name?: string | null
  phone?: string | null
  line1: string
  line2?: string | null
  landmark?: string | null
  city: string
  state: string
  pincode: string
  isDefault?: boolean | null
}

export type Customer = {
  id: ID
  name?: string | null
  phone?: string | null
  phoneVerified?: boolean | null
  email?: string | null
  googleId?: string | null
  authProviders?: string[] | null
  addresses?: CustomerAddress[] | null
  cart?: unknown
  lastLoginAt?: string | null
}

/* ---------------- Globals ---------------- */

export type SocialLink = { platform?: string | null; url?: string | null }

export type SettingsData = {
  siteName?: string | null
  tagline?: string | null
  favicon?: Relation<MediaDoc>
  titleTemplate?: string | null
  metaDescription?: string | null
  ogImage?: Relation<MediaDoc>
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  socials?: SocialLink[] | null
  whatsappFloat?: boolean | null
  whatsappMessage?: string | null
  currency?: string | null
  pricesIncludeTax?: boolean | null
  minOrderValue?: number | null
  razorpayEnabled?: boolean | null
  upiFirst?: boolean | null
  codEnabled?: boolean | null
  codRequiresOtp?: boolean | null
  giftOptions?: boolean | null
  orderPrefix?: string | null
  paymentWindowMinutes?: number | null
  enableBengali?: boolean | null
  ga4Id?: string | null
  metaPixelId?: string | null
}

export type NavColumnData = {
  heading?: string | null
  headingLink?: LinkData | null
  items?: { link?: LinkData | null }[] | null
  products?: Relation<Product>[] | null
}

export type NavItemData = {
  label?: string | null
  layout?: 'link' | 'dropdown' | 'mega' | null
  link?: LinkData | null
  columns?: NavColumnData[] | null
  promo?: { image?: Relation<MediaDoc>; title?: string | null; link?: LinkData | null } | null
}

export type HeaderData = {
  logo?: Relation<MediaDoc>
  logoText?: string | null
  logoHeight?: number | null
  navItems?: NavItemData[] | null
  utility?: {
    enabled?: boolean | null
    text?: string | null
    showPhone?: boolean | null
    showWhatsapp?: boolean | null
    showSocials?: boolean | null
    background?: string | null
    textColor?: string | null
  } | null
  sticky?: boolean | null
  showSearch?: boolean | null
  showAccount?: boolean | null
  showCart?: boolean | null
  popularSearches?: string[] | null
}

export type AnnouncementData = {
  enabled?: boolean | null
  rotateSeconds?: number | null
  dismissible?: boolean | null
  background?: string | null
  textColor?: string | null
  showFrom?: string | null
  showUntil?: string | null
  messages?: { text?: string | null; link?: LinkData | null }[] | null
}

export type FooterData = {
  about?: string | null
  columns?: { title?: string | null; links?: { link?: LinkData | null }[] | null }[] | null
  showNewsletter?: boolean | null
  newsletterHeading?: string | null
  newsletterText?: string | null
  newsletterPlaceholder?: string | null
  newsletterButton?: string | null
  newsletterDisclaimer?: string | null
  showContact?: boolean | null
  showSocials?: boolean | null
  copyright?: string | null
  legalText?: string | null
  bottomLinks?: { link?: LinkData | null }[] | null
  background?: string | null
  textColor?: string | null
}
