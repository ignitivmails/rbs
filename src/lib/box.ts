/** Build-a-box helpers shared by the browser (cart) and the server (quote). */

export type BoxContent = { itemId: string; qty: number }

/** Small stable hash for cart keys (not security-sensitive). */
export function hashString(s: string) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h.toString(36)
}

export function normalizeContents(contents: BoxContent[] | null | undefined): BoxContent[] {
  return (contents ?? [])
    .filter((c) => c && Number(c.qty) > 0)
    .map((c) => ({ itemId: String(c.itemId), qty: Math.floor(Number(c.qty)) }))
    .sort((a, b) => a.itemId.localeCompare(b.itemId))
}

export const normalizeMessage = (message?: string | null) => String(message ?? '').trim().slice(0, 200)

/** Identical boxes share a cart line; different contents/packaging/message get their own. */
export function boxKey(sel: { boxId: string | number; sizeId: string; contents: BoxContent[]; packagingId?: string | null; message?: string | null }) {
  const signature = JSON.stringify([sel.sizeId, normalizeContents(sel.contents), sel.packagingId ?? '', normalizeMessage(sel.message)])
  return `box:${sel.boxId}:${hashString(signature)}`
}
