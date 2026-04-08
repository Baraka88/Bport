
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
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { 
  Mail, 
  MessageSquare, 
  Loader2, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Wallet,
  Zap
} from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"

const SERVICES = [
  "Web Development",
  "System Analysis",
  "AI Integration",
  "Database Management",
  "Mobile Apps",
  "Consulting"
]

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
    urgency: "medium"
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
    const fields = [
      formData.name, 
      formData.email, 
      formData.message, 
      formData.budget, 
      formData.timeline,
      formData.services.length > 0 ? "services" : ""
    ]
    const filled = fields.filter(f => f.length > 0).length
    return (filled / fields.length) * 100
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!db) return

    // Rate limiting check (client side best effort)
    const lastSubmit = localStorage.getItem("last_hire_submit")
    if (lastSubmit) {
      const timeDiff = Date.now() - parseInt(lastSubmit)
      if (timeDiff < 3600000 / 3) { // Simple throttle
         toast({ variant: "destructive", title: "Wait a moment", description: "You are submitting too fast. Please wait a while." })
         return
      }
    }

    if (parseInt(userAnswer) !== captcha.a) {
      toast({ variant: "destructive", title: "Verification Failed", description: "Incorrect answer to the security question." })
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
        status: "new",
        submissionDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      }

      // 1. Store in Firebase
      await addDoc(collection(db, "inquiries_hire_me"), inquiryData)

      // 2. Send to Formspree
      await fetch("https://formspree.io/f/mlgoveej", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...inquiryData, 
          _subject: `New Hire Inquiry from ${formData.name}`,
          _replyto: formData.email
        })
      })
      
      localStorage.setItem("last_hire_submit", Date.now().toString())
      localStorage.removeItem("hire_me_draft")
      router.push("/thank-you")
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong. Please try again." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12 lg:sticky lg:top-32">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Let's <span className="text-primary">Collaborate</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform your ideas into high-performance digital reality. Check out my work while you fill out the details.
            </p>
          </div>

          <div className="rounded-[2rem] overflow-hidden shadow-2xl border bg-card">
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {PlaceHolderImages.slice(0, 4).map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <Image 
                        src={img.imageUrl} 
                        alt={img.description} 
                        fill 
                        className="object-cover"
                        data-ai-hint={img.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <p className="text-white font-medium">{img.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </div>
            </Carousel>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-3xl">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Direct Email</p>
                <p className="text-lg font-bold">barakaruzibiza680@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-3xl">
              <div className="w-14 h-14 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">WhatsApp</p>
                <p className="text-lg font-bold">0732786495</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-10 pb-0">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold font-headline">Hire Me</CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <CheckCircle2 className="h-3 w-3" /> {Math.round(calculateProgress())}% Ready
                </div>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Full Name*</Label>
                  <Input 
                    required 
                    placeholder="Jane Doe"
                    className="rounded-xl h-12 bg-background/50" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Email Address*</Label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="jane@example.com"
                    className="rounded-xl h-12 bg-background/50" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Required Services
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-2 bg-background/30 p-3 rounded-xl border border-transparent hover:border-primary/20 transition-all">
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
                      <label htmlFor={service} className="text-sm font-medium leading-none cursor-pointer select-none">{service}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" /> Budget Range
                  </Label>
                  <Input 
                    placeholder="e.g., $1000 - $5000"
                    className="rounded-xl h-12 bg-background/50" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Expected Timeline
                  </Label>
                  <Input 
                    placeholder="e.g., 4 weeks"
                    className="rounded-xl h-12 bg-background/50" 
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold">Project Urgency</Label>
                <RadioGroup 
                  value={formData.urgency} 
                  onValueChange={(v) => setFormData({...formData, urgency: v})}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="cursor-pointer">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="cursor-pointer">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">Project Details*</Label>
                <Textarea 
                  required 
                  className="rounded-xl min-h-[140px] bg-background/50" 
                  placeholder="Tell me about your vision, goals, and specific requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="space-y-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <Label className="flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-primary" /> Security Verification</Label>
                <div className="flex items-center gap-6">
                  <p className="font-bold text-xl font-headline">{captcha.q}</p>
                  <Input 
                    type="number"
                    required
                    placeholder="?"
                    className="w-28 h-12 rounded-xl text-center text-lg font-bold"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Send Project Proposal</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
