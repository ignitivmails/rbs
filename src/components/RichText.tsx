import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn, isObject } from '@/lib/utils'

export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!isObject(data) || !isObject(data.root)) return null
  return (
    <div className={cn('prose-rbs', className)}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <LexicalRichText data={data as any} />
    </div>
  )
}
