"use client"

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import Image from "next/image"
import { Loader2, ImageOff } from "lucide-react"

export default function GalleryPage() {
  const db = useFirestore()
  const galleryQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "images"), orderBy("uploadDate", "desc"))
  }, [db])

  const { data: images, isLoading } = useCollection(galleryQuery)

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Visual <span className="text-primary">Gallery</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A showcase of system architectures, UI designs, and snapshots from my professional journey.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading gallery...</p>
        </div>
      ) : images && images.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img) => (
            <div key={img.id} className="relative group overflow-hidden rounded-2xl shadow-lg break-inside-avoid">
              <Image
                src={img.url}
                alt={img.altText || img.description}
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-medium">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 border-2 border-dashed rounded-3xl">
          <ImageOff className="h-16 w-16 opacity-20" />
          <p className="text-xl font-headline font-bold">Gallery is currently empty</p>
          <p className="max-w-xs text-center">I'll be adding project highlights and architectural diagrams here soon.</p>
        </div>
      )}
    </div>
  )
}
