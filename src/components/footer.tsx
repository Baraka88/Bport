import { Github, Linkedin, Instagram, Mail, Phone, Lock } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">ProFolio<span className="text-accent">Studio</span></Link>
            <p className="text-muted-foreground max-w-sm">
              Helping businesses build reliable systems and engaging digital experiences with modern web technologies.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/baraka88" className="p-2 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all"><Github className="h-5 w-5" /></a>
              <a href="https://linkedin.com/in/baraka-junior" className="p-2 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all"><Linkedin className="h-5 w-5" /></a>
              <a href="https://instagram.com/barakajunior72" className="p-2 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/collab" className="hover:text-primary transition-colors">Collaborate</Link></li>
              <li><Link href="/#projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/chat" className="hover:text-primary transition-colors">ChatBRJ AI</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> barakaruzibiza680@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0732786495</li>
              <li>Kigali, Rwanda</li>
              <li className="pt-2">
                <Link href="/contact" className="text-accent font-bold hover:underline">Hire Me Now</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ProFolio Studio. All rights reserved. Created by Baraka Junior.</p>
          <Link href="/admin" className="p-2 hover:text-primary transition-colors" title="Admin Locker">
            <Lock className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
