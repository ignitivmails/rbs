import type { CollectionConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { options } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Stores: CollectionConfig = {
  slug: 'stores',
  labels: { singular: 'Store', plural: 'Stores' },
  admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'city', 'phone', 'active'] },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, localized: true, admin: { width: '50%' } },
        { name: 'city', type: 'text', defaultValue: 'Pune', admin: { width: '25%' } },
        { name: 'pincode', type: 'text', admin: { width: '25%' } },
      ],
    },
    { name: 'address', type: 'textarea', required: true, localized: true },
    {
      name: 'mapQuery',
      label: 'Map location',
      type: 'text',
      admin: { description: 'Address or “latitude,longitude” used for the map and directions. Defaults to the address.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '50%' } },
        { name: 'whatsapp', label: 'WhatsApp (with country code)', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'hours',
      label: 'Opening hours',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'days', type: 'text', required: true, localized: true, admin: { width: '50%', description: 'e.g. Mon–Sat' } },
            { name: 'time', type: 'text', required: true, admin: { width: '50%', description: 'e.g. 9 AM – 10 PM' } },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'select',
      hasMany: true,
      options: options(['fresh', 'Fresh sweets counter'], ['cafe', 'Café & chaat'], ['pickup', 'Order pickup'], ['parking', 'Parking'], ['seating', 'Seating']),
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
