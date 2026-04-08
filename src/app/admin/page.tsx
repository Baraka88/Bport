"use client"

import { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { 
  collection, 
  doc, 
  updateDoc,
  query, 
  orderBy, 
  serverTimestamp,
  addDoc
} from "firebase/firestore"
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  LayoutDashboard, 
  ImageIcon, 
  MessageSquare,
  Trash2,
  Plus,
  Loader2,
  ShieldAlert,
  Unlock,
  Briefcase,
  Users,
  Check,
  X
} from "lucide-react"

export default function AdminPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState("")

  // Queries
  const hireMeQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "inquiries_hire_me"), orderBy("submissionDate", "desc")) : null, [db, unlocked])
  const collabQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "inquiries_collaboration"), orderBy("submissionDate", "desc")) : null, [db, unlocked])
  const commentsQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "comments"), orderBy("submissionDate", "desc")) : null, [db, unlocked])
  const galleryQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "images"), orderBy("uploadDate", "desc")) : null, [db, unlocked])

  const { data: hireInquiries, isLoading: hireLoading } = useCollection(hireMeQuery)
  const { data: collabInquiries, isLoading: collabLoading } = useCollection(collabQuery)
  const { data: comments, isLoading: commentsLoading } = useCollection(commentsQuery)
  const { data: gallery, isLoading: galleryLoading } = useCollection(galleryQuery)

  function verifyAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (password === "adminBRJ") {
      setUnlocked(true)
      toast({ title: "Access Granted", description: "Admin session active." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid password." })
    }
  }

  function handleStatusUpdate(col: string, id: string, status: string) {
    if (!db) return
    updateDoc(doc(db, col, id), { status })
    toast({ title: "Status Updated", description: `Inquiry marked as ${status}.` })
  }

  function handleDelete(col: string, id: string) {
    if (!db || !confirm("Delete this document forever?")) return
    deleteDocumentNonBlocking(doc(db, col, id))
    toast({ title: "Deleted", description: "Document removed from database." })
  }

  function handleApproveComment(id: string) {
    if (!db) return
    updateDoc(doc(db, "comments", id), { isApproved: true })
    toast({ title: "Comment Approved", description: "Now visible on project page." })
  }

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  if (!unlocked) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold font-headline">Admin Access</CardTitle>
            <CardDescription>Enter password to manage inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={verifyAdmin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="••••••" 
                className="text-center h-12" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full h-12 rounded-xl">
                <Unlock className="mr-2 h-4 w-4" /> Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black font-headline flex items-center gap-3">
          <LayoutDashboard className="text-primary h-10 w-10" /> BRJ Control
        </h1>
        <Button variant="outline" onClick={() => setUnlocked(false)}>Lock System</Button>
      </div>

      <Tabs defaultValue="hire" className="space-y-8">
        <TabsList className="bg-secondary p-1 rounded-2xl">
          <TabsTrigger value="hire" className="rounded-xl px-6">Hire Me</TabsTrigger>
          <TabsTrigger value="collab" className="rounded-xl px-6">Collab</TabsTrigger>
          <TabsTrigger value="comments" className="rounded-xl px-6">Comments</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-xl px-6">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="hire">
          <div className="grid gap-4">
            {hireLoading ? <Loader2 className="animate-spin mx-auto" /> : hireInquiries?.map((inq) => (
              <Card key={inq.id} className="rounded-2xl border-none shadow-md overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{inq.clientName}</h3>
                      <Badge variant={inq.status === 'new' ? 'default' : 'outline'}>{inq.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{inq.clientEmail} • {inq.clientPhone}</p>
                    <p className="p-4 bg-secondary/30 rounded-xl italic">"{inq.message}"</p>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("inquiries_hire_me", inq.id, "contacted")}>Contacted</Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete("inquiries_hire_me", inq.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collab">
           <div className="grid gap-4">
            {collabLoading ? <Loader2 className="animate-spin mx-auto" /> : collabInquiries?.map((inq) => (
              <Card key={inq.id} className="rounded-2xl border-none shadow-md">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{inq.collaboratorName}</h3>
                      <p className="text-sm text-muted-foreground">{inq.collaboratorEmail}</p>
                    </div>
                    <Badge>{inq.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-sm uppercase text-primary">Idea:</p>
                    <p className="text-sm">{inq.projectIdea}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete("inquiries_collaboration", inq.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="grid gap-4">
            {commentsLoading ? <Loader2 className="animate-spin mx-auto" /> : comments?.map((c) => (
              <Card key={c.id} className={`rounded-2xl border-none shadow-md ${!c.isApproved ? 'bg-primary/5' : ''}`}>
                <div className="p-6 flex justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{c.authorName}</h4>
                      <Badge variant="outline">{c.projectId}</Badge>
                      {!c.isApproved && <Badge className="bg-amber-100 text-amber-700">Pending</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{c.commentText}"</p>
                  </div>
                  <div className="flex gap-2">
                    {!c.isApproved && <Button size="sm" onClick={() => handleApproveComment(c.id)}><Check className="h-4 w-4 mr-1" /> Approve</Button>}
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete("comments", c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          {/* Gallery management logic here */}
          <div className="text-center py-20 opacity-50">Gallery management enabled. Add assets via the global image collection.</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
