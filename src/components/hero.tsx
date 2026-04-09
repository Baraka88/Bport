
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"

const mainMessages = [
  "Full Stack Developer",
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
  const profileImg = PlaceHolderImages.find(img => img.id === 'profile-portrait');

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20 animate-pulse">
              <Sparkles className="h-4 w-4" /> Available for Hire
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-8xl font-black leading-tight font-headline tracking-tighter">
                I am <span className="text-primary decoration-accent underline-offset-[12px] underline">Baraka Ruzibiza Junior</span>
              </h1>
              <div className="h-20 flex items-center justify-center lg:justify-start">
                <p className="text-2xl md:text-4xl text-muted-foreground font-headline font-medium">
                  <TypewriterText messages={mainMessages} />
                </p>
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A results-driven Full Stack Developer and System Analyst specializing in robust backend architectures and dynamic, high-performance web experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-10 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full shadow-2xl group px-8 py-8 text-xl font-bold bg-primary hover:scale-105 transition-transform" asChild>
                <Link href="/#projects">
                  View Portfolio
                  <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 py-8 text-xl font-bold border-2 hover:bg-secondary/50 transition-all" asChild>
                <a href="https://wa.me/250732786495" target="_blank">
                  <MessageCircle className="mr-2 h-6 w-6" /> WhatsApp Me
                </a>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-primary/20 rounded-[4rem] rotate-6 scale-95 blur-2xl" />
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-card bg-secondary/20">
              {profileImg && (
                <Image 
                  src={profileImg.imageUrl} 
                  alt={profileImg.description} 
                  fill 
                  className="object-cover"
                  priority
                  data-ai-hint={profileImg.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </section>
  )
}
