import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  resumeId: z.string(),
  targetRole: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { id: body.data.resumeId, userId: user.id },
    });
    if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const resumeData = resume.generatedResume ?? resume.parsedJson;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a career coach specializing in skill gap analysis.
Analyze the gap between the user's current profile and their target role.
Provide:
1. Skills they already have that are relevant
2. Critical missing skills for the target role
3. Nice-to-have skills to develop
4. Specific resources or learning paths for each gap (free resources preferred)
5. Realistic timeline to close the gap
Be specific and actionable. Do not fabricate skills the user has.`,
        },
        {
          role: "user",
          content: `My resume:\n${JSON.stringify(resumeData, null, 2)}\n\nTarget role: ${body.data.targetRole}`,
        },
      ],
    });

    const analysis = response.choices[0]?.message.content ?? "";
    return NextResponse.json({ data: { analysis } });
  } catch (error) {
    console.error("[ANALYZE_GAP]", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
