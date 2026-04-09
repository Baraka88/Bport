
"use client"

import React, { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore"
import Image from "next/image"
import { Loader2, ImageOff, Lock, Unlock, Plus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function GalleryPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  // Admin Locker State
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState("")
  const [isLockerOpen, setIsLockerOpen] = useState(false)
  
  // Upload Form State
  const [newImage, setNewImage] = useState({ url: "", description: "", altText: "" })
  const [isUploading, setIsUploading] = useState(false)

  const galleryQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "images"), orderBy("uploadDate", "desc"))
  }, [db])

  const { data: images, isLoading } = useCollection(galleryQuery)

  const handleLockerUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple demo password - replace with a more secure method if needed
    if (password === "brjadmin2024") {
      setIsAdmin(true)
      setIsLockerOpen(false)
      toast({ title: "Locker Unlocked", description: "Admin mode active." })
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect locker key." })
    }
    setPassword("")
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db || !newImage.url || !newImage.description) return
    
    setIsUploading(true)
    try {
      await addDoc(collection(db, "images"), {
        url: newImage.url,
        description: newImage.description,
        altText: newImage.altText || newImage.description,
        uploadDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      })
      setNewImage({ url: "", description: "", altText: "" })
      toast({ title: "Success", description: "New image added to the gallery." })
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not add image." })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Visual <span className="text-primary">Gallery</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A showcase of system architectures, UI designs, and snapshots from my professional journey.
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 text-muted-foreground/50 hover:text-primary transition-all"
          onClick={() => isAdmin ? setIsAdmin(false) : setIsLockerOpen(true)}
        >
          {isAdmin ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
          {isAdmin ? "Exit Admin Mode" : "Admin Locker"}
        </Button>
      </div>

      {/* Locker Auth Form */}
      {isLockerOpen && (
        <Card className="max-w-md mx-auto mb-12 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Gallery Locker Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLockerUnlock} className="flex gap-4">
              <Input 
                type="password" 
                placeholder="Enter key..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
              />
              <Button type="submit" className="rounded-xl">Unlock</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admin Upload Panel */}
      {isAdmin && (
        <Card className="max-w-2xl mx-auto mb-16 rounded-[2rem] border-primary/30 shadow-2xl bg-primary/5">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-2xl font-bold font-headline flex items-center gap-3">
              <Plus className="h-6 w-6 text-primary" /> Add Gallery Item
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL*</label>
                <Input 
                  required 
                  placeholder="https://images.unsplash.com/..." 
                  className="rounded-xl"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Description*</label>
                  <Input 
                    required 
                    placeholder="Short title/desc..." 
                    className="rounded-xl"
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Alt Text</label>
                  <Input 
                    placeholder="Accessibility text..." 
                    className="rounded-xl"
                    value={newImage.altText}
                    onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={isUploading}>
                {isUploading ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Add to Showcase</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading gallery...</p>
        </div>
      ) : images && images.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img) => (
            <div key={img.id} className="relative group overflow-hidden rounded-2xl shadow-lg break-inside-avoid border">
              <img
                src={img.url}
                alt={img.altText || img.description}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-medium">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 border-2 border-dashed rounded-3xl">
          <ImageOff className="h-16 w-16 opacity-20" />
          <p className="text-xl font-headline font-bold">Gallery is currently empty</p>
          <p className="max-w-xs text-center">I'll be adding project highlights and architectural diagrams here soon.</p>
        </div>
      )}
    </div>
  )
}
