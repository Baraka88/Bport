import { SKILLS } from "@/app/data/portfolio"
import { Code2, Server, Layout, Database, Terminal, Cpu, Layers } from "lucide-react"

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
            <div key={skill.category} className="group p-10 rounded-3xl bg-card border border-transparent hover:border-accent shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-300 transform group-hover:-rotate-6">
                <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
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
          );
        })}
      </div>
    </section>
  )
}