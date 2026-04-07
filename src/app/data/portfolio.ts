import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export const PROJECTS: Project[] = [
  {
    id: "inventory-sys",
    title: "Smart Inventory Manager",
    description: "A comprehensive system analysis and implementation for a retail chain using Node.js and MySQL.",
    longDescription: "This project involved a deep dive into business processes followed by the development of a real-time inventory tracking solution. It features automated stock alerts, detailed reporting, and a responsive Vue.js frontend.",
    tech: ["Node.js", "Vue.js", "MySQL", "System Analysis"],
    imageUrl: PlaceHolderImages[2].imageUrl,
    liveUrl: "#",
    repoUrl: "#"
  },
  {
    id: "health-portal",
    title: "MediLink Patient Portal",
    description: "Secure healthcare management system built with PHP and MySQL with a focus on data privacy.",
    longDescription: "MediLink allows patients to schedule appointments, view medical history, and communicate securely with doctors. Built with PHP 8 and follows strict security standards for medical data.",
    tech: ["PHP", "MySQL", "System Analysis", "Bootstrap"],
    imageUrl: PlaceHolderImages[3].imageUrl,
    liveUrl: "#",
    repoUrl: "#"
  }
];

export const SKILLS: Skill[] = [
  { category: "Backend", items: ["Node.js", "PHP", "MySQL", "REST APIs"] },
  { category: "Frontend", items: ["Vue.js", "React", "Tailwind CSS", "TypeScript"] },
  { category: "Tools & Others", items: ["System Analysis", "Git", "Docker", "Agile"] }
];

export const CERTIFICATES: Certificate[] = [
  { name: "Full Stack Web Development", issuer: "Meta", date: "2023" },
  { name: "MySQL Database Administrator", issuer: "Oracle", date: "2022" },
  { name: "System Analysis Professional", issuer: "BCS", date: "2023" }
];

export const EXPERIENCE: Experience[] = [
  {
    role: "Senior Software Engineer",
    company: "TechFlow Solutions",
    period: "2022 - Present",
    description: "Leading a team of 5 developers in building scalable enterprise applications using Node.js and Vue.js."
  },
  {
    role: "Junior Developer",
    company: "BlueChip Systems",
    period: "2020 - 2022",
    description: "Developed and maintained legacy PHP systems while assisting in the migration to modern frameworks."
  }
];
