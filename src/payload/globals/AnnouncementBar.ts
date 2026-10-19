import type { GlobalConfig } from 'payload'

import { anyone, editorsOnly } from '../access'
import { colorField, linkGroup } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'
import { previewUrl } from '../utilities'

export const AnnouncementBar: GlobalConfig = {
  slug: 'announcement-bar',
  label: 'Announcement bar',
  admin: {
    group: 'Design',
    description: 'Rotating messages at the very top of the site — offers, delivery notices, festive news.',
    livePreview: { url: previewUrl('/') },
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  access: { read: anyone, update: editorsOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'enabled', label: 'Show announcement bar', type: 'checkbox', defaultValue: true, admin: { width: '34%' } },
        { name: 'rotateSeconds', label: 'Rotate every (seconds)', type: 'number', defaultValue: 5, min: 0, admin: { width: '33%' } },
        { name: 'dismissible', label: 'Visitors can close it', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        colorField('background', 'Background', undefined, 'Empty = theme primary colour'),
        colorField('textColor', 'Text colour', undefined, 'Empty = text on primary'),
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'showFrom', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'showUntil', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'messages',
      type: 'array',
      labels: { singular: 'Message', plural: 'Messages' },
      fields: [
        { name: 'text', type: 'text', required: true, localized: true },
        linkGroup({ withLabel: false }),
      ],
    },
  ],
}
