import { openai } from "@/lib/openai";
import type { GeneratedResume } from "@/services/resume/generator";

export const generateCoverLetterTool = {
  name: "generateCoverLetter",
  description: "Generate a tailored cover letter for a specific job description",
  parameters: {
    type: "object" as const,
    properties: {
      resume: { type: "object", description: "The user's generated resume" },
      jobDescription: { type: "string", description: "The job description to tailor for" },
      companyName: { type: "string", description: "Name of the company (optional)" },
    },
    required: ["resume", "jobDescription"],
  },
  execute: async (args: {
    resume: GeneratedResume;
    jobDescription: string;
    companyName?: string;
  }): Promise<string> => {
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Write a professional, concise cover letter (3 paragraphs max).
RULES:
- Use ONLY information from the provided resume
- Never fabricate experience or achievements
- Tailor specifically to the job description
- Opening: hook + why this role
- Middle: 2–3 specific achievements relevant to the role
- Closing: call to action
- Tone: confident but not arrogant`,
        },
        {
          role: "user",
          content: `Resume:\n${JSON.stringify(args.resume)}\n\nJob Description:\n${args.jobDescription}\n\nCompany: ${args.companyName ?? "the company"}`,
        },
      ],
    });
    return res.choices[0]?.message.content ?? "";
  },
};
