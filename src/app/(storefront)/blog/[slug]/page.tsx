import { PostDetail, postMetadata } from '@/components/posts/PostViews'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return postMetadata('blog', (await params).slug)
}

export default async function BlogPostPage({ params }: Props) {
  return <PostDetail section="blog" slug={(await params).slug} />
}
