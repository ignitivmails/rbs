import { ProductGridSkeleton } from '@/components/Skeletons'

export default function Loading() {
  return (
    <>
      <div className="skeleton h-40 w-full md:h-56" aria-hidden />
      <ProductGridSkeleton withHeader={false} />
    </>
  )
}
