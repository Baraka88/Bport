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
  imageUrl: string;
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
    description: "Real-time stock tracking and automated alerts for retail businesses.",
    longDescription: "A comprehensive solution for managing inventory across multiple warehouses. Built with Node.js and MySQL, it features a robust dashboard for monitoring stock levels, generating reports, and predicting reorder points.",
    tech: ["Node.js", "MySQL", "Vue.js", "System Analysis"],
    imageUrl: "https://picsum.photos/seed/inventory/800/600",
    liveUrl: "#",
    repoUrl: "#"
  },
  {
    id: "chatbrj-ai",
    title: "ChatBRJ AI Assistant",
    description: "An intelligent AI assistant powered by Genkit and Gemini.",
    longDescription: "Integrated directly into this portfolio, ChatBRJ AI uses advanced RAG techniques to provide instant answers about my professional background, skills, and projects.",
    tech: ["Genkit", "Gemini AI", "TypeScript", "Firebase"],
    imageUrl: "https://picsum.photos/seed/chat-ai/800/600",
    liveUrl: "/chat",
    repoUrl: "#"
  },
  {
    id: "bookstore-mgmt",
    title: "Book Store Management System",
    description: "Digital storefront and backend management for booksellers.",
    longDescription: "This project addresses the unique needs of independent bookstores, including ISBN integration, customer loyalty tracking, and secure payment processing using modern web technologies.",
    tech: ["PHP", "MySQL", "Tailwind CSS", "REST APIs"],
    imageUrl: "https://picsum.photos/seed/bookstore/800/600",
    liveUrl: "#",
    repoUrl: "#"
  }
];

export const SKILLS: Skill[] = [
  { 
    category: "Backend", 
    items: ["Node.js", "PHP", "MySQL", "REST APIs"],
    imageUrl: "https://picsum.photos/seed/backend-dev/400/300"
  },
  { 
    category: "Frontend", 
    items: ["Vue.js", "React", "Tailwind CSS", "TypeScript"],
    imageUrl: "https://picsum.photos/seed/frontend-dev/400/300"
  },
  { 
    category: "Systems", 
    items: ["System Analysis", "Architecture Design", "Agile", "Docker"],
    imageUrl: "https://picsum.photos/seed/systems-analysis/400/300"
  }
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
