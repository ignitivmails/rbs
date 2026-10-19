import type { CollectionConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { seoGroup, slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

/** Build-your-own box configurations (sizes, pickable sweets, packaging). */
export const GiftBoxes: CollectionConfig = {
  slug: 'gift-boxes',
  labels: { singular: 'Build-a-box', plural: 'Build-a-box' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'active', 'sortOrder'],
    description: 'Customers choose a size, fill it with sweets from the list and pick packaging at /build-your-box.',
    livePreview: { url: ({ data }) => previewUrl(`/build-your-box/${data?.slug ?? ''}`) },
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            { name: 'description', type: 'textarea', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'sizes',
              type: 'array',
              minRows: 1,
              required: true,
              labels: { singular: 'Size', plural: 'Sizes' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '34%', description: 'e.g. Box of 9' } },
                    { name: 'pieces', type: 'number', required: true, min: 1, max: 60, admin: { width: '22%' } },
                    { name: 'price', label: 'Price ₹', type: 'number', required: true, min: 0, admin: { width: '22%' } },
                    { name: 'mrp', label: 'MRP ₹', type: 'number', min: 0, admin: { width: '22%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Sweets to choose from',
          fields: [
            {
              name: 'items',
              type: 'array',
              minRows: 1,
              required: true,
              labels: { singular: 'Sweet', plural: 'Sweets' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, localized: true, admin: { width: '40%' } },
                    { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '30%' } },
                    { name: 'available', type: 'checkbox', defaultValue: true, admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'extraPrice', label: 'Extra ₹ per piece', type: 'number', defaultValue: 0, min: 0, admin: { width: '50%' } },
                    { name: 'maxPerBox', label: 'Max pieces per box', type: 'number', min: 1, admin: { width: '50%', description: 'Empty = no limit' } },
                  ],
                },
                { name: 'description', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Packaging & message',
          fields: [
            {
              name: 'packaging',
              type: 'array',
              labels: { singular: 'Packaging option', plural: 'Packaging options' },
              admin: { description: 'The first option is preselected.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '40%' } },
                    { name: 'price', label: 'Price ₹', type: 'number', defaultValue: 0, min: 0, admin: { width: '20%' } },
                    { name: 'description', type: 'text', localized: true, admin: { width: '40%' } },
                  ],
                },
              ],
            },
            { name: 'allowMessage', label: 'Offer a message card', type: 'checkbox', defaultValue: true },
          ],
        },
        { label: 'SEO', fields: [seoGroup] },
      ],
    },
    slugField('name'),
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      name: 'deliveryZones',
      type: 'relationship',
      relationTo: 'delivery-zones',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Leave empty to deliver everywhere. Fresh sweets → Pune.' },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
