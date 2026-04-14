
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

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export const PROJECTS: Project[] = [
  {
    id: "chatbot-ai-app",
    title: "AI Assistant Review",
    description: "A hosted AI review experience available through an external link.",
    longDescription: "This conversational AI demo is now hosted externally. Use the review details button on this card to visit the external AI assistant preview.",
    tech: ["Genkit", "Gemini AI", "Next.js"],
    imageUrl: "https://picsum.photos/seed/chat-ai/800/600",
    liveUrl: "https://chatbrj.pages.dev",
    repoUrl: "#"
  },
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

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export const CERTIFICATES: Certificate[] = [
  {
    name: "Full Stack Web Development",
    issuer: "Coursera",
    date: "2024"
  },
  {
    name: "Firebase for Web Apps",
    issuer: "Google",
    date: "2024"
  },
  {
    name: "TypeScript Mastery",
    issuer: "Udemy",
    date: "2024"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    role: "Senior Full Stack Developer",
    company: "TechFlow Solutions",
    period: "2022 - Present",
    description: "Leading development cycles for scalable enterprise applications using Node.js, Vue.js, and modern architectural patterns."
  },
  {
    role: "Full Stack Developer",
    company: "BlueChip Systems",
    period: "2020 - 2022",
    description: "Developed and maintained end-to-end web solutions using the LAMP stack while contributing to system analysis and requirement mapping."
  }
];
