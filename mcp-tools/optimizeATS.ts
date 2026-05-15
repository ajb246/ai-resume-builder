import { openai } from "@/lib/openai";
import type { GeneratedResume } from "@/services/resume/generator";

export interface ATSOptimizationResult {
  missingKeywords: string[];
  presentKeywords: string[];
  optimizedBullets: Record<string, string>;
  atsScore: number;
}

export const optimizeATSTool = {
  name: "optimizeATS",
  description: "Analyze a resume against a job description and suggest ATS keyword optimizations",
  parameters: {
    type: "object" as const,
    properties: {
      resume: { type: "object", description: "The generated resume JSON" },
      jobDescription: { type: "string", description: "The target job description" },
    },
    required: ["resume", "jobDescription"],
  },
  execute: async (args: {
    resume: GeneratedResume;
    jobDescription: string;
  }): Promise<ATSOptimizationResult> => {
    const resumeText = [
      args.resume.summary,
      ...args.resume.skills,
      ...args.resume.experience.flatMap((e) => e.bullets),
    ].join(" ");

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Compare a resume against a job description and return JSON:
{
  "missingKeywords": string[],
  "presentKeywords": string[],
  "optimizedBullets": Record<string, string>,
  "atsScore": number (0-100)
}
missingKeywords: important terms in the JD missing from the resume.
presentKeywords: matching terms already present.
optimizedBullets: up to 3 bullet rewrites that add missing keywords naturally.
atsScore: estimated ATS pass-through percentage.`,
        },
        {
          role: "user",
          content: `Resume:\n${resumeText.slice(0, 2000)}\n\nJob Description:\n${args.jobDescription.slice(0, 2000)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    try {
      return JSON.parse(res.choices[0]?.message.content ?? "{}") as ATSOptimizationResult;
    } catch {
      return { missingKeywords: [], presentKeywords: [], optimizedBullets: {}, atsScore: 0 };
    }
  },
};
