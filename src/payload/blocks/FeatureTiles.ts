import type { Block } from 'payload'

import { headingFields, linkGroup, options, sectionSettings } from '../fields'

export const FeatureTiles: Block = {
  slug: 'featureTiles',
  interfaceName: 'FeatureTilesBlock',
  labels: { singular: 'Feature tiles', plural: 'Feature tiles' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'cards',
          options: options(['cards', 'Image on top'], ['overlay', 'Text over image']),
          admin: { width: '50%' },
        },
        { name: 'columns', label: 'Columns (desktop)', type: 'number', defaultValue: 4, min: 1, max: 4, admin: { width: '50%' } },
      ],
    },
    {
      name: 'tiles',
      type: 'array',
      labels: { singular: 'Tile', plural: 'Tiles' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', localized: true },
        linkGroup(),
      ],
    },
    sectionSettings,
  ],
}
