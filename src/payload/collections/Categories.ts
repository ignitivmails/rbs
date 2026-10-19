import type { CollectionConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { categoryBlocks } from '../blocks'
import { seoGroup, slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'sortOrder'],
    livePreview: { url: ({ data }) => previewUrl(`/collections/${data?.slug ?? ''}`) },
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
            {
              type: 'row',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Square image for category tiles' } },
                { name: 'image', label: 'Banner image', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Sections below products',
          fields: [{ name: 'layout', label: 'Sections', type: 'blocks', blocks: categoryBlocks }],
        },
        { label: 'SEO', fields: [seoGroup] },
      ],
    },
    slugField('name'),
    { name: 'parent', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Lower numbers first' } },
  ],
}
