import type { GlobalConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { colorField, linkGroup, options } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & menu',
  admin: {
    group: 'Design',
    description: 'Logo, top strip, main menu (simple links, dropdowns or mega menus) and search.',
    livePreview: { url: previewUrl('/') },
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  access: { read: anyone, update: editorsOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Logo',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Leave empty to show the logo text' } },
            {
              type: 'row',
              fields: [
                { name: 'logoText', type: 'text', localized: true, defaultValue: 'Real Bengal Sweets', admin: { width: '50%' } },
                { name: 'logoHeight', label: 'Logo height (px)', type: 'number', defaultValue: 44, min: 20, max: 120, admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Main menu',
          fields: [
            {
              name: 'navItems',
              label: 'Menu items',
              type: 'array',
              labels: { singular: 'Menu item', plural: 'Menu items' },
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '50%' } },
                    {
                      name: 'layout',
                      type: 'select',
                      defaultValue: 'link',
                      options: options(['link', 'Simple link'], ['dropdown', 'Dropdown list'], ['mega', 'Mega menu']),
                      admin: { width: '50%' },
                    },
                  ],
                },
                linkGroup({ withLabel: false }),
                {
                  name: 'columns',
                  type: 'array',
                  labels: { singular: 'Column', plural: 'Columns' },
                  admin: {
                    initCollapsed: true,
                    description: 'Dropdowns show the links of every column; mega menus show columns side by side.',
                    condition: (_, siblingData) => siblingData?.layout !== 'link',
                  },
                  fields: [
                    { name: 'heading', type: 'text', localized: true },
                    linkGroup({ name: 'headingLink', label: 'Heading link (optional)', withLabel: false }),
                    {
                      name: 'items',
                      label: 'Links',
                      type: 'array',
                      labels: { singular: 'Link', plural: 'Links' },
                      fields: [linkGroup()],
                    },
                    {
                      name: 'products',
                      label: 'Product thumbnails',
                      type: 'relationship',
                      relationTo: 'products',
                      hasMany: true,
                      admin: { description: 'Mega menu only' },
                    },
                  ],
                },
                {
                  name: 'promo',
                  label: 'Promo tile',
                  type: 'group',
                  admin: { condition: (_, siblingData) => siblingData?.layout === 'mega' },
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'title', type: 'text', localized: true },
                    linkGroup({ withLabel: false }),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Top strip',
          fields: [
            {
              name: 'utility',
              label: false,
              type: 'group',
              fields: [
                { name: 'enabled', label: 'Show top strip', type: 'checkbox', defaultValue: true },
                { name: 'text', type: 'text', localized: true, admin: { description: 'Short message in the middle' } },
                {
                  type: 'row',
                  fields: [
                    { name: 'showPhone', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
                    { name: 'showWhatsapp', label: 'Show WhatsApp', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
                    { name: 'showSocials', label: 'Show social icons', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    colorField('background', 'Background', undefined, 'Empty = theme text colour'),
                    colorField('textColor', 'Text colour', undefined, 'Empty = white'),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Behaviour & search',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'sticky', label: 'Sticky header', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
                { name: 'showSearch', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
                { name: 'showAccount', label: 'Show account icon', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
                { name: 'showCart', label: 'Show cart icon', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
              ],
            },
            {
              name: 'popularSearches',
              type: 'text',
              hasMany: true,
              localized: true,
              admin: { description: 'Shown as suggestions in the search box' },
            },
          ],
        },
      ],
    },
  ],
}
