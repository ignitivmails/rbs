import type { CollectionConfig } from 'payload'

import { ordersTeam, ownersOnly } from '../access'
import { options } from '../fields'

/** Corporate / wedding / custom-box enquiries from the "Enquiry form" page section. */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'company', 'quantity', 'status', 'followUpAt', 'createdAt'],
    listSearchableFields: ['name', 'company', 'phone', 'email'],
    description: 'Move each lead along: New → Contacted → Quoted → Won / Lost.',
  },
  defaultSort: '-createdAt',
  access: { read: ordersTeam, create: ordersTeam, update: ordersTeam, delete: ownersOnly },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'corporate',
          options: options(['corporate', 'Corporate gifting'], ['wedding', 'Wedding'], ['celebration', 'Celebration'], ['baby', 'Baby announcement'], ['custom', 'Custom box']),
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          options: options(['new', 'New'], ['contacted', 'Contacted'], ['quoted', 'Quoted'], ['won', 'Won'], ['lost', 'Lost']),
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'company', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'quantity', type: 'number', admin: { width: '33%' } },
        { name: 'budget', label: 'Budget per box ₹', type: 'number', admin: { width: '33%' } },
        { name: 'eventDate', type: 'date', admin: { width: '33%' } },
      ],
    },
    { name: 'message', type: 'textarea' },
    { name: 'notes', label: 'Internal notes', type: 'textarea' },
    // Sales pipeline (sidebar)
    { name: 'assignedTo', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    { name: 'followUpAt', label: 'Follow up on', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'quoteValue', label: 'Quoted value ₹', type: 'number', admin: { position: 'sidebar' } },
    { name: 'source', label: 'Submitted from', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Newsletter subscribers' },
  admin: { group: 'Leads', useAsTitle: 'email', defaultColumns: ['email', 'source', 'createdAt'] },
  // Public sign-ups go through a server action, never the open REST API.
  access: { read: ordersTeam, create: ownersOnly, update: ownersOnly, delete: ownersOnly },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'source', type: 'text', admin: { description: 'Where they signed up' } },
  ],
}
