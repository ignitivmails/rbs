/**
 * Every reusable label/message on the storefront. The "UI text" global in the admin
 * is generated from this list, so adding a key here adds an editable field there.
 * Use {placeholders} for values filled in at runtime.
 */
export const DEFAULT_STRINGS = {
  // Product
  addToCart: 'Add to Cart',
  added: 'Added ✓',
  viewDetails: 'View details',
  fromPrice: 'From',
  off: '{percent}% off',
  taxNote: 'MRP inclusive of all taxes',
  outOfStock: 'Out of stock',
  selectVariant: 'Choose size',
  quantity: 'Quantity',
  reviews: 'Reviews',
  noReviews: 'No reviews yet.',
  relatedProducts: 'You may also like',
  vegLabel: 'Pure veg',
  // Cart
  cartTitle: 'Your cart',
  cartEmpty: 'Your cart is empty',
  continueShopping: 'Continue shopping',
  subtotal: 'Subtotal',
  youSave: 'You save',
  checkout: 'Checkout',
  viewCart: 'View cart',
  remove: 'Remove',
  // Delivery
  pincodeLabel: 'Check delivery',
  pincodePlaceholder: 'Enter 6-digit pincode',
  pincodeCheck: 'Check',
  pincodeInvalid: 'Please enter a valid 6-digit pincode.',
  pincodeUnserviceable: 'Sorry, we don’t deliver to {pincode} yet.',
  pincodeRestricted: 'This item is made fresh and delivered only in {zones}. Explore our pan-India range!',
  pincodeOk: 'Delivers to {pincode} by {date}.',
  pincodeCod: 'Cash on Delivery available.',
  // Checkout
  checkoutTitle: 'Checkout',
  contactDetails: 'Contact details',
  fullName: 'Full name',
  phoneLabel: 'Mobile number',
  emailLabel: 'Email (for order updates)',
  shippingAddress: 'Delivery address',
  addressLine1: 'Flat / house no., building',
  addressLine2: 'Area, street',
  landmark: 'Landmark (optional)',
  city: 'City',
  state: 'State',
  pincode: 'Pincode',
  deliverySchedule: 'Delivery date & time',
  deliveryDate: 'Delivery date',
  deliverySlot: 'Time slot',
  estimatedDelivery: 'Estimated delivery by {date}',
  enterPincodeFirst: 'Enter your pincode to see delivery options.',
  giftOption: 'This is a gift',
  giftMessage: 'Gift message',
  hidePrices: 'Hide prices on the invoice',
  orderNotes: 'Order notes (optional)',
  couponLabel: 'Coupon code',
  couponApply: 'Apply',
  couponRemove: 'Remove',
  paymentMethod: 'Payment',
  payOnline: 'Pay online — UPI, cards, netbanking, wallets',
  payCod: 'Cash on Delivery',
  codUnavailable: 'Cash on Delivery isn’t available for this order.',
  otpSend: 'Send OTP',
  otpResend: 'Resend OTP',
  otpSent: 'OTP sent to {phone}.',
  otpLabel: 'Enter the 6-digit OTP',
  otpRequired: 'Verify your mobile number to place a Cash on Delivery order.',
  placeOrder: 'Place order',
  payNow: 'Pay {amount}',
  placingOrder: 'Placing your order…',
  orderSummary: 'Order summary',
  shippingFee: 'Delivery',
  free: 'Free',
  discount: 'Discount',
  total: 'Total',
  freeShippingHint: 'Add {amount} more for free delivery.',
  minOrderNotMet: 'The minimum order value is {amount}.',
  itemsNeedAttention: 'Some items in your cart need attention.',
  // Order page
  orderConfirmedTitle: 'Thank you! Your order is confirmed.',
  orderPendingTitle: 'Complete your payment',
  orderPendingText: 'Your order is reserved until {time}. Complete the payment to confirm it.',
  orderClosedTitle: 'This order is {status}.',
  orderNumberLabel: 'Order {number}',
  retryPayment: 'Complete payment',
  paymentFailed: 'The payment didn’t go through. You can try again.',
  // Account
  loginTitle: 'Log in or sign up',
  loginSubtitle: 'Use your mobile number — we’ll send you a one-time code.',
  continueWithGoogle: 'Continue with Google',
  orDivider: 'or',
  yourNameOptional: 'Your name (for new accounts)',
  verifyAndContinue: 'Verify & continue',
  accountTitle: 'My account',
  accountGreeting: 'Hi, {name}!',
  myOrders: 'My orders',
  noOrders: 'You haven’t placed any orders yet.',
  viewOrder: 'View order',
  savedAddresses: 'Saved addresses',
  addAddress: 'Add a new address',
  editAddress: 'Edit',
  deleteAddress: 'Delete',
  makeDefault: 'Make default',
  defaultLabel: 'Default',
  addressLabel: 'Label (Home, Office…)',
  saveAddress: 'Save address',
  cancel: 'Cancel',
  profile: 'Profile',
  saveChanges: 'Save changes',
  saved: 'Saved ✓',
  logout: 'Log out',
  loginMethods: 'Login methods',
  linkGoogle: 'Link your Google account',
  googleLinked: 'Google account linked',
  addPhone: 'Add & verify your mobile number',
  phoneVerifiedLabel: 'Mobile number verified',
  loginForFasterCheckout: 'Have an account? Log in for faster checkout',
  savedAddressesPick: 'Deliver to a saved address',
  newAddress: 'New address',
  saveAddressToAccount: 'Save this address to my account',
  // Order tracking
  trackOrderNumber: 'Order number',
  trackPhone: 'Mobile number used for the order',
  trackNotFound: 'We couldn’t find an order with those details. Please check and try again.',
  // Quantity offers
  qtyOfferTitle: 'Buy more, save more',
  qtyOfferMix: 'Mix & match across selected sweets',
  qtyTierLine: 'Buy {qty} or more',
  qtyNextHint: 'Add {count} more to get {off}',
  qtyApplied: '{off} bulk discount applied',
  quantityDiscount: 'Quantity discount',
  bulkOfferBadge: 'Bulk offer',
  // Build a box
  boxTitle: 'Build your own box',
  boxIntro: 'Pick a box size, fill it with your favourite sweets and add a personal note.',
  boxStart: 'Start building',
  boxChooseSize: 'Choose a box size',
  boxPieces: '{count} pieces',
  boxFill: 'Fill your box',
  boxFilled: '{count} of {total} filled',
  boxFillToContinue: 'Fill all {total} slots to continue',
  boxClear: 'Clear',
  boxPackaging: 'Packaging',
  boxMessage: 'Message card (optional)',
  boxAdd: 'Add box to cart',
  boxMaxReached: 'Max {max} of this sweet per box',
  // Enquiries & stores
  enquiryOccasion: 'Occasion',
  enquiryCompany: 'Company (optional)',
  enquiryQuantity: 'Approx. number of boxes',
  enquiryBudget: 'Budget per box (₹)',
  enquiryDate: 'Event / delivery date',
  enquiryMessage: 'Tell us what you have in mind',
  enquirySubmit: 'Send enquiry',
  enquirySuccess: 'Thank you! Our gifting team will get back to you within 24 hours.',
  enquiryContactRequired: 'Please share a phone number or email so we can reach you.',
  storeHours: 'Opening hours',
  storeDirections: 'Get directions',
  storeCall: 'Call',
  // Blog
  blogTitle: 'Blog',
  blogIntro: 'Stories, recipes and festival notes from our kitchen.',
  libraryTitle: 'Sweets Library',
  libraryIntro: 'Get to know Bengali sweets — their story, ingredients and how to enjoy them.',
  readMore: 'Read more',
  readingTime: '{minutes} min read',
  relatedReading: 'Shop the story',
  noPosts: 'Nothing here yet — check back soon.',
  // Search & listing
  searchPlaceholder: 'Search rosogolla, sandesh, hampers…',
  popularSearches: 'Popular searches',
  searchResults: 'Results for “{query}”',
  noResults: 'No products found.',
  sortBy: 'Sort by',
  allProducts: 'All products',
  // Forms
  newsletterSuccess: 'Thank you! You’re on the list.',
  newsletterInvalid: 'Please enter a valid email address.',
  // Errors
  notFoundTitle: 'Page not found',
  notFoundText: 'This page has melted away like a rosogolla in warm syrup.',
  backHome: 'Back to home',
}

