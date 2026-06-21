export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin?: string;
  about: string;
  bio: string;
  avatar?: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100 scale for progress visualization
  category: string; // e.g., 'Frontend', 'Backend', 'AI & ML', 'Operations'
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  github?: string;
  tags: string[];
  role?: string;
  highlights?: string[];
  imageUrl?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  score?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  imageUrl?: string;
}

export interface Achievement {
  title: string;
  issuer: string;
  date?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  achievements?: Achievement[];
}

export type ThemeStyle = 'modern' | 'minimalist' | 'terminal' | 'cyberpunk' | 'bold' | 'nordic' | 'sunset';

export interface UploadedResume {
  name: string;
  type: string;
  size: string;
  dataUrl: string;
  uploadedAt: string;
}

