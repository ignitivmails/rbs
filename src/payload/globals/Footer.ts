import type { GlobalConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { colorField, linkGroup } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Design', livePreview: { url: previewUrl('/') } },
  versions: { drafts: { autosave: { interval: 800 } } },
  access: { read: anyone, update: editorsOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Columns',
          fields: [
            { name: 'about', label: 'About text', type: 'textarea', localized: true },
            {
              name: 'columns',
              type: 'array',
              labels: { singular: 'Column', plural: 'Columns' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                {
                  name: 'links',
                  type: 'array',
                  labels: { singular: 'Link', plural: 'Links' },
                  fields: [linkGroup()],
                },
              ],
            },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            { name: 'showNewsletter', type: 'checkbox', defaultValue: true },
            { name: 'newsletterHeading', type: 'text', localized: true, defaultValue: 'Stay in the loop' },
            {
              name: 'newsletterText',
              type: 'textarea',
              localized: true,
              defaultValue: 'Subscribe for festive launches, workshops and members-only offers.',
            },
            {
              type: 'row',
              fields: [
                { name: 'newsletterPlaceholder', type: 'text', localized: true, defaultValue: 'Your email address', admin: { width: '50%' } },
                { name: 'newsletterButton', type: 'text', localized: true, defaultValue: 'Subscribe', admin: { width: '50%' } },
              ],
            },
            { name: 'newsletterDisclaimer', type: 'text', localized: true, defaultValue: 'We don’t spam. It’s a promise.' },
          ],
        },
        {
          label: 'Contact & legal',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'showContact', label: 'Show contact details', type: 'checkbox', defaultValue: true, admin: { width: '50%', description: 'From Site settings → Contact' } },
                { name: 'showSocials', label: 'Show social icons', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
              ],
            },
            {
              name: 'copyright',
              type: 'text',
              localized: true,
              defaultValue: '© {year} Real Bengal Sweets. All rights reserved.',
              admin: { description: '{year} is replaced with the current year' },
            },
            { name: 'legalText', label: 'Legal line', type: 'text', localized: true, admin: { description: 'e.g. FSSAI License No. …' } },
            {
              name: 'bottomLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              fields: [linkGroup()],
            },
          ],
        },
        {
          label: 'Style',
          fields: [
            {
              type: 'row',
              fields: [
                colorField('background', 'Background', undefined, 'Empty = theme text colour'),
                colorField('textColor', 'Text colour', undefined, 'Empty = light cream'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
