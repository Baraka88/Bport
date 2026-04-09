
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Reply,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  X,
  Save,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc 
} from "firebase/firestore"
import { 
  deleteDocumentNonBlocking, 
  updateDocumentNonBlocking 
} from "@/firebase/non-blocking-updates"
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
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState("")
  const [isLockerOpen, setIsLockerOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [isPending, setIsPending] = useState(false)

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ authorName: "", commentText: "" })

  const commentsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(
      collection(db, "comments"), 
      orderBy("submissionDate", "desc")
    )
  }, [db])

  const { data: allComments, isLoading: commentsLoading } = useCollection<Comment>(commentsQuery)

  const handleLockerUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "brjadmin2024") {
      setIsAdmin(true)
      setIsLockerOpen(false)
      toast({ title: "Admin Mode Enabled", description: "Comment management unlocked." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect master key." })
    }
    setPassword("")
  }

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
      
      // Notification
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

  const handleDelete = (id: string) => {
    if (!db || !confirm("Delete this comment permanently?")) return
    deleteDocumentNonBlocking(doc(db, "comments", id))
    toast({ title: "Deleted", description: "Comment removed from database." })
  }

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id)
    setEditForm({ authorName: comment.authorName, commentText: comment.commentText })
  }

  const handleUpdate = (id: string) => {
    if (!db) return
    updateDocumentNonBlocking(doc(db, "comments", id), {
      authorName: editForm.authorName,
      commentText: editForm.commentText
    })
    setEditingId(null)
    toast({ title: "Updated", description: "Comment record synchronized." })
  }

  const renderComments = (parentId: string | null = null) => {
    if (!allComments) return null
    return allComments
      .filter(c => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className={cn("space-y-4", parentId && "ml-8 mt-4 pl-4 border-l-2 border-primary/10")}>
          <div className="p-6 bg-card border rounded-3xl shadow-sm hover:shadow-md transition-all group relative">
            {editingId === c.id ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <Input 
                  value={editForm.authorName}
                  onChange={(e) => setEditForm({...editForm, authorName: e.target.value})}
                  className="rounded-xl h-10 font-bold"
                />
                <Textarea 
                  value={editForm.commentText}
                  onChange={(e) => setEditForm({...editForm, commentText: e.target.value})}
                  className="rounded-xl min-h-[100px] bg-background/50"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-lg flex-1" onClick={() => handleUpdate(c.id)}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg h-10 w-10 p-0" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <div className="flex items-center gap-1 mr-2 bg-secondary/50 p-1 rounded-lg">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => startEditing(c)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                      setReplyTo(c)
                      document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}>
                      <Reply className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-1 whitespace-pre-wrap">{c.commentText}</p>
              </>
            )}
          </div>
          {renderComments(c.id)}
        </div>
      ))
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <MessageSquare className="h-3 w-3" /> Community Wall
          </div>
          <h1 className="text-4xl md:text-7xl font-black font-headline">The Wall of <span className="text-primary">Voices</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Join the discussion, share project feedback, or suggest new collaborations.
          </p>

          <div className="pt-4">
            {!isAdmin ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-6 border-primary/20 hover:bg-primary/5 transition-all"
                onClick={() => setIsLockerOpen(true)}
              >
                <Lock className="mr-2 h-4 w-4" /> Admin Locker
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-black uppercase tracking-widest border border-green-500/20">
                  <ShieldCheck className="h-3 w-3" /> Admin Mode Active
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsAdmin(false)}>Exit Management</Button>
              </div>
            )}
          </div>
        </div>

        {/* Admin Locker Form */}
        {isLockerOpen && !isAdmin && (
          <Card className="max-w-md mx-auto mb-16 border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Lock className="h-6 w-6" /> Management Key
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 font-medium">Unlock full CRUD permissions for the wall.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLockerUnlock} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Master Key</label>
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-12 bg-background/50"
                    />
                    <Button type="submit" className="rounded-xl h-12 px-6 font-bold">Unlock</Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setIsLockerOpen(false)}>Cancel</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Comment Posting Form */}
        <div id="comment-form" className="scroll-mt-24">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <CardTitle className="text-2xl font-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6" />
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
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Identity*</label>
                  <Input 
                    placeholder="Enter your name..." 
                    required
                    className="rounded-xl h-12 bg-background/50" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Voice*</label>
                  <Textarea 
                    placeholder={replyTo ? "Write your reply..." : "Share your thoughts or project ideas..."} 
                    required 
                    className="rounded-2xl min-h-[160px] bg-background/50 resize-none text-lg" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Push to the Wall</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between border-b pb-6">
            <h2 className="text-2xl font-black font-headline">Wall Activity</h2>
            <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
              {allComments?.length || 0} Records
            </div>
          </div>

          <div className="space-y-8">
            {commentsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin h-12 w-12 text-primary opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Feed...</p>
              </div>
            ) : allComments && allComments.length > 0 ? (
              renderComments(null)
            ) : (
              <div className="text-center py-32 opacity-30 border-4 border-dashed rounded-[3rem] bg-secondary/5">
                <MessageSquare className="h-24 w-24 mx-auto mb-6 opacity-10" />
                <p className="text-3xl font-black font-headline">The wall is empty.</p>
                <p className="font-medium max-w-xs mx-auto mt-2 text-muted-foreground">Be the first to leave your mark on the Community Wall.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
