import type { Block } from 'payload'

import { headingFields, linkGroup, options, sectionSettings } from '../fields'

export const ProductCollection: Block = {
  slug: 'productCollection',
  interfaceName: 'ProductCollectionBlock',
  labels: { singular: 'Product collection', plural: 'Product collections' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'featured',
          options: options(
            ['manual', 'Pick products'],
            ['category', 'From a category'],
            ['tag', 'By tag'],
            ['featured', 'Featured products'],
            ['newest', 'Newest'],
            ['discount', 'Biggest discounts'],
          ),
          admin: { width: '25%' },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'grid',
          options: options(['grid', 'Grid'], ['carousel', 'Carousel']),
          admin: { width: '25%' },
        },
        { name: 'limit', type: 'number', defaultValue: 8, min: 1, max: 24, admin: { width: '25%' } },
        {
          name: 'columns',
          label: 'Columns (desktop)',
          type: 'number',
          defaultValue: 4,
          min: 2,
          max: 6,
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { condition: (_, siblingData) => siblingData?.source === 'manual' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { condition: (_, siblingData) => siblingData?.source === 'category' },
    },
    {
      name: 'tag',
      type: 'text',
      admin: {
        description: 'e.g. bestseller, festive',
        condition: (_, siblingData) => siblingData?.source === 'tag',
      },
    },
    linkGroup({ name: 'viewAll', label: '“View all” button (optional)' }),
    sectionSettings,
  ],
}
