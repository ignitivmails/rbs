import type { Metadata } from 'next'

import { PostIndex } from '@/components/posts/PostViews'

export const metadata: Metadata = { title: 'Blog' }

export default function BlogPage() {
  return <PostIndex section="blog" />
}
