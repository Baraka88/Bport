"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"
import Image from "next/image"
import React from "react"
import { Github, Linkedin, Instagram, Users, Rocket } from "lucide-react"

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
            <h3 className="text-xl font-bold">Connect on Socials</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="rounded-full gap-2 border-primary text-primary hover:bg-primary hover:text-white" asChild>
                <a href="https://github.com/baraka88"><Github className="h-4 w-4" /> GitHub</a>
              </Button>
              <Button variant="outline" className="rounded-full gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                <a href="https://linkedin.com/in/baraka-junior"><Linkedin className="h-4 w-4" /> LinkedIn</a>
              </Button>
              <Button variant="outline" className="rounded-full gap-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white" asChild>
                <a href="https://instagram.com/barakajunior72"><Instagram className="h-4 w-4" /> Instagram</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative group">
            <Image
              src={PlaceHolderImages[5].imageUrl}
              alt="Collaboration"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-lg font-bold">"Great things in business are never done by one person."</p>
              <p className="text-sm opacity-80 mt-2">— Steve Jobs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden">
          <div className="bg-primary p-8 text-primary-foreground">
            <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
              <Rocket className="h-8 w-8 text-accent" /> Collaborate with Me
            </h2>
          </div>
          <CardContent className="p-8 sm:p-12 space-y-8">
            <form className="grid gap-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="Your Name" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Role/Expertise</Label>
                  <Input placeholder="e.g. Frontend Dev, UI Designer" className="rounded-xl h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Project Idea / Collaboration Scope</Label>
                <Textarea placeholder="Describe the project or how we could work together..." className="rounded-xl min-h-[150px]" />
              </div>

              <div className="space-y-2">
                <Label>Attach Project Docs (Optional)</Label>
                <Input type="file" className="rounded-xl h-auto py-2" />
              </div>

              <Button size="lg" className="w-full rounded-xl py-8 text-xl font-bold">Submit Collaboration Inquiry</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}