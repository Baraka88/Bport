import { PROJECTS } from "@/app/data/portfolio"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ProjectSection() {
  return (
    <section id="projects" className="container mx-auto px-4 scroll-mt-20">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured <span className="text-primary">Projects</span></h2>
        <div className="w-20 h-1.5 bg-accent rounded-full" />
        <p className="text-muted-foreground max-w-2xl">
          A selection of my most significant work, ranging from complex system analysis to full-stack web implementations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <Card key={project.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/projects/${project.id}`}>Details</Link>
                </Button>
                {project.liveUrl !== "#" && (
                  <Button size="sm" className="bg-accent hover:bg-accent/80 text-accent-foreground" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                )}
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-accent text-accent">Latest</Badge>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <Link href={`/projects/${project.id}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Case Study
              </Link>
              <div className="flex gap-3">
                <a href={project.repoUrl} className="text-muted-foreground hover:text-foreground"><Github className="h-5 w-5" /></a>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}