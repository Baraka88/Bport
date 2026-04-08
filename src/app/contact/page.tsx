"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, MapPin, Github, Linkedin, Instagram, Loader2, Send } from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!db) return
    setIsPending(true)

    try {
      await addDoc(collection(db, "inquiries_hire_me"), {
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        message: formData.message,
        status: "new",
        submissionDate: new Date().toISOString(),
        isSpam: false,
        createdAt: serverTimestamp()
      })
      
      toast({ title: "Inquiry Sent", description: "I'll get back to you shortly!" })
      setFormData({ name: "", email: "", phone: "", message: "", service: "" })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not send inquiry." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Let's <span className="text-primary">Connect</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you have a specific project in mind or just want to discuss potential collaborations, I'm all ears.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-3xl">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase">Email</p>
                <p className="text-lg font-bold">barakaruzibiza680@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-3xl">
              <div className="w-14 h-14 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase">WhatsApp</p>
                <p className="text-lg font-bold">0732786495</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-3xl">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase">Location</p>
                <p className="text-lg font-bold">Kigali, Rwanda</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14" asChild>
              <a href="https://github.com/baraka88" target="_blank"><Github className="h-6 w-6" /></a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14" asChild>
              <a href="https://linkedin.com/in/baraka-junior" target="_blank"><Linkedin className="h-6 w-6" /></a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14" asChild>
              <a href="https://instagram.com/barakaruzibiza680" target="_blank"><Instagram className="h-6 w-6" /></a>
            </Button>
          </div>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-3xl font-bold font-headline">Hire Me</CardTitle>
            <CardDescription>Tell me about your project and business goals</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    required 
                    className="rounded-xl h-12" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    required 
                    className="rounded-xl h-12" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  className="rounded-xl h-12" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Details</Label>
                <Textarea 
                  required 
                  className="rounded-xl min-h-[150px]" 
                  placeholder="What can I build for you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Send Inquiry</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
