
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const messages = [
  "Software Engineer Extraordinaire",
  "Master of Node.js & Vue.js",
  "Expert in System Analysis",
  "Crafting Digital Solutions"
]

export function Hero() {
  const [currentImage, setCurrentImage] = React.useState(0)
  const [messageIndex, setMessageIndex] = React.useState(0)
  const [text, setText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [typingSpeed, setTypingSpeed] = React.useState(150)

  // Slideshow logic
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 2) // Assuming first 2 are hero images
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Typewriter logic
  React.useEffect(() => {
    const handleTyping = () => {
      const fullText = messages[messageIndex]
      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 50 : 150)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && text === "") {
        setIsDeleting(false)
        setMessageIndex((prev) => (prev + 1) % messages.length)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, messageIndex, typingSpeed])

  const heroImages = [PlaceHolderImages[0], PlaceHolderImages[1]]

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <div
            key={img.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              currentImage === idx ? "opacity-30" : "opacity-0"
            )}
          >
            <Image
              src={img.imageUrl}
              alt={img.description}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wider uppercase">
            Available for Hire
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight font-headline">
            I am <span className="text-primary underline decoration-accent underline-offset-8">Baraka Junior</span>
          </h1>
          <div className="h-12 flex items-center">
            <p className="text-2xl md:text-3xl text-muted-foreground font-medium border-r-4 border-accent pr-2 animate-pulse whitespace-nowrap overflow-hidden">
              {text}
            </p>
          </div>
          <p className="text-lg text-muted-foreground max-w-lg">
            A results-driven Software Engineer and System Analyst specializing in robust backend architectures and dynamic frontend experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="rounded-full shadow-lg group">
              View Portfolio
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
