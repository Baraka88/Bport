
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { 
  Lock, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  ShieldCheck, 
  MessageSquare,
  Briefcase,
  Loader2,
  ExternalLink,
  Github,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

function AdminContent() {
  const db = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const [activeLocker, setActiveLocker] = useState<'projects' | 'comments'>('projects');
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'projects' || tab === 'comments') {
      setActiveLocker(tab);
    }
  }, [searchParams]);
  
  // Project Form State for Creation
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    longDescription: "",
    tech: "",
    imageUrl: "",
    liveUrl: "#",
    repoUrl: "#"
  });
  
  // Edit States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectForm, setEditProjectForm] = useState<any>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentForm, setEditCommentForm] = useState<any>(null);

  const projectsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "projects"), orderBy("createdAt", "desc"));
  }, [db]);

  const commentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "comments"), orderBy("submissionDate", "desc"));
  }, [db]);

  const { data: projects, isLoading: projectsLoading } = useCollection(projectsQuery);
  const { data: comments, isLoading: commentsLoading } = useCollection(commentsQuery);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "brjadmin2024") {
      setIsUnlocked(true);
      toast({ title: "Master Dashboard Unlocked", description: "All management tools are now active." });
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid security key." });
    }
    setPassword("");
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    try {
      await addDoc(collection(db, "projects"), {
        ...newProject,
        tech: newProject.tech.split(',').map(t => t.trim()),
        createdAt: serverTimestamp()
      });
      setNewProject({ title: "", description: "", longDescription: "", tech: "", imageUrl: "", liveUrl: "#", repoUrl: "#" });
      toast({ title: "Project Created", description: "Portfolio successfully updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add project." });
    }
  };

  const handleUpdateProject = (id: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "projects", id), {
      ...editProjectForm,
      tech: typeof editProjectForm.tech === 'string' ? editProjectForm.tech.split(',').map((t: string) => t.trim()) : editProjectForm.tech
    });
    setEditingProjectId(null);
    toast({ title: "Project Synchronized" });
  };

  const handleDeleteProject = (id: string) => {
    if (!db || !confirm("Permanent Action: Delete this project?")) return;
    deleteDocumentNonBlocking(doc(db, "projects", id));
    toast({ title: "Project Removed" });
  };

  const handleUpdateComment = (id: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "comments", id), editCommentForm);
    setEditingCommentId(null);
    toast({ title: "Comment Updated" });
  };

  if (!isUnlocked) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-[2.5rem] shadow-2xl overflow-hidden border-none bg-card/50 backdrop-blur-xl">
          <CardHeader className="bg-primary text-primary-foreground p-10 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-3xl font-black font-headline">Master Locker</CardTitle>
            <CardDescription className="text-primary-foreground/80 font-medium">Enter the master key to manage your platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleUnlock} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Master Key</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-background/50"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-black shadow-xl">Unlock Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b pb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Master <span className="text-primary">Dashboard</span></h1>
          <div className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 w-fit">
            <ShieldCheck className="h-3 w-3" /> Management Mode Active
          </div>
        </div>
        <div className="flex gap-4 bg-secondary/30 p-2 rounded-2xl">
          <Button 
            variant={activeLocker === 'projects' ? 'default' : 'ghost'} 
            className="rounded-xl h-12 px-6 font-bold"
            onClick={() => setActiveLocker('projects')}
          >
            <Briefcase className="mr-2 h-4 w-4" /> Project Locker
          </Button>
          <Button 
            variant={activeLocker === 'comments' ? 'default' : 'ghost'} 
            className="rounded-xl h-12 px-6 font-bold"
            onClick={() => setActiveLocker('comments')}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Comments Locker
          </Button>
          <Button variant="ghost" onClick={() => setIsUnlocked(false)} className="text-xs font-bold text-destructive">Lock</Button>
        </div>
      </div>

      {activeLocker === 'projects' && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
            <CardHeader className="bg-primary/5 p-10 border-b">
              <CardTitle className="text-2xl font-black font-headline flex items-center gap-3">
                <Plus className="h-6 w-6 text-primary" /> Architect New Project
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleAddProject} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project Title</label>
                    <Input required className="rounded-xl h-12" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Short Tagline</label>
                    <Input required placeholder="High-performance system..." className="rounded-xl h-12" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tech Stack (comma separated)</label>
                    <Input required placeholder="Node.js, React, Firebase" className="rounded-xl h-12" value={newProject.tech} onChange={e => setNewProject({...newProject, tech: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Image Resource URL</label>
                    <Input required className="rounded-xl h-12" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Long Case Study Description</label>
                    <Textarea required className="rounded-xl min-h-[120px]" value={newProject.longDescription} onChange={e => setNewProject({...newProject, longDescription: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-xl text-lg font-black shadow-lg shadow-primary/20">Push to Portfolio</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <h2 className="text-2xl font-black font-headline flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" /> Active Portfolio Stream
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projectsLoading ? <Loader2 className="animate-spin mx-auto h-12 w-12 text-primary" /> : projects?.map((p) => (
                <Card key={p.id} className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm group">
                  {editingProjectId === p.id ? (
                    <CardContent className="p-8 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase">Edit Title</label>
                        <Input className="font-bold rounded-lg" value={editProjectForm.title} onChange={e => setEditProjectForm({...editProjectForm, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase">Edit Case Study</label>
                        <Textarea className="text-sm rounded-lg min-h-[150px]" value={editProjectForm.longDescription} onChange={e => setEditProjectForm({...editProjectForm, longDescription: e.target.value})} />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1 rounded-xl h-12 font-bold" onClick={() => handleUpdateProject(p.id)}><Save className="mr-2 h-4 w-4" /> Sync Changes</Button>
                        <Button variant="outline" className="rounded-xl h-12" onClick={() => setEditingProjectId(null)}><X className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  ) : (
                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl" onClick={() => { setEditingProjectId(p.id); setEditProjectForm(p); }}><Edit3 className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" className="h-10 w-10 rounded-xl" onClick={() => handleDeleteProject(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <CardContent className="p-8 space-y-4">
                        <h3 className="text-xl font-black font-headline">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 font-medium leading-relaxed">{p.longDescription}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {p.tech.map((t: string) => <span key={t} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">{t}</span>)}
                        </div>
                      </CardContent>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeLocker === 'comments' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 text-2xl font-black font-headline border-b pb-4">
            <MessageSquare className="h-8 w-8 text-primary" /> Community Wall Activity
          </div>
          <div className="grid gap-6">
            {commentsLoading ? <Loader2 className="animate-spin mx-auto" /> : comments?.map((c) => (
              <Card key={c.id} className="rounded-2xl border-none shadow-md bg-card/50 overflow-hidden group">
                <CardContent className="p-6">
                  {editingCommentId === c.id ? (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase">Modify Author</label>
                          <Input className="rounded-lg" value={editCommentForm.authorName} onChange={e => setEditCommentForm({...editCommentForm, authorName: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Modify Message Content</label>
                        <Textarea className="rounded-lg" value={editCommentForm.commentText} onChange={e => setEditCommentForm({...editCommentForm, commentText: e.target.value})} />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button className="rounded-xl font-bold h-10 px-6" onClick={() => handleUpdateComment(c.id)}>Update Activity</Button>
                        <Button variant="outline" className="rounded-xl" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                            {c.authorName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground leading-none">{c.authorName}</h4>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(c.submissionDate).toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-1">{c.commentText}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => { setEditingCommentId(c.id); setEditCommentForm(c); }}><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => { if(confirm("Delete this wall entry?")) deleteDocumentNonBlocking(doc(db, "comments", c.id)); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminWorkspacePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>}>
      <AdminContent />
    </Suspense>
  );
}
