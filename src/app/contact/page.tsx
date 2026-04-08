"use client"

import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Instagram, Linkedin, Github, MessageSquare } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Let's <span className="text-primary">Connect</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            I'm currently available for professional opportunities and innovative ventures. Reach out directly via the channels below for a prompt response.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <Mail className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-muted-foreground text-sm">Professional Inquiries</p>
              <Button variant="link" className="text-primary font-bold p-0 h-auto" onClick={() => window.location.href = 'mailto:barakaruzibiza680@gmail.com'}>
                Click to Email
              </Button>
            </div>
          </Card>

          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto text-accent">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">Voice & Text</p>
              <p className="text-accent font-bold">0732786495</p>
            </div>
          </Card>

          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Location</h3>
              <p className="text-muted-foreground text-sm">Based in</p>
              <p className="text-primary font-bold">Kigali, Rwanda</p>
            </div>
          </Card>
        </div>

        <div className="p-12 rounded-[3rem] bg-secondary/30 text-center space-y-8">
          <h2 className="text-3xl font-bold font-headline text-primary">Connect on Social</h2>
          <div className="flex justify-center gap-6">
            <Button variant="outline" className="rounded-full h-14 w-14 p-0 border-primary/20 hover:bg-primary hover:text-white" asChild>
              <a href="https://github.com/baraka88" target="_blank" rel="noopener noreferrer"><Github className="h-6 w-6" /></a>
            </Button>
            <Button variant="outline" className="rounded-full h-14 w-14 p-0 border-primary/20 hover:bg-primary hover:text-white" asChild>
              <a href="https://linkedin.com/in/baraka-junior" target="_blank" rel="noopener noreferrer"><Linkedin className="h-6 w-6" /></a>
            </Button>
            <Button variant="outline" className="rounded-full h-14 w-14 p-0 border-primary/20 hover:bg-primary hover:text-white" asChild>
              <a href="https://instagram.com/barakaruzibiza680" target="_blank" rel="noopener noreferrer"><Instagram className="h-6 w-6" /></a>
            </Button>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            I am most responsive via direct messaging. Feel free to reach out anytime!
          </p>
        </div>
      </div>
    </div>
  )
}