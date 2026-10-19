import type { Block } from 'payload'

import { options, sectionSettings } from '../fields'

export const LogoMarquee: Block = {
  slug: 'logoMarquee',
  interfaceName: 'LogoMarqueeBlock',
  labels: { singular: 'Logo strip (“Featured in”)', plural: 'Logo strips' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'marquee',
          options: options(['marquee', 'Scrolling marquee'], ['static', 'Static row']),
          admin: { width: '34%' },
        },
        {
          name: 'speed',
          type: 'select',
          defaultValue: 'normal',
          options: options(['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']),
          admin: { width: '33%' },
        },
        { name: 'grayscale', label: 'Greyscale logos', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
      ],
    },
    {
      name: 'logos',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logos' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '34%', description: 'Shown as text when no image' } },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '33%' } },
            { name: 'url', type: 'text', admin: { width: '33%' } },
          ],
        },
      ],
    },
    sectionSettings,
  ],
}
