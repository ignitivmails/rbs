import type { Block } from 'payload'

import { headingFields, linkGroup, options, sectionSettings } from '../fields'

export const ImageWithText: Block = {
  slug: 'imageWithText',
  interfaceName: 'ImageWithTextBlock',
  labels: { singular: 'Image with text', plural: 'Image with text' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'left',
          options: options(['left', 'Image left'], ['right', 'Image right']),
          admin: { width: '25%' },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'default',
          options: options(['default', 'Side by side'], ['overlap', 'Overlapping card']),
          admin: { width: '25%' },
        },
      ],
    },
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
    linkGroup({ name: 'cta', label: 'Button (optional)' }),
    sectionSettings,
  ],
}

export const BannerStrip: Block = {
  slug: 'bannerStrip',
  interfaceName: 'BannerStripBlock',
  labels: { singular: 'Banner strip', plural: 'Banner strips' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'image', label: 'Background image (optional)', type: 'upload', relationTo: 'media' },
    linkGroup({ name: 'cta', label: 'Button (optional)' }),
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'slim',
          options: options(['slim', 'Slim'], ['tall', 'Tall']),
          admin: { width: '50%' },
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          options: options(['left', 'Left'], ['center', 'Centre']),
          admin: { width: '50%' },
        },
      ],
    },
    sectionSettings,
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    { name: 'content', type: 'richText', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'narrow',
          options: options(['narrow', 'Narrow (readable)'], ['wide', 'Wide']),
          admin: { width: '50%' },
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'left',
          options: options(['left', 'Left'], ['center', 'Centre']),
          admin: { width: '50%' },
        },
      ],
    },
    sectionSettings,
  ],
}

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter signup', plural: 'Newsletter signups' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Join the mishti club' },
    { name: 'text', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'placeholder', type: 'text', localized: true, defaultValue: 'Your email address', admin: { width: '50%' } },
        { name: 'buttonLabel', type: 'text', localized: true, defaultValue: 'Subscribe', admin: { width: '50%' } },
      ],
    },
    { name: 'disclaimer', type: 'text', localized: true, defaultValue: 'We don’t spam. It’s a promise.' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'card',
      options: options(['card', 'Card'], ['inline', 'Inline']),
    },
    sectionSettings,
  ],
}

export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    ...headingFields(),
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
    sectionSettings,
  ],
}

export const Spacer: Block = {
  slug: 'spacer',
  interfaceName: 'SpacerBlock',
  labels: { singular: 'Spacer / divider', plural: 'Spacers' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          options: options(['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large']),
          admin: { width: '50%' },
        },
        { name: 'divider', label: 'Show a line', type: 'checkbox', admin: { width: '50%' } },
      ],
    },
    sectionSettings,
  ],
}
