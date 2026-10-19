'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

const toPickerValue = (value: string) => {
  if (!HEX.test(value)) return '#ffffff'
  if (value.length === 4) return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase()
  return value.toLowerCase()
}

/** Admin field: native colour picker + free-text input (accepts any CSS colour). */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const current = typeof value === 'string' ? value : ''
  const label = typeof field?.label === 'string' ? field.label : field?.name
  const description = typeof field?.admin?.description === 'string' ? field.admin.description : undefined

  return (
    <div className="field-type text" style={{ marginBottom: 'var(--spacing-field, 1.5rem)', flex: '1 1 0' }}>
      <label className="field-label" htmlFor={`field-${path}`} style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          aria-label={`${label} picker`}
          type="color"
          value={toPickerValue(current)}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 44, height: 40, padding: 2, border: '1px solid var(--theme-elevation-150)', borderRadius: 4, background: 'none', cursor: 'pointer' }}
        />
        <input
          id={`field-${path}`}
          type="text"
          value={current}
          placeholder="#8B1E1E"
          onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1, height: 40, padding: '0 12px', border: '1px solid var(--theme-elevation-150)', borderRadius: 4, background: 'var(--theme-input-bg)', color: 'var(--theme-elevation-800)' }}
        />
        <span
          aria-hidden
          style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid var(--theme-elevation-150)', background: current || 'transparent' }}
        />
      </div>
      {description && (
        <div className="field-description" style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
          {description}
        </div>
      )}
    </div>
  )
}
