import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export function ContactHome() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-headline">Let's Build Your <span className="text-accent">Next Big Project</span></h2>
          <p className="text-xl opacity-90 leading-relaxed">
            High-performance system analysis and scalable web solutions delivered with precision. Ready to start?
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-primary font-bold shadow-xl" asChild>
              <Link href="/contact">Get Contact Details</Link>
            </Button>
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white/10 rounded-full mb-2"><Mail className="h-6 w-6" /></div>
                <span className="text-xs uppercase tracking-widest font-bold">Email</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white/10 rounded-full mb-2"><Phone className="h-6 w-6" /></div>
                <span className="text-xs uppercase tracking-widest font-bold">Call</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white/10 rounded-full mb-2"><MessageCircle className="h-6 w-6" /></div>
                <span className="text-xs uppercase tracking-widest font-bold">WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}