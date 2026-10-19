import type { CollectionConfig } from 'payload'

import { loggedIn, ownerFieldAccess, ownersOnly } from '../access'
import { options } from '../fields'

/** Admin-panel users (staff). Shopper accounts arrive in Phase 5 as a separate collection. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin user', plural: 'Admin users' },
  admin: { group: 'Settings', useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'] },
  auth: true,
  access: {
    read: loggedIn,
    create: ownersOnly,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if ((user as { role?: string }).role === 'owner') return true
      return user.id === id
    },
    delete: ownersOnly,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'owner',
      saveToJWT: true,
      options: options(['owner', 'Owner — everything'], ['editor', 'Editor — content & products'], ['orderManager', 'Order manager — orders & enquiries']),
      access: { update: ownerFieldAccess },
    },
  ],
}
