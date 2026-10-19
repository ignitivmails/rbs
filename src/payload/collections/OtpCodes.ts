import type { CollectionConfig } from 'payload'

import { ownersOnly } from '../access'

/** One-time passwords for phone verification (COD now, login in Phase 5). Only hashes are stored. */
export const OtpCodes: CollectionConfig = {
  slug: 'otp-codes',
  admin: { hidden: true },
  access: { read: ownersOnly, create: ownersOnly, update: ownersOnly, delete: ownersOnly },
  fields: [
    { name: 'phone', type: 'text', required: true, index: true },
    { name: 'purpose', type: 'text', required: true },
    { name: 'codeHash', type: 'text', required: true },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'attempts', type: 'number', defaultValue: 0 },
    { name: 'used', type: 'checkbox', defaultValue: false },
  ],
}
