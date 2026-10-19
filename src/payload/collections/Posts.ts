import type { CollectionConfig } from 'payload'

import { editorsOnly, publishedOrLoggedIn } from '../access'
import { options, seoGroup, slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

export const POST_SECTIONS = { blog: '/blog', library: '/sweets-library' } as const

const postPath = (data?: { section?: string | null; slug?: string | null } | null) =>
  `${POST_SECTIONS[(data?.section as keyof typeof POST_SECTIONS) ?? 'blog'] ?? '/blog'}/${data?.slug ?? ''}`

/** Blog posts and Sweets Library entries (one collection, two sections). */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Blog & Sweets Library' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'publishedAt', '_status'],
    livePreview: { url: ({ data }) => previewUrl(postPath(data as never)) },
    preview: (doc) => previewUrl(postPath(doc as never)),
  },
  defaultSort: '-publishedAt',
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'excerpt', type: 'textarea', localized: true, admin: { description: 'Short summary for listings and search results' } },
            { name: 'cover', type: 'upload', relationTo: 'media' },
            { name: 'content', type: 'richText', localized: true },
          ],
        },
        {
          label: 'Related products',
          fields: [{ name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true }],
        },
        { label: 'SEO', fields: [seoGroup] },
      ],
    },
    slugField('title'),
    {
      name: 'section',
      type: 'select',
      required: true,
      defaultValue: 'blog',
      options: options(['blog', 'Blog'], ['library', 'Sweets Library']),
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'author', type: 'text', admin: { position: 'sidebar' } },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar' } },
  ],
}
