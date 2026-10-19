/**
 * Default design tokens. The Theme global in the admin uses these as field defaults,
 * and the storefront falls back to them for any value left empty.
 */
export const DEFAULT_THEME = {
  // Colours
  primary: '#8B1E1E',
  primaryForeground: '#FFFFFF',
  secondary: '#F6E7CC',
  accent: '#C9962B',
  background: '#FFF8EE',
  surface: '#FFFFFF',
  text: '#2B1B12',
  muted: '#7A6A5E',
  border: '#EADCC8',
  success: '#2F7D4F',
  danger: '#B42318',
  // Typography
  fontSource: 'google',
  headingFont: 'Fraunces',
  bodyFont: 'Inter',
  baseFontSize: 16,
  headingWeight: '600',
  headingCase: 'none',
  // Shape & layout
  radius: 12,
  buttonShape: 'rounded',
  containerWidth: 1280,
  // Product cards
  cardStyle: 'border',
  imageRatio: 'square',
  showRating: true,
  showDiscountBadge: true,
  showQuickAdd: true,
  showViewDetails: true,
  // Advanced
  customCss: '',
}

export type ThemeSettings = typeof DEFAULT_THEME

const clean = (v: unknown) =>
  String(v ?? '')
    .replace(/[<>{};]/g, '')
    .trim()

export function mergeTheme(raw: Record<string, unknown> | null | undefined): ThemeSettings {
  const out: Record<string, unknown> = { ...DEFAULT_THEME }
  if (raw) {
    for (const key of Object.keys(DEFAULT_THEME)) {
      const v = raw[key]
      if (v !== null && v !== undefined && v !== '') out[key] = v
    }
  }
  return out as ThemeSettings
}

const fontStack = (name: string, fallback: string) => {
  const n = clean(name).replace(/['"]/g, '')
  return n ? `'${n}', ${fallback}` : fallback
}

/** Turns theme settings into CSS custom properties consumed by Tailwind (see globals.css). */
export function themeCss(t: ThemeSettings): string {
  const radius = `${Math.max(0, Number(t.radius) || 0)}px`
  const btnRadius = t.buttonShape === 'pill' ? '999px' : t.buttonShape === 'square' ? '0px' : radius
  const vars: Record<string, string | number> = {
    '--rbs-primary': t.primary,
    '--rbs-primary-fg': t.primaryForeground,
    '--rbs-secondary': t.secondary,
    '--rbs-accent': t.accent,
    '--rbs-bg': t.background,
    '--rbs-surface': t.surface,
    '--rbs-text': t.text,
    '--rbs-muted': t.muted,
    '--rbs-border': t.border,
    '--rbs-success': t.success,
    '--rbs-danger': t.danger,
    '--rbs-font-heading': fontStack(t.headingFont, 'Georgia, serif'),
    '--rbs-font-body': fontStack(t.bodyFont, 'system-ui, sans-serif'),
    '--rbs-base-size': `${Number(t.baseFontSize) || 16}px`,
    '--rbs-heading-weight': t.headingWeight,
    '--rbs-heading-transform': t.headingCase,
    '--rbs-radius': radius,
    '--rbs-btn-radius': btnRadius,
    '--rbs-container': `${Number(t.containerWidth) || 1280}px`,
  }
  const root = `:root{${Object.entries(vars)
    .map(([k, v]) => `${k}:${clean(v)}`)
    .join(';')}}`
  const custom = String(t.customCss || '').replace(/<\/?style/gi, '')
  return `${root}\n${custom}`
}

export function googleFontLinks(t: ThemeSettings): string[] {
  if (t.fontSource !== 'google') return []
  const families = Array.from(new Set([t.headingFont, t.bodyFont].map((f) => clean(f)).filter(Boolean)))
  return families.map(
    (f) => `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`,
  )
}
