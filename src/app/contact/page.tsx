"use client"

import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, MapPin, Github, Linkedin, Instagram } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Direct <span className="text-primary">Communication</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            I've simplified my contact process to ensure the fastest response. Reach out directly via the channels below for professional inquiries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-card/50 backdrop-blur-sm p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
              <Mail className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Email</h3>
              <p className="text-muted-foreground text-sm">Professional Inquiries</p>
              <p className="text-primary font-bold break-all text-lg">barakaruzibiza680@gmail.com</p>
            </div>
            <Button size="lg" className="w-full rounded-2xl h-14 font-bold" asChild>
              <a href="mailto:barakaruzibiza680@gmail.com">Send Message</a>
            </Button>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-card/50 backdrop-blur-sm p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent">
              <MessageSquare className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">Direct Voice & Text</p>
              <p className="text-accent font-bold text-3xl">0732786495</p>
            </div>
            <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold border-2" asChild>
              <a href="https://wa.me/250732786495" target="_blank">Chat Now</a>
            </Button>
          </Card>
        </div>

        <div className="p-16 rounded-[4rem] bg-secondary/30 text-center space-y-10">
          <h2 className="text-4xl font-black font-headline text-primary">Connect on Social</h2>
          <div className="flex justify-center gap-8">
            <Button variant="outline" className="rounded-full h-16 w-16 p-0 border-primary/20 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg" asChild>
              <a href="https://github.com/baraka88" target="_blank" rel="noopener noreferrer"><Github className="h-8 w-8" /></a>
            </Button>
            <Button variant="outline" className="rounded-full h-16 w-16 p-0 border-primary/20 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg" asChild>
              <a href="https://linkedin.com/in/baraka-junior" target="_blank" rel="noopener noreferrer"><Linkedin className="h-8 w-8" /></a>
            </Button>
            <Button variant="outline" className="rounded-full h-16 w-16 p-0 border-primary/20 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-lg" asChild>
              <a href="https://instagram.com/barakaruzibiza680" target="_blank" rel="noopener noreferrer"><Instagram className="h-8 w-8" /></a>
            </Button>
          </div>
          <p className="text-xl text-muted-foreground font-medium flex items-center justify-center gap-3">
            <MapPin className="h-6 w-6 text-primary" /> Based in Kigali, Rwanda.
          </p>
        </div>
      </div>
    </div>
  )
}