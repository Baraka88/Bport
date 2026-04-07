import { EXPERIENCE } from "@/app/data/portfolio"
import Image from "next/image"
import { Briefcase, Calendar, GraduationCap, ShieldCheck } from "lucide-react"

export function AboutSection() {
  const profileImg = "https://storage.googleapis.com/fetch-user-images-bucket/c5956041-073c-448c-9a4c-83b4009b7ebf.png";

  return (
    <section id="about" className="container mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="absolute -inset-6 bg-primary/20 rounded-[3rem] blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
          
          <div className="relative aspect-square max-w-lg mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-4 border-background transform group-hover:-rotate-2 transition-transform duration-500">
            <Image
              src={profileImg}
              alt="Baraka Junior"
              fill
              className="object-cover"
              unoptimized
              data-ai-hint="professional portrait"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          
          <div className="absolute -bottom-10 -right-6 bg-card p-6 rounded-[2rem] shadow-2xl border border-primary/10 hidden sm:block animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded-2xl">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">Experience</p>
                <p className="text-2xl font-black font-headline">4+ Years</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-10 -left-6 bg-accent p-6 rounded-[2rem] shadow-2xl border border-white/10 hidden sm:block">
            <div className="flex items-center gap-4 text-accent-foreground">
              <div className="p-3 bg-white/20 rounded-2xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-tighter opacity-80">Verified</p>
                <p className="text-xl font-black font-headline">Expert Analyst</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
              Who is Baraka?
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-headline leading-none">The Visionary Behind the <span className="text-primary">Code</span></h2>
            <div className="w-24 h-2 bg-accent rounded-full" />
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              I am Baraka Junior, a passionate Software Engineer based in Rwanda. My journey in tech is driven by a desire to solve real-world problems through elegant code and robust system analysis.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              With a background in both development and systems design, I bridge the gap between business requirements and technical implementation. I specialize in the LAMP/MERN stacks and have a proven track record of delivering high-performance applications.
            </p>
          </div>

          <div className="space-y-8">
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
    </section>
  )
}