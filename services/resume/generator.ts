import { openai } from "@/lib/openai";
import type { ParsedResume } from "@/types/resume";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const GeneratedResumeSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      startDate: z.string(),
      endDate: z.string().nullable().optional(),
      current: z.boolean(),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().nullable().optional(),
      graduationDate: z.string().nullable().optional(),
    })
  ),
  certifications: z
    .array(z.object({ name: z.string(), issuer: z.string().nullable().optional() }))
    .nullable()
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
      })
    )
    .nullable()
    .optional(),
  atsKeywords: z.array(z.string()),
});

export type GeneratedResume = z.infer<typeof GeneratedResumeSchema>;

export async function generateOptimizedResume(
  parsedResume: ParsedResume,
  targetRole: string,
  conversationContext: string
): Promise<GeneratedResume> {
  const completion = await openai.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer specializing in ATS optimization.

RULES — NEVER BREAK:
- NEVER invent experience, degrees, certifications, or employers not in the original
- NEVER add fake metrics — only rewrite existing ones more specifically
- NEVER claim skills the user didn't demonstrate
- You MAY: rewrite bullets with stronger action verbs, improve phrasing,
  reorder for impact, add ATS keywords from the target role that match actual experience,
  write a compelling summary based on real experience, suggest quantified improvements
  (e.g., "Led team" → "Led team of X engineers" — only if X was mentioned in conversation)

TARGET ROLE: ${targetRole}

CONVERSATION CONTEXT (what the user told you during coaching):
${conversationContext}

OPTIMIZATION REQUIREMENTS:
- Open every bullet with a strong past-tense action verb
- Add measurable outcomes where the user confirmed them
- Front-load the most impressive information
- Mirror language from the target role's job descriptions
- Ensure the professional summary is compelling and role-targeted
- Sort skills by relevance to the target role`,
      },
      {
        role: "user",
        content: `Optimize this resume:\n\n${JSON.stringify(parsedResume, null, 2)}`,
      },
    ],
    response_format: zodResponseFormat(GeneratedResumeSchema, "resume"),
  });

  const result = completion.choices[0]?.message.parsed;
  if (!result) throw new Error("Generation failed — no parsed result");
  return result;
}
