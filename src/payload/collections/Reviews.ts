import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from 'payload'

import { editorsOnly } from '../access'
import { revalidateCMS } from '../hooks/revalidate'

async function syncProductRating(productRef: unknown, req: PayloadRequest) {
  const productId =
    typeof productRef === 'object' && productRef !== null ? (productRef as { id: number | string }).id : productRef
  if (productId === null || productId === undefined || productId === '') return

  const { docs } = await req.payload.find({
    collection: 'reviews',
    where: { and: [{ product: { equals: productId } }, { approved: { equals: true } }] },
    depth: 0,
    limit: 1000,
    req,
  })
  const ratings = docs.map((r) => Number((r as { rating?: number }).rating) || 0)
  const count = ratings.length
  const avg = count ? Math.round((ratings.reduce((a, b) => a + b, 0) / count) * 10) / 10 : 0

  await req.payload.update({
    collection: 'products',
    id: productId as number | string,
    data: { rating: avg, reviewCount: count },
    depth: 0,
    req,
    context: { ...req.context },
  })
}

const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req, context }) => {
  await syncProductRating(doc.product, req)
  const prev = previousDoc?.product
  if (prev && JSON.stringify(prev) !== JSON.stringify(doc.product)) await syncProductRating(prev, req)
  revalidateCMS(context)
  return doc
}

const afterDelete: CollectionAfterDeleteHook = async ({ doc, req, context }) => {
  await syncProductRating(doc.product, req)
  revalidateCMS(context)
  return doc
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Review', plural: 'Reviews' },
  admin: {
    group: 'Shop',
    useAsTitle: 'author',
    defaultColumns: ['author', 'product', 'rating', 'approved', 'featured'],
  },
  access: {
    // Only approved reviews are public.
    read: ({ req: { user } }) => (user ? true : { approved: { equals: true } }),
    create: editorsOnly,
    update: editorsOnly,
    delete: editorsOnly,
  },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'designation', type: 'text', admin: { width: '50%', description: 'e.g. HR Director, Pune' } },
      ],
    },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
    { name: 'text', label: 'Review', type: 'textarea', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional photo; the product image is used otherwise' } },
    { name: 'approved', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show in homepage testimonials' } },
  ],
}
