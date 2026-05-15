import { scoreResume } from "@/services/resume/scorer";
import type { GeneratedResume } from "@/services/resume/generator";

export const scoreResumeTool = {
  name: "scoreResume",
  description: "Score a generated resume 0–100 with ATS analysis and improvement suggestions",
  parameters: {
    type: "object" as const,
    properties: {
      resume: { type: "object", description: "The generated resume JSON" },
      targetRole: { type: "string", description: "The target job role" },
    },
    required: ["resume", "targetRole"],
  },
  execute: async (args: { resume: GeneratedResume; targetRole: string }) =>
    scoreResume(args.resume, args.targetRole),
};
