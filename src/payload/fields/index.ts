import type { Field, FieldHook } from 'payload'

/* ------------------------------------------------------------------ */
/* Slug                                                               */
/* ------------------------------------------------------------------ */

export const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const slugHook =
  (fallback: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return formatSlug(value)
    const source = data?.[fallback] ?? originalDoc?.[fallback]
    return typeof source === 'string' ? formatSlug(source) : value
  }

export const slugField = (fallback = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the URL. Generated from the name when left empty.',
  },
  hooks: { beforeValidate: [slugHook(fallback)] },
})

/* ------------------------------------------------------------------ */
/* Colour (text field with a colour picker in the admin)              */
/* ------------------------------------------------------------------ */

export const colorField = (name: string, label: string, defaultValue?: string, description?: string): Field => ({
  name,
  label,
  type: 'text',
  defaultValue,
  admin: {
    description,
    components: { Field: '/payload/components/ColorField#ColorField' },
  },
})

/* ------------------------------------------------------------------ */
/* Link                                                               */
/* ------------------------------------------------------------------ */

type LinkOptions = { name?: string; label?: string; withLabel?: boolean }

export const linkGroup = ({ name = 'link', label, withLabel = true }: LinkOptions = {}): Field => ({
  name,
  label: label ?? false,
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'custom',
          options: [
            { label: 'Custom URL', value: 'custom' },
            { label: 'Page / product / category', value: 'reference' },
          ],
          admin: { layout: 'horizontal', width: '60%' },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          admin: { width: '40%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        ...(withLabel
          ? [{ name: 'label', type: 'text', localized: true, admin: { width: '50%' } } as Field]
          : []),
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            width: '50%',
            description: 'e.g. /shop, /collections/sandesh or https://…',
            condition: (_, siblingData) => siblingData?.type !== 'reference',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'products', 'categories'],
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.type === 'reference',
          },
        },
      ],
    },
  ],
})

/* ------------------------------------------------------------------ */
/* Section style — shared by every page-builder block                 */
/* ------------------------------------------------------------------ */

const spacingOptions = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra large', value: 'xl' },
]

export const styleGroup: Field = {
  name: 'style',
  label: 'Style',
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'Page background', value: 'none' },
            { label: 'Surface (white)', value: 'surface' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Primary', value: 'primary' },
            { label: 'Accent', value: 'accent' },
            { label: 'Custom colour', value: 'custom' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'customBg',
          label: 'Custom background',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Any CSS colour or gradient, e.g. #fdf0e0 or linear-gradient(…)',
            condition: (_, siblingData) => siblingData?.background === 'custom',
          },
        },
      ],
    },
    colorField('textColor', 'Text colour (optional)', undefined, 'Leave empty to follow the theme.'),
    { name: 'bgImage', label: 'Background image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'paddingTop', type: 'select', defaultValue: 'md', options: spacingOptions, admin: { width: '33%' } },
        { name: 'paddingBottom', type: 'select', defaultValue: 'md', options: spacingOptions, admin: { width: '33%' } },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'container',
          options: [
            { label: 'Container', value: 'container' },
            { label: 'Narrow', value: 'narrow' },
            { label: 'Full width', value: 'full' },
          ],
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'visibility',
          type: 'select',
          defaultValue: 'all',
          options: [
            { label: 'All devices', value: 'all' },
            { label: 'Desktop only', value: 'desktop' },
            { label: 'Mobile only', value: 'mobile' },
          ],
          admin: { width: '33%' },
        },
        { name: 'anchor', label: 'Anchor ID', type: 'text', admin: { width: '33%', description: 'Link to it with #anchor' } },
        { name: 'className', label: 'Custom CSS class', type: 'text', admin: { width: '33%' } },
      ],
    },
  ],
}

/** Collapsible "Section settings" appended to every block: on/off, schedule, style. */
export const sectionSettings: Field = {
  type: 'collapsible',
  label: 'Section settings — visibility, schedule & style',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'enabled', label: 'Show this section', type: 'checkbox', defaultValue: true, admin: { width: '34%' } },
        {
          name: 'showFrom',
          type: 'date',
          admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' }, description: 'Optional start date' },
        },
        {
          name: 'showUntil',
          type: 'date',
          admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' }, description: 'Optional end date' },
        },
      ],
    },
    styleGroup,
  ],
}

/* ------------------------------------------------------------------ */
/* SEO                                                                */
/* ------------------------------------------------------------------ */

export const seoGroup: Field = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  fields: [
    { name: 'title', type: 'text', localized: true, admin: { description: 'Defaults to the page / product name' } },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'image', label: 'Share image', type: 'upload', relationTo: 'media' },
  ],
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                      */
/* ------------------------------------------------------------------ */

export const headingFields = (defaults: { heading?: string } = {}): Field[] => [
  { name: 'heading', type: 'text', localized: true, defaultValue: defaults.heading },
  { name: 'subheading', type: 'textarea', localized: true },
]

export const options = (...values: Array<[string, string]>) => values.map(([value, label]) => ({ value, label }))
