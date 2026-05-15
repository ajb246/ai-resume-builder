import { openai } from "@/lib/openai";
import type { ParsedResume } from "@/types/resume";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const ExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  bullets: z.array(z.string()),
});

const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  graduationDate: z.string().optional(),
  gpa: z.string().optional(),
});

const ParsedResumeSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
      })
    )
    .optional(),
  languages: z.array(z.string()).optional(),
});

export async function extractResumeData(rawText: string): Promise<ParsedResume> {
  const completion = await openai.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a resume parser. Extract structured data from the resume text.
Rules:
- Extract ONLY what is explicitly stated in the resume.
- Never infer, hallucinate, or add information not present.
- Normalize dates to "MMM YYYY" format (e.g., "Jan 2022").
- Split bullet points into individual strings.
- List skills as individual items (no commas within a skill item).`,
      },
      {
        role: "user",
        content: `Parse this resume:\n\n${rawText}`,
      },
    ],
    response_format: zodResponseFormat(ParsedResumeSchema, "resume"),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) throw new Error("Failed to parse resume data");
  return parsed as ParsedResume;
}
