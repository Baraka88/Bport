
"use client"

import React, { useState, useEffect } from "react"
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
  ThumbsUp, 
  Reply, 
  Trash2, 
  LogIn 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useFirestore, useCollection, useMemoFirebase, useUser, useAuth } from "@/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  deleteDoc 
} from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string;
  authorName: string;
  commentText: string;
  projectId: string;
  userId: string;
  parentId?: string;
  likes: string[];
  submissionDate: string;
}

export default function ProjectPage() {
  const params = useParams()
  const id = params?.id as string
  const project = PROJECTS.find((p) => p.id === id)
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
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

  const handleLogin = async () => {
    try {
      await signInAnonymously(auth)
      toast({ title: "Logged In", description: "You can now participate in the discussion." })
    } catch (error) {
      toast({ variant: "destructive", title: "Login Failed", description: "Could not authenticate." })
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!db || !user || !commentText.trim()) return
    setIsPending(true)

    const finalName = user.isAnonymous ? (name || "Anonymous Developer") : (user.displayName || user.email?.split('@')[0] || "User")

    const newComment = {
      authorName: finalName,
      commentText: commentText,
      projectId: id,
      userId: user.uid,
      parentId: replyTo?.id || null,
      likes: [],
      submissionDate: new Date().toISOString(),
      createdAt: serverTimestamp()
    }

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "comments"), newComment)

      // 2. Notify via Formspree
      await fetch("https://formspree.io/f/mlgoveej", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Comment on Project: ${project.title}`,
          author: finalName,
          comment: commentText,
          project: project.title,
          isReply: !!replyTo
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

  async function handleLike(comment: Comment) {
    if (!db || !user) {
      toast({ title: "Login Required", description: "Please sign in to like comments." })
      return
    }
    const commentRef = doc(db, "comments", comment.id)
    const isLiked = comment.likes?.includes(user.uid)
    
    await updateDoc(commentRef, {
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    })
  }

  async function handleDelete(commentId: string) {
    if (!db) return
    try {
      await deleteDoc(doc(db, "comments", commentId))
      toast({ title: "Deleted", description: "Comment removed." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete." })
    }
  }

  const renderComments = (parentId: string | null = null) => {
    if (!allComments) return null
    return allComments
      .filter(c => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className={cn("space-y-4", parentId && "ml-8 mt-4 pl-4 border-l-2 border-primary/10")}>
          <div className="p-6 bg-secondary/20 rounded-2xl group transition-all hover:bg-secondary/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-primary">{c.authorName}</h4>
                <span className="text-xs text-muted-foreground">{new Date(c.submissionDate).toLocaleString()}</span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {user?.uid === c.userId && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                  setReplyTo(c)
                  document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <Reply className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">{c.commentText}</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleLike(c)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold transition-colors",
                  c.likes?.includes(user?.uid || "") ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <ThumbsUp className={cn("h-4 w-4", c.likes?.includes(user?.uid || "") && "fill-current")} />
                {c.likes?.length || 0} Likes
              </button>
            </div>
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
              Community Discussion
            </h2>
            
            {user ? (
              <Card className="rounded-3xl border-none shadow-xl bg-card/50 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    {replyTo ? `Replying to ${replyTo.authorName}` : "Join the Conversation"}
                    {replyTo && (
                      <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>Cancel Reply</Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostComment} className="space-y-4">
                    {user.isAnonymous && (
                      <Input 
                        placeholder="Your Display Name (Optional)" 
                        className="rounded-xl h-12" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    )}
                    <Textarea 
                      placeholder={replyTo ? "Write your reply..." : "Share your thoughts on this project..."} 
                      required 
                      className="rounded-xl min-h-[120px]" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isPending}>
                      {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> {replyTo ? "Post Reply" : "Post Comment"}</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="p-10 text-center bg-secondary/20 rounded-[2rem] border-2 border-dashed border-primary/20 space-y-4">
                <p className="text-lg font-medium">Sign in to participate in the project discussion.</p>
                <Button size="lg" className="rounded-full px-8" onClick={handleLogin}>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In Anonymously
                </Button>
              </div>
            )}

            <div className="space-y-8 pt-6">
              {commentsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
              ) : allComments && allComments.length > 0 ? (
                renderComments(null)
              ) : (
                <div className="text-center py-20 opacity-40">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-xl font-bold font-headline">No comments yet</p>
                  <p>Be the first to start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl shadow-xl border-none">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold">Project Metadata</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Type</span>
                  <span className="font-bold">Full Stack Solution</span>
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

          <div className="p-8 rounded-3xl bg-primary text-primary-foreground space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xl font-bold">Ready to scale?</h3>
            <p className="opacity-90">Let's discuss how we can build high-performance systems tailored to your needs.</p>
            <Button variant="secondary" className="w-full h-14 text-primary font-bold rounded-xl" asChild>
              <Link href="/contact">Hire Me Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
