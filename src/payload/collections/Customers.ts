import type { CollectionConfig } from 'payload'

import { ordersTeam, ownersOnly } from '../access'
import { options } from '../fields'

/**
 * Shopper accounts (phone OTP and/or Google). Sessions are handled by the storefront
 * (signed cookie, src/lib/session.ts) — these records never log into the admin.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: 'Customer', plural: 'Customers' },
  admin: {
    group: 'Orders',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'authProviders', 'lastLoginAt'],
    listSearchableFields: ['name', 'phone', 'email'],
  },
  access: { read: ordersTeam, create: ownersOnly, update: ordersTeam, delete: ownersOnly },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', admin: { width: '34%' } },
        { name: 'phone', type: 'text', unique: true, admin: { width: '33%', description: '10-digit mobile' } },
        { name: 'email', type: 'email', unique: true, admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phoneVerified', type: 'checkbox', admin: { width: '34%', readOnly: true } },
        {
          name: 'authProviders',
          label: 'Signs in with',
          type: 'select',
          hasMany: true,
          options: options(['phone', 'Phone OTP'], ['google', 'Google']),
          admin: { width: '33%', readOnly: true },
        },
        { name: 'lastLoginAt', type: 'date', admin: { width: '33%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Orders',
          fields: [{ name: 'orders', type: 'join', collection: 'orders', on: 'customer', admin: { defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'] } }],
        },
        {
          label: 'Addresses',
          fields: [
            {
              name: 'addresses',
              type: 'array',
              labels: { singular: 'Address', plural: 'Addresses' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', admin: { width: '25%', description: 'Home, Office…' } },
                    { name: 'name', type: 'text', admin: { width: '25%' } },
                    { name: 'phone', type: 'text', admin: { width: '25%' } },
                    { name: 'isDefault', label: 'Default', type: 'checkbox', admin: { width: '25%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'line1', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'line2', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'landmark', type: 'text', admin: { width: '25%' } },
                    { name: 'city', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'state', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'pincode', type: 'text', required: true, admin: { width: '25%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            { name: 'googleId', type: 'text', unique: true, admin: { readOnly: true } },
            { name: 'cart', label: 'Saved cart', type: 'json', admin: { readOnly: true } },
          ],
        },
      ],
    },
  ],
}
