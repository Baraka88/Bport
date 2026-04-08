
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
