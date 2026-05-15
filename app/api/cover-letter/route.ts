import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateCoverLetterTool } from "@/mcp-tools/generateCoverLetter";
import type { GeneratedResume } from "@/services/resume/generator";
import { z } from "zod";

const schema = z.object({
  resume: z.record(z.string(), z.unknown()),
  jobDescription: z.string().min(1),
  companyName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const text = await generateCoverLetterTool.execute({
      resume: body.data.resume as unknown as GeneratedResume,
      jobDescription: body.data.jobDescription,
      ...(body.data.companyName ? { companyName: body.data.companyName } : {}),
    });

    return NextResponse.json({ data: text });
  } catch (error) {
    console.error("[COVER_LETTER]", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
