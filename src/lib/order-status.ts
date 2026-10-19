/** Order lifecycle (see FLOW.md §5). Shared by the admin schema, hooks and storefront. */
export const ORDER_STATUSES = [
  { value: 'pending_payment', label: 'Pending payment', customer: 'Awaiting payment' },
  { value: 'paid', label: 'Paid', customer: 'Order confirmed' },
  { value: 'confirmed_cod', label: 'Confirmed (COD)', customer: 'Order confirmed' },
  { value: 'processing', label: 'Processing', customer: 'Being prepared' },
  { value: 'packed', label: 'Packed', customer: 'Packed' },
  { value: 'shipped', label: 'Shipped', customer: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for delivery', customer: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered', customer: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled', customer: 'Cancelled' },
  { value: 'refunded', label: 'Refunded', customer: 'Refunded' },
  { value: 'rto', label: 'Returned to origin', customer: 'Returned' },
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]['value']

/** Statuses that mean "the customer has a confirmed order". */
export const CONFIRMED_STATUSES: OrderStatus[] = ['paid', 'confirmed_cod']

/** Entering one of these returns reserved stock to inventory. */
export const RELEASE_STOCK_STATUSES: OrderStatus[] = ['cancelled', 'refunded', 'rto']

export const CLOSED_STATUSES: OrderStatus[] = ['cancelled', 'refunded', 'rto']

/** Customer-facing progress timeline. */
export const PROGRESS_STEPS: Array<{ key: string; label: string; statuses: OrderStatus[] }> = [
  { key: 'confirmed', label: 'Confirmed', statuses: ['paid', 'confirmed_cod'] },
  { key: 'processing', label: 'Preparing', statuses: ['processing'] },
  { key: 'packed', label: 'Packed', statuses: ['packed'] },
  { key: 'shipped', label: 'On the way', statuses: ['shipped', 'out_for_delivery'] },
  { key: 'delivered', label: 'Delivered', statuses: ['delivered'] },
]

export const statusInfo = (value?: string | null) => ORDER_STATUSES.find((s) => s.value === value) ?? ORDER_STATUSES[0]

export type NotificationEvent = 'orderConfirmed' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled' | 'refunded'

/** Which customer notification fires when an order enters a status. */
export const STATUS_EVENT: Partial<Record<OrderStatus, NotificationEvent>> = {
  paid: 'orderConfirmed',
  confirmed_cod: 'orderConfirmed',
  shipped: 'shipped',
  out_for_delivery: 'outForDelivery',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded',
}
