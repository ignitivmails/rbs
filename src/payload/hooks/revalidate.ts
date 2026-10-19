import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  RequestContext,
} from 'payload'

import { CMS_TAG } from '../../lib/constants'

/**
 * The storefront caches every CMS query under one tag, so any publish refreshes the
 * whole site within seconds. Simple and safe for a catalogue of this size.
 */
export function revalidateCMS(context?: RequestContext) {
  if (context?.disableRevalidate) return
  try {
    revalidateTag(CMS_TAG)
  } catch {
    // Not running inside Next.js (e.g. the seed script) — nothing to revalidate.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, context }) => {
  revalidateCMS(context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  revalidateCMS(context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, context }) => {
  revalidateCMS(context)
  return doc
}
