"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import React from "react"
import { Users, Rocket, Mail, MessageCircle } from "lucide-react"

export default function CollabPage() {
  const profileImg = "https://storage.googleapis.com/fetch-user-images-bucket/c5956041-073c-448c-9a4c-83b4009b7ebf.png";

  return (
    <div className="container mx-auto px-4 py-20 space-y-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full font-bold text-sm">
            <Users className="h-4 w-4" /> Open for Collaboration
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">Build the <span className="text-primary">Future</span> Together</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            I'm always looking for talented developers and designers to collaborate on innovative ventures and scalable systems.
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
                <MessageCircle className="text-accent h-6 w-6" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground">WhatsApp</p>
                  <p className="font-bold">0732786495</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative group">
            <Image
              src={profileImg}
              alt="Baraka Junior Profile"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-lg font-bold">"Collaboration is the key to creating impactful technology."</p>
              <p className="text-sm opacity-80 mt-2">— BRJDEV</p>
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
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" className="rounded-full px-12 py-8 text-xl font-bold" asChild>
            <a href="mailto:barakaruzibiza680@gmail.com">Send an Email</a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-12 py-8 text-xl font-bold bg-white/10 hover:bg-white/20 border-white/20" asChild>
            <a href="https://wa.me/250732786495" target="_blank">Chat on WhatsApp</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
