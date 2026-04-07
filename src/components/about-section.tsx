import { EXPERIENCE } from "@/app/data/portfolio"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"
import Image from "next/image"
import { Briefcase, Calendar, GraduationCap } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-accent/20 rounded-2xl blur-2xl group-hover:bg-accent/30 transition-all" />
          <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={PlaceHolderImages[4].imageUrl}
              alt="Baraka Junior"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-2xl shadow-xl hidden sm:block">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-bold">4+ Years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">About <span className="text-primary">Me</span></h2>
            <div className="w-16 h-1 bg-accent" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am Baraka Junior, a passionate Software Engineer based in Rwanda. My journey in tech is driven by a desire to solve real-world problems through elegant code and robust system analysis.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With a background in both development and systems design, I bridge the gap between business requirements and technical implementation. I specialize in the LAMP/MERN stacks and have a proven track record of delivering high-performance applications.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education & Experience
            </h3>
            <div className="space-y-6 border-l-2 border-primary/20 ml-2.5 pl-8">
              {EXPERIENCE.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
                      <Calendar className="h-4 w-4" />
                      {exp.period}
                    </div>
                    <h4 className="text-lg font-bold">{exp.role}</h4>
                    <p className="text-sm font-medium text-accent">{exp.company}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}