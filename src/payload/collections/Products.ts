import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { editorsOnly, publishedOrLoggedIn } from '../access'
import { options, seoGroup, slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

type VariantInput = { price?: number | null; mrp?: number | null; stock?: number | null }

/** Keeps sortable/filterable summary fields in sync with variants and delivery zones. */
const computeSummary: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (Array.isArray(data.variants)) {
    const variants = data.variants as VariantInput[]
    const prices = variants.map((v) => Number(v.price)).filter((n) => Number.isFinite(n) && n > 0)
    if (prices.length) data.priceFrom = Math.min(...prices)
    data.maxDiscount = Math.max(
      0,
      ...variants.map((v) => (v.mrp && v.price && v.mrp > v.price ? Math.round((1 - v.price / v.mrp) * 100) : 0)),
    )
    data.inStock = variants.some((v) => (v.stock ?? 0) > 0)
  }

  if (data.deliveryZones !== undefined) {
    const ids = ((data.deliveryZones as unknown[]) ?? []).map((z) =>
      typeof z === 'object' && z !== null ? (z as { id: number | string }).id : z,
    ) as Array<number | string>
    if (!ids.length) {
      data.shipsPanIndia = true
    } else {
      const { docs } = await req.payload.find({
        collection: 'delivery-zones',
        where: { id: { in: ids } },
        depth: 0,
        limit: 100,
        req,
      })
      data.shipsPanIndia = docs.some((z) => (z as { kind?: string }).kind === 'panIndia')
    }
  }
  return data
}

const readOnlySidebar = { position: 'sidebar' as const, readOnly: true }

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'priceFrom', 'categories', 'featured', '_status'],
    livePreview: { url: ({ data }) => previewUrl(`/products/${data?.slug ?? ''}`) },
    preview: (doc) => previewUrl(`/products/${doc?.slug ?? ''}`),
  },
  defaultSort: 'sortOrder',
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  hooks: {
    beforeChange: [computeSummary],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            { name: 'shortDescription', type: 'textarea', localized: true, admin: { description: 'One or two lines shown near the price' } },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'The first image is the main image' },
            },
            { name: 'description', type: 'richText', localized: true },
          ],
        },
        {
          label: 'Sizes & pricing',
          fields: [
            {
              name: 'variants',
              label: 'Sizes / variants',
              type: 'array',
              minRows: 1,
              required: true,
              labels: { singular: 'Variant', plural: 'Variants' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '40%', description: 'e.g. 500 g · 8 pcs' } },
                    { name: 'sku', label: 'SKU', type: 'text', admin: { width: '30%' } },
                    { name: 'weight', label: 'Weight (g)', type: 'number', admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', label: 'Price ₹', type: 'number', required: true, min: 0, admin: { width: '33%', description: 'Selling price incl. GST' } },
                    { name: 'mrp', label: 'MRP ₹', type: 'number', min: 0, admin: { width: '33%', description: 'Shown struck through' } },
                    { name: 'stock', type: 'number', defaultValue: 100, min: 0, admin: { width: '33%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Ingredients & shelf life',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'isVeg', label: 'Vegetarian', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
                { name: 'eggless', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'shelfLife', type: 'text', localized: true, admin: { width: '50%', description: 'e.g. 3 days, refrigerated' } },
                { name: 'storage', type: 'text', localized: true, admin: { width: '50%' } },
              ],
            },
            { name: 'ingredients', type: 'textarea', localized: true },
            { name: 'allergens', type: 'text', localized: true },
          ],
        },
        {
          label: 'Related',
          fields: [{ name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true }],
        },
        { label: 'SEO', fields: [seoGroup] },
      ],
    },

    // Sidebar
    slugField('name'),
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true, admin: { position: 'sidebar' } },
    {
      name: 'deliveryZones',
      type: 'relationship',
      relationTo: 'delivery-zones',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Leave empty to sell everywhere. Pick “Pune” for fresh, perishable items.' },
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: options(
        ['bestseller', 'Bestseller'],
        ['new', 'New'],
        ['limited', 'Limited edition'],
        ['festive', 'Festive'],
        ['sugar-free', 'No added sugar'],
        ['pune-exclusive', 'Pune only'],
      ),
      admin: { position: 'sidebar' },
    },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar', description: 'Free tags, e.g. bestseller, festive' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Lower numbers first' } },

    // Computed — kept in sync by hooks
    { name: 'priceFrom', label: 'Price from', type: 'number', admin: readOnlySidebar },
    { name: 'maxDiscount', label: 'Max discount %', type: 'number', admin: readOnlySidebar },
    { name: 'inStock', type: 'checkbox', defaultValue: true, admin: readOnlySidebar },
    { name: 'shipsPanIndia', label: 'Ships pan-India', type: 'checkbox', defaultValue: true, admin: readOnlySidebar },
    { name: 'rating', type: 'number', defaultValue: 0, admin: readOnlySidebar },
    { name: 'reviewCount', type: 'number', defaultValue: 0, admin: readOnlySidebar },
  ],
}
