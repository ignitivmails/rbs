import { googleFontLinks, themeCss, type ThemeSettings } from '@/lib/theme'

/** Writes the Theme global as CSS variables on :root and loads the chosen Google Fonts. */
export function ThemeStyle({ theme }: { theme: ThemeSettings }) {
  const fonts = googleFontLinks(theme)
  return (
    <>
      {fonts.length > 0 && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {fonts.map((href) => (
            <link key={href} rel="stylesheet" href={href} />
          ))}
        </>
      )}
      <style id="rbs-theme" dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
    </>
  )
}
