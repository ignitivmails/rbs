import type { CollectionConfig } from 'payload'

import { ORDER_STATUSES } from '../../lib/order-status'
import { ordersTeam, ownersOnly } from '../access'
import { options } from '../fields'
import { handleStatusChange, recordStatusHistory } from '../hooks/orders'

const half = { width: '50%' }
const third = { width: '33%' }

/**
 * Orders are created only by the checkout server action (Local API) — never via the public API.
 * Changing "Status" in the admin logs history, releases stock, issues refunds and notifies the customer.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Order', plural: 'Orders' },
  admin: {
    group: 'Orders',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'status', 'paymentMethod', 'total', 'deliveryDate', 'createdAt'],
    listSearchableFields: ['orderNumber', 'customerName', 'phone', 'email'],
    description: 'Change the status to move an order along. Customers are notified automatically (templates: Settings → Notifications).',
    components: { beforeListTable: ['/payload/components/OrderLinks#OrdersExport'] },
  },
  defaultSort: '-createdAt',
  access: { read: ordersTeam, create: ownersOnly, update: ordersTeam, delete: ownersOnly },
  hooks: { beforeChange: [recordStatusHistory], afterChange: [handleStatusChange] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'orderNumber', type: 'text', required: true, unique: true, admin: { ...half, readOnly: true } },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending_payment',
          options: ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label })),
          admin: half,
        },
      ],
    },
    {
      name: 'statusNote',
      label: 'Note for this status change',
      type: 'text',
      admin: { description: 'Optional — saved in the status history, e.g. “Handed to Delhivery”.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Customer & delivery',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'customerName', type: 'text', required: true, admin: third },
                { name: 'phone', type: 'text', required: true, admin: third },
                { name: 'email', type: 'email', admin: third },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'line1', label: 'Flat / house, building', type: 'text', admin: half },
                    { name: 'line2', label: 'Area, street', type: 'text', admin: half },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'landmark', type: 'text', admin: { width: '25%' } },
                    { name: 'city', type: 'text', admin: { width: '25%' } },
                    { name: 'state', type: 'text', admin: { width: '25%' } },
                    { name: 'pincode', type: 'text', admin: { width: '25%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'deliveryZone', type: 'relationship', relationTo: 'delivery-zones', admin: { width: '25%' } },
                { name: 'zoneName', type: 'text', admin: { width: '25%', readOnly: true } },
                { name: 'deliveryDate', label: 'Delivery date (YYYY-MM-DD)', type: 'text', admin: { width: '25%' } },
                { name: 'deliverySlot', type: 'text', admin: { width: '25%' } },
              ],
            },
            { name: 'deliveryLabel', label: 'Delivery (as shown to customer)', type: 'text', admin: { readOnly: true } },
            {
              type: 'row',
              fields: [
                { name: 'isGift', label: 'Gift order', type: 'checkbox', admin: third },
                { name: 'hidePrices', label: 'Hide prices on invoice', type: 'checkbox', admin: third },
              ],
            },
            { name: 'giftMessage', type: 'textarea' },
            { name: 'notes', label: 'Customer notes', type: 'textarea' },
          ],
        },
        {
          label: 'Items & totals',
          fields: [
            {
              name: 'items',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'product', type: 'relationship', relationTo: 'products', admin: { width: '30%' } },
                    { name: 'productName', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'variantLabel', type: 'text', admin: { width: '20%' } },
                    { name: 'sku', type: 'text', admin: { width: '20%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'variantId', type: 'text', admin: { width: '20%' } },
                    { name: 'unitPrice', type: 'number', required: true, admin: { width: '20%' } },
                    { name: 'mrp', type: 'number', admin: { width: '15%' } },
                    { name: 'qty', type: 'number', required: true, admin: { width: '15%' } },
                    { name: 'lineTotal', type: 'number', required: true, admin: { width: '15%' } },
                    { name: 'lineDiscount', label: 'Qty discount', type: 'number', admin: { width: '15%' } },
                  ],
                },
                {
                  name: 'kind',
                  type: 'select',
                  defaultValue: 'product',
                  options: options(['product', 'Product'], ['box', 'Build-a-box']),
                },
                { name: 'boxContents', label: 'Box contents', type: 'textarea', admin: { condition: (_, s) => s?.kind === 'box' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', required: true, admin: { width: '16%', readOnly: true } },
                { name: 'quantityDiscount', label: 'Qty discount', type: 'number', defaultValue: 0, admin: { width: '16%', readOnly: true } },
                { name: 'discount', label: 'Coupon discount', type: 'number', defaultValue: 0, admin: { width: '17%', readOnly: true } },
                { name: 'shipping', type: 'number', defaultValue: 0, admin: { width: '17%', readOnly: true } },
                { name: 'total', type: 'number', required: true, admin: { width: '17%', readOnly: true } },
                { name: 'mrpTotal', label: 'MRP total', type: 'number', admin: { width: '17%', readOnly: true } },
              ],
            },
            { name: 'couponCode', type: 'text', admin: { readOnly: true } },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'paymentMethod',
                  type: 'select',
                  required: true,
                  options: options(['razorpay', 'Online (Razorpay)'], ['cod', 'Cash on Delivery']),
                  admin: { ...half, readOnly: true },
                },
                {
                  name: 'paymentStatus',
                  type: 'select',
                  defaultValue: 'pending',
                  options: options(['pending', 'Pending'], ['paid', 'Paid'], ['failed', 'Failed'], ['refunded', 'Refunded']),
                  admin: half,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'razorpayOrderId', type: 'text', admin: { ...third, readOnly: true } },
                { name: 'razorpayPaymentId', type: 'text', admin: { ...third, readOnly: true } },
                { name: 'refundId', type: 'text', admin: { ...third, readOnly: true } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'paidAt', type: 'date', admin: { ...half, readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
                {
                  name: 'expiresAt',
                  label: 'Payment window ends',
                  type: 'date',
                  admin: { ...half, readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
                },
              ],
            },
          ],
        },
        {
          label: 'Shipment',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'carrier', type: 'text', admin: third },
                { name: 'awb', label: 'AWB / tracking no.', type: 'text', admin: third },
                { name: 'trackingUrl', type: 'text', admin: third },
              ],
            },
          ],
        },
        {
          label: 'History',
          fields: [
            {
              name: 'statusHistory',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'status', type: 'text', admin: { width: '20%' } },
                    { name: 'note', type: 'text', admin: { width: '40%' } },
                    { name: 'by', type: 'text', admin: { width: '20%' } },
                    { name: 'at', type: 'date', admin: { width: '20%', date: { pickerAppearance: 'dayAndTime' } } },
                  ],
                },
              ],
            },
            { name: 'internalNotes', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'links',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/OrderLinks#OrderLinks' } },
    },
    { name: 'total_sidebar_hint', type: 'ui', admin: { position: 'sidebar', components: { Field: '/payload/components/OrderLinks#OrderSummary' } } },
    { name: 'customer', type: 'relationship', relationTo: 'customers', index: true, admin: { position: 'sidebar', description: 'Empty for guest orders' } },
    { name: 'stockReserved', type: 'checkbox', admin: { position: 'sidebar', readOnly: true } },
    { name: 'stockReleased', type: 'checkbox', admin: { position: 'sidebar', readOnly: true } },
    { name: 'accessToken', type: 'text', admin: { hidden: true }, access: { read: ({ req: { user } }) => Boolean(user) } },
  ],
}
