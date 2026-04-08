"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import React from "react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Let's <span className="text-primary">Connect</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            I'm currently available for freelance work, collaboration, or full-time opportunities. Reach out via the channels below and I'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <Mail className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-muted-foreground">Direct professional inquiries</p>
              <p className="text-primary font-bold">barakaruzibiza680@gmail.com</p>
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

        <div className="p-12 rounded-[3rem] bg-secondary/30 text-center space-y-6">
          <h2 className="text-2xl font-bold font-headline">Interested in a project?</h2>
          <p className="text-lg text-muted-foreground">
            If you're looking for professional web development or system analysis services, 
            the most efficient way to get started is by sending an email with your project requirements.
          </p>
        </div>
      </div>
    </div>
  )
}