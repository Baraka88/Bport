
"use client"

import { Github, Linkedin, Instagram, Phone, Mail } from "lucide-react"
import Link from "next/link"
import React from "react"

export function Footer() {
  const [showEmail, setShowEmail] = React.useState(false)
  const emailUser = "barakaruzibiza680"
  const emailDomain = "gmail.com"

  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">BRJ<span className="text-accent">DEV</span></Link>
            <p className="text-muted-foreground max-w-sm">
              Full Stack solutions and high-performance system architectures. Kigali, Rwanda.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/baraka88" target="_blank" className="p-2 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all"><Github className="h-5 w-5" /></a>
              <a href="https://linkedin.com/in/baraka-junior" target="_blank" className="p-2 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all"><Linkedin className="h-5 w-5" /></a>
              <a href="https://instagram.com/barakaruzibiza680" target="_blank" className="p-2 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/chat" className="hover:text-primary transition-colors">ChatBRJ AI</Link></li>
              <li><Link href="/comments" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="/collab" className="hover:text-primary transition-colors">Collaboration</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Hire Me</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2 font-bold text-primary">
                <Mail className="h-4 w-4" /> 
                {showEmail ? (
                  <a href={`mailto:${emailUser}@${emailDomain}`} className="hover:underline">
                    {emailUser}@{emailDomain}
                  </a>
                ) : (
                  <span 
                    className="cursor-pointer hover:underline text-xs" 
                    onClick={() => setShowEmail(true)}
                  >
                    Click to reveal email
                  </span>
                )}
              </li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0732786495</li>
              <li>Kigali, Rwanda</li>
              <li className="pt-2">
                <a href="https://wa.me/250732786495" target="_blank" className="text-accent font-bold hover:underline">WhatsApp Now</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BRJDEV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
