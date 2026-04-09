'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { PROJECTS } from "@/app/data/portfolio"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Github, Loader2, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ProjectSection() {
  const db = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "projects"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: firestoreProjects, isLoading } = useCollection(projectsQuery);

  // Use Firestore data if available, otherwise fallback to static data
  const displayProjects = firestoreProjects && firestoreProjects.length > 0 
    ? firestoreProjects 
    : PROJECTS;

  return (
    <section id="projects" className="container mx-auto px-4 scroll-mt-20">
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" /> Latest Works
        </div>
        <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Dynamic <span className="text-primary">Portfolio</span></h2>
        <div className="w-24 h-2 bg-accent rounded-full" />
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          A live collection of complex system analysis and full-stack web implementations.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Projects...</p>
        </div>
      ) : displayProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/50 backdrop-blur-sm flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button variant="secondary" size="lg" className="rounded-xl font-bold" asChild>
                    <Link href={`/projects/${project.id}`}>Case Study</Link>
                  </Button>
                </div>
              </div>
              <CardHeader className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-2xl font-black font-headline group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <div className="flex gap-2">
                    {project.repoUrl && project.repoUrl !== "#" && (
                      <a href={project.repoUrl} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2 text-base font-medium">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t: string) => (
                    <Badge key={t} variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 font-bold transition-colors">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border-4 border-dashed rounded-[4rem] bg-secondary/10 space-y-6">
          <Briefcase className="h-20 w-20 mx-auto opacity-10" />
          <div className="space-y-2">
            <p className="text-2xl font-black font-headline">Portfolio is Empty</p>
            <p className="text-muted-foreground font-medium">Use the Admin Workspace to push your first project.</p>
          </div>
        </div>
      )}
    </section>
  )
}
