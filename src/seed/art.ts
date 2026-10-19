/**
 * Generates placeholder artwork (SVG → JPEG via sharp) so the demo store looks complete
 * without any downloaded photos. Replace with real photography in the admin.
 */
import sharp from 'sharp'

export type Palette = { bg1: string; bg2: string; main: string; shade: string; accent: string }

export const PALETTES = {
  cream: { bg1: '#FFF6E6', bg2: '#F1D4A6', main: '#FBF6EC', shade: '#E2D3B6', accent: '#C9962B' },
  saffron: { bg1: '#FFEFD2', bg2: '#F3B65A', main: '#F6C453', shade: '#D98F22', accent: '#C9962B' },
  gur: { bg1: '#F8E6CF', bg2: '#D59A5E', main: '#C0844A', shade: '#8E5527', accent: '#5B2E12' },
  mango: { bg1: '#FFF3CF', bg2: '#FFC24A', main: '#FFB627', shade: '#E08A12', accent: '#2F7D4F' },
  terracotta: { bg1: '#FAE8DA', bg2: '#E0A07A', main: '#B5532C', shade: '#8E3A1C', accent: '#FBF3E4' },
  choco: { bg1: '#F3E2D2', bg2: '#B88762', main: '#6B3B24', shade: '#2B150C', accent: '#E0B04F' },
  silver: { bg1: '#FBF2E5', bg2: '#E6C99E', main: '#F3EADB', shade: '#C9BCA4', accent: '#B0B0B0' },
  rose: { bg1: '#FDE8EC', bg2: '#EFA2B1', main: '#C2304B', shade: '#8E1E33', accent: '#F6C453' },
  maroon: { bg1: '#8A2323', bg2: '#3A0C0C', main: '#B22B2B', shade: '#701616', accent: '#E3B04B' },
  pista: { bg1: '#EBF5E2', bg2: '#A5CD8A', main: '#5C8F3A', shade: '#3F6A24', accent: '#F6E7C1' },
  sky: { bg1: '#E7F1F8', bg2: '#A6C6DE', main: '#2E5E8C', shade: '#1D4166', accent: '#F6C453' },
  namkeen: { bg1: '#FFF1D9', bg2: '#E8B468', main: '#E2A73F', shade: '#B97A1F', accent: '#3F7A2A' },
  date: { bg1: '#F6E8D9', bg2: '#C99A74', main: '#8A5634', shade: '#55301A', accent: '#E8C07A' },
  forest: { bg1: '#2A5038', bg2: '#0E2017', main: '#3C7350', shade: '#1B3A27', accent: '#E3B04B' },
  night: { bg1: '#3B1F14', bg2: '#140906', main: '#6B3B24', shade: '#2B150C', accent: '#E0B04F' },
} satisfies Record<string, Palette>

export type PaletteName = keyof typeof PALETTES
export type ArtKind = 'balls' | 'discs' | 'diamonds' | 'pot' | 'bark' | 'truffles' | 'mix' | 'box'

