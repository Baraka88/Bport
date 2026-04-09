
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
  Trash2,
  Edit3,
  X,
  Save,
  ShieldCheck,
  LayoutDashboard,
  AlertCircle
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

  // Edit State for Admin CRUD
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
      toast({ title: "Wall Manager Unlocked", description: "Full CRUD access to activity feed." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect master key." })
    }
    setPassword("")
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!db || !commentText.trim() || !name.trim()) {
      toast({ variant: "destructive", title: "Incomplete", description: "Name and message are required." })
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
          subject: `New Community Wall Entry from ${name}`,
          author: name,
          comment: commentText,
          timestamp: new Date().toLocaleString()
        })
      })

      toast({ title: "Success", description: "Your message is now on the wall!" })
      setCommentText("")
      setName("")
      setReplyTo(null)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Submission failed." })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = (id: string) => {
    if (!db || !confirm("Permanent Action: Delete this activity from the wall?")) return
    deleteDocumentNonBlocking(doc(db, "comments", id))
    toast({ title: "Activity Deleted", description: "Record removed from the public feed." })
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
    toast({ title: "Activity Updated", description: "Feed record synchronized successfully." })
  }

  const renderComments = (parentId: string | null = null) => {
    if (!allComments) return null
    return allComments
      .filter(c => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className={cn("space-y-4", parentId && "ml-8 mt-4 pl-4 border-l-2 border-primary/10")}>
          <div className="p-6 bg-card border rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative">
            {editingId === c.id ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Modify Author</label>
                  <Input 
                    value={editForm.authorName}
                    onChange={(e) => setEditForm({...editForm, authorName: e.target.value})}
                    className="rounded-xl h-10 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Modify Message</label>
                  <Textarea 
                    value={editForm.commentText}
                    onChange={(e) => setEditForm({...editForm, commentText: e.target.value})}
                    className="rounded-xl min-h-[100px] bg-background/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-xl h-10 flex-1 font-bold" onClick={() => handleUpdate(c.id)}>
                    <Save className="h-4 w-4 mr-2" /> Sync Changes
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl h-10 w-10 p-0" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {c.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground leading-none">{c.authorName}</h4>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(c.submissionDate).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <div className="flex items-center gap-1 mr-2 bg-secondary/50 p-1.5 rounded-xl border border-primary/10">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary" 
                          onClick={() => startEditing(c)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" 
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {
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
      <div className="max-w-4xl mx-auto space-y-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <MessageSquare className="h-3 w-3" /> Community Feedback
          </div>
          <h1 className="text-4xl md:text-8xl font-black font-headline tracking-tighter">The Wall of <span className="text-primary">Junior</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Join the conversation, leave project feedback, or suggest new full-stack collaborations.
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
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-500/20 shadow-sm">
                  <ShieldCheck className="h-3 w-3" /> Management Active
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold" onClick={() => setIsAdmin(false)}>Close Manager</Button>
              </div>
            )}
          </div>
        </div>

        {/* Admin Locker Entry */}
        {isLockerOpen && !isAdmin && (
          <Card className="max-w-md mx-auto mb-16 border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <CardHeader className="bg-primary text-primary-foreground p-8 text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <CardTitle className="text-2xl font-black font-headline">Wall Manager</CardTitle>
              <CardDescription className="text-primary-foreground/80 font-medium italic">Enter master key to enable CRUD tools.</CardDescription>
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
                      className="rounded-xl h-12 bg-background/50 font-mono"
                    />
                    <Button type="submit" className="rounded-xl h-12 px-6 font-bold">Unlock</Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-xs font-bold" onClick={() => setIsLockerOpen(false)}>Cancel Entry</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Post Form */}
        <div id="comment-form" className="scroll-mt-24">
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
            <CardHeader className="bg-primary text-primary-foreground p-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-3xl font-black font-headline flex items-center gap-3">
                    <LayoutDashboard className="h-8 w-8 opacity-50" />
                    {replyTo ? `Replying to ${replyTo.authorName}` : "Share Your Voice"}
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/70 font-medium">Your feedback drives the evolution of BRJ projects.</CardDescription>
                </div>
                {replyTo && (
                  <Button variant="secondary" size="sm" className="rounded-full h-8 px-4" onClick={() => setReplyTo(null)}>Cancel</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handlePostComment} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Identity*</label>
                  <Input 
                    placeholder="Enter your name..." 
                    required
                    className="rounded-2xl h-14 bg-background/50 text-lg border-none ring-1 ring-primary/10" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Thoughts*</label>
                  <Textarea 
                    placeholder={replyTo ? "Compose your response..." : "Share a thought, project idea, or critique..."} 
                    required 
                    className="rounded-3xl min-h-[180px] bg-background/50 border-none ring-1 ring-primary/10 resize-none text-xl p-6" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-16 rounded-3xl text-xl font-black shadow-2xl shadow-primary/30" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-3 h-6 w-6" /> Push to the Wall</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b-2 border-primary/5 pb-8">
            <div className="space-y-1">
              <h2 className="text-4xl font-black font-headline tracking-tight">Wall Activity</h2>
              <p className="text-sm text-muted-foreground font-medium">Public community records and feedback loop.</p>
            </div>
            <div className="px-5 py-2 rounded-2xl bg-secondary text-secondary-foreground text-xs font-black shadow-inner">
              {allComments?.length || 0} TOTAL ENTRIES
            </div>
          </div>

          <div className="space-y-10">
            {commentsLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <Loader2 className="animate-spin h-14 w-14 text-primary opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Synchronizing Live Feed...</p>
              </div>
            ) : allComments && allComments.length > 0 ? (
              renderComments(null)
            ) : (
              <div className="text-center py-40 opacity-30 border-4 border-dashed rounded-[4rem] bg-secondary/5 space-y-6">
                <AlertCircle className="h-24 w-24 mx-auto opacity-10" />
                <div className="space-y-2">
                  <p className="text-3xl font-black font-headline">The Wall is Clean.</p>
                  <p className="font-medium max-w-xs mx-auto text-muted-foreground">Be the first developer or client to leave your mark on the Wall Activity feed.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
