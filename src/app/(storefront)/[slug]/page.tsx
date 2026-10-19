import { pageMetadata, RenderPage } from '@/components/RenderPage'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return pageMetadata(slug)
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  return <RenderPage slug={slug} />
}
