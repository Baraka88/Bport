
"use client"

import React, { useState } from "react"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Mail, Phone, Clock, Download, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"

export default function AdminPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Auth Protection
  if (!isUserLoading && (!user || user.email !== "barakaruzibiza680@gmail.com")) {
    redirect("/")
  }

  const hireQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "inquiries_hire_me"), orderBy("submissionDate", "desc"))
  }, [db])

  const collabQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "inquiries_collaboration"), orderBy("submissionDate", "desc"))
  }, [db])

  const commentsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "comments"), orderBy("submissionDate", "desc"))
  }, [db])

  const { data: hireInquiries, isLoading: hireLoading } = useCollection(hireQuery)
  const { data: collabInquiries, isLoading: collabLoading } = useCollection(collabQuery)
  const { data: comments, isLoading: commentsLoading } = useCollection(commentsQuery)

  const handleDelete = async (coll: string, id: string) => {
    if (!db) return
    setIsDeleting(id)
    try {
      await deleteDoc(doc(db, coll, id))
      toast({ title: "Deleted", description: "Record removed successfully." })
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete." })
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleCommentApproval = async (id: string, current: boolean) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "comments", id), { isApproved: !current })
      toast({ title: "Updated", description: "Comment approval status changed." })
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." })
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n")
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  if (isUserLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-headline">Admin <span className="text-primary">Control Center</span></h1>
          <p className="text-muted-foreground">Manage your business inquiries and community feedback.</p>
        </div>
      </div>

      <Tabs defaultValue="hire" className="space-y-8">
        <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto flex flex-wrap gap-2">
          <TabsTrigger value="hire" className="rounded-lg px-6 py-2.5 font-bold">Hire Inquiries ({hireInquiries?.length || 0})</TabsTrigger>
          <TabsTrigger value="collab" className="rounded-lg px-6 py-2.5 font-bold">Collaboration ({collabInquiries?.length || 0})</TabsTrigger>
          <TabsTrigger value="comments" className="rounded-lg px-6 py-2.5 font-bold">Comments ({comments?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="hire" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => exportToCSV(hireInquiries || [], "hire_inquiries")}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          {hireLoading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : (
            <div className="grid gap-6">
              {hireInquiries?.map((item) => (
                <Card key={item.id} className="rounded-3xl border-none shadow-lg">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{item.clientName}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.clientEmail}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(item.submissionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete("inquiries_hire_me", item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="p-4 bg-secondary/30 rounded-xl text-sm italic">"{item.message}"</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Budget: {item.budget}</Badge>
                      <Badge variant="outline">Timeline: {item.timeline}</Badge>
                      <Badge className={item.urgency === 'high' ? 'bg-destructive' : ''}>Urgency: {item.urgency}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collab" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => exportToCSV(collabInquiries || [], "collab_inquiries")}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          {collabLoading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : (
            <div className="grid gap-6">
              {collabInquiries?.map((item) => (
                <Card key={item.id} className="rounded-3xl border-none shadow-lg">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{item.collaboratorName}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.collaboratorEmail}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete("inquiries_collaboration", item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold text-sm mb-2">Project Idea:</p>
                    <p className="p-4 bg-secondary/30 rounded-xl text-sm mb-4">{item.projectIdea}</p>
                    <Badge variant="secondary">Timeline: {item.estimatedTimeline}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
           {commentsLoading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : (
            <div className="grid gap-6">
              {comments?.map((item) => (
                <Card key={item.id} className="rounded-3xl border-none shadow-lg">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{item.authorName}</CardTitle>
                        {item.isApproved ? <Badge className="bg-green-500">Approved</Badge> : <Badge variant="secondary">Pending</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">On Project: {item.projectId}</p>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="icon" onClick={() => toggleCommentApproval(item.id, item.isApproved)}>
                        {item.isApproved ? <XCircle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete("comments", item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="p-4 bg-secondary/30 rounded-xl text-sm italic">"{item.commentText}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
