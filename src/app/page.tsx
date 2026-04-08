
import { Hero } from "@/components/hero";
import { ProjectSection } from "@/components/project-section";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { CertificatesSection } from "@/components/certificates-section";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />
      <AboutSection />
      <ProjectSection />
      <SkillsSection />
      <CertificatesSection />
    </div>
  );
}
