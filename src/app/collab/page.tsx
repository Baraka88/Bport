"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import React from "react"
import { Github, Linkedin, Instagram, Users, Rocket, Mail, Phone } from "lucide-react"

export default function CollabPage() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full font-bold text-sm">
            <Users className="h-4 w-4" /> Open for Collaboration
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">Build the <span className="text-primary">Future</span> Together</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            I'm always looking for talented developers and designers to collaborate on open-source projects or innovative ventures.
          </p>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Direct Channels</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-2xl">
                <Mail className="text-primary h-6 w-6" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground">Email</p>
                  <p className="font-bold">barakaruzibiza680@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-2xl">
                <Phone className="text-accent h-6 w-6" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground">WhatsApp</p>
                  <p className="font-bold">0732786495</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Professional Profiles</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="rounded-full gap-2 border-primary text-primary hover:bg-primary hover:text-white" asChild>
                <a href="https://github.com/baraka88" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /> GitHub</a>
              </Button>
              <Button variant="outline" className="rounded-full gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                <a href="https://linkedin.com/in/baraka-junior" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
              </Button>
              <Button variant="outline" className="rounded-full gap-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white" asChild>
                <a href="https://instagram.com/barakaruzibiza680" target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /> Instagram</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative group">
            <Image
              src="https://picsum.photos/seed/collab/800/1000"
              alt="Collaboration"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              data-ai-hint="team collaboration"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-lg font-bold">"Great things in business are never done by one person."</p>
              <p className="text-sm opacity-80 mt-2">— Steve Jobs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-primary text-primary-foreground text-center space-y-8">
        <Rocket className="h-16 w-16 text-accent mx-auto animate-bounce" />
        <h2 className="text-3xl font-bold font-headline">Let's start something big</h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          If you have a project idea or a partnership proposal, reaching out directly via WhatsApp or Email is the fastest way to get in touch.
        </p>
        <Button size="lg" variant="secondary" className="rounded-full px-12 py-8 text-xl font-bold" asChild>
          <a href="mailto:barakaruzibiza680@gmail.com">Send an Email</a>
        </Button>
      </div>
    </div>
  )
}