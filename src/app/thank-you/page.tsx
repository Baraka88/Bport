
"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] container mx-auto px-4 text-center space-y-8">
      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center animate-bounce">
        <CheckCircle className="h-12 w-12" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Submission Received!</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Thank you for reaching out. Your details have been transmitted to my desk. I'll review them and get back to you shortly.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="rounded-xl h-14 px-8" asChild>
          <Link href="/"><Home className="mr-2 h-5 w-5" /> Back Home</Link>
        </Button>
        <Button variant="outline" size="lg" className="rounded-xl h-14 px-8" asChild>
          <Link href="/gallery"><ArrowLeft className="mr-2 h-5 w-5" /> Explore Gallery</Link>
        </Button>
      </div>
    </div>
  )
}
