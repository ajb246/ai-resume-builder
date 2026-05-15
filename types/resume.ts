export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }[];
  certifications?: { name: string; issuer?: string; date?: string }[];
  projects?: { name: string; description: string; technologies: string[] }[];
  languages?: string[];
}

export interface GeneratedResume extends ParsedResume {
  targetRole: string;
  atsScore: number;
  optimizedSummary: string;
}
