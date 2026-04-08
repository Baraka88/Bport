"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Rocket, Users, Loader2, Send } from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function CollabPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idea: "",
    scope: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!db) return
    setIsPending(true)

    try {
      await addDoc(collection(db, "inquiries_collaboration"), {
        collaboratorName: formData.name,
        collaboratorEmail: formData.email,
        collaboratorPhone: formData.phone,
        projectIdea: formData.idea,
        projectScope: formData.scope,
        status: "new",
        submissionDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      })
      
      toast({ title: "Collaboration Sent", description: "Let's innovate together!" })
      setFormData({ name: "", email: "", phone: "", idea: "", scope: "" })
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm">
            <Users className="h-4 w-4" /> Open for Partnerships
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Build the Future <span className="text-primary">Together</span></h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            I'm looking for talented developers and designers to collaborate on innovative ventures and scalable systems.
          </p>
        </div>

        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden">
          <CardHeader className="p-10 bg-primary text-primary-foreground text-center">
            <Rocket className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-3xl">Collaboration Proposal</CardTitle>
            <CardDescription className="text-primary-foreground/80">Share your vision and let's see how we can align</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Collaborator Name</Label>
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
                <Label>Project Idea</Label>
                <Textarea 
                  required 
                  className="rounded-xl min-h-[120px]" 
                  placeholder="Describe your project idea..."
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Proposed Scope & Your Role</Label>
                <Textarea 
                  className="rounded-xl h-24" 
                  placeholder="What is your area of expertise?"
                  value={formData.scope}
                  onChange={(e) => setFormData({...formData, scope: e.target.value})}
                />
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
