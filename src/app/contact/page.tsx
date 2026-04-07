"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react"
import React from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Simulated submission logic
    toast({
      title: "Inquiry Sent!",
      description: "Thank you for reaching out. I'll get back to you within 24 hours.",
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Thank You for <span className="text-primary">Getting in Touch!</span></h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Your inquiry has been received. A confirmation email has been sent to your inbox.
        </p>
        <Button onClick={() => setSubmitted(false)} size="lg" className="rounded-full">Send Another Message</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Let's <span className="text-primary">Connect</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, a project idea, or just want to say hello? I'm always open to discussing new opportunities and challenges.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-primary/5 rounded-2xl"><Mail className="h-6 w-6 text-primary" /></div>
              <div>
                <h4 className="font-bold">Email</h4>
                <p className="text-muted-foreground">barakaruzibiza680@gmail.com</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-primary/5 rounded-2xl"><Phone className="h-6 w-6 text-primary" /></div>
              <div>
                <h4 className="font-bold">Phone</h4>
                <p className="text-muted-foreground">0732786495</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-primary/5 rounded-2xl"><MapPin className="h-6 w-6 text-primary" /></div>
              <div>
                <h4 className="font-bold">Location</h4>
                <p className="text-muted-foreground">Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="rounded-[2rem] shadow-2xl border-none p-4 sm:p-8">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-headline">Send a Detailed Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">Desired Service</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-dev">Web Development</SelectItem>
                        <SelectItem value="sys-analysis">System Analysis</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="How urgent?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Next few months)</SelectItem>
                        <SelectItem value="medium">Medium (Few weeks)</SelectItem>
                        <SelectItem value="high">High (ASAP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Input id="budget" placeholder="e.g. $2000 - $5000" className="rounded-xl h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message & Details</Label>
                  <Textarea id="message" placeholder="Tell me more about your project goals..." required className="rounded-xl min-h-[150px] p-4" />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-xl py-6 text-lg font-bold shadow-xl">
                  Send Inquiry <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
