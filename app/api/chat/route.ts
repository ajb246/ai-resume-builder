import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import type { ToolSet } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chatRateLimit, checkRateLimit } from "@/lib/ratelimit";
import { CAREER_COACH_SYSTEM_PROMPT } from "@/services/ai/prompts";
import { scoreResume } from "@/services/resume/scorer";
import { optimizeATSTool } from "@/mcp-tools/optimizeATS";
import { searchJobs } from "@/services/jobs";
import { generateCoverLetterTool } from "@/mcp-tools/generateCoverLetter";
import { generateOptimizedResume } from "@/services/resume/generator";
import type { GeneratedResume } from "@/services/resume/generator";
import type { ParsedResume } from "@/types/resume";
import { z } from "zod";
import { zodSchema } from "ai";

export const runtime = "edge";
export const maxDuration = 60;

const expSchema = z.object({
  company: z.string(),
  title: z.string(),
  startDate: z.string(),
  current: z.boolean(),
  bullets: z.array(z.string()),
  endDate: z.string().optional(),
});

const eduSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  graduationDate: z.string().optional(),
});

const generatedResumeSchema = z.object({
  name: z.string(),
  email: z.string(),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(expSchema),
  education: z.array(eduSchema),
  atsKeywords: z.array(z.string()).optional(),
});

const chatTools = {
  scoreResume: {
    description: "Score a generated resume 0–100 with ATS analysis and improvement suggestions",
    inputSchema: zodSchema(z.object({
      resume: generatedResumeSchema,
      targetRole: z.string(),
    })),
    execute: async (input: { resume: z.infer<typeof generatedResumeSchema>; targetRole: string }) =>
      scoreResume(input.resume as unknown as GeneratedResume, input.targetRole),
  },
  optimizeATS: {
    description: optimizeATSTool.description,
    inputSchema: zodSchema(z.object({
      resume: generatedResumeSchema,
      jobDescription: z.string(),
    })),
    execute: async (input: { resume: z.infer<typeof generatedResumeSchema>; jobDescription: string }) =>
      optimizeATSTool.execute({
        resume: input.resume as unknown as GeneratedResume,
        jobDescription: input.jobDescription,
      }),
  },
  searchJobs: {
    description: "Search for job listings by role title and optional location",
    inputSchema: zodSchema(z.object({
      query: z.string(),
      location: z.string().optional(),
    })),
    execute: async (input: { query: string; location?: string }) =>
      searchJobs(input.query, input.location),
  },
  generateCoverLetter: {
    description: generateCoverLetterTool.description,
    inputSchema: zodSchema(z.object({
      resume: generatedResumeSchema,
      jobDescription: z.string(),
      companyName: z.string().optional(),
    })),
    execute: async (input: {
      resume: z.infer<typeof generatedResumeSchema>;
      jobDescription: string;
      companyName?: string;
    }) =>
      generateCoverLetterTool.execute({
        resume: input.resume as unknown as GeneratedResume,
        jobDescription: input.jobDescription,
        ...(input.companyName ? { companyName: input.companyName } : {}),
      }),
  },
  generateResume: {
    description: "Generate an ATS-optimized resume from parsed data and a target role",
    inputSchema: zodSchema(z.object({
      parsedResume: z.object({
        name: z.string(),
        email: z.string(),
        skills: z.array(z.string()),
        experience: z.array(expSchema),
        education: z.array(eduSchema),
      }),
      targetRole: z.string(),
      conversationContext: z.string(),
    })),
    execute: async (input: {
      parsedResume: { name: string; email: string; skills: string[]; experience: unknown; education: unknown };
      targetRole: string;
      conversationContext: string;
    }) =>
      generateOptimizedResume(
        input.parsedResume as unknown as ParsedResume,
        input.targetRole,
        input.conversationContext
      ),
  },
} satisfies ToolSet;

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const identifier = clerkId ?? req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success, reset } = await checkRateLimit(chatRateLimit, identifier);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before sending another message." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(((reset ?? Date.now() + 60000) - Date.now()) / 1000)) } }
      );
    }

    const { messages, chatId, resumeId } = (await req.json()) as {
      messages: unknown[];
      chatId: string;
      resumeId?: string;
    };

    const result = streamText({
      model: openai("gpt-4o"),
      system: CAREER_COACH_SYSTEM_PROMPT,
      messages: await convertToModelMessages(
        messages as Parameters<typeof convertToModelMessages>[0]
      ),
      allowSystemInMessages: true,
      tools: chatTools,
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[CHAT]", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
