
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Heart,
  Reply
} from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Comment {
  id: string;
  authorName: string;
  commentText: string;
  projectId?: string;
  userId?: string;
  parentId?: string;
  likes: string[];
  submissionDate: string;
}

export default function CommentsPage() {
  const db = useFirestore()
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

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!db || !commentText.trim() || !name.trim()) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please provide your name and message." })
      return
    }
    setIsPending(true)

    const newComment = {
      authorName: name,
      commentText: commentText,
      projectId: "general",
      parentId: replyTo?.id || null,
      likes: [],
      submissionDate: new Date().toISOString(),
      createdAt: serverTimestamp()
    }

    try {
      await addDoc(collection(db, "comments"), newComment)

      await fetch("https://formspree.io/f/mlgoveej", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Community Comment from ${name}`,
          author: name,
          comment: commentText,
          type: !!replyTo ? "Reply" : "New Comment",
          timestamp: new Date().toLocaleString()
        })
      })

      toast({ title: "Comment Posted", description: "Thank you for participating!" })
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
          <div className="p-6 bg-card border rounded-3xl shadow-sm hover:shadow-md transition-all">
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                setReplyTo(c)
                document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                <Reply className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 pl-1">{c.commentText}</p>
          </div>
          {renderComments(c.id)}
        </div>
      ))
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black font-headline">Community <span className="text-primary">Wall</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, feedback, and project ideas with the community.
          </p>
        </div>

        <div id="comment-form" className="scroll-mt-24">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <CardTitle className="text-2xl font-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  {replyTo ? `Replying to ${replyTo.authorName}` : "Post Feedback"}
                </div>
                {replyTo && (
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setReplyTo(null)}>Cancel</Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handlePostComment} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Name*</label>
                  <Input 
                    placeholder="Enter your name..." 
                    required
                    className="rounded-xl h-12 bg-background/50" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message*</label>
                  <Textarea 
                    placeholder={replyTo ? "Write your reply..." : "What's on your mind?"} 
                    required 
                    className="rounded-2xl min-h-[160px] bg-background/50 resize-none text-lg" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Post Message</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between border-b pb-6">
            <h2 className="text-2xl font-black font-headline">Recent Activity</h2>
            <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
              {allComments?.length || 0} Total
            </div>
          </div>

          <div className="space-y-8">
            {commentsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
              </div>
            ) : allComments && allComments.length > 0 ? (
              renderComments(null)
            ) : (
              <div className="text-center py-32 opacity-30">
                <MessageSquare className="h-24 w-24 mx-auto mb-6" />
                <p className="text-3xl font-black font-headline">The wall is quiet...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
