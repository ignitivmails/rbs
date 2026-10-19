import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { revalidateAfterChange } from '../hooks/revalidate'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Content' },
  access: { read: anyone, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  hooks: { afterChange: [revalidateAfterChange] },
  upload: {
    // Local disk for development. Swap for an S3/R2 storage adapter in production.
    staticDir: path.resolve(dirname, '../../../media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 900 },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen readers and search engines' },
    },
  ],
}
