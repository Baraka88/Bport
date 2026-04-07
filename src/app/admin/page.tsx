"use client"

import { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  LayoutDashboard, 
  ImageIcon, 
  Users, 
  Briefcase, 
  MessageCircle, 
  MessageSquare,
  Trash2,
  Plus,
  Loader2,
  ShieldAlert,
  Lock,
  Unlock
} from "lucide-react"

export default function AdminPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState("")

  // Protect queries so they don't run until the admin UI is unlocked and user is authenticated
  const imagesQuery = useMemoFirebase(() => (db && unlocked && user) ? query(collection(db, "images"), orderBy("uploadDate", "desc")) : null, [db, unlocked, user])
  const collabQuery = useMemoFirebase(() => (db && unlocked && user) ? query(collection(db, "inquiries_collaboration"), orderBy("submissionDate", "desc")) : null, [db, unlocked, user])
  const hireQuery = useMemoFirebase(() => (db && unlocked && user) ? query(collection(db, "inquiries_hire_me"), orderBy("submissionDate", "desc")) : null, [db, unlocked, user])
  const chatUsersQuery = useMemoFirebase(() => (db && unlocked && user) ? query(collection(db, "chat_users"), orderBy("joinDate", "desc")) : null, [db, unlocked, user])
  const commentsQuery = useMemoFirebase(() => (db && unlocked && user) ? query(collection(db, "comments"), orderBy("submissionDate", "desc")) : null, [db, unlocked, user])

  // Data
  const { data: images, isLoading: imagesLoading } = useCollection(imagesQuery)
  const { data: collabs, isLoading: collabsLoading } = useCollection(collabQuery)
  const { data: hireRequests, isLoading: hireLoading } = useCollection(hireQuery)
  const { data: chatUsers, isLoading: chatUsersLoading } = useCollection(chatUsersQuery)
  const { data: comments, isLoading: commentsLoading } = useCollection(commentsQuery)

  // Forms
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageDesc, setNewImageDesc] = useState("")
  const [isPending, setIsPending] = useState(false)

  function verifyAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (password === "adminBRJ") {
      if (!user) {
        toast({ variant: "destructive", title: "Authentication Required", description: "Please sign in to the ChatBRJ page first to verify your session." })
        return
      }
      setUnlocked(true)
      toast({ title: "Access Granted", description: "Welcome to your BRJDEV control center." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect master password." })
    }
  }

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)
    try {
      await addDoc(collection(db, "images"), {
        url: newImageUrl,
        description: newImageDesc,
        altText: newImageDesc,
        category: "gallery",
        uploadDate: serverTimestamp()
      })
      setNewImageUrl("")
      setNewImageDesc("")
      toast({ title: "Asset Added", description: "Image has been successfully published to gallery." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to upload asset. Ensure you have admin permissions." })
    } finally {
      setIsPending(false)
    }
  }

  async function handleDeleteImage(id: string) {
    try {
      await deleteDoc(doc(db, "images", id))
      toast({ title: "Asset Deleted", description: "Image removed from gallery." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not remove asset." })
    }
  }

  async function updateStatus(collectionName: string, id: string, status: string) {
    try {
      await updateDoc(doc(db, collectionName, id), { status })
      toast({ title: "Status Updated", description: `Inquiry marked as ${status}.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." })
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-[2.5rem] shadow-2xl border-none">
          <CardHeader className="text-center space-y-4 pt-12 pb-8">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-headline font-black">Restricted Area</CardTitle>
              <p className="text-muted-foreground">Master identity verification required</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={verifyAdmin} className="space-y-6">
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs font-bold opacity-60">Security Key</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    className="h-14 rounded-2xl pl-10 text-center text-xl tracking-[0.5em]" 
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl flex gap-2">
                <Unlock className="h-5 w-5" /> Unlock Control Center
              </Button>
              {!user && (
                <p className="text-xs text-center text-red-500 font-bold">
                  Note: You must be logged in via the Chat page first.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline flex items-center gap-3">
            <LayoutDashboard className="h-10 w-10 text-primary" /> Admin Control
          </h1>
          <p className="text-muted-foreground font-medium">Managing BRJDEV ecosystem | Welcome {user?.displayName}</p>
        </div>
        <div className="flex gap-4">
          <Badge className="px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 font-bold border-none">SYSTEM ACTIVE</Badge>
          <Button variant="outline" className="rounded-full font-bold" onClick={() => setUnlocked(false)}>Lock System</Button>
        </div>
      </header>

      <Tabs defaultValue="gallery" className="space-y-10">
        <TabsList className="flex flex-wrap justify-start h-auto p-2 bg-secondary rounded-3xl gap-2">
          <TabsTrigger value="gallery" className="rounded-2xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold flex gap-2">
            <ImageIcon className="h-4 w-4" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="collab" className="rounded-2xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold flex gap-2">
            <Users className="h-4 w-4" /> Collabs
          </TabsTrigger>
          <TabsTrigger value="hire" className="rounded-2xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold flex gap-2">
            <Briefcase className="h-4 w-4" /> Hire Requests
          </TabsTrigger>
          <TabsTrigger value="chat" className="rounded-2xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold flex gap-2">
            <MessageCircle className="h-4 w-4" /> Chat Users
          </TabsTrigger>
          <TabsTrigger value="comments" className="rounded-2xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold flex gap-2">
            <MessageSquare className="h-4 w-4" /> Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 rounded-3xl border-none shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-headline font-bold">Add Asset</CardTitle>
                <CardDescription>Publish new visual highlights to your gallery</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddImage} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input 
                      placeholder="https://images.unsplash.com/..." 
                      className="rounded-xl h-12"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="System architecture for project X" 
                      className="rounded-xl"
                      value={newImageDesc}
                      onChange={(e) => setNewImageDesc(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold flex gap-2" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <Plus className="h-4 w-4" />} Publish Asset
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {imagesLoading ? (
                <div className="col-span-2 flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
              ) : images?.map((img) => (
                <Card key={img.id} className="rounded-3xl border-none shadow-lg overflow-hidden group">
                  <div className="relative aspect-video">
                    <img src={img.url} alt={img.description} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" className="rounded-full" onClick={() => handleDeleteImage(img.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium text-sm line-clamp-2">{img.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collab" className="space-y-6">
          {collabsLoading ? <Loader2 className="animate-spin mx-auto" /> : collabs?.map((collab) => (
            <Card key={collab.id} className="rounded-3xl border-none shadow-lg p-6 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold font-headline">{collab.name}</h3>
                  <Badge variant={collab.status === "new" ? "default" : "secondary"}>{collab.status}</Badge>
                </div>
                <p className="text-muted-foreground font-medium">{collab.email} | {collab.phone}</p>
                <div className="p-4 bg-secondary/50 rounded-2xl mt-4 italic">
                  "{collab.idea}"
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => updateStatus("inquiries_collaboration", collab.id, "reviewed")}>Reviewed</Button>
                <Button className="rounded-xl bg-green-600 hover:bg-green-700" onClick={() => updateStatus("inquiries_collaboration", collab.id, "contacted")}>Contacted</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hire" className="space-y-6">
          {hireLoading ? <Loader2 className="animate-spin mx-auto" /> : hireRequests?.map((hire) => (
            <Card key={hire.id} className="rounded-3xl border-none shadow-lg p-6 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold font-headline">{hire.name}</h3>
                  <Badge className="bg-primary/10 text-primary">{hire.service}</Badge>
                  <Badge variant="outline" className="border-accent text-accent">{hire.urgency} Urgency</Badge>
                </div>
                <p className="text-muted-foreground font-medium">{hire.email} | {hire.phone}</p>
                <p className="font-bold text-accent">Budget: {hire.budget || "Not specified"}</p>
                <div className="p-4 bg-secondary/50 rounded-2xl mt-4">
                  <p className="font-medium">{hire.message}</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Button className="rounded-xl bg-green-600 hover:bg-green-700" onClick={() => updateStatus("inquiries_hire_me", hire.id, "processed")}>Mark Processed</Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="chat">
          <Card className="rounded-3xl border-none shadow-xl">
            <CardHeader>
              <CardTitle>Chat Community</CardTitle>
              <CardDescription>Registered users in ChatBRJ ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatUsersLoading ? <Loader2 className="animate-spin mx-auto" /> : chatUsers?.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black">
                        {u.username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold">{u.username}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium opacity-60">Joined: {u.joinDate?.toDate().toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          {commentsLoading ? <Loader2 className="animate-spin mx-auto" /> : comments?.map((comment) => (
            <Card key={comment.id} className="rounded-3xl border-none shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg">{comment.authorName}</h4>
                  <p className="text-xs text-muted-foreground">{comment.submissionDate?.toDate().toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => updateDoc(doc(db, "comments", comment.id), { isApproved: true })}>Approve</Button>
                  <Button variant="destructive" size="sm" className="rounded-full" onClick={() => deleteDoc(doc(db, "comments", comment.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="italic text-muted-foreground">"{comment.commentText}"</p>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}