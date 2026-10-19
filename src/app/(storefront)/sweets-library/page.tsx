import type { Metadata } from 'next'

import { PostIndex } from '@/components/posts/PostViews'

export const metadata: Metadata = { title: 'Sweets Library' }

export default function SweetsLibraryPage() {
  return <PostIndex section="library" />
}
