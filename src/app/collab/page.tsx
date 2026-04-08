"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { Rocket, Loader2, Send, ShieldCheck, CheckCircle2, Users } from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"

export default function CollabPage() {
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
    idea: "",
    scope: "",
    timeline: ""
  })

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    setCaptcha({ q: `What is ${num1} + ${num2}?`, a: num1 + num2 })

    const draft = localStorage.getItem("collab_draft")
    if (draft) setFormData(JSON.parse(draft))
  }, [])

  useEffect(() => {
    localStorage.setItem("collab_draft", JSON.stringify(formData))
  }, [formData])

  const calculateProgress = () => {
    const fields = [formData.name, formData.email, formData.idea]
    const filled = fields.filter(f => f.length > 0).length
    return (filled / fields.length) * 100
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!db) return

    if (parseInt(userAnswer) !== captcha.a) {
      toast({ variant: "destructive", title: "Spam Check", description: "Incorrect math answer." })
      return
    }

    setIsPending(true)

    try {
      const collabData = {
        collaboratorName: formData.name,
        collaboratorEmail: formData.email,
        collaboratorPhone: formData.phone,
        projectIdea: formData.idea,
        projectScope: formData.scope,
        estimatedTimeline: formData.timeline,
        status: "new",
        submissionDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, "inquiries_collaboration"), collabData)

      await fetch("https://formspree.io/f/mlgoveej", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...collabData, subject: "New Collab Proposal - BRJDEV" })
      })
      
      localStorage.removeItem("collab_draft")
      router.push("/thank-you")
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Submission failed." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12 lg:sticky lg:top-32">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Build the Future <span className="text-primary">Together</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Let's combine our expertise to create extraordinary digital experiences. Share your vision and let's make it a reality.
            </p>
          </div>

          <div className="rounded-[2rem] overflow-hidden shadow-2xl border bg-card">
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {PlaceHolderImages.filter(img => img.id.includes('collab') || img.id.includes('hero')).map((img, index) => (
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
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Partnerships</p>
                <p className="text-lg font-bold">Open for Collaboration</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-10 pb-0 bg-primary text-primary-foreground">
            <Rocket className="h-12 w-12 mb-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold font-headline">Collaboration Proposal</CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                  <CheckCircle2 className="h-3 w-3" /> {Math.round(calculateProgress())}% Ready
                </div>
              </div>
              <Progress value={calculateProgress()} className="h-2 bg-white/20" />
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Collaborator Name*</Label>
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
              <div className="space-y-2">
                <Label>Project Idea*</Label>
                <Textarea 
                  required 
                  className="rounded-xl min-h-[120px]" 
                  placeholder="Describe your vision..."
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Proposed Scope & Timeline</Label>
                <Input 
                  className="rounded-xl h-12" 
                  placeholder="e.g., MVP in 3 months"
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                />
              </div>

              <div className="space-y-2 p-6 bg-secondary/20 rounded-2xl border border-primary/10">
                <Label className="flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-primary" /> Anti-Spam Verification</Label>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-lg">{captcha.q}</p>
                  <Input 
                    type="number"
                    required
                    className="w-24 h-12 rounded-xl text-center font-bold"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Propose Collaboration</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
