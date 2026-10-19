import type { GlobalConfig } from 'payload'

import { NOTIFICATION_EVENTS } from '../../lib/notification-templates'
import { editorsOnly, ownersOnly } from '../access'

const PLACEHOLDERS = 'Placeholders: {name} {orderNumber} {total} {deliveryDate} {orderUrl} {trackingUrl} {siteName}'

export const Notifications: GlobalConfig = {
  slug: 'notifications',
  label: 'Notifications',
  admin: {
    group: 'Settings',
    description: 'Emails and SMS/WhatsApp messages sent to customers as their order moves along. Locally, they are printed in the terminal.',
  },
  access: { read: editorsOnly, update: ownersOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Shop alerts',
          fields: [
            { name: 'adminEmail', label: 'New-order alert email', type: 'email', admin: { description: 'Where the shop team gets notified of new orders' } },
            { name: 'sendAdminAlerts', type: 'checkbox', defaultValue: true },
          ],
        },
        ...NOTIFICATION_EVENTS.map((event) => ({
          label: event.label,
          fields: [
            {
              name: event.key,
              type: 'group' as const,
              label: false as const,
              admin: { description: PLACEHOLDERS },
              fields: [
                { name: 'enabled', label: 'Send this notification', type: 'checkbox' as const, defaultValue: true },
                { name: 'emailSubject', type: 'text' as const, localized: true, defaultValue: event.subject },
                { name: 'emailBody', type: 'textarea' as const, localized: true, defaultValue: event.body },
                { name: 'sms', label: 'SMS / WhatsApp text', type: 'textarea' as const, localized: true, defaultValue: event.sms },
              ],
            },
          ],
        })),
      ],
    },
  ],
}
