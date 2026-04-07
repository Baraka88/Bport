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
    id: "inventory-mgmt",
    title: "Inventory Management System",
    description: "A robust real-time tracking solution for retail and warehouses with automated stock alerts.",
    longDescription: "This system provides end-to-end visibility into supply chains. Built with Node.js and MySQL, it features a sophisticated dashboard for monitoring stock levels, generating reports, and predicting reorder points using historical data.",
    tech: ["Node.js", "MySQL", "Vue.js", "System Analysis"],
    imageUrl: "https://picsum.photos/seed/inv/800/600",
    liveUrl: "#",
    repoUrl: "#"
  },
  {
    id: "chatbrj-ai",
    title: "ChatBRJ AI Assistant",
    description: "An intelligent chatbot powered by Genkit and Gemini to handle portfolio inquiries and user interaction.",
    longDescription: "ChatBRJ AI is an agentic chat system integrated directly into this portfolio. It uses RAG-like context to answer questions about skills and projects, providing a seamless bridge between me and potential clients.",
    tech: ["Genkit", "Gemini AI", "TypeScript", "Firebase"],
    imageUrl: "https://picsum.photos/seed/ai/800/600",
    liveUrl: "/chat",
    repoUrl: "#"
  },
  {
    id: "bookstore-mgmt",
    title: "Book Store Management System",
    description: "A comprehensive digital storefront and backend management system for independent booksellers.",
    longDescription: "This project focuses on the unique needs of bookstore owners, including ISBN integration, customer loyalty tracking, and secure payment processing. Developed using the LAMP stack with a focus on ease of use.",
    tech: ["PHP", "MySQL", "Tailwind CSS", "REST APIs"],
    imageUrl: "https://picsum.photos/seed/book/800/600",
    liveUrl: "#",
    repoUrl: "#"
  }
];

export const SKILLS: Skill[] = [
  { category: "Backend", items: ["Node.js", "PHP", "MySQL", "REST APIs"] },
  { category: "Frontend", items: ["Vue.js", "React", "Tailwind CSS", "TypeScript"] },
  { category: "Systems", items: ["System Analysis", "Architecture Design", "Agile", "Docker"] }
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
