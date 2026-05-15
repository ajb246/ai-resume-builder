import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { scoreResume } from "@/services/resume/scorer";
import type { GeneratedResume } from "@/services/resume/generator";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { resumeId } = (await req.json()) as { resumeId: string };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
    });

    if (!resume?.generatedResume) {
      return NextResponse.json({ error: "Generate resume first" }, { status: 400 });
    }

    const score = await scoreResume(
      resume.generatedResume as unknown as GeneratedResume,
      resume.targetRole ?? "software engineer"
    );

    await prisma.resume.update({
      where: { id: resume.id },
      data: { score: score.total },
    });

    return NextResponse.json({ data: score });
  } catch (error) {
    console.error("[SCORE]", error);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
