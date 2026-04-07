import { PROJECTS } from "@/app/data/portfolio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Github, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = PROJECTS.find((p) => p.id === id)

  if (!project) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t} className="bg-primary/10 text-primary hover:bg-primary/20">
                  {t}
                </Badge>
              ))}
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-secondary/30 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold font-headline">Project Vision</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Focused on performance and scalability, this solution was built to handle high-concurrency environments while maintaining an intuitive user experience.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl shadow-xl border-none">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold">Project Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Platform</span>
                  <span className="font-bold">Web Application</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Category</span>
                  <span className="font-bold">System Analysis</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground font-medium">Year</span>
                  <span className="font-bold">2023</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button className="w-full rounded-xl py-6" size="lg">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Button>
                <Button variant="outline" className="w-full rounded-xl py-6" size="lg">
                  <Github className="mr-2 h-4 w-4" /> Source Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-3xl bg-primary text-primary-foreground space-y-6 shadow-xl">
            <h3 className="text-xl font-bold">Ready to start a similar project?</h3>
            <p className="opacity-90">Let's discuss how we can bring your ideas to life with high-performance technology.</p>
            <Button variant="secondary" className="w-full text-primary" asChild>
              <Link href="/contact">Hire Me</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}