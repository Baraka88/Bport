import { Suspense } from "react"
import GalleryClient from "./GalleryClient"

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-muted-foreground">Loading gallery...</p>
      </div>
    }>
      <GalleryClient />
    </Suspense>
  )
}
