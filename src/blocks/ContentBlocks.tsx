import { CMSLink } from '@/components/CMSLink'
import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { CountUp, NewsletterForm } from '@/components/ui'
import type { BlockData, ImageData, LinkData } from '@/lib/types'
import { cn, resolveLink, toImage } from '@/lib/utils'

import { SectionHeading } from './BlockWrapper'

/* ------------------------------------------------------------------ */
/* Logo marquee ("Featured in")                                       */
/* ------------------------------------------------------------------ */

const SPEED: Record<string, string> = { slow: '50s', normal: '32s', fast: '18s' }

type Logo = { name?: string; image?: unknown; url?: string }

export function LogoMarqueeBlock({ block }: { block: BlockData }) {
  const logos = (block.logos as Logo[] | undefined) ?? []
  if (!logos.length) return null
  const gray = block.grayscale !== false

  const item = (l: Logo, i: number, hidden = false) => {
    const img = toImage(l.image, 'thumbnail')
    const content = img ? (
      <span className="relative block h-10 w-32 md:h-12 md:w-40">
        <Img image={img} fill sizes="160px" className={cn('object-contain', gray && 'opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0')} alt={l.name} />
      </span>
    ) : (
      <span className={cn('whitespace-nowrap font-heading text-xl italic md:text-2xl', gray && 'opacity-60 transition hover:opacity-100')}>{l.name}</span>
    )
    return (
      <li key={`${l.name}-${i}-${hidden}`} aria-hidden={hidden || undefined} className="flex shrink-0 items-center px-6 md:px-10">
        {l.url && !hidden ? (
          <a href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.name}>
            {content}
          </a>
        ) : (
          content
        )}
      </li>
    )
  }

  return (
    <div className="marquee-wrap">
      {block.heading ? <p className="eyebrow mb-6 text-center opacity-70">{block.heading as string}</p> : null}
      {block.variant === 'static' ? (
        <ul className="flex flex-wrap items-center justify-center gap-y-6">{logos.map((l, i) => item(l, i))}</ul>
      ) : (
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="animate-marquee flex w-max" style={{ ['--marquee-duration' as string]: SPEED[(block.speed as string) ?? 'normal'] }}>
            {logos.map((l, i) => item(l, i))}
            {logos.map((l, i) => item(l, i, true))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Feature tiles                                                      */
/* ------------------------------------------------------------------ */

const FT_COLS: Record<number, string> = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

type FeatureTile = { image?: unknown; title?: string; text?: string; link?: LinkData }

export function FeatureTilesBlock({ block }: { block: BlockData }) {
  const tiles = (block.tiles as FeatureTile[] | undefined) ?? []
  if (!tiles.length) return null
  const overlay = block.variant === 'overlay'
  const cols = Number(block.columns) || 4

  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      <div className={cn('grid gap-5 sm:grid-cols-2 md:gap-6', FT_COLS[cols] ?? FT_COLS[4])}>
        {tiles.map((t, i) => {
          const link = resolveLink(t.link)
          const img = toImage(t.image, 'card')
          const body = overlay ? (
            <div className="group relative aspect-[4/5] overflow-hidden rounded-theme">
              <Img image={img} fill sizes="(min-width: 1024px) 25vw, 50vw" className="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="text-xl md:text-2xl">{t.title}</h3>
                {t.text && <p className="mt-1 text-sm opacity-90">{t.text}</p>}
                {link?.label && <span className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">{link.label} →</span>}
              </div>
            </div>
          ) : (
            <div className="group flex h-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-theme bg-ink/5">
                <Img image={img} fill sizes="(min-width: 1024px) 25vw, 50vw" className="transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="mt-4 text-xl">{t.title}</h3>
              {t.text && <p className="mt-1.5 text-sm opacity-75">{t.text}</p>}
              {link?.label && <span className="mt-3 text-sm font-semibold text-primary group-hover:underline">{link.label} →</span>}
            </div>
          )
          return link ? (
            <CMSLink key={i} resolved={link} className="block h-full">
              {body}
            </CMSLink>
          ) : (
            <div key={i}>{body}</div>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Stats                                                              */
/* ------------------------------------------------------------------ */

type Stat = { prefix?: string; value?: number; suffix?: string; label?: string }

const STAT_COLS: Record<number, string> = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

export function StatsBlock({ block }: { block: BlockData }) {
  const items = (block.items as Stat[] | undefined) ?? []
  if (!items.length) return null
  const cards = block.variant === 'cards'
  const animate = block.animate !== false

  return (
    <>
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      <dl className={cn('grid grid-cols-2 gap-4 md:gap-6', STAT_COLS[Math.min(items.length, 4)])}>
        {items.map((s, i) => (
          <div key={i} className={cn('flex flex-col items-center text-center', cards ? 'card card-border p-6 text-ink' : 'py-4')}>
            <dt className="order-2 mt-2 text-sm opacity-75 md:text-base">{s.label}</dt>
            <dd className="order-1 font-heading text-3xl text-primary md:text-5xl">
              {s.prefix}
              <CountUp value={Number(s.value) || 0} animate={animate} />
              {s.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Image with text                                                    */
/* ------------------------------------------------------------------ */

export function ImageWithTextBlock({ block }: { block: BlockData }) {
  const img: ImageData | null = toImage(block.image, 'card')
  const right = block.imagePosition === 'right'
  const overlap = block.variant === 'overlap'
  const cta = resolveLink(block.cta as LinkData)

  return (
    <div className={cn('grid items-center gap-8 md:grid-cols-2 md:gap-14', overlap && 'md:gap-0')}>
      <div className={cn('relative aspect-[4/3] overflow-hidden rounded-theme bg-ink/5', right && 'md:order-2')}>
        <Img image={img} fill sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <div
        className={cn(
          'flex flex-col gap-4',
          overlap && 'card card-shadow relative z-10 p-8 text-ink md:p-12',
          overlap && (right ? 'md:-mr-16' : 'md:-ml-16'),
        )}
      >
        {block.eyebrow ? <p className="eyebrow text-primary">{block.eyebrow as string}</p> : null}
        {block.heading ? <h2 className="text-3xl md:text-4xl">{block.heading as string}</h2> : null}
        <RichText data={block.content} />
        {cta && (
          <div className="mt-2">
            <CMSLink resolved={cta} appearance="primary" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Banner strip                                                       */
/* ------------------------------------------------------------------ */

export function BannerStripBlock({ block }: { block: BlockData }) {
  const img = toImage(block.image, 'hero')
  const cta = resolveLink(block.cta as LinkData)
  const tall = block.variant === 'tall'
  const center = block.align !== 'left'
  return (
    <div className={cn('relative overflow-hidden rounded-theme', img ? 'text-white' : 'bg-primary text-primary-fg', tall ? 'py-20 md:py-28' : 'py-10 md:py-12')}>
      {img && (
        <>
          <Img image={img} fill sizes="100vw" />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <div className={cn('relative flex flex-col gap-4 px-6 md:px-12', center ? 'items-center text-center' : 'items-start md:flex-row md:items-center md:justify-between')}>
        <div className={cn(center && 'max-w-2xl')}>
          <h2 className="text-2xl md:text-4xl">{block.heading as string}</h2>
          {block.text ? <p className="mt-2 opacity-90">{block.text as string}</p> : null}
        </div>
        {cta && <CMSLink resolved={cta} appearance="light" />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Rich text                                                          */
/* ------------------------------------------------------------------ */

export function RichTextBlockView({ block }: { block: BlockData }) {
  return (
    <RichText
      data={block.content}
      className={cn(block.width !== 'wide' && 'mx-auto max-w-3xl', block.align === 'center' && 'text-center')}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                         */
/* ------------------------------------------------------------------ */

export function NewsletterBlock({ block }: { block: BlockData }) {
  const card = block.variant !== 'inline'
  return (
    <div className={cn('mx-auto flex max-w-3xl flex-col items-center gap-4 text-center', card && 'card card-border p-8 text-ink md:p-12')}>
      {block.heading ? <h2 className="text-3xl md:text-4xl">{block.heading as string}</h2> : null}
      {block.text ? <p className="opacity-75">{block.text as string}</p> : null}
      <div className="w-full max-w-lg">
        <NewsletterForm
          source="newsletter-block"
          placeholder={block.placeholder as string}
          buttonLabel={block.buttonLabel as string}
          disclaimer={block.disclaimer as string}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

export function FaqBlock({ block }: { block: BlockData }) {
  const items = (block.items as Array<{ question?: string; answer?: string }> | undefined) ?? []
  if (!items.length) return null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
  }
  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading heading={block.heading as string} subheading={block.subheading as string} />
      <div className="divide-y divide-line rounded-theme border border-line bg-surface text-ink">
        {items.map((q, i) => (
          <details key={i} className="group px-5 py-4 md:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {q.question}
              <span className="text-xl leading-none text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{q.answer}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Spacer                                                             */
/* ------------------------------------------------------------------ */

const SPACE: Record<string, string> = { sm: 'h-6', md: 'h-12', lg: 'h-20', xl: 'h-32' }

export function SpacerBlock({ block }: { block: BlockData }) {
  return (
    <div className={cn('flex items-center', SPACE[(block.size as string) ?? 'md'])} aria-hidden>
      {block.divider ? <hr className="w-full border-line" /> : null}
    </div>
  )
}
