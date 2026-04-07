import { SKILLS } from "@/app/data/portfolio"
import { Code2, Server, Globe, PenTool } from "lucide-react"

const icons = [Globe, Server, PenTool];

export function SkillsSection() {
  return (
    <section id="skills" className="container mx-auto px-4 bg-primary/[0.02] py-20 rounded-3xl">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Technical <span className="text-primary">Proficiency</span></h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A toolkit built through years of hands-on experience in development and analytical thinking.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SKILLS.map((skill, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <div key={skill.category} className="group p-8 rounded-2xl bg-card border border-transparent hover:border-accent shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-4">{skill.category}</h3>
              <div className="space-y-3">
                {skill.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}