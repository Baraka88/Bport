"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"
import Image from "next/image"
import { ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const mainMessages = [
  "Software Engineer Extraordinaire",
  "Master of Node.js & Vue.js",
  "Expert in System Analysis",
  "Crafting Digital Solutions"
]

function TypewriterText({ messages, speed = 150, delay = 2000 }: { messages: string[], speed?: number, delay?: number }) {
  const [index, setIndex] = React.useState(0)
  const [text, setText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    const currentMessage = messages[index]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentMessage.substring(0, text.length + 1))
        if (text.length + 1 === currentMessage.length) {
          setTimeout(() => setIsDeleting(true), delay)
        }
      } else {
        setText(currentMessage.substring(0, text.length - 1))
        if (text.length === 0) {
          setIsDeleting(false)
          setIndex((prev) => (prev + 1) % messages.length)
        }
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, messages, speed, delay])

  return (
    <span className="border-r-4 border-accent pr-2 animate-blink">
      {text}
    </span>
  )
}

export function Hero() {
  const [currentImage, setCurrentImage] = React.useState(0)
  const heroImages = [PlaceHolderImages[0], PlaceHolderImages[1], PlaceHolderImages[5]]

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center py-12">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20 animate-pulse">
            <Sparkles className="h-4 w-4" /> Available for Hire
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black leading-tight font-headline tracking-tighter">
              I am <span className="text-primary block lg:inline decoration-accent underline-offset-[12px] underline">Baraka Junior</span>
            </h1>
            <div className="h-16 flex items-center justify-center lg:justify-start">
              <p className="text-2xl md:text-4xl text-muted-foreground font-headline font-medium">
                <TypewriterText messages={mainMessages} />
              </p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            A results-driven Software Engineer and System Analyst specializing in robust backend architectures and dynamic, high-performance web experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pt-6 justify-center lg:justify-start">
            <Button size="lg" className="rounded-full shadow-2xl group px-10 py-8 text-xl font-bold bg-primary hover:scale-105 transition-transform" asChild>
              <Link href="/#projects">
                View Portfolio
                <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 py-8 text-xl font-bold border-2 hover:bg-secondary/50 transition-all" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>

        {/* Right Side Slideshow */}
        <div className="relative group perspective-1000">
          <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl group-hover:bg-primary/30 transition-all duration-1000" />
          <div className="relative aspect-[4/5] md:aspect-square w-full max-w-2xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-8 border-background/50 backdrop-blur-sm group-hover:rotate-1 transition-transform duration-1000">
            {heroImages.map((img, idx) => (
              <div
                key={img.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                  currentImage === idx ? "opacity-100 scale-100" : "opacity-0 scale-110"
                )}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.description}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  data-ai-hint={img.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
            ))}
            <div className="absolute bottom-10 left-10 right-10 bg-background/20 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-widest opacity-80">Featured Visual</span>
              </div>
              <p className="mt-2 text-lg font-headline font-bold drop-shadow-lg">
                <TypewriterText 
                  messages={heroImages.map(img => img.description)} 
                  speed={100} 
                  delay={3000}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
