import type { Block } from 'payload'

import { headingFields, options, sectionSettings } from '../fields'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats / numbers', plural: 'Stats' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'row',
          options: options(['row', 'Simple row'], ['cards', 'Cards']),
          admin: { width: '50%' },
        },
        { name: 'animate', label: 'Count-up animation', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Number', plural: 'Numbers' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'prefix', type: 'text', admin: { width: '20%' } },
            { name: 'value', type: 'number', required: true, admin: { width: '40%' } },
            { name: 'suffix', type: 'text', admin: { width: '20%', description: 'e.g. + or %' } },
          ],
        },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
    sectionSettings,
  ],
}
