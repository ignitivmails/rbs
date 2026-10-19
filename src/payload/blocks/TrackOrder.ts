import type { Block } from 'payload'

import { sectionSettings } from '../fields'

export const TrackOrder: Block = {
  slug: 'trackOrder',
  interfaceName: 'TrackOrderBlock',
  labels: { singular: 'Order tracking form', plural: 'Order tracking forms' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Track your order' },
    { name: 'text', type: 'textarea', localized: true, defaultValue: 'Enter your order number and the mobile number used at checkout.' },
    { name: 'buttonLabel', type: 'text', localized: true, defaultValue: 'Track order' },
    sectionSettings,
  ],
}
