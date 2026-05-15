export interface RawJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  applyUrl: string;
  source: "adzuna" | "rapidapi";
}

export interface JobMatch extends RawJob {
  matchScore: number;
  missingSkills: string[];
  matchedSkills: string[];
}
