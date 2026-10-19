import type { Block } from 'payload'

import { headingFields, linkGroup, options, sectionSettings } from '../fields'

export const CategoryGrid: Block = {
  slug: 'categoryGrid',
  interfaceName: 'CategoryGridBlock',
  labels: { singular: 'Category tiles', plural: 'Category tiles' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'custom',
          options: options(['categories', 'Pick categories'], ['custom', 'Custom tiles']),
          admin: { width: '34%' },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'cards',
          options: options(['cards', 'Cards'], ['circles', 'Circles'], ['scroll', 'Scrolling row']),
          admin: { width: '33%' },
        },
        {
          name: 'columns',
          label: 'Columns (desktop)',
          type: 'number',
          defaultValue: 6,
          min: 2,
          max: 9,
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { condition: (_, siblingData) => siblingData?.source === 'categories' },
    },
    {
      name: 'tiles',
      type: 'array',
      labels: { singular: 'Tile', plural: 'Tiles' },
      admin: { initCollapsed: true, condition: (_, siblingData) => siblingData?.source !== 'categories' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
            { name: 'label', type: 'text', required: true, localized: true, admin: { width: '50%' } },
          ],
        },
        linkGroup({ withLabel: false }),
      ],
    },
    sectionSettings,
  ],
}
