import { SKILLS } from "@/app/data/portfolio"
import { Code2, Server, Layout, Database, Terminal, Cpu, Layers } from "lucide-react"
import Image from "next/image"

const iconMap: Record<string, any> = {
  "Backend": Database,
  "Frontend": Layout,
  "Systems": Cpu
};

export function SkillsSection() {
  return (
    <section id="skills" className="container mx-auto px-4 bg-primary/[0.02] py-24 rounded-[3rem] border border-primary/5">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black font-headline">Technical <span className="text-primary">Mastery</span></h2>
        <p className="text-muted-foreground max-w-xl mx-auto font-medium">
          A full-stack arsenal built for high-performance systems and intuitive user experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SKILLS.map((skill, idx) => {
          const Icon = iconMap[skill.category] || Terminal;
          return (
            <div key={skill.category} className="group overflow-hidden rounded-3xl bg-card border border-transparent hover:border-accent shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="relative h-48 w-full">
                <Image 
                  src={skill.imageUrl} 
                  alt={skill.category}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  data-ai-hint={`${skill.category} technology`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-6">
                   <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="p-8 pt-4">
                <h3 className="text-2xl font-black mb-6 font-headline">{skill.category}</h3>
                <div className="space-y-4">
                  {skill.items.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                      <span className="text-muted-foreground font-bold group-hover:text-foreground transition-colors tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}