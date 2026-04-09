
"use client"

import React, { useState } from "react"
import { PROJECTS } from "@/app/data/portfolio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  MessageCircle, 
  Send, 
  Loader2, 
  Reply 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Comment {
  id: string;
  authorName: string;
  commentText: string;
  projectId: string;
  parentId?: string;
  submissionDate: string;
}

export default function ProjectPage() {
  const params = useParams()
  const id = params?.id as string
  const project = PROJECTS.find((p) => p.id === id)
  const db = useFirestore()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [isPending, setIsPending] = useState(false)

  const commentsQuery = useMemoFirebase(() => {
    if (!db || !id) return null
    return query(
      collection(db, "comments"), 
      where("projectId", "==", id), 
      orderBy("submissionDate", "asc")
    )
  }, [db, id])

  const { data: allComments, isLoading: commentsLoading } = useCollection<Comment>(commentsQuery)

  if (!project) notFound()

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!db || !commentText.trim() || !name.trim()) return
    setIsPending(true)

    const newComment = {
      authorName: name,
      commentText: commentText,
      projectId: id,
      parentId: replyTo?.id || null,
      submissionDate: new Date().toISOString(),
      createdAt: serverTimestamp()
    }

    try {
      await addDoc(collection(db, "comments"), newComment)

      await fetch("https://formspree.io/f/mlgoveej", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Comment on Project: ${project.title}`,
          author: name,
          comment: commentText,
          project: project.title,
          timestamp: new Date().toLocaleString()
        })
      })

      toast({ title: "Comment Posted", description: "Your feedback is live!" })
      setCommentText("")
      setName("")
      setReplyTo(null)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to post comment." })
    } finally {
      setIsPending(false)
    }
  }

  const renderComments = (parentId: string | null = null) => {
    if (!allComments) return null
    return allComments
      .filter(c => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className={cn("space-y-4", parentId && "ml-8 mt-4 pl-4 border-l-2 border-primary/10")}>
          <div className="p-6 bg-secondary/10 rounded-2xl group transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-primary">{c.authorName}</h4>
                <span className="text-xs text-muted-foreground">{new Date(c.submissionDate).toLocaleString()}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                setReplyTo(c)
                document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                <Reply className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground leading-relaxed">{c.commentText}</p>
          </div>
          {renderComments(c.id)}
        </div>
      ))
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
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">{project.title}</h1>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Badge key={t} className="bg-primary/10 text-primary">{t}</Badge>
                ))}
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">{project.longDescription}</p>
            </div>
          </div>

          <div id="comment-form" className="space-y-8 scroll-mt-24">
            <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Project Discussion
            </h2>
            
            <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  {replyTo ? `Replying to ${replyTo.authorName}` : "Share your thoughts"}
                  {replyTo && (
                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>Cancel</Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostComment} className="space-y-4">
                  <Input 
                    placeholder="Your Name*" 
                    required
                    className="rounded-xl h-12" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea 
                    placeholder={replyTo ? "Write your reply..." : "Leave a comment..."} 
                    required 
                    className="rounded-xl min-h-[120px]" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Post Comment</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8 pt-6">
              {commentsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
              ) : allComments && allComments.length > 0 ? (
                renderComments(null)
              ) : (
                <div className="text-center py-20 opacity-40">
                  <p className="text-xl font-bold font-headline">No comments yet</p>
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
                  <span className="text-muted-foreground font-medium">Type</span>
                  <span className="font-bold">Full Stack</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Developer</span>
                  <span className="font-bold">Baraka R. Junior</span>
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
        </div>
      </div>
    </div>
  )
}
