import type { CollectionConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { options } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/** "Buy more, save more" rules for selected products or categories. */
export const QuantityDiscounts: CollectionConfig = {
  slug: 'quantity-discounts',
  labels: { singular: 'Quantity discount', plural: 'Quantity discounts' },
  admin: {
    group: 'Orders',
    useAsTitle: 'name',
    defaultColumns: ['name', 'applyTo', 'active', 'endsAt'],
    description: 'Tiered discounts by quantity, e.g. buy 3+ get 5% off, 6+ get 10% off. Applied automatically in the cart and at checkout.',
  },
  access: { read: anyone, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '60%', description: 'Internal name, e.g. “Mithai bulk saver”' } },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { width: '40%' } },
      ],
    },
    {
      name: 'description',
      label: 'Shown to customers',
      type: 'text',
      localized: true,
      admin: { description: 'Optional headline on product pages, e.g. “Stock up for Diwali — the more you buy, the more you save”' },
    },
    {
      name: 'applyTo',
      label: 'How quantities are counted',
      type: 'select',
      defaultValue: 'eachProduct',
      options: options(
        ['eachProduct', 'Per product — each product needs the quantity on its own'],
        ['combined', 'Mix & match — all qualifying products count together'],
      ),
    },
    {
      type: 'row',
      fields: [
        { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, admin: { width: '50%' } },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          admin: { width: '50%', description: 'Every product in these categories qualifies too' },
        },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Tier', plural: 'Tiers' },
      admin: { description: 'The highest tier reached applies.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'minQty', label: 'From quantity', type: 'number', required: true, min: 2, admin: { width: '33%' } },
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'percent',
              options: options(['percent', '% off'], ['flatPerUnit', '₹ off each item']),
              admin: { width: '33%' },
            },
            { name: 'value', type: 'number', required: true, min: 1, admin: { width: '33%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
  ],
}
