"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu, X, Layout, User, Code, Briefcase, Mail, Image as ImageIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Layout },
  { name: "Projects", href: "/#projects", icon: Briefcase },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Collab", href: "/collab", icon: Code },
  { name: "Contact", href: "/contact", icon: Mail },
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-2xl font-bold text-primary">ProFolio<span className="text-accent">Studio</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-lg font-medium py-2 border-b"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}