/** Deterministic pseudo-random numbers so artwork is stable between seeds. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const r1 = (n: number) => Math.round(n * 10) / 10

function defs(id: string, p: Palette) {
  return `
  <radialGradient id="${id}-ball" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.5" stop-color="${p.main}"/><stop offset="1" stop-color="${p.shade}"/></radialGradient>
  <radialGradient id="${id}-dark" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${p.main}"/><stop offset="1" stop-color="${p.shade}"/></radialGradient>
  <linearGradient id="${id}-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.main}"/><stop offset="0.5" stop-color="#FFFFFF"/><stop offset="1" stop-color="${p.shade}"/></linearGradient>
  <filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>`
}

const shadow = (id: string, w: number, y: number) =>
  `<ellipse cx="0" cy="${y}" rx="${w}" ry="${r1(w * 0.2)}" fill="#000" opacity="0.2" filter="url(#${id}-blur)"/>`

const plate = (id: string) =>
  `${shadow(id, 340, 150)}<ellipse cx="0" cy="110" rx="345" ry="128" fill="#FFFFFF"/><ellipse cx="0" cy="104" rx="272" ry="96" fill="#F4EEE5"/>`

function bowl(id: string, color: string, inner: string, contents: string) {
  const back = `${shadow(id, 330, 220)}<path d="M-320 0 C-310 170 -180 238 0 238 C180 238 310 170 320 0 Z" fill="${color}"/><ellipse cx="0" cy="0" rx="320" ry="80" fill="${inner}"/>`
  const front = `<path d="M-318 22 C-240 96 240 96 318 22 C302 165 182 238 0 238 C-182 238 -302 165 -318 22 Z" fill="${color}"/><path d="M-318 22 C-240 96 240 96 318 22" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="6"/>`
  return back + contents + front
}

function draw(kind: ArtKind, p: Palette, id: string, rand: () => number): string {
  switch (kind) {
    case 'balls': {
      const pos = [
        [-90, -62],
        [90, -62],
        [-180, 8],
        [0, 2],
        [180, 8],
      ]
      const balls = pos
        .map(
          ([x, y]) =>
            `<circle cx="${x}" cy="${y}" r="100" fill="url(#${id}-ball)"/><ellipse cx="${x - 34}" cy="${y - 40}" rx="26" ry="15" fill="#FFFFFF" opacity="0.75"/>`,
        )
        .join('')
      return bowl(id, p.accent, '#F3DCAA', balls)
    }
    case 'discs': {
      const pos = [
        [-155, -40],
        [0, -58],
        [155, -40],
        [-80, 48],
        [80, 48],
      ]
      return (
        plate(id) +
        pos
          .map(([x, y]) => {
            const ring = Array.from({ length: 8 }, (_, k) => {
              const a = (k / 8) * Math.PI * 2
              return `<circle cx="${r1(x + Math.cos(a) * 56)}" cy="${r1(y + Math.sin(a) * 24)}" r="7" fill="${p.shade}" opacity="0.7"/>`
            }).join('')
            return `<ellipse cx="${x}" cy="${y + 22}" rx="94" ry="42" fill="${p.shade}"/><rect x="${x - 94}" y="${y}" width="188" height="22" fill="${p.shade}"/><ellipse cx="${x}" cy="${y}" rx="94" ry="42" fill="${p.main}"/>${ring}<circle cx="${x}" cy="${y}" r="13" fill="${p.accent}"/>`
          })
          .join('')
      )
    }
    case 'diamonds': {
      const pos = [
        [-170, -40],
        [0, -40],
        [170, -40],
        [-85, 52],
        [85, 52],
      ]
      return (
        plate(id) +
        pos
          .map(
            ([x, y]) =>
              `<polygon points="${x},${y - 36} ${x + 112},${y + 16} ${x},${y + 68} ${x - 112},${y + 16}" fill="${p.shade}"/><polygon points="${x},${y - 52} ${x + 112},${y} ${x},${y + 52} ${x - 112},${y}" fill="url(#${id}-silver)"/>`,
          )
          .join('')
      )
    }
    case 'pot':
      return (
        shadow(id, 260, 232) +
        `<path d="M-215 -60 C-252 120 -150 232 0 232 C150 232 252 120 215 -60 Z" fill="${p.main}"/>` +
        `<path d="M-228 40 C-120 84 120 84 228 40" stroke="${p.shade}" stroke-width="12" fill="none" opacity="0.6"/>` +
        `<path d="M-190 -20 C-215 110 -130 205 -40 222" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="22" fill="none"/>` +
        `<ellipse cx="0" cy="-60" rx="226" ry="62" fill="${p.shade}"/><ellipse cx="0" cy="-62" rx="192" ry="46" fill="${p.accent}"/>` +
        `<ellipse cx="-28" cy="-68" rx="92" ry="17" fill="#E9CFA0" opacity="0.85"/>`
      )
    case 'bark': {
      const centers = [
        [-170, -20],
        [0, -62],
        [170, -12],
        [-90, 66],
        [92, 60],
      ]
      const shards = centers
        .map(([cx, cy]) => {
          const pts = Array.from({ length: 5 }, (_, k) => {
            const a = (k / 5) * Math.PI * 2 + rand() * 0.6
            const rad = 78 + rand() * 42
            return `${r1(cx + Math.cos(a) * rad)},${r1(cy + Math.sin(a) * rad * 0.55)}`
          }).join(' ')
          const dots = Array.from({ length: 9 }, () => {
            const colors = [p.accent, '#7FB069', '#E58FA1', '#FFFFFF']
            return `<circle cx="${r1(cx + (rand() - 0.5) * 120)}" cy="${r1(cy + (rand() - 0.5) * 50)}" r="${r1(5 + rand() * 5)}" fill="${colors[Math.floor(rand() * colors.length)]}"/>`
          }).join('')
          return `<polygon points="${pts}" fill="${p.main}" stroke="${p.shade}" stroke-width="6"/>${dots}`
        })
        .join('')
      return plate(id) + shards
    }
    case 'truffles': {
      const pos = [
        [-165, -10],
        [0, -38],
        [165, -10],
        [-82, 72],
        [82, 72],
      ]
      return (
        plate(id) +
        pos
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="76" fill="url(#${id}-dark)"/><path d="M${x - 52} ${y - 28} l20 -14 l20 14 l20 -14 l20 14 l20 -14" stroke="${p.accent}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${x - 26}" cy="${y - 34}" rx="16" ry="9" fill="#FFFFFF" opacity="0.25"/>`,
          )
          .join('')
      )
    }
    case 'mix': {
      const pieces = Array.from({ length: 140 }, () => {
        const a = rand() * Math.PI * 2
        const d = Math.sqrt(rand())
        const x = r1(Math.cos(a) * d * 270)
        const y = r1(Math.sin(a) * d * 70 - 18)
        const rot = Math.round(rand() * 180)
        const roll = rand()
        if (roll < 0.15) return `<ellipse cx="${x}" cy="${y}" rx="14" ry="7" fill="${p.accent}" transform="rotate(${rot} ${x} ${y})"/>`
        if (roll < 0.3) return `<ellipse cx="${x}" cy="${y}" rx="10" ry="8" fill="#C98B4B"/>`
        const c = [p.main, p.shade, '#F3D07A', '#E9B65A'][Math.floor(rand() * 4)]
        return `<rect x="${x - 18}" y="${y - 4}" width="36" height="8" rx="4" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`
      }).join('')
      return bowl(id, '#F4ECDD', p.shade, `<ellipse cx="0" cy="-14" rx="292" ry="96" fill="${p.main}"/>${pieces}`)
    }
    case 'box':
    default: {
      const motif = Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * Math.PI * 2
        return `<circle cx="${r1(Math.cos(a) * 92)}" cy="${r1(80 + Math.sin(a) * 92)}" r="9" fill="#FFFFFF" opacity="0.35"/>`
      }).join('')
      return (
        shadow(id, 300, 238) +
        `<rect x="-240" y="-70" width="480" height="300" rx="18" fill="${p.main}"/>` +
        `<circle cx="0" cy="80" r="64" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="6" stroke-dasharray="4 12"/>${motif}` +
        `<rect x="-240" y="40" width="480" height="44" fill="${p.accent}" opacity="0.9"/>` +
        `<rect x="-262" y="-128" width="524" height="84" rx="16" fill="${p.shade}"/>` +
        `<rect x="-28" y="-128" width="56" height="358" fill="${p.accent}"/>` +
        `<path d="M0 -128 C-70 -232 -176 -170 -96 -122 Z" fill="${p.accent}"/><path d="M0 -128 C70 -232 176 -170 96 -122 Z" fill="${p.accent}"/>` +
        `<circle cx="0" cy="-128" r="26" fill="${p.accent}" stroke="#000" stroke-opacity="0.12" stroke-width="4"/>`
      )
    }
  }
}

function decorations(w: number, h: number, rand: () => number, color = '#FFFFFF') {
  const dots = Array.from({ length: 40 }, () => `<circle cx="${r1(rand() * w)}" cy="${r1(rand() * h)}" r="${r1(2 + rand() * 4)}" fill="${color}" opacity="${r1(0.15 + rand() * 0.25)}"/>`).join('')
  return dots
}

/** Square product shot: one object on a soft radial background. */
export function squareSvg(kind: ArtKind, palette: PaletteName, seed = 1, size = 1000) {
  const p = PALETTES[palette]
  const rand = rng(seed)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1000 1000">
  <defs><radialGradient id="bg" cx="50%" cy="38%" r="80%"><stop offset="0" stop-color="${p.bg1}"/><stop offset="1" stop-color="${p.bg2}"/></radialGradient>${defs('a', p)}</defs>
  <rect width="1000" height="1000" fill="url(#bg)"/>
  <circle cx="500" cy="520" r="430" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="3" stroke-dasharray="2 14"/>
  <circle cx="500" cy="520" r="360" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2"/>
  ${decorations(1000, 1000, rand)}
  <g transform="translate(500 545) scale(1.05)">${draw(kind, p, 'a', rand)}</g>
</svg>`
}

export type SceneObject = { kind: ArtKind; palette: PaletteName; x: number; y: number; scale: number }

/** Wide scene (hero banners, feature tiles): dark-to-light background with objects placed freely. */
export function sceneSvg(width: number, height: number, bg: PaletteName, objects: SceneObject[], seed = 7) {
  const b = PALETTES[bg]
  const rand = rng(seed)
  const objDefs = objects.map((o, i) => defs(`o${i}`, PALETTES[o.palette])).join('')
  const objs = objects
    .map((o, i) => `<g transform="translate(${o.x} ${o.y}) scale(${o.scale})">${draw(o.kind, PALETTES[o.palette], `o${i}`, rand)}</g>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="${b.bg2}"/><stop offset="1" stop-color="${b.bg1}"/></linearGradient>${objDefs}</defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${width * 0.72}" cy="${height * 0.5}" r="${height * 0.62}" fill="#FFFFFF" opacity="0.07"/>
  <circle cx="${width * 0.72}" cy="${height * 0.5}" r="${height * 0.48}" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="3 16"/>
  ${decorations(width, height, rand)}
  ${objs}
</svg>`
}

export function toJpeg(svg: string) {
  return sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toBuffer()
}
