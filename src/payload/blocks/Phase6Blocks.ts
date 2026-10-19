import type { Block } from 'payload'

import { headingFields, linkGroup, options, sectionSettings } from '../fields'

export const EnquiryForm: Block = {
  slug: 'enquiryForm',
  interfaceName: 'EnquiryFormBlock',
  labels: { singular: 'Enquiry form', plural: 'Enquiry forms' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Tell us about your gifting plans' },
    { name: 'text', type: 'textarea', localized: true },
    {
      name: 'enquiryType',
      label: 'Occasion',
      type: 'select',
      defaultValue: 'any',
      options: options(
        ['any', 'Let the customer choose'],
        ['corporate', 'Corporate gifting'],
        ['wedding', 'Wedding'],
        ['celebration', 'Celebration'],
        ['baby', 'Baby announcement'],
        ['custom', 'Custom box'],
      ),
    },
    {
      type: 'row',
      fields: [
        { name: 'showCompany', label: 'Ask company', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'showQuantity', label: 'Ask quantity', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'showBudget', label: 'Ask budget', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
        { name: 'showDate', label: 'Ask date', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
      ],
    },
    { name: 'successMessage', type: 'text', localized: true, admin: { description: 'Shown after submitting. Empty = default text from UI text.' } },
    sectionSettings,
  ],
}

export const StoreLocator: Block = {
  slug: 'storeLocator',
  interfaceName: 'StoreLocatorBlock',
  labels: { singular: 'Store locator', plural: 'Store locators' },
  fields: [
    ...headingFields({ heading: 'Visit us' }),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'all',
          options: options(['all', 'All active stores'], ['manual', 'Pick stores']),
          admin: { width: '50%' },
        },
        { name: 'showMap', label: 'Show map', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'stores',
      type: 'relationship',
      relationTo: 'stores',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    sectionSettings,
  ],
}

export const LatestPosts: Block = {
  slug: 'latestPosts',
  interfaceName: 'LatestPostsBlock',
  labels: { singular: 'Latest posts', plural: 'Latest posts' },
  fields: [
    ...headingFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'section',
          type: 'select',
          defaultValue: 'blog',
          options: options(['blog', 'Blog'], ['library', 'Sweets Library'], ['all', 'Both']),
          admin: { width: '50%' },
        },
        { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12, admin: { width: '50%' } },
      ],
    },
    linkGroup({ name: 'viewAll', label: '“View all” button (optional)' }),
    sectionSettings,
  ],
}
