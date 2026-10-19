import { PostDetail, postMetadata } from '@/components/posts/PostViews'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return postMetadata('library', (await params).slug)
}

export default async function LibraryEntryPage({ params }: Props) {
  return <PostDetail section="library" slug={(await params).slug} />
}
