import type { GlobalConfig } from 'payload'

import { DEFAULT_THEME as D } from '../../lib/theme'
import { anyone, editorsOnly } from '../access'
import { colorField, options } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme',
  admin: {
    group: 'Design',
    description: 'Colours, fonts, shapes and product-card style for the whole site. Use Live Preview to see changes instantly.',
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
          label: 'Colours',
          fields: [
            {
              type: 'row',
              fields: [
                colorField('primary', 'Primary', D.primary, 'Buttons, links, highlights'),
                colorField('primaryForeground', 'Text on primary', D.primaryForeground),
                colorField('accent', 'Accent', D.accent, 'Badges, stars, details'),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('background', 'Page background', D.background),
                colorField('surface', 'Surface (cards, drawers)', D.surface),
                colorField('secondary', 'Secondary background', D.secondary, 'Alternate section background'),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('text', 'Text', D.text),
                colorField('muted', 'Muted text', D.muted),
                colorField('border', 'Borders', D.border),
              ],
            },
            {
              type: 'row',
              fields: [colorField('success', 'Success / discount', D.success), colorField('danger', 'Error', D.danger)],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              name: 'fontSource',
              type: 'select',
              defaultValue: D.fontSource,
              options: options(['google', 'Google Fonts'], ['system', 'System fonts only (fastest)']),
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headingFont',
                  type: 'text',
                  defaultValue: D.headingFont,
                  admin: { width: '50%', description: 'Any Google Font name, e.g. Fraunces, Playfair Display, Poppins' },
                },
                {
                  name: 'bodyFont',
                  type: 'text',
                  defaultValue: D.bodyFont,
                  admin: { width: '50%', description: 'e.g. Inter, Lato, DM Sans, Hind Siliguri (Bengali)' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'baseFontSize', label: 'Base font size (px)', type: 'number', defaultValue: D.baseFontSize, min: 12, max: 22, admin: { width: '33%' } },
                {
                  name: 'headingWeight',
                  type: 'select',
                  defaultValue: D.headingWeight,
                  options: options(['400', 'Regular'], ['500', 'Medium'], ['600', 'Semibold'], ['700', 'Bold']),
                  admin: { width: '33%' },
                },
                {
                  name: 'headingCase',
                  type: 'select',
                  defaultValue: D.headingCase,
                  options: options(['none', 'As typed'], ['uppercase', 'UPPERCASE'], ['capitalize', 'Capitalise Each Word']),
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Shape & layout',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'radius', label: 'Corner radius (px)', type: 'number', defaultValue: D.radius, min: 0, max: 40, admin: { width: '33%' } },
                {
                  name: 'buttonShape',
                  type: 'select',
                  defaultValue: D.buttonShape,
                  options: options(['rounded', 'Rounded (uses corner radius)'], ['pill', 'Pill'], ['square', 'Square']),
                  admin: { width: '33%' },
                },
                { name: 'containerWidth', label: 'Max content width (px)', type: 'number', defaultValue: D.containerWidth, min: 960, max: 1920, admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          label: 'Product cards',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'cardStyle',
                  type: 'select',
                  defaultValue: D.cardStyle,
                  options: options(['border', 'Thin border'], ['shadow', 'Soft shadow'], ['flat', 'Flat']),
                  admin: { width: '50%' },
                },
                {
                  name: 'imageRatio',
                  type: 'select',
                  defaultValue: D.imageRatio,
                  options: options(['square', 'Square'], ['portrait', 'Portrait 4:5'], ['landscape', 'Landscape 4:3']),
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'showRating', label: 'Show star rating', type: 'checkbox', defaultValue: D.showRating, admin: { width: '25%' } },
                { name: 'showDiscountBadge', label: 'Show % off badge', type: 'checkbox', defaultValue: D.showDiscountBadge, admin: { width: '25%' } },
                { name: 'showQuickAdd', label: 'Show “Add to Cart”', type: 'checkbox', defaultValue: D.showQuickAdd, admin: { width: '25%' } },
                { name: 'showViewDetails', label: 'Show “View details”', type: 'checkbox', defaultValue: D.showViewDetails, admin: { width: '25%' } },
              ],
            },
          ],
        },
        {
          label: 'Custom CSS',
          fields: [
            {
              name: 'customCss',
              label: 'Custom CSS (advanced)',
              type: 'code',
              admin: { language: 'css', description: 'Added after the theme styles. Target sections via their “Custom CSS class”.' },
            },
          ],
        },
      ],
    },
  ],
}
