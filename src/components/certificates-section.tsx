import { CERTIFICATES } from "@/app/data/portfolio"
import { Award, BadgeCheck } from "lucide-react"

export function CertificatesSection() {
  return (
    <section id="certificates" className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Achievements & <span className="text-primary">Certifications</span></h2>
          <p className="text-muted-foreground">Continuous learning is at the heart of my professional growth.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CERTIFICATES.map((cert) => (
          <div key={cert.name} className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-background to-secondary/30 border shadow-sm hover:shadow-md transition-all group">
            <div className="p-4 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold leading-tight">{cert.name}</h3>
              <p className="text-sm text-accent font-semibold">{cert.issuer}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BadgeCheck className="h-3 w-3" />
                Verified {cert.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}