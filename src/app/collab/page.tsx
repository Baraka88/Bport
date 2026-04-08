
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Rocket, Users, Loader2, Send, ShieldCheck } from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Build the Future <span className="text-primary">Together</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Innovate with purpose. Let's combine our skills for something extraordinary.
          </p>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden">
          <CardHeader className="p-10 bg-primary text-primary-foreground text-center">
            <Rocket className="h-12 w-12 mx-auto mb-4" />
            <div className="space-y-4">
              <CardTitle className="text-3xl">Collaboration Proposal</CardTitle>
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
                <Label className="flex items-center gap-2 font-bold"><ShieldCheck className="h-4 w-4 text-primary" /> Anti-Spam</Label>
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
                {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Propose Collaboration</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
