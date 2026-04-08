"use client"

import React, { useState } from "react"
import { PROJECTS } from "@/app/data/portfolio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ExternalLink, Github, Sparkles, MessageCircle, Send, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function ProjectPage() {
  const params = useParams()
  const id = params?.id as string
  const project = PROJECTS.find((p) => p.id === id)
  const db = useFirestore()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [isPending, setIsPending] = useState(false)

  const commentsQuery = useMemoFirebase(() => {
    if (!db || !id) return null
    return query(collection(db, "comments"), where("projectId", "==", id), where("isApproved", "==", true), orderBy("submissionDate", "desc"))
  }, [db, id])

  const { data: comments, isLoading: commentsLoading } = useCollection(commentsQuery)

  if (!project) notFound()

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!db || !name.trim() || !comment.trim()) return
    setIsPending(true)

    try {
      await addDoc(collection(db, "comments"), {
        authorName: name,
        commentText: comment,
        projectId: id,
        isApproved: false,
        isSpam: false,
        submissionDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      })
      toast({ title: "Comment Submitted", description: "Your comment will appear after review." })
      setName("")
      setComment("")
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to post comment." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">{project.title}</h1>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Badge key={t} className="bg-primary/10 text-primary hover:bg-primary/20">
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.longDescription}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Community Feedback
            </h2>
            
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Leave a Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostComment} className="space-y-4">
                  <Input 
                    placeholder="Your Name" 
                    required 
                    className="rounded-xl h-12" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea 
                    placeholder="Share your thoughts..." 
                    required 
                    className="rounded-xl min-h-[100px]" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Post Comment</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {commentsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : comments && comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="p-6 bg-secondary/20 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{c.authorName}</h4>
                      <span className="text-xs text-muted-foreground">{new Date(c.submissionDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{c.commentText}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-40">
                  <p>No comments yet. Be the first to start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl shadow-xl border-none">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold">Project Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Platform</span>
                  <span className="font-bold">Web App</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Year</span>
                  <span className="font-bold">2023</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button className="w-full rounded-xl h-14" size="lg">
                  <ExternalLink className="mr-2 h-5 w-5" /> Live Demo
                </Button>
                <Button variant="outline" className="w-full rounded-xl h-14" size="lg">
                  <Github className="mr-2 h-5 w-5" /> Source Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-3xl bg-primary text-primary-foreground space-y-6 shadow-xl">
            <h3 className="text-xl font-bold">Interested in similar results?</h3>
            <p className="opacity-90">Let's discuss how we can implement high-performance solutions for your specific business needs.</p>
            <Button variant="secondary" className="w-full h-14 text-primary font-bold rounded-xl" asChild>
              <Link href="/contact">Hire Me Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
