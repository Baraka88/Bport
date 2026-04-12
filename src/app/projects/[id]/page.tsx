export const runtime = "edge";
"use client"

import React, { useState } from "react"
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
  Reply,
  Sparkles
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  doc
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
  const db = useFirestore()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [isPending, setIsPending] = useState(false)

  const projectRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, "projects", id);
  }, [db, id]);

  const { data: project, isLoading: projectLoading } = useDoc(projectRef);

  const commentsQuery = useMemoFirebase(() => {
    if (!db || !id) return null
    return query(
      collection(db, "comments"), 
      where("projectId", "==", id), 
      orderBy("submissionDate", "asc")
    )
  }, [db, id])

  const { data: allComments, isLoading: commentsLoading } = useCollection<Comment>(commentsQuery)

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

  if (projectLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Project Details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <h1 className="text-4xl font-black font-headline">Project Not Found</h1>
        <Button asChild><Link href="/#projects">Back to Portfolio</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Portfolio
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">{project.title}</h1>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <Badge key={t} className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">{t}</Badge>
                ))}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">{project.longDescription}</p>
              </div>
            </div>
          </div>

          <div id="comment-form" className="space-y-8 scroll-mt-24">
            <h2 className="text-3xl font-black font-headline flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Project Discussion
            </h2>
            
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-card/50 backdrop-blur-md">
              <CardHeader className="p-8">
                <CardTitle className="text-xl flex items-center justify-between font-black">
                  {replyTo ? `Replying to ${replyTo.authorName}` : "Share your feedback"}
                  {replyTo && (
                    <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setReplyTo(null)}>Cancel</Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handlePostComment} className="space-y-4">
                  <Input 
                    placeholder="Identify yourself..." 
                    required
                    className="rounded-xl h-12 bg-background/50" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea 
                    placeholder={replyTo ? "Compose your response..." : "What are your thoughts on this architecture?"} 
                    required 
                    className="rounded-xl min-h-[120px] bg-background/50" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button type="submit" className="w-full h-14 rounded-xl font-black text-lg shadow-lg shadow-primary/20" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Push Comment</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8 pt-6">
              {commentsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-10 w-10 text-primary opacity-20" /></div>
              ) : allComments && allComments.length > 0 ? (
                renderComments(null)
              ) : (
                <div className="text-center py-20 opacity-40 border-2 border-dashed rounded-3xl">
                  <p className="text-lg font-bold font-headline">No discussions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-[2.5rem] shadow-2xl border-none bg-card/50 backdrop-blur-sm sticky top-32">
            <CardContent className="p-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-headline">Meta Details</h3>
                <p className="text-sm text-muted-foreground font-medium italic">Project architectural specifics.</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-4 border-b">
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Type</span>
                  <span className="font-black">Full Stack</span>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Architect</span>
                  <span className="font-black">Baraka Junior</span>
                </div>
                <div className="flex justify-between py-4 border-b">
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Priority</span>
                  <Badge className="bg-accent text-accent-foreground font-black px-3">High</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-4">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <Button className="w-full rounded-xl h-14 font-black" size="lg" asChild>
                    <a href={project.liveUrl} target="_blank"><ExternalLink className="mr-2 h-5 w-5" /> Explore Live</a>
                  </Button>
                )}
                {project.repoUrl && project.repoUrl !== "#" && (
                  <Button variant="outline" className="w-full rounded-xl h-14 font-black" size="lg" asChild>
                    <a href={project.repoUrl} target="_blank"><Github className="mr-2 h-5 w-5" /> Source Access</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
