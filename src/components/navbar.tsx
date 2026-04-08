
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu, Layout, Briefcase, Users, MessageSquare, Bot } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useUser } from "@/firebase"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Layout },
  { name: "Projects", href: "/#projects", icon: Briefcase },
  { name: "ChatBRJ", href: "/chat", icon: Bot },
  { name: "Community", href: "/comments", icon: MessageSquare },
  { name: "Collab", href: "/collab", icon: Users },
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-2xl font-bold text-primary">BRJ<span className="text-accent">DEV</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(item.href) && item.href !== '/' ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-border mx-2" />
          
          {user ? (
            <Button variant="ghost" size="sm" className="rounded-full font-bold" asChild>
              <Link href="/chat">Hi, {user.displayName || 'Dev'}</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="rounded-full font-bold" asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}

          <Button variant="default" size="sm" className="rounded-full px-6 font-bold" asChild>
            <Link href="/contact">Hire Me</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>

        <div className="flex items-center space-x-2 md:hidden">
          <Button variant="default" size="sm" className="rounded-full h-8 px-4 text-xs" asChild>
            <Link href="/contact">Hire</Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Explore the BRJDEV platform</SheetDescription>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-2 text-lg font-medium py-2 border-b",
                      pathname === item.href && "text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <Link href="/auth" onClick={() => setIsOpen(false)} className="text-lg font-bold text-primary">Sign In</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-bold text-accent">Hire Me</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
