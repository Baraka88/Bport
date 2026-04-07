import { PlaceHolderImages } from "@/app/lib/placeholder-images"
import Image from "next/image"

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Visual <span className="text-primary">Gallery</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A showcase of system architectures, UI designs, and snapshots from my professional journey.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {PlaceHolderImages.map((img) => (
          <div key={img.id} className="relative group overflow-hidden rounded-2xl shadow-lg break-inside-avoid">
            <Image
              src={img.imageUrl}
              alt={img.description}
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
    </div>
  )
}