import { searchJobs } from "@/services/jobs";

export const searchJobsTool = {
  name: "searchJobs",
  description: "Search for job listings by role title and optional location",
  parameters: {
    type: "object" as const,
    properties: {
      query: { type: "string", description: "Job title or role to search for" },
      location: { type: "string", description: "Location filter (optional)" },
    },
    required: ["query"],
  },
  execute: async (args: { query: string; location?: string }) =>
    searchJobs(args.query, args.location),
};