export type StringKey = keyof typeof DEFAULT_STRINGS
export type Strings = Record<StringKey, string>

export const STRING_GROUPS: Record<string, StringKey[]> = {
  Product: ['addToCart', 'added', 'viewDetails', 'fromPrice', 'off', 'taxNote', 'outOfStock', 'selectVariant', 'quantity', 'reviews', 'noReviews', 'relatedProducts', 'vegLabel'],
  Cart: ['cartTitle', 'cartEmpty', 'continueShopping', 'subtotal', 'youSave', 'checkout', 'viewCart', 'remove'],
  Delivery: ['pincodeLabel', 'pincodePlaceholder', 'pincodeCheck', 'pincodeInvalid', 'pincodeUnserviceable', 'pincodeRestricted', 'pincodeOk', 'pincodeCod'],
  Checkout: [
    'checkoutTitle', 'contactDetails', 'fullName', 'phoneLabel', 'emailLabel', 'shippingAddress', 'addressLine1', 'addressLine2', 'landmark',
    'city', 'state', 'pincode', 'deliverySchedule', 'deliveryDate', 'deliverySlot', 'estimatedDelivery', 'enterPincodeFirst', 'giftOption',
    'giftMessage', 'hidePrices', 'orderNotes', 'couponLabel', 'couponApply', 'couponRemove', 'paymentMethod', 'payOnline', 'payCod',
    'codUnavailable', 'otpSend', 'otpResend', 'otpSent', 'otpLabel', 'otpRequired', 'placeOrder', 'payNow', 'placingOrder', 'orderSummary',
    'shippingFee', 'free', 'discount', 'total', 'freeShippingHint', 'minOrderNotMet', 'itemsNeedAttention',
  ],
  Account: [
    'loginTitle', 'loginSubtitle', 'continueWithGoogle', 'orDivider', 'yourNameOptional', 'verifyAndContinue', 'accountTitle', 'accountGreeting',
    'myOrders', 'noOrders', 'viewOrder', 'savedAddresses', 'addAddress', 'editAddress', 'deleteAddress', 'makeDefault', 'defaultLabel',
    'addressLabel', 'saveAddress', 'cancel', 'profile', 'saveChanges', 'saved', 'logout', 'loginMethods', 'linkGoogle', 'googleLinked',
    'addPhone', 'phoneVerifiedLabel', 'loginForFasterCheckout', 'savedAddressesPick', 'newAddress', 'saveAddressToAccount',
    'trackOrderNumber', 'trackPhone', 'trackNotFound',
  ],
  'Quantity offers': ['qtyOfferTitle', 'qtyOfferMix', 'qtyTierLine', 'qtyNextHint', 'qtyApplied', 'quantityDiscount', 'bulkOfferBadge'],
  'Build a box': [
    'boxTitle', 'boxIntro', 'boxStart', 'boxChooseSize', 'boxPieces', 'boxFill', 'boxFilled', 'boxFillToContinue', 'boxClear',
    'boxPackaging', 'boxMessage', 'boxAdd', 'boxMaxReached',
  ],
  'Enquiries & stores': [
    'enquiryOccasion', 'enquiryCompany', 'enquiryQuantity', 'enquiryBudget', 'enquiryDate', 'enquiryMessage', 'enquirySubmit',
    'enquirySuccess', 'enquiryContactRequired', 'storeHours', 'storeDirections', 'storeCall',
  ],
  Blog: ['blogTitle', 'blogIntro', 'libraryTitle', 'libraryIntro', 'readMore', 'readingTime', 'relatedReading', 'noPosts'],
  'Order page': ['orderConfirmedTitle', 'orderPendingTitle', 'orderPendingText', 'orderClosedTitle', 'orderNumberLabel', 'retryPayment', 'paymentFailed'],
  'Search & listing': ['searchPlaceholder', 'popularSearches', 'searchResults', 'noResults', 'sortBy', 'allProducts'],
  'Forms & errors': ['newsletterSuccess', 'newsletterInvalid', 'notFoundTitle', 'notFoundText', 'backHome'],
}

/**
 * UI text is split across several admin globals: SQLite allows at most 127 arguments per
 * function and Payload reads all localized fields of a global in one call, so each global
 * must stay well below ~120 fields.
 */
export const STRING_GLOBALS: Array<{ slug: 'ui-strings' | 'ui-strings-account' | 'ui-strings-extra'; label: string; groups: string[] }> = [
  { slug: 'ui-strings', label: 'UI text', groups: ['Product', 'Cart', 'Delivery', 'Checkout', 'Order page', 'Search & listing', 'Forms & errors'] },
  { slug: 'ui-strings-account', label: 'UI text — Account', groups: ['Account'] },
  { slug: 'ui-strings-extra', label: 'UI text — Gifting & content', groups: ['Quantity offers', 'Build a box', 'Enquiries & stores', 'Blog'] },
]

export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match))
}

export function mergeStrings(raw: Record<string, unknown> | null | undefined): Strings {
  const out = { ...DEFAULT_STRINGS }
  if (raw) {
    for (const key of Object.keys(DEFAULT_STRINGS) as StringKey[]) {
      const v = raw[key]
      if (typeof v === 'string' && v.trim()) out[key] = v
    }
  }
  return out
}
