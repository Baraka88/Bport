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
  Unlock,
  Edit2,
  Check
} from "lucide-react"

export default function AdminPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState("")

  // Edit states for Chat Users
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editUsername, setEditUsername] = useState("")

  // Protect queries - only run if system is unlocked
  const imagesQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "images"), orderBy("uploadDate", "desc")) : null, [db, unlocked])
  const collabQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "inquiries_collaboration"), orderBy("submissionDate", "desc")) : null, [db, unlocked])
  const hireQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "inquiries_hire_me"), orderBy("submissionDate", "desc")) : null, [db, unlocked])
  const chatUsersQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "chat_users"), orderBy("joinDate", "desc")) : null, [db, unlocked])
  const commentsQuery = useMemoFirebase(() => (db && unlocked) ? query(collection(db, "comments"), orderBy("submissionDate", "desc")) : null, [db, unlocked])

  // Data
  const { data: images, isLoading: imagesLoading } = useCollection(imagesQuery)
  const { data: collabs, isLoading: collabsLoading } = useCollection(collabQuery)
  const { data: hireRequests, isLoading: hireLoading } = useCollection(hireQuery)
  const { data: chatUsers, isLoading: chatUsersLoading } = useCollection(chatUsersQuery)
  const { data: comments, isLoading: commentsLoading } = useCollection(commentsQuery)

  // Asset Form
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageDesc, setNewImageDesc] = useState("")
  const [isPending, setIsPending] = useState(false)

  function verifyAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (password === "adminBRJ") {
      setUnlocked(true)
      toast({ title: "Access Granted", description: "Welcome to your BRJDEV control center." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect master password." })
    }
  }

  function handleAddImage(e: React.FormEvent) {
    e.preventDefault()
    if (!db) return
    setIsPending(true)
    addDoc(collection(db, "images"), {
      url: newImageUrl,
      description: newImageDesc,
      altText: newImageDesc,
      category: "gallery",
      uploadDate: serverTimestamp()
    }).then(() => {
      setNewImageUrl("")
      setNewImageDesc("")
      toast({ title: "Asset Added", description: "Image published to gallery." })
    }).finally(() => {
      setIsPending(false)
    })
  }

  function handleDeleteDoc(colName: string, id: string) {
    if (!db) return
    if (!confirm("Are you sure? This action is permanent and will remove the document from the database.")) return
    const docRef = doc(db, colName, id)
    deleteDocumentNonBlocking(docRef)
    toast({ title: "Operation Initiated", description: "Deleting document..." })
  }

  async function handleUpdateUsername(userId: string) {
    if (!db || !editUsername.trim()) return
    try {
      await updateDoc(doc(db, "chat_users", userId), { username: editUsername })
      setEditingUserId(null)
      toast({ title: "Updated", description: "Username changed." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." })
    }
  }

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  if (!unlocked) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-[2.5rem] shadow-2xl border-none">
          <CardHeader className="text-center space-y-4 pt-12 pb-8">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-black font-headline tracking-tighter">Admin Access</CardTitle>
            <CardDescription>Enter master password to manage BRJDEV</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={verifyAdmin} className="space-y-6">
              <Input 
                type="password" 
                className="h-14 rounded-2xl text-center text-xl tracking-[0.5em]" 
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full h-14 rounded-2xl font-bold flex gap-2">
                <Unlock className="h-5 w-5" /> Unlock System
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black font-headline flex items-center gap-3">
            <LayoutDashboard className="h-10 w-10 text-primary" /> BRJDEV Control
          </h1>
          <p className="text-muted-foreground font-medium">Administrator Environment</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => setUnlocked(false)}>Lock System</Button>
      </header>

      <Tabs defaultValue="chat" className="space-y-10">
        <TabsList className="flex flex-wrap h-auto p-2 bg-secondary rounded-3xl gap-2">
          <TabsTrigger value="chat" className="rounded-2xl px-6 py-3 font-bold flex gap-2">
            <MessageCircle className="h-4 w-4" /> Chat Users
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-2xl px-6 py-3 font-bold flex gap-2">
            <ImageIcon className="h-4 w-4" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="rounded-2xl px-6 py-3 font-bold flex gap-2">
            <Users className="h-4 w-4" /> Inquiries
          </TabsTrigger>
          <TabsTrigger value="comments" className="rounded-2xl px-6 py-3 font-bold flex gap-2">
            <MessageSquare className="h-4 w-4" /> Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card className="rounded-3xl border-none shadow-xl">
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>Manage community members of ChatBRJ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatUsersLoading ? <Loader2 className="animate-spin mx-auto text-primary" /> : chatUsers?.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-5 bg-secondary/30 rounded-2xl">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black">
                        {u.username?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        {editingUserId === u.id ? (
                          <div className="flex gap-2 items-center">
                            <Input 
                              value={editUsername} 
                              onChange={(e) => setEditUsername(e.target.value)} 
                              className="h-8 max-w-[200px]"
                            />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleUpdateUsername(u.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{u.username}</p>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-40 hover:opacity-100" onClick={() => {
                              setEditingUserId(u.id)
                              setEditUsername(u.username || "")
                            }}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="hidden sm:block text-xs font-medium opacity-60">Joined: {u.joinDate?.toDate().toLocaleDateString()}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-50" 
                        onClick={() => handleDeleteDoc("chat_users", u.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader><CardTitle>Add Asset</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddImage} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={newImageDesc} onChange={(e) => setNewImageDesc(e.target.value)} required className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : <Plus className="h-4 w-4 mr-2" />} Add Image
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {imagesLoading ? <Loader2 className="animate-spin mx-auto text-primary" /> : images?.map((img) => (
                <Card key={img.id} className="rounded-3xl overflow-hidden group border-none shadow-lg">
                  <div className="relative aspect-video">
                    <img src={img.url} className="w-full h-full object-cover" alt={img.description} />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteDoc("images", img.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4"><p className="text-sm font-medium line-clamp-1">{img.description}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2"><Briefcase className="h-5 w-5" /> Hire Me</h3>
              {hireLoading ? <Loader2 className="animate-spin text-primary" /> : hireRequests?.map((hire) => (
                <Card key={hire.id} className="rounded-2xl p-4 border-none shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{hire.name}</h4>
                    <Button variant="ghost" size="icon" className="text-red-500 h-6 w-6" onClick={() => handleDeleteDoc("inquiries_hire_me", hire.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{hire.email} | {hire.phone}</p>
                  <p className="text-sm line-clamp-2 italic">"{hire.message}"</p>
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2"><Users className="h-5 w-5" /> Collabs</h3>
              {collabsLoading ? <Loader2 className="animate-spin text-primary" /> : collabs?.map((collab) => (
                <Card key={collab.id} className="rounded-2xl p-4 border-none shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{collab.name}</h4>
                    <Button variant="ghost" size="icon" className="text-red-500 h-6 w-6" onClick={() => handleDeleteDoc("inquiries_collaboration", collab.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{collab.email} | {collab.phone}</p>
                  <p className="text-sm line-clamp-2 italic">"{collab.idea}"</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {commentsLoading ? <Loader2 className="animate-spin text-primary" /> : comments?.map((comment) => (
            <Card key={comment.id} className="rounded-2xl p-4 border-none shadow-md flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold">{comment.authorName}</h4>
                  {comment.isApproved ? <Badge className="bg-green-100 text-green-700">Live</Badge> : <Badge variant="outline">Pending</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">"{comment.commentText}"</p>
              </div>
              <div className="flex gap-2">
                {!comment.isApproved && db && (
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => updateDoc(doc(db, "comments", comment.id), { isApproved: true })}>Approve</Button>
                )}
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteDoc("comments", comment.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}