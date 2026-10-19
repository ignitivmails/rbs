import type { CollectionConfig } from 'payload'

import { anyone, ownersOnly } from '../access'
import { options } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

const PINCODE_TOKEN = /^\d{6}(-\d{6})?$/

export const DeliveryZones: CollectionConfig = {
  slug: 'delivery-zones',
  labels: { singular: 'Delivery zone', plural: 'Delivery zones' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'isDefault', 'leadTimeDays', 'active'],
    description: 'Where you deliver, how fast, and at what cost. Products can be restricted to specific zones.',
  },
  access: { read: anyone, create: ownersOnly, update: ownersOnly, delete: ownersOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'local',
          options: options(['local', 'Local (own riders, fresh items)'], ['panIndia', 'Pan-India (courier)']),
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'pincodes',
      type: 'textarea',
      admin: {
        description: 'Comma or newline separated. Ranges allowed, e.g. 411001-411062, 412105. Leave empty for the default zone.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const bad = value
          .split(/[\s,;]+/)
          .filter(Boolean)
          .filter((t) => !PINCODE_TOKEN.test(t))
        return bad.length ? `Not a valid pincode or range: ${bad.slice(0, 3).join(', ')}` : true
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isDefault',
          label: 'Default zone',
          type: 'checkbox',
          admin: { width: '50%', description: 'Used for any valid Indian pincode not listed in another zone' },
        },
        { name: 'active', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Delivery timing',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'leadTimeDays', label: 'Lead time (days)', type: 'number', defaultValue: 1, min: 0, admin: { width: '50%', description: '0 = same day' } },
            {
              name: 'sameDayCutoff',
              label: 'Same-day cut-off (IST, 24h)',
              type: 'text',
              admin: { width: '50%', description: 'e.g. 14:00 — later orders move to the next day' },
            },
          ],
        },
        {
          name: 'slots',
          label: 'Delivery slots',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'blackoutDates',
          label: 'No-delivery dates',
          type: 'array',
          fields: [{ name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Shipping & payment',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'shippingFee', label: 'Shipping fee ₹', type: 'number', defaultValue: 0, min: 0, admin: { width: '50%' } },
            { name: 'freeShippingAbove', label: 'Free shipping above ₹', type: 'number', min: 0, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'codAllowed', label: 'Cash on Delivery allowed', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
            { name: 'codLimit', label: 'Max COD order ₹', type: 'number', min: 0, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
