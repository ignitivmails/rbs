import type { CollectionConfig } from 'payload'

import { editorsOnly, ordersTeam } from '../access'
import { options } from '../fields'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: { singular: 'Coupon', plural: 'Coupons' },
  admin: {
    group: 'Orders',
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'usageCount', 'usageLimit', 'active', 'endsAt'],
  },
  access: { read: ordersTeam, create: editorsOnly, update: ordersTeam, delete: editorsOnly },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
          unique: true,
          admin: { width: '50%', description: 'Customers type this at checkout (not case-sensitive)' },
          hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : value)] },
        },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    { name: 'description', type: 'text', localized: true, admin: { description: 'Shown to the customer when applied, e.g. “10% off your first order”' } },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'percent',
          options: options(['percent', '% off'], ['flat', 'Flat ₹ off'], ['freeShipping', 'Free delivery']),
          admin: { width: '34%' },
        },
        {
          name: 'value',
          type: 'number',
          min: 0,
          admin: { width: '33%', description: '% or ₹', condition: (_, s) => s?.type !== 'freeShipping' },
        },
        {
          name: 'maxDiscount',
          label: 'Max discount ₹',
          type: 'number',
          min: 0,
          admin: { width: '33%', condition: (_, s) => s?.type === 'percent' },
        },
      ],
    },
    { name: 'minSubtotal', label: 'Minimum cart value ₹', type: 'number', min: 0 },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'usageLimit', label: 'Total uses allowed', type: 'number', min: 0, admin: { width: '50%', description: 'Empty = unlimited' } },
        { name: 'usageCount', label: 'Times used', type: 'number', defaultValue: 0, admin: { width: '50%', readOnly: true } },
      ],
    },
  ],
}
