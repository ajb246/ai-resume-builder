export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchScore: number;
  missingSkills: string[];
  applyUrl: string;
  source: "adzuna" | "rapidapi";
}
