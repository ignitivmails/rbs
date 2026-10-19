import type { Block } from 'payload'

import { linkGroup, options, sectionSettings } from '../fields'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero banner', plural: 'Hero banners' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'carousel',
          options: options(['carousel', 'Carousel (all slides)'], ['fullBleed', 'Full-bleed (first slide)'], ['split', 'Split — image beside text']),
          admin: { width: '34%' },
        },
        {
          name: 'height',
          type: 'select',
          defaultValue: 'lg',
          options: options(['sm', 'Short'], ['md', 'Medium'], ['lg', 'Tall'], ['screen', 'Full screen']),
          admin: { width: '33%' },
        },
        {
          name: 'autoplaySeconds',
          label: 'Autoplay (seconds)',
          type: 'number',
          defaultValue: 6,
          min: 0,
          admin: { width: '33%', description: '0 turns autoplay off' },
        },
      ],
    },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
            {
              name: 'mobileImage',
              type: 'upload',
              relationTo: 'media',
              admin: { width: '50%', description: 'Optional portrait image for phones' },
            },
          ],
        },
        { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Small text above the heading' } },
        { name: 'heading', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        {
          type: 'row',
          fields: [
            {
              name: 'align',
              type: 'select',
              defaultValue: 'left',
              options: options(['left', 'Left'], ['center', 'Centre'], ['right', 'Right']),
              admin: { width: '33%' },
            },
            {
              name: 'tone',
              type: 'select',
              defaultValue: 'light',
              options: options(['light', 'Light text (dark image)'], ['dark', 'Dark text (light image)']),
              admin: { width: '33%' },
            },
            {
              name: 'overlay',
              label: 'Overlay strength %',
              type: 'number',
              defaultValue: 35,
              min: 0,
              max: 90,
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'ctas',
          label: 'Buttons',
          type: 'array',
          maxRows: 2,
          labels: { singular: 'Button', plural: 'Buttons' },
          fields: [
            linkGroup(),
            {
              name: 'appearance',
              type: 'select',
              defaultValue: 'primary',
              options: options(['primary', 'Primary'], ['secondary', 'Accent'], ['light', 'White'], ['outline', 'Outline']),
            },
          ],
        },
      ],
    },
    sectionSettings,
  ],
}
