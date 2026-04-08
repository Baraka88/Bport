"use client"

import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Get in <span className="text-primary">Touch</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            I'm currently available for freelance work, collaboration, or full-time opportunities. Reach out via the channels below and I'll get back to you promptly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <Mail className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-muted-foreground">Professional Inquiries</p>
              <p className="text-primary font-bold break-all">barakaruzibiza680@gmail.com</p>
            </div>
          </Card>

          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto text-accent">
              <Phone className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Phone</h3>
              <p className="text-muted-foreground">Voice & WhatsApp</p>
              <p className="text-accent font-bold">0732786495</p>
            </div>
          </Card>

          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Location</h3>
              <p className="text-muted-foreground">Based in</p>
              <p className="text-primary font-bold">Kigali, Rwanda</p>
            </div>
          </Card>
        </div>

        <div className="p-12 rounded-[3rem] bg-secondary/30 text-center space-y-8">
          <h2 className="text-3xl font-bold font-headline text-primary">Connect on Social</h2>
          <div className="flex justify-center gap-6">
            <Button variant="outline" className="rounded-full h-14 w-14 p-0 border-primary/20 hover:bg-primary hover:text-white" asChild>
              <a href="https://github.com/baraka88" target="_blank"><Github className="h-6 w-6" /></a>
            </Button>
            <Button variant="outline" className="rounded-full h-14 w-14 p-0 border-primary/20 hover:bg-primary hover:text-white" asChild>
              <a href="https://linkedin.com/in/baraka-junior" target="_blank"><Linkedin className="h-6 w-6" /></a>
            </Button>
            <Button variant="outline" className="rounded-full h-14 w-14 p-0 border-primary/20 hover:bg-primary hover:text-white" asChild>
              <a href="https://instagram.com/barakaruzibiza680" target="_blank"><Instagram className="h-6 w-6" /></a>
            </Button>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            I am most responsive via Email or WhatsApp. Feel free to reach out anytime!
          </p>
        </div>
      </div>
    </div>
  )
}