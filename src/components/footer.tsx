
"use client"

import { Github, Linkedin, Instagram, Phone, Mail, Facebook, ShieldCheck, Lock, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import React from "react"

export function Footer() {
  const [showEmail, setShowEmail] = React.useState(false)
  const emailUser = "barakaruzibiza680"
  const emailDomain = "gmail.com"

  return (
    <footer className="bg-card border-t py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-16">
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="font-headline text-3xl font-black text-primary tracking-tighter">BRJ<span className="text-accent">DEV</span></Link>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Precision-engineered Full Stack solutions and scalable architectures. Kigali, Rwanda.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/baraka88" target="_blank" className="p-3 bg-secondary rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"><Github className="h-5 w-5" /></a>
              <a href="https://linkedin.com/in/baraka-junior" target="_blank" className="p-3 bg-secondary rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"><Linkedin className="h-5 w-5" /></a>
              <a href="https://www.facebook.com/profile.php?id=100076696350011" target="_blank" className="p-3 bg-secondary rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"><Facebook className="h-5 w-5" /></a>
              <a href="https://instagram.com/barakaruzibiza680" target="_blank" className="p-3 bg-secondary rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">Platform</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/#projects" className="hover:text-primary transition-colors">Digital Portfolio</Link></li>
              <li><Link href="/comments" className="hover:text-primary transition-colors">Community Wall</Link></li>
              <li><Link href="/motivation" className="hover:text-primary transition-colors">Daily Fuel</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Visual Showcase</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">Master Dashboard</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors text-accent">
                  <Briefcase className="h-3 w-3" /> Project Locker
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors text-accent">
                  <MessageSquare className="h-3 w-3" /> Comments Locker
                </Link>
              </li>
              <li>
                <Link href="/collab" className="hover:text-primary transition-colors">Partner Inquiry</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">Direct Access</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-center gap-2 text-primary">
                <Mail className="h-4 w-4" /> 
                {showEmail ? (
                  <a href={`mailto:${emailUser}@${emailDomain}`} className="hover:underline">
                    {emailUser}@{emailDomain}
                  </a>
                ) : (
                  <span className="cursor-pointer hover:underline" onClick={() => setShowEmail(true)}>Reveal Email</span>
                )}
              </li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0732786495</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Available for Hire</li>
              <li className="pt-4">
                <a href="https://wa.me/250732786495" target="_blank" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:scale-105 transition-all inline-block shadow-lg shadow-primary/20">WhatsApp Now</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
          <p>© {new Date().getFullYear()} BRJDEV. All Rights Reserved.</p>
          <p>Architected by Baraka Junior</p>
        </div>
      </div>
    </footer>
  )
}
