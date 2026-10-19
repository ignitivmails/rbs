import { pageMetadata, RenderPage } from '@/components/RenderPage'

export const generateMetadata = () => pageMetadata('home')

export default function HomePage() {
  return <RenderPage slug="home" />
}
