import { searchAdzuna } from "./adzuna";
import { searchRapidAPI } from "./rapidapi";
import type { RawJob } from "@/types/job";

export async function searchJobs(query: string, location?: string): Promise<RawJob[]> {
  try {
    // location is a city/state filter (where), not the country code
    const jobs = await searchAdzuna(query, "us", 20, location);
    if (jobs.length > 0) return jobs;
    throw new Error("No results from Adzuna");
  } catch (err) {
    console.warn("[JOBS] Adzuna failed, falling back to RapidAPI:", err);
    // Include location in the RapidAPI query string for better results
    const rapidQuery = location ? `${query} in ${location}` : query;
    return searchRapidAPI(rapidQuery);
  }
}
