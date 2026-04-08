import { EXPERIENCE } from "@/app/data/portfolio"
import { Briefcase, Calendar, GraduationCap, ShieldCheck, Terminal } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto space-y-20">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-10 rounded-[3rem] shadow-2xl border border-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <Terminal className="h-16 w-16 text-primary mb-6" />
              <h3 className="text-3xl font-black font-headline mb-4">Core Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                I believe in building systems that are not just functional, but resilient and scalable. Every line of code is an opportunity to simplify complex business logic.
              </p>
              
              <div className="mt-10 flex items-center gap-6">
                 <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-lg">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Experience</p>
                    <p className="text-3xl font-black font-headline">4+ Years</p>
                  </div>
              </div>
            </div>

            <div className="bg-accent p-10 rounded-[3rem] shadow-2xl border border-white/10 text-accent-foreground">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Methodology</p>
                  <p className="text-2xl font-black font-headline">Expert Analyst</p>
                </div>
              </div>
              <p className="mt-6 font-medium text-lg leading-snug">
                Bridging the gap between ambitious business goals and technical excellence through full-stack proficiency.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
                Who is Baraka?
              </div>
              <h2 className="text-5xl md:text-7xl font-black font-headline leading-none">The Visionary Behind the <span className="text-primary">Code</span></h2>
              <div className="w-24 h-2 bg-accent rounded-full" />
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                I am Baraka Ruzibiza Junior, a passionate Full Stack Developer based in Rwanda. My journey in tech is driven by a desire to solve real-world problems through elegant code and robust system analysis.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                With deep expertise in both frontend and backend development, I translate business requirements into high-performance digital solutions. I specialize in Node.js, PHP, and modern frontend frameworks like Vue and React.
              </p>
            </div>

            <div className="space-y-8 pt-6">
              <h3 className="text-2xl font-black font-headline flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                Career Journey
              </h3>
              <div className="space-y-10 border-l-4 border-primary/20 ml-4 pl-10">
                {EXPERIENCE.map((exp, idx) => (
                  <div key={idx} className="relative group/exp">
                    <div className="absolute -left-[54px] top-1 w-8 h-8 rounded-full bg-background border-4 border-primary group-hover/exp:scale-125 transition-transform" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm font-black text-primary uppercase tracking-widest">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </div>
                      <h4 className="text-2xl font-black font-headline">{exp.role}</h4>
                      <p className="text-lg font-bold text-accent">{exp.company}</p>
                      <p className="text-muted-foreground text-lg leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
