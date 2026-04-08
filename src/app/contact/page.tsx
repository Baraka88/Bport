
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Mail, MessageSquare, MapPin, Loader2, Send, ShieldCheck, AlertCircle } from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const SERVICES = [
  "Web Development",
  "System Analysis",
  "AI Integration",
  "Database Management",
  "Mobile Apps",
  "Consulting"
]

const SPAM_KEYWORDS = ["casino", "viagra", "poker", "lottery", "crypto"]

export default function ContactPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [captcha, setCaptcha] = useState({ q: "", a: 0 })
  const [userAnswer, setUserAnswer] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    services: [] as string[],
    budget: "",
    timeline: "",
    urgency: "medium",
    cvUrl: ""
  })

  // Math CAPTCHA Generation
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    setCaptcha({ q: `What is ${num1} + ${num2}?`, a: num1 + num2 })
  }, [])

  // LocalStorage Draft Saving
  useEffect(() => {
    const draft = localStorage.getItem("hire_me_draft")
    if (draft) setFormData(JSON.parse(draft))
  }, [])

  useEffect(() => {
    localStorage.setItem("hire_me_draft", JSON.stringify(formData))
  }, [formData])

  const calculateProgress = () => {
    const fields = [formData.name, formData.email, formData.message, formData.budget]
    const filled = fields.filter(f => f.length > 0).length
    return (filled / fields.length) * 100
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!db) return

    // Validation
    if (parseInt(userAnswer) !== captcha.a) {
      toast({ variant: "destructive", title: "Spam Check Failed", description: "Incorrect math answer." })
      return
    }

    if (formData.message.length < 20) {
      toast({ variant: "destructive", title: "Validation Error", description: "Message is too short (min 20 chars)." })
      return
    }

    const hasSpam = SPAM_KEYWORDS.some(k => formData.message.toLowerCase().includes(k))
    if (hasSpam) {
      toast({ variant: "destructive", title: "Blocked", description: "Your message contains prohibited keywords." })
      return
    }

    setIsPending(true)

    try {
      const inquiryData = {
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        message: formData.message,
        serviceIds: formData.services,
        budget: formData.budget,
        timeline: formData.timeline,
        urgency: formData.urgency,
        cvPortfolioUrl: formData.cvUrl,
        status: "new",
        submissionDate: new Date().toISOString(),
        isSpam: false,
        createdAt: serverTimestamp()
      }

      // 1. Store in Firebase
      await addDoc(collection(db, "inquiries_hire_me"), inquiryData)

      // 2. Send to Formspree (Email Notification)
      await fetch("https://formspree.io/f/mlgoveej", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inquiryData, subject: "New Hire Inquiry - BRJDEV" })
      })
      
      localStorage.removeItem("hire_me_draft")
      router.push("/thank-you")
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not send inquiry. Please try again." })
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
              Ready to build something amazing? Fill out the form or reach out directly.
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
          </div>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold font-headline">Hire Me</CardTitle>
                <span className="text-xs font-bold text-muted-foreground">{Math.round(calculateProgress())}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name*</Label>
                  <Input 
                    required 
                    className="rounded-xl h-12" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address*</Label>
                  <Input 
                    type="email" 
                    required 
                    className="rounded-xl h-12" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Required Services</Label>
                <div className="grid grid-cols-2 gap-4">
                  {SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox 
                        id={service} 
                        checked={formData.services.includes(service)}
                        onCheckedChange={(checked) => {
                          const newServices = checked 
                            ? [...formData.services, service]
                            : formData.services.filter(s => s !== service)
                          setFormData({...formData, services: newServices})
                        }}
                      />
                      <label htmlFor={service} className="text-sm font-medium leading-none cursor-pointer">{service}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Estimated Budget</Label>
                  <Input 
                    placeholder="e.g., $1000 - $5000"
                    className="rounded-xl h-12" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Timeline</Label>
                  <Input 
                    placeholder="e.g., 1 month"
                    className="rounded-xl h-12" 
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <RadioGroup 
                  value={formData.urgency} 
                  onValueChange={(v) => setFormData({...formData, urgency: v})}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Project Details* (Min 20 chars)</Label>
                <Textarea 
                  required 
                  className="rounded-xl min-h-[120px]" 
                  placeholder="Describe your goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="space-y-2 p-6 bg-secondary/20 rounded-2xl border border-primary/10">
                <Label className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Anti-Spam Challenge</Label>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-lg">{captcha.q}</p>
                  <Input 
                    type="number"
                    className="w-24 h-12 rounded-xl"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Submit Inquiry</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
