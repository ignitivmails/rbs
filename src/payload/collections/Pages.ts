import type { CollectionConfig } from 'payload'

import { editorsOnly, publishedOrLoggedIn } from '../access'
import { pageBlocks } from '../blocks'
import { seoGroup, slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { pagePath, previewUrl } from '../utilities'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Build any page from sections. The page with slug “home” is the homepage.',
    livePreview: { url: ({ data }) => previewUrl(pagePath(data?.slug as string | undefined)) },
    preview: (doc) => previewUrl(pagePath(doc?.slug as string | undefined)),
  },
  versions: { drafts: { autosave: { interval: 500 } }, maxPerDoc: 30 },
  access: {
    read: publishedOrLoggedIn,
    create: editorsOnly,
    update: editorsOnly,
    delete: editorsOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              label: 'Page sections',
              type: 'blocks',
              blocks: pageBlocks,
              admin: { initCollapsed: true },
            },
          ],
        },
        { label: 'SEO', fields: [seoGroup] },
      ],
    },
    slugField('title'),
  ],
}
