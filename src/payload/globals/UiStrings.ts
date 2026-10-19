import type { Field, GlobalConfig } from 'payload'

import { DEFAULT_STRINGS, STRING_GLOBALS, STRING_GROUPS } from '../../lib/strings'
import { anyone, editorsOnly } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())

const stringField = (key: keyof typeof DEFAULT_STRINGS): Field => {
  const def = DEFAULT_STRINGS[key]
  const vars = def.match(/\{\w+\}/g)
  return {
    name: key,
    label: humanize(key),
    type: 'text',
    localized: true,
    defaultValue: def,
    admin: { description: vars ? `Placeholders: ${vars.join(', ')}` : undefined },
  }
}

/** Every button label and message on the storefront, editable and translatable (one global per group set). */
export const UiStringGlobals: GlobalConfig[] = STRING_GLOBALS.map(({ slug, label, groups }) => ({
  slug,
  label,
  admin: { group: 'Settings', description: 'Button labels and messages used across the shop. Empty fields fall back to the defaults.' },
  access: { read: anyone, update: editorsOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: groups.map((group) => ({ label: group, fields: (STRING_GROUPS[group] ?? []).map(stringField) })),
    },
  ],
}))
