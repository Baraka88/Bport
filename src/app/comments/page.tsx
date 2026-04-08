"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  ThumbsUp, 
  Reply, 
  Trash2, 
  LogIn,
  Heart
} from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase, useUser, useAuth } from "@/firebase"
import { 
  collection, 
  addDoc, 
  query, 
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
import { cn } from "@/lib/utils"

interface Comment {
  id: string;
  authorName: string;
  commentText: string;
  projectId?: string; // Optional for general feedback
  userId: string;
  parentId?: string;
  likes: string[];
  submissionDate: string;
}

export default function CommentsPage() {
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [isPending, setIsPending] = useState(false)

  const commentsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "comments"), 
      orderBy("submissionDate", "desc")
    )
  }, [db])

  const { data: allComments, isLoading: commentsLoading } = useCollection<Comment>(commentsQuery)

  const handleLogin = async () => {
    try {
      await signInAnonymously(auth)
      toast({ title: "Welcome!", description: "You are now logged in anonymously to participate." })
    } catch (error) {
      toast({ variant: "destructive", title: "Login Failed", description: "Could not authenticate." })
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!db || !user || !commentText.trim()) return
    setIsPending(true)

    const finalName = user.isAnonymous ? (name || "Guest Developer") : (user.displayName || user.email?.split('@')[0] || "User")

    const newComment = {
      authorName: finalName,
      commentText: commentText,
      projectId: "general", // Mark as general feedback
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
          subject: `New Community Comment from ${finalName}`,
          author: finalName,
          comment: commentText,
          type: !!replyTo ? "Reply" : "New Comment"
        })
      })

      toast({ title: "Comment Posted", description: "Thank you for your feedback!" })
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
      toast({ title: "Deleted", description: "Your comment has been removed." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete comment." })
    }
  }

  const renderComments = (parentId: string | null = null) => {
    if (!allComments) return null
    return allComments
      .filter(c => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className={cn("space-y-4", parentId && "ml-8 mt-4 pl-4 border-l-2 border-primary/10")}>
          <div className="p-6 bg-card border rounded-3xl shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {c.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground leading-none">{c.authorName}</h4>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{new Date(c.submissionDate).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                {user?.uid === c.userId && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>
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
            <p className="text-muted-foreground leading-relaxed mb-6 pl-1">{c.commentText}</p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => handleLike(c)}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-all",
                  c.likes?.includes(user?.uid || "") ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Heart className={cn("h-4 w-4", c.likes?.includes(user?.uid || "") && "fill-current")} />
                {c.likes?.length || 0}
              </button>
            </div>
          </div>
          {renderComments(c.id)}
        </div>
      ))
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black font-headline">Community <span className="text-primary">Discussion</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, collaborate, and share your thoughts. Your feedback helps build better digital solutions.
          </p>
        </div>

        <div id="comment-form" className="scroll-mt-24">
          {user ? (
            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
              <CardHeader className="bg-primary text-primary-foreground p-8">
                <CardTitle className="text-2xl font-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6" />
                    {replyTo ? `Replying to ${replyTo.authorName}` : "Join the Community"}
                  </div>
                  {replyTo && (
                    <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setReplyTo(null)}>Cancel</Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePostComment} className="space-y-6">
                  {user.isAnonymous && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name (Optional)</label>
                      <Input 
                        placeholder="Jane Doe" 
                        className="rounded-xl h-12 bg-background/50" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                    <Textarea 
                      placeholder={replyTo ? "Write your reply..." : "What's on your mind? Share your feedback or project ideas..."} 
                      required 
                      className="rounded-2xl min-h-[160px] bg-background/50 resize-none text-lg" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> {replyTo ? "Post Reply" : "Post Comment"}</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-16 text-center bg-secondary/30 rounded-[3rem] border-4 border-dashed border-primary/10 space-y-6">
              <LogIn className="h-16 w-16 mx-auto text-primary/40" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-headline">Authentication Required</h3>
                <p className="text-muted-foreground">Sign in anonymously to start contributing to the community discussion.</p>
              </div>
              <Button size="lg" className="rounded-full px-12 h-14 text-lg font-bold" onClick={handleLogin}>
                Sign In Anonymously
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between border-b pb-6">
            <h2 className="text-2xl font-black font-headline">Discussion Feed</h2>
            <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
              {allComments?.length || 0} Total Posts
            </div>
          </div>

          <div className="space-y-8">
            {commentsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="font-bold text-muted-foreground">Syncing discussion...</p>
              </div>
            ) : allComments && allComments.length > 0 ? (
              renderComments(null)
            ) : (
              <div className="text-center py-32 opacity-30">
                <MessageSquare className="h-24 w-24 mx-auto mb-6" />
                <p className="text-3xl font-black font-headline">The wall is quiet...</p>
                <p className="text-lg">Be the first to start the conversation!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
