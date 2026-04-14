
"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { 
  addDocumentNonBlocking, 
  deleteDocumentNonBlocking, 
  updateDocumentNonBlocking 
} from "@/firebase/non-blocking-updates"
import { 
  Loader2, 
  ImageOff, 
  Lock, 
  Unlock, 
  Plus, 
  Send, 
  Trash2, 
  Edit3, 
  X, 
  Save,
  LayoutDashboard,
  ShieldCheck,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function GalleryPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  // Admin Locker State
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState("")
  const [isLockerOpen, setIsLockerOpen] = useState(false)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (searchParams.get("locker") === "1") {
      setIsLockerOpen(true)
    }
  }, [searchParams])
  
  // Upload Form State
  const [newImage, setNewImage] = useState({ url: "", description: "", altText: "" })
  const [isUploading, setIsUploading] = useState(false)

  // Edit State for CRUD
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ description: "", altText: "" })

  const galleryQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "images"), orderBy("uploadDate", "desc"))
  }, [db])

  const { data: images, isLoading } = useCollection(galleryQuery)

  const handleLockerUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "brjadmin2024") {
      setIsAdmin(true)
      setIsLockerOpen(false)
      toast({ title: "Dashboard Unlocked", description: "Full CRUD access granted." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect locker key." })
    }
    setPassword("")
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db || !newImage.url || !newImage.description) return
    
    setIsUploading(true)
    const imagesRef = collection(db, "images")
    
    addDocumentNonBlocking(imagesRef, {
      url: newImage.url,
      description: newImage.description,
      altText: newImage.altText || newImage.description,
      uploadDate: new Date().toISOString(),
    }).then(() => {
      setNewImage({ url: "", description: "", altText: "" })
      setIsUploading(false)
      toast({ title: "Created", description: "Image successfully added to gallery." })
    })
  }

  const handleDelete = (id: string) => {
    if (!db || !confirm("Permanent Delete: Are you sure?")) return
    deleteDocumentNonBlocking(doc(db, "images", id))
    toast({ title: "Deleted", description: "Item removed from database." })
  }

  const startEditing = (img: any) => {
    setEditingId(img.id)
    setEditForm({ description: img.description, altText: img.altText || "" })
  }

  const handleUpdate = (id: string) => {
    if (!db) return
    updateDocumentNonBlocking(doc(db, "images", id), {
      description: editForm.description,
      altText: editForm.altText
    })
    setEditingId(null)
    toast({ title: "Updated", description: "Gallery metadata synchronized." })
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">
          Visual <span className="text-primary">Gallery</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          A showcase of system architectures and high-performance UI designs.
        </p>
        
        <div className="pt-4">
          {isAdmin && (
            <div className="flex items-center gap-4 justify-center">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-black uppercase tracking-widest border border-green-500/20">
                <ShieldCheck className="h-3 w-3" /> Dashboard Active
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsAdmin(false)}>Exit</Button>
            </div>
          )}
        </div>
      </div>

      {/* Locker Auth Form */}
      {isLockerOpen && !isAdmin && (
        <Card className="max-w-md mx-auto mb-16 border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Lock className="h-6 w-6" /> Gallery Locker
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 font-medium">Enter your master key to manage visuals.</CardDescription>
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

      {/* Admin Dashboard: CREATE */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto mb-20 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 text-2xl font-black font-headline border-b pb-4">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Gallery Management
          </div>
          
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden border border-primary/5">
            <CardHeader className="bg-primary/5 p-8 border-b">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Plus className="h-5 w-5 text-primary" /> Add New Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image Resource URL*</label>
                    <Input 
                      required 
                      placeholder="https://images.unsplash.com/..." 
                      className="rounded-xl h-12 bg-background/50"
                      value={newImage.url}
                      onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alt Text (SEO/Access)</label>
                    <Input 
                      placeholder="e.g. Dashboard interface mockup" 
                      className="rounded-xl h-12 bg-background/50"
                      value={newImage.altText}
                      onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Description*</label>
                    <Input 
                      required 
                      placeholder="e.g. Inventory System v2" 
                      className="rounded-xl h-12 bg-background/50"
                      value={newImage.description}
                      onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    />
                  </div>
                  <div className="pt-6">
                    <Button type="submit" className="w-full h-12 rounded-xl text-lg font-black shadow-lg shadow-primary/20" disabled={isUploading}>
                      {isUploading ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Push to Showcase</>}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* READ: Gallery Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
          <p className="text-xl font-bold font-headline tracking-widest uppercase animate-pulse">Synchronizing Visuals...</p>
        </div>
      ) : images && images.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 max-w-7xl mx-auto">
          {images.map((img) => (
            <div key={img.id} className="relative group overflow-hidden rounded-[2rem] shadow-xl break-inside-avoid border bg-card transition-all duration-500 hover:shadow-2xl hover:border-primary/20">
              <img
                src={img.url}
                alt={img.altText || img.description}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay: UPDATE & DELETE Controls */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 transition-opacity duration-300",
                editingId === img.id ? "opacity-100" : (isAdmin ? "opacity-100" : "opacity-0 group-hover:opacity-100")
              )}>
                {editingId === img.id ? (
                  <div className="space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Edit Description</label>
                      <Input 
                        className="h-10 text-sm bg-white/10 text-white border-white/20 rounded-lg" 
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Edit Alt Text</label>
                      <Input 
                        className="h-10 text-sm bg-white/10 text-white border-white/20 rounded-lg" 
                        value={editForm.altText}
                        onChange={(e) => setEditForm({...editForm, altText: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="h-10 flex-1 rounded-lg font-bold" onClick={() => handleUpdate(img.id)}>
                        <Save className="h-4 w-4 mr-2" /> Save
                      </Button>
                      <Button size="sm" variant="outline" className="h-10 flex-1 rounded-lg font-bold border-white/20 text-white hover:bg-white/10" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-white text-xl font-black font-headline leading-tight">{img.description}</h4>
                      <p className="text-white/60 text-xs font-medium italic">{img.altText}</p>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex gap-3 pt-2 border-t border-white/10">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-10 px-4 rounded-xl font-bold flex-1"
                          onClick={() => startEditing(img)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" /> Modify
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-10 w-10 rounded-xl"
                          onClick={() => handleDelete(img.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-muted-foreground gap-6 border-4 border-dashed rounded-[3rem] bg-secondary/10">
          <ImageOff className="h-24 w-24 opacity-10" />
          <div className="text-center space-y-2">
            <p className="text-3xl font-black font-headline">Gallery is Empty</p>
            <p className="max-w-xs font-medium opacity-60">Unlock the locker and start pushing your professional visuals to the showcase.</p>
          </div>
        </div>
      )}

      {/* Dashboard Footer (Admin Only) */}
      {isAdmin && (
        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
            <AlertCircle className="h-3 w-3" /> End of Management Stream
          </div>
        </div>
      )}
    </div>
  )
}
