import type { Block } from 'payload'

import { headingFields, options, sectionSettings } from '../fields'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'featured',
          options: options(['featured', 'Featured reviews'], ['manual', 'Pick reviews']),
          admin: { width: '34%' },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'cards',
          options: options(['cards', 'Cards'], ['carousel', 'Carousel'], ['quote', 'Single large quote']),
          admin: { width: '33%' },
        },
        { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12, admin: { width: '33%' } },
      ],
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
      admin: { condition: (_, siblingData) => siblingData?.source === 'manual' },
    },
    sectionSettings,
  ],
}